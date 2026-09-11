# ADR-0012 · Chạm lên ô đã mở luôn là chord, kể cả khi thanh chế độ đang ở Cờ

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** FR-04 · FR-12 · US-02 · ADR-0004

## 1. Bối cảnh

`tapKind()` trong `touchGesture.ts` đọc thanh chế độ **trước** rồi mới đọc trạng thái ô:
ở chế độ Cờ, mọi cú chạm đều trả `"mark"`. Nhưng `mark` trên một ô **đã mở** là no-op
tuyệt đối trong reducer — cắm cờ lên ô đã mở là chuyện không tồn tại. Kết quả là ở chế độ
Cờ, chạm lên một con số sinh ra một action được commit rồi bị reducer lặng lẽ bỏ đi.

Lượt review persona 12.09.2026 bắt được đúng chỗ này. Người chơi cắm đủ cờ quanh một con
số 2, chạm lên con số để mở nốt, và không có gì xảy ra:

> _"Ơ, nó chết à? Hay tôi đếm nhầm cờ?" Tôi ngồi đếm lại cờ hai lần, chắc chắn mình đúng,
> rồi mới hiểu ra: đang ở chế độ Cờ thì chạm lên số không mở được gì hết._
> — p05-RR-02 bước 6

Anh ta rút ra quy trình bốn nhịp thừa cho mỗi lần (bật Cờ → cắm cờ → bật Mở → chạm số →
bật Cờ lại) rồi **bỏ hẳn thanh chế độ**, quay về giữ ngón. Tức là cái nút to nhất màn hình
đang lấy đi thứ `overview.md` §2 gọi là "một nửa chiều sâu của game", trong im lặng.

Comment ngay trên chính hàm đó đã hứa điều ngược lại — _"the same gesture the mouse uses on
an open cell, so the two input paths agree"_ — nhưng code chỉ giữ lời hứa ở chế độ Mở.

## 2. Quyết định

Đảo thứ tự kiểm tra trong `tapKind()`: nếu ô dưới ngón **đã mở** thì cú chạm là `chord`,
không cần biết thanh chế độ đang ở đâu. Chỉ khi ô **chưa mở** mới đọc chế độ để chọn giữa
`mark` và `reveal`. Nhánh chuột không đụng tới — `onPointerDown` vẫn return ngay với
`pointerType === "mouse"` theo ADR-0004.

## 3. Phương án đã loại

| Phương án                                                      | Vì sao loại                                                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Giữ nguyên, thêm phản hồi "không làm gì được ở đây"            | Trả lời đúng câu hỏi sai. Người chơi không cần biết vì sao chord bị chặn — họ cần chord chạy. Và nó giữ nguyên bốn nhịp thừa          |
| Ẩn thanh chế độ khi ngón đang ở trên vùng đã mở                | Thanh nhảy ra nhảy vào theo vị trí ngón là thứ tệ hơn vấn đề nó chữa                                                                  |
| Cho chế độ Cờ đảo nghĩa: chạm ô đã mở = chord, giữ ngón = mở ô | p05 đã **thử đúng giả định này** ở bước 7 và cắm nhầm cờ vào một ô an toàn. Đảo nghĩa theo ngữ cảnh là thứ không ai đoán được lần đầu |
| Bỏ hẳn thanh chế độ                                            | p01 gọi nó là _"thứ ba bốn trang trước không có và là lý do tôi bỏ chúng"_. Nó có giá trị thật cho người cắm cờ dày                   |

## 4. Hệ quả

**Được:**

- Chord chạy được ở cả hai chế độ, nên `FR-04` không còn bị `FR-12` vô hiệu hoá.
- Mất một nguồn im lặng: nhánh duy nhất từng commit một action chắc chắn bị bỏ đi nay không còn.
- Hai đường vào (chuột và ngón) cuối cùng cũng đồng ý về ý nghĩa của một cú chạm trên ô số, đúng như comment đã hứa từ đầu.

**Mất / phải chấp nhận:**

- Chế độ Cờ không còn "thuần Cờ": ở đó một cú chạm vẫn có thể mở ô ra. Đây là đánh đổi có ý thức — ô đã mở là ô người chơi **đã nhìn thấy nội dung**, nên chord ở đó không phải là rủi ro bất ngờ, khác hẳn với việc mở một ô kín.
- Chord sai vẫn nổ (`US-02`). Chế độ Cờ không làm nó an toàn hơn, và không được hiểu là đang làm vậy.

**Điều kiện xem lại:** nếu có người chơi báo mình chord ngoài ý muốn trong lúc chỉ định cắm cờ hàng loạt — tức là ngón đi lạc lên vùng đã mở đủ thường xuyên để thành vấn đề thật, đo được chứ không phỏng đoán.
