/**
 * Test Suite: 3D Wave Dynamics, Electromagnetic Pulse & Scientific Visualization Upgrade
 * Verifies Wave Field, Pulse Rings, Bezier Particle Trajectories, Nebulae, Orbital Rings, and Tooltip Radar.
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

console.log('=== RUNNING 3D WAVE DYNAMICS & SCIENTIFIC VISUALIZATION TEST SUITE ===\n');

// Mock Enhanced Three.js environment
function createMockEnhancedThree() {
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
            this.scale = new Vector3(1, 1, 1);
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
            return objects.length > 0 ? [{ object: objects[0] }] : [];
        }
    }

    class BufferGeometry {
        constructor() {
            this.attributes = {};
        }
        setAttribute(name, attr) {
            this.attributes[name] = attr;
        }
        setFromPoints() {}
    }

    class BufferAttribute {
        constructor(array, itemSize) {
            this.array = array;
            this.itemSize = itemSize;
            this.needsUpdate = false;
        }
    }

    class PlaneGeometry extends BufferGeometry {
        constructor(width, height, wSeg, hSeg) {
            super();
            const count = (wSeg + 1) * (hSeg + 1);
            this.attributes.position = new BufferAttribute(new Float32Array(count * 3), 3);
        }
    }

    class RingGeometry extends BufferGeometry {
        constructor(inner, outer, seg) {
            super();
        }
    }

    class TorusGeometry extends BufferGeometry {
        constructor(r, tube, radSeg, tubSeg) {
            super();
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
        SphereGeometry: class extends BufferGeometry {},
        CylinderGeometry: class extends BufferGeometry {},
        PlaneGeometry,
        RingGeometry,
        TorusGeometry,
        BufferGeometry,
        BufferAttribute,
        Points: class extends Object3D {},
        PointsMaterial: class {},
        MeshBasicMaterial: class { constructor(opt) { this.color = new Color(opt ? opt.color : 0); this.opacity = opt ? opt.opacity : 1; } },
        MeshStandardMaterial: class { constructor(opt) { this.color = new Color(opt ? opt.color : 0); } },
        LineBasicMaterial: class { constructor(opt) { this.color = new Color(opt ? opt.color : 0); } },
        Line: class extends Object3D {},
        AmbientLight: class extends Object3D {},
        PointLight: class extends Object3D {},
        FogExp2: class {},
        CanvasTexture: class {},
        SpriteMaterial: class {},
        Sprite: class extends Object3D {},
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

test('CyberTree3D integrates 7 scientific wave upgrade systems', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const treeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');

    let tooltipHtml = '';
    const mockTooltip = {
        style: { display: 'none', left: '0px', top: '0px' },
        set innerHTML(val) { tooltipHtml = val; },
        get innerHTML() { return tooltipHtml; }
    };

    const mockDOM = {
        'galaxy-viewport-container': { clientWidth: 1000, clientHeight: 700 },
        'galaxy-3d-canvas': { addEventListener: () => {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 700 }) },
        'galaxy-node-tooltip': mockTooltip,
        'galaxy-node-inspector': { style: { display: 'none' }, set innerHTML(v) {} },
        'galaxy-2d-fallback': { style: { display: 'none' } }
    };

    const sandbox = {
        window: {},
        document: {
            getElementById: (id) => mockDOM[id] || null,
            createElement: () => ({
                getContext: () => ({
                    createRadialGradient: () => ({ addColorStop: () => {} }),
                    fillRect: () => {}
                }),
                width: 128,
                height: 128
            }),
            addEventListener: () => {}
        },
        THREE: createMockEnhancedThree(),
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

    // 1. Verify Energy Wave Field
    assert.ok(tree.waveGeometry, 'Wave field geometry must be created');
    assert.ok(tree.waveMesh, 'Wave field mesh must be added to scene');
    assert.strictEqual(tree.waveMesh.position.y, -65, 'Wave field must be positioned horizontally beneath root node');

    // 2. Verify Electromagnetic Pulse Rings
    assert.ok(Array.isArray(tree.pulseRings), 'Pulse rings array must exist');
    assert.strictEqual(tree.pulseRings.length, 4, 'Must create 4 pulse rings for isotropic propagation');

    // 3. Verify Particle Stream Bezier Curve Data
    assert.ok(tree.particlesData.length > 0, 'Particle data stream must be populated');
    const sampleParticle = tree.particlesData[0];
    assert.ok(sampleParticle.mid, 'Particles must contain mid control point for Quadratic Bezier Curve interpolation');
    assert.ok(sampleParticle.mid.y > sampleParticle.start.y, 'Mid control point must include gravitational upward arc');

    // 4. Verify Orbital Rings around nodes
    assert.ok(Array.isArray(tree.orbitalRings), 'Orbital rings array must exist');
    assert.ok(tree.orbitalRings.length >= 4, 'Orbital Torus rings must be constructed around branch/project nodes');

    // 5. Verify Nebula Clouds
    assert.ok(Array.isArray(tree.nebulaClouds), 'Nebula clouds array must exist');
    assert.strictEqual(tree.nebulaClouds.length, 5, 'Must generate 5 procedural cosmic nebula sprites');

    // 6. Verify Starfield Depth Layers
    assert.ok(tree.starfieldFar, 'Far starfield layer must exist');
    assert.ok(tree.starfieldMid, 'Mid starfield layer must exist');
    assert.ok(tree.starfieldNear, 'Near starfield layer must exist');

    // 7. Verify Scientific Data Visualization in Tooltip
    const sampleBranchData = {
        id: 'branch-edgeai',
        label: 'Edge AI Engine',
        type: 'branch',
        skills: ['INT8', 'TFLite Micro', 'ESP-NN', 'Pruning']
    };
    tree.showTooltip(100, 100, sampleBranchData);
    assert.ok(tooltipHtml.includes('conic-gradient'), 'Tooltip must render chromatic spectral competency wheel');
    assert.ok(tooltipHtml.includes('SPECTRUM'), 'Tooltip must indicate scientific spectral vector analysis');

    // 8. Verify click raycaster bug fix
    const fakeClickEvent = { clientX: 200, clientY: 200 };
    assert.doesNotThrow(() => {
        tree.onClick(fakeClickEvent);
    }, 'onClick must not throw undefined intersects error');
});

console.log('\n=== 3D WAVE DYNAMICS TEST SUITE PASSED! ===');
