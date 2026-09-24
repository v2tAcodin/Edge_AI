// ==========================================
// 11. APP ENTRY POINT & ROUTING
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active", "active-menu"));
    document.querySelectorAll("#view-menu, #view-simulator, #view-learning, #view-practice, #view-profile, #view-interview, #view-notebook, #view-projects").forEach(v => {
        if (v) v.style.display = "none";
    });

    if (tabId === 'menu') {
        document.getElementById("tab-menu").classList.add("active", "active-menu");
        document.getElementById("view-menu").style.display = "block";
    } else if (tabId === 'learning') {
        document.getElementById("tab-learning").classList.add("active");
        document.getElementById("view-learning").style.display = "block";
        renderRoadmap();
    } else if (tabId === 'practice') {
        document.getElementById("tab-practice").classList.add("active");
        document.getElementById("view-practice").style.display = "block";
        renderPracticeView();
    } else if (tabId === 'projects') {
        const tabEl = document.getElementById("tab-projects");
        if (tabEl) tabEl.classList.add("active");
        const viewEl = document.getElementById("view-projects");
        if (viewEl) viewEl.style.display = "block";
        if (typeof renderProjectsView === 'function') renderProjectsView();
    } else if (tabId === 'simulator') {
        document.getElementById("tab-simulator").classList.add("active");
        document.getElementById("view-simulator").style.display = "block";
        updateSramSimulation();
    } else if (tabId === 'interview') {
        const tabEl = document.getElementById("tab-interview");
        if (tabEl) tabEl.classList.add("active");
        const viewEl = document.getElementById("view-interview");
        if (viewEl) viewEl.style.display = "block";
        renderInterviewArena();
    } else if (tabId === 'notebook') {
        const tabEl = document.getElementById("tab-notebook");
        if (tabEl) tabEl.classList.add("active");
        const viewEl = document.getElementById("view-notebook");
        if (viewEl) viewEl.style.display = "block";
        if (typeof renderNotebookView === 'function') renderNotebookView();
    } else if (tabId === 'profile') {
        document.getElementById("tab-profile").classList.add("active");
        document.getElementById("view-profile").style.display = "block";
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

// PWA Install Prompt Listener
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

// KHỞI CHẠY LẦN ĐẦU KHI DOM SẴN SÀNG
document.addEventListener("DOMContentLoaded", () => {
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
