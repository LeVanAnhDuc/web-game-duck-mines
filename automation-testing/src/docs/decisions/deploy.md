# DEPLOY — Quyết định

Đi cặp với `docs/requirements/deploy.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-15), `docs/03-design/architecture.md`, `README.md` §"What runs on GitHub".
- **Code:** `client/next.config.ts` (`output: "export"`, `basePath` / `assetPrefix` từ `NEXT_PUBLIC_BASE_PATH`,
  `trailingSlash`), `.github/workflows/deploy.yml` (build với `NEXT_PUBLIC_BASE_PATH=/<repo>`, đăng `client/out`).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Base path kiểm ở đâu? → Cùng spec chạy hai nơi: dev (gốc `/`, bản build tại chỗ) và `ENV=prd` (GitHub Pages dưới
  `/web-game-duck-mines/`). Đã chạy `ENV=prd` ngày 2026-10-15: xanh. CI chỉ chạy dev; prd là lệnh tay sau deploy.
- **Q2** Không dựng thêm một bản build có base path trong CI chỉ để test: deploy workflow đã build đúng bản đó, và
  `ENV=prd` kiểm chính thứ được đăng.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Workflow deploy tự nó (xem `gh run list` sau khi merge).

## Tech debt liên quan

_(không có)_
