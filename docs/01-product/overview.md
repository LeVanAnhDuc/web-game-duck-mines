# Tổng quan sản phẩm

> **Trả lời:** Sản phẩm này là gì, cho ai, và **KHÔNG** làm gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-03 · commit —
> **Cập nhật khi:** định vị đổi · thêm/bớt một Non-Goal · trần chi phí đổi

<!-- CÁCH ĐIỀN
File này là nơi DUY NHẤT trả lời "cái này có thuộc phạm vi không". Mọi tranh luận
về scope kết thúc ở đây.

Mục 4 (Non-Goals) là mục quan trọng nhất và là mục dễ bỏ trống nhất. Một Non-Goal
tốt là thứ nghe HỢP LÝ mà vẫn bị từ chối — "không làm chat realtime", "không hỗ trợ
nhiều tổ chức". Nếu danh sách Non-Goals trống, file này chưa làm được việc của nó.

KHÔNG chứa: danh sách tính năng (-> 02-requirements/scope.md), ngưỡng kỹ thuật
(-> 02-requirements/nfr.md), thuật ngữ (-> 01-product/glossary.md).
-->

## 1. Một câu định vị

Duck Mines là bản dò mìn đúng luật gốc Minesweeper, chơi được thật sự bằng ngón tay
trên điện thoại — thứ
mà các bản clone web hoặc bỏ qua (chỉ làm cho chuột), hoặc đổi luật để dễ hơn.

## 2. Vấn đề đang giải

Minesweeper cần **hai hành động khác nhau trên cùng một ô** — mở và cắm cờ — trong khi
cảm ứng chỉ có một cú chạm. Các bản clone giải bằng cách hy sinh: hoặc bỏ chording (mất
một nửa chiều sâu của game), hoặc ép ô nhỏ 11px rồi để người chơi chạm lệch và nổ.

Và chạm lệch ở đây không phải bất tiện — nó là **chết**, mất cả bàn đang chơi. Đây là
vấn đề thật, không phải vấn đề thẩm mỹ.

Vấn đề thứ hai, nhỏ hơn nhưng cùng loại: bảng màu số bản gốc có số 7 **đen** và số 8
**xám**, gần như vô hình trên nền tối. Ai chơi ở chế độ tối đều đang chơi thiếu thông
tin.

## 3. Người dùng mục tiêu

Người đã biết chơi Minesweeper, muốn chơi lại trên máy đang có trong tay — điện thoại
lúc đợi, laptop lúc nghỉ. Không phải người mới học luật: sản phẩm không dạy chơi.

Hai nhóm ngang nhau, không có nhóm phụ: **người chơi bằng ngón** (mở/cờ qua chạm hai
pha và thanh chế độ) và **người chơi bằng chuột** (chuột phải cắm cờ, chuột giữa
chord, bàn phím đầy đủ).

## 4. Non-Goals — dứt khoát không làm

- **Không đảm bảo bàn giải được mà không cần đoán.** Cần solver, và quan trọng hơn:
  phải đoán ở nước cuối *là* Minesweeper kinh điển. Bỏ chỗ đó là làm game khác.
- **Không undo, không gợi ý ô an toàn, không tự mở ô hiển nhiên.** Nổ là hết. Đó là
  toàn bộ sức căng của game.
- **Không bảng xếp hạng online, không đăng nhập, không tài khoản, không server.** Kỷ
  lục nằm trong `localStorage` của máy người chơi, và mất được — xem `NFR-DATA-04`.
- **Bàn tuỳ chỉnh KHÔNG ghi kỷ lục.** *(sửa 04.09.2026 — trước đó là "không có bàn
  tuỳ chỉnh")* Người chơi tự đặt được cột × hàng × mìn, nhưng chỉ ba mức gốc Dễ /
  Trung bình / Khó được xếp hạng. Câu hỏi mà Non-Goal cũ nêu — "kỷ lục của bàn 5×5
  hai mìn so với cái gì?" — do đó không còn tồn tại, thay vì được trả lời qua loa.
  UI phải nói điều này **trước khi** người chơi bấm nước đầu, không phải sau khi thắng.
- **Không pause.** Bản gốc không có, và game theo lượt nên pause chỉ để dừng đồng hồ —
  tức là để gian lận kỷ lục.
- **Không lưu bàn đang chơi khi đóng tab.** Đóng tab là bỏ bàn. Nằm ở backlog nếu hoá
  ra tab bị hệ điều hành kill quá thường xuyên trên mobile.
- **Đúng MỘT âm thanh: tiếng mìn nổ, và mặc định TẮT.** *(sửa 04.09.2026 — trước đó
  là "không âm thanh")* Sinh lúc chạy bằng WebAudio, **không ship file audio nào**.
  Lý do cũ ("mở tiếng nơi công cộng là thứ người ta tắt ngay") được giữ nguyên hiệu
  lực bằng chính mặc định tắt, chứ không bị bác bỏ. Không có âm cho mở ô, cắm cờ hay
  thắng — thứ kêu mỗi nước đi là thứ bị tắt sau mười phút.
- **Không dạy luật, không tutorial, không màn hình onboarding.** Vào là chơi.
- **Không daily puzzle, không chia sẻ kết quả, không thành tích.** Đây là một trò
  suy luận, không phải một vòng lặp giữ chân.

## 5. Mô hình

| Câu hỏi | Trả lời |
| --- | --- |
| Ai trả tiền | Không ai — dự án học tập, không có người dùng trả phí |
| Trả bằng gì | — |
| **Trần chi phí hạ tầng / tháng** | **0₫.** Xuất tĩnh, host GitHub Pages. Ràng buộc này là lý do không có server, không database, không analytics — và nó không phải thứ để thương lượng lại về sau |

## 6. Thế nào là thành công

Ba chỉ số, đều đo được, không có chỉ số nào là "người chơi thích":

1. **Thắng được một bàn Khó bằng ngón trên điện thoại thật, không lần nào chạm lệch
   ra ô ngoài ý muốn.** Đây là lý do dự án tồn tại; nếu chỉ số này không đạt thì phần
   còn lại không quan trọng.
2. **Tám chữ số phân biệt được khi chụp màn hình ở chế độ grayscale** — tức là màu
   thật sự chỉ là kênh phụ (`NFR-A11Y-07`).
3. **First-load JS < 200KB gzip** (`NFR-PERF-07`), và game chơi được offline sau lần
   tải đầu (`NFR-REL-04`).
