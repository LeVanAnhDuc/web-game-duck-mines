# Kế hoạch hiện thực · feature `ducker-id-sign-in`

**Spec:** [`design.md`](design.md) · plan chung: `web-game/docs/superpowers/plans/2026-10-04-ducker-id-sign-in.md`

- [x] Task 0: worktree `.worktrees/ducker-id-sign-in`, baseline xanh
- [x] Task 1: biến môi trường, base path, `readDuckerConfig` (`GITHUB_PAGES` -> `NEXT_PUBLIC_BASE_PATH`)
- [x] Task 2: lõi PKCE, callback, request, store (kèm các bản vá review: returnTo, timeout, bfcache, kiểm hồ sơ, settle URL)
- [x] Task 3: `AccountButton`, hook, chuỗi, CSS không màu; đã xem ảnh ở 375/768/1440, sáng/tối
- [x] Task 4: e2e với issuer giả, export bật cờ riêng; e2e cờ tắt
- [x] Task 5: tài liệu (overview, NFR, invariants #10, FR-19, US-06, ADR-0013, README)
- [x] Task 6: gate đầy đủ, push, mở PR (không merge)
