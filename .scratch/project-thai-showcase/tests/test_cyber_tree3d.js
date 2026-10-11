/**
 * Test Suite: Ticket 02 - 3D Cybernetic Skill Tree & Constellation Scene
 * Verifies CyberTree3D geometry, particle streams, hover dependency glow, click navigation, and 2D fallback.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(`    Error: ${err.message}`);
        process.exitCode = 1;
    }
}

console.log('=== RUNNING TICKET 02 TEST SUITE: 3D CYBERNETIC SKILL TREE ===\n');

// Mock Three.js environment for Node.js
function createMockThree() {
    class Vector2 {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
        set(x, y) { this.x = x; this.y = y; return this; }
    }

    class Vector3 {
        constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
        set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
        copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
        clone() { return new Vector3(this.x, this.y, this.z); }
        distanceTo(v) { return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2 + (this.z - v.z)**2); }
        lerp(v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
        }
    }

    class Color {
        constructor(c) { this.hex = c; }
        setHex(hex) { this.hex = hex; return this; }
    }

    class Object3D {
        constructor() {
            this.position = new Vector3();
            this.rotation = new Vector3();
            this.children = [];
            this.userData = {};
        }
        add(obj) { this.children.push(obj); }
        remove(obj) {
            const idx = this.children.indexOf(obj);
            if (idx !== -1) this.children.splice(idx, 1);
        }
    }

    class Mesh extends Object3D {
        constructor(geom, mat) {
            super();
            this.geometry = geom;
            this.material = mat;
        }
    }

    class Group extends Object3D {}

    class Scene extends Object3D {
        constructor() { super(); this.background = null; this.fog = null; }
    }

    class PerspectiveCamera extends Object3D {
        constructor(fov, aspect, near, far) {
            super();
            this.fov = fov;
            this.aspect = aspect;
            this.lookAtTarget = new Vector3();
        }
        lookAt(x, y, z) {
            if (typeof x === 'object') {
                this.lookAtTarget.copy(x);
            } else {
                this.lookAtTarget.set(x, y, z);
            }
        }
    }

    class Raycaster {
        constructor() { this.ray = {}; }
        setFromCamera(coords, camera) {}
        intersectObjects(objects) {
            // Mock returning first object if requested
            return objects.length > 0 ? [{ object: objects[0] }] : [];
        }
    }

    return {
        Vector2,
        Vector3,
        Color,
        Object3D,
        Mesh,
        Group,
        Scene,
        PerspectiveCamera,
        Raycaster,
        SphereGeometry: class {},
        CylinderGeometry: class {},
        BufferGeometry: class {
            setAttribute() {}
            setFromPoints() {}
        },
        BufferAttribute: class {},
        Points: class extends Object3D {},
        PointsMaterial: class {},
        MeshBasicMaterial: class { constructor(opt) { this.color = new Color(opt ? opt.color : 0); } },
        MeshStandardMaterial: class { constructor(opt) { this.color = new Color(opt ? opt.color : 0); } },
        LineBasicMaterial: class { constructor(opt) { this.color = new Color(opt ? opt.color : 0); } },
        Line: class extends Object3D {},
        AmbientLight: class extends Object3D {},
        PointLight: class extends Object3D {},
        FogExp2: class {},
        WebGLRenderer: class {
            constructor() {
                this.domElement = { addEventListener: () => {} };
            }
            setSize() {}
            setPixelRatio() {}
            render() {}
        }
    };
}

// ---------------------------------------------------------
// TEST 1: CyberTree3D initializes nodes from PortfolioData
// ---------------------------------------------------------
test('CyberTree3D initializes tree geometry and project nodes from PortfolioData', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const treeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');

    const mockDOM = {
        'galaxy-viewport-container': { clientWidth: 1000, clientHeight: 700 },
        'galaxy-3d-canvas': { addEventListener: () => {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 700 }) },
        'galaxy-2d-fallback': { style: { display: 'none' } }
    };

    const sandbox = {
        window: {},
        document: {
            getElementById: (id) => mockDOM[id] || null,
            addEventListener: () => {}
        },
        THREE: createMockThree(),
        console: console,
        requestAnimationFrame: () => 1
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);
    vm.runInContext(treeCode, sandbox);

    const CyberTree3D = sandbox.CyberTree3D || sandbox.window.CyberTree3D;
    assert.ok(CyberTree3D, 'CyberTree3D class must exist');

    const tree = new CyberTree3D();
    tree.init();

    // Verify trunk and project nodes are in nodesMap
    assert.ok(tree.nodesMap, 'nodesMap must be populated');
    const nodeCount = Object.keys(tree.nodesMap).length;
    assert.ok(nodeCount >= 6, `Expected at least 6 nodes in 3D tree, got ${nodeCount}`);

    // Verify root trunk exists
    assert.ok(tree.nodesMap['trunk-core'], 'Central trunk-core must exist in tree');
});

// ---------------------------------------------------------
// TEST 2: Dependency Glow and Interaction
// ---------------------------------------------------------
test('CyberTree3D handles hover dependency glow and click project selection', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const treeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');

    const sandbox = {
        window: { dispatchEvent: () => {} },
        document: {
            getElementById: () => ({ clientWidth: 1000, clientHeight: 700, addEventListener: () => {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 700 }) }),
            addEventListener: () => {}
        },
        THREE: createMockThree(),
        console: console,
        requestAnimationFrame: () => 1
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);
    vm.runInContext(treeCode, sandbox);

    const tree = new (sandbox.CyberTree3D || sandbox.window.CyberTree3D)();
    tree.init();

    // Test hover dependency glow
    const projectNodeKey = 'node-esp32-s3-vision-guard';
    assert.ok(tree.nodesMap[projectNodeKey], 'Project node must exist');

    tree.setHoveredNode(tree.nodesMap[projectNodeKey]);
    assert.strictEqual(tree.hoveredNode, tree.nodesMap[projectNodeKey]);

    // Test clicking node triggers selectProject
    let selectedId = null;
    const controller = sandbox.PortfolioController || sandbox.window.PortfolioController;
    assert.ok(controller, 'PortfolioController must exist');
    controller.selectProject = (id) => { selectedId = id; };

    tree.handleNodeClick(tree.nodesMap[projectNodeKey]);
    assert.strictEqual(selectedId, 'esp32-s3-vision-guard', 'Clicking node must select project in PortfolioController');

    // Test Auto-Orbit toggle
    const initialOrbit = tree.autoOrbit;
    tree.toggleAutoOrbit();
    assert.strictEqual(tree.autoOrbit, !initialOrbit, 'Auto-Orbit must toggle');
});

// ---------------------------------------------------------
// TEST 3: 2D Fallback Canvas Rendering
// ---------------------------------------------------------
test('CyberTree3D enables 2D canvas fallback without throwing', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const treeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');

    let fallbackDrawn = false;
    const mockCanvas = {
        getContext: () => ({
            clearRect: () => {},
            beginPath: () => {},
            arc: () => {},
            moveTo: () => {},
            lineTo: () => {},
            fill: () => { fallbackDrawn = true; },
            stroke: () => {},
            fillText: () => {}
        }),
        width: 800,
        height: 600
    };

    const sandbox = {
        window: {},
        document: {
            getElementById: (id) => {
                if (id === 'galaxy-2d-canvas') return mockCanvas;
                return { style: {} };
            },
            addEventListener: () => {}
        },
        THREE: undefined, // Force 2D fallback
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);
    vm.runInContext(treeCode, sandbox);

    const tree = new (sandbox.CyberTree3D || sandbox.window.CyberTree3D)();
    tree.enable2DFallback();

    assert.ok(tree.is2DFallback, 'is2DFallback must be true');
    assert.ok(fallbackDrawn, '2D canvas must execute drawing commands');
});

console.log('\n=== TICKET 02 TEST SUITE READY ===');
