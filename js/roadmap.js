// ==========================================
// 4. ROADMAP & NOTEBOOK MANAGEMENT
// ==========================================
// ==========================================
// CÁC HÀM TÍNH TOÁN TIẾN ĐỘ THỜI GIAN THỰC & CHẶNG NGHỀ NGHIỆP
// ==========================================
let activeRoadmapPhase = "all";

const ROADMAP_PHASES = [
    { id: "all", label: "Toàn Bộ (14 Bước)", icon: "🌐" },
    { id: "academic", label: "1. Sinh Viên (Bước 1-3)", icon: "🎓" },
    { id: "thesis", label: "2. Đồ Án Tốt Nghiệp A+ (Bước 4-8)", icon: "🏆" },
    { id: "intern", label: "3. Phỏng Vấn Intern (Bước 9-11)", icon: "💼" },
    { id: "fresher", label: "4. Fresher ➔ Junior (Bước 12-14)", icon: "🚀" }
];

const PHASE_META = {
    academic: { label: "Nền Tảng Sinh Viên", cssClass: "phase-badge-academic" },
    thesis: { label: "Đồ Án Tốt Nghiệp A+", cssClass: "phase-badge-thesis" },
    intern: { label: "Phỏng Vấn Intern", cssClass: "phase-badge-intern" },
    fresher: { label: "Fresher ➔ Junior", cssClass: "phase-badge-fresher" }
};

function setRoadmapPhase(phase) {
    activeRoadmapPhase = phase;
    renderRoadmap();
}

function calculateStats() {
    let totalTasks = 0;
    let completedTasks = 0;
    let stageStats = [];

    roadmap.forEach((stage) => {
        let stageTotal = stage.tasks.length;
        let stageDone = stage.tasks.filter(t => t.done).length;
        totalTasks += stageTotal;
        completedTasks += stageDone;

        stageStats.push({
            stageName: stage.stage,
            domain: stage.domain,
            icon: stage.icon,
            phase: stage.phase || "academic",
            total: stageTotal,
            done: stageDone,
            percent: stageTotal === 0 ? 0 : Math.round((stageDone / stageTotal) * 100)
        });
    });

    const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Xác định Rank & Cấp độ theo 5 mốc nghề nghiệp
    let rank = { title: "Cấp độ 1: Sinh Viên Nhập Môn C & Thanh Ghi", code: "LV.1" };
    if (percent >= 85 || profile.xp >= 800) {
        rank = { title: "Cấp độ 5: Kỹ Sư Nhúng Fresher & Automotive Chuẩn MISRA", code: "LV.5" };
    } else if (percent >= 65 || profile.xp >= 550) {
        rank = { title: "Cấp độ 4: Ứng Viên Sẵn Sàng Phỏng Vấn Intern Firmware", code: "LV.4" };
    } else if (percent >= 45 || profile.xp >= 350) {
        rank = { title: "Cấp độ 3: Kiến Trúc Sư Đồ Án Edge AI & RTOS (Điểm A+)", code: "LV.3" };
    } else if (percent >= 20 || profile.xp >= 150) {
        rank = { title: "Cấp độ 2: Kỹ Sư Thực Hành Ngoại Vi & Cảm Biến", code: "LV.2" };
    }

    return {
        totalTasks,
        completedTasks,
        percent,
        stageStats,
        rank
    };
}

function updatePortalStats() {
    const stats = calculateStats();
    const solvedCount = profile.solvedProblems ? profile.solvedProblems.length : 0;

    const portalRm = document.getElementById("portal-roadmap-stat");
    if (portalRm) portalRm.innerText = `${stats.completedTasks}/${stats.totalTasks} Hoàn thành (${stats.percent}%)`;
    
    const portalCode = document.getElementById("portal-code-stat");
    if (portalCode) portalCode.innerText = `${solvedCount}/${practiceExercises.length} Bài • ${profile.xp} XP`;
    
    const portalRank = document.getElementById("portal-rank-stat");
    if (portalRank) portalRank.innerText = `${stats.rank.code} • ${stats.rank.title.split(':')[1] || stats.rank.title}`;
}

// ==========================================
// RENDER ROADMAP & CHECKLIST (14 STAGES - 4 CAREER PHASES)
// ==========================================
function toggleStageTheory(stageIndex) {
    const drawer = document.getElementById(`stage-theory-${stageIndex}`);
    if (drawer) {
        drawer.classList.toggle("open");
    }
}

