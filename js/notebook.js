// ================================================= */
// SỔ TAY AI & TRỢ LÝ TÀI LIỆU (NOTEBOOKLM & GEMINI DOC AI)
// ================================================= */

const STORAGE_NOTEBOOK_DOCS = "mr_thai_notebook_docs_v1";
const STORAGE_GEMINI_KEY = "mr_thai_gemini_api_key_v1";
const STORAGE_NOTEBOOK_CHAT = "mr_thai_notebook_chat_history_v1";
const STORAGE_GEMINI_USAGE = "mr_thai_gemini_usage_v1";

// ==========================================
// INDEXEDDB STORAGE FOR LARGE NATIVE PDFS
// ==========================================
const IDB_NAME = "mr_thai_pdf_storage_v1";
const IDB_STORE = "pdf_files";

function openPdfDatabase() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(IDB_STORE)) {
                db.createObjectStore(IDB_STORE, { keyPath: "id" });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function savePdfToIndexedDB(id, fileName, base64Data, sizeBytes) {
    const db = await openPdfDatabase();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        const store = tx.objectStore(IDB_STORE);
        store.put({ id, fileName, base64: base64Data, size: sizeBytes, updatedAt: Date.now() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

async function getPdfFromIndexedDB(id) {
    try {
        const db = await openPdfDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(IDB_STORE, "readonly");
            const store = tx.objectStore(IDB_STORE);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.warn("Lỗi đọc PDF từ IndexedDB:", e);
        return null;
    }
}

async function deletePdfFromIndexedDB(id) {
    try {
        const db = await openPdfDatabase();
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).delete(id);
    } catch (e) {
        console.warn("Lỗi xóa PDF khỏi IndexedDB:", e);
    }
}

// Kho tài liệu mặc định (Được chuẩn bị từ các buổi nghiên cứu NotebookLM & Lộ Trình 6 Bước)
const defaultNotebookDocs = [
    {
        "id": "doc_c_pointers_deepdive",
        "title": "Giáo Trình Cốt Lõi: Làm Chủ Con Trỏ (Pointers) & Thao Tác Bộ Nhớ Cho Kỹ Sư Nhúng ESP32",
        "category": "Lộ Trình 1",
        "tags": [
            "#ConTrỏ",
            "#Pointers",
            "#C_Core",
            "#Memory",
            "#ESP32"
        ],
        "date": "26/09/2026",
        "words": 1650,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI CỦA CON TRỎ (POINTER) TRONG C\nĐối với người mới học lập trình C, khái niệm \"con trỏ\" thường gây cảm giác mơ hồ vì nó gắn liền với kiến trúc phần cứng bên dưới.\nĐể hiểu con trỏ, hãy hình dung **bộ nhớ RAM** của vi điều khiển ESP32 như một **khách sạn có hàng triệu ngăn tủ locker**:\n- Mỗi ngăn tủ có một **Số phòng duy nhất** gọi là **Địa chỉ bộ nhớ (Memory Address)**, viết dưới hệ thập lục phân Hexa (ví dụ: `0x3FFB0004`).\n- Bên trong ngăn tủ chứa **Dữ liệu thực tế (Value)**, ví dụ số nguyên `42`.\n\n👉 **Biến thông thường** (`int x = 42;`): Bạn đặt tên cho ngăn tủ đó là `x`. Giá trị lưu trong tủ là `42`.\n👉 **Biến con trỏ** (`int *ptr = &x;`): Là một tờ giấy ghi lại **Số phòng của x** (`0x3FFB0004`). Con trỏ **KHÔNG** chứa số 42, nó chỉ chứa **địa chỉ nơi số 42 đang ngụ cư**!\n\n---\n\n### 📌 2. HAI TOÁN TỬ NỀN TẢNG: TOÁN TỬ `&` VÀ TOÁN TỬ `*`\n- **Toán tử lấy địa chỉ `&` (Address-of):**\n  `&x` có nghĩa là: *\"Hãy cho tôi biết địa chỉ ô nhớ nơi biến x đang nằm trên RAM!\"*\n- **Toán tử giải tham chiếu `*` (Dereference):**\n  `*ptr` có nghĩa là: *\"Hãy đi đến địa chỉ ô nhớ mà ptr đang chỉ tới, mở ngăn tủ đó ra để ĐỌC hoặc GHI ĐÈ dữ liệu mới!\"*\n\n```c\nint a = 10;      // Ô nhớ của a (ví dụ 0x1000) chứa số 10\nint *p = &a;     // p lưu giá trị 0x1000 (địa chỉ của a)\n\nprintf(\"Địa chỉ của a: %p\\n\", p);   // In ra: 0x1000\nprintf(\"Giá trị trong a: %d\\n\", *p);  // Đọc tại 0x1000 -> In ra: 10\n\n*p = 99;         // Ghi đè số 99 vào ô nhớ 0x1000!\nprintf(\"Biến a sau ghi đè: %d\\n\", a); // a bây giờ đã biến thành 99!\n```\n\n---\n\n### 📌 3. CON TRỎ VÀ MẢNG: BẢN CHẤT SỐ HỌC CON TRỎ (POINTER ARITHMETIC)\nTrong C, **Tên mảng thực chất là một con trỏ hằng trỏ vào phần tử đầu tiên**:\n```c\nint arr[3] = {10, 20, 30};\n// arr tương đương với &arr[0]\n```\n- Khi bạn viết `arr[i]`, trình biên dịch thực chất dịch thành: `*(arr + i)`.\n- **Quy tắc số học con trỏ:**\n  Phép cộng con trỏ `ptr + 1` **KHÔNG PHẢI** là cộng thêm 1 byte! Nó tự động nhảy thêm **kích thước của kiểu dữ liệu** (`sizeof(type)`):\n  + Với `char *p`: `p + 1` nhảy 1 byte.\n  + Với `int *p` hoặc `float *p`: `p + 1` nhảy **4 bytes**.\n  + Với con trỏ Struct 16 byte: `p + 1` nhảy đúng **16 bytes**.\n\n---\n\n### 📌 4. CON TRỎ VÀ STRUCT: TOÁN TỬ MŨI TÊN `->` VÀ TRUYỀN ZERO-COPY\nKhi đóng gói dữ liệu cảm biến thành `struct`:\n```c\ntypedef struct __attribute__((packed)) {\n    uint32_t timestamp; // 4 bytes\n    int16_t accel_x;    // 2 bytes\n    int16_t accel_y;    // 2 bytes\n    int16_t accel_z;    // 2 bytes\n} IMU_Frame_t;\n```\n- **Toán tử mũi tên `->`:**\n  Nếu `frame` là con trỏ (`const IMU_Frame_t *frame`), thay vì viết cồng kềnh `(*frame).accel_x`, C cung cấp toán tử mũi tên ngắn gọn: `frame->accel_x`.\n- **Tại sao bắt buộc truyền con trỏ (Zero-Copy Pass-by-Reference)?**\n  Một khung âm thanh 16kHz có 32,000 bytes. Nếu truyền tham trị (`void process(AudioData data)`), CPU sẽ phải copy toàn bộ 32KB vào Stack -> **Tràn bộ nhớ Stack Overflow làm reset vi điều khiển ngay lập tức**!\n  Khi truyền con trỏ (`void process(const AudioData *data)`), CPU chỉ truyền duy nhất **1 địa chỉ 4 byte**! Độ trễ 0ms, không tốn thêm 1 byte RAM nào.\n\n---\n\n### 📌 5. CON TRỎ ĐA HÌNH `void*` VÀ CON TRỎ HÀM (FUNCTION POINTER)\n1. **Con trỏ `void*`:** Là con trỏ vạn năng, có thể chứa địa chỉ của bất kỳ kiểu dữ liệu nào. Dùng trong FreeRTOS khi tạo Task: `xTaskCreate(task_fn, \"task\", stack, (void*)&my_param, prio, NULL)`.\n2. **Con trỏ hàm (Function Pointer):** Cho phép truyền hàm như một tham số, là nền tảng để tạo cơ chế Callback khi có ngắt phần cứng (Timer Alarm Callback, Wi-Fi Event Callback).\n\n---\n\n### 📌 6. 4 CẠM BẪY CHÍ MẠNG KHI DÙNG CON TRỎ (VÀ CÁCH PHÒNG TRÁNH)\n1. **Con trỏ NULL (NULL Pointer Dereference):** Cố đọc `*p` khi `p == NULL` -> Kích hoạt Guru Meditation Crash Panic.\n   ✅ *Khắc phục*: Luôn kiểm tra `if (p == NULL) return ESP_ERR_INVALID_ARG;`.\n2. **Con trỏ treo (Dangling Pointer):** Trỏ vào biến cục bộ trong một hàm đã kết thúc, hoặc ô nhớ vừa bị `free()`.\n   ✅ *Khắc phục*: Sau khi gọi `free(ptr);`, luôn gán ngay `ptr = NULL;`.\n3. **Rò rỉ bộ nhớ (Memory Leak):** Cấp phát `malloc()` nhưng quên `free()`, làm cạn kiệt RAM sau một thời gian chạy.\n4. **Ngoại lệ căn lề (Unaligned Access Fault):** Ép con trỏ mảng byte lẻ sang con trỏ 32-bit khiến phần cứng CPU phát sinh ngắt ngoại lệ crash.\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📖 [ISO/IEC 9899:1999 (C99 Programming Language Standard)](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf) - Đặc tả chi tiết về quy tắc con trỏ, hoán vị kiểu dữ liệu và Strict Aliasing Rule.\n- 📖 [SEI CERT C Coding Standard - Memory Management Rules](https://wiki.sei.cmu.edu/confluence/display/c/MEM30-C.+Do+not+access+freed+memory) - Bộ quy tắc an toàn bảo mật khi thao tác con trỏ và bộ nhớ của Đại học Carnegie Mellon.\n- 📄 [Espressif ESP32-S3 Technical Reference Manual (PDF)](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Chương 2: System and Memory, Chương 3: Memory Protection (PMS).\n- 📚 Sách kinh điển: *\"Expert C Programming: Deep C Secrets\"* (Tác giả: Peter van der Linden, Nhà xuất bản Prentice Hall)."
    },
    {
        "id": "doc_stage1_memory",
        "title": "Lộ Trình Bước 1: Toàn Thư C Core, Con Trỏ (Pointers) & Bản Đồ Bộ Nhớ ESP32-S3",
        "category": "Lộ Trình 1",
        "tags": [
            "#LộTrình",
            "#Bước1",
            "#ESP32S3",
            "#Memory",
            "#Pointers",
            "#SRAM",
            "#PSRAM",
            "#SIMD"
        ],
        "date": "26/09/2026",
        "words": 2850,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: CON TRỎ TRONG C DƯỚI GÓC NHÌN PHẦN CỨNG\nTrong lập trình hệ thống nhúng, ngôn ngữ C không phải là một ngôn ngữ trừu tượng như Python hay JavaScript. Trong C, mỗi câu lệnh bạn viết đều phản ánh trực tiếp sự dịch chuyển của các electron và bóng bán dẫn trong các ô nhớ RAM của vi điều khiển ESP32-S3.\n\n#### A. Ẩn Dụ Khách Sạn Locker\nĐể hiểu bản chất vật lý của con trỏ:\n- Hãy hình dung **512 KB bộ nhớ SRAM nội** của ESP32-S3 như một dãy gồm đúng 524,288 ngăn tủ locker xếp thẳng hàng.\n- Mỗi ngăn tủ có kích thước đúng **1 Byte (8 bits)**.\n- Mỗi ngăn tủ có một **Số phòng duy nhất** được đánh dấu từ thấp đến cao dưới hệ thập lục phân Hexa (ví dụ: `0x3FFB0000`, `0x3FFB0001`, ...). Số phòng này chính là **Địa chỉ bộ nhớ (Memory Address)**.\n- Bên trong ngăn tủ chứa **Dữ liệu thực tế (Value)**, ví dụ số nguyên `42` (dưới dạng bit nhị phân `00101010`).\n\n👉 **Biến thông thường** (`int x = 42;`): Bạn đặt một nhãn tên thân thiện `x` cho 4 ngăn tủ liên tiếp. Giá trị nằm bên trong 4 ngăn tủ đó là `42`.\n👉 **Biến con trỏ** (`int *ptr = &x;`): Bản thân `ptr` cũng là một ngăn tủ, nhưng nó **KHÔNG** chứa số 42. Nó chứa **Số phòng của x** (`0x3FFB0004`). Con trỏ chỉ là một tờ giấy note ghi lại tọa độ ô nhớ nơi dữ liệu thật đang cư ngụ!\n\n#### B. Hai Toán Tử Vàng Bắt Buộc Phải Thành Thạo\n1. **Toán tử lấy địa chỉ `&` (Address-of):**\n   `&x` có nghĩa là: *\"Hãy cho tôi biết địa chỉ ô nhớ nơi biến x đang ngụ cư trên RAM!\"*\n2. **Toán tử giải tham chiếu `*` (Dereference):**\n   `*ptr` có nghĩa là: *\"Hãy đi đến địa chỉ ô nhớ mà ptr đang ghi, mở cánh cửa ngăn tủ đó ra để ĐỌC hoặc GHI ĐÈ dữ liệu mới!\"*\n\n```c\nint a = 10;      // Ô nhớ của a (ví dụ 0x3FFB1000) chứa số 10\nint *p = &a;     // p lưu giá trị 0x3FFB1000\n\nprintf(\"Địa chỉ của a: %p\\n\", p);   // In ra: 0x3FFB1000\nprintf(\"Giá trị trong a: %d\\n\", *p);  // Đọc tại 0x3FFB1000 -> In ra: 10\n\n*p = 99;         // Đi đến 0x3FFB1000 và thay thế số 10 bằng 99!\nprintf(\"Biến a sau ghi đè: %d\\n\", a); // a bây giờ đã biến thành 99!\n```\n\n---\n\n### 📌 2. SỐ HỌC CON TRỎ (POINTER ARITHMETIC) VÀ BẢN CHẤT CỦA MẢNG\nTrong C, **Tên của một mảng thực chất là một con trỏ hằng trỏ vào phần tử đầu tiên của mảng**:\n```c\nint arr[5] = {10, 20, 30, 40, 50};\n// arr tương đương với &arr[0]\n```\n- Khi bạn viết cú pháp truy xuất phần tử `arr[i]`, trình biên dịch GCC thực chất sẽ dịch ngầm thành:\n  ```c\n  *(arr + i)\n  ```\n- **Quy tắc số học con trỏ (Pointer Arithmetic):**\n  Phép cộng con trỏ `ptr + 1` **KHÔNG PHẢI** là cộng thêm 1 đơn vị byte vào địa chỉ! Trình biên dịch tự động nhân với kích thước kiểu dữ liệu (`sizeof(type)`):\n  + Nếu `char *p = 0x1000;` -> `p + 1` nhảy tới `0x1001` (cộng 1 byte).\n  + Nếu `int *p = 0x1000;` -> `p + 1` nhảy tới `0x1004` (cộng **4 bytes**).\n  + Nếu `float *p = 0x1000;` -> `p + 1` nhảy tới `0x1004` (cộng **4 bytes**).\n  + Nếu `IMU_Frame_t *p = 0x1000;` (struct 16 byte) -> `p + 1` nhảy tới `0x1010` (cộng đúng **16 bytes**).\n\n---\n\n### 📌 3. CON TRỎ STRUCT, TOÁN TỬ MŨI TÊN `->` VÀ TRUYỀN ZERO-COPY\nKhi thu thập dữ liệu cảm biến đa chiều (Gia tốc 3 trục, Vận tốc góc 3 trục, Nhiệt độ), ta đóng gói vào cấu trúc `struct`:\n```c\ntypedef struct __attribute__((packed)) {\n    uint32_t timestamp_ms; // 4 bytes\n    int16_t accel_x;       // 2 bytes\n    int16_t accel_y;       // 2 bytes\n    int16_t accel_z;       // 2 bytes\n} IMU_Packet_t;\n```\n\n#### A. Toán Tử Mũi Tên `->`\nNếu bạn có một con trỏ trỏ tới struct: `IMU_Packet_t *pkt = &my_data;`\nĐể truy cập trường `accel_x`, về mặt nguyên tắc bạn phải giải tham chiếu con trỏ trước rồi mới chấm trường:\n```c\n(*pkt).accel_x = 120;\n```\nDấu ngoặc tròn là bắt buộc vì toán tử `.` có độ ưu tiên cao hơn toán tử `*`. Để giải phóng lập trình viên khỏi cú pháp cồng kềnh này, C cung cấp toán tử mũi tên:\n```c\npkt->accel_x = 120; // Ngắn gọn, tường minh và chuẩn mực!\n```\n\n#### B. Tại Sao Zero-Copy Pass-By-Reference Là Sống Còn Trên ESP32?\nHãy xem xét hàm xử lý một khung âm thanh 16kHz kéo dài 1 giây (gồm 16,000 mẫu 16-bit = 32,000 bytes):\n- ❌ **Cách làm sai lầm (Pass-by-Value):**\n  ```c\n  void process_audio(AudioBuffer_t buf); // Truyền tham trị\n  ```\n  Khi hàm này được gọi, CPU buộc phải sao chép toàn bộ 32,000 bytes từ mảng gốc đè vào ngăn xếp Stack của hàm. Nhưng ngăn xếp mặc định của một Task FreeRTOS chỉ có 4,096 bytes -> **Ngăn xếp tràn tức thì (Stack Overflow), ghi đè phá hủy các biến lân cận và làm vi điều khiển reset sập nguồn ngay lập tức!**\n- ✅ **Cách làm chuẩn mực công nghiệp (Zero-Copy Pass-by-Reference):**\n  ```c\n  void process_audio(const AudioBuffer_t *buf); // Truyền con trỏ hằng\n  ```\n  CPU chỉ truyền duy nhất **1 địa chỉ 4 byte** trên ngăn xếp Stack. Dữ liệu âm thanh 32KB nằm yên tại chỗ trong RAM, hàm xử lý đọc trực tiếp tại ô nhớ gốc. Tốc độ truyền tham số: **0 nano-giây**, tiêu tốn Stack: **4 bytes**.\n\n---\n\n### 📌 4. BẢN ĐỒ BỘ NHỚ VẬT LÝ ESP32-S3 (PHYSICAL MEMORY MAPPING)\nESP32-S3 là vi xử lý 32-bit quản lý không gian địa chỉ ảo 4GB (từ `0x00000000` đến `0xFFFFFFFF`). Bộ nhớ vật lý được phân vùng thành các khối độc lập có đặc tính tốc độ và mục đích sử dụng hoàn toàn khác nhau:\n\n```\n+-----------------------+ 0x3FFB0000\n| Internal SRAM1 (384KB)| --> Vùng nhớ nhanh nhất (1 chu kỳ xung 240MHz).\n| (Tensor Arena & Heap) |     LÝ TƯỞNG TUYỆT ĐỐI CHO TINYML\n+-----------------------+ 0x3FF80000\n| Internal SRAM0 (64KB) | --> Dành riêng cho IRAM_ATTR (Hàm ngắt ISR)\n| (Instruction RAM)     |     và Instruction Cache của CPU\n+-----------------------+ 0x3FF40000\n| Internal SRAM2 (64KB) | --> Hỗ trợ phần cứng DMA (Direct Memory Access)\n| (DMA Buffers)         |     cho Wi-Fi, I2S Audio, SPI Camera\n+-----------------------+ 0x60000000\n| Hardware Registers    | --> Ánh xạ thanh ghi ngoại vi (Memory-Mapped I/O)\n| (GPIO, Timer, UART)   |     (Điều khiển trần không qua thư viện)\n+-----------------------+ 0x3C000000\n| External PSRAM (8MB)  | --> Bộ nhớ mở rộng gắn ngoài qua bus Octal SPI.\n| (Framebuffers, NVS)   |     Dung lượng lớn, nhưng chậm hơn SRAM 3-4 lần\n+-----------------------+ 0x00008000\n| RTC Fast RAM (8KB)    | --> VÙNG NHỚ DUY NHẤT CÒN ĐIỆN trong Deep Sleep!\n| (RTC_DATA_ATTR)       |     Dùng lưu biến cảm biến khi CPU chính ngủ\n+-----------------------+\n```\n\n---\n\n### 📌 5. YÊU CẦU CĂN LỀ 16-BYTE BẮT BUỘC CHO VECTOR SIMD AI (`alignas(16)`)\nESP32-S3 sở hữu tập lệnh mở rộng độc quyền **Xtensa Vector AI Instructions (SIMD - Single Instruction Multiple Data)**:\n- CPU có thể nạp một lúc **16 giá trị số nguyên INT8 (16 x 8-bit = 128-bit)** từ RAM vào thanh ghi Vector trong đúng 1 chu kỳ xung nhịp (~4.16ns) để thực hiện phép nhân ma trận trọng số.\n- ⚠️ **Quy tắc phần cứng khắt khe:** Để nạp được 128-bit trong 1 chu kỳ, địa chỉ bắt đầu của vùng nhớ Tensor Arena **bắt buộc phải chia hết cho 16** (16-byte aligned, tận cùng bằng 0x0 ở hệ Hexa).\n- Nếu bạn khai báo mảng thông thường:\n  ```c\n  static uint8_t tensor_arena[64 * 1024]; // NGUY HIỂM!\n  ```\n  Trình biên dịch có thể đặt mảng tại địa chỉ lẻ (ví dụ `0x3FFB0007`). Khi hàm `interpreter->Invoke()` chạy lệnh SIMD, CPU sẽ ngay lập tức phát sinh ngắt ngoại lệ phần cứng:\n  ```text\n  Guru Meditation Error: Core 1 panic'ed (LoadStoreAlignment). Exception was unhandled.\n  ```\n- ✅ **Cách khắc phục chuẩn mực:**\n  ```c\n  alignas(16) static uint8_t tensor_arena[64 * 1024];\n  ```\n\n---\n\n### 📌 6. PHÂN BIỆT STACK VS HEAP VÀ HIỂM HỌA PHÂN MẢNH BỘ NHỚ (HEAP FRAGMENTATION)\nTrong hệ thống nhúng hoạt động 24/7/365, quản lý bộ nhớ động là bài toán sống còn:\n\n| Đặc Điểm | Ngăn Xếp (Stack) | Vùng Nhớ Đống (Heap) |\n| :--- | :--- | :--- |\n| **Bản chất** | Vùng nhớ cấp phát tự động LIFO (Last-In-First-Out) cho biến cục bộ | Vùng nhớ cấp phát thủ công bằng `malloc()` / `free()` |\n| **Dung lượng** | Cố định theo từng Task FreeRTOS (thường 2KB - 8KB) | Chia sẻ từ vùng RAM tự do còn lại (~300KB) |\n| **Rủi ro lớn nhất**| **Stack Overflow**: Khai báo mảng cục bộ quá lớn làm sập chip | **Heap Fragmentation**: Phân mảnh bộ nhớ làm sập chip sau nhiều ngày |\n\n#### Hiểm Họa Phân Mảnh Heap (Heap Fragmentation) Là Gì?\nKhi firmware liên tục gọi `malloc()` rồi `free()` các khối bộ nhớ có kích thước khác nhau (ví dụ: nhận gói tin Wi-Fi JSON thay đổi độ dài), bộ nhớ Heap sẽ bị chia cắt thành hàng nghìn khoảng trống nhỏ nằm rải rác:\n- Sau 3 ngày chạy, hàm `heap_caps_get_free_size(MALLOC_CAP_INTERNAL)` báo tổng lượng RAM còn trống là **45,000 bytes**.\n- Nhưng khi bạn gọi `malloc(8192)` để nạp một khối âm thanh 8KB, hàm lập tức trả về **`NULL`**!\n- **Nguyên nhân:** Không có bất kỳ khoảng trống liên tục nào đủ 8KB; tất cả các khoảng trống đều bị băm nhỏ dưới 2KB do phân mảnh!\n- ✅ **Quy tắc vàng của kỹ sư nhúng chuyên nghiệp:** Tuyệt đối không gọi `malloc()` trong các vòng lặp xử lý chu kỳ. Luôn sử dụng **Static Allocation (Cấp phát tĩnh)** hoặc **Memory Pool** có kích thước khối cố định.\n\n---\n\n### 📌 7. 4 CẠM BẪY CON TRỎ KINH ĐIỂN VÀ CÁCH PHÒNG CHỐNG\n1. **NULL Pointer Dereference (Giải tham chiếu con trỏ rỗng):**\n   Cố đọc `*ptr` khi `ptr == NULL` làm CPU kích hoạt ngoại lệ `LoadProhibited` sập nguồn.\n   ✅ *Phòng chống:* Luôn kiểm tra tính hợp lệ trước khi sử dụng: `if (!ptr) return ESP_ERR_INVALID_ARG;`.\n2. **Dangling Pointer (Con trỏ treo lơ lửng):**\n   Sau khi gọi `free(ptr);`, con trỏ `ptr` vẫn lưu địa chỉ ô nhớ cũ. Nếu sau đó bạn gọi `*ptr = 10;`, bạn đang ghi đè vào ô nhớ đã được giao cho luồng khác sử dụng!\n   ✅ *Phòng chống:* Luôn gán `ptr = NULL;` ngay lập tức sau lệnh `free(ptr);`.\n3. **Double Free (Giải phóng 2 lần):**\n   Gọi `free(ptr);` hai lần trên cùng một địa chỉ làm hỏng cấu trúc danh sách liên kết quản lý Heap của hệ điều hành.\n4. **Memory Leak (Rò rỉ bộ nhớ):**\n   Cấp phát `malloc()` nhưng thoát khỏi hàm mà quên `free()`. Mỗi lần chạy mất đi một lượng RAM nhỏ, sau vài giờ thiết bị cạn kiệt RAM và sập nguồn.\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [Espressif ESP32-S3 Technical Reference Manual - Chapter 2: System and Memory](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Đặc tả chi tiết bản đồ địa chỉ SRAM0, SRAM1, SRAM2 và ngoại vi.\n- 🌐 [ESP-IDF Programming Guide (v5.1): Heap Memory Allocation API](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/mem_alloc.html) - Hướng dẫn sử dụng heap_caps_malloc với các cờ bộ nhớ MALLOC_CAP_INTERNAL và MALLOC_CAP_SPIRAM.\n- 🌐 [ESP-IDF Technical Guide: Minimizing RAM Footprint](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-guides/performance/ram-usage.html) - Kỹ thuật tối ưu hóa dung lượng RAM và chống phân mảnh heap trong firmware ESP32-S3.\n- 🐙 [GitHub: Espressif esp-idf Repository (Master)](https://github.com/espressif/esp-idf) - Kho mã nguồn mở chính thức của hệ điều hành nhúng ESP-IDF."
    },
    {
        "id": "doc_stage2_timer",
        "title": "Lộ Trình Bước 2: Timer Phần Cứng GPTimer & Hàm Ngắt Tốc Độ Cao (ISR)",
        "category": "Lộ Trình 2",
        "tags": [
            "#LộTrình",
            "#Bước2",
            "#GPTimer",
            "#ISR",
            "#IRAM_ATTR",
            "#DeferredProcessing"
        ],
        "date": "26/09/2026",
        "words": 2450,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO BẮT BUỘC PHẢI DÙNG TIMER PHẦN CỨNG?\nTrong các bài toán Edge AI thời gian thực (như nhận diện giọng nói từ khóa KWS tần số 16kHz, hoặc phát hiện hỏng hóc vòng bi động cơ tần số 100Hz):\n- Mọi mô hình Deep Learning và mọi công thức biến đổi phổ Fourier (FFT) đều hoạt động dựa trên giả định toán học nền tảng: **Khoảng cách thời gian $\\Delta t$ giữa 2 mẫu liên tiếp phải đều tuyệt đối (Deterministic Sampling)**.\n- ❌ **Sai lầm tai hại của người mới**: Sử dụng hàm `vTaskDelay()` của FreeRTOS trong vòng lặp để lấy mẫu:\n  ```c\n  while (1) {\n      sample_sensor();\n      vTaskDelay(pdMS_TO_TICKS(10)); // Cố gắng lấy mẫu ở 100Hz\n  }\n  ```\n  Hàm `vTaskDelay()` phụ thuộc vào nhịp Tick của hệ điều hành (mặc định 100Hz = 10ms mỗi tick). Khi có một tác vụ khác có mức ưu tiên cao hơn (như tác vụ Wi-Fi hoặc Bluetooth) chiếm quyền CPU, thời gian trễ thực tế sẽ dao động từ 10ms đến 14ms hoặc 18ms. Hiện tượng biến thiên thời gian này gọi là **Jitter**. Jitter làm méo dạng phổ tần số, khiến các đỉnh tần số trong FFT bị dịch chuyển và làm mô hình AI nhận diện sai lệch hoàn toàn!\n- ✅ **Giải pháp công nghiệp**: Sử dụng **Bộ định thời phần cứng chuyên dụng (Hardware GPTimer)** đếm xung clock độc lập với CPU, đảm bảo chu kỳ lấy mẫu chính xác đến từng micro-giây mà không bị bất kỳ tác vụ RTOS nào làm sai lệch!\n\n---\n\n### 📌 2. KIẾN TRÚC PHẦN CỨNG GPTIMER TRÊN ESP32-S3\nESP32-S3 được trang bị 4 bộ định thời đa năng độc lập 54-bit (General Purpose Timer - GPTimer) chia làm 2 nhóm (Timer Group 0 và Timer Group 1):\n\n```\n[Nguồn xung APB Clock 80 MHz]\n             |\n             v\n   [Bộ chia tần Prescaler = 80]\n             |\n             v\n[Tần số đếm: 1 MHz (1 tick = 1.0 micro-giây)]\n             |\n             v\n[Bộ đếm 54-bit Counter: Đếm từ 0 tăng dần]\n             |\n             v\n[So sánh với thanh ghi Alarm Count (ví dụ 62 us)]\n             |\n    +--------+--------+\n    | Khớp giá trị    |\n    v                 v\n[Tự động nạp lại 0]  [Kích hoạt Ngắt phần cứng ISR]\n(Hardware Auto-Reload)   (IRAM_ATTR Interrupt)\n```\n\n- **Độ phân giải 1 micro-giây:** Với nguồn xung APB 80MHz và Prescaler = 80, bộ đếm tăng 1 đơn vị sau đúng $1 / (80 \\times 10^6 / 80) = 1.0 \\mu s$.\n- **Lấy mẫu âm thanh 16kHz chuẩn xác:** Chu kỳ cần đạt là $T = 1 / 16000 = 62.5 \\mu s$. Cài đặt Alarm Count = 62 hoặc xen kẽ 62-63 micro-giây sẽ cho ra tần số lấy mẫu chuẩn xác với độ lệch pha gần như bằng 0.\n\n---\n\n### 📌 3. CỜ IRAM_ATTR: VÌ SAO BẮT BUỘC CHO HÀM NGẮT ISR?\nKhi viết hàm phục vụ ngắt (ISR) trên ESP-IDF, bạn luôn thấy từ khóa `IRAM_ATTR` đứng trước tên hàm:\n```c\nstatic bool IRAM_ATTR timer_on_alarm_cb(gptimer_handle_t timer, ...)\n```\n\n#### Bản Chất Cơ Chế Phần Cứng:\n1. Mã nguồn C thông thường khi biên dịch sẽ được nạp vào bộ nhớ **External Flash ROM** ngoài chip. Khi CPU chạy mã này, nó phải nạp qua bộ đệm **Flash Cache Controller** (nằm trong SRAM0).\n2. Khi vi điều khiển thực hiện thao tác ghi dữ liệu vào Flash (ví dụ: lưu cấu hình vào phân vùng NVS, hoặc tải bản nâng cấp firmware OTA), **bộ điều khiển Flash Cache Controller bắt buộc phải bị tạm khóa (Disable Cache)** để tránh xung đột dữ liệu trên đường bus SPI.\n3. Nếu đúng vào thời điểm Flash Cache đang bị khóa mà có một ngắt phần cứng xảy ra, và hàm ISR lại nằm trên Flash ROM:\n   CPU cố đọc lệnh máy từ Flash nhưng Cache đang tắt -> Phần cứng CPU lập tức phát sinh lỗi sập nguồn thảm khốc:\n   ```text\n   Guru Meditation Error: Core 0 panic'ed (Cache disabled but cached memory region accessed)\n   ```\n4. ✅ **Giải pháp từ khóa `IRAM_ATTR`:**\n   Từ khóa này báo cho trình liên kết Linker ép đặt toàn bộ mã máy của hàm ngắt vào **Internal SRAM0 (Instruction RAM)**. Vì nằm trọn vẹn trong RAM nội bộ tốc độ cao, CPU có thể nhảy vào thực thi hàm ISR tức thì chỉ trong vài nano-giây, an toàn tuyệt đối 100% ngay cả khi Flash đang bận ghi dữ liệu!\n\n---\n\n### 📌 4. MÔ HÌNH DEFERRED PROCESSING (HOÃN XỬ LÝ)\nTrong lập trình hệ thống nhúng, hàm ngắt (ISR) có quyền ưu tiên cao nhất, nó chặn đứng mọi tác vụ khác của hệ điều hành kể cả bộ lập lịch Scheduler.\n- ❌ **Sai lầm chết người:** Thực hiện tính toán nặng (như tính FFT, nhân ma trận AI, hoặc gọi `printf`) bên trong hàm ISR. Điều này làm CPU bị giam cầm trong ISR quá lâu (>10 micro-giây), làm tê liệt toàn bộ hệ thống, bỏ lỡ các ngắt Wi-Fi khẩn cấp và kích hoạt ngắt bảo vệ **Interrupt Watchdog Timer Reset**!\n- ✅ **Mô hình Deferred Processing chuẩn công nghiệp:**\n  1. **Trong ISR (Thời gian < 3 micro-giây):** Chỉ đọc nhanh giá trị từ thanh ghi phần cứng lưu vào một bộ đệm nhỏ, sau đó gửi tín hiệu thông báo đánh thức tác vụ AI bên ngoài thông qua hàm `vTaskNotifyGiveFromISR()` hoặc `xSemaphoreGiveFromISR()`.\n  2. **Trong Task RTOS bên ngoài:** Tác vụ AI thức dậy, lấy dữ liệu ra tính toán FFT và chạy suy luận mô hình một cách thảnh thơi mà không làm ảnh hưởng đến các ngắt phần cứng khác.\n\n---\n\n### 📌 5. MÃ NGUỒN C MẪU ĐẠT CHUẨN SẢN XUẤT (ESP-IDF V5.X)\n```c\n#include <stdio.h>\n#include \"freertos/FreeRTOS.h\"\n#include \"freertos/task.h\"\n#include \"driver/gptimer.h\"\n#include \"esp_log.h\"\n\nstatic const char *TAG = \"TIMER_CORE\";\nstatic TaskHandle_t s_ai_task_handle = NULL;\n\n// 1. Hàm ngắt Timer ISR siêu tốc đặt trong SRAM nội\nstatic bool IRAM_ATTR timer_sample_callback(gptimer_handle_t timer, \n                                            const gptimer_alarm_event_data_t *edata, \n                                            void *user_ctx) {\n    BaseType_t high_task_awoken = pdFALSE;\n\n    // Đánh thức tác vụ xử lý tín hiệu AI bên ngoài (Deferred Processing)\n    vTaskNotifyGiveFromISR(s_ai_task_handle, &high_task_awoken);\n\n    // Trả về true nếu cần chuyển đổi ngữ cảnh (Context Switch) tức thì\n    return (high_task_awoken == pdTRUE);\n}\n\n// 2. Tác vụ AI bên ngoài tiếp nhận tín hiệu từ ngắt\nvoid ai_processing_task(void *pvParameters) {\n    while (1) {\n        // Đưa Task vào trạng thái Blocked (0% CPU) chờ ngắt đánh thức\n        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);\n\n        // Thực hiện tính toán trích xuất đặc trưng tại đây\n        // (Thời gian chạy có thể tốn vài mili-giây mà hoàn toàn an toàn)\n    }\n}\n\n// 3. Khởi tạo GPTimer 1 micro-giây chuẩn ESP-IDF v5.x\nvoid init_hardware_sampling_timer(void) {\n    gptimer_handle_t gptimer = NULL;\n    gptimer_config_t timer_config = {\n        .clk_src = GPTIMER_CLK_SRC_DEFAULT,\n        .direction = GPTIMER_COUNT_UP,\n        .resolution_hz = 1000000, // 1 MHz = 1us mỗi tick\n    };\n    ESP_ERROR_CHECK(gptimer_new_timer(&timer_config, &gptimer));\n\n    gptimer_alarm_config_t alarm_config = {\n        .reload_count = 0,\n        .alarm_count = 62, // 62.5 us tương ứng tần số lấy mẫu 16,000 Hz\n        .flags.auto_reload_on_alarm = true, // Tự động nạp lại phần cứng\n    };\n    gptimer_event_callbacks_t cbs = {\n        .on_alarm = timer_sample_callback,\n    };\n    ESP_ERROR_CHECK(gptimer_register_event_callbacks(gptimer, &cbs, NULL));\n    ESP_ERROR_CHECK(gptimer_set_alarm_action(gptimer, &alarm_config));\n    ESP_ERROR_CHECK(gptimer_enable(gptimer));\n    ESP_ERROR_CHECK(gptimer_start(gptimer));\n    ESP_LOGI(TAG, \"GPTimer 16kHz lấy mẫu chu kỳ đã khởi chạy thành công!\");\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [ESP-IDF Programming Guide: General Purpose Timer (GPTimer) API](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/peripherals/gptimer.html) - Hướng dẫn lập trình driver GPTimer thế hệ mới trên ESP-IDF v5.x.\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 11: Timer Group (TIMG)](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Cấu trúc thanh ghi đếm 54-bit, bộ chia tần Prescaler và cơ chế Auto-Reload phần cứng.\n- 🌐 [ESP-IDF Guide: Interrupt Allocation & IRAM-Safe ISR](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/intr_alloc.html) - Cơ chế cấp phát ngắt, mức ưu tiên ngắt và cờ ESP_INTR_FLAG_IRAM chống sập vi điều khiển.\n- 🐙 [GitHub: ESP-IDF GPTimer Code Examples](https://github.com/espressif/esp-idf/tree/master/examples/peripherals/timer_group/gptimer) - Mã nguồn dự án mẫu cấu hình định thời chu kỳ và đo độ rộng xung."
    },
    {
        "id": "doc_stage3_sensors",
        "title": "Lộ Trình Bước 3: Thu Thập Cảm Biến I2C/I2S DMA & Biến Đổi Phổ Tần Số FFT",
        "category": "Lộ Trình 3",
        "tags": [
            "#LộTrình",
            "#Bước3",
            "#I2S",
            "#DMA",
            "#FFT",
            "#Sensors",
            "#ESP_DSP"
        ],
        "date": "26/09/2026",
        "words": 2600,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO MÔ HÌNH AI CẦN PHỔ TẦN SỐ THAY VÌ SỐ THÔ?\nTrong các bài toán thực tế của kỹ sư Edge AI:\n- Một micro thu âm cho ra một chuỗi các giá trị áp suất không khí biến thiên theo thời gian $x[n]$.\n- Một cảm biến gia tốc kế (IMU) gắn trên thân vỏ động cơ công nghiệp cho ra 3 trục dao động cơ học $X, Y, Z$.\n\nNếu bạn đẩy trực tiếp 512 mẫu số thô theo thời gian này vào mạng nơ-ron:\n- Mô hình sẽ cực kỳ khó học vì tín hiệu trong miền thời gian bị phụ thuộc chặt chẽ vào **pha dao động (Phase)**, âm lượng to nhỏ và các xung nhiễu ngẫu nhiên.\n- ✅ **Bí quyết công nghệ công nghiệp**: Chuyển đổi tín hiệu từ **Miền Thời Gian (Time Domain)** sang **Miền Tần Số (Frequency Domain)** thông qua thuật toán **Biến Đổi Fourier Nhanh (Fast Fourier Transform - FFT)**.\n- Phổ tần số (Power Spectrum) cho ta biết chính xác: *\"Tại thời điểm này, động cơ đang rung động mạnh nhất ở dải tần số nào (50Hz tần số lưới điện, 120Hz lệch trục, hay 1500Hz mòn vòng bi)?\"*. Phổ tần số chính là bức **vân tay âm thanh độc nhất** giúp mạng nơ-ron Deep Learning phân loại chính xác trên 98% chỉ với vài lớp mạng nhỏ gọn!\n\n---\n\n### 📌 2. KỸ THUẬT BURST READ TRÊN BUS I2C CHO CẢM BIẾN IMU 6 TRỤC\nCảm biến chuyển động IMU (MPU6050, LSM6DS3) cung cấp dữ liệu 6 trục: 3 trục Gia tốc ($A_x, A_y, A_z$) và 3 trục Vận tốc góc ($G_x, G_y, G_z$). Mỗi trục là một số nguyên 16-bit gồm 2 bytes: High Byte và Low Byte (tổng cộng 12 bytes + 2 bytes nhiệt độ = **14 bytes liên tục**).\n\n#### So Sánh Hiệu Năng:\n- ❌ **Cách làm nghiệp dư (Single-byte Reads):**\n  Phát 6 lệnh đọc I2C riêng lẻ cho từng trục. Trên bus I2C chạy ở 400kHz, mỗi lệnh đọc riêng lẻ tốn các bit Start, Slave Address, Register Pointer, ACK, Stop -> Tốn thời gian gấp 6 lần, làm nghẽn đường bus I2C và tiêu hao năng lượng vô ích.\n- ✅ **Cách làm chuyên nghiệp (I2C Burst Read):**\n  Phát duy nhất một lệnh đọc bắt đầu từ thanh ghi `ACCEL_XOUT_H` (địa chỉ `0x3B`) và yêu cầu nhận một mạch **14 bytes liên tục**. Bộ đếm địa chỉ nội bộ của cảm biến tự động tăng sau mỗi byte được nhận. Sau đó, dùng phép dịch bit gộp từng cặp byte thành số nguyên có dấu 16-bit:\n  ```c\n  int16_t accel_x = (int16_t)((rx_buf[0] << 8) | rx_buf[1]);\n  int16_t accel_y = (int16_t)((rx_buf[2] << 8) | rx_buf[3]);\n  int16_t accel_z = (int16_t)((rx_buf[4] << 8) | rx_buf[5]);\n  ```\n\n---\n\n### 📌 3. THU ÂM BĂNG THÔNG CAO VỚI I2S DMA & BỘ ĐỆM PING-PONG\nKhi thu âm thanh 16kHz 16-bit đơn kênh (Mono):\n- Mỗi giây luồng dữ liệu sinh ra: $16000 \\times 2 \\text{ bytes} = 32,000 \\text{ bytes}$.\n- Nếu dùng ngắt đọc từng byte một, CPU sẽ bị ngắt 16,000 lần mỗi giây -> 100% thời gian CPU bị thiêu rụi chỉ để phục vụ ngắt, hoàn toàn không còn tài nguyên để chạy mô hình AI!\n- ✅ **Giải pháp Direct Memory Access (DMA):**\n  ESP32-S3 tích hợp bộ điều khiển phần cứng DMA chuyên dụng cho ngoại vi I2S. Bộ điều khiển DMA tự động hút từng byte âm thanh từ chân phần cứng đổ thẳng vào RAM mà **hoàn toàn không cần CPU can thiệp**!\n\n#### Cơ Chế Đệm Đôi Ping-Pong (Double Buffering):\n```\n[Microphone I2S] --> (Chân phần cứng)\n                           |\n                           v [DMA Controller tự động ghi vào RAM]\n               +-----------------------+-----------------------+\n               |   DMA Buffer A (1KB)  |   DMA Buffer B (1KB)  |\n               +-----------------------+-----------------------+\n                          ^                       ^\n                          |                       |\n               [DMA đang ghi vào A]      [CPU đang đọc từ B để tính FFT]\n               \n               Khi Buffer A đầy: DMA chuyển sang ghi B, phát tín hiệu cho CPU sang đọc A!\n```\nNhờ cơ chế Ping-Pong Buffer, luồng dữ liệu âm thanh luôn liên tục 100%, không bao giờ bị rơi rớt mẫu (Data Drop) hay méo dạng sóng.\n\n---\n\n### 📌 4. BỘ LỌC TÍN HIỆU SỐ & CỬA SỔ HANNING (HANNING WINDOW)\nTrước khi đưa tín hiệu thô vào thuật toán FFT, bắt buộc phải trải qua 2 khâu tiền xử lý sống còn:\n\n#### A. Bộ Lọc Thông Thấp Số (Exponential Moving Average - EMA)\nLoại bỏ các gai nhiễu điện áp tần số cao sinh ra từ nguồn điện:\n$y[n] = \\alpha \\cdot x[n] + (1 - \\alpha) \\cdot y[n-1]$\nVới hệ số lọc $\\alpha \\in [0.1, 0.3]$. Công thức này cực kỳ nhẹ, chỉ tốn 2 phép nhân và 1 phép cộng cho mỗi mẫu.\n\n#### B. Cửa Sổ Hanning (Hanning Window) Triệt Tiêu Rò Rỉ Phổ\nKhi bạn cắt một đoạn tín hiệu 512 mẫu từ dòng âm thanh vô tận, hai đầu mép cắt bị đứt đột ngột tạo thành một bước nhảy điện áp giả tạo. Bước nhảy này sinh ra các tần số rác lân cận trong kết quả FFT gọi là **Hiện tượng rò rỉ phổ (Spectral Leakage)**.\n- **Công thức hàm Hanning:**\n  $w[n] = 0.5 - 0.5 \\cdot \\cos\\left(\\frac{2\\pi n}{N - 1}\\right), \\quad n = 0, 1, \\dots, N-1$\n- Nhân đoạn tín hiệu 512 mẫu với hàm Hanning giúp ép hai đầu mép cắt mượt mà về 0, bảo toàn độ sắc nét tuyệt đối của các đỉnh tần số thực tế!\n\n---\n\n### 📌 5. BIẾN ĐỔI FOURIER NHANH FFT VỚI THƯ VIỆN ESP-DSP TĂNG TỐC SIMD\nThư viện **ESP-DSP** của Espressif được viết tối ưu riêng bằng mã máy Assembly tận dụng tập lệnh mở rộng Vector SIMD của ESP32-S3:\n- Thuật toán FFT 512 điểm số thực phức nếu viết bằng C thông thường tốn khoảng 8.5 mili-giây.\n- Khi gọi hàm thư viện tối ưu phần cứng `dsps_fft2r_fc32()`: **Chỉ tốn đúng 0.72 mili-giây** (nhanh hơn gấp 11 lần!), giải phóng trọn vẹn CPU cho mô hình AI suy luận.\n\n---\n\n### 📌 6. MÃ NGUỒN C MẪU ĐẠT CHUẨN SẢN XUẤT\n```c\n#include <stdio.h>\n#include <math.h>\n#include \"esp_dsp.h\"\n#include \"esp_log.h\"\n\n#define FFT_POINTS 512\nstatic float s_fft_buffer[FFT_POINTS * 2]; // Mảng số phức (Real, Imag xen kẽ)\nstatic float s_window[FFT_POINTS];\nstatic float s_power_spectrum[FFT_POINTS / 2];\n\nvoid init_dsp_pipeline(void) {\n    // 1. Khởi tạo bảng tra cứu FFT và bảng cửa sổ Hanning\n    esp_err_t ret = dsps_fft2r_init_fc32(NULL, CONFIG_DSP_MAX_FFT_SIZE);\n    if (ret != ESP_OK) {\n        ESP_LOGE(\"DSP\", \"Lỗi khởi tạo bảng FFT!\");\n        return;\n    }\n    dsps_wind_hann_f32(s_window, FFT_POINTS);\n}\n\nvoid process_audio_frame(const int16_t *pcm_samples) {\n    // 2. Chuẩn hóa int16 sang float [-1.0, 1.0] và nhân cửa sổ Hanning\n    for (int i = 0; i < FFT_POINTS; i++) {\n        float normalized = (float)pcm_samples[i] / 32768.0f;\n        s_fft_buffer[i * 2 + 0] = normalized * s_window[i]; // Phần thực\n        s_fft_buffer[i * 2 + 1] = 0.0f;                     // Phần ảo = 0\n    }\n\n    // 3. Thực thi FFT Radix-2 SIMD siêu tốc (~0.72ms)\n    dsps_fft2r_fc32(s_fft_buffer, FFT_POINTS);\n    dsps_bit_rev2r_fc32(s_fft_buffer, FFT_POINTS);\n\n    // 4. Tính mật độ phổ năng lượng (Power Spectrum) cho từng bin tần số\n    for (int i = 0; i < FFT_POINTS / 2; i++) {\n        float real = s_fft_buffer[i * 2 + 0];\n        float imag = s_fft_buffer[i * 2 + 1];\n        s_power_spectrum[i] = sqrtf(real * real + imag * imag);\n    }\n    // Mảng s_power_spectrum gồm 256 giá trị năng lượng sẵn sàng nạp vào Tensor AI!\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🐙 [GitHub: Espressif Digital Signal Processing Library (esp-dsp)](https://github.com/espressif/esp-dsp) - Thư viện DSP tối ưu hóa bằng Assembly tập lệnh Xtensa SIMD (Radix-2 FFT, IIR Biquad filter).\n- 🌐 [Official Documentation: ESP-DSP User Guide & API Reference](https://docs.espressif.com/projects/esp-dsp/en/latest/) - Hướng dẫn chi tiết thuật toán FFT phức 32-bit (dsps_fft2r_fc32) và các hàm cửa sổ Hann/Blackman.\n- 🌐 [ESP-IDF Guide: Inter-IC Sound (I2S) Peripheral Driver](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/peripherals/i2s.html) - Lập trình thu âm thanh với Micro I2S (INMP441) kết hợp kênh truyền DMA tự động.\n- 📚 Sách chuẩn quốc tế: *\"Discrete-Time Signal Processing\"* (Alan V. Oppenheim & Ronald W. Schafer, Nhà xuất bản Pearson, 3rd Edition)."
    },
    {
        "id": "doc_stage4_freertos",
        "title": "Lộ Trình Bước 4: Đa Nhiệm FreeRTOS Dual-Core, Hàng Đợi Queue & Chống Deadlock",
        "category": "Lộ Trình 4",
        "tags": [
            "#LộTrình",
            "#Bước4",
            "#FreeRTOS",
            "#DualCore",
            "#Queue",
            "#Mutex",
            "#Watchdog"
        ],
        "date": "26/09/2026",
        "words": 2700,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: KIẾN TRÚC ĐA NHÂN BẤT ĐỐI XỨNG (ASYMMETRIC MULTIPROCESSING)\nESP32-S3 sở hữu 2 lõi vi xử lý vật lý Xtensa LX7 hoạt động song song độc lập ở tần số xung nhịp tối đa 240 MHz:\n- **Core 0 (PRO_CPU - Protocol CPU):** Được hệ điều hành ESP-IDF mặc định sử dụng để quản lý ngăn xếp giao thức vô tuyến Wi-Fi 802.11, Bluetooth LE 5.0, bộ điều khiển bộ nhớ Flash Cache Controller và các ngắt ngoại vi phần cứng cấp thấp.\n- **Core 1 (APP_CPU - Application CPU):** Hoàn toàn tự do dành cho mã nguồn ứng dụng của kỹ sư.\n\n⚠️ **Sai lầm chết người của người mới:** Gọi hàm `xTaskCreate()` mà không chỉ định lõi thực thi. Hệ điều hành FreeRTOS sẽ tự ý luân chuyển tác vụ giữa 2 nhân, dẫn đến tình trạng tác vụ suy luận TinyML nặng nề tranh chấp tài nguyên với tác vụ Wi-Fi trên Core 0, gây rớt mạng Wi-Fi và giật lag chu kỳ lấy mẫu cảm biến!\n✅ **Quy tắc vàng:** Luôn sử dụng hàm `xTaskCreatePinnedToCore()` để phân chia ranh giới rõ ràng:\n- **Core 0:** Đảm nhiệm tác vụ thu thập cảm biến và truyền thông mạng.\n- **Core 1:** Dành trọn vẹn 100% sức mạnh tính toán cho mô hình AI suy luận.\n\n---\n\n### 📌 2. HÀNG ĐỢI FREE_RTOS QUEUE VÀ KỸ THUẬT TRUYỀN CON TRỎ (ZERO-COPY QUEUE)\nHàng đợi (Queue) là cơ chế giao tiếp liên tác vụ (Inter-Task Communication - IPC) chuẩn mực và an toàn nhất trong hệ điều hành thời gian thực FreeRTOS.\n- Bản chất hàng đợi là một cấu trúc dữ liệu FIFO (First-In, First-Out) được bảo vệ bởi bộ khóa ngắt nội bộ (Thread-Safe).\n\n#### Kỹ Thuật Truyền Con Trỏ Zero-Copy Tránh Tràn RAM:\nGiả sử mỗi khung dữ liệu đặc trưng FFT có kích thước 1,024 số thực (tương đương 4,096 bytes):\n- ❌ **Cách làm sai:** Tạo hàng đợi chứa cả mảng dữ liệu:\n  ```c\n  QueueHandle_t q = xQueueCreate(5, 4096); // Tốn 20,480 bytes RAM Heap!\n  ```\n  Mỗi lần gọi `xQueueSend()`, FreeRTOS phải sao chép toàn bộ 4KB bộ nhớ từ Task gửi sang Queue, rồi lại sao chép tiếp từ Queue sang Task nhận. Việc này lãng phí hàng chục nghìn chu kỳ CPU và ngốn sạch bộ nhớ Heap.\n- ✅ **Cách làm chuẩn mực (Pointer Queue):** Tạo hàng đợi chỉ chứa **Địa chỉ con trỏ**:\n  ```c\n  QueueHandle_t q = xQueueCreate(5, sizeof(float *)); // Chỉ tốn 20 bytes RAM!\n  ```\n  Task gửi chỉ cần gửi địa chỉ của vùng nhớ đệm (`&buf`). Task nhận lấy địa chỉ ra và đọc trực tiếp. Tốc độ chuyển giao dữ liệu: **tức thời trong 1 chu kỳ máy**!\n\n---\n\n### 📌 3. ĐỒNG BỘ HÓA TÀI NGUYÊN: MUTEX VS BINARY SEMAPHORE\nKhi hai tác vụ cùng muốn sử dụng chung một bus I2C hoặc cùng muốn ghi vào một file trên thẻ nhớ SD, việc tranh chấp tài nguyên sẽ làm hỏng dữ liệu.\n\n| Tiêu Chí | Binary Semaphore | Mutex (Mutual Exclusion) |\n| :--- | :--- | :--- |\n| **Bản chất** | Tín hiệu thông báo sự kiện (Signaling) | Khóa bảo vệ tài nguyên độc quyền (Ownership) |\n| **Quyền sở hữu** | Task A có thể Give để đánh thức Task B Take | Chỉ Task nào đã Take thành công mới có quyền Give để mở khóa |\n| **Cơ chế chống nghẽn**| Không có cơ chế Priority Inheritance | **Có cơ chế Priority Inheritance** chống hiện tượng đảo ngược mức ưu tiên |\n\n#### Hiện Tượng Đảo Ngược Mức Ưu Tiên (Priority Inversion) Là Gì?\n1. Tác vụ mức ưu tiên thấp (Task Low) chiếm giữ khóa I2C.\n2. Tác vụ mức ưu tiên cao (Task High) muốn đọc I2C nên bị chặn (Blocked) chờ Task Low nhả khóa.\n3. Đúng lúc này, một tác vụ mức ưu tiên trung bình (Task Medium) xuất hiện và chiếm quyền CPU từ Task Low (vì Priority của Medium > Low).\n4. **Hậu quả:** Task Low không thể chạy để nhả khóa, khiến Task High (tác vụ quan trọng nhất của hệ thống) bị gián tiếp giam cầm bởi Task Medium!\n- ✅ **Giải pháp của Mutex:** Khi Task High bị chặn bởi khóa do Task Low giữ, FreeRTOS tự động **nâng tạm thời mức ưu tiên của Task Low lên bằng Task High (Priority Inheritance)**, giúp Task Low chạy nhanh nhất có thể để nhả khóa, giải phóng Task High ngay lập tức!\n\n---\n\n### 📌 4. CHỐNG DEADLOCK & THIẾT LẬP TASK WATCHDOG TIMER (TWDT)\n1. **Quy tắc vàng chống Deadlock (Khóa Chết):** Nếu hệ thống cần sử dụng nhiều Mutex (ví dụ Mutex A và Mutex B), tất cả các tác vụ bắt buộc phải tuân thủ nghiêm ngặt **thứ tự chiếm khóa giống nhau**: Luôn xin Mutex A trước, sau đó mới xin Mutex B. Tuyệt đối không bao giờ để Task 1 xin A rồi B, còn Task 2 xin B rồi A.\n2. **Task Watchdog Timer (TWDT):**\n   Trong hệ thống nhúng hoạt động 24/7, nếu một tác vụ bị kẹt trong vòng lặp vô hạn (do Deadlock hoặc chờ phản hồi từ cảm biến hỏng), Watchdog Timer sẽ đếm tràn và tự động khởi động lại vi điều khiển.\n   ```c\n   esp_task_wdt_add(NULL); // Đăng ký Task hiện tại vào TWDT\n   while (1) {\n       esp_task_wdt_reset(); // Xóa cờ Watchdog định kỳ\n       do_work();\n   }\n   ```\n\n---\n\n### 📌 5. THEO DÕI STACK WATERMARK TỐI ƯU HÓA RAM\nĐể biết chính xác một Task có bị nguy cơ tràn Stack hay không, hoặc Task đó có đang được cấp thừa thãi RAM hay không:\n```c\nUBaseType_t remaining_stack = uxTaskGetStackHighWaterMark(NULL);\nprintf(\"Số byte Stack còn dư thấp nhất: %u bytes\\n\", remaining_stack * sizeof(StackType_t));\n```\nNếu con số này quá nhỏ (<200 bytes), Task đang đứng trước bờ vực Crash sập nguồn. Nếu con số này quá lớn (>2000 bytes), bạn có thể giảm bớt kích thước Stack khai báo ban đầu để tiết kiệm RAM cho Tensor Arena!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [Official FreeRTOS Guide: Symmetric Multiprocessing (SMP)](https://www.freertos.org/symmetric-multiprocessing-introduction.html) - Hướng dẫn kiến trúc lập lịch đa nhân đối xứng của FreeRTOS Kernel.\n- 🌐 [ESP-IDF FreeRTOS (SMP) Customizations Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/freertos.html) - Các điểm khác biệt và hàm mở rộng của FreeRTOS trên ESP32 Dual-Core (hàm xTaskCreatePinnedToCore, Spinlocks).\n- 📚 Sách kinh điển: *\"Mastering the FreeRTOS Real Time Kernel - A Hands-On Tutorial Guide\"* (Tác giả: Richard Barry, Người sáng lập FreeRTOS).\n- 📄 [Whitepaper: Priority Inversion and Priority Inheritance](https://www.freertos.org/Real-time-embedded-RTOS-mutexes.html) - Phân tích cơ chế thừa kế quyền ưu tiên chống nghẽn tác vụ trong hệ thống thời gian thực."
    },
    {
        "id": "doc_stage5_network",
        "title": "Lộ Trình Bước 5: Ngăn Xếp Mạng Wi-Fi/MQTT & Phân Vùng Nâng Cấp OTA Hai Ngăn",
        "category": "Lộ Trình 5",
        "tags": [
            "#LộTrình",
            "#Bước5",
            "#WiFi",
            "#MQTT",
            "#OTA",
            "#DualBank",
            "#Security"
        ],
        "date": "26/09/2026",
        "words": 2650,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: THIẾT BỊ EDGE AI CẦN KẾT NỐI ĐÁM MÂY ĐỂ LÀM GÌ?\nMột thiết bị Edge AI hoàn chỉnh không phải là một hòn đảo biệt lập. Trong kiến trúc công nghiệp hiện đại:\n1. **Gửi kết quả phân tích nhẹ (Telemetry):** Thay vì truyền toàn bộ 32KB âm thanh thô lên đám mây làm tốn băng thông và chi phí máy chủ, ESP32-S3 tự xử lý AI tại biên và chỉ gửi lên một bản tin JSON siêu nhẹ (khoảng 150 bytes) thông báo: *\"Phát hiện lỗi bạc đạn động cơ số 3 với độ tin cậy 98.5%\"*.\n2. **Cập nhật trọng số mô hình từ xa (Over-The-Air Update - OTA):** Khi mô hình Deep Learning được huấn luyện lại trên máy chủ với độ chính xác cao hơn, hàng nghìn thiết bị đang lắp đặt tại nhà máy khách hàng phải có khả năng tự động tải bản nhị phân mới về nâng cấp qua Wi-Fi mà không cần bất kỳ kỹ sư nào phải đến cắm dây nạp!\n\n---\n\n### 📌 2. WI-FI STATION STATE MACHINE & CƠ CHẾ TỰ PHỤC HỒI\nMạng Wi-Fi trong môi trường công nghiệp thường xuyên bị chập chờn do nhiễu sóng từ động cơ hoặc bộ phát Access Point khởi động lại.\n- Mã nguồn nghiệp dư thường chỉ gọi lệnh kết nối một lần trong `app_main()`. Khi mất sóng, vi điều khiển mất kết nối vĩnh viễn và biến thành phế liệu.\n- ✅ **Kiến trúc máy trạng thái Event Loop tự phục hồi:**\n  Sử dụng hệ thống sự kiện `esp_event_handler_instance_register()` để lắng nghe các sự kiện mạng:\n  + Khi nhận sự kiện `WIFI_EVENT_STA_START`: Bắt đầu kết nối.\n  + Khi nhận sự kiện `WIFI_EVENT_STA_DISCONNECTED`: Tự động áp dụng thuật toán **Exponential Backoff** (chờ 1s, 2s, 4s, 8s, tối đa 60s) để thử kết nối lại, tránh làm nghẽn bộ nhớ của Router.\n  + Khi nhận sự kiện `IP_EVENT_STA_GOT_IP`: Kích hoạt tác vụ MQTT và bắt đầu gửi dữ liệu.\n\n---\n\n### 📌 3. GIAO THỨC MQTT 3.1.1 VÀ ĐÓNG GÓI BẢN TIN JSON NHẸ\nGiao thức MQTT (Message Queuing Telemetry Transport) là chuẩn mực vàng cho IoT nhờ cơ chế Publish/Subscribe và tiêu đề gói tin (Header) siêu nhỏ chỉ từ 2 bytes:\n- **Lựa chọn mức dịch vụ (Quality of Service - QoS):**\n  + **QoS 0 (At most once):** Gửi đi mà không cần xác nhận. Thích hợp cho dữ liệu nhiệt độ định kỳ mỗi 5 giây.\n  + **QoS 1 (At least once):** Bắt buộc máy chủ Broker phải gửi lại gói tin xác nhận `PUBACK`. Nếu sau một khoảng thời gian không nhận được ACK, vi điều khiển sẽ tự động gửi lại. BẮT BUỘC dùng cho các bản tin cảnh báo sự cố máy móc hỏng hóc từ mô hình AI!\n\n```json\n{\n  \"device_id\": \"esp32s3_edge_01\",\n  \"alert\": \"BEARING_ANOMALY\",\n  \"confidence\": 0.985,\n  \"inference_latency_ms\": 11.8,\n  \"peak_freq_hz\": 1250,\n  \"timestamp\": 1727345678\n}\n```\n\n---\n\n### 📌 4. BẢNG PHÂN VÙNG DUAL-BANK OTA VÀ CƠ CHẾ TỰ ĐỘNG ROLLBACK\nNỗi ác mộng lớn nhất của kỹ sư nhúng là thiết bị đang nạp firmware mới qua sóng không dây thì bị mất điện giữa chừng, hoặc firmware mới có lỗi logic làm chip khởi động lại liên tục (Bootloop) khiến thiết bị biến thành \"cục gạch\" (Bricking)!\n\n#### Bảng Phân Vùng Hai Ngăn (Dual-Bank Partition Table):\nFile cấu hình `partitions.csv` chia bộ nhớ Flash ngoài thành các vùng độc lập:\n```text\n# Name,   Type, SubType, Offset,  Size, Flags\nnvs,      data, nvs,     0x9000,  0x4000,\notadata,  data, ota,     0xe000,  0x2000,\nphy_init, data, phy,     0x10000, 0x1000,\nfactory,  app,  factory, 0x20000, 0x1E0000,\nota_0,    app,  ota_0,   0x200000,0x2E0000,\nota_1,    app,  ota_1,   0x4E0000,0x2E0000,\n```\n\n#### Cơ Chế Chuyển Giao An Toàn Tuyệt Đối:\n1. Thiết bị đang chạy ổn định trên phân vùng **`ota_0`**.\n2. Kỹ sư phát lệnh nâng cấp. Firmware mới được tải về và ghi đè vào phân vùng phụ **`ota_1`**. Trong suốt quá trình tải, firmware cũ trên `ota_0` vẫn hoạt động bình thường!\n3. Sau khi tải xong và kiểm tra mã băm SHA-256 hoàn toàn trùng khớp, Bootloader ghi thông tin vào phân vùng `otadata` chỉ định lần boot tới sẽ chuyển sang `ota_1`.\n4. Vi điều khiển khởi động lại và chạy firmware mới trên `ota_1`.\n5. ⚠️ **Cơ chế Rollback thần kỳ:**\n   Sau khi boot vào firmware mới, nếu trong vòng 30 giây đầu tiên hệ thống bị Crash hoặc không thể kết nối lại Wi-Fi, Bootloader phần cứng sẽ tự động đánh dấu bản nâng cấp này là hỏng hóc và **tự động giật lùi về khởi động lại firmware cũ trên `ota_0`**! Thiết bị không bao giờ bị biến thành cục gạch!\n\n---\n\n### 📌 5. MÃ NGUỒN C MẪU ĐẠT CHUẨN SẢN XUẤT\n```c\n#include \"esp_https_ota.h\"\n#include \"esp_ota_ops.h\"\n#include \"esp_log.h\"\n\n// Hàm xác nhận firmware mới chạy ổn định (HỦY BỎ ROLLBACK)\nvoid validate_new_firmware_health(void) {\n    const esp_partition_t *running = esp_ota_get_running_partition();\n    esp_ota_img_states_t ota_state;\n    \n    if (esp_ota_get_state_partition(running, &ota_state) == ESP_OK) {\n        if (ota_state == ESP_OTA_IMG_PENDING_VERIFY) {\n            // Firmware mới đang trong giai đoạn thử nghiệm\n            // Nếu vượt qua kiểm tra tự kiểm, chính thức xác nhận hợp lệ:\n            ESP_LOGI(\"OTA\", \"Xác nhận firmware mới hoạt động ổn định!\");\n            esp_ota_mark_app_valid_cancel_rollback();\n        }\n    }\n}\n\n// Khởi chạy tiến trình nâng cấp OTA qua kết nối HTTPS bảo mật\nvoid start_secure_ota_update(const char *bin_url) {\n    esp_http_client_config_t http_cfg = {\n        .url = bin_url,\n        .cert_pem = (const char *)server_cert_pem, // Chứng chỉ số bảo mật X.509\n        .timeout_ms = 15000,\n        .keep_alive_enable = true,\n    };\n    esp_https_ota_config_t ota_cfg = {\n        .http_config = &http_cfg,\n    };\n\n    ESP_LOGI(\"OTA\", \"Bắt đầu tải firmware mới từ: %s\", bin_url);\n    esp_err_t ret = esp_https_ota(&ota_cfg);\n    if (ret == ESP_OK) {\n        ESP_LOGI(\"OTA\", \"Nạp firmware thành công! Khởi động lại hệ thống...\");\n        esp_restart();\n    } else {\n        ESP_LOGE(\"OTA\", \"Nâng cấp thất bại, hệ thống vẫn an toàn ở bản cũ!\");\n    }\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [ESP-IDF Over-The-Air (OTA) Updates & Anti-Rollback Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/ota.html) - Hướng dẫn thiết lập bảng phân vùng hai ngăn (Two-slot OTA) và cơ chế tự động phục hồi phiên bản.\n- 📄 [OASIS Standard: MQTT Version 3.1.1 Specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) - Tiêu chuẩn quốc tế về giao thức truyền tin nhắn nhẹ cho thiết bị IoT bị giới hạn tài nguyên.\n- 🌐 [ESP-IDF ESP-MQTT Client Component Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/protocols/mqtt.html) - Cấu hình kết nối MQTT qua tầng mã hóa TLS/SSL và xác thực chứng chỉ X.509.\n- 🐙 [GitHub: ESP-IDF Advanced HTTPS OTA Example](https://github.com/espressif/esp-idf/tree/master/examples/system/ota/advanced_https_ota) - Dự án mẫu nạp firmware từ xa an toàn qua HTTPS."
    },
    {
        "id": "doc_stage6_tinyml",
        "title": "Lộ Trình Bước 6: Mô Hình AI Trên Edge (TinyML), Lượng Tử Hóa INT8 & TFLite Micro",
        "category": "Lộ Trình 6",
        "tags": [
            "#LộTrình",
            "#Bước6",
            "#TinyML",
            "#INT8",
            "#TFLiteMicro",
            "#SIMD",
            "#Quantization"
        ],
        "date": "26/09/2026",
        "words": 2800,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: ĐƯA DEEP LEARNING LÊN VI ĐIỀU KHIỂN NHƯ THẾ NÀO?\nCác mô hình Deep Learning truyền thống (trên máy tính hoặc máy chủ đám mây) sử dụng các con số thực dấu phẩy động 32-bit (Float32):\n- Mỗi trọng số (Weight) chiếm 4 bytes. Một mô hình nhỏ có 1 triệu trọng số đã ngốn mất **4 MB bộ nhớ**, vượt xa tổng dung lượng RAM 512KB của ESP32-S3!\n- Phép nhân hai số thực Float32 trên vi điều khiển tốn nhiều chu kỳ lệnh và tỏa nhiều nhiệt lượng.\n- ✅ **Cuộc cách mạng TinyML (TensorFlow Lite for Microcontrollers):**\n  Cho phép nén và chuyển đổi toàn bộ mô hình Deep Learning thành định dạng mảng nhị phân tĩnh FlatBuffer, chạy trực tiếp trên kim loại trần (Bare-metal) mà hoàn toàn không cần hệ điều hành, không phụ thuộc thư viện C++ cồng kềnh và không cấp phát động!\n\n---\n\n### 📌 2. TOÁN HỌC LƯỢNG TỬ HÓA CỐ ĐỊNH INT8 (POST-TRAINING QUANTIZATION)\nLượng tử hóa INT8 là kỹ thuật ánh xạ dải số thực $[r_{min}, r_{max}]$ của các trọng số và hàm kích hoạt sang dải số nguyên có dấu 8-bit $q \\in [-128, 127]$.\n\n#### Công Thức Ánh Xạ Tuyến Tính (Affine Quantization):\n$r = S \\cdot (q - Z)$\nTrong đó:\n- $r$: Giá trị số thực ban đầu (Float32).\n- $q$: Giá trị số nguyên sau lượng tử hóa (INT8).\n- $S$ (Scale): Hệ số tỷ lệ co giãn (luôn là một số thực dương).\n- $Z$ (Zero-Point): Điểm số nguyên tương ứng với giá trị thực $0.0f$.\n\n#### Công Thức Lượng Tử Hóa Thực Thi Trên Vi Điều Khiển:\n$q = \\text{clamp}\\left(\\text{round}\\left(\\frac{r}{S}\\right) + Z, -128, 127\\right)$\n\n#### Lợi Ích Khủng Khiếp Của Lượng Tử Hóa INT8:\n1. **Dung lượng Flash giảm 4 lần:** Từ 400KB giảm xuống còn đúng 100KB, dễ dàng nhét vừa bộ nhớ Flash của vi điều khiển.\n2. **Dung lượng RAM giảm 4 lần:** Các bộ đệm trung gian của các lớp mạng nơ-ron chỉ tốn 1 byte cho mỗi nơ-ron thay vì 4 bytes.\n3. **Tốc độ tính toán tăng vọt 5 lần:** Tận dụng bộ nhân số nguyên phần cứng của CPU thay vì phải giả lập dấu phẩy động.\n\n---\n\n### 📌 3. BẢN ĐỒ BỘ NHỚ TENSOR ARENA & TỐI ƯU HÓA LINKER RESOLVER\nTrong TFLite Micro, toàn bộ bộ nhớ phục vụ cho mô hình suy luận đều được đặt trong một mảng byte tĩnh duy nhất gọi là **Tensor Arena**:\n\n```\n[Vùng Nhớ Tensor Arena: Khai báo tĩnh trong Internal SRAM1]\n+-------------------------------------------------------------+\n| Vùng đệm đầu vào (Input Tensor)                             |\n+-------------------------------------------------------------+\n| Vùng đệm trung gian tái sử dụng (Scratch Buffers)           |\n| (Lớp nơ-ron sau tái sử dụng lại bộ nhớ của lớp nơ-ron trước)|\n+-------------------------------------------------------------+\n| Vùng đệm đầu ra chứa điểm phân loại (Output Tensor)         |\n+-------------------------------------------------------------+\n```\n\n#### Tối Ưu Resolver Bằng MicroMutableOpResolver:\n- ❌ **Cách làm lãng phí:** Sử dụng `tflite::AllOpsResolver`. Trình liên kết Linker sẽ buộc phải nạp mã máy của tất cả hơn 100 toán tử toán học của TensorFlow vào Flash ROM (dù mô hình của bạn chỉ dùng đúng 3 toán tử), làm dung lượng firmware phình to thêm hơn **150 KB**!\n- ✅ **Cách làm chuẩn mực:** Sử dụng `tflite::MicroMutableOpResolver<N>` và chỉ đăng ký chính xác các toán tử mà mô hình của bạn thực sự sử dụng:\n  ```cpp\n  static tflite::MicroMutableOpResolver<3> resolver;\n  resolver.AddConv2D();\n  resolver.AddDepthwiseConv2D();\n  resolver.AddFullyConnected();\n  ```\n\n---\n\n### 📌 4. TĂNG TỐC PHẦN CỨNG VECTOR SIMD TRÊN NHÂN XTENSA LX7\nESP32-S3 được Espressif trang bị bộ tăng tốc tập lệnh **Vector Instructions (SIMD 128-bit)**:\n- Thư viện tối ưu hóa **ESP-NN** thay thế các vòng lặp nhân ma trận thông thường của TensorFlow bằng các lệnh máy Vector độc quyền.\n- Trong 1 chu kỳ xung nhịp 240MHz (~4.16ns), CPU nạp cùng lúc **16 số nguyên INT8** và thực hiện song song 16 phép nhân cộng dồn (Multiply-Accumulate - MAC).\n- **Kết quả thực tế:** Một mô hình nhận diện giọng nói từ khóa (Keyword Spotting) chạy mất 65 mili-giây nếu dùng code chuẩn; khi bật tăng tốc SIMD ESP-NN, thời gian thực thi giảm xuống chỉ còn **11.2 mili-giây** (nhanh hơn gần 6 lần)!\n\n---\n\n### 📌 5. MÃ NGUỒN C++ MẪU ĐẠT CHUẨN SẢN XUẤT\n```cpp\n#include \"tensorflow/lite/micro/micro_interpreter.h\"\n#include \"tensorflow/lite/micro/micro_mutable_op_resolver.h\"\n#include \"tensorflow/lite/schema/schema_generated.h\"\n#include \"esp_timer.h\"\n#include \"esp_log.h\"\n#include \"model_int8_data.h\" // Mảng nhị phân chứa trọng số mô hình\n\n#define TENSOR_ARENA_SIZE (48 * 1024)\nalignas(16) static uint8_t s_tensor_arena[TENSOR_ARENA_SIZE]; // Bắt buộc căn lề 16-byte\n\nstatic const tflite::Model *s_model = nullptr;\nstatic tflite::MicroInterpreter *s_interpreter = nullptr;\n\nvoid init_tinyml_engine(void) {\n    // 1. Ánh xạ mảng nhị phân vào cấu trúc Model\n    s_model = tflite::GetModel(g_model_int8_bin);\n\n    // 2. Đăng ký tối thiểu các toán tử cần dùng\n    static tflite::MicroMutableOpResolver<3> resolver;\n    resolver.AddFullyConnected();\n    resolver.AddRelu();\n    resolver.AddSoftmax();\n\n    // 3. Khởi tạo bộ thông dịch Interpreter\n    static tflite::MicroInterpreter static_interpreter(\n        s_model, resolver, s_tensor_arena, TENSOR_ARENA_SIZE);\n    s_interpreter = &static_interpreter;\n\n    // 4. Phân bổ bộ nhớ các Tensor\n    TfLiteStatus allocate_status = s_interpreter->AllocateTensors();\n    if (allocate_status != kTfLiteOk) {\n        ESP_LOGE(\"TINYML\", \"Không đủ Tensor Arena!\");\n        return;\n    }\n}\n\nint8_t run_inference_on_features(const float *features, int feature_len) {\n    TfLiteTensor *input = s_interpreter->input(0);\n\n    // 5. Lượng tử hóa mảng đặc trưng đầu vào từ Float32 sang INT8\n    for (int i = 0; i < feature_len; i++) {\n        input->data.int8[i] = (int8_t)roundf(features[i] / input->params.scale + input->params.zero_point);\n    }\n\n    // 6. Thực thi suy luận AI thời gian thực và đo độ trễ\n    int64_t t_start = esp_timer_get_time();\n    s_interpreter->Invoke();\n    int64_t latency_us = esp_timer_get_time() - t_start;\n\n    // 7. Đọc kết quả phân loại từ Output Tensor\n    TfLiteTensor *output = s_interpreter->output(0);\n    int8_t best_class = 0;\n    int8_t max_score = -128;\n    for (int i = 0; i < output->dims->data[1]; i++) {\n        if (output->data.int8[i] > max_score) {\n            max_score = output->data.int8[i];\n            best_class = i;\n        }\n    }\n    ESP_LOGI(\"TINYML\", \"Lớp: %d | Độ tin cậy: %d | Độ trễ: %lld us (%.2f ms)\", \n             best_class, max_score, latency_us, latency_us / 1000.0f);\n    return best_class;\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [Nghiên cứu nền tảng: \"Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference\"](https://arxiv.org/abs/1712.05877) - Benoit Jacob et al. (Google, IEEE CVPR 2018) - Công trình khoa học đặt nền móng cho kỹ thuật lượng tử hóa INT8 trong TensorFlow Lite.\n- 🐙 [GitHub: Espressif Neural Network Library (esp-nn)](https://github.com/espressif/esp-nn) - Thư viện tăng tốc mạng nơ-ron bằng tập lệnh Vector SIMD trên lõi vi xử lý ESP32-S3 Xtensa LX7.\n- 🐙 [GitHub: TensorFlow Lite for Microcontrollers (TFLite Micro)](https://github.com/tensorflow/tflite-micro) - Kho mã nguồn mở framework học sâu cho vi điều khiển của Google.\n- 📚 Sách tiêu chuẩn: *\"TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers\"* (Pete Warden & Daniel Situnayake, O'Reilly Media)."
    },
    {
        "id": "doc_stage7_lowpower",
        "title": "Lộ Trình Bước 7: Tối Ưu Nguồn Cực Hạn (ULP Co-processor & Deep Sleep)",
        "category": "Lộ Trình 7",
        "tags": [
            "#LộTrình",
            "#Bước7",
            "#LowPower",
            "#DeepSleep",
            "#ULP",
            "#RISCV",
            "#Battery"
        ],
        "date": "26/09/2026",
        "words": 2550,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: NĂNG LƯỢNG LÀ RÀO CẢN SỐ 1 CỦA THIẾT BỊ IOT\nTrong thực tế triển khai các thiết bị cảm biến công nghiệp hoặc nông nghiệp thông minh:\n- Không phải lúc nào thiết bị cũng có sẵn nguồn điện lưới 220V. 90% thiết bị Edge AI phải vận hành bằng nguồn Pin (Pin Li-Ion, Pin Li-SOCl2 hoặc Pin mặt trời).\n- Khi chạy hết công suất (CPU 240MHz kép + Bật Wi-Fi phát dữ liệu), ESP32-S3 tiêu thụ dòng điện khoảng **180mA đến 240mA**. Với mức tiêu thụ này, một viên pin 2000mAh sẽ bị vắt kiệt chỉ sau **vỏn vẹn 8 đến 10 giờ**!\n- ✅ **Mục tiêu kỹ sư nhúng chuyên nghiệp**: Tối ưu hóa chu kỳ hoạt động (Duty Cycle) và đưa thiết bị vào chế độ ngủ sâu **Deep Sleep**, hạ dòng tiêu thụ xuống dưới **10 micro-ampe (uA)**! Khi đó, viên pin 2000mAh có thể nuôi sống thiết bị liên tục từ **3 đến 5 năm** mà không cần thay pin!\n\n---\n\n### 📌 2. CÁC MIỀN NGUỒN PHẦN CỨNG & CƠ CHẾ CLOCK GATING\nESP32-S3 phân chia các khối mạch bán dẫn thành nhiều miền nguồn độc lập (Power Domains):\n\n```\n[Nguồn Pin 3.3V]\n      |\n      +---> [Core Domain: CPU Xtensa Core 0 & 1, Internal SRAM] ---> [BỊ CẮT ĐIỆN HOÀN TOÀN TRONG DEEP SLEEP]\n      |\n      +---> [Wi-Fi/Bluetooth Domain: Bộ phát sóng cao tần RF]  ---> [BỊ CẮT ĐIỆN HOÀN TOÀN TRONG DEEP SLEEP]\n      |\n      +---> [RTC Domain (Real-Time Clock): Dòng điện < 8uA]   ---> [LUÔN CÓ ĐIỆN BẢO TOÀN TRẠNG THÁI]\n                 |\n                 +--> RTC Fast SRAM (8KB) & RTC Slow SRAM (8KB)\n                 +--> Bộ đếm thời gian RTC Timer\n                 +--> Bộ vi xử lý phụ siêu tiết kiệm điện: ULP RISC-V (17.5MHz)\n```\n\n- **Cơ chế Clock Gating:** Tự động ngắt xung nhịp cấp cho các khối ngoại vi (I2C, SPI, UART, Timer) khi không có tác vụ nào sử dụng, triệt tiêu dòng rò rỉ chuyển mạch (Dynamic Switching Power).\n\n---\n\n### 📌 3. BỘ ĐỒNG XỬ LÝ ULP RISC-V: TRỢ THỦ ĐẮC LỰC KHI CPU NGỦ\nBộ đồng xử lý ULP (Ultra-Low-Power) trên ESP32-S3 là một vi xử lý kiến trúc chuẩn **RISC-V 32-bit độc lập**:\n- Chạy ở xung nhịp thấp 17.5MHz với dòng tiêu thụ chỉ khoảng **150 uA**.\n- Được lập trình bằng ngôn ngữ C thông thường và nạp vào vùng nhớ RTC Fast SRAM.\n- **Kịch bản vận hành hoàn hảo:**\n  1. CPU chính chạy mô hình AI xong, thiết lập cấu hình và đi vào Deep Sleep (<10uA).\n  2. Cứ mỗi 100 mili-giây, ULP RISC-V thức dậy trong 1ms, giao tiếp I2C để đọc giá trị gia tốc kế từ cảm biến rung động.\n  3. Nếu độ rung bình thường: ULP tiếp tục ngủ, CPU chính vẫn ngủ say.\n  4. Nếu phát hiện độ rung vượt ngưỡng cảnh báo nguy hiểm: ULP phát tín hiệu ngắt phần cứng, **đánh thức CPU chính dậy** để nạp mô hình TinyML phân tích chuyên sâu và phát cảnh báo Wi-Fi!\n\n---\n\n### 📌 4. BẢO TOÀN BIẾN QUA GIẤC NGỦ SÂU VỚI RTC_DATA_ATTR\nKhi ESP32-S3 thức dậy từ giấc ngủ sâu Deep Sleep:\n- Nó không tiếp tục chạy dòng code tiếp theo! Về bản chất phần cứng, việc thức dậy từ Deep Sleep tương đương với một lần **Reset khởi động lại máy (Power-on Reset flow)**.\n- Toàn bộ biến cục bộ trên Stack và biến toàn cục thông thường trong RAM nội đều bị xóa sạch về giá trị khởi tạo ban đầu!\n- ✅ **Giải pháp từ khóa `RTC_DATA_ATTR`:**\n  Gắn từ khóa này trước biến toàn cục để ép trình liên kết Linker đặt biến vào vùng nhớ **RTC Fast SRAM**:\n  ```c\n  RTC_DATA_ATTR static uint32_t s_boot_counter = 0;\n  RTC_DATA_ATTR static float s_anomaly_history[10];\n  ```\n  Các biến này sẽ giữ nguyên vẹn giá trị qua hàng nghìn lần ngủ và thức dậy, cho phép lưu trữ lịch sử trạng thái của thiết bị.\n\n---\n\n### 📌 5. CÁC NGUỒN ĐÁNH THỨC LINH HOẠT (WAKEUP TRIGGERS)\nESP32-S3 hỗ trợ nhiều cơ chế đánh thức từ phần cứng:\n1. **Timer Wakeup:** Đánh thức định kỳ sau một khoảng thời gian micro-giây cài sẵn (`esp_sleep_enable_timer_wakeup`).\n2. **EXT0 Wakeup:** Đánh thức bằng một chân GPIO duy nhất khi chuyển trạng thái logic (ví dụ nút nhấn khẩn cấp).\n3. **EXT1 Wakeup:** Đánh thức bằng một mặt nạ Bitmask chứa nhiều chân GPIO (ví dụ bàn phím ma trận 4 nút).\n4. **ULP Wakeup:** Bộ vi xử lý phụ ULP kích hoạt lệnh đánh thức CPU chính.\n\n---\n\n### 📌 6. MÃ NGUỒN C MẪU ĐẠT CHUẨN SẢN XUẤT\n```c\n#include <stdio.h>\n#include \"esp_sleep.h\"\n#include \"driver/rtc_io.h\"\n#include \"esp_log.h\"\n\n// Biến nằm trong RTC SRAM, bảo toàn nguyên vẹn qua giấc ngủ sâu\nRTC_DATA_ATTR static uint32_t s_wake_count = 0;\nRTC_DATA_ATTR static float s_last_recorded_temp = 0.0f;\n\nvoid app_main(void) {\n    s_wake_count++;\n    \n    // Kiểm tra nguyên nhân thức dậy\n    esp_sleep_wakeup_cause_t wakeup_reason = esp_sleep_get_wakeup_cause();\n    if (wakeup_reason == ESP_SLEEP_WAKEUP_TIMER) {\n        printf(\"Thức dậy do Timer định kỳ! Lần thứ: %lu\\n\", s_wake_count);\n    } else {\n        printf(\"Khởi động lần đầu tiên từ nguồn điện!\\n\");\n    }\n\n    // Thực hiện công việc đo đạc và suy luận AI siêu tốc trong 50ms\n    s_last_recorded_temp = 28.5f;\n\n    // Cô lập các chân GPIO để triệt tiêu dòng rò rỉ qua các điện trở kéo\n    rtc_gpio_isolate(GPIO_NUM_4);\n    rtc_gpio_isolate(GPIO_NUM_5);\n\n    // Cài đặt hẹn giờ đánh thức sau đúng 60 giây (60 triệu micro-giây)\n    esp_sleep_enable_timer_wakeup(60 * 1000000ULL);\n\n    // Kích hoạt Deep Sleep: Dòng điện giảm từ 180mA về <10uA ngay tức khắc!\n    printf(\"Đi vào giấc ngủ sâu Deep Sleep để tiết kiệm pin...\\n\");\n    esp_deep_sleep_start();\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 32: Ultra-Low-Power Co-processor (ULP-RISC-V)](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Kiến trúc tập lệnh và cơ chế hoạt động của lõi phụ RISC-V 32-bit khi chip ngủ sâu.\n- 🌐 [ESP-IDF Sleep Modes & Power Management Architecture](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/sleep_modes.html) - Hướng dẫn cấu hình nguồn đánh thức (Wakeup Sources): GPIO, RTC Timer, ULP Wakeup.\n- 🌐 [ESP-IDF ULP (RISC-V) Programming Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/ulp.html) - Lập trình C cho vi điều khiển phụ ULP và chia sẻ biến qua bộ nhớ RTC Slow RAM.\n- 🐙 [GitHub: ESP-IDF Deep Sleep & ULP Code Examples](https://github.com/espressif/esp-idf/tree/master/examples/system/deep_sleep) - Các bài mẫu đo dòng tiêu thụ và tối ưu nguồn điện."
    },
    {
        "id": "doc_stage8_capstone",
        "title": "Lộ Trình Bước 8: Tiêu Chuẩn Nghiệm Thu Đồ Án Tốt Nghiệp A+ & Benchmarking",
        "category": "Lộ Trình 8",
        "tags": [
            "#LộTrình",
            "#Bước8",
            "#Capstone",
            "#Benchmarking",
            "#Latency",
            "#Memory",
            "#ConfusionMatrix"
        ],
        "date": "26/09/2026",
        "words": 2750,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: TIÊU CHÍ ĐÁNH GIÁ ĐỒ ÁN A+ TRƯỚC HỘI ĐỒNG\nMột đồ án tốt nghiệp kỹ sư ngành Hệ thống nhúng & IoT / Edge AI đạt điểm A+ không bao giờ chỉ dừng lại ở một video quay cảnh đèn LED nhấp nháy hoặc một mô hình nhận diện chạy thử được vài lần trong điều kiện lý tưởng.\nHội đồng giám khảo chuyên môn đòi hỏi những **con số đo đạc khoa học định lượng (Quantitative Benchmarks)** có thể tái lập được:\n1. **Độ trễ suy luận (Inference Latency):** Phân tích chi tiết thời gian thực thi của từng phân đoạn trong đường ống dữ liệu (Thu thập mẫu, lọc DSP, biến đổi FFT, nạp Tensor và thời gian Invoke).\n2. **Chi phí bộ nhớ (Memory Footprint Auditing):** Báo cáo chi tiết dung lượng Flash nhị phân (.bin) và biểu đồ sử dụng RAM nội (Internal SRAM) đo đạc theo thời gian thực.\n3. **Độ chính xác khoa học (Scientific Accuracy Metrics):** Bảng ma trận nhầm lẫn (Confusion Matrix), các chỉ số Precision, Recall và F1-Score trên tập dữ liệu kiểm thử độc lập.\n4. **Kiểm thử độ bền 24/7 (Soak Stress Testing):** Chứng minh hệ thống chạy liên tục không bị tràn bộ nhớ Heap, không rớt mạng Wi-Fi và nhiệt độ chip nằm trong ngưỡng an toàn.\n\n---\n\n### 📌 2. KỸ THUẬT ĐO ĐỘ TRỄ SUY LUẬN CHUẨN XÁC ĐẾN MICRO-GIÂY\nĐể đo thời gian thực thi của một đoạn mã nguồn trong ESP-IDF, **tuyệt đối không dùng hàm clock() hay hàm vTaskDelay()**:\n- ✅ **Sử dụng API `esp_timer_get_time()`:**\n  API này đọc trực tiếp giá trị từ bộ đếm thời gian phần cứng 64-bit chạy trên xung nhịp cố định, trả về thời gian tính bằng micro-giây ($\\mu s$) kể từ khi vi điều khiển khởi động:\n\n```c\nint64_t t_dsp_start = esp_timer_get_time();\nexecute_dsp_fft_pipeline();\nint64_t t_dsp_latency = esp_timer_get_time() - t_dsp_start;\n\nint64_t t_ai_start = esp_timer_get_time();\ninterpreter->Invoke();\nint64_t t_ai_latency = esp_timer_get_time() - t_ai_start;\n```\n\n---\n\n### 📌 3. GIÁM SÁT DUNG LƯỢNG RAM & PHÁT HIỆN RÒ RỈ BỘ NHỚ (MEMORY LEAK PROFILING)\nĐể chứng minh với hội đồng bảo vệ rằng mã nguồn của bạn hoàn toàn không bị rò rỉ bộ nhớ (Memory Leak):\n- Theo dõi 2 chỉ số sống còn bằng API `esp_heap_caps`:\n  + `heap_caps_get_free_size(MALLOC_CAP_INTERNAL)`: Lượng RAM tự do hiện tại.\n  + `heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL)`: **Mức RAM tự do thấp nhất (Watermark)** mà hệ thống từng chạm tới kể từ khi khởi động.\n- Nếu sau 10,000 chu kỳ suy luận liên tục, mức RAM tự do không bị giảm dần theo thời gian, bạn có bằng chứng thép chứng minh hệ thống đạt độ tin cậy tuyệt đối 100%!\n\n---\n\n### 📌 4. MA TRẬN NHẦM LẪN (CONFUSION MATRIX) & CÁC CHỈ SỐ KHOA HỌC\nKhi phân loại sự cố động cơ (ví dụ: Bình thường, Hỏng bạc đạn, Lệch trục, Quá tải):\n- **Ma trận nhầm lẫn (Confusion Matrix)** là một bảng 2 chiều biểu diễn mối quan hệ giữa Nhãn thực tế (True Label) và Nhãn do mô hình AI dự đoán (Predicted Label).\n\n| Nhãn Thực Tế \\ Dự Đoán | Bình Thường | Hỏng Bạc Đạn | Lệch Trục |\n| :--- | :--- | :--- | :--- |\n| **Bình Thường** | **98 (TP)** | 1 (FN) | 1 (FN) |\n| **Hỏng Bạc Đạn**| 0 (FP) | **99 (TP)** | 1 (FN) |\n| **Lệch Trục** | 2 (FP) | 1 (FP) | **97 (TP)** |\n\n#### Các Công Thức Bắt Buộc Trong Báo Cáo Đồ Án:\n1. **Độ Chính Xác Tổng Thể (Accuracy):**\n   $\\text{Accuracy} = \\frac{\\sum \\text{Đúng}}{\\text{Tổng Số Mẫu}} = \\frac{98 + 99 + 97}{300} = 98.0\\%$\n2. **Độ Chuẩn Xác (Precision):** Tỷ lệ dự đoán đúng trong số các lần mô hình phát chuông báo động:\n   $\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$\n3. **Độ Thu Hồi (Recall):** Tỷ lệ sự cố thực tế được mô hình phát hiện (cực kỳ quan trọng để không bỏ sót sự cố):\n   $\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$\n4. **Điểm F1-Score (Trung bình điều hòa giữa Precision và Recall):**\n   $\\text{F1} = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$\n\n---\n\n### 📌 5. MÃ NGUỒN C MẪU THỰC HIỆN BÁO CÁO BENCHMARK TỰ ĐỘNG\n```c\n#include <stdio.h>\n#include \"esp_timer.h\"\n#include \"esp_heap_caps.h\"\n\nvoid generate_capstone_benchmark_report(void) {\n    size_t free_ram_start = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);\n    size_t free_ram_min = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);\n\n    printf(\"\\n=======================================================\\n\");\n    printf(\"   BÁO CÁO THỬ NGHIỆM ĐỒ ÁN TỐT NGHIỆP EDGE AI ESP32-S3   \\n\");\n    printf(\"=======================================================\\n\");\n    printf(\"1. HIỆU NĂNG THỜI GIAN THỰC:\\n\");\n    printf(\"   - Tần số lấy mẫu cảm biến: 16,000 Hz\\n\");\n    printf(\"   - Thời gian tiền xử lý FFT 512 điểm: 0.72 ms\\n\");\n    printf(\"   - Thời gian suy luận mô hình TinyML:  11.45 ms\\n\");\n    printf(\"   - Tổng thời gian phản hồi toàn chu trình: 12.17 ms\\n\");\n    printf(\"2. BỘ NHỚ VÀ TÀI NGUYÊN:\\n\");\n    printf(\"   - Bộ nhớ Tensor Arena cấp phát tĩnh: 48,000 bytes\\n\");\n    printf(\"   - Dung lượng RAM nội còn trống tự do: %u bytes\\n\", free_ram_start);\n    printf(\"   - Mức RAM thấp nhất ghi nhận (Watermark): %u bytes\\n\", free_ram_min);\n    printf(\"   - Trạng thái rò rỉ bộ nhớ: 0 bytes (KHÔNG RÒ RỈ)\\n\");\n    printf(\"3. ĐỘ CHÍNH XÁC KHOA HỌC:\\n\");\n    printf(\"   - Accuracy trên tập test: 98.33%%\\n\");\n    printf(\"   - F1-Score trung bình: 0.982\\n\");\n    printf(\"=======================================================\\n\\n\");\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [Nghiên cứu tiêu chuẩn: \"MLPerf Tiny Benchmark Suite\"](https://arxiv.org/abs/2106.07550) - Colby Banbury et al. (NeurIPS 2021) - Khung đo lường chuẩn hóa toàn cầu về độ trễ, mức tiêu thụ năng lượng và độ chính xác của mô hình Edge AI.\n- 🌐 [Cadence Xtensa LX7 Microprocessor Architecture Overview](https://www.cadence.com/en_US/home/tools/silicon-solutions/tensilica-ip/xtensa-custom-processors.html) - Tài liệu kiến trúc phần cứng và thanh ghi đếm chu kỳ lệnh CPU CCOUNT.\n- 🌐 [Edge Impulse: Benchmarking Embedded Machine Learning Models](https://docs.edgeimpulse.com/docs/edge-device-optimization) - Phương pháp luận đo kiểm hiệu năng suy luận trên thiết bị biên nhúng."
    },
    {
        "id": "doc_stage9_c_interview",
        "title": "Lộ Trình Bước 9: 10 Câu Hỏi Bẫy C Kinh Điển Khi Phỏng Vấn Kỹ Sư Nhúng",
        "category": "Lộ Trình 9",
        "tags": [
            "#LộTrình",
            "#Bước9",
            "#C_Interview",
            "#Volatile",
            "#Padding",
            "#FunctionPointers",
            "#Bitwise"
        ],
        "date": "26/09/2026",
        "words": 2850,
        "isNativePdf": false,
        "content": "### 📌 1. BẪY SỐ 1: TỪ KHÓA `volatile` VÀ CƠ CHẾ TỐI ƯU CỦA COMPILER\n**Câu hỏi nhà tuyển dụng:** *\"Từ khóa `volatile` dùng để làm gì? Điều gì sẽ xảy ra nếu bạn không sử dụng nó trong hệ thống nhúng?\"*\n- **Bản chất phần cứng:** Báo cho trình biên dịch rằng giá trị của biến này có thể bị thay đổi bất ngờ bởi phần cứng bên ngoài (hoặc bởi một hàm ngắt ISR) mà luồng code tuần tự hiện tại không kiểm soát được.\n- **Nếu thiếu `volatile`:** Trình biên dịch với cờ tối ưu hóa `-O2` hoặc `-O3` sẽ tự ý nạp biến vào thanh ghi CPU nội bộ (Register Cache) và **không bao giờ đọc lại từ RAM nữa**:\n  ```c\n  bool flag = false; // Thiếu volatile!\n  void isr_handler() { flag = true; }\n  void wait_task() {\n      while (!flag); // Compiler dịch thành while(true) vô hạn! Hệ thống treo cứng!\n  }\n  ```\n- ✅ **3 trường hợp BẮT BUỘC dùng `volatile`:**\n  1. Con trỏ trỏ vào thanh ghi ngoại vi phần cứng (Memory-Mapped I/O).\n  2. Biến toàn cục được sửa đổi bên trong hàm ngắt ISR.\n  3. Cờ chia sẻ giữa nhiều tác vụ trong hệ điều hành đa nhiệm RTOS.\n\n---\n\n### 📌 2. BẪY SỐ 2: STRUCT PADDING & PACKING (CĂN LỀ TỰ NHIÊN)\n**Câu hỏi nhà tuyển dụng:** *\"Cho struct sau, hàm `sizeof()` trên vi xử lý 32-bit trả về bao nhiêu bytes?\"*\n```c\nstruct BadStruct {\n    char a;      // 1 byte\n    int b;       // 4 bytes\n    char c;      // 1 byte\n};\n```\n- **Câu trả lời sai của người thiếu kinh nghiệm:** $1 + 4 + 1 = 6$ bytes.\n- **Đáp án chính xác:** **12 bytes!**\n- **Giải thích phần cứng:** Bus dữ liệu của vi điều khiển 32-bit nạp dữ liệu theo từng khối 4-byte (Word-aligned). Để biến `int b` nằm đúng ở địa chỉ chia hết cho 4, trình biên dịch tự động chèn **3 bytes rác (padding bytes)** sau biến `a`. Và sau biến `c`, trình biên dịch chèn tiếp **3 bytes rác** để kích thước toàn bộ struct là bội số của 4!\n- ✅ **Cách tối ưu 1:** Sắp xếp lại thứ tự khai báo từ biến lớn đến biến nhỏ:\n  ```c\n  struct GoodStruct { int b; char a; char c; }; // Chỉ tốn 8 bytes!\n  ```\n- ✅ **Cách tối ưu 2:** Sử dụng `__attribute__((packed))` ép struct không chứa byte rác (dùng khi truyền gói tin mạng I2C/CAN).\n\n---\n\n### 📌 3. BẪY SỐ 3: PHÂN BIỆT `const int *p` VÀ `int * const p`\nMẹo nhớ thần tốc theo nguyên tắc **\"Đọc từ phải qua trái (Read Right-to-Left)\"**:\n1. `const int *p`: Con trỏ trỏ tới dữ liệu hằng (`p is a pointer to const int`). Địa chỉ con trỏ có thể thay đổi để trỏ đi nơi khác, nhưng giá trị bên trong ô nhớ (`*p`) bị khóa chỉ đọc.\n2. `int * const p`: Con trỏ hằng trỏ tới dữ liệu biến thiên (`p is a const pointer to int`). Địa chỉ của con trỏ bị khóa cứng vĩnh viễn không thể thay đổi, nhưng giá trị bên trong ô nhớ (`*p`) có thể sửa đổi thoải mái.\n3. `const int * const p`: Khóa cứng toàn diện cả địa chỉ con trỏ lẫn giá trị bên trong ô nhớ.\n\n---\n\n### 📌 4. BẪY SỐ 4: BẢNG CON TRỎ HÀM (FUNCTION POINTER TABLE) LÀM STATE MACHINE\nNhà tuyển dụng chuyên nghiệp không bao giờ muốn thấy một chuỗi `switch-case` 50 nhánh cồng kềnh trong firmware nhúng vì độ phức tạp tìm kiếm $O(N)$ làm tốn thời gian thực thi.\n- ✅ **Giải pháp đẳng cấp:** Sử dụng **Bảng con trỏ hàm (Function Pointer Dispatch Table)**:\n```c\ntypedef void (*StateFunc_t)(void);\n\nvoid state_idle(void) { /* Chờ cảm biến */ }\nvoid state_sampling(void) { /* Đọc I2C */ }\nvoid state_inference(void) { /* Chạy AI */ }\n\n// Bảng con trỏ hàm FSM\nstatic const StateFunc_t fsm_lut[] = {\n    [0] = state_idle,\n    [1] = state_sampling,\n    [2] = state_inference\n};\n\n// Chuyển trạng thái cực nhanh trong 1 chu kỳ máy O(1):\nfsm_lut[current_state]();\n```\n\n---\n\n### 📌 5. BẪY SỐ 5: 4 CÂU THẦN CHÚ THAO TÁC BITWISE THANH GHI\nBắt buộc phải thuộc làu 4 phép toán thao tác bit trên thanh ghi:\n1. **Bật bit thứ n (Set bit):** `REG |= (1U << n);`\n2. **Xóa bit thứ n (Clear bit):** `REG &= ~(1U << n);`\n3. **Đảo trạng thái bit thứ n (Toggle bit):** `REG ^= (1U << n);`\n4. **Kiểm tra bit thứ n (Check bit):** `if (REG & (1U << n)) { /* Bit đang bật */ }`\n\n---\n\n### 📌 6. BẪY SỐ 6: PHÁT HIỆN ENDIANNESS (LITTLE ENDIAN VS BIG ENDIAN)\n**Câu hỏi nhà tuyển dụng:** *\"Viết một đoạn code C ngắn nhất để kiểm tra CPU hiện tại là Little-Endian hay Big-Endian?\"*\n```c\nbool is_little_endian(void) {\n    uint16_t num = 0x0001;\n    uint8_t *byte_ptr = (uint8_t *)&num;\n    return (*byte_ptr == 0x01); // Nếu byte đầu tiên là 1 -> Little Endian!\n}\n```\nESP32-S3 sử dụng kiến trúc **Little-Endian** (Byte thấp lưu ở địa chỉ nhỏ trước). Trong khi đó, các gói tin mạng IP hoặc giao thức CAN Bus thường sử dụng **Big-Endian**. Việc nắm vững Endianness giúp bạn không bao giờ bị đảo ngược dữ liệu cảm biến!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [SEI CERT C Coding Standard: Rules for Safe, Reliable, and Secure Systems](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard) - Tiêu chuẩn vàng của viện kỹ nghệ phần mềm Mỹ về bẫy kiểu dữ liệu và tràn số nguyên.\n- 📄 [ISO/IEC 9899:2011 (C11 Committee Draft)](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) - Mục 6.5.3 (Unary operators), Mục 6.7.3 (Type qualifiers: const, volatile, restrict).\n- 📚 Sách chuyên sâu: *\"C Traps and Pitfalls\"* (Tác giả: Andrew Koenig, AT&T Bell Laboratories, Nhà xuất bản Addison-Wesley)."
    },
    {
        "id": "doc_stage10_baremetal",
        "title": "Lộ Trình Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi Trần (Bare-Metal)",
        "category": "Lộ Trình 10",
        "tags": [
            "#LộTrình",
            "#Bước10",
            "#BareMetal",
            "#Registers",
            "#LinkerScript",
            "#MemoryMapped",
            "#Assembly"
        ],
        "date": "26/09/2026",
        "words": 2700,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO KỸ SƯ NHÚNG PHẢI HIỂU THANH GHI TRẦN?\nCác thư viện đóng gói sẵn (như Arduino `digitalWrite` hoặc thậm chí các hàm HAL cấp cao của ESP-IDF) luôn đi kèm một lớp trừu tượng bao bọc (Abstraction Overhead):\n- Lệnh `digitalWrite(2, HIGH)` của Arduino tiêu tốn từ **35 đến 50 chu kỳ lệnh CPU**! Nó phải kiểm tra xem chân có hợp lệ không, tra cứu bảng ánh xạ mảng, tắt PWM nếu đang bật và cấu hình thanh ghi.\n- Trong các ứng dụng điều khiển động cơ bước tốc độ cao hoặc truyền dữ liệu song song tốc độ cao cho Camera AI, độ trễ 50 chu kỳ máy là không thể chấp nhận được.\n- ✅ **Lập trình thanh ghi trần (Bare-metal Direct Register Access):**\n  Tương tác trực tiếp với địa chỉ vật lý được công bố trong Technical Reference Manual của chip. Thao tác bật/tắt chân GPIO được thực hiện trong **đúng 1 chu kỳ xung nhịp (~4.16 nano-giây)**!\n\n---\n\n### 📌 2. BẢN ĐỒ THANH GHI NGOẠI VI (MEMORY-MAPPED I/O)\nTrong kiến trúc vi xử lý 32-bit hiện đại (như Xtensa hoặc ARM Cortex-M), các thiết bị ngoại vi không nằm ở một không gian độc lập, mà được ánh xạ trực tiếp vào không gian địa chỉ bộ nhớ như các ô nhớ RAM thông thường:\n- Ví dụ trên ESP32: Thanh ghi cấu hình bật chân GPIO nằm ở địa chỉ Hexa: `0x3FF44008` (`GPIO_OUT_W1TS_REG`).\n- Để bật chân GPIO2 lên mức cao 3.3V, ta chỉ cần ép kiểu địa chỉ này thành một con trỏ 32-bit và ghi giá trị:\n  ```c\n  #define GPIO_OUT_W1TS_REG  0x3FF44008\n  *((volatile uint32_t *)GPIO_OUT_W1TS_REG) = (1U << 2);\n  ```\n- Phép gán con trỏ trần này được trình biên dịch dịch thành đúng 1 lệnh máy Assembly **`S32I` (Store 32-bit Immediate)**, đạt tốc độ tuyệt đối của phần cứng!\n\n---\n\n### 📌 3. CƠ CHẾ WRITE-1-TO-SET (W1TS) VÀ WRITE-1-TO-CLEAR (W1TC)\nTại sao các vi điều khiển hiện đại không dùng một thanh ghi duy nhất để đọc và ghi?\n- Giả sử có thanh ghi `GPIO_OUT`. Để bật chân GPIO2 mà không làm tắt các chân khác, ta phải làm thao tác **Read-Modify-Write**:\n  ```c\n  GPIO_OUT |= (1 << 2); // 1. Đọc giá trị cũ -> 2. Bật bit 2 -> 3. Ghi lại\n  ```\n  Nếu đúng vào giữa bước 1 và bước 3, có một ngắt phần cứng xảy ra và ngắt đó thay đổi chân GPIO5, thì khi quay lại bước 3, giá trị của GPIO5 sẽ bị ghi đè mất! Hiện tượng này là một lỗi xung đột cực kỳ khó bắt.\n- ✅ **Giải pháp cặp thanh ghi W1TS và W1TC:**\n  + **W1TS (Write-1-to-Set):** Chỉ những bit nào được ghi số 1 mới được bật lên HIGH; các bit ghi số 0 hoàn toàn không bị ảnh hưởng.\n  + **W1TC (Write-1-to-Clear):** Chỉ những bit nào được ghi số 1 mới bị kéo về LOW; các bit ghi số 0 giữ nguyên trạng thái.\n  Thao tác trở thành **nguyên tử (Atomic Operation)**, an toàn tuyệt đối 100% giữa các ngắt mà không cần dùng khóa bảo vệ!\n\n---\n\n### 📌 4. BẢNG VECTOR NGẮT (IVT) VÀ CƠ CHẾ ĐIỀU KHIỂN NGẮT\nKhi một chân GPIO nhận xung điện áp hoặc một Timer đếm tràn:\n1. Phần cứng ngoại vi phát tín hiệu cờ ngắt lên bộ điều khiển ngắt trung tâm.\n2. CPU tạm dừng luồng thực thi hiện tại, tự động đẩy các thanh ghi làm việc vào ngăn xếp Stack để lưu lại ngữ cảnh (Context Saving).\n3. CPU tra cứu địa chỉ hàm xử lý trong **Bảng Vector Ngắt (Interrupt Vector Table - IVT)** đặt tại đầu vùng nhớ Flash/RAM.\n4. CPU nhảy đến địa chỉ hàm ngắt tương ứng và thực thi.\n5. Sau khi hàm ngắt kết thúc, lệnh `RFI` (Return From Interrupt) phục hồi các thanh ghi từ Stack và cho CPU chạy tiếp luồng cũ.\n\n---\n\n### 📌 5. HIỂU SÂU VỀ LINKER SCRIPT (.LD) VÀ VÒNG ĐỜI KHỞI ĐỘNG\nĐiều gì xảy ra trước khi hàm `app_main()` được gọi?\nFile kịch bản liên kết (**Linker Script - `.ld`**) quy định vị trí đặt của từng đoạn mã vào bộ nhớ:\n1. **Phân đoạn `.text`:** Lưu mã lệnh thực thi trong Flash ROM.\n2. **Phân đoạn `.rodata`:** Lưu các hằng số chuỗi và mảng trọng số mô hình AI tĩnh.\n3. **Phân đoạn `.data`:** Các biến toàn cục được khởi tạo giá trị ban đầu khác 0 (`int count = 10;`). Khi khởi động chip, mã nguồn Startup Code tự động sao chép toàn bộ đoạn này từ Flash vào RAM.\n4. **Phân đoạn `.bss`:** Các biến toàn cục chưa được gán giá trị (`int temp;`). Khi khởi động chip, Startup Code tự động xóa toàn bộ vùng nhớ này về số 0.\n5. **Stack Top:** Con trỏ ngăn xếp được khởi tạo tại đỉnh cao nhất của vùng RAM nội bộ.\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 1: Overview & System Architecture](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Sơ đồ khối bus điều khiển và không gian địa chỉ Memory-Mapped I/O.\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 5: IO MUX and GPIO Matrix](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Cấu trúc thanh ghi cấu hình chân GPIO trần (GPIO_OUT_REG, GPIO_IN_REG).\n- 📚 Sách kinh điển: *\"The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors\"* (Joseph Yiu, Elsevier) - Nền tảng kiến thức so sánh kiến trúc vi xử lý và lập trình thanh ghi trần."
    },
    {
        "id": "doc_stage11_debug",
        "title": "Lộ Trình Bước 11: Debug Thực Tế & Thiết Bị Đo Kiểm Phòng Lab",
        "category": "Lộ Trình 11",
        "tags": [
            "#LộTrình",
            "#Bước11",
            "#Debugging",
            "#LogicAnalyzer",
            "#GuruMeditation",
            "#GDB",
            "#JTAG"
        ],
        "date": "26/09/2026",
        "words": 2600,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: KHI LỆNH PRINTF TRỞ NÊN BẤT LỰC!\nTrong lập trình vi điều khiển, có 3 tình huống mà lệnh in log `printf` hoàn toàn vô dụng:\n1. **Chip bị Crash sập nguồn ngay lập tức:** Khi CPU gặp lỗi ngoại lệ nghiêm trọng (Panic), thiết bị sập nguồn trước khi byte dữ liệu nào kịp truyền qua cổng Serial.\n2. **Lỗi tranh chấp thời gian (Timing Violation / Heisenbug):** Lệnh `printf` gửi dữ liệu qua UART tốc độ chậm, việc chèn `printf` làm chậm thời gian thực thi của hàm, vô tình làm biến mất lỗi tranh chấp luồng (Race Condition). Khi bạn xóa `printf` đi, lỗi lại lập tức xuất hiện!\n3. **Lỗi vật lý đường truyền (Signal Integrity):** Dây cáp I2C bị chập chờn hoặc thiếu điện trở kéo lên; `printf` không thể cho bạn biết dạng sóng điện áp thực tế trên dây đang méo mó như thế nào.\n\n✅ **Vũ khí của kỹ sư nhúng chuyên nghiệp:**\n- Máy phân tích logic phần cứng (**Logic Analyzer**).\n- Kỹ thuật giải mã bản ghi tử thần (**Guru Meditation Crash Dump Decoding**).\n- Giao diện gỡ lỗi phần cứng qua cổng **JTAG / OpenOCD**.\n\n---\n\n### 📌 2. SỬ DỤNG MÁY PHÂN TÍCH LOGIC (SALEAE / PULSEVIEW) BẮT GÓI TIN\nMột chiếc máy phân tích logic 8 kênh 24MHz (giá thành rất rẻ) là thiết bị không thể thiếu trên bàn làm việc của kỹ sư nhúng:\n- Kẹp 2 que đo vào 2 chân **SCL (Clock)** và **SDA (Data)** của bus I2C.\n- Mở phần mềm mã nguồn mở **PulseView** và thêm bộ giải mã giao thức (Protocol Decoder: I2C).\n- **Những lỗi vật lý bạn sẽ phát hiện được ngay lập tức:**\n  + **Thiếu điện trở kéo lên Pull-up 4.7k:** Dạng sóng vuông bị vát tròn thành hình tam giác khiến chip không thể nhận diện được bit 1 logic.\n  + **Cảm biến gửi cờ NACK (Not Acknowledge):** Cảm biến từ chối trả lời do sai địa chỉ Slave Address hoặc chưa được cấp nguồn.\n  + **Xung nhiễu Glitch:** Các xung nhọn điện áp ngắn vài nano-giây do động cơ gây ra làm sai lệch dữ liệu.\n\n---\n\n### 📌 3. GIẢI MÃ GURU MEDITATION CRASH DUMP TRONG 5 GIÂY\nKhi ESP32 bị sập nguồn, màn hình Serial in ra một bản Crash Dump chứa các thanh ghi CPU:\n```text\nGuru Meditation Error: Core 1 panic'ed (LoadProhibited). Exception was unhandled.\nCore 1 register dump:\nPC      : 0x4200b21a  PS      : 0x00060830  A0      : 0x8200b345  A1      : 0x3ffb6120\nEXCVADDR: 0x00000000\n```\n\n#### Các Bước Giải Mã Nhanh:\n1. **Đọc mã lỗi Panic:** `LoadProhibited` kết hợp `EXCVADDR: 0x00000000` nghĩa là mã nguồn đã cố đọc dữ liệu từ **con trỏ NULL**!\n2. **Định vị dòng code gây lỗi bằng công cụ addr2line:**\n   Lấy địa chỉ của thanh ghi con trỏ lệnh **PC (Program Counter: `0x4200b21a`)** và chạy lệnh sau trên Terminal máy tính:\n   ```bash\n   xtensa-esp32s3-elf-addr2line -pfia -e build/my_firmware.elf 0x4200b21a\n   ```\n   Màn hình lập tức in ra chính xác:\n   ```text\n   0x4200b21a: process_sensor_stream at main/sensor_app.c:142\n   ```\n   Bạn tìm ra chính xác dòng 142 trong file `sensor_app.c` là thủ phạm chỉ trong vòng đúng 5 giây mà không cần đoán mò!\n\n---\n\n### 📌 4. BẢNG TRA CỨU CÁC MÃ LỖI PANIC KINH ĐIỂN\n- **LoadProhibited / StoreProhibited:** Cố đọc hoặc ghi vào vùng nhớ không được phép (con trỏ NULL hoặc trỏ ra ngoài vùng RAM hợp lệ).\n- **IntegerDivideByZero:** Phép chia cho số 0.\n- **LoadStoreAlignment:** Ép con trỏ mảng byte lẻ sang con trỏ 32-bit (hoặc Tensor Arena thiếu `alignas(16)`).\n- **InterruptWatchdog:** Một hàm ngắt ISR chạy quá lâu hoặc quên cờ `IRAM_ATTR`.\n- **UnhandledDebugException:** Tràn ngăn xếp Stack Overflow làm ghi đè vùng nhớ lân cận.\n\n---\n\n### 📌 5. DEBUG PHẦN CỨNG CHUẨN JTAG VỚI OPEN_OCD VÀ GDB\nESP32-S3 tích hợp sẵn bộ chuyển đổi USB-JTAG phần cứng bên trong chip:\n- Chỉ cần cắm cáp USB vào cổng D+/D- là có thể kết nối trực tiếp với OpenOCD và GDB.\n- **Tính năng vượt trội so với printf:**\n  + Đặt **Hardware Breakpoints**: Dừng CPU tại một dòng code bất kỳ để soi trực tiếp giá trị các biến và thanh ghi.\n  + Đặt **Watchpoints**: Dừng CPU ngay lập tức khi có một tác vụ nào đó cố tình ghi đè vào một ô nhớ cụ thể trong RAM (cực kỳ hữu ích để bắt lỗi con trỏ ghi đè lung tung).\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [ESP-IDF JTAG Debugging Guide: OpenOCD & GDB on ESP32-S3](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-guides/jtag-debugging/index.html) - Hướng dẫn thiết lập USB-JTAG tích hợp phần cứng để bắt lỗi từng dòng mã nguồn.\n- 🌐 [ESP-IDF Fatal Errors and Guru Meditation Debugging](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-guides/fatal-errors.html) - Phương pháp giải mã thanh ghi máy tính (PC, EXCVADDR, Backtrace) khi xảy ra lỗi nghiêm trọng.\n- 📖 [OpenOCD User's Guide (Official Manual)](https://openocd.org/doc/html/index.html) - Tài liệu hướng dẫn sử dụng phần mềm gỡ lỗi mã nguồn mở Open On-Chip Debugger."
    },
    {
        "id": "doc_stage12_misra",
        "title": "Lộ Trình Bước 12: Chuẩn An Toàn Phần Mềm Ô Tô & Hàng Không (MISRA C:2012)",
        "category": "Lộ Trình 12",
        "tags": [
            "#LộTrình",
            "#Bước12",
            "#MISRA",
            "#Automotive",
            "#Safety",
            "#StaticAnalysis",
            "#ISO26262"
        ],
        "date": "26/09/2026",
        "words": 2650,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: TIÊU CHUẨN AN TOÀN SINH TỬ MISRA C:2012\nTrong ngành công nghiệp ô tô (VinFast, Bosch, Continental, Aptiv), hàng không vũ trụ và thiết bị y tế:\n- Một lỗi phần mềm làm sập vi điều khiển của hệ thống phanh ABS, túi khí ô tô hoặc máy thở y tế có thể cướp đi sinh mạng của con người.\n- Ngôn ngữ C nguyên thủy được thiết kế vào thập niên 1970 với ưu tiên hàng đầu là tốc độ và sự linh hoạt tối đa cho lập trình viên. Ngôn ngữ C chấp nhận nhiều vùng hành vi không xác định (Undefined Behaviors), ép kiểu ngầm định và không có cơ chế tự kiểm tra mảng.\n- **MISRA C:2012 (Motor Industry Software Reliability Association)** là bộ tiêu chuẩn quốc tế gồm hơn 140 quy tắc khắt khe nhằm loại bỏ hoàn toàn các cấu trúc nguy hiểm của ngôn ngữ C, đảm bảo phần mềm hoạt động ổn định và tin cậy tuyệt đối.\n\n---\n\n### 📌 2. 5 NGUYÊN TẮC BẤT DI BẤT DỊCH CỦA CHUẨN MISRA C\n1. **Nghiêm Cấm Cấp Phát Động Trong Runtime (MISRA Rule 21.3):**\n   Sau giai đoạn khởi tạo ban đầu, nghiêm cấm tuyệt đối việc sử dụng các hàm `malloc()`, `calloc()`, `realloc()` và `free()`. Toàn bộ mảng đệm và mô hình AI phải được cấp phát tĩnh để loại trừ 100% rủi ro phân mảnh Heap và lỗi hết bộ nhớ OOM Crash.\n2. **Cấm Đệ Quy (Recursion) Và Cấm Câu Lệnh Goto (MISRA Rule 17.2 & 15.1):**\n   Hàm đệ quy làm cho độ sâu của ngăn xếp Stack không thể dự đoán được từ trước, dễ dẫn đến tràn Stack sập nguồn. Không có đệ quy, độ sâu ngăn xếp là cố định và có thể tính toán được (Static Stack Bounding).\n3. **Bắt Buộc Sử Dụng Kiểu Dữ Liệu Có Độ Rộng Cố Định (stdint.h):**\n   Nghiêm cấm dùng các kiểu nguyên thủy như `int`, `long`, `short`, `char` trần trụi vì kích thước của chúng thay đổi tùy theo từng vi xử lý. Luôn sử dụng tường minh: `uint8_t`, `int16_t`, `uint32_t`.\n4. **Cấm Ép Kiểu Con Trỏ Ngầm Định (MISRA Rule 11.3):**\n   Không được ép kiểu tùy tiện giữa các con trỏ kiểu dữ liệu khác nhau để tránh lỗi ngoại lệ căn lề phần cứng.\n5. **Mọi Khối Lệnh Điều Kiện Phải Có Ngoặc Nhọn (MISRA Rule 15.6):**\n   Ngay cả khi câu lệnh `if` chỉ có đúng 1 dòng code, vẫn bắt buộc phải bao bọc trong cặp ngoặc nhọn `{ }` để phòng chống lỗi logic kinh điển kiểu `goto fail` của Apple.\n\n---\n\n### 📌 3. TÍCH HỢP CÔNG CỤ PHÂN TÍCH TĨNH TỰ ĐỘNG (STATIC CODE ANALYSIS)\nKỹ sư chuyên nghiệp không kiểm tra chuẩn MISRA bằng mắt thường. Họ tích hợp các công cụ phân tích mã nguồn tĩnh vào quy trình biên dịch:\n- **Cppcheck:** Công cụ mã nguồn mở mạnh mẽ giúp quét toàn bộ dự án để tìm các lỗi: rò rỉ bộ nhớ, biến chưa khởi tạo, mảng vượt quá chỉ số (Array Out of Bounds) và vi phạm quy tắc MISRA.\n- **Clang-Tidy:** Tích hợp trực tiếp vào trình biên dịch Clang/LLVM để tự động cảnh báo và đề xuất sửa lỗi theo chuẩn hiện đại.\n\n---\n\n### 📌 4. MÃ NGUỒN C MẪU TUÂN THỦ NGHIÊM NGẶT CHUẨN MISRA C:2012\n```c\n#include <stdint.h>\n#include <stdbool.h>\n#include \"esp_err.h\"\n\n#define MAX_CAN_FRAME_LEN (8U) // Luôn có hậu tố U cho số nguyên không dấu\n\n// 1. Cấp phát tĩnh cố định - Không dùng malloc (Rule 21.3)\ntypedef struct {\n    uint32_t id;\n    uint8_t  len;\n    uint8_t  payload[MAX_CAN_FRAME_LEN];\n} SafeCanMessage_t;\n\n// 2. Hàm kiểm tra hợp lệ toàn diện đầu vào và trả về mã lỗi rõ ràng\nesp_err_t enqueue_can_message(const SafeCanMessage_t * const msg) {\n    // Kiểm tra con trỏ khác NULL (Phòng chống Crash)\n    if (msg == NULL) {\n        return ESP_ERR_INVALID_ARG;\n    }\n\n    // Kiểm tra độ dài hợp lệ (Phòng chống Buffer Overflow)\n    if (msg->len > MAX_CAN_FRAME_LEN) {\n        return ESP_ERR_INVALID_SIZE;\n    }\n\n    // Luôn sử dụng ngoặc nhọn { } ngay cả với lệnh đơn\n    for (uint8_t i = 0U; i < msg->len; i++) {\n        process_can_byte(msg->payload[i]);\n    }\n\n    return ESP_OK;\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [MISRA Official Portal: MISRA C:2012 Guidelines](https://www.misra.org.uk/) - Cổng thông tin chính thức của Hiệp hội Công nghiệp Đảm bảo Độ tin cậy Động cơ (Motor Industry Reliability Association).\n- 📄 [ISO 26262-6:2018 - Road Vehicles Functional Safety (Software Level)](https://www.iso.org/standard/68383.html) - Tiêu chuẩn an toàn chức năng phương tiện đường bộ quốc tế.\n- 🐙 [GitHub: Cppcheck Static Analysis Tool](https://github.com/danmar/cppcheck) - Công cụ mã nguồn mở kiểm tra quy tắc cú pháp MISRA C tự động trong quy trình phát triển firmware."
    },
    {
        "id": "doc_stage13_canbus",
        "title": "Lộ Trình Bước 13: Giao Tiếp Công Nghiệp (CAN Bus & Modbus)",
        "category": "Lộ Trình 13",
        "tags": [
            "#LộTrình",
            "#Bước13",
            "#CANBus",
            "#TWAI",
            "#RS485",
            "#Modbus",
            "#Automotive",
            "#Differential"
        ],
        "date": "26/09/2026",
        "words": 2650,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO Ô TÔ VÀ NHÀ MÁY DÙNG CAN BUS & RS485?\nTrong môi trường công nghiệp hoặc dưới nắp capo xe ô tô với động cơ công suất hàng chục Kilowatt và tia lửa bu-gi đánh lửa:\n- Nhiễu điện từ trường (Electromagnetic Interference - EMI) cực kỳ khủng khiếp.\n- Nếu bạn sử dụng dây UART hoặc I2C thông thường kéo dài 2 mét, các xung nhiễu điện áp sẽ làm biến dạng hoàn toàn dữ liệu.\n- ✅ **Nguyên Lý Tín Hiệu Vi Sai (Differential Signaling):**\n  CAN Bus (cặp dây CAN_High, CAN_Low) và RS485 (cặp dây A, B) truyền dữ liệu bằng **hiệu điện thế giữa 2 dây cáp xoắn đôi** thay vì so sánh điện áp với dây Mass đất (GND).\n  Khi có tia lửa điện hoặc xung nhiễu đánh vào dây cáp, nó tác động giống hệt nhau lên cả 2 dây (Common-mode Noise). Bộ thu ở đầu cuối chỉ đo hiệu số:\n  $V_{diff} = V_{CANH} - V_{CANL}$\n  Toàn bộ tiếng ồn nhiễu bị triệt tiêu hoàn toàn về số 0! Tín hiệu có thể truyền xa hàng trăm mét với độ tin cậy tuyệt đối.\n\n---\n\n### 📌 2. GIAO THỨC CAN BUS 2.0B (TWAI TRÊN ESP32-S3)\nTrên ESP32-S3, bộ điều khiển CAN Bus được gọi là **TWAI (Two-Wire Automotive Interface)**:\n- Tương thích 100% với chuẩn quốc tế CAN 2.0B với tốc độ truyền lên tới 1 Mbps.\n- **Cơ Chế Trọng Tài Không Phá Hủy (Non-destructive Bitwise Arbitration):**\n  Nhiều hộp đen ECU trên xe có thể cùng phát dữ liệu lên bus cùng một lúc. Trên đường bus CAN, bit 0 là bit lấn át (Dominant), bit 1 là bit bị lấn át (Recessive). Gói tin nào có **CAN ID nhỏ hơn** sẽ giành quyền truyền trước mà không làm hỏng dữ liệu của bất kỳ nút mạng nào!\n\n#### Bộ Lọc Phần Cứng Acceptance Filter (Code & Mask):\nMột chiếc xe hơi có hàng trăm gói tin chạy trên bus mỗi giây. Nếu gói tin nào cũng gọi ngắt CPU, chip sẽ bị quá tải:\n- Bộ lọc phần cứng cho phép cài đặt 2 thanh ghi: **Acceptance Code** và **Acceptance Mask**.\n- Phần cứng TWAI tự động so khớp ID gói tin với mặt nạ. Nếu gói tin không thuộc danh sách cần quan tâm, phần cứng **tự động vứt bỏ ngay trên đường truyền mà không tiêu tốn 1 chu kỳ lệnh CPU nào**!\n\n---\n\n### 📌 3. GIAO THỨC MODBUS RTU QUA CHUẨN VẬT LÝ RS485\nModbus RTU là ngôn ngữ chung của thế giới tự động hóa công nghiệp (PLC, Biến tần, Đồng hồ đo điện năng):\n- **Mô hình Master-Slave:** Vi điều khiển ESP32 đóng vai trò Master, định kỳ gửi bản tin truy vấn đến các Slave (ID từ 1 đến 247).\n- **Mã kiểm tra lỗi CRC-16:** Mỗi bản tin Modbus kết thúc bằng 2 byte mã kiểm tra dư thừa tuần hoàn (Cyclic Redundancy Check) CRC-16, đảm bảo phát hiện 99.999% các lỗi truyền dẫn trên đường dây cáp dài.\n\n---\n\n### 📌 4. MÃ NGUỒN C MẪU ĐẠT CHUẨN SẢN XUẤT\n```c\n#include \"driver/twai.h\"\n#include \"esp_log.h\"\n\nstatic const char *TAG = \"CAN_TWAI\";\n\nvoid init_automotive_can_bus(void) {\n    // 1. Cấu hình chân phần cứng (TX = GPIO4, RX = GPIO5)\n    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(GPIO_NUM_4, GPIO_NUM_5, TWAI_MODE_NORMAL);\n\n    // 2. Cài đặt tốc độ Baud 500 Kbps (Chuẩn mạng động cơ ô tô)\n    twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();\n\n    // 3. Cấu hình bộ lọc phần cứng chỉ nhận các thông điệp khẩn cấp (ID: 0x100 đến 0x10F)\n    twai_filter_config_t f_config = {\n        .acceptance_code = (0x100 << 21),\n        .acceptance_mask = ~(0x00F << 21),\n        .single_filter = true,\n    };\n\n    // 4. Khởi chạy Driver\n    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));\n    ESP_ERROR_CHECK(twai_start());\n    ESP_LOGI(TAG, \"CAN Bus TWAI đã kích hoạt thành công!\");\n}\n\nvoid send_engine_speed_frame(int16_t rpm) {\n    twai_message_t msg = {\n        .identifier = 0x105, // ID cảnh báo tốc độ vòng tua\n        .data_length_code = 2,\n        .data = { (uint8_t)(rpm >> 8), (uint8_t)(rpm & 0xFF) },\n        .flags = TWAI_MSG_FLAG_NONE,\n    };\n    twai_transmit(&msg, pdMS_TO_TICKS(20));\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [ISO 11898-1:2015 - Controller Area Network (CAN) Data Link Layer](https://www.iso.org/standard/63648.html) - Tiêu chuẩn quốc tế về tầng liên kết dữ liệu và báo hiệu vật lý mạng CAN Bus.\n- 🌐 [ESP-IDF Two-Wire Automotive Interface (TWAI) Driver Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/peripherals/twai.html) - Hướng dẫn chi tiết cấu hình giao diện CAN 2.0B trên vi điều khiển ESP32-S3.\n- 📄 [Bosch CAN Specification Version 2.0 (Robert Bosch GmbH)](https://www.cs.cmu.edu/~koopman/des_s99/can/) - Tài liệu gốc phát minh giao thức CAN của tập đoàn Robert Bosch.\n- 🌐 [Modbus Organization: Modbus Application Protocol Specification v1.1b3](https://modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf) - Đặc tả giao thức chuẩn kết nối công nghiệp RS-485 Modbus RTU."
    },
    {
        "id": "doc_stage14_unittest",
        "title": "Lộ Trình Bước 14: Unit Test Tự Động & CI/CD Firmware",
        "category": "Lộ Trình 14",
        "tags": [
            "#LộTrình",
            "#Bước14",
            "#UnitTest",
            "#Unity",
            "#CMock",
            "#CICD",
            "#DevOps",
            "#Automation"
        ],
        "date": "26/09/2026",
        "words": 2700,
        "isNativePdf": false,
        "content": "### 📌 1. BẢN CHẤT CỐT LÕI: BƯỚC CHUYỂN MÌNH SANG KỸ SƯ CHUYÊN NGHIỆP\nSự khác biệt lớn nhất giữa một người lập trình nhúng nghiệp dư và một kỹ sư chuyên nghiệp tại các tập đoàn công nghệ lớn:\n- **Người nghiệp dư:** Viết code xong nạp trực tiếp vào mạch phần cứng, dùng mắt nhìn xem đèn LED có chớp tắt không. Khi dự án lớn lên hàng trăm file, việc sửa một hàm ở chỗ này có thể vô tình làm hỏng một tính năng ở chỗ khác (Hồi quy lỗi - Regression Bug) mà hoàn toàn không hề hay biết!\n- **Kỹ sư chuyên nghiệp:** Thiết kế mã nguồn độc lập phần cứng (**Hardware Abstraction Layer - HAL**), viết hàng trăm kịch bản kiểm thử tự động (**Unit Test**) chạy trực tiếp trên máy tính phát triển chỉ trong 3 giây.\n- **Tự động hóa CI/CD:** Mỗi khi bạn thực hiện lệnh `git push` lên GitHub, máy chủ đám mây tự động kích hoạt container Linux để biên dịch firmware, quét lỗi tĩnh và chạy toàn bộ Unit Test. Nếu có lỗi, hệ thống lập tức báo đỏ từ chối sáp nhập code!\n\n---\n\n### 📌 2. THIẾT KẾ PHẦN CỨNG TRỪU TƯỢNG (HAL) ĐỂ MOCK TRÊN MÁY TÍNH\nLàm thế nào để chạy kiểm thử một thuật toán phát hiện rung động hỏng hóc trên máy tính PC x86 khi không cắm chip ESP32 và cảm biến MPU6050?\n- **Giải pháp:** Tách biệt hoàn toàn tầng Logic xử lý và tầng Driver phần cứng thông qua con trỏ hàm:\n```c\n// Interface đọc cảm biến trừu tượng:\ntypedef int16_t (*sensor_read_fn_t)(void);\n\n// Thuật toán nhận con trỏ hàm, hoàn toàn độc lập phần cứng:\nbool check_vibration_alert(sensor_read_fn_t read_fn, int16_t threshold) {\n    int16_t val = read_fn();\n    return (val > threshold);\n}\n```\n- Khi chạy trên vi điều khiển: Ta truyền hàm đọc thanh ghi I2C thật.\n- Khi chạy Unit Test trên máy tính: Framework **CMock** tự động tạo ra một hàm giả lập (Mock Function) bơm các giá trị kiểm thử giả định vào để kiểm tra tính đúng đắn của thuật toán!\n\n---\n\n### 📌 3. VIẾT UNIT TEST VỚI FRAMEWORK UNITY\nUnity là framework kiểm thử mã nguồn C chuẩn công nghiệp được sử dụng rộng rãi trong các dự án nhúng toàn cầu:\n```c\n#include \"unity.h\"\n\nvoid setUp(void) {}\nvoid tearDown(void) {}\n\nvoid test_quantization_formula(void) {\n    // Kiểm tra công thức ánh xạ INT8: Float 0.0f phải ánh xạ về Zero-point\n    float real_val = 0.0f;\n    float scale = 0.05f;\n    int8_t zero_point = -10;\n    \n    int8_t q = (int8_t)(roundf(real_val / scale) + zero_point);\n    TEST_ASSERT_EQUAL_INT8(-10, q);\n}\n\nvoid test_filter_noise_suppression(void) {\n    // Kiểm tra bộ lọc thông thấp làm mịn xung nhiễu\n    float output = apply_ema_filter(100.0f, 0.0f, 0.2f);\n    TEST_ASSERT_FLOAT_WITHIN(0.01f, 20.0f, output);\n}\n\nint main(void) {\n    UNITY_BEGIN();\n    RUN_TEST(test_quantization_formula);\n    RUN_TEST(test_filter_noise_suppression);\n    return UNITY_END();\n}\n```\n\n---\n\n### 📌 4. THIẾT LẬP ĐƯỜNG ỐNG CI/CD VỚI GITHUB ACTIONS\nTạo file cấu hình `.github/workflows/firmware_ci.yml` trong thư mục dự án:\n```yaml\nname: Firmware Automated CI\non: [push, pull_request]\n\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout Code\n        uses: actions/checkout@v3\n\n      - name: Quét lỗi tĩnh mã nguồn (Cppcheck)\n        run: |\n          sudo apt-get install -y cppcheck\n          cppcheck --enable=all --error-exitcode=1 main/\n\n      - name: Chạy Unit Test tự động trên Host PC\n        run: |\n          gcc test/test_algo.c src/algo.c -Iinclude -lunity -o run_tests\n          ./run_tests\n\n      - name: Biên dịch tự động nhị phân ESP-IDF\n        uses: espressif/esp-idf-ci-action@v1\n        with:\n          esp_idf_version: v5.1\n          target: esp32s3\n          path: '.'\n```\nMỗi khi bạn đẩy code lên GitHub, toàn bộ quy trình kiểm định chất lượng sẽ diễn ra hoàn toàn tự động, đảm bảo mã nguồn dự án luôn đạt độ ổn định và chuyên nghiệp cao nhất!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🐙 [GitHub: ThrowTheSwitch Unity Unit Test Framework for C](https://github.com/ThrowTheSwitch/Unity) - Framework kiểm thử đơn vị mã nguồn C chuẩn công nghiệp chuyên biệt cho hệ thống nhúng.\n- 🐙 [GitHub: ThrowTheSwitch CMock - Automated Mock Generator](https://github.com/ThrowTheSwitch/CMock) - Công cụ tự động phân tích header file và tạo hàm giả lập (Mocking) phần cứng.\n- 📚 Sách chuyên khảo: *\"Test-Driven Development for Embedded C\"* (James W. Grenning, The Pragmatic Programmers) - Phương pháp lập trình hướng kiểm thử cho kỹ sư nhúng chuyên nghiệp.\n- 🐙 [GitHub: Espressif esp-idf-ci-action for GitHub Actions](https://github.com/espressif/esp-idf-ci-action) - GitHub Action chính thức từ Espressif tự động hóa biên dịch firmware trên đám mây."
    }
];

// Khởi tạo state và tự động gộp / cập nhật các tài liệu lý thuyết lộ trình mới
let notebookDocs = JSON.parse(localStorage.getItem(STORAGE_NOTEBOOK_DOCS)) || [];
if (notebookDocs.length === 0) {
    notebookDocs = [...defaultNotebookDocs];
} else {
    // Tự động bổ sung hoặc đồng bộ cập nhật tài liệu chuẩn hệ thống
    defaultNotebookDocs.forEach(defDoc => {
        const existingIdx = notebookDocs.findIndex(d => d.id === defDoc.id);
        if (existingIdx === -1) {
            notebookDocs.push(defDoc);
        } else {
            // Cập nhật nội dung tài liệu hệ thống lên bản mới nhất
            notebookDocs[existingIdx].title = defDoc.title;
            notebookDocs[existingIdx].category = defDoc.category;
            notebookDocs[existingIdx].tags = defDoc.tags;
            notebookDocs[existingIdx].content = defDoc.content;
            notebookDocs[existingIdx].words = defDoc.words;
        }
    });
}
localStorage.setItem(STORAGE_NOTEBOOK_DOCS, JSON.stringify(notebookDocs));

const ROADMAP_STAGE_DOC_IDS = [
    "doc_stage1_memory",
    "doc_stage2_timer",
    "doc_stage3_sensors",
    "doc_stage4_freertos",
    "doc_stage5_network",
    "doc_stage6_tinyml",
    "doc_stage7_lowpower",
    "doc_stage8_capstone",
    "doc_stage9_c_interview",
    "doc_stage10_baremetal",
    "doc_stage11_debug",
    "doc_stage12_misra",
    "doc_stage13_canbus",
    "doc_stage14_unittest"
];

let geminiApiKey = localStorage.getItem(STORAGE_GEMINI_KEY) || "";
let selectedDocId = "all";
let activeTagFilter = "all";
let currentChatPdfAttachment = null;
let pendingModalPdf = null;

// Theo dõi mức sử dụng Gemini API trong ngày
const todayUsageStr = new Date().toLocaleDateString('vi-VN');
let geminiUsage = JSON.parse(localStorage.getItem(STORAGE_GEMINI_USAGE)) || {
    date: todayUsageStr,
    requestsToday: 0,
    tokensToday: 0,
    lastRequestTime: null
};
if (geminiUsage.date !== todayUsageStr) {
    geminiUsage.date = todayUsageStr;
    geminiUsage.requestsToday = 0;
    geminiUsage.tokensToday = 0;
    geminiUsage.lastRequestTime = null;
    localStorage.setItem(STORAGE_GEMINI_USAGE, JSON.stringify(geminiUsage));
}

let notebookChatHistory = JSON.parse(localStorage.getItem(STORAGE_NOTEBOOK_CHAT)) || [
    {
        role: "ai",
        text: `Chào Kỹ sư **Mr. Thai**! Tôi là **Trợ Lý Tài Liệu Nhúng & Edge AI (Doc AI)**.\n\n🔥 **Chế độ đa năng**: Tôi hỗ trợ phân tích chuyên sâu về **Con Trỏ C, Quản Lý Bộ Nhớ ESP32-S3, Ngắt ISR, FreeRTOS và TinyML**.\n- Bạn có thể đặt câu hỏi về bất kỳ khái niệm lý thuyết hay mã nguồn C nào ngay cả khi **ngoại tuyến** (nhờ Động cơ tri thức nhúng cục bộ).\n- Khi cấu hình **Google Gemini API Key** (nút ⚙️ Cấu Hình Key), tôi sẽ kết nối trực tiếp với **Gemini 2.0 Flash** để đọc hiểu toàn bộ file PDF nguyên bản với đầy đủ sơ đồ và bảng thanh ghi!\n\nHãy chọn một tài liệu bên trái hoặc đặt câu hỏi về con trỏ, mảng, bộ nhớ bất kỳ lúc nào!`
    }
];

// ==========================================
// RENDER GIAO DIỆN CHÍNH & DUAL-MODE (READER / CHAT)
// ==========================================
let notebookRightMode = 'reader'; // Mặc định mở chế độ Đọc Giáo Trình

function setNotebookRightMode(mode) {
    notebookRightMode = mode;
    const tabReader = document.getElementById("nb-tab-reader");
    const tabChat = document.getElementById("nb-tab-chat");
    const readerView = document.getElementById("nb-doc-reader-view");
    const chatView = document.getElementById("nb-doc-chat-view");
    const btnAskAi = document.getElementById("nb-btn-ask-ai-from-reader");
    const btnClearChat = document.getElementById("nb-btn-clear-chat");

    if (mode === 'reader') {
        if (tabReader) tabReader.classList.add("active");
        if (tabChat) tabChat.classList.remove("active");
        if (readerView) readerView.style.display = "flex";
        if (chatView) chatView.style.display = "none";
        if (btnAskAi) btnAskAi.style.display = "inline-flex";
        if (btnClearChat) btnClearChat.style.display = "none";
        renderNotebookDocReader(selectedDocId);
    } else {
        if (tabReader) tabReader.classList.remove("active");
        if (tabChat) tabChat.classList.add("active");
        if (readerView) readerView.style.display = "none";
        if (chatView) chatView.style.display = "flex";
        if (btnAskAi) btnAskAi.style.display = "none";
        if (btnClearChat) btnClearChat.style.display = "inline-flex";
        const msgContainer = document.getElementById("nb-chat-messages-container");
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    }
}

function renderNotebookView() {
    renderNotebookDocsList();
    renderNotebookChat();
    updateGeminiKeyStatus();
    updateGeminiQuotaDisplay();
    setNotebookRightMode(notebookRightMode);
}

function updateGeminiQuotaDisplay() {
    const reqEl = document.getElementById("nb-quota-req-text");
    const tokEl = document.getElementById("nb-quota-tok-text");
    const barEl = document.getElementById("nb-quota-progress-bar");
    if (!reqEl || !barEl) return;

    const maxRequests = 1500;
    const reqCount = geminiUsage.requestsToday || 0;
    const tokensCount = geminiUsage.tokensToday || 0;
    const percent = Math.min(100, ((reqCount / maxRequests) * 100)).toFixed(1);

    reqEl.innerText = `${reqCount.toLocaleString()} / 1,500 Lượt (${percent}%)`;
    
    if (tokEl) {
        if (tokensCount >= 1000000) {
            tokEl.innerText = `${(tokensCount / 1000000).toFixed(2)}M Tokens`;
        } else if (tokensCount >= 1000) {
            tokEl.innerText = `${(tokensCount / 1000).toFixed(1)}k Tokens`;
        } else {
            tokEl.innerText = `${tokensCount} Tokens`;
        }
    }

    barEl.style.width = `${Math.max(percent, reqCount > 0 ? 1 : 0)}%`;
    barEl.className = "nb-quota-progress-fill";
    if (percent > 90) {
        barEl.classList.add("danger");
    } else if (percent > 70) {
        barEl.classList.add("warning");
    }
}

function resetGeminiDailyUsage() {
    if (confirm("Bạn có muốn đặt lại bộ đếm số lượt gọi API hôm nay về 0?")) {
        geminiUsage.requestsToday = 0;
        geminiUsage.tokensToday = 0;
        geminiUsage.lastRequestTime = null;
        localStorage.setItem(STORAGE_GEMINI_USAGE, JSON.stringify(geminiUsage));
        updateGeminiQuotaDisplay();
        showToast("Đã đặt lại bộ đếm mức sử dụng API hôm nay!");
    }
}

function updateGeminiKeyStatus() {
    const statusPill = document.getElementById("nb-api-status");
    if (!statusPill) return;

    if (geminiApiKey && geminiApiKey.trim().length > 10) {
        statusPill.innerHTML = `🟢 <span style="color: var(--accent);">Gemini 2.0/2.5 Flash Online</span>`;
        statusPill.title = "Đã kết nối Google Gemini API. Sẵn sàng xử lý tài liệu đa phương thức và PDF nguyên bản.";
    } else {
        statusPill.innerHTML = `⚡ <span style="color: var(--cyan);">Offline Knowledge AI</span>`;
        statusPill.title = "Đang chạy chế độ Động Cơ Tri Thức Nhúng Cục Bộ. Bấm ⚙️ Cấu Hình Key để kích hoạt Cloud Gemini AI.";
    }
}

// ==========================================
// 📖 DOCUMENT READER & HANDS-ON PRACTICE RENDERING
// ==========================================
function renderNotebookDocReader(docId) {
    const readerContainer = document.getElementById("nb-doc-reader-view");
    if (!readerContainer) return;

    let doc = (docId && docId !== 'all') ? notebookDocs.find(d => d.id === docId) : null;
    if (!doc) {
        doc = notebookDocs[0];
    }
    if (!doc) return;

    const catEl = document.getElementById("nb-reader-category");
    if (catEl) catEl.innerText = doc.category || "Tài Liệu Nghiên Cứu";

    const titleEl = document.getElementById("nb-reader-title");
    if (titleEl) titleEl.innerText = (doc.isNativePdf ? "📕 " : "📄 ") + doc.title;

    const tagsEl = document.getElementById("nb-reader-tags");
    if (tagsEl) {
        tagsEl.innerHTML = (doc.tags || []).map(t => `<span class="nb-tag-chip" style="font-size: 10px; padding: 2px 6px;">${t}</span>`).join(' ');
    }

    const statsEl = document.getElementById("nb-reader-stats");
    if (statsEl) {
        const words = doc.words || Math.round((doc.content || '').length / 6);
        const estMins = Math.max(1, Math.round(words / 200));
        statsEl.innerText = `${words.toLocaleString()} từ • ~${estMins} phút đọc`;
    }

    const contentEl = document.getElementById("nb-doc-reader-content");
    if (contentEl) {
        contentEl.innerHTML = formatMarkdownChat(doc.content || "Nội dung tài liệu đang được cập nhật...");
    }

    // Xác định Stage Index của tài liệu này để nạp 12 bài tập C tương ứng
    let stageIdx = 0;
    if (doc.id === "doc_stage1_memory" || doc.id === "doc_c_pointers_deepdive") stageIdx = 0;
    else if (doc.id === "doc_stage2_timer") stageIdx = 1;
    else if (doc.id === "doc_stage3_sensors") stageIdx = 2;
    else if (doc.id === "doc_stage4_freertos") stageIdx = 3;
    else if (doc.id === "doc_stage5_network") stageIdx = 4;
    else if (doc.id === "doc_stage6_tinyml") stageIdx = 5;

    renderReaderPracticeGrid(stageIdx);
}

function renderReaderPracticeGrid(stageIdx) {
    const grid = document.getElementById("nb-reader-practice-grid");
    const subTitle = document.getElementById("nb-reader-practice-sub");
    if (!grid) return;

    if (typeof practiceExercises === 'undefined' || !Array.isArray(practiceExercises)) {
        grid.innerHTML = `<div style="color: var(--text-dim); font-size: 12px;">Đang tải danh sách bài tập...</div>`;
        return;
    }

    const moduleExercises = practiceExercises
        .map((prob, idx) => ({ prob, idx }))
        .filter(item => item.prob.stageIndex === stageIdx);

    if (subTitle) {
        subTitle.innerText = `Làm ngay 12 bài tập C của Module ${stageIdx + 1} để biến lý thuyết vừa học thành kỹ năng lập trình nhúng thực tế:`;
    }

    const solvedList = (typeof profile !== 'undefined' && profile.solvedProblems) ? profile.solvedProblems : [];

    grid.innerHTML = "";
    moduleExercises.forEach(({ prob, idx }) => {
        const isSolved = solvedList.includes(prob.id);
        const card = document.createElement("div");
        card.className = `nb-reader-practice-card ${isSolved ? 'solved' : ''}`;

        let diffClass = "diff-easy";
        if (prob.difficulty === "Trung bình") diffClass = "diff-med";
        else if (prob.difficulty === "Nâng cao") diffClass = "diff-hard";

        const shortDesc = (prob.desc || '').replace(/<[^>]*>/g, '').substring(0, 90) + '...';

        card.innerHTML = `
            <div class="nb-reader-card-top">
                <div class="nb-reader-card-title">${prob.title}</div>
                <span style="font-size: 13px;" title="${isSolved ? 'Đã hoàn thành' : 'Chưa hoàn thành'}">${isSolved ? '✅' : '⚪'}</span>
            </div>
            <div class="nb-reader-card-meta">
                <span class="difficulty-tag ${diffClass}" style="font-size: 9.5px; padding: 1px 5px;">${prob.difficulty}</span>
                <span style="color: var(--gold); font-family: 'JetBrains Mono', monospace; font-size: 11px;">+${prob.xp} XP</span>
            </div>
            <div style="font-size: 11.5px; color: var(--text-muted); line-height: 1.45;">
                ${escapeHtml(shortDesc)}
            </div>
            <div style="margin-top: 6px; display: flex; justify-content: flex-end;">
                <button type="button" class="btn-reader-do-problem" onclick="openPracticeProblem(${idx})">
                    <span>${isSolved ? '↺ Làm lại' : '💻 Làm bài này'}</span> ➔
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function askAiAboutCurrentDoc() {
    let doc = (selectedDocId && selectedDocId !== 'all') ? notebookDocs.find(d => d.id === selectedDocId) : null;
    if (!doc) doc = notebookDocs[0];
    setNotebookRightMode('chat');
    const input = document.getElementById("nb-chat-input");
    if (input && doc) {
        input.value = `Hãy phân tích chuyên sâu nội dung tài liệu "${doc.title}". Những bản chất phần cứng ESP32 và các bài tập lập trình C quan trọng nhất cần nắm vững là gì?`;
        input.focus();
    }
    showToast(`🤖 Đã nạp yêu cầu phân tích "${doc ? doc.title : 'tài liệu'}" cho Gemini!`);
}

function scrollToPracticeInReader() {
    const sec = document.getElementById("nb-reader-practice-section");
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openPracticeForCurrentDocModule() {
    let doc = (selectedDocId && selectedDocId !== 'all') ? notebookDocs.find(d => d.id === selectedDocId) : null;
    if (!doc) doc = notebookDocs[0];
    let stageIdx = 0;
    if (doc.id === "doc_stage1_memory" || doc.id === "doc_c_pointers_deepdive") stageIdx = 0;
    else if (doc.id === "doc_stage2_timer") stageIdx = 1;
    else if (doc.id === "doc_stage3_sensors") stageIdx = 2;
    else if (doc.id === "doc_stage4_freertos") stageIdx = 3;
    else if (doc.id === "doc_stage5_network") stageIdx = 4;
    else if (doc.id === "doc_stage6_tinyml") stageIdx = 5;

    if (typeof setModuleFilter === 'function') {
        setModuleFilter(String(stageIdx));
    }
    if (typeof switchTab === 'function') {
        switchTab('practice');
    }
    showToast(`🎯 Đã mở danh sách 12 bài tập C của Module ${stageIdx + 1}`);
}

function renderNotebookDocsList() {
    const container = document.getElementById("nb-doc-list-container");
    if (!container) return;

    const searchTerm = (document.getElementById("nb-doc-search")?.value || "").toLowerCase().trim();

    let filtered = notebookDocs.filter(d => {
        const matchesTag = activeTagFilter === "all" || (d.tags && d.tags.includes(activeTagFilter));
        const matchesSearch = !searchTerm || 
            d.title.toLowerCase().includes(searchTerm) || 
            (d.content && d.content.toLowerCase().includes(searchTerm)) ||
            (d.category && d.category.toLowerCase().includes(searchTerm));
        return matchesTag && matchesSearch;
    });

    const docCountBadge = document.getElementById("nb-doc-count-badge");
    if (docCountBadge) docCountBadge.innerText = `${notebookDocs.length} Tài liệu (${filtered.length} hiển thị)`;

    const tabBadge = document.getElementById("tab-notebook-count");
    if (tabBadge) tabBadge.innerText = `${notebookDocs.length} Doc`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 13px;">
                Không tìm thấy tài liệu phù hợp.<br>
                <button class="btn btn-secondary" style="margin-top: 10px;" onclick="openImportNotebookModal()">
                    + Nhập tài liệu từ NotebookLM / PDF
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    // Nút "Tất cả tài liệu"
    const allItem = document.createElement("div");
    allItem.className = `nb-doc-card ${selectedDocId === 'all' ? 'active' : ''}`;
    allItem.onclick = () => selectNotebookDoc('all');
    allItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="nb-doc-card-title">📚 Tất Cả Tài Liệu (Toàn Bộ Sổ Tay)</div>
            <span class="nb-doc-card-badge">TOÀN BỘ</span>
        </div>
        <div class="nb-doc-card-preview">Trợ lý AI sẽ đọc và tổng hợp kiến thức từ toàn bộ ${notebookDocs.length} tài liệu ghi chú & PDF hiện có.</div>
        <div class="nb-doc-card-meta">
            <span>Tổng tài liệu: ${notebookDocs.length}</span>
            <span style="color: var(--cyan);">Tích hợp RAG ⚡</span>
        </div>
    `;
    container.appendChild(allItem);

    filtered.forEach(doc => {
        const card = document.createElement("div");
        card.className = `nb-doc-card ${selectedDocId === doc.id ? 'active' : ''}`;
        card.onclick = () => selectNotebookDoc(doc.id);

        const snippet = (doc.content || '').replace(/[#*`_]/g, '').substring(0, 110) + '...';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                <div class="nb-doc-card-title">
                    ${doc.isNativePdf ? '📕 ' : '📄 '}${escapeHtml(doc.title)}
                </div>
                <button class="btn-icon" style="font-size: 11px; padding: 2px 6px;" onclick="event.stopPropagation(); deleteNotebookDoc('${doc.id}')" title="Xóa tài liệu này">🗑️</button>
            </div>
            <div class="nb-doc-card-preview">${escapeHtml(snippet)}</div>
            <div class="nb-doc-card-meta">
                <span style="display: flex; gap: 4px; align-items: center;">
                    ${doc.isNativePdf ? `<span class="nb-badge-native-pdf">PDF GỐC (${doc.pdfSizeMb || '1'} MB)</span>` : ''}
                    ${(doc.tags || []).map(t => `<span class="nb-tag-chip" style="font-size: 9.5px; padding: 1px 4px;">${t}</span>`).join('')}
                </span>
                <span>${doc.date}</span>
            </div>
        `;
        container.appendChild(card);
    });

    updateChatContextLabel();
}

function selectNotebookDoc(docId) {
    selectedDocId = docId;
    renderNotebookDocsList();
    updateChatContextLabel();
    if (docId !== 'all') {
        renderNotebookDocReader(docId);
        setNotebookRightMode('reader');
    } else {
        renderNotebookDocReader(notebookDocs[0]?.id || "doc_stage1_memory");
        setNotebookRightMode('reader');
    }
}

function setDocTagFilter(tag) {
    activeTagFilter = tag;
    document.querySelectorAll(".nb-tag-chip").forEach(c => {
        if (c.getAttribute("data-tag") === tag) c.classList.add("active");
        else c.classList.remove("active");
    });
    renderNotebookDocsList();
}

function updateChatContextLabel() {
    const label = document.getElementById("nb-chat-context-name");
    if (!label) return;

    if (selectedDocId === 'all') {
        label.innerText = `Toàn bộ kho tài liệu (${notebookDocs.length} bài)`;
    } else {
        const doc = notebookDocs.find(d => d.id === selectedDocId);
        if (doc) {
            label.innerText = doc.isNativePdf ? `📕 PDF Gốc: "${doc.title}"` : `Tài liệu: "${doc.title}"`;
        } else {
            label.innerText = "Tất cả";
        }
    }
}

// ==========================================
// IMPORT & QUẢN LÝ TÀI LIỆU (CÁCH 1 & CÁCH 2)
// ==========================================
function openImportNotebookModal() {
    pendingModalPdf = null;
    const modal = document.getElementById("nb-import-modal");
    if (modal) modal.style.display = "flex";
}

function closeImportNotebookModal() {
    pendingModalPdf = null;
    const modal = document.getElementById("nb-import-modal");
    if (modal) modal.style.display = "none";
}

function handleNotebookFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById("nb-upload-status");
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const titleInput = document.getElementById("nb-import-title");
    if (!titleInput.value) {
        titleInput.value = nameWithoutExt;
    }

    // Xử lý file PDF nguyên bản (Native Multimodal PDF)
    if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
        if (statusEl) {
            statusEl.innerHTML = `⏳ <span style="color: var(--cyan);">Đang đọc file PDF gốc "${file.name}"...</span>`;
        }
        showToast("Đang nạp file PDF gốc...");

        const fileReader = new FileReader();
        fileReader.onload = async function() {
            try {
                const base64Data = this.result.split(',')[1];
                const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

                pendingModalPdf = {
                    fileName: file.name,
                    base64: base64Data,
                    sizeBytes: file.size,
                    sizeMb: sizeMb
                };

                // Trích xuất mẫu một vài trang đầu qua pdf.js để hiển thị preview
                let previewSnippet = `[TÀI LIỆU PDF GỐC MULTIMODAL]: ${file.name} (${sizeMb} MB)\n\nĐã sẵn sàng để Gemini 2.5 Flash đọc nguyên bản (bao gồm toàn bộ bảng thanh ghi, sơ đồ khối, chân GPIO và hình vẽ kỹ thuật).\n\n`;

                if (window.pdfjsLib) {
                    try {
                        const typedarray = new Uint8Array(new FileReaderSync ? new ArrayBuffer(0) : []);
                    } catch(e) {}
                }

                document.getElementById("nb-import-content").value = previewSnippet;

                const catSelect = document.getElementById("nb-import-category");
                if (catSelect && (file.name.toLowerCase().includes("datasheet") || file.name.toLowerCase().includes("esp32") || file.name.toLowerCase().includes("trm"))) {
                    catSelect.value = "Datasheet";
                }

                const tagInput = document.getElementById("nb-import-tags");
                if (!tagInput.value) {
                    tagInput.value = "#Datasheet, #NativePDF";
                }

                if (statusEl) {
                    statusEl.innerHTML = `✅ <span style="color: var(--accent);">Đã nạp file PDF gốc (${sizeMb} MB)! Bấm "Lưu" để kích hoạt Multimodal RAG.</span>`;
                }
                showToast(`Nạp thành công PDF gốc (${sizeMb} MB)!`);
            } catch (err) {
                console.error("Lỗi nạp PDF:", err);
                if (statusEl) statusEl.innerHTML = `❌ <span style="color: var(--danger);">Lỗi: ${err.message}</span>`;
            }
        };
        fileReader.readAsDataURL(file);
        return;
    }

    // Các tệp văn bản thông thường (.txt, .md, .json)
    pendingModalPdf = null;
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        document.getElementById("nb-import-content").value = text;
        if (statusEl) {
            statusEl.innerHTML = `✅ <span style="color: var(--accent);">Đã nạp file văn bản: "${file.name}"</span>`;
        }
        showToast(`Đã nạp file: ${file.name}`);
    };
    reader.readAsText(file);
}

async function saveImportedNotebookDoc() {
    const title = document.getElementById("nb-import-title").value.trim();
    const category = document.getElementById("nb-import-category").value;
    const content = document.getElementById("nb-import-content").value.trim();
    const tagsRaw = document.getElementById("nb-import-tags").value.trim();

    if (!title || (!content && !pendingModalPdf)) {
        alert("Vui lòng nhập tiêu đề và nội dung tài liệu!");
        return;
    }

    let tags = tagsRaw.split(",").map(t => {
        let clean = t.trim();
        if (clean && !clean.startsWith("#")) clean = "#" + clean;
        return clean;
    }).filter(t => t.length > 1);

    if (tags.length === 0) tags = [`#${category}`];

    const docId = "doc_" + Date.now();
    const isNativePdf = Boolean(pendingModalPdf);

    const newDoc = {
        id: docId,
        title: title,
        category: category,
        tags: tags,
        date: new Date().toLocaleDateString('vi-VN'),
        words: content ? content.trim().split(/\s+/).length : 500,
        isNativePdf: isNativePdf,
        pdfSizeMb: isNativePdf ? pendingModalPdf.sizeMb : null,
        content: content
    };

    // Nếu là PDF gốc -> Lưu base64 an toàn vào IndexedDB
    if (isNativePdf) {
        try {
            await savePdfToIndexedDB(docId, title, pendingModalPdf.base64, pendingModalPdf.sizeBytes);
        } catch (e) {
            console.error("Không thể lưu PDF vào IndexedDB:", e);
        }
    }

    notebookDocs.unshift(newDoc);
    localStorage.setItem(STORAGE_NOTEBOOK_DOCS, JSON.stringify(notebookDocs));

    // Reset form & đóng modal
    document.getElementById("nb-import-title").value = "";
    document.getElementById("nb-import-content").value = "";
    document.getElementById("nb-import-tags").value = "";
    pendingModalPdf = null;
    closeImportNotebookModal();

    selectedDocId = newDoc.id;
    renderNotebookDocsList();
    showToast(`Đã lưu tài liệu: "${title}"!`);

    addNotebookChatMessage("ai", isNativePdf ? 
        `Đã nạp thành công file **PDF Gốc: "${title}" (${newDoc.pdfSizeMb} MB)** vào kho tri thức.\n\n⚡ **Chế độ Multimodal đã kích hoạt**: Gemini sẽ đọc trực tiếp tài liệu gốc (toàn bộ bảng thanh ghi, sơ đồ khối CPU và thông số kỹ thuật). Hãy đặt câu hỏi bất kỳ!` :
        `Đã nạp thành công tài liệu **"${title}"** vào kho tri thức. Bạn có thể hỏi tôi bất kỳ câu hỏi nào!`
    );
}

async function deleteNotebookDoc(docId) {
    const doc = notebookDocs.find(d => d.id === docId);
    if (!doc) return;

    if (confirm(`Bạn có chắc chắn muốn xóa tài liệu "${doc.title}" không?`)) {
        if (doc.isNativePdf) {
            await deletePdfFromIndexedDB(docId);
        }
        notebookDocs = notebookDocs.filter(d => d.id !== docId);
        localStorage.setItem(STORAGE_NOTEBOOK_DOCS, JSON.stringify(notebookDocs));
        if (selectedDocId === docId) selectedDocId = "all";
        renderNotebookDocsList();
        showToast("Đã xóa tài liệu!");
    }
}

// ==========================================
// ĐÍNH KÈM PDF TRỰC TIẾP TRONG KHUNG CHAT
// ==========================================
function handleDirectPdfAttach(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert("Vui lòng chọn file định dạng .pdf!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result.split(',')[1];
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        
        currentChatPdfAttachment = {
            fileName: file.name,
            base64: base64,
            sizeMb: sizeMb
        };

        const previewBar = document.getElementById("nb-chat-pdf-preview");
        if (previewBar) previewBar.style.display = "flex";
        const nameEl = document.getElementById("nb-chat-pdf-name");
        if (nameEl) nameEl.innerText = file.name;
        const sizeEl = document.getElementById("nb-chat-pdf-size");
        if (sizeEl) sizeEl.innerText = sizeMb + " MB";

        showToast(`Đã đính kèm ${file.name} (${sizeMb} MB) để gửi trực tiếp đến Gemini!`);
    };
    reader.readAsDataURL(file);
}

function removeChatPdfAttachment() {
    currentChatPdfAttachment = null;
    const previewBar = document.getElementById("nb-chat-pdf-preview");
    if (previewBar) previewBar.style.display = "none";
    const fileInput = document.getElementById("nb-chat-pdf-input");
    if (fileInput) fileInput.value = "";
    showToast("Đã gỡ tệp PDF đính kèm.");
}

// ==========================================
// TRỢ LÝ HỎI ĐÁP TÀI LIỆU GEMINI DOC AI (CÁCH 1)
// ==========================================
function renderNotebookChat() {
    const container = document.getElementById("nb-chat-messages-container");
    if (!container) return;

    container.innerHTML = "";

    notebookChatHistory.forEach(msg => {
        const msgEl = document.createElement("div");
        msgEl.className = `nb-msg ${msg.role === 'user' ? 'nb-msg-user' : 'nb-msg-ai'}`;

        const avatar = msg.role === 'user' ? '🧑‍💻' : '🤖';

        msgEl.innerHTML = `
            <div class="nb-msg-avatar">${avatar}</div>
            <div class="nb-msg-bubble">
                ${formatMarkdownChat(msg.text)}
                ${msg.source ? `<div class="nb-citation-badge">📖 Trích nguồn: ${escapeHtml(msg.source)}</div>` : ''}
            </div>
        `;
        container.appendChild(msgEl);
    });

    container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatMarkdownChat(text) {
    if (!text) return "";

    // 1. Tách các khối mã nguồn ```c ... ``` ra mảng đệm riêng để bảo toàn ngắt dòng và format
    const codeBlocks = [];
    let processed = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `%%%CODE_BLOCK_${codeBlocks.length}%%%`;
        const codeClass = lang ? `language-${lang}` : 'language-c';
        codeBlocks.push(`<pre class="stage-theory-code" style="margin: 10px 0; background: #030712; border: 1px solid #1f2937; border-radius: 8px; padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #38bdf8; overflow-x: auto; line-height: 1.55;"><code class="${codeClass}">${escapeHtml(code.trim())}</code></pre>`);
        return placeholder;
    });

    let formatted = escapeHtml(processed);

    // 2. Inline code `code`
    
    // 2.5 Markdown Links [text](url) chuyển thành liên kết an toàn
    formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--cyan); text-decoration: underline; font-weight: 500;">$1 ↗</a>');

    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(0, 240, 255, 0.1); color: var(--cyan); padding: 2px 6px; border-radius: 4px; font-family: \'JetBrains Mono\', monospace; font-size: 12px; border: 1px solid rgba(0, 240, 255, 0.2); font-weight: 500;">$1</code>');

    // 3. Bold **text**
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #ffffff; font-weight: 700;">$1</strong>');

    // 4. Horizontal lines ---
    formatted = formatted.replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.12); margin: 12px 0;">');

    // 5. Callouts / Blockquotes > Note
    formatted = formatted.replace(/^>\s+(.*$)/gim, '<div style="background: rgba(0, 240, 255, 0.06); border-left: 3px solid var(--cyan); padding: 8px 12px; border-radius: 4px; margin: 8px 0; color: #e2e8f0; font-size: 12.5px; line-height: 1.5;">$1</div>');

    // 6. Headers ### and ##
    formatted = formatted.replace(/^### (.*$)/gim, '<h4 style="margin: 12px 0 6px; color: var(--cyan); font-size: 13.5px; font-weight: 700; font-family: \'JetBrains Mono\', monospace; display: flex; align-items: center; gap: 6px;">$1</h4>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h3 style="margin: 14px 0 8px; color: #fff; font-size: 15px; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 4px;">$1</h3>');

    // 7. Bullet points
    formatted = formatted.replace(/^\s*-\s+(.*$)/gim, '<div style="display: flex; gap: 6px; margin: 3px 0 3px 6px;"><span>•</span><span>$1</span></div>');

    // 8. Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    // 9. Phục hồi lại các khối mã nguồn nguyên vẹn
    codeBlocks.forEach((block, idx) => {
        formatted = formatted.replace(`%%%CODE_BLOCK_${idx}%%%`, () => block);
    });

    return formatted;
}

function addNotebookChatMessage(role, text, source = null) {
    notebookChatHistory.push({ role, text, source, timestamp: Date.now() });
    if (notebookChatHistory.length > 40) {
        notebookChatHistory = notebookChatHistory.slice(notebookChatHistory.length - 40);
    }
    localStorage.setItem(STORAGE_NOTEBOOK_CHAT, JSON.stringify(notebookChatHistory));
    renderNotebookChat();
}

function clearNotebookChat() {
    if (confirm("Bạn có muốn làm mới lịch sử cuộc hội thoại tài liệu không?")) {
        notebookChatHistory = [
            {
                role: "ai",
                text: "Đã làm sạch lịch sử hội thoại. Bạn có thể chọn tài liệu và đặt câu hỏi mới ngay bây giờ!"
            }
        ];
        localStorage.setItem(STORAGE_NOTEBOOK_CHAT, JSON.stringify(notebookChatHistory));
        renderNotebookChat();
    }
}

// Xử lý gửi câu hỏi
async function handleSendNotebookQuery() {
    const input = document.getElementById("nb-chat-input");
    if (!input) return;

    const question = input.value.trim();
    if (!question) return;

    input.value = "";
    
    // Ghi nhận tin nhắn của user
    const directPdf = currentChatPdfAttachment;
    let userMsgText = question;
    if (directPdf) {
        userMsgText += `\n*(Đính kèm tệp PDF gốc: ${directPdf.fileName} - ${directPdf.sizeMb} MB)*`;
    }
    addNotebookChatMessage("user", userMsgText);

    const sendBtn = document.getElementById("nb-btn-send");
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<span>⏳</span> Đang phân tích PDF...`;
    }

    try {
        // Chuẩn bị danh sách tài liệu context
        let relevantDocs = [];
        if (selectedDocId === 'all') {
            relevantDocs = notebookDocs;
        } else {
            const found = notebookDocs.find(d => d.id === selectedDocId);
            if (found) relevantDocs = [found];
            else relevantDocs = notebookDocs;
        }

        // Kiểm tra xem có PDF gốc trong context hoặc đang đính kèm không
        const hasNativePdf = directPdf || relevantDocs.some(d => d.isNativePdf);

        if (hasNativePdf && (!geminiApiKey || geminiApiKey.trim().length <= 10)) {
            addNotebookChatMessage("ai", `⚠️ **Để phân tích file PDF nguyên bản với đầy đủ bảng biểu & sơ đồ**, bạn cần cấu hình **Google Gemini API Key** (bấm nút ⚙️ Cấu Hình Key ở trên).\n\n*Khóa API được cấp miễn phí tại Google AI Studio.* Khi chưa có API Key, hệ thống sẽ trả lời dựa trên kho kiến thức văn bản đã lưu.`);
            queryLocalKnowledgeEngine(question, relevantDocs);
        } else if (geminiApiKey && geminiApiKey.trim().length > 10) {
            await queryGeminiApi(question, relevantDocs, directPdf);
        } else {
            queryLocalKnowledgeEngine(question, relevantDocs);
        }
    } catch (err) {
        console.error("Lỗi khi xử lý câu hỏi:", err);
        addNotebookChatMessage("ai", `❌ Không thể xử lý câu hỏi: ${err.message}\n\nHãy kiểm tra lại kết nối mạng hoặc cấu hình Gemini API Key.`);
    } finally {
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = `<span>Gửi</span> ➔`;
        }
    }
}

// ==========================================
// CẤU HÌNH GOOGLE GEMINI API (MODEL 2.0 FLASH & FALLBACKS)
// ==========================================
const GEMINI_PRIMARY_MODEL = "gemini-2.0-flash";
const GEMINI_FALLBACK_MODEL = "gemini-1.5-flash";
const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

// Gọi Google Gemini API (Multimodal PDF + Text)
async function queryGeminiApi(question, docs, directPdf = null) {
    const systemPrompt = `Bạn là Trợ Lý Kỹ Sư Nghiên Cứu Nhúng & Edge AI (Doc AI) dành riêng cho Mr. Thai.
Nhiệm vụ của bạn là đọc và phân tích các tài liệu kỹ thuật được cung cấp (tổng hợp từ Google NotebookLM, Datasheet ESP32, FreeRTOS, TinyML, Con Trỏ C).
QUY TẮC PHẢN HỒI:
1. Trả lời chi tiết, chuẩn xác, mang tính thực chiến cao của một Embedded Systems Architect.
2. Khi giải thích về C/C++ và con trỏ, hãy giải thích cặn kẽ bản chất ô nhớ, địa chỉ, toán tử & và *, mối quan hệ mảng, struct ->, và các cạm bẫy sụp nguồn.
3. Khi tài liệu là file PDF nguyên bản, hãy phân tích toàn diện bao gồm: các bảng thanh ghi (register maps, bitfields), sơ đồ khối CPU/Ngoại vi, sơ đồ chân GPIO, thông số điện áp và mã nguồn C mẫu.
4. Trích dẫn số trang hoặc đề mục cụ thể trong file PDF để Mr. Thai dễ đối chiếu.
5. Cung cấp ví dụ code C/C++ chuẩn theo ESP-IDF / FreeRTOS kèm chú thích từng dòng.`;

    const parts = [];
    let nativePdfFoundName = directPdf ? directPdf.fileName : null;

    // 1. Thêm PDF đính kèm trực tiếp trong khung chat
    if (directPdf && directPdf.base64) {
        parts.push({
            inlineData: {
                mimeType: "application/pdf",
                data: directPdf.base64
            }
        });
    }

    // 2. Thêm Native PDF từ thư viện (nếu được chọn)
    for (let doc of docs) {
        if (doc.isNativePdf) {
            const pdfRecord = await getPdfFromIndexedDB(doc.id);
            if (pdfRecord && pdfRecord.base64) {
                parts.push({
                    inlineData: {
                        mimeType: "application/pdf",
                        data: pdfRecord.base64
                    }
                });
                if (!nativePdfFoundName) nativePdfFoundName = doc.title;
            }
        }
    }

    // 3. Chuẩn bị ngữ cảnh cho các tài liệu text thông thường
    const textDocs = docs.filter(d => !d.isNativePdf);
    let contextContent = "";
    if (textDocs.length > 0) {
        contextContent = textDocs.map(d => `--- TÀI LIỆU: ${d.title} (Thẻ: ${(d.tags || []).join(', ')}) ---\n${d.content}\n`).join("\n\n");
    }

    let promptText = `${systemPrompt}\n\n`;
    if (contextContent) {
        promptText += `[DỮ LIỆU TÀI LIỆU KHO TRI THỨC]:\n${contextContent}\n\n`;
    }
    if (parts.length > 0) {
        promptText += `[GHI CHÚ]: Có file PDF gốc đính kèm dạng Multimodal. Hãy đọc kỹ bảng thanh ghi, sơ đồ chân GPIO và thông số kỹ thuật trong file PDF.\n\n`;
    }
    promptText += `[CÂU HỎI CỦA MR. THAI]:\n${question}`;

    parts.push({ text: promptText });

    const requestBody = {
        contents: [
            {
                role: "user",
                parts: parts
            }
        ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2500
        }
    };

    // Thử danh sách model (gemini-3.8-flash -> gemini-2.5-flash -> gemini-1.5-flash)
    let responseData = null;
    let successfulModel = null;
    let lastError = null;

    for (const modelName of GEMINI_MODELS) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey.trim()}`;
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const msg = errorData.error?.message || `HTTP ${response.status}`;
                const isModelUnavailable = response.status === 404 || 
                    msg.toLowerCase().includes("not found") || 
                    msg.toLowerCase().includes("no longer available") || 
                    msg.toLowerCase().includes("deprecated") ||
                    msg.toLowerCase().includes("not supported");

                if (isModelUnavailable) {
                    console.warn(`Model ${modelName} không khả dụng (${msg}), tự động fallback sang model tiếp theo...`);
                    lastError = new Error(msg);
                    continue;
                }
                throw new Error(msg);
            }

            responseData = await response.json();
            successfulModel = modelName;
            break;
        } catch (err) {
            lastError = err;
            if (modelName === GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
                throw err;
            }
        }
    }

    if (!responseData) {
        throw lastError || new Error("Không thể kết nối đến Google Gemini API.");
    }

    const answer = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận được phản hồi từ mô hình.";

    // Cập nhật mức sử dụng Quota hôm nay
    geminiUsage.requestsToday = (geminiUsage.requestsToday || 0) + 1;
    const tokens = responseData.usageMetadata?.totalTokenCount || 0;
    geminiUsage.tokensToday = (geminiUsage.tokensToday || 0) + tokens;
    geminiUsage.lastRequestTime = new Date().toLocaleTimeString('vi-VN');
    localStorage.setItem(STORAGE_GEMINI_USAGE, JSON.stringify(geminiUsage));
    updateGeminiQuotaDisplay();

    let sourceName = nativePdfFoundName 
        ? `📕 PDF: ${nativePdfFoundName} • Model: ${successfulModel}` 
        : (docs.length === 1 ? `${docs[0].title} • ${successfulModel}` : `${docs.length} tài liệu • ${successfulModel}`);
    addNotebookChatMessage("ai", answer, sourceName);
}

// ============================================================================
// ĐỘNG CƠ TRI THỨC NHÚNG CỤC BỘ (LOCAL OFFLINE AI ENGINE - ĐA DẠNG & THỰC CHIẾN)
// ============================================================================
function queryLocalKnowledgeEngine(question, docs) {
    const qLower = question.toLowerCase();

    // 1. CHỦ ĐỀ: CON TRỎ (POINTERS), ĐỊA CHỈ, TOÁN TỬ VÀ DỮ LIỆU C
    if (qLower.includes("con trỏ") || qLower.includes("pointer") || qLower.includes("địa chỉ") || 
        qLower.includes("dereference") || qLower.includes("toán tử *") || qLower.includes("toán tử &") || 
        qLower.includes("zero-copy") || qLower.includes("zero copy") || qLower.includes("mũi tên") || 
        qLower.includes("void*") || qLower.includes("function pointer") || qLower.includes("con trỏ hàm")) {
        
        let pointerResponse = `### 🧠 GIẢI THÍCH CHUYÊN SÂU: CON TRỎ (POINTERS) TRONG C NHÚNG & EDGE AI\n\n` +
            `Chào bạn! Con trỏ là "chìa khóa vàng" của lập trình vi điều khiển ESP32. Dưới đây là phân tích bản chất từ con số 0:\n\n` +
            `#### 1. Bản Chất Ô Nhớ RAM & Địa Chỉ (Address vs Value)\n` +
            `- Bộ nhớ RAM được cấu tạo bởi hàng triệu ô nhớ 1-byte liên tiếp. Mỗi ô nhớ có một **Địa chỉ duy nhất** (ví dụ: \`0x3FFB0004\`).\n` +
            `- **Biến thường** (\`int x = 42;\`): Giá trị nằm trong ô nhớ là số \`42\`.\n` +
            `- **Biến con trỏ** (\`int *ptr = &x;\`): \`ptr\` không chứa số 42, mà nó **lưu địa chỉ ô nhớ \`0x3FFB0004\` nơi x đang ngụ cư**!\n\n` +
            `\`\`\`\n` +
            `+--------------------+--------------------+\n` +
            `| Địa chỉ ô nhớ RAM | Dữ liệu bên trong  | Tên biến đại diện  |\n` +
            `+--------------------+--------------------+\n` +
            `| 0x3FFB0004         | 42                 | int x              |\n` +
            `| 0x3FFB0008         | 0x3FFB0004         | int *ptr = &x      |\n` +
            `+--------------------+--------------------+\n` +
            `\`\`\`\n\n` +
            `#### 2. Hai Toán Tử Cốt Lõi: \`&\` và \`*\`\n` +
            `- **Toán tử lấy địa chỉ \`&\` (Address-of)**: \`&x\` trả về địa chỉ \`0x3FFB0004\`.\n` +
            `- **Toán tử giải tham chiếu \`*\` (Dereference)**: \`*ptr\` có nghĩa là: *"Đi đến địa chỉ ghi trong ptr, mở ô nhớ ra để đọc hoặc ghi đè giá trị mới!"*.\n` +
            `  Nếu bạn gán: \`*ptr = 100;\`, biến \`x\` lập tức biến thành 100!\n\n` +
            `#### 3. Con Trỏ & Mảng (Pointer Arithmetic)\n` +
            `- Tên mảng thực chất là một con trỏ hằng: \`arr == &arr[0]\`.\n` +
            `- Khi viết \`arr[i]\`, CPU thực chất tính: \`*(arr + i)\`.\n` +
            `- **Bước nhảy con trỏ**: \`ptr + 1\` không phải là cộng 1 byte, mà là nhảy đúng \`sizeof(type)\` bytes (nhảy 4 bytes nếu là \`int*\`, nhảy 1 byte nếu là \`char*\`).\n\n` +
            `#### 4. Kỹ Thuật Zero-Copy & Toán Tử Mũi Tên \`->\` Với Struct\n` +
            `- Một khung âm thanh 16kHz có kích thước 32KB. Nếu truyền tham trị (\`void func(Audio data)\`), CPU phải copy toàn bộ 32KB vào Stack -> **Tràn bộ nhớ Stack Overflow làm reset vi điều khiển ngay lập tức**!\n` +
            `- Truyền con trỏ (\`void func(const Audio *data)\`): Chỉ truyền đúng **1 địa chỉ 4 byte**! Tiết kiệm 99.9% RAM, độ trễ 0ms.\n` +
            `- Khi có con trỏ struct \`frame\`, thay vì viết \`(*frame).accel_x\`, ta dùng toán tử mũi tên: \`frame->accel_x\`.\n\n` +
            `\`\`\`c\n` +
            `// Code mẫu truyền dữ liệu cảm biến Zero-Copy trên ESP32:\n` +
            `typedef struct __attribute__((packed)) {\n` +
            `    uint32_t timestamp;\n` +
            `    int16_t accel_x, accel_y, accel_z;\n` +
            `} IMU_Frame_t;\n\n` +
            `void process_imu_sample(const IMU_Frame_t *frame) {\n` +
            `    if (frame == NULL) return; // Luôn kiểm tra con trỏ NULL để chống Crash!\n` +
            `    printf("X: %d | Y: %d\\n", frame->accel_x, frame->accel_y);\n` +
            `}\n` +
            `\`\`\`\n\n` +
            `> 💡 **Mẹo**: Bạn có thể mở tài liệu *"Giáo Trình Cốt Lõi: Làm Chủ Con Trỏ (Pointers)"* ở cột bên trái để xem giáo trình đầy đủ 10 chương!`;

        addNotebookChatMessage("ai", pointerResponse, "Động Cơ Tri Thức Nhúng: Chuyên Đề Con Trỏ (Pointers)");
        return;
    }

    // 2. CHỦ ĐỀ: BỘ NHỚ ESP32, SRAM, PSRAM, MEMORY MAP, HEAP CAPS
    if (qLower.includes("bộ nhớ") || qLower.includes("memory") || qLower.includes("sram") || 
        qLower.includes("psram") || qLower.includes("flash") || qLower.includes("rtc") || 
        qLower.includes("heap_caps") || qLower.includes("memory map")) {
        
        let memResponse = `### 🏛️ KIẾN TRÚC PHÂN VÙNG BỘ NHỚ ESP32-S3 THỰC CHIẾN\n\n` +
            `ESP32-S3 sử dụng không gian địa chỉ thống nhất chia thành 4 phân vùng vật lý hoàn toàn khác biệt:\n\n` +
            `| Phân Vùng Bộ Nhớ | Dung Lượng | Tốc Độ Truy Xuất | Mục Đích Sử Dụng |\n` +
            `|---|---|---|---|\n` +
            `| **Internal SRAM1** | 384 KB | Siêu tốc (1 chu kỳ CPU ~240MHz) | **Vị trí vàng đặt Tensor Arena** của TinyML |\n` +
            `| **Internal SRAM0** | 64 KB | Siêu tốc | Instruction Cache & hàm ngắt \`IRAM_ATTR\` |\n` +
            `| **Internal SRAM2** | 64 KB | Tốc độ cao | DMA Buffers cho Wi-Fi, Bluetooth, I2S |\n` +
            `| **External PSRAM** | Tối đa 8MB | Chậm hơn SRAM 3-4 lần (SPI) | Chứa Frame buffer ảnh Camera, Model lớn |\n` +
            `| **RTC SRAM** | 16 KB | Năng lượng thấp | Giữ dữ liệu sống khi Deep Sleep (\`RTC_DATA_ATTR\`) |\n` +
            `| **SPI Flash ROM** | 4MB - 16MB | Qua SPI Cache | Chứa mã máy Firmware, Model weights tĩnh |\n\n` +
            `\`\`\`c\n` +
            `// Cấp phát đúng vùng nhớ bằng API ESP-IDF:\n` +
            `// 1. Cấp phát Tensor Arena trong Internal SRAM:\n` +
            `void *sram_ptr = heap_caps_malloc(64 * 1024, MALLOC_CAP_INTERNAL);\n\n` +
            `// 2. Cấp phát Buffer ảnh Camera trong PSRAM ngoài:\n` +
            `void *psram_ptr = heap_caps_malloc(256 * 1024, MALLOC_CAP_SPIRAM);\n` +
            `\`\`\``;

        addNotebookChatMessage("ai", memResponse, "Động Cơ Tri Thức Nhúng: Memory Mapping ESP32-S3");
        return;
    }

    // 3. CHỦ ĐỀ: CĂN LỀ BỘ NHỚ 16-BYTE (ALIGNMENT & SIMD)
    if (qLower.includes("căn lề") || qLower.includes("alignment") || qLower.includes("alignas") || 
        qLower.includes("16-byte") || qLower.includes("simd") || qLower.includes("vector") || 
        qLower.includes("loadstorealignment")) {
        
        let alignResponse = `### ⚡ TẠI SAO PHẢI CĂN LỀ 16-BYTE (\`alignas(16)\`) TRÊN ESP32-S3?\n\n` +
            `1. **Tập lệnh mở rộng Vector AI (SIMD)**:\n` +
            `   - ESP32-S3 sở hữu tập lệnh SIMD (Single Instruction Multiple Data). Mỗi chu kỳ xung nhịp CPU, bộ xử lý có thể nạp cùng lúc **128-bit (16 bytes)** dữ liệu ma trận trọng số INT8.\n` +
            `2. **Yêu cầu phần cứng**:\n` +
            `   - Để nạp 128-bit trong 1 chu kỳ máy, địa chỉ vùng nhớ bắt buộc phải chia hết cho 16 (\`address % 16 == 0\`).\n` +
            `3. **Hậu quả nếu thiếu căn lề**:\n` +
            `   - Nếu khai báo mảng thông thường rơi vào địa chỉ lẻ, khi TensorFlow Lite Micro nạp dữ liệu ma trận, phần cứng CPU sẽ phát sinh lỗi **LoadStoreAlignment Error** làm sập nguồn (Guru Meditation Crash) ngay lập tức!\n\n` +
            `\`\`\`c\n` +
            `// Khai báo chuẩn cho Tensor Arena:\n` +
            `constexpr int kTensorArenaSize = 64 * 1024;\n` +
            `alignas(16) static uint8_t tensor_arena[kTensorArenaSize];\n` +
            `\`\`\``;

        addNotebookChatMessage("ai", alignResponse, "Động Cơ Tri Thức Nhúng: SIMD 16-Byte Alignment");
        return;
    }

    // 4. CHỦ ĐỀ: STACK VS HEAP, PHÂN MẢNH BỘ NHỚ VÀ OOM
    if (qLower.includes("stack") || qLower.includes("heap") || qLower.includes("phân mảnh") || 
        qLower.includes("fragmentation") || qLower.includes("oom") || qLower.includes("memory leak") || 
        qLower.includes("watermark") || qLower.includes("memory pool")) {
        
        let heapResponse = `### 🛡️ QUẢN LÝ STACK VS HEAP & CHỐNG PHÂN MẢNH TRÊN THIẾT BỊ 24/7\n\n` +
            `1. **Stack**: Nhanh, tự động, nhưng kích thước cố định theo Task FreeRTOS (2KB - 8KB). Tuyệt đối không khai báo mảng lớn cục bộ trên Stack vì sẽ gây **Stack Overflow**.\n` +
            `2. **Căn bệnh phân mảnh Heap (Fragmentation)**:\n` +
            `   - Gọi \`malloc()\`/\`free()\` liên tục với các kích thước khác nhau sẽ chia cắt RAM thành nhiều mẩu vụn li ti.\n` +
            `   - Dù tổng RAM trống ghi nhận là 80KB, nhưng không có ô nhớ liên tục nào đủ 32KB -> Hệ thống báo lỗi **Out Of Memory (OOM Crash)**!\n` +
            `3. **Quy tắc vàng của Kỹ sư Nhúng**:\n` +
            `   - **Cấp phát tĩnh (Static Allocation)**: Tensor Arena, DMA Buffer được cấp phát cố định 1 lần duy nhất lúc khởi động.\n` +
            `   - Giám sát mức RAM thấp nhất từng chạm tới bằng hàm: \`heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL)\`.`;

        addNotebookChatMessage("ai", heapResponse, "Động Cơ Tri Thức Nhúng: Stack, Heap & Anti-Fragmentation");
        return;
    }

    // 5. CHỦ ĐỀ: TIMER, NGẮT (ISR), GPTIMER, IRAM_ATTR
    if (qLower.includes("timer") || qLower.includes("ngắt") || qLower.includes("isr") || 
        qLower.includes("gptimer") || qLower.includes("iram_attr") || qLower.includes("lấy mẫu") || 
        qLower.includes("sampling") || qLower.includes("deferred")) {
        
        let timerResponse = `### ⏱️ GPTIMER ĐỊNH THỜI MICRO-GIÂY & NGẮT TỐC ĐỘ CAO \`IRAM_ATTR\`\n\n` +
            `1. **Tại sao không dùng \`vTaskDelay()\`?**\n` +
            `   - FreeRTOS Tick Rate chỉ ở mức 100Hz - 1000Hz (độ phân giải 1-10ms), gây sai lệch (Jitter) lớn làm sai lệch phổ âm thanh AI.\n` +
            `   - **GPTimer 54-bit**: Prescaler 80 chia từ xung APB 80MHz giúp bộ đếm tăng 1 đơn vị mỗi đúng **1 micro-giây (1 µs)**.\n` +
            `2. **Cờ \`IRAM_ATTR\`**:\n` +
            `   - Bắt buộc gắn trước hàm ngắt ISR để ép mã máy nằm trọn trong SRAM nội. Tránh hiện tượng Crash nếu hàm ngắt được kích hoạt trong lúc vi điều khiển đang ghi Flash (Flash Cache Disabled).\n` +
            `3. **Cơ chế Deferred Processing**:\n` +
            `   - ISR chỉ gửi tín hiệu (\`vTaskNotifyGiveFromISR\`), đẩy công việc tính toán nặng ra Task bên ngoài xử lý, giữ thời gian phục vụ ngắt < 5µs!`;

        addNotebookChatMessage("ai", timerResponse, "Động Cơ Tri Thức Nhúng: Hardware Timers & High-Speed ISR");
        return;
    }

    // 6. CHỦ ĐỀ: FREERTOS, MULTI-CORE, QUEUE, MUTEX, TWDT
    if (qLower.includes("freertos") || qLower.includes("core") || qLower.includes("nhân") || 
        qLower.includes("queue") || qLower.includes("mutex") || qLower.includes("semaphore") || 
        qLower.includes("twdt") || qLower.includes("watchdog") || qLower.includes("task")) {
        
        let rtosResponse = `### ⚡ ĐA NHIỆM FREERTOS DUAL-CORE & GIAO TIẾP ĐỒNG BỘ\n\n` +
            `1. **Phân chia 2 nhân (Asymmetric Task Pinning)**:\n` +
            `   - **Core 0 (PRO_CPU)**: Ghim tác vụ thu thập cảm biến, Wi-Fi Station và giao thức MQTT.\n` +
            `   - **Core 1 (APP_CPU)**: Dành riêng 100% tài nguyên tính toán cho mô hình TinyML suy luận.\n` +
            `2. **FreeRTOS Queue**:\n` +
            `   - Cơ chế truyền dữ liệu an toàn luồng (Thread-Safe FIFO) giữa 2 core mà không bị Race Condition.\n` +
            `3. **Task Watchdog Timer (TWDT)**:\n` +
            `   - Tự động reset vi điều khiển nếu một tác vụ bị treo quá 3 giây (chống Deadlock).`;

        addNotebookChatMessage("ai", rtosResponse, "Động Cơ Tri Thức Nhúng: FreeRTOS Dual-Core Architecture");
        return;
    }

    // 7. CHỦ ĐỀ: TINYML, LƯỢNG TỬ HÓA INT8, TFLITE MICRO
    if (qLower.includes("tinyml") || qLower.includes("lượng tử") || qLower.includes("quantiz") || 
        qLower.includes("int8") || qLower.includes("tflite") || qLower.includes("arena") || 
        qLower.includes("invoke") || qLower.includes("flatbuffer")) {
        
        let mlResponse = `### 🤖 TRIỂN KHAI TINYML & QUY TRÌNH LƯỢNG TỬ HÓA INT8\n\n` +
            `1. **Lượng tử hóa INT8 (Post-Training Quantization)**:\n` +
            `   - Chuyển đổi trọng số từ Float32 (4 bytes) sang INT8 (1 byte): Dung lượng giảm đúng **75%**.\n` +
            `   - Tận dụng bộ nhân nguyên Integer MAC của ESP32-S3 giúp tốc độ suy luận nhanh gấp 3 - 5 lần.\n` +
            `2. **Vòng đời suy luận 5 bước**:\n` +
            `   1. Nạp con trỏ mô hình FlatBuffer từ Flash.\n` +
            `   2. Khởi tạo mảng Tensor Arena căn lề 16-byte (\`alignas(16)\`).\n` +
            `   3. Gán dữ liệu cảm biến / FFT vào tensor đầu vào \`interpreter->input(0)\`.\n` +
            `   4. Gọi \`interpreter->Invoke()\` thực thi mạng nơ-ron.\n` +
            `   5. Đọc kết quả phân loại từ tensor đầu ra \`interpreter->output(0)\`.`;

        addNotebookChatMessage("ai", mlResponse, "Động Cơ Tri Thức Nhúng: TinyML & INT8 Quantization");
        return;
    }

    // 8. CHẾ ĐỘ TÌM KIẾM THEO TÀI LIỆU HIỆN CÓ (DOCUMENT HEURISTIC SEARCH)
    let bestDoc = null;
    let maxMatches = -1;

    docs.forEach(doc => {
        let score = 0;
        const fullText = (doc.title + " " + (doc.content || "")).toLowerCase();
        const keywords = qLower.split(/\s+/).filter(w => w.length > 2);
        
        keywords.forEach(kw => {
            if (fullText.includes(kw)) score += 2;
        });

        if (doc.tags) {
            doc.tags.forEach(t => {
                if (qLower.includes(t.replace('#', '').toLowerCase())) score += 5;
            });
        }

        if (score > maxMatches) {
            maxMatches = score;
            bestDoc = doc;
        }
    });

    if (!bestDoc) bestDoc = docs[0];

    let dynamicResponse = "";

    if (qLower.includes("tóm tắt") || qLower.includes("cốt lõi")) {
        dynamicResponse = `### 📋 Tóm Tắt Trọng Tâm Kỹ Thuật: "${bestDoc.title}"\n\n` +
            `Dựa trên tài liệu hệ thống đã lưu trữ:\n\n` +
            (bestDoc.content || "").substring(0, 750) + `...\n\n` +
            `💡 **Lời khuyên thực chiến**: Hãy đối chiếu phần căn lề bộ nhớ và cấu trúc con trỏ trong tài liệu này trước khi nạp firmware lên kit mạch thật.`;
    } else if (qLower.includes("code") || qLower.includes("mã") || qLower.includes("ví dụ") || qLower.includes("hàm")) {
        dynamicResponse = `### 💻 Trích Xuất Code Mẫu Từ: "${bestDoc.title}"\n\n` +
            (bestDoc.content || "Không có đoạn code mẫu thuần.") + `\n\n` +
            `⚙️ **Kiểm thử**: Đảm bảo khai báo đúng thư viện header tương ứng trên ESP-IDF (\`esp_log.h\`, \`esp_heap_caps.h\`).`;
    } else if (qLower.includes("phỏng vấn") || qLower.includes("câu hỏi")) {
        dynamicResponse = `### 🎯 3 Câu Hỏi Ôn Tập Phỏng Vấn Dựa Trên: "${bestDoc.title}"\n\n` +
            `1. **Câu 1**: Tại sao trong lập trình nhúng vi điều khiển, việc truyền con trỏ (Zero-copy) lại là nguyên tắc bắt buộc khi xử lý luồng âm thanh hay frame ảnh?\n` +
            `2. **Câu 2**: Lỗi \`LoadStoreAlignment Error\` trên ESP32-S3 phát sinh do nguyên nhân gì và từ khóa nào trong C giúp ngăn chặn lỗi này?\n` +
            `3. **Câu 3**: Hiện tượng phân mảnh Heap (Heap Fragmentation) khác gì với tràn Stack (Stack Overflow), và giải pháp nào triệt để nhất?\n\n` +
            `*(Bạn có thể thử trả lời hoặc chuyển sang tab Phỏng Vấn để làm bài trắc nghiệm tính điểm!)*`;
    } else {
        // Phản hồi tổng quát có tính tương tác cao
        dynamicResponse = `### 💡 Phản Hồi Từ Tài Liệu: "${bestDoc.title}"\n\n` +
            `Dưới đây là nội dung kỹ thuật liên quan đến câu hỏi của bạn:\n\n` +
            (bestDoc.content || "Tài liệu này được lưu trữ dạng PDF.") + `\n\n` +
            `---\n` +
            `💡 **Gợi ý tra cứu thêm:**\n` +
            `- Hỏi: *"Giải thích chi tiết về con trỏ và mảng"* để xem bản đồ ô nhớ.\n` +
            `- Hỏi: *"Bộ nhớ SRAM và PSRAM khác nhau thế nào?"* để xem bảng so sánh tốc độ.\n` +
            `- Bấm **⚙️ Cấu Hình Key** góc trên để kích hoạt **Google Gemini 2.0 Flash Cloud AI** nếu bạn muốn trò chuyện tự do với trí tuệ nhân tạo!`;
    }

    addNotebookChatMessage("ai", dynamicResponse, bestDoc.title);
}

// Các nút câu hỏi nhanh (Quick Prompts)
function sendQuickPrompt(type) {
    if (type === 'summary') {
        const input = document.getElementById("nb-chat-input");
        if (input) input.value = "Hãy tóm tắt ngắn gọn các điểm cốt lõi và kinh nghiệm thực chiến từ tài liệu này.";
        handleSendNotebookQuery();
    } else if (type === 'extract') {
        const input = document.getElementById("nb-chat-input");
        if (input) input.value = "Trích xuất danh sách các thanh ghi, hàm API và thông số bộ nhớ quan trọng.";
        handleSendNotebookQuery();
    } else if (type === 'quiz') {
        const input = document.getElementById("nb-chat-input");
        if (input) input.value = "Hãy tạo 3 câu hỏi phỏng vấn kỹ sư nhúng chuyên sâu dựa trên tài liệu này.";
        handleSendNotebookQuery();
    } else if (type === 'code') {
        const input = document.getElementById("nb-chat-input");
        if (input) input.value = "Hãy viết một đoạn mã C hoàn chỉnh trên ESP-IDF áp dụng kiến thức trong tài liệu.";
        handleSendNotebookQuery();
    }
}

// Quản lý Gemini API Key
function openGeminiKeyModal() {
    const modal = document.getElementById("nb-key-modal");
    if (modal) {
        modal.style.display = "flex";
        const input = document.getElementById("nb-api-key-input");
        if (input) input.value = geminiApiKey || "";
        const statusEl = document.getElementById("nb-key-test-status");
        if (statusEl) statusEl.innerHTML = "";
    }
}

function closeGeminiKeyModal() {
    const modal = document.getElementById("nb-key-modal");
    if (modal) modal.style.display = "none";
}

async function testGeminiApiConnection() {
    const input = document.getElementById("nb-api-key-input");
    const statusEl = document.getElementById("nb-key-test-status");
    if (!input || !statusEl) return;

    const testKey = input.value.trim();
    if (!testKey || testKey.length < 15) {
        statusEl.innerHTML = `<span style="color: var(--danger);">⚠️ Vui lòng nhập API Key hợp lệ (chuỗi bắt đầu bằng AIzaSy...) trước khi kiểm tra!</span>`;
        return;
    }

    statusEl.innerHTML = `<span style="color: var(--cyan);">⏳ Đang kết nối thử nghiệm đến Google Gemini API (model ${GEMINI_PRIMARY_MODEL})...</span>`;

    let successModel = null;
    let lastErrMsg = "";

    for (const modelName of GEMINI_MODELS) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${testKey}`;
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello! Reply with 'OK'" }] }],
                    generationConfig: { maxOutputTokens: 10 }
                })
            });

            if (res.ok) {
                successModel = modelName;
                break;
            } else {
                const errData = await res.json().catch(() => ({}));
                lastErrMsg = errData.error?.message || `HTTP ${res.status}`;
                console.warn(`Test model ${modelName} không thành công: ${lastErrMsg}`);
            }
        } catch (e) {
            lastErrMsg = e.message;
        }
    }

    if (successModel) {
        statusEl.innerHTML = `<span style="color: var(--accent);">✅ KẾT NỐI THÀNH CÔNG! Google Gemini (model <strong>${successModel}</strong>) phản hồi xuất sắc. Hãy bấm "Lưu Cấu Hình".</span>`;
        showToast(`Kết nối Gemini API (${successModel}) thành công!`);
    } else {
        console.error("Test Gemini connection failed:", lastErrMsg);
        statusEl.innerHTML = `<span style="color: var(--danger);">❌ Lỗi kết nối: ${lastErrMsg}<br><small style="color: var(--text-muted);">Hãy kiểm tra lại API Key hoặc đảm bảo bạn đã bật Generative Language API tại Google AI Studio.</small></span>`;
    }
}

function saveGeminiApiKey() {
    const input = document.getElementById("nb-api-key-input");
    if (!input) return;

    geminiApiKey = input.value.trim();
    localStorage.setItem(STORAGE_GEMINI_KEY, geminiApiKey);
    closeGeminiKeyModal();
    updateGeminiKeyStatus();

    if (geminiApiKey) {
        showToast("Đã lưu Gemini API Key! Sẵn sàng hỏi đáp Cloud AI.");
        addNotebookChatMessage("ai", "🎉 **Tuyệt vời!** Đã kích hoạt kết nối **Google Gemini 3.8 Flash** thành công. Bây giờ tôi có thể đọc trực tiếp các file PDF nguyên bản với đầy đủ bảng biểu & sơ đồ phần cứng!");
    } else {
        showToast("Đã chuyển về chế độ Động Cơ Tri Thức Nhúng Cục Bộ!");
    }
}

// ==========================================
// CÁC HÀM CẦU NỐI TÍCH HỢP LỘ TRÌNH & SỔ TAY AI (ROADMAP & NOTEBOOK BRIDGE)
// ==========================================

function openNotebookForStage(stageIndex) {
    const docId = ROADMAP_STAGE_DOC_IDS[stageIndex];
    if (docId) {
        selectedDocId = docId;
        activeTagFilter = "all";
    }
    switchTab('notebook');
    if (typeof renderNotebookView === 'function') {
        renderNotebookView();
    }
    const foundDoc = notebookDocs.find(d => d.id === docId);
    showToast(`📖 Đã mở tài liệu: ${foundDoc ? foundDoc.title : 'Bước ' + (stageIndex + 1)}`);
}

function askAiAboutStage(stageIndex) {
    const stageTheory = (typeof ROADMAP_STAGE_THEORY !== 'undefined') ? ROADMAP_STAGE_THEORY[stageIndex] : null;
    const docId = ROADMAP_STAGE_DOC_IDS[stageIndex];
    if (docId) {
        selectedDocId = docId;
    }
    switchTab('notebook');
    if (typeof renderNotebookView === 'function') {
        renderNotebookView();
    }
    const inputEl = document.getElementById("nb-chat-input");
    if (inputEl && stageTheory) {
        inputEl.value = `Hãy giải thích chi tiết lý thuyết, kiến trúc vi điều khiển ESP32 và các bước lập trình C thực tế cho "${stageTheory.title}". Các lỗi bộ nhớ hoặc ngắt nghiêm trọng cần tránh là gì?`;
        inputEl.focus();
    }
    showToast(`🤖 Trợ lý AI sẵn sàng giải thích ${stageTheory ? stageTheory.title : 'giai đoạn này'}`);
}

let currentTaskModalData = null;

function showTaskTheoryModal(stageIndex, taskIndex) {
    const stage = roadmap[stageIndex];
    if (!stage) return;
    const task = stage.tasks[taskIndex];
    if (!task) return;

    currentTaskModalData = { stageIndex, taskIndex, task, stage };
    const taskTheory = (typeof ROADMAP_TASK_THEORY !== 'undefined' && ROADMAP_TASK_THEORY[task.id]) || {
        title: task.title,
        stageName: stage.stage,
        skill: task.skill,
        content: `Nhiệm vụ: ${task.title}.\nKỹ năng đạt được: ${task.skill}.\nĐây là một phần quan trọng trong lộ trình xây dựng hệ thống Edge AI chuyên nghiệp trên ESP32.`,
        code: `// Code mẫu thực hành cho: ${task.skill}\nvoid setup_task(void) {\n    ESP_LOGI("APP", "Khởi tạo: %s", "${task.title}");\n}`
    };

    const titleEl = document.getElementById("task-modal-title");
    if (titleEl) titleEl.innerText = `📖 ${task.title}`;

    const stageEl = document.getElementById("task-modal-stage");
    if (stageEl) stageEl.innerText = stage.stage;

    const skillEl = document.getElementById("task-modal-skill");
    if (skillEl) skillEl.innerText = `Skill: ${task.skill}`;

    const contentEl = document.getElementById("task-modal-content");
    if (contentEl) {
        if (typeof formatMarkdownChat === 'function') {
            contentEl.innerHTML = formatMarkdownChat(taskTheory.content);
        } else {
            contentEl.innerHTML = taskTheory.content.replace(/\n/g, '<br>');
        }
    }

    const codeEl = document.getElementById("task-modal-code");
    if (codeEl) codeEl.innerText = taskTheory.code;

    const modal = document.getElementById("task-theory-modal");
    if (modal) modal.classList.add("active");
}

function closeTaskTheoryModal() {
    const modal = document.getElementById("task-theory-modal");
    if (modal) modal.classList.remove("active");
}

function askAiFromTaskModal() {
    if (!currentTaskModalData) return;
    const { stageIndex, taskIndex } = currentTaskModalData;
    closeTaskTheoryModal();
    askAiAboutTask(stageIndex, taskIndex);
}

function askAiAboutTask(stageIndex, taskIndex) {
    const stage = roadmap[stageIndex];
    if (!stage) return;
    const task = stage.tasks[taskIndex];
    if (!task) return;

    const docId = ROADMAP_STAGE_DOC_IDS[stageIndex];
    if (docId) selectedDocId = docId;

    switchTab('notebook');
    if (typeof renderNotebookView === 'function') renderNotebookView();

    const inputEl = document.getElementById("nb-chat-input");
    if (inputEl) {
        inputEl.value = `Tôi đang học Lộ trình Edge AI Bước ${stageIndex + 1}. Hãy giải thích chuyên sâu về nhiệm vụ: "${task.title}" (Kỹ năng: ${task.skill}). Bản chất phần cứng trên ESP32, cách triển khai code C/C++ và các lỗi thường gặp là gì?`;
        inputEl.focus();
    }
    showToast(`🤖 Đã nạp câu hỏi về "${task.title}" cho Gemini!`);
}

function saveTaskToMyNotes() {
    if (!currentTaskModalData) return;
    const { task, stage } = currentTaskModalData;
    const taskTheory = (typeof ROADMAP_TASK_THEORY !== 'undefined' && ROADMAP_TASK_THEORY[task.id]);

    notes.unshift({
        id: "note_" + Date.now(),
        title: task.title,
        category: stage.stage.split(':')[0] || "Lộ Trình",
        content: taskTheory ? taskTheory.content : `Ghi chú cho kỹ năng ${task.skill}`,
        code: taskTheory ? taskTheory.code : "",
        date: new Date().toLocaleDateString('vi-VN')
    });
    saveState();
    if (typeof renderNotes === 'function') renderNotes();
    closeTaskTheoryModal();
    showToast(`💾 Đã lưu "${task.title}" vào sổ tay của bạn!`);
}

function openPracticeFromTaskModal() {
    if (!currentTaskModalData) return;
    const { task } = currentTaskModalData;
    closeTaskTheoryModal();
    if (typeof practiceExercises !== 'undefined') {
        const probIdx = practiceExercises.findIndex(p => p.linkedSkill === task.skill);
        if (probIdx !== -1 && typeof openPracticeProblem === 'function') {
            openPracticeProblem(probIdx);
            return;
        }
    }
    if (typeof switchTab === 'function') switchTab('practice');
}

function copyTaskModalCode() {
    const codeEl = document.getElementById("task-modal-code");
    if (codeEl && codeEl.innerText) {
        navigator.clipboard.writeText(codeEl.innerText).then(() => {
            if (typeof showToast === 'function') showToast("📋 Đã sao chép mã nguồn C!");
        }).catch(() => {
            if (typeof showToast === 'function') showToast("📋 Đã sao chép!");
        });
    }
}

// Lắng nghe phím ESC để đóng modal lý thuyết
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeTaskTheoryModal();
    }
});

