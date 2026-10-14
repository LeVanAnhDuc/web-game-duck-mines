# DEPLOY — Bản xuất tĩnh trên GitHub Pages

Truy vết phía app: FR-15 · ADR-0002 · `docs/01-product/overview.md` §5 (trần chi phí 0₫) · `client/next.config.ts`.

- **REQ-DEPLOY-01** Bản xuất tĩnh tải trọn vẹn từ một host file tĩnh: tiêu đề "Duck Mines", bàn hiện ra, không tài nguyên nào trả lỗi (4xx/5xx) hay hỏng.
- **REQ-DEPLOY-02** Mọi tài nguyên của site nằm dưới đường dẫn gốc của nó (trên GitHub Pages là `/web-game-duck-mines/`), và trang hoạt động được ở đó.
