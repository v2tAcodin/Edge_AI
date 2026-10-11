/**
 * Test Suite: Ticket 01 - Portfolio Core & Navigation Refactor
 * Verifies PortfolioData schema, PortfolioController seam, and DOM navigation declutter.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Helper to check assertion with clean logging
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

console.log('=== RUNNING TICKET 01 TEST SUITE: PORTFOLIO CORE & NAVIGATION ===\n');

// ---------------------------------------------------------
// TEST 1: Schema validation of PortfolioData
// ---------------------------------------------------------
test('PortfolioData module exists and has complete schema', () => {
    const portfolioDataPath = path.join(__dirname, '../../../js/portfolio-data.js');
    assert.ok(fs.existsSync(portfolioDataPath), 'js/portfolio-data.js must exist');
    
    // Load module in Node environment
    const code = fs.readFileSync(portfolioDataPath, 'utf8');
    const sandbox = { window: {}, console: console };
    const vm = require('vm');
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    const data = sandbox.PortfolioData || sandbox.window.PortfolioData;
    assert.ok(data, 'PortfolioData must be exported on window');

    // 1.1 Profile verification
    assert.ok(data.engineerProfile, 'engineerProfile must exist');
    assert.strictEqual(typeof data.engineerProfile.name, 'string');
    assert.strictEqual(typeof data.engineerProfile.title, 'string');
    assert.ok(data.engineerProfile.skillsRadar, 'skillsRadar must exist');
    assert.strictEqual(data.engineerProfile.skillsRadar.length, 4, 'skillsRadar must have 4 core pillars');

    // 1.2 Projects verification (at least 6 projects)
    assert.ok(Array.isArray(data.projects), 'data.projects must be an array');
    assert.ok(data.projects.length >= 6, `Expected at least 6 projects, found ${data.projects.length}`);

    const validStatuses = ['Completed', 'In Progress', 'Architecture Design'];
    data.projects.forEach(p => {
        assert.ok(p.id, `Project must have an id`);
        assert.ok(p.title, `Project ${p.id} must have a title`);
        assert.ok(p.category, `Project ${p.id} must have a category`);
        assert.ok(validStatuses.includes(p.status), `Project ${p.id} status '${p.status}' is not valid`);
        assert.ok(p.summary, `Project ${p.id} must have a summary`);
        assert.ok(p.architecture && p.architecture.problem, `Project ${p.id} must have architecture.problem`);
        assert.ok(p.codeSnippet && p.codeSnippet.code, `Project ${p.id} must have codeSnippet.code`);
        assert.ok(p.benchmarks, `Project ${p.id} must have benchmarks`);
        assert.ok(Array.isArray(p.uartLogs) && p.uartLogs.length >= 3, `Project ${p.id} must have at least 3 uartLog lines`);
    });

    // 1.3 Skill tree nodes verification
    assert.ok(Array.isArray(data.skillTreeNodes), 'skillTreeNodes must be an array');
    assert.ok(data.skillTreeNodes.length >= 6, 'skillTreeNodes must have at least 6 spatial nodes');
});

// ---------------------------------------------------------
// TEST 2: PortfolioController Seam Behavior
// ---------------------------------------------------------
test('PortfolioController handles view transitions and project queries', () => {
    const portfolioDataPath = path.join(__dirname, '../../../js/portfolio-data.js');
    const controllerPath = path.join(__dirname, '../../../js/portfolio-controller.js');
    
    assert.ok(fs.existsSync(controllerPath), 'js/portfolio-controller.js must exist');

    const dataCode = fs.readFileSync(portfolioDataPath, 'utf8');
    const controllerCode = fs.readFileSync(controllerPath, 'utf8');

    // Setup mock DOM environment
    const mockElements = {
        'view-tree3d': { style: { display: 'none' } },
        'view-grid': { style: { display: 'none' } },
        'view-profile': { style: { display: 'none' } },
        'tab-tree3d': { classList: { add: () => {}, remove: () => {} } },
        'tab-grid': { classList: { add: () => {}, remove: () => {} } },
        'tab-profile': { classList: { add: () => {}, remove: () => {} } }
    };

    const sandbox = {
        window: {},
        document: {
            getElementById: (id) => mockElements[id] || null,
            querySelectorAll: () => []
        },
        console: console
    };

    const vm = require('vm');
    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);

    const controller = sandbox.PortfolioController || sandbox.window.PortfolioController;
    const data = sandbox.PortfolioData || sandbox.window.PortfolioData;

    assert.ok(controller, 'PortfolioController must exist on window');
    controller.init(data);

    // Initial view should be tree3d
    assert.strictEqual(controller.getActiveView(), 'tree3d', 'Initial active view should be tree3d');

    // Switch view to grid
    controller.switchView('grid');
    assert.strictEqual(controller.getActiveView(), 'grid', 'Active view should switch to grid');

    // Switch view to profile
    controller.switchView('profile');
    assert.strictEqual(controller.getActiveView(), 'profile', 'Active view should switch to profile');

    // Project queries
    const allProjects = controller.getProjects('all');
    assert.strictEqual(allProjects.length, data.projects.length, 'getProjects(all) should return all projects');

    const singleProj = controller.getProjectById(data.projects[0].id);
    assert.strictEqual(singleProj.id, data.projects[0].id, 'getProjectById should return exact project');
});

// ---------------------------------------------------------
// TEST 3: Navigation De-clutter in index.html
// ---------------------------------------------------------
test('index.html navigation is de-cluttered to exactly 3 core tabs', () => {
    const indexPath = path.join(__dirname, '../../../index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    // Must have the 3 new core tabs
    assert.ok(html.includes('id="tab-tree3d"'), 'index.html must have #tab-tree3d');
    assert.ok(html.includes('id="tab-grid"'), 'index.html must have #tab-grid');
    assert.ok(html.includes('id="tab-profile"'), 'index.html must have #tab-profile');

    // Must NOT have the deprecated navigation tabs in the tab-nav bar
    const deprecatedNavIds = ['id="tab-learning"', 'id="tab-practice"', 'id="tab-notebook"', 'id="tab-interview"', 'id="tab-simulator"'];
    deprecatedNavIds.forEach(depId => {
        const inNav = html.indexOf(depId) !== -1;
        assert.ok(!inNav, `index.html nav-tab must NOT contain deprecated ${depId}`);
    });
});

console.log('\n=== TICKET 01 TEST SUITE READY ===');
