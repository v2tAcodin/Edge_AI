// ==========================================
// CAPSTONE PROJECTS & ACHIEVEMENT VERIFICATION ENGINE
// ==========================================

const STORAGE_PROJECTS = "mr_thai_projects_progress_v2";

const CAPSTONE_PROJECTS = [
    {
        id: "proj_1_logger",
        stageIndex: 1, // Sau Module 1 & 2
        stageLabel: "Sau Bước 1 & 2",
        icon: "⏱️",
        title: "Dự Án 1: Ghi Dữ Liệu Rung Động Tần Số Cao & Bộ Đệm SRAM Kép",
        englishTitle: "High-Frequency Zero-Jitter Vibration Logger & Dual SRAM Buffer",
        difficulty: "Junior Embedded",
        xp: 300,
        badgeName: "🎖️ SRAM & Timer Pioneer",
        overview: "Thiết kế firmware C định thời chính xác bằng GPTimer ở tần số 1000Hz (chu kỳ 1000µs ± 50ns jitter), thu thập mẫu rung động vào bộ đệm tĩnh căn lề 16-byte alignas(16) trong Internal SRAM, luân chuyển bộ đệm kép Ping-Pong và đánh thức Task nền qua Semaphore.",
        milestones: [
            "Cấu hình GPTimer 1µs tick với bộ chia Prescaler 80 trên xung nhịp 80MHz APB.",
            "Khởi tạo 2 bộ đệm tĩnh buffer_ping[512] và buffer_pong[512] có thuộc tính alignas(16) trong SRAM.",
            "Lập trình hàm ngắt với IRAM_ATTR thực hiện nạp dữ liệu và hoán đổi cờ Ping-Pong không gọi hàm cấm.",
            "Triển khai cơ chế Deferred Processing gửi xSemaphoreGiveFromISR để đánh thức Worker Task.",
            "Đạt kiểm tra độ trễ ngắt dưới 2µs và zero-jitter sampling."
        ],
        architecture: `[GPTimer Hardware Alarm @ 1kHz]
       │ (High-Speed Hardware Interrupt)
       ▼
[IRAM_ATTR Timer ISR] ──────┐
       │ (Toggle Buffer)     │ (Give Binary Semaphore)
       ▼                     ▼
[DMA Ping-Pong Buffer]   [xSemaphoreGiveFromISR]
 (alignas(16) SRAM)          │
                             ▼
                    [Background Worker Task]
                    (SRAM Processing & Logging)`,
        starterCode: `// ==============================================================
// CAPSTONE PROJECT 1: ZERO-JITTER HIGH-FREQ LOGGER (ESP-IDF C)
// ==============================================================
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "driver/gptimer.h"
#include "esp_log.h"

#define BUFFER_SIZE     512
#define SAMPLING_FREQ   1000 // 1000 Hz = 1ms

// Bộ đệm kép căn lề 16-byte trong SRAM
alignas(16) static int16_t buffer_ping[BUFFER_SIZE];
alignas(16) static int16_t buffer_pong[BUFFER_SIZE];
static volatile int active_buf = 0; // 0: ping, 1: pong
static volatile int sample_idx = 0;

static SemaphoreHandle_t s_timer_sem = NULL;

// Hàm ngắt thời gian thực nạp trực tiếp vào IRAM
static bool IRAM_ATTR timer_isr_callback(gptimer_handle_t timer, const gptimer_alarm_event_data_t *edata, void *user_ctx) {
    BaseType_t high_task_awoken = pdFALSE;
    
    // Đọc cảm biến giả lập và lưu vào active buffer
    int16_t raw_sample = (int16_t)(edata->count_value & 0xFFFF);
    if (active_buf == 0) buffer_ping[sample_idx++] = raw_sample;
    else buffer_pong[sample_idx++] = raw_sample;

    // Khi đầy buffer -> hoán đổi ping-pong và gửi semaphore
    if (sample_idx >= BUFFER_SIZE) {
        sample_idx = 0;
        active_buf = 1 - active_buf;
        xSemaphoreGiveFromISR(s_timer_sem, &high_task_awoken);
    }
    return high_task_awoken == pdTRUE;
}

void app_main(void) {
    s_timer_sem = xSemaphoreCreateBinary();
    ESP_LOGI("PROJECT_1", "Khởi tạo High-Frequency Logger hoàn tất.");
}`,
        rubric: [
            "Không sử dụng malloc/free trong ISR hoặc vòng lặp lấy mẫu.",
            "Căn lề bộ đệm đúng chuẩn 16-byte cho SIMD.",
            "Thời gian thực thi hàm ISR dưới 2 micro-giây."
        ]
    },
    {
        id: "proj_2_gesture_dsp",
        stageIndex: 2, // Sau Module 3
        stageLabel: "Sau Bước 3",
        icon: "📡",
        title: "Dự Án 2: Pipeline Thu Thập Cử Động IMU 6-Trục & Phổ FFT",
        englishTitle: "6-Axis IMU Gesture Acquisition & FFT Feature Pipeline",
        difficulty: "Mid-Level Embedded",
        xp: 400,
        badgeName: "🎖️ DSP & Signal Master",
        overview: "Xây dựng pipeline tiền xử lý tín hiệu: Giao tiếp I2C đọc thanh ghi gia tốc kế & con quay hồi chuyển MPU6050 tốc độ 200Hz, giải mã Big-Endian, áp dụng bộ lọc trung bình trượt EMA khử nhiễu rung tay, chuẩn hóa Min-Max và trích xuất vector đặc trưng 16 chiều cho AI.",
        milestones: [
            "Viết I2C Master Driver đọc cụm 14 byte dữ liệu thô (Accel + Gyro) trong 1 giao dịch I2C burst.",
            "Ghép byte Big-Endian thành số nguyên có dấu 16-bit và khử mức DC bias tĩnh.",
            "Cài đặt bộ lọc EMA (Exponential Moving Average) với alpha = 0.2 làm mượt cử chỉ.",
            "Trích xuất 4 vector đặc trưng: Bình phương độ lớn Mag², Zero Crossing Rate, Peak-to-Peak và Năng lượng FFT.",
            "Đóng gói vector đặc trưng 16 phần tử sẵn sàng nạp vào mạng nơ-ron."
        ],
        architecture: `[MPU6050 6-Axis IMU]
       │ (I2C Burst Read 14 Bytes @ 200Hz)
       ▼
[Big-Endian Parser & Sign Extension]
       │
       ▼
[DC Bias Removal & EMA Filter (alpha=0.2)]
       │
       ├──> [Signal Energy: x^2 + y^2 + z^2]
       ├──> [Zero Crossing Rate (ZCR)]
       ├──> [Peak-to-Peak Amplitude]
       └──> [256-point FFT Spectral Energy]
       │
       ▼
[16-Element Normalized Feature Vector]`,
        starterCode: `// ==============================================================
// CAPSTONE PROJECT 2: IMU GESTURE & DSP FEATURE EXTRACTOR
// ==============================================================
#include <stdio.h>
#include <math.h>
#include "esp_log.h"

typedef struct {
    int16_t ax, ay, az;
    int16_t gx, gy, gz;
} imu_raw_data_t;

// Khử DC Bias và lọc EMA
void process_imu_sample(const imu_raw_data_t *raw, float *filtered_mag, float prev_mag) {
    // Ghép và chuẩn hóa tín hiệu
    float x = (float)raw->ax;
    float y = (float)raw->ay;
    float z = (float)raw->az;
    float mag_sq = x*x + y*y + z*z;
    float current_mag = sqrtf(mag_sq);

    // Bộ lọc EMA alpha = 0.2
    *filtered_mag = prev_mag * 0.8f + current_mag * 0.2f;
}`,
        rubric: [
            "Đọc I2C burst 14-byte không ngắt quãng.",
            "Tỷ lệ trích xuất đặc trưng FFT < 5ms mỗi khung 256 mẫu.",
            "Vector đặc trưng đầu ra được chuẩn hóa trong khoảng [0.0, 1.0]."
        ]
    },
    {
        id: "proj_3_multicore_rtos",
        stageIndex: 3, // Sau Module 4
        stageLabel: "Sau Bước 4",
        icon: "⚡",
        title: "Dự Án 3: Kiến Trúc Đa Nhiệm Bất Đối Xứng Core 0 Network vs Core 1 AI",
        englishTitle: "Asymmetric Dual-Core Architecture: Core 0 Network vs Core 1 AI",
        difficulty: "Senior Embedded",
        xp: 500,
        badgeName: "🎖️ FreeRTOS Dual-Core Architect",
        overview: "Tận dụng 2 nhân Xtensa LX7 của ESP32-S3: Ghim Task thu thập dữ liệu & Network trên Core 0, ghim Task suy luận AI nặng trên Core 1. Dữ liệu truyền qua hàng đợi Queue đệm an toàn kết hợp Mutex bảo vệ tài nguyên và Task Watchdog (TWDT) chống treo CPU.",
        milestones: [
            "Tạo telemetry_task ghim vào Core 0 (xTaskCreatePinnedToCore, Prio 3).",
            "Tạo ai_worker_task ghim vào Core 1 (xTaskCreatePinnedToCore, Prio 5).",
            "Thiết lập FreeRTOS Queue đệm an toàn chứa tối đa 10 gói tin sensor.",
            "Áp dụng Mutex bảo vệ biến trạng thái hệ thống dùng chung giữa 2 core.",
            "Đăng ký TWDT (Task Watchdog Timer) cho cả 2 core với ngưỡng timeout 3000ms."
        ],
        architecture: `┌───────────────────────────┐         ┌───────────────────────────┐
│     CORE 0 (PRO_CPU)      │         │     CORE 1 (APP_CPU)      │
│  - Sensor I/O Sampling    │         │  - High-Load AI Inference │
│  - Wi-Fi / MQTT Telemetry │         │  - DSP Feature Transform  │
└─────────────┬─────────────┘         └─────────────▲─────────────┘
              │                                     │
              │       [FreeRTOS Thread-Safe Queue]  │
              └───────────────> [Ring Queue] ───────┘
                                     ▲
                              [Mutex Resource]
                                     ▲
                         [TWDT Watchdog Supervisor]`,
        starterCode: `// ==============================================================
// CAPSTONE PROJECT 3: ASYMMETRIC DUAL-CORE FREERTOS PIPELINE
// ==============================================================
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_task_wdt.h"
#include "esp_log.h"

static QueueHandle_t s_sensor_queue = NULL;

void telemetry_core0_task(void *pvParam) {
    esp_task_wdt_add(NULL);
    while (1) {
        esp_task_wdt_reset();
        // Thu thập dữ liệu và gửi sang Core 1
        int payload = 1234;
        xQueueSend(s_sensor_queue, &payload, portMAX_DELAY);
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

void ai_core1_task(void *pvParam) {
    esp_task_wdt_add(NULL);
    int received = 0;
    while (1) {
        esp_task_wdt_reset();
        if (xQueueReceive(s_sensor_queue, &received, portMAX_DELAY)) {
            // Chạy suy luận AI trên Core 1
        }
    }
}`,
        rubric: [
            "Tách bạch hoàn toàn CPU Core 0 và Core 1.",
            "Không phát sinh Deadlock khi tranh chấp Mutex.",
            "Watchdog TWDT kích hoạt reset an toàn nếu Task AI bị lặp vô tận."
        ]
    },
    {
        id: "proj_4_iot_ota",
        stageIndex: 4, // Sau Module 5
        stageLabel: "Sau Bước 5",
        icon: "🌐",
        title: "Dự Án 4: Giám Sát Công Nghiệp MQTT & Nâng Cấp Model AI Dual-OTA",
        englishTitle: "Industrial MQTT Telemetry & Dual-Slot Secure OTA Model Updater",
        difficulty: "Senior IoT Engineer",
        xp: 600,
        badgeName: "🎖️ Secure IoT & OTA Champion",
        overview: "Xây dựng hệ thống biên công nghiệp: Kết nối Wi-Fi Station bền bỉ với thuật toán Exponential Backoff, truyền bản tin cảnh báo qua MQTT QoS 1, và xây dựng cơ chế nâng cấp từ xa Dual-OTA (2 phân vùng ota_0 và ota_1) tự động rollback nếu firmware mới gặp lỗi.",
        milestones: [
            "Thiết kế bảng phân vùng partitions.csv với 2 slot ota_0 (1.5MB) và ota_1 (1.5MB).",
            "Cài đặt Wi-Fi Event Handler tự động reconnect với thời gian chờ Exponential Backoff.",
            "Đóng gói dữ liệu nhị phân 16-byte gửi qua MQTT Topic factory/edge_node/vibration.",
            "Tải file .bin qua HTTPS OTA, kiểm tra Image Magic Byte 0xE7 và CRC checksum.",
            "Kích hoạt esp_ota_mark_app_valid_cancel_rollback() tự kiểm tra chống brick máy."
        ],
        architecture: `[Industrial Sensor Node]
       │
       ├──> [MQTT Client (QoS 1)] ──> [Cloud Telemetry Broker]
       │
       └──> [HTTPS OTA Client] <─── [Remote Firmware/Model Server]
                   │
                   ▼
       [Flash Storage Partition Map]
       ┌────────────────┬────────────────┬──────────────┐
       │     ota_0      │     ota_1      │     nvs      │
       │ (Running App)  │ (Target Flash) │ (System Cfg) │
       └────────────────┴────────────────┴──────────────┘
                   │
       [Self-Test Verification] ──> Valid: Keep / Fail: Rollback`,
        starterCode: `// ==============================================================
// CAPSTONE PROJECT 4: SECURE DUAL-OTA & MQTT TELEMETRY
// ==============================================================
#include "esp_ota_ops.h"
#include "esp_https_ota.h"
#include "mqtt_client.h"
#include "esp_log.h"

void check_and_validate_boot(void) {
    const esp_partition_t *running = esp_ota_get_running_partition();
    esp_ota_img_states_t ota_state;
    if (esp_ota_get_state_partition(running, &ota_state) == ESP_OK) {
        if (ota_state == ESP_OTA_IMG_PENDING_VERIFY) {
            // Chạy tự kiểm tra cảm biến...
            bool self_test_ok = true;
            if (self_test_ok) {
                esp_ota_mark_app_valid_cancel_rollback();
                ESP_LOGI("OTA", "Firmware mới đã kiểm tra thành công! Xác nhận phiên bản.");
            } else {
                esp_ota_mark_app_invalid_rollback_and_reboot();
            }
        }
    }
}`,
        rubric: [
            "Cấu hình đúng phân vùng Dual-OTA trong partitions.csv.",
            "Kiểm tra tính toàn vẹn gói tin firmware trước khi ghi flash.",
            "Cơ chế rollback tự động phục hồi máy nếu firmware lỗi."
        ]
    },
    {
        id: "proj_5_tinyml_kws",
        stageIndex: 5, // Sau Module 6
        stageLabel: "Sau Bước 6",
        icon: "🤖",
        title: "Dự Án 5: Nhận Diện Từ Khóa Giọng Nói Trực Tiếp (On-Device KWS)",
        englishTitle: "On-Device Keyword Spotting with TFLite Micro & INT8 Audio DSP",
        difficulty: "Edge AI Specialist",
        xp: 700,
        badgeName: "🎖️ TinyML Deep Learning Specialist",
        overview: "Triển khai mô hình học sâu nhận diện giọng nói (Keyword Spotting KWS) chạy trực tiếp 100% offline trên ESP32-S3: Nạp audio từ mic I2S, biến đổi Mel-Spectrogram, nạp vào mô hình Conv1D lượng tử hóa INT8 trên TFLite Micro, suy luận trong Tensor Arena SRAM dưới 15ms.",
        milestones: [
            "Cấu hình I2S DMA lấy mẫu âm thanh 16kHz, 16-bit Mono.",
            "Xây dựng pipeline trích xuất 40 dải Mel-Filterbank Spectrogram trong cửa sổ 1000ms.",
            "Lượng tử hóa Post-Training Quantization (PTQ) mô hình sang INT8 và nhúng vào mảng C.",
            "Khởi tạo Tensor Arena dung lượng 48KB trong Internal SRAM với alignas(16).",
            "Gọi invoke() và áp dụng ngưỡng tin cậy 85% kết hợp bộ đếm xác nhận chống kích hoạt nhầm."
        ],
        architecture: `[I2S Digital Mic @ 16kHz]
       │ (DMA Stream)
       ▼
[Audio Ring Buffer 1000ms]
       │
       ▼
[40-Channel Mel Spectrogram FFT]
       │ (INT8 Quantization)
       ▼
[Tensor Arena (alignas(16) 48KB SRAM)]
       │
       ▼
[TFLite Micro Model Invocation]
       │
       ▼
[Softmax Scores: {Silence, Unknown, Yes, No}]
       │
       ▼ (Confidence Gate >= 85% & Debounce)
[Voice Command Event Dispatched]`,
        starterCode: `// ==============================================================
// CAPSTONE PROJECT 5: TFLITE MICRO KEYWORD SPOTTING (KWS)
// ==============================================================
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include "esp_log.h"

// Tensor arena căn lề 16 byte
constexpr int kTensorArenaSize = 48 * 1024;
alignas(16) static uint8_t tensor_arena[kTensorArenaSize];

extern const unsigned char g_kws_model_data[];

void run_kws_inference(const int8_t *features) {
    const tflite::Model *model = tflite::GetModel(g_kws_model_data);
    tflite::MicroMutableOpResolver<5> resolver;
    resolver.AddConv2D();
    resolver.AddDepthwiseConv2D();
    resolver.AddFullyConnected();
    resolver.AddSoftmax();
    resolver.AddReshape();

    tflite::MicroInterpreter interpreter(model, resolver, tensor_arena, kTensorArenaSize);
    interpreter.AllocateTensors();

    TfLiteTensor *input = interpreter.input(0);
    memcpy(input->data.int8, features, input->bytes);

    if (interpreter.Invoke() == kTfLiteOk) {
        TfLiteTensor *output = interpreter.output(0);
        ESP_LOGI("KWS", "Suy luận thành công. Output size: %d", output->bytes);
    }
}`,
        rubric: [
            "Thời gian suy luận mô hình < 25ms trên ESP32-S3 (240MHz).",
            "Độ chính xác nhận diện từ khóa đạt > 90% trong môi trường thực tế.",
            "Tensor arena nằm hoàn toàn trong Internal SRAM không tràn PSRAM."
        ]
    },
    {
        id: "proj_6_capstone_pdm",
        stageIndex: 5, // Master Capstone
        stageLabel: "Đồ Án Tốt Nghiệp Toàn Diện",
        icon: "👑",
        title: "Dự Án 6: Hệ Thống Bảo Trì Dự Đoán Động Cơ Toàn Diện (Predictive Maintenance)",
        englishTitle: "End-to-End Industrial Predictive Maintenance & Anomaly Detection Edge AI",
        difficulty: "Industrial Capstone Master",
        xp: 1000,
        badgeName: "👑 MASTER EDGE AI ARCHITECT",
        overview: "Đồ án tổng hợp tinh hoa của toàn bộ 6 giai đoạn: Thiết bị Edge AI công nghiệp giám sát rung động động cơ máy bơm. Lấy mẫu 1kHz bằng GPTimer & DMA, chạy lọc DSP, truyền qua FreeRTOS Queue sang Core 1. Core 1 chạy mô hình AutoEncoder tính sai số tái tạo phát hiện hỏng ổ bi/lệch trục trước 2 tuần. Kết quả gửi qua MQTT và hỗ trợ cập nhật mô hình mới qua OTA.",
        milestones: [
            "Tích hợp phần cứng hoàn chỉnh: ESP32-S3 + Cảm biến gia tốc IMU + LED RGB báo trạng thái.",
            "Firmware Core 0: Thu thập rung động 1kHz zero-jitter, quản lý Wi-Fi & MQTT Telemetry.",
            "Firmware Core 1: Chạy mô hình AutoEncoder INT8 đánh giá chỉ số Anomaly Reconstruction Score.",
            "Cảnh báo thông minh: Khi chỉ số bất thường vượt ngưỡng, tự động phát còi báo động và gửi MQTT khẩn.",
            "Cổng bảo trì OTA: Hỗ trợ nạp model trọng số AI mới từ xa qua giao thức đám mây.",
            "Hoàn tất toàn bộ yêu cầu kỹ thuật và nhận Chứng Chỉ Kỹ Sư Trưởng Edge AI."
        ],
        architecture: `┌────────────────────────────────────────────────────────────────────────┐
│             END-TO-END PREDICTIVE MAINTENANCE EDGE AI SYSTEM            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
[CORE 0: TELEMETRY & HARDWARE]                  [CORE 1: TINYML ANOMALY ENGINE]
 1. GPTimer 1kHz Sampling                       1. AutoEncoder INT8 Deep Model
 2. Ring DMA Ping-Pong Buffer                   2. Reconstruction Error Metric
 3. Wi-Fi Reconnect & MQTT Client               3. Anomaly Threshold Detection
 4. Dual-OTA Firmware Updater                   4. LED Alarm & Health Dispatcher
    └───────────────────────────────┬───────────────────────────────┘
                                    │
                                    ▼
       [Zero-Downtime Smart Industrial Factory • ISO 10816 Standard]`,
        starterCode: `// ==============================================================
// CAPSTONE MASTER PROJECT: END-TO-END PREDICTIVE MAINTENANCE
// ==============================================================
#include <stdio.h>
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

typedef struct {
    float vibration_rms;
    float peak_freq;
    int anomaly_score;
    bool is_critical;
} machine_health_report_t;

void evaluate_machine_condition(machine_health_report_t *report) {
    ESP_LOGI("PDM_CAPSTONE", "=== BÁO CÁO SỨC KHỎE ĐỘNG CƠ CÔNG NGHIỆP ===");
    ESP_LOGI("PDM_CAPSTONE", "Vibration RMS: %.2f mm/s", report->vibration_rms);
    ESP_LOGI("PDM_CAPSTONE", "Peak Frequency: %.1f Hz", report->peak_freq);
    ESP_LOGI("PDM_CAPSTONE", "Anomaly Score: %d / 100", report->anomaly_score);
    
    if (report->anomaly_score > 75) {
        report->is_critical = true;
        ESP_LOGE("PDM_CAPSTONE", "🚨 CẢNH BÁO: Phát hiện bất thường vòng bi máy! Cần bảo trì.");
    } else {
        report->is_critical = false;
        ESP_LOGI("PDM_CAPSTONE", "✓ Động cơ hoạt động bình thường theo tiêu chuẩn ISO 10816.");
    }
}`,
        rubric: [
            "Tích hợp đủ cả 6 giai đoạn: Bộ nhớ, Timer ISR, Sensor DSP, Dual-Core RTOS, Network OTA, TinyML.",
            "Hệ thống vận hành liên tục không sụt áp hoặc rò rỉ bộ nhớ.",
            "Tự động gửi bản tin cảnh báo lên MQTT broker khi phát hiện rung động bất thường."
        ]
    }
];

