// ==========================================
// 5. VIRTUAL LAB & HARDWARE SIMULATOR (ENHANCED)
// Phòng Thí Nghiệm & Mô Phỏng Phần Cứng Edge AI
// Kèm Sổ Tay Hướng Dẫn Sử Dụng & Thí Nghiệm Thực Hành
// ==========================================

const CHIP_SRAM = {
    esp32s3: { name: "ESP32-S3", sram: 320, psram: "Supported (Up to 8MB Octal)" },
    stm32f4: { name: "STM32F401", sram: 96, psram: "None" },
    nrf52840: { name: "nRF52840", sram: 256, psram: "None" },
    rp2040: { name: "RP2040", sram: 264, psram: "None" }
};

let currentChip = "esp32s3";
let currentQuantMode = "int8"; // "fp32" (4x), "int8" (1x), "int4" (0.5x)
let isSpiramActive = false;

// ==========================================
// SỔ TAY HƯỚNG DẪN THÍ NGHIỆM (LAB MANUAL)
// ==========================================
let activeLabManualTab = "sram";
let isLabManualOpen = false;

function toggleLabManual() {
    isLabManualOpen = !isLabManualOpen;
    const drawer = document.getElementById("sim-lab-manual-drawer");
    const btn = document.getElementById("btn-toggle-lab-manual");
    if (!drawer) return;

    if (isLabManualOpen) {
        drawer.style.display = "block";
        if (btn) {
            btn.className = "btn btn-accent";
            btn.innerHTML = "📖 Sổ Tay Thí Nghiệm (Đang Mở) ▴";
        }
    } else {
        drawer.style.display = "none";
        if (btn) {
            btn.className = "btn btn-secondary";
            btn.innerHTML = "📖 Sổ Tay Hướng Dẫn Thí Nghiệm ▾";
        }
    }
}

function selectLabManualTab(tabKey) {
    activeLabManualTab = tabKey;
    document.querySelectorAll(".sim-manual-tab-btn").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("manual-tab-btn-" + tabKey);
    if (btn) btn.classList.add("active");

    document.querySelectorAll(".sim-manual-content-panel").forEach(p => p.style.display = "none");
    const panel = document.getElementById("manual-panel-" + tabKey);
    if (panel) panel.style.display = "block";
}

/**
 * Tự động thiết lập kịch bản thí nghiệm theo hướng dẫn
 */
function applyLabExperiment(expKey) {
    if (expKey === "exp_sram_mobilenet_oom") {
        switchSimModule("sram");
        selectSimChip("stm32f4");
        setQuantMode("fp32");
        loadModelPreset("vision");
        showToast("🧪 Đã thiết lập Thí nghiệm 1: Mô hình MobileNet FP32 trên STM32F4 (Kích hoạt cảnh báo OOM)!");
    } else if (expKey === "exp_sram_quant_int8") {
        switchSimModule("sram");
        selectSimChip("stm32f4");
        setQuantMode("int8");
        loadModelPreset("vision");
        showToast("🧪 Đã thiết lập Thí nghiệm 2: Lượng tử hóa INT8 tiết kiệm 75% RAM, đưa hệ thống về vùng An Toàn!");
    } else if (expKey === "exp_sram_psram_rescue") {
        switchSimModule("sram");
        selectSimChip("esp32s3");
        setQuantMode("fp32");
        loadModelPreset("vision");
        if (!isSpiramActive) toggleSpiram();
        showToast("🧪 Đã thiết lập Thí nghiệm 3: Cứu mô hình lớn bằng External PSRAM (SPIRAM) trên ESP32-S3!");
    } else if (expKey === "exp_dsp_noise_filter") {
        switchSimModule("dsp");
        setDspPreset("noise");
        dspCutoff = 120;
        const sliderCutoff = document.getElementById("slider-dsp-cutoff");
        if (sliderCutoff) sliderCutoff.value = 120;
        const valCutoff = document.getElementById("val-dsp-cutoff");
        if (valCutoff) valCutoff.innerText = "120 Hz";
        if (!dspFilterOn) toggleDspFilter();
        showToast("🧪 Đã thiết lập Thí nghiệm 4: Lọc triệt tiêu nhiễu điện lưới 50Hz bằng Low-pass Filter 120Hz!");
    } else if (expKey === "exp_dsp_live_mic") {
        switchSimModule("dsp");
        if (!isLiveMicActive) toggleLiveMicrophone();
        showToast("🧪 Đã kết nối Micro thật: Hãy nói 'Hello ESP32' để quan sát phổ tần số FFT giọng nói!");
    } else if (expKey === "exp_rtos_single_freeze") {
        switchSimModule("rtos");
        if (rtosMode === "dual") toggleRtosMode();
        setRtosLatency(110);
        showToast("🧪 Đã kích hoạt Chế độ Đơn Nhân: AI ngốn 110ms làm đơ Core 0, Watchdog báo động và rơi mẫu cảm biến!");
    } else if (expKey === "exp_rtos_dual_parallel") {
        switchSimModule("rtos");
        if (rtosMode === "single") toggleRtosMode();
        setRtosLatency(70);
        showToast("🧪 Đã kích hoạt Chế độ FreeRTOS Đa Nhân: Core 0 đọc cảm biến mượt 0 Jitter, Core 1 chạy AI an toàn!");
    } else if (expKey === "exp_hex_endian_inspect") {
        switchSimModule("hexmem");
        if (typeof selectHexByte === "function") selectHexByte(0);
        showToast("🧪 Đã nhảy vào ô nhớ 0x3FFB0000: Quan sát Magic Header 0xDEADBEEF lưu theo dạng Little-Endian!");
    } else if (expKey === "exp_hex_stack_overflow") {
        switchSimModule("hexmem");
        simulateStackOverflow();
        showToast("🧪 Đã kích hoạt mô phỏng Tràn Ngăn Xếp (Stack Overflow): Stack Canary bị phá vỡ!");
    }
}

