/**
 * Project Thai: 3D Cybernetic Skill Tree & Constellation Scene
 * Three.js WebGL procedural tree of self-growth, wave dynamics, glowing branches,
 * quadratic Bezier particle energy streams, electromagnetic pulse rings, and scientific data visualization.
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

            this.nodesMap = {}; // { id: { group, mesh, halo, data, position } }
            this.branchesGroup = null;
            this.halosList = [];
            this.orbitalRings = []; // Torus orbital rings rotating around nodes

            // Energy Wave Field (Harmonic oscillation surface)
            this.waveGeometry = null;
            this.waveMesh = null;
            this.waveOverlayMesh = null;

            // Electromagnetic Pulse Rings (Coherent dipole radiation from root)
            this.pulseRings = [];

            // Volumetric Nebula Clouds (Procedural cosmic dust sprites)
            this.nebulaClouds = [];

            // Multi-layered Starfield with Parallax and Twinkling
            this.starfieldsGroup = null;
            this.starfield = null; // Backwards compatibility reference
            this.starfieldFar = null;
            this.starfieldMid = null;
            this.starfieldNear = null;

            // Particle Stream System (Quadratic Bezier path traversal)
            this.particlesData = [];
            this.particlePositions = null;
            this.particleGeometry = null;
            this.particlePoints = null;

            this.hoveredNode = null;

            // Camera animation & fly-to controls
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
                this.buildWaveField();
                this.buildPulseRings();
                this.buildNebulaClouds();
                this.buildCyberneticTree();
                this.setupInteraction();
                this.setupControls();

                this.animate();
                this.initialized = true;
                console.log("[CyberTree3D] 3D Cybernetic Skill Tree with Wave Dynamics initialized at 60 FPS.");
            } catch (err) {
                console.error("[CyberTree3D] WebGL setup failed, activating 2D fallback:", err);
                this.enable2DFallback();
            }
        }

        setupScene() {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x030611);
            if (THREE.FogExp2) {
                this.scene.fog = new THREE.FogExp2(0x030611, 0.0028);
            }
        }

        setupCameraAndRenderer() {
            const width = (this.container && this.container.clientWidth) ? this.container.clientWidth : (typeof window !== 'undefined' ? window.innerWidth : 1000);
            const height = (this.container && this.container.clientHeight) ? this.container.clientHeight : 700;

            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1400);
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

            // Core electric cyan luminary
            const coreLight = new THREE.PointLight(0x00f0ff, 2.5, 320);
            coreLight.position.set(0, 0, 0);
            this.scene.add(coreLight);

            // Deep violet ambient point light for chromatic depth
            const purpleLight = new THREE.PointLight(0xb026ff, 1.8, 280);
            purpleLight.position.set(60, 80, 50);
            this.scene.add(purpleLight);

            // Warm golden foundation glow
            const rootLight = new THREE.PointLight(0xffd700, 1.4, 200);
            rootLight.position.set(0, -45, 0);
            this.scene.add(rootLight);
        }

        /**
         * Enhanced Multi-layered Cosmic Starfield
         * Scientific principle: Astrometric parallax & atmospheric scintillation simulation
         * Layer 1 (Far): Dense micro-stars establishing astronomical depth
         * Layer 2 (Mid): Medium stars with harmonic sinusoidal luminosity pulsation (twinkling)
         * Layer 3 (Near): Bright high-magnitude cosmic beacons
         */
        buildStarfield() {
            if (!THREE.BufferGeometry || !THREE.Points) return;

            this.starfieldsGroup = new THREE.Group ? new THREE.Group() : null;

            // Helper to generate star sphere coordinate buffer
            const generateStars = (count, minRadius, maxRadius) => {
                const coords = new Float32Array(count * 3);
                for (let i = 0; i < count * 3; i += 3) {
                    const u = Math.random();
                    const v = Math.random();
                    const theta = u * 2.0 * Math.PI;
                    const phi = Math.acos(2.0 * v - 1.0);
                    const r = minRadius + Math.random() * (maxRadius - minRadius);
                    coords[i] = r * Math.sin(phi) * Math.cos(theta);
                    coords[i + 1] = r * Math.sin(phi) * Math.sin(theta);
                    coords[i + 2] = r * Math.cos(phi);
                }
                const geom = new THREE.BufferGeometry();
                geom.setAttribute('position', new THREE.BufferAttribute(coords, 3));
                return geom;
            };

            // Layer 1: Far Starfield (800 stars)
            const farGeo = generateStars(800, 500, 850);
            const farMat = new THREE.PointsMaterial({
                color: 0x38bdf8,
                size: 0.9,
                transparent: true,
                opacity: 0.45
            });
            this.starfieldFar = new THREE.Points(farGeo, farMat);

            // Layer 2: Mid Starfield (400 stars with dynamic twinkle)
            const midGeo = generateStars(400, 300, 500);
            const midMat = new THREE.PointsMaterial({
                color: 0x4fc3f7,
                size: 1.8,
                transparent: true,
                opacity: 0.65
            });
            this.starfieldMid = new THREE.Points(midGeo, midMat);

            // Layer 3: Near Starfield (120 high-magnitude stars)
            const nearGeo = generateStars(120, 150, 300);
            const nearMat = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 3.2,
                transparent: true,
                opacity: 0.85
            });
            this.starfieldNear = new THREE.Points(nearGeo, nearMat);

            if (this.starfieldsGroup) {
                this.starfieldsGroup.add(this.starfieldFar);
                this.starfieldsGroup.add(this.starfieldMid);
                this.starfieldsGroup.add(this.starfieldNear);
                this.scene.add(this.starfieldsGroup);
            } else {
                this.scene.add(this.starfieldFar);
                this.scene.add(this.starfieldMid);
                this.scene.add(this.starfieldNear);
            }

            // Backwards compatibility assignment
            this.starfield = this.starfieldMid || this.starfieldFar;
        }

        /**
         * 1. Energy Wave Field (Harmonic Knowledge Substrate)
         * Scientific principle: Superposition of 2D sinusoidal travelling waves:
         * z(x,y,t) = A1*sin(k1*x + w1*t) + A2*sin(k2*y + w2*t) + A3*sin(k3*(x+y) + w3*t)
         * Generates constructive/destructive quantum ripple patterns under the tree root.
         */
        buildWaveField() {
            if (!THREE.PlaneGeometry || !THREE.Mesh) return;

            const size = 420;
            const segments = 64; // Optimized for 60fps performance budget
            this.waveGeometry = new THREE.PlaneGeometry(size, size, segments, segments);

            // Wireframe mesh showing the topological mesh grid lines (Tron / Matrix aesthetic)
            const waveWireMat = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                wireframe: true,
                transparent: true,
                opacity: 0.16
            });
            this.waveMesh = new THREE.Mesh(this.waveGeometry, waveWireMat);
            this.waveMesh.rotation.x = -Math.PI / 2; // Lie horizontally in X-Z plane
            this.waveMesh.position.set(0, -65, 0); // Beneath root-cpp (y = -45)
            this.scene.add(this.waveMesh);
        }

        /**
         * 2. Electromagnetic Pulse Rings
         * Scientific principle: Periodic isotropic radiation rings originating from the central
         * micro-kernel core (root-cpp), simulating radial packet transmission and clock cycle ticks.
         */
        buildPulseRings() {
            if (!THREE.RingGeometry || !THREE.Mesh) return;

            this.pulseRings = [];
            const ringCount = 4;
            for (let i = 0; i < ringCount; i++) {
                // Slender ring geometry
                const ringGeom = new THREE.RingGeometry(1.5, 3.2, 64);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: 0xffd700, // Gold harmonized with root-cpp
                    transparent: true,
                    opacity: 0.6,
                    side: (THREE.DoubleSide !== undefined ? THREE.DoubleSide : 2)
                });
                const ring = new THREE.Mesh(ringGeom, ringMat);
                ring.rotation.x = -Math.PI / 2; // Horizontal orientation
                ring.position.set(0, -44, 0); // Positioned at root node elevation
                ring.userData = {
                    progress: i * (1.0 / ringCount),
                    speed: 0.0032
                };
                this.scene.add(ring);
                this.pulseRings.push(ring);
            }
        }

        /**
         * 5. Nebula Volumetric Glow
         * Scientific principle: Interstellar medium (ISM) light scattering & emission nebula glow.
         * Creates soft procedural radial density clouds using additive blending.
         */
        buildNebulaClouds() {
            if (!THREE.CanvasTexture || !THREE.SpriteMaterial || !THREE.Sprite || typeof document === 'undefined') return;

            this.nebulaClouds = [];
            const cosmicPalettes = [
                'rgba(14, 165, 233, 0.14)',  // Celestial Cyan
                'rgba(168, 85, 247, 0.12)',  // Quantum Purple
                'rgba(0, 240, 255, 0.12)',   // Electric Neon
                'rgba(16, 185, 129, 0.10)',  // Deep Emerald
                'rgba(245, 158, 11, 0.09)'   // Stellar Amber
            ];

            try {
                for (let i = 0; i < cosmicPalettes.length; i++) {
                    const canvas = document.createElement('canvas');
                    canvas.width = 128;
                    canvas.height = 128;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) continue;

                    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
                    grad.addColorStop(0, cosmicPalettes[i]);
                    grad.addColorStop(0.55, cosmicPalettes[i].replace(/[\d\.]+\)$/, '0.04)'));
                    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, 128, 128);

                    const texture = new THREE.CanvasTexture(canvas);
                    const spriteMat = new THREE.SpriteMaterial({
                        map: texture,
                        transparent: true,
                        opacity: 0.32,
                        blending: (THREE.AdditiveBlending !== undefined ? THREE.AdditiveBlending : 2)
                    });
                    const sprite = new THREE.Sprite(spriteMat);
                    sprite.position.set(
                        (Math.random() - 0.5) * 220,
                        (Math.random() - 0.5) * 110 + 20,
                        (Math.random() - 0.5) * 220
                    );
                    const scale = 140 + Math.random() * 80;
                    sprite.scale.set(scale, scale, 1);
                    this.scene.add(sprite);
                    this.nebulaClouds.push(sprite);
                }
            } catch (err) {
                console.warn("[CyberTree3D] Nebula sprite generation skipped:", err);
            }
        }

        buildCyberneticTree() {
            const data = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null) || (typeof PortfolioData !== 'undefined' ? PortfolioData : null) || {};
            const rawNodes = data.skillTreeNodes || [];

            this.branchesGroup = new THREE.Group ? new THREE.Group() : { children: [], add: () => {} };
            if (this.branchesGroup && this.scene && this.scene.add) {
                this.scene.add(this.branchesGroup);
            }
            this.halosList = [];
            this.orbitalRings = [];
            this.particlesData = [];

            // 1. Build Nodes (Spheres, Wireframe Halos & Orbital Torus Rings)
            rawNodes.forEach(nodeData => {
                const nodeGroup = new THREE.Group ? new THREE.Group() : new THREE.Object3D();
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

                // Atmosphere Wireframe Halo
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

                // 4. Orbital Rings around Branch and Project Nodes
                if (THREE.TorusGeometry && (nodeData.type === 'branch' || nodeData.type === 'project')) {
                    const ringRadius = radius * 1.75;
                    const tubeRadius = 0.22;
                    const orbitGeom = new THREE.TorusGeometry(ringRadius, tubeRadius, 8, 36);
                    const orbitMat = new THREE.MeshBasicMaterial({
                        color: colorHex,
                        transparent: true,
                        opacity: 0.32
                    });
                    const orbitRing = new THREE.Mesh(orbitGeom, orbitMat);
                    orbitRing.rotation.x = Math.random() * Math.PI;
                    orbitRing.rotation.y = Math.random() * Math.PI;
                    orbitRing.userData = {
                        rotSpeedX: 0.007 + Math.random() * 0.006,
                        rotSpeedZ: 0.012 + Math.random() * 0.008
                    };
                    nodeGroup.add(orbitRing);
                    this.orbitalRings.push(orbitRing);
                }

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

            // 2. Build Glowing Branch Lines
            rawNodes.forEach(nodeData => {
                if (nodeData.parent && this.nodesMap[nodeData.parent]) {
                    const parentNode = this.nodesMap[nodeData.parent];
                    this.createBranchLine(parentNode.position, this.nodesMap[nodeData.id].position, nodeData.color);
                }
            });

            // 3. Initialize Particle Energy Streams with Quadratic Bezier Curves
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
            if (this.branchesGroup && this.branchesGroup.add) {
                this.branchesGroup.add(line);
            }
        }

        /**
         * 3. Enhanced Particle Energy Streams
         * Scientific principle: Curvilinear trajectory interpolation using Quadratic Bezier Curve:
         * B(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
         * P1 acts as a gravitational arc apex, mimicking flux lines in an electrostatic vector field.
         */
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

                    // Compute Quadratic Bezier apex control point with upward arc
                    const mid = new THREE.Vector3(
                        (start.x + end.x) * 0.5 + (Math.random() - 0.5) * 14,
                        (start.y + end.y) * 0.5 + 12 + Math.random() * 8, // Upward gravity lift
                        (start.z + end.z) * 0.5 + (Math.random() - 0.5) * 14
                    );

                    const hexColor = parseInt((nodeData.color || '#00f0ff').replace('#', '0x'), 16);
                    const r = ((hexColor >> 16) & 255) / 255;
                    const g = ((hexColor >> 8) & 255) / 255;
                    const b = (hexColor & 255) / 255;

                    // 12 particles per branch segment for rich cosmic density
                    const particlesPerBranch = 12;
                    for (let j = 0; j < particlesPerBranch; j++) {
                        this.particlesData.push({
                            start: start,
                            mid: mid,
                            end: end,
                            t: j / particlesPerBranch,
                            speed: 0.0035 + (j % 4) * 0.0011,
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
                const t = p.t;
                const omt = 1.0 - t;
                const c0 = omt * omt;
                const c1 = 2 * omt * t;
                const c2 = t * t;

                this.particlePositions[i * 3] = c0 * p.start.x + c1 * p.mid.x + c2 * p.end.x;
                this.particlePositions[i * 3 + 1] = c0 * p.start.y + c1 * p.mid.y + c2 * p.end.y;
                this.particlePositions[i * 3 + 2] = c0 * p.start.z + c1 * p.mid.z + c2 * p.end.z;

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
                opacity: 0.88,
                blending: (THREE.AdditiveBlending !== undefined ? THREE.AdditiveBlending : 2)
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
                this.controls.maxDistance = 380;
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
            // BUG FIX: Ensure intersects is declared and calculated via raycaster
            const intersects = this.raycaster.intersectObjects(interactiveMeshes);

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

            // Dependency Glow: Highlight node halo
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

        /**
         * 7. Scientific Data Visualization Mode in Tooltip
         * Generates a dynamic chromatic spectral radar / competency wheel based on node skills vector.
         */
        showTooltip(x, y, data) {
            const tt = document.getElementById("galaxy-node-tooltip");
            if (!tt || !tt.style) return;
            const badgeText = data.type === 'project' 
                ? '🏆 Đồ Án Sản Xuất' 
                : (data.type === 'branch' ? '🌿 Nhánh Kỹ Năng' : '🏛️ Gốc Rễ Nền Tảng');

            // Scientific mini spectral wheel
            const skills = data.skills || [];
            let radarHtml = '';
            if (skills.length > 0) {
                const gradStops = skills.map((s, idx) => {
                    const startDeg = Math.round((360 / skills.length) * idx);
                    const endDeg = Math.round((360 / skills.length) * (idx + 1));
                    const hue = 160 + idx * 36;
                    return `hsl(${hue}, 88%, 56%) ${startDeg}deg ${endDeg}deg`;
                }).join(', ');

                radarHtml = `
                    <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 8px;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: conic-gradient(${gradStops}); border: 1px solid rgba(0, 240, 255, 0.45); box-shadow: 0 0 8px rgba(0,240,255,0.3); flex-shrink: 0;" title="Scientific Skill Radar Wheel"></div>
                        <div style="font-size: 9px; color: #94a3b8; line-height: 1.2;">
                            <span style="color: #00f0ff; font-weight: 700; letter-spacing: 0.5px;">SPECTRUM // ${skills.length}D</span><br/>
                            <span>Vector Matrix Analysis</span>
                        </div>
                    </div>
                `;
            }

            tt.innerHTML = `
                <div style="font-weight: 700; color: #00f0ff; margin-bottom: 2px; font-size: 11px;">${data.label || data.name}</div>
                <div style="font-size: 10px; color: #94a3b8; display: flex; align-items: center; gap: 4px;">
                    <span>${badgeText}</span>
                    <span style="color: #64748b;">•</span>
                    <span style="color: #38bdf8;">Nhấp để thanh tra</span>
                </div>
                ${radarHtml}
            `;
            // Safe bound clamping
            const containerW = this.container?.clientWidth || 800;
            const containerH = this.container?.clientHeight || 600;
            const clampedX = Math.max(10, Math.min(x + 14, containerW - 220));
            const clampedY = Math.max(10, Math.min(y + 14, containerH - 75));
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

        /**
         * Comprehensive 60 FPS Render & Physics Simulation Loop
         * Simulates:
         * 1. Axial rotation for node wireframe halos
         * 2. Orbital Torus rings rotation
         * 3. Harmonic node breathing (sinusoidal scaling)
         * 4. Wave Field Surface vertex displacement (Superposition of 3 traveling harmonic waves)
         * 5. Electromagnetic pulse ring expansion & radiative attenuation
         * 6. Volumetric nebula clouds slow spatial drift
         * 7. Quadratic Bezier particle flow streams with size pulsation
         * 8. Astrometric parallax starfield drift & stellar scintillation
         * 9. Cinematic camera lerp & automatic orbit
         */
        animate() {
            if (typeof requestAnimationFrame === 'undefined') return;
            requestAnimationFrame(() => this.animate());

            const time = (typeof performance !== 'undefined' && performance.now) ? performance.now() * 0.001 : Date.now() * 0.001;

            // 1. Axial rotation for node halos
            if (this.halosList && this.halosList.length > 0) {
                for (let i = 0; i < this.halosList.length; i++) {
                    const halo = this.halosList[i];
                    if (halo && halo.rotation) {
                        halo.rotation.y += 0.008;
                        halo.rotation.x += 0.005;
                    }
                }
            }

            // 2. Orbital Torus rings dynamic axial spinning
            if (this.orbitalRings && this.orbitalRings.length > 0) {
                for (let i = 0; i < this.orbitalRings.length; i++) {
                    const ring = this.orbitalRings[i];
                    if (ring && ring.rotation) {
                        ring.rotation.x += ring.userData.rotSpeedX || 0.008;
                        ring.rotation.z += ring.userData.rotSpeedZ || 0.012;
                    }
                }
            }

            // 3. Node Breathing (Harmonic volume oscillation)
            const nodeKeys = Object.keys(this.nodesMap);
            for (let i = 0; i < nodeKeys.length; i++) {
                const nodeItem = this.nodesMap[nodeKeys[i]];
                if (nodeItem && nodeItem.group && nodeItem.group.scale) {
                    const breathe = 1.0 + Math.sin(time * 1.6 + i * 0.75) * 0.05;
                    nodeItem.group.scale.set(breathe, breathe, breathe);
                }
            }

            // 4. Wave Field Vertex Displacement (Superposition of 3 Travelling Harmonic Waves)
            if (this.waveGeometry && this.waveGeometry.attributes && this.waveGeometry.attributes.position) {
                const pos = this.waveGeometry.attributes.position.array;
                for (let i = 0; i < pos.length; i += 3) {
                    const x = pos[i];
                    const y = pos[i + 1]; // In PlaneGeometry, y is the second planar axis
                    // Local z represents perpendicular topological surface displacement
                    pos[i + 2] = 
                        Math.sin(x * 0.028 + time * 1.3) * 2.6 +
                        Math.sin(y * 0.038 + time * 0.9) * 2.0 +
                        Math.sin((x + y) * 0.02 + time * 1.5) * 1.4;
                }
                this.waveGeometry.attributes.position.needsUpdate = true;
            }

            // 5. Electromagnetic Pulse Rings Expansion & Radiative Decay
            if (this.pulseRings && this.pulseRings.length > 0) {
                for (let i = 0; i < this.pulseRings.length; i++) {
                    const ring = this.pulseRings[i];
                    ring.userData.progress += ring.userData.speed;
                    if (ring.userData.progress > 1.0) ring.userData.progress = 0;
                    const scale = 1.0 + ring.userData.progress * 85.0;
                    ring.scale.set(scale, scale, 1);
                    if (ring.material) {
                        ring.material.opacity = 0.65 * (1.0 - ring.userData.progress);
                    }
                }
            }

            // 6. Volumetric Nebula Drift & Opacity Breathing
            if (this.nebulaClouds && this.nebulaClouds.length > 0) {
                for (let i = 0; i < this.nebulaClouds.length; i++) {
                    const cloud = this.nebulaClouds[i];
                    cloud.position.x += Math.sin(time * 0.12 + i) * 0.025;
                    cloud.position.y += Math.cos(time * 0.09 + i) * 0.015;
                    if (cloud.material) {
                        cloud.material.opacity = 0.22 + Math.sin(time * 0.35 + i * 1.4) * 0.08;
                    }
                }
            }

            // 7. Quadratic Bezier Particle Energy Streams with Size Pulsation
            if (!this.is2DFallback && this.particleGeometry && this.particlesData && this.particlePositions) {
                const count = this.particlesData.length;
                for (let i = 0; i < count; i++) {
                    const p = this.particlesData[i];
                    p.t += p.speed;
                    if (p.t > 1.0) p.t = 0.0;

                    const t = p.t;
                    const omt = 1.0 - t;
                    const c0 = omt * omt;
                    const c1 = 2.0 * omt * t;
                    const c2 = t * t;

                    // Interpolate point along Quadratic Bezier curve B(t)
                    this.particlePositions[i * 3] = c0 * p.start.x + c1 * p.mid.x + c2 * p.end.x;
                    this.particlePositions[i * 3 + 1] = c0 * p.start.y + c1 * p.mid.y + c2 * p.end.y;
                    this.particlePositions[i * 3 + 2] = c0 * p.start.z + c1 * p.mid.z + c2 * p.end.z;
                }
                if (this.particleGeometry.attributes && this.particleGeometry.attributes.position) {
                    this.particleGeometry.attributes.position.needsUpdate = true;
                }
                // Pulsate particle material point size subtly
                if (this.particlePoints && this.particlePoints.material) {
                    this.particlePoints.material.size = 3.2 + Math.sin(time * 2.8) * 0.7;
                }
            }

            // 8. Multi-layered Starfield Astrometric Parallax & Scintillation
            if (this.starfieldFar && this.starfieldFar.rotation) {
                this.starfieldFar.rotation.y += 0.00015;
            }
            if (this.starfieldMid && this.starfieldMid.rotation) {
                this.starfieldMid.rotation.y += 0.0003;
                if (this.starfieldMid.material) {
                    this.starfieldMid.material.opacity = 0.55 + Math.sin(time * 2.2) * 0.2;
                }
            }
            if (this.starfieldNear && this.starfieldNear.rotation) {
                this.starfieldNear.rotation.y += 0.00045;
                if (this.starfieldNear.material) {
                    this.starfieldNear.material.opacity = 0.75 + Math.cos(time * 3.0) * 0.2;
                }
            }

            // 9. Smooth Camera Fly-To Lerp
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
