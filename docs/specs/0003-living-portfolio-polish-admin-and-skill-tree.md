# Spec 0003: Living Portfolio Polish, Zero-Backend Admin Project Editor & Cybernetic Skill Tree Refinement

Triage label: `ready-for-agent`

---

## Problem Statement

Sau khi chuyển đổi thành công sang kiến trúc Living Portfolio (Spec 0002), hệ thống vẫn còn một số điểm nghẽn kỹ thuật và trải nghiệm người dùng:
1. **Khó khăn khi cập nhật hoặc thêm dự án mới**: Khi Kỹ sư Thai hoàn thành một dự án thực chiến hoặc muốn cập nhật thông số, anh phải sửa thủ công nhiều mảng object phức tạp trong mã nguồn JavaScript, dễ gây sai cú pháp và thiếu tiện lợi khi thao tác nhanh.
2. **Cơ chế 3D bị phân mảnh và dư thừa mã nguồn**: Tồn tại 2 engine 3D song song (`galaxy3d.js` và `cyber-tree3d.js`) gây lãng phí 19 KB dung lượng, tiềm ẩn lỗi race condition khi cả hai cùng gắn vào canvas WebGL.
3. **Trải nghiệm khám phá cây kỹ năng 3D còn thiếu chiều sâu**: Khi nhấp vào các quả cầu Gốc (Root C/C++) hoặc Đại nhánh (như Network & Protocols), giao diện Node Inspector hiển thị quá ít thông tin, thiếu liên kết cha-con trực quan và chưa có khả năng bay nhanh tới các nút con.
4. **Cây kỹ năng 3D thiếu sinh khí (Living Circuitry)**: Các đường liên kết giữa các nút mới chỉ là đường nét tĩnh, chưa có luồng hạt năng lượng chuyển động thể hiện dòng chảy tri thức từ gốc tới các sản phẩm biên.
5. **Dữ liệu phân loại bị lặp lại**: Các hằng số `categoryMeta` và `statusStyle` đang bị khai báo trùng lặp ở nhiều module khác nhau, vi phạm nguyên lý Single Source of Truth (DRY).

---

## Solution

1. **Chuẩn hóa 3D Engine & Dọn dẹp Dead Code**: Xóa bỏ hoàn toàn `galaxy3d.js`, cấu hình duy nhất `cyber-tree3d.js` trong HTML và Service Worker; bảo đảm bí danh tương thích ngược `window.skillGalaxy3D = window.cyberTree3D`.
2. **Admin Project Editor (Zero-Backend)**: Xây dựng trình quản trị và biên tập dự án công nghệ cao chạy 100% phía trình duyệt:
   - Form nhập liệu trực quan: Thông tin định danh, danh mục kỹ thuật, trạng thái R&D, chọn nút cha (parent) trong cây kỹ năng, thông số benchmark phần cứng, sơ đồ kiến trúc và chuỗi log UART.
   - Lưu trữ tức thì vào `localStorage` để xem trước trực tiếp trên cây 3D và lưới dự án.
   - Nút "Xuất mã nguồn `portfolio-data.js`" để sao chép hoặc tải patch code cập nhật vào repo.
   - Kích hoạt bảo mật bằng URL `#admin`, phím tắt `Ctrl+Shift+E` và icon kín trong Recruiter Dock.
3. **Nâng cấp Node Inspector toàn diện**:
   - Chuyển thành Side panel (desktop) và Bottom sheet (mobile) với hiệu ứng trượt vào mượt mà.
   - Đối với quả cầu Gốc/Nhánh: Hiển thị breadcrumbs phân cấp, tóm tắt năng lực nhánh, danh sách nút con trực thuộc dạng thẻ bấm nhanh (click để camera bay tới), và nút lọc tức thì trên Grid View.
   - Hỗ trợ đóng bảng khi click vùng trống trên 3D canvas kèm camera pullback.
4. **Luồng hạt năng lượng 3D (Particle Energy Streams)**: Thêm các hạt photon neon chạy tuần hoàn 1 chiều từ Gốc ➔ Đại nhánh ➔ Dự án, tối ưu hóa bộ đệm buffer geometry duy trì 60 FPS ổn định, tự động vô hiệu hóa trên fallback 2D.
5. **Chuẩn hóa Single Source of Truth**: Tập trung hóa các hằng số phân loại và nhãn trạng thái vào `portfolio-data.js`.

---

## User Stories

