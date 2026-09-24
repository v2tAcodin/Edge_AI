// ==========================================
// 5. VIRTUAL LAB & HARDWARE SIMULATOR
// ==========================================

const CHIP_SRAM = {
    esp32s3: { name: "ESP32-S3", sram: 320, psram: "Supported (Up to 8MB)" },
    stm32f4: { name: "STM32F401", sram: 96, psram: "None" },
    nrf52840: { name: "nRF52840", sram: 256, psram: "None" },
    rp2040: { name: "RP2040", sram: 264, psram: "None" }
};

let currentChip = "esp32s3";

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
}

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

    updateSramSimulation();
}

function updateSramSimulation() {
    const w = parseInt(document.getElementById("slider-weights").value);
    const inp = parseInt(document.getElementById("slider-input").value);
    const act = parseInt(document.getElementById("slider-act").value);
    const out = parseInt(document.getElementById("slider-output").value);

    document.getElementById("val-weights").innerText = w + " KB";
    document.getElementById("val-input").innerText = inp + " KB";
    document.getElementById("val-act").innerText = act + " KB";
    document.getElementById("val-output").innerText = out + " KB";

    const rawSum = w + inp + act + out;
    const arenaWithOverhead = Math.ceil(rawSum * 1.12); // ~12% tensor metadata & 16-byte alignment
    const chipTotal = CHIP_SRAM[currentChip].sram;
    const percent = Math.min(100, Math.round((arenaWithOverhead / chipTotal) * 100));

    document.getElementById("sim-arena-total").innerText = arenaWithOverhead + " KB";
    const percentEl = document.getElementById("sim-sram-percent");
    percentEl.innerText = percent + "% SRAM";

    const telemSram = document.getElementById("telem-sram-status");
    if (telemSram) {
        telemSram.innerText = `${percent}% Đã dùng (${arenaWithOverhead}/${chipTotal} KB)`;
        telemSram.style.color = percent > 90 ? "#ef4444" : (percent > 65 ? "#f59e0b" : "#10b981");
    }

    // Update Track Bar
    const wPct = (w / chipTotal) * 100;
    const inPct = (inp / chipTotal) * 100;
    const actPct = (act / chipTotal) * 100;
    const outPct = (out / chipTotal) * 100;
    const freePct = Math.max(0, 100 - (wPct + inPct + actPct + outPct));

    document.getElementById("bar-model").style.width = wPct + "%";
    document.getElementById("bar-input").style.width = inPct + "%";
    document.getElementById("bar-act").style.width = actPct + "%";
    document.getElementById("bar-output").style.width = outPct + "%";
    document.getElementById("bar-free").style.width = freePct + "%";

    // Advice & Status
    const box = document.getElementById("sim-sram-advice-box");
    const title = document.getElementById("sim-sram-status-title");
    const desc = document.getElementById("sim-sram-status-desc");

    if (percent > 90) {
        percentEl.style.color = "#ef4444";
        box.style.background = "rgba(239, 68, 68, 0.15)";
        box.style.borderColor = "rgba(239, 68, 68, 0.4)";
        box.style.color = "#fca5a5";
        title.innerText = "🚨 NGUY CƠ TRÀN RAM (OUT OF MEMORY)";
        desc.innerText = `Mô hình chiếm đến ${percent}% SRAM của ${CHIP_SRAM[currentChip].name}! Chắc chắn sẽ bị Crash khi khởi động. Hãy áp dụng Quantization INT8 hoặc gắn thêm PSRAM ngoài.`;
    } else if (percent > 65) {
        percentEl.style.color = "#f59e0b";
        box.style.background = "rgba(245, 158, 11, 0.15)";
        box.style.borderColor = "rgba(245, 158, 11, 0.4)";
        box.style.color = "#fde68a";
        title.innerText = "⚠️ CẢNH BÁO BỘ NHỚ (TIGHT MARGIN)";
        desc.innerText = `Mô hình chiếm ${percent}% SRAM. Dung lượng còn lại khá hẹp, cần cẩn trọng nếu kích hoạt đồng thời Wi-Fi Stack (~45KB) và Bluetooth.`;
    } else {
        percentEl.style.color = "#10b981";
        box.style.background = "rgba(16, 185, 129, 0.1)";
        box.style.borderColor = "rgba(16, 185, 129, 0.3)";
        box.style.color = "#a7f3d0";
        title.innerText = "✅ TRẠNG THÁI: AN TOÀN";
        desc.innerText = `Mô hình chiếm ${percent}% SRAM. Hệ thống còn dư ${chipTotal - arenaWithOverhead} KB SRAM cho RTOS tasks và bộ nhớ đệm mạng.`;
    }

    // Update C code
    const bytesAlloc = arenaWithOverhead * 1024;
    document.getElementById("sim-c-code-snippet").innerText = 
`constexpr int kTensorArenaSize = ${bytesAlloc}; // ${arenaWithOverhead} KB
static uint8_t tensor_arena[kTensorArenaSize] __attribute__((aligned(16)));`;
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
    showToast("Đã nạp preset cấu hình mô hình mẫu!");
}