// ==========================================
// CHUYỂN MODULE MÔ PHỎNG (SUB-NAVIGATION)
// ==========================================
function switchSimModule(mod) {
    document.getElementById("sim-btn-sram").classList.toggle("active", mod === "sram");
    document.getElementById("sim-btn-dsp").classList.toggle("active", mod === "dsp");
    document.getElementById("sim-btn-rtos").classList.toggle("active", mod === "rtos");
    const btnHex = document.getElementById("sim-btn-hexmem");
    if (btnHex) btnHex.classList.toggle("active", mod === "hexmem");

    document.getElementById("sim-module-sram").style.display = mod === "sram" ? "block" : "none";
    document.getElementById("sim-module-dsp").style.display = mod === "dsp" ? "block" : "none";
    document.getElementById("sim-module-rtos").style.display = mod === "rtos" ? "block" : "none";
    const modHex = document.getElementById("sim-module-hexmem");
    if (modHex) modHex.style.display = mod === "hexmem" ? "block" : "none";

    if (mod === "dsp") startDspAnimation();
    if (mod === "rtos") startRtosAnimation();
    if (mod === "hexmem" && typeof initHexMemoryModule === "function") initHexMemoryModule();

    // Đồng bộ tab Sổ Tay Hướng Dẫn tương ứng
    selectLabManualTab(mod);
}

// ==========================================
// 1. MODULE TENSOR ARENA & SRAM CALCULATOR
// ==========================================
function selectSimChip(chipKey) {
    currentChip = chipKey;
    document.querySelectorAll(".chip-card").forEach(c => c.classList.remove("selected"));
    const card = document.getElementById("chip-" + chipKey);
    if (card) card.classList.add("selected");
    const info = CHIP_SRAM[chipKey];
    document.getElementById("sim-sram-chip-badge").innerText = `${info.name} (${info.sram} KB SRAM)`;

    const telemChip = document.getElementById("telem-chip-name");
    if (telemChip && info) {
        telemChip.innerText = `${info.name} (${info.sram} KB)`;
    }

    // Nếu chip không hỗ trợ PSRAM, tự tắt PSRAM
    const psramToggleWrap = document.getElementById("sim-psram-toggle-wrap");
    if (psramToggleWrap) {
        psramToggleWrap.style.display = (chipKey === "esp32s3") ? "flex" : "none";
    }
    if (chipKey !== "esp32s3" && isSpiramActive) {
        isSpiramActive = false;
        const cb = document.getElementById("cb-spiram");
        if (cb) cb.checked = false;
    }

    updateSramSimulation();
}

function setQuantMode(mode) {
    currentQuantMode = mode;
    document.querySelectorAll(".sim-quant-btn").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn-quant-" + mode);
    if (btn) btn.classList.add("active");
    updateSramSimulation();
}

function toggleSpiram() {
    isSpiramActive = !isSpiramActive;
    const cb = document.getElementById("cb-spiram");
    if (cb) cb.checked = isSpiramActive;
    updateSramSimulation();
}

