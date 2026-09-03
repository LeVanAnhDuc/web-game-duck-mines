# ADR-0001 · Dải nhiệt 8 màu cho chữ số, vỏ xám trung tính, Archivo + IBM Plex Mono

> **Ngày:** 2026-09-03
> **Trạng thái:** accepted
> **Liên quan:** NFR-A11Y-01 · NFR-A11Y-06 · [MASTER.md](../design-system/minesweeper/MASTER.md)

## 1. Bối cảnh

Cần chốt palette, cặp typeface và signature element trước khi dựng mockup đầu tiên.

Ràng buộc quyết định mọi thứ còn lại: **tám màu số 1–8 phải đạt ≥ 4.5:1 ở cả light
và dark theme**, đọc được trong ô 22–38px. Bảng màu bản gốc Windows không dùng lại
được — số 7 là **đen**, số 8 là **xám**, cả hai gần như vô hình trên nền tối.

`design-bootstrap` step 1 (`ui-ux-pro-max`) đề xuất Claymorphism, hồng `#EC4899` +
tím `#8B5CF6` + vàng `#F59E0B` trên `#0F172A`, font `Varela Round` + `Nunito Sans`,
và page pattern "Hero + Testimonials + CTA". Theo hợp đồng của skill, output đó là
**input**, không phải quyết định.

## 2. Quyết định

Vỏ máy xám trung tính, không màu. Toàn bộ màu dồn vào **dải nhiệt tám chữ số**: hue
quét đều một vòng theo chiều tăng nguy hiểm (xanh → lam → lục → ô-liu → hổ phách →
cam → đỏ thẫm → tím), một bộ giá trị riêng cho mỗi theme. Chữ số là kênh thông tin
chính, màu là kênh gia cố — vì 8 hue ở 22px không phân biệt chắc chắn được, và với
người mù màu thì không bao giờ.

Typeface: **`IBM Plex Mono`** cho chữ số bàn cờ và hai ô đọc số (chữ số `1` có chân
đế, `tabular-nums` nên đồng hồ không giật), **`Archivo`** cho chữ UI và wordmark.

Trạng thái "đã mở / chưa mở" **không mã hoá bằng màu** mà bằng hình: ô chưa mở là
viên gạch có viền, ô đã mở phẳng không viền.

Toàn bộ giá trị và tỉ lệ tương phản đo được nằm trong `MASTER.md`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ nguyên 8 màu số bản gốc Windows | Số 7 đen và số 8 xám không đạt 4.5:1 trên nền tối. Sửa chúng thì đã không còn là "nguyên bản" nữa, nên sửa hẳn cho có hệ thống. |
| Claymorphism + palette hồng/tím/vàng của step 1 | Palette 3 màu không cấp đủ 8 màu số phân biệt được; hồng primary cạnh tranh trực tiếp với số 7. Bo 16–24px trên ô 22px thì ô thành hình tròn. Dark mode của style này chỉ ở mức "conditional", trong khi brief đòi hạng nhất. |
| `Varela Round` + `Nunito Sans` của step 1 | Cả hai bo tròn mềm, chữ số `1` không chân đế → lẫn ở 22px; không họ nào cấp `tabular-nums`. |
| Phân biệt đã mở / chưa mở bằng độ sáng, đạt 3:1 theo WCAG 1.4.11 | Bất khả cùng lúc: muốn chênh 3:1 thì ô đã mở phải tối tới mức tám màu số không còn đủ 4.5:1. Đo ra 1.45:1 (light) và 1.38:1 (dark) ở mọi biến thể thử. |
| Một dải một hue, 8 bậc độ sáng | Đơn điệu thì đẹp nhưng 8 bậc lightness cạnh nhau ở 22px là một khối mờ. |

## 4. Hệ quả

**Được:**

- Mọi màu số ở cả hai theme đạt ≥ 4.66:1 (light) và ≥ 6.19:1 (dark) — đo, không ước.
- Màu **mang thông tin**: vùng ấm lên đọc được trước khi kịp đọc từng con số. Ở mức
  zoom nhìn tổng, chữ số tắt và bàn thành bản đồ nhiệt — chế độ đó có nghĩa là nhờ
  dải màu này.
- Trạng thái ô không phụ thuộc màu, nên không vỡ với người mù màu và không vỡ khi
  đổi theme.

**Mất / phải chấp nhận:**

- **Không còn là bảng màu bản gốc.** Người chơi lâu năm nhớ "3 là đỏ" sẽ phải học
  lại. Đây là cái giá có ý thức — đổi lại là đọc được trên nền tối.
- Cặp khó phân biệt nhất còn ΔE76 ≈ 30 (light 5 vs 6) và ≈ 30 (dark 3 vs 4). Đây là
  giới hạn thật của 8 hue, không sửa được bằng cách chọn hex khác — đã thử.
- Hai bộ giá trị số cho hai theme nghĩa là **mọi lần đổi một hex phải đo lại cả hai**.
- Ô chưa mở buộc phải có viền: đó là cơ chế duy nhất phân biệt trạng thái. Bỏ viền vì
  lý do thẩm mỹ là phá cả hệ thống, và không test nào bắt được.

**Điều kiện xem lại quyết định này:** có người mù màu thật thử và báo hai số cụ thể
không phân biệt được · hoặc thêm theme thứ ba (retro Win95 đang nằm ở backlog) khiến
định nghĩa token theo vai trò không còn đủ.