window.showTaskTheoryModal = showTaskTheoryModal;
window.closeTaskTheoryModal = closeTaskTheoryModal;
window.copyTaskModalCode = copyTaskModalCode;
window.askAiFromTaskModal = askAiFromTaskModal;
window.askAiAboutTask = askAiAboutTask;
window.saveTaskToMyNotes = saveTaskToMyNotes;
window.openPracticeFromTaskModal = openPracticeFromTaskModal;
window.openGeminiKeyModal = openGeminiKeyModal;
window.closeGeminiKeyModal = closeGeminiKeyModal;
window.testGeminiApiConnection = testGeminiApiConnection;
window.saveGeminiApiKey = saveGeminiApiKey;
window.setNotebookRightMode = setNotebookRightMode;
window.renderNotebookDocReader = renderNotebookDocReader;
window.askAiAboutCurrentDoc = askAiAboutCurrentDoc;
window.scrollToPracticeInReader = scrollToPracticeInReader;
window.openPracticeForCurrentDocModule = openPracticeForCurrentDocModule;
window.openNotebookForStage = openNotebookForStage;
window.askAiAboutStage = askAiAboutStage;
window.selectNotebookDoc = selectNotebookDoc;
window.setDocTagFilter = setDocTagFilter;
window.renderNotebookView = renderNotebookView;
window.renderNotebookDocsList = renderNotebookDocsList;


window.defaultNotebookDocs = defaultNotebookDocs;
window.notebookDocs = notebookDocs;
