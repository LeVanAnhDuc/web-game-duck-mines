# ADR-0009 · Màn nhỏ hơn bàn thì kéo và chụm, không co bàn cho vừa

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-13 · FR-16 · FR-17 · US-04 · US-05 · NFR-A11Y-06

## 1. Bối cảnh

Bàn Khó 30 cột ở viewport 375px: nếu ép vừa chiều rộng thì mỗi ô còn **11px**, chữ số
còn khoảng 6px. `MASTER.md` §3 đặt sàn **22px**, và `NFR-A11Y-06` chỉ miễn cho ô bàn cờ
khỏi ngưỡng chạm 44px **với điều kiện** cạnh ô ≥ 22px và cơ chế chạm hai pha còn hoạt
động.

Nghĩa là "co cho vừa" không chỉ khó đọc — nó **phá cơ sở pháp lý của miễn trừ a11y** mà
`ADR-0004` dựa vào.

FR-16 làm vấn đề rộng ra: bàn tuỳ chỉnh cho tới 40 cột, nên đây không còn là chuyện
riêng của một preset.

## 2. Quyết định

**Bàn luôn vẽ ở cạnh ô ≥ 22px.** Nếu không vừa màn hình thì khung bọc cuộn được và kéo
được, **không phải cả trang cuộn**. Zoom mặc định là vừa-chiều-rộng **đã kẹp ở 22px**.

Chụm hai ngón để thu nhỏ; khi cạnh ô rơi xuống dưới `--cell-min-numeral` (16px) thì
**chữ số tắt và bàn thành bản đồ nhiệt** — dùng để định vị, không để chơi. Chụm vào để
chơi tiếp.

Cộng thêm, gần như miễn phí: khi bàn **không vừa dọc mà vừa nếu xoay ngang**, hiện một
gợi ý một dòng, bỏ qua được, không phải modal. Bàn Khó ở màn ngang 812px cho 27px/ô —
vừa khít, không cần kéo lần nào.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Ép vừa chiều rộng, chấp nhận ô 11px | Chữ số không đọc được, và phá điều kiện của `NFR-A11Y-06`. Không phải đánh đổi — là hỏng |
| Kính lúp theo ngón: bàn thu nhỏ, ngón đặt xuống thì phóng to vùng quanh ngón | Thấy toàn bàn **và** đọc được ô đang nhắm — hấp dẫn, nhưng **chồng lên** chạm hai pha của `ADR-0004`: hai cơ chế cùng vẽ một khung nổi cạnh ngón. Để dành; nếu làm thì phải giải quyết xung đột đó trước |
| Giới hạn cỡ bàn theo màn hình | Bàn Khó là preset cố định — cấm nó trên điện thoại là mất một mức chơi. Và cấu hình tuỳ chỉnh lưu ở máy này sẽ không mở được ở máy khác |
| Cuộn cả trang thay vì cuộn khung bàn | HUD và nút bàn mới trôi khỏi màn hình đúng lúc cần nhất. Bộ đếm mìn phải luôn nhìn thấy được |
| Chỉ gợi ý xoay ngang, không pan/zoom | Cứu được bàn Khó trên điện thoại phổ thông, không cứu được bàn tuỳ chỉnh 40 cột, và vô nghĩa trên máy tính bảng đã ở ngang |

## 4. Hệ quả

**Được:**

- Chữ số **luôn** đọc được ở chế độ chơi, bất kể cỡ bàn hay cỡ màn.
- `NFR-A11Y-06` giữ nguyên điều kiện của nó, nên miễn trừ 44px vẫn có hiệu lực.
- Chịu được bàn tuỳ chỉnh cỡ bất kỳ mà không cần thêm cơ chế nào — đó là lý do `touch`
  phải làm **trước** `custom-board`.
- Bản đồ nhiệt ở mức zoom xa khiến dải màu của `ADR-0001` có công dụng thứ hai.

**Mất / phải chấp nhận:**

- Chơi bàn Khó trên điện thoại dọc là **hai tay**, và phải kéo. Không có cách nào tránh
  được điều đó mà vẫn giữ chữ số đọc được.
- Kéo xong dễ mất dấu con số vừa đọc. Đây là chi phí nhận thức thật, không phải chi
  tiết kỹ thuật.
- "Chế độ nhìn tổng" là trạng thái thứ hai người chơi phải học, và không có gì trên màn
  hình dạy nó ngoài việc tự chụm ra.
- `touch-action` và ngăn double-tap-zoom phải chỉnh rất cẩn thận: chặn quá tay thì mất
  luôn pan, chặn thiếu thì trình duyệt tự zoom giữa lúc chơi.

**Điều kiện xem lại quyết định này:** người chơi thật báo rằng kéo làm nhịp chơi khó
chịu tới mức họ bỏ bàn Khó trên điện thoại — lúc đó kính lúp quay lại bàn cân, kèm bài
toán xung đột với chạm hai pha.
