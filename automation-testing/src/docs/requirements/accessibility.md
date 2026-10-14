# ACCESSIBILITY — Bàn phím, trình đọc màn hình, màu, chuyển động

Truy vết phía app: FR-11 · NFR-A11Y-02 · NFR-A11Y-04 · NFR-A11Y-05 · NFR-A11Y-07 · invariant #8 · ADR-0002.

- **REQ-ACCESSIBILITY-01** Mũi tên di chuyển con trỏ bàn cờ từng ô; focus đi theo con trỏ và vòng focus luôn nhìn thấy được (có outline, ≥ 2px).
- **REQ-ACCESSIBILITY-02** Con trỏ dừng ở mép bàn, không quấn sang hàng/cột khác; `Home` / `End` nhảy tới đầu / cuối hàng.
- **REQ-ACCESSIBILITY-03** `Space` mở ô dưới con trỏ, `F` cắm cờ, `Enter` chord, `R` bắt đầu bàn mới.
- **REQ-ACCESSIBILITY-04** Phím điều khiển bàn cờ không cuộn trang.
- **REQ-ACCESSIBILITY-05** Cả bàn cờ là **một** điểm dừng Tab (chỉ ô dưới con trỏ có `tabindex=0`); một lần Tab là rời bàn.
- **REQ-ACCESSIBILITY-06** Bàn là `grid` có tên "Bàn dò mìn" và số hàng/cột đúng; mỗi ô có tên nói hàng, cột (đếm từ 1) và trạng thái.
- **REQ-ACCESSIBILITY-07** Màu không bao giờ là kênh duy nhất: chữ số là chữ, đọc được khi bỏ hết màu; ô chưa mở và ô đã mở phân biệt bằng viền.
- **REQ-ACCESSIBILITY-08** Khi người dùng bật giảm chuyển động (`prefers-reduced-motion`), ô không còn chuyển động/hiệu ứng (thời lượng 0), không chỉ giảm một nửa.
- **REQ-ACCESSIBILITY-09** Trang nói cách điều khiển: bàn phím, chuột phải cắm cờ, và hai cách chord.
