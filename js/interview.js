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
    },
    {
        id: "q9",
        category: "c_traps",
        company: "Bosch Automotive / FPT",
        question: "Trong cấu trúc struct sau trên vi điều khiển 32-bit: `struct SensorData { char id; int value; short status; };`, toán tử `sizeof(struct SensorData)` sẽ trả về bao nhiêu bytes?",
        options: [
            "7 bytes (1 byte char + 4 bytes int + 2 bytes short).",
            "8 bytes (trình biên dịch tự động nén dữ liệu).",
            "12 bytes (do cơ chế căn lề Struct Padding 4-byte của vi xử lý 32-bit).",
            "16 bytes."
        ],
        correct: 2,
        explanation: "Trên vi xử lý 32-bit, CPU nạp dữ liệu hiệu quả nhất theo các khối 4 bytes (Word-aligned). Sau `char id` (1 byte), trình biên dịch tự động chèn 3 bytes Padding để biến `int value` (4 bytes) nằm ở địa chỉ chia hết cho 4. Sau `short status` (2 bytes), thêm 2 bytes Padding ở cuối để kích thước toàn bộ struct chia hết cho 4. Tổng cộng = 1 + 3 + 4 + 2 + 2 = 12 bytes!"
    },
    {
        id: "q10",
        category: "c_traps",
        company: "Renesas / Qualcomm",
        question: "Phát biểu nào sau đây phân biệt chính xác nhất giữa `const int *ptr` và `int * const ptr`?",
        options: [
            "Cả hai hoàn toàn giống nhau, chỉ khác phong cách viết.",
            "`const int *ptr` là con trỏ trỏ tới dữ liệu hằng số (giá trị *ptr không thể sửa, nhưng địa chỉ ptr có thể đổi); còn `int * const ptr` là con trỏ hằng (địa chỉ ptr cố định, nhưng giá trị *ptr có thể sửa).",
            "`int * const ptr` được lưu trong bộ nhớ Flash, còn `const int *ptr` lưu trong RAM.",
            "`const int *ptr` không thể gán bằng NULL, còn `int * const ptr` thì có."
        ],
        correct: 1,
        explanation: "Quy tắc 'Đọc từ phải sang trái': `const int *ptr` -> ptr là con trỏ tới số nguyên const (dữ liệu bất biến). `int * const ptr` -> ptr là const pointer tới số nguyên (con trỏ bất biến). Đây là câu hỏi kinh điển kiểm tra kiến thức con trỏ trong mọi bài thi tuyển kỹ sư firmware."
    },
    {
        id: "q11",
        category: "freertos",
        company: "Viettel Aerospace / Bosch",
        question: "Khi một tác vụ FreeRTOS kết thúc công việc và tự hủy bằng lệnh `vTaskDelete(NULL)`, điều gì xảy ra nếu trước đó tác vụ này đã gọi `malloc()` cấp phát bộ nhớ?",
        options: [
            "FreeRTOS sẽ tự động quét và giải phóng toàn bộ RAM mà tác vụ đó từng malloc.",
            "Bộ nhớ malloc KHÔNG được giải phóng tự động, dẫn đến rò rỉ bộ nhớ (Memory Leak) vĩnh viễn trong Heap của hệ thống.",
            "Hệ thống sẽ phát sinh lỗi Guru Meditation Crash ngay lập tức.",
            "Tác vụ Idle Task sẽ tự động dọn dẹp biến Heap này khi rảnh rỗi."
        ],
        correct: 1,
        explanation: "Hệ điều hành FreeRTOS chỉ giải phóng bộ nhớ TCB (Task Control Block) và Stack của tác vụ thông qua Idle Task. FreeRTOS hoàn toàn KHÔNG quản lý các khối nhớ động do người dùng tự `malloc()`. Nếu không gọi `free()` trước khi delete task, lượng RAM đó sẽ bị 'mất tích' vĩnh viễn (Memory Leak)."
    },
    {
        id: "q12",
        category: "mcu_arch",
        company: "STMicroelectronics / NXP",
        question: "Để XÓA bit thứ 5 của thanh ghi điều khiển ngoại vi `REG_CTRL` mà KHÔNG làm ảnh hưởng đến các bit khác, thao tác bitwise nào là chuẩn xác?",
        options: [
            "`REG_CTRL |= (1U << 5);`",
            "`REG_CTRL ^= (1U << 5);`",
            "`REG_CTRL &= ~(1U << 5);`",
            "`REG_CTRL = ~(1U << 5);`"
        ],
        correct: 2,
        explanation: "`(1U << 5)` tạo ra mặt nạ với bit 5 = 1, các bit khác = 0. Đảo bit `~(1U << 5)` tạo ra mặt nạ bit 5 = 0 và tất cả các bit khác = 1. Khi thực hiện phép AND `&=`, bit 5 sẽ bị ép về 0 trong khi các bit khác giữ nguyên giá trị ban đầu."
    },
    {
        id: "q13",
        category: "c_memory",
        company: "Bosch Automotive / Renesas",
        question: "Tại sao việc gọi các hàm như `printf()` hoặc `malloc()` bên trong trình xử lý ngắt phần cứng (ISR) bị coi là điều tối kỵ trong kỹ thuật nhúng?",
        options: [
            "Vì hàm printf làm tăng dung lượng mã nhị phân Flash.",
            "Vì các hàm này không có tính chất Reentrant (Tái nhập), thường dùng cơ chế khóa Mutex nội bộ có thể gây Deadlock và thời gian thực thi quá lâu làm tê liệt hệ thống thời gian thực.",
            "Vì printf chỉ in được ra cổng USB của máy tính chứ không in được qua UART.",
            "Vì ngắt phần cứng không có quyền truy cập vào bảng mã ASCII."
        ],
        correct: 1,
        explanation: "`malloc()` và `printf()` sử dụng biến toàn cục và khóa lock nội bộ để an toàn luồng (thread-safety). Nếu ngắt ISR xảy ra đúng lúc main thread đang giữ lock đó và gọi lại printf, hệ thống sẽ rơi vào tình trạng Khóa chết (Deadlock) vĩnh viễn. Ngoài ra thời gian chạy của printf lên đến hàng mili-giây, vi phạm nguyên tắc ISR phải chạy < 10 micro-giây."
    },
    {
        id: "q14",
        category: "c_traps",
        company: "Ampere Computing / FPT",
        question: "Khai báo sau đây có ý nghĩa gì trong C: `typedef void (*uart_rx_cb_t)(uint8_t byte, void* context);`?",
        options: [
            "Khai báo một hàm tên là uart_rx_cb_t nhận 2 tham số.",
            "Định nghĩa một kiểu dữ liệu con trỏ hàm (Function Pointer), trỏ tới hàm nhận một số nguyên 8-bit và con trỏ void, trả về void; thường dùng làm Callback xử lý sự kiện ngắt ngoại vi.",
            "Khai báo một mảng chứa các byte nhận được từ cổng UART.",
            "Khai báo một cấu trúc struct dùng để đóng gói gói tin UART."
        ],
        correct: 1,
        explanation: "Đây là cú pháp định nghĩa kiểu con trỏ hàm (Function Pointer Callback) tiêu chuẩn công nghiệp. Nó cho phép tầng Driver phần cứng gọi ngược lại một hàm xử lý ở tầng ứng dụng mà không cần biết chi tiết triển khai của tầng ứng dụng (Loose Coupling / Dependency Inversion trong C)."
    },
    {
        id: "q15",
        category: "automotive_can",
        company: "VinFast / Continental",
        question: "Trong mạng truyền thông CAN Bus của ô tô, nếu hai bộ điều khiển ECU cùng gửi gói tin đồng thời, node gửi gói tin có CAN ID nào sẽ THẮNG quyền phân xử (Arbitration) và tiếp tục truyền dữ liệu?",
        options: [
            "Node có CAN ID lớn hơn sẽ thắng.",
            "Node có CAN ID nhỏ hơn sẽ thắng (vì bit 0 là bit lấn át - Dominant bit).",
            "Cả hai gói tin đều bị hủy và hai node phải chờ một khoảng thời gian ngẫu nhiên (như Ethernet).",
            "Node nào kết nối gần điện trở đầu cuối 120 Ohm hơn sẽ thắng."
        ],
        correct: 1,
        explanation: "Mạng CAN Bus sử dụng logic AND có dây (Wired-AND). Mức điện áp '0' là mức Lấn át (Dominant), mức '1' là mức Lùi (Recessive). Khi 2 node cùng phát ID bit-by-bit: node nào có bit 0 sẽ đè bẹp bit 1 của node kia. Do đó CAN ID có giá trị số nhỏ hơn sẽ có nhiều bit 0 ưu tiên hơn và thắng quyền truyền mà không làm gián đoạn đường truyền."
    },
    {
        id: "q16",
        category: "automotive_can",
        company: "Bosch / VinFast",
        question: "Quy tắc MISRA C:2012 nghiêm cấm việc sử dụng cấp phát động (malloc / free) trong runtime của phần mềm ô tô và hàng không vì lý do cốt lõi nào?",
        options: [
            "Vì hàm malloc chạy chậm hơn 100 lần so với việc đọc biến toàn cục.",
            "Vì cấp phát động có tính bất định về thời gian (Non-deterministic timing) và nguy cơ phân mảnh Heap dẫn đến lỗi Out Of Memory (OOM) sau thời gian dài vận hành.",
            "Vì các vi điều khiển ô tô không có thanh ghi hỗ trợ con trỏ Heap.",
            "Vì chuẩn MISRA chỉ cho phép sử dụng ngôn ngữ C++."
        ],
        correct: 1,
        explanation: "Trong hệ thống an toàn sinh mạng (Safety-critical systems như phanh ABS hay túi khí), phần mềm phải đảm bảo tính xác thực thời gian thời gian thực (Deterministic execution). Thời gian `malloc()` tìm khối trống trong Heap không thể dự đoán trước được, và hiện tượng phân mảnh có thể khiến hệ thống sập bất thình lình khi xe đang chạy trên cao tốc."
    },
    {
        id: "q17",
        category: "c_traps",
        company: "Qualcomm / Intel",
        question: "Xét định nghĩa Macro sau: `#define SQUARE(x) x * x`. Giá trị của biểu thức `int result = SQUARE(2 + 3);` bằng bao nhiêu?",
        options: [
            "25 (vì (2 + 3) * (2 + 3) = 25).",
            "11 (vì tiền xử lý thay thế thành: 2 + 3 * 2 + 3 = 2 + 6 + 3 = 11).",
            "Lỗi cú pháp không thể biên dịch.",
            "10."
        ],
        correct: 1,
        explanation: "Bộ tiền xử lý Preprocessor của C chỉ thực hiện phép thay thế văn bản thuần túy (Text substitution) chứ không tính toán biểu thức. `SQUARE(2 + 3)` được thay thế trực tiếp thành `2 + 3 * 2 + 3`. Do phép nhân có độ ưu tiên cao hơn phép cộng, kết quả là `2 + 6 + 3 = 11`! Quy tắc: Luôn bọc ngoặc đơn quanh tham số và toàn bộ macro: `#define SQUARE(x) ((x) * (x))`."
    },
    {
        id: "q18",
        category: "debug_testing",
        company: "Texas Instruments / Espressif",
        question: "Khi sử dụng máy phân tích logic (Logic Analyzer) để kiểm tra giao tiếp I2C giữa ESP32 và cảm biến nhiệt độ, bạn quan sát thấy đường SDA ở mức CAO (High) tại sườn lên thứ 9 của xung SCL. Hiện tượng này thể hiện điều gì?",
        options: [
            "Cảm biến đã nhận dữ liệu thành công (ACK).",
            "Cảm biến phát tín hiệu NACK (Không phản hồi), có thể do sai địa chỉ I2C, cảm biến mất nguồn hoặc chưa sẵn sàng.",
            "Bus I2C bị chập nguồn VCC.",
            "Đây là tín hiệu phát xung STOP kết thúc khung truyền."
        ],
        correct: 1,
        explanation: "Trong chuẩn I2C, sau 8 xung clock truyền 1 byte dữ liệu, thiết bị nhận bắt buộc phải kéo đường SDA xuống mức THẤP (Low) tại chu kỳ xung thứ 9 để báo nhận thành công (ACK - Acknowledge). Nếu đường SDA vẫn ở mức CAO (High), đó là tín hiệu NACK (Not Acknowledge), báo hiệu cảm biến không phản hồi."
    },
    {
        id: "q19",
        category: "tinyml",
        company: "Google / Arm",
        question: "Sự khác biệt bản chất giữa kỹ thuật Post-Training Quantization (PTQ) và Quantization-Aware Training (QAT) trong tối ưu hóa mô hình TinyML là gì?",
        options: [
            "PTQ lượng tử hóa sau khi mô hình đã huấn luyện xong (nhanh, dễ làm nhưng có thể giảm nhẹ độ chính xác); còn QAT mô phỏng hiệu ứng làm tròn số nguyên ngay trong quá trình huấn luyện giúp mô hình bù trừ sai số và giữ độ chính xác tối đa.",
            "PTQ dùng cho mô hình âm thanh, còn QAT dùng cho mô hình hình ảnh.",
            "PTQ chuyển model sang INT4, còn QAT chuyển model sang INT8.",
            "PTQ chỉ chạy được trên phần cứng máy chủ đám mây."
        ],
        correct: 0,
        explanation: "PTQ là phương pháp nhanh nhất: nạp mô hình Float32 đã huấn luyện xong, dùng tập mẫu (Representative Dataset) để tính scale/zero-point chuyển sang INT8. Tuy nhiên với mô hình nhạy cảm, PTQ có thể làm giảm 2-5% độ chính xác. QAT (Quantization-Aware Training) chèn các node giả lập lượng tử hóa (Fake Quantization) ngay trong vòng lặp lan truyền ngược Backpropagation khi train, giúp trọng số thích nghi với việc làm tròn số nguyên."
    },
    {
        id: "q20",
        category: "mcu_arch",
        company: "Ampere / Renesas",
        question: "Trong dự án C nhúng, file kịch bản liên kết (Linker Script có đuôi mở rộng `.ld`) đóng vai trò gì?",
        options: [
            "Chứa mã nguồn khởi tạo thư viện C chuẩn.",
            "Quy định sơ đồ ánh xạ bộ nhớ (Memory Map): chỉ định kích thước, địa chỉ bắt đầu của Flash/RAM và phân bổ các phân vùng (.text, .rodata, .data, .bss, Stack, Heap) vào đúng vùng nhớ vật lý.",
            "Tự động dịch mã nguồn C sang Assembly.",
            "Nạp firmware trực tiếp vào chip thông qua giao thức UART."
        ],
        correct: 1,
        explanation: "Trình biên dịch Compiler biên dịch từng file .c thành file đối tượng .o. Trình liên kết Linker sử dụng file `.ld` như một bản vẽ kiến trúc: gom toàn bộ mã thực thi (`.text`) và hằng số (`.rodata`) đặt vào Flash; gom các biến toàn cục có giá trị khởi tạo (`.data`) và chưa khởi tạo (`.bss`) phân bổ vào vùng nhớ RAM tương ứng."
    },
    {
        id: "q21",
        category: "freertos",
        company: "Viettel / Bosch",
        question: "Cơ chế Task Watchdog Timer (TWDT) trong hệ điều hành FreeRTOS bảo vệ hệ thống khỏi sự cố nào sau đây?",
        options: [
            "Bảo vệ vi điều khiển khỏi sét đánh và quá áp nguồn.",
            "Phát hiện và tự khởi động lại CPU khi một tác vụ bị treo cứng (vòng lặp vô hạn, khóa chết Deadlock) và không chịu nhả quyền CPU trong khoảng thời gian quy định.",
            "Tự động giải phóng bộ nhớ Stack khi bị tràn.",
            "Ngăn chặn tin tặc tấn công từ chối dịch vụ DoS qua cổng Wi-Fi."
        ],
        correct: 1,
        explanation: "Task Watchdog Timer (TWDT) yêu cầu các tác vụ quan trọng phải định kỳ 'cho chó ăn' (gọi hàm `esp_task_wdt_reset()`). Nếu một tác vụ bị rơi vào vòng lặp vô hạn hoặc bị Deadlock và không gọi hàm reset trước khi bộ đếm Watchdog đếm về 0, phần cứng sẽ kích hoạt ngắt khẩn cấp hoặc Reset toàn bộ chip để khôi phục trạng thái hoạt động."
    },
    {
        id: "q22",
        category: "c_memory",
        company: "Espressif / Nordic Semiconductor",
        question: "Trên dòng vi điều khiển ESP32, khi đưa chip vào chế độ ngủ sâu (Deep Sleep) để tiết kiệm pin, vùng nhớ nào sau đây vẫn DUY TRÌ được dữ liệu nguyên vẹn?",
        options: [
            "Internal SRAM0 và SRAM1 (512 KB).",
            "RTC Fast Memory và RTC Slow Memory (khoảng 16 KB) được cấp nguồn bởi nguồn nuôi RTC riêng biệt.",
            "Bộ nhớ ngoài External PSRAM.",
            "Các thanh ghi đa năng của CPU Core 0 và Core 1."
        ],
        correct: 1,
        explanation: "Khi vào Deep Sleep, toàn bộ nguồn của CPU Core 0/1, bộ nhớ SRAM chính, Flash và PSRAM đều bị cắt điện hoàn toàn để đạt dòng tiêu thụ < 10uA. Chỉ có phân vùng RTC Controller và RTC Memory (16 KB) là tiếp tục nhận nguồn từ rail RTC. Khai báo biến với tiền tố `RTC_DATA_ATTR` sẽ giúp biến giữ nguyên giá trị qua các lần ngủ sâu."
    },
    {
        id: "q23",
        category: "debug_testing",
        company: "Bosch / FPT Software",
        question: "Trong quy trình kiểm thử tự động (Unit Test) cho firmware nhúng, khái niệm 'Hardware Mocking' (ví dụ dùng thư viện CMock) mang lại lợi ích gì?",
        options: [
            "Cho phép nạp code vào vi điều khiển với tốc độ nhanh gấp 10 lần.",
            "Giả lập hành vi của các hàm đọc/ghi phần cứng (HAL) để chạy kiểm thử logic thuật toán trực tiếp trên máy tính CI/CD mà không cần phải kết nối bo mạch thật.",
            "Tự động sửa lỗi phần cứng trên sơ đồ mạch in PCB.",
            "Tạo ra các linh kiện điện tử ảo trên màn hình 3D."
        ],
        correct: 1,
        explanation: "Trong môi trường công nghiệp, hàng nghìn bài Unit Test được chạy tự động trên server máy chủ (CI/CD) mỗi lần Push code. Do server đám mây không có bo mạch thật kết nối, ta dùng kỹ thuật Mocking để tạo ra các hàm giả lập: ví dụ hàm `i2c_read()` giả lập trả về mảng dữ liệu mô phỏng, giúp kiểm thử xem thuật toán lọc số và phân loại AI có phát hiện đúng sự cố hay không."
    },
    {
        id: "q24",
        category: "tinyml",
        company: "Espressif Edge AI Team / Google",
        question: "Tại sao trong thư viện TensorFlow Lite for Microcontrollers trên ESP32-S3, mảng bộ nhớ Tensor Arena BẮT BUỘC phải được khai báo căn lề 16-byte (`alignas(16) static uint8_t tensor_arena[...]`)?",
        options: [
            "Vì giao thức Wi-Fi yêu cầu các gói tin phải có độ dài là bội số của 16.",
            "Vì tập lệnh mở rộng Vector SIMD 128-bit của kiến trúc ESP32-S3 yêu cầu nạp đồng thời 16 giá trị INT8 trong một chu kỳ máy; nếu địa chỉ không chia hết cho 16, CPU sẽ phát sinh ngoại lệ phần cứng LoadStoreAlignment Error gây sập nguồn.",
            "Vì Flash SPI chỉ cho phép đọc theo từng khối 16 bytes.",
            "Vì hệ điều hành FreeRTOS chỉ cấp phát bộ nhớ cho các biến căn lề 16 bytes."
        ],
        correct: 1,
        explanation: "Tập lệnh mở rộng xử lý tín hiệu và AI của ESP32-S3 (Xtensa PIE Vector Instructions) sử dụng các thanh ghi vector rộng 128-bit (16 bytes). Lệnh nạp vector yêu cầu địa chỉ vật lý phải căn chỉnh đúng đường ranh giới 16 bytes. Nếu mảng bắt đầu tại một địa chỉ lẻ, CPU không thể thực hiện phép nạp trực tiếp và sẽ phát sinh lỗi Guru Meditation Panic (LoadStoreAlignment Error) ngay lập tức."
    }
];

const STORAGE_QUIZ_ANSWERS = "mr_thai_quiz_answers_v2";

let userQuizAnswers = JSON.parse(localStorage.getItem(STORAGE_QUIZ_ANSWERS)) || {};
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
    const quizBadge = document.getElementById("quiz-score-badge");
    if (quizBadge) quizBadge.innerText = `${answeredCorrectCount}/${interviewQuestions.length}`;

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
    localStorage.setItem(STORAGE_QUIZ_ANSWERS, JSON.stringify(userQuizAnswers));

    const isCorrect = selectedOpt === q.correct;

    if (isCorrect) {
        profile.xp = (profile.xp || 0) + 25;
        localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
        if (typeof logStudyActivity === 'function') {
            logStudyActivity('interview', 1, `Phỏng vấn: Câu #${q.id.replace('q', '')}`);
        }
        showToast("🎉 CHÍNH XÁC! Bạn nhận được +25 XP Kỹ Sư Nhúng!");
    } else {
        showToast("✕ Chưa chính xác! Hãy đọc kỹ giải thích kiến trúc bên dưới.");
    }

    renderInterviewArena();
    updatePortalStats();
}
