# 02: Động cơ Dữ liệu 4 Learning Tracks & Adapter Chuyển Đổi Tiến Độ

**What to build:**
Tái cấu trúc toàn bộ nội dung học liệu phong phú hiện có (56 bài lý thuyết, 72 bài tập C, các bài thực hành giả lập ESP32 và 24 bộ câu hỏi phỏng vấn) vào một Động cơ Dữ liệu chuẩn hóa gồm 4 Learning Tracks khép kín:
1. Track 1: Embedded C & Architecture Core
2. Track 2: ESP32-S3 System & Peripherals
3. Track 3: TinyML & Edge AI Inference
4. Track 4: Capstone Projects & Phỏng Vấn Kỹ Sư

Mỗi trạm (Skill Station) trong track đóng gói đầy đủ: lý thuyết tinh gọn, code mẫu thực hành, cấu hình simulator và câu hỏi trắc nghiệm kiểm tra. Xây dựng bộ điều khiển trạng thái tự động đọc và chuyển đổi dữ liệu `localStorage` cũ sang các Station mới mà không làm mất điểm XP, streak hay mật khẩu đã lưu của người dùng.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] Toàn bộ nội dung học tập được tổ chức nhất quán thành 4 Learning Tracks với danh sách các Skill Station liên kết theo cây phụ thuộc.
- [x] Mỗi Skill Station mang đầy đủ thông tin: ID, tiêu đề, tóm tắt lý thuyết, code C mẫu, loại simulator và bộ câu hỏi trắc nghiệm.
- [x] Bộ chuyển đổi State Migration Adapter tự động nhận diện và nạp dữ liệu tiến độ cũ từ `localStorage`, giữ nguyên 100% điểm XP và lịch sử học tập.
- [x] Cung cấp các hàm logic truy vấn trạng thái: lấy danh sách track, lấy chi tiết trạm, kiểm tra trạng thái mở khóa trạm, đánh dấu hoàn thành trạm và tính toán tỷ lệ làm chủ.
- [x] Tích hợp cờ trạng thái Engineer Override trong phiên làm việc để hỗ trợ mở khóa toàn diện khi được kích hoạt.

