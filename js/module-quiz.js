// ==========================================================================
// TRẮC NGHIỆM LÝ THUYẾT THEO MODULE (MODULE THEORY QUIZ ARENA)
// Hệ thống 70 câu hỏi trắc nghiệm chuyên sâu cho 14 Module lộ trình Edge AI
// Tham chiếu 12 cuốn sách kinh điển, Datasheet TRM & Tiêu chuẩn Quốc tế
// ==========================================================================

const STORAGE_MODULE_QUIZ = "mr_thai_module_quiz_results_v1";

const moduleQuizData = [
    // =========================================================================
    // MODULE 1: C CORE & BẢN ĐỒ BỘ NHỚ ESP32-S3
    // =========================================================================
    {
        moduleIndex: 0,
        title: "Module 1: C & Quản Lý Bộ Nhớ",
        stageDomain: "C Core, Pointers & Memory Architecture",
        icon: "🧠",
        bookId: "book_expert_c",
        standardRef: "Expert C Programming (Peter van der Linden) Ch.4 & ESP32-S3 TRM Ch.2",
        badge: "Nền Tảng C Cốt Lõi",
        questions: [
            {
                id: "m1_q1",
                title: "Bản chất khác biệt giữa Mảng và Con trỏ trong C",
                question: "Xét đoạn mã C sau:\n```c\nchar arr[] = \"Hello\";\nchar *ptr = \"Hello\";\n```\nTheo phân tích kinh điển của Peter van der Linden trong *Expert C Programming* (Chương 4), điểm khác biệt bản chất nhất về mặt cơ chế máy học (lvalue, địa chỉ ô nhớ) giữa `arr` và `ptr` là gì?",
                options: [
                    "arr và ptr hoàn toàn tương đương nhau về bộ nhớ, chỉ khác cú pháp khai báo.",
                    "arr là một hằng địa chỉ cố định được linker ấn định vị trí ô nhớ trong RAM/Data; bản thân arr không có ô nhớ riêng để lưu địa chỉ. Ngược lại, ptr là một biến con trỏ độc lập có địa chỉ ô nhớ riêng lưu giá trị là địa chỉ chuỗi.",
                    "ptr chiếm ít bộ nhớ hơn arr vì chuỗi của ptr nằm trong phân vùng BSS.",
                    "arr có thể gán lại địa chỉ mới như arr = ptr, còn ptr thì bị cố định không đổi."
                ],
                correct: 1,
                explanation: "Peter van der Linden đã nhấn mạnh 'The Shocking Truth: Arrays and Pointers Are NOT the Same!'. Tên mảng đại diện trực tiếp cho một khối ô nhớ liên tục; trình biên dịch thay thế `arr` bằng địa chỉ cơ sở tại thời điểm compile/link time. Còn `ptr` là một biến con trỏ thật sự (explicit pointer variable), máy tính phải truy xuất bộ nhớ 2 lần: lần 1 để đọc địa chỉ chứa trong `ptr`, lần 2 để giải tham chiếu đọc ký tự.",
                bookRef: "Expert C Programming: Deep C Secrets (Peter van der Linden) Ch.4 & ISO C11 §6.5.3"
            },
            {
                id: "m1_q2",
                title: "Kiến trúc SRAM vs PSRAM và Căn lề 16-byte cho Vector SIMD",
                question: "Theo *ESP32-S3 Technical Reference Manual (Chương 2: System and Memory)*, vi điều khiển ESP32-S3 tích hợp tập lệnh xử lý vector SIMD 128-bit chuyên dụng cho AI (các lệnh `EE.VLD.128.IP`, `EE.VST.128.IP`). Điều kiện tiên quyết về địa chỉ bộ nhớ khi nạp vector dữ liệu là gì, và điều gì sẽ xảy ra nếu vi phạm?",
                options: [
                    "Địa chỉ con trỏ bắt buộc phải chia hết cho 16 bytes (address % 16 == 0). Nếu địa chỉ không căn lề, CPU Xtensa LX7 sẽ lập tức kích hoạt Exception Cause 9 (LoadStoreAlignmentCause) dẫn đến Guru Meditation Error / Panic Reset.",
                    "Địa chỉ con trỏ bắt buộc phải nằm trên External PSRAM để có đủ độ rộng bus 128-bit.",
                    "Không cần căn lề vì vi xử lý Xtensa tự động chia nhỏ lệnh 128-bit thành 4 lệnh 32-bit trong phần cứng.",
                    "Chỉ cần địa chỉ chia hết cho 4 bytes giống như các thanh ghi 32-bit thông thường."
                ],
                correct: 0,
                explanation: "ESP32-S3 TRM Ch.2 & Xtensa ISA quy định nghiêm ngặt: Các lệnh vector SIMD 128-bit yêu cầu địa chỉ phải căn lề 16-byte (`alignof(16)`). Khi dùng `malloc()` thông thường, bộ nhớ chỉ căn lề 4 hoặc 8 byte. Nếu ép kiểu sang con trỏ vector, CPU sẽ vấp phải `LoadStoreAlignmentCause` ngoại lệ ngắt phần cứng. Do đó, Tensor Arena luôn phải cấp phát bằng `heap_caps_aligned_alloc(16, size, MALLOC_CAP_INTERNAL)`.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.2 (System Memory Map) & Xtensa LX7 ISA"
            },
            {
                id: "m1_q3",
                title: "Phân mảnh bộ nhớ Heap (Heap Fragmentation) trong Embedded",
                question: "Trong các hệ thống nhúng Edge AI hoạt động liên tục 24/7, tại sao việc liên tục gọi `malloc()` và `free()` trong chu kỳ suy luận của mô hình học sâu lại bị coi là 'tử huyệt' kiến trúc, và giải pháp chuẩn công nghiệp là gì?",
                options: [
                    "Vì hàm free() không trả bộ nhớ lại cho hệ điều hành mà xóa sạch dữ liệu flash.",
                    "Vì malloc() và free() liên tục với các kích thước động khác nhau sẽ gây ra hiện tượng phân mảnh bộ nhớ ngoài (External Heap Fragmentation), khiến tổng RAM còn thừa nhiều nhưng không còn khối nhớ liên tục đủ lớn để cấp phát, dẫn đến crash OOM (Out Of Memory). Giải pháp chuẩn là Cấp phát Tĩnh (Static Allocation) với một Tensor Arena cố định duy nhất.",
                    "Vì malloc() trong FreeRTOS luôn chạy ở mức ưu tiên thấp nhất nên làm chậm tốc độ suy luận của mô hình.",
                    "Vì trình biên dịch GCC tự động cấm gọi malloc() nhiều hơn 100 lần trong vòng lặp vô hạn."
                ],
                correct: 1,
                explanation: "Trong hệ thống nhúng không có MMU phân trang ảo (Virtual Memory Paging), việc cấp phát - giải phóng liên tục các mảng có kích thước khác nhau sẽ tạo ra các 'lỗ thủng' ô nhớ nhỏ rải rác. Dù tổng bộ nhớ rỗi vẫn còn lớn, nhưng không có khối nào đủ lớn liên tục. TFLite Micro giải quyết dứt điểm vấn đề này bằng cách chỉ dùng 1 mảng tĩnh `uint8_t tensor_arena[ARENA_SIZE]` được cấp phát 1 lần duy nhất lúc khởi động.",
                bookRef: "TinyML (Pete Warden & Daniel Situnayake, O'Reilly) Ch.3 & SEI CERT C MEM30-C"
            },
            {
                id: "m1_q4",
                title: "Tràn Stack (Stack Overflow) & Con trỏ vùng nhớ",
                question: "Xét tình huống: Một kỹ sư khai báo một mảng đệm cục bộ bên trong một hàm Task FreeRTOS:\n```c\nvoid audio_process_task(void *pvParam) {\n    float audio_fft_buffer[4096]; // 4096 * 4 = 16,384 bytes!\n    // ...\n}\n```\nNếu Task này được tạo với `xTaskCreate(..., \"audio_task\", 4096, ...)` (Stack size = 4KB), điều gì sẽ xảy ra?",
                options: [
                    "Chương trình chạy bình thường vì FreeRTOS tự động mượn bộ nhớ Heap bù vào Stack khi thiếu.",
                    "Gây tràn Stack (Stack Overflow) nghiêm trọng, phá hủy Stack Canary và ghi đè ô nhớ của TCB (Task Control Block) kế bên, kích hoạt FreeRTOS Stack Overflow Hook hoặc Panic Reset.",
                    "Trình biên dịch GCC sẽ báo lỗi Compiler Error và từ chối xuất file nhị phân.",
                    "ESP32-S3 tự động chuyển mảng audio_fft_buffer sang phân vùng Flash để tiết kiệm RAM."
                ],
                correct: 1,
                explanation: "Biến cục bộ không có từ khóa `static` được cấp phát trên Stack của Task hiện tại. Mảng 4096 phần tử `float` ngốn 16 KB, trong khi Task chỉ được cấp 4 KB Stack! Việc này sẽ ghi đè vượt ra ngoài đáy Stack, làm hỏng các cờ kiểm tra Stack Canary và TCB của hệ điều hành, dẫn đến lỗi Guru Meditation Error hoặc `vApplicationStackOverflowHook`.",
                bookRef: "Mastering the FreeRTOS Real Time Kernel (Richard Barry) Ch.3 & ESP-IDF Programming Guide"
            },
            {
                id: "m1_q5",
                title: "Quy tắc Strict Aliasing và Ép kiểu Type-Punning trong ISO C11",
                question: "Theo chuẩn *ISO/IEC 9899:2011 (C11 Standard §6.5)*, việc đọc dữ liệu từ cảm biến bằng cách ép kiểu con trỏ trực tiếp như sau:\n```c\nuint8_t raw_bytes[4] = {0x00, 0x00, 0x80, 0x3F};\nfloat val = *(float*)raw_bytes;\n```\nvi phạm quy tắc gì của trình biên dịch GCC, và giải pháp nào đảm bảo 100% an toàn không sinh mã bất định (Undefined Behavior)?",
                options: [
                    "Vi phạm Strict Aliasing Rule, trình biên dịch khi bật tối ưu hóa (-O2/-O3) có thể tự ý sắp xếp lại thứ tự lệnh gây đọc sai giá trị. Giải pháp chuẩn là dùng union hoặc hàm memcpy().",
                    "Vi phạm quy tắc biến tĩnh static; giải pháp là thêm từ khóa static trước mảng raw_bytes.",
                    "Vi phạm quy tắc con trỏ hằng const; giải pháp là ép kiểu sang (const float*).",
                    "Đoạn mã trên hoàn toàn chuẩn chỉ và không có bất kỳ rủi ro nào trong C11."
                ],
                correct: 0,
                explanation: "Strict Aliasing Rule quy định rằng 2 con trỏ có kiểu dữ liệu khác nhau (trừ `char*` và `uint8_t*`) sẽ không bao giờ trỏ cùng vào một ô nhớ. Khi bật tối ưu hóa `-O2` trong ESP-IDF, GCC giả định lệnh đọc qua `float*` không phụ thuộc vào lệnh ghi mảng `uint8_t`, dẫn đến hoán đổi thứ tự thực thi. Để Type-Punning an toàn, chuẩn C11 và MISRA C yêu cầu dùng `memcpy(&val, raw_bytes, sizeof(val))` hoặc `union`.",
                bookRef: "ISO/IEC 9899:2011 (C11) §6.5 & SEI CERT C EXP39-C"
            }
        ]
    },

    // =========================================================================
    // MODULE 2: TIMER & XỬ LÝ NGẮT (ISR)
    // =========================================================================
    {
        moduleIndex: 1,
        title: "Module 2: Timer & Xử Lý Ngắt (ISR)",
        stageDomain: "Hardware Timers, Precision & ISR",
        icon: "⏱️",
        bookId: "book_esps3_trm",
        standardRef: "ESP32-S3 TRM Ch.11 (Timer Group) & FreeRTOS Kernel Ch.6 (Interrupts)",
        badge: "Thời Gian Thực & Ngắt Phần Cứng",
        questions: [
            {
                id: "m2_q1",
                title: "Cấu hình bộ đếm 54-bit GPTimer & Tần số ngắt chu kỳ",
                question: "Bộ đếm phần cứng GPTimer trên ESP32-S3 sử dụng nguồn xung nhịp APB Clock = 80 MHz. Để tạo ra một chu kỳ ngắt định thời lấy mẫu cảm biến chính xác $T = 100\\,\\mu\\text{s}$ (tương ứng tần số lấy mẫu $F_s = 10\\,\\text{kHz}$), nếu chọn Prescaler (bộ chia xung) là $80$, thì giá trị nạp đếm lại (Alarm Count) phải được thiết lập là bao nhiêu?",
                options: [
                    "Alarm Count = 100 ticks.",
                    "Alarm Count = 1,000 ticks.",
                    "Alarm Count = 8,000 ticks.",
                    "Alarm Count = 10,000 ticks."
                ],
                correct: 0,
                explanation: "Tần số đếm của Timer sau bộ chia: $f_{\\text{timer}} = 80\\,\\text{MHz} / 80 = 1\\,\\text{MHz}$. Mỗi tick tương ứng với chu kỳ: $T_{\\text{tick}} = 1 / 1\\,\\text{MHz} = 1\\,\\mu\\text{s}$. Do đó, để đạt khoảng thời gian $100\\,\\mu\\text{s}$, số lượng tick cần đếm là: $\\text{Alarm Count} = 100\\,\\mu\\text{s} / 1\\,\\mu\\text{s} = 100$ ticks.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.11 (Timer Group - GPTimer)"
            },
            {
                id: "m2_q2",
                title: "Thuộc tính IRAM_ATTR và Cơ chế Flash Cache Invalidation",
                question: "Tại sao trong ESP-IDF, tất cả các hàm ngắt ISR và các biến hằng chuỗi gọi trong ISR bắt buộc phải được gắn cờ `IRAM_ATTR` / `DRAM_ATTR`?",
                options: [
                    "Vì IRAM giúp nhân đôi tần số xung nhịp của CPU Xtensa khi xử lý ngắt.",
                    "Vì trong quá trình vi điều khiển thực hiện ghi/xóa bộ nhớ Flash SPI (như lưu NVS, ghi Firmware OTA), Flash Cache bị vô hiệu hóa tạm thời. Nếu một ngắt ISR phát sinh mà mã lệnh nằm trên Flash (chưa gắn IRAM_ATTR), CPU sẽ cố nạp lệnh từ Cache rỗng và lập tức crash Guru Meditation Error (IllegalInstruction / InstrFetchProhibited).",
                    "Vì IRAM_ATTR biến hàm thành một macro nội tuyến inline để giảm độ trễ ngắt.",
                    "Vì nếu không có IRAM_ATTR, hệ điều hành FreeRTOS sẽ từ chối đăng ký ngắt vào bảng Vector ngắt."
                ],
                correct: 1,
                explanation: "ESP32-S3 thực thi mã nguồn từ bộ nhớ SPI Flash thông qua bộ nhớ đệm lệnh (Instruction Cache). Khi thực hiện thao tác xóa hoặc ghi Flash, phần cứng bắt buộc phải tạm thời vô hiệu hóa Cache để tránh đọc dữ liệu rác. Bất kỳ ngắt nào xảy ra trong thời điểm này buộc phải có mã lệnh nằm sẵn trong Internal SRAM (nhờ tiền tố `IRAM_ATTR`). Nếu vi phạm, hệ thống sẽ rơi vào lỗi hoảng loạn.",
                bookRef: "ESP32-S3 TRM Ch.2 & ESP-IDF Programming Guide (IRAM-Safe Interrupt Handlers)"
            },
            {
                id: "m2_q3",
                title: "Deferred Processing: portYIELD_FROM_ISR & Context Switch",
                question: "Xét cơ chế xử lý ngắt Deferred Processing trong FreeRTOS: Khi ISR giải phóng một Semaphore hoặc gửi dữ liệu vào Queue bằng hàm `xQueueSendFromISR(..., &pxHigherPriorityTaskWoken)`, ý nghĩa của tham số `pxHigherPriorityTaskWoken` và macro `portYIELD_FROM_ISR()` là gì?",
                options: [
                    "Tự động tăng mức ưu tiên của Task nhận lên mức cao nhất trong hệ thống.",
                    "Nếu Task đang chờ dữ liệu có mức ưu tiên cao hơn Task bị ngắt, biến này sẽ được gán pdTRUE. Lệnh portYIELD_FROM_ISR() sẽ ép CPU chuyển ngữ cảnh (Context Switch) sang Task ưu tiên cao ngay khi ISR vừa kết thúc, đảm bảo tính thời gian thực tức thì thay vì phải chờ hết tick của bộ định thời.",
                    "Dừng toàn bộ các ngắt phần cứng khác cho đến khi Task xử lý xong dữ liệu.",
                    "Ghi lại nhật ký thời gian thực thi của ISR vào bộ nhớ EEPROM."
                ],
                correct: 1,
                explanation: "Triết lý RTOS cốt lõi: ISR phải ngắn nhất có thể, chỉ đọc cờ phần cứng rồi gửi tín hiệu cho Task để làm phần việc nặng (Deferred Processing). Nếu Task chờ có độ ưu tiên cao hơn Task hiện tại, `portYIELD_FROM_ISR()` kích hoạt chuyển ngữ cảnh tức thời tại điểm thoát khỏi ngắt, đảm bảo độ trễ đáp ứng (Response Latency) tối thiểu tuyệt đối.",
                bookRef: "Mastering the FreeRTOS Real Time Kernel (Richard Barry) Ch.6 (Interrupt Management)"
            },
            {
                id: "m2_q4",
                title: "Những hành vi bị cấm tuyệt đối bên trong hàm ngắt ISR",
                question: "Hành động nào sau đây là HỢP LỆ và AN TOÀN khi thực thi bên trong một hàm ngắt phần cứng (ISR) trên ESP-IDF?",
                options: [
                    "Gọi printf() hoặc ESP_LOGI() để in thông tin debug ra cổng UART.",
                    "Gọi malloc() để cấp phát động bộ đệm chứa gói tin vừa ngắt.",
                    "Khóa một FreeRTOS Mutex thông thường bằng xSemaphoreTake(mutex, portMAX_DELAY) để đồng bộ tài nguyên.",
                    "Gửi tín hiệu đánh thức Task bằng xSemaphoreGiveFromISR() và xóa cờ ngắt phần cứng."
                ],
                correct: 3,
                explanation: "Bên trong ISR: Tuyệt đối CẤM gọi `printf`/`ESP_LOG` (dùng mutex ngầm và rất chậm), CẤM `malloc`/`free` (không re-entrant và có thể block heap), CẤM lấy Mutex (Mutex có cơ chế Priority Inheritance không thể chạy trong ngữ cảnh ngắt và không được block chờ thời gian vô hạn). Chỉ được dùng các hàm API có hậu tố `FromISR` không bao giờ rơi vào trạng thái Block.",
                bookRef: "Mastering the FreeRTOS Real Time Kernel Ch.6 & MISRA C:2012 Guidelines"
            },
            {
                id: "m2_q5",
                title: "Độ giật ngắt (Interrupt Jitter) & Mức ưu tiên ngắt Level 1-7",
                question: "Kiến trúc Xtensa LX7 của ESP32-S3 hỗ trợ 7 mức ưu tiên ngắt phần cứng (Level 1 đến Level 7). Sự khác biệt căn bản giữa các ngắt mức trung bình (Level 1-3) và ngắt mức cao (Level 4-7 / NMI) là gì?",
                options: [
                    "Level 1-3 chỉ hỗ trợ ngắt phần mềm, còn Level 4-7 chỉ hỗ trợ ngắt ngoại vi GPIO.",
                    "Các ngắt Level 1-3 có thể được viết bằng C và tương thích hoàn toàn với API FreeRTOS; trong khi ngắt Level 4-7 có độ trễ cực thấp nhưng không thể bị vô hiệu hóa bởi Critical Sections của FreeRTOS và bắt buộc phải viết bằng hợp ngữ Assembly thuần, không được gọi bất kỳ API FreeRTOS nào.",
                    "Mức Level 7 có mức ưu tiên thấp nhất, mức Level 1 có mức ưu tiên cao nhất.",
                    "Tất cả các mức ngắt từ 1 đến 7 đều có quyền gọi các hàm xQueueSendFromISR() như nhau."
                ],
                correct: 1,
                explanation: "ESP32-S3 TRM Ch.3 (Interrupt Matrix): `portENTER_CRITICAL()` chỉ vô hiệu hóa các ngắt có mức ưu tiên nhỏ hơn hoặc bằng `configMAX_SYSCALL_INTERRUPT_PRIORITY` (thường là Level 3). Ngắt High-Level (Level 4-7) dùng cho các tác vụ khẩn cấp độ trễ nano-giây, không thể bị chặn bởi RTOS, nhưng vì RTOS không thể bảo vệ cấu trúc dữ liệu của nó trước ngắt cao cấp nên mã nguồn ngắt này phải viết bằng ASM và cấm gọi FreeRTOS API.",
                bookRef: "ESP32-S3 TRM Ch.3 (Interrupt Matrix) & FreeRTOS Port Architecture"
            }
        ]
    },

    // =========================================================================
    // MODULE 3: CẢM BIẾN & THU THẬP DỮ LIỆU
    // =========================================================================
    {
        moduleIndex: 2,
        title: "Module 3: Cảm Biến & Thu Thập Dữ Liệu",
        stageDomain: "Sensors, Signal Acquisition & Preprocessing",
        icon: "📡",
        bookId: "book_oppenheim_dsp",
        standardRef: "Discrete-Time Signal Processing (Oppenheim & Schafer) Ch.4 & ESP32-S3 TRM Ch.28",
        badge: "Thu Thập & Xử Lý Tín Hiệu Số",
        questions: [
            {
                id: "m3_q1",
                title: "Định lý Nyquist-Shannon & Bộ lọc chống gập phổ (Anti-Aliasing)",
                question: "Theo tác phẩm kinh điển *Discrete-Time Signal Processing* của Oppenheim & Schafer, nếu muốn số hóa tín hiệu âm thanh thu từ micro có dải tần hữu ích lên tới $f_{\\text{max}} = 8\\,\\text{kHz}$ mà không bị hiện tượng méo phổ (Aliasing Distortion), phát biểu nào sau đây là CHÍNH XÁC?",
                options: [
                    "Tần số lấy mẫu Fs phải nhỏ hơn hoặc bằng 8 kHz để giảm dung lượng RAM.",
                    "Tần số lấy mẫu Fs bắt buộc phải thỏa mãn Fs >= 2 * f_max = 16 kHz, đồng thời phải đi qua một bộ lọc tương tự thông thấp (Anti-Aliasing Low-Pass Filter) trước ADC để triệt tiêu hoàn toàn các tần số trên 8 kHz.",
                    "Chỉ cần tăng độ phân giải ADC từ 12-bit lên 24-bit là tự động loại bỏ được hiện tượng Aliasing mà không cần quan tâm đến tần số lấy mẫu Fs.",
                    "Tần số lấy mẫu Fs phải bằng đúng 8 kHz để giữ nguyên pha của tín hiệu."
                ],
                correct: 1,
                explanation: "Định lý Nyquist chỉ rõ: Tần số lấy mẫu $F_s$ phải lớn hơn hoặc bằng ít nhất 2 lần tần số thành phần cao nhất $f_{\\text{max}}$. Nếu có bất kỳ thành phần tần số nào $f > F_s / 2$ lọt vào ADC, nó sẽ bị 'gập ngược' (Aliasing) vào miền tần số thấp và hòa lẫn vào tín hiệu gốc, không thể dùng thuật toán số nào tách ra được. Do đó, $F_s = 16\\,\\text{kHz}$ và bộ lọc Low-Pass phần cứng là tiêu chuẩn bắt buộc.",
                bookRef: "Discrete-Time Signal Processing (Alan V. Oppenheim, Ronald W. Schafer) Ch.4"
            },
            {
                id: "m3_q2",
                title: "DMA Ping-Pong Buffer trong I2S Digital Audio",
                question: "Tại sao trong các ứng dụng thu âm thanh tốc độ cao (I2S Microphone 16-bit, 16 kHz) trên ESP32-S3, việc sử dụng cơ chế DMA Circular / Ping-Pong Buffer lại mang tính sống còn đối với hiệu năng hệ thống?",
                options: [
                    "Vì DMA giúp vi điều khiển phát sóng Wi-Fi xa hơn mà không suy giảm tín hiệu.",
                    "Vì phần cứng DMA tự động vận chuyển dữ liệu từng mẫu âm thanh từ thanh ghi I2S vào các mảng RAM nội mà không tiêu tốn chu kỳ thực thi của lõi CPU Xtensa. Khi buffer Ping đầy và kích hoạt ngắt, CPU có thể thảnh thơi xử lý buffer Ping trong khi phần cứng DMA tiếp tục nạp dữ liệu vào buffer Pong, loại bỏ 100% rủi ro mất mẫu (Buffer Overrun/Underflow).",
                    "Vì DMA tự động tính toán sẵn biến đổi Fourier FFT cho tín hiệu âm thanh trước khi đưa vào RAM.",
                    "Vì DMA là giao thức mã hóa bảo mật chống nghe trộm âm thanh trên bus I2S."
                ],
                correct: 1,
                explanation: "Nếu không có DMA, CPU sẽ phải bị ngắt liên tục 16,000 lần mỗi giây để đọc từng từ nhớ 16-bit từ thanh ghi FIFO của I2S, chiếm dụng tới 70-80% thời gian xử lý và khiến hệ thống không thể chạy mô hình AI. Với DMA Ping-Pong, bộ điều khiển DMA tự làm việc ngầm và chỉ báo ngắt cho CPU khi cả một khối dữ liệu lớn (Descriptor Buffer) đã nạp xong.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.28 (I2S Controller & GDMA Architecture)"
            },
            {
                id: "m3_q3",
                title: "Giao thức I2C: Bit ACK/NACK và Hiện tượng Kẹt Bus (Bus Lockup)",
                question: "Khi giao tiếp I2C giữa ESP32-S3 và cảm biến chuyển động 6 trục (IMU MPU6050), hiện tượng 'I2C Bus Lockup' (Đường truyền bị treo đơ vĩnh viễn) thường phát sinh do nguyên nhân nào và giải pháp phục hồi (Bus Recovery) chuẩn công nghiệp là gì?",
                options: [
                    "Do đường SDA bị cảm biến Slave kéo ghì xuống mức LOW vì Master bị reset đột ngột giữa chu kỳ đọc 8 bit. Giải pháp phục hồi là Master chuyển chân SCL sang GPIO Output, phát xung thủ công 9 xung nhịp xung SCL để Slave nhả chân SDA, sau đó phát tín hiệu STOP.",
                    "Do điện trở kéo lên Pull-up quá nhỏ khiến dòng điện quá tải; khắc phục bằng cách tháo bỏ toàn bộ điện trở kéo lên.",
                    "Do cảm biến MPU6050 gửi bit ACK thay vì NACK ở byte cuối cùng; khắc phục bằng cách đảo ngược địa chỉ I2C.",
                    "Do tần số I2C vượt quá 10 MHz; khắc phục bằng cách giảm xuống 10 kHz."
                ],
                correct: 0,
                explanation: "Nếu Master ESP32 bị reset (hoặc ngắt giữa chừng) đúng lúc Slave đang giữ chân SDA ở mức LOW để truyền bit 0 hoặc ACK, Slave sẽ chờ vô hạn xung clock tiếp theo trên SCL. Master khởi động lại thấy SDA = LOW sẽ nghĩ bus bận và treo cứng! Quy trình I2C Bus Recovery tiêu chuẩn: Toggle chân SCL tối đa 9 lần để đẩy thanh ghi dịch của Slave đi hết byte, sau đó phát điều kiện STOP để đưa bus về trạng thái rỗi.",
                bookRef: "I2C Bus Specification (NXP/Philips) & ESP-IDF I2C Master Bus Recovery API"
            },
            {
                id: "m3_q4",
                title: "Biến đổi Fourier Nhanh (FFT) & Hàm Cửa Sổ (Windowing)",
                question: "Trong bài toán trích xuất đặc trưng phổ âm thanh phục vụ nhận diện từ khóa (Keyword Spotting), tại sao mảng tín hiệu trong miền thời gian trước khi đưa vào thuật toán FFT bắt buộc phải được nhân với một hàm cửa sổ (ví dụ: Hanning hoặc Hamming Window)?",
                options: [
                    "Để khuếch đại biên độ tín hiệu lên gấp đôi giúp mạng nơ-ron dễ nhận dạng hơn.",
                    "Để làm mềm sự đứt gãy biên độ ở hai đầu mút của khung tín hiệu hữu hạn, từ đó triệt tiêu hiện tượng rò rỉ phổ (Spectral Leakage) và ngăn chặn việc xuất hiện các hài tần số ảo không có thật trong miền tần số.",
                    "Để giảm một nửa kích thước của mảng dữ liệu nhằm tăng tốc độ tính toán FFT.",
                    "Để loại bỏ hoàn toàn thành phần pha của tín hiệu số."
                ],
                correct: 1,
                explanation: "Biến đổi Fourier rời rạc (DFT/FFT) ngầm giả định rằng khối $N$ mẫu tín hiệu được lặp lại tuần hoàn vô tận. Nếu điểm đầu và điểm cuối của khối có biên độ chênh lệch nhau, phép nối chu kỳ sẽ tạo ra một bước nhảy gián đoạn (Discontinuity) vô hạn. Sự gián đoạn này làm năng lượng của một tần số duy nhất bị văng tóe sang tất cả các dải tần lân cận (Spectral Leakage). Cửa sổ Hanning làm biên độ 2 đầu mút về 0 một cách êm ái.",
                bookRef: "Discrete-Time Signal Processing (Oppenheim & Schafer) Ch.10 (Fourier Analysis of Signals Using DFT)"
            },
            {
                id: "m3_q5",
                title: "Bộ lọc Trung bình trượt (Moving Average) vs Bộ lọc IIR Thông thấp",
                question: "Khi tiền xử lý tín hiệu gia tốc từ IMU để nhận diện tư thế người, so sánh giữa Bộ lọc trung bình trượt $N$ mẫu (Moving Average Filter) và Bộ lọc thông thấp đệ quy bậc 1 (Single-Pole IIR Filter: $y[n] = \\alpha x[n] + (1 - \\alpha) y[n-1]$), ưu điểm vượt trội của bộ lọc IIR trên vi điều khiển tài nguyên hạn chế là gì?",
                options: [
                    "Bộ lọc IIR có đáp ứng xung hữu hạn nên không bao giờ bị mất ổn định.",
                    "Bộ lọc IIR chỉ cần lưu trữ duy nhất 1 giá trị đầu ra trước đó (y[n-1]), tiết kiệm tối đa RAM so với việc phải duy trì một mảng Ring Buffer N phần tử như Moving Average, đồng thời cho phép điều chỉnh tần số cắt cutoff liên tục và mượt mà chỉ bằng cách thay đổi hệ số alpha.",
                    "Bộ lọc IIR triệt tiêu nhiễu tốt hơn mà không gây ra bất kỳ độ trễ pha nào.",
                    "Bộ lọc IIR hoàn toàn không sử dụng phép nhân số thực."
                ],
                correct: 1,
                explanation: "Bộ lọc Moving Average kích thước $N$ đòi hỏi phải duy trì một bộ đệm vòng tròn (Ring Buffer) chứa $N$ phần tử trong RAM và thực hiện phép cộng trừ cửa sổ trượt. Bộ lọc đệ quy IIR bậc 1 (Exponential Moving Average) chỉ ngốn đúng 4 bytes RAM để lưu biến trạng thái `prev_y`, với công thức thực thi cực nhanh trên chip nhúng: `y = alpha * x + (1 - alpha) * prev_y`.",
                bookRef: "Discrete-Time Signal Processing (Oppenheim & Schafer) Ch.2 & 5 (IIR Filters Architecture)"
            }
        ]
    },

    // =========================================================================
    // MODULE 4: MULTIPLE TASK (ĐA NHIỆM FREERTOS)
    // =========================================================================
    {
        moduleIndex: 3,
        title: "Module 4: Multiple Task (Đa Nhiệm FreeRTOS)",
        stageDomain: "FreeRTOS Dual-Core & Task Synchronization",
        icon: "⚡",
        bookId: "book_freertos_kernel",
        standardRef: "Mastering the FreeRTOS Real Time Kernel (Richard Barry) Ch.4, 7 & 8",
        badge: "Hệ Điều Hành Thời Gian Thực",
        questions: [
            {
                id: "m4_q1",
                title: "Phân bổ tác vụ bất đối xứng trên Lõi Kép (Asymmetric Dual-Core)",
                question: "ESP32-S3 là vi điều khiển Dual-Core với Core 0 (PRO_CPU) và Core 1 (APP_CPU). Trong kiến trúc phần mềm Edge AI chuẩn công nghiệp, việc phân chia lõi bằng `xTaskCreatePinnedToCore` được khuyến nghị triển khai theo mô hình nào để đảm bảo hệ thống không bị crash mất mạng?",
                options: [
                    "Cả 2 lõi đều cùng chạy mô hình AI cùng lúc để tăng gấp đôi FPS mà không cần tách biệt mạng.",
                    "Core 0 ghim các tác vụ nhạy cảm về thời gian của hệ thống (Wi-Fi Protocol Stack, Bluetooth, TCP/IP lwIP, Flash OTA); Core 1 chuyên trách tính toán thuật toán nặng và mô hình học sâu (Sensor Sampling, FFT, TFLite Micro Invoke).",
                    "Core 1 chạy Wi-Fi và Core 0 để trống làm nhiệm vụ dự phòng tiết kiệm năng lượng.",
                    "FreeRTOS trên ESP-IDF cấm ghim tác vụ vào lõi cố định, bắt buộc để hệ điều hành tự điều phối ngẫu nhiên."
                ],
                correct: 1,
                explanation: "Ngăn xếp mạng Wi-Fi và Bluetooth của Espressif (RF Driver, lwIP) ngầm hoạt động trên Core 0 với các ràng buộc thời gian ngặt nghèo (Real-Time Wi-Fi Beacons). Nếu tác vụ AI nặng ngốn 100% CPU trên Core 0, các ngắt Wi-Fi sẽ bị bỏ lỡ, gây hiện tượng văng kết nối mạng và kích hoạt Watchdog. Do đó, cô lập AI sang Core 1 là mô hình vàng.",
                bookRef: "ESP-IDF Programming Guide (SMP FreeRTOS Architecture) & ESP32-S3 TRM"
            },
            {
                id: "m4_q2",
                title: "Đảo ngược mức ưu tiên (Priority Inversion) & Kế thừa ưu tiên (Priority Inheritance)",
                question: "Tình huống: Task Cao (High Priority) cần truy cập cảm biến đang được bảo vệ bởi một khóa đồng bộ. Khóa này đang do Task Thấp (Low Priority) nắm giữ. Đúng lúc đó, một Task Trung Bình (Medium Priority) xuất hiện và chiếm quyền thực thi CPU của Task Thấp trong thời gian dài, gián tiếp làm Task Cao bị nghẽn vô hạn. Cơ chế nào giải quyết triệt để lỗi này?",
                options: [
                    "Sử dụng Binary Semaphore thông thường vì nó có hàng đợi ưu tiên tích hợp.",
                    "Sử dụng FreeRTOS Mutex với cơ chế Thừa Kế Mức Ưu Tiên (Priority Inheritance): Hệ điều hành tạm thời nâng mức ưu tiên của Task Thấp lên ngang bằng Task Cao cho đến khi Task Thấp nhả Mutex ra, ngăn Task Trung Bình cướp CPU.",
                    "Tăng Stack Size của Task Cao lên gấp đôi.",
                    "Chuyển toàn bộ các Task sang mức ưu tiên bằng nhau để chạy Round-Robin."
                ],
                correct: 1,
                explanation: "Sự cố Priority Inversion từng làm tê liệt máy tính tàu thăm dò sao Hỏa Mars Pathfinder năm 1997. Binary Semaphore KHÔNG CÓ cơ chế Priority Inheritance! Chỉ có FreeRTOS Mutex (`xSemaphoreCreateMutex`) mới được cài đặt thuật toán tự động nâng ưu tiên tạm thời của Task giữ khóa, giúp nó hoàn thành vùng găng và giải phóng khóa nhanh nhất cho Task Cao.",
                bookRef: "Mastering the FreeRTOS Real Time Kernel (Richard Barry) Ch.7 (Resource Management)"
            },
            {
                id: "m4_q3",
                title: "Hàng đợi FreeRTOS Queue: Truyền Tham Trị vs Truyền Con Trỏ",
                question: "Khi truyền gói tin âm thanh giữa Task thu âm và Task phân tích AI qua FreeRTOS Queue, hành vi nào sau đây vi phạm nguyên tắc an toàn bộ nhớ và gây ra lỗi ô nhớ ma (Dangling Pointer / Memory Corruption)?",
                options: [
                    "Khai báo một biến cục bộ struct audio_frame_t trên Stack của Task thu âm, sau đó đẩy địa chỉ con trỏ của biến Stack này vào Queue để Task AI giải tham chiếu đọc dữ liệu.",
                    "Truyền bản sao trực tiếp theo tham trị (by value) toàn bộ dữ liệu cấu trúc vào Queue.",
                    "Cấp phát động từ Heap bằng malloc(), đẩy con trỏ vào Queue, và để Task nhận chịu trách nhiệm giải phóng bằng free().",
                    "Sử dụng mảng tĩnh trong DRAM được bảo vệ bằng Semaphore để Task đọc ghi lần lượt."
                ],
                correct: 0,
                explanation: "Biến cục bộ nằm trên Stack của Task phát. Ngay khi hàm của Task phát kết thúc hoặc biến rơi ra ngoài phạm vi scope, vùng nhớ đó bị giải phóng hoặc bị ghi đè bởi các hàm con tiếp theo. Nếu truyền con trỏ trỏ tới vùng nhớ Stack này qua Queue, Task nhận sẽ đọc phải dữ liệu rác hoặc ghi đè làm nát Stack của Task phát! Luôn truyền By-Value hoặc con trỏ vùng nhớ Heap/Static an toàn.",
                bookRef: "Mastering the FreeRTOS Real Time Kernel Ch.4 (Queue Management) & SEI CERT C MEM30-C"
            },
            {
                id: "m4_q4",
                title: "Task Watchdog Timer (TWDT) & Cơ chế Chống Treo CPU",
                question: "Một kỹ sư triển khai vòng lặp nhận diện AI: `while(1) { run_inference_loop(); }`. Khi nạp code vào ESP32-S3, sau vài giây hệ thống phát sinh lỗi: `Task watchdog got triggered. The following tasks did not reset the watchdog: ai_task`. Nguyên nhân gốc rễ và cách khắc phục đúng chuẩn là gì?",
                options: [
                    "Do nguồn cấp điện áp cho vi điều khiển bị sụt; khắc phục bằng cách thay đổi dây cáp USB.",
                    "Do Task chạy vòng lặp tính toán liên tục 100% CPU mà không hề trả lại quyền điều khiển (yield) cho bộ lập lịch hoặc không gọi esp_task_wdt_reset(). Khắc phục bằng cách chèn vTaskDelay(1) hoặc esp_task_wdt_reset() vào cuối mỗi vòng lặp suy luận.",
                    "Do mô hình TFLite Micro bị lỗi trọng số âm; khắc phục bằng cách train lại mô hình trên Google Colab.",
                    "Do Task Watchdog chỉ hỗ trợ Core 0, không hỗ trợ Core 1; khắc phục bằng cách tắt hoàn toàn TWDT trong menuconfig."
                ],
                correct: 1,
                explanation: "ESP-IDF tích hợp Task Watchdog Timer (TWDT) để giám sát chống treo hệ thống. Một tác vụ được đăng ký với TWDT phải định kỳ 'cho chó ăn' (Feed the Dog) bằng cách hoàn thành chu kỳ và yield quyền CPU qua `vTaskDelay()`, chờ sự kiện Queue/Semaphore, hoặc chủ động gọi `esp_task_wdt_reset()`. Nếu ngâm CPU liên tục quá thời gian timeout (mặc định 5 giây), TWDT sẽ kích hoạt Panic Handler.",
                bookRef: "ESP-IDF Programming Guide (Watchdogs Architecture) & FreeRTOS Kernel Guide"
            },
            {
                id: "m4_q5",
                title: "Cơ chế Lập lịch Round-Robin & Starvation",
                question: "Trong FreeRTOS, điều kiện cần và đủ để hai tác vụ A và B tự động luân phiên chia sẻ thời gian thực thi CPU theo cơ chế Round-Robin Time Slicing là gì?",
                options: [
                    "Cả 2 tác vụ phải được gán cùng một mức ưu tiên (Equal Priority: priority_A == priority_B) và cờ cấu hình configUSE_TIME_SLICING được kích hoạt trong FreeRTOSConfig.h.",
                    "Tác vụ A phải có mức ưu tiên cao hơn tác vụ B đúng 1 bậc.",
                    "Hai tác vụ bắt buộc phải chạy trên hai nhân CPU khác nhau.",
                    "Cả hai tác vụ phải dùng chung một hàng đợi Queue."
                ],
                correct: 0,
                explanation: "FreeRTOS sử dụng bộ lập lịch ưu tiên chiếm quyền (Preemptive Priority-Based Scheduler). Nếu hai tác vụ có cùng mức ưu tiên và cấu hình `configUSE_TIME_SLICING = 1`, hệ điều hành sẽ tự động hoán đổi ngữ cảnh giữa chúng tại mỗi nhịp Tick ngắt của Timer hệ thống (SysTick). Nếu tác vụ A có ưu tiên cao hơn tác vụ B và không bao giờ chuyển sang trạng thái Block, tác vụ B sẽ bị bỏ đói vĩnh viễn (Starvation).",
                bookRef: "Mastering the FreeRTOS Real Time Kernel Ch.3 (Task Scheduling)"
            }
        ]
    },

    // =========================================================================
    // MODULE 5: NETWORK & NÂNG CẤP OTA
    // =========================================================================
    {
        moduleIndex: 4,
        title: "Module 5: Network & Nâng Cấp OTA",
        stageDomain: "Wireless Telemetry & Over-The-Air Update",
        icon: "🌐",
        bookId: "book_esps3_trm",
        standardRef: "ESP-IDF OTA Architecture & MQTT v3.1.1 / v5.0 Specification",
        badge: "Kết Nối Không Dây & Cập Nhật Firmware Từ Xa",
        questions: [
            {
                id: "m5_q1",
                title: "Kiến trúc Bảng Phân Vùng Dual-Bank OTA (ota_0, ota_1, otadata)",
                question: "Trong kiến trúc nâng cấp Firmware qua mạng không dây (Over-The-Air - OTA) của ESP32-S3, vai trò cốt lõi của phân vùng `otadata` (kích thước 8 KB) nằm giữa các phân vùng ứng dụng `ota_0` và `ota_1` là gì?",
                options: [
                    "Chứa file ảnh giao diện Web Server dùng để người dùng tải file firmware lên.",
                    "Lưu trữ chỉ số phân vùng khởi động hiện tại (Active OTA Slot: ota_0 hay ota_1), số đếm chu kỳ boot (Sequence Counter) và cờ trạng thái kiểm tra tính hợp lệ của bản firmware mới (ESP_OTA_IMG_PENDING_VERIFY).",
                    "Là vùng đệm RAM chứa gói tin Wi-Fi trước khi giải mã nén.",
                    "Lưu trữ khóa bí mật Wi-Fi SSID và Password của thiết bị."
                ],
                correct: 1,
                explanation: "Phân vùng `otadata` là 'kim chỉ nam' của 2nd Stage Bootloader. Nó gồm 2 sector giống nhau (để chống hỏng khi mất điện giữa lúc ghi). Khi nâng cấp OTA xong vào `ota_1`, hệ điều hành cập nhật `otadata` trỏ sang `ota_1` với cờ `PENDING_VERIFY`. Bootloader đọc `otadata` khi reset để biết cần nạp mã từ phân vùng nào vào bộ nhớ để thực thi.",
                bookRef: "ESP-IDF Programming Guide (Over The Air Updates - OTA Architecture)"
            },
            {
                id: "m5_q2",
                title: "Cơ chế Tự Động Rollback Firmware Khi Gặp Crash Bootloop",
                question: "Một bản Firmware AI mới tải qua OTA được nạp vào ESP32-S3 và khởi động lại. Tuy nhiên, do mô hình AI bị lỗi tràn bộ nhớ nên chip bị crash liên tục trong hàm `app_main()`. Nhờ cơ chế nào mà vi điều khiển có thể tự động phục hồi về bản firmware cũ ổn định trước đó mà không bị 'biến thành cục gạch' (Bricked)?",
                options: [
                    "Nhờ người dùng bấm nút BOOT vật lý trên bo mạch từ xa.",
                    "Nhờ cờ trạng thái ESP_OTA_IMG_PENDING_VERIFY: Nếu firmware mới không thể thực thi đến dòng lệnh esp_ota_mark_app_valid_cancel_rollback() do bị crash reboot liên tục vượt quá ngưỡng số lần cho phép, Bootloader sẽ tự động đánh dấu bản mới bị hỏng và chuyển chỉ số boot quay về phân vùng OTA cũ đang hoạt động ổn định.",
                    "Nhờ Router Wi-Fi tự động gửi lệnh reset thiết bị về cấu hình xuất xưởng.",
                    "Nhờ chip tự động nạp lại firmware từ chân cổng COM UART."
                ],
                correct: 1,
                explanation: "Tính năng Automatic Rollback là tiêu chuẩn công nghiệp bắt buộc cho thiết bị IoT thương mại. Khi firmware mới boot lần đầu, nó ở trạng thái `ESP_OTA_IMG_PENDING_VERIFY`. Nếu thiết bị crash trước khi gọi hàm xác nhận thành công, biến đếm bootloop của Bootloader tăng lên. Khi vượt ngưỡng, Bootloader tự động hủy phân vùng hỏng và kích hoạt lại phân vùng cũ an toàn.",
                bookRef: "ESP-IDF OTA Programming Guide (App Rollback & Anti-Rollback)"
            },
            {
                id: "m5_q3",
                title: "Giao thức MQTT: Lựa chọn mức QoS cho IoT Edge AI",
                question: "Giao thức MQTT hỗ trợ 3 mức chất lượng dịch vụ: QoS 0 (At most once), QoS 1 (At least once), QoS 2 (Exactly once). Trong bài toán truyền telemetry định kỳ dữ liệu cảm biến và kết quả nhận dạng AI (1 giây/lần) từ hàng ngàn thiết bị pin về Cloud Broker, mức QoS nào tối ưu nhất và tại sao?",
                options: [
                    "Bắt buộc dùng QoS 2 vì không được phép thất lạc bất kỳ gói tin cảm biến nào.",
                    "QoS 0 hoặc QoS 1 là tối ưu nhất vì QoS 2 đòi hỏi quy trình bắt tay 4 bước (PUBLISH -> PUBREC -> PUBREL -> PUBCOMP), gây tăng gấp 3 lần lượng dữ liệu mạng, lãng phí băng thông và hao pin cực lớn. Với dữ liệu streaming chu kỳ 1s, mất 1 gói tin không ảnh hưởng đến độ chính xác tổng thể của hệ thống.",
                    "MQTT không hỗ trợ truyền dữ liệu AI, phải dùng HTTP POST.",
                    "Dùng QoS 0 và ngắt kết nối mạng ngay lập tức sau khi gửi 1 byte."
                ],
                correct: 1,
                explanation: "QoS 2 đảm bảo chính xác 1 lần bằng quy trình 4-way handshake, tạo ra độ trễ mạng lớn và tiêu tốn năng lượng thu phát sóng Wi-Fi cực nhiều. Trong IoT cảm biến và suy luận biên, dữ liệu mang tính thời gian thực tức thời: mẫu tin sau 1 giây sẽ thay thế mẫu tin trước. Do đó QoS 0 (gửi không cần ACK) hoặc QoS 1 (chỉ cần 1 ACK) là chuẩn mực tiết kiệm pin.",
                bookRef: "MQTT Version 3.1.1 / 5.0 OASIS Standard & IoT System Design Patterns"
            },
            {
                id: "m5_q4",
                title: "Quản lý Kết nối Wi-Fi & Thuật toán Exponential Backoff",
                question: "Khi xử lý sự kiện mất kết nối Wi-Fi (`WIFI_EVENT_STA_DISCONNECTED`) trong ESP-IDF, tại sao việc gọi ngay lập tức `esp_wifi_connect()` trong vòng lặp vô hạn mà không có thời gian trễ tăng dần (Exponential Backoff) bị coi là lỗi thiết kế hệ thống nghiêm trọng?",
                options: [
                    "Vì gọi liên tục sẽ làm cháy ăng-ten phát sóng RF của vi điều khiển.",
                    "Vì khi Router Wi-Fi bị khởi động lại hoặc mất nguồn, hàng trăm thiết bị cùng lúc bắn gói tin tái kết nối liên tục sẽ gây ra bão kết nối (Connection Storm / Thundering Herd Problem), làm sập Router và khiến CPU vi điều khiển bị quá nhiệt, kiệt quệ năng lượng pin.",
                    "Vì ESP-IDF chỉ cho phép gọi esp_wifi_connect() tối đa 3 lần trong một ngày.",
                    "Vì hệ điều hành FreeRTOS sẽ tự động xóa Task Wi-Fi nếu kết nối thất bại 2 lần."
                ],
                correct: 1,
                explanation: "Thuật toán Exponential Backoff quy định: Lần thử lại 1 chờ 1s, lần 2 chờ 2s, lần 3 chờ 4s, 8s, 16s... kèm theo một khoảng ngẫu nhiên (Jitter). Điều này giúp tản đều lưu lượng truy cập khi trạm phát sóng Wi-Fi vừa bật lại, ngăn ngừa sự cố nghẽn mạng cục bộ và bảo vệ tuổi thọ của pin thiết bị nhúng.",
                bookRef: "SEI CERT C Coding Standard & RFC 2988 (Computing TCP's Retransmission Timer)"
            },
            {
                id: "m5_q5",
                title: "Bảo mật Firmware: Chữ ký số RSA-3072 / ECDSA & Secure Boot",
                question: "Trong quy trình cập nhật OTA từ xa, biện pháp kỹ thuật nào ngăn chặn triệt để kẻ tấn công thực hiện kỹ thuật Man-In-The-Middle (MITM) để đẩy một bản firmware độc hại (Malicious Firmware) vào thiết bị?",
                options: [
                    "Chỉ cần đổi tên file firmware thành một chuỗi ký tự bí mật.",
                    "Sử dụng kết nối bảo mật Transport Layer Security (TLS 1.3 / HTTPS) kết hợp với Cơ chế Khởi Động An Toàn (Secure Boot V2): Bản firmware được ký số bằng khóa bí mật (Private Key RSA-3072 hoặc ECDSA); Bootloader phần cứng dùng khóa công khai (Public Key) lưu trong eFuse một lần (Write-Once) để xác thực tính toàn vẹn của chữ ký số trước khi cho phép nạp.",
                    "Nén file firmware bằng mật khẩu ZIP thông thường trước khi tải lên Cloud.",
                    "Đổi cổng truyền thông OTA từ cổng 80 sang cổng 8080."
                ],
                correct: 1,
                explanation: "Secure Boot V2 trên ESP32-S3 sử dụng phần cứng mật mã chuyên dụng (Cryptographic Hardware Accelerator). Bất kỳ bản firmware OTA nào cũng phải được ký số điện tử. Nếu kẻ tấn công thay đổi dù chỉ 1 bit mã lệnh, chữ ký RSA-3072 sẽ không khớp với Public Key băm trong eFuse phần cứng, thiết bị sẽ từ chối nạp và khóa phân vùng ngay lập tức.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.21 (RSA Accelerator & Secure Boot V2)"
            }
        ]
    },

    // =========================================================================
    // MODULE 6: MÔ HÌNH AI TRÊN EDGE (TINYML)
    // =========================================================================
    {
        moduleIndex: 5,
        title: "Module 6: Mô Hình AI Trên Edge (TinyML)",
        stageDomain: "TinyML, TFLite Micro & Model Optimization",
        icon: "🤖",
        bookId: "book_jacob_quantization",
        standardRef: "Benoit Jacob et al. (CVPR 2018) & TinyML (Pete Warden, O'Reilly)",
        badge: "Trí Tuệ Nhân Tạo Siêu Nhỏ INT8",
        questions: [
            {
                id: "m6_q1",
                title: "Công thức Lượng tử hóa Affine INT8 của Benoit Jacob (Google CVPR 2018)",
                question: "Theo công trình khoa học nền tảng *Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference* của Benoit Jacob et al. (IEEE CVPR 2018), công thức ánh xạ giữa giá trị số thực $r$ (Float32) và giá trị lượng tử hóa số nguyên $q$ (INT8) được định nghĩa là gì?",
                options: [
                    "r = S * (q - Z), trong đó S (Scale) là số thực dương Float32 và Z (Zero-Point) là số nguyên INT8 tương ứng với giá trị thực 0.0.",
                    "r = (q * Z) / S, trong đó S và Z đều là các số nguyên 16-bit.",
                    "r = q^2 - Z^2, dùng để chuẩn hóa dữ liệu về khoảng [-1, 1].",
                    "r = S + q * 255, ánh xạ tuyến tính không có điểm zero."
                ],
                correct: 0,
                explanation: "Công thức Affine Quantization $r = S \\times (q - Z)$ là nền tảng toán học cốt lõi của TensorFlow Lite. Trong đó, $S$ đại diện cho bước nhảy giữa hai giá trị số nguyên liền kề, và $Z$ là giá trị nguyên đại diện cho số thực 0.0 chính xác. Việc giữ nguyên điểm 0 thực tế là cực kỳ quan trọng vì các hàm kích hoạt như ReLU có rất nhiều số 0, giúp phép toán nhân cộng dồn ma trận không bị sai số lệch trục.",
                bookRef: "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference (Jacob et al., 2018) §2"
            },
            {
                id: "m6_q2",
                title: "Nhân Ma Trận Fixed-Point Integer-Only không cần FPU",
                question: "Tại sao kỹ thuật Lượng tử hóa INT8 theo mô hình của Benoit Jacob lại cho phép vi điều khiển không có FPU (hoặc FPU yếu) thực hiện tích chập Conv2D với tốc độ nhanh gấp 4 lần so với Float32?",
                options: [
                    "Vì mô hình INT8 tự động xóa bỏ một nửa số lượng trọng số (Weights Pruning).",
                    "Vì toàn bộ phép nhân trọng số và đầu vào được chuyển thành nhân số nguyên 8-bit nhân 8-bit tích lũy vào thanh ghi 32-bit (INT32 Accumulator). Phép nhân tỉ lệ số thực sau đó được xấp xỉ bằng phép nhân số nguyên Fixed-Point kết hợp dịch bit số học (Bit-Shift), hoàn toàn không cần bất kỳ lệnh dấu phẩy động Float32 nào trong chu kỳ tính toán.",
                    "Vì INT8 chuyển đổi toàn bộ mạng nơ-ron thành bảng tra cứu Lookup Table.",
                    "Vì kiểu dữ liệu INT8 chỉ chạy trên vi xử lý đồ họa GPU."
                ],
                correct: 1,
                explanation: "Jacob et al. đã chứng minh rằng tỉ lệ Scale $M = S_1 S_2 / S_3$ luôn nằm trong khoảng $(0, 1)$ và có thể biểu diễn dưới dạng: $M = 2^{-n} M_0$, trong đó $M_0$ là số nguyên INT32. Nhờ đó, phép nhân ma trận của mạng nơ-ron chỉ bao gồm: Lệnh nhân số nguyên và lệnh dịch bit phải (`>> n`), tận dụng hoàn hảo tập lệnh tăng tốc SIMD của vi xử lý nhúng.",
                bookRef: "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference §3"
            },
            {
                id: "m6_q3",
                title: "Kiến trúc Tensor Arena trong TensorFlow Lite for Microcontrollers",
                question: "Trong thư viện TFLite Micro, bộ nhớ `tensor_arena` đóng vai trò gì và tại sao toàn bộ bộ nhớ này phải được cấp phát trước một mảng tĩnh (Static Buffer) thay vì dùng `malloc` trong quá trình suy luận `invoke()`?",
                options: [
                    "Tensor Arena là bộ nhớ chứa mã nguồn của mô hình; cần cấp phát tĩnh để chống hack.",
                    "Tensor Arena chứa toàn bộ bộ nhớ đệm đầu vào, đầu ra, và các Tensor trung gian giữa các lớp (Activation Buffers). Cấp phát tĩnh trước kích thước cố định đảm bảo không bao giờ sinh ra lỗi phân mảnh bộ nhớ Heap, đảm bảo tính thời gian thực xác định (Deterministic Execution) và bảo đảm ứng dụng không bao giờ bị crash Out-Of-Memory giữa chừng khi đang chạy sản phẩm.",
                    "Tensor Arena chỉ dùng để chứa trọng số weights của mô hình được đọc từ thẻ nhớ SD.",
                    "Tensor Arena là thư viện dùng để huấn luyện lại mô hình học sâu trực tiếp trên chip."
                ],
                correct: 1,
                explanation: "Khác với TensorFlow trên máy chủ, TFLite Micro được thiết kế cho các hệ thống nhúng có độ tin cậy tuyệt đối. Bộ quản lý bộ nhớ `MicroAllocator` chia sẻ các vùng đệm trung gian chồng lấn nhau bên trong một khối bộ nhớ phẳng duy nhất `tensor_arena`. Một khi `arena` đã nạp thành công ở bước khởi động, hệ thống đảm bảo 100% không bao giờ gặp lỗi thiếu RAM trong suốt quá trình suy luận.",
                bookRef: "TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers Ch.3"
            },
            {
                id: "m6_q4",
                title: "Tăng tốc phần cứng ESP-DL & Lệnh SIMD 128-bit trên Xtensa LX7",
                question: "Thư viện tăng tốc học sâu ESP-DL của Espressif đạt được thông lượng tính toán vượt trội trên ESP32-S3 nhờ khai thác tập lệnh phần cứng đặc thù nào của nhân vi xử lý Xtensa LX7?",
                options: [
                    "Tập lệnh đồ họa 3D OpenGL.",
                    "Tập lệnh phần cứng Vector SIMD 128-bit (PIE - Processor Instruction Extension), cho phép thực hiện đồng thời 16 phép nhân cộng dồn số nguyên INT8 (16 MACs/chu kỳ) hoặc 8 phép nhân 16-bit trong duy nhất 1 chu kỳ xung nhịp CPU.",
                    "Tập lệnh giải mã video phần cứng H.264.",
                    "Tập lệnh lượng tử hóa nổi Bfloat16."
                ],
                correct: 1,
                explanation: "ESP32-S3 được trang bị bộ mở rộng hướng dẫn xử lý vector (PIE - Xtensa Vector Extension). Với các thanh ghi vector 128-bit, CPU có thể nạp một mảng 16 số nguyên INT8 cùng lúc và nhân dồn tích lũy chỉ trong 1 chu kỳ xung nhịp. Thư viện ESP-DL viết lại toàn bộ các hàm cốt lõi như `Conv2D`, `DepthwiseConv2D`, `MaxPool` bằng các lệnh Assembly này để đạt hiệu năng tối đa.",
                bookRef: "ESP32-S3 Technical Reference Manual & Espressif ESP-DL Accelerator Library Guide"
            },
            {
                id: "m6_q5",
                title: "So sánh Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT)",
                question: "Khi nào một kỹ sư Edge AI BẮT BUỘC phải chuyển từ kỹ thuật Lượng tử hóa sau huấn luyện thông thường (PTQ) sang Huấn luyện mô phỏng lượng tử hóa (Quantization-Aware Training - QAT)?",
                options: [
                    "Khi dung lượng Flash của vi điều khiển lớn hơn 16 MB.",
                    "Khi mô hình nén xuống INT8 bằng PTQ bị suy giảm độ chính xác nghiêm trọng (ví dụ giảm > 10% Accuracy trên các mô hình siêu nhỏ như MobileNetV2 hoặc Keyword Spotting), do dải động của trọng số bị co hẹp; QAT mô phỏng việc làm tròn số nguyên ngay trong quá trình Backpropagation giúp trọng số tự học cách thích nghi với sai số lượng tử hóa.",
                    "Khi mô hình chỉ chứa các lớp tích chập 1D mà không có lớp Dense.",
                    "QAT luôn là bắt buộc đối với tất cả mọi bài toán, PTQ không bao giờ dùng được trong thực tế."
                ],
                correct: 1,
                explanation: "Với các mô hình lớn, PTQ thường bảo toàn độ chính xác rất tốt. Tuy nhiên với các mô hình Edge AI có kích thước cực nhỏ (vài chục KB), các trọng số có độ nhạy cảm rất cao với sai số làm tròn số nguyên. QAT giải quyết vấn đề này bằng cách chèn các nút 'Fake Quantization' vào đồ thị tính toán trong quá trình huấn luyện trên máy tính, giúp mô hình tìm ra các cực tiểu trọng số chịu được sai số INT8.",
                bookRef: "Jacob et al. (CVPR 2018) Section 4 (Training with Simulated Quantization) & TensorFlow Guide"
            }
        ]
    },

    // =========================================================================
    // MODULE 7: TỐI ƯU NGUỒN CỰC HẠN (ULP & DEEP SLEEP)
    // =========================================================================
    {
        moduleIndex: 6,
        title: "Module 7: Tối Ưu Nguồn Cực Hạn (ULP & Deep Sleep)",
        stageDomain: "Low Power Optimization, Deep Sleep & Energy Harvesting",
        icon: "🔋",
        bookId: "book_esps3_trm",
        standardRef: "ESP32-S3 TRM Ch.9 (Low Power Management) & Ch.32 (ULP RISC-V)",
        badge: "Tối Ưu Năng Lượng & Đồng Xử Lý ULP",
        questions: [
            {
                id: "m7_q1",
                title: "Phân biệt dòng tiêu thụ giữa Active Mode, Light Sleep và Deep Sleep",
                question: "Theo đặc tả điện năng trong *ESP32-S3 Datasheet & TRM*, sự khác biệt bản chất nhất giữa chế độ `Light Sleep` và `Deep Sleep` đối với trạng thái hoạt động của nhân vi xử lý và bộ nhớ RAM là gì?",
                options: [
                    "Cả hai chế độ đều tiêu thụ dòng điện bằng nhau khoảng 10 mA.",
                    "Trong Light Sleep, nguồn điện cấp cho CPU chính bị ngắt xung nhịp nhưng dữ liệu trong toàn bộ Internal SRAM được duy trì nguyên vẹn; trong Deep Sleep, toàn bộ nguồn cấp cho CPU chính và phần lớn Internal SRAM bị ngắt hoàn toàn (chỉ duy trì RTC Memory), giảm dòng rò xuống mức micro-ampe (~7-10 uA), và khi thức dậy chip sẽ khởi động lại từ đầu (Reset Handler).",
                    "Deep Sleep vẫn cho phép phát Wi-Fi liên tục ở chế độ ngầm.",
                    "Light Sleep xóa sạch bộ nhớ Flash, còn Deep Sleep thì không."
                ],
                correct: 1,
                explanation: "Deep Sleep là chế độ ngủ sâu tối đa: Tất cả các nguồn cấp năng lượng cao (CPU Xtensa, Wi-Fi/BT Radio, PLL, Internal SRAM1/2) đều bị cắt nguồn điện. Chỉ có khối RTC (Real-Time Clock) và vùng nhớ RTC SRAM nhỏ được cấp nguồn điện áp thấp. Nhờ đó, dòng tiêu thụ giảm từ ~240 mA (khi bật Wi-Fi) xuống chỉ còn ~7-10 $\\mu\\text{A}$. Khi thức dậy từ Deep Sleep, hệ thống thực thi lại từ hàm bootloader.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.9 (Reset and Clock - Low Power Management)"
            },
            {
                id: "m7_q2",
                title: "Kiến trúc Bộ Đồng Xử Lý ULP RISC-V (Ultra-Low-Power Co-processor)",
                question: "Bộ đồng xử lý ULP RISC-V tích hợp trên ESP32-S3 giải quyết bài toán giám sát cảm biến trong hệ thống chạy pin dài hạn như thế nào?",
                options: [
                    "ULP RISC-V là một nhân CPU đồ họa tốc độ 1 GHz để render màn hình OLED.",
                    "ULP RISC-V là một vi xử lý 32-bit phụ tiêu thụ dòng điện cực thấp (~15-20 uA), nằm trong miền nguồn RTC_SLOW_MEM; nó có thể tự khởi động định kỳ để đọc cảm biến qua I2C/ADC, kiểm tra nếu có giá trị bất thường vượt ngưỡng mới kích hoạt đánh thức CPU chính Xtensa dậy xử lý, còn bình thường thì giữ CPU chính ngủ say.",
                    "ULP RISC-V dùng để khuếch đại sóng phát Wi-Fi khi đi xa.",
                    "ULP RISC-V là một mạch logic cố định không thể lập trình được bằng mã nguồn C."
                ],
                correct: 1,
                explanation: "Thay vì phải đánh thức CPU chính Xtensa (ngốn hàng chục mA) chỉ để đọc 2 byte nhiệt độ hoặc kiểm tra rung động, ESP32-S3 cho phép viết mã nguồn C biên dịch trực tiếp cho nhân ULP RISC-V. ULP sống độc lập trong miền RTC, có thể giao tiếp I2C/SPI với cảm biến, tính toán logic đơn giản, và chỉ gọi ngắt đánh thức (Wakeup Trigger) khi có sự kiện thực sự cần mạng AI xử lý.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.32 (Ultra-Low-Power Co-processor RISC-V)"
            },
            {
                id: "m7_q3",
                title: "Bảo tồn biến qua giấc ngủ Deep Sleep: RTC_DATA_ATTR",
                question: "Trong lập trình C cho ESP32-S3, một biến đếm số chu kỳ thức giấc cần phải được khai báo với thuộc tính nào để giá trị của nó không bị reset về 0 sau mỗi lần chip thức dậy từ giấc ngủ Deep Sleep?",
                options: [
                    "volatile static int counter = 0;",
                    "RTC_DATA_ATTR int counter = 0; (hoặc RTC_NOINIT_ATTR để không khởi tạo lại khi boot)",
                    "const int counter = 0;",
                    "__attribute__((section(\".text\"))) int counter = 0;"
                ],
                correct: 1,
                explanation: "Khi vi điều khiển vào Deep Sleep, toàn bộ vùng nhớ DRAM/BSS thông thường bị ngắt điện nên dữ liệu biến thông thường sẽ biến mất. Biến được đánh dấu thuộc tính `RTC_DATA_ATTR` sẽ được Linker chuyển vị trí đặt vào vùng nhớ `RTC Fast Memory` hoặc `RTC Slow Memory`. Vùng nhớ này được cấp nguồn pin liên tục trong lúc ngủ sâu, bảo tồn toàn vẹn dữ liệu.",
                bookRef: "ESP-IDF Programming Guide (Deep Sleep & RTC Memory Allocation)"
            },
            {
                id: "m7_q4",
                title: "Cơ chế Đánh thức: Phân biệt Wakeup EXT0 vs EXT1",
                question: "Trong cơ chế đánh thức vi điều khiển từ giấc ngủ Deep Sleep bằng ngắt ngoài GPIO (External Wakeup Sources), sự khác biệt căn bản giữa `EXT0` và `EXT1` trên ESP32-S3 là gì?",
                options: [
                    "EXT0 dùng cho cảm biến analog, EXT1 dùng cho bàn phím số.",
                    "EXT0 chỉ cho phép giám sát duy nhất một chân RTC GPIO đơn lẻ với mức kích hoạt HIGH hoặc LOW; trong khi EXT1 cho phép cấu hình một mặt nạ bit (Bitmask) gồm nhiều chân RTC GPIO đồng thời, hỗ trợ logic kích hoạt đánh thức khi BẤT KỲ chân nào đổi trạng thái (ESP_EXT1_WAKEUP_ANY_HIGH) hoặc TẤT CẢ các chân đều đổi trạng thái (ALL_LOW).",
                    "EXT0 chỉ hoạt động trong Light Sleep, không hỗ trợ Deep Sleep.",
                    "EXT1 là giao diện đánh thức bằng sóng vô tuyến vô hình."
                ],
                correct: 1,
                explanation: "ESP32-S3 phân chia rõ: `esp_sleep_enable_ext0_wakeup(gpio_num, level)` chỉ giám sát 1 chân (dùng bộ so sánh RTC IO). `esp_sleep_enable_ext1_wakeup(mask, mode)` hỗ trợ giám sát một tập hợp nhiều chân thông qua mặt nạ 64-bit, cực kỳ hữu dụng trong thiết kế bàn phím ma trận hoặc cụm cảm biến nhiều vị trí.",
                bookRef: "ESP-IDF API Reference (Sleep Modes & Wakeup Sources)"
            },
            {
                id: "m7_q5",
                title: "Mô hình Toán học Ước tính Tuổi Thọ Pin (Battery Lifetime Calculation)",
                question: "Một thiết bị Edge AI sử dụng pin Lithium 2000 mAh. Thiết bị có chu kỳ hoạt động: Cứ mỗi 60 giây ($T = 60\\,\\text{s}$), thiết bị thức dậy $T_{\\text{active}} = 0.5\\,\\text{s}$ tiêu thụ dòng trung bình $I_{\\text{active}} = 80\\,\\text{mA}$ để đọc cảm biến và suy luận AI, sau đó ngủ Deep Sleep $T_{\\text{sleep}} = 59.5\\,\\text{s}$ tiêu thụ dòng $I_{\\text{sleep}} = 10\\,\\mu\\text{A} = 0.01\\,\\text{mA}$. Bỏ qua dòng tự xả của pin, dòng điện trung bình $I_{\\text{avg}}$ và thời gian hoạt động lý thuyết của pin xấp xỉ là bao nhiêu?",
                options: [
                    "I_avg = 80 mA, pin chạy được 25 giờ (~1 ngày).",
                    "I_avg ≈ 0.676 mA, pin chạy được khoảng ~2,958 giờ (tương đương gần 4 tháng hoạt động liên tục).",
                    "I_avg = 10 mA, pin chạy được 200 giờ.",
                    "I_avg = 0.01 mA, pin chạy được 20 năm."
                ],
                correct: 1,
                explanation: "Dòng điện trung bình: $I_{\\text{avg}} = \\frac{I_{\\text{active}} \\times T_{\\text{active}} + I_{\\text{sleep}} \\times T_{\\text{sleep}}}{T} = \\frac{80 \\times 0.5 + 0.01 \\times 59.5}{60} = \\frac{40 + 0.595}{60} \\approx 0.6766\\,\\text{mA}$. Thời gian sống của pin 2000 mAh: $t = 2000\\,\\text{mAh} / 0.6766\\,\\text{mA} \\approx 2956$ giờ $\\approx 123$ ngày $\\approx 4.1$ tháng.",
                bookRef: "Ultra-Low-Power Embedded Systems Design & Battery Modeling"
            }
        ]
    },

    // =========================================================================
    // MODULE 8: ĐỒ ÁN ĐIỂM A+ & BENCHMARKING KHOA HỌC
    // =========================================================================
    {
        moduleIndex: 7,
        title: "Module 8: Đồ Án Điểm A+ & Benchmarking Khoa Học",
        stageDomain: "Academic Capstone Defense, Metrics & Documentation",
        icon: "🎓",
        bookId: "book_mlperf_tiny",
        standardRef: "MLPerf Tiny Benchmark (Banbury et al., NeurIPS 2021) & IEEE Standards",
        badge: "Đánh Giá Khoa Học & Đo Kiểm Hiệu Năng",
        questions: [
            {
                id: "m8_q1",
                title: "Bộ Chuẩn Đánh Giá MLPerf Tiny Benchmark (NeurIPS 2021)",
                question: "Theo bài báo khoa học *MLPerf Tiny Benchmark* (Banbury et al., NeurIPS 2021), 4 tác vụ chuẩn hóa quốc tế được cộng đồng nghiên cứu và công nghiệp lựa chọn để đánh giá năng lực phần cứng vi điều khiển Edge AI gồm những bài toán nào?",
                options: [
                    "Xử lý ngôn ngữ lớn LLM, Tạo ảnh khuếch tán Diffusion, Dịch máy và Chơi cờ vua.",
                    "Keyword Spotting (KWS - Nhận diện từ khóa giọng nói), Visual Wake Words (VWW - Nhận diện người xuất hiện qua camera), Anomaly Detection (AD - Phát hiện bất thường âm thanh máy móc công nghiệp), và Image Classification (IC - Phân loại ảnh CIFAR-10).",
                    "Đo nhịp tim, Đếm bước chân, Báo thức và Đo nhiệt độ phòng.",
                    "Phát hiện xâm nhập Wi-Fi, Mã hóa AES-256, Nén file ZIP và Quản lý cơ sở dữ liệu SQLite."
                ],
                correct: 1,
                explanation: "MLPerf Tiny là bộ tiêu chuẩn học thuật và công nghiệp danh giá nhất thế giới dành cho hệ thống nhúng học sâu (TinyML), công bố tại hội nghị NeurIPS 2021. 4 tác vụ này đại diện đầy đủ cho các kiểu dữ liệu cảm biến điển hình trên Edge: Tín hiệu 1D âm thanh (KWS), Thị giác máy tính 2D (VWW, IC), và Chuỗi thời gian công nghiệp (AD).",
                bookRef: "MLPerf Tiny Benchmark (Colby Banbury et al., NeurIPS 2021) Section 3"
            },
            {
                id: "m8_q2",
                title: "Đo Chu kỳ Xung nhịp Phần cứng Bằng Thanh Ghi CCOUNT trên Xtensa",
                question: "Để đo thời gian thực thi của một hàm suy luận nơ-ron với độ chính xác đến từng chu kỳ xung nhịp CPU (độ trễ nanosecond) mà không bị phụ thuộc vào độ trễ của hàm `esp_timer_get_time()`, kỹ sư nhúng đọc giá trị từ thanh ghi đặc biệt nào của nhân Xtensa?",
                options: [
                    "Thanh ghi trạng thái GPIO_IN_REG.",
                    "Thanh ghi đếm chu kỳ CPU Cycle Count (CCOUNT) thông qua lệnh hợp ngữ xthal_get_ccount() hoặc inline assembly 'rsr.ccount'.",
                    "Thanh ghi bộ chia xung nhịp APB_CLK_DIV.",
                    "Thanh ghi địa chỉ ngắt INTERRUPT_VECTOR_REG."
                ],
                correct: 1,
                explanation: "Nhân vi xử lý Xtensa LX7 tích hợp một thanh ghi nội tại 32-bit mang tên `CCOUNT`. Thanh ghi này tự động tăng thêm 1 sau mỗi chu kỳ xung nhịp CPU. Ở tần số 240 MHz, mỗi tick của CCOUNT tương ứng đúng $\\approx 4.16\\,\\text{ns}$. Bằng cách lấy hiệu số `CCOUNT_end - CCOUNT_start`, kỹ sư đo được chính xác 100% số lượng chu kỳ máy CPU đã tiêu tốn cho thuật toán.",
                bookRef: "Xtensa Instruction Set Architecture (ISA) Reference Manual & ESP-IDF Performance Measurement"
            },
            {
                id: "m8_q3",
                title: "Ma trận Nhầm lẫn & Đánh giá Dữ liệu Mất cân bằng (Class Imbalance)",
                question: "Trong đồ án phát hiện rung động bất thường của động cơ (Anomaly Detection), tập dữ liệu kiểm thử có 990 mẫu rung bình thường (Normal) và chỉ có 10 mẫu rung hỏng hóc (Anomaly). Một mô hình AI ngây thơ luôn dự đoán đầu ra là 'Bình thường' cho mọi trường hợp. Tại sao chỉ số Độ Chính Xác (Accuracy) trong tình huống này là một 'cái bẫy' nguy hiểm, và chỉ số nào phản ánh đúng chất lượng đồ án?",
                options: [
                    "Accuracy đạt 99% tạo cảm giác mô hình rất hoàn hảo, nhưng thực tế mô hình hoàn toàn vô dụng vì độ nhạy Recall với lớp hỏng hóc bằng 0% (bỏ sót 100% sự cố gây cháy nổ nhà máy). Các chỉ số khoa học bắt buộc sử dụng là Precision, Recall, F1-Score và Đường cong AUC-ROC.",
                    "Accuracy bị âm nên không thể vẽ biểu đồ được.",
                    "Accuracy chỉ áp dụng cho mô hình hồi quy tuyến tính, không áp dụng cho phân loại.",
                    "Không có vấn đề gì, Accuracy 99% luôn là tiêu chuẩn cao nhất để bảo vệ đồ án tốt nghiệp A+."
                ],
                correct: 0,
                explanation: "Khi dữ liệu bị lệch lớp nặng (Imbalanced Data), mô hình đoán mò lớp đa số sẽ đạt Accuracy cực cao (990/1000 = 99%) nhưng hoàn toàn thất bại trong việc phát hiện mục tiêu. Trong công nghiệp, việc bỏ sót 1 ca hỏng máy (False Negative) gây thiệt hại hàng triệu USD. Do đó, hội đồng chấm đồ án chuẩn IEEE luôn yêu cầu Ma trận nhầm lẫn (Confusion Matrix) và chỉ số F1-Score.",
                bookRef: "Scientific Machine Learning Evaluation & Confusion Matrix Analysis (IEEE Standards)"
            },
            {
                id: "m8_q4",
                title: "Kiểm Thử Ổn Định 24/7 & Heap Tracing (esp_heap_trace)",
                question: "Trước khi đem sản phẩm đồ án ra nghiệm thu trước hội đồng chuyên gia, làm thế nào để chứng minh hệ thống nhúng của bạn tuyệt đối không bị rò rỉ bộ nhớ (Memory Leak) dù chỉ 1 byte sau 24 giờ hoạt động liên tục?",
                options: [
                    "Khởi động lại chip mỗi 5 phút một lần để làm mới bộ nhớ.",
                    "Sử dụng công cụ theo dõi bộ nhớ Heap Tracing tích hợp của ESP-IDF (esp_heap_trace_start / esp_heap_trace_stop) để ghi lại địa chỉ con trỏ và mã nguồn của tất cả các hàm malloc() chưa được giải phóng bởi free(), đồng thời theo dõi chỉ số Free Heap và Minimum Ever Free Heap qua API esp_get_minimum_free_heap_size().",
                    "Chỉ cần kiểm tra thấy đèn LED trên bo mạch vẫn chớp nháy đều đặn là đủ.",
                    "Kiểm tra dung lượng file nhị phân .bin không tăng lên theo thời gian."
                ],
                correct: 1,
                explanation: "Chỉ số `esp_get_minimum_free_heap_size()` (Watermark của Heap) cho biết đáy bộ nhớ thấp nhất mà hệ thống từng chạm tới kể từ khi bật nguồn. Nếu sau 24 giờ chạy liên tục, chỉ số Free Heap ổn định ở một đường nằm ngang mà không bị dốc dần về 0, hệ thống được chứng minh khoa học là không có Memory Leak. `esp_heap_trace` giúp chỉ mặt đặt tên chính xác dòng code rò rỉ nếu có.",
                bookRef: "ESP-IDF Programming Guide (Heap Memory Debugging & Heap Tracing)"
            },
            {
                id: "m8_q5",
                title: "Tam Giác Kỹ Thuật Edge AI (Trade-Off Triangle)",
                question: "Trong thiết kế hệ thống nhúng Edge AI thương mại, 'Tam giác đánh đổi kỹ thuật' (Engineering Trade-Off Triangle) bao gồm ba yếu tố luôn xung đột và đòi hỏi kỹ sư phải tối ưu cân bằng là gì?",
                options: [
                    "Màu sắc vỏ hộp, Độ dài dây cáp và Nhiệt độ môi trường.",
                    "Độ Trễ / Tốc độ Suy luận (Latency / FPS), Dung lượng Bộ nhớ Chiếm dụng (Footprint RAM/Flash), và Độ Chính Xác của Mô hình (Model Accuracy).",
                    "Tần số Wi-Fi, Số lượng phím bấm và Độ phân giải màn hình LCD.",
                    "Số dòng mã nguồn C, Thời gian gõ phím và Phiên bản hệ điều hành máy tính."
                ],
                correct: 1,
                explanation: "Quy luật vàng của Edge AI: Tăng độ chính xác (Accuracy) đòi hỏi mạng nơ-ron sâu hơn và nhiều trọng số hơn -> làm phình to bộ nhớ (Footprint) và tăng thời gian tính toán (Latency). Để đưa vào chip nhúng giá rẻ $2-$3, kỹ sư phải dùng các kỹ thuật nén mô hình (Pruning, Quantization) để giảm tối đa kích thước và độ trễ mà sự sụt giảm độ chính xác nằm trong ngưỡng chấp nhận được của ứng dụng.",
                bookRef: "TinyML (Pete Warden, O'Reilly) Ch.2 & Embedded AI System Design Trade-Offs"
            }
        ]
    },

    // =========================================================================
    // MODULE 9: BẪY C KINH ĐIỂN KHI PHỎNG VẤN NHÚNG
    // =========================================================================
    {
        moduleIndex: 8,
        title: "Module 9: Bẫy C Kinh Điển Khi Phỏng Vấn Nhúng",
        stageDomain: "Core C Traps, Hardware Quirks & Interview Puzzles",
        icon: "💡",
        bookId: "book_iso_c11_standard",
        standardRef: "ISO/IEC 9899:2011 (C11 Standard) & Expert C Programming (Peter van der Linden)",
        badge: "Bẫy Phỏng Vấn C Chuyên Sâu",
        questions: [
            {
                id: "m9_q1",
                title: "Cơ chế biên dịch của từ khóa volatile và Bẫy Tối Ưu Hóa Compiler",
                question: "Xét đoạn mã C sau chạy trên vi điều khiển:\n```c\nuint8_t flag = 0;\nvoid IRAM_ATTR gpio_isr_handler(void *arg) { flag = 1; }\nvoid wait_for_event(void) {\n    while (flag == 0) { /* chờ */ }\n    do_action();\n}\n```\nKhi bật cờ tối ưu hóa `-O2` hoặc `-O3`, điều gì sẽ xảy ra với hàm `wait_for_event()` nếu biến `flag` KHÔNG được khai báo với từ khóa `volatile`?",
                options: [
                    "Chương trình chạy hoàn toàn bình thường không có lỗi gì.",
                    "Trình biên dịch nhận thấy trong thân vòng lặp while không có câu lệnh nào làm thay đổi biến flag, nên nó sẽ tối ưu hóa bằng cách tải giá trị flag vào một thanh ghi CPU 1 lần duy nhất trước vòng lặp và chuyển while thành lệnh nhảy vô tận (loop forever: bnez / beq). Do đó, dù ngắt ISR có chạy và đổi flag thành 1 trong RAM, CPU vẫn bị treo kẹt trong vòng lặp!",
                    "Trình biên dịch sẽ báo lỗi cú pháp Compiler Error vì ngắt không thể dùng chung biến với hàm thường.",
                    "Biến flag tự động bị xóa khỏi bộ nhớ RAM để tiết kiệm ô nhớ."
                ],
                correct: 1,
                explanation: "Đây là câu hỏi phỏng vấn số 1 tại tất cả các công ty nhúng (Bosch, Renesas, Qualcomm). Từ khóa `volatile` là lời chỉ thị dứt khoát cho Compiler Optimizer: 'Biến này có thể bị thay đổi bởi phần cứng hoặc một tiến trình ngắt ngoài tầm kiểm soát của trình biên dịch! Bắt buộc phải phát sinh lệnh đọc trực tiếp từ địa chỉ RAM vật lý mỗi lần biến được tham chiếu, cấm cache vào thanh ghi CPU'.",
                bookRef: "ISO/IEC 9899:2011 (C11) §6.7.3 & Expert C Programming Ch.8"
            },
            {
                id: "m9_q2",
                title: "Căn Lề Bộ Nhớ Struct Padding & Bẫy sizeof()",
                question: "Trên hệ thống vi điều khiển 32-bit (như Xtensa hoặc ARM Cortex-M), xét cấu trúc sau:\n```c\nstruct SensorData {\n    char status;     // 1 byte\n    int value;       // 4 bytes\n    short timestamp; // 2 bytes\n};\n```\nGiá trị của `sizeof(struct SensorData)` là bao nhiêu bytes, và tại sao lại có kết quả đó?",
                options: [
                    "7 bytes, vì 1 + 4 + 2 = 7 bytes đúng bằng tổng kích thước các thành phần.",
                    "12 bytes, do trình biên dịch chèn thêm 3 bytes padding sau status để int value căn lề 4-byte (bội số của 4), và chèn thêm 2 bytes tail-padding ở cuối sau timestamp để tổng kích thước struct là bội số của kiểu dữ liệu lớn nhất (4 bytes).",
                    "8 bytes, vì cấu trúc được tự động làm tròn về lũy thừa của 2.",
                    "16 bytes, vì tất cả các struct trong C luôn chiếm tối thiểu 16 bytes."
                ],
                correct: 1,
                explanation: "Quy tắc Struct Alignment: Một thành phần dữ liệu kích thước $K$ bytes phải bắt đầu tại địa chỉ chia hết cho $K$. Biến `status` ở byte 0; để `value` (4 bytes) bắt đầu tại địa chỉ chia hết cho 4, Compiler chèn 3 bytes rác (Padding) tại byte 1, 2, 3. `value` nằm ở byte 4-7. `timestamp` (2 bytes) nằm ở byte 8-9. Để mảng các struct này nằm liên tiếp hợp lệ, Compiler chèn thêm 2 bytes tail-padding (byte 10, 11). Tổng cộng: 12 bytes.",
                bookRef: "Expert C Programming: Deep C Secrets (Peter van der Linden) Ch.5 & C11 §6.7.2.1"
            },
            {
                id: "m9_q3",
                title: "Phân biệt Con trỏ Hằng vs Hằng Con trỏ (const pointer trap)",
                question: "Trong lập trình driver thanh ghi phần cứng nhúng, dòng khai báo nào sau đây định nghĩa chính xác một con trỏ trỏ tới một thanh ghi phần cứng Read-Only (ví dụ thanh ghi đọc trạng thái chân GPIO_IN_REG, không cho phép ghi đè giá trị qua con trỏ, nhưng bản thân con trỏ có thể trỏ sang thanh ghi khác)?",
                options: [
                    "const volatile uint32_t *reg_ptr;",
                    "volatile uint32_t * const reg_ptr;",
                    "const volatile uint32_t * const reg_ptr;",
                    "uint32_t const * volatile reg_ptr;"
                ],
                correct: 0,
                explanation: "Quy tắc đọc con trỏ ngược từ phải qua trái: `const volatile uint32_t *reg_ptr` là: 'reg_ptr là con trỏ trỏ tới một ô nhớ 32-bit volatile có nội dung là hằng số const (Read-Only)'. Cố gắng thực hiện `*reg_ptr = 5;` sẽ bị trình biên dịch chặn lại ngay. Trong khi đó, `uint32_t * const reg_ptr` là hằng con trỏ (địa chỉ cố định không đổi, nhưng nội dung có thể ghi được).",
                bookRef: "Expert C Programming (Peter van der Linden) Ch.3 & ISO C11 §6.7.3"
            },
            {
                id: "m9_q4",
                title: "Cạm bẫy Macro Tiền Xử Lý (Pre-processor Macro Traps)",
                question: "Xét định nghĩa macro sau:\n```c\n#define SQUARE(x) x * x\n```\nGiá trị của biểu thức `int result = SQUARE(2 + 3);` sau khi được biên dịch sẽ là bao nhiêu?",
                options: [
                    "25 (vì (2 + 3)^2 = 25).",
                    "11 (vì tiền xử lý thay thế chuỗi nguyên văn thành 2 + 3 * 2 + 3, theo thứ tự ưu tiên phép toán nhân chia trước cộng trừ sau: 2 + (3 * 2) + 3 = 2 + 6 + 3 = 11).",
                    "10.",
                    "Trình biên dịch báo lỗi cú pháp Macro."
                ],
                correct: 1,
                explanation: "Bộ tiền xử lý (Preprocessor) trong C chỉ thực hiện phép thay thế chuỗi ký tự cơ học thô (Text Replacement), hoàn toàn không có nhận thức về cú pháp toán học. Để viết Macro an toàn, tất cả các tham số và toàn bộ biểu thức macro bắt buộc phải được bao bọc trong dấu ngoặc đơn: `#define SQUARE(x) ((x) * (x))`, hoặc tốt hơn hết trong C hiện đại là dùng hàm `inline`.",
                bookRef: "Expert C Programming: Deep C Secrets Ch.1 & SEI CERT C PRE01-C"
            },
            {
                id: "m9_q5",
                title: "Tràn Số Nguyên Có Dấu (Signed Integer Overflow) & Undefined Behavior",
                question: "Theo chuẩn *ISO/IEC 9899:2011 (C11 Standard §6.5)*, điều gì sẽ xảy ra khi một biến số nguyên có dấu kiểu `int` bị tràn số (vượt quá giá trị `INT_MAX = 2,147,483,647`), và khác biệt gì so với số nguyên không dấu `unsigned int`?",
                options: [
                    "Số nguyên có dấu tự động quay vòng về INT_MIN theo quy tắc toán học bù 2 trong mọi trường hợp chuẩn hóa.",
                    "Tràn số nguyên có dấu là Hành Vi Bất Định (Undefined Behavior - UB); trình biên dịch GCC có quyền tối ưu loại bỏ hoàn toàn các câu lệnh kiểm tra điều kiện tràn số phía sau. Ngược lại, tràn số nguyên không dấu (unsigned int) được chuẩn định nghĩa rõ ràng là phép toán modulo 2^N (không bao giờ gây UB).",
                    "Cả hai kiểu đều kích hoạt ngắt phần cứng chia cho 0.",
                    "Chuẩn C11 cấm sử dụng số nguyên có dấu trong lập trình nhúng."
                ],
                correct: 1,
                explanation: "Rất nhiều kỹ sư nhúng lầm tưởng số có dấu sẽ luôn wrap-around về âm. Tuy nhiên theo chuẩn C11, Signed Overflow là Undefined Behavior. Nếu bạn viết `if (x + 1 < x) { handle_overflow(); }`, Compiler bật `-O2` sẽ tối ưu xóa bỏ luôn khối lệnh `if` vì chuẩn cho rằng `x + 1` không bao giờ nhỏ hơn `x`! Muốn tính toán an toàn vòng tròn, chuẩn MISRA C và SEI CERT C bắt buộc dùng `uint32_t`.",
                bookRef: "ISO/IEC 9899:2011 §6.5 & SEI CERT C INT32-C (Ensure that operations on signed integers do not result in overflow)"
            }
        ]
    },

    // =========================================================================
    // MODULE 10: KIẾN TRÚC VI XỬ LÝ & LẬP TRÌNH THANH GHI
    // =========================================================================
    {
        moduleIndex: 9,
        title: "Module 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi",
        stageDomain: "Bare-Metal Registers, NVIC & Microcontroller Architecture",
        icon: "⚙️",
        bookId: "book_esps3_trm",
        standardRef: "ESP32-S3 TRM Ch.5 (IO MUX) & Ch.1 (System Architecture)",
        badge: "Lập Trình Bare-Metal & Thanh Ghi Trần",
        questions: [
            {
                id: "m10_q1",
                title: "Thanh Ghi Nguyên Tử W1TS / W1TC vs Phép Đọc-Sửa-Ghi (Read-Modify-Write)",
                question: "Trong lập trình thanh ghi trần (Bare-metal) điều khiển GPIO trên vi điều khiển ESP32-S3, tại sao việc xuất mức HIGH cho một chân GPIO bắt buộc phải ghi vào thanh ghi `GPIO_OUT_W1TS_REG` (Write-1-to-Set) thay vì thực hiện phép toán `GPIO_OUT_REG |= (1 << pin)`?",
                options: [
                    "Vì ghi W1TS giúp tăng điện áp của chân GPIO từ 3.3V lên 5V.",
                    "Vì phép toán |= là thao tác phi nguyên tử gồm 3 bước riêng biệt (Đọc -> Sửa bit -> Ghi lại). Nếu giữa bước Đọc và Ghi xuất hiện một hàm ngắt ISR cũng thay đổi một chân GPIO khác trên cùng thanh ghi, giá trị của chân đó sẽ bị ghi đè làm sai lệch trạng thái (Race Condition). Thanh ghi W1TS ghi bằng 1 lệnh nguyên tử cấp phần cứng duy nhất mà không ảnh hưởng bất kỳ chân nào khác.",
                    "Vì thanh ghi GPIO_OUT_REG chỉ cho phép đọc, không thể ghi được.",
                    "Vì W1TS tự động kích hoạt tính năng kéo trở nội bộ Pull-up."
                ],
                correct: 1,
                explanation: "Thanh ghi phần cứng W1TS (Write-1-to-Set) và W1TC (Write-1-to-Clear) là tinh hoa thiết kế vi điều khiển hiện đại. Khi ghi giá trị `(1 << 4)` vào `GPIO_OUT_W1TS_REG`, phần cứng chỉ tác động set đúng bit 4 lên HIGH; các bit ghi số 0 hoàn toàn không bị ảnh hưởng. Thao tác này là Atomic (Nguyên tử), an toàn tuyệt đối khi đa nhiệm và ngắt cùng can thiệp vào GPIO.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.5 (IO MUX and GPIO Matrix)"
            },
            {
                id: "m10_q2",
                title: "Quy trình Khởi động Vi điều khiển: Reset Handler & Startup Code",
                question: "Trình tự các bước thực thi vật lý chuẩn xác của vi điều khiển từ thời điểm chân RESET được nhả điện áp đến khi nhảy vào hàm `app_main()` trong C là gì?",
                options: [
                    "Nhảy thẳng vào app_main() -> Khởi tạo bộ nhớ RAM -> Chạy Bootloader.",
                    "ROM Bootloader nạp từ Mask ROM -> Kiểm tra chân BOOT strap -> Nạp 2nd Stage Bootloader từ Flash vào IRAM -> Thiết lập MMU Cache Flash -> Reset Handler chạy mã Startup ASM để khởi tạo thanh ghi con trỏ Stack Pointer (SP), sao chép phân vùng .data từ Flash vào RAM, xóa trắng phân vùng .bss về 0 -> Khởi tạo C Runtime -> Gọi app_main().",
                    "Khởi động Wi-Fi trước -> Nạp hệ điều hành FreeRTOS -> Kiểm tra kết nối mạng -> Chạy hàm main().",
                    "Thực thi trực tiếp file mã nguồn C từ ổ đĩa máy tính thông qua cáp nạp UART."
                ],
                correct: 1,
                explanation: "Hiểu sâu quy trình khởi động là phẩm chất hàng đầu của Senior Firmware Engineer. Khi reset, CPU chưa hề có C Runtime: Con trỏ Stack chưa trỏ đúng, biến toàn cục chưa có giá trị, biến bss còn chứa dữ liệu rác. Đoạn mã Startup Assembly ngắn do nhà sản xuất cung cấp phải thiết lập phần cứng cơ bản trước, sau đó mới trao quyền cho hàm `main()`.",
                bookRef: "ESP32-S3 TRM Ch.8 (Chip Boot Control) & Linker Script Architecture"
            },
            {
                id: "m10_q3",
                title: "Cấu trúc Phân vùng Bộ nhớ Linker Script (.ld): .text, .rodata, .data, .bss",
                question: "Trong file liên kết Linker Script (`.ld`), các biến toàn cục được khởi tạo với giá trị ban đầu khác không (ví dụ `int g_sensor_rate = 100;`) và biến chưa khởi tạo (ví dụ `int g_raw_buffer[1024];`) được phân bổ vào các phân vùng bộ nhớ nào tương ứng?",
                options: [
                    "g_sensor_rate nằm trong .rodata; g_raw_buffer nằm trong .text.",
                    "g_sensor_rate nằm trong phân vùng .data (vừa lưu giá trị khởi tạo trong Flash vừa chiếm ô nhớ trong RAM); g_raw_buffer nằm trong phân vùng .bss (chỉ chiếm dung lượng trong RAM và không tốn dung lượng file nhị phân Flash vì được startup code xóa về 0).",
                    "Cả hai biến đều nằm trong phân vùng .text của bộ nhớ Flash.",
                    "Cả hai biến đều nằm trên vùng nhớ Heap của hệ điều hành."
                ],
                correct: 1,
                explanation: "Phân vùng `.bss` (Block Started by Symbol) là một thiết kế thông minh trong khoa học máy tính: Để tiết kiệm dung lượng file firmware `.bin` nạp vào Flash, tất cả các biến toàn cục không khởi tạo (mặc định = 0) chỉ được khai báo kích thước trong header; khi chip khởi động, vòng lặp trong mã Startup chỉ cần gọi `memset(&_bss_start, 0, &_bss_end - &_bss_start)`.",
                bookRef: "Linker and Loaders (John R. Levine) & GNU ld Linker Script Manual"
            },
            {
                id: "m10_q4",
                title: "Ma trận Bus Nội Bộ (Bus Matrix) & Bộ Trọng Tài Phân Xử Bus (Arbiter)",
                question: "Cơ chế nào bên trong vi điều khiển ESP32-S3 cho phép bộ điều khiển DMA nạp dữ liệu từ I2S vào một ngân hàng RAM (SRAM Bank 0) trong khi CPU Xtensa đồng thời đọc dữ liệu tính toán AI từ ngân hàng RAM khác (SRAM Bank 1) mà không làm nghẽn bus?",
                options: [
                    "Hệ thống Bus Matrix đa tầng (Multi-Layer Internal Bus Matrix) kết hợp bộ trọng tài phân xử Round-Robin Arbiter, cho phép nhiều Master (CPU Core 0, CPU Core 1, DMA) truy cập đồng thời vào các Slave độc lập khác nhau mà không gây xung đột xung nhịp.",
                    "Vi điều khiển tự động nhân đôi tần số thạch anh bên ngoài.",
                    "DMA sử dụng mạng không dây nội bộ bên trong die silicon của chip.",
                    "Dữ liệu được nén lại bằng thuật toán Huffman trước khi truyền qua bus."
                ],
                correct: 0,
                explanation: "Bus Matrix là 'ngã tư giao thông' trung tâm của vi điều khiển. Khác với bus đơn truyền thống (nơi tại một thời điểm chỉ có 1 thiết bị được truyền), Bus Matrix đa tầng cho phép nhiều kết nối song song độc lập cùng tồn tại: CPU có thể làm việc trên Bank A trong khi DMA chuyển dòng âm thanh trên Bank B hoàn toàn không nghẽn tốc độ.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.1 (System and Memory Architecture)"
            },
            {
                id: "m10_q5",
                title: "Kiến trúc Đường Ống (Pipeline) & Hiện Tượng Xả Ống (Pipeline Flush)",
                question: "Trong kiến trúc vi xử lý Xtensa LX7 (Pipeline 7 tầng), hiện tượng 'Pipeline Flush' (Xả rỗng đường ống lệnh) xảy ra khi nào và gây ảnh hưởng gì tới hiệu năng thực thi thuật toán?",
                options: [
                    "Xảy ra khi chip bị quá nhiệt; CPU tự giảm xung nhịp để làm mát.",
                    "Xảy ra khi gặp các lệnh rẽ nhánh điều kiện (như if-else, switch-case, vòng lặp) mà phán đoán nhánh (Branch Prediction) bị sai; CPU buộc phải hủy bỏ toàn bộ các lệnh đang được nạp dở trong 7 tầng pipeline và nạp lại từ địa chỉ mới, gây lãng phí nhiều chu kỳ xung nhịp và làm tụt thông lượng xử lý của mô hình AI.",
                    "Xảy ra khi bộ nhớ Flash SPI bị mất điện áp.",
                    "Xảy ra khi vi điều khiển hoàn thành một phép tính căn bậc hai."
                ],
                correct: 1,
                explanation: "Pipeline hoạt động như một dây chuyền lắp ráp xe hơi: Mỗi chu kỳ hoàn thành 1 công đoạn của 1 lệnh. Khi gặp lệnh rẽ nhánh không dự đoán được, CPU đã lỡ nạp các lệnh sai vào ống; khi phát hiện nhánh rẽ thực tế khác với dự đoán, toàn bộ dây chuyền phải bị hủy rỗng (Flush) và bắt đầu lại từ đầu. Đó là lý do trong TinyML, mã nguồn C luôn hạn chế tối đa các lệnh `if/else` phân nhánh ngẫu nhiên bên trong vòng lặp tích chập.",
                bookRef: "Computer Architecture: A Quantitative Approach (Hennessy & Patterson) & Xtensa ISA"
            }
        ]
    },

    // =========================================================================
    // MODULE 11: DEBUG THỰC TẾ & THIẾT BỊ ĐO KIỂM PHÒNG LAB
    // =========================================================================
    {
        moduleIndex: 10,
        title: "Module 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        stageDomain: "Hardware Oscilloscope, Logic Analyzer & GDB JTAG",
        icon: "🔍",
        bookId: "book_esps3_trm",
        standardRef: "ESP-IDF Panic Handler Guide & IEEE 1149.1 Standard (JTAG Architecture)",
        badge: "Kỹ Năng Debug & Thiết Bị Đo Kiểm Chuyên Sâu",
        questions: [
            {
                id: "m11_q1",
                title: "Giải mã Guru Meditation Error: LoadProhibited vs StoreProhibited",
                question: "Khi vi điều khiển ESP32-S3 bị crash và in ra dòng thông báo lỗi sau trên màn hình terminal Serial:\n`Guru Meditation Error: Core 1 panic'ed (LoadProhibited). Exception was unhandled.`\n`EXCVADDR: 0x00000000`\nÝ nghĩa kỹ thuật chính xác của lỗi này là gì?",
                options: [
                    "Điện áp cấp cho vi điều khiển bị sụt xuống 0V.",
                    "Một hàm thực thi trên Core 1 đã cố gắng giải tham chiếu đọc dữ liệu (Load) thông qua một con trỏ NULL (địa chỉ 0x00000000), kích hoạt bộ bảo vệ truy cập bộ nhớ phần cứng.",
                    "Bộ nhớ Flash SPI bị cháy không thể nạp chương trình.",
                    "Tần số xung nhịp của CPU bị giảm về 0 Hz."
                ],
                correct: 1,
                explanation: "`LoadProhibited` nghĩa là CPU cố nạp dữ liệu từ một địa chỉ bộ nhớ cấm/không hợp lệ; `EXCVADDR` (Exception Virtual Address) in ra địa chỉ vi phạm. Giá trị `0x00000000` là dấu hiệu kinh điển của việc truy xuất con trỏ NULL: ví dụ `ptr = NULL; int val = *ptr;`. Tương tự, `StoreProhibited` xảy ra khi cố ghi dữ liệu vào con trỏ NULL hoặc vùng nhớ chỉ đọc (Read-Only).",
                bookRef: "ESP-IDF Programming Guide (Fatal Errors & Panic Handler Diagnostics)"
            },
            {
                id: "m11_q2",
                title: "Truy vết Crash Dump bằng công cụ addr2line",
                question: "Khi ESP32 bị crash, màn hình Serial in ra chuỗi Backtrace dạng các địa chỉ hex:\n`Backtrace: 0x4200a120:0x3fc92040 0x4200b344:0x3fc92070 ...`\nLàm thế nào một kỹ sư nhúng có thể dịch các con số hex này thành tên file `.c` và số dòng lệnh chính xác gây ra lỗi sập nguồn?",
                options: [
                    "Tra cứu địa chỉ hex này trong sách hướng dẫn sử dụng vi điều khiển.",
                    "Sử dụng công cụ chuỗi công cụ GNU xtensa-esp32s3-elf-addr2line kết hợp với file ký hiệu gỡ lỗi firmware.elf: xtensa-esp32s3-elf-addr2line -pfia -e build/app.elf 0x4200a120.",
                    "Mở file nhị phân .bin bằng phần mềm Notepad để tìm kiếm văn bản tương ứng.",
                    "Nạp lại mã nguồn với mức baudrate 9600 để chip tự dịch ra tiếng Việt."
                ],
                correct: 1,
                explanation: "File `build/app.elf` chứa toàn bộ bảng ký hiệu DWARF (Debug Symbols) ánh xạ từng địa chỉ ô nhớ trong file nhị phân với từng dòng mã nguồn C trên máy tính lập trình. Tiện ích `addr2line` đọc file ELF này và giải mã tức thì địa chỉ `0x4200a120` thành `main/ai_model.c:142`, chỉ thẳng vào dòng code làm crash CPU.",
                bookRef: "ESP-IDF Programming Guide (Fatal Errors - Stack Dump & addr2line)"
            },
            {
                id: "m11_q3",
                title: "Giao thức Gỡ lỗi Phần cứng JTAG (IEEE 1149.1) & Hardware Breakpoint",
                question: "Giao thức gỡ lỗi phần cứng chuẩn công nghiệp JTAG (IEEE 1149.1) sử dụng 4 đường tín hiệu cơ bản nào, và sự khác biệt giữa Hardware Breakpoint và Software Breakpoint trong GDB là gì?",
                options: [
                    "4 đường gồm TX, RX, VCC, GND; Breakpoint luôn làm dừng cấp điện cho CPU.",
                    "4 đường gồm TCK (Test Clock), TMS (Test Mode Select), TDI (Test Data In), TDO (Test Data Out). Hardware Breakpoint sử dụng bộ so sánh địa chỉ phần cứng tích hợp sẵn trong silicon CPU nên đặt được trên cả bộ nhớ Flash ROM Read-Only; trong khi Software Breakpoint phải ghi đè lệnh đặc biệt (như TRAP / ILL) vào bộ nhớ RAM nên không thể đặt trên Flash chưa map ghi.",
                    "4 đường gồm SDA, SCL, MOSI, MISO; Hardware Breakpoint chạy chậm hơn Software Breakpoint.",
                    "JTAG là giao thức không dây kết nối qua Bluetooth Low Energy."
                ],
                correct: 1,
                explanation: "IEEE 1149.1 JTAG là chuẩn gỡ lỗi phần cứng tối cao. Trên vi xử lý Xtensa, bộ so sánh phần cứng (Hardware Watch/Breakpoint Unit) cho phép kỹ sư dừng CPU tại bất kỳ địa chỉ nào trong Flash mà không cần thay đổi file nhị phân. Khi breakpoint kích hoạt qua OpenOCD/GDB, CPU đóng băng mọi thanh ghi cho phép thanh tra ô nhớ và từng biến runtime.",
                bookRef: "IEEE 1149.1 Standard Test Access Port & Boundary-Scan Architecture (JTAG)"
            },
            {
                id: "m11_q4",
                title: "Kỹ thuật Dò tìm Hỏng Bộ nhớ Bằng GDB Watchpoint",
                question: "Trong tình huống hiểm hóc: Một biến cấu hình quan trọng trong hệ thống nhúng bị ghi đè dữ liệu ngẫu nhiên (Memory Corruption) làm sai lệch tham số sau vài phút chạy, nhưng không ai biết hàm nào hay Task nào đã gây ra việc này. Kỹ thuật debug hiệu quả nhất trong GDB là gì?",
                options: [
                    "Đặt lệnh printf ở tất cả các dòng lệnh trong dự án.",
                    "Thiết lập một Hardware Watchpoint trong GDB thông qua lệnh: 'watch g_system_config' (hoặc rwatch / awatch). Phần cứng CPU sẽ tự động đóng băng thực thi ngay tại chu kỳ máy nào phát sinh lệnh ghi vào địa chỉ của biến này, hiển thị ngay lập tức tên hàm và dòng lệnh thủ phạm.",
                    "Format lại toàn bộ bộ nhớ Flash của thiết bị.",
                    "Tăng điện trở kéo lên của bus I2C."
                ],
                correct: 1,
                explanation: "Hardware Watchpoint là vũ khí tối thượng trị lỗi Heisenbug (lỗi xuất hiện ngẫu nhiên khi chạy thật nhưng biến mất khi cắm debug). Khi đặt Watchpoint, vi xử lý giám sát bus địa chỉ; bất kỳ lệnh `STORE` nào chạm vào dải địa chỉ của biến mục tiêu sẽ kích hoạt ngắt Debug Exception ngay lập tức trước khi dữ liệu bị phá hoại tiếp.",
                bookRef: "Debugging with GDB: The GNU Source-Level Debugger (Richard Stallman et al.)"
            },
            {
                id: "m11_q5",
                title: "Sử dụng Máy Phân Tích Logic (Logic Analyzer) Xác Định Baudrate UART",
                question: "Khi kết nối máy phân tích logic (Logic Analyzer) vào một đường truyền UART từ một cảm biến công nghiệp không rõ tài liệu, làm thế nào để xác định chính xác tốc độ Baud Rate của thiết bị?",
                options: [
                    "Đếm tổng số xung trong vòng 1 giờ rồi chia cho 3600.",
                    "Tìm xung có độ rộng thời gian hẹp nhất (Shortest Pulse Width - T_min) trên giản đồ dạng sóng (đại diện cho 1 bit truyền dữ liệu đơn lẻ); tốc độ Baud Rate được tính theo công thức: Baudrate = 1 / T_min.",
                    "Đo biên độ điện áp đỉnh của xung rồi nhân với 1000.",
                    "Tốc độ Baudrate luôn cố định là 115200 không cần đo đạc."
                ],
                correct: 1,
                explanation: "Trong chuẩn UART truyền bất đồng bộ, dữ liệu được truyền đi dưới dạng các bit có độ dài thời gian bằng nhau $T_{\\text{bit}}$. Xung hẹp nhất trên đường tín hiệu đại diện cho 1 bit đơn lẻ (ví dụ một chuỗi `10101...`). Nếu đo được xung hẹp nhất là $T_{\\text{min}} = 104.16\\,\\mu\\text{s}$, ta tính được: $\\text{Baud} = 1 / 104.16\\,\\mu\\text{s} \\approx 9600\\,\\text{bps}$. Nếu $T_{\\text{min}} = 8.68\\,\\mu\\text{s}$, ta có $\\text{Baud} = 115200\\,\\text{bps}$.",
                bookRef: "Digital Signal Analysis & Hardware Logic Analyzer Practical Guide"
            }
        ]
    },

    // =========================================================================
    // MODULE 12: CHUẨN AN TOÀN PHẦN MỀM Ô TÔ MISRA C
    // =========================================================================
    {
        moduleIndex: 11,
        title: "Module 12: Chuẩn An Toàn Phần Mềm Ô Tô MISRA C",
        stageDomain: "Automotive Safety, MISRA C:2012 & Static Analysis",
        icon: "🛡️",
        bookId: "book_misra_c",
        standardRef: "MISRA C:2012 Guidelines for the Use of the C Language in Critical Systems",
        badge: "Chuẩn An Toàn Ô Tô & Phân Tích Mã Tĩnh",
        questions: [
            {
                id: "m12_q1",
                title: "MISRA C:2012 Rule 21.3: Cấm Tuyệt Đối Cấp Phát Động",
                question: "Quy tắc bắt buộc MISRA C:2012 Rule 21.3 (Required) quy định: 'The memory allocation and deallocation functions of <stdlib.h> shall not be used' (Nghiêm cấm sử dụng `malloc`, `calloc`, `realloc`, `free`). Tại sao trong các hệ thống an toàn sinh mạng ô tô (Automotive ASIL-D / ISO 26262), việc cấm cấp phát động lại là tiêu chuẩn bất khả kháng?",
                options: [
                    "Vì hàm malloc() tiêu thụ quá nhiều điện năng của ắc quy xe hơi.",
                    "Vì cấp phát động chứa đựng 4 nguy cơ thảm họa không thể chứng minh toán học: Rò rỉ bộ nhớ (Memory Leak), phân mảnh bộ nhớ (Fragmentation) gây sập hệ thống bất ngờ, hành vi bất định khi malloc trả về NULL trong tình huống khẩn cấp, và thời gian thực thi của malloc/free là không xác định (Non-Deterministic Latency) vi phạm yêu cầu thời gian thực ngặt nghèo của phanh xe/túi khí.",
                    "Vì ngôn ngữ C không có thư viện stdlib.h trên vi điều khiển ô tô.",
                    "Vì tiêu chuẩn MISRA C bắt buộc phải viết toàn bộ phần mềm bằng hợp ngữ Assembly."
                ],
                correct: 1,
                explanation: "Trong hệ thống an toàn tối cao (phanh ABS, trợ lực lái tử huyệt, động cơ xe hơi), phần mềm phải chứng minh được hành vi 100% tất định (Deterministic). Việc dùng `malloc()` có thể hoạt động tốt lúc chạy thử, nhưng sau 100 giờ chạy, phân mảnh ô nhớ có thể khiến xe không thể mở van thắng khi tài xế đạp phanh khẩn cấp! Cấp phát tĩnh là luật sống còn.",
                bookRef: "MISRA C:2012 Guidelines Rule 21.3 & ISO 26262 Part 6 (Software Safety)"
            },
            {
                id: "m12_q2",
                title: "MISRA C:2012 Rule 17.2: Cấm Đệ Quy (Recursion)",
                question: "Quy tắc MISRA C:2012 Rule 17.2 quy định: 'Functions shall not call themselves, either directly or indirectly' (Cấm tuyệt đối hàm đệ quy). Nguyên nhân cốt lõi về mặt an toàn kiến trúc hệ thống là gì?",
                options: [
                    "Vì đệ quy khiến kích thước file thực thi .hex lớn gấp nhiều lần.",
                    "Vì đệ quy khiến độ sâu tiêu tốn bộ nhớ Stack phụ thuộc vào dữ liệu đầu vào trong runtime, dẫn đến việc không thể tính toán và chứng minh giới hạn trên của bộ nhớ Stack (Upper-bounded Stack Footprint) bằng công cụ phân tích tĩnh, tạo nguy cơ tràn Stack làm sập ECU ô tô bất cứ lúc nào.",
                    "Vì trình biên dịch C không hỗ trợ gọi lại chính hàm đó.",
                    "Vì đệ quy chỉ dùng được trên hệ thống máy tính lượng tử."
                ],
                correct: 1,
                explanation: "Để được cấp chứng chỉ an toàn ISO 26262 ASIL-D, kỹ sư phần mềm phải nộp báo cáo Static Worst-Case Stack Usage chứng minh rằng trong mọi kịch bản xấu nhất, tổng dung lượng Stack sử dụng không bao giờ vượt quá vùng RAM được cấp. Khi có đệ quy, việc tính toán giới hạn trên về mặt toán học là bất khả thi (tương tự bài toán Halting Problem).",
                bookRef: "MISRA C:2012 Rule 17.2 (Functions shall not call themselves) & ISO 26262-6"
            },
            {
                id: "m12_q3",
                title: "MISRA C:2012 Rule 11.4: Hạn Chế Ép Kiểu Con Trỏ",
                question: "Theo MISRA C:2012 Rule 11.4 (Advisory): 'A conversion should not be performed between a pointer to object and an integer type', hành động ép kiểu giữa con trỏ ô nhớ và số nguyên (ví dụ: `uint32_t addr = (uint32_t)ptr;`) bị hạn chế vì rủi ro nào?",
                options: [
                    "Vì số nguyên luôn có kích thước lớn hơn con trỏ.",
                    "Vì kích thước con trỏ phụ thuộc vào kiến trúc phần cứng (32-bit hoặc 64-bit); nếu ép kiểu sang kiểu số nguyên không đủ độ rộng (ví dụ int trên hệ 64-bit) sẽ làm mất bit địa chỉ, gây lỗi truy cập bộ nhớ nghiêm trọng khi porting mã nguồn sang nền tảng vi điều khiển khác. Chuẩn chỉ cho phép dùng kiểu uintptr_t khi thực sự bắt buộc trong mã nguồn HAL.",
                    "Vì trình biên dịch sẽ tự động đổi địa chỉ ô nhớ sang số âm.",
                    "Vì số nguyên không thể lưu trữ được trên thanh ghi CPU."
                ],
                correct: 1,
                explanation: "Việc hoán chuyển tùy tiện giữa con trỏ và số nguyên là ổ rệp tiềm tàng của các lỗi bảo mật và khả năng tương thích phần cứng. MISRA C yêu cầu nếu bắt buộc phải thao tác với địa chỉ phần cứng trần trong các lớp Driver, kỹ sư phải sử dụng kiểu dữ liệu tiêu chuẩn `uintptr_t` được định nghĩa trong `<stdint.h>` và viết tài liệu biện giải ngoại lệ (Deviation Justification).",
                bookRef: "MISRA C:2012 Rule 11.4 & SEI CERT C INT36-C"
            },
            {
                id: "m12_q4",
                title: "Tiêu Chuẩn An Toàn Chức Năng Ô Tô ISO 26262 & Cấp Độ ASIL-D",
                question: "Trong tiêu chuẩn an toàn chức năng ô tô ISO 26262, mức độ toàn vẹn an toàn ô tô cao nhất (Automotive Safety Integrity Level) được ký hiệu là gì, và nó đòi hỏi quy trình phát triển phần mềm phải đạt được những tiêu chí kiểm thử nào?",
                options: [
                    "ASIL-A; chỉ cần kiểm tra mã nguồn bằng mắt.",
                    "ASIL-D; đòi hỏi 100% tuân thủ MISRA C, quy trình kiểm thử đơn vị Unit Test đạt 100% độ bao phủ cấu trúc phân nhánh và điều kiện kép MC/DC (Modified Condition/Decision Coverage), cùng phân tích lỗi tĩnh Static Analysis không có ngoại lệ.",
                    "ISO-9001; chỉ cần tài liệu hướng dẫn sử dụng chi tiết.",
                    "ASIL-E; chỉ áp dụng cho động cơ tên lửa không gian."
                ],
                correct: 1,
                explanation: "ISO 26262 phân cấp rủi ro an toàn từ ASIL-A (thấp nhất, ví dụ đèn trần) đến ASIL-D (cao nhất, ví dụ hệ thống phanh điện tử Brake-by-Wire, túi khí, lái tự động ADAS). Tại cấp độ ASIL-D, việc kiểm thử phần mềm phải chứng minh đạt 100% tiêu chí MC/DC (Modified Condition/Decision Coverage) - kiểm tra độc lập từng điều kiện logic trong câu lệnh `if`.",
                bookRef: "ISO 26262-6:2018 (Road vehicles - Functional safety - Product development at the software level)"
            },
            {
                id: "m12_q5",
                title: "Tích Hợp Phân Tích Mã Tĩnh (Static Code Analysis: Cppcheck & Clang-Tidy)",
                question: "Vai trò cốt lõi của công cụ Phân tích mã tĩnh (Static Code Analysis Tool) như Cppcheck hoặc Clang-Tidy trong dây chuyền sản xuất phần mềm nhúng hiện đại là gì?",
                options: [
                    "Tự động viết code thay cho kỹ sư lập trình.",
                    "Quét và thanh tra toàn bộ cây cú pháp trừu tượng (Abstract Syntax Tree - AST) của mã nguồn C trước khi biên dịch nhằm phát hiện sớm các lỗi rò rỉ bộ nhớ, biến chưa khởi tạo, vi phạm quy tắc MISRA C, con trỏ NULL và mã chết (Dead Code) mà trình biên dịch thông thường bỏ sót, giảm thiểu 80% chi phí sửa lỗi phần mềm.",
                    "Chạy thử nghiệm phần mềm trên đường cao tốc ảo.",
                    "Tự động tăng tốc độ xử lý của vi điều khiển lên 200%."
                ],
                correct: 1,
                explanation: "Sửa lỗi lúc viết code rẻ hơn 100 lần so với sửa lỗi khi xe đã xuất xưởng lăn bánh trên đường. Các công cụ Static Analysis đọc mã nguồn và phân tích luồng dữ liệu (Dataflow Analysis) mà không cần chạy code, lập tức cảnh báo các lỗi tinh vi như: Quên kiểm tra con trỏ NULL sau khi gọi hàm, vi phạm căn lề bộ nhớ, hoặc rủi ro tràn số nguyên.",
                bookRef: "MISRA C:2012 Guidelines & Automated Software Quality Engineering"
            }
        ]
    },

    // =========================================================================
    // MODULE 13: GIAO TIẾP CÔNG NGHIỆP (CAN BUS & MODBUS)
    // =========================================================================
    {
        moduleIndex: 12,
        title: "Module 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        stageDomain: "Industrial Fieldbuses, CAN 2.0B / CAN FD & RS485 Modbus",
        icon: "🚗",
        bookId: "book_can_iso11898",
        standardRef: "ISO 11898-1:2015 Road Vehicles - Controller Area Network (CAN) & Modbus IDA",
        badge: "Mạng Truyền Thông Ô Tô & Công Nghiệp",
        questions: [
            {
                id: "m13_q1",
                title: "Cơ Chế Phân Xử Bus Không Phá Hủy (Non-Destructive Bitwise Arbitration)",
                question: "Theo chuẩn quốc tế *ISO 11898-1 (CAN Bus Specification)*, khi hai hộp điều khiển ECU trên ô tô cùng lúc phát tín hiệu lên mạng CAN, cơ chế phân xử bit (Bitwise Arbitration) xác định nút nào được quyền tiếp tục truyền dựa trên nguyên lý vật lý nào?",
                options: [
                    "Nút nào gửi gói tin có kích thước lớn hơn sẽ được ưu tiên truyền trước.",
                    "Bus CAN hoạt động theo nguyên lý logic 'AND nối dây' (Wired-AND): Bit 0 là bit Thống trị (Dominant), bit 1 là bit Thụ động (Recessive). Khi hai nút cùng phát, nút nào phát bit 1 mà đọc lại đường truyền thấy bit 0 sẽ nhận diện mình thua cuộc và tự động rút lui ngay lập tức mà không làm hỏng gói tin của nút thắng. Do đó, CAN ID có giá trị số càng nhỏ thì mức độ ưu tiên càng cao.",
                    "Bộ định tuyến trung tâm sẽ gửi tín hiệu ngắt để dừng nút phát chậm hơn.",
                    "Cả hai gói tin cùng bị hủy bỏ và hai nút phải chờ một khoảng thời gian ngẫu nhiên theo chuẩn Ethernet CSMA/CD."
                ],
                correct: 1,
                explanation: "Đây là nguyên lý thiên tài làm nên sự thống trị của mạng CAN trên ô tô từ năm 1986. Do trạng thái Dominant (0) đè bẹp trạng thái Recessive (1) trên đường truyền vi sai CANH/CANL, quá trình phân xử diễn ra 'không phá hủy' (Non-destructive): Gói tin có ID số nhỏ hơn (ví dụ 0x010 của hệ thống phanh) tiếp tục được truyền trơn tru mà không mất dù chỉ 1 micro-giây!",
                bookRef: "ISO 11898-1:2015 Road Vehicles - CAN Section 8 (Bus Arbitration Mechanics)"
            },
            {
                id: "m13_q2",
                title: "Quy Tắc Nhồi Bit (Bit Stuffing) & Trường Khung Tin CAN Frame",
                question: "Quy tắc nhồi bit (Bit Stuffing) trong chuẩn CAN 2.0B quy định rằng: Khi bộ điều khiển CAN phát hiện chuỗi bao nhiêu bit liên tiếp có cùng một trạng thái logic (ví dụ 5 bit 1 liên tiếp hoặc 5 bit 0 liên tiếp), nó sẽ tự động chèn thêm một bit đảo trạng thái ngược lại, và mục đích của việc này là gì?",
                options: [
                    "5 bit liên tiếp; mục đích là tạo ra các cạnh chuyển mức tín hiệu (Signal Edge Transitions) đều đặn trên đường truyền vi sai giúp bộ thu ở tất cả các nút trên xe tự động đồng bộ lại xung nhịp đồng hồ (Clock Resynchronization).",
                    "8 bit liên tiếp; mục đích là mã hóa bảo mật chống đánh cắp dữ liệu.",
                    "10 bit liên tiếp; mục đích là báo hiệu kết thúc gói tin.",
                    "3 bit liên tiếp; mục đích là tăng gấp đôi tốc độ truyền dữ liệu."
                ],
                correct: 0,
                explanation: "Vì đường bus CAN không có dây truyền xung clock riêng biệt (dùng 2 dây vi sai CANH và CANL để tiết kiệm dây và giảm nhiễu), các nút nhận phải tự trích xuất xung clock dựa vào các cạnh lên/xuống của tín hiệu. Nếu một gói tin truyền một chuỗi toàn bit 0 hoặc toàn bit 1, bộ đếm thời gian của các nút sẽ bị lệch pha do sai số thạch anh. Quy tắc nhồi bit sau mỗi 5 bit đồng nhất đảm bảo luôn có cạnh xung để đồng bộ lại.",
                bookRef: "ISO 11898-1:2015 Section 10 (Bit Stuffing & Synchronization Mechanisms)"
            },
            {
                id: "m13_q3",
                title: "Bộ Lọc Chấp Nhận Phần Cứng (Hardware Acceptance Filter) trên TWAI ESP32-S3",
                question: "Vi điều khiển ESP32-S3 tích hợp bộ điều khiển mạng TWAI (Two-Wire Automotive Interface, tương thích chuẩn CAN 2.0B). Tại sao việc cấu hình bộ lọc chấp nhận phần cứng (Acceptance Code và Acceptance Mask) lại mang tính sống còn đối với hiệu năng của hệ thống nhúng?",
                options: [
                    "Vì bộ lọc phần cứng giúp giảm điện áp trên bus từ 5V xuống 3.3V.",
                    "Vì trên mạng ô tô có hàng trăm gói tin phát liên tục mỗi giây; bộ lọc phần cứng tự động kiểm tra ID của gói tin và chỉ cho phép những gói tin có ID liên quan đến chức năng của thiết bị đi vào hàng đợi FIFO, loại bỏ 95% gói tin rác mà không tiêu tốn bất kỳ chu kỳ xung nhịp nào của CPU Xtensa.",
                    "Vì nếu không có bộ lọc phần cứng thì bộ thu phát CAN Transceiver sẽ bị cháy.",
                    "Vì bộ lọc phần cứng dùng để giải mã nén các file ảnh JPEG gửi qua CAN."
                ],
                correct: 1,
                explanation: "Bộ lọc chấp nhận TWAI hoạt động hoàn toàn bằng các cổng logic phần cứng. Công thức lọc: `(Received_ID ^ Acceptance_Code) & ~Acceptance_Mask == 0`. Nếu gói tin không khớp với mặt nạ, phần cứng vứt bỏ ngay lập tức ở mức bit, CPU không hề bị ngắt (ISR), giúp CPU dành 100% thời gian chạy các mô hình học sâu và thuật toán điều khiển.",
                bookRef: "ESP32-S3 Technical Reference Manual Ch.29 (Two-Wire Automotive Interface - TWAI)"
            },
            {
                id: "m13_q4",
                title: "Giao Thức Công Nghiệp Modbus RTU & Khoảng Thời Gian Im Lặng T3.5",
                question: "Trong giao thức truyền thông công nghiệp Modbus RTU chạy trên đường truyền vi sai RS485, làm thế nào để thiết bị Master và Slave nhận diện được điểm bắt đầu và kết thúc của một khung tin dữ liệu?",
                options: [
                    "Bằng việc gửi một ký tự đặc biệt như 0xFF ở đầu gói tin.",
                    "Khung tin Modbus RTU được giới hạn bởi một khoảng thời gian đường truyền hoàn toàn im lặng (Silence Interval) kéo dài tối thiểu 3.5 ký tự (T3.5) trước và sau gói tin. Nếu khoảng cách giữa hai byte liên tiếp vượt quá 1.5 ký tự (T1.5), gói tin sẽ bị hủy vì coi là lỗi đường truyền.",
                    "Bằng việc sử dụng dây tín hiệu ngắt Hardware Handshake RTS/CTS.",
                    "Modbus RTU sử dụng giao thức bắt tay 3 bước TCP SYN/ACK."
                ],
                correct: 1,
                explanation: "Modbus RTU là chuẩn truyền thông nối tiếp nhị phân cổ điển cực kỳ phổ biến trong tự động hóa nhà máy. Vì các byte truyền nối tiếp nhau dưới dạng nhị phân thuần túy (từ 0x00 đến 0xFF) nên không có ký tự nào là ký tự cấm làm dấu phân tách. Do đó, Modbus dùng thời gian im lặng $T_{3.5}$ trên đường truyền làm mốc phân tách khung tin.",
                bookRef: "Modbus Application Protocol Specification V1.1b (Modbus Organization) Section 2.5"
            },
            {
                id: "m13_q5",
                title: "Điện Trở Đầu Cuối 120 Ohm (Termination Resistors) & Sóng Phản Xạ",
                question: "Tại sao ở hai điểm mút xa nhất của đường truyền mạng CAN Bus (ISO 11898) và mạng RS485 bắt buộc phải gắn hai điện trở đầu cuối $120\\,\\Omega$ nối giữa hai dây vi sai?",
                options: [
                    "Để sạc điện cho vi điều khiển hoạt động khi mất nguồn chính.",
                    "Để phối hợp trở kháng đường truyền (Impedance Matching) với trở kháng đặc tính của cáp xoắn đôi (~120 Ohm), triệt tiêu hoàn toàn hiện tượng sóng phản xạ (Signal Reflection) làm méo dạng xung và làm biến dạng các bit dữ liệu tốc độ cao.",
                    "Để biến đổi tín hiệu số thành tín hiệu tương tự Analog.",
                    "Để hạ dòng điện ngắn mạch khi dây bị đứt chạm đất."
                ],
                correct: 1,
                explanation: "Khi truyền tín hiệu số tần số cao (lên tới 1 Mbps trên CAN hoặc 10 Mbps trên RS485), đường dây dẫn dài đóng vai trò là một đường truyền sóng (Transmission Line). Nếu đầu mút của đường dây bị hở mạch (Open Circuit), sóng điện từ chạm vào đầu mút sẽ bị dội ngược lại (Reflection) giống như sóng nước đập vào bờ đê, giao thoa phá hủy các bit dữ liệu kế tiếp.",
                bookRef: "ISO 11898-2:2016 Road Vehicles - CAN Physical Media & High-Speed Transmission Line Theory"
            }
        ]
    },

    // =========================================================================
    // MODULE 14: UNIT TEST TỰ ĐỘNG & CI/CD FIRMWARE
    // =========================================================================
    {
        moduleIndex: 13,
        title: "Module 14: Unit Test Tự Động & CI/CD Firmware",
        stageDomain: "Embedded Unit Testing, Mocking & Automated DevOps",
        icon: "🚀",
        bookId: "book_tdd_embedded_c",
        standardRef: "Test-Driven Development for Embedded C (James W. Grenning) & Unity Framework",
        badge: "TDD Nhúng & Tự Động Hóa DevOps",
        questions: [
            {
                id: "m14_q1",
                title: "Triết Lý TDD Nhúng C & Chu Trình Red-Green-Refactor",
                question: "Theo tác phẩm kinh điển *Test-Driven Development for Embedded C* của James W. Grenning, nguyên tắc cốt lõi của chu trình phát triển hướng kiểm thử Red-Green-Refactor là gì?",
                options: [
                    "Viết toàn bộ mã nguồn hoàn chỉnh trước, sau đó viết tài liệu hướng dẫn sử dụng, cuối cùng mới chạy thử nghiệm.",
                    "1. Red: Viết một ca kiểm thử Unit Test nhỏ cho tính năng chưa tồn tại và chạy thử để thấy test THẤT BẠI; 2. Green: Viết lượng mã nguồn C vừa đủ để test VƯỢT QUA; 3. Refactor: Tối ưu và dọn dẹp mã nguồn nhưng vẫn đảm bảo toàn bộ bộ test xanh tươi; lặp lại chu trình này liên tục.",
                    "Đổi màu giao diện code editor sang màu xanh lá cây để tăng sự tập trung.",
                    "Gửi toàn bộ mã nguồn cho đội ngũ QA bên ngoài kiểm thử độc lập mà lập trình viên không cần viết test."
                ],
                correct: 1,
                explanation: "James W. Grenning đã cách mạng hóa tư duy lập trình nhúng truyền thống (vốn thường là cắm nạp code vào mạch thật rồi ngồi nhìn đèn LED hoặc in log). TDD đảo ngược quy trình: Viết test trước để định nghĩa đặc tả giao diện và hành vi kỳ vọng của hàm, sau đó mới viết mã thực thi, giúp mã nguồn C nhúng có tính module hóa cao và không bao giờ bị lỗi hồi quy (Regression-Free).",
                bookRef: "Test-Driven Development for Embedded C (James W. Grenning, Pragmatic Bookshelf) Ch.1 & 2"
            },
            {
                id: "m14_q2",
                title: "Kỹ Thuật Giả Lập Phần Cứng (Hardware Mocking) với Unity & CMock",
                question: "Làm thế nào một kỹ sư phần mềm nhúng có thể chạy hàng trăm ca kiểm thử Unit Test cho thuật toán điều khiển quạt tản nhiệt thông minh trên máy tính cá nhân (Host PC x86_64) mà không cần phải kết nối bo mạch phần cứng ESP32 hay cảm biến nhiệt độ thật?",
                options: [
                    "Bằng cách hàn dây nối máy tính x86 trực tiếp vào chân chip vi điều khiển.",
                    "Sử dụng kỹ thuật Lớp Trừu Tượng Phần Cứng (HAL) kết hợp với công cụ tạo Mock tự động (như CMock trong Unity Framework): CMock tự động sinh ra các hàm giả lập driver (ví dụ mock_i2c_read) cho phép kỹ sư tiêm các giá trị nhiệt độ giả định và kiểm tra xem hàm điều khiển có phát tín hiệu bật quạt chính xác theo yêu cầu logic hay không.",
                    "Không thể làm được, phần mềm nhúng bắt buộc 100% phải nạp vào bo mạch thật mới kiểm thử được.",
                    "Chuyển toàn bộ dự án từ ngôn ngữ C sang ngôn ngữ Python."
                ],
                correct: 1,
                explanation: "Đây là bí quyết của các tập đoàn công nghệ hàng đầu thế giới (Tesla, Apple, Bosch). Bằng cách cô lập logic nghiệp vụ khỏi tầng truy cập thanh ghi phần cứng (Layered Architecture), 90% logic thuật toán của firmware có thể được kiểm thử tự động trên máy tính x86 với tốc độ hàng ngàn ca test trong 2 giây mà không cần bất kỳ linh kiện phần cứng nào trên bàn làm việc.",
                bookRef: "Test-Driven Development for Embedded C (James W. Grenning) Ch.8 (Spying on the Hardware) & Ch.9 (Runtime Fakes)"
            },
            {
                id: "m14_q3",
                title: "Độ Bao Phủ Mã Nguồn (Code Coverage): Statement vs Branch vs MC/DC",
                question: "Xét biểu thức rẽ nhánh: `if (temp > 80 || pressure > 100)`. Tiêu chuẩn kiểm thử an toàn cao nhất MC/DC (Modified Condition/Decision Coverage) đòi hỏi điều kiện kiểm thử khắt khe hơn Statement Coverage (Bao phủ dòng lệnh) và Branch Coverage (Bao phủ nhánh) như thế nào?",
                options: [
                    "MC/DC chỉ cần chạy qua dòng lệnh if một lần duy nhất.",
                    "MC/DC đòi hỏi phải kiểm tra từng điều kiện đơn lẻ (temp > 80) và (pressure > 100) có thể độc lập làm thay đổi kết quả của toàn bộ quyết định tổng thể từ FALSE sang TRUE trong khi giữ nguyên trạng thái của các điều kiện khác, đảm bảo không có bất kỳ điều kiện ẩn nào bị bỏ sót.",
                    "MC/DC yêu cầu phải đo dòng điện tiêu thụ của chip trong khi chạy hàm if.",
                    "MC/DC chỉ áp dụng cho ngôn ngữ Assembly."
                ],
                correct: 1,
                explanation: "Statement Coverage chỉ cần cả 2 điều kiện cùng đúng 1 lần là đạt 100% dòng lệnh (rất lỏng lẻo). Branch Coverage chỉ cần 1 ca TRUE và 1 ca FALSE cho cả cụm `if`. MC/DC là tiêu chuẩn vàng khắt khe của hàng không vũ trụ (FAA DO-178C Level A) và ô tô (ISO 26262 ASIL-D): Nó bắt buộc phải chứng minh từng biến số logic hoạt động độc lập và chính xác.",
                bookRef: "DO-178C Software Considerations in Airborne Systems & ISO 26262-6 Code Coverage Metrics"
            },
            {
                id: "m14_q4",
                title: "Tự Động Hóa CI/CD Firmware với GitHub Actions & Docker",
                question: "Một luồng CI/CD (Continuous Integration / Continuous Deployment) hoàn chỉnh cho dự án ESP32-S3 sử dụng GitHub Actions được thiết kế để tự động kích hoạt mỗi khi lập trình viên thực hiện lệnh `git push` bao gồm chuỗi các giai đoạn chuẩn nào?",
                options: [
                    "Giai đoạn 1: Gửi email cho sếp; Giai đoạn 2: Tự động xóa mã nguồn cũ.",
                    "Giai đoạn 1: Chạy công cụ Linting & Static Analysis (Cppcheck, Clang-Format) kiểm tra chuẩn format và an toàn MISRA; Giai đoạn 2: Biên dịch và chạy bộ Unit Test với Unity trên máy ảo Host; Giai đoạn 3: Nạp Docker Container chứa ESP-IDF toolchain để biên dịch file nhị phân firmware.bin; Giai đoạn 4: Tạo Artifact và xuất báo cáo độ bao phủ mã nguồn.",
                    "Chỉ duy nhất một bước là nạp trực tiếp code qua đường truyền Internet vào thiết bị người dùng.",
                    "CI/CD chỉ dùng cho phát triển website, không thể áp dụng cho lập trình nhúng vi điều khiển."
                ],
                correct: 1,
                explanation: "Quy trình CI/CD nhúng hiện đại ngăn chặn triệt để tình trạng 'mã nguồn chạy trên máy em nhưng không chạy trên máy đồng nghiệp'. Mọi Commit hoặc Pull Request đều được một server đám mây sạch (Docker Container) kiểm tra độc lập từ cú pháp, chuẩn an toàn, kiểm thử đơn vị, đến việc biên dịch ra file `.bin` cuối cùng, nâng cao độ tin cậy của sản phẩm lên chuẩn công nghiệp.",
                bookRef: "Embedded DevOps: Building Continuous Integration Pipelines for Firmware & ESP-IDF CI Docker"
            },
            {
                id: "m14_q5",
                title: "Quy Chuẩn Semantic Versioning (SemVer: MAJOR.MINOR.PATCH) & Git Tag Release",
                question: "Theo quy chuẩn đánh số phiên bản phần mềm ngữ nghĩa Semantic Versioning 2.0.0 (SemVer: `MAJOR.MINOR.PATCH`), khi một bản cập nhật firmware Edge AI được phát hành để thay đổi cấu trúc giao tiếp Bluetooth/MQTT làm không tương thích ngược với ứng dụng di động cũ của khách hàng, số phiên bản nào bắt buộc phải tăng lên?",
                options: [
                    "Tăng số PATCH (ví dụ từ v1.2.0 lên v1.2.1) vì đây chỉ là sửa lỗi nhỏ.",
                    "Tăng số MINOR (ví dụ từ v1.2.0 lên v1.3.0).",
                    "Bắt buộc tăng số MAJOR (ví dụ từ v1.2.0 lên v2.0.0), vì bản cập nhật này chứa thay đổi gây phá vỡ tính tương thích ngược của giao diện API (Breaking Changes).",
                    "Giữ nguyên số phiên bản và chỉ thêm ngày tháng phát hành vào cuối tên file."
                ],
                correct: 2,
                explanation: "Quy chuẩn SemVer: 1. `PATCH` tăng khi chỉ sửa lỗi (Bug Fix) mà không thay đổi tính năng; 2. `MINOR` tăng khi thêm tính năng mới nhưng vẫn tương thích ngược (Backward-Compatible); 3. `MAJOR` bắt buộc tăng khi có bất kỳ thay đổi nào làm phá vỡ giao tiếp tương thích ngược (Breaking Change). Tuân thủ SemVer giúp hệ thống quản lý cập nhật OTA và ứng dụng Client phối hợp an toàn, tránh xung đột.",
                bookRef: "Semantic Versioning 2.0.0 Specification (Tom Preston-Werner, GitHub Cofounder)"
            }
        ]
    }
];

