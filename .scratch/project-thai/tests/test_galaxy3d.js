// ==========================================================================
// TEST SUITE: TICKET 04 - THREE.JS 3D SKILL GALAXY ENGINE
// ==========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Mock DOM and Three.js minimal API for headless testing
const localStorageStore = {};
const sessionStorageStore = {};

global.localStorage = {
    getItem: (k) => localStorageStore[k] || null,
    setItem: (k, v) => { localStorageStore[k] = String(v); },
    removeItem: (k) => { delete localStorageStore[k]; },
    clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

global.sessionStorage = {
    getItem: (k) => sessionStorageStore[k] || null,
    setItem: (k, v) => { sessionStorageStore[k] = String(v); },
    removeItem: (k) => { delete sessionStorageStore[k]; },
    clear: () => { Object.keys(sessionStorageStore).forEach(k => delete sessionStorageStore[k]); }
};

class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.id = '';
        this.className = '';
        this.classList = {
            classes: new Set(),
            add: (c) => this.classList.classes.add(c),
            remove: (c) => this.classList.classes.delete(c),
            toggle: (c, force) => {
                if (force === undefined) {
                    if (this.classList.classes.has(c)) this.classList.classes.delete(c);
                    else this.classList.classes.add(c);
                } else if (force) {
                    this.classList.classes.add(c);
                } else {
                    this.classList.classes.delete(c);
                }
            },
            contains: (c) => this.classList.classes.has(c)
        };
        this.style = {};
        this.clientWidth = 1200;
        this.clientHeight = 700;
        this.listeners = {};
        this._innerHTML = '';
        this._textContent = '';
    }

    get innerHTML() { return this._innerHTML; }
    set innerHTML(val) { this._innerHTML = val; }

    get textContent() { return this._textContent; }
    set textContent(val) { this._textContent = val; }

    addEventListener(evt, fn) {
        if (!this.listeners[evt]) this.listeners[evt] = [];
        this.listeners[evt].push(fn);
    }

    getBoundingClientRect() {
        return { left: 0, top: 0, width: 1200, height: 700 };
    }
}

const mockDomElements = {
    "galaxy-viewport-container": new MockElement('div'),
    "galaxy-3d-canvas": new MockElement('canvas'),
    "galaxy-2d-fallback": new MockElement('div'),
    "galaxy-2d-grid": new MockElement('div'),
    "galaxy-node-tooltip": new MockElement('div'),
    "telem-galaxy-count": new MockElement('span'),
    "telem-galaxy-pct": new MockElement('span')
};

global.document = {
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => mockDomElements[id] || null,
    querySelectorAll: () => [],
    addEventListener: () => {}
};

global.window = {
    innerWidth: 1400,
    innerHeight: 900,
    devicePixelRatio: 1,
    addEventListener: () => {}
};

// Minimal THREE mock
class Vector3 {
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
    set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
    copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }
}

class Color {
    constructor(hex = 0) { this.hex = hex; this.r = 1; this.g = 1; this.b = 1; }
    setHex(hex) { this.hex = hex; }
}

class Group {
    constructor() { this.children = []; }
    add(obj) { this.children.push(obj); }
    remove(obj) {
        const idx = this.children.indexOf(obj);
        if (idx !== -1) this.children.splice(idx, 1);
    }
}

class Scene extends Group {
    constructor() { super(); this.background = null; this.fog = null; }
}

class PerspectiveCamera {
    constructor() {
        this.position = new Vector3();
        this.aspect = 1;
    }
    lookAt() {}
    updateProjectionMatrix() {}
}

class WebGLRenderer {
    constructor() {}
    setSize() {}
    setPixelRatio() {}
    render() {}
}

class Mesh {
    constructor(geom, mat) {
        this.geometry = geom;
        this.material = mat;
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.userData = {};
    }
}

class Material {
    constructor(cfg = {}) {
        this.color = new Color(cfg.color || 0);
        this.opacity = cfg.opacity || 1;
        this.transparent = cfg.transparent || false;
    }
}

global.THREE = {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Group,
    Vector3,
    Color,
    Mesh,
    MeshStandardMaterial: Material,
    MeshBasicMaterial: Material,
    PointsMaterial: Material,
    LineBasicMaterial: Material,
    AmbientLight: function() {},
    PointLight: function() { this.position = new Vector3(); },
    BufferGeometry: function() {
        this.setAttribute = () => {};
        this.setFromPoints = () => this;
    },
    BufferAttribute: function() {},
    Points: function() { this.rotation = new Vector3(); },
    Line: function() {},
    IcosahedronGeometry: function() {},
    RingGeometry: function() {},
    Raycaster: function() {
        this.setFromCamera = () => {};
        this.intersectObjects = () => [];
    },
    Vector2: function() {},
    FogExp2: function() {},
    DoubleSide: 2,
    OrbitControls: function(cam) {
        this.target = new Vector3();
        this.update = () => {};
    }
};

