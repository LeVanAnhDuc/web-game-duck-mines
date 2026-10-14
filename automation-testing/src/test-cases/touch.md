# TOUCH — Test cases

Requirement: `docs/requirements/touch.md` · quyết định: `docs/decisions/touch.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Project `app-touch`
(Pixel 5), bàn `?seed=20260903`, đồng hồ giả cho các pha của ngón.

### TC-TOUCH-001 — chạm vào ô là mở ô

- **Requirement:** REQ-TOUCH-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** chạm ô 40
- **Mong đợi:** ô 40 "trống", hơn một ô đã mở
- **Automated:** `tests/e2e/touch/gestures.e2e.ts`

### TC-TOUCH-002 — thanh Mở/Cờ có trên màn cảm ứng, và ở chế độ Cờ chạm là cắm cờ

- **Requirement:** REQ-TOUCH-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** kiểm thanh chế độ → chạm "Cờ" → chạm ô 0
- **Mong đợi:** thanh hiện, "Mở" được chọn; sau đó "Cờ" được chọn; ô 0 "đã cắm cờ", `009`
- **Automated:** `tests/e2e/touch/gestures.e2e.ts`

### TC-TOUCH-003 — ở chế độ Cờ, chạm vào ô số đã mở vẫn mở quanh nó

- **Requirement:** REQ-TOUCH-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Tiền điều kiện:** mìn biết qua `learnMines`
- **Bước:** chạm ô 40 → chế độ Cờ → chạm cắm cờ đúng các mìn quanh một ô số → chạm ô số
- **Mong đợi:** mọi ô an toàn kề đã mở
- **Automated:** `tests/e2e/touch/gestures.e2e.ts`

### TC-TOUCH-004 — giữ ngón: khung nhắm hiện phía trên ngón, giữ tiếp thì cắm cờ mà không cần nhấc

- **Requirement:** REQ-TOUCH-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** đặt ngón lên một ô chưa mở → ENGAGE_MS+50ms → FLAG_MS → nhấc
- **Mong đợi:** khung nhắm hiện, đáy khung ở trên điểm chạm; rồi ô "đã cắm cờ", `009`; sau khi nhấc vẫn là cờ
- **Automated:** `tests/e2e/touch/gestures.e2e.ts`

### TC-TOUCH-005 — nhắm sai thì trượt ngón sang ô đúng rồi nhấc: chỉ ô đúng được mở

- **Requirement:** REQ-TOUCH-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đặt ngón lên ô an toàn A → chờ khung nhắm → trượt sang ô an toàn B kề bên → nhấc trên B
- **Mong đợi:** B đã mở; A vẫn "chưa mở"
- **Automated:** `tests/e2e/touch/gestures.e2e.ts`

### TC-TOUCH-006 — nhấc ngón ra ngoài bàn là huỷ: không ô nào mở, không cờ nào cắm

- **Requirement:** REQ-TOUCH-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** đặt ngón lên ô → chờ khung nhắm → trượt lên header → nhấc ở đó
- **Mong đợi:** trạng thái mọi ô không đổi; khung nhắm biến mất
- **Automated:** `tests/e2e/touch/gestures.e2e.ts`

### TC-TOUCH-007 — ngón kéo đi trước khi dừng lại là kéo bàn, không mở ô

- **Requirement:** REQ-TOUCH-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** đặt ngón → trượt 40px (quá ngưỡng 10px) trước ENGAGE_MS → nhấc
- **Mong đợi:** trạng thái mọi ô không đổi
- **Automated:** `tests/e2e/touch/gestures.e2e.ts`

### TC-TOUCH-008 — bàn Khó trên điện thoại cuộn trong khung riêng, trang không bao giờ cuộn ngang

- **Requirement:** REQ-TOUCH-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** chọn Khó
- **Mong đợi:** trang tràn ngang ≤ 0; khung bàn tràn ngang > 0
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`

### TC-TOUCH-009 — mọi ô giữ được cạnh tối thiểu 22px

- **Requirement:** REQ-TOUCH-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** chọn Khó → đo ô 0, 239, 479
- **Mong đợi:** rộng và cao ≥ 22px (dung sai 0.5px làm tròn)
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`

### TC-TOUCH-010 — kéo ngón trên bàn thì bàn trượt theo mà không ô nào mở

- **Requirement:** REQ-TOUCH-05, REQ-TOUCH-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** bàn Khó → kéo touch thật (CDP) từ phải sang trái trong khung
- **Mong đợi:** `scrollLeft` của khung tăng; không ô nào mở; `099`
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`

### TC-TOUCH-011 — bàn tuỳ chỉnh lớn nhất pan được theo cả hai chiều

- **Requirement:** REQ-TOUCH-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** bàn tuỳ chỉnh 40×30·99
- **Mong đợi:** khung tràn ngang và dọc > 0; trang tràn ngang ≤ 0
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`

### TC-TOUCH-012 — thanh Mở/Cờ không che hàng ô cuối

- **Requirement:** REQ-TOUCH-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** bàn Khó → cuộn tới ô 450, 465, 479 (hàng cuối) → hỏi phần tử ở tâm ô
- **Mong đợi:** chính ô đó (không bị thanh chế độ đè)
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`

### TC-TOUCH-013 — bàn không vừa chiều dọc mà vừa khi xoay ngang thì gợi ý xoay ngang

- **Requirement:** REQ-TOUCH-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** viewport 390×844 → bàn Dễ → chọn Khó → xoay thành 844×390
- **Mong đợi:** Dễ: không gợi ý; Khó dọc: "Xoay ngang để thấy cả bàn."; khi đã xoay: hết gợi ý
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`

### TC-TOUCH-014 — không gợi ý xoay khi xoay cũng không vừa

- **Requirement:** REQ-TOUCH-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** viewport 390×844 → bàn tuỳ chỉnh 40 cột
- **Mong đợi:** không có gợi ý xoay
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`

### TC-TOUCH-015 — chạm hai lần nhanh không phóng to trang, kéo bàn không kéo theo trang

- **Requirement:** REQ-TOUCH-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** đọc `touch-action` của bàn và `overscroll-behavior-y` của khung
- **Mong đợi:** `manipulation`; `contain` (decisions Q4)
- **Automated:** `tests/e2e/touch/board-frame.e2e.ts`
