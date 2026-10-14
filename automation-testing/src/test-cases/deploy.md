# DEPLOY — Test cases

Requirement: `docs/requirements/deploy.md` · quyết định: `docs/decisions/deploy.md`.
Chạy được trên dev và trên prd (`ENV=prd pnpm test src/tests/e2e/deploy`).

### TC-DEPLOY-001 — trang tải trọn vẹn: mọi tài nguyên trả về thành công

- **Requirement:** REQ-DEPLOY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở `./` → chờ mạng yên
- **Mong đợi:** tiêu đề "Duck Mines"; 81 ô; không response ≥ 400, không request hỏng
- **Automated:** `tests/e2e/deploy/static-export.e2e.ts`

### TC-DEPLOY-002 — mọi tài nguyên của site nằm dưới đường dẫn gốc của nó

- **Requirement:** REQ-DEPLOY-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở `./` → chờ mạng yên → mở ô 40
- **Mong đợi:** không request cùng host nào nằm ngoài path của baseURL; ô mở được (script dưới base path đã chạy)
- **Automated:** `tests/e2e/deploy/static-export.e2e.ts`
