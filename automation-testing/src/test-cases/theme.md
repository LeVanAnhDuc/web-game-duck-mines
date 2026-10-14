# THEME — Test cases

Requirement: `docs/requirements/theme.md` · quyết định: `docs/decisions/theme.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Màu tham chiếu: nền bàn đo ở
hệ sáng và hệ tối khi chưa có lựa chọn (decisions Q1).

### TC-THEME-001 — mặc định giao diện theo hệ điều hành, và đổi ngay khi hệ đổi

- **Requirement:** REQ-THEME-01, REQ-THEME-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** đo hai màu tham chiếu → kiểm "Theo hệ" đang chọn → đổi hệ sáng ↔ tối khi tab đang mở
- **Mong đợi:** hai màu khác nhau; "Theo hệ" `aria-checked=true`; nền bàn theo đúng hệ sau mỗi lần đổi
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-002 — nút Đổi sáng / tối ghi đè hệ đang sáng, theo cả hai chiều

- **Requirement:** REQ-THEME-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** hệ sáng → bấm nút → bấm lần nữa
- **Mong đợi:** tối → sáng
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-003 — trên hệ đang tối, lần bấm đầu tiên vào Đổi sáng / tối cũng đổi giao diện

- **Requirement:** REQ-THEME-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** hệ tối, lựa chọn "Theo hệ" → bấm nút một lần
- **Mong đợi:** giao diện sáng
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-004 — lựa chọn rõ ràng thắng hệ điều hành và còn nguyên sau khi tải lại

- **Requirement:** REQ-THEME-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** hệ sáng, bấm nút (tối) → tải lại; rồi chọn Sáng trong cài đặt, đổi hệ sang tối → tải lại
- **Mong đợi:** sau lần tải thứ nhất vẫn tối; sau lần thứ hai vẫn sáng dù hệ tối
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-005 — ba lựa chọn trong cài đặt: Theo hệ, Sáng, Tối

- **Requirement:** REQ-THEME-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** hệ sáng → cài đặt → Tối → Sáng → Theo hệ → đổi hệ sang tối
- **Mong đợi:** mỗi lựa chọn `aria-checked=true` và áp dụng ngay; "Theo hệ" lại theo hệ (tối)
- **Automated:** `tests/e2e/theme/theme.e2e.ts`
