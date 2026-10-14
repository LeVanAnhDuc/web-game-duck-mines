# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`client/e2e/`, chạy bằng `client/playwright.config.ts` → `pnpm test:e2e`) được `git mv`
về đây khi dựng `automation-testing/`. Config cũ gộp vào `playwright.config.ts` (webServer build + phục vụ bản xuất
tĩnh ở :4173, bản bật cờ Ducker ID ở :4391; project `app-touch` = Pixel 5, `app-auth` = bản bật cờ).

| Từ | Về | Trạng thái |
|---|---|---|
| `client/e2e/core-game.spec.ts` | `src/tests/e2e/board/first-move.e2e.ts` (git mv), các case tách theo module: board (load, first move ×20, clock, seed), marking (2 case cờ), game-result (dialog kết quả), settings (đổi bàn + nhớ, hỏi bỏ bàn, tiếng tắt), theme (ghi đè hệ), custom-board (4 case), accessibility (3 case phím + grayscale), responsive (375px không cuộn ngang), privacy (không file âm thanh) | đã chuẩn hóa |
| `client/e2e/touch.spec.ts` | `src/tests/e2e/touch/gestures.e2e.ts` (git mv) + `touch/board-frame.e2e.ts`; case NFR-PERF-06 → `board/performance.e2e.ts` | đã chuẩn hóa |
| `client/e2e/ducker-id-flag-off.spec.ts` | `src/tests/e2e/ducker-id/flag-off.e2e.ts` | đã chuẩn hóa |
| `client/e2e/ducker-id-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts`; issuer giả → `src/fixtures/issuer.fixture.ts` | đã chuẩn hóa |
| `client/playwright.config.ts` (5 viewport + touch + 2 auth project, 2 webServer) | `playwright.config.ts` | gộp |

Case cũ bị bỏ khi chuẩn hóa: "dragging pans the board" (chỉ gán `scrollLeft` bằng JS, không chứng minh cử chỉ) — thay bằng
TC-TOUCH-010 kéo touch thật qua CDP. Không case nào khác bị bỏ.

Unit + component test (vitest, `client/src/**/*.test.ts(x)`) ở lại `client/`: chúng thuộc về code.

## Còn trỏ về nơi cũ

- `docs/specs/*/plan.md`, `docs/specs/*/design.md`, `docs/decisions/00*.md` — tài liệu lịch sử (đã ship), giữ nguyên văn.
- `docs/04-state/backlog.md` — số liệu "207 e2e trên năm project" là ảnh chụp trạng thái lúc ghi, không phải luật.
- `.claude/skills/ux-persona-review/runs/` — nhật ký phiên cũ.
