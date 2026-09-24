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
        id: "doc_stage1_memory",
        title: "Lộ Trình Bước 1: Kiến Trúc Bộ Nhớ ESP32-S3 & Quản Lý C Core",
        category: "Lộ Trình 1",
        tags: ["#LộTrình", "#Bước1", "#ESP32", "#Memory"],
        date: "24/09/2026",
        words: 480,
        isNativePdf: false,
        content: `### 1. Phân Vùng Bản Đồ Bộ Nhớ ESP32-S3
- **Internal SRAM0 (64 KB)**: Dùng riêng cho CPU Instruction Cache và các hàm ngắt khẩn cấp \`IRAM_ATTR\`.
- **Internal SRAM1 (384 KB)**: Vùng nhớ chính tốc độ 1 chu kỳ xung nhịp (~240MHz). Đây là nơi duy nhất lý tưởng để đặt **Tensor Arena** của TFLite Micro nhằm đạt độ trễ mili-giây.
- **External PSRAM (Tối đa 8MB Octal SPI)**: Bộ nhớ ngoài dung lượng lớn nhưng tốc độ truy xuất chậm hơn SRAM nội ~3-4 lần do đi qua bus SPI. Thích hợp chứa buffer ảnh Camera hoặc trọng số mô hình lớn.

### 2. Yêu Cầu Căn Lề (Memory Alignment 16-byte)
ESP32-S3 hỗ trợ tập lệnh mở rộng **Vector AI Instructions (SIMD)**. Để CPU có thể nạp một lúc 128-bit dữ liệu ma trận trọng số INT8, vùng đệm Tensor Arena bắt buộc phải được căn lề 16-byte:
\`\`\`c
constexpr int kTensorArenaSize = 64 * 1024;
alignas(16) static uint8_t tensor_arena[kTensorArenaSize];
\`\`\`
Nếu thiếu \`alignas(16)\`, mô hình sẽ phát sinh ngoại lệ phần cứng LoadStoreAlignment Crash làm sụp nguồn vi điều khiển.

### 3. Stack vs Heap & Chống Phân Mảnh (Anti-Fragmentation)
Trong hệ thống nhúng hoạt động 24/7, việc gọi \`malloc()\`/\`free()\` liên tục sẽ làm phân mảnh Heap, dẫn đến cạn kiệt bộ nhớ OOM (Out Of Memory) dù tổng RAM còn trống vẫn nhiều. Luôn ưu tiên cấp phát tĩnh (Static Allocation) cho các bộ đệm cố định.`
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

