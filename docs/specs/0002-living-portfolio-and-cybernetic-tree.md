# Spec 0002: Project Thai - Tái Cấu Trúc Toàn Diện Sang Living Portfolio và 3D Cybernetic Skill Tree

Triage label: `ready-for-agent`

---

## Problem Statement

Hiện tại, website đang hoạt động như một nền tảng tự học trực tuyến với nhiều chức năng thừa thãi và phân mảnh:
- **Nội dung lý thuyết và bài tập chưa hoàn thiện**: Các module như Sổ tay AI, Giáo trình lý thuyết 14 chương, và 72 bài tập code C cơ bản mang tính chắp vá, chưa đạt chuẩn kỹ thuật chuyên sâu, khiến website trông giống một sân tập của người mới học hơn là một sản phẩm kỹ thuật cao cấp.
- **Sai lệch mục đích sử dụng**: Người dùng (Kỹ sư Thai) không còn nhu cầu dùng website này để học tập nữa, mà muốn một không gian số chuyên nghiệp, đẳng cấp để lưu giữ, trưng bày và khẳng định các thành tựu, giải pháp kỹ thuật và dự án thực chiến của bản thân (một bản "Living CV / Interactive Portfolio 3.0" nâng cấp).
- **Thanh điều hướng chật chội và loãng trọng tâm**: Có tới 9 tab điều hướng kèm hàng loạt tiện ích phụ (đồng hồ học tập Pomodoro, tủ sách học thuật) làm phân tán sự chú ý của người xem (nhà tuyển dụng, đối tác), che khuất các năng lực cốt lõi trong mảng Hệ thống nhúng (ESP32-S3) và Trí tuệ nhân tạo biên (Edge AI).
- **Rào cản khám phá (Progression Gate)**: Cơ chế khóa bài học tuần tự chỉ phù hợp với ứng dụng luyện tập; đối với một Portfolio, việc bắt người xem phải "giải quiz mới mở được dự án tiếp theo" là rào cản tiêu cực, ngăn cản nhà tuyển dụng khám phá các dự án nổi bật.
- **Gánh nặng tạo demo mô phỏng phức tạp**: Việc đòi hỏi mọi dự án đều phải có một bộ simulator trên web là không thực tế đối với các dự án nhúng ngoài đời thật, tạo rào cản lớn khi muốn bổ sung thêm dự án mới trong tương lai.

---

## Solution

Tái cấu trúc và nâng cấp toàn diện **Project Thai** từ nền tảng tự học thành **"Engineering Living Portfolio & Interactive Showcase"**:
- **Cắt tỉa triệt để mã nguồn dư thừa**: Xóa bỏ hoàn toàn 4 module học tập cũ (Notebook & Sổ tay, Lộ trình học 56 task, Code C 72 bài, Quiz trắc nghiệm 24 câu), gỡ bỏ tab Live Labs riêng biệt để tinh gọn thanh điều hướng về đúng **3 phân khu tinh hoa**:
  1. `🌌 3D Skill Tree`: Khám phá Cây Cổ Thụ Năng Lực & Tinh cầu dự án.
  2. `🏆 Projects Grid`: Danh sách dự án dạng lưới thẻ, lọc nhanh theo chuyên ngành.
  3. `👤 Profile & CV`: Hồ sơ năng lực Kỹ sư Thai, Skills Radar, Tải CV và Liên hệ.
- **3D Cybernetic Skill Tree & Project Constellation**: Tái cấu trúc khung cảnh 3D Three.js thành sự kết hợp độc bản giữa **Cây Cổ Thụ Năng Lực** (thân gốc nền tảng C/C++ và phần cứng nhúng) tỏa ra các **Đại nhánh năng lượng phát sáng**, kết nối các **Tinh cầu Dự án thực chiến (Project Planets)**. Tích hợp luồng hạt năng lượng luân chuyển mượt mà 60 FPS, hiệu ứng Dependency Glow khi hover, Cinematic Fly-To zoom và chế độ Auto-Orbit tự quay thư giãn.
- **Màn hình Deep-Dive HUD mở tự do với Interactive UART Console**: Gỡ bỏ hoàn toàn cơ chế khóa; khi click vào bất kỳ tinh cầu hoặc thẻ dự án nào, mở ngay bảng điều khiển chi tiết 4 tab:
  1. *Architecture & Overview*: Bài toán thực tế, sơ đồ khối phần cứng/phần mềm.
  2. *Visual Demo & UART Console*: Trình phát log UART Serial mô phỏng nạp chip và in telemetry thời gian thực sống động (rất dễ thêm/cập nhật chỉ bằng vài dòng log text), hỗ trợ nhúng ảnh/video/GIF mạch thật linh hoạt.
  3. *Key Implementation*: Code C/C++ sạch với giải thích thuật toán.
  4. *Benchmarks & Hardware Specs*: Đo lường thực tế (RAM/Flash, FPS, độ trễ ms, BOM).
