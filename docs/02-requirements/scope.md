# Danh mục chức năng

> **Trả lời:** Hệ thống có những chức năng nào, mỗi cái đang ở trạng thái gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-03 · commit —
> **Cập nhật khi:** brainstorm ra chức năng mới (cấp FR mới) · một FR chuyển trạng thái

<!-- CÁCH ĐIỀN
Chỉ LIỆT KÊ. Một dòng một chức năng, tên ngắn. Cách làm thuộc tài liệu thiết kế
của feature, không thuộc đây.

ID cấp tăng dần, không tái dùng, không xoá. Bỏ một chức năng thì đổi trạng thái
thành (bỏ) và giữ số — vì commit và test cũ vẫn tham chiếu ID đó.

Trạng thái: chưa · đang · xong · (bỏ)

KHÔNG chứa: cách hiện thực, ngưỡng phi chức năng (-> nfr.md), lý do chọn giải pháp
(-> decisions/).
-->

| ID | Chức năng | Thuộc luồng | Feature | Trạng thái |
| --- | --- | --- | --- | --- |
| FR-01 | Sinh bàn theo độ khó; mìn sinh **sau** nước đầu, loại trừ ô đã bấm và 8 ô kề | US-01 | core-game | chưa |
| FR-02 | Mở ô, lan vùng trống (flood fill) tới viền số | US-01 | core-game | chưa |
| FR-03 | Cắm cờ; chu kỳ có/không dấu hỏi | US-02 | core-game | chưa |
| FR-04 | Chord — mở các ô kề khi số cờ kề khớp con số | US-02 | core-game | chưa |
| FR-05 | Nhận thắng/thua; hiện toàn bộ mìn, gạch chéo cờ cắm sai | US-01 | core-game | chưa |
| FR-06 | Bộ đếm mìn còn lại, cho phép xuống âm | US-01 · US-02 | core-game | chưa |
| FR-07 | Đồng hồ, bắt đầu từ nước đầu, không chặn ở 999 | US-01 | core-game | chưa |
| FR-08 | Bàn mới | US-01 | core-game | chưa |
| FR-11 | Điều khiển bàn phím đầy đủ trên bàn cờ | US-01 · US-02 | core-game | chưa |
| FR-09 | Kỷ lục riêng cho từng độ khó, lưu trên máy người chơi | US-01 · US-03 | settings-records | chưa |
| FR-10 | Cài đặt: độ khó, bật/tắt dấu hỏi, xoá kỷ lục | US-03 | settings-records | chưa |
| FR-14 | Sáng/tối theo hệ thống, có ghi đè, nhớ lựa chọn | US-03 | settings-records | chưa |
| FR-12 | Chạm hai pha trên cảm ứng + thanh chế độ Mở/Cờ + giữ ngón để cắm cờ | US-04 | touch | chưa |
| FR-13 | Pan/zoom bàn Khó trên màn hẹp; ẩn chữ số ở mức zoom nhìn tổng | US-04 | touch | chưa |
| FR-15 | Xuất tĩnh + deploy GitHub Pages | — | deploy | chưa |

**Thứ tự làm:** `core-game` → `settings-records` → `touch` → `deploy`. Sau feature đầu
đã có một game chơi được thật bằng chuột và bàn phím; ba feature sau mở rộng chứ không
sửa lại nền.

Bốn feature này là bốn `docs/specs/<feature>/`, bốn branch, bốn PR.
