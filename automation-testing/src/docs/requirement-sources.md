# Nguồn requirement của Duck Mines

**Requirement của module lấy ở đâu.** `/write-tests` đọc file này ở bước 1 và chỉ đọc các nơi liệt kê dưới đây, cộng với
những gì user nói trong chat. Không dùng Jira/Confluence.

Đường dẫn tính từ thư mục gốc repo test. Danh sách này được user xác nhận lúc scaffold; khi user chỉ thêm nơi khác, hoặc
một nơi bị bỏ/đóng băng, sửa bảng này trong cùng lượt.

## Tài liệu

- `../docs/README.md` — bản đồ tài liệu + quy ước ID (US / FR / NFR / ADR); đọc trước để biết file nào là nguồn đúng
- `../docs/01-product/overview.md` — định vị, Non-Goals (không server, không tài khoản game, không tutorial)
- `../docs/01-product/journeys.md` — luồng người dùng US-01…US-06, kèm "Điều gì có thể sai" (nguồn chính cho case negative)
- `../docs/01-product/glossary.md` — tên khái niệm ↔ tên trong code ↔ tên trên UI
- `../docs/02-requirements/scope.md` — danh mục chức năng FR-01…FR-19 và trạng thái
- `../docs/02-requirements/nfr.md` — ngưỡng NFR-PERF / A11Y / REL / DATA áp cho mọi feature
- `../docs/03-design/invariants.md` — điều kiện sai âm thầm (first-click safety, storage, cờ Ducker ID)
- `../docs/decisions/` — ADR-0001…0013: vì sao hành vi như vậy (vd ADR-0011 kẹp ô tuỳ chỉnh lúc rời ô, ADR-0012 ô số luôn chord)
- `../docs/specs/<feature>/design.md` — thiết kế đã duyệt của từng feature (core-game, ducker-id-sign-in, ux-persona-findings)
- `../docs/design-system/minesweeper/MASTER.md` — ngưỡng hiển thị (ô ≥ 22px, vùng bấm 44px, tương phản)
- `../README.md` — mục Features + Controls: hợp đồng hành vi hướng tới người chơi

## Code

- `../client/src/lib/strings.ts` — mọi chuỗi UI (tiếng Việt), nguồn của `src/data/copy.ts`
- `../client/src/views/Home/` — màn hình duy nhất: header, HUD, bàn cờ, sheet cài đặt, dialog kết quả, thanh chế độ, nút tài khoản
- `../client/src/game/` — luật chơi thuần (board, reveal, mark, custom, reducer), input chạm, kỷ lục, cài đặt, storage, âm thanh
- `../client/src/hooks/` — timer, cursor bàn phím, cử chỉ chạm, gợi ý xoay, theme, đăng nhập
- `../client/src/auth/` — đăng nhập Ducker ID (OIDC + PKCE) sau cờ tính năng
- `../client/scripts/build-e2e-auth.mjs`, `../client/scripts/serve.mjs` — bản build bật cờ đăng nhập (issuer giả) và server tĩnh mà suite này dùng

## Không đọc như nguồn đúng

- `../docs/specs/*/plan.md` — danh sách task lúc build, không phải hành vi
- `../docs/04-state/backlog.md` — việc đang làm / nợ kỹ thuật, không phải hành vi đã ship
- `../docs/code-conventions.md` — quy ước viết code dùng chung, không nói về hành vi
- `../.claude/skills/ux-persona-review/runs/` — nhật ký phiên persona (phát hiện UX lịch sử, đã xử lý ở `ux-persona-findings`)
- `../client/src/**/*.test.ts(x)` — unit/component test của app: gợi ý hành vi, không phải requirement

## Thứ tự thẩm quyền

User (chat) > tài liệu trên > code. Code cho biết app *đang* làm gì, không cho biết *nên* làm gì.