function updateSramSimulation() {
    const rawW = parseInt(document.getElementById("slider-weights").value);
    const rawInp = parseInt(document.getElementById("slider-input").value);
    const rawAct = parseInt(document.getElementById("slider-act").value);
    const rawOut = parseInt(document.getElementById("slider-output").value);

    // Hệ số theo lượng tử hóa (Float32: 4x, INT8: 1x, INT4: 0.5x)
    let quantFactor = 1.0;
    if (currentQuantMode === "fp32") quantFactor = 4.0;
    else if (currentQuantMode === "int4") quantFactor = 0.5;

    const w = Math.round(rawW * quantFactor);
    const inp = rawInp; // input thường cố định theo sensor
    const act = Math.round(rawAct * (quantFactor >= 1.0 ? quantFactor * 0.75 : quantFactor));
    const out = rawOut;

    document.getElementById("val-weights").innerText = `${w} KB (${currentQuantMode.toUpperCase()})`;
    document.getElementById("val-input").innerText = inp + " KB";
    document.getElementById("val-act").innerText = act + " KB";
    document.getElementById("val-output").innerText = out + " KB";

    const rawSum = w + inp + act + out;
    const arenaWithOverhead = Math.ceil(rawSum * 1.12); // ~12% tensor metadata & 16-byte alignment
    const chipTotal = CHIP_SRAM[currentChip].sram;
    const percent = Math.round((arenaWithOverhead / chipTotal) * 100);

    document.getElementById("sim-arena-total").innerText = arenaWithOverhead + " KB";
    const percentEl = document.getElementById("sim-sram-percent");

    const telemSram = document.getElementById("telem-sram-status");

    // Update Track Bar
    const wPct = Math.min(100, (w / chipTotal) * 100);
    const inPct = Math.min(100 - wPct, (inp / chipTotal) * 100);
    const actPct = Math.min(Math.max(0, 100 - wPct - inPct), (act / chipTotal) * 100);
    const outPct = Math.min(Math.max(0, 100 - wPct - inPct - actPct), (out / chipTotal) * 100);
    const freePct = Math.max(0, 100 - (wPct + inPct + actPct + outPct));

    document.getElementById("bar-model").style.width = wPct + "%";
    document.getElementById("bar-input").style.width = inPct + "%";
    document.getElementById("bar-act").style.width = actPct + "%";
    document.getElementById("bar-output").style.width = outPct + "%";
    document.getElementById("bar-free").style.width = freePct + "%";

    // Advice & Status Box
    const box = document.getElementById("sim-sram-advice-box");
    const title = document.getElementById("sim-sram-status-title");
    const desc = document.getElementById("sim-sram-status-desc");

    if (isSpiramActive && currentChip === "esp32s3") {
        percentEl.style.color = "#a855f7";
        percentEl.innerText = `${percent}% (Đã chuyển sang PSRAM)`;
        box.style.background = "rgba(168, 85, 247, 0.12)";
        box.style.borderColor = "rgba(168, 85, 247, 0.4)";
        box.style.color = "#e9d5ff";
        title.innerText = "⚡ ĐÃ KÍCH HOẠT EXTERNAL PSRAM (8MB SPIRAM)";
        desc.innerText = `Tensor Arena (${arenaWithOverhead} KB) được cấp phát trên External PSRAM qua Octal SPI. SRAM nội (${chipTotal} KB) được giải phóng 100% cho FreeRTOS & Wi-Fi Stack! Lưu ý: Độ trễ truy xuất qua PSRAM chậm hơn SRAM nội ~15-20%.`;
        if (telemSram) {
            telemSram.innerText = `PSRAM Active (${arenaWithOverhead} KB / 8MB)`;
            telemSram.style.color = "#c084fc";
        }
    } else if (percent > 90) {
        percentEl.style.color = "#ef4444";
        percentEl.innerText = percent + "% SRAM";
        box.style.background = "rgba(239, 68, 68, 0.15)";
        box.style.borderColor = "rgba(239, 68, 68, 0.4)";
        box.style.color = "#fca5a5";
        title.innerText = "🚨 NGUY CƠ TRÀN RAM (OUT OF MEMORY)";
        desc.innerText = `Mô hình chiếm đến ${percent}% SRAM của ${CHIP_SRAM[currentChip].name}! Chắc chắn sẽ bị Crash Panic khi khởi động. Hãy chọn chế độ INT8 Quantization hoặc bật External PSRAM.`;
        if (telemSram) {
            telemSram.innerText = `${percent}% ĐÃ DÙNG (NGUY HIỂM)`;
            telemSram.style.color = "#ef4444";
        }
    } else if (percent > 65) {
        percentEl.style.color = "#f59e0b";
        percentEl.innerText = percent + "% SRAM";
        box.style.background = "rgba(245, 158, 11, 0.15)";
        box.style.borderColor = "rgba(245, 158, 11, 0.4)";
        box.style.color = "#fde68a";
        title.innerText = "⚠️ CẢNH BÁO BỘ NHỚ (TIGHT MARGIN)";
        desc.innerText = `Mô hình chiếm ${percent}% SRAM. Dung lượng còn lại khá hẹp (${chipTotal - arenaWithOverhead} KB), cần cẩn trọng nếu kích hoạt đồng thời Wi-Fi Stack (~45KB) và Bluetooth.`;
        if (telemSram) {
            telemSram.innerText = `${percent}% Đã dùng (${arenaWithOverhead}/${chipTotal} KB)`;
            telemSram.style.color = "#f59e0b";
        }
    } else {
        percentEl.style.color = "#10b981";
        percentEl.innerText = percent + "% SRAM";
        box.style.background = "rgba(16, 185, 129, 0.1)";
        box.style.borderColor = "rgba(16, 185, 129, 0.3)";
        box.style.color = "#a7f3d0";
        title.innerText = "✅ TRẠNG THÁI: AN TOÀN";
        desc.innerText = `Mô hình chiếm ${percent}% SRAM. Hệ thống còn dư ${chipTotal - arenaWithOverhead} KB SRAM dồi dào cho RTOS tasks và bộ nhớ đệm mạng.`;
        if (telemSram) {
            telemSram.innerText = `${percent}% Đã dùng (${arenaWithOverhead}/${chipTotal} KB)`;
            telemSram.style.color = "#10b981";
        }
    }

    // Cập nhật Mã C Cấp Phát
    const bytesAlloc = arenaWithOverhead * 1024;
    const cSnippet = document.getElementById("sim-c-code-snippet");
    if (cSnippet) {
        if (isSpiramActive && currentChip === "esp32s3") {
            cSnippet.innerText = 
`// Cấp phát Tensor Arena trong External PSRAM (8MB Octal SPI):
#include "esp_heap_caps.h"
constexpr int kTensorArenaSize = ${bytesAlloc}; // ${arenaWithOverhead} KB
uint8_t *tensor_arena = (uint8_t *)heap_caps_aligned_alloc(16, kTensorArenaSize, MALLOC_CAP_SPIRAM);
if (tensor_arena == NULL) { ESP_LOGE("AI", "Lỗi cấp phát PSRAM!"); }`;
        } else {
            cSnippet.innerText = 
`// Cấp phát Tensor Arena tĩnh trong Internal SRAM (Căn lề 16-byte cho Vector SIMD):
constexpr int kTensorArenaSize = ${bytesAlloc}; // ${arenaWithOverhead} KB (${currentQuantMode.toUpperCase()})
static uint8_t tensor_arena[kTensorArenaSize] __attribute__((aligned(16)));`;
        }
    }
}