global.requestAnimationFrame = () => {};

console.log("=== RUNNING TICKET 04 TEST SUITE ===");

// 2. Load js/tracks.js
const tracksCode = fs.readFileSync(path.join(__dirname, '../../../js/tracks.js'), 'utf8');
eval(tracksCode);

// 3. Load js/galaxy3d.js
const galaxyCode = fs.readFileSync(path.join(__dirname, '../../../js/galaxy3d.js'), 'utf8');
eval(galaxyCode);

const galaxy = window.skillGalaxy3D;
assert(galaxy, "skillGalaxy3D must be defined on window");

console.log("\n[TEST 1] Testing 3D Scene Initialization...");
galaxy.init();
assert(galaxy.scene, "Scene must be created");
assert(galaxy.camera, "Camera must be created");
assert(galaxy.renderer, "Renderer must be created");
assert(galaxy.starfield, "Starfield particles must be created");
console.log("✓ Scene, Camera, Renderer, Starfield initialized.");

console.log("\n[TEST 2] Testing 24 Skill Station 3D Nodes Mapping...");
assert.strictEqual(Object.keys(galaxy.nodesMap).length, 24, "Must have exactly 24 3D station nodes");

// Verify node positions match coordinates3D
window.SKILL_STATIONS.forEach(st => {
    const entry = galaxy.nodesMap[st.id];
    assert(entry, `Node entry for ${st.id} must exist in nodesMap`);
    assert.strictEqual(entry.position.x, st.coordinates3D.x, `Node ${st.id} X coord match`);
    assert.strictEqual(entry.position.y, st.coordinates3D.y, `Node ${st.id} Y coord match`);
    assert.strictEqual(entry.position.z, st.coordinates3D.z, `Node ${st.id} Z coord match`);
});
console.log("✓ All 24 station 3D coordinates mapped perfectly.");

console.log("\n[TEST 3] Testing Node Visual Status & Materials...");
// By default, s01 is unlocked, s02 is locked
const s01Status = window.trackStateManager.getStationStatus("s01");
const s01Color = galaxy.getStatusColor(s01Status, "track-c-core");
assert.strictEqual(s01Color, 0x00f0ff, "s01 unlocked should have Track 1 cyan color");

// Master s01 and verify visual refresh
window.trackStateManager.recordStationQuiz("s01", 2, 2);
galaxy.refreshNodeVisuals();

const s01NewStatus = window.trackStateManager.getStationStatus("s01");
assert.strictEqual(s01NewStatus, "mastered", "s01 should now be mastered");
assert.strictEqual(galaxy.getStatusColor("mastered", "track-c-core"), 0xfbbf24, "Mastered node should be gold");
console.log("✓ Dynamic status visual refresh verified.");

console.log("\n[TEST 4] Testing Camera Fly-To Zoom & Reset...");
const targetStation = window.trackStateManager.getStation("s01");
galaxy.flyToStation(targetStation);
assert(galaxy.isCameraAnimating, "Camera must enter animating state on fly-to");
assert(galaxy.targetCamPos, "Target camera position must be calculated");
assert(galaxy.targetLookAt, "Target look-at must be set to node center");

galaxy.resetCameraFocus();
assert.strictEqual(galaxy.targetCamPos.x, galaxy.defaultCamPos.x, "Camera reset target X match");
assert.strictEqual(galaxy.targetCamPos.y, galaxy.defaultCamPos.y, "Camera reset target Y match");
assert.strictEqual(galaxy.targetCamPos.z, galaxy.defaultCamPos.z, "Camera reset target Z match");
console.log("✓ Camera fly-to and overview reset verified.");

console.log("\n[TEST 5] Testing Track Filtering HUD...");
galaxy.filterTrack("track-tinyml");
assert.strictEqual(galaxy.currentFilter, "track-tinyml", "Current filter must be track-tinyml");
assert(galaxy.targetCamPos, "Camera target must be focused on TinyML arm");

galaxy.filterTrack("all");
assert.strictEqual(galaxy.currentFilter, "all", "Filter reset to all");
console.log("✓ Track filtering navigation verified.");

console.log("\n[TEST 6] Testing 2D Constellation Fallback Rendering...");
galaxy.enable2DFallback();
assert(mockDomElements["galaxy-2d-grid"].innerHTML.includes("Thao Tác Bit"), "2D Fallback grid must contain station cards");
console.log("✓ 2D fallback rendering verified.");

console.log("\n=== ALL TICKET 04 TESTS PASSED PERFECTLY ===");
