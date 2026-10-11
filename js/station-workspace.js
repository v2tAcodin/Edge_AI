// ==========================================================================
// PROJECT THAI // STATION WORKSPACE CONTROLLER (SPLIT-VIEW HUD)
// Màn hình tác nghiệp 2 cột công nghệ cao: Lý thuyết, Code Lab, Sim & Quiz
// ==========================================================================

class StationWorkspaceController {
    constructor() {
        this.currentStationId = null;
        this.activeTab = "code"; // "code" | "sim" | "quiz"
        this.quizUserAnswers = {}; // { qIndex: selectedOptIndex }
        this.overlayEl = null;
        this.overrideModalEl = null;
        this.init();
    }

    init() {
        this.ensureDomElements();
        this.attachGlobalKeyListeners();
    }

    ensureDomElements() {
        // Create Workspace Overlay if not present
        if (!document.getElementById("station-workspace-overlay")) {
            const overlay = document.createElement("div");
            overlay.id = "station-workspace-overlay";
            overlay.className = "station-workspace-overlay";
            overlay.innerHTML = `
                <!-- HUD Header -->
                <header class="workspace-hud-header">
                    <div class="workspace-header-left">
                        <span class="workspace-track-pill" id="ws-track-pill">🧠 TRACK 1</span>
                        <div class="workspace-station-title-group">
                            <span class="workspace-station-id-category" id="ws-station-category">REGISTERS // S01</span>
                            <h2 class="workspace-station-title" id="ws-station-title">Station Title</h2>
                        </div>
                    </div>
                    <div class="workspace-header-right">
                        <span class="workspace-xp-badge" id="ws-xp-badge">⚡ +100 XP</span>
                        <span class="workspace-status-badge unlocked" id="ws-status-badge">UNLOCKED</span>
                        <button type="button" class="btn-workspace-override" id="ws-btn-override" onclick="stationWorkspaceController.openOverrideModal()">
                            ⚡ Override
                        </button>
                        <button type="button" class="btn-workspace-close" onclick="stationWorkspaceController.closeStation()">
                            ✕ Đóng <kbd style="font-size: 10px; opacity: 0.7;">(ESC)</kbd>
                        </button>
                    </div>
                </header>

                <!-- Workspace Body Split-View Grid -->
                <main class="workspace-body">
                    <!-- Left Column: Core Theory & Architecture -->
                    <section class="workspace-col-left">
                        <div class="workspace-card">
                            <div class="workspace-card-title">
                                <span>📖</span> NGUYÊN LÝ CỐT LÕI (CORE THEORY)
                            </div>
                            <div class="workspace-theory-text" id="ws-theory-summary">
                                Nội dung lý thuyết...
                            </div>
                        </div>

                        <div class="workspace-card">
                            <div class="workspace-card-title">
                                <span>📐</span> SƠ ĐỒ KIẾN TRÚC & PHẦN CỨNG (SYSTEM DIAGRAM)
                            </div>
                            <div class="workspace-diagram-box" id="ws-diagram-box">
                                Sơ đồ hệ thống...
                            </div>
                        </div>

                        <div class="workspace-card">
                            <div class="workspace-card-title">
                                <span>⚡</span> ĐIỂM THEN CHỐT CẦN NHỚ (KEY TAKEAWAYS)
                            </div>
                            <ul class="workspace-takeaways-list" id="ws-takeaways-list">
                                <!-- Takeaways inserted dynamically -->
                            </ul>
                            <div class="workspace-reference-tag" id="ws-reference-tag">
                                📚 Tham chiếu: ESP32-S3 TRM
                            </div>
                        </div>
                    </section>

                    <!-- Right Column: Interactive Tabs -->
                    <section class="workspace-col-right">
                        <!-- Navigation Tabs -->
                        <nav class="workspace-tab-nav">
                            <button type="button" class="workspace-tab-btn active" id="ws-tab-btn-code" onclick="stationWorkspaceController.switchTab('code')">
                                💻 Code C Lab
                            </button>
                            <button type="button" class="workspace-tab-btn" id="ws-tab-btn-sim" onclick="stationWorkspaceController.switchTab('sim')">
                                🔬 Visual Simulator
                            </button>
                            <button type="button" class="workspace-tab-btn" id="ws-tab-btn-quiz" onclick="stationWorkspaceController.switchTab('quiz')">
                                🎯 Checkpoint Quiz
                            </button>
                        </nav>

                        <!-- Tab 1: Code C Lab -->
                        <div class="workspace-tab-pane active" id="ws-pane-code">
                            <div class="code-lab-toolbar">
                                <span class="code-lab-lang-tag">ESP-IDF C // XTENSA LX7</span>
                                <div class="code-lab-actions">
                                    <button type="button" class="btn-code-action" id="ws-btn-copy-code" onclick="stationWorkspaceController.copyCode()">
                                        📋 Sao Chép Code
                                    </button>
                                    <button type="button" class="btn-code-action btn-code-run" onclick="stationWorkspaceController.runCode()">
                                        ▶ Biên Dịch & Chạy Thử
                                    </button>
                                </div>
                            </div>
                            <pre class="code-editor-view" id="ws-code-view"><code>// Sample C Code</code></pre>
                            <div class="code-run-terminal" id="ws-code-terminal">
                                [ESP-IDF Build Terminal] Sẵn sàng nạp chương trình vào vi điều khiển ESP32-S3...
                            </div>
                        </div>

                        <!-- Tab 2: Visual Simulator -->
                        <div class="workspace-tab-pane" id="ws-pane-sim">
                            <div id="ws-simulator-content">
                                <!-- Simulator dynamic content -->
                            </div>
                        </div>

                        <!-- Tab 3: Checkpoint Quiz -->
                        <div class="workspace-tab-pane" id="ws-pane-quiz">
                            <div class="quiz-station-header">
                                <span style="font-size: 13px; font-weight: 700; color: #fff;">BỘ CÂU HỎI ĐÁNH GIÁ LÀM CHỦ TRẠM (TIÊU CHUẨN ≥ 80%)</span>
                                <span class="quiz-score-badge" id="ws-quiz-score-badge">ĐIỂM: 0% / 80% ĐẠT</span>
                            </div>
                            <div id="ws-quiz-questions-list">
                                <!-- Quiz questions dynamic content -->
                            </div>
                            <div class="quiz-submit-bar">
                                <button type="button" class="btn-quiz-submit" onclick="stationWorkspaceController.submitQuiz()">
                                    ✓ Nộp Bài & Đánh Giá Làm Chủ Trạm
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            `;
            document.body.appendChild(overlay);
            this.overlayEl = overlay;
        } else {
            this.overlayEl = document.getElementById("station-workspace-overlay");
        }

        // Create Engineer Override Modal if not present
        if (!document.getElementById("station-override-modal")) {
            const modal = document.createElement("div");
            modal.id = "station-override-modal";
            modal.className = "override-modal-backdrop";
            modal.innerHTML = `
                <div class="override-modal-box">
                    <div class="override-modal-title">
                        <span>⚡</span> XÁC THỰC QUYỀN ENGINEER OVERRIDE
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
                        Kích hoạt quyền Engineer Override cho phép Kỹ sư Thai mở khóa tự do toàn bộ 24 Skill Stations trên bản đồ để tra cứu khẩn cấp mà không cần vượt qua Progression Gate tuần tự.
                    </div>
                    <input type="password" id="override-passcode-input" class="override-input" maxlength="12" placeholder="••••••" autofocus>
                    <div class="override-modal-btns">
                        <button type="button" class="btn btn-secondary" onclick="stationWorkspaceController.closeOverrideModal()">Hủy Bỏ</button>
                        <button type="button" class="btn btn-primary" style="background: #f59e0b; border-color: #f59e0b; color: #000; font-weight: 800;" onclick="stationWorkspaceController.submitOverridePasscode()">Kích Hoạt</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            this.overrideModalEl = modal;

            // Enter key trigger
            const input = modal.querySelector("#override-passcode-input");
            if (input) {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.submitOverridePasscode();
                });
            }
        } else {
            this.overrideModalEl = document.getElementById("station-override-modal");
        }
    }

    attachGlobalKeyListeners() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (this.overrideModalEl && this.overrideModalEl.classList.contains("active")) {
                    this.closeOverrideModal();
                } else if (this.overlayEl && this.overlayEl.classList.contains("active")) {
                    this.closeStation();
                }
            }
        });
    }

    openStation(stationId) {
        if (!window.trackStateManager) return;
        const station = window.trackStateManager.getStation(stationId);
        if (!station) {
            console.error("[StationWorkspace] Station not found:", stationId);
            return;
        }

        // Check if unlocked
        if (!station.userProgress.isUnlocked) {
            if (typeof showToast === "function") {
                showToast("🔒 Trạm này đang bị khóa bởi Progression Gate! Hãy hoàn thành các trạm tiên quyết hoặc dùng Engineer Override.", "warning");
            } else if (typeof alert === "function") {
                alert("🔒 Trạm này đang bị khóa bởi Progression Gate! Hãy hoàn thành các trạm tiên quyết hoặc dùng Engineer Override.");
            }
            return;
        }

        this.currentStationId = stationId;
        this.quizUserAnswers = {};

        // Mark viewed
        window.trackStateManager.markStationViewed(stationId);

        // Populate header
        const track = window.trackStateManager.getTrack(station.trackId);
        const trackPill = document.getElementById("ws-track-pill");
        if (trackPill && track) {
            trackPill.innerHTML = `${track.icon} ${track.title}`;
            trackPill.style.color = track.color;
            trackPill.style.borderColor = track.color;
            trackPill.style.background = track.accentGlow;
        }

        const catEl = document.getElementById("ws-station-category");
        if (catEl) catEl.textContent = `${station.category.toUpperCase()} // ${station.id.toUpperCase()}`;

        const titleEl = document.getElementById("ws-station-title");
        if (titleEl) titleEl.textContent = station.title;

        const xpEl = document.getElementById("ws-xp-badge");
        if (xpEl) xpEl.textContent = `⚡ +${station.xpReward} XP`;

        const statusEl = document.getElementById("ws-status-badge");
        if (statusEl) {
            statusEl.className = `workspace-status-badge ${station.userProgress.status}`;
            statusEl.textContent = station.userProgress.status.toUpperCase();
        }

        const overrideBtn = document.getElementById("ws-btn-override");
        if (overrideBtn) {
            if (window.trackStateManager.isEngineerOverrideActive()) {
                overrideBtn.innerHTML = "⚡ OVERRIDE ACTIVE";
                overrideBtn.style.background = "rgba(245, 158, 11, 0.3)";
            } else {
                overrideBtn.innerHTML = "⚡ Override";
                overrideBtn.style.background = "rgba(245, 158, 11, 0.1)";
            }
        }

        // Populate Left Column (Theory)
        const theorySummaryEl = document.getElementById("ws-theory-summary");
        if (theorySummaryEl) theorySummaryEl.innerHTML = station.theory.summary;

        const diagramBoxEl = document.getElementById("ws-diagram-box");
        if (diagramBoxEl) diagramBoxEl.textContent = station.theory.diagram;

        const takeawaysListEl = document.getElementById("ws-takeaways-list");
        if (takeawaysListEl) {
            takeawaysListEl.innerHTML = station.theory.keyTakeaways
                .map(item => `<li class="workspace-takeaway-item">${item}</li>`)
                .join("");
        }

        const refTagEl = document.getElementById("ws-reference-tag");
        if (refTagEl) refTagEl.innerHTML = `📚 Tiêu chuẩn & Tài liệu: <strong>${station.theory.standardRef}</strong>`;

        // Populate Code Lab Tab
        const codeViewEl = document.getElementById("ws-code-view");
        if (codeViewEl) codeViewEl.textContent = station.codeLab.sampleCode;

        const terminalEl = document.getElementById("ws-code-terminal");
        if (terminalEl) {
            terminalEl.innerHTML = `[ESP-IDF v5.2.1] Sẵn sàng biên dịch mã nguồn cho ${station.shortTitle}...`;
        }

        // Render Simulator Tab
        this.renderSimulator(station);

        // Render Quiz Tab
        this.renderQuiz(station);

        // Show overlay
        this.switchTab("code");
        this.overlayEl.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    closeStation() {
        if (!this.overlayEl) return;
        this.overlayEl.classList.remove("active");
        document.body.style.overflow = "";
        this.currentStationId = null;

        // If 3D Skill Galaxy is active, signal camera reset
        if (window.skillGalaxy3D && typeof window.skillGalaxy3D.resetCameraFocus === "function") {
            window.skillGalaxy3D.resetCameraFocus();
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        const tabs = ["code", "sim", "quiz"];
        tabs.forEach(t => {
            const btn = document.getElementById(`ws-tab-btn-${t}`);
            const pane = document.getElementById(`ws-pane-${t}`);
            if (btn) btn.classList.toggle("active", t === tabName);
            if (pane) pane.classList.toggle("active", t === tabName);
        });
    }

    copyCode() {
        if (!this.currentStationId) return;
        const station = window.trackStateManager.getStation(this.currentStationId);
        if (!station) return;

        navigator.clipboard.writeText(station.codeLab.sampleCode).then(() => {
            const btn = document.getElementById("ws-btn-copy-code");
            if (btn) {
                const orig = btn.innerHTML;
                btn.innerHTML = "✓ Đã Sao Chép!";
                btn.style.color = "var(--green, #00ff9d)";
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.color = "";
                }, 2000);
            }
        }).catch(err => {
            console.error("Copy failed:", err);
        });
    }

    runCode() {
        if (!this.currentStationId) return;
        window.trackStateManager.markStationCodeRun(this.currentStationId);

        const terminalEl = document.getElementById("ws-code-terminal");
        if (!terminalEl) return;

        terminalEl.innerHTML = `<span style="color: #38bdf8;">[ESP-IDF Toolchain]</span> Bắt đầu biên dịch xtensa-esp32s3-elf-gcc -O2 -Wall...\n`;
        setTimeout(() => {
            terminalEl.innerHTML += `<span style="color: #cbd5e1;">[Linker]</span> Sắp đặt vùng nhớ Internal SRAM (IRAM/DRAM) & External PSRAM...\n`;
            terminalEl.innerHTML += `<span style="color: #a78bfa;">[Memory Map]</span> Binary size: 4,280 bytes (.text: 3,420B, .iram: 860B). 16-byte align verified.\n`;
        }, 300);

        setTimeout(() => {
            terminalEl.innerHTML += `<span style="color: #34d399; font-weight: bold;">[Execution Trace]</span> Phần cứng phản hồi chính xác. Kiểm thử thành công 100%! ✓\n`;
            terminalEl.scrollTop = terminalEl.scrollHeight;
        }, 600);
    }

    renderSimulator(station) {
        const container = document.getElementById("ws-simulator-content");
        if (!container) return;

        const simType = station.simulator.type;
        if (simType === "register") {
            container.innerHTML = `
                <div class="sim-container-card">
                    <div style="font-size: 13px; font-weight: 700; color: #38bdf8;">
                        ⚡ BẢN ĐỒ THANH GHI PHẦN CỨNG 8-BIT / 32-BIT (GPIO_OUT_W1TS_REG)
                    </div>
                    <div style="font-size: 12px; color: #94a3b8;">
                        Nhấp vào từng bit để bật/tắt hoặc thử nghiệm ghi nguyên tử (Atomic Write-1-to-Set):
                    </div>
                    <div class="sim-bits-grid" id="sim-bits-interactive">
                        ${[7, 6, 5, 4, 3, 2, 1, 0].map(bit => `
                            <button type="button" class="sim-bit-toggle" id="sim-bit-${bit}" onclick="stationWorkspaceController.toggleSimBit(${bit})">
                                <span class="sim-bit-label">Bit ${bit}</span>
                                <span class="sim-bit-val" id="sim-val-${bit}">0</span>
                            </button>
                        `).join("")}
                    </div>
                    <div class="sim-telemetry-row">
                        <span>Giá Trị Thập Phân (Decimal): <strong id="sim-dec-val" style="color: #38bdf8;">0</strong></span>
                        <span>Mã Hex: <strong id="sim-hex-val" style="color: #34d399;">0x00</strong></span>
                        <span>Mã Nhị Phân: <strong id="sim-bin-val" style="color: #a78bfa;">0b00000000</strong></span>
                    </div>
                </div>
            `;
            this.simRegisterVal = 0;
        } else if (simType === "hexmem") {
            container.innerHTML = `
                <div class="sim-container-card">
                    <div style="font-size: 13px; font-weight: 700; color: #a78bfa;">
                        🧠 CĂN LỀ BỘ NHỚ VECTOR SIMD (16-BYTE ALIGNMENT CHECKER)
                    </div>
                    <div style="font-size: 12px; color: #94a3b8;">
                        Nhập địa chỉ bộ nhớ ô nhớ để kiểm tra tính hợp lệ của lệnh nạp Vector SIMD 128-bit:
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" id="sim-hex-input" class="override-input" style="flex: 1; text-align: left; letter-spacing: 1px;" value="0x3FC80000">
                        <button type="button" class="btn btn-primary" onclick="stationWorkspaceController.checkHexAlignment()">Kiểm Tra</button>
                    </div>
                    <div id="sim-hex-result" class="code-run-terminal">
                        Địa chỉ 0x3FC80000 chia hết cho 16 (0x3FC80000 % 16 == 0). HỢP LỆ VỚI VECTOR SIMD XTENSA! ✓
                    </div>
                </div>
            `;
        } else if (simType === "tinyml") {
            container.innerHTML = `
                <div class="sim-container-card">
                    <div style="font-size: 13px; font-weight: 700; color: #34d399;">
                        🤖 BỘ CHUYỂN ĐỔI LƯỢNG TỬ HÓA INT8 (QUANTIZATION CALCULATOR)
                    </div>
                    <div style="font-size: 12px; color: #94a3b8;">
                        Thử nghiệm công thức lượng tử hóa: q = round(r / Scale) + ZeroPoint
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="font-size: 11px; color: #94a3b8;">Giá trị thực FP32 (r):</label>
                            <input type="number" id="sim-q-r" class="override-input" style="width: 100%; text-align: left;" value="0.75" step="0.05">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: #94a3b8;">Scale (S):</label>
                            <input type="number" id="sim-q-s" class="override-input" style="width: 100%; text-align: left;" value="0.0078125" step="0.001">
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="stationWorkspaceController.calculateQuantization()">Tính Toán INT8</button>
                    <div id="sim-quant-result" class="code-run-terminal">
                        INT8 Quantized: 96 | Tái tạo FP32: 0.750000 | Sai số lượng tử: 0.000000
                    </div>
                </div>
            `;
        } else {
            // General / FreeRTOS / Calc
            container.innerHTML = `
                <div class="sim-container-card">
                    <div style="font-size: 13px; font-weight: 700; color: #fbbf24;">
                        🔬 PHÒNG THÍ NGHIỆM MÔ PHỎNG: ${station.simulator.label}
                    </div>
                    <div style="font-size: 12px; color: #94a3b8;">
                        Mô phỏng chu trình hoạt động ngoại vi và vi điều khiển ESP32-S3:
                    </div>
                    <div class="code-run-terminal" style="min-height: 120px;">
                        [Hardware Peripheral Active] Đang giám sát trạng thái bộ đệm DMA, xung nhịp và ngắt...
                        - Tần số lấy mẫu: 16,000 Hz
                        - Bộ chia GPTimer Prescaler: /80 (1µs Tick)
                        - Dung lượng SRAM tiêu thụ: 32.4 KB
                        - Trạng thái: Chuẩn xác, không phát hiện mất mẫu (0 drops)
                    </div>
                </div>
            `;
        }
    }

    toggleSimBit(bit) {
        this.simRegisterVal = (this.simRegisterVal || 0) ^ (1 << bit);
        const isOn = (this.simRegisterVal & (1 << bit)) !== 0;

        const bitBtn = document.getElementById(`sim-bit-${bit}`);
        const valEl = document.getElementById(`sim-val-${bit}`);
        if (bitBtn) bitBtn.classList.toggle("on", isOn);
        if (valEl) valEl.textContent = isOn ? "1" : "0";

        // Update telemetry
        const decEl = document.getElementById("sim-dec-val");
        const hexEl = document.getElementById("sim-hex-val");
        const binEl = document.getElementById("sim-bin-val");

        if (decEl) decEl.textContent = this.simRegisterVal;
        if (hexEl) hexEl.textContent = "0x" + this.simRegisterVal.toString(16).toUpperCase().padStart(2, "0");
        if (binEl) binEl.textContent = "0b" + this.simRegisterVal.toString(2).padStart(8, "0");
    }

    checkHexAlignment() {
        const input = document.getElementById("sim-hex-input");
        const resEl = document.getElementById("sim-hex-result");
        if (!input || !resEl) return;

        let addr = parseInt(input.value.trim(), 16);
        if (isNaN(addr)) {
            resEl.innerHTML = `<span style="color: #ef4444;">Địa chỉ không hợp lệ!</span>`;
            return;
        }

        const isAligned = (addr % 16) === 0;
        if (isAligned) {
            resEl.innerHTML = `<span style="color: #34d399;">Địa chỉ 0x${addr.toString(16).toUpperCase()} chia hết cho 16. CĂN LỀ CHUẨN XÁC 16-BYTE CHO VECTOR SIMD XTENSA! ✓</span>`;
        } else {
            resEl.innerHTML = `<span style="color: #ef4444; font-weight: bold;">LỖI: 0x${addr.toString(16).toUpperCase()} lệch ${addr % 16} bytes so với ranh giới 16-byte! Sẽ kích hoạt Exception Cause 9 (LoadStoreAlignmentCause) Panic! ✗</span>`;
        }
    }

    calculateQuantization() {
        const rInput = document.getElementById("sim-q-r");
        const sInput = document.getElementById("sim-q-s");
        const resEl = document.getElementById("sim-quant-result");
        if (!rInput || !sInput || !resEl) return;

        const r = parseFloat(rInput.value) || 0;
        const s = parseFloat(sInput.value) || 0.0078125;

        let q = Math.round(r / s);
        if (q > 127) q = 127;
        if (q < -128) q = -128;

        const reconstructed = q * s;
        const error = Math.abs(r - reconstructed);

        resEl.innerHTML = `INT8 Quantized (q): <strong>${q}</strong> | Tái tạo FP32 (r'): <strong>${reconstructed.toFixed(6)}</strong> | Sai số lượng tử: <strong>${error.toFixed(6)}</strong>`;
    }

    renderQuiz(station) {
        const container = document.getElementById("ws-quiz-questions-list");
        if (!container) return;

        container.innerHTML = station.quiz.questions.map((q, qIdx) => `
            <div class="quiz-q-card" id="quiz-card-${qIdx}">
                <div class="quiz-q-title">
                    <strong>Câu ${qIdx + 1}:</strong> ${q.question}
                </div>
                <div class="quiz-options-list">
                    ${q.options.map((opt, optIdx) => `
                        <button type="button" class="quiz-option-btn" id="q-${qIdx}-opt-${optIdx}" onclick="stationWorkspaceController.selectQuizOption(${qIdx}, ${optIdx})">
                            <span style="font-family: 'JetBrains Mono'; font-weight: bold; margin-right: 6px;">${String.fromCharCode(65 + optIdx)}.</span> ${opt}
                        </button>
                    `).join("")}
                </div>
                <div class="quiz-explanation-box" id="quiz-exp-${qIdx}">
                    <strong>Giải thích chi tiết:</strong> ${q.explanation}
                </div>
            </div>
        `).join("");

        const scoreBadge = document.getElementById("ws-quiz-score-badge");
        if (scoreBadge) scoreBadge.textContent = "ĐIỂM: 0% / 80% ĐẠT";
    }

    selectQuizOption(qIdx, optIdx) {
        if (!this.currentStationId) return;
        const station = window.trackStateManager.getStation(this.currentStationId);
        if (!station || !station.quiz.questions[qIdx]) return;

        const q = station.quiz.questions[qIdx];
        this.quizUserAnswers[qIdx] = optIdx;

        // Reset and highlight buttons
        q.options.forEach((_, idx) => {
            const btn = document.getElementById(`q-${qIdx}-opt-${idx}`);
            if (btn) {
                btn.className = "quiz-option-btn";
                if (idx === q.correct) {
                    btn.classList.add("correct");
                } else if (idx === optIdx && optIdx !== q.correct) {
                    btn.classList.add("wrong");
                }
            }
        });

        // Show explanation
        const expBox = document.getElementById(`quiz-exp-${qIdx}`);
        if (expBox) expBox.style.display = "block";

        // Calculate live score
        let correctCount = 0;
        const total = station.quiz.questions.length;
        station.quiz.questions.forEach((qu, idx) => {
            if (this.quizUserAnswers[idx] === qu.correct) correctCount++;
        });

        const score = Math.round((correctCount / total) * 100);
        const scoreBadge = document.getElementById("ws-quiz-score-badge");
        if (scoreBadge) {
            scoreBadge.textContent = `ĐIỂM: ${score}% / 80% ĐẠT`;
            scoreBadge.style.color = score >= 80 ? "var(--green, #00ff9d)" : "var(--cyan, #00f0ff)";
        }
    }

    submitQuiz() {
        if (!this.currentStationId) return;
        const station = window.trackStateManager.getStation(this.currentStationId);
        if (!station) return;

        const total = station.quiz.questions.length;
        let correctCount = 0;
        station.quiz.questions.forEach((q, idx) => {
            if (this.quizUserAnswers[idx] === q.correct) correctCount++;
        });

        const result = window.trackStateManager.recordStationQuiz(this.currentStationId, correctCount, total);

        if (result.passed) {
            // Update status badge
            const statusEl = document.getElementById("ws-status-badge");
            if (statusEl) {
                statusEl.className = "workspace-status-badge mastered";
                statusEl.textContent = "MASTERED";
            }

            // Play celebratory audio chime if audio engine available
            if (typeof audioContext !== "undefined" && audioContext) {
                try {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
                    osc.frequency.setValueAtTime(880.00, audioContext.currentTime + 0.15); // A5
                    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);
                    osc.start();
                    osc.stop(audioContext.currentTime + 0.6);
                } catch (e) {}
            }

            const msg = `🎉 XUẤT SẮC! Bạn đạt ${result.scorePercent}% và chính thức LÀM CHỦ TRẠM ${station.shortTitle}!${result.xpAwarded > 0 ? ` (+${result.xpAwarded} XP)` : ""}`;
            if (typeof showToast === "function") {
                showToast(msg, "success");
            } else if (typeof alert === "function") {
                alert(msg);
            }

            // Re-render galaxy or roadmap if available
            if (window.skillGalaxy3D && typeof window.skillGalaxy3D.refreshNodeVisuals === "function") {
                window.skillGalaxy3D.refreshNodeVisuals();
            }
        } else {
            const msg = `Điểm của bạn là ${result.scorePercent}%. Tiêu chuẩn của Kỹ sư Thai yêu cầu ≥ 80% để làm chủ trạm và mở khóa bài tiếp theo. Hãy ôn tập lại lý thuyết và thử lại nhé!`;
            if (typeof showToast === "function") {
                showToast(msg, "warning");
            } else if (typeof alert === "function") {
                alert(msg);
            }
        }
    }

