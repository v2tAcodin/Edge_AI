# 01: De-clutter Navigation, Layout Refactor & Portfolio Data Core

**What to build:** Gỡ bỏ các module học tập cũ (`tab-learning`, `tab-practice`, `tab-notebook`, `tab-interview`, `tab-simulator`) khỏi thanh điều hướng chính, tinh gọn giao diện thành 3 phân khu chuẩn mực của Portfolio Kỹ sư (`🌌 3D Skill Tree`, `🏆 Projects Grid`, `👤 Profile & CV`). Thiết lập module dữ liệu chuẩn hóa `js/portfolio-data.js` chứa danh mục dự án thực chiến (với nhãn trạng thái `Completed`, `In Progress`, `Architecture Design`, thông số benchmark, code mẫu và telemetry UART), tích hợp khung điều phối `PortfolioController` để điều hướng toàn cục.

**Blocked by:** None (can start immediately)

**Status:** closed

- [x] Thanh điều hướng chính tinh gọn thành đúng 3 tab: `🌌 3D Skill Tree`, `🏆 Projects Grid`, `👤 Profile & CV`.
- [x] Gỡ bỏ hiển thị của các tab học tập cũ khỏi DOM hiển thị chính (`#view-learning`, `#view-practice`, `#view-notebook`, `#view-interview`, `#view-simulator`).
- [x] Xây dựng module `js/portfolio-data.js` định nghĩa đầy đủ schema dữ liệu: `engineerProfile`, `projects` (hỗ trợ `status`, `uartLogs`, `benchmarks`, `codeSnippets`), và `skillTreeNodes` với tọa độ 3D.
- [x] Tích hợp `PortfolioController` làm Seam điều phối trung tâm quản lý chuyển đổi giữa 3 view chính và nạp dữ liệu.
- [x] Viết test tự động kiểm thử tính hợp lệ của schema dữ liệu `PortfolioData` và khả năng chuyển đổi view của `PortfolioController`.
