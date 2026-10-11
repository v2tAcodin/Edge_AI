# 07: 3D Particle Energy Streams & Enriched Node Inspector

**What to build:** Elevate the 3D Cybernetic Skill Tree with 60 FPS flowing energy photon particles traveling from Root along branches to project nodes, and upgrade the Node Inspector into a responsive side panel / bottom sheet with slide-in animation that displays comprehensive domain summaries, hierarchy breadcrumbs, and clickable child-node badges with cinematic fly-to cameras.

**Blocked by:** 06: Engine Consolidation & DRY Constants Refactoring

**Status:** completed

- [x] Implement `ParticleEnergyStream` in `js/cyber-tree3d.js` using `THREE.Points` / buffer geometry traveling 1-way from parent to child nodes along branch curves
- [x] Ensure particle animation loop maintains 60 FPS, with automatic deactivation on 2D fallback or reduced motion
- [x] Cache halos and branch geometry references to prevent per-frame garbage collection spikes
- [x] Upgrade Node Inspector styling to support responsive layout: desktop side drawer with slide-in CSS transition, mobile bottom sheet
- [x] Enrich Node Inspector for Root (C/C++) and Branch nodes: Render breadcrumb path, domain competency overview, and child node badges with click-to-fly action
- [x] Add "Filter in Grid View" action button in Node Inspector that navigates to Grid view and applies the corresponding category filter
- [x] Implement click-on-empty-canvas detection to deselect active node and close the Inspector with smooth camera pullback
- [x] Add and execute automated unit tests verifying particle streams, inspector rendering for root/branch nodes, and camera resets
