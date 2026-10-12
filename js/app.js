// ==========================================
// PROJECT THAI — APP ENTRY POINT & ROUTING
// Living Portfolio & 3D Interactive Showcase HUD
// ==========================================
const STORAGE_THEME = "mr_thai_theme_v1";

function switchTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll("#view-tree3d, #view-galaxy, #view-grid, #view-profile, #view-projects").forEach(v => {
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
        void el.offsetHeight;
        el.classList.add("view-enter");
    }

    if (tabId === 'tree3d' || tabId === 'galaxy') {
        const tabEl = document.getElementById("tab-tree3d");
        if (tabEl) tabEl.classList.add("active");
        showView("view-tree3d");
        showView("view-galaxy");
        if (window.PortfolioController) {
            window.PortfolioController.activeView = 'tree3d';
        }
        if (window.skillGalaxy3D) {
            window.skillGalaxy3D.init();
            window.skillGalaxy3D.onWindowResize();
            window.skillGalaxy3D.refreshNodeVisuals();
        }
    } else if (tabId === 'grid' || tabId === 'projects') {
        const tabEl = document.getElementById("tab-grid");
        if (tabEl) tabEl.classList.add("active");
        showView("view-grid");
        showView("view-projects");
        if (window.PortfolioController) {
            window.PortfolioController.activeView = 'grid';
        }
        if (window.PortfolioGrid) {
            window.PortfolioGrid.init();
            window.PortfolioGrid.render();
        }
    } else if (tabId === 'profile') {
        const tabEl = document.getElementById("tab-profile");
        if (tabEl) tabEl.classList.add("active");
        showView("view-profile");
        if (window.PortfolioController) {
            window.PortfolioController.activeView = 'profile';
        }
        if (typeof renderProfileView === 'function') {
            renderProfileView();
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof AudioEngine !== 'undefined') {
        AudioEngine.playSFX('tab');
    }
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
// DARK / LIGHT THEME TOGGLE
// ==========================================
function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved) return saved;
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
    if (typeof AudioEngine !== 'undefined') {
        AudioEngine.playSFX('whoosh');
    }
    showToast(next === "light" ? "☀️ Chế độ sáng" : "🌙 Chế độ tối");
}

// ==========================================
// SCROLL PROGRESS INDICATOR
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
                showToast("Đã cài đặt Project Thai Showcase lên thiết bị!");
            }
            deferredPrompt = null;
        });
    }
}

// ==========================================
// PWA SERVICE WORKER REGISTRATION
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => {
                console.log('[PWA] Service Worker registered with scope:', reg.scope);
                if (reg.update) reg.update();
            })
            .catch((err) => {
                console.warn('[PWA] Service Worker registration failed:', err);
            });
    });
}

// ==========================================
// DOM READY INITIALIZER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Apply saved theme
    applyTheme(getPreferredTheme());

    // Init scroll progress
    initScrollProgress();

    // Living Portfolio 3.0: Core & Grid Initializers
    if (window.PortfolioData && window.PortfolioController) {
        window.PortfolioController.init(window.PortfolioData);
    }
    if (window.PortfolioGrid) {
        window.PortfolioGrid.init();
        window.PortfolioGrid.render();
    }
    if (window.PortfolioHUD) {
        window.PortfolioHUD.init();
    }
    if (typeof renderProfileView === 'function') {
        renderProfileView();
    }
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_THEME)) {
            applyTheme(e.matches ? "light" : "dark");
        }
    });
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener("keydown", (e) => {
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) {
        if (e.key === "Escape") {
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

    // Ctrl+K / Cmd+K — Mở tìm kiếm toàn cục
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (typeof openGlobalSearch === "function") {
            openGlobalSearch();
        }
        return;
    }

    // Alt+N — Mở Quick Notes
    if (e.altKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        if (window.QuickNotes) {
            QuickNotes.open();
        }
        return;
    }

    // Escape — Đóng modal / overlays
    if (e.key === "Escape") {
        if (typeof closeGlobalSearch === "function") {
            const searchOverlay = document.getElementById("search-overlay");
            if (searchOverlay && searchOverlay.classList.contains("open")) {
                closeGlobalSearch();
                return;
            }
        }
        if (window.QuickNotes && QuickNotes.isOpen && QuickNotes.isOpen()) {
            QuickNotes.close();
            return;
        }
        if (window.PortfolioHUD && PortfolioHUD.isOpen && PortfolioHUD.isOpen()) {
            PortfolioHUD.close();
            return;
        }
        if (window.PortfolioAdmin && PortfolioAdmin.isOpen && PortfolioAdmin.isOpen()) {
            PortfolioAdmin.close();
            return;
        }
        return;
    }

    // T — Toggle theme
    if (e.key === "t" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        toggleTheme();
        return;
    }

    // Phím số 1-3 — Chuyển tab nhanh
    if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const tabMap = {
            "1": "tree3d",
            "2": "grid",
            "3": "profile"
        };
        if (tabMap[e.key]) {
            switchTab(tabMap[e.key]);
            const names = {
                "tree3d": "3D Skill Tree",
                "grid": "Projects Grid",
                "profile": "Profile & CV"
            };
            showToast(`⌨️ Chuyển tab: ${names[tabMap[e.key]]}`);
            return;
        }
    }
});
