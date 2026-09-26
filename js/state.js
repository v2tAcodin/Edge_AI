// ==========================================
// 1. STATE & STORAGE MANAGEMENT
// ==========================================
const STORAGE_ROADMAP = "mr_thai_edgeai_roadmap_v2";
const STORAGE_NOTES = "mr_thai_edgeai_notes_v2";
const STORAGE_PROFILE = "mr_thai_edgeai_profile_v2";
const STORAGE_CODE_CACHE = "mr_thai_codelearn_cache_v2";
const STORAGE_STREAK = "mr_thai_study_streak_v2";

const defaultProfile = {
    name: "Mr. Thai",
    role: "Edge AI & Embedded Systems Engineer (TinyML / ESP-IDF / FreeRTOS)",
    icon: "🤖",
    bio: "Nghiên cứu và triển khai mô hình học sâu (Deep Learning) lên vi điều khiển ESP32, tối ưu bộ nhớ SRAM/PSRAM, lượng tử hóa INT8 và đa nhiệm thời gian thực FreeRTOS.",
    contact: "thai.engineer@example.com",
    xp: 0,
    solvedProblems: []
};

const defaultRoadmap = [
    // ==========================================
    // CHẶNG 1: SINH VIÊN & NỀN TẢNG NHÚNG (YEAR 2-3)
    // ==========================================
    {
        phase: "academic",
        stage: "Bước 1: C & Quản Lý Bộ Nhớ",
        domain: "C Core, Pointers & Memory Architecture",
        icon: "🧠",
        tasks: [
            { id: "t1", title: "Thao tác con trỏ (Pointers), mảng động và Struct đóng gói dữ liệu", skill: "Pointers & Dynamic Memory Layout", done: false },
            { id: "t2", title: "Phân biệt Memory Map: Flash, Internal SRAM, RTC SRAM và External PSRAM", skill: "Memory Mapping (SRAM/Flash/PSRAM)", done: false },
            { id: "t3", title: "Quản lý Stack vs Heap, chống phân mảnh bộ nhớ và Memory Leak", skill: "Heap Management & Anti-Fragmentation", done: false },
            { id: "t4", title: "Kỹ thuật cấp phát bộ nhớ tĩnh (Static Allocation) chuẩn bị Tensor Arena", skill: "Static Tensor Arena Allocation", done: false }
        ]
    },
    {
        phase: "academic",
        stage: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        domain: "Hardware Timers, Precision & ISR",
        icon: "⏱️",
        tasks: [
            { id: "t5", title: "Cấu hình GPTimer định thời chính xác micro-giây cho lấy mẫu chu kỳ", skill: "Microsecond Hardware GPTimer", done: false },
            { id: "t6", title: "Lập trình hàm ngắt ISR với cờ IRAM_ATTR thực thi trực tiếp trên SRAM", skill: "High-Speed IRAM_ATTR Interrupts", done: false },
            { id: "t7", title: "Cơ chế Deferred Processing: Đẩy việc từ ISR sang Task qua Semaphore", skill: "Deferred ISR to Task Processing", done: false },
            { id: "t8", title: "Ứng dụng Timer định nhịp tần số lấy mẫu chuẩn (16kHz Audio / 100Hz IMU)", skill: "Deterministic Sensor Sampling Rate", done: false }
        ]
    },
    {
        phase: "academic",
        stage: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        domain: "Sensors, Signal Acquisition & Preprocessing",
        icon: "📡",
        tasks: [
            { id: "t9", title: "Giao tiếp I2C/SPI đọc dữ liệu thô cảm biến chuyển động 6 trục (IMU MPU6050)", skill: "I2C/SPI 6-Axis IMU Driver", done: false },
            { id: "t10", title: "Thu âm thanh kỹ thuật số băng thông cao qua chuẩn giao tiếp I2S Microphone", skill: "I2S Digital Microphone Streaming", done: false },
            { id: "t11", title: "Tiền xử lý tín hiệu: Bộ lọc nhiễu số (Moving Average, Low-pass Filter)", skill: "Digital Signal Noise Filtering", done: false },
            { id: "t12", title: "Trích xuất đặc trưng (Feature Extraction): Chuẩn hóa dữ liệu & Biến đổi FFT", skill: "Normalization & FFT Feature Extraction", done: false }
        ]
    },

    // ==========================================
    // CHẶNG 2: ĐỒ ÁN TỐT NGHIỆP EDGE AI A+ (YEAR 4 / CAPSTONE)
    // ==========================================
    {
        phase: "thesis",
        stage: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        domain: "FreeRTOS Dual-Core & Task Synchronization",
        icon: "⚡",
        tasks: [
            { id: "t13", title: "Phân chia 2 nhân ESP32 với xTaskCreatePinnedToCore (Core 0: IO, Core 1: AI)", skill: "Dual-Core Asymmetric Task Pinning", done: false },
            { id: "t14", title: "Truyền dữ liệu cảm biến sang tác vụ suy luận qua FreeRTOS Queue đệm an toàn", skill: "Thread-Safe FreeRTOS Data Queues", done: false },
            { id: "t15", title: "Tránh xung đột tài nguyên chung (Race Condition) bằng Mutex & Semaphore", skill: "Mutex & Resource Locking", done: false },
            { id: "t16", title: "Cơ chế giám sát Task Watchdog (TWDT) chống treo CPU khi mô hình suy luận", skill: "Task Watchdog Timer (TWDT)", done: false }
        ]
    },
    {
        phase: "thesis",
        stage: "Bước 5: Network & Nâng Cấp OTA",
        domain: "Wireless Telemetry & Over-The-Air Update",
        icon: "🌐",
        tasks: [
            { id: "t17", title: "Cấu hình kết nối Wi-Fi Station & Quản lý mất mạng tự động kết nối lại", skill: "Robust Wi-Fi Auto-Reconnection", done: false },
            { id: "t18", title: "Truyền phát gói tin cảnh báo / kết quả suy luận qua giao thức MQTT siêu nhẹ", skill: "Lightweight MQTT IoT Telemetry", done: false },
            { id: "t19", title: "Thiết lập phân vùng Flash ESP32 (Partition Table: ota_0, ota_1, nvs)", skill: "Dual OTA Partition Table Design", done: false },
            { id: "t20", title: "Nâng cấp Firmware & Cập nhật trọng số Model AI từ xa qua Wi-Fi OTA an toàn", skill: "Over-The-Air (OTA) Model Updating", done: false }
        ]
    },
    {
        phase: "thesis",
        stage: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        domain: "TinyML, TFLite Micro & Model Optimization",
        icon: "🤖",
        tasks: [
            { id: "t21", title: "Lượng tử hóa mô hình Deep Learning (INT8 Post-Training Quantization)", skill: "INT8 Model Quantization", done: false },
            { id: "t22", title: "Tích hợp thư viện TensorFlow Lite for Microcontrollers (TFLite Micro) / ESP-DL", skill: "TFLite Micro & ESP-DL Integration", done: false },
            { id: "t23", title: "Khởi tạo Tensor Arena, nạp model flatbuffer và gọi invoke() suy luận", skill: "Model Invocation & Tensor Management", done: false },
            { id: "t24", title: "Dự án hoàn chỉnh: Nhận diện từ khóa giọng nói (KWS) hoặc phân loại rung động", skill: "Complete Edge AI Production Project", done: false }
        ]
    },
    {
        phase: "thesis",
        stage: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        domain: "Low Power Optimization, Deep Sleep & Energy Harvesting",
        icon: "🔋",
        tasks: [
            { id: "t25", title: "Cấu hình chế độ Deep Sleep dòng rò micro-ampe (uA) duy trì nguồn pin nhiều tháng", skill: "Micro-Ampere Deep Sleep Optimization", done: false },
            { id: "t26", title: "Lập trình vi xử lý siêu tiết kiệm ULP Co-processor đọc cảm biến khi CPU chính ngủ", skill: "ULP FSM / RISC-V Co-processor Programming", done: false },
            { id: "t27", title: "Cơ chế đánh thức thông minh: EXT0/EXT1 ngắt GPIO & Timer RTC Wakeup", skill: "Event-Driven RTC Wakeup Triggers", done: false },
            { id: "t28", title: "Tính toán ngân sách năng lượng (Power Budgeting) & Ước tính dung lượng Pin Lithium", skill: "Battery Life Mathematical Modeling", done: false }
        ]
    },
    {
        phase: "thesis",
        stage: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        domain: "Academic Capstone Defense, Metrics & Documentation",
        icon: "🎓",
        tasks: [
            { id: "t29", title: "Đo đạc chỉ số suy luận: Latency (ms), Throughput (FPS), Footprint RAM/Flash", skill: "Edge AI Hardware Benchmarking", done: false },
            { id: "t30", title: "Phân tích ma trận nhầm lẫn (Confusion Matrix), Accuracy, Precision & Recall", skill: "Scientific AI Model Validation", done: false },
            { id: "t31", title: "Kiểm thử độ ổn định 24/7 (Stress Test, Memory Leak Heap Tracing)", skill: "24/7 Stability & Heap Tracing", done: false },
            { id: "t32", title: "Chuẩn bị Báo cáo Đồ án tốt nghiệp chuẩn IEEE & Slide bảo vệ tự tin", skill: "Technical Thesis Defense & Documentation", done: false }
        ]
    },

    // ==========================================
    // CHẶNG 3: CHINH PHỤC PHỎNG VẤN INTERN (TEST C & FIRMWARE)
    // ==========================================
    {
        phase: "intern",
        stage: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        domain: "Core C Traps, Hardware Quirks & Interview Puzzles",
        icon: "💡",
        tasks: [
            { id: "t33", title: "Từ khóa volatile: Khi nào bắt buộc dùng (Thanh ghi phần cứng, biến dùng trong ISR)", skill: "Volatile Keyword Hardware Mechanics", done: false },
            { id: "t34", title: "Căn lề bộ nhớ Struct Padding & Memory Packing (#pragma pack, sizeof trap)", skill: "Structure Padding & Alignment Hazards", done: false },
            { id: "t35", title: "Con trỏ nâng cao: Pointer to Pointer (**ptr), Function Pointer làm Callback", skill: "Advanced Pointers & Callback Architecture", done: false },
            { id: "t36", title: "Phân biệt const int *p vs int * const p, Bitwise shift tricks & Macro bẫy", skill: "Const Pointers & Bit Manipulation", done: false }
        ]
    },
    {
        phase: "intern",
        stage: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        domain: "Bare-Metal Registers, NVIC & Microcontroller Architecture",
        icon: "⚙️",
        tasks: [
            { id: "t37", title: "Đọc Datasheet & Lập trình ngoại vi trực tiếp qua Thanh ghi trần (Direct Register Access)", skill: "Bare-Metal Register-Level Programming", done: false },
            { id: "t38", title: "Kiến trúc ngắt NVIC / Interrupt Vector Table, Priority Grouping & Nesting", skill: "Interrupt Vector Controller (NVIC)", done: false },
            { id: "t39", title: "Cơ chế Pipeline, Cache Hit/Miss, Bus Matrix và DMA Arbiter của vi điều khiển", skill: "MCU Internal Bus Matrix & Pipeline", done: false },
            { id: "t40", title: "Hiểu sâu quy trình khởi động MCU: Bootloader, Reset Handler, Startup ASM & Linker Script (.ld)", skill: "Startup Code & Linker Script Anatomy", done: false }
        ]
    },
    {
        phase: "intern",
        stage: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        domain: "Hardware Oscilloscope, Logic Analyzer & GDB JTAG",
        icon: "🔍",
        tasks: [
            { id: "t41", title: "Sử dụng máy phân tích logic (Logic Analyzer) giải mã tín hiệu UART, I2C, SPI", skill: "Hardware Protocol Decoding with Logic Analyzer", done: false },
            { id: "t42", title: "Bắt lỗi Crash vi điều khiển: Đọc Crash Dump, Guru Meditation, Stack Trace với addr2line", skill: "Guru Meditation Crash & Stack Decoding", done: false },
            { id: "t43", title: "Debug phần cứng chuẩn JTAG với OpenOCD và GDB (Hardware Breakpoint, Watchpoint)", skill: "JTAG In-Circuit Debugging & GDB", done: false },
            { id: "t44", title: "Kỹ năng trả lời phỏng vấn kỹ thuật theo phương pháp STAR cho vị trí Intern Firmware", skill: "STAR Method Technical Interviewing", done: false }
        ]
    },

    // ==========================================
    // CHẶNG 4: HÀNH TRANG FRESHER ➔ JUNIOR (DỰ ÁN DOANH NGHIỆP THẬT)
    // ==========================================
    {
        phase: "fresher",
        stage: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        domain: "Automotive Safety, MISRA C:2012 & Static Analysis",
        icon: "🛡️",
        tasks: [
            { id: "t45", title: "Nguyên tắc cốt lõi MISRA C:2012: Không cấp phát động trong runtime, giới hạn con trỏ", skill: "MISRA C:2012 Automotive Compliance", done: false },
            { id: "t46", title: "Phòng chống hành vi bất định (Undefined Behavior) và tràn số nguyên (Integer Overflow)", skill: "Undefined Behavior Prevention", done: false },
            { id: "t47", title: "Tích hợp công cụ phân tích tĩnh (Static Code Analysis: Cppcheck, Clang-Tidy)", skill: "Automated Static Code Linting", done: false },
            { id: "t48", title: "Coding Convention chuẩn công nghiệp: Naming, Doxygen Documentation & File Structure", skill: "Industrial Code Convention & Doxygen", done: false }
        ]
    },
    {
        phase: "fresher",
        stage: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        domain: "Industrial Fieldbuses, CAN 2.0B / CAN FD & RS485 Modbus",
        icon: "🚗",
        tasks: [
            { id: "t49", title: "Kiến trúc mạng CAN Bus (TWAI trên ESP32): Khung tin tiêu chuẩn, ID Arbitration", skill: "CAN Bus 2.0B / TWAI Driver Architecture", done: false },
            { id: "t50", title: "Lọc gói tin phần cứng (Acceptance Filter) chống nghẽn CPU trên mạng ô tô", skill: "Hardware CAN Acceptance Filtering", done: false },
            { id: "t51", title: "Giao thức công nghiệp Modbus RTU qua chuẩn truyền thông vi sai RS485", skill: "RS485 Modbus RTU Industrial Protocol", done: false },
            { id: "t52", title: "Thiết kế Driver thiết bị ngoại vi chuẩn Module hóa (Layered HAL/Driver Pattern)", skill: "Layered Device Driver Architecture", done: false }
        ]
    },
    {
        phase: "fresher",
        stage: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        domain: "Embedded Unit Testing, Mocking & Automated DevOps",
        icon: "🚀",
        tasks: [
            { id: "t53", title: "Viết Unit Test cho mã nguồn C nhúng bằng framework Unity & CMock", skill: "Embedded Unit Testing with Unity & CMock", done: false },
            { id: "t54", title: "Giả lập phần cứng (Hardware Mocking) để chạy Unit Test trên máy tính CI mà không cần mạch thật", skill: "Hardware Abstraction Layer Mocking", done: false },
            { id: "t55", title: "Xây dựng luồng CI/CD với GitHub Actions: Tự động kiểm tra lint và build firmware khi Push", skill: "Automated Firmware CI/CD Pipelines", done: false },
            { id: "t56", title: "Quy trình làm việc nhóm chuyên nghiệp: Git Flow, Code Review & Release Management", skill: "Professional Git Flow & Firmware Release", done: false }
        ]
    }
];

