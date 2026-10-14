# PRIVACY — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-PRIVACY-01](#bug-privacy-01) | Thấp | TC-PRIVACY-002 | Một file font được tải sau khi trang đã tải xong, ở nước mở đầu tiên |

### BUG-PRIVACY-01

- **TC:** TC-PRIVACY-002 · **Requirement:** REQ-PRIVACY-02
- **Bước tái hiện:** mở `./?seed=20260903`, chờ mạng yên (networkidle) → bấm ô 40.
- **Mong đợi:** (`docs/03-design/architecture.md` §1, NFR-REL-04) "Sau khi tải xong trang, hệ thống không gọi mạng lần nào nữa".
- **Thực tế:** trình duyệt tải `/_next/static/media/db96af6b531dc71f-s.p.woff2` ngay khi chữ số đầu tiên được vẽ. Font của
  `next/font/google` (`client/src/app/layout.tsx`) không được preload trong bản xuất tĩnh (`out/index.html` không có
  `<link rel="preload" … woff2>`), nên mặt chữ chỉ được tải lúc lần đầu dùng. Mất mạng sau khi tải trang thì chữ số rơi về
  font dự phòng (game vẫn chơi được — TC-PRIVACY-003 xanh).
- **Phạm vi:** tái hiện được trên Chromium của Playwright chạy Windows (máy dev). Trên Chromium ubuntu của CI, font đã có
  trước khi trang tải xong nên test xanh → spec chỉ đánh `test.fail()` khi `process.platform === "win32"`. Cùng một bản
  build, khác hệ điều hành: hành vi tải font lười của trình duyệt khác nhau, nên người chơi trên Windows là người gặp.
- **Ghi chú:** ghi ngày 2026-10-15. Tên file đổi theo build; điều cần sửa là font chữ số có mặt trước khi trang được coi là
  "tải xong" (preload, hoặc nhúng).

## Đã sửa

_(chưa có)_
