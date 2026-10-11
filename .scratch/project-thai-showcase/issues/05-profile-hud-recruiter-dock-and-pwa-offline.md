# 05: Profile HUD, Recruiter Quick Dock & PWA Offline Verification

**What to build:** Xây dựng phân khu Hồ sơ Kỹ sư Thai (Profile HUD) hoàn thiện với ảnh đại diện công nghệ cao, bio, triết lý phát triển bản thân, biểu đồ Skills Radar Matrix 4 trục vẽ bằng SVG/Canvas, và nút "📄 Tải CV Bản Đẹp (Print / Save PDF)" chuẩn form tuyển dụng. Tái cấu trúc thanh dock nổi thành Recruiter Quick Dock ở đáy màn hình với trình phát Lo-Fi Audio Player, Theme Switcher, Quick CV trigger và hộp thoại liên hệ. Cập nhật Service Worker v5.0.0 cache toàn bộ tài nguyên để hoạt động offline 100% và chạy trọn vẹn bộ test E2E tích hợp.

**Blocked by:** 04: Un-gated Project Deep-Dive HUD with Interactive UART Console

**Status:** closed

- [x] Phân khu `#view-profile` hiển thị hồ sơ cá nhân hoàn chỉnh của Kỹ sư Thai với avatar, chức danh, status badge ("Open for Engineering Challenges"), bio và link kết nối (GitHub, LinkedIn, Email).
- [x] Tích hợp biểu đồ trực quan **Skills Radar Matrix** 4 trục (Embedded Core, Edge AI/TinyML, Hardware Protocols, System Optimization) vẽ bằng SVG/Canvas tương tác mượt mà.
- [x] Trang bị nút **"📄 Tải CV Bản Đẹp (Print / Save PDF)"** kích hoạt giao diện in CV sạch sẽ và chuyên nghiệp.
- [x] Tinh gọn Floating Dock thành Recruiter Quick Dock gồm: Nút Lo-Fi Audio Player, Chuyển theme Sáng/Tối, Xem nhanh CV, và Nút mở hộp thoại liên hệ nhanh.
- [x] Nâng cấp Service Worker `sw.js` lên phiên bản cache mới, đảm bảo 100% tài nguyên mới (3D, styles, scripts, audio) hoạt động trơn tru khi không có internet.
- [x] Viết test tự động E2E kiểm thử toàn bộ hành trình người dùng: duyệt 3D, mở Deep-Dive HUD, xem UART terminal, chuyển sang Grid, xem Profile và kiểm tra tính toàn vẹn của PWA cache manifest.
