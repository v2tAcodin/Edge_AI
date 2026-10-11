# 03: Dual-View Portfolio Grid & Category Filtering

**What to build:** Xây dựng chế độ xem Lưới thẻ dự án phẳng hiện đại (Portfolio Grid View) phong cách Cyberpunk/Glassmorphism dành cho người xem muốn duyệt nhanh toàn bộ dự án trong 5 giây. Hỗ trợ nút chuyển đổi 1-chạm mượt mà giữa chế độ 3D Universe và 2D Grid, đi kèm bộ lọc danh mục tức thì (*All, Computer Vision, Audio TinyML, FreeRTOS/IoT, Hardware Optimization*) và hiển thị nhãn trạng thái dự án (*Completed, In Progress, Architecture Design*).

**Blocked by:** 01: De-clutter Navigation, Layout Refactor & Portfolio Data Core

**Status:** closed

- [x] Phân khu `#view-grid` hiển thị danh sách các thẻ dự án dạng lưới Responsive Grid tương thích mọi kích thước màn hình.
- [x] Mỗi thẻ dự án hiển thị rõ: Tiêu đề, Badge danh mục, Badge trạng thái (`Completed`, `In Progress`, `Architecture Design`), Tóm tắt ngắn gọn, Tech stack tag và chỉ số hiệu năng nổi bật (ví dụ: `15 FPS`, `<50ms Latency`, `INT8`).
- [x] Thanh chuyển đổi chế độ xem (View Toggle Pill) cho phép chuyển đổi tức thì giữa `🌌 3D Skill Tree` và `🏆 Projects Grid`.
- [x] Thanh lọc danh mục nhanh (Filter Bar) cho phép lọc dự án tức thì và đồng bộ trạng thái lọc sang cả chế độ 3D.
- [x] Nhấp vào bất kỳ thẻ dự án nào trong Grid sẽ gọi `PortfolioController.selectProject(id)`.
- [x] Viết test tự động kiểm thử render danh sách thẻ, lọc danh mục và sự kiện tương tác nhấp thẻ.
