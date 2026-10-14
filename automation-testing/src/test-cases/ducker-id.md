# DUCKERID — Test cases

Requirement: `docs/requirements/ducker-id.md` · quyết định: `docs/decisions/ducker-id.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. TC-DUCKERID-001 chạy trên
bản cờ tắt (project `app`); còn lại trên bản cờ bật (project `app-auth`, viewport 1024×768) với `fakeIssuer`.

### TC-DUCKERID-001 — cờ tắt thì không có nút đăng nhập, không chạm storage, không request ra ngoài

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./?seed=20260903&code=x&state=y` trên bản deploy
- **Mong đợi:** 81 ô; không nút "Đăng nhập", không nút tài khoản; `sessionStorage` rỗng; `?code=x` vẫn trên URL; không request ra ngoài
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-002 — đăng nhập: thấy tài khoản, URL sạch, tham số game còn nguyên; đăng xuất trả lại nút

- **Requirement:** REQ-DUCKERID-02, REQ-DUCKERID-03, REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** `./?seed=20260903` → "Đăng nhập" → mở menu → "Đăng xuất"
- **Mong đợi:** nút tài khoản hiện; URL còn `seed=20260903`, không `code=`/`state=`; menu có tên, email, link hồ sơ
  `http://ducker.test/profile`; sau đăng xuất nút "Đăng nhập" hiện và có focus; không lỗi hydration trên console
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-003 — Esc đóng menu tài khoản và trả focus về nút tài khoản

- **Requirement:** REQ-DUCKERID-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đăng nhập → mở menu → Esc
- **Mong đợi:** menu biến mất; nút tài khoản có focus
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-004 — đã đăng nhập vẫn chơi được như thường

- **Requirement:** REQ-DUCKERID-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** đăng nhập → mở ô 40 → cắm cờ ô 0
- **Mong đợi:** ô 40 "trống"; `009`
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-005 — hồ sơ chỉ nằm trong bộ nhớ: tải lại là chưa đăng nhập, storage không giữ gì

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** đăng nhập → đọc `localStorage` + `sessionStorage` → tải lại
- **Mong đợi:** không chỗ nào chứa email; không còn `ducker.pkce`; sau tải lại nút "Đăng nhập" hiện
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-006 — từ chối ở Ducker ID thì về chưa đăng nhập, URL sạch, tham số game còn

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** issuer trả `error=access_denied` → "Đăng nhập"
- **Mong đợi:** nút "Đăng nhập" hiện; URL còn `seed=`, không `error`/`state=`
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-007 — state bị sửa thì về chưa đăng nhập và không bao giờ gọi tới token

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** issuer trả về `state=tampered` → "Đăng nhập"
- **Mong đợi:** chưa đăng nhập; URL sạch; token endpoint 0 lần
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-008 — issuer treo thì sau tối đa 15 giây về lại chưa đăng nhập

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** token endpoint không trả lời → "Đăng nhập"
- **Mong đợi:** token được gọi đúng 1 lần; nút "Đăng nhập" (tên chính xác) hiện lại trong 20 giây; URL sạch
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-009 — sessionStorage bị chặn thì bấm đăng nhập không đưa đi đâu cả

- **Requirement:** REQ-DUCKERID-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Tiền điều kiện:** truy cập `sessionStorage` ném `SecurityError`
- **Bước:** "Đăng nhập"
- **Mong đợi:** không request nào tới issuer; vẫn ở trang có `seed=`; nút "Đăng nhập" vẫn bật
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-010 — nút đăng nhập rộng ít nhất 44px và không đè lên nút bên cạnh

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** mở trang (chưa đăng nhập) → đo
- **Mong đợi:** ≥ 44×44; không giao với nút sáng/tối và cài đặt; nằm trước nút sáng/tối; trang không cuộn ngang
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-011 — menu tài khoản nằm trọn trong màn hình và không làm header nhảy

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** mỗi test một bề rộng 320 / 360 / 375 → đăng nhập → đo header → mở menu
- **Mong đợi:** menu trong `[0, width]`; hộp header không đổi
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-012 — header chưa đăng nhập vừa 320px: không đè, không cuộn ngang, nút 44px

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** 320×720 → đo nút đăng nhập, sáng/tối, cài đặt, tên game
- **Mong đợi:** ba nút ≥ 44×44, nối tiếp không chồng; tên game trước nút đầu, một dòng (< 30px); trang không cuộn ngang
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`
