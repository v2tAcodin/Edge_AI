// ==========================================
// GLOBAL SEARCH ENGINE (Ctrl+K Spotlight)
// Phase 2: Tìm kiếm toàn cục qua tất cả nội dung
// ==========================================

let searchIndex = [];
let searchSelectedIdx = -1;

// ==========================================
// Build Search Index — gom tất cả dữ liệu
// ==========================================
function buildSearchIndex() {
    searchIndex = [];

    // 1. Tab navigation items
    const tabs = [
        { icon: "🧭", title: "Tổng Quan (Menu)", tab: "menu" },
        { icon: "⚡", title: "Lab & Sim (Phòng thí nghiệm ảo)", tab: "simulator" },
        { icon: "🗺️", title: "Lộ Trình Edge AI", tab: "learning" },
        { icon: "💻", title: "Đấu Trường Code C", tab: "practice" },
        { icon: "🏆", title: "Dự Án Capstone", tab: "projects" },
        { icon: "🎯", title: "Đấu Trường Phỏng Vấn", tab: "interview" },
        { icon: "📚", title: "Sổ Tay AI (NotebookLM)", tab: "notebook" },
        { icon: "👤", title: "Hồ Sơ Năng Lực (Profile)", tab: "profile" },
    ];
    tabs.forEach(t => {
        searchIndex.push({
            type: "tab",
            icon: t.icon,
            title: t.title,
            meta: "Chuyển tab",
            tab: t.tab,
            searchText: t.title.toLowerCase()
        });
    });

    // 2. Roadmap tasks
    if (typeof roadmap !== "undefined" && Array.isArray(roadmap)) {
        roadmap.forEach((stage, si) => {
            if (stage.tasks) {
                stage.tasks.forEach(task => {
                    searchIndex.push({
                        type: "roadmap",
                        icon: stage.icon || "📚",
                        title: task.title,
                        meta: `${stage.stage} • ${task.skill || ""}`,
                        tab: "learning",
                        searchText: `${task.title} ${task.skill || ""} ${stage.stage}`.toLowerCase()
                    });
                });
            }
        });
    }

    // 3. Practice exercises
    if (typeof practiceExercises !== "undefined" && Array.isArray(practiceExercises)) {
        practiceExercises.forEach(ex => {
            searchIndex.push({
                type: "practice",
                icon: "💻",
                title: ex.title,
                meta: `${ex.topic} • ${ex.difficulty} • ${ex.xp} XP`,
                tab: "practice",
                searchText: `${ex.title} ${ex.topic} ${ex.desc || ""}`.toLowerCase()
            });
        });
    }

    // 4. Interview questions
    if (typeof interviewQuestions !== "undefined" && Array.isArray(interviewQuestions)) {
        interviewQuestions.forEach(q => {
            searchIndex.push({
                type: "interview",
                icon: "🎯",
                title: q.question.substring(0, 100) + (q.question.length > 100 ? "..." : ""),
                meta: `${q.category} • ${q.company}`,
                tab: "interview",
                searchText: `${q.question} ${q.category} ${q.company}`.toLowerCase()
            });
        });
    }

    // 5. CheatSheet topics (if available)
    if (typeof cheatSheetData !== "undefined" && Array.isArray(cheatSheetData)) {
        cheatSheetData.forEach(item => {
            searchIndex.push({
                type: "cheatsheet",
                icon: "📖",
                title: item.title || item.name || "CheatSheet",
                meta: "CheatSheet tra cứu",
                tab: "cheatsheet",
                searchText: `${item.title || ""} ${item.name || ""} cheatsheet`.toLowerCase()
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

    // Sort: exact title match first, then by type priority
    const typePriority = { tab: 0, roadmap: 1, practice: 2, interview: 3, cheatsheet: 4 };
    results.sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
        const bExact = b.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return (typePriority[a.type] || 99) - (typePriority[b.type] || 99);
    });

    return results.slice(0, 20); // Cap at 20 results
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
    const emptyState = document.getElementById("search-empty");
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

    // Group by type
    const typeLabels = {
        tab: "ĐIỀU HƯỚNG",
        roadmap: "LỘ TRÌNH HỌC",
        practice: "BÀI TẬP CODE C",
        interview: "CÂU HỎI PHỎNG VẤN",
        cheatsheet: "CHEATSHEET"
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
            <div class="search-item" data-idx="${itemIdx}" data-tab="${item.tab}" onclick="handleSearchSelect('${item.tab}')">
                <div class="search-item-icon">${item.icon}</div>
                <div class="search-item-content">
                    <div class="search-item-title">${highlightMatch(item.title, query)}</div>
                    <div class="search-item-meta">${escapeSearchHtml(item.meta)}</div>
                </div>
                <div class="search-item-action">Enter ↵</div>
            </div>
        `;
        itemIdx++;
    });

    html += `<div class="search-count">${results.length} kết quả</div>`;
    container.innerHTML = html;
    searchSelectedIdx = -1;
}

function createEmptyState() {
    const div = document.createElement("div");
    div.className = "search-empty";
    div.id = "search-empty";
    div.innerHTML = `
        <div class="search-empty-icon">⌨️</div>
        <div>Gõ để tìm kiếm trong tất cả nội dung...</div>
        <div class="search-shortcuts-hint">
            <span><kbd>1</kbd>-<kbd>8</kbd> Chuyển tab</span>
            <span><kbd>Ctrl+S</kbd> Lưu backup</span>
            <span><kbd>Esc</kbd> Đóng</span>
        </div>
    `;
    return div;
}

// ==========================================
// Open / Close Search
// ==========================================
function openGlobalSearch() {
    // Build index on first open
    if (searchIndex.length === 0) buildSearchIndex();

    const overlay = document.getElementById("search-overlay");
    const input = document.getElementById("search-input");
    if (!overlay) return;

    overlay.style.display = "flex";
    // Force reflow then add opacity
    void overlay.offsetHeight;
    overlay.classList.add("open");

    if (input) {
        input.value = "";
        input.focus();
    }

    renderSearchResults("");
    document.body.style.overflow = "hidden";
}

function closeGlobalSearch() {
    const overlay = document.getElementById("search-overlay");
    if (!overlay) return;

    overlay.classList.remove("open");
    setTimeout(() => {
        overlay.style.display = "none";
    }, 200);

    document.body.style.overflow = "";
}

function handleSearchSelect(tab) {
    closeGlobalSearch();
    if (typeof switchTab === "function") {
        switchTab(tab === "cheatsheet" ? "menu" : tab);
        if (tab === "cheatsheet" && typeof openCheatSheet === "function") {
            setTimeout(() => openCheatSheet(), 300);
        }
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

    // Click backdrop to close
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
    // Scroll selected into view
    if (searchSelectedIdx >= 0 && items[searchSelectedIdx]) {
        items[searchSelectedIdx].scrollIntoView({ block: "nearest" });
    }
}

// ==========================================
// Auto-init on DOM ready
// ==========================================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearchListeners);
} else {
    initSearchListeners();
}
