// ==========================================================================
// PROJECT THAI // 3D SKILL GALAXY ENGINE (THREE.JS WEBGL CONSTELLATION)
// Không Gian 3D Vũ Trụ Chòm Sao Kỹ Năng & Fly-To Camera Navigation
// Tuân thủ nghiêm ngặt Zero-Build PWA Architecture
// ==========================================================================

class SkillGalaxy3D {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = null;
        this.mouse = null;

        this.nodesMap = {}; // { stationId: { mesh, halo, data, position } }
        this.linksGroup = null;
        this.starfield = null;
        this.hoveredNode = null;

        // Camera animation state
        this.isCameraAnimating = false;
        this.targetCamPos = null;
        this.targetLookAt = null;
        this.defaultCamPos = { x: 0, y: 50, z: 120 };
        this.defaultLookAt = { x: 0, y: 15, z: 20 };

        this.currentFilter = "all";
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.container = document.getElementById("galaxy-viewport-container");
        this.canvas = document.getElementById("galaxy-3d-canvas");

        if (!this.container || !this.canvas) {
            console.warn("[SkillGalaxy3D] Viewport container or canvas not found in DOM.");
            return;
        }

        // Check Three.js availability
        if (typeof THREE === "undefined") {
            console.warn("[SkillGalaxy3D] THREE is not loaded yet. Retrying in 500ms...");
            setTimeout(() => this.init(), 500);
            return;
        }

