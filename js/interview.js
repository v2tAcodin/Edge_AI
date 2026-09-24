// ==========================================
// INTERVIEW PREP & EMBEDDED QUIZ ARENA
// ==========================================

const interviewQuestions = [
    {
        id: "q1",
        category: "c_memory",
        company: "Bosch / Qualcomm",
        question: "Trong lập trình nhúng C, tại sao một biến được thay đổi bên trong hàm ngắt (ISR) và đọc trong vòng lặp chính (main loop) bắt buộc phải khai báo với từ khóa 'volatile'?",
        options: [
            "Để cấp phát biến này trong vùng nhớ nhanh IRAM thay vì DRAM.",
            "Để ngăn trình biên dịch tối ưu hóa (optimizer) lưu giá trị biến vào thanh ghi CPU (Register), buộc đọc trực tiếp từ bộ nhớ RAM mỗi lần truy xuất.",
            "Để tự động khóa luồng (Mutex lock) tránh xung đột tài nguyên giữa ngắt và main.",
            "Để mở rộng kích thước biến từ 16-bit lên 32-bit nhằm tương thích thanh ghi CPU."
        ],
        correct: 1,
        explanation: "Khi không có từ khóa `volatile`, trình biên dịch nhận thấy trong `while(1)` không có dòng lệnh nào thay đổi biến này, nên nó sẽ tối ưu bằng cách tải biến vào thanh ghi CPU 1 lần duy nhất và không đọc lại từ RAM. Khi hàm ngắt ISR thay đổi giá trị trong RAM, vòng lặp chính sẽ không bao giờ nhìn thấy giá trị mới!"
    },
    {
        id: "q2",
        category: "freertos",
        company: "Viettel / Renesas",
        question: "Hiện tượng 'Priority Inversion' (Đảo ngược mức ưu tiên) trong hệ điều hành thời gian thực FreeRTOS xảy ra khi nào, và cơ chế nào được dùng để khắc phục?",
        options: [
            "Xảy ra khi Task ưu tiên cao bị chiếm CPU bởi Task ưu tiên thấp; khắc phục bằng cách tăng Stack size.",
            "Xảy ra khi Task ưu tiên cao bị block bởi tài nguyên do Task ưu tiên thấp giữ, trong khi một Task ưu tiên trung bình cướp CPU của Task thấp; khắc phục bằng Priority Inheritance (Thừa kế mức ưu tiên của Mutex).",
            "Xảy ra khi hai Task có cùng Priority tranh chấp hàng đợi Queue; khắc phục bằng Round-Robin scheduling.",
            "Xảy ra khi Task Watchdog Timer bị timeout; khắc phục bằng hàm esp_task_wdt_reset()."
        ],
        correct: 1,
        explanation: "Priority Inversion là lỗi kinh điển trong RTOS (từng làm tê liệt tàu Mars Pathfinder năm 1997). Khi Task Cao cần khóa Mutex đang do Task Thấp giữ, một Task Trung Bình xuất hiện và chiếm CPU của Task Thấp, gián tiếp làm Task Cao bị treo vô tận. FreeRTOS Mutex giải quyết bằng 'Priority Inheritance': tạm thời nâng mức ưu tiên của Task Thấp lên bằng Task Cao để nó giải phóng Mutex nhanh nhất."
    },
    {
        id: "q3",
        category: "tinyml",
        company: "Google / Espressif",
        question: "Tại sao trong mô hình học sâu triển khai trên vi điều khiển (TinyML), kỹ thuật Lượng tử hóa INT8 (Post-Training Quantization) lại vượt trội so với sử dụng số thực Float32?",
        options: [
            "Vì INT8 tăng độ chính xác phân loại của mô hình lên gấp đôi.",
            "Vì INT8 giảm 75% dung lượng ROM/RAM (từ 4 bytes xuống 1 byte mỗi trọng số) và tăng tốc tính toán từ 3 đến 5 lần nhờ tập lệnh số nguyên SIMD mà hầu như không suy giảm độ chính xác.",
            "Vì số thực Float32 không thể lưu trữ được trên bộ nhớ Flash SPI của ESP32.",
            "Vì TensorFlow Lite Micro chỉ hỗ trợ các phép toán trên số nguyên, không có thư viện tính số thực."
        ],
        correct: 1,
        explanation: "Mỗi giá trị Float32 tốn 4 bytes, trong khi INT8 chỉ tốn 1 byte -> mô hình giảm 4 lần (giảm 75% RAM/Flash). Ngoài ra, các vi điều khiển như ESP32-S3 hoặc ARM Cortex-M có tập lệnh phần cứng SIMD (Single Instruction Multiple Data) xử lý 4 hoặc 8 phép nhân cộng dồn INT8 trong duy nhất 1 chu kỳ xung nhịp!"
    },
    {
        id: "q4",
        category: "peripherals",
        company: "FPT Software / LG",
        question: "Định lý lấy mẫu Nyquist-Shannon quy định tần số lấy mẫu tối thiểu (Sampling Rate - Fs) đối với tín hiệu âm thanh có tần số cao nhất là 8 kHz phải là bao nhiêu để không bị hiện tượng méo tín hiệu (Aliasing)?",
        options: [
            "Fs tối thiểu = 4 kHz.",
            "Fs tối thiểu = 8 kHz.",
            "Fs tối thiểu = 16 kHz (gấp đôi tần số cao nhất của tín hiệu).",
            "Fs tối thiểu = 32 kHz."
        ],
        correct: 2,
        explanation: "Định lý Nyquist chỉ rõ: Tần số lấy mẫu phải lớn hơn hoặc bằng ít nhất 2 lần tần số thành phần cao nhất của tín hiệu (Fs >= 2 * Fmax). Vì giọng nói người có dải âm quan trọng lên tới ~8 kHz, các hệ thống nhận diện từ khóa (Keyword Spotting) luôn chọn Fs chuẩn là 16.000 Hz (16 kHz)."
    },
    {
        id: "q5",
        category: "c_memory",
        company: "Qualcomm / Intel",
        question: "Sự khác biệt căn bản giữa 'Stack' và 'Heap' trong quản lý bộ nhớ vi điều khiển là gì?",
        options: [
            "Stack dùng cho cấp phát động malloc(), còn Heap lưu trữ biến cục bộ.",
            "Stack được quản lý tự động theo cơ chế LIFO cho biến cục bộ và địa chỉ hàm quay về; còn Heap dùng cho cấp phát động thủ công và có nguy cơ cao gây phân mảnh bộ nhớ (Fragmentation).",
            "Stack nằm trên bộ nhớ ngoài PSRAM, còn Heap luôn nằm trên bộ nhớ trong SRAM.",
            "Stack không bị giới hạn kích thước, còn Heap tối đa chỉ 4 KB."
        ],
        correct: 1,
        explanation: "Stack hoạt động cực nhanh theo LIFO, tự động thu hồi khi thoát hàm. Heap cho phép cấp phát kích thước linh hoạt lúc runtime bằng `malloc()`, nhưng nếu cấp phát và giải phóng liên tục sẽ để lại các 'lỗ thủng' không liền kề (phân mảnh), dẫn đến sau vài giờ chạy liên tục thì `malloc()` trả về NULL dù tổng SRAM còn trống rất nhiều."
    },
    {
        id: "q6",
        category: "tinyml",
        company: "Sony / STMicroelectronics",
        question: "Trong công thức lượng tử hóa INT8: real_value = scale * (quantized_value - zero_point), ý nghĩa của tham số 'zero_point' là gì?",
        options: [
            "Là ngưỡng xác suất Softmax để quyết định mô hình dự đoán đúng hay sai.",
            "Là giá trị nguyên INT8 tương ứng với giá trị số thực 0.0, giúp bảo toàn tính đối xứng và không làm lệch điểm gốc sau các hàm kích hoạt như ReLU.",
            "Là địa chỉ ô nhớ bắt đầu của Tensor Arena trong bộ nhớ SRAM.",
            "Là số lượng lớp nơ-ron bị triệt tiêu sau khi cắt tỉa (Pruning)."
        ],
        correct: 1,
        explanation: "Các hàm kích hoạt như ReLU biến toàn bộ giá trị âm thành đúng 0.0. Nếu phép lượng tử hóa không có `zero_point`, giá trị 0.0 thực tế có thể bị ánh xạ thành -128 hoặc một số khác, làm hỏng cấu trúc phân phối dữ liệu. `zero_point` đảm bảo số thực 0.0 luôn được biểu diễn chính xác bằng một số nguyên nguyên vẹn."
    },
    {
        id: "q7",
        category: "freertos",
        company: "Bosch / Viettel",
        question: "Tại sao trong hàm xử lý ngắt ISR của FreeRTOS, ta PHẢI sử dụng hàm 'xQueueSendFromISR' thay vì hàm thông thường 'xQueueSend'?",
        options: [
            "Vì hàm xQueueSend có kích thước file nhị phân lớn hơn.",
            "Vì hàm thông thường có cơ chế block/wait timeout (gọi vTaskSuspend), điều này tuyệt đối bị cấm trong ngắt phần cứng; hàm FromISR không bao giờ block và cung cấp cờ đánh thức Task ưu tiên cao hơn.",
            "Vì hàm xQueueSend chỉ truyền được kiểu dữ liệu int, còn FromISR truyền được struct.",
            "Vì xQueueSend chỉ chạy được trên Core 0 của ESP32."
        ],
        correct: 1,
        explanation: "Hàm `xQueueSend` có tham số `xTicksToWait` - nếu hàng đợi đầy, Task sẽ ngủ để chờ. Trong khi đó, phần cứng vi điều khiển không có khái niệm 'ngủ trong hàm ngắt'! Nếu ngắt bị chặn chờ, toàn bộ CPU sẽ bị treo. Hàm `FromISR` không bao giờ chờ, nếu đầy nó trả về `errQUEUE_FULL` ngay lập tức và trả cờ `pxHigherPriorityTaskWoken` để yêu cầu đổi ngữ cảnh an toàn."
    },
    {
        id: "q8",
        category: "c_memory",
        company: "Samsung / Renesas",
        question: "Đoạn code sau có lỗi tiềm ẩn gì trong lập trình nhúng: `char* get_sensor_string() { char buf[32]; strcpy(buf, 'OK'); return buf; }`?",
        options: [
            "Lỗi tràn bộ nhớ Heap.",
            "Lỗi Dangling Pointer (Con trỏ lơ lửng) vì mảng buf được cấp phát trên Stack, khi hàm kết thúc Stack frame bị giải phóng và vùng nhớ đó trở nên vô hiệu.",
            "Lỗi cú pháp không thể biên dịch được trong chuẩn C99.",
            "Lỗi thiếu từ khóa static cho con trỏ trả về."
        ],
        correct: 1,
        explanation: "Biến cục bộ `buf` nằm trên Stack của hàm `get_sensor_string`. Khi hàm return, con trỏ Stack lùi lại, vùng nhớ đó có thể bị ghi đè bất cứ lúc nào bởi hàm khác. Trả về con trỏ tới biến cục bộ trên Stack là lỗi cực kỳ nguy hiểm, dẫn đến dữ liệu rác hoặc crash hệ thống."
    }
];