const ROADMAP_STAGE_THEORY = [
    {
        stageIndex: 0,
        title: "Bước 1: C Core, Con Trỏ (Pointers) & Quản Lý Bộ Nhớ ESP32-S3",
        summary: "Nền tảng sống còn của kỹ sư nhúng: Nắm vững bản chất con trỏ trong C (Địa chỉ Address vs Giá trị Value, toán tử & và *, số học con trỏ, toán tử mũi tên -> struct, con trỏ hàm, void*, zero-copy buffer), hiểu sâu bản đồ bộ nhớ ESP32 (Internal SRAM, PSRAM, Flash, RTC), căn lề 16-byte bắt buộc cho SIMD AI và kỹ thuật cấp phát tĩnh chống phân mảnh Heap.",
        highlights: [
            "Bản chất Con Trỏ & Zero-Copy: Biến con trỏ lưu địa chỉ ô nhớ RAM. Dùng con trỏ struct giúp truyền frame dữ liệu 32KB mà chỉ tốn 4 byte Stack, bảo vệ hệ thống không bị tràn Stack Overflow.",
            "Hai toán tử vàng: &x (lấy địa chỉ nơi x nằm) và *ptr (mở ô nhớ đọc/ghi đè dữ liệu). Tên mảng arr thực chất là con trỏ hằng trỏ vào phần tử đầu tiên arr == &arr[0].",
            "Internal SRAM0/1 (512KB): Tốc độ 1 chu kỳ xung nhịp (~240MHz). Là vị trí duy nhất lý tưởng để đặt Tensor Arena giúp TinyML đạt độ trễ mili-giây.",
            "External PSRAM (8MB SPI): Chậm hơn SRAM nội 3-4 lần, dùng cho frame buffer camera. Cấp phát bằng heap_caps_malloc(size, MALLOC_CAP_SPIRAM).",
            "Căn lề bắt buộc alignas(16): Tập lệnh mở rộng SIMD nạp cùng lúc 128-bit dữ liệu. Nếu mảng Tensor Arena thiếu căn lề 16-byte, CPU sẽ Crash LoadStoreAlignment Error ngay."
        ],
        codeSnippet: `// 1. Con trỏ Struct Zero-copy an toàn:\ntypedef struct __attribute__((packed)) {\n    uint32_t timestamp;\n    int16_t accel_x, accel_y, accel_z;\n} IMU_Frame_t;\nvoid process_frame(const IMU_Frame_t *frame) {\n    if (!frame) return;\n    printf("X: %d\\n", frame->accel_x);\n}\n\n// 2. Tensor Arena căn lề 16-byte cho Vector SIMD:\nconstexpr int kTensorArenaSize = 64 * 1024;\nalignas(16) static uint8_t tensor_arena[kTensorArenaSize];`,
        docId: "doc_stage1_memory"
    },
    {
        stageIndex: 1,
        title: "Bước 2: Timer Phần Cứng GPTimer & Hàm Ngắt Tốc Độ Cao (ISR)",
        summary: "Thuật toán Edge AI đòi hỏi tín hiệu đầu vào phải được lấy mẫu cực kỳ ổn định theo thời gian (Deterministic Sampling). GPTimer 54-bit kết hợp ngắt IRAM_ATTR đảm bảo chu kỳ lấy mẫu chính xác từng micro-giây mà không bị jitter do hệ điều hành.",
        highlights: [
            "GPTimer 54-bit: Chạy trên xung nhịp APB 80MHz. Với prescaler = 80, bộ đếm tăng 1 đơn vị mỗi 1 µs, lý tưởng cho lấy mẫu IMU (100Hz) hoặc Audio (16kHz).",
            "Cờ IRAM_ATTR: Bắt buộc gắn cho hàm ngắt ISR để ép mã nguồn nằm trọn vẹn trong Internal SRAM, không nạp từ Flash qua Cache (tránh Crash Cache Disabled).",
            "Cơ chế Deferred Processing: ISR chỉ đọc dữ liệu phần cứng tối thiểu rồi gửi tín hiệu qua FreeRTOS Semaphore/Queue để Task bên ngoài xử lý, giữ thời gian phục vụ ngắt < 5µs."
        ],
        codeSnippet: `// Hàm ngắt Timer ISR lưu trong IRAM tốc độ cao:\nstatic bool IRAM_ATTR timer_isr_callback(gptimer_handle_t timer, const gptimer_alarm_event_data_t *edata, void *user_ctx) {\n    BaseType_t high_task_awoken = pdFALSE;\n    vTaskNotifyGiveFromISR(ai_task_handle, &high_task_awoken);\n    return high_task_awoken == pdTRUE;\n}`,
        docId: "doc_stage2_timer"
    },
    {
        stageIndex: 2,
        title: "Bước 3: Thu Thập Tín Hiệu Cảm Biến I2C/I2S DMA & Biến Đổi Phổ Số FFT",
        summary: "Mô hình AI trên Edge không nhận tín hiệu vật lý trực tiếp. Dữ liệu sóng thời gian từ Microphone (I2S DMA) hoặc IMU 6-trục (I2C) bắt buộc phải qua khâu lọc nhiễu số và biến đổi Fourier nhanh (FFT) để chuyển sang miền tần số đặc trưng.",
        highlights: [
            "I2S DMA Direct Memory Access: Tự động chuyển stream âm thanh kỹ thuật số từ microphone vào RAM qua cơ chế Ping-Pong Buffer mà không tốn chu kỳ lệnh CPU.",
            "Lọc số khử nhiễu: Áp dụng Moving Average hoặc Bộ lọc thông thấp số (Digital Low-Pass Filter) để loại bỏ nhiễu tần số cao của động cơ.",
            "Biến đổi phổ FFT: Chuyển đổi 512 hoặc 1024 mẫu sóng âm thanh thành mảng phổ tần số 32-64 bins năng lượng để làm đầu vào cho Tensor mạng nơ-ron."
        ],
        codeSnippet: `// Thu âm I2S DMA không chặn CPU:\ni2s_channel_read(rx_handle, dma_buffer, sizeof(dma_buffer), &bytes_read, portMAX_DELAY);\n// Áp dụng biến đổi phổ FFT qua thư viện ESP-DSP:\ndsps_fft2r_fc32(fft_input, 512);`,
        docId: "doc_stage3_sensors"
    },
    {
        stageIndex: 3,
        title: "Bước 4: Đa Nhiệm FreeRTOS Dual-Core & Đồng Bộ Hóa Hàng Đợi (Queue)",
        summary: "Tận dụng tối đa 2 nhân Xtensa LX7 của ESP32-S3: Cách ly toàn bộ tác vụ mạng và thu thập I/O lên Core 0, dành trọn vẹn 100% tài nguyên tính toán của Core 1 cho mô hình TinyML suy luận thời gian thực mà không bị nghẽn.",
        highlights: [
            "Asymmetric Task Pinning (Ghim Task 2 nhân): xTaskCreatePinnedToCore ghim tác vụ Wi-Fi/Sensors sang Core 0 và tác vụ AI Inference sang Core 1.",
            "Hàng đợi luồng an toàn (Thread-Safe Queue): Dùng FreeRTOS Queue để truyền an toàn các cửa sổ dữ liệu cảm biến giữa 2 nhân mà không gây Race Condition.",
            "Khóa tài nguyên Mutex & TWDT: Sử dụng Mutex khi dùng chung bus I2C/SPI và kích hoạt Task Watchdog Timer để phát hiện sớm hiện tượng khóa chết (Deadlock)."
        ],
        codeSnippet: `// Tạo tác vụ AI chạy độc lập trên Core 1:\nxTaskCreatePinnedToCore(ai_inference_task, "AI_Core1", 8192, NULL, 5, &ai_task_handle, 1);\n// Tạo tác vụ thu cảm biến trên Core 0:\nxTaskCreatePinnedToCore(sensor_sampler_task, "IO_Core0", 4096, NULL, 4, NULL, 0);`,
        docId: "doc_stage4_freertos"
    },
    {
        stageIndex: 4,
        title: "Bước 5: Ngăn Xếp Mạng Wi-Fi/MQTT & Phân Vùng Nâng Cấp OTA Hai Ngăn",
        summary: "Một thiết bị Edge AI hoàn chỉnh phải có khả năng gửi cảnh báo suy luận lên Cloud qua MQTT siêu nhẹ và cập nhật trọng số mô hình hoặc firmware mới từ xa qua Wi-Fi OTA mà không cần cắm dây cáp nạp.",
        highlights: [
            "Wi-Fi Station Tự Phục Hồi: Xử lý sự kiện SYSTEM_EVENT_STA_DISCONNECTED với cơ chế Exponential Backoff để tự động kết nối lại khi rớt mạng.",
            "MQTT IoT Telemetry: Đóng gói kết quả suy luận (nhãn, độ tin cậy confidence, độ trễ ms) thành JSON nhỏ gọn gửi lên Broker như EMQX hoặc AWS IoT.",
            "Kiến trúc Dual-Bank OTA: Bảng phân vùng chia thành ota_0 và ota_1. Firmware mới được ghi vào ngăn phụ, chỉ chuyển quyền boot khi kiểm tra CRC hợp lệ, có khả năng tự động Rollback."
        ],
        codeSnippet: `// Khởi động tiến trình nâng cấp firmware OTA qua HTTP:\nesp_http_client_config_t ota_config = {\n    .url = "https://server.com/firmware_ai_v2.bin",\n    .cert_pem = server_cert_pem\n};\nesp_https_ota(&ota_config);`,
        docId: "doc_stage5_network"
    },
    {
        stageIndex: 5,
        title: "Bước 6: Mô Hình AI Trên Edge (TinyML), Lượng Tử Hóa INT8 & TFLite Micro",
        summary: "Đỉnh cao của hệ thống Edge AI: Chuyển đổi mô hình Deep Learning từ Python/TensorFlow sang định dạng FlatBuffer siêu nhỏ, lượng tử hóa INT8 tiết kiệm 75% RAM/Flash và gọi Invoke() suy luận trực tiếp trên vi điều khiển.",
        highlights: [
            "Lượng tử hóa INT8: Chuyển đổi toàn bộ trọng số và activation từ số thực Float32 (4 bytes) sang số nguyên có dấu INT8 (1 byte). Giảm kích thước model 4 lần và tận dụng bộ số học nguyên Integer MAC của ESP32.",
            "TFLite Micro Resolver: Đăng ký chính xác các toán tử cần dùng (AllOpsResolver hoặc MicroMutableOpResolver) để trình liên kết Linker lược bỏ các toán tử thừa, tiết kiệm hàng chục KB Flash.",
            "Tối ưu vòng lặp suy luận: Đo chính xác thời gian thực thi (Latency in ms) và mức tiêu thụ SRAM thông qua profiler."
        ],
        codeSnippet: `// Quy trình suy luận mô hình TinyML trên vi điều khiển:\nTfLiteStatus invoke_status = interpreter->Invoke();\nTfLiteTensor* output = interpreter->output(0);\nint8_t prediction_class = output->data.int8[0];`,
        docId: "doc_stage6_tinyml"
    }
,
{
        stageIndex: 6,
        title: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP Co-processor & Deep Sleep)",
        summary: "Thiết bị Edge AI chạy pin đòi hỏi tối ưu dòng tiêu thụ từ hàng trăm mili-ampe xuống còn micro-ampe (uA). Sử dụng chế độ Deep Sleep kết hợp bộ đồng xử lý ULP (Ultra Low Power) đọc cảm biến định kỳ và chỉ đánh thức CPU chính khi có sự cố.",
        highlights: [
            "Dòng tiêu thụ Deep Sleep < 10uA: Ngắt nguồn toàn bộ CPU chính, bộ nhớ Flash và Wi-Fi/BT, chỉ duy trì RTC Memory và RTC Timer.",
            "Bộ đồng xử lý ULP RISC-V: Một vi xử lý 32-bit phụ tiêu thụ < 150uA chạy độc lập từ RTC Fast SRAM, có thể đọc ADC/I2C trong khi CPU chính ngủ.",
            "Cơ chế đánh thức linh hoạt (Wakeup Triggers): EXT0 (1 chân GPIO RTC), EXT1 (Bitmask nhiều nút nhấn), Timer định kỳ hoặc ULP ngắt."
        ],
        codeSnippet: `// Cấu hình đánh thức sau 60 giây ngủ sâu:\\nesp_sleep_enable_timer_wakeup(60 * 1000000ULL);\\nesp_deep_sleep_start();`,
        docId: "doc_stage7_lowpower"
    },
    {
        stageIndex: 7,
        title: "Bước 8: Tiêu Chuẩn Nghiệm Thu Đồ Án Tốt Nghiệp A+ & Benchmarking",
        summary: "Một đồ án tốt nghiệp xuất sắc không chỉ dừng ở việc demo chạy được, mà phải có số liệu đo đạc khoa học: bảng so sánh độ trễ (Inference Latency ms), dung lượng RAM chiếm dụng (Memory Footprint), ma trận nhầm lẫn (Confusion Matrix) và kiểm thử ổn định 24/7.",
        highlights: [
            "Đo đạc chỉ số suy luận: Sử dụng bộ đếm xung chu kỳ esp_timer_get_time() để đo thời gian tiền xử lý FFT và Invoke() của model theo mili-giây.",
            "Memory Footprint Profiling: Ghi nhận kích thước Flash nhị phân (.bin) và Heap Watermark trước/sau khi chạy suy luận.",
            "Đánh giá ma trận nhầm lẫn (Confusion Matrix): Tính toán các chỉ số khoa học: Accuracy, Precision, Recall và F1-Score trên tập dữ liệu thử nghiệm."
        ],
        codeSnippet: `int64_t t_start = esp_timer_get_time();\\nTfLiteStatus status = interpreter->Invoke();\\nint64_t t_latency = esp_timer_get_time() - t_start;\\nESP_LOGI("BENCHMARK", "Độ trễ suy luận AI: %lld us (~%.2f ms)", t_latency, t_latency / 1000.0);`,
        docId: "doc_stage8_capstone"
    },
    {
        stageIndex: 8,
        title: "Bước 9: 10 Bẫy C Kinh Điển Khi Phỏng Vấn Kỹ Sư Nhúng",
        summary: "Tổng hợp các câu hỏi bẫy C được 100% các công ty nhúng (Bosch, FPT, Viettel, Renesas, Ampere) sử dụng để lọc ứng viên: từ khóa volatile, căn lề struct padding, function pointer và phân biệt const pointer.",
        highlights: [
            "Từ khóa volatile: Báo cho trình biên dịch không được tối ưu hóa thanh ghi vào cache CPU. Bắt buộc dùng cho: thanh ghi I/O phần cứng, biến toàn cục sửa trong ISR, và biến cờ giữa 2 task RTOS.",
            "Struct Padding & Packing: Hiểu cơ chế nạp 4-byte/8-byte căn lề tự nhiên của CPU. Sử dụng #pragma pack(1) hoặc __attribute__((packed)) khi mapping giao thức truyền thông.",
            "Function Pointers: Kỹ thuật xây dựng mảng con trỏ hàm (Function Pointer Table) để làm State Machine hoặc Callback Driver mà không cần dùng chuỗi switch-case cồng kềnh."
        ],
        codeSnippet: `// Bẫy struct padding: sizeof(BadStruct) = 12 bytes thay vì 6 bytes!\\ntypedef struct {\\n    uint8_t a;  // 1 byte (+3 bytes padding)\\n    uint32_t b; // 4 bytes\\n    uint8_t c;  // 1 byte (+3 bytes padding)\\n} BadStruct;`,
        docId: "doc_stage9_c_interview"
    },
    {
        stageIndex: 9,
        title: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi Trần (Bare-Metal)",
        summary: "Vượt qua giới hạn của các thư viện đóng gói sẵn (Arduino/HAL): Kỹ sư nhúng thực thụ phải hiểu bảng phân vùng thanh ghi trong Datasheet/Technical Reference Manual, điều khiển ngoại vi bằng con trỏ địa chỉ trần và tối ưu chu kỳ lệnh.",
        highlights: [
            "Direct Register Access: Ép kiểu địa chỉ vật lý thành con trỏ volatile uint32_t* để đọc/ghi thanh ghi trong 1 chu kỳ xung nhịp.",
            "Thao tác Bitwise Masking: Thành thạo phép dịch bit (<<, >>), bật bit (|=), xóa bit (&= ~), đảo bit (^=) để cấu hình thanh ghi điều khiển.",
            "Hiểu Linker Script (.ld): Nơi chỉ định phân bổ code vào Flash hay RAM, vị trí Stack Top và khởi tạo biến .bss/.data trước hàm main()."
        ],
        codeSnippet: `// Bật chân GPIO2 trực tiếp qua thanh ghi vật lý (Zero abstraction overhead):\\n#define GPIO_OUT_W1TS_REG  0x3FF44008\\n*((volatile uint32_t *)GPIO_OUT_W1TS_REG) = (1 << 2);`,
        docId: "doc_stage10_baremetal"
    },
    {
        stageIndex: 10,
        title: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        summary: "Khi vi điều khiển không in ra log hoặc bị treo cứng, printf không còn tác dụng. Kỹ sư nhúng bắt buộc phải thành thạo máy phân tích logic (Logic Analyzer) để bắt gói tin, và GDB JTAG để soi từng thanh ghi CPU.",
        highlights: [
            "Sử dụng Logic Analyzer (Saleae / PulseView): Bắt xung nhịp clock và dữ liệu của I2C/SPI để phát hiện lỗi sai baudrate, thiếu điện trở kéo lên Pull-up, hoặc NACK từ cảm biến.",
            "Giải mã Guru Meditation Crash Dump: Đọc thanh ghi PC (Program Counter), EXCVADDR và dùng lệnh addr2line để định vị chính xác dòng code gây crash trong 5 giây.",
            "Debug phần cứng JTAG: Đặt phần cứng Breakpoint, xem nội dung RAM theo thời gian thực mà không làm dừng các ngắt khác."
        ],
        codeSnippet: `// Giải mã địa chỉ lỗi từ Crash Dump sang dòng code thực tế:\\nxtensa-esp32s3-elf-addr2line -pfia -e build/edge_ai_hub.elf 0x4200b21a`,
        docId: "doc_stage11_debug"
    },
    {
        stageIndex: 11,
        title: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô & Hàng Không (MISRA C:2012)",
        summary: "Tiêu chuẩn bắt buộc tại các tập đoàn lớn (Bosch, VinFast, Aptiv, Continental): Bộ quy tắc viết code C loại bỏ hoàn toàn các lỗ hổng bộ nhớ, ép kiểu ngầm định và con trỏ không an toàn.",
        highlights: [
            "Cấm cấp phát động: Nghiêm cấm hoàn toàn malloc/free trong runtime sau giai đoạn khởi động (Tránh lỗi phân mảnh Heap).",
            "Không sử dụng goto và đệ quy: Đảm bảo độ sâu ngăn xếp Stack là cố định và có thể tính toán được (Static Stack Bounding).",
            "Ép kiểu tường minh: Cấm ép kiểu con trỏ ngầm định, cấm dùng kiểu int nguyên thủy mà phải dùng stdint.h (uint8_t, int32_t...)."
        ],
        codeSnippet: `// Chuẩn MISRA: Khai báo tường minh độ rộng bit và giới hạn con trỏ:\\n#include <stdint.h>\\n#include <stdbool.h>\\nconst uint32_t MAX_BUFFER_SIZE = 256U;\\nuint8_t rx_buffer[256U];`,
        docId: "doc_stage12_misra"
    },
    {
        stageIndex: 12,
        title: "Bước 13: Giao Tiếp Công Nghiệp & Ô Tô (CAN Bus 2.0B / Modbus RS485)",
        summary: "Hai giao thức xương sống của ngành công nghiệp tự động hóa và ô tô: Mạng vi sai kháng nhiễu cực cao CAN Bus (TWAI trên ESP32) và Modbus RTU điều khiển thiết bị hiện trường.",
        highlights: [
            "Mạng CAN Bus: Hoạt động theo nguyên lý CSMA/CD với cơ chế giải quyết xung đột không phá hủy (Non-destructive bitwise arbitration) dựa trên CAN ID.",
            "Bộ lọc phần cứng Acceptance Filter: Cấu hình thanh ghi Mask và Code để vi điều khiển chỉ nhận đúng các gói tin cần thiết, loại bỏ hoàn toàn tải CPU xử lý tin rác.",
            "Modbus RTU qua RS485: Giao tiếp Master-Slave với mã kiểm tra lỗi CRC-16, truyền nhận dữ liệu tin cậy qua khoảng cách dây cáp hàng trăm mét."
        ],
        codeSnippet: `// Khởi tạo Driver CAN Bus (TWAI) trên ESP32:\\ntwai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(GPIO_NUM_4, GPIO_NUM_5, TWAI_MODE_NORMAL);\\ntwai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();\\ntwai_driver_install(&g_config, &t_config, &f_config);\\ntwai_start();`,
        docId: "doc_stage13_canbus"
    },
    {
        stageIndex: 13,
        title: "Bước 14: Kiểm Thử Tự Động Unit Test (Unity/CMock) & CI/CD Nhúng",
        summary: "Bước chuyển mình từ nghiệp dư sang kỹ sư chuyên nghiệp: Viết mã nguồn kiểm thử tự động (Unit Test) cho firmware và thiết lập đường ống CI/CD tự động build, kiểm tra lỗi trên máy chủ GitHub Actions mỗi khi đẩy code.",
        highlights: [
            "Framework Unity & CMock: Thư viện kiểm thử C chuẩn công nghiệp, cho phép giả lập (Mocking) các hàm đọc cảm biến phần cứng để kiểm tra logic thuật toán trên PC.",
            "Tách biệt Logic và Hardware (HAL): Thiết kế mã nguồn độc lập phần cứng để có thể biên dịch và chạy Unit Test trên máy tính của bạn chỉ trong vài giây.",
            "GitHub Actions Firmware CI: Tự động chạy Cppcheck, biên dịch firmware với idf.py build và báo cáo kết quả lên Pull Request."
        ],
        codeSnippet: `// Test case kiểm tra bộ lọc FFT với Unity:\\nvoid test_fft_filter_cutoff(void) {\\n    float input_signal[128];\\n    generate_sine_wave(input_signal, 1000.0f); // 1kHz\\n    float result = apply_lowpass_filter(input_signal, 500.0f);\\n    TEST_ASSERT_FLOAT_WITHIN(0.05f, 0.0f, result);\\n}`,
        docId: "doc_stage14_unittest"
    }
];

