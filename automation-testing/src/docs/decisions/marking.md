# MARKING — Quyết định

Đi cặp với `docs/requirements/marking.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-03, FR-04, FR-06), `docs/01-product/journeys.md` (US-02, US-03
  "Bật/tắt dấu hỏi giữa bàn"), `docs/decisions/0012-open-cell-always-chords.md`, `README.md` §Features "The game itself"
  (flags protect a cell, chording explodes on a wrong flag, the counter goes negative), §Controls.
- **Code:** `client/src/game/core/mark.ts` (`cycleMark`), `client/src/game/core/reveal.ts` (chỉ `FLAGGED` chặn mở; chord
  đếm cờ kề), `client/src/views/Home/components/Cell/index.tsx` (`onContextMenu` preventDefault, `onAuxClick` nút giữa,
  click lên ô đã mở = chord), `client/src/views/Home/mains/Hud/index.tsx` (U+2212).
- **Test đã gom (gợi ý):** hai case "flags" trong `client/e2e/core-game.spec.ts` (right click flags, flagged cell
  survives a stray click) — chuyển thành TC-MARKING-001 và TC-MARKING-003.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Menu trình duyệt không mở" kiểm thế nào? → Sự kiện `contextmenu` thật bị `preventDefault` (`dispatchEvent` trả
  `false`). Playwright không chụp được menu hệ điều hành; `defaultPrevented` là đúng điều kiện khiến menu không hiện.
- **Q2** Ô dấu hỏi có được bảo vệ như cờ không? → Không. Luật bản gốc chỉ bảo vệ cờ, README chỉ hứa "Flags protect a
  cell", code chỉ chặn `FLAGGED`. Ghi thành REQ-MARKING-03 vế hai.
- **Q3** Tắt dấu hỏi giữa ván thì ô dấu hỏi đi đâu? → Docs chỉ nói "không được rơi vào trạng thái không tồn tại". Code giữ
  dấu hỏi tới khi chạm, rồi về "chưa mở". Đó là một trạng thái hợp lệ có đường ra → chấp nhận là hành vi mong muốn.
- **Q4** Chord kiểm trên ô nào? → Ô số đầu tiên sau nước đầu ở seed 20260903 mà mìn kề đều chưa mở và còn ô an toàn chưa
  mở để chord mở ra (chọn bằng `learnMines`, không cố định index để không gãy khi seed đổi bàn).

## Tài khoản test

Không có.

## Ngoài phạm vi

- Cắm cờ bằng chạm (giữ ngón, chế độ Cờ): module `touch`. Bằng phím `F` / chord bằng `Enter`: module `accessibility`.

## Tech debt liên quan

_(không có)_
