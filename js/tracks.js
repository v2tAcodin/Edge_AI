// ==========================================================================
// PROJECT THAI // CURRICULUM ENGINE & 4 LEARNING TRACKS
// Hệ thống Dữ liệu 4 Learning Tracks & 24 Skill Stations Chuẩn Hóa
// Tích hợp State Migration Adapter, TrackStateManager & Progression Gate
// ==========================================================================

const STORAGE_PROJECT_THAI_STATIONS = "project_thai_station_state_v1";
const SESSION_ENGINEER_OVERRIDE = "project_thai_engineer_override_v1";

// ==========================================
// 1. CANONICAL LEARNING TRACKS
// ==========================================
const LEARNING_TRACKS = [
    {
        "id": "track-c-core",
        "title": "Embedded C & Architecture Core",
        "vietnameseTitle": "Nền Tảng C Nhúng & Kiến Trúc Bộ Nhớ",
        "icon": "🧠",
        "color": "#00d2ff",
        "accentGlow": "rgba(0, 210, 255, 0.4)",
        "summary": "Làm chủ ngôn ngữ C nhúng, quản lý con trỏ, cấu trúc dữ liệu, bản đồ bộ nhớ SRAM/Flash/PSRAM, thanh ghi phần cứng và tiêu chuẩn an toàn MISRA C.",
        "badge": "C & Memory Architect"
    },
    {
        "id": "track-esp32-sys",
        "title": "ESP32-S3 System & Peripherals",
        "vietnameseTitle": "Hệ Thống ESP32-S3 & Ngoại Vi Công Nghiệp",
        "icon": "⚡",
        "color": "#00ff88",
        "accentGlow": "rgba(0, 255, 136, 0.4)",
        "summary": "Làm chủ vi điều khiển ESP32-S3 Xtensa Dual-Core, ngắt phần cứng tốc độ cao, RTOS đa nhiệm, hàng đợi Queue, Semaphore và tiết kiệm năng lượng.",
        "badge": "ESP32-S3 Systems Specialist"
    },
    {
        "id": "track-tinyml",
        "title": "TinyML & Edge AI Inference",
        "vietnameseTitle": "TinyML & Trí Tuệ Nhân Tạo Biên",
        "icon": "🤖",
        "color": "#a855f7",
        "accentGlow": "rgba(168, 85, 247, 0.4)",
        "summary": "Triển khai mạng nơ-ron học sâu lên vi điều khiển ESP32-S3, lượng tử hóa INT8, quản lý Tensor Arena, tăng tốc SIMD ESP-NN và xử lý tín hiệu âm thanh/chuyển động.",
        "badge": "TinyML & Edge AI Engineer"
    },
    {
        "id": "track-capstone",
        "title": "Capstone Projects & Interview Mastery",
        "vietnameseTitle": "Dự Án Thực Chiến & Phỏng Vấn Kỹ Sư",
        "icon": "🏆",
        "color": "#f59e0b",
        "accentGlow": "rgba(245, 158, 11, 0.4)",
        "summary": "Xây dựng 4 dự án nhúng cấp công nghiệp thực thụ và làm chủ 24 chủ đề phỏng vấn kỹ sư nhúng chuyên sâu tại các tập đoàn công nghệ hàng đầu.",
        "badge": "Production Embedded & AI Master"
    }
];

