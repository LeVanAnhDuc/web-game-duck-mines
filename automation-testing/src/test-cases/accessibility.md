# ACCESSIBILITY — Test cases

Requirement: `docs/requirements/accessibility.md` · quyết định: `docs/decisions/accessibility.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Bàn `?seed=20260903`.

### TC-ACCESSIBILITY-001 — mũi tên đi dọc một hàng và vòng focus đi theo, luôn nhìn thấy được

- **Requirement:** REQ-ACCESSIBILITY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** vào bàn → → ×8 → ↓ → ← → ↑
- **Mong đợi:** focus ở ô 8, rồi 17, rồi 7; ô 7 có outline khác `none`, rộng ≥ 2px
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-002 — con trỏ dừng ở mép bàn, không quấn sang hàng khác

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** ở ô 0 bấm ← và ↑; đi tới ô 80 bấm → và ↓
- **Mong đợi:** vẫn ô 0; vẫn ô 80
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-003 — Home và End nhảy tới đầu và cuối hàng

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** con trỏ ở ô 40 → End → Home
- **Mong đợi:** ô 44 → ô 36
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-004 — F cắm cờ, Space mở, R bắt đầu bàn mới

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ô 0 bấm F → con trỏ tới ô 40 bấm Space → bấm R
- **Mong đợi:** ô 0 "đã cắm cờ", `009`; ô 40 "trống"; sau R không ô nào mở, `010`
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-005 — Enter trên ô số đã đủ cờ mở các ô xung quanh

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Tiền điều kiện:** mìn biết qua `learnMines`; cắm cờ đúng quanh một ô số còn ô an toàn chưa mở
- **Bước:** con trỏ tới ô số → Enter
- **Mong đợi:** mọi ô an toàn kề đã mở
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-006 — phím mũi tên không cuộn trang khỏi bàn cờ

- **Requirement:** REQ-ACCESSIBILITY-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Tiền điều kiện:** cửa sổ thấp (1024×500) để trang cuộn được
- **Bước:** vào bàn → ↓ ×10 → Space
- **Mong đợi:** `scrollY` không đổi
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-007 — cả bàn cờ là một điểm dừng Tab duy nhất

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** đọc các ô `tabindex=0` → → ↓ → đọc lại → Tab
- **Mong đợi:** chỉ ô 0, rồi chỉ ô 10; sau Tab không ô nào giữ focus
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-008 — mỗi ô nói vị trí và trạng thái của nó cho trình đọc màn hình

- **Requirement:** REQ-ACCESSIBILITY-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** bàn Dễ: đọc grid + ô 0, 80; cắm cờ ô 10; mở ô 40; bàn mới → Khó: đọc grid + ô 479
- **Mong đợi:** grid 9×9 rồi 16×30; tên "hàng 1, cột 1, chưa mở", "hàng 9, cột 9, chưa mở", "hàng 2, cột 2, đã cắm cờ",
  "hàng 16, cột 30, chưa mở"; mọi ô có tên thuộc tập trạng thái đã biết, có ô số
- **Automated:** `tests/e2e/accessibility/perception.e2e.ts`

### TC-ACCESSIBILITY-009 — bỏ hết màu thì mọi chữ số vẫn đọc được

- **Requirement:** REQ-ACCESSIBILITY-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở ô 40 → áp `filter: grayscale(1)` lên trang
- **Mong đợi:** mỗi ô số hiện đúng chữ số của nó dưới dạng chữ
- **Automated:** `tests/e2e/accessibility/perception.e2e.ts`

### TC-ACCESSIBILITY-010 — ô chưa mở và ô đã mở phân biệt bằng viền, không chỉ bằng độ sáng

- **Requirement:** REQ-ACCESSIBILITY-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở ô 40 → đọc viền một ô chưa mở và ô 40
- **Mong đợi:** ô chưa mở viền `solid` ≥ 1px; ô đã mở viền 0
- **Automated:** `tests/e2e/accessibility/perception.e2e.ts`

### TC-ACCESSIBILITY-011 — người dùng muốn giảm chuyển động thì ô không còn hiệu ứng chuyển

- **Requirement:** REQ-ACCESSIBILITY-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** đọc `transition-duration` của ô → bật `reducedMotion: reduce` → đọc lại cùng `animation-duration`
- **Mong đợi:** trước > 0; sau tất cả = 0
- **Automated:** `tests/e2e/accessibility/perception.e2e.ts`

### TC-ACCESSIBILITY-012 — trang nói cách chơi bằng bàn phím, chuột phải và chord

- **Requirement:** REQ-ACCESSIBILITY-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** mở trang
- **Mong đợi:** dòng gợi ý có câu về phím, chuột phải cắm cờ, và chord (bấm ô số hoặc chuột giữa)
- **Automated:** `tests/e2e/accessibility/perception.e2e.ts`