function loadModelPreset(type) {
    if (type === "kws") {
        document.getElementById("slider-weights").value = 35;
        document.getElementById("slider-input").value = 4;
        document.getElementById("slider-act").value = 18;
        document.getElementById("slider-output").value = 2;
    } else if (type === "vision") {
        document.getElementById("slider-weights").value = 110;
        document.getElementById("slider-input").value = 30;
        document.getElementById("slider-act").value = 65;
        document.getElementById("slider-output").value = 3;
    } else if (type === "imu") {
        document.getElementById("slider-weights").value = 12;
        document.getElementById("slider-input").value = 2;
        document.getElementById("slider-act").value = 8;
        document.getElementById("slider-output").value = 1;
    }
    updateSramSimulation();
}

// ==========================================
// 2. MODULE TIỀN XỬ LÝ TÍN HIỆU & PHỔ FFT
// ==========================================
let dspFreq = 440;
let dspNoise = 15;
let dspCutoff = 800;
let dspFilterOn = true;
let dspAnimId = null;
let dspPhase = 0;

// Live Microphone Web Audio API
let liveMicAudioCtx = null;
let liveMicStream = null;
let liveMicAnalyser = null;
let isLiveMicActive = false;

async function toggleLiveMicrophone() {
    const btn = document.getElementById("btn-live-mic");
    const statusLabel = document.getElementById("dsp-time-status");

    if (isLiveMicActive) {
        if (liveMicStream) {
            liveMicStream.getTracks().forEach(t => t.stop());
            liveMicStream = null;
        }
        if (liveMicAudioCtx) {
            liveMicAudioCtx.close();
            liveMicAudioCtx = null;
        }
        isLiveMicActive = false;
        if (btn) {
            btn.className = "btn btn-secondary";
            btn.innerHTML = "🎙️ Bật Micro Thật (Live Audio Stream)";
        }
        if (statusLabel) {
            statusLabel.innerText = "16,000 Samples/s Synthetic";
            statusLabel.style.color = "#38bdf8";
        }
        showToast("Đã tắt luồng âm thanh micro thật.");
        return;
    }

    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Trình duyệt không hỗ trợ Web Audio / getUserMedia!");
            return;
        }

        liveMicStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        liveMicAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = liveMicAudioCtx.createMediaStreamSource(liveMicStream);
        
        liveMicAnalyser = liveMicAudioCtx.createAnalyser();
        liveMicAnalyser.fftSize = 256;
        source.connect(liveMicAnalyser);

        isLiveMicActive = true;
        if (btn) {
            btn.className = "btn btn-accent";
            btn.innerHTML = "🛑 Tắt Micro Thật (Đang Thu Âm)";
        }
        if (statusLabel) {
            statusLabel.innerText = "🎙️ LIVE MICROPHONE (REAL HARDWARE AUDIO)";
            statusLabel.style.color = "#10b981";
        }
        showToast("🎙️ Đã kết nối Micro thật! Hãy thử nói hoặc vỗ tay để thấy phổ FFT.");
    } catch (err) {
        alert("Không thể truy cập Micro: " + err.message);
        isLiveMicActive = false;
    }
}

