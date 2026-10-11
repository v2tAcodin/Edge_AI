# 04: Un-gated Project Deep-Dive HUD with Interactive UART Console

**What to build:** Xây dựng màn hình hiển thị chi tiết dự án toàn diện dạng Overlay HUD công nghệ cao (Deep-Dive HUD), mở tự do khi người xem chọn bất kỳ dự án nào từ 3D Tree hoặc Grid mà không bị cản trở bởi bất kỳ cơ chế khóa nào. HUD tích hợp 4 tab chuyên sâu: Sơ đồ kiến trúc & bài toán, Trình phát Interactive UART Serial Console (mô phỏng nạp chip và in telemetry thời gian thực kèm media/ảnh mạch), Trình xem Source Code C/C++ sạch với cú pháp nổi bật, và Bảng đo lường Benchmarks & Linh kiện phần cứng (BOM). Hỗ trợ đóng mở mượt mà bằng phím ESC hoặc nút đóng.

**Blocked by:** 02: Three.js 3D Cybernetic Skill Tree & Constellation Scene, 03: Dual-View Portfolio Grid & Category Filtering

**Status:** closed

- [x] Khi chọn một dự án, màn hình Deep-Dive HUD mở mượt mà đè lên không gian 3D/Grid, hiển thị tiêu đề, trạng thái, danh mục và thanh 4 tab chuyển đổi.
- [x] Gỡ bỏ hoàn toàn mọi điều kiện tiên quyết (Progression Gate) — người xem có thể mở tự do 100% các dự án.
- [x] **Tab 1 (Architecture & Overview):** Hiển thị mục tiêu dự án, thách thức kỹ thuật đã vượt qua, giải pháp kiến trúc và sơ đồ khối hệ thống.
- [x] **Tab 2 (Visual Demo & UART Console):** Tích hợp widget Interactive UART Serial Console có các nút điều khiển ("▶ Run Firmware Log", "⏹ Pause", "🔄 Replay") tự động in các dòng log telemetry của ESP32; hỗ trợ hiển thị ảnh/video/sơ đồ mạch thật nếu có.
- [x] **Tab 3 (Key Implementation):** Hiển thị các khối code C/C++ quan trọng với syntax highlighting đẹp mắt, kèm nút copy code một chạm.
- [x] **Tab 4 (Benchmarks & Hardware Specs):** Hiển thị bảng thông số đo lường hiệu năng thực tế (SRAM footprint, Flash usage, Latency, FPS, Power draw) và danh sách linh kiện phần cứng (BOM).
- [x] Hỗ trợ phím `ESC` hoặc nút đóng để đóng HUD và lùi camera 3D về góc nhìn toàn cảnh.
- [x] Viết test tự động kiểm thử chu kỳ hiển thị Deep-Dive HUD, tương tác 4 tab, và hoạt động của trình phát UART Console.
