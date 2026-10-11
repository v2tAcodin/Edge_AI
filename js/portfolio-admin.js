/**
 * Project Thai: Zero-Backend Admin Project Editor
 * Allows Engineer Thai to create, edit, preview, and export portfolio projects directly in the browser.
 */

(function(root) {
    'use strict';

    class PortfolioAdminClass {
        constructor() {
            this.modalEl = null;
            this.isOpen = false;
            this.currentEditingId = null;
            this.initialized = false;
        }

        init() {
            if (this.initialized) return this;

            // 1. Auto-load custom data from localStorage if available
            this.loadCustomData();

            // 2. Setup shortcuts and hash listeners if in browser
            if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
                // Listen to hash #admin
                window.addEventListener('hashchange', () => {
                    if (window.location && window.location.hash === '#admin') {
                        this.open();
                    }
                });
                if (window.location && window.location.hash === '#admin') {
                    this.open();
                }

                // Keyboard shortcut: Ctrl + Shift + E
                window.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
                        e.preventDefault();
                        if (this.isOpen) {
                            this.close();
                        } else {
                            this.open();
                        }
                    }
                });
            }

            this.initialized = true;
            return this;
        }

        getData() {
            return root.PortfolioData || (typeof window !== 'undefined' ? window.PortfolioData : null) || {};
        }

        loadCustomData() {
            if (typeof localStorage === 'undefined') return;
            try {
                const raw = localStorage.getItem('portfolio_custom_data');
                if (!raw) return;
                const parsed = JSON.parse(raw);
                const data = this.getData();

                if (parsed.projects && Array.isArray(parsed.projects) && data.projects) {
                    // Merge or replace custom projects
                    parsed.projects.forEach(customP => {
                        const idx = data.projects.findIndex(p => p.id === customP.id);
                        if (idx >= 0) {
                            data.projects[idx] = customP;
                        } else {
                            data.projects.push(customP);
                        }
                    });
                }

                if (parsed.skillTreeNodes && Array.isArray(parsed.skillTreeNodes) && data.skillTreeNodes) {
                    parsed.skillTreeNodes.forEach(customNode => {
                        const idx = data.skillTreeNodes.findIndex(n => n.id === customNode.id);
                        if (idx >= 0) {
                            data.skillTreeNodes[idx] = customNode;
                        } else {
                            data.skillTreeNodes.push(customNode);
                        }
                    });
                }
            } catch (err) {
                console.warn('[PortfolioAdmin] Error loading custom data from localStorage:', err);
            }
        }

        open(projectId = null) {
            this.isOpen = true;
            this.currentEditingId = projectId;

            if (typeof document === 'undefined') return;

            if (!this.modalEl) {
                this.buildModalDOM();
            }

            this.populateProjectList();
            this.loadProjectIntoForm(projectId);

            if (this.modalEl && this.modalEl.style) {
                this.modalEl.style.display = 'flex';
            }

            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:admin-opened', { detail: { projectId } }));
                } catch (e) {}
            }
        }

        close() {
            this.isOpen = false;
            this.currentEditingId = null;

            if (this.modalEl && this.modalEl.style) {
                this.modalEl.style.display = 'none';
            }

            // Remove #admin from URL if present without refreshing
            if (typeof window !== 'undefined' && window.location && window.location.hash === '#admin') {
                try {
                    history.replaceState(null, null, ' ');
                } catch (e) {}
            }

            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:admin-closed'));
                } catch (e) {}
            }
        }

        saveProject(project) {
            if (!project || !project.id) {
                alert('Vui lòng nhập ID dự án (Project ID)!');
                return null;
            }

            const data = this.getData();
            if (!data.projects) data.projects = [];
            if (!data.skillTreeNodes) data.skillTreeNodes = [];

            // 1. Update projects array
            const pIdx = data.projects.findIndex(p => p.id === project.id);
            if (pIdx >= 0) {
                data.projects[pIdx] = project;
            } else {
                data.projects.push(project);
            }

            // 2. Ensure corresponding skillTreeNode exists
            const nodeId = `node-${project.id}`;
            const existingNode = data.skillTreeNodes.find(n => n.id === nodeId || n.projectId === project.id);
            const parentId = project.parent || 'branch-hardware';

            const categoryColors = {
                'vision': '#00f0ff',
                'audio': '#ff0055',
                'iot': '#00ff88',
                'dsp': '#38bdf8',
                'imu': '#ffd700'
            };
            const nodeColor = categoryColors[project.category] || '#00f0ff';

            if (existingNode) {
                existingNode.name = project.name;
                existingNode.label = project.name;
                existingNode.category = project.category;
                existingNode.parent = parentId;
                existingNode.color = nodeColor;
            } else {
                // Find parent position to calculate coordinates nearby
                const parentNode = data.skillTreeNodes.find(n => n.id === parentId);
                const px = parentNode ? parentNode.x + (Math.random() * 30 - 15) : 80;
                const py = parentNode ? parentNode.y + (Math.random() * 30 - 15) : 50;
                const pz = parentNode ? parentNode.z + (Math.random() * 30 - 15) : 70;

                data.skillTreeNodes.push({
                    id: nodeId,
                    projectId: project.id,
                    name: project.name,
                    type: "project",
                    category: project.category || "iot",
                    x: Math.round(px),
                    y: Math.round(py),
                    z: Math.round(pz),
                    color: nodeColor,
                    radius: 12,
                    label: project.name,
                    parent: parentId
                });
            }

            // 3. Persist to localStorage
            if (typeof localStorage !== 'undefined') {
                try {
                    localStorage.setItem('portfolio_custom_data', JSON.stringify({
                        projects: data.projects,
                        skillTreeNodes: data.skillTreeNodes
                    }));
                } catch (err) {
                    console.error('[PortfolioAdmin] Failed to write localStorage:', err);
                }
            }

            // 4. Notify all components & re-render
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:project-saved', { detail: { project } }));
                } catch (e) {}
            }

            // Live refresh Grid and 3D scene if present
            if (typeof window !== 'undefined') {
                if (window.portfolioGrid && typeof window.portfolioGrid.render === 'function') {
                    window.portfolioGrid.render();
                }
                if (window.cyberTree3D && typeof window.cyberTree3D.init === 'function') {
                    // Re-sync nodesMap if in 3D
                    window.cyberTree3D.buildCyberneticTree();
                }
            }

            return project;
        }

        deleteProject(projectId) {
            if (!projectId) return false;
            if (!confirm(`Bạn có chắc chắn muốn xóa dự án "${projectId}"?`)) return false;

            const data = this.getData();
            if (data.projects) {
                data.projects = data.projects.filter(p => p.id !== projectId);
            }
            if (data.skillTreeNodes) {
                data.skillTreeNodes = data.skillTreeNodes.filter(n => n.id !== `node-${projectId}` && n.projectId !== projectId);
            }

            if (typeof localStorage !== 'undefined') {
                try {
                    localStorage.setItem('portfolio_custom_data', JSON.stringify({
                        projects: data.projects,
                        skillTreeNodes: data.skillTreeNodes
                    }));
                } catch (e) {}
            }

            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                try {
                    window.dispatchEvent(new CustomEvent('portfolio:project-saved', { detail: { deletedId: projectId } }));
                } catch (e) {}
            }

            this.populateProjectList();
            this.loadProjectIntoForm(null);
            return true;
        }

        generateExportCode() {
            const data = this.getData();
            const exportObj = {
                engineerProfile: data.engineerProfile || {},
                projects: data.projects || [],
                skillTreeNodes: data.skillTreeNodes || []
            };

            const jsonStr = JSON.stringify(exportObj, null, 4);

            return `/**
 * Project Thai: Living Portfolio & Cybernetic Tree Core Data
 * Generated via Admin Project Editor at ${new Date().toISOString()}
 */

(function(root) {
    'use strict';

    const PortfolioData = ${jsonStr};

    // Centralized Category Metadata (Icons & Human Labels)
    PortfolioData.categoryMeta = {
        'vision': { icon: '👁️', label: 'Computer Vision' },
        'audio': { icon: '🎙️', label: 'Audio & Voice AI' },
        'iot': { icon: '📡', label: 'FreeRTOS & IoT' },
        'dsp': { icon: '⚡', label: 'SIMD Optimization' },
        'imu': { icon: '🖐️', label: 'Motion & Gesture' }
    };

    // Centralized Status Badge Styling
    PortfolioData.statusStyle = {
        'Completed': { bg: 'rgba(0, 255, 136, 0.12)', border: '#00ff88', text: '#00ff88', dot: '#00ff88' },
        'In Progress': { bg: 'rgba(255, 170, 0, 0.12)', border: '#ffaa00', text: '#ffaa00', dot: '#ffaa00' },
        'Architecture Design': { bg: 'rgba(0, 212, 255, 0.12)', border: '#00d4ff', text: '#00d4ff', dot: '#00d4ff' }
    };

    PortfolioData.getCategoryMeta = function(category) {
        return (this.categoryMeta && this.categoryMeta[category]) || { icon: '⚡', label: category || 'Embedded' };
    };

    PortfolioData.getStatusStyle = function(status) {
        return (this.statusStyle && this.statusStyle[status]) || { bg: 'rgba(0, 240, 255, 0.12)', border: '#00f0ff', text: '#00f0ff', dot: '#00f0ff' };
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioData;
    }
    if (typeof window !== 'undefined') {
        window.PortfolioData = PortfolioData;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
        }

        downloadJSON() {
            if (typeof document === 'undefined') return;
            const data = this.getData();
            const jsonStr = JSON.stringify(data.projects || [], null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio-projects-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        copyExportCode() {
            const code = this.generateExportCode();
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(() => {
                    alert('✅ Đã sao chép toàn bộ mã nguồn PortfolioData vào Clipboard! Bạn có thể dán vào file js/portfolio-data.js');
                }).catch(() => {
                    this.showCodeExportModal(code);
                });
            } else {
                this.showCodeExportModal(code);
            }
        }

        showCodeExportModal(code) {
            prompt('Sao chép mã nguồn bên dưới (Ctrl+A, Ctrl+C):', code);
        }

        buildModalDOM() {
            if (typeof document === 'undefined') return;

            let modal = document.getElementById('portfolio-admin-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'portfolio-admin-modal';
                modal.className = 'portfolio-admin-overlay';
                modal.style.display = 'none';

                modal.innerHTML = `
                    <div class="admin-modal-card">
                        <!-- Header -->
                        <div class="admin-header">
                            <div class="admin-header-title">
                                <span class="admin-header-icon">⚙️</span>
                                <div>
                                    <h3>ADMIN PROJECT EDITOR</h3>
                                    <div class="admin-header-sub">TRÌNH QUẢN TRỊ &amp; XUẤT BẢN ĐỒ ÁN CÔNG NGHỆ CAO // ZERO-BACKEND</div>
                                </div>
                            </div>
                            <button type="button" class="admin-close-btn" id="btn-admin-close" title="Đóng (Esc)">✕</button>
                        </div>

                        <!-- Content Layout -->
                        <div class="admin-body">
                            <!-- Sidebar: Project Selector -->
                            <div class="admin-sidebar">
                                <button type="button" class="admin-btn-new" id="btn-admin-new-project">
                                    ➕ Thêm Đồ Án Mới
                                </button>
                                <div class="admin-project-list-label">DANH MỤC ĐỒ ÁN (${this.getData().projects?.length || 0})</div>
                                <div class="admin-project-list" id="admin-project-items"></div>
                            </div>

                            <!-- Main Editor Form -->
                            <div class="admin-editor-panel">
                                <form id="admin-project-form">
                                    <!-- Row 1: ID, Title -->
                                    <div class="admin-form-row">
                                        <div class="admin-form-group">
                                            <label>ID Đồ Án (Kebab-case, duy nhất)</label>
                                            <input type="text" id="adm-p-id" required placeholder="vidu: smart-meter-iot" />
                                        </div>
                                        <div class="admin-form-group">
                                            <label>Tên Đồ Án Đầy Đủ</label>
                                            <input type="text" id="adm-p-name" required placeholder="vidu: Smart Grid IoT Power Meter" />
                                        </div>
                                    </div>

                                    <!-- Row 2: Category, Status, Parent Node -->
                                    <div class="admin-form-row">
                                        <div class="admin-form-group">
                                            <label>Chuyên Ngành (Category)</label>
                                            <select id="adm-p-category">
                                                <option value="vision">👁️ Computer Vision</option>
                                                <option value="audio">🎙️ Audio & Voice AI</option>
                                                <option value="iot">📡 FreeRTOS & IoT</option>
                                                <option value="dsp">⚡ SIMD Optimization</option>
                                                <option value="imu">🖐️ Motion & Gesture</option>
                                            </select>
                                        </div>
                                        <div class="admin-form-group">
                                            <label>Trạng Thái R&D</label>
                                            <select id="adm-p-status">
                                                <option value="Completed">✅ Completed</option>
                                                <option value="In Progress">🚧 In Progress</option>
                                                <option value="Architecture Design">📐 Architecture Design</option>
                                            </select>
                                        </div>
                                        <div class="admin-form-group">
                                            <label>Nút Cha Trên Cây 3D (Parent)</label>
                                            <select id="adm-p-parent">
                                                <option value="root-cpp">🏛️ Root C/C++ Bare-Metal</option>
                                                <option value="branch-vision">🌿 Branch: Computer Vision</option>
                                                <option value="branch-audio">🌿 Branch: Audio Voice AI</option>
                                                <option value="branch-iot">🌿 Branch: FreeRTOS & IoT</option>
                                                <option value="branch-hardware">🌿 Branch: SIMD DSP Optimization</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Row 3: Summary -->
                                    <div class="admin-form-group">
                                        <label>Tóm Tắt Tổng Quan (Summary)</label>
                                        <textarea id="adm-p-summary" rows="2" placeholder="Tóm tắt ngắn gọn bài toán kỹ thuật và giải pháp tối ưu..."></textarea>
                                    </div>

                                    <!-- Row 4: Tags -->
                                    <div class="admin-form-group">
                                        <label>Công Nghệ & Kỹ Năng Cốt Lõi (Cách nhau bằng dấu phẩy)</label>
                                        <input type="text" id="adm-p-tags" placeholder="ESP32-S3, FreeRTOS, TinyML, INT8 Quantization" />
                                    </div>

                                    <!-- Row 5: Benchmarks Grid -->
                                    <div class="admin-section-title">📊 THÔNG SỐ VẬN HÀNH THỰC TẾ (BENCHMARKS)</div>
                                    <div class="admin-form-row">
                                        <div class="admin-form-group">
                                            <label>Latency (ms)</label>
                                            <input type="text" id="adm-b-latency" placeholder="12.4 ms" />
                                        </div>
                                        <div class="admin-form-group">
                                            <label>SRAM Footprint</label>
                                            <input type="text" id="adm-b-sram" placeholder="48 KB" />
                                        </div>
                                        <div class="admin-form-group">
                                            <label>Flash Usage</label>
                                            <input type="text" id="adm-b-flash" placeholder="1.2 MB" />
                                        </div>
                                        <div class="admin-form-group">
                                            <label>FPS / Tần Số</label>
                                            <input type="text" id="adm-b-fps" placeholder="30 FPS" />
                                        </div>
                                    </div>

                                    <!-- Row 6: UART Logs -->
                                    <div class="admin-section-title">📟 NHẬT KÝ UART BOOT SERIAL (1 dòng/log)</div>
                                    <div class="admin-form-group">
                                        <textarea id="adm-p-uart" rows="3" placeholder="[BOOT] ESP32-S3 System Initialized&#10;[DMA] Buffer allocated 64KB&#10;[TINY] Model inference latency: 12ms"></textarea>
                                    </div>

                                    <!-- Row 7: Architecture -->
                                    <div class="admin-section-title">📐 KIẾN TRÚC & MÃ NGUỒN C/C++ MẪU</div>
                                    <div class="admin-form-row">
                                        <div class="admin-form-group">
                                            <label>Thách Thức Kỹ Thuật (Problem)</label>
                                            <textarea id="adm-arch-problem" rows="2"></textarea>
                                        </div>
                                        <div class="admin-form-group">
                                            <label>Giải Pháp Thiết Kế (Solution)</label>
                                            <textarea id="adm-arch-solution" rows="2"></textarea>
                                        </div>
                                    </div>
                                    <div class="admin-form-group">
                                        <label>Code C/C++ Thuật Toán Cốt Lõi</label>
                                        <textarea id="adm-code-snippet" rows="4" style="font-family: monospace; font-size: 11px;" placeholder="// Hàm tính toán tối ưu SIMD..."></textarea>
                                    </div>

                                    <!-- Bottom Action Buttons -->
                                    <div class="admin-footer-actions">
                                        <button type="submit" class="admin-btn-save" id="btn-admin-save">
                                            💾 Lưu &amp; Xem Trước Tức Thì
                                        </button>
                                        <button type="button" class="admin-btn-export" id="btn-admin-export">
                                            📋 Xuất Mã Nguồn JS
                                        </button>
                                        <button type="button" class="admin-btn-json" id="btn-admin-json">
                                            📥 Tải File JSON
                                        </button>
                                        <button type="button" class="admin-btn-delete" id="btn-admin-delete" style="display: none;">
                                            🗑️ Xóa Đồ Án
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);
                this.modalEl = modal;

                // Bind DOM events
                document.getElementById('btn-admin-close')?.addEventListener('click', () => this.close());
                document.getElementById('btn-admin-new-project')?.addEventListener('click', () => {
                    this.loadProjectIntoForm(null);
                });
                document.getElementById('btn-admin-export')?.addEventListener('click', () => this.copyExportCode());
                document.getElementById('btn-admin-json')?.addEventListener('click', () => this.downloadJSON());

                document.getElementById('admin-project-form')?.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmit();
                });

                document.getElementById('btn-admin-delete')?.addEventListener('click', () => {
                    if (this.currentEditingId) {
                        this.deleteProject(this.currentEditingId);
                    }
                });
            }
        }

        populateProjectList() {
            if (typeof document === 'undefined') return;
            const container = document.getElementById('admin-project-items');
            if (!container) return;

            const projects = this.getData().projects || [];
            container.innerHTML = projects.map(p => {
                const isActive = p.id === this.currentEditingId;
                return `
                    <div class="admin-proj-item ${isActive ? 'active' : ''}" onclick="PortfolioAdmin.loadProjectIntoForm('${p.id}')">
                        <div class="admin-proj-name">${p.name}</div>
                        <div class="admin-proj-meta">
                            <span class="admin-tag-cat">${p.category || 'iot'}</span>
                            <span class="admin-tag-status">${p.status || 'Completed'}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        loadProjectIntoForm(projectId) {
            if (typeof document === 'undefined') return;
            this.currentEditingId = projectId;

            const deleteBtn = document.getElementById('btn-admin-delete');
            const data = this.getData();
            const project = projectId ? (data.projects || []).find(p => p.id === projectId) : null;

            if (project) {
                if (deleteBtn) deleteBtn.style.display = 'inline-block';
                document.getElementById('adm-p-id').value = project.id || '';
                document.getElementById('adm-p-id').readOnly = true; // Lock ID on edit
                document.getElementById('adm-p-name').value = project.name || '';
                document.getElementById('adm-p-category').value = project.category || 'vision';
                document.getElementById('adm-p-status').value = project.status || 'Completed';
                document.getElementById('adm-p-parent').value = project.parent || 'branch-hardware';
                document.getElementById('adm-p-summary').value = project.summary || '';
                document.getElementById('adm-p-tags').value = (project.tags || []).join(', ');

                const b = project.benchmarks || {};
                document.getElementById('adm-b-latency').value = b.latency || '';
                document.getElementById('adm-b-sram').value = b.sramFootprint || '';
                document.getElementById('adm-b-flash').value = b.flashUsage || '';
                document.getElementById('adm-b-fps').value = b.fps || b.frequency || '';

                const logs = project.uartLogs || (project.interactiveDemo && project.interactiveDemo.logs) || [];
                document.getElementById('adm-p-uart').value = logs.join('\n');

                const arch = project.architecture || {};
                document.getElementById('adm-arch-problem').value = arch.problem || '';
                document.getElementById('adm-arch-solution').value = arch.solution || '';

                const impl = project.implementation || {};
                document.getElementById('adm-code-snippet').value = impl.code || '';
            } else {
                if (deleteBtn) deleteBtn.style.display = 'none';
                document.getElementById('adm-p-id').value = '';
                document.getElementById('adm-p-id').readOnly = false;
                document.getElementById('adm-p-name').value = '';
                document.getElementById('adm-p-category').value = 'vision';
                document.getElementById('adm-p-status').value = 'Completed';
                document.getElementById('adm-p-parent').value = 'branch-vision';
                document.getElementById('adm-p-summary').value = '';
                document.getElementById('adm-p-tags').value = '';
                document.getElementById('adm-b-latency').value = '';
                document.getElementById('adm-b-sram').value = '';
                document.getElementById('adm-b-flash').value = '';
                document.getElementById('adm-b-fps').value = '';
                document.getElementById('adm-p-uart').value = '';
                document.getElementById('adm-arch-problem').value = '';
                document.getElementById('adm-arch-solution').value = '';
                document.getElementById('adm-code-snippet').value = '';
            }

            this.populateProjectList();
        }

        handleFormSubmit() {
            if (typeof document === 'undefined') return;

            const id = document.getElementById('adm-p-id').value.trim();
            const name = document.getElementById('adm-p-name').value.trim();
            const category = document.getElementById('adm-p-category').value;
            const status = document.getElementById('adm-p-status').value;
            const parent = document.getElementById('adm-p-parent').value;
            const summary = document.getElementById('adm-p-summary').value.trim();
            const tags = document.getElementById('adm-p-tags').value.split(',').map(s => s.trim()).filter(Boolean);

            const benchmarks = {
                latency: document.getElementById('adm-b-latency').value.trim(),
                sramFootprint: document.getElementById('adm-b-sram').value.trim(),
                flashUsage: document.getElementById('adm-b-flash').value.trim(),
                fps: document.getElementById('adm-b-fps').value.trim()
            };

            const uartLogs = document.getElementById('adm-p-uart').value.split('\n').map(s => s.trim()).filter(Boolean);

            const projectObj = {
                id,
                name,
                category,
                status,
                parent,
                summary,
                tags,
                benchmarks,
                uartLogs,
                architecture: {
                    problem: document.getElementById('adm-arch-problem').value.trim(),
                    solution: document.getElementById('adm-arch-solution').value.trim()
                },
                implementation: {
                    file: 'src/main.c',
                    code: document.getElementById('adm-code-snippet').value
                }
            };

            this.saveProject(projectObj);
            alert(`✅ Đã lưu thành công dự án "${name}" vào bản xem trước (LocalStorage)!`);
            this.populateProjectList();
            this.loadProjectIntoForm(id);
        }
    }

    const PortfolioAdmin = new PortfolioAdminClass();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioAdmin;
    }
    if (typeof window !== 'undefined') {
        window.PortfolioAdmin = PortfolioAdmin;
        // Auto-init on load if in browser
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => PortfolioAdmin.init());
            } else {
                PortfolioAdmin.init();
            }
        }
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
