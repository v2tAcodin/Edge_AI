// ==========================================
// SAO LƯU, PHỤC HỒI & LỊCH SỬ PHIÊN BẢN (PHASE 3 & 4)
// Auto-Backup, Rolling History (5 versions), Markdown Notes Export/Import
// ==========================================

const STORAGE_BACKUP_HISTORY = "mr_thai_backup_history_v1";
const MAX_BACKUP_SNAPSHOTS = 5;
const AUTO_BACKUP_INTERVAL_MS = 5 * 60 * 1000; // 5 phút

// 1. Xuất file JSON thủ công
function exportBackupData() {
    const backupPayload = createBackupSnapshotPayload("Thủ công");
    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mr_thai_edge_ai_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📥 Đã tải xuống file sao lưu đầy đủ!");
}

// 2. Tạo Snapshot Payload
function createBackupSnapshotPayload(reason = "Tự động") {
    return {
        version: "3.0",
        timestamp: Date.now(),
        reason: reason,
        exportDate: new Date().toLocaleString("vi-VN"),
        user: (typeof profile !== 'undefined' && profile.name) ? profile.name : "Mr. Thai",
        xp: (typeof profile !== 'undefined' && profile.xp) ? profile.xp : 0,
        profile: (typeof profile !== 'undefined') ? profile : {},
        roadmap: (typeof roadmap !== 'undefined') ? roadmap : [],
        notes: (typeof notes !== 'undefined') ? notes : {},
        studyStreak: (typeof studyStreak !== 'undefined') ? studyStreak : 1,
        codeCache: (typeof codeCache !== 'undefined') ? codeCache : {}
    };
}

// 3. Tự động lưu Snapshot (Rolling 5 bản gần nhất)
function saveAutoBackupSnapshot(reason = "Tự động") {
    try {
        const history = getBackupHistory();
        const newSnapshot = createBackupSnapshotPayload(reason);

        // Thêm vào đầu danh sách
        history.unshift(newSnapshot);

        // Giữ tối đa MAX_BACKUP_SNAPSHOTS
        if (history.length > MAX_BACKUP_SNAPSHOTS) {
            history.length = MAX_BACKUP_SNAPSHOTS;
        }

        localStorage.setItem(STORAGE_BACKUP_HISTORY, JSON.stringify(history));
    } catch (e) {
        console.warn("[Auto-Backup] Lưu snapshot thất bại (bộ nhớ đầy?):", e);
    }
}

// 4. Lấy lịch sử Snapshot
function getBackupHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_BACKUP_HISTORY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

// 5. Khôi phục từ Snapshot đã lưu
function restoreBackupSnapshot(timestamp) {
    const history = getBackupHistory();
    const snapshot = history.find(s => s.timestamp === timestamp);
    if (!snapshot) {
        alert("Không tìm thấy bản sao lưu này!");
        return;
    }

    if (!confirm(`Khôi phục dữ liệu về bản sao lưu lúc ${snapshot.exportDate} (${snapshot.reason})?`)) {
        return;
    }

    applyRestoredData(snapshot);
    closeBackupHistoryModal();
    showToast(`🎉 Đã khôi phục về phiên bản lúc ${snapshot.exportDate}!`);
}

// 6. Áp dụng dữ liệu khôi phục vào State & Storage
function applyRestoredData(data) {
    if (data.profile) {
        profile = data.profile;
        localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
    }
    if (data.roadmap) {
        roadmap = data.roadmap;
        localStorage.setItem(STORAGE_ROADMAP, JSON.stringify(roadmap));
    }
    if (data.notes) {
        notes = data.notes;
        localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
    }
    if (data.studyStreak) {
        studyStreak = data.studyStreak;
        localStorage.setItem(STORAGE_STREAK, JSON.stringify(studyStreak));
    }
    if (data.codeCache) {
        codeCache = data.codeCache;
        localStorage.setItem(STORAGE_CODE_CACHE, JSON.stringify(codeCache));
    }

    // Re-render UI
    if (typeof renderRoadmap === 'function') renderRoadmap();
    if (typeof renderNotes === 'function') renderNotes();
    if (typeof renderPracticeView === 'function') renderPracticeView();
    if (typeof renderProfileView === 'function') renderProfileView();
    if (typeof generateDailyDecision === 'function') generateDailyDecision(false);
    if (typeof updatePortalStats === 'function') updatePortalStats();
    if (typeof renderLearningHeatmap === 'function') renderLearningHeatmap();
    if (typeof updateAnalyticsStats === 'function') updateAnalyticsStats();
}

