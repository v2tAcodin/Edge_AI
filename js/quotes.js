// ==========================================
// 2. MOTIVATIONAL QUOTES ENGINE
// ==========================================
const motivationalQuotes = [
            {
                text: "Con người không được sinh ra để dành cho thất bại. Một người có thể bị hủy diệt, nhưng không bao giờ bị đánh bại.",
                author: "Ernest Hemingway",
                work: "Ông già và biển cả (The Old Man and the Sea)"
            },
            {
                text: "Không phải tất cả những ai lang thang đều là kẻ lạc lối; cái gốc rễ sâu bền chẳng sợ gió sương mùa đông.",
                author: "J.R.R. Tolkien",
                work: "Chúa tể những chiếc nhẫn (The Fellowship of the Ring)"
            },
            {
                text: "Người ta chỉ nhìn thấy thật rõ ràng bằng trái tim. Những điều cốt lõi nhất thì vô hình trước đôi mắt trần.",
                author: "Antoine de Saint-Exupéry",
                work: "Hoàng tử bé (The Little Prince)"
            },
            {
                text: "Khi bạn thực sự khao khát một điều gì đó mãnh liệt, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.",
                author: "Paulo Coelho",
                work: "Nhà giả kim (The Alchemist)"
            },
            {
                text: "Tương lai có rất nhiều tên: Với kẻ yếu đuối, nó là Điều Không Thể. Với kẻ ngập ngừng, nó là Điều Chưa Biết. Nhưng với người dũng cảm, nó chính là Cơ Hội.",
                author: "Victor Hugo",
                work: "Những người khốn khổ (Les Misérables)"
            },
            {
                text: "Khi cơn bão cuộc đời qua đi, bạn sẽ chẳng nhớ mình đã vượt qua nó như thế nào. Nhưng chắc chắn rằng: con người bước ra khỏi cơn bão đã không còn là con người yếu ớt trước kia.",
                author: "Haruki Murakami",
                work: "Kafka bên bờ biển (Kafka on the Shore)"
            }
        ];

let currentQuoteIndex = 0;

function renderQuote(index) {
    const q = motivationalQuotes[index];
    document.getElementById("motivational-quote-text").innerText = `"${q.text}"`;
    document.getElementById("motivational-quote-author").innerHTML = `
        <span>✍️ ${q.author}</span>
        <span class="quote-work">— ${q.work}</span>
    `;
}

function changeRandomQuote() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * motivationalQuotes.length);
    } while (nextIndex === currentQuoteIndex && motivationalQuotes.length > 1);
    currentQuoteIndex = nextIndex;
    renderQuote(currentQuoteIndex);
    showToast("Đã đổi sang danh ngôn truyền cảm hứng mới!");
}
