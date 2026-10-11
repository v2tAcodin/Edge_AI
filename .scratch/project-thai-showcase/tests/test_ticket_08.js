/**
 * Test Suite for Ticket 08: Zero-Backend Admin Project Editor & LocalStorage Preview
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

console.log('=== RUNNING TICKET 08 TEST SUITE: ZERO-BACKEND ADMIN PROJECT EDITOR ===\n');

// ---------------------------------------------------------
// TEST 1: portfolio-admin.js module exists and exports PortfolioAdmin
// ---------------------------------------------------------
test('portfolio-admin.js exists and exports PortfolioAdmin with open/close methods', () => {
    const adminPath = path.join(__dirname, '../../../js/portfolio-admin.js');
    assert.ok(fs.existsSync(adminPath), 'js/portfolio-admin.js must exist');

    const adminCode = fs.readFileSync(adminPath, 'utf8');
    assert.ok(adminCode.includes('class PortfolioAdminClass') || adminCode.includes('PortfolioAdmin'), 'Must define PortfolioAdmin');
    assert.ok(adminCode.includes('open(') || adminCode.includes('open()'), 'Must have open method');
    assert.ok(adminCode.includes('close(') || adminCode.includes('close()'), 'Must have close method');
});

// ---------------------------------------------------------
// TEST 2: LocalStorage preview persistence & project saving
// ---------------------------------------------------------
test('PortfolioAdmin saves project to localStorage and dispatches portfolio:project-saved event', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const adminCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-admin.js'), 'utf8');

    let storage = {};
    let dispatchedEvents = [];

    const mockLocalStorage = {
        getItem: (k) => storage[k] || null,
        setItem: (k, v) => { storage[k] = String(v); },
        removeItem: (k) => { delete storage[k]; }
    };

    const mockWindow = {
        PortfolioData: null,
        localStorage: mockLocalStorage,
        dispatchEvent: (e) => { dispatchedEvents.push(e); },
        addEventListener: () => {},
        location: { hash: '' }
    };

    const mockDocument = {
        getElementById: () => null,
        createElement: () => ({ style: {}, classList: { add: () => {} }, appendChild: () => {} }),
        body: { appendChild: () => {} }
    };

    const sandbox = {
        window: mockWindow,
        document: mockDocument,
        localStorage: mockLocalStorage,
        CustomEvent: function(type, params) {
            this.type = type;
            this.detail = params ? params.detail : null;
        },
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(adminCode, sandbox);

    const admin = sandbox.window.PortfolioAdmin;
    assert.ok(admin, 'PortfolioAdmin must be initialized on window');

    // Test saving a new project
    const newProject = {
        id: 'tinyml-anomaly-vibration',
        name: 'Industrial Vibration Anomaly Detector',
        status: 'Completed',
        category: 'imu',
        parent: 'branch-hardware',
        summary: 'Micro-power real-time autoencoder for motor bearing fault detection.',
        tags: ['TinyML', 'Autoencoder', 'IMU', 'ESP32-S3'],
        benchmarks: {
            latency: '8.4 ms',
            sramFootprint: '24 KB',
            flashUsage: '420 KB',
            accuracy: '98.2%'
        },
        uartLogs: ['[BOOT] Vibration Anomaly Detector v1.0', '[IMU] Sampling rate 1600 Hz']
    };

    admin.saveProject(newProject);

    // Verify localStorage was updated
    const savedCustomData = JSON.parse(mockLocalStorage.getItem('portfolio_custom_data'));
    assert.ok(savedCustomData, 'portfolio_custom_data must be stored in localStorage');
    assert.ok(savedCustomData.projects.some(p => p.id === 'tinyml-anomaly-vibration'), 'New project must be present in saved projects');

    // Verify event dispatch
    assert.ok(dispatchedEvents.some(e => e.type === 'portfolio:project-saved'), 'Must dispatch portfolio:project-saved');
});

// ---------------------------------------------------------
// TEST 3: Code export generation produces valid JavaScript format
// ---------------------------------------------------------
test('PortfolioAdmin generateExportCode produces valid formatted JavaScript patch for portfolio-data.js', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-data.js'), 'utf8');
    const adminCode = fs.readFileSync(path.join(__dirname, '../../../js/portfolio-admin.js'), 'utf8');

    const sandbox = {
        window: {
            PortfolioData: null,
            localStorage: { getItem: () => null, setItem: () => {} }
        },
        document: {
            getElementById: () => null,
            createElement: () => ({ style: {}, classList: { add: () => {} }, appendChild: () => {} }),
            body: { appendChild: () => {} }
        },
        console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(dataCode, sandbox);
    vm.runInContext(adminCode, sandbox);

    const admin = sandbox.window.PortfolioAdmin;
    const exportCode = admin.generateExportCode();

    assert.ok(typeof exportCode === 'string', 'Export code must be string');
    assert.ok(exportCode.includes('PortfolioData') || exportCode.includes('projects: ['), 'Export code must contain PortfolioData structure');
    assert.ok(exportCode.includes('skillTreeNodes'), 'Export code must include skillTreeNodes');
});

// ---------------------------------------------------------
// TEST 4: index.html and sw.js integration
// ---------------------------------------------------------
test('index.html loads portfolio-admin.js and includes dock settings trigger; sw.js precaches it', () => {
    const html = fs.readFileSync(path.join(__dirname, '../../../index.html'), 'utf8');
    assert.ok(html.includes('portfolio-admin.js'), 'index.html must load portfolio-admin.js');
    assert.ok(html.includes('dock-btn-admin') || html.includes('PortfolioAdmin.open()'), 'Recruiter dock must include admin gear trigger');

    const sw = fs.readFileSync(path.join(__dirname, '../../../sw.js'), 'utf8');
    assert.ok(sw.includes('portfolio-admin.js'), 'sw.js must precache portfolio-admin.js');
});

console.log('\n=== TICKET 08 TEST SUITE READY ===\n');