// 7. Nhập file JSON từ máy
function handleRestoreFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            applyRestoredData(data);
            // Lưu lại 1 snapshot trước khi nạp mới
            saveAutoBackupSnapshot("Trước khi nạp file");
            showToast("🎉 Phục hồi dữ liệu thành công từ file JSON!");
        } catch(err) {
            alert("Lỗi đọc file JSON: " + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

// 8. Modal Quản lý Lịch sử Phiên bản
function openBackupHistoryModal() {
    let overlay = document.getElementById("vh-modal-overlay");
    if (!overlay) {
        overlay = createBackupHistoryModalDOM();
    }
    renderBackupHistoryList();
    overlay.classList.add("open");
}

function closeBackupHistoryModal() {
    const overlay = document.getElementById("vh-modal-overlay");
    if (overlay) overlay.classList.remove("open");
}

function createBackupHistoryModalDOM() {
    const overlay = document.createElement("div");
    overlay.id = "vh-modal-overlay";
    overlay.className = "vh-modal-overlay";
    overlay.innerHTML = `
        <div class="vh-modal">
            <div class="vh-header">
                <div class="vh-title">
                    <span>🕒</span> Lịch Sử Sao Lưu &amp; Khôi Phục (5 Bản Gần Nhất)
                </div>
                <button class="btn btn-secondary" onclick="closeBackupHistoryModal()" style="padding: 4px 8px;">✕</button>
            </div>
            <div class="vh-list" id="vh-history-list"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 14px;">
                <button class="btn btn-primary" onclick="saveAutoBackupSnapshot('Tạo thủ công'); renderBackupHistoryList(); showToast('Đã lưu điểm khôi phục mới!');">
                    ➕ Tạo Điểm Khôi Phục Mới
                </button>
                <button class="btn btn-secondary" onclick="exportBackupData()">
                    📥 Tải JSON
                </button>
            </div>
        </div>
    `;

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeBackupHistoryModal();
    });

    document.body.appendChild(overlay);
    return overlay;
}

function renderBackupHistoryList() {
    const listEl = document.getElementById("vh-history-list");
    if (!listEl) return;

    const history = getBackupHistory();
    if (history.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 24px;">
                Chưa có bản sao lưu lịch sử nào.<br>Hệ thống tự động sao lưu mỗi 5 phút hoặc khi bạn nhấn tạo mới.
            </div>
        `;
        return;
    }

    listEl.innerHTML = history.map((snap) => {
        const sizeKb = (JSON.stringify(snap).length / 1024).toFixed(1);
        return `
            <div class="vh-item">
                <div class="vh-item-info">
                    <div class="vh-item-date">${snap.exportDate}</div>
                    <div class="vh-item-meta">
                        <span class="badge badge-gold" style="font-size:10px;">${snap.reason}</span>
                        • ${sizeKb} KB • ${snap.xp || 0} XP
                    </div>
                </div>
                <button class="btn btn-accent" onclick="restoreBackupSnapshot(${snap.timestamp})" style="padding: 5px 12px; font-size: 12px;">
                    ↺ Khôi phục
                </button>
            </div>
        `;
    }).join("");
}

// 9. PHASE 4: Export Ghi Chú ra Markdown (.md)
function exportNotesMarkdown() {
    if (typeof notes === 'undefined' || Object.keys(notes).length === 0) {
        showToast("⚠️ Bạn chưa có ghi chú nào để xuất!");
        return;
    }

    let md = `# SỔ TAY GHI CHÚ KỸ SƯ EDGE AI // MR. THAI\n\n`;
    md += `*Xuất ngày: ${new Date().toLocaleString("vi-VN")}*\n\n---\n\n`;

    for (const [key, noteText] of Object.entries(notes)) {
        if (!noteText || !noteText.trim()) continue;
        md += `## 📌 Ghi chú: ${key}\n\n`;
        md += `${noteText.trim()}\n\n---\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edge_ai_notes_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📝 Đã xuất ghi chú ra file Markdown (.md)!");
}

// 10. Tự động sao lưu định kỳ mỗi 5 phút
setInterval(() => {
    saveAutoBackupSnapshot("Định kỳ 5 phút");
}, AUTO_BACKUP_INTERVAL_MS);

// Tạo 1 bản ban đầu khi tải trang
setTimeout(() => {
    const history = getBackupHistory();
    if (history.length === 0) {
        saveAutoBackupSnapshot("Khởi tạo ban đầu");
    }
}, 3000);
