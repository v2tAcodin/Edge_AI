/**
 * Test Suite: Ticket 05 - Profile HUD, Recruiter Quick Dock & PWA Offline Verification
 * Verifies Profile HUD rendering, Skills Radar Matrix SVG, Recruiter Quick Dock, and sw.js cache manifest.
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

console.log('=== RUNNING TICKET 05 TEST SUITE: PROFILE HUD & PWA E2E ===\n');

// ---------------------------------------------------------
// TEST 1: Profile HUD & Radar Matrix SVG Rendering
// ---------------------------------------------------------
test('Profile view renders engineer bio, principles, and 4-axis Skills Radar Matrix SVG', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const profileCode = fs.readFileSync(path.join(__dirname, '../../../js/profile.js'), 'utf8');

    let elements = {};
    function makeElement(id) {
        const el = {
            id,
            _innerHTML: '',
            set innerHTML(v) { this._innerHTML = v; },
            get innerHTML() { return this._innerHTML; },
            _innerText: '',
            set innerText(v) { this._innerText = v; },
            get innerText() { return this._innerText; },
            style: {},
            classList: { add: () => {}, remove: () => {} }
        };
        elements[id] = el;
        return el;
    }

    // Prepare required profile DOM elements
    [
        'hero-name-display', 'hero-role-display', 'hero-bio-display', 'hero-badge-status',
        'profile-principles-container', 'skills-radar-container', 'profile-connect-links',
        'profile-projects-summary', 'auto-cv-text'
    ].forEach(id => makeElement(id));

    const sandbox = {
        window: {
            PortfolioData: null
        },
        document: {
            getElementById: (id) => elements[id] || makeElement(id)
        },
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(profileCode, sandbox);

    const data = sandbox.PortfolioData || sandbox.window.PortfolioData;
    assert.ok(data, 'PortfolioData must exist');

    if (typeof sandbox.renderProfileView === 'function') {
        sandbox.renderProfileView();
    } else if (sandbox.window && typeof sandbox.window.renderProfileView === 'function') {
        sandbox.window.renderProfileView();
    }

    // Check engineer name and role
    const roleEl = elements['hero-role-display'];
    assert.ok(roleEl.innerText.includes('Edge AI') || roleEl.innerText.includes('Embedded'), 'Role must reflect Embedded/Edge AI');

    // Check Radar Matrix SVG
    const radarEl = elements['skills-radar-container'];
    assert.ok(radarEl.innerHTML.includes('<svg'), 'Radar container must contain SVG element');
    assert.ok(radarEl.innerHTML.includes('<polygon'), 'Radar SVG must contain polygon data');
    assert.ok(radarEl.innerHTML.includes('Embedded Core') || radarEl.innerHTML.includes('Firmware'), 'Radar must include Embedded Core');
    assert.ok(radarEl.innerHTML.includes('Edge AI') || radarEl.innerHTML.includes('TinyML'), 'Radar must include Edge AI');
});

// ---------------------------------------------------------
// TEST 2: Recruiter Quick Dock markup in index.html
// ---------------------------------------------------------
test('index.html includes streamlined Recruiter Quick Dock', () => {
    const html = fs.readFileSync(path.join(__dirname, '../../../index.html'), 'utf8');

    assert.ok(html.includes('id="recruiter-quick-dock"') || html.includes('id="floating-toolkit-dock"'), 'Quick dock must exist in index.html');
    assert.ok(html.includes('AudioEngine'), 'Dock must contain Lo-Fi audio trigger');
    assert.ok(html.includes('toggleTheme'), 'Dock must contain theme toggle');
    assert.ok(html.includes('print') || html.includes('profile'), 'Dock must contain CV / Profile trigger');
});

// ---------------------------------------------------------
// TEST 3: Service Worker sw.js Cache Manifest Completeness
// ---------------------------------------------------------
test('Service Worker sw.js contains cache version v5 and all core showcase assets', () => {
    const swContent = fs.readFileSync(path.join(__dirname, '../../../sw.js'), 'utf8');

    assert.ok(swContent.includes('v5'), 'sw.js must have cache version v5');
    assert.ok(swContent.includes('portfolio-data.js'), 'sw.js must precache portfolio-data.js');
    assert.ok(swContent.includes('portfolio-controller.js'), 'sw.js must precache portfolio-controller.js');
    assert.ok(swContent.includes('cyber-tree3d.js'), 'sw.js must precache cyber-tree3d.js');
    assert.ok(swContent.includes('portfolio-grid.js'), 'sw.js must precache portfolio-grid.js');
    assert.ok(swContent.includes('portfolio-hud.js'), 'sw.js must precache portfolio-hud.js');
    assert.ok(swContent.includes('portfolio-hud.css'), 'sw.js must precache portfolio-hud.css');
});

// ---------------------------------------------------------
// TEST 4: Full End-to-End Showcase Integration
// ---------------------------------------------------------
test('End-to-End: View routing, project selection, HUD modal & UART player work in harmony', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const hudCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-hud.js'), 'utf8');
    const gridCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-grid.js'), 'utf8');

    let elements = {};
    let eventListeners = {};

    function makeElement(id) {
        const el = {
            id,
            style: { display: 'none' },
            classList: {
                _classes: new Set(),
                add: function(c) { this._classes.add(c); },
                remove: function(c) { this._classes.delete(c); },
                contains: function(c) { return this._classes.has(c); }
            },
            _innerHTML: '',
            set innerHTML(v) { this._innerHTML = v; },
            get innerHTML() { return this._innerHTML; },
            appendChild: () => {},
            querySelectorAll: () => [],
            querySelector: () => null
        };
        elements[id] = el;
        return el;
    }

    const sandbox = {
        window: {
            addEventListener: (ev, fn) => {
                eventListeners[ev] = eventListeners[ev] || [];
                eventListeners[ev].push(fn);
            },
            dispatchEvent: (e) => {
                const list = eventListeners[e.type] || [];
                list.forEach(fn => fn(e));
            },
            PortfolioData: null,
            PortfolioController: null,
            PortfolioGrid: null,
            PortfolioHUD: null,
            CyberTree3D: { resetCameraFocus: () => {} }
        },
        document: {
            getElementById: (id) => elements[id] || makeElement(id),
            createElement: (tag) => makeElement(`elem_${Math.random()}`),
            body: { appendChild: (el) => { elements[el.id] = el; } },
            querySelectorAll: () => []
        },
        CustomEvent: class {
            constructor(type, opts = {}) {
                this.type = type;
                this.detail = opts.detail || {};
            }
        },
        setInterval: (fn) => setInterval(fn, 10),
        clearInterval: (id) => clearInterval(id),
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);
    vm.runInContext(hudCode, sandbox);
    vm.runInContext(gridCode, sandbox);

    const controller = sandbox.PortfolioController || sandbox.window.PortfolioController;
    const data = sandbox.PortfolioData || sandbox.window.PortfolioData;
    const hud = sandbox.PortfolioHUD || sandbox.window.PortfolioHUD;
    const grid = sandbox.PortfolioGrid || sandbox.window.PortfolioGrid;

    controller.init(data);
    hud.init();
    grid.init();

    // 1. Switch to 3D Tree
    controller.switchView('tree3d');
    assert.strictEqual(controller.getActiveView(), 'tree3d');

    // 2. Select project via controller (simulates clicking 3D star or grid card)
    const selectedProj = controller.selectProject('esp32-s3-vision-guard');
    assert.ok(selectedProj, 'Project must be selected');

    // 3. HUD should be active
    const hudEl = elements['project-deepdive-hud'];
    assert.ok(hudEl.classList.contains('active'), 'HUD must open upon project selection');

    // 4. Switch view to Grid
    controller.switchView('grid');
    assert.strictEqual(controller.getActiveView(), 'grid');

    // 5. Switch view to Profile
    controller.switchView('profile');
    assert.strictEqual(controller.getActiveView(), 'profile');
});

console.log('\n=== TICKET 05 TEST SUITE READY ===');
