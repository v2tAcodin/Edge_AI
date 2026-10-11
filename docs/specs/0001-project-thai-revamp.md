# Spec 0001: Project Thai - Cải Tổ Toàn Diện Hệ Thống Với 3D Skill Galaxy và 4 Learning Tracks

Triage label: `ready-for-agent`

---

## Problem Statement

Hiện tại, kỹ sư đang sử dụng hệ thống web học tập bị phân mảnh thành hơn 8 tab tính năng độc lập (Lý thuyết, Code C, Lab & Simulator, Dự án, Phỏng vấn, Sổ tay, Tủ sách, Profile). Bố cục này gây ra các bất cập lớn đối với người học:
- **Thiếu tính định hướng tuyến tính**: Người học không có lộ trình rõ ràng, dễ bị quá tải kiến thức khi không biết nên học bài lý thuyết nào trước khi thực hành bài code C hay mô phỏng phần cứng tương ứng.
- **Trải nghiệm thị giác đơn điệu**: Giao diện dạng web tĩnh truyền thống, chưa truyền tải được cảm hứng công nghệ cao (Cyberpunk/Sci-Fi) tương xứng với lĩnh vực Hệ thống nhúng vi điều khiển ESP32-S3 và Trí tuệ nhân tạo biên (Edge AI).
- **Thanh điều hướng chật chội**: Phần trên cùng của màn hình bị chiếm dụng bởi hàng loạt nút công cụ tiện ích (Pomodoro, Audio, CheatSheet, Backup, Tìm kiếm), làm giảm diện tích hiển thị của khu vực học tập trọng tâm.
- **Thiếu cơ chế rèn luyện tính kỷ luật**: Hệ thống hiện tại cho phép mở tự do mọi nội dung mà không có động lực hoàn thành tuần tự, chưa phản ánh đúng tinh thần phát triển năng lực bản thân của Kỹ sư Thai.

---

## Solution

Tái thiết kế và nâng cấp toàn bộ hệ thống thành **Project Thai** — nền tảng tự rèn luyện và làm chủ công nghệ cao cấp:
- **3D Skill Galaxy**: Không gian vũ trụ 3D tương tác thời gian thực (xây dựng bằng Three.js theo kiến trúc Zero-Build), trực quan hóa toàn bộ lộ trình học tập dưới dạng mạng lưới chòm sao kết nối các Skill Station phát quang.
- **4 Learning Tracks khép kín**: Tái cấu trúc toàn bộ kho học liệu (56 bài lý thuyết, 72 bài code C, phòng lab ESP32, 24 chủ đề phỏng vấn) thành 4 trục chuyên môn tuần tự:
  1. *Embedded C & Architecture Core*
  2. *ESP32-S3 System & Peripherals*
  3. *TinyML & Edge AI Inference*
  4. *Capstone Projects & Phỏng Vấn Kỹ Sư*
- **Station Workspace (Split-View HUD)**: Khi nhấp vào một Skill Station, camera 3D bay mượt mà vào trạm và mở ra màn hình tác nghiệp 2 cột công nghệ cao (Cột trái: Lý thuyết cốt lõi & Sơ đồ kiến trúc; Cột phải: 3 tab tương tác gồm Code C Lab, Visual Simulator và Checkpoint Quiz).
- **Progression Gate & Engineer Override**: Áp dụng cơ chế khóa/mở khóa tuần tự để xây dựng tính kỷ luật, đồng thời trang bị quyền Engineer Override (xác thực Passcode) để mở khóa tự do toàn bộ khi cần tra cứu khẩn cấp.
- **Floating Toolkit Dock**: Dời toàn bộ tiện ích phụ trợ (Focus Pomodoro 25/5, Audio Lo-Fi Web Audio, Tủ Sách Kỹ Thuật PDF, CheatSheet tra cứu, Quản lý Sao lưu) xuống thanh dock nổi ở cạnh dưới màn hình, nhường 100% không gian cho vũ trụ 3D và thương hiệu Project Thai.

---

## User Stories

