# ADR-0002 · Vẽ bàn cờ bằng DOM, không dùng Canvas

> **Ngày:** 2026-09-03
> **Trạng thái:** accepted
> **Liên quan:** FR-02 · FR-11 · NFR-A11Y-02 · NFR-A11Y-04 · NFR-PERF-06

## 1. Bối cảnh

Dự án cùng workspace `web-game-flappy-bird` vẽ toàn bộ game bằng Canvas 2D, và cấu
trúc `src/game/{core,engine,render}` của nó là tiền lệ đang được kế thừa. Câu hỏi là
có kế thừa luôn cách vẽ hay không.

Ràng buộc: bàn Khó có **480 ô**, mỗi ô cần hai hành động khác nhau, và
`NFR-A11Y-02` + `NFR-A11Y-04` đòi bàn phím đi hết bàn và mỗi ô đọc được bằng screen
reader.

## 2. Quyết định

Mỗi ô là một `<button>` trong CSS Grid. Toàn bộ luật chơi nằm ở `game/core/` dạng
TypeScript thuần; React chỉ nhận `GameState` bất biến rồi vẽ. Không có `<canvas>`
nào trong dự án.

Đổi lại, hiệu năng phải được mua bằng chủ đích: `Cell` bắt buộc `memo` và chỉ nhận
prop nguyên thuỷ (bất biến #4 ở `invariants.md`).

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Canvas 2D, giống flappy-bird | flappy-bird cần Canvas vì nó có **vòng lặp vật lý 120Hz**. Minesweeper theo lượt: không vòng lặp, chỉ vẽ lại khi người chơi bấm. Canvas ở đây trả giá a11y để mua một thứ không cần. Muốn có bàn phím và screen reader thì phải dựng một lớp DOM song song ẩn sau canvas — nhiều việc hơn phương án DOM cộng lại. |
| Canvas + lớp DOM ẩn cho a11y | Hai nguồn sự thật về "ô nào đang ở đâu". Lệch một ô là lệch im lặng. |
| CSS Grid nhưng ghi trạng thái ô thẳng vào `data-*` bằng DOM API, React không quản ô | Nhanh nhất, nhưng có hai nguồn sự thật (reducer + DOM đã sửa tay) — đúng loại lỗi mà `invariants.md` tồn tại để chặn. Giữ làm phương án dự phòng, chỉ dùng nếu **đo được** `NFR-PERF-06` không đạt. Đã ghi ở `backlog.md`. |
| SVG một khối, mỗi ô một `<rect>` | Vẫn phải tự làm focus, `aria-label`, thứ tự tab — tức là gánh nặng của Canvas mà không được hiệu năng của Canvas. |

## 4. Hệ quả

**Được:**

- Focus ring, thứ tự tab, `aria-label` và vùng bấm 44px là **thuộc tính của thẻ**,
  không phải code bù. `NFR-A11Y-02` và `-04` đạt bằng cấu trúc.
- Dark mode chỉ là đổi CSS variable. Canvas thì phải đọc biến ra JS rồi vẽ lại cả bàn.
- Chữ số dùng font thật, nét sắc trên màn hình retina ở mọi cỡ, không phải canh tay
  từng cỡ như `fillText`.
- `core/` test được trong vitest không cần jsdom.

**Mất / phải chấp nhận:**

- 480 node DOM trên bàn Khó. Không tự nhiên nhanh — chỉ nhanh **nếu** `memo` đúng và
  prop nguyên thuỷ. Đây là gánh nặng thường trực của mọi PR sau này, và không có
  linter nào bắt được khi ai đó truyền một object mới vào `Cell`.
- Pan/zoom phải làm bằng `transform` trên khung bọc, không phải phép biến đổi ma trận
  sẵn có của canvas context.
- Không dùng lại được `render/` của flappy-bird — hai dự án cùng workspace từ đây có
  hai cách vẽ khác nhau.

**Điều kiện xem lại quyết định này:** đo được `NFR-PERF-06` (< 50ms từ chạm đến vẽ
xong trên bàn Khó) không đạt sau khi đã `memo` đúng · hoặc thêm một mức khó có bàn
lớn hơn nhiều lần 30×16.