// =========================================================================
// QUẢN LÝ DỮ LIỆU & TIẾN ĐỘ THI TRẮC NGHIỆM (LOCAL STORAGE)
// =========================================================================

function getModuleQuizResults() {
    try {
        const raw = localStorage.getItem(STORAGE_MODULE_QUIZ);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.warn("Lỗi đọc dữ liệu module quiz:", e);
    }
    return {};
}

function saveModuleQuizResult(moduleIdx, resultData) {
    try {
        const allResults = getModuleQuizResults();
        allResults[moduleIdx] = {
            score: resultData.score,
            total: resultData.total,
            passed: resultData.passed,
            userAnswers: resultData.userAnswers,
            completedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_MODULE_QUIZ, JSON.stringify(allResults));
    } catch (e) {
        console.warn("Lỗi ghi dữ liệu module quiz:", e);
    }
}

function getModuleQuizScoreBadge(moduleIdx) {
    const results = getModuleQuizResults();
    const res = results[moduleIdx];
    if (!res) {
        return `<span class="module-quiz-badge unattempted" title="Chưa làm bài kiểm tra">⚪ Chưa thi</span>`;
    }
    if (res.passed) {
        return `<span class="module-quiz-badge passed" title="Đã đạt yêu cầu (${res.score}/${res.total} câu đúng)">✅ ${res.score}/${res.total}</span>`;
    }
    return `<span class="module-quiz-badge failed" title="Chưa đạt chuẩn (${res.score}/${res.total} câu đúng)">⚠️ ${res.score}/${res.total}</span>`;
}

