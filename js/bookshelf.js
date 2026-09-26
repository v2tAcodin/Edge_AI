// ==========================================
// TỦ SÁCH KỸ THUẬT & THƯ VIỆN TÀI LIỆU GỐC (TECHNICAL BOOKSHELF & PDF HUB)
// Chứa toàn bộ các cuốn sách kinh điển, bài báo khoa học, Datasheet TRM & Tiêu chuẩn quốc tế mà App đã kế thừa
// ==========================================

const technicalBooksData = [
    {
        id: "book_esps3_trm",
        title: "ESP32-S3 Technical Reference Manual",
        subtitle: "Đặc tả kiến trúc phần cứng, không gian địa chỉ bộ nhớ và thanh ghi ngoại vi",
        author: "Espressif Systems",
        category: "hardware",
        categoryLabel: "Datasheet & Phần Cứng",
        year: 2024,
        pages: "1,426 trang",
        format: "PDF Chuyên Khảo",
        badge: "Tài Liệu Gốc Phần Cứng",
        coverIcon: "⚡",
        coverGradient: "linear-gradient(135deg, #091e3a 0%, #2f80ed 50%, #2d9cdb 100%)",
        downloadUrl: "https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf",
        mirrorUrl: "https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf",
        officialPortal: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/",
        appMapping: "Kiến trúc SRAM0/1/2, Vector SIMD AI, GPTimer 54-bit, ULP RISC-V, I2S DMA, TWAI CAN Bus (Bước 1, 2, 3, 7, 10, 13).",
        keyChapters: [
            "Chương 1: System and Memory Architecture (Trang 23-45)",
            "Chương 2: System Memory Map & PMS (Trang 46-78)",
            "Chương 5: IO MUX and GPIO Matrix (Trang 102-140)",
            "Chương 11: Timer Group & GPTimer (Trang 280-312)",
            "Chương 32: Ultra-Low-Power Co-processor ULP-RISC-V (Trang 920-960)"
        ],
        desc: "Cuốn 'kinh thánh' phần cứng bắt buộc phải có của mọi kỹ sư phát triển vi điều khiển ESP32-S3. Cung cấp địa chỉ vật lý, sơ đồ bit của toàn bộ thanh ghi phần cứng điều khiển vi xử lý Xtensa LX7 dual-core."
    },
    {
        id: "book_jacob_quantization",
        title: "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference",
        subtitle: "Công trình khoa học nền tảng khai sinh ra kỹ thuật lượng tử hóa INT8 trong TensorFlow Lite",
        author: "Benoit Jacob, Skirmantas Kligys, Bo Chen, Andrew Howard, et al. (Google Research)",
        category: "paper",
        categoryLabel: "Báo Cáo Khoa Học & AI",
        year: 2018,
        pages: "14 trang",
        format: "IEEE CVPR / arXiv",
        badge: "Nền Tảng Toán Học INT8",
        coverIcon: "🔬",
        coverGradient: "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
        downloadUrl: "https://arxiv.org/pdf/1712.05877.pdf",
        mirrorUrl: "https://arxiv.org/abs/1712.05877",
        officialPortal: "https://thecvf.com",
        appMapping: "Công thức toán học r = S * (q - Z), nhân ma trận Fixed-Point không cần FPU trong Lộ trình Bước 6 & Module 6 Code C.",
        keyChapters: [
            "Section 2: Quantization Scheme (Công thức ánh xạ toán học r = S * (q - Z))",
            "Section 3: Integer-arithmetic-only matrix multiplication",
            "Section 4: Training with simulated quantization",
            "Section 5: Experimental Results on MobileNets & Inception"
        ],
        desc: "Bài báo khoa học đạt giải xuất sắc tại hội nghị thị giác máy tính quốc tế IEEE CVPR 2018. Chứng minh khả năng nén mô hình học sâu 4 lần và tăng tốc độ suy luận 400% trên chip nhúng mà không làm sụt giảm độ chính xác."
    },
    {
        id: "book_freertos_kernel",
        title: "Mastering the FreeRTOS Real Time Kernel",
        subtitle: "Cẩm nang toàn thư về hệ điều hành thời gian thực đa nhiệm dành cho kỹ sư nhúng",
        author: "Richard Barry (Người sáng lập FreeRTOS)",
        category: "textbook",
        categoryLabel: "Sách Giáo Khoa Cốt Lõi",
        year: 2020,
        pages: "248 trang",
        format: "Sách Xuất Bản / PDF",
        badge: "Sách Kinh Điển FreeRTOS",
        coverIcon: "⏱️",
        coverGradient: "linear-gradient(135deg, #0b486b 0%, #f56217 100%)",
        downloadUrl: "https://github.com/FreeRTOS/FreeRTOS-Kernel-Book/releases",
        mirrorUrl: "https://www.freertos.org/Documentation/RTOS_book.html",
        officialPortal: "https://www.freertos.org",
        appMapping: "Đa nhiệm đối xứng SMP Dual-Core, ghim tác vụ Core 0/1, hàng đợi Queue, Mutex Priority Inheritance (Bước 4 & Module 4).",
        keyChapters: [
            "Chapter 3: Task Management & States",
            "Chapter 4: Queue Management & Thread-Safe Buffers",
            "Chapter 7: Resource Management & Mutex Priority Inheritance",
            "Chapter 9: The FreeRTOS SMP Extension for Multi-Core CPUs"
        ],
        desc: "Cuốn sách hướng dẫn thực hành tốt nhất về nhân hệ điều hành FreeRTOS từ chính tác giả sáng lập. Phân tích chi tiết lỗi đảo ngược quyền ưu tiên Unbounded Priority Inversion từng làm tê liệt tàu thăm dò NASA Mars Pathfinder 1997."
    },
    {
        id: "book_expert_c",
        title: "Expert C Programming: Deep C Secrets",
        subtitle: "Giải phẫu những góc tối phức tạp nhất của ngôn ngữ C, con trỏ và bố cục bộ nhớ",
        author: "Peter van der Linden (Sun Microsystems)",
        category: "textbook",
        categoryLabel: "Sách Giáo Khoa Cốt Lõi",
        year: 1994,
        pages: "384 trang",
        format: "Sách Chuyên Sâu",
        badge: "Bậc Thầy Con Trỏ C",
        coverIcon: "💡",
        coverGradient: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
        downloadUrl: "https://archive.org/details/expert-c-programming-deep-c-secrets-peter-van-der-linden",
        mirrorUrl: "https://en.wikipedia.org/wiki/Expert_C_Programming",
        officialPortal: "https://archive.org",
        appMapping: "Ẩn dụ tủ đồ con trỏ, toán tử mũi tên ->, con trỏ cấp 2, phân biệt con trỏ vs mảng, Strict Aliasing (Chuyên đề Con Trỏ & Bước 1, 9).",
        keyChapters: [
            "Chapter 4: The Shocking Truth: Arrays and Pointers Are NOT the Same!",
            "Chapter 5: Thinking of Linking & Memory Layout (Stack, Heap, Data, BSS)",
            "Chapter 9: More about Pointers & Dynamic Allocation",
            "Chapter 10: You Know C, So C++ is Easy! (Memory-Mapped Hardware)"
        ],
        desc: "Tác phẩm kinh điển gối đầu giường của các kỹ sư hệ thống C. Giải thích sáng tỏ và hóm hỉnh vì sao con trỏ và mảng lại làm bối rối hàng triệu lập trình viên và cách làm chủ cấu trúc bộ nhớ vật lý."
    },
    {
        id: "book_oppenheim_dsp",
        title: "Discrete-Time Signal Processing (3rd Edition)",
        subtitle: "Giáo trình tiêu chuẩn toàn cầu về xử lý tín hiệu số, biến đổi Fourier FFT và bộ lọc IIR",
        author: "Alan V. Oppenheim & Ronald W. Schafer (MIT / Pearson)",
        category: "textbook",
        categoryLabel: "Sách Giáo Khoa Cốt Lõi",
        year: 2010,
        pages: "1,120 trang",
        format: "Giáo Trình MIT / Pearson",
        badge: "Đỉnh Cao Lý Thuyết DSP",
        coverIcon: "📡",
        coverGradient: "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
        downloadUrl: "https://www.pearson.com/en-us/subject-catalog/p/discrete-time-signal-processing/P200000003294",
        mirrorUrl: "https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/",
        officialPortal: "https://ocw.mit.edu",
        appMapping: "Định lý lấy mẫu Nyquist, biến đổi Cooley-Tukey Radix-2 FFT, hàm cửa sổ Hanning w[n], bộ lọc IIR Biquad (Bước 3 & Module 3).",
        keyChapters: [
            "Chapter 4: Sampling of Continuous-Time Signals & Aliasing",
            "Chapter 7: Filter Design Techniques (IIR Biquad & FIR)",
            "Chapter 9: Computation of the Discrete Fourier Transform (FFT Algorithms)",
            "Chapter 10: Fourier Analysis of Signals Using the DFT & Windowing"
        ],
        desc: "Giáo trình nhập môn và chuyên sâu xử lý tín hiệu số được giảng dạy tại MIT và các đại học bách khoa hàng đầu thế giới. Nền tảng toán học cho toàn bộ các thuật toán tiền xử lý âm thanh và rung động trước khi đưa vào AI."
    },
    {
        id: "book_tinyml_oreilly",
        title: "TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power MCUs",
        subtitle: "Cẩm nang hướng dẫn xây dựng và triển khai mạng nơ-ron học sâu lên vi điều khiển giới hạn tài nguyên",
        author: "Pete Warden & Daniel Situnayake (Google / O'Reilly Media)",
        category: "textbook",
        categoryLabel: "Sách Giáo Khoa Cốt Lõi",
        year: 2020,
        pages: "504 trang",
        format: "Sách O'Reilly Xuất Bản",
        badge: "Nhập Môn TinyML Số 1",
        coverIcon: "🧠",
        coverGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        downloadUrl: "https://github.com/tensorflow/tflite-micro",
        mirrorUrl: "https://www.oreilly.com/library/view/tinyml/9781492052036/",
        officialPortal: "https://tinyml.org",
        appMapping: "Khung mã nguồn TFLite Micro, Op Resolver, Tensor Arena, trích xuất nhãn xác suất ArgMax (Bước 6, 8 & Module 6).",
        keyChapters: [
            "Chapter 3: Getting Started with TensorFlow Lite for Microcontrollers",
            "Chapter 7: Wake-Word Detection: Building an Application (KWS 16kHz)",
            "Chapter 11: Person Detection: Deploying a Vision Model on Edge",
            "Chapter 13: Optimizing Latency and Energy on Microcontrollers"
        ],
        desc: "Cuốn sách chính thống từ nhóm tác giả TensorFlow của Google, đặt viên gạch đầu tiên cho ngành kỹ thuật TinyML toàn cầu. Hướng dẫn chi tiết từ huấn luyện mô hình đến nhúng file C array vào vi điều khiển."
    },
    {
        id: "book_tdd_embedded_c",
        title: "Test-Driven Development for Embedded C",
        subtitle: "Phương pháp luận lập trình hướng kiểm thử, thiết kế tầng trừu tượng HAL và Mocking phần cứng",
        author: "James W. Grenning (Tác giả Tuyên ngôn Agile / Pragmatic Bookshelf)",
        category: "textbook",
        categoryLabel: "Sách Giáo Khoa Cốt Lõi",
        year: 2011,
        pages: "352 trang",
        format: "Sách Thực Hành Chuyên Sâu",
        badge: "Chuẩn Kỹ Sư Chuyên Nghiệp",
        coverIcon: "🧪",
        coverGradient: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
        downloadUrl: "https://pragprog.com/titles/jgade/test-driven-development-for-embedded-c/",
        mirrorUrl: "https://github.com/ThrowTheSwitch/Unity",
        officialPortal: "https://throwtheswitch.org",
        appMapping: "Thiết kế kiến trúc HAL con trỏ hàm, Unit Test tự động với Unity và CMock chạy trên PC x86 chỉ 3 giây (Bước 14).",
        keyChapters: [
            "Chapter 2: Working with Unity Test Framework",
            "Chapter 3: The Starting Point: Testing Modules in Isolation",
            "Chapter 7: Spying on the Hardware: Faking I/O with Function Pointers",
            "Chapter 10: Mocking Collaborators with CMock"
        ],
        desc: "Cuốn sách làm thay đổi tư duy lập trình nhúng truyền thống. Giúp kỹ sư thoát khỏi cách debug mò mẫm bằng đèn LED và Serial Print, chuyển sang xây dựng hệ thống kiểm thử tự động hàng trăm test cases."
    },
    {
        id: "book_misra_c",
        title: "MISRA C:2012 Guidelines for the Use of the C Language in Critical Systems",
        subtitle: "Bộ tiêu chuẩn vàng thế giới về quy tắc an toàn mã nguồn C trong ngành ô tô, hàng không và y tế",
        author: "MIRA Ltd (Motor Industry Software Reliability Association)",
        category: "standard",
        categoryLabel: "Tiêu Chuẩn Công Nghiệp",
        year: 2020,
        pages: "236 trang",
        format: "Bộ Tiêu Chuẩn Quốc Tế",
        badge: "Chuẩn An Toàn ISO 26262",
        coverIcon: "🛡️",
        coverGradient: "linear-gradient(135deg, #4b1248 0%, #f0c27b 100%)",
        downloadUrl: "https://www.misra.org.uk/",
        mirrorUrl: "https://github.com/danmar/cppcheck",
        officialPortal: "https://www.misra.org.uk",
        appMapping: "Cấm cấp phát động Rule 21.3, cấm ép kiểu con trỏ tùy tiện Rule 11.4, vòng lặp for Rule 14.2, quét lỗi Cppcheck (Bước 12).",
        keyChapters: [
            "Rule 8.4: Explicit Object Definition & Static Scope",
            "Rule 11.4: Conversion between Pointers and Integers",
            "Rule 14.2: The For-Loop Invariant & Counter Integrity",
            "Rule 21.3: Absolute Prohibition of Dynamic Memory Allocation"
        ],
        desc: "Tiêu chuẩn bắt buộc phải tuân thủ trong bất kỳ dự án phần mềm ô tô (Automotive ECU) hoặc thiết bị y tế nào trên toàn cầu. Đảm bảo mã nguồn C không chứa bất kỳ góc khuất Undefined Behavior nào."
    },
    {
        id: "book_can_iso11898",
        title: "ISO 11898-1:2015 & Bosch CAN Specification 2.0",
        subtitle: "Đặc tả kỹ thuật quốc tế về giao tiếp mạng vùng điều khiển (CAN Bus) và giao diện vi sai",
        author: "Robert Bosch GmbH / International Organization for Standardization (ISO)",
        category: "standard",
        categoryLabel: "Tiêu Chuẩn Công Nghiệp",
        year: 2015,
        pages: "74 trang",
        format: "Tiêu Chuẩn ISO / PDF",
        badge: "Chuẩn Mạng Xe Hơi Quốc Tế",
        coverIcon: "🚗",
        coverGradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        downloadUrl: "https://www.cs.cmu.edu/~koopman/des_s99/can/",
        mirrorUrl: "https://www.iso.org/standard/63648.html",
        officialPortal: "https://www.iso.org",
        appMapping: "Tín hiệu vi sai CAN_H/CAN_L, phân xử không phá hủy Bitwise Arbitration, bộ lọc phần cứng Acceptance Filter (Bước 13).",
        keyChapters: [
            "Part 1: Data Link Layer & Frame Formats (Standard 11-bit & Extended 29-bit)",
            "Part 2: Non-Destructive Bitwise Arbitration Mechanics",
            "Part 3: Error Detection, Fault Confinement & Bus-Off Recovery",
            "Part 4: Bit Timing and Synchronization with Prescaler"
        ],
        desc: "Bản đặc tả kỹ thuật gốc từ Robert Bosch GmbH và chuẩn ISO 11898-1. Cơ sở lý thuyết nền tảng cho việc vận hành mạng giao tiếp vi sai chống nhiễu điện từ trên hàng tỷ chiếc ô tô và dây chuyền robot nhà máy."
    },
    {
        id: "book_mlperf_tiny",
        title: "MLPerf Tiny Benchmark Suite: Benchmarking Embedded Machine Learning",
        subtitle: "Tiêu chuẩn quốc tế chuẩn hóa đo kiểm độ trễ suy luận, dung lượng bộ nhớ và năng lượng tiêu thụ",
        author: "Colby Banbury, Vijay Janapa Reddi, et al. (Harvard / MLCommons / NeurIPS 2021)",
        category: "paper",
        categoryLabel: "Báo Cáo Khoa Học & AI",
        year: 2021,
        pages: "16 trang",
        format: "NeurIPS Paper / arXiv",
        badge: "Chuẩn Benchmark Toàn Cầu",
        coverIcon: "📊",
        coverGradient: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
        downloadUrl: "https://arxiv.org/pdf/2106.07550.pdf",
        mirrorUrl: "https://arxiv.org/abs/2106.07550",
        officialPortal: "https://mlcommons.org/en/groups/research-tiny/",
        appMapping: "Đo chu kỳ lệnh CPU CCOUNT, đo năng lượng Joules/Inference, Confusion Matrix, Sensitivity & F1-Score (Bước 8).",
        keyChapters: [
            "Section 2: The Need for TinyML Standardization",
            "Section 3: Benchmark Tasks (Visual Wake Words, Keyword Spotting, Anomaly Detection)",
            "Section 4: Energy Measurement Framework (EEMBC EnergyRunner)",
            "Section 5: Cross-Hardware Evaluation (Cortex-M4, ESP32, RISC-V)"
        ],
        desc: "Công trình khoa học công bố tại hội nghị AI hàng đầu thế giới NeurIPS 2021 bởi liên minh MLCommons. Bộ thước đo chuẩn hóa được các tập đoàn bán dẫn (Intel, Arm, Qualcomm, Espressif) sử dụng để xếp hạng chip Edge AI."
    },
    {
        id: "book_iso_c11_standard",
        title: "ISO/IEC 9899:2011 (C11 Programming Language Standard)",
        subtitle: "Bản đặc tả chính thức ngôn ngữ lập trình C từ Ủy ban Tiêu chuẩn Quốc tế",
        author: "ISO/IEC JTC 1/SC 22/WG 14 (Ủy Ban Tiêu Chuẩn C Quốc Tế)",
        category: "standard",
        categoryLabel: "Tiêu Chuẩn Công Nghiệp",
        year: 2011,
        pages: "701 trang",
        format: "Tài Liệu Tiêu Chuẩn ISO",
        badge: "Đặc Tả Chuẩn Ngôn Ngữ C",
        coverIcon: "📜",
        coverGradient: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        downloadUrl: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf",
        mirrorUrl: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf",
        officialPortal: "https://www.open-std.org",
        appMapping: "Bẫy Integer Promotion §6.3.1.1, Struct Alignment Padding §6.7.2.1, từ khóa volatile §6.7.3, Sequence Points (Bước 9).",
        keyChapters: [
            "Section 6.3: Conversions & Integer Promotions",
            "Section 6.5: Expressions & Strict Aliasing Rule",
            "Section 6.7.2.1: Structure Specifiers & Byte Alignment Padding",
            "Section 6.7.3: Type Qualifiers (const, volatile, restrict)"
        ],
        desc: "Văn bản tiêu chuẩn gốc định nghĩa mọi hành vi cú pháp và ngữ nghĩa của ngôn ngữ C. Tài liệu tối cao để giải quyết mọi tranh cãi kỹ thuật và bẫy phỏng vấn firmware hóc búa nhất."
    },
    {
        id: "book_sei_cert_c",
        title: "SEI CERT C Coding Standard: Rules for Developing Safe, Reliable, and Secure Systems",
        subtitle: "Bộ quy tắc phòng chống lỗ hổng bảo mật bộ nhớ, tràn bộ đệm và tấn công mã độc",
        author: "Software Engineering Institute (Carnegie Mellon University)",
        category: "standard",
        categoryLabel: "Tiêu Chuẩn Công Nghiệp",
        year: 2016,
        pages: "582 trang",
        format: "Tiêu Chuẩn An Ninh Mạng",
        badge: "Bảo Mật Bộ Nhớ Cực Hạn",
        coverIcon: "🔐",
        coverGradient: "linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)",
        downloadUrl: "https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard",
        mirrorUrl: "https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=454220",
        officialPortal: "https://wiki.sei.cmu.edu",
        appMapping: "Phòng chống Use-After-Free, Double-Free, Buffer Overflow, kiểm tra biên mảng an toàn (Toàn bộ 72 bài tập Code C).",
        keyChapters: [
            "Rule ARR30-C: Do not form or use out-of-bounds pointers or array subscripts",
            "Rule MEM30-C: Do not access freed memory (Dangling Pointers)",
            "Rule MEM31-C: Free dynamically allocated memory when no longer needed",
            "Rule INT30-C: Ensure that unsigned integer operations do not wrap"
        ],
        desc: "Tiêu chuẩn an toàn thông tin mã nguồn C được phát triển bởi Đại học Carnegie Mellon phối hợp cùng Bộ Quốc phòng Mỹ. Tiêu diệt triệt để các lỗ hổng tràn bộ đệm và tấn công chiếm quyền điều khiển vi xử lý."
    }
];

