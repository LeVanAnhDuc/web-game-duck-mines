# CUSTOMBOARD — Quyết định

Đi cặp với `docs/requirements/custom-board.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-16), `docs/01-product/journeys.md` (US-05 + "Điều gì có thể sai"),
  `docs/decisions/0003-mines-planted-after-first-move.md`, `docs/decisions/0007-custom-boards-are-not-ranked.md`,
  `docs/decisions/0011-clamp-custom-fields-on-commit.md`, `README.md` §Features "Three boards, or one you build yourself".
- **Code:** `client/src/game/core/custom.ts` (`CUSTOM_LIMITS`, `maxMines`, `clampCustom`, `DEFAULT_CUSTOM` 16×16·40),
  `client/src/views/Home/components/SettingsSheet/index.tsx` (`NumberField` giữ chuỗi gõ dở, commit khi trong khoảng
  hoặc khi blur; `CustomFields.onChange` gọi thẳng `onPickCustom`), `client/src/views/Home/index.tsx`.
- **Test đã gom (gợi ý):** "FR-16: a custom board" trong `client/e2e/core-game.spec.ts` (4 case) → TC-CUSTOMBOARD-001,
  004, 005, 010.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Ô để trống rồi rời ô ra giá trị nào? → Docs không nói. Code commit `Number("") = 0` → kẹp lên sàn (hàng 5). Điều
  đáng chứng minh là "không ra cấu hình hỏng": giá trị hợp lệ và bàn khớp giá trị đó; không chốt con số cụ thể.
- **Q2** US-05 liệt kê "Đổi cấu hình giữa lúc đang chơi mà không bị hỏi xác nhận" là điều có thể sai. App hỏi khi
  **chuyển sang** Tuỳ chỉnh giữa ván (TC-CUSTOMBOARD-011 xanh) nhưng **không** hỏi khi sửa cột/hàng/mìn của bàn tuỳ
  chỉnh đang chơi: bàn bị dựng lại ngay khi giá trị hợp lệ. Docs > code → **bug** BUG-CUSTOMBOARD-01.
- **Q3** ADR-0011 bỏ phương án nút "Áp dụng" vì người dùng khen "đổi mức khó là bàn đổi ngay". Điều đó vẫn đúng khi chưa
  có nước nào; REQ-CUSTOMBOARD-08 chỉ đòi hỏi khi đồng hồ đang chạy, giống REQ-SETTINGS-03.
- **Q4** Biên kiểm những giá trị nào? → ngay dưới sàn và ngay trên trần của từng ô (cột 4/41, hàng 4/31, mìn 0) và vượt
  trần mìn xa (900 trên 5×5). Giá trị đúng biên (5, 40, 30) đi qua TC-CUSTOMBOARD-001/005/010 gián tiếp.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Bàn 40 cột trên màn hẹp phải pan được: cơ chế pan dùng chung với bàn Khó, kiểm ở module `touch`.
- "Đặt bàn khổng lồ làm trình duyệt đứng": trần 40×30 là ràng buộc cứng; hiệu năng bàn lớn nhất đo ở NFR-PERF-06 (bàn Khó).

## Tech debt liên quan

_(không có)_
