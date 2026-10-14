# SETTINGS — Test cases

Requirement: `docs/requirements/settings.md` · quyết định: `docs/decisions/settings.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Bàn `?seed=20260903`.

### TC-SETTINGS-001 — cài đặt liệt kê ba mức kèm thông số và kỷ lục của từng mức

- **Requirement:** REQ-SETTINGS-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở cài đặt (chưa có kỷ lục)
- **Mong đợi:** Dễ `9×9 · 10 mìn` (đang chọn), Trung bình `16×16 · 40 mìn`, Khó `30×16 · 99 mìn`; kỷ lục ba mức `—`
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-002 — đổi mức khi chưa có nước nào thì đổi luôn, không hỏi

- **Requirement:** REQ-SETTINGS-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** mở cài đặt → Trung bình
- **Mong đợi:** không câu hỏi; 256 ô; bộ đếm `040`; nhãn `Trung bình: 16×16, 40 mìn`; Trung bình được chọn
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-003 — chỉ cắm cờ, chưa mở ô nào, thì đổi mức không hỏi

- **Requirement:** REQ-SETTINGS-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** cắm cờ ô 0 → cài đặt → Khó
- **Mong đợi:** không câu hỏi; 480 ô; bộ đếm `099`
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-004 — đổi mức giữa ván thì hỏi trước, câu hỏi nhận focus, Bỏ bàn mới đổi

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** mở ô 40 → cài đặt → Trung bình → "Bỏ bàn"
- **Mong đợi:** câu "Bỏ bàn đang chơi để sang mức Trung bình?"; focus ở "Bỏ bàn"; vẫn 81 ô trước khi trả lời; sau "Bỏ bàn"
  256 ô, `040`, `0:00`
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-005 — Giữ lại thì bàn đang chơi còn nguyên

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** mở ô 40, cắm cờ ô 0 → cài đặt → Khó → "Giữ lại" → đóng
- **Mong đợi:** câu hỏi biến mất; Dễ vẫn được chọn; trạng thái mọi ô như trước; bộ đếm `009`
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-006 — đóng cài đặt khi câu hỏi còn treo thì không đổi gì

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** mở ô 40 → cài đặt → Khó (câu hỏi hiện) → đóng → mở lại cài đặt
- **Mong đợi:** bàn không đổi; khi mở lại không còn câu hỏi, Dễ vẫn được chọn
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-007 — độ khó đã chọn còn nguyên ở lần tải trang sau

- **Requirement:** REQ-SETTINGS-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** chọn Khó → tải lại
- **Mong đợi:** 480 ô; `099`; nhãn `Khó: 30×16, 99 mìn`
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-008 — cài đặt đóng được bằng nút Đóng, phím Esc và bấm ra nền

- **Requirement:** REQ-SETTINGS-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** mở → "Đóng"; mở (kiểm focus) → Esc; mở → bấm góc nền
- **Mong đợi:** mỗi lần dialog cài đặt biến mất; khi mở, dialog nhận focus
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-009 — dấu hỏi mặc định tắt, bật được và còn bật sau khi tải lại

- **Requirement:** REQ-SETTINGS-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** cài đặt → kiểm công tắc → bật → tải lại → cài đặt
- **Mong đợi:** `aria-checked` false → true → vẫn true sau tải lại
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-010 — tiếng nổ mặc định tắt, bật được và còn bật sau khi tải lại

- **Requirement:** REQ-SETTINGS-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** như TC-SETTINGS-009 với "Tiếng khi mìn nổ"
- **Mong đợi:** false → true → vẫn true
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-011 — Xoá kỷ lục đưa cả ba mức về chưa có kỷ lục

- **Requirement:** REQ-SETTINGS-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Tiền điều kiện:** kỷ lục 12 / 80 / 300 giây
- **Bước:** cài đặt → kiểm → "Xoá kỷ lục"
- **Mong đợi:** trước: `0:12`, `5:00` (Khó); sau: cả ba `—`
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-012 — game vẫn chơi được đầy đủ và cài đặt nói rõ kỷ lục sẽ không được lưu

- **Requirement:** REQ-SETTINGS-09
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Tiền điều kiện:** truy cập `localStorage` ném `SecurityError`
- **Bước:** mở ô 40 → cắm cờ ô 0 → cài đặt → Khó → "Bỏ bàn"
- **Mong đợi:** ô mở được, `009`; dòng "Máy này không cho lưu…" hiện; đổi sang 480 ô; không có `alertdialog` nào khác
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-013 — thắng khi không lưu được thì không khoe kỷ lục

- **Requirement:** REQ-SETTINGS-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Tiền điều kiện:** như TC-SETTINGS-012
- **Bước:** thắng bàn seed
- **Mong đợi:** dialog "Dọn sạch bàn", không có "Nhanh nhất từ trước tới giờ"
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-014 — cài đặt nói thẳng rằng bàn có thể phải đoán ở nước cuối

- **Requirement:** REQ-SETTINGS-10
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** mở cài đặt
- **Mong đợi:** dòng "Bàn sinh theo luật gốc Minesweeper. Không đảm bảo lúc nào cũng suy ra được — nước cuối có thể phải đoán."
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-015 — tiếng tắt (mặc định) thì thua cũng không phát âm nào

- **Requirement:** REQ-SETTINGS-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** thua bàn seed với cài đặt mặc định
- **Mong đợi:** 0 `AudioContext`, 0 nguồn âm được start, 0 lần giải mã file
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`

### TC-SETTINGS-016 — bật tiếng thì thua phát tiếng nổ dựng bằng code

- **Requirement:** REQ-SETTINGS-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** bật tiếng → thua bàn seed
- **Mong đợi:** đúng 1 `AudioContext`; ít nhất 1 nguồn âm được start; 0 lần `decodeAudioData`
- **Automated:** `tests/e2e/settings/preferences.e2e.ts`
