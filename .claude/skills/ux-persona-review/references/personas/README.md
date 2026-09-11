# Dàn persona — Duck Mines

Sinh 2026-09-12 theo `../persona-rules.md`. **Sáu người, cố định giữa các lần chạy.**
Sửa dàn này là mất khả năng so sánh trước/sau khi sửa sản phẩm — thứ đắt nhất mà skill này
tạo ra. Đổi thì đổi có chủ đích và ghi lý do vào đây.

## Dàn

| id | Tên | Loại | Đường vào | Thiết bị · viewport · mạng | Kiên nhẫn |
| --- | --- | --- | --- | --- | --- |
| p01 | Hằng, điều dưỡng ca đêm | **primary** | ngón tay | Android · 375×720 · 4G yếu | 3 |
| p02 | Tuấn, đo mình bằng đồng hồ | **primary** | chuột 3 nút + bàn phím | laptop · 1440×900 · nhanh | 5 |
| p03 | Vinh, chỉ dùng bàn phím | secondary | **bàn phím, không chuột** | desktop · 1440×900 · zoom 125% | 4 |
| p04 | Lan, làm bàn dễ cho con | secondary | trackpad, **không nút giữa** | laptop cũ · 1366×768 | 4 |
| p05 | Đức, máy 2-trong-1, không đoán | secondary | **chuột VÀ chạm, đổi liên tục** | Surface · 1280×800 | 6 |
| p06 | Bích, chưa từng chơi dò mìn | **negative** | ngón tay | iPhone cũ · 390×844 | 2 |

Ba ràng buộc bắt buộc — đã thoả: a11y **p03** · đúng một negative **p06** · điện thoại
mạng chậm **p01**. Hai ràng buộc riêng của sản phẩm — đã thoả: **hai** primary (ngón và
chuột ngang nhau, `overview.md` §3) · một máy vừa chuột vừa chạm (**p05**, `journeys.md`
US-04 + [ADR-0004](../../../../../docs/decisions/0004-input-branches-on-pointertype.md)).

Không có persona loại `served`: không server, không tài khoản, không ai khác nhìn thấy kết
quả của bạn. Không bịa ra một người cho đủ bộ.

## Bảng phân phiên — 6 Red Route `live` + 2 phiên mù = **8 phiên**

| Mã phiên | Persona | Vì sao người này |
| --- | --- | --- |
| `p02-RR-01` | Tuấn | RR-01 là lần đầu vào cuộc bằng chuột; Tuấn thử nút giữa theo phản xạ trước khi đọc bất cứ thứ gì |
| `p05-RR-02` | Đức | Cắm cờ + mở nhanh quanh số là lối chơi ruột của Đức, không ai khác dùng nó tự nhiên như vậy |
| `p02-RR-03` | Tuấn | Chỉ Tuấn thật sự **cần** kỷ lục; với người khác nó là thông tin trang trí |
| `p01-RR-04` | Hằng | Người duy nhất mang sẵn nỗi sợ giữ-ngón-hụt của cả thể loại, nên là người duy nhất kiểm chứng được lời hứa của chạm hai pha |
| `p04-RR-05` | Lan | Có lý do thật để cần bàn tuỳ chỉnh, và có lý do thật để quan tâm "ván này có tính không" |
| `p03-RR-06` | Vinh | Không dùng được chuột — với Vinh bàn phím không phải phương án dự phòng, nó là đường duy nhất |
| `p06-blind` | Bích | Phiên mù "trình độ số thấp, điện thoại" |
| `p05-blind` | Đức | Phiên mù "power user, desktop" |

Hai persona chạy hai phiên (p02, p05). Mỗi phiên vẫn là **một agent mới, context sạch,
cookie sạch** — nên năm giây đầu của phiên sau không bị phiên trước làm hỏng.

## Ba chỗ `ux-expert` dễ chấm sai ở dàn này

1. **Bích không hiểu trò chơi là kết quả ĐÚNG.** "Không dạy luật, không tutorial, không
   onboarding" là Non-Goal (`overview.md` §4). Đề xuất thêm hướng dẫn là đề xuất phá
   Non-Goal. Xem khối cảnh báo đầu file `p06-*.md`.
2. **Đức bực vì phải đoán là va chạm kỳ vọng, không phải lỗi.** "Phải đoán ở nước cuối *là*
   Minesweeper kinh điển" — Non-Goal đầu tiên. Ghi nhận rồi dừng; nó chỉ là bằng chứng cho
   một câu hỏi khác: UI có nói rõ mình theo luật gốc không?
3. **Lan không với tới chuột giữa là đặc điểm thiết bị, không phải lỗi khám phá.** Câu hỏi
   đúng là: ngoài nút giữa, còn đường nào khác tới cùng thao tác đó không, và Lan có thấy
   đường đó không?
