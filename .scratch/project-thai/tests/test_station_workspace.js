// ==========================================================================
// TEST SUITE: TICKET 03 - STATION WORKSPACE (SPLIT-VIEW HUD)
// ==========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Mock DOM and Browser Environment
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

// Simple DOM element mock
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
        this.children = [];
        this.style = {};
        this._innerHTML = '';
        this._textContent = '';
        this.value = '';
        this.listeners = {};
    }

    get innerHTML() { return this._innerHTML; }
    set innerHTML(val) {
        this._innerHTML = val;
        // Parse out simple id tags from HTML
        const idMatches = val.match(/id=["']([^"']+)["']/g);
        if (idMatches) {
            idMatches.forEach(m => {
                const id = m.replace(/id=["']|["']/g, '');
                if (!mockDomElements[id]) {
                    const child = new MockElement();
                    child.id = id;
                    mockDomElements[id] = child;
                }
            });
        }
    }

    get textContent() { return this._textContent; }
    set textContent(val) { this._textContent = val; }

    appendChild(child) {
        this.children.push(child);
        if (child.id) mockDomElements[child.id] = child;
        return child;
    }

    querySelector(sel) {
        if (sel.startsWith('#')) return mockDomElements[sel.substring(1)] || null;
        return null;
    }

    querySelectorAll(sel) {
        return [];
    }

    addEventListener(evt, fn) {
        if (!this.listeners[evt]) this.listeners[evt] = [];
        this.listeners[evt].push(fn);
    }

    focus() {}
}

const mockDomElements = {};

global.document = {
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => mockDomElements[id] || null,
    body: new MockElement('body'),
    addEventListener: () => {}
};

global.window = {};
global.navigator = {
    clipboard: {
        writeText: () => Promise.resolve()
    }
};

console.log("=== RUNNING TICKET 03 TEST SUITE ===");

// 2. Load js/tracks.js
const tracksCode = fs.readFileSync(path.join(__dirname, '../../../js/tracks.js'), 'utf8');
eval(tracksCode);

// 3. Load js/station-workspace.js
const wsCode = fs.readFileSync(path.join(__dirname, '../../../js/station-workspace.js'), 'utf8');
eval(wsCode);

console.log("\n[TEST 1] Verifying Controller Initialization & DOM Bootstrapping...");
const ws = window.stationWorkspaceController;
assert(ws, "stationWorkspaceController must be instantiated");
assert(mockDomElements["station-workspace-overlay"], "Overlay DOM element must be created");
assert(mockDomElements["station-override-modal"], "Override modal DOM element must be created");
console.log("✓ DOM overlay and modal elements initialized.");

console.log("\n[TEST 2] Testing openStation('s01')...");
ws.openStation("s01");
assert.strictEqual(ws.currentStationId, "s01", "Current station must be s01");
assert(ws.overlayEl.classList.contains("active"), "Workspace overlay must have 'active' class");

// Verify Header content
const titleEl = mockDomElements["ws-station-title"];
assert(titleEl && titleEl.textContent.includes("Thao Tác Bit"), "Title must contain station name");

const xpEl = mockDomElements["ws-xp-badge"];
assert(xpEl && xpEl.textContent.includes("+100 XP"), "XP badge must show +100 XP");

// Verify Theory content
const theoryEl = mockDomElements["ws-theory-summary"];
assert(theoryEl && theoryEl.innerHTML.length > 20, "Theory summary must be loaded");

const diagramEl = mockDomElements["ws-diagram-box"];
assert(diagramEl && diagramEl.textContent.length > 10, "Diagram must be loaded");

// Verify Code Lab content
const codeEl = mockDomElements["ws-code-view"];
assert(codeEl && codeEl.textContent.includes("atomic_gpio_set_high"), "Code view must contain sample C code");
console.log("✓ Station s01 loaded with complete theory, diagram, and code lab.");

console.log("\n[TEST 3] Testing Tab Switching (Code -> Sim -> Quiz)...");
ws.switchTab("sim");
assert.strictEqual(ws.activeTab, "sim", "Active tab must be sim");
ws.switchTab("quiz");
assert.strictEqual(ws.activeTab, "quiz", "Active tab must be quiz");
ws.switchTab("code");
assert.strictEqual(ws.activeTab, "code", "Active tab must be code");
console.log("✓ Tab navigation functions properly.");

console.log("\n[TEST 4] Testing Simulator Interactions...");
// Station s01 has simulator.type = 'register'
ws.renderSimulator(window.trackStateManager.getStation("s01"));
// Toggle bit 3
ws.toggleSimBit(3);
assert.strictEqual(ws.simRegisterVal, 8, "Toggling bit 3 must set register to 8 (0x08)");
// Toggle bit 0
ws.toggleSimBit(0);
assert.strictEqual(ws.simRegisterVal, 9, "Toggling bit 0 must set register to 9 (0x09)");
// Untoggle bit 3
ws.toggleSimBit(3);
assert.strictEqual(ws.simRegisterVal, 1, "Untoggling bit 3 must leave register at 1 (0x01)");
console.log("✓ Register bit toggling simulator verified.");

console.log("\n[TEST 5] Testing Quiz Answering & Evaluation...");
// Select correct option for question 0 (which is option 0)
ws.selectQuizOption(0, 0);
assert.strictEqual(ws.quizUserAnswers[0], 0, "Question 0 user answer should be 0");

// Select correct option for question 1 (which is option 0)
ws.selectQuizOption(1, 0);
assert.strictEqual(ws.quizUserAnswers[1], 0, "Question 1 user answer should be 0");

// Submit Quiz
ws.submitQuiz();
const stProgress = window.trackStateManager.getStation("s01").userProgress;
assert.strictEqual(stProgress.status, "mastered", "Station s01 must now be mastered");
assert.strictEqual(stProgress.quizPassed, true, "Quiz must be marked passed");
assert(stProgress.quizScore >= 80, "Score must be >= 80%");
console.log("✓ Quiz evaluation and Station mastery verified.");

console.log("\n[TEST 6] Testing Engineer Override Modal & Bypass...");
ws.openOverrideModal();
assert(ws.overrideModalEl.classList.contains("active"), "Override modal must be active");

const passcodeEl = mockDomElements["override-passcode-input"];
if (passcodeEl) passcodeEl.value = "123456";
ws.submitOverridePasscode();

assert.strictEqual(window.trackStateManager.isEngineerOverrideActive(), true, "Override must be active");
assert(!ws.overrideModalEl.classList.contains("active"), "Override modal must close on success");
console.log("✓ Engineer Override passcode flow verified.");

console.log("\n[TEST 7] Testing closeStation()...");
ws.closeStation();
assert(!ws.overlayEl.classList.contains("active"), "Overlay must not be active after close");
assert.strictEqual(ws.currentStationId, null, "Current station must be null");
console.log("✓ Workspace closes cleanly.");

console.log("\n=== ALL TICKET 03 TESTS PASSED PERFECTLY ===");
