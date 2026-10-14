# DUCKERID — Quyết định

Đi cặp với `docs/requirements/ducker-id.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-19), `docs/01-product/journeys.md` (US-06 + "Điều gì có thể sai"),
  `docs/decisions/0013-ducker-id-sign-in.md`, `docs/specs/ducker-id-sign-in/design.md`, `docs/03-design/invariants.md`
  (#10), `docs/02-requirements/nfr.md` (NFR-DATA-04 ngoại lệ có giới hạn), `README.md` §"Ducker ID sign-in".
- **Code:** `client/src/auth/` (`constants.ts` cờ + 4 biến, `duckerAuth.ts` PKCE / callback / `settleCallbackUrl`,
  `requests.ts` `AbortSignal.timeout(15s)`), `client/src/hooks/useDuckerAuth.ts`, `client/src/hooks/useAccountMenu.ts`,
  `client/src/views/Home/components/AccountButton/index.tsx`, `client/scripts/build-e2e-auth.mjs` (bản cờ bật, issuer
  giả `http://ducker.test`, client `e2e-client`).
- **Test đã gom (gợi ý):** `src/tests/e2e/ducker-id/flag-off.e2e.ts` và `src/tests/e2e/ducker-id/sign-in.e2e.ts` (từ
  `client/e2e/ducker-id-*.spec.ts`) — chuẩn hoá tại chỗ; issuer giả tách thành fixture `fakeIssuer`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Ducker ID thật không dùng: test chạy trên bản cờ bật với issuer giả, mọi request tới nó do fixture `fakeIssuer` trả
  lời (ADR-0013 đã chọn cách này cho bộ cũ). Không tài khoản thật, không mạng thật.
- **Q2** "Issuer treo" (US-06): token endpoint không bao giờ trả lời; client dùng `AbortSignal.timeout` (đồng hồ thật của
  trình duyệt, `page.clock` không tua được) → test chờ thật tới 20 giây. Chấp nhận một test chậm cho một hứa hẹn có thật.
- **Q3** Nút "Đăng nhập" khớp tên **chính xác**: nhãn lúc đang đi là "Đang đăng nhập…", chứa "đăng nhập"; khớp theo chuỗi con
  làm test issuer treo xanh giả (đã gặp khi chạy lần đầu).
- **Q4** "Mở tab thứ hai giữa chừng", "Bấm đúp", "quay lại bằng nút Back" (US-06) → ngoài phạm vi tự động lần này: cần điều
  phối hai tab / lịch sử trình duyệt quanh một redirect giả, và unit test `client/src/auth/duckerAuth.test.ts` đã phủ cờ
  `starting` và phiên chờ cũ. Ghi lại để bổ sung.
- **Q5** Bản cờ tắt chạy ở project `app` (bản deploy), bản cờ bật ở `app-auth` (chỉ có trên dev: prd là bản deploy, cờ tắt).

## Tài khoản test

Không có tài khoản thật. Người dùng giả của issuer giả: `DUCKER.user` trong `src/data/test-data.ts`.

## Ngoài phạm vi

- Ảnh đại diện từ issuer (NFR-DATA-04 cho phép tải URL ảnh) — issuer giả không trả `picture`.
- Đăng nhập với Ducker ID thật ở `localhost:3300` (README) — thử tay.

## Tech debt liên quan

- Q4: ba tình huống US-06 chưa tự động hoá.
