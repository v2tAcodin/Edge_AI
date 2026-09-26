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
        title: "Lộ Trình Bước 2: GPTimer Định Thời Micro-giây, Ngắt IRAM_ATTR & Cơ Chế Deferred Processing",
        category: "Lộ Trình 2",
        tags: ["#LộTrình", "#Bước2", "#GPTimer", "#ISR", "#IRAM_ATTR", "#DeferredProcessing"],
        date: "26/09/2026",
        words: 1450,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO vTaskDelay() LÀ KẺ THÙ CỦA EDGE AI?
Khi xây dựng mô hình AI nhận diện giọng nói (Audio KWS 16kHz) hoặc chẩn đoán rung động động cơ (IMU 100Hz), toàn bộ thuật toán Toán học (như Biến đổi Fourier FFT, Mel Spectrogram) đều dựa trên một giả thiết nền tảng:
👉 **Các mẫu tín hiệu phải được đo ở những khoảng thời gian ĐỀU ĐẶN TUYỆT ĐỐI (Deterministic Sampling).**

Nếu bạn dùng hàm ngủ của hệ điều hành \`vTaskDelay(pdMS_TO_TICKS(10))\`:
- FreeRTOS chỉ có độ phân giải theo nhịp Tick (mặc định 100Hz = 10ms, hoặc 1000Hz = 1ms).
- Khi có các tác vụ khác đang chiếm CPU (như Wi-Fi Stack, Bluetooth, xử lý mạng), hàm delay sẽ bị trễ (Jitter) thêm hàng trăm micro-giây đến vài mili-giây.
- Hậu quả: Dữ liệu bị méo mó về mặt thời gian, phổ tần số FFT bị biến dạng hoàn toàn, làm mô hình AI suy luận sai lệch dù trọng số model rất tốt!

✅ **Giải pháp bắt buộc**: Sử dụng **Bộ định thời phần cứng chuyên dụng (Hardware Timer - GPTimer)** độc lập hoàn toàn với CPU và hệ điều hành!

---

### 📌 2. KIẾN TRÚC PHẦN CỨNG GPTIMER 54-BIT TRÊN ESP32-S3
ESP32-S3 sở hữu các bộ đếm GPTimer 54-bit cực kỳ mạnh mẽ:
- Chạy trên nguồn xung nhịp nội APB Bus tốc độ **80 MHz** (80,000,000 chu kỳ / giây).
- **Bộ chia tần số (Prescaler)**: Khi chọn \`resolution_hz = 1,000,000\` (1 MHz), phần cứng tự động chia xung: \`80MHz / 80 = 1MHz\`.
- Nghĩa là: **Cứ đúng 1 micro-giây (1 µs), thanh ghi đếm phần cứng tự động tăng lên 1 đơn vị!**
- **Cơ chế Alarm Auto-reload**: Khi bộ đếm chạm ngưỡng cài đặt (ví dụ 62.5 µs cho âm thanh 16kHz, hoặc 10,000 µs cho IMU 100Hz), phần cứng tự động kích hoạt ngắt và nạp lại giá trị 0 ngay lập tức, độ sai lệch thời gian thực tế bằng 0 nano-giây.

---

### 📌 3. BÍ MẬT CỜ IRAM_ATTR & TẠI SAO ISR PHẢI THỰC THI TRÊN SRAM?
Khi ngắt xảy ra, CPU lập tức dừng công việc đang làm để nhảy vào hàm phục vụ ngắt (**Interrupt Service Routine - ISR**).
⚠️ **Cạm bẫy chí mạng**: Mặc định, mã nguồn C được biên dịch và lưu trên chip nhớ Flash ngoài (SPI Flash). CPU đọc mã lệnh thông qua bộ nhớ đệm Cache.
- Nếu hàm ISR nằm trên Flash:
  1. Khi ngắt nổ ra, CPU phải nạp mã từ Flash vào Cache -> Gây trễ (Cache Miss Latency) mất hàng chục micro-giây.
  2. Nghiêm trọng nhất: Khi hệ thống đang ghi dữ liệu vào Flash (như lưu cấu hình NVS hoặc nâng cấp OTA), **SPI Flash Cache bị phần cứng tạm khóa (Cache Disabled)**. Nếu lúc này ngắt Timer nổ ra và CPU cố nhảy vào hàm ISR trên Flash, hệ thống sẽ phát sinh lỗi phần cứng **Guru Meditation Error (IllegalInstruction / Cache disabled crash)** làm reset vi điều khiển ngay lập tức!
- ✅ **Cách khắc phục**: Luôn khai báo tiền tố \`IRAM_ATTR\` trước hàm ngắt:
  \`\`\`c
  static bool IRAM_ATTR timer_isr_callback(gptimer_handle_t timer, ...)
  \`\`\`
  Từ khóa này chỉ định Linker đặt trọn vẹn mã máy của hàm ngắt vào **Internal SRAM0**, đảm bảo phản hồi tức thì trong vài nano-giây và an toàn 100% trong mọi tình huống.

---

### 📌 4. MÔ HÌNH DEFERRED PROCESSING: NGUYÊN TẮC VÀNG VỀ THỜI GIAN ISR
Một quy tắc bất di bất dịch của kỹ sư nhúng chuyên nghiệp:
> **"Hàm ngắt ISR phải chạy nhanh như tia chớp (thường < 5 micro-giây), tuyệt đối không làm việc nặng!"**

Trong hàm ISR:
- ❌ **CẤM TUYỆT ĐỐI**: Không gọi \`printf()\`, không tính toán FFT, không nạp mạng nơ-ron, không gọi hàm \`malloc()\`, không dùng bất kỳ hàm nào có cơ chế chờ (Blocking / Delay).
- ✅ **Cơ chế Deferred Processing (Hoãn xử lý)**:
  1. Trong ISR: Chỉ đọc giá trị thô từ thanh ghi phần cứng và gửi một tín hiệu đánh thức nhẹ nhất có thể: **Direct-to-Task Notification** (\`vTaskNotifyGiveFromISR\`).
  2. Ngoài Task: Tác vụ xử lý AI nằm ở trạng thái Blocked (tiết kiệm CPU). Ngay khi nhận thông báo từ ISR, FreeRTOS lập tức đánh thức Task này dậy để gom đủ khung dữ liệu và thực hiện suy luận.

---

### 📌 5. 4 CẠM BẪY CHÍ MẠNG KHI LẬP TRÌNH NGẮT (VÀ CÁCH PHÒNG TRÁNH)
1. **Quên cờ FreeRTOS yield trong ISR**: Phải truyền biến \`BaseType_t high_task_awoken\` vào hàm thông báo ngắt và trả về kết quả để hệ điều hành chuyển ngữ cảnh (Context Switch) sang Task ưu tiên cao ngay tức thì.
2. **Biến cờ thiếu từ khóa \`volatile\`**: Nếu biến chia sẻ giữa ISR và Task chính không có \`volatile\`, trình biên dịch tối ưu hóa sẽ lưu biến vào thanh ghi CPU của Task, khiến Task không bao giờ nhận thấy giá trị biến đã bị ISR thay đổi!
3. **Gọi API FreeRTOS không có hậu tố FromISR**: Dùng nhầm \`xQueueSend\` thay vì \`xQueueSendFromISR\` sẽ gây lỗi sụp nguồn hạt nhân OS.
4. **Tràn bộ đệm Ring Buffer**: Tốc độ lấy mẫu quá cao trong khi thuật toán AI chạy quá lâu, khiến bộ đệm đầy trước khi kịp xử lý.

---

### 📌 6. CODE THỰC CHIẾN ESP-IDF: ĐỊNH THỜI 16KHZ & DEFERRED TASK
\`\`\`c
#include <stdio.h>
#include "esp_log.h"
#include "driver/gptimer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static TaskHandle_t s_ai_task_handle = NULL;
static volatile uint32_t s_sample_counter = 0;

// 1. Hàm phục vụ ngắt cực ngắn đặt trong SRAM nội
static bool IRAM_ATTR gptimer_16khz_isr(gptimer_handle_t timer, 
                                        const gptimer_alarm_event_data_t *edata, 
                                        void *user_ctx) {
    BaseType_t high_task_awoken = pdFALSE;
    s_sample_counter++;

    // Cứ gom đủ 256 mẫu tín hiệu (~16ms) thì đánh thức tác vụ AI xử lý
    if (s_sample_counter >= 256) {
        s_sample_counter = 0;
        vTaskNotifyGiveFromISR(s_ai_task_handle, &high_task_awoken);
    }

    // Yêu cầu chuyển ngữ cảnh ngay nếu tác vụ AI có độ ưu tiên cao hơn
    return (high_task_awoken == pdTRUE);
}

// 2. Tác vụ AI xử lý ngoài luồng ngắt (Deferred Task)
void ai_processing_task(void *pvParameters) {
    while (1) {
        // Đi ngủ chờ tín hiệu từ ISR (Không tốn 1% CPU nào khi chờ)
        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);

        // Đã gom đủ 256 mẫu -> Thực hiện tính toán FFT và suy luận AI an toàn tại đây
        // run_feature_extraction_and_inference();
    }
}

// 3. Cấu hình GPTimer phần cứng 1 micro-giây
void app_main(void) {
    xTaskCreate(ai_processing_task, "ai_task", 4096, NULL, 5, &s_ai_task_handle);

    gptimer_handle_t gptimer = NULL;
    gptimer_config_t timer_config = {
        .clk_src = GPTIMER_CLK_SRC_DEFAULT,
        .direction = GPTIMER_COUNT_UP,
        .resolution_hz = 1000000, // 1 MHz = 1 tick mỗi 1 us
    };
    gptimer_new_timer(&timer_config, &gptimer);

    // Chu kỳ 62.5 us tương ứng tần số lấy mẫu 16,000 Hz (Audio KWS)
    gptimer_alarm_config_t alarm_config = {
        .reload_count = 0,
        .alarm_count = 62, // 62 us xấp xỉ 16kHz
        .flags.auto_reload_on_alarm = true,
    };
    gptimer_event_callbacks_t cbs = {
        .on_alarm = gptimer_16khz_isr,
    };
    gptimer_register_event_callbacks(gptimer, &cbs, NULL);
    gptimer_set_alarm_action(gptimer, &alarm_config);
    gptimer_enable(gptimer);
    gptimer_start(gptimer);
}
\`\`\``
    },
    {
        id: "doc_stage3_sensors",
        title: "Lộ Trình Bước 3: Thu Thập Cảm Biến I2C/I2S DMA & Biến Đổi Phổ Tần Số FFT",
        category: "Lộ Trình 3",
        tags: ["#LộTrình", "#Bước3", "#I2S", "#DMA", "#FFT", "#Sensors", "#ESP_DSP"],
        date: "26/09/2026",
        words: 1520,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: MÔ HÌNH AI CẦN PHỔ TẦN SỐ, KHÔNG PHẢI SỐ THÔ!
Trong thế giới thực tế của kỹ sư Edge AI:
- Một micro thu âm cho ra sóng áp suất không khí biên độ thay đổi liên tục theo thời gian $x(t)$.
- Một cảm biến gia tốc kế (IMU) gắn trên vỏ động cơ công nghiệp cho ra 3 trục dao động $X, Y, Z$.

Nếu bạn đẩy trực tiếp 512 số thô này vào mạng nơ-ron:
- Mô hình sẽ cực kỳ khó học vì tín hiệu trong miền thời gian bị phụ thuộc vào pha dao động, âm lượng to nhỏ và nhiễu ngẫu nhiên.
- ✅ **Bí quyết công nghiệp**: Chuyển đổi tín hiệu từ **Miền Thời Gian (Time Domain)** sang **Miền Tần Số (Frequency Domain)** thông qua thuật toán **Biến Đổi Fourier Nhanh (Fast Fourier Transform - FFT)**.
- Phổ tần số (Spectrogram) cho biết: *"Tại thời điểm này, động cơ đang rung mạnh ở tần số nào (50Hz lưới điện, 120Hz lỗi vòng bi, hay 1000Hz rơ bạc đạn)?"*. Đây chính là bức vân tay âm thanh giúp mạng nơ-ron phân loại chính xác trên 98%!

---

### 📌 2. KỸ THUẬT BURST READ TRÊN BUS I2C CHO CẢM BIẾN IMU 6 TRỤC
Cảm biến chuyển động MPU6050 / LSM6DS3 xuất dữ liệu 6 trục: 3 trục Gia tốc ($A_x, A_y, A_z$) và 3 trục Con quay góc xoay ($G_x, G_y, G_z$). Mỗi trục là 1 số nguyên 16-bit gồm 2 bytes: High và Low (tổng cộng 12 bytes + 2 bytes nhiệt độ = 14 bytes liên tục).
- ❌ **Cách làm nghiệp dư**: Gọi hàm đọc 6 lần riêng biệt cho 6 trục. Trên bus I2C (tối đa 400kHz), mỗi lần đọc riêng lẻ tốn bit Start, địa chỉ thiết bị, địa chỉ thanh ghi, ACK, Stop -> Tốn thời gian gấp 6 lần, làm nghẽn bus!
- ✅ **Cách làm chuyên nghiệp (Burst Read)**: Phát đúng 1 lệnh đọc bắt đầu từ thanh ghi \`ACCEL_XOUT_H\` (0x3B) và yêu cầu nhận một mạch **14 bytes liên tục**. Cảm biến phần cứng tự động tăng con trỏ thanh ghi nội bộ. Sau đó dùng phép dịch bit gộp thành số có dấu 16-bit:
  \`\`\`c
  int16_t accel_x = (int16_t)((buf[0] << 8) | buf[1]);
  \`\`\`

---

### 📌 3. THU ÂM THANH BĂNG THÔNG CAO VỚI I2S DMA & BỘ ĐỆM PING-PONG
Khi thu âm thanh 16kHz 16-bit mono:
- Mỗi giây CPU phải xử lý: \`16000 x 2 bytes = 32,000 bytes\`.
- Nếu dùng ngắt đọc từng byte một, CPU sẽ bị ngắt 16,000 lần mỗi giây -> 100% thời gian CPU chỉ để xử lý ngắt, không còn sức chạy mô hình AI!
- ✅ **Giải pháp Direct Memory Access (DMA)**:
  ESP32-S3 tích hợp bộ điều khiển phần cứng DMA cho ngoại vi I2S. DMA tự động hút từng byte âm thanh từ chân phần cứng đổ thẳng vào RAM mà **hoàn toàn không cần CPU can thiệp**!
- **Cấu trúc Đệm đôi (Ping-Pong Buffer)**:
  Phần cứng DMA chia bộ nhớ thành 2 vùng đệm $A$ và $B$.
  - Trong lúc DMA đang ghi âm thanh vào Buffer $A$, CPU thảnh thơi lấy dữ liệu từ Buffer $B$ để tính toán FFT và suy luận AI.
  - Khi Buffer $A$ đầy, DMA tự động chuyển sang Buffer $B$ và phát tín hiệu cho CPU sang đọc Buffer $A$. Dữ liệu âm thanh không bao giờ bị gián đoạn hay mất mẫu!

---

### 📌 4. BỘ LỌC TÍN HIỆU SỐ (DSP) & CỬA SỔ HANNING (HANNING WINDOW)
Trước khi đưa vào FFT, dữ liệu thô bắt buộc phải trải qua 2 bước tiền xử lý:
1. **Bộ lọc thông thấp số (Exponential Moving Average - EMA)**:
   Loại bỏ các gai nhiễu điện áp tần số cao:
   $$y[n] = \alpha \cdot x[n] + (1 - \alpha) \cdot y[n-1]$$
   Với $\alpha \in [0.1, 0.3]$.
2. **Cửa sổ Hanning Window (Chống rò rỉ phổ - Spectral Leakage)**:
   Khi cắt một đoạn tín hiệu 512 mẫu từ dòng âm thanh vô tận, hai mép đầu và đuôi đoạn tín hiệu bị ngắt đột ngột tạo thành bước nhảy điện áp giả tạo. Bước nhảy này sinh ra các tần số rác trong FFT gọi là rò rỉ phổ.
   Nhân đoạn tín hiệu với hàm Hanning Window giúp ép hai đầu đoạn tín hiệu mượt mà về 0, bảo toàn độ sắc nét của các đỉnh tần số thực tế.

---

### 📌 5. BIẾN ĐỔI FOURIER NHANH FFT BẰNG THƯ VIỆN ESP-DSP TĂNG TỐC SIMD
Thư viện **ESP-DSP** của Espressif được viết riêng bằng mã Assembly tận dụng tập lệnh mở rộng Vector SIMD trên nhân Xtensa LX7 của ESP32-S3:
- Phép tính FFT 512 điểm số thực phức nếu viết bằng C thông thường tốn khoảng 8 - 12 mili-giây.
- Khi gọi thư viện \`dsps_fft2r_fc32\` tối ưu SIMD: **Chỉ tốn đúng 0.72 mili-giây** (nhanh hơn gấp 10 lần!), giúp tiết kiệm năng lượng và giải phóng CPU cho mô hình AI.

---

### 📌 6. CODE MẪU THỰC CHIẾN: I2S DMA & BIẾN ĐỔI PHỔ FFT
\`\`\`c
#include <stdio.h>
#include <math.h>
#include "driver/i2s_std.h"
#include "esp_dsp.h"
#include "esp_log.h"

#define FFT_POINTS 512
static float s_input_signal[FFT_POINTS * 2]; // Mảng số phức (Phần thực & Ảo xen kẽ)
static float s_window[FFT_POINTS];
static float s_output_power[FFT_POINTS / 2];

void init_dsp_pipeline(void) {
    // 1. Khởi tạo bảng tra cứu FFT và cửa sổ Hanning
    esp_err_t ret = dsps_fft2r_init_fc32(NULL, CONFIG_DSP_MAX_FFT_SIZE);
    if (ret != ESP_OK) {
        ESP_LOGE("DSP", "Không thể khởi tạo bảng FFT!");
        return;
    }
    dsps_wind_hann_f32(s_window, FFT_POINTS);
}

void process_audio_fft(const int16_t *raw_pcm_audio) {
    // 2. Chuẩn hóa int16 [-32768, 32767] sang float [-1.0, 1.0] và nhân cửa sổ Hanning
    for (int i = 0; i < FFT_POINTS; i++) {
        float normalized = (float)raw_pcm_audio[i] / 32768.0f;
        s_input_signal[i * 2 + 0] = normalized * s_window[i]; // Phần thực
        s_input_signal[i * 2 + 1] = 0.0f;                     // Phần ảo = 0
    }

    // 3. Thực thi biến đổi FFT Radix-2 tăng tốc SIMD phần cứng (~0.8ms)
    dsps_fft2r_fc32(s_input_signal, FFT_POINTS);
    dsps_bit_rev2r_fc32(s_input_signal, FFT_POINTS);

    // 4. Tính mật độ phổ năng lượng (Power Spectrum) cho các dải tần số
    for (int i = 0; i < FFT_POINTS / 2; i++) {
        float real = s_input_signal[i * 2 + 0];
        float imag = s_input_signal[i * 2 + 1];
        s_output_power[i] = sqrtf(real * real + imag * imag);
    }

    // Mảng s_output_power gồm 256 dải năng lượng giờ đây sẵn sàng nạp vào Tensor AI!
}
\`\`\``
    },
    {
        id: "doc_stage4_freertos",
        title: "Lộ Trình Bước 4: Đa Nhiệm FreeRTOS Dual-Core, Hàng Đợi Queue & Chống Deadlock",
        category: "Lộ Trình 4",
        tags: ["#LộTrình", "#Bước4", "#FreeRTOS", "#DualCore", "#Queue", "#Mutex", "#Watchdog"],
        date: "26/09/2026",
        words: 1480,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: PHÂN TÁCH 2 NHÂN (ASYMMETRIC DUAL-CORE ARCHITECTURE)
ESP32-S3 sở hữu 2 lõi vi xử lý vật lý Xtensa LX7 hoạt động song song độc lập ở tần số 240 MHz:
- **Core 0 (PRO_CPU - Protocol CPU)**: Mặc định được hệ điều hành ESP-IDF sử dụng để quản lý ngăn xếp vô tuyến Wi-Fi 802.11 b/g/n, Bluetooth LE 5.0, Flash Cache Controller và các ngắt ngoại vi phần cứng.
- **Core 1 (APP_CPU - Application CPU)**: Hoàn toàn tự do cho logic ứng dụng của kỹ sư.

⚠️ **Sai lầm tai hại của người mới**: Để FreeRTOS tự do điều phối tác vụ mà không chỉ định lõi (\`xTaskCreate\`).
Khi mô hình AI suy luận trên Core 0, phép nhân ma trận ngốn 100% CPU sẽ làm trễ việc phản hồi các gói tin bắt tay Wi-Fi (Wi-Fi Beacon Timeout) -> Thiết bị bị rớt mạng liên tục!
✅ **Quy tắc vàng phân chia 2 nhân**:
- Ghim toàn bộ tác vụ mạng, MQTT, web server và thu thập cảm biến sang **Core 0**.
- Dành trọn vẹn 100% sức mạnh tính toán của **Core 1** cho mô hình TinyML suy luận và biến đổi FFT bằng hàm:
  \`\`\`c
  xTaskCreatePinnedToCore(ai_inference_task, "AI_Core1", 8192, NULL, 5, NULL, 1);
  \`\`\`

---

### 📌 2. HÀNG ĐỢI FREERTOS QUEUE: CƠ CHẾ TRUYỀN DỮ LIỆU AN TOÀN LUỒNG (THREAD-SAFE)
Khi Core 0 thu thập cảm biến và Core 1 suy luận, làm sao truyền một khung dữ liệu 512 bytes giữa hai nhân?
- ❌ **Cấm dùng biến toàn cục chung (Global Buffer)**: Cả 2 nhân cùng truy xuất vào một vùng nhớ RAM mà không có cơ chế khóa sẽ gây hiện tượng **Tranh chấp dữ liệu (Race Condition)**: Core 1 đọc dữ liệu đúng lúc Core 0 mới ghi được một nửa, dẫn đến dữ liệu rác làm mô hình AI suy luận sai bét!
- ✅ **Sử dụng FreeRTOS Queue**:
  - Hoạt động theo nguyên lý Hàng đợi FIFO (First In, First Out).
  - Được tích hợp sẵn khóa nguyên tử (Atomic Lock) cấp độ phần cứng bên trong FreeRTOS Kernel, bảo đảm an toàn luồng tuyệt đối.
  - **Tiết kiệm năng lượng**: Khi hàng đợi rỗng, Task AI trên Core 1 sẽ tự động đi vào trạng thái **Blocked** (ngủ đông không tốn xung nhịp CPU). Ngay khi Core 0 đẩy một khung dữ liệu vào Queue, FreeRTOS lập tức đánh thức Task AI dậy xử lý.

---

### 📌 3. KHÓA TÀI NGUYÊN MUTEX & HIỆN TƯỢNG NGHỊCH ĐẢO QUYỀN ƯU TIÊN (PRIORITY INVERSION)
Khi có 2 tác vụ cùng chia sẻ một bus ngoại vi phần cứng (ví dụ: Task A đọc cảm biến nhiệt độ I2C và Task B đọc cảm biến IMU I2C trên cùng chân SDA/SCL):
- Phải sử dụng **Mutex (Mutual Exclusion)** để khóa bus trước khi gửi lệnh.
- **Hiện tượng nghịch đảo quyền ưu tiên (Priority Inversion)**:
  Tác vụ ưu tiên thấp (Low Priority) đang giữ Mutex. Tác vụ ưu tiên cao nhất (High Priority - Mô hình AI) muốn lấy Mutex phải đứng chờ. Đột nhiên một tác vụ ưu tiên trung bình (Medium Priority) nhảy vào chiếm CPU vì nó có độ ưu tiên cao hơn tác vụ Low!
  Hậu quả: Tác vụ AI khẩn cấp bị phong tỏa vô thời hạn do tác vụ trung bình gây ra!
- ✅ **Giải pháp**: Luôn dùng **Mutex chuẩn của FreeRTOS** (\`xSemaphoreCreateMutex\`). Mutex của FreeRTOS tích hợp cơ chế **Kế thừa quyền ưu tiên (Priority Inheritance)**: Tự động nâng tạm thời quyền ưu tiên của tác vụ đang giữ khóa lên bằng với tác vụ khẩn cấp nhất đang chờ, giải phóng khóa nhanh nhất có thể.

---

### 📌 4. BẢO VỆ HỆ THỐNG VỚI TASK WATCHDOG TIMER (TWDT)
Trong quá trình vận hành liên tục 24/7 ngoài công nghiệp, nếu vòng lặp tính toán mô hình AI bị rơi vào vòng lặp vô hạn hoặc bị treo do phân mảnh bộ nhớ:
- Hệ thống sẽ bị đơ cứng, không gửi được cảnh báo cháy nổ hay sự cố máy móc.
- **Task Watchdog Timer (TWDT)**: Một "đồng hồ đếm ngược" phần cứng độc lập.
- Mỗi tác vụ đăng ký với TWDT phải định kỳ "cho chó ăn" bằng hàm \`esp_task_wdt_reset()\`.
- Nếu sau một khoảng thời gian quy định (ví dụ 3 giây) mà tác vụ không gọi reset (do bị treo), TWDT sẽ kích hoạt ngắt khẩn cấp, in ra toàn bộ thanh ghi Program Counter (PC) và tự động khởi động lại vi điều khiển trong vòng 10 mili-giây.

---

### 📌 5. CẠM BẪY STACK OVERFLOW VÀ CÁCH TÍNH KÍCH THƯỚC STACK
⚠️ **Cạm bẫy lớn nhất của lập trình viên PC chuyển sang nhúng**:
- Trên PC, Stack mặc định là 8 Megabytes. Trên vi điều khiển, mỗi Task chỉ được cấp phát từ **2KB đến 8KB** Stack!
- Nếu trong hàm bạn khai báo: \`float spectrogram[128][128];\` -> Kích thước lên tới 65,536 bytes (64KB)! Mảng này sẽ lập tức tràn qua biên giới Stack, ghi đè phá hủy các biến lân cận và làm crash Guru Meditation!
- ✅ **Khắc phục**:
  1. Mọi mảng lớn phục vụ AI bắt buộc phải khai báo tĩnh (\`static\`) hoặc cấp phát trên Heap.
  2. Định kỳ kiểm tra lượng Stack còn lại bằng hàm \`uxTaskGetStackHighWaterMark()\`. Con số trả về là số byte Stack trống tối thiểu từng chạm tới. Nếu con số này tiến gần về 0, bạn phải tăng kích thước Stack khi tạo task ngay lập tức.

---

### 📌 6. CODE MẪU THỰC CHIẾN: DUAL-CORE QUEUE PIPELINE
\`\`\`c
#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_log.h"
#include "esp_task_wdt.h"

typedef struct {
    uint32_t timestamp;
    float features[32]; // 32 bins năng lượng phổ FFT
} SensorPayload_t;

static QueueHandle_t s_sensor_queue = NULL;

// 1. Tác vụ thu thập cảm biến chạy trên Core 0
void sensor_sampler_task(void *pvParameters) {
    SensorPayload_t payload;
    uint32_t count = 0;

    while (1) {
        payload.timestamp = xTaskGetTickCount() * portTICK_PERIOD_MS;
        for (int i = 0; i < 32; i++) {
            payload.features[i] = (float)(i * 2 + (count % 10));
        }

        // Đẩy vào Queue, nếu Queue đầy thì chờ tối đa 10ms rồi bỏ qua để không nghẽn
        if (xQueueSend(s_sensor_queue, &payload, pdMS_TO_TICKS(10)) != pdTRUE) {
            ESP_LOGW("CORE0", "Queue bị đầy! Đang bỏ qua mẫu để chống giật lag.");
        }

        count++;
        vTaskDelay(pdMS_TO_TICKS(20)); // Thu thập chu kỳ 50Hz (20ms)
    }
}

// 2. Tác vụ suy luận AI chuyên dụng chạy trên Core 1
void ai_inference_task(void *pvParameters) {
    SensorPayload_t incoming_data;

    // Đăng ký giám sát Task Watchdog với ngưỡng 3000ms
    esp_task_wdt_add(NULL);

    while (1) {
        // Chờ dữ liệu từ Core 0 qua Queue (Ngủ đông nếu chưa có dữ liệu)
        if (xQueueReceive(s_sensor_queue, &incoming_data, portMAX_DELAY) == pdTRUE) {
            // Chạy mô hình TinyML suy luận tại đây...
            // model_interpreter.Invoke();

            // Báo cáo Watchdog rằng tác vụ vẫn đang hoạt động khỏe mạnh
            esp_task_wdt_reset();
        }
    }
}

void app_main(void) {
    // Khởi tạo hàng đợi chứa tối đa 10 khung dữ liệu
    s_sensor_queue = xQueueCreate(10, sizeof(SensorPayload_t));

    // Ghim tác vụ thu thập cảm biến vào CORE 0
    xTaskCreatePinnedToCore(sensor_sampler_task, "Sampler_C0", 4096, NULL, 3, NULL, 0);

    // Ghim tác vụ suy luận AI vào CORE 1 (Độ ưu tiên cao hơn)
    xTaskCreatePinnedToCore(ai_inference_task, "AI_C1", 8192, NULL, 5, NULL, 1);
}
\`\`\``
    },
    {
        id: "doc_stage5_network",
        title: "Lộ Trình Bước 5: Ngăn Xếp Mạng Wi-Fi/MQTT & Phân Vùng Nâng Cấp Firmware OTA Hai Ngăn",
        category: "Lộ Trình 5",
        tags: ["#LộTrình", "#Bước5", "#WiFi", "#MQTT", "#OTA", "#DualBank", "#Rollback"],
        date: "26/09/2026",
        words: 1510,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: IOT EDGE AI TELEMETRY (TẠI SAO PHẢI EVENT-DRIVEN?)
Trong hệ thống IoT thông thường:
- Thiết bị gửi stream dữ liệu thô (Raw Data) liên tục 24/7 lên máy chủ Cloud -> Tốn dung lượng 4G/Wi-Fi, hóa đơn máy chủ khổng lồ và làm cạn kiệt pin trong vài giờ.
- ✅ **Triết lý Edge AI Telemetry**:
  Vi điều khiển tại biên chạy mô hình AI 24/7 để phân tích dữ liệu cục bộ.
  - Khi thiết bị hoạt động bình thường: Hệ thống im lặng hoàn toàn, hoặc chỉ gửi một gói tin nhịp tim (Heartbeat 60 giây một lần).
  - Khi phát hiện sự cố bất thường (động cơ rung lắc lạ, nhận diện được từ khóa khẩn cấp): Lập tức đóng gói **Nhãn sự cố, Độ tin cậy (Confidence %) và Dấu thời gian** thành một bản tin JSON siêu nhẹ gửi lên Cloud qua giao thức MQTT! Tiết kiệm hơn 95% băng thông và năng lượng pin!

---

### 📌 2. WI-FI STATION TỰ PHỤC HỒI VỚI CHIẾN LƯỢC EXPONENTIAL BACKOFF
Trong nhà xưởng công nghiệp hoặc thực địa, sóng Wi-Fi có thể bị chập chờn, mất mạng hoặc Router khởi động lại.
- ❌ **Sai lầm**: Liên tục gọi \`esp_wifi_connect()\` trong vòng lặp kín khi mất mạng. Việc này làm nóng chip vi điều khiển, sụt áp nguồn và gây nghẽn bus mạng nội bộ.
- ✅ **Chiến lược Exponential Backoff (Lùi theo cấp số nhân)**:
  - Khi mất kết nối lần 1: Thử lại sau 1 giây.
  - Lần 2: Thử lại sau 2 giây.
  - Lần 3: Thử lại sau 4 giây... Tăng dần tối đa đến 30 giây hoặc 60 giây.
  Cơ chế này bảo vệ vi điều khiển không bị cạn pin và tự động kết nối lại ngay khi trạm phát sóng Wi-Fi phục hồi.

---

### 📌 3. GIAO THỨC MQTT SIÊU NHẸ (HEADER 2 BYTES DÀNH CHO IOT)
So sánh giữa HTTP và MQTT:
- **HTTP (REST API)**: Mỗi gói tin gửi lên đều phải kèm HTTP Headers (User-Agent, Content-Type, Host...) tốn từ 200 đến 800 bytes dữ liệu overhead.
- **MQTT (Message Queuing Telemetry Transport)**:
  - Giao thức Publish/Subscribe nhị phân với Header chỉ vỏn vẹn **2 bytes**!
  - Hỗ trợ các mức chất lượng dịch vụ (QoS):
    + **QoS 0**: Gửi một lần không cần phản hồi (Fire and forget - Dành cho dữ liệu cảm biến định kỳ).
    + **QoS 1**: Đảm bảo tin nhắn đến ít nhất một lần (At least once - Bắt buộc cho các bản tin cảnh báo khẩn cấp Edge AI).

---

### 📌 4. BẢNG PHÂN VÙNG FLASH & KIẾN TRÚC DUAL-BANK OTA (CHỐNG BRICK MÁY)
Làm thế nào để cập nhật phiên bản firmware mới hoặc nạp lại bộ trọng số mô hình AI từ xa mà không sợ vi điều khiển bị biến thành "cục gạch" (Bricking) nếu mất điện giữa chừng?
ESP32 sử dụng cơ chế **Bảng phân vùng Flash đối xứng (Dual-Bank OTA)**:
\`\`\`text
[Bootloader] ➔ [Partition Table] ➔ [NVS Config] ➔ [otadata] ➔ [ota_0: App A] ➔ [ota_1: App B]
\`\`\`
1. **Trạng thái bình thường**: Vi điều khiển đang chạy firmware hiện tại ở ngăn \`ota_0\` (App A).
2. **Khi có bản cập nhật mới**:
   - Firmware đang chạy sẽ tải file nhị phân \`.bin\` qua mạng HTTPS an toàn và ghi tuần tự từng khối vào ngăn còn lại: \`ota_1\` (App B).
   - Kiểm tra mã băm SHA-256 toàn vẹn của file tải về. Nếu có lỗi mạng làm thiếu byte, phân vùng \`ota_1\` bị hủy bỏ, hệ thống vẫn chạy tiếp bình thường trên \`ota_0\`.
3. **Hoán đổi quyền khởi động**:
   - Nếu nạp thành công 100%, phân vùng \`otadata\` được ghi cờ: *"Khởi động thử nghiệm từ ota_1 ở lần boot tiếp theo!"*.

---

### 📌 5. CƠ CHẾ TỰ ĐỘNG ROLLBACK NẾU FIRMWARE MỚI BỊ CRASH
Đây là tính năng sinh tử của kỹ sư nhúng chuyên nghiệp:
- Điều gì xảy ra nếu bản firmware mới nạp thành công nhưng có bug gây sụp nguồn (Crash loop) ngay khi khởi động?
- ESP-IDF tích hợp cơ chế **OTA Rollback tự động**:
  1. Khi boot vào firmware mới, hệ điều hành đánh dấu trạng thái là \`ESP_OTA_IMG_PENDING_VERIFY\`.
  2. Trong mã nguồn firmware mới, sau khi khởi động xong và chạy tự kiểm tra (Self-test) các cảm biến và nạp mô hình AI thành công, bạn phải chủ động gọi hàm:
     \`\`\`c
     esp_ota_mark_app_valid_cancel_rollback();
     \`\`\`
  3. Nếu firmware mới bị crash hoặc bị Task Watchdog reset trước khi kịp gọi hàm trên: Bootloader phần cứng sẽ tự động phát hiện, hủy bỏ phân vùng mới và **lập tức Rollback quay trở về firmware cũ \`ota_0\` hoạt động ổn định**! Thiết bị không bao giờ bị mất liên lạc!

---

### 📌 6. CODE MẪU THỰC CHIẾN: MQTT TELEMETRY & HTTPS OTA FLOW
\`\`\`c
#include <stdio.h>
#include "esp_log.h"
#include "mqtt_client.h"
#include "esp_https_ota.h"
#include "esp_ota_ops.h"

static esp_mqtt_client_handle_t s_mqtt_client = NULL;

// 1. Gửi kết quả phát hiện sự cố AI qua MQTT siêu nhẹ
void publish_ai_detection(const char *label, float confidence, uint32_t latency_ms) {
    if (!s_mqtt_client) return;

    char json_payload[128];
    snprintf(json_payload, sizeof(json_payload),
             "{\\"event\\":\\"%s\\",\\"conf\\":%.2f,\\"latency\\":%lu}",
             label, confidence, latency_ms);

    // Gửi lên Topic với mức an toàn QoS 1
    esp_mqtt_client_publish(s_mqtt_client, "factory/sensor_01/alerts", 
                            json_payload, 0, 1, 0);
    ESP_LOGI("MQTT", "Đã gửi cảnh báo Edge AI: %s", json_payload);
}

// 2. Quy trình nâng cấp Firmware / Model Weights an toàn với tự động Rollback
void start_firmware_ota_update(const char *download_url) {
    ESP_LOGI("OTA", "Bắt đầu cập nhật firmware mới từ: %s", download_url);

    esp_http_client_config_t http_config = {
        .url = download_url,
        .timeout_ms = 10000,
        .keep_alive_enable = true,
    };
    esp_https_ota_config_t ota_config = {
        .http_config = &http_config,
    };

    esp_err_t ret = esp_https_ota(&ota_config);
    if (ret == ESP_OK) {
        ESP_LOGI("OTA", "Tải firmware thành công! Đang khởi động lại vào bản mới...");
        esp_restart();
    } else {
        ESP_LOGE("OTA", "Cập nhật OTA thất bại! Giữ nguyên firmware hiện tại.");
    }
}

// 3. Hàm kiểm tra trong app_main của firmware mới: Xác nhận hoạt động tốt
void verify_firmware_health(void) {
    const esp_partition_t *running = esp_ota_get_running_partition();
    esp_ota_img_states_t ota_state;

    if (esp_ota_get_state_partition(running, &ota_state) == ESP_OK) {
        if (ota_state == ESP_OTA_IMG_PENDING_VERIFY) {
            ESP_LOGI("OTA", "Firmware mới đang chạy thử nghiệm...");
            // Chạy kiểm tra các ngoại vi và nạp mô hình AI...
            bool system_healthy = true; // Kết quả self-test

            if (system_healthy) {
                esp_ota_mark_app_valid_cancel_rollback();
                ESP_LOGI("OTA", "✅ XÁC NHẬN THÀNH CÔNG: Firmware mới đã được lưu vĩnh viễn!");
            } else {
                ESP_LOGE("OTA", "❌ Phát hiện lỗi! Tự động Rollback về phiên bản cũ.");
                esp_ota_mark_app_invalid_rollback_and_reboot();
            }
        }
    }
}
\`\`\``
    },
    {
        id: "doc_stage6_tinyml",
        title: "Lộ Trình Bước 6: Triển Khai Mô Hình TinyML & Quy Trình Lượng Tử Hóa INT8",
        category: "Lộ Trình 6",
        tags: ["#LộTrình", "#Bước6", "#TinyML", "#INT8", "#TFLiteMicro", "#Quantization", "#Inference"],
        date: "26/09/2026",
        words: 1620,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO BẮT BUỘC PHẢI LƯỢNG TỬ HÓA INT8?
Khi huấn luyện một mạng nơ-ron sâu (CNN, MobileNet, Dense) trên máy tính bằng Python/TensorFlow:
- Toàn bộ trọng số ma trận (Weights), độ lệch (Bias) và giá trị kích hoạt (Activations) đều được lưu dưới dạng số thực dấu chấm động **Float32 (4 bytes / số)**.
- Một mô hình nhận diện giọng nói hoặc phân loại ảnh mini có thể chứa 200,000 tham số -> Chiếm: \`200,000 x 4 bytes = 800 KB RAM\`.
- Trong khi đó, toàn bộ bộ nhớ SRAM nội của ESP32-S3 chỉ có 512KB (và vùng trống khả dụng cho AI chỉ khoảng 200KB - 300KB). Mô hình Float32 hoàn toàn **không thể nhét vừa** vào vi điều khiển!

✅ **Phép màu của Lượng tử hóa INT8 (Post-Training Quantization - PTQ)**:
- Nén toàn bộ số thực Float32 4 bytes về số nguyên có dấu **INT8 1 byte** (từ -128 đến 127).
- **Lợi ích 1**: Dung lượng mô hình giảm đúng **75%** (từ 800KB xuống còn 200KB, hoặc từ 80KB xuống 20KB)!
- **Lợi ích 2 (Tăng tốc vượt trội)**: Vi xử lý Xtensa LX7 của ESP32-S3 không có bộ tính toán Float64 mạnh mẽ, nhưng sở hữu bộ nhân cộng dồn nguyên (**Integer Multiply-Accumulate - MAC**) cực nhanh. Phép nhân 2 số nguyên 8-bit chỉ tốn 1 chu kỳ xung nhịp, giúp mô hình suy luận **nhanh gấp 3 đến 5 lần**, tiết kiệm 80% thời lượng pin!
- **Độ chính xác**: Khi lượng tử hóa đúng cách với tập dữ liệu đại diện, độ chính xác (Accuracy) của mô hình chỉ suy giảm chưa tới 1%!

---

### 📌 2. TOÁN HỌC ĐẰNG SAU LƯỢNG TỬ HÓA: CÔNG THỨC ÁNH XẠ
Làm sao nén một dải số thực vô tận vào 256 giá trị nguyên của kiểu \`int8\`?
Công thức lượng tử hóa tuyến tính chuẩn:
$$RealValue = Scale \times (QuantizedInt8 - ZeroPoint)$$
Trong đó:
- **$Scale$ (Tỉ lệ co giãn)**: Một số thực dương Float32 xác định bước nhảy giữa 2 giá trị nguyên kề nhau.
- **$ZeroPoint$ (Điểm không)**: Một số nguyên INT8 tương ứng với giá trị thực tế $0.0$.
- **Quy trình Representative Dataset**:
  Trong Python, trước khi xuất file mô hình, bạn phải cung cấp khoảng 100 - 200 mẫu dữ liệu thực tế (Representative Dataset) cho bộ chuyển đổi \`TFLiteConverter\`. Bộ chuyển đổi sẽ chạy mô phỏng để đo đạc giá trị Max và Min của từng lớp nơ-ron, từ đó tính toán chính xác cặp số $Scale$ và $ZeroPoint$ tối ưu nhất cho từng Tensor.

---

### 📌 3. TỐI ƯU FLASH BẰNG MICROMUTABLEOPRESOLVER CỦA TFLITE MICRO
Trong thư viện TensorFlow Lite for Microcontrollers (TFLite Micro):
- Nếu bạn dùng \`tflite::AllOpsResolver\`: Thư viện sẽ lôi toàn bộ hơn 100 toán tử AI (bao gồm cả các phép toán phức tạp như LSTM, Dequantize, ArgMax...) nạp vào firmware -> Tốn thêm hơn **100KB Flash** vô ích!
- ✅ **Cách làm của chuyên gia**: Sử dụng \`tflite::MicroMutableOpResolver<N>\`.
  Chỉ khai báo và nạp đúng các toán tử mà kiến trúc mạng của bạn thực sự sử dụng (ví dụ mô hình KWS Audio chỉ dùng 4 toán tử: Conv2D, FullyConnected, Reshape, Softmax):
  \`\`\`cpp
  tflite::MicroMutableOpResolver<4> resolver;
  resolver.AddConv2D();
  resolver.AddFullyConnected();
  resolver.AddReshape();
  resolver.AddSoftmax();
  \`\`\`
  Trình liên kết (Linker) sẽ tự động lược bỏ toàn bộ mã nguồn thừa, firmware nhỏ gọn và giải phóng tối đa bộ nhớ Flash.

---

### 📌 4. VÒNG ĐỜI SUY LUẬN TOÀN DIỆN (INFERENCE PIPELINE CHUẨN)
Quy trình thực thi một lần dự đoán AI trên vi điều khiển bao gồm 5 bước nghiêm ngặt:
1. **Khởi tạo Tensor Arena căn lề 16-byte**: Cấp phát tĩnh mảng \`alignas(16) static uint8_t tensor_arena[kArenaSize]\` trong Internal SRAM tốc độ cao.
2. **Nạp FlatBuffer Model**: Đọc con trỏ nhị phân mô hình từ Flash: \`tflite::GetModel(g_model_data)\`.
3. **Cấp phát bộ nhớ Tensor**: Gọi \`interpreter.AllocateTensors()\`. TFLite Micro sẽ tự động sắp xếp các lớp nơ-ron chồng lên nhau trong Tensor Arena để tái sử dụng bộ nhớ tối đa.
4. **Lượng tử hóa đầu vào (Input Quantization)**:
   Lấy dữ liệu cảm biến thực tế (ví dụ phổ FFT) và ép kiểu về INT8 theo đúng công thức:
   \`\`\`c
   int8_t quant_val = (int8_t)(real_val / input->params.scale + input->params.zero_point);
   \`\`\`
5. **Gọi Invoke() & Đọc nhãn dự đoán**:
   Gọi \`interpreter.Invoke()\`. Đọc mảng xác suất đầu ra \`interpreter.output(0)->data.int8\`. Vị trí có xác suất cao nhất chính là kết quả dự đoán (ArgMax)!

---

### 📌 5. 4 CẠM BẪY CHÍ MẠNG TRONG TINYML VÀ CÁCH PHÒNG TRÁNH
1. **Lỗi Arena Too Small**: Kích thước Tensor Arena không đủ lớn. Hàm \`AllocateTensors()\` trả về lỗi \`kTfLiteError\`.
   ✅ *Khắc phục*: Tăng kích thước \`kArenaSize\` lên từng bậc 8KB cho đến khi thành công, sau đó dùng hàm \`interpreter.arena_used_bytes()\` để biết chính xác dung lượng thực tế cần dùng.
2. **Crash LoadStoreAlignment do thiếu căn lề**: Quên từ khóa \`alignas(16)\` khiến tập lệnh SIMD nạp dữ liệu ở địa chỉ lẻ, gây sụp nguồn Guru Meditation.
3. **Bẫy Misquantization (Quên lượng tử hóa đầu vào)**: Đẩy trực tiếp số thực Float32 hoặc số int16 thô vào mảng \`data.int8\` khiến mô hình đưa ra kết quả ngẫu nhiên hoàn toàn sai.
4. **Trọng số lưu nhầm vào RAM**: Quên từ khóa \`const\` khi khai báo mảng FlatBuffer model, khiến trình biên dịch sao chép toàn bộ trọng số từ Flash vào RAM lúc khởi động làm cạn kiệt SRAM.

---

### 📌 6. CODE THỰC CHIẾN C++ TRÊN ESP32-S3: NHẬN DIỆN TỪ KHÓA / RUNG ĐỘNG
\`\`\`cpp
#include <stdio.h>
#include <stdalign.h>
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include "esp_log.h"
#include "esp_timer.h"

// Mảng FlatBuffer nhị phân của mô hình AI (được chuyển đổi từ xxd -i model.tflite)
extern const unsigned char g_keyword_model_data[];

// 1. Cấp phát Tensor Arena căn lề 16-byte trong Internal SRAM
constexpr int kTensorArenaSize = 48 * 1024; // 48 KB
alignas(16) static uint8_t tensor_arena[kTensorArenaSize];

static tflite::MicroInterpreter* interpreter = nullptr;
static TfLiteTensor* input_tensor = nullptr;
static TfLiteTensor* output_tensor = nullptr;

void init_tinyml_engine(void) {
    // 2. Nạp mô hình FlatBuffer
    const tflite::Model* model = tflite::GetModel(g_keyword_model_data);
    if (model->version() != TFLITE_SCHEMA_VERSION) {
        ESP_LOGE("AI", "Phiên bản schema model không tương thích!");
        return;
    }

    // 3. Đăng ký tối giản 4 toán tử cần thiết
    static tflite::MicroMutableOpResolver<4> resolver;
    resolver.AddConv2D();
    resolver.AddFullyConnected();
    resolver.AddReshape();
    resolver.AddSoftmax();

    // 4. Khởi tạo Interpreter và cấp phát Tensor
    static tflite::MicroInterpreter static_interpreter(
        model, resolver, tensor_arena, kTensorArenaSize);
    interpreter = &static_interpreter;

    if (interpreter->AllocateTensors() != kTfLiteOk) {
        ESP_LOGE("AI", "Cấp phát Tensor Arena thất bại! Vui lòng tăng kTensorArenaSize.");
        return;
    }

    input_tensor = interpreter->input(0);
    output_tensor = interpreter->output(0);

    ESP_LOGI("AI", "Khởi tạo TinyML INT8 thành công! Kích thước Arena chiếm dụng: %u bytes",
             (unsigned int)interpreter->arena_used_bytes());
}

int run_ai_inference(const float* preprocessed_spectrogram, float* out_confidence) {
    if (!interpreter || !input_tensor || !output_tensor) return -1;

    // 5. Lượng tử hóa đặc trưng đầu vào từ Float sang INT8
    float scale = input_tensor->params.scale;
    int32_t zero_point = input_tensor->params.zero_point;
    int num_elements = input_tensor->bytes;

    int8_t* input_data = input_tensor->data.int8;
    for (int i = 0; i < num_elements; i++) {
        int32_t quant_val = (int32_t)roundf(preprocessed_spectrogram[i] / scale) + zero_point;
        if (quant_val < -128) quant_val = -128;
        if (quant_val > 127) quant_val = 127;
        input_data[i] = (int8_t)quant_val;
    }

    // 6. Đo chính xác thời gian suy luận (Latency Benchmarking)
    int64_t start_us = esp_timer_get_time();
    TfLiteStatus invoke_status = interpreter->Invoke();
    int64_t latency_ms = (esp_timer_get_time() - start_us) / 1000;

    if (invoke_status != kTfLiteOk) {
        ESP_LOGE("AI", "Suy luận thất bại!");
        return -1;
    }

    // 7. Tìm nhãn có xác suất cao nhất (ArgMax)
    int8_t* output_data = output_tensor->data.int8;
    float out_scale = output_tensor->params.scale;
    int32_t out_zero_point = output_tensor->params.zero_point;

    int best_class = 0;
    int8_t max_score = -128;

    for (int i = 0; i < output_tensor->dims->data[1]; i++) {
        if (output_data[i] > max_score) {
            max_score = output_data[i];
            best_class = i;
        }
    }

    // Giải lượng tử hóa xác suất về dải [0.0 - 1.0]
    *out_confidence = (max_score - out_zero_point) * out_scale;

    ESP_LOGI("AI", "Dự đoán lớp: %d | Độ tin cậy: %.2f%% | Độ trễ: %lld ms",
             best_class, (*out_confidence) * 100.0f, latency_ms);

    return best_class;
}
\`\`\``
    },
    {
        id: "doc_stage7_lowpower",
        title: "Lộ Trình Bước 7: Tối Ưu Nguồn Cực Hạn, Deep Sleep Dưới 10uA & Vi Xử Lý Phụ ULP",
        category: "Lộ Trình 7",
        tags: ["#LộTrình", "#Bước7", "#DeepSleep", "#ULP", "#LowPower", "#Battery"],
        date: "26/09/2026",
        words: 1420,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: NGHỆ THUẬT TIẾT KIỆM NĂNG LƯỢNG THỰC TẾ
Khi triển khai thiết bị Edge AI chạy bằng pin trong nông nghiệp thông minh, giám sát sạt lở hoặc nhà máy:
- Ở chế độ hoạt động bình thường có bật Wi-Fi: ESP32-S3 tiêu thụ dòng điện từ **100mA đến 240mA**. Một viên pin 18650 dung lượng 2600mAh sẽ cạn kiệt chỉ sau **10 - 15 giờ** hoạt động!
- ✅ **Chế độ Ngủ sâu (Deep Sleep)**:
  Tắt hoàn toàn 2 nhân CPU chính (Xtensa), bộ nhớ Flash SPI ngoài, modem Wi-Fi và Bluetooth.
  Chỉ duy trì nguồn nuôi cho **RTC Controller, RTC Fast/Slow Memory và Timer phần cứng**.
  Dòng tiêu thụ giảm xuống mức không tưởng: **chỉ từ 5uA đến 10uA (micro-ampe)**!
  Cùng viên pin 2600mAh đó, nếu thiết bị chỉ thức dậy đo đạc rồi ngủ lại, thời gian hoạt động có thể kéo dài **từ 2 đến 5 năm**!

---

### 📌 2. BẢO TOÀN DỮ LIỆU QUA CÁC LẦN NGỦ VỚI RTC_DATA_ATTR
Một đặc điểm quan trọng của Deep Sleep:
- Khi CPU thức dậy, nó **không tiếp tục chạy dòng code sau lệnh ngủ**, mà hệ điều hành sẽ khởi động lại từ đầu như vừa bấm nút Reset (Reboot).
- Toàn bộ biến trên Stack và Heap trong SRAM nội đều bị xóa sạch mất dữ liệu!
- ✅ **Cách lưu giữ trạng thái**: Đặt biến vào vùng nhớ **RTC Slow Memory (16KB)** bằng từ khóa \`RTC_DATA_ATTR\`:
  \`\`\`c
  RTC_DATA_ATTR static int boot_count = 0;
  RTC_DATA_ATTR static float historical_baseline[8];
  \`\`\`
  Biến này sẽ được duy trì điện áp nuôi liên tục, giữ nguyên vẹn giá trị đếm và các thông số hiệu chuẩn qua hàng triệu lần ngủ và thức dậy!

---

### 📌 3. BỘ ĐỒNG XỬ LÝ ULP RISC-V: ĐỌC CẢM BIẾN KHI CPU CHÍNH ĐANG NGỦ
Làm thế nào để phát hiện động đất, cháy rừng hoặc rò rỉ khí gas mà không cần bật CPU chính thức 24/7?
ESP32-S3 tích hợp một vi xử lý phụ siêu tiết kiệm năng lượng: **ULP (Ultra Low Power) Coprocessor** chạy kiến trúc RISC-V 32-bit:
- Hoạt động độc lập ngay trong RTC Memory với dòng tiêu thụ chỉ khoảng **150 uA**.
- ULP có thể định kỳ tự thức dậy đọc cảm biến ADC hoặc giao tiếp I2C/GPIO.
- So sánh giá trị cảm biến với ngưỡng cài đặt (Threshold Limit).
- **Chỉ khi giá trị cảm biến vượt ngưỡng nguy hiểm**, ULP mới gửi tín hiệu ngắt đánh thức 2 nhân CPU chính dậy để chạy mô hình AI nhận diện và phát chuông báo động!

---

### 📌 4. MÔ HÌNH TOÁN HỌC TÍNH TOÁN THỜI LƯỢNG PIN
Công thức tính dòng điện tiêu thụ trung bình ($I_{avg}$):
$$I_{avg} = \frac{I_{active} \times T_{active} + I_{sleep} \times T_{sleep}}{T_{active} + T_{sleep}}$$
**Ví dụ thực tế cho đồ án**:
- Thời gian thức: $T_{active} = 0.5$ giây, dòng tiêu thụ $I_{active} = 120$ mA (Chạy FFT + Suy luận AI).
- Thời gian ngủ: $T_{sleep} = 59.5$ giây, dòng tiêu thụ $I_{sleep} = 0.01$ mA (10 uA).
- Chu kỳ tổng: 60 giây (Mỗi phút thức dậy 1 lần).
$$I_{avg} = \frac{120 \times 0.5 + 0.01 \times 59.5}{60} = \frac{60 + 0.595}{60} \approx 1.01 \text{ mA}$$
Với viên pin $2500$ mAh, tuổi thọ pin trên lý thuyết:
$$T = \frac{2500 \text{ mAh}}{1.01 \text{ mA}} \approx 2475 \text{ giờ } \approx 103 \text{ ngày!}$$

---

### 📌 5. CODE THỰC CHIẾN: CẤU HÌNH DEEP SLEEP & RTC WAKEUP
\`\`\`c
#include <stdio.h>
#include "esp_sleep.h"
#include "esp_log.h"
#include "driver/gpio.h"

// Biến được bảo toàn giá trị qua các chu kỳ Deep Sleep
RTC_DATA_ATTR static int s_wakeup_count = 0;
RTC_DATA_ATTR static int64_t s_last_alert_time = 0;

void app_main(void) {
    s_wakeup_count++;
    ESP_LOGI("POWER", "=== THỨC DẬY LẦN THỨ: %d ===", s_wakeup_count);

    // Kiểm tra nguyên nhân đánh thức
    esp_sleep_wakeup_cause_t cause = esp_sleep_get_wakeup_cause();
    switch (cause) {
        case ESP_SLEEP_WAKEUP_TIMER:
            ESP_LOGI("POWER", "Đánh thức bởi Timer định kỳ.");
            break;
        case ESP_SLEEP_WAKEUP_EXT0:
            ESP_LOGW("POWER", "ĐÁNH THỨC KHẨN CẤP: Nút bấm hoặc cảm biến ngắt ngoài!");
            break;
        default:
            ESP_LOGI("POWER", "Khởi động nguội lần đầu.");
            break;
    }

    // Chạy tác vụ đo cảm biến và suy luận TinyML ngắn gọn...
    // run_edge_ai_instant_check();

    // Cấu hình đánh thức:
    // 1. Đánh thức định kỳ sau 60 giây (60,000,000 micro-giây)
    esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL);

    // 2. Kích hoạt đánh thức khẩn cấp từ chân GPIO0 (nút bấm mức thấp 0V)
    esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0);

    // Tắt nguồn các rail ngoại vi không cần thiết để đạt dòng tiêu thụ tối thiểu < 10uA
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_OFF);

    ESP_LOGI("POWER", "Hệ thống chuẩn bị vào chế độ Deep Sleep. Chúc ngủ ngon!");
    esp_deep_sleep_start();
}
\`\`\``
    },
    {
        id: "doc_stage8_capstone",
        title: "Lộ Trình Bước 8: Tiêu Chuẩn Nghiệm Thu Đồ Án Điểm A+, Benchmarking Latency & Heap Tracing 24/7",
        category: "Lộ Trình 8",
        tags: ["#LộTrình", "#Bước8", "#Capstone", "#Benchmarking", "#ConfusionMatrix", "#HeapTrace"],
        date: "26/09/2026",
        words: 1490,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: ĐỒ ÁN ĐIỂM A+ KHÁC BIỆT GÌ VỚI ĐỒ ÁN TRUNG BÌNH?
Hầu hết sinh viên làm đồ án nhúng AI thường chỉ dừng ở mức: *"Em cắm mạch, bật nguồn lên, đèn LED sáng hoặc màn hình in ra kết quả là xong"*.
Khi hội đồng phản biện hỏi:
- *"Mô hình của em suy luận mất chính xác bao nhiêu mili-giây?"*
- *"Bộ nhớ SRAM lúc đỉnh điểm ngốn bao nhiêu KB? Có nguy cơ tràn Stack không?"*
- *"Độ chính xác 95% của em, nếu trong tập dữ liệu số ca bệnh chỉ chiếm 1% thì mô hình có bị hiện tượng đoán mò (Class Imbalance) không?"*
- *"Thiết bị chạy liên tục 3 ngày có bị rò rỉ bộ nhớ (Memory Leak) làm sập nguồn không?"*

👉 **Để đạt điểm A+ tuyệt đối**, bạn bắt buộc phải có một chương **Benchmarking Khoa Học Định Lượng** với số liệu đo đạc thực tế từ phần cứng!

---

### 📌 2. ĐO ĐẠC CÁC CHỈ SỐ PHẦN CỨNG CHUẨN XÁC (PROFILING METRICS)
4 chỉ số sinh tử bắt buộc phải có trong báo cáo đồ án:
1. **Inference Latency (Độ trễ suy luận)**:
   Thời gian hàm \`Invoke()\` tính toán ma trận, đo bằng bộ đếm micro-giây của phần cứng (\`esp_timer_get_time()\`).
2. **Throughput (Tốc độ thông lượng)**:
   Số khung hình hoặc số lần suy luận thực hiện được trong 1 giây ($FPS = \frac{1000}{Latency_{ms}}$).
3. **Flash Footprint & RAM Footprint**:
   - Dung lượng Flash: Mã máy firmware chiếm bao nhiêu KB, mô hình flatbuffer chiếm bao nhiêu KB.
   - Dung lượng SRAM: Kích thước Tensor Arena, Stack đỉnh điểm (High Watermark).
4. **Energy per Inference (Năng lượng trên mỗi lần suy luận)**:
   $$E = V \times I \times t_{latency}$$
   Ví dụ: $3.3V \times 60mA \times 0.035s = 6.93 \text{ mJ / inference}$.

---

### 📌 3. ĐÁNH GIÁ MÔ HÌNH BẰNG MA TRẬN NHẦM LẪN (CONFUSION MATRIX)
Không chỉ báo cáo mỗi chỉ số Accuracy! Phải phân tích sâu theo các thông số:
- **True Positive (TP)**: Có sự cố và máy báo đúng có sự cố.
- **False Positive (FP)**: Báo động giả (Bình thường nhưng máy báo lỗi).
- **False Negative (FN)**: Bỏ sót sự cố nguy hiểm (Có lỗi nhưng máy báo bình thường).
- **Precision (Độ chuẩn xác)**: $\frac{TP}{TP + FP}$ (Trong các lần báo động, có bao nhiêu % là đúng thật).
- **Recall (Độ nhạy)**: $\frac{TP}{TP + FN}$ (Bắt được bao nhiêu % trong tổng số ca sự cố xảy ra).
- **F1-Score**: Trung bình điều hòa giữa Precision và Recall.

---

### 📌 4. KIỂM THỬ ĐỘ ỔN ĐỊNH 24/7 VỚI CÔNG CỤ HEAP TRACING
ESP-IDF tích hợp công cụ chuyên sâu **Heap Memory Tracing**:
- Ghi nhận tất cả các lệnh gọi \`malloc()\`, \`calloc()\` và \`free()\` trong suốt quá trình chạy.
- Cho phép chạy 1,000 chu kỳ suy luận liên tục.
- So sánh lượng RAM trước và sau 1,000 chu kỳ. Nếu độ chênh lệch $\Delta RAM = 0$, bạn có bằng chứng đanh thép chứng minh firmware đạt chuẩn công nghiệp, không bị rò rỉ dù chỉ 1 byte!

---

### 📌 5. CODE THỰC CHIẾN: MODULE BENCHMARKING VÀ HEAP PROFILER
\`\`\`c
#include <stdio.h>
#include "esp_timer.h"
#include "esp_heap_caps.h"
#include "esp_log.h"

typedef struct {
    float min_latency_ms;
    float max_latency_ms;
    float avg_latency_ms;
    size_t peak_sram_used;
    uint32_t total_runs;
} BenchmarkReport_t;

static BenchmarkReport_t s_report = {
    .min_latency_ms = 999999.0f,
    .max_latency_ms = 0.0f,
    .avg_latency_ms = 0.0f,
    .peak_sram_used = 0,
    .total_runs = 0
};

void run_scientific_benchmark(void (*ai_function)(void), int iterations) {
    ESP_LOGI("BENCH", "Bắt đầu chuỗi kiểm thử %d lần suy luận...", iterations);
    float total_time = 0.0f;

    size_t ram_before = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);

    for (int i = 0; i < iterations; i++) {
        int64_t t0 = esp_timer_get_time();
        
        // Gọi hàm suy luận mô hình AI
        ai_function();

        int64_t t1 = esp_timer_get_time();
        float elapsed_ms = (t1 - t0) / 1000.0f;

        if (elapsed_ms < s_report.min_latency_ms) s_report.min_latency_ms = elapsed_ms;
        if (elapsed_ms > s_report.max_latency_ms) s_report.max_latency_ms = elapsed_ms;
        total_time += elapsed_ms;
        s_report.total_runs++;
    }

    s_report.avg_latency_ms = total_time / iterations;
    size_t ram_after = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);

    ESP_LOGI("BENCH", "================ KẾT QUẢ NGHIỆM THU ĐỒ ÁN ================");
    ESP_LOGI("BENCH", "Độ trễ trung bình: %.2f ms (Min: %.2f ms | Max: %.2f ms)",
             s_report.avg_latency_ms, s_report.min_latency_ms, s_report.max_latency_ms);
    ESP_LOGI("BENCH", "Tốc độ thông lượng (Throughput): %.1f FPS", 
             1000.0f / s_report.avg_latency_ms);
    ESP_LOGI("BENCH", "Rò rỉ RAM (Delta Leak): %d bytes (Chuẩn = 0 bytes)",
             (int)(ram_before - ram_after));
    ESP_LOGI("BENCH", "==========================================================");
}
\`\`\``
    },
    {
        id: "doc_stage9_c_interview",
        title: "Lộ Trình Bước 9: 10 Câu Hỏi Bẫy C Kinh Điển Khi Phỏng Vấn Kỹ Sư Nhúng",
        category: "Lộ Trình 9",
        tags: ["#LộTrình", "#Bước9", "#C_Interview", "#Volatile", "#Padding", "#FunctionPointers"],
        date: "26/09/2026",
        words: 1540,
        isNativePdf: false,
        content: `### 📌 1. BẪY SỐ 1: TỪ KHÓA volatile VÀ CƠ CHẾ TỐI ƯU HÓA CỦA COMPILER
**Câu hỏi nhà tuyển dụng**: *"Từ khóa volatile có ý nghĩa gì? Nếu không dùng nó trong hệ thống nhúng thì điều gì sẽ xảy ra?"*
- **Bản chất**: Báo cho trình biên dịch rằng giá trị của biến này có thể bị thay đổi bất ngờ bởi phần cứng bên ngoài (hoặc bởi một luồng ngắt) mà luồng code tuần tự hiện tại không kiểm soát được.
- **Nếu thiếu volatile**: Trình biên dịch với cờ tối ưu hóa \`-O2\` hoặc \`-O3\` sẽ tự ý nạp biến vào thanh ghi CPU nội (Register Cache) và không bao giờ đọc lại từ RAM nữa:
  \`\`\`c
  bool flag = false;
  void isr_handler() { flag = true; }
  void wait_task() {
      while (!flag); // Compiler tối ưu thành: while(true) vô hạn! Hệ thống treo cứng!
  }
  \`\`\`
- ✅ **3 trường hợp BẮT BUỘC dùng volatile**:
  1. Con trỏ trỏ vào thanh ghi ngoại vi phần cứng (Memory-Mapped I/O).
  2. Biến toàn cục được sửa đổi bên trong hàm ngắt ISR.
  3. Cờ chia sẻ giữa nhiều tác vụ trong hệ điều hành đa nhiệm RTOS.

---

### 📌 2. BẪY SỐ 2: STRUCT PADDING & PACKING (CĂN LỀ BỘ NHỚ)
**Câu hỏi nhà tuyển dụng**: *"Cho struct sau, hàm sizeof() trên CPU 32-bit trả về bao nhiêu bytes?"*
\`\`\`c
struct BadStruct {
    char a;      // 1 byte
    int b;       // 4 bytes
    char c;      // 1 byte
};
\`\`\`
- **Câu trả lời sai của người thiếu kinh nghiệm**: $1 + 4 + 1 = 6$ bytes.
- **Đáp án chính xác**: **12 bytes!**
- **Tại sao?**: Bus dữ liệu của vi điều khiển 32-bit nạp dữ liệu theo từng khối 4-byte (Word-aligned). Để biến \`int b\` nằm đúng ở địa chỉ chia hết cho 4, trình biên dịch tự động chèn **3 bytes rác (padding bytes)** sau biến \`a\`. Và sau biến \`c\`, trình biên dịch chèn tiếp **3 bytes rác** để kích thước toàn bộ struct là bội số của 4!
- ✅ **Cách tối ưu 1**: Sắp xếp lại thứ tự khai báo từ biến lớn đến biến nhỏ:
  \`\`\`c
  struct GoodStruct { int b; char a; char c; }; // Chỉ tốn 8 bytes!
  \`\`\`
- ✅ **Cách tối ưu 2**: Sử dụng \`__attribute__((packed))\` ép struct không chứa byte rác (dùng khi giao tiếp truyền gói tin mạng I2C/CAN).

---

### 📌 3. BẪY SỐ 3: PHÂN BIỆT const int* p VÀ int* const p
Cách nhớ thần tốc mẹo **"Đọc từ phải qua trái"**:
1. \`const int *p\`: Con trỏ trỏ tới dữ liệu hằng. Giá trị \`*p\` bị khóa (chỉ đọc), nhưng con trỏ \`p\` có thể trỏ đi nơi khác. Rất an toàn khi truyền mảng vào hàm xử lý.
2. \`int * const p\`: Con trỏ hằng trỏ tới dữ liệu biến thiên. Địa chỉ của \`p\` bị khóa cứng, nhưng giá trị \`*p\` sửa đổi được.
3. \`const int * const p\`: Khóa cả địa chỉ lẫn dữ liệu.

---

### 📌 4. BẪY SỐ 4: CON TRỎ HÀM (FUNCTION POINTER) LÀM STATE MACHINE
Nhà tuyển dụng chuyên nghiệp không bao giờ muốn thấy một chuỗi \`switch-case\` 50 nhánh cồng kềnh trong firmware.
Họ yêu cầu dùng **Mảng con trỏ hàm (Function Pointer Table)**:
\`\`\`c
typedef void (*StateFunc_t)(void);

void state_idle(void) { /* Chờ sự kiện */ }
void state_sampling(void) { /* Lấy mẫu cảm biến */ }
void state_inference(void) { /* Chạy TinyML */ }

// Bảng con trỏ hàm State Machine
StateFunc_t fsm_table[] = { state_idle, state_sampling, state_inference };

// Chuyển trạng thái cực nhanh trong 1 chu kỳ máy không cần switch-case:
fsm_table[current_state]();
\`\`\`

---

### 📌 5. BẪY SỐ 5: TOÁN TỬ BITWISE THAO TÁC THANH GHI
Bắt buộc phải thuộc lòng 4 thao tác bit:
1. **Bật bit thứ n (Set bit)**: \`REG |= (1U << n);\`
2. **Xóa bit thứ n (Clear bit)**: \`REG &= ~(1U << n);\`
3. **Đảo bit thứ n (Toggle bit)**: \`REG ^= (1U << n);\`
4. **Kiểm tra bit thứ n (Check bit)**: \`if (REG & (1U << n))\``
    },
    {
        id: "doc_stage10_baremetal",
        title: "Lộ Trình Bước 10: Kiến Trúc Vi Xử Lý & Lập Trình Thanh Ghi Trần (Direct Register Access)",
        category: "Lộ Trình 10",
        tags: ["#LộTrình", "#Bước10", "#BareMetal", "#Registers", "#LinkerScript", "#MemoryMapped"],
        date: "26/09/2026",
        words: 1460,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO PHẢI HIỂU THANH GHI TRẦN (BARE-METAL)?
Các thư viện có sẵn (như Arduino \`digitalWrite\` hoặc thậm chí ESP-IDF HAL) luôn có lớp trừu tượng bao bọc (Abstraction Overhead):
- Hàm \`digitalWrite(2, HIGH)\` của Arduino mất tới **35 đến 50 chu kỳ lệnh CPU** vì nó phải kiểm tra chân hợp lệ, tra bảng thanh ghi và cấu hình ngắt!
- Trong các bài toán điều khiển động cơ bước tốc độ cao hoặc truyền dữ liệu quang/song song cho Camera AI, độ trễ 50 chu kỳ máy là không thể chấp nhận.
- ✅ **Lập trình thanh ghi trần (Direct Register Access)**:
  Tương tác trực tiếp với địa chỉ vật lý trong Technical Reference Manual của chip. Thao tác bật/tắt chân GPIO được thực hiện trong **đúng 1 chu kỳ xung nhịp (~4 nano-giây)**!

---

### 📌 2. BẢN ĐỒ THANH GHI NGOẠI VI (MEMORY-MAPPED I/O)
Trong kiến trúc vi xử lý 32-bit (ARM Cortex-M hay Xtensa), các thiết bị ngoại vi (GPIO, Timer, I2C, SPI) không nằm ở một thế giới riêng, mà được ánh xạ trực tiếp vào không gian địa chỉ bộ nhớ như các ô nhớ RAM thông thường:
- Ví dụ trên ESP32: Thanh ghi đặt mức logic cao cho GPIO0-31 nằm ở địa chỉ: \`0x3FF44008\` (\`GPIO_OUT_W1TS_REG\`).
- Để bật chân GPIO2 lên mức cao:
  \`\`\`c
  #define GPIO_OUT_W1TS_REG  0x3FF44008
  *((volatile uint32_t *)GPIO_OUT_W1TS_REG) = (1U << 2);
  \`\`\`
- Phép gán con trỏ trần này dịch thành đúng 1 lệnh máy \`S32I\` (Store 32-bit Immediate), tốc độ tối đa của phần cứng!

---

### 📌 3. HIỂU SÂU VỀ LINKER SCRIPT (.LD) VÀ VÒNG ĐỜI KHỞI ĐỘNG
Điều gì xảy ra trước khi hàm \`app_main()\` hoặc \`main()\` được gọi?
File kịch bản liên kết (**Linker Script - \`.ld\`**) quy định việc sắp xếp mã máy vào bộ nhớ:
1. **Phân đoạn \`.text\`**: Lưu mã lệnh thực thi trong Flash ROM.
2. **Phân đoạn \`.rodata\`**: Lưu hằng số chuỗi và trọng số mô hình AI tĩnh.
3. **Phân đoạn \`.data\`**: Các biến toàn cục được khởi tạo giá trị ban đầu khác 0. Khởi động máy, CPU tự chép đoạn này từ Flash vào RAM.
4. **Phân đoạn \`.bss\`**: Các biến toàn cục chưa gán giá trị. Khởi động máy, mã nguồn Startup tự động xóa toàn bộ vùng nhớ này về số 0.
5. **Stack Top**: Con trỏ ngăn xếp khởi tạo tại đỉnh cao nhất của vùng RAM nội.`
    },
    {
        id: "doc_stage11_debug",
        title: "Lộ Trình Bước 11: Debug Thực Tế, Máy Phân Tích Logic & Giải Mã Guru Meditation Crash Dump",
        category: "Lộ Trình 11",
        tags: ["#LộTrình", "#Bước11", "#Debugging", "#LogicAnalyzer", "#GuruMeditation", "#GDB", "#JTAG"],
        date: "26/09/2026",
        words: 1470,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: KHI PRINTF TRỞ NÊN VÔ DỤNG!
Trong lập trình vi điều khiển, có 2 tình huống mà lệnh in \`printf\` hoàn toàn bất lực:
1. Thiết bị bị treo cứng trong hàm ngắt khẩn cấp hoặc sập nguồn Guru Meditation trước khi kịp gửi byte log nào qua cổng Serial.
2. Dữ liệu cảm biến I2C/SPI bị chập chờn do xung nhiễu vật lý hoặc sai lệch thời gian (Timing Violation). \`printf\` quá chậm, việc in log làm thay đổi trật tự thời gian và che giấu mất lỗi!

✅ **Bộ công cụ của kỹ sư chuyên nghiệp**:
- Máy phân tích logic phần cứng (**Logic Analyzer**).
- Kỹ thuật giải mã địa chỉ từ bản ghi sập nguồn (**Guru Meditation Crash Dump Decoding**).
- Debug phần cứng qua cổng **JTAG / OpenOCD**.

---

### 📌 2. SỬ DỤNG MÁY PHÂN TÍCH LOGIC (SALEAE / PULSEVIEW) BẮT GÓI TIN
Một chiếc máy phân tích logic 8 kênh 24MHz (giá chỉ vài trăm nghìn đồng) là vũ khí lợi hại nhất:
- Kẹp 2 que đo vào chân SCL và SDA của bus I2C.
- Mở phần mềm PulseView để giải mã giao thức (Protocol Decoder).
- Bạn sẽ nhìn thấy từng bit thực tế chạy trên dây cáp:
  + Cảm biến có gửi cờ **ACK (Acknowledge)** hay gửi **NACK**?
  + Tốc độ Clock có đúng 400kHz không?
  + Dạng sóng có bị bo tròn do thiếu **điện trở kéo lên (Pull-up Resistor 4.7k)** không?

---

### 📌 3. GIẢI MÃ GURU MEDITATION CRASH DUMP TRONG 5 GIÂY
Khi ESP32 bị crash, màn hình Serial in ra một loạt thông số khó hiểu:
\`\`\`text
Guru Meditation Error: Core 1 panic'ed (LoadProhibited). Exception was unhandled.
Core 1 register dump:
PC      : 0x4200b21a  PS      : 0x00060830  A0      : 0x8200b345  A1      : 0x3ffb6120
EXCVADDR: 0x00000000
\`\`\`
- **Giải mã lỗi**: \`LoadProhibited\` kết hợp \`EXCVADDR: 0x00000000\` nghĩa là mã nguồn đã cố đọc dữ liệu từ **con trỏ NULL**!
- **Định vị chính xác dòng code gây crash**:
  Sử dụng công cụ \`addr2line\` trong bộ ESP-IDF Toolchain:
  \`\`\`bash
  xtensa-esp32s3-elf-addr2line -pfia -e build/firmware.elf 0x4200b21a
  \`\`\`
  Màn hình sẽ in ra chính xác: \`main/ai_model.c:142\`. Bạn tìm ra dòng code gây lỗi chỉ trong vòng 5 giây mà không cần đoán mò!`
    },
    {
        id: "doc_stage12_misra",
        title: "Lộ Trình Bước 12: Tiêu Chuẩn An Toàn Phần Mềm Ô Tô MISRA C:2012 Cho Hệ Thống Nhúng",
        category: "Lộ Trình 12",
        tags: ["#LộTrình", "#Bước12", "#MISRA", "#Automotive", "#Safety", "#StaticAnalysis"],
        date: "26/09/2026",
        words: 1440,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TIÊU CHUẨN AN TOÀN SINH TỬ MISRA C:2012
Trong ngành công nghiệp ô tô (VinFast, Bosch, Continental) và y tế/hàng không:
Một lỗi phần mềm làm sụp nguồn vi điều khiển phanh ABS hoặc túi khí có thể cướp đi sinh mạng con người.
- Ngôn ngữ C nguyên thủy quá linh hoạt và chứa nhiều vùng hành vi không xác định (Undefined Behaviors).
- **MISRA C:2012 (Motor Industry Software Reliability Association)** là bộ quy tắc chuẩn mực quốc tế loại bỏ toàn bộ các lỗ hổng rủi ro trong mã nguồn C.

---

### 📌 2. 4 NGUYÊN TẮC BẤT DI BẤT DỊCH CỦA MISRA C
1. **Nghiêm cấm cấp phát động trong Runtime (Rule 21.3)**:
   Sau giai đoạn khởi động ban đầu của hệ thống, cấm tuyệt đối việc gọi \`malloc()\`, \`calloc()\` hay \`free()\`. Toàn bộ mảng đệm và mô hình AI phải được cấp phát tĩnh để loại trừ 100% rủi ro phân mảnh Heap và OOM Crash.
2. **Cấm đệ quy (Recursion) và cấm câu lệnh goto (Rule 17.2, 15.1)**:
   Hàm đệ quy làm độ sâu của Stack không thể dự đoán được, dễ gây tràn Stack Overflow sụp nguồn hệ thống.
3. **Bắt buộc dùng kiểu dữ liệu kích thước cố định (stdint.h)**:
   Cấm dùng kiểu \`int\`, \`long\`, \`short\` trần trụi vì kích thước của chúng phụ thuộc vào từng trình biên dịch. Luôn khai báo tường minh: \`uint8_t\`, \`int16_t\`, \`uint32_t\`.
4. **Cấm ép kiểu con trỏ ngầm định (Rule 11.3)**:
   Chống việc ép con trỏ mảng byte lẻ sang con trỏ cấu trúc 32-bit gây lỗi ngoại lệ căn lề phần cứng.`
    },
    {
        id: "doc_stage13_canbus",
        title: "Lộ Trình Bước 13: Mạng Truyền Thông Ô Tô CAN Bus 2.0B (TWAI) & Modbus RTU RS485 Công Nghiệp",
        category: "Lộ Trình 13",
        tags: ["#LộTrình", "#Bước13", "#CANBus", "#TWAI", "#RS485", "#Modbus", "#Automotive"],
        date: "26/09/2026",
        words: 1480,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TẠI SAO XE HƠI VÀ NHÀ MÁY DÙNG CAN BUS & RS485?
Trong môi trường ô tô hoặc nhà xưởng công nghiệp với động cơ công suất hàng chục Kilowatt:
Nhiễu điện từ trường (EMI) cực kỳ khủng khiếp. Nếu dùng dây UART hoặc I2C thông thường kéo dài 2 mét, tín hiệu sẽ bị biến dạng hoàn toàn.
- ✅ **Nguyên lý Tín Hiệu Vi Sai (Differential Signaling)**:
  CAN Bus (CAN_H, CAN_L) và RS485 (A, B) truyền dữ liệu bằng hiệu điện thế giữa 2 dây cáp xoắn. Khi nhiễu sóng điện từ đánh vào, nó tác động như nhau lên cả 2 dây (Common-mode Noise). Bộ thu ở đầu cuối lấy hiệu $V_{diff} = V_H - V_L$, triệt tiêu hoàn toàn nhiễu! Tín hiệu truyền xa hàng trăm mét với độ tin cậy tuyệt đối.

---

### 📌 2. GIAO THỨC CAN BUS (TWAI TRÊN ESP32-S3)
Trên ESP32-S3, bộ điều khiển CAN Bus được gọi là **TWAI (Two-Wire Automotive Interface)**:
- Hỗ trợ chuẩn CAN 2.0B với tốc độ lên tới 1 Mbps.
- **Giải quyết xung đột không phá hủy (Bitwise Arbitration)**: Nhiều hộp đen ECU cùng phát gói tin lên mạng cùng lúc mà không làm hỏng gói tin. Gói tin nào có **CAN ID nhỏ hơn** (độ ưu tiên khẩn cấp cao hơn) sẽ giành quyền truyền trước.
- **Bộ lọc phần cứng Acceptance Filter**: Cho phép cấu hình thanh ghi Code và Mask để phần cứng chỉ nhận các ID cảnh báo cần thiết, tự động vứt bỏ gói tin thừa mà không làm phiền CPU!`
    },
    {
        id: "doc_stage14_unittest",
        title: "Lộ Trình Bước 14: Kiểm Thử Tự Động Unit Test (Unity & CMock) & CI/CD Nhúng Tự Động Build",
        category: "Lộ Trình 14",
        tags: ["#LộTrình", "#Bước14", "#UnitTest", "#Unity", "#CMock", "#CICD", "#DevOps"],
        date: "26/09/2026",
        words: 1490,
        isNativePdf: false,
        content: `### 📌 1. BẢN CHẤT CỐT LÕI: TỪ NGHIỆP DƯ ĐẾN KỸ SƯ NHÚNG CHUYÊN NGHIỆP
Sự khác biệt lớn nhất giữa một người lập trình nhúng nghiệp dư và một kỹ sư chuyên nghiệp tại các tập đoàn công nghệ lớn:
- Người nghiệp dư: Sửa code xong nạp trực tiếp vào mạch phần cứng, dùng mắt nhìn xem đèn LED có nhấp nháy không. Khi dự án lớn lên hàng trăm file, việc sửa một hàm ở chỗ này có thể vô tình làm hỏng một hàm ở chỗ khác (Hồi quy lỗi - Regression Bug) mà không hề hay biết!
- Kỹ sư chuyên nghiệp: Thiết kế mã nguồn độc lập phần cứng (**Hardware Abstraction Layer - HAL**), viết hàng trăm test case kiểm thử tự động (**Unit Test**) chạy trên máy tính PC chỉ trong 3 giây.
- Thiết lập đường ống **CI/CD (GitHub Actions)**: Mỗi khi bạn \`git push\` code lên repository, máy chủ đám mây sẽ tự động chạy lint kiểm tra lỗi cú pháp, tự động chạy Unit Test và tự động biên dịch firmware nhị phân. Nếu có bất kỳ lỗi nào, hệ thống lập tức báo đỏ từ chối cho phép sáp nhập code!`
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
window.setNotebookRightMode = setNotebookRightMode;
window.renderNotebookDocReader = renderNotebookDocReader;
window.askAiAboutCurrentDoc = askAiAboutCurrentDoc;
window.scrollToPracticeInReader = scrollToPracticeInReader;
window.openPracticeForCurrentDocModule = openPracticeForCurrentDocModule;

