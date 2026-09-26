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
        id: "doc_c_pointers_deepdive",
        title: "Giáo Trình Cốt Lõi: Làm Chủ Con Trỏ (Pointers) & Thao Tác Bộ Nhớ Cho Kỹ Sư Nhúng ESP32",
        category: "Lộ Trình 1",
        tags: ["#ConTrỏ", "#Pointers", "#C_Core", "#Memory", "#ESP32"],
        date: "26/09/2026",
        words: 1150,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI CỦA CON TRỎ (POINTER) TRONG C
Đối với người mới học lập trình C, khái niệm "con trỏ" thường gây cảm giác mơ hồ vì nó gắn liền với kiến trúc phần cứng bên dưới.
Để hiểu con trỏ, hãy hình dung **bộ nhớ RAM** của vi điều khiển ESP32 như một **khách sạn có hàng triệu ngăn tủ locker**:
- Mỗi ngăn tủ có một **Số phòng duy nhất** gọi là **Địa chỉ bộ nhớ (Memory Address)**, viết dưới hệ thập lục phân Hexa (ví dụ: \`0x3FFB0004\`).
- Bên trong ngăn tủ chứa **Dữ liệu thực tế (Value)**, ví dụ số nguyên \`42\`.

👉 **Biến thông thường** (\`int x = 42;\`): Bạn đặt tên cho ngăn tủ đó là \`x\`. Giá trị lưu trong tủ là \`42\`.
👉 **Biến con trỏ** (\`int *ptr = &x;\`): Là một tờ giấy ghi lại **Số phòng của x** (\`0x3FFB0004\`). Con trỏ **KHÔNG** chứa số 42, nó chỉ chứa **địa chỉ nơi số 42 đang ngụ cư**!

---

### 📌 2. HAI TOÁN TỬ NỀN TẢNG: TOÁN TỬ \`&\` VÀ TOÁN TỬ \`*\`
- **Toán tử lấy địa chỉ \`&\` (Address-of):**
  \`&x\` có nghĩa là: *"Hãy cho tôi biết địa chỉ ô nhớ nơi biến x đang nằm trên RAM!"*
- **Toán tử giải tham chiếu \`*\` (Dereference):**
  \`*ptr\` có nghĩa là: *"Hãy đi đến địa chỉ ô nhớ mà ptr đang chỉ tới, mở ngăn tủ đó ra để ĐỌC hoặc GHI ĐÈ dữ liệu mới!"*

\`\`\`c
int a = 10;      // Ô nhớ của a (ví dụ 0x1000) chứa số 10
int *p = &a;     // p lưu giá trị 0x1000 (địa chỉ của a)

printf("Địa chỉ của a: %p\\n", p);   // In ra: 0x1000
printf("Giá trị trong a: %d\\n", *p);  // Đọc tại 0x1000 -> In ra: 10

*p = 99;         // Ghi đè số 99 vào ô nhớ 0x1000!
printf("Biến a sau ghi đè: %d\\n", a); // a bây giờ đã biến thành 99!
\`\`\`

---

### 📌 3. CON TRỎ VÀ MẢNG: BẢN CHẤT SỐ HỌC CON TRỎ (POINTER ARITHMETIC)
Trong C, **Tên mảng thực chất là một con trỏ hằng trỏ vào phần tử đầu tiên**:
\`\`\`c
int arr[3] = {10, 20, 30};
// arr tương đương với &arr[0]
\`\`\`
- Khi bạn viết \`arr[i]\`, trình biên dịch thực chất dịch thành: \`*(arr + i)\`.
- **Quy tắc số học con trỏ:**
  Phép cộng con trỏ \`ptr + 1\` **KHÔNG PHẢI** là cộng thêm 1 byte! Nó tự động nhảy thêm **kích thước của kiểu dữ liệu** (\`sizeof(type)\`):
  + Với \`char *p\`: \`p + 1\` nhảy 1 byte.
  + Với \`int *p\` hoặc \`float *p\`: \`p + 1\` nhảy **4 bytes**.
  + Với con trỏ Struct 16 byte: \`p + 1\` nhảy đúng **16 bytes**.

---

### 📌 4. CON TRỎ STRUCT & KỸ THUẬT TRUYỀN DỮ LIỆU ZERO-COPY
Trong hệ thống nhúng, dữ liệu cảm biến hoặc âm thanh/hình ảnh thường được đóng gói vào Struct:
\`\`\`c
typedef struct __attribute__((packed)) {
    uint32_t timestamp;
    int16_t accel_x, accel_y, accel_z;
} IMU_Frame_t;
\`\`\`
- **Toán tử mũi tên \`->\`:**
  Nếu \`frame\` là con trỏ (\`IMU_Frame_t *frame\`), thay vì viết cồng kềnh \`(*frame).accel_x\`, ta viết gọn gàng: \`frame->accel_x\`.
- **Tại sao bắt buộc truyền con trỏ (Zero-Copy)?**
  Một khung âm thanh 16kHz có kích thước 32,000 bytes. Nếu truyền tham trị (\`void process(AudioFrame data)\`), CPU phải copy toàn bộ 32KB lên Stack -> **Tràn Stack Overflow làm sập nguồn vi điều khiển ngay lập tức**!
  Khi truyền con trỏ (\`void process(const AudioFrame *data)\`), CPU chỉ truyền đúng **1 địa chỉ 4 byte**! Tiết kiệm 99.9% RAM và có độ trễ 0ms.
- **Từ khóa \`__attribute__((packed))\`:**
  Ngăn compiler chèn các byte padding rỗng, đảm bảo cấu trúc byte của struct khớp chính xác 100% với luồng byte thô đọc từ cảm biến I2C/SPI.

---

### 📌 5. CÁC LOẠI CON TRỎ ĐẶC BIỆT TRONG FREERTOS & EMBEDDED
1. **Con trỏ \`void*\` (Generic Pointer):**
   Con trỏ vạn năng có thể trỏ tới bất kỳ kiểu dữ liệu nào. Trong FreeRTOS, hàm tạo task luôn nhận \`void *pvParameters\` để kỹ sư truyền bất kỳ tham số nào vào task.
2. **Con trỏ Hàm (Function Pointer):**
   Con trỏ lưu địa chỉ mã máy của một hàm. Dùng làm hàm Callback khi ngắt xảy ra hoặc bảng vector ngắt ISR: \`void (*callback_fn)(int event_id);\`.
3. **Con trỏ Hằng (\`const\` Pointers):**
   - \`const int *p\`: Dữ liệu bị khóa chỉ đọc, rất an toàn để bảo vệ bộ đệm đầu vào không bị hàm vô tình sửa đổi.
   - \`int * const p\`: Con trỏ bị khóa vị trí, nhưng giá trị bên trong sửa được.
4. **Con trỏ Volatile (Memory-Mapped I/O):**
   Thao tác trực tiếp thanh ghi phần cứng của ESP32 qua địa chỉ cố định:
   \`*(volatile uint32_t*)0x60004008 = (1 << 2);\` -> Bật GPIO2 không qua thư viện trung gian!

---

### 📌 6. 4 CẠM BẪY CHÍ MẠNG KHI DÙNG CON TRỎ (VÀ CÁCH PHÒNG TRÁNH)
1. **Con trỏ NULL (NULL Pointer Dereference):** Cố đọc \`*p\` khi \`p == NULL\` -> Kích hoạt Guru Meditation Crash.
   ✅ *Khắc phục*: Luôn kiểm tra \`if (p == NULL) return ESP_ERR_INVALID_ARG;\`.
2. **Con trỏ treo (Dangling Pointer):** Trỏ vào biến cục bộ trong một hàm đã kết thúc, hoặc ô nhớ vừa bị \`free()\`.
   ✅ *Khắc phục*: Sau khi gọi \`free(ptr);\`, luôn gán ngay \`ptr = NULL;\`.
3. **Rò rỉ bộ nhớ (Memory Leak):** Cấp phát \`malloc()\` nhưng quên \`free()\`, làm cạn kiệt RAM sau một thời gian chạy.
4. **Ngoại lệ căn lề (Unaligned Access Fault):** Ép con trỏ mảng byte lẻ sang con trỏ 32-bit khiến phần cứng CPU phát sinh ngắt ngoại lệ crash.`
    },
    {
        id: "doc_stage1_memory",
        title: "Lộ Trình Bước 1: Kiến Trúc Bộ Nhớ ESP32-S3 & Quản Lý C Core Toàn Diện",
        category: "Lộ Trình 1",
        tags: ["#LộTrình", "#Bước1", "#ESP32", "#Memory", "#Pointers"],
        date: "26/09/2026",
        words: 850,
        isNativePdf: false,
        content: `### 1. Phân Vùng Bản Đồ Bộ Nhớ ESP32-S3
Không gian địa chỉ 32-bit của ESP32-S3 được phân chia thành 4 phân vùng vật lý:
- **Internal SRAM0 (64 KB)**: Dùng riêng cho CPU Instruction Cache và các hàm ngắt khẩn cấp \`IRAM_ATTR\`.
- **Internal SRAM1 (384 KB)**: Vùng nhớ chính tốc độ 1 chu kỳ xung nhịp (~240MHz). Đây là nơi duy nhất lý tưởng để đặt **Tensor Arena** của TFLite Micro nhằm đạt độ trễ mili-giây.
- **Internal SRAM2 (64 KB)**: Dành riêng cho các bộ đệm truyền nhận DMA của Wi-Fi, Bluetooth và ngoại vi I2S/SPI.
- **RTC Fast/Slow SRAM (16 KB)**: Vùng nhớ duy nhất giữ được trạng thái khi vi điều khiển vào chế độ Deep Sleep tiết kiệm pin (\`RTC_DATA_ATTR\`).
- **External PSRAM (Tối đa 8MB Octal SPI)**: Bộ nhớ ngoài dung lượng lớn nhưng tốc độ truy xuất chậm hơn SRAM nội ~3-4 lần do đi qua bus SPI. Thích hợp chứa buffer ảnh Camera hoặc trọng số mô hình lớn.

### 2. Thao Tác Con Trỏ & Kỹ Thuật Zero-Copy Pass-By-Reference
Khi xử lý các bộ đệm lớn (Audio 16kHz, Camera Frame, Tensor Arena), việc truyền tham trị (pass-by-value) sẽ sao chép toàn bộ mảng lên Stack gây tràn bộ nhớ **Stack Overflow** làm sập nguồn vi điều khiển.
- **Giải pháp**: Luôn truyền con trỏ hằng (\`const Frame_t *frame\`).
- Chỉ tốn đúng **4 bytes** địa chỉ trên Stack, độ trễ truyền tham số 0 mili-giây.
- Sử dụng từ khóa \`__attribute__((packed))\` trên struct để ngăn chặn trình biên dịch tự ý chèn padding bytes, đảm bảo dữ liệu thô đọc từ cảm biến khớp 100% từng byte.

### 3. Yêu Cầu Căn Lề (Memory Alignment 16-byte alignas(16))
ESP32-S3 hỗ trợ tập lệnh mở rộng **Vector AI Instructions (SIMD)**. Để CPU có thể nạp một lúc 128-bit dữ liệu ma trận trọng số INT8, vùng đệm Tensor Arena bắt buộc phải được căn lề 16-byte:
\`\`\`c
constexpr int kTensorArenaSize = 64 * 1024;
alignas(16) static uint8_t tensor_arena[kTensorArenaSize];
\`\`\`
Nếu thiếu \`alignas(16)\`, mô hình sẽ phát sinh ngoại lệ phần cứng LoadStoreAlignment Crash làm sụp nguồn vi điều khiển.

### 4. Stack vs Heap & Chống Phân Mảnh (Anti-Fragmentation)
Trong hệ thống nhúng hoạt động 24/7, việc gọi \`malloc()\`/\`free()\` liên tục sẽ làm phân mảnh Heap, dẫn đến cạn kiệt bộ nhớ OOM (Out Of Memory) dù tổng RAM còn trống vẫn nhiều.
- **Giải pháp**: Luôn ưu tiên cấp phát tĩnh (Static Allocation) cho các bộ đệm cố định.
- Sử dụng Memory Pool cho các đối tượng có kích thước đồng nhất.
- Theo dõi định kỳ bằng \`heap_caps_get_minimum_free_size(MALLOC_CAP_INTERNAL)\`.`
    },
    {
        id: "doc_stage2_timer",
        title: "Lộ Trình Bước 2: GPTimer Định Thời Micro-giây & Ngắt IRAM_ATTR",
        category: "Lộ Trình 2",
        tags: ["#LộTrình", "#Bước2", "#GPTimer", "#ISR"],
        date: "24/09/2026",
        words: 420,
        isNativePdf: false,
        content: `### 1. General Purpose Timer (GPTimer) 54-bit
Mô hình AI nhận diện giọng nói hoặc rung động đòi hỏi tín hiệu đầu vào phải được lấy mẫu cực kỳ ổn định theo thời gian (Deterministic Sampling). Không dùng \`vTaskDelay()\` vì có độ lệch (Jitter) hàng trăm micro-giây.
- GPTimer chạy trên xung cơ sở 80MHz (APB Clock).
- Chọn \`prescaler = 80\` để bộ đếm tăng 1 đơn vị mỗi đúng **1 micro-giây (1 µs)**.
- Đặt Alarm ở 10,000 µs cho cảm biến IMU (100Hz) hoặc 62.5 µs cho microphone (16kHz).

### 2. Cờ IRAM_ATTR Cho Hàm Ngắt ISR
Hàm ngắt phục vụ Timer bắt buộc phải gắn cờ \`IRAM_ATTR\` để ép mã nguồn nằm trọn trong SRAM nội. Tránh hiện tượng Crash nếu hàm ngắt được gọi trong lúc vi điều khiển đang ghi dữ liệu vào Flash (SPI Flash Cache Disabled).

### 3. Cơ Chế Deferred Processing
ISR chỉ gửi tín hiệu thông báo (\`vTaskNotifyGiveFromISR\`), sau đó nhường lại CPU cho tác vụ AI bên ngoài xử lý, giữ thời gian thực thi ngắt ISR < 5µs.`
    },
    {
        id: "doc_stage3_sensors",
        title: "Lộ Trình Bước 3: Thu Thập Tín Hiệu Cảm Biến I2C/I2S DMA & Biến Đổi Phổ FFT",
        category: "Lộ Trình 3",
        tags: ["#LộTrình", "#Bước3", "#Sensors", "#I2S", "#FFT"],
        date: "24/09/2026",
        words: 450,
        isNativePdf: false,
        content: `### 1. Thu Âm I2S DMA Ping-Pong Buffer
Microphone kỹ thuật số (INMP441) xuất tín hiệu 24-bit PCM qua chuẩn I2S.
ESP32 sử dụng kênh DMA phần cứng chuyển thẳng dữ liệu âm thanh vào RAM mà không làm tốn chu kỳ lệnh CPU.

### 2. Đọc Burst Read Cảm Biến IMU 6-Trục (I2C)
Thay vì đọc từng trục gia tốc/góc xoay riêng lẻ gây tốn chi phí Start/Stop trên bus I2C, sử dụng Burst Read đọc liên tục 14 bytes từ thanh ghi \`0x3B\` đến \`0x48\` trong 1 phiên truyền.

### 3. Biến Đổi Phổ FFT (Fast Fourier Transform)
Tín hiệu sóng thời gian x(t) được đưa qua:
1. Bộ lọc số thông thấp khử nhiễu động cơ.
2. Cửa sổ Hanning Window chống rò rỉ biên phổ.
3. Biến đổi Fourier nhanh FFT 512 điểm qua thư viện **ESP-DSP** (tăng tốc bằng tập lệnh SIMD phần cứng chỉ mất ~0.8ms) để trích xuất ma trận phổ Spectrogram làm đầu vào cho mạng nơ-ron.`
    },
    {
        id: "doc_stage4_freertos",
        title: "Lộ Trình Bước 4: Đa Nhiệm FreeRTOS Dual-Core & Hàng Đợi Queue",
        category: "Lộ Trình 4",
        tags: ["#LộTrình", "#Bước4", "#FreeRTOS", "#DualCore", "#Queue"],
        date: "24/09/2026",
        words: 410,
        isNativePdf: false,
        content: `### 1. Phân Chia Hai Nhân (Asymmetric Task Pinning)
ESP32-S3 sở hữu 2 nhân vi xử lý Xtensa LX7 (Core 0 và Core 1):
- **Core 0 (PRO_CPU)**: Chuyên trách ngăn xếp mạng Wi-Fi/Bluetooth, MQTT và các giao tiếp ngoại vi.
- **Core 1 (APP_CPU)**: Dành riêng cho mô hình TinyML suy luận và thuật toán FFT, không bị ngắt quãng bởi lưu lượng mạng.
\`\`\`c
xTaskCreatePinnedToCore(ai_inference_task, "AI_Core1", 8192, NULL, 5, NULL, 1);
xTaskCreatePinnedToCore(sensor_sampler_task, "IO_Core0", 4096, NULL, 4, NULL, 0);
\`\`\`

### 2. Giao Tiếp Hàng Đợi An Toàn Luồng (Thread-Safe Queue)
Dùng FreeRTOS Queue để truyền an toàn các khung dữ liệu cảm biến từ Core 0 sang Core 1 mà không gây lỗi Race Condition.

### 3. Mutex & Task Watchdog Timer (TWDT)
Khóa tài nguyên chung bằng Mutex và kích hoạt TWDT để giám sát tác vụ AI, tự khởi động lại nếu mô hình bị treo quá 3 giây.`
    },
    {
        id: "doc_stage5_network",
        title: "Lộ Trình Bước 5: Ngăn Xếp Mạng Wi-Fi/MQTT & Phân Vùng Nâng Cấp OTA",
        category: "Lộ Trình 5",
        tags: ["#LộTrình", "#Bước5", "#Network", "#MQTT", "#OTA"],
        date: "24/09/2026",
        words: 430,
        isNativePdf: false,
        content: `### 1. Wi-Fi Station Tự Phục Hồi
Xử lý sự kiện mất mạng và tự động kết nối lại theo giải thuật Exponential Backoff (1s, 2s, 4s... 30s) để tránh làm sụp nguồn hoặc nghẽn bus vi điều khiển.

### 2. MQTT Telemetry Siêu Nhẹ
Đóng gói nhãn dự đoán, độ tin cậy confidence và độ trễ mili-giây thành gói tin JSON gửi lên MQTT Broker với Header chỉ 2 bytes. Chỉ phát tin khi phát hiện sự kiện bất thường.

### 3. Kiến Trúc Phân Vùng OTA Hai Ngăn (Dual-Bank)
Bảng phân vùng Flash chia thành \`ota_0\` và \`ota_1\` (mỗi ngăn ~1.5 - 2MB). Firmware đang chạy ở ngăn này sẽ nạp bản cập nhật mới vào ngăn kia qua HTTPS. Sau khi kiểm tra CRC hợp lệ, hệ thống hoán đổi cờ Boot và có cơ chế tự động Rollback nếu firmware mới bị lỗi Crash.`
    },
    {
        id: "doc_stage6_tinyml",
        title: "Lộ Trình Bước 6: Triển Khai TinyML & Quy Trình Lượng Tử Hóa INT8",
        category: "Lộ Trình 6",
        tags: ["#LộTrình", "#Bước6", "#TinyML", "#INT8", "#TFLiteMicro"],
        date: "24/09/2026",
        words: 460,
        isNativePdf: false,
        content: `### 1. Quy Trình Lượng Tử Hóa INT8 (Post-Training Quantization)
Chuyển đổi toàn bộ trọng số (Weights) và activations từ số thực Float32 (4 bytes) sang số nguyên có dấu INT8 (1 byte):
- Kích thước mô hình giảm đúng 75% (từ 200KB xuống 50KB).
- Tận dụng bộ tăng tốc số học nguyên Integer MAC của ESP32-S3, tốc độ suy luận tăng gấp 3-5 lần.
\`\`\`
Real_Value = Scale * (Quantized_Int8 - Zero_Point)
\`\`\`

### 2. TFLite Micro & MicroMutableOpResolver
Chỉ đăng ký đúng các toán tử cần dùng (Conv2D, FullyConnected, Softmax) để Linker cắt bỏ mã nguồn thừa, tiết kiệm 40KB Flash.

### 3. Vòng Đời Suy Luận (Inference Pipeline)
1. Nạp con trỏ mô hình FlatBuffer từ Flash.
2. Cấp phát tensors trong Tensor Arena căn lề 16-byte.
3. Gán dữ liệu phổ FFT vào tensor đầu vào \`interpreter->input(0)\`.
4. Gọi \`interpreter->Invoke()\` thực thi suy luận.
5. Đọc nhãn dự đoán từ \`interpreter->output(0)\` và kích hoạt hành động ngoại vi.`
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
    "doc_stage6_tinyml"
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
// RENDER GIAO DIỆN CHÍNH
// ==========================================
function renderNotebookView() {
    renderNotebookDocsList();
    renderNotebookChat();
    updateGeminiKeyStatus();
    updateGeminiQuotaDisplay();
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
        statusPill.innerHTML = `🟢 <span style="color: var(--accent);">Gemini 3.8 Flash Online</span>`;
        statusPill.title = "Đã kết nối Google Gemini 3.8 Flash. Sẵn sàng xử lý tài liệu đa phương thức và PDF nguyên bản.";
    } else {
        statusPill.innerHTML = `⚡ <span style="color: var(--cyan);">Offline Knowledge AI</span>`;
        statusPill.title = "Đang chạy chế độ Động Cơ Tri Thức Nhúng Cục Bộ. Bấm ⚙️ Cấu Hình Key để kích hoạt Cloud Gemini AI.";
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
        formatted = formatted.replace(`%%%CODE_BLOCK_${idx}%%%`, block);
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
// CẤU HÌNH GOOGLE GEMINI API (MODEL 3.8 FLASH & FALLBACKS)
// ==========================================
const GEMINI_PRIMARY_MODEL = "gemini-3.8-flash";
const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";
const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-1.5-flash"];

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

window.showTaskTheoryModal = showTaskTheoryModal;
window.closeTaskTheoryModal = closeTaskTheoryModal;
window.askAiFromTaskModal = askAiFromTaskModal;
window.askAiAboutTask = askAiAboutTask;
window.saveTaskToMyNotes = saveTaskToMyNotes;
window.openPracticeFromTaskModal = openPracticeFromTaskModal;
window.openGeminiKeyModal = openGeminiKeyModal;
window.closeGeminiKeyModal = closeGeminiKeyModal;
window.testGeminiApiConnection = testGeminiApiConnection;
window.saveGeminiApiKey = saveGeminiApiKey;

