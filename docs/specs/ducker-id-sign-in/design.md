# Thiết kế · feature `ducker-id-sign-in`

**Liên quan:** FR-19 · US-06 · NFR-DATA-04 · NFR-REL-04 · NFR-I18N-01 · NFR-A11Y-05
· [ADR-0013](../../decisions/0013-ducker-id-sign-in.md)
· Spec chung: `web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`

Phần riêng của repo này; hành vi chung (trạng thái, callback, cấu hình) ở spec chung.

## 1. Chỗ đặt và giao diện

- **Chỗ:** `src/views/Home/mains/Header`, trong `.ms-header-actions`, trước nút sáng/tối.
- **Nút:** `.ms-iconbtn` chỉ có biểu tượng (Lucide `LogIn`, 20px, stroke 2), bo 10, vùng
  bấm `--tap-min` 44px, `aria-label` "Đăng nhập" ("Đang đăng nhập…" và `disabled` khi đang đổi code).
- **Đã đăng nhập:** avatar tròn 32px trong cùng nút (ảnh, hoặc chữ cái đầu của tên/email).
  Menu `role="menu"`: tên, email, "Mở hồ sơ Ducker ID" (tab mới, `noopener noreferrer`),
  "Đăng xuất". Không có tên thì email là dòng chính; không có email thì không có dòng email.
- **Không màu:** `MASTER.md` §0 — thành phần ngoài bàn cờ có màu là sai. Avatar và popover
  chỉ dùng `--bg-*`/`--fg-*`/`--edge-cell-tile`; không hex (bất biến #9); không chữ hoa toàn
  phần; không chuỗi meta nối bằng chấm giữa; chuyển động `--motion-ui` (0 khi giảm chuyển động).
  Không thêm token nên bài kiểm đối xứng sáng/tối không đổi.
- **Bàn phím:** mũi tên lên/xuống/Home/End di chuyển giữa các mục; Esc đóng và trả focus
  cho nút; Tab hoặc focus rời menu thì đóng mà không giật focus; sau "Đăng xuất" focus về nút "Đăng nhập".

## 2. Tệp

| Tệp | Việc |
| --- | --- |
| `src/auth/constants.ts` | `readDuckerConfig`, `DUCKER_CONFIG`, `appRootPath` |
| `src/auth/duckerAuth.ts` | `startLogin` (chống bấm đúp, bfcache), `consumeCallback`, `captureCallback`, `settleCallbackUrl` |
| `src/auth/requests.ts` | đổi code, lấy hồ sơ (timeout 15s, kiểm dạng) |
| `src/auth/duckerSession.ts` | store ngoài, một lần đổi code mỗi lần mở trang |
| `src/hooks/useDuckerAuth.ts`, `useAccountMenu.ts` | nối store và hành vi menu |
| `src/views/Home/components/AccountButton` | UI |
| `src/lib/strings.ts` | `strings.account.*` (NFR-I18N-01) |

`src/auth/types.ts` thay cho `src/types/Auth` vì R-14 của `code-conventions.md` bác `src/types/`.

## 3. Ngoại lệ NFR

Theo ADR-0013: `ducker.pkce` trong `sessionStorage` và mạng tới issuer (và URL ảnh đại
diện nó trả về), chỉ sau khi bấm đăng nhập; cờ tắt thì không có gì.

## 4. Kiểm

Unit: cấu hình, PKCE (vector RFC 7636), callback, store, request, initials. Component:
`AccountButton`. e2e: `ducker-id-sign-in.spec.ts` (export bật cờ, issuer giả, cổng 4391) và
`ducker-id-flag-off.spec.ts` (không nút, không request ngoài).
