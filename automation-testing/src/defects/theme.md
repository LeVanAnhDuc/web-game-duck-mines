# THEME — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-THEME-01](#bug-theme-01) | Thấp | TC-THEME-003 | Trên hệ tối, lần bấm đầu vào "Đổi sáng / tối" không đổi gì |

### BUG-THEME-01

- **TC:** TC-THEME-003 · **Requirement:** REQ-THEME-02
- **Bước tái hiện:** hệ điều hành ở chế độ tối, chưa từng chọn theme (mặc định "Theo hệ") → bấm nút "Đổi sáng / tối" ở header.
- **Mong đợi:** giao diện chuyển sang sáng (nút hứa "đổi", FR-14 hứa ghi đè được hệ).
- **Thực tế:** giao diện vẫn tối; phải bấm lần thứ hai mới sáng. `onToggleTheme` trong `client/src/views/Home/index.tsx`
  tính `theme === "dark" ? "light" : "dark"` từ **lựa chọn đã lưu** (`system`) chứ không từ chế độ đang hiện, nên từ
  "Theo hệ" nó luôn chọn `dark` — trùng với cái hệ tối đang hiện.
- **Ghi chú:** ghi ngày 2026-10-15; trên hệ sáng nút hoạt động đúng (TC-THEME-002 xanh).

## Đã sửa

_(chưa có)_
