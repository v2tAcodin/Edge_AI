// ==========================================
// 12. HEX MEMORY & STACK FRAME VISUALIZER
// ==========================================

const HEX_BASE_ADDR = 0x3FFB0000;
const HEX_MEM_SIZE = 256; // 16 rows x 16 bytes
let hexBuffer = new Uint8Array(HEX_MEM_SIZE);
let selectedByteOffset = 0;

// Initialize memory buffer with meaningful realistic embedded data
function initHexMemoryData() {
    hexBuffer.fill(0);

    // .data section: 0x00 - 0x2F
    // Magic header: 0xDEADBEEF in Little Endian: EF BE AD DE
    hexBuffer[0] = 0xEF; hexBuffer[1] = 0xBE; hexBuffer[2] = 0xAD; hexBuffer[3] = 0xDE;
    // Baudrate: 115200 (0x0001C200) -> 00 C2 01 00
    hexBuffer[4] = 0x00; hexBuffer[5] = 0xC2; hexBuffer[6] = 0x01; hexBuffer[7] = 0x00;
    // Sensor sample count: 2048 (0x0800) -> 00 08
    hexBuffer[8] = 0x00; hexBuffer[9] = 0x08;
    // Status flag: 0x01
    hexBuffer[10] = 0x01;
    // Padding: 0x00
    hexBuffer[11] = 0x00;
    // Float PI = 3.1415927 -> 0x40490FDB -> DB 0F 49 40
    hexBuffer[12] = 0xDB; hexBuffer[13] = 0x0F; hexBuffer[14] = 0x49; hexBuffer[15] = 0x40;
    // String const: "ESP32S3_TINYML"
    const banner = "ESP32S3_TINYML";
    for (let i = 0; i < banner.length; i++) {
        hexBuffer[16 + i] = banner.charCodeAt(i);
    }

    // .bss section: 0x30 - 0x4F (zero-initialized globals)
    // All zeroes

    // Heap section: 0x50 - 0x9F (Simulated heap chunk with malloc metadata)
    // Chunk header (size = 64 bytes, in-use bit = 1) -> 0x41 0x00 0x00 0x00
    hexBuffer[0x50] = 0x41; hexBuffer[0x51] = 0x00; hexBuffer[0x52] = 0x00; hexBuffer[0x53] = 0x00;
    // Heap payload (e.g. Tensor weights raw bytes)
    for (let i = 0; i < 28; i++) {
        hexBuffer[0x54 + i] = (i * 17 + 23) % 256;
    }

    // Stack section: 0xA0 - 0xFF (grows downwards from 0xFF)
    // Stack Canary at 0xA0: 0xCA 0xFE 0xBA 0xBE (Protection against overflow)
    hexBuffer[0xA0] = 0xCA; hexBuffer[0xA1] = 0xFE; hexBuffer[0xA2] = 0xBA; hexBuffer[0xA3] = 0xBE;
    // Local array in compute_fft(): 4 samples
    hexBuffer[0xB0] = 0x12; hexBuffer[0xB1] = 0x00;
    hexBuffer[0xB2] = 0x45; hexBuffer[0xB3] = 0x00;
    hexBuffer[0xB4] = 0x89; hexBuffer[0xB5] = 0x00;
    hexBuffer[0xB6] = 0x30; hexBuffer[0xB7] = 0x01;
    // Saved Frame Pointer (FP) = 0x3FFB00F0
    hexBuffer[0xE8] = 0xF0; hexBuffer[0xE9] = 0x00; hexBuffer[0xEA] = 0xFB; hexBuffer[0xEB] = 0x3F;
    // Return Address (LR) = 0x400812F0 (In Flash cache)
    hexBuffer[0xEC] = 0xF0; hexBuffer[0xED] = 0x12; hexBuffer[0xEE] = 0x08; hexBuffer[0xEF] = 0x40;
    // main() local variable: status = 0x00000001
    hexBuffer[0xF0] = 0x01; hexBuffer[0xF1] = 0x00; hexBuffer[0xF2] = 0x00; hexBuffer[0xF3] = 0x00;
}

