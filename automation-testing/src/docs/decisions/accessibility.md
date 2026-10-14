# ACCESSIBILITY — Quyết định

Đi cặp với `docs/requirements/accessibility.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-11), `docs/02-requirements/nfr.md` (NFR-A11Y-01…08),
  `docs/03-design/invariants.md` (#8 viền là thứ duy nhất phân biệt ô đóng/mở), `docs/decisions/0002-dom-board-not-canvas.md`,
  `docs/design-system/minesweeper/MASTER.md`, `README.md` §Features "Playable without a mouse", "Readable in the dark,
  and without colour", §Controls.
- **Code:** `client/src/views/Home/index.tsx` (`onKeyDown`: mũi tên, Home/End, Space, Enter, F, R + `preventDefault`),
  `client/src/hooks/useBoardCursor.ts` (kẹp ở mép), `client/src/views/Home/ghosts/SyncFocusToCursor`,
  `client/src/views/Home/components/Cell/index.tsx` (roving `tabIndex`, `aria-label`),
  `client/src/views/Home/mains/Board/index.tsx` (`role=grid`, `aria-rowcount/colcount`), `client/src/app/globals.css`
  (`.ms-cell--tile` viền 1px, `.ms-cell--open` không viền, `:focus-visible` outline 2px, khối `prefers-reduced-motion`).
- **Test đã gom (gợi ý):** "FR-11: the board is playable from the keyboard" (3 case) và "NFR-A11Y-07" trong
  `client/e2e/core-game.spec.ts` → TC-ACCESSIBILITY-001, 004, 006, 009.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Phím tác động lên ô nào? → Lên **con trỏ** của game, không lên phần tử đang có focus DOM. Người dùng bàn phím
  vào bàn bằng Tab (đúng ô con trỏ) rồi dùng mũi tên, nên test cũng đi đường đó (`focusBoard`, `cursorTo`). Gọi
  `element.focus()` lên một ô khác con trỏ là thao tác người dùng không làm được.
- **Q2** NFR-A11Y-05 nói "sóng mở ô tắt hoàn toàn"; code hiện chưa có hoạt ảnh sóng (chỉ có token `--motion-cascade-max`)
  nhưng ô có `transition` 90ms. Chứng minh điều kiện chung: dưới `reduce`, mọi `transition-duration` / `animation-duration`
  của ô là 0; không `reduce` thì có chuyển động (để test không đúng một cách vô nghĩa).
- **Q3** Tương phản 4.5:1 (NFR-A11Y-01) → đã đo bằng unit test token trong app, không lặp lại ở e2e.
- **Q4** Vùng bấm 44px (NFR-A11Y-03) và ô ≥ 22px (NFR-A11Y-06) → module `responsive` / `touch`.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Trải nghiệm thật với trình đọc màn hình (NVDA/VoiceOver) — thử tay; ở đây chỉ chứng minh tên + vai trò đúng.

## Tech debt liên quan

_(không có)_
