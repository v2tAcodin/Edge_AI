// ================================================= */
// SỔ GHI CHÚ NHANH (QUICK NOTES // SCRATCHPAD & REMINDERS)
// Minimalist, Lightweight, Offline First (LocalStorage)
// ================================================= */

(function(root) {
    'use strict';

    const STORAGE_KEY = "mr_thai_quick_notes_v1";

    // Danh sách ghi chú mẫu ban đầu hữu ích cho Kỹ sư Edge AI
    const defaultNotes = [
        {
            id: "note_init_1",
            title: "⚡ Lệnh biên dịch & nạp firmware ESP32-S3 (ESP-IDF v5.x)",
            content: "idf.py set-target esp32s3\nidf.py menuconfig\nidf.py build flash monitor\n# Phím tắt thoát terminal monitor: Ctrl + ]",
            category: "urgent",
            pinned: true,
            createdAt: Date.now() - 3600000 * 24,
            updatedAt: Date.now() - 3600000 * 24
        },
        {
            id: "note_init_2",
            title: "📋 Checklist trước khi nghiệm thu đồ án Edge AI",
            content: "- [x] Căn lề 16-byte cho Tensor Arena TinyML (__attribute__((aligned(16))))\n- [x] Ghim Task suy luận AI vào Core 1 (xTaskCreatePinnedToCore)\n- [ ] Kiểm tra tràn bộ nhớ Heap với esp_get_free_heap_size()\n- [ ] Chuẩn bị kịch bản thuyết trình kiến trúc DMA & FreeRTOS",
            category: "todo",
            pinned: true,
            createdAt: Date.now() - 3600000 * 12,
            updatedAt: Date.now() - 3600000 * 12
        },
        {
            id: "note_init_3",
            title: "💡 Ý tưởng tối ưu âm thanh Voice AI",
            content: "Sử dụng Ring Buffer DMA kết hợp giao thức I2S đọc trực tiếp từ micro INMP441, sau đó tính toán FFT phổ tần số trên Core 1 bằng tập lệnh SIMD DSP để đạt độ trễ < 50ms.",
            category: "idea",
            pinned: false,
            createdAt: Date.now() - 3600000 * 4,
            updatedAt: Date.now() - 3600000 * 4
        }
    ];

    let notes = [];
    let activeFilter = "all";
    let searchQuery = "";
    let editingId = null;
    let selectedCat = "general";
    let isPinned = false;

    // Load data from LocalStorage
    function load() {
        try {
            if (typeof localStorage === 'undefined') {
                notes = [...defaultNotes];
                return;
            }
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                notes = JSON.parse(raw);
            } else {
                notes = [...defaultNotes];
                save();
            }
        } catch (e) {
            console.warn("Lỗi đọc ghi chú từ LocalStorage:", e);
            notes = [...defaultNotes];
        }
    }

    // Save to LocalStorage
    function save() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
            }
            updateBadges();
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                window.dispatchEvent(new CustomEvent("quicknotes:changed", { detail: { notes } }));
            }
        } catch (e) {
            console.error("Lỗi lưu ghi chú:", e);
        }
    }

    function init() {
        load();
        render();
        bindGlobalKeys();
        updateBadges();

        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener("storage", (e) => {
                if (e.key === STORAGE_KEY) {
                    load();
                    render();
                }
            });
        }
    }

    function bindGlobalKeys() {
        if (typeof document === 'undefined' || typeof document.addEventListener !== 'function') return;

        document.addEventListener("keydown", (e) => {
            // Alt + N hoặc Ctrl + Shift + N: Mở/đóng nhanh sổ ghi chú
            if ((e.altKey && (e.key === 'n' || e.key === 'N')) || 
                (e.ctrlKey && e.shiftKey && (e.key === 'n' || e.key === 'N'))) {
                e.preventDefault();
                toggle();
            }
            // Escape: Đóng nếu đang mở
            if (e.key === "Escape" && isOpen()) {
                close();
            }
        });
    }

    function isOpen() {
        if (typeof document === 'undefined') return false;
        const drawer = document.getElementById("quick-notes-drawer");
        return drawer && drawer.classList.contains("open");
    }

    function open() {
        if (typeof document === 'undefined') return;
        const drawer = document.getElementById("quick-notes-drawer");
        const backdrop = document.getElementById("qn-backdrop");
        if (!drawer || !backdrop) return;

        drawer.classList.add("open");
        backdrop.classList.add("open");
        if (typeof AudioEngine !== "undefined" && AudioEngine.playSFX) {
            AudioEngine.playSFX("tab");
        }
        updateBadges();

        setTimeout(() => {
            const input = document.getElementById("qn-compose-content");
            if (input) input.focus();
        }, 150);
    }

    function close() {
        if (typeof document === 'undefined') return;
        const drawer = document.getElementById("quick-notes-drawer");
        const backdrop = document.getElementById("qn-backdrop");
        if (drawer) drawer.classList.remove("open");
        if (backdrop) backdrop.classList.remove("open");
        editingId = null;
    }

    function toggle() {
        if (isOpen()) {
            close();
        } else {
            open();
        }
    }

    function selectCategory(cat) {
        selectedCat = cat;
        if (typeof document === 'undefined') return;
        document.querySelectorAll(".qn-cat-pill").forEach(p => {
            if (p.getAttribute("data-cat") === cat) {
                p.classList.add("selected");
            } else {
                p.classList.remove("selected");
            }
        });
    }

    function toggleNewPin() {
        isPinned = !isPinned;
        if (typeof document === 'undefined') return;
        const btn = document.getElementById("qn-new-pin-btn");
        if (btn) {
            btn.classList.toggle("active", isPinned);
            btn.innerHTML = isPinned ? "⭐ Đã ghim" : "☆ Ghim";
        }
    }

    function addNote() {
        if (typeof document === 'undefined') return;
        const titleEl = document.getElementById("qn-compose-title");
        const contentEl = document.getElementById("qn-compose-content");
        if (!contentEl) return;

        const content = contentEl.value.trim();
        let title = titleEl ? titleEl.value.trim() : "";

        if (!content && !title) {
            if (typeof showToast === "function") {
                showToast("⚠️ Vui lòng nhập nội dung ghi chú cần nhớ!");
            }
            contentEl.focus();
            return;
        }

        if (!title) {
            const firstLine = content.split("\n")[0];
            title = firstLine.length > 50 ? firstLine.substring(0, 50) + "..." : firstLine;
        }

        const newNote = {
            id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
            title: title,
            content: content,
            category: selectedCat || "general",
            pinned: isPinned,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        notes.unshift(newNote);
        save();
        render();

        if (titleEl) titleEl.value = "";
        contentEl.value = "";
        isPinned = false;
        const pinBtn = document.getElementById("qn-new-pin-btn");
        if (pinBtn) {
            pinBtn.classList.remove("active");
            pinBtn.innerHTML = "☆ Ghim";
        }
        selectCategory("general");

        if (typeof showToast === "function") {
            showToast("💾 Đã lưu ghi chú thành công!");
        }
    }

    function deleteNote(id) {
        const target = notes.find(n => n.id === id);
        if (!target) return;

        const confirmMsg = `Bạn có chắc muốn xóa ghi chú "${target.title || 'này'}"?`;
        if (typeof confirm === 'function' && !confirm(confirmMsg)) {
            return;
        }

        notes = notes.filter(n => n.id !== id);
        save();
        render();
        if (typeof showToast === "function") {
            showToast("🗑️ Đã xóa ghi chú!");
        }
    }

    function togglePin(id) {
        const note = notes.find(n => n.id === id);
        if (note) {
            note.pinned = !note.pinned;
            note.updatedAt = Date.now();
            save();
            render();
            if (typeof showToast === "function") {
                showToast(note.pinned ? "⭐ Đã ghim ghi chú lên đầu!" : "Đã bỏ ghim ghi chú");
            }
        }
    }

    function copyNote(id) {
        const note = notes.find(n => n.id === id);
        if (!note) return;

        const text = (note.title ? note.title + "\n\n" : "") + note.content;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                if (typeof showToast === "function") {
                    showToast("📋 Đã sao chép nội dung ghi chú vào Clipboard!");
                }
            });
        }
    }

    function startEdit(id) {
        editingId = id;
        render();
        if (typeof document !== 'undefined') {
            setTimeout(() => {
                const input = document.getElementById(`qn-edit-content-${id}`);
                if (input) input.focus();
            }, 50);
        }
    }

    function cancelEdit() {
        editingId = null;
        render();
    }

    function saveEdit(id) {
        if (typeof document === 'undefined') return;
        const titleEl = document.getElementById(`qn-edit-title-${id}`);
        const contentEl = document.getElementById(`qn-edit-content-${id}`);
        const catEl = document.getElementById(`qn-edit-cat-${id}`);
        if (!contentEl) return;

        const note = notes.find(n => n.id === id);
        if (!note) return;

        note.title = titleEl ? titleEl.value.trim() : note.title;
        note.content = contentEl.value.trim();
        if (catEl) note.category = catEl.value;
        note.updatedAt = Date.now();

        editingId = null;
        save();
        render();

        if (typeof showToast === "function") {
            showToast("✓ Đã cập nhật ghi chú!");
        }
    }

    function toggleTodoLine(noteId, lineIndex) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;

        const lines = note.content.split("\n");
        if (lines[lineIndex] !== undefined) {
            let line = lines[lineIndex];
            if (line.includes("- [ ]")) {
                lines[lineIndex] = line.replace("- [ ]", "- [x]");
            } else if (line.includes("- [x]")) {
                lines[lineIndex] = line.replace("- [x]", "- [ ]");
            } else if (line.includes("[ ]")) {
                lines[lineIndex] = line.replace("[ ]", "[x]");
            } else if (line.includes("[x]")) {
                lines[lineIndex] = line.replace("[x]", "[ ]");
            }
            note.content = lines.join("\n");
            note.updatedAt = Date.now();
            save();
            render();
        }
    }

    function setFilter(cat) {
        activeFilter = cat;
        if (typeof document !== 'undefined') {
            document.querySelectorAll(".qn-filter-pill").forEach(p => {
                if (p.getAttribute("data-filter") === cat) {
                    p.classList.add("active");
                } else {
                    p.classList.remove("active");
                }
            });
        }
        render();
    }

    function handleSearch(val) {
        searchQuery = val.trim().toLowerCase();
        if (typeof document !== 'undefined') {
            const clearBtn = document.getElementById("qn-search-clear");
            if (clearBtn) {
                clearBtn.style.display = searchQuery ? "block" : "none";
            }
        }
        render();
    }

    function clearSearch() {
        searchQuery = "";
        if (typeof document !== 'undefined') {
            const input = document.getElementById("qn-search-input");
            if (input) input.value = "";
            const clearBtn = document.getElementById("qn-search-clear");
            if (clearBtn) clearBtn.style.display = "none";
        }
        render();
    }

    function formatDate(ts) {
        if (!ts) return "";
        const d = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        
        if (isToday) {
            return `Hôm nay ${hours}:${mins}`;
        }
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        return `${day}/${month} ${hours}:${mins}`;
    }

    function renderBodyHtml(content, noteId) {
        if (!content) return "";
        const lines = content.split("\n");
        let html = "";

        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("- [ ]") || trimmed.startsWith("[ ]")) {
                const text = line.replace(/^-\s*\[ \]/, "").replace(/^\[ \]/, "");
                html += `
                    <div class="qn-todo-row" onclick="QuickNotes.toggleTodoLine('${noteId}', ${idx})">
                        <input type="checkbox" class="qn-todo-check" onclick="event.stopPropagation(); QuickNotes.toggleTodoLine('${noteId}', ${idx})">
                        <span>${escapeHtml(text)}</span>
                    </div>
                `;
            } else if (trimmed.startsWith("- [x]") || trimmed.startsWith("[x]")) {
                const text = line.replace(/^-\s*\[x\]/i, "").replace(/^\[x\]/i, "");
                html += `
                    <div class="qn-todo-row qn-todo-done" onclick="QuickNotes.toggleTodoLine('${noteId}', ${idx})">
                        <input type="checkbox" class="qn-todo-check" checked onclick="event.stopPropagation(); QuickNotes.toggleTodoLine('${noteId}', ${idx})">
                        <span>${escapeHtml(text)}</span>
                    </div>
                `;
            } else if (trimmed.startsWith("idf.py") || trimmed.startsWith("git ") || trimmed.startsWith("npm ") || trimmed.startsWith("#include") || trimmed.startsWith("sudo ")) {
                html += `<div class="qn-card-code">${escapeHtml(line)}</div>`;
            } else {
                html += `<div>${linkify(escapeHtml(line))}</div>`;
            }
        });

        return html;
    }

    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function linkify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    }

    function getCategoryLabel(cat) {
        switch (cat) {
            case "urgent": return { text: "⚡ Gấp", class: "urgent" };
            case "todo": return { text: "📋 Việc cần làm", class: "todo" };
            case "idea": return { text: "💡 Ý tưởng", class: "idea" };
            case "code": return { text: "💻 Lệnh / Code", class: "code" };
            default: return { text: "📌 Chung", class: "general" };
        }
    }

    function render() {
        if (typeof document === 'undefined') return;
        const container = document.getElementById("qn-notes-list");
        if (!container) return;

        let filtered = notes.filter(n => {
            if (activeFilter === "pinned" && !n.pinned) return false;
            if (activeFilter !== "all" && activeFilter !== "pinned" && n.category !== activeFilter) return false;

            if (searchQuery) {
                const q = searchQuery;
                const matchTitle = n.title && n.title.toLowerCase().includes(q);
                const matchContent = n.content && n.content.toLowerCase().includes(q);
                const matchCat = n.category && n.category.toLowerCase().includes(q);
                if (!matchTitle && !matchContent && !matchCat) return false;
            }

            return true;
        });

        filtered.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="qn-empty-state">
                    <div class="qn-empty-icon">📝</div>
                    <div class="qn-empty-title">
                        ${searchQuery ? `Không tìm thấy ghi chú nào khớp với "${escapeHtml(searchQuery)}"` : 'Chưa có ghi chú nào ở mục này'}
                    </div>
                    <div class="qn-empty-desc">
                        ${searchQuery ? 'Thử tìm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.' : 'Nhập nội dung vào khung bên trên để ghi nhớ tất cả những gì quan trọng!'}
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(note => {
            const isEditing = editingId === note.id;
            const catInfo = getCategoryLabel(note.category);
            const dateStr = formatDate(note.updatedAt || note.createdAt);

            if (isEditing) {
                return `
                    <div class="qn-card ${note.pinned ? 'pinned' : ''}" data-cat="${note.category || 'general'}">
                        <div class="qn-inline-edit">
                            <input type="text" class="qn-inline-input" id="qn-edit-title-${note.id}" value="${escapeHtml(note.title)}" placeholder="Tiêu đề...">
                            <textarea class="qn-inline-textarea" id="qn-edit-content-${note.id}" rows="5" placeholder="Nội dung...">${escapeHtml(note.content)}</textarea>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                                <select id="qn-edit-cat-${note.id}" class="qn-inline-input" style="padding: 4px 8px; font-size: 11px;">
                                    <option value="general" ${note.category === 'general' ? 'selected' : ''}>📌 Chung</option>
                                    <option value="urgent" ${note.category === 'urgent' ? 'selected' : ''}>⚡ Cần nhớ gấp</option>
                                    <option value="todo" ${note.category === 'todo' ? 'selected' : ''}>📋 Việc cần làm</option>
                                    <option value="idea" ${note.category === 'idea' ? 'selected' : ''}>💡 Ý tưởng</option>
                                    <option value="code" ${note.category === 'code' ? 'selected' : ''}>💻 Lệnh / Code</option>
                                </select>
                                <div class="qn-inline-actions">
                                    <button type="button" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;" onclick="QuickNotes.cancelEdit()">Hủy</button>
                                    <button type="button" class="btn btn-accent" style="font-size: 11px; padding: 4px 10px;" onclick="QuickNotes.saveEdit('${note.id}')">💾 Lưu</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="qn-card ${note.pinned ? 'pinned' : ''}" data-cat="${note.category || 'general'}">
                    <div class="qn-card-top">
                        <div class="qn-card-meta">
                            <span class="qn-badge-tag ${catInfo.class}">${catInfo.text}</span>
                            <span class="qn-card-date">${dateStr}</span>
                            ${note.pinned ? '<span style="color: #fbbf24; font-size: 11px;" title="Ghi chú được ghim">★ Ghim</span>' : ''}
                        </div>
                        <div class="qn-card-btns">
                            <button type="button" class="qn-card-btn pin-btn ${note.pinned ? 'active' : ''}" onclick="QuickNotes.togglePin('${note.id}')" title="${note.pinned ? 'Bỏ ghim' : 'Ghim lên đầu'}">
                                ${note.pinned ? '★' : '☆'}
                            </button>
                            <button type="button" class="qn-card-btn" onclick="QuickNotes.copyNote('${note.id}')" title="Sao chép nội dung">
                                📋
                            </button>
                            <button type="button" class="qn-card-btn" onclick="QuickNotes.startEdit('${note.id}')" title="Chỉnh sửa">
                                ✏️
                            </button>
                            <button type="button" class="qn-card-btn delete-btn" onclick="QuickNotes.deleteNote('${note.id}')" title="Xóa ghi chú">
                                🗑️
                            </button>
                        </div>
                    </div>

                    ${note.title ? `<div class="qn-card-title">${escapeHtml(note.title)}</div>` : ''}
                    <div class="qn-card-body">${renderBodyHtml(note.content, note.id)}</div>
                </div>
            `;
        }).join("");
    }

    function updateBadges() {
        if (typeof document === 'undefined') return;
        const total = notes.length;
        const urgentCount = notes.filter(n => n.category === "urgent").length;

        const pill = document.getElementById("qn-header-count-pill");
        if (pill) pill.innerText = `${total} ghi chú`;

        const headerBadge = document.getElementById("notes-header-counter");
        if (headerBadge) {
            if (total > 0) {
                headerBadge.innerText = total;
                headerBadge.style.display = "inline-block";
            } else {
                headerBadge.style.display = "none";
            }
        }

        const dockBadge = document.getElementById("dock-notes-count-badge");
        if (dockBadge) {
            if (total > 0) {
                dockBadge.innerText = total;
                dockBadge.style.display = "flex";
            } else {
                dockBadge.style.display = "none";
            }
        }

        const bottomStatus = document.getElementById("qn-bottom-status");
        if (bottomStatus) {
            bottomStatus.innerText = `${total} ghi chú${urgentCount > 0 ? ` • ${urgentCount} cần nhớ gấp` : ''}`;
        }
    }

    function exportMarkdown() {
        if (notes.length === 0) {
            alert("Chưa có ghi chú nào để xuất!");
            return;
        }

        let md = `# SỔ GHI CHÚ // PROJECT THAI (KỸ SƯ THAI)\n`;
        md += `*Thời gian xuất: ${new Date().toLocaleString("vi-VN")}*\n\n---\n\n`;

        notes.forEach((n, idx) => {
            const cat = getCategoryLabel(n.category).text;
            const date = new Date(n.updatedAt || n.createdAt).toLocaleString("vi-VN");
            md += `### ${idx + 1}. ${n.title || 'Ghi chú không tiêu đề'}\n`;
            md += `- **Phân loại:** ${cat}\n`;
            md += `- **Cập nhật:** ${date}\n`;
            md += `- **Ghim:** ${n.pinned ? 'Có' : 'Không'}\n\n`;
            md += `${n.content}\n\n---\n\n`;
        });

        downloadFile(md, `ghi-chu-project-thai-${new Date().toISOString().slice(0, 10)}.md`, "text/markdown");
        if (typeof showToast === "function") {
            showToast("📥 Đã tải file ghi chú Markdown thành công!");
        }
    }

    function exportJson() {
        const json = JSON.stringify(notes, null, 2);
        downloadFile(json, `backup-notes-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
        if (typeof showToast === "function") {
            showToast("📥 Đã tải file sao lưu JSON!");
        }
    }

    function triggerImportJson() {
        if (typeof document === 'undefined') return;
        const input = document.getElementById("qn-file-import");
        if (input) {
            input.value = "";
            input.click();
        }
    }

    function handleFileImport(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error("File không đúng cấu trúc danh sách ghi chú.");
                }
                let addedCount = 0;
                imported.forEach(item => {
                    if (item.content || item.title) {
                        const existingIdx = notes.findIndex(n => n.id === item.id);
                        if (existingIdx >= 0) {
                            notes[existingIdx] = item;
                        } else {
                            notes.unshift(item);
                            addedCount++;
                        }
                    }
                });
                save();
                render();
                if (typeof showToast === "function") {
                    showToast(`✓ Đã nạp thành công ${addedCount} ghi chú mới!`);
                }
            } catch (err) {
                alert("Lỗi đọc file: " + err.message);
            }
        };
        reader.readAsText(file);
    }

    function downloadFile(content, fileName, mimeType) {
        if (typeof document === 'undefined') return;
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function clearAll() {
        if (typeof confirm === 'function' && !confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa TOÀN BỘ ghi chú không?")) {
            return;
        }
        notes = [];
        save();
        render();
        if (typeof showToast === "function") {
            showToast("Đã dọn sạch tất cả ghi chú");
        }
    }

    const QuickNotes = {
        init,
        open,
        close,
        toggle,
        addNote,
        deleteNote,
        togglePin,
        copyNote,
        startEdit,
        cancelEdit,
        saveEdit,
        toggleTodoLine,
        selectCategory,
        toggleNewPin,
        setFilter,
        handleSearch,
        clearSearch,
        exportMarkdown,
        exportJson,
        triggerImportJson,
        handleFileImport,
        clearAll,
        getNotes: () => [...notes]
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuickNotes;
    }
    if (typeof window !== 'undefined') {
        window.QuickNotes = QuickNotes;
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => QuickNotes.init());
            } else {
                QuickNotes.init();
            }
        }
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
