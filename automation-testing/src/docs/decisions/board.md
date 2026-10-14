# BOARD — Quyết định

Đi cặp với `docs/requirements/board.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/README.md`, `docs/02-requirements/scope.md` (FR-01, FR-02, FR-06, FR-07, FR-08),
  `docs/01-product/journeys.md` (US-01 + "Điều gì có thể sai"), `docs/02-requirements/nfr.md` (NFR-PERF-05/06),
  `docs/03-design/invariants.md`, `docs/decisions/0003-mines-planted-after-first-move.md`,
  `docs/decisions/0005-timer-outside-gamestate.md`, `README.md` §Features "The game itself", §Controls.
- **Code:** `client/src/hooks/useGame.ts` (seed đọc từ URL lúc nước đầu, `round` tăng mỗi bàn mới),
  `client/src/hooks/useTimer.ts` (hiệu hai mốc `Date.now`, interval 250ms, `m:ss`), `client/src/game/core/reducer.ts`,
  `client/src/views/Home/mains/Hud/index.tsx` (bộ đếm 3 chữ số, dấu trừ U+2212), `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `src/tests/e2e/board/core-game.e2e.ts` (từ `client/e2e/core-game.spec.ts`).
- **Quan sát app thật:** bản xuất tĩnh `http://127.0.0.1:4173`, đọc DOM bằng script: mỗi ô là `button` trong
  `role=grid "Bàn dò mìn"` với `aria-label` "hàng R, cột C, <trạng thái>", `data-testid="cell-<index>"` (row-major).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Nhãn bàn (`difficulty-label`) là một phần của trạng thái ban đầu? → Có, nó là chỗ duy nhất trên màn hình nói kích
  thước + số mìn; thuộc REQ-BOARD-01.
- **Q2** "Không bao giờ trúng mìn" kiểm bằng gì? → 20 seed ở ô giữa + 3 seed ở ô góc (biên: vùng 3×3 bị cắt) + bàn Khó.
  Không thể chứng minh "mọi bàn" bằng e2e; unit test `client/src/game/core/board.test.ts` phủ phần tổng quát.
- **Q3** Cùng seed nghĩa là gì? → Cùng seed **ở lần tải trang** + cùng nước đầu. Sau "Bàn mới" seed được cộng thêm số
  vòng (`useGame.ts`), nên hai bàn liên tiếp cùng URL là khác nhau — đó là hành vi mong muốn (README: "`?seed=` gives you
  a specific board"), không phải bug.
- **Q4** Biết mìn ở đâu bằng cách nào mà không import code game? → `GamePage.learnMines`: chơi tới khi thua, đọc mìn bàn
  tự lộ ra, rồi tải lại cùng seed. Dựa trên REQ-BOARD-08, nên TC-BOARD-012 là điều kiện tiên quyết của các TC dùng nó.
- **Q5** Đồng hồ kiểm bằng thời gian thật? → Không: `page.clock` (giả `Date.now` + interval). Thời gian thật làm test chậm
  và chập chờn; hành vi cần chứng minh là phép tính hiệu hai mốc, không phải tốc độ máy.
- **Q6** NFR-PERF-06 đo ở đâu? → Desktop Chrome của project `app`, bàn Khó, click → hai frame. Bản cũ chỉ đo ở
  `desktop-1440`; giữ một phép đo.

## Tài khoản test

Không có — game không có tài khoản.

## Ngoài phạm vi

- NFR-PERF-05 (reveal < 16ms) là benchmark vitest trong `client/`, không đo qua trình duyệt.
- Phân bố ngẫu nhiên của mìn (unit test của app).

## Tech debt liên quan

_(không có)_
