// ==========================================
// 10. SAO LƯU & PHỤC HỒI DỮ LIỆU (JSON)
// ==========================================
// 2. SAO LƯU & PHỤC HỒI DỮ LIỆU (JSON)
        // ==========================================
        function exportBackupData() {
            const backupPayload = {
                version: "2.5",
                exportDate: new Date().toISOString(),
                user: "Mr. Thai",
                profile: profile,
                roadmap: roadmap,
                notes: notes,
                studyStreak: studyStreak,
                codeCache: codeCache
            };
            const jsonStr = JSON.stringify(backupPayload, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `mr_thai_edge_ai_backup_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Đã tải xuống file sao lưu đầy đủ!");
        }

        function handleRestoreFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.profile) {
                        profile = data.profile;
                        localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
                    }
                    if (data.roadmap) {
                        roadmap = data.roadmap;
                        localStorage.setItem(STORAGE_ROADMAP, JSON.stringify(roadmap));
                    }
                    if (data.notes) {
                        notes = data.notes;
                        localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
                    }
                    if (data.studyStreak) {
                        studyStreak = data.studyStreak;
                        localStorage.setItem(STORAGE_STREAK, JSON.stringify(studyStreak));
                    }
                    if (data.codeCache) {
                        codeCache = data.codeCache;
                        localStorage.setItem(STORAGE_CODE_CACHE, JSON.stringify(codeCache));
                    }

                    renderRoadmap();
                    renderNotes();
                    renderPracticeView();
                    renderProfileView();
                    generateDailyDecision(false);
                    updatePortalStats();
                    showToast("🎉 Phục hồi dữ liệu thành công từ file JSON!");
                } catch(err) {
                    alert("Lỗi đọc file JSON: " + err.message);
                }
            };
            reader.readAsText(file);
            event.target.value = "";
        }

        // ==========================================
        
