# GAMERESULT — Quyết định

Đi cặp với `docs/requirements/game-result.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-05, FR-09), `docs/01-product/journeys.md` (US-01 "Kết quả mong
  đợi" + "Điều gì có thể sai", US-03), `docs/03-design/invariants.md` (#6 không xoá cờ khi lộ mìn, #7 bàn xong đóng
  băng), `docs/specs/core-game/design.md` §máy trạng thái, `docs/decisions/0005-timer-outside-gamestate.md`,
  `README.md` §Features ("Losing shows every mine…", "Finishing a board tells you how long it took… closing that panel
  leaves the finished board on screen").
- **Code:** `client/src/game/core/reducer.ts` (`settle`), `client/src/game/core/rules.ts` (`isWon`, `revealAllMines`),
  `client/src/views/Home/components/ResultDialog/index.tsx`, `client/src/views/Home/ghosts/SettleResult/index.tsx`,
  `client/src/game/score/localScoreRepository.ts` (`saveIfBest`: nhỏ hơn hẳn mới ghi).
- **Test đã gom (gợi ý):** "the result dialog" trong `client/e2e/core-game.spec.ts` → TC-GAMERESULT-008.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** US-01 nói "Thắng thì … mọi mìn còn lại tự hiện cờ"; code khi thắng không đổi mark của mìn (chúng vẫn "chưa mở",
  bộ đếm giữ nguyên). Docs > code → giữ REQ-GAMERESULT-05 như docs viết, app lệch là **bug** (BUG-GAMERESULT-01). Không
  sửa game trong PR này.
- **Q2** Kỷ lục bằng đúng kỷ lục cũ có tính không? → Không: code nói rõ "strictly better" và lý do (không chúc mừng người
  đứng yên). Docs chỉ nói "tốt hơn" → khớp. Biên này thành TC-GAMERESULT-010.
- **Q3** Kỷ lục được dựng sẵn bằng gì? → Ghi `minesweeper.records.v1` (giây nguyên theo độ khó) vào localStorage trước khi
  trang chạy (`GamePage.seedStorage`). Đây là định dạng lưu của chính app, không phải API riêng cho test.
- **Q4** Thời gian ván đo thế nào? → `page.clock`: cho trôi đúng N giây giữa nước đầu và nước thắng; dialog phải nói
  `0:0N`. Thắng ngay (0 giây) cũng hợp lệ nhưng không phân biệt được với lỗi "không tính giờ".

## Tài khoản test

Không có.

## Ngoài phạm vi

- Âm thanh khi thua (module `settings`, NFR-A11Y-08 là thử tay).
- Bàn tuỳ chỉnh không ghi kỷ lục: module `custom-board`.
- localStorage bị chặn khi thắng: module `settings` (NFR-REL-03).

## Tech debt liên quan

_(không có)_
