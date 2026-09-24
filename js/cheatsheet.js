// ==========================================
// CHEATSHEET & REGISTERS QUICK REFERENCE
// ==========================================

const cheatSheetData = [
    // 1. ESP32-S3 Memory Architecture
    {
        category: "memory",
        title: "ESP32-S3 Address Space Map",
        tag: "Memory Map",
        desc: "Bản đồ không gian bộ nhớ vật lý của ESP32-S3 (SRAM, Flash Cache, PSRAM).",
        code: `0x3FC8_0000 - 0x3FDF_FFFF : Internal SRAM 1 (DRAM, 320 KB cho Heap/Variables)
0x4037_0000 - 0x403D_FFFF : Internal SRAM 0 (IRAM, 64 KB cho Fast ISR Code)
0x3C00_0000 - 0x3DFF_FFFF : External PSRAM (Gắn ngoài qua Octal SPI, lên đến 32 MB)
0x4200_0000 - 0x43FF_FFFF : External Flash Instruction Bus (Ánh xạ ROM code)`
    },
    {
        category: "memory",
        title: "IRAM_ATTR Interrupt Attribute",
        tag: "Interrupt ISR",
        desc: "Đặt hàm xử lý ngắt vào IRAM để thực thi tức thì, tránh trễ do Flash Cache Miss khi đang ghi Flash hoặc radio bận.",
        code: `// Khai báo hàm ngắt chuẩn kỹ thuật
static void IRAM_ATTR gpio_isr_handler(void* arg) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    xSemaphoreGiveFromISR(s_sem, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}`
    },
    {
        category: "memory",
        title: "Tensor Arena 16-Byte Alignment",
        tag: "TinyML Memory",
        desc: "Kỹ thuật căn chỉnh bộ nhớ 16-byte bắt buộc cho Tensor Arena để tận dụng tập lệnh SIMD Vector tăng tốc nhân ma trận.",
        code: `constexpr int kTensorArenaSize = 64 * 1024; // 64 KB
// Đảm bảo địa chỉ mảng chia hết cho 16
static uint8_t tensor_arena[kTensorArenaSize] __attribute__((aligned(16)));`
    },

    // 2. FreeRTOS Core APIs
    {
        category: "freertos",
        title: "xTaskCreatePinnedToCore",
        tag: "FreeRTOS Dual-Core",
        desc: "Khởi tạo Task và ghim cứng vào nhân Core 0 (xử lý I/O, mạng) hoặc Core 1 (chuyên xử lý AI nặng).",
        code: `xTaskCreatePinnedToCore(
    ai_inference_task,    // Con trỏ hàm Task
    "AI_Inference",       // Tên Task hiển thị khi Debug
    4096,                 // Kích thước Stack (tính bằng Words/Bytes)
    NULL,                 // Tham số truyền vào
    5,                    // Mức ưu tiên Priority (1 đến 24)
    &s_ai_task_handle,    // Con trỏ Task Handle
    1                     // Ghim vào Core 1 (0: PRO_CPU, 1: APP_CPU)
);`
    },
    {
        category: "freertos",
        title: "xQueueSend & xQueueReceive",
        tag: "FreeRTOS Queue",
        desc: "Truyền dữ liệu thread-safe giữa Task thu thập cảm biến (Core 0) và Task chạy AI Inference (Core 1).",
        code: `// 1. Tạo hàng đợi 5 phần tử kiểu sensor_data_t
QueueHandle_t q = xQueueCreate(5, sizeof(sensor_data_t));

// 2. Core 0 gửi dữ liệu vào đệm
xQueueSend(q, &sensor_sample, portMAX_DELAY);

// 3. Core 1 lấy mẫu ra feed vào Tensor input
sensor_data_t input_sample;
if (xQueueReceive(q, &input_sample, pdMS_TO_TICKS(100)) == pdPASS) {
    // Fill input tensor & invoke model
}`
    },
    {
        category: "freertos",
        title: "vTaskDelayUntil (Jitter-Free Periodic)",
        tag: "Deterministic Timing",
        desc: "Định thì chính xác không bị trôi thời gian (No Drifting Jitter) cho vòng lặp lấy mẫu cảm biến IMU/Audio.",
        code: `TickType_t xLastWakeTime = xTaskGetTickCount();
const TickType_t xFrequency = pdMS_TO_TICKS(10); // Chu kỳ chuẩn 10ms (100Hz)

while (1) {
    vTaskDelayUntil(&xLastWakeTime, xFrequency);
    read_imu_6axis(&ax, &ay, &az, &gx, &gy, &gz);
}`
    },

    // 3. ESP-IDF Peripherals & Drivers
    {
        category: "peripherals",
        title: "GPTimer Microsecond Configuration",
        tag: "Hardware Timer",
        desc: "Cấu hình bộ định thời phần cứng thế hệ mới (ESP-IDF v5+) với độ phân giải micro-giây.",
        code: `gptimer_handle_t gptimer = NULL;
gptimer_config_t timer_config = {
    .clk_src = GPTIMER_CLK_SRC_DEFAULT,
    .direction = GPTIMER_COUNT_UP,
    .resolution_hz = 1000000, // 1 MHz = 1 tick / 1 microsecond
};
gptimer_new_timer(&timer_config, &gptimer);

gptimer_alarm_config_t alarm_config = {
    .reload_count = 0,
    .alarm_count = 62, // ~62.5us cho tần số lấy mẫu Audio 16 kHz
    .flags.auto_reload_on_alarm = true,
};
gptimer_set_alarm_action(gptimer, &alarm_config);`
    },
    {
        category: "peripherals",
        title: "I2S Digital Microphone Config (INMP441)",
        tag: "I2S Audio",
        desc: "Cấu hình thu âm thanh số băng thông cao 16kHz 16-bit Mono cho nhận diện giọng nói Keyword Spotting.",
        code: `i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
i2s_chan_handle_t rx_chan;
i2s_new_channel(&chan_cfg, NULL, &rx_chan);

i2s_std_config_t std_cfg = {
    .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(16000), // 16 kHz
    .slot_cfg = I2S_STD_MSB_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO),
    .gpio_cfg = { .mclk = I2S_GPIO_UNUSED, .bclk = GPIO_NUM_4, .ws = GPIO_NUM_5, .din = GPIO_NUM_6 }
};
i2s_channel_init_std_mode(rx_chan, &std_cfg);
i2s_channel_enable(rx_chan);`
    },

    // 4. TFLite Micro & TinyML APIs
    {
        category: "tinyml",
        title: "TFLite Micro Runtime Initialization",
        tag: "TFLite Micro",
        desc: "Quy trình chuẩn nạp mô hình FlatBuffer, định nghĩa Ops và khởi tạo bộ thông dịch trên chip.",
        code: `// 1. Lấy mô hình từ mảng byte C
const tflite::Model* model = tflite::GetModel(g_model);

// 2. Khai báo các toán tử cần thiết (tiết kiệm ROM thay vì AllOpsResolver)
static tflite::MicroMutableOpResolver<3> micro_op_resolver;
micro_op_resolver.AddConv2D();
micro_op_resolver.AddFullyConnected();
micro_op_resolver.AddSoftmax();

// 3. Khởi tạo Interpreter với Tensor Arena tĩnh
static tflite::MicroInterpreter static_interpreter(
    model, micro_op_resolver, tensor_arena, kTensorArenaSize);
TfLiteStatus allocate_status = static_interpreter.AllocateTensors();

// 4. Lấy con trỏ input / output tensors
TfLiteTensor* input = static_interpreter.input(0);
TfLiteTensor* output = static_interpreter.output(0);`
    },
    {
        category: "tinyml",
        title: "INT8 Quantization Formula (C Routine)",
        tag: "Quantization Math",
        desc: "Công thức toán học chuyển đổi giá trị float32 thành int8_t có Scale (S) và Zero-Point (Z).",
        code: `// q = round(real_value / scale) + zero_point
inline int8_t quantize_float_to_int8(float real_val, float scale, int zero_point) {
    int32_t quantized = (int32_t)(roundf(real_val / scale)) + zero_point;
    if (quantized < -128) return -128;
    if (quantized > 127)  return 127;
    return (int8_t)quantized;
}`
    }
];

