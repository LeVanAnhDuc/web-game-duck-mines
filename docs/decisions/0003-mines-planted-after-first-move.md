# ADR-0003 · Sinh mìn sau nước đầu, loại trừ ô đã bấm và 8 ô kề

> **Ngày:** 2026-09-03
> **Trạng thái:** accepted
> **Liên quan:** FR-01 · US-01

## 1. Bối cảnh

Nước đầu tiên của một bàn Minesweeper không có thông tin gì để suy luận, nên nếu nó
có thể trúng mìn thì bàn đó thua bằng xác suất thuần. Mọi bản Minesweeper từ Windows
XP trở đi đều đảm bảo nước đầu an toàn; câu hỏi là **an toàn tới mức nào** và **cài
đặt bằng cách nào**.

Ràng buộc thêm: `rng.ts` phải có seed để test tái tạo được bàn (bất biến #5), và bàn
Khó có 99 mìn trên 480 ô — mật độ 20.6%, không dư chỗ nhiều.

## 2. Quyết định

Bàn được tạo **rỗng**. Mìn chỉ được sinh khi người chơi bấm nước đầu, và tập loại trừ
là **ô đã bấm cộng 8 ô kề** — tức vùng 3×3 quanh nó. Hệ quả: nước đầu luôn mở ra một
vùng trống, không bao giờ là một ô số lẻ loi.

Bàn Khó cần 99 mìn trên 480 − 9 = 471 ô còn lại. Đủ chỗ, và mật độ hiệu dụng chỉ nhích
từ 20.6% lên 21.0%.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Sinh mìn lúc tạo bàn, chỉ loại trừ **một** ô sẽ được bấm | Không biết trước người chơi bấm ô nào. |
| Sinh mìn lúc tạo bàn rồi **sinh lại tới khi** nước đầu an toàn | Ở bàn Khó, xác suất một ô bất kỳ an toàn chỉ ~79%, và yêu cầu cả vùng 3×3 trống thì phải sinh lại rất nhiều lần — thời gian chạy không đoán được. Nghiêm trọng hơn: điều kiện lọc làm **lệch phân phối mìn** trên phần còn lại của bàn, một cách không ai để ý và không test nào bắt. |
| Sinh mìn lúc tạo bàn, rồi khi nước đầu trúng mìn thì **dời quả mìn đó** sang ô trống đầu tiên | Cách của Windows 95. Chỉ đảm bảo ô đã bấm an toàn, không đảm bảo 8 ô kề — nước đầu vẫn có thể ra một ô số đơn độc, không mở được gì. Và "ô trống đầu tiên" theo thứ tự quét làm mìn dồn về góc trên-trái. |
| Loại trừ rộng hơn 3×3 để nước đầu mở ra vùng thật lớn | Cho không người chơi quá nhiều. Vùng mở ra bao lớn nên là chuyện của bàn, không phải quà tặng. |

## 4. Hệ quả

**Được:**

- Nước đầu **không bao giờ** thua, và luôn mở ra một vùng — kiểm được **cạn kiệt**:
  với mỗi độ khó, sinh bàn cho **từng ô** làm nước đầu (480 lần ở bàn Khó) rồi khẳng
  định đúng N mìn và không mìn nào trong vùng 3×3. Đây là test đáng tin nhất của dự án.
- Phân phối mìn trên phần còn lại vẫn đều, vì không có bước lọc-rồi-sinh-lại nào.
- Thời gian sinh bàn xác định, một lượt, không vòng lặp thử-lại.

**Mất / phải chấp nhận:**

- `GameState` có thêm một trạng thái thật: **bàn đã tạo nhưng chưa có mìn**. Mọi hàm
  đọc `board` phải chịu được nó, và reducer phải phân biệt nước đầu với nước sau.
- Bàn **không tái tạo được từ seed một mình** — nó là hàm của `(seed, ô bấm đầu)`. Vẫn
  đủ tất định cho e2e, nhưng "chia sẻ một bàn qua `?seed=`" chỉ giống nhau nếu hai
  người bấm cùng ô đầu.
- Người chơi cố tình bấm lại ô đầu nhiều lần ở nhiều bàn mới có thể mò ra rằng vùng
  3×3 luôn trống. Đó là sự thật của luật chơi, không phải lỗ hổng.

**Điều kiện xem lại quyết định này:** thêm mức khó có mật độ mìn cao tới mức 471 ô
còn lại không đủ chỗ · hoặc muốn bàn tái tạo được **chỉ** từ seed (ví dụ nếu daily
puzzle thoát khỏi danh sách Non-Goals).
