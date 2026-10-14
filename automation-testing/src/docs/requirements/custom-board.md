# CUSTOMBOARD — Bàn tuỳ chỉnh

Truy vết phía app: FR-16 · US-05 · ADR-0003 · ADR-0007 · ADR-0011 · NFR-A11Y-04.

- **REQ-CUSTOMBOARD-01** Chọn "Tuỳ chỉnh" và đặt cột, hàng, mìn thì bàn có đúng số cột × hàng, bộ đếm bằng số mìn, nhãn `Tuỳ chỉnh: C×R, M mìn · không tính kỷ lục`.
- **REQ-CUSTOMBOARD-02** Việc bàn tuỳ chỉnh không ghi kỷ lục được nói **trước** nước đầu: trong cài đặt ngay khi chọn Tuỳ chỉnh, và trên nhãn bàn.
- **REQ-CUSTOMBOARD-03** Trần mìn (`cột × hàng − 9`) và mật độ mìn hiện ngay lúc nhập, bằng chữ và bằng `max` của ô Mìn.
- **REQ-CUSTOMBOARD-04** Giá trị chỉ được kẹp khi rời ô, không kẹp từng phím: gõ dở một số dưới sàn vẫn hiện đúng thứ đã gõ; rời ô thì giá trị ngoài khoảng về biên (cột 5–40, hàng 5–30, mìn 1…trần), ô để trống về một giá trị hợp lệ.
- **REQ-CUSTOMBOARD-05** Bàn tuỳ chỉnh chơi được như bàn chuẩn: nước đầu an toàn.
- **REQ-CUSTOMBOARD-06** Thắng bàn tuỳ chỉnh không ghi kỷ lục và không hiện "Nhanh nhất từ trước tới giờ"; bảng kỷ lục ba mức không đổi.
- **REQ-CUSTOMBOARD-07** Cấu hình bàn tuỳ chỉnh còn nguyên ở lần tải trang sau.
- **REQ-CUSTOMBOARD-08** Đổi sang bàn tuỳ chỉnh, hoặc sửa cấu hình bàn tuỳ chỉnh, khi đồng hồ đang chạy thì hỏi xác nhận trước khi bỏ bàn đang chơi.
