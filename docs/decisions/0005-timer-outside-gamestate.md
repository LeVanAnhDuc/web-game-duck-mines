# ADR-0005 · Đồng hồ nằm ngoài `GameState`, reducer chỉ giữ mốc bắt đầu

> **Ngày:** 2026-09-03
> **Trạng thái:** accepted
> **Liên quan:** FR-07 · NFR-PERF-06

## 1. Bối cảnh

Đồng hồ chạy mỗi giây, và bàn Khó có 480 ô đều là component React. Nếu giây hiện tại
là một phần của `GameState`, thì mỗi tick sinh một `GameState` mới, và mỗi
`GameState` mới đi qua toàn bộ cây component.

Đây là loại lỗi không có gì báo: không test nào đỏ, không cảnh báo nào hiện, game vẫn
đúng luật. Biểu hiện duy nhất là quạt máy và pin.

## 2. Quyết định

Reducer chỉ giữ **`startedAt`** — mốc thời gian của nước đầu — và không bao giờ giữ số
giây đã chạy. `useTimer` tự tick bằng `setInterval`, giữ giây trong state riêng của nó,
và **chỉ** component `Timer` đọc state đó.

Số giây để ghi kỷ lục được tính từ `startedAt` và mốc kết thúc, ở `useGame`, tại đúng
thời điểm `status` chuyển sang `won` — không lấy từ giá trị đang hiện trên đồng hồ.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| `elapsedSeconds` là một field của `GameState`, reducer nhận action `tick` mỗi giây | Mỗi giây một `GameState` mới → re-render cả bàn. Đó chính là bất biến #3 ở `invariants.md`, và nó nằm ở đó vì đây là cách tự nhiên nhất để viết sai. |
| Đồng hồ trong `GameState` nhưng `Board` bọc `memo` để chặn re-render | Vẫn phải so sánh prop của 480 ô mỗi giây, và chỉ hoạt động khi `board` giữ nguyên reference qua mỗi tick — một ràng buộc ngầm, không ai thấy, dễ phá. |
| Đọc `Date.now()` trực tiếp trong component `Timer`, không giữ mốc trong state | Không có nguồn đúng nào cho "bàn này bắt đầu lúc nào", nên tạm dừng, khôi phục hay tính lại thời gian đều không làm được. |
| Đếm số tick thay vì lấy hiệu hai mốc | `setInterval` bị trình duyệt bóp lại khi tab ở nền — đếm tick thì đồng hồ chạy chậm hơn thực tế, và kỷ lục lập được bằng cách chuyển tab. Lấy hiệu hai mốc thì miễn nhiễm. |

## 4. Hệ quả

**Được:**

- Bàn chỉ vẽ lại khi có nước đi, không phải mỗi giây.
- Thời gian ghi kỷ lục là hiệu hai mốc thật, nên không sai được vì tab bị bóp tần số
  hay vì máy ngủ.
- Reducer giữ được tính thuần: không `Date.now()`, không side effect, test không cần
  fake timer.

**Mất / phải chấp nhận:**

- Số hiện trên đồng hồ và số dùng để ghi kỷ lục là **hai phép tính khác nhau** trên
  cùng một mốc. Chúng phải khớp; lệch nhau một giây ở biên là loại sai không ai để ý.
- Có hai chỗ giữ trạng thái thời gian (`startedAt` trong reducer, giây hiện tại trong
  `useTimer`). Chấp nhận được vì một chỗ là **mốc**, chỗ kia là **cái đang hiện** — nếu
  ai đó biến chỗ thứ hai thành nguồn đúng thì bất biến #3 đã bị phá.
- `useTimer` phải tự dừng khi `status` không còn là `playing`, và việc đó không phải
  reducer bảo nó — là nó tự đọc.

**Điều kiện xem lại quyết định này:** nếu pause thoát khỏi danh sách Non-Goals, hoặc
nếu bàn đang chơi được lưu qua các lần mở trang — cả hai đều làm "thời gian đã chơi"
thành nhiều đoạn, và mốc đơn `startedAt` không còn đủ.