function renderRoadmap() {
    const container = document.getElementById("roadmap-list");
    if (!container) return;
    container.innerHTML = "";

    const stats = calculateStats();

    // 1. Render Career Phase Filter Bar
    const filterBar = document.createElement("div");
    filterBar.className = "phase-filter-container";

    ROADMAP_PHASES.forEach(ph => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `phase-filter-btn ${activeRoadmapPhase === ph.id ? 'active' : ''}`;
        
        let countText = "";
        if (ph.id === "all") {
            countText = `${stats.completedTasks}/${stats.totalTasks}`;
        } else {
            const phaseStages = roadmap.filter(s => (s.phase || "academic") === ph.id);
            const phTotal = phaseStages.reduce((acc, s) => acc + s.tasks.length, 0);
            const phDone = phaseStages.reduce((acc, s) => acc + s.tasks.filter(t => t.done).length, 0);
            countText = `${phDone}/${phTotal}`;
        }

        btn.innerHTML = `<span>${ph.icon}</span> <span>${ph.label}</span> <span style="opacity: 0.7; font-size: 10px;">(${countText})</span>`;
        btn.onclick = () => setRoadmapPhase(ph.id);
        filterBar.appendChild(btn);
    });

    container.appendChild(filterBar);

    // 2. Render Stages
    roadmap.forEach((stage, stageIndex) => {
        const stagePhase = stage.phase || "academic";
        if (activeRoadmapPhase !== "all" && stagePhase !== activeRoadmapPhase) {
            return; // Skip stages not matching filter
        }

        const stageEl = document.createElement("div");
        stageEl.className = "stage-group";

        const stageDoneCount = stage.tasks.filter(t => t.done).length;
        const stageTheory = (typeof ROADMAP_STAGE_THEORY !== 'undefined') ? ROADMAP_STAGE_THEORY[stageIndex] : null;
        const phaseMeta = PHASE_META[stagePhase] || PHASE_META.academic;

        stageEl.innerHTML = `
            <div class="stage-header">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="stage-title">${stage.icon} ${stage.stage}</span>
                    <span class="phase-badge-pill ${phaseMeta.cssClass}">${phaseMeta.label}</span>
                    <span class="stage-count">${stageDoneCount}/${stage.tasks.length} Hoàn thành</span>
                </div>
                <div class="stage-header-actions">
                    <button type="button" class="stage-theory-btn" onclick="toggleStageTheory(${stageIndex})" title="Đọc tóm tắt lý thuyết giai đoạn này">
                        📖 Tóm Tắt
                    </button>
                    <button type="button" class="stage-theory-btn" onclick="openNotebookForStage(${stageIndex})" title="Mở giáo trình đầy đủ trong Sổ Tay AI">
                        📚 Sổ Tay AI
                    </button>
                    <button type="button" class="stage-theory-btn stage-ai-btn" onclick="askAiAboutStage(${stageIndex})" title="Hỏi trợ lý Gemini về giai đoạn này">
                        🤖 Hỏi AI
                    </button>
                </div>
            </div>
            ${stageTheory ? `
            <div class="stage-theory-drawer" id="stage-theory-${stageIndex}">
                <div class="stage-theory-content">
                    <h4>📖 ${stageTheory.title}</h4>
                    <p>${stageTheory.summary}</p>
                    <div class="stage-theory-highlight">
                        <strong>💡 Điểm cốt lõi cần nhớ:</strong>
                        <ul style="margin-left: 18px; margin-top: 4px;">
                            ${stageTheory.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    ${stageTheory.codeSnippet ? `<pre class="stage-theory-code"><code>${escapeHtml(stageTheory.codeSnippet)}</code></pre>` : ''}
                    <div class="stage-theory-actions">
                        <button type="button" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;" onclick="openNotebookForStage(${stageIndex})">
                            📚 Mở Đọc Đầy Đủ Trong Sổ Tay AI ↗
                        </button>
                        <button type="button" class="btn btn-accent" style="font-size: 11px; padding: 4px 10px;" onclick="askAiAboutStage(${stageIndex})">
                            🤖 Nhờ Gemini Giải Thích Sâu Thêm ↗
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}
        `;

        stage.tasks.forEach((task, taskIndex) => {
            const linkedProbIdx = (typeof practiceExercises !== 'undefined') 
                ? practiceExercises.findIndex(p => p.linkedSkill === task.skill)
                : -1;

            const label = document.createElement("label");
            label.className = "task-item";
            label.innerHTML = `
                <input type="checkbox" ${task.done ? 'checked' : ''} data-stage="${stageIndex}" data-task="${taskIndex}">
                <span class="task-text">${task.title}</span>
                <span class="task-skill-tag">${task.skill}</span>
                <div class="task-actions-row">
                    <button type="button" class="btn-task-theory" onclick="event.preventDefault(); showTaskTheoryModal(${stageIndex}, ${taskIndex})" title="Xem lý thuyết chi tiết của bài này">
                        📖 Lý thuyết
                    </button>
                    ${linkedProbIdx !== -1 ? `
                    <button type="button" class="btn-task-code" onclick="event.preventDefault(); openPracticeProblem(${linkedProbIdx})" title="Làm bài tập thực hành tương ứng (+XP)">
                        💻 Thực hành
                    </button>
                    ` : ''}
                    <button type="button" class="btn-task-ai" onclick="event.preventDefault(); askAiAboutTask(${stageIndex}, ${taskIndex})" title="Hỏi Gemini AI về bài này">
                        🤖 Hỏi AI
                    </button>
                </div>
            `;
            stageEl.appendChild(label);
        });

        container.appendChild(stageEl);
    });

    // Cập nhật thanh tiến độ tổng quan
    const progressFill = document.getElementById("progress-fill");
    if (progressFill) progressFill.style.width = stats.percent + "%";
    
    const progressPercent = document.getElementById("progress-percent");
    if (progressPercent) progressPercent.innerText = stats.percent + "% (" + stats.completedTasks + "/" + stats.totalTasks + ")";
    
    const tabLearningCount = document.getElementById("tab-learning-count");
    if (tabLearningCount) tabLearningCount.innerText = stats.completedTasks + "/" + stats.totalTasks;
    
    const tabProfilePercent = document.getElementById("tab-profile-percent");
    if (tabProfilePercent) tabProfilePercent.innerText = stats.percent + "%";
    
    const headerLevelBadge = document.getElementById("header-level-badge");
    if (headerLevelBadge) headerLevelBadge.innerText = stats.rank.title;
    
    const headerXpBadge = document.getElementById("header-xp-badge");
    if (headerXpBadge) headerXpBadge.innerText = "⭐ " + profile.xp + " XP";
    
    const practiceXpTag = document.getElementById("practice-xp-tag");
    if (practiceXpTag) practiceXpTag.innerText = "⭐ " + profile.xp + " XP";

    const solvedCount = profile.solvedProblems ? profile.solvedProblems.length : 0;
    const tabPracticeCount = document.getElementById("tab-practice-count");
    if (tabPracticeCount) tabPracticeCount.innerText = `${solvedCount}/${practiceExercises.length} Bài`;

    // Xác định stage hiện tại (giai đoạn đầu tiên còn task chưa hoàn thành)
    let currentStageText = "Hoàn Thành Toàn Bộ Lộ Trình Kỹ Sư! 🏆";
    for (let i = 0; i < roadmap.length; i++) {
        if (roadmap[i].tasks.some(t => !t.done)) {
            currentStageText = `${roadmap[i].icon} ${roadmap[i].stage}`;
            break;
        }
    }
    
    const roadmapStatusText = document.getElementById("roadmap-status-text");
    if (roadmapStatusText) roadmapStatusText.innerText = currentStageText;

    localStorage.setItem(STORAGE_ROADMAP, JSON.stringify(roadmap));
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));

    if (typeof renderProfileView === "function") renderProfileView();
    updatePortalStats();
}

// ==========================================
        // XỬ LÝ CHECKBOX ROADMAP
        // ==========================================
        document.getElementById("roadmap-list").addEventListener("change", (e) => {
            if (e.target.matches("input[type='checkbox']")) {
                const sIdx = e.target.getAttribute("data-stage");
                const tIdx = e.target.getAttribute("data-task");
                const task = roadmap[sIdx].tasks[tIdx];
                task.done = e.target.checked;
                renderRoadmap();

                if (typeof logStudyActivity === 'function') {
                    if (e.target.checked) {
                        logStudyActivity('roadmap', 1, `Lộ trình: ${task.skill || task.title}`);
                    }
                }
            }
        });

        // ==========================================
        // RENDER DANH SÁCH GHI CHÚ & ĐỒNG BỘ NOTEBOOK
        // ==========================================
        function renderNotes() {
            const container = document.getElementById("notes-container");
            if (!container) return;
            container.innerHTML = "";

            if (notes.length === 0) {
                container.innerHTML = `<div class="empty-state">Chưa có bài học nào được ghi chép. Hãy lưu lại kiến thức đầu tiên ở form trên!</div>`;
                return;
            }

            notes.forEach((note, index) => {
                const card = document.createElement("div");
                card.className = "note-card";
                card.innerHTML = `
                    <div class="note-header">
                        <div class="note-title">${escapeHtml(note.title)}</div>
                        <div class="note-meta">
                            <span class="tag">${escapeHtml(note.category)}</span>
                            <button class="btn-task-ai" style="font-size: 10px; padding: 2px 6px;" onclick="askAiAboutNote(${index})" title="Hỏi Gemini AI về bài học này">
                                🤖 Hỏi AI
                            </button>
                            <button class="btn-delete" title="Xóa" onclick="deleteNote(${index})">✕</button>
                        </div>
                    </div>
                    <div class="note-body">${escapeHtml(note.content)}</div>
                    ${note.code ? `<pre class="note-code"><code>${escapeHtml(note.code)}</code></pre>` : ''}
                `;
                container.appendChild(card);
            });

            localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
            renderProfileView();
        }

        window.askAiAboutNote = function (index) {
            const note = notes[index];
            if (!note) return;
            switchTab('notebook');
            if (typeof renderNotebookView === 'function') renderNotebookView();
            const inputEl = document.getElementById("nb-chat-input");
            if (inputEl) {
                inputEl.value = `Tôi có ghi chú kỹ thuật: "${note.title}" (${note.category}). Nội dung: "${note.content}". Hãy giải thích chi tiết hơn về mặt kiến trúc vi điều khiển ESP32, ứng dụng thực tế và cách viết code tối ưu cho nội dung này.`;
                inputEl.focus();
            }
            showToast(`🤖 Đã nạp ghi chú "${note.title}" vào khung chat AI!`);
        };

        const noteFormEl = document.getElementById("note-form");
        if (noteFormEl) {
            noteFormEl.addEventListener("submit", (e) => {
                e.preventDefault();
                const title = document.getElementById("note-title").value.trim();
                const category = document.getElementById("note-category").value;
                const content = document.getElementById("note-content").value.trim();
                const code = document.getElementById("note-code").value.trim();
                const shouldSyncNotebook = document.getElementById("note-sync-notebook")?.checked;

                notes.unshift({
                    id: "note_" + Date.now(),
                    title,
                    category,
                    content,
                    code,
                    date: new Date().toLocaleDateString('vi-VN')
                });

                // Tự động đồng bộ sang Kho Tài Liệu Sổ Tay AI (NotebookLM Doc AI)
                if (shouldSyncNotebook && typeof notebookDocs !== 'undefined') {
                    const newDoc = {
                        id: "doc_note_" + Date.now(),
                        title: "Ghi Chú Kỹ Sư: " + title,
                        category: category.split('.')[1]?.trim() || "Ghi Chú",
                        tags: ["#GhiChú", "#" + (category.split('.')[1]?.trim().replace(/\s+/g, '') || "HọcTập")],
                        date: new Date().toLocaleDateString('vi-VN'),
                        words: (content + " " + code).split(/\s+/).length,
                        isNativePdf: false,
                        content: `### ${title}\n**Phân loại:** ${category}\n\n${content}\n\n${code ? '```c\n' + code + '\n```' : ''}`
                    };
                    notebookDocs.unshift(newDoc);
                    localStorage.setItem(STORAGE_NOTEBOOK_DOCS, JSON.stringify(notebookDocs));
                    if (typeof renderNotebookDocsList === 'function') renderNotebookDocsList();
                }

                renderNotes();
                e.target.reset();
                const syncCb = document.getElementById("note-sync-notebook");
                if (syncCb) syncCb.checked = true;
                
                showToast(shouldSyncNotebook 
                    ? "💾 Đã lưu vào Sổ tay & Đồng bộ vào Kho Tài Liệu AI!" 
                    : "💾 Đã lưu kiến thức mới vào sổ tay!");
            });
        }

        window.deleteNote = function (index) {
            if (confirm("Bạn có chắc chắn muốn xóa bài học này khỏi sổ tay?")) {
                notes.splice(index, 1);
                renderNotes();
                showToast("Đã xóa ghi chú.");
            }
        };

        
