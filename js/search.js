// ==========================================
// GLOBAL SEARCH ENGINE (Ctrl+K Spotlight)
// Living Portfolio 3.0: Fast search across projects, skills & notes
// ==========================================

let searchIndex = [];
let searchSelectedIdx = -1;

// ==========================================
// Build Search Index
// ==========================================
function buildSearchIndex() {
    searchIndex = [];

    // 1. Core Tab navigation items
    const tabs = [
        { icon: "🌌", title: "3D Cybernetic Skill Tree", tab: "tree3d", meta: "Không gian 3D • Universe Constellation" },
        { icon: "🏆", title: "Projects Grid Showcase", tab: "grid", meta: "6 Dự án thực chiến ESP32-S3 & TinyML" },
        { icon: "👤", title: "Hồ Sơ Năng Lực & CV 3.0", tab: "profile", meta: "Kỹ sư Thai • Radar Matrix & Tải PDF CV" }
    ];
    tabs.forEach(t => {
        searchIndex.push({
            type: "tab",
            icon: t.icon,
            title: t.title,
            meta: t.meta,
            actionType: "tab",
            target: t.tab,
            tab: t.tab,
            searchText: `${t.title} ${t.meta}`.toLowerCase()
        });
    });

    // 2. Quick Notes Scratchpad action
    searchIndex.push({
        type: "action",
        icon: "📝",
        title: "Sổ Ghi Chú Nhanh (Quick Notes)",
        meta: "Ghi chú & nhắc việc cá nhân • Phím tắt Alt+N",
        actionType: "quicknotes",
        target: "quicknotes",
        tab: "quicknotes",
        searchText: "quicknotes ghi chú note notes memo scratchpad sổ tay nhắc nhớ việc cần làm"
    });

    // 3. Showcase Projects from PortfolioData
    const pData = window.PortfolioData;
    if (pData && Array.isArray(pData.projects)) {
        pData.projects.forEach(p => {
            const tags = Array.isArray(p.tags) ? p.tags.join(" ") : "";
            const cat = p.category || "";
            searchIndex.push({
                type: "project",
                icon: "⚡",
                title: p.title,
                meta: `[${p.status || 'Active'}] ${p.category ? p.category.toUpperCase() : 'PROJECT'} • Nhấp để mở Deep-Dive HUD`,
                actionType: "project",
                target: p.id,
                tab: "grid",
                searchText: `${p.title} ${p.summary || ""} ${tags} ${cat} ${p.id}`.toLowerCase()
            });
        });
    }

    // 4. Skill Tree Nodes from PortfolioData
    if (pData && Array.isArray(pData.skillTreeNodes)) {
        pData.skillTreeNodes.forEach(node => {
            searchIndex.push({
                type: "skill",
                icon: "🌿",
                title: node.title,
                meta: `Kỹ năng: ${node.category ? node.category.toUpperCase() : 'CORE'} • Tọa độ 3D`,
                actionType: "skill",
                target: node.id,
                tab: "tree3d",
                searchText: `${node.title} ${node.description || ""} ${node.id}`.toLowerCase()
            });
        });
    }
}

// ==========================================
// Search & Filter
// ==========================================
function performSearch(query) {
    if (!query || query.trim().length === 0) return [];

    const terms = query.toLowerCase().trim().split(/\s+/);
    const results = searchIndex.filter(item => {
        return terms.every(term => item.searchText.includes(term));
    });

    const typePriority = { tab: 0, project: 1, skill: 2, action: 3 };
    results.sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
        const bExact = b.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return (typePriority[a.type] || 99) - (typePriority[b.type] || 99);
    });

    return results.slice(0, 15);
}

// ==========================================
// Highlight matched text
// ==========================================
function highlightMatch(text, query) {
    if (!query) return escapeSearchHtml(text);
    const escaped = escapeSearchHtml(text);
    const terms = query.trim().split(/\s+/);
    let result = escaped;
    terms.forEach(term => {
        if (term.length < 1) return;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        result = result.replace(regex, '<span class="search-highlight">$1</span>');
    });
    return result;
}

function escapeSearchHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// Render Search Results
// ==========================================
function renderSearchResults(query) {
    const container = document.getElementById("search-results");
    if (!container) return;

    if (!query || query.trim().length === 0) {
        container.innerHTML = "";
        container.appendChild(createEmptyState());
        searchSelectedIdx = -1;
        return;
    }

    const results = performSearch(query);

    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <div class="search-no-results-icon">🔍</div>
                <div>Không tìm thấy kết quả cho "<strong>${escapeSearchHtml(query)}</strong>"</div>
            </div>
        `;
        searchSelectedIdx = -1;
        return;
    }

    const typeLabels = {
        tab: "ĐIỀU HƯỚNG",
        project: "ĐỒ ÁN & THÀNH TỰU",
        skill: "NĂNG LỰC & KỸ NĂNG",
        action: "TIỆN ÍCH"
    };

    let html = "";
    let currentType = "";
    let itemIdx = 0;

    results.forEach(item => {
        if (item.type !== currentType) {
            currentType = item.type;
            html += `<div class="search-category">${typeLabels[item.type] || item.type.toUpperCase()}</div>`;
        }
        html += `
            <div class="search-item" data-idx="${itemIdx}" data-action="${item.actionType}" data-target="${item.target}" onclick="handleSearchItemClick(${itemIdx})">
                <div class="search-item-icon">${item.icon}</div>
                <div class="search-item-content">
                    <div class="search-item-title">${highlightMatch(item.title, query)}</div>
                    <div class="search-item-meta">${escapeSearchHtml(item.meta)}</div>
                </div>
                <div class="search-item-action">Chọn ↵</div>
            </div>
        `;
        itemIdx++;
    });

    html += `<div class="search-count">${results.length} kết quả</div>`;
    container.innerHTML = html;
    window._lastSearchResults = results;
    searchSelectedIdx = -1;
}

function createEmptyState() {
    const div = document.createElement("div");
    div.className = "search-empty";
    div.id = "search-empty";
    div.innerHTML = `
        <div class="search-empty-icon">⌨️</div>
        <div>Gõ để tìm kiếm trong danh mục đồ án, kỹ năng...</div>
        <div class="search-shortcuts-hint">
            <span><kbd>1</kbd>-<kbd>3</kbd> Chuyển tab</span>
            <span><kbd>T</kbd> Đổi theme</span>
            <span><kbd>Alt+N</kbd> Sổ ghi chú</span>
        </div>
    `;
    return div;
}

// ==========================================
// Open / Close Search
// ==========================================
function openGlobalSearch() {
    buildSearchIndex();

    const overlay = document.getElementById("search-overlay");
    const input = document.getElementById("search-input");
    if (!overlay) return;

    overlay.style.display = "flex";
    void overlay.offsetHeight;
    overlay.classList.add("open");

    if (input) {
        input.value = "";
        input.focus();
    }
    renderSearchResults("");
}

function closeGlobalSearch() {
    const overlay = document.getElementById("search-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    setTimeout(() => {
        overlay.style.display = "none";
    }, 200);
}

// ==========================================
// Handle Search Selection
// ==========================================
function handleSearchItemClick(idx) {
    if (!window._lastSearchResults || !window._lastSearchResults[idx]) return;
    const item = window._lastSearchResults[idx];
    closeGlobalSearch();

    setTimeout(() => {
        if (item.actionType === "quicknotes" || item.tab === "quicknotes") {
            if (window.QuickNotes) QuickNotes.open();
        } else if (item.actionType === "project") {
            if (window.PortfolioController) {
                PortfolioController.selectProject(item.target);
            } else if (window.PortfolioHUD) {
                PortfolioHUD.open(item.target);
            }
        } else if (item.actionType === "skill") {
            if (typeof switchTab === "function") switchTab("tree3d");
            if (window.cyberTree3D && typeof cyberTree3D.showInspector === "function") {
                const pData = window.PortfolioData;
                const node = pData ? pData.skillTreeNodes.find(n => n.id === item.target) : null;
                if (node) cyberTree3D.showInspector(node);
            }
        } else if (item.actionType === "tab") {
            if (typeof switchTab === "function") switchTab(item.target);
        }
    }, 120);
}

function handleSearchSelect(tab) {
    closeGlobalSearch();
    if (tab === "quicknotes") {
        setTimeout(() => {
            if (window.QuickNotes) QuickNotes.open();
        }, 150);
        return;
    }
    if (typeof switchTab === "function") {
        switchTab(tab);
    }
}

// ==========================================
// Keyboard Navigation in Search
// ==========================================
function initSearchListeners() {
    const input = document.getElementById("search-input");
    const overlay = document.getElementById("search-overlay");

    if (input) {
        input.addEventListener("input", (e) => {
            renderSearchResults(e.target.value);
        });

        input.addEventListener("keydown", (e) => {
            const items = document.querySelectorAll(".search-item");
            const count = items.length;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                searchSelectedIdx = Math.min(searchSelectedIdx + 1, count - 1);
                updateSearchSelection(items);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                searchSelectedIdx = Math.max(searchSelectedIdx - 1, -1);
                updateSearchSelection(items);
            } else if (e.key === "Enter" && searchSelectedIdx >= 0 && items[searchSelectedIdx]) {
                e.preventDefault();
                items[searchSelectedIdx].click();
            } else if (e.key === "Escape") {
                e.preventDefault();
                closeGlobalSearch();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeGlobalSearch();
        });
    }
}

function updateSearchSelection(items) {
    items.forEach((item, i) => {
        item.classList.toggle("selected", i === searchSelectedIdx);
    });
    if (searchSelectedIdx >= 0 && items[searchSelectedIdx]) {
        items[searchSelectedIdx].scrollIntoView({ block: "nearest" });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearchListeners);
} else {
    initSearchListeners();
}
