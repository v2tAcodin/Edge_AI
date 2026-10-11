// ==========================================================================
// TEST SUITE: TICKET 02 - CURRICULUM ENGINE & TRACK STATE MANAGER
// ==========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Setup mock browser environment
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

global.window = {};

// 2. Load js/tracks.js
const tracksJsPath = path.join(__dirname, '../../../js/tracks.js');
const tracksCode = fs.readFileSync(tracksJsPath, 'utf8');

// Evaluate in global context
eval(tracksCode);

console.log("=== RUNNING TICKET 02 VERIFICATION SUITE ===");

// TEST 1: Check 4 Canonical Tracks
console.log("\n[TEST 1] Verifying 4 Canonical Learning Tracks...");
assert(Array.isArray(window.LEARNING_TRACKS), "LEARNING_TRACKS must be an array");
assert.strictEqual(window.LEARNING_TRACKS.length, 4, "Must have exactly 4 Learning Tracks");

const expectedTrackIds = ["track-c-core", "track-esp32-sys", "track-tinyml", "track-capstone"];
const actualTrackIds = window.LEARNING_TRACKS.map(t => t.id);
assert.deepStrictEqual(actualTrackIds, expectedTrackIds, "Tracks IDs must match canonical spec");

window.LEARNING_TRACKS.forEach(t => {
    assert(t.title, `Track ${t.id} must have a title`);
    assert(t.vietnameseTitle, `Track ${t.id} must have a vietnameseTitle`);
    assert(t.icon, `Track ${t.id} must have an icon`);
    assert(t.color, `Track ${t.id} must have a color`);
    assert(t.summary, `Track ${t.id} must have a summary`);
});
console.log("✓ All 4 Learning Tracks valid.");

// TEST 2: Check 24 Skill Stations Structure & Integrity
console.log("\n[TEST 2] Verifying 24 Skill Stations Structure...");
assert(Array.isArray(window.SKILL_STATIONS), "SKILL_STATIONS must be an array");
assert.strictEqual(window.SKILL_STATIONS.length, 24, "Must have exactly 24 Skill Stations");

// 6 per track
expectedTrackIds.forEach(tId => {
    const stationsInTrack = window.SKILL_STATIONS.filter(s => s.trackId === tId);
    assert.strictEqual(stationsInTrack.length, 6, `Track ${tId} must have exactly 6 stations`);
});

const stationIds = new Set();
window.SKILL_STATIONS.forEach(st => {
    assert(!stationIds.has(st.id), `Duplicate station ID: ${st.id}`);
    stationIds.add(st.id);

    assert(st.title, `Station ${st.id} must have a title`);
    assert(st.category, `Station ${st.id} must have a category`);
    assert(typeof st.xpReward === 'number' && st.xpReward > 0, `Station ${st.id} must have positive xpReward`);
    assert(st.coordinates3D && typeof st.coordinates3D.x === 'number', `Station ${st.id} must have 3D coordinates`);
    
    // Theory
    assert(st.theory && st.theory.summary, `Station ${st.id} must have theory summary`);
    assert(Array.isArray(st.theory.keyTakeaways) && st.theory.keyTakeaways.length > 0, `Station ${st.id} must have key takeaways`);
    
    // CodeLab
    assert(st.codeLab && st.codeLab.sampleCode, `Station ${st.id} must have sample C code`);
    
    // Simulator
    assert(st.simulator && st.simulator.type, `Station ${st.id} must have simulator config`);
    
    // Quiz
    assert(st.quiz && Array.isArray(st.quiz.questions) && st.quiz.questions.length > 0, `Station ${st.id} must have quiz questions`);
    st.quiz.questions.forEach((q, idx) => {
        assert(q.question, `Station ${st.id} question ${idx} must have text`);
        assert(Array.isArray(q.options) && q.options.length >= 2, `Station ${st.id} question ${idx} must have >= 2 options`);
        assert(typeof q.correct === 'number' && q.correct >= 0 && q.correct < q.options.length, `Station ${st.id} question ${idx} correct index valid`);
        assert(q.explanation, `Station ${st.id} question ${idx} must have explanation`);
    });

    // Check prerequisites exist
    if (st.prerequisites) {
        st.prerequisites.forEach(preId => {
            assert(window.SKILL_STATIONS.some(s => s.id === preId), `Prerequisite ${preId} for ${st.id} does not exist`);
        });
    }
});
console.log("✓ All 24 Skill Stations passed structural and relational validation.");

// TEST 3: TrackStateManager Progression Gate & State Transitions
console.log("\n[TEST 3] Testing TrackStateManager Progression Gate...");
const mgr = window.trackStateManager;

// Reset manager to clean slate
localStorage.clear();
sessionStorage.clear();
mgr.init();

// Station 1 (s01) has no prerequisites -> unlocked
const s01 = mgr.getStation("s01");
assert.strictEqual(s01.userProgress.isUnlocked, true, "s01 should be unlocked by default");
assert.strictEqual(s01.userProgress.status, "unlocked", "s01 status should be unlocked");

// Station 2 (s02) requires s01 -> locked
const s02 = mgr.getStation("s02");
assert.strictEqual(s02.userProgress.isUnlocked, false, "s02 should be locked initially");
assert.strictEqual(s02.userProgress.status, "locked", "s02 status should be locked");

