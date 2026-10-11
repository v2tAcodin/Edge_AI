/**
 * Test Suite: Ticket 04 - Un-gated Project Deep-Dive HUD with Interactive UART Console
 * Verifies PortfolioHUD modal lifecycle, un-gated access to all 6 projects, 4-tab content,
 * and the interactive UART serial stream player.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function test(name, fn) {
    if (fn.length > 0) {
        fn((err) => {
            if (err) {
                console.error(`  ✗ ${name}`);
                console.error(`    Error: ${err.message}`);
                process.exitCode = 1;
            } else {
                console.log(`  ✓ ${name}`);
            }
        });
        return;
    }
    try {
        fn();
        console.log(`  ✓ ${name}`);
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(`    Error: ${err.message}`);
        process.exitCode = 1;
    }
}

console.log('=== RUNNING TICKET 04 TEST SUITE: DEEP-DIVE HUD & UART CONSOLE ===\n');

// ---------------------------------------------------------
// Helper: Setup DOM Sandbox with Portfolio Core
// ---------------------------------------------------------
function createHudSandbox() {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const controllerCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-controller.js'), 'utf8');
    const hudCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-hud.js'), 'utf8');

    let elements = {};
    let eventListeners = {};

    function makeElement(id, tag = 'div') {
        const el = {
            id,
            tagName: tag.toUpperCase(),
            style: { display: 'none' },
            classList: {
                _classes: new Set(),
                add: function(c) { this._classes.add(c); },
                remove: function(c) { this._classes.delete(c); },
                contains: function(c) { return this._classes.has(c); }
            },
            _innerHTML: '',
            set innerHTML(val) { this._innerHTML = val; },
            get innerHTML() { return this._innerHTML; },
            _innerText: '',
            set innerText(val) { this._innerText = val; },
            get innerText() { return this._innerText; },
            children: [],
            appendChild: function(c) { this.children.push(c); return c; },
            querySelectorAll: function() { return []; },
            querySelector: function() { return null; },
            setAttribute: function() {},
            getAttribute: function() { return null; },
            scrollTop: 0,
            scrollHeight: 100
        };
        elements[id] = el;
        return el;
    }

    const sandbox = {
        window: {
            addEventListener: (event, handler) => {
                eventListeners[event] = eventListeners[event] || [];
                eventListeners[event].push(handler);
            },
            dispatchEvent: (e) => {
                const list = eventListeners[e.type] || [];
                list.forEach(fn => fn(e));
            },
            PortfolioData: null,
            PortfolioController: null,
            CyberTree3D: {
                cameraResetCalled: false,
                resetCameraFocus: function() { this.cameraResetCalled = true; }
            }
        },
        document: {
            getElementById: (id) => elements[id] || null,
            createElement: (tag) => makeElement(`elem_${Math.random().toString(36).substr(2, 6)}`, tag),
            body: {
                appendChild: (el) => { elements[el.id] = el; return el; }
            },
            querySelectorAll: () => [],
            addEventListener: (event, handler) => {
                eventListeners[event] = eventListeners[event] || [];
                eventListeners[event].push(handler);
            }
        },
        CustomEvent: class {
            constructor(type, opts = {}) {
                this.type = type;
                this.detail = opts.detail || {};
            }
        },
        setInterval: (fn, ms) => setInterval(fn, ms),
        clearInterval: (id) => clearInterval(id),
        setTimeout: (fn, ms) => setTimeout(fn, ms),
        clearTimeout: (id) => clearTimeout(id),
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(controllerCode, sandbox);
    vm.runInContext(hudCode, sandbox);

    const data = sandbox.PortfolioData || sandbox.window.PortfolioData;
    const controller = sandbox.PortfolioController || sandbox.window.PortfolioController;
    if (controller && data) controller.init(data);

    const PortfolioHUD = sandbox.PortfolioHUD || sandbox.window.PortfolioHUD;
    return { sandbox, data, controller, PortfolioHUD, elements, eventListeners };
}

// ---------------------------------------------------------
// TEST 1: HUD Initialization & DOM Creation
// ---------------------------------------------------------
test('PortfolioHUD initializes DOM overlay and binds global event listeners', () => {
    const { PortfolioHUD, elements } = createHudSandbox();
    assert.ok(PortfolioHUD, 'PortfolioHUD module must exist');

    PortfolioHUD.init();
    assert.ok(elements['project-deepdive-hud'], 'HUD overlay element #project-deepdive-hud must be created/connected');
});

// ---------------------------------------------------------
// TEST 2: Un-gated Opening of Projects and 4-Tab Population
// ---------------------------------------------------------
test('PortfolioHUD opens any project without gate and renders all 4 tabs', () => {
    const { PortfolioHUD, data, controller, elements } = createHudSandbox();
    PortfolioHUD.init();

    // Verify un-gated opening for all 6 projects
    data.projects.forEach(proj => {
        PortfolioHUD.open(proj.id);
        const hudEl = elements['project-deepdive-hud'];
        assert.ok(hudEl.classList.contains('active'), `HUD must be active for project: ${proj.id}`);
        assert.ok(hudEl.innerHTML.includes(proj.title), `HUD must contain title for: ${proj.title}`);
        assert.ok(hudEl.innerHTML.includes(proj.status), `HUD must contain status for: ${proj.status}`);
    });

    // Test specific project: esp32-s3-vision-guard
    const pVision = data.projects[0];
    PortfolioHUD.open(pVision.id);

    // Tab 1: Architecture
    PortfolioHUD.switchTab('arch');
    const hudHtml = elements['project-deepdive-hud'].innerHTML;
    assert.ok(hudHtml.includes(pVision.architecture.problem), 'Tab 1 must contain problem statement');
    assert.ok(hudHtml.includes(pVision.architecture.solution), 'Tab 1 must contain solution');

    // Tab 3: Key Implementation (Code)
    PortfolioHUD.switchTab('code');
    const codeHtml = elements['project-deepdive-hud'].innerHTML;
    assert.ok(codeHtml.includes(pVision.codeSnippet.title), 'Tab 3 must contain code snippet title');
    assert.ok(codeHtml.includes('esp_nn_depthwise_conv_s8'), 'Tab 3 must contain code function');

    // Tab 4: Benchmarks & Hardware BOM
    PortfolioHUD.switchTab('bench');
    const benchHtml = elements['project-deepdive-hud'].innerHTML;
    assert.ok(benchHtml.includes(pVision.benchmarks.fps), 'Tab 4 must contain FPS metric');
    assert.ok(benchHtml.includes('OV2640 2-Megapixel Camera Module'), 'Tab 4 must contain Hardware BOM item');
});

// ---------------------------------------------------------
// TEST 3: Interactive UART Serial Console Player
// ---------------------------------------------------------
test('PortfolioHUD UART Console streams telemetry logs and handles playback controls', (done) => {
    const { PortfolioHUD, data } = createHudSandbox();
    PortfolioHUD.init();

    const pVision = data.projects[0];
    PortfolioHUD.open(pVision.id);
    PortfolioHUD.switchTab('uart');

    // Start UART streaming
    assert.ok(typeof PortfolioHUD.startUartStream === 'function', 'startUartStream must exist');
    assert.ok(typeof PortfolioHUD.pauseUartStream === 'function', 'pauseUartStream must exist');
    assert.ok(typeof PortfolioHUD.replayUartStream === 'function', 'replayUartStream must exist');

    PortfolioHUD.startUartStream(5); // fast interval for test (5ms)

    setTimeout(() => {
        const logsRendered = PortfolioHUD.getRenderedLogsCount();
        assert.ok(logsRendered > 0, `UART console must have streamed lines (got: ${logsRendered})`);

        // Test Pause
        PortfolioHUD.pauseUartStream();
        const countAfterPause = PortfolioHUD.getRenderedLogsCount();

        setTimeout(() => {
            assert.strictEqual(PortfolioHUD.getRenderedLogsCount(), countAfterPause, 'Log count must not increase while paused');

            // Test Replay
            PortfolioHUD.replayUartStream(5);
            setTimeout(() => {
                PortfolioHUD.pauseUartStream();
                done();
            }, 30);
        }, 30);
    }, 50);
});

// ---------------------------------------------------------
// TEST 4: HUD Close Lifecycle and Camera Reset
// ---------------------------------------------------------
test('PortfolioHUD close() hides modal and triggers 3D camera reset', () => {
    const { PortfolioHUD, sandbox, elements } = createHudSandbox();
    PortfolioHUD.init();

    PortfolioHUD.open('esp32-s3-vision-guard');
    assert.ok(elements['project-deepdive-hud'].classList.contains('active'), 'HUD must be active');

    PortfolioHUD.close();
    assert.ok(!elements['project-deepdive-hud'].classList.contains('active'), 'HUD must not be active after close()');
    assert.strictEqual(sandbox.window.CyberTree3D.cameraResetCalled, true, 'CyberTree3D.resetCameraFocus must be called on close()');
});

console.log('\n=== TICKET 04 TEST SUITE READY ===');
