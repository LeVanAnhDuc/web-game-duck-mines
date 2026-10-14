# GAMERESULT — Thắng, thua, dialog kết quả, kỷ lục

Truy vết phía app: FR-05 · FR-09 · US-01 · US-03 · invariant #6, #7 · ADR-0005.

- **REQ-GAMERESULT-01** Mở phải ô mìn thì thua: ô vừa mở là "mìn đã nổ", mọi mìn khác không nằm dưới cờ hiện ra, dialog "Nổ rồi" hiện và vùng thông báo cho trình đọc màn hình nói "Nổ rồi".
- **REQ-GAMERESULT-02** Khi thua, cờ cắm sai chỗ thành "cờ cắm sai" (gạch chéo), cờ đúng giữ "đã cắm cờ", và dialog có dòng "Cờ bị gạch chéo là chỗ cắm sai." chỉ khi có ít nhất một cờ sai.
- **REQ-GAMERESULT-03** Ván đã xong (thắng hoặc thua) đóng băng: không mở, không cắm cờ được ô nào nữa, đồng hồ đứng ở thời điểm kết thúc.
- **REQ-GAMERESULT-04** Mở hết mọi ô không có mìn thì thắng (đếm ô đã mở, không đếm cờ): dialog "Dọn sạch bàn" hiện và vùng thông báo nói "Dọn sạch bàn".
- **REQ-GAMERESULT-05** Khi thắng, mọi mìn còn lại tự hiện cờ (và vì vậy bộ đếm về `000`).
- **REQ-GAMERESULT-06** Dialog kết quả nói thời gian ván (`m:ss`, cùng giá trị đồng hồ dừng ở đó) và đưa focus vào nút "Bàn mới".
- **REQ-GAMERESULT-07** Đóng dialog (nút "Đóng" hoặc Esc) chỉ đóng nó: bàn vừa xong ở lại trên màn hình nguyên trạng. Dialog nằm trên bàn, không thay bàn. "Bàn mới" trên dialog bắt đầu một bàn mới.
- **REQ-GAMERESULT-08** Thắng một bàn chuẩn ghi kỷ lục riêng cho đúng độ khó đó khi thời gian **nhỏ hơn hẳn** kỷ lục cũ (hoặc chưa có kỷ lục); khi đó dialog hiện "Nhanh nhất từ trước tới giờ". Bằng hoặc chậm hơn thì không ghi, không chúc mừng.
- **REQ-GAMERESULT-09** Kỷ lục lưu trên máy người chơi, còn nguyên sau khi tải lại trang, và hiện trong cài đặt theo từng độ khó (`—` khi chưa có).