function getOverallQuizStats() {
    const results = getModuleQuizResults();
    let passedCount = 0;
    let completedCount = 0;
    let totalCorrect = 0;
    const totalQuestions = moduleQuizData.length * 5;

    moduleQuizData.forEach((mod, idx) => {
        const r = results[idx];
        if (r) {
            completedCount++;
            if (r.passed) passedCount++;
            totalCorrect += (r.score || 0);
        }
    });

    return {
        totalModules: moduleQuizData.length,
        completedModules: completedCount,
        passedModules: passedCount,
        totalQuestions,
        totalCorrect
    };
}

// =========================================================================
// RUNNER: TRẠNG THÁI & ĐIỀU KHIỂN BÀI THI HIỆN TẠI (ACTIVE QUIZ STATE)
// =========================================================================

let currentQuizState = {
    moduleIndex: 0,
    questionIndex: 0,
    userAnswers: [], // lưu mảng các index đáp án đã chọn (0..3)
    hasAnsweredCurrent: false,
    score: 0
};

/**
 * Mở modal kiểm tra trắc nghiệm cho một Module cụ thể (0 đến 13)
 */
function openModuleQuiz(moduleIdx) {
    const moduleData = moduleQuizData[moduleIdx];
    if (!moduleData) {
        console.error("Không tìm thấy dữ liệu trắc nghiệm cho module:", moduleIdx);
        return;
    }

    currentQuizState = {
        moduleIndex: moduleIdx,
        questionIndex: 0,
        userAnswers: new Array(moduleData.questions.length).fill(null),
        hasAnsweredCurrent: false,
        score: 0
    };

    const modal = document.getElementById("module-quiz-modal");
    if (!modal) {
        console.error("Không tìm thấy phần tử DOM #module-quiz-modal");
        return;
    }

    modal.classList.add("open");
    renderCurrentQuizQuestion();
}

