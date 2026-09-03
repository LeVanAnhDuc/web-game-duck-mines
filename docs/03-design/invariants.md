# Bất biến chịu lực

> **Trả lời:** Sửa gì thì hệ thống sai **âm thầm** — test vẫn xanh mà kết quả vẫn sai?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-03 · commit —
> **Cập nhật khi:** phát hiện một bất biến mới — thường là ngay sau khi ai đó vừa phá nó

<!-- CÁCH ĐIỀN
ĐỌC FILE NÀY TRƯỚC KHI SỬA BẤT KỲ DÒNG CODE NÀO.

Bất biến ở đây KHÁC quy ước code. Quy ước format/naming thì ESLint bắt được; bất
biến thì không có công cụ nào bắt, và vi phạm nó thì code vẫn chạy, test vẫn xanh,
chỉ có kết quả là sai.

VIỆC CỦA BẠN: xoá dòng không áp dụng, thêm bất biến riêng của dự án, đổi sang 🟢.

GIỮ FILE NÀY < 40 DÒNG NỘI DUNG. Nó được đọc mỗi lần sửa code; dài ra là không ai
đọc nữa. Thứ gì không thuộc loại "sai âm thầm" thì bỏ ra khỏi đây.

KHÔNG chứa: quy ước format/naming (-> lint config), kiến trúc (-> architecture.md).
-->

Cả 9 bất biến mặc định đã bị bỏ: chúng nói về server, datastore, migration, tiền và
quyền sở hữu dữ liệu — không có thứ nào trong dự án này. Thay bằng 9 bất biến thật.

| # | Bất biến | Vi phạm thì sao |
| --- | --- | --- |
| 1 | `src/game/core/` **không import** React, next, hay bất kỳ API DOM nào | Luật chơi bắt đầu phụ thuộc render. Test phải dựng jsdom, rồi chậm dần, rồi bị bỏ. Ranh giới tan từng PR một |
| 2 | Mìn sinh **sau** nước đầu, loại trừ ô đã bấm **và 8 ô kề** | Sinh lúc tạo bàn thì "first-click-safe" vẫn có vẻ hoạt động, test vẫn xanh, nhưng người chơi nổ ở nước đầu |
| 3 | Đồng hồ **không nằm trong** `GameState` | Mỗi giây một state mới → re-render 480 ô mỗi giây. Không test nào đỏ, chỉ là máy nóng và pin hết |
| 4 | `Cell` phải `memo` và **chỉ nhận prop nguyên thuỷ** | Truyền object hoặc callback mới mỗi lần render làm `memo` vô hiệu hoàn toàn, im lặng tuyệt đối |
| 5 | Mọi random đi qua `rng.ts` **có seed** | `Math.random()` trực tiếp làm test bàn cụ thể flaky, và flaky ngẫu nhiên thì bị bỏ qua chứ không bị sửa |
| 6 | `revealAllMines` khi thua **không xoá** cờ đã cắm | Mất khả năng gạch chéo cờ sai — người chơi không biết mình sai ở đâu, mà không có gì báo lỗi |
| 7 | Sau khi thắng hoặc thua, **mọi** action trong reducer là no-op | Chơi tiếp được sau khi đã nổ; đồng hồ chạy tiếp; kỷ lục ghi sai |
| 8 | Ô chưa mở **phải có viền**; ô đã mở **không viền** | Đây là cơ chế duy nhất phân biệt hai trạng thái — độ sáng không đủ 3:1, đã đo. Bỏ viền vì thẩm mỹ là phá cả hệ thống ([ADR-0001](../decisions/0001-design-tokens.md)) |
| 9 | Không viết hex màu thẳng trong code; chỉ đọc qua `var(--…)` | Một theme đúng, theme kia sai, và chỉ phát hiện khi có người đổi sang chế độ tối |
