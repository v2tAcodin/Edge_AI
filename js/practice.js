// ==========================================
// 6. CODELEARN PRACTICE ARENA & TEST ENGINE (72 BÀI TẬP 6 MODULES)
// ==========================================
const practiceExercises = [
    // =========================================================================
    // MODULE 1: C CORE, CON TRỎ & QUẢN LÝ BỘ NHỚ ESP32-S3 (STAGE 0) - 12 BÀI
    // =========================================================================
    {
        id: "prob_1",
        stageIndex: 0,
        title: "Bài 1: Bật (Set) Bit trên Thanh Ghi",
        topic: "1. C & Bộ nhớ",
        difficulty: "Dễ",
        xp: 50,
        desc: `Bật bit ở vị trí <code>bit_pos</code> (0 đến 7) trên thanh ghi 8-bit mà không làm thay đổi các bit khác.`,
        standardRef: "ESP32-S3 TRM Ch.5 / MISRA C:2012 Rule 10.1",
        bookId: "book_esps3_trm",
        realWorld: `Điều khiển thanh ghi phần cứng <code>GPIO_OUT_W1TS_REG</code> (Địa chỉ 0x60004008) trên ESP32-S3 để bật chân GPIO cấp nguồn cảm biến hoặc bật module AI Camera mà không làm thay đổi các chân khác trên cùng port.`,
        whyMatters: `Theo mục 5.3 ESP32-S3 TRM, thanh ghi Write-1-to-Set cho phép thao tác phần cứng dạng Atomic (nguyên tử) trong 1 chu kỳ xung nhịp 240MHz, loại bỏ hoàn toàn nguy cơ tranh chấp tài nguyên (Race Condition) giữa 2 nhân CPU.`,
        example: `Input: reg = 0x00, bit_pos = 3 -> Output: 8 (0x08)`,
        hint: `Sử dụng phép toán OR từng bit: <code>reg | (1 << bit_pos)</code>.`,
        initialCode: `uint8_t set_bit(uint8_t reg, int bit_pos) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t set_bit(uint8_t reg, int bit_pos) {\n    return reg | (1 << bit_pos);\n}`,
        fnName: "set_bit",
        params: ["reg", "bit_pos"],
        testCases: [
            { input: [0, 3], expected: 8, label: "reg=0x00, bit=3" },
            { input: [1, 1], expected: 3, label: "reg=0x01, bit=1" },
            { input: [254, 0], expected: 255, label: "reg=0xFE, bit=0" },
            { input: [16, 4], expected: 16, label: "reg=0x10, bit=4" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "prob_2",
        stageIndex: 0,
        title: "Bài 2: Xóa (Clear) Bit trên Thanh Ghi",
        topic: "1. C & Bộ nhớ",
        difficulty: "Dễ",
        xp: 50,
        desc: `Xóa bit ở vị trí <code>bit_pos</code> về 0 trên thanh ghi 8-bit mà không ảnh hưởng các bit khác.`,
        standardRef: "ESP32-S3 TRM Ch.5 / MISRA C:2012 Rule 10.1",
        bookId: "book_esps3_trm",
        realWorld: `Ghi bit vào thanh ghi <code>GPIO_OUT_W1TC_REG</code> (Write-1-to-Clear) hoặc xóa cờ ngắt phần cứng <code>TIMERG0_INT_CLR_REG</code> sau khi đọc xong dữ liệu cảm biến I2C/SPI.`,
        whyMatters: `Nếu không xóa đúng bit cờ ngắt theo đặc tả ESP32-S3 TRM Ch.11, vi điều khiển sẽ bị kẹt vĩnh viễn trong hàm ngắt ISR Lockup Loop, làm treo toàn bộ FreeRTOS Scheduler và kích hoạt Watchdog Reset.`,
        example: `Input: reg = 0xFF, bit_pos = 0 -> Output: 254 (0xFE)`,
        hint: `Sử dụng AND với bit đảo: <code>reg & ~(1 << bit_pos)</code>.`,
        initialCode: `uint8_t clear_bit(uint8_t reg, int bit_pos) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t clear_bit(uint8_t reg, int bit_pos) {\n    return reg & ~(1 << bit_pos);\n}`,
        fnName: "clear_bit",
        params: ["reg", "bit_pos"],
        testCases: [
            { input: [255, 0], expected: 254, label: "reg=0xFF, bit=0" },
            { input: [8, 3], expected: 0, label: "reg=0x08, bit=3" },
            { input: [171, 1], expected: 169, label: "reg=0xAB, bit=1" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "prob_3",
        stageIndex: 0,
        title: "Bài 3: Đảo (Toggle) Bit trên Thanh Ghi",
        topic: "1. C & Bộ nhớ",
        difficulty: "Dễ",
        xp: 50,
        desc: `Đảo trạng thái của bit tại vị trí <code>bit_pos</code> (0 thành 1, 1 thành 0) trên thanh ghi.`,
        standardRef: "ISO/IEC 9899:2011 §6.5 / MISRA C:2012 Rule 12.2",
        bookId: "book_iso_c11_standard",
        realWorld: `Đảo trạng thái chân đèn tín hiệu Heartbeat LED hoặc đảo cờ ping-pong buffer thu thập mẫu âm thanh microphone DMA trên ESP32-S3.`,
        whyMatters: `Phép toán XOR (^) thực thi trực tiếp trên thanh ghi ALU của vi xử lý Xtensa LX7 trong đúng 1 cycle, không sinh ra lệnh rẽ nhánh điều kiện Branching làm xả đường ống lệnh (Pipeline Flush).`,
        example: `Input: reg = 0, bit_pos = 2 -> Output: 4; Input: reg = 4, bit_pos = 2 -> Output: 0`,
        hint: `Sử dụng phép toán XOR: <code>reg ^ (1 << bit_pos)</code>.`,
        initialCode: `uint8_t toggle_bit(uint8_t reg, int bit_pos) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t toggle_bit(uint8_t reg, int bit_pos) {\n    return reg ^ (1 << bit_pos);\n}`,
        fnName: "toggle_bit",
        params: ["reg", "bit_pos"],
        testCases: [
            { input: [0, 2], expected: 4, label: "reg=0, bit=2" },
            { input: [4, 2], expected: 0, label: "reg=4, bit=2" },
            { input: [255, 7], expected: 127, label: "reg=255, bit=7" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "prob_4",
        stageIndex: 0,
        title: "Bài 4: Kiểm Tra Trạng Thái Bit (Is Bit Set)",
        topic: "1. C & Bộ nhớ",
        difficulty: "Dễ",
        xp: 50,
        desc: `Kiểm tra xem bit ở vị trí <code>bit_pos</code> có đang được bật (1) hay không. Trả về 1 nếu bật, 0 nếu tắt.`,
        standardRef: "MISRA C:2012 Rule 12.2 / Expert C Ch.4",
        bookId: "book_misra_c",
        realWorld: `Kiểm tra bit cờ báo trạng thái FIFO đầy <code>UART_FIFO_FULL_INT_ST</code> trong thanh ghi trạng thái UART trước khi đẩy thêm mẩu dữ liệu truyền ra Serial Monitor.`,
        whyMatters: `Quy tắc MISRA C:2012 Rule 12.2 yêu cầu toán hạng dịch bit phải nằm trong miền giới hạn (0 đến 31 với uint32_t) để tránh Undefined Behavior trên các kiến trúc vi xử lý nhúng.`,
        example: `Input: reg = 8, bit_pos = 3 -> Output: 1\nInput: reg = 8, bit_pos = 2 -> Output: 0`,
        hint: `Toán tử AND bitwise: <code>(reg & (1 << bit_pos)) ? 1 : 0</code>.`,
        initialCode: `int is_bit_set(uint8_t reg, int bit_pos) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_bit_set(uint8_t reg, int bit_pos) {\n    return (reg & (1 << bit_pos)) ? 1 : 0;\n}`,
        fnName: "is_bit_set",
        params: ["reg", "bit_pos"],
        testCases: [
            { input: [8, 3], expected: 1, label: "reg=8, bit=3" },
            { input: [8, 2], expected: 0, label: "reg=8, bit=2" },
            { input: [128, 7], expected: 1, label: "reg=128, bit=7" },
            { input: [0, 0], expected: 0, label: "reg=0, bit=0" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "prob_5",
        stageIndex: 0,
        title: "Bài 5: Căn Lề Bộ Nhớ 16-Byte Cho SIMD Vector",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Tập lệnh vector SIMD của ESP32-S3 và Tensor Arena yêu cầu con trỏ dữ liệu phải căn lề 16-byte (địa chỉ chia hết cho 16). Hãy viết hàm làm tròn địa chỉ bộ nhớ <code>address</code> lên bội số của 16 gần nhất.`,
        standardRef: "ESP32-S3 TRM Ch.1 & Ch.2 / SIMD Vector Alignment",
        bookId: "book_esps3_trm",
        realWorld: `Căn lề bộ nhớ 16-byte (128-bit) cho Tensor Arena và các mảng trọng số Float/INT8 trước khi nạp vào bộ tập lệnh tăng tốc SIMD Vector Xtensa LX7 (ESP-NN).`,
        whyMatters: `Lệnh SIMD Vector <code>EE.VLD.128</code> trên ESP32-S3 yêu cầu địa chỉ vật lý phải chia hết cho 16. Nếu truy xuất mảng không căn lề (Unaligned Memory Access), CPU sẽ bắn ra ngoại lệ LoadStoreAlignmentCause Crash.`,
        example: `Input: address = 4097 -> Output: 4112 (0x1010)\nInput: address = 4096 -> Output: 4096`,
        hint: `Công thức căn lề nhanh bằng bitwise: <code>(address + 15) & ~15</code>.`,
        initialCode: `uint32_t align_to_16(uint32_t address) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t align_to_16(uint32_t address) {\n    return (address + 15) & ~15;\n}`,
        fnName: "align_to_16",
        params: ["address"],
        testCases: [
            { input: [4096], expected: 4096, label: "addr=4096 (đã chia hết 16)" },
            { input: [4097], expected: 4112, label: "addr=4097 -> 4112" },
            { input: [4105], expected: 4112, label: "addr=4105 -> 4112" },
            { input: [0], expected: 0, label: "addr=0 -> 0" }
        ],
        linkedSkill: "SIMD Vector Alignment"
    },
    {
        id: "prob_6",
        stageIndex: 0,
        title: "Bài 6: Tính Kích Thước Khối Memory Pool (Chống Phân Mảnh)",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Để chống phân mảnh Heap trên ESP32, bộ cấp phát tĩnh gom bộ nhớ thành các khối (block) là bội số của 32 byte. Tính tổng kích thước khối tối thiểu chứa vừa cả <code>payload_size</code> và <code>header_size</code> (làm tròn lên bội số của 32 gần nhất).`,
        standardRef: "SEI CERT C MEM31-C / MISRA C:2012 Rule 21.3",
        bookId: "book_sei_cert_c",
        realWorld: `Thiết kế bộ nhớ đệm Memory Pool tĩnh cho các gói tin mạng Wi-Fi và cảm biến IMU trong hệ thống Edge IoT chạy liên tục 24/7 không được phép sập nguồn.`,
        whyMatters: `MISRA C:2012 Rule 21.3 nghiêm cấm sử dụng malloc()/free() trong các hệ thống an toàn nhúng vì gây phân mảnh bộ nhớ Heap (Heap Fragmentation) dẫn đến lỗi Out-of-Memory bí ẩn sau vài tuần hoạt động.`,
        example: `Input: payload = 20, header = 8 -> tổng 28 -> Output: 32\nInput: payload = 30, header = 8 -> tổng 38 -> Output: 64`,
        hint: `Căn lề 32 byte nhanh: <code>int total = payload_size + header_size; if (total == 0) return 0; return (total + 31) & ~31;</code>.`,
        initialCode: `int calc_pool_block_size(int payload_size, int header_size) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_pool_block_size(int payload_size, int header_size) {\n    int total = payload_size + header_size;\n    if (total == 0) return 0;\n    return (total + 31) & ~31;\n}`,
        fnName: "calc_pool_block_size",
        params: ["payload_size", "header_size"],
        testCases: [
            { input: [20, 8], expected: 32, label: "payload=20, header=8 (tổng 28)" },
            { input: [30, 8], expected: 64, label: "payload=30, header=8 (tổng 38)" },
            { input: [32, 0], expected: 32, label: "payload=32, header=0 (tổng 32)" },
            { input: [0, 0], expected: 0, label: "payload=0, header=0" }
        ],
        linkedSkill: "Heap Management & Anti-Fragmentation"
    },
    {
        id: "prob_7",
        stageIndex: 0,
        title: "Bài 7: Tính Offset Phân Bổ Tensor Arena Tĩnh",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Khi khởi tạo Tensor Arena tĩnh cho TinyML, mỗi tensor được xếp liên tiếp nhau. Hãy tính vị trí offset mới sau khi cấp phát một tensor có kích thước <code>tensor_bytes</code> từ vị trí hiện tại <code>current_offset</code>.`,
        standardRef: "TinyML (O'Reilly) Ch.8 / TFLite Micro Specs",
        bookId: "book_tinyml_oreilly",
        realWorld: `Phân bổ vùng nhớ Tensor Arena tĩnh cho TensorFlow Lite for Microcontrollers (TFLite Micro) trên SRAM nội bộ của ESP32-S3.`,
        whyMatters: `Mô hình mạng nơ-ron nhúng cần vùng đệm cố định cho Activation Tensors. Phân bổ tuần tự có kiểm soát offset giúp tái sử dụng bộ nhớ mà không cần can thiệp hệ điều hành.`,
        example: `Input: current_offset = 1024, tensor_bytes = 512 -> Output: 1536`,
        hint: `Cộng dồn offset: <code>return current_offset + tensor_bytes;</code>.`,
        initialCode: `int calc_arena_offset(int current_offset, int tensor_bytes) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_arena_offset(int current_offset, int tensor_bytes) {\n    return current_offset + tensor_bytes;\n}`,
        fnName: "calc_arena_offset",
        params: ["current_offset", "tensor_bytes"],
        testCases: [
            { input: [0, 1024], expected: 1024, label: "offset=0, size=1024" },
            { input: [1024, 512], expected: 1536, label: "offset=1024, size=512" },
            { input: [1536, 2048], expected: 3584, label: "offset=1536, size=2048" }
        ],
        linkedSkill: "Static Tensor Arena Allocation"
    },
    {
        id: "prob_8",
        stageIndex: 0,
        title: "Bài 8: Đảo Thứ Tự Byte 16-Bit (Endian Swap)",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Giao tiếp ngoại vi SPI/I2C thường trả dữ liệu Big-Endian trong khi ESP32 là Little-Endian. Hãy viết hàm đảo 2 byte của số nguyên 16-bit <code>val</code>: Byte cao thành Byte thấp và ngược lại.`,
        standardRef: "ISO/IEC 9899:2011 §6.2.6 / Expert C Programming Ch.4",
        bookId: "book_expert_c",
        realWorld: `Chuyển đổi thứ tự byte Big-Endian sang Little-Endian khi đọc khung truyền mạng CAN Bus (ISO 11898-1) hoặc gói tin TCP/IP Network Byte Order sang vi điều khiển ESP32-S3 Little-Endian.`,
        whyMatters: `ESP32-S3 là kiến trúc Little-Endian (byte thấp ở địa chỉ thấp). Nếu không hoán đổi thứ tự byte từ các giao thức mạng chuẩn quốc tế, giá trị cảm biến 16-bit đọc về sẽ bị sai lệch hoàn toàn.`,
        example: `Input: val = 0x1234 (4660) -> Output: 0x3412 (13330)`,
        hint: `Dịch bit: <code>((val & 0xFF) << 8) | ((val >> 8) & 0xFF)</code>.`,
        initialCode: `uint16_t swap_endian_16(uint16_t val) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint16_t swap_endian_16(uint16_t val) {\n    return ((val & 0xFF) << 8) | ((val >> 8) & 0xFF);\n}`,
        fnName: "swap_endian_16",
        params: ["val"],
        testCases: [
            { input: [4660], expected: 13330, label: "0x1234 -> 0x3412" },
            { input: [256], expected: 1, label: "0x0100 -> 0x0001" },
            { input: [1], expected: 256, label: "0x0001 -> 0x0100" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "prob_9",
        stageIndex: 0,
        title: "Bài 9: Tính Padding Của Struct Trong Bộ Nhớ",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Trình biên dịch C tự chèn byte padding để căn lề struct. Nếu trường dữ liệu có <code>data_bytes</code> và yêu cầu căn lề <code>align_bytes</code> (VD: 4 byte), hãy tính số byte padding bị lãng phí cần chèn vào sau trường này.`,
        standardRef: "ISO/IEC 9899:2011 §6.7.2.1 / Expert C Programming Ch.5",
        bookId: "book_expert_c",
        realWorld: `Tính toán lượng byte padding mà trình biên dịch GCC tự động chèn vào giữa các thành phần của struct cảm biến nhúng để đảm bảo căn lề từ nhớ 32-bit trong RAM.`,
        whyMatters: `Hiểu rõ cơ chế struct padding giúp kỹ sư sắp xếp lại thứ tự khai báo biến (từ lớn nhất đến nhỏ nhất), tiết kiệm hàng chục Kilobyte RAM quý giá khi tạo mảng hàng nghìn phần tử cảm biến.`,
        example: `Input: data_bytes = 5, align_bytes = 4 -> Padding: 3 byte (để lên 8)\nInput: data_bytes = 4, align_bytes = 4 -> Padding: 0 byte`,
        hint: `Công thức: <code>(align_bytes - (data_bytes % align_bytes)) % align_bytes</code>.`,
        initialCode: `int calc_struct_padding(int data_bytes, int align_bytes) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_struct_padding(int data_bytes, int align_bytes) {\n    return (align_bytes - (data_bytes % align_bytes)) % align_bytes;\n}`,
        fnName: "calc_struct_padding",
        params: ["data_bytes", "align_bytes"],
        testCases: [
            { input: [5, 4], expected: 3, label: "5 byte, align 4 -> pad 3" },
            { input: [4, 4], expected: 0, label: "4 byte, align 4 -> pad 0" },
            { input: [2, 4], expected: 2, label: "2 byte, align 4 -> pad 2" },
            { input: [7, 8], expected: 1, label: "7 byte, align 8 -> pad 1" }
        ],
        linkedSkill: "SIMD Vector Alignment"
    },
    {
        id: "prob_10",
        stageIndex: 0,
        title: "Bài 10: Nhận Diện Vùng Nhớ Internal SRAM ESP32",
        topic: "1. C & Bộ nhớ",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Tensor Arena phải nằm trong Internal SRAM (dải địa chỉ <code>0x3FFB0000</code> đến <code>0x3FFFFFFF</code>) để đạt tốc độ tối đa. Kiểm tra xem <code>address</code> có thuộc vùng nhớ này không. Trả về 1 nếu hợp lệ, 0 nếu là bộ nhớ ngoài PSRAM/Flash.`,
        standardRef: "ESP32-S3 TRM Ch.2 System Memory Map (Bản đồ địa chỉ)",
        bookId: "book_esps3_trm",
        realWorld: `Kiểm tra xem một con trỏ bộ nhớ có đang trỏ vào Internal SRAM (SRAM0/1/2 tốc độ 1-cycle) hay trỏ ra ngoài PSRAM ngoài chậm hơn 5 lần qua bus SPI.`,
        whyMatters: `Theo ESP32-S3 TRM Chương 2, Internal SRAM trải dài từ địa chỉ 0x3FC88000 đến 0x3FD00000 (khoảng 512KB). Đặt Tensor Arena và ISR Stack vào vùng này giúp mô hình AI đạt tốc độ suy luận tối đa.`,
        example: `Input: address = 0x3FFB1000 (1073426432) -> Output: 1\nInput: address = 0x3F800000 (PSRAM) -> Output: 0`,
        hint: `So sánh khoảng địa chỉ: <code>(address >= 1073414144 && address <= 1073741823) ? 1 : 0;</code>`,
        initialCode: `int is_in_internal_sram(uint32_t address) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_in_internal_sram(uint32_t address) {\n    return (address >= 1073414144 && address <= 1073741823) ? 1 : 0;\n}`,
        fnName: "is_in_internal_sram",
        params: ["address"],
        testCases: [
            { input: [1073426432], expected: 1, label: "0x3FFB1000 (SRAM) -> 1" },
            { input: [1065353216], expected: 0, label: "0x3F800000 (PSRAM) -> 0" },
            { input: [1073741823], expected: 1, label: "0x3FFFFFFF (Top SRAM) -> 1" },
            { input: [0], expected: 0, label: "0x00000000 -> 0" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "prob_11",
        stageIndex: 0,
        title: "Bài 11: Đảo Ngược 8 Bit Của Một Byte (Bit Reversal)",
        topic: "1. C & Bộ nhớ",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Một số giao thức SPI truyền bit theo thứ tự LSB-first. Hãy viết hàm đảo ngược thứ tự các bit của byte <code>b</code> (bit 0 đổi chỗ bit 7, bit 1 đổi chỗ bit 6,...).`,
        standardRef: "Oppenheim & Schafer Ch.9 / Cooley-Tukey Radix-2 FFT",
        bookId: "book_oppenheim_dsp",
        realWorld: `Đảo ngược vị trí các bit chỉ số mảng (Bit-Reversal Permutation) trong thuật toán biến đổi Fourier nhanh Cooley-Tukey Radix-2 FFT trên chip ESP32-S3.`,
        whyMatters: `Đây là bước sắp xếp dữ liệu cốt lõi trong thuật toán FFT kinh điển của Oppenheim, cho phép tính toán biến đổi phổ âm thanh và rung động In-Place trực tiếp trong cùng một mảng bộ nhớ.`,
        example: `Input: b = 0x80 (10000000b) -> Output: 1 (00000001b)\nInput: b = 0x0F (00001111b) -> Output: 0xF0 (240)`,
        hint: `Lặp 8 lần hoặc dịch bit: <code>uint8_t res = 0; for(int i=0; i<8; i++){ res = (res << 1) | ((b >> i) & 1); } return res;</code>`,
        initialCode: `uint8_t reverse_bits_8(uint8_t b) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t reverse_bits_8(uint8_t b) {\n    uint8_t res = 0;\n    for (int i = 0; i < 8; i++) {\n        res = (res << 1) | ((b >> i) & 1);\n    }\n    return res;\n}`,
        fnName: "reverse_bits_8",
        params: ["b"],
        testCases: [
            { input: [128], expected: 1, label: "10000000b -> 00000001b" },
            { input: [15], expected: 240, label: "00001111b -> 11110000b" },
            { input: [1], expected: 128, label: "00000001b -> 10000000b" },
            { input: [255], expected: 255, label: "11111111b -> 11111111b" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "prob_12",
        stageIndex: 0,
        title: "Bài 12: Đánh Giá Tỷ Lệ Phân Mảnh Heap (Fragmentation Ratio)",
        topic: "1. C & Bộ nhớ",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Để cảnh báo sớm tràn bộ nhớ, hệ thống tính tỷ lệ phần trăm phân mảnh: <code>frag_percent = (free_bytes - largest_block) * 100 / free_bytes</code>. Nếu <code>free_bytes <= 0</code>, trả về 0.`,
        standardRef: "SEI CERT C Rule MEM31-C / Expert C Ch.5",
        bookId: "book_sei_cert_c",
        realWorld: `Hàm giám sát tỷ lệ phân mảnh bộ nhớ Heap của thiết bị đo lường Edge AI gửi cảnh báo về máy chủ trung tâm trước khi xảy ra sự cố sập bộ nhớ.`,
        whyMatters: `Tỷ lệ phân mảnh cao đồng nghĩa với việc dù tổng dung lượng Heap còn trống nhiều nhưng không thể cấp phát nổi một mảng Tensor liên tục 32KB, dẫn đến crash thiết bị.`,
        example: `Input: free_bytes = 10000, largest_block = 6000 -> Output: 40%`,
        hint: `Phép tính: <code>if (free_bytes <= 0) return 0; return (free_bytes - largest_block) * 100 / free_bytes;</code>.`,
        initialCode: `int calc_heap_fragmentation_ratio(int free_bytes, int largest_block) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_heap_fragmentation_ratio(int free_bytes, int largest_block) {\n    if (free_bytes <= 0) return 0;\n    return (free_bytes - largest_block) * 100 / free_bytes;\n}`,
        fnName: "calc_heap_fragmentation_ratio",
        params: ["free_bytes", "largest_block"],
        testCases: [
            { input: [10000, 6000], expected: 40, label: "free=10k, largest=6k -> 40%" },
            { input: [10000, 10000], expected: 0, label: "không phân mảnh -> 0%" },
            { input: [5000, 1000], expected: 80, label: "phân mảnh nặng -> 80%" },
            { input: [0, 0], expected: 0, label: "free=0 -> 0%" }
        ],
        linkedSkill: "Heap Management & Anti-Fragmentation"
    },

    // =========================================================================
    // MODULE 2: TIMER PHẦN CỨNG GPTIMER & HÀM NGẮT ISR (STAGE 1) - 12 BÀI
    // =========================================================================
    {
        id: "prob_13",
        stageIndex: 1,
        title: "Bài 13: Kiểm Tra Cờ Báo Ngắt ISR (Interrupt Pending Flag)",
        topic: "2. Timer & Ngắt",
        difficulty: "Dễ",
        xp: 50,
        desc: `Trong hàm ngắt <code>IRAM_ATTR</code>, cần kiểm tra bit của kênh timer tương ứng trên thanh ghi trạng thái <code>intr_status_reg</code>. Trả về 1 nếu bit tại vị trí <code>timer_channel</code> được bật (HIGH), ngược lại trả về 0.`,
        standardRef: "ESP32-S3 TRM Ch.11 GPTimer Group / ISR Pending Status",
        bookId: "book_esps3_trm",
        example: `Input: intr_status_reg = 0x02, timer_channel = 1 -> Output: 1\nInput: intr_status_reg = 0x02, timer_channel = 0 -> Output: 0`,
        hint: `Dùng bit masking: <code>(intr_status_reg & (1 << timer_channel)) ? 1 : 0</code>.`,
        initialCode: `int is_interrupt_pending(uint32_t intr_status_reg, int timer_channel) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_interrupt_pending(uint32_t intr_status_reg, int timer_channel) {\n    return (intr_status_reg & (1 << timer_channel)) ? 1 : 0;\n}`,
        fnName: "is_interrupt_pending",
        params: ["intr_status_reg", "timer_channel"],
        testCases: [
            { input: [2, 1], expected: 1, label: "reg=0x02, ch=1" },
            { input: [2, 0], expected: 0, label: "reg=0x02, ch=0" },
            { input: [16, 4], expected: 1, label: "reg=0x10, ch=4" },
            { input: [0, 3], expected: 0, label: "reg=0x00, ch=3" }
        ],
        linkedSkill: "High-Speed IRAM_ATTR Interrupts"
    },
    {
        id: "prob_14",
        stageIndex: 1,
        title: "Bài 14: Bộ Đếm Tiết Lưu Đánh Thức Task (Deferred Processing)",
        topic: "2. Timer & Ngắt",
        difficulty: "Dễ",
        xp: 50,
        desc: `Để giảm tải chuyển ngữ cảnh CPU, hàm ngắt ISR chỉ gửi Semaphore đánh thức Task sau mỗi <code>threshold</code> lần ngắt. Hãy kiểm tra nếu số lần ngắt tích lũy <code>irq_count</code> chia hết cho <code>threshold</code> thì trả về 1, ngược lại trả về 0.`,
        standardRef: "FreeRTOS Kernel Book Ch.6 / Deferred Interrupt Handling",
        bookId: "book_freertos_kernel",
        example: `Input: irq_count = 10, threshold = 5 -> Output: 1\nInput: irq_count = 7, threshold = 5 -> Output: 0`,
        hint: `Sử dụng toán tử chia lấy dư: <code>(irq_count % threshold == 0) ? 1 : 0</code>.`,
        initialCode: `int should_wake_task(int irq_count, int threshold) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int should_wake_task(int irq_count, int threshold) {\n    return (irq_count % threshold == 0) ? 1 : 0;\n}`,
        fnName: "should_wake_task",
        params: ["irq_count", "threshold"],
        testCases: [
            { input: [10, 5], expected: 1, label: "count=10, thres=5" },
            { input: [7, 5], expected: 0, label: "count=7, thres=5" },
            { input: [100, 10], expected: 1, label: "count=100, thres=10" },
            { input: [15, 4], expected: 0, label: "count=15, thres=4" }
        ],
        linkedSkill: "Deferred ISR to Task Processing"
    },
    {
        id: "prob_15",
        stageIndex: 1,
        title: "Bài 15: Đổi Tần Số Lấy Mẫu Hz Sang Chu Kỳ Microsecond",
        topic: "2. Timer & Ngắt",
        difficulty: "Dễ",
        xp: 50,
        desc: `Để định cấu hình chu kỳ lấy mẫu cảm biến không bị jitter, hãy đổi tần số lấy mẫu <code>sample_rate_hz</code> sang chu kỳ lặp tính bằng micro-giây (µs): <code>period_us = 1000000 / sample_rate_hz</code>.`,
        standardRef: "ESP32-S3 TRM Ch.11 / Deterministic Sampling Rate",
        bookId: "book_esps3_trm",
        example: `Input: sample_rate_hz = 100 -> Output: 10000 µs (10ms)`,
        hint: `Chia nguyên: <code>return 1000000 / sample_rate_hz;</code>.`,
        initialCode: `int hz_to_period_us(int sample_rate_hz) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int hz_to_period_us(int sample_rate_hz) {\n    return 1000000 / sample_rate_hz;\n}`,
        fnName: "hz_to_period_us",
        params: ["sample_rate_hz"],
        testCases: [
            { input: [100], expected: 10000, label: "100Hz -> 10000µs" },
            { input: [1000], expected: 1000, label: "1000Hz -> 1000µs" },
            { input: [50], expected: 20000, label: "50Hz -> 20000µs" },
            { input: [200], expected: 5000, label: "200Hz -> 5000µs" }
        ],
        linkedSkill: "Deterministic Sensor Sampling Rate"
    },
    {
        id: "prob_16",
        stageIndex: 1,
        title: "Bài 16: Xóa Cờ Ngắt Trong Thanh Ghi (Clear Pending Flag)",
        topic: "2. Timer & Ngắt",
        difficulty: "Dễ",
        xp: 50,
        desc: `Sau khi thực thi xong hàm ngắt, bắt buộc phải xóa bit cờ ngắt của kênh <code>channel</code> trên thanh ghi <code>status_reg</code> để tránh CPU bị ngắt lặp vô tận.`,
        standardRef: "ESP32-S3 TRM Ch.11 Section 11.2 / Clock Prescaler",
        bookId: "book_esps3_trm",
        example: `Input: status_reg = 0x05 (101b), channel = 0 -> Output: 0x04 (100b)`,
        hint: `Xóa bit: <code>status_reg & ~(1 << channel)</code>.`,
        initialCode: `uint32_t clear_interrupt_flag(uint32_t status_reg, int channel) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t clear_interrupt_flag(uint32_t status_reg, int channel) {\n    return status_reg & ~(1 << channel);\n}`,
        fnName: "clear_interrupt_flag",
        params: ["status_reg", "channel"],
        testCases: [
            { input: [5, 0], expected: 4, label: "0x05, ch=0 -> 0x04" },
            { input: [15, 3], expected: 7, label: "0x0F, ch=3 -> 0x07" },
            { input: [2, 1], expected: 0, label: "0x02, ch=1 -> 0" }
        ],
        linkedSkill: "High-Speed IRAM_ATTR Interrupts"
    },
    {
        id: "prob_17",
        stageIndex: 1,
        title: "Bài 17: Tính Số Xung Nạp GPTimer (Hardware Timer)",
        topic: "2. Timer & Ngắt",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Để cấu hình GPTimer định kỳ ngắt mỗi <code>target_ms</code> mili-giây với xung nhịp <code>clock_hz</code> và bộ chia <code>prescaler</code>, hãy tính số xung (ticks) cần nạp: <code>ticks = (clock_hz / prescaler) * target_ms / 1000</code>.`,
        standardRef: "ESP32-S3 TRM Ch.11 Section 11.3 / Auto-Reload Mechanism",
        bookId: "book_esps3_trm",
        example: `Input: clock_hz=80000000, prescaler=80, target_ms=1 -> Output: 1000`,
        hint: `Công thức: <code>(clock_hz / prescaler) * target_ms / 1000</code>.`,
        initialCode: `uint32_t calc_timer_ticks(uint32_t clock_hz, uint32_t prescaler, uint32_t target_ms) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t calc_timer_ticks(uint32_t clock_hz, uint32_t prescaler, uint32_t target_ms) {\n    return (uint32_t)(((clock_hz / prescaler) * target_ms) / 1000);\n}`,
        fnName: "calc_timer_ticks",
        params: ["clock_hz", "prescaler", "target_ms"],
        testCases: [
            { input: [80000000, 80, 1], expected: 1000, label: "80MHz, div 80, 1ms" },
            { input: [80000000, 80, 10], expected: 10000, label: "80MHz, div 80, 10ms" },
            { input: [40000000, 40, 1], expected: 1000, label: "40MHz, div 40, 1ms" }
        ],
        linkedSkill: "Microsecond Hardware GPTimer"
    },
    {
        id: "prob_18",
        stageIndex: 1,
        title: "Bài 18: Tính Hệ Số Chia Prescaler Để Timer Chạy Ở 1MHz",
        topic: "2. Timer & Ngắt",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Để bộ đếm GPTimer tăng đúng 1 tick mỗi 1 micro-giây (1MHz), tính hệ số chia <code>prescaler = clock_hz / 1000000</code>.`,
        standardRef: "SEI CERT C ARR30-C / Lock-Free Ring Buffer",
        bookId: "book_sei_cert_c",
        example: `Input: clock_hz = 80000000 (80MHz APB Clock) -> Output: 80`,
        hint: `Chia đơn giản: <code>return clock_hz / 1000000;</code>.`,
        initialCode: `uint32_t calc_prescaler_1mhz(uint32_t clock_hz) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t calc_prescaler_1mhz(uint32_t clock_hz) {\n    return clock_hz / 1000000;\n}`,
        fnName: "calc_prescaler_1mhz",
        params: ["clock_hz"],
        testCases: [
            { input: [80000000], expected: 80, label: "80MHz -> 80" },
            { input: [40000000], expected: 40, label: "40MHz -> 40" },
            { input: [160000000], expected: 160, label: "160MHz -> 160" }
        ],
        linkedSkill: "Microsecond Hardware GPTimer"
    },
    {
        id: "prob_19",
        stageIndex: 1,
        title: "Bài 19: Bộ Lọc Khử Rung Phím Bấm Phần Mềm (Debounce)",
        topic: "2. Timer & Ngắt",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Khi nút bấm rung, hàm định thời kiểm tra trạng thái <code>raw_state</code>. Nếu <code>raw_state == 1</code> và giống với <code>last_state</code>, hãy tăng <code>hold_count</code> lên 1. Nếu không, đặt lại <code>hold_count = 0</code>.`,
        standardRef: "SEI CERT C ARR30-C / Single-Producer Single-Consumer Buffer",
        bookId: "book_sei_cert_c",
        example: `Input: raw = 1, last = 1, count = 3 -> Output: 4\nInput: raw = 0, last = 1, count = 3 -> Output: 0`,
        hint: `Điều kiện: <code>(raw_state == 1 && raw_state == last_state) ? hold_count + 1 : 0;</code>`,
        initialCode: `int debounce_press(int raw_state, int last_state, int hold_count) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int debounce_press(int raw_state, int last_state, int hold_count) {\n    return (raw_state == 1 && raw_state == last_state) ? (hold_count + 1) : 0;\n}`,
        fnName: "debounce_press",
        params: ["raw_state", "last_state", "hold_count"],
        testCases: [
            { input: [1, 1, 3], expected: 4, label: "ổn định mức 1 -> tăng lên 4" },
            { input: [0, 1, 3], expected: 0, label: "rớt mức 0 -> reset 0" },
            { input: [1, 0, 0], expected: 0, label: "mới đổi trạng thái -> 0" }
        ],
        linkedSkill: "Deterministic Sensor Sampling Rate"
    },
    {
        id: "prob_20",
        stageIndex: 1,
        title: "Bài 20: Kiểm Tra Hết Hạn Timeout Bộ Đếm Ticks",
        topic: "2. Timer & Ngắt",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Kiểm tra xem khoảng thời gian từ <code>start_ticks</code> đến <code>current_ticks</code> có lớn hơn hoặc bằng <code>timeout_ticks</code> hay chưa. Trả về 1 nếu đã hết hạn timeout, 0 nếu vẫn còn trong hạn.`,
        standardRef: "Mastering FreeRTOS Real Time Kernel Ch.3 / Tick Management",
        bookId: "book_freertos_kernel",
        example: `Input: start = 100, current = 250, timeout = 120 -> 150 >= 120 -> Output: 1`,
        hint: `So sánh hiệu: <code>(current_ticks - start_ticks >= timeout_ticks) ? 1 : 0;</code>`,
        initialCode: `int is_timer_expired(uint32_t start_ticks, uint32_t current_ticks, uint32_t timeout_ticks) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_timer_expired(uint32_t start_ticks, uint32_t current_ticks, uint32_t timeout_ticks) {\n    return (current_ticks - start_ticks >= timeout_ticks) ? 1 : 0;\n}`,
        fnName: "is_timer_expired",
        params: ["start_ticks", "current_ticks", "timeout_ticks"],
        testCases: [
            { input: [100, 250, 120], expected: 1, label: "đã quá hạn -> 1" },
            { input: [100, 180, 120], expected: 0, label: "chưa quá hạn -> 0" },
            { input: [0, 100, 100], expected: 1, label: "vừa đúng hạn -> 1" }
        ],
        linkedSkill: "Microsecond Hardware GPTimer"
    },
    {
        id: "prob_21",
        stageIndex: 1,
        title: "Bài 21: Tính Số Counts Cho Xung PWM (Duty Cycle)",
        topic: "2. Timer & Ngắt",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Timer phần cứng điều khiển xung PWM với độ phân giải tối đa <code>max_counts</code> (VD: 1023 cho 10-bit). Hãy tính số counts cần nạp để đạt tỷ lệ <code>duty_percent</code> (0 đến 100%): <code>counts = (duty_percent * max_counts) / 100</code>.`,
        standardRef: "ESP32-S3 TRM Ch.5 / GPIO Deglitch & Debounce",
        bookId: "book_esps3_trm",
        example: `Input: duty_percent = 50, max_counts = 1000 -> Output: 500`,
        hint: `Công thức: <code>(duty_percent * max_counts) / 100</code>.`,
        initialCode: `uint32_t calc_pwm_duty_counts(uint32_t duty_percent, uint32_t max_counts) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t calc_pwm_duty_counts(uint32_t duty_percent, uint32_t max_counts) {\n    return (duty_percent * max_counts) / 100;\n}`,
        fnName: "calc_pwm_duty_counts",
        params: ["duty_percent", "max_counts"],
        testCases: [
            { input: [50, 1000], expected: 500, label: "50% của 1000" },
            { input: [100, 1023], expected: 1023, label: "100% của 1023" },
            { input: [0, 1023], expected: 0, label: "0% của 1023" },
            { input: [25, 400], expected: 100, label: "25% của 400" }
        ],
        linkedSkill: "Microsecond Hardware GPTimer"
    },
    {
        id: "prob_22",
        stageIndex: 1,
        title: "Bài 22: Đo Độ Rộng Xung Microsecond (Input Capture)",
        topic: "2. Timer & Ngắt",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Cơ chế Input Capture của timer ghi nhận tick tại sườn lên <code>tick_start</code> và sườn xuống <code>tick_end</code>. Hãy tính độ rộng xung theo micro-giây: <code>width_us = (tick_end - tick_start) / ticks_per_us</code>.`,
        standardRef: "MLPerf Tiny Benchmark (NeurIPS 2021) / Latency Profiling",
        bookId: "book_mlperf_tiny",
        example: `Input: tick_start = 1000, tick_end = 5000, ticks_per_us = 80 -> Output: 50 µs`,
        hint: `Hiệu số chia cho số tick trên micro-giây: <code>(tick_end - tick_start) / ticks_per_us</code>.`,
        initialCode: `uint32_t detect_pulse_width_us(uint32_t tick_start, uint32_t tick_end, uint32_t ticks_per_us) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t detect_pulse_width_us(uint32_t tick_start, uint32_t tick_end, uint32_t ticks_per_us) {\n    return (tick_end - tick_start) / ticks_per_us;\n}`,
        fnName: "detect_pulse_width_us",
        params: ["tick_start", "tick_end", "ticks_per_us"],
        testCases: [
            { input: [1000, 5000, 80], expected: 50, label: "4000 ticks / 80 -> 50µs" },
            { input: [0, 8000, 80], expected: 100, label: "8000 ticks / 80 -> 100µs" },
            { input: [1000, 1000, 80], expected: 0, label: "0µs" }
        ],
        linkedSkill: "Microsecond Hardware GPTimer"
    },
    {
        id: "prob_23",
        stageIndex: 1,
        title: "Bài 23: Tính Độ Lệch Thời Gian Lấy Mẫu (Sampling Jitter)",
        topic: "2. Timer & Ngắt",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Trong thu thập tín hiệu cho AI, độ lệch jitter đo bằng nano-giây là sai số tuyệt đối giữa chu kỳ thực tế <code>actual_ns</code> và chu kỳ lý thuyết <code>expected_ns</code>. Tính <code>abs(actual_ns - expected_ns)</code>.`,
        standardRef: "ESP32-S3 TRM Ch.11 / Hardware Alarm Comparator",
        bookId: "book_esps3_trm",
        example: `Input: expected = 10000, actual = 10050 -> Output: 50 ns`,
        hint: `Hiệu tuyệt đối: <code>actual_ns >= expected_ns ? (actual_ns - expected_ns) : (expected_ns - actual_ns);</code>`,
        initialCode: `uint32_t calc_sampling_jitter_ns(uint32_t expected_ns, uint32_t actual_ns) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t calc_sampling_jitter_ns(uint32_t expected_ns, uint32_t actual_ns) {\n    return actual_ns >= expected_ns ? (actual_ns - expected_ns) : (expected_ns - actual_ns);\n}`,
        fnName: "calc_sampling_jitter_ns",
        params: ["expected_ns", "actual_ns"],
        testCases: [
            { input: [10000, 10050], expected: 50, label: "+50ns jitter" },
            { input: [10000, 9980], expected: 20, label: "-20ns jitter" },
            { input: [10000, 10000], expected: 0, label: "0ns (zero jitter)" }
        ],
        linkedSkill: "Deterministic Sensor Sampling Rate"
    },
    {
        id: "prob_24",
        stageIndex: 1,
        title: "Bài 24: Hoán Đổi Bộ Đệm Kép DMA Ping-Pong (Double Buffering)",
        topic: "2. Timer & Ngắt",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Cơ chế DMA Ping-Pong dùng 2 mảng đệm (chỉ số 0 và 1). Khi bộ đệm <code>current_buf_idx</code> đầy và phát ngắt, DMA phải chuyển sang ghi vào bộ đệm còn lại. Viết hàm trả về chỉ số bộ đệm tiếp theo: <code>1 - current_buf_idx</code>.`,
        standardRef: "FreeRTOS Kernel Book Ch.6 / MISRA C:2012 ISR Execution Limit",
        bookId: "book_freertos_kernel",
        example: `Input: current_buf_idx = 0 -> Output: 1\nInput: current_buf_idx = 1 -> Output: 0`,
        hint: `Đổi trạng thái: <code>return 1 - current_buf_idx;</code> hoặc <code>current_buf_idx ^ 1</code>.`,
        initialCode: `int manage_ping_pong_buffer(int current_buf_idx) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int manage_ping_pong_buffer(int current_buf_idx) {\n    return 1 - current_buf_idx;\n}`,
        fnName: "manage_ping_pong_buffer",
        params: ["current_buf_idx"],
        testCases: [
            { input: [0], expected: 1, label: "buf 0 -> buf 1" },
            { input: [1], expected: 0, label: "buf 1 -> buf 0" }
        ],
        linkedSkill: "Deferred ISR to Task Processing"
    },

    // =========================================================================
    // MODULE 3: CẢM BIẾN & THU THẬP DỮ LIỆU (STAGE 2) - 12 BÀI
    // =========================================================================
    {
        id: "prob_25",
        stageIndex: 2,
        title: "Bài 25: Khử Mức DC Offset Trong Tín Hiệu Âm Thanh I2S",
        topic: "3. Cảm Biến",
        difficulty: "Dễ",
        xp: 50,
        desc: `Microphone I2S thường bị lệch một mức điện áp tĩnh (DC Offset). Hãy khử giá trị lệch <code>dc_bias</code> khỏi mẫu đo <code>raw_sample</code> để đưa tín hiệu về dao động quanh điểm 0.`,
        standardRef: "ESP32-S3 TRM Ch.26 I2C Master / Sensor Data Merging",
        bookId: "book_esps3_trm",
        example: `Input: raw_sample = 2050, dc_bias = 2048 -> Output: 2`,
        hint: `Phép trừ đơn giản: <code>return raw_sample - dc_bias;</code>.`,
        initialCode: `int remove_dc_offset(int raw_sample, int dc_bias) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int remove_dc_offset(int raw_sample, int dc_bias) {\n    return raw_sample - dc_bias;\n}`,
        fnName: "remove_dc_offset",
        params: ["raw_sample", "dc_bias"],
        testCases: [
            { input: [2050, 2048], expected: 2, label: "sample=2050, bias=2048" },
            { input: [2040, 2048], expected: -8, label: "sample=2040, bias=2048" },
            { input: [2048, 2048], expected: 0, label: "sample=2048, bias=2048" }
        ],
        linkedSkill: "I2S Digital Microphone Streaming"
    },
    {
        id: "prob_26",
        stageIndex: 2,
        title: "Bài 26: Bộ Lọc Trung Bình Động 3 Điểm (Moving Average)",
        topic: "3. Cảm Biến",
        difficulty: "Dễ",
        xp: 50,
        desc: `Lọc nhiễu cao tần cho tín hiệu cảm biến rung động bằng cách tính trung bình cộng của 3 mẫu đo liên tiếp gần nhất: <code>(s0 + s1 + s2) / 3</code>.`,
        standardRef: "ISO/IEC 9899:2011 §6.2.6.2 / Two's Complement Sign Extension",
        bookId: "book_iso_c11_standard",
        example: `Input: s0 = 10, s1 = 12, s2 = 14 -> Output: 12`,
        hint: `Cộng 3 mẫu và chia cho 3: <code>return (s0 + s1 + s2) / 3;</code>.`,
        initialCode: `int moving_average_3(int s0, int s1, int s2) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int moving_average_3(int s0, int s1, int s2) {\n    return (s0 + s1 + s2) / 3;\n}`,
        fnName: "moving_average_3",
        params: ["s0", "s1", "s2"],
        testCases: [
            { input: [10, 12, 14], expected: 12, label: "s=[10, 12, 14]" },
            { input: [30, 30, 30], expected: 30, label: "s=[30, 30, 30]" },
            { input: [0, 10, 20], expected: 10, label: "s=[0, 10, 20]" },
            { input: [-6, 0, 6], expected: 0, label: "s=[-6, 0, 6]" }
        ],
        linkedSkill: "Digital Signal Noise Filtering"
    },
    {
        id: "prob_27",
        stageIndex: 2,
        title: "Bài 27: Phát Hiện Bão Hòa Tín Hiệu (Signal Clipping)",
        topic: "3. Cảm Biến",
        difficulty: "Dễ",
        xp: 50,
        desc: `Tín hiệu âm thanh hoặc cảm biến bị bão hòa (clipping) khi mẫu đo chạm ngưỡng biên độ tối đa <code>max_val</code> hoặc tối thiểu <code>min_val</code>. Trả về 1 nếu bị clipping, ngược lại 0.`,
        standardRef: "Oppenheim & Schafer Ch.7 / Moving Average Filter",
        bookId: "book_oppenheim_dsp",
        example: `Input: sample = 32767, min = -32768, max = 32767 -> Output: 1\nInput: sample = 1000, min = -32768, max = 32767 -> Output: 0`,
        hint: `Kiểm tra biên: <code>(sample <= min_val || sample >= max_val) ? 1 : 0;</code>`,
        initialCode: `int detect_clipping(int sample, int min_val, int max_val) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int detect_clipping(int sample, int min_val, int max_val) {\n    return (sample <= min_val || sample >= max_val) ? 1 : 0;\n}`,
        fnName: "detect_clipping",
        params: ["sample", "min_val", "max_val"],
        testCases: [
            { input: [32767, -32768, 32767], expected: 1, label: "chạm max -> clipping" },
            { input: [-32768, -32768, 32767], expected: 1, label: "chạm min -> clipping" },
            { input: [1000, -32768, 32767], expected: 0, label: "trong khoảng -> OK" }
        ],
        linkedSkill: "I2S Digital Microphone Streaming"
    },
    {
        id: "prob_28",
        stageIndex: 2,
        title: "Bài 28: Tính Chỉ Số Mảng Xen Kẽ Kênh (Interleaved Striding)",
        topic: "3. Cảm Biến",
        difficulty: "Dễ",
        xp: 50,
        desc: `Dữ liệu âm thanh nổi (Stereo) lưu xen kẽ [Trái, Phải, Trái, Phải,...]. Tính chỉ số phần tử trong mảng cho khung mẫu số <code>frame_idx</code>, kênh <code>channel</code> (0 là Trái, 1 là Phải) với độ sải bước <code>stride = 2</code>: <code>index = frame_idx * stride + channel</code>.`,
        standardRef: "Discrete-Time Signal Processing (Oppenheim) / Nonlinear Median Filter",
        bookId: "book_oppenheim_dsp",
        example: `Input: frame_idx = 3, channel = 1, stride = 2 -> Output: 7`,
        hint: `Công thức: <code>frame_idx * stride + channel</code>.`,
        initialCode: `int calc_sample_stride_index(int frame_idx, int channel, int stride) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_sample_stride_index(int frame_idx, int channel, int stride) {\n    return frame_idx * stride + channel;\n}`,
        fnName: "calc_sample_stride_index",
        params: ["frame_idx", "channel", "stride"],
        testCases: [
            { input: [3, 1, 2], expected: 7, label: "frame 3, channel 1, stride 2 -> 7" },
            { input: [0, 0, 2], expected: 0, label: "frame 0, channel 0, stride 2 -> 0" },
            { input: [5, 2, 3], expected: 17, label: "frame 5, channel 2, stride 3 -> 17" }
        ],
        linkedSkill: "I2S Digital Microphone Streaming"
    },
    {
        id: "prob_29",
        stageIndex: 2,
        title: "Bài 29: Ghép 2 Byte Cảm Biến I2C (Big-Endian IMU)",
        topic: "3. Cảm Biến",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Cảm biến chuyển động IMU MPU6050 trả về dữ liệu trục gia tốc gồm 2 byte Big-Endian. Hãy ghép byte cao <code>msb</code> và byte thấp <code>lsb</code> thành số nguyên 16-bit có dấu.`,
        standardRef: "ESP32-S3 TRM Ch.29 I2S DMA / Digital Audio DC Blocking",
        bookId: "book_oppenheim_dsp",
        example: `Input: msb = 0x01, lsb = 0x00 -> Output: 256`,
        hint: `Sử dụng dịch bit: <code>(int16_t)((msb << 8) | lsb)</code>.`,
        initialCode: `int16_t combine_bytes(uint8_t msb, uint8_t lsb) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int16_t combine_bytes(uint8_t msb, uint8_t lsb) {\n    return (int16_t)((msb << 8) | lsb);\n}`,
        fnName: "combine_bytes",
        params: ["msb", "lsb"],
        testCases: [
            { input: [1, 0], expected: 256, label: "msb=0x01, lsb=0x00" },
            { input: [18, 52], expected: 4660, label: "msb=0x12, lsb=0x34" },
            { input: [0, 255], expected: 255, label: "msb=0x00, lsb=0xFF" }
        ],
        linkedSkill: "I2C/SPI 6-Axis IMU Driver"
    },
    {
        id: "prob_30",
        stageIndex: 2,
        title: "Bài 30: Chuẩn Hóa Min-Max Đặc Trưng AI (Feature Normalization)",
        topic: "3. Cảm Biến",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Chuẩn hóa giá trị đặc trưng cảm biến <code>val</code> trong khoảng [min_val, max_val] về thang phần trăm từ 0 đến 100: <code>percent = (val - min_val) * 100 / (max_val - min_val)</code>.`,
        standardRef: "TinyML (O'Reilly) Ch.7 / Feature Normalization Min-Max",
        bookId: "book_tinyml_oreilly",
        example: `Input: val = 50, min_val = 0, max_val = 100 -> Output: 50`,
        hint: `Công thức: <code>(int)(((val - min_val) * 100) / (max_val - min_val))</code>.`,
        initialCode: `int normalize_min_max(int val, int min_val, int max_val) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int normalize_min_max(int val, int min_val, int max_val) {\n    return (int)(((val - min_val) * 100) / (max_val - min_val));\n}`,
        fnName: "normalize_min_max",
        params: ["val", "min_val", "max_val"],
        testCases: [
            { input: [50, 0, 100], expected: 50, label: "val=50 [0..100]" },
            { input: [25, 0, 50], expected: 50, label: "val=25 [0..50]" },
            { input: [150, 100, 200], expected: 50, label: "val=150 [100..200]" },
            { input: [0, 0, 100], expected: 0, label: "val=0 [0..100]" }
        ],
        linkedSkill: "Normalization & FFT Feature Extraction"
    },
    {
        id: "prob_31",
        stageIndex: 2,
        title: "Bài 31: Giới Hạn Biên Độ Tín Hiệu (Signal Clamping)",
        topic: "3. Cảm Biến",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Giới hạn giá trị <code>val</code> không được vượt quá khoảng [min_limit, max_limit]. Nếu nhỏ hơn min_limit thì gán bằng min_limit, nếu lớn hơn max_limit thì gán bằng max_limit.`,
        standardRef: "Benoit Jacob et al. 2018 CVPR / Clamping Function",
        bookId: "book_jacob_quantization",
        example: `Input: val = 150, min = 0, max = 100 -> Output: 100\nInput: val = -20, min = 0, max = 100 -> Output: 0`,
        hint: `Toán tử 3 ngôi: <code>val < min_limit ? min_limit : (val > max_limit ? max_limit : val);</code>`,
        initialCode: `int clamp_signal(int val, int min_limit, int max_limit) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int clamp_signal(int val, int min_limit, int max_limit) {\n    if (val < min_limit) return min_limit;\n    if (val > max_limit) return max_limit;\n    return val;\n}`,
        fnName: "clamp_signal",
        params: ["val", "min_limit", "max_limit"],
        testCases: [
            { input: [150, 0, 100], expected: 100, label: "vượt trên -> 100" },
            { input: [-20, 0, 100], expected: 0, label: "vượt dưới -> 0" },
            { input: [50, 0, 100], expected: 50, label: "hợp lệ -> 50" }
        ],
        linkedSkill: "Digital Signal Noise Filtering"
    },
    {
        id: "prob_32",
        stageIndex: 2,
        title: "Bài 32: Tính Bình Phương Biên Độ Gia Tốc 3 Trục (Magnitude)",
        topic: "3. Cảm Biến",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Để phát hiện rung động máy hoặc ngã, tính tổng bình phương của 3 trục gia tốc x, y, z: <code>mag_sq = x*x + y*y + z*z</code> (tránh tính căn bậc hai để tối ưu CPU).`,
        standardRef: "TinyML (O'Reilly) Ch.10 / 3-Axis IMU Magnitude",
        bookId: "book_tinyml_oreilly",
        example: `Input: x = 3, y = 4, z = 0 -> Output: 25`,
        hint: `Tổng bình phương: <code>return x*x + y*y + z*z;</code>.`,
        initialCode: `int calc_magnitude_squared(int x, int y, int z) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_magnitude_squared(int x, int y, int z) {\n    return x*x + y*y + z*z;\n}`,
        fnName: "calc_magnitude_squared",
        params: ["x", "y", "z"],
        testCases: [
            { input: [3, 4, 0], expected: 25, label: "3^2 + 4^2 = 25" },
            { input: [1, 2, 2], expected: 9, label: "1^2 + 2^2 + 2^2 = 9" },
            { input: [0, 0, 0], expected: 0, label: "0" }
        ],
        linkedSkill: "I2C/SPI 6-Axis IMU Driver"
    },
    {
        id: "prob_33",
        stageIndex: 2,
        title: "Bài 33: Bộ Lọc Trung Bình Lũy Thừa (Exponential Filter)",
        topic: "3. Cảm Biến",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Bộ lọc EMA làm mượt tín hiệu theo hệ số <code>alpha_percent</code> (0-100%): <code>out = (prev_val * (100 - alpha_percent) + new_val * alpha_percent) / 100</code>.`,
        standardRef: "Oppenheim & Schafer Ch.7 / First-Order IIR Exponential Filter",
        bookId: "book_oppenheim_dsp",
        example: `Input: prev = 100, new = 200, alpha = 20 -> (100*80 + 200*20)/100 = 120`,
        hint: `Công thức số nguyên: <code>(prev_val * (100 - alpha_percent) + new_val * alpha_percent) / 100</code>.`,
        initialCode: `int exponential_smoothing(int prev_val, int new_val, int alpha_percent) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int exponential_smoothing(int prev_val, int new_val, int alpha_percent) {\n    return (prev_val * (100 - alpha_percent) + new_val * alpha_percent) / 100;\n}`,
        fnName: "exponential_smoothing",
        params: ["prev_val", "new_val", "alpha_percent"],
        testCases: [
            { input: [100, 200, 20], expected: 120, label: "prev=100, new=200, a=20%" },
            { input: [50, 50, 30], expected: 50, label: "ổn định 50" },
            { input: [0, 100, 50], expected: 50, label: "prev=0, new=100, a=50%" }
        ],
        linkedSkill: "Digital Signal Noise Filtering"
    },
    {
        id: "prob_34",
        stageIndex: 2,
        title: "Bài 34: Đo Biên Độ Đỉnh-Tới-Đỉnh (Peak-to-Peak Amplitude)",
        topic: "3. Cảm Biến",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Tính khoảng dao động đỉnh tới đỉnh (Peak-to-Peak) của một chu kỳ sóng cảm biến: <code>vpp = max_sample - min_sample</code>.`,
        standardRef: "ISO 10816 Mechanical Vibration Standards / Peak-to-Peak",
        bookId: "book_oppenheim_dsp",
        example: `Input: min_sample = -1500, max_sample = 2500 -> Output: 4000`,
        hint: `Hiệu giữa max và min: <code>return max_sample - min_sample;</code>.`,
        initialCode: `int extract_peak_to_peak(int min_sample, int max_sample) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int extract_peak_to_peak(int min_sample, int max_sample) {\n    return max_sample - min_sample;\n}`,
        fnName: "extract_peak_to_peak",
        params: ["min_sample", "max_sample"],
        testCases: [
            { input: [-1500, 2500], expected: 4000, label: "2500 - (-1500) = 4000" },
            { input: [0, 1024], expected: 1024, label: "1024 - 0 = 1024" },
            { input: [50, 50], expected: 0, label: "không dao động = 0" }
        ],
        linkedSkill: "Normalization & FFT Feature Extraction"
    },
    {
        id: "prob_35",
        stageIndex: 2,
        title: "Bài 35: Đếm Số Lần Đổi Dấu Tín Hiệu (Zero Crossing Rate)",
        topic: "3. Cảm Biến",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Zero Crossing Rate (ZCR) là đặc trưng phân loại âm thanh (tiếng gió vs lời nói). Cho 4 mẫu liên tiếp [s0, s1, s2, s3], hãy đếm có bao nhiêu lần tín hiệu đổi dấu qua điểm 0 (tức là <code>s[i] * s[i+1] < 0</code>).`,
        standardRef: "Oppenheim & Schafer Ch.10 / Zero Crossing Rate (ZCR)",
        bookId: "book_oppenheim_dsp",
        example: `Input: s0=10, s1=-5, s2=8, s3=12 -> Đổi dấu 2 lần (10->-5 và -5->8) -> Output: 2`,
        hint: `Kiểm tra từng cặp: <code>int zcr = 0; if (s0*s1 < 0) zcr++; if (s1*s2 < 0) zcr++; if (s2*s3 < 0) zcr++; return zcr;</code>`,
        initialCode: `int calc_zero_crossing_rate(int s0, int s1, int s2, int s3) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_zero_crossing_rate(int s0, int s1, int s2, int s3) {\n    int count = 0;\n    if ((s0 > 0 && s1 < 0) || (s0 < 0 && s1 > 0)) count++;\n    if ((s1 > 0 && s2 < 0) || (s1 < 0 && s2 > 0)) count++;\n    if ((s2 > 0 && s3 < 0) || (s2 < 0 && s3 > 0)) count++;\n    return count;\n}`,
        fnName: "calc_zero_crossing_rate",
        params: ["s0", "s1", "s2", "s3"],
        testCases: [
            { input: [10, -5, 8, 12], expected: 2, label: "đổi dấu 2 lần" },
            { input: [5, 10, 15, 20], expected: 0, label: "toàn dương -> 0" },
            { input: [1, -1, 1, -1], expected: 3, label: "đổi dấu 3 lần" }
        ],
        linkedSkill: "Normalization & FFT Feature Extraction"
    },
    {
        id: "prob_36",
        stageIndex: 2,
        title: "Bài 36: Tính Tần Số Trung Tâm Thùng FFT (FFT Bin to Frequency)",
        topic: "3. Cảm Biến",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Sau khi biến đổi FFT với kích thước <code>fft_size</code> và tần số lấy mẫu <code>sample_rate</code>, tính tần số trung tâm của thùng (bin) thứ <code>bin_index</code>: <code>freq = (bin_index * sample_rate) / fft_size</code>.`,
        standardRef: "Oppenheim & Schafer Ch.9 / Nyquist-Shannon Sampling Theorem",
        bookId: "book_oppenheim_dsp",
        example: `Input: bin_index = 8, sample_rate = 16000, fft_size = 512 -> (8 * 16000) / 512 = 250 Hz`,
        hint: `Công thức: <code>(bin_index * sample_rate) / fft_size</code>.`,
        initialCode: `int fft_bin_to_frequency(int bin_index, int sample_rate, int fft_size) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int fft_bin_to_frequency(int bin_index, int sample_rate, int fft_size) {\n    return (bin_index * sample_rate) / fft_size;\n}`,
        fnName: "fft_bin_to_frequency",
        params: ["bin_index", "sample_rate", "fft_size"],
        testCases: [
            { input: [8, 16000, 512], expected: 250, label: "bin 8 -> 250Hz" },
            { input: [16, 16000, 512], expected: 500, label: "bin 16 -> 500Hz" },
            { input: [0, 16000, 512], expected: 0, label: "bin 0 -> DC (0Hz)" }
        ],
        linkedSkill: "Normalization & FFT Feature Extraction"
    },

    // =========================================================================
    // MODULE 4: MULTIPLE TASK (ĐA NHIỆM FREERTOS) (STAGE 3) - 12 BÀI
    // =========================================================================
    {
        id: "prob_37",
        stageIndex: 3,
        title: "Bài 37: Phân Chia Core CPU FreeRTOS (Core Affinity Pinning)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Dễ",
        xp: 50,
        desc: `Trên ESP32-S3 Dual-Core, Core 0 phụ trách Network/Wi-Fi/IO, còn Core 1 tối ưu cho tính toán AI & DSP. Hãy viết hàm nhận <code>is_ai_task</code> (1 nếu là tác vụ AI, 0 nếu là tác vụ mạng) và trả về số hiệu Core (0 hoặc 1).`,
        standardRef: "Mastering FreeRTOS Real Time Kernel Ch.9 / SMP Multi-Core",
        bookId: "book_freertos_kernel",
        example: `Input: is_ai_task = 1 -> Output: 1 (Ghim vào Core 1)\nInput: is_ai_task = 0 -> Output: 0 (Ghim vào Core 0)`,
        hint: `Toán tử điều kiện: <code>return is_ai_task ? 1 : 0;</code>.`,
        initialCode: `int select_task_core(int is_ai_task) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int select_task_core(int is_ai_task) {\n    return is_ai_task ? 1 : 0;\n}`,
        fnName: "select_task_core",
        params: ["is_ai_task"],
        testCases: [
            { input: [1], expected: 1, label: "is_ai_task=1 -> Core 1" },
            { input: [0], expected: 0, label: "is_ai_task=0 -> Core 0" }
        ],
        linkedSkill: "Dual-Core Asymmetric Task Pinning"
    },
    {
        id: "prob_38",
        stageIndex: 3,
        title: "Bài 38: Kiểm Tra Khe Trống Hàng Đợi (Queue Free Spaces)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Dễ",
        xp: 50,
        desc: `Để tránh Task bị treo (block) khi gửi dữ liệu vào Queue đã đầy, hãy tính số lượng vị trí còn trống trong hàng đợi: <code>free_space = queue_len - current_messages</code>. Nếu hàng đợi đã đầy (current_messages >= queue_len), trả về 0.`,
        standardRef: "FreeRTOS Kernel Book Ch.4 / Queue Space Monitoring",
        bookId: "book_freertos_kernel",
        example: `Input: queue_len = 10, current_messages = 7 -> Output: 3`,
        hint: `int free = queue_len - current_messages; return free > 0 ? free : 0;`,
        initialCode: `int calc_queue_free_space(int queue_len, int current_messages) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_queue_free_space(int queue_len, int current_messages) {\n    int free = queue_len - current_messages;\n    return free > 0 ? free : 0;\n}`,
        fnName: "calc_queue_free_space",
        params: ["queue_len", "current_messages"],
        testCases: [
            { input: [10, 7], expected: 3, label: "len=10, cur=7" },
            { input: [10, 10], expected: 0, label: "len=10, cur=10 (đầy)" },
            { input: [20, 5], expected: 15, label: "len=20, cur=5" },
            { input: [5, 6], expected: 0, label: "len=5, cur=6" }
        ],
        linkedSkill: "Mutex & Resource Locking"
    },
    {
        id: "prob_39",
        stageIndex: 3,
        title: "Bài 39: Kiểm Tra Tác Vụ Ưu Tiên Cao (High Priority Check)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Dễ",
        xp: 50,
        desc: `Trong FreeRTOS, số ưu tiên càng lớn thì độ ưu tiên càng cao. Kiểm tra xem <code>task_prio</code> có lớn hơn hoặc bằng mức ưu tiên hệ thống <code>threshold_prio</code> hay không. Trả về 1 nếu ưu tiên cao, 0 nếu là tác vụ nền (background).`,
        standardRef: "FreeRTOS Kernel Book Ch.3 / Task Priority Hierarchy",
        bookId: "book_freertos_kernel",
        example: `Input: task_prio = 5, threshold = 3 -> Output: 1\nInput: task_prio = 1, threshold = 3 -> Output: 0`,
        hint: `So sánh: <code>task_prio >= threshold_prio ? 1 : 0;</code>`,
        initialCode: `int is_high_priority_task(int task_prio, int threshold_prio) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_high_priority_task(int task_prio, int threshold_prio) {\n    return task_prio >= threshold_prio ? 1 : 0;\n}`,
        fnName: "is_high_priority_task",
        params: ["task_prio", "threshold_prio"],
        testCases: [
            { input: [5, 3], expected: 1, label: "prio 5 >= 3" },
            { input: [1, 3], expected: 0, label: "prio 1 < 3" },
            { input: [3, 3], expected: 1, label: "prio 3 == 3" }
        ],
        linkedSkill: "Dual-Core Asymmetric Task Pinning"
    },
    {
        id: "prob_40",
        stageIndex: 3,
        title: "Bài 40: Đọc Cờ Sự Kiện Event Group Bit (Event Groups)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Dễ",
        xp: 50,
        desc: `FreeRTOS Event Groups dùng 24-bit cờ để đồng bộ nhiều tác vụ. Hãy kiểm tra xem bit sự kiện tại vị trí <code>bit_index</code> trong mặt nạ <code>event_mask</code> có được bật hay không. Trả về 1 nếu đã xảy ra sự kiện, ngược lại 0.`,
        standardRef: "FreeRTOS Kernel Book Ch.5 / Event Groups Bitwise Sync",
        bookId: "book_freertos_kernel",
        example: `Input: event_mask = 0x08, bit_index = 3 -> Output: 1`,
        hint: `Toán tử AND: <code>(event_mask & (1 << bit_index)) ? 1 : 0;</code>`,
        initialCode: `int get_next_event_bit(uint32_t event_mask, int bit_index) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int get_next_event_bit(uint32_t event_mask, int bit_index) {\n    return (event_mask & (1 << bit_index)) ? 1 : 0;\n}`,
        fnName: "get_next_event_bit",
        params: ["event_mask", "bit_index"],
        testCases: [
            { input: [8, 3], expected: 1, label: "bit 3 bật -> 1" },
            { input: [8, 2], expected: 0, label: "bit 2 tắt -> 0" },
            { input: [255, 7], expected: 1, label: "bit 7 bật -> 1" }
        ],
        linkedSkill: "Mutex & Resource Locking"
    },
    {
        id: "prob_41",
        stageIndex: 3,
        title: "Bài 41: Vòng Đệm Ring Buffer Cho Stream Cảm Biến",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Tính vị trí ghi kế tiếp trong vòng đệm circular buffer có dung lượng <code>capacity</code>: <code>(head + 1) % capacity</code>.`,
        standardRef: "FreeRTOS Kernel Book Ch.4 / Thread-Safe Ring Buffer",
        bookId: "book_freertos_kernel",
        example: `Input: head = 63, capacity = 64 -> Output: 0`,
        hint: `Phép chia lấy dư: <code>(head + 1) % capacity</code>.`,
        initialCode: `int ring_buffer_next(int head, int capacity) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int ring_buffer_next(int head, int capacity) {\n    return (head + 1) % capacity;\n}`,
        fnName: "ring_buffer_next",
        params: ["head", "capacity"],
        testCases: [
            { input: [0, 64], expected: 1, label: "head=0, cap=64" },
            { input: [63, 64], expected: 0, label: "head=63, cap=64" },
            { input: [15, 16], expected: 0, label: "head=15, cap=16" },
            { input: [7, 8], expected: 0, label: "head=7, cap=8" }
        ],
        linkedSkill: "Thread-Safe FreeRTOS Data Queues"
    },
    {
        id: "prob_42",
        stageIndex: 3,
        title: "Bài 42: Giám Sát Task Watchdog Timer (TWDT Timeout Check)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Cơ chế Task Watchdog cần phát hiện tác vụ suy luận AI bị treo CPU. Tính thời gian trôi qua từ lần cho ăn cuối (<code>current_time_ms - last_feed_ms</code>). Nếu thời gian này lớn hơn <code>timeout_threshold_ms</code>, trả về 1 (cảnh báo treo), ngược lại trả về 0.`,
        standardRef: "MISRA C:2012 Rule 14.2 / ESP-IDF Task Watchdog Timer (TWDT)",
        bookId: "book_misra_c",
        example: `Input: last_feed = 1000, current = 4500, timeout = 3000 -> Trôi qua 3500 > 3000 -> Output: 1`,
        hint: `So sánh hiệu thời gian: <code>return (current_time_ms - last_feed_ms > timeout_threshold_ms) ? 1 : 0;</code>.`,
        initialCode: `int is_twdt_timed_out(int last_feed_ms, int current_time_ms, int timeout_threshold_ms) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_twdt_timed_out(int last_feed_ms, int current_time_ms, int timeout_threshold_ms) {\n    return (current_time_ms - last_feed_ms > timeout_threshold_ms) ? 1 : 0;\n}`,
        fnName: "is_twdt_timed_out",
        params: ["last_feed_ms", "current_time_ms", "timeout_threshold_ms"],
        testCases: [
            { input: [1000, 4500, 3000], expected: 1, label: "3500ms > 3000ms -> Treo" },
            { input: [1000, 2500, 3000], expected: 0, label: "1500ms <= 3000ms -> OK" },
            { input: [5000, 6000, 2000], expected: 0, label: "1000ms <= 2000ms -> OK" },
            { input: [100, 5000, 1000], expected: 1, label: "4900ms > 1000ms -> Treo" }
        ],
        linkedSkill: "Task Watchdog Timer (TWDT)"
    },
    {
        id: "prob_43",
        stageIndex: 3,
        title: "Bài 43: Đếm Số Mẫu Hiện Có Trong Ring Buffer",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Với con trỏ ghi <code>head</code> và con trỏ đọc <code>tail</code> trong vòng đệm tròn dung lượng <code>capacity</code>, hãy tính số lượng mẫu đang chờ được xử lý: <code>(head - tail + capacity) % capacity</code>.`,
        standardRef: "SEI CERT C Rule ARR30-C / Buffer Index Accounting",
        bookId: "book_sei_cert_c",
        example: `Input: head = 2, tail = 60, capacity = 64 -> (2 - 60 + 64) % 64 = 6 mẫu`,
        hint: `Công thức vòng tròn: <code>(head - tail + capacity) % capacity</code>.`,
        initialCode: `int ring_buffer_count(int head, int tail, int capacity) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int ring_buffer_count(int head, int tail, int capacity) {\n    return (head - tail + capacity) % capacity;\n}`,
        fnName: "ring_buffer_count",
        params: ["head", "tail", "capacity"],
        testCases: [
            { input: [2, 60, 64], expected: 6, label: "vòng qua mút -> 6" },
            { input: [10, 5, 64], expected: 5, label: "bình thường -> 5" },
            { input: [8, 8, 64], expected: 0, label: "trống -> 0" }
        ],
        linkedSkill: "Thread-Safe FreeRTOS Data Queues"
    },
    {
        id: "prob_44",
        stageIndex: 3,
        title: "Bài 44: Giám Sát Giới Hạn Đáy Stack (Stack High Watermark)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Hàm <code>uxTaskGetStackHighWaterMark()</code> trả về số lượng word tối thiểu chưa từng dùng của Task Stack. Nếu <code>high_watermark_words < min_safe_words</code> (VD: dưới 128 words), hãy trả về 1 (cảnh báo nguy cơ tràn Stack), ngược lại trả về 0.`,
        standardRef: "Mastering FreeRTOS Real Time Kernel Ch.3 / Stack High Watermark",
        bookId: "book_freertos_kernel",
        example: `Input: high_watermark = 64, min_safe = 128 -> Output: 1 (Nguy cơ tràn)\nInput: high_watermark = 512, min_safe = 128 -> Output: 0`,
        hint: `So sánh an toàn: <code>return high_watermark_words < min_safe_words ? 1 : 0;</code>`,
        initialCode: `int check_stack_watermark(int high_watermark_words, int min_safe_words) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int check_stack_watermark(int high_watermark_words, int min_safe_words) {\n    return high_watermark_words < min_safe_words ? 1 : 0;\n}`,
        fnName: "check_stack_watermark",
        params: ["high_watermark_words", "min_safe_words"],
        testCases: [
            { input: [64, 128], expected: 1, label: "quá ít -> nguy hiểm (1)" },
            { input: [512, 128], expected: 0, label: "dư dả -> an toàn (0)" },
            { input: [128, 128], expected: 0, label: "đúng ngưỡng -> an toàn (0)" }
        ],
        linkedSkill: "Task Watchdog Timer (TWDT)"
    },
    {
        id: "prob_45",
        stageIndex: 3,
        title: "Bài 45: Quy Đổi Mili-giây Sang FreeRTOS Ticks",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Trong FreeRTOS, hàm <code>vTaskDelay(ticks)</code> nhận tham số là số ticks. Với tần số RTOS Tick Rate là <code>tick_rate_hz</code> (mặc định 1000Hz trên ESP-IDF), hãy chuyển <code>ms</code> mili-giây sang số ticks tương ứng: <code>(ms * tick_rate_hz) / 1000</code>.`,
        standardRef: "FreeRTOS Kernel Book Ch.3 / Macro pdMS_TO_TICKS Conversion",
        bookId: "book_freertos_kernel",
        example: `Input: ms = 250, tick_rate_hz = 1000 -> Output: 250 ticks\nInput: ms = 200, tick_rate_hz = 100 -> Output: 20 ticks`,
        hint: `Công thức: <code>(ms * tick_rate_hz) / 1000</code>.`,
        initialCode: `uint32_t convert_ms_to_ticks(uint32_t ms, uint32_t tick_rate_hz) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t convert_ms_to_ticks(uint32_t ms, uint32_t tick_rate_hz) {\n    return (ms * tick_rate_hz) / 1000;\n}`,
        fnName: "convert_ms_to_ticks",
        params: ["ms", "tick_rate_hz"],
        testCases: [
            { input: [250, 1000], expected: 250, label: "250ms @ 1000Hz" },
            { input: [200, 100], expected: 20, label: "200ms @ 100Hz" },
            { input: [1000, 100], expected: 100, label: "1000ms @ 100Hz" }
        ],
        linkedSkill: "Dual-Core Asymmetric Task Pinning"
    },
    {
        id: "prob_46",
        stageIndex: 3,
        title: "Bài 46: Giải Quyết Nghịch Đảo Mức Ưu Tiên (Priority Inheritance)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Để chống hiện tượng Priority Inversion, Mutex trong FreeRTOS nâng tạm mức ưu tiên của Task đang giữ khóa <code>prio_holding</code> lên mức của Task đang chờ khóa có ưu tiên cao nhất <code>prio_high</code>. Viết hàm trả về mức ưu tiên mới của task giữ khóa: <code>max(prio_high, prio_holding)</code>.`,
        standardRef: "Mastering FreeRTOS Ch.7 / NASA Mars Pathfinder Priority Inversion",
        bookId: "book_freertos_kernel",
        example: `Input: prio_high = 10, prio_holding = 2 -> Output: 10\nInput: prio_high = 3, prio_holding = 5 -> Output: 5`,
        hint: `Chọn giá trị lớn nhất: <code>return prio_high > prio_holding ? prio_high : prio_holding;</code>`,
        initialCode: `int resolve_priority_inversion(int prio_high, int prio_holding) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int resolve_priority_inversion(int prio_high, int prio_holding) {\n    return prio_high > prio_holding ? prio_high : prio_holding;\n}`,
        fnName: "resolve_priority_inversion",
        params: ["prio_high", "prio_holding"],
        testCases: [
            { input: [10, 2], expected: 10, label: "nâng từ 2 lên 10" },
            { input: [3, 5], expected: 5, label: "giữ nguyên 5" },
            { input: [8, 8], expected: 8, label: "bằng nhau -> 8" }
        ],
        linkedSkill: "Mutex & Resource Locking"
    },
    {
        id: "prob_47",
        stageIndex: 3,
        title: "Bài 47: Tìm Task Có Độ Ưu Tiên Cao Nhất Để Điều Phối (Scheduler)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Bộ điều phối FreeRTOS cần chọn ra mức ưu tiên cao nhất trong 3 tác vụ đang ở trạng thái Ready có độ ưu tiên lần lượt là [p1, p2, p3]. Viết hàm tìm giá trị ưu tiên lớn nhất.`,
        standardRef: "FreeRTOS Kernel Book Ch.3 / Priority-Based Preemptive Scheduler",
        bookId: "book_freertos_kernel",
        example: `Input: p1 = 3, p2 = 9, p3 = 5 -> Output: 9`,
        hint: `Tìm max 3 số: <code>int m = p1; if (p2 > m) m = p2; if (p3 > m) m = p3; return m;</code>`,
        initialCode: `int select_highest_priority(int p1, int p2, int p3) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int select_highest_priority(int p1, int p2, int p3) {\n    int m = p1;\n    if (p2 > m) m = p2;\n    if (p3 > m) m = p3;\n    return m;\n}`,
        fnName: "select_highest_priority",
        params: ["p1", "p2", "p3"],
        testCases: [
            { input: [3, 9, 5], expected: 9, label: "max là 9" },
            { input: [12, 4, 8], expected: 12, label: "max là 12" },
            { input: [1, 2, 7], expected: 7, label: "max là 7" }
        ],
        linkedSkill: "Dual-Core Asymmetric Task Pinning"
    },
    {
        id: "prob_48",
        stageIndex: 3,
        title: "Bài 48: Cảnh Báo Lệch Tải CPU Giữa 2 Nhân (Multi-Core Load Balance)",
        topic: "4. FreeRTOS & Đa Nhiệm",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Nếu độ chênh lệch tải CPU giữa Core 0 và Core 1 <code>abs(core0_pct - core1_pct)</code> vượt quá <code>max_diff_pct</code> (VD: chênh > 40%), trả về 1 (cảnh báo mất cân bằng tải), ngược lại trả về 0.`,
        standardRef: "MLPerf Tiny Benchmark / Dual-Core SMP Load Balancing",
        bookId: "book_freertos_kernel",
        example: `Input: core0 = 90, core1 = 30, max_diff = 40 -> Chênh 60 > 40 -> Output: 1`,
        hint: `Hiệu tuyệt đối: <code>int diff = core0_pct >= core1_pct ? (core0_pct - core1_pct) : (core1_pct - core0_pct); return diff > max_diff_pct ? 1 : 0;</code>`,
        initialCode: `int check_multicore_load_balance(int core0_pct, int core1_pct, int max_diff_pct) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int check_multicore_load_balance(int core0_pct, int core1_pct, int max_diff_pct) {\n    int diff = core0_pct >= core1_pct ? (core0_pct - core1_pct) : (core1_pct - core0_pct);\n    return diff > max_diff_pct ? 1 : 0;\n}`,
        fnName: "check_multicore_load_balance",
        params: ["core0_pct", "core1_pct", "max_diff_pct"],
        testCases: [
            { input: [90, 30, 40], expected: 1, label: "lệch 60% > 40% -> 1" },
            { input: [60, 50, 40], expected: 0, label: "lệch 10% <= 40% -> 0" },
            { input: [20, 80, 50], expected: 1, label: "lệch 60% > 50% -> 1" }
        ],
        linkedSkill: "Dual-Core Asymmetric Task Pinning"
    },

    // =========================================================================
    // MODULE 5: NETWORK & NÂNG CẤP OTA (STAGE 4) - 12 BÀI
    // =========================================================================
    {
        id: "prob_49",
        stageIndex: 4,
        title: "Bài 49: Chuyển Đổi Phân Vùng Dual-OTA (OTA Slot Switcher)",
        topic: "5. Network & OTA",
        difficulty: "Dễ",
        xp: 50,
        desc: `ESP32 có 2 phân vùng flash chạy luân phiên: OTA_0 (slot 0) và OTA_1 (slot 1). Khi firmware hiện tại đang chạy ở slot 0, bản nâng cấp tiếp theo phải ghi vào slot 1, và ngược lại. Hãy viết hàm xác định slot kế tiếp: nếu đang là 0 thì trả về 1, nếu đang là 1 thì trả về 0.`,
        standardRef: "ESP32-S3 TRM Ch.2 / Dual-OTA Partition Scheme",
        bookId: "book_esps3_trm",
        example: `Input: current_ota_slot = 0 -> Output: 1\nInput: current_ota_slot = 1 -> Output: 0`,
        hint: `Đảo 0 và 1: <code>return current_ota_slot == 0 ? 1 : 0;</code>.`,
        initialCode: `int get_next_ota_partition(int current_ota_slot) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int get_next_ota_partition(int current_ota_slot) {\n    return current_ota_slot == 0 ? 1 : 0;\n}`,
        fnName: "get_next_ota_partition",
        params: ["current_ota_slot"],
        testCases: [
            { input: [0], expected: 1, label: "slot=0 -> slot=1" },
            { input: [1], expected: 0, label: "slot=1 -> slot=0" }
        ],
        linkedSkill: "Dual OTA Partition Table Design"
    },
    {
        id: "prob_50",
        stageIndex: 4,
        title: "Bài 50: Tính Checksum XOR Kiểm Tra Gói Tin Firmware OTA",
        topic: "5. Network & OTA",
        difficulty: "Dễ",
        xp: 50,
        desc: `Trước khi ghi dữ liệu firmware vào Flash qua Wi-Fi OTA, cần kiểm tra tính toàn vẹn gói tin bằng cách tính giá trị kiểm lỗi XOR của 4 byte dữ liệu nhận được: <code>b0 ^ b1 ^ b2 ^ b3</code>.`,
        standardRef: "SEI CERT C / RFC 9000 / XOR Packet Checksum",
        bookId: "book_sei_cert_c",
        example: `Input: b0 = 170, b1 = 85, b2 = 255, b3 = 0 -> Output: 0`,
        hint: `Toán tử XOR bitwise: <code>return b0 ^ b1 ^ b2 ^ b3;</code>.`,
        initialCode: `uint8_t calc_ota_checksum(uint8_t b0, uint8_t b1, uint8_t b2, uint8_t b3) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t calc_ota_checksum(uint8_t b0, uint8_t b1, uint8_t b2, uint8_t b3) {\n    return b0 ^ b1 ^ b2 ^ b3;\n}`,
        fnName: "calc_ota_checksum",
        params: ["b0", "b1", "b2", "b3"],
        testCases: [
            { input: [170, 85, 255, 0], expected: 0, label: "170 ^ 85 ^ 255 ^ 0" },
            { input: [1, 2, 3, 4], expected: 4, label: "1 ^ 2 ^ 3 ^ 4" },
            { input: [10, 10, 20, 20], expected: 0, label: "10 ^ 10 ^ 20 ^ 20" },
            { input: [255, 0, 0, 0], expected: 255, label: "255 ^ 0 ^ 0 ^ 0" }
        ],
        linkedSkill: "Over-The-Air (OTA) Model Updating"
    },
    {
        id: "prob_51",
        stageIndex: 4,
        title: "Bài 51: Đánh Giá Cường Độ Sóng Wi-Fi Đủ Chuẩn OTA",
        topic: "5. Network & OTA",
        difficulty: "Dễ",
        xp: 50,
        desc: `Nâng cấp OTA cần sóng Wi-Fi đủ mạnh để tránh hỏng firmware giữa chừng. Kiểm tra xem chỉ số RSSI <code>rssi_dbm</code> có lớn hơn hoặc bằng ngưỡng an toàn <code>good_threshold_dbm</code> (VD: -75 dBm) hay không. Trả về 1 nếu an toàn, 0 nếu sóng yếu.`,
        standardRef: "IEEE 802.11 Wi-Fi Standards / ESP32-S3 TRM Radio",
        bookId: "book_esps3_trm",
        example: `Input: rssi = -65, threshold = -75 -> Output: 1 (-65 dBm mạnh hơn -75 dBm)\nInput: rssi = -85, threshold = -75 -> Output: 0`,
        hint: `Lưu ý số âm: <code>return rssi_dbm >= good_threshold_dbm ? 1 : 0;</code>`,
        initialCode: `int is_wifi_rssi_good(int rssi_dbm, int good_threshold_dbm) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_wifi_rssi_good(int rssi_dbm, int good_threshold_dbm) {\n    return rssi_dbm >= good_threshold_dbm ? 1 : 0;\n}`,
        fnName: "is_wifi_rssi_good",
        params: ["rssi_dbm", "good_threshold_dbm"],
        testCases: [
            { input: [-65, -75], expected: 1, label: "-65 >= -75 -> Tốt" },
            { input: [-85, -75], expected: 0, label: "-85 < -75 -> Yếu" },
            { input: [-75, -75], expected: 1, label: "-75 == -75 -> Đạt" }
        ],
        linkedSkill: "Robust Wi-Fi Auto-Reconnection"
    },
    {
        id: "prob_52",
        stageIndex: 4,
        title: "Bài 52: Quy Đổi RSSI Ra Số Vạch Sóng (Signal Bars)",
        topic: "5. Network & OTA",
        difficulty: "Dễ",
        xp: 50,
        desc: `Chuyển đổi chỉ số RSSI (dBm) ra thang 4 vạch sóng UI: <code>>= -55</code>: 4 vạch; <code>>= -70</code>: 3 vạch; <code>>= -85</code>: 2 vạch; <code>>= -95</code>: 1 vạch; còn lại: 0 vạch.`,
        standardRef: "IEEE 802.11 / Wi-Fi Signal Bars Representation",
        bookId: "book_esps3_trm",
        example: `Input: rssi = -60 -> Output: 3 vạch\nInput: rssi = -45 -> Output: 4 vạch`,
        hint: `Chuỗi điều kiện if: <code>if (rssi >= -55) return 4; if (rssi >= -70) return 3; if (rssi >= -85) return 2; if (rssi >= -95) return 1; return 0;</code>`,
        initialCode: `int map_rssi_to_bars(int rssi) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int map_rssi_to_bars(int rssi) {\n    if (rssi >= -55) return 4;\n    if (rssi >= -70) return 3;\n    if (rssi >= -85) return 2;\n    if (rssi >= -95) return 1;\n    return 0;\n}`,
        fnName: "map_rssi_to_bars",
        params: ["rssi"],
        testCases: [
            { input: [-50], expected: 4, label: "-50dBm -> 4 vạch" },
            { input: [-65], expected: 3, label: "-65dBm -> 3 vạch" },
            { input: [-80], expected: 2, label: "-80dBm -> 2 vạch" },
            { input: [-90], expected: 1, label: "-90dBm -> 1 vạch" },
            { input: [-100], expected: 0, label: "-100dBm -> 0 vạch" }
        ],
        linkedSkill: "Robust Wi-Fi Auto-Reconnection"
    },
    {
        id: "prob_53",
        stageIndex: 4,
        title: "Bài 53: Tính Thời Gian Chờ Thử Lại Wi-Fi (Exponential Backoff)",
        topic: "5. Network & OTA",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Khi mất kết nối Wi-Fi, thiết bị áp dụng thuật toán Exponential Backoff: <code>delay = base_delay_sec * (2 ^ retry_count)</code>. Nếu delay vượt quá <code>max_delay_sec</code>, trả về <code>max_delay_sec</code>.`,
        standardRef: "RFC 9000 / Exponential Backoff Network Reconnect",
        bookId: "book_sei_cert_c",
        example: `Input: retry_count = 2, base_delay = 1, max_delay = 30 -> 1 * 4 = 4 giây`,
        hint: `Dùng phép dịch bit <code>1 << retry_count</code> để tính 2 mũ n: <code>int d = base_delay_sec * (1 << retry_count); return d > max_delay_sec ? max_delay_sec : d;</code>`,
        initialCode: `int calc_backoff_delay(int retry_count, int base_delay_sec, int max_delay_sec) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_backoff_delay(int retry_count, int base_delay_sec, int max_delay_sec) {\n    int d = base_delay_sec * (1 << retry_count);\n    return d > max_delay_sec ? max_delay_sec : d;\n}`,
        fnName: "calc_backoff_delay",
        params: ["retry_count", "base_delay_sec", "max_delay_sec"],
        testCases: [
            { input: [0, 1, 30], expected: 1, label: "retry=0 -> 1s" },
            { input: [2, 1, 30], expected: 4, label: "retry=2 -> 4s" },
            { input: [4, 1, 10], expected: 10, label: "retry=4 (16s vượt max 10s) -> 10s" },
            { input: [3, 2, 20], expected: 16, label: "retry=3, base=2 -> 16s" }
        ],
        linkedSkill: "Robust Wi-Fi Auto-Reconnection"
    },
    {
        id: "prob_54",
        stageIndex: 4,
        title: "Bài 54: Đóng Gói Gói Tin MQTT Telemetry (Bit Packing)",
        topic: "5. Network & OTA",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Đóng gói 3 thông số đo đạc thành một số nguyên 32-bit gửi qua MQTT: Byte 2 (bit 16..23) là <code>device_id</code>, Byte 1 (bit 8..15) là <code>temp_celsius</code>, Byte 0 (bit 0..7) là <code>batt_percent</code>.`,
        standardRef: "OASIS MQTT v5.0 Standard / MISRA C:2012 Rule 10.1 Bit Packing",
        bookId: "book_misra_c",
        example: `Input: device_id = 1, temp = 25, batt = 90 -> (1 << 16) | (25 << 8) | 90 = 72026`,
        hint: `Dịch bit: <code>(device_id << 16) | (temp_celsius << 8) | batt_percent</code>.`,
        initialCode: `uint32_t pack_telemetry_packet(uint8_t device_id, uint8_t temp_celsius, uint8_t batt_percent) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint32_t pack_telemetry_packet(uint8_t device_id, uint8_t temp_celsius, uint8_t batt_percent) {\n    return (device_id << 16) | (temp_celsius << 8) | batt_percent;\n}`,
        fnName: "pack_telemetry_packet",
        params: ["device_id", "temp_celsius", "batt_percent"],
        testCases: [
            { input: [1, 25, 90], expected: 72026, label: "dev=1, temp=25, batt=90" },
            { input: [0, 0, 100], expected: 100, label: "dev=0, temp=0, batt=100" },
            { input: [2, 30, 80], expected: 138832, label: "dev=2, temp=30, batt=80" }
        ],
        linkedSkill: "Lightweight MQTT IoT Telemetry"
    },
    {
        id: "prob_55",
        stageIndex: 4,
        title: "Bài 55: Giải Gói Trích Xuất Device ID Từ Gói Tin 32-Bit",
        topic: "5. Network & OTA",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Từ gói tin 32-bit đóng gói ở Bài 54, hãy trích xuất <code>device_id</code> nằm ở Byte 2 (bit 16 đến 23): <code>(packet_32 >> 16) & 0xFF</code>.`,
        standardRef: "ISO/IEC 9899:2011 §6.5 Expressions / Bit Unpacking",
        bookId: "book_iso_c11_standard",
        example: `Input: packet_32 = 72026 -> Output: 1`,
        hint: `Dịch phải 16 bit và AND với 0xFF: <code>(packet_32 >> 16) & 0xFF;</code>`,
        initialCode: `uint8_t unpack_device_id(uint32_t packet_32) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t unpack_device_id(uint32_t packet_32) {\n    return (packet_32 >> 16) & 0xFF;\n}`,
        fnName: "unpack_device_id",
        params: ["packet_32"],
        testCases: [
            { input: [72026], expected: 1, label: "id=1" },
            { input: [138832], expected: 2, label: "id=2" },
            { input: [100], expected: 0, label: "id=0" }
        ],
        linkedSkill: "Lightweight MQTT IoT Telemetry"
    },
    {
        id: "prob_56",
        stageIndex: 4,
        title: "Bài 56: Giải Gói Trích Xuất Nhiệt Độ Từ Gói Tin 32-Bit",
        topic: "5. Network & OTA",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Từ gói tin 32-bit, hãy trích xuất trường nhiệt độ <code>temp_celsius</code> nằm ở Byte 1 (bit 8 đến 15): <code>(packet_32 >> 8) & 0xFF</code>.`,
        standardRef: "MISRA C:2012 Rule 12.2 / Bitwise Data Extraction",
        bookId: "book_misra_c",
        example: `Input: packet_32 = 72026 -> Output: 25`,
        hint: `Dịch phải 8 bit và AND với 0xFF: <code>(packet_32 >> 8) & 0xFF;</code>`,
        initialCode: `uint8_t unpack_temperature(uint32_t packet_32) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t unpack_temperature(uint32_t packet_32) {\n    return (packet_32 >> 8) & 0xFF;\n}`,
        fnName: "unpack_temperature",
        params: ["packet_32"],
        testCases: [
            { input: [72026], expected: 25, label: "temp=25°C" },
            { input: [138832], expected: 30, label: "temp=30°C" },
            { input: [100], expected: 0, label: "temp=0°C" }
        ],
        linkedSkill: "Lightweight MQTT IoT Telemetry"
    },
    {
        id: "prob_57",
        stageIndex: 4,
        title: "Bài 57: Tính Tiến Độ Nạp Firmware OTA (Progress Percent)",
        topic: "5. Network & OTA",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Tính phần trăm tiến độ tải và ghi firmware OTA vào flash: <code>percent = (bytes_written * 100) / total_bytes</code>. Nếu <code>total_bytes == 0</code>, trả về 0.`,
        standardRef: "ESP-IDF OTA Progress Callback Architecture",
        bookId: "book_esps3_trm",
        example: `Input: bytes_written = 500000, total_bytes = 2000000 -> Output: 25%`,
        hint: `Phép tính: <code>if (total_bytes == 0) return 0; return (bytes_written * 100) / total_bytes;</code>.`,
        initialCode: `int calc_ota_progress_percent(int bytes_written, int total_bytes) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_ota_progress_percent(int bytes_written, int total_bytes) {\n    if (total_bytes == 0) return 0;\n    return (bytes_written * 100) / total_bytes;\n}`,
        fnName: "calc_ota_progress_percent",
        params: ["bytes_written", "total_bytes"],
        testCases: [
            { input: [500000, 2000000], expected: 25, label: "25%" },
            { input: [1000000, 1000000], expected: 100, label: "100%" },
            { input: [0, 1000000], expected: 0, label: "0%" }
        ],
        linkedSkill: "Over-The-Air (OTA) Model Updating"
    },
    {
        id: "prob_58",
        stageIndex: 4,
        title: "Bài 58: Kiểm Tra Kích Thước Gói Tin Vượt Giới Hạn MTU",
        topic: "5. Network & OTA",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Trong truyền gói tin MQTT qua mạng Wi-Fi hoặc BLE ATT MTU, tổng kích thước <code>header_bytes + payload_bytes</code> không được vượt quá <code>max_mtu</code>. Trả về 1 nếu hợp lệ, 0 nếu vượt giới hạn MTU gây phân mảnh gói tin.`,
        standardRef: "RFC 791 / RFC 8200 Maximum Transmission Unit (MTU)",
        bookId: "book_sei_cert_c",
        example: `Input: header = 4, payload = 240, max_mtu = 247 -> tổng 244 <= 247 -> Output: 1`,
        hint: `So sánh tổng: <code>(header_bytes + payload_bytes <= max_mtu) ? 1 : 0;</code>`,
        initialCode: `int verify_mqtt_packet_size(int header_bytes, int payload_bytes, int max_mtu) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int verify_mqtt_packet_size(int header_bytes, int payload_bytes, int max_mtu) {\n    return (header_bytes + payload_bytes <= max_mtu) ? 1 : 0;\n}`,
        fnName: "verify_mqtt_packet_size",
        params: ["header_bytes", "payload_bytes", "max_mtu"],
        testCases: [
            { input: [4, 240, 247], expected: 1, label: "244 <= 247 -> Hợp lệ" },
            { input: [4, 250, 247], expected: 0, label: "254 > 247 -> Quá giới hạn" },
            { input: [10, 100, 1500], expected: 1, label: "110 <= 1500 -> Hợp lệ" }
        ],
        linkedSkill: "Lightweight MQTT IoT Telemetry"
    },
    {
        id: "prob_59",
        stageIndex: 4,
        title: "Bài 59: Thuật Toán Kiểm Lỗi CRC8 Đơn Giản Cho Gói Tin BLE",
        topic: "5. Network & OTA",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Để phát hiện gói tin BLE Beacon bị nhiễu sóng, tính mã kiểm tra CRC-8 bằng công thức băm đa thức đơn giản của 3 byte dữ liệu: <code>(d0 * 31 + d1 * 17 + d2) % 256</code>.`,
        standardRef: "ISO 11898-1 CAN Bus / Dallas-Maxim CRC-8 Polynomial",
        bookId: "book_can_iso11898",
        example: `Input: d0 = 1, d1 = 2, d2 = 3 -> (31 + 34 + 3) % 256 = 68`,
        hint: `Công thức: <code>(d0 * 31 + d1 * 17 + d2) % 256</code>.`,
        initialCode: `uint8_t calc_simple_crc8(uint8_t d0, uint8_t d1, uint8_t d2) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t calc_simple_crc8(uint8_t d0, uint8_t d1, uint8_t d2) {\n    return (d0 * 31 + d1 * 17 + d2) % 256;\n}`,
        fnName: "calc_simple_crc8",
        params: ["d0", "d1", "d2"],
        testCases: [
            { input: [1, 2, 3], expected: 68, label: "1, 2, 3 -> 68" },
            { input: [0, 0, 0], expected: 0, label: "0" },
            { input: [10, 20, 30], expected: 168, label: "(310 + 340 + 30) % 256 = 168" }
        ],
        linkedSkill: "Lightweight MQTT IoT Telemetry"
    },
    {
        id: "prob_60",
        stageIndex: 4,
        title: "Bài 60: Xác Thực Byte Nhận Diện File Nhị Phân ESP32 (Magic Byte)",
        topic: "5. Network & OTA",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `ESP-IDF quy định byte đầu tiên của file firmware hợp lệ (ESP Image Magic Byte) luôn là <code>0xE7</code> (231 trong hệ thập phân). Kiểm tra xem byte tải về <code>magic_byte</code> có khớp với 231 hay không để ngăn nạp nhầm file rác vào flash.`,
        standardRef: "ESP32-S3 TRM Ch.2 Bootloader & ROM Image Format",
        bookId: "book_esps3_trm",
        example: `Input: magic_byte = 231 (0xE7) -> Output: 1\nInput: magic_byte = 255 -> Output: 0`,
        hint: `So sánh hằng số: <code>return magic_byte == 231 ? 1 : 0;</code>`,
        initialCode: `int is_ota_image_magic_valid(uint8_t magic_byte) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_ota_image_magic_valid(uint8_t magic_byte) {\n    return magic_byte == 231 ? 1 : 0;\n}`,
        fnName: "is_ota_image_magic_valid",
        params: ["magic_byte"],
        testCases: [
            { input: [231], expected: 1, label: "0xE7 hợp lệ -> 1" },
            { input: [255], expected: 0, label: "0xFF lỗi -> 0" },
            { input: [0], expected: 0, label: "0x00 lỗi -> 0" }
        ],
        linkedSkill: "Over-The-Air (OTA) Model Updating"
    },

    // =========================================================================
    // MODULE 6: MÔ HÌNH AI TRÊN EDGE (TINYML) (STAGE 5) - 12 BÀI
    // =========================================================================
    {
        id: "prob_61",
        stageIndex: 5,
        title: "Bài 61: Lọc Ngưỡng Tin Cậy Chống Báo Động Giả (Confidence Filter)",
        topic: "6. AI Model",
        difficulty: "Dễ",
        xp: 50,
        desc: `Trong dự án Edge AI nhận diện từ khóa giọng nói (KWS) hoặc phân loại rung động máy móc, để tránh báo động giả, kết quả suy luận chỉ được chấp nhận nếu điểm xác suất cao nhất <code>max_score</code> lớn hơn hoặc bằng <code>threshold_percent</code>. Trả về 1 nếu đạt ngưỡng tin cậy, 0 nếu không.`,
        standardRef: "TinyML (O'Reilly) Ch.7 Wake-Word Detection / Confidence Filter",
        bookId: "book_tinyml_oreilly",
        example: `Input: max_score = 88, threshold = 80 -> Output: 1\nInput: max_score = 65, threshold = 80 -> Output: 0`,
        hint: `So sánh ngưỡng: <code>return (max_score >= threshold_percent) ? 1 : 0;</code>.`,
        initialCode: `int is_high_confidence(int max_score, int threshold_percent) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int is_high_confidence(int max_score, int threshold_percent) {\n    return (max_score >= threshold_percent) ? 1 : 0;\n}`,
        fnName: "is_high_confidence",
        params: ["max_score", "threshold_percent"],
        testCases: [
            { input: [88, 80], expected: 1, label: "score=88, thres=80 (Đạt)" },
            { input: [65, 80], expected: 0, label: "score=65, thres=80 (Không đạt)" },
            { input: [95, 90], expected: 1, label: "score=95, thres=90 (Đạt)" },
            { input: [79, 80], expected: 0, label: "score=79, thres=80 (Không đạt)" }
        ],
        linkedSkill: "Complete Edge AI Production Project"
    },
    {
        id: "prob_62",
        stageIndex: 5,
        title: "Bài 62: Hàm Kích Hoạt Nơ-ron ReLU (Rectified Linear Unit)",
        topic: "6. AI Model",
        difficulty: "Dễ",
        xp: 50,
        desc: `Hàm kích hoạt phổ biến nhất trong mạng nơ-ron nhúng là ReLU: nếu <code>x > 0</code> thì trả về <code>x</code>, nếu <code>x <= 0</code> thì trả về 0.`,
        standardRef: "Benoit Jacob et al. 2018 CVPR Section 2 / ReLU Activation",
        bookId: "book_jacob_quantization",
        example: `Input: x = 45 -> Output: 45\nInput: x = -12 -> Output: 0`,
        hint: `Điều kiện: <code>return x > 0 ? x : 0;</code>`,
        initialCode: `int relu_activation(int x) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int relu_activation(int x) {\n    return x > 0 ? x : 0;\n}`,
        fnName: "relu_activation",
        params: ["x"],
        testCases: [
            { input: [45], expected: 45, label: "x=45 > 0 -> 45" },
            { input: [-12], expected: 0, label: "x=-12 <= 0 -> 0" },
            { input: [0], expected: 0, label: "x=0 -> 0" }
        ],
        linkedSkill: "TFLite Micro & ESP-DL Integration"
    },
    {
        id: "prob_63",
        stageIndex: 5,
        title: "Bài 63: Cắt Ngọn Tràn Số Lượng Tử Hóa INT8 (INT8 Clamping)",
        topic: "6. AI Model",
        difficulty: "Dễ",
        xp: 50,
        desc: `Sau khi nhân tích lũy tensor, giá trị có thể vượt quá giới hạn 8-bit có dấu [-128, 127]. Hãy cắt ngọn (clamp): nếu <code>val > 127</code> gán 127, nếu <code>val < -128</code> gán -128, còn lại giữ nguyên.`,
        standardRef: "Benoit Jacob et al. 2018 CVPR Eq. 1 / Quantized Range Clamping",
        bookId: "book_jacob_quantization",
        example: `Input: val = 140 -> Output: 127\nInput: val = -200 -> Output: -128`,
        hint: `Cắt ngọn: <code>if (val > 127) return 127; if (val < -128) return -128; return val;</code>`,
        initialCode: `int8_t clamp_int8(int val) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int8_t clamp_int8(int val) {\n    if (val > 127) return 127;\n    if (val < -128) return -128;\n    return val;\n}`,
        fnName: "clamp_int8",
        params: ["val"],
        testCases: [
            { input: [140], expected: 127, label: "vượt trên -> 127" },
            { input: [-200], expected: -128, label: "vượt dưới -> -128" },
            { input: [50], expected: 50, label: "50" }
        ],
        linkedSkill: "INT8 Model Quantization"
    },
    {
        id: "prob_64",
        stageIndex: 5,
        title: "Bài 64: Phân Loại Nhị Phân Theo Ngưỡng (Binary Classification)",
        topic: "6. AI Model",
        difficulty: "Dễ",
        xp: 50,
        desc: `Trong bài toán phát hiện bất thường nhị phân (Anomaly vs Normal), nếu xác suất bất thường <code>prob_percent</code> lớn hơn hoặc bằng ngưỡng cắt <code>cutoff</code> (VD: 50%), phân loại là 1 (Có bất thường), ngược lại là 0 (Bình thường).`,
        standardRef: "TinyML (O'Reilly) Ch.11 Vision Person Detection / Binary Threshold",
        bookId: "book_tinyml_oreilly",
        example: `Input: prob = 75, cutoff = 50 -> Output: 1\nInput: prob = 30, cutoff = 50 -> Output: 0`,
        hint: `So sánh: <code>return prob_percent >= cutoff ? 1 : 0;</code>`,
        initialCode: `int binary_threshold_classify(int prob_percent, int cutoff) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int binary_threshold_classify(int prob_percent, int cutoff) {\n    return prob_percent >= cutoff ? 1 : 0;\n}`,
        fnName: "binary_threshold_classify",
        params: ["prob_percent", "cutoff"],
        testCases: [
            { input: [75, 50], expected: 1, label: "75% >= 50% -> 1" },
            { input: [30, 50], expected: 0, label: "30% < 50% -> 0" },
            { input: [50, 50], expected: 1, label: "50% >= 50% -> 1" }
        ],
        linkedSkill: "Complete Edge AI Production Project"
    },
    {
        id: "prob_65",
        stageIndex: 5,
        title: "Bài 65: Lượng tử hóa Dữ liệu Cảm biến (Quantize to INT8)",
        topic: "6. AI Model",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Trong TinyML, mô hình INT8 nhận đầu vào là các số nguyên từ -128 đến 127. Cho giá trị thực tế <code>val</code> (từ -100 đến 100), hãy chuyển đổi sang thang đo INT8: <code>int8_val = (int)(val * 1.27)</code>. Đảm bảo giới hạn trong [-128, 127].`,
        standardRef: "Benoit Jacob 2018 CVPR Section 2 / Affine Quantization Scheme",
        bookId: "book_jacob_quantization",
        example: `Input: val = 100 -> Output: 127\nInput: val = 0 -> Output: 0\nInput: val = -100 -> Output: -127`,
        hint: `Tính toán: <code>int res = (int)(val * 1.27f); if (res > 127) res = 127; if (res < -128) res = -128; return res;</code>`,
        initialCode: `int8_t quantize_to_int8(float val) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int8_t quantize_to_int8(float val) {\n    int res = (int)(val * 1.27f);\n    if (res > 127) res = 127;\n    if (res < -128) res = -128;\n    return res;\n}`,
        fnName: "quantize_to_int8",
        params: ["val"],
        testCases: [
            { input: [100.0], expected: 127, label: "val=100.0" },
            { input: [0.0], expected: 0, label: "val=0.0" },
            { input: [-100.0], expected: -127, label: "val=-100.0" },
            { input: [50.0], expected: 63, label: "val=50.0" }
        ],
        linkedSkill: "INT8 Model Quantization"
    },
    {
        id: "prob_66",
        stageIndex: 5,
        title: "Bài 66: Giải Lượng Tử Hóa Ra Phần Trăm (Dequantize to Percent)",
        topic: "6. AI Model",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Mô hình TFLite Micro trả về tensor đầu ra kiểu INT8. Hãy tính giá trị thực tế theo công thức: <code>real_val = (q_val - zero_point) * scale_x1000 / 1000</code>.`,
        standardRef: "Benoit Jacob et al. 2018 CVPR / Dequantization Scheme",
        bookId: "book_jacob_quantization",
        example: `Input: q_val = 100, zero_point = 0, scale_x1000 = 1000 -> Output: 100`,
        hint: `Công thức: <code>(int)(((q_val - zero_point) * scale_x1000) / 1000)</code>.`,
        initialCode: `int dequantize_to_percent(int q_val, int zero_point, int scale_x1000) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int dequantize_to_percent(int q_val, int zero_point, int scale_x1000) {\n    return (int)(((q_val - zero_point) * scale_x1000) / 1000);\n}`,
        fnName: "dequantize_to_percent",
        params: ["q_val", "zero_point", "scale_x1000"],
        testCases: [
            { input: [100, 0, 1000], expected: 100, label: "q=100, zp=0, scale=1.0" },
            { input: [50, 0, 500], expected: 25, label: "q=50, zp=0, scale=0.5" },
            { input: [127, 27, 1000], expected: 100, label: "q=127, zp=27, scale=1.0" },
            { input: [0, 0, 1000], expected: 0, label: "q=0, zp=0, scale=1.0" }
        ],
        linkedSkill: "TFLite Micro & ESP-DL Integration"
    },
    {
        id: "prob_67",
        stageIndex: 5,
        title: "Bài 67: Tính Dung Lượng Số Phần Tử Của Tensor (Tensor Elements)",
        topic: "6. AI Model",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Tensor 3 chiều trong mạng CNN có các chiều kích thước lần lượt là <code>dim0</code> (height), <code>dim1</code> (width), <code>dim2</code> (channels). Hãy tính tổng số phần tử cần cấp phát trong bộ nhớ: <code>dim0 * dim1 * dim2</code>.`,
        standardRef: "TFLite Micro Tensor Specs / TinyML (O'Reilly) Ch.3",
        bookId: "book_tinyml_oreilly",
        example: `Input: dim0 = 28, dim1 = 28, dim2 = 1 -> Output: 784 phần tử`,
        hint: `Tích 3 chiều: <code>return dim0 * dim1 * dim2;</code>.`,
        initialCode: `int calc_tensor_elements(int dim0, int dim1, int dim2) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_tensor_elements(int dim0, int dim1, int dim2) {\n    return dim0 * dim1 * dim2;\n}`,
        fnName: "calc_tensor_elements",
        params: ["dim0", "dim1", "dim2"],
        testCases: [
            { input: [28, 28, 1], expected: 784, label: "28x28x1 = 784" },
            { input: [10, 10, 3], expected: 300, label: "10x10x3 = 300" },
            { input: [1, 64, 4], expected: 256, label: "1x64x4 = 256" }
        ],
        linkedSkill: "Model Invocation & Tensor Management"
    },
    {
        id: "prob_68",
        stageIndex: 5,
        title: "Bài 68: Tính Số Phép Tính Nhân Tích Lũy Lớp Conv1D (MACs)",
        topic: "6. AI Model",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Để ước lượng thời gian suy luận trên CPU, hãy tính số phép toán Multiply-Accumulate (MACs) của lớp Conv1D: <code>macs = input_len * kernel_size * out_channels</code>.`,
        standardRef: "MLPerf Tiny Benchmark (NeurIPS 2021) / Conv1D MACs Complexity",
        bookId: "book_mlperf_tiny",
        example: `Input: input_len = 100, kernel_size = 3, out_channels = 8 -> Output: 2400 MACs`,
        hint: `Phép nhân: <code>return input_len * kernel_size * out_channels;</code>.`,
        initialCode: `int calc_macs_conv1d(int input_len, int kernel_size, int out_channels) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int calc_macs_conv1d(int input_len, int kernel_size, int out_channels) {\n    return input_len * kernel_size * out_channels;\n}`,
        fnName: "calc_macs_conv1d",
        params: ["input_len", "kernel_size", "out_channels"],
        testCases: [
            { input: [100, 3, 8], expected: 2400, label: "100 * 3 * 8 = 2400" },
            { input: [50, 5, 4], expected: 1000, label: "50 * 5 * 4 = 1000" },
            { input: [10, 1, 1], expected: 10, label: "10" }
        ],
        linkedSkill: "TFLite Micro & ESP-DL Integration"
    },
    {
        id: "prob_69",
        stageIndex: 5,
        title: "Bài 69: Tích Vô Hướng 3 Phần Tử (1D Dot Product / SIMD Step)",
        topic: "6. AI Model",
        difficulty: "Trung bình",
        xp: 100,
        desc: `Bước tính cơ bản nhất của nơ-ron tích chập là tích vô hướng giữa mảng kích hoạt [a0, a1, a2] và mảng trọng số [w0, w1, w2]: <code>a0*w0 + a1*w1 + a2*w2</code>.`,
        standardRef: "ESP32-S3 TRM Ch.1 Vector SIMD / 1D Dot Product",
        bookId: "book_jacob_quantization",
        example: `Input: a=[1, 2, 3], w=[2, 0, -1] -> 1*2 + 2*0 + 3*(-1) = 2 - 3 = -1`,
        hint: `Nhân cộng tích lũy: <code>return a0*w0 + a1*w1 + a2*w2;</code>.`,
        initialCode: `int dot_product_3(int a0, int a1, int a2, int w0, int w1, int w2) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int dot_product_3(int a0, int a1, int a2, int w0, int w1, int w2) {\n    return a0*w0 + a1*w1 + a2*w2;\n}`,
        fnName: "dot_product_3",
        params: ["a0", "a1", "a2", "w0", "w1", "w2"],
        testCases: [
            { input: [1, 2, 3, 2, 0, -1], expected: -1, label: "tích vô hướng = -1" },
            { input: [2, 3, 4, 1, 1, 1], expected: 9, label: "2 + 3 + 4 = 9" },
            { input: [0, 0, 0, 5, 5, 5], expected: 0, label: "0" }
        ],
        linkedSkill: "TFLite Micro & ESP-DL Integration"
    },
    {
        id: "prob_70",
        stageIndex: 5,
        title: "Bài 70: Tìm Nhãn Xác Suất Lớn Nhất (ArgMax AI Output)",
        topic: "6. AI Model",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Sau khi mô hình AI Edge gọi <code>invoke()</code>, mảng điểm gồm 4 xác suất của 4 lớp nhãn: [Stop, Go, Left, Right]. Hãy viết hàm tìm chỉ số lớp (index 0, 1, 2, hoặc 3) có điểm số cao nhất.`,
        standardRef: "TinyML (O'Reilly) Ch.8 / Post-Processing ArgMax",
        bookId: "book_tinyml_oreilly",
        example: `Input: s0=10, s1=85, s2=12, s3=5 -> Output: 1 (Lớp Go)`,
        hint: `Tìm giá trị lớn nhất trong 4 biến và trả về index tương ứng.`,
        initialCode: `int get_argmax_class(int s0, int s1, int s2, int s3) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int get_argmax_class(int s0, int s1, int s2, int s3) {\n    int max_idx = 0;\n    int max_val = s0;\n    if (s1 > max_val) { max_val = s1; max_idx = 1; }\n    if (s2 > max_val) { max_val = s2; max_idx = 2; }\n    if (s3 > max_val) { max_val = s3; max_idx = 3; }\n    return max_idx;\n}`,
        fnName: "get_argmax_class",
        params: ["s0", "s1", "s2", "s3"],
        testCases: [
            { input: [10, 85, 12, 5], expected: 1, label: "s=[10,85,12,5]" },
            { input: [90, 20, 15, 5], expected: 0, label: "s=[90,20,15,5]" },
            { input: [5, 10, 15, 95], expected: 3, label: "s=[5,10,15,95]" }
        ],
        linkedSkill: "Model Invocation & Tensor Management"
    },
    {
        id: "prob_71",
        stageIndex: 5,
        title: "Bài 71: Phép Nhân Tích Lũy Số Nguyên INT8 (Quantized MAC)",
        topic: "6. AI Model",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Trong lớp Fully-Connected lượng tử hóa, thanh ghi tích lũy 32-bit <code>acc</code> cộng thêm tích của đầu vào <code>input_val</code> và trọng số <code>weight_val</code>: <code>acc + input_val * weight_val</code>.`,
        standardRef: "Benoit Jacob et al. 2018 CVPR Section 3 / Quantized GEMM",
        bookId: "book_jacob_quantization",
        example: `Input: acc = 1000, input_val = 12, weight_val = -5 -> 1000 + (12 * -5) = 940`,
        hint: `Nhân cộng tích lũy: <code>return acc + input_val * weight_val;</code>.`,
        initialCode: `int32_t quantized_mac_int8(int32_t acc, int8_t input_val, int8_t weight_val) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int32_t quantized_mac_int8(int32_t acc, int8_t input_val, int8_t weight_val) {\n    return acc + input_val * weight_val;\n}`,
        fnName: "quantized_mac_int8",
        params: ["acc", "input_val", "weight_val"],
        testCases: [
            { input: [1000, 12, -5], expected: 940, label: "1000 + 12*(-5) = 940" },
            { input: [0, 10, 10], expected: 100, label: "100" },
            { input: [500, -8, -10], expected: 580, label: "500 + 80 = 580" }
        ],
        linkedSkill: "INT8 Model Quantization"
    },
    {
        id: "prob_72",
        stageIndex: 5,
        title: "Bài 72: Phát Hiện Bất Thường Bằng Sai Số Tái Tạo (AutoEncoder Anomaly)",
        topic: "6. AI Model",
        difficulty: "Nâng cao",
        xp: 150,
        desc: `Mô hình AutoEncoder phát hiện hỏng hóc cơ khí dựa trên sai số tái tạo <code>reconstruction_error</code> so với đường chuẩn trung bình <code>baseline_mean</code>. Nếu <code>reconstruction_error - baseline_mean > error_threshold</code>, trả về 1 (cảnh báo hỏng hóc), ngược lại trả về 0 (bình thường).`,
        standardRef: "TinyML (O'Reilly) Ch.12 & MLPerf Tiny ToyADMOS / Anomaly Detection",
        bookId: "book_tinyml_oreilly",
        example: `Input: error = 180, baseline = 50, threshold = 100 -> 130 > 100 -> Output: 1`,
        hint: `So sánh sai số: <code>return (reconstruction_error - baseline_mean > error_threshold) ? 1 : 0;</code>`,
        initialCode: `int detect_anomaly_autoencoder(int reconstruction_error, int baseline_mean, int error_threshold) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int detect_anomaly_autoencoder(int reconstruction_error, int baseline_mean, int error_threshold) {\n    return (reconstruction_error - baseline_mean > error_threshold) ? 1 : 0;\n}`,
        fnName: "detect_anomaly_autoencoder",
        params: ["reconstruction_error", "baseline_mean", "error_threshold"],
        testCases: [
            { input: [180, 50, 100], expected: 1, label: "130 > 100 -> Bất thường (1)" },
            { input: [120, 50, 100], expected: 0, label: "70 <= 100 -> Bình thường (0)" },
            { input: [40, 50, 100], expected: 0, label: "Bình thường (0)" }
        ],
        linkedSkill: "Complete Edge AI Production Project"
    }
];

let currentProblemIndex = 0;
let activeModuleFilter = 'all';

// MODULE FILTER LABELS (72 BÀI - MỖI MODULE 12 BÀI)
const MODULE_FILTER_META = [
    { key: "all", label: "Tất Cả (72)", stageIndex: -1 },
    { key: "0", label: "M1: C & Bộ Nhớ (12)", stageIndex: 0 },
    { key: "1", label: "M2: Timer & Ngắt (12)", stageIndex: 1 },
    { key: "2", label: "M3: Cảm Biến (12)", stageIndex: 2 },
    { key: "3", label: "M4: FreeRTOS (12)", stageIndex: 3 },
    { key: "4", label: "M5: Network & OTA (12)", stageIndex: 4 },
    { key: "5", label: "M6: TinyML & AI (12)", stageIndex: 5 }
];

function setModuleFilter(filterKey) {
    activeModuleFilter = String(filterKey);
    renderPracticeView();
}

// 3. EMBEDDED CODE SMELL LINTER
function runEmbeddedLinter(code) {
    const linterBox = document.getElementById("embedded-linter-box");
    const linterMsg = document.getElementById("linter-message");
    if (!linterBox) return;

    let warning = null;

    // Check 1: Delay or printf inside ISR
    if ((code.includes("IRAM_ATTR") || code.includes("_isr") || code.includes("ISR")) && 
        (code.includes("delay(") || code.includes("vTaskDelay(") || code.includes("printf("))) {
        warning = "⚠️ Cấm gọi hàm 'delay()' hoặc 'printf()' bên trong hàm ngắt ISR! Việc này sẽ làm trễ hệ thống và gây Crash Guru Meditation.";
    }
    // Check 2: malloc in while loop
    else if (code.match(/while\s*\([^)]*\)[\s\S]*? malloc\s*\(/) || code.match(/for\s*\([^)]*\)[\s\S]*? malloc\s*\(/)) {
        warning = "⚠️ Phát hiện 'malloc()' trong vòng lặp nhúng! Việc cấp phát động liên tục sẽ gây phân mảnh Heap và làm cạn kiệt SRAM sau vài giờ.";
    }
    // Check 3: Large stack buffer
    else if (code.match(/int\s+[a-zA-Z0-9_]+\[\s*(?:[2-9]\d{3}|\d{5,})\s*\]/)) {
        warning = "⚠️ Mảng buffer cục bộ quá lớn trên Stack! Vi điều khiển có dung lượng Task Stack giới hạn (~4KB), nguy cơ tràn Stack Overflow.";
    }

    if (warning) {
        linterBox.style.display = "flex";
        linterMsg.innerText = warning;
    } else {
        linterBox.style.display = "none";
    }
}

// ==========================================
// CODELEARN PRACTICE ARENA LOGIC
// ==========================================
function renderPracticeView() {
    // 1. Render Module Filter Chips
    const filterContainer = document.getElementById("practice-filter-row");
    if (filterContainer) {
        filterContainer.innerHTML = "";
        MODULE_FILTER_META.forEach(meta => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `practice-filter-chip ${activeModuleFilter === meta.key ? 'active' : ''}`;
            btn.innerText = meta.label;
            btn.onclick = () => setModuleFilter(meta.key);
            filterContainer.appendChild(btn);
        });
    }

    // 2. Render Problem List
    const listContainer = document.getElementById("problem-list-container");
    if (!listContainer) return;
    listContainer.innerHTML = "";

    const solvedList = profile.solvedProblems || [];

    practiceExercises.forEach((prob, idx) => {
        // Filter check
        if (activeModuleFilter !== 'all' && prob.stageIndex !== parseInt(activeModuleFilter, 10)) {
            return;
        }

        const item = document.createElement("div");
        const isSolved = solvedList.includes(prob.id);
        item.className = `problem-item ${idx === currentProblemIndex ? 'active' : ''}`;
        item.onclick = () => selectProblem(idx);

        let diffClass = "diff-easy";
        if (prob.difficulty === "Trung bình") diffClass = "diff-med";
        else if (prob.difficulty === "Nâng cao") diffClass = "diff-hard";

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                <span style="font-size: 13px;">${isSolved ? '✅' : '⚪'}</span>
                <span class="problem-stage-badge">M${prob.stageIndex + 1}</span>
                <span class="problem-item-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prob.title}</span>
            </div>
            <span class="difficulty-tag ${diffClass}" style="flex-shrink: 0;">${prob.difficulty}</span>
        `;
        listContainer.appendChild(item);
    });

    // Cập nhật XP & Header
    const practiceXpTag = document.getElementById("practice-xp-tag");
    if (practiceXpTag) practiceXpTag.innerText = "⭐ " + (profile.xp || 0) + " XP";

    const tabPracticeCount = document.getElementById("tab-practice-count");
    if (tabPracticeCount) tabPracticeCount.innerText = `${solvedList.length}/${practiceExercises.length} Bài`;

    const portalCode = document.getElementById("portal-code-stat");
    if (portalCode) portalCode.innerText = `${solvedList.length}/${practiceExercises.length} Bài • ${profile.xp || 0} XP`;

    const metricCode = document.getElementById("metric-code-solved");
    if (metricCode) metricCode.innerText = `${solvedList.length}/${practiceExercises.length}`;

    loadProblemDetails(currentProblemIndex);
}

function selectProblem(index) {
    currentProblemIndex = index;
    renderPracticeView();
}

function openPracticeProblem(probIdx) {
    if (probIdx < 0 || probIdx >= practiceExercises.length) return;
    activeModuleFilter = 'all'; // Đảm bảo bài tập hiển thị
    currentProblemIndex = probIdx;
    if (typeof switchTab === 'function') switchTab('practice');
    renderPracticeView();
    const prob = practiceExercises[probIdx];
    const titleEl = document.getElementById("prob-title");
    if (titleEl) titleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`🎯 Đã mở bài tập: ${prob.title}`);
}

// ==========================================
// 📚 MAPPING LIÊN KẾT BÀI TẬP VỚI LÝ THUYẾT NỀN TẢNG (THEORY LINK BRIDGE)
// ==========================================
const STAGE_THEORY_PRACTICE_MAP = {
    0: {
        stageBadge: "Lý thuyết Bước 1",
        stageTitle: "Bước 1: C Core, Con Trỏ (Pointers) & Quản Lý Bộ Nhớ ESP32-S3",
        docId: "doc_stage1_memory",
        deepdiveDocId: "doc_c_pointers_deepdive",
        bookId: "book_esps3_trm",
        standardRef: "ESP32-S3 TRM Ch.5 / MISRA C:2012 Rule 10.1 & Rule 21.3",
        concepts: {
            bitwise: {
                title: "Thao Tác Bitwise & Memory-Mapped I/O (Chuẩn MISRA C:2012 Rule 10.1)",
                synopsis: "Trên vi điều khiển ESP32-S3, các chân GPIO và thanh ghi phần cứng được điều khiển qua từng bit riêng lẻ (ESP32-S3 TRM Ch.5). Sử dụng toán tử OR (|) để set bit, AND đảo (& ~) để clear bit, XOR (^) để toggle bit trực tiếp trên ALU nhằm tối ưu chu kỳ máy và tuân thủ quy tắc ép kiểu số nguyên an toàn MISRA C."
            },
            pointers: {
                title: "Con Trỏ C, Con Trỏ Struct & Truyền Zero-Copy (Expert C Programming Ch.4-5)",
                synopsis: "Con trỏ lưu địa chỉ ô nhớ RAM. Khi xử lý buffer âm thanh hoặc cảm biến (32KB), truyền con trỏ struct (const Frame_t *f) chỉ tốn 4 byte Stack (Zero-Copy), bảo vệ hệ thống không bị tràn Stack Overflow. Sử dụng toán tử mũi tên (->) để truy xuất trường dữ liệu trực tiếp trong RAM theo chuẩn ISO/IEC 9899:2011."
            },
            memory: {
                title: "Kiến Trúc Bộ Nhớ SRAM/PSRAM, Căn Lề 16-Byte & Cấp Phát Tĩnh (SEI CERT C MEM31-C)",
                synopsis: "Internal SRAM (512KB) chạy 240MHz tốc độ 1 cycle (ESP32-S3 TRM Ch.2), lý tưởng cho Tensor Arena của TinyML. Lệnh Vector SIMD 128-bit bắt buộc mảng phải căn lề 16-byte. Để hệ thống chạy 24/7 ổn định theo chuẩn an toàn MISRA C:2012 Rule 21.3, luôn ưu tiên cấp phát tĩnh, tránh malloc() gây phân mảnh Heap."
            }
        }
    },
    1: {
        stageBadge: "Lý thuyết Bước 2",
        stageTitle: "Bước 2: GPTimer Định Thời Micro-giây & Hàm Ngắt IRAM_ATTR",
        docId: "doc_stage2_timer",
        bookId: "book_esps3_trm",
        standardRef: "ESP32-S3 TRM Ch.11 GPTimer / FreeRTOS Kernel Book Ch.6",
        concepts: {
            timer: {
                title: "Định Thời Chính Xác Micro-Giây Bằng Hardware GPTimer (ESP32-S3 TRM Ch.11)",
                synopsis: "Mô hình Edge AI đòi hỏi tần số lấy mẫu cực kỳ chuẩn xác (Deterministic Sampling). GPTimer 54-bit chạy trên xung 80MHz, prescaler 80 cho độ phân giải đúng 1 µs, loại bỏ hoàn toàn độ lệch jitter và trôi thời gian."
            },
            isr: {
                title: "Hàm Ngắt IRAM_ATTR & Cơ Chế Deferred Processing (FreeRTOS Kernel Book Ch.6)",
                synopsis: "Hàm ngắt phục vụ Timer bắt buộc gắn cờ IRAM_ATTR để nằm trọn vẹn trong SRAM, tránh crash khi Flash Cache bị khóa. ISR không được gọi delay() hay printf(), chỉ kích hoạt FreeRTOS Semaphore hoặc Ring Buffer để chuyển việc nặng cho Task bên ngoài."
            }
        }
    },
    2: {
        stageBadge: "Lý thuyết Bước 3",
        stageTitle: "Bước 3: Thu Thập Tín Hiệu Cảm Biến I2C/I2S DMA & Biến Đổi Phổ FFT",
        docId: "doc_stage3_sensors",
        bookId: "book_oppenheim_dsp",
        standardRef: "Oppenheim & Schafer Ch.4, 7, 9 / ESP32-S3 TRM Ch.26 & Ch.29",
        concepts: {
            sensors: {
                title: "Giao Tiếp I2C Burst Read & I2S Digital Audio DMA (ESP32-S3 TRM Ch.26 & 29)",
                synopsis: "Đọc cảm biến IMU qua chế độ Burst Read đọc liên tục 14 bytes giảm overhead trên bus I2C. Microphone kỹ thuật số xuất tín hiệu qua I2S DMA Ping-Pong buffer tự động nạp vào RAM mà không tốn chu kỳ lệnh CPU."
            },
            dsp: {
                title: "Lọc Nhiễu Số & Biến Đổi Fourier Nhanh FFT (Oppenheim & Schafer 2010)",
                synopsis: "Tín hiệu sóng thời gian được khử DC Offset, lọc nhiễu qua Moving Average/Median, sau đó biến đổi Fourier nhanh Cooley-Tukey Radix-2 FFT 512 điểm qua thư viện ESP-DSP để trích xuất phổ tần số Spectrogram làm đầu vào cho mạng nơ-ron."
            }
        }
    },
    3: {
        stageBadge: "Lý thuyết Bước 4",
        stageTitle: "Bước 4: Đa Nhiệm FreeRTOS Dual-Core & Đồng Bộ Hóa Hàng Đợi Queue",
        docId: "doc_stage4_freertos",
        bookId: "book_freertos_kernel",
        standardRef: "Mastering the FreeRTOS Real Time Kernel Ch.3, 4, 7, 9 / NASA Case Study",
        concepts: {
            freertos: {
                title: "Phân Chia 2 Nhân SMP, Mutex Priority Inheritance & TWDT (FreeRTOS Kernel Book)",
                synopsis: "Core 0 chuyên trách mạng Wi-Fi và I/O, Core 1 dành trọn 100% tài nguyên cho mô hình TinyML suy luận. Dữ liệu cảm biến chuyển sang AI qua FreeRTOS Queue đệm an toàn, dùng Mutex Priority Inheritance chống lỗi đảo ngược quyền ưu tiên từng gặp trên tàu NASA Mars Pathfinder 1997."
            }
        }
    },
    4: {
        stageBadge: "Lý thuyết Bước 5",
        stageTitle: "Bước 5: Network Wi-Fi, Giao Thức MQTT & Nâng Cấp Firmware Từ Xa OTA",
        docId: "doc_stage5_network",
        bookId: "book_esps3_trm",
        standardRef: "OASIS MQTT v5.0 / RFC 9000 / ESP32-S3 TRM Ch.2 Partition Table",
        concepts: {
            network: {
                title: "Wi-Fi Tự Phục Hồi, MQTT Telemetry & Bảng Phân Vùng Dual OTA (ESP32-S3 TRM Ch.2)",
                synopsis: "Thuật toán Exponential Backoff chống dội mạng khi Wi-Fi mất kết nối theo chuẩn RFC 9000. MQTT truyền gói tin siêu nhẹ tiêu thụ ít năng lượng. Bảng phân vùng Flash gồm 2 slot (ota_0, ota_1) cho phép tải và xác thực firmware từ xa an toàn 100% không lo bị 'biến thành cục gạch'."
            }
        }
    },
    5: {
        stageBadge: "Lý thuyết Bước 6",
        stageTitle: "Bước 6: Mô Hình AI Trên Edge (TinyML), TFLite Micro & Lượng Tử Hóa INT8",
        docId: "doc_stage6_tinyml",
        bookId: "book_jacob_quantization",
        standardRef: "Benoit Jacob et al. 2018 CVPR / TinyML (O'Reilly) Ch.8 / MLPerf Tiny 2021",
        concepts: {
            tinyml: {
                title: "Lượng Tử Hóa INT8, Khởi Tạo Tensor Arena & Gọi Invoke() (Benoit Jacob 2018 CVPR)",
                synopsis: "Chuyển đổi trọng số Float32 sang INT8 theo công thức bài báo Google CVPR 2018: q = round(r / Scale) + ZeroPoint, giảm 75% dung lượng RAM/Flash và tăng tốc độ suy luận 400% nhờ nhân ma trận số nguyên. Tensor Arena được cấp phát tĩnh căn lề 16-byte. Dùng ArgMax để trích xuất nhãn xác suất cao nhất."
            }
        }
    }
};

function getProblemTheoryContext(prob) {
    if (!prob) {
        return {
            stageBadge: "Lý thuyết C Core",
            stageTitle: "Bước 1: C Core & Quản Lý Bộ Nhớ",
            conceptTitle: "Kiến trúc nhúng & C Core",
            docId: "doc_c_pointers_deepdive",
            bookId: "book_esps3_trm",
            standardRef: "ESP32-S3 TRM Ch.5 / MISRA C:2012",
            synopsis: "Nền tảng C nhúng và quản lý bộ nhớ vi điều khiển ESP32."
        };
    }

    const sIdx = (typeof prob.stageIndex === 'number' && prob.stageIndex >= 0 && prob.stageIndex <= 5) ? prob.stageIndex : 0;
    const meta = STAGE_THEORY_PRACTICE_MAP[sIdx] || STAGE_THEORY_PRACTICE_MAP[0];

    let conceptKey = "bitwise";
    let targetDocId = meta.docId;

    if (sIdx === 0) {
        const pNum = parseInt((prob.id || "").replace("prob_", ""), 10);
        if (pNum >= 1 && pNum <= 4) {
            conceptKey = "bitwise";
            targetDocId = meta.docId;
        } else if (pNum >= 5 && pNum <= 8) {
            conceptKey = "pointers";
            targetDocId = meta.deepdiveDocId || meta.docId;
        } else {
            conceptKey = "memory";
            targetDocId = meta.docId;
        }
    } else if (sIdx === 1) {
        const pNum = parseInt((prob.id || "").replace("prob_", ""), 10);
        conceptKey = (pNum <= 16) ? "timer" : "isr";
    } else if (sIdx === 2) {
        const pNum = parseInt((prob.id || "").replace("prob_", ""), 10);
        conceptKey = (pNum <= 32) ? "sensors" : "dsp";
    } else if (sIdx === 3) {
        conceptKey = "freertos";
    } else if (sIdx === 4) {
        conceptKey = "network";
    } else if (sIdx === 5) {
        conceptKey = "tinyml";
    }

    const concept = (meta.concepts && meta.concepts[conceptKey]) ? meta.concepts[conceptKey] : {
        title: prob.linkedSkill || "Lập trình C Nhúng Thực Chiến",
        synopsis: "Bài tập rèn luyện kỹ năng cốt lõi được giảng dạy trong lý thuyết giai đoạn này."
    };

    return {
        stageBadge: meta.stageBadge,
        stageTitle: meta.stageTitle,
        conceptTitle: concept.title,
        docId: targetDocId,
        bookId: prob.bookId || meta.bookId || "book_esps3_trm",
        standardRef: prob.standardRef || meta.standardRef || "Chuẩn Quốc Tế",
        synopsis: concept.synopsis
    };
}

function openLinkedTheoryForCurrentProblem() {
    const prob = practiceExercises[currentProblemIndex];
    if (!prob) return;
    const theoryCtx = getProblemTheoryContext(prob);
    if (typeof switchTab === 'function') {
        switchTab('notebook');
    }
    if (typeof selectNotebookDoc === 'function') {
        selectNotebookDoc(theoryCtx.docId);
    }
    if (typeof setNotebookRightMode === 'function') {
        setNotebookRightMode('reader');
    }
    showToast(`📖 Đã mở giáo trình: ${theoryCtx.stageTitle}`);
}

function openBookshelfForCurrentProblem() {
    const prob = practiceExercises[currentProblemIndex];
    if (!prob) return;
    const theoryCtx = getProblemTheoryContext(prob);
    const targetBookId = prob.bookId || theoryCtx.bookId || "book_esps3_trm";
    
    if (typeof openBookshelfForBook === 'function') {
        openBookshelfForBook(targetBookId);
    } else if (typeof openBookshelfModal === 'function') {
        openBookshelfModal();
    }
    
    if (typeof showToast === 'function') {
        showToast(`📚 Đang mở tài liệu: ${prob.standardRef || theoryCtx.standardRef}`);
    }
}

function openRoadmapStageForCurrentProblem() {
    const prob = practiceExercises[currentProblemIndex];
    if (!prob) return;
    const sIdx = (typeof prob.stageIndex === 'number' && prob.stageIndex >= 0) ? prob.stageIndex : 0;
    if (typeof switchTab === 'function') {
        switchTab('learning');
    }
    setTimeout(() => {
        const stages = document.querySelectorAll(".roadmap-stage");
        if (stages && stages[sIdx]) {
            stages[sIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 250);
    showToast(`🗺️ Đã định vị Bước ${sIdx + 1} trên Lộ Trình`);
}

function loadProblemDetails(index) {
    const prob = practiceExercises[index];
    if (!prob) return;

    const titleEl = document.getElementById("prob-title");
    if (titleEl) titleEl.innerText = prob.title;

    // 📚 Cập nhật Khối Liên Kết Lý Thuyết Nền Tảng (Theory Link Bridge)
    const theoryCtx = getProblemTheoryContext(prob);
    const theoryBadge = document.getElementById("prob-theory-stage-badge");
    if (theoryBadge) theoryBadge.innerText = `📖 ${theoryCtx.stageBadge}`;

    const theoryConcept = document.getElementById("prob-theory-concept");
    if (theoryConcept) theoryConcept.innerText = `Khái niệm: ${theoryCtx.conceptTitle}`;

    const theorySynopsis = document.getElementById("prob-theory-synopsis");
    if (theorySynopsis) theorySynopsis.innerText = theoryCtx.synopsis;

    const standardBadge = document.getElementById("prob-standard-badge");
    if (standardBadge) {
        standardBadge.innerText = `🛡️ ${prob.standardRef || theoryCtx.standardRef || "Chuẩn Quốc Tế"}`;
        standardBadge.title = `Tài liệu gốc & Tiêu chuẩn viện dẫn: ${prob.standardRef || theoryCtx.standardRef || ""}`;
    }

    const descEl = document.getElementById("prob-desc");
    if (descEl) descEl.innerHTML = prob.desc;

    const realWorldEl = document.getElementById("prob-realworld");
    if (realWorldEl) {
        realWorldEl.innerHTML = prob.realWorld || `Kỹ thuật này được áp dụng trực tiếp trong tầng giao tiếp phần cứng (HAL), driver cảm biến hoặc tiền xử lý tín hiệu trước khi nạp vào mô hình TinyML trên ESP32.`;
    }

    const whyMattersEl = document.getElementById("prob-why-matters");
    if (whyMattersEl) {
        whyMattersEl.innerHTML = prob.whyMatters || `Rèn luyện kỹ năng thao tác bộ nhớ ở mức độ thanh ghi nhúng, tối ưu hóa thời gian thực thi (chu kỳ xung nhịp CPU) và ngăn ngừa lỗi sập nguồn bộ nhớ (OOM/Guru Meditation Error) khi thiết bị chạy 24/7.`;
    }

    const exampleEl = document.getElementById("prob-example");
    if (exampleEl) exampleEl.innerText = prob.example;

    const hintEl = document.getElementById("prob-hint");
    if (hintEl) hintEl.innerHTML = prob.hint;

    const xpEl = document.getElementById("prob-xp");
    if (xpEl) xpEl.innerText = `+${prob.xp} XP`;

    const topicEl = document.getElementById("prob-topic");
    if (topicEl) topicEl.innerText = `[M${prob.stageIndex + 1}] ${prob.topic}`;

    const diffEl = document.getElementById("prob-diff");
    if (diffEl) {
        diffEl.innerText = prob.difficulty;
        diffEl.className = "difficulty-tag " + (prob.difficulty === "Dễ" ? "diff-easy" : (prob.difficulty === "Trung bình" ? "diff-med" : "diff-hard"));
    }

    const editor = document.getElementById("code-editor");
    if (editor) {
        if (codeCache && codeCache[prob.id]) {
            editor.value = codeCache[prob.id];
        } else {
            editor.value = prob.initialCode;
        }
        runEmbeddedLinter(editor.value);
    }

    const acceptedBanner = document.getElementById("accepted-banner");
    if (acceptedBanner) acceptedBanner.style.display = "none";

    const testCardsContainer = document.getElementById("test-cards-container");
    if (testCardsContainer) {
        testCardsContainer.innerHTML = `
            <div style="font-size: 12.5px; color: var(--text-muted); padding: 10px 0;">
                Nhấn <strong>"▶ Chạy thử nghiệm"</strong> hoặc <strong>"🚀 Nộp bài"</strong> để bắt đầu kiểm tra tính đúng đắn của code C.
            </div>
        `;
    }

    const summaryBadge = document.getElementById("test-summary-badge");
    if (summaryBadge) summaryBadge.style.display = "none";

    const consoleOutput = document.getElementById("console-output");
    if (consoleOutput) consoleOutput.innerText = `Đã tải ${prob.title} (Module ${prob.stageIndex + 1}). Hãy viết hàm và kiểm thử.`;
}

function resetCurrentCode() {
    const prob = practiceExercises[currentProblemIndex];
    const editor = document.getElementById("code-editor");
    if (editor && prob) {
        editor.value = prob.initialCode;
        if (codeCache) {
            delete codeCache[prob.id];
            localStorage.setItem(STORAGE_CODE_CACHE, JSON.stringify(codeCache));
        }
        runEmbeddedLinter(editor.value);
        showToast("Đã khôi phục mã nguồn ban đầu!");
    }
}

function loadSolutionCode() {
    const prob = practiceExercises[currentProblemIndex];
    const editor = document.getElementById("code-editor");
    if (editor && prob) {
        editor.value = prob.solutionCode;
        if (codeCache) {
            codeCache[prob.id] = editor.value;
            localStorage.setItem(STORAGE_CODE_CACHE, JSON.stringify(codeCache));
        }
        runEmbeddedLinter(editor.value);
        showToast("Đã nạp lời giải mẫu tham khảo!");
    }
}

// Gắn sự kiện soạn thảo
const codeEditorEl = document.getElementById("code-editor");
if (codeEditorEl) {
    codeEditorEl.addEventListener("input", (e) => {
        const prob = practiceExercises[currentProblemIndex];
        if (prob && codeCache) {
            codeCache[prob.id] = e.target.value;
            localStorage.setItem(STORAGE_CODE_CACHE, JSON.stringify(codeCache));
        }
        runEmbeddedLinter(e.target.value);
    });

    codeEditorEl.addEventListener("keydown", function(e) {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
        }
    });
}

// ==========================================
// C & EDGE AI TEST RUNNER ENGINE
// ==========================================
function executeTests(isSubmit) {
    const prob = practiceExercises[currentProblemIndex];
    if (!prob) return;

    const userCode = document.getElementById("code-editor").value;
    const consoleOutput = document.getElementById("console-output");
    const testCardsContainer = document.getElementById("test-cards-container");
    const summaryBadge = document.getElementById("test-summary-badge");
    const acceptedBanner = document.getElementById("accepted-banner");

    consoleOutput.innerText = `Đang phân tích cú pháp C và chạy bộ kiểm thử [${prob.title}]...\n`;
    testCardsContainer.innerHTML = "";
    if (acceptedBanner) acceptedBanner.style.display = "none";

    let funcBody = "";
    const bodyMatch = userCode.match(new RegExp(prob.fnName + "\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*)\\}"));
    
    if (!bodyMatch) {
        consoleOutput.innerText += `❌ Lỗi Biên Dịch (Compile Error):\nKhông tìm thấy định nghĩa hàm '${prob.fnName}(...) { ... }' trong mã nguồn. Hãy giữ nguyên tên hàm!`;
        return;
    }

    funcBody = bodyMatch[1].trim();

    // Chuẩn hóa cú pháp C sang JavaScript an toàn
    let jsLogic = funcBody
        // Chuyển mảng khởi tạo C: int arr[4] = {s0, s1, s2, s3}; -> var arr = [s0, s1, s2, s3];
        .replace(/(?:int|float|uint8_t|int8_t|uint16_t|int16_t|uint32_t|int32_t)\s+([a-zA-Z0-9_]+)\s*\[\s*\d*\s*\]\s*=\s*\{([^}]*)\}/g, "var $1 = [$2]")
        // Chuyển kiểu ép kiểu C số nguyên: (int)(...), (uint32_t)(...), (int16_t)(...) -> Math.trunc(...)
        .replace(/\((?:int|uint32_t|uint16_t|uint8_t|int16_t|int8_t|int32_t|size_t)\)\s*\(([^)]+)\)/g, "Math.trunc($1)")
        .replace(/\((?:int|uint32_t|uint16_t|uint8_t|int16_t|int8_t|int32_t|size_t)\)\s*([a-zA-Z0-9_]+)/g, "$1")
        .replace(/\((?:int|uint32_t|uint16_t|uint8_t|int16_t|int8_t|int32_t|size_t)\)/g, "")
        // Bỏ các từ khóa kiểu dữ liệu C khi khai báo biến: int a = ... -> var a = ...
        .replace(/\b(?:int16_t|uint32_t|uint16_t|uint8_t|int8_t|int32_t|float|double|int|size_t)\b/g, "var")
        .replace(/\bconst\b/g, "")
        .replace(/\bvolatile\b/g, "")
        // Bỏ hậu tố float 'f' trong số: 1.27f -> 1.27
        .replace(/(\d+(?:\.\d+)?)f\b/g, "$1");

    let userFunction;
    try {
        const paramNames = prob.params || ["a", "b", "c", "d"];
        userFunction = new Function(...paramNames, jsLogic);
    } catch (err) {
        consoleOutput.innerText += `❌ Lỗi Cú Pháp (Syntax Error):\n${err.message}\nVui lòng kiểm tra dấu chấm phẩy, đóng mở ngoặc hoặc toán tử!`;
        return;
    }

    let passedCount = 0;
    const casesToRun = isSubmit ? prob.testCases : prob.testCases.slice(0, 2);
    let logs = [];

    casesToRun.forEach((tc, idx) => {
        const startTime = performance.now();
        let actual;
        let error = null;

        try {
            actual = userFunction.apply(null, tc.input);
        } catch (e) {
            error = e.message;
        }
        const execTime = (performance.now() - startTime).toFixed(2);

        const isPass = !error && actual === tc.expected;
        if (isPass) passedCount++;

        const card = document.createElement("div");
        card.className = `test-case-card ${isPass ? 'passed' : 'failed'}`;
        card.innerHTML = `
            <div class="test-card-top">
                <span>Test #${idx + 1} (${tc.label})</span>
                <span style="color: ${isPass ? 'var(--accent)' : 'var(--danger)'};">
                    ${isPass ? '✓ PASSED' : '✕ FAILED'}
                </span>
            </div>
            <div style="color: var(--text-muted);">In: [${tc.input.join(', ')}]</div>
            <div>Exp: <span style="color: var(--accent);">${tc.expected}</span> | Act: <span style="color: ${isPass ? 'var(--accent)' : 'var(--danger)'};">${error ? 'Error' : actual}</span></div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Time: ${execTime}ms</div>
        `;
        testCardsContainer.appendChild(card);

        logs.push(`Test Case #${idx + 1}: ${isPass ? 'PASSED (Chính xác)' : 'FAILED (Sai kết quả)'} - Input: (${tc.input.join(', ')}) -> Expected: ${tc.expected}, Actual: ${actual}`);
    });

    consoleOutput.innerText = logs.join("\n");

    if (summaryBadge) {
        summaryBadge.style.display = "inline-flex";
        summaryBadge.innerText = `${passedCount}/${casesToRun.length} Passed`;
        summaryBadge.className = passedCount === casesToRun.length ? "badge badge-live" : "badge";
    }

    if (passedCount === casesToRun.length) {
        if (isSubmit) {
            if (acceptedBanner) {
                acceptedBanner.style.display = "flex";
                const bannerDesc = document.getElementById("accepted-banner-desc");
                if (bannerDesc) {
                    bannerDesc.innerText = `Chúc mừng! Bạn đã vượt qua tất cả ${casesToRun.length} Test Cases và nhận được +${prob.xp} XP. Kỹ năng "${prob.linkedSkill}" đã được tự động mở khóa trong Lộ trình!`;
                }
            }

            if (!profile.solvedProblems) profile.solvedProblems = [];
            if (!profile.solvedProblems.includes(prob.id)) {
                profile.solvedProblems.push(prob.id);
                profile.xp = (profile.xp || 0) + prob.xp;
            }

            // Tự động tick hoàn thành task tương ứng trong roadmap
            if (typeof roadmap !== 'undefined' && Array.isArray(roadmap)) {
                roadmap.forEach(st => {
                    st.tasks.forEach(t => {
                        if (t.skill === prob.linkedSkill) {
                            t.done = true;
                        }
                    });
                });
            }

            if (typeof saveState === 'function') saveState();
            if (typeof logStudyActivity === 'function') {
                logStudyActivity('practice', 2, `Code C: ${prob.title}`);
            }
            if (typeof renderRoadmap === 'function') renderRoadmap();
            renderPracticeView();
            showToast(`🎉 ACCEPTED! Nhận thành công +${prob.xp} XP!`);
            // Play XP gain + success SFX
            if (typeof AudioEngine !== 'undefined') { AudioEngine.playSFX('xp'); setTimeout(() => AudioEngine.playSFX('success'), 200); }
        } else {
            showToast("✓ Chạy thử nghiệm thành công! Hãy nhấn 'Nộp bài' để chấm điểm toàn bộ.");
        }
    } else {
        showToast("✕ Còn Test Case chưa chính xác. Vui lòng kiểm tra lại logic!");
        // Play error SFX
        if (typeof AudioEngine !== 'undefined') AudioEngine.playSFX('error');
    }
}

function saveExerciseToNotebook() {
    const prob = practiceExercises[currentProblemIndex];
    if (!prob) return;
    const userCode = document.getElementById("code-editor").value;

    if (typeof notes !== 'undefined') {
        notes.unshift({
            id: "note_sol_" + Date.now(),
            title: `[CodeLearn M${prob.stageIndex + 1}] Lời giải: ${prob.title}`,
            category: prob.topic.includes("AI") ? "6. AI Model" : (prob.topic.includes("C ") ? "1. C & Bộ nhớ" : "Lộ Trình"),
            content: `Bài tập thực hành Edge AI đã giải thành công 100% test cases:\n${prob.desc.replace(/<[^>]*>?/gm, '')}\nKỹ năng xác thực: ${prob.linkedSkill}`,
            code: userCode,
            date: new Date().toLocaleDateString('vi-VN')
        });

        if (typeof saveState === 'function') saveState();
        if (typeof renderNotes === 'function') renderNotes();
        showToast("Đã lưu bài giải hoàn chỉnh vào Sổ tay của bạn!");
    }
}

// ==========================================
// 7. EMBEDDED C INDUSTRY PRESETS & EXTERNAL / AI EXERCISES
// ==========================================
const STORAGE_CUSTOM_EXERCISES = "edge_ai_custom_exercises_v1";

const PRESET_INTERVIEW_EXERCISES = [
    {
        id: "preset_ring_buffer",
        stageIndex: 0,
        title: "Phỏng Vấn [Qualcomm]: Quản Lý Con Trỏ Ring Buffer Cho Audio I2S",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 120,
        source: "Qualcomm / Embedded DSP",
        desc: `Vi điều khiển thu âm thanh 16kHz liên tục từ micro I2S qua DMA. Bộ đệm tròn (Ring/Circular Buffer) cho phép luồng ngắt ISR ghi dữ liệu mới vào đuôi mảng trong khi luồng AI đọc từ đầu mảng để xử lý. Hãy viết hàm tính chỉ số ô nhớ tiếp theo <code>next_index</code> sau khi con trỏ ghi tiến thêm <code>step</code> bước trong bộ đệm vòng có kích thước <code>capacity</code>.`,
        realWorld: `Phát hiện bất thường bằng sai số tái tạo (Reconstruction Error = Sum(|Input - Output|)) của mô hình học sâu AutoEncoder giám sát động cơ.`,
        whyMatters: `AutoEncoder được huấn luyện trên dữ liệu bình thường. Khi động cơ có dấu hiệu hỏng hóc, mô hình không thể tái tạo lại tín hiệu và sai số tăng vọt, giúp phát hiện sự cố sớm nhiều ngày trước khi máy móc bị phá hủy.`,
        example: `Input: current_index = 3, step = 2, capacity = 8 -> Output: 5\nInput: current_index = 7, step = 1, capacity = 8 -> Output: 0 (vòng lại đầu)`,
        hint: `Toán tử chia lấy dư (Modulo): <code>return (current_index + step) % capacity;</code>`,
        initialCode: `int get_next_ring_index(int current_index, int step, int capacity) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int get_next_ring_index(int current_index, int step, int capacity) {\n    return (current_index + step) % capacity;\n}`,
        fnName: "get_next_ring_index",
        params: ["current_index", "step", "capacity"],
        testCases: [
            { input: [3, 2, 8], expected: 5, label: "index 3 + 2 -> 5" },
            { input: [7, 1, 8], expected: 0, label: "index 7 + 1 (vòng về 0)" },
            { input: [6, 4, 8], expected: 2, label: "index 6 + 4 (vòng về 2)" },
            { input: [0, 8, 8], expected: 0, label: "index 0 + 8 (vòng về 0)" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "preset_fixed_point",
        stageIndex: 0,
        title: "Phỏng Vấn [Espressif]: Nhân Số Dấu Phẩy Tĩnh Q15 Cho TinyML",
        topic: "1. C & Bộ nhớ",
        difficulty: "Nâng cao",
        xp: 150,
        source: "Espressif / TinyML",
        desc: `ESP32 chạy các mô hình AI lượng tử hóa INT8/INT16 cần tính tích phân nơ-ron bằng số nguyên cố định thay vì số thực float để tăng tốc từ 3 đến 5 lần. Hãy thực hiện phép nhân hai số thực dấu phẩy tĩnh định dạng Q15 <code>a</code> và <code>b</code> (trong đó giá trị 1.0 tương đương 32768). Công thức: <code>(int32_t)(a * b) >> 15</code>.`,
        realWorld: `ESP32 chạy các lớp mạng nơ-ron Dense, Conv2D và bộ lọc âm thanh IIR: phép tính số nguyên 16-bit Q15 được thực thi trực tiếp trên bộ nhân Integer MAC của CPU, tiết kiệm 70% điện năng so với tính toán Float32.`,
        whyMatters: `Các dòng vi điều khiển giá rẻ (như ESP32-C3 RISC-V không có FPU) nếu dùng số thực float sẽ phải giả lập bằng phần mềm cực kỳ chậm. Kỹ sư nhúng bắt buộc phải làm chủ số học dấu phẩy tĩnh Fixed-point.`,
        example: `Input: a = 16384 (0.5), b = 16384 (0.5) -> Output: 8192 (0.25)`,
        hint: `Ép kiểu sang 32-bit rồi dịch phải 15 bit: <code>int32_t prod = (int32_t)a * (int32_t)b; return (int16_t)(prod >> 15);</code>`,
        initialCode: `int16_t q15_multiply(int16_t a, int16_t b) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int16_t q15_multiply(int16_t a, int16_t b) {\n    int32_t prod = (int32_t)a * (int32_t)b;\n    return (int16_t)(prod >> 15);\n}`,
        fnName: "q15_multiply",
        params: ["a", "b"],
        testCases: [
            { input: [16384, 16384], expected: 8192, label: "0.5 * 0.5 = 0.25" },
            { input: [32767, 16384], expected: 16383, label: "1.0 * 0.5 = 0.5" },
            { input: [0, 16384], expected: 0, label: "0 * 0.5 = 0" },
            { input: [16384, 8192], expected: 4096, label: "0.5 * 0.25 = 0.125" }
        ],
        linkedSkill: "SIMD Vector Alignment"
    },
    {
        id: "preset_stack_canary",
        stageIndex: 0,
        title: "Phỏng Vấn [Google/TI]: Kiểm Tra Con Trỏ Stack Canary Chống Tràn RAM",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 120,
        source: "Google / Texas Instruments",
        desc: `Trong hệ điều hành FreeRTOS, mỗi Task được cấp một vùng nhớ Stack riêng. Một giá trị đặc biệt (Canary Word như <code>0xDEADBEEF</code> hay <code>3735928559</code>) được đặt ở đáy Stack để phát hiện xem hàm có ghi tràn bộ đệm hay không. Viết hàm nhận vào giá trị đáy Stack <code>current_canary</code> và <code>expected_canary</code>. Trả về 1 nếu Stack nguyên vẹn, trả về 0 nếu bị ghi đè (Stack Overflow).`,
        realWorld: `Cơ chế bảo vệ bộ nhớ Stack Protection / Canary Word trong FreeRTOS và nhân Linux nhúng: ngăn chặn tin tặc tấn công tràn bộ đệm (Buffer Overflow Attack) hoặc phát hiện đệ quy vô tận làm hỏng thanh ghi hệ thống.`,
        whyMatters: `Tràn Stack là lỗi thầm lặng nguy hiểm nhất trong lập trình nhúng vì nó không crash ngay lập tức mà ghi đè ngẫu nhiên lên các biến khác, dẫn đến hành vi ma (Heisenbug) cực kỳ khó gỡ lỗi.`,
        example: `Input: current_canary = 3735928559, expected_canary = 3735928559 -> Output: 1 (An toàn)\nInput: current_canary = 0, expected_canary = 3735928559 -> Output: 0 (Bị tràn)`,
        hint: `So sánh bằng: <code>return (current_canary == expected_canary) ? 1 : 0;</code>`,
        initialCode: `int check_stack_integrity(uint32_t current_canary, uint32_t expected_canary) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int check_stack_integrity(uint32_t current_canary, uint32_t expected_canary) {\n    return (current_canary == expected_canary) ? 1 : 0;\n}`,
        fnName: "check_stack_integrity",
        params: ["current_canary", "expected_canary"],
        testCases: [
            { input: [3735928559, 3735928559], expected: 1, label: "Canary an toàn (0xDEADBEEF)" },
            { input: [0, 3735928559], expected: 0, label: "Canary bị đè bằng 0" },
            { input: [123456, 3735928559], expected: 0, label: "Canary bị ghi đè dữ liệu rác" }
        ],
        linkedSkill: "Heap Management & Anti-Fragmentation"
    },
    {
        id: "preset_safe_memmove",
        stageIndex: 0,
        title: "Phỏng Vấn [Linux Kernel/ESP-IDF]: Kiểm Tra Hướng Sao Chép Bộ Nhớ Chồng Lấn",
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 120,
        source: "Linux Kernel / ESP-IDF",
        desc: `Hàm chuẩn <code>memcpy()</code> sẽ gây lỗi phá hỏng dữ liệu nếu vùng nhớ nguồn <code>src</code> và đích <code>dest</code> bị chồng lấn (overlapping). Kỹ sư phải dùng <code>memmove()</code> để xác định hướng sao chép xuôi hay ngược. Nếu con trỏ đích <code>dest</code> nhỏ hơn con trỏ nguồn <code>src</code>, hàm trả về 1 (sao chép từ đầu đến cuối); nếu <code>dest >= src</code> trả về 0 (phải sao chép từ đuôi về đầu).`,
        realWorld: `Triển khai bộ đệm dịch chuyển (Sliding Window Buffer) cho cảm biến rung động gia tốc và luồng video frame camera khi một phần dữ liệu cũ được giữ lại và dịch về phía trước.`,
        whyMatters: `Là câu hỏi kinh điển trong phỏng vấn hệ thống nhúng cấp thấp. Rất nhiều lập trình viên mắc lỗi dùng memcpy() cho vùng nhớ chồng lấn khiến dữ liệu bị đè nát mà không hề có cảnh báo lỗi biên dịch!`,
        example: `Input: dest = 1000, src = 1020 -> Output: 1 (Sao chép xuôi)\nInput: dest = 1020, src = 1000 -> Output: 0 (Sao chép ngược)`,
        hint: `So sánh: <code>return (dest < src) ? 1 : 0;</code>`,
        initialCode: `int get_copy_direction(uint32_t dest, uint32_t src) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `int get_copy_direction(uint32_t dest, uint32_t src) {\n    return (dest < src) ? 1 : 0;\n}`,
        fnName: "get_copy_direction",
        params: ["dest", "src"],
        testCases: [
            { input: [1000, 1020], expected: 1, label: "dest < src -> chép xuôi" },
            { input: [1020, 1000], expected: 0, label: "dest > src -> chép ngược" },
            { input: [1000, 1000], expected: 0, label: "dest == src -> chép ngược" }
        ],
        linkedSkill: "Pointers & Dynamic Memory Layout"
    },
    {
        id: "preset_bit_reversal",
        stageIndex: 2,
        title: "Phỏng Vấn [Sony Audio]: Đảo Ngược Bit Index (Bit-Reversal) Cho FFT",
        topic: "3. Cảm biến & DSP",
        difficulty: "Nâng cao",
        xp: 150,
        source: "Sony / Audio AI",
        desc: `Thuật toán biến đổi Fourier nhanh (Cooley-Tukey Radix-2 FFT) xử lý âm thanh nhận diện từ khóa AI yêu cầu sắp xếp lại mảng dữ liệu đầu vào theo thứ tự đảo ngược bit của chỉ số. Viết hàm đảo ngược 4-bit của chỉ số <code>index</code> (từ 0 đến 15). Ví dụ: <code>index = 1 (0001b)</code> đảo thành <code>8 (1000b)</code>.`,
        realWorld: `Trích xuất đặc trưng âm thanh MFCC (Mel-Frequency Cepstral Coefficients) cho mô hình nhận diện giọng nói đánh thức 'Hey ESP' hoặc phân tích độ rung động cơ phát hiện hỏng hóc sớm.`,
        whyMatters: `Là câu hỏi kiểm tra tư duy xử lý tín hiệu số (DSP) nâng cao. Giúp giảm độ phức tạp tính toán phổ tần số từ O(N^2) xuống O(N log N).`,
        example: `Input: index = 1 -> Output: 8; Input: index = 3 (0011b) -> Output: 12 (1100b)`,
        hint: `Lặp 4 bước dịch bit: <code>uint8_t res = 0; for(int i=0; i<4; i++){ res = (res << 1) | ((index & 1); index >>= 1; } return res;</code>`,
        initialCode: `uint8_t reverse_4bits(uint8_t index) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t reverse_4bits(uint8_t index) {\n    uint8_t res = 0;\n    for(int i = 0; i < 4; i++) {\n        res = (res << 1) | (index & 1);\n        index >>= 1;\n    }\n    return res;\n}`,
        fnName: "reverse_4bits",
        params: ["index"],
        testCases: [
            { input: [1], expected: 8, label: "0001b -> 1000b (8)" },
            { input: [3], expected: 12, label: "0011b -> 1100b (12)" },
            { input: [0], expected: 0, label: "0000b -> 0000b (0)" },
            { input: [7], expected: 14, label: "0111b -> 1110b (14)" }
        ],
        linkedSkill: "Sensors & Signal Processing"
    },
    {
        id: "preset_uart_checksum",
        stageIndex: 4,
        title: "Phỏng Vấn [Bosch Automotive]: Kiểm Tra Checksum XOR Gói Tin Cảm Biến",
        topic: "5. Mạng & Giao thức",
        difficulty: "Trung bình",
        xp: 100,
        source: "Bosch / Automotive IoT",
        desc: `Giao thức truyền thông UART/CAN Bus trên xe hơi hoặc drone yêu cầu mỗi gói tin cảm biến phải có 1 byte Checksum XOR ở cuối để phát hiện nhiễu đường truyền. Viết hàm tính giá trị XOR của 4 byte dữ liệu cảm biến <code>b1, b2, b3, b4</code>.`,
        realWorld: `Giao thức cảm biến định vị GPS NMEA, truyền thông tay điều khiển máy bay không người lái RC và chuẩn mạng CAN Bus trong ô tô.`,
        whyMatters: `Đảm bảo dữ liệu gia tốc và hình ảnh gửi vào bộ não AI không bị sai lệch do tia lửa điện động cơ hoặc sóng nhiễu môi trường công nghiệp.`,
        example: `Input: b1=1, b2=2, b3=3, b4=4 -> Output: 4`,
        hint: `Toán tử XOR nối tiếp: <code>return b1 ^ b2 ^ b3 ^ b4;</code>`,
        initialCode: `uint8_t calc_xor_checksum(uint8_t b1, uint8_t b2, uint8_t b3, uint8_t b4) {\n    // Code của bạn ở đây:\n    \n}`,
        solutionCode: `uint8_t calc_xor_checksum(uint8_t b1, uint8_t b2, uint8_t b3, uint8_t b4) {\n    return b1 ^ b2 ^ b3 ^ b4;\n}`,
        fnName: "calc_xor_checksum",
        params: ["b1", "b2", "b3", "b4"],
        testCases: [
            { input: [1, 2, 3, 4], expected: 4, label: "1^2^3^4 = 4" },
            { input: [255, 255, 0, 0], expected: 0, label: "255^255 = 0" },
            { input: [170, 85, 0, 0], expected: 255, label: "0xAA ^ 0x55 = 0xFF" }
        ],
        linkedSkill: "Network Protocol Optimization"
    }
];

function initCustomExercises() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_EXERCISES) || "[]");
        if (Array.isArray(saved) && saved.length > 0) {
            saved.forEach(customProb => {
                if (!practiceExercises.some(p => p.id === customProb.id)) {
                    practiceExercises.push(customProb);
                }
            });
        }
    } catch (e) {
        console.warn("Lỗi nạp bài tập tùy chỉnh:", e);
    }
}
initCustomExercises();

function openExternalProbModal() {
    const modal = document.getElementById("external-prob-modal");
    if (modal) {
        modal.style.display = "flex";
        renderPresetProbGrid();
    }
}

function closeExternalProbModal() {
    const modal = document.getElementById("external-prob-modal");
    if (modal) modal.style.display = "none";
}

function switchExtTab(tabId) {
    document.querySelectorAll(".ext-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".ext-tab-content").forEach(c => c.classList.remove("active"));

    const targetBtn = document.getElementById(`tab-btn-${tabId}`);
    const targetContent = document.getElementById(`tab-content-${tabId}`);
    if (targetBtn) targetBtn.classList.add("active");
    if (targetContent) targetContent.classList.add("active");

    if (tabId === 'presets') renderPresetProbGrid();
}

function renderPresetProbGrid() {
    const container = document.getElementById("preset-prob-grid");
    if (!container) return;

    container.innerHTML = "";
    PRESET_INTERVIEW_EXERCISES.forEach(preset => {
        const isLoaded = practiceExercises.some(p => p.id === preset.id);
        const card = document.createElement("div");
        card.className = "preset-prob-card";
        card.innerHTML = `
            <div>
                <span class="preset-badge-source">🏛️ ${preset.source}</span>
                <div class="preset-card-title">${preset.title}</div>
                <div class="preset-card-meta">
                    <strong>Độ khó:</strong> ${preset.difficulty} • <strong>+${preset.xp} XP</strong><br>
                    <strong>Tác dụng:</strong> ${preset.whyMatters.substring(0, 110)}...
                </div>
            </div>
            <div style="margin-top: 8px;">
                <button type="button" class="btn ${isLoaded ? 'btn-secondary' : 'btn-accent'}" style="width: 100%; font-size: 11.5px; padding: 6px 10px;" onclick="loadPresetInterviewProblem('${preset.id}')">
                    ${isLoaded ? '🎯 Đã Nạp (Mở Làm Ngay)' : '➕ Nạp Bài Này Vào Luyện Tập'}
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadPresetInterviewProblem(presetId) {
    const preset = PRESET_INTERVIEW_EXERCISES.find(p => p.id === presetId);
    if (!preset) return;

    let existingIdx = practiceExercises.findIndex(p => p.id === preset.id);
    if (existingIdx === -1) {
        practiceExercises.push(preset);
        existingIdx = practiceExercises.length - 1;
        // Lưu vào custom storage để tồn tại vĩnh viễn
        saveCustomToStorage(preset);
    }

    closeExternalProbModal();
    openPracticeProblem(existingIdx);
    showToast(`⚡ Đã nạp thành công bài phỏng vấn: ${preset.title}`);
}

let generatedAiProblemTemp = null;

async function generateExerciseWithAI() {
    const topicInput = document.getElementById("ai-prob-topic-input");
    const diffSelect = document.getElementById("ai-prob-diff-select");
    const modSelect = document.getElementById("ai-prob-module-select");
    const btn = document.getElementById("btn-run-ai-generator");
    const previewBox = document.getElementById("ai-gen-preview-box");

    const topic = topicInput ? topicInput.value.trim() : "";
    if (!topic) {
        showToast("⚠️ Vui lòng nhập chủ đề bạn muốn AI tạo bài tập!");
        if (topicInput) topicInput.focus();
        return;
    }

    const difficulty = diffSelect ? diffSelect.value : "Trung bình";
    const stageIndex = modSelect ? parseInt(modSelect.value, 10) : 0;
    const xp = difficulty === "Dễ" ? 50 : (difficulty === "Trung bình" ? 100 : 150);

    if (btn) {
        btn.disabled = true;
        btn.innerText = "⏳ Đang kết nối trí tuệ nhân tạo Gemini để thiết kế bài tập C...";
    }

    // Tạo bài tập thông minh (hỗ trợ cả Gemini API online và Smart Generator offline)
    try {
        const apiKey = localStorage.getItem("mr_thai_gemini_api_key_v1") || "";
        let problemData = null;

        if (apiKey && apiKey.length > 15) {
            const prompt = `Bạn là chuyên gia lập trình nhúng C và Edge AI trên ESP32.
Hãy tạo 1 bài tập thực hành lập trình C độc nhất vô nhị về chủ đề: "${topic}", độ khó "${difficulty}".
Trả về duy nhất định dạng JSON chuẩn (không chứa markdown backticks, chỉ JSON):
{
  "title": "Tên bài tập ngắn gọn cuốn hút (bắt đầu bằng [AI] ...)",
  "desc": "Mô tả đề bài chi tiết (sử dụng <code> cho biến và hàm)",
  "realWorld": "Bối cảnh thực tế trên ESP32/Edge AI (ở đâu trong firmware)",
  "whyMatters": "Tại sao bắt buộc phải lập trình như vậy (tác dụng cụ thể)",
  "example": "Input: ... -> Output: ...",
  "hint": "Gợi ý thuật toán",
  "fnName": "tên_hàm_tiếng_anh_ngắn_gọn",
  "params": ["param1", "param2"],
  "initialCode": "khung hàm C cho người học điền",
  "solutionCode": "lời giải hàm C hoàn chỉnh",
  "testCases": [
    {"input": [giá_trị_1, giá_trị_2], "expected": kết_quả_1, "label": "test_1"},
    {"input": [giá_trị_3, giá_trị_4], "expected": kết_quả_2, "label": "test_2"},
    {"input": [giá_trị_5, giá_trị_6], "expected": kết_quả_3, "label": "test_3"}
  ]
}`;

            const aiModels = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
            for (const m of aiModels) {
                try {
                    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
                    const res = await fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        let txt = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                        txt = txt.replace(/```json/g, '').replace(/```/g, '').trim();
                        problemData = JSON.parse(txt);
                        break;
                    }
                } catch (e) {
                    console.warn(`AI model ${m} failed:`, e);
                }
            }
        }

        // Fallback generator offline nếu không có key hoặc lỗi mạng
        if (!problemData) {
            const cleanTopic = topic.replace(/[^a-zA-Z0-9_\s]/g, '');
            const fnName = "process_" + (cleanTopic.toLowerCase().split(/\s+/)[0] || "sensor");
            problemData = {
                title: `[AI Thực Chiến] Kỹ Thuật: ${topic}`,
                desc: `Xử lý luồng dữ liệu nhúng cho <strong>${topic}</strong>. Viết hàm <code>${fnName}</code> nhận vào 2 tham số <code>val</code> và <code>threshold</code>, trả về 1 nếu giá trị vượt ngưỡng an toàn và 0 nếu bình thường.`,
                realWorld: `Ứng dụng trực tiếp trong tầng kiểm soát cảm biến thông minh và xử lý tín hiệu ngoại vi ESP32 trước khi đưa vào mô hình TinyML.`,
                whyMatters: `Tối ưu hóa khả năng phản hồi thời gian thực, ngăn chặn dữ liệu bất thường phá vỡ luồng suy luận của mạng nơ-ron và tiết kiệm chu kỳ xung nhịp CPU.`,
                example: `Input: val = 120, threshold = 100 -> Output: 1\nInput: val = 80, threshold = 100 -> Output: 0`,
                hint: `Sử dụng toán tử so sánh: <code>return (val > threshold) ? 1 : 0;</code>`,
                fnName: fnName,
                params: ["val", "threshold"],
                initialCode: `int ${fnName}(int val, int threshold) {\n    // Code của bạn ở đây:\n    \n}`,
                solutionCode: `int ${fnName}(int val, int threshold) {\n    return (val > threshold) ? 1 : 0;\n}`,
                testCases: [
                    { input: [120, 100], expected: 1, label: "vượt ngưỡng -> 1" },
                    { input: [80, 100], expected: 0, label: "dưới ngưỡng -> 0" },
                    { input: [100, 100], expected: 0, label: "bằng ngưỡng -> 0" }
                ]
            };
        }

        problemData.id = "custom_ai_" + Date.now();
        problemData.stageIndex = stageIndex;
        problemData.topic = `M${stageIndex + 1}. AI Tự Thiết Kế`;
        problemData.difficulty = difficulty;
        problemData.xp = xp;
        problemData.isCustom = true;
        problemData.linkedSkill = "Pointers & Dynamic Memory Layout";

        generatedAiProblemTemp = problemData;

        // Hiển thị preview
        if (previewBox) {
            previewBox.style.display = "block";
            const titleEl = document.getElementById("ai-gen-title");
            const descEl = document.getElementById("ai-gen-desc");
            const diffEl = document.getElementById("ai-gen-diff");
            const rwEl = document.getElementById("ai-gen-realworld");
            const wmEl = document.getElementById("ai-gen-whymatters");

            if (titleEl) titleEl.innerText = problemData.title;
            if (descEl) descEl.innerHTML = problemData.desc;
            if (diffEl) diffEl.innerText = `${problemData.difficulty} (+${problemData.xp} XP)`;
            if (rwEl) rwEl.innerText = problemData.realWorld;
            if (wmEl) wmEl.innerText = problemData.whyMatters;
        }

        showToast("✨ AI đã thiết kế xong bài tập mới! Hãy xem bản xem trước bên dưới.");
    } catch (err) {
        console.error("AI Generate Problem Error:", err);
        showToast("⚠️ Có lỗi khi tạo bài tập. Hãy thử lại!");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "⚡ Bấm Để Gemini Tạo Bài Tập Ngay";
        }
    }
}

function confirmAddAIGeneratedProblem() {
    if (!generatedAiProblemTemp) return;
    saveCustomToStorage(generatedAiProblemTemp);
    practiceExercises.push(generatedAiProblemTemp);
    closeExternalProbModal();
    openPracticeProblem(practiceExercises.length - 1);
    showToast(`🎉 Đã thêm bài tập [${generatedAiProblemTemp.title}] vào danh sách luyện tập!`);
    generatedAiProblemTemp = null;
}

function saveCustomExercise() {
    const title = (document.getElementById("custom-prob-title")?.value || "").trim();
    const realWorld = (document.getElementById("custom-prob-realworld")?.value || "").trim();
    const desc = (document.getElementById("custom-prob-desc")?.value || "").trim();
    const fnName = (document.getElementById("custom-prob-fn")?.value || "").trim();
    const paramsStr = (document.getElementById("custom-prob-params")?.value || "").trim();
    const initialCode = (document.getElementById("custom-prob-initcode")?.value || "").trim();
    const solutionCode = (document.getElementById("custom-prob-solcode")?.value || "").trim();
    const testCasesStr = (document.getElementById("custom-prob-testcases")?.value || "").trim();

    if (!title || !desc || !fnName) {
        showToast("⚠️ Vui lòng nhập ít nhất: Tên bài tập, Mô tả và Tên hàm C!");
        return;
    }

    let parsedTestCases = [];
    try {
        if (testCasesStr) {
            parsedTestCases = JSON.parse(testCasesStr);
        }
    } catch (e) {
        showToast("⚠️ Định dạng JSON của Test Cases không hợp lệ!");
        return;
    }

    if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
        parsedTestCases = [{ input: [0], expected: 0, label: "test_default" }];
    }

    const customProb = {
        id: "custom_" + Date.now(),
        stageIndex: 0,
        title: title.startsWith("[Nguồn Ngoài]") ? title : `[Nguồn Ngoài] ${title}`,
        topic: "1. C & Bộ nhớ",
        difficulty: "Trung bình",
        xp: 100,
        desc: desc,
        realWorld: realWorld || "Bài toán kỹ thuật nguồn ngoài rèn luyện tư duy lập trình C nâng cao.",
        whyMatters: "Áp dụng thuật toán tối ưu hóa bộ nhớ và tốc độ thực thi cho các bài toán phỏng vấn và thực tế.",
        example: "Xem chi tiết test cases bên dưới",
        hint: "Đọc kỹ các ràng buộc kiểu dữ liệu nguyên và tràn số.",
        initialCode: initialCode || `int ${fnName}(int val) {\n    // Code của bạn\n}`,
        solutionCode: solutionCode || `int ${fnName}(int val) {\n    return val;\n}`,
        fnName: fnName,
        params: paramsStr ? paramsStr.split(',').map(s => s.trim()) : ["val"],
        testCases: parsedTestCases,
        isCustom: true,
        linkedSkill: "Pointers & Dynamic Memory Layout"
    };

    saveCustomToStorage(customProb);
    practiceExercises.push(customProb);
    closeExternalProbModal();
    openPracticeProblem(practiceExercises.length - 1);
    showToast(`✅ Đã lưu và mở bài tập: ${customProb.title}`);
}

function saveCustomToStorage(prob) {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_EXERCISES) || "[]");
        saved.push(prob);
        localStorage.setItem(STORAGE_CUSTOM_EXERCISES, JSON.stringify(saved));
    } catch (e) {
        console.warn("Lỗi lưu bài tập vào localStorage:", e);
    }
}

function askAiAboutCurrentProblem() {
    const prob = practiceExercises[currentProblemIndex];
    if (!prob) return;

    if (typeof switchTab === 'function') switchTab('notebook');
    const inputEl = document.getElementById("nb-chat-input");
    if (inputEl) {
        inputEl.value = `Tôi đang thực hành bài tập C: "${prob.title}" (${prob.topic}).\nĐề bài: ${prob.desc.replace(/<[^>]*>?/gm, '')}\nHãy phân tích chuyên sâu cho tôi:\n1. Ứng dụng thực tế của đoạn code này nằm ở đâu trong firmware ESP32/ESP-IDF thật?\n2. Tại sao lập trình viên nhúng phải viết như vậy thay vì cách thông thường?\n3. Các lỗi phần cứng, căn lề ô nhớ hoặc ngắt ISR nghiêm trọng thường gặp là gì?`;
        inputEl.focus();
    }
    showToast(`🤖 Đã chuyển câu hỏi về "${prob.title}" cho AI Sổ Tay!`);
}

// Expose ra window
window.practiceExercises = practiceExercises;
window.renderPracticeView = renderPracticeView;
window.selectProblem = selectProblem;
window.openPracticeProblem = openPracticeProblem;
window.setModuleFilter = setModuleFilter;
window.resetCurrentCode = resetCurrentCode;
window.loadSolutionCode = loadSolutionCode;
window.executeTests = executeTests;
window.saveExerciseToNotebook = saveExerciseToNotebook;
window.openExternalProbModal = openExternalProbModal;
window.closeExternalProbModal = closeExternalProbModal;
window.switchExtTab = switchExtTab;
window.renderPresetProbGrid = renderPresetProbGrid;
window.loadPresetInterviewProblem = loadPresetInterviewProblem;
window.generateExerciseWithAI = generateExerciseWithAI;
window.confirmAddAIGeneratedProblem = confirmAddAIGeneratedProblem;
window.saveCustomExercise = saveCustomExercise;
window.askAiAboutCurrentProblem = askAiAboutCurrentProblem;
window.openLinkedTheoryForCurrentProblem = openLinkedTheoryForCurrentProblem;
window.openRoadmapStageForCurrentProblem = openRoadmapStageForCurrentProblem;


window.openBookshelfForCurrentProblem = openBookshelfForCurrentProblem;
