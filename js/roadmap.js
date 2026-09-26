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
                    <button type="button" class="stage-theory-btn stage-quiz-btn" onclick="openModuleQuiz(${stageIndex})" title="Làm bài kiểm tra trắc nghiệm lý thuyết Module ${stageIndex + 1}">
                        📝 Trắc Nghiệm <span id="stage-quiz-badge-${stageIndex}">${(typeof getModuleQuizScoreBadge === 'function') ? getModuleQuizScoreBadge(stageIndex) : ''}</span>
                    </button>
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
                    <p style="margin-bottom: 12px; color: #e2e8f0; line-height: 1.6;">${stageTheory.summary}</p>
                    
                    ${stageTheory.coreAnalogy ? `
                    <div class="stage-theory-analogy" style="background: rgba(255, 180, 0, 0.07); border-left: 3px solid #ffb400; padding: 10px 14px; border-radius: 6px; margin: 10px 0;">
                        <strong style="color: #ffb400; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            💡 Ẩn Dụ Trực Quan & Bản Chất:
                        </strong>
                        <span style="color: #cbd5e1; font-style: italic;">${stageTheory.coreAnalogy}</span>
                    </div>
                    ` : ''}

                    ${stageTheory.hardwareArchitecture ? `
                    <div class="stage-theory-arch" style="background: rgba(0, 240, 255, 0.05); border-left: 3px solid #00f0ff; padding: 10px 14px; border-radius: 6px; margin: 10px 0;">
                        <strong style="color: #00f0ff; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            ⚙️ Kiến Trúc Phần Cứng & Thanh Ghi:
                        </strong>
                        <div style="color: #94a3b8; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(stageTheory.hardwareArchitecture)}</div>
                    </div>
                    ` : ''}

                    <div class="stage-theory-highlight">
                        <strong>📌 Nguyên lý & Công thức cốt lõi:</strong>
                        <ul style="margin-left: 18px; margin-top: 6px;">
                            ${stageTheory.highlights.map(h => `<li style="margin-bottom: 4px;">${h}</li>`).join('')}
                        </ul>
                    </div>

                    ${stageTheory.fatalTraps && stageTheory.fatalTraps.length > 0 ? `
                    <div class="stage-theory-traps" style="background: rgba(255, 59, 48, 0.08); border-left: 3px solid #ff3b30; padding: 10px 14px; border-radius: 6px; margin: 10px 0;">
                        <strong style="color: #ff3b30; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            ⚠️ Cạm Bẫy Chí Mạng & Bắt Lỗi Thực Tế:
                        </strong>
                        <ul style="margin-left: 18px; margin-top: 4px; color: #fca5a5;">
                            ${stageTheory.fatalTraps.map(tr => `<li style="margin-bottom: 4px;">${tr}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    ${stageTheory.codeSnippet ? `
                    <div style="margin-top: 10px;">
                        <span style="font-size: 11px; color: var(--accent); font-family: 'JetBrains Mono', monospace;">💻 Mã Nguồn C/C++ Chuẩn Sản Xuất:</span>
                        <pre class="stage-theory-code"><code>${escapeHtml(stageTheory.codeSnippet)}</code></pre>
                    </div>
                    ` : ''}

                    
                    ${stageTheory.bookId && typeof technicalBooksData !== 'undefined' ? (() => {
                        const book = technicalBooksData.find(b => b.id === stageTheory.bookId);
                        if (!book) return '';
                        return `
                        <div class="stage-theory-book-ref" style="margin: 12px 0; padding: 12px 16px; background: linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(59, 130, 246, 0.08)); border: 1px solid rgba(0, 240, 255, 0.35); border-left: 4px solid var(--cyan); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 250px;">
                                <span style="font-size: 26px;">${book.coverIcon}</span>
                                <div>
                                    <div style="font-size: 10px; color: var(--cyan); font-weight: 700; text-transform: uppercase;">📚 TÀI LIỆU GỐC & ĐẶC TẢ KỸ THUẬT ĐÃ KẾ THỪA</div>
                                    <div style="font-size: 13px; color: #ffffff; font-weight: 700; margin-top: 2px;">${escapeHtml(book.title)}</div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">✍️ ${escapeHtml(book.author)} (${book.year}) • 🎯 ${escapeHtml(stageTheory.standardRef || book.keyChapters[0])}</div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 6px; flex-shrink: 0;">
                                <button type="button" class="btn btn-accent" style="font-size: 11px; padding: 4px 10px;" onclick="openBookshelfForBook('${book.id}')" title="Mở cuốn sách này trong Tủ Sách Kỹ Thuật">
                                    <span>📚</span> Đọc Trong Tủ Sách ↗
                                </button>
                                <a href="${book.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;" title="Tải trực tiếp file PDF gốc">
                                    <span>📥</span> Tải PDF Gốc ↗
                                </a>
                            </div>
                        </div>`;
                    })() : ''}

                    ${stageTheory.references && stageTheory.references.length > 0 ? `
                    <div class="stage-theory-refs" style="margin-top: 12px; padding: 10px 14px; background: rgba(0, 240, 255, 0.04); border: 1px dashed rgba(0, 240, 255, 0.25); border-radius: 6px;">
                        <strong style="color: var(--cyan); font-size: 11.5px; display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                            🌐 Tài Liệu Nguồn & Tiêu Chuẩn Quốc Tế Đã Kiểm Chứng:
                        </strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${stageTheory.references.map(ref => `
                                <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="theory-ref-pill" style="display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 4px 10px; background: #070d18; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 4px; color: #38bdf8; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--cyan)'; this.style.color='#fff';" onmouseout="this.style.borderColor='rgba(0,240,255,0.3)'; this.style.color='#38bdf8';">
                                    <span>🔗</span> <span>${escapeHtml(ref.name)}</span> <span style="font-size: 9px; opacity: 0.7; background: rgba(0,240,255,0.15); padding: 1px 4px; border-radius: 3px;">${escapeHtml(ref.type)}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <div class="stage-quiz-cta-banner">
                        <div>
                            <div class="stage-quiz-cta-title">
                                <span>📝</span> KIỂM TRA TRẮC NGHIỆM LÝ THUYẾT: ${escapeHtml(stage.stage)}
                            </div>
                            <div class="stage-quiz-cta-desc">
                                5 Câu hỏi trắc nghiệm chuyên sâu sát thực tế trích từ tài liệu gốc. Yêu cầu đạt tối thiểu 4/5 câu đúng (+50 XP).
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                            <span id="stage-quiz-drawer-badge-${stageIndex}">${(typeof getModuleQuizScoreBadge === 'function') ? getModuleQuizScoreBadge(stageIndex) : ''}</span>
                            <button type="button" class="btn btn-accent" style="font-size: 11.5px; padding: 5px 12px;" onclick="openModuleQuiz(${stageIndex})">
                                <span>📝</span> Bắt Đầu Làm Bài ↗
                            </button>
                        </div>
                    </div>

                    <div class="stage-theory-actions">
                        <button type="button" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px; color: #c084fc; border-color: rgba(168,85,247,0.4);" onclick="openModuleQuiz(${stageIndex})" title="Kiểm tra trắc nghiệm lý thuyết Module này">
                            📝 Thi Trắc Nghiệm ↗
                        </button>
                        <button type="button" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px; color: var(--cyan); border-color: rgba(0,240,255,0.4);" onclick="openBookshelfForStage(${stageIndex})" title="Mở sách/tài liệu gốc của giai đoạn này trong Tủ Sách">
                            📚 Sách Gốc Trong Tủ Sách ↗
                        </button>
                        <button type="button" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;" onclick="openNotebookForStage(${stageIndex})">
                            📚 Mở Đọc Đầy Đủ Trong Sổ Tay AI ↗
                        </button>
                        <button type="button" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px; color: var(--gold); border-color: rgba(255,180,0,0.4);" onclick="openPracticeForStage(${stageIndex})" title="Mở 12 bài tập C áp dụng cho giai đoạn này">
                            💻 Thực Hành 12 Bài Tập C Bước Này ↗
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
            let linkedProbIdx = -1;
            if (typeof practiceExercises !== 'undefined' && practiceExercises.length > 0) {
                linkedProbIdx = practiceExercises.findIndex(p => p.linkedSkill === task.skill);
                if (linkedProbIdx === -1 && stageIndex <= 5) {
                    const fallbackIdx = stageIndex * 12 + Math.min(taskIndex, 11);
                    if (practiceExercises[fallbackIdx]) linkedProbIdx = fallbackIdx;
                }
            }

            const label = document.createElement("label");
            label.className = "task-item";
            label.innerHTML = `
                <input type="checkbox" ${task.done ? 'checked' : ''} data-stage="${stageIndex}" data-task="${taskIndex}">
                <span class="task-text">${task.title}</span>
                <span class="task-skill-tag">${task.skill}</span>
                <div class="task-actions-row">
                    <button type="button" class="btn-task-theory" onclick="event.preventDefault(); event.stopPropagation(); showTaskTheoryModal(${stageIndex}, ${taskIndex})" title="Xem lý thuyết chi tiết của bài này">
                        📖 Lý thuyết
                    </button>
                    ${linkedProbIdx !== -1 ? `
                    <button type="button" class="btn-task-code" onclick="event.preventDefault(); event.stopPropagation(); openPracticeProblem(${linkedProbIdx})" title="Làm bài tập thực hành tương ứng (+XP)">
                        💻 Thực hành
                    </button>
                    ` : ''}
                    <button type="button" class="btn-task-ai" onclick="event.preventDefault(); event.stopPropagation(); askAiAboutTask(${stageIndex}, ${taskIndex})" title="Hỏi Gemini AI về bài này">
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

        window.openPracticeForStage = function (stageIndex) {
            if (typeof setModuleFilter === 'function') {
                setModuleFilter(String(stageIndex));
            }
            if (typeof switchTab === 'function') {
                switchTab('practice');
            }
            showToast(`🎯 Đã mở danh sách 12 bài tập C áp dụng cho Bước ${stageIndex + 1}!`);
        };

        window.toggleStageTheory = toggleStageTheory;
        window.setRoadmapPhase = setRoadmapPhase;
        window.renderRoadmap = renderRoadmap;



// Helper mở sách trong Tủ Sách cho giai đoạn Lộ Trình
window.openBookshelfForStage = function(stageIndex) {
    const stageTheory = (typeof ROADMAP_STAGE_THEORY !== 'undefined') ? ROADMAP_STAGE_THEORY[stageIndex] : null;
    const bookId = stageTheory ? stageTheory.bookId : 'book_esps3_trm';
    if (bookId && typeof openBookshelfForBook === 'function') {
        openBookshelfForBook(bookId);
    } else if (typeof openBookshelfModal === 'function') {
        openBookshelfModal();
    }
};