// ==========================================
// 6. DSP & FFT CANVAS ANIMATION & LIVE MICROPHONE
// ==========================================
let dspFreq = 440;
let dspNoise = 15;
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
        // Tắt micro
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
        statusLabel.innerText = "16,000 Samples/s Synthetic";
        statusLabel.style.color = "#38bdf8";
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
        statusLabel.innerText = "🎙️ LIVE MICROPHONE (REAL HARDWARE AUDIO)";
        statusLabel.style.color = "#10b981";
        showToast("🎙️ Đã kết nối Micro thật! Hãy thử nói hoặc vỗ tay để thấy phổ FFT.");
    } catch (err) {
        alert("Không thể truy cập Micro: " + err.message);
        isLiveMicActive = false;
    }
}

function updateDspParams() {
    dspFreq = parseInt(document.getElementById("slider-dsp-freq").value);
    dspNoise = parseInt(document.getElementById("slider-dsp-noise").value);
    document.getElementById("val-dsp-freq").innerText = dspFreq + " Hz";
    document.getElementById("val-dsp-noise").innerText = dspNoise + "%";
}

function toggleDspFilter() {
    dspFilterOn = !dspFilterOn;
    const btn = document.getElementById("btn-toggle-filter");
    const label = document.getElementById("val-dsp-filter");
    if (dspFilterOn) {
        btn.className = "btn btn-secondary";
        label.innerText = "BẬT (Fc = 1.2 kHz)";
    } else {
        btn.className = "btn btn-accent";
        label.innerText = "TẮT (Nhiễu thô)";
    }
}

