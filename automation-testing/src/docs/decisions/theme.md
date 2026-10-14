# THEME — Quyết định

Đi cặp với `docs/requirements/theme.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-14 "Sáng/tối theo hệ thống, có ghi đè, nhớ lựa chọn"),
  `docs/01-product/journeys.md` (US-03), `docs/decisions/0001-design-tokens.md`, `docs/design-system/minesweeper/MASTER.md`,
  `README.md` §Features "Dark mode that follows you, or does not" ("Light, dark, or whatever the system is doing — and
  'system' really means system… The choice is remembered").
- **Code:** `client/src/hooks/useSettings.ts` (`data-theme` trên `<html>`, `system` = bỏ thuộc tính),
  `client/src/views/Home/index.tsx` (`onToggleTheme`: `theme === "dark" ? "light" : "dark"`),
  `client/src/views/Home/mains/Header/index.tsx`, `client/src/app/globals.css` (media query + `[data-theme]`).
- **Test đã gom (gợi ý):** "an explicit theme wins over the system preference, in both directions" trong
  `client/e2e/core-game.spec.ts` → TC-THEME-002 / TC-THEME-004 (bản cũ chỉ chạy trên hệ sáng).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Sáng/tối nhận biết bằng gì? → Màu nền thật của bàn (`getComputedStyle`), so với màu tham chiếu đo trên chính
  trang ở hai chế độ hệ khi chưa có lựa chọn. Không so mã màu cứng: token có thể đổi, điều phải chứng minh là "đổi chế độ".
- **Q2** Nút "Đổi sáng / tối" trên hệ đang tối, lựa chọn đang là "Theo hệ": code đặt `dark` → màn hình không đổi ở lần
  bấm đầu. Nhãn nút hứa "đổi", FR-14 hứa "có ghi đè", README hứa "or does not [follow you]". Một cú bấm không đổi gì là lệch
  → **bug** BUG-THEME-01 (TC-THEME-003 `test.fail()`). Không sửa code game ở PR này.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Tương phản 4.5:1 của chữ số ở cả hai chế độ (NFR-A11Y-01): đo bằng unit test `client/src/app/tokens.test.ts`.
- Khung hình đầu ở theme mặc định trước khi lựa chọn đã lưu áp dụng (đánh đổi có chủ ý, ghi trong `useSettings.ts`).

## Tech debt liên quan

_(không có)_
