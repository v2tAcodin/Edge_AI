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
            {
                stage: "Bước 1: C & Quản Lý Bộ Nhớ",
                domain: "C Core, Pointers & Memory Architecture",
                icon: "🧠",
                tasks: [
                    { 
                        id: "t1", 
                        title: "Thao tác con trỏ (Pointers), mảng động và Struct đóng gói dữ liệu", 
                        skill: "Pointers & Dynamic Memory Layout",
                        done: false 
                    },
                    { 
                        id: "t2", 
                        title: "Phân biệt Memory Map: Flash, Internal SRAM, RTC SRAM và External PSRAM", 
                        skill: "Memory Mapping (SRAM/Flash/PSRAM)",
                        done: false 
                    },
                    { 
                        id: "t3", 
                        title: "Quản lý Stack vs Heap, chống phân mảnh bộ nhớ và Memory Leak", 
                        skill: "Heap Management & Anti-Fragmentation",
                        done: false 
                    },
                    { 
                        id: "t4", 
                        title: "Kỹ thuật cấp phát bộ nhớ tĩnh (Static Allocation) chuẩn bị Tensor Arena", 
                        skill: "Static Tensor Arena Allocation",
                        done: false 
                    }
                ]
            },
            {
                stage: "Bước 2: Timer & Xử Lý Ngắt (Interrupt)",
                domain: "Hardware Timers, Precision & ISR",
                icon: "⏱️",
                tasks: [
                    { 
                        id: "t5", 
                        title: "Cấu hình GPTimer định thời chính xác micro-giây cho lấy mẫu chu kỳ", 
                        skill: "Microsecond Hardware GPTimer",
                        done: false 
                    },
                    { 
                        id: "t6", 
                        title: "Lập trình hàm ngắt ISR với cờ IRAM_ATTR thực thi trực tiếp trên SRAM", 
                        skill: "High-Speed IRAM_ATTR Interrupts",
                        done: false 
                    },
                    { 
                        id: "t7", 
                        title: "Cơ chế Deferred Processing: Đẩy việc từ ISR sang Task qua Semaphore", 
                        skill: "Deferred ISR to Task Processing",
                        done: false 
                    },
                    { 
                        id: "t8", 
                        title: "Ứng dụng Timer định nhịp tần số lấy mẫu chuẩn (16kHz Audio / 100Hz IMU)", 
                        skill: "Deterministic Sensor Sampling Rate",
                        done: false 
                    }
                ]
            },
            {
                stage: "Bước 3: Cảm Biến & Thu Thập Dữ Liệu",
                domain: "Sensors, Signal Acquisition & Preprocessing",
                icon: "📡",
                tasks: [
                    { 
                        id: "t9", 
                        title: "Giao tiếp I2C/SPI đọc dữ liệu thô cảm biến chuyển động 6 trục (IMU MPU6050)", 
                        skill: "I2C/SPI 6-Axis IMU Driver",
                        done: false 
                    },
                    { 
                        id: "t10", 
                        title: "Thu âm thanh kỹ thuật số băng thông cao qua chuẩn giao tiếp I2S Microphone", 
                        skill: "I2S Digital Microphone Streaming",
                        done: false 
                    },
                    { 
                        id: "t11", 
                        title: "Tiền xử lý tín hiệu: Bộ lọc nhiễu số (Moving Average, Low-pass Filter)", 
                        skill: "Digital Signal Noise Filtering",
                        done: false 
                    },
                    { 
                        id: "t12", 
                        title: "Trích xuất đặc trưng (Feature Extraction): Chuẩn hóa dữ liệu & Biến đổi FFT", 
                        skill: "Normalization & FFT Feature Extraction",
                        done: false 
                    }
                ]
            },
            {
                stage: "Bước 4: Multiple Task (Đa Nhiệm FreeRTOS)",
                domain: "FreeRTOS Dual-Core & Task Synchronization",
                icon: "⚡",
                tasks: [
                    { 
                        id: "t13", 
                        title: "Phân chia 2 nhân ESP32 với xTaskCreatePinnedToCore (Core 0: IO, Core 1: AI)", 
                        skill: "Dual-Core Asymmetric Task Pinning",
                        done: false 
                    },
                    { 
                        id: "t14", 
                        title: "Truyền dữ liệu cảm biến sang tác vụ suy luận qua FreeRTOS Queue đệm an toàn", 
                        skill: "Thread-Safe FreeRTOS Data Queues",
                        done: false 
                    },
                    { 
                        id: "t15", 
                        title: "Tránh xung đột tài nguyên chung (Race Condition) bằng Mutex & Semaphore", 
                        skill: "Mutex & Resource Locking",
                        done: false 
                    },
                    { 
                        id: "t16", 
                        title: "Cơ chế giám sát Task Watchdog (TWDT) chống treo CPU khi mô hình suy luận", 
                        skill: "Task Watchdog Timer (TWDT)",
                        done: false 
                    }
                ]
            },
            {
                stage: "Bước 5: Network & Nâng Cấp OTA",
                domain: "Wireless Telemetry & Over-The-Air Update",
                icon: "🌐",
                tasks: [
                    { 
                        id: "t17", 
                        title: "Cấu hình kết nối Wi-Fi Station & Quản lý mất mạng tự động kết nối lại", 
                        skill: "Robust Wi-Fi Auto-Reconnection",
                        done: false 
                    },
                    { 
                        id: "t18", 
                        title: "Truyền phát gói tin cảnh báo / kết quả suy luận qua giao thức MQTT siêu nhẹ", 
                        skill: "Lightweight MQTT IoT Telemetry",
                        done: false 
                    },
                    { 
                        id: "t19", 
                        title: "Thiết lập phân vùng Flash ESP32 (Partition Table: ota_0, ota_1, nvs)", 
                        skill: "Dual OTA Partition Table Design",
                        done: false 
                    },
                    { 
                        id: "t20", 
                        title: "Nâng cấp Firmware & Cập nhật trọng số Model AI từ xa qua Wi-Fi OTA an toàn", 
                        skill: "Over-The-Air (OTA) Model Updating",
                        done: false 
                    }
                ]
            },
            {
                stage: "Bước 6: Mô Hình AI Trên Edge (TinyML)",
                domain: "TinyML, TFLite Micro & Model Optimization",
                icon: "🤖",
                tasks: [
                    { 
                        id: "t21", 
                        title: "Lượng tử hóa mô hình Deep Learning (INT8 Post-Training Quantization)", 
                        skill: "INT8 Model Quantization",
                        done: false 
                    },
                    { 
                        id: "t22", 
                        title: "Tích hợp thư viện TensorFlow Lite for Microcontrollers (TFLite Micro) / ESP-DL", 
                        skill: "TFLite Micro & ESP-DL Integration",
                        done: false 
                    },
                    { 
                        id: "t23", 
                        title: "Khởi tạo Tensor Arena, nạp model flatbuffer và gọi invoke() suy luận", 
                        skill: "Model Invocation & Tensor Management",
                        done: false 
                    },
                    { 
                        id: "t24", 
                        title: "Dự án hoàn chỉnh: Nhận diện từ khóa giọng nói (KWS) hoặc phân loại rung động", 
                        skill: "Complete Edge AI Production Project",
                        done: false 
                    }
                ]
            }
        ];

