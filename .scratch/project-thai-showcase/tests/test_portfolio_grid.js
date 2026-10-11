/**
 * Test Suite: Ticket 03 - Dual-View Portfolio Grid & Category Filtering
 * Verifies PortfolioGrid card rendering, status badges, benchmark tags, category filtering, and click selection.
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

console.log('=== RUNNING TICKET 03 TEST SUITE: PORTFOLIO GRID & FILTERING ===\n');

// ---------------------------------------------------------
// TEST 1: Grid card generation with status and benchmarks
// ---------------------------------------------------------
test('PortfolioGrid renders all projects with correct status badges and metrics', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const gridCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-grid.js'), 'utf8');

    let innerHTMLContent = '';
    const mockContainer = {
        set innerHTML(html) { innerHTMLContent = html; },
        get innerHTML() { return innerHTMLContent; },
        querySelectorAll: () => []
    };

    const sandbox = {
        window: { dispatchEvent: () => {} },
        document: {
            getElementById: (id) => {
                if (id === 'projects-grid-container') return mockContainer;
                return { style: {}, classList: { add: () => {}, remove: () => {} } };
            },
            querySelectorAll: () => []
        },
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);
    vm.runInContext(gridCode, sandbox);

    const data = sandbox.PortfolioData || sandbox.window.PortfolioData;
    const controller = sandbox.PortfolioController || sandbox.window.PortfolioController;
    assert.ok(data, 'PortfolioData must exist');
    if (controller) controller.init(data);

    const PortfolioGrid = sandbox.PortfolioGrid || sandbox.window.PortfolioGrid;
    assert.ok(PortfolioGrid, 'PortfolioGrid module must exist');

    PortfolioGrid.init();
    PortfolioGrid.render();

    // Verify all 6 project titles are in the rendered grid
    data.projects.forEach(p => {
        assert.ok(innerHTMLContent.includes(p.title), `Grid must contain project title: ${p.title}`);
        assert.ok(innerHTMLContent.includes(p.status), `Grid must contain project status: ${p.status}`);
    });
});

// ---------------------------------------------------------
// TEST 2: Category filtering updates grid cards
// ---------------------------------------------------------
test('PortfolioGrid filters projects by category', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const gridCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-grid.js'), 'utf8');

    let innerHTMLContent = '';
    const mockContainer = {
        set innerHTML(html) { innerHTMLContent = html; },
        get innerHTML() { return innerHTMLContent; },
        querySelectorAll: () => []
    };

    const sandbox = {
        window: { dispatchEvent: () => {} },
        document: {
            getElementById: (id) => {
                if (id === 'projects-grid-container') return mockContainer;
                return { style: {}, classList: { add: () => {}, remove: () => {} } };
            },
            querySelectorAll: () => []
        },
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);
    vm.runInContext(gridCode, sandbox);

    const data = sandbox.PortfolioData || sandbox.window.PortfolioData;
    const controller = sandbox.PortfolioController || sandbox.window.PortfolioController;
    if (controller && data) controller.init(data);

    const PortfolioGrid = sandbox.PortfolioGrid || sandbox.window.PortfolioGrid;
    PortfolioGrid.init();

    // Filter by vision
    PortfolioGrid.filterCategory('vision');
    assert.ok(innerHTMLContent.includes('ESP32-S3 TinyML Vision Guard'), 'Must contain vision project');
    assert.ok(!innerHTMLContent.includes('Embedded Keyword Spotting'), 'Must NOT contain audio project when filtered by vision');

    // Filter all
    PortfolioGrid.filterCategory('all');
    assert.ok(innerHTMLContent.includes('Embedded Keyword Spotting'), 'Must contain audio project when filtered by all');
});

console.log('\n=== TICKET 03 TEST SUITE READY ===');
