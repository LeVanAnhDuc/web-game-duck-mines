# Thuật ngữ

> **Trả lời:** Khái niệm này gọi là gì trong code, và hiện ra sao trên UI?
> **Trạng thái:** 🟡 một phần — chỉ những tên đã bị chốt ở doc khác
> **Cập nhật:** 2026-09-03 · commit —
> **Cập nhật khi:** xuất hiện một khái niệm nghiệp vụ mới trong code hoặc UI

<!-- CÁCH ĐIỀN
File này KHOÁ TÊN GỌI. Mục đích: mọi phiên làm việc đặt tên biến / bảng / route
giống nhau, thay vì mỗi lần tự nghĩ ra một tên mới cho cùng một khái niệm.

Chỉ thêm dòng khi khái niệm ĐÃ xuất hiện trong code hoặc UI. Bảng đầy khái niệm
tưởng tượng thì vô dụng.

Đổi trạng thái sang 🟡 ngay khi có dòng thật đầu tiên.
KHÔNG chứa: giải thích nghiệp vụ dài (-> overview.md).
-->

Chưa có code. Bảng dưới **không** phải khái niệm tưởng tượng — mỗi dòng là một tên đã
bị chốt ở [`architecture.md`](../03-design/architecture.md) §3-4, ở
[`MASTER.md`](../design-system/minesweeper/MASTER.md), hoặc trong wireframe đã duyệt.
Thêm dòng khi code sinh ra khái niệm mới.

| Thuật ngữ | Định nghĩa một câu | Tên trong code | Tên trên UI (VI) | Tên trên UI (EN) |
| --- | --- | --- | --- | --- |
| Ô | Một vị trí trên bàn, có thể chứa mìn | `Cell` | ô | cell |
| Bàn | Lưới ô của một lượt chơi | `Board` | bàn | board |
| Chưa mở | Ô còn úp — vẽ thành viên gạch **có viền** | `hidden` | — | — |
| Đã mở | Ô đã lật — vẽ **phẳng, không viền** | `revealed` | — | — |
| Cắm cờ | Đánh dấu ô là mìn | `flagged` | cờ | flag |
| Dấu hỏi | Đánh dấu ô là "chưa chắc", tắt mặc định | `unsure` | dấu hỏi | maybe |
| Mở ô | Lật một ô lên | `reveal` | mở | reveal |
| Lan vùng trống | Mở lan ra khi ô vừa mở có 0 mìn kề | `flood fill` | — | — |
| Chord | Mở mọi ô kề khi số cờ kề khớp con số trên ô | `chord` | mở quanh | chord |
| Số mìn kề | Số mìn trong 8 ô quanh một ô | `adjacentMines` | — | — |
| Nước đầu | Nước bấm đầu tiên của một bàn, luôn an toàn | `firstMove` | — | — |
| Độ khó | Một trong ba bộ thông số bàn cố định | `Difficulty` | độ khó | difficulty |
| — Dễ | 9×9, 10 mìn | `beginner` | Dễ | Beginner |
| — Trung bình | 16×16, 40 mìn | `intermediate` | Trung bình | Intermediate |
| — Khó | 30×16, 99 mìn | `expert` | Khó | Expert |
| Bộ đếm mìn | Số mìn − số cờ đã cắm; xuống âm được | `minesRemaining` | — | — |
| Kỷ lục | Thời gian nhanh nhất của một độ khó | `bestTime` | kỷ lục | best time |
| Trạng thái lượt chơi | `idle` · `playing` · `won` · `lost` | `GameStatus` | — | — |
| Chạm hai pha | Đặt ngón để nhắm, nhấc ngón mới là hành động | `twoPhaseTouch` | — | — |
| Chế độ dán | Thanh Mở/Cờ ở đáy trên mobile | `stickyMode` | Mở / Cờ | Dig / Flag |
| Dải nhiệt | Bộ 8 màu số, hue quét theo chiều tăng nguy hiểm | `--num-1..8` | — | — |

**Tên bị cấm** — đã loại, không dùng lại:

- Dùng `Cell`, **không** `Tile` / `Square` / `Box`. (`tile` chỉ tồn tại trong tên token
  CSS `--bg-cell-tile`, nói về *cách vẽ* ô chưa mở, không phải về khái niệm ô.)
- Dùng `flagged`, **không** `marked`. Còn `mark` dành riêng cho *hành động* chuyển chu
  kỳ cờ → dấu hỏi → trống (`cycleMark`).
- Dùng `revealed`, **không** `opened` / `uncovered` / `clicked`.
- Dùng `hidden`, **không** `closed` / `covered` / `unopened`.
- Dùng `beginner` / `intermediate` / `expert`, **không** `easy` / `medium` / `hard` —
  đây là tên bản gốc, và `hard` dễ lẫn với `expert` khi thêm mức.
- Dùng `mine`, **không** `bomb`. (`Bomb` chỉ là tên icon Lucide.)
- Dùng `bestTime`, **không** `highScore` — ở đây thấp hơn là tốt hơn, `high` gây hiểu sai.
