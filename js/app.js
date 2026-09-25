// ==========================================
// 11. APP ENTRY POINT & ROUTING
// ==========================================
const STORAGE_THEME = "mr_thai_theme_v1";

function switchTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active", "active-menu"));
    document.querySelectorAll("#view-menu, #view-simulator, #view-learning, #view-practice, #view-profile, #view-interview, #view-notebook, #view-projects").forEach(v => {
        if (v) {
            v.style.display = "none";
            v.classList.remove("view-enter");
        }
    });

    // Helper: show view with fade-in animation
    function showView(viewId) {
        const el = document.getElementById(viewId);
        if (!el) return;
        el.style.display = "block";
        // Force reflow to re-trigger animation
        void el.offsetHeight;
        el.classList.add("view-enter");
    }

    if (tabId === 'menu') {
        document.getElementById("tab-menu").classList.add("active", "active-menu");
        showView("view-menu");
    } else if (tabId === 'learning') {
        document.getElementById("tab-learning").classList.add("active");
        showView("view-learning");
        renderRoadmap();
    } else if (tabId === 'practice') {
        document.getElementById("tab-practice").classList.add("active");
        showView("view-practice");
        renderPracticeView();
    } else if (tabId === 'projects') {
        const tabEl = document.getElementById("tab-projects");
        if (tabEl) tabEl.classList.add("active");
        showView("view-projects");
        if (typeof renderProjectsView === 'function') renderProjectsView();
    } else if (tabId === 'simulator') {
        document.getElementById("tab-simulator").classList.add("active");
        showView("view-simulator");
        updateSramSimulation();
    } else if (tabId === 'interview') {
        const tabEl = document.getElementById("tab-interview");
        if (tabEl) tabEl.classList.add("active");
        showView("view-interview");
        renderInterviewArena();
    } else if (tabId === 'notebook') {
        const tabEl = document.getElementById("tab-notebook");
        if (tabEl) tabEl.classList.add("active");
        showView("view-notebook");
        if (typeof renderNotebookView === 'function') renderNotebookView();
    } else if (tabId === 'profile') {
        document.getElementById("tab-profile").classList.add("active");
        showView("view-profile");
        renderProfileView();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openTiengAnhRaTruong() {
    window.open('https://tienganhratruong.com/dashboard', '_blank');
}

function updatePortalStats() {
    const stats = calculateStats();
    const portalRoadmap = document.getElementById("portal-roadmap-stat");
    if (portalRoadmap) portalRoadmap.innerText = `${stats.completedTasks}/${stats.totalTasks} Hoàn thành`;

    const portalCode = document.getElementById("portal-code-stat");
    const solvedCount = profile.solvedProblems ? profile.solvedProblems.length : 0;
    if (portalCode) portalCode.innerText = `${solvedCount}/${practiceExercises.length} Bài • ${profile.xp} XP`;

    const portalRank = document.getElementById("portal-rank-stat");
    if (portalRank) portalRank.innerText = `${stats.rank.code} • ${stats.percent}%`;

    if (typeof renderProjectsView === 'function') renderProjectsView();
}

function showToast(message) {
    const toast = document.getElementById("toast-msg");
    if (!toast) return;
    toast.innerText = "✓ " + message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// DARK / LIGHT THEME TOGGLE (Phase 2)
// ==========================================
function getPreferredTheme() {
    // 1. Saved preference
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved) return saved;
    // 2. System preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
    }
    return "dark";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);

    // Update toggle button icon
    document.querySelectorAll(".btn-theme-toggle").forEach(btn => {
        btn.innerHTML = theme === "light" ? "☀️" : "🌙";
        btn.title = theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng";
    });

    // Update meta theme-color for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute("content", theme === "light" ? "#f0f2f7" : "#070b14");
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    showToast(next === "light" ? "☀️ Chế độ sáng" : "🌙 Chế độ tối");
}

// ==========================================
// SCROLL PROGRESS INDICATOR (Phase 2)
// ==========================================
function initScrollProgress() {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + "%";
    }, { passive: true });
}

