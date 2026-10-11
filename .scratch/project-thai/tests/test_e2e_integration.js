// ==========================================================================
// TEST SUITE: TICKET 05 - END-TO-END INTEGRATION & PWA OFFLINE VERIFICATION
// ==========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=== RUNNING TICKET 05 E2E INTEGRATION SUITE ===");

const rootDir = path.join(__dirname, '../../../');

// 1. Verify manifest.json
console.log("\n[TEST 1] Verifying manifest.json PWA specification...");
const manifestPath = path.join(rootDir, 'manifest.json');
assert(fs.existsSync(manifestPath), "manifest.json must exist");
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.strictEqual(manifest.name, "Project Thai // Personal Mastery HUD", "Manifest name must be Project Thai");
assert.strictEqual(manifest.short_name, "ProjectThai", "Manifest short_name must be ProjectThai");
assert.strictEqual(manifest.display, "standalone", "PWA display must be standalone");
assert(manifest.icons && manifest.icons.length > 0, "Manifest must declare icons");
console.log("✓ manifest.json is fully compliant with PWA criteria.");

// 2. Verify Service Worker Precache Assets exist on disk
console.log("\n[TEST 2] Verifying sw.js precache assets integrity...");
const swPath = path.join(rootDir, 'sw.js');
assert(fs.existsSync(swPath), "sw.js must exist");
const swContent = fs.readFileSync(swPath, 'utf8');

assert(swContent.includes("project-thai-hud-v4.0.0"), "sw.js must have updated CACHE_NAME");

// Extract precache array
const precacheMatch = swContent.match(/const PRECACHE_ASSETS = \[(.*?)\];/s);
assert(precacheMatch, "PRECACHE_ASSETS array must be found in sw.js");

const assetPaths = precacheMatch[1]
    .split('\n')
    .map(line => line.trim().replace(/^['"]|['"],?$/g, ''))
    .filter(p => p.length > 0 && !p.startsWith('http') && !p.startsWith('//'));

assetPaths.forEach(assetRel => {
    let checkPath;
    if (assetRel === './' || assetRel === '') {
        checkPath = path.join(rootDir, 'index.html');
    } else {
        const cleaned = assetRel.replace(/^\.\//, '');
        checkPath = path.join(rootDir, cleaned);
    }
    assert(fs.existsSync(checkPath), `Asset in sw.js does not exist on disk: ${assetRel} -> ${checkPath}`);
});
console.log(`✓ All ${assetPaths.length} local files in sw.js PRECACHE_ASSETS exist on disk!`);

// 3. E2E User Journey Simulation
console.log("\n[TEST 3] Simulating Complete User Journey & Station Mastery...");

// Setup DOM mock
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
    constructor() {
        this.id = '';
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
        this.children = [];
        this._innerHTML = '';
        this._textContent = '';
        this.value = '';
        this.listeners = {};
    }
    get innerHTML() { return this._innerHTML; }
    set innerHTML(v) {
        this._innerHTML = v;
        const idMatches = v.match(/id=["']([^"']+)["']/g);
        if (idMatches) {
            idMatches.forEach(m => {
                const id = m.replace(/id=["']|["']/g, '');
                if (!mockDom[id]) {
                    const c = new MockElement();
                    c.id = id;
                    mockDom[id] = c;
                }
            });
        }
    }
    get textContent() { return this._textContent; }
    set textContent(v) { this._textContent = v; }
    appendChild(c) { this.children.push(c); if (c.id) mockDom[c.id] = c; return c; }
    querySelector(s) { if (s.startsWith('#')) return mockDom[s.substring(1)] || null; return null; }
    querySelectorAll() { return []; }
    addEventListener(e, fn) { if (!this.listeners[e]) this.listeners[e] = []; this.listeners[e].push(fn); }
    focus() {}
}

const mockDom = {};
global.document = {
    createElement: () => new MockElement(),
    getElementById: (id) => mockDom[id] || null,
    querySelectorAll: () => [],
    body: new MockElement(),
    addEventListener: () => {}
};

global.window = {};
global.showToast = () => {};

global.STORAGE_PROFILE = "mr_thai_edgeai_profile_v2";
global.STORAGE_ROADMAP = "mr_thai_edgeai_roadmap_v2";
global.STORAGE_NOTES = "mr_thai_edgeai_notes_v2";
global.STORAGE_STREAK = "mr_thai_study_streak_v2";
global.STORAGE_CODE_CACHE = "mr_thai_codelearn_cache_v2";
global.STORAGE_BACKUP_HISTORY = "mr_thai_backup_history_v1";

// Load code modules
eval(fs.readFileSync(path.join(rootDir, 'js/state.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'js/tracks.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'js/station-workspace.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'js/backup.js'), 'utf8'));

// Step 3.1: Verify Initial Progression Gate
const mgr = window.trackStateManager;
const ws = window.stationWorkspaceController;

// Start fresh
localStorage.clear();
sessionStorage.clear();
mgr.init();

// Station 1 is unlocked, Station 2 is locked
assert.strictEqual(mgr.isStationUnlocked("s01"), true, "s01 should be unlocked");
assert.strictEqual(mgr.isStationUnlocked("s02"), false, "s02 should be locked");

// Step 3.2: Open Station 1
ws.openStation("s01");
assert.strictEqual(ws.currentStationId, "s01", "Workspace active on s01");

// Step 3.3: Pass Station 1 Quiz (100%)
ws.selectQuizOption(0, 0);
ws.selectQuizOption(1, 0);
ws.submitQuiz();

// Step 3.4: Verify s01 mastered and s02 unlocked
assert.strictEqual(mgr.getStationStatus("s01"), "mastered", "s01 must be mastered");
assert.strictEqual(mgr.isStationUnlocked("s02"), true, "s02 must now be unlocked!");
console.log("✓ Progression Gate unlocked Station 2 after Station 1 mastery.");

// Step 3.5: Test Backup Payload contains Project Thai Stations
console.log("\n[TEST 4] Testing Backup Export & Restore Integration...");
const backupSnapshot = createBackupSnapshotPayload("Kiểm thử E2E");
assert.strictEqual(backupSnapshot.appName, "Project Thai // Personal Mastery HUD", "Backup must have Project Thai appName");
assert(backupSnapshot.projectThaiStations, "Backup must include projectThaiStations payload");
assert.strictEqual(backupSnapshot.projectThaiStations["s01"].status, "mastered", "s01 must be saved as mastered in backup");

// Simulate wipe and restore
localStorage.clear();
mgr.init();
assert.strictEqual(mgr.getStationStatus("s01"), "unlocked", "After wipe, s01 should be back to unlocked");

// Restore from snapshot
applyRestoredData(backupSnapshot);
assert.strictEqual(mgr.getStationStatus("s01"), "mastered", "After restore, s01 must be restored to mastered");
assert.strictEqual(mgr.isStationUnlocked("s02"), true, "After restore, s02 must be unlocked");
console.log("✓ Backup & Restore preserves 100% of Project Thai Station progress.");

console.log("\n=== ALL E2E INTEGRATION TESTS PASSED PERFECTLY ===");
