/**
 * Project Thai: Living Portfolio Deep-Dive HUD with Interactive UART Console
 * Provides full un-gated exploration of production projects:
 * 1. Architecture & Overview (Problem, Solution, Block Diagram)
 * 2. Visual Demo & Interactive UART Serial Console (Firmware log streamer)
 * 3. Key Implementation (C/C++ code viewer with copy button)
 * 4. Benchmarks & Hardware Specs (BOM & Performance Metrics)
 */

(function(root) {
    'use strict';

    class PortfolioHUDClass {
        constructor() {
            this.overlay = null;
            this.currentProject = null;
            this.activeTab = 'arch'; // 'arch' | 'uart' | 'code' | 'bench'
            this.uartStreaming = false;
            this.uartInterval = null;
            this.uartIndex = 0;
            this.renderedLogs = [];
            this.initialized = false;
        }

        init() {
            if (typeof document === 'undefined') return;
            this.ensureDomElements();
            this.attachEventListeners();
            this.initialized = true;
        }

        ensureDomElements() {
            let el = document.getElementById('project-deepdive-hud');
            if (!el) {
                el = document.createElement('div');
                el.id = 'project-deepdive-hud';
                el.className = 'deepdive-hud-overlay';
                if (document.body) {
                    document.body.appendChild(el);
                }
            }
            this.overlay = el;
        }

        attachEventListeners() {
            if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
                window.addEventListener('portfolio:project-selected', (e) => {
                    if (e && e.detail && e.detail.project) {
                        this.open(e.detail.project.id);
                    }
                });

                window.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen()) {
                        this.close();
                    }
                });
            }
        }

        isOpen() {
            return this.overlay && this.overlay.classList.contains('active');
        }

        open(projectId) {
            this.ensureDomElements();

            const controller = root.PortfolioController || (typeof window !== 'undefined' ? window.PortfolioController : null);
            const data = root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null);

            let project = null;
            if (controller && typeof controller.getProjectById === 'function') {
                project = controller.getProjectById(projectId);
            } else if (data && Array.isArray(data.projects)) {
                project = data.projects.find(p => p.id === projectId);
            }

            if (!project) {
                console.warn(`[PortfolioHUD] Project ${projectId} not found`);
                return;
            }

            this.currentProject = project;
            this.pauseUartStream();
            this.renderedLogs = [];
            this.uartIndex = 0;
            this.activeTab = 'arch';

            this.render();
            if (this.overlay) {
                this.overlay.classList.add('active');
            }

            // Dispatch global event
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:hud-opened', { detail: { project } }));
                } catch (e) {}
            }
        }

        close() {
            this.pauseUartStream();
            if (this.overlay) {
                this.overlay.classList.remove('active');
            }

            // Smoothly reset 3D camera if available
            const tree = root.CyberTree3D || (typeof window !== 'undefined' ? window.CyberTree3D : null);
            if (tree && typeof tree.resetCameraFocus === 'function') {
                tree.resetCameraFocus();
            }

            // Dispatch global event
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:hud-closed', { detail: { project: this.currentProject } }));
                } catch (e) {}
            }
        }

        switchTab(tabName) {
            const validTabs = ['arch', 'uart', 'code', 'bench'];
            if (!validTabs.includes(tabName)) return;

            this.activeTab = tabName;
            this.render();

            // Auto-start UART stream on opening UART tab if empty
            if (tabName === 'uart' && this.renderedLogs.length === 0) {
                this.startUartStream(280);
            }
        }

        render() {
            if (!this.overlay || !this.currentProject) return;

            const p = this.currentProject;

            // Centralized Category Metadata & Status Badge Styling
            const categoryMeta = (root.PortfolioData && typeof root.PortfolioData.getCategoryMeta === 'function')
                ? root.PortfolioData.getCategoryMeta(p.category)
                : (root.PortfolioData && root.PortfolioData.categoryMeta && root.PortfolioData.categoryMeta[p.category])
                || { icon: '⚡', label: p.category };

            const statusStyle = (root.PortfolioData && typeof root.PortfolioData.getStatusStyle === 'function')
                ? root.PortfolioData.getStatusStyle(p.status)
                : (root.PortfolioData && root.PortfolioData.statusStyle && root.PortfolioData.statusStyle[p.status])
                || { bg: 'rgba(0, 240, 255, 0.12)', border: '#00f0ff', text: '#00f0ff', dot: '#00f0ff' };

            this.overlay.innerHTML = `
                <div class="deepdive-hud-modal">
                    <!-- HUD Top Header -->
                    <div class="hud-modal-header">
                        <div class="hud-modal-header-left">
                            <div class="hud-cat-pill">
                                <span>${categoryMeta.icon}</span>
                                <span>${categoryMeta.label}</span>
                            </div>
                            <div class="hud-title-group">
                                <h2 class="hud-project-title">${p.title}</h2>
                                <div class="hud-project-summary">${p.summary}</div>
                            </div>
                        </div>

                        <div class="hud-modal-header-right">
                            <div class="hud-status-badge" style="background: ${statusStyle.bg}; border: 1px solid ${statusStyle.border}; color: ${statusStyle.text};">
                                <span class="status-pulse-dot" style="background: ${statusStyle.dot};"></span>
                                <span>${p.status}</span>
                            </div>
                            <button type="button" class="btn-hud-close" onclick="PortfolioHUD.close()" title="Đóng HUD (ESC)">
                                ✕ Đóng <kbd>(ESC)</kbd>
                            </button>
                        </div>
                    </div>

                    <!-- 4-Tab Navigation Bar -->
                    <div class="hud-tab-nav">
                        <button type="button" class="hud-tab-btn ${this.activeTab === 'arch' ? 'active' : ''}" onclick="PortfolioHUD.switchTab('arch')">
                            📐 1. Kiến Trúc &amp; Bài Toán
                        </button>
                        <button type="button" class="hud-tab-btn ${this.activeTab === 'uart' ? 'active' : ''}" onclick="PortfolioHUD.switchTab('uart')">
                            📟 2. UART Serial Console &amp; Demo
                        </button>
                        <button type="button" class="hud-tab-btn ${this.activeTab === 'code' ? 'active' : ''}" onclick="PortfolioHUD.switchTab('code')">
                            💻 3. Source Code C/C++
                        </button>
                        <button type="button" class="hud-tab-btn ${this.activeTab === 'bench' ? 'active' : ''}" onclick="PortfolioHUD.switchTab('bench')">
                            📊 4. Benchmarks &amp; Hardware BOM
                        </button>
                    </div>

                    <!-- Tab Content Area -->
                    <div class="hud-tab-body">
                        ${this.renderActiveTabContent()}
                    </div>
                </div>
            `;

            // If on UART tab, ensure terminal scroll position is at the bottom
            if (this.activeTab === 'uart') {
                const screen = document.getElementById('uart-terminal-screen');
                if (screen) screen.scrollTop = screen.scrollHeight;
            }
        }

        renderActiveTabContent() {
            switch (this.activeTab) {
                case 'arch': return this.renderArchTab();
                case 'uart': return this.renderUartTab();
                case 'code': return this.renderCodeTab();
                case 'bench': return this.renderBenchTab();
                default: return this.renderArchTab();
            }
        }

        renderArchTab() {
            const arch = this.currentProject.architecture || {};
            const tags = (this.currentProject.tags || []).map(t => `<span class="grid-tag-pill">${t}</span>`).join('');

            return `
                <div class="hud-tab-pane pane-arch">
                    <div class="arch-col-main">
                        <!-- Problem & Solution Cards -->
                        <div class="hud-card">
                            <div class="hud-card-label">🎯 BÀI TOÁN THỰC TIỄN (PROBLEM STATEMENT)</div>
                            <div class="hud-card-content problem-text">
                                ${arch.problem || 'Chưa cập nhật chi tiết bài toán.'}
                            </div>
                        </div>

                        <div class="hud-card">
                            <div class="hud-card-label">⚡ GIẢI PHÁP KỸ THUẬT (ENGINEERING SOLUTION)</div>
                            <div class="hud-card-content solution-text">
                                ${arch.solution || 'Chưa cập nhật giải pháp kỹ thuật.'}
                            </div>
                        </div>

                        <!-- System Block Diagram -->
                        <div class="hud-card">
                            <div class="hud-card-label">📐 SƠ ĐỒ DÒNG DỮ LIỆU &amp; PHẦN CỨNG (SYSTEM DATA PIPELINE)</div>
                            <div class="arch-diagram-box">
                                <pre class="arch-diagram-code"><code>${arch.diagram || 'Khối xử lý: Input -> DMA Buffer -> Inference -> Output'}</code></pre>
                            </div>
                        </div>
                    </div>

                    <div class="arch-col-side">
                        <div class="hud-card">
                            <div class="hud-card-label">🏷️ TECH STACK &amp; KHÁI NIỆM</div>
                            <div class="hud-tags-cloud">
                                ${tags}
                            </div>
                        </div>

                        <div class="hud-card">
                            <div class="hud-card-label">🛡️ NGUYÊN TẮC THIẾT KẾ</div>
                            <ul class="hud-principles-list">
                                <li><strong>Zero Dynamic Alloc:</strong> Toàn bộ tensor buffers được cấp phát tĩnh.</li>
                                <li><strong>Hardware DMA:</strong> Giảm tải cho CPU trong quá trình nạp dữ liệu ngoại vi.</li>
                                <li><strong>Air-Gapped:</strong> Suy luận 100% tại biên, không gửi dữ liệu ra ngoài.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }

        renderUartTab() {
            const isPlaying = this.uartStreaming;
            const logLinesHtml = (this.renderedLogs.length > 0)
                ? this.renderedLogs.map(line => `<div class="uart-log-line">${this.formatUartLine(line)}</div>`).join('')
                : `<div class="uart-idle-notice">// Nhấn "▶ Run Firmware Boot" để bắt đầu phát stream UART telemetry thực tế...</div>`;

            return `
                <div class="hud-tab-pane pane-uart">
                    <div class="uart-wrapper">
                        <!-- Toolbar Controls -->
                        <div class="uart-toolbar">
                            <div class="uart-toolbar-left">
                                <button type="button" class="btn-uart-action ${isPlaying ? 'disabled' : 'primary'}" onclick="PortfolioHUD.startUartStream()">
                                    ▶ Run Firmware Boot
                                </button>
                                <button type="button" class="btn-uart-action" onclick="PortfolioHUD.pauseUartStream()">
                                    ⏹ Pause
                                </button>
                                <button type="button" class="btn-uart-action" onclick="PortfolioHUD.replayUartStream()">
                                    🔄 Replay
                                </button>
                                <button type="button" class="btn-uart-action" onclick="PortfolioHUD.clearUartConsole()">
                                    🧹 Clear
                                </button>
                            </div>

                            <div class="uart-toolbar-right">
                                <span class="uart-baud-badge">BAUD: 115200 8-N-1</span>
                                <span class="uart-port-badge">PORT: /dev/ttyUSB0 (ESP32-S3 UART0)</span>
                                <span class="uart-status-dot ${isPlaying ? 'online' : 'paused'}"></span>
                            </div>
                        </div>

                        <!-- Terminal Screen -->
                        <div class="uart-terminal-container" id="uart-terminal-screen">
                            ${logLinesHtml}
                        </div>

                        <!-- Footer Telemetry -->
                        <div class="uart-footer-bar">
                            <span>Dòng đã xuất: <strong>${this.renderedLogs.length}</strong></span>
                            <span>Trạng thái: <strong>${isPlaying ? 'ĐANG PHÁT TELEMETRY...' : 'TẠM DỪNG / HOÀN THÀNH'}</strong></span>
                        </div>
                    </div>
                </div>
            `;
        }

        formatUartLine(line) {
            // Highlighting timestamps and tags like [BOOT], [TINY], [CHIP], [INFR]
            return line
                .replace(/^(\[\d{2}:\d{2}:\d{2}\.\d{3}\])/, '<span class="log-ts">$1</span>')
                .replace(/\[(BOOT|CHIP|CAM|AUDIO|BLE|LORA|TINY|INFR|FREE|IMU|SIMD|SYS)\]/g, '<span class="log-tag tag-$1">[$1]</span>')
                .replace(/(PERSON|WAKEWORD|ANOMALY|ACTIVE|FALL)/g, '<span class="log-highlight">$1</span>');
        }

        renderCodeTab() {
            const cs = this.currentProject.codeSnippet || {};
            const codeText = cs.code || '// Source code snippet đang được cập nhật.';

            return `
                <div class="hud-tab-pane pane-code">
                    <div class="code-header-bar">
                        <div class="code-title-left">
                            <span class="code-file-icon">📄</span>
                            <span class="code-file-name">${cs.title || 'main_inference.c'}</span>
                            <span class="code-lang-badge">${(cs.language || 'c').toUpperCase()} ESP-IDF</span>
                        </div>
                        <button type="button" class="btn-copy-code" onclick="PortfolioHUD.copyCodeToClipboard()">
                            📋 Copy Mã Nguồn
                        </button>
                    </div>

                    ${cs.explanation ? `<div class="code-explanation-card">${cs.explanation}</div>` : ''}

                    <div class="code-viewer-container">
                        <pre class="code-pre-block"><code class="code-content">${this.escapeHtml(codeText)}</code></pre>
                    </div>
                </div>
            `;
        }

        renderBenchTab() {
            const b = this.currentProject.benchmarks || {};
            const bom = this.currentProject.hardwareBOM || [];

            const metricCards = Object.keys(b).map(k => {
                const title = k.replace(/([A-Z])/g, ' $1').toUpperCase();
                return `
                    <div class="bench-metric-card">
                        <div class="bench-metric-label">${title}</div>
                        <div class="bench-metric-value">${b[k]}</div>
                    </div>
                `;
            }).join('');

            const bomItems = bom.map(item => `
                <li class="bom-item">
                    <span class="bom-icon">⚡</span>
                    <span class="bom-text">${item}</span>
                </li>
            `).join('');

            return `
                <div class="hud-tab-pane pane-bench">
                    <div class="bench-section">
                        <div class="hud-card-label">📊 BẢNG ĐO LƯỜNG HIỆU NĂNG THỰC TẾ (ON-CHIP BENCHMARKS)</div>
                        <div class="bench-grid">
                            ${metricCards}
                        </div>
                    </div>

                    <div class="bom-section">
                        <div class="hud-card-label">🛠️ DANH SÁCH LINH KIỆN PHẦN CỨNG (BILL OF MATERIALS - BOM)</div>
                        <ul class="bom-list">
                            ${bomItems}
                        </ul>
                    </div>
                </div>
            `;
        }

        // -------------------------------------------------------------
        // UART STREAM CONTROLLER
        // -------------------------------------------------------------
        startUartStream(intervalMs = 280) {
            if (!this.currentProject || !Array.isArray(this.currentProject.uartLogs)) return;

            this.pauseUartStream();
            this.uartStreaming = true;

            const logs = this.currentProject.uartLogs;

            this.uartInterval = setInterval(() => {
                if (this.uartIndex < logs.length) {
                    this.renderedLogs.push(logs[this.uartIndex]);
                    this.uartIndex++;

                    // Re-render terminal screen or entire tab if open
                    if (this.activeTab === 'uart') {
                        const screen = document.getElementById('uart-terminal-screen');
                        if (screen) {
                            const lineEl = document.createElement('div');
                            lineEl.className = 'uart-log-line';
                            lineEl.innerHTML = this.formatUartLine(logs[this.uartIndex - 1]);
                            screen.appendChild(lineEl);
                            screen.scrollTop = screen.scrollHeight;
                        }
                    }
                } else {
                    this.pauseUartStream();
                }
            }, intervalMs);

            if (this.activeTab === 'uart') {
                this.render();
            }
        }

        pauseUartStream() {
            if (this.uartInterval) {
                clearInterval(this.uartInterval);
                this.uartInterval = null;
            }
            this.uartStreaming = false;
            if (this.activeTab === 'uart' && this.overlay) {
                const dot = this.overlay.querySelector('.uart-status-dot');
                if (dot) dot.className = 'uart-status-dot paused';
            }
        }

        replayUartStream(intervalMs = 280) {
            this.pauseUartStream();
            this.renderedLogs = [];
            this.uartIndex = 0;
            this.startUartStream(intervalMs);
        }

        clearUartConsole() {
            this.pauseUartStream();
            this.renderedLogs = [];
            this.uartIndex = 0;
            if (this.activeTab === 'uart') {
                this.render();
            }
        }

        getRenderedLogsCount() {
            return this.renderedLogs.length;
        }

        copyCodeToClipboard() {
            if (!this.currentProject || !this.currentProject.codeSnippet) return;
            const code = this.currentProject.codeSnippet.code;
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(() => {
                    if (typeof root.showToast === 'function') {
                        root.showToast('✓ Đã copy mã nguồn C/C++ vào clipboard!');
                    }
                }).catch(() => {});
            }
        }

        escapeHtml(str) {
            if (!str) return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    }

    const PortfolioHUD = new PortfolioHUDClass();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioHUD;
    }
    if (typeof window !== 'undefined') {
        window.PortfolioHUD = PortfolioHUD;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
