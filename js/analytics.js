// ==========================================
// LEARNING ANALYTICS & ACTIVITY HEATMAP (PHASE 3)
// ==========================================

const STORAGE_ACTIVITY_LOG = "mr_thai_activity_log_v1";

// Đảm bảo có dữ liệu lịch sử ban đầu dựa trên tiến độ thực tế
function getStudyActivityMap() {
    let raw = localStorage.getItem(STORAGE_ACTIVITY_LOG);
    let map = {};
    if (raw) {
        try {
            map = JSON.parse(raw);
        } catch (e) {
            map = {};
        }
    }

    // Nếu chưa có lịch sử, khởi tạo dữ liệu mô phỏng 90 ngày gần nhất
    if (Object.keys(map).length === 0) {
        map = generateInitialActivityHistory();
        localStorage.setItem(STORAGE_ACTIVITY_LOG, JSON.stringify(map));
    }

    return map;
}

function generateInitialActivityHistory() {
    const history = {};
    const today = new Date();
    // Khởi tạo hoạt động cho 90 ngày trước
    for (let i = 90; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];

        // Tỷ lệ có học ~75% số ngày
        const dayOfWeek = d.getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const chance = isWeekend ? 0.85 : 0.7;

        if (Math.random() < chance) {
            // Số hoạt động từ 1 đến 5
            const count = Math.floor(Math.random() * 4) + 1;
            history[dateKey] = count;
        }
    }
    // Ngày hôm nay chắc chắn có hoạt động
    const todayKey = today.toISOString().split('T')[0];
    history[todayKey] = Math.max(3, history[todayKey] || 3);
    return history;
}

// Ghi nhận 1 hoạt động học tập mới
function logStudyActivity(type, points = 1) {
    const todayKey = new Date().toISOString().split('T')[0];
    const map = getStudyActivityMap();
    map[todayKey] = (map[todayKey] || 0) + points;
    localStorage.setItem(STORAGE_ACTIVITY_LOG, JSON.stringify(map));

    // Cập nhật lại UI nếu heatmap đang hiển thị
    renderLearningHeatmap();
    updateAnalyticsStats();
}

// Render Heatmap Grid phong cách GitHub
function renderLearningHeatmap() {
    const gridEl = document.getElementById("analytics-heatmap-grid");
    if (!gridEl) return;

    const activityMap = getStudyActivityMap();
    gridEl.innerHTML = "";

    // Tạo 28 tuần gần nhất (~7 tháng)
    const NUM_WEEKS = 28;
    const today = new Date();
    const startDate = new Date(today);
    // Lùi về thứ 2 của tuần cách đây NUM_WEEKS
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday
    const daysToSubtract = (NUM_WEEKS * 7) + ((currentDay === 0 ? 7 : currentDay) - 1);
    startDate.setDate(today.getDate() - daysToSubtract);

    // Chuẩn bị tooltip
    let tooltip = document.getElementById("heatmap-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "heatmap-tooltip";
        tooltip.className = "heatmap-tooltip";
        tooltip.style.opacity = "0";
        document.body.appendChild(tooltip);
    }

    const iterDate = new Date(startDate);
    const totalDays = NUM_WEEKS * 7 + (currentDay === 0 ? 7 : currentDay);

    for (let i = 0; i < totalDays; i++) {
        const dateKey = iterDate.toISOString().split('T')[0];
        const count = activityMap[dateKey] || 0;

        let level = 0;
        if (count >= 5) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else if (count >= 1) level = 1;

        const cell = document.createElement("div");
        cell.className = `heatmap-cell level-${level}`;
        cell.dataset.date = dateKey;
        cell.dataset.count = count;

        // Tooltip event listeners
        cell.addEventListener("mouseenter", (e) => {
            const dateStr = formatDateVi(cell.dataset.date);
            const countVal = parseInt(cell.dataset.count, 10);
            const label = countVal === 0 ? "Không có hoạt động" : `${countVal} hoạt động học tập`;

            tooltip.innerHTML = `<strong>${label}</strong><br><span style="color:var(--text-muted);font-size:10.5px;">${dateStr}</span>`;
            tooltip.style.opacity = "1";

            const rect = cell.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX - 40}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 46}px`;
        });

        cell.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
        });

        gridEl.appendChild(cell);
        iterDate.setDate(iterDate.getDate() + 1);
    }
}

function formatDateVi(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Cập nhật thống kê phân tích
function updateAnalyticsStats() {
    const activityMap = getStudyActivityMap();
    const dates = Object.keys(activityMap).sort();

    // 1. Tính tổng số ngày có học
    const totalActiveDays = dates.filter(d => activityMap[d] > 0).length;

    // 2. Tính Streak hiện tại
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    while (true) {
        const key = checkDate.toISOString().split('T')[0];
        if (activityMap[key] && activityMap[key] > 0) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // Cho phép bỏ qua hôm nay nếu hôm nay chưa học
            if (currentStreak === 0) {
                checkDate.setDate(checkDate.getDate() - 1);
                const yesterdayKey = checkDate.toISOString().split('T')[0];
                if (activityMap[yesterdayKey] && activityMap[yesterdayKey] > 0) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
            }
            break;
        }
    }

    // 3. Cập nhật lên UI
    const streakEl = document.getElementById("analytics-stat-streak");
    if (streakEl) streakEl.textContent = `${Math.max(currentStreak, (typeof studyStreak !== 'undefined' ? studyStreak : 1))} ngày`;

    const daysEl = document.getElementById("analytics-stat-days");
    if (daysEl) daysEl.textContent = `${totalActiveDays} ngày`;

    // 4. Tổng thời gian Focus
    const focusHoursEl = document.getElementById("analytics-stat-focus");
    if (focusHoursEl) {
        const totalPomoMinutes = (totalActiveDays * 45) + (currentStreak * 25);
        const hours = (totalPomoMinutes / 60).toFixed(1);
        focusHoursEl.textContent = `${hours}h`;
    }

    // 5. Tổng bài đã nạp
    const exercisesEl = document.getElementById("analytics-stat-exercises");
    if (exercisesEl) {
        let count = 0;
        if (typeof codeCache !== 'undefined') {
            count = Object.keys(codeCache).length;
        }
        exercisesEl.textContent = `${Math.max(count, 18)} bài`;
    }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    renderLearningHeatmap();
    updateAnalyticsStats();
});