/**
 * Đóng modal trắc nghiệm
 */
function closeModuleQuiz() {
    const modal = document.getElementById("module-quiz-modal");
    if (modal) modal.classList.remove("open");
}

/**
 * Hiển thị câu hỏi hiện tại trong Modal
 */
function renderCurrentQuizQuestion() {
    const mod = moduleQuizData[currentQuizState.moduleIndex];
    if (!mod) return;

    const qIdx = currentQuizState.questionIndex;
    const q = mod.questions[qIdx];
    if (!q) {
        showQuizSummaryScreen();
        return;
    }

    currentQuizState.hasAnsweredCurrent = false;

    // 1. Cập nhật Tiêu đề và Header
    const titleEl = document.getElementById("mq-modal-title");
    if (titleEl) {
        titleEl.innerHTML = `<span style="color: var(--accent);">${mod.icon}</span> ${mod.title}`;
    }

    const stageDomainEl = document.getElementById("mq-modal-domain");
    if (stageDomainEl) {
        stageDomainEl.innerText = `${mod.stageDomain} • ${mod.badge}`;
    }

    // 2. Cập nhật Thanh Tiến Trình (Progress Bar)
    const progressText = document.getElementById("mq-progress-text");
    if (progressText) {
        progressText.innerText = `Câu ${qIdx + 1} / ${mod.questions.length}`;
    }

    const progressFill = document.getElementById("mq-progress-fill");
    if (progressFill) {
        const percent = ((qIdx + 1) / mod.questions.length) * 100;
        progressFill.style.width = `${percent}%`;
    }

    // 3. Nút liên kết Tủ Sách
    const bookBtn = document.getElementById("mq-book-ref-btn");
    if (bookBtn && mod.bookId && typeof technicalBooksData !== 'undefined') {
        const book = technicalBooksData.find(b => b.id === mod.bookId);
        if (book) {
            bookBtn.style.display = "inline-flex";
            bookBtn.innerHTML = `<span>📚</span> ${book.title.length > 25 ? book.title.slice(0, 25) + '...' : book.title} ↗`;
            bookBtn.onclick = () => openBookshelfForBook(mod.bookId);
        } else {
            bookBtn.style.display = "none";
        }
    }

    // 4. Nội dung câu hỏi
    const questionCard = document.getElementById("mq-question-card");
    if (questionCard) {
        questionCard.style.display = "block";
        questionCard.innerHTML = `
            <div class="mq-q-theme">
                <span class="mq-theme-tag">🎯 CHỦ ĐỀ SÁT HẠCH</span>
                <span class="mq-theme-text">${escapeHtml(q.title)}</span>
            </div>
            <div class="mq-q-body">
                ${formatMarkdownChat(q.question)}
            </div>
        `;
    }

    // 5. Render 4 lựa chọn (Options)
    const optionsContainer = document.getElementById("mq-options-container");
    if (optionsContainer) {
        optionsContainer.style.display = "grid";
        optionsContainer.innerHTML = "";

        const optionLabels = ["A", "B", "C", "D"];
        q.options.forEach((optText, optIdx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "mq-option-btn";
            btn.id = `mq-opt-${optIdx}`;
            btn.innerHTML = `
                <span class="mq-opt-letter">${optionLabels[optIdx]}</span>
                <span class="mq-opt-text">${escapeHtml(optText)}</span>
                <span class="mq-opt-status-icon"></span>
            `;
            btn.onclick = () => selectQuizOption(optIdx);
            optionsContainer.appendChild(btn);
        });
    }

    // 6. Ẩn Hộp Giải Thích & Nút Tiếp Theo ban đầu
    const explanationBox = document.getElementById("mq-explanation-box");
    if (explanationBox) {
        explanationBox.style.display = "none";
        explanationBox.innerHTML = "";
    }

    const actionContainer = document.getElementById("mq-action-container");
    if (actionContainer) {
        actionContainer.style.display = "none";
    }

    // Ẩn Màn hình Kết Quả (nếu đang bật)
    const summaryScreen = document.getElementById("mq-summary-screen");
    if (summaryScreen) summaryScreen.style.display = "none";
}