function updateDspParams() {
    const sliderFreq = document.getElementById("slider-dsp-freq");
    const sliderNoise = document.getElementById("slider-dsp-noise");
    const sliderCutoff = document.getElementById("slider-dsp-cutoff");

    if (sliderFreq) dspFreq = parseInt(sliderFreq.value);
    if (sliderNoise) dspNoise = parseInt(sliderNoise.value);
    if (sliderCutoff) dspCutoff = parseInt(sliderCutoff.value);

    const valFreq = document.getElementById("val-dsp-freq");
    const valNoise = document.getElementById("val-dsp-noise");
    const valCutoff = document.getElementById("val-dsp-cutoff");

    if (valFreq) valFreq.innerText = dspFreq + " Hz";
    if (valNoise) valNoise.innerText = dspNoise + "%";
    if (valCutoff) valCutoff.innerText = dspCutoff + " Hz";

    const filterStatus = document.getElementById("val-dsp-filter");
    if (filterStatus) {
        filterStatus.innerText = dspFilterOn ? `BẬT (Fc = ${dspCutoff} Hz)` : "TẮT (Nhiễu thô)";
    }
}

function toggleDspFilter() {
    dspFilterOn = !dspFilterOn;
    const btn = document.getElementById("btn-toggle-filter");
    const label = document.getElementById("val-dsp-filter");
    if (dspFilterOn) {
        if (btn) btn.className = "btn btn-secondary";
        if (label) label.innerText = `BẬT (Fc = ${dspCutoff} Hz)`;
    } else {
        if (btn) btn.className = "btn btn-accent";
        if (label) label.innerText = "TẮT (Nhiễu thô)";
    }
}

function setDspPreset(preset) {
    if (isLiveMicActive) toggleLiveMicrophone();

    document.querySelectorAll("#sim-module-dsp .btn-secondary").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("dsp-preset-" + preset);
    if (btn) btn.classList.add("active");

    const timeStatus = document.getElementById("dsp-time-status");

    if (preset === "kws") {
        document.getElementById("slider-dsp-freq").value = 440;
        document.getElementById("slider-dsp-noise").value = 15;
        if (timeStatus) timeStatus.innerText = "16,000 Samples/s Audio (Nyquist: 8kHz)";
    } else if (preset === "imu") {
        document.getElementById("slider-dsp-freq").value = 120;
        document.getElementById("slider-dsp-noise").value = 25;
        if (timeStatus) timeStatus.innerText = "100 Hz IMU Acceleration (Nyquist: 50Hz)";
    } else if (preset === "ecg") {
        document.getElementById("slider-dsp-freq").value = 80;
        document.getElementById("slider-dsp-noise").value = 10;
        if (timeStatus) timeStatus.innerText = "250 Hz Bio-Medical ECG";
    } else if (preset === "noise") {
        document.getElementById("slider-dsp-freq").value = 50;
        document.getElementById("slider-dsp-noise").value = 65;
        if (timeStatus) timeStatus.innerText = "50 Hz Power Grid Noise + Harmonics";
    }
    updateDspParams();
}

