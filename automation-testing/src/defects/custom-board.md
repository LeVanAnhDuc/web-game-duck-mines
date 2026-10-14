# CUSTOMBOARD — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-CUSTOMBOARD-01](#bug-customboard-01) | Trung bình | TC-CUSTOMBOARD-012 | Sửa cột/hàng/mìn của bàn tuỳ chỉnh đang chơi bỏ bàn ngay, không hỏi |

### BUG-CUSTOMBOARD-01

- **TC:** TC-CUSTOMBOARD-012 · **Requirement:** REQ-CUSTOMBOARD-08
- **Bước tái hiện:** cài đặt → Tuỳ chỉnh 10×10·10 → đóng → mở một ô (đồng hồ chạy) → cài đặt → sửa Cột thành 12.
- **Mong đợi:** (`docs/01-product/journeys.md` US-05 "Điều gì có thể sai": "Đổi cấu hình giữa lúc đang chơi mà không bị
  hỏi xác nhận") hỏi "Bỏ bàn đang chơi…?" như khi đổi độ khó (REQ-SETTINGS-03); bàn đang chơi giữ nguyên tới khi trả lời.
- **Thực tế:** không có câu hỏi; ngay khi giá trị hợp lệ bàn bị dựng lại thành 12×10 và ván đang chơi mất.
  `CustomFields.onChange` trong `client/src/views/Home/components/SettingsSheet/index.tsx` gọi thẳng `onPickCustom` mà
  không qua nhánh `inProgress` → `pending` như `choose()` / `chooseCustom()`.
- **Ghi chú:** ghi ngày 2026-10-15. Chuyển **sang** Tuỳ chỉnh giữa ván vẫn hỏi đúng (TC-CUSTOMBOARD-011).

## Đã sửa

_(chưa có)_