1. As an engineer (Thai), I want to open the Admin Project Editor using a shortcut (`#admin` or `Ctrl+Shift+E`), so that I can conveniently add or update my engineering projects without leaving the web browser.
2. As an engineer (Thai), I want a user-friendly form in the Admin Project Editor to input project titles, categories, parent nodes, UART logs, and benchmark metrics, so that I don't have to manually format complex JavaScript data objects.
3. As an engineer (Thai), I want changes in the Admin Project Editor to instantly persist in `localStorage`, so that I can immediately preview the new project on both the 3D Tree and the Projects Grid.
4. As an engineer (Thai), I want an "Export Code" button in the Admin Project Editor to generate a clean patch for `portfolio-data.js`, so that I can easily commit my updates to the Git repository.
5. As a visitor, I want only one optimized 3D engine (`cyber-tree3d.js`) loaded by the browser, so that page load is faster and WebGL resources are not duplicated.
6. As a visitor exploring the 3D Cybernetic Skill Tree, I want to see glowing photon particles flowing along branches from the root to the leaf projects, so that the tree feels alive and depicts the flow of embedded intelligence.
7. As a mobile visitor, I want the 3D particle animations to automatically adapt and maintain a stable 60 FPS without overheating my device.
8. As a visitor, when I click on a Root node (e.g. C/C++ Foundation) or a Branch node (e.g. Network & Protocols), I want the Node Inspector to show a complete overview of that domain, including its breadcrumb hierarchy and core competency summary.
9. As a visitor reading a Branch node's inspector, I want to see interactive badges of all child nodes and projects, so that I can click any badge and have the 3D camera smoothly fly directly to that node.
10. As a recruiter, when inspecting a skill branch in 3D, I want a "Filter on Grid View" button, so that I can immediately pivot to the 2D grid and view all relevant projects in that category.
11. As a mobile visitor, I want the Node Inspector to display as a sleek bottom sheet instead of blocking the full screen, so that I can explore comfortably on handheld screens.
12. As a visitor, I want clicking on empty space in the 3D scene to deselect the active node and close the inspector with a smooth camera reset, so that navigation feels intuitive.
13. As a developer maintaining the codebase, I want `categoryMeta` and `statusStyle` defined once in `portfolio-data.js`, so that color codes and metadata remain completely DRY.
14. As an offline visitor, I want the updated portfolio assets and scripts cached properly by the Service Worker, so that the entire enhanced showcase works without internet.

---

## Implementation Decisions

- **Central Seam & Event Architecture**:
  - `PortfolioController` acts as the single central seam orchestrating all view modes, filters, inspector lifecycle, and admin triggers.
  - Events supported:
    - `portfolio:admin-opened` / `portfolio:admin-closed`
    - `portfolio:project-saved` (triggers real-time reload of tree and grid)
    - `portfolio:node-inspected` (passes node payload to Node Inspector)
    - `portfolio:fly-to-node` (requests 3D camera translation)
- **Zero-Backend Admin Editor Module (`portfolio-admin.js`)**:
  - Modal overlay UI with tabbed or sectioned form: Basic Info, Skill Tree Parent, UART Logs, Benchmarks.
  - Storage adapter: Merges baseline data from `PortfolioData` with modifications stored in `localStorage` key `portfolio_custom_data`.
  - Code generator: Produces valid JS export ready to replace or merge into `portfolio-data.js`.
- **3D Engine Consolidation & Particle Stream System**:
  - Remove `js/galaxy3d.js` file and references in `index.html` and `sw.js`.
  - In `cyber-tree3d.js`: Implement `ParticleEnergyStream` using `THREE.Points` with positions interpolated along `THREE.CatmullRomCurve3` branch curves.
  - Cache halos and node geometries to minimize per-frame allocations in `animate()`.
- **Node Inspector Component Upgrade**:
  - Responsive CSS: Side drawer on `min-width: 768px`, Bottom sheet on mobile with CSS transition `transform: translateY(100%)` / `translateX(100%)`.
  - Enriched rendering: Computes direct children from `portfolioData.skillTreeNodes` where `parent === activeNode.id`.
- **Constants Extraction**:
  - Move `categoryMeta` and `statusStyle` to `PortfolioData` object export.
  - Update `portfolio-grid.js` and `portfolio-hud.js` to reference `PortfolioData.categoryMeta` and `PortfolioData.statusStyle`.

---

## Testing Decisions

- Test purely through external behavior via `PortfolioController` and public interfaces without mocking browser WebGL rendering internals.
- Test suites:
  1. *Ticket 06 Core & Constants Test*: Verify retirement of `galaxy3d.js`, alias preservation, and DRY extraction of `categoryMeta`/`statusStyle`.
  2. *Ticket 07 3D Particles & Node Inspector Test*: Verify particle stream initialization, 60 FPS lifecycle, and enriched 4-block inspector rendering for root/branch nodes.
  3. *Ticket 08 Admin Project Editor Test*: Verify admin modal opening, project creation/editing, localStorage preview persistence, and JS export generation.
- Prior art: Existing test suites in `.scratch/project-thai-showcase/tests/test_portfolio_core.js`, `test_cyber_tree3d.js`, etc.

---

## Out of Scope

- Remote database syncing or external cloud backend (strictly zero-backend static web).
- Modifying legacy practice/notebook code (isolated/deprecated).
- Framework rewrites (vanilla JS / zero-build maintained).

---

## Further Notes

All changes strictly adhere to the domain vocabulary in `GLOSSARY.md` and architecture decisions in `ADR 0001` through `ADR 0004`.