// Mark s01 as viewed
mgr.markStationViewed("s01");
assert.strictEqual(mgr.getStation("s01").userProgress.status, "in-progress", "s01 should be in-progress after viewing");

// Fail quiz on s01 (score 50% < 80%)
const failRes = mgr.recordStationQuiz("s01", 1, 2); // 50%
assert.strictEqual(failRes.passed, false, "50% should fail quiz");
assert.strictEqual(failRes.newlyMastered, false, "Should not be newly mastered");
assert.strictEqual(mgr.getStation("s02").userProgress.isUnlocked, false, "s02 should still be locked");

// Pass quiz on s01 (score 100% >= 80%)
const passRes = mgr.recordStationQuiz("s01", 2, 2); // 100%
assert.strictEqual(passRes.passed, true, "100% should pass quiz");
assert.strictEqual(passRes.newlyMastered, true, "Should be newly mastered");
assert.strictEqual(passRes.xpAwarded, 100, "Should award 100 XP");

// Now s01 is mastered, and s02 is unlocked!
assert.strictEqual(mgr.getStation("s01").userProgress.status, "mastered", "s01 should now be mastered");
assert.strictEqual(mgr.getStation("s02").userProgress.isUnlocked, true, "s02 should now be unlocked!");
console.log("✓ Progression Gate unlocked s02 upon s01 mastery.");

// TEST 4: Engineer Override
console.log("\n[TEST 4] Testing Engineer Override...");
// Station 6 (s06) and Station 12 (s12) should be locked
assert.strictEqual(mgr.isStationUnlocked("s06"), false, "s06 should be locked");
assert.strictEqual(mgr.isEngineerOverrideActive(), false, "Override should be inactive initially");

// Activate override
const overrideSuccess = mgr.verifyAndSetEngineerOverride("123456");
assert.strictEqual(overrideSuccess, true, "Valid passcode 123456 should activate override");
assert.strictEqual(mgr.isEngineerOverrideActive(), true, "Override flag should be active in session");
assert.strictEqual(mgr.isStationUnlocked("s06"), true, "s06 should now be unlocked via override");
assert.strictEqual(mgr.isStationUnlocked("s24"), true, "s24 should now be unlocked via override");

// Deactivate override
mgr.setEngineerOverride(false);
assert.strictEqual(mgr.isEngineerOverrideActive(), false, "Override should be inactive after disable");
assert.strictEqual(mgr.isStationUnlocked("s06"), false, "s06 should be locked again");
console.log("✓ Engineer Override verified successfully.");

// TEST 5: StateMigrationAdapter
console.log("\n[TEST 5] Testing StateMigrationAdapter with legacy localStorage data...");
localStorage.clear();
sessionStorage.clear();

// Mock legacy data: solved prob_1 and prob_25, completed t1 and t2
const mockProfile = {
    name: "Mr. Thai",
    xp: 1500,
    solvedProblems: ["prob_1", "prob_25"]
};
const mockRoadmap = [
    {
        stage: "C & Memory",
        tasks: [
            { id: "t1", done: true },
            { id: "t2", done: true },
            { id: "t3", done: false }
        ]
    }
];

localStorage.setItem("mr_thai_edgeai_profile_v2", JSON.stringify(mockProfile));
localStorage.setItem("mr_thai_edgeai_roadmap_v2", JSON.stringify(mockRoadmap));

// Run migration
window.StateMigrationAdapter.runMigration();
mgr.init();

// s01 and s02 map to t1 / prob_1 -> should be mastered
assert.strictEqual(mgr.getStation("s01").userProgress.status, "mastered", "s01 should be migrated to mastered");
assert.strictEqual(mgr.getStation("s02").userProgress.status, "mastered", "s02 should be migrated to mastered");
// s03 maps to t2 -> should be mastered
assert.strictEqual(mgr.getStation("s03").userProgress.status, "mastered", "s03 should be migrated to mastered");
// s07 maps to prob_25 -> should be mastered
assert.strictEqual(mgr.getStation("s07").userProgress.status, "mastered", "s07 should be migrated to mastered");

// Verify XP was NOT reset or reduced
const profAfter = JSON.parse(localStorage.getItem("mr_thai_edgeai_profile_v2"));
assert(profAfter.xp >= 1500, `Profile XP (${profAfter.xp}) must not be decreased`);

console.log("✓ Legacy state cleanly migrated without data loss.");

// TEST 6: Mastery Calculations
console.log("\n[TEST 6] Testing Mastery Calculations...");
const track1Stats = mgr.getTrackMastery("track-c-core");
assert(track1Stats.total === 6, "Track 1 should have 6 stations");
assert(track1Stats.mastered === 3, "Track 1 should have 3 mastered stations (s01, s02, s03)");
assert.strictEqual(track1Stats.percent, 50, "Track 1 should be 50% mastered");

const overallStats = mgr.getOverallMastery();
assert.strictEqual(overallStats.totalStations, 24, "Total stations should be 24");
assert(overallStats.masteredStations >= 4, "Overall mastered should be >= 4");
console.log("✓ Track mastery calculations verified.");

console.log("\n=== ALL TICKET 02 TESTS PASSED PERFECTLY ===");