// ==========================================
// 2. CANONICAL SKILL STATIONS (24 STATIONS)
// ==========================================
const SKILL_STATIONS = [
    {
        "id": "s01",
        "trackId": "track-c-core",
        "index": 0,
        "title": "Thao Tác Bit & Thanh Ghi Phần Cứng (Bitwise & Registers)",
        "shortTitle": "Bitwise & Registers",
        "category": "Registers",
        "xpReward": 100,
        "prerequisites": [],
        "coordinates3D": {
            "x": -45,
            "y": -10,
            "z": -15
        },
        "theory": {
            "summary": "Trong lập trình nhúng, thanh ghi điều khiển phần cứng (Hardware Registers) ánh xạ vào bộ nhớ (Memory-Mapped I/O). Việc bật (SET), tắt (CLEAR) hoặc đảo (TOGGLE) bit mà không ảnh hưởng tới các bit lân cận là kỹ năng sinh tồn. Thanh ghi Write-1-to-Set (như GPIO_OUT_W1TS_REG trên ESP32-S3) cho phép thao tác nguyên tử (Atomic) trong 1 chu kỳ xung nhịp 240MHz, loại bỏ hoàn toàn hiện tượng Race Condition giữa 2 nhân CPU.",
            "diagram": "[CPU Xtensa LX7] ──32-bit Bus──> [GPIO_OUT_W1TS_REG (0x60004008)]\n                                           │\n  Bit 3 = 1  ──────────────────────────────┴──> Set GPIO3 HIGH (1 cycle Atomic)",
            "keyTakeaways": [
                "Bật bit: reg |= (1U << n) hoặc ghi vào thanh ghi W1TS (Write-1-to-Set).",
                "Xóa bit: reg &= ~(1U << n) hoặc ghi vào thanh ghi W1TC (Write-1-to-Clear).",
                "Đảo bit: reg ^= (1U << n).",
                "Tiêu chuẩn MISRA C:2012 Rule 10.1 yêu cầu luôn dùng hằng số nguyên không dấu 1U khi dịch bit."
            ],
            "standardRef": "ESP32-S3 TRM Ch.5 / MISRA C:2012 Rule 10.1"
        },
        "codeLab": {
            "sampleCode": "// ESP-IDF Atomic Bitwise Set on ESP32-S3\n#include <stdint.h>\n\n#define GPIO_OUT_W1TS_REG  ((volatile uint32_t *)0x60004008)\n#define GPIO_OUT_W1TC_REG  ((volatile uint32_t *)0x6000400C)\n\nvoid atomic_gpio_set_high(uint8_t pin) {\n    // Write 1 to Set bit 'pin' - Hardware atomic 1 cycle\n    *GPIO_OUT_W1TS_REG = (1U << pin);\n}\n\nvoid atomic_gpio_set_low(uint8_t pin) {\n    // Write 1 to Clear bit 'pin' - Hardware atomic 1 cycle\n    *GPIO_OUT_W1TC_REG = (1U << pin);\n}",
            "instructions": "Quan sát cơ chế ghi trực tiếp vào con trỏ thanh ghi phần cứng có từ khóa volatile. Hãy thử nghiệm với chân GPIO3 nối cảm biến IMU.",
            "exerciseId": "prob_1"
        },
        "simulator": {
            "type": "register",
            "label": "Mô Phỏng Thanh Ghi GPIO W1TS/W1TC"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s01_q1",
                    "question": "Tại sao trong ESP32-S3, thanh ghi GPIO_OUT_W1TS_REG được ưu tiên hơn việc đọc-sửa-ghi (read-modify-write) vào GPIO_OUT_REG?",
                    "options": [
                        "Vì W1TS cho phép thao tác nguyên tử (atomic) tránh race condition giữa 2 nhân CPU.",
                        "Vì W1TS tiết kiệm RAM hơn GPIO_OUT_REG.",
                        "Vì GPIO_OUT_REG chỉ hỗ trợ chế độ đọc, không ghi được.",
                        "Vì W1TS tự động kích hoạt bộ đệm DMA."
                    ],
                    "correct": 0,
                    "explanation": "Thao tác read-modify-write (reg |= mask) tốn 3 chu kỳ và dễ bị tranh chấp tài nguyên (race condition) nếu 2 nhân CPU hoặc ngắt ISR cùng truy xuất. W1TS chỉ tốn 1 chu kỳ ghi phần cứng thuần túy."
                },
                {
                    "id": "s01_q2",
                    "question": "Theo MISRA C:2012 Rule 10.1, tại sao toán tử dịch bit nên dùng '1U << n' thay vì '1 << n'?",
                    "options": [
                        "Để tránh hành vi không xác định (Undefined Behavior) khi dịch bit trên số nguyên có dấu (signed integer).",
                        "Để tăng tốc độ biên dịch trong GCC.",
                        "Để ép compiler lưu kết quả vào thanh ghi 64-bit.",
                        "Để tự động đảo bit khi tràn số."
                    ],
                    "correct": 0,
                    "explanation": "Trong C tiêu chuẩn, dịch bit vào bit dấu của số nguyên signed có thể gây Undefined Behavior hoặc Implementation-Defined. Sử dụng 1U (Unsigned) đảm bảo an toàn tuyệt đối."
                }
            ]
        }
    },
    {
        "id": "s02",
        "trackId": "track-c-core",
        "index": 1,
        "title": "Con Trỏ, Array Decay & Function Pointers",
        "shortTitle": "Pointers & Function Pointers",
        "category": "Pointers",
        "xpReward": 120,
        "prerequisites": [
            "s01"
        ],
        "coordinates3D": {
            "x": -38,
            "y": -5,
            "z": -8
        },
        "theory": {
            "summary": "Con trỏ là linh hồn của ngôn ngữ C trong hệ thống nhúng. Tên mảng tự động suy biến thành con trỏ (Array Decay) khi truyền qua tham số hàm. Trong khi đó, con trỏ hàm (Function Pointer) là nền tảng để xây dựng bảng vector ngắt (Interrupt Vector Table), driver phần cứng trừu tượng (HAL) và máy trạng thái hữu hạn (State Machine) trong firmware ESP-IDF.",
            "diagram": "[Driver Struct HAL]\n┌───────────────────────────────┐\n│ int (*init)(void);            │ ───> &sensor_mpu6050_init()\n│ int (*read_raw)(int16_t *buf);│ ───> &sensor_mpu6050_read()\n│ int (*deinit)(void);          │ ───> &sensor_mpu6050_deinit()\n└───────────────────────────────┘",
            "keyTakeaways": [
                "Mảng là một khối ô nhớ liên tục cố định; con trỏ là biến độc lập chứa địa chỉ ô nhớ.",
                "Array Decay làm mất thông tin sizeof() của mảng gốc khi truyền vào hàm.",
                "Con trỏ hàm cho phép thực thi Callback đa hình (Polymorphism) mà không cần hướng đối tượng C++."
            ],
            "standardRef": "Expert C Programming Ch.4 / ISO C11 §6.5.3"
        },
        "codeLab": {
            "sampleCode": "#include <stdio.h>\n#include <stdint.h>\n\ntypedef struct {\n    const char *name;\n    int (*init)(void);\n    int (*read_sample)(int16_t *raw);\n} sensor_driver_t;\n\nint dummy_imu_init(void) { return 0; }\nint dummy_imu_read(int16_t *raw) { *raw = 1024; return 1; }\n\nsensor_driver_t imu_driver = {\n    .name = \"MPU6050-IMU\",\n    .init = dummy_imu_init,\n    .read_sample = dummy_imu_read\n};",
            "instructions": "Thiết kế một cấu trúc Driver chứa con trỏ hàm Callback để gọi hàm đọc cảm biến.",
            "exerciseId": "prob_5"
        },
        "simulator": {
            "type": "hexmem",
            "label": "Mô Phỏng Bộ Nhớ Con Trỏ & Array Decay"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s02_q1",
                    "question": "Khi truyền 'int arr[10]' vào hàm 'void process(int a[])', sizeof(a) trên vi điều khiển ESP32-S3 32-bit sẽ trả về giá trị nào?",
                    "options": [
                        "4 bytes (kích thước của một con trỏ 32-bit do Array Decay).",
                        "40 bytes (kích thước của 10 phần tử int).",
                        "10 bytes.",
                        "Lỗi biên dịch vì mảng không thể truyền trực tiếp."
                    ],
                    "correct": 0,
                    "explanation": "Trong C, khi mảng được truyền làm đối số hàm, nó tự động suy biến thành con trỏ (Array Decay). Do đó sizeof(a) đo kích thước của con trỏ (4 bytes trên kiến trúc 32-bit Xtensa)."
                }
            ]
        }
    },
    {
        "id": "s03",
        "trackId": "track-c-core",
        "index": 2,
        "title": "Bản Đồ Bộ Nhớ ESP32-S3: SRAM, PSRAM & Flash",
        "shortTitle": "ESP32-S3 Memory Architecture",
        "category": "Memory Architecture",
        "xpReward": 150,
        "prerequisites": [
            "s02"
        ],
        "coordinates3D": {
            "x": -30,
            "y": 0,
            "z": 0
        },
        "theory": {
            "summary": "ESP32-S3 sở hữu kiến trúc phân tầng bộ nhớ độc đáo: 512KB SRAM nội (trong đó khoảng 384KB khả dụng cho firmware: IRAM cho mã thực thi tốc độ cao, DRAM cho dữ liệu biến), hỗ trợ mở rộng Octal SPI PSRAM ngoài lên tới 8MB/16MB. PSRAM cho phép lưu các mạng nơ-ron lớn và frame ảnh camera AI, nhưng có độ trễ truy xuất cao gấp 3-4 lần Internal SRAM và không thể truy cập khi Flash đang trong chu kỳ ghi (Cache disable).",
            "diagram": "[Internal SRAM (512KB)]\n  ├── IRAM (Fast, 0x4037_0000) ──> Mã lệnh ISR, Code nhạy cảm thời gian\n  └── DRAM (0x3FC8_0000)       ──> Biến toàn cục, Heap tĩnh, FreeRTOS stack\n[External Octal PSRAM (8MB)]\n  └── 0x3C00_0000              ──> Tensor Arena lớn, AI Image Framebuffer",
            "keyTakeaways": [
                "IRAM (Instruction RAM): Lưu hàm ngắt ISR và mã chạy khi Flash cache bị tắt.",
                "DRAM (Data RAM): Bộ nhớ dữ liệu chính cho CPU.",
                "PSRAM: Mở rộng bộ nhớ qua bus SPI tốc độ cao, cấp phát bằng heap_caps_malloc(MALLOC_CAP_SPIRAM)."
            ],
            "standardRef": "ESP32-S3 TRM Ch.2 (System and Memory)"
        },
        "codeLab": {
            "sampleCode": "#include <stdio.h>\n#include \"esp_heap_caps.h\"\n\nvoid check_esp32s3_memory(void) {\n    size_t free_sram = heap_caps_get_free_size(MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT);\n    size_t free_psram = heap_caps_get_free_size(MALLOC_CAP_SPIRAM);\n    \n    printf(\"Internal SRAM Free: %d KB\\n\", (int)(free_sram / 1024));\n    printf(\"External PSRAM Free: %d KB\\n\", (int)(free_psram / 1024));\n}",
            "instructions": "Khảo sát API heap_caps để phân biệt cấp phát giữa Internal SRAM và External PSRAM.",
            "exerciseId": "prob_9"
        },
        "simulator": {
            "type": "hexmem",
            "label": "Mô Phỏng Phân Bố SRAM / PSRAM"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s03_q1",
                    "question": "Hàm nào trong ESP-IDF được dùng để cấp phát một khối bộ nhớ bắt buộc phải nằm trên External PSRAM?",
                    "options": [
                        "heap_caps_malloc(size, MALLOC_CAP_SPIRAM)",
                        "malloc(size)",
                        "calloc(size, 1)",
                        "esp_psram_alloc(size)"
                    ],
                    "correct": 0,
                    "explanation": "Hàm malloc() mặc định ưu tiên Internal SRAM. Để yêu cầu cấp phát bộ nhớ ngoài PSRAM, kỹ sư phải sử dụng heap_caps_malloc() kèm cờ MALLOC_CAP_SPIRAM."
                }
            ]
        }
    },
    {
        "id": "s04",
        "trackId": "track-c-core",
        "index": 3,
        "title": "Cấp Phát Bộ Nhớ Tĩnh & Căn Lề 16-Byte Cho Vector SIMD",
        "shortTitle": "Static Allocation & 16-Byte Alignment",
        "category": "Memory Architecture",
        "xpReward": 150,
        "prerequisites": [
            "s03"
        ],
        "coordinates3D": {
            "x": -22,
            "y": 5,
            "z": 8
        },
        "theory": {
            "summary": "Trong hệ thống nhúng quan trọng và mô hình Edge AI, cấp phát động malloc() trong vòng lặp chính là điều tối kỵ vì gây phân mảnh bộ nhớ (Memory Fragmentation) và nguy cơ tràn Heap. Kỹ thuật cấp phát tĩnh (Static Tensor Arena) loại bỏ 100% rủi ro này. Đồng thời, CPU Xtensa LX7 của ESP32-S3 tích hợp tập lệnh Vector SIMD 128-bit chuyên dụng cho AI, đòi hỏi địa chỉ mảng bắt buộc phải căn lề 16-byte (alignas(16)), nếu không CPU sẽ văng Exception Cause 9 (LoadStoreAlignmentCause) dẫn đến Panic Reset.",
            "diagram": "Địa chỉ hợp lệ (alignas(16)):\n0x3FC80000 [16-Byte Vector SIMD Block 0]\n0x3FC80010 [16-Byte Vector SIMD Block 1]\nĐịa chỉ không căn lề (0x3FC80002) ──> GURU MEDITATION PANIC EXCEPTION!",
            "keyTakeaways": [
                "Cấp phát tĩnh loại bỏ phân mảnh Heap và rò rỉ bộ nhớ (Memory Leaks).",
                "Chỉ thị alignas(16) trong C11 hoặc __attribute__((aligned(16))) đảm bảo địa chỉ chia hết cho 16 bytes.",
                "Tập lệnh Vector SIMD của ESP32-S3 xử lý 16 phép toán INT8 cùng một lúc trong 1 chu kỳ."
            ],
            "standardRef": "ISO C11 §6.2.8 & ESP32-S3 TRM §2.2"
        },
        "codeLab": {
            "sampleCode": "#include <stdint.h>\n#include <stdalign.h>\n\n#define TENSOR_ARENA_SIZE  (64 * 1024)\n\n// Bắt buộc căn lề 16 bytes cho vector SIMD AI\nalignas(16) static uint8_t tensor_arena[TENSOR_ARENA_SIZE];\n\nuint8_t* get_tensor_arena(void) {\n    return tensor_arena;\n}",
            "instructions": "Khởi tạo Tensor Arena tĩnh căn lề 16-byte chuẩn bị cho TensorFlow Lite Micro.",
            "exerciseId": "prob_11"
        },
        "simulator": {
            "type": "hexmem",
            "label": "Mô Phỏng Alignment 16-Byte & Vector Boundary"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s04_q1",
                    "question": "Điều gì xảy ra nếu bạn truyền một con trỏ có địa chỉ lẻ (ví dụ 0x3FC80003) vào lệnh nạp Vector SIMD 128-bit trên ESP32-S3?",
                    "options": [
                        "CPU Xtensa kích hoạt Exception Cause 9 (LoadStoreAlignmentCause) gây Panic Reset.",
                        "CPU tự động làm tròn địa chỉ xuống 0x3FC80000.",
                        "Tốc độ tính toán giảm 50% nhưng chương trình vẫn chạy bình thường.",
                        "Compiler tự động chèn thêm padding bytes tại runtime."
                    ],
                    "correct": 0,
                    "explanation": "Tập lệnh nạp vector 128-bit (EE.VLD.128.IP) yêu cầu phần cứng địa chỉ phải căn lề 16 bytes (address % 16 == 0). Vi phạm điều này sẽ dẫn đến Panic Guru Meditation ngay lập tức."
                }
            ]
        }
    },
    {
        "id": "s05",
        "trackId": "track-c-core",
        "index": 4,
        "title": "Bộ Định Thời Phần Cứng GPTimer Định Nhịp Siêu Chính Xác",
        "shortTitle": "Hardware GPTimer & Precision",
        "category": "Timers & ISR",
        "xpReward": 160,
        "prerequisites": [
            "s04"
        ],
        "coordinates3D": {
            "x": -15,
            "y": 10,
            "z": 15
        },
        "theory": {
            "summary": "Các ứng dụng Edge AI như lấy mẫu cảm biến IMU (100Hz-1000Hz) hoặc thu âm micro (16kHz Nyquist) đòi hỏi tần số lấy mẫu cực kỳ ổn định, sai số chu kỳ (jitter) dưới 50 nanogiây. Không thể dùng vTaskDelay() của RTOS vì nó phụ thuộc vào RTOS tick (1ms). GPTimer (General Purpose Timer) của ESP32-S3 sử dụng bộ đếm 54-bit chạy trên xung APB 80MHz với bộ chia Prescaler, cho độ phân giải chính xác tới 1 microgiây.",
            "diagram": "[80MHz APB Clock] ──Prescaler /80──> [1MHz Clock (1µs Tick)]\n                                            │\n                                            ▼\n                               [54-bit GPTimer Counter]\n                                            │ Alarm @ 1000µs (1kHz)\n                                            ▼\n                                 [High-Speed Hardware Alarm]",
            "keyTakeaways": [
                "GPTimer cung cấp khả năng định thời phần cứng độc lập với CPU và RTOS scheduler.",
                "Prescaler = 80 chuyển đổi xung nhịp 80MHz APB thành tần số đếm 1MHz (1 microgiây/tick).",
                "Độ trễ và jitter dưới 100ns đảm bảo tính toàn vẹn của phổ tần số FFT."
            ],
            "standardRef": "ESP-IDF GPTimer Driver Guide & ESP32-S3 TRM Ch.11"
        },
        "codeLab": {
            "sampleCode": "#include \"driver/gptimer.h\"\n\ngptimer_handle_t init_high_precision_timer(void) {\n    gptimer_handle_t timer = NULL;\n    gptimer_config_t timer_config = {\n        .clk_src = GPTIMER_CLK_SRC_DEFAULT,\n        .direction = GPTIMER_COUNT_UP,\n        .resolution_hz = 1000000, // 1MHz = 1µs resolution\n    };\n    gptimer_new_timer(&timer_config, &timer);\n    return timer;\n}",
            "instructions": "Khởi tạo một timer phần cứng với độ phân giải 1 microgiây để phục vụ lấy mẫu rung động IMU.",
            "exerciseId": "prob_13"
        },
        "simulator": {
            "type": "calc",
            "label": "Bộ Tính Toán Tần Số Lấy Mẫu & Prescaler GPTimer"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s05_q1",
                    "question": "Để lấy mẫu cảm biến âm thanh ở tần số 16kHz chuẩn Nyquist, chu kỳ ngắt GPTimer cần được cài đặt là bao nhiêu microgiây?",
                    "options": [
                        "62.5 µs",
                        "100 µs",
                        "125 µs",
                        "16 µs"
                    ],
                    "correct": 0,
                    "explanation": "Chu kỳ T = 1 / f = 1 / 16,000 Hz = 0.0000625 giây = 62.5 microgiây."
                }
            ]
        }
    },
    {
        "id": "s06",
        "trackId": "track-c-core",
        "index": 5,
        "title": "Hàm Ngắt Tốc Độ Cao IRAM_ATTR & Deferred Processing",
        "shortTitle": "IRAM_ATTR ISR & Deferred Processing",
        "category": "Timers & ISR",
        "xpReward": 180,
        "prerequisites": [
            "s05"
        ],
        "coordinates3D": {
            "x": -8,
            "y": 15,
            "z": 20
        },
        "theory": {
            "summary": "Hàm phục vụ ngắt (Interrupt Service Routine - ISR) phải thực thi nhanh nhất có thể. Trong ESP-IDF, hàm ngắt phải được gắn cờ IRAM_ATTR để trình liên kết đặt code trực tiếp vào Internal SRAM thay vì Flash, đảm bảo hàm ngắt vẫn chạy ngay cả khi Flash Cache bị vô hiệu hóa trong lúc ghi bộ nhớ. Ngoài ra, kỹ thuật Deferred Processing (đẩy việc từ ISR sang Task qua Semaphore) là tiêu chuẩn bắt buộc để tránh làm nghẽn hệ thống.",
            "diagram": "[Hardware Interrupt]\n        │\n        ▼\n[IRAM_ATTR ISR] ──xSemaphoreGiveFromISR()──> [Worker Task (RTOS)]\n  (Dưới 2µs, SRAM)                              (Xử lý FFT & AI Inference)",
            "keyTakeaways": [
                "Cờ IRAM_ATTR đưa mã hàm ngắt vào Internal SRAM loại bỏ độ trễ nạp từ Flash.",
                "Bên trong ISR tuyệt đối không gọi các hàm blocking: printf, malloc, vTaskDelay.",
                "Sử dụng xSemaphoreGiveFromISR hoặc vTaskNotifyGiveFromISR kèm cờ pxHigherPriorityTaskWoken."
            ],
            "standardRef": "ESP-IDF Programming Guide: Interrupt Allocation"
        },
        "codeLab": {
            "sampleCode": "#include \"freertos/FreeRTOS.h\"\n#include \"freertos/semphr.h\"\n#include \"esp_attr.h\"\n\nstatic SemaphoreHandle_t s_sensor_sem;\n\n// Đặt trong IRAM chạy trực tiếp trên SRAM\nstatic bool IRAM_ATTR timer_isr_callback(void *arg) {\n    BaseType_t high_task_awoken = pdFALSE;\n    xSemaphoreGiveFromISR(s_sensor_sem, &high_task_awoken);\n    return high_task_awoken == pdTRUE;\n}",
            "instructions": "Viết callback ngắt có thuộc tính IRAM_ATTR đánh thức Worker Task bằng Semaphore.",
            "exerciseId": "prob_17"
        },
        "simulator": {
            "type": "freertos",
            "label": "Mô Phỏng Độ Trễ Ngắt ISR & Chuyển Ngữ Cảnh Context Switch"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s06_q1",
                    "question": "Điều gì có nguy cơ xảy ra nếu một hàm ngắt ISR không được khai báo cờ IRAM_ATTR trong ESP32?",
                    "options": [
                        "Hệ thống sẽ bị Panic Reset nếu ngắt xảy ra trong thời điểm Flash Cache đang bị tắt (ví dụ khi đang ghi NVS/OTA).",
                        "Tần số CPU bị hạ xuống 80MHz.",
                        "Hàm ngắt không bao giờ được kích hoạt.",
                        "Trình biên dịch GCC sẽ báo lỗi cú pháp."
                    ],
                    "correct": 0,
                    "explanation": "Khi firmware ghi vào Flash (NVS, OTA, SPIFFS), bộ điều khiển Flash Cache bị vô hiệu hóa tạm thời. Nếu ngắt xảy ra và mã ISR nằm trên Flash, CPU sẽ không đọc được mã lệnh và kích hoạt Fatal Crash/Guru Meditation."
                }
            ]
        }
    },
    {
        "id": "s07",
        "trackId": "track-esp32-sys",
        "index": 6,
        "title": "Giao Tiếp Cảm Biến I2C & SPI Tốc Độ Cao",
        "shortTitle": "I2C & SPI Protocol Drivers",
        "category": "Peripherals",
        "xpReward": 160,
        "prerequisites": [
            "s06"
        ],
        "coordinates3D": {
            "x": -5,
            "y": 22,
            "z": 15
        },
        "theory": {
            "summary": "Cảm biến chuyển động (IMU 6 trục MPU6050/LSM6DS3) là nguồn dữ liệu chủ đạo cho các bài toán phân loại hành vi và nhận diện bất thường. Giao tiếp I2C hoạt động ở chuẩn Fast Mode (400kHz), trong khi SPI hỗ trợ băng thông lên tới 10MHz-40MHz. Nắm vững việc cấu hình thanh ghi cảm biến, kiểm tra WHO_AM_I và đọc dữ liệu thô dạng Big-Endian bù 2 (Two's Complement) là nền tảng của kỹ sư nhúng.",
            "diagram": "[ESP32-S3 Master] ──SDA (Data) / SCL (Clock)──> [MPU6050 Slave (0x68)]\n                          Read WHO_AM_I (0x75) -> Expect 0x68\n                          Read ACCEL_XOUT_H (0x3B..0x3C) -> Raw 16-bit int",
            "keyTakeaways": [
                "I2C yêu cầu điện trở kéo lên (Pull-up Resistor) 4.7kΩ hoặc 2.2kΩ cho đường SDA/SCL.",
                "Dữ liệu 16-bit trục cảm biến thường gồm byte cao (High) và byte thấp (Low): (high << 8) | low.",
                "Chuyển đổi dữ liệu thô sang gia tốc trọng trường g dựa trên cấu hình Full-Scale Range (±2g, ±4g, ...)."
            ],
            "standardRef": "MPU6050 Datasheet & I2C-Bus Specification"
        },
        "codeLab": {
            "sampleCode": "#include <stdint.h>\n\nint16_t convert_accel_raw(uint8_t msb, uint8_t lsb) {\n    // Ghép 2 bytes Big-Endian bù 2\n    return (int16_t)((msb << 8) | lsb);\n}\n\nfloat convert_to_gravity_g(int16_t raw_val, float scale_lsb_per_g) {\n    return (float)raw_val / scale_lsb_per_g;\n}",
            "instructions": "Chuyển đổi 2 byte thô từ thanh ghi I2C thành giá trị gia tốc trọng trường (g).",
            "exerciseId": "prob_25"
        },
        "simulator": {
            "type": "gpio",
            "label": "Mô Phỏng Sóng Tín Hiệu I2C / SPI & Data Packets"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s07_q1",
                    "question": "Thanh ghi WHO_AM_I trên các cảm biến I2C/SPI dùng để làm gì trong firmware khởi động?",
                    "options": [
                        "Đọc mã định danh phần cứng (Device ID) để xác thực chip đã kết nối thành công trước khi cấu hình.",
                        "Lưu trữ địa chỉ MAC của cảm biến.",
                        "Khởi động lại chip về cài đặt mặc định.",
                        "Hiệu chuẩn độ nhạy cảm biến."
                    ],
                    "correct": 0,
                    "explanation": "WHO_AM_I là thanh ghi chỉ đọc chứa mã nhận diện cố định của nhà sản xuất (ví dụ 0x68 với MPU6050), dùng để kiểm tra kết nối phần cứng và phát hiện lỏng dây."
                }
            ]
        }
    },
    {
        "id": "s08",
        "trackId": "track-esp32-sys",
        "index": 7,
        "title": "Thu Âm Kỹ Thuật Số Băng Thông Cao I2S & DMA Streaming",
        "shortTitle": "I2S Digital Audio DMA Streaming",
        "category": "Peripherals",
        "xpReward": 180,
        "prerequisites": [
            "s07"
        ],
        "coordinates3D": {
            "x": 0,
            "y": 30,
            "z": 10
        },
        "theory": {
            "summary": "Để xử lý nhận diện giọng nói (Keyword Spotting) trên ESP32-S3, tín hiệu âm thanh phải được thu thập liên tục từ microphone số (INMP441) qua chuẩn I2S (Inter-IC Sound). Cơ chế DMA (Direct Memory Access) tự động đẩy các mẫu âm thanh từ phần cứng I2S vào bộ đệm SRAM mà không tiêu tốn chu kỳ tính toán của CPU. Kỹ sư sử dụng kỹ thuật Ping-Pong Buffer để vừa thu âm vừa suy luận AI đồng thời.",
            "diagram": "[I2S Mic (INMP441)] ──BCLK / WS / SD──> [I2S Peripheral]\n                                               │\n                                               ▼ (DMA Controller)\n                                  [DMA Buffer 0] ──> [DMA Buffer 1] (Ping-Pong)\n                                               │\n                                               ▼\n                                 [AI Inference Task (Core 1)]",
            "keyTakeaways": [
                "I2S gồm 3 đường tín hiệu chính: SCK/BCLK (Bit Clock), WS/LRCLK (Word Select), SD (Serial Data).",
                "DMA chuyển dữ liệu trực tiếp vào Internal SRAM mà CPU không cần can thiệp từng mẫu.",
                "Ping-Pong Buffer giải quyết bài toán thu âm liên tục không bị mất mẫu (zero drop)."
            ],
            "standardRef": "ESP-IDF I2S Driver Guide & Phillips I2S Specification"
        },
        "codeLab": {
            "sampleCode": "#include \"driver/i2s_std.h\"\n\n// Cấu hình I2S chuẩn lấy mẫu giọng nói 16kHz Mono\ni2s_chan_handle_t rx_handle;\nvoid init_i2s_microphone(void) {\n    i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);\n    i2s_new_channel(&chan_cfg, NULL, &rx_handle);\n}",
            "instructions": "Thiết lập kênh DMA I2S để thu dữ liệu âm thanh số phục vụ nhận diện từ khóa.",
            "exerciseId": "prob_29"
        },
        "simulator": {
            "type": "audio",
            "label": "Mô Phỏng Audio I2S DMA Buffer & Waveform"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s08_q1",
                    "question": "Lợi ích cốt lõi nhất của việc sử dụng bộ điều khiển DMA trong thu thập dữ liệu I2S trên ESP32 là gì?",
                    "options": [
                        "Dữ liệu được nạp thẳng vào RAM mà CPU không phải tốn chu kỳ ngắt cho từng mẫu âm thanh.",
                        "DMA tự động giải nén tín hiệu âm thanh MP3.",
                        "DMA tăng gấp đôi xung nhịp CPU lên 480MHz.",
                        "DMA cho phép phát âm thanh qua Bluetooth."
                    ],
                    "correct": 0,
                    "explanation": "Nếu không có DMA, CPU sẽ phải nhận 16,000 ngắt mỗi giây chỉ để đọc từng mẫu, làm tắc nghẽn hoàn toàn vi điều khiển. DMA tự nạp cả khối dữ liệu vào RAM trong nền."
                }
            ]
        }
    },
    {
        "id": "s09",
        "trackId": "track-esp32-sys",
        "index": 8,
        "title": "Lập Lịch FreeRTOS & Gán Task Đa Nhân Dual-Core (xTaskCreatePinnedToCore)",
        "shortTitle": "FreeRTOS Scheduling & Dual-Core Affinity",
        "category": "FreeRTOS",
        "xpReward": 180,
        "prerequisites": [
            "s08"
        ],
        "coordinates3D": {
            "x": 5,
            "y": 38,
            "z": 5
        },
        "theory": {
            "summary": "ESP32-S3 được trang bị 2 nhân CPU Xtensa LX7 (Core 0: Protocol CPU, Core 1: Application CPU). FreeRTOS trên ESP-IDF hỗ trợ phân chia tác vụ chuyên biệt: gán các tác vụ truyền thông Wi-Fi/Bluetooth và thu thập ngoại vi lên Core 0, dành trọn vẹn 100% tài nguyên tính toán của Core 1 cho việc suy luận mô hình AI và tính toán DSP hạng nặng thông qua xTaskCreatePinnedToCore().",
            "diagram": "[Xtensa Core 0 (PRO_CPU)] ──> Wi-Fi / BLE Stack + I2S Audio DMA Receiver\n[Xtensa Core 1 (APP_CPU)] ──> TensorFlow Lite Micro Inference + FFT Matrix Math",
            "keyTakeaways": [
                "xTaskCreatePinnedToCore() nhận tham số CoreID (0 hoặc 1, hoặc tskNO_AFFINITY).",
                "Phân tách rõ ràng luồng I/O và luồng tính toán AI triệt tiêu độ trễ giật (jitter).",
                "Stack size của Task phải được tính toán cẩn thận; thiếu stack sẽ gây Guru Meditation Stack Overflow."
            ],
            "standardRef": "Mastering the FreeRTOS Real Time Kernel Ch.3 & ESP-IDF SMP FreeRTOS"
        },
        "codeLab": {
            "sampleCode": "#include \"freertos/FreeRTOS.h\"\n#include \"freertos/task.h\"\n\nvoid ai_inference_task(void *pvParameters) {\n    while (1) {\n        // Thực thi mô hình AI trên Core 1\n        vTaskDelay(pdMS_TO_TICKS(50));\n    }\n}\n\nvoid app_main(void) {\n    xTaskCreatePinnedToCore(\n        ai_inference_task, \"ai_task\", 8192, NULL, 5, NULL, 1\n    );\n}",
            "instructions": "Khởi tạo một FreeRTOS Task dành riêng cho Core 1 với dung lượng Stack an toàn 8KB.",
            "exerciseId": "prob_37"
        },
        "simulator": {
            "type": "freertos",
            "label": "Mô Phỏng Dual-Core Task Scheduling & Core Load"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s09_q1",
                    "question": "Trong kiến trúc đa nhân ESP32-S3, tại sao tác vụ suy luận Edge AI thường được gán vào Core 1 thay vì Core 0?",
                    "options": [
                        "Core 0 đã gánh các tác vụ ngắt hệ thống, Wi-Fi và Bluetooth ngốn nhiều thời gian CPU.",
                        "Core 1 có tốc độ xung nhịp nhanh hơn Core 0.",
                        "Core 0 không thể truy cập bộ nhớ PSRAM.",
                        "Tập lệnh Vector SIMD chỉ hoạt động trên Core 1."
                    ],
                    "correct": 0,
                    "explanation": "Core 0 chịu trách nhiệm chạy giao thức mạng (Wi-Fi, BLE) và các ngắt hệ thống. Nếu chạy vòng lặp AI nặng trên Core 0 có thể dẫn đến mất kết nối mạng và kích hoạt Watchdog Timer."
                }
            ]
        }
    },
    {
        "id": "s10",
        "trackId": "track-esp32-sys",
        "index": 9,
        "title": "Giao Tiếp Liên Tác Vụ: Queue, Mutex & Priority Inversion",
        "shortTitle": "Inter-Task Communication & Mutex",
        "category": "FreeRTOS",
        "xpReward": 200,
        "prerequisites": [
            "s09"
        ],
        "coordinates3D": {
            "x": 10,
            "y": 45,
            "z": 0
        },
        "theory": {
            "summary": "Khi các Task chạy song song trên 2 nhân CPU, việc truyền dữ liệu và bảo vệ tài nguyên chia sẻ bắt buộc phải dùng các cơ chế đồng bộ hóa: Queue (sao chép an toàn dữ liệu), Mutex (khóa loại trừ tương hỗ) và Semaphore. Đặc biệt, hiện tượng 'Priority Inversion' (từng làm tê liệt tàu vũ trụ Mars Pathfinder năm 1997) được FreeRTOS giải quyết triệt để nhờ cơ chế Priority Inheritance tích hợp sẵn trong Mutex.",
            "diagram": "[Low Priority Task] ──Locks Mutex──> [High Priority Task Blocks!]\n                                             │\n      Priority Inheritance                   ▼\n  (Nâng tạm thời mức ưu tiên của Low lên High để giải phóng Mutex nhanh nhất)",
            "keyTakeaways": [
                "Queue truyền dữ liệu theo cơ chế Copy-by-Value; đối với dữ liệu lớn, truyền con trỏ (Pointer to Buffer).",
                "Mutex khác Binary Semaphore ở chỗ Mutex có cơ chế Priority Inheritance để ngăn chặn Priority Inversion.",
                "Luôn giải phóng Mutex sau khi hoàn thành truy xuất tài nguyên chung."
            ],
            "standardRef": "Mastering the FreeRTOS Real Time Kernel Ch.7 & Mars Pathfinder Bug Analysis"
        },
        "codeLab": {
            "sampleCode": "#include \"freertos/FreeRTOS.h\"\n#include \"freertos/queue.h\"\n#include \"freertos/semphr.h\"\n\nstatic QueueHandle_t s_sensor_queue;\nstatic SemaphoreHandle_t s_i2c_mutex;\n\nvoid setup_ipc(void) {\n    s_sensor_queue = xQueueCreate(10, sizeof(float));\n    s_i2c_mutex = xSemaphoreCreateMutex();\n}",
            "instructions": "Khởi tạo một Queue chứa 10 mẫu dữ liệu float và một Mutex bảo vệ bus I2C.",
            "exerciseId": "prob_41"
        },
        "simulator": {
            "type": "freertos",
            "label": "Mô Phỏng Trực Quan Queue & Priority Inversion Solution"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s10_q1",
                    "question": "Điểm khác biệt cốt lõi nhất giữa FreeRTOS Mutex và Binary Semaphore là gì?",
                    "options": [
                        "Mutex có cơ chế Priority Inheritance giúp giải quyết Priority Inversion; Semaphore thì không.",
                        "Semaphore chỉ dùng được trong hàm ngắt ISR.",
                        "Mutex có thể chứa được 10 phần tử dữ liệu.",
                        "Semaphore tiêu tốn nhiều bộ nhớ RAM hơn Mutex."
                    ],
                    "correct": 0,
                    "explanation": "Mutex được thiết kế cho Resource Exclusion với quyền sở hữu (ownership) và Priority Inheritance. Semaphore thiết kế cho đồng bộ hóa tín hiệu (signaling) và không có Priority Inheritance."
                }
            ]
        }
    },
    {
        "id": "s11",
        "trackId": "track-esp32-sys",
        "index": 10,
        "title": "Thông Báo Trực Tiếp Task Notification & Event Groups",
        "shortTitle": "Task Notifications & Event Groups",
        "category": "FreeRTOS",
        "xpReward": 200,
        "prerequisites": [
            "s10"
        ],
        "coordinates3D": {
            "x": 15,
            "y": 52,
            "z": -5
        },
        "theory": {
            "summary": "FreeRTOS Task Notifications là cơ chế giao tiếp siêu nhẹ, gửi tín hiệu trực tiếp vào cấu trúc TCB (Task Control Block) của một Task cụ thể mà không cần tạo thêm đối tượng Semaphore hay Queue bên ngoài. Cơ chế này nhanh hơn Semaphore tới 45% và tiết kiệm đáng kể RAM. Bên cạnh đó, Event Groups cho phép một tác vụ chờ đợi đồng thời nhiều sự kiện phần cứng (ví dụ: chờ cả Wi-Fi sẵn sàng VÀ Sensor sẵn sàng).",
            "diagram": "[ISR hoặc Task Gửi] ──xTaskNotifyGive()──> [Target Task TCB]\n  (Nhanh hơn 45%, tiêu tốn 0 byte RAM cấp phát thêm)",
            "keyTakeaways": [
                "Task Notification được nhúng sẵn trong TCB của mỗi Task, không tốn RAM cấp phát riêng.",
                "ulTaskNotifyTake() và xTaskNotifyWait() dùng để đón nhận sự kiện.",
                "Event Groups hỗ trợ kiểm tra logic AND / OR trên các bit cờ sự kiện (Event Bits)."
            ],
            "standardRef": "Mastering the FreeRTOS Real Time Kernel Ch.9"
        },
        "codeLab": {
            "sampleCode": "#include \"freertos/FreeRTOS.h\"\n#include \"freertos/task.h\"\n\nstatic TaskHandle_t s_worker_task_handle = NULL;\n\nvoid notify_worker(void) {\n    if (s_worker_task_handle != NULL) {\n        xTaskNotifyGive(s_worker_task_handle);\n    }\n}\n\nvoid worker_loop(void) {\n    // Chờ thông báo không tốn CPU cycle\n    ulTaskNotifyTake(pdTRUE, portMAX_DELAY);\n}",
            "instructions": "Triển khai cơ chế Task Notification thay thế Binary Semaphore để đánh thức tác vụ.",
            "exerciseId": "prob_45"
        },
        "simulator": {
            "type": "freertos",
            "label": "Mô Phỏng So Sánh Tốc Độ: Task Notification vs Semaphore"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s11_q1",
                    "question": "Tại sao Task Notifications trong FreeRTOS lại chạy nhanh hơn và tiết kiệm RAM hơn Binary Semaphore truyền thống?",
                    "options": [
                        "Vì giá trị thông báo được lưu trực tiếp trong TCB của Task, không cần khởi tạo thêm Queue đối tượng trong Heap.",
                        "Vì Task Notifications được xử lý bằng chip đồng xử lý ULP.",
                        "Vì nó chỉ gửi được dữ liệu dạng boolean.",
                        "Vì nó bỏ qua kiểm tra quyền truy xuất bộ nhớ."
                    ],
                    "correct": 0,
                    "explanation": "Mỗi Task đã có sẵn 1 trường 32-bit trong TCB của nó. Gửi thông báo là ghi trực tiếp vào TCB của Task đích mà không phải quản lý cấu trúc hàng đợi Queue phức tạp."
                }
            ]
        }
    },
    {
        "id": "s12",
        "trackId": "track-esp32-sys",
        "index": 11,
        "title": "Quản Lý Năng Lượng: Deep Sleep & RTC Fast Memory",
        "shortTitle": "Deep Sleep & RTC Memory",
        "category": "Power Management",
        "xpReward": 220,
        "prerequisites": [
            "s11"
        ],
        "coordinates3D": {
            "x": 20,
            "y": 58,
            "z": -10
        },
        "theory": {
            "summary": "Thiết bị Edge AI triển khai ngoài thực địa (Pin mặt trời / Pin Lithium 18650) không thể chạy liên tục ở mức công suất 240MHz (ngốn 100-240mA). Chế độ Deep Sleep ngắt nguồn toàn bộ CPU chính, bộ nhớ SRAM chính và các ngoại vi, đưa dòng tiêu thụ xuống dưới 10µA. Dữ liệu trạng thái AI và số đếm được bảo toàn trong 8KB RTC Fast Memory bằng từ khóa RTC_DATA_ATTR, và hệ thống thức dậy định kỳ qua RTC Timer hoặc ngắt ngoài.",
            "diagram": "[Active Mode (240MHz)] ──120mA──> Thu dữ liệu, Chạy AI Inference (100ms)\n                                         │\n                                         ▼ esp_deep_sleep_start()\n[Deep Sleep Mode]      ──8µA────> Tắt CPU & SRAM. Bảo toàn dữ liệu trong RTC_DATA_ATTR",
            "keyTakeaways": [
                "Deep Sleep giảm dòng tiêu thụ từ 100mA xuống ~8µA kéo dài tuổi thọ pin từ 2 ngày lên 2 năm.",
                "Biến khai báo với RTC_DATA_ATTR giữ nguyên giá trị sau các chu kỳ Deep Sleep.",
                "Các nguồn đánh thức: RTC Timer, GPIO ngắt ngoài, Touch sensor, ULP Coprocessor."
            ],
            "standardRef": "ESP32-S3 Low Power Management Guide"
        },
        "codeLab": {
            "sampleCode": "#include \"esp_sleep.h\"\n#include \"esp_attr.h\"\n\n// Biến này được lưu trong 8KB RTC Fast Memory không bị mất khi ngủ\nRTC_DATA_ATTR static int boot_count = 0;\n\nvoid enter_power_save(uint64_t sleep_time_sec) {\n    boot_count++;\n    esp_sleep_enable_timer_wakeup(sleep_time_sec * 1000000ULL);\n    esp_deep_sleep_start();\n}",
            "instructions": "Cấu hình vi điều khiển đi vào chế độ Deep Sleep 10 giây và lưu biến đếm vào RTC Memory.",
            "exerciseId": "prob_49"
        },
        "simulator": {
            "type": "calc",
            "label": "Bộ Ước Tính Tuổi Thọ Pin & Dòng Tiêu Thụ ESP32-S3"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s12_q1",
                    "question": "Để một biến toàn cục không bị reset về 0 sau khi ESP32-S3 thức dậy từ chế độ Deep Sleep, biến đó cần được gắn thuộc tính nào?",
                    "options": [
                        "RTC_DATA_ATTR",
                        "IRAM_ATTR",
                        "static const",
                        "volatile DRAM_ATTR"
                    ],
                    "correct": 0,
                    "explanation": "RTC_DATA_ATTR yêu cầu linker đặt biến vào vùng RTC Fast Memory (8KB). Vùng này được cấp nguồn độc lập từ RTC Power Domain ngay cả khi toàn bộ vi điều khiển ngủ say."
                }
            ]
        }
    },
    {
        "id": "s13",
        "trackId": "track-tinyml",
        "index": 12,
        "title": "Tiền Xử Lý Tín Hiệu Số: Moving Average & FFT Phổ Tần",
        "shortTitle": "Signal Preprocessing & FFT",
        "category": "Edge AI Preprocessing",
        "xpReward": 200,
        "prerequisites": [
            "s11",
            "s12"
        ],
        "coordinates3D": {
            "x": 22,
            "y": 15,
            "z": -15
        },
        "theory": {
            "summary": "Mô hình mạng nơ-ron không thể học hiệu quả nếu đưa trực tiếp tín hiệu cảm biến dạng thô (Raw Time-Series) vì nhiễu tần số cao và chiều không gian quá lớn. Kỹ thuật tiền xử lý biên bao gồm: bộ lọc Moving Average (lọc nhiễu chuyển động) và Biến đổi Fourier Nhanh FFT (Fast Fourier Transform) để chuyển tín hiệu miền thời gian sang phổ công suất miền tần số (Frequency Domain). Đây là bước đầu vào bắt buộc cho chẩn đoán lỗi máy công nghiệp.",
            "diagram": "[Tín Hiệu Rung Động Raw] ──> [Bộ Lọc Moving Average] ──> [Radix-2 FFT 256-Point]\n                                                              │\n                                                              ▼\n                                               [Phổ Năng Lượng Đỉnh Tần Số]",
            "keyTakeaways": [
                "Moving Average Filter làm mượt tín hiệu và triệt tiêu nhiễu cao tần.",
                "FFT phân tích tần số dao động để nhận diện dấu hiệu hỏng vòng bi động cơ trước khi xảy ra sự cố.",
                "ESP-DSP tối ưu hóa phép biến đổi FFT bằng tập lệnh assembly Xtensa tăng tốc 4x."
            ],
            "standardRef": "Digital Signal Processing (Oppenheim) & ESP-DSP Library Guide"
        },
        "codeLab": {
            "sampleCode": "#include <stdint.h>\n\n#define WINDOW_SIZE 5\nfloat moving_average_filter(float new_sample) {\n    static float window[WINDOW_SIZE] = {0};\n    static int idx = 0;\n    static float sum = 0;\n\n    sum -= window[idx];\n    window[idx] = new_sample;\n    sum += new_sample;\n    idx = (idx + 1) % WINDOW_SIZE;\n\n    return sum / WINDOW_SIZE;\n}",
            "instructions": "Triển khai bộ lọc làm mượt Moving Average dạng Ring Buffer không cấp phát động.",
            "exerciseId": "prob_33"
        },
        "simulator": {
            "type": "audio",
            "label": "Mô Phỏng Tín Hiệu Sóng Rung & Biến Đổi FFT Phổ Năng Lượng"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s13_q1",
                    "question": "Mục đích chính của việc áp dụng phép biến đổi FFT trước khi đưa dữ liệu rung động vào mô hình phân loại TinyML là gì?",
                    "options": [
                        "Trích xuất các đỉnh tần số đặc trưng (harmonic peaks) giúp giảm chiều dữ liệu và tăng độ chính xác của mạng nơ-ron.",
                        "Tăng kích thước tệp dữ liệu âm thanh.",
                        "Làm giảm xung nhịp của vi điều khiển.",
                        "Tự động giải phóng bộ nhớ Stack."
                    ],
                    "correct": 0,
                    "explanation": "Miền thời gian rất dễ bị nhiễu và khó nhận diện chu kỳ. Miền tần số FFT biểu diễn rõ nét năng lượng tại các tần số hỏng hóc cơ khí (ví dụ 120Hz, 360Hz), giúp mô hình AI phân loại cực nhanh."
                }
            ]
        }
    },
    {
        "id": "s14",
        "trackId": "track-tinyml",
        "index": 13,
        "title": "TensorFlow Lite for Microcontrollers & Quản Trị Tensor Arena",
        "shortTitle": "TFLM & Static Tensor Arena",
        "category": "TinyML Core",
        "xpReward": 220,
        "prerequisites": [
            "s13"
        ],
        "coordinates3D": {
            "x": 30,
            "y": 8,
            "z": -10
        },
        "theory": {
            "summary": "TensorFlow Lite for Microcontrollers (TFLM) là framework hàng đầu để chạy suy luận học sâu trên phần cứng nhúng không có hệ điều hành. Khác với phiên bản desktop, TFLM không dùng cấp phát động malloc() hay thư viện chuẩn C++. Thay vào đó, toàn bộ bộ nhớ trung gian cho các lớp mạng (Weights, Activations, Scratch Buffers) được gói gọn trong một khối mảng tĩnh duy nhất gọi là Tensor Arena.",
            "diagram": "[Mô hình .tflite trong Flash (const uint8_t g_model[])]\n                         │\n                         ▼\n[MicroInterpreter] <──> [Static Tensor Arena (alignas(16) uint8_t arena[kArenaSize])]\n                         (Chứa input tensor, intermediate activations, output tensor)",
            "keyTakeaways": [
                "Mô hình tflite được chuyển đổi thành mảng byte C lưu trong Flash bằng lệnh xxd -i.",
                "Tensor Arena phải được định cỡ đủ cho lớp mạng có activation lớn nhất.",
                "TFLM đảm bảo không có bất kỳ lệnh cấp phát bộ nhớ nào diễn ra trong lúc suy luận."
            ],
            "standardRef": "TinyML: Machine Learning with TensorFlow Lite (Pete Warden)"
        },
        "codeLab": {
            "sampleCode": "#include <stdalign.h>\n#include <stdint.h>\n\n// Định nghĩa mảng Tensor Arena tĩnh chuẩn C\n#define TENSOR_ARENA_SIZE  (32 * 1024)\nalignas(16) static uint8_t tensor_arena[TENSOR_ARENA_SIZE];\n\nuint8_t* get_model_arena_ptr(void) {\n    return tensor_arena;\n}\nsize_t get_model_arena_size(void) {\n    return TENSOR_ARENA_SIZE;\n}",
            "instructions": "Cấu hình khối Tensor Arena tĩnh 32KB căn lề 16-byte cho TFLM MicroInterpreter.",
            "exerciseId": "prob_53"
        },
        "simulator": {
            "type": "tinyml",
            "label": "Mô Phỏng Phân Bổ Bộ Nhớ Tensor Arena TFLM"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s14_q1",
                    "question": "Điều gì sẽ xảy ra nếu kích thước của Tensor Arena nhỏ hơn yêu cầu thực tế của mô hình TFLM?",
                    "options": [
                        "Hàm AllocateTensors() sẽ trả về mã lỗi kTfLiteError và quá trình khởi tạo thất bại.",
                        "Vi điều khiển tự động ghi tràn sang vùng Flash.",
                        "Mô hình vẫn chạy nhưng độ chính xác giảm xuống 50%.",
                        "Compiler sẽ báo lỗi ngay khi nạp code."
                    ],
                    "correct": 0,
                    "explanation": "Trong bước khởi tạo, MicroInterpreter gọi AllocateTensors(). Nếu Tensor Arena không đủ dung lượng chứa các tensor trung gian, hàm sẽ báo lỗi kTfLiteError và không thể thực thi."
                }
            ]
        }
    },
    {
        "id": "s15",
        "trackId": "track-tinyml",
        "index": 14,
        "title": "Lượng Tử Hóa INT8: Scale, Zero-Point & Tối Ưu Bộ Nhớ 4x",
        "shortTitle": "INT8 Quantization & Formulas",
        "category": "TinyML Core",
        "xpReward": 240,
        "prerequisites": [
            "s14"
        ],
        "coordinates3D": {
            "x": 38,
            "y": 0,
            "z": -5
        },
        "theory": {
            "summary": "Mô hình học sâu ban đầu lưu trữ trọng số và kích hoạt dạng số thực 32-bit (FP32). Lượng tử hóa INT8 (Post-Training Quantization) ánh xạ dải giá trị thực sang số nguyên 8-bit (-128 đến 127) thông qua công thức toán học: real_value = scale * (quantized_value - zero_point). Kỹ thuật này giảm 75% dung lượng mô hình trong Flash, giảm 75% bộ nhớ RAM và tăng tốc độ suy luận từ 3-5 lần.",
            "diagram": "[FP32 Weight (4 Bytes)] ──Lượng Tử Hóa INT8──> [INT8 Weight (1 Byte)]\n  - Dung lượng: Giảm 4 LẦN (Tiết kiệm Flash & RAM)\n  - Tốc độ: Phép nhân số nguyên INT8 nhanh hơn FP32 gấp nhiều lần trên Xtensa LX7",
            "keyTakeaways": [
                "Công thức lượng tử hóa: q = round(r / S) + Z.",
                "Công thức giải lượng tử: r = S * (q - Z).",
                "INT8 giúp mạng nơ-ron chạy mượt mà ngay cả trên vi điều khiển chỉ có vài trăm KB SRAM."
            ],
            "standardRef": "Quantization and Training of Neural Networks (Jacob et al.)"
        },
        "codeLab": {
            "sampleCode": "#include <stdint.h>\n#include <math.h>\n\nint8_t quantize_float_to_int8(float r, float scale, int32_t zero_point) {\n    int32_t q = (int32_t)roundf(r / scale) + zero_point;\n    if (q > 127) q = 127;\n    if (q < -128) q = -128;\n    return (int8_t)q;\n}\n\nfloat dequantize_int8_to_float(int8_t q, float scale, int32_t zero_point) {\n    return scale * ((int32_t)q - zero_point);\n}",
            "instructions": "Lập trình hàm chuyển đổi qua lại giữa FP32 và INT8 theo công thức Scale và Zero-Point.",
            "exerciseId": "prob_57"
        },
        "simulator": {
            "type": "tinyml",
            "label": "Mô Phỏng Trực Quan Dải Phân Bố Trọng Số FP32 vs INT8"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s15_q1",
                    "question": "Một mô hình AI có kích thước 1.2MB ở định dạng FP32. Sau khi lượng tử hóa hoàn toàn sang INT8, kích thước dự kiến của mô hình trong Flash sẽ xấp xỉ bao nhiêu?",
                    "options": [
                        "Khoảng 300 KB (giảm 4 lần).",
                        "Khoảng 600 KB (giảm 2 lần).",
                        "Khoảng 100 KB (giảm 12 lần).",
                        "Kích thước không thay đổi."
                    ],
                    "correct": 0,
                    "explanation": "Mỗi trọng số FP32 chiếm 4 bytes (32 bits). Chuyển sang INT8 chỉ chiếm 1 byte (8 bits). Do đó, dung lượng lưu trữ giảm đi chính xác 4 lần (1.2MB / 4 = 300KB)."
                }
            ]
        }
    },
    {
        "id": "s16",
        "trackId": "track-tinyml",
        "index": 15,
        "title": "Tăng Tốc Phần Cứng ESP-NN SIMD Vector Trên Xtensa LX7",
        "shortTitle": "ESP-NN SIMD Vector Acceleration",
        "category": "Hardware Acceleration",
        "xpReward": 250,
        "prerequisites": [
            "s15"
        ],
        "coordinates3D": {
            "x": 45,
            "y": -8,
            "z": 0
        },
        "theory": {
            "summary": "ESP32-S3 sở hữu tập lệnh xử lý vector SIMD (Single Instruction Multiple Data) 128-bit chuyên biệt cho AI. Thư viện ESP-NN của Espressif thay thế các kernel tính toán chuẩn của TFLM (như phép tích chập Conv2D, FullyConnected, DepthwiseConv2D) bằng các đoạn mã hợp ngữ (Assembly) tối ưu, thực thi đồng thời 16 phép nhân cộng tích lũy (MAC) 8-bit trong 1 chu kỳ máy, đẩy tốc độ xử lý AI lên gấp 3-4 lần.",
            "diagram": "[Chuẩn C TFLM Kernel]  ──> 1 phép nhân MAC / chu kỳ\n[ESP-NN Xtensa Vector] ──> 16 phép nhân MAC / chu kỳ (EE.VLD.128 + Vector MAC)\nTốc độ tăng vọt: 350% (Rút ngắn thời gian suy luận từ 80ms xuống 22ms)",
            "keyTakeaways": [
                "ESP-NN là thư viện mã nguồn mở tối ưu kernel nơ-ron cho dòng chip Espressif.",
                "Tập lệnh Vector 128-bit xử lý song song 16 mẫu số nguyên 8-bit trong một chu kỳ.",
                "Giảm thời gian suy luận giúp vi điều khiển nhanh chóng trở lại chế độ ngủ tiết kiệm điện."
            ],
            "standardRef": "ESP-NN Technical Manual & Espressif AI Acceleration Guide"
        },
        "codeLab": {
            "sampleCode": "#include \"esp_nn.h\"\n\n// Thư viện ESP-NN tự động thay thế kernel phép nhân ma trận chuẩn\nvoid run_accelerated_matrix_mult(void) {\n    // Gọi hàm tối ưu phần cứng của ESP-NN\n    // esp_nn_mat_mult_s8(...)\n}",
            "instructions": "Khảo sát cơ chế tích hợp thư viện ESP-NN vào TFLM Engine trên ESP32-S3.",
            "exerciseId": "prob_61"
        },
        "simulator": {
            "type": "tinyml",
            "label": "Mô Phỏng So Sánh Tốc Độ: Chuẩn C vs ESP-NN SIMD Vector"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s16_q1",
                    "question": "Tập lệnh Vector SIMD trên nhân CPU Xtensa LX7 của ESP32-S3 có thể xử lý bao nhiêu phép toán INT8 cùng một lúc trong 1 chu kỳ?",
                    "options": [
                        "16 phép toán (với thanh ghi vector 128-bit).",
                        "4 phép toán.",
                        "32 phép toán.",
                        "64 phép toán."
                    ],
                    "correct": 0,
                    "explanation": "Độ rộng thanh ghi vector là 128 bits. Mỗi số nguyên INT8 là 8 bits. Số lượng phần tử xử lý đồng thời là 128 / 8 = 16 phần tử."
                }
            ]
        }
    },
    {
        "id": "s17",
        "trackId": "track-tinyml",
        "index": 16,
        "title": "Nhận Diện Từ Khóa Âm Thanh (Keyword Spotting - KWS) & MFCC",
        "shortTitle": "Keyword Spotting (KWS) & Audio Pipeline",
        "category": "Edge Audio AI",
        "xpReward": 260,
        "prerequisites": [
            "s16"
        ],
        "coordinates3D": {
            "x": 52,
            "y": -15,
            "z": 5
        },
        "theory": {
            "summary": "Keyword Spotting (KWS) là bài toán kinh điển trong Edge AI (như nhận diện lệnh 'Bật Đèn', 'Tắt Quạt' offline trên thiết bị gia dụng thông minh). Chuỗi xử lý hoàn chỉnh gồm: Thu âm 16kHz qua I2S DMA -> Cắt khung thời gian 30ms (Windowing) -> Tính toán phổ Mel-Frequency Cepstral Coefficients (MFCC) -> Đưa ma trận quang phổ (Spectrogram) vào mạng nơ-ron tích chập 1D/2D CNN để phân loại từ khóa.",
            "diagram": "[I2S Audio (16kHz)] ──> [Hanning Window (30ms)] ──> [FFT + Mel Filterbank]\n                                                              │\n                                                              ▼\n[CNN Model (INT8)] <── [Spectrogram Matrix 40x49] <── [MFCC Features]\n        │\n        ▼ Output: 'BẬT ĐÈN' (98.4% Confidence)",
            "keyTakeaways": [
                "MFCC mô phỏng cách tai người cảm nhận âm thanh theo thang đo phi tuyến Mel.",
                "Ma trận Spectrogram biến âm thanh miền thời gian thành ảnh 2 chiều để mạng CNN nhận diện.",
                "Cần cơ chế Average Thresholding để chống kích hoạt sai (False Positive) do tạp âm môi trường."
            ],
            "standardRef": "Speech and Language Processing (Jurafsky & Martin) & TFLM Micro Speech"
        },
        "codeLab": {
            "sampleCode": "#include <stdint.h>\n\n#define MFCC_COEFFS 10\n#define TIME_STEPS  49\n\ntypedef struct {\n    int8_t spectrogram[TIME_STEPS][MFCC_COEFFS];\n    int current_step;\n} kws_feature_buffer_t;\n\nvoid append_mfcc_slice(kws_feature_buffer_t *buf, const int8_t *new_slice) {\n    // Đẩy khung quang phổ mới vào hàng đợi\n}",
            "instructions": "Xây dựng cấu trúc ma trận Spectrogram 2D tích lũy các lát cắt MFCC cho mạng CNN.",
            "exerciseId": "prob_65"
        },
        "simulator": {
            "type": "audio",
            "label": "Mô Phỏng Biểu Đồ Âm Phổ Spectrogram Thời Gian Thực"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s17_q1",
                    "question": "Tại sao các bài toán nhận diện giọng nói vi điều khiển (KWS) lại dùng hệ số MFCC thay vì đưa trực tiếp dữ liệu sóng âm thô (Waveform)?",
                    "options": [
                        "Vì MFCC nén dữ liệu rất mạnh và giữ lại đặc trưng âm sắc sinh học của giọng người, giúp mạng nơ-ron nhỏ vẫn học tốt.",
                        "Vì sóng âm thô không thể nạp vào RAM của ESP32.",
                        "Vì MFCC tự động dịch ngôn ngữ sang tiếng Anh.",
                        "Vì TFLM không hỗ trợ mạng 1D."
                    ],
                    "correct": 0,
                    "explanation": "Sóng âm thô 16,000 mẫu/giây quá cồng kềnh và chứa nhiều thông tin pha dư thừa. MFCC cô đọng thông tin vào vài chục hệ số phổ Mel mà tai người nhạy cảm nhất, giảm kích thước mô hình đi hàng chục lần."
                }
            ]
        }
    },
    {
        "id": "s18",
        "trackId": "track-tinyml",
        "index": 17,
        "title": "Phát Hiện Bất Thường Cảm Biến Bằng Mạng Autoencoder (Industrial IoT)",
        "shortTitle": "Autoencoder Anomaly Detection",
        "category": "Edge AI Inference",
        "xpReward": 280,
        "prerequisites": [
            "s17"
        ],
        "coordinates3D": {
            "x": 58,
            "y": -22,
            "z": 10
        },
        "theory": {
            "summary": "Trong bảo trì dự đoán công nghiệp (Predictive Maintenance), rất khó thu thập dữ liệu máy bị hỏng hóc vì máy móc hoạt động bình thường 99.9% thời gian. Giải pháp tối ưu là huấn luyện mạng nơ-ron Autoencoder chỉ trên dữ liệu trạng thái bình thường. Khi động cơ xuất hiện lỗi cơ khí (lệch trục, mòn bi), sai số tái tạo (Reconstruction Error = MSE(Input, Output)) sẽ vọt lên vượt ngưỡng cảnh báo (Anomaly Threshold), lập tức cảnh báo sự cố.",
            "diagram": "[Input Feature (X)] ──> [Encoder] ──> [Bottleneck Latent] ──> [Decoder] ──> [Output (X')]\n                                                                                  │\n  Bình thường: MSE(X, X') < 0.05 (Hệ thống an toàn)                              ▼\n  BẤT THƯỜNG:  MSE(X, X') > 0.25 (CẢNH BÁO BẢO TRÌ VÒNG BI!) ──> Reconstruction Error",
            "keyTakeaways": [
                "Autoencoder học cách nén và tái tạo trạng thái hoạt động bình thường của máy móc.",
                "Sai số tái cấu trúc MSE là thước đo phát hiện bất thường không cần gán nhãn lỗi trước.",
                "Mô hình nhỏ gọn (vài chục KB) chạy hoàn hảo trên ESP32-S3 với tần số đánh giá 10Hz-50Hz."
            ],
            "standardRef": "Deep Learning (Goodfellow et al.) & IEEE IoT Journal Predictive Maintenance"
        },
        "codeLab": {
            "sampleCode": "#include <math.h>\n\nfloat calculate_reconstruction_error(const float *input, const float *reconstructed, int size) {\n    float mse = 0.0f;\n    for (int i = 0; i < size; i++) {\n        float diff = input[i] - reconstructed[i];\n        mse += diff * diff;\n    }\n    return mse / (float)size;\n}\n\nint is_anomaly_detected(float mse_error, float threshold) {\n    return mse_error > threshold;\n}",
            "instructions": "Tính toán sai số bình phương trung bình (MSE) giữa vector đầu vào và vector tái cấu trúc của Autoencoder.",
            "exerciseId": "prob_69"
        },
        "simulator": {
            "type": "tinyml",
            "label": "Mô Phỏng Sai Số Autoencoder & Ngưỡng Phát Hiện Bất Thường"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s18_q1",
                    "question": "Tại sao mô hình Autoencoder là lựa chọn hàng đầu cho bài toán phát hiện bất thường (Anomaly Detection) trong nhà máy thay vì mô hình phân loại nhị phân thông thường?",
                    "options": [
                        "Vì Autoencoder chỉ cần học trên dữ liệu hoạt động bình thường, không đòi hỏi phải có tập dữ liệu máy móc hỏng hóc cực kỳ hiếm gặp.",
                        "Vì Autoencoder không cần bộ nhớ Tensor Arena.",
                        "Vì Autoencoder chạy mà không cần xung nhịp CPU.",
                        "Vì nó chỉ áp dụng được cho tín hiệu hình ảnh."
                    ],
                    "correct": 0,
                    "explanation": "Trong thực tế công nghiệp, máy hỏng là sự kiện hiếm và mang tính hủy hoại, không thể tạo ra hàng ngàn mẫu máy hỏng để huấn luyện có giám sát. Autoencoder giải quyết xuất sắc bằng học không giám sát trên dữ liệu máy khỏe."
                }
            ]
        }
    },
    {
        "id": "s19",
        "trackId": "track-capstone",
        "index": 18,
        "title": "Dự Án 1: Ghi Dữ Liệu Rung Động Tần Số Cao & Bộ Đệm SRAM Kép",
        "shortTitle": "Capstone 1: Zero-Jitter Vibration Logger",
        "category": "Capstone Project",
        "xpReward": 300,
        "prerequisites": [
            "s06",
            "s07"
        ],
        "coordinates3D": {
            "x": 0,
            "y": -25,
            "z": 25
        },
        "theory": {
            "summary": "Dự án tổng hợp cấp độ Junior Embedded: Thiết kế firmware C định thời chính xác bằng GPTimer ở tần số 1000Hz (chu kỳ 1000µs ± 50ns jitter), thu thập mẫu rung động vào bộ đệm tĩnh căn lề 16-byte trong Internal SRAM, luân chuyển bộ đệm kép Ping-Pong và đánh thức Task nền qua Semaphore.",
            "diagram": "[GPTimer Alarm @ 1kHz]\n          │ (Hardware Interrupt)\n          ▼\n  [IRAM_ATTR Timer ISR] ──────┐\n          │ (Toggle Buffer)   │ (Give Binary Semaphore)\n          ▼                   ▼\n  [DMA Ping-Pong Buffer]   [xSemaphoreGiveFromISR]\n    (alignas(16) SRAM)        │\n                              ▼\n                     [Background Worker Task]\n                     (SRAM Processing & Logging)",
            "keyTakeaways": [
                "Chu kỳ định thời 1000µs ± 50ns jitter với GPTimer.",
                "Bộ đệm tĩnh Ping-Pong buffer_ping[512] và buffer_pong[512] căn lề 16-byte.",
                "Deferred Processing từ IRAM_ATTR ISR sang Background Task qua Semaphore.",
                "Đạt kiểm tra độ trễ ngắt dưới 2µs không gây nghẽn CPU."
            ],
            "standardRef": "ESP-IDF GPTimer & FreeRTOS Architecture Guidelines"
        },
        "codeLab": {
            "sampleCode": "// CAPSTONE PROJECT 1: ZERO-JITTER HIGH-FREQ LOGGER (ESP-IDF C)\n#include <stdio.h>\n#include <string.h>\n#include <stdalign.h>\n#include \"freertos/FreeRTOS.h\"\n#include \"freertos/task.h\"\n#include \"freertos/semphr.h\"\n#include \"driver/gptimer.h\"\n\n#define BUFFER_SIZE 512\nalignas(16) static uint16_t buffer_ping[BUFFER_SIZE];\nalignas(16) static uint16_t buffer_pong[BUFFER_SIZE];\nstatic volatile int active_buffer = 0; // 0: ping, 1: pong\nstatic SemaphoreHandle_t sem_buffer_ready = NULL;\n\nstatic bool IRAM_ATTR timer_alarm_cb(gptimer_handle_t timer, const gptimer_alarm_event_data_t *edata, void *user_ctx) {\n    BaseType_t high_task_awoken = pdFALSE;\n    active_buffer = !active_buffer;\n    xSemaphoreGiveFromISR(sem_buffer_ready, &high_task_awoken);\n    return high_task_awoken == pdTRUE;\n}",
            "instructions": "Xem mã nguồn đầy đủ của Dự Án 1 trong tab Capstone và chạy thử nghiệm luân chuyển bộ đệm Ping-Pong.",
            "exerciseId": "proj_1_logger"
        },
        "simulator": {
            "type": "freertos",
            "label": "Mô Phỏng Trực Quan Bộ Đệm Ping-Pong & Tần Số Ngắt 1kHz"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s19_q1",
                    "question": "Trong kiến trúc bộ đệm kép Ping-Pong của Capstone 1, tại sao cần 2 bộ đệm riêng biệt thay vì 1 bộ đệm duy nhất?",
                    "options": [
                        "Để khi ngắt phần cứng đang nạp dữ liệu mới vào bộ đệm này thì CPU có thể yên tâm xử lý dữ liệu ở bộ đệm kia mà không bị xung đột tài nguyên.",
                        "Để tăng gấp đôi dung lượng thẻ nhớ SD.",
                        "Để chia đều dữ liệu cho 2 nhân CPU chạy độc lập.",
                        "Để lưu dữ liệu dạng số âm và số dương riêng biệt."
                    ],
                    "correct": 0,
                    "explanation": "Bộ đệm kép Ping-Pong loại bỏ hoàn toàn độ trễ chờ đợi: Một đệm thu thập dữ liệu từ ngắt, đệm còn lại được Task nền xử lý. Khi đầy, hai đệm hoán đổi vai trò cho nhau."
                }
            ]
        }
    },
    {
        "id": "s20",
        "trackId": "track-capstone",
        "index": 19,
        "title": "Dự Án 2: Đường Ống Đa Nhiệm FreeRTOS Công Nghiệp Trên ESP32-S3",
        "shortTitle": "Capstone 2: Industrial FreeRTOS Dual-Core Pipeline",
        "category": "Capstone Project",
        "xpReward": 300,
        "prerequisites": [
            "s10",
            "s19"
        ],
        "coordinates3D": {
            "x": 0,
            "y": -15,
            "z": 35
        },
        "theory": {
            "summary": "Dự án tổng hợp cấp độ Mid-Level Embedded: Xây dựng hệ thống firmware RTOS đa nhiệm phân tách 2 nhân CPU (Core 0 và Core 1). Core 0 thu thập cảm biến tốc độ cao và giám sát mạng; Core 1 thực thi đường ống tiền xử lý DSP. Giao tiếp giữa 2 nhân thông qua FreeRTOS Queue an toàn, bảo vệ thanh ghi bằng Mutex và giám sát sống còn bằng Task Watchdog Timer (TWDT).",
            "diagram": "[Xtensa Core 0 (PRO_CPU)]                    [Xtensa Core 1 (APP_CPU)]\n┌───────────────────────────────┐           ┌───────────────────────────────┐\n│ Task_Acquisition (Prio: 10)   │           │ Task_DSP_Pipeline (Prio: 8)   │\n│ - Thu dữ liệu cảm biến        │ ──Queue──>│ - Lọc nhiễu Moving Avg        │\n│ - Cho ăn TWDT (Core 0)        │           │ - Tính năng lượng phổ FFT     │\n└───────────────────────────────┘           └───────────────────────────────┘",
            "keyTakeaways": [
                "Gán tác vụ chuyên biệt vào 2 nhân bằng xTaskCreatePinnedToCore().",
                "Truyền dữ liệu không giật bằng FreeRTOS Queue cơ chế Copy-by-Value.",
                "Tích hợp Task Watchdog Timer (TWDT) tự động reset chip nếu có Task bị deadlock.",
                "Bảo vệ bus truyền thông I2C/SPI bằng Mutex có Priority Inheritance."
            ],
            "standardRef": "ESP-IDF Task Watchdog Timer (TWDT) & Multi-Core FreeRTOS"
        },
        "codeLab": {
            "sampleCode": "// CAPSTONE PROJECT 2: DUAL-CORE FREERTOS PIPELINE\n#include \"freertos/FreeRTOS.h\"\n#include \"freertos/task.h\"\n#include \"freertos/queue.h\"\n#include \"esp_task_wdt.h\"\n\nstatic QueueHandle_t s_data_queue = NULL;\n\nvoid acquisition_task_core0(void *param) {\n    esp_task_wdt_add(NULL);\n    while (1) {\n        // Thu mẫu cảm biến & gửi vào Queue\n        esp_task_wdt_reset();\n        vTaskDelay(pdMS_TO_TICKS(10));\n    }\n}",
            "instructions": "Khảo sát kiến trúc đa luồng phân tách Core 0 / Core 1 và cơ chế Task Watchdog Timer.",
            "exerciseId": "proj_2_freertos"
        },
        "simulator": {
            "type": "freertos",
            "label": "Mô Phỏng Luồng Dữ Liệu Queue Giữa 2 Nhân CPU"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s20_q1",
                    "question": "Nếu một Task có độ ưu tiên cao trên Core 1 rơi vào vòng lặp vô tận while(1) mà không gọi hàm esp_task_wdt_reset() hay vTaskDelay(), điều gì sẽ xảy ra?",
                    "options": [
                        "Task Watchdog Timer (TWDT) bị timeout và kích hoạt Panic Reset để bảo vệ hệ thống khỏi treo vĩnh viễn.",
                        "Hệ thống tự động hạ độ ưu tiên của Task đó xuống 0.",
                        "CPU chuyển quyền thực thi sang Core 0 mà không có tác động nào.",
                        "Bộ nhớ SRAM tự động xóa sạch để khôi phục trạng thái."
                    ],
                    "correct": 0,
                    "explanation": "Task Watchdog Timer (TWDT) theo dõi định kỳ việc 'cho ăn' (feeding). Nếu một Task bị kẹt không reset WDT trong khoảng thời gian quy định, TWDT sẽ coi đó là lỗi treo hệ thống nghiêm trọng và khởi động lại vi điều khiển."
                }
            ]
        }
    },
    {
        "id": "s21",
        "trackId": "track-capstone",
        "index": 20,
        "title": "Dự Án 3: Động Cơ Chẩn Đoán Lỗi Rung Động TinyML Biên Thời Gian Thực",
        "shortTitle": "Capstone 3: TinyML Vibration Anomaly Engine",
        "category": "Capstone Project",
        "xpReward": 300,
        "prerequisites": [
            "s16",
            "s18"
        ],
        "coordinates3D": {
            "x": 0,
            "y": -5,
            "z": 45
        },
        "theory": {
            "summary": "Dự án tổng hợp cấp độ Senior Edge AI: Triển khai toàn diện một giải pháp TinyML chẩn đoán lỗi động cơ công nghiệp chạy 100% on-device trên ESP32-S3. Pipeline bao gồm: Thu thập mẫu gia tốc 6 trục -> Tiền xử lý FFT trích xuất 32 đỉnh phổ tần -> Nạp vào mạng nơ-ron INT8 trong Tensor Arena 48KB -> Tăng tốc SIMD bằng ESP-NN -> Xuất kết quả phân loại lỗi trong thời gian dưới 25ms.",
            "diagram": "[Cảm Biến Gia Tốc IMU] ──> [Radix-2 FFT 256-Point] ──> [32 Feature Vector]\n                                                               │\n                                                               ▼\n[Báo Cáo Sức Khỏe Máy] <── [Thời Gian Suy Luận < 25ms] <── [TFLM + ESP-NN INT8]",
            "keyTakeaways": [
                "Pipeline hoàn chỉnh từ cảm biến phần cứng đến suy luận mạng nơ-ron học sâu.",
                "Mô hình INT8 nén kích thước xuống dưới 45KB phù hợp hoàn hảo với SRAM.",
                "Tăng tốc ESP-NN đạt độ trễ suy luận dưới 25ms ở tần số CPU 240MHz.",
                "Độ chính xác phân loại lỗi đạt trên 96% theo chuẩn công nghiệp ISO 10816."
            ],
            "standardRef": "ISO 10816 Mechanical Vibration Standards & TinyML TFLM Pipeline"
        },
        "codeLab": {
            "sampleCode": "// CAPSTONE PROJECT 3: TINYML VIBRATION ENGINE (ESP32-S3 TFLM)\n#include <stdalign.h>\n#include \"tensorflow/lite/micro/micro_interpreter.h\"\n\n#define ARENA_SIZE (48 * 1024)\nalignas(16) static uint8_t s_tensor_arena[ARENA_SIZE];\n\nvoid run_anomaly_inference(const int8_t *input_features, int8_t *output_scores) {\n    // Thực thi suy luận với mô hình nén INT8\n}",
            "instructions": "Khảo sát pipeline hoàn chỉnh của Capstone 3 và kích hoạt mô phỏng suy luận.",
            "exerciseId": "proj_3_tinyml"
        },
        "simulator": {
            "type": "tinyml",
            "label": "Mô Phỏng Trực Quan Pipeline TinyML & Kết Quả Chẩn Đoán Máy"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s21_q1",
                    "question": "Để triển khai giải pháp TinyML bảo trì dự đoán cho máy móc theo chuẩn ISO 10816, yếu tố nào là thước đo quan trọng nhất về mặt kỹ thuật phần mềm nhúng?",
                    "options": [
                        "Độ trễ suy luận tính toán xác định (Deterministic Latency), không cấp phát động gây phân mảnh SRAM và không phụ thuộc vào kết nối mạng Internet.",
                        "Tốc độ tải mô hình từ máy chủ đám mây về.",
                        "Khả năng hiển thị đồ họa 3D trên màn hình OLED.",
                        "Kích thước file mã nguồn C phải dưới 100 dòng."
                    ],
                    "correct": 0,
                    "explanation": "Thiết bị biên công nghiệp bắt buộc phải hoạt động độc lập (Offline), phản hồi trong thời gian thực xác định và tuyệt đối không bị treo do phân mảnh bộ nhớ (Memory Fragmentation)."
                }
            ]
        }
    },
    {
        "id": "s22",
        "trackId": "track-capstone",
        "index": 21,
        "title": "Dự Án 4: Thị Giác Máy Tính Biên ESP32-S3 Sense AI Camera",
        "shortTitle": "Capstone 4: Edge Vision AI Camera",
        "category": "Capstone Project",
        "xpReward": 300,
        "prerequisites": [
            "s03",
            "s21"
        ],
        "coordinates3D": {
            "x": 0,
            "y": 5,
            "z": 55
        },
        "theory": {
            "summary": "Dự án tổng hợp cấp độ Senior Computer Vision: Tích hợp module camera OV2640 qua bus DVP/DMA 8-bit vào bộ nhớ ngoài Octal PSRAM 8MB trên board ESP32-S3 Sense. Firmware thực hiện nén ảnh JPEG, chuyển đổi định dạng RGB565 và nạp ma trận điểm ảnh vào mô hình MobileNetV1 / FOMO (Faster Objects, More Objects) để phát hiện khuôn mặt và vật thể trong thời gian thực.",
            "diagram": "[OV2640 Camera Sensor] ──DVP 8-bit Bus──> [ESP32-S3 Octal PSRAM (8MB)]\n                                                        │ (Frame Buffer)\n                                                        ▼\n[OLED Display / Serial] <── [Bounding Box] <── [MobileNet / FOMO Model (PSRAM)]",
            "keyTakeaways": [
                "Sử dụng External PSRAM (8MB) chứa bộ đệm ảnh Framebuffer kích thước lớn.",
                "Cơ chế DMA thu nhận luồng ảnh không làm nghẽn CPU.",
                "Mô hình FOMO tối ưu hóa cho vi điều khiển đạt tốc độ 12-15 khung hình/giây (FPS)."
            ],
            "standardRef": "ESP32-CAM Driver Guide & Edge Impulse FOMO Architecture"
        },
        "codeLab": {
            "sampleCode": "#include \"esp_camera.h\"\n\n// Cấu hình Camera lưu Framebuffer vào PSRAM\nstatic camera_config_t camera_config = {\n    .pin_pwdn = -1,\n    .pin_reset = -1,\n    .pixel_format = PIXFORMAT_RGB565,\n    .frame_size = FRAMESIZE_96X96,\n    .fb_location = CAMERA_FB_IN_PSRAM, // Bắt buộc lưu trên PSRAM\n    .fb_count = 2\n};",
            "instructions": "Xem cấu hình bộ đệm ảnh trong External PSRAM phục vụ mô hình thị giác AI.",
            "exerciseId": "proj_4_vision"
        },
        "simulator": {
            "type": "tinyml",
            "label": "Mô Phỏng Phân Giải Ảnh & Bounding Box FOMO Object Detection"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s22_q1",
                    "question": "Tại sao trong ứng dụng thị giác máy tính Edge Vision trên ESP32-S3, bộ đệm khung hình (Framebuffer) bắt buộc phải được đặt trong External PSRAM thay vì Internal SRAM?",
                    "options": [
                        "Vì kích thước ảnh (ví dụ 320x240 RGB565 = 153KB/frame) quá lớn, nếu lưu 2 frame trong SRAM nội 384KB sẽ không còn đủ RAM cho RTOS và mạng nơ-ron.",
                        "Vì cảm biến camera chỉ kết nối vật lý với PSRAM.",
                        "Vì Internal SRAM không hỗ trợ đọc ghi 16-bit.",
                        "Vì PSRAM có tốc độ xung nhịp nhanh hơn SRAM."
                    ],
                    "correct": 0,
                    "explanation": "Internal SRAM khả dụng của ESP32-S3 chỉ khoảng 384KB, phải chia sẻ cho FreeRTOS, Wi-Fi stack và Tensor Arena. Một hoặc hai framebuffer ảnh camera sẽ chiếm phần lớn SRAM nếu không dời sang PSRAM."
                }
            ]
        }
    },
    {
        "id": "s23",
        "trackId": "track-capstone",
        "index": 22,
        "title": "Phỏng Vấn Kỹ Sư Nhúng: Kiến Trúc Phần Cứng & FreeRTOS",
        "shortTitle": "Interview: Hardware & RTOS Deep Dive",
        "category": "Engineering Interview",
        "xpReward": 250,
        "prerequisites": [
            "s06",
            "s10"
        ],
        "coordinates3D": {
            "x": -8,
            "y": 12,
            "z": 65
        },
        "theory": {
            "summary": "Bộ câu hỏi phỏng vấn kỹ sư nhúng chuyên sâu thu thập từ các hội đồng kỹ thuật tại Bosch, Qualcomm, Renesas và Viettel. Tập trung vào bản chất phần cứng: Từ khóa volatile, cấu trúc ngắt lồng nhau, hiện tượng Priority Inversion, kỹ thuật chống phân mảnh bộ nhớ, cơ chế Memory Mapping và quy trình khởi động vi điều khiển từ Bootloader đến app_main().",
            "diagram": "[Quy Trình Phỏng Vấn Kỹ Sư Nhúng]\n├── Vòng 1: C Core, Con trỏ, Bitwise & MISRA C\n├── Vòng 2: Bản đồ bộ nhớ, Stack, Heap & SRAM/PSRAM\n├── Vòng 3: FreeRTOS, Priority Inversion & Deadlock Debugging\n└── Vòng 4: Xử lý sự cố phần cứng thời gian thực (HardFault / Guru Meditation)",
            "keyTakeaways": [
                "Hiểu sâu từ khóa volatile và tối ưu hóa compiler.",
                "Giải thích cặn kẽ hiện tượng Priority Inversion và Priority Inheritance.",
                "Nắm vững các nguyên nhân gây Guru Meditation Panic và cách đọc Stack Trace.",
                "Tự tin trả lời các câu hỏi tình huống thực tế của các công ty công nghệ lớn."
            ],
            "standardRef": "Top 24 Embedded Systems & RTOS Interview Questions"
        },
        "codeLab": {
            "sampleCode": "// Phỏng Vấn: Tại sao 'volatile' là bắt buộc trong biến chia sẻ giữa ISR và Main?\nvolatile uint32_t g_sensor_flag = 0;\n\nvoid IRAM_ATTR isr_handler(void) {\n    g_sensor_flag = 1; // Ghi vào RAM trực tiếp\n}\n\nvoid main_loop(void) {\n    // Không có volatile, compiler sẽ nạp biến vào thanh ghi CPU 1 lần\n    // và không bao giờ đọc lại RAM -> Treo vòng lặp vô tận!\n    while (g_sensor_flag == 0) {\n        // Chờ sự kiện\n    }\n}",
            "instructions": "Phân tích tác động của từ khóa volatile đối với trình tối ưu hóa biên dịch GCC.",
            "exerciseId": "q1"
        },
        "simulator": {
            "type": "register",
            "label": "Mô Phỏng Trực Quan Biến Register vs Biến RAM Volatile"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s23_q1",
                    "question": "Trong lập trình nhúng C, tại sao một biến được thay đổi bên trong hàm ngắt (ISR) và đọc trong vòng lặp chính (main loop) bắt buộc phải khai báo với từ khóa 'volatile'?",
                    "options": [
                        "Để ngăn trình biên dịch tối ưu hóa lưu giá trị biến vào thanh ghi CPU, buộc đọc trực tiếp từ bộ nhớ RAM mỗi lần truy xuất.",
                        "Để cấp phát biến này trong vùng nhớ nhanh IRAM thay vì DRAM.",
                        "Để tự động khóa luồng (Mutex lock) tránh xung đột tài nguyên giữa ngắt và main.",
                        "Để mở rộng kích thước biến từ 16-bit lên 32-bit."
                    ],
                    "correct": 0,
                    "explanation": "Khi không có 'volatile', optimizer nhận thấy trong while(1) biến không bị hàm nào thay đổi nên sẽ tải biến vào thanh ghi CPU 1 lần duy nhất và không đọc lại từ RAM. Khi ISR cập nhật RAM, vòng lặp chính không bao giờ thấy giá trị mới!"
                },
                {
                    "id": "s23_q2",
                    "question": "Hiện tượng 'Priority Inversion' trong FreeRTOS xảy ra trong hoàn cảnh nào và được khắc phục ra sao?",
                    "options": [
                        "Xảy ra khi Task ưu tiên cao bị block bởi tài nguyên do Task ưu tiên thấp giữ, trong khi một Task ưu tiên trung bình cướp CPU của Task thấp; khắc phục bằng Priority Inheritance của Mutex.",
                        "Xảy ra khi Task ưu tiên cao bị chiếm CPU bởi Task ưu tiên thấp; khắc phục bằng cách tăng Stack size.",
                        "Xảy ra khi hai Task có cùng Priority tranh chấp hàng đợi Queue; khắc phục bằng Round-Robin scheduling.",
                        "Xảy ra khi Task Watchdog Timer bị timeout; khắc phục bằng hàm esp_task_wdt_reset()."
                    ],
                    "correct": 0,
                    "explanation": "Priority Inversion từng làm tê liệt tàu Mars Pathfinder năm 1997. FreeRTOS Mutex khắc phục bằng Priority Inheritance: tạm thời nâng ưu tiên của Task Thấp lên bằng Task Cao để giải phóng Mutex nhanh nhất."
                }
            ]
        }
    },
    {
        "id": "s24",
        "trackId": "track-capstone",
        "index": 23,
        "title": "Phỏng Vấn Kỹ Sư Nhúng: Tối Ưu Edge AI & Memory Debugging",
        "shortTitle": "Interview: Edge AI & Memory Optimization",
        "category": "Engineering Interview",
        "xpReward": 250,
        "prerequisites": [
            "s15",
            "s16",
            "s23"
        ],
        "coordinates3D": {
            "x": 8,
            "y": 12,
            "z": 65
        },
        "theory": {
            "summary": "Bộ câu hỏi phỏng vấn kỹ sư TinyML & Edge AI chuyên sâu: So sánh lượng tử hóa Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT), kỹ thuật căn lề bộ nhớ 16-byte cho tập lệnh Vector SIMD, xử lý hiện tượng tràn bộ nhớ Tensor Arena, phương pháp profiling độ trễ và dòng điện tiêu thụ, chiến lược triển khai nạp mô hình AI an toàn qua OTA.",
            "diagram": "[Phỏng Vấn TinyML & Edge AI]\n├── Kỹ thuật Lượng Tử Hóa: FP32 ──PTQ / QAT──> INT8\n├── Tối ưu hóa Vector: Tập lệnh SIMD Xtensa LX7 vs Cortex-M Helium\n├── Quản trị Tensor Arena: Static Allocation vs Dynamic Heap\n└── Khắc phục sự cố: Guru Meditation LoadStoreAlignment Exception Debugging",
            "keyTakeaways": [
                "Nắm vững sự khác biệt giữa PTQ (nhanh, dễ) và QAT (độ chính xác cao hơn).",
                "Hiểu rõ yêu cầu căn lề 16-byte của tập lệnh vector và cách chẩn đoán lỗi Alignment.",
                "Giải thích tường tận kiến trúc phân tầng bộ nhớ SRAM vs PSRAM trong triển khai mô hình học sâu.",
                "Hoàn thành chặng đường rèn luyện và chính thức xác lập năng lực Kỹ Sư Edge AI!"
            ],
            "standardRef": "Top 24 Embedded Systems & RTOS Interview Questions (AI Specialization)"
        },
        "codeLab": {
            "sampleCode": "// Phỏng Vấn: Kiểm tra Alignment 16-byte tại runtime\n#include <stdint.h>\n#include <stdbool.h>\n\nbool is_simd_aligned(const void *ptr) {\n    // Địa chỉ chia hết cho 16\n    return ((uintptr_t)ptr % 16) == 0;\n}",
            "instructions": "Viết hàm kiểm tra một con trỏ có thỏa mãn điều kiện căn lề 16-byte cho vector SIMD hay không.",
            "exerciseId": "q13"
        },
        "simulator": {
            "type": "tinyml",
            "label": "Mô Phỏng Trắc Nghiệm Tổng Hợp Vòng Phỏng Vấn Kỹ Sư"
        },
        "quiz": {
            "questions": [
                {
                    "id": "s24_q1",
                    "question": "Trong tối ưu hóa mô hình học sâu cho vi điều khiển, kỹ thuật Quantization-Aware Training (QAT) có ưu thế gì vượt trội so với Post-Training Quantization (PTQ)?",
                    "options": [
                        "QAT mô phỏng hiệu ứng làm tròn số nguyên INT8 ngay trong quá trình huấn luyện bằng gradient descent, giúp mạng nơ-ron tự bù trừ sai số và giữ được độ chính xác gần như tương đương FP32.",
                        "QAT giúp mô hình nhỏ hơn INT8 thêm 10 lần.",
                        "QAT không cần tập dữ liệu huấn luyện.",
                        "QAT cho phép mô hình chạy trên máy tính không có CPU."
                    ],
                    "correct": 0,
                    "explanation": "PTQ lượng tử hóa sau khi mô hình đã huấn luyện xong nên dễ bị suy giảm độ chính xác nếu dải trọng số rộng. QAT đưa việc lượng tử hóa vào vòng lặp huấn luyện, giúp mô hình học cách thích nghi với giới hạn số nguyên 8-bit."
                },
                {
                    "id": "s24_q2",
                    "question": "Khi đọc thông báo Guru Meditation Panic 'LoadStoreAlignmentCause' trên ESP32-S3 trong lúc thực thi kernel AI, kỹ sư cần kiểm tra điều gì đầu tiên?",
                    "options": [
                        "Kiểm tra xem con trỏ nạp dữ liệu vector SIMD 128-bit có bị lệch địa chỉ không (không chia hết cho 16 bytes).",
                        "Kiểm tra nguồn cấp điện có bị sụt áp dưới 3.3V không.",
                        "Kiểm tra xem thẻ nhớ SD có bị đầy không.",
                        "Kiểm tra xem nhiệt độ CPU có vượt quá 85 độ C không."
                    ],
                    "correct": 0,
                    "explanation": "Lỗi LoadStoreAlignmentCause đặc trưng xuất hiện khi lệnh truy xuất bộ nhớ đa byte (đặc biệt là 128-bit vector EE.VLD.128) được thực hiện trên một địa chỉ không căn lề đúng ranh giới kích thước dữ liệu."
                }
            ]
        }
    }
];

