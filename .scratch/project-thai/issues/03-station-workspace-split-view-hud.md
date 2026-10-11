# 03: Màn hình Tác nghiệp Station Workspace (Split-View HUD Overlay)

**What to build:**
Khi người học kích hoạt một Skill Station, hệ thống mở ra một màn hình tác nghiệp tập trung (Station Workspace) dạng Split-View HUD 2 cột công nghệ cao đè lên nền giao diện. Cột trái hiển thị lý thuyết cốt lõi, sơ đồ kiến trúc và nguyên lý phần cứng. Cột phải tích hợp 3 tab tương tác gồm: Code C Lab (xem và copy code có highlight), Visual Simulator (tương tác trực tiếp với bộ giả lập phần cứng tương ứng của trạm), và Checkpoint Quiz (trắc nghiệm đánh giá kiến thức với phản hồi giải thích ngay lập tức). Khi hoàn thành trạm (Quiz đạt $\ge 80\%$), hệ thống thưởng XP và kích hoạt mở khóa trạm kế tiếp theo cơ chế Progression Gate. Người dùng có thể nhấn nút Engineer Override để mở khóa tức thì toàn bộ trạm thông qua xác thực passcode.

**Blocked by:** 02: Động cơ Dữ liệu 4 Learning Tracks & Adapter Chuyển Đổi Tiến Độ

**Status:** completed

- [x] Station Workspace hiển thị dạng Split-View HUD 2 cột đè lên nền mờ, có thể đóng mở nhanh bằng phím ESC hoặc nút đóng.
- [x] Cột trái hiển thị nội dung lý thuyết tinh gọn, sơ đồ khối và ghi chú cốt lõi của bài học rõ ràng, sắc nét.
- [x] Cột phải chuyển đổi mượt mà giữa 3 tab: Code C Lab, Visual Simulator, và Checkpoint Quiz.
- [x] Tab Code C Lab hiển thị code mẫu có định dạng màu sắc cú pháp và nút sao chép nhanh vào clipboard.
- [x] Tab Visual Simulator nhúng chính xác bộ giả lập phù hợp (Hex Memory, GPIO LED, thanh ghi hoặc serial).
- [x] Tab Checkpoint Quiz chấm điểm tự động và hiển thị giải thích chi tiết khi chọn đáp án.
- [x] Hoàn thành trạm (vượt qua quiz $\ge 80\%$) sẽ thưởng XP, phát âm thanh chúc mừng và mở khóa trạm phụ thuộc tiếp theo.
- [x] Cửa sổ Engineer Override cho phép nhập passcode để kích hoạt mở khóa tức thì tất cả các trạm trên toàn hệ thống.