let currentCsCategory = "all";

function openCheatSheet() {
    document.getElementById("cheatsheet-drawer").classList.add("open");
    document.getElementById("cs-backdrop").classList.add("open");
    renderCheatSheet();
}

function closeCheatSheet() {
    document.getElementById("cheatsheet-drawer").classList.remove("open");
    document.getElementById("cs-backdrop").classList.remove("open");
}

function setCheatSheetCategory(cat) {
    currentCsCategory = cat;
    document.querySelectorAll(".cs-cat-btn").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("cs-cat-" + cat);
    if (btn) btn.classList.add("active");
    renderCheatSheet();
}

function renderCheatSheet() {
    const container = document.getElementById("cs-content-container");
    if (!container) return;
    const query = document.getElementById("cs-search-input").value.trim().toLowerCase();

    container.innerHTML = "";

    const filtered = cheatSheetData.filter(item => {
        const matchCat = currentCsCategory === "all" || item.category === currentCsCategory;
        const matchQuery = !query || 
            item.title.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query) || 
            item.code.toLowerCase().includes(query) ||
            item.tag.toLowerCase().includes(query);
        return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
                Không tìm thấy tài liệu phù hợp với từ khóa "${escapeHtml(query)}".
            </div>
        `;
        return;
    }

    filtered.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = "cs-card";
        card.innerHTML = `
            <div class="cs-card-top">
                <span class="cs-card-title">${escapeHtml(item.title)}</span>
                <span class="cs-card-tag">${escapeHtml(item.tag)}</span>
            </div>
            <div class="cs-card-desc">${escapeHtml(item.desc)}</div>
            <div class="cs-code-block">
                <button class="cs-copy-btn" onclick="copySnippet('cs-snippet-${idx}')">Copy</button>
                <pre id="cs-snippet-${idx}">${escapeHtml(item.code)}</pre>
            </div>
        `;
        container.appendChild(card);
    });
}

function copySnippet(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("📋 Đã sao chép mã nguồn CheatSheet vào Clipboard!");
    });
}
