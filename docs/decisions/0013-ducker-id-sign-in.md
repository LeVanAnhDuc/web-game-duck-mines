# ADR-0013 · Đăng nhập Ducker ID tuỳ chọn, sau cờ tính năng, chỉ danh tính

> **Ngày:** 2026-10-04
> **Trạng thái:** accepted
> **Liên quan:** FR-19 · US-06 · NFR-DATA-04 · NFR-REL-04 · invariants #10

## 1. Bối cảnh

Người dùng yêu cầu (04.10.2026) cả 11 game của workspace có đăng nhập Ducker ID tuỳ
chọn như `web-app-calculate-badminton`: OIDC Authorization Code + PKCE, public client.
Chỉ **danh tính** (nút, avatar, tên, email, mở hồ sơ, đăng xuất); kỷ lục, lưu, cài đặt
không đổi. Tính năng chưa ra mắt: mã vào `main` nhưng bản GitHub Pages không có nó.

## 2. Quyết định

Mã nằm trọn trong `src/auth/` (cấu hình, PKCE, bắt callback, request, store ngoài) cộng
`AccountButton` ở header. Chỉ hiện khi `NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN` đúng bằng
`true` **và** đủ bốn biến Ducker ID; không có giá trị mặc định nào trong mã. `deploy.yml`
không truyền cờ nên bản deploy "tắt tối". `GITHUB_PAGES` thay bằng `NEXT_PUBLIC_BASE_PATH`.
Hồ sơ chỉ giữ trong bộ nhớ; tải lại trang là chưa đăng nhập.

**Ngoại lệ có giới hạn cho NFR (không phải bỏ NFR):** sessionStorage khoá `ducker.pkce` và không gì khác, xoá ngay khi người chơi quay về; mạng chỉ tới issuer đã cấu hình, và tới URL ảnh đại diện nó trả về, chỉ sau khi người chơi bấm đăng nhập; cờ tắt thì không có gì. Cụ thể: `NFR-DATA-04`
(thêm `ducker.pkce` vào danh sách được phép) và "không gọi mạng sau khi tải trang"
(`nfr.md`, `NFR-REL-04`, `architecture.md`). Khoá PKCE là `sessionStorage` của phiên đăng
nhập, **không** đi qua `game/storage/safeStorage.ts` vì không phải dữ liệu game.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Lưu hồ sơ/token vào `localStorage` | Phải xoá, phải hết hạn, và là PII mới; reload = chưa đăng nhập là đủ cho "chỉ danh tính" |
| Thư viện OIDC | Thêm phụ thuộc cho ~200 dòng; không thêm dependency nào |
| Gói dùng chung giữa các game | Workspace cố ý không chia sẻ mã giữa repo |
| Bật cờ trên bản deploy | Chưa đăng ký client ở Ducker ID; chưa ra mắt |

## 4. Hệ quả

**Được:** tuỳ chọn thật, tắt thật (không request, không storage, không đọc URL); đổi
cấu hình bằng biến môi trường, không sửa mã.

**Mất / phải chấp nhận:**
- Ba chỗ NFR có ngoại lệ có giới hạn, và bài kiểm "không request ngoài" phải nhớ rằng
  nó chỉ đúng khi cờ tắt (e2e `ducker-id-flag-off`).
- Không có dependency mới. e2e có thêm một export bật cờ (`pnpm build:e2e-auth`,
  `out-auth/`, cổng 4391) với issuer giả `http://ducker.test`.
- **Nợ phát hành:** commit mang `[skip release]` và `release.yml` quét cả đoạn từ tag
  cuối, nên mọi push sau đó cũng bị bỏ qua cho tới khi có tag mới. Lần phát hành thật
  kế tiếp phải cắt tay một lần: `pnpm release:next` → `git tag vX.Y.Z && git push origin
  vX.Y.Z` → `gh release create vX.Y.Z --notes "$(pnpm -s release:notes)"`; sau đó đoạn
  sạch và tự động chạy lại.
