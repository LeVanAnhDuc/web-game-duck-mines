# TOUCH — Quyết định

Đi cặp với `docs/requirements/touch.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-12, FR-13, FR-17), `docs/01-product/journeys.md` (US-04 + "Điều gì
  có thể sai"), `docs/decisions/0004-input-branches-on-pointertype.md`, `docs/decisions/0009-small-screens-pan-zoom-not-shrink.md`,
  `docs/02-requirements/nfr.md` (NFR-A11Y-03, NFR-A11Y-06), `docs/design-system/minesweeper/MASTER.md` §3 (sàn 22px),
  `README.md` §Features "Built for a thumb".
- **Code:** `client/src/game/input/touchGesture.ts` (`ENGAGE_MS` 120, `FLAG_MS` 500, `SLOP_PX` 10, `gestureReducer`),
  `client/src/hooks/useTouchGesture.ts` (pointer handlers, bỏ qua `pointerType === "mouse"`, tick bằng rAF +
  `performance.now`), `client/src/views/Home/mains/Board/index.tsx` (khung `board-viewport`, `aim-chip`),
  `client/src/hooks/useRotateHint.ts`, `client/src/app/globals.css` (`.ms-board` `touch-action: manipulation`,
  `.ms-viewport` `overscroll-behavior: contain` + `touch-action: pan-x pan-y pinch-zoom`, mode bar ẩn khi `hover: hover`).
- **Test đã gom (gợi ý):** `src/tests/e2e/touch/touch.e2e.ts` (từ `client/e2e/touch.spec.ts`, 7 case) — chuẩn hoá thành
  `gestures.e2e.ts` + `board-frame.e2e.ts`. Case NFR-PERF-06 trong file cũ chuyển sang module `board` (TC-BOARD-014).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Thiết bị nào? → Project `app-touch` = Pixel 5 của Playwright (`hasTouch`, `isMobile`, viewport 393×727,
  chromium). Đủ để đi nhánh `pointerType === "touch"` và `(hover: none)`.
- **Q2** Các pha của ngón (đặt, dừng, trượt, nhấc ở chỗ khác) không có API Playwright → phát `PointerEvent` touch tại toạ độ
  ô (`GamePage.finger`), thời gian bằng `page.clock`. Kéo bàn thì dùng **touch thật qua CDP** (`Input.dispatchTouchEvent`)
  để chính trình duyệt quyết định pan — test cũ chỉ gán `scrollLeft` nên không chứng minh gì về cử chỉ.
- **Q3** Gợi ý xoay: Pixel 5 dài 727px < 766px bàn Khó cần → đúng là không gợi ý trên máy đó. Kiểm REQ-TOUCH-08 ở viewport
  390×844 (máy phổ biến, bàn Khó vừa khi xoay), và bàn 40 cột (xoay cũng không vừa). README "it says so once" hiểu là một
  dòng gợi ý, không phải "chỉ hiện một lần trong đời".
- **Q4** "Chạm hai lần làm trình duyệt zoom / kéo xuống làm trang refresh" không tái hiện được trong headless → chứng minh
  bằng điều kiện CSS khiến nó không xảy ra (`touch-action: manipulation` trên bàn, `overscroll-behavior: contain` trên khung).
- **Q5** Pinch để nhìn toàn bàn và ẩn chữ số ở mức zoom tổng (US-04 bước 6, FR-13 vế sau) → ngoài phạm vi tự động: pinch
  không mô phỏng được ổn định; thử tay trên máy thật như NFR-A11Y-06 ghi.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Rung (haptic) khi cắm cờ bằng giữ ngón.
- Máy 2-in-1 có cả chuột và màn chạm (US-04) — nhánh chuột đã phủ ở các module khác; phân nhánh theo `pointerType` là
  unit test của app.

## Tech debt liên quan

_(không có)_
