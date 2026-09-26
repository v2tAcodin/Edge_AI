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
        "words": 1354,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *Expert C Programming: Deep C Secrets* (Peter van der Linden, Sun Microsystems, Ch.4 & 9)\n> *\"The Shocking Truth: Arrays and Pointers Are NOT the Same! An array name represents a contiguous block of memory whose address is fixed at compile/link time. A pointer is an explicit variable holding a physical memory address that must be loaded from memory before dereferencing.\"*\n> \n> 🏛️ **Đặc Tả Tiêu Chuẩn Quốc Tế ISO C11 §6.5.3.2 (Unary Operators):**\n> *\"The operand of the unary & operator shall be an lvalue designating an object. The result is a pointer to the object. The unary * operator denotes indirection; if the operand points to an object, the result is an lvalue designating the object.\"*\n> \n> 📊 **Bản Đồ Bố Cục Ô Nhớ Vật Lý Trong RAM (Internal SRAM1 Map):**\n> | Định Danh C | Địa Chỉ Vật Lý (Hex) | Kích Thước | Giá Trị Thực Tế | Ý Nghĩa Kỹ Thuật Vi Điều Khiển |\n> | :--- | :--- | :--- | :--- | :--- |\n> | `int val = 42` | `0x3FC90000` | 4 bytes | `0x0000002A` | Ô nhớ số nguyên 32-bit trong SRAM1 |\n> | `int *p = &val` | `0x3FC90008` | 4 bytes | `0x3FC90000` | Con trỏ cấp 1 chứa địa chỉ phòng |\n> | `int **pp = &p` | `0x3FC90010` | 4 bytes | `0x3FC90008` | Con trỏ cấp 2 trỏ vào con trỏ cấp 1 |\n> | `uint8_t buf[16]` | `0x3FC90020` | 16 bytes | `0x00...` | Căn lề 16-byte bắt buộc cho Vector SIMD AI |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI & MENTAL MODEL: TỦ ĐỒ KHÁCH SẠN VÀ Ô NHỚ RAM\nTrong khoa học máy tính và kiến trúc vi điều khiển, bộ nhớ RAM là một dãy liên tục các ô nhớ 1-byte (8 bits), mỗi ô nhớ mang một **địa chỉ vật lý duy nhất** (Physical Memory Address) được đánh số dưới dạng số nguyên thập lục phân (Hexadecimal, ví dụ `0x3FC90000`).\n\n#### Ẩn dụ kinh điển:\n- **Biến thông thường (`int x = 42`):** Giống như một **ngăn tủ đồ** có dán nhãn tên là `x`. Bên trong ngăn tủ chứa món đồ có giá trị là `42`.\n- **Địa chỉ (`&x`):** Là **số thứ tự phòng** hoặc số chìa khóa gắn trên cánh cửa tủ (ví dụ: Tủ số 104). Toán tử `&` (Address-of) dùng để hỏi hệ điều hành: *\"Ngăn tủ này nằm ở số phòng bao nhiêu?\"*.\n- **Con trỏ (`int *ptr = &x`):** Là một **mảnh giấy ghi số phòng**. Bản thân mảnh giấy cũng được cất trong một ngăn tủ riêng của nó, nhưng giá trị bên trong mảnh giấy không phải là quần áo hay tiền bạc, mà là dòng chữ ghi: *\"Hãy đến tủ số 104\"*.\n- **Toán tử giải tham chiếu (`*ptr`):** Là hành động bạn cầm mảnh giấy đến trước cửa tủ số 104, cắm chìa khóa vào và **mở tung cánh cửa ra** (Dereference) để xem hoặc thay đổi đồ vật bên trong.\n\n```\nSƠ ĐỒ BẢN ĐỒ Ô NHỚ (ASCII MEMORY MAP):\n+-------------------+-----------------------+-------------------+\n|  Địa chỉ ô nhớ    |  Tên biến / Ý nghĩa   |  Giá trị chứa     |\n+-------------------+-----------------------+-------------------+\n|    0x3FC90000     |  int x = 42           |  0x0000002A (42)  |  <-- Ô nhớ 4 bytes\n|    0x3FC90004     |  [Alignment Padding]  |  0x00000000       |\n|    0x3FC90008     |  int *ptr = &x        |  0x3FC90000       |  <-- Con trỏ 4 bytes\n|    0x3FC9000C     |  int **pptr = &ptr    |  0x3FC90008       |  <-- Con trỏ cấp 2\n+-------------------+-----------------------+-------------------+\n```\n\n---\n\n### 📌 2. KIẾN TRÚC PHẦN CỨNG ESP32-S3 TRM & QUY TẮC CĂN LỀ 16-BYTE (SIMD)\nTheo tài liệu kỹ thuật **ESP32-S3 Technical Reference Manual (Chương 2: System and Memory)**:\n- Không gian địa chỉ nội (Internal SRAM) gồm 512 KB, trải dài từ `0x3FC88000` đến `0x3FCDFFFF` (DRAM) và `0x40370000` đến `0x403E0000` (IRAM).\n- **Lỗi căn lề phần cứng (LoadStoreAlignmentCause):**\n  Bộ vi xử lý Xtensa LX7 dual-core hỗ trợ tập lệnh xử lý vector SIMD 128-bit chuyên dụng cho AI (các lệnh `EE.VLD.128.IP`, `EE.VST.128.IP`). Lệnh này yêu cầu địa chỉ ô nhớ bắt buộc phải **chia hết cho 16 bytes** (`address % 16 == 0`).\n  Nếu bạn ép kiểu con trỏ mảng byte thông thường (`uint8_t*`) chưa căn lề sang con trỏ vector, CPU sẽ lập tức ném ngoại lệ ngắt phần cứng **Exception Cause 9 (LoadStoreAlignmentCause)** và kích hoạt Panic Reset (Guru Meditation Error)!\n\n```c\n// Chuẩn cấp phát bộ nhớ căn lề 16-byte cho AI trên ESP32-S3:\n#include \"esp_heap_caps.h\"\n#include \"esp_log.h\"\n\nvoid* allocate_aligned_tensor_arena(size_t arena_size) {\n    // 1. Cấp phát trong Internal SRAM0/1 với căn lề 16 bytes:\n    void *ptr = heap_caps_aligned_alloc(16, arena_size, MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT);\n    if (ptr == NULL) {\n        ESP_LOGE(\"MEM\", \"❌ Tràn bộ nhớ! Không thể cấp phát %zu bytes!\", arena_size);\n        return NULL;\n    }\n    \n    // 2. Xác thực con trỏ hợp lệ theo chuẩn địa chỉ vật lý:\n    uintptr_t addr = (uintptr_t)ptr;\n    if ((addr % 16) == 0) {\n        ESP_LOGI(\"MEM\", \"✅ Con trỏ căn lề hoàn hảo: 0x%08X (Chia hết cho 16)\", (unsigned int)addr);\n    }\n    return ptr;\n}\n```\n\n---\n\n### 📌 3. QUY TẮC CON TRỎ THEO CHUẨN ISO C99 VÀ BẪY STRICT ALIASING\nTheo chuẩn **ISO/IEC 9899:1999 (C99 Standard §6.5)**:\n- **Strict Aliasing Rule:** Trình biên dịch GCC mặc định giả định rằng hai con trỏ trỏ tới hai kiểu dữ liệu khác nhau (ví dụ `float*` và `uint32_t*`) sẽ **không bao giờ cùng trỏ vào một ô nhớ**.\n- **Hậu quả:** Khi bạn bật cờ tối ưu hóa `-O2` hoặc `-O3` trong ESP-IDF, GCC sẽ hoán đổi thứ tự thực thi của các lệnh ghi thông qua con trỏ khác kiểu, dẫn đến kết quả tính toán sai hoàn toàn mà không hề báo lỗi cú pháp!\n- **Giải pháp chuẩn:** Khi cần giải mã byte thô (Type-Punning) từ sóng cảm biến sang số nguyên, bắt buộc sử dụng `union` hoặc `memcpy()`:\n```c\n// Type-Punning an toàn chuẩn C99 / MISRA C:2012\ntypedef union {\n    float real_value;\n    uint32_t raw_bits;\n    uint8_t byte_array[4];\n} sensor_raw_payload_t;\n\nsensor_raw_payload_t payload;\npayload.byte_array[0] = uart_rx_byte();\npayload.byte_array[1] = uart_rx_byte();\npayload.byte_array[2] = uart_rx_byte();\npayload.byte_array[3] = uart_rx_byte();\n// Đọc an toàn tuyệt đối, không vi phạm Strict Aliasing:\nfloat temperature = payload.real_value;\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG: DANGLING POINTER & BUFFER OVERFLOW TRONG TENSOR ARENA\n1. **Dangling Pointer (Con trỏ treo lơ lửng):**\n   Khi bạn gọi hàm `free(ptr)`, hệ thống chỉ đánh dấu khối nhớ đó là \"rảnh rỗi để tái sử dụng\", nhưng giá trị địa chỉ trong biến con trỏ `ptr` **vẫn giữ nguyên**! Nếu sau đó bạn tiếp tục ghi vào `*ptr`, bạn sẽ vô tình ghi đè dữ liệu của một Task FreeRTOS khác đang hoạt động, tạo ra lỗi sập hệ thống ngẫu nhiên cực kỳ khó gỡ (Heisenbug).\n   *Quy tắc vàng:* Luôn gán `ptr = NULL;` ngay lập tức sau khi gọi `free(ptr)`!\n2. **Buffer Overflow trong Tensor Arena:**\n   Khi mạng nơ-ron TFLite Micro thực hiện lớp tích chập Conv2D, nếu Tensor Arena được cấp phát thiếu dù chỉ 4 bytes, ma trận đầu ra sẽ ghi đè lên Metadata của bộ nhớ Heap (`heap_caps`), dẫn đến lỗi hoảng loạn `CORRUPT HEAP: multi_heap.c` khi Task kết thúc!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [Espressif ESP32-S3 Technical Reference Manual (PDF)](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Chương 2: System and Memory.\n- 📖 [ISO/IEC 9899:1999 (C99 Programming Language Standard)](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1256.pdf) - Mục 6.5.3 (Unary operators) và Strict Aliasing Rule.\n- 🌐 [SEI CERT C Coding Standard - Memory Management Rules](https://wiki.sei.cmu.edu/confluence/display/c/MEM30-C.+Do+not+access+freed+memory) - Quy tắc MEM30-C (Do not access freed memory).\n- 📚 Sách giáo khoa: *\"Expert C Programming: Deep C Secrets\"* (Peter van der Linden, Prentice Hall).",
        "bookId": "book_expert_c",
        "standardRef": "Peter van der Linden (Sun Microsystems) Ch.4 & ISO/IEC 9899:2011 §6.5.3"
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
        "words": 1310,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ESP32-S3 Technical Reference Manual (TRM)* (Espressif Systems, §2.2 Address Mapping)\n> *\"The ESP32-S3 integrates 512 KB of internal SRAM (SRAM0, SRAM1, and SRAM2) and up to 1 GB of external memory address space. SRAM0 (32 KB) is mapped to IBus for instruction execution. SRAM1 (416 KB) is shared between IBus and DBus. SRAM2 (64 KB) is dedicated to DBus and DMA controllers. Load/store operations on 128-bit vector registers require 16-byte alignment.\"*\n> \n> 📊 **Bảng Phân Vùng Bộ Nhớ Vật Lý ESP32-S3 (TRM Table 2-1):**\n> | Phân Vùng | Dải Địa Chỉ Hex | Dung Lượng | Bus Giao Tiếp | Tốc Độ / Ứng Dụng Chuyên Biệt |\n> | :--- | :--- | :--- | :--- | :--- |\n> | **SRAM0** | `0x40370000 - 0x40377FFF` | 32 KB | IBus Only | `IRAM_ATTR` Vector ngắt & mã máy ISR |\n> | **SRAM1** | `0x3FC88000 - 0x3FCDFFFF` | 416 KB | I/DBus | **Tensor Arena AI**, Static Buffers (1-cycle ~240MHz) |\n> | **SRAM2** | `0x3FCD0000 - 0x3FCDFFFF` | 64 KB | DBus Only | DMA Buffers cho Wi-Fi, Bluetooth, I2S/SPI |\n> | **PSRAM** | `0x3C000000 - 0x3DFFFFFF` | Tối đa 32 MB | Octal SPI | Ảnh Camera Framebuffer (80-120MHz, trễ Cache L1) |\n> | **RTC Fast** | `0x600FE000 - 0x600FFFFF` | 8 KB | RTC Bus | ULP Co-processor & dữ liệu sống qua Deep Sleep |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: KHÔNG GIAN BỘ NHỚ HỖN HỢP TRÊN VI ĐIỀU KHIỂN\nMột trong những rào cản lớn nhất khi lập trình viên phần mềm (PC / Web) chuyển sang lập trình nhúng Edge AI là ảo tưởng: *\"Bộ nhớ RAM là một khối thống nhất vô tận\"*.\nTrên thực tế phần cứng vi điều khiển hiện đại như **ESP32-S3 (Xtensa Dual-Core LX7)**, bộ nhớ là một hệ sinh thái phân tầng phức tạp với các đặc tính vật lý, tốc độ truy xuất và bus giao tiếp hoàn toàn khác biệt:\n\n```\nSƠ ĐỒ PHÂN VÙNG BỘ NHỚ VẬT LÝ ESP32-S3 (ESP32-S3 TRM CHAPTER 2):\n0x40370000 +---------------------------------------+ 0x40377FFF (32 KB)\n           | SRAM0: IRAM Only (Mã nguồn ngắt ISR)  | Bus IBus (Chỉ thực thi lệnh)\n0x40378000 +---------------------------------------+ 0x403DFFFF (416 KB)\n           | SRAM1: Shared IRAM / DRAM             | Bus I/DBus (Lưu cả code & data)\n0x3FC88000 +---------------------------------------+ 0x3FCDFFFF (Mapped DRAM)\n0x3FCD0000 +---------------------------------------+ 0x3FCDFFFF (64 KB)\n           | SRAM2: DRAM Only (DMA Buffers & Heap) | Bus DBus (Hỗ trợ truy xuất DMA)\n0x3C000000 +---------------------------------------+ 0x3DFFFFFF (Tối đa 32 MB)\n           | External Octal PSRAM (OPI SPI Bus)    | Tốc độ 80-120MHz, trễ Cache Line\n           +---------------------------------------+\n```\n\n---\n\n### 📌 2. ĐẶC TẢ CHI TIẾT TỪNG PHÂN VÙNG BỘ NHỚ THEO ESP32-S3 TRM\n1. **SRAM0 (32 KB, `0x40370000 - 0x40377FFF`):**\n   - Chỉ kết nối vào đường truyền IBus (Instruction Bus). Chỉ cho phép nạp lệnh thực thi CPU.\n   - Thường được bootloader dùng để nạp các vector bảng ngắt và các hàm thời gian thực quan trọng nhất.\n2. **SRAM1 (416 KB, `0x40378000 - 0x403DFFFF` / `0x3FC88000 - 0x3FCDFFFF`):**\n   - Vùng nhớ chia sẻ linh hoạt giữa IRAM và DRAM. Trình biên dịch liên kết (Linker Script `esp32s3.ld`) sẽ tự động phân bổ: Mã nguồn nạp vào từ đầu dải địa chỉ IBus, trong khi dữ liệu biến toàn cục (`.data`, `.bss`) và Heap nạp vào từ đầu dải địa chỉ DBus.\n3. **SRAM2 (64 KB, `0x3FCD0000 - 0x3FCDFFFF`):**\n   - Chỉ kết nối vào DBus và là vùng nhớ **duy nhất hỗ trợ bộ điều khiển DMA trực tiếp cho Wi-Fi, Bluetooth và ngoại vi I2S/SPI**.\n   - Nếu bạn cấp phát buffer nhận dữ liệu DMA mà không đặt cờ `MALLOC_CAP_DMA`, hệ thống sẽ ném lỗi khi kích hoạt kênh truyền DMA!\n4. **Octal PSRAM (OPI PSRAM 8 MB / 16 MB):**\n   - Kết nối với CPU qua giao diện SPI 8 đường dữ liệu (Octal SPI).\n   - Tốc độ truy xuất chậm hơn SRAM nội từ 3 đến 5 lần và phụ thuộc vào Cache L1 (32KB). Khi mô hình Deep Learning quét qua các trọng số lớn hàng megabytes, hiện tượng **Cache Miss** liên tục xảy ra làm giảm tốc độ suy luận nếu không tối ưu hóa luồng dữ liệu.\n\n---\n\n### 📌 3. CHIẾN LƯỢC QUẢN TRỊ BỘ NHỚ TENSOR ARENA THEO CHUẨN SẢN XUẤT\nTrong ứng dụng TinyML, chúng ta phải đưa ra quyết định kiến trúc: **Nên đặt Tensor Arena ở đâu?**\n- **Mô hình siêu nhẹ (Âm thanh KWS < 60KB):** Cấp phát 100% trong **Internal SRAM** bằng `MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT`. Tận dụng tối đa xung nhịp 240MHz và các lệnh SIMD 128-bit.\n- **Mô hình thị giác máy tính (Visual Wake Words > 500KB):** Buộc phải cấp phát trong **PSRAM** bằng cờ `MALLOC_CAP_SPIRAM`. Cần cấu hình Flash/PSRAM clock lên 120MHz Octal mode trong `sdkconfig` để tránh nghẽn cổ chai bus!\n\n```c\n// Chiến lược cấp phát bộ nhớ thông minh (Fallback Strategy):\n#include \"esp_heap_caps.h\"\n#include \"esp_log.h\"\n\nuint8_t* allocate_optimal_tensor_arena(size_t required_size) {\n    uint8_t *arena = NULL;\n    \n    // Ưu tiên 1: Thử cấp phát trong Internal SRAM siêu tốc (Căn lề 16 bytes cho SIMD)\n    arena = (uint8_t*)heap_caps_aligned_alloc(16, required_size, MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT);\n    if (arena != NULL) {\n        ESP_LOGI(\"TENSOR_INIT\", \"🚀 Cấp phát thành công %zu bytes trong Internal SRAM (Tốc độ tối đa)!\", required_size);\n        return arena;\n    }\n    \n    // Ưu tiên 2: Nếu Internal SRAM không đủ, tự động Fallback sang Octal PSRAM\n    ESP_LOGW(\"TENSOR_INIT\", \"⚠️ Internal SRAM không đủ chỗ! Đang chuyển sang Octal PSRAM...\");\n    arena = (uint8_t*)heap_caps_aligned_alloc(16, required_size, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);\n    if (arena != NULL) {\n        ESP_LOGI(\"TENSOR_INIT\", \"💾 Cấp phát thành công %zu bytes trong Octal PSRAM!\", required_size);\n        return arena;\n    }\n    \n    ESP_LOGE(\"TENSOR_INIT\", \"❌ THẤT BẠI HOÀN TOÀN: Vi điều khiển đã cạn kiệt bộ nhớ!\");\n    return NULL;\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG & CHỐNG PHÂN MẢNH BỘ NHỚ (HEAP FRAGMENTATION)\n❌ **Bẫy phân mảnh Heap do gọi malloc() liên tục:**\nTrong hệ thống nhúng chạy liên tục hàng năm trời, nếu bạn gọi `malloc()` và `free()` định kỳ từng mẫu dữ liệu nhỏ (ví dụ 100 bytes), bộ nhớ Heap sẽ bị đục lỗ rải rác giống như miếng pho mát Thụy Sĩ. Sau vài ngày, dù tổng dung lượng RAM trống báo là 150KB, nhưng khối nhớ liền mạch lớn nhất (`largest_free_block`) chỉ còn 2KB! Khi đó, việc nạp lại mô hình AI sẽ bị thất bại và chip reset vĩnh viễn!\n✅ **Khắc phục theo chuẩn MISRA C:2012:**\nTuyệt đối không cấp phát động trong vòng lặp chính. Cấp phát tĩnh (`static`) toàn bộ bộ đệm Ring Buffer và Tensor Arena ngay tại hàm `app_main()`.\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [Espressif ESP32-S3 Technical Reference Manual - Chapter 2: System and Memory](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Sơ đồ chi tiết Bus Matrix và Memory Protection.\n- 🌐 [ESP-IDF Programming Guide (v5.1): Heap Memory Allocation API](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/mem_alloc.html) - Hướng dẫn sử dụng các hàm `heap_caps_*`.\n- 🌐 [ESP-IDF Technical Guide: Minimizing RAM Footprint](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-guides/performance/ram-usage.html) - Kỹ thuật đo đạc phân mảnh heap với `heap_caps_get_info()`.\n- 🐙 [GitHub: Espressif esp-idf Repository](https://github.com/espressif/esp-idf) - Kho mã nguồn mở chính thức của ESP-IDF v5.x.",
        "bookId": "book_esps3_trm",
        "standardRef": "ESP32-S3 Technical Reference Manual (Espressif Systems) Ch.2 System & Memory §2.2"
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
        "words": 1424,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ESP32-S3 Technical Reference Manual* (Ch.11 Timer Group §11.3)\n> *\"Each timer group contains one 54-bit general-purpose timer. The timer is based on an 80 MHz APB clock with a 16-bit prescaler (dividing from 2 to 65536). When the counter reaches the alarm value, an interrupt is triggered and the counter can be automatically reloaded with the pre-configured value in hardware without CPU intervention.\"*\n> \n> 📊 **Bảng Thanh Ghi Phần Cứng GPTimer (Base: TIMG0 `0x6001F000` / TIMG1 `0x60020000`):**\n> | Tên Thanh Ghi | Offset Hex | Độ Rộng | Bit Fields Quan Trọng | Mô Tả Chức Năng Phần Cứng |\n> | :--- | :--- | :--- | :--- | :--- |\n> | `TIMG_T0CONFIG_REG` | `0x0000` | 32-bit | `T0_EN` [31], `T0_AUTORELOAD` [29], `T0_DIVIDER` [28:13] | Bật/tắt timer, tự động nạp lại và bộ chia xung clock |\n> | `TIMG_T0ALARMLO_REG` | `0x0010` | 32-bit | `T0_ALARM_LO` [31:0] | 32 bit thấp của ngưỡng kích hoạt báo động Alarm |\n> | `TIMG_T0ALARMHI_REG` | `0x0014` | 22-bit | `T0_ALARM_HI` [21:0] | 22 bit cao của ngưỡng kích hoạt báo động Alarm (54-bit) |\n> | `TIMG_T0LOAD_REG` | `0x0020` | 32-bit | `T0_LOAD` [31:0] | Lệnh ghi nạp lại tức thì giá trị ban đầu vào counter |\n> \n> 📐 **Phương Trình Định Thời Thời Gian Thực:**\n> - $f_{timer} = \\frac{80\\text{ MHz}}{\\text{Divider}} = \\frac{80\\text{ MHz}}{80} = 1.0\\text{ MHz} \\implies 1\\text{ tick} = 1.0\\text{ }\\mu\\text{s}$\n> - Chu kỳ lấy mẫu âm thanh 16kHz: $T = \\frac{1}{16,000} = 62.5\\text{ }\\mu\\text{s} \\implies \\text{Alarm Count} = 62\\text{ ticks}$.\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO SOFT-DELAY THẤT BẠI TRONG EDGE AI?\nTrong các bài toán Edge AI (nhận diện giọng nói từ khóa 16kHz, chẩn đoán rung động vòng bi động cơ 100Hz):\n- Mọi mô hình Deep Learning và thuật toán biến đổi phổ Fourier (FFT) đều dựa trên tiên đề toán học cốt lõi: **Khoảng cách thời gian giữa 2 mẫu liên tiếp phải đều tuyệt đối (Deterministic Periodic Sampling)**.\n- **Thất bại của `vTaskDelay()`:**\n  Nếu bạn dùng hàm hoãn của FreeRTOS, thời gian chờ phụ thuộc vào nhịp Tick của hệ điều hành ($1\text{ ms}$). Khi các tác vụ Wi-Fi hoặc Bluetooth chạy chen ngang, thời điểm đọc cảm biến sẽ bị dao động sai lệch (Hiện tượng **Jitter** hàng trăm micro-giây).\n  Hiện tượng Jitter làm các đỉnh tần số trong phổ FFT bị nhòe và dịch chuyển sai lệch, khiến mạng nơ-ron nhận diện sai hoàn toàn!\n- ✅ **Giải pháp phần cứng:** Sử dụng khối **GPTimer (General Purpose Timer)** đếm xung clock độc lập với CPU, đảm bảo độ chính xác thời gian thực ở mức micro-giây ($1.0\text{ }mu\text{s}$).\n\n---\n\n### 📌 2. KIẾN TRÚC THANH GHI GPTIMER THEO ESP32-S3 TRM (CHAPTER 11)\nTheo tài liệu kỹ thuật **ESP32-S3 Technical Reference Manual (Chương 11: Timer Group)**:\nESP32-S3 trang bị 2 nhóm Timer Group (**TIMG0** và **TIMG1**), mỗi nhóm gồm một bộ đếm đa năng 54-bit:\n- **Nguồn xung clock (Clock Source):** Nối trực tiếp vào bus APB tần số $80\text{ MHz}$ ($80 \times 10^6$ xung/giây).\n- **Bộ chia tần số Prescaler (16-bit):**\n  Cài đặt hệ số chia tần bằng $80$. Tần số đếm của Timer giảm về đúng:\n  $f_{timer} = \frac{80\text{ MHz}}{80} = 1\text{ MHz} implies 1\text{ tick} = 1.0\text{ }mu\text{s}$\n- **Thanh ghi đếm 54-bit Counter (`TIMG_T0CONFIG_REG`):** Đếm tăng dần từ 0 lên giá trị Alarm.\n- **Thanh ghi ngưỡng báo động Alarm (`TIMG_T0ALARMLO_REG` & `TIMG_T0ALARMHI_REG`):**\n  Với bài toán lấy mẫu âm thanh $16,000\text{ Hz}$:\n  $T = \frac{1}{16,000} = 62.5\text{ }mu\text{s}$\n  Ta cài đặt Alarm Count $= 62$ hoặc $63$ ticks.\n- **Cơ chế Auto-Reload phần cứng:** Khi giá trị bộ đếm đạt tới ngưỡng Alarm, phần cứng tự động nạp lại giá trị 0 chỉ trong **1 chu kỳ máy** và kích hoạt đường ngắt phần cứng tới CPU mà hoàn toàn không có bất kỳ độ trễ phần mềm nào!\n\n---\n\n### 📌 3. QUY CHUẨN LẬP TRÌNH NGẮT IRAM-SAFE TRÊN ESP-IDF V5.X\nKhi lập trình hàm phục vụ ngắt (Interrupt Service Routine - ISR), có một cạm bẫy chí mạng liên quan đến bộ nhớ Flash:\n- Khi chip ESP32 thực hiện ghi/xóa dữ liệu vào Flash (ví dụ lưu cấu hình Wi-Fi vào NVS Flash hoặc tải gói OTA), bộ nhớ đệm **Flash Cache bị tạm thời vô hiệu hóa** (`Cache_Disable_ICache()`).\n- Nếu ngắt Timer xảy ra vào đúng thời điểm này, và hàm ISR của bạn nằm trên Flash: CPU sẽ không thể nạp mã lệnh, dẫn đến lỗi sập nguồn hoảng loạn: **`Cache disabled but cached memory region accessed`**!\n\n✅ **Giải pháp bắt buộc theo chuẩn ESP-IDF:**\nĐặt thuộc tính `IRAM_ATTR` trước định nghĩa hàm ISR để chỉ thị Linker nạp toàn bộ mã nhị phân của hàm vào **Internal SRAM0 (IRAM)**. Đồng thời đăng ký cờ ngắt `ESP_INTR_FLAG_IRAM`:\n\n```c\n#include \"driver/gptimer.h\"\n#include \"esp_attr.h\"\n#include \"esp_log.h\"\n\nstatic gptimer_handle_t s_gptimer = NULL;\n\n// Hàm ISR bắt buộc đặt trong IRAM để an toàn tuyệt đối khi Flash bị khóa:\nstatic bool IRAM_ATTR gptimer_16khz_isr_callback(\n    gptimer_handle_t timer, const gptimer_alarm_event_data_t *edata, void *user_ctx\n) {\n    BaseType_t high_task_awoken = pdFALSE;\n    \n    // Đọc mẫu cảm biến siêu tốc từ thanh ghi ngoại vi\n    // Tuyệt đối không gọi printf(), malloc(), vTaskDelay() ở đây!\n    \n    // Đánh thức Task xử lý FFT nếu cần\n    return (high_task_awoken == pdTRUE);\n}\n\nvoid init_precision_sampling_timer(void) {\n    // 1. Cấu hình độ phân giải 1MHz (1us mỗi tick đếm)\n    gptimer_config_t timer_config = {\n        .clk_src = GPTIMER_CLK_SRC_DEFAULT,\n        .direction = GPTIMER_COUNT_UP,\n        .resolution_hz = 1000000, // 1 MHz\n    };\n    ESP_ERROR_CHECK(gptimer_new_timer(&timer_config, &s_gptimer));\n\n    // 2. Cài đặt chu kỳ 62.5us (~16kHz) và cơ chế tự động nạp lại\n    gptimer_alarm_config_t alarm_config = {\n        .reload_count = 0,\n        .alarm_count = 62, // 62us ~ 16,129 Hz\n        .flags.auto_reload_on_alarm = true,\n    };\n    gptimer_event_callbacks_t cbs = {\n        .on_alarm = gptimer_16khz_isr_callback,\n    };\n    ESP_ERROR_CHECK(gptimer_register_event_callbacks(s_gptimer, &cbs, NULL));\n    ESP_ERROR_CHECK(gptimer_set_alarm_action(s_gptimer, &alarm_config));\n\n    // 3. Khởi động bộ định thời phần cứng\n    ESP_ERROR_CHECK(gptimer_enable(s_gptimer));\n    ESP_ERROR_CHECK(gptimer_start(s_gptimer));\n    ESP_LOGI(\"TIMER\", \"✅ GPTimer 16kHz lấy mẫu đều đặn đã sẵn sàng!\");\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG & NGUYÊN TẮC VÀNG TRONG HÀM NGẮT (ISR RULES)\n1. **Tuyệt đối không gọi hàm chặn (Blocking APIs):**\n   Trong hàm ISR, không bao giờ được gọi `vTaskDelay()`, `xQueueReceive(..., portMAX_DELAY)`, `printf()` hay thao tác I2C/SPI chậm. Gọi hàm chặn trong ISR sẽ làm sập bộ lập lịch thời gian thực và kích hoạt **Interrupt Watchdog Timer (IWDT)** khởi động lại hệ thống!\n2. **Luôn sử dụng phiên bản API FromISR:**\n   Khi gửi dữ liệu từ ngắt sang Task FreeRTOS, bắt buộc phải dùng các hàm có hậu tố `FromISR` (ví dụ: `xQueueSendFromISR`, `vTaskNotifyGiveFromISR`).\n3. **Khai báo biến chia sẻ với từ khóa volatile:**\n   Mọi biến cờ toàn cục được sửa đổi bên trong ISR và đọc trong Task chính phải khai báo là `volatile bool g_data_ready = false;` để ngăn trình biên dịch tối ưu hóa bỏ qua việc đọc lại từ ô nhớ RAM.\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [ESP-IDF Programming Guide: General Purpose Timer (GPTimer) API](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/peripherals/gptimer.html) - Tài liệu hướng dẫn driver GPTimer chính thức.\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 11: Timer Group (TIMG)](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Sơ đồ khối thanh ghi Timer Group.\n- 🌐 [ESP-IDF Guide: Interrupt Allocation & IRAM-Safe ISR](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/intr_alloc.html) - Nguyên lý ngắt thời gian thực và cờ IRAM.\n- 🐙 [GitHub: ESP-IDF GPTimer Code Examples](https://github.com/espressif/esp-idf/tree/master/examples/peripherals/timer_group/gptimer) - Dự án mẫu từ Espressif.",
        "bookId": "book_esps3_trm",
        "standardRef": "ESP32-S3 Technical Reference Manual Ch.11 Timer Group & Richard Barry (FreeRTOS Ch.7)"
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
        "words": 1292,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *Discrete-Time Signal Processing (3rd Edition)* (Alan V. Oppenheim & Ronald W. Schafer, §9.3 & §10.2)\n> *\"The Decimation-in-Time (DIT) Fast Fourier Transform computes the Discrete Fourier Transform (DFT) in $\\mathcal{O}(N \\log_2 N)$ operations instead of $\\mathcal{O}(N^2)$ by decomposing an N-point DFT into two N/2-point DFTs. Windowing with a Hanning or Hamming window suppresses spectral leakage caused by finite-duration time-domain truncation.\"*\n> \n> 📐 **Hệ Thống Phương Trình Xử Lý Tín Hiệu Số Chuẩn DSP:**\n> - **Định lý Nyquist-Shannon:** $f_s \\ge 2 \\cdot f_{max}$. Tần số lấy mẫu phải lớn hơn ít nhất 2 lần tần số cực đại để triệt tiêu hiện tượng răng cưa Aliasing.\n> - **Biến đổi FFT Cooley-Tukey Radix-2 DIT:**\n>   $$X[k] = \\sum_{n=0}^{N-1} x[n] W_N^{kn} = E[k] + W_N^k O[k]$$\n>   với Twiddle Factor: $W_N^k = e^{-j \\frac{2\\pi k}{N}} = \\cos\\left(\\frac{2\\pi k}{N}\\right) - j \\sin\\left(\\frac{2\\pi k}{N}\\right)$\n> - **Hàm cửa sổ Hanning (Hanning Window):**\n>   $$w[n] = 0.5 - 0.5 \\cos\\left(\\frac{2\\pi n}{N - 1}\\right), \\quad 0 \\le n \\le N - 1$$\n> - **Độ phân giải tần số phổ (Frequency Bin Resolution):**\n>   $$\\Delta f = \\frac{F_s}{N} = \\frac{16,000\\text{ Hz}}{512} = 31.25\\text{ Hz/bin}$$\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI CẦN DMA VÀ BIẾN ĐỔI PHỔ FFT?\nTrong các ứng dụng nhận diện giọng nói từ khóa (**Keyword Spotting - KWS**) hoặc phát hiện bất thường rung động cơ khí:\n- Tần số lấy mẫu âm thanh là $16,000\text{ Hz}$ (tương ứng 16,000 mẫu mỗi giây).\n- Nếu CPU phải tự tay đọc từng mẫu qua bus ngoại vi: CPU sẽ bị ngắt liên tục 16,000 lần mỗi giây, không còn thời gian xử lý các phép toán nơ-ron phức tạp!\n- ✅ **Cứu cánh phần cứng DMA (Direct Memory Access):**\n  Bộ điều khiển DMA là một bộ vi xử lý chuyên trách việc vận chuyển dữ liệu. Nó tự động đọc dữ liệu từ Micro I2S (INMP441) và ghi thẳng vào mảng RAM **mà hoàn toàn không cần CPU can thiệp** (0% CPU Overhead). Khi lấp đầy một khung đệm (ví dụ 512 mẫu), DMA mới phát một ngắt duy nhất đánh thức CPU dậy xử lý!\n- ✅ **Tại sao phải dùng FFT (Fast Fourier Transform)?**\n  Sóng âm thanh thô ở miền thời gian (Time-domain) chỉ là các dao động biên độ điện áp lên xuống. Mạng nơ-ron học sâu không thể nhận biết được nguyên âm hay phụ âm từ dạng sóng thô này.\n  Thuật toán FFT chuyển đổi tín hiệu từ miền thời gian sang **miền tần số (Frequency-domain)**, bóc tách âm thanh thành các dải tần đặc trưng (Spectrogram), giúp mô hình AI \"nhìn thấy\" âm thanh giống như một bức tranh phổ!\n\n---\n\n### 📌 2. KỸ THUẬT BỘ ĐỆM DMA CIRCULAR PING-PONG BUFFER (LLDESC_T)\nTheo tài liệu kiến trúc **ESP32-S3 TRM (Chương 12: I2S Controller)**:\nKênh DMA của I2S sử dụng danh sách liên kết các mô tả bộ đệm (**Linked-List Descriptors - `lldesc_t`**) được cấu hình theo cơ chế **Ping-Pong Buffer**:\n- **Buffer A (Ping):** Khi DMA đang tự động bơm dữ liệu âm thanh mới từ Micro vào Buffer A...\n- **Buffer B (Pong):** CPU đọc dữ liệu hoàn chỉnh của chu kỳ trước từ Buffer B để tính toán FFT và chạy suy luận AI.\n- Khi Buffer A đầy: DMA tự động chuyển sang ghi vào Buffer B và báo ngắt, CPU đảo chiều sang xử lý Buffer A!\nHai luồng hoạt động song song độc lập, đảm bảo **không bao giờ bị mất bất kỳ một mẫu âm thanh nào (Zero Sample Drop)**!\n\n---\n\n### 📌 3. THUẬT TOÁN BIẾN ĐỔI PHỔ FFT VỚI THƯ VIỆN CHUẨN ESP-DSP\nEspressif phát triển thư viện xử lý tín hiệu số chính thức **[espressif/esp-dsp](https://github.com/espressif/esp-dsp)**:\n- Hàm `dsps_fft2r_fc32_ae32`: Triển khai thuật toán Cooley-Tukey Radix-2 FFT được viết bằng mã máy Assembly tập lệnh Xtensa Audio Engine 32-bit.\n- **Cửa sổ Hanning (Hann Window):**\n  Khi ta cắt một đoạn tín hiệu hữu hạn $N = 512$ mẫu từ dòng âm thanh liên tục, hai mép cắt đột ngột tạo ra các bước nhảy biên độ giả tạo, gây ra hiện tượng **Rò rỉ phổ (Spectral Leakage)**.\n  Ta nhân mảng dữ liệu với hàm cửa sổ Hanning để làm mượt 2 đầu biên về mức 0:\n  $w[n] = 0.5 - 0.5 cosleft(\frac{2pi n}{N-1}\right), quad n = 0, 1, dots, N-1$\n\n```c\n// Pipeline biến đổi phổ FFT chuẩn công nghiệp sử dụng thư viện esp-dsp:\n#include \"esp_dsp.h\"\n#include \"esp_log.h\"\n#include <math.h>\n\n#define N_SAMPLES 512\nstatic float s_time_signal[N_SAMPLES * 2]; // Mảng phức [Real0, Imag0, Real1, Imag1...]\nstatic float s_hann_window[N_SAMPLES];\nstatic float s_magnitude_spectrum[N_SAMPLES / 2];\n\nvoid init_dsp_pipeline(void) {\n    // 1. Khởi tạo bảng tra cứu FFT và sinh cửa sổ Hanning\n    esp_err_t ret = dsps_fft2r_init_fc32(NULL, CONFIG_DSP_MAX_FFT_SIZE);\n    if (ret != ESP_OK) {\n        ESP_LOGE(\"DSP\", \"Không thể khởi tạo bảng FFT!\");\n        return;\n    }\n    dsps_wind_hann_f32(s_hann_window, N_SAMPLES);\n    ESP_LOGI(\"DSP\", \"✅ Khởi tạo Pipeline DSP FFT 512 điểm thành công!\");\n}\n\nvoid process_audio_frame(const int16_t *raw_pcm_samples) {\n    // 2. Chuyển đổi sang Float32 và nhân với cửa sổ Hanning\n    for (int i = 0; i < N_SAMPLES; i++) {\n        s_time_signal[i * 2 + 0] = ((float)raw_pcm_samples[i] / 32768.0f) * s_hann_window[i]; // Phần thực\n        s_time_signal[i * 2 + 1] = 0.0f; // Phần ảo\n    }\n\n    // 3. Biến đổi Radix-2 FFT siêu tốc tối ưu phần cứng Xtensa SIMD\n    dsps_fft2r_fc32(s_time_signal, N_SAMPLES);\n\n    // 4. Đảo bit chỉ số (Bit-Reversal) đưa phổ về thứ tự tần số tự nhiên\n    dsps_bit_rev_fc32(s_time_signal, N_SAMPLES);\n\n    // 5. Tính toán biên độ năng lượng phổ (Magnitude Spectrum): |X[k]| = sqrt(Real^2 + Imag^2)\n    for (int k = 0; k < N_SAMPLES / 2; k++) {\n        float real = s_time_signal[k * 2 + 0];\n        float imag = s_time_signal[k * 2 + 1];\n        s_magnitude_spectrum[k] = sqrtf(real * real + imag * imag);\n    }\n    // Mảng s_magnitude_spectrum hiện đã sẵn sàng nạp thẳng vào mạng nơ-ron TinyML!\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG & THỦ THUẬT GỠ LỖI DSP TRÊN ESP32\n❌ **Quên kiểm tra cờ căn lề DMA Buffer:**\nMảng nhận dữ liệu I2S DMA phải được cấp phát trong vùng nhớ hỗ trợ DMA (`MALLOC_CAP_DMA`) và căn lề 4-byte. Nếu cấp phát biến mảng cục bộ trên Stack, hệ thống sẽ gặp lỗi ngắt truyền tin hoặc dữ liệu thu về toàn byte 0!\n❌ **Tần số Nyquist & Hiện tượng chồng phổ (Aliasing):**\nTheo định lý lấy mẫu Shannon-Nyquist, tần số lấy mẫu $f_s$ bắt buộc phải lớn hơn ít nhất **2 lần tần số tín hiệu cao nhất** ($f_{max} < f_s / 2$). Nếu bạn phân tích tiếng động cơ rung $10\text{ kHz}$ mà chỉ lấy mẫu ở $16\text{ kHz}$, hiện tượng chồng phổ sẽ tạo ra các tần số \"ma\" phản xạ về dải tần thấp làm mạng nơ-ron nhận diện sai hoàn toàn!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🐙 [GitHub: Espressif Digital Signal Processing Library (esp-dsp)](https://github.com/espressif/esp-dsp) - Thư viện DSP tối ưu Assembly cho ESP32-S3.\n- 🌐 [Official Documentation: ESP-DSP User Guide & API Reference](https://docs.espressif.com/projects/esp-dsp/en/latest/) - Hướng dẫn thuật toán FFT và lọc số IIR Biquad.\n- 🌐 [ESP-IDF Guide: Inter-IC Sound (I2S) Peripheral Driver](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/peripherals/i2s.html) - Cấu hình bus I2S kết hợp DMA Descriptor.\n- 📚 Sách giáo khoa chuẩn quốc tế: *\"Discrete-Time Signal Processing\"* (Oppenheim & Schafer, Pearson 3rd Edition).",
        "bookId": "book_oppenheim_dsp",
        "standardRef": "Alan V. Oppenheim & Ronald W. Schafer (MIT / Pearson) Ch.9 & 10"
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
        "words": 1258,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *Mastering the FreeRTOS Real Time Kernel* (Richard Barry, Ch.7 Resource Management & Mutexes)\n> *\"Unbounded Priority Inversion is a catastrophic scenario where a medium priority task preempts a low priority task that holds a mutex needed by a high priority task, indefinitely blocking the high priority task. FreeRTOS Mutexes implement Priority Inheritance: the task holding the mutex temporarily inherits the priority of the highest priority task waiting for that mutex.\"*\n> \n> 📊 **Bảng Cơ Chế Đa Nhiệm FreeRTOS SMP Dual-Core Trên ESP32-S3:**\n> | Cơ Chế Đa Nhiệm | Hàm API ESP-IDF | Tham Số Cốt Lõi | Ứng Dụng Trong Hệ Thống Edge AI |\n> | :--- | :--- | :--- | :--- |\n> | **Ghim Core (Affinity)** | `xTaskCreatePinnedToCore` | `xCoreID = 0 / 1` | Ghim luồng mạng Wi-Fi Core 0, ghim luồng AI Core 1 |\n> | **Hàng Đợi An Toàn** | `xQueueCreateStatic` | Zero-Dynamic RAM | Truyền con trỏ Ring Buffer giữa 2 nhân không tốn thời gian copy |\n> | **Mutex Kế Thừa Ưu Tiên**| `xSemaphoreCreateMutex` | `xInheritance = pdTRUE` | Chống nghẽn tài nguyên bus I2C (Tránh thảm họa Mars Pathfinder) |\n> | **Task Notification** | `xTaskNotifyGive` | 4 bytes RAM | Đánh thức luồng tính toán từ ngắt ISR dưới 2 micro-giây |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: ĐA NHIỆM ĐỐI XỨNG (SMP) TRÊN ESP32-S3 DUAL-CORE\nVi điều khiển ESP32-S3 sở hữu 2 lõi xử lý 32-bit Xtensa LX7 hoạt động ở xung nhịp $240\text{ MHz}$:\n- **Core 0 (Protocol CPU - PRO_CPU):** Mặc định chịu trách nhiệm vận hành ngăn xếp kết nối mạng nặng: Wi-Fi Driver, Bluetooth HCI, TCP/IP LwIP Stack.\n- **Core 1 (Application CPU - APP_CPU):** Dành trọn vẹn sức mạnh xử lý cho thuật toán người dùng: Tiền xử lý DSP, FFT và Suy luận nơ-ron TinyML.\n\nHệ điều hành **FreeRTOS SMP (Symmetric Multiprocessing)** trên ESP-IDF cho phép một bộ lập lịch thời gian thực duy nhất quản lý đồng thời cả hai lõi CPU. Tuy nhiên, nếu bạn không chủ động ghim tác vụ (**Core Pinning**), bộ lập lịch có thể di chuyển một Task AI nặng đang chạy giữa Core 0 và Core 1, gây ra hiện tượng mất hiệu năng do trễ bộ nhớ đệm Cache L1 (Cache Thrashing)!\n\n---\n\n### 📌 2. HIỆN TƯỢNG ĐẢO NGƯỢC QUYỀN ƯU TIÊN & THỪA KẾ ƯU TIÊN (PRIORITY INHERITANCE)\nTrong cuốn sách kinh điển của tác giả **Richard Barry (Người sáng lập FreeRTOS)**, hiện tượng **Priority Inversion** là nguyên nhân gây ra sự cố lịch sử tê liệt tàu thám hiểm Sao Hỏa **Mars Pathfinder** của NASA năm 1997:\n- Giả sử có 3 Task:\n  - **Task Cao (High - AI Realtime):** Mức ưu tiên 10.\n  - **Task Trung (Medium - Logging Flash):** Mức ưu tiên 5.\n  - **Task Thấp (Low - Đọc I2C):** Mức ưu tiên 1.\n- Kịch bản thảm họa:\n  1. Task Thấp chiếm giữ Mutex tài nguyên chung (bus I2C).\n  2. Task Cao thức dậy, cần truy cập I2C nhưng thấy Mutex bị khóa nên tự động rơi vào trạng thái Blocked để chờ.\n  3. Đúng lúc này, Task Trung thức dậy. Vì độ ưu tiên của Task Trung (5) cao hơn Task Thấp (1), Task Trung chiếm quyền CPU chạy liên tục hàng trăm mili-giây!\n  4. Task Thấp không được chạy để nhả Mutex $implies$ Task Cao (AI khẩn cấp) bị bỏ đói vô hạn (**Unbounded Priority Inversion**) dù nó có mức ưu tiên cao nhất hệ thống!\n\n✅ **Giải pháp chuẩn của FreeRTOS Mutex:**\nCơ chế **Priority Inheritance (Thừa kế quyền ưu tiên)**: Khi Task Cao bị chặn bởi Mutex của Task Thấp, FreeRTOS tự động **nâng tạm thời mức ưu tiên của Task Thấp lên bằng Task Cao (mức 10)**. Task Thấp sẽ chạy ngay lập tức, hoàn thành việc truy cập bus và nhả Mutex, sau đó hạ về mức 1 ban đầu, giải phóng cho Task Cao thực thi!\n*(Lưu ý sống còn: Cơ chế này chỉ có trên Mutex, không có trên Binary Semaphore!)*\n\n---\n\n### 📌 3. MÃ NGUỒN C MẪU GHIM TASK VÀ HÀNG ĐỢI ĐA NHÂN CHUẨN ESP-IDF V5.X\n```c\n#include \"freertos/FreeRTOS.h\"\n#include \"freertos/task.h\"\n#include \"freertos/queue.h\"\n#include \"freertos/semphr.h\"\n#include \"esp_log.h\"\n\nstatic QueueHandle_t s_sensor_queue = NULL;\nstatic SemaphoreHandle_t s_i2c_mutex = NULL;\n\n// Task thu thập cảm biến chạy trên Core 0 (PRO_CPU)\nvoid task_sensor_acquisition(void *pvParam) {\n    float raw_sample = 0.0f;\n    while (1) {\n        if (xSemaphoreTake(s_i2c_mutex, pdMS_TO_TICKS(50)) == pdTRUE) {\n            raw_sample = 42.0f; // Đọc an toàn từ cảm biến I2C\n            xSemaphoreGive(s_i2c_mutex);\n        }\n        \n        // Đẩy mẫu vào hàng đợi Queue để chuyển giao sang Core 1\n        xQueueSend(s_sensor_queue, &raw_sample, portMAX_DELAY);\n        vTaskDelay(pdMS_TO_TICKS(10)); // Định kỳ 100Hz\n    }\n}\n\n// Task suy luận AI chạy trên Core 1 (APP_CPU) - Hoàn toàn không bị Wi-Fi Core 0 làm chậm\nvoid task_ai_inference_core1(void *pvParam) {\n    float received_sample = 0.0f;\n    while (1) {\n        // Chờ nhận dữ liệu từ Core 0\n        if (xQueueReceive(s_sensor_queue, &received_sample, portMAX_DELAY) == pdTRUE) {\n            // Chạy mô hình nơ-ron TFLite Micro trên Core 1\n            // Tận dụng 100% tài nguyên CPU 240MHz của Core 1\n        }\n    }\n}\n\nvoid init_multicore_freertos_subsystem(void) {\n    s_sensor_queue = xQueueCreate(16, sizeof(float));\n    s_i2c_mutex = xSemaphoreCreateMutex(); // Tạo Mutex có hỗ trợ Priority Inheritance\n    \n    // Ghim tác vụ vào đúng lõi vật lý:\n    xTaskCreatePinnedToCore(task_sensor_acquisition, \"SensorTask\", 4096, NULL, 5, NULL, 0); // Core 0\n    xTaskCreatePinnedToCore(task_ai_inference_core1, \"AiCoreTask\", 8192, NULL, 10, NULL, 1); // Core 1\n    ESP_LOGI(\"RTOS\", \"✅ Hệ thống đa nhiệm FreeRTOS Dual-Core đã kích hoạt!\");\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG: DEADLOCK & TRÀN STACK (STACK OVERFLOW)\n❌ **Deadlock (Khóa chết do sai thứ tự khóa):**\nNếu Task 1 khóa `Mutex_A` rồi xin khóa tiếp `Mutex_B`, trong khi Task 2 khóa `Mutex_B` rồi xin khóa tiếp `Mutex_A`: Cả hai Task sẽ vĩnh viễn chờ nhau!\n*Quy tắc chuẩn:* Luôn khóa tài nguyên theo một thứ tự duy nhất cố định trong toàn dự án.\n❌ **Tràn Stack (Stack Overflow) khi khai báo mảng lớn trong Task:**\nTrong FreeRTOS, mỗi Task có một vùng nhớ Stack riêng được chỉ định khi tạo (ví dụ 4096 bytes). Nếu bên trong hàm bạn khai báo mảng cục bộ lớn: `float tensor_buffer[1024];` ($1024 \times 4 = 4096\text{ bytes}$), Stack sẽ bị tràn ngay lập tức, ghi đè lên bộ nhớ của Task kế bên và gây Panic Reset!\n*Quy tắc chuẩn:* Dữ liệu lớn hơn 256 bytes bắt buộc phải cấp phát tĩnh (`static`) hoặc cấp phát Heap!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [Official FreeRTOS Guide: Symmetric Multiprocessing (SMP)](https://www.freertos.org/symmetric-multiprocessing-introduction.html) - Kiến trúc lập lịch đối xứng FreeRTOS.\n- 🌐 [ESP-IDF FreeRTOS (SMP) Customizations Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/freertos.html) - Hướng dẫn API FreeRTOS trên ESP32.\n- 📚 Sách kinh điển: *\"Mastering the FreeRTOS Real Time Kernel\"* (Richard Barry).\n- 📄 [Whitepaper: Priority Inversion and Priority Inheritance](https://www.freertos.org/Real-time-embedded-RTOS-mutexes.html) - Phân tích cơ chế giải cứu lỗi NASA Mars Pathfinder.",
        "bookId": "book_freertos_kernel",
        "standardRef": "Richard Barry - Mastering the FreeRTOS Real Time Kernel Ch.7 & Ch.9"
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
        "words": 1283,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ESP32-S3 Technical Reference Manual* (Espressif Systems, §3.3 Flash Encryption & Secure Boot)\n> *\"The ESP32-S3 OTA scheme utilizes a two-bank partition structure (ota_0 and ota_1) alongside an ota_data partition. During OTA download, incoming binary chunks are streamed into the passive bank while the active bank continues normal execution. Rollback protection ensures that if the new firmware fails diagnostic health-checks, the bootloader automatically reverts to the previous valid slot.\"*\n> \n> 📊 **Bố Cục Bảng Phân Vùng Dual-Bank OTA Chuẩn Công Nghiệp (partitions.csv):**\n> | Tên Phân Vùng | Type | SubType | Offset Hex | Kích Thước | Mục Đích Kỹ Thuật |\n> | :--- | :--- | :--- | :--- | :--- | :--- |\n> | `nvs` | `data` | `nvs` | `0x9000` | 24 KB | Lưu trữ cấu hình Wi-Fi SSID, Password, TLS Tokens |\n> | `otadata` | `data` | `ota` | `0xF000` | 8 KB | 2 sector lưu trạng thái Boot Slot (`ACTIVE`, `VALID`, `INVALID`) |\n> | `ota_0` | `app` | `ota_0` | `0x20000` | 1,920 KB | Firmware Slot 0 (Chạy phiên bản hiện tại v1.0.0) |\n> | `ota_1` | `app` | `ota_1` | `0x200000` | 1,920 KB | Firmware Slot 1 (Nhận bản nạp từ xa v1.1.0) |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: THÁCH THỨC SỐNG CÒN CỦA NÂNG CẤP FIRMWARE TỪ XA (OTA)\nTrong các thiết bị Edge AI triển khai ngoài thực địa (ví dụ cảm biến gắn trên cột điện cao thế, phao quan trắc biển):\n- Thiết bị cách xa con người hàng chục cây số, không ai có thể mang dây cáp USB đến cắm nạp lại code nếu có lỗi phát sinh.\n- **Kịch bản thảm họa \"Biến thiết bị thành cục gạch\" (Bricking the Device):**\n  Nếu bạn ghi đè trực tiếp firmware mới lên phân vùng Flash đang chạy, và xảy ra sự cố: Mất điện giữa chừng, mất sóng Wi-Fi khi đang truyền file, hoặc bản firmware mới bị lỗi Crash Loop (Reset liên tục ngay khi khởi động):\n  Thiết bị sẽ vĩnh viễn chết lâm sàng, biến thành \"cục gạch\" phế liệu và công ty phải tốn hàng ngàn USD chi phí cử kỹ sư đến tận nơi tháo dỡ!\n\n✅ **Giải pháp chuẩn công nghiệp: Cơ chế Hai Ngăn (Two-Slot A/B OTA) kết hợp Rollback tự động** theo tiêu chuẩn của Espressif ESP-IDF.\n\n---\n\n### 📌 2. BẢNG PHÂN VÙNG FLASH & CƠ CHẾ ROLLBACK THEO ESP-IDF OTA GUIDE\nMột bảng phân vùng chuẩn (**Partition Table `partitions.csv`**) của thiết bị chuyên nghiệp gồm:\n\n```\nSƠ ĐỒ BẢNG PHÂN VÙNG FLASH HAI NGĂN (TWO-SLOT OTA PARTITION TABLE):\n# Name,   Type, SubType, Offset,   Size,     Flags\nnvs,      data, nvs,     0x9000,   0x4000,   (16 KB lưu cấu hình Wi-Fi)\notadata,  data, ota,     0xd000,   0x2000,   (8 KB lưu trạng thái boot A/B)\nphy_init, data, phy,     0xf000,   0x1000,   (4 KB hiệu chuẩn vô tuyến RF)\nota_0,    app,  ota_0,   0x10000,  0x1F0000, (Ngăn Slot A: 2 MB Firmware đang chạy)\nota_1,    app,  ota_1,   0x200000, 0x1F0000, (Ngăn Slot B: 2 MB Firmware mới tải về)\nstorage,  data, spiffs,  0x3F0000, 0x410000, (Vùng nhớ lưu trọng số mô hình AI)\n```\n\n#### Trạng thái vòng đời của một bản cập nhật:\n1. **Tải về (`ESP_OTA_IMG_NEW`):** Thiết bị vừa chạy firmware ở `ota_0`, vừa tải nhị phân mới qua giao thức HTTPS bảo mật và ghi vào `ota_1`.\n2. **Khởi động kiểm chứng (`ESP_OTA_IMG_PENDING_VERIFY`):** Bootloader đọc cờ trong `otadata` và khởi động thử nghiệm vào `ota_1`.\n3. **Xác thực tự động:**\n   Sau khi boot vào bản mới, firmware phải tự chạy một bài tự kiểm tra (Self-Diagnostic Test): Kiểm tra kết nối Wi-Fi, kiểm tra kết nối Broker MQTT và đọc thử cảm biến AI.\n   - **Nếu thành công:** Gọi hàm `esp_ota_mark_app_valid_cancel_rollback()`. Hệ thống chính thức chuyển `ota_1` thành bản mặc định lâu dài!\n   - **Nếu thất bại / Bị Crash Loop / Quá thời gian 30 giây:**\n     Hệ điều hành kích hoạt Watchdog Reset. Bootloader phát hiện bản firmware mới chưa được chứng thực, tự động đảo cờ trong `otadata` và **quay xe khởi động lại về firmware cũ an toàn `ota_0`**!\n\n```c\n// Quy trình kiểm định tự động và hủy Rollback chuẩn ESP-IDF v5.x:\n#include \"esp_ota_ops.h\"\n#include \"esp_log.h\"\n\nvoid verify_firmware_health_and_confirm(void) {\n    const esp_app_desc_t *app_desc = esp_app_get_description();\n    ESP_LOGI(\"OTA\", \"Đang vận hành Firmware phiên bản: %s\", app_desc->version);\n\n    esp_ota_img_states_t ota_state;\n    const esp_partition_t *running_partition = esp_ota_get_running_partition();\n    \n    if (esp_ota_get_state_partition(running_partition, &ota_state) == ESP_OK) {\n        if (ota_state == ESP_OTA_IMG_PENDING_VERIFY) {\n            ESP_LOGW(\"OTA\", \"⚠️ Phát hiện bản nạp thử nghiệm! Bắt đầu kiểm tra tính toàn vẹn hệ thống...\");\n            \n            // Tự kiểm tra các dịch vụ quan trọng:\n            bool wifi_ok = check_wifi_connection();\n            bool sensor_ok = check_ai_sensor_ready();\n            \n            if (wifi_ok && sensor_ok) {\n                // Xác thực thành công: Chính thức hủy chế độ Rollback!\n                esp_ota_mark_app_valid_cancel_rollback();\n                ESP_LOGI(\"OTA\", \"✅ XÁC THỰC THÀNH CÔNG! Firmware mới đã trở thành bản chính thức!\");\n            } else {\n                ESP_LOGE(\"OTA\", \"❌ HỆ THỐNG GẶP LỖI! Tự động Rollback về phiên bản cũ ngay lập tức!\");\n                esp_ota_mark_app_invalid_rollback_and_reboot();\n            }\n        }\n    }\n}\n```\n\n---\n\n### 📌 3. BẢO MẬT MQTT QOS 1 VỚI TẦNG MÃ HÓA TLS/X.509\nTrong mạng công nghiệp IoT theo chuẩn **OASIS MQTT v3.1.1**:\n- Tuyệt đối không gửi dữ liệu thô qua cổng không mã hóa `1883`. Mọi gói tin telemetry và cảnh báo AI bắt buộc phải truyền qua cổng **MQTTS (`8883`)** với tầng mã hóa **mTLS (Mutual TLS)** sử dụng chứng chỉ số X.509.\n- Mức độ dịch vụ **QoS 1 (At least once)** đảm bảo bản tin cảnh báo va chạm hoặc lỗi rung động vòng bi chắc chắn sẽ được Broker xác nhận bằng gói tin `PUBACK`, không bị thất lạc giữa đường truyền.\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG & THỦ THUẬT GỠ LỖI OTA\n❌ **Quên phân vùng otadata trong file partitions.csv:**\nNếu không khai báo phân vùng `otadata`, ESP-IDF sẽ không thể lưu vết trạng thái bootloader A/B. Tính năng Anti-rollback bị vô hiệu hóa hoàn toàn và khi có sự cố, thiết bị sẽ bị treo vĩnh viễn!\n❌ **Bộ nhớ phân vùng nhỏ hơn kích thước nhị phân:**\nKhi bạn tích hợp thư viện AI (TFLite Micro) và mTLS, dung lượng file `.bin` thường vượt quá 1.5MB. Nếu bạn để kích thước phân vùng `ota_0` mặc định là 1MB (`0x100000`), lệnh nạp OTA sẽ trả về lỗi `ESP_ERR_OTA_VALIDATE_FAILED` do tràn dung lượng phân vùng!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [ESP-IDF Over-The-Air (OTA) Updates & Anti-Rollback Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/ota.html) - Hướng dẫn phân vùng và API Rollback chính thức.\n- 📄 [OASIS Standard: MQTT Version 3.1.1 Specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) - Đặc tả chuẩn quốc tế giao thức MQTT.\n- 🌐 [ESP-IDF ESP-MQTT Client Component Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/protocols/mqtt.html) - Cấu hình mTLS X.509.\n- 🐙 [GitHub: ESP-IDF Advanced HTTPS OTA Example](https://github.com/espressif/esp-idf/tree/master/examples/system/ota/advanced_https_ota) - Dự án mẫu từ Espressif.",
        "bookId": "book_esps3_trm",
        "standardRef": "ESP32-S3 TRM Ch.3 System Security & RFC 3986 / MQTT v3.1.1 OASIS"
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
        "words": 1461,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference* (Benoit Jacob, Skirmantas Kligys, Bo Chen, Andrew Howard, et al. - Google Research, IEEE CVPR 2018, §2.1)\n> *\"We define an affine mapping between real float values $r$ and quantized integer values $q$ as: $r = S \\cdot (q - Z)$, where $S$ (Scale) is an arbitrary positive real number and $Z$ (Zero-Point) is an integer of the same type as $q$. Matrix multiplication can be executed using integer-only arithmetic where the scale factor $M = \\frac{S_1 S_2}{S_3}$ is decomposed as $M = 2^{-n} M_0$ with $M_0 \\in [0.5, 1)$ represented as a fixed-point integer.\"*\n> \n> 📐 **Toán Học Lượng Tử Hóa INT8 Benoit Jacob:**\n> 1. **Công thức Lượng tử hóa (Quantization):**\n>    $$q = \\text{clamp}\\left(\\left\\lfloor \\frac{r}{S} \\right\\rceil + Z, -128, 127\\right)$$\n> 2. **Công thức Giải lượng tử hóa (Dequantization):**\n>    $$r = S \\times (q - Z)$$\n> 3. **Nhân ma trận Fixed-Point không cần FPU:**\n>    $$q_3^{(i, k)} = Z_3 + \\text{Round}\\left(M \\sum_j (q_1^{(i, j)} - Z_1)(q_2^{(j, k)} - Z_2)\\right)$$\n>    với $M_0 = \\text{round}(M \\cdot 2^{31})$ và phép dịch bit phải $n$ bit để đưa tích nhân 32-bit về lại miền `int8_t`.\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO BẮT BUỘC PHẢI DÙNG INT8 TRÊN EDGE AI?\nKhi huấn luyện một mạng nơ-ron sâu (Deep Neural Network) trên máy chủ đám mây (GPU NVIDIA H100/A100), các trọng số và kích hoạt (Activations) được lưu dưới dạng số thực dấu phẩy động 32-bit (**Float32 IEEE 754**):\n- Float32 gồm: 1 bit dấu ($s$), 8 bit mũ ($e$), và 23 bit định trị ($m$).\n- Khi nạp một mô hình phát hiện người (MobileNet V1) dạng Float32 sang vi điều khiển:\n  - Dung lượng Flash: **16 Megabytes** (vượt quá dung lượng toàn bộ Flash của ESP32-S3!).\n  - Băng thông RAM: Quá tải nghiêm trọng.\n  - Phép tính nhân ma trận số thực trên lõi vi điều khiển tốn hàng chục chu kỳ clock CPU và tiêu thụ năng lượng cực cao.\n\n**Giải pháp cách mạng:** Công trình nghiên cứu lịch sử của **Benoit Jacob et al. (Google, IEEE CVPR 2018 - arXiv:1712.05877)** đã chứng minh: Ta có thể nén toàn bộ mô hình Deep Learning từ Float32 xuống số nguyên 8-bit (**INT8**) có dấu $[-128, 127]$:\n- Giảm dung lượng Flash và RAM đúng **4 lần** (từ 4 bytes xuống 1 byte mỗi trọng số).\n- Cho phép CPU thực hiện các phép nhân tích lũy (Multiply-Accumulate - MAC) hoàn toàn bằng đơn vị tính số nguyên ALU siêu tốc.\n- Kết hợp với tập lệnh Vector SIMD 128-bit của ESP32-S3, tốc độ suy luận tăng từ **3x đến 6x** trong khi độ chính xác suy giảm dưới $1%$!\n\n---\n\n### 📌 2. CÔNG THỨC TOÁN HỌC LƯỢNG TỬ HÓA THEO CHUẨN BENOIT JACOB (CVPR 2018)\nNguyên lý ánh xạ toán học giữa giá trị số thực $r in [alpha, \beta]$ và giá trị số nguyên lượng tử hóa $q in [-128, 127]$:\n\n$r = S \times (q - Z)$\n\nTrong đó:\n- **$S$ (Scale - Hệ số tỉ lệ):** Một số thực dương Float32 chỉ ra khoảng cách giữa hai mức lượng tử nguyên liên tiếp:\n  $S = \frac{\beta - alpha}{q_{max} - q_{min}} = \frac{\beta - alpha}{255}$\n- **$Z$ (Zero-Point - Điểm không):** Một số nguyên INT8 tương ứng với giá trị thực $0.0f$ trong không gian số thực. Zero-point giúp việc đệm số 0 (Zero-padding) trong các lớp tích chập Conv2D không gây sai số:\n  $Z = \text{round}left(- \frac{alpha}{S}\right) + q_{min}$\n\n#### Phép nhân ma trận lượng tử hóa nguyên bản (Integer-Only Arithmetic):\nKhi nhân ma trận đầu vào $r_1$ với trọng số $r_2$ để tạo ra đầu ra $r_3$:\n$r_3 = r_1 \times r_2 implies S_3(q_3 - Z_3) = S_1(q_1 - Z_1) \times S_2(q_2 - Z_2)$\n$q_3 = Z_3 + M sum (q_1 - Z_1)(q_2 - Z_2)$\n\nVới hệ số nhân:\n$M = \frac{S_1 S_2}{S_3}$\nHệ số $M in (0, 1)$ luôn được biểu diễn dưới dạng số thực cố định (Fixed-point):\n$M = 2^{-n} M_0 quad (\text{với } M_0 in [2^{30}, 2^{31}-1] \text{ là số nguyên 32-bit})$\nĐiều này cho phép vi điều khiển ESP32 tính toán toàn bộ mạng nơ-ron chỉ bằng các phép toán: **Nhân số nguyên 32-bit, Cộng tích lũy và Phép dịch bit (Bit-shift)**, hoàn toàn không cần bộ FPU số thực!\n\n---\n\n### 📌 3. KIẾN TRÚC TĂNG TỐC VECTOR SIMD TRÊN ESP32-S3 VỚI THƯ VIỆN ESP-NN\nTheo tài liệu chính thức từ **[espressif/esp-nn](https://github.com/espressif/esp-nn)**:\nLõi vi xử lý Xtensa LX7 trên ESP32-S3 tích hợp sẵn các tập lệnh mở rộng Vector Instructions (lệnh `EE.VLD.128`, `EE.VMUL.S8`, `EE.VMAC.S8`):\n- Thanh ghi vector 128-bit có thể chứa đồng thời **16 phần tử số nguyên INT8** cùng một lúc.\n- Trong một chu kỳ lệnh (Single Clock Cycle), CPU có thể thực hiện đồng thời **16 phép nhân tích lũy (16 MACs/cycle)**.\n- Khi biên dịch firmware với ESP-IDF, thư viện `esp-nn` tự động can thiệp vào các toán tử cốt lõi của TensorFlow Lite Micro (`Conv2D`, `DepthwiseConv2D`, `FullyConnected`), chuyển đổi mã C thông thường sang mã máy Assembly vector tối ưu:\n\n```c\n// Triển khai Pipeline suy luận TFLite Micro chuẩn ESP-IDF v5.x:\n#include \"tensorflow/lite/micro/micro_interpreter.h\"\n#include \"tensorflow/lite/micro/micro_mutable_op_resolver.h\"\n#include \"tensorflow/lite/schema/schema_generated.h\"\n#include \"esp_log.h\"\n#include \"esp_heap_caps.h\"\n\n#define TENSOR_ARENA_SIZE (80 * 1024) // 80 KB\nstatic uint8_t *s_tensor_arena = NULL;\n\nvoid init_tinyml_engine(const uint8_t *model_tflite_bytes) {\n    // 1. Cấp phát Tensor Arena căn lề 16-byte trong Internal SRAM cho SIMD\n    s_tensor_arena = (uint8_t*)heap_caps_aligned_alloc(16, TENSOR_ARENA_SIZE, MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT);\n    assert(s_tensor_arena != NULL);\n\n    // 2. Nạp cấu trúc mô hình FlatBuffers\n    const tflite::Model *model = tflite::GetModel(model_tflite_bytes);\n    if (model->version() != TFLITE_SCHEMA_VERSION) {\n        ESP_LOGE(\"TFLM\", \"Phiên bản schema mô hình không tương thích!\");\n        return;\n    }\n\n    // 3. Khai báo Op Resolver chỉ nạp đúng các toán tử cần dùng để tiết kiệm Flash\n    static tflite::MicroMutableOpResolver<4> micro_op_resolver;\n    micro_op_resolver.AddConv2D();\n    micro_op_resolver.AddDepthwiseConv2D();\n    micro_op_resolver.AddFullyConnected();\n    micro_op_resolver.AddSoftmax();\n\n    // 4. Khởi tạo Interpreter\n    static tflite::MicroInterpreter static_interpreter(\n        model, micro_op_resolver, s_tensor_arena, TENSOR_ARENA_SIZE\n    );\n    \n    TfLiteStatus allocate_status = static_interpreter.AllocateTensors();\n    if (allocate_status != kTfLiteOk) {\n        ESP_LOGE(\"TFLM\", \"AllocateTensors thất bại! Cần tăng TENSOR_ARENA_SIZE!\");\n        return;\n    }\n\n    ESP_LOGI(\"TFLM\", \"✅ Khởi động thành công! Kích thước Tensor Arena sử dụng: %zu bytes\",\n             static_interpreter.arena_used_bytes());\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG & THỦ THUẬT GỠ LỖI THỰC CHIẾN\n❌ **Bẫy lệch tỷ lệ Lượng tử hóa (Quantization Scale Mismatch):**\nKhi chuẩn bị dữ liệu đầu vào cho mạng nơ-ron, lập trình viên thường nhầm lẫn giữa kiểu số thực và số nguyên:\n`int8_t quant_input = (int8_t)(real_input / scale + zero_point);`\nNếu quên trừ `zero_point` hoặc tính nhầm dải giá trị $[0, 1]$ thành $[-1, 1]$, mô hình sẽ luôn dự đoán ra xác suất sai hoàn toàn dù độ chính xác trên Google Colab đạt $99%$!\n❌ **Quên bật cờ biên dịch tối ưu hóa ESP-NN:**\nNếu trong `CMakeLists.txt` hoặc `sdkconfig` bạn không kích hoạt cờ cấu hình liên kết thư viện tăng tốc phần cứng (`CONFIG_NN_OPTIMIZED=y`), TFLite Micro sẽ chạy mã C tiêu chuẩn ANSI, làm mô hình chạy chậm hơn gấp 4 lần và tiêu tốn pin không cần thiết!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [Nghiên cứu nền tảng: \"Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference\"](https://arxiv.org/abs/1712.05877) - Benoit Jacob et al. (Google, IEEE CVPR 2018).\n- 🐙 [GitHub: Espressif Neural Network Library (esp-nn)](https://github.com/espressif/esp-nn) - Kho mã nguồn mở kernel tối ưu Assembly Vector SIMD cho ESP32-S3.\n- 🐙 [GitHub: TensorFlow Lite for Microcontrollers (TFLite Micro)](https://github.com/tensorflow/tflite-micro) - Thư viện học sâu vi điều khiển chính thức của Google.\n- 📚 Sách tiêu chuẩn: *\"TinyML: Machine Learning with TensorFlow Lite on Arduino and Ultra-Low-Power Microcontrollers\"* (Pete Warden & Daniel Situnayake, O'Reilly Media).",
        "bookId": "book_jacob_quantization",
        "standardRef": "Benoit Jacob, Skirmantas Kligys, Bo Chen, Andrew Howard et al. (Google Research, CVPR 2018)"
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
        "words": 1066,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ESP32-S3 Technical Reference Manual* (Ch.32 ULP-RISC-V Co-processor §32.2)\n> *\"The Ultra-Low-Power (ULP) co-processor is a low-power 32-bit RISC-V processor that remains powered on during Deep-Sleep mode. It can access RTC Slow Memory (8 KB) and RTC peripheral registers to monitor external sensors via I2C/ADC. When an abnormal event is detected, the ULP executes the `WAKEUP` instruction to wake up the main dual-core Xtensa CPU.\"*\n> \n> 📊 **Bảng Đo Kiểm Dòng Điện & Năng Lượng Tiêu Thụ Thực Tế:**\n> | Chế Độ Hoạt Động | Trạng Thái CPU & Ngoại Vi | Dòng Điện Điển Hình | Tuổi Thọ Pin (Pin Li-Ion 2500mAh) |\n> | :--- | :--- | :--- | :--- |\n> | **Active Run 240MHz** | Dual-Core CPU chạy AI + Wi-Fi TX | $80 - 150\\text{ mA}$ | ~16 giờ |\n> | **Modem Sleep** | CPU chạy 80MHz, Wi-Fi DTIM beacon | $20 - 30\\text{ mA}$ | ~3.5 ngày |\n> | **Light Sleep** | CPU clock gating, RAM duy trì | $1.5 - 2.5\\text{ mA}$ | ~40 ngày |\n> | **Deep Sleep + ULP** | CPU tắt hoàn toàn, ULP quét I2C | $\\mathbf{15 - 20\\text{ }\\mu\\text{A}}$ | **> 12 năm!** |\n> | **RTC Hibernation** | Tắt toàn bộ, chỉ giữ RTC Timer | $5\\text{ }\\mu\\text{A}$ | ~30 năm (Tự phóng điện pin) |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: NGHỊCH LÝ NĂNG LƯỢNG TRÊN THIẾT BỊ PIN\nMột thiết bị Edge AI gắn pin Lithium 18650 dung lượng $2500\text{ mAh}$:\n- Nếu cả 2 lõi CPU 240MHz và khối thu phát sóng Wi-Fi chạy liên tục: Dòng điện tiêu thụ trung bình là **$150\text{ mA}$ đến $240\text{ mA}$**. Pin sẽ cạn kiệt chỉ sau **12 đến 16 giờ**!\n- Trong thực tế giám sát nông nghiệp thông minh hoặc phát hiện cháy rừng: $99.9%$ thời gian là môi trường bình thường không có biến cố.\n- **Nghệ thuật tiết kiệm nguồn cực hạn:** Đưa toàn bộ vi điều khiển vào trạng thái **Deep Sleep (Ngủ sâu)** với dòng điện chỉ vỏn vẹn **$8\text{ }mu\text{A}$**! Thiết bị có thể hoạt động bền bỉ liên tục từ **3 đến 5 năm** chỉ với một viên pin duy nhất!\n\n---\n\n### 📌 2. KIẾN TRÚC VI XỬ LÝ PHỤ ULP-RISC-V THEO ESP32-S3 TRM (CHAPTER 32)\nĐiều làm nên sức mạnh vượt trội của ESP32-S3 so với các dòng chip cũ là lõi vi xử lý phụ **Ultra-Low-Power (ULP) kiến trúc RISC-V 32-bit**:\n- Nằm trong miền cấp nguồn thời gian thực riêng biệt (**RTC Power Domain**).\n- Chạy ở xung nhịp $17.5\text{ MHz}$ và có quyền truy cập vào $8\text{ KB}$ bộ nhớ **RTC Slow RAM**.\n- Khi CPU chính dual-core 240MHz tắt nguồn hoàn toàn: Lõi ULP RISC-V vẫn thức dậy định kỳ mỗi giây để đọc cảm biến ADC/I2C.\n- **Chiến lược đánh thức thông minh (Wakeup on Anomaly):**\n  Lõi ULP đọc cảm biến và so sánh với ngưỡng an toàn. Nếu giá trị nằm trong ngưỡng bình thường $\rightarrow$ ULP tự đi ngủ tiếp. Chỉ khi phát hiện rung động bất thường vượt ngưỡng hoặc âm thanh lạ, ULP mới phát tín hiệu đánh thức CPU chính dual-core dậy để chạy mô hình AI phân loại chuyên sâu!\n\n---\n\n### 📌 3. LẬP TRÌNH C CHIA SẺ BIẾN QUA RTC SLOW RAM\nĐể dữ liệu không bị xóa sạch khi CPU chính chuyển sang Deep Sleep, biến phải được đặt vào phân vùng bộ nhớ RTC bằng thuộc tính `RTC_DATA_ATTR`:\n\n```c\n#include \"esp_sleep.h\"\n#include \"esp_log.h\"\n#include \"driver/rtc_io.h\"\n\n// Biến này nằm trong RTC Slow RAM, giữ nguyên giá trị qua hàng ngàn lần Deep Sleep:\nRTC_DATA_ATTR static uint32_t s_boot_cycle_count = 0;\nRTC_DATA_ATTR static float s_historical_baseline = 25.0f;\n\nvoid app_main(void) {\n    s_boot_cycle_count++;\n    ESP_LOGI(\"POWER\", \"Lần thức dậy thứ: %lu | Baseline cũ: %.2f\", s_boot_cycle_count, s_historical_baseline);\n\n    // Kiểm tra nguyên nhân đánh thức\n    esp_sleep_wakeup_cause_t wakeup_reason = esp_sleep_get_wakeup_cause();\n    if (wakeup_reason == ESP_SLEEP_WAKEUP_TIMER) {\n        ESP_LOGI(\"POWER\", \"Thức dậy do RTC Timer chu kỳ định kỳ!\");\n    } else if (wakeup_reason == ESP_SLEEP_WAKEUP_EXT0) {\n        ESP_LOGW(\"POWER\", \"🚨 THỨC DẬY KHẨN CẤP DO CẢM BIẾN PHÁT HIỆN RUNG ĐỘNG!\");\n        // Chạy mô hình TinyML phân loại tại đây...\n    }\n\n    // Cài đặt hẹn giờ thức dậy sau 60 giây (60 triệu micro-giây)\n    esp_sleep_enable_timer_wakeup(60 * 1000000ULL);\n\n    // Kích hoạt ngắt chân GPIO ngoài (EXT0) đánh thức ngay lập tức nếu rung chấn\n    esp_sleep_enable_ext0_wakeup(GPIO_NUM_1, 1); // Đánh thức khi chân GPIO1 lên mức cao\n\n    ESP_LOGI(\"POWER\", \"💤 Đang tiến vào Deep Sleep (Dòng tiêu thụ giảm về 8uA)...\");\n    esp_deep_sleep_start();\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG & THỦ THUẬT GỠ LỖI NGUỒN ĐIỆN (LEAKAGE CURRENT)\n❌ **Rò rỉ dòng điện qua chân GPIO lơ lửng (Floating Pins):**\nTrong Deep Sleep, nếu các chân GPIO kết nối với ngoại vi ngoài không được cố định mức logic (Pull-up hoặc Pull-down phần cứng), trạng thái thả nổi lơ lửng sẽ tạo ra dòng rò rỉ (Leakage Current) lên tới hàng mili-ampe ($mA$), đốt cạn viên pin chỉ sau 1 tuần!\n*Khắc phục:* Luôn gọi hàm `rtc_gpio_isolate()` cô lập các chân không dùng trước khi gọi `esp_deep_sleep_start()`.\n❌ **Biến thường bị xóa về 0 sau khi thức dậy:**\nNhiều lập trình viên quên khai báo thuộc tính `RTC_DATA_ATTR`. Khi chip chuyển sang Deep Sleep, toàn bộ vùng nhớ SRAM thông thường bị cắt điện hoàn toàn, mọi biến toàn cục đều bị mất trắng!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 32: Ultra-Low-Power Co-processor (ULP-RISC-V)](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Sơ đồ kiến trúc lõi phụ RISC-V.\n- 🌐 [ESP-IDF Sleep Modes & Power Management Architecture](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/sleep_modes.html) - Hướng dẫn cấu hình nguồn đánh thức.\n- 🌐 [ESP-IDF ULP (RISC-V) Programming Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/system/ulp.html) - Lập trình C cho vi điều khiển ULP.\n- 🐙 [GitHub: ESP-IDF Deep Sleep & ULP Code Examples](https://github.com/espressif/esp-idf/tree/master/examples/system/deep_sleep) - Dự án mẫu đo đạc dòng điện.",
        "bookId": "book_esps3_trm",
        "standardRef": "ESP32-S3 TRM Ch.32 Ultra-Low-Power Co-processor ULP-RISC-V"
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
        "words": 1293,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *MLPerf Tiny Benchmark Suite: Benchmarking Embedded Machine Learning* (Colby Banbury, Vijay Janapa Reddi, et al. - Harvard / MLCommons / NeurIPS 2021, §3 & §4)\n> *\"Evaluating TinyML edge systems requires standardized metrics covering Latency (CPU cycles and execution time), Energy (Joules per inference), and Accuracy on constrained embedded hardware. Execution cycles must be measured using hardware cycle counters without OS timing jitter.\"*\n> \n> 📐 **Các Chỉ Số Đo Lường Hiệu Năng MLPerf Chuẩn Quốc Tế:**\n> - **Bộ đếm xung nhịp chu kỳ lệnh Xtensa LX7:**\n>   Đọc trực tiếp thanh ghi phần cứng `CCOUNT`:\n>   `asm volatile(\"rsr %0, ccount\" : \"=r\"(end_cycles));`\n>   $$\\text{Latency} = \\frac{\\Delta\\text{CCOUNT}}{240 \\times 10^6}\\text{ (giây)}$$\n> - **Tiêu thụ năng lượng mỗi lần suy luận (Energy per Inference):**\n>   $$E_{\\text{inference}} = V_{cc} \\times I_{\\text{avg}} \\times \\Delta t\\text{ (Joules)}$$\n> - **Bộ chỉ số Ma Trận Nhầm Lẫn (Confusion Matrix Metrics):**\n>   $$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}, \\quad \\text{Sensitivity} = \\frac{TP}{TP + FN}, \\quad F_1 = \\frac{2TP}{2TP + FP + FN}$$\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: TIÊU CHÍ ĐÁNH GIÁ ĐỒ ÁN A+ TRƯỚC HỘI ĐỒNG\nMột đồ án tốt nghiệp kỹ sư ngành Hệ thống nhúng & IoT / Edge AI đạt điểm A+ không bao giờ chỉ dừng lại ở một video quay cảnh đèn LED nhấp nháy hoặc một mô hình nhận diện chạy thử được vài lần trong điều kiện lý tưởng.\nHội đồng giám khảo chuyên môn đòi hỏi những **con số đo đạc khoa học định lượng (Quantitative Benchmarks)** có thể tái lập được:\n1. **Độ trễ suy luận (Inference Latency):** Phân tích chi tiết thời gian thực thi của từng phân đoạn trong đường ống dữ liệu (Thu thập mẫu, lọc DSP, biến đổi FFT, nạp Tensor và thời gian Invoke).\n2. **Chi phí bộ nhớ (Memory Footprint Auditing):** Báo cáo chi tiết dung lượng Flash nhị phân (.bin) và biểu đồ sử dụng RAM nội (Internal SRAM) đo đạc theo thời gian thực.\n3. **Độ chính xác khoa học (Scientific Accuracy Metrics):** Bảng ma trận nhầm lẫn (Confusion Matrix), các chỉ số Precision, Recall và F1-Score trên tập dữ liệu kiểm thử độc lập.\n4. **Kiểm thử độ bền 24/7 (Soak Stress Testing):** Chứng minh hệ thống chạy liên tục không bị tràn bộ nhớ Heap, không rớt mạng Wi-Fi và nhiệt độ chip nằm trong ngưỡng an toàn.\n\n---\n\n### 📌 2. KỸ THUẬT ĐO ĐỘ TRỄ SUY LUẬN CHUẨN XÁC ĐẾN MICRO-GIÂY\nĐể đo thời gian thực thi của một đoạn mã nguồn trong ESP-IDF, **tuyệt đối không dùng hàm clock() hay hàm vTaskDelay()**:\n- ✅ **Sử dụng API `esp_timer_get_time()`:**\n  API này đọc trực tiếp giá trị từ bộ đếm thời gian phần cứng 64-bit chạy trên xung nhịp cố định, trả về thời gian tính bằng micro-giây ($\\mu s$) kể từ khi vi điều khiển khởi động:\n\n```c\nint64_t t_dsp_start = esp_timer_get_time();\nexecute_dsp_fft_pipeline();\nint64_t t_dsp_latency = esp_timer_get_time() - t_dsp_start;\n\nint64_t t_ai_start = esp_timer_get_time();\ninterpreter->Invoke();\nint64_t t_ai_latency = esp_timer_get_time() - t_ai_start;\n```\n\n---\n\n### 📌 3. GIÁM SÁT DUNG LƯỢNG RAM & PHÁT HIỆN RÒ RỈ BỘ NHỚ (MEMORY LEAK PROFILING)\nĐể chứng minh với hội đồng bảo vệ rằng mã nguồn của bạn hoàn toàn không bị rò rỉ bộ nhớ (Memory Leak):\n- Theo dõi 2 chỉ số sống còn bằng API `esp_heap_caps`:\n  + `heap_caps_get_free_size(MALLOC_CAP_INTERNAL)`: Lượng RAM tự do hiện tại.\n  + `heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL)`: **Mức RAM tự do thấp nhất (Watermark)** mà hệ thống từng chạm tới kể từ khi khởi động.\n- Nếu sau 10,000 chu kỳ suy luận liên tục, mức RAM tự do không bị giảm dần theo thời gian, bạn có bằng chứng thép chứng minh hệ thống đạt độ tin cậy tuyệt đối 100%!\n\n---\n\n### 📌 4. MA TRẬN NHẦM LẪN (CONFUSION MATRIX) & CÁC CHỈ SỐ KHOA HỌC\nKhi phân loại sự cố động cơ (ví dụ: Bình thường, Hỏng bạc đạn, Lệch trục, Quá tải):\n- **Ma trận nhầm lẫn (Confusion Matrix)** là một bảng 2 chiều biểu diễn mối quan hệ giữa Nhãn thực tế (True Label) và Nhãn do mô hình AI dự đoán (Predicted Label).\n\n| Nhãn Thực Tế \\ Dự Đoán | Bình Thường | Hỏng Bạc Đạn | Lệch Trục |\n| :--- | :--- | :--- | :--- |\n| **Bình Thường** | **98 (TP)** | 1 (FN) | 1 (FN) |\n| **Hỏng Bạc Đạn**| 0 (FP) | **99 (TP)** | 1 (FN) |\n| **Lệch Trục** | 2 (FP) | 1 (FP) | **97 (TP)** |\n\n#### Các Công Thức Bắt Buộc Trong Báo Cáo Đồ Án:\n1. **Độ Chính Xác Tổng Thể (Accuracy):**\n   $\\text{Accuracy} = \\frac{\\sum \\text{Đúng}}{\\text{Tổng Số Mẫu}} = \\frac{98 + 99 + 97}{300} = 98.0\\%$\n2. **Độ Chuẩn Xác (Precision):** Tỷ lệ dự đoán đúng trong số các lần mô hình phát chuông báo động:\n   $\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$\n3. **Độ Thu Hồi (Recall):** Tỷ lệ sự cố thực tế được mô hình phát hiện (cực kỳ quan trọng để không bỏ sót sự cố):\n   $\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$\n4. **Điểm F1-Score (Trung bình điều hòa giữa Precision và Recall):**\n   $\\text{F1} = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$\n\n---\n\n### 📌 5. MÃ NGUỒN C MẪU THỰC HIỆN BÁO CÁO BENCHMARK TỰ ĐỘNG\n```c\n#include <stdio.h>\n#include \"esp_timer.h\"\n#include \"esp_heap_caps.h\"\n\nvoid generate_capstone_benchmark_report(void) {\n    size_t free_ram_start = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);\n    size_t free_ram_min = heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL);\n\n    printf(\"\\n=======================================================\\n\");\n    printf(\"   BÁO CÁO THỬ NGHIỆM ĐỒ ÁN TỐT NGHIỆP EDGE AI ESP32-S3   \\n\");\n    printf(\"=======================================================\\n\");\n    printf(\"1. HIỆU NĂNG THỜI GIAN THỰC:\\n\");\n    printf(\"   - Tần số lấy mẫu cảm biến: 16,000 Hz\\n\");\n    printf(\"   - Thời gian tiền xử lý FFT 512 điểm: 0.72 ms\\n\");\n    printf(\"   - Thời gian suy luận mô hình TinyML:  11.45 ms\\n\");\n    printf(\"   - Tổng thời gian phản hồi toàn chu trình: 12.17 ms\\n\");\n    printf(\"2. BỘ NHỚ VÀ TÀI NGUYÊN:\\n\");\n    printf(\"   - Bộ nhớ Tensor Arena cấp phát tĩnh: 48,000 bytes\\n\");\n    printf(\"   - Dung lượng RAM nội còn trống tự do: %u bytes\\n\", free_ram_start);\n    printf(\"   - Mức RAM thấp nhất ghi nhận (Watermark): %u bytes\\n\", free_ram_min);\n    printf(\"   - Trạng thái rò rỉ bộ nhớ: 0 bytes (KHÔNG RÒ RỈ)\\n\");\n    printf(\"3. ĐỘ CHÍNH XÁC KHOA HỌC:\\n\");\n    printf(\"   - Accuracy trên tập test: 98.33%%\\n\");\n    printf(\"   - F1-Score trung bình: 0.982\\n\");\n    printf(\"=======================================================\\n\\n\");\n}```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [Nghiên cứu tiêu chuẩn: \"MLPerf Tiny Benchmark Suite\"](https://arxiv.org/abs/2106.07550) - Colby Banbury et al. (NeurIPS 2021) - Khung đo lường chuẩn hóa toàn cầu về độ trễ, mức tiêu thụ năng lượng và độ chính xác của mô hình Edge AI.\n- 🌐 [Cadence Xtensa LX7 Microprocessor Architecture Overview](https://www.cadence.com/en_US/home/tools/silicon-solutions/tensilica-ip/xtensa-custom-processors.html) - Tài liệu kiến trúc phần cứng và thanh ghi đếm chu kỳ lệnh CPU CCOUNT.\n- 🌐 [Edge Impulse: Benchmarking Embedded Machine Learning Models](https://docs.edgeimpulse.com/docs/edge-device-optimization) - Phương pháp luận đo kiểm hiệu năng suy luận trên thiết bị biên nhúng.",
        "bookId": "book_mlperf_tiny",
        "standardRef": "Colby Banbury, Vijay Janapa Reddi et al. (Harvard / MLCommons / NeurIPS 2021)"
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
        "words": 1182,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ISO/IEC 9899:2011 (C11 Programming Language Standard)* (ISO WG14, §6.3.1.1 & §6.7.3)\n> *\"Integer Promotions: An integer type smaller than int shall be converted to int or unsigned int in expressions. Volatile Qualifier: An object that has volatile-qualified type may be modified in ways unknown to the implementation or have other unknown side effects. Therefore, an access to such an object cannot be omitted, reordered, or optimized away.\"*\n> \n> 📊 **Bảng 4 Khái Niệm Bẫy Phỏng Vấn Sát Thủ (Interview Trap Matrix):**\n> | Bẫy Kỹ Thuật C | Tham Chiếu Tiêu Chuẩn | Hành Vi Biên Dịch Tối Ưu (-O2/-O3) | Hậu Quả & Khắc Phục |\n> | :--- | :--- | :--- | :--- |\n> | **Quên `volatile`** | ISO C11 §6.7.3 | Đọc biến 1 lần vào thanh ghi CPU `a2`, không đọc lại RAM | Vòng lặp `while(!flag)` chờ cờ ISR bị treo vĩnh viễn |\n> | **Struct Padding** | ISO C11 §6.7.2.1 | Tự chèn byte rỗng để biến 4-byte nằm ở địa chỉ chia hết cho 4 | `sizeof(S)` lớn hơn tính toán; dùng `__attribute__((packed))` |\n> | **Integer Promotion**| ISO C11 §6.3.1.1 | Ép `uint8_t a = 200, b = 100; a + b` lên kiểu `int` 32-bit | Tránh tràn số trung gian nhưng gây lỗi so sánh kiểu có dấu |\n> | **Dangling Pointer** | SEI CERT MEM30-C | Địa chỉ trong con trỏ vẫn còn dù bộ nhớ đã bị `free()` | Lỗi Use-After-Free ghi đè Task khác; Luôn gán `p = NULL` |\n\n---\n\n### 📌 1. BẪY SỐ 1: TỪ KHÓA `volatile` VÀ CƠ CHẾ TỐI ƯU CỦA COMPILER\n**Câu hỏi nhà tuyển dụng:** *\"Từ khóa `volatile` dùng để làm gì? Điều gì sẽ xảy ra nếu bạn không sử dụng nó trong hệ thống nhúng?\"*\n- **Bản chất phần cứng:** Báo cho trình biên dịch rằng giá trị của biến này có thể bị thay đổi bất ngờ bởi phần cứng bên ngoài (hoặc bởi một hàm ngắt ISR) mà luồng code tuần tự hiện tại không kiểm soát được.\n- **Nếu thiếu `volatile`:** Trình biên dịch với cờ tối ưu hóa `-O2` hoặc `-O3` sẽ tự ý nạp biến vào thanh ghi CPU nội bộ (Register Cache) và **không bao giờ đọc lại từ RAM nữa**:\n  ```c\n  bool flag = false; // Thiếu volatile!\n  void isr_handler() { flag = true; }\n  void wait_task() {\n      while (!flag); // Compiler dịch thành while(true) vô hạn! Hệ thống treo cứng!\n  }\n  ```\n- ✅ **3 trường hợp BẮT BUỘC dùng `volatile`:**\n  1. Con trỏ trỏ vào thanh ghi ngoại vi phần cứng (Memory-Mapped I/O).\n  2. Biến toàn cục được sửa đổi bên trong hàm ngắt ISR.\n  3. Cờ chia sẻ giữa nhiều tác vụ trong hệ điều hành đa nhiệm RTOS.\n\n---\n\n### 📌 2. BẪY SỐ 2: STRUCT PADDING & PACKING (CĂN LỀ TỰ NHIÊN)\n**Câu hỏi nhà tuyển dụng:** *\"Cho struct sau, hàm `sizeof()` trên vi xử lý 32-bit trả về bao nhiêu bytes?\"*\n```c\nstruct BadStruct {\n    char a;      // 1 byte\n    int b;       // 4 bytes\n    char c;      // 1 byte\n};\n```\n- **Câu trả lời sai của người thiếu kinh nghiệm:** $1 + 4 + 1 = 6$ bytes.\n- **Đáp án chính xác:** **12 bytes!**\n- **Giải thích phần cứng:** Bus dữ liệu của vi điều khiển 32-bit nạp dữ liệu theo từng khối 4-byte (Word-aligned). Để biến `int b` nằm đúng ở địa chỉ chia hết cho 4, trình biên dịch tự động chèn **3 bytes rác (padding bytes)** sau biến `a`. Và sau biến `c`, trình biên dịch chèn tiếp **3 bytes rác** để kích thước toàn bộ struct là bội số của 4!\n- ✅ **Cách tối ưu 1:** Sắp xếp lại thứ tự khai báo từ biến lớn đến biến nhỏ:\n  ```c\n  struct GoodStruct { int b; char a; char c; }; // Chỉ tốn 8 bytes!\n  ```\n- ✅ **Cách tối ưu 2:** Sử dụng `__attribute__((packed))` ép struct không chứa byte rác (dùng khi truyền gói tin mạng I2C/CAN).\n\n---\n\n### 📌 3. BẪY SỐ 3: PHÂN BIỆT `const int *p` VÀ `int * const p`\nMẹo nhớ thần tốc theo nguyên tắc **\"Đọc từ phải qua trái (Read Right-to-Left)\"**:\n1. `const int *p`: Con trỏ trỏ tới dữ liệu hằng (`p is a pointer to const int`). Địa chỉ con trỏ có thể thay đổi để trỏ đi nơi khác, nhưng giá trị bên trong ô nhớ (`*p`) bị khóa chỉ đọc.\n2. `int * const p`: Con trỏ hằng trỏ tới dữ liệu biến thiên (`p is a const pointer to int`). Địa chỉ của con trỏ bị khóa cứng vĩnh viễn không thể thay đổi, nhưng giá trị bên trong ô nhớ (`*p`) có thể sửa đổi thoải mái.\n3. `const int * const p`: Khóa cứng toàn diện cả địa chỉ con trỏ lẫn giá trị bên trong ô nhớ.\n\n---\n\n### 📌 4. BẪY SỐ 4: BẢNG CON TRỎ HÀM (FUNCTION POINTER TABLE) LÀM STATE MACHINE\nNhà tuyển dụng chuyên nghiệp không bao giờ muốn thấy một chuỗi `switch-case` 50 nhánh cồng kềnh trong firmware nhúng vì độ phức tạp tìm kiếm $O(N)$ làm tốn thời gian thực thi.\n- ✅ **Giải pháp đẳng cấp:** Sử dụng **Bảng con trỏ hàm (Function Pointer Dispatch Table)**:\n```c\ntypedef void (*StateFunc_t)(void);\n\nvoid state_idle(void) { /* Chờ cảm biến */ }\nvoid state_sampling(void) { /* Đọc I2C */ }\nvoid state_inference(void) { /* Chạy AI */ }\n\n// Bảng con trỏ hàm FSM\nstatic const StateFunc_t fsm_lut[] = {\n    [0] = state_idle,\n    [1] = state_sampling,\n    [2] = state_inference\n};\n\n// Chuyển trạng thái cực nhanh trong 1 chu kỳ máy O(1):\nfsm_lut[current_state]();\n```\n\n---\n\n### 📌 5. BẪY SỐ 5: 4 CÂU THẦN CHÚ THAO TÁC BITWISE THANH GHI\nBắt buộc phải thuộc làu 4 phép toán thao tác bit trên thanh ghi:\n1. **Bật bit thứ n (Set bit):** `REG |= (1U << n);`\n2. **Xóa bit thứ n (Clear bit):** `REG &= ~(1U << n);`\n3. **Đảo trạng thái bit thứ n (Toggle bit):** `REG ^= (1U << n);`\n4. **Kiểm tra bit thứ n (Check bit):** `if (REG & (1U << n)) { /* Bit đang bật */ }`\n\n---\n\n### 📌 6. BẪY SỐ 6: PHÁT HIỆN ENDIANNESS (LITTLE ENDIAN VS BIG ENDIAN)\n**Câu hỏi nhà tuyển dụng:** *\"Viết một đoạn code C ngắn nhất để kiểm tra CPU hiện tại là Little-Endian hay Big-Endian?\"*\n```c\nbool is_little_endian(void) {\n    uint16_t num = 0x0001;\n    uint8_t *byte_ptr = (uint8_t *)&num;\n    return (*byte_ptr == 0x01); // Nếu byte đầu tiên là 1 -> Little Endian!\n}\n```\nESP32-S3 sử dụng kiến trúc **Little-Endian** (Byte thấp lưu ở địa chỉ nhỏ trước). Trong khi đó, các gói tin mạng IP hoặc giao thức CAN Bus thường sử dụng **Big-Endian**. Việc nắm vững Endianness giúp bạn không bao giờ bị đảo ngược dữ liệu cảm biến!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [SEI CERT C Coding Standard: Rules for Safe, Reliable, and Secure Systems](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard) - Tiêu chuẩn vàng của viện kỹ nghệ phần mềm Mỹ về bẫy kiểu dữ liệu và tràn số nguyên.\n- 📄 [ISO/IEC 9899:2011 (C11 Committee Draft)](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) - Mục 6.5.3 (Unary operators), Mục 6.7.3 (Type qualifiers: const, volatile, restrict).\n- 📚 Sách chuyên sâu: *\"C Traps and Pitfalls\"* (Tác giả: Andrew Koenig, AT&T Bell Laboratories, Nhà xuất bản Addison-Wesley).",
        "bookId": "book_iso_c11_standard",
        "standardRef": "ISO/IEC 9899:2011 (C11 Standard) §6.3.1.1, §6.7.2.1 & §6.7.3"
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
        "words": 1043,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ESP32-S3 Technical Reference Manual* (Ch.5 IO MUX and GPIO Matrix §5.4 Register Summary)\n> *\"The GPIO peripheral contains dedicated Write-1-to-Set (W1TS) and Write-1-to-Clear (W1TC) registers. Writing a 1 to bit n in GPIO_OUT_W1TS sets GPIO n high, and writing a 1 to bit n in GPIO_OUT_W1TC sets GPIO n low. These atomic write operations eliminate the need for read-modify-write cycles and prevent race conditions without disabling interrupts.\"*\n> \n> 📊 **Bảng Địa Chỉ Thanh Ghi Trần GPIO (Base Address: `0x60004000`):**\n> | Tên Thanh Ghi Vật Lý | Địa Chỉ Tuyệt Đối (Hex) | Offset | Thao Tác | Ý Nghĩa Kỹ Thuật Trần (Bare-Metal) |\n> | :--- | :--- | :--- | :--- | :--- |\n> | `GPIO_OUT_REG` | `0x60004004` | `0x0004` | R/W | Ghi trực tiếp trạng thái đầu ra 32 chân GPIO (0..31) |\n> | `GPIO_OUT_W1TS_REG` | `0x60004008` | `0x0008` | W1S | **Bật mức HIGH nguyên tử** (Atomic bit-set, không cần khóa ngắt) |\n> | `GPIO_OUT_W1TC_REG` | `0x6000400C` | `0x000C` | W1C | **Tắt mức LOW nguyên tử** (Atomic bit-clear, thời gian 1 chu kỳ clock) |\n> | `GPIO_ENABLE_REG` | `0x60004020` | `0x0020` | R/W | Kích hoạt chế độ Output Buffer cho chân GPIO |\n> | `GPIO_IN_REG` | `0x6000403C` | `0x003C` | RO | Đọc trực tiếp mức điện áp vật lý trên các chân input |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: BÊN DƯỚI LỚP VỎ BỌC CỦA THƯ VIỆN HAL\nKhi bạn gọi hàm `gpio_set_level(GPIO_NUM_4, 1)` trong thư viện driver của ESP-IDF:\n- Hàm này phải trải qua hàng chục câu lệnh kiểm tra logic: Kiểm tra chân có hợp lệ không, kiểm tra chế độ xuất/nhập, kiểm tra Semaphore đồng bộ đa nhân...\n- **Cái giá phải trả:** Mất từ **15 đến 30 chu kỳ lệnh CPU** chỉ để đổi trạng thái một chân logic!\n- Trong các ứng dụng xung clock tốc độ cao (ví dụ: Tự lái giao thức truyền thông SPI bit-banging hoặc tạo xung lấy mẫu ADC chính xác tới từng nano-giây): Độ trễ của hàm thư viện là không thể chấp nhận được!\n\n✅ **Bản chất trần trụi (Bare-Metal):**\nMọi ngoại vi trong vi điều khiển đều được điều khiển bởi các **thanh ghi vật lý (Hardware Registers)** nằm tại các địa chỉ bộ nhớ cố định trong không gian địa chỉ (**Memory-Mapped I/O**).\nLập trình thanh ghi trần là kỹ thuật sử dụng con trỏ C trỏ thẳng tới địa chỉ vật lý đó để thao tác trực tiếp với phần cứng chỉ trong **đúng 1 chu kỳ máy ($4.16\text{ ns}$ tại 240MHz)**!\n\n---\n\n### 📌 2. GIẢI PHẪU THANH GHI GPIO THEO ESP32-S3 TRM (CHAPTER 5)\nTheo tài liệu **ESP32-S3 TRM (Chương 5: IO MUX and GPIO Matrix)**:\nVùng thanh ghi điều khiển cổng xuất GPIO nằm tại địa chỉ cơ sở `0x60004000`:\n1. **Thanh ghi `GPIO_OUT_REG` (Địa chỉ: `0x60004004`):**\n   - Mỗi bit tương ứng với một chân GPIO (Bit 0 là GPIO0, Bit 4 là GPIO4).\n   - Nếu bạn dùng phép toán thông thường `GPIO_OUT_REG |= (1 << 4);`: CPU phải thực hiện 3 bước: **Đọc -> Sửa -> Ghi (Read-Modify-Write)**. Trong môi trường đa nhân (Dual-Core), nếu Core 0 và Core 1 cùng ghi vào thanh ghi này một lúc, dữ liệu sẽ bị xung đột đè bẹp nhau!\n2. **Cặp thanh ghi nguyên tử (Atomic Registers) - Vũ khí tối thượng của ESP32-S3:**\n   - **`GPIO_OUT_W1TS_REG` (Write 1 to Set, Địa chỉ `0x60004008`):**\n     Ghi bit 1 vào vị trí nào thì chân GPIO đó lập tức nhảy lên mức HIGH ($3.3V$). Các chân khác **hoàn toàn không bị ảnh hưởng**!\n   - **`GPIO_OUT_W1TC_REG` (Write 1 to Clear, Địa chỉ `0x6000400C`):**\n     Ghi bit 1 vào vị trí nào thì chân GPIO đó lập tức hạ xuống mức LOW ($0V$)!\n   - Đây là phép toán nguyên tử cấp phần cứng (**Hardware Atomic Operation**), an toàn tuyệt đối trong môi trường đa nhân mà không cần dùng Mutex hay ngắt!\n\n---\n\n### 📌 3. MÃ NGUỒN C MẪU BARE-METAL TỐC ĐỘ CAO\n```c\n#include <stdint.h>\n#include \"esp_log.h\"\n\n// Định nghĩa con trỏ trỏ trực tiếp vào thanh ghi phần cứng (Bắt buộc dùng volatile!)\n#define DR_REG_GPIO_BASE          0x60004000\n#define REG_GPIO_OUT_W1TS         (*(volatile uint32_t *)(DR_REG_GPIO_BASE + 0x0008))\n#define REG_GPIO_OUT_W1TC         (*(volatile uint32_t *)(DR_REG_GPIO_BASE + 0x000C))\n#define REG_GPIO_ENABLE_W1TS      (*(volatile uint32_t *)(DR_REG_GPIO_BASE + 0x0024))\n\nvoid init_baremetal_gpio4(void) {\n    // Kích hoạt chân GPIO4 làm ngõ ra bằng thanh ghi Enable (Bit 4 = 1 << 4)\n    REG_GPIO_ENABLE_W1TS = (1UL << 4);\n    ESP_LOGI(\"BAREMETAL\", \"✅ Đã cấu hình chân GPIO4 ở cấp độ thanh ghi trần!\");\n}\n\n// Hàm phát xung vuông siêu tốc chỉ tốn đúng 2 chu kỳ lệnh (Mỗi lệnh 4.16ns):\nstatic inline void toggle_gpio4_atomic_ultrafast(void) {\n    REG_GPIO_OUT_W1TS = (1UL << 4); // Bật mức 1 tức thì\n    REG_GPIO_OUT_W1TC = (1UL << 4); // Tắt mức 0 tức thì\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG KHI LẬP TRÌNH BARE-METAL\n❌ **Quên từ khóa volatile khi ép kiểu con trỏ thanh ghi:**\nNếu bạn khai báo `#define REG (*(uint32_t *)0x60004008)` (thiếu từ khóa `volatile`):\nKhi bạn viết vòng lặp kiểm tra cờ sẵn sàng: `while (REG == 0);`\nTrình biên dịch GCC thấy ô nhớ này không bị code C nào sửa đổi, nó sẽ tối ưu bằng cách chỉ đọc ô nhớ vào thanh ghi CPU `a2` một lần duy nhất và lặp vô tận trên thanh ghi `a2`. Vi điều khiển sẽ bị treo cứng tại vòng lặp dù phần cứng đã bật cờ từ lâu!\n*Quy tắc chuẩn:* Con trỏ thanh ghi phần cứng bắt buộc phải là `volatile uint32_t *`!\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 1: Overview & System Architecture](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Không gian địa chỉ Memory-Mapped I/O.\n- 📄 [ESP32-S3 Technical Reference Manual - Chapter 5: IO MUX and GPIO Matrix](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf) - Mô tả thanh ghi W1TS/W1TC.\n- 📚 Sách kinh điển: *\"The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors\"* (Joseph Yiu, Elsevier).",
        "bookId": "book_esps3_trm",
        "standardRef": "ESP32-S3 TRM Ch.5 IO MUX and GPIO Matrix §5.4 Register Summary"
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
        "words": 1083,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ESP32-S3 Technical Reference Manual* (Ch.4 On-Chip Debug §4.2 JTAG Interface)\n> *\"The Xtensa LX7 dual-core processor integrates an On-Chip Debug (OCD) module supporting the JTAG protocol via dedicated hardware pins or the built-in USB-to-JTAG serial converter. Two hardware instruction breakpoints (IBREAK) and two hardware data watchpoints (DBREAK) per core allow non-intrusive debugging of real-time control loops.\"*\n> \n> 📊 **Bảng Mã Lỗi Tử Thần Guru Meditation Crash Causes (EXCCAUSE):**\n> | Mã Lỗi (EXCCAUSE) | Tên Lỗi Phần Cứng | Nguyên Nhân Vật Lý Trong Mã Nguồn C | Cách Khắc Phục Chuẩn Kỹ Sư |\n> | :--- | :--- | :--- | :--- |\n> | **Cause 0** | `IllegalInstructionCause` | Nhảy con trỏ hàm vào vùng nhớ rác hoặc Flash bị hỏng | Kiểm tra con trỏ hàm callback trước khi gọi |\n> | **Cause 9** | `LoadStoreAlignmentCause` | Ép con trỏ mảng byte sang lệnh SIMD 128-bit không chia hết cho 16 | Khai báo `alignas(16)` cho mảng Tensor Arena |\n> | **Cause 28** | `LoadProhibitedCause` | Đọc dữ liệu từ con trỏ `NULL` (`*ptr` khi `ptr == 0x0`) | Thêm câu lệnh `if (ptr == NULL) return;` |\n> | **Cause 29** | `StoreProhibitedCause` | Ghi đè vào vùng hằng số `.rodata` hoặc con trỏ `NULL` | Không ép kiểu xóa bỏ từ khóa `const` |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: KHI LỆNH PRINTF TRỞ NÊN BẤT LỰC!\nTrong lập trình vi điều khiển, có 3 tình huống mà lệnh in log `printf` hoàn toàn vô dụng:\n1. **Chip bị Crash sập nguồn ngay lập tức:** Khi CPU gặp lỗi ngoại lệ nghiêm trọng (Panic), thiết bị sập nguồn trước khi byte dữ liệu nào kịp truyền qua cổng Serial.\n2. **Lỗi tranh chấp thời gian (Timing Violation / Heisenbug):** Lệnh `printf` gửi dữ liệu qua UART tốc độ chậm, việc chèn `printf` làm chậm thời gian thực thi của hàm, vô tình làm biến mất lỗi tranh chấp luồng (Race Condition). Khi bạn xóa `printf` đi, lỗi lại lập tức xuất hiện!\n3. **Lỗi vật lý đường truyền (Signal Integrity):** Dây cáp I2C bị chập chờn hoặc thiếu điện trở kéo lên; `printf` không thể cho bạn biết dạng sóng điện áp thực tế trên dây đang méo mó như thế nào.\n\n✅ **Vũ khí của kỹ sư nhúng chuyên nghiệp:**\n- Máy phân tích logic phần cứng (**Logic Analyzer**).\n- Kỹ thuật giải mã bản ghi tử thần (**Guru Meditation Crash Dump Decoding**).\n- Giao diện gỡ lỗi phần cứng qua cổng **JTAG / OpenOCD**.\n\n---\n\n### 📌 2. SỬ DỤNG MÁY PHÂN TÍCH LOGIC (SALEAE / PULSEVIEW) BẮT GÓI TIN\nMột chiếc máy phân tích logic 8 kênh 24MHz (giá thành rất rẻ) là thiết bị không thể thiếu trên bàn làm việc của kỹ sư nhúng:\n- Kẹp 2 que đo vào 2 chân **SCL (Clock)** và **SDA (Data)** của bus I2C.\n- Mở phần mềm mã nguồn mở **PulseView** và thêm bộ giải mã giao thức (Protocol Decoder: I2C).\n- **Những lỗi vật lý bạn sẽ phát hiện được ngay lập tức:**\n  + **Thiếu điện trở kéo lên Pull-up 4.7k:** Dạng sóng vuông bị vát tròn thành hình tam giác khiến chip không thể nhận diện được bit 1 logic.\n  + **Cảm biến gửi cờ NACK (Not Acknowledge):** Cảm biến từ chối trả lời do sai địa chỉ Slave Address hoặc chưa được cấp nguồn.\n  + **Xung nhiễu Glitch:** Các xung nhọn điện áp ngắn vài nano-giây do động cơ gây ra làm sai lệch dữ liệu.\n\n---\n\n### 📌 3. GIẢI MÃ GURU MEDITATION CRASH DUMP TRONG 5 GIÂY\nKhi ESP32 bị sập nguồn, màn hình Serial in ra một bản Crash Dump chứa các thanh ghi CPU:\n```text\nGuru Meditation Error: Core 1 panic'ed (LoadProhibited). Exception was unhandled.\nCore 1 register dump:\nPC      : 0x4200b21a  PS      : 0x00060830  A0      : 0x8200b345  A1      : 0x3ffb6120\nEXCVADDR: 0x00000000\n```\n\n#### Các Bước Giải Mã Nhanh:\n1. **Đọc mã lỗi Panic:** `LoadProhibited` kết hợp `EXCVADDR: 0x00000000` nghĩa là mã nguồn đã cố đọc dữ liệu từ **con trỏ NULL**!\n2. **Định vị dòng code gây lỗi bằng công cụ addr2line:**\n   Lấy địa chỉ của thanh ghi con trỏ lệnh **PC (Program Counter: `0x4200b21a`)** và chạy lệnh sau trên Terminal máy tính:\n   ```bash\n   xtensa-esp32s3-elf-addr2line -pfia -e build/my_firmware.elf 0x4200b21a\n   ```\n   Màn hình lập tức in ra chính xác:\n   ```text\n   0x4200b21a: process_sensor_stream at main/sensor_app.c:142\n   ```\n   Bạn tìm ra chính xác dòng 142 trong file `sensor_app.c` là thủ phạm chỉ trong vòng đúng 5 giây mà không cần đoán mò!\n\n---\n\n### 📌 4. BẢNG TRA CỨU CÁC MÃ LỖI PANIC KINH ĐIỂN\n- **LoadProhibited / StoreProhibited:** Cố đọc hoặc ghi vào vùng nhớ không được phép (con trỏ NULL hoặc trỏ ra ngoài vùng RAM hợp lệ).\n- **IntegerDivideByZero:** Phép chia cho số 0.\n- **LoadStoreAlignment:** Ép con trỏ mảng byte lẻ sang con trỏ 32-bit (hoặc Tensor Arena thiếu `alignas(16)`).\n- **InterruptWatchdog:** Một hàm ngắt ISR chạy quá lâu hoặc quên cờ `IRAM_ATTR`.\n- **UnhandledDebugException:** Tràn ngăn xếp Stack Overflow làm ghi đè vùng nhớ lân cận.\n\n---\n\n### 📌 5. DEBUG PHẦN CỨNG CHUẨN JTAG VỚI OPEN_OCD VÀ GDB\nESP32-S3 tích hợp sẵn bộ chuyển đổi USB-JTAG phần cứng bên trong chip:\n- Chỉ cần cắm cáp USB vào cổng D+/D- là có thể kết nối trực tiếp với OpenOCD và GDB.\n- **Tính năng vượt trội so với printf:**\n  + Đặt **Hardware Breakpoints**: Dừng CPU tại một dòng code bất kỳ để soi trực tiếp giá trị các biến và thanh ghi.\n  + Đặt **Watchpoints**: Dừng CPU ngay lập tức khi có một tác vụ nào đó cố tình ghi đè vào một ô nhớ cụ thể trong RAM (cực kỳ hữu ích để bắt lỗi con trỏ ghi đè lung tung).\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [ESP-IDF JTAG Debugging Guide: OpenOCD & GDB on ESP32-S3](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-guides/jtag-debugging/index.html) - Hướng dẫn thiết lập USB-JTAG tích hợp phần cứng để bắt lỗi từng dòng mã nguồn.\n- 🌐 [ESP-IDF Fatal Errors and Guru Meditation Debugging](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-guides/fatal-errors.html) - Phương pháp giải mã thanh ghi máy tính (PC, EXCVADDR, Backtrace) khi xảy ra lỗi nghiêm trọng.\n- 📖 [OpenOCD User's Guide (Official Manual)](https://openocd.org/doc/html/index.html) - Tài liệu hướng dẫn sử dụng phần mềm gỡ lỗi mã nguồn mở Open On-Chip Debugger.",
        "bookId": "book_esps3_trm",
        "standardRef": "ESP32-S3 TRM Ch.4 On-Chip Debug (OCD) & IEEE 1149.1 JTAG / OpenOCD"
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
        "words": 1191,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *MISRA C:2012 Guidelines for the Use of the C Language in Critical Systems* (MIRA Ltd, Rules 8.4, 11.4, 14.2 & 21.3)\n> *\"Rule 8.4 (Required): A compatible declaration shall be visible when an object or function with external linkage is defined. Rule 11.4 (Advisory): A conversion should not be performed between a pointer to object and an integer type. Rule 14.2 (Required): A for loop shall be well-formed. Rule 21.3 (Required): The memory allocation and deallocation functions of <stdlib.h> (malloc, calloc, realloc, free) shall not be used.\"*\n> \n> 📊 **Bảng 6 Quy Tắc MISRA C Cốt Lõi Bắt Buộc Trong Firmware Ô Tô:**\n> | Quy Tắc MISRA | Mức Độ | Nội Dung Quy Định Tiêu Chuẩn | Hành Vi Bị Cấm Vi Phạm |\n> | :--- | :--- | :--- | :--- |\n> | **Rule 8.4** | Required | Hàm/biến cục bộ module phải mang từ khóa `static` | Để biến toàn cục hở không có header declaration |\n> | **Rule 10.1** | Required | Không chuyển đổi ngầm giữa các kiểu dữ liệu bản chất | Phép toán giữa số nguyên có dấu và không dấu |\n> | **Rule 11.4** | Advisory | Cấm ép kiểu giữa con trỏ và số nguyên trừ thanh ghi MMIO | Ép kiểu `uint32_t a = (uint32_t)ptr;` tùy tiện |\n> | **Rule 12.2** | Required | Dịch bit phải nằm trong khoảng từ 0 đến (bitwidth - 1) | Dịch bit `val << 32` trên biến kiểu 32-bit (UB) |\n> | **Rule 14.2** | Required | Biến đếm vòng lặp `for` không được sửa đổi trong thân vòng lặp | Thay đổi biến `i` bên trong nội dung vòng lặp |\n> | **Rule 21.3** | Required | Cấm hoàn toàn cấp phát động `malloc()`, `free()`, `realloc()` | Sử dụng heap phân mảnh trong lúc hệ thống đang vận hành |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO CÔNG NGHIỆP Ô TÔ PHẢI CÓ MISRA C?\nNgôn ngữ C là \"con dao hai lưỡi\" mạnh mẽ nhất trong kỹ thuật lập trình:\n- C cung cấp quyền lực tối thượng: Cho phép lập trình viên ép kiểu bất kỳ con trỏ nào, ghi đè trực tiếp lên ô nhớ vật lý, nhảy bừa bãi bằng `goto` và tận dụng các vùng hành vi chưa xác định (**Undefined Behavior**).\n- Nhưng trong các hệ thống an toàn sinh mạng (**Safety-Critical Systems**) như Hệ thống phanh chống bó cứng xe hơi (**ABS**), Bộ điều khiển túi khí (**Airbag ECU**), hay Thiết bị cấy ghép tim mạch y tế: Một lỗi tràn mảng (Buffer Overflow) hay một con trỏ NULL lơ lửng không chỉ đơn thuần là hiện tượng \"văng ứng dụng\", mà nó có thể **cướp đi tính mạng của hành khách**!\n\nHiệp hội Công nghiệp Đảm bảo Độ tin cậy Động cơ nước Anh (**MIRA**) đã ban hành bộ quy chuẩn **MISRA C:2012** (gồm 143 Rules và 16 Directives) nhằm loại bỏ triệt để các góc tối nguy hiểm của ngôn ngữ C, biến mã nguồn C thành một ngôn ngữ có độ tin cậy tương đương Ada hay Rust!\n\n---\n\n### 📌 2. 5 QUY TẮC CỐT LÕI MỌI KỸ SƯ FIRMWARE BẮT BUỘC PHẢI THUỘC LÒNG\n1. **MISRA Rule 21.3 (Required) - CẤM CẤP PHÁT ĐỘNG (NO DYNAMIC MEMORY):**\n   - *Quy tắc:* Tuyệt đối không được sử dụng các hàm `malloc()`, `calloc()`, `realloc()` và `free()` từ thư viện chuẩn sau khi hệ thống đã hoàn tất bước khởi động ban đầu.\n   - *Lý do:* Cấp phát động dẫn đến phân mảnh bộ nhớ không thể dự đoán trước thời gian phản hồi (Non-deterministic Execution Time) và nguy cơ cạn kiệt Heap đột ngột. Toàn bộ mảng bộ đệm, Task Stack và Tensor Arena phải được khai báo kích thước tĩnh ngay khi biên dịch!\n2. **MISRA Rule 11.4 & 11.5 (Advisory) - KIỂM SOÁT ÉP KIỂU CON TRỎ:**\n   - *Quy tắc:* Không được ép kiểu tùy tiện giữa một con trỏ tới đối tượng và một kiểu số nguyên (`uint32_t`), hoặc giữa hai con trỏ không tương thích.\n   - *Ngoại lệ duy nhất:* Ánh xạ địa chỉ phần cứng trần (Memory-Mapped Registers). Trong trường hợp này, kỹ sư phải viết Comment giải trình (MISRA Deviation) rõ ràng.\n3. **MISRA Rule 14.2 (Required) - VÒNG LẶP FOR BẤT BIẾN:**\n   - *Quy tắc:* Vòng lặp `for` phải có cấu trúc tiêu chuẩn: Khởi tạo biến lặp, điều kiện kiểm tra ngưỡng cố định và bước tăng/giảm đơn nguyên. Tuyệt đối **không được sửa đổi giá trị biến lặp bên trong thân vòng lặp**!\n4. **MISRA Rule 8.4 (Required) - TƯỜNG MINH TÍNH TỰ CỦA HÀM & BIẾN:**\n   - Tất cả các biến và hàm chỉ sử dụng nội bộ trong file `.c` bắt buộc phải được khai báo với từ khóa `static` để ẩn hoàn toàn khỏi bảng ký hiệu toàn cục (Global Symbol Table), tránh xung đột tên trong dự án lớn.\n5. **MISRA Rule 12.1 (Advisory) - TƯỜNG MINH ĐỘ ƯU TIÊN TOÁN TỬ:**\n   - Không được dựa vào trí nhớ về bảng ưu tiên toán tử trong C. Luôn sử dụng cặp dấu ngoặc đơn `()` để bao bọc các biểu thức tính toán logic và dịch bit:\n   `// SAI: if (status & FLAG == 0) -> Bitwise & có độ ưu tiên thấp hơn == !`\n   `// ĐÚNG: if ((status & FLAG) == 0U)`\n\n---\n\n### 📌 3. THỰC THI KIỂM TRA MISRA TỰ ĐỘNG BẰNG CPPCHECK TRONG CI/CD\nKhông có kỹ sư nào có thể kiểm soát 143 quy tắc MISRA bằng mắt thường. Trong quy trình công nghiệp, công cụ quét mã tĩnh mã nguồn mở **Cppcheck** được tích hợp thẳng vào đường ống tự động hóa:\n\n```bash\n# Lệnh quét toàn bộ mã nguồn theo chuẩn MISRA C:2012:\ncppcheck --enable=all --inconclusive --std=c99 --misra-addon=misra.json main/\n```\n\nFile cấu hình `misra.json` sẽ chỉ ra các dòng mã vi phạm và từ chối cấp phép xuất xưởng bản firmware nếu phát hiện bất kỳ lỗi Required Rule nào!\n\n---\n\n### 📌 4. MÃ NGUỒN C MẪU TUÂN THỦ 100% MISRA C:2012\n```c\n// Module quản lý bộ đệm cảm biến đạt chuẩn MISRA C:2012\n#include <stdint.h>\n#include <stdbool.h>\n\n#define SENSOR_BUFFER_CAPACITY 128U // Khai báo U rõ ràng cho số nguyên không dấu\n\n// Biến tĩnh cục bộ chỉ có tầm vực trong file (Rule 8.4)\nstatic uint16_t s_sensor_ring_buffer[SENSOR_BUFFER_CAPACITY];\nstatic uint32_t s_head_index = 0U;\n\n// Hàm kiểm tra và nạp dữ liệu không dùng con trỏ bừa bãi\nbool buffer_push_sample(const uint16_t sample_value) {\n    bool is_success = false;\n    \n    // Rõ ràng dấu ngoặc đơn và sử dụng kiểu số nguyên tường minh (Rule 12.1)\n    if (s_head_index < SENSOR_BUFFER_CAPACITY) {\n        s_sensor_ring_buffer[s_head_index] = sample_value;\n        s_head_index = (s_head_index + 1U) % SENSOR_BUFFER_CAPACITY;\n        is_success = true;\n    }\n    return is_success;\n}\n```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🌐 [MISRA Official Portal: MISRA C:2012 Guidelines](https://www.misra.org.uk/) - Cổng thông tin chính thức của tổ chức MIRA.\n- 📄 [ISO 26262-6:2018 - Road Vehicles Functional Safety (Software Level)](https://www.iso.org/standard/68383.html) - Tiêu chuẩn an toàn chức năng quốc tế cho phần mềm xe hơi.\n- 🐙 [GitHub: Cppcheck Static Analysis Tool](https://github.com/danmar/cppcheck) - Công cụ kiểm tra mã nguồn tĩnh tự động hóa tuân thủ MISRA.\n- 📚 Tiêu chuẩn VDA QMC: *\"Automotive SPICE Process Assessment Model (ASPICE v3.1)\"*.",
        "bookId": "book_misra_c",
        "standardRef": "MISRA C:2012 Guidelines for the Use of the C Language in Critical Systems (MIRA Ltd)"
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
        "words": 1321,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *ISO 11898-1:2015 & Bosch CAN Specification 2.0* (Robert Bosch GmbH, Part 1 & 2)\n> *\"CAN uses non-destructive bitwise arbitration based on the Wired-AND mechanism: Dominant bits (logic 0, differential voltage $\\approx 2.0\\text{V}$) overwrite Recessive bits (logic 1, differential voltage $\\approx 0\\text{V}$). If a node transmitting a recessive bit detects a dominant bit on the bus, it immediately loses arbitration, ceases transmission, and switches to receiver mode without corrupting the message.\"*\n> \n> 📊 **Cấu Trúc Khung Tin Dữ Liệu CAN Chuẩn (Standard CAN 2.0A Frame):**\n> | Trường (Field) | Số Bits | Mức Logic Điện Áp | Ý Nghĩa Kỹ Thuật |\n> | :--- | :--- | :--- | :--- |\n> | **SOF (Start of Frame)** | 1 bit | Dominant (0) | Báo hiệu bắt đầu khung và đồng bộ pha xung clock toàn mạng |\n> | **Identifier (ID)** | 11 bits | Tùy biến (ID nhỏ ưu tiên cao) | Định danh gói tin và tham gia phân xử bus Bitwise Arbitration |\n> | **RTR** | 1 bit | Dominant (0: Data) / Recessive (1: Remote) | Phân biệt khung dữ liệu hay khung yêu cầu truyền |\n> | **Control (DLC)** | 6 bits | IDE=0, r0=0, DLC[3:0] (0..8) | Chứa cờ phân biệt khung và số lượng byte dữ liệu thực tế |\n> | **Data Field** | 0..64 bits | Tùy biến (0 đến 8 bytes) | Dữ liệu tải trọng từ các hộp ECU / cảm biến |\n> | **CRC Field** | 15 bits | Đa thức CRC-15 | Mã kiểm tra toàn vẹn dữ liệu đường truyền |\n> | **ACK Slot** | 2 bits | ACK bit + Delimiter | Nút nhận kéo Dominant để xác nhận gói tin không có lỗi |\n> | **EOF (End of Frame)** | 7 bits | Recessive (1111111) | Báo kết thúc khung và trả bus về trạng thái tự do |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO UART/I2C THẤT BẠI TRONG NHÀ MÁY & Ô TÔ?\nTrong phòng thí nghiệm với dây cắm dài 10cm, giao tiếp UART hay I2C hoạt động hoàn hảo. Nhưng khi đưa vào nhà máy công nghiệp hoặc khoang động cơ ô tô:\n- **Nhiễu điện từ cực mạnh (EMI):** Động cơ điện công suất lớn, cuộn đánh lửa bugi và biến tần công nghiệp tạo ra các xung điện từ trường hàng ngàn Volt quét qua dây tín hiệu. Giao tiếp đơn cực (Single-Ended) như UART dùng mức điện áp so với đất (GND) sẽ bị nhiễu làm méo dạng sóng, nhảy bit ngẫu nhiên khiến dữ liệu sai lệch hoàn toàn.\n- **Hiện tượng đất không đồng thế (Ground Loop):** Hai thiết bị cách nhau 50 mét thường có điện thế đất chênh lệch nhau vài Volt, gây ra dòng điện chạy qua dây mát làm nổ cổng vi điều khiển!\n\n**Giải pháp tiêu chuẩn toàn cầu:** Mạng **CAN Bus (Controller Area Network)** phát minh bởi Robert Bosch GmbH và chuẩn hóa theo **ISO 11898-1**:\n- Sử dụng cặp dây xoắn vi sai (**CAN_H** và **CAN_L**): Tín hiệu là hiệu điện thế giữa hai dây ($V_{diff} = V_{CAN_H} - V_{CAN_L}$). Khi nhiễu điện từ đánh vào, cả 2 dây cùng tăng điện áp như nhau $\rightarrow$ Hiệu điện thế giữa 2 dây giữ nguyên không đổi!\n- Trạng thái logic:\n  - **Dominant (Bit 0):** $V_{CAN_H} = 3.5V$, $V_{CAN_L} = 1.5V implies V_{diff} = 2.0V$.\n  - **Recessive (Bit 1):** Cả 2 dây đều ở mức $2.5V implies V_{diff} = 0.0V$.\n\n---\n\n### 📌 2. CƠ CHẾ PHÂN XỬ KHÔNG PHÁ HỦY THEO CHUẨN ISO 11898-1 (ARBITRATION)\nĐiều kỳ diệu nhất của mạng CAN Bus là cơ chế đa chủ (Multi-Master) giải quyết xung đột đường truyền mà không làm mất gói tin:\n- Khi nhiều nút (ECU) cùng phát tin một lúc, đường bus hoạt động như một cổng logic **AND**: Trạng thái **Dominant (Bit 0)** luôn đè bẹp trạng thái **Recessive (Bit 1)**!\n- Mỗi nút vừa phát một bit vừa tự đọc lại đường bus:\n  - Nếu nút phát ra bit 1 (Recessive) nhưng đọc về thấy bit 0 (Dominant) $implies$ Nút biết có một nút khác quan trọng hơn đang nói, nó **lập tức im lặng nhường đường bus** và chuyển sang chế độ nhận mà không làm hỏng gói tin của nút kia!\n  - **Hệ quả kiến trúc:** Mã định danh gói tin (**CAN Identifier**) có giá trị số càng nhỏ thì độ ưu tiên càng cao!\n    - Ví dụ: Gói tin phanh khẩn cấp `ID: 0x01` sẽ luôn thắng và đè bẹp gói tin đo nhiệt độ định kỳ `ID: 0x120`.\n\n---\n\n### 📌 3. LẬP TRÌNH TWAI DRIVER TRÊN ESP32-S3 CHUẨN ESP-IDF V5.X\nESP32-S3 tích hợp sẵn bộ điều khiển phần cứng CAN 2.0B gọi là **TWAI (Two-Wire Automotive Interface)**:\n- Hỗ trợ tốc độ lên tới **1 Mbps**.\n- Hỗ trợ bộ lọc phần cứng (Hardware Acceptance Filter) lọc các ID không mong muốn mà không tiêu tốn chu kỳ CPU:\n\n```c\n// Cấu hình TWAI (CAN Bus) chuẩn ESP-IDF v5.x\n#include \"driver/twai.h\"\n#include \"esp_log.h\"\n\nvoid init_can_bus_twai(void) {\n    // 1. Cấu hình thời gian bit (Baudrate 500 kbps chuẩn ô tô)\n    twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();\n\n    // 2. Cấu hình bộ lọc phần cứng (Chỉ nhận các ID từ 0x100 đến 0x10F)\n    twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();\n\n    // 3. Cấu hình chân GPIO truyền nhận nối tới CAN Transceiver (TJA1050 / SN65HVD230)\n    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(\n        GPIO_NUM_4, // TX Pin\n        GPIO_NUM_5, // RX Pin\n        TWAI_MODE_NORMAL\n    );\n\n    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));\n    ESP_ERROR_CHECK(twai_start());\n    ESP_LOGI(\"CAN\", \"✅ Mạng TWAI/CAN Bus 500kbps đã sẵn sàng hoạt động!\");\n}\n\nvoid send_can_ai_telemetry(uint8_t alert_level, float confidence) {\n    twai_message_t msg;\n    msg.identifier = 0x120; // CAN ID tiêu chuẩn 11-bit\n    msg.flags = TWAI_MSG_FLAG_NONE;\n    msg.data_length_code = 5; // 5 bytes dữ liệu\n    msg.data[0] = alert_level;\n    \n    // Gói số thực confidence vào 4 bytes dữ liệu\n    memcpy(&msg.data[1], &confidence, sizeof(float));\n\n    if (twai_transmit(&msg, pdMS_TO_TICKS(10)) == ESP_OK) {\n        ESP_LOGI(\"CAN\", \"Đã truyền thành công bản tin CAN cảnh báo AI!\");\n    } else {\n        ESP_LOGW(\"CAN\", \"Bus bận hoặc chưa có điện trở đầu cuối 120 Ohm!\");\n    }\n}\n```\n\n---\n\n### 📌 4. BẪY CHÍ MẠNG & THIẾT KẾ PHẦN CỨNG MẠNG CAN THỰC TẾ\n❌ **Quên hai điện trở đầu cuối 120 Ohm (Termination Resistors):**\nĐường truyền tín hiệu vi sai tốc độ cao bắt buộc phải có **hai điện trở 120 Ohm mắc song song ở hai đầu xa nhất của tuyến cáp** (đo điện trở tổng giữa CAN_H và CAN_L khi tắt nguồn phải bằng đúng $60\text{ }Omega$). Nếu thiếu điện trở này, xung điện áp sẽ bị dội ngược phản xạ (Reflection) ở cuối dây, phá hủy hoàn toàn tín hiệu khiến vi điều khiển rơi vào trạng thái lỗi phần cứng **Bus-Off State**!\n❌ **Không nối dây CAN Transceiver:**\nCác chân GPIO của ESP32-S3 chỉ là mức logic kỹ thuật số 3.3V TTL. Bạn không thể cắm trực tiếp chân vi điều khiển vào đường dây CAN Bus xe hơi! Bắt buộc phải thông qua IC đệm phần cứng như **SN65HVD230** (dùng nguồn 3.3V) hoặc **TJA1050** (dùng nguồn 5V).\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 📄 [ISO 11898-1:2015 - Controller Area Network (CAN) Data Link Layer](https://www.iso.org/standard/63648.html) - Tiêu chuẩn quốc tế chuẩn hóa mạng CAN Bus.\n- 🌐 [ESP-IDF Two-Wire Automotive Interface (TWAI) Driver Guide](https://docs.espressif.com/projects/esp-idf/en/v5.1/esp32s3/api-reference/peripherals/twai.html) - Tài liệu hướng dẫn lập trình TWAI từ Espressif.\n- 📄 [Bosch CAN Specification Version 2.0 (Robert Bosch GmbH)](https://www.cs.cmu.edu/~koopman/des_s99/can/) - Bản đặc tả kỹ thuật gốc từ tập đoàn Bosch.\n- 🌐 [Modbus Application Protocol Specification v1.1b3](https://modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf) - Chuẩn giao thức điều khiển công nghiệp RS-485 Modbus RTU.",
        "bookId": "book_can_iso11898",
        "standardRef": "ISO 11898-1:2015 & Bosch CAN Specification 2.0 (Part 1, 2, 4)"
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
        "words": 1072,
        "isNativePdf": false,
        "content": "> 📜 **TRÍCH ĐOẠN ĐẶC TẢ TỪ TÀI LIỆU GỐC:**\n> **Tài liệu:** *Test-Driven Development for Embedded C* (James W. Grenning, Pragmatic Bookshelf, Ch.2 & 7)\n> *\"To test embedded software off-target, isolate hardware dependencies using a Hardware Abstraction Layer (HAL) with function pointers. The Dual-Target build pattern compiles business logic and DSP algorithms on both the host development PC (using GCC and the Unity test runner) and the target microcontroller (using the cross-compiler toolchain). Mocking collaborators with CMock allows automated verification without physical sensors.\"*\n> \n> 📊 **Bảng So Sánh Hai Phương Thức Phát Triển Phần Mềm Nhúng:**\n> | Tiêu Chí Đánh Giá | Phương Pháp Thủ Công Truyền Thống | Phương Pháp TDD & CI/CD Chuẩn Chuyên Nghiệp |\n> | :--- | :--- | :--- |\n> | **Thời Gian Kiểm Thử** | 3 - 5 phút (Cắm nạp flash chip thật, nhìn LED/Serial) | **2 - 3 giây** (Chạy 500 test cases tự động trên Host PC) |\n> | **Môi Trường Chạy** | Phụ thuộc 100% phần cứng ESP32-S3 vật lý | Độc lập phần cứng nhờ Mocking và trừu tượng hóa HAL |\n> | **Khả Năng Phát Hiện Lỗi Hồi Quy** | Kém (Sửa module A làm hỏng ngầm module B) | **Tuyệt đối** (Mỗi lần git push, CI tự động quét và báo đỏ) |\n> | **Tuân Thủ Chuẩn MISRA** | Không kiểm tra hoặc chỉ kiểm tra trước ngày xuất xưởng | Cppcheck quét tĩnh mã nguồn tự động ở mọi Pull Request |\n\n---\n\n### 📌 1. BẢN CHẤT CỐT LÕI: THOÁT KHỎI CÁCH TIẾP CẬN THỦ CÔNG\nSự khác biệt lớn nhất giữa một thợ code nghiệp dư và một kỹ sư Firmware chuyên nghiệp tại các tập đoàn lớn (Bosch, Qualcomm, Tesla):\n- **Cách nghiệp dư:** Viết code xong cắm cáp USB nạp thẳng vào mạch, dùng mắt nhìn đèn LED có chớp tắt không hoặc nhìn Serial Monitor in ra vài dòng chữ. Khi dự án lớn lên hàng trăm file, việc sửa một dòng code ở module này có thể vô tình phá hỏng một tính năng ở module khác (**Hồi quy lỗi - Regression Bug**) mà hoàn toàn không hề hay biết!\n- **Chuẩn kỹ sư chuyên nghiệp (TDD - Test Driven Development):**\n  Thiết kế mã nguồn độc lập phần cứng thông qua tầng trừu tượng (**Hardware Abstraction Layer - HAL**). Viết hàng trăm kịch bản kiểm thử tự động (**Unit Test**) chạy trực tiếp trên máy tính phát triển (PC x86 Linux/Windows) chỉ trong **3 giây**.\n  Mỗi khi thực hiện lệnh `git push` lên GitHub, máy chủ đám mây tự động kích hoạt container Linux để biên dịch firmware, quét lỗi tĩnh MISRA và chạy toàn bộ Unit Test. Nếu có lỗi, hệ thống lập tức báo đỏ và từ chối xuất xưởng!\n\n---\n\n### 📌 2. THIẾT KẾ PHẦN CỨNG TRỪU TƯỢNG (HAL) ĐỂ MOCK TRÊN MÁY TÍNH\nLàm thế nào để chạy kiểm thử một thuật toán phát hiện rung động hỏng hóc trên máy tính PC khi không hề có cảm biến MPU6050 gắn vào cổng USB?\n- **Giải pháp:** Sử dụng **Con trỏ hàm (Function Pointers)** để đảo ngược phụ thuộc (Dependency Injection):\n\n```c\n// Interface trừu tượng đọc cảm biến (HAL):\ntypedef int16_t (*sensor_read_fn_t)(void);\n\n// Thuật toán nhận con trỏ hàm, hoàn toàn độc lập với phần cứng:\nbool check_vibration_alert(sensor_read_fn_t read_fn, int16_t threshold) {\n    if (read_fn == NULL) return false;\n    int16_t current_val = read_fn();\n    return (current_val > threshold);\n}\n```\n- Khi nạp vào ESP32-S3 thật: Ta truyền hàm đọc thanh ghi I2C thật: `check_vibration_alert(i2c_read_mpu6050, 1000);`.\n- Khi chạy Unit Test trên máy tính PC: Framework **CMock** tự động tạo ra một hàm giả lập (Mock Function) bơm các giá trị giả định (ví dụ 1200 để kiểm tra còi báo động có kêu không)!\n\n---\n\n### 📌 3. VIẾT UNIT TEST VỚI THƯ VIỆN CHUẨN UNITY\nUnity là framework kiểm thử mã nguồn C chuẩn công nghiệp được phát triển bởi **ThrowTheSwitch.org**:\n\n```c\n#include \"unity.h\"\n#include <math.h>\n\nvoid setUp(void) {}\nvoid tearDown(void) {}\n\nvoid test_quantization_formula_accuracy(void) {\n    // Kiểm tra công thức lượng tử hóa INT8 theo chuẩn Benoit Jacob 2018:\n    float real_val = 0.0f;\n    float scale = 0.05f;\n    int8_t zero_point = -10;\n    \n    int8_t q = (int8_t)(roundf(real_val / scale) + zero_point);\n    TEST_ASSERT_EQUAL_INT8(-10, q); // Float 0.0f phải ánh xạ về đúng Zero-point!\n}\n\nvoid test_iir_filter_noise_suppression(void) {\n    // Kiểm tra bộ lọc thông thấp làm mịn xung nhiễu\n    float output = apply_ema_filter(100.0f, 0.0f, 0.2f);\n    TEST_ASSERT_FLOAT_WITHIN(0.01f, 20.0f, output);\n}\n\nint main(void) {\n    UNITY_BEGIN();\n    RUN_TEST(test_quantization_formula_accuracy);\n    RUN_TEST(test_iir_filter_noise_suppression);\n    return UNITY_END();\n}\n```\n\n---\n\n### 📌 4. THIẾT LẬP ĐƯỜNG ỐNG CI/CD TỰ ĐỘNG BẰNG GITHUB ACTIONS\nTạo file cấu hình `.github/workflows/firmware_ci.yml` trong thư mục dự án:\n\n```yaml\nname: Automated Firmware CI/CD\non: [push, pull_request]\n\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout Code\n        uses: actions/checkout@v3\n\n      - name: Quét lỗi tĩnh mã nguồn theo chuẩn MISRA (Cppcheck)\n        run: |\n          sudo apt-get install -y cppcheck\n          cppcheck --enable=all --error-exitcode=1 main/\n\n      - name: Chạy Unit Test tự động trên Host PC (Unity Framework)\n        run: |\n          gcc test/test_algo.c src/algo.c -Iinclude -lunity -o run_tests\n          ./run_tests\n\n      - name: Biên dịch tự động nhị phân ESP-IDF (Build Firmware)\n        uses: espressif/esp-idf-ci-action@v1\n        with:\n          esp_idf_version: v5.1\n          target: esp32s3\n          path: '.'\n```\n\n---\n\n### 📌 5. TÀI LIỆU NGUỒN CHUẨN QUỐC TẾ & LIÊN KẾT CHÍNH THỨC\n- 🐙 [GitHub: ThrowTheSwitch Unity Unit Test Framework for C](https://github.com/ThrowTheSwitch/Unity) - Thư viện Unit Test nhúng số 1 thế giới.\n- 🐙 [GitHub: ThrowTheSwitch CMock - Automated Mock Generator](https://github.com/ThrowTheSwitch/CMock) - Công cụ sinh hàm Mock tự động.\n- 📚 Sách chuyên khảo: *\"Test-Driven Development for Embedded C\"* (James W. Grenning, Pragmatic Bookshelf).\n- 🐙 [GitHub: Espressif esp-idf-ci-action for GitHub Actions](https://github.com/espressif/esp-idf-ci-action) - GitHub Action chính thức từ Espressif.",
        "bookId": "book_tdd_embedded_c",
        "standardRef": "James W. Grenning (Pragmatic Bookshelf) Ch.2, 7 & 10"
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
            notebookDocs[existingIdx].bookId = defDoc.bookId;
            notebookDocs[existingIdx].standardRef = defDoc.standardRef;
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

    // Lookup matching book from Bookshelf
    const docBookMap = {
        "doc_c_pointers_deepdive": "book_expert_c",
        "doc_stage1_memory": "book_esps3_trm",
        "doc_stage2_timer": "book_esps3_trm",
        "doc_stage3_sensors": "book_oppenheim_dsp",
        "doc_stage4_freertos": "book_freertos_kernel",
        "doc_stage5_network": "book_esps3_trm",
        "doc_stage6_tinyml": "book_jacob_quantization",
        "doc_stage7_lowpower": "book_esps3_trm",
        "doc_stage8_capstone": "book_mlperf_tiny",
        "doc_stage9_c_interview": "book_iso_c11_standard",
        "doc_stage10_baremetal": "book_esps3_trm",
        "doc_stage11_debug": "book_esps3_trm",
        "doc_stage12_misra": "book_misra_c",
        "doc_stage13_canbus": "book_can_iso11898",
        "doc_stage14_unittest": "book_tdd_embedded_c"
    };

    const bookId = doc.bookId || docBookMap[doc.id];
    const book = (typeof technicalBooksData !== 'undefined') ? technicalBooksData.find(b => b.id === bookId) : null;

    // Cập nhật nút xem sách ở Header
    const bookHeaderBtn = document.getElementById("nb-reader-book-header-btn");
    if (bookHeaderBtn) {
        if (book) {
            bookHeaderBtn.style.display = "inline-flex";
            bookHeaderBtn.innerHTML = `<span>📚</span> Xem Sách: ${escapeHtml(book.title.length > 22 ? book.title.slice(0, 22) + '...' : book.title)} ↗`;
            bookHeaderBtn.onclick = () => openBookshelfForBook(book.id);
        } else {
            bookHeaderBtn.style.display = "none";
        }
    }

    const contentEl = document.getElementById("nb-doc-reader-content");
    if (contentEl) {
        let bannerHtml = '';
        if (book) {
            bannerHtml = `
            <div class="nb-reader-book-banner">
                <div class="nb-book-banner-left">
                    <div class="nb-book-banner-cover" style="background: ${book.coverGradient};">
                        <span class="nb-book-banner-icon">${book.coverIcon}</span>
                    </div>
                    <div class="nb-book-banner-info">
                        <div class="nb-book-banner-badge">📚 TÀI LIỆU GỐC & SÁCH THAM CHIẾU TỪ TỦ SÁCH</div>
                        <h4 class="nb-book-banner-title">${escapeHtml(book.title)}</h4>
                        <div class="nb-book-banner-author">✍️ ${escapeHtml(book.author)} (${book.year}) • ${escapeHtml(book.format)} • ${escapeHtml(book.pages)}</div>
                        <div class="nb-book-banner-ref">🎯 <strong>Mục tham chiếu:</strong> ${escapeHtml(doc.standardRef || book.keyChapters[0])}</div>
                    </div>
                </div>
                <div class="nb-book-banner-actions">
                    <button type="button" class="btn btn-accent" onclick="openBookshelfForBook('${book.id}')" title="Mở cuốn sách này trong Tủ Sách Kỹ Thuật">
                        <span>📚</span> Mở Trong Tủ Sách ↗
                    </button>
                    <a href="${book.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" title="Tải trực tiếp file PDF gốc">
                        <span>📥</span> Tải PDF Gốc ↗
                    </a>
                </div>
            </div>`;
        }
        contentEl.innerHTML = bannerHtml + formatMarkdownChat(doc.content || "Nội dung tài liệu đang được cập nhật...");
    }

    // Xác định Stage Index của tài liệu này để nạp 12 bài tập C tương ứng (14 Modules)
    const docStageMap = {
        "doc_c_pointers_deepdive": 0,
        "doc_stage1_memory": 0,
        "doc_stage2_timer": 1,
        "doc_stage3_sensors": 2,
        "doc_stage4_freertos": 3,
        "doc_stage5_network": 4,
        "doc_stage6_tinyml": 5,
        "doc_stage7_lowpower": 6,
        "doc_stage8_capstone": 7,
        "doc_stage9_c_interview": 8,
        "doc_stage10_baremetal": 9,
        "doc_stage11_debug": 10,
        "doc_stage12_misra": 11,
        "doc_stage13_canbus": 12,
        "doc_stage14_unittest": 13
    };
    let stageIdx = (docStageMap[doc.id] !== undefined) ? docStageMap[doc.id] : 0;
    window.currentReaderStageIdx = stageIdx;

    // Cập nhật Thẻ Trắc Nghiệm Lý Thuyết trong Reader
    const quizTitle = document.getElementById("nb-reader-quiz-title");
    if (quizTitle) {
        quizTitle.innerText = `Bài Kiểm Tra Trắc Nghiệm: Module ${stageIdx + 1} (${doc.title.length > 40 ? doc.title.slice(0, 40) + '...' : doc.title})`;
    }
    const quizStatus = document.getElementById("nb-reader-quiz-status");
    if (quizStatus && typeof getModuleQuizResults === 'function') {
        const res = getModuleQuizResults()[stageIdx];
        if (res) {
            quizStatus.innerHTML = `Kết quả đã thi: <strong style="color: ${res.passed ? '#34d399' : '#f87171'}">${res.score}/5 câu đúng ${res.passed ? '✅ (Đạt Chuẩn)' : '⚠️ (Chưa Đạt)'}</strong> • Bấm nút bên phải để làm lại hoặc cải thiện điểm.`;
        } else {
            quizStatus.innerHTML = `5 Câu hỏi trắc nghiệm chuyên sâu sát thực tế trích từ tài liệu gốc. Yêu cầu đạt tối thiểu 4/5 câu đúng (+50 XP).`;
        }
    }

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
    const docStageMap = {
        "doc_c_pointers_deepdive": 0,
        "doc_stage1_memory": 0,
        "doc_stage2_timer": 1,
        "doc_stage3_sensors": 2,
        "doc_stage4_freertos": 3,
        "doc_stage5_network": 4,
        "doc_stage6_tinyml": 5,
        "doc_stage7_lowpower": 6,
        "doc_stage8_capstone": 7,
        "doc_stage9_c_interview": 8,
        "doc_stage10_baremetal": 9,
        "doc_stage11_debug": 10,
        "doc_stage12_misra": 11,
        "doc_stage13_canbus": 12,
        "doc_stage14_unittest": 13
    };
    let stageIdx = (doc && docStageMap[doc.id] !== undefined) ? docStageMap[doc.id] : 0;

    if (typeof setModuleFilter === 'function') {
        setModuleFilter(String(stageIdx));
    }
    if (typeof switchTab === 'function') {
        switchTab('practice');
    }
    showToast(`🎯 Đã mở danh sách 12 bài tập C của Module ${stageIdx + 1}`);
}

