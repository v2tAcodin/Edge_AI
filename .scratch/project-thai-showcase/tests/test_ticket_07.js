/**
 * Test Suite for Ticket 07: 3D Particle Energy Streams & Enriched Node Inspector
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(err);
        process.exit(1);
    }
}

console.log('=== RUNNING TICKET 07 TEST SUITE: 3D PARTICLES & ENRICHED INSPECTOR ===\n');

// ---------------------------------------------------------
// TEST 1: Particle Energy Streams logic and particle buffer
// ---------------------------------------------------------
test('CyberTree3D implements ParticleEnergyStream traveling along branch curves', () => {
    const treeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');

    assert.ok(treeCode.includes('initParticleStreams') || treeCode.includes('createParticleStream') || treeCode.includes('particleStreams'), 
        'CyberTree3D must have particle stream initialization logic');
    assert.ok(treeCode.includes('particlesData') || treeCode.includes('particlePositions') || treeCode.includes('particleGeometry'),
        'CyberTree3D must maintain particle stream data buffers');
    assert.ok(treeCode.includes('halosList') || treeCode.includes('cachedHalos'),
        'CyberTree3D must cache halos to prevent per-frame Object.values allocations');
});

// ---------------------------------------------------------
// TEST 2: Node Inspector styling supports desktop side panel and mobile bottom sheet
// ---------------------------------------------------------
test('css/galaxy.css contains responsive Node Inspector styling for desktop & mobile bottom sheet', () => {
    const cssContent = fs.readFileSync(path.join(__dirname, '../../../css/galaxy.css'), 'utf8');

    assert.ok(cssContent.includes('.galaxy-node-inspector'), 'galaxy.css must define .galaxy-node-inspector');
    assert.ok(cssContent.includes('inspectorSlideIn') || cssContent.includes('translateX'), 'Must include slide-in transition for inspector');
    assert.ok(cssContent.includes('@media (max-width: 768px)'), 'Must include mobile media query');
    assert.ok(cssContent.includes('bottom: 0') || cssContent.includes('inspectorSlideUpMobile'), 'Mobile inspector must be styled as a bottom sheet');
});

// ---------------------------------------------------------
// TEST 3: Enriched Node Inspector displays 4-block layout for Root and Branch nodes
// ---------------------------------------------------------
test('CyberTree3D showInspector provides 4-block layout and Grid filter action for Root & Branch nodes', () => {
    const treeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');

    let inspectorHtml = '';
    let inspectorDisplay = 'none';

    const domElement = {
        style: { display: 'none' },
        set innerHTML(val) { inspectorHtml = val; },
        get innerHTML() { return inspectorHtml; }
    };

    const sandbox = {
        window: {
            PortfolioData: null
        },
        document: {
            getElementById: (id) => {
                if (id === 'galaxy-node-inspector') return domElement;
                return null;
            }
        },
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(treeCode, sandbox);

    const cyberTree = sandbox.window.cyberTree3D;
    assert.ok(cyberTree, 'cyberTree3D instance must exist');

    // Simulate clicking a branch node
    const branchNode = {
        id: 'branch-vision',
        name: 'Computer Vision & Edge Perception',
        label: 'Computer Vision',
        type: 'branch',
        category: 'vision',
        parent: 'root-cpp',
        color: '#00f0ff'
    };

    cyberTree.showInspector(branchNode);

    assert.ok(inspectorHtml.includes('inspector-breadcrumb'), 'Inspector must render breadcrumbs');
    assert.ok(inspectorHtml.includes('inspector-summary'), 'Inspector must render summary overview');
    assert.ok(inspectorHtml.includes('filterCategory') || inspectorHtml.includes('Grid View'), 'Inspector must include Filter in Grid View action');

    // Simulate clicking a root node
    const rootNode = {
        id: 'root-cpp',
        name: 'C/C++ Bare-Metal & Hardware Core',
        label: 'C/C++ Foundation',
        type: 'root',
        color: '#ffd700'
    };

    cyberTree.showInspector(rootNode);

    assert.ok(inspectorHtml.includes('GỐC RỄ NỀN TẢNG') || inspectorHtml.includes('ROOT CORE'), 'Root node must have root badge');
    assert.ok(inspectorHtml.includes('LIÊN KẾT TRỰC THUỘC') || inspectorHtml.includes('inspector-child-item') || inspectorHtml.includes('inspector-children-list'),
        'Inspector must list child links');
});

// ---------------------------------------------------------
// TEST 4: Empty canvas click triggers camera focus reset and inspector closing
// ---------------------------------------------------------
test('CyberTree3D onClick handles empty canvas click by triggering resetCameraFocus', () => {
    const treeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');

    assert.ok(treeCode.includes('resetCameraFocus()'), 'onClick must call resetCameraFocus on empty click');
});

console.log('\n=== TICKET 07 TEST SUITE READY ===\n');