1. As an engineer, I want to see a captivating 3D Skill Galaxy on the main screen, so that I feel inspired and immersed in an advanced sci-fi engineering environment.
2. As an engineer, I want the 3D scene to run directly in the browser without any build process, so that the web application remains lightweight, fast, and works seamlessly offline as a PWA.
3. As an engineer, I want to rotate, pan, and zoom around the 3D constellation of stations, so that I can explore my comprehensive learning landscape.
4. As an engineer, I want the 3D Skill Galaxy to visually distinguish between locked, unlocked, in-progress, and mastered stations, so that I immediately know my current milestone and progress.
5. As an engineer, I want pulsing laser links between interconnected stations, so that I can clearly see prerequisites and learning trajectories.
6. As an engineer, I want a smooth camera transition (Fly-to Zoom) when clicking a Skill Station, so that navigation feels fluid, cinematic, and continuous.
7. As an engineer, I want my learning journey divided into 4 clear Learning Tracks, so that I can progress methodically from low-level C programming up to edge machine learning deployment.
8. As an engineer, I want Track 1 to cover Embedded C and computer architecture fundamentals, so that I build an unshakeable foundation in registers, memory layout, and bitwise manipulation.
9. As an engineer, I want Track 2 to focus on ESP32-S3 hardware, FreeRTOS, and peripheral drivers, so that I master the target dual-core Xtensa micro-controller.
10. As an engineer, I want Track 3 to cover TinyML model quantization and on-device inference, so that I can run neural networks locally on microcontrollers without cloud dependencies.
11. As an engineer, I want Track 4 to encompass real-world capstone projects and engineering interview questions, so that I can demonstrate production-grade competence.
12. As an engineer, I want each Skill Station to open a Station Workspace with a two-column Split-View, so that I can reference core theory on the left while simultaneously writing code and testing simulators on the right.
13. As an engineer, I want the left column of the Station Workspace to present concise, high-signal explanations and hardware pinout diagrams, so that I do not have to wade through verbose filler.
14. As an engineer, I want a Code C Lab tab inside the right pane, so that I can inspect, edit, copy, and run sample C programs relevant to that station.
15. As an engineer, I want a Visual Simulator tab inside the right pane, so that I can test register toggling, hex memory viewing, and peripheral emulation directly alongside the lesson.
16. As an engineer, I want a Checkpoint Quiz tab inside the right pane, so that I can validate my conceptual comprehension before considering the station mastered.
17. As an engineer, I want a Progression Gate to keep future stations locked until I pass the current station's quiz with at least 80%, so that I build rigorous discipline and true mastery.
18. As an engineer, I want an Engineer Override feature protected by my passcode, so that I can temporarily unlock all stations when I urgently need to reference specific materials.
19. As an engineer, I want to earn XP upon mastering each Skill Station, so that I have a tangible record of my growing technical expertise.
20. As an engineer, I want all my existing progress, XP, streak, and backup files to migrate cleanly to the new system, so that none of my historical effort is lost.
21. As an engineer, I want the top header rebranded to "Project Thai // Personal Mastery HUD", so that the interface reflects my personal commitment to self-development.
22. As an engineer, I want secondary tools like Pomodoro, Audio Lo-Fi, technical bookshelf, cheatsheet, and backups housed in a Floating Toolkit Dock at the bottom of the screen, so that the top of the interface remains clean and uncluttered.
23. As an engineer, I want to activate the Pomodoro timer from the Floating Toolkit Dock, so that I can maintain deep focus intervals during challenging embedded sessions.
24. As an engineer, I want to toggle ambient Lo-Fi audio from the Floating Toolkit Dock, so that I have optimal background audio for technical problem solving.
25. As an engineer, I want to close the Station Workspace via an ESC key press or an exit button, so that I seamlessly zoom back out to the 3D galaxy view.
26. As an engineer, I want the web application to continue caching assets for offline PWA operation, so that I can study and practice anywhere without an internet connection.

---

## Implementation Decisions

