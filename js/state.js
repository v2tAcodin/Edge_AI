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
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI CẦN BỘ ĐỊNH THỜI PHẦN CỨNG?
Trong các bài toán Edge AI (nhận diện giọng nói 16kHz, phân tích rung động 100Hz):
- Mọi mô hình suy luận và thuật toán biến đổi phổ FFT đều dựa trên giả thiết: **Khoảng cách thời gian giữa 2 mẫu liên tiếp phải đều tuyệt đối**.
- Nếu dùng hàm \`vTaskDelay()\` của FreeRTOS, thời gian chờ bị phụ thuộc vào tần số Tick (1ms - 10ms) và sẽ bị sai lệch hàng trăm micro-giây do độ trễ bộ lập lịch.
- ✅ **Giải pháp**: GPTimer là bộ định thời phần cứng đếm xung độc lập với CPU, đảm bảo độ chính xác tới từng micro-giây!

### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG
- Bộ đếm 54-bit chạy trên xung nhịp bus APB 80MHz.
- Prescaler = 80 -> Tần số đếm giảm về đúng 1MHz (1 µs / 1 tick).
- Chế độ Auto-Reload: Đếm từ 0 đến ngưỡng Alarm (ví dụ 62 µs cho âm thanh 16kHz), tự động nạp lại 0 và kích hoạt ngắt phần cứng.

### 📌 3. BẪY LỖI KINH ĐIỂN
❌ Quên cờ \`auto_reload_on_alarm = true\`: Sau lần kích hoạt ngắt đầu tiên, timer sẽ đếm tiếp lên vô cùng và không bao giờ ngắt lại nữa.`,
        code: `// Cấu hình GPTimer 1 micro-giây trên ESP-IDF v5.x:
gptimer_handle_t gptimer = NULL;
gptimer_config_t timer_config = {
    .clk_src = GPTIMER_CLK_SRC_DEFAULT,
    .direction = GPTIMER_COUNT_UP,
    .resolution_hz = 1000000, // 1 MHz = 1us mỗi tick
};
ESP_ERROR_CHECK(gptimer_new_timer(&timer_config, &gptimer));

gptimer_alarm_config_t alarm_config = {
    .reload_count = 0,
    .alarm_count = 62, // 62us ~ 16,000 Hz lấy mẫu âm thanh
    .flags.auto_reload_on_alarm = true,
};
ESP_ERROR_CHECK(gptimer_set_alarm_action(gptimer, &alarm_config));
ESP_ERROR_CHECK(gptimer_enable(gptimer));
ESP_ERROR_CHECK(gptimer_start(gptimer));`
    },
    "t6": {
        title: "Lập trình hàm ngắt ISR với cờ IRAM_ATTR thực thi trực tiếp trên SRAM",
        stageName: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        skill: "High-Speed IRAM_ATTR Interrupts",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: VÌ SAO ISR PHẢI ĐẶT TRONG IRAM?
- Mã nguồn C thông thường được lưu trong bộ nhớ Flash ngoài. Khi thực thi, CPU phải nạp qua bộ đệm Cache.
- Nếu hàm phục vụ ngắt (ISR) nằm trên Flash, khi ngắt nổ ra sẽ bị trễ do Cache Miss.
- **Nguy hiểm nhất**: Khi vi điều khiển đang ghi dữ liệu vào Flash (như lưu NVS hoặc tải OTA), bộ đệm SPI Flash Cache bị vô hiệu hóa tạm thời. Nếu lúc này ngắt xảy ra và CPU cố đọc code trên Flash -> Lập tức Crash phần cứng **Guru Meditation Cache Disabled**!

### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG
- Gắn cờ \`IRAM_ATTR\` trước tên hàm ép Linker đưa mã máy của hàm ngắt vào **Internal SRAM0**.
- Đảm bảo thời gian phản hồi ngắt tức thì chỉ vài nano-giây và an toàn tuyệt đối ngay cả khi đang ghi Flash.

### 📌 3. BẪY LỖI KINH ĐIỂN
❌ Trong hàm có cờ \`IRAM_ATTR\`, tuyệt đối không gọi các hàm không có cờ IRAM (như \`printf\`, \`malloc\`), nếu không vẫn sẽ bị crash khi Flash bị khóa.`,
        code: `// Hàm ngắt Timer ISR lưu trong Internal SRAM siêu tốc:
static bool IRAM_ATTR timer_on_alarm_cb(gptimer_handle_t timer, 
                                        const gptimer_alarm_event_data_t *edata, 
                                        void *user_ctx) {
    BaseType_t high_task_awoken = pdFALSE;

    // Chỉ thực hiện công việc tối thiểu: Gửi tín hiệu đánh thức tác vụ AI
    vTaskNotifyGiveFromISR(ai_task_handle, &high_task_awoken);

    // Trả về true nếu cần chuyển ngữ cảnh ngay tức thì
    return (high_task_awoken == pdTRUE);
}`
    },
    "t7": {
        title: "Cơ chế Deferred Processing: Đẩy việc từ ISR sang Task qua Semaphore",
        stageName: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        skill: "Deferred ISR to Task Processing",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: NGUYÊN TẮC VÀNG VỀ THỜI GIAN TRONG ISR
- Trong hệ thống nhúng, hàm ngắt (ISR) có quyền ưu tiên cao nhất, nó chặn mọi tác vụ khác kể cả hệ điều hành.
- Nếu bạn tính toán FFT hoặc chạy suy luận AI trong ISR, vi điều khiển sẽ bị tê liệt hoàn toàn, bỏ lỡ các ngắt Wi-Fi, bàn phím và Watchdog -> Sụp nguồn!

### 📌 2. MÔ HÌNH DEFERRED PROCESSING (HOÃN XỬ LÝ)
1. Trong ISR: Chỉ đọc thanh ghi và gửi tín hiệu đánh thức qua \`vTaskNotifyGiveFromISR\`. Thời gian chạy < 3 micro-giây.
2. Ngoài Task chính: Tác vụ AI thức dậy, thu gom dữ liệu và thực hiện các thuật toán nặng nhọc ở ngữ cảnh bình thường, nơi các ngắt khác vẫn hoạt động trơn tru.`,
        code: `// 1. Trong ISR: Phát tín hiệu đánh thức
vTaskNotifyGiveFromISR(xTaskHandle, &xHigherPriorityTaskWoken);
portYIELD_FROM_ISR(xHigherPriorityTaskWoken);

// 2. Trong Task AI bên ngoài: Chờ nhận tín hiệu rồi tính toán
void ai_deferred_task(void *pvParameters) {
    while (1) {
        // Ngủ đông không tốn CPU cho đến khi có tín hiệu từ ISR
        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
        
        // Thực hiện tính toán nặng an toàn ngoài ngữ cảnh ngắt
        run_heavy_fft_and_inference();
    }
}`
    },
    "t8": {
        title: "Ứng dụng Timer định nhịp tần số lấy mẫu chuẩn (16kHz Audio / 100Hz IMU)",
        stageName: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        skill: "Deterministic Sensor Sampling Rate",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẦN SỐ LẤY MẪU TIÊU CHUẨN TRONG EDGE AI
Mỗi mô hình Deep Learning được huấn luyện trên một tần số lấy mẫu cố định:
- **Keyword Spotting (Giọng nói)**: Chuẩn 16,000 Hz -> Khoảng thời gian giữa 2 mẫu = $1 / 16000 = 62.5$ µs.
- **Phân tích rung động động cơ (IMU)**: Chuẩn 100 Hz -> Khoảng cách giữa 2 mẫu = $10,000$ µs (10 ms).
- **Điện tim (ECG) / Nhịp tim (PPG)**: Chuẩn 250 Hz -> Khoảng cách = $4,000$ µs (4 ms).

### 📌 2. KỸ THUẬT AUTO-RELOAD KHÔNG BỊ TRÔI PHA
Sử dụng cờ \`auto_reload_on_alarm = true\` để thanh ghi phần cứng tự động nạp lại giá trị 0 ngay thời khắc báo động. Không dùng phần mềm nạp lại vì sẽ bị trôi pha (Phase Drift) theo thời gian.`,
        code: `// Cấu hình GPTimer cho cảm biến rung động IMU 100Hz:
gptimer_alarm_config_t imu_alarm_cfg = {
    .reload_count = 0,
    .alarm_count = 10000, // 10,000 us = 10ms = đúng 100Hz
    .flags.auto_reload_on_alarm = true,
};
gptimer_set_alarm_action(gptimer, &imu_alarm_cfg);`
    },
    "t9": {
        title: "Giao tiếp I2C/SPI đọc dữ liệu thô cảm biến chuyển động 6 trục (IMU MPU6050)",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "I2C/SPI 6-Axis IMU Driver",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: KỸ THUẬT BURST READ TRÊN I2C
Cảm biến chuyển động IMU 6-trục lưu trữ 3 trục gia tốc và 3 trục con quay hồi chuyển trong 14 thanh ghi liên tiếp từ \`0x3B\` đến \`0x48\`.
- Đọc từng trục riêng lẻ tốn 6 chu kỳ Start/Stop trên bus I2C, làm chậm tốc độ lấy mẫu và nghẽn CPU.
- **Kỹ thuật Burst Read**: Chỉ phát 1 lệnh đọc với địa chỉ bắt đầu \`0x3B\` và nhận liền một mạch 14 bytes.

### 📌 2. GHÉP BIT CÓ DẤU (SIGNED 16-BIT INTEGER)
Mỗi trục gồm 2 byte High và Low. Cần dịch bit và ép kiểu có dấu \`int16_t\`:
\`\`\`c
int16_t raw_accel_x = (int16_t)((buf[0] << 8) | buf[1]);
\`\`\``,
        code: `uint8_t raw_buf[14];
uint8_t reg_start = 0x3B; // ACCEL_XOUT_H
// Đọc Burst 14 bytes liên tục chỉ với 1 lệnh giao tiếp I2C:
esp_err_t err = i2c_master_write_read_device(
    I2C_NUM_0, 0x68, &reg_start, 1, raw_buf, 14, 100 / portTICK_PERIOD_MS);

if (err == ESP_OK) {
    int16_t ax = (int16_t)((raw_buf[0] << 8) | raw_buf[1]);
    int16_t ay = (int16_t)((raw_buf[2] << 8) | raw_buf[3]);
    int16_t az = (int16_t)((raw_buf[4] << 8) | raw_buf[5]);
    int16_t gx = (int16_t)((raw_buf[8] << 8) | raw_buf[9]);
    int16_t gy = (int16_t)((raw_buf[10] << 8) | raw_buf[11]);
    int16_t gz = (int16_t)((raw_buf[12] << 8) | raw_buf[13]);
}`
    },
    "t10": {
        title: "Thu âm thanh kỹ thuật số băng thông cao qua chuẩn giao tiếp I2S Microphone",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "I2S Digital Microphone Streaming",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI DÙNG I2S THAY VÌ ADC?
Microphone analog nối qua chân ADC rất dễ bị nhiễu do xung nguồn và sóng vô tuyến Wi-Fi.
Microphone kỹ thuật số (như INMP441, SPH0645) tích hợp sẵn bộ chuyển đổi ADC 24-bit và bộ lọc số ngay bên trong chip micro, xuất luồng số trực tiếp qua giao thức I2S (Inter-IC Sound).

### 📌 2. KÊNH TRUYỀN DMA ZERO-OVERHEAD
I2S kết hợp với phần cứng Direct Memory Access (DMA): Dữ liệu âm thanh từ chân vi điều khiển được bơm thẳng vào RAM mà không tốn một chu kỳ lệnh CPU nào.`,
        code: `i2s_chan_handle_t rx_handle;
i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
i2s_new_channel(&chan_cfg, NULL, &rx_handle);

i2s_std_config_t std_cfg = {
    .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(16000), // 16kHz audio
    .slot_cfg = I2S_STD_PHILIPS_SLOT_DEFAULT_CONFIG(16, I2S_SLOT_MODE_MONO),
    .gpio_cfg = { .mclk = I2S_GPIO_UNUSED, .bclk = GPIO_NUM_4, .ws = GPIO_NUM_5, .din = GPIO_NUM_6 }
};
i2s_channel_init_std_mode(rx_handle, &std_cfg);
i2s_channel_enable(rx_handle);

// Đọc 512 mẫu âm thanh từ DMA buffer:
int16_t audio_frame[512];
size_t bytes_read = 0;
i2s_channel_read(rx_handle, audio_frame, sizeof(audio_frame), &bytes_read, portMAX_DELAY);`
    },
    "t11": {
        title: "Tiền xử lý tín hiệu: Bộ lọc nhiễu số (Moving Average, Low-pass Filter)",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "Digital Signal Noise Filtering",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: KHỬ NHIỄU TRƯỚC KHI ĐƯA VÀO MÔ HÌNH AI
Tín hiệu cảm biến trong môi trường công nghiệp luôn chứa nhiễu: nhiễu điện áp lưới 50Hz, rung động cơ khí hoặc nhiễu trắng nhiệt.
Bộ lọc trung bình động số mũ (Exponential Moving Average - EMA) là giải pháp tối ưu cho vi điều khiển vì chỉ cần 1 phép nhân và 1 phép cộng, không cần lưu mảng lịch sử:
$$y[n] = \alpha \cdot x[n] + (1 - \alpha) \cdot y[n-1]$$
- $\alpha \in [0.05, 0.2]$: Lọc mượt mạnh nhưng có độ trễ pha.
- $\alpha \in [0.2, 0.5]$: Phản ứng nhanh, lọc nhiễu vừa phải.`,
        code: `typedef struct {
    float alpha;
    float prev_output;
} EMA_Filter_t;

float ema_filter_apply(EMA_Filter_t *f, float raw_val) {
    if (!f) return raw_val;
    f->prev_output = f->alpha * raw_val + (1.0f - f->alpha) * f->prev_output;
    return f->prev_output;
}`
    },
    "t12": {
        title: "Trích xuất đặc trưng (Feature Extraction): Chuẩn hóa dữ liệu & Biến đổi FFT",
        stageName: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        skill: "Normalization & FFT Feature Extraction",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: VÌ SAO PHẢI DÙNG FFT VÀ CỬA SỔ HANNING?
Mạng nơ-ron nhận diện giọng nói hoặc chẩn đoán vòng bi động cơ cần nhận diện tần số cộng hưởng, không thể học trực tiếp trên sóng biên độ thời gian thô.
1. **Cửa sổ Hanning (Windowing)**: Ép hai mép khung tín hiệu về 0 để triệt tiêu hiện tượng rò rỉ phổ (Spectral Leakage).
2. **FFT (Fast Fourier Transform)**: Chuyển đổi 512 mẫu thời gian thành 256 dải tần số.
3. **Thư viện ESP-DSP**: Tận dụng tập lệnh Vector SIMD trên ESP32-S3, tính FFT 512 điểm chỉ trong **0.72 mili-giây**!`,
        code: `// Tăng tốc FFT bằng tập lệnh SIMD DSP phần cứng:
#include "esp_dsp.h"
#define N_SAMPLES 512

dsps_wind_hann_f32(windowed_signal, N_SAMPLES);
dsps_fft2r_fc32(complex_signal, N_SAMPLES);
dsps_bit_rev2r_fc32(complex_signal, N_SAMPLES);
// Tính độ lớn phổ năng lượng (Magnitude):
for (int i = 0; i < N_SAMPLES / 2; i++) {
    float re = complex_signal[i * 2 + 0];
    float im = complex_signal[i * 2 + 1];
    power_spectrum[i] = sqrtf(re * re + im * im);
}`
    },
    "t13": {
        title: "Phân chia 2 nhân ESP32 với xTaskCreatePinnedToCore (Core 0: IO, Core 1: AI)",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Dual-Core Asymmetric Task Pinning",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: CƠ CHẾ GHIM TÁC VỤ 2 NHÂN (ASYMMETRIC PINNING)
ESP32-S3 sở hữu 2 nhân vi xử lý Xtensa LX7 32-bit:
- **Core 0 (PRO_CPU)**: Quản lý ngăn xếp mạng Wi-Fi, Bluetooth, SPI Flash Cache và các ngắt ngoại vi.
- **Core 1 (APP_CPU)**: Dành trọn vẹn cho tính toán mô hình TinyML và DSP.
Nếu không ghim nhân, khi mô hình AI tính toán ngốn 100% CPU sẽ làm trễ gói tin Wi-Fi, khiến thiết bị bị ngắt kết nối router liên tục!

### 📌 2. BẪY LỖI KINH ĐIỂN
❌ Đặt kích thước Stack cho tác vụ AI quá nhỏ (ví dụ 2048 bytes). TFLite Micro và các hàm ma trận cần ít nhất 6KB - 8KB Stack. Hãy dùng \`8192\` bytes trở lên!`,
        code: `// Ghim tác vụ IO/Wi-Fi vào Core 0:
xTaskCreatePinnedToCore(io_network_task, "IO_C0", 4096, NULL, 3, NULL, 0);

// Ghim tác vụ AI suy luận vào Core 1 (Ưu tiên cao hơn, stack 8KB):
xTaskCreatePinnedToCore(ai_inference_task, "AI_C1", 8192, NULL, 5, NULL, 1);`
    },
    "t14": {
        title: "Truyền dữ liệu cảm biến sang tác vụ suy luận qua FreeRTOS Queue đệm an toàn",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Thread-Safe FreeRTOS Data Queues",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TRUYỀN DỮ LIỆU AN TOÀN LUỒNG GIỮA 2 NHÂN
Khi Core 0 thu thập cảm biến và Core 1 suy luận, nếu dùng biến toàn cục chung sẽ gây lỗi tranh chấp bộ nhớ (**Race Condition**).
FreeRTOS Queue cung cấp hàng đợi FIFO thread-safe được khóa ở cấp phần cứng.
Đặc biệt: Khi Queue rỗng, Core 1 tự động rơi vào trạng thái **Blocked** (tiết kiệm điện năng), ngay khi Core 0 gửi dữ liệu vào Queue, Core 1 lập tức thức dậy!`,
        code: `// Khởi tạo hàng đợi chứa tối đa 10 khung dữ liệu:
QueueHandle_t sensorQueue = xQueueCreate(10, sizeof(SensorFrame_t));

// Core 0 gửi: Chờ tối đa 10ms nếu Queue đầy, tránh làm nghẽn Core 0
xQueueSend(sensorQueue, &new_frame, pdMS_TO_TICKS(10));

// Core 1 nhận: Ngủ đông cho đến khi có dữ liệu đến (portMAX_DELAY)
SensorFrame_t frame_for_ai;
if (xQueueReceive(sensorQueue, &frame_for_ai, portMAX_DELAY) == pdTRUE) {
    run_ai_model(&frame_for_ai);
}`
    },
    "t15": {
        title: "Tránh xung đột tài nguyên chung (Race Condition) bằng Mutex & Semaphore",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Mutex & Resource Locking",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: VÌ SAO PHẢI DÙNG MUTEX THAY VÌ BINARY SEMAPHORE?
Khi 2 tác vụ cùng chia sẻ một ngoại vi (như bus I2C):
Nếu dùng Binary Semaphore thông thường, hệ thống dễ rơi vào lỗi **Nghịch đảo quyền ưu tiên (Priority Inversion)**: Tác vụ khẩn cấp AI bị phong tỏa bởi một tác vụ ưu tiên trung bình.
- ✅ **Mutex trong FreeRTOS** tích hợp cơ chế **Kế thừa quyền ưu tiên (Priority Inheritance)**: Tự động nâng tạm thời quyền ưu tiên của tác vụ đang giữ khóa lên bằng với tác vụ khẩn cấp nhất đang chờ, giải phóng khóa nhanh nhất có thể.`,
        code: `SemaphoreHandle_t i2c_mutex = xSemaphoreCreateMutex();

void safe_i2c_read(void) {
    if (xSemaphoreTake(i2c_mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
        // Đã khóa an toàn: Thực hiện giao tiếp I2C không sợ xung đột
        i2c_master_read_sensor();
        // Luôn trả lại khóa sau khi dùng xong!
        xSemaphoreGive(i2c_mutex);
    } else {
        ESP_LOGE("I2C", "Không thể lấy khóa Mutex (Timeout 100ms)!");
    }
}`
    },
    "t16": {
        title: "Cơ chế giám sát Task Watchdog (TWDT) chống treo CPU khi mô hình suy luận",
        stageName: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        skill: "Task Watchdog Timer (TWDT)",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: PHÒNG THỦ SỰ CỐ CHO HỆ THỐNG VẬN HÀNH 24/7
Nếu mô hình AI bị rơi vào vòng lặp vô hạn hoặc phân mảnh bộ nhớ làm treo CPU:
Task Watchdog Timer (TWDT) là chiếc "phao cứu sinh" đếm ngược độc lập.
Tác vụ AI phải gọi \`esp_task_wdt_reset()\` định kỳ sau mỗi lần suy luận. Nếu sau 3 giây không báo cáo, TWDT sẽ in ra thanh ghi PC bị lỗi và tự động reset vi điều khiển trong 10ms!`,
        code: `// Đăng ký tác vụ hiện tại với TWDT:
ESP_ERROR_CHECK(esp_task_wdt_add(NULL));

while (1) {
    // 1. Chờ dữ liệu và thực thi suy luận AI
    run_tinyml_inference();

    // 2. "Cho chó ăn" - Báo cáo với Watchdog rằng tác vụ vẫn sống khỏe
    esp_task_wdt_reset();
}`
    },
    "t17": {
        title: "Cấu hình kết nối Wi-Fi Station & Quản lý mất mạng tự động kết nối lại",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Robust Wi-Fi Auto-Reconnection",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: SỰ CỐ MẠNG TRONG THỰC TẾ
Trong nhà máy hoặc ngoài trời, sóng Wi-Fi luôn có khả năng bị chập chờn, mất mạng hoặc router bị khởi động lại.
Hệ thống Edge AI chạy độc lập không được phép bị treo (hanging) khi mất mạng, mà phải tiếp tục ghi nhận dữ liệu cảm biến và tự động kết nối lại một cách thông minh.

### 📌 2. CHIẾN LƯỢC EXPONENTIAL BACKOFF
- Không thử kết nối lại liên tục theo chu kỳ mili-giây vì sẽ làm quá nhiệt vi điều khiển và cạn pin.
- Tăng dần thời gian chờ giữa các lần thử: $1s \to 2s \to 4s \to 8s \to 16s \to 32s$ (tối đa 60s).`,
        code: `static int s_retry_num = 0;
static void wifi_event_handler(void* arg, esp_event_base_t event_base, 
                               int32_t event_id, void* event_data) {
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {
        s_retry_num++;
        uint32_t delay_sec = (1 << (s_retry_num > 5 ? 5 : s_retry_num)); // Exponential Backoff
        ESP_LOGW("WIFI", "Mất kết nối Wi-Fi! Thử lại sau %lu giây (Lần %d)...", delay_sec, s_retry_num);
        vTaskDelay(pdMS_TO_TICKS(delay_sec * 1000));
        esp_wifi_connect();
    } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
        s_retry_num = 0;
        ESP_LOGI("WIFI", "✅ Đã nhận địa chỉ IP thành công!");
    }
}`
    },
    "t18": {
        title: "Truyền phát gói tin cảnh báo / kết quả suy luận qua giao thức MQTT siêu nhẹ",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Lightweight MQTT IoT Telemetry",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI DÙNG MQTT THAY CHO HTTP?
- HTTP có header cồng kềnh (200 - 800 bytes) cho mỗi yêu cầu REST API.
- **MQTT (Message Queuing Telemetry Transport)**: Header chỉ **2 bytes**, hoạt động theo cơ chế Publish/Subscribe.
- **Triết lý Event-Driven**: Thiết bị chỉ gửi bản tin cảnh báo khi mô hình AI phát hiện sự cố bất thường (hoặc gửi nhịp tim định kỳ), tiết kiệm hơn 95% băng thông mạng và năng lượng.`,
        code: `// Cấu hình MQTT Client và gửi bản tin cảnh báo sự cố AI:
esp_mqtt_client_config_t mqtt_cfg = {
    .broker.address.uri = "mqtt://broker.emqx.io:1883",
};
esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
esp_mqtt_client_start(client);

// Gửi bản tin JSON nhỏ gọn khi AI phát hiện sự cố:
char alert_json[128];
snprintf(alert_json, sizeof(alert_json), 
         "{\"event\":\"fault_bearing\",\"conf\":0.96,\"latency_ms\":38}");
esp_mqtt_client_publish(client, "factory/machine_1/alert", alert_json, 0, 1, 0);`
    },
    "t19": {
        title: "Thiết lập phân vùng Flash ESP32 (Partition Table: ota_0, ota_1, nvs)",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Dual OTA Partition Table Design",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: KIẾN TRÚC FLASH DUAL-BANK CHỐNG BIẾN THÀNH CỤC GẠCH
Để nâng cấp firmware hoặc cập nhật mô hình AI từ xa an toàn tuyệt đối:
Bảng phân vùng Flash (Partition Table) chia thành 2 ngăn đối xứng \`ota_0\` và \`ota_1\`:
- Vi điều khiển đang chạy ở \`ota_0\`.
- Khi tải bản cập nhật, file được ghi vào \`ota_1\`.
- Nếu tải bị đứt cáp hoặc mất điện giữa chừng: Ngăn \`ota_0\` hoàn toàn nguyên vẹn, thiết bị vẫn khởi động bình thường!`,
        code: `# File partitions.csv chuẩn Dual-Bank OTA cho chip Flash 4MB:
# Name,   Type, SubType, Offset,  Size,   Flags
nvs,      data, nvs,     0x9000,  0x4000,
otadata,  data, ota,     0xd000,  0x2000,
phy_init, data, phy,     0xf000,  0x1000,
ota_0,    app,  ota_0,   0x10000, 0x1E0000,
ota_1,    app,  ota_1,   0x1F0000,0x1E0000,`
    },
    "t20": {
        title: "Nâng cấp Firmware & Cập nhật trọng số Model AI từ xa qua Wi-Fi OTA an toàn",
        stageName: "Bước 5: Network & Nâng Cấp OTA",
        skill: "Over-The-Air (OTA) Model Updating",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: CƠ CHẾ ROLLBACK TỰ ĐỘNG KHI FIRMWARE LỖI
Điều gì xảy ra nếu firmware mới nạp thành công nhưng có bug gây sụp nguồn (crash loop) khi khởi động?
Hệ điều hành ESP-IDF tự động đánh dấu firmware mới là \`ESP_OTA_IMG_PENDING_VERIFY\`.
Nếu firmware mới khởi động tốt và vượt qua bước kiểm tra tự động (Self-test), mã nguồn phải gọi:
\`esp_ota_mark_app_valid_cancel_rollback();\`
Nếu bị crash trước khi gọi hàm này, Bootloader phần cứng sẽ tự động **Rollback quay về firmware cũ** ngay lập tức!`,
        code: `esp_https_ota_config_t ota_config = {
    .http_config = &http_client_cfg,
};
// Bắt đầu tải và nạp OTA:
esp_err_t ret = esp_https_ota(&ota_config);
if (ret == ESP_OK) {
    ESP_LOGI("OTA", "Nạp firmware mới thành công! Khởi động lại...");
    esp_restart();
}

// Trong app_main của bản mới: Xác nhận hệ thống khỏe mạnh để hủy Rollback
void confirm_ota_success(void) {
    if (run_system_self_test()) {
        esp_ota_mark_app_valid_cancel_rollback();
        ESP_LOGI("OTA", "✅ Xác nhận Firmware mới hoạt động ổn định!");
    }
}`
    },
    "t21": {
        title: "Lượng tử hóa mô hình Deep Learning (INT8 Post-Training Quantization)",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "INT8 Model Quantization",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI DÙNG LƯỢNG TỬ HÓA INT8?
Trọng số Float32 chiếm 4 bytes. INT8 chỉ chiếm 1 byte:
- Kích thước mô hình giảm đúng **75%** (từ 200KB xuống còn 50KB).
- Tận dụng bộ nhân nguyên (Integer Multiply-Accumulate) của ESP32-S3, tốc độ suy luận tăng gấp **3 - 5 lần**.
- Công thức ánh xạ tuyến tính chuẩn:
$$RealValue = Scale \times (QuantizedInt8 - ZeroPoint)$$

### 📌 2. BẪY LỖI KINH ĐIỂN
❌ Quên cung cấp \`representative_dataset\` khi chuyển đổi bằng TFLite Converter: Bộ chuyển đổi sẽ không đo được phân bố giá trị kích hoạt thực tế, gây sụt giảm độ chính xác nghiêm trọng.`,
        code: `import tensorflow as tf

def representative_data_gen():
    for input_value in tf.data.Dataset.from_tensor_slices(train_images).batch(1).take(100):
        yield [tf.cast(input_value, tf.float32)]

converter = tf.lite.TFLiteConverter.from_saved_model(saved_model_dir)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.representative_dataset = representative_data_gen
# Ép kiểu toàn bộ tensor đầu vào, đầu ra và trọng số về INT8
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8
tflite_quant_model = converter.convert()`
    },
    "t22": {
        title: "Tích hợp thư viện TensorFlow Lite for Microcontrollers (TFLite Micro) / ESP-DL",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "TFLite Micro & ESP-DL Integration",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TIẾT KIỆM FLASH VỚI MICROMUTABLEOPRESOLVER
Nếu dùng \`AllOpsResolver\`, toàn bộ hơn 100 toán tử AI sẽ bị nạp vào firmware, ngốn hơn 100KB Flash vô ích.
- Sử dụng \`MicroMutableOpResolver<N>\` chỉ đăng ký chính xác các toán tử mà mô hình của bạn sử dụng (ví dụ Conv2D, FullyConnected, Softmax).
- Trình liên kết (Linker) sẽ tự động lược bỏ toàn bộ mã nguồn thừa.`,
        code: `// Khai báo chính xác 4 toán tử cần thiết cho mô hình KWS:
static tflite::MicroMutableOpResolver<4> micro_op_resolver;
micro_op_resolver.AddConv2D();
micro_op_resolver.AddFullyConnected();
micro_op_resolver.AddReshape();
micro_op_resolver.AddSoftmax();`
    },
    "t23": {
        title: "Khởi tạo Tensor Arena, nạp model flatbuffer và gọi invoke() suy luận",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "Model Invocation & Tensor Management",
        content: `### 📌 1. VÒNG ĐỜI SUY LUẬN HOÀN CHỈNH TRÊN ESP32
1. Nạp con trỏ mảng FlatBuffer từ Flash: \`tflite::GetModel(g_model_data)\`.
2. Khởi tạo Interpreter với Tensor Arena được căn lề 16-byte (\`alignas(16)\`).
3. Cấp phát tensors: \`interpreter.AllocateTensors()\`.
4. Lượng tử hóa đầu vào: Ép số thực cảm biến về \`int8\` bằng công thức \`real / scale + zero_point\`.
5. Gọi \`interpreter.Invoke()\` để thực hiện suy luận.
6. Đọc kết quả xác suất đầu ra và tìm nhãn lớn nhất (ArgMax).`,
        code: `alignas(16) static uint8_t tensor_arena[40 * 1024]; // 40KB căn lề 16-byte

const tflite::Model* model = tflite::GetModel(g_model_data);
static tflite::MicroInterpreter static_interpreter(
    model, micro_op_resolver, tensor_arena, sizeof(tensor_arena));

TfLiteStatus alloc_status = static_interpreter.AllocateTensors();
if (alloc_status == kTfLiteOk) {
    // Nạp dữ liệu vào Tensor đầu vào:
    TfLiteTensor* input = static_interpreter.input(0);
    input->data.int8[0] = quant_val;

    // Chạy suy luận:
    static_interpreter.Invoke();

    // Đọc kết quả:
    TfLiteTensor* output = static_interpreter.output(0);
    int8_t best_score = output->data.int8[0];
}`
    },
    "t24": {
        title: "Dự án hoàn chỉnh: Nhận diện từ khóa giọng nói (KWS) hoặc phân loại rung động",
        stageName: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        skill: "Complete Edge AI Production Project",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: ĐÓNG GÓI SẢN PHẨM EDGE AI CHUẨN CÔNG NGHIỆP
Một sản phẩm Edge AI hoàn chỉnh liên kết toàn bộ các mắt xích:
- **Bước 1**: SRAM Tensor Arena căn lề 16-byte.
- **Bước 2**: GPTimer lấy mẫu định thời chuẩn xác 16kHz.
- **Bước 3**: I2S DMA thu âm và ESP-DSP trích xuất phổ FFT.
- **Bước 4**: Dual-Core FreeRTOS (Core 0 mạng, Core 1 TinyML).
- **Bước 5**: Báo cáo sự cố qua MQTT và hỗ trợ OTA từ xa.
- **Bước 6**: Mô hình INT8 chạy trong < 35ms với độ chính xác > 92%.`,
        code: `void app_main(void) {
    init_tensor_arena();
    init_dsp_fft_engine();
    init_i2s_microphone_dma();
    init_wifi_and_mqtt();

    ESP_LOGI("APP", "🚀 Hệ thống Edge AI đã sẵn sàng hoạt động!");
    // Vòng lặp chính thu nhận âm thanh, tính FFT và suy luận thời gian thực
}`
    },
    "t25": {
        title: "Cấu hình chế độ Deep Sleep dòng rò micro-ampe (uA) duy trì nguồn pin nhiều tháng",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "Micro-Ampere Deep Sleep Optimization",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI DÙNG DEEP SLEEP?
- Chế độ hoạt động bình thường (bật Wi-Fi): ESP32-S3 tiêu thụ 100mA - 240mA. Pin 18650 sẽ hết sạch sau 1 ngày!
- **Chế độ Deep Sleep**: Tắt 2 nhân CPU chính, tắt Flash ngoài, tắt modem Wi-Fi/BT. Dòng điện tiêu thụ giảm xuống mức cực hạn: **chỉ từ 5uA đến 10uA**!
- Pin 2500mAh có thể duy trì hoạt động từ 1 đến 3 năm nếu thiết bị chỉ thức dậy đo đạc rồi ngủ lại.`,
        code: `// Cấu hình ngủ sâu 60 giây và tắt nguồn ngoại vi:
esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_OFF);
esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL); // 60 giây
ESP_LOGI("PWR", "Bắt đầu Deep Sleep...");
esp_deep_sleep_start();`
    },
    "t26": {
        title: "Lập trình vi xử lý siêu tiết kiệm ULP Co-processor đọc cảm biến khi CPU chính ngủ",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "ULP FSM / RISC-V Co-processor Programming",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: BỘ ĐỒNG XỬ LÝ ULP RISC-V
Làm thế nào để phát hiện động đất, cháy rừng hoặc rò rỉ khí gas mà không cần bật CPU chính thức 24/7?
Bộ đồng xử lý **ULP (Ultra Low Power)** RISC-V 32-bit:
- Nằm trong vùng nhớ RTC Slow Memory, dòng tiêu thụ chỉ **~150 uA**.
- Tự động thức dậy đọc cảm biến ADC hoặc I2C định kỳ.
- **Chỉ khi giá trị vượt ngưỡng nguy hiểm**, ULP mới gửi ngắt đánh thức 2 nhân CPU chính dậy để xử lý và phát cảnh báo.`,
        code: `// Trong mã nguồn ULP RISC-V:
void ulp_riscv_main(void) {
    uint32_t sensor_val = ulp_riscv_adc_readChannel(ADC_CHANNEL_0);
    if (sensor_val > THRESHOLD_DANGER) {
        // Đánh thức CPU chính dậy xử lý khẩn cấp!
        ulp_riscv_wakeup_main_processor();
    }
}`
    },
    "t27": {
        title: "Cơ chế đánh thức thông minh: EXT0/EXT1 ngắt GPIO & Timer RTC Wakeup",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "Event-Driven RTC Wakeup Triggers",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: CÁC NGUỒN ĐÁNH THỨC DEEP SLEEP
- **EXT0**: Giám sát 1 chân RTC GPIO duy nhất (ví dụ nút bấm báo động chuyển về 0V).
- **EXT1**: Giám sát nhiều chân RTC GPIO thông qua mặt nạ bit (Bitmask), hỗ trợ logic ANY_HIGH hoặc ALL_LOW.
- **Timer RTC**: Đánh thức định kỳ theo thời gian.
Sau khi thức dậy, gọi hàm \`esp_sleep_get_wakeup_cause()\` để kiểm tra nguyên nhân khởi động.`,
        code: `// Kích hoạt đánh thức từ nút nhấn GPIO0:
esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0);

// Kiểm tra nguyên nhân sau khi thức dậy:
if (esp_sleep_get_wakeup_cause() == ESP_SLEEP_WAKEUP_EXT0) {
    ESP_LOGW("WAKE", "Được đánh thức bởi nút bấm khẩn cấp!");
}`
    },
    "t28": {
        title: "Tính toán ngân sách năng lượng (Power Budgeting) & Ước tính dung lượng Pin Lithium",
        stageName: "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        skill: "Battery Life Mathematical Modeling",
        content: `### 📌 1. CÔNG THỨC TOÁN HỌC DÀNH CHO BÁO CÁO ĐỒ ÁN
Dòng điện tiêu thụ trung bình ($I_{avg}$):
$$I_{avg} = \frac{I_{active} \times T_{active} + I_{sleep} \times T_{sleep}}{T_{active} + T_{sleep}}$$
Ví dụ thực tế:
- Thức 0.5s chạy AI ($I_{active} = 120$ mA).
- Ngủ 59.5s ($I_{sleep} = 0.01$ mA).
- $I_{avg} = (120 \times 0.5 + 0.01 \times 59.5) / 60 \approx 1.01$ mA.
Với viên pin 2500mAh, tuổi thọ pin thực tế = $2500 / 1.01 \approx 2475$ giờ (~103 ngày)!`,
        code: `float calculate_battery_days(float battery_mah, float i_act_ma, float t_act_s, 
                             float i_slp_ma, float t_slp_s) {
    float i_avg = (i_act_ma * t_act_s + i_slp_ma * t_slp_s) / (t_act_s + t_slp_s);
    return (battery_mah / i_avg) / 24.0f; // Số ngày sử dụng
}`
    },
    "t29": {
        title: "Đo đạc chỉ số suy luận: Latency (ms), Throughput (FPS), Footprint RAM/Flash",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "Edge AI Hardware Benchmarking",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: ĐỊNH LƯỢNG KHOA HỌC THAY CHO CẢM TÍNH
Hội đồng chấm đồ án tốt nghiệp luôn đòi hỏi số liệu kỹ thuật khách quan:
1. **Inference Latency (Độ trễ suy luận)**: Thời gian hàm \`Invoke()\` tính toán ma trận (đo bằng µs).
2. **Throughput (FPS)**: Số khung hình nhận diện được trong 1 giây ($FPS = 1000 / Latency_{ms}$).
3. **RAM Footprint (High Watermark)**: Lượng SRAM đỉnh điểm mà hệ thống chiếm dụng.
4. **Flash Footprint**: Kích thước nhị phân file firmware và model flatbuffer.`,
        code: `int64_t t_start = esp_timer_get_time();
TfLiteStatus status = interpreter.Invoke();
int64_t t_latency_us = esp_timer_get_time() - t_start;

float latency_ms = t_latency_us / 1000.0f;
float fps = 1000.0f / latency_ms;
ESP_LOGI("BENCHMARK", "Độ trễ AI: %.2f ms | Tốc độ: %.1f FPS", latency_ms, fps);`
    },
    "t30": {
        title: "Phân tích ma trận nhầm lẫn (Confusion Matrix), Accuracy, Precision & Recall",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "Scientific AI Model Validation",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: VÌ SAO CHỈ BÁO CÁO ACCURACY LÀ CHƯA ĐỦ?
Trong bài toán nhận diện sự cố động cơ, 99% thời gian máy chạy bình thường, chỉ 1% là xảy ra cháy nổ.
Nếu mô hình luôn đoán là "Bình thường", độ chính xác (Accuracy) vẫn đạt tới 99%, nhưng thiết bị bỏ sót 100% sự cố nguy hiểm!
- **Precision (Độ chuẩn xác)**: $\frac{TP}{TP + FP}$ (Trong số những lần báo cháy, có bao nhiêu lần cháy thật).
- **Recall (Độ nhạy)**: $\frac{TP}{TP + FN}$ (Trong tất cả các vụ cháy xảy ra, máy bắt được bao nhiêu vụ).
- **Confusion Matrix**: Ma trận đối chiếu nhãn thực tế và nhãn dự đoán của toàn bộ tập dữ liệu kiểm thử.`,
        code: `// Bảng đối chiếu Confusion Matrix mẫu trong báo cáo đồ án:
//                   Dự đoán Bình Thường    Dự đoán Sự Cố
// Thực tế Bình Thường:       980                  20   (Precision: 97.5%)
// Thực tế Có Sự Cố:           8                  192   (Recall: 96.0%)
// F1-Score đạt: 93.2%`
    },
    "t31": {
        title: "Kiểm thử độ ổn định 24/7 (Stress Test, Memory Leak Heap Tracing)",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "24/7 Stability & Heap Tracing",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: CHỨNG MINH THIẾT BỊ KHÔNG RÒ RỈ RAM
Thiết bị nhúng công nghiệp phải vượt qua bài kiểm tra Stress Test liên tục 24-72 giờ mà không bị treo hay tự khởi động lại.
Sử dụng công cụ **Heap Memory Tracing** của ESP-IDF để ghi lại toàn bộ các lần gọi \`malloc/free\`, đảm bảo lượng RAM tự do trước và sau 1,000 chu kỳ suy luận luôn bằng đúng nhau ($\Delta RAM = 0$).`,
        code: `heap_trace_record_t records[100];
heap_trace_init_standalone(records, 100);
heap_trace_start(HEAP_TRACE_LEAKS);

// Chạy 1000 chu kỳ suy luận liên tục:
for (int i = 0; i < 1000; i++) {
    run_ai_cycle();
}

heap_trace_stop();
heap_trace_dump(); // Nếu không có rò rỉ, hàm sẽ không in ra bản ghi leak nào!`
    },
    "t32": {
        title: "Chuẩn bị Báo cáo Đồ án tốt nghiệp chuẩn IEEE & Slide bảo vệ tự tin",
        stageName: "Bước 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        skill: "Technical Thesis Defense & Documentation",
        content: `### 📌 1. CẤU TRÚC BẢO VỆ ĐỒ ÁN ĐẠT ĐIỂM TỐI ĐA
1. **Tính cấp thiết**: Vì sao phải xử lý AI ngay tại biên (Edge) thay vì gửi toàn bộ lên Cloud? (Bảo mật dữ liệu, độ trễ thời gian thực < 50ms, không phụ thuộc đường truyền internet).
2. **Sơ đồ khối kiến trúc phần cứng & phần mềm**: Phân tách rõ ràng luồng I2S/DMA, FreeRTOS Queue và TFLite Micro.
3. **Bảng Benchmarking định lượng**: Tốc độ suy luận, dòng tiêu thụ Deep Sleep, tuổi thọ pin.
4. **Video demo thực tế**: Minh họa thiết bị phát hiện sự cố trực quan ngoài đời thực.`,
        code: `// Kiến trúc đồ án chuẩn IEEE:
// [Cảm biến INMP441] ➔ I2S DMA ➔ [ESP32-S3 Core 0: DSP FFT] 
//                                      ↓ (FreeRTOS Queue)
// [MQTT Cloud / OLED] ⇦ Wi-Fi  ⇦ [ESP32-S3 Core 1: TFLite Micro INT8]`
    },
    "t33": {
        title: "Từ khóa volatile: Khi nào bắt buộc dùng (Thanh ghi phần cứng, biến dùng trong ISR)",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Volatile Keyword Hardware Mechanics",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: Ý NGHĨA CỦA VOLATILE
Từ khóa \`volatile\` báo cho trình biên dịch rằng: **Giá trị của biến này có thể bị thay đổi bất ngờ bởi phần cứng bên ngoài hoặc một luồng ngắt khác**.
Trình biên dịch tối ưu hóa sẽ KHÔNG ĐƯỢC phép nạp biến này vào thanh ghi CPU cache, mà mỗi lần đọc/ghi đều phải truy cập trực tiếp vào ô nhớ RAM thật!

### 📌 2. 3 TRƯỜNG HỢP BẮT BUỘC DÙNG
1. Biến con trỏ trỏ tới thanh ghi phần cứng (Memory-Mapped I/O).
2. Biến toàn cục được sửa đổi bên trong hàm ngắt ISR.
3. Cờ chia sẻ giữa nhiều tác vụ trong FreeRTOS.`,
        code: `// Khai báo biến cờ sửa trong ISR:
volatile bool g_data_ready = false;

void IRAM_ATTR timer_isr_handler(void* arg) {
    g_data_ready = true; // Sửa trong ngắt
}

void main_task(void) {
    // Nếu thiếu volatile, compiler với cờ -O2 sẽ tối ưu thành while(true) vô hạn!
    while (!g_data_ready);
    process_data();
}`
    },
    "t34": {
        title: "Căn lề bộ nhớ Struct Padding & Memory Packing (#pragma pack, sizeof trap)",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Structure Padding & Alignment Hazards",
        content: `### 📌 1. BẢY PHỎNG VẤN QUỐC DÂN: SIZEOF(STRUCT)
Cho struct: \`struct Test { char a; int b; char c; };\`
Hàm \`sizeof()\` trả về bao nhiêu?
👉 **Đáp án: 12 bytes chứ KHÔNG PHẢI 6 bytes!**
Vì CPU 32-bit căn lề theo từng khối 4-byte:
- Biến \`char a\` chiếm 1 byte + **3 bytes padding (byte rác)** để \`int b\` nằm ở địa chỉ chia hết cho 4.
- Biến \`char c\` chiếm 1 byte + **3 bytes padding** cuối struct.
- ✅ Khắc phục: Sắp xếp lại từ lớn đến nhỏ (\`int b; char a; char c;\`) để giảm về 8 bytes, hoặc dùng \`__attribute__((packed))\` khi truyền gói tin mạng.`,
        code: `// Struct tối ưu sắp xếp lại thứ tự:
typedef struct {
    uint32_t b; // 4 bytes (offset 0)
    uint8_t a;  // 1 byte  (offset 4)
    uint8_t c;  // 1 byte  (offset 5)
    // 2 bytes padding cuối -> Tổng đúng 8 bytes (Tiết kiệm 33% RAM)!
} CompactStruct_t;`
    },
    "t35": {
        title: "Con trỏ nâng cao: Pointer to Pointer (**ptr), Function Pointer làm Callback",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Advanced Pointers & Callback Architecture",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: CON TRỎ CẤP 2 (POINTER TO POINTER)
Khi bạn muốn một hàm thay đổi địa chỉ mà con trỏ ở hàm gọi đang trỏ tới (ví dụ hàm cấp phát bộ nhớ động):
\`\`\`c
void allocate_buffer(uint8_t **buf, size_t size);
\`\`\`
### 📌 2. CON TRỎ HÀM (FUNCTION POINTER) LÀM BẢNG STATE MACHINE
Là con trỏ lưu địa chỉ của hàm thực thi. Được dùng làm hàm Callback khi ngắt xảy ra hoặc làm bảng chuyển trạng thái (State Machine Table) thay thế chuỗi \`switch-case\` 50 nhánh cồng kềnh.`,
        code: `typedef void (*SensorCallback_t)(float sensor_val);

void register_sensor_callback(SensorCallback_t cb) {
    g_callback = cb;
}

// Khi có dữ liệu mới, gọi con trỏ hàm:
if (g_callback) {
    g_callback(new_reading);
}`
    },
    "t36": {
        title: "Phân biệt const int *p vs int * const p, Bitwise shift tricks & Macro bẫy",
        stageName: "Bước 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        skill: "Const Pointers & Bit Manipulation",
        content: `### 📌 1. MẸO NHỚ THẦN TỐC: ĐỌC TỪ PHẢI SANG TRÁI
- \`const int *p\`: Con trỏ trỏ tới số nguyên hằng (Dữ liệu bị khóa không sửa được qua \`*p\`, con trỏ \`p\` có thể trỏ đi nơi khác).
- \`int * const p\`: Con trỏ hằng (Địa chỉ của \`p\` bị khóa cứng, giá trị \`*p\` sửa được).
- \`const int * const p\`: Khóa cả địa chỉ lẫn dữ liệu.

### 📌 2. BẪY MACRO TRONG PHỎNG VẤN
Luôn bọc dấu ngoặc đơn quanh biến và toàn bộ biểu thức \`#define SQUARE(x) ((x) * (x))\` để tránh lỗi khi truyền \`SQUARE(2 + 3)\`.`,
        code: `#define SET_BIT(reg, bit)    ((reg) |= (1U << (bit)))
#define CLEAR_BIT(reg, bit)  ((reg) &= ~(1U << (bit)))
#define TOGGLE_BIT(reg, bit) ((reg) ^= (1U << (bit)))
#define CHECK_BIT(reg, bit)  (((reg) >> (bit)) & 1U)`
    },
    "t37": {
        title: "Đọc Datasheet & Lập trình ngoại vi trực tiếp qua Thanh ghi trần (Direct Register Access)",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "Bare-Metal Register-Level Programming",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TỐC ĐỘ 1 CHU KỲ XUNG NHỊP
Hàm \`digitalWrite()\` của Arduino tốn tới 35-50 chu kỳ lệnh vì phải kiểm tra chân hợp lệ và tra bảng.
Lập trình thanh ghi trần (Bare-metal) ép kiểu địa chỉ vật lý thành con trỏ \`volatile uint32_t*\`:
Thao tác bật/tắt chân GPIO được thực hiện trong **đúng 1 chu kỳ xung nhịp (~4 nano-giây)**!`,
        code: `// Bật chân GPIO4 qua thanh ghi Set W1TS (Write 1 to Set):
#define GPIO_OUT_W1TS_REG  0x3FF44008
#define GPIO_OUT_W1TC_REG  0x3FF4400C

// Kéo chân GPIO4 lên mức HIGH:
*((volatile uint32_t *)GPIO_OUT_W1TS_REG) = (1U << 4);

// Kéo chân GPIO4 xuống mức LOW:
*((volatile uint32_t *)GPIO_OUT_W1TC_REG) = (1U << 4);`
    },
    "t38": {
        title: "Kiến trúc ngắt NVIC / Interrupt Vector Table, Priority Grouping & Nesting",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "Interrupt Vector Controller (NVIC)",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: NGUYÊN LÝ LỒNG NGẮT (INTERRUPT NESTING)
- **Interrupt Vector Table**: Bảng chứa con trỏ trỏ tới địa chỉ các hàm ISR trong bộ nhớ.
- **Preemption Priority**: Ngắt có độ ưu tiên cao hơn có thể chen ngang (lồng vào) ngắt có độ ưu tiên thấp hơn đang thực thi.
- **Tail-Chaining**: Cơ chế phần cứng thông minh chuyển thẳng từ ISR này sang ISR khác mà không cần cất/khôi phục lại thanh ghi CPU, tiết kiệm hàng chục chu kỳ máy.`,
        code: `// Kiến trúc xử lý ngắt:
// Ngắt Timer khẩn cấp (Priority 1) ──> Chen ngang ngắt UART (Priority 3)
// NVIC tự động lưu trữ R0-R3, R12, LR, PC lên Stack phần cứng chỉ trong 12 chu kỳ`
    },
    "t39": {
        title: "Cơ chế Pipeline, Cache Hit/Miss, Bus Matrix và DMA Arbiter của vi điều khiển",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "MCU Internal Bus Matrix & Pipeline",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: MA TRẬN BUS VÀ TRÁNH XUNG ĐỘT
- **Bus Matrix**: Cho phép nhiều Master (CPU Core 0, CPU Core 1, DMA) cùng truy cập đồng thời vào các phân vùng RAM/Flash khác nhau mà không làm nghẽn nhau.
- **DMA Arbiter**: Bộ phân xử quyền ưu tiên khi cả CPU và DMA cùng đòi đọc vào một khối RAM.
- ✅ Nguyên tắc vàng: Đặt bộ đệm DMA và Tensor Arena ở 2 phân vùng SRAM nội độc lập để tránh bị tranh chấp xung nhịp bus.`,
        code: `// Cấp phát bộ đệm DMA trong SRAM chuyên dụng:
uint8_t *dma_buf = (uint8_t *)heap_caps_malloc(512, MALLOC_CAP_DMA);`
    },
    "t40": {
        title: "Hiểu sâu quy trình khởi động MCU: Bootloader, Reset Handler, Startup ASM & Linker Script (.ld)",
        stageName: "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        skill: "Startup Code & Linker Script Anatomy",
        content: `### 📌 1. QUY TRÌNH TỪ BẬT NGUỒN ĐẾN HÀM MAIN()
1. Đọc vector khởi động tại 0x00000000 lấy con trỏ ngăn xếp Stack Top.
2. Nhảy vào hàm Assembly \`Reset_Handler\`.
3. Sao chép dữ liệu từ Flash sang RAM (Phân đoạn \`.data\`).
4. Xóa trắng toàn bộ biến chưa gán giá trị về 0 (Phân đoạn \`.bss\`).
5. Khởi tạo xung nhịp PLL và gọi hàm \`app_main()\`. File Linker Script (\`.ld\`) là người kiến trúc sư quy định toàn bộ bản đồ này.`,
        code: `/* Trích đoạn Linker Script .ld chuẩn */
.data : AT(_sidata) {
    _sdata = .;
    *(.data*)
    _edata = .;
} > RAM
.bss : {
    _sbss = .;
    *(.bss*)
    _ebss = .;
} > RAM`
    },
    "t41": {
        title: "Sử dụng máy phân tích logic (Logic Analyzer) giải mã tín hiệu UART, I2C, SPI",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "Hardware Protocol Decoding with Logic Analyzer",
        content: `### 📌 1. VŨ KHÍ BÍ MẬT CỦA KỸ SƯ PHẦN CỨNG
Khi cảm biến không phản hồi:
Kẹp máy phân tích logic (Logic Analyzer) vào chân SCL và SDA:
- Kiểm tra xem dạng sóng có bị méo mó do thiếu **điện trở kéo lên (Pull-up 4.7k)** không.
- Bắt gói tin và xem cảm biến trả về cờ **ACK** (Acknowledge) hay cờ **NACK** (Không nhận địa chỉ).`,
        code: `// Cách nhận biết lỗi trên Logic Analyzer:
// - SDA ở mức cao (High) tại sườn lên thứ 9 của xung SCL: Lỗi NACK (Sai địa chỉ I2C)!
// - Đường truyền luôn ở mức 0V: Chân bị chập nguồn Mass (GND).`
    },
    "t42": {
        title: "Bắt lỗi Crash vi điều khiển: Đọc Crash Dump, Guru Meditation, Stack Trace với addr2line",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "Guru Meditation Crash & Stack Decoding",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: ĐỊNH VỊ DÒNG CODE CRASH TRONG 5 GIÂY
Khi vi điều khiển bị sụp nguồn, Serial in ra:
\`Guru Meditation Error: Core 1 panic'ed (LoadProhibited). PC: 0x4200b21a\`
- \`LoadProhibited\`: Đọc con trỏ NULL!
- Dùng lệnh \`addr2line\` để dịch địa chỉ Hexa sang dòng code:
\`xtensa-esp32s3-elf-addr2line -pfia -e build/firmware.elf 0x4200b21a\`
Màn hình in ra chính xác: \`main/ai_engine.c:142\`.`,
        code: `# Lệnh giải mã Crash Dump:
xtensa-esp32s3-elf-addr2line -pfia -e build/firmware.elf 0x4200b21a
# Kết quả in ra:
# 0x4200b21a: process_frame at /project/main/audio_ai.c:142`
    },
    "t43": {
        title: "Debug phần cứng chuẩn JTAG với OpenOCD và GDB (Hardware Breakpoint, Watchpoint)",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "JTAG In-Circuit Debugging & GDB",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: HARDWARE WATCHPOINT BẮT MEMORY CORRUPTION
Khi một ô nhớ RAM bị ghi đè ngẫu nhiên:
In log \`printf\` sẽ làm thay đổi trật tự thời gian và giấu mất lỗi.
Dùng JTAG đặt **Hardware Watchpoint**:
CPU sẽ bị dừng ngay lập tức tại đúng dòng lệnh vừa ghi đè vào biến đó!`,
        code: `(gdb) target remote :3333
(gdb) watch g_tensor_arena[0] # Bắt kẻ ghi đè vào Tensor Arena
(gdb) continue
# CPU dừng ngay tại dòng code gây tràn bộ nhớ!`
    },
    "t44": {
        title: "Kỹ năng trả lời phỏng vấn kỹ thuật theo phương pháp STAR cho vị trí Intern Firmware",
        stageName: "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        skill: "STAR Method Technical Interviewing",
        content: `### 📌 1. CÔNG THỨC TRẢ LỜI PHỎNG VẤN STAR CHINH PHỤC NHÀ TUYỂN DỤNG
- **S (Situation - Tình huống)**: Đồ án Edge AI bị reset ngẫu nhiên sau khi chạy 2 tiếng.
- **T (Task - Nhiệm vụ)**: Cần tìm ra nguyên nhân gốc rễ mà không làm tăng độ trễ mô hình.
- **A (Action - Hành động)**: Dùng Logic Analyzer kiểm tra DMA và bật Heap Tracing, phát hiện rò rỉ Stack trong task AI, tăng kích thước Stack lên 8KB và cấp phát tĩnh Tensor Arena.
- **R (Result - Kết quả)**: Thiết bị chạy ổn định 72 giờ liên tục, độ trễ suy luận đạt 32ms.`,
        code: `// Bí quyết phỏng vấn nhúng: Luôn trả lời bằng số liệu định lượng (ms, KB, % cải thiện)`
    },
    "t45": {
        title: "Nguyên tắc cốt lõi MISRA C:2012: Không cấp phát động trong runtime, giới hạn con trỏ",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "MISRA C:2012 Automotive Compliance",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO NGÀNH Ô TÔ CẤM TUYỆT ĐỐI MALLOC/FREE?
Trong các hệ thống nhúng quan trọng (Automotive ISO 26262, Y tế, Hàng không), phần mềm phải chạy 24/7 suốt 10-15 năm mà **không bao giờ được sập**.
Cấp phát động (\`malloc\`, \`free\`, \`new\`) gây ra 2 hiểm họa chết người:
1. **Phân mảnh bộ nhớ (Heap Fragmentation)**: Sau hàng triệu chu kỳ cấp phát/giải phóng, Heap bị chia cắt thành hàng nghìn mảnh vụn nhỏ rời rạc. Dù tổng RAM còn trống nhiều nhưng một lệnh \`malloc(500)\` sẽ lập tức trả về \`NULL\` vì không có khối nhớ liền mạch!
2. **Hành vi không tiền định (Non-deterministic Timing)**: Thời gian thực thi của \`malloc()\` biến thiên ngẫu nhiên tùy thuộc vào độ dài chuỗi tìm kiếm khối nhớ trống.

### 📌 2. CÁC QUY TẮC SINH TỬ TRONG MISRA C:2012
- **Rule 21.3 (Mandatory)**: Không sử dụng các hàm cấp phát động \`malloc\`, \`calloc\`, \`realloc\`, \`free\` sau giai đoạn khởi động ban đầu. Mọi bộ đệm, hàng đợi và vùng nhớ suy luận AI phải được **cấp phát tĩnh (Static Allocation)** với kích thước cố định ở thời điểm biên dịch.
- **Rule 17.2 (Required)**: Không sử dụng hàm đệ quy (Recursion) dưới bất kỳ hình thức nào. Phải tính toán được chặn trên tối đa của kích thước Stack trước khi nạp code vào MCU.
- **Rule 11.4 & 11.8 (Advisory)**: Nghiêm cấm ép kiểu con trỏ tùy tiện làm mất tính an toàn kiểu hoặc làm mất từ khóa bảo vệ \`const\`.

### 📌 3. BẪY LỖI & THỰC HÀNH CÔNG NGHIỆP: STATIC MEMORY POOL
Khi cần cơ chế "mượn/trả" buffer cho các bản tin mạng hoặc khung hình cảm biến mà không vi phạm MISRA C, các kỹ sư sử dụng kỹ thuật **Memory Pool kích thước khối cố định (Fixed-Size Block Allocator)**: Toàn bộ mảng bộ nhớ được khai báo tĩnh, thời gian cấp phát và thu hồi luôn đạt $O(1)$ và hoàn toàn không bao giờ bị phân mảnh.`,
        code: `// Triển khai Fixed-Size Block Memory Pool tuân thủ MISRA C:2012
#define POOL_BLOCK_SIZE   64U
#define POOL_BLOCK_COUNT  8U

typedef struct {
    uint8_t memory[POOL_BLOCK_COUNT][POOL_BLOCK_SIZE];
    uint8_t free_mask; // Bit 1: Trống, Bit 0: Đang bận
} static_memory_pool_t;

static static_memory_pool_t s_pool = {
    .free_mask = 0xFFU // Ban đầu cả 8 khối đều sẵn sàng
};

void* pool_allocate(void) {
    for (uint8_t i = 0U; i < POOL_BLOCK_COUNT; i++) {
        if ((s_pool.free_mask & (1U << i)) != 0U) {
            s_pool.free_mask &= ~(1U << i); // Đánh dấu đã cấp phát
            return (void*)s_pool.memory[i];
        }
    }
    return NULL; // Hết khối trống (An toàn, không phân mảnh)
}

void pool_free(void *ptr) {
    if (ptr == NULL) return;
    for (uint8_t i = 0U; i < POOL_BLOCK_COUNT; i++) {
        if (ptr == (void*)s_pool.memory[i]) {
            s_pool.free_mask |= (1U << i); // Trả lại khối vào pool
            return;
        }
    }
}`
    },
    "t46": {
        title: "Phòng chống hành vi bất định (Undefined Behavior) và tràn số nguyên (Integer Overflow)",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "Undefined Behavior Prevention",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: HIỂM HỌA TỐI ƯU HÓA CỦA TRÌNH BIÊN DỊCH
Trong chuẩn C99/C11, tràn số nguyên có dấu (\`int32_t\`) là **Undefined Behavior (UB - Hành vi bất định)**.
Khi bạn bật cờ tối ưu hóa \`-O2\` hoặc \`-O3\` của GCC/Clang:
Trình biên dịch giả định rằng UB **không bao giờ xảy ra trong mã nguồn chuẩn**. Vì vậy, nếu bạn viết câu lệnh kiểm tra: \`if (x + 100 < x) { alert_error(); }\`, trình biên dịch sẽ xem đây là điều kiện vô lý và **tự ý xóa sổ toàn bộ đoạn if đó** khỏi mã máy! Thiết bị của bạn sẽ bị tràn số mà không có bất kỳ cảnh báo nào.

### 📌 2. NGUYÊN TẮC PHÒNG CHỐNG TRÀN SỐ CHUẨN MISRA C
1. **Kiểm tra biên TRƯỚC KHI thực hiện phép toán**:
   - Phép cộng: Thay vì \`a + b > MAX\`, phải kiểm tra: \`if (a > MAX - b)\`.
   - Phép nhân: Thay vì \`a * b > MAX\`, phải kiểm tra: \`if (a > 0 && b > MAX / a)\`.
2. **Luôn sử dụng kiểu dữ liệu kích thước tường minh**:
   - Sử dụng \`uint32_t\`, \`int32_t\`, \`uint8_t\` từ thư viện \`<stdint.h>\`. Tuyệt đối không dùng kiểu \`int\`, \`long\` mơ hồ vì kích thước phụ thuộc vào kiến trúc vi điều khiển (16-bit, 32-bit hay 64-bit).
3. **Thêm hậu tố U (Unsigned Literal)**:
   - Viết \`1000U\`, \`0xFFFFU\` thay vì \`1000\` để tránh việc số nguyên ngầm định bị chuyển thành kiểu có dấu gây lỗi dịch bit số âm.`,
        code: `// Thư viện kiểm tra toán tử số học an toàn chống UB chuẩn MISRA C
#include <stdint.h>
#include <stdbool.h>

bool safe_add_u32(uint32_t a, uint32_t b, uint32_t *result) {
    if (result == NULL) {
        return false;
    }
    // Kiểm tra trước: Liệu a có vượt quá khoảng cách còn lại tới trần?
    if (a > (UINT32_MAX - b)) {
        return false; // Ngăn chặn tràn số nguyên an toàn
    }
    *result = a + b;
    return true;
}

bool safe_mul_u32(uint32_t a, uint32_t b, uint32_t *result) {
    if (result == NULL) {
        return false;
    }
    if ((a != 0U) && (b > (UINT32_MAX / a))) {
        return false; // Phát hiện nguy cơ tràn số trước khi nhân
    }
    *result = a * b;
    return true;
}`
    },
    "t47": {
        title: "Tích hợp công cụ phân tích tĩnh (Static Code Analysis: Cppcheck, Clang-Tidy)",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "Automated Static Code Linting",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: "BẮT LỖI TỪ KHI MÃ NGUỒN CHƯA BIÊN DỊCH"
Chi phí sửa một con bug phần mềm khi đang viết code trên máy tính là **1 USD**.
Nếu để lọt lỗi vào phòng thử nghiệm phần cứng, chi phí tăng lên **100 USD**.
Nhưng nếu để lỗi rò rỉ bộ nhớ hoặc truy cập con trỏ NULL lọt vào chiếc xe ô tô đã bàn giao cho khách hàng ngoài đại lộ, chi phí thu hồi xe và bồi thường tính bằng **hàng triệu USD**.

Công cụ **Static Code Analysis (Phân tích mã nguồn tĩnh)** sử dụng giải thuật *Biểu diễn hình thức (Abstract Interpretation)* và *Kiểm chứng ký hiệu (Symbolic Execution)* để quét toàn bộ luồng điều khiển của file C mà không cần cắm nạp vi điều khiển.

### 📌 2. CÔNG CỤ VÀ NGUYÊN TẮC HOẠT ĐỘNG
- **Compiler Warnings (GCC/Clang)**: Bật cờ \`-Wall -Wextra -Werror -Wconversion\` để biến toàn bộ cảnh báo thành lỗi biên dịch.
- **Cppcheck**: Chuyên gia phát hiện rò rỉ con trỏ (Memory leak), truy cập mảng vượt biên (Buffer overflow), và sử dụng biến chưa khởi tạo (Uninitialized memory).
- **Clang-Tidy**: Chuyên gia rà soát cấu trúc mã, tuân thủ tiêu chuẩn lập trình hiện đại và các quy tắc MISRA C.

### 📌 3. BẪY LỖI & THỰC HÀNH CÔNG NGHIỆP
Luôn tích hợp cờ \`--error-exitcode=1\` vào script kiểm tra tự động. Nếu Cppcheck phát hiện bất kỳ vi phạm nghiêm trọng nào, tiến trình build phải bị hủy ngay lập tức, ngăn chặn việc tạo ra firmware lỗi.`,
        code: `# Script kiểm tra phân tích tĩnh toàn diện dự án nhúng:
cppcheck --enable=all \\
         --inconclusive \\
         --std=c99 \\
         --suppress=missingIncludeSystem \\
         --inline-suppr \\
         --error-exitcode=1 \\
         main/

# Kết quả mẫu khi phát hiện lỗi biến chưa khởi tạo:
# [main/sensor_hub.c:45]: (error) Uninitialized variable: raw_accel_x`
    },
    "t48": {
        title: "Coding Convention chuẩn công nghiệp: Naming, Doxygen Documentation & File Structure",
        stageName: "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        skill: "Industrial Code Convention & Doxygen",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: MÃ NGUỒN VIẾT CHO ĐỒNG ĐỘI ĐỌC
Trong dự án nhúng quy mô công nghiệp với hàng chục kỹ sư và hàng trăm nghìn dòng lệnh, mã nguồn không có quy ước đặt tên rõ ràng sẽ trở thành "mớ bòng bong" không thể bảo trì sau 6 tháng.
Một module chuẩn mực phải phân định tuyệt đối giữa:
- **Giao diện công khai (Public Interface - file \`.h\`)**: Nơi công bố các hàm API và kiểu dữ liệu mà các module khác được phép gọi.
- **Hiện thực nội bộ (Private Implementation - file \`.c\`)**: Mọi hàm hỗ trợ và biến nội bộ phải được khai báo từ khóa \`static\` để ẩn hoàn toàn khỏi không gian tên toàn cục (Encapsulation).

### 📌 2. QUY ƯỚC ĐẶT TÊN TIỀN TỐ (PREFIX CONVENTION)
- \`g_\`: Biến toàn cục (Global - hạn chế tối đa).
- \`s_\`: Biến tĩnh phạm vi file (Static file scope).
- \`p_\`: Con trỏ (Pointer, ví dụ: \`p_buffer\`).
- \`k_\`: Hằng số cấu hình (Constant).
- Tên hàm: \`<module>_<chức_năng>()\`, ví dụ: \`imu_sensor_init()\`, \`imu_sensor_read_accel()\`.

### 📌 3. TÀI LIỆU HÓA TỰ ĐỘNG VỚI DOXYGEN
Sử dụng các thẻ định dạng chuẩn: \`@brief\`, \`@param[in]\`, \`@param[out]\`, \`@return\`, \`@note\`. Hệ thống CI sẽ tự động biên dịch các chú thích này thành trang tài liệu HTML chuyên nghiệp cho toàn bộ dự án.`,
        code: `/**
 * @file imu_driver.h
 * @brief Giao tiếp điều khiển cảm biến gia tốc MPU6050
 * @author Embedded Team
 */

#ifndef IMU_DRIVER_H
#define IMU_DRIVER_H

#include <stdint.h>
#include <stdbool.h>
#include "esp_err.h"

/**
 * @brief Đọc giá trị gia tốc 3 trục từ cảm biến qua I2C
 * @param[in]  dev_addr  Địa chỉ I2C của cảm biến (0x68 hoặc 0x69)
 * @param[out] p_accel_x Con trỏ lưu giá trị trục X (đơn vị: m/s^2)
 * @param[out] p_accel_y Con trỏ lưu giá trị trục Y (đơn vị: m/s^2)
 * @param[out] p_accel_z Con trỏ lưu giá trị trục Z (đơn vị: m/s^2)
 * @return esp_err_t 
 *         - ESP_OK: Đọc dữ liệu thành công
 *         - ESP_ERR_INVALID_ARG: Con trỏ đầu ra bị NULL
 *         - ESP_ERR_TIMEOUT: Cảm biến không phản hồi trên đường truyền
 */
esp_err_t imu_driver_read_accel(uint8_t dev_addr, 
                               float *p_accel_x, 
                               float *p_accel_y, 
                               float *p_accel_z);

#endif /* IMU_DRIVER_H */`
    },
    "t49": {
        title: "Kiến trúc mạng CAN Bus (TWAI trên ESP32): Khung tin tiêu chuẩn, ID Arbitration",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "CAN Bus 2.0B / TWAI Driver Architecture",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: ÔNG VUA GIAO TIẾP TRÊN XE HƠI VÀ NHÀ MÁY
CAN Bus (trên chip ESP32 được gọi là **TWAI - Two-Wire Automotive Interface**) là chuẩn giao tiếp vi sai thống trị tuyệt đối trong ngành công nghiệp ô tô (Automotive) và robot tự hành.
- **Kháng nhiễu cực đại**: Truyền tín hiệu trên cặp dây xoắn \`CAN_H\` và \`CAN_L\`. Bất kỳ xung nhiễu điện từ nào từ bugi đánh lửa hay động cơ điện đều tác động bằng nhau lên cả hai dây, và mạch khuếch đại vi sai ở đầu thu sẽ triệt tiêu hoàn toàn nhiễu này (Common-Mode Rejection).
- **Mức logic vi sai**:
  - Mức Dominant (Bit 0): Điện áp vi sai $V_{CAN\_H} - V_{CAN\_L} \approx 2.0V$.
  - Mức Recessive (Bit 1): Điện áp vi sai $V_{CAN\_H} - V_{CAN\_L} \approx 0.0V$.

### 📌 2. CƠ CHẾ PHÂN XỬ BUS PHI HỦY DIỆT (NON-DESTRUCTIVE ARBITRATION)
Khi nhiều ECU cùng phát tin cùng một micro-giây:
Do mức **Bit 0 (Dominant)** luôn áp đảo và đè bẹp mức **Bit 1 (Recessive)**:
Gói tin nào có **CAN ID nhỏ hơn** (chứa nhiều bit 0 ở phần đầu hơn) sẽ tự động chiếm quyền ưu tiên bus, trong khi node có CAN ID lớn hơn sẽ tự động rút lui về chế độ nghe mà không làm mất hay méo dữ liệu của node thắng cuộc!

### 📌 3. BẪY LỖI CHẾT NGƯỜI PHẦN CỨNG
Bắt buộc phải có **2 điện trở đầu cuối 120Ω** mắc song song ở 2 đầu xa nhất của đường bus (tổng trở kháng đo được giữa CAN_H và CAN_L khi tắt nguồn phải đúng **60Ω**). Nếu thiếu điện trở này, sóng tín hiệu cao tần sẽ bị dội ngược ở đầu dây (Signal Reflection) và làm tê liệt toàn bộ mạng CAN.`,
        code: `#include "driver/twai.h"
#include "esp_log.h"

void twai_can_init(void) {
    // 1. Cấu hình tốc độ mạng (500 Kbps chuẩn ô tô)
    twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();
    
    // 2. Cấu hình bộ lọc phần cứng (Chấp nhận tất cả bản tin)
    twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();
    
    // 3. Cấu hình chân GPIO kết nối tới Transceiver (SN65HVD230)
    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(
        GPIO_NUM_4, GPIO_NUM_5, TWAI_MODE_NORMAL
    );
    
    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
    ESP_ERROR_CHECK(twai_start());
    ESP_LOGI("CAN", "TWAI Bus da khoi dong thanh cong!");
}

void twai_send_sensor_alert(uint16_t sensor_val) {
    twai_message_t msg = {
        .identifier = 0x120, // CAN ID ưu tiên cao
        .extd = 0,           // Khung tin tiêu chuẩn 11-bit ID
        .data_length_code = 2,
        .data = { (uint8_t)(sensor_val >> 8), (uint8_t)(sensor_val & 0xFF) }
    };
    twai_transmit(&msg, pdMS_TO_TICKS(50));
}`
    },
    "t50": {
        title: "Lọc gói tin phần cứng (Acceptance Filter) chống nghẽn CPU trên mạng ô tô",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "Hardware CAN Acceptance Filtering",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: GIẢI CỨU CPU KHỎI CƠN BÃO NGẮT (BUS FLOODING)
Trên một chiếc xe hơi hoặc dây chuyền nhà máy, mạng CAN Bus có thể lưu thông hàng nghìn gói tin mỗi giây từ hộp số, túi khí, phanh ABS, máy lạnh...
Nếu vi điều khiển ESP32 phải thức dậy xử lý ngắt (Interrupt Service Routine) cho từng gói tin xuất hiện trên đường dây, CPU sẽ bị tiêu tốn 40-60% năng lực chỉ để đọc rồi vứt bỏ các gói tin rác không liên quan!

**Bộ lọc phần cứng Acceptance Filter (Code và Mask)** hoạt động ngay trên mạch điện tử silicon của bộ điều khiển CAN: Nó so sánh địa chỉ CAN ID của gói tin đến và tự động từ chối (Drop) ngay lập tức nếu không khớp mà không làm phiền CPU một chu kỳ xung nhịp nào.

### 📌 2. NGUYÊN LÝ TOÁN HỌC CỦA CODE VÀ MASK
Bộ lọc phần cứng quyết định gói tin có được nhận hay không theo công thức logic:
$$\\text{Match} = (( \\text{Received\\_ID} \\oplus \\text{Acceptance\\_Code} ) \\& \\text{Acceptance\\_Mask}) == 0$$
- **Vị trí bit trong Mask = 1**: Bắt buộc bit của ID nhận được phải **trùng khớp 100%** với bit tương ứng trong Acceptance Code.
- **Vị trí bit trong Mask = 0**: "Don't care" (chấp nhận bất kỳ giá trị 0 hoặc 1).

### 📌 3. BẪY LỖI DỊCH BIT 21-BIT TRÊN ESP32 TWAI
Bộ điều khiển TWAI của ESP32 sử dụng thanh ghi 32-bit tương thích chip SJA1000. Đối với khung tin tiêu chuẩn 11-bit, 11 bit ID này nằm ở **11 bit cao nhất** của thanh ghi 32-bit (tức là phải dịch trái 21 bit: \`ID << 21\`). Nếu bạn quên dịch bit, bộ lọc sẽ nhận sai dải ID hoặc chặn nhầm toàn bộ bản tin!`,
        code: `// Cấu hình bộ lọc phần cứng chỉ nhận các bản tin CAN ID từ 0x200 đến 0x20F
// 0x200 = 0b010 0000 0000 -> Nhận dải 16 ID (4 bit cuối "don't care")

twai_filter_config_t filter_config = {
    // Acceptance Code: Khớp tiền tố 0x200 ở 11 bit cao
    .acceptance_code = (0x200U << 21),
    
    // Acceptance Mask: 
    // - 7 bit đầu phải khớp chính xác (bit = 1)
    // - 4 bit cuối cho phép biến thiên từ 0x0 đến 0xF (bit = 0)
    // - Các bit byte dữ liệu không quan tâm (bit = 0)
    .acceptance_mask = ~((0x7F0U << 21)),
    
    .single_filter = true
};

// Cài đặt bộ lọc vào driver:
// Mọi bản tin như 0x100 hay 0x300 sẽ bị phần cứng loại bỏ trong 0 nano-giây!`
    },
    "t51": {
        title: "Giao thức công nghiệp Modbus RTU qua chuẩn truyền thông vi sai RS485",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "RS485 Modbus RTU Industrial Protocol",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TIÊU CHUẨN THỐNG TRỊ NHÀ MÁY THÔNG MINH
Modbus RTU chạy trên đường truyền vật lý vi sai **RS485** là giao thức công nghiệp phổ biến nhất thế giới dùng để giao tiếp giữa PLC, biến tần (Inverter), cảm biến quan trắc môi trường và đồng hồ đo năng lượng điện.
- Khả năng truyền dẫn vi sai xa tới **1200 mét** với tốc độ ổn định (9600 - 115200 bps).
- Hoạt động theo mô hình **Master-Slave Bán song công (Half-Duplex)**: Tại một thời điểm, đường dây chỉ có thể hoặc là Truyền, hoặc là Nhận.

### 📌 2. NGUYÊN LÝ KHUNG TIN MODBUS RTU
Bản tin Modbus RTU gồm các trường liên tục:
\`[Slave Address: 1B] [Function Code: 1B] [Start Register: 2B] [Quantity: 2B] [CRC-16: 2B]\`
- Mã hàm phổ biến: \`0x03\` (Read Holding Registers), \`0x06\` (Write Single Register), \`0x10\` (Write Multiple Registers).
- **Mã kiểm tra CRC-16 Modbus**: Sử dụng đa thức \`0xA001\` để phát hiện lỗi đường truyền.

### 📌 3. BẪY LỖI CHẾT NGƯỜI: ĐIỀU KHIỂN CHÂN RTS (DE/RE) VÀ THỜI GIAN IM LẶNG T3.5
1. Chip chuyển đổi RS485 (MAX485/SP3485) yêu cầu chân GPIO kích hoạt chế độ Phát (DE) và Nhận (RE). Nếu tắt chân phát quá sớm trước khi byte cuối cùng truyền xong ra khỏi bộ đệm UART, byte cuối sẽ bị mất; nếu tắt quá trễ, chip sẽ chặn mất tín hiệu phản hồi từ Slave.
2. ESP32 giải quyết triệt để vấn đề này bằng chế độ phần cứng \`UART_MODE_RS485_HALF_DUPLEX\` tự động quản lý chân RTS ở mức nano-giây.
3. **Khoảng cách phân định khung tin T3.5**: Nếu khoảng cách nghỉ giữa hai byte vượt quá 3.5 lần thời gian truyền một ký tự, Slave sẽ xem bản tin bị đứt đoạn và hủy bỏ.`,
        code: `#include "driver/uart.h"

#define RS485_UART_PORT   UART_NUM_2
#define RS485_TX_PIN      17
#define RS485_RX_PIN      16
#define RS485_RTS_PIN     18 // Nối vào chân DE/RE của MAX485

void rs485_hardware_init(void) {
    uart_config_t uart_config = {
        .baud_rate = 9600,
        .data_bits = UART_DATA_8_BITS,
        .parity    = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
        .source_clk = UART_SCLK_DEFAULT,
    };
    uart_param_config(RS485_UART_PORT, &uart_config);
    uart_set_pin(RS485_UART_PORT, RS485_TX_PIN, RS485_RX_PIN, RS485_RTS_PIN, UART_PIN_NO_CHANGE);
    uart_driver_install(RS485_UART_PORT, 256, 256, 0, NULL, 0);
    
    // Kích hoạt chế độ phần cứng RS485 Half-Duplex độc quyền của ESP32:
    uart_set_mode(RS485_UART_PORT, UART_MODE_RS485_HALF_DUPLEX);
}

// Thuật toán tính CRC-16 Modbus chuẩn công nghiệp
uint16_t modbus_crc16(const uint8_t *buffer, uint16_t len) {
    uint16_t crc = 0xFFFFU;
    for (uint16_t pos = 0; pos < len; pos++) {
        crc ^= (uint16_t)buffer[pos];
        for (int i = 8; i != 0; i--) {
            if ((crc & 0x0001U) != 0U) {
                crc >>= 1;
                crc ^= 0xA001U;
            } else {
                crc >>= 1;
            }
        }
    }
    return crc;
}`
    },
    "t52": {
        title: "Thiết kế Driver thiết bị ngoại vi chuẩn Module hóa (Layered HAL/Driver Pattern)",
        stageName: "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        skill: "Layered Device Driver Architecture",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: NGHỆ THUẬT KIẾN TRÚC DRIVER DI ĐỘNG (PORTABLE DRIVER)
Lỗi phổ biến của các lập trình viên nghiệp dư là viết code điều khiển cảm biến gắn chặt (Hard-coded) vào thư viện của vi điều khiển (ví dụ: gọi trực tiếp \`i2c_master_write_to_device\` của ESP-IDF bên trong thuật toán đọc MPU6050).
Hậu quả: Khi công ty chuyển dự án sang dòng vi điều khiển khác như STM32, Texas Instruments hoặc NXP, toàn bộ mã nguồn cảm biến và thuật toán AI phải đập đi viết lại từ đầu!

Kỹ sư nhúng chuyên nghiệp tổ chức driver theo **Kiến trúc phân lớp (Layered Pattern)**:
- **Tầng 1 - HAL (Hardware Abstraction Layer)**: Định nghĩa interface con trỏ hàm thuần túy để đọc/ghi mảng byte qua bus.
- **Tầng 2 - Device Driver**: Xử lý logic giải mã thanh ghi và công thức chuyển đổi vật lý (gia tốc g, nhiệt độ °C). Tầng này **hoàn toàn không chứa bất kỳ header nào của ESP-IDF**.
- **Tầng 3 - Application Layer**: Ứng dụng nghiệp vụ và mô hình TinyML.

### 📌 2. NGUYÊN LÝ DEPENDENCY INJECTION BẰNG CON TRỎ HÀM
Device Driver nhận một struct chứa con trỏ hàm giao tiếp bus khi khởi tạo. Driver chỉ cần gọi hàm qua interface mà không cần quan tâm bên dưới là ESP32 phần cứng thật, STM32 hay hàm Mock chạy trên máy tính PC!`,
        code: `// Tệp tin: sensor_interface.h (Thuần C, tương thích mọi vi điều khiển)
#include <stdint.h>
#include <stdbool.h>

typedef struct {
    // Con trỏ hàm đọc ghi qua bus trừu tượng:
    bool (*bus_read)(uint8_t dev_addr, uint8_t reg_addr, uint8_t *data, uint16_t len);
    bool (*bus_write)(uint8_t dev_addr, uint8_t reg_addr, const uint8_t *data, uint16_t len);
    void (*delay_ms)(uint32_t ms);
} sensor_bus_interface_t;

typedef struct {
    uint8_t dev_addr;
    sensor_bus_interface_t bus;
} temp_sensor_t;

// Khởi tạo Driver bằng kỹ thuật Dependency Injection:
void temp_sensor_init(temp_sensor_t *sensor, uint8_t addr, sensor_bus_interface_t bus_ops) {
    sensor->dev_addr = addr;
    sensor->bus = bus_ops;
}

bool temp_sensor_get_celsius(temp_sensor_t *sensor, float *out_temp) {
    uint8_t raw[2];
    // Gọi hàm đọc thông qua interface trừu tượng:
    if (!sensor->bus.bus_read(sensor->dev_addr, 0x00, raw, 2)) {
        return false;
    }
    int16_t raw_val = (int16_t)((raw[0] << 8) | raw[1]);
    *out_temp = (float)raw_val * 0.0625f;
    return true;
}`
    },
    "t53": {
        title: "Viết Unit Test cho mã nguồn C nhúng bằng framework Unity & CMock",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Embedded Unit Testing with Unity & CMock",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI UNIT TEST MÃ C TRÊN MÁY TÍNH?
Phương pháp thử nghiệm truyền thống của sinh viên: Viết code -> Nạp vào board ESP32 -> Dùng tay bấm nút hoặc hơ lửa vào cảm biến -> Nhìn Serial in ra.
Phương pháp này tốn hàng giờ đồng hồ, không thể lặp lại tự động và hoàn toàn bất lực trong việc kiểm thử hàng trăm kịch bản góc (Corner Cases) như: cảm biến gửi số âm cực lớn, tràn mảng, hoặc đứt cáp giữa chừng.

**Unit Testing** cho phép chạy toàn bộ logic thuật toán của firmware trực tiếp trên máy tính cá nhân (Host PC bằng GCC/Clang) chỉ trong **0.2 giây**!

### 📌 2. FRAMEWORK UNITY DÀNH RIÊNG CHO MÔI TRƯỜNG NHÚNG
Framework **Unity** là chuẩn mực xUnit siêu nhẹ được thiết kế chuyên biệt cho C nhúng:
- Không cấp phát động (Zero dynamic memory).
- Cung cấp các macro kiểm thử phong phú:
  - \`TEST_ASSERT_EQUAL_INT32(expected, actual)\`
  - \`TEST_ASSERT_FLOAT_WITHIN(delta, expected, actual)\`
  - \`TEST_ASSERT_NULL(pointer)\`
- Cặp hàm chu kỳ sống:
  - \`setUp()\`: Tự động chạy trước mỗi ca test (Dùng để reset biến static về trạng thái ban đầu).
  - \`tearDown()\`: Tự động chạy sau mỗi ca test.

### 📌 3. BẪY LỖI NHIỄM ĐỘC CA KIỂM THỬ (TEST POLLUTION)
Nếu module của bạn sử dụng biến tĩnh nội bộ (\`static int s_counter = 0;\`), giá trị thay đổi từ ca test 1 sẽ còn lưu lại và làm sai lệch kết quả của ca test 2. Luôn luôn viết một hàm \`module_reset_state()\` và gọi nó bên trong hàm \`setUp()\` của Unity.`,
        code: `#include "unity.h"
#include "anomaly_filter.h"

void setUp(void) {
    // Reset toàn bộ bộ đệm trung bình động trước mỗi ca test
    anomaly_filter_reset();
}

void tearDown(void) {
    // Dọn dẹp sau khi kết thúc ca test
}

void test_moving_average_smooth_normal_signal(void) {
    float samples[] = { 10.0f, 20.0f, 30.0f };
    float result = 0.0f;
    for (int i = 0; i < 3; i++) {
        result = anomaly_filter_push(samples[i]);
    }
    // Giá trị trung bình kỳ vọng: (10 + 20 + 30) / 3 = 20.0
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 20.0f, result);
}

void test_anomaly_detection_triggers_on_spike(void) {
    // Nạp tín hiệu nền ổn định 10.0
    for (int i = 0; i < 10; i++) {
        anomaly_filter_push(10.0f);
    }
    // Đột ngột xuất hiện xung va đập cực lớn (Rung chấn vòng bi hư hỏng)
    bool is_anomaly = anomaly_filter_check_spike(85.0f);
    TEST_ASSERT_TRUE_MESSAGE(is_anomaly, "He thong phai phat hien ra xung rung bat thuong!");
}`
    },
    "t54": {
        title: "Giả lập phần cứng (Hardware Mocking) để chạy Unit Test trên máy tính CI mà không cần mạch thật",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Hardware Abstraction Layer Mocking",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: LÀM SAO TEST CODE GỌI PHẦN CỨNG TRÊN SERVER CI?
Khi thuật toán phân tích rung chấn AI của bạn gọi hàm \`i2c_master_read_from_device()\` hoặc đọc chân ngắt GPIO:
Làm sao chạy được bài test đó trên máy chủ đám mây (GitHub Actions runner) khi máy chủ hoàn toàn không cắm vi điều khiển ESP32 thật?
Câu trả lời: **Kỹ thuật Hardware Mocking (Giả lập phần cứng)**.

Ta tạo ra một hàm giả lập có tên hàm và kiểu tham số giống hệt hàm phần cứng thật. Trong kịch bản test:
1. Ta lập trình trước cho hàm Mock: Trả về mảng dữ liệu mẫu (ví dụ: mảng rung chấn động cơ hỏng).
2. Hoặc kiểm tra xem: Liệu module của ta có gửi đúng địa chỉ thanh ghi \`0x3B\` qua I2C hay không.
3. Giả lập kịch bản sự cố: Cho hàm Mock trả về mã lỗi \`ESP_ERR_TIMEOUT\` để xem firmware có tự động kích hoạt chế độ an toàn hay bị treo vĩnh viễn.

### 📌 2. KỸ THUẬT STUB/MOCK THỦ CÔNG
Khi không muốn cài đặt phức tạp, ta có thể dùng kỹ thuật Fake Object: Khai báo struct chứa giá trị trả về mong muốn và số lần hàm được gọi.

### 📌 3. BẪY LỖI GIẢ LẬP QUÁ ĐÀ (OVER-MOCKING)
Không nên mock những hàm tính toán logic thuần túy (như hàm tính CRC, hàm giải mã byte). Chỉ mock các hàm nằm ở ranh giới giao tiếp phần cứng (I2C, SPI, UART, Flash Storage).`,
        code: `// Tệp tin: test_sensor_monitor.c (Chạy hoàn toàn trên máy tính Ubuntu/Windows)
#include "unity.h"
#include "esp_err.h"

// Biến trạng thái để điều khiển hành vi của hàm Fake:
static esp_err_t s_fake_i2c_return_val = ESP_OK;
static uint8_t   s_fake_sensor_data[6] = {0};
static uint32_t  s_i2c_read_call_count = 0;

// Hàm Mock giả lập hàm đọc I2C của ESP-IDF:
esp_err_t i2c_master_read_from_device(int port, uint8_t addr, uint8_t *data, size_t len, int timeout) {
    s_i2c_read_call_count++;
    if (s_fake_i2c_return_val == ESP_OK) {
        for (size_t i = 0; i < len; i++) {
            data[i] = s_fake_sensor_data[i];
        }
    }
    return s_fake_i2c_return_val;
}

void test_system_handles_sensor_disconnect_gracefully(void) {
    // Kịch bản: Cảm biến bị đứt cáp, đường truyền I2C bị Timeout
    s_fake_i2c_return_val = ESP_ERR_TIMEOUT;
    
    bool system_healthy = monitor_poll_sensor_health();
    
    // Khẳng định: Firmware phải bắt được lỗi và chuyển sang trạng thái cảnh báo
    TEST_ASSERT_FALSE(system_healthy);
    TEST_ASSERT_EQUAL_UINT32(1, s_i2c_read_call_count);
}`
    },
    "t55": {
        title: "Xây dựng luồng CI/CD với GitHub Actions: Tự động kiểm tra lint và build firmware khi Push",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Automated Firmware CI/CD Pipelines",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: "NGƯỜI GÁC CỔNG" TỰ ĐỘNG 24/7
Trong các công ty công nghệ lớn, không có bất kỳ dòng code nào được phép nhập vào sản phẩm mà không vượt qua hệ thống **CI/CD (Continuous Integration / Continuous Deployment)**.
Mỗi khi bạn thực hiện lệnh \`git push\` hoặc mở một Pull Request:
Máy chủ đám mây của GitHub (GitHub Actions Runner) sẽ tự động khởi động một máy ảo Linux độc lập và thực hiện tuần tự các bước kiểm thử khắt khe:
1. **Kiểm tra chuẩn mã (Lint & Format)**: Dùng \`clang-format\` đảm bảo code sạch sẽ, thụt dòng nhất quán.
2. **Quét lỗi bảo mật tĩnh (Static Analysis)**: Chạy \`cppcheck\` quét lỗi phân mảnh và MISRA C.
3. **Chạy toàn bộ Unit Test**: Thực thi hàng trăm bài test Unity trong 5 giây.
4. **Biên dịch Firmware thực tế**: Dùng Docker Image chính thức của Espressif (\`espressif/idf\`) để build file nhị phân \`firmware.bin\`.

### 📌 2. NGUYÊN TẮC "ĐÁNH DẤU X ĐỎ" BẢO VỆ NHÁNH CHÍNH
Nếu chỉ cần một bài test bị trượt (Fail) hoặc có một cảnh báo MISRA nghiêm trọng:
Hệ thống CI sẽ đánh dấu **X Đỏ** và tự động **Khóa chức năng Merge**. Điều này đảm bảo nhánh chính (\`main\`) luôn luôn ở trạng thái sẵn sàng xuất xưởng (Production-Ready).

### 📌 3. THIẾT KẾ FILE KỊCH BẢN WORKFLOW (.github/workflows/firmware_ci.yml)`,
        code: `name: Edge AI Firmware CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    name: Run Native Host Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v3
        
      - name: Install Host Build Tools
        run: sudo apt-get update && sudo apt-get install -y gcc cppcheck
        
      - name: Run Cppcheck Static Analysis
        run: cppcheck --enable=all --error-exitcode=1 main/
        
      - name: Execute Unity Test Suite
        run: |
          gcc -I./include -I./test/unity test/test_main.c test/unity/unity.c -o test_runner
          ./test_runner

  esp32-build:
    name: Build ESP-IDF Firmware Binary
    needs: unit-tests
    runs-on: ubuntu-latest
    container: espressif/idf:release-v5.1
    steps:
      - uses: actions/checkout@v3
      - name: Build Firmware with idf.py
        run: |
          idf.py set-target esp32s3
          idf.py build
      - name: Upload Firmware Binary Artifact
        uses: actions/upload-artifact@v3
        with:
          name: esp32s3-firmware-bin
          path: build/firmware.bin`
    },
    "t56": {
        title: "Quy trình làm việc nhóm chuyên nghiệp: Git Flow, Code Review & Release Management",
        stageName: "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        skill: "Professional Git Flow & Firmware Release",
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: NGUYÊN TẮC LÀM VIỆC NHÓM CỦA KỸ SƯ DOANH NGHIỆP
Kỹ năng phân biệt rõ nhất giữa một "thợ code một mình" và một "Kỹ sư phần mềm nhúng chuyên nghiệp" là khả năng làm việc theo quy trình **Git Flow** và **Code Review**.
Tuyệt đối không bao giờ được phép dùng lệnh \`git push origin main\` trực tiếp!
Mọi tính năng mới (Driver CAN Bus, mô hình TinyML nhận diện âm thanh...) đều phải được phát triển trên một nhánh riêng biệt (Feature Branch) và trải qua quá trình phản biện mã nguồn (Code Review) từ ít nhất 1 kỹ sư Senior trước khi hòa nhập vào sản phẩm.

### 📌 2. QUY ƯỚC CÁC NHÁNH TRONG MÔ HÌNH GIT FLOW
- **\`main\`**: Nhánh thiêng liêng nhất, chỉ chứa các phiên bản firmware hoàn thiện đã qua kiểm thử trên dây chuyền sản xuất thật.
- **\`develop\`**: Nhánh tích hợp trung tâm của toàn đội dự án.
- **\`feature/tên-tính-năng\`**: Nhánh tạm thời tạo ra từ \`develop\` để phát triển một module độc lập. Xong tính năng thì tạo Pull Request (PR) để merge trở lại \`develop\`.
- **\`release/vX.Y.Z\`**: Nhánh đóng băng tính năng để QA/QC thử nghiệm nghiệm thu trước khi xuất xưởng.

### 📌 3. ĐÁNH SỐ PHIÊN BẢN CHUẨN NGỮ NGHĨA (SEMANTIC VERSIONING - SEMVER)
Định dạng phiên bản: \`vMAJOR.MINOR.PATCH\` (ví dụ: \`v2.4.1\`):
- **MAJOR**: Tăng khi thay đổi kiến trúc lớn, không tương thích ngược (ví dụ: đổi chip vi điều khiển hoặc đổi giao thức truyền thông).
- **MINOR**: Tăng khi bổ sung tính năng ngoại vi mới nhưng vẫn tương thích ngược với hệ thống cũ.
- **PATCH**: Tăng khi sửa lỗi nhỏ (Bug fix), không làm thay đổi giao diện API.`,
        code: `# QUY TRÌNH THỰC CHIẾN HÀNG NGÀY CỦA KỸ SƯ NHÚNG:

# 1. Kéo mã nguồn mới nhất từ nhánh phát triển
git checkout develop
git pull origin develop

# 2. Tạo nhánh tính năng mới theo chuẩn đặt tên
git checkout -b feature/canbus-twai-driver

# 3. Viết code, chạy test và tạo commit với thông điệp rõ ràng
git add main/can_driver.c
git commit -m "feat(can): implement hardware acceptance filter for 0x200 range"

# 4. Đẩy nhánh lên remote repository
git push origin feature/canbus-twai-driver

# 5. Mở Pull Request trên GitHub / GitLab
# - Gán người review (Reviewers)
# - Đợi máy chủ CI kiểm tra toàn bộ Unit Test và báo Xanh (Pass)
# - Nhận phản hồi, sửa code và hoàn tất quá trình Squash & Merge!`
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