function startDspAnimation() {
    if (dspAnimId) cancelAnimationFrame(dspAnimId);
    const cWave = document.getElementById("canvas-waveform");
    const cFft = document.getElementById("canvas-fft");
    if (!cWave || !cFft) return;

    const ctxW = cWave.getContext("2d");
    const ctxF = cFft.getContext("2d");

    function loop() {
        dspPhase += 0.08;
        const w = cWave.width;
        const h = cWave.height;

        // 1. Draw Waveform x(t)
        ctxW.fillStyle = "#070b14";
        ctxW.fillRect(0, 0, w, h);

        ctxW.strokeStyle = "#1e293b";
        ctxW.lineWidth = 1;
        ctxW.beginPath();
        ctxW.moveTo(0, h / 2); ctxW.lineTo(w, h / 2);
        ctxW.stroke();

        ctxW.strokeStyle = isLiveMicActive ? "#10b981" : "#38bdf8";
        ctxW.lineWidth = 2;
        ctxW.beginPath();

        if (isLiveMicActive && liveMicAnalyser) {
            const timeData = new Uint8Array(liveMicAnalyser.fftSize);
            liveMicAnalyser.getByteTimeDomainData(timeData);
            for (let x = 0; x < w; x++) {
                const dataIdx = Math.floor((x / w) * timeData.length);
                const v = timeData[dataIdx] / 128.0;
                const y = (v * h) / 2;
                if (x === 0) ctxW.moveTo(x, y);
                else ctxW.lineTo(x, y);
            }
        } else {
            for (let x = 0; x < w; x++) {
                const normX = x / w;
                const noise = (Math.random() - 0.5) * (dspNoise / 50);
                const effectiveNoise = dspFilterOn ? noise * 0.25 : noise;
                const wave = Math.sin(normX * (dspFreq / 20) + dspPhase) * 0.6 +
                             Math.sin(normX * (dspFreq / 10) + dspPhase * 1.5) * 0.2 +
                             effectiveNoise;
                const y = (h / 2) + wave * (h * 0.38);
                if (x === 0) ctxW.moveTo(x, y);
                else ctxW.lineTo(x, y);
            }
        }
        ctxW.stroke();

        // 2. Draw FFT Bins X(f)
        const fw = cFft.width;
        const fh = cFft.height;
        ctxF.fillStyle = "#070b14";
        ctxF.fillRect(0, 0, fw, fh);

        const bins = 40;
        const barWidth = fw / bins;
        let detectedPeakHz = 0;
        let maxMag = 0;

        if (isLiveMicActive && liveMicAnalyser) {
            const freqData = new Uint8Array(liveMicAnalyser.frequencyBinCount);
            liveMicAnalyser.getByteFrequencyData(freqData);

            for (let i = 0; i < bins; i++) {
                const freqIdx = Math.floor((i / bins) * (freqData.length * 0.7));
                let mag = freqData[freqIdx] / 255.0;

                // Áp dụng bộ lọc Low-pass số nếu bật
                const binFreq = (i / bins) * 4000;
                if (dspFilterOn && binFreq > dspCutoff) {
                    const attenuation = Math.max(0.05, 1 / (1 + Math.pow(binFreq / dspCutoff, 2)));
                    mag *= attenuation;
                }

                if (mag > maxMag) {
                    maxMag = mag;
                    detectedPeakHz = Math.round(binFreq);
                }

                const barHeight = Math.min(fh - 8, mag * (fh * 0.95));
                const x = i * barWidth;
                const y = fh - barHeight;

                const grad = ctxF.createLinearGradient(0, fh, 0, 0);
                grad.addColorStop(0, "#10b981");
                grad.addColorStop(1, "#38bdf8");

                ctxF.fillStyle = grad;
                ctxF.fillRect(x + 1, y, barWidth - 2, barHeight);
            }
        } else {
            const peakBin = Math.min(bins - 5, Math.floor((dspFreq / 2500) * bins) + 3);
            detectedPeakHz = dspFreq;

            for (let i = 0; i < bins; i++) {
                let mag = 0;
                if (i === peakBin) mag = 0.85 + Math.sin(dspPhase * 2) * 0.08;
                else if (i === peakBin * 2 && i < bins) mag = 0.42; // sóng hài bậc 2
                else if (Math.abs(i - peakBin) === 1) mag = 0.32;
                else mag = (Math.random() * (dspNoise / 80));

                const binFreq = (i / bins) * 2500;
                // Áp dụng bộ lọc Low-pass số
                if (dspFilterOn && binFreq > dspCutoff) {
                    const attenuation = Math.max(0.08, 1 / (1 + Math.pow(binFreq / dspCutoff, 2)));
                    mag *= attenuation;
                }

                const barHeight = Math.min(fh - 10, mag * (fh * 0.9));
                const x = i * barWidth;
                const y = fh - barHeight;

                const grad = ctxF.createLinearGradient(0, fh, 0, 0);
                grad.addColorStop(0, "#a855f7");
                grad.addColorStop(1, "#38bdf8");

                ctxF.fillStyle = grad;
                ctxF.fillRect(x + 1, y, barWidth - 2, barHeight);
            }
        }

        // Cập nhật nhãn Đỉnh phổ
        const peakLabel = document.getElementById("dsp-fft-status");
        if (peakLabel) {
            peakLabel.innerText = `Đỉnh Phổ: ~${detectedPeakHz} Hz ${dspFilterOn ? `(Lọc Fc=${dspCutoff}Hz)` : ''}`;
        }

        dspAnimId = requestAnimationFrame(loop);
    }
    dspAnimId = requestAnimationFrame(loop);
}

// ==========================================
// 3. MODULE FREERTOS DUAL-CORE SCHEDULER
// ==========================================
let rtosMode = "dual"; // "dual" or "single"
let rtosLatency = 70;  // ms
let rtosDroppedCount = 0;
let rtosAnimId = null;
let rtosX = 0;