function getMemorySection(offset) {
    if (offset < 0x30) return { name: ".data (Global Init)", css: "sec-data" };
    if (offset < 0x50) return { name: ".bss (Zero Init)", css: "sec-bss" };
    if (offset < 0xA0) return { name: "Heap (Dynamic / malloc)", css: "sec-heap" };
    return { name: "Stack (Call Frames & SP)", css: "sec-stack" };
}

function renderHexMemoryTable() {
    const tableBody = document.getElementById("hex-table-body");
    if (!tableBody) return;

    let html = "";
    for (let row = 0; row < HEX_MEM_SIZE; row += 16) {
        const rowAddr = (HEX_BASE_ADDR + row).toString(16).toUpperCase();
        let bytesHtml = "";
        let asciiHtml = "";

        for (let col = 0; col < 16; col++) {
            const offset = row + col;
            const b = hexBuffer[offset];
            const hexStr = b.toString(16).padStart(2, "0").toUpperCase();
            const sec = getMemorySection(offset);
            const isSelected = (offset === selectedByteOffset) ? "selected" : "";

            bytesHtml += `<span class="hex-byte ${sec.css} ${isSelected}" data-offset="${offset}" onclick="selectHexByte(${offset})">${hexStr}</span> `;

            // ASCII printable 32..126
            if (b >= 32 && b <= 126) {
                asciiHtml += String.fromCharCode(b);
            } else {
                asciiHtml += ".";
            }
        }

        html += `
            <tr>
                <td class="hex-addr">0x${rowAddr}</td>
                <td>${bytesHtml}</td>
                <td class="hex-ascii-col">${escapeHtml(asciiHtml)}</td>
            </tr>
        `;
    }

    tableBody.innerHTML = html;
    updateHexDecoder(selectedByteOffset);
}

function selectHexByte(offset) {
    selectedByteOffset = offset;
    document.querySelectorAll(".hex-byte").forEach(el => {
        el.classList.toggle("selected", parseInt(el.getAttribute("data-offset")) === offset);
    });
    updateHexDecoder(offset);
}

function updateHexDecoder(offset) {
    const addr = (HEX_BASE_ADDR + offset).toString(16).toUpperCase();
    const b0 = hexBuffer[offset];
    const b1 = (offset + 1 < HEX_MEM_SIZE) ? hexBuffer[offset + 1] : 0;
    const b2 = (offset + 2 < HEX_MEM_SIZE) ? hexBuffer[offset + 2] : 0;
    const b3 = (offset + 3 < HEX_MEM_SIZE) ? hexBuffer[offset + 3] : 0;

    // Endianness
    // uint16
    const u16LE = b0 | (b1 << 8);
    const u16BE = (b0 << 8) | b1;

    // uint32
    const u32LE = (b0 | (b1 << 8) | (b2 << 16) | (b3 << 24)) >>> 0;
    const u32BE = ((b0 << 24) | (b1 << 16) | (b2 << 8) | b3) >>> 0;

    // Float32 IEEE 754
    const floatView = new DataView(new ArrayBuffer(4));
    floatView.setUint8(0, b0);
    floatView.setUint8(1, b1);
    floatView.setUint8(2, b2);
    floatView.setUint8(3, b3);
    const f32LE = floatView.getFloat32(0, true);

    const sec = getMemorySection(offset);

    const elAddr = document.getElementById("dec-addr");
    if (elAddr) elAddr.innerText = `0x${addr}`;

    const elHex = document.getElementById("dec-hex");
    if (elHex) elHex.innerText = `0x${b0.toString(16).padStart(2, '0').toUpperCase()}`;

    const elBin = document.getElementById("dec-bin");
    if (elBin) elBin.innerText = b0.toString(2).padStart(8, '0');

    const elChar = document.getElementById("dec-char");
    if (elChar) elChar.innerText = (b0 >= 32 && b0 <= 126) ? `'${String.fromCharCode(b0)}'` : "N/A (Control)";

    const elU16 = document.getElementById("dec-u16");
    if (elU16) elU16.innerText = `LE: ${u16LE} (0x${u16LE.toString(16).toUpperCase()}) • BE: ${u16BE}`;

    const elU32 = document.getElementById("dec-u32");
    if (elU32) elU32.innerText = `LE: ${u32LE} (0x${u32LE.toString(16).toUpperCase()}) • BE: ${u32BE}`;

    const elF32 = document.getElementById("dec-f32");
    if (elF32) elF32.innerText = isNaN(f32LE) ? "NaN" : f32LE.toExponential(4);

    const elSec = document.getElementById("dec-section");
    if (elSec) elSec.innerText = sec.name;
}

