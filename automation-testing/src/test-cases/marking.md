# MARKING — Test cases

Requirement: `docs/requirements/marking.md` · quyết định: `docs/decisions/marking.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Bàn `?seed=20260903`.

### TC-MARKING-001 — chuột phải cắm cờ mà không mở menu của trình duyệt

- **Requirement:** REQ-MARKING-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** phát sự kiện `contextmenu` lên ô 0
- **Mong đợi:** sự kiện bị `preventDefault`; ô 0 "đã cắm cờ"; bộ đếm `009`
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-002 — chuột phải lần nữa gỡ cờ khi dấu hỏi đang tắt

- **Requirement:** REQ-MARKING-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** chuột phải ô 0 hai lần
- **Mong đợi:** ô 0 "chưa mở"; bộ đếm `010`
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-003 — ô đã cắm cờ không mở khi lỡ bấm chuột trái

- **Requirement:** REQ-MARKING-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** cắm cờ ô 40 → bấm chuột trái ô 40
- **Mong đợi:** không ô nào mở; ô 40 vẫn "đã cắm cờ"; đồng hồ vẫn `0:00`
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-004 — không cắm cờ được lên ô đã mở

- **Requirement:** REQ-MARKING-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** mở ô 40 → chuột phải ô 40
- **Mong đợi:** ô 40 vẫn "trống"; bộ đếm `010`
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-005 — bật dấu hỏi thì chu kỳ là cờ, dấu hỏi, rồi trống; dấu hỏi không trừ bộ đếm

- **Requirement:** REQ-MARKING-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** cài đặt → bật "Dấu hỏi trong chu kỳ cờ" → chuột phải ô 0 ba lần
- **Mong đợi:** lần lượt "đã cắm cờ" (`009`) → "đánh dấu chưa chắc" (`010`) → "chưa mở"
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-006 — ô mang dấu hỏi vẫn mở được bằng chuột trái

- **Requirement:** REQ-MARKING-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** bật dấu hỏi → đặt dấu hỏi lên ô 40 → bấm chuột trái ô 40
- **Mong đợi:** ô 40 mở ("trống" — nước đầu)
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-007 — tắt dấu hỏi giữa ván không để ô nào kẹt ở trạng thái lạ

- **Requirement:** REQ-MARKING-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** bật dấu hỏi → ô 0 thành dấu hỏi → tắt dấu hỏi → chuột phải ô 0 ba lần
- **Mong đợi:** sau khi tắt, ô 0 vẫn "đánh dấu chưa chắc"; rồi "chưa mở" → "đã cắm cờ" → "chưa mở"
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-008 — cắm nhiều cờ hơn số mìn thì bộ đếm xuống số âm

- **Requirement:** REQ-MARKING-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** cắm cờ ô 0…9 (bộ đếm `000`) → ô 10 → ô 11
- **Mong đợi:** `000` → `−001` → `−002` (U+2212)
- **Automated:** `tests/e2e/marking/flags.e2e.ts`

### TC-MARKING-009 — bấm chuột trái lên ô số đã đủ cờ đúng mở mọi ô kề chưa cắm cờ

- **Requirement:** REQ-MARKING-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Tiền điều kiện:** vị trí mìn biết qua `learnMines`; một ô số đã mở có ô an toàn kề chưa mở (decisions Q4)
- **Bước:** cắm cờ đúng mọi mìn kề ô số → bấm chuột trái lên ô số
- **Mong đợi:** mọi ô an toàn kề đã mở; không thua
- **Automated:** `tests/e2e/marking/chord.e2e.ts`

### TC-MARKING-010 — chuột giữa lên ô số đã đủ cờ cũng mở quanh

- **Requirement:** REQ-MARKING-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** như TC-MARKING-009 nhưng bấm chuột giữa
- **Mong đợi:** mọi ô an toàn kề đã mở
- **Automated:** `tests/e2e/marking/chord.e2e.ts`

### TC-MARKING-011 — ô số chưa đủ cờ thì bấm vào không mở gì và không nổ

- **Requirement:** REQ-MARKING-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** cắm thiếu một cờ quanh ô số → bấm ô số
- **Mong đợi:** trạng thái mọi ô không đổi; không dialog kết quả
- **Automated:** `tests/e2e/marking/chord.e2e.ts`

### TC-MARKING-012 — đủ số cờ nhưng cắm sai chỗ thì chord làm nổ

- **Requirement:** REQ-MARKING-09
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** cắm đủ số cờ lên các ô **an toàn** kề ô số → bấm ô số
- **Mong đợi:** dialog kết quả hiện (thua); một mìn kề là "mìn đã nổ"; các cờ đã cắm là "cờ cắm sai"
- **Automated:** `tests/e2e/marking/chord.e2e.ts`

### TC-MARKING-013 — chord không mở các ô đang cắm cờ

- **Requirement:** REQ-MARKING-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** như TC-MARKING-009
- **Mong đợi:** các ô cắm cờ vẫn "đã cắm cờ" sau chord
- **Automated:** `tests/e2e/marking/chord.e2e.ts`
