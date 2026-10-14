# CUSTOMBOARD — Test cases

Requirement: `docs/requirements/custom-board.md` · quyết định: `docs/decisions/custom-board.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Bàn `?seed=20260903`.

### TC-CUSTOMBOARD-001 — bàn tuỳ chỉnh dựng đúng số cột, hàng, mìn đã đặt

- **Requirement:** REQ-CUSTOMBOARD-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** cài đặt → Tuỳ chỉnh → cột 7, hàng 6, mìn 5 → đóng
- **Mong đợi:** 42 ô, lưới 7×6; bộ đếm `005`; nhãn `Tuỳ chỉnh: 7×6, 5 mìn · không tính kỷ lục`
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-002 — chọn Tuỳ chỉnh là thấy ngay bàn này không ghi kỷ lục, trước nước đầu

- **Requirement:** REQ-CUSTOMBOARD-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** cài đặt → Tuỳ chỉnh → đóng
- **Mong đợi:** trong cài đặt dòng "Bàn tự đặt không ghi kỷ lục…", Tuỳ chỉnh được chọn; trên nhãn bàn có "không tính kỷ lục"; đồng hồ `0:00`
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-003 — trần mìn và mật độ hiện ngay lúc nhập

- **Requirement:** REQ-CUSTOMBOARD-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** Tuỳ chỉnh (mặc định 16×16·40) → gõ cột 5, hàng 5 (chưa rời ô)
- **Mong đợi:** ban đầu "Nhiều nhất 247 mìn…", "Mật độ mìn 16% (mức Khó là 21%)", ô Mìn `max=247`; sau khi gõ: "Nhiều nhất 16 mìn…", `max=16`
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-004 — số mìn vượt trần bị kẹp về cột × hàng − 9 khi rời ô

- **Requirement:** REQ-CUSTOMBOARD-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** 5×5, mìn 900, rời ô → đóng
- **Mong đợi:** ô Mìn `16`; bộ đếm `016`
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-005 — gõ một số hai chữ số từng phím không bị sửa giữa chừng

- **Requirement:** REQ-CUSTOMBOARD-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** xoá ô Cột → gõ `2` → gõ `4` → rời ô
- **Mong đợi:** `2` (không bị kéo lên 5) → `24` → vẫn `24`
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-006 — giá trị ngoài biên bị kẹp về biên khi rời ô

- **Requirement:** REQ-CUSTOMBOARD-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** mỗi test một giá trị: cột 4, cột 41, hàng 4, hàng 31, mìn 0 → rời ô
- **Mong đợi:** lần lượt 5, 40, 5, 30, 1
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-007 — ô để trống khi rời ô quay về một giá trị hợp lệ

- **Requirement:** REQ-CUSTOMBOARD-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** xoá trắng ô Hàng → rời ô → đóng
- **Mong đợi:** ô Hàng có giá trị 5–30, và bàn có đúng số hàng đó (decisions Q1)
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-008 — bàn tuỳ chỉnh chơi được: nước đầu an toàn

- **Requirement:** REQ-CUSTOMBOARD-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** bàn 12×8·30 → bấm ô giữa (hàng 5, cột 7)
- **Mong đợi:** ô đó trống, không thua
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-009 — thắng bàn tuỳ chỉnh không ghi kỷ lục và không chúc mừng

- **Requirement:** REQ-CUSTOMBOARD-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** bàn tuỳ chỉnh 9×9·10 (cùng kích thước bàn Dễ) → thắng → đóng → cài đặt
- **Mong đợi:** "Dọn sạch bàn" không kèm "Nhanh nhất…"; kỷ lục cả ba mức `—`
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-010 — bàn tuỳ chỉnh còn nguyên sau khi tải lại

- **Requirement:** REQ-CUSTOMBOARD-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** bàn 12×8·20 → tải lại
- **Mong đợi:** 96 ô; `020`; nhãn "không tính kỷ lục"
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-011 — chuyển sang Tuỳ chỉnh giữa ván thì hỏi trước

- **Requirement:** REQ-CUSTOMBOARD-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** mở ô 40 → cài đặt → Tuỳ chỉnh → "Bỏ bàn"
- **Mong đợi:** câu "Bỏ bàn đang chơi để sang mức Tuỳ chỉnh?"; vẫn 81 ô trước khi trả lời; sau đó 256 ô (16×16)
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`

### TC-CUSTOMBOARD-012 — sửa cấu hình bàn tuỳ chỉnh giữa ván thì hỏi trước khi bỏ bàn

- **Requirement:** REQ-CUSTOMBOARD-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** bàn 10×10·10 → mở một ô → cài đặt → đổi cột thành 12 → rời ô
- **Mong đợi:** câu hỏi bỏ bàn hiện; bàn đang chơi chưa bị thay
- **Automated:** `tests/e2e/custom-board/custom-fields.e2e.ts`