function toggleRtosMode() {
    rtosMode = (rtosMode === "dual") ? "single" : "dual";
    const btn = document.getElementById("btn-rtos-mode");
    const label = document.getElementById("rtos-status-label");
    const fpsLabel = document.getElementById("rtos-fps-label");
    const wdtBadge = document.getElementById("rtos-wdt-badge");
    const wdtDesc = document.getElementById("rtos-wdt-desc");

    if (rtosMode === "dual") {
        if (btn) {
            btn.className = "btn btn-secondary";
            btn.innerText = "🔄 Đổi Sang: Chế Độ Đơn Nhân (Single-Core)";
        }
        if (label) {
            label.innerText = "🟢 FREERTOS DUAL-CORE MODE (CORE 0: IO • CORE 1: AI INFERENCE)";
            label.style.color = "#10b981";
        }
        if (fpsLabel) {
            fpsLabel.innerText = "0 Jitter • 100% Deterministic";
            fpsLabel.style.color = "#10b981";
        }
        if (wdtBadge) {
            wdtBadge.className = "badge badge-live";
            wdtBadge.innerText = "✓ ACTIVE (NO TIMEOUT)";
        }
        if (wdtDesc) {
            wdtDesc.innerText = "Core 0 không bao giờ bị nghẽn, cảm biến 100Hz lấy mẫu đúng nhịp.";
        }
        rtosDroppedCount = 0;
        updateRtosDroppedUi();
    } else {
        if (btn) {
            btn.className = "btn btn-accent";
            btn.innerText = "🔄 Đổi Sang: Chế Độ Đa Nhân FreeRTOS";
        }
        if (label) {
            label.innerText = "🔴 SINGLE-CORE BLOCKING MODE (CPU BỊ KHÓA CHẶT KHI AI CHẠY)";
            label.style.color = "#ef4444";
        }
        if (fpsLabel) {
            fpsLabel.innerText = `⚠️ Jitter ${rtosLatency}ms • Rơi Mẫu Cảm Biến`;
            fpsLabel.style.color = "#ef4444";
        }
        if (wdtBadge) {
            wdtBadge.className = "badge badge-danger";
            wdtBadge.innerText = "🚨 WATCHDOG TIMEOUT WARNING";
        }
        if (wdtDesc) {
            wdtDesc.innerText = `Hàm Invoke() khóa chặt CPU trong ${rtosLatency}ms khiến ngắt cảm biến bị bỏ sót!`;
        }
    }
}

function setRtosLatency(val) {
    rtosLatency = parseInt(val);
    const slider = document.getElementById("slider-rtos-latency");
    if (slider) slider.value = rtosLatency;
    const valText = document.getElementById("val-rtos-latency");
    if (valText) valText.innerText = rtosLatency + " ms";

    if (rtosMode === "single") {
        const fpsLabel = document.getElementById("rtos-fps-label");
        if (fpsLabel) fpsLabel.innerText = `⚠️ Jitter ${rtosLatency}ms • Rơi Mẫu Cảm Biến`;
    }
}

function resetRtosDroppedSamples() {
    rtosDroppedCount = 0;
    updateRtosDroppedUi();
    showToast("Đã đặt lại bộ đếm mẫu cảm biến bị mất về 0.");
}

function updateRtosDroppedUi() {
    const el = document.getElementById("rtos-dropped-samples");
    if (el) {
        el.innerText = `${rtosDroppedCount} Mẫu Bị Mất`;
        el.style.color = (rtosDroppedCount > 0) ? "#ef4444" : "#10b981";
    }
}

function startRtosAnimation() {
    if (rtosAnimId) cancelAnimationFrame(rtosAnimId);
    const canvas = document.getElementById("canvas-rtos");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let lastDropTime = 0;

    function loop() {
        rtosX = (rtosX + 1.5) % canvas.width;
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = "#070b14";
        ctx.fillRect(0, 0, w, h);

        // Core 0 Row
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.fillText("CORE 0 (IO, Sensor 100Hz, Wi-Fi Stack):", 14, 30);
        ctx.strokeRect(10, 40, w - 20, 45);

        // Core 1 Row
        ctx.fillText(rtosMode === "dual" ? "CORE 1 (Pinned AI Inference Task):" : "CORE 1: [BỊ VÔ HIỆU HÓA TRONG SINGLE-CORE]", 14, 115);
        ctx.strokeRect(10, 125, w - 20, 45);

        // Draw Timeline slices
        const time = Date.now() / 20;

        for (let x = 12; x < w - 22; x += 30) {
            const blockCycle = Math.floor((x + time) / 120) % 2;

            if (rtosMode === "dual") {
                // Core 0 always active reading sensor
                ctx.fillStyle = "#10b981";
                ctx.fillRect(x, 44, 20, 37);

                // Core 1 running heavy AI inference blocks
                if (blockCycle === 0) {
                    ctx.fillStyle = "#a855f7";
                    ctx.fillRect(x, 129, 28, 37);
                } else {
                    ctx.fillStyle = "#334155";
                    ctx.fillRect(x, 129, 28, 37);
                }
            } else {
                // Single core: when AI runs, Core 0 is completely frozen!
                if (blockCycle === 0) {
                    ctx.fillStyle = "#ef4444";
                    ctx.fillRect(x, 44, 28, 37); // Frozen AI execution
                } else {
                    ctx.fillStyle = "#10b981";
                    ctx.fillRect(x, 44, 12, 37); // Brief sensor sampling
                }
                // Core 1 empty
                ctx.fillStyle = "#0f172a";
                ctx.fillRect(x, 129, 28, 37);
            }
        }

        // Tăng mẫu bị mất nếu đang ở single-core và AI đang chạy
        if (rtosMode === "single") {
            const now = Date.now();
            if (now - lastDropTime > 600) {
                lastDropTime = now;
                const droppedInThisCycle = Math.max(1, Math.round(rtosLatency / 20));
                rtosDroppedCount += droppedInThisCycle;
                updateRtosDroppedUi();
            }
        }

        // Dynamic Queue Level
        const qLevel = (rtosMode === "dual") ? (Math.floor(Math.sin(time / 20) * 2) + 3) : 5;
        const qBar = document.getElementById("rtos-queue-bar");
        const qText = document.getElementById("rtos-queue-text");
        if (qBar && qText) {
            qBar.style.width = (qLevel * 20) + "%";
            qBar.style.background = (rtosMode === "dual") ? "#38bdf8" : "#ef4444";
            qText.innerText = `${qLevel}/5 Gói` + (rtosMode === "single" ? " (TRÀN ĐỆM - OVERFLOW)" : "");
        }

        rtosAnimId = requestAnimationFrame(loop);
    }
    rtosAnimId = requestAnimationFrame(loop);
}