- **Hỗ trợ nhãn trạng thái dự án thực tế**: Mỗi dự án có thể gắn nhãn `Completed` (Đã hoàn thành), `In Progress / R&D` (Đang phát triển), hoặc `Architecture Design` (Thiết kế kiến trúc) phản ánh trung thực lộ trình phát triển của Kỹ sư Thai.
- **Profile HUD & Recruiter Quick Dock**: Trang hồ sơ kỹ sư tích hợp biểu đồ Skills Radar Matrix 4 trục, nút tải CV bản in PDF/JSON; thanh dock nổi tinh gọn ở đáy màn hình hỗ trợ tương tác nhanh cho khách xem và thưởng thức âm nhạc Lo-Fi.
- **Module dữ liệu chuẩn hóa (`portfolio-data.js`)**: Quản lý toàn bộ danh mục dự án, thông số benchmark và kỹ năng tập trung tại một nguồn dữ liệu duy nhất, dễ dàng mở rộng và bảo trì.

---

## User Stories

1. As a visitor or recruiter, I want to land on a futuristic, high-performance Living Portfolio, so that I immediately recognize Engineer Thai's elite caliber in Embedded Systems and Edge AI.
2. As a visitor, I want to navigate between only 3 core views (3D Skill Tree, Projects Grid, Profile & CV), so that the entire website feels clean, focused, and uncluttered.
3. As a visitor, I want to explore an interactive 3D Cybernetic Skill Tree with glowing branches and planetary project nodes, so that I experience a memorable, visually stunning journey through the engineer's technical landscape.
4. As a visitor, I want the 3D scene to run at a buttery-smooth 60 frames per second without any lag or frame drops, so that interaction feels effortless and responsive.
5. As a visitor, I want to see visual energy streams pulsing along the tree branches connecting related skills and projects, so that I intuitively grasp technology synergy and dependencies.
6. As a visitor, I want hovering over a project node to trigger a Dependency Glow across connected skills, so that I can see what underlying hardware and software concepts made that project possible.
7. As a visitor, I want clicking any project node to initiate a smooth cinematic camera fly-to animation, so that transitions into project details feel organic and immersive.
8. As a visitor, I want an Auto-Orbit toggle that slowly rotates the 3D Tree when idle, so that the website serves as a living ambient tech showcase.
9. As a busy recruiter, I want to switch effortlessly between the 3D Universe View and a fast 2D Portfolio Grid View with a single click, so that I can quickly scan all projects in seconds if I am pressed for time.
10. As a recruiter, I want the Portfolio Grid to offer instant category filters (All, Computer Vision, Audio TinyML, FreeRTOS/IoT, Hardware Optimization), so that I can evaluate work matching my specific job requirements.
11. As a visitor, I want to click any project and immediately open its Project Deep-Dive HUD without any locks or progression gates, so that I can inspect the work without barriers.
12. As an engineering manager, I want the Deep-Dive HUD's Architecture tab to outline the core problem statement, system block diagrams, and hardware constraints, so that I can assess system design thinking.
13. As a visitor, I want the Deep-Dive HUD's Demo tab to offer an Interactive UART Serial Console replaying firmware boot logs and sensor telemetry, so that I can observe the embedded system operating in real-time.
14. As an engineer (Thai), I want the ability to provide demo visuals either via UART terminal logs or real circuit photos/videos, so that adding new physical hardware projects in the future requires minimal effort.
15. As a visitor, I want each project to display its realistic status badge (Completed, In Progress, Architecture Design), so that I appreciate Engineer Thai's active R&D roadmap.
16. As a senior embedded developer, I want the Deep-Dive HUD's Key Implementation tab to present clean, production-grade C/C++ code snippets with syntax highlighting, so that I can verify code quality and memory hygiene.
17. As an edge AI architect, I want the Deep-Dive HUD's Benchmarks tab to display real-world performance metrics (inference latency in ms, SRAM footprint, Flash usage, FPS, power draw), so that I see verified proof of resource optimization.
18. As an engineer (Thai), I want all showcase projects configured in a single, well-structured data module, so that I can easily add, update, or remove projects in the future without touching complex rendering code.
19. As a visitor, I want a dedicated Profile HUD featuring Engineer Thai's bio, high-tech avatar, philosophy, and current status, so that I understand his professional identity and work ethics.
20. As a recruiter, I want an interactive Skills Radar Matrix covering 4 pillars (Embedded Core, Edge AI/TinyML, Hardware Protocols, System Optimization), so that I can quantify the engineer's technical depth at a glance.
21. As a recruiter, I want a one-click "Download CV / Print Resume" button in the Profile HUD, so that I can take away a clean, beautifully formatted resume for hiring committees.
22. As a visitor, I want direct, prominent links to GitHub, LinkedIn, and Email, so that contacting or verifying Engineer Thai's code repositories takes zero effort.
23. As a visitor, I want a streamlined Recruiter Quick Dock at the bottom of the screen with Lo-Fi ambient audio, theme toggling, quick CV view, and contact triggers, so that navigation tools are always accessible without cluttering the screen.
24. As a visitor, I want ambient cyberpunk Lo-Fi music to set a calm, focused atmosphere while I inspect the engineering artifacts.
25. As an engineer (Thai), I want legacy clutter (Notebook, 56-task roadmap, 72 C exercises, 24-question quiz, live labs tab) removed from the navigation and views, so that the entire product is cohesive, clean, and high signal-to-noise.
26. As an offline user, I want the web application to continue working 100% offline via Service Worker caching, so that I can demonstrate my portfolio anywhere, even without internet access.

