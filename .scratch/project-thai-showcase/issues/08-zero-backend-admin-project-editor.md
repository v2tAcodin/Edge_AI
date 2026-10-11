# 08: Zero-Backend Admin Project Editor & LocalStorage Preview

**What to build:** A client-side high-tech admin editing suite (`portfolio-admin.js`) allowing Engineer Thai to create, edit, and organize projects and skill tree branches directly in the browser, instantly preview modifications in the 3D scene and Grid view via `localStorage`, and export clean JS patches for `portfolio-data.js` without any external backend server.

**Blocked by:** 06: Engine Consolidation & DRY Constants Refactoring, 07: 3D Particle Energy Streams & Enriched Node Inspector

**Status:** completed

- [x] Create `js/portfolio-admin.js` with zero-backend Admin Editor modal UI: Basic Information, Category, Parent Skill Node, Benchmark Specs, Key Implementation, and UART Console Logs
- [x] Implement browser storage adapter merging `portfolio_custom_data` from `localStorage` on load with baseline `PortfolioData`
- [x] Connect save actions to trigger instant live updates in `cyberTree3D` and `portfolioGrid` via `portfolio:project-saved` event
- [x] Implement "Export Code" feature generating ready-to-commit JavaScript format for `portfolio-data.js` with one-click copy to clipboard and JSON download
- [x] Secure trigger endpoints: URL hash `#admin`, keyboard shortcut `Ctrl + Shift + E`, and discrete settings gear icon in Recruiter Quick Dock
- [x] Register `portfolio-admin.js` in `index.html` and Service Worker cache list `sw.js`
- [x] Add and execute automated E2E tests verifying admin modal opening, project creation/editing, localStorage preview persistence, and code export generation
