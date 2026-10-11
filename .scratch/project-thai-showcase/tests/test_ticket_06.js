/**
 * Test Suite for Ticket 06: Engine Consolidation & DRY Constants Refactoring
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

console.log('=== RUNNING TICKET 06 TEST SUITE: ENGINE CONSOLIDATION & DRY CONSTANTS ===\n');

// ---------------------------------------------------------
// TEST 1: galaxy3d.js is deleted and no longer in HTML or sw.js
// ---------------------------------------------------------
test('galaxy3d.js is removed from repo and omitted from index.html & sw.js', () => {
    const galaxyPath = path.join(__dirname, '../../../js/galaxy3d.js');
    assert.strictEqual(fs.existsSync(galaxyPath), false, 'js/galaxy3d.js must be deleted');

    const htmlContent = fs.readFileSync(path.join(__dirname, '../../../index.html'), 'utf8');
    assert.strictEqual(htmlContent.includes('galaxy3d.js'), false, 'index.html must not include galaxy3d.js script tag');
    assert.ok(htmlContent.includes('cyber-tree3d.js'), 'index.html must include cyber-tree3d.js script tag');

    const swContent = fs.readFileSync(path.join(__dirname, '../../../sw.js'), 'utf8');
    assert.strictEqual(swContent.includes('galaxy3d.js'), false, 'sw.js must not precache galaxy3d.js');
    assert.ok(swContent.includes('cyber-tree3d.js'), 'sw.js must precache cyber-tree3d.js');
});

// ---------------------------------------------------------
// TEST 2: cyber-tree3d.js preserves backward compatibility alias
// ---------------------------------------------------------
test('cyber-tree3d.js aliases window.skillGalaxy3D to cyberTree3D', () => {
    const cyberTreeCode = fs.readFileSync(path.join(__dirname, '../../../js/cyber-tree3d.js'), 'utf8');
    assert.ok(cyberTreeCode.includes('window.skillGalaxy3D = cyberTree3D'), 'cyber-tree3d.js must alias skillGalaxy3D');
});

// ---------------------------------------------------------
// TEST 3: portfolio-data.js exports categoryMeta and statusStyle constants
// ---------------------------------------------------------
test('portfolio-data.js exports centralized categoryMeta and statusStyle with helper functions', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const sandbox = {
        window: {},
        module: { exports: {} }
    };
    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);

    const data = sandbox.module.exports;
    assert.ok(data.categoryMeta, 'PortfolioData must export categoryMeta');
    assert.ok(data.categoryMeta.vision, 'categoryMeta must contain vision');
    assert.ok(data.categoryMeta.audio, 'categoryMeta must contain audio');
    assert.ok(data.categoryMeta.iot, 'categoryMeta must contain iot');

    assert.ok(data.statusStyle, 'PortfolioData must export statusStyle');
    assert.ok(data.statusStyle.Completed, 'statusStyle must contain Completed');
    assert.ok(data.statusStyle['In Progress'], 'statusStyle must contain In Progress');
    assert.ok(data.statusStyle['Architecture Design'], 'statusStyle must contain Architecture Design');

    assert.strictEqual(typeof data.getCategoryMeta, 'function', 'getCategoryMeta must be a helper function');
    assert.strictEqual(typeof data.getStatusStyle, 'function', 'getStatusStyle must be a helper function');

    const visionMeta = data.getCategoryMeta('vision');
    assert.strictEqual(visionMeta.label, 'Computer Vision');
    const completedStyle = data.getStatusStyle('Completed');
    assert.strictEqual(completedStyle.text, '#00ff88');
});

// ---------------------------------------------------------
// TEST 4: portfolio-grid.js and portfolio-hud.js consume centralized constants
// ---------------------------------------------------------
test('portfolio-grid.js and portfolio-hud.js consume PortfolioData metadata', () => {
    const gridCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-grid.js'), 'utf8');
    const hudCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-hud.js'), 'utf8');

    assert.ok(gridCode.includes('getCategoryMeta') || gridCode.includes('PortfolioData.categoryMeta'), 'portfolio-grid.js must use centralized categoryMeta');
    assert.ok(gridCode.includes('getStatusStyle') || gridCode.includes('PortfolioData.statusStyle'), 'portfolio-grid.js must use centralized statusStyle');

    assert.ok(hudCode.includes('getCategoryMeta') || hudCode.includes('PortfolioData.categoryMeta'), 'portfolio-hud.js must use centralized categoryMeta');
    assert.ok(hudCode.includes('getStatusStyle') || hudCode.includes('PortfolioData.statusStyle'), 'portfolio-hud.js must use centralized statusStyle');
});

console.log('\n=== TICKET 06 TEST SUITE READY ===\n');
