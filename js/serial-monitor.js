// ==========================================
// 7. VIRTUAL & REAL WEB SERIAL MONITOR ENGINE
// ==========================================

let realSerialPort = null;
let realSerialReader = null;
let realSerialWriter = null;
let isRealSerialConnected = false;

function switchConsoleTab(tab) {
    const btnTests = document.getElementById("tab-btn-tests");
    const btnSerial = document.getElementById("tab-btn-serial");
    const testGrid = document.getElementById("test-cards-container");
    const testOut = document.getElementById("console-output");
    const serialPanel = document.getElementById("panel-serial-monitor");

    if (tab === "tests") {
        btnTests.classList.add("active");
        btnSerial.classList.remove("active");
        testGrid.style.display = "grid";
        testOut.style.display = "block";
        serialPanel.style.display = "none";
    } else {
        btnTests.classList.remove("active");
        btnSerial.classList.add("active");
        testGrid.style.display = "none";
        testOut.style.display = "none";
        serialPanel.style.display = "block";
    }
}

function appendSerial(text, type = "info") {
    const term = document.getElementById("serial-terminal-logs");
    if (!term) return;
    const line = document.createElement("div");
    line.className = `serial-line serial-${type}`;
    line.innerText = text;
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
}

function clearSerialLog() {
    const term = document.getElementById("serial-terminal-logs");
    if (term) term.innerHTML = '<div class="serial-line serial-dim">--- Màn hình Serial đã được dọn sạch ---</div>';
}

// 1. CHẾ ĐỘ GIẢ LẬP NẠP ESP32 ẢO
function flashVirtualEsp32() {
    clearSerialLog();
    appendSerial("[ESPTOOL] Connecting to ESP32-S3 via COM3 (USB-JTAG)...", "dim");
    
    setTimeout(() => {
        appendSerial("[ESPTOOL] Chip is ESP32-S3 (QFN56) (revision v0.2)", "info");
        appendSerial("[ESPTOOL] Features: Wi-Fi, BLE 5.0, Dual-Core 240MHz, SIMD Vector Units", "info");
        appendSerial("[ESPTOOL] Erasing Flash & Uploading binary (418,240 bytes)... [100%]", "success");
    }, 300);

    setTimeout(() => {
        appendSerial("[ESPTOOL] Leaving... Hard resetting via RTS pin...", "dim");
        appendSerial("----------------------------------------------------------------", "dim");
        appendSerial("rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)", "dim");
        appendSerial("configsip: 0, SPIWP:0xee, clk_drv:0x00,q_drv:0x00,d_drv:0x00", "dim");
        appendSerial("I (240) cpu_start: Pro cpu up. Dual core mode enabled.", "info");
        appendSerial("I (290) cpu_start: Application information: Edge AI & TinyML Firmware v2.5", "info");
    }, 800);

    setTimeout(() => {
        appendSerial("I (360) heap_init: Initializing. Total available SRAM: 320 KB", "info");
        appendSerial("I (420) EdgeAI_Arena: Allocating Tensor Arena: 48,256 bytes static buffer", "success");
        appendSerial("I (510) TFLite_Micro: Model loaded. Tensor Arena 16-byte alignment verified.", "success");
        appendSerial("I (600) FreeRTOS: Sensor task pinned to Core 0 (Priority 2)", "info");
        appendSerial("I (650) FreeRTOS: AI Inference task pinned to Core 1 (Priority 5)", "info");
    }, 1400);

    setTimeout(() => {
        appendSerial("I (850) EdgeAI_Main: Invoking Model Inference...", "info");
        appendSerial("I (920) EdgeAI_Main: Inference latency: 18.4 ms (SIMD hardware accelerated)", "success");
        appendSerial("[OUTPUT TENSOR]: [Class 0: 0.04, Class 1: 0.91, Class 2: 0.05]", "info");
        appendSerial(">>> PREDICTION: KEYWORD_DETECTED (Confidence: 91.0%) <<<", "success");
        showToast("⚡ Nạp code và khởi động ESP32 thành công qua cổng COM3!");
    }, 2100);
}

// 2. CHẾ ĐỘ KẾT NỐI THIẾT BỊ THẬT QUA WEB SERIAL API (CẮM CÁP USB THẬT)
async function toggleRealWebSerial() {
    if (isRealSerialConnected) {
        disconnectRealWebSerial();
        return;
    }

    if (!("serial" in navigator)) {
        alert("Trình duyệt hiện tại không hỗ trợ Web Serial API! Vui lòng sử dụng Google Chrome, Microsoft Edge hoặc Opera trên máy tính.");
        return;
    }

    try {
        appendSerial("[WEB-SERIAL] Đang yêu cầu người dùng chọn cổng COM thiết bị...", "dim");
        realSerialPort = await navigator.serial.requestPort();
        
        await realSerialPort.open({ baudRate: 115200 });
        isRealSerialConnected = true;

        const btn = document.getElementById("btn-real-serial");
        if (btn) {
            btn.className = "btn btn-accent";
            btn.innerHTML = "🔌 Ngắt Kết Nối COM Thật";
        }
        document.getElementById("serial-port-name-label").innerText = "THIẾT BỊ THẬT ĐÃ KẾT NỐI (115200 bps)";
        document.getElementById("serial-port-name-label").style.color = "#10b981";

        appendSerial("✓ ĐÃ KẾT NỐI THÀNH CÔNG VỚI THIẾT BỊ THẬT QUA CỔNG COM USB (115200 Baud)", "success");
        appendSerial("--- Bắt đầu nhận luồng dữ liệu từ bo mạch phần cứng ---", "dim");
        showToast("🔌 Đã kết nối thiết bị nhúng thật qua Web Serial API!");

        // Khởi động luồng đọc dữ liệu
        readRealSerialLoop();

    } catch (err) {
        appendSerial(`[WEB-SERIAL ERROR] Không thể mở cổng: ${err.message}`, "error");
        isRealSerialConnected = false;
    }
}

