/**
 * Project Thai: Engineering Living Portfolio & Cybernetic Skill Tree Data Core
 * Single source of truth for Thai's professional portfolio, projects, benchmarks, and 3D constellation.
 */

(function(root) {
    'use strict';

    const PortfolioData = {
        // -------------------------------------------------------------
        // 1. ENGINEER PROFILE & CORE IDENTITY
        // -------------------------------------------------------------
        engineerProfile: {
            name: "Thai",
            fullName: "Kỹ Sư Thai",
            callSign: "ARCHITECT // THAI",
            title: "Embedded Systems & Edge AI Engineer",
            tagline: "Bridging Silicon, Real-Time Firmware & On-Device Neural Intelligence.",
            bio: "Kỹ sư chuyên sâu về Hệ thống nhúng (ESP32-S3, FreeRTOS, C/C++) và Trí tuệ nhân tạo biên (TinyML, Edge AI). Theo đuổi triết lý kỷ luật, làm chủ phần cứng vi điều khiển cấp thấp, tối ưu hóa bộ nhớ và triển khai các mô hình mạng nơ-ron lượng tử hóa hiệu năng cao trực tiếp trên thiết bị biên không phụ thuộc điện toán đám mây.",
            status: "OPEN FOR ENGINEERING CHALLENGES",
            statusColor: "#00ff88",
            location: "Ho Chi Minh City, Vietnam",
            github: "https://github.com/v2tAcodin",
            email: "contact@thai-engineer.dev",
            avatarUrl: "assets/avatar.png",
            
            // 4 Core Competency Pillars for Skills Radar Matrix
            skillsRadar: [
                {
                    pillar: "Embedded Core & Firmware",
                    score: 95,
                    description: "C/C++, ESP-IDF, FreeRTOS, Bare-metal, Register Mapping, Interrupts, DMA, Memory Profiling"
                },
                {
                    pillar: "Edge AI & TinyML",
                    score: 90,
                    description: "INT8 Quantization, TFLite Micro, ESP-NN, MobileNet, KWS, Autoencoder, Pruning"
                },
                {
                    pillar: "Hardware & Protocols",
                    score: 88,
                    description: "SPI, I2C, UART, I2S, LoRaWAN SX1262, BLE 5.0, Wi-Fi 802.11, Logic Analyzer, KiCad"
                },
                {
                    pillar: "System Optimization",
                    score: 92,
                    description: "Xtensa PIE SIMD Assembly, Cache Coherency, PSRAM Alignment, Low-Power Deep Sleep"
                }
            ],

            principles: [
                { title: "Zero Waste Memory", desc: "Tối ưu từng byte SRAM và Flash, nói không với cấp phát động không kiểm soát." },
                { title: "Real-Time Determinism", desc: "Đảm bảo độ trễ phản hồi xác định, ngắt cứng chính xác theo chu kỳ microsecond." },
                { title: "Air-Gapped Intelligence", desc: "Mô hình AI phải suy luận độc lập tại biên, an toàn và bảo mật 100% dữ liệu." }
            ]
        },

        // -------------------------------------------------------------
        // 2. SHOWCASE PROJECTS (6 CORE PRODUCTION ARTIFACTS)
        // -------------------------------------------------------------
        projects: [
            {
                id: "esp32-s3-vision-guard",
                title: "ESP32-S3 TinyML Vision Guard",
                category: "vision",
                status: "Completed",
                badgeColor: "#00ff88",
                summary: "Hệ thống camera giám sát thông minh nhận diện đối tượng thời gian thực trên vi điều khiển ESP32-S3 sử dụng cảm biến OV2640 và mô hình MobileNet v1 INT8 lượng tử hóa, đạt tốc độ 15.1 FPS không phụ thuộc đám mây.",
                tags: ["ESP32-S3", "ESP-NN", "MobileNet INT8", "DMA Camera", "Computer Vision"],
                
                architecture: {
                    problem: "Giám sát an ninh tự động tại các khu vực hẻo lánh không có kết nối Internet. Các camera truyền thống yêu cầu băng thông lớn hoặc truyền về máy chủ trung tâm tiêu tốn nhiều năng lượng.",
                    solution: "Xây dựng luồng xử lý ảnh trực tiếp qua phần cứng DVP/DMA của ESP32-S3, đưa trực tiếp tensor ảnh 160x120 vào mô hình MobileNet INT8 được tối ưu hóa bằng tập lệnh SIMD của chip, phát hiện xâm nhập và kích hoạt cảnh báo cục bộ trong 66ms.",
                    diagram: "[OV2640 Sensor] ---> (DMA DVP Buffer: 160x120) ---> [Tensor Quantizer] ---> [ESP-NN INT8 MobileNet Core] ---> (Bounding Box Filter) ---> [GPIO Alarm / SD Storage]"
                },

                benchmarks: {
                    latency: "66 ms / frame",
                    fps: "15.1 FPS",
                    sramFootprint: "182 KB (Internal SRAM)",
                    flashFootprint: "1.42 MB",
                    quantization: "Full Integer Post-Training (INT8)",
                    accuracy: "89.4% mAP (COCO Person Subset)"
                },

                hardwareBOM: [
                    "ESP32-S3-WROOM-1 (Dual-Core Xtensa LX7 @ 240MHz, 8MB PSRAM)",
                    "OV2640 2-Megapixel Camera Module (DVP Interface)",
                    "MicroSD Card Module (SPI 40MHz for local event capture)",
                    "Ultra-Low Noise 3.3V LDO Voltage Regulator (ME6211)"
                ],

                codeSnippet: {
                    language: "cpp",
                    title: "camera_inference_pipeline.cpp",
                    explanation: "Khởi tạo DMA camera buffer và thực thi inference trực tiếp bằng thư viện ESP-NN tận dụng lệnh SIMD của ESP32-S3.",
                    code: `// ESP32-S3 Camera Frame Inference via ESP-NN SIMD
#include "esp_camera.h"
#include "esp_nn.h"
#include "model_data.h"

esp_err_t run_vision_inference(camera_fb_t *fb, detection_result_t *out_result) {
    if (!fb || fb->format != PIXFORMAT_GRAYSCALE) {
        return ESP_ERR_INVALID_ARG;
    }
    
    int8_t *input_tensor = (int8_t *)fb->buf;
    int8_t *output_tensor = g_model_output_buffer;
    
    // Invoke hardware-accelerated INT8 depthwise convolution
    int64_t t_start = esp_timer_get_time();
    esp_nn_depthwise_conv_s8(
        input_tensor, IN_DIM, IN_DIM, IN_CHANNELS,
        g_filter_weights, OUT_CHANNELS,
        g_bias_data, output_tensor,
        OUT_DIM, OUT_DIM, STRIDE, PADDING
    );
    int64_t t_elapsed = esp_timer_get_time() - t_start;
    
    out_result->latency_us = (uint32_t)t_elapsed;
    out_result->confidence = output_tensor[CLASS_PERSON_IDX];
    return ESP_OK;
}`
                },

                uartLogs: [
                    "[00:00:00.104] [BOOT] ESP-IDF v5.1.2 Bootloader initialized successfully",
                    "[00:00:00.112] [CHIP] ESP32-S3 Xtensa dual-core @ 240MHz | Revision v0.2",
                    "[00:00:00.180] [CAM]  OV2640 Sensor detected via SCCB. DVP DMA transfer rate: 20MHz",
                    "[00:00:00.320] [TINY] Model loaded: MobileNet-V1-INT8 (Size: 1,489,920 bytes)",
                    "[00:00:00.345] [TINY] Accelerators enabled: Xtensa PIE SIMD Instructions active",
                    "[00:00:01.020] [INFR] Frame #0001 processed in 66.2ms | Class: PERSON | Conf: 94.2% | [TRIGGER RELAY]",
                    "[00:00:01.088] [INFR] Frame #0002 processed in 65.8ms | Class: PERSON | Conf: 96.1% | Streaming live",
                    "[00:00:01.155] [INFR] Frame #0003 processed in 66.0ms | Class: BGND   | Conf: 12.3% | Normal"
                ]
            },

            {
                id: "offline-kws-engine",
                title: "Embedded Keyword Spotting (KWS) Engine",
                category: "audio",
                status: "Completed",
                badgeColor: "#00ff88",
                summary: "Bộ nhận diện câu lệnh âm thanh offline thời gian thực sử dụng micro I2S INMP441, trích xuất đặc trưng MFCC trên phần cứng và mô hình 1D Depthwise Separable CNN, độ trễ phản hồi < 42ms.",
                tags: ["I2S INMP441", "MFCC Feature Extractor", "1D CNN", "TinyML Audio", "ESP32-S3"],
                
                architecture: {
                    problem: "Các trợ lý giọng nói truyền thống phụ thuộc đám mây gây lo ngại về quyền riêng tư và không thể hoạt động khi mất kết nối mạng. Cần cơ chế wake-word cục bộ tiêu thụ dưới 50KB RAM.",
                    solution: "Thu âm luồng tín hiệu 16kHz/16-bit qua I2S DMA, áp dụng biến đổi FFT và Mel Filterbank trích xuất ma trận MFCC 40x49 spectrogram, phân loại câu lệnh với mô hình DS-CNN siêu nhẹ.",
                    diagram: "[INMP441 Mic] -(I2S DMA)-> [16kHz Ring Buffer] ---> [Windowing & FFT] ---> [Mel Filterbank 40-ch] ---> [1D DS-CNN] ---> (Wake Word Validated <42ms)"
                },

                benchmarks: {
                    latency: "41.8 ms",
                    sramFootprint: "48.2 KB",
                    flashFootprint: "384 KB",
                    sampleRate: "16.0 kHz (16-bit Mono)",
                    accuracy: "95.2% Top-1 Accuracy (Speech Commands v2)"
                },

                hardwareBOM: [
                    "ESP32-S3 Xiao / ESP32-S3 Core DevKit",
                    "INMP441 Omnidirectional Digital Microphone (I2S Interface)",
                    "WS2812B RGB Feedback Indicator"
                ],

                codeSnippet: {
                    language: "cpp",
                    title: "mfcc_feature_extractor.c",
                    explanation: "Tính toán 40 dải lọc Mel từ phổ công suất FFT sử dụng bảng lượng giác được tính toán sẵn (Precomputed Twiddle Factors).",
                    code: `// Hardware-optimized Mel-Frequency Cepstral Coefficients (MFCC)
#include "esp_dsp.h"
#include "mfcc_engine.h"

void compute_mfcc_frame(int16_t *audio_window, float *out_mfcc_feats) {
    float fft_mag[FFT_SIZE / 2];
    
    // Apply Hanning Window & Run Radix-2 Real FFT
    dsps_wind_hann_f32(g_window_buffer, FRAME_LEN);
    dsps_fft2r_fc32(g_fft_buffer, FFT_SIZE);
    dsps_bit_rev_fc32(g_fft_buffer, FFT_SIZE);
    
    // Mel Filterbank Matrix Multiplication
    for (int m = 0; m < NUM_MEL_BINS; m++) {
        float mel_energy = 0.0f;
        for (int k = g_mel_start[m]; k <= g_mel_end[m]; k++) {
            mel_energy += fft_mag[k] * g_mel_weights[m][k];
        }
        out_mfcc_feats[m] = logf(mel_energy + 1e-6f);
    }
}`
                },

                uartLogs: [
                    "[00:00:00.098] [I2S] INMP441 Microphone configured: 16000Hz, 16-bit, Single Channel",
                    "[00:00:00.140] [DSP] FFT Twiddle tables loaded in SRAM. Mel Filterbank: 40 bands initialized",
                    "[00:00:00.200] [KWS] Model initialized: DS-CNN-Small. Keywords: ['HEY THAI', 'STOP', 'LIGHTS ON']",
                    "[00:00:04.512] [AUDIO] Voice energy threshold detected (RMS: -24dBFS)",
                    "[00:00:04.554] [KWS] Inference complete in 41.8ms | Detected: 'HEY THAI' | Prob: 98.4%",
                    "[00:00:04.556] [EXEC] System awakened! Listening for command payload..."
                ]
            },

            {
                id: "freertos-edge-iot-hub",
                title: "FreeRTOS Industrial Edge IoT Gateway",
                category: "iot",
                status: "Completed",
                badgeColor: "#00ff88",
                summary: "Cổng điều phối và giám sát cảm biến công nghiệp đa nhiệm dựa trên FreeRTOS, tích hợp truyền thông LoRaWAN SX1262 đường dài, Bluetooth LE và chế độ Deep Sleep dòng rò chỉ 12.8 µA.",
                tags: ["FreeRTOS", "LoRaWAN SX1262", "BLE 5.0", "Low Power", "Industrial IoT"],
                
                architecture: {
                    problem: "Giám sát rung động và nhiệt độ thiết bị trong nhà máy rộng hàng nghìn mét vuông không có sóng Wi-Fi/4G. Cần vận hành bằng pin lithium liên tục trên 2 năm.",
                    solution: "Sử dụng FreeRTOS chia sẻ tài nguyên phi xung đột giữa các Task đo lường, Task mã hóa AES-128 và Task phát sóng LoRaWAN. Vi điều khiển chuyển sang chế độ ULP Deep Sleep định kỳ.",
                    diagram: "[RS485 / Modbus Sensors] ---> [FreeRTOS Task: Telemetry] ---> [AES-128 Cipher Engine] ---> [SX1262 LoRa SPI (868/915MHz)] ---> (Cloud Gateway)"
                },

                benchmarks: {
                    sleepCurrent: "12.8 µA (Deep Sleep Mode)",
                    activeCurrent: "24.5 mA (LoRa TX @ +14dBm)",
                    loraRange: "5.4 km (Line of Sight, SF7/BW125)",
                    sramFootprint: "94.6 KB",
                    flashFootprint: "820 KB"
                },

                hardwareBOM: [
                    "ESP32-S3 Mini Module with U.FL External Antenna",
                    "Semtech SX1262 LoRa Transceiver (SPI Interface)",
                    "Texas Instruments BQ24075 Solar Li-Ion Power Management IC",
                    "Industrial MAX485 RS-485 Transceiver"
                ],

                codeSnippet: {
                    language: "c",
                    title: "freertos_gateway_tasks.c",
                    explanation: "Cấu hình hàng đợi dữ liệu FreeRTOS Queue đảm bảo an toàn tuyến tính giữa Task thu thập dữ liệu ngắt và Task truyền sóng LoRa.",
                    code: `// FreeRTOS Inter-Task Communication via Thread-Safe Queue
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/task.h"

static QueueHandle_t xSensorQueue = NULL;

void vSensorAcquisitionTask(void *pvParameters) {
    sensor_packet_t packet;
    for (;;) {
        read_industrial_modbus(&packet);
        xQueueSend(xSensorQueue, &packet, portMAX_DELAY);
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}

void vLoRaTransmissionTask(void *pvParameters) {
    sensor_packet_t tx_packet;
    for (;;) {
        if (xQueueReceive(xSensorQueue, &tx_packet, portMAX_DELAY) == pdTRUE) {
            sx1262_send_encrypted(&tx_packet, sizeof(tx_packet));
            esp_deep_sleep_start();
        }
    }
}`
                },

                uartLogs: [
                    "[00:00:00.082] [RTOS] FreeRTOS Kernel v10.4.3 running on Dual Core Xtensa",
                    "[00:00:00.110] [LORA] Semtech SX1262 detected on SPI2. Frequency: 923.2 MHz",
                    "[00:00:00.150] [PWR]  Battery Fuel Gauge: 4.12V (96%) | Solar Harvester: ACTIVE",
                    "[00:00:05.010] [MODB] Modbus Sensor Read: Temp=42.1°C, Vibration=0.018g, Pressure=3.2bar",
                    "[00:00:05.120] [LORA] Uplink Packet TX (Payload: 24 bytes, RSSI: -92dBm, SNR: +8.5dB)",
                    "[00:00:05.180] [PWR]  Entering ULP Deep Sleep for 300 seconds (Current: 12.8uA)..."
                ]
            },

            {
                id: "acoustic-anomaly-detector",
                title: "Acoustic & Vibration Anomaly Detector",
                category: "dsp",
                status: "In Progress",
                badgeColor: "#ffaa00",
                summary: "Hệ thống bảo trì dự đoán lỗi thiết bị cơ khí bằng phương pháp học không giám sát (Unsupervised Autoencoder INT8), phát hiện dấu hiệu mòn ổ bi qua âm thanh bất thường trước khi hỏng hóc 14 ngày.",
                tags: ["Deep Autoencoder", "Unsupervised Learning", "Audio FFT", "Predictive Maintenance", "TinyML"],
                
                architecture: {
                    problem: "Trong nhà máy cơ khí, vòng bi và động cơ hỏng đột ngột gây tổn thất hàng trăm triệu đồng. Các hệ thống đo rung truyền thống chỉ báo động khi lỗi đã quá nặng.",
                    solution: "Mô hình Autoencoder nén đặc trưng phổ âm thanh 128 chiều thành không gian tiềm ẩn (Latent Space) 16 chiều. Khi máy hoạt động bất thường, sai số tái tạo (Reconstruction Loss) tăng đột biến vượt ngưỡng động.",
                    diagram: "[Acoustic Accelerometer] ---> (512-pt FFT Log-Mel) ---> [Encoder 128->64->16] ---> [Decoder 16->64->128] ---> (Reconstruction MSE > Threshold) ---> [Warning Alert]"
                },

                benchmarks: {
                    reconstructionMSE: "0.038 (Normal) vs 0.142 (Anomaly)",
                    fftWindow: "512-point Hanning Window",
                    sramFootprint: "64.2 KB",
                    flashFootprint: "410 KB",
                    detectionLeadTime: "7 - 14 Days prior to mechanical seizure"
                },

                hardwareBOM: [
                    "ESP32-S3 Custom Edge Board",
                    "TDK InvenSense ICS-40730 High SNR Analog Mic with OPA1678",
                    "TI ADS1115 16-bit ADC (I2C 400kHz)",
                    "Isolated Relay Output Module"
                ],

                codeSnippet: {
                    language: "cpp",
                    title: "autoencoder_anomaly_loss.cpp",
                    explanation: "Tính toán sai số bình phương trung bình (MSE) giữa vector phổ gốc và vector tái tạo để phát hiện bất thường cơ khí.",
                    code: `// Compute Autoencoder Reconstruction Error for Anomaly Detection
#include "esp_nn.h"
#include <math.h>

float calculate_reconstruction_loss(const float *original_spectrogram, const float *reconstructed_spectrogram, size_t length) {
    float total_loss = 0.0f;
    for (size_t i = 0; i < length; i++) {
        float diff = original_spectrogram[i] - reconstructed_spectrogram[i];
        total_loss += diff * diff;
    }
    return total_loss / (float)length;
}

bool evaluate_bearing_health(float loss_value, float baseline_threshold) {
    if (loss_value > baseline_threshold * 1.8f) {
        // Critical Anomaly: Significant bearing raceway spalling detected
        return false;
    }
    return true;
}`
                },

                uartLogs: [
                    "[00:00:00.120] [INIT] High-SNR Acoustic Pipeline initialized at 32kHz sample rate",
                    "[00:00:00.180] [DSP]  512-point FFT engine loaded. Baseline Threshold = 0.0650",
                    "[00:00:03.200] [INFR] Baseline Bearing Analysis: Loss = 0.0382 (HEALTHY - NORMAL OPERATION)",
                    "[00:00:06.400] [INFR] Baseline Bearing Analysis: Loss = 0.0391 (HEALTHY - NORMAL OPERATION)",
                    "[00:00:09.600] [ALERT] High harmonic spike at 2.4kHz! Reconstruction Loss = 0.1428 (ANOMALY DETECTED)",
                    "[00:00:09.610] [ACTION] Trigger Warning LED & Logging Anomaly Event to EEPROM"
                ]
            },

            {
                id: "simd-tensor-accelerator",
                title: "Xtensa PIE SIMD Tensor Math Library",
                category: "dsp",
                status: "Completed",
                badgeColor: "#00ff88",
                summary: "Thư viện toán ma trận và tích chập được tối ưu hóa bằng Assembly nội dòng tận dụng tập lệnh SIMD Processor Instruction Extension (PIE) của ESP32-S3, tăng tốc độ xử lý tensor gấp 3.85 lần.",
                tags: ["Xtensa Assembly", "PIE SIMD", "Low-Level Optimization", "GEMM", "Fast Convolution"],
                
                architecture: {
                    problem: "Các hàm nhân ma trận thông thường viết bằng ngôn ngữ C sử dụng vòng lặp lồng nhau tiêu tốn hàng nghìn chu kỳ xung nhịp CPU, tạo nút thắt cổ chai khi chạy mô hình AI trên vi điều khiển.",
                    solution: "Sử dụng các thanh ghi vector 128-bit chuyên dụng của vi kiến trúc Xtensa LX7, nạp đồng thời 16 phần tử 8-bit và thực hiện nhân cộng song song (Multiply-Accumulate) chỉ trong 1 chu kỳ xung nhịp.",
                    diagram: "[16x int8_t Inputs] + [16x int8_t Weights] ---> [Xtensa 128-bit Vector Registers] ---> (1-Cycle PIE SIMD Dot-Product) ---> [32-bit Accumulated Tensor]"
                },

                benchmarks: {
                    speedup: "3.85x faster than GCC -O3 C implementation",
                    vectorOperations: "16 MAC operations per clock cycle",
                    sramFootprint: "8.4 KB",
                    flashFootprint: "24.0 KB",
                    cpuClock: "240 MHz Dual-Core Xtensa LX7"
                },

                hardwareBOM: [
                    "ESP32-S3 Dual-Core Xtensa LX7 (Instruction Set with PIE support)",
                    "JTAG Debugger ESP-Prog for Hardware Cycle Counter Profiling"
                ],

                codeSnippet: {
                    language: "c",
                    title: "xtensa_simd_dot_prod.S",
                    explanation: "Đoạn code hợp ngữ Xtensa nội dòng thực thi nạp vector 128-bit và nhân cộng tích luỹ trong 1 xung nhịp.",
                    code: `// Xtensa PIE 128-bit SIMD Dot-Product Kernel
#include <xtensa/tie/xt_hifi2.h>

void xtensa_simd_dot_product_s8(const int8_t *a, const int8_t *b, int32_t *acc, int len) {
    // Load 16 bytes simultaneously into vector registers
    __asm__ __volatile__ (
        "ee.vld.128.ip    q0, %0, 16 \\n"
        "ee.vld.128.ip    q1, %1, 16 \\n"
        "ee.vmul.s8.acc   q0, q1     \\n"
        "ee.vst.32.ip     %2, 4      \\n"
        : "+r"(a), "+r"(b), "+r"(acc)
        :
        : "memory"
    );
}`
                },

                uartLogs: [
                    "[00:00:00.088] [BENCH] Initializing Cycle Counter CCOUNT benchmark...",
                    "[00:00:00.120] [BENCH] Running ANSI C 128x128 GEMM: 1,420,110 cycles (5.91 ms)",
                    "[00:00:00.150] [BENCH] Running Xtensa PIE SIMD GEMM: 368,850 cycles (1.53 ms)",
                    "[00:00:00.155] [PERF]  Achieved Speedup Ratio: 3.85x | Zero L1 Cache Misses",
                    "[00:00:00.160] [TEST]  Numerical parity check vs IEEE 754: 100% BIT-EXACT MATCH"
                ]
            },

            {
                id: "imu-tinyml-gesture",
                title: "6-Axis IMU TinyML Gesture Controller",
                category: "imu",
                status: "Architecture Design",
                badgeColor: "#00d4ff",
                summary: "Bộ điều khiển không gian nhận diện cử chỉ bàn tay 3D thời gian thực dựa trên cảm biến quán tính MPU6050 kết hợp mạng nơ-ron đa tầng siêu nhẹ (12KB), phân loại 6 cử chỉ chỉ trong 4.8ms.",
                tags: ["MPU6050 IMU", "Sensor Fusion", "Gesture Classification", "Low-Latency", "TinyML"],
                
                architecture: {
                    problem: "Điều khiển robot hoặc thiết bị AR/VR không tiếp xúc cần độ nhạy microsecond, tiêu thụ điện thấp và kích thước cảm biến siêu nhỏ đeo được trên ngón tay.",
                    solution: "Thu thập 3 trục gia tốc và 3 trục con quay hồi chuyển, lọc bù Kalman khử nhiễu, tính toán độ biến thiên cửa sổ trượt và đưa vào mạng nơ-ron MLP lượng tử hóa.",
                    diagram: "[MPU6050 (Accel + Gyro)] -(I2C 400kHz)-> [Kalman Fusion Filter] ---> [Sliding Feature Window] ---> [Tiny MLP 12KB Model] ---> [BLE HID Gesture Command]"
                },

                benchmarks: {
                    latency: "4.8 ms per gesture evaluation",
                    accuracy: "96.5% across 6 distinct hand gestures",
                    sramFootprint: "18.4 KB",
                    flashFootprint: "65.0 KB",
                    modelSize: "12.8 KB (Quantized FlatBuffer)"
                },

                hardwareBOM: [
                    "Seeed Studio XIAO ESP32-S3 (Finger-sized footprint)",
                    "InvenSense MPU6050 6-Axis MotionTracking Sensor",
                    "3.7V 150mAh LiPo Battery with integrated protection"
                ],

                codeSnippet: {
                    language: "cpp",
                    title: "gesture_inference.cpp",
                    explanation: "Xử lý cửa sổ trượt 50 mẫu IMU và phân loại cử chỉ bàn tay xuất ra bàn phím ảo Bluetooth HID.",
                    code: `// 6-Axis IMU Gesture Classifier
#include "mpu6050_driver.h"
#include "gesture_model.h"

gesture_type_t evaluate_imu_window(const float *imu_window_data) {
    float output_probabilities[NUM_GESTURES];
    
    // Run TinyML Multilayer Perceptron inference
    int status = run_gesture_model(imu_window_data, output_probabilities);
    if (status != 0) return GESTURE_NONE;
    
    int max_idx = 0;
    float max_prob = output_probabilities[0];
    for (int i = 1; i < NUM_GESTURES; i++) {
        if (output_probabilities[i] > max_prob) {
            max_prob = output_probabilities[i];
            max_idx = i;
        }
    }
    
    return (max_prob > 0.85f) ? (gesture_type_t)max_idx : GESTURE_UNCERTAIN;
}`
                },

                uartLogs: [
                    "[00:00:00.090] [I2C]  MPU6050 sensor connected at address 0x68 (Sample rate: 100Hz)",
                    "[00:00:00.120] [CALB] Gyroscope calibration offset calculated: X=-12, Y=8, Z=2",
                    "[00:00:00.160] [TINY] Gesture Model loaded: 12.8 KB FlatBuffer | Classes: 6",
                    "[00:00:02.100] [GEST] Gesture recognized: [SWIPE_RIGHT] | Latency: 4.8ms | Conf: 97.2%",
                    "[00:00:04.220] [GEST] Gesture recognized: [DOUBLE_TAP]  | Latency: 4.6ms | Conf: 98.8%",
                    "[00:00:06.140] [GEST] Gesture recognized: [CIRCLE_CLOCK] | Latency: 4.9ms | Conf: 94.5%"
                ]
            }
        ],

        // -------------------------------------------------------------
        // 3. 3D CYBERNETIC SKILL TREE & CONSTELLATION NODES
        // -------------------------------------------------------------
        skillTreeNodes: [
            // Core Trunk / Root Nodes (Foundations)
            {
                id: "trunk-core",
                name: "Thai Core Discipline",
                type: "core",
                x: 0, y: -40, z: 0,
                color: "#00f0ff",
                radius: 12,
                label: "⚡ C/C++ & Hardware Core"
            },
            // Major Branch 1: Computer Vision
            {
                id: "branch-vision",
                name: "Embedded Vision Branch",
                type: "branch",
                x: -70, y: 10, z: -30,
                color: "#00ff88",
                radius: 8,
                label: "👁️ Vision & Neural Nets",
                parent: "trunk-core"
            },
            // Major Branch 2: Audio & TinyML
            {
                id: "branch-audio",
                name: "Audio DSP & KWS Branch",
                type: "branch",
                x: 70, y: 15, z: -20,
                color: "#ffaa00",
                radius: 8,
                label: "🎙️ Audio DSP & Voice AI",
                parent: "trunk-core"
            },
            // Major Branch 3: FreeRTOS & Industrial IoT
            {
                id: "branch-iot",
                name: "Industrial IoT Branch",
                type: "branch",
                x: -40, y: 55, z: 50,
                color: "#00d4ff",
                radius: 8,
                label: "📡 FreeRTOS & LoRaWAN",
                parent: "trunk-core"
            },
            // Major Branch 4: Low-Level Optimization
            {
                id: "branch-dsp",
                name: "SIMD Optimization Branch",
                type: "branch",
                x: 50, y: 60, z: 40,
                color: "#b026ff",
                radius: 8,
                label: "⚡ Xtensa SIMD & Assembly",
                parent: "trunk-core"
            },
            // Celestial Project Nodes (Fruit of the tree)
            {
                id: "node-esp32-s3-vision-guard",
                projectId: "esp32-s3-vision-guard",
                name: "ESP32-S3 TinyML Vision Guard",
                type: "project",
                x: -110, y: 35, z: -45,
                color: "#00ff88",
                radius: 14,
                label: "ESP32-S3 Vision Guard",
                parent: "branch-vision"
            },
            {
                id: "node-offline-kws-engine",
                projectId: "offline-kws-engine",
                name: "Offline Keyword Spotting Engine",
                type: "project",
                x: 115, y: 40, z: -35,
                color: "#ffaa00",
                radius: 14,
                label: "Offline KWS Engine",
                parent: "branch-audio"
            },
            {
                id: "node-freertos-edge-iot-hub",
                projectId: "freertos-edge-iot-hub",
                name: "FreeRTOS Industrial Gateway",
                type: "project",
                x: -75, y: 95, z: 75,
                color: "#00d4ff",
                radius: 14,
                label: "FreeRTOS Industrial Gateway",
                parent: "branch-iot"
            },
            {
                id: "node-acoustic-anomaly-detector",
                projectId: "acoustic-anomaly-detector",
                name: "Acoustic Anomaly Detector",
                type: "project",
                x: 100, y: 85, z: -5,
                color: "#ffaa00",
                radius: 12,
                label: "Acoustic Anomaly Detector",
                parent: "branch-audio"
            },
            {
                id: "node-simd-tensor-accelerator",
                projectId: "simd-tensor-accelerator",
                name: "Xtensa PIE SIMD Tensor Math",
                type: "project",
                x: 85, y: 105, z: 65,
                color: "#b026ff",
                radius: 14,
                label: "Xtensa SIMD Tensor Math",
                parent: "branch-dsp"
            },
            {
                id: "node-imu-tinyml-gesture",
                projectId: "imu-tinyml-gesture",
                name: "6-Axis IMU Gesture Controller",
                type: "project",
                x: -30, y: 120, z: -60,
                color: "#00d4ff",
                radius: 12,
                label: "IMU Gesture Controller",
                parent: "branch-vision"
            }
        ]
    };

    // Export module cleanly
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioData;
    }
    if (typeof window !== 'undefined') {
        window.PortfolioData = PortfolioData;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
