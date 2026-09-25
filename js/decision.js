// ==========================================
// HỆ THỐNG QUYẾT ĐỊNH HÔM NAY SẼ HỌC GÌ? (DECIDER ENGINE)
// ==========================================
let decisionDuration = 60;

function setDecisionDuration(minutes) {
    decisionDuration = parseInt(minutes, 10) || 60;
    ['30', '60', '120'].forEach(m => {
        const btn = document.getElementById("mode-btn-" + m);
        if (btn) {
            if (parseInt(m, 10) === decisionDuration) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        }
    });
    generateDailyDecision(false);
    showToast(`Đã điều chỉnh kế hoạch học sang ${decisionDuration} phút!`);
}

function generateDailyDecision(isRandom) {
    try {
        const container = document.getElementById("decision-tasks-container");
        if (!container) return;
        container.innerHTML = "";

        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
        const dateLabel = document.getElementById("decision-date-label");
        if (dateLabel) {
            dateLabel.innerText = `Kế hoạch Edge AI & Tiếng Anh cho ${dateStr} • Chế độ ${decisionDuration} phút`;
        }

        // 1. Tìm task Lộ trình tiếp theo
        let nextRoadmapTask = null;
        if (typeof roadmap !== 'undefined' && Array.isArray(roadmap)) {
            for (let st of roadmap) {
                if (st && st.tasks && Array.isArray(st.tasks)) {
                    for (let t of st.tasks) {
                        if (!t.done) {
                            nextRoadmapTask = { ...t, stage: st.stage };
                            break;
                        }
                    }
                }
                if (nextRoadmapTask) break;
            }
        }
        if (!nextRoadmapTask) {
            nextRoadmapTask = { title: "Tối ưu hóa tập lệnh SIMD/DSP cho mô hình AI", stage: "Bước 6: AI Model" };
        }

        // 2. Tìm bài tập CodeLearn tiếp theo
        let nextCodeProb = null;
        if (typeof practiceExercises !== 'undefined' && Array.isArray(practiceExercises) && practiceExercises.length > 0) {
            for (let p of practiceExercises) {
                if (!profile || !profile.solvedProblems || !profile.solvedProblems.includes(p.id)) {
                    nextCodeProb = p;
                    break;
                }
            }
            if (!nextCodeProb) {
                nextCodeProb = practiceExercises[0];
            }
        }

        const codeTitle = (nextCodeProb && nextCodeProb.title) ? nextCodeProb.title : "Luyện Thuật Toán C & Bitwise";
        const codeXp = (nextCodeProb && nextCodeProb.xp) ? nextCodeProb.xp : 50;

        // Phân bổ nhiệm vụ theo thời lượng
        let dailyTasks = [];

        if (decisionDuration === 30) {
            dailyTasks = [
                {
                    topic: "LỘ TRÌNH EDGE AI",
                    title: `${nextRoadmapTask.stage}: ${nextRoadmapTask.title}`,
                    time: "15 Phút",
                    actionText: "Mở Lộ Trình →",
                    actionFn: "switchTab('learning')",
                    isEnglish: false
                },
                {
                    topic: "TIẾNG ANH RA TRƯỜNG",
                    title: "Luyện 15 phút từ vựng kỹ thuật & đề thi trên tienganhratruong.com",
                    time: "15 Phút",
                    actionText: "Mở tienganhratruong ↗",
                    actionFn: "openTiengAnhRaTruong()",
                    isEnglish: true
                }
            ];
        } else if (decisionDuration === 60) {
            dailyTasks = [
                {
                    topic: "LỘ TRÌNH EDGE AI",
                    title: `${nextRoadmapTask.stage}: ${nextRoadmapTask.title}`,
                    time: "25 Phút",
                    actionText: "Vào Học →",
                    actionFn: "switchTab('learning')",
                    isEnglish: false
                },
                {
                    topic: "LUYỆN CODE C & AI",
                    title: `${codeTitle} (+${codeXp} XP)`,
                    time: "15 Phút",
                    actionText: "Vào Giải →",
                    actionFn: "switchTab('practice')",
                    isEnglish: false
                },
                {
                    topic: "TIẾNG ANH RA TRƯỜNG",
                    title: "Làm bài test 20 phút trên Dashboard tienganhratruong.com để chuẩn bị tốt nghiệp",
                    time: "20 Phút",
                    actionText: "Mở tienganhratruong ↗",
                    actionFn: "openTiengAnhRaTruong()",
                    isEnglish: true
                }
            ];
        } else {
            // Chế độ 120 phút chuyên sâu
            dailyTasks = [
                {
                    topic: "LỘ TRÌNH CHUYÊN SÂU",
                    title: `${nextRoadmapTask.stage}: Thực hành & ghi chép mã nguồn C/C++`,
                    time: "50 Phút",
                    actionText: "Vào Học →",
                    actionFn: "switchTab('learning')",
                    isEnglish: false
                },
                {
                    topic: "ĐẤU TRƯỜNG CODE & AI",
                    title: `Thực hành ${codeTitle} và hoàn thiện toàn bộ Test Cases`,
                    time: "30 Phút",
                    actionText: "Vào Giải →",
                    actionFn: "switchTab('practice')",
                    isEnglish: false
                },
                {
                    topic: "TIẾNG ANH & DATASHEET",
                    title: "40 phút luyện đề trên tienganhratruong.com + Đọc ESP32 Technical Reference",
                    time: "40 Phút",
                    actionText: "Mở tienganhratruong ↗",
                    actionFn: "openTiengAnhRaTruong()",
                    isEnglish: true
                }
            ];
        }

        dailyTasks.forEach((dt, idx) => {
            const item = document.createElement("div");
            item.className = "decision-task-item";
            item.id = `dt-item-${idx}`;

            item.innerHTML = `
                <div class="task-left">
                    <div class="task-checkbox" onclick="toggleDailyTask(${idx})">✓</div>
                    <div class="task-info-main">
                        <span class="task-topic-badge" style="color: ${dt.isEnglish ? '#60a5fa' : 'var(--primary)'};">
                            ${dt.topic}
                        </span>
                        <span class="task-title-text">${dt.title}</span>
                    </div>
                </div>
                <div class="task-right-actions">
                    <span class="task-time-tag">⏱️ ${dt.time}</span>
                    <button class="btn-task-action ${dt.isEnglish ? 'btn-task-english' : ''}" onclick="${dt.actionFn}">
                        ${dt.actionText}
                    </button>
                </div>
            `;
            container.appendChild(item);
        });

        const streakEl = document.getElementById("streak-counter");
        if (streakEl && typeof studyStreak !== 'undefined') {
            streakEl.innerText = `🔥 Chuỗi học: ${studyStreak.count || 1} ngày liên tục`;
        }
    } catch (err) {
        console.error("Lỗi khi tạo danh sách nhiệm vụ hôm nay:", err);
    }
}

function toggleDailyTask(idx) {
    const item = document.getElementById(`dt-item-${idx}`);
    if (item) item.classList.toggle("completed");
}

function completeDailyGoals() {
    document.querySelectorAll(".decision-task-item").forEach(it => it.classList.add("completed"));

    const todayStr = new Date().toDateString();
    if (typeof studyStreak !== 'undefined') {
        if (studyStreak.lastCompletedDate !== todayStr) {
            studyStreak.count = (studyStreak.count || 0) + 1;
            studyStreak.lastCompletedDate = todayStr;
            localStorage.setItem(STORAGE_STREAK, JSON.stringify(studyStreak));
        }

        const streakEl = document.getElementById("streak-counter");
        if (streakEl) {
            streakEl.innerText = `🔥 Chuỗi học: ${studyStreak.count} ngày liên tục`;
        }
    }
    showToast("🎉 Xuất sắc! Mr. Thai đã hoàn thành toàn bộ mục tiêu hôm nay!");
    // Play achievement complete SFX
    if (typeof AudioEngine !== 'undefined') AudioEngine.playSFX('complete');
}