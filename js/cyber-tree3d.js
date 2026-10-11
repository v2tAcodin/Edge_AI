/**
 * Project Thai: 3D Cybernetic Skill Tree & Constellation Scene
 * Three.js WebGL procedural tree of self-growth, glowing branches, energy particle streams,
 * dependency glow on hover, and cinematic fly-to project inspection.
 */

(function(root) {
    'use strict';

    class CyberTree3DClass {
        constructor() {
            this.container = null;
            this.canvas = null;
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.controls = null;
            this.raycaster = null;
            this.mouse = null;

            this.nodesMap = {}; // { id: { mesh, halo, data, position } }
            this.branchesGroup = null;
            this.halosList = [];
            this.particlesData = [];
            this.particlePositions = null;
            this.particleGeometry = null;
            this.particlePoints = null;
            this.starfield = null;
            this.hoveredNode = null;

            // Camera animation
            this.isCameraAnimating = false;
            this.targetCamPos = null;
            this.targetLookAt = null;
            this.defaultCamPos = { x: 0, y: 40, z: 140 };
            this.defaultLookAt = { x: 0, y: 30, z: 0 };

            this.autoOrbit = true;
            this.autoOrbitSpeed = 0.002;
            this.initialized = false;
            this.is2DFallback = false;
        }

        init() {
            if (this.initialized) return;
            
            if (typeof document === 'undefined') {
                return; // Server/headless guard
            }

            this.container = document.getElementById("galaxy-viewport-container");
            this.canvas = document.getElementById("galaxy-3d-canvas");

            // Check Three.js availability
            if (typeof THREE === "undefined") {
                console.warn("[CyberTree3D] THREE is not loaded, falling back to 2D canvas.");
                this.enable2DFallback();
                return;
            }

            try {
                this.setupScene();
                this.setupCameraAndRenderer();
                this.setupLights();
                this.buildStarfield();
                this.buildCyberneticTree();
                this.setupInteraction();
                this.setupControls();

                this.animate();
                this.initialized = true;
                console.log("[CyberTree3D] 3D Cybernetic Skill Tree initialized successfully at 60 FPS.");
            } catch (err) {
                console.error("[CyberTree3D] WebGL setup failed, activating 2D fallback:", err);
                this.enable2DFallback();
            }
        }

        setupScene() {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x030611);
            if (THREE.FogExp2) {
                this.scene.fog = new THREE.FogExp2(0x030611, 0.003);
            }
        }

        setupCameraAndRenderer() {
            const width = (this.container && this.container.clientWidth) ? this.container.clientWidth : (typeof window !== 'undefined' ? window.innerWidth : 1000);
            const height = (this.container && this.container.clientHeight) ? this.container.clientHeight : 700;

            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1200);
            this.camera.position.set(this.defaultCamPos.x, this.defaultCamPos.y, this.defaultCamPos.z);
            this.camera.lookAt(this.defaultLookAt.x, this.defaultLookAt.y, this.defaultLookAt.z);

            if (this.canvas) {
                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.canvas,
                    antialias: true,
                    powerPreference: "high-performance"
                });
                this.renderer.setSize(width, height);
                const pixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) ? Math.min(window.devicePixelRatio, 2) : 1;
                this.renderer.setPixelRatio(pixelRatio);
            }
        }

        setupLights() {
            const ambient = new THREE.AmbientLight(0xffffff, 0.85);
            this.scene.add(ambient);

            const coreLight = new THREE.PointLight(0x00f0ff, 2.5, 300);
            coreLight.position.set(0, 0, 0);
            this.scene.add(coreLight);

            const purpleLight = new THREE.PointLight(0xb026ff, 1.8, 250);
            purpleLight.position.set(60, 80, 50);
            this.scene.add(purpleLight);
        }

        buildStarfield() {
            if (!THREE.BufferGeometry || !THREE.Points) return;
            const starGeo = new THREE.BufferGeometry();
            const starCount = 600;
            const starCoords = new Float32Array(starCount * 3);

            for (let i = 0; i < starCount * 3; i += 3) {
                starCoords[i] = (Math.random() - 0.5) * 800;
                starCoords[i + 1] = (Math.random() - 0.5) * 600;
                starCoords[i + 2] = (Math.random() - 0.5) * 800;
            }

            starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
            const starMat = new THREE.PointsMaterial({
                color: 0x4fc3f7,
                size: 1.8,
                transparent: true,
                opacity: 0.65
            });

            this.starfield = new THREE.Points(starGeo, starMat);
            this.scene.add(this.starfield);
        }

        buildCyberneticTree() {
            const data = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null) || (typeof PortfolioData !== 'undefined' ? PortfolioData : null) || {};
            const rawNodes = data.skillTreeNodes || [];

            this.branchesGroup = new THREE.Group();
            this.scene.add(this.branchesGroup);
            this.halosList = [];
            this.particlesData = [];

            // 1. Build Nodes
            rawNodes.forEach(nodeData => {
                const nodeGroup = new THREE.Group();
                nodeGroup.position.set(nodeData.x, nodeData.y, nodeData.z);

                const colorHex = parseInt((nodeData.color || '#00f0ff').replace("#", "0x"), 16);
                const radius = nodeData.radius || 10;

                // Core Sphere
                const geom = new THREE.SphereGeometry(radius, 18, 18);
                const mat = new THREE.MeshStandardMaterial({
                    color: colorHex,
                    roughness: 0.2,
                    metalness: 0.6
                });
                const mesh = new THREE.Mesh(geom, mat);
                mesh.userData = { id: nodeData.id, data: nodeData };
                nodeGroup.add(mesh);

                // Atmosphere Halo Ring
                const haloGeom = new THREE.SphereGeometry(radius * 1.35, 14, 14);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: colorHex,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.25
                });
                const haloMesh = new THREE.Mesh(haloGeom, haloMat);
                nodeGroup.add(haloMesh);
                this.halosList.push(haloMesh);

                this.scene.add(nodeGroup);

                this.nodesMap[nodeData.id] = {
                    group: nodeGroup,
                    mesh: mesh,
                    halo: haloMesh,
                    data: nodeData,
                    position: new THREE.Vector3(nodeData.x, nodeData.y, nodeData.z)
                };
            });

            // Backward compatibility alias for trunk-core
            if (this.nodesMap['root-cpp'] && !this.nodesMap['trunk-core']) {
                this.nodesMap['trunk-core'] = this.nodesMap['root-cpp'];
            }

            // 2. Build Glowing Branch Lines & Particle Streams
            rawNodes.forEach(nodeData => {
                if (nodeData.parent && this.nodesMap[nodeData.parent]) {
                    const parentNode = this.nodesMap[nodeData.parent];
                    this.createBranchLine(parentNode.position, this.nodesMap[nodeData.id].position, nodeData.color);
                }
            });

            // 3. Initialize Particle Energy Streams (1-way pulse from parent to child)
            this.initParticleStreams();
        }

        createBranchLine(startPos, endPos, hexColor) {
            if (!THREE.BufferGeometry || !THREE.Line) return;
            const points = [startPos, endPos];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({
                color: parseInt((hexColor || '#00f0ff').replace("#", "0x"), 16),
                transparent: true,
                opacity: 0.45
            });
            const line = new THREE.Line(lineGeo, lineMat);
            line.userData = { isBranch: true, baseOpacity: 0.45 };
            this.branchesGroup.add(line);
        }

        initParticleStreams() {
            if (this.is2DFallback || typeof THREE === 'undefined' || !THREE.BufferGeometry || !THREE.Points) return;

            this.particlesData = [];
            const data = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null) || {};
            const rawNodes = data.skillTreeNodes || [];

            rawNodes.forEach(nodeData => {
                if (nodeData.parent && this.nodesMap[nodeData.parent]) {
                    const parentNode = this.nodesMap[nodeData.parent];
                    const childNode = this.nodesMap[nodeData.id];
                    const start = parentNode.position;
                    const end = childNode.position;
                    const hexColor = parseInt((nodeData.color || '#00f0ff').replace('#', '0x'), 16);
                    const r = ((hexColor >> 16) & 255) / 255;
                    const g = ((hexColor >> 8) & 255) / 255;
                    const b = (hexColor & 255) / 255;

                    // 6 flowing particles per branch segment
                    const particlesPerBranch = 6;
                    for (let j = 0; j < particlesPerBranch; j++) {
                        this.particlesData.push({
                            start: start,
                            end: end,
                            t: j / particlesPerBranch,
                            speed: 0.0035 + (j % 3) * 0.0012,
                            r: r,
                            g: g,
                            b: b
                        });
                    }
                }
            });

            const count = this.particlesData.length;
            if (count === 0) return;

            this.particlePositions = new Float32Array(count * 3);
            const particleColors = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const p = this.particlesData[i];
                const x = p.start.x + (p.end.x - p.start.x) * p.t;
                const y = p.start.y + (p.end.y - p.start.y) * p.t;
                const z = p.start.z + (p.end.z - p.start.z) * p.t;
                this.particlePositions[i * 3] = x;
                this.particlePositions[i * 3 + 1] = y;
                this.particlePositions[i * 3 + 2] = z;

                particleColors[i * 3] = p.r;
                particleColors[i * 3 + 1] = p.g;
                particleColors[i * 3 + 2] = p.b;
            }

            this.particleGeometry = new THREE.BufferGeometry();
            this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
            this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 3.5,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });

            this.particlePoints = new THREE.Points(this.particleGeometry, particleMaterial);
            this.scene.add(this.particlePoints);
        }

        setupInteraction() {
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2(-999, -999);

            if (!this.canvas) return;

            this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
            this.canvas.addEventListener("click", (e) => this.onClick(e));
            if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
                window.addEventListener("resize", () => this.onWindowResize());
            }
        }

        setupControls() {
            if (typeof THREE.OrbitControls !== "undefined" && this.renderer && this.camera) {
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.minDistance = 25;
                this.controls.maxDistance = 350;
                this.controls.target.set(this.defaultLookAt.x, this.defaultLookAt.y, this.defaultLookAt.z);
            }
        }

        onMouseMove(event) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            if (!this.raycaster || !this.camera) return;
            this.raycaster.setFromCamera(this.mouse, this.camera);

            const interactiveMeshes = Object.values(this.nodesMap).map(n => n.mesh);
            const intersects = this.raycaster.intersectObjects(interactiveMeshes);

            if (intersects.length > 0) {
                const hitMesh = intersects[0].object;
                const nodeKey = hitMesh.userData.id;
                const nodeItem = this.nodesMap[nodeKey];

                if (nodeItem && this.hoveredNode !== nodeItem) {
                    this.setHoveredNode(nodeItem);
                    this.canvas.style.cursor = "pointer";
                    const localX = event.clientX - rect.left;
                    const localY = event.clientY - rect.top;
                    this.showTooltip(localX, localY, nodeItem.data);
                }
            } else if (this.hoveredNode) {
                this.clearHoveredNode();
                this.canvas.style.cursor = "default";
                this.hideTooltip();
            }
        }

        onClick(event) {
            if (this.isCameraAnimating) return;
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            if (!this.raycaster || !this.camera) return;
            this.raycaster.setFromCamera(this.mouse, this.camera);

            const interactiveMeshes = Object.values(this.nodesMap).map(n => n.mesh);
            if (intersects.length > 0) {
                const hitMesh = intersects[0].object;
                const nodeItem = this.nodesMap[hitMesh.userData.id];
                if (nodeItem) {
                    this.handleNodeClick(nodeItem);
                }
            } else {
                // Click on empty canvas deselects active node, resets camera focus and closes inspector
                this.resetCameraFocus();
            }
        }

        setHoveredNode(nodeItem) {
            this.hoveredNode = nodeItem;
            if (!nodeItem) return;

            // Dependency Glow: Highlight node and parent linkages
            if (nodeItem.halo && nodeItem.halo.material) {
                nodeItem.halo.material.opacity = 0.85;
            }

            // Glow all branches connected to this node or its parent
            if (this.branchesGroup && this.branchesGroup.children) {
                this.branchesGroup.children.forEach(line => {
                    if (line.material) {
                        line.material.opacity = 0.85;
                    }
                });
            }
        }

        clearHoveredNode() {
            if (this.hoveredNode) {
                if (this.hoveredNode.halo && this.hoveredNode.halo.material) {
                    this.hoveredNode.halo.material.opacity = 0.25;
                }
            }
            if (this.branchesGroup && this.branchesGroup.children) {
                this.branchesGroup.children.forEach(line => {
                    if (line.material) {
                        line.material.opacity = line.userData.baseOpacity || 0.45;
                    }
                });
            }
            this.hoveredNode = null;
        }

        handleNodeClick(nodeItem) {
            if (!nodeItem) return;
            const data = nodeItem.data;

            // Trigger Fly-To Camera Animation
            if (nodeItem.position) {
                this.flyToNode(nodeItem.position);
            }

            // Display Orbit Node Inspector HUD
            this.showInspector(data);

            // Notify PortfolioController
            const controller = root.PortfolioController || (typeof window !== 'undefined' ? window.PortfolioController : null);
            if (data && data.projectId && controller) {
                controller.selectProject(data.projectId);
            }
        }

        selectNodeById(nodeId) {
            const nodeItem = this.nodesMap[nodeId];
            if (nodeItem) {
                this.handleNodeClick(nodeItem);
            }
        }

        showInspector(data) {
            if (typeof document === 'undefined') return;
            const inspectorEl = document.getElementById("galaxy-node-inspector");
            if (!inspectorEl) return;

            const portData = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null) || {};
            const allProjects = portData.projects || [];
            const project = data.projectId ? allProjects.find(p => p.id === data.projectId) : null;

            // 1. Badge & Type
            let badgeClass = "badge-root";
            let badgeText = "🏛️ GỐC RỄ NỀN TẢNG // ROOT CORE";
            if (data.type === 'branch') {
                badgeClass = "badge-branch";
                badgeText = "🌿 NHÁNH KỸ NĂNG // BRANCH";
            } else if (data.type === 'project') {
                badgeClass = "badge-project";
                badgeText = "🏆 ĐỒ ÁN THỰC CHIẾN // CAPSTONE";
            }

            // 2. Breadcrumb
            let breadcrumbHtml = `<span>🏛️ C/C++ Core</span>`;
            if (data.type === 'branch') {
                breadcrumbHtml += ` <span>&gt;</span> <span style="color: #00f0ff;">${data.label || data.name}</span>`;
            } else if (data.type === 'project') {
                const parentBranch = this.nodesMap[data.parent]?.data;
                const branchName = parentBranch ? (parentBranch.label || parentBranch.name) : 'Nhánh Chuyên Sâu';
                breadcrumbHtml += ` <span>&gt;</span> <span>${branchName}</span> <span>&gt;</span> <span style="color: #00ff88;">${data.label || data.name}</span>`;
            }

            // 3. Title & Summary
            const title = data.name || data.label;
            const domainSummaries = {
                'root-cpp': 'Nền tảng kiến trúc C/C++ phần cứng nhúng (ESP32-S3), quản lý bộ nhớ trần (Bare-metal SRAM/Flash/PSRAM), tối ưu hóa SIMD PIE và thời gian thực determinism điều phối FreeRTOS.',
                'branch-vision': 'Thị giác máy tính biên trên vi điều khiển, triển khai nén lượng tử hóa INT8 MobileNet/FOMO và pipeline camera DMA OV2640.',
                'branch-audio': 'Xử lý âm thanh số & Voice AI biên, trích xuất đặc trưng MFCC/Spectrogram và nhận dạng từ khóa wake-word micro-power.',
                'branch-hardware': 'Tối ưu hóa toán ma trận SIMD Xtensa PIE tăng tốc suy luận Tensor và giải thuật DSP thời gian thực.',
                'branch-iot': 'Hệ điều hành thời gian thực FreeRTOS, kiến trúc IPC đa tác vụ và truyền thông không dây giao thức bảo mật cao.'
            };
            const summary = project ? (project.summary || (project.architecture && project.architecture.solution)) : (data.summary || domainSummaries[data.id] || "Nền tảng kiến trúc nhúng, tối ưu bộ nhớ SRAM/Flash/PSRAM và thời gian thực determinism.");

            // 4. Skills / Tags
            const defaultSkills = (data.type === 'root')
                ? ["C/C++ Bare-Metal", "ESP-IDF", "FreeRTOS", "DMA Direct Access", "Xtensa PIE SIMD", "Memory Hygiene"]
                : (data.type === 'branch' ? ["Embedded AI", "Signal Processing", "Firmware Architecture", "Edge Optimization"] : []);
            const skills = project ? (project.tags || []) : (data.skills && data.skills.length ? data.skills : defaultSkills);
            const tagsHtml = skills.map(s => `<span class="inspector-tag">${s}</span>`).join('');

            // 5. Child Nodes (if root or branch)
            let childNodesHtml = '';
            let childNodes = Object.values(this.nodesMap)
                .filter(n => n.data && n.data.parent === data.id)
                .map(n => n.data);

            if (childNodes.length === 0 && portData.skillTreeNodes) {
                childNodes = portData.skillTreeNodes.filter(n => n.parent === data.id);
            }

            if (childNodes.length > 0) {
                childNodesHtml = `
                    <div class="inspector-section-label" style="margin-top: 10px;">🔗 LIÊN KẾT TRỰC THUỘC (${childNodes.length})</div>
                    <div class="inspector-children-list">
                        ${childNodes.map(c => `
                            <div class="inspector-child-item" onclick="cyberTree3D.selectNodeById('${c.id}')">
                                <div class="inspector-child-dot" style="background: ${c.color || '#00f0ff'}; color: ${c.color || '#00f0ff'};"></div>
                                <div class="inspector-child-info">
                                    <div class="inspector-child-name">${c.label || c.name}</div>
                                    <div class="inspector-child-type">${c.type === 'project' ? '🏆 Đồ Án Thực Chiến' : '🌿 Nhánh Kỹ Năng'}</div>
                                </div>
                                <button type="button" class="inspector-child-jump-btn">Bay tới 🎯</button>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            // 6. Project Metrics & Actions
            let metricsHtml = '';
            let actionsHtml = '';

            if (project) {
                metricsHtml = `
                    <div class="inspector-section-label" style="margin-top: 10px;">📊 THÔNG SỐ VẬN HÀNH (BENCHMARKS)</div>
                    <div class="inspector-benchmarks-grid">
                        <div class="inspector-bench-card">
                            <span class="bench-label">TRẠNG THÁI</span>
                            <span class="bench-val" style="color: ${project.badgeColor || '#00ff88'};">${project.status || 'Completed'}</span>
                        </div>
                        <div class="inspector-bench-card">
                            <span class="bench-label">CHUYÊN NGÀNH</span>
                            <span class="bench-val">${project.category?.toUpperCase() || 'EDGE AI'}</span>
                        </div>
                        ${project.benchmarks?.latency ? `
                            <div class="inspector-bench-card">
                                <span class="bench-label">LATENCY</span>
                                <span class="bench-val" style="color: #00f0ff;">${project.benchmarks.latency}</span>
                            </div>
                        ` : ''}
                        ${project.benchmarks?.sramFootprint ? `
                            <div class="inspector-bench-card">
                                <span class="bench-label">SRAM</span>
                                <span class="bench-val" style="color: #ffd700;">${project.benchmarks.sramFootprint}</span>
                            </div>
                        ` : ''}
                    </div>
                `;

                actionsHtml = `
                    <div class="inspector-actions">
                        <button type="button" class="inspector-btn-launch" onclick="PortfolioHUD ? PortfolioHUD.open('${project.id}') : (PortfolioController && PortfolioController.selectProject('${project.id}'))">
                            ⚡ Mở Deep-Dive HUD &amp; UART Console
                        </button>
                        <button type="button" class="inspector-btn-grid" onclick="PortfolioController && PortfolioController.switchView('grid')">
                            📋 Xem trong Lưới Đồ Án (Grid View)
                        </button>
                    </div>
                `;
            } else if (data.type === 'branch') {
                actionsHtml = `
                    <div class="inspector-actions">
                        <button type="button" class="inspector-btn-launch" onclick="PortfolioController ? (PortfolioController.switchView('grid'), PortfolioController.filterCategory('${data.category || 'all'}')) : null">
                            📋 Lọc Đồ Án Nhánh Này trên Grid View
                        </button>
                        ${data.parent ? `
                            <button type="button" class="inspector-btn-grid" onclick="cyberTree3D.selectNodeById('${data.parent}')">
                                ⬆️ Về Gốc Rễ Nền Tảng (C/C++ Core)
                            </button>
                        ` : ''}
                    </div>
                `;
            } else {
                // Root Core Node
                actionsHtml = `
                    <div class="inspector-actions">
                        <button type="button" class="inspector-btn-grid" onclick="PortfolioController ? (PortfolioController.switchView('grid'), PortfolioController.filterCategory('all')) : null">
                            📋 Xem Toàn Bộ Đồ Án trên Lưới (Grid View)
                        </button>
                    </div>
                `;
            }

            inspectorEl.innerHTML = `
                <div class="inspector-header">
                    <span class="inspector-badge ${badgeClass}">${badgeText}</span>
                    <button type="button" class="inspector-close-btn" onclick="cyberTree3D.hideInspector()" title="Đóng bảng thanh tra">✕</button>
                </div>
                <div class="inspector-breadcrumb">${breadcrumbHtml}</div>
                <h3 class="inspector-title" style="color: ${data.color || '#00f0ff'};">${title}</h3>
                <div class="inspector-summary">${summary}</div>
                ${tagsHtml ? `
                    <div class="inspector-section-label">🛠️ KỸ NĂNG &amp; CÔNG NGHỆ CỐT LÕI</div>
                    <div class="inspector-tags">${tagsHtml}</div>
                ` : ''}
                ${metricsHtml}
                ${childNodesHtml}
                ${actionsHtml}
            `;

            if (inspectorEl.style) {
                inspectorEl.style.display = "flex";
            }
        }

        hideInspector() {
            if (typeof document === 'undefined') return;
            const inspectorEl = document.getElementById("galaxy-node-inspector");
            if (inspectorEl && inspectorEl.style) {
                inspectorEl.style.display = "none";
            }
        }

        flyToNode(targetPos) {
            this.targetLookAt = targetPos.clone();
            this.targetCamPos = new THREE.Vector3(
                targetPos.x,
                targetPos.y + 10,
                targetPos.z + 40
            );
            this.isCameraAnimating = true;
        }

        resetCameraFocus() {
            this.targetLookAt = new THREE.Vector3(this.defaultLookAt.x, this.defaultLookAt.y, this.defaultLookAt.z);
            this.targetCamPos = new THREE.Vector3(this.defaultCamPos.x, this.defaultCamPos.y, this.defaultCamPos.z);
            this.isCameraAnimating = true;
            this.hideInspector();
        }

        toggleAutoOrbit() {
            this.autoOrbit = !this.autoOrbit;
            const btn = document.getElementById("btn-toggle-orbit");
            if (btn && btn.classList) {
                btn.classList.toggle("active", this.autoOrbit);
                btn.innerText = this.autoOrbit ? "🌀 Auto-Orbit: ON" : "⏸ Auto-Orbit: OFF";
            }
            return this.autoOrbit;
        }

        showTooltip(x, y, data) {
            const tt = document.getElementById("galaxy-node-tooltip");
            if (!tt || !tt.style) return;
            const badgeText = data.type === 'project' 
                ? '🏆 Đồ Án Sản Xuất' 
                : (data.type === 'branch' ? '🌿 Nhánh Kỹ Năng' : '🏛️ Gốc Rễ Nền Tảng');

            tt.innerHTML = `
                <div style="font-weight: 700; color: #00f0ff; margin-bottom: 2px; font-size: 11px;">${data.label || data.name}</div>
                <div style="font-size: 10px; color: #94a3b8; display: flex; align-items: center; gap: 4px;">
                    <span>${badgeText}</span>
                    <span style="color: #64748b;">•</span>
                    <span style="color: #38bdf8;">Nhấp để thanh tra</span>
                </div>
            `;
            // Safe bound clamping
            const containerW = this.container?.clientWidth || 800;
            const containerH = this.container?.clientHeight || 600;
            const clampedX = Math.max(10, Math.min(x + 14, containerW - 220));
            const clampedY = Math.max(10, Math.min(y + 14, containerH - 60));
            tt.style.left = `${clampedX}px`;
            tt.style.top = `${clampedY}px`;
            tt.style.display = "flex";
        }

        hideTooltip() {
            const tt = document.getElementById("galaxy-node-tooltip");
            if (tt && tt.style) tt.style.display = "none";
        }

        onWindowResize() {
            if (!this.container || !this.camera || !this.renderer) return;
            const width = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1000);
            const height = this.container.clientHeight || 700;

            this.camera.aspect = width / height;
            if (this.camera.updateProjectionMatrix) {
                this.camera.updateProjectionMatrix();
            }
            this.renderer.setSize(width, height);
        }

        animate() {
            if (typeof requestAnimationFrame === 'undefined') return;
            requestAnimationFrame(() => this.animate());

            // 1. Axial rotation for node halos (using cached halosList for zero allocation)
            if (this.halosList && this.halosList.length > 0) {
                for (let i = 0; i < this.halosList.length; i++) {
                    const halo = this.halosList[i];
                    if (halo && halo.rotation) {
                        halo.rotation.y += 0.008;
                        halo.rotation.x += 0.005;
                    }
                }
            }

            // 2. Animate 1-way particle energy streams along branches
            if (!this.is2DFallback && this.particleGeometry && this.particlesData && this.particlePositions) {
                const count = this.particlesData.length;
                for (let i = 0; i < count; i++) {
                    const p = this.particlesData[i];
                    p.t += p.speed;
                    if (p.t > 1.0) p.t = 0.0;
                    this.particlePositions[i * 3] = p.start.x + (p.end.x - p.start.x) * p.t;
                    this.particlePositions[i * 3 + 1] = p.start.y + (p.end.y - p.start.y) * p.t;
                    this.particlePositions[i * 3 + 2] = p.start.z + (p.end.z - p.start.z) * p.t;
                }
                if (this.particleGeometry.attributes && this.particleGeometry.attributes.position) {
                    this.particleGeometry.attributes.position.needsUpdate = true;
                }
            }

            // 3. Starfield slow drift
            if (this.starfield && this.starfield.rotation) {
                this.starfield.rotation.y += 0.0003;
            }

            // 3. Smooth Camera Fly-To Lerp
            if (this.isCameraAnimating && this.targetCamPos && this.targetLookAt) {
                this.camera.position.lerp(this.targetCamPos, 0.06);
                if (this.controls) {
                    this.controls.target.lerp(this.targetLookAt, 0.06);
                } else {
                    this.camera.lookAt(this.targetLookAt);
                }

                if (this.camera.position.distanceTo(this.targetCamPos) < 1.0) {
                    this.isCameraAnimating = false;
                }
            } else if (this.autoOrbit && !this.hoveredNode && this.controls && this.scene && this.scene.rotation) {
                // Auto Orbit when idle
                this.scene.rotation.y += this.autoOrbitSpeed;
            }

            if (this.controls && this.controls.update) {
                this.controls.update();
            }

            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        }

        enable2DFallback() {
            this.is2DFallback = true;
            if (typeof document === 'undefined') return;
            
            const fallbackContainer = document.getElementById("galaxy-2d-fallback");
            const fallbackCanvas = document.getElementById("galaxy-2d-canvas");
            if (fallbackContainer) fallbackContainer.style.display = "block";
            if (!fallbackCanvas) return;

            const ctx = fallbackCanvas.getContext("2d");
            if (!ctx) return;

            const w = fallbackCanvas.width || 800;
            const h = fallbackCanvas.height || 600;
            ctx.clearRect(0, 0, w, h);

            // Draw Cybernetic Tree 2D diagram
            ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
            ctx.lineWidth = 2;

            const data = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null) || (typeof PortfolioData !== 'undefined' ? PortfolioData : null) || {};
            const nodes = data.skillTreeNodes || [];

            // Draw hierarchical branches
            nodes.forEach(n => {
                const cx = w / 2 + n.x * 2.5;
                const cy = h / 2 - n.y * 2.2;
                let parentX = w / 2;
                let parentY = h / 2 + 100;
                if (n.parent) {
                    const p = nodes.find(item => item.id === n.parent);
                    if (p) {
                        parentX = w / 2 + p.x * 2.5;
                        parentY = h / 2 - p.y * 2.2;
                    }
                }
                ctx.beginPath();
                ctx.moveTo(parentX, parentY);
                ctx.lineTo(cx, cy);
                ctx.stroke();
            });

            // Draw nodes
            nodes.forEach(n => {
                const cx = w / 2 + n.x * 2.5;
                const cy = h / 2 - n.y * 2.2;
                ctx.beginPath();
                ctx.arc(cx, cy, (n.radius || 10) * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = n.color || "#00f0ff";
                ctx.fill();

                ctx.fillStyle = "#ffffff";
                ctx.font = "11px Inter, sans-serif";
                ctx.fillText(n.label || n.name, cx + 12, cy + 4);
            });
        }
    }

    const cyberTree3D = new CyberTree3DClass();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CyberTree3DClass;
    }
    if (typeof window !== 'undefined') {
        window.CyberTree3D = CyberTree3DClass;
        window.cyberTree3D = cyberTree3D;
        window.skillGalaxy3D = cyberTree3D; // Backward compatibility alias
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