// Khởi tạo state và tự động gộp các tài liệu lý thuyết lộ trình mới
let notebookDocs = JSON.parse(localStorage.getItem(STORAGE_NOTEBOOK_DOCS)) || [];
if (notebookDocs.length === 0) {
    notebookDocs = [...defaultNotebookDocs];
} else {
    // Tự động bổ sung tài liệu 6 giai đoạn nếu chưa có
    defaultNotebookDocs.forEach(defDoc => {
        if (!notebookDocs.some(d => d.id === defDoc.id)) {
            notebookDocs.push(defDoc);
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
        text: `Chào Kỹ sư **Mr. Thai**! Tôi là **Trợ Lý Tài Liệu Nhúng & Edge AI (Doc AI)**.\n\n🔥 **Tính năng mới**: Tôi đã hỗ trợ **đọc trực tiếp file PDF nguyên bản (Native Multimodal PDF)** bằng mô hình **Gemini 2.5 Flash**. Tôi có thể "nhìn" và phân tích toàn bộ **bảng thanh ghi bitfield, sơ đồ khối phần cứng, sơ đồ chân GPIO và công thức toán học** trong Datasheet mà không bị mất chữ hay vỡ định dạng!\n\nBạn có thể bấm nút **"📎 PDF Gốc"** ở khung chat để đính kèm file PDF hoặc nạp vào thư viện bên trái nhé!`
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
        statusPill.innerHTML = `🟢 <span style="color: var(--accent);">Gemini 2.5 Flash Online</span>`;
        statusPill.title = "Đã cấu hình Google Gemini API Key. Đang hoạt động ở chế độ Cloud AI RAG & Native PDF Multimodal.";
    } else {
        statusPill.innerHTML = `⚪ <span style="color: var(--cyan);">Local Knowledge Engine</span>`;
        statusPill.title = "Đang chạy chế độ RAG ngoại tuyến trên tài liệu nhúng sẵn. Bấm Cấu Hình Key để kích hoạt Gemini.";
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
    let formatted = escapeHtml(text);

    // Code blocks ```c ... ```
    formatted = formatted.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **text**
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Headers ###
    formatted = formatted.replace(/^### (.*$)/gim, '<h4 style="margin: 8px 0 4px; color: var(--cyan); font-size: 13.5px;">$1</h4>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h3 style="margin: 10px 0 6px; color: #fff; font-size: 14.5px;">$1</h3>');

    // Bullet points
    formatted = formatted.replace(/^\s*-\s+(.*$)/gim, '• $1<br>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

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

// Gọi Google Gemini API (Multimodal PDF + Text)
async function queryGeminiApi(question, docs, directPdf = null) {
    const systemPrompt = `Bạn là Trợ Lý Kỹ Sư Nghiên Cứu Nhúng & Edge AI (Doc AI) dành riêng cho Mr. Thai.
Nhiệm vụ của bạn là đọc và phân tích các tài liệu kỹ thuật được cung cấp (tổng hợp từ Google NotebookLM, Datasheet ESP32, FreeRTOS, TinyML).
QUY TẮC PHẢN HỒI:
1. Trả lời chi tiết, chuẩn xác, mang tính thực chiến cao của một Embedded Systems Architect.
2. Khi tài liệu là file PDF nguyên bản, hãy phân tích toàn diện bao gồm: các bảng thanh ghi (register maps, bitfields), sơ đồ khối CPU/Ngoại vi, sơ đồ chân GPIO, thông số điện áp và mã nguồn C mẫu.
3. Trích dẫn số trang hoặc đề mục cụ thể trong file PDF để Mr. Thai dễ đối chiếu.
4. Cung cấp ví dụ code C/C++ chuẩn theo ESP-IDF / FreeRTOS.
5. Nếu câu hỏi nằm ngoài tài liệu, hãy sử dụng kiến thức chuyên sâu về Edge AI và ESP32 để giải đáp, nhưng ghi chú rõ đây là kiến thức mở rộng ngoài tài liệu.`;

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
        promptText += `[DỮ LIỆU TÀI LIỆU VĂN BẢN]:\n${contextContent}\n\n`;
    }
    if (parts.length > 0) {
        promptText += `[GHI CHÚ QUAN TRỌNG]: Có tài liệu PDF gốc đính kèm dạng Multimodal. Hãy đọc kỹ các trang, bảng biểu thanh ghi và sơ đồ kỹ thuật trong file PDF.\n\n`;
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
            maxOutputTokens: 2048
        }
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.trim()}`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status} - Lỗi xác thực hoặc hết quota API Key.`);
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận được phản hồi từ mô hình.";

    // Cập nhật mức sử dụng Quota hôm nay
    geminiUsage.requestsToday = (geminiUsage.requestsToday || 0) + 1;
    const tokens = data.usageMetadata?.totalTokenCount || 0;
    geminiUsage.tokensToday = (geminiUsage.tokensToday || 0) + tokens;
    geminiUsage.lastRequestTime = new Date().toLocaleTimeString('vi-VN');
    localStorage.setItem(STORAGE_GEMINI_USAGE, JSON.stringify(geminiUsage));
    updateGeminiQuotaDisplay();

    let sourceName = nativePdfFoundName ? `📕 File PDF Gốc: ${nativePdfFoundName}` : (docs.length === 1 ? docs[0].title : `Toàn bộ ${docs.length} tài liệu NotebookLM`);
    addNotebookChatMessage("ai", answer, sourceName);
}

// Chế độ Local Heuristic RAG khi chưa có API Key
function queryLocalKnowledgeEngine(question, docs) {
    const qLower = question.toLowerCase();

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

    let response = "";

    if (qLower.includes("tóm tắt") || qLower.includes("cốt lõi")) {
        response = `### 📋 Tóm Tắt Cốt Lõi: "${bestDoc.title}"\n\n` +
            `Dựa trên ghi chú thu thập từ NotebookLM:\n` +
            (bestDoc.content || "").substring(0, 600) + `...\n\n` +
            `💡 **Lời khuyên thực chiến**: Tài liệu này rất then chốt cho việc tối ưu bộ nhớ và thời gian thực trên vi điều khiển.`;
    } else if (qLower.includes("thanh ghi") || qLower.includes("api") || qLower.includes("code")) {
        response = `### 🔬 Trích Xuất Kỹ Thuật từ "${bestDoc.title}":\n\n` +
            (bestDoc.content || "Không có nội dung văn bản thuần.") + `\n\n` +
            `⚙️ *Lưu ý: Hãy đối chiếu kỹ với ESP-IDF Programming Guide phiên bản bạn đang cài đặt để đảm bảo tương thích API.*`;
    } else if (qLower.includes("phỏng vấn") || qLower.includes("câu hỏi")) {
        response = `### 🎯 3 Câu Hỏi Ôn Tập Phỏng Vấn từ "${bestDoc.title}":\n\n` +
            `1. **Câu 1**: Tại sao vùng nhớ Tensor Arena của TinyML cần được căn lề 16-byte (\`alignas(16)\`) khi chạy trên ESP32-S3?\n` +
            `2. **Câu 2**: Sự khác biệt cốt lõi giữa Internal SRAM1 và External PSRAM về độ trễ truy xuất là gì?\n` +
            `3. **Câu 3**: Trong lập trình FreeRTOS đa lõi, cơ chế nào bảo vệ dữ liệu truyền giữa 2 core mà không bị nghẽn CPU?\n\n` +
            `*(Bạn có thể thử trả lời trực tiếp hoặc dùng tab Phỏng Vấn để luyện tập!)*`;
    } else {
        response = `### 💡 Trả lời từ Sổ tay: "${bestDoc.title}"\n\n` +
            `Theo tài liệu được trích xuất:\n\n` +
            (bestDoc.content || "Tài liệu này được lưu ở định dạng PDF gốc.") + `\n\n` +
            `> 💡 **Mẹo:** Bạn có thể nhập **Google Gemini API Key** (nút ⚙️ Cấu Hình Key góc trên) để kích hoạt chế độ **Cloud AI RAG 2.5 Flash**, cho phép Gemini đọc trực tiếp toàn bộ sơ đồ và bảng thanh ghi trong file PDF!`;
    }

    addNotebookChatMessage("ai", response, bestDoc.title);
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
    }
}

function closeGeminiKeyModal() {
    const modal = document.getElementById("nb-key-modal");
    if (modal) modal.style.display = "none";
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
        addNotebookChatMessage("ai", "🎉 **Tuyệt vời!** Đã kích hoạt kết nối **Google Gemini 2.5 Flash** thành công. Bây giờ tôi có thể đọc trực tiếp các file PDF nguyên bản với đầy đủ bảng biểu & sơ đồ phần cứng!");
    } else {
        showToast("Đã chuyển về chế độ Local Knowledge Engine!");
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
    if (contentEl) contentEl.innerHTML = taskTheory.content.replace(/\n/g, '<br>');

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