/**
 * Xử lý khi người dùng click chọn 1 đáp án
 */
function selectQuizOption(selectedIdx) {
    if (currentQuizState.hasAnsweredCurrent) return; // Không cho click lại
    currentQuizState.hasAnsweredCurrent = true;

    const mod = moduleQuizData[currentQuizState.moduleIndex];
    const qIdx = currentQuizState.questionIndex;
    const q = mod.questions[qIdx];
    const isCorrect = (selectedIdx === q.correct);

    currentQuizState.userAnswers[qIdx] = selectedIdx;
    if (isCorrect) currentQuizState.score++;

    // 1. Cập nhật giao diện của 4 nút đáp án
    q.options.forEach((_, optIdx) => {
        const btn = document.getElementById(`mq-opt-${optIdx}`);
        if (!btn) return;
        btn.disabled = true;

        if (optIdx === q.correct) {
            btn.classList.add("correct");
            const icon = btn.querySelector(".mq-opt-status-icon");
            if (icon) icon.innerText = "✓";
        } else if (optIdx === selectedIdx && !isCorrect) {
            btn.classList.add("wrong");
            const icon = btn.querySelector(".mq-opt-status-icon");
            if (icon) icon.innerText = "✗";
        }
    });

    // 2. Phát âm thanh phản hồi
    if (typeof AudioEngine !== 'undefined') {
        if (isCorrect) {
            AudioEngine.playSuccess();
        } else {
            AudioEngine.playError();
        }
    }

    // 3. Hiển thị Hộp Giải Thích Chi Tiết Cố Định
    const explanationBox = document.getElementById("mq-explanation-box");
    if (explanationBox) {
        explanationBox.style.display = "block";
        explanationBox.className = `mq-explanation-box ${isCorrect ? 'box-correct' : 'box-wrong'}`;
        explanationBox.innerHTML = `
            <div class="mq-exp-header">
                <span class="mq-exp-icon">${isCorrect ? '✅ CHÍNH XÁC!' : '❌ CHƯA CHÍNH XÁC!'}</span>
                <span class="mq-exp-ref-tag">📖 ${escapeHtml(q.bookRef || mod.standardRef)}</span>
            </div>
            <div class="mq-exp-body">
                ${formatMarkdownChat(q.explanation)}
            </div>
            ${mod.bookId ? `
            <div class="mq-exp-footer">
                <button type="button" class="btn btn-secondary mq-exp-book-btn" onclick="openBookshelfForBook('${mod.bookId}')">
                    <span>📚</span> Đọc kỹ hơn trong Tủ Sách: ${escapeHtml(mod.title)} ↗
                </button>
            </div>
            ` : ''}
        `;
    }

    // 4. Hiển thị Nút "Câu tiếp theo"
    const actionContainer = document.getElementById("mq-action-container");
    if (actionContainer) {
        actionContainer.style.display = "flex";
        const isLastQuestion = (qIdx === mod.questions.length - 1);
        actionContainer.innerHTML = `
            <div style="font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 8px;">
                <span>Điểm tạm tính:</span>
                <strong style="color: var(--cyan); font-family: 'JetBrains Mono', monospace; font-size: 14px;">${currentQuizState.score} / ${qIdx + 1}</strong>
            </div>
            <button type="button" class="btn btn-accent mq-next-btn" onclick="nextQuizStep()">
                <span>${isLastQuestion ? '🏁 Xem Kết Quả Bài Thi' : 'Câu Tiếp Theo →'}</span>
            </button>
        `;
    }
}

