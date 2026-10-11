# 02: Three.js 3D Cybernetic Skill Tree & Constellation Scene

**What to build:** Xây dựng không gian 3D tương tác sống động kết hợp Cây Cổ Thụ Năng Lực (thân gốc nền tảng C/C++ và phần cứng) với Vũ Trụ Tinh Cầu (các tinh cầu dự án tỏa ra trên các đại nhánh). Tích hợp các luồng hạt năng lượng chuyển động liên tục đạt 60 FPS mượt mà, hiệu ứng Dependency Glow khi rê chuột vào node (làm bừng sáng các nhánh và kỹ năng tương hỗ), hiệu ứng camera cinematic fly-to khi click, chế độ Auto-Orbit tự quay chậm khi rảnh tay, và bản vẽ 2D Canvas dự phòng.

**Blocked by:** 01: De-clutter Navigation, Layout Refactor & Portfolio Data Core

**Status:** closed

- [x] Khung cảnh 3D Three.js khởi tạo mượt mà bên trong `#view-tree3d` với thân cây trung tâm (Trunk) và các nhánh bezier phát quang (Spline Branches) tỏa ra không gian.
- [x] Các tinh cầu dự án (Project Planets) được render tại các đỉnh nhánh với hiệu ứng phát sáng khí quyển (Atmosphere Glow) và quầng màu theo danh mục chuyên môn.
- [x] Luồng hạt năng lượng ánh sáng (Particle Energy Streams) chuyển động tuần hoàn liên tục dọc theo các nhánh cây kết nối.
- [x] Tương tác chuột Hover kích hoạt hiệu ứng Dependency Glow, làm sáng bừng các nhánh liên kết giữa dự án và kỹ năng nền tảng.
- [x] Tương tác Click kích hoạt camera fly-to mượt mà (smooth cubic easing) zoom thẳng tới tinh cầu được chọn và gọi `PortfolioController.selectProject(id)`.
- [x] Nút điều khiển HUD hỗ trợ: Reset góc nhìn toàn cảnh, Bật/Tắt Auto-Orbit tự quay chậm.
- [x] Bản vẽ 2D Canvas Fallback tự động kích hoạt khi trình duyệt không hỗ trợ WebGL.
- [x] Viết test tự động kiểm thử cấu trúc hình học node 3D, tính toán tọa độ raycaster và cơ chế fallback 2D.
