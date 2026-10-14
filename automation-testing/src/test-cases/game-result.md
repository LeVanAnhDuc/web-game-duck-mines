# GAMERESULT — Test cases

Requirement: `docs/requirements/game-result.md` · quyết định: `docs/decisions/game-result.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Bàn `?seed=20260903`,
mìn biết qua `learnMines`, đồng hồ giả (`page.clock`).

### TC-GAMERESULT-001 — mở phải mìn thì thua: mọi mìn hiện ra, ô vừa nổ được đánh dấu

- **Requirement:** REQ-GAMERESULT-01, REQ-GAMERESULT-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** nước đầu ô 40 → mở một ô mìn
- **Mong đợi:** ô đó "mìn đã nổ"; các mìn khác "mìn"; dialog tên "Nổ rồi"; vùng thông báo "Nổ rồi"; focus ở "Bàn mới"
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-002 — thua thì cờ cắm sai bị gạch chéo, cờ đúng giữ nguyên, và dialog nói chỗ sai

- **Requirement:** REQ-GAMERESULT-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** cắm cờ lên một mìn và một ô an toàn → mở một mìn khác
- **Mong đợi:** cờ trên ô an toàn "cờ cắm sai"; cờ trên mìn "đã cắm cờ"; dialog có "Cờ bị gạch chéo là chỗ cắm sai."
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-003 — thua mà không cắm cờ sai thì dialog không nhắc cờ gạch chéo

- **Requirement:** REQ-GAMERESULT-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** mở một mìn khi không có cờ nào
- **Mong đợi:** dialog hiện, không có dòng về cờ gạch chéo
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-004 — sau khi thua bàn đóng băng: không mở, không cắm cờ được, đồng hồ dừng

- **Requirement:** REQ-GAMERESULT-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** nước đầu → 4 giây → mở mìn → đóng dialog → bấm và chuột phải một ô an toàn chưa mở → 10 giây trôi
- **Mong đợi:** trạng thái mọi ô không đổi; đồng hồ vẫn `0:04`
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-005 — mở hết ô không có mìn thì thắng, kể cả khi chưa cắm cờ nào

- **Requirement:** REQ-GAMERESULT-04, REQ-GAMERESULT-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** nước đầu → mở mọi ô an toàn còn lại, không cắm cờ
- **Mong đợi:** dialog tên "Dọn sạch bàn"; vùng thông báo "Dọn sạch bàn"; focus ở "Bàn mới"; không mìn nào nổ
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-006 — dialog kết quả nói ván đã mất bao lâu, và đồng hồ dừng ở đó

- **Requirement:** REQ-GAMERESULT-06, REQ-GAMERESULT-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** nước đầu → 7 giây → thắng → 5 giây nữa
- **Mong đợi:** dialog `0:07`; đồng hồ vẫn `0:07`
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-007 — đóng dialog bằng nút Đóng hoặc Esc giữ nguyên bàn vừa xong

- **Requirement:** REQ-GAMERESULT-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** thua → "Đóng"; chơi lại cùng bàn, thua → Esc
- **Mong đợi:** dialog biến mất cả hai lần; bàn đã xong vẫn nguyên trạng (không bị thay bằng bàn mới)
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-008 — dialog nằm trên bàn mà không thay bàn, và Bàn mới trên dialog bắt đầu ván mới

- **Requirement:** REQ-GAMERESULT-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** thua → kiểm bàn → bấm "Bàn mới" trên dialog
- **Mong đợi:** khi dialog mở bàn vẫn hiện đủ 81 ô; sau "Bàn mới" dialog đóng, mọi ô "chưa mở", đồng hồ `0:00`
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`

### TC-GAMERESULT-009 — thắng lần đầu ở một độ khó ghi kỷ lục cho đúng độ khó đó

- **Requirement:** REQ-GAMERESULT-08, REQ-GAMERESULT-09
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** chưa có kỷ lục → thắng bàn Dễ sau 7 giây → đóng → mở cài đặt
- **Mong đợi:** dialog "Nhanh nhất từ trước tới giờ"; kỷ lục Dễ `0:07`; Trung bình và Khó `—`
- **Automated:** `tests/e2e/game-result/records.e2e.ts`

### TC-GAMERESULT-010 — thắng chậm hơn hoặc bằng kỷ lục thì không ghi đè và không chúc mừng

- **Requirement:** REQ-GAMERESULT-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Tiền điều kiện:** kỷ lục Dễ 7 giây
- **Bước:** thắng sau đúng 7 giây (bằng kỷ lục)
- **Mong đợi:** không có dòng "Nhanh nhất…"; kỷ lục vẫn `0:07`
- **Automated:** `tests/e2e/game-result/records.e2e.ts`

### TC-GAMERESULT-011 — thắng nhanh hơn kỷ lục cũ thì ghi đè kỷ lục

- **Requirement:** REQ-GAMERESULT-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Tiền điều kiện:** kỷ lục Dễ 100 giây, Trung bình 50 giây
- **Bước:** thắng bàn Dễ sau 6 giây
- **Mong đợi:** dòng "Nhanh nhất…"; Dễ `0:06`; Trung bình vẫn `0:50` (độ khó khác không bị đụng)
- **Automated:** `tests/e2e/game-result/records.e2e.ts`

### TC-GAMERESULT-012 — kỷ lục còn nguyên sau khi tải lại trang

- **Requirement:** REQ-GAMERESULT-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** thắng sau 9 giây → tải lại → mở cài đặt
- **Mong đợi:** kỷ lục Dễ `0:09`
- **Automated:** `tests/e2e/game-result/records.e2e.ts`

### TC-GAMERESULT-013 — thắng thì mọi mìn còn lại tự hiện cờ và bộ đếm về 000

- **Requirement:** REQ-GAMERESULT-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** thắng mà không cắm cờ nào
- **Mong đợi:** mọi ô mìn "đã cắm cờ"; bộ đếm `000`
- **Automated:** `tests/e2e/game-result/win-lose.e2e.ts`