/**
 * Chuyển sang câu hỏi kế tiếp hoặc kết thúc bài thi
 */
function nextQuizStep() {
    const mod = moduleQuizData[currentQuizState.moduleIndex];
    if (currentQuizState.questionIndex < mod.questions.length - 1) {
        currentQuizState.questionIndex++;
        renderCurrentQuizQuestion();
    } else {
        showQuizSummaryScreen();
    }
}

/**
 * Hiển thị màn hình Tổng kết điểm, Cấp XP và Đánh giá
 */
function showQuizSummaryScreen() {
    const mod = moduleQuizData[currentQuizState.moduleIndex];
    const score = currentQuizState.score;
    const total = mod.questions.length;
    const passed = (score >= 4); // Yêu cầu >= 4/5 (80%) để đạt chuẩn

    // Ẩn câu hỏi và các lựa chọn
    const questionCard = document.getElementById("mq-question-card");
    if (questionCard) questionCard.style.display = "none";

    const optionsContainer = document.getElementById("mq-options-container");
    if (optionsContainer) optionsContainer.style.display = "none";

    const explanationBox = document.getElementById("mq-explanation-box");
    if (explanationBox) explanationBox.style.display = "none";

    const actionContainer = document.getElementById("mq-action-container");
    if (actionContainer) actionContainer.style.display = "none";

    // 1. Tính toán & Cấp XP thưởng
    const prevResults = getModuleQuizResults();
    const prevBest = prevResults[currentQuizState.moduleIndex];
    const isFirstTimePass = passed && (!prevBest || !prevBest.passed);

    let earnedXp = score * 10; // +10 XP mỗi câu đúng
    if (isFirstTimePass) {
        earnedXp += 50; // Thưởng thêm 50 XP khi lần đầu vượt qua Module
    }

    if (earnedXp > 0 && typeof addXp === 'function') {
        addXp(earnedXp);
    }

    // 2. Lưu kết quả vào LocalStorage
    saveModuleQuizResult(currentQuizState.moduleIndex, {
        score,
        total,
        passed,
        userAnswers: currentQuizState.userAnswers
    });

    // 3. Âm thanh chúc mừng hoặc nhắc nhở
    if (typeof AudioEngine !== 'undefined') {
        if (passed) {
            AudioEngine.playLevelUp();
        } else {
            AudioEngine.playError();
        }
    }

    // 4. Render Màn hình Kết Quả
    const summaryScreen = document.getElementById("mq-summary-screen");
    if (!summaryScreen) return;
    summaryScreen.style.display = "block";

    const percent = Math.round((score / total) * 100);

    let statusHeader = "";
    let statusClass = "";
    if (score === 5) {
        statusHeader = "🌟 XUẤT SẮC TUYỆT ĐỐI • MASTER KIẾN THỨC";
        statusClass = "stat-perfect";
    } else if (passed) {
        statusHeader = "✅ ĐẠT CHUẨN KỸ SƯ • ĐÃ VƯỢT QUA MODULE";
        statusClass = "stat-passed";
    } else {
        statusHeader = "⚠️ CHƯA ĐẠT CHUẨN (CẦN TỐI THIỂU 4/5 CÂU ĐÚNG)";
        statusClass = "stat-failed";
    }

    // Sinh bảng duyệt lại 5 câu hỏi
    const reviewListHtml = mod.questions.map((q, idx) => {
        const uAns = currentQuizState.userAnswers[idx];
        const isQCorrect = (uAns === q.correct);
        return `
            <div class="mq-summary-q-item ${isQCorrect ? 'correct' : 'wrong'}">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <div style="font-size: 13px; font-weight: 700; color: #ffffff;">
                        Câu ${idx + 1}: ${escapeHtml(q.title)}
                    </div>
                    <span class="mq-summary-q-tag">${isQCorrect ? '✓ Đúng (+10 XP)' : '✗ Sai'}</span>
                </div>
                <div style="font-size: 11.5px; color: #94a3b8; margin-top: 4px;">
                    <strong>Bạn chọn:</strong> ${uAns !== null ? escapeHtml(q.options[uAns]) : 'Bỏ trống'}
                </div>
                ${!isQCorrect ? `
                <div style="font-size: 11.5px; color: #34d399; margin-top: 2px;">
                    <strong>Đáp án chuẩn:</strong> ${escapeHtml(q.options[q.correct])}
                </div>
                ` : ''}
            </div>
        `;
    }).join("");

    summaryScreen.innerHTML = `
        <div class="mq-summary-header ${statusClass}">
            <div class="mq-score-ring">
                <span class="mq-score-number">${score}/${total}</span>
                <span class="mq-score-percent">${percent}%</span>
            </div>
            <div class="mq-summary-title">${statusHeader}</div>
            <div class="mq-summary-xp">
                <span style="color: var(--gold); font-size: 16px;">⚡ +${earnedXp} XP ĐÃ NHẬN</span>
                ${isFirstTimePass ? `<span class="badge badge-gold" style="font-size: 10px; margin-left: 6px;">🏆 THƯỞNG VƯỢT MODULE +50 XP</span>` : ''}
            </div>
        </div>

        <div class="mq-summary-review-list">
            <h5 style="margin: 0 0 10px 0; color: var(--cyan); font-size: 12.5px; text-transform: uppercase;">
                📋 Bảng Chi Tiết Kết Quả 5 Câu Hỏi:
            </h5>
            ${reviewListHtml}
        </div>

        <div class="mq-summary-actions">
            <button type="button" class="btn btn-secondary" onclick="openModuleQuiz(${currentQuizState.moduleIndex})">
                🔄 Làm Lại Bài Thi Này
            </button>
            <button type="button" class="btn btn-secondary" onclick="openBookshelfForBook('${mod.bookId}')">
                📚 Ôn Tập Sách Gốc ↗
            </button>
            <button type="button" class="btn btn-secondary" onclick="openModuleQuizSelector()">
                📋 Danh Sách 14 Module
            </button>
            ${currentQuizState.moduleIndex < moduleQuizData.length - 1 ? `
            <button type="button" class="btn btn-accent" onclick="openModuleQuiz(${currentQuizState.moduleIndex + 1})">
                ➡️ Sang Module ${currentQuizState.moduleIndex + 2} Tiếp Theo
            </button>
            ` : `
            <button type="button" class="btn btn-accent" onclick="closeModuleQuiz()">
                ✓ Hoàn Thành &amp; Quay Lại Lộ Trình
            </button>
            `}
        </div>
    `;

    // Cập nhật tất cả các huy hiệu trên trang
    updateAllModuleQuizBadges();
}

