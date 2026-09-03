# ADR-0004 · Phân nhánh input theo `pointerType`, không theo user-agent

> **Ngày:** 2026-09-03
> **Trạng thái:** accepted
> **Liên quan:** FR-12 · US-04 · NFR-A11Y-03 · NFR-A11Y-06

## 1. Bối cảnh

Minesweeper cần **hai hành động trên cùng một ô** — mở và cắm cờ — cộng thêm hành động
thứ ba là chord. Chuột có sẵn ba nút cho ba việc. Cảm ứng chỉ có một cú chạm.

Thêm một ràng buộc đã đo: ở viewport 375px, bàn Khó 30 cột chỉ cho mỗi ô ~11px nếu co
cho vừa chiều rộng, và **không độ khó nào** đạt ngưỡng vùng bấm 44px của
`NFR-A11Y-03` — kể cả mức Dễ, vốn chỉ được 38px. Chạm lệch trong Minesweeper không
phải bất tiện, nó làm mất cả bàn.

## 2. Quyết định

Phân nhánh theo **loại sự kiện**, không theo thiết bị: `pointerdown` với
`pointerType === "mouse"` đi đường chuột (trái mở, phải cắm cờ, giữa chord);
`"touch"` và `"pen"` đi đường **chạm hai pha**.

Chạm hai pha: đặt ngón → ô đang nhắm sáng lên và một khung hiện **phía trên ngón** (vì
ngón che ô); trượt ngón → đổi ô nhắm; **nhấc ngón mới là hành động**; nhấc ngoài bàn →
huỷ. Cộng thêm hai đường phụ cho việc cắm cờ: giữ ngón lâu, và thanh chế độ Mở/Cờ ở
đáy màn hình.

Ô bàn cờ do đó được miễn ngưỡng 44px, nhưng **có điều kiện**: cạnh ô ≥ 22px và cơ chế
chạm hai pha còn hoạt động. Điều kiện đó là `NFR-A11Y-06`, không phải một lời hứa
trong ADR này.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Nhận diện thiết bị bằng user-agent hoặc `matchMedia("(pointer: coarse)")` rồi bật một đường duy nhất | Máy 2-in-1 và laptop có màn hình chạm bị nhận sai, và hậu quả là **mất hẳn một đường vào** — người dùng không có cách nào khác. `pointerType` đúng theo từng sự kiện, nên một phiên dùng cả hai đường được. |
| Chỉ thanh chế độ Mở/Cờ, không chạm hai pha | Không giải quyết vấn đề thật: ở chế độ Mở, một cú chạm lệch vẫn mở sai ô và vẫn có thể nổ. Thanh chế độ đổi *hành động*, không đổi *độ chính xác*. |
| Chỉ long-press để cắm cờ, không thanh chế độ | Cắm mười lá cờ liên tiếp thành mười lần chờ. Bản gốc cắm cờ bằng một cú nhấp. |
| Hạ `NFR-A11Y-03` xuống, cho ô nhỏ và chạm trực tiếp | Đây là hạ yêu cầu rồi im lặng. Vùng bấm nhỏ hơn 44px là chấp nhận được **chỉ khi** có cơ chế sửa sai trước khi hành động xảy ra — nên miễn trừ phải kèm điều kiện, và điều kiện phải test được. |
| Ô luôn ≥ 44px, bàn cuộn ở mọi độ khó | Mức Dễ 9×9 lẽ ra vừa màn hình mà cũng phải cuộn. Đổi một vấn đề của mức Khó thành vấn đề của cả ba mức. |
| Chạm đôi để mở, chạm đơn để cắm cờ | Trình duyệt hiểu chạm đôi là zoom, và độ trễ chờ xem có cú chạm thứ hai làm mọi nước đi chậm lại. |

## 4. Hệ quả

**Được:**

- Mọi cú chạm sai sửa được **trước khi** nó thành nước đi. Đây là chỉ số thành công số
  một ở `overview.md` §6.
- Máy có cả chuột và cảm ứng dùng được cả hai đường trong cùng một phiên, không cần
  cài đặt gì.
- Miễn trừ 44px là có điều kiện và **kiểm được bằng e2e**, không phải một ngoại lệ ghi
  cho có.

**Mất / phải chấp nhận:**

- Nhịp chơi bằng ngón chậm hơn bằng chuột, kể cả khi mọi thứ hoạt động đúng. Speedrun
  trên điện thoại sẽ không bao giờ bằng trên desktop.
- Ba đường vào cho một việc (cắm cờ) nghĩa là ba nhánh code và ba nhóm test.
- `pointerdown`/`pointerup` phải phân biệt được **kéo để pan** với **nhắm rồi nhấc**.
  Đây là chỗ khó nhất của feature `touch`, và làm sai thì biểu hiện là "game tự mở ô".
- `touch-action`, `user-select` và double-tap-zoom phải bị chặn trên vùng bàn — chặn
  quá tay thì mất luôn pan, chặn thiếu thì trình duyệt zoom giữa lúc chơi.

**Điều kiện xem lại quyết định này:** người chơi thật báo rằng chạm hai pha làm nhịp
chơi chậm tới mức họ thà chạm trực tiếp · hoặc `pointerType` không còn đáng tin trên
một nền tảng nào đó.
