# SETTINGS — Cài đặt: độ khó, dấu hỏi, âm thanh, kỷ lục, khi không lưu được

Truy vết phía app: FR-10 · FR-18 · US-03 · NFR-REL-03 · NFR-A11Y-08 · ADR-0008.

- **REQ-SETTINGS-01** Cài đặt liệt kê ba mức kèm thông số (`9×9 · 10 mìn`, `16×16 · 40 mìn`, `30×16 · 99 mìn`), mức đang chọn được đánh dấu, và kỷ lục của từng mức.
- **REQ-SETTINGS-02** Chọn mức khác khi đồng hồ chưa chạy (chưa mở ô nào — cắm cờ không tính) thì đổi ngay, không hỏi: bàn, bộ đếm, nhãn theo mức mới.
- **REQ-SETTINGS-03** Chọn mức khác khi đồng hồ đang chạy thì hỏi "Bỏ bàn đang chơi để sang mức X?" và đưa focus vào "Bỏ bàn"; bàn chưa đổi cho tới khi trả lời. "Bỏ bàn" đổi sang bàn mới của mức đó; "Giữ lại" hoặc đóng cài đặt thì bàn đang chơi còn nguyên.
- **REQ-SETTINGS-04** Độ khó đã chọn còn nguyên ở lần tải trang sau.
- **REQ-SETTINGS-05** Cài đặt nhận focus khi mở và đóng được bằng nút "Đóng", phím Esc, hoặc bấm ra nền.
- **REQ-SETTINGS-06** Công tắc "Dấu hỏi trong chu kỳ cờ" mặc định tắt, bật/tắt được, và được nhớ qua tải lại.
- **REQ-SETTINGS-07** Công tắc "Tiếng khi mìn nổ" mặc định tắt, bật/tắt được, được nhớ qua tải lại. Tắt thì thua không phát âm nào; bật thì thua phát một tiếng nổ sinh bằng WebAudio, không giải mã file âm thanh nào.
- **REQ-SETTINGS-08** "Xoá kỷ lục" đưa kỷ lục cả ba mức về `—`.
- **REQ-SETTINGS-09** Khi `localStorage` không dùng được, game vẫn chơi được đầy đủ (mở ô, cắm cờ, đổi độ khó), cài đặt nói một dòng "Máy này không cho lưu, nên kỷ lục sẽ mất khi đóng tab." — không dialog chặn — và thắng không được khoe là kỷ lục.
- **REQ-SETTINGS-10** Cài đặt nói rõ bàn sinh theo luật gốc và nước cuối có thể phải đoán.
