// ==========================================
// 8. PROFILE & AUTO-GENERATED CV
// ==========================================
// RENDER CỬA SỔ GIỚI THIỆU BẢN THÂN & NĂNG LỰC
        // ==========================================
        function renderProfileView() {
            const stats = calculateStats();
            const solvedCount = profile.solvedProblems ? profile.solvedProblems.length : 0;

            document.getElementById("profile-avatar-icon").innerText = profile.icon || "🤖";
            document.getElementById("hero-badge-lvl").innerText = stats.rank.code;
            document.getElementById("hero-name-display").innerText = profile.name;
            document.getElementById("hero-rank-display").innerText = stats.rank.title;
            document.getElementById("hero-total-xp").innerText = "⭐ " + profile.xp + " XP";
            document.getElementById("hero-role-display").innerText = profile.role;
            document.getElementById("hero-bio-display").innerText = profile.bio;

            document.getElementById("metric-tasks-done").innerText = `${stats.completedTasks}/${stats.totalTasks}`;
            document.getElementById("metric-code-solved").innerText = `${solvedCount}/${practiceExercises.length}`;
            document.getElementById("metric-notes-count").innerText = notes.length;
            document.getElementById("metric-mastery-percent").innerText = stats.percent + "%";

            // 6 Domain Cards
            const domainContainer = document.getElementById("domain-cards-container");
            domainContainer.innerHTML = "";
            stats.stageStats.forEach(st => {
                const card = document.createElement("div");
                card.className = "domain-card";
                card.innerHTML = `
                    <div class="domain-header">
                        <span class="domain-name">${st.icon} ${st.stageName}</span>
                        <span class="domain-stat">${st.done}/${st.total} (${st.percent}%)</span>
                    </div>
                    <div class="domain-bar">
                        <div class="domain-bar-fill" style="width: ${st.percent}%;"></div>
                    </div>
                `;
                domainContainer.appendChild(card);
            });

            // 24 Verified Skills
            const skillsContainer = document.getElementById("skills-matrix-container");
            skillsContainer.innerHTML = "";

            let unlockedSkillsList = [];

            roadmap.forEach(stage => {
                stage.tasks.forEach(task => {
                    const pill = document.createElement("div");
                    const isUnlocked = task.done;
                    if (isUnlocked) {
                        unlockedSkillsList.push(task.skill);
                    }

                    pill.className = `skill-pill ${isUnlocked ? 'unlocked' : 'locked'}`;
                    pill.innerHTML = `
                        <div class="skill-pill-left">
                            <span class="skill-icon">${isUnlocked ? '✅' : '🔒'}</span>
                            <div class="skill-info">
                                <span class="skill-name">${task.skill}</span>
                                <span class="skill-category">${stage.stage}</span>
                            </div>
                        </div>
                        <span class="skill-badge ${isUnlocked ? 'badge-verified' : 'badge-locked'}">
                            ${isUnlocked ? 'ĐÃ LÀM CHỦ' : 'ĐANG RÈN'}
                        </span>
                    `;
                    skillsContainer.appendChild(pill);
                });
            });

            // Auto-generated CV Text
            const autoCvContainer = document.getElementById("auto-cv-text");
            const skillsString = unlockedSkillsList.length > 0 
                ? unlockedSkillsList.map(s => `  • ${s}`).join("\n") 
                : "  • Đang trong quá trình rèn luyện các bước nền tảng C, Ngắt và Cảm biến.";

            const generatedText = 
`# THÔNG TIN ỨNG VIÊN / EDGE AI DEVELOPER PROFILE
- Họ và tên: ${profile.name}
- Định hướng: ${profile.role}
- Trạng thái hiện tại: ${stats.rank.title} (Hoàn thành ${stats.percent}% Lộ trình Edge AI 6 bước | ${profile.xp} XP)
- Thành tích Thuật toán & AI: Đã giải đúng ${solvedCount}/${practiceExercises.length} bài tập CodeLearn & TinyML
- Chuẩn ngoại ngữ: Đang duy trì rèn luyện thường xuyên trên tienganhratruong.com
- Liên hệ / Portfolio: ${profile.contact || 'Chưa cập nhật'}

## TÓM TẮT NĂNG LỰC THỰC CHIẾN
${profile.bio}

## KỸ NĂNG ĐÃ KIỂM CHỨNG & TÍCH LŨY (${stats.completedTasks}/${stats.totalTasks} kỹ năng):
${skillsString}

## CƠ SỞ KỸ THUẬT & DỰ ÁN ĐÃ THỰC HÀNH:
- Đã giải quyết ${solvedCount} thử thách lập trình C phần cứng và lượng tử hóa mô hình AI.
- Đã hoàn thiện và ghi chép ${notes.length} chuyên đề kỹ thuật chuyên sâu qua 6 bước (C & Bộ nhớ, Timer & Interrupt, Cảm biến, FreeRTOS, Network/OTA, TFLite Micro).
- Tích hợp thành công mô hình học sâu suy luận độc lập trên chip ESP32 mà không phụ thuộc vào Cloud.`;

            autoCvContainer.innerText = generatedText;
        }

        

// QUẢN LÝ CHỈNH SỬA PROFILE
        // ==========================================
        function openEditProfileModal() {
            document.getElementById("edit-profile-name").value = profile.name;
            document.getElementById("edit-profile-role").value = profile.role;
            document.getElementById("edit-profile-icon").value = profile.icon || "🤖";
            document.getElementById("edit-profile-bio").value = profile.bio;
            document.getElementById("edit-profile-contact").value = profile.contact || "";
            document.getElementById("edit-profile-modal").classList.add("active");
        }

        function closeEditProfileModal() {
            document.getElementById("edit-profile-modal").classList.remove("active");
        }

        document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
            e.preventDefault();
            profile.name = document.getElementById("edit-profile-name").value.trim();
            profile.role = document.getElementById("edit-profile-role").value.trim();
            profile.icon = document.getElementById("edit-profile-icon").value;
            profile.bio = document.getElementById("edit-profile-bio").value.trim();
            profile.contact = document.getElementById("edit-profile-contact").value.trim();

            localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
            closeEditProfileModal();
            renderProfileView();
            showToast("Đã cập nhật hồ sơ cá nhân thành công!");
        });

        function copyAutoIntroduction() {
            const cvText = document.getElementById("auto-cv-text").innerText;
            navigator.clipboard.writeText(cvText).then(() => {
                showToast("📋 Đã sao chép đoạn Giới Thiệu Bản Thân vào Clipboard!");
            }).catch(() => {
                alert("Không thể sao chép tự động, vui lòng chọn văn bản và copy thủ công.");
            });
        }

        
