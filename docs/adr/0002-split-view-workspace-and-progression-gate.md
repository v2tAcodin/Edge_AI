# 0002. Cấu trúc Station Workspace Split-View, Progression Gate và Floating Toolkit Dock

Hệ thống quyết định mô hình hóa việc học theo các Skill Station khép kín với giao diện Split-View HUD, cơ chế mở khóa tuần tự (Progression Gate) kèm quyền Engineer Override, và thu gọn thanh công cụ phụ trợ vào Floating Toolkit Dock.

## Context & Quyết định

- **Bối cảnh**: Hệ thống cũ có 8 tab rời rạc khiến trải nghiệm bị phân mảnh, thiếu tính định hướng và thanh Header chứa quá nhiều nút bấm làm chật chội màn hình.
- **Quyết định**:
  1. **Split-View HUD**: Mỗi Skill Station khi mở ra sẽ có 2 cột (Cột trái: Tinh hoa Lý thuyết & Sơ đồ phần cứng; Cột phải: 3 tab tương tác gồm Code C Lab, Visual Simulator và Checkpoint Quiz). Giúp người học đối chiếu kiến thức và thực hành ngay trên một màn hình.
  2. **Progression Gate**: Trạm sau chỉ mở khóa khi trạm trước đạt yêu cầu (rèn luyện tính kỷ luật tự thân). Cung cấp cơ chế "Engineer Override" (xác thực Passcode) để mở khóa tự do toàn bộ khi cần tra cứu khẩn cấp.
  3. **Floating Toolkit Dock**: Dời toàn bộ tiện ích phụ (Focus Pomodoro 25/5, Audio Lo-Fi, Tủ sách PDF, CheatSheet tra cứu, Quản lý sao lưu) xuống một thanh Dock nổi ở cạnh dưới màn hình, nhường toàn bộ không gian phía trên cho 3D Skill Galaxy và thương hiệu "Project Thai // Personal Mastery HUD".