function setDspPreset(preset) {
    if (isLiveMicActive) toggleLiveMicrophone();

    document.querySelectorAll("#sim-module-dsp .btn-secondary").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("dsp-preset-" + preset);
    if (btn) btn.classList.add("active");

    if (preset === "kws") {
        document.getElementById("slider-dsp-freq").value = 440;
        document.getElementById("slider-dsp-noise").value = 15;
        document.getElementById("dsp-time-status").innerText = "16,000 Samples/s Audio";
    } else if (preset === "imu") {
        document.getElementById("slider-dsp-freq").value = 120;
        document.getElementById("slider-dsp-noise").value = 25;
        document.getElementById("dsp-time-status").innerText = "100 Hz IMU Acceleration";
    } else if (preset === "ecg") {
        document.getElementById("slider-dsp-freq").value = 80;
        document.getElementById("slider-dsp-noise").value = 10;
        document.getElementById("dsp-time-status").innerText = "250 Hz Bio-Medical ECG";
    } else if (preset === "noise") {
        document.getElementById("slider-dsp-freq").value = 50;
        document.getElementById("slider-dsp-noise").value = 65;
        document.getElementById("dsp-time-status").innerText = "50 Hz Power Grid Noise";
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

        // 1. Draw Waveform
        ctxW.fillStyle = "#070b14";
        ctxW.fillRect(0, 0, w, h);

        ctxW.strokeStyle = "#1e293b";
        ctxW.lineWidth = 1;
        ctxW.beginPath();
        ctxW.moveTo(0, h/2); ctxW.lineTo(w, h/2);
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
                const effectiveNoise = dspFilterOn ? noise * 0.3 : noise;
                const wave = Math.sin(normX * (dspFreq / 20) + dspPhase) * 0.6 +
                             Math.sin(normX * (dspFreq / 10) + dspPhase * 1.5) * 0.2 +
                             effectiveNoise;
                const y = (h / 2) + wave * (h * 0.38);
                if (x === 0) ctxW.moveTo(x, y);
                else ctxW.lineTo(x, y);
            }
        }
        ctxW.stroke();

        // 2. Draw FFT Bins
        const fw = cFft.width;
        const fh = cFft.height;
        ctxF.fillStyle = "#070b14";
        ctxF.fillRect(0, 0, fw, fh);

        const bins = 40;
        const barWidth = fw / bins;

        if (isLiveMicActive && liveMicAnalyser) {
            const freqData = new Uint8Array(liveMicAnalyser.frequencyBinCount);
            liveMicAnalyser.getByteFrequencyData(freqData);

            for (let i = 0; i < bins; i++) {
                const freqIdx = Math.floor((i / bins) * (freqData.length * 0.7));
                const mag = freqData[freqIdx] / 255.0;
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

            for (let i = 0; i < bins; i++) {
                let mag = 0;
                if (i === peakBin) mag = 0.85 + Math.sin(dspPhase * 2) * 0.1;
                else if (i === peakBin * 2 && i < bins) mag = 0.45;
                else if (Math.abs(i - peakBin) === 1) mag = 0.35;
                else mag = (Math.random() * (dspNoise / 80)) * (dspFilterOn ? 0.2 : 0.8);

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

        dspAnimId = requestAnimationFrame(loop);
    }
    dspAnimId = requestAnimationFrame(loop);
}

// ==========================================
// 7. FREERTOS DUAL-CORE GANTT ANIMATION
// ==========================================
let rtosMode = "dual"; // "dual" or "single"
let rtosAnimId = null;
let rtosX = 0;

function toggleRtosMode() {
    rtosMode = rtosMode === "dual" ? "single" : "dual";
    const btn = document.getElementById("btn-rtos-mode");
    const label = document.getElementById("rtos-status-label");
    const fpsLabel = document.getElementById("rtos-fps-label");
    const wdtBadge = document.getElementById("rtos-wdt-badge");
    const wdtDesc = document.getElementById("rtos-wdt-desc");

    if (rtosMode === "dual") {
        btn.className = "btn btn-secondary";
        btn.innerText = "🔄 Chuyển sang: Đơn Nhân (Single Core)";
        label.innerText = "🟢 FREERTOS DUAL-CORE MODE (CORE 0: IO • CORE 1: AI INFERENCE)";
        label.style.color = "#10b981";
        fpsLabel.innerText = "0 Jitter • 100% Deterministic";
        fpsLabel.style.color = "#10b981";
        wdtBadge.className = "badge badge-live";
        wdtBadge.innerText = "✓ ACTIVE (NO TIMEOUT)";
        wdtDesc.innerText = "Core 0 không bao giờ bị nghẽn, cảm biến lấy mẫu đúng nhịp.";
    } else {
        btn.className = "btn btn-accent";
        btn.innerText = "🔄 Chuyển sang: Đa Nhân FreeRTOS";
        label.innerText = "🔴 SINGLE-CORE BLOCKING MODE (CPU BỊ NGHẼN KHI AI CHẠY)";
        label.style.color = "#ef4444";
        fpsLabel.innerText = "⚠️ Jitter 80ms • Sensor Lost";
        fpsLabel.style.color = "#ef4444";
        wdtBadge.className = "badge badge-danger";
        wdtBadge.innerText = "🚨 WATCHDOG TIMEOUT WARNING";
        wdtDesc.innerText = "Hàm Invoke() khóa chặt CPU trong 80ms khiến ngắt cảm biến bị mất mẫu!";
    }
}

function startRtosAnimation() {
    if (rtosAnimId) cancelAnimationFrame(rtosAnimId);
    const canvas = document.getElementById("canvas-rtos");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function loop() {
        rtosX = (rtosX + 1.5) % canvas.width;
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = "#070b14";
        ctx.fillRect(0, 0, w, h);

        // Core 0 Row
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.fillText("CORE 0 (IO, Sensor 100Hz, Wi-Fi):", 14, 30);
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

        // Dynamic Queue Level
        const qLevel = rtosMode === "dual" ? (Math.floor(Math.sin(time / 20) * 2) + 3) : 5;
        const qBar = document.getElementById("rtos-queue-bar");
        const qText = document.getElementById("rtos-queue-text");
        if (qBar && qText) {
            qBar.style.width = (qLevel * 20) + "%";
            qBar.style.background = rtosMode === "dual" ? "#38bdf8" : "#ef4444";
            qText.innerText = `${qLevel}/5 Gói` + (rtosMode === "single" ? " (TRÀN ĐỆM)" : "");
        }

        rtosAnimId = requestAnimationFrame(loop);
    }
    rtosAnimId = requestAnimationFrame(loop);
}

function copyCurrentSimulatorCode() {
    const cSnippet = document.getElementById("sim-c-code-snippet");
    if (cSnippet && navigator.clipboard) {
        navigator.clipboard.writeText(cSnippet.innerText).then(() => {
            showToast("Đã sao chép mã nguồn C cấp phát Tensor Arena vào bộ nhớ tạm!");
        }).catch(() => {
            showToast("Đã sao chép mã nguồn C!");
        });
    } else {
        showToast("Đã sao chép mã nguồn C!");
    }
}

window.copyCurrentSimulatorCode = copyCurrentSimulatorCode;
window.loadModelPreset = loadModelPreset;
window.selectSimChip = selectSimChip;
window.switchSimModule = switchSimModule;
window.toggleRtosMode = toggleRtosMode;
window.updateSramSimulation = updateSramSimulation;