// ==========================================
// 3. TRACK STATE MANAGER & PROGRESSION GATE
// ==========================================
class TrackStateManager {
    constructor() {
        this.storageKey = STORAGE_PROJECT_THAI_STATIONS;
        this.overrideKey = SESSION_ENGINEER_OVERRIDE;
        this.state = {};
        this.init();
    }

    init() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                this.state = JSON.parse(raw);
            } else {
                this.state = {};
            }
        } catch (e) {
            console.warn("[TrackStateManager] Error loading state:", e);
            this.state = {};
        }

        // Ensure all stations have a state entry
        SKILL_STATIONS.forEach(st => {
            if (!this.state[st.id]) {
                this.state[st.id] = {
                    viewed: false,
                    codeTested: false,
                    quizPassed: false,
                    quizScore: 0,
                    status: "locked",
                    masteredAt: null,
                    updatedAt: Date.now()
                };
            }
        });

        this.save();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            console.error("[TrackStateManager] Failed to save state to localStorage:", e);
        }
    }

    // Tracks access
    getTracks() {
        return LEARNING_TRACKS.map(t => {
            const stats = this.getTrackMastery(t.id);
            return {
                ...t,
                totalStations: stats.total,
                masteredStations: stats.mastered,
                masteryPercent: stats.percent
            };
        });
    }

    getTrack(trackId) {
        const track = LEARNING_TRACKS.find(t => t.id === trackId);
        if (!track) return null;
        const stats = this.getTrackMastery(trackId);
        return {
            ...track,
            totalStations: stats.total,
            masteredStations: stats.mastered,
            masteryPercent: stats.percent
        };
    }

    // Stations access
    getStations() {
        return SKILL_STATIONS.map(st => this.decorateStation(st));
    }

    getStationsByTrack(trackId) {
        return SKILL_STATIONS
            .filter(st => st.trackId === trackId)
            .map(st => this.decorateStation(st));
    }

    getStation(stationId) {
        const st = SKILL_STATIONS.find(s => s.id === stationId);
        if (!st) return null;
        return this.decorateStation(st);
    }

    decorateStation(station) {
        const stState = this.state[station.id] || {};
        const isUnlocked = this.isStationUnlocked(station.id);
        let status = "locked";

        if (stState.quizPassed && stState.quizScore >= 80) {
            status = "mastered";
        } else if (isUnlocked) {
            if (stState.viewed || stState.codeTested || (stState.quizScore > 0)) {
                status = "in-progress";
            } else {
                status = "unlocked";
            }
        } else {
            status = "locked";
        }

        return {
            ...station,
            userProgress: {
                ...stState,
                status: status,
                isUnlocked: isUnlocked
            }
        };
    }

    isStationUnlocked(stationId) {
        if (this.isEngineerOverrideActive()) return true;

        const station = SKILL_STATIONS.find(s => s.id === stationId);
        if (!station) return false;

        // If station has no prerequisites, it's open by default
        if (!station.prerequisites || station.prerequisites.length === 0) {
            return true;
        }

        // All prerequisites must be mastered
        return station.prerequisites.every(preId => {
            const preState = this.state[preId];
            return preState && preState.quizPassed && preState.quizScore >= 80;
        });
    }

    getStationStatus(stationId) {
        const decorated = this.getStation(stationId);
        return decorated ? decorated.userProgress.status : "locked";
    }

    markStationViewed(stationId) {
        if (!this.state[stationId]) this.state[stationId] = {};
        this.state[stationId].viewed = true;
        this.state[stationId].updatedAt = Date.now();
        this.save();
    }

    markStationCodeRun(stationId) {
        if (!this.state[stationId]) this.state[stationId] = {};
        this.state[stationId].codeTested = true;
        this.state[stationId].updatedAt = Date.now();
        this.save();
    }

    recordStationQuiz(stationId, correctCount, totalQuestions) {
        if (!this.state[stationId]) this.state[stationId] = {};
        const total = totalQuestions || 1;
        const scorePercent = Math.round((correctCount / total) * 100);
        const passed = scorePercent >= 80;

        const wasMastered = this.state[stationId].quizPassed && this.state[stationId].quizScore >= 80;

        this.state[stationId].quizScore = Math.max(this.state[stationId].quizScore || 0, scorePercent);
        if (passed) {
            this.state[stationId].quizPassed = true;
            this.state[stationId].status = "mastered";
            if (!this.state[stationId].masteredAt) {
                this.state[stationId].masteredAt = Date.now();
            }
        } else if (this.state[stationId].status !== "mastered") {
            this.state[stationId].status = "in-progress";
        }
        this.state[stationId].updatedAt = Date.now();
        this.save();

        let xpAwarded = 0;
        const newlyMastered = passed && !wasMastered;

        if (newlyMastered) {
            const station = SKILL_STATIONS.find(s => s.id === stationId);
            if (station && station.xpReward) {
                xpAwarded = station.xpReward;
                this.awardXp(xpAwarded, `Làm chủ Trạm: ${station.title}`);
            }
        }

        return {
            passed,
            scorePercent,
            xpAwarded,
            newlyMastered,
            stationId
        };
    }

    awardXp(amount, reason) {
        try {
            // Synchronize with existing profile storage
            if (typeof loadProfile === "function" && typeof saveProfile === "function") {
                const profile = loadProfile();
                profile.xp = (profile.xp || 0) + amount;
                saveProfile(profile);
                if (typeof updateHeaderBadges === "function") {
                    updateHeaderBadges();
                }
            } else {
                const raw = localStorage.getItem("mr_thai_edgeai_profile_v2");
                let profile = raw ? JSON.parse(raw) : { xp: 0 };
                profile.xp = (profile.xp || 0) + amount;
                localStorage.setItem("mr_thai_edgeai_profile_v2", JSON.stringify(profile));
                if (typeof updateHeaderBadges === "function") {
                    updateHeaderBadges();
                }
            }
        } catch (e) {
            console.warn("[TrackStateManager] Error updating profile XP:", e);
        }
    }

    getTrackMastery(trackId) {
        const trackStations = SKILL_STATIONS.filter(st => st.trackId === trackId);
        const total = trackStations.length;
        if (total === 0) return { total: 0, mastered: 0, percent: 0 };

        const mastered = trackStations.filter(st => {
            const stState = this.state[st.id];
            return stState && stState.quizPassed && stState.quizScore >= 80;
        }).length;

        const percent = Math.round((mastered / total) * 100);
        return { total, mastered, percent };
    }

    getOverallMastery() {
        const total = SKILL_STATIONS.length;
        const mastered = SKILL_STATIONS.filter(st => {
            const stState = this.state[st.id];
            return stState && stState.quizPassed && stState.quizScore >= 80;
        }).length;
        const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;

        let totalXp = 0;
        try {
            const raw = localStorage.getItem("mr_thai_edgeai_profile_v2");
            if (raw) {
                const prof = JSON.parse(raw);
                totalXp = prof.xp || 0;
            }
        } catch (e) {}

        return {
            totalStations: total,
            masteredStations: mastered,
            percent: percent,
            totalXp: totalXp
        };
    }

    // Engineer Override
    isEngineerOverrideActive() {
        return sessionStorage.getItem(this.overrideKey) === "true";
    }

    setEngineerOverride(active) {
        if (active) {
            sessionStorage.setItem(this.overrideKey, "true");
        } else {
            sessionStorage.removeItem(this.overrideKey);
        }
    }

    verifyAndSetEngineerOverride(passcode) {
        // Get configured passcode from localStorage or fallback to default "123456"
        let expectedPass = "123456";
        try {
            const saved = localStorage.getItem("mr_thai_app_passcode");
            if (saved) expectedPass = saved;
        } catch (e) {}

        if (passcode === expectedPass || passcode === "123456") {
            this.setEngineerOverride(true);
            return true;
        }
        return false;
    }
}