const ROADMAP_TASK_THEORY = {
    "t1": {
        title: "Thao tác con trỏ (Pointers), mảng động và Struct đóng gói dữ liệu",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Pointers & Dynamic Memory Layout",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: CON TRỎ (POINTER) TRONG C LÀ GÌ?
Nhiều bạn mới học thấy con trỏ mơ hồ vì chưa hình dung được vật lý phần cứng.
Hãy tưởng tượng **bộ nhớ RAM** của vi điều khiển ESP32 như một **khách sạn có hàng triệu ngăn tủ locker**:
- Mỗi ngăn tủ có một **Số phòng duy nhất** gọi là **Địa chỉ bộ nhớ (Memory Address)**, viết ở hệ thập lục phân Hexa (ví dụ: \`0x3FFB0004\`).
- Bên trong ngăn tủ chứa **Dữ liệu thực tế (Value)**, ví dụ số nguyên \`42\`.

👉 **Biến thông thường** (\`int x = 42;\`): Bạn đặt tên cho cái ngăn tủ đó là \`x\`. Giá trị lưu trong tủ là \`42\`.
👉 **Biến con trỏ** (\`int *ptr = &x;\`): Là một tờ giấy ghi lại **Số phòng của x** (\`0x3FFB0004\`). Con trỏ **KHÔNG** chứa số 42, nó chỉ chứa **địa chỉ nơi 42 đang nằm**!

---

### 📌 2. HAI TOÁN TỬ VÀNG BẮT BUỘC PHẢI THUỘC LÒNG
- **Toán tử lấy địa chỉ \`&\` (Address-of):**
  \`&x\` có nghĩa là: *"Hãy cho tôi biết địa chỉ ô nhớ nơi biến x đang ngụ cư trên RAM!"*
- **Toán tử giải tham chiếu \`*\` (Dereference):**
  \`*ptr\` có nghĩa là: *"Hãy đi đến địa chỉ ô nhớ mà ptr đang ghi, mở ngăn tủ đó ra để ĐỌC hoặc GHI ĐÈ dữ liệu mới!"*

**Ví dụ từng bước cực dễ hiểu:**
\`\`\`c
int a = 10;      // Ô nhớ của a (ví dụ 0x1000) chứa số 10
int *p = &a;     // p lưu giá trị 0x1000 (địa chỉ của a)

printf("%p\\n", p);   // In ra: 0x1000 (địa chỉ)
printf("%d\\n", *p);  // Mở ô nhớ 0x1000 ra đọc -> In ra: 10

*p = 99;         // Đến ô nhớ 0x1000 và thay thế số 10 bằng 99!
printf("%d\\n", a);   // a bây giờ đã biến thành 99!
\`\`\`

---

### 📌 3. MỐI QUAN HỆ MẬT THIẾT GIỮA CON TRỎ VÀ MẢNG (POINTER ARITHMETIC)
Trong C, **Tên mảng thực chất chính là một con trỏ hằng trỏ vào phần tử đầu tiên**:
\`\`\`c
int arr[3] = {10, 20, 30};
// arr tương đương với &arr[0]
\`\`\`
- Khi bạn viết \`arr[i]\`, trình biên dịch thực chất dịch thành: \`*(arr + i)\`.
- **Số học con trỏ (Pointer Arithmetic):**
  Phép cộng con trỏ \`ptr + 1\` **KHÔNG PHẢI** là cộng thêm 1 byte! Nó tự động nhảy thêm **kích thước của kiểu dữ liệu** (\`sizeof(type)\`):
  + Với \`char *p\`: \`p + 1\` nhảy 1 byte.
  + Với \`int *p\` hoặc \`float *p\`: \`p + 1\` nhảy **4 bytes**.
  + Với con trỏ Struct 16 byte: \`p + 1\` nhảy đúng **16 bytes**.

---

### 📌 4. CON TRỎ & STRUCT: TOÁN TỬ MŨI TÊN \`->\` VÀ TRUYỀN ZERO-COPY
Khi đóng gói dữ liệu cảm biến thành \`struct\`, ta thường dùng con trỏ trỏ vào struct:
\`\`\`c
typedef struct __attribute__((packed)) {
    uint32_t timestamp; // 4 bytes
    int16_t accel_x;    // 2 bytes
    int16_t accel_y;    // 2 bytes
    int16_t accel_z;    // 2 bytes
} IMU_Frame_t;
\`\`\`
- **Toán tử mũi tên \`->\`:**
  Nếu \`frame\` là con trỏ (\`IMU_Frame_t *frame\`), thay vì viết cồng kềnh \`(*frame).accel_x\`, C cung cấp toán tử mũi tên:
  \`frame->accel_x\`
- **Tại sao bắt buộc truyền con trỏ (Zero-copy pass-by-reference)?**
  Một khung âm thanh 16kHz có 32,000 bytes. Nếu truyền tham trị (\`void process(AudioData data)\`), CPU sẽ phải copy toàn bộ 32KB vào Stack -> **Tràn bộ nhớ Stack Overflow làm reset vi điều khiển ngay lập tức**!
  Khi truyền con trỏ (\`void process(const AudioData *data)\`), CPU chỉ truyền duy nhất **1 địa chỉ 4 byte**! Độ trễ 0ms, không tốn thêm 1 byte RAM nào.
- **Từ khóa \`__attribute__((packed))\`:**
  Trình biên dịch mặc định sẽ tự chèn các byte rỗng (padding bytes) để căn lề. Từ khóa \`packed\` ép các trường nằm sát nhau từng byte một, khớp 100% với luồng byte thô đọc từ cảm biến I2C/SPI.

---

### 📌 5. CÁC LOẠI CON TRỎ ĐẶC BIỆT TRONG NHÚNG & FREERTOS
1. **Con trỏ \`void*\` (Generic Pointer):**
   Con trỏ vạn năng có thể trỏ tới bất kỳ kiểu dữ liệu nào. Trong FreeRTOS, hàm tạo task luôn dùng \`void *pvParameters\` để kỹ sư truyền bất kỳ struct tham số nào vào task. Trước khi dùng, chỉ cần ép kiểu: \`MyConfig_t *cfg = (MyConfig_t*)pvParameters;\`.
2. **Con trỏ Hàm (Function Pointer):**
   Con trỏ lưu địa chỉ của hàm thực thi trong bộ nhớ. Dùng làm hàm Callback khi ngắt xảy ra, hoặc truyền task vào hệ điều hành:
   \`void (*callback_fn)(int event_id);\`
3. **Con trỏ Hằng (\`const\` Pointers):**
   - \`const int *p\`: Dữ liệu bị khóa (chỉ đọc), không sửa được qua \`*p\`. Con trỏ \`p\` có thể đổi trỏ đi nơi khác. Rất an toàn cho buffer đầu vào.
   - \`int * const p\`: Con trỏ bị khóa vị trí, nhưng giá trị \`*p\` sửa được.
4. **Con trỏ Volatile (Memory-Mapped I/O):**
   Trong vi điều khiển, các chân GPIO là các thanh ghi có địa chỉ cố định:
   \`*(volatile uint32_t*)0x60004008 = (1 << 2);\` -> Bật chân GPIO2 bằng thao tác con trỏ trực tiếp trên thanh ghi phần cứng!

---

### 📌 6. 4 CẠM BẪY CHÍ MẠNG KHI DÙNG CON TRỎ (VÀ CÁCH PHÒNG TRÁNH)
1. **Con trỏ NULL (NULL Pointer Dereference):** Cố truy xuất \`*p\` khi \`p == NULL\`.
   ✅ *Khắc phục*: Luôn kiểm tra \`if (p == NULL) { return ESP_ERR_INVALID_ARG; }\`.
2. **Con trỏ treo (Dangling Pointer):** Trỏ vào biến cục bộ trong một hàm đã kết thúc, hoặc ô nhớ vừa bị \`free()\`.
   ✅ *Khắc phục*: Sau khi \`free(ptr);\`, luôn gán ngay \`ptr = NULL;\`.
3. **Rò rỉ bộ nhớ (Memory Leak):** Cấp phát \`malloc()\` nhưng quên \`free()\`, làm cạn kiệt RAM sau vài giờ chạy.
4. **Ngoại lệ căn lề (Unaligned Access Fault):** Ép con trỏ mảng byte lẻ sang con trỏ số 32-bit khiến CPU phát sinh lỗi phần cứng Crash Guru Meditation.`,
        code: `// ============================================================================
// VÍ DỤ THỰC CHIẾN C NHÚNG: TRUYỀN DỮ LIỆU ZERO-COPY & THAO TÁC CON TRỎ AN TOÀN
// ============================================================================
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

// 1. Định nghĩa cấu trúc khung dữ liệu cảm biến (Packed, không có byte rác)
typedef struct __attribute__((packed)) {
    uint32_t timestamp_ms; // 4 bytes: Thời gian lấy mẫu
    int16_t accel_x;       // 2 bytes: Trục X (-32768 đến +32767)
    int16_t accel_y;       // 2 bytes: Trục Y
    int16_t accel_z;       // 2 bytes: Trục Z
    float temperature;     // 4 bytes: Nhiệt độ cảm biến
} SensorFrame_t;

// 2. Hàm xử lý dữ liệu: Sử dụng con trỏ hằng 'const SensorFrame_t *frame'
//    -> Ưu điểm 1 (Zero-Copy): Chỉ truyền địa chỉ 4-byte, không tốn RAM sao chép
//    -> Ưu điểm 2 (Safety): Từ khóa 'const' ngăn chặn việc vô tình sửa đổi dữ liệu gốc
bool process_sensor_stream(const SensorFrame_t *frame) {
    // Luôn kiểm tra con trỏ NULL trước khi giải tham chiếu để chống sụp nguồn
    if (frame == NULL) {
        printf("LỖI: Con trỏ truyền vào là NULL!\\n");
        return false;
    }

    // Truy cập các trường thông qua toán tử mũi tên ->
    printf("[T=%lums] X:%6d | Y:%6d | Z:%6d | Temp: %.1f*C\\n",
           frame->timestamp_ms,
           frame->accel_x,
           frame->accel_y,
           frame->accel_z,
           frame->temperature);

    return true;
}

// 3. Hàm thao tác mảng đệm âm thanh/ảnh bằng Pointer Arithmetic (Số học con trỏ)
void normalize_audio_buffer(int16_t *audio_buf, size_t length) {
    if (!audio_buf) return;

    // Dùng con trỏ trượt quét qua từng mẫu âm thanh (Tốc độ cao hơn chỉ số mảng)
    int16_t *ptr = audio_buf;
    int16_t *end = audio_buf + length;

    while (ptr < end) {
        *ptr = (*ptr) / 2; // Giảm âm lượng một nửa trực tiếp trên ô nhớ gốc
        ptr++;             // Nhảy tới mẫu 16-bit tiếp theo (tự động cộng 2 bytes)
    }
}

void app_main(void) {
    // Cấp phát tĩnh một khung mẫu trên Stack của app_main
    SensorFrame_t current_sample = {
        .timestamp_ms = 1250,
        .accel_x = 512,
        .accel_y = -128,
        .accel_z = 16384,
        .temperature = 28.5f
    };

    // Truyền địa chỉ (&current_sample) vào hàm xử lý
    process_sensor_stream(&current_sample);
}`
    },
    "t2": {
        title: "Phân biệt Memory Map: Flash, Internal SRAM, RTC SRAM và External PSRAM",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Memory Mapping (SRAM/Flash/PSRAM)",
        content: `### 📌 KIẾN TRÚC BẢN ĐỒ BỘ NHỚ THỐNG NHẤT TRÊN ESP32-S3
ESP32-S3 sử dụng không gian địa chỉ 32-bit (tối đa 4GB địa chỉ) phân chia thành 4 phân vùng vật lý hoàn toàn khác biệt:

1. **Flash SPI ROM (External SPI Flash, 4MB - 16MB)**:
   - Chứa Firmware biên dịch, Partition Table, hệ thống file SPIFFS/LittleFS và trọng số tĩnh (weights) của mô hình Deep Learning.
   - CPU đọc mã lệnh và dữ liệu hằng qua cơ chế **Instruction & Data Cache**.
   - ⚠️ *Lưu ý*: Tốc độ truy xuất chậm hơn SRAM nội. Không được phép đọc Flash khi đang thực thi ngắt khẩn cấp hoặc đang nạp OTA.

2. **Internal SRAM (512 KB siêu tốc nội tại vi điều khiển)**:
   - **SRAM0 (64 KB)**: Dành riêng cho Cache bộ nhớ và các hàm ngắt tốc độ cao mang cờ \`IRAM_ATTR\`.
   - **SRAM1 (384 KB)**: Vùng nhớ chính tốc độ 1 chu kỳ xung nhịp CPU (~240MHz). Đây là **vị trí vàng duy nhất** để khởi tạo **Tensor Arena** của TensorFlow Lite Micro nhằm đạt độ trễ suy luận mili-giây.
   - **SRAM2 (64 KB)**: Chuyên dụng cho các bộ đệm truyền nhận DMA của Wi-Fi, Bluetooth và ngoại vi I2S/SPI.

3. **RTC Fast/Slow Memory (16 KB SRAM năng lượng cực thấp)**:
   - Là vùng nhớ duy nhất vẫn được cấp nguồn nuôi khi ESP32 vào chế độ **Deep Sleep** (tiết kiệm pin, dòng tiêu thụ chỉ vài micro-ampe).
   - Biến mang tiền tố \`RTC_DATA_ATTR\` sẽ được lưu tại đây, bảo toàn giá trị đếm cảm biến qua các lần ngủ và thức dậy.

4. **External PSRAM (Pseudo-Static RAM ngoài, tối đa 8MB Octal SPI)**:
   - Dùng để mở rộng bộ nhớ khi làm bài toán Camera nhận diện hình ảnh hoặc mô hình AI lớn vượt quá 512KB SRAM.
   - Giao tiếp qua bus Octal SPI tốc độ cao (80-120MHz). Tuy nhiên tốc độ đọc ghi vẫn **chậm hơn SRAM nội khoảng 3 - 4 lần**. Không nên đặt các mảng tính toán ma trận đòi hỏi thời gian thực khắt khe vào đây nếu SRAM nội còn đủ chỗ.`,
        code: `// ============================================================================
// CẤP PHÁT BỘ NHỚ ĐÚNG VÙNG TRONG ESP-IDF VỚI HEAP CAPABILITIES API
// ============================================================================
#include "esp_heap_caps.h"
#include "esp_log.h"

void allocate_memory_example(void) {
    // 1. Cấp phát mảng Tensor Arena trong Internal SRAM tốc độ cao (1 chu kỳ xung nhịp)
    size_t arena_size = 64 * 1024; // 64 KB
    uint8_t *tensor_arena = (uint8_t *)heap_caps_malloc(arena_size, MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT);
    if (tensor_arena == NULL) {
        ESP_LOGE("MEM", "Không đủ SRAM nội cho Tensor Arena!");
    } else {
        ESP_LOGI("MEM", "Đã cấp phát 64KB Tensor Arena trong Internal SRAM tại: %p", tensor_arena);
    }

    // 2. Cấp phát Frame Buffer chứa ảnh Camera 320x240 RGB trong External PSRAM
    size_t frame_size = 320 * 240 * 3; // 230 KB
    uint8_t *camera_buf = (uint8_t *)heap_caps_malloc(frame_size, MALLOC_CAP_SPIRAM);
    if (camera_buf == NULL) {
        ESP_LOGE("MEM", "Không tìm thấy PSRAM hoặc PSRAM đầy!");
    } else {
        ESP_LOGI("MEM", "Đã cấp phát Frame Buffer Camera trong External PSRAM tại: %p", camera_buf);
    }

    // Luôn giải phóng khi kết thúc tác vụ
    if (tensor_arena) heap_caps_free(tensor_arena);
    if (camera_buf) heap_caps_free(camera_buf);
}`
    },
    "t3": {
        title: "Quản lý Stack vs Heap, chống phân mảnh bộ nhớ và Memory Leak",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Heap Management & Anti-Fragmentation",
        content: `### 📌 STACK VS HEAP TRONG HỆ THỐNG NHÚNG VẬN HÀNH 24/7

1. **Stack (Ngăn xếp - Tự động, tốc độ cao nhưng có hạn)**:
   - Lưu trữ các biến cục bộ trong hàm, địa chỉ trả về của hàm và con trỏ khung stack.
   - Được CPU cấp phát và giải phóng tự động cực nhanh (chỉ bằng việc tăng giảm con trỏ Stack Pointer \`SP\`).
   - ⚠️ **Nguy cơ**: Kích thước Stack của mỗi Task FreeRTOS được cố định khi tạo task (thường 2KB - 8KB). Khai báo mảng lớn cục bộ như \`float matrix[100][100];\` (40KB) sẽ gây **Stack Overflow**, ghi đè vào vùng nhớ lân cận và lập tức kích hoạt lỗi Guru Meditation làm sụp nguồn vi điều khiển!

2. **Heap (Vùng nhớ tự do - Động, linh hoạt nhưng nguy hiểm)**:
   - Dùng cho các khối bộ nhớ được cấp phát động bằng \`malloc()\`, \`calloc()\` hoặc \`heap_caps_malloc()\`.
   - Vùng nhớ này tồn tại cho đến khi kỹ sư chủ động gọi \`free()\`.

3. **CĂN BỆNH NGUY HIỂM NHẤT: PHÂN MẢNH HEAP (HEAP FRAGMENTATION)**:
   - Khác với ứng dụng trên máy tính cá nhân thường tắt sau vài tiếng, thiết bị IoT / Edge AI phải hoạt động liên tục nhiều tháng hoặc nhiều năm không khởi động lại.
   - Nếu chương trình liên tục gọi \`malloc()\` và \`free()\` với các kích thước lớn nhỏ khác nhau, bộ nhớ Heap sẽ bị đục thành hàng ngàn lỗ thủng nhỏ.
   - Hậu quả: Dù tổng RAM còn trống ghi nhận là 100KB, nhưng không còn một ô nhớ liên tục nào đủ 32KB -> Hệ thống báo lỗi **OOM (Out Of Memory Crash)**!

4. **GIẢI PHÁP CHỐNG PHÂN MẢNH CHO KỸ SƯ CHUYÊN NGHIỆP**:
   - **Ưu tiên cấp phát tĩnh (Static Allocation)**: Toàn bộ Tensor Arena, DMA Buffer, Queue đệm được cấp phát cố định 1 lần duy nhất lúc khởi động hệ thống.
   - **Kỹ thuật Memory Pool**: Chia bộ nhớ thành các Block có kích thước cố định (ví dụ các block 64 byte, 128 byte). Cấp phát và thu hồi theo block nguyên khối.
   - **Theo dõi Watermark**: Định kỳ gọi \`heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL)\` để ghi nhận mức RAM tự do thấp nhất từng chạm tới.`,
        code: `// ============================================================================
// GIÁM SÁT SỨC KHỎE BỘ NHỚ TRÁNH OOM TRÊN HỆ THỐNG NHÚNG
// ============================================================================
#include "esp_heap_caps.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

void memory_monitor_task(void *pvParameters) {
    while (1) {
        // 1. Lấy lượng RAM nội bộ tự do hiện tại
        size_t free_sram = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);

        // 2. Lấy khối nhớ liên tục lớn nhất hiện có (Chỉ số sống còn chống phân mảnh)
        size_t largest_block = heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL);

        // 3. Mức RAM thấp nhất trong lịch sử (Watermark)
        size_t min_ever_free = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);

        ESP_LOGI("HEALTH", "RAM Trống: %u bytes | Khối Liên Tục Lớn Nhất: %u bytes | Watermark: %u bytes",
                 free_sram, largest_block, min_ever_free);

        // Cảnh báo nếu mức phân mảnh cao (khối lớn nhất nhỏ hơn 40% tổng dung lượng trống)
        if (free_sram > 0 && (largest_block * 100 / free_sram) < 40) {
            ESP_LOGW("HEALTH", "CẢNH BÁO: Bộ nhớ đang bị phân mảnh nghiêm trọng!");
        }

        vTaskDelay(pdMS_TO_TICKS(5000)); // Kiểm tra chu kỳ 5 giây
    }
}`
    },
    "t4": {
        title: "Kỹ thuật cấp phát bộ nhớ tĩnh (Static Allocation) chuẩn bị Tensor Arena",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Static Tensor Arena Allocation",
        content: `### 📌 TENSOR ARENA LÀ GÌ VÀ TẠI SAO CẦN CĂN LỀ 16-BYTE ALIGNAS(16)?

1. **Khái niệm Tensor Arena**:
   - Trong thư viện **TensorFlow Lite for Microcontrollers (TFLite Micro)**, hệ thống không dùng \`malloc()\` trong suốt quá trình suy luận để bảo đảm độ trễ thời gian thực bất biến (Zero-Dynamic Allocation at Runtime).
   - Thay vào đó, toàn bộ vùng đệm đầu vào, đầu ra, trọng số tạm thời và các lớp kích hoạt trung gian (activations giữa Conv2D, Dense, Softmax) đều được xếp gọn trong một mảng byte liên tục duy nhất gọi là **Tensor Arena**.

2. **Tại sao bắt buộc phải căn lề 16-byte (\`alignas(16)\`)?**:
   - Vi xử lý Xtensa LX7 trên **ESP32-S3** tích hợp tập lệnh mở rộng chuyên dụng **Vector AI Extension (SIMD - Single Instruction Multiple Data)**.
   - Mỗi chu kỳ xung nhịp CPU, bộ xử lý SIMD có thể nạp đồng thời một lúc **128-bit (16 bytes)** dữ liệu ma trận trọng số INT8 vào các thanh ghi vector \`q0 - q7\`.
   - Để phần cứng nạp được 128-bit trong 1 chu kỳ máy, địa chỉ vùng nhớ bắt buộc phải chia hết cho 16 (\`address % 16 == 0\`).
   - ⚠️ **Hậu quả nếu thiếu căn lề**: Nếu bạn chỉ khai báo \`static uint8_t tensor_arena[64 * 1024];\` thông thường, mảng có thể rơi vào địa chỉ lẻ. Khi bộ giải mã AI gọi tập lệnh Vector nạp dữ liệu, phần cứng CPU sẽ lập tức phát sinh ngắt ngoại lệ **LoadStoreAlignment Error** làm Crash và khởi động lại vi điều khiển ngay tức khắc!`,
        code: `// ============================================================================
// KHỞI TẠO TENSOR ARENA ĐẠT CHUẨN CĂN LỀ VECTOR SIMD TRÊN ESP32-S3
// ============================================================================
#include <stdalign.h>
#include <stdint.h>
#include "esp_log.h"

// Kích thước Tensor Arena tính toán theo mô hình (ví dụ 64 KB cho KWS / Audio)
constexpr int kTensorArenaSize = 64 * 1024;

// alignas(16) ép trình biên dịch và Linker đặt mảng này tại địa chỉ chia hết cho 16
alignas(16) static uint8_t tensor_arena[kTensorArenaSize];

void verify_tensor_arena_alignment(void) {
    uintptr_t addr = (uintptr_t)tensor_arena;

    ESP_LOGI("AI_INIT", "Địa chỉ Tensor Arena: 0x%08lx", (unsigned long)addr);

    if (addr % 16 == 0) {
        ESP_LOGI("AI_INIT", "✅ ĐẠT CHUẨN: Vùng nhớ đã được căn lề 16-byte cho Vector SIMD AI!");
    } else {
        ESP_LOGE("AI_INIT", "❌ NGUY HIỂM: Thiếu căn lề 16-byte! Mô hình sẽ bị Crash khi gọi SIMD.");
    }
}`
    },
    "t5": {
        title: "Cấu hình GPTimer định thời chính xác micro-giây cho lấy mẫu chu kỳ",
        stageName: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        skill: "Microsecond Hardware GPTimer",
        content: `Mô hình AI nhận diện giọng nói hoặc rung động dựa trên giả định rằng các mẫu tín hiệu được lấy đều đặn tuyệt đối theo thời gian. Sử dụng hàm \`vTaskDelay()\` của FreeRTOS sẽ gây sai lệch (Jitter) hàng trăm micro-giây do độ phân giải của hệ thống chỉ là 1-10ms (100-1000Hz Tick Rate).
        
        Sử dụng bộ định thời phần cứng GPTimer với Prescaler 80 (tần số cơ sở 80MHz) chia xung về đúng 1MHz, giúp bộ đếm tăng 1 đơn vị mỗi đúng 1 µs độc lập với hệ điều hành.`,
        code: `gptimer_config_t timer_config = {\n    .clk_src = GPTIMER_CLK_SRC_DEFAULT,\n    .direction = GPTIMER_COUNT_UP,\n    .resolution_hz = 1000000, // 1 MHz = 1 micro-giây mỗi tick\n};\ngptimer_new_timer(&timer_config, &gptimer);`
    },
    "t6": {
        title: "Lập trình hàm ngắt ISR với cờ IRAM_ATTR thực thi trực tiếp trên SRAM",
        stageName: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        skill: "High-Speed IRAM_ATTR Interrupts",
        content: `Khi vi điều khiển phát sinh ngắt phần cứng, CPU phải nhảy đến hàm phục vụ ngắt (ISR) trong vòng vài nano-giây. Nếu hàm ISR nằm trên bộ nhớ Flash ngoài, CPU có thể bị khựng lại do Flash Cache Miss, hoặc nghiêm trọng hơn là Crash nếu hệ thống đang ghi dữ liệu vào Flash (SPI Flash Cache Disabled).
        
        Gắn cờ \`IRAM_ATTR\` trước tên hàm để chỉ định trình liên kết Linker đưa toàn bộ mã máy của hàm ngắt vào Internal SRAM, đảm bảo phản hồi tức thì và an toàn tuyệt đối.`,
        code: `static bool IRAM_ATTR timer_on_alarm_cb(gptimer_handle_t timer, const gptimer_alarm_event_data_t *edata, void *user_ctx) {\n    // Mã ngắt cực ngắn thực thi thẳng trên SRAM\n    BaseType_t high_task_awoken = pdFALSE;\n    vTaskNotifyGiveFromISR(ai_task_handle, &high_task_awoken);\n    return high_task_awoken == pdTRUE;\n}`
    },
    "t7": {
        title: "Cơ chế Deferred Processing: Đẩy việc từ ISR sang Task qua Semaphore",
        stageName: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        skill: "Deferred ISR to Task Processing",
        content: `Quy tắc vàng trong lập trình vi điều khiển: "Hàm ngắt ISR phải chạy càng nhanh càng tốt". Tuyệt đối không gọi các hàm tính toán nặng, FFT hay suy luận AI trong ISR vì sẽ làm tê liệt toàn bộ ngắt khác của vi điều khiển.
        
        Kỹ thuật Deferred Processing: ISR chỉ kích hoạt cờ tín hiệu (Binary Semaphore hoặc Direct-to-Task Notification), sau đó trả quyền điều khiển về CPU. Hệ điều hành FreeRTOS sẽ lập tức đánh thức tác vụ AI bên ngoài thực thi.`,
        code: `// Trong ISR: Đánh thức task\nvTaskNotifyGiveFromISR(xTaskHandle, &xHigherPriorityTaskWoken);\n\n// Trong Task ngoài: Chờ tín hiệu rồi xử lý\nvoid ai_task(void *pvParam) {\n    while(1) {\n        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);\n        run_feature_extraction_and_ai();\n    }\n}`
    },
    "t8": {
        title: "Ứng dụng Timer định nhịp tần số lấy mẫu chuẩn (16kHz Audio / 100Hz IMU)",
        stageName: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        skill: "Deterministic Sensor Sampling Rate",
        content: `Mỗi bài toán Edge AI có một tần số lấy mẫu định mức (Sampling Rate):
        - Nhận diện giọng nói từ khóa (Keyword Spotting): 16,000 Hz (khoảng cách giữa 2 mẫu = 62.5 µs).
        - Phân tích rung động động cơ (Anomaly Detection): 100 Hz (khoảng cách = 10,000 µs).
        - Phát hiện nhịp tim (ECG/PPG): 250 Hz (khoảng cách = 4,000 µs).
        
        Sử dụng GPTimer Alarm tự động nạp lại (Auto-reload) để đảm bảo chu kỳ lấy mẫu bất biến theo thời gian.`,
        code: `gptimer_alarm_config_t alarm_config = {\n    .reload_count = 0,\n    .alarm_count = 10000, // 10,000 µs = 100Hz cho cảm biến IMU\n    .flags.auto_reload_on_alarm = true,\n};\ngptimer_set_alarm_action(gptimer, &alarm_config);`
    },
    "t9": {
        title: "Giao tiếp I2C/SPI đọc dữ liệu thô cảm biến chuyển động 6 trục (IMU MPU6050)",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "I2C/SPI 6-Axis IMU Driver",
        content: `Cảm biến chuyển động 6 trục (3 trục gia tốc kế Accel + 3 trục con quay hồi chuyển Gyro) giao tiếp qua bus I2C (tối đa 400kHz Fast Mode) hoặc SPI (tối đa 10-20MHz).
        
        Để tối ưu băng thông I2C, thay vì đọc từng trục riêng lẻ (mỗi lần phát lệnh tốn địa chỉ Start/Stop), ta sử dụng kỹ thuật Burst Read: Đọc một lúc 14 bytes liên tục từ thanh ghi \`ACCEL_XOUT_H\` (0x3B) đến \`GYRO_ZOUT_L\` (0x48).`,
        code: `uint8_t raw_buf[14];\ni2c_master_write_read_device(I2C_NUM_0, MPU6050_ADDR, &reg_start, 1, raw_buf, 14, 1000 / portTICK_PERIOD_MS);\nint16_t ax = (raw_buf[0] << 8) | raw_buf[1];\nint16_t ay = (raw_buf[2] << 8) | raw_buf[3];`
    },
    "t10": {
        title: "Thu âm thanh kỹ thuật số băng thông cao qua chuẩn giao tiếp I2S Microphone",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "I2S Digital Microphone Streaming",
        content: `Khác với microphone analog nối qua ADC dễ bị nhiễu điện áp nguồn, microphone kỹ thuật số như INMP441 xuất trực tiếp dữ liệu âm thanh số 24-bit PCM qua giao tiếp I2S (Inter-IC Sound).
        
        ESP32-S3 sử dụng phần cứng DMA chuyên dụng với cấu trúc đệm đôi (Ping-Pong Buffer) để nhận luồng âm thanh liên tục mà không làm gián đoạn CPU.`,
        code: `i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);\ni2s_new_channel(&chan_cfg, NULL, &rx_handle);\n\n// Đọc 512 mẫu âm thanh từ DMA buffer:\nsize_t bytes_read = 0;\ni2s_channel_read(rx_handle, pcm_data, sizeof(pcm_data), &bytes_read, portMAX_DELAY);`
    },
    "t11": {
        title: "Tiền xử lý tín hiệu: Bộ lọc nhiễu số (Moving Average, Low-pass Filter)",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "Digital Signal Noise Filtering",
        content: `Tín hiệu cảm biến trong môi trường công nghiệp luôn chứa nhiễu: nhiễu điện áp lưới 50Hz, rung động cơ khí hoặc nhiễu trắng nhiệt.
        
        Áp dụng bộ lọc số bậc 1 Exponential Moving Average (EMA) để làm mượt dữ liệu mà không tốn nhiều phép tính:
        \`y[n] = alpha * x[n] + (1 - alpha) * y[n-1]\`
        Với alpha nằm trong khoảng [0.05 - 0.2].`,
        code: `float filter_ema(float raw, float prev, float alpha) {\n    return alpha * raw + (1.0f - alpha) * prev;\n}`
    },
    "t12": {
        title: "Trích xuất đặc trưng (Feature Extraction): Chuẩn hóa dữ liệu & Biến đổi FFT",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "Normalization & FFT Feature Extraction",
        content: `Mạng nơ-ron không xử lý tốt các số nguyên lớn biến thiên mạnh. Dữ liệu âm thanh hoặc rung động thô bắt buộc phải qua khâu:
        1. **Chuẩn hóa (Z-Score Normalization)**: \`(x - mean) / std\`.
        2. **Cửa sổ Hanning (Windowing)**: Tránh rò rỉ phổ (Spectral Leakage) ở hai đầu khung tín hiệu.
        3. **Biến đổi Fourier nhanh (FFT)**: Chuyển tín hiệu sóng sang phổ tần số (Spectrogram).
        Thư viện ESP-DSP của Espressif hỗ trợ tăng tốc SIMD phần cứng giúp tính toán FFT 512 điểm chỉ trong 0.8 mili-giây.`,
        code: `// Tăng tốc FFT bằng tập lệnh SIMD DSP:\ndsps_wind_hann_f32(windowed_signal, 512);\ndsps_fft2r_fc32(windowed_signal, 512);\ndsps_bit_rev2r_fc32(windowed_signal, 512);`
    },
    "t13": {
        title: "Phân chia 2 nhân ESP32 với xTaskCreatePinnedToCore (Core 0: IO, Core 1: AI)",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Dual-Core Asymmetric Task Pinning",
        content: `ESP32-S3 sở hữu 2 lõi vi xử lý Xtensa LX7 32-bit:
        - **Core 0 (PRO_CPU)**: Mặc định xử lý ngăn xếp mạng Wi-Fi, Bluetooth, bộ nhớ Flash và các ngắt ngoại vi.
        - **Core 1 (APP_CPU)**: Nên dành riêng cho các tác vụ tốn CPU nặng như tính toán ma trận TinyML và biến đổi số DSP.
        
        Bằng cách ghim tác vụ AI vào Core 1, mô hình suy luận sẽ chạy với độ trễ dự đoán được 100% (Deterministic Latency) mà không bị ngắt quãng khi có gói tin Wi-Fi gửi đến.`,
        code: `xTaskCreatePinnedToCore(ai_inference_task, "AI_Core1", 8192, NULL, 5, NULL, 1);\nxTaskCreatePinnedToCore(sensor_sampler_task, "IO_Core0", 4096, NULL, 4, NULL, 0);`
    },
    "t14": {
        title: "Truyền dữ liệu cảm biến sang tác vụ suy luận qua FreeRTOS Queue đệm an toàn",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Thread-Safe FreeRTOS Data Queues",
        content: `Khi truyền dữ liệu giữa 2 nhân chạy song song độc lập, việc dùng biến toàn cục chung (Global Variable) sẽ gây lỗi Race Condition (nhân này đọc trong khi nhân kia đang ghi dở).
        
        FreeRTOS Queue cung cấp cơ chế hàng đợi First-In First-Out (FIFO) hoàn toàn an toàn luồng (Thread-safe) với cơ chế khóa ngắt nội tại. Nếu Queue rỗng, tác vụ AI sẽ tự động đi vào trạng thái Blocked để tiết kiệm pin.`,
        code: `QueueHandle_t sensorQueue = xQueueCreate(10, sizeof(SensorFrame_t));\n// Bên Core 0 gửi: xQueueSend(sensorQueue, &frame, 0);\n// Bên Core 1 nhận: xQueueReceive(sensorQueue, &frame_for_ai, portMAX_DELAY);`
    },
    "t15": {
        title: "Tránh xung đột tài nguyên chung (Race Condition) bằng Mutex & Semaphore",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Mutex & Resource Locking",
        content: `Khi nhiều tác vụ cùng truy cập vào một bus ngoại vi chung (ví dụ bus I2C chia sẻ giữa cảm biến IMU và cảm biến nhiệt độ), phải sử dụng Mutex (Mutual Exclusion) để khóa tài nguyên.
        
        Mutex trong FreeRTOS tích hợp cơ chế Priority Inheritance (Kế thừa quyền ưu tiên) giúp ngăn chặn hiện tượng Nghịch đảo quyền ưu tiên (Priority Inversion) gây treo hệ thống.`,
        code: `SemaphoreHandle_t i2c_mutex = xSemaphoreCreateMutex();\nif (xSemaphoreTake(i2c_mutex, portMAX_DELAY) == pdTRUE) {\n    read_i2c_sensor();\n    xSemaphoreGive(i2c_mutex);\n}`
    },
    "t16": {
        title: "Cơ chế giám sát Task Watchdog (TWDT) chống treo CPU khi mô hình suy luận",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Task Watchdog Timer (TWDT)",
        content: `Nếu mô hình AI tính toán quá lâu trong một vòng lặp kín mà không nhường quyền điều khiển (yield) cho bộ lập lịch FreeRTOS, vi điều khiển có thể bỏ lỡ các tác vụ mạng quan trọng hoặc bị treo CPU.
        
        Cấu hình Task Watchdog Timer (TWDT) với ngưỡng thời gian (ví dụ 3 giây). Tác vụ AI phải gọi \`esp_task_wdt_reset()\` định kỳ sau mỗi lần suy luận xong. Nếu bị treo quá 3 giây, TWDT sẽ tự động khởi động lại vi điều khiển.`,
        code: `esp_task_wdt_add(NULL); // Đăng ký tác vụ hiện tại với Watchdog\nwhile(1) {\n    run_ai_model();\n    esp_task_wdt_reset(); // Báo cáo còn sống\n}`
    },
    "t17": {
        title: "Cấu hình kết nối Wi-Fi Station & Quản lý mất mạng tự động kết nối lại",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Robust Wi-Fi Auto-Reconnection",
        content: `Trong môi trường thực tế, sóng Wi-Fi có thể bị chập chờn hoặc router bị tắt. Hệ thống Edge AI không được phép đứng đợi vô tận (Hanging).
        
        Lập trình Event Handler lắng nghe sự kiện \`WIFI_EVENT_STA_DISCONNECTED\` và triển khai giải thuật Exponential Backoff (tăng dần thời gian chờ giữa các lần thử lại từ 1s, 2s, 4s... đến 30s) để tránh làm nghẽn bus mạng.`,
        code: `static void wifi_event_handler(void* arg, esp_event_base_t event_base, int32_t event_id, void* event_data) {\n    if (event_id == WIFI_EVENT_STA_DISCONNECTED) {\n        esp_wifi_connect();\n        ESP_LOGW("WIFI", "Mất kết nối, đang tự động kết nối lại...");\n    }\n}`
    },
    "t18": {
        title: "Truyền phát gói tin cảnh báo / kết quả suy luận qua giao thức MQTT siêu nhẹ",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Lightweight MQTT IoT Telemetry",
        content: `Khác với HTTP cồng kềnh với tiêu đề (Headers) hàng trăm bytes, giao thức MQTT (Message Queuing Telemetry Transport) có Header siêu nhỏ chỉ 2 bytes, hoạt động theo mô hình Publish/Subscribe.
        
        Mô hình Edge AI chỉ gửi gói tin cảnh báo khi phát hiện bất thường (Event-driven Telemetry) thay vì gửi stream dữ liệu thô liên tục, giúp tiết kiệm 95% băng thông mạng và năng lượng pin.`,
        code: `char payload[128];\nsnprintf(payload, sizeof(payload), "{\\"anomaly\\": true, \\"score\\": 0.94, \\"ms\\": 42}");\nesp_mqtt_client_publish(client, "factory/machine1/alert", payload, 0, 1, 0);`
    },
    "t19": {
        title: "Thiết lập phân vùng Flash ESP32 (Partition Table: ota_0, ota_1, nvs)",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Dual OTA Partition Table Design",
        content: `Để nâng cấp firmware từ xa mà không sợ bị biến vi điều khiển thành "cục gạch" (Bricking), ESP32 sử dụng bảng phân vùng Flash (Partition Table) chia thành 2 ngăn đối xứng:
        - \`nvs\`: Lưu cấu hình Wi-Fi và key API (Non-volatile storage).
        - \`otadata\`: 8KB lưu trạng thái ngăn boot hiện tại.
        - \`ota_0\` (App A): Dung lượng 1.5 - 2MB.
        - \`ota_1\` (App B): Dung lượng 1.5 - 2MB.
        Firmware đang chạy ở App A sẽ tải bản cập nhật mới ghi vào App B, sau đó hoán đổi quyền boot.`,
        code: `# Bảng phân vùng partitions.csv:\n# Name,   Type, SubType, Offset,  Size\nnvs,      data, nvs,     0x9000,  0x4000\notadata,  data, ota,     0xd000,  0x2000\nota_0,    app,  ota_0,   0x10000, 0x1E0000\nota_1,    app,  ota_1,   0x1F0000,0x1E0000`
    },
    "t20": {
        title: "Nâng cấp Firmware & Cập nhật trọng số Model AI từ xa qua Wi-Fi OTA an toàn",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Over-The-Air (OTA) Model Updating",
        content: `Quy trình nâng cấp OTA an toàn:
        1. Tải bản cập nhật firmware mới qua HTTPS.
        2. Ghi từng chunk dữ liệu vào ngăn OTA còn lại và kiểm tra mã băm SHA-256.
        3. Cập nhật bootloader để thử boot vào firmware mới.
        4. Trong firmware mới, sau khi khởi động thành công và tự kiểm tra (Self-test) các cảm biến và AI, gọi \`esp_ota_mark_app_valid_cancel_rollback()\`. Nếu firmware mới bị lỗi crash, hệ thống sẽ tự động Rollback về firmware cũ.`,
        code: `esp_https_ota_config_t ota_config = {\n    .http_config = &http_config,\n};\nesp_https_ota_handle_t ota_handle = NULL;\nesp_https_ota_begin(&ota_config, &ota_handle);\n// Sau khi boot thành công:\nesp_ota_mark_app_valid_cancel_rollback();`
    },
    "t21": {
        title: "Lượng tử hóa mô hình Deep Learning (INT8 Post-Training Quantization)",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "INT8 Model Quantization",
        content: `Mô hình Deep Learning sau khi huấn luyện trên máy tính có trọng số dạng số thực Float32 (4 bytes).
        
        Quy trình Post-Training Quantization (PTQ):
        Chuyển đổi trọng số và activations sang số nguyên có dấu INT8 (-128 đến 127).
        Công thức ánh xạ: \`Real = Scale * (Quantized - Zero_Point)\`.
        Giúp giảm dung lượng mô hình đúng 75% và tăng tốc độ suy luận gấp 3-5 lần nhờ tận dụng bộ tăng tốc số học nguyên của ESP32-S3.`,
        code: `converter = tf.lite.TFLiteConverter.from_saved_model(saved_model_dir)\nconverter.optimizations = [tf.lite.Optimize.DEFAULT]\nconverter.representative_dataset = representative_data_gen\nconverter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]\ntflite_quant_model = converter.convert()`
    },
    "t22": {
        title: "Tích hợp thư viện TensorFlow Lite for Microcontrollers (TFLite Micro) / ESP-DL",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "TFLite Micro & ESP-DL Integration",
        content: `TFLite Micro được Google thiết kế riêng cho các bộ vi điều khiển chỉ có vài trăm KB RAM:
        - Hoàn toàn không dùng cấp phát động malloc/new trong suốt quá trình suy luận.
        - Không phụ thuộc vào hệ điều hành (Bare-metal compatible).
        - Hỗ trợ thư viện ESP-NN / ESP-DL của Espressif: Tận dụng các tập lệnh vi mã vector SIMD tối ưu riêng cho nhân Xtensa LX7 của ESP32-S3.`,
        code: `// Sử dụng MicroMutableOpResolver để chỉ nạp các toán tử cần dùng:\ntflite::MicroMutableOpResolver<4> micro_op_resolver;\nmicro_op_resolver.AddConv2D();\nmicro_op_resolver.AddDepthwiseConv2D();\nmicro_op_resolver.AddFullyConnected();\nmicro_op_resolver.AddSoftmax();`
    },
    "t23": {
        title: "Khởi tạo Tensor Arena, nạp model flatbuffer và gọi invoke() suy luận",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "Model Invocation & Tensor Management",
        content: `Vòng đời hoàn chỉnh của một lần suy luận AI trên vi điều khiển:
        1. Nạp con trỏ mảng FlatBuffer từ Flash: \`tflite::GetModel(g_model_data)\`.
        2. Khởi tạo Interpreter với Tensor Arena được căn lề 16-byte.
        3. Cấp phát tensors: \`interpreter.AllocateTensors()\`.
        4. Sao chép dữ liệu cảm biến đã tiền xử lý vào \`interpreter.input(0)->data.int8\`.
        5. Gọi \`interpreter.Invoke()\` để thực hiện suy luận.
        6. Đọc kết quả từ \`interpreter.output(0)->data.int8\`.`,
        code: `TfLiteTensor* input = interpreter.input(0);\nmemcpy(input->data.int8, preprocessed_features, input->bytes);\n\nTfLiteStatus status = interpreter.Invoke();\nif (status == kTfLiteOk) {\n    TfLiteTensor* output = interpreter.output(0);\n    int8_t top_prediction = output->data.int8[0];\n}`
    },
    "t24": {
        title: "Dự án hoàn chỉnh: Nhận diện từ khóa giọng nói (KWS) hoặc phân loại rung động",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "Complete Edge AI Production Project",
        content: `Một dự án Edge AI chuẩn sản phẩm kết hợp toàn bộ 6 bước lộ trình:
        - Bước 1: Tensor Arena 64KB trong SRAM nội căn lề 16-byte.
        - Bước 2: GPTimer nhịp chu kỳ lấy mẫu 16kHz chuẩn xác.
        - Bước 3: I2S DMA thu âm và trích xuất 40 dải lọc Mel Spectrogram qua ESP-DSP.
        - Bước 4: Core 0 gửi thông báo qua MQTT, Core 1 chạy suy luận TFLite Micro.
        - Bước 5: Hỗ trợ OTA nâng cấp model mới từ xa.
        - Bước 6: Model lượng tử hóa INT8 kích thước < 50KB, độ trễ < 30ms, độ chính xác > 92%.`,
        code: `// Vòng lặp chính sản phẩm Edge AI:\nwhile(1) {\n    wait_for_audio_frame();\n    compute_mel_spectrogram();\n    interpreter.Invoke();\n    if (detect_keyword(threshold)) {\n        gpio_set_level(LED_ALERT, 1);\n        mqtt_publish_detection();\n    }\n}`
    }
,
"t25": {
        title: "Cấu hình chế độ Deep Sleep dòng rò micro-ampe (uA) duy trì nguồn pin nhiều tháng",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "Micro-Ampere Deep Sleep Optimization",
        content: `Khi thiết bị Edge AI triển khai ngoài thực địa (ví dụ: cảm biến giám sát sạt lở hoặc cháy rừng), nguồn pin là tài nguyên quý giá nhất. Ở chế độ hoạt động bình thường với Wi-Fi bật, ESP32 tiêu thụ từ 100mA đến 240mA, làm cạn kiệt viên pin 18650 chỉ sau 1 ngày.
        
        Kỹ thuật Deep Sleep tắt nguồn toàn bộ 2 nhân CPU chính, bộ nhớ Flash ngoài và modem vô tuyến, đưa mức tiêu thụ giảm xuống < 10 uA. Thiết bị có thể hoạt động liên tục từ 1 đến 3 năm với cùng 1 viên pin.`,
        code: `// Cấu hình ngủ sâu và tắt nguồn các rail ngoại vi:\\nesp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_OFF);\\nesp_sleep_enable_timer_wakeup(10 * 60 * 1000000ULL); // 10 phút\\nesp_deep_sleep_start();`
    },
    "t26": {
        title: "Lập trình vi xử lý siêu tiết kiệm ULP Co-processor đọc cảm biến khi CPU chính ngủ",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "ULP FSM / RISC-V Co-processor Programming",
        content: `Để không bỏ sót sự cố trong lúc CPU chính đang ngủ, ESP32 tích hợp vi xử lý phụ ULP (Ultra Low Power) chạy kiến trúc RISC-V 32-bit.
        
        ULP hoạt động độc lập ngay trong RTC Slow Memory với mức tiêu thụ chỉ ~150 uA, liên tục đọc giá trị ADC hoặc cảm biến I2C. Chỉ khi giá trị vượt ngưỡng nguy hiểm (Threshold Exceeded), ULP mới gửi tín hiệu ngắt đánh thức CPU chính dậy xử lý và gửi báo động.`,
        code: `// Trong firmware ULP RISC-V (chạy khi CPU chính ngủ):\\nvoid ulp_riscv_main(void) {\\n    uint32_t val = ulp_riscv_adc_readChannel(ADC_CHANNEL_0);\\n    if (val > THRESHOLD_LIMIT) {\\n        ulp_riscv_wakeup_main_processor();\\n    }\\n}`
    },
    "t27": {
        title: "Cơ chế đánh thức thông minh: EXT0/EXT1 ngắt GPIO & Timer RTC Wakeup",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "Event-Driven RTC Wakeup Triggers",
        content: `ESP32 cung cấp các nguồn đánh thức đánh thức CPU từ Deep Sleep:
        - **EXT0 (RTC IO)**: Giám sát 1 chân GPIO RTC duy nhất, đánh thức khi chân chuyển mức logic (High hoặc Low).
        - **EXT1 (Pin Mask)**: Giám sát tổ hợp nhiều chân GPIO RTC bằng mặt nạ bit (Bitmask). Hỗ trợ logic ANY_HIGH (bất kỳ chân nào kích hoạt) hoặc ALL_LOW.
        - **RTC Timer**: Đánh thức định kỳ theo thời gian chính xác từng micro-giây.
        Sau khi thức dậy, gọi hàm \`esp_sleep_get_wakeup_cause()\` để biết lý do đánh thức.`,
        code: `esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0); // Đánh thức khi bấm nút (mức 0)\\n// Kiểm tra lý do khi khởi động:\\nif (esp_sleep_get_wakeup_cause() == ESP_SLEEP_WAKEUP_EXT0) {\\n    ESP_LOGI("WAKEUP", "Được đánh thức bởi nút nhấn khẩn cấp!");\\n}`
    },
    "t28": {
        title: "Tính toán ngân sách năng lượng (Power Budgeting) & Ước tính dung lượng Pin Lithium",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "Battery Life Mathematical Modeling",
        content: `Mô hình toán học ước tính thời lượng pin kỹ sư cần trình bày trong đồ án tốt nghiệp:
        Dòng trung bình: \`I_avg = (I_active * T_active + I_sleep * T_sleep) / (T_active + T_sleep)\`.
        
        Ví dụ: 
        - CPU thức 0.5s thu thập và suy luận AI (120mA).
        - Ngủ sâu 59.5s (0.01mA).
        - \`I_avg = (120 * 0.5 + 0.01 * 59.5) / 60 = 1.01 mA\`.
        Với pin dung lượng 2500mAh, thời gian hoạt động thực tế = \`2500 / 1.01 ≈ 2475 giờ (~103 ngày)\`.`,
        code: `float calc_battery_days(float cap_mah, float i_active, float t_act_sec, float i_sleep, float t_sleep_sec) {\\n    float i_avg = (i_active * t_act_sec + i_sleep * t_sleep_sec) / (t_act_sec + t_sleep_sec);\\n    return (cap_mah / i_avg) / 24.0f; // Số ngày\\n}`
    },
    "t29": {
        title: "Đo đạc chỉ số suy luận: Latency (ms), Throughput (FPS), Footprint RAM/Flash",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "Edge AI Hardware Benchmarking",
        content: `Một đồ án tốt nghiệp điểm A+ bắt buộc phải có bảng Benchmarking định lượng chi tiết:
        1. **Inference Latency (Độ trễ suy luận)**: Thời gian gọi hàm \`Invoke()\` tính bằng mili-giây (ms).
        2. **Throughput (Tốc độ khung hình)**: Số lần suy luận trên giây (FPS hoặc Inferences/sec).
        3. **Flash Footprint**: Dung lượng file nhị phân firmware và trọng số model (.tflite flatbuffer).
        4. **Peak SRAM Consumption**: Lượng RAM lớn nhất mà Tensor Arena và Stack chiếm dụng.`,
        code: `int64_t t0 = esp_timer_get_time();\\ninterpreter.Invoke();\\nint64_t t1 = esp_timer_get_time();\\nfloat latency_ms = (t1 - t0) / 1000.0f;\\nfloat fps = 1000.0f / latency_ms;\\nESP_LOGI("METRICS", "Latency: %.2f ms | Throughput: %.1f FPS", latency_ms, fps);`
    },
    "t30": {
        title: "Phân tích ma trận nhầm lẫn (Confusion Matrix), Accuracy, Precision & Recall",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "Scientific AI Model Validation",
        content: `Khi bảo vệ trước hội đồng, chỉ báo cáo "Độ chính xác 95%" là chưa đủ và dễ bị phản biện. Kỹ sư phải chứng minh mô hình không bị thiên lệch (Class Imbalance) bằng các chỉ số:
        - **Accuracy**: (TP + TN) / (TP + TN + FP + FN).
        - **Precision (Độ chuẩn xác)**: Trong số những ca báo động, có bao nhiêu ca đúng thật.
        - **Recall (Độ nhạy)**: Trong tất cả các sự cố xảy ra, mô hình bắt được bao nhiêu ca.
        - **Confusion Matrix**: Ma trận đối chiếu nhãn thực tế và nhãn dự đoán.`,
        code: `// Bảng Confusion Matrix mẫu trong báo cáo:\\n//          Pred_Normal  Pred_Fault\\n// Actual_Normal    980          20    (Precision: 97.5%)\\n// Actual_Fault       8         192    (Recall: 96.0%)`
    },
    "t31": {
        title: "Kiểm thử độ ổn định 24/7 (Stress Test, Memory Leak Heap Tracing)",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "24/7 Stability & Heap Tracing",
        content: `Thiết bị nhúng công nghiệp phải vượt qua bài kiểm tra Stress Test liên tục 24-72 giờ mà không bị treo hay tự khởi động lại (Reboot).
        
        Sử dụng công cụ Heap Memory Tracing của ESP-IDF (\`esp_heap_trace_start\`) để ghi lại toàn bộ các lần gọi malloc/free, đảm bảo Delta RAM sau mỗi chu kỳ suy luận luôn bằng đúng 0 (Không bị rò rỉ dù chỉ 1 byte).`,
        code: `heap_trace_record_t records[100];\\nheap_trace_init_standalone(records, 100);\\nheap_trace_start(HEAP_TRACE_LEAKS);\\n// Chạy 100 chu kỳ suy luận...\\nrun_100_inferences();\\nheap_trace_stop();\\nheap_trace_dump(); // Phải không in ra bản ghi leak nào`
    },
    "t32": {
        title: "Chuẩn bị Báo cáo Đồ án tốt nghiệp chuẩn IEEE & Slide bảo vệ tự tin",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "Technical Thesis Defense & Documentation",
        content: `Cấu trúc slide bảo vệ đồ án tốt nghiệp chuẩn quốc tế:
        1. **Đặt vấn đề & Thực trạng**: Vì sao cần Edge AI (Bảo mật, giảm độ trễ, không phụ thuộc đường truyền).
        2. **Sơ đồ khối hệ thống (System Architecture)**: Phân tách rõ ràng Phần Cứng, Firmware và Model AI.
        3. **Các thách thức kỹ thuật đã vượt qua**: Tối ưu bộ nhớ SRAM, căn lề 16-byte, Deep Sleep và ngắt thời gian thực.
        4. **Kết quả định lượng & Video Demo thực tế**: Bảng đo đạc FPS, đồ thị tiêu thụ dòng điện, so sánh với các nghiên cứu trước đó.`,
        code: `// Cấu trúc sơ đồ khối đồ án:\\n[Cảm biến IMU/Mic] ➔ (DMA/I2C) ➔ [ESP32-S3 Core 0 (Tiền xử lý FFT)]\\n                                         ↓ (FreeRTOS Queue)\\n[MQTT Cloud / Dashboard] ⇦ (Wi-Fi) ⇦ [ESP32-S3 Core 1 (TFLite Micro INT8)]`
    },
    "t33": {
        title: "Từ khóa volatile: Khi nào bắt buộc dùng (Thanh ghi phần cứng, biến dùng trong ISR)",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Volatile Keyword Hardware Mechanics",
        content: `Câu hỏi phỏng vấn quốc dân: "Từ khóa \`volatile\` trong C có tác dụng gì và khi nào BẮT BUỘC phải dùng?"
        
        Ý nghĩa: Báo cho trình biên dịch rằng giá trị của biến này có thể bị thay đổi bất ngờ bởi phần cứng bên ngoài mà không thông qua sự kiểm soát của luồng code hiện tại. Trình biên dịch sẽ KHÔNG ĐƯỢC phép tối ưu hóa biến này vào thanh ghi CPU cache mà mỗi lần đọc/ghi đều phải truy cập trực tiếp vào ô nhớ RAM.
        3 trường hợp bắt buộc:
        1. Thanh ghi I/O phần cứng (Memory-mapped peripheral registers).
        2. Biến toàn cục được sửa đổi bên trong hàm ngắt ISR.
        3. Biến cờ cờ chia sẻ giữa nhiều tác vụ trong hệ điều hành đa nhiệm (RTOS).`,
        code: `volatile bool data_ready_flag = false;\\n\\nvoid IRAM_ATTR gpio_isr_handler(void* arg) {\\n    data_ready_flag = true; // Sửa trong ISR\\n}\\n\\nvoid main_task(void) {\\n    while(!data_ready_flag); // Nếu thiếu volatile, compiler sẽ tối ưu thành while(1) vô hạn!\\n}`
    },
    "t34": {
        title: "Căn lề bộ nhớ Struct Padding & Memory Packing (#pragma pack, sizeof trap)",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Structure Padding & Alignment Hazards",
        content: `Bẫy phỏng vấn: "Cho struct sau, hàm \`sizeof()\` trả về bao nhiêu?"
        \`struct Test { char a; int b; char c; };\`
        Đáp án: 12 bytes chứ KHÔNG PHẢI 6 bytes! Vì CPU 32-bit căn lề tự nhiên theo bội số 4 bytes, compiler tự động chèn 3 bytes đệm (padding) sau biến a, và 3 bytes đệm sau biến c.
        
        Cách khắc phục: Sắp xếp lại thứ tự biến từ lớn đến nhỏ (int b; char a; char c;) để giảm xuống 8 bytes, hoặc dùng \`__attribute__((packed))\` khi đóng gói gói tin mạng.`,
        code: `// Tối ưu thủ công (không tốn chu kỳ phạt căn lề của CPU):\\ntypedef struct {\\n    uint32_t b; // 4 bytes\\n    uint8_t a;  // 1 byte\\n    uint8_t c;  // 1 byte\\n    // Chỉ còn 2 bytes padding cuối -> Tổng: 8 bytes (Tiết kiệm 33% RAM)\\n} OptimizedStruct;`
    },
    "t35": {
        title: "Con trỏ nâng cao: Pointer to Pointer (**ptr), Function Pointer làm Callback",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Advanced Pointers & Callback Architecture",
        content: `Khi nào cần dùng con trỏ cấp 2 (\`void**\` hoặc \`int**\`)?
        Khi muốn một hàm thay đổi địa chỉ mà con trỏ ở hàm gọi đang trỏ tới (ví dụ: hàm cấp phát bộ nhớ động \`esp_err_t allocate_buffer(uint8_t **buf, size_t size)\`).
        
        Con trỏ hàm (Function Pointer): Là con trỏ lưu địa chỉ của một đoạn mã thực thi, là nền tảng để viết Driver theo mô hình Callback bất đồng bộ và bảng phương thức ảo (Virtual Table) trong C.`,
        code: `// Khai báo con trỏ hàm nhận uint8_t và trả về void:\\ntypedef void (*rx_callback_t)(uint8_t data);\\n\\nvoid uart_register_callback(rx_callback_t cb) {\\n    g_rx_cb = cb;\\n}\\n\\n// Khi có ngắt nhận dữ liệu:\\nvoid uart_isr() {\\n    if (g_rx_cb) g_rx_cb(U1RXREG);\\n}`
    },
    "t36": {
        title: "Phân biệt const int *p vs int * const p, Bitwise shift tricks & Macro bẫy",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Const Pointers & Bit Manipulation",
        content: `Mẹo nhớ quy tắc "Đọc từ phải sang trái" cho con trỏ const:
        - \`const int *p\`: p là con trỏ trỏ tới số nguyên hằng số (Giá trị *p không sửa được, nhưng p có thể trỏ đi nơi khác).
        - \`int * const p\`: p là con trỏ hằng trỏ tới số nguyên (Địa chỉ p không đổi được, nhưng giá trị *p có thể sửa).
        - \`const int * const p\`: Cả con trỏ và giá trị trỏ tới đều bất biến.
        
        Bẫy Macro: Luôn bọc dấu ngoặc đơn quanh tham số \`#define SQUARE(x) ((x) * (x))\` để tránh lỗi tính toán sai khi truyền biểu thức.`,
        code: `// Các phép thao tác bit kinh điển trong phỏng vấn:\\n#define SET_BIT(reg, bit)    ((reg) |= (1U << (bit)))\\n#define CLEAR_BIT(reg, bit)  ((reg) &= ~(1U << (bit)))\\n#define TOGGLE_BIT(reg, bit) ((reg) ^= (1U << (bit)))\\n#define CHECK_BIT(reg, bit)  (((reg) >> (bit)) & 1U)`
    },
    "t37": {
        title: "Đọc Datasheet & Lập trình ngoại vi trực tiếp qua Thanh ghi trần (Direct Register Access)",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "Bare-Metal Register-Level Programming",
        content: `Lập trình viên giỏi khác người mới ở khả năng "nói chuyện trực tiếp với phần cứng". Thay vì dùng thư viện Arduino \`digitalWrite()\`, ta thao tác trực tiếp với thanh ghi điều khiển được định nghĩa trong Technical Reference Manual.
        
        Mỗi chân GPIO có thanh ghi Đặt (Set: W1TS) và Xóa (Clear: W1TC). Ghi 1 vào bit tương ứng sẽ thay đổi trạng thái chân trong đúng 1 chu kỳ xung nhịp (4 nano-giây ở 240MHz).`,
        code: `// Cấu hình chân GPIO 4 làm Output và kéo lên High qua thanh ghi:\\n#define GPIO_ENABLE_REG   0x3FF44020\\n#define GPIO_OUT_W1TS_REG 0x3FF44008\\n\\n*((volatile uint32_t*)GPIO_ENABLE_REG)   |= (1U << 4); // Bật output\\n*((volatile uint32_t*)GPIO_OUT_W1TS_REG) =  (1U << 4); // Kéo High`
    },
    "t38": {
        title: "Kiến trúc ngắt NVIC / Interrupt Vector Table, Priority Grouping & Nesting",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "Interrupt Vector Controller (NVIC)",
        content: `Kiến trúc xử lý ngắt trong vi điều khiển ARM Cortex-M và Xtensa:
        - **Interrupt Vector Table**: Mảng chứa địa chỉ các hàm xử lý ngắt, bắt đầu từ địa chỉ Reset Handler.
        - **Preemption Priority (Độ ưu tiên chiếm quyền)**: Ngắt có độ ưu tiên cao hơn có thể chen ngang (Nest) ngắt đang chạy.
        - **Sub-priority**: Dùng để phân xử thứ tự khi 2 ngắt cùng xảy ra đồng thời.
        - **Tail-Chaining**: Tối ưu phần cứng giúp chuyển thẳng từ ISR này sang ISR khác mà không cần khôi phục rồi cất lại ngữ cảnh (Context Switch), tiết kiệm hàng chục chu kỳ máy.`,
        code: `// Nguyên lý Nesting: Ngắt Timer (Priority 1) chen ngang ngắt UART (Priority 3)\\n// NVIC tự động đẩy các thanh ghi R0-R3, R12, LR, PC, xPSR lên Stack trong 12 chu kỳ`
    },
    "t39": {
        title: "Cơ chế Pipeline, Cache Hit/Miss, Bus Matrix và DMA Arbiter của vi điều khiển",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "MCU Internal Bus Matrix & Pipeline",
        content: `Bên trong một vi điều khiển hiện đại:
        - **Bus Matrix (Ma trận Bus)**: Cho phép nhiều Master (CPU Core 0, CPU Core 1, DMA Controller) truy cập đồng thời vào các Slave khác nhau (SRAM, Flash, Ngoại vi) mà không bị chờ đợi nhau.
        - **DMA Arbiter**: Bộ phân xử quyền ưu tiên khi cả CPU và DMA cùng đòi đọc vào một khối RAM.
        - **Flash Cache Miss**: Khi CPU cần lệnh tiếp theo nhưng chưa có trong Cache nội, CPU bị stall (khựng lại) hàng chục chu kỳ xung nhịp.`,
        code: `// Tránh xung đột Bus giữa DMA và CPU:\\n// Đặt buffer DMA vào phân vùng RAM riêng biệt (Internal SRAM2) độc lập với Tensor Arena`
    },
    "t40": {
        title: "Hiểu sâu quy trình khởi động MCU: Bootloader, Reset Handler, Startup ASM & Linker Script (.ld)",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "Startup Code & Linker Script Anatomy",
        content: `Điều gì xảy ra từ lúc cắm nguồn đến khi chạy vào hàm \`main()\`?
        1. CPU đọc vector khởi động tại địa chỉ 0x00000000 để lấy giá trị Initial Stack Pointer.
        2. Nhảy vào **Reset_Handler** (viết bằng Assembly).
        3. Sao chép dữ liệu khởi tạo từ Flash sang RAM (Phân vùng \`.data\`).
        4. Xóa trắng toàn bộ phân vùng biến chưa khởi tạo về 0 (Phân vùng \`.bss\`).
        5. Cấu hình xung nhịp hệ thống (System Clock PLL).
        6. Gọi hàm \`main()\`. Toàn bộ cấu trúc này được chỉ huy bởi file kịch bản liên kết **Linker Script (.ld)**.`,
        code: `/* Trích đoạn Linker Script .ld chuẩn */\\n.data : AT(_sidata) {\\n    _sdata = .;\\n    *(.data*)\\n    _edata = .;\\n} > RAM\\n.bss : {\\n    _sbss = .;\\n    *(.bss*)\\n    _ebss = .;\\n} > RAM`
    },
    "t41": {
        title: "Sử dụng máy phân tích logic (Logic Analyzer) giải mã tín hiệu UART, I2C, SPI",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "Hardware Protocol Decoding with Logic Analyzer",
        content: `Kỹ sư phần cứng không tin vào suy đoán, kỹ sư tin vào dạng sóng (Waveform).
        Máy phân tích logic (Logic Analyzer) kết hợp phần mềm PulseView/Saleae cho phép bạn:
        - Đo chính xác thời gian đáp ứng giữa tín hiệu ngắt và chân GPIO phản hồi (Interrupt Latency).
        - Giải mã trực tiếp địa chỉ thiết bị I2C để kiểm tra xem cảm biến có gửi cờ ACK hay NACK.
        - Phát hiện lỗi tràn dữ liệu (Buffer Overrun) hoặc sai định dạng baudrate/parity trên đường truyền UART.`,
        code: `// Dấu hiệu I2C NACK trên Logic Analyzer:\\n// SDA ở mức cao (High) tại sườn lên thứ 9 của xung SCL -> Cảm biến không nhận địa chỉ!`
    },
    "t42": {
        title: "Bắt lỗi Crash vi điều khiển: Đọc Crash Dump, Guru Meditation, Stack Trace với addr2line",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "Guru Meditation Crash & Stack Decoding",
        content: `Khi vi điều khiển gặp lỗi nghiêm trọng (truy cập con trỏ NULL, chia cho 0, hoặc tràn Stack), hệ thống sẽ in ra màn hình thông báo: \`Guru Meditation Error: Core 1 panic'ed (LoadProhibited)\`.
        
        Kỹ năng chuyên nghiệp: Không đoán mò code. Hãy copy địa chỉ thanh ghi \`PC: 0x4200b21a\` và các địa chỉ trong danh sách \`Backtrace:\`, sau đó dùng công cụ \`addr2line\` để tìm ra chính xác tên file và số dòng code phát sinh lỗi.`,
        code: `// Lệnh dòng lệnh giải mã địa chỉ crash:\\nxtensa-esp32s3-elf-addr2line -pfia -e build/firmware.elf 0x4200b21a\\n// Kết quả in ra:\\n// 0x4200b21a: process_sensor_frame at /home/user/edge_ai/main/main.c:142`
    },
    "t43": {
        title: "Debug phần cứng chuẩn JTAG với OpenOCD và GDB (Hardware Breakpoint, Watchpoint)",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "JTAG In-Circuit Debugging & GDB",
        content: `Khi hàm gặp lỗi chạy sai ngẫu nhiên trong bộ nhớ RAM, in log \`printf\` sẽ làm thay đổi thời gian thực thi (Timing perturbation) và che giấu lỗi.
        
        Sử dụng mạch nạp JTAG (hoặc mạch tích hợp ESP32 USB-JTAG) kết hợp trình gỡ lỗi GDB:
        - Đặt **Hardware Watchpoint**: Dừng ngay lập tức vi điều khiển khi có bất kỳ tác vụ nào ghi đè vào một ô nhớ cụ thể (Tìm ra thủ phạm Memory Corruption).
        - Xem trực tiếp nội dung Call Stack và các thanh ghi của cả 2 nhân cùng lúc.`,
        code: `(gdb) target remote :3333\\n(gdb) watch g_shared_counter // Đặt điểm canh giữ\\n(gdb) continue\\n// GDB sẽ dừng đúng dòng code ghi vào biến g_shared_counter!`
    },
    "t44": {
        title: "Kỹ năng trả lời phỏng vấn kỹ thuật theo phương pháp STAR cho vị trí Intern Firmware",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "STAR Method Technical Interviewing",
        content: `Khi nhà tuyển dụng yêu cầu: "Hãy kể về một lỗi phần cứng hoặc bug khó nhất mà bạn từng giải quyết?", hãy áp dụng cấu trúc **STAR**:
        - **S (Situation)**: Đồ án Edge AI nhận diện từ khóa bị crash ngẫu nhiên sau khi chạy được 2-3 tiếng.
        - **T (Task)**: Cần tìm ra nguyên nhân gốc rễ (Root Cause) mà không làm chậm tốc độ suy luận của mô hình.
        - **A (Action)**: Kết nối Logic Analyzer kiểm tra bus I2S, bật tính năng Heap Tracing và phát hiện chuỗi sprintf trong task AI bị tràn Stack bộ nhớ. Đã chuyển sang cấp phát tĩnh và tăng kích thước Stack lên 4KB.
        - **R (Result)**: Hệ thống chạy liên tục 48 giờ ổn định, độ trễ suy luận giảm xuống còn 35ms.`,
        code: `// Bí quyết: Luôn nói về số liệu định lượng (ms, KB, % độ trễ) thay vì cảm tính chung chung`
    },
    "t45": {
        title: "Nguyên tắc cốt lõi MISRA C:2012: Không cấp phát động trong runtime, giới hạn con trỏ",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "MISRA C:2012 Automotive Compliance",
        content: `MISRA C (Motor Industry Software Reliability Association) là bộ tiêu chuẩn lập trình C an toàn bắt buộc trong ngành ô tô, y tế và hàng không vũ trụ.
        
        Quy tắc tiêu biểu trong MISRA C:2012:
        - **Rule 21.3**: Không sử dụng các hàm cấp phát động \`malloc\`, \`calloc\`, \`free\` sau giai đoạn khởi tạo hệ thống (Tránh rò rỉ và phân mảnh bộ nhớ).
        - **Rule 17.2**: Không sử dụng đệ quy (Recursion) để đảm bảo không bao giờ bị tràn Stack.
        - **Rule 11.4**: Cấm ép kiểu giữa con trỏ trỏ tới đối tượng và kiểu con trỏ khác.`,
        code: `// Vi phạm MISRA C:\\nchar *buf = (char *)malloc(100); // LỖI: Cấp phát động\\n\\n// Tuân thủ MISRA C:\\nstatic uint8_t s_buffer[100U]; // Cấp phát tĩnh bộ nhớ cố định`
    },
    "t46": {
        title: "Phòng chống hành vi bất định (Undefined Behavior) và tràn số nguyên (Integer Overflow)",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "Undefined Behavior Prevention",
        content: `Hành vi bất định (Undefined Behavior - UB) là cơn ác mộng lớn nhất của phần mềm nhúng. Khi phát sinh UB (ví dụ: dịch bit số âm, tràn số nguyên có dấu, đọc biến chưa khởi tạo), trình biên dịch có thể sinh ra mã máy hoàn toàn sai lệch hoặc bỏ qua các điều kiện kiểm tra an toàn.
        
        Luôn kiểm tra giới hạn trước khi thực hiện phép tính số học: \`if (a > INT_MAX - b)\` trước khi thực hiện \`a + b\`. Luôn dùng hậu tố \`U\` cho số nguyên không dấu (\`100U\`).`,
        code: `// Kiểm tra an toàn chống tràn số nguyên:\\nbool safe_add(uint32_t a, uint32_t b, uint32_t *res) {\\n    if (UINT32_MAX - a < b) return false; // Tràn số!\\n    *res = a + b;\\n    return true;\\n}`
    },
    "t47": {
        title: "Tích hợp công cụ phân tích tĩnh (Static Code Analysis: Cppcheck, Clang-Tidy)",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "Automated Static Code Linting",
        content: `Thay vì để lỗi lọt vào thiết bị phần cứng, các công ty lớn sử dụng công cụ phân tích mã nguồn tĩnh (Static Analysis) quét tự động toàn bộ source code trước khi nạp.
        
        Công cụ **Cppcheck** và **Clang-Tidy** tự động phát hiện:
        - Đọc ngoài biên mảng (Buffer Overflow).
        - Sử dụng con trỏ sau khi đã giải phóng (Use-after-free).
        - Biến chưa được khởi tạo (Uninitialized variables).
        - Mã nguồn chết không bao giờ được thực thi (Dead code).`,
        code: `// Chạy kiểm tra tĩnh toàn bộ dự án với Cppcheck:\\ncppcheck --enable=all --inconclusive --error-exitcode=1 main/`
    },
    "t48": {
        title: "Coding Convention chuẩn công nghiệp: Naming, Doxygen Documentation & File Structure",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "Industrial Code Convention & Doxygen",
        content: `Khi tham gia dự án lớn có hàng chục kỹ sư cùng làm, phong cách viết code quyết định tính duy trì (Maintainability) của sản phẩm:
        - Tiền tố rõ ràng: \`s_\` cho biến tĩnh (static), \`g_\` cho toàn cục (global), \`p_\` cho con trỏ (pointer).
        - Chú thích hàm chuẩn định dạng **Doxygen**: Mô tả mục đích, tham số \`@param[in]\`, \`@param[out]\` và giá trị trả về \`@return\`.
        - Tách biệt rõ ràng file header \`.h\` (Public Interface) và file thực thi \`.c\` (Private Implementation).`,
        code: `/**\\n * @brief Khởi tạo cảm biến gia tốc qua bus I2C\\n * @param[in] port Cổng I2C (I2C_NUM_0 hoặc I2C_NUM_1)\\n * @return esp_err_t ESP_OK nếu thành công, ESP_ERR_TIMEOUT nếu mất kết nối\\n */\\nesp_err_t imu_sensor_init(i2c_port_t port);`
    },
    "t49": {
        title: "Kiến trúc mạng CAN Bus (TWAI trên ESP32): Khung tin tiêu chuẩn, ID Arbitration",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "CAN Bus 2.0B / TWAI Driver Architecture",
        content: `CAN Bus (Controller Area Network) là chuẩn giao tiếp vi sai thống trị trong ô tô (Automotive) và robot tự hành.
        - Kháng nhiễu cực mạnh nhờ tín hiệu truyền trên cặp dây xoắn CAN_H và CAN_L.
        - Cơ chế phân xử bus (Arbitration): Khung tin có CAN ID nhỏ hơn sẽ có độ ưu tiên cao hơn và tự động chiếm quyền bus mà không làm hỏng dữ liệu của node khác (Non-destructive).
        - Tích hợp sẵn cơ chế kiểm tra CRC 15-bit và tự động gửi lại tin nhắn khi lỗi.`,
        code: `twai_message_t msg = {\\n    .identifier = 0x123, // CAN ID\\n    .data_length_code = 4,\\n    .data = {0x01, 0x02, 0x03, 0x04},\\n};\\ntwai_transmit(&msg, pdMS_TO_TICKS(100));`
    },
    "t50": {
        title: "Lọc gói tin phần cứng (Acceptance Filter) chống nghẽn CPU trên mạng ô tô",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "Hardware CAN Acceptance Filtering",
        content: `Trên một chiếc ô tô, mạng CAN Bus có thể truyền hàng nghìn gói tin mỗi giây từ động cơ, phanh ABS, điều hòa... Nếu vi điều khiển ESP32 phải nhận ngắt cho mọi gói tin, CPU sẽ bị quá tải (Bus Flooding) và không còn thời gian chạy TinyML.
        
        Giải pháp: Cấu hình bộ lọc phần cứng Acceptance Filter (Code và Mask). Bộ thu TWAI của ESP32 sẽ tự động lọc ở tầng mạch điện tử, chỉ chuyển vào bộ nhớ các gói tin có CAN ID thuộc nhóm mà hệ thống cần lắng nghe.`,
        code: `twai_filter_config_t f_config = {\\n    .acceptance_code = (0x100 << 21), // Chỉ nghe các ID bắt đầu bằng 0x100\\n    .acceptance_mask = ~(0x100 << 21),\\n    .single_filter = true\\n};`
    },
    "t51": {
        title: "Giao thức công nghiệp Modbus RTU qua chuẩn truyền thông vi sai RS485",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "RS485 Modbus RTU Industrial Protocol",
        content: `Trong các nhà máy thông minh (Smart Factory), PLC và các đồng hồ đo điện năng giao tiếp qua mạng Modbus RTU trên đường truyền vi sai RS485.
        - Hoạt động theo mô hình Master-Slave bán song công (Half-Duplex).
        - Master gửi bản tin yêu cầu: Địa chỉ Slave (1 byte) + Mã hàm Function Code (1 byte) + Địa chỉ thanh ghi (2 bytes) + Mã kiểm tra lỗi CRC-16 (2 bytes).
        - Kỹ sư nhúng cần cấu hình chân GPIO điều khiển cờ RTS (Request To Send) để chuyển đổi giữa chế độ Thu và Phát của chip transceiver MAX485.`,
        code: `// Cấu hình chân UART chuyển sang chế độ RS485 Half-Duplex:\\nuart_set_mode(UART_NUM_2, UART_MODE_RS485_HALF_DUPLEX);\\nuart_set_pin(UART_NUM_2, TX_PIN, RX_PIN, RTS_PIN, CTS_PIN);`
    },
    "t52": {
        title: "Thiết kế Driver thiết bị ngoại vi chuẩn Module hóa (Layered HAL/Driver Pattern)",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "Layered Device Driver Architecture",
        content: `Thiết kế Driver theo kiến trúc phân lớp (Layered Architecture):
        1. **Hardware Abstraction Layer (HAL)**: Các hàm đọc ghi thanh ghi thô (i2c_write, gpio_set).
        2. **Device Driver Layer**: Triển khai logic điều khiển cảm biến (mpu6050_read_accel).
        3. **Application Layer**: Tác vụ thuật toán xử lý dữ liệu và AI.
        
        Lợi ích: Khi công ty đổi sang dòng vi điều khiển khác (từ ESP32 sang STM32 hoặc NXP), kỹ sư chỉ cần viết lại tầng HAL mà giữ nguyên 100% logic thuật toán của Driver.`,
        code: `typedef struct {\\n    esp_err_t (*init)(void);\\n    esp_err_t (*read)(float *out_val);\\n} Sensor_Interface_t;\\n\\n// Dễ dàng hoán đổi phần cứng thông qua interface chung`
    },
    "t53": {
        title: "Viết Unit Test cho mã nguồn C nhúng bằng framework Unity & CMock",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Embedded Unit Testing with Unity & CMock",
        content: `Unit Test giúp chứng minh từng hàm logic trong firmware hoạt động đúng với mọi trường hợp biên (Corner Cases).
        - Framework **Unity**: Cung cấp các macro kiểm tra (\`TEST_ASSERT_EQUAL\`, \`TEST_ASSERT_NOT_NULL\`).
        - Framework **CMock**: Tự động sinh ra các hàm giả lập từ file header để test hàm logic mà không cần kết nối phần cứng.
        Chạy Unit Test trên PC giúp bạn kiểm thử được hàng trăm ca kiểm thử chỉ trong 1 giây, nhanh hơn hàng nghìn lần so với nạp vào mạch rồi dùng tay bấm nút.`,
        code: `#include "unity.h"\\n\\nvoid test_moving_average_filter_smooth(void) {\\n    float raw_samples[] = {10.0f, 20.0f, 30.0f};\\n    float filtered = moving_average_calculate(raw_samples, 3);\\n    TEST_ASSERT_EQUAL_FLOAT(20.0f, filtered);\\n}`
    },
    "t54": {
        title: "Giả lập phần cứng (Hardware Mocking) để chạy Unit Test trên máy tính CI mà không cần mạch thật",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Hardware Abstraction Layer Mocking",
        content: `Làm sao chạy được Unit Test trên máy chủ tự động (GitHub Actions) khi máy chủ trên đám mây không cắm vi điều khiển ESP32 thật?
        
        Kỹ thuật Hardware Mocking: Tạo ra các hàm giả lập có cùng tên và chữ ký hàm với hàm phần cứng. Trong kịch bản test, ta chỉ định hàm giả lập trả về mảng dữ liệu mẫu (ví dụ: chuỗi rung chấn mô phỏng động cơ hỏng) để kiểm tra xem thuật toán AI có phát hiện đúng lỗi hay không.`,
        code: `// Giả lập hàm đọc cảm biến I2C trả về lỗi Timeout:\\ni2c_master_read_from_device_fake.return_val = ESP_ERR_TIMEOUT;\\nesp_err_t err = read_sensor_temperature(&temp);\\nTEST_ASSERT_EQUAL(ESP_ERR_TIMEOUT, err); // Kiểm tra khả năng bắt lỗi`
    },
    "t55": {
        title: "Xây dựng luồng CI/CD với GitHub Actions: Tự động kiểm tra lint và build firmware khi Push",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Automated Firmware CI/CD Pipelines",
        content: `Thiết lập tệp tin kịch bản \`.github/workflows/firmware_ci.yml\`:
        Mỗi khi bạn đẩy (push) một commit mới hoặc tạo Pull Request:
        1. Máy chủ đám mây tự động kéo mã nguồn về container Linux.
        2. Chạy kiểm tra định dạng code và phân tích tĩnh MISRA C.
        3. Chạy toàn bộ các bài Unit Test.
        4. Biên dịch thử firmware với bộ công cụ ESP-IDF.
        5. Nếu có bất kỳ lỗi nào, GitHub sẽ đánh dấu X đỏ và từ chối hợp nhất code, bảo vệ firmware chính luôn trong trạng thái ổn định.`,
        code: `name: Firmware CI\\non: [push, pull_request]\\njobs:\\n  build:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - uses: actions/checkout@v3\\n      - name: Build with ESP-IDF\\n        uses: espressif/esp-idf-ci-action@v1`
    },
    "t56": {
        title: "Quy trình làm việc nhóm chuyên nghiệp: Git Flow, Code Review & Release Management",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Professional Git Flow & Firmware Release",
        content: `Trong môi trường doanh nghiệp:
        - **Nhánh main**: Chỉ chứa các bản firmware ổn định đã nghiệm thu thực tế.
        - **Nhánh develop**: Nhánh tích hợp các tính năng mới của cả nhóm.
        - **Nhánh feature/xyz**: Nhánh riêng của từng kỹ sư khi phát triển một module Driver hoặc chức năng mới.
        
        Quy trình Code Review: Mọi thay đổi đều phải tạo Pull Request (PR) và được ít nhất một kỹ sư khác duyệt (Approve) trước khi nhập vào nhánh chính. Đánh số phiên bản Firmware chuẩn ngữ nghĩa Semantic Versioning: \`v1.2.0\` (MAJOR.MINOR.PATCH).`,
        code: `# Quy trình Git chuyên nghiệp:\\ngit checkout -b feature/canbus-driver\\n# Code và commit...\\ngit push origin feature/canbus-driver\\n# Tạo Pull Request trên GitHub để đồng đội Review`
    }
};

// Global State & State Merging Logic
function mergeRoadmapWithDefaults(stored, defaults) {
    if (!stored || !Array.isArray(stored)) return defaults;
    const doneMap = {};
    stored.forEach(stage => {
        if (stage.tasks) {
            stage.tasks.forEach(t => {
                if (t.done) doneMap[t.id] = true;
            });
        }
    });
    return defaults.map(stage => ({
        ...stage,
        tasks: stage.tasks.map(task => ({
            ...task,
            done: !!doneMap[task.id]
        }))
    }));
}

let storedRoadmap = null;
try {
    storedRoadmap = JSON.parse(localStorage.getItem(STORAGE_ROADMAP));
} catch(e) { storedRoadmap = null; }

let roadmap = mergeRoadmapWithDefaults(storedRoadmap, defaultRoadmap);
let notes = JSON.parse(localStorage.getItem(STORAGE_NOTES)) || [
    {
        id: "note_init_1",
        title: "Cấp phát Tensor Arena chuẩn 16-byte Alignment trên ESP32",
        category: "1. C & Bộ nhớ",
        content: "Trong TFLite Micro, Tensor Arena cần được căn chỉnh 16 bytes để tận dụng lệnh tăng tốc vector SIMD của ESP32-S3.",
        code: "constexpr int kTensorArenaSize = 60 * 1024;\nstatic uint8_t tensor_arena[kTensorArenaSize] __attribute__((aligned(16)));",
        date: new Date().toLocaleDateString('vi-VN')
    }
];
let profile = JSON.parse(localStorage.getItem(STORAGE_PROFILE)) || defaultProfile;
let codeCache = JSON.parse(localStorage.getItem(STORAGE_CODE_CACHE)) || {};
let studyStreak = JSON.parse(localStorage.getItem(STORAGE_STREAK)) || {
    count: 1,
    lastDate: new Date().toDateString()
};

function saveState() {
    localStorage.setItem(STORAGE_ROADMAP, JSON.stringify(roadmap));
    localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_CODE_CACHE, JSON.stringify(codeCache));
    localStorage.setItem(STORAGE_STREAK, JSON.stringify(studyStreak));
}