let projectsProgress = {};

function initProjectsState() {
    try {
        const saved = localStorage.getItem(STORAGE_PROJECTS);
        if (saved) {
            projectsProgress = JSON.parse(saved);
        } else {
            projectsProgress = {};
        }
    } catch (e) {
        projectsProgress = {};
    }

    // Đảm bảo mọi project đều có state
    CAPSTONE_PROJECTS.forEach(p => {
        if (!projectsProgress[p.id]) {
            projectsProgress[p.id] = {
                completed: false,
                milestones: new Array(p.milestones.length).fill(false),
                completedDate: null
            };
        }
    });
}

function saveProjectsState() {
    try {
        localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projectsProgress));
    } catch (e) {
        console.error("Lỗi lưu trạng thái projects:", e);
    }
}

// ==========================================
// RENDER PROJECTS VIEW
// ==========================================
function renderProjectsView() {
    initProjectsState();

    const container = document.getElementById("projects-grid-container");
    if (!container) return;
    container.innerHTML = "";

    let totalCompleted = 0;
    let totalXpEarned = 0;

    CAPSTONE_PROJECTS.forEach(proj => {
        const prog = projectsProgress[proj.id] || { completed: false, milestones: [] };
        if (prog.completed) {
            totalCompleted++;
            totalXpEarned += proj.xp;
        }

        const card = document.createElement("div");
        card.className = `project-card ${prog.completed ? 'completed' : ''}`;
        card.id = `card-${proj.id}`;

        const doneMilestones = (prog.milestones || []).filter(Boolean).length;
        const totalMilestones = proj.milestones.length;
        const percent = Math.round((doneMilestones / totalMilestones) * 100);

        card.innerHTML = `
            <div class="project-card-header">
                <div class="project-title-group">
                    <div class="project-badge-icon">${proj.icon}</div>
                    <div>
                        <div class="project-title-text">${proj.title}</div>
                        <div class="project-subtitle-text">${proj.englishTitle}</div>
                    </div>
                </div>
                <div class="project-tags-group">
                    <span class="project-chip">${proj.stageLabel}</span>
                    <span class="project-chip">${proj.difficulty}</span>
                    <span class="project-chip project-chip-gold">+${proj.xp} XP</span>
                    ${prog.completed ? `<span class="project-chip project-chip-green">✓ ĐÃ ĐẠT CHỨNG NHẬN</span>` : ''}
                </div>
            </div>

            <div class="project-overview">
                ${proj.overview}
            </div>

            <div class="project-milestones-box">
                <div class="milestones-header">
                    <span>🎯 Tiêu Chí Kiểm Tra Thành Tựu (${doneMilestones}/${totalMilestones} Đạt - ${percent}%)</span>
                    <span style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--gold);">${proj.badgeName}</span>
                </div>
                <div class="milestones-list">
                    ${proj.milestones.map((m, mIdx) => {
                        const isChecked = prog.milestones && prog.milestones[mIdx];
                        return `
                            <label class="milestone-item ${isChecked ? 'checked' : ''}">
                                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleProjectMilestone('${proj.id}', ${mIdx})">
                                <span>${m}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="project-actions-bar">
                <div class="project-actions-left">
                    <button type="button" class="btn btn-secondary" style="font-size: 11.5px; padding: 6px 12px;" onclick="openProjectDetailsModal('${proj.id}')">
                        📐 Kiến Trúc & Code Mẫu
                    </button>
                    <button type="button" class="btn btn-secondary" style="font-size: 11.5px; padding: 6px 12px; color: var(--cyan); border-color: rgba(0,240,255,0.3);" onclick="askAiAboutProject('${proj.id}')">
                        🤖 Nhờ Gemini Hướng Dẫn ↗
                    </button>
                </div>
                <div class="project-actions-right">
                    ${prog.completed ? `
                        <button type="button" class="btn btn-accent" style="font-size: 11.5px; padding: 6px 12px; background: rgba(0, 255, 157, 0.2); border-color: var(--green); color: #fff;" onclick="showProjectCertificate('${proj.id}')">
                            📜 Xem Chứng Chỉ Thành Tựu
                        </button>
                    ` : `
                        <button type="button" class="btn btn-accent" style="font-size: 11.5px; padding: 6px 12px;" onclick="verifyProjectAchievement('${proj.id}')">
                            🚀 Nghiệm Thu & Xác Thực (+${proj.xp} XP)
                        </button>
                    `}
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Cập nhật thống kê trên đầu view
    const completedEl = document.getElementById("projects-stat-completed");
    if (completedEl) completedEl.innerText = `${totalCompleted}/${CAPSTONE_PROJECTS.length}`;

    const xpEl = document.getElementById("projects-stat-xp");
    if (xpEl) xpEl.innerText = `${totalXpEarned} XP`;

    const tabBadge = document.getElementById("tab-projects-count");
    if (tabBadge) tabBadge.innerText = `${totalCompleted}/${CAPSTONE_PROJECTS.length}`;

    const portalStat = document.getElementById("portal-projects-stat");
    if (portalStat) portalStat.innerText = `${totalCompleted}/${CAPSTONE_PROJECTS.length} Dự Án Hoàn Thành`;
}

function toggleProjectMilestone(projId, milestoneIdx) {
    initProjectsState();
    if (!projectsProgress[projId]) return;
    
    projectsProgress[projId].milestones[milestoneIdx] = !projectsProgress[projId].milestones[milestoneIdx];
    saveProjectsState();
    renderProjectsView();
}

function verifyProjectAchievement(projId) {
    initProjectsState();
    const proj = CAPSTONE_PROJECTS.find(p => p.id === projId);
    if (!proj) return;

    const prog = projectsProgress[projId];
    const totalMilestones = proj.milestones.length;
    const doneMilestones = (prog.milestones || []).filter(Boolean).length;

    if (doneMilestones < totalMilestones) {
        showToast(`⚠️ Bạn cần hoàn thành tất cả ${totalMilestones} tiêu chí nghiệm thu trước khi xác thực thành tựu! (${doneMilestones}/${totalMilestones} đã đạt)`);
        return;
    }

    if (!prog.completed) {
        prog.completed = true;
        prog.completedDate = new Date().toLocaleDateString('vi-VN');
        saveProjectsState();

        // Cộng XP vào Profile
        if (typeof profile !== 'undefined') {
            profile.xp = (profile.xp || 0) + proj.xp;
            if (typeof saveState === 'function') saveState();
        }

        renderProjectsView();
        showProjectCertificate(projId);
        showToast(`🎉 XÁC THỰC THÀNH TỰU! Nhận thành công ${proj.badgeName} và +${proj.xp} XP!`);
        // Play triumphant level-up fanfare for major achievement
        if (typeof AudioEngine !== 'undefined') AudioEngine.playSFX('levelup');
    } else {
        showProjectCertificate(projId);
    }
}

let currentActiveProjectModal = null;

function openProjectDetailsModal(projId) {
    const proj = CAPSTONE_PROJECTS.find(p => p.id === projId);
    if (!proj) return;
    currentActiveProjectModal = proj;

    const modal = document.getElementById("project-details-modal");
    if (!modal) return;

    document.getElementById("pdm-title").innerText = `${proj.icon} ${proj.title}`;
    document.getElementById("pdm-badge").innerText = proj.badgeName;
    document.getElementById("pdm-xp").innerText = `+${proj.xp} XP`;
    document.getElementById("pdm-overview").innerText = proj.overview;
    document.getElementById("pdm-arch").innerText = proj.architecture;
    document.getElementById("pdm-code").innerText = proj.starterCode;

    const rubricList = document.getElementById("pdm-rubric-list");
    if (rubricList) {
        rubricList.innerHTML = proj.rubric.map(r => `<li>${r}</li>`).join('');
    }

    modal.classList.add("active");
}

function closeProjectDetailsModal() {
    const modal = document.getElementById("project-details-modal");
    if (modal) modal.classList.remove("active");
}

function askAiAboutProject(projId) {
    const proj = CAPSTONE_PROJECTS.find(p => p.id === projId);
    if (!proj) return;

    if (typeof switchTab === 'function') switchTab('notebook');

    const inputEl = document.getElementById("nb-chat-input");
    if (inputEl) {
        inputEl.value = `Tôi đang thực hiện "${proj.title}" (${proj.englishTitle}) trong mô-đun Dự án kiểm tra thành tựu Edge AI. Hãy đóng vai trò Kỹ sư trưởng Edge AI hướng dẫn tôi: 1. Kiến trúc hệ thống và luồng xử lý phần cứng ESP32-S3, 2. Khung code C/C++ chuẩn sản xuất kèm xử lý ngắt và RTOS, 3. Các cạm bẫy kỹ thuật (memory leak, deadlock, jitter) cần phòng tránh để đạt chuẩn nghiệm thu "${proj.badgeName}".`;
        inputEl.focus();
    }
    showToast(`🤖 Đã nạp yêu cầu hướng dẫn đồ án "${proj.title}" vào Sổ Tay AI!`);
}

function showProjectCertificate(projId) {
    const proj = CAPSTONE_PROJECTS.find(p => p.id === projId);
    if (!proj) return;
    initProjectsState();

    const prog = projectsProgress[projId] || {};
    const dateStr = prog.completedDate || new Date().toLocaleDateString('vi-VN');

    const modal = document.getElementById("project-cert-modal");
    if (!modal) return;

    document.getElementById("cert-proj-title").innerText = proj.title;
    document.getElementById("cert-badge-name").innerText = proj.badgeName;
    document.getElementById("cert-date").innerText = `Cấp ngày: ${dateStr}`;
    document.getElementById("cert-id").innerText = `Mã xác thực: CAPSTONE-${proj.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    modal.classList.add("active");
}

function closeCertificateModal() {
    const modal = document.getElementById("project-cert-modal");
    if (modal) modal.classList.remove("active");
}

// Expose ra window
window.CAPSTONE_PROJECTS = CAPSTONE_PROJECTS;
window.renderProjectsView = renderProjectsView;
window.toggleProjectMilestone = toggleProjectMilestone;
window.verifyProjectAchievement = verifyProjectAchievement;
window.openProjectDetailsModal = openProjectDetailsModal;
window.closeProjectDetailsModal = closeProjectDetailsModal;
window.askAiAboutProject = askAiAboutProject;
window.showProjectCertificate = showProjectCertificate;
window.closeCertificateModal = closeCertificateModal;