let userQuizAnswers = {};
let currentQuizCategory = "all";

function setQuizFilter(cat) {
    currentQuizCategory = cat;
    document.querySelectorAll(".quiz-filter-btn").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("quiz-filter-" + cat);
    if (btn) btn.classList.add("active");
    renderInterviewArena();
}

function renderInterviewArena() {
    const container = document.getElementById("quiz-questions-container");
    if (!container) return;

    container.innerHTML = "";

    const filtered = interviewQuestions.filter(q => {
        return currentQuizCategory === "all" || q.category === currentQuizCategory;
    });

    let answeredCorrectCount = 0;
    Object.keys(userQuizAnswers).forEach(qid => {
        const q = interviewQuestions.find(item => item.id === qid);
        if (q && userQuizAnswers[qid] === q.correct) answeredCorrectCount++;
    });

    const scoreNum = document.getElementById("quiz-score-display");
    if (scoreNum) scoreNum.innerText = `${answeredCorrectCount}/${interviewQuestions.length}`;

    filtered.forEach((q, qIdx) => {
        const card = document.createElement("div");
        card.className = "quiz-card";
        card.id = `quiz-card-${q.id}`;

        const isAnswered = userQuizAnswers[q.id] !== undefined;
        const userAnswer = userQuizAnswers[q.id];

        let optionsHtml = "";
        const letters = ["A", "B", "C", "D"];

        q.options.forEach((opt, optIdx) => {
            let stateClass = "";
            if (isAnswered) {
                if (optIdx === q.correct) stateClass = "correct";
                else if (optIdx === userAnswer) stateClass = "incorrect";
            }

            optionsHtml += `
                <button class="quiz-opt-btn ${stateClass}" 
                        ${isAnswered ? 'disabled' : ''} 
                        onclick="answerQuizQuestion('${q.id}', ${optIdx})">
                    <span class="quiz-opt-letter">${letters[optIdx]}</span>
                    <span>${escapeHtml(opt)}</span>
                </button>
            `;
        });

        card.innerHTML = `
            <div class="quiz-card-header">
                <span class="quiz-q-num">CÂU #${qIdx + 1}</span>
                <span class="quiz-company-tag">🏢 ${escapeHtml(q.company)}</span>
            </div>
            <div class="quiz-q-text">${escapeHtml(q.question)}</div>
            <div class="quiz-options-list">
                ${optionsHtml}
            </div>
            <div class="quiz-explanation-box" id="quiz-exp-${q.id}" style="display: ${isAnswered ? 'block' : 'none'};">
                <div class="quiz-exp-title">
                    <span>💡 GIẢI THÍCH CHUYÊN SÂU PHẦN CỨNG:</span>
                </div>
                <div>${q.explanation}</div>
            </div>
        `;

        container.appendChild(card);
    });
}

function answerQuizQuestion(qid, selectedOpt) {
    const q = interviewQuestions.find(item => item.id === qid);
    if (!q) return;

    userQuizAnswers[qid] = selectedOpt;

    const isCorrect = selectedOpt === q.correct;

    if (isCorrect) {
        profile.xp = (profile.xp || 0) + 25;
        localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
        showToast("🎉 CHÍNH XÁC! Bạn nhận được +25 XP Kỹ Sư Nhúng!");
    } else {
        showToast("✕ Chưa chính xác! Hãy đọc kỹ giải thích kiến trúc bên dưới.");
    }

    renderInterviewArena();
    updatePortalStats();
}