// ==========================================
// 2. CHUYÊN SÂU LÝ THUYẾT & TÀI LIỆU LỘ TRÌNH (ROADMAP THEORY ENCYCLOPEDIA)
// ==========================================
const ROADMAP_STAGE_THEORY = [
    {
        stageIndex: 0,
        title: "Bước 1: C Core, Con Trỏ & Quản Lý Bộ Nhớ ESP32-S3",
        summary: "Nền tảng sống còn của kỹ sư nhúng: Làm chủ con trỏ, hiểu sâu bản đồ bộ nhớ (Memory Map) của vi điều khiển ESP32, căn lề 16-byte bắt buộc cho tập lệnh vector SIMD của TinyML và kỹ thuật cấp phát tĩnh chống phân mảnh SRAM.",
        highlights: [
            "Internal SRAM0/1: Bộ nhớ tốc độ cao nhất (1 chu kỳ xung nhịp ~240MHz). Là nơi duy nhất lý tưởng đặt Tensor Arena để đạt độ trễ suy luận mili-giây.",
            "External PSRAM: Bộ nhớ ngoài giao tiếp qua Octal SPI (80-120MHz), chậm hơn SRAM nội ~3-4 lần. Thích hợp lưu buffer camera hoặc trọng số mô hình lớn.",
            "Căn lề bắt buộc alignas(16): Tập lệnh mở rộng SIMD của ESP32-S3 yêu cầu nạp đồng thời 128-bit dữ liệu. Nếu không căn lề 16-byte, CPU sẽ phát sinh lỗi phần cứng LoadStoreAlignment Crash."
        ],
        codeSnippet: `// Khởi tạo Tensor Arena trong SRAM với căn lề 16-byte chuẩn SIMD:\nconstexpr int kTensorArenaSize = 64 * 1024; // 64 KB\nalignas(16) static uint8_t tensor_arena[kTensorArenaSize];`,
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
];

// Từ điển lý thuyết chi tiết cho từng nhiệm vụ (Task Theory Dictionary)
const ROADMAP_TASK_THEORY = {
    "t1": {
        title: "Thao tác con trỏ (Pointers), mảng động và Struct đóng gói dữ liệu",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Pointers & Dynamic Memory Layout",
        content: `Con trỏ là công cụ nền tảng của lập trình nhúng. Khi xử lý dữ liệu lớn như mảng âm thanh 16kHz hoặc ma trận ảnh 96x96, việc truyền tham trị (pass-by-value) sẽ sao chép toàn bộ mảng lên Stack gây tràn bộ nhớ Stack Overflow ngay lập tức.
        
        Kỹ sư bắt buộc phải truyền con trỏ (Zero-copy pass-by-reference). Đồng thời, sử dụng từ khóa \`__attribute__((packed))\` trên struct để ngăn chặn trình biên dịch tự ý chèn padding bytes, đảm bảo dữ liệu thô đọc từ cảm biến khớp 100% từng byte với bộ nhớ struct.`,
        code: `typedef struct __attribute__((packed)) {\n    uint32_t timestamp;\n    int16_t accel_x;\n    int16_t accel_y;\n    int16_t accel_z;\n} IMU_Frame_t;\n\n// Truyền con trỏ hằng (Zero-copy, an toàn dữ liệu):\nvoid process_frame(const IMU_Frame_t *frame) {\n    printf("Time: %lu, X: %d\\n", frame->timestamp, frame->accel_x);\n}`
    },
    "t2": {
        title: "Phân biệt Memory Map: Flash, Internal SRAM, RTC SRAM và External PSRAM",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Memory Mapping (SRAM/Flash/PSRAM)",
        content: `ESP32-S3 sử dụng không gian địa chỉ thống nhất chia thành 4 phân vùng chính:
        1. **Flash (SPI ROM)**: Chứa firmware và trọng số mô hình tĩnh. Tốc độ đọc qua SPI Cache.
        2. **Internal SRAM (512 KB)**: Tốc độ 1 chu kỳ CPU (nhanh nhất). Bắt buộc đặt Tensor Arena của TFLite Micro ở đây.
        3. **RTC Fast/Slow SRAM (16 KB)**: Vùng nhớ duy nhất giữ được trạng thái khi vi điều khiển vào chế độ Deep Sleep tiết kiệm pin.
        4. **External PSRAM (Tối đa 8MB)**: Mở rộng dung lượng cho frame buffer camera nhưng tốc độ chậm hơn SRAM 3-4 lần.`,
        code: `// Cấp phát trong Internal SRAM tốc độ cao:\nvoid *sram_ptr = heap_caps_malloc(32 * 1024, MALLOC_CAP_INTERNAL);\n// Cấp phát trong PSRAM ngoài:\nvoid *psram_ptr = heap_caps_malloc(1024 * 1024, MALLOC_CAP_SPIRAM);`
    },
    "t3": {
        title: "Quản lý Stack vs Heap, chống phân mảnh bộ nhớ và Memory Leak",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Heap Management & Anti-Fragmentation",
        content: `Khác với ứng dụng PC, vi điều khiển hoạt động liên tục nhiều tháng hoặc nhiều năm mà không được khởi động lại. Nếu gọi \`malloc()\` và \`free()\` liên tục với các kích thước khác nhau, bộ nhớ Heap sẽ bị phân mảnh thành nhiều mảnh nhỏ. Khi cần cấp phát khối Tensor 64KB, hệ thống sẽ báo lỗi OOM (Out Of Memory) dù tổng RAM còn trống vẫn nhiều.
        
        Giải pháp: Cấp phát tĩnh trước toàn bộ vùng đệm hoặc dùng cơ chế Memory Pool với kích thước khối cố định. Luôn kiểm tra hàm \`heap_caps_get_minimum_free_size()\` để theo dõi điểm thấp nhất của bộ nhớ.`,
        code: `// Kiểm tra mức RAM tự do thấp nhất trong lịch sử vận hành:\nsize_t min_free = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);\nESP_LOGI("MEM", "SRAM Watermark: %d bytes còn trống", min_free);`
    },
    "t4": {
        title: "Kỹ thuật cấp phát bộ nhớ tĩnh (Static Allocation) chuẩn bị Tensor Arena",
        stageName: "Bước 1: C & Quản Lý Bộ Nhớ",
        skill: "Static Tensor Arena Allocation",
        content: `Tensor Arena là mảng byte liên tục nơi TensorFlow Lite for Microcontrollers lưu trữ toàn bộ activations trung gian giữa các lớp mạng nơ-ron. 
        
        Để kiến trúc Vector Extension (SIMD) của ESP32-S3 có thể nạp các vector 128-bit chỉ trong 1 chu kỳ máy, mảng này bắt buộc phải được căn lề 16-byte: \`alignas(16)\`. Nếu thiếu căn lề, CPU sẽ phát sinh ngoại lệ LoadStoreAlignment Error gây sụp nguồn (Guru Meditation Error).`,
        code: `constexpr int kTensorArenaSize = 64 * 1024;\nalignas(16) static uint8_t tensor_arena[kTensorArenaSize];\n\n// Truyền Tensor Arena vào interpreter:\ntflite::MicroInterpreter interpreter(model, resolver, tensor_arena, kTensorArenaSize);`
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
};

// Global State
let roadmap = JSON.parse(localStorage.getItem(STORAGE_ROADMAP)) || defaultRoadmap;
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
