# PRIVACY — Mạng, lưu trữ, offline, console

Truy vết phía app: NFR-DATA-04 · NFR-REL-04 · NFR-PERF-08 · NFR-SEC-02 · ADR-0008 · ADR-0013 · `docs/01-product/overview.md` (trần chi phí 0₫, không server).

- **REQ-PRIVACY-01** Bản deploy (cờ đăng nhập tắt) không gửi một request nào ra ngoài site, cả lúc tải lẫn lúc chơi.
- **REQ-PRIVACY-02** Sau khi trang tải xong, chơi (mở ô, cắm cờ, đổi độ khó, bàn mới) không gọi mạng lần nào nữa.
- **REQ-PRIVACY-03** Mất mạng sau lần tải đầu, game vẫn chơi tiếp được đầy đủ.
- **REQ-PRIVACY-04** Không tải file âm thanh nào, kể cả khi bật tiếng và thua.
- **REQ-PRIVACY-05** Không đặt cookie nào.
- **REQ-PRIVACY-06** Máy người chơi chỉ giữ kỷ lục và cài đặt (độ khó, bàn tuỳ chỉnh, dấu hỏi, theme, tiếng) trong `localStorage`; không `sessionStorage`, không dữ liệu nào về người chơi.
- **REQ-PRIVACY-07** Bản production không ghi gì ra console (kể cả lỗi trang) trong lúc tải và chơi.
