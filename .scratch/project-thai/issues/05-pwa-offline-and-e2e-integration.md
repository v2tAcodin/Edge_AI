# 05: Tối ưu Hóa Hiệu Năng, Offline PWA & Kiểm Thử Tích Hợp Toàn Diện

**What to build:**
Hoàn thiện toàn bộ hệ thống Project Thai để đạt độ mượt mà 60fps trên cả màn hình máy tính và thiết bị di động. Cập nhật Service Worker (`sw.js`) và `manifest.json` để đưa tài nguyên thư viện 3D từ CDN vào bộ nhớ đệm (cache), đảm bảo ứng dụng có thể cài đặt như PWA và hoạt động độc lập hoàn toàn offline khi không có kết nối internet. Thực hiện kiểm thử tích hợp đầu cuối (End-to-End) toàn bộ hành trình trải nghiệm của Kỹ sư Thai: từ cổng xác thực đăng nhập, điều hướng 3D Galaxy, mở Station Workspace học lý thuyết, chạy Code C, tương tác Simulator, làm Quiz nhận XP và mở khóa trạm kế tiếp, đến việc sao lưu dữ liệu ra tệp JSON.

**Blocked by:** 03: Màn hình Tác nghiệp Station Workspace (Split-View HUD Overlay), 04: Không Gian 3D Skill Galaxy & Mạng Lưới Chòm Sao Tương Tác

**Status:** completed

- [x] Cập nhật tệp `manifest.json` và Service Worker `sw.js` mang đúng tên `Project Thai` và cache đầy đủ tài nguyên cần thiết để chạy offline 100%.
- [x] Không gian 3D và các hiệu ứng động vận hành ổn định ở mức 60fps, tự động điều chỉnh tỷ lệ khung hình và góc nhìn camera khi thay đổi kích thước màn hình.
- [x] Hành trình người dùng từ Cổng bảo mật $\rightarrow$ Bản đồ 3D $\rightarrow$ Trạm học tập $\rightarrow$ Quiz $\rightarrow$ Mở khóa diễn ra liền mạch không phát sinh lỗi console.
- [x] Tính năng Xuất sao lưu JSON và Nạp phục hồi hoạt động chính xác với cấu trúc dữ liệu mới.
- [x] Ứng dụng đáp ứng đầy đủ tiêu chuẩn PWA, có thể cài đặt lên màn hình chính trên cả Windows, macOS, Android và iOS.

