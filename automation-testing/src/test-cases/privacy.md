# PRIVACY — Test cases

Requirement: `docs/requirements/privacy.md` · quyết định: `docs/decisions/privacy.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. "Một ván đầy đủ" = thua
bàn seed, đóng dialog, bàn mới, mở ô, cắm cờ, cài đặt (bật tiếng, chọn Tối), đóng.

### TC-PRIVACY-001 — tải và chơi không gửi một request nào ra ngoài site

- **Requirement:** REQ-PRIVACY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** ghi mọi request → một ván đầy đủ
- **Mong đợi:** không request nào có origin khác site (trừ `data:` / `blob:`)
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-002 — sau khi tải xong, chơi không gọi mạng lần nào nữa

- **Requirement:** REQ-PRIVACY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** tải trang, chờ mạng yên → ghi request → mở ô, cắm cờ, đổi sang Trung bình, bàn mới
- **Mong đợi:** không request nào
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-003 — mất mạng sau lần tải đầu vẫn chơi tiếp được

- **Requirement:** REQ-PRIVACY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** tải trang → ngắt mạng → mở ô, cắm cờ, bàn mới, đổi sang Khó
- **Mong đợi:** mọi thao tác chạy: ô mở, `009`, 480 ô
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-004 — không có file âm thanh nào được tải, kể cả khi bật tiếng và thua

- **Requirement:** REQ-PRIVACY-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** bật tiếng → thua bàn seed
- **Mong đợi:** không request loại `media` hay đuôi mp3/wav/ogg/m4a/aac/flac/webm
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-005 — không cookie nào được đặt

- **Requirement:** REQ-PRIVACY-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** một ván đầy đủ → đọc cookie của context
- **Mong đợi:** danh sách rỗng
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-006 — máy người chơi chỉ giữ kỷ lục và cài đặt, không giữ gì về người chơi

- **Requirement:** REQ-PRIVACY-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** một ván đầy đủ → đọc khoá `localStorage`, `sessionStorage`, nội dung cài đặt
- **Mong đợi:** chỉ `minesweeper.settings.v1` (+ `minesweeper.records.v1` nếu có); `sessionStorage` rỗng; cài đặt chỉ có
  `allowUnsure, custom, difficulty, sound, theme, useCustom`
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`

### TC-PRIVACY-007 — bản production không ghi gì ra console

- **Requirement:** REQ-PRIVACY-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** nghe `console` + `pageerror` → một ván đầy đủ
- **Mong đợi:** không có dòng nào
- **Automated:** `tests/e2e/privacy/network-storage.e2e.ts`
