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
        "stageIndex": 0,
        "title": "Bước 1: C Core, Con Trỏ (Pointers) & Quản Lý Bộ Nhớ ESP32-S3",
        "summary": "Nền tảng sống còn của kỹ sư nhúng: Nắm vững bản chất vật lý của con trỏ (Địa chỉ Address vs Giá trị Value, toán tử & và *, số học con trỏ, toán tử mũi tên -> struct, con trỏ hàm, void*, zero-copy buffer), hiểu sâu bản đồ bộ nhớ ESP32-S3 (Internal SRAM0/1/2, RTC Fast/Slow SRAM, External PSRAM, Flash Cache), căn lề 16-byte bắt buộc cho tập lệnh Vector SIMD AI và kỹ thuật cấp phát tĩnh chống phân mảnh Heap.",
        "coreAnalogy": "Hãy hình dung bộ nhớ RAM 512KB của ESP32-S3 như một khách sạn cao cấp có 524,288 ngăn tủ locker. Mỗi ngăn tủ có một biển số phòng Hexa duy nhất (Địa chỉ: ví dụ 0x3FFB0004) và bên trong chứa vật dụng (Dữ liệu thực tế: ví dụ 42). Biến thông thường là tên đặt cho ngăn tủ; còn biến con trỏ là một tờ giấy note ghi lại số phòng đó! Truyền con trỏ trong C cũng giống như gửi chìa khóa phòng thay vì bê nguyên cả căn phòng đi giao hàng.",
        "hardwareArchitecture": "ESP32-S3 Dual-Core Xtensa LX7 phân bổ bộ nhớ vật lý thành 4 vùng độc lập:\n1. Internal SRAM0 (64KB): Dành riêng cho IRAM_ATTR và CPU Instruction Cache.\n2. Internal SRAM1 (384KB): Vùng SRAM nhanh nhất (1 chu kỳ xung 240MHz ~4.16ns), lý tưởng tuyệt đối để đặt Tensor Arena.\n3. Internal SRAM2 (64KB): Vùng đệm kết nối trực tiếp với bộ điều khiển phần cứng DMA (Wi-Fi, I2S, SPI).\n4. External PSRAM (8MB Octal SPI): Dung lượng lớn nhưng trễ gấp 3-4 lần do đi qua bus nối tiếp.",
        "highlights": [
            "Bản chất Con Trỏ & Zero-Copy: Truyền con trỏ cấu trúc (const Frame_t *frame) chỉ tiêu tốn đúng 4 bytes trên Stack, triệt tiêu độ trễ sao chép dữ liệu và ngăn chặn 100% nguy cơ Stack Overflow khi xử lý khung âm thanh 32KB.",
            "Hai Toán Tử Cơ Bản: Toán tử & (Address-of) lấy số phòng lưu trên RAM; toán tử * (Dereference) mở cánh cửa ngăn tủ để đọc hoặc ghi đè giá trị.",
            "Số Học Con Trỏ (Pointer Arithmetic): Phép toán ptr + 1 không phải tăng 1 byte, mà tự động nhảy đúng sizeof(T) bytes (4 bytes với int/float, 16 bytes với struct).",
            "Căn Lề Bắt Buộc alignas(16): Tập lệnh mở rộng SIMD 128-bit nạp cùng lúc 16 phần tử INT8. Nếu Tensor Arena không bắt đầu từ địa chỉ chia hết cho 16, CPU sẽ phát sinh ngoại lệ LoadStoreAlignment Crash ngay lập tức.",
            "Chống Phân Mảnh Heap: Cấm lạm dụng malloc()/free() tuần hoàn. Sử dụng cấp phát tĩnh (Static Memory Pool) để bảo đảm hệ thống hoạt động liên tục 24/7 mà không gặp lỗi OOM (Out Of Memory)."
        ],
        "fatalTraps": [
            "NULL Pointer Dereference: Cố giải tham chiếu con trỏ chưa khởi tạo (*ptr khi ptr == 0x0) dẫn đến ngắt Panic LoadProhibited.",
            "Dangling Pointer (Con trỏ treo): Giải phóng free(ptr) nhưng vẫn tiếp tục dùng ptr, hoặc trỏ vào biến cục bộ trong Stack của hàm đã kết thúc.",
            "Stack Overflow do mảng cục bộ: Khai báo mảng lớn float audio[8000] (32KB) trong Task có Stack 4KB làm ghi đè vùng nhớ lân cận và Crash chip.",
            "Unaligned 32-bit Access: Ép kiểu con trỏ char* tại địa chỉ lẻ (ví dụ 0x3FFB0001) sang uint32_t* khiến phần cứng không thể đọc dữ liệu trong 1 chu kỳ."
        ],
        "codeSnippet": "// 1. Khai báo Struct đóng gói chặt chẽ không byte rác (Packed)\ntypedef struct __attribute__((packed)) {\n    uint32_t timestamp_ms; // 4 bytes\n    int16_t accel_x;       // 2 bytes\n    int16_t accel_y;       // 2 bytes\n    int16_t accel_z;       // 2 bytes\n} IMU_SensorPacket_t;\n\n// 2. Hàm xử lý dữ liệu Zero-Copy bảo vệ ngăn xếp Stack\nvoid process_sensor_stream(const IMU_SensorPacket_t *packet) {\n    if (packet == NULL) return; // Bảo vệ chống NULL pointer\n    printf(\"Time: %lu | AccelX: %d\\n\", packet->timestamp_ms, packet->accel_x);\n}\n\n// 3. Tensor Arena căn lề 16-byte bắt buộc cho Vector SIMD AI\n#define TENSOR_ARENA_SIZE (64 * 1024)\nalignas(16) static uint8_t s_tensor_arena[TENSOR_ARENA_SIZE];",
        "docId": "doc_stage1_memory"
    },
    {
        "stageIndex": 1,
        "title": "Bước 2: Timer Phần Cứng GPTimer & Hàm Ngắt Tốc Độ Cao (ISR)",
        "summary": "Thuật toán Edge AI đòi hỏi tín hiệu đầu vào phải được lấy mẫu cực kỳ ổn định theo thời gian (Deterministic Sampling). GPTimer 54-bit kết hợp ngắt IRAM_ATTR đảm bảo chu kỳ lấy mẫu chính xác từng micro-giây mà không bị jitter do hệ điều hành RTOS gây ra.",
        "coreAnalogy": "Bộ định thời GPTimer như một chiếc đồng hồ bấm giờ nguyên tử phần cứng độc lập. Khi đồng hồ điểm đúng số micro-giây cài sẵn, nó sẽ gõ chuông báo thức (Ngắt ISR). Hàm ngắt ISR như một bác sĩ cấp cứu: chỉ được phép đo nhịp tim rồi gắn cờ chuyển bệnh nhân lên cáng (Deferred Processing), tuyệt đối không được đứng lại giữa phòng cấp cứu để phẫu thuật (chạy FFT/AI) vì sẽ làm tắc nghẽn cả bệnh viện!",
        "hardwareArchitecture": "GPTimer của ESP32-S3 sử dụng bộ đếm 54-bit chạy trên nguồn xung bus APB 80MHz. Thông qua bộ chia tần (Prescaler = 80), mỗi tick đếm ứng với đúng 1.0 micro-giây. Cờ IRAM_ATTR ép trình liên kết Linker đặt mã máy của ISR trọn vẹn trong Internal SRAM0, ngăn chặn hoàn toàn hiện tượng Cache Miss hoặc Crash khi Flash Cache bị vô hiệu hóa.",
        "highlights": [
            "Định Thời Tuyệt Đối (Deterministic Timing): Loại bỏ hiện tượng jitter thời gian so với vTaskDelay(), đảm bảo tần số lấy mẫu âm thanh 16,000 Hz chuẩn xác tới từng micro-giây.",
            "Cờ IRAM_ATTR Bắt Buộc: Bảo vệ hàm ngắt không bị sập nguồn Guru Meditation khi Flash Controller tạm khóa để ghi dữ liệu NVS hoặc cập nhật OTA.",
            "Mô Hình Deferred Processing: Giữ thời gian thực thi của ISR dưới 5 micro-giây bằng cách ủy thác việc tính toán nặng sang Task FreeRTOS thông qua vTaskNotifyGiveFromISR().",
            "Auto-Reload Phần Cứng: Tự động nạp lại giá trị 0 ngay khi chạm ngưỡng Alarm mà không tiêu hao chu kỳ lệnh CPU nào."
        ],
        "fatalTraps": [
            "Quên cờ auto_reload_on_alarm: Timer chỉ kích hoạt ngắt đúng 1 lần đầu tiên rồi đếm tiếp vô tận lên 2^54.",
            "Gọi hàm cấm trong ISR: Sử dụng printf(), malloc(), vTaskDelay() trong ISR làm hệ thống bị treo cứng hoặc reset Watchdog.",
            "Bỏ quên cờ IRAM_ATTR cho hàm callback con: Hàm ISR có cờ IRAM nhưng lại gọi một hàm phụ nằm trên Flash ROM -> Sập nguồn khi Flash bận.",
            "Xung đột biến toàn cục (Race Condition): Chia sẻ biến giữa ISR và Task mà quên khai báo từ khóa volatile."
        ],
        "codeSnippet": "// Hàm ngắt Timer ISR siêu tốc đặt trong SRAM nội\nstatic bool IRAM_ATTR timer_sample_isr(gptimer_handle_t timer, \n                                       const gptimer_alarm_event_data_t *edata, \n                                       void *user_ctx) {\n    BaseType_t high_task_awoken = pdFALSE;\n    TaskHandle_t target_task = (TaskHandle_t)user_ctx;\n\n    // Đánh thức Task xử lý tín hiệu AI bên ngoài\n    vTaskNotifyGiveFromISR(target_task, &high_task_awoken);\n    return (high_task_awoken == pdTRUE);\n}\n\n// Cấu hình GPTimer 1 micro-giây chuẩn ESP-IDF v5.x\nvoid init_sampling_timer(TaskHandle_t ai_task) {\n    gptimer_handle_t gptimer = NULL;\n    gptimer_config_t config = {\n        .clk_src = GPTIMER_CLK_SRC_DEFAULT,\n        .direction = GPTIMER_COUNT_UP,\n        .resolution_hz = 1000000, // 1 MHz = 1us/tick\n    };\n    ESP_ERROR_CHECK(gptimer_new_timer(&config, &gptimer));\n\n    gptimer_alarm_config_t alarm_cfg = {\n        .reload_count = 0,\n        .alarm_count = 62, // 62.5 us ~ 16,000 Hz\n        .flags.auto_reload_on_alarm = true,\n    };\n    gptimer_event_callbacks_t cbs = { .on_alarm = timer_sample_isr };\n    ESP_ERROR_CHECK(gptimer_register_event_callbacks(gptimer, &cbs, ai_task));\n    ESP_ERROR_CHECK(gptimer_set_alarm_action(gptimer, &alarm_cfg));\n    ESP_ERROR_CHECK(gptimer_enable(gptimer));\n    ESP_ERROR_CHECK(gptimer_start(gptimer));\n}",
        "docId": "doc_stage2_timer"
    },
    {
        "stageIndex": 2,
        "title": "Bước 3: Thu Thập Cảm Biến I2C/I2S DMA & Biến Đổi Phổ Số FFT",
        "summary": "Mô hình Edge AI không thể phân loại trực tiếp các con số thô theo thời gian. Dữ liệu sóng âm từ Microphone (I2S DMA) hoặc cảm biến rung động IMU (I2C Burst Read) bắt buộc phải qua khâu lọc số khử nhiễu, nhân cửa sổ Hanning và biến đổi Fourier nhanh (FFT) để trích xuất phổ tần số đặc trưng.",
        "coreAnalogy": "Sóng âm thanh thô giống như một chiếc bánh pizza thập cẩm bị trộn lẫn mọi nguyên liệu. Nếu bạn nếm cả chiếc bánh, bạn không thể biết chính xác có bao nhiêu gram ớt, phô mai hay xúc xích. Thuật toán FFT giống như một cỗ máy thần kỳ tách chiếc bánh ra từng đĩa riêng biệt: đĩa 50Hz (tiếng ù điện lưới), đĩa 120Hz (tiếng rung bạc đạn), đĩa 1000Hz (tiếng kêu bánh răng). Mạng nơ-ron chỉ cần nhìn vào số lượng từng đĩa này là phát hiện được máy móc hỏng hóc!",
        "hardwareArchitecture": "ESP32-S3 trang bị bộ điều khiển Direct Memory Access (DMA) cho ngoại vi I2S. DMA tự động chuyển trực tiếp các byte âm thanh từ bus phần cứng vào RAM theo mô hình Ring Buffer 2 ngăn (Ping-Pong) mà hoàn toàn không tiêu tốn chu kỳ lệnh CPU. Thư viện ESP-DSP tận dụng tập lệnh Vector SIMD thực hiện FFT 512 điểm số thực chỉ trong 0.72 mili-giây (so với 8.5ms nếu viết bằng C thông thường).",
        "highlights": [
            "Kỹ Thuật I2C Burst Read: Đọc một mạch 14 bytes liên tục từ thanh ghi ACCEL_XOUT_H (MPU6050) thay vì phát 6 lệnh đọc rời rạc, giảm 80% tải chiếm dụng bus I2C.",
            "I2S DMA Ping-Pong Buffer: Trong lúc CPU bận rộn tính toán FFT trên Buffer A, DMA độc lập thu âm thanh mới vào Buffer B, không bao giờ rơi rớt một mẫu tín hiệu nào.",
            "Bộ Lọc Thông Thấp Số (EMA Low-Pass Filter): Loại bỏ các gai nhiễu điện áp tần số cao với công thức đệ quy cực nhẹ: y[n] = a*x[n] + (1-a)*y[n-1].",
            "Cửa Sổ Hanning (Hanning Window): Triệt tiêu hiện tượng rò rỉ phổ (Spectral Leakage) sinh ra do vết cắt đột ngột ở 2 đầu khung lấy mẫu 512 điểm.",
            "Tăng Tốc SIMD ESP-DSP: Gọi hàm dsps_fft2r_fc32() thực thi biến đổi phổ Radix-2 tối ưu phần cứng, sẵn sàng nạp 256 dải năng lượng vào Tensor AI."
        ],
        "fatalTraps": [
            "Thiếu điện trở kéo lên (Pull-up Resistor): Bus I2C không thể kéo lên mức cao 3.3V do thiếu trở 4.7k, khiến đường truyền bị treo vô hạn ở trạng thái chờ ACK.",
            "Sai thứ tự Byte (Endianness): Cảm biến IMU gửi byte cao trước (Big-Endian), nếu ghép bit sai sẽ khiến giá trị gia tốc bị đảo lộn hoàn toàn.",
            "Quên nhân cửa sổ Hanning: Các đỉnh tần số trong FFT bị bè to và sinh ra nhiều tần số rác lân cận khiến AI nhận diện sai lệch.",
            "Bộ đệm DMA không căn lề 4-byte: DMA controller yêu cầu buffer nằm ở vùng nhớ Internal SRAM2 và căn lề đúng 4 bytes."
        ],
        "codeSnippet": "// Pipeline xử lý DSP âm thanh chuẩn SIMD trên ESP32-S3\n#include \"esp_dsp.h\"\n#define FFT_POINTS 512\n\nstatic float s_fft_input[FFT_POINTS * 2]; // Mảng số phức xen kẽ (Real, Imag)\nstatic float s_window[FFT_POINTS];\nstatic float s_spectrogram[FFT_POINTS / 2];\n\nvoid init_dsp_unit(void) {\n    dsps_fft2r_init_fc32(NULL, CONFIG_DSP_MAX_FFT_SIZE);\n    dsps_wind_hann_f32(s_window, FFT_POINTS); // Tạo sẵn bảng Hanning\n}\n\nvoid compute_fft_features(const int16_t *raw_pcm) {\n    // 1. Chuẩn hóa và áp dụng cửa sổ Hanning\n    for (int i = 0; i < FFT_POINTS; i++) {\n        s_fft_input[i * 2 + 0] = ((float)raw_pcm[i] / 32768.0f) * s_window[i];\n        s_fft_input[i * 2 + 1] = 0.0f; // Phần ảo = 0\n    }\n    // 2. Thực thi FFT Radix-2 SIMD siêu tốc (~0.72ms)\n    dsps_fft2r_fc32(s_fft_input, FFT_POINTS);\n    dsps_bit_rev2r_fc32(s_fft_input, FFT_POINTS);\n\n    // 3. Tính độ lớn phổ năng lượng (Power Spectrum) cho các bin tần số\n    for (int i = 0; i < FFT_POINTS / 2; i++) {\n        float r = s_fft_input[i * 2 + 0];\n        float im = s_fft_input[i * 2 + 1];\n        s_spectrogram[i] = sqrtf(r * r + im * im);\n    }\n}",
        "docId": "doc_stage3_sensors"
    },
    {
        "stageIndex": 3,
        "title": "Bước 4: Đa Nhiệm FreeRTOS Dual-Core & Đồng Bộ Hóa Hàng Đợi (Queue)",
        "summary": "Tận dụng tối đa sức mạnh của 2 nhân Xtensa LX7 240MHz: Cách ly toàn bộ tác vụ mạng Wi-Fi và I/O cảm biến lên Core 0, dành trọn vẹn 100% tài nguyên tính toán của Core 1 cho mô hình TinyML suy luận thời gian thực mà không bị giật lag.",
        "coreAnalogy": "Một nhà hàng chuyên nghiệp không bao giờ để người đầu bếp vừa phải nấu ăn vừa phải chạy ra bàn chào khách và tính tiền. Core 0 giống như nhân viên phục vụ: chuyên kết nối Wi-Fi, nhận đơn đặt món từ cảm biến và xếp vào hàng đợi Queue. Core 1 giống như đầu bếp trưởng: chỉ tập trung đứng trước bếp nấu (chạy mạng nơ-ron AI) với 100% tốc độ cao nhất mà không bao giờ bị khách làm phiền!",
        "hardwareArchitecture": "ESP32-S3 sở hữu 2 lõi CPU vật lý độc lập (Core 0 PRO_CPU và Core 1 APP_CPU) có bộ nhớ dùng chung (SRAM nội). Hàm xTaskCreatePinnedToCore() cho phép ghim cứng Task vào từng nhân. Cơ chế FreeRTOS Queue truyền nhận dữ liệu an toàn bằng cách sao chép con trỏ (Zero-Copy Pointer Passing). Mutex hỗ trợ giao thức thừa kế mức ưu tiên (Priority Inheritance) chống hiện tượng Đảo Ngược Quyền Ưu Tiên (Priority Inversion).",
        "highlights": [
            "Kiến Trúc Bất Đối Xứng (AMP Dual-Core): Ghim tác vụ thu thập I/O + Wi-Fi lên Core 0, ghim tác vụ suy luận TinyML nặng lên Core 1, loại bỏ hiện tượng tranh chấp CPU.",
            "Hàng Đợi Luồng An Toàn (Thread-Safe Queue): Truyền dữ liệu cảm biến giữa 2 nhân mà không cần dùng biến toàn cục, ngăn chặn 100% lỗi xung đột dữ liệu Race Condition.",
            "Cơ Chế Priority Inheritance Trong Mutex: Tự động nâng mức ưu tiên của Task giữ khóa để giải phóng tài nguyên nhanh chóng, ngăn ngừa nghẽn luồng.",
            "Task Watchdog Timer (TWDT): Kích hoạt bộ giám sát thời gian thực cho từng Task. Nếu một vòng lặp bị kẹt quá 5 giây (Deadlock hoặc Starvation), TWDT sẽ kích hoạt ngắt cảnh báo hoặc khởi động lại chip.",
            "Theo Dõi Stack Watermark: Sử dụng uxTaskGetStackHighWaterMark() để đo chính xác số byte Stack còn dư của mỗi Task, tối ưu kích thước RAM đến từng byte."
        ],
        "fatalTraps": [
            "Khóa Chết (Deadlock): Task A giữ Mutex 1 chờ Mutex 2, Task B giữ Mutex 2 chờ Mutex 1 khiến cả 2 nhân CPU bị đóng băng vĩnh viễn.",
            "Dùng vTaskDelay() thay vì Semaphore trong vòng lặp chờ: CPU lãng phí chu kỳ máy để kiểm tra cờ liên tục thay vì đưa Task vào trạng thái Blocked tiết kiệm năng lượng.",
            "Gửi cả mảng lớn qua Queue: Đẩy struct 32KB vào xQueueSend() làm FreeRTOS phải copy toàn bộ 32KB vào RAM hàng đợi -> Cạn kiệt Heap ngay tức khắc.",
            "Không xóa cờ Watchdog: Tác vụ AI chạy suy luận quá lâu mà không nhường CPU (vTaskDelay(1) hoặc esp_task_wdt_reset()) dẫn đến vi điều khiển bị Watchdog Reset."
        ],
        "codeSnippet": "// 1. Tạo hàng đợi truyền con trỏ (Zero-copy pointer queue)\nstatic QueueHandle_t s_sensor_queue = NULL;\n\nvoid app_main(void) {\n    s_sensor_queue = xQueueCreate(5, sizeof(float *)); // Hàng đợi chứa con trỏ\n\n    // Ghim tác vụ thu thập cảm biến lên Core 0\n    xTaskCreatePinnedToCore(sensor_sampler_task, \"Sampler_C0\", 4096, NULL, 4, NULL, 0);\n\n    // Ghim tác vụ AI suy luận nặng lên Core 1\n    xTaskCreatePinnedToCore(ai_inference_task, \"AI_Core1\", 8192, NULL, 5, NULL, 1);\n}\n\n// 2. Tác vụ AI trên Core 1 chờ dữ liệu từ Queue (Zero CPU usage khi rảnh)\nvoid ai_inference_task(void *pvParam) {\n    float *feature_buffer = NULL;\n    while (1) {\n        if (xQueueReceive(s_sensor_queue, &feature_buffer, portMAX_DELAY) == pdTRUE) {\n            // Thực thi suy luận AI thời gian thực trên Core 1\n            run_tinyml_inference(feature_buffer);\n        }\n    }\n}",
        "docId": "doc_stage4_freertos"
    },
    {
        "stageIndex": 4,
        "title": "Bước 5: Ngăn Xếp Mạng Wi-Fi/MQTT & Phân Vùng Nâng Cấp OTA Hai Ngăn",
        "summary": "Một thiết bị Edge AI hoàn chỉnh phải có khả năng gửi cảnh báo suy luận lên Cloud qua giao thức MQTT siêu nhẹ và cập nhật trọng số mô hình hoặc firmware mới từ xa qua Wi-Fi OTA mà không lo nguy cơ bị biến thành 'cục gạch' (Bricking) khi mất điện giữa chừng.",
        "coreAnalogy": "Kiến trúc nâng cấp Dual-Bank OTA giống như một phi thuyền vũ trụ có 2 khoang lái độc lập (ota_0 và ota_1). Khi đang bay trên quỹ đạo bằng khoang lái số 1, kỹ sư mặt đất truyền bản nâng cấp vào khoang lái số 2. Sau khi kiểm tra toàn bộ buồng lái số 2 nguyên vẹn không tì vết, phi thuyền mới chính thức chuyển quyền điều khiển sang khoang 2. Nếu vừa chuyển sang mà động cơ bị trục trặc, hệ thống tự động giật lùi về khoang 1 (Rollback), đảm bảo phi thuyền không bao giờ rơi!",
        "hardwareArchitecture": "Flash SPI ngoài của ESP32-S3 được quản lý qua bảng phân vùng partitions.csv gồm: bootloader (0x1000), partition table (0x8000), nvs (0x9000), otadata (0xe000), ota_0 (0x10000) và ota_1 (0x210000). Phân vùng otadata lưu trữ 2 sector trạng thái được bảo vệ bằng mã kiểm tra CRC32. Quá trình nâng cấp sử dụng thư viện esp_https_ota xác thực chứng chỉ số X.509 chống tấn công Man-In-The-Middle.",
        "highlights": [
            "Wi-Fi Station Tự Phục Hồi: Xây dựng máy trạng thái bắt sự kiện SYSTEM_EVENT_STA_DISCONNECTED với thuật toán Exponential Backoff tự động kết nối lại khi rớt mạng.",
            "Giao Thức MQTT 3.1.1 Nhẹ & Linh Hoạt: Đóng gói kết quả suy luận AI (nhãn nhạy cảm, độ tin cậy %, độ trễ ms) thành JSON nhỏ gọn gửi lên Broker với cơ chế QoS 1 bảo đảm đến đích.",
            "Bảng Phân Vùng Dual-Bank OTA: Nạp firmware mới vào phân vùng đối ứng mà không chạm vào firmware đang chạy. Vi điều khiển chỉ boot sang phân vùng mới sau khi kiểm tra xong chữ ký số.",
            "Cơ Chế Rollback Tự Động Sống Còn: Sau khi nạp firmware mới, nếu trong 30 giây đầu tiên hệ thống bị Crash hoặc không kết nối được Wi-Fi, bootloader tự động khôi phục lại firmware cũ.",
            "Bảo Mật HTTPS TLS X.509: Nhúng chứng chỉ Root CA vào mã nguồn để kiểm tra tính xác thực của máy chủ phân phối firmware."
        ],
        "fatalTraps": [
            "Quên gọi esp_ota_mark_app_valid_cancel_rollback(): Sau khi nâng cấp thành công, nếu firmware mới không gọi hàm xác nhận này, lần khởi động lại tiếp theo chip sẽ tự động lùi về phiên bản cũ!",
            "Kích thước phân vùng OTA quá nhỏ: Mô hình AI TinyML cộng thêm Wi-Fi Stack làm dung lượng firmware vượt quá dung lượng phân vùng (ví dụ >1.5MB), gây lỗi ghi đè phân vùng lân cận.",
            "Chặn Task Wi-Fi quá lâu: Để một tác vụ tính toán chiếm dụng 100% Core 0 khiến Wi-Fi Driver bị trễ trả lời gói tin Beacon -> Mất kết nối Wi-Fi liên tục.",
            "Lộ khóa bảo mật trong mã nguồn: Lưu mật khẩu Wi-Fi hoặc API Key dạng chuỗi trần thay vì lưu trong phân vùng mã hóa NVS."
        ],
        "codeSnippet": "// Khởi chạy tiến trình nâng cấp firmware OTA an toàn qua HTTPS\n#include \"esp_https_ota.h\"\n#include \"esp_ota_ops.h\"\n\nvoid start_firmware_update(const char *download_url) {\n    esp_http_client_config_t http_config = {\n        .url = download_url,\n        .cert_pem = (const char *)server_root_ca_pem,\n        .timeout_ms = 10000,\n        .keep_alive_enable = true,\n    };\n    esp_https_ota_config_t ota_config = {\n        .http_config = &http_config,\n    };\n    esp_err_t ret = esp_https_ota(&ota_config);\n    if (ret == ESP_OK) {\n        // Nâng cấp thành công -> Khởi động lại để nạp bản mới\n        esp_restart();\n    } else {\n        ESP_LOGE(\"OTA\", \"Nâng cấp thất bại, vẫn an toàn ở bản cũ!\");\n    }\n}\n\n// Trong hàm app_main của firmware mới: Bắt buộc xác nhận để hủy rollback!\nvoid confirm_firmware_stability(void) {\n    esp_ota_mark_app_valid_cancel_rollback();\n}",
        "docId": "doc_stage5_network"
    },
    {
        "stageIndex": 5,
        "title": "Bước 6: Mô Hình AI Trên Edge (TinyML), Lượng Tử Hóa INT8 & TFLite Micro",
        "summary": "Đỉnh cao của hệ thống Edge AI: Chuyển đổi mô hình Deep Learning từ Python sang FlatBuffer siêu nhỏ gọn, lượng tử hóa cố định INT8 giúp giảm 75% RAM/Flash, tận dụng bộ nhân Vector SIMD và thực thi Invoke() suy luận trực tiếp trên vi điều khiển.",
        "coreAnalogy": "Hãy tưởng tượng mô hình AI gốc trên máy tính như một vị giáo sư mang theo 10 chiếc vali sách dày cộp (trọng số Float32 với hàng triệu chữ số thập phân). Chiếc vali này quá nặng để nhét vừa chiếc xe máy nhỏ bé ESP32. Kỹ thuật lượng tử hóa INT8 giống như việc tóm tắt toàn bộ 10 cuốn sách thành một cuốn sổ tay nhỏ bỏ túi: tất cả các con số thập phân phức tạp được rút gọn thành số nguyên từ -128 đến 127. Cuốn sổ tay nhẹ hơn 4 lần, tính nhẩm nhanh hơn gấp 5 lần mà độ chính xác chẩn đoán vẫn đạt 99%!",
        "hardwareArchitecture": "Bộ thông dịch TensorFlow Lite for Microcontrollers (TFLite Micro) hoạt động hoàn toàn không cần hệ điều hành và không cấp phát động. Tất cả các Tensor trung gian, trọng số và đầu ra đều được cấp phát tĩnh trong một mảng byte duy nhất gọi là Tensor Arena. Bộ vi xử lý Xtensa LX7 của ESP32-S3 trang bị tập lệnh mở rộng SIMD 128-bit, thực hiện 16 phép tính nhân cộng dồn (MAC) INT8 trong duy nhất 1 chu kỳ xung nhịp.",
        "highlights": [
            "Công Thức Lượng Tử Hóa INT8 (Affine Quantization): Chuyển đổi số thực r sang số nguyên q với hệ số Scale S và Zero-point Z: q = round(r / S) + Z. Toàn bộ phép nhân ma trận trở thành phép toán số nguyên siêu nhanh.",
            "Tối Ưu Tensor Arena: Tính toán kích thước vừa khít cho Tensor Arena đặt trong Internal SRAM1, tránh lãng phí RAM hoặc lỗi thiếu bộ nhớ khi khởi tạo mô hình.",
            "MicroMutableOpResolver Tiết Kiệm Flash: Chỉ đăng ký đúng các toán tử cần dùng (như Conv2D, FullyConnected, Softmax) thay vì dùng AllOpsResolver, giúp giảm dung lượng nhị phân Flash tới hơn 150KB.",
            "Tăng Tốc Phần Cứng Vector SIMD: Kích hoạt cờ tối ưu hóa ESP-NN trong ESP-IDF, giúp tốc độ suy luận mô hình nhận diện giọng nói (KWS) chỉ tốn ~12 mili-giây.",
            "Đo Lường Độ Trễ & Năng Lượng Thực Tế: Sử dụng esp_timer_get_time() để đo chính xác thời gian tiền xử lý FFT và thời gian Invoke() của mô hình."
        ],
        "fatalTraps": [
            "Thiếu Căn Lề 16-Byte Cho Tensor Arena: alignas(16) bị bỏ quên khiến CPU phát sinh lỗi ngắt phần cứng LoadStoreAlignment khi tập lệnh SIMD cố nạp 128-bit dữ liệu.",
            "Tràn Bộ Nhớ Tensor Arena: Kích thước kTensorArenaSize khai báo nhỏ hơn nhu cầu của các lớp mạng, khiến hàm interpreter->AllocateTensors() trả về thất bại kTfLiteError.",
            "Mất Cân Bằng Độ Lượng Tử Hóa (Quantization Mismatch): Quên chuẩn hóa dữ liệu đầu vào (Input Scaling) khiến các giá trị đưa vào mô hình bị bão hòa ở -128 hoặc 127, làm độ chính xác giảm về 0%.",
            "Sử dụng các toán tử không hỗ trợ: Thiết kế mô hình trên Keras chứa các lớp phức tạp chưa được TFLite Micro hỗ trợ (như một số dạng Attention phức tạp)."
        ],
        "codeSnippet": "// Pipeline suy luận mô hình TinyML chuẩn sản xuất trên ESP32-S3\n#include \"tensorflow/lite/micro/micro_interpreter.h\"\n#include \"tensorflow/lite/micro/micro_mutable_op_resolver.h\"\n#include \"tensorflow/lite/schema/schema_generated.h\"\n#include \"model_data.h\" // Mảng nhị phân mô hình INT8\n\n#define TENSOR_ARENA_SIZE (48 * 1024)\nalignas(16) static uint8_t s_tensor_arena[TENSOR_ARENA_SIZE];\n\nvoid run_tinyml_inference(const float *features) {\n    // 1. Nạp mô hình FlatBuffer\n    const tflite::Model *model = tflite::GetModel(g_model_data);\n\n    // 2. Đăng ký tối thiểu các toán tử cần dùng (Tiết kiệm Flash)\n    static tflite::MicroMutableOpResolver<3> resolver;\n    resolver.AddFullyConnected();\n    resolver.AddRelu();\n    resolver.AddSoftmax();\n\n    // 3. Khởi tạo Interpreter với Tensor Arena căn lề 16-byte\n    static tflite::MicroInterpreter interpreter(model, resolver, s_tensor_arena, TENSOR_ARENA_SIZE);\n    interpreter.AllocateTensors();\n\n    TfLiteTensor *input = interpreter.input(0);\n    // 4. Lượng tử hóa đầu vào từ Float32 sang INT8\n    for (int i = 0; i < input->bytes; i++) {\n        input->data.int8[i] = (int8_t)roundf(features[i] / input->params.scale + input->params.zero_point);\n    }\n\n    // 5. Thực thi suy luận AI thời gian thực\n    int64_t t0 = esp_timer_get_time();\n    interpreter.Invoke();\n    int64_t latency_us = esp_timer_get_time() - t0;\n\n    // 6. Đọc kết quả phân loại\n    TfLiteTensor *output = interpreter.output(0);\n    int8_t best_class = 0;\n    int8_t max_score = -128;\n    for (int i = 0; i < output->dims->data[1]; i++) {\n        if (output->data.int8[i] > max_score) {\n            max_score = output->data.int8[i];\n            best_class = i;\n        }\n    }\n    printf(\"Dự đoán: Lớp %d | Điểm: %d | Độ trễ: %lld us\\n\", best_class, max_score, latency_us);\n}",
        "docId": "doc_stage6_tinyml"
    },
    {
        "stageIndex": 6,
        "title": "Bước 7: Tối Ưu Nguồn Cực Hạn (ULP Co-processor & Deep Sleep)",
        "summary": "Thiết bị Edge AI chạy pin đòi hỏi tối ưu dòng tiêu thụ từ 240mA khi chạy đầy tải xuống dưới 10uA ở chế độ Deep Sleep. Sử dụng bộ đồng xử lý ULP RISC-V đọc cảm biến định kỳ trong lúc CPU chính ngủ hoàn toàn và chỉ đánh thức hệ thống khi phát hiện rung động bất thường.",
        "coreAnalogy": "Hãy tưởng tượng toàn bộ hệ thống ESP32 như một nhà máy khổng lồ. Ban đêm khi không có hàng, bạn không thể bật đèn sáng trưng và để 500 công nhân ngồi chơi (tiêu tốn 240mA làm hết sạch pin sau vài giờ). Chế độ Deep Sleep giống như tắt toàn bộ điện nhà máy và cho công nhân về ngủ, chỉ để lại DUY NHẤT một bác bảo vệ già (bộ đồng xử lý ULP tiêu thụ <150uA) ngồi canh cổng. Bác bảo vệ có thể cầm đồng hồ đo nhịp rung của cổng. Khi có kẻ trộm leo vào (rung động vượt ngưỡng), bác bảo vệ mới bấm chuông báo động đánh thức toàn bộ nhà máy dậy xử lý!",
        "hardwareArchitecture": "ESP32-S3 phân chia các miền nguồn phần cứng độc lập (Power Domains): Core Domain (CPU, SRAM), Wi-Fi/BT Domain, và RTC Domain (RTC Fast SRAM, RTC Slow SRAM, ULP RISC-V, RTC Controller). Khi vào Deep Sleep, Core Domain và Wi-Fi Domain bị ngắt điện hoàn toàn. Bộ vi xử lý phụ ULP RISC-V chạy ở xung nhịp 17.5MHz trong RTC Domain có thể độc lập điều khiển chân GPIO, đọc ADC và giao tiếp I2C.",
        "highlights": [
            "Dòng Tiêu Thụ Deep Sleep < 10 uA: Cho phép thiết bị IoT Edge AI vận hành liên tục từ 3 đến 5 năm chỉ với một viên pin Li-SOCl2 2000mAh.",
            "Bộ Đồng Xử Lý ULP RISC-V Độc Lập: Có thể lập trình bằng ngôn ngữ C, biên dịch và nạp vào vùng nhớ RTC Fast SRAM để giám sát cảm biến khi CPU ngủ.",
            "Bảo Toàn Biến Qua Giấc Ngủ (RTC_DATA_ATTR): Các biến được gắn cờ này sẽ nằm trong RTC Fast SRAM và không bị xóa khi vi điều khiển thức giấc từ Deep Sleep.",
            "Cơ Chế Đánh Thức Đa Dạng (Wakeup Triggers): Hỗ trợ đánh thức bằng ngắt Timer định kỳ, cảm biến ngoài qua ngắt EXT0/EXT1 (nút bấm), hoặc ngắt kích hoạt từ ULP.",
            "Bài Toán Cân Bằng Năng Lượng (Energy Budgeting): Công thức tính dòng tiêu thụ trung bình dựa trên chu kỳ Duty Cycle: I_avg = (T_active * I_active + T_sleep * I_sleep) / (T_active + T_sleep)."
        ],
        "fatalTraps": [
            "Chân GPIO Bị Treo Lơ Lửng (Floating Pins): Trước khi vào Deep Sleep, nếu không cô lập các chân GPIO (rtc_gpio_isolate), dòng rò qua các chân trôi nổi có thể lên tới vài mA, làm cạn kiệt pin trong vài ngày.",
            "Dùng Biến Toàn Cục Bình Thường Để Đếm Số Lần Thức: Khi thức dậy từ Deep Sleep, vi điều khiển khởi động lại từ đầu (Reset Flow). Mọi biến toàn cục thông thường đều bị reset về giá trị ban đầu nếu không có cờ RTC_DATA_ATTR.",
            "Để Wi-Fi Bật Khi Vào Sleep: Quên ngắt kết nối Wi-Fi đúng quy trình khiến chip không thể tắt bộ phát vô tuyến RF, dẫn đến dòng sleep cao bất thường.",
            "Đánh thức quá thường xuyên: Thời gian khởi động lại từ Deep Sleep tốn khoảng 30-50ms ở mức dòng cao. Nếu chu kỳ đánh thức quá ngắn (<1 giây), năng lượng tiêu hao cho việc khởi động lại còn lớn hơn việc duy trì Light Sleep."
        ],
        "codeSnippet": "// 1. Khai báo biến lưu giữ qua giấc ngủ sâu trong RTC SRAM\nRTC_DATA_ATTR static uint32_t s_boot_count = 0;\nRTC_DATA_ATTR static float s_last_vibration = 0.0f;\n\nvoid app_main(void) {\n    s_boot_count++;\n    printf(\"Khởi động lần thứ: %lu | Rung động trước đó: %.2f\\n\", s_boot_count, s_last_vibration);\n\n    // 2. Đọc cảm biến và chạy suy luận AI nhanh\n    s_last_vibration = read_vibration_sensor();\n    if (s_last_vibration > 5.0f) {\n        // Cảnh báo rung động nguy hiểm -> Gửi MQTT lên đám mây\n        send_mqtt_alert(s_last_vibration);\n    }\n\n    // 3. Cô lập các chân ngoại vi tránh dòng rò\n    rtc_gpio_isolate(GPIO_NUM_4);\n    rtc_gpio_isolate(GPIO_NUM_5);\n\n    // 4. Thiết lập ngủ sâu 60 giây và khởi động Deep Sleep\n    printf(\"Đi vào giấc ngủ sâu Deep Sleep trong 60 giây...\\n\");\n    esp_sleep_enable_timer_wakeup(60 * 1000000ULL); // 60 giây\n    esp_deep_sleep_start();\n}",
        "docId": "doc_stage7_lowpower"
    },
    {
        "stageIndex": 7,
        "title": "Bước 8: Tiêu Chuẩn Nghiệm Thu Đồ Án Tốt Nghiệp A+ & Benchmarking",
        "summary": "Một đồ án tốt nghiệp xuất sắc không chỉ dừng lại ở việc chạy demo được, mà phải có số liệu đo đạc khoa học định lượng: bảng so sánh độ trễ (Inference Latency ms), dung lượng RAM chiếm dụng (Memory Footprint), ma trận nhầm lẫn (Confusion Matrix), các chỉ số Precision/Recall/F1 và kiểm thử ổn định 24/7.",
        "coreAnalogy": "Sự khác biệt giữa một bài tập lớn sinh viên nghiệp dư và một đồ án tốt nghiệp kỹ sư đạt điểm A+ giống như sự khác biệt giữa một món đồ chơi tự chế và một sản phẩm thương mại được cấp chứng nhận chất lượng ISO: Món đồ chơi chỉ cần chạy được 1 lần lúc biểu diễn; sản phẩm thương mại phải có biểu đồ đo đạc kiểm định, chứng minh hoạt động chính xác 99% trong phòng thí nghiệm và không bao giờ bị đơ khi cắm điện 7 ngày liên tục!",
        "hardwareArchitecture": "Quy trình kiểm thử hiệu năng phần cứng nhúng tận dụng bộ đếm thời gian chu kỳ esp_timer_get_time() có độ chính xác 1 micro-giây. Phân tích bộ nhớ Heap sử dụng các API chuyên sâu của ESP-IDF: heap_caps_get_free_size(), heap_caps_get_minimum_free_size() (đo đỉnh sử dụng RAM thấp nhất) và kiểm tra dung lượng binary nhị phân từ file map sinh ra bởi Linker.",
        "highlights": [
            "Đo Độ Trễ Định Lượng (Inference Latency Profiling): Tách biệt thời gian của 3 giai đoạn: Thu thập cảm biến (Sensor DMA), Tiền xử lý DSP (FFT/Spectrogram) và Suy luận mô hình (TFLite Invoke).",
            "Đo Đạc Memory Footprint Chuẩn Xác: Ghi nhận kích thước Flash nhị phân (.bin) và theo dõi Heap Watermark trước/sau khi chạy suy luận để chứng minh không bị rò rỉ bộ nhớ (Memory Leak).",
            "Tính Toán Ma Trận Nhầm Lẫn (Confusion Matrix): Đánh giá 4 chỉ số khoa học bắt buộc: Accuracy (Độ chính xác tổng), Precision (Độ chuẩn xác), Recall (Độ thu hồi) và F1-Score trên tập dữ liệu thử nghiệm độc lập.",
            "Thử Nghiệm Độ Bền 24/7 (Soak Stress Testing): Cho thiết bị chạy liên tục 48-72 giờ trong điều kiện nhiệt độ cao, ghi nhận tỷ lệ lỗi gói tin và biểu đồ suy giảm bộ nhớ Heap.",
            "Cấu Trúc Báo Cáo Chuẩn Kỹ Sư: Xây dựng biểu đồ Radar so sánh giải pháp đề xuất với các phương pháp nghiên cứu trước đó về kích thước model, độ trễ và điện năng."
        ],
        "fatalTraps": [
            "Đo Độ Trễ Bằng Lệnh printf: Lệnh printf gửi dữ liệu qua cổng UART tốc độ chậm (115200 baud), việc chèn printf vào giữa các đoạn code đo làm độ trễ bị sai lệch tăng thêm hàng chục mili-giây!",
            "Đánh Giá Mô Hình Bằng Tập Dữ Liệu Huấn Luyện (Data Leakage): Dùng chính dữ liệu đã dùng để train để test, dẫn đến độ chính xác ảo 99% nhưng khi đưa ra môi trường thật thì hoàn toàn không nhận diện được.",
            "Bỏ Qua Heap Watermark: Kiểm tra heap thấy còn trống lúc khởi động, nhưng sau 1000 chu kỳ suy luận thì RAM giảm dần về 0 do rò rỉ bộ nhớ trong vòng lặp.",
            "Thiếu Kiểm Thử Nhiễu Thực Tế: Chỉ thử nghiệm mô hình trong phòng kín yên tĩnh, khi ra hội đồng bảo vệ có tiếng ồn quạt gió và tiếng người nói thì mô hình liên tục phát cảnh báo giả."
        ],
        "codeSnippet": "// Module Benchmarking chuẩn kỹ sư cho đồ án tốt nghiệp\n#include \"esp_timer.h\"\n#include \"esp_heap_caps.h\"\n\ntypedef struct {\n    int64_t dsp_time_us;\n    int64_t ai_time_us;\n    size_t free_heap_start;\n    size_t free_heap_min;\n} BenchmarkReport_t;\n\nBenchmarkReport_t run_comprehensive_benchmark(void) {\n    BenchmarkReport_t rep;\n    rep.free_heap_start = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);\n\n    // 1. Đo giai đoạn tiền xử lý FFT\n    int64_t t0 = esp_timer_get_time();\n    execute_dsp_pipeline();\n    rep.dsp_time_us = esp_timer_get_time() - t0;\n\n    // 2. Đo giai đoạn suy luận mô hình AI\n    int64_t t1 = esp_timer_get_time();\n    execute_tflite_inference();\n    rep.ai_time_us = esp_timer_get_time() - t1;\n\n    // 3. Ghi nhận đỉnh tụt RAM thấp nhất\n    rep.free_heap_min = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);\n\n    printf(\"=== BÁO CÁO HIỆU NĂNG ĐỒ ÁN TỐT NGHIỆP ===\\n\");\n    printf(\"Thời gian tiền xử lý DSP: %lld us (%.2f ms)\\n\", rep.dsp_time_us, rep.dsp_time_us / 1000.0f);\n    printf(\"Thời gian suy luận AI:    %lld us (%.2f ms)\\n\", rep.ai_time_us, rep.ai_time_us / 1000.0f);\n    printf(\"Tổng độ trễ phản hồi:     %.2f ms\\n\", (rep.dsp_time_us + rep.ai_time_us) / 1000.0f);\n    printf(\"RAM tự do ban đầu:        %u bytes\\n\", rep.free_heap_start);\n    printf(\"RAM tự do đỉnh thấp nhất: %u bytes\\n\", rep.free_heap_min);\n    printf(\"RAM tiêu hao tối đa:      %u bytes\\n\", rep.free_heap_start - rep.free_heap_min);\n    return rep;\n}",
        "docId": "doc_stage8_capstone"
    },
    {
        "stageIndex": 8,
        "title": "Bước 9: 10 Bẫy C Kinh Điển Khi Phỏng Vấn Kỹ Sư Nhúng",
        "summary": "Tổng hợp các câu hỏi bẫy C được 100% các công ty nhúng hàng đầu (Bosch, FPT Software, Viettel, Renesas, Ampere, VinFast) sử dụng để lọc ứng viên: từ khóa volatile, căn lề struct padding, bảng con trỏ hàm, phân biệt các biến thể const pointer và thao tác bitwise thanh ghi.",
        "coreAnalogy": "Ngôn ngữ C giống như một con dao mổ cực kỳ sắc bén: trong tay bác sĩ giỏi nó cứu sống bệnh nhân, nhưng chỉ cần sơ sẩy một milimet là nó cắt đứt ngón tay bạn. Các câu hỏi phỏng vấn bẫy C không nhằm kiểm tra bạn có thuộc cú pháp hay không, mà nhằm kiểm tra bạn có nhìn xuyên qua dòng code C để thấy được các thanh ghi CPU và từng bóng bán dẫn trong RAM đang chuyển động như thế nào hay không!",
        "hardwareArchitecture": "Trình biên dịch C (GCC/Clang) với cờ tối ưu hóa (-O2, -O3) liên tục tái cấu trúc mã nguồn, xóa bỏ các biến tưởng như thừa và nạp biến vào thanh ghi CPU nội bộ (Register Cache) thay vì đọc từ RAM. Căn lề bộ nhớ được quyết định bởi độ rộng của Bus dữ liệu CPU (32-bit = 4-byte boundaries). Hiểu sâu kiến trúc phần cứng là chìa khóa duy nhất để giải mã mọi bẫy phỏng vấn.",
        "highlights": [
            "Bẫy 1 - Từ Khóa volatile: Báo cho compiler không được tối ưu hóa thanh ghi vào cache CPU. Bắt buộc dùng cho: thanh ghi ngoại vi phần cứng, biến chia sẻ với ISR, và cờ giữa các Task RTOS.",
            "Bẫy 2 - Struct Padding & Packing: Hiểu cơ chế nạp 4-byte căn lề tự nhiên của CPU 32-bit. Biết cách sắp xếp lại thứ tự biến trong struct để tiết kiệm 33% RAM hoặc dùng __attribute__((packed)).",
            "Bẫy 3 - Mẹo Đọc Ngược Cho const Pointer: Đọc từ phải qua trái để phân biệt tức thì: const int *p (con trỏ trỏ tới dữ liệu hằng) vs int * const p (con trỏ hằng trỏ tới dữ liệu biến đổi).",
            "Bẫy 4 - Bảng Con Trỏ Hàm (Function Pointer Table): Xây dựng máy trạng thái hữu hạn (Finite State Machine) chuyển trạng thái trong 1 chu kỳ máy O(1), loại bỏ hoàn toàn các chuỗi switch-case 50 nhánh cồng kềnh.",
            "Bẫy 5 - Toán Tử Bitwise Thao Tác Thanh Ghi: 4 câu thần chú nằm lòng: Bật bit (|= 1U<<n), Xóa bit (&= ~(1U<<n)), Đảo bit (^= 1U<<n), Kiểm tra bit (if (REG & (1U<<n)))."
        ],
        "fatalTraps": [
            "Vòng lặp vô tận do thiếu volatile: while(!flag) bị compiler tối ưu thành while(true) vì compiler không thấy ai sửa biến flag trong luồng tuần tự, làm vi điều khiển treo cứng.",
            "Kích thước Struct sai lệch khi truyền qua mạng: Struct không có cờ packed được gửi qua CAN Bus khiến bên nhận đọc lệch toàn bộ vị trí các trường dữ liệu do padding bytes.",
            "Tràn số nguyên (Integer Overflow) khi dịch bit: Viết (1 << 31) trên hệ thống dùng số nguyên 32-bit có dấu dẫn đến hành vi bất định Undefined Behavior (Bắt buộc viết 1U << 31).",
            "Bẫy gán con trỏ không tương thích: Ép kiểu con trỏ ngầm định làm mất thuộc tính const, dẫn đến ghi đè vào vùng nhớ Flash ROM chỉ đọc (.rodata) và gây sụp nguồn phần cứng."
        ],
        "codeSnippet": "// 1. Khắc phục bẫy struct padding: Từ 12 bytes giảm còn 8 bytes!\nstruct BadStruct {\n    char a;      // 1 byte (+3 bytes padding rác)\n    int b;       // 4 bytes\n    char c;      // 1 byte (+3 bytes padding rác)\n}; // sizeof = 12 bytes\n\nstruct OptimizedStruct {\n    int b;       // 4 bytes\n    char a;      // 1 byte\n    char c;      // 1 byte (+2 bytes padding)\n}; // sizeof = 8 bytes! Tiết kiệm 33% bộ nhớ\n\n// 2. Bảng con trỏ hàm FSM thực thi O(1) không cần switch-case\ntypedef void (*state_handler_t)(void);\n\nvoid state_idle(void) { /* Chờ cảm biến */ }\nvoid state_sampling(void) { /* Đọc I2C */ }\nvoid state_infer(void) { /* Chạy AI */ }\n\nstatic const state_handler_t fsm_lut[] = {\n    [0] = state_idle,\n    [1] = state_sampling,\n    [2] = state_infer\n};\n\nvoid run_fsm_step(uint8_t state) {\n    if (state < 3) fsm_lut[state](); // Nhảy trực tiếp trong 1 chu kỳ máy!\n}",
        "docId": "doc_stage9_c_interview"
    },
    {
        "stageIndex": 9,
        "title": "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi Trần (Bare-Metal)",
        "summary": "Vượt qua giới hạn của các thư viện đóng gói sẵn (Arduino/HAL): Kỹ sư nhúng thực thụ phải hiểu bản đồ thanh ghi trong Datasheet/Technical Reference Manual, điều khiển ngoại vi bằng con trỏ địa chỉ trần với tốc độ tối đa của phần cứng và nắm vững quy trình khởi động của chip.",
        "coreAnalogy": "Sử dụng thư viện cấp cao (như Arduino digitalWrite) giống như việc bạn gọi đồ ăn qua ứng dụng giao hàng: rất tiện lợi nhưng mất 30 phút và tốn thêm phí dịch vụ. Lập trình thanh ghi trần (Bare-metal) giống như bạn tự tay mở tủ lạnh lấy thức ăn: ngay lập tức và không tốn một đồng phí nào! Khi một xung nhịp của CPU là 4 nano-giây, bạn không thể chấp nhận lãng phí 50 chu kỳ máy chỉ để bật một chân điều khiển!",
        "hardwareArchitecture": "Trong kiến trúc Memory-Mapped I/O của vi điều khiển 32-bit, các ngoại vi (GPIO, Timer, SPI, UART) được ánh xạ trực tiếp vào không gian địa chỉ bộ nhớ như các ô nhớ RAM thông thường. Ví dụ trên ESP32: Thanh ghi GPIO_OUT_W1TS_REG nằm ở địa chỉ vật lý 0x3FF44008. Một lệnh gán con trỏ trần *(volatile uint32_t*)0x3FF44008 = (1U << 2) được biên dịch thành đúng một lệnh Assembly S32I (Store 32-bit), hoàn thành trong 1 chu kỳ xung nhịp (~4.16ns).",
        "highlights": [
            "Truy Cập Thanh Ghi Trực Tiếp (Direct Register Access): Ép kiểu địa chỉ Hexa vật lý thành con trỏ volatile uint32_t* để đọc/ghi thanh ghi với độ trễ tối thiểu.",
            "Cơ Chế Write-1-to-Set (W1TS) và Write-1-to-Clear (W1TC): Cho phép bật hoặc tắt một chân GPIO riêng biệt mà không cần thao tác đọc-sửa-ghi (Read-Modify-Write), loại trừ hoàn toàn Race Condition giữa các ngắt.",
            "Bảng Vector Ngắt (Interrupt Vector Table): Hiểu cách phần cứng tự động tra cứu địa chỉ hàm xử lý ngắt trong bảng vector khi có sự kiện ngoại vi kích hoạt.",
            "Kiến Trúc Bus Matrix (Crossbar Interconnect): Cơ chế điều phối bus cho phép CPU Core 0, CPU Core 1 và bộ điều khiển DMA truy xuất đồng thời các khối RAM khác nhau mà không bị xung đột.",
            "Cấu Trúc Linker Script (.ld): Hiểu rõ cách sắp xếp mã nguồn vào các phân đoạn bộ nhớ: .text (Flash), .rodata (Hằng số), .data (Biến toàn cục khởi tạo) và .bss (Biến toàn cục xóa về 0)."
        ],
        "fatalTraps": [
            "Quên Cấp Xung Clock Cho Ngoại Vi (Clock Gating): Cố ghi vào thanh ghi của Timer hoặc UART khi bộ phận cấp xung ngoại vi chưa được bật trong thanh ghi DPORT/SYSTEM khiến vi điều khiển bị treo cứng ngay lập tức.",
            "Thao Tác Read-Modify-Write Không An Toàn: Dùng REG |= (1 << 2) trên thanh ghi thường khi có ngắt xảy ra ở giữa quá trình đọc và ghi, làm mất dữ liệu của các chân lân cận (Khắc phục: dùng thanh ghi W1TS/W1TC).",
            "Ghi Vào Thanh Ghi Chỉ Đọc (Read-Only Register): Cố ghi vào thanh ghi trạng thái phần cứng gây phát sinh lỗi ngoại lệ bảo vệ bộ nhớ.",
            "Bỏ Quên Từ Khóa volatile Trên Con Trỏ Thanh Ghi: Khiến trình biên dịch tối ưu hóa bỏ qua thao tác ghi lặp lại, không xuất được chuỗi xung phần cứng."
        ],
        "codeSnippet": "// Điều khiển GPIO2 ở cấp độ thanh ghi trần (Tốc độ tối đa phần cứng ~4ns)\n#define DR_REG_GPIO_BASE       0x3FF44000\n#define GPIO_OUT_W1TS_REG      (DR_REG_GPIO_BASE + 0x0008) // Ghi 1 để BẬT\n#define GPIO_OUT_W1TC_REG      (DR_REG_GPIO_BASE + 0x000C) // Ghi 1 để TẮT\n#define GPIO_ENABLE_REG        (DR_REG_GPIO_BASE + 0x0020) // Cấu hình Output\n\nstatic inline void baremetal_gpio_init(uint8_t pin) {\n    // 1. Cấu hình chân làm Output (Ghi 1 vào bit tương ứng)\n    *((volatile uint32_t *)GPIO_ENABLE_REG) |= (1U << pin);\n}\n\nstatic inline void baremetal_gpio_high(uint8_t pin) {\n    // 2. Bật chân lên 3.3V trong đúng 1 chu kỳ lệnh (S32I)\n    *((volatile uint32_t *)GPIO_OUT_W1TS_REG) = (1U << pin);\n}\n\nstatic inline void baremetal_gpio_low(uint8_t pin) {\n    // 3. Kéo chân xuống 0V trong đúng 1 chu kỳ lệnh (S32I)\n    *((volatile uint32_t *)GPIO_OUT_W1TC_REG) = (1U << pin);\n}",
        "docId": "doc_stage10_baremetal"
    },
    {
        "stageIndex": 10,
        "title": "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        "summary": "Khi vi điều khiển không in ra log hoặc bị treo cứng hoàn toàn, lệnh printf trở nên vô dụng. Kỹ sư nhúng bắt buộc phải thành thạo máy phân tích logic (Logic Analyzer) để giải mã các gói tin vật lý, và sử dụng công cụ addr2line giải mã Guru Meditation Crash Dump để định vị chính xác dòng code gây lỗi chỉ trong 5 giây.",
        "coreAnalogy": "Sử dụng printf để tìm lỗi trong hệ thống nhúng giống như bạn chỉ dựa vào lời khai của nhân chứng: họ có thể nói dối, nói chậm, hoặc nếu họ chết bất đắc kỳ tử (chip bị crash) thì bạn hoàn toàn mất dấu vết. Máy phân tích logic và Crash Dump giống như camera giám sát hiện trường và bản khám nghiệm tử thi khoa học: mọi bit dữ liệu trên dây cáp và mọi giá trị trong thanh ghi lúc chết đều được ghi lại nguyên vẹn từng micro-giây, không ai có thể chối cãi!",
        "hardwareArchitecture": "Máy phân tích logic (Logic Analyzer) lấy mẫu điện áp trên các đường truyền tín hiệu số (SCL/SDA, SCK/MOSI/MISO, TX/RX) với tần số lấy mẫu lên tới 24MHz. Khi CPU bị Panic, kiến trúc Xtensa tự động đẩy nội dung của tất cả các thanh ghi nội (PC, PS, A0-A15, EXCVADDR) ra cổng UART trước khi reset chip. Cổng JTAG cung cấp 4 đường tín hiệu (TCK, TMS, TDI, TDO) cho phép can thiệp trực tiếp vào lõi phần cứng của CPU.",
        "highlights": [
            "Bắt Gói Tin Bằng Logic Analyzer (PulseView / Saleae): Giải mã trực quan giao thức I2C/SPI để phát hiện lỗi sai tốc độ Baud, thiếu tín hiệu ACK từ cảm biến, hoặc méo dạng sóng.",
            "Đo Lường Thời Gian Thực Tế (Pulse Width Measurement): Dùng que đo kiểm tra chính xác thời gian thực thi của một đoạn mã nguồn bằng cách lật trạng thái 1 chân GPIO ở đầu và cuối hàm.",
            "Giải Mã Guru Meditation Trong 5 Giây: Sử dụng công cụ addr2line chuyển đổi địa chỉ hexa của thanh ghi Program Counter (PC) thành đúng tên file C và số dòng code gây lỗi.",
            "Phân Loại Các Mã Lỗi Panic Kinh Điển: Nhận diện tức thì ý nghĩa của LoadProhibited (đọc con trỏ NULL), StoreProhibited (ghi vào Flash ROM), InterruptWatchdog (ISR chạy quá lâu).",
            "Debug Phần Cứng JTAG Với OpenOCD & GDB: Thiết lập Hardware Breakpoint để dừng CPU tại vị trí bất kỳ và soi trực tiếp giá trị từng thanh ghi mà không cần nạp lại firmware."
        ],
        "fatalTraps": [
            "Heisenbug Do Dùng printf: Lỗi chỉ xuất hiện khi bỏ printf, và biến mất khi chèn printf vào (do printf làm chậm thời gian thực thi, che giấu mất lỗi tranh chấp luồng Race Condition).",
            "Méo Dạng Sóng I2C Do Điện Dung Ký Sinh: Dây cáp nối cảm biến quá dài tạo điện dung lớn, làm xung nhịp vuông của Clock bị vát tròn thành hình tam giác khiến cảm biến không nhận dạng được bit 1.",
            "Quên Cắm Dây Mass Chung (GND): Cắm que đo Logic Analyzer vào chân tín hiệu nhưng quên nối chân GND giữa mạch đo và máy tính, dẫn đến tín hiệu bị nhiễu loạn hoàn toàn.",
            "Cố Debug JTAG Khi Chân Bị Trùng Với Ngoại Vi Khác: Sử dụng các chân GPIO nối với JTAG (GPIO 19, 20 trên ESP32-S3) cho nút bấm hoặc đèn LED khiến OpenOCD mất kết nối."
        ],
        "codeSnippet": "// 1. Kỹ thuật Toggle GPIO siêu tốc để đo thời gian hàm bằng Logic Analyzer\n#define DEBUG_PIN GPIO_NUM_4\n\nvoid measure_ai_execution_time(void) {\n    gpio_set_level(DEBUG_PIN, 1); // Kéo chân lên HIGH (Bắt đầu đo)\n    \n    // Đoạn mã nguồn cần đo đạc thời gian thực tế\n    run_tinyml_inference(s_input_data);\n    \n    gpio_set_level(DEBUG_PIN, 0); // Kéo chân về LOW (Kết thúc đo)\n    // Quan sát độ rộng xung HIGH trên Logic Analyzer để biết chính xác số micro-giây!\n}\n\n/* 2. Lệnh giải mã Crash Dump trên Terminal máy tính:\nVí dụ log Serial báo lỗi:\nGuru Meditation Error: Core 1 panic'ed (LoadProhibited). Exception was unhandled.\nCore 1 register dump:\nPC      : 0x4200b21a  EXCVADDR: 0x00000000\n\nChạy lệnh addr2line:\n$ xtensa-esp32s3-elf-addr2line -pfia -e build/firmware.elf 0x4200b21a\nKết quả trả về:\n0x4200b21a: process_sensor_stream at main/sensor_app.c:142\n-> Dòng 142 chính là thủ phạm cố đọc con trỏ NULL!\n*/",
        "docId": "doc_stage11_debug"
    },
    {
        "stageIndex": 11,
        "title": "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô & Hàng Không (MISRA C:2012)",
        "summary": "Tiêu chuẩn bắt buộc tại các tập đoàn công nghệ và ô tô hàng đầu (Bosch, VinFast, Aptiv, Continental): Bộ quy tắc viết code C loại bỏ hoàn toàn các lỗ hổng bộ nhớ, ép kiểu ngầm định và con trỏ không an toàn nhằm đảm bảo phần mềm hoạt động bền bỉ, không bao giờ phát sinh lỗi bất định.",
        "coreAnalogy": "Viết code C thông thường giống như lái xe máy không đội mũ bảo hiểm trên đường làng: bạn có thể phóng nhanh, lạng lách tùy thích và thấy rất thoải mái. Viết code chuẩn MISRA C giống như lái chiếc xe đua Công thức 1 trên đường đua quốc tế: bạn bắt buộc phải thắt dây an toàn 5 điểm, đội mũ bảo hiểm đạt chuẩn FIA, tuân thủ từng biển báo tốc độ và có cả đội kỹ thuật kiểm tra từng con ốc. Một sai sót nhỏ trên xe ô tô hay thiết bị y tế có thể trả giá bằng tính mạng con người, do đó MISRA C loại bỏ 100% sự tùy tiện của lập trình viên!",
        "hardwareArchitecture": "Chuẩn MISRA C:2012 được thiết kế dựa trên tiêu chuẩn an toàn chức năng quốc tế ISO 26262 (ASIL-D cho ô tô) và IEC 61508. Chuẩn này giới hạn các tính năng nguy hiểm của ngôn ngữ C bằng cách yêu cầu cấu hình trình biên dịch ở mức nghiêm ngặt nhất (-Wall -Wextra -Werror) và tích hợp các công cụ phân tích mã nguồn tĩnh (Static Analysis: Cppcheck, Clang-Tidy, PC-lint).",
        "highlights": [
            "Quy Tắc Cấm Cấp Phát Động (MISRA Rule 21.3): Nghiêm cấm hoàn toàn malloc(), calloc(), realloc() và free() trong giai đoạn vận hành Runtime. Loại bỏ 100% rủi ro phân mảnh Heap và lỗi OOM.",
            "Quy Tắc Cấm Đệ Quy & Goto (MISRA Rule 17.2 & 15.1): Cấm sử dụng hàm đệ quy để đảm bảo độ sâu của ngăn xếp Stack là cố định và có thể tính toán được từ trước (Static Stack Bounding).",
            "Bắt Buộc Sử Dụng Kiểu Dữ Liệu Rõ Độ Rộng (stdint.h): Cấm dùng kiểu int, long, short nguyên thủy. Phải sử dụng tường minh uint8_t, int16_t, uint32_t để tránh sự khác biệt kích thước giữa các CPU.",
            "Cấm Ép Kiểu Con Trỏ Ngầm Định (MISRA Rule 11.3): Ngăn chặn việc ép kiểu con trỏ tùy tiện giữa các kiểu dữ liệu khác nhau gây lỗi ngoại lệ căn lề phần cứng.",
            "Tích Hợp Phân Tích Tĩnh Tự Động (Static Code Analysis): Thiết lập công cụ Cppcheck quét toàn bộ mã nguồn trước khi biên dịch để phát hiện biến chưa khởi tạo, vùng nhớ bị tràn và dead code."
        ],
        "fatalTraps": [
            "Ép Kiểu Mất Dữ Liệu Ngầm Định (Implicit Type Truncation): Gán một biến uint32_t vào uint16_t mà không ép kiểu tường minh, khiến dữ liệu bị cắt cụt làm sai lệch kết quả đo.",
            "Sử Dụng Biến Cục Bộ Chưa Khởi Tạo: Khai báo uint32_t counter; mà quên gán = 0, khiến biến nhận giá trị rác ngẫu nhiên trên Stack.",
            "Lệnh Switch-Case Thiếu Nhánh default: Viết switch mà không có khối default xử lý các trường hợp ngoại lệ, dẫn đến hệ thống rơi vào trạng thái không xác định khi nhận giá trị lạ.",
            "Quên Kiểm Tra Giá Trị Trả Về Của Hàm (Ignored Return Value): Gọi hàm khởi tạo esp_err_t mà không dùng ESP_ERROR_CHECK() hoặc kiểm tra != ESP_OK."
        ],
        "codeSnippet": "// Ví dụ mã nguồn C tuân thủ nghiêm ngặt các quy tắc an toàn MISRA C:2012\n#include <stdint.h>\n#include <stdbool.h>\n#include \"esp_err.h\"\n\n#define MAX_BUFFER_CAPACITY (128U) // Bắt buộc có hậu tố U (Unsigned)\n\n// Khai báo mảng cấp phát tĩnh cố định - Không dùng malloc (MISRA Rule 21.3)\nstatic uint8_t s_safe_buffer[MAX_BUFFER_CAPACITY];\nstatic uint32_t s_buffer_len = 0U;\n\n// Hàm kiểm tra đầu vào chặt chẽ và trả về mã lỗi tường minh\nesp_err_t safe_buffer_append(const uint8_t *data, const uint32_t len) {\n    // Kiểm tra con trỏ hợp lệ (Phòng chống NULL pointer)\n    if (data == NULL) {\n        return ESP_ERR_INVALID_ARG;\n    }\n    // Kiểm tra tràn bộ đệm (Phòng chống Buffer Overflow)\n    if ((s_buffer_len + len) > MAX_BUFFER_CAPACITY) {\n        return ESP_ERR_NO_MEM;\n    }\n\n    // Sao chép an toàn từng phần tử với kiểu dữ liệu rõ ràng\n    for (uint32_t i = 0U; i < len; i++) {\n        s_safe_buffer[s_buffer_len + i] = data[i];\n    }\n    s_buffer_len += len;\n    return ESP_OK;\n}",
        "docId": "doc_stage12_misra"
    },
    {
        "stageIndex": 12,
        "title": "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        "summary": "Hai giao thức xương sống của ngành công nghiệp tự động hóa và ô tô: Mạng truyền dẫn vi sai kháng nhiễu cực cao CAN Bus 2.0B (TWAI trên ESP32) và giao thức Modbus RTU điều khiển thiết bị hiện trường qua chuẩn vật lý RS485.",
        "coreAnalogy": "Trong nhà máy hoặc trên xe hơi, tiếng ồn điện từ từ động cơ công suất lớn giống như một phòng hòa nhạc rock đinh tai nhức óc. Nếu bạn nói thầm bằng một sợi dây UART thông thường, người ở đầu kia chỉ nghe thấy tiếng hú rác. Truyền dẫn vi sai CAN Bus và RS485 giống như việc hai người dùng bộ đàm chuyên dụng có tính năng khử ồn chủ động: họ truyền cùng lúc 2 tín hiệu đối xứng nhau trên 2 dây xoắn. Khi tiếng ồn môi trường đập vào, nó tác động giống hệt nhau lên cả 2 dây; bộ thu chỉ cần lấy hiệu điện thế giữa 2 dây là tiếng ồn tự động triệt tiêu về 0!",
        "hardwareArchitecture": "ESP32-S3 tích hợp sẵn bộ điều khiển Two-Wire Automotive Interface (TWAI) tương thích chuẩn CAN 2.0B (tốc độ lên tới 1 Mbps). Giao thức CAN hoạt động theo nguyên lý CSMA/CD với cơ chế trọng tài không phá hủy (Non-destructive Bitwise Arbitration) dựa trên ID gói tin. Bộ thu phát ngoại vi (Transceiver như SN65HVD230 cho CAN hoặc MAX485 cho RS485) chuyển đổi mức logic 3.3V sang hiệu điện thế vi sai trên cặp dây xoắn.",
        "highlights": [
            "Nguyên Lý Tín Hiệu Vi Sai (Differential Signaling): Triệt tiêu nhiễu đồng pha (Common-mode Noise) giúp tín hiệu truyền xa hàng trăm mét trong môi trường công nghiệp khắc nghiệt.",
            "Cơ Chế Trọng Tài CAN ID Không Phá Hủy: Nhiều nút mạng có thể cùng truyền tin một lúc; gói tin nào có CAN ID nhỏ hơn (bit 0 mang tính lấn át - Dominant bit) sẽ giành quyền truyền trước mà không làm hỏng gói tin.",
            "Bộ Lọc Phần Cứng Acceptance Filter (Code & Mask): Cấu hình thanh ghi phần cứng để vi điều khiển chỉ nhận đúng các ID khẩn cấp cần thiết, loại bỏ hoàn toàn tải CPU xử lý các gói tin rác trên mạng.",
            "Giao Thức Modbus RTU Qua RS485: Mô hình Master-Slave kinh điển với mã kiểm tra lỗi CRC-16, đọc/ghi các thanh ghi Holding Registers của biến tần, đồng hồ điện năng lượng mặt trời.",
            "Thiết Kế Driver Theo Tầng (Layered Driver Architecture): Tách biệt tầng Hardware Transceiver, tầng Protocol Controller và tầng Ứng dụng để dễ dàng bảo trì và mở rộng."
        ],
        "fatalTraps": [
            "Thiếu Trở Đầu Cuối 120 Ohm (Termination Resistor): Bỏ quên 2 điện trở 120 ohm ở 2 đầu xa nhất của bus CAN khiến sóng tín hiệu bị phản xạ ngược (Signal Reflection) làm méo dạng xung và sinh lỗi nghẽn bus.",
            "Trùng CAN ID Giữa Hai Thiết Bị: Hai thiết bị phát cùng một ID nhưng nội dung dữ liệu khác nhau sẽ phá vỡ cơ chế trọng tài bitwise và làm sập toàn bộ mạng CAN.",
            "Không Chuyển Hướng Chân DE/RE Của Module RS485: RS485 là giao tiếp nửa bán song công (Half-Duplex). Quên kéo chân DE lên HIGH khi phát hoặc quên kéo về LOW khi thu sẽ làm mất gói tin.",
            "Xung Đột Nguồn Mass Khi Kéo Dây Xa: Nối đất giữa hai nhà xưởng có chênh lệch điện thế đất (Ground Potential Difference) lớn làm cháy bộ thu phát CAN/RS485 (Khắc phục: dùng module cách ly quang cách ly từ tính)."
        ],
        "codeSnippet": "// Khởi tạo và truyền nhận dữ liệu CAN Bus (TWAI) chuẩn ô tô trên ESP32-S3\n#include \"driver/twai.h\"\n\nvoid init_can_bus_node(void) {\n    // 1. Cấu hình chân phần cứng và chế độ hoạt động bình thường\n    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(GPIO_NUM_4, GPIO_NUM_5, TWAI_MODE_NORMAL);\n    \n    // 2. Cấu hình tốc độ Baud 500 Kbps chuẩn đoán bệnh ô tô OBD-II\n    twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();\n\n    // 3. Cấu hình bộ lọc phần cứng chỉ nhận ID = 0x120 đến 0x12F\n    twai_filter_config_t f_config = {\n        .acceptance_code = (0x120 << 21),\n        .acceptance_mask = ~(0x00F << 21),\n        .single_filter = true,\n    };\n\n    // 4. Cài đặt và khởi chạy TWAI Driver\n    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));\n    ESP_ERROR_CHECK(twai_start());\n    printf(\"CAN Bus TWAI Node đã sẵn sàng hoạt động ở 500Kbps!\\n\");\n}\n\nvoid send_telemetry_can_frame(int16_t rpm, int8_t temp) {\n    twai_message_t tx_msg = {\n        .identifier = 0x125, // ID thông điệp cảnh báo động cơ\n        .data_length_code = 3,\n        .data = { (uint8_t)(rpm >> 8), (uint8_t)(rpm & 0xFF), (uint8_t)temp },\n        .flags = TWAI_MSG_FLAG_NONE,\n    };\n    twai_transmit(&tx_msg, pdMS_TO_TICKS(50));\n}",
        "docId": "doc_stage13_canbus"
    },
    {
        "stageIndex": 13,
        "title": "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        "summary": "Bước chuyển mình từ một người lập trình nghiệp dư sang kỹ sư firmware chuyên nghiệp: Viết mã nguồn kiểm thử tự động (Unit Test) với framework Unity & CMock, cô lập phần cứng qua tầng trừu tượng HAL và thiết lập đường ống CI/CD tự động build, kiểm tra lỗi trên GitHub Actions.",
        "coreAnalogy": "Lập trình nhúng truyền thống giống như một người thợ may làm một chiếc áo: may xong phải thử lên người mẫu xem có chật không, sửa một đường chỉ thì có thể làm tuột một chiếc cúc áo ở chỗ khác mà không biết. Thiết lập Unit Test và CI/CD giống như một dây chuyền sản xuất tự động: mỗi khi bạn sửa một con ốc, cả một hệ thống robot kiểm định tự động kiểm tra 500 tiêu chuẩn chất lượng trong 3 giây. Nếu có bất kỳ sai lệch nào, dây chuyền lập tức dừng lại báo chuông đỏ, đảm bảo sản phẩm xuất xưởng không bao giờ có lỗi!",
        "hardwareArchitecture": "Framework Unity thực thi các bài kiểm thử mã nguồn C trực tiếp trên máy tính phát triển (Host Machine PC x86_64) mà không cần nạp vào chip phần cứng. Để làm được điều này, kiến trúc phần mềm phải tuân thủ nghiêm ngặt mô hình Hardware Abstraction Layer (HAL). Bộ công cụ CMock tự động đọc các file header C để sinh ra các hàm giả lập (Mock Functions) cho phép mô phỏng việc đọc cảm biến và thanh ghi.",
        "highlights": [
            "Framework Kiểm Thử Chuẩn Công Nghiệp Unity: Cung cấp bộ macro khẳng định phong phú: TEST_ASSERT_EQUAL_INT8(), TEST_ASSERT_FLOAT_WITHIN(), TEST_ASSERT_NOT_NULL().",
            "Thiết Kế Tách Biệt Phần Cứng (HAL): Phân chia mã nguồn thành tầng Thuật toán logic thuần túy (Platform-independent) và tầng Trình điều khiển phần cứng (Hardware Driver) để có thể test 100% trên PC.",
            "Kỹ Thuật Giả Lập Phần Cứng Bằng CMock: Tự động tạo ra các hàm Mock mô phỏng ngoại vi I2C/SPI để kiểm thử cách thuật toán xử lý khi cảm biến trả về giá trị lỗi hoặc mất kết nối.",
            "Tự Động Hóa Đường Ống CI/CD Với GitHub Actions: Thiết lập luồng tự động mỗi khi git push: quét lỗi tĩnh bằng Cppcheck, biên dịch firmware với idf.py build, và chạy toàn bộ Unit Test.",
            "Ngăn Chặn Triệt Để Lỗi Hồi Quy (Regression Bug): Đảm bảo rằng việc thêm một tính năng mới không bao giờ làm hỏng các tính năng cũ đã hoàn thành từ các tháng trước."
        ],
        "fatalTraps": [
            "Viết Code Dính Chặt Với Phần Cứng (Tight Coupling): Gọi trực tiếp các hàm thanh ghi hoặc API của ESP-IDF bên trong thuật toán tính toán, khiến mã nguồn không thể biên dịch được trên máy tính PC.",
            "Khẳng Định So Sánh Bằng Tuyệt Đối Trên Số Thực (Float == Float): Dùng TEST_ASSERT_EQUAL_FLOAT(1.333f, val) bị trượt kiểm thử do sai số làm tròn số thực của dấu phẩy động (Bắt buộc dùng TEST_ASSERT_FLOAT_WITHIN).",
            "Bỏ Quên Hàm tearDown(): Không giải phóng tài nguyên sau mỗi bài test khiến bài test trước làm ảnh hưởng đến dữ liệu của bài test sau (Test pollution).",
            "Đường Ống CI Không Ghim Phiên Bản Toolchain: Viết kịch bản CI dùng lệnh cài esp-idf:latest khiến bản cập nhật mới của thư viện làm gãy toàn bộ tiến trình build cũ."
        ],
        "codeSnippet": "// 1. Module kiểm thử Unit Test cho thuật toán DSP bằng Unity\n#include \"unity.h\"\n#include \"dsp_filter.h\"\n\nvoid setUp(void) {\n    // Khởi tạo môi trường trước mỗi bài test\n}\n\nvoid tearDown(void) {\n    // Dọn dẹp sau mỗi bài test\n}\n\nvoid test_quantization_logic(void) {\n    // Kiểm tra công thức lượng tử hóa INT8: Float 0.0f phải ánh xạ về Zero-Point\n    float input_val = 0.0f;\n    float scale = 0.05f;\n    int8_t zero_point = -10;\n\n    int8_t q = (int8_t)(roundf(input_val / scale) + zero_point);\n    TEST_ASSERT_EQUAL_INT8(-10, q);\n}\n\nvoid test_filter_noise_suppression(void) {\n    // Kiểm tra bộ lọc thông thấp làm mịn xung nhiễu điện áp\n    float clean_output = apply_ema_filter(100.0f, 0.0f, 0.2f);\n    TEST_ASSERT_FLOAT_WITHIN(0.01f, 20.0f, clean_output);\n}\n\nint main(void) {\n    UNITY_BEGIN();\n    RUN_TEST(test_quantization_logic);\n    RUN_TEST(test_filter_noise_suppression);\n    return UNITY_END();\n}\n\n/* 2. File cấu hình GitHub Actions CI/CD (.github/workflows/firmware_ci.yml):\nname: Firmware Automated CI\non: [push, pull_request]\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Static Code Analysis (Cppcheck)\n        run: cppcheck --enable=all --error-exitcode=1 main/\n      - name: Run Host Unit Tests\n        run: make -C test/ run_tests\n      - name: Build ESP-IDF Binary\n        uses: espressif/esp-idf-ci-action@v1\n        with:\n          esp_idf_version: v5.1\n          target: esp32s3\n          path: '.'\n*/",
        "docId": "doc_stage14_unittest"
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
        "title": "Cấu hình GPTimer định thời chính xác micro-giây cho lấy mẫu chu kỳ",
        "stageName": "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        "skill": "Microsecond Hardware GPTimer",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\nTrong các bài toán Edge AI (nhận diện giọng nói 16kHz, chẩn đoán rung động vòng bi 100Hz):\n- Mọi mô hình Deep Learning và thuật toán biến đổi phổ FFT đều dựa trên tiên đề toán học: **Khoảng cách thời gian giữa 2 mẫu liên tiếp phải đều tuyệt đối (Deterministic Sampling)**.\n- Ẩn dụ: Nếu bạn quay một bộ phim 24 khung hình/giây nhưng máy quay giật cục lúc thì 10ms, lúc thì 30ms mới chụp một tấm, khi chiếu lên chuyển động sẽ bị méo mó giật cục. Tương tự, nếu dùng hàm `vTaskDelay()` của FreeRTOS, thời gian chờ bị phụ thuộc vào nhịp Tick của hệ điều hành và sẽ bị sai lệch hàng trăm micro-giây do độ trễ lập lịch (Jitter). Hiện tượng Jitter làm các đỉnh tần số trong FFT bị dịch chuyển sai lệch khiến mạng nơ-ron đoán sai hoàn toàn!\n- ✅ **Giải pháp phần cứng**: GPTimer là bộ định thời phần cứng đếm xung clock độc lập với CPU, đảm bảo độ chính xác tới từng micro-giây mà không bị bất kỳ tác vụ RTOS nào làm sai lệch!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Nguồn xung clock: Chạy trên bus APB tốc độ 80 MHz ($80 \\times 10^6$ xung/giây).\n- Bộ chia tần (Prescaler = 80): Tần số đếm giảm về đúng $1\\text{ MHz}$ (mỗi tick đếm tương ứng đúng $1.0\\text{ }\\mu s$).\n- Thanh ghi đếm 54-bit Counter: Đếm tăng dần từ 0 lên giá trị Alarm.\n- Công thức tính chu kỳ lấy mẫu:\n  $$T = \\frac{1}{f_s}$$\n  Với âm thanh 16,000 Hz: $T = \\frac{1}{16000} = 62.5\\text{ }\\mu s$. Cài đặt Alarm Count = 62 hoặc 63 micro-giây.\n- Chế độ Auto-Reload: Khi bộ đếm bằng ngưỡng Alarm, phần cứng tự động nạp lại giá trị 0 và kích hoạt ngắt ISR ngay tức thì trong 1 chu kỳ máy.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên cờ auto_reload_on_alarm = true:** Sau lần kích hoạt ngắt đầu tiên, timer sẽ đếm tiếp lên vô cùng (tối đa $2^{54}$) và không bao giờ ngắt lại nữa. Hệ thống dừng thu thập cảm biến mà không báo lỗi!\n❌ **Gọi hàm chặn (Blocking API) trong Callback:** Gọi `vTaskDelay()` hoặc `printf()` trong hàm callback của GPTimer làm hệ thống bị treo hoặc sập nguồn Watchdog ngay lập tức.",
        "code": "// Cấu hình GPTimer định thời 1 micro-giây chuẩn ESP-IDF v5.x\n#include \"driver/gptimer.h\"\n#include \"esp_log.h\"\n\nstatic gptimer_handle_t s_gptimer = NULL;\n\nvoid init_deterministic_timer(gptimer_alarm_cb_t alarm_cb, void *user_data) {\n    // 1. Cấu hình nguồn xung và độ phân giải 1MHz (1us/tick)\n    gptimer_config_t timer_config = {\n        .clk_src = GPTIMER_CLK_SRC_DEFAULT,\n        .direction = GPTIMER_COUNT_UP,\n        .resolution_hz = 1000000, // 1 MHz = 1us mỗi tick\n    };\n    ESP_ERROR_CHECK(gptimer_new_timer(&timer_config, &s_gptimer));\n\n    // 2. Cài đặt ngưỡng báo thức và cơ chế tự nạp lại\n    gptimer_alarm_config_t alarm_config = {\n        .reload_count = 0,\n        .alarm_count = 62, // 62.5us ~ 16,000 Hz lấy mẫu âm thanh\n        .flags.auto_reload_on_alarm = true,\n    };\n    gptimer_event_callbacks_t cbs = { .on_alarm = alarm_cb };\n    ESP_ERROR_CHECK(gptimer_register_event_callbacks(s_gptimer, &cbs, user_data));\n    ESP_ERROR_CHECK(gptimer_set_alarm_action(s_gptimer, &alarm_config));\n\n    // 3. Kích hoạt và khởi động bộ định thời\n    ESP_ERROR_CHECK(gptimer_enable(s_gptimer));\n    ESP_ERROR_CHECK(gptimer_start(s_gptimer));\n    ESP_LOGI(\"TIMER\", \"GPTimer 16kHz đã kích hoạt thành công!\");\n}"
},
    "t6": {
        "title": "Lập trình hàm ngắt ISR với cờ IRAM_ATTR thực thi trực tiếp trên SRAM",
        "stageName": "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        "skill": "High-Speed IRAM_ATTR Interrupts",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Mã nguồn C thông thường sau khi biên dịch sẽ nằm trong chip nhớ **External SPI Flash ROM** ngoài chip. Khi CPU thực thi mã này, nó phải đọc qua bộ đệm trung gian **Flash Cache Controller** nằm trong Internal SRAM0.\n- Ẩn dụ: Flash ROM giống như nhà kho chứa sách ở ngoại thành, còn Flash Cache giống như kệ sách trong phòng làm việc. Bình thường CPU chỉ cần với tay lên kệ sách là đọc được. Nhưng khi thủ kho đang bận xếp sách mới (đang nạp OTA hoặc ghi cấu hình NVS), cửa nhà kho bị khóa trái và kệ sách bị đóng lại (Cache Disabled).\n- Nếu đúng lúc đó có chuông báo cháy reo (Ngắt khẩn cấp ISR nổ ra), và kịch bản chữa cháy lại nằm trong cuốn sách chưa kịp lấy ra: CPU cố gắng đọc Flash ROM nhưng Cache đang khóa -> Phần cứng CPU lập tức sập nguồn phát sinh lỗi tử thần:\n  `Guru Meditation Error: Core 0 panic'ed (Cache disabled but cached memory region accessed)`!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Từ khóa `IRAM_ATTR` báo cho trình liên kết Linker ép đặt toàn bộ mã máy của hàm ngắt vào phân đoạn `.iram0.text` trong **Internal SRAM0**.\n- SRAM0 chạy ở tốc độ 1 chu kỳ xung nhịp (~240MHz, khoảng 4.16ns), hoàn toàn độc lập với Flash bus.\n- Nhờ nằm trọn vẹn trong RAM nội bộ, CPU có thể phản hồi ngắt tức thì chỉ sau vài chục nano-giây, an toàn tuyệt đối 100% ngay cả khi Flash đang bận ghi dữ liệu.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Hàm ISR có cờ IRAM_ATTR nhưng gọi một hàm phụ không có cờ IRAM:** Trình biên dịch không báo lỗi, nhưng khi hàm phụ nằm trên Flash bị gọi lúc Flash bận -> Chip bị Panic lập tức!\n❌ **Sử dụng chuỗi hằng số (String Literals) trần:** Chuỗi `printf(\"Alarm!\\n\")` mặc định được lưu trong phân đoạn Flash `.rodata`. Nếu ISR truy cập chuỗi này lúc Cache bị tắt, hệ thống vẫn sẽ crash! Bắt buộc dùng macro `DRAM_STR()` nếu cần chuỗi trong ISR.",
        "code": "// Hàm ngắt Timer ISR lưu trong Internal SRAM siêu tốc\nstatic bool IRAM_ATTR timer_on_alarm_cb(gptimer_handle_t timer, \n                                        const gptimer_alarm_event_data_t *edata, \n                                        void *user_ctx) {\n    BaseType_t high_task_awoken = pdFALSE;\n    TaskHandle_t target_task = (TaskHandle_t)user_ctx;\n\n    // Chỉ thực hiện công việc tối thiểu: Gửi tín hiệu đánh thức tác vụ AI\n    vTaskNotifyGiveFromISR(target_task, &high_task_awoken);\n\n    // Trả về true nếu cần chuyển ngữ cảnh sang Task mức ưu tiên cao ngay tức thì\n    return (high_task_awoken == pdTRUE);\n}"
},
    "t7": {
        "title": "Cơ chế Deferred Processing: Đẩy việc từ ISR sang Task qua Semaphore",
        "stageName": "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        "skill": "Deferred ISR to Task Processing",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trong hệ thống nhúng, hàm ngắt (ISR) có quyền ưu tiên tuyệt đối, nó chặn đứng mọi tác vụ khác kể cả bộ lập lịch của hệ điều hành.\n- Ẩn dụ: Bác sĩ trực phòng cấp cứu chỉ có nhiệm vụ kiểm tra nhanh bệnh nhân (đo mạch trong 5 giây) rồi phân loại chuyển lên giường bệnh để ê-kíp mổ xử lý (Deferred Processing). Nếu bác sĩ trực đứng lại giữa cửa phòng cấp cứu tự tay phẫu thuật suốt 2 tiếng (chạy tính toán FFT hoặc AI), tất cả các bệnh nhân cấp cứu khác đến sau (ngắt Wi-Fi, bàn phím, Watchdog) đều sẽ bị chết vì không ai tiếp nhận!\n- ✅ **Nguyên tắc vàng:** Thời gian thực thi của một hàm ISR bắt buộc phải **nhỏ hơn 5 micro-giây**! Mọi tính toán nặng phải hoãn lại (Deferred) và đẩy sang Task RTOS bên ngoài.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n1. **Bên trong ISR:** Đọc dữ liệu phần cứng tối thiểu, sau đó gọi hàm `vTaskNotifyGiveFromISR()` hoặc `xSemaphoreGiveFromISR()`.\n2. Biến `high_task_awoken` được gán bằng `pdTRUE` nếu Task nhận tín hiệu có mức ưu tiên cao hơn Task đang chạy.\n3. Khi ISR kết thúc, hệ điều hành tự động thực hiện **Chuyển đổi ngữ cảnh (Context Switch)** tức thì để đưa Task xử lý vào chạy ngay lập tức mà không cần chờ hết nhịp Tick.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Dùng API thông thường trong ISR:** Gọi `xSemaphoreGive()` thay vì phiên bản có đuôi `FromISR` (`xSemaphoreGiveFromISR`). Điều này làm hỏng cấu trúc ngăn xếp nội bộ của FreeRTOS và làm sập nguồn hệ thống.\n❌ **Quên kiểm tra cờ high_task_awoken:** Khiến Task xử lý bị hoãn thực thi đến tận nhịp Tick tiếp theo của RTOS (trễ từ 1ms đến 10ms).",
        "code": "// Tác vụ AI bên ngoài tiếp nhận việc từ ISR thông qua Task Notification\nvoid ai_deferred_task(void *pvParameters) {\n    while (1) {\n        // Đưa Task vào trạng thái Blocked (0% CPU) chờ ngắt đánh thức\n        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);\n\n        // Bắt đầu tính toán FFT và suy luận mô hình AI một cách an toàn\n        process_incoming_sensor_window();\n    }\n}\n\n// Khởi tạo Task với mức ưu tiên cao\nvoid start_deferred_pipeline(void) {\n    xTaskCreate(ai_deferred_task, \"AI_Worker\", 4096, NULL, 5, &s_ai_task_handle);\n}"
},
    "t8": {
        "title": "Xử lý triệt tiêu rung phím (Debounce) và chống trượt xung phần cứng",
        "stageName": "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
        "skill": "Hardware & Software Button Debouncing",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Một nút nhấn cơ học được cấu tạo từ 2 lá đồng tiếp xúc. Khi bạn nhấn ngón tay vào nút, dưới góc nhìn hiển vi, hai lá đồng không dính chặt ngay lập tức mà **nảy lên nảy xuống (Bouncing) hàng chục lần** trong khoảng từ 5ms đến 20ms trước khi ổn định.\n- Nếu bạn gắn ngắt cạnh xuống (`GPIO_INTR_NEGEDGE`) cho nút nhấn mà không xử lý chống rung, vi điều khiển với tốc độ 240MHz sẽ ghi nhận **15 đến 20 lần ngắt liên tiếp** chỉ cho 1 cú bấm tay! Hệ thống AI sẽ bị kích hoạt suy luận liên tục làm treo máy.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n1. **Khử rung phần cứng:** Mạch lọc thông thấp RC (R = 10k, C = 100nF) kết hợp cổng logic Schmitt Trigger có độ trễ thời gian $\\tau = R \\cdot C = 1\\text{ ms}$.\n2. **Khử rung phần mềm chuẩn công nghiệp (Software Timer Debounce):**\n   - Khi ngắt cạnh xuống đầu tiên xảy ra: Tạm thời vô hiệu hóa ngắt của chân GPIO này (`gpio_intr_disable`).\n   - Khởi động một Software Timer đếm 20 mili-giây.\n   - Khi Timer hết hạn 20ms: Đọc lại trạng thái chân vật lý. Nếu chân vẫn ở mức LOW -> Xác nhận cú bấm hợp lệ!\n   - Bật lại ngắt của chân GPIO (`gpio_intr_enable`).\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Dùng `vTaskDelay(20)` trong hàm ngắt nút bấm:** Gây crash hệ thống lập tức vì hàm delay không thể chạy trong ngữ cảnh ngắt.\n❌ **Chân nút bấm bị thả nổi (Floating Pin):** Quên bật điện trở kéo lên nội (`GPIO_PULLUP_ENABLE`) khiến chân nhận sóng nhiễu điện từ xung quanh và tự động kích hoạt ngắt giả liên tục.",
        "code": "// Chống rung phím chuẩn mực bằng FreeRTOS Software Timer\n#include \"freertos/timers.h\"\n#include \"driver/gpio.h\"\n\n#define BUTTON_PIN GPIO_NUM_0\nstatic TimerHandle_t s_debounce_timer = NULL;\n\nstatic void debounce_timer_cb(TimerHandle_t xTimer) {\n    // Sau 20ms ổn định, đọc lại trạng thái chân vật lý\n    if (gpio_get_level(BUTTON_PIN) == 0) {\n        ESP_LOGI(\"BTN\", \"Nút nhấn hợp lệ! Bắt đầu kích hoạt AI...\");\n    }\n    // Bật lại ngắt cho chân nút nhấn\n    gpio_intr_enable(BUTTON_PIN);\n}\n\nstatic void IRAM_ATTR button_isr_handler(void *arg) {\n    // Tạm khóa ngắt để bỏ qua các xung nảy tiếp theo\n    gpio_intr_disable(BUTTON_PIN);\n    BaseType_t high_task_awoken = pdFALSE;\n    xTimerStartFromISR(s_debounce_timer, &high_task_awoken);\n}\n\nvoid init_safe_button(void) {\n    s_debounce_timer = xTimerCreate(\"deb_tmr\", pdMS_TO_TICKS(20), pdFALSE, NULL, debounce_timer_cb);\n    gpio_config_t io_conf = {\n        .pin_bit_mask = (1ULL << BUTTON_PIN),\n        .mode = GPIO_MODE_INPUT,\n        .pull_up_en = GPIO_PULLUP_ENABLE, // Kéo lên 3.3V chống trôi nổi\n        .intr_type = GPIO_INTR_NEGEDGE,\n    };\n    gpio_config(&io_conf);\n    gpio_install_isr_service(0);\n    gpio_isr_handler_add(BUTTON_PIN, button_isr_handler, NULL);\n}"
},
    "t9": {
        "title": "Giao tiếp I2C đọc dữ liệu đa trục từ cảm biến chuyển động (MPU6050/LSM6DS3)",
        "stageName": "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        "skill": "I2C Multi-Axis Sensor Communication",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Cảm biến IMU 6 trục xuất dữ liệu gồm 3 trục gia tốc kế và 3 trục vận tốc góc (con quay hồi chuyển). Mỗi trục là một số nguyên có dấu 16-bit gồm 2 bytes: High Byte và Low Byte.\n- Ẩn dụ: Nếu bạn đi siêu thị mua 6 món đồ, cách làm ngớ ngẩn nhất là mỗi lần chỉ lấy 1 món rồi chạy ra quầy thanh toán, sau đó lại quay vào lấy món thứ hai (tốn 6 lần xếp hàng, quẹt thẻ). Kỹ thuật Burst Read giống như việc bạn đẩy một chiếc xe chở hàng, lấy một lượt cả 6 món rồi thanh toán một lần duy nhất!\n- ✅ **Kỹ thuật I2C Burst Read**: Phát 1 lệnh đọc bắt đầu từ thanh ghi `ACCEL_XOUT_H` (địa chỉ `0x3B`) và yêu cầu nhận một mạch **14 bytes liên tục**. Cảm biến tự động tăng con trỏ thanh ghi nội, giảm 80% thời gian chiếm dụng bus I2C!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Bus I2C gồm 2 đường vi sai: SCL (Clock) và SDA (Data). Cả hai đường bắt buộc phải có **điện trở kéo lên 3.3V (Pull-up Resistor)** từ 2.2k đến 4.7k.\n- Tốc độ bus: Chạy ở chế độ Fast Mode 400 kHz ($400,000\\text{ bits/giây}$).\n- Ghép nối dữ liệu: Byte cao nhận trước (Big-Endian), dịch trái 8 bit rồi cộng logic với Byte thấp:\n  $$\\text{accel\\_x} = (\\text{raw}[0] \\ll 8) \\mid \\text{raw}[1]$$\n- Đổi sang gia tốc trọng trường $g$:\n  $$\\text{accel\\_g} = \\frac{\\text{accel\\_raw}}{\\text{Sensitivity Scale Factor}} = \\frac{\\text{accel\\_raw}}{16384.0}$$\n  (Với thang đo $\\pm 2g$).\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Treo cứng đường bus I2C (Bus Lockup):** Khi cảm biến bị reset đột ngột giữa chừng lúc đang kéo chân SDA về LOW, vi điều khiển chờ vô hạn xung ACK. Khắc phục: phát xung 9 xung Clock giả lập trên chân SCL để giải phóng chân SDA trước khi khởi tạo driver.\n❌ **Ghép sai kiểu dữ liệu:** Ép kiểu thành `uint16_t` thay vì `int16_t`, khiến các giá trị gia tốc âm bị biến thành số dương khổng lồ (~65000), phá hủy hoàn toàn mô hình AI.",
        "code": "// Đọc Burst Read 14 bytes từ MPU6050 chuẩn ESP-IDF v5.x\n#include \"driver/i2c.h\"\n\n#define I2C_PORT               I2C_NUM_0\n#define MPU6050_ADDR           0x68\n#define MPU6050_ACCEL_XOUT_H   0x3B\n\nesp_err_t mpu6050_read_all_raw(int16_t *accel, int16_t *gyro) {\n    uint8_t reg = MPU6050_ACCEL_XOUT_H;\n    uint8_t data[14]; // 6 bytes Accel + 2 bytes Temp + 6 bytes Gyro\n\n    // Gửi lệnh ghi địa chỉ thanh ghi bắt đầu, sau đó chuyển sang đọc 14 bytes liên tục\n    esp_err_t ret = i2c_master_write_read_device(\n        I2C_PORT, MPU6050_ADDR, &reg, 1, data, 14, pdMS_TO_TICKS(50));\n    if (ret != ESP_OK) return ret;\n\n    // Ghép các cặp byte thành số nguyên có dấu 16-bit\n    accel[0] = (int16_t)((data[0] << 8) | data[1]); // Accel X\n    accel[1] = (int16_t)((data[2] << 8) | data[3]); // Accel Y\n    accel[2] = (int16_t)((data[4] << 8) | data[5]); // Accel Z\n\n    gyro[0]  = (int16_t)((data[8] << 8) | data[9]);   // Gyro X\n    gyro[1]  = (int16_t)((data[10] << 8) | data[11]); // Gyro Y\n    gyro[2]  = (int16_t)((data[12] << 8) | data[13]); // Gyro Z\n    return ESP_OK;\n}"
},
    "t10": {
        "title": "Thu âm thanh số chất lượng cao qua giao thức I2S kết hợp bộ đệm DMA",
        "stageName": "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        "skill": "I2S Digital Microphone Streaming",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Microphone analog thông thường xuất tín hiệu điện áp millivolt rất yếu, khi đi qua dây dẫn dễ bị sóng cao tần Wi-Fi và xung nguồn xung biến dạng.\n- Microphone kỹ thuật số (như INMP441) tích hợp sẵn bộ tiền khuếch đại, bộ chuyển đổi ADC 24-bit và bộ lọc số ngay bên trong chip silicon, xuất luồng số trực tiếp qua bus I2S (Inter-IC Sound).\n- Ẩn dụ: Nếu CPU phải tự tay đọc từng mẫu âm thanh giống như một nhân viên văn phòng cứ mỗi 60 micro-giây lại phải chạy ra cổng nhận một phong thư (bị ngắt 16,000 lần/giây, không làm nổi việc gì khác). Bộ điều khiển Direct Memory Access (DMA) giống như một băng chuyền tự động: nó tự động gom các phong thư vào thùng hàng trong RAM, khi nào đầy 512 lá thư mới gõ cửa báo CPU ra lấy một lần!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Bus I2S chuẩn gồm 3 đường: BCLK (Bit Clock), WS / LRCLK (Word Select chọn kênh Trái/Phải), và SD / DIN (Serial Data).\n- Tần số Bit Clock:\n  $$f_{BCLK} = f_s \\times \\text{Bits per sample} \\times \\text{Channels}$$\n  Với âm thanh 16kHz, 16-bit, 2 slots: $f_{BCLK} = 16000 \\times 16 \\times 2 = 512,000\\text{ Hz}$.\n- Bộ đệm Ping-Pong DMA: Chia làm 2 hoặc nhiều khối đệm (Descriptive Buffers). Trong lúc DMA đang ghi vào Khối A, CPU thảnh thơi đọc dữ liệu từ Khối B để tính toán FFT.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Sai cấu hình Slot Mask I2S:** Nhiều loại microphone (như INMP441) chỉ xuất dữ liệu ở kênh Trái (Left). Nếu cấu hình nhận kênh Phải (Right), mảng âm thanh nhận về sẽ toàn là số 0!\n❌ **Bộ đệm DMA không căn lề:** Các mảng đệm DMA bắt buộc phải được cấp phát trong phân vùng SRAM nội bộ có cờ `MALLOC_CAP_DMA` và căn lề 4-byte.",
        "code": "// Cấu hình I2S thu âm thanh số INMP441 chuẩn ESP-IDF v5.x\n#include \"driver/i2s_std.h\"\n\nstatic i2s_chan_handle_t s_rx_chan = NULL;\n\nvoid init_i2s_microphone(void) {\n    i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);\n    chan_cfg.dma_desc_num = 4;   // 4 bộ đệm DMA liên hoàn\n    chan_cfg.dma_frame_num = 256; // Mỗi bộ đệm chứa 256 khung mẫu\n    ESP_ERROR_CHECK(i2s_new_channel(&chan_cfg, NULL, &s_rx_chan));\n\n    i2s_std_config_t std_cfg = {\n        .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(16000), // 16 kHz\n        .slot_cfg = I2S_STD_PHILIPS_SLOT_DEFAULT_CONFIG(16, I2S_SLOT_MODE_MONO),\n        .gpio_cfg = {\n            .mclk = I2S_GPIO_UNUSED,\n            .bclk = GPIO_NUM_4,\n            .ws   = GPIO_NUM_5,\n            .din  = GPIO_NUM_6,\n            .dout = I2S_GPIO_UNUSED,\n            .invert_flags = { .mclk_inv = false, .bclk_inv = false, .ws_inv = false },\n        },\n    };\n    ESP_ERROR_CHECK(i2s_channel_init_std_mode(s_rx_chan, &std_cfg));\n    ESP_ERROR_CHECK(i2s_channel_enable(s_rx_chan));\n}"
},
    "t11": {
        "title": "Xây dựng bộ lọc số thông thấp (Low-pass Filter) làm mịn tín hiệu",
        "stageName": "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        "skill": "Digital Signal Noise Filtering",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Mọi tín hiệu cảm biến trong môi trường thực tế đều bị bám theo bởi các xung nhiễu điện áp: nhiễu điện lưới 50Hz, rung động cơ khí cao tần hoặc nhiễu trắng nhiệt của linh kiện.\n- Ẩn dụ: Nếu bạn nhìn một người đang đi bộ trên đường qua một tấm kính rung lắc bần bật, bạn rất khó đoán hướng đi của họ. Bộ lọc thông thấp giống như việc ổn định khung hình: nó loại bỏ các rung lắc hỗn loạn nhanh chóng (tần số cao) để giữ lại quỹ đạo di chuyển thực sự (tần số thấp).\n- ✅ **Bộ lọc trung bình động số mũ (Exponential Moving Average - EMA)**: Giải pháp lọc tín hiệu số nhẹ nhất cho vi điều khiển: không cần lưu trữ mảng lịch sử dài hàng trăm phần tử, chỉ tốn đúng 2 phép nhân và 1 phép cộng!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Công thức sai phân đệ quy bậc 1:\n  $$y[n] = \\alpha \\cdot x[n] + (1 - \\alpha) \\cdot y[n-1]$$\n  Trong đó:\n  + $x[n]$: Giá trị đo thô hiện tại từ cảm biến.\n  + $y[n-1]$: Giá trị ngõ ra đã lọc của chu kỳ trước đó.\n  + $y[n]$: Giá trị ngõ ra đã lọc của chu kỳ hiện tại.\n  + $\\alpha \\in (0, 1)$: Hệ số làm mượt.\n- Mối liên hệ với tần số cắt $f_c$ và chu kỳ lấy mẫu $\\Delta t$:\n  $$\\alpha = \\frac{2\\pi f_c \\Delta t}{2\\pi f_c \\Delta t + 1}$$\n  Nếu $\\alpha$ càng nhỏ (ví dụ 0.05), khả năng lọc nhiễu càng mạnh nhưng tín hiệu sẽ có độ trễ pha (Lag).\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Khởi tạo biến ngõ ra ban đầu bằng 0.0f:** Khi hệ thống vừa bật nguồn, nếu tín hiệu thực là 100.0f, giá trị lọc sẽ mất hàng chục chu kỳ mới từ từ bò từ 0 lên 100, tạo ra một đoạn dữ liệu khởi động giả tạo làm AI nhận diện sai. Khắc phục: gán $y[0] = x[0]$ ngay ở mẫu đo đầu tiên!\n❌ **Sử dụng số thực Float trên chip không có FPU:** ESP32-S3 có FPU phần cứng nên tính toán Float32 rất nhanh. Tuy nhiên, nếu trên các dòng chip giá rẻ không có FPU, phải chuyển đổi công thức sang Fixed-Point số nguyên để tránh làm chậm hệ thống.",
        "code": "// Cấu trúc và hàm thực thi bộ lọc EMA chuẩn nhúng\ntypedef struct {\n    float alpha;\n    float prev_output;\n    bool initialized;\n} EMA_LowPassFilter_t;\n\nvoid ema_filter_init(EMA_LowPassFilter_t *f, float alpha) {\n    if (!f) return;\n    f->alpha = alpha;\n    f->prev_output = 0.0f;\n    f->initialized = false;\n}\n\nfloat ema_filter_apply(EMA_LowPassFilter_t *f, float raw_sample) {\n    if (!f) return raw_sample;\n    if (!f->initialized) {\n        f->prev_output = raw_sample; // Khởi tạo bằng mẫu đầu tiên\n        f->initialized = true;\n        return raw_sample;\n    }\n    // y[n] = alpha * x[n] + (1 - alpha) * y[n-1]\n    f->prev_output = f->alpha * raw_sample + (1.0f - f->alpha) * f->prev_output;\n    return f->prev_output;\n}"
},
    "t12": {
        "title": "Áp dụng biến đổi Fourier nhanh (FFT) trích xuất đặc trưng phổ tần số",
        "stageName": "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
        "skill": "Normalization & FFT Feature Extraction",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Mạng nơ-ron không thể học được các quy luật trừu tượng nếu bạn chỉ đưa cho nó một chuỗi 512 con số dao động biên độ theo thời gian.\n- Ẩn dụ: Nếu nghe một bản hợp âm piano, tai người không đếm từng dao động của màng nhĩ, mà não bộ tự động phân tách bản hợp âm thành các nốt nhạc: Nốt Đồ (261Hz), Nốt Mi (329Hz), Nốt Sol (392Hz). Thuật toán FFT chính là đôi tai thần kỳ của vi điều khiển: nó bóc tách sóng tín hiệu phức tạp thành danh sách các tần số thành phần cấu thành!\n- Kết hợp với **Cửa sổ Hanning (Hanning Window)** để triệt tiêu hiện tượng rò rỉ phổ (Spectral Leakage) sinh ra do vết cắt đột ngột ở 2 đầu khung dữ liệu.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n1. Nhân mảng dữ liệu 512 mẫu với hàm cửa sổ Hanning:\n   $$w[n] = 0.5 - 0.5 \\cdot \\cos\\left(\\frac{2\\pi n}{N - 1}\\right)$$\n2. Thực thi thuật toán biến đổi Fourier nhanh Radix-2 phức (Radix-2 Complex FFT):\n   $$X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot e^{-j \\frac{2\\pi}{N} kn}$$\n   Độ phức tạp tính toán giảm từ $O(N^2)$ xuống còn $O(N \\log_2 N)$.\n3. Tính phổ năng lượng (Power Spectrum) cho $N/2 = 256$ dải tần:\n   $$P[k] = \\sqrt{\\text{Real}[k]^2 + \\text{Imag}[k]^2}$$\n4. Thư viện ESP-DSP của Espressif tận dụng tập lệnh Vector SIMD thực hiện FFT 512 điểm chỉ trong **0.72 mili-giây**!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Kích thước mảng không phải là lũy thừa của 2:** Thuật toán Radix-2 FFT bắt buộc $N$ phải là $2^m$ (128, 256, 512, 1024). Nếu truyền $N = 500$, thuật toán sẽ truy cập tràn mảng bộ nhớ và gây crash.\n❌ **Quên sắp xếp lại bit (Bit Reversal):** Sau khi tính FFT, mảng kết quả bị xáo trộn thứ tự bit; bắt buộc phải gọi hàm `dsps_bit_rev2r_fc32()` để đưa các tần số về đúng trật tự từ thấp đến cao.",
        "code": "// Quy trình trích xuất phổ tần số FFT bằng ESP-DSP\n#include \"esp_dsp.h\"\n#include <math.h>\n\n#define N_FFT 512\nstatic float s_complex_buf[N_FFT * 2]; // Mảng số phức xen kẽ (Real, Imag)\nstatic float s_hanning_win[N_FFT];\nstatic float s_features[N_FFT / 2];\n\nvoid init_fft_module(void) {\n    dsps_fft2r_init_fc32(NULL, CONFIG_DSP_MAX_FFT_SIZE);\n    dsps_wind_hann_f32(s_hanning_win, N_FFT);\n}\n\nvoid extract_fft_features(const int16_t *pcm_audio) {\n    // 1. Chuẩn hóa và áp dụng cửa sổ Hanning\n    for (int i = 0; i < N_FFT; i++) {\n        s_complex_buf[i * 2 + 0] = ((float)pcm_audio[i] / 32768.0f) * s_hanning_win[i];\n        s_complex_buf[i * 2 + 1] = 0.0f; // Phần ảo = 0\n    }\n\n    // 2. Chạy FFT Radix-2 SIMD siêu tốc (~0.72ms)\n    dsps_fft2r_fc32(s_complex_buf, N_FFT);\n    dsps_bit_rev2r_fc32(s_complex_buf, N_FFT);\n\n    // 3. Tính độ lớn phổ năng lượng (Magnitude)\n    for (int i = 0; i < N_FFT / 2; i++) {\n        float r = s_complex_buf[i * 2 + 0];\n        float im = s_complex_buf[i * 2 + 1];\n        s_features[i] = sqrtf(r * r + im * im);\n    }\n}"
},
    "t13": {
        "title": "Ghim tác vụ FreeRTOS (Task Pinning) tận dụng độc lập 2 nhân ESP32-S3",
        "stageName": "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        "skill": "Dual-Core Asymmetric Task Pinning",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- ESP32-S3 được trang bị 2 lõi vi xử lý vật lý Xtensa LX7 32-bit:\n  + **Core 0 (PRO_CPU):** Mặc định quản lý toàn bộ các giao thức mạng phức tạp (Wi-Fi, Bluetooth LE), bộ điều khiển Flash Cache và các ngắt ngoại vi.\n  + **Core 1 (APP_CPU):** Hoàn toàn tự do cho logic ứng dụng của người dùng.\n- Ẩn dụ: Nếu bạn có một chiếc xe tải 2 động cơ, một động cơ chuyên dùng để chạy máy lạnh và còi báo động, động cơ còn lại dùng để kéo hàng. Nếu bạn gom toàn bộ việc kéo hàng nặng (chạy AI) đè lên động cơ máy lạnh, xe sẽ bị chết máy và còi sẽ tắt ngúm (mất mạng Wi-Fi).\n- ✅ **Cơ chế Asymmetric Pinning:** Sử dụng hàm `xTaskCreatePinnedToCore()` để ghim chặt tác vụ thu thập cảm biến + truyền Wi-Fi lên Core 0, và dành trọn vẹn 100% năng lực xử lý của Core 1 cho mô hình TinyML suy luận thời gian thực!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Bộ lập lịch FreeRTOS của Espressif là phiên bản chỉnh sửa đa nhân (SMP - Symmetric Multiprocessing).\n- Tham số `xCoreID`:\n  + `0`: Ghim cứng Task vào Core 0.\n  + `1`: Ghim cứng Task vào Core 1.\n  + `tskNO_AFFINITY`: Để FreeRTOS tự do luân chuyển Task giữa 2 nhân (KHÔNG NÊN DÙNG cho tác vụ AI).\n- Phân chia mức ưu tiên (Task Priorities): Tác vụ AI trên Core 1 nên đặt mức ưu tiên cao (ví dụ Priority 5) để không bị ngắt quãng bởi các tiến trình nền.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Kích thước Stack cho tác vụ AI quá nhỏ:** Thư viện TensorFlow Lite Micro và các phép tính ma trận cần không gian ngăn xếp lớn. Khai báo Stack 2048 bytes sẽ gây sập nguồn **Stack Overflow Crash**. Tác vụ AI bắt buộc phải cấp phát từ **8192 bytes** trở lên!\n❌ **Ghim tác vụ AI vào Core 0:** Khi mô hình AI tính toán chiếm 100% Core 0 trong 20ms, Wi-Fi Driver không kịp trả lời gói tin Beacon của Router, dẫn đến thiết bị liên tục bị ngắt kết nối Wi-Fi.",
        "code": "// Phân chia 2 nhân độc lập chuẩn kiến trúc AMP trên ESP32-S3\n#include \"freertos/FreeRTOS.h\"\n#include \"freertos/task.h\"\n\nvoid network_io_task(void *pvParam) {\n    while (1) {\n        // Thu thập cảm biến và gửi bản tin mạng trên Core 0\n        vTaskDelay(pdMS_TO_TICKS(100));\n    }\n}\n\nvoid ai_inference_task(void *pvParam) {\n    while (1) {\n        // Chạy suy luận Deep Learning tối đa tốc độ trên Core 1\n        run_tinyml_inference_step();\n    }\n}\n\nvoid app_main(void) {\n    // Ghim tác vụ IO/Mạng vào Core 0 (Stack 4KB, Priority 3)\n    xTaskCreatePinnedToCore(network_io_task, \"Net_C0\", 4096, NULL, 3, NULL, 0);\n\n    // Ghim tác vụ AI vào Core 1 (Stack 8KB, Priority 5)\n    xTaskCreatePinnedToCore(ai_inference_task, \"AI_C1\", 8192, NULL, 5, NULL, 1);\n}"
},
    "t14": {
        "title": "Truyền dữ liệu cảm biến sang tác vụ suy luận qua FreeRTOS Queue đệm an toàn",
        "stageName": "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        "skill": "Thread-Safe FreeRTOS Data Queues",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Khi Core 0 thu thập dữ liệu cảm biến và Core 1 chạy mô hình AI, nếu hai nhân cùng đọc và ghi vào một mảng biến toàn cục chung, thảm họa **Race Condition (Xung đột dữ liệu)** sẽ xảy ra: Core 1 đang đọc dở nửa mảng thì Core 0 nhảy vào ghi đè nửa mảng mới, khiến khung dữ liệu bị chắp vá què cụt!\n- Ẩn dụ: Queue giống như hòm thư bưu điện có khóa an toàn. Người đưa thư (Core 0) bỏ thư vào hòm rồi khóa lại. Người nhận thư (Core 1) đến mở khóa lấy từng bức thư theo đúng thứ tự gửi (FIFO). Cả hai không bao giờ giằng co phong thư trên tay nhau!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Hàng đợi FreeRTOS Queue được thiết kế an toàn luồng tuyệt đối (Thread-Safe) nhờ các khóa ngắt nội bộ (Critical Sections).\n- **Kỹ thuật truyền con trỏ Zero-Copy (Pointer Queue):**\n  Nếu mỗi khung dữ liệu cảm biến là một mảng 512 số thực (2,048 bytes), truyền trực tiếp mảng qua Queue sẽ tốn rất nhiều RAM và chu kỳ CPU. Thay vào đó, ta chỉ truyền **Địa chỉ con trỏ 4 byte**:\n  ```c\n  QueueHandle_t q = xQueueCreate(5, sizeof(float *)); // Chỉ tốn 20 bytes!\n  ```\n- Khi rảnh rỗi không có dữ liệu, tác vụ AI tự động rơi vào trạng thái **Blocked (0% tiêu thụ CPU)** nhờ tham số `portMAX_DELAY`.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Hàng đợi bị tràn (Queue Overflow):** Tác vụ AI suy luận quá chậm (50ms) trong khi cảm biến gửi mẫu quá nhanh (10ms). Hàng đợi đầy và lệnh `xQueueSend()` trả về `errQUEUE_FULL`. Khắc phục: cân bằng tần số lấy mẫu hoặc tăng độ dài hàng đợi.\n❌ **Tái sử dụng vùng nhớ trước khi đọc xong (Use-After-Free / Data Corruption):** Task gửi tái sử dụng ngay mảng đệm trong khi Task nhận chưa kịp xử lý xong.",
        "code": "// Triển khai Hàng đợi truyền con trỏ an toàn giữa 2 nhân\n#include \"freertos/queue.h\"\n\n#define FEATURE_LEN 256\nstatic QueueHandle_t s_feature_queue = NULL;\n\nvoid sensor_producer_task(void *pvParam) {\n    while (1) {\n        // Cấp phát một bộ đệm đặc trưng từ Static Memory Pool\n        float *features = get_free_feature_buffer();\n        collect_and_compute_fft(features);\n\n        // Gửi địa chỉ con trỏ vào hàng đợi\n        if (xQueueSend(s_feature_queue, &features, pdMS_TO_TICKS(10)) != pdTRUE) {\n            ESP_LOGW(\"QUEUE\", \"Hàng đợi đầy! Bỏ qua khung dữ liệu này.\");\n            recycle_feature_buffer(features);\n        }\n        vTaskDelay(pdMS_TO_TICKS(50));\n    }\n}\n\nvoid ai_consumer_task(void *pvParam) {\n    float *recv_features = NULL;\n    while (1) {\n        // Chờ nhận con trỏ từ Queue (Tự động ngủ 0% CPU khi rảnh)\n        if (xQueueReceive(s_feature_queue, &recv_features, portMAX_DELAY) == pdTRUE) {\n            run_tinyml_model(recv_features);\n            recycle_feature_buffer(recv_features); // Giải phóng sau khi dùng xong\n        }\n    }\n}"
},
    "t15": {
        "title": "Đồng bộ hóa tài nguyên phần cứng dùng chung bằng Mutex & Semaphore",
        "stageName": "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        "skill": "Hardware Mutex & Priority Inversion Prevention",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trong hệ thống nhúng, nhiều tác vụ thường phải dùng chung một tài nguyên vật lý duy nhất (ví dụ: bus I2C nối với cả màn hình OLED và cảm biến IMU, hoặc cổng UART Serial in log).\n- Ẩn dụ: Chiếc chìa khóa phòng vệ sinh công cộng. Chỉ ai cầm chìa khóa trong tay mới được vào phòng (Take Mutex). Người đến sau dù có là Tổng giám đốc (Task mức ưu tiên cao) cũng bắt buộc phải đứng ngoài cửa chờ người bên trong bước ra trả chìa khóa (Give Mutex).\n- Nếu không có Mutex bảo vệ, hai tác vụ cùng phát lệnh I2C cùng lúc sẽ làm xung đột các bit dữ liệu, làm tê liệt đường bus.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- **Khác biệt sống còn giữa Mutex và Binary Semaphore:**\n  + Mutex có **Quyền sở hữu (Ownership)**: Chỉ Task nào đã Take thành công mới có quyền Give mở khóa.\n  + Mutex tích hợp cơ chế **Kế thừa mức ưu tiên (Priority Inheritance)**: Khi Task Low giữ khóa và làm Task High bị nghẽn, FreeRTOS tự động nâng tạm thời mức ưu tiên của Task Low lên bằng Task High, giúp Task Low chạy nhanh để trả khóa, triệt tiêu hiện tượng Đảo ngược quyền ưu tiên!\n- Luôn sử dụng thời gian chờ Timeout có giới hạn (`pdMS_TO_TICKS(100)`) thay vì chờ vô hạn `portMAX_DELAY` để phát hiện sự cố.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Sử dụng Mutex bên trong hàm ngắt ISR:** Mutex có cơ chế chờ và thừa kế quyền ưu tiên, hoàn toàn không tương thích với ngữ cảnh ngắt. Gọi `xSemaphoreTake(mutex)` trong ISR sẽ làm sập nguồn hệ thống ngay tức thì.\n❌ **Khóa Chết (Deadlock):** Task 1 giữ Khóa A chờ Khóa B; Task 2 giữ Khóa B chờ Khóa A. Cả hai Task đóng băng vĩnh viễn! Quy tắc vàng: Luôn chiếm giữ các khóa theo cùng một thứ tự bảng chữ cái cố định.",
        "code": "// Sử dụng Mutex bảo vệ bus I2C dùng chung giữa 2 tác vụ\n#include \"freertos/semphr.h\"\n\nstatic SemaphoreHandle_t s_i2c_mutex = NULL;\n\nvoid init_shared_bus(void) {\n    s_i2c_mutex = xSemaphoreCreateMutex();\n}\n\nesp_err_t safe_i2c_transaction(uint8_t dev_addr, const uint8_t *write_buf, size_t write_len) {\n    // 1. Chờ xin quyền chiếm giữ bus I2C với timeout 50ms\n    if (xSemaphoreTake(s_i2c_mutex, pdMS_TO_TICKS(50)) == pdTRUE) {\n        // Thực hiện giao tiếp I2C an toàn không bị ai tranh chấp\n        esp_err_t ret = i2c_master_write_to_device(I2C_NUM_0, dev_addr, write_buf, write_len, pdMS_TO_TICKS(20));\n\n        // 2. Bắt buộc giải phóng khóa để các Task khác sử dụng\n        xSemaphoreGive(s_i2c_mutex);\n        return ret;\n    } else {\n        ESP_LOGE(\"I2C\", \"Không thể lấy Mutex, bus đang bị chiếm dụng!\");\n        return ESP_ERR_TIMEOUT;\n    }\n}"
},
    "t16": {
        "title": "Cấu hình Task Watchdog Timer (TWDT) phát hiện và tự phục hồi khi treo Task",
        "stageName": "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        "skill": "Task Watchdog Timer (TWDT) & Recovery",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trong môi trường công nghiệp hoạt động 24/7, một thiết bị IoT Edge AI có thể bị treo bất ngờ do: khóa chết Deadlock giữa các tác vụ, vòng lặp `while` chờ cảm biến hỏng không có timeout, hoặc tác vụ AI bị ngốn 100% CPU không chịu nhường luồng (Starvation).\n- Ẩn dụ: Watchdog Timer (Chó canh cổng) là một người bảo vệ cầm chiếc đồng hồ đếm ngược 5 giây. Nhiệm vụ của mỗi tác vụ là cứ trước khi đồng hồ điểm hết 5 giây, phải chạy ra ấn nút xóa cờ (\"cho chó ăn\" - Kick the dog). Nếu sau 5 giây không thấy tác vụ nào ra ấn nút (chứng tỏ tác vụ đó đã bị ngất/treo cứng), Chó canh cổng lập tức bấm còi báo động và giật cầu dao khởi động lại toàn bộ vi điều khiển!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- ESP-IDF tích hợp sẵn 2 loại Watchdog:\n  1. **Interrupt Watchdog (IWDT):** Giám sát các hàm ngắt ISR xem có chạy quá thời gian cho phép hay không.\n  2. **Task Watchdog Timer (TWDT):** Giám sát các tác vụ FreeRTOS được đăng ký.\n- Cấu hình TWDT thông qua cấu trúc `esp_task_wdt_config_t`:\n  + `timeout_ms`: Thời gian đếm ngược (thường từ 3000ms đến 5000ms).\n  + `idle_core_mask`: Tự động giám sát cả tác vụ rảnh rỗi (Idle Task) của Core 0 và Core 1.\n  + `trigger_panic`: Đặt `true` để tự động khởi động lại chip khi có Task bị treo.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Vòng lặp AI tính toán quá lâu mà không xóa cờ:** Mô hình mạng nơ-ron nặng tính toán mất 6 giây, trong khi TWDT cài đặt timeout 5 giây -> Chip bị Watchdog Reset liên tục dù code không có lỗi logic! Khắc phục: chèn lệnh `esp_task_wdt_reset()` vào giữa các lớp nơ-ron hoặc tăng timeout lên 10 giây.\n❌ **Đăng ký Task vào TWDT nhưng quên hủy khi Task kết thúc:** Tác vụ gọi `vTaskDelete()` mà không gọi `esp_task_wdt_delete()`, khiến TWDT vẫn đếm ngược chờ Task đã chết và kích hoạt Panic vô lý.",
        "code": "// Cấu hình Task Watchdog Timer chuẩn ESP-IDF v5.x\n#include \"esp_task_wdt.h\"\n\nvoid ai_monitored_task(void *pvParam) {\n    // 1. Đăng ký Task hiện tại vào danh sách theo dõi của Watchdog\n    ESP_ERROR_CHECK(esp_task_wdt_add(NULL));\n\n    while (1) {\n        // Thực hiện công việc tính toán\n        run_tinyml_inference_cycle();\n\n        // 2. \"Cho chó ăn\": Xóa cờ Watchdog định kỳ để chứng minh Task vẫn sống khỏe\n        ESP_ERROR_CHECK(esp_task_wdt_reset());\n\n        vTaskDelay(pdMS_TO_TICKS(100));\n    }\n\n    // Nếu Task kết thúc, bắt buộc phải hủy đăng ký khỏi Watchdog!\n    esp_task_wdt_delete(NULL);\n    vTaskDelete(NULL);\n}\n\nvoid init_system_watchdog(void) {\n    esp_task_wdt_config_t twdt_config = {\n        .timeout_ms = 5000, // 5 giây không xóa cờ sẽ bị reset\n        .idle_core_mask = (1 << 0) | (1 << 1), // Giám sát cả Idle Task 2 nhân\n        .trigger_panic = true, // Kích hoạt Reset khi phát hiện treo\n    };\n    ESP_ERROR_CHECK(esp_task_wdt_init(&twdt_config));\n}"
},
    "t17": {
        "title": "Quản lý kết nối Wi-Fi Station với cơ chế tự động kết nối lại khi rớt mạng",
        "stageName": "Bước 5: Giao Thức Mạng & Cập Nhật Từ Xa (OTA)",
        "skill": "Resilient Wi-Fi Station State Machine",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Sóng Wi-Fi trong nhà máy công nghiệp hoặc khu vực ngoài trời liên tục bị chập chờn bởi nhiễu động cơ và việc khởi động lại Access Point.\n- Ẩn dụ: Nếu ai đó gọi điện cho bạn bị mất sóng giữa chừng, cách làm khôn ngoan nhất là chờ vài giây rồi gọi lại. Nếu vừa dập máy đã bấm gọi liên tục 100 lần trong 1 giây, tổng đài sẽ khóa số của bạn vì nghẽn mạng! Thuật toán **Exponential Backoff (Thử lại theo cấp số nhân)** giúp vi điều khiển chờ một khoảng thời gian tăng dần (1s, 2s, 4s, 8s, tối đa 60s) trước khi thử kết nối lại, đảm bảo hệ thống tự phục hồi ổn định mà không làm sập router.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Sử dụng kiến trúc máy trạng thái hướng sự kiện (Default Event Loop) của ESP-IDF:\n  + Lắng nghe `WIFI_EVENT_STA_START`: Bắt đầu kích hoạt `esp_wifi_connect()`.\n  + Lắng nghe `WIFI_EVENT_STA_DISCONNECTED`: Kích hoạt bộ đếm thử lại và gọi thuật toán Exponential Backoff.\n  + Lắng nghe `IP_EVENT_STA_GOT_IP`: Đặt cờ `s_wifi_connected_bit`, kích hoạt các tác vụ MQTT và đám mây.\n- Lưu trữ thông tin mạng vào phân vùng Flash NVS để tự động kết nối lại khi bật nguồn.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Gọi `esp_wifi_connect()` ngay trong vòng lặp `while` không có độ trễ:** Làm cạn kiệt bộ nhớ hàng đợi mạng của hệ điều hành, dẫn đến lỗi `ESP_ERR_NO_MEM` và crash chip.\n❌ **Chặn Event Handler bằng hàm trễ dài:** Các hàm xử lý sự kiện trong Event Loop chạy chung một Task hệ thống. Nếu chèn lệnh delay hoặc tính toán nặng vào hàm event handler, toàn bộ ngăn xếp mạng sẽ bị đóng băng.",
        "code": "// Máy trạng thái Wi-Fi tự phục hồi chuẩn ESP-IDF v5.x\n#include \"esp_wifi.h\"\n#include \"esp_event.h\"\n#include \"esp_log.h\"\n\nstatic int s_retry_num = 0;\n#define MAX_RETRY_COUNT 10\n\nstatic void wifi_event_handler(void* arg, esp_event_base_t event_base,\n                                int32_t event_id, void* event_data) {\n    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_START) {\n        esp_wifi_connect();\n    } else if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {\n        if (s_retry_num < MAX_RETRY_COUNT) {\n            s_retry_num++;\n            int delay_sec = 1 << (s_retry_num > 5 ? 5 : s_retry_num); // Exponential Backoff: 2s, 4s, 8s...\n            ESP_LOGW(\"WIFI\", \"Mất kết nối! Thử lại lần %d sau %d giây...\", s_retry_num, delay_sec);\n            vTaskDelay(pdMS_TO_TICKS(delay_sec * 1000));\n            esp_wifi_connect();\n        } else {\n            ESP_LOGE(\"WIFI\", \"Không thể kết nối lại sau %d lần thử!\", MAX_RETRY_COUNT);\n        }\n    } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {\n        ip_event_got_ip_t* event = (ip_event_got_ip_t*) event_data;\n        ESP_LOGI(\"WIFI\", \"Đã nhận địa chỉ IP: \" IPSTR, IP2STR(&event->ip_info.ip));\n        s_retry_num = 0; // Đặt lại bộ đếm khi kết nối thành công\n    }\n}"
},
    "t18": {
        "title": "Đóng gói dữ liệu định dạng JSON nhẹ và xuất bản lên MQTT Broker",
        "stageName": "Bước 5: Giao Thức Mạng & Cập Nhật Từ Xa (OTA)",
        "skill": "Compact JSON & MQTT 3.1.1 Telemetry",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Sau khi mô hình AI suy luận xong, kết quả cần được gửi về máy chủ trung tâm hoặc hiển thị lên bảng điều khiển Web Dashboard.\n- Ẩn dụ: Nếu bạn gửi cả bức ảnh chụp 10MB qua mạng 4G/Wi-Fi chỉ để báo tin \"Cửa đã đóng\", bạn đang đốt tiền mua băng thông và ngốn sạch pin. Kỹ thuật Edge AI chỉ gửi duy nhất một dòng tin nhắn ngắn gọn: `{\"door\": \"closed\", \"conf\": 0.99}`. Giao thức MQTT được thiết kế riêng cho thiết bị IoT với tiêu đề gói tin (Header) chỉ từ 2 bytes, tiết kiệm dữ liệu gấp hàng chục lần so với HTTP thông thường.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Kiến trúc Publish / Subscribe qua trung gian MQTT Broker (EMQX, Mosquitto, HiveMQ).\n- **Mức dịch vụ QoS (Quality of Service):**\n  + **QoS 0 (Tối đa 1 lần):** Không yêu cầu Broker gửi gói tin xác nhận `PUBACK`. Dành cho dữ liệu thông số nhiệt độ định kỳ.\n  + **QoS 1 (Ít nhất 1 lần):** Broker bắt buộc phải phản hồi `PUBACK`. Nếu không nhận được, thiết bị sẽ tự động gửi lại. BẮT BUỘC dùng cho các cảnh báo sự cố hỏng hóc từ mô hình AI!\n- Đóng gói chuỗi JSON bằng thư viện nhẹ `cJSON` hoặc tạo trực tiếp bằng hàm `snprintf()` để tránh phân mảnh Heap.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Rò rỉ bộ nhớ khi dùng thư viện cJSON:** Sau khi gọi `cJSON_PrintUnformatted()`, quên gọi `cJSON_Delete(root)` và `free(json_string)`, làm cạn kiệt RAM sau vài giờ xuất bản bản tin.\n❌ **Gói tin JSON vượt quá dung lượng đệm của MQTT:** Cấu hình `buffer_size` của MQTT client nhỏ hơn chuỗi JSON gửi đi, khiến bản tin bị cắt cụt làm máy chủ không thể giải mã cú pháp.",
        "code": "// Đóng gói JSON và Publish bản tin MQTT chuẩn ESP-IDF\n#include \"mqtt_client.h\"\n\nstatic esp_mqtt_client_handle_t s_mqtt_client = NULL;\n\nvoid publish_ai_anomaly_alert(int class_id, float confidence, int64_t latency_us) {\n    char payload_buf[192];\n    \n    // Đóng gói JSON trực tiếp bằng snprintf: Cực nhanh, 0% rủi ro rò rỉ RAM!\n    int len = snprintf(payload_buf, sizeof(payload_buf),\n        \"{\\\"dev\\\":\\\"esp32s3_01\\\",\\\"alert\\\":%d,\\\"conf\\\":%.2f,\\\"lat_us\\\":%lld,\\\"ts\\\":%lu}\",\n        class_id, confidence, latency_us, (unsigned long)(esp_timer_get_time() / 1000000ULL));\n\n    if (len > 0 && len < sizeof(payload_buf)) {\n        // Xuất bản với QoS 1 bảo đảm bản tin cảnh báo đến đích\n        int msg_id = esp_mqtt_client_publish(\n            s_mqtt_client, \"factory/sensor/alerts\", payload_buf, len, 1, 0);\n        ESP_LOGI(\"MQTT\", \"Đã gửi cảnh báo sự cố, msg_id = %d\", msg_id);\n    }\n}"
},
    "t19": {
        "title": "Thiết kế bảng phân vùng bộ nhớ Flash (Partition Table) hỗ trợ 2 ngăn OTA",
        "stageName": "Bước 5: Giao Thức Mạng & Cập Nhật Từ Xa (OTA)",
        "skill": "Dual-Bank OTA Partition Table Layout",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Bộ nhớ Flash ngoài của vi điều khiển giống như một ổ cứng máy tính được chia thành nhiều phân vùng ổ đĩa (C:, D:, E:).\n- Ẩn dụ: Nếu bạn xây nhà chỉ có một lối đi duy nhất, khi bạn muốn đập đi sửa lại lối đi đó, bạn sẽ bị nhốt ở bên trong nhà hoặc bị đuổi ra ngoài đường. Bảng phân vùng Dual-Bank OTA giống như ngôi nhà có hai cánh cửa giống hệt nhau (ota_0 và ota_1). Khi đang sử dụng cửa 1, thợ có thể thoải mái sơn sửa cửa 2. Sơn xong kiểm tra hoàn hảo mới bắt đầu đi cửa 2, không bao giờ bị gián đoạn sinh hoạt!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Bảng phân vùng tùy chỉnh `partitions.csv` cho Flash 8MB hoặc 16MB:\n  + `nvs` (0x9000, 16KB): Lưu trữ cấu hình Wi-Fi và khóa bảo mật.\n  + `otadata` (0xe000, 8KB): Lưu trạng thái phân vùng đang boot và mã kiểm tra CRC32.\n  + `ota_0` (0x20000, 2.5MB): Chứa firmware bản hiện tại.\n  + `ota_1` (0x2A0000, 2.5MB): Chứa firmware bản nâng cấp tiếp theo.\n- Kích thước của mỗi phân vùng `ota_0` và `ota_1` bắt buộc phải lớn hơn dung lượng file nhị phân firmware (.bin) sau khi biên dịch.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Khai báo kích thước phân vùng không căn lề sector 64KB (0x10000):** Flash SPI xóa dữ liệu theo từng Block 64KB. Nếu offset hoặc size không chia hết cho `0x10000`, trình biên dịch phân vùng của ESP-IDF sẽ báo lỗi và dừng build.\n❌ **Quên phân vùng otadata:** Thiếu phân vùng này, Bootloader không có nơi để lưu thông tin phân vùng nào là hợp lệ, tính năng OTA hoàn toàn bị vô hiệu hóa.",
        "code": "# File cấu hình bảng phân vùng Dual-Bank 2 ngăn (partitions.csv) cho Flash 8MB:\n# Name,     Type,  SubType,  Offset,    Size,      Flags\nnvs,        data,  nvs,      0x9000,    0x4000,\notadata,    data,  ota,      0xe000,    0x2000,\nphy_init,   data,  phy,      0x10000,   0x1000,\nota_0,      app,   ota_0,    0x20000,   0x2E0000,  # 2.9 MB cho Firmware A\nota_1,      app,   ota_1,    0x300000,  0x2E0000,  # 2.9 MB cho Firmware B\nstorage,    data,  spiffs,   0x5E0000,  0x200000,  # 2.0 MB chứa file tĩnh"
},
    "t20": {
        "title": "Thực hiện quy trình nâng cấp firmware từ xa qua sóng Wi-Fi (OTA Update)",
        "stageName": "Bước 5: Giao Thức Mạng & Cập Nhật Từ Xa (OTA)",
        "skill": "Resilient HTTPS OTA & Rollback Engine",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Cập nhật phần mềm từ xa (Over-The-Air Update - OTA) là khả năng sống còn của mọi thiết bị thương mại. Khi thiết bị đã được lắp đặt trên nóc tòa nhà hoặc trong máy móc công nghiệp, bạn không thể đem máy tính đến cắm cáp nạp lại code mỗi khi phát hiện lỗi nhỏ.\n- Ẩn dụ: Nhảy dù từ máy bay luôn cần có một chiếc dù phụ dự phòng (Rollback). Khi phi công nhảy ra khỏi máy bay (boot vào firmware mới), nếu kéo dù chính mà dù không mở (firmware bị crash hoặc mất Wi-Fi), hệ thống tự động giật chiếc dù phụ (khôi phục lại firmware cũ), đảm bảo phi công luôn tiếp đất an toàn 100%!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n1. Tải bản nhị phân mới qua giao thức bảo mật HTTPS sử dụng chứng chỉ số X.509 Root CA.\n2. Ghi từng khối dữ liệu vào phân vùng OTA đối ứng (`ota_1` nếu đang chạy trên `ota_0`).\n3. Kiểm tra mã kiểm tra dư thừa SHA-256 của toàn bộ file binary.\n4. Đánh dấu trạng thái phân vùng mới là `ESP_OTA_IMG_PENDING_VERIFY`.\n5. Khởi động lại thiết bị (`esp_restart()`).\n6. Trong firmware mới, sau khi tự kiểm tra hoạt động ổn định trong 30 giây, bắt buộc phải gọi hàm:\n   `esp_ota_mark_app_valid_cancel_rollback();`\n   Nếu không gọi hàm này, lần reset tiếp theo Bootloader sẽ tự động quay trở về bản cũ!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên chứng chỉ bảo mật SSL/TLS:** Sử dụng đường dẫn HTTP trần khiến tin tặc có thể can thiệp tấn công Man-In-The-Middle, nạp mã độc vào thiết bị.\n❌ **Hết pin hoặc mất điện giữa chừng khi đang tải:** Nhờ kiến trúc Dual-Bank, nếu mất điện lúc đang tải vào `ota_1`, phân vùng `ota_0` vẫn nguyên vẹn 100%, thiết bị bật nguồn lại vẫn chạy bình thường.",
        "code": "// Quy trình thực thi nâng cấp OTA và xác nhận chống Rollback\n#include \"esp_https_ota.h\"\n#include \"esp_ota_ops.h\"\n\nvoid check_and_cancel_rollback(void) {\n    const esp_partition_t *running = esp_ota_get_running_partition();\n    esp_ota_img_states_t state;\n    if (esp_ota_get_state_partition(running, &state) == ESP_OK) {\n        if (state == ESP_OTA_IMG_PENDING_VERIFY) {\n            // Firmware mới đã kết nối Wi-Fi thành công -> HỦY BỎ ROLLBACK!\n            ESP_LOGI(\"OTA\", \"Firmware mới hoàn toàn khỏe mạnh. Hủy cờ Rollback!\");\n            esp_ota_mark_app_valid_cancel_rollback();\n        }\n    }\n}\n\nvoid trigger_ota_download(const char *url) {\n    esp_http_client_config_t http_cfg = {\n        .url = url,\n        .cert_pem = (const char *)server_ca_pem,\n        .timeout_ms = 10000,\n    };\n    esp_https_ota_config_t ota_cfg = { .http_config = &http_cfg };\n    \n    ESP_LOGI(\"OTA\", \"Đang tải firmware mới...\");\n    if (esp_https_ota(&ota_cfg) == ESP_OK) {\n        ESP_LOGI(\"OTA\", \"Thành công! Khởi động lại hệ thống...\");\n        esp_restart();\n    } else {\n        ESP_LOGE(\"OTA\", \"Tải thất bại, vẫn an toàn ở phiên bản cũ!\");\n    }\n}"
},
    "t21": {
        "title": "Chuyển đổi mô hình TensorFlow sang định dạng TensorFlow Lite FlatBuffer",
        "stageName": "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        "skill": "TensorFlow Lite FlatBuffer Export",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Mô hình huấn luyện trên máy tính bằng Python (Keras / PyTorch) được lưu dưới dạng file `.h5` hoặc thư mục `SavedModel` chứa rất nhiều metadata, đồ thị tính toán ngược (Backpropagation graph) và các cấu trúc trừu tượng cồng kềnh.\n- Ẩn dụ: File mô hình máy tính giống như một bộ hồ sơ thiết kế xây dựng cả tòa nhà 50 tầng. Vi điều khiển chỉ là một công nhân thi công trên công trường, nó chỉ cần đúng một tờ giấy ghi vị trí đặt từng viên gạch. Định dạng **TFLite FlatBuffer** là định dạng nhị phân tối giản: nó loại bỏ toàn bộ dữ liệu thừa, chỉ giữ lại ma trận trọng số và thứ tự các phép tính!\n- Đặc biệt, FlatBuffer hỗ trợ **Zero-Copy Memory Mapping**: Vi điều khiển có thể đọc trực tiếp các trọng số từ Flash ROM mà không cần phải giải nén (Parsing) tốn RAM.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Chuyển đổi bằng công cụ `tf.lite.TFLiteConverter`:\n  + Nạp mô hình Keras: `converter = tf.lite.TFLiteConverter.from_keras_model(model)`.\n  + Tối ưu hóa: `converter.optimizations = [tf.lite.Optimize.DEFAULT]`.\n  + Xuất file FlatBuffer nhị phân: `tflite_model = converter.convert()`.\n- Chuyển đổi file `.tflite` sang mảng byte C nhị phân bằng tiện ích dòng lệnh Linux:\n  ```bash\n  xxd -i model.tflite > model_data.h\n  ```\n  Mảng C này được nạp thẳng vào phân đoạn Flash ROM `.rodata`.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Sử dụng các toán tử không được hỗ trợ trên TFLite Micro:** Một số lớp mạng phức tạp trên Keras (như một số dạng Attention, Non-max suppression phức tạp) chưa có mã nguồn C++ tương ứng trên vi điều khiển. Khắc phục: chỉ sử dụng các lớp chuẩn như Conv2D, DepthwiseConv2D, Dense, ReLU, MaxPool2D, Softmax.",
        "code": "# Script Python chuyển đổi mô hình Keras sang mảng C FlatBuffer\nimport tensorflow as tf\nimport os\n\n# 1. Nạp mô hình đã huấn luyện\nmodel = tf.keras.models.load_model(\"gesture_model.h5\")\n\n# 2. Khởi tạo converter TFLite\nconverter = tf.lite.TFLiteConverter.from_keras_model(model)\nconverter.optimizations = [tf.lite.Optimize.DEFAULT]\ntflite_model = converter.convert()\n\n# 3. Lưu file FlatBuffer nhị phân\nwith open(\"model.tflite\", \"wb\") as f:\n    f.write(tflite_model)\n\nprint(f\"Kích thước file TFLite: {len(tflite_model)} bytes\")\n\n# 4. Tự động chuyển đổi thành file header C\nos.system(\"xxd -i model.tflite > main/model_data.h\")\nprint(\"Đã sinh thành công main/model_data.h sẵn sàng nhúng vào ESP-IDF!\")"
},
    "t22": {
        "title": "Kỹ thuật lượng tử hóa sau huấn luyện (Post-Training Quantization) sang INT8",
        "stageName": "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        "skill": "INT8 Full Post-Training Quantization",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trọng số gốc của mô hình là các số thực dấu phẩy động 32-bit (Float32). Mỗi con số có thể là `0.023458129`, chiếm tới 4 bytes bộ nhớ.\n- Ẩn dụ: Nếu bạn đo chiều cao của mọi người trong lớp học, bạn không cần phải dùng thước đo laser chính xác đến từng micro-mét (`172.48392 mm`). Bạn chỉ cần làm tròn đến centimét (`172 cm`). Mọi quyết định xếp hàng hay may đồng phục vẫn hoàn toàn chính xác! Lượng tử hóa INT8 nén toàn bộ dải số thực Float32 thành số nguyên 8-bit từ -128 đến 127: giảm 75% dung lượng và tính toán nhanh gấp 5 lần!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Công thức ánh xạ lượng tử hóa Affine Quantization:\n  $$r = S \\cdot (q - Z)$$\n  $$q = \\text{clamp}\\left(\\text{round}\\left(\\frac{r}{S}\\right) + Z, -128, 127\\right)$$\n  Trong đó: $S$ là hệ số Scale, $Z$ là Zero-point (số nguyên ứng với giá trị thực $0.0f$).\n- **Tập dữ liệu đại diện (Representative Dataset):** Để lượng tử hóa mà không làm mất độ chính xác, ta phải đưa khoảng 100 đến 200 mẫu dữ liệu thực tế vào Converter để nó đo đạc dải giá trị cực đại và cực tiểu ($r_{min}, r_{max}$) của từng lớp mạng.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên ép kiểu đầu vào và đầu ra về INT8:** Nếu không khai báo `inference_input_type = tf.int8`, Converter sẽ tạo ra mô hình hỗn hợp (Hybrid Model) vẫn đòi hỏi Float32 ở hai đầu, làm mất đi lợi thế tăng tốc SIMD phần cứng.\n❌ **Tập dữ liệu đại diện không đặc trưng:** Dùng dữ liệu toàn số 0 để làm Representative Dataset khiến hệ số Scale $S$ bị tính toán sai lệch, làm độ chính xác của mô hình sau lượng tử hóa sụt giảm từ 98% xuống còn 20%!",
        "code": "# Script Python lượng tử hóa đầy đủ INT8 (Full Integer Quantization)\nimport tensorflow as tf\nimport numpy as np\n\n# 1. Hàm sinh dữ liệu đại diện từ tập test thực tế\ndef representative_data_gen():\n    test_data = np.load(\"test_features.npy\") # Mảng (100, 256)\n    for sample in test_data:\n        yield [np.expand_dims(sample.astype(np.float32), axis=0)]\n\n# 2. Cấu hình lượng tử hóa INT8\nconverter = tf.lite.TFLiteConverter.from_keras_model(model)\nconverter.optimizations = [tf.lite.Optimize.DEFAULT]\nconverter.representative_dataset = representative_data_gen\n\n# 3. Ép kiểu toàn bộ toán tử, đầu vào và đầu ra sang INT8\nconverter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]\nconverter.inference_input_type = tf.int8\nconverter.inference_output_type = tf.int8\n\nquantized_model = converter.convert()\n\nwith open(\"model_int8.tflite\", \"wb\") as f:\n    f.write(quantized_model)\nprint(f\"Kích thước mô hình INT8: {len(quantized_model)} bytes (Giảm 4 lần!)\")"
},
    "t23": {
        "title": "Nhúng mô hình vào ESP-IDF, phân bổ Tensor Arena và tối ưu Op Resolver",
        "stageName": "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        "skill": "TFLite Micro Runtime Architecture",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Vi điều khiển không thể gọi các hàm nạp mô hình linh hoạt như máy tính vì nó không có hệ điều hành và không có bộ quản lý bộ nhớ ảo.\n- Ẩn dụ: Tensor Arena giống như một tấm bạt dã ngoại bạn trải ra giữa bãi cỏ. Mọi vật dụng nấu nướng, bát đĩa (các Tensor đầu vào, Tensor trung gian của các lớp mạng, Tensor đầu ra) đều phải nằm trọn vẹn trên tấm bạt đó. Nếu tấm bạt quá bé, đồ đạc sẽ bị tràn ra đất (lỗi cấp phát thất bại).\n- Đặc biệt, trên ESP32-S3 với tập lệnh Vector SIMD 128-bit, tấm bạt đó **bắt buộc phải được căn lề đúng 16-byte** (`alignas(16)`) để CPU có thể nạp 16 byte INT8 trong 1 chu kỳ máy!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n1. Đặt mảng mô hình trong Flash ROM (`model_data.h`).\n2. Khai báo Tensor Arena tĩnh trong **Internal SRAM1**:\n   ```cpp\n   #define TENSOR_ARENA_SIZE (48 * 1024)\n   alignas(16) static uint8_t tensor_arena[TENSOR_ARENA_SIZE];\n   ```\n3. **Tối ưu Op Resolver:** Sử dụng `MicroMutableOpResolver<N>` và chỉ thêm đúng các toán tử cần thiết (ví dụ: FullyConnected, Softmax). Tránh dùng `AllOpsResolver` vì sẽ nạp hàng trăm toán tử thừa, lãng phí hơn 150KB Flash ROM!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Thiếu cờ `alignas(16)`:** Gây ngắt Panic phần cứng `LoadStoreAlignment Error` ngay khi hàm `Invoke()` bắt đầu chạy.\n❌ **Kích thước Tensor Arena không đủ:** Hàm `AllocateTensors()` trả về `kTfLiteError`. Cách khắc phục: tăng kích thước thêm từng bước 4KB (ví dụ từ 32KB lên 36KB rồi 40KB) cho đến khi hàm trả về `kTfLiteOk`.",
        "code": "// Khởi tạo TFLite Micro trên ESP-IDF bằng C++\n#include \"tensorflow/lite/micro/micro_interpreter.h\"\n#include \"tensorflow/lite/micro/micro_mutable_op_resolver.h\"\n#include \"tensorflow/lite/schema/schema_generated.h\"\n#include \"model_data.h\"\n\n#define TENSOR_ARENA_SIZE (48 * 1024)\nalignas(16) static uint8_t s_tensor_arena[TENSOR_ARENA_SIZE]; // Căn lề 16-byte!\n\nstatic const tflite::Model* s_model = nullptr;\nstatic tflite::MicroInterpreter* s_interpreter = nullptr;\n\nvoid setup_tinyml_runtime(void) {\n    // 1. Ánh xạ mô hình FlatBuffer\n    s_model = tflite::GetModel(g_model_data);\n\n    // 2. Chỉ đăng ký 2 toán tử cần dùng để tiết kiệm Flash\n    static tflite::MicroMutableOpResolver<2> resolver;\n    resolver.AddFullyConnected();\n    resolver.AddSoftmax();\n\n    // 3. Khởi tạo Interpreter với Tensor Arena\n    static tflite::MicroInterpreter static_interpreter(\n        s_model, resolver, s_tensor_arena, TENSOR_ARENA_SIZE);\n    s_interpreter = &static_interpreter;\n\n    // 4. Phân bổ bộ nhớ các Tensor\n    if (s_interpreter->AllocateTensors() != kTfLiteOk) {\n        ESP_LOGE(\"AI\", \"Lỗi: Tensor Arena quá nhỏ!\");\n    } else {\n        ESP_LOGI(\"AI\", \"Tensor Arena khởi tạo thành công (%u bytes)\", s_interpreter->arena_used_bytes());\n    }\n}"
},
    "t24": {
        "title": "Thực thi suy luận thời gian thực (Inference) và đo đạc độ trễ từng mili-giây",
        "stageName": "Bước 6: Mô Hình AI Trên Edge (TinyML)",
        "skill": "Edge AI Inference & Latency Profiling",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Sau khi khởi tạo xong, mô hình TinyML sẵn sàng tiếp nhận các đặc trưng và trả về kết quả phân loại (Class Prediction) trong thời gian thực.\n- Ẩn dụ: Bước này giống như việc bác sĩ nhìn vào kết quả điện tâm đồ (đầu vào) và đưa ra kết luận chẩn đoán: Bình thường, Nhịp tim nhanh hay Rung tâm nhĩ.\n- Độ trễ phản hồi (Latency) là chỉ số sống còn: Một hệ thống phát hiện rung động hỏng hóc phải đưa ra cảnh báo trong vòng dưới 50 mili-giây trước khi vòng bi bị vỡ vụn gây tai nạn.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n1. Chuẩn hóa và lượng tử hóa mảng đặc trưng đầu vào từ Float32 sang INT8:\n   $$q_{in}[i] = \\text{clamp}\\left(\\text{round}\\left(\\frac{x[i]}{S_{in}}\\right) + Z_{in}, -128, 127\\right)$$\n2. Đo thời gian bằng bộ đếm micro-giây: `int64_t t0 = esp_timer_get_time();`\n3. Thực thi suy luận: `TfLiteStatus status = s_interpreter->Invoke();`\n4. Tính độ trễ: `latency_us = esp_timer_get_time() - t0;`\n5. Tìm kiếm lớp có điểm số cao nhất trong Output Tensor:\n   $$\\text{class} = \\arg\\max_i (\\text{output}[i])$$\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên chuyển đổi Float sang INT8 cho đầu vào:** Gán trực tiếp số float vào mảng byte của input tensor khiến các giá trị bị sai lệch hoàn toàn, làm mô hình luôn dự đoán ra duy nhất 1 lớp.\n❌ **Đo độ trễ bao gồm cả lệnh printf:** Lệnh printf qua cổng Serial làm tăng thêm hàng chục mili-giây sai lệch vào kết quả đo.",
        "code": "// Hàm thực thi suy luận và đo đạc độ trễ chuẩn kỹ sư\nint run_realtime_inference(const float *features, int num_features) {\n    TfLiteTensor *input = s_interpreter->input(0);\n\n    // 1. Ánh xạ lượng tử hóa vào Input Tensor INT8\n    for (int i = 0; i < num_features; i++) {\n        int32_t quantized = (int32_t)roundf(features[i] / input->params.scale) + input->params.zero_point;\n        if (quantized < -128) quantized = -128;\n        if (quantized > 127)  quantized = 127;\n        input->data.int8[i] = (int8_t)quantized;\n    }\n\n    // 2. Đo thời gian thực thi Invoke()\n    int64_t t_start = esp_timer_get_time();\n    s_interpreter->Invoke();\n    int64_t latency_us = esp_timer_get_time() - t_start;\n\n    // 3. Đọc kết quả phân loại\n    TfLiteTensor *output = s_interpreter->output(0);\n    int best_class = 0;\n    int8_t max_score = -128;\n    for (int i = 0; i < output->dims->data[1]; i++) {\n        if (output->data.int8[i] > max_score) {\n            max_score = output->data.int8[i];\n            best_class = i;\n        }\n    }\n    ESP_LOGI(\"AI\", \"Dự đoán: Lớp %d | Điểm: %d | Độ trễ: %lld us (%.2f ms)\",\n             best_class, max_score, latency_us, latency_us / 1000.0f);\n    return best_class;\n}"
},
    "t25": {
        "title": "Đo đạc dòng tiêu thụ của hệ thống trong các chế độ Active, Modem-Sleep, Light-Sleep",
        "stageName": "Bước 7: Tối Ưu Nguồn Cực Hạn (Ultra-Low Power)",
        "skill": "Power Profiling & Dynamic Frequency Scaling",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Một kỹ sư IoT xuất sắc phải hiểu rõ mức tiêu hao năng lượng của từng khối mạch trên chip.\n- Bảng dòng tiêu thụ thực tế của ESP32-S3:\n  + **Active (Wi-Fi TX):** 180mA - 240mA (Tiêu thụ khủng khiếp nhất, chỉ nên bật trong vài giây).\n  + **Modem-Sleep:** 20mA - 30mA (CPU chạy ở 240MHz nhưng tắt bộ phát sóng vô tuyến RF).\n  + **Light-Sleep:** 2mA - 3mA (Đóng băng xung nhịp CPU, duy trì RAM, thức dậy trong vài micro-giây).\n  + **Deep Sleep:** < 10 uA (Cắt điện toàn bộ CPU và RAM, chỉ giữ lại RTC Domain).\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Cơ chế **Dynamic Frequency Scaling (DFS)**: Tự động hạ tần số xung nhịp CPU từ 240MHz xuống 80MHz hoặc 40MHz khi tải tính toán nhàn rỗi thông qua bộ quản lý nguồn `esp_pm_configure()`.\n- Kỹ thuật đo lường thực tế: Sử dụng máy hiện sóng hoặc thiết bị đo công suất chuyên dụng (như Nordic Power Profiler Kit - PPK2) kẹp vào đường nguồn VDD 3.3V để ghi lại biểu đồ dòng điện theo thời gian thực.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên tắt LED báo nguồn trên bo mạch:** Nhiều kit phát triển giá rẻ tích hợp sẵn một đèn LED nguồn 3.3V luôn sáng. Đèn LED này ngốn mất **2mA đến 5mA**, gấp 500 lần dòng điện Deep Sleep của con chip! Khắc phục: cào đứt đường mạch hoặc gỡ bỏ điện trở cấp cho LED nguồn.",
        "code": "// Cấu hình tự động chuyển đổi tần số CPU và Modem-Sleep tiết kiệm điện\n#include \"esp_pm.h\"\n\nvoid enable_automatic_power_saving(void) {\n    esp_pm_config_t pm_config = {\n        .max_freq_mhz = 240, // Tối đa khi chạy TinyML\n        .min_freq_mhz = 40,  // Tự động hạ xuống 40MHz khi rảnh\n        .light_sleep_enable = true, // Tự động ngủ nhẹ giữa các nhịp Tick\n    };\n    ESP_ERROR_CHECK(esp_pm_configure(&pm_config));\n    ESP_LOGI(\"PM\", \"Đã kích hoạt Dynamic Frequency Scaling thành công!\");\n}"
},
    "t26": {
        "title": "Cấu hình chế độ ngủ sâu (Deep Sleep) và đánh thức bằng Timer / Chân GPIO (EXT0, EXT1)",
        "stageName": "Bước 7: Tối Ưu Nguồn Cực Hạn (Ultra-Low Power)",
        "skill": "Deep Sleep & Multi-Trigger Wakeup Engine",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Chế độ ngủ sâu (Deep Sleep) là chìa khóa duy nhất để thiết bị IoT chạy pin 5 năm.\n- Khi vào Deep Sleep, toàn bộ Core CPU và bộ nhớ RAM nội bị cắt điện hoàn toàn.\n- Cơ chế đánh thức đa dạng:\n  + **Timer Wakeup:** Hẹn giờ thức dậy định kỳ sau một khoảng thời gian (ví dụ 10 phút thức dậy đo 1 lần).\n  + **EXT0 Wakeup:** Đánh thức bằng 1 chân GPIO duy nhất của miền RTC khi có nút bấm hoặc cảm biến ngoài kích hoạt.\n  + **EXT1 Wakeup:** Đánh thức bằng một mặt nạ Bitmask gồm nhiều chân nút bấm.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Biến nằm trong RTC SRAM được khai báo với thuộc tính `RTC_DATA_ATTR`. Biến này không bị xóa khi chip thức giấc từ Deep Sleep.\n- Trước khi vào Deep Sleep, bắt buộc phải cô lập các chân ngoại vi bằng hàm `rtc_gpio_isolate()` để tránh dòng rò rỉ qua các điện trở kéo nội.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Chân GPIO thả nổi (Floating Pin):** Chân RTC GPIO dùng để đánh thức bị thả nổi không có điện trở kéo, sóng nhiễu môi trường làm chip thức dậy liên tục hàng nghìn lần mỗi phút, khiến pin cạn sạch trong 1 ngày!",
        "code": "// Cấu hình Deep Sleep đa nguồn đánh thức\n#include \"esp_sleep.h\"\n#include \"driver/rtc_io.h\"\n\nRTC_DATA_ATTR static int s_wake_counter = 0;\n\nvoid enter_power_saving_deep_sleep(void) {\n    s_wake_counter++;\n    ESP_LOGI(\"SLEEP\", \"Lần thức dậy thứ: %d\", s_wake_counter);\n\n    // 1. Cấu hình đánh thức định kỳ sau 30 giây\n    esp_sleep_enable_timer_wakeup(30 * 1000000ULL);\n\n    // 2. Cấu hình đánh thức khẩn cấp bằng nút nhấn GPIO0 (mức LOW)\n    esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0);\n\n    // 3. Cô lập các chân tránh dòng rò\n    rtc_gpio_isolate(GPIO_NUM_0);\n\n    // 4. Bắt đầu ngủ sâu\n    esp_deep_sleep_start();\n}"
},
    "t27": {
        "title": "Lập trình bộ đồng xử lý siêu tiết kiệm điện ULP (Ultra Low Power) đọc cảm biến",
        "stageName": "Bước 7: Tối Ưu Nguồn Cực Hạn (Ultra-Low Power)",
        "skill": "ULP RISC-V Ultra-Low-Power Co-processor",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- ULP (Ultra-Low Power) trên ESP32-S3 là một vi xử lý kiến trúc **RISC-V 32-bit độc lập** nằm gọn trong miền nguồn RTC Domain.\n- Ẩn dụ: ULP giống như một người bảo vệ gác cổng tí hon. Trong lúc toàn bộ nhà máy (CPU chính) đang tắt đèn đi ngủ say, người bảo vệ này tiêu thụ một lượng điện cực nhỏ (<150uA) định kỳ đo nhịp rung của cổng. Khi nào có kẻ trộm phá cửa (rung động vượt ngưỡng nguy hiểm), người bảo vệ mới bấm chuông đánh thức toàn bộ ban giám đốc dậy xử lý!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- ULP chạy ở xung nhịp thấp 17.5MHz trong vùng nhớ RTC Fast SRAM (8KB).\n- Có thể viết bằng ngôn ngữ C thông thường và biên dịch bằng toolchain RISC-V đi kèm của ESP-IDF.\n- ULP có thể độc lập điều khiển chân GPIO, đọc kênh ADC và thực thi lệnh `ulp_riscv_wakeup_main_processor()` để đánh thức CPU chính.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Dung lượng code ULP vượt quá 8KB:** Vùng RTC Fast SRAM chỉ có 8KB cho cả code lẫn dữ liệu của ULP. Không được sử dụng các thư viện C cồng kềnh trong code ULP.",
        "code": "// Mã nguồn C của chương trình ULP RISC-V chạy độc lập trong RTC RAM\n#include \"ulp_riscv.h\"\n#include \"ulp_riscv_utils.h\"\n\nvolatile int32_t sensor_threshold = 500;\nvolatile int32_t current_reading = 0;\n\nint main(void) {\n    // 1. ULP thức dậy đọc chân ADC ngoại vi\n    current_reading = ulp_riscv_adc_read_channel(0);\n\n    // 2. Kiểm tra nếu vượt ngưỡng nguy hiểm\n    if (current_reading > sensor_threshold) {\n        // Đánh thức CPU chính dậy chạy mô hình TinyML phân tích!\n        ulp_riscv_wakeup_main_processor();\n    }\n    // 3. ULP tự động đi ngủ lại chờ chu kỳ đếm tiếp theo\n    return 0;\n}"
},
    "t28": {
        "title": "Tính toán và tối ưu hóa ngân sách năng lượng (Power Budgeting) cho thiết bị chạy Pin",
        "stageName": "Bước 7: Tối Ưu Nguồn Cực Hạn (Ultra-Low Power)",
        "skill": "IoT Battery Life & Power Budgeting",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Đừng bao giờ đoán mò về tuổi thọ pin. Kỹ sư nhúng chuyên nghiệp phải có khả năng lập bảng tính toán ngân sách năng lượng định lượng (Power Budget Sheet) trước khi thiết kế phần cứng.\n- Ẩn dụ: Giống như việc quản lý tài chính cá nhân: bạn kiếm được một khoản tiền cố định (dung lượng pin 2000mAh), bạn phải tính xem mỗi ngày bạn tiêu bao nhiêu tiền để biết chính xác số tiền đó nuôi sống bạn được bao nhiêu năm.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Công thức tính dòng tiêu thụ trung bình $I_{avg}$:\n  $$I_{avg} = \\frac{T_{active} \\cdot I_{active} + T_{sleep} \\cdot I_{sleep}}{T_{active} + T_{sleep}}$$\n- Ví dụ thực tế:\n  + $T_{active} = 0.5\\text{ s}$ với dòng $I_{active} = 150\\text{ mA}$ (Chạy FFT + TinyML + Gửi MQTT).\n  + $T_{sleep} = 59.5\\text{ s}$ với dòng $I_{sleep} = 10\\text{ }\\mu A = 0.01\\text{ mA}$.\n  + Chu kỳ tổng: $T = 60\\text{ s}$.\n  $$I_{avg} = \\frac{0.5 \\times 150 + 59.5 \\times 0.01}{60} = \\frac{75 + 0.595}{60} \\approx 1.26\\text{ mA}$$\n- Tuổi thọ pin với viên pin 2400mAh (xét hệ số xả an toàn 80%):\n  $$\\text{Life} = \\frac{2400 \\times 0.8}{1.26 \\times 24} \\approx 63.5\\text{ ngày}$$\n  Nếu tăng thời gian ngủ lên 10 phút, tuổi thọ pin tăng vọt lên **hơn 2 năm**!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Bỏ qua dòng tự xả của Pin (Self-Discharge):** Mọi loại pin đều tự hao hụt từ 1% đến 3% dung lượng mỗi năm dù không sử dụng.\n❌ **Sụt áp dưới tải lớn (Voltage Sag):** Khi Wi-Fi phát công suất lớn làm dòng điện tăng vọt tức thì lên 300mA, nội trở của pin cũ làm điện áp tụt xuống dưới 2.7V gây sập nguồn vi điều khiển (Brownout Reset).",
        "code": "// Hàm C tính toán tuổi thọ pin ước tính theo ngày\nfloat calculate_battery_life_days(float battery_capacity_mah, \n                                  float active_time_sec, float active_current_ma,\n                                  float sleep_time_sec, float sleep_current_ma) {\n    float total_cycle_time = active_time_sec + sleep_time_sec;\n    float avg_current_ma = (active_time_sec * active_current_ma + sleep_time_sec * sleep_current_ma) / total_cycle_time;\n    \n    // Hệ số an toàn 80% dung lượng hữu dụng\n    float usable_capacity = battery_capacity_mah * 0.8f;\n    float hours = usable_capacity / avg_current_ma;\n    return hours / 24.0f;\n}"
},
    "t29": {
        "title": "Thiết kế kịch bản thử nghiệm tải liên tục 24/7 (Stress Testing) và chống rò rỉ RAM (Memory Leak)",
        "stageName": "Bước 8: Đồ Án Tốt Nghiệp A+ & Phỏng Vấn Tuyển Dụng",
        "skill": "Long-Term Soak Stress Testing & Leak Profiling",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Một thiết bị chạy được 15 phút trong phòng thí nghiệm không có nghĩa là nó sẽ sống sót được 6 tháng ngoài nhà máy.\n- Hiện tượng rò rỉ bộ nhớ (Memory Leak) giống như một vết nứt nhỏ li ti trên đáy tàu: mỗi giây chỉ rò rỉ 1 giọt nước (vài byte RAM). Ban đầu tàu vẫn chạy phăng phăng, nhưng sau vài tuần lênh đênh trên biển, nước ngập đầy khoang và con tàu chìm nghỉm!\n- ✅ **Kịch bản Soak Testing 72 giờ:** Cho thiết bị chạy tải tối đa liên tục trong môi trường nhiệt độ cao (45°C), ghi nhận biểu đồ suy giảm bộ nhớ để chứng minh độ bền bỉ.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Theo dõi 2 chỉ số bộ nhớ bằng API `esp_heap_caps`:\n  + `free_heap`: Dung lượng RAM tự do tức thời.\n  + `min_free_heap` (Heap Watermark): Điểm tụt RAM thấp nhất trong lịch sử.\n- Nếu `free_heap` sau 10,000 chu kỳ suy luận bằng đúng `free_heap` ban đầu: Bằng chứng thép chứng minh hệ thống không bị rò rỉ bộ nhớ!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Phân mảnh Heap giả rò rỉ:** Tổng RAM còn 50KB nhưng hàm malloc vẫn thất bại vì không có khối nhớ nào liên tục. Khắc phục: chuyển toàn bộ sang cấp phát tĩnh Static Allocation.",
        "code": "// Module giám sát rò rỉ bộ nhớ định kỳ cho bài kiểm thử 24/7\nvoid memory_health_monitor_task(void *pvParam) {\n    size_t initial_heap = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);\n    while (1) {\n        vTaskDelay(pdMS_TO_TICKS(60000)); // Kiểm tra mỗi phút một lần\n        size_t current_heap = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);\n        size_t min_heap = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);\n\n        ESP_LOGI(\"SOAK_TEST\", \"RAM hiện tại: %u | Điểm thấp nhất: %u | Chênh lệch ban đầu: %d bytes\",\n                 current_heap, min_heap, (int)(current_heap - initial_heap));\n    }\n}"
},
    "t30": {
        "title": "Đánh giá mô hình Edge AI: Ma trận nhầm lẫn (Confusion Matrix), Độ chính xác (Accuracy), F1-Score",
        "stageName": "Bước 8: Đồ Án Tốt Nghiệp A+ & Phỏng Vấn Tuyển Dụng",
        "skill": "Edge AI Scientific Metric Benchmarking",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Khi bảo vệ đồ án tốt nghiệp hoặc báo cáo dự án với khách hàng, câu nói *\"Mô hình của em chạy rất chính xác\"* hoàn toàn không có giá trị chuyên môn.\n- Bạn bắt buộc phải đưa ra các con số định lượng khoa học: Ma trận nhầm lẫn (Confusion Matrix), Accuracy, Precision, Recall và F1-Score được đo đạc trực tiếp trên tập dữ liệu thử nghiệm thực tế.\n- Ẩn dụ: Nếu trong 100 chuyến bay có 99 chuyến an toàn và 1 chuyến rơi, một mô hình luôn đoán \"An toàn\" sẽ đạt độ chính xác ảo 99% (Accuracy = 99%), nhưng mô hình đó hoàn toàn vô dụng vì nó bỏ sót đúng 1 vụ tai nạn chết người! Đó là lý do chỉ số Recall và F1-Score quan trọng gấp mười lần Accuracy đơn thuần.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Các định nghĩa cơ bản:\n  + **TP (True Positive):** Sự cố thực sự xảy ra và mô hình phát chuông báo đúng.\n  + **FP (False Positive):** Máy móc bình thường nhưng mô hình báo động giả.\n  + **FN (False Negative):** Máy hỏng nhưng mô hình không phát hiện ra (Nguy hiểm nhất!).\n- Công thức:\n  $$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}, \\quad \\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$\n  $$\\text{F1-Score} = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Đo đạc trên tập dữ liệu mất cân bằng (Class Imbalance):** 95% mẫu là bình thường, chỉ 5% mẫu là lỗi. Nếu mô hình đoán bừa ra \"Bình thường\", Accuracy vẫn đạt 95%. Luôn dùng F1-Score để đánh giá sự công bằng giữa các lớp.",
        "code": "// Cấu trúc và hàm tính toán ma trận nhầm lẫn trực tiếp trên nhúng\ntypedef struct {\n    int tp, fp, fn, tn;\n} ClassMetrics_t;\n\nvoid calculate_scientific_metrics(const ClassMetrics_t *m) {\n    float precision = (float)m->tp / (m->tp + m->fp + 1e-6f);\n    float recall = (float)m->tp / (m->tp + m->fn + 1e-6f);\n    float f1 = 2.0f * (precision * recall) / (precision + recall + 1e-6f);\n\n    printf(\"=== ĐÁNH GIÁ KHOA HỌC MÔ HÌNH EDGE AI ===\\n\");\n    printf(\"Precision (Độ chuẩn xác): %.4f (%.2f%%)\\n\", precision, precision * 100.0f);\n    printf(\"Recall    (Độ thu hồi):   %.4f (%.2f%%)\\n\", recall, recall * 100.0f);\n    printf(\"F1-Score  (Chỉ số F1):     %.4f\\n\", f1);\n}"
},
    "t31": {
        "title": "Hoàn thiện tài liệu kiến trúc hệ thống (System Architecture Document) và sơ đồ khối",
        "stageName": "Bước 8: Đồ Án Tốt Nghiệp A+ & Phỏng Vấn Tuyển Dụng",
        "skill": "Embedded System Architecture & Block Diagram",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Tài liệu kiến trúc hệ thống (System Architecture Document - SAD) là bản thiết kế tổng thể giúp hội đồng đánh giá và các kỹ sư khác trong nhóm hiểu được cách toàn bộ hệ thống vận hành mà không cần phải đọc từng dòng code.\n- Ẩn dụ: Nếu bạn xây nhà mà không có bản vẽ kiến trúc phân tầng (tầng hầm móng, tầng trệt, tầng lầu, hệ thống điện nước), thợ điện và thợ nề sẽ đục phá tường của nhau làm sập nhà.\n- Kiến trúc nhúng chuẩn mực luôn phân tách thành **Mô hình 4 tầng (4-Layer Architecture)**:\n  1. Tầng Phần cứng (Hardware: ESP32-S3, Cảm biến, Nguồn).\n  2. Tầng Trừu tượng hóa Phần cứng (HAL & Trình điều khiển Driver).\n  3. Tầng Hệ điều hành & Trung gian (FreeRTOS, Wi-Fi Stack, DSP Library).\n  4. Tầng Ứng dụng & Trí tuệ nhân tạo (TFLite Micro, State Machine, MQTT App).\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Nguyên tắc thiết kế **Coupling lỏng (Loose Coupling) & Cohesion cao (High Cohesion)**: Mỗi module chỉ làm đúng một nhiệm vụ và giao tiếp với nhau qua các Interface con trỏ hàm hoặc FreeRTOS Queue.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Kiến trúc Spaghetti (Mì ống):** Gọi trực tiếp lệnh ghi thanh ghi GPIO bên trong thuật toán suy luận TinyML, khiến mã nguồn bị dính chặt với phần cứng và không thể tái sử dụng.",
        "code": "/* CẤU TRÚC THƯ MỤC CHUẨN CÔNG NGHIỆP CHO DỰ ÁN EMBEDDED AI:\nedge_ai_project/\n├── components/\n│   ├── bsp/             # Board Support Package (Định nghĩa chân, nguồn)\n│   ├── sensors/         # Driver I2C/I2S trừu tượng hóa\n│   ├── dsp_engine/      # FFT, Hanning Window, Lọc số\n│   ├── ai_model/        # TFLite Micro runtime, Model Flatbuffer\n│   └── network/         # Wi-Fi State Machine, MQTT Client\n├── main/\n│   ├── app_main.c       # Khởi tạo và liên kết các Task FreeRTOS\n│   └── system_config.h  # Hằng số cấu hình toàn hệ thống\n└── partitions.csv       # Bảng phân vùng Flash Dual-Bank OTA\n*/"
},
    "t32": {
        "title": "Kỹ năng trình bày và thuyết phục hội đồng phản biện đồ án kỹ thuật",
        "stageName": "Bước 8: Đồ Án Tốt Nghiệp A+ & Phỏng Vấn Tuyển Dụng",
        "skill": "Engineering Thesis Defense & Technical Pitching",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Một buổi bảo vệ đồ án tốt nghiệp xuất sắc (hoặc buổi thuyết trình giải pháp kỹ thuật trước khách hàng) không phải là buổi đọc lại tài liệu Word.\n- Ẩn dụ: Bạn là một luật sư đang bào chữa cho đứa con tinh thần của mình trước tòa án. Ban giám khảo không muốn nghe lý thuyết sách giáo khoa về việc vi điều khiển là gì hay AI là gì. Họ muốn thấy: **Bạn đã giải quyết được vấn đề thực tế gì? Số liệu đo đạc có đáng tin cậy không? Chi phí sản xuất là bao nhiêu?**\n\n### 📌 2. CẤU TRÚC BÀI THUYẾT TRÌNH KỸ THUẬT CHUẨN MỰC (15 PHÚT)\n1. **Phút 1-3 (Đặt vấn đề & Mục tiêu):** Sự cố hỏng hóc vòng bi động cơ gây thiệt hại hàng tỷ đồng; mục tiêu là phát hiện sớm tại biên với chi phí phần cứng < 15$.\n2. **Phút 4-7 (Kiến trúc & Điểm đột phá kỹ thuật):** Trình bày sơ đồ 4 tầng, kỹ thuật FFT tăng tốc SIMD 0.72ms và lượng tử hóa INT8 tiết kiệm 75% RAM.\n3. **Phút 8-11 (Số liệu đo đạc khoa học):** Trình chiếu biểu đồ đo độ trễ thực tế, ma trận nhầm lẫn F1-Score 98.2% và kết quả thử nghiệm 72h không rò rỉ RAM.\n4. **Phút 12-15 (Trình diễn trực tiếp & Kết luận):** Demo trực tiếp mô hình nhận diện rung động theo thời gian thực và trả lời câu hỏi phản biện.\n\n### 📌 3. CÁC CÂU HỎI HÓC BÚA THƯỜNG GẶP VÀ CÁCH ĐỐI ĐÁP\n- *Hỏi: \"Tại sao không gửi toàn bộ dữ liệu âm thanh lên Cloud để xử lý AI cho mạnh?\"*\n  -> *Đáp: \"Dạ thưa thầy, gửi 32KB/s lên Cloud sẽ ngốn băng thông và tốn chi phí máy chủ hàng tháng. Xử lý Edge AI trên ESP32-S3 chỉ tốn 11ms, hoạt động được ngay cả khi mất mạng internet và tiết kiệm 99% năng lượng truyền sóng!\"*",
        "code": "// KHUNG MẪU SỐ LIỆU ĐỊNH LƯỢNG TRÌNH CHIẾU TRƯỚC HỘI ĐỒNG:\n/*\n+-----------------------+-----------------------+-----------------------+\n| TIÊU CHÍ KỸ THUẬT     | GIẢI PHÁP THÔNG THƯỜNG| ĐỒ ÁN ĐỀ XUẤT         |\n+-----------------------+-----------------------+-----------------------+\n| Độ phân giải mô hình  | Float32 (380 KB)      | INT8 Quantized (96 KB)|\n| Thời gian suy luận    | 65.0 ms               | 11.2 ms (SIMD Vector) |\n| Bộ nhớ RAM tiêu hao   | 180 KB Heap           | 48 KB Static Arena    |\n| Tỷ lệ rò rỉ bộ nhớ    | Không xác định        | 0 bytes sau 72 giờ    |\n| Độ chính xác F1-Score | 96.1%                 | 98.3%                 |\n+-----------------------+-----------------------+-----------------------+\n*/"
},
    "t33": {
        "title": "Phân tích sâu từ khóa 'volatile': Khi nào trình biên dịch tối ưu sai và cách khắc phục",
        "stageName": "Bước 9: 10 Bẫy C Khi Phỏng Vấn Kỹ Sư Nhúng",
        "skill": "Volatile Keyword Deep-Dive",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trình biên dịch C (GCC/Clang) hiện đại rất thông minh nhưng cũng rất nguy hiểm: với cờ tối ưu hóa `-O2` hoặc `-O3`, nó liên tục tìm cách tăng tốc độ thực thi bằng cách nạp giá trị của biến từ RAM vào một thanh ghi CPU nội (Register Cache) và giữ nguyên ở đó, không bao giờ đọc lại từ RAM nữa.\n- Ẩn dụ: Bạn cử một nhân viên ngồi trong phòng làm việc theo dõi đèn giao thông ngoài đường. Thay vì mỗi giây phải mở cửa sổ nhìn ra ngã tư (đọc RAM tốn chu kỳ), nhân viên đó chỉ nhìn ra cửa sổ đúng 1 lần lúc sáng sớm rồi ghi vào sổ tay: \"Đèn đang màu Đỏ\" (nạp vào thanh ghi CPU). Sau đó cả ngày nhân viên chỉ nhìn vào cuốn sổ tay đó mà không bao giờ mở cửa sổ nữa! Dù ngoài ngã tư đèn đã chuyển sang Xanh từ lâu, nhân viên vẫn báo xe dừng lại.\n- ✅ **Từ khóa `volatile`**: Bắt buộc nhân viên: *\"Mỗi lần cần biết màu đèn, cấm không được nhìn vào sổ tay, bắt buộc phải mở cửa sổ nhìn trực tiếp ra đường!\"*\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- 3 trường hợp BẮT BUỘC dùng `volatile`:\n  1. Con trỏ trỏ tới thanh ghi ngoại vi phần cứng: `volatile uint32_t * const REG = (uint32_t*)0x3FF44008;`\n  2. Biến toàn cục được sửa đổi bên trong hàm ngắt ISR và đọc trong Task chính.\n  3. Cờ chia sẻ giữa nhiều tác vụ trong FreeRTOS (khi không dùng Queue/Mutex).\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Vòng lặp vô tận (Infinite Loop Bug):**\n```c\nbool is_ready = false; // Thiếu volatile!\nvoid isr() { is_ready = true; }\nvoid task() { while (!is_ready); } // Bị tối ưu thành while(true) làm treo cứng CPU!\n```\n❌ **Lầm tưởng volatile là nguyên tử (Atomic):** Phép toán `count++` trên biến volatile thực chất là 3 lệnh Assembly: Đọc -> Sửa -> Ghi. Nếu có ngắt xen vào giữa, giá trị vẫn bị sai lệch Race Condition! Vẫn bắt buộc phải dùng Critical Section hoặc Atomic Operation.",
        "code": "// So sánh trực quan mã Assembly có và không có volatile:\n/*\n1. Khi KHÔNG CÓ volatile:\nbool flag = false;\nwhile (!flag);\n-> Assembly dịch thành:\n    L32R    a2, flag       // Nạp giá trị flag vào thanh ghi a2 đúng 1 lần\n.L1:\n    BEQZ    a2, .L1        // Nếu a2 == 0 thì nhảy lặp lại tại chỗ vô tận!\n                           // CPU KHÔNG BAO GIỜ đọc lại từ RAM nữa!\n\n2. Khi CÓ volatile:\nvolatile bool flag = false;\nwhile (!flag);\n-> Assembly dịch thành:\n.L2:\n    L32R    a2, flag_addr  // Lấy địa chỉ của flag\n    L8UI    a3, a2, 0      // ĐỌC LẠI TỪ RAM MỖI VÒNG LẶP!\n    BEQZ    a3, .L2        // Nếu giá trị trong RAM thay đổi, vòng lặp lập tức thoát!\n*/"
},
    "t34": {
        "title": "Hiểu rõ cơ chế căn lề bộ nhớ (Memory Alignment) và bẫy Struct Padding",
        "stageName": "Bước 9: 10 Bẫy C Khi Phỏng Vấn Kỹ Sư Nhúng",
        "skill": "Struct Padding & Memory Alignment Traps",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Vi xử lý 32-bit (như Xtensa LX7 của ESP32-S3) có đường bus dữ liệu nội bộ rộng đúng **32 bits (4 bytes)**.\n- Ẩn dụ: Chiếc xe nâng hàng trong nhà kho được thiết kế để nâng mỗi lần đúng một thùng hàng 4 tầng (4-byte Word). Nếu một gói hàng được đặt nằm vắt vẻo giữa tầng 3 của kiện này và tầng 1 của kiện kia (Unaligned data), xe nâng sẽ phải mất **2 chuyến đi** để lấy đủ một gói hàng, làm tốc độ giảm đi một nửa!\n- Để tối ưu tốc độ, trình biên dịch C tự động chèn các **byte rác rỗng (Padding Bytes)** vào giữa các biến trong `struct` để mọi biến 32-bit đều nằm ở địa chỉ chia hết cho 4.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\nHãy phân tích struct sau:\n```c\nstruct BadStruct {\n    char a;      // 1 byte  --> [+3 bytes padding rác để b nằm ở địa chỉ chia hết cho 4]\n    int b;       // 4 bytes --> [Nằm ở offset 4]\n    char c;      // 1 byte  --> [+3 bytes padding rác ở cuối để tổng kích thước chia hết cho 4]\n}; // Tổng kích thước = 1 + 3 + 4 + 1 + 3 = 12 bytes! Lãng phí 50% RAM!\n```\n- ✅ **Kỹ thuật tối ưu cấu trúc (Reordering):**\n  Sắp xếp lại thứ tự khai báo từ biến có kích thước lớn đến biến có kích thước nhỏ:\n  ```c\n  struct GoodStruct {\n      int b;   // 4 bytes (offset 0)\n      char a;  // 1 byte  (offset 4)\n      char c;  // 1 byte  (offset 5)\n               // [+2 bytes padding ở cuối]\n  }; // Tổng kích thước = 8 bytes! Tiết kiệm 33% RAM ngay lập tức!\n  ```\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Gửi struct chưa packed qua mạng:** Nếu gửi một struct có padding qua CAN Bus hoặc I2C, bên nhận có thể là một chip 8-bit hoặc 16-bit (không có cùng padding), dẫn đến bên nhận đọc lệch toàn bộ vị trí các trường dữ liệu! Bắt buộc dùng `__attribute__((packed))` khi giao tiếp truyền thông.",
        "code": "// Tối ưu hóa Struct và đóng gói Packed không byte rác\n#include <stdio.h>\n#include <stdint.h>\n\n// Struct packed không chứa byte rác (Dùng cho gói tin mạng CAN/I2C)\ntypedef struct __attribute__((packed)) {\n    uint8_t  command_id;  // 1 byte\n    uint32_t payload_len; // 4 bytes (nằm ngay sát sau byte 0)\n    uint16_t checksum;    // 2 bytes\n} NetworkPacket_t; // sizeof = đúng 7 bytes!\n\nvoid verify_alignment(void) {\n    printf(\"Kích thước NetworkPacket_t: %u bytes (Khớp 100%% luồng byte thô)\\n\", \n           sizeof(NetworkPacket_t));\n}"
},
    "t35": {
        "title": "Làm chủ mảng con trỏ hàm (Function Pointer Table) trong việc xây dựng State Machine",
        "stageName": "Bước 9: 10 Bẫy C Khi Phỏng Vấn Kỹ Sư Nhúng",
        "skill": "Function Pointer Tables & O(1) State Machines",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trong các hệ thống điều khiển nhúng công nghiệp (máy bán hàng, robot, thiết bị đo lường), chương trình thường được tổ chức dưới dạng **Máy trạng thái hữu hạn (Finite State Machine - FSM)** gồm hàng chục trạng thái khác nhau.\n- Ẩn dụ: Nếu bạn muốn tìm số điện thoại của một người bạn có tên bắt đầu bằng chữ \"T\", cách làm ngớ ngẩn nhất là lật từ trang đầu tiên chữ \"A\", \"B\", \"C\"... duyệt tuần tự 50 trang (cấu trúc `switch-case` 50 nhánh). Bảng con trỏ hàm giống như mục lục tra cứu nhanh: bạn lật thẳng đến trang chữ \"T\" trong đúng 1 bước!\n- Bảng con trỏ hàm (Dispatch Table) cho phép chuyển đổi trạng thái trong độ phức tạp **$O(1)$ chỉ tốn đúng 1 chu kỳ máy**, hoàn toàn không phụ thuộc vào số lượng trạng thái!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Định nghĩa kiểu con trỏ hàm:\n  `typedef void (*StateFunc_t)(void);`\n- Khởi tạo mảng các con trỏ hàm trong phân đoạn Flash `.rodata`:\n  `static const StateFunc_t fsm_table[] = { state_init, state_idle, state_run, state_error };`\n- Thực thi trạng thái hiện tại:\n  `fsm_table[current_state]();`\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Chỉ số mảng vượt biên (Out-of-bounds Indexing):** Nếu biến `current_state` bị lỗi dữ liệu nhận giá trị `99` trong khi mảng chỉ có 4 phần tử, CPU sẽ nhảy đến một địa chỉ rác ngẫu nhiên trong bộ nhớ và gây ngắt sập nguồn tử thần! Luôn kiểm tra `if (state < MAX_STATES)` trước khi gọi hàm.",
        "code": "// Cài đặt FSM chuyển trạng thái O(1) bằng Function Pointer Table\ntypedef enum {\n    STATE_INIT = 0,\n    STATE_IDLE,\n    STATE_SAMPLING,\n    STATE_INFERENCE,\n    STATE_MAX\n} SystemState_t;\n\ntypedef void (*StateAction_t)(void);\n\nvoid do_init(void)      { /* Khởi tạo phần cứng */ }\nvoid do_idle(void)      { /* Chờ tín hiệu ngắt */ }\nvoid do_sampling(void)  { /* Đọc I2C cảm biến */ }\nvoid do_inference(void) { /* Chạy mô hình TinyML */ }\n\n// Bảng con trỏ hàm đặt trong Flash ROM chỉ đọc\nstatic const StateAction_t s_state_table[STATE_MAX] = {\n    [STATE_INIT]      = do_init,\n    [STATE_IDLE]      = do_idle,\n    [STATE_SAMPLING]  = do_sampling,\n    [STATE_INFERENCE] = do_inference\n};\n\nvoid fsm_execute(SystemState_t current_state) {\n    // Luôn kiểm tra chỉ số an toàn trước khi gọi hàm\n    if (current_state < STATE_MAX && s_state_table[current_state] != NULL) {\n        s_state_table[current_state](); // Thực thi trong 1 chu kỳ máy!\n    }\n}"
},
    "t36": {
        "title": "Thao tác trực tiếp trên bit (Bitwise Masking) để cấu hình thanh ghi ngoại vi",
        "stageName": "Bước 9: 10 Bẫy C Khi Phỏng Vấn Kỹ Sư Nhúng",
        "skill": "Industrial Bitwise Masking & Manipulation",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Mỗi thanh ghi phần cứng của vi điều khiển 32-bit là một bảng điều khiển gồm 32 công tắc nhỏ xíu (các bit từ 0 đến 31).\n- Ẩn dụ: Nếu trên bảng điều khiển có 32 công tắc đèn của một tòa nhà, bạn chỉ muốn bật công tắc đèn số 5 mà không được làm tắt các đèn khác đang sáng, bạn không thể đập đi xây lại toàn bộ bảng điện! Bạn phải sử dụng các phép toán logic bitwise để can thiệp chính xác vào đúng bit số 5.\n\n### 📌 2. 4 CÂU THẦN CHÚ THAO TÁC BIT BẮT BUỘC THUỘC LÒNG\n1. **Bật bit thứ n (Set bit lên 1):**\n   `REG |= (1U << n);` (Dùng phép OR `|`)\n2. **Xóa bit thứ n (Clear bit về 0):**\n   `REG &= ~(1U << n);` (Dùng phép AND `&` với đảo NOT `~`)\n3. **Đảo trạng thái bit thứ n (Toggle bit 0<->1):**\n   `REG ^= (1U << n);` (Dùng phép XOR `^`)\n4. **Kiểm tra bit thứ n (Check bit):**\n   `if (REG & (1U << n)) { /* Bit đang bằng 1 */ }`\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên hậu tố U (Unsigned):** Viết `(1 << 31)` là dịch bit trên số nguyên có dấu 32-bit (signed int). Khi bit 1 dịch vào vị trí bit dấu, chuẩn C định nghĩa đây là **Hành vi bất định (Undefined Behavior)**! Luôn viết tường minh: `(1U << 31)`.\n❌ **Nhầm lẫn giữa toán tử logic và toán tử bit:** Dùng `||` thay vì `|`, hoặc dùng `&&` thay vì `&`. Lỗi này không gây lỗi biên dịch nhưng làm sai lệch hoàn toàn thanh ghi phần cứng!",
        "code": "// Macro thao tác bitwise chuẩn MISRA C an toàn tuyệt đối\n#define BIT_SET(reg, bit)     ((reg) |= (1U << (bit)))\n#define BIT_CLEAR(reg, bit)   ((reg) &= ~(1U << (bit)))\n#define BIT_TOGGLE(reg, bit)  ((reg) ^= (1U << (bit)))\n#define BIT_CHECK(reg, bit)   (((reg) & (1U << (bit))) != 0U)\n\n// Ghi một trường giá trị nhiều bit (Field Insertion)\n// Ví dụ: Ghi giá trị 3-bit (val) vào vị trí từ bit 4 đến bit 6 của thanh ghi\n#define FIELD_WRITE(reg, mask, shift, val) \\\n    ((reg) = (((reg) & ~((mask) << (shift))) | (((val) & (mask)) << (shift))))"
},
    "t37": {
        "title": "Đọc Datasheet & Lập trình ngoại vi trực tiếp qua Thanh ghi trần (Direct Register Access)",
        "stageName": "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        "skill": "Bare-Metal Register-Level Programming",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Kỹ sư nhúng thực thụ không bao giờ phụ thuộc 100% vào các thư viện có sẵn (Arduino hay ESP-IDF HAL). Họ có khả năng mở cuốn **Technical Reference Manual (TRM)** dày 1,500 trang của hãng chip ra, tra cứu địa chỉ vật lý và viết code điều khiển trực tiếp trên kim loại trần (Bare-metal).\n- Ẩn dụ: Sử dụng thư viện HAL giống như đi qua một thông dịch viên: an toàn nhưng chậm chạp. Lập trình thanh ghi trần giống như nói chuyện trực tiếp bằng tiếng mẹ đẻ với phần cứng: tốc độ tức thì trong 1 chu kỳ xung nhịp (~4 nano-giây)!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Mỗi ngoại vi có một **Địa chỉ gốc (Base Address)** và các **Độ lệch (Offset)**:\n  + Ví dụ trên ESP32: Ngoại vi GPIO có Base Address = `0x3FF44000`.\n  + Thanh ghi `GPIO_OUT_W1TS_REG` có Offset = `0x0008`.\n  + Địa chỉ thực tế = $0x3FF44000 + 0x0008 = 0x3FF44008$.\n- Thao tác ghi thanh ghi bằng con trỏ:\n  `*((volatile uint32_t *)0x3FF44008) = (1U << 2);`\n  Lệnh này được dịch thành đúng 1 lệnh máy Assembly `S32I`.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Chưa cấp xung clock ngoại vi đã vội ghi thanh ghi:** Các khối ngoại vi mặc định bị tắt xung clock để tiết kiệm điện (Clock Gating). Nếu chưa bật bit cấp xung trong thanh ghi `DPORT` hoặc `SYSTEM` mà đã cố ghi vào thanh ghi ngoại vi, vi điều khiển sẽ bị treo cứng ngay lập tức!",
        "code": "// Điều khiển chân GPIO2 ở cấp độ thanh ghi trần (Zero Overhead)\n#define GPIO_BASE_REG        0x3FF44000\n#define GPIO_ENABLE_REG      (GPIO_BASE_REG + 0x0020) // Cấu hình Output\n#define GPIO_OUT_W1TS_REG    (GPIO_BASE_REG + 0x0008) // Bật HIGH (Atomic)\n#define GPIO_OUT_W1TC_REG    (GPIO_BASE_REG + 0x000C) // Kéo LOW (Atomic)\n\nvoid baremetal_toggle_led(void) {\n    // 1. Cấu hình chân GPIO2 làm Output\n    *((volatile uint32_t *)GPIO_ENABLE_REG) |= (1U << 2);\n\n    // 2. Bật LED lên mức HIGH trong 1 chu kỳ máy (~4.16ns)\n    *((volatile uint32_t *)GPIO_OUT_W1TS_REG) = (1U << 2);\n\n    // 3. Tắt LED về mức LOW trong 1 chu kỳ máy (~4.16ns)\n    *((volatile uint32_t *)GPIO_OUT_W1TC_REG) = (1U << 2);\n}"
},
    "t38": {
        "title": "Kiến trúc ngắt NVIC / Interrupt Vector Table, Priority Grouping & Nesting",
        "stageName": "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        "skill": "Interrupt Vector Controller (NVIC)",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Bộ điều khiển ngắt (Interrupt Controller) là trái tim quản lý sự ưu tiên của mọi vi xử lý thời gian thực.\n- Ẩn dụ: Bộ điều khiển ngắt giống như một trung tâm điều phối cấp cứu 115. Khi có 3 cuộc gọi cùng lúc: Bệnh nhân đau bụng (mức ưu tiên thấp), Cháy nhà (mức ưu tiên trung bình), Tai nạn giao thông nghiêm trọng (mức ưu tiên cao nhất). Trung tâm điều phối phải quyết định xe cứu thương nào xuất phát trước, và nếu xe cứu thương đang đi mà có vụ tai nạn nghiêm trọng hơn xảy ra, bác sĩ giỏi nhất có thể chuyển sang ca nặng hơn ngay lập tức (**Ngắt lồng nhau - Nested Interrupts**).\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- **Bảng Vector Ngắt (Interrupt Vector Table - IVT):** Mảng các địa chỉ con trỏ hàm được đặt tại đầu bộ nhớ Flash/RAM. Khi phần cứng phát hiện ngắt số $N$, CPU tự động nạp địa chỉ hàm từ ô nhớ $\\text{IVT}[N]$ và nhảy đến thực thi.\n- **Ngắt lồng nhau (Nesting):** Một ngắt có Priority = 5 có thể ngắt quãng một ngắt có Priority = 2 đang chạy dở.\n- **Ngắt không thể che chắn (Non-Maskable Interrupt - NMI):** Mức ngắt cao nhất (Priority 7), không thể bị vô hiệu hóa bởi bất kỳ câu lệnh nào, chuyên dùng để xử lý sự cố nguồn điện sụt áp (Brownout) hoặc lỗi phần cứng nghiêm trọng.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Tràn ngăn xếp do ngắt lồng nhau quá sâu (Nested Stack Overflow):** Nếu các ngắt liên tục lồng nhau qua 10 cấp, mỗi cấp đẩy hàng chục thanh ghi vào Stack sẽ làm tràn bộ nhớ ngăn xếp ngắt (Interrupt Stack) và sập nguồn vi điều khiển.",
        "code": "// Cấu hình ngắt phần cứng đa mức ưu tiên với ESP-IDF\n#include \"esp_intr_alloc.h\"\n\n#define SENSOR_INTR_FLAG ESP_INTR_FLAG_LEVEL3 // Mức ưu tiên 3 (Cao)\n\nvoid IRAM_ATTR high_priority_isr(void *arg) {\n    // Hàm ngắt tốc độ cao xử lý khẩn cấp\n}\n\nvoid register_emergency_interrupt(int source_num) {\n    intr_handle_t handle;\n    // Đăng ký ngắt với mức ưu tiên phần cứng Level 3\n    esp_intr_alloc(source_num, SENSOR_INTR_FLAG | ESP_INTR_FLAG_IRAM,\n                   high_priority_isr, NULL, &handle);\n}"
},
    "t39": {
        "title": "Cơ chế Pipeline, Cache Hit/Miss, Bus Matrix và DMA Arbiter của vi điều khiển",
        "stageName": "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        "skill": "MCU Internal Bus Matrix & Pipeline",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Hiểu sâu kiến trúc phần cứng bên trong con chip là điểm phân biệt giữa một thợ code và một chuyên gia tối ưu hiệu năng.\n- Ẩn dụ:\n  + **Đường ống lệnh (Pipeline):** Giống như tiệm giặt ủi dây chuyền: trong lúc áo số 1 đang sấy, áo số 2 đang giặt, áo số 3 đang phân loại. Cả 3 áo được xử lý song song giúp tăng năng suất gấp 3 lần. Nếu áo số 1 bất ngờ rách phải bỏ (Lệnh rẽ nhánh sai - Branch Misprediction), toàn bộ dây chuyền phải xả nước làm lại từ đầu (Pipeline Flush).\n  + **Ma trận đường truyền (Bus Matrix):** Giống như một ngã tư giao thông lập thể có nhiều cây cầu vượt độc lập (Crossbar Switch): CPU Core 0, CPU Core 1 và bộ điều khiển DMA có thể cùng lúc chạy qua các nhánh đường khác nhau để vào các khối RAM khác nhau mà không bao giờ va chạm nhau!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- **Cache Hit vs Cache Miss:**\n  + Cache Hit: Lệnh hoặc dữ liệu đã có sẵn trong SRAM0/SRAM1 -> Thời gian nạp: **1 chu kỳ máy (~4.16ns)**.\n  + Cache Miss: Lệnh chưa có trong cache, CPU buộc phải dừng lại chờ bộ điều khiển kéo dữ liệu từ Flash SPI ngoài vào -> Thời gian nạp: **hơn 50 chu kỳ máy**!\n- Kỹ thuật đo xung chu kỳ CPU bằng thanh ghi phần cứng `CCOUNT`:\n  ```c\n  uint32_t c0 = esp_cpu_get_cycle_count();\n  do_work();\n  uint32_t cycles = esp_cpu_get_cycle_count() - c0;\n  ```\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Xung đột bộ điều phối DMA (Bus Contention):** Khi cả CPU và DMA cùng cố truy cập vào cùng một khối nhớ SRAM2 trong cùng 1 chu kỳ xung nhịp, DMA Arbiter sẽ ưu tiên DMA và bắt CPU phải chờ (Stall cycles), làm giảm hiệu năng tính toán.",
        "code": "// Kỹ thuật đo số chu kỳ xung nhịp CPU chính xác đến từng lệnh máy\n#include \"esp_cpu.h\"\n\nvoid benchmark_algorithm_cycles(void) {\n    uint32_t start_cycles = esp_cpu_get_cycle_count();\n\n    // Thuật toán cần tối ưu\n    for (int i = 0; i < 100; i++) {\n        asm volatile(\"nop\"); // 1 chu kỳ lệnh rỗng\n    }\n\n    uint32_t total_cycles = esp_cpu_get_cycle_count() - start_cycles;\n    printf(\"Tổng số chu kỳ xung nhịp CPU tiêu hao: %u cycles\\n\", total_cycles);\n}"
},
    "t40": {
        "title": "Hiểu sâu quy trình khởi động MCU: Bootloader, Reset Handler, Startup ASM & Linker Script (.ld)",
        "stageName": "Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        "skill": "Startup Code & Linker Script Anatomy",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Điều gì thực sự xảy ra trong 10 mili-giây đầu tiên khi bạn cấp điện cho vi điều khiển trước khi hàm `app_main()` được gọi?\n- Ẩn dụ: Khởi động chip giống như việc chuẩn bị mở cửa một nhà hàng vào buổi sáng. Trước khi đầu bếp trưởng bước vào nấu ăn (`app_main`), đội ngũ phục vụ (Bootloader & Startup Code) phải: lau dọn sạch sẽ các bàn ăn về số 0 (xóa phân đoạn `.bss`), xếp các gia vị chuẩn bị sẵn từ kho lạnh lên bếp (sao chép phân đoạn `.data` từ Flash vào RAM) và phân chia chìa khóa tủ đồ cho nhân viên (khởi tạo con trỏ Stack Pointer).\n\n### 📌 2. VÒNG ĐỜI KHỞI ĐỘNG 3 GIAI ĐOẠN TRÊN ESP32-S3\n1. **Giai đoạn 1 (First-Stage ROM Bootloader):** Mã nhị phân được đúc cứng vĩnh viễn trong chip ROM từ nhà máy. Khi chân Reset nhả ra, CPU nhảy đến địa chỉ `0x40000000` đọc trạng thái các chân nạp (Strapping Pins). Nếu bình thường, nó nạp Bootloader cấp 2 từ Flash vào RAM.\n2. **Giai đoạn 2 (Second-Stage Bootloader):** Đọc Partition Table, kiểm tra cờ OTA trong phân vùng `otadata` và nạp header của bản firmware hợp lệ.\n3. **Giai đoạn 3 (Application Startup in ASM):**\n   - Khởi tạo con trỏ ngăn xếp `SP` tại đỉnh RAM.\n   - Sao chép dữ liệu từ Flash ROM (`.rodata`) vào RAM (`.data`).\n   - Xóa trắng toàn bộ vùng nhớ `.bss` về số 0.\n   - Khởi tạo bộ lập lịch FreeRTOS và gọi hàm `app_main()`.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Chân Strapping Pin bị kéo sai mức logic:** Ví dụ chân GPIO0 bị kéo xuống LOW lúc bật nguồn sẽ ép chip vào chế độ nạp Firmware Download Mode thay vì chạy code ứng dụng, khiến chip im lìm không chạy.",
        "code": "/* Trích đoạn Linker Script (.ld) giải thích các phân đoạn bộ nhớ:\nSECTIONS {\n  .iram0.text : {       # Mã ngắt ISR tốc độ cao nằm trong SRAM0\n    *(.iram1.text)\n  } > iram0_0_seg\n\n  .dram0.data : {       # Biến toàn cục có khởi tạo giá trị (int x = 10)\n    *(.data)            # Startup code chép đoạn này từ Flash vào RAM\n  } > dram0_0_seg\n\n  .dram0.bss : {        # Biến toàn cục chưa khởi tạo (int y)\n    *(.bss)             # Startup code tự động xóa trắng về 0\n  } > dram0_0_seg\n}\n*/"
},
    "t41": {
        "title": "Sử dụng máy phân tích logic (Logic Analyzer) giải mã tín hiệu UART, I2C, SPI",
        "stageName": "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        "skill": "Hardware Protocol Decoding with Logic Analyzer",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Khi giao tiếp phần cứng giữa vi điều khiển và cảm biến bị lỗi, màn hình máy tính chỉ hiện một dòng thông báo vô vọng: `ESP_ERR_TIMEOUT`.\n- Bạn không thể biết lỗi do code sai, do hỏng cảm biến, do đứt dây, hay do nhiễu sóng.\n- Ẩn dụ: Máy phân tích logic (Logic Analyzer) giống như chiếc kính hiển vi của bác sĩ: nó cho phép bạn nhìn thấy từng xung điện áp 0V và 3.3V đang thực sự chạy trên dây dẫn từng micro-giây, bóc trần mọi bí mật của phần cứng!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Máy phân tích logic lấy mẫu điện áp với tần số cao (ví dụ 24MHz) trên 8 kênh độc lập.\n- Sử dụng phần mềm mã nguồn mở **PulseView (Sigrok)**:\n  + Chọn bộ giải mã giao thức (Protocol Decoder): I2C, SPI hoặc UART.\n  + Quan sát chi tiết từng khung bit: Start bit, Địa chỉ thiết bị 7-bit, Bit R/W, Cờ phản hồi ACK (0) hay NACK (1), và Stop bit.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên nối chân GND (Mass chung):** Cắm que đo vào chân SCL và SDA nhưng quên cắm chân GND giữa Logic Analyzer và board ESP32, khiến máy đo đọc ra toàn xung nhiễu ngẫu nhiên!\n❌ **Tần số lấy mẫu của máy đo quá thấp:** Định lý Nyquist yêu cầu tần số lấy mẫu phải lớn hơn ít nhất 4 lần tần số tín hiệu. Nếu bus I2C chạy ở 400kHz, máy đo bắt buộc phải đặt ở mức **2MHz đến 8MHz** trở lên.",
        "code": "// Kỹ thuật gán chân GPIO làm xung Debug để đo đạc bằng Logic Analyzer\n#define PROBE_PIN GPIO_NUM_4\n\nvoid init_debug_probe(void) {\n    gpio_set_direction(PROBE_PIN, GPIO_MODE_OUTPUT);\n    gpio_set_level(PROBE_PIN, 0);\n}\n\nvoid timed_function_execution(void) {\n    // Kéo chân lên HIGH: Đánh dấu thời điểm BẮT ĐẦU hàm\n    gpio_set_level(PROBE_PIN, 1);\n\n    run_tinyml_inference_step(); // Hàm cần đo thời gian\n\n    // Kéo chân về LOW: Đánh dấu thời điểm KẾT THÚC hàm\n    gpio_set_level(PROBE_PIN, 0);\n    // Đo độ rộng xung HIGH trên PulseView để biết thời gian chính xác tới nano-giây!\n}"
},
    "t42": {
        "title": "Bắt lỗi Crash vi điều khiển: Đọc Crash Dump, Guru Meditation, Stack Trace với addr2line",
        "stageName": "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        "skill": "Guru Meditation Crash & Stack Decoding",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Khi mã nguồn gặp lỗi nghiêm trọng (như đọc con trỏ NULL, chia cho 0, hoặc tràn ngăn xếp), CPU Xtensa lập tức phát sinh ngắt ngoại lệ Panic và in ra màn hình Serial một khối mã Hexa bí ẩn gọi là **Guru Meditation Error**.\n- Ẩn dụ: Khối mã này giống như \"Hộp đen máy bay\" ghi lại khoảnh khắc trước khi máy bay rơi. Kỹ sư nhúng chuyên nghiệp không bao giờ ngồi đoán mò hay chèn bừa `printf` để tìm lỗi. Họ mở hộp đen ra và định vị chính xác tên file C và số dòng code gây lỗi chỉ trong **5 giây**!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Khối Crash Dump chứa các thanh ghi sinh tử:\n  + `PC (Program Counter)`: Địa chỉ lệnh máy đang thực thi đúng lúc sập nguồn.\n  + `EXCVADDR (Exception Address)`: Địa chỉ ô nhớ mà CPU cố truy cập trái phép (nếu bằng `0x00000000` -> lỗi con trỏ NULL!).\n  + `A0`: Return Address (địa chỉ của hàm gọi hàm hiện tại).\n  + `A1`: Stack Pointer.\n- **Công cụ giải mã `addr2line`:**\n  Chuyển đổi địa chỉ Hexa của PC thành tên file và dòng code:\n  ```bash\n  xtensa-esp32s3-elf-addr2line -pfia -e build/firmware.elf 0x4200b21a\n  ```\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Dùng file .elf không khớp với bản nạp trên mạch:** Nếu bạn sửa code rồi nạp vào mạch, nhưng khi chạy lệnh addr2line lại trỏ vào file .elf cũ, số dòng code trả về sẽ bị sai lệch hoàn toàn. Luôn giữ file .elf tương ứng với bản firmware đang chạy.",
        "code": "/* VÍ DỤ GIẢI MÃ CRASH DUMP THỰC TẾ:\nMàn hình Serial báo lỗi:\nGuru Meditation Error: Core 1 panic'ed (LoadProhibited). Exception was unhandled.\nCore 1 register dump:\nPC      : 0x42001a4e  PS      : 0x00060830  A0      : 0x82001b60  A1      : 0x3ffb6120\nEXCVADDR: 0x00000000\n\nThực thi lệnh giải mã trên Terminal:\n$ xtensa-esp32s3-elf-addr2line -pfia -e build/my_app.elf 0x42001a4e\n\nKết quả hiển thị chính xác:\n0x42001a4e: process_imu_packet at d:/web/main/imu_driver.c:85\n-> Dòng 85 trong file imu_driver.c chính là thủ phạm cố đọc con trỏ NULL!\n*/"
},
    "t43": {
        "title": "Debug phần cứng chuẩn JTAG với OpenOCD và GDB (Hardware Breakpoint, Watchpoint)",
        "stageName": "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        "skill": "JTAG In-Circuit Debugging & GDB",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Cổng gỡ lỗi JTAG (Joint Test Action Group) là giao diện phần cứng cho phép máy tính can thiệp trực tiếp vào từng thanh ghi và đường bus bên trong lõi vi xử lý.\n- Ẩn dụ: Nếu dùng `printf` giống như bạn chỉ có thể đứng ngoài cửa phòng bệnh nhân nghe tiếng kêu la; thì JTAG giống như bạn có một cỗ máy chụp cộng hưởng từ MRI: bạn có thể tạm dừng tim bệnh nhân đập (Pause CPU), xem từng giọt máu trong tĩnh mạch (soi giá trị từng ô nhớ RAM) rồi cho tim đập tiếp!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- ESP32-S3 tích hợp sẵn bộ chuyển đổi **USB-to-JTAG** ngay bên trong chip silicon (kết nối trực tiếp qua chân GPIO 19 và 20 mà không cần mạch nạp ngoài).\n- Kết nối thông qua cầu nối **OpenOCD** và trình gỡ lỗi **GDB (GNU Debugger)**.\n- **Hai tính năng thần thánh:**\n  1. **Hardware Breakpoint:** Dừng CPU tại một dòng code xác định mà không làm thay đổi mã máy trong Flash ROM.\n  2. **Data Watchpoint:** Dừng CPU ngay lập tức khi có một tác vụ nào đó cố tình ghi đè giá trị vào một ô nhớ cụ thể (Vũ khí tối thượng để bắt lỗi con trỏ ghi đè bộ nhớ lung tung).\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Chân USB D+/D- bị đấu sai:** Cắm nhầm chân USB PHY ngoại vi khiến OpenOCD báo lỗi `Error: unable to open ftdi device`.\n❌ **CPU bị dừng làm kích hoạt Watchdog Reset:** Khi CPU bị tạm dừng tại Breakpoint, bộ đếm thời gian của Watchdog phần cứng có thể vẫn đếm và kích hoạt reset chip. OpenOCD của ESP-IDF tự động vô hiệu hóa Watchdog khi gắn debugger.",
        "code": "// Lệnh khởi động OpenOCD và GDB trên Terminal máy tính:\n/*\n# 1. Khởi chạy máy chủ OpenOCD kết nối USB-JTAG trên ESP32-S3:\nopenocd -f board/esp32s3-builtin.cfg\n\n# 2. Khởi chạy GDB và kết nối tới vi điều khiển:\nxtensa-esp32s3-elf-gdb build/my_firmware.elf -ex \"target remote :3333\"\n\n# 3. Các lệnh GDB thần thánh:\n(gdb) break app_main.c:50      # Đặt điểm dừng tại dòng 50\n(gdb) continue                 # Tiếp tục chạy\n(gdb) print my_variable        # In giá trị biến\n(gdb) watch g_shared_buffer[0] # Dừng CPU ngay khi phần tử này bị ghi đè!\n(gdb) backtrace                # In toàn bộ ngăn xếp gọi hàm (Call Stack)\n*/"
},
    "t44": {
        "title": "Kỹ năng trả lời phỏng vấn kỹ thuật theo phương pháp STAR cho vị trí Intern Firmware",
        "stageName": "Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        "skill": "STAR Method Technical Interviewing",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Rất nhiều ứng viên có kiến thức kỹ thuật tốt nhưng trượt phỏng vấn tại các tập đoàn lớn (Bosch, FPT, Viettel, Renesas) vì cách trả lời lan man, dài dòng và không nêu bật được đóng góp của bản thân.\n- **Phương pháp STAR** là chuẩn mực phỏng vấn hành vi và kỹ thuật được các tập đoàn công nghệ toàn cầu áp dụng để đánh giá năng lực tư duy logic và giải quyết vấn đề của ứng viên.\n\n### 📌 2. CẤU TRÚC 4 BƯỚC CỦA MÔ HÌNH STAR\n1. **S - Situation (Tình huống):** Bối cảnh dự án gặp sự cố khó khăn gì?\n2. **T - Task (Nhiệm vụ):** Mục tiêu cụ thể mà bạn được giao phải hoàn thành là gì?\n3. **A - Action (Hành động):** Bạn đã áp dụng công cụ kỹ thuật gì để giải quyết vấn đề? (Tập trung vào \"Tôi đã làm gì\", không nói chung chung \"Chúng tôi\").\n4. **R - Result (Kết quả):** Kết quả định lượng bằng con số là gì? (Tiết kiệm bao nhiêu RAM, giảm bao nhiêu ms độ trễ, đạt giải thưởng gì).\n\n### 📌 3. MẪU CÂU TRẢ LỜI ĐẲNG CẤP KHI ĐƯỢC HỎI VỀ SỰ CỐ KHÓ NHẤT\n- *Câu hỏi: \"Hãy kể về một lỗi phần cứng khó nhất mà bạn từng gặp và cách bạn đã vượt qua?\"*\n- *Trả lời theo STAR:*\n  + **(S):** Trong đồ án Edge AI, hệ thống thường xuyên bị sập nguồn ngẫu nhiên sau 4 giờ chạy liên tục mà lệnh printf không bắt được lỗi.\n  + **(T):** Em được giao nhiệm vụ tìm ra nguyên nhân gốc rễ và đảm bảo hệ thống chạy ổn định 72 giờ liên tục.\n  + **(A):** Em không đoán mò mà trích xuất bản ghi Guru Meditation Crash Dump từ cổng Serial, sử dụng công cụ `addr2line` đối chiếu địa chỉ thanh ghi PC để định vị chính xác dòng code gây lỗi. Em phát hiện nguyên nhân là do con trỏ mảng thiếu cờ `alignas(16)` khi thực thi lệnh Vector SIMD trên ESP32-S3. Em đã thêm cờ căn lề 16-byte và kích hoạt Task Watchdog Timer.\n  + **(R):** Kết quả là hệ thống đã vượt qua bài kiểm thử tải 72 giờ liên tục với 0 lần crash, độ trễ suy luận đạt 11.2ms và đồ án đạt điểm A+ trước hội đồng!",
        "code": "/* KHUNG TỔ CHỨC CÂU TRẢ LỜI PHỎNG VẤN KỸ THUẬT:\n[SITUATION]:   Dự án phân loại âm thanh 16kHz bị nghẽn bus và rớt mẫu liên tục.\n[TASK]:        Tối ưu đường ống thu thập dữ liệu để độ trễ phục vụ ngắt < 5us.\n[ACTION]:      Chuyển đổi từ ngắt thông thường sang cơ chế I2S DMA Ping-Pong Buffer\n               kết hợp ngắt IRAM_ATTR và Deferred Processing qua FreeRTOS Queue.\n[RESULT]:      Tải CPU giảm từ 95% xuống còn 18%, không còn rớt bất kỳ mẫu nào,\n               giải phóng trọn vẹn Core 1 cho mô hình TinyML.\n*/"
},
    "t45": {
        "title": "Nguyên tắc cốt lõi MISRA C:2012: Không cấp phát động trong runtime, giới hạn con trỏ",
        "stageName": "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        "skill": "MISRA C:2012 Automotive Compliance",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Tiêu chuẩn an toàn chức năng quốc tế trong ngành công nghiệp ô tô (ISO 26262 ASIL-D) đòi hỏi phần mềm điều khiển phanh, túi khí và động cơ không bao giờ được phép phát sinh lỗi sụp nguồn do cạn kiệt bộ nhớ.\n- Ẩn dụ: Sử dụng `malloc()` trong hệ thống nhúng giống như việc bạn đi thuê nhà trọ theo ngày: hôm nay thuê phòng to, ngày mai thuê phòng nhỏ, sau một thời gian chủ nhà hết phòng trống phù hợp và bạn bị đuổi ra đường (lỗi OOM). Cấp phát tĩnh (Static Allocation) giống như việc bạn mua đứt một căn nhà cố định: ngay từ lúc khởi động, mọi phòng ốc đều được phân bổ sẵn, bạn yên tâm sinh sống suốt đời mà không bao giờ bị đuổi!\n- ✅ **Quy tắc MISRA C:2012 Rule 21.3**: Nghiêm cấm hoàn toàn việc sử dụng bộ nhớ động (`malloc`, `calloc`, `realloc`, `free`) sau khi hệ thống hoàn tất giai đoạn khởi động ban đầu.\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Toàn bộ các mảng đệm (Buffer), cấu trúc dữ liệu và Tensor Arena đều phải được khai báo với từ khóa `static` hoặc cấp phát trong **Static Memory Pool**.\n- Kích thước ngăn xếp Stack của mỗi Task phải được tính toán và giới hạn trên (Static Stack Bounding), triệt tiêu hoàn toàn nguy cơ tràn Stack ngẫu nhiên trong quá trình vận hành.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Sử dụng các hàm thư viện chuẩn C có chứa malloc ngầm:** Các hàm như `strdup()`, `asprintf()` hoặc khởi tạo đối tượng `std::string` trong C++ đều âm thầm gọi `malloc()` bên dưới. Vi phạm nghiêm trọng chuẩn MISRA C.",
        "code": "// Cài đặt Static Memory Pool cấp phát khối nhớ cố định chuẩn MISRA C\n#include <stdint.h>\n#include <stdbool.h>\n\n#define POOL_BLOCK_SIZE 64U\n#define POOL_NUM_BLOCKS 16U\n\ntypedef struct {\n    uint8_t buffer[POOL_NUM_BLOCKS][POOL_BLOCK_SIZE];\n    bool is_used[POOL_NUM_BLOCKS];\n} StaticMemoryPool_t;\n\nstatic StaticMemoryPool_t s_pool;\n\nvoid* pool_allocate(void) {\n    for (uint32_t i = 0U; i < POOL_NUM_BLOCKS; i++) {\n        if (!s_pool.is_used[i]) {\n            s_pool.is_used[i] = true;\n            return (void*)s_pool.buffer[i]; // Cấp phát an toàn 0% phân mảnh!\n        }\n    }\n    return NULL; // Hết khối nhớ\n}\n\nvoid pool_release(void *ptr) {\n    for (uint32_t i = 0U; i < POOL_NUM_BLOCKS; i++) {\n        if ((void*)s_pool.buffer[i] == ptr) {\n            s_pool.is_used[i] = false;\n            break;\n        }\n    }\n}"
},
    "t46": {
        "title": "Phòng chống hành vi bất định (Undefined Behavior) và tràn số nguyên (Integer Overflow)",
        "stageName": "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        "skill": "Undefined Behavior Prevention",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trong ngôn ngữ C, **Hành vi bất định (Undefined Behavior - UB)** là những trường hợp mà tiêu chuẩn C không quy định CPU phải làm gì: trình biên dịch có quyền xóa bỏ đoạn code của bạn, sinh ra kết quả sai lệch hoặc làm chip sụp nguồn.\n- Ẩn dụ: Chiếc đồng hồ đo tốc độ xe hơi chỉ có 2 chữ số (từ 00 đến 99 km/h). Khi bạn tăng tốc từ 99 km/h lên 100 km/h, kim đồng hồ đột ngột quay về **00 km/h**! Nếu hệ thống điều khiển tự động nhìn vào đồng hồ thấy tốc độ bằng 0 và tiếp tục đạp hết ga, tai nạn thảm khốc sẽ xảy ra. Hiện tượng này chính là **Tràn số nguyên (Integer Overflow)**!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Tràn số nguyên có dấu (Signed Integer Overflow): `INT_MAX + 1` là hành vi bất định trong chuẩn C! Trình biên dịch có thể tự ý tối ưu hóa xóa bỏ câu lệnh kiểm tra:\n  ```c\n  if (a + 100 > a) { ... } // Compiler có thể tự động coi biểu thức này luôn TRUE!\n  ```\n- ✅ **Quy tắc phòng chống tràn số an toàn trước khi tính toán:**\n  Để kiểm tra xem phép cộng `a + b` có bị tràn số 32-bit không:\n  ```c\n  if (a > (INT32_MAX - b)) { /* Báo lỗi tràn số, KHÔNG THỰC HIỆN PHÉP CỘNG! */ }\n  ```\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Dịch bit âm hoặc dịch quá kích thước kiểu dữ liệu:** `1U << 32` trên biến 32-bit là hành vi bất định, kết quả phụ thuộc vào kiến trúc phần cứng của từng loại chip!",
        "code": "// Hàm cộng số nguyên có dấu 32-bit an toàn chống tràn số chuẩn MISRA C\n#include <stdint.h>\n#include <stdbool.h>\n\nbool safe_add_int32(int32_t a, int32_t b, int32_t *result) {\n    if ((b > 0) && (a > (INT32_MAX - b))) {\n        return false; // Phát hiện tràn số dương!\n    }\n    if ((b < 0) && (a < (INT32_MIN - b))) {\n        return false; // Phát hiện tràn số âm!\n    }\n    *result = a + b;\n    return true; // Phép cộng an toàn\n}"
},
    "t47": {
        "title": "Tích hợp công cụ phân tích tĩnh (Static Code Analysis: Cppcheck, Clang-Tidy)",
        "stageName": "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        "skill": "Automated Static Code Linting",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Kiểm tra lỗi bằng mắt thường (Code Review thủ công) không bao giờ có thể bao quát hết hàng trăm nghìn dòng code trong một dự án firmware doanh nghiệp.\n- Ẩn dụ: Công cụ phân tích tĩnh (Static Analysis) giống như chiếc máy quét an ninh X-quang tại sân bay: bạn không cần phải cắm điện cho thiết bị hoạt động (không cần nạp code vào chip chạy thử), máy quét sẽ soi trực tiếp vào cấu trúc mã nguồn để tìm ra các quả bom nổ chậm (con trỏ chưa khởi tạo, biến rác, rò rỉ bộ nhớ) trước khi nó được nạp lên máy bay!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- **Cppcheck:** Công cụ phân tích mã nguồn C/C++ chuyên dụng cho hệ thống nhúng:\n  + Phát hiện con trỏ NULL được giải tham chiếu.\n  + Phát hiện tràn mảng (Out-of-bounds access).\n  + Kiểm tra tuân thủ các quy tắc MISRA C:2012.\n- **Clang-Tidy:** Tích hợp bộ quy tắc linter hiện đại, tự động kiểm tra cú pháp và đề xuất cải tiến mã nguồn.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Bỏ qua Warning của trình biên dịch:** Coi thường các cảnh báo `Warning` khiến lỗi tiềm ẩn trở thành thảm họa sập nguồn khi thiết bị hoạt động ngoài nhà máy. Quy tắc vàng: Bật cờ `-Wall -Wextra -Werror` (Biến toàn bộ cảnh báo thành lỗi bắt buộc phải sửa trước khi build).",
        "code": "// File kịch bản chạy Cppcheck tự động quét lỗi toàn bộ dự án\n/*\n# Chạy Cppcheck với cấu hình nghiêm ngặt chuẩn ô tô:\ncppcheck --enable=all \\\n         --inconclusive \\\n         --std=c99 \\\n         --error-exitcode=1 \\\n         --suppress=missingIncludeSystem \\\n         main/\n\n# Tích hợp vào Makefile hoặc CMake:\nadd_custom_target(lint\n    COMMAND cppcheck --enable=warning,style,performance,portability main/\n)\n*/"
},
    "t48": {
        "title": "Coding Convention chuẩn công nghiệp: Naming, Doxygen Documentation & File Structure",
        "stageName": "Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        "skill": "Industrial Code Convention & Doxygen",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Viết code không chỉ để máy tính hiểu, mà quan trọng hơn là để các kỹ sư khác trong nhóm và chính bạn 6 tháng sau có thể hiểu và bảo trì được.\n- Ẩn dụ: Một kho thuốc tây được dán nhãn chuẩn mực: thuốc hạ sốt để ngăn màu xanh, thuốc kháng sinh để ngăn màu đỏ, ghi rõ liều dùng và tác dụng phụ. Nếu dược sĩ dán nhãn tùy tiện như \"thuốc_1\", \"thuốc_x\", \"bột_trắng\", bệnh nhân sẽ uống nhầm và mất mạng! Coding convention chuẩn công nghiệp giúp mã nguồn dự án luôn sáng sủa, minh bạch và chuyên nghiệp.\n\n### 📌 2. NGUYÊN TẮC ĐẶT TÊN & TỔ CHỨC FILE CHUẨN MỰC\n- **Tên biến:** Dùng tiền tố rõ ràng (`s_` cho static, `g_` cho global, `p_` cho pointer).\n- **Tên kiểu dữ liệu:** Luôn kết thúc bằng hậu tố `_t` (ví dụ: `SensorData_t`).\n- **Hằng số & Macro:** Viết hoa toàn bộ với dấu gạch dưới (ví dụ: `MAX_BUFFER_SIZE`).\n- **Chú thích Doxygen chuẩn:**\n  + `@brief`: Mô tả ngắn gọn chức năng của hàm.\n  + `@param[in/out]`: Ý nghĩa của từng tham số truyền vào hoặc lấy ra.\n  + `@return`: Giá trị trả về và các mã lỗi có thể xảy ra.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **File Header thiếu Include Guard (#ifndef):** Khi file header được include nhiều lần trong các module khác nhau sẽ sinh ra lỗi trùng lặp định nghĩa (Redefinition Error).",
        "code": "/**\n * @file bsp_imu_driver.h\n * @brief Trình điều khiển cảm biến quán tính IMU chuẩn Doxygen công nghiệp.\n * @author Kỹ sư Nhúng Edge AI\n * @date 2026-09-26\n */\n\n#ifndef BSP_IMU_DRIVER_H_\n#define BSP_IMU_DRIVER_H_\n\n#include <stdint.h>\n#include \"esp_err.h\"\n\n/**\n * @brief Đọc giá trị gia tốc 3 trục từ cảm biến qua bus I2C.\n * \n * @param[out] p_accel_x Con trỏ lưu giá trị gia tốc trục X (mg).\n * @param[out] p_accel_y Con trỏ lưu giá trị gia tốc trục Y (mg).\n * @param[out] p_accel_z Con trỏ lưu giá trị gia tốc trục Z (mg).\n * \n * @return \n *    - ESP_OK: Đọc dữ liệu thành công\n *    - ESP_ERR_INVALID_ARG: Con trỏ truyền vào là NULL\n *    - ESP_ERR_TIMEOUT: Cảm biến không phản hồi trên bus I2C\n */\nesp_err_t bsp_imu_read_accel(int16_t * const p_accel_x, \n                             int16_t * const p_accel_y, \n                             int16_t * const p_accel_z);\n\n#endif /* BSP_IMU_DRIVER_H_ */"
},
    "t49": {
        "title": "Kiến trúc mạng CAN Bus (TWAI trên ESP32): Khung tin tiêu chuẩn, ID Arbitration",
        "stageName": "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        "skill": "CAN Bus 2.0B / TWAI Driver Architecture",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Mạng CAN Bus (Controller Area Network) là xương sống giao tiếp trên 100% các dòng xe ô tô hiện đại (VinFast, Toyota, Tesla) và thiết bị tự động hóa công nghiệp.\n- Ẩn dụ: Một phòng họp có 20 kỹ sư cùng ngồi thảo luận. Nếu ai cũng hét vào micro cùng lúc, cuộc họp sẽ biến thành mớ hỗn loạn. Mạng CAN Bus áp dụng quy tắc: Ai có chức vụ cao hơn (CAN ID nhỏ hơn) thì người đó được nói tiếp; người có chức vụ thấp hơn khi thấy người chức vụ cao bắt đầu nói thì tự động im lặng lắng nghe mà không làm ngắt lời người kia! Đó chính là **Cơ chế trọng tài bitwise không phá hủy (Non-destructive Bitwise Arbitration)**!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Trên ESP32-S3, bộ điều khiển CAN được đặt tên là **TWAI (Two-Wire Automotive Interface)**.\n- **Khung tin CAN chuẩn (Standard Frame - 11-bit ID):**\n  + **SOF (Start of Frame):** 1 bit 0 khởi đầu.\n  + **Arbitration Field (11-bit ID + RTR):** Định danh gói tin và độ ưu tiên.\n  + **Control Field (DLC):** 4 bit quy định độ dài dữ liệu (0 đến 8 bytes).\n  + **Data Field:** Dữ liệu thực tế tối đa 8 bytes.\n  + **CRC Field (15-bit):** Mã kiểm tra lỗi đường truyền cực mạnh.\n  + **ACK Field:** Các nút mạng khác kéo xuống 0 để xác nhận đã nhận đúng.\n- Trên bus CAN: Bit 0 là **Dominant (Lấn át)**, Bit 1 là **Recessive (Bị lấn át)**. Gói tin nào có ID nhỏ hơn sẽ có nhiều bit 0 hơn ở đầu và giành quyền truyền trước!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Thiếu 2 điện trở đầu cuối 120 Ohm (Termination Resistors):** Bắt buộc phải gắn 2 điện trở 120 ohm ở 2 đầu xa nhất của đường bus CAN để triệt tiêu sóng phản xạ (Signal Reflection). Nếu thiếu, sóng tín hiệu va đập làm méo dạng xung và gây nghẽn mạng (Bus-Off State).",
        "code": "// Cấu hình khởi tạo TWAI CAN Bus 500Kbps trên ESP32-S3\n#include \"driver/twai.h\"\n\nvoid init_can_bus_twai(void) {\n    // 1. Cấu hình chân phần cứng (TX = GPIO4, RX = GPIO5)\n    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(GPIO_NUM_4, GPIO_NUM_5, TWAI_MODE_NORMAL);\n\n    // 2. Cấu hình tốc độ Baud 500 Kbps (Chuẩn mạng động cơ ô tô)\n    twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();\n\n    // 3. Cho phép nhận toàn bộ ID (Không lọc)\n    twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();\n\n    // 4. Cài đặt và khởi chạy driver\n    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));\n    ESP_ERROR_CHECK(twai_start());\n    ESP_LOGI(\"CAN\", \"TWAI Driver đã khởi chạy thành công ở 500Kbps!\");\n}"
},
    "t50": {
        "title": "Lọc gói tin phần cứng (Acceptance Filter) chống nghẽn CPU trên mạng ô tô",
        "stageName": "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        "skill": "Hardware CAN Acceptance Filtering",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trên một chiếc xe hơi đang chạy, mạng CAN Bus liên tục truyền hàng nghìn thông điệp mỗi giây: tốc độ bánh xe, áp suất lốp, nhiệt độ nước làm mát, trạng thái cần gạt nước, góc đánh lái...\n- Nếu vi điều khiển của bạn chỉ làm nhiệm vụ giám sát túi khí mà gói tin nào cũng kích hoạt ngắt CPU ra đọc, chip sẽ bị quá tải 100% chỉ để vứt rác!\n- Ẩn dụ: Bộ lọc phần cứng (Acceptance Filter) giống như một nhân viên lễ tân gác cửa cơ quan có danh sách VIP: chỉ những vị khách có thẻ VIP hợp lệ mới được mời vào gặp giám đốc (CPU). Những người khác bị chặn lại ngay từ cổng mà không làm phiền giám đốc một giây nào!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Bộ lọc phần cứng TWAI sử dụng 2 thanh ghi:\n  + **Acceptance Code (ACR):** Mẫu bit mong muốn nhận.\n  + **Acceptance Mask (AMR):** Mặt nạ bitmask quy định bit nào bắt buộc phải khớp (Bit 0 trong Mask = Bắt buộc khớp; Bit 1 trong Mask = Bỏ qua, coi như Don't care).\n- Công thức kiểm tra gói tin:\n  $$(\\text{ID nhận được} \\oplus \\text{Acceptance Code}) \\;\\&\\; (\\sim \\text{Acceptance Mask}) == 0$$\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Dịch sai vị trí bit của Acceptance Code trong thanh ghi 32-bit:** Trên ESP32, ID 11-bit tiêu chuẩn nằm ở 11 bit cao nhất của thanh ghi (Dịch trái 21 bit: `ID << 21`). Nếu quên dịch trái 21 bit, bộ lọc sẽ chặn mất tất cả các gói tin hợp lệ!",
        "code": "// Cấu hình bộ lọc phần cứng chỉ nhận các thông điệp có ID = 0x120 đến 0x12F\ntwai_filter_config_t create_hardware_filter(void) {\n    twai_filter_config_t f_config;\n    // Acceptance Code: Cần khớp phần đầu 0x120 (Dịch trái 21 bit vào vị trí ID chuẩn)\n    f_config.acceptance_code = (0x120 << 21);\n\n    // Acceptance Mask: 4 bit cuối cùng của ID là \"Don't care\" (Nhận từ 0x120 đến 0x12F)\n    // Bit 0 = Phải khớp, Bit 1 = Bỏ qua\n    f_config.acceptance_mask = ~(0x00F << 21);\n\n    f_config.single_filter = true; // Sử dụng bộ lọc đơn 32-bit\n    return f_config;\n}"
},
    "t51": {
        "title": "Giao thức công nghiệp Modbus RTU qua chuẩn truyền thông vi sai RS485",
        "stageName": "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        "skill": "RS485 Modbus RTU Industrial Protocol",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trong các nhà máy công nghiệp, hệ thống điện mặt trời và tòa nhà thông minh, **Modbus RTU** chạy trên đường truyền vật lý vi sai **RS485** là giao thức phổ biến nhất thế giới suốt 40 năm qua.\n- Ẩn dụ: Modbus RTU hoạt động theo mô hình Thầy - Trò (Master - Slave): Chỉ có thầy giáo (Master ESP32) mới có quyền cất tiếng hỏi; các học sinh (Slave: Biến tần, Đồng hồ đo điện) chỉ được phép trả lời khi được thầy gọi đúng tên ID của mình. Không bao giờ có chuyện 2 học sinh tự ý cướp lời nhau!\n\n### 📌 2. NGUYÊN LÝ HOẠT ĐỘNG, THANH GHI & CÔNG THỨC TOÁN HỌC\n- Chuẩn vật lý RS485 là giao tiếp nửa bán song công (Half-Duplex): Sử dụng chân **DE/RE (Driver Enable / Receiver Enable)** để chuyển đổi giữa chế độ Phát và Thu.\n- Khung bản tin Modbus RTU:\n  + `Slave ID` (1 byte): Địa chỉ thiết bị (1 đến 247).\n  + `Function Code` (1 byte): Mã lệnh (0x03: Đọc Holding Registers, 0x06: Ghi 1 Register).\n  + `Data Field`: Địa chỉ thanh ghi và số lượng thanh ghi cần đọc.\n  + `CRC-16` (2 bytes): Mã kiểm tra dư thừa tuần hoàn kiểm tra toàn vẹn bản tin.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Không chuyển chân DE về LOW sau khi phát xong:** Sau khi Master phát lệnh xong, nếu quên kéo chân DE về mức 0 (chế độ thu), chip thu phát MAX485 sẽ tiếp tục ghì đường bus ở trạng thái phát, khiến Master không thể nhận được bản tin trả lời từ Slave!",
        "code": "// Thuật toán tính toán mã kiểm tra lỗi CRC-16 Modbus chuẩn công nghiệp\nuint16_t modbus_crc16(const uint8_t *buffer, uint16_t len) {\n    uint16_t crc = 0xFFFF;\n    for (uint16_t pos = 0; pos < len; pos++) {\n        crc ^= (uint16_t)buffer[pos]; // XOR byte dữ liệu vào byte thấp của CRC\n        for (int i = 8; i != 0; i--) {\n            if ((crc & 0x0001) != 0) {\n                crc >>= 1;\n                crc ^= 0xA001; // Đa thức Modbus polynomial\n            } else {\n                crc >>= 1;\n            }\n        }\n    }\n    return crc; // Trả về 2 byte CRC (Low byte gửi trước, High byte gửi sau)\n}"
},
    "t52": {
        "title": "Thiết kế Driver thiết bị ngoại vi chuẩn Module hóa (Layered HAL/Driver Pattern)",
        "stageName": "Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        "skill": "Layered Device Driver Architecture",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Viết driver nhúng chuẩn mực đòi hỏi sự tách biệt hoàn toàn giữa tầng Thuật toán logic và tầng Giao tiếp phần cứng vật lý.\n- Ẩn dụ: Ứng dụng điều hướng Google Maps trên điện thoại không cần biết bạn đang lái xe ô tô điện VinFast, xe máy Honda hay đang đi bộ. Nó chỉ cần một Interface chung: \"Lấy tọa độ GPS hiện tại\". Nếu ngày mai bạn đổi xe, phần mềm bản đồ vẫn hoạt động nguyên vẹn mà không cần viết lại một dòng code nào!\n- ✅ **Mô hình Layered Driver Pattern**: Cho phép hoán đổi phần cứng (ví dụ: chuyển từ cảm biến I2C sang cảm biến SPI) chỉ bằng cách đổi một hàm con trỏ Callback, giữ nguyên 100% mã nguồn xử lý AI!\n\n### 📌 2. CẤU TRÚC 3 TẦNG CHUẨN MỰC\n1. **Hardware Bus Interface (I2C/SPI/UART HAL):** Chịu trách nhiệm phát xung clock và đọc byte thô.\n2. **Device Driver Layer:** Hiểu các thanh ghi cụ thể của cảm biến (ví dụ: cấu hình thang đo $\\pm 2g$ cho MPU6050).\n3. **Application & Processing Layer:** Tiếp nhận số liệu vật lý thực tế để tính toán FFT và đưa vào mô hình TinyML.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Viết mã nguồn Hardcode địa chỉ chân GPIO trong file driver:** Khiến driver không thể tái sử dụng cho dự án khác có sơ đồ chân khác.",
        "code": "// Cấu trúc Driver hướng đối tượng bằng C sử dụng Interface con trỏ hàm\ntypedef struct {\n    // Con trỏ hàm giao tiếp bus trừu tượng (Dependency Injection)\n    esp_err_t (*bus_read)(uint8_t reg, uint8_t *data, size_t len);\n    esp_err_t (*bus_write)(uint8_t reg, const uint8_t *data, size_t len);\n    float sensitivity_scale;\n} SensorDriver_t;\n\nesp_err_t sensor_read_accel_g(const SensorDriver_t *dev, float *x, float *y, float *z) {\n    if (!dev || !dev->bus_read) return ESP_ERR_INVALID_ARG;\n    uint8_t raw[6];\n    esp_err_t ret = dev->bus_read(0x3B, raw, 6);\n    if (ret != ESP_OK) return ret;\n\n    int16_t raw_x = (int16_t)((raw[0] << 8) | raw[1]);\n    *x = (float)raw_x / dev->sensitivity_scale;\n    return ESP_OK;\n}"
},
    "t53": {
        "title": "Viết Unit Test cho mã nguồn C nhúng bằng framework Unity & CMock",
        "stageName": "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        "skill": "Embedded Unit Testing with Unity & CMock",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Trong lập trình nhúng truyền thống, kiểm thử thường là cắm mạch vào máy tính rồi bật nguồn xem đèn LED có sáng không. Cách làm này cực kỳ chậm chạp và không thể kiểm tra hết các trường hợp biên nguy hiểm (ví dụ: chia cho 0, nhận gói tin sai mã CRC).\n- Ẩn dụ: Khám nghiệm chất lượng thuốc tây bằng cách cho người uống thử là cực kỳ nguy hiểm. Unit Test giống như phòng xét nghiệm sinh hóa tự động: nó bơm hàng nghìn mẫu thử giả định vào ống nghiệm trong 1 giây để kiểm tra phản ứng của từng hoạt chất nhỏ, đảm bảo an toàn tuyệt đối trước khi đưa ra thị trường!\n\n### 📌 2. CÁC MACRO KHẲNG ĐỊNH CỐT LÕI TRONG FRAMEWORK UNITY\n- `TEST_ASSERT_EQUAL_INT8(expected, actual)`: So sánh bằng số nguyên.\n- `TEST_ASSERT_FLOAT_WITHIN(delta, expected, actual)`: **Bắt buộc dùng cho số thực Float**! Không bao giờ so sánh `float == float` vì sai số làm tròn số thực.\n- `TEST_ASSERT_NOT_NULL(ptr)`: Kiểm tra con trỏ khác NULL.\n- `TEST_ASSERT_TRUE(condition)`: Kiểm tra điều kiện logic.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Bài test trước làm nhiễm độc bài test sau (Test Pollution):** Quên dọn dẹp các biến toàn cục trong hàm `tearDown()`, khiến dữ liệu của test case 1 làm ảnh hưởng đến kết quả của test case 2.",
        "code": "// File kiểm thử Unit Test cho thuật toán trích xuất đặc trưng với Unity\n#include \"unity.h\"\n\nvoid setUp(void)    { /* Khởi tạo trước mỗi bài test */ }\nvoid tearDown(void) { /* Dọn dẹp sau mỗi bài test */ }\n\nvoid test_quantization_math_accuracy(void) {\n    // Kiểm tra công thức ánh xạ số thực sang INT8: Float 0.0f phải về đúng Zero-Point\n    float val = 0.0f;\n    float scale = 0.05f;\n    int8_t zero_point = -10;\n    \n    int8_t q = (int8_t)(roundf(val / scale) + zero_point);\n    TEST_ASSERT_EQUAL_INT8(-10, q);\n}\n\nvoid test_fft_magnitude_calculation(void) {\n    float real = 3.0f;\n    float imag = 4.0f;\n    float magnitude = sqrtf(real * real + imag * imag);\n    \n    // So sánh số thực với dung sai cho phép 0.001\n    TEST_ASSERT_FLOAT_WITHIN(0.001f, 5.0f, magnitude);\n}\n\nint main(void) {\n    UNITY_BEGIN();\n    RUN_TEST(test_quantization_math_accuracy);\n    RUN_TEST(test_fft_magnitude_calculation);\n    return UNITY_END();\n}"
},
    "t54": {
        "title": "Giả lập phần cứng (Hardware Mocking) để chạy Unit Test trên máy tính CI mà không cần mạch thật",
        "stageName": "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        "skill": "Hardware Abstraction Layer Mocking",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Làm thế nào để máy chủ đám mây (GitHub Actions chạy Linux x86_64) có thể chạy kiểm thử một hàm điều khiển động cơ khi nó không hề cắm con chip ESP32 và cảm biến gia tốc nào?\n- Ẩn dụ: Diễn viên đóng thế trong phim hành động. Khi quay cảnh nguy hiểm nhảy từ trực thăng xuống vực, đạo diễn không dùng diễn viên chính mà dùng hình nộm diễn viên đóng thế (Mock Function). Hàm Mock có diện mạo y hệt hàm thật, nhưng thay vì đọc thanh ghi I2C vật lý, nó trả về đúng con số giả định mà bài test yêu cầu!\n\n### 📌 2. KỸ THUẬT MOCKING VỚI THƯ VIỆN CMOCK\n- Tách biệt hàm đọc phần cứng qua con trỏ hàm Interface.\n- Framework **CMock** tự động đọc file header `i2c_driver.h` và sinh ra các hàm kiểm thử:\n  + `i2c_read_ExpectAndReturn(reg, expected_data, ESP_OK)`: Ra lệnh cho hàm Mock: *\"Lần gọi tới hãy trả về mảng dữ liệu này và báo thành công\"*.\n  + `i2c_read_ExpectAndReturn(reg, NULL, ESP_ERR_TIMEOUT)`: Ra lệnh cho hàm Mock: *\"Lần gọi tới hãy giả vờ bị lỗi mất kết nối cảm biến để xem thuật toán có tự phục hồi hay không\"*.\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Mã nguồn include trực tiếp thư viện SDK phần cứng:** File thuật toán `#include \"esp_system.h\"` khiến trình biên dịch GCC trên máy tính PC báo lỗi `file not found`. Luôn cô lập các include của ESP-IDF vào một file adapter riêng biệt.",
        "code": "// Tách biệt HAL để Mocking chạy Unit Test trên máy tính PC\n#ifdef UNIT_TEST_ON_HOST\n    // Khi chạy trên PC: Sử dụng hàm Mock giả lập\n    int16_t mock_sensor_read(void) {\n        return 16384; // Giả lập cảm biến đang đo đúng 1.0g trọng lực\n    }\n    #define HARDWARE_READ_FN mock_sensor_read\n#else\n    // Khi chạy trên vi điều khiển: Gọi hàm đọc I2C thanh ghi thật\n    #define HARDWARE_READ_FN bsp_i2c_read_real_sensor\n#endif\n\nbool check_vibration_hazard(void) {\n    int16_t val = HARDWARE_READ_FN();\n    return (val > 25000); // Ngưỡng rung động nguy hiểm\n}"
},
    "t55": {
        "title": "Xây dựng luồng CI/CD với GitHub Actions: Tự động kiểm tra lint và build firmware khi Push",
        "stageName": "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        "skill": "Automated Firmware CI/CD Pipelines",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- CI/CD (Continuous Integration / Continuous Deployment) là tiêu chuẩn bắt buộc tại mọi công ty công nghệ chuyên nghiệp.\n- Ẩn dụ: Trạm kiểm định an toàn tự động ở cửa xuất xưởng nhà máy: bất kỳ chiếc xe nào (mã nguồn mới được `git push`) chạy qua cửa cũng bị một dàn robot tự động kiểm tra: phanh có ăn không (Unit Test), ốc vít có siết đúng chuẩn không (Linting), và nổ máy chạy thử (Build Firmware). Nếu có bất kỳ lỗi nào, cánh cửa sắt đóng sập lại ❌ và từ chối xuất xưởng!\n\n### 📌 2. QUY TRÌNH HOẠT ĐỘNG CỦA PIPELINE TRÊN GITHUB ACTIONS\n1. Kỹ sư đẩy code lên GitHub (`git push origin feature/ai-engine`).\n2. Máy chủ đám mây Ubuntu kích hoạt Container tự động:\n   - Cài đặt công cụ phân tích tĩnh `Cppcheck`.\n   - Cài đặt ESP-IDF Toolchain v5.1.\n   - Chạy toàn bộ các bài Unit Test với Unity.\n   - Biên dịch tự động: `idf.py build`.\n3. Nếu toàn bộ tiến trình thành công: Đánh dấu tích Xanh ✅ và cho phép Merge Pull Request!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Không cache thư mục ESP-IDF Toolchain:** Khiến mỗi lần chạy CI mất tới 20 phút để tải lại 3GB dữ liệu trình biên dịch. Sử dụng tính năng `actions/cache` của GitHub để giảm thời gian chạy xuống chỉ còn **1 đến 2 phút**.",
        "code": "# File cấu hình đường ống CI/CD GitHub Actions (.github/workflows/firmware_ci.yml)\nname: Firmware Automated CI/CD\n\non:\n  push:\n    branches: [ main, develop ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  static-analysis:\n    name: Quét lỗi tĩnh Cppcheck\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Chạy Cppcheck\n        run: |\n          sudo apt-get install -y cppcheck\n          cppcheck --enable=warning,style --error-exitcode=1 main/\n\n  unit-tests:\n    name: Chạy Unit Test tự động trên Host PC\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Biên dịch và chạy Unit Test\n        run: |\n          gcc test/test_runner.c main/dsp_filter.c -Iinclude -lunity -o test_bin\n          ./test_bin\n\n  build-esp32s3:\n    name: Biên dịch Firmware ESP-IDF nhị phân\n    needs: [static-analysis, unit-tests]\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Build Firmware ESP-IDF\n        uses: espressif/esp-idf-ci-action@v1\n        with:\n          esp_idf_version: v5.1\n          target: esp32s3\n          path: '.'"
},
    "t56": {
        "title": "Tạo và quản lý Release nhị phân firmware tự động (Automated Semantic Versioning)",
        "stageName": "Bước 14: Unit Test Tự Động & CI/CD Firmware",
        "skill": "Automated Semantic Versioning & Artifacts",
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI & ẨN DỤ TRỰC QUAN\n- Khi phát hành firmware thương mại cho hàng vạn thiết bị IoT, việc đặt tên file nhị phân bừa bãi kiểu `firmware_final_v2_sua_lan_cuoi.bin` là nguyên nhân dẫn đến thảm họa nâng cấp nhầm phiên bản.\n- **Chuẩn đánh số phiên bản ngữ nghĩa (Semantic Versioning - SemVer):**\n  `vMAJOR.MINOR.PATCH` (Ví dụ: `v2.1.0`)\n  + **MAJOR (Số 2):** Thay đổi lớn, phá vỡ tính tương thích ngược (đổi chip vi điều khiển hoặc đổi giao thức mạng).\n  + **MINOR (Số 1):** Bổ sung tính năng ngoại vi mới nhưng vẫn tương thích ngược.\n  + **PATCH (Số 0):** Sửa lỗi nhỏ (Bug fix), không thay đổi giao diện API.\n\n### 📌 2. QUY TRÌNH ĐÓNG GÓI BẢN RELEASE TỰ ĐỘNG\n1. Gắn nhãn phiên bản trên Git: `git tag -a v1.2.0 -m \"Release v1.2.0\"`.\n2. Đẩy tag lên máy chủ: `git push origin v1.2.0`.\n3. GitHub Actions tự động:\n   - Biên dịch firmware thành file `edge_ai_hub_v1.2.0.bin`.\n   - Sinh mã băm kiểm tra toàn vẹn **SHA-256 Checksum**.\n   - Tạo trang Release trên GitHub đính kèm file binary để máy chủ OTA tự động kéo về phân phối cho các thiết bị!\n\n### 📌 3. CẠM BẪY CHÍ MẠNG & BẮT LỖI THỰC TẾ (CRASH / BUG HUNTING)\n❌ **Quên cập nhật số phiên bản trong mã nguồn C:** Số phiên bản trong file header C không khớp với Git Tag, khiến thiết bị sau khi nạp OTA xong vẫn báo về máy chủ là phiên bản cũ, dẫn đến máy chủ liên tục kích hoạt OTA lặp vô hạn!",
        "code": "// Định nghĩa phiên bản ngữ nghĩa thống nhất trong mã nguồn C\n#define FIRMWARE_VERSION_MAJOR 1\n#define FIRMWARE_VERSION_MINOR 2\n#define FIRMWARE_VERSION_PATCH 0\n#define FIRMWARE_VERSION_STR   \"v1.2.0\"\n\nvoid print_system_startup_banner(void) {\n    ESP_LOGI(\"SYSTEM\", \"=================================================\");\n    ESP_LOGI(\"SYSTEM\", \"   HỆ THỐNG EDGE AI ESP32-S3 GIÁM SÁT CÔNG NGHIỆP \");\n    ESP_LOGI(\"SYSTEM\", \"   Phiên bản Firmware: %s\", FIRMWARE_VERSION_STR);\n    ESP_LOGI(\"SYSTEM\", \"   Ngày biên dịch:     %s %s\", __DATE__, __TIME__);\n    ESP_LOGI(\"SYSTEM\", \"=================================================\");\n}"
}
};;

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


window.ROADMAP_STAGE_THEORY = ROADMAP_STAGE_THEORY;
window.ROADMAP_TASK_THEORY = ROADMAP_TASK_THEORY;
window.defaultRoadmap = defaultRoadmap;
window.roadmap = roadmap;
window.saveState = saveState;