// ==========================================
// STACK FRAME STEP-BY-STEP SIMULATION
// ==========================================
let stackCallChain = [
    {
        funcName: "main()",
        sp: "0x3FFB00F4",
        fp: "0x3FFB00F8",
        vars: [
            { name: "int sys_status", val: "1 (OK)" },
            { name: "float threshold", val: "0.85f" }
        ],
        lr: "0x40080100 (bootloader_entry)"
    }
];
let isStackOverflowed = false;

function renderStackFrames() {
    const container = document.getElementById("stack-frames-list");
    if (!container) return;

    if (isStackOverflowed) {
        container.innerHTML = `
            <div class="stack-frame-box overflow-danger">
                <div class="stack-frame-header" style="color: #ef4444;">
                    <span>🚨 GURU MEDITATION ERROR: STACK SMASHING DETECTED!</span>
                </div>
                <div style="font-size: 12px; color: #fca5a5; line-height: 1.6;">
                    <strong>Ngăn xếp (Stack) đã tràn vào Heap và Canary (0x3FFB00A0)!</strong><br>
                    • Con trỏ SP hiện tại đã vượt qua giới hạn cấp phát.<br>
                    • Hệ điều hành ESP-IDF đã ngắt CPU để ngăn chặn tấn công buffer overflow hoặc hỏng dữ liệu.<br>
                    • Khắc phục: Tăng <code>usStackDepth</code> trong <code>xTaskCreate()</code> hoặc chuyển buffer lớn sang biến tĩnh / PSRAM.
                </div>
            </div>
        `;
        return;
    }

    let html = "";
    // Hiển thị từ frame mới nhất xuống
    for (let i = stackCallChain.length - 1; i >= 0; i--) {
        const frame = stackCallChain[i];
        const isTop = (i === stackCallChain.length - 1);

        html += `
            <div class="stack-frame-box">
                <div class="stack-frame-header">
                    <span>⚡ FRAME ${i}: ${frame.funcName}</span>
                    ${isTop ? '<span class="sp-pointer-badge">◄ SP = ' + frame.sp + '</span>' : '<span style="font-size: 10px; color: var(--text-dim);">FP = ' + frame.fp + '</span>'}
                </div>
                <div class="stack-var-row">
                    <span style="color: #94a3b8;">Địa chỉ trả về (LR / PC):</span>
                    <span style="color: #a78bfa;">${frame.lr}</span>
                </div>
                ${frame.vars.map(v => `
                    <div class="stack-var-row">
                        <span style="color: #38bdf8;">${v.name}:</span>
                        <span style="color: #f8fafc; font-weight: 600;">${v.val}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = html;

    const spDisp = document.getElementById("current-sp-display");
    if (spDisp && stackCallChain.length > 0) {
        spDisp.innerText = stackCallChain[stackCallChain.length - 1].sp;
    }
}

function stackPushFunction(step) {
    if (isStackOverflowed) {
        showToast("⚠️ Hệ thống đang ở trạng thái Stack Overflow! Nhấn 'Reset Ngăn Xếp' để khôi phục.");
        return;
    }

    if (step === 1 && stackCallChain.length === 1) {
        stackCallChain.push({
            funcName: "filter_imu_data(raw_x, 0.95f)",
            sp: "0x3FFB00DC",
            fp: "0x3FFB00F4",
            vars: [
                { name: "int raw_x", val: "1024" },
                { name: "float alpha", val: "0.95f" },
                { name: "float prev_filtered", val: "1018.4f" }
            ],
            lr: "0x400812F0 (main + 0x18)"
        });
        showToast("📥 Đã gọi filter_imu_data(): Cấp phát Frame mới, SP giảm 24 bytes!");
    } else if (step === 2 && stackCallChain.length === 2) {
        stackCallChain.push({
            funcName: "compute_fft_peak(window[4])",
            sp: "0x3FFB00B4",
            fp: "0x3FFB00DC",
            vars: [
                { name: "int window[4]", val: "{12, 45, 89, 304}" },
                { name: "float max_freq", val: "42.5 Hz" }
            ],
            lr: "0x400818A4 (filter_imu_data + 0x32)"
        });
        showToast("📥 Đã gọi compute_fft_peak(): Cấp phát Frame con, SP = 0x3FFB00B4!");
    } else if (step === 'overflow') {
        isStackOverflowed = true;
        showToast("💥 GURU MEDITATION ERROR! Đệ quy vô tận làm tràn Stack vào vùng Heap!");
    }
    renderStackFrames();
}

function stackPopFunction() {
    if (isStackOverflowed) {
        resetStackFrames();
        return;
    }
    if (stackCallChain.length <= 1) {
        showToast("ℹ️ Đang ở hàm main(), không thể pop thêm!");
        return;
    }
    const popped = stackCallChain.pop();
    showToast(`📤 Hàm ${popped.funcName} return: Thu hồi vùng nhớ Stack, khôi phục SP!`);
    renderStackFrames();
}

function resetStackFrames() {
    isStackOverflowed = false;
    stackCallChain = [
        {
            funcName: "main()",
            sp: "0x3FFB00F4",
            fp: "0x3FFB00F8",
            vars: [
                { name: "int sys_status", val: "1 (OK)" },
                { name: "float threshold", val: "0.85f" }
            ],
            lr: "0x40080100 (bootloader_entry)"
        }
    ];
    renderStackFrames();
    showToast("↺ Đã reset ngăn xếp về trạng thái ban đầu.");
}

// ==========================================
// HEAP FRAGMENTATION SIMULATOR
// ==========================================
// 16 blocks (32 bytes each = 512 bytes)
let heapBlocks = [
    { id: 0, tag: "A (64B)", size: 2, free: false, name: "Block A (RingBuf)" },
    { id: 1, tag: "A (64B)", size: 2, free: false, name: "Block A (RingBuf)" },
    { id: 2, tag: "B (128B)", size: 4, free: false, name: "Block B (JSON Buff)" },
    { id: 3, tag: "B (128B)", size: 4, free: false, name: "Block B (JSON Buff)" },
    { id: 4, tag: "B (128B)", size: 4, free: false, name: "Block B (JSON Buff)" },
    { id: 5, tag: "B (128B)", size: 4, free: false, name: "Block B (JSON Buff)" },
    { id: 6, tag: "C (64B)", size: 2, free: false, name: "Block C (MQTT Msg)" },
    { id: 7, tag: "C (64B)", size: 2, free: false, name: "Block C (MQTT Msg)" },
    { id: 8, tag: "FREE", size: 1, free: true, name: "Trống (32B)" },
    { id: 9, tag: "FREE", size: 1, free: true, name: "Trống (32B)" },
    { id: 10, tag: "FREE", size: 1, free: true, name: "Trống (32B)" },
    { id: 11, tag: "FREE", size: 1, free: true, name: "Trống (32B)" },
    { id: 12, tag: "FREE", size: 1, free: true, name: "Trống (32B)" },
    { id: 13, tag: "FREE", size: 1, free: true, name: "Trống (32B)" },
    { id: 14, tag: "FREE", size: 1, free: true, name: "Trống (32B)" },
    { id: 15, tag: "FREE", size: 1, free: true, name: "Trống (32B)" }
];

function renderHeapBlocks() {
    const container = document.getElementById("heap-blocks-container");
    if (!container) return;

    let html = "";
    heapBlocks.forEach(b => {
        const cls = b.free ? (b.isFragHole ? "frag-hole" : "") : "allocated";
        html += `
            <div class="heap-block-cell ${cls}" title="${b.name}">
                <span>${b.tag}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function freeHeapBlockB() {
    for (let i = 2; i <= 5; i++) {
        heapBlocks[i].free = true;
        heapBlocks[i].tag = "LỖ HỔNG";
        heapBlocks[i].isFragHole = true;
        heapBlocks[i].name = "Lỗ hổng phân mảnh (128B không liên tục)";
    }
    renderHeapBlocks();
    showToast("🗑️ Đã giải phóng Block B (128B). Tạo ra lỗ hổng phân mảnh (Memory Hole)!");
}

function tryMallocFail() {
    // Thử cấp phát 160 bytes (cần 5 ô liên tiếp)
    // Dù tổng dung lượng trống = 128B (lỗ hổng) + 256B (đuôi) = 384B trống,
    // nhưng nếu yêu cầu 5 ô liên tiếp ở đầu thì lỗ hổng chỉ có 4 ô!
    const msgEl = document.getElementById("heap-malloc-result");
    if (msgEl) {
        msgEl.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 6px; padding: 10px; color: #fca5a5; font-size: 12px; line-height: 1.6;">
                ❌ <strong>malloc(160) THẤT BẠI: TRẢ VỀ NULL!</strong><br>
                • Tổng RAM trống còn lại: <strong>384 Bytes</strong> (> 160 Bytes yêu cầu).<br>
                • Nguyên nhân: Không tìm thấy <strong>5 khối 32B liên tục</strong> do lỗ hổng phân mảnh ở giữa (chỉ vừa 4 khối = 128B).<br>
                💡 <em>Đây là lý do vi điều khiển nhúng & TinyML tuyệt đối cấm dùng <code>malloc/free</code> lung tung trong vòng lặp!</em>
            </div>
        `;
    }
    showToast("❌ malloc(160) trả về NULL do phân mảnh bộ nhớ!");
}

function resetHeapSimulator() {
    heapBlocks = [
        { id: 0, tag: "A (64B)", size: 2, free: false, name: "Block A" },
        { id: 1, tag: "A (64B)", size: 2, free: false, name: "Block A" },
        { id: 2, tag: "B (128B)", size: 4, free: false, name: "Block B" },
        { id: 3, tag: "B (128B)", size: 4, free: false, name: "Block B" },
        { id: 4, tag: "B (128B)", size: 4, free: false, name: "Block B" },
        { id: 5, tag: "B (128B)", size: 4, free: false, name: "Block B" },
        { id: 6, tag: "C (64B)", size: 2, free: false, name: "Block C" },
        { id: 7, tag: "C (64B)", size: 2, free: false, name: "Block C" },
        { id: 8, tag: "FREE", size: 1, free: true, name: "Trống" },
        { id: 9, tag: "FREE", size: 1, free: true, name: "Trống" },
        { id: 10, tag: "FREE", size: 1, free: true, name: "Trống" },
        { id: 11, tag: "FREE", size: 1, free: true, name: "Trống" },
        { id: 12, tag: "FREE", size: 1, free: true, name: "Trống" },
        { id: 13, tag: "FREE", size: 1, free: true, name: "Trống" },
        { id: 14, tag: "FREE", size: 1, free: true, name: "Trống" },
        { id: 15, tag: "FREE", size: 1, free: true, name: "Trống" }
    ];
    const msgEl = document.getElementById("heap-malloc-result");
    if (msgEl) msgEl.innerHTML = "";
    renderHeapBlocks();
    showToast("↺ Đã reset bộ nhớ Heap.");
}

// Khởi tạo tab Hex Memory khi view được hiển thị
function initHexMemoryModule() {
    initHexMemoryData();
    renderHexMemoryTable();
    renderStackFrames();
    renderHeapBlocks();
}

// Expose ra window
window.initHexMemoryModule = initHexMemoryModule;
window.selectHexByte = selectHexByte;
window.stackPushFunction = stackPushFunction;
window.stackPopFunction = stackPopFunction;
window.resetStackFrames = resetStackFrames;
window.freeHeapBlockB = freeHeapBlockB;
window.tryMallocFail = tryMallocFail;
window.resetHeapSimulator = resetHeapSimulator;
