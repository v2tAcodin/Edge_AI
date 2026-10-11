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
            this.particleStreams = [];
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

            // 1. Build Nodes
            rawNodes.forEach(nodeData => {
                const nodeGroup = new THREE.Group();
                nodeGroup.position.set(nodeData.x, nodeData.y, nodeData.z);

                const colorHex = parseInt(nodeData.color.replace("#", "0x"), 16);
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

                this.scene.add(nodeGroup);

                this.nodesMap[nodeData.id] = {
                    group: nodeGroup,
                    mesh: mesh,
                    halo: haloMesh,
                    data: nodeData,
                    position: new THREE.Vector3(nodeData.x, nodeData.y, nodeData.z)
                };
            });

            // 2. Build Glowing Branch Lines & Particle Streams
            rawNodes.forEach(nodeData => {
                if (nodeData.parent && this.nodesMap[nodeData.parent]) {
                    const parentNode = this.nodesMap[nodeData.parent];
                    this.createBranchLine(parentNode.position, this.nodesMap[nodeData.id].position, nodeData.color);
                }
            });
        }

        createBranchLine(startPos, endPos, hexColor) {
            if (!THREE.BufferGeometry || !THREE.Line) return;
            const points = [startPos, endPos];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({
                color: parseInt(hexColor.replace("#", "0x"), 16),
                transparent: true,
                opacity: 0.45
            });
            const line = new THREE.Line(lineGeo, lineMat);
            line.userData = { isBranch: true, baseOpacity: 0.45 };
            this.branchesGroup.add(line);
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
                    this.showTooltip(event.clientX, event.clientY, nodeItem.data);
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
            const intersects = this.raycaster.intersectObjects(interactiveMeshes);

            if (intersects.length > 0) {
                const hitMesh = intersects[0].object;
                const nodeItem = this.nodesMap[hitMesh.userData.id];
                if (nodeItem) {
                    this.handleNodeClick(nodeItem);
                }
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

            // If it's a project node, trigger project selection in PortfolioController
            const controller = root.PortfolioController || (typeof window !== 'undefined' ? window.PortfolioController : null);
            if (data && data.projectId && controller) {
                controller.selectProject(data.projectId);
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
            if (!tt) return;
            tt.innerHTML = `
                <div style="font-weight: 700; color: #00f0ff; margin-bottom: 4px;">${data.label || data.name}</div>
                <div style="font-size: 11px; color: #94a3b8;">${data.type === 'project' ? '🏆 Production Artifact • Click to Deep-Dive' : '🧠 Knowledge Branch'}</div>
            `;
            tt.style.left = `${x + 14}px`;
            tt.style.top = `${y - 14}px`;
            tt.style.display = "block";
        }

        hideTooltip() {
            const tt = document.getElementById("galaxy-node-tooltip");
            if (tt) tt.style.display = "none";
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

            // 1. Axial rotation for node halos
            Object.values(this.nodesMap).forEach(node => {
                if (node.halo && node.halo.rotation) {
                    node.halo.rotation.y += 0.008;
                    node.halo.rotation.x += 0.005;
                }
            });

            // 2. Starfield slow drift
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

            // Draw branches
            nodes.forEach(n => {
                const cx = w / 2 + n.x * 2.5;
                const cy = h / 2 - n.y * 2.2;
                ctx.beginPath();
                ctx.moveTo(w / 2, h / 2 + 80);
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