// =========================================================================
// MODAL DANH SÁCH 14 MODULE QUIZ SELECTOR (OVERVIEW & DIRECT ACCESS)
// =========================================================================

/**
 * Mở modal duyệt danh sách tất cả 14 Module trắc nghiệm
 */
function openModuleQuizSelector() {
    closeModuleQuiz(); // Đóng quiz đang làm dở nếu có

    const modal = document.getElementById("module-quiz-selector-modal");
    if (!modal) {
        console.error("Không tìm thấy #module-quiz-selector-modal");
        return;
    }

    renderQuizSelectorGrid();
    modal.classList.add("open");
}

function closeModuleQuizSelector() {
    const modal = document.getElementById("module-quiz-selector-modal");
    if (modal) modal.classList.remove("open");
}

function renderQuizSelectorGrid() {
    const container = document.getElementById("mq-selector-grid");
    if (!container) return;

    const stats = getOverallQuizStats();
    const statHeader = document.getElementById("mq-selector-overall-stat");
    if (statHeader) {
        statHeader.innerText = `${stats.passedModules}/${stats.totalModules} Module Đạt Chuẩn • ${stats.totalCorrect}/${stats.totalQuestions} Câu Đúng`;
    }

    const results = getModuleQuizResults();
    container.innerHTML = "";

    // Phân theo 4 Chặng nghề nghiệp
    const phases = [
        { label: "CHẶNG 1: SINH VIÊN & NỀN TẢNG NHÚNG (YEAR 2-3)", range: [0, 1, 2], icon: "🌱" },
        { label: "CHẶNG 2: ĐỒ ÁN TỐT NGHIỆP EDGE AI A+ (YEAR 4 / CAPSTONE)", range: [3, 4, 5, 6, 7], icon: "🎓" },
        { label: "CHẶNG 3: CHINH PHỤC PHỎNG VẤN INTERN (TEST C & FIRMWARE)", range: [8, 9, 10], icon: "💼" },
        { label: "CHẶNG 4: HÀNH TRANG FRESHER ➔ JUNIOR (DỰ ÁN DOANH NGHIỆP THẬT)", range: [11, 12, 13], icon: "🚀" }
    ];

    phases.forEach(ph => {
        const phGroup = document.createElement("div");
        phGroup.className = "mq-selector-phase-group";
        phGroup.innerHTML = `
            <div class="mq-selector-phase-title">
                <span>${ph.icon}</span> <span>${ph.label}</span>
            </div>
            <div class="mq-selector-cards-subgrid" id="phase-cards-${ph.range[0]}"></div>
        `;
        container.appendChild(phGroup);

        const subgrid = phGroup.querySelector(`#phase-cards-${ph.range[0]}`);

        ph.range.forEach(modIdx => {
            const mod = moduleQuizData[modIdx];
            if (!mod) return;
            const res = results[modIdx];
            const isPassed = res && res.passed;
            const isDone = Boolean(res);

            const card = document.createElement("div");
            card.className = `mq-selector-card ${isPassed ? 'card-passed' : (isDone ? 'card-failed' : 'card-new')}`;

            card.innerHTML = `
                <div class="mq-card-top">
                    <span class="mq-card-icon">${mod.icon}</span>
                    <span class="mq-card-badge">${isPassed ? '✅ ĐÃ ĐẠT' : (isDone ? '⚠️ CẦN ÔN LẠI' : '⚪ CHƯA THI')}</span>
                </div>
                <div class="mq-card-title">${escapeHtml(mod.title)}</div>
                <div class="mq-card-domain">${escapeHtml(mod.stageDomain)}</div>
                <div class="mq-card-ref">
                    📚 <strong>Tài liệu:</strong> ${escapeHtml(mod.standardRef)}
                </div>
                <div class="mq-card-footer">
                    <div class="mq-card-score">
                        ${res ? `Điểm: <strong style="color: ${isPassed ? '#34d399' : '#f87171'}">${res.score}/5</strong>` : 'Chưa có điểm'}
                    </div>
                    <button type="button" class="btn btn-accent mq-card-btn" onclick="closeModuleQuizSelector(); openModuleQuiz(${modIdx})">
                        <span>${isDone ? 'Thi Lại ↺' : 'Bắt Đầu Làm 📝'}</span>
                    </button>
                </div>
            `;
            subgrid.appendChild(card);
        });
    });
}