### 1. 3D Graphics Architecture
- **Library & Loading**: Use Three.js (`three.min.js`, `OrbitControls.js`, `tween.umd.js`) loaded via high-availability CDN with fallback handling.
- **Zero-Build Constraint**: Adhere strictly to ADR-0001. No Webpack, Vite, or npm bundler pipeline. All scripts remain standard browser ES6 scripts or modules.
- **Scene Composition**:
  - Background: Particle starfield using `THREE.Points` with dynamic mouse parallax.
  - Station Nodes: Procedurally generated glowing geometric meshes (dodecahedrons/octahedrons for standard nodes; metallic faceted rings for milestone nodes) utilizing custom glow materials.
  - Track Links: `THREE.LineSegments` or tube geometry with animated vertex shader pulses denoting energy flow along track dependencies.
  - Camera Controller: Custom smooth camera lerping/tweening controller for switching between orbital exploration mode and station focus mode.

### 2. State & Curriculum Data Architecture
- **Canonical Schema**: Define a unified Curriculum Engine maintaining the 4 Learning Tracks.
- **Station Data Structure**:
  ```javascript
  {
    trackId: "track-1",
    stationId: "t1-s01",
    title: "ESP32-S3 Architecture & Memory Layout",
    category: "Architecture",
    xpReward: 150,
    prerequisites: [],
    coordinates3D: { x: -30, y: 10, z: 0 },
    theory: {
      summary: "...",
      diagramSvg: "...",
      keyTakeaways: ["..."]
    },
    codeLab: {
      language: "c",
      sampleCode: "...",
      instructions: "..."
    },
    simulator: {
      type: "hexmem", // or gpio, register, serial
      initialConfig: {}
    },
    quiz: {
      questions: [
        { q: "...", options: ["..."], correctIndex: 0, explanation: "..." }
      ]
    }
  }
  ```
- **State Migration Adapter**: Reads existing `localStorage` keys (`edge_ai_state`, `edge_ai_progress`, `quiz_score`, `xp`), computes mapping to new Station IDs, and ensures backward-compatible JSON export/import.

### 3. User Interface & Layout
- **Root Container**:
  - `Project Thai HUD` header: Callsign, rank title, level badge, streak count, audio status.
  - Fullscreen 3D Canvas container hosting the Three.js viewport.
  - Station Workspace overlay: Modal HUD with backdrop blur (`backdrop-filter: blur(16px)`), CSS Grid 2-column split (Left: 45% theory/diagrams; Right: 55% interactive tabs).
  - Floating Toolkit Dock: Fixed bottom container with glassmorphism styling, housing icons for Focus Timer, Audio Engine, Bookshelf Modal, Cheatsheet Drawer, and Backup/Restore.

### 4. Progression Gate & Security
- **Completion Criteria**: Station is marked `mastered` when:
  1. Theory view is acknowledged.
  2. Code lab run or copy action performed.
  3. Station quiz passed with score $\ge 80\%$.
- **Engineer Override**: Stored in session memory; toggled via passcode modal verifying current user passcode (default `123456`). When active, bypasses prerequisite validation.

---

## Testing Decisions

- **Testing Seams**:
  - Primary Testing Seam: **Runtime DOM & State Controller Seam** (`TrackStateManager` and `StationWorkspaceController`).
  - Secondary Testing Seam: **Data Integrity & Migration Seam** (`StateMigrationAdapter` testing old localStorage payload conversion to new Station states).
  - Graphics Seam: **WebGL Context Initialization & Fallback Seam** (verifying that Three.js canvas initializes successfully, with clean degradation if WebGL is disabled).
- **Test Quality Standard**: Tests must verify user-observable behavior (e.g., station completion unlocks dependent node, override flag enables all nodes, XP correctly increments) rather than internal Three.js matrix math.
- **Prior Art**: Existing validation functions in `auth.js` and backup validation in `backup.js`.

---

## Out of Scope

- Cloud database synchronization or backend authentication servers (the app remains 100% client-side serverless PWA).
- Rewriting the underlying ESP32-S3 web simulators into WebAssembly binaries (existing Canvas and JS simulators are reused and embedded into the new workspace).
- Native mobile app wrapper generation (iOS/Android native builds); PWA installability is preserved.

---

## Further Notes

- The project title and manifest will be updated to reflect **Project Thai**.
- Existing Service Worker cache list will be updated to ensure Three.js CDN assets and new stylesheets are cached for uninterrupted offline usage.