---

## Implementation Decisions

- **Architectural Shift & Module Deprecation**:
  - Deprecate and remove from active navigation: `#tab-learning`, `#tab-practice`, `#tab-notebook`, `#tab-interview`, `#tab-simulator`.
  - Introduce streamlined Navigation Bar with 3 core views: `🌌 3D Skill Tree`, `🏆 Project Grid`, `👤 Profile & CV`.
  - Transition from sequential curriculum state management to open-access portfolio presentation.

- **Data Architecture (`PortfolioData`)**:
  - Single source of truth containing:
    - `engineerProfile`: Name, call sign, title, bio, contact links, radar competencies.
    - `projects`: Array of showcase items with id, title, category, status (`Completed` | `In Progress` | `Architecture Design`), summary, architecture overview, uartLogLines, mediaUrls, code snippets, hardware BOM, and benchmark metrics table.
    - `skillTreeNodes`: Spatial 3D coordinates representing trunk roots, branches, and celestial project nodes with dependency linkages.

- **3D Cybernetic Skill Tree (`CyberTree3D`)**:
  - Built with vanilla Three.js (zero-build architecture via CDN/local bundle).
  - Procedural trunk and organic bezier branch geometry radiating from the center.
  - Glowing node spheres with custom shader/sprite bloom and axial rotation.
  - Dynamic particle streams flowing continuously along branch splines.
  - Raycaster hit testing supporting Hover (Dependency Glow state) and Click (Cinematic Fly-To).
  - OrbitControls with damped easing, angle constraints, and Auto-Orbit toggle.
  - Seamless 2D constellation canvas fallback for environments lacking WebGL support.

- **Portfolio View & Deep-Dive HUD (`PortfolioController`)**:
  - Top-level orchestrator mediating user actions across 3D Tree, 2D Grid, Profile HUD, and Deep-Dive Modal.
  - Ungated Deep-Dive Modal rendering 4 tabs on demand: Architecture, UART Console & Media, Source Code, Benchmarks.
  - Built-in Interactive UART Serial Log Replayer auto-streaming terminal logs on demand.
  - Fast category filtering synchronizing both Grid cards and 3D node highlights.

- **Recruiter Quick Dock & Profile HUD**:
  - High-tech floating dock housing Lo-Fi player, theme toggle, quick CV trigger, and contact dialog.
  - Profile HUD featuring interactive SVG/Canvas Skills Radar Matrix and printable CV view.

- **Offline PWA Integration**:
  - Update Service Worker cache manifest to cache new portfolio assets, Three.js runtime, and audio files.

---

## Testing Decisions

- **Good Test Definition**: Tests must verify externally observable behaviors: correct data formatting, view switching, modal open/close states, 3D coordinate integrity, and dependency links, without tightly coupling to internal DOM style strings or Three.js internal render loops.
- **Modules to Test**:
  1. `PortfolioData`: Schema completeness, projects validation, benchmark structure, radar points, UART log streams.
  2. `PortfolioController`: View switching across 3 views, project selection, category filtering, un-gated modal lifecycle.
  3. `CyberTree3D`: Node generation math, dependency mapping, raycaster coordinate mapping, 2D fallback.
  4. `PWA & Integration`: Service Worker asset manifest validity, responsive layout compliance.
- **Prior Art**: Builds on the test harnesses established in `.scratch/project-thai/tests/` using Node.js with JSDOM emulation.

---

## Out of Scope

- Cloud database backend or server-side authentication (maintains client-side zero-build, local-first architecture).
- Multi-user community comments or public discussion forums.
- Custom WebGL physics simulations per physical project (replaced with scalable Interactive UART Serial Console & Media Showcase).

---

## Further Notes

- Retains the established brand identity "Project Thai" with a renewed focus on self-mastery, personal achievements, and elite engineering presentation.
- All code follows strict zero-build standards: vanilla HTML5, CSS3, and ES6+ JavaScript.