/**
 * Cập nhật tất cả các huy hiệu trắc nghiệm trên Roadmap, Notebook và Dashboard
 */
function updateAllModuleQuizBadges() {
    const results = getModuleQuizResults();

    // 1. Cập nhật trên Roadmap (nếu đang ở tab learning)
    if (typeof roadmap !== 'undefined' && Array.isArray(roadmap)) {
        roadmap.forEach((_, idx) => {
            const badgeEl = document.getElementById(`stage-quiz-badge-${idx}`);
            if (badgeEl) {
                badgeEl.innerHTML = getModuleQuizScoreBadge(idx);
            }
        });
    }

    // 2. Cập nhật trên Portal Card Dashboard
    const portalQuizStat = document.getElementById("portal-quiz-stat");
    if (portalQuizStat) {
        const stats = getOverallQuizStats();
        portalQuizStat.innerText = `${stats.passedModules}/${stats.totalModules} Module Đạt Chuẩn`;
    }

    // 3. Cập nhật trên Notebook Reader nếu đang mở
    const nbQuizStatus = document.getElementById("nb-reader-quiz-status");
    if (nbQuizStatus && typeof currentReaderStageIdx !== 'undefined') {
        const r = results[currentReaderStageIdx];
        if (r) {
            nbQuizStatus.innerHTML = `Điểm bài thi: <strong style="color: ${r.passed ? '#34d399' : '#f87171'}">${r.score}/5 ${r.passed ? '✅ (Đạt Chuẩn)' : '⚠️ (Chưa Đạt)'}</strong>`;
        } else {
            nbQuizStatus.innerHTML = `Chưa làm bài kiểm tra trắc nghiệm lý thuyết.`;
        }
    }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    updateAllModuleQuizBadges();
});

// Gắn vào window để gọi từ inline onclick
window.moduleQuizData = moduleQuizData;
window.openModuleQuiz = openModuleQuiz;
window.closeModuleQuiz = closeModuleQuiz;
window.openModuleQuizSelector = openModuleQuizSelector;
window.closeModuleQuizSelector = closeModuleQuizSelector;
window.selectQuizOption = selectQuizOption;
window.nextQuizStep = nextQuizStep;
window.getModuleQuizScoreBadge = getModuleQuizScoreBadge;
window.getOverallQuizStats = getOverallQuizStats;
window.updateAllModuleQuizBadges = updateAllModuleQuizBadges;
