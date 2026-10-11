// Test suite for QuickNotes (Sổ Ghi Chú Nhanh)
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=== RUNNING QUICK NOTES TEST SUITE ===");

const rootDir = path.resolve(__dirname, '../../..');

// 1. Check file existence
const cssPath = path.join(rootDir, 'css/quick-notes.css');
const jsPath = path.join(rootDir, 'js/quick-notes.js');
const notesHtmlPath = path.join(rootDir, 'notes.html');
const indexHtmlPath = path.join(rootDir, 'index.html');
const searchJsPath = path.join(rootDir, 'js/search.js');

assert(fs.existsSync(cssPath), "css/quick-notes.css must exist");
assert(fs.existsSync(jsPath), "js/quick-notes.js must exist");
assert(fs.existsSync(notesHtmlPath), "notes.html must exist");
console.log("  ✓ All required files exist (css, js, html)");

// 2. Check index.html integration
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
assert(indexHtml.includes('css/quick-notes.css'), "index.html must link css/quick-notes.css");
assert(indexHtml.includes('id="quick-notes-drawer"'), "index.html must contain quick-notes-drawer");
assert(indexHtml.includes('id="qn-backdrop"'), "index.html must contain qn-backdrop");
assert(indexHtml.includes('QuickNotes.open()'), "index.html must have trigger to open QuickNotes");
assert(indexHtml.includes('id="dock-btn-quick-notes"'), "index.html must have quick notes dock item");
assert(indexHtml.includes('js/quick-notes.js'), "index.html must include script js/quick-notes.js");
console.log("  ✓ index.html properly integrates QuickNotes drawer, header button, and dock trigger");

// 3. Check search.js integration
const searchJs = fs.readFileSync(searchJsPath, 'utf8');
assert(searchJs.includes('quicknotes'), "search.js must include quicknotes in search index");
assert(searchJs.includes('QuickNotes.open()'), "search.js must open QuickNotes when selected");
console.log("  ✓ search.js properly integrates QuickNotes in global search (Ctrl+K)");

// 4. Test QuickNotes logic in mock browser environment
const mockLocalStorage = {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = v; },
    removeItem(k) { delete this.store[k]; }
};

global.localStorage = mockLocalStorage;
global.window = {
    addEventListener: () => {},
    dispatchEvent: () => {}
};
global.document = {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
};

// Require js/quick-notes.js
const QuickNotes = require(jsPath);

assert(typeof QuickNotes !== 'undefined', "QuickNotes must be defined globally");
assert(typeof QuickNotes.open === 'function', "QuickNotes must have open method");
assert(typeof QuickNotes.close === 'function', "QuickNotes must have close method");
assert(typeof QuickNotes.addNote === 'function', "QuickNotes must have addNote method");
assert(typeof QuickNotes.togglePin === 'function', "QuickNotes must have togglePin method");

const initialNotes = QuickNotes.getNotes();
assert(Array.isArray(initialNotes) && initialNotes.length >= 3, "Default notes should be seeded with at least 3 initial notes");
console.log(`  ✓ QuickNotes module initializes with ${initialNotes.length} default useful notes`);

// Test toggle pin
const firstNoteId = initialNotes[0].id;
const initialPinned = initialNotes[0].pinned;
QuickNotes.togglePin(firstNoteId);
const updatedNotes = QuickNotes.getNotes();
const targetNote = updatedNotes.find(n => n.id === firstNoteId);
assert(targetNote.pinned === !initialPinned, "togglePin should toggle pinned state");
console.log("  ✓ QuickNotes togglePin works as expected");

// Test notes.html content
const notesHtml = fs.readFileSync(notesHtmlPath, 'utf8');
assert(notesHtml.includes('js/quick-notes.js'), "notes.html must load js/quick-notes.js");
assert(notesHtml.includes('index.html'), "notes.html must link back to index.html");
console.log("  ✓ notes.html contains standalone full-screen layout with link back to HUD");

console.log("\n=== ALL QUICK NOTES TESTS PASSED! ===");
