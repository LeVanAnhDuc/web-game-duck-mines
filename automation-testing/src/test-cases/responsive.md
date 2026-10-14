# RESPONSIVE — Test cases

Requirement: `docs/requirements/responsive.md` · quyết định: `docs/decisions/responsive.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Project `app` (Desktop
Chrome) đổi kích thước cửa sổ, bàn `?seed=20260903`.

### TC-RESPONSIVE-001 — trang không bao giờ cuộn ngang, kể cả bàn Khó

- **Requirement:** REQ-RESPONSIVE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** mỗi test một bề rộng 320 / 375 / 768 / 1024 / 1440 → bàn Dễ → bàn Khó
- **Mong đợi:** `scrollWidth − clientWidth` của trang ≤ 0 cả hai lần
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-002 — màn rộng thì bàn Khó hiện trọn, không cần kéo

- **Requirement:** REQ-RESPONSIVE-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** 1024×900 và 1440×900 → bàn Khó
- **Mong đợi:** khung bàn tràn ngang ≤ 0
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-003 — màn hẹp với bàn Khó: bộ đếm, đồng hồ và nút bàn mới vẫn nằm trong màn hình

- **Requirement:** REQ-RESPONSIVE-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** 375×720 → bàn Khó → kéo khung bàn tới góc cuối
- **Mong đợi:** ba phần tử HUD nằm trọn trong 375×720; `window.scrollX` = 0
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-004 — nút ở header rộng ít nhất 44px và không đè lên nhau ở 320px

- **Requirement:** REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** 320×720 → đo nút sáng/tối, cài đặt, bàn mới, tên game
- **Mong đợi:** ba nút ≥ 44×44; sáng/tối nằm trước cài đặt không chồng; tên game kết thúc trước nút sáng/tối
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-005 — cài đặt là tấm trượt từ đáy trên điện thoại, hộp thoại giữa màn từ 768px

- **Requirement:** REQ-RESPONSIVE-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** 375×720 mở cài đặt → đóng → 1024×900 mở cài đặt
- **Mong đợi:** ở 375 đáy dialog chạm đáy màn (±1px); ở 1024 dialog cách cả trên và dưới, tâm ngang ở giữa (±2px)
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-006 — có chuột thì không có thanh Mở/Cờ và không có gợi ý xoay

- **Requirement:** REQ-RESPONSIVE-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** cửa sổ desktop 390×844 → bàn Khó
- **Mong đợi:** thanh Mở/Cờ ẩn; không có gợi ý xoay
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-007 — dialog kết quả neo ở đáy, bàn vừa xong vẫn nhìn thấy phía trên

- **Requirement:** REQ-RESPONSIVE-07
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** 375×720 → thua bàn seed
- **Mong đợi:** nút "Bàn mới" của dialog ở nửa dưới màn; tâm ô mìn vừa nổ trả về chính ô đó (không bị dialog che)
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`