    // Engineer Override Modal
    openOverrideModal() {
        if (!this.overrideModalEl) return;
        this.overrideModalEl.classList.add("active");
        const input = document.getElementById("override-passcode-input");
        if (input) {
            input.value = "";
            input.focus();
        }
    }

    closeOverrideModal() {
        if (!this.overrideModalEl) return;
        this.overrideModalEl.classList.remove("active");
    }

    submitOverridePasscode() {
        const input = document.getElementById("override-passcode-input");
        if (!input) return;

        const code = input.value.trim();
        const success = window.trackStateManager.verifyAndSetEngineerOverride(code);

        if (success) {
            this.closeOverrideModal();
            if (typeof showToast === "function") {
                showToast("⚡ ENGINEER OVERRIDE KÍCH HOẠT: Toàn bộ 24 Skill Stations đã được mở khóa tự do!", "success");
            } else if (typeof alert === "function") {
                alert("⚡ ENGINEER OVERRIDE KÍCH HOẠT: Toàn bộ 24 Skill Stations đã được mở khóa tự do!");
            }

            // Update button text in header
            const overrideBtn = document.getElementById("ws-btn-override");
            if (overrideBtn) {
                overrideBtn.innerHTML = "⚡ OVERRIDE ACTIVE";
                overrideBtn.style.background = "rgba(245, 158, 11, 0.3)";
            }

            // If station is currently loaded, re-evaluate status
            if (this.currentStationId) {
                this.openStation(this.currentStationId);
            }

            // Refresh 3D scene if present
            if (window.skillGalaxy3D && typeof window.skillGalaxy3D.refreshNodeVisuals === "function") {
                window.skillGalaxy3D.refreshNodeVisuals();
            }
        } else {
            if (typeof alert === "function") {
                alert("❌ Mật khẩu Engineer không chính xác (Mặc định: 123456).");
            }
            input.value = "";
            input.focus();
        }
    }
}

// Global Controller Instance
const stationWorkspaceController = new StationWorkspaceController();
window.stationWorkspaceController = stationWorkspaceController;

// Helper global function for opening a station from 3D scene or anywhere
window.openSkillStation = function(stationId) {
    if (window.stationWorkspaceController) {
        window.stationWorkspaceController.openStation(stationId);
    }
};
