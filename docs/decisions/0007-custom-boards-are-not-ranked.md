# ADR-0007 · Bàn tuỳ chỉnh chơi được nhưng không xếp hạng

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-09 · FR-16 · US-05 · supersedes một Non-Goal trong overview.md

## 1. Bối cảnh

Non-Goal cũ từ chối bàn tuỳ chỉnh với một lý do cụ thể, không phải vì lười: *"bàn tuỳ
chỉnh làm bảng kỷ lục vô nghĩa — kỷ lục của bàn 5×5 hai mìn so với cái gì?"*

Người dùng muốn có bàn tuỳ chỉnh. Nghĩa là phải trả lời đúng câu đó chứ không phải bỏ
Non-Goal rồi đi tiếp — bỏ một ràng buộc mà không xử lý lý do của nó là cách một dự án
mất tính nhất quán.

## 2. Quyết định

Bàn tuỳ chỉnh **chơi được đầy đủ**: đồng hồ chạy, bộ đếm mìn chạy, thắng/thua như
thường. Nhưng nó **không ghi kỷ lục**, và **không xuất hiện trong bảng kỷ lục**.

Bảng kỷ lục vĩnh viễn đúng ba dòng: Dễ, Trung bình, Khó.

UI nói điều này **ở màn cấu hình, trước nước đi đầu tiên** — không phải bằng một dòng
chữ nhỏ sau khi người chơi vừa thắng trong 47 giây và tưởng mình lập kỷ lục.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Mỗi cấu hình một kỷ lục riêng, khoá theo `cột×hàng×mìn` | So sánh có nghĩa, nhưng bảng mọc dài vô hạn theo số cấu hình từng chơi, và cần thêm UI xoá từng dòng. Đổi rất nhiều phức tạp lấy một con số ít ai nhìn lại |
| Như trên nhưng chỉ giữ N cấu hình gần nhất | Một kỷ lục **biến mất âm thầm** vì bạn chơi cấu hình khác. Đó là loại bất ngờ tệ nhất có thể gắn vào thứ tên là "kỷ lục" |
| Một dòng "Tuỳ chỉnh" chung cho mọi bàn tự đặt | Gọn nhất và vô nghĩa nhất: 1:04 trên bàn 5×5 hai mìn chôn vĩnh viễn kỷ lục bàn 30×24 |
| Chuẩn hoá theo mật độ mìn rồi so sánh | Phải bịa ra một công thức quy đổi. Một con số không ai kiểm chứng được thì tệ hơn không có số |
| Giữ nguyên Non-Goal, không làm bàn tuỳ chỉnh | Người dùng xin, và lý do từ chối **giải quyết được** mà không phải hy sinh gì |

## 4. Hệ quả

**Được:**

- Bảng kỷ lục giữ nguyên ý nghĩa: ba con số, so được với nhau qua thời gian, so được
  giữa người này với người kia nếu sau này có ai chia sẻ.
- Không thêm cấu trúc lưu trữ nào. `bestTime` vẫn khoá theo `Difficulty`, ba giá trị.
- Người chơi được đúng thứ họ xin.

**Mất / phải chấp nhận:**

- Ai chơi chủ yếu bàn tuỳ chỉnh sẽ **không có kỷ lục nào cả**. Đó là đánh đổi có ý
  thức, và phải nói ra ở UI chứ không giấu.
- `GameState` mọc thêm một khái niệm: bàn hiện tại có được xếp hạng hay không. Chỗ này
  dễ sai âm thầm — thắng một bàn tuỳ chỉnh mà vẫn ghi đè kỷ lục mức Dễ là loại lỗi
  test dễ bỏ sót, nên nó có test riêng.

**Điều kiện xem lại quyết định này:** có người chơi thật dùng bàn tuỳ chỉnh làm chế độ
chính và xin bảng xếp hạng cho nó · hoặc kỷ lục chuyển sang lưu ở nơi khác ngoài
`localStorage` khiến chi phí của một bảng nhiều dòng không còn đáng kể.
