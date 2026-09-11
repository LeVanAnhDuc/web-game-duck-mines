# ADR-0011 · Kẹp giá trị bàn tuỳ chỉnh lúc chốt, không kẹp từng phím gõ

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** FR-16 · US-05 · NFR-A11Y-04 · ADR-0003

## 1. Bối cảnh

`clampCustom` chạy trong `onChange` của ba ô Cột / Hàng / Mìn, tức **mỗi lần gõ một chữ
số**. Comment trong code bảo vệ lựa chọn đó, và `journeys.md` US-05 cũng viết "phải chặn
**ngay lúc nhập**, không phải lúc bấm bắt đầu".

Ý định đúng, hệ quả thì không: sàn của ô Cột là 5, nên gõ `24` đi qua `2` → bị kéo **lên**
`5` → gõ tiếp `4` thành `54` → bị kéo **xuống** `40`. **Mọi số hai chữ số bắt đầu bằng
1, 2, 3, 4 đều không nhập được.** Ô Mìn có sàn 1 nên thoát, và ba ô trông giống hệt nhau
lại hành xử khác nhau.

Lượt review persona 12.09.2026 bắt được, và người dùng tự suy ra đúng cơ chế:

> _"Tôi nhìn lại tay mình. Tôi không gõ nhầm. Tôi gõ số hai, rồi số bốn. Mà nó ra bốn
> mươi."_ … _"hình như nó sửa số ngay trong lúc mình đang gõ… bất kỳ số nào bắt đầu bằng
> 1, 2, 3, 4 là tôi không gõ vào được."_ … _"cùng một bảng, ô Mìn thì gõ được, hai ô Cột
> với Hàng thì không."_
> — p04-RR-05, bước 4–9

Đáng chú ý nhất là con số khác trong cùng phiên đó: **"bấm mà không có phản hồi: 0"**.
Giao diện phản hồi tức thì mọi lúc — _"Vấn đề không phải là nó im, mà là nó trả lời tôi
bằng con số tôi không gõ."_ Kiểu hỏng này tệ hơn im lặng, vì người dùng nghi ngờ chính
mình trước. Cô thử bốn lần rồi bỏ.

## 2. Quyết định

Giá trị đang gõ dở sống trong state cục bộ của chính ô nhập, dưới dạng **chuỗi**, và
**không** được đẩy lên trên. Ô chỉ commit khi giá trị đã nằm trong khoảng hợp lệ; lúc rời
ô (`blur`) thì commit nốt phần còn lại và để `clampCustom` kẹp. `clampCustom` không đổi —
đổi là **ai gọi nó và gọi lúc nào**.

Giới hạn vẫn tới được người dùng trong lúc gõ, chỉ là không bằng cách sửa tay họ: `min` /
`max` vẫn nằm trên input, và hai dòng trợ giúp bên dưới vẫn nói trần mìn và mật độ bằng chữ.

## 3. Phương án đã loại

| Phương án                                            | Vì sao loại                                                                                                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chỉ kẹp trần (max) khi gõ, hoãn sàn (min) tới `blur` | Chữa đúng ca `24` nhưng vẫn đẩy giá trị dưới sàn lên trên. Bàn 2 cột đi tới `maxMines` cho ra 1, và ô đầu loại trừ 3×3 — tức là một cấu hình không sinh được bàn, lọt vào state thật |
| Nút "Áp dụng", commit một lần                        | Phá thứ người dùng **khen**: đổi mức khó là bàn đổi ngay, không phải xác nhận. Thêm một bước cho cả những người không cần                                                            |
| `<input type="text">` + tự lọc ký tự                 | Mất bàn phím số trên điện thoại và mất `min`/`max` mà trình duyệt đọc được cho trợ năng                                                                                              |
| Sửa sàn xuống 1 cho khớp ô Mìn                       | Sàn 5 có lý do thật (ADR-0003: ô đầu chừa trống 3×3). Đổi ràng buộc để né lỗi giao diện là chữa nhầm chỗ                                                                             |

## 4. Hệ quả

**Được:**

- Gõ được mọi giá trị trong khoảng, kể cả số hai chữ số bắt đầu bằng 1–4.
- Ba ô cùng một hàng hành xử cùng một kiểu.
- Ô nhập có `id` và `name` — hết cảnh báo console _"A form field element should have an id or name attribute"_, và `NFR-A11Y-04` ("mọi input có label liên kết") được thi hành thật qua `htmlFor`.

**Mất / phải chấp nhận:**

- Có một khoảnh khắc ô hiện giá trị **chưa** được chấp nhận (lúc đang gõ dở). Đây là đánh đổi có ý thức: thà hiện đúng cái người dùng vừa gõ rồi sửa lúc rời ô, còn hơn hiện một con số không ai gõ.
- `journeys.md` US-05 vẫn viết "chặn ngay lúc nhập". Câu đó được giữ nguyên về tinh thần — trần mìn vẫn hiện ngay lúc nhập, bằng chữ — nhưng không còn đúng nghĩa đen là "sửa từng phím".

**Điều kiện xem lại:** nếu có người chơi commit được một cấu hình mà `clampCustom` đáng lẽ phải chặn — tức là có đường đi nào đó bỏ qua cả `onChange` lẫn `onBlur`.