// ==========================================
// 4. MODULE HEX MEMORY & STACK OVERFLOW SIM
// ==========================================
function simulateStackOverflow() {
    if (typeof hexBuffer === "undefined") {
        if (typeof initHexMemoryModule === "function") initHexMemoryModule();
    }
    if (typeof hexBuffer !== "undefined") {
        // Phá vỡ Stack Canary tại 0xA0..0xA3
        hexBuffer[0xA0] = 0xFF;
        hexBuffer[0xA1] = 0xAA;
        hexBuffer[0xA2] = 0x55;
        hexBuffer[0xA3] = 0x00;

        // Ghi đè vào Return Address tại 0xEC..0xEF
        hexBuffer[0xEC] = 0x00;
        hexBuffer[0xED] = 0x00;
        hexBuffer[0xEE] = 0x00;
        hexBuffer[0xEF] = 0x00;

        if (typeof renderHexMemoryTable === "function") renderHexMemoryTable();
        if (typeof selectHexByte === "function") selectHexByte(0xA0);

        const alertBox = document.getElementById("hex-overflow-alert");
        if (alertBox) {
            alertBox.style.display = "block";
            alertBox.innerHTML = `
                <div style="font-weight: 800; color: #ef4444; display: flex; align-items: center; gap: 8px;">
                    🚨 GURU MEDITATION PANIC: Stack Canary Corrupted at 0x3FFB00A0!
                </div>
                <div style="font-size: 11.5px; color: #cbd5e1; margin-top: 4px;">
                    Biến cục bộ trong hàm đã ghi đè vượt quá đáy Stack, phá vỡ giá trị Canary chuẩn (<code>0xCAFEBABE</code> thành <code>0x0055AAFF</code>). Hệ điều hành đã kích hoạt <code>vApplicationStackOverflowHook()</code> để dừng hệ thống khẩn cấp!
                </div>
            `;
        }
    }
}

function copyCurrentSimulatorCode() {
    const cSnippet = document.getElementById("sim-c-code-snippet");
    if (cSnippet && navigator.clipboard) {
        navigator.clipboard.writeText(cSnippet.innerText).then(() => {
            showToast("📋 Đã sao chép mã nguồn C cấp phát Tensor Arena!");
        }).catch(() => {
            showToast("📋 Đã sao chép mã nguồn C!");
        });
    } else {
        showToast("📋 Đã sao chép mã nguồn C!");
    }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    updateDspParams();
    updateSramSimulation();
});

// Gắn window APIs
window.copyCurrentSimulatorCode = copyCurrentSimulatorCode;
window.loadModelPreset = loadModelPreset;
window.selectSimChip = selectSimChip;
window.switchSimModule = switchSimModule;
window.toggleRtosMode = toggleRtosMode;
window.setRtosLatency = setRtosLatency;
window.resetRtosDroppedSamples = resetRtosDroppedSamples;
window.updateSramSimulation = updateSramSimulation;
window.setQuantMode = setQuantMode;
window.toggleSpiram = toggleSpiram;
window.toggleDspFilter = toggleDspFilter;
window.updateDspParams = updateDspParams;
window.setDspPreset = setDspPreset;
window.toggleLiveMicrophone = toggleLiveMicrophone;
window.simulateStackOverflow = simulateStackOverflow;
window.toggleLabManual = toggleLabManual;
window.selectLabManualTab = selectLabManualTab;
window.applyLabExperiment = applyLabExperiment;
