// ==========================================
// 9. KỸ SƯ POMODORO TIMER ENGINE
// ==========================================
// 1. KỸ SƯ POMODORO TIMER ENGINE
        // ==========================================
        let pomoMinutes = 25;
        let pomoSeconds = 0;
        let pomoIsRunning = false;
        let pomoInterval = null;
        let pomoMode = "work"; // "work" or "break"
        const STORAGE_POMO_SESSIONS = "mr_thai_pomo_sessions_v1";
        let pomoSessionsDone = parseInt(localStorage.getItem(STORAGE_POMO_SESSIONS) || "0", 10);

        function playSynthesizedChime() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.8);
            } catch(e) {}
        }

        function updatePomoDisplay() {
            const minStr = pomoMinutes < 10 ? "0" + pomoMinutes : pomoMinutes;
            const secStr = pomoSeconds < 10 ? "0" + pomoSeconds : pomoSeconds;
            document.getElementById("pomo-timer-text").innerText = `${minStr}:${secStr}`;
        }

        function togglePomodoro() {
            pomoIsRunning = !pomoIsRunning;
            const btn = document.getElementById("pomo-btn-play");
            if (pomoIsRunning) {
                btn.innerText = "⏸";
                pomoInterval = setInterval(() => {
                    if (pomoSeconds === 0) {
                        if (pomoMinutes === 0) {
                            clearInterval(pomoInterval);
                            pomoIsRunning = false;
                            btn.innerText = "▶";
                            playSynthesizedChime();
                            if (pomoMode === "work") {
                                pomoSessionsDone++;
                                localStorage.setItem(STORAGE_POMO_SESSIONS, pomoSessionsDone.toString());
                                if (typeof logStudyActivity === 'function') {
                                    logStudyActivity('pomo', 3, `Phiên Focus 25 phút (#${pomoSessionsDone})`);
                                }
                                showToast(`🎉 Hoàn thành phiên tập trung #${pomoSessionsDone}! Hãy nghỉ ngơi 5 phút.`);
                                pomoMode = "break";
                                pomoMinutes = 5;
                                pomoSeconds = 0;
                                document.getElementById("pomo-badge").className = "pomo-mode-badge pomo-mode-break";
                                document.getElementById("pomo-badge").innerText = "REST";
                            } else {
                                showToast("⏱️ Hết giờ nghỉ! Sẵn sàng cho phiên học tiếp theo.");
                                pomoMode = "work";
                                pomoMinutes = 25;
                                pomoSeconds = 0;
                                document.getElementById("pomo-badge").className = "pomo-mode-badge pomo-mode-work";
                                document.getElementById("pomo-badge").innerText = "FOCUS";
                            }
                            updatePomoDisplay();
                            return;
                        }
                        pomoMinutes--;
                        pomoSeconds = 59;
                    } else {
                        pomoSeconds--;
                    }
                    updatePomoDisplay();
                }, 1000);
            } else {
                btn.innerText = "▶";
                clearInterval(pomoInterval);
            }
        }

        function resetPomodoro() {
            clearInterval(pomoInterval);
            pomoIsRunning = false;
            document.getElementById("pomo-btn-play").innerText = "▶";
            pomoMinutes = pomoMode === "work" ? 25 : 5;
            pomoSeconds = 0;
            updatePomoDisplay();
        }

        function switchPomodoroMode() {
            clearInterval(pomoInterval);
            pomoIsRunning = false;
            document.getElementById("pomo-btn-play").innerText = "▶";
            if (pomoMode === "work") {
                pomoMode = "break";
                pomoMinutes = 5;
                pomoSeconds = 0;
                document.getElementById("pomo-badge").className = "pomo-mode-badge pomo-mode-break";
                document.getElementById("pomo-badge").innerText = "REST";
            } else {
                pomoMode = "work";
                pomoMinutes = 25;
                pomoSeconds = 0;
                document.getElementById("pomo-badge").className = "pomo-mode-badge pomo-mode-work";
                document.getElementById("pomo-badge").innerText = "FOCUS";
            }
            updatePomoDisplay();
        }

        // ==========================================
        
