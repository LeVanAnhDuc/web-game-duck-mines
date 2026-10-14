# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`client/e2e/`, chạy bằng `client/playwright.config.ts` → `pnpm test:e2e`) được `git mv`
về đây khi dựng `automation-testing/`. Config cũ gộp vào `playwright.config.ts` (webServer build + phục vụ bản xuất
tĩnh ở :4173, bản bật cờ Ducker ID ở :4391; project `app-touch` = Pixel 5, `app-auth` = bản bật cờ).

| Từ | Về | Trạng thái |
|---|---|---|
| `client/e2e/core-game.spec.ts` | `src/tests/e2e/board/core-game.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/touch.spec.ts` | `src/tests/e2e/touch/touch.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ducker-id-flag-off.spec.ts` | `src/tests/e2e/ducker-id/flag-off.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ducker-id-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts` | chưa chuẩn hóa |
| `client/playwright.config.ts` (5 viewport + touch + 2 auth project, 2 webServer) | `playwright.config.ts` | gộp |

Unit + component test (vitest, `client/src/**/*.test.ts(x)`) ở lại `client/`: chúng thuộc về code.

## Còn trỏ về nơi cũ

- `docs/specs/*/plan.md`, `docs/specs/*/design.md`, `docs/decisions/00*.md` — tài liệu lịch sử (đã ship), giữ nguyên văn.
- `docs/04-state/backlog.md` — số liệu "207 e2e trên năm project" là ảnh chụp trạng thái lúc ghi, không phải luật.
- `.claude/skills/ux-persona-review/runs/` — nhật ký phiên cũ.