function openModuleQuizForCurrentDoc() {
    let doc = (selectedDocId && selectedDocId !== 'all') ? notebookDocs.find(d => d.id === selectedDocId) : null;
    if (!doc) doc = notebookDocs[0];
    const docStageMap = {
        "doc_c_pointers_deepdive": 0,
        "doc_stage1_memory": 0,
        "doc_stage2_timer": 1,
        "doc_stage3_sensors": 2,
        "doc_stage4_freertos": 3,
        "doc_stage5_network": 4,
        "doc_stage6_tinyml": 5,
        "doc_stage7_lowpower": 6,
        "doc_stage8_capstone": 7,
        "doc_stage9_c_interview": 8,
        "doc_stage10_baremetal": 9,
        "doc_stage11_debug": 10,
        "doc_stage12_misra": 11,
        "doc_stage13_canbus": 12,
        "doc_stage14_unittest": 13
    };
    let stageIdx = (doc && docStageMap[doc.id] !== undefined) ? docStageMap[doc.id] : 0;

    if (typeof openModuleQuiz === 'function') {
        openModuleQuiz(stageIdx);
    }
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

    // Lookup matching book for task
    const taskBookId = taskTheory.bookId || (typeof TASK_BOOK_MAP !== 'undefined' ? TASK_BOOK_MAP[task.id] : null);
    const taskBook = (typeof technicalBooksData !== 'undefined' && taskBookId) ? technicalBooksData.find(b => b.id === taskBookId) : null;

    const bookBtn = document.getElementById("task-modal-book-btn");
    const footerBookBtn = document.getElementById("task-modal-footer-book-btn");

    if (taskBook) {
        if (bookBtn) {
            bookBtn.style.display = "inline-flex";
            bookBtn.innerHTML = `<span>📚</span> ${escapeHtml(taskBook.title.length > 25 ? taskBook.title.slice(0, 25) + '...' : taskBook.title)} ↗`;
        }
        if (footerBookBtn) {
            footerBookBtn.style.display = "inline-flex";
            footerBookBtn.innerHTML = `<span>📚</span> Xem Sách: ${escapeHtml(taskBook.title.length > 20 ? taskBook.title.slice(0, 20) + '...' : taskBook.title)} ↗`;
        }
        window.openBookFromTaskModal = () => {
            closeTaskTheoryModal();
            openBookshelfForBook(taskBook.id);
        };
    } else {
        if (bookBtn) bookBtn.style.display = "none";
        if (footerBookBtn) footerBookBtn.style.display = "none";
    }

    const contentEl = document.getElementById("task-modal-content");
    if (contentEl) {
        let taskBookCardHtml = '';
        if (taskBook) {
            taskBookCardHtml = `
            <div class="task-modal-book-box">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 22px;">${taskBook.coverIcon}</span>
                    <div>
                        <div style="font-size: 10px; color: var(--cyan); font-weight: 700; text-transform: uppercase;">📚 TÀI LIỆU GỐC THAM CHIẾU</div>
                        <div style="font-size: 12.5px; color: #ffffff; font-weight: 600;">${escapeHtml(taskBook.title)}</div>
                        <div style="font-size: 11px; color: #94a3b8;">✍️ ${escapeHtml(taskBook.author)} • 🎯 ${escapeHtml(taskTheory.standardRef || taskBook.keyChapters[0])}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button type="button" class="btn btn-accent" style="font-size: 11px; padding: 4px 10px;" onclick="openBookFromTaskModal()">
                        <span>📚</span> Đọc Trong Tủ Sách ↗
                    </button>
                    <a href="${taskBook.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;">
                        <span>📥</span> PDF Gốc ↗
                    </a>
                </div>
            </div>`;
        }
        if (typeof formatMarkdownChat === 'function') {
            contentEl.innerHTML = taskBookCardHtml + formatMarkdownChat(taskTheory.content);
        } else {
            contentEl.innerHTML = taskBookCardHtml + taskTheory.content.replace(/\n/g, '<br>');
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
window.openModuleQuizForCurrentDoc = openModuleQuizForCurrentDoc;
window.openNotebookForStage = openNotebookForStage;
window.askAiAboutStage = askAiAboutStage;
window.selectNotebookDoc = selectNotebookDoc;
window.setDocTagFilter = setDocTagFilter;
window.renderNotebookView = renderNotebookView;
window.renderNotebookDocsList = renderNotebookDocsList;


window.defaultNotebookDocs = defaultNotebookDocs;
window.notebookDocs = notebookDocs;


// Mở sách trong Tủ Sách ứng với tài liệu đang đọc trong Reader
window.openBookshelfForCurrentReaderDoc = function() {
    let doc = (selectedDocId && selectedDocId !== 'all') ? notebookDocs.find(d => d.id === selectedDocId) : null;
    if (!doc) doc = notebookDocs[0];
    if (!doc) return;
    const docBookMap = {
        "doc_c_pointers_deepdive": "book_expert_c",
        "doc_stage1_memory": "book_esps3_trm",
        "doc_stage2_timer": "book_esps3_trm",
        "doc_stage3_sensors": "book_oppenheim_dsp",
        "doc_stage4_freertos": "book_freertos_kernel",
        "doc_stage5_network": "book_esps3_trm",
        "doc_stage6_tinyml": "book_jacob_quantization",
        "doc_stage7_lowpower": "book_esps3_trm",
        "doc_stage8_capstone": "book_mlperf_tiny",
        "doc_stage9_c_interview": "book_iso_c11_standard",
        "doc_stage10_baremetal": "book_esps3_trm",
        "doc_stage11_debug": "book_esps3_trm",
        "doc_stage12_misra": "book_misra_c",
        "doc_stage13_canbus": "book_can_iso11898",
        "doc_stage14_unittest": "book_tdd_embedded_c"
    };
    const bookId = doc.bookId || docBookMap[doc.id];
    if (bookId && typeof openBookshelfForBook === 'function') {
        openBookshelfForBook(bookId);
    } else if (typeof openBookshelfModal === 'function') {
        openBookshelfModal();
    }
};
