# 0004. Hợp nhất 3D Engine thành Cybernetic Tree và loại bỏ Galaxy3D

Chuẩn hóa toàn bộ trải nghiệm không gian 3D trên nền tảng `cyber-tree3d.js` và loại bỏ hoàn toàn `galaxy3d.js` (dead code ~19 KB) nhằm giải quyết xung đột khởi tạo kép WebGL trên cùng canvas `#galaxy-3d-canvas`. Quyết định này bảo đảm kiến trúc phân cấp tri thức hình cây (C/C++ Root ➔ Chuyên đề Branches ➔ Dự án Projects) thay thế hoàn toàn mô hình chòm sao phẳng cũ, đồng thời giữ bí danh tương thích ngược `window.skillGalaxy3D = window.cyberTree3D` để bảo toàn tính toàn vẹn của các API hiện hữu.