let activeBookshelfCategory = "all";
let bookshelfSearchQuery = "";

function openBookshelfModal() {
    let modal = document.getElementById("bookshelf-modal");
    if (!modal) {
        createBookshelfModalDOM();
        modal = document.getElementById("bookshelf-modal");
    }
    renderBookshelfGrid();
    if (modal) {
        modal.classList.add("active");
        modal.classList.add("open");
    }
}

function closeBookshelfModal() {
    const modal = document.getElementById("bookshelf-modal");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.remove("open");
    }
}

function setBookshelfCategory(category) {
    activeBookshelfCategory = category;
    document.querySelectorAll(".bookshelf-filter-btn").forEach(btn => {
        if (btn.getAttribute("data-category") === category) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    renderBookshelfGrid();
}

function filterBookshelfBySearch(query) {
    bookshelfSearchQuery = query.toLowerCase().trim();
    renderBookshelfGrid();
}

function renderBookshelfGrid() {
    const container = document.getElementById("bookshelf-cards-grid");
    const countEl = document.getElementById("bookshelf-count-label");
    if (!container) return;

    let filtered = technicalBooksData.filter(b => {
        const matchesCategory = (activeBookshelfCategory === "all") || (b.category === activeBookshelfCategory);
        const matchesSearch = !bookshelfSearchQuery || 
            b.title.toLowerCase().includes(bookshelfSearchQuery) ||
            b.author.toLowerCase().includes(bookshelfSearchQuery) ||
            b.desc.toLowerCase().includes(bookshelfSearchQuery) ||
            b.appMapping.toLowerCase().includes(bookshelfSearchQuery);
        return matchesCategory && matchesSearch;
    });

    if (countEl) {
        countEl.innerText = `Hiển thị ${filtered.length} / ${technicalBooksData.length} Tài Liệu & Sách Gốc`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <div style="font-size: 36px; margin-bottom: 8px;">🔍</div>
                <div>Không tìm thấy tài liệu phù hợp với từ khóa "${escapeHtml(bookshelfSearchQuery)}".</div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(book => `
        <div class="book-card-item" id="book-card-${book.id}">
            <!-- 3D Book Spine Cover Presentation -->
            <div class="book-cover-wrap" style="background: ${book.coverGradient};">
                <div class="book-cover-badge">${escapeHtml(book.badge)}</div>
                <div class="book-cover-icon">${book.coverIcon}</div>
                <div class="book-cover-title">${escapeHtml(book.title)}</div>
                <div class="book-cover-author">✍️ ${escapeHtml(book.author)}</div>
                <div class="book-cover-meta">
                    <span>${escapeHtml(book.format)}</span> • <span>${escapeHtml(book.pages)}</span> • <span>${book.year}</span>
                </div>
            </div>

            <!-- Book Info & Application Context -->
            <div class="book-details-wrap">
                <div class="book-meta-top">
                    <span class="badge badge-accent">${escapeHtml(book.categoryLabel)}</span>
                    <span style="font-size: 11px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">${escapeHtml(book.pages)}</span>
                </div>

                <h3 class="book-title-heading">${escapeHtml(book.title)}</h3>
                <div class="book-subtitle-text">${escapeHtml(book.subtitle)}</div>

                <!-- Mapping in App -->
                <div class="book-app-mapping-box">
                    <strong style="color: var(--cyan); display: flex; align-items: center; gap: 5px; margin-bottom: 4px; font-size: 11px;">
                        <span>🎯</span> KIẾN THỨC ĐÃ TRÍCH XUẤT TRONG APP:
                    </strong>
                    <div style="font-size: 11.5px; color: #cbd5e1; line-height: 1.5;">${escapeHtml(book.appMapping)}</div>
                </div>

                <!-- Key Chapters Accordion / Snippets -->
                <div class="book-chapters-box">
                    <div style="font-size: 11px; font-weight: 600; color: var(--gold); margin-bottom: 4px;">📌 Các Chương / Section Nổi Bật:</div>
                    <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #94a3b8; line-height: 1.45;">
                        ${book.keyChapters.map(ch => `<li>${escapeHtml(ch)}</li>`).join('')}
                    </ul>
                </div>

                <!-- Book Summary -->
                <p class="book-desc-paragraph">${escapeHtml(book.desc)}</p>

                <!-- Actions Button Row -->
                <div class="book-action-row">
                    <a href="${book.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-book-download" title="Tải file PDF trực tiếp từ nguồn chính thức">
                        <span>📥</span> Tải PDF Gốc ↗
                    </a>
                    <a href="${book.mirrorUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-book-mirror" title="Mở cổng tài liệu trực tuyến">
                        <span>👁️</span> Đọc Online ↗
                    </a>
                    <button type="button" class="btn btn-secondary btn-book-ai" onclick="askAiAboutBook('${book.id}')" title="Hỏi trợ lý AI về tài liệu này">
                        <span>🤖</span> Nhờ AI Tóm Tắt
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function askAiAboutBook(bookId) {
    const book = technicalBooksData.find(b => b.id === bookId);
    if (!book) return;
    closeBookshelfModal();
    if (typeof switchTab === 'function') switchTab('notebook');
    if (typeof renderNotebookView === 'function') renderNotebookView();

    const inputEl = document.getElementById("nb-chat-input");
    if (inputEl) {
        inputEl.value = `Hãy tóm tắt những tư tưởng cốt lõi, công thức toán học và các chương quan trọng nhất trong tài liệu/cuốn sách: "${book.title}" (Tác giả: ${book.author}). Tài liệu này được áp dụng như thế nào vào việc lập trình hệ thống Edge AI trên ESP32-S3?`;
        inputEl.focus();
    }
    if (typeof showToast === 'function') {
        showToast(`🤖 Đã nạp câu hỏi về "${book.title}" vào khung chat AI!`);
    }
}

function createBookshelfModalDOM() {
    if (document.getElementById("bookshelf-modal")) return;

    const modal = document.createElement("div");
    modal.className = "nb-modal-backdrop";
    modal.id = "bookshelf-modal";
    modal.onclick = function(e) {
        if (e.target === this) closeBookshelfModal();
    };

    modal.innerHTML = `
        <div class="nb-modal-box bookshelf-modal-box" style="max-width: 1080px; width: 95vw; height: 90vh; display: flex; flex-direction: column;">
            <!-- Modal Header -->
            <div class="nb-modal-header" style="flex-shrink: 0; padding: 18px 24px; border-bottom: 1px solid rgba(0, 240, 255, 0.2);">
                <div style="flex: 1; min-width: 0;">
                    <div class="nb-modal-title" style="font-size: 18px; display: flex; align-items: center; gap: 10px; color: var(--cyan);">
                        <span>📚</span> TỦ SÁCH KỸ THUẬT & THƯ VIỆN TÀI LIỆU CHUẨN QUỐC TẾ
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
                        Toàn bộ 12 tài liệu gốc, Datasheet TRM, bài báo khoa học CVPR/NeurIPS và sách giáo khoa kinh điển đã được ứng dụng chắt lọc vào hệ thống.
                    </div>
                </div>
                <button class="btn-close" onclick="closeBookshelfModal()" title="Đóng">✕</button>
            </div>

            <!-- Toolbar: Search & Category Filters -->
            <div class="bookshelf-toolbar" style="flex-shrink: 0; padding: 14px 24px; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center;">
                <!-- Filter Pills -->
                <div class="bookshelf-filter-pills" style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button type="button" class="bookshelf-filter-btn active" data-category="all" onclick="setBookshelfCategory('all')">
                        🌟 Tất Cả (12)
                    </button>
                    <button type="button" class="bookshelf-filter-btn" data-category="hardware" onclick="setBookshelfCategory('hardware')">
                        ⚡ Datasheet & TRM (1)
                    </button>
                    <button type="button" class="bookshelf-filter-btn" data-category="paper" onclick="setBookshelfCategory('paper')">
                        🔬 Báo Cáo AI & Paper (2)
                    </button>
                    <button type="button" class="bookshelf-filter-btn" data-category="textbook" onclick="setBookshelfCategory('textbook')">
                        📚 Sách Giáo Khoa (5)
                    </button>
                    <button type="button" class="bookshelf-filter-btn" data-category="standard" onclick="setBookshelfCategory('standard')">
                        🛡️ Tiêu Chuẩn Công Nghiệp (4)
                    </button>
                </div>

                <!-- Search Input -->
                <div style="position: relative; min-width: 260px;">
                    <input type="text" id="bookshelf-search-input" class="nb-form-control" placeholder="Tìm theo tên sách, tác giả, tiêu chuẩn..." oninput="filterBookshelfBySearch(this.value)" style="padding-left: 32px; font-size: 12px; height: 34px;">
                    <span style="position: absolute; left: 10px; top: 8px; font-size: 14px; opacity: 0.6;">🔍</span>
                </div>
            </div>

            <!-- Modal Body: Book Grid List -->
            <div class="nb-modal-body" style="flex: 1; overflow-y: auto; padding: 24px;">
                <div id="bookshelf-count-label" style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px; font-family: 'JetBrains Mono', monospace;">
                    Hiển thị 12 / 12 Tài Liệu & Sách Gốc
                </div>
                <div class="bookshelf-grid" id="bookshelf-cards-grid">
                    <!-- Rendered by JS -->
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="nb-modal-footer" style="flex-shrink: 0; padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div style="font-size: 11.5px; color: #64748b;">
                    💡 <em>Toàn bộ liên kết tải PDF và tài liệu trực tuyến đều trỏ trực tiếp tới kho lưu trữ máy chủ chính thức của nhà xuất bản và tổ chức quốc tế.</em>
                </div>
                <button type="button" class="btn btn-secondary" onclick="closeBookshelfModal()">✕ Đóng Tủ Sách</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function openBookshelfForBook(bookId) {
    let modal = document.getElementById("bookshelf-modal");
    if (!modal) {
        createBookshelfModalDOM();
        modal = document.getElementById("bookshelf-modal");
    }
    
    // Reset filters to ensure book is visible
    activeBookshelfCategory = "all";
    bookshelfSearchQuery = "";
    const searchInput = document.getElementById("bookshelf-search-input");
    if (searchInput) searchInput.value = "";
    
    document.querySelectorAll(".bookshelf-filter-btn").forEach(btn => {
        if (btn.getAttribute("data-category") === "all") {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderBookshelfGrid();

    if (modal) {
        modal.classList.add("active");
        modal.classList.add("open");
    }

    // Scroll to the card and highlight it
    setTimeout(() => {
        const card = document.getElementById(`book-card-${bookId}`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.borderColor = "#00f0ff";
            card.style.boxShadow = "0 0 35px rgba(0, 240, 255, 0.6)";
            setTimeout(() => {
                card.style.borderColor = "";
                card.style.boxShadow = "";
            }, 3000);
        }
    }, 200);
}

// Export ra window toàn cục
window.technicalBooksData = technicalBooksData;
window.openBookshelfModal = openBookshelfModal;
window.openBookshelfForBook = openBookshelfForBook;
window.closeBookshelfModal = closeBookshelfModal;
window.setBookshelfCategory = setBookshelfCategory;
window.filterBookshelfBySearch = filterBookshelfBySearch;
window.askAiAboutBook = askAiAboutBook;
