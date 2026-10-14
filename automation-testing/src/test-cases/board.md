# BOARD — Test cases

Requirement: `docs/requirements/board.md` · quyết định: `docs/decisions/board.md`.
Lăng kính (CLAUDE.md, theo thứ tự): 1 truy vết · 2 phân vùng tương đương · 3 giá trị biên · 4 chuyển trạng thái ·
5 đoán lỗi / negative · 6 bảo mật & ngoài lề. Bàn cố định bằng `?seed=20260903` trừ khi ghi khác.

### TC-BOARD-001 — trang mở ra bàn Dễ 9×9 kín ô, đồng hồ 0:00 và 10 mìn cần tìm

- **Requirement:** REQ-BOARD-01, REQ-BOARD-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Tiền điều kiện:** trình duyệt mới, không localStorage
- **Bước:** mở `./?seed=20260903`
- **Mong đợi:** 81 ô đều "chưa mở"; đồng hồ `0:00`; bộ đếm `010`; nhãn `Dễ: 9×9, 10 mìn`
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-002 — nước đầu ở giữa bàn mở ra một vùng, không bao giờ nổ

- **Requirement:** REQ-BOARD-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Tiền điều kiện:** seed 1…20 (một test mỗi seed)
- **Bước:** bấm ô giữa (index 40)
- **Mong đợi:** ô 40 là ô trống; có hơn một ô đã mở; không dialog kết quả, vùng thông báo kết quả rỗng
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-003 — nước đầu ở ô góc vẫn an toàn và mở ra một vùng

- **Requirement:** REQ-BOARD-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Tiền điều kiện:** seed 3, 11, 29
- **Bước:** bấm ô góc dưới phải (index 80 — vùng loại trừ 3×3 bị cắt còn 2×2)
- **Mong đợi:** ô 80 là ô trống; cả 3 ô kề đều đã mở; không thua
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-004 — nước đầu trên bàn Khó 30×16 cũng an toàn

- **Requirement:** REQ-BOARD-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** cài đặt → Khó → đóng → bấm ô 240
- **Mong đợi:** ô 240 là ô trống, không thua
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-005 — vùng trống lan tới viền số, và mỗi con số đúng bằng số mìn quanh nó

- **Requirement:** REQ-BOARD-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Tiền điều kiện:** vị trí mìn của seed lấy bằng `learnMines` (decisions Q4)
- **Bước:** tải lại cùng seed → bấm ô 40
- **Mong đợi:** mọi ô kề của mọi ô trống đã mở đều không còn "chưa mở"; mỗi ô số hiện đúng số mìn kề; không ô mìn nào mở
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-006 — mở một ô số chỉ mở đúng ô đó

- **Requirement:** REQ-BOARD-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Tiền điều kiện:** vị trí mìn đã biết; sau nước đầu còn một ô số chưa mở
- **Bước:** bấm ô số đó
- **Mong đợi:** ô đó hiện đúng con số; không ô nào khác đổi trạng thái
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-007 — đồng hồ đứng ở 0:00 tới nước đầu, dù trang đã mở bao lâu

- **Requirement:** REQ-BOARD-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** mở trang, cho thời gian (giả) trôi 5 giây
- **Mong đợi:** đồng hồ vẫn `0:00`
- **Automated:** `tests/e2e/board/hud.e2e.ts`

### TC-BOARD-008 — đồng hồ chạy từ nước đầu và hiển thị phút:giây

- **Requirement:** REQ-BOARD-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** bấm ô 40, cho thời gian trôi 65 giây
- **Mong đợi:** đồng hồ `1:05`
- **Automated:** `tests/e2e/board/hud.e2e.ts`

### TC-BOARD-009 — đồng hồ không dừng ở 999 giây

- **Requirement:** REQ-BOARD-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** bấm ô 40, cho thời gian trôi 1 000 000ms
- **Mong đợi:** đồng hồ `16:40` (1000 giây), không kẹt ở `16:39` hay 999
- **Automated:** `tests/e2e/board/hud.e2e.ts`

### TC-BOARD-010 — Bàn mới giữa ván đưa bàn, đồng hồ và bộ đếm về đầu

- **Requirement:** REQ-BOARD-06, REQ-BOARD-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** bấm ô 40 → cắm cờ ô 0 (bộ đếm `009`) → 3 giây trôi → bấm "Bàn mới" → 3 giây trôi
- **Mong đợi:** mọi ô "chưa mở"; đồng hồ `0:00` và vẫn `0:00` sau 3 giây; bộ đếm `010`
- **Automated:** `tests/e2e/board/hud.e2e.ts`

### TC-BOARD-011 — sau Bàn mới, nước đầu tiếp theo vẫn an toàn và mở một vùng

- **Requirement:** REQ-BOARD-07, REQ-BOARD-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** bấm ô 40 → "Bàn mới" → bấm ô 40
- **Mong đợi:** ô 40 là ô trống, không thua
- **Automated:** `tests/e2e/board/hud.e2e.ts`

### TC-BOARD-012 — cùng seed và cùng nước đầu cho ra cùng một bàn

- **Requirement:** REQ-BOARD-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** hai lần: mở `./?seed=777`, bấm ô 40, đọc trạng thái mọi ô
- **Mong đợi:** hai lần đọc giống hệt nhau
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-013 — seed khác cho ra bàn khác

- **Requirement:** REQ-BOARD-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** như TC-BOARD-012 với seed 777 và 778
- **Mong đợi:** hai bàn khác nhau (seed thật sự được dùng, không bị bỏ qua)
- **Automated:** `tests/e2e/board/first-move.e2e.ts`

### TC-BOARD-014 — một nước trên bàn Khó vẽ xong trong 50ms

- **Requirement:** REQ-BOARD-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** bàn Khó, click ô 240 bằng `element.click()` rồi chờ hai `requestAnimationFrame`
- **Mong đợi:** hơn một ô đã mở; thời gian < 50ms (ghi vào annotation `NFR-PERF-06`)
- **Automated:** `tests/e2e/board/performance.e2e.ts`