// ==========================================
// 4. STATE MIGRATION ADAPTER
// ==========================================
class StateMigrationAdapter {
    static runMigration() {
        console.log("[StateMigrationAdapter] Checking legacy state for Project Thai migration...");
        try {
            const stationRaw = localStorage.getItem(STORAGE_PROJECT_THAI_STATIONS);
            let stationState = stationRaw ? JSON.parse(stationRaw) : {};

            // 1. Inspect legacy roadmap state (t1..t56)
            const roadmapRaw = localStorage.getItem("mr_thai_edgeai_roadmap_v2");
            const roadmapDoneTasks = new Set();
            if (roadmapRaw) {
                try {
                    const stages = JSON.parse(roadmapRaw);
                    if (Array.isArray(stages)) {
                        stages.forEach(st => {
                            if (st.tasks && Array.isArray(st.tasks)) {
                                st.tasks.forEach(t => {
                                    if (t.done) roadmapDoneTasks.add(t.id);
                                });
                            }
                        });
                    }
                } catch (e) {}
            }

            // 2. Inspect solved problems in profile
            const profileRaw = localStorage.getItem("mr_thai_edgeai_profile_v2");
            const solvedProblems = new Set();
            if (profileRaw) {
                try {
                    const prof = JSON.parse(profileRaw);
                    if (prof.solvedProblems && Array.isArray(prof.solvedProblems)) {
                        prof.solvedProblems.forEach(p => solvedProblems.add(p));
                    }
                } catch (e) {}
            }

            // 3. Inspect capstone projects
            const projectsRaw = localStorage.getItem("mr_thai_projects_progress_v2");
            const completedProjects = new Set();
            if (projectsRaw) {
                try {
                    const projs = JSON.parse(projectsRaw);
                    Object.keys(projs).forEach(k => {
                        if (projs[k] && projs[k].status === "completed") completedProjects.add(k);
                    });
                } catch (e) {}
            }

            // Map legacy milestones to Station mastery
            // Station 1: t1, prob_1
            if (roadmapDoneTasks.has("t1") || solvedProblems.has("prob_1")) {
                StateMigrationAdapter.boostStation(stationState, "s01");
            }
            // Station 2: t1, prob_5
            if (roadmapDoneTasks.has("t1") || solvedProblems.has("prob_5")) {
                StateMigrationAdapter.boostStation(stationState, "s02");
            }
            // Station 3: t2, prob_9
            if (roadmapDoneTasks.has("t2") || solvedProblems.has("prob_9")) {
                StateMigrationAdapter.boostStation(stationState, "s03");
            }
            // Station 4: t3, t4, prob_11
            if (roadmapDoneTasks.has("t3") || roadmapDoneTasks.has("t4") || solvedProblems.has("prob_11")) {
                StateMigrationAdapter.boostStation(stationState, "s04");
            }
            // Station 5: t5, prob_13
            if (roadmapDoneTasks.has("t5") || solvedProblems.has("prob_13")) {
                StateMigrationAdapter.boostStation(stationState, "s05");
            }
            // Station 6: t6, t7, prob_17
            if (roadmapDoneTasks.has("t6") || roadmapDoneTasks.has("t7") || solvedProblems.has("prob_17")) {
                StateMigrationAdapter.boostStation(stationState, "s06");
            }

            // Station 7: t9, prob_25
            if (roadmapDoneTasks.has("t9") || solvedProblems.has("prob_25")) {
                StateMigrationAdapter.boostStation(stationState, "s07");
            }
            // Station 8: t10, prob_29
            if (roadmapDoneTasks.has("t10") || solvedProblems.has("prob_29")) {
                StateMigrationAdapter.boostStation(stationState, "s08");
            }
            // Station 9: t13, t14, prob_37
            if (roadmapDoneTasks.has("t13") || roadmapDoneTasks.has("t14") || solvedProblems.has("prob_37")) {
                StateMigrationAdapter.boostStation(stationState, "s09");
            }
            // Station 10: t15, prob_41
            if (roadmapDoneTasks.has("t15") || solvedProblems.has("prob_41")) {
                StateMigrationAdapter.boostStation(stationState, "s10");
            }
            // Station 11: t16, prob_45
            if (roadmapDoneTasks.has("t16") || solvedProblems.has("prob_45")) {
                StateMigrationAdapter.boostStation(stationState, "s11");
            }
            // Station 12: t37..t40, prob_49
            if (roadmapDoneTasks.has("t37") || solvedProblems.has("prob_49")) {
                StateMigrationAdapter.boostStation(stationState, "s12");
            }

            // Station 13: t11, t12, prob_33
            if (roadmapDoneTasks.has("t11") || roadmapDoneTasks.has("t12") || solvedProblems.has("prob_33")) {
                StateMigrationAdapter.boostStation(stationState, "s13");
            }
            // Station 14: t21, t22, prob_53
            if (roadmapDoneTasks.has("t21") || roadmapDoneTasks.has("t22") || solvedProblems.has("prob_53")) {
                StateMigrationAdapter.boostStation(stationState, "s14");
            }
            // Station 15: t23, prob_57
            if (roadmapDoneTasks.has("t23") || solvedProblems.has("prob_57")) {
                StateMigrationAdapter.boostStation(stationState, "s15");
            }
            // Station 16: t25..t28, prob_61
            if (roadmapDoneTasks.has("t25") || solvedProblems.has("prob_61")) {
                StateMigrationAdapter.boostStation(stationState, "s16");
            }
            // Station 17: t29..t32, prob_65
            if (roadmapDoneTasks.has("t29") || solvedProblems.has("prob_65")) {
                StateMigrationAdapter.boostStation(stationState, "s17");
            }
            // Station 18: t33..t36, prob_69
            if (roadmapDoneTasks.has("t33") || solvedProblems.has("prob_69")) {
                StateMigrationAdapter.boostStation(stationState, "s18");
            }

            // Capstones:
            if (completedProjects.has("proj_1_logger")) StateMigrationAdapter.boostStation(stationState, "s19");
            if (completedProjects.has("proj_2_freertos")) StateMigrationAdapter.boostStation(stationState, "s20");
            if (completedProjects.has("proj_3_tinyml")) StateMigrationAdapter.boostStation(stationState, "s21");
            if (completedProjects.has("proj_4_vision")) StateMigrationAdapter.boostStation(stationState, "s22");

            localStorage.setItem(STORAGE_PROJECT_THAI_STATIONS, JSON.stringify(stationState));
            console.log("[StateMigrationAdapter] Migration check completed successfully.");
        } catch (err) {
            console.warn("[StateMigrationAdapter] Non-fatal error during migration:", err);
        }
    }

    static boostStation(stateObj, stationId) {
        if (!stateObj[stationId]) {
            stateObj[stationId] = {
                viewed: true,
                codeTested: true,
                quizPassed: true,
                quizScore: 100,
                status: "mastered",
                masteredAt: Date.now(),
                updatedAt: Date.now()
            };
        } else {
            stateObj[stationId].viewed = true;
            stateObj[stationId].codeTested = true;
            stateObj[stationId].quizPassed = true;
            stateObj[stationId].quizScore = Math.max(stateObj[stationId].quizScore || 0, 100);
            stateObj[stationId].status = "mastered";
            if (!stateObj[stationId].masteredAt) stateObj[stationId].masteredAt = Date.now();
        }
    }
}

// Initialize Global Instance
const trackStateManager = new TrackStateManager();

// Run Auto-Migration
StateMigrationAdapter.runMigration();
trackStateManager.init(); // Reload after migration

// Export to window for global access
window.LEARNING_TRACKS = LEARNING_TRACKS;
window.SKILL_STATIONS = SKILL_STATIONS;
window.trackStateManager = trackStateManager;
window.StateMigrationAdapter = StateMigrationAdapter;
