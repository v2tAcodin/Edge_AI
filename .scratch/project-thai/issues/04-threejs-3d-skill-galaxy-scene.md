# 04: Không Gian 3D Skill Galaxy & Mạng Lưới Chòm Sao Tương Tác

**What to build:**
Tích hợp thư viện Three.js qua CDN (tuân thủ nghiêm ngặt kiến trúc Zero-Build PWA) để dựng không gian vũ trụ 3D Skill Galaxy thời gian thực làm trung tâm điều hướng trực quan. Không gian bao gồm trường hạt bụi sao Deep Space xoay chuyển theo tương tác chuột, các đường nối quỹ đạo laser phát quang giữa các trạm, và các Skill Station hiển thị dưới dạng các khối hình học vi mạch 3D phát sáng. Màu sắc và hiệu ứng của từng khối phản ánh đúng trạng thái thực tế: đỏ/xám khi bị khóa, xanh cyan/electric blue khi mở khóa và vàng gold khi đã hoàn thành (mastered). Khi nhấp vào một trạm, camera 3D thực hiện chuyển động bay mượt mà (Fly-to Zoom) tiến sát vào trạm và kích hoạt mở màn hình Station Workspace.

**Blocked by:** 01: Tái định danh Project Thai & Xây dựng Floating Toolkit Dock, 02: Động cơ Dữ liệu 4 Learning Tracks & Adapter Chuyển Đổi Tiến Độ

**Status:** completed

- [x] Three.js và OrbitControls nạp thành công qua CDN, kết xuất mượt mà trên Canvas mà không cần bất kỳ công cụ build nào.
- [x] Màn hình chính hiển thị không gian hạt bụi sao 3D Deep Space với màu nền chuẩn `#070b14` và hiệu ứng parallax khi di chuột.
- [x] Các Skill Station của 4 Learning Tracks được định vị không gian 3D và kết nối bằng các tia laser quang học thể hiện luồng học tập.
- [x] Khối hình học 3D của từng trạm phản ánh trực quan trạng thái: Khóa (mờ/đỏ), Mở khóa (xanh neon sáng) và Hoàn thành (vàng gold rực rỡ).
- [x] Người dùng có thể tự do dùng chuột hoặc cảm ứng để xoay 360 độ, phóng to thu nhỏ và quan sát toàn cảnh thiên hà kỹ năng.
- [x] Nhấp chuột vào một Skill Station kích hoạt chuyển động camera bay mượt mà (Fly-to Zoom) và mở màn hình Station Workspace tương ứng.

