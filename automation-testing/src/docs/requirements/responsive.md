# RESPONSIVE — Bố cục theo bề rộng màn hình

Truy vết phía app: FR-13 · ADR-0009 · NFR-A11Y-03 · `docs/design-system/minesweeper/MASTER.md` §6.

- **REQ-RESPONSIVE-01** Ở mọi bề rộng từ 320px tới 1440px, trang không bao giờ cuộn ngang — kể cả với bàn Khó.
- **REQ-RESPONSIVE-02** Màn đủ rộng (≥ 1024px) thì bàn Khó hiện trọn, không phải kéo.
- **REQ-RESPONSIVE-03** Màn hẹp với bàn lớn hơn màn hình: bộ đếm mìn, đồng hồ và nút bàn mới vẫn nằm trong màn hình khi bàn được kéo — trang không cuộn theo bàn.
- **REQ-RESPONSIVE-04** Nút điều khiển (đổi sáng/tối, cài đặt, bàn mới) có vùng bấm ≥ 44×44px và không đè lên nhau hay lên tên game, kể cả ở 320px.
- **REQ-RESPONSIVE-05** Cài đặt là tấm trượt từ đáy dưới 768px, hộp thoại giữa màn từ 768px trở lên.
- **REQ-RESPONSIVE-06** Thiết bị có chuột (`hover: hover`) không có thanh Mở/Cờ và không có gợi ý xoay, dù cửa sổ hẹp.
- **REQ-RESPONSIVE-07** Dialog kết quả neo ở đáy để bàn vừa xong vẫn nhìn thấy phía trên — ô mìn vừa nổ không bị che.
