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
`# THÔNG TIN ỨNG VIÊN / EMBEDDED & EDGE AI ENGINEER PROFILE
- Họ và tên: ${profile.name}
- Định hướng: ${profile.role}
- Trạng thái hiện tại: ${stats.rank.title} (Hoàn thành ${stats.percent}% Lộ trình Kỹ Sư 14 bước • 4 Chặng Nghề Nghiệp | ${profile.xp} XP)
- Thành tích Thuật toán & Code C: Đã giải đúng ${solvedCount}/${practiceExercises.length} bài tập Code C & TinyML
- Đấu trường Phỏng Vấn: Đã vượt qua các câu hỏi trắc nghiệm bẫy C & Firmware từ Bosch, Renesas, Viettel, FPT
- Chuẩn ngoại ngữ: Đang duy trì rèn luyện thường xuyên trên tienganhratruong.com
- Liên hệ / Portfolio Online: ${profile.contact || 'https://v2tacodin.github.io/Edge_AI/#profile'}

## TÓM TẮT NĂNG LỰC THỰC CHIẾN
${profile.bio}

## KỸ NĂNG ĐÃ KIỂM CHỨNG & TÍCH LŨY (${stats.completedTasks}/${stats.totalTasks} kỹ năng chuẩn công nghiệp):
${skillsString}

## CƠ SỞ KỸ THUẬT & DỰ ÁN ĐÃ THỰC HÀNH (4 CHẶNG NGHỀ NGHIỆP):
1. 🎓 Nền tảng Sinh viên: Con trỏ C nâng cao, Quản lý bộ nhớ SRAM/PSRAM, Timer định thời chính xác, Xử lý ngắt ISR và Lọc số FFT.
2. 🏆 Đồ án Tốt nghiệp Edge AI (A+): Kiến trúc FreeRTOS 2 nhân, Lượng tử hóa INT8 TFLite Micro, Nguồn ULP Deep Sleep và Benchmarking khoa học.
3. 💼 Phỏng vấn Intern: Làm chủ các bẫy C kinh điển (volatile, struct padding, callback), Thanh ghi trần Bare-metal, Đo kiểm với Logic Analyzer và JTAG.
4. 🚀 Kỹ sư Fresher: Tiêu chuẩn an toàn ô tô MISRA C:2012, Mạng truyền thông công nghiệp CAN Bus / Modbus, Unit Test tự động Unity/CMock & CI/CD.`;

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

        function copyPortfolioLink() {
            const url = window.location.origin + window.location.pathname + "#profile";
            navigator.clipboard.writeText(url).then(() => {
                showToast("🔗 Đã sao chép link Portfolio Online để gửi HR / Nhà tuyển dụng!");
            }).catch(() => {
                prompt("Copy link Portfolio bên dưới:", url);
            });
        }


        