// ==========================================
// PWA Install Prompt Listener
// ==========================================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('btn-install-pwa');
    if (btn) btn.style.display = 'inline-block';
});

function installPwaApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showToast("Đã cài đặt ứng dụng Edge AI Hub lên thiết bị của bạn!");
            }
            deferredPrompt = null;
        });
    }
}

// ==========================================
// KHỞI CHẠY LẦN ĐẦU KHI DOM SẴN SÀNG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Apply saved theme
    applyTheme(getPreferredTheme());

    // Init scroll progress
    initScrollProgress();

    // Existing init calls
    renderQuote(0);
    renderRoadmap();
    renderNotes();
    generateDailyDecision(false);
    updatePortalStats();
    updatePomoDisplay();
    updateSramSimulation();
    if (typeof renderCheatSheet === 'function') renderCheatSheet();
    if (typeof renderInterviewArena === 'function') renderInterviewArena();
    if (typeof renderNotebookView === 'function') renderNotebookView();
    if (typeof renderProjectsView === 'function') renderProjectsView();
    if (typeof initHexMemoryModule === 'function') initHexMemoryModule();
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
        // Only auto-switch if user hasn't manually set preference
        if (!localStorage.getItem(STORAGE_THEME)) {
            applyTheme(e.matches ? "light" : "dark");
        }
    });
}

// ==========================================
// KEYBOARD SHORTCUTS (Phase 1 + 2)
// ==========================================
document.addEventListener("keydown", (e) => {
    // Không kích hoạt shortcuts khi đang gõ trong input/textarea
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) {
        // Exception: Escape should always work to close overlays
        if (e.key === "Escape") {
            // Close search if open
            if (typeof closeGlobalSearch === "function") {
                const searchOverlay = document.getElementById("search-overlay");
                if (searchOverlay && searchOverlay.classList.contains("open")) {
                    closeGlobalSearch();
                    return;
                }
            }
        }
        return;
    }

    // Không kích hoạt khi auth overlay đang hiện
    const authOverlay = document.getElementById("auth-overlay");
    if (authOverlay && !authOverlay.classList.contains("auth-hidden")) return;

    // Ctrl+K — Mở tìm kiếm toàn cục
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (typeof openGlobalSearch === "function") {
            openGlobalSearch();
        }
        return;
    }

    // Ctrl+S — Lưu sao lưu nhanh
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (typeof exportBackupData === "function") exportBackupData();
        return;
    }

    // Escape — Đóng modal, drawer, overlay
    if (e.key === "Escape") {
        // Close search overlay
        if (typeof closeGlobalSearch === "function") {
            const searchOverlay = document.getElementById("search-overlay");
            if (searchOverlay && searchOverlay.classList.contains("open")) {
                closeGlobalSearch();
                return;
            }
        }
        // Đóng CheatSheet drawer
        const drawer = document.getElementById("cheatsheet-drawer");
        if (drawer && drawer.classList.contains("open")) {
            if (typeof closeCheatSheet === "function") closeCheatSheet();
            return;
        }
        // Đóng các modal backdrop đang mở
        document.querySelectorAll(".nb-modal-backdrop").forEach(m => {
            if (m.style.display === "flex" || m.classList.contains("active")) {
                m.style.display = "none";
                m.classList.remove("active");
            }
        });
        return;
    }

    // T — Toggle theme
    if (e.key === "t" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        toggleTheme();
        return;
    }

    // Phím số 1-8 — Chuyển tab nhanh (không modifier)
    if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const tabMap = {
            "1": "menu",
            "2": "simulator",
            "3": "learning",
            "4": "practice",
            "5": "projects",
            "6": "interview",
            "7": "notebook",
            "8": "profile"
        };
        if (tabMap[e.key]) {
            switchTab(tabMap[e.key]);
            showToast(`⌨️ Chuyển tab: ${tabMap[e.key].charAt(0).toUpperCase() + tabMap[e.key].slice(1)}`);
            return;
        }
    }
});
