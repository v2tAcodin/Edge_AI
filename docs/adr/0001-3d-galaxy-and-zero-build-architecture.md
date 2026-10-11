# 0001. Kiến trúc Đồ họa 3D Galaxy và Zero-Build PWA

Hệ thống quyết định sử dụng Three.js nạp qua CDN kết hợp kiến trúc Zero-Build (thuần HTML/CSS/Vanilla JS) để dựng bản đồ điều hướng 3D Skill Galaxy, đồng thời phân tách rạch ròi giữa không gian 3D tương tác và màn hình tác nghiệp 2D HUD Workspace.

## Context & Quyết định

- **Bối cảnh**: Hệ thống "Project Thai" cần giao diện 3D đẹp mắt, công nghệ cao nhưng phải đảm bảo khả năng chạy offline ổn định (PWA), tải siêu nhanh và deploy trực tiếp trên GitHub Pages mà không cần pipeline build phức tạp.
- **Quyết định**: 
  1. Sử dụng thư viện Three.js nạp từ CDN (`three.min.js`, `OrbitControls`) để kết xuất Scene 3D tương tác.
  2. Giữ nguyên mô hình Zero-Build (Vanilla ES6 modules/scripts), không chuyển sang Vite hay React/Next.js để bảo toàn tính độc lập và dung lượng nhẹ.
  3. Áp dụng mô hình "3D Map Navigation + 2D Focus Workspace": không gian 3D chỉ dùng để khám phá chòm sao kỹ năng và truyền cảm hứng thị giác; toàn bộ việc đọc lý thuyết, gõ code C, chạy simulator và làm quiz được đưa vào HUD Workspace 2D nổi bật để tối ưu độ tương phản, chống mỏi mắt và dễ thao tác trên mọi kích cỡ màn hình.
