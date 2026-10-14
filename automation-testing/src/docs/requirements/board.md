# BOARD — Bàn cờ, nước đầu, đồng hồ, bộ đếm, bàn mới

Truy vết phía app: FR-01 · FR-02 · FR-06 · FR-07 · FR-08 · US-01 · NFR-PERF-06 · ADR-0003 · ADR-0005.

- **REQ-BOARD-01** Mở trang khi chưa có cài đặt: bàn Dễ 9×9 toàn ô chưa mở, đồng hồ `0:00`, bộ đếm mìn `010`, nhãn `Dễ: 9×9, 10 mìn`.
- **REQ-BOARD-02** Nước đầu tiên không bao giờ trúng mìn, ở mọi ô (kể cả ô góc) và mọi độ khó: mìn được đặt sau nước đầu, loại trừ ô đã bấm và 8 ô kề, nên ô đó luôn là ô trống và mở ra một vùng.
- **REQ-BOARD-03** Mở một ô trống lan vùng (flood fill) tới viền số: mọi ô kề của một ô trống đã mở đều đã mở; mỗi ô số hiện đúng số mìn trong 8 ô kề; không ô mìn nào bị mở bởi vùng lan.
- **REQ-BOARD-04** Mở một ô số (không phải ô trống) chỉ mở đúng ô đó.
- **REQ-BOARD-05** Đồng hồ đứng ở `0:00` cho tới nước mở đầu tiên, chạy từ nước đó, hiển thị `phút:giây` và không dừng ở 999 giây.
- **REQ-BOARD-06** Bộ đếm mìn hiển thị số mìn trừ số cờ đã cắm, 3 chữ số có số 0 đứng đầu.
- **REQ-BOARD-07** "Bàn mới" (nút ở HUD) bỏ bàn hiện tại bất kể trạng thái: mọi ô chưa mở, đồng hồ `0:00` và đứng yên, bộ đếm về số mìn của độ khó; nước kế tiếp lại là một nước đầu an toàn.
- **REQ-BOARD-08** `?seed=` cho bàn tái lập được: cùng seed và cùng nước đầu (ở lần tải trang) cho ra cùng một bàn; seed khác cho bàn khác.
- **REQ-BOARD-09** Từ lúc bấm tới lúc bàn vẽ xong một nước trên bàn Khó (30×16) dưới 50ms (NFR-PERF-06).