async function readRealSerialLoop() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = realSerialPort.readable.pipeTo(textDecoder.writable);
    realSerialReader = textDecoder.readable.getReader();

    let buffer = "";
    try {
        while (true) {
            const { value, done } = await realSerialReader.read();
            if (done) break;
            if (value) {
                buffer += value;
                const lines = buffer.split("\n");
                buffer = lines.pop(); // giữ lại phần chưa đủ 1 dòng
                lines.forEach(line => {
                    const cleanLine = line.replace("\r", "");
                    if (cleanLine.includes("E (") || cleanLine.includes("ERROR")) {
                        appendSerial(cleanLine, "error");
                    } else if (cleanLine.includes("W (") || cleanLine.includes("WARN")) {
                        appendSerial(cleanLine, "warn");
                    } else if (cleanLine.includes("I (") || cleanLine.includes("INFO")) {
                        appendSerial(cleanLine, "info");
                    } else {
                        appendSerial(cleanLine, "dim");
                    }
                });
            }
        }
    } catch (err) {
        appendSerial(`[WEB-SERIAL] Mất kết nối đọc: ${err.message}`, "error");
    } finally {
        realSerialReader.releaseLock();
    }
}

async function disconnectRealWebSerial() {
    if (realSerialReader) {
        await realSerialReader.cancel();
    }
    if (realSerialPort) {
        await realSerialPort.close();
    }
    realSerialPort = null;
    realSerialReader = null;
    isRealSerialConnected = false;

    const btn = document.getElementById("btn-real-serial");
    if (btn) {
        btn.className = "btn btn-secondary";
        btn.innerHTML = "🔌 Kết Nối Thiết Bị Thật (USB COM)";
    }
    document.getElementById("serial-port-name-label").innerText = "ESP32-S3 (USB-JTAG/CDC) @ 115200 bps";
    document.getElementById("serial-port-name-label").style.color = "var(--text-muted)";

    appendSerial("[WEB-SERIAL] Đã ngắt kết nối an toàn với cổng COM thiết bị.", "dim");
    showToast("Đã đóng kết nối cổng COM thiết bị thật.");
}

async function sendSerialInput() {
    const input = document.getElementById("serial-cmd-input");
    const cmd = input.value.trim();
    if (!cmd) return;
    appendSerial("> " + cmd, "dim");
    input.value = "";

    // Nếu đang kết nối phần cứng thật, gửi dữ liệu qua Serial thật
    if (isRealSerialConnected && realSerialPort && realSerialPort.writable) {
        try {
            const encoder = new TextEncoder();
            const writer = realSerialPort.writable.getWriter();
            await writer.write(encoder.encode(cmd + "\r\n"));
            writer.releaseLock();
            return;
        } catch (e) {
            appendSerial("[WEB-SERIAL ERROR] Lỗi gửi dữ liệu: " + e.message, "error");
        }
    }

    // Nếu ở chế độ mô phỏng ảo:
    const lower = cmd.toLowerCase();
    if (lower === "help") {
        appendSerial("Các lệnh khả dụng: status, heap, predict, temp, ota, clear", "info");
    } else if (lower === "status") {
        appendSerial("Status: System OK • CPU 0: 12% • CPU 1: 34% • Wi-Fi: Connected", "success");
    } else if (lower === "heap") {
        appendSerial("Free SRAM: 218,440 bytes • Min Free Heap: 198,320 bytes", "info");
    } else if (lower === "predict") {
        appendSerial("Invoking AI Model... Latency: 17.8ms -> Output: NORMAL_OPERATION (96.5%)", "success");
    } else if (lower === "temp") {
        appendSerial("Internal Temp Sensor: 42.6°C • Ambient IMU Temp: 28.1°C", "info");
    } else if (lower === "ota") {
        appendSerial("OTA Check: Partition 'app_0' active. 'app_1' ready for rollback.", "info");
    } else if (lower === "clear") {
        clearSerialLog();
    } else {
        appendSerial(`Lệnh không nhận diện: '${cmd}'. Gõ 'help' để xem danh sách.`, "warn");
    }
}

function handleSerialCommand(e) {
    if (e.key === "Enter") sendSerialInput();
}
