# RESPONSIVE — Quyết định

Đi cặp với `docs/requirements/responsive.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/design-system/minesweeper/MASTER.md` (§3 sàn 22px, §6 sheet / dialog / dải HUD),
  `docs/decisions/0009-small-screens-pan-zoom-not-shrink.md`, `docs/02-requirements/nfr.md` (NFR-A11Y-03),
  `docs/01-product/journeys.md` (US-04), `README.md` §Features "Built for a thumb" ("the page itself never scrolls for
  the board, so the mine counter, the clock and the mode bar stay put").
- **Code:** `client/src/views/Home/index.tsx` (`boardVars`: `clamp(22px, …, 38px)`), `client/src/app/globals.css`
  (`@media (min-width: 768px)` cho sheet, `@media (hover: hover)` ẩn mode bar, `.ms-scrim--result`),
  `client/src/hooks/useRotateHint.ts` (`hover: none`).
- **Test đã gom (gợi ý):** "never scrolls the page sideways at 375px" trong `client/e2e/core-game.spec.ts`
  (→ TC-RESPONSIVE-001); case 44px / không đè của `client/e2e/ducker-id-sign-in.spec.ts` (bản cờ bật) ở lại module
  `ducker-id`, ở đây kiểm header bản cờ tắt.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Bộ cũ chạy **mọi** spec ở 4 viewport (375/768/1024/1440). Bộ mới chạy logic ở một viewport và gom phần phụ thuộc bề
  rộng vào module này, mỗi bề rộng một test (thêm 320px — bề rộng hẹp nhất mà spec đăng nhập đã dùng). Nhân bốn mọi case
  logic không chứng minh thêm điều gì về bố cục.
- **Q2** "Trong màn hình" kiểm bằng bounding box so với viewport sau khi kéo khung bàn tới tận cùng; `window.scrollX`
  phải giữ 0.
- **Q3** NFR-A11Y-03 nói 44px "trên thiết bị cảm ứng"; kiểm ở cửa sổ 320px của project desktop vì kích thước nút không đổi
  theo loại con trỏ (CSS không có nhánh nào cho nó), và 320px là chỗ chật nhất.

## Tài khoản test

Không có.

## Ngoài phạm vi

- So sánh ảnh chụp (visual regression) — bộ test kiểm hình học, không kiểm pixel.

## Tech debt liên quan

_(không có)_