        try {
            this.setupScene();
            this.setupCameraAndRenderer();
            this.setupLights();
            this.buildStarfield();
            this.buildConstellation();
            this.setupInteraction();
            this.setupControls();
            this.updateTelemetry();

            this.animate();
            this.initialized = true;
            console.log("[SkillGalaxy3D] 3D Skill Galaxy initialized successfully.");
        } catch (err) {
            console.error("[SkillGalaxy3D] WebGL initialization failed, switching to 2D fallback:", err);
            this.enable2DFallback();
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x04060d);
        this.scene.fog = new THREE.FogExp2(0x04060d, 0.0035);
    }

    setupCameraAndRenderer() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || 700;

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
        this.camera.position.set(this.defaultCamPos.x, this.defaultCamPos.y, this.defaultCamPos.z);
        this.camera.lookAt(this.defaultLookAt.x, this.defaultLookAt.y, this.defaultLookAt.z);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        window.addEventListener("resize", () => this.onWindowResize());
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Core cyan point light
        const cyanLight = new THREE.PointLight(0x00f0ff, 2, 200);
        cyanLight.position.set(-20, 30, 20);
        this.scene.add(cyanLight);

        // Purple edge AI light
        const purpleLight = new THREE.PointLight(0xa855f7, 2, 200);
        purpleLight.position.set(30, -10, 10);
        this.scene.add(purpleLight);

        // Gold capstone light
        const goldLight = new THREE.PointLight(0xf59e0b, 2.5, 200);
        goldLight.position.set(0, 10, 60);
        this.scene.add(goldLight);
    }

    buildStarfield() {
        const particleCount = 1400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorPalette = [
            new THREE.Color(0x00f0ff),
            new THREE.Color(0x00ff9d),
            new THREE.Color(0xb05cff),
            new THREE.Color(0xffb400),
            new THREE.Color(0xffffff)
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 500;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 500;

            const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            sizeAttenuation: true
        });

        this.starfield = new THREE.Points(geometry, material);
        this.scene.add(this.starfield);
    }

    buildConstellation() {
        if (!window.SKILL_STATIONS || !window.trackStateManager) return;

        this.linksGroup = new THREE.Group();
        this.scene.add(this.linksGroup);

        const stations = window.SKILL_STATIONS;

        // 1. Build Nodes
        stations.forEach(st => {
            const pos = st.coordinates3D || { x: 0, y: 0, z: 0 };
            const status = window.trackStateManager.getStationStatus(st.id);

            // Shape: Icosahedron for nodes
            const geom = new THREE.IcosahedronGeometry(2.4, 1);
            const mat = this.getNodeMaterial(st, status);
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.userData = { stationId: st.id, station: st };

            // Outer glowing ring halo
            const ringGeom = new THREE.RingGeometry(3.2, 3.6, 24);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.getStatusColor(status, st.trackId),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: status === "mastered" ? 0.9 : 0.4
            });
            const halo = new THREE.Mesh(ringGeom, ringMat);
            halo.position.copy(mesh.position);
            halo.rotation.x = Math.PI / 2;

            this.scene.add(mesh);
            this.scene.add(halo);

            this.nodesMap[st.id] = {
                mesh,
                halo,
                data: st,
                position: pos
            };
        });

        // 2. Build Laser Links
        this.renderLinks();
    }

    getNodeMaterial(station, status) {
        if (status === "mastered") {
            return new THREE.MeshStandardMaterial({
                color: 0xfbbf24,
                emissive: 0xf59e0b,
                emissiveIntensity: 0.6,
                metalness: 0.8,
                roughness: 0.2
            });
        } else if (status === "in-progress" || status === "unlocked") {
            const trackColor = this.getTrackColorHex(station.trackId);
            return new THREE.MeshStandardMaterial({
                color: trackColor,
                emissive: trackColor,
                emissiveIntensity: 0.4,
                metalness: 0.5,
                roughness: 0.3
            });
        } else {
            // Locked
            return new THREE.MeshStandardMaterial({
                color: 0x334155,
                emissive: 0x0f172a,
                emissiveIntensity: 0.1,
                metalness: 0.1,
                roughness: 0.9,
                transparent: true,
                opacity: 0.45
            });
        }
    }

    getStatusColor(status, trackId) {
        if (status === "mastered") return 0xfbbf24;
        if (status === "in-progress" || status === "unlocked") return this.getTrackColorHex(trackId);
        return 0x475569;
    }

    getTrackColorHex(trackId) {
        if (trackId === "track-c-core") return 0x00f0ff;
        if (trackId === "track-esp32-sys") return 0x00ff9d;
        if (trackId === "track-tinyml") return 0xa855f7;
        return 0xf59e0b; // track-capstone
    }

    renderLinks() {
        while (this.linksGroup.children.length > 0) {
            const obj = this.linksGroup.children[0];
            this.linksGroup.remove(obj);
        }

        const stations = window.SKILL_STATIONS;
        stations.forEach(st => {
            if (st.prerequisites && st.prerequisites.length > 0) {
                st.prerequisites.forEach(preId => {
                    const fromNode = this.nodesMap[preId];
                    const toNode = this.nodesMap[st.id];
                    if (fromNode && toNode) {
                        const points = [
                            new THREE.Vector3(fromNode.position.x, fromNode.position.y, fromNode.position.z),
                            new THREE.Vector3(toNode.position.x, toNode.position.y, toNode.position.z)
                        ];
                        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

                        const isPassed = window.trackStateManager.getStationStatus(preId) === "mastered";
                        const lineMat = new THREE.LineBasicMaterial({
                            color: isPassed ? 0x00ff9d : 0x334155,
                            transparent: true,
                            opacity: isPassed ? 0.75 : 0.25,
                            linewidth: 2
                        });
                        const line = new THREE.Line(lineGeom, lineMat);
                        this.linksGroup.add(line);
                    }
                });
            }
        });
    }

    refreshNodeVisuals() {
        if (!this.nodesMap || !window.trackStateManager) return;

        Object.keys(this.nodesMap).forEach(stId => {
            const entry = this.nodesMap[stId];
            const status = window.trackStateManager.getStationStatus(stId);
            entry.mesh.material = this.getNodeMaterial(entry.data, status);
            entry.halo.material.color.setHex(this.getStatusColor(status, entry.data.trackId));
            entry.halo.material.opacity = status === "mastered" ? 0.9 : (status === "locked" ? 0.2 : 0.6);
        });

        this.renderLinks();
        this.updateTelemetry();
    }

    setupInteraction() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.canvas.addEventListener("click", (e) => this.onClick(e));
    }

    setupControls() {
        if (typeof THREE.OrbitControls !== "undefined") {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxDistance = 350;
            this.controls.minDistance = 15;
            this.controls.target.set(this.defaultLookAt.x, this.defaultLookAt.y, this.defaultLookAt.z);
        }
    }

    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshes = Object.values(this.nodesMap).map(n => n.mesh);
        const intersects = this.raycaster.intersectObjects(meshes);

        const tooltip = document.getElementById("galaxy-node-tooltip");

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const station = hit.userData.station;
            this.hoveredNode = hit;
            this.canvas.style.cursor = "pointer";

            if (tooltip && station) {
                const status = window.trackStateManager.getStationStatus(station.id);
                tooltip.style.left = `${event.clientX}px`;
                tooltip.style.top = `${event.clientY}px`;
                tooltip.innerHTML = `
                    <div class="tooltip-station-title">${station.title}</div>
                    <div class="tooltip-meta-row">
                        <span style="color: #38bdf8;">${station.category}</span>
                        <span style="color: #fbbf24;">+${station.xpReward} XP</span>
                    </div>
                    <div class="tooltip-meta-row" style="margin-top: 4px;">
                        <span>Trạng thái:</span>
                        <strong style="color: ${status === 'mastered' ? '#34d399' : (status === 'locked' ? '#f87171' : '#38bdf8')};">${status.toUpperCase()}</strong>
                    </div>
                    <div class="tooltip-prompt">Nhấp để mở Station Workspace ↗</div>
                `;
                tooltip.classList.add("visible");
            }
        } else {
            this.hoveredNode = null;
            this.canvas.style.cursor = "grab";
            if (tooltip) tooltip.classList.remove("visible");
        }
    }

    onClick(event) {
        if (!this.hoveredNode) return;
        const station = this.hoveredNode.userData.station;
        if (!station) return;

        // Fly camera to station
        this.flyToStation(station);
    }

    flyToStation(station) {
        const pos = station.coordinates3D;
        this.targetCamPos = new THREE.Vector3(pos.x, pos.y + 3, pos.z + 16);
        this.targetLookAt = new THREE.Vector3(pos.x, pos.y, pos.z);
        this.isCameraAnimating = true;

        // When zoom close enough, trigger workspace open
        setTimeout(() => {
            if (typeof window.openSkillStation === "function") {
                window.openSkillStation(station.id);
            }
            this.isCameraAnimating = false;
        }, 600);
    }

    resetCameraFocus() {
        this.targetCamPos = new THREE.Vector3(this.defaultCamPos.x, this.defaultCamPos.y, this.defaultCamPos.z);
        this.targetLookAt = new THREE.Vector3(this.defaultLookAt.x, this.defaultLookAt.y, this.defaultLookAt.z);
        this.isCameraAnimating = true;

        setTimeout(() => {
            this.isCameraAnimating = false;
        }, 700);
    }

    filterTrack(trackId) {
        this.currentFilter = trackId;

        // Update pill UI
        const pills = document.querySelectorAll(".galaxy-filter-pill");
        pills.forEach(p => p.classList.toggle("active", p.dataset.track === trackId));

        if (trackId === "all") {
            this.resetCameraFocus();
            return;
        }

        // Find average position of track nodes
        const trackStations = window.SKILL_STATIONS.filter(s => s.trackId === trackId);
        if (trackStations.length > 0) {
            let avgX = 0, avgY = 0, avgZ = 0;
            trackStations.forEach(s => {
                avgX += s.coordinates3D.x;
                avgY += s.coordinates3D.y;
                avgZ += s.coordinates3D.z;
            });
            avgX /= trackStations.length;
            avgY /= trackStations.length;
            avgZ /= trackStations.length;

            this.targetCamPos = new THREE.Vector3(avgX, avgY + 20, avgZ + 50);
            this.targetLookAt = new THREE.Vector3(avgX, avgY, avgZ);
            this.isCameraAnimating = true;

            setTimeout(() => {
                this.isCameraAnimating = false;
            }, 700);
        }
    }

    updateTelemetry() {
        if (!window.trackStateManager) return;
        const mastery = window.trackStateManager.getOverallMastery();

        const countEl = document.getElementById("telem-galaxy-count");
        const pctEl = document.getElementById("telem-galaxy-pct");

        if (countEl) countEl.textContent = `${mastery.masteredStations} / ${mastery.totalStations} Trạm`;
        if (pctEl) pctEl.textContent = `${mastery.percent}%`;
    }

    onWindowResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate starfield gently
        if (this.starfield) {
            this.starfield.rotation.y += 0.0003;
        }

        // Rotate halo rings
        Object.values(this.nodesMap).forEach(entry => {
            entry.halo.rotation.z += 0.008;
            entry.mesh.rotation.y += 0.005;
        });

        // Smooth camera lerp
        if (this.isCameraAnimating && this.targetCamPos && this.targetLookAt) {
            this.camera.position.lerp(this.targetCamPos, 0.08);
            if (this.controls) {
                this.controls.target.lerp(this.targetLookAt, 0.08);
            }
        }

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    enable2DFallback() {
        const viewport = document.getElementById("galaxy-viewport-container");
        const fallback = document.getElementById("galaxy-2d-fallback");
        if (viewport) viewport.style.display = "none";
        if (fallback) {
            fallback.style.display = "block";
            this.render2DFallbackContent();
        }
    }

    render2DFallbackContent() {
        const container = document.getElementById("galaxy-2d-grid");
        if (!container || !window.SKILL_STATIONS) return;

        container.innerHTML = window.SKILL_STATIONS.map(st => {
            const status = window.trackStateManager ? window.trackStateManager.getStationStatus(st.id) : "unlocked";
            return `
                <div class="galaxy-2d-station-card" onclick="openSkillStation('${st.id}')">
                    <div style="font-size: 11px; color: var(--cyan); font-family: monospace;">${st.category}</div>
                    <div style="font-size: 14px; font-weight: bold; margin: 4px 0; color: #fff;">${st.title}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 8px;">
                        <span style="color: #fbbf24;">+${st.xpReward} XP</span>
                        <span class="workspace-status-badge ${status}">${status.toUpperCase()}</span>
                    </div>
                </div>
            `;
        }).join("");
    }
}

// Global Instance
window.skillGalaxy3D = new SkillGalaxy3D();

// Auto-boot on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    // If Three.js loaded or fallback
    setTimeout(() => {
        if (window.skillGalaxy3D) {
            window.skillGalaxy3D.init();
        }
    }, 400);
});
