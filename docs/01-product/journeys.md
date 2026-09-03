# Luồng người dùng

> **Trả lời:** Người dùng đi qua những luồng nào từ đầu đến cuối?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-03 · commit —
> **Cập nhật khi:** có luồng người dùng mới · một luồng cũ đổi bản chất

<!-- CÁCH ĐIỀN
Viết bằng NGÔN NGỮ NGƯỜI DÙNG. Không có tên bảng, tên endpoint, tên component ở đây.
Mỗi luồng một mục, ID tăng dần US-01, US-02... không tái dùng số.

Mục "Điều gì có thể sai" là mục có giá trị nhất — nó là nguồn của test case và của
các trạng thái lỗi trên UI. Bỏ trống mục đó thì AI sẽ chỉ hiện thực đường đi đẹp.

KHÔNG chứa: chi tiết bố cục UI, danh mục chức năng (-> 02-requirements/scope.md).
-->

## US-01 · Chơi một bàn từ nước đầu đến thắng hoặc thua

**Bối cảnh:** Người chơi vừa mở trang, chưa bấm gì. Bàn hiện ra kín ô chưa mở, đồng hồ
đứng ở 0, bộ đếm mìn bằng số mìn của độ khó.

**Các bước:**
1. Bấm một ô bất kỳ. Ô đó mở, và vì nước đầu luôn an toàn, nó mở ra một vùng trống
   kèm viền số quanh vùng.
2. Đồng hồ bắt đầu chạy từ đúng nước này, không phải từ lúc mở trang.
3. Đọc các con số, suy ra ô nào chắc chắn là mìn, ô nào chắc chắn an toàn.
4. Mở tiếp các ô suy ra được an toàn. Mỗi lần mở ô trống, vùng lại lan ra.
5. Lặp lại tới khi mọi ô không phải mìn đều đã mở → **thắng**; hoặc mở phải một ô mìn
   → **thua**.

**Kết quả mong đợi:** Thắng thì đồng hồ dừng, mọi mìn còn lại tự hiện cờ, và nếu thời
gian tốt hơn kỷ lục của **đúng độ khó đó** thì kỷ lục được ghi. Thua thì đồng hồ dừng,
toàn bộ mìn hiện ra, ô mìn vừa bấm là ô ồn nhất trên bàn, và những cờ cắm sai chỗ bị
gạch chéo để người chơi thấy mình đã sai ở đâu.

**Điều gì có thể sai:**
- Nước đầu tiên trúng mìn — **không được phép xảy ra**, kể cả một lần trong mọi bàn của
  mọi độ khó.
- Đã thua rồi mà vẫn mở được ô tiếp, hoặc đồng hồ vẫn chạy. Đây là chỗ các bản clone
  hay để hở.
- Mở hết ô an toàn nhưng game không nhận là thắng, vì điều kiện thắng đếm cờ thay vì
  đếm ô đã mở.
- Vùng trống lan ra quá lớn làm bàn đứng một nhịp thấy được (`NFR-PERF-05/06`).
- `localStorage` không dùng được → thắng xong không lưu được kỷ lục. Game **vẫn phải
  chơi được đầy đủ**, chỉ nói rõ là không lưu được (`NFR-REL-03`).

**Chức năng liên quan:** FR-01 · FR-02 · FR-05 · FR-06 · FR-07 · FR-08 · FR-09

---

## US-02 · Cắm cờ, và mở nhanh quanh một con số

**Bối cảnh:** Đang giữa bàn. Người chơi đã suy ra ba ô quanh một số 3 đều là mìn.

**Các bước:**
1. Cắm cờ lên ba ô đó — chuột phải, hoặc giữ ngón, hoặc bật chế độ Cờ rồi chạm.
2. Bộ đếm mìn giảm ba.
3. Bấm chord lên ô số 3 — chuột giữa, hoặc chạm vào ô số đã mở.
4. Toàn bộ ô kề chưa cắm cờ mở ra cùng lúc.

**Kết quả mong đợi:** Đi nhanh hơn nhiều so với mở từng ô, mà không phải bỏ độ chắc
chắn — vì chord chỉ hoạt động khi số cờ kề đúng bằng con số trên ô.

**Điều gì có thể sai:**
- Chord khi cờ đủ số **nhưng cắm sai chỗ** → **phải nổ**. Đây là chủ ý: chord là lời
  khẳng định "tôi biết ba ô này là mìn", sai thì trả giá. Làm nó vô hại là biến chord
  thành công cụ dò miễn phí.
- Chord khi chưa đủ cờ → không được mở gì, và cũng không được nổ.
- Cắm cờ được lên ô đã mở.
- Chord mở luôn cả ô đang cắm cờ.
- Cắm nhiều cờ hơn số mìn → bộ đếm phải xuống âm, không được chặn ở 0. Số âm là tín
  hiệu hữu ích: bạn chắc chắn đã cắm sai đâu đó.

**Chức năng liên quan:** FR-03 · FR-04 · FR-06

---

## US-03 · Đổi độ khó và xem kỷ lục

**Bối cảnh:** Đang chơi mức Dễ, muốn sang mức Khó. Hoặc chỉ muốn xem lần trước mình
mất bao lâu.

**Các bước:**
1. Mở cài đặt.
2. Thấy ba mức kèm thông số (9×9 · 10 mìn / 16×16 · 40 mìn / 30×16 · 99 mìn) và kỷ lục
   của từng mức.
3. Chọn mức khác. Nếu bàn hiện tại **đã bắt đầu**, phải xác nhận bỏ bàn; nếu chưa bấm
   nước nào thì đổi luôn, không hỏi.
4. Bàn mới hiện ra ở độ khó mới, và lần mở trang sau vẫn là độ khó đó.

**Kết quả mong đợi:** Mỗi độ khó giữ kỷ lục riêng — một bàn Dễ không bao giờ chôn được
kỷ lục lập ở mức Khó.

**Điều gì có thể sai:**
- Hỏi xác nhận khi bàn còn chưa bấm nước nào (hỏi vô nghĩa), hoặc **không** hỏi khi
  bàn đang chơi (mất bàn oan).
- Đổi độ khó nhưng đồng hồ hoặc bộ đếm mìn còn giữ giá trị của bàn cũ.
- Kỷ lục ghi sang sai độ khó.
- Bật/tắt dấu hỏi giữa bàn làm các ô đang mang dấu hỏi rơi vào trạng thái không tồn tại.

**Chức năng liên quan:** FR-09 · FR-10 · FR-14

---

## US-04 · Chơi bằng ngón trên điện thoại

**Bối cảnh:** Đang đứng đợi, một tay giữ điện thoại, chơi mức Khó — bàn 30 cột không
vừa chiều rộng máy.

**Các bước:**
1. Bàn hiện ra ở mức zoom đủ đọc số (ô ≥ 22px), thấy một phần bàn; kéo ngón để đi sang
   phần khác.
2. Đặt ngón lên ô muốn mở. Ô sáng lên và một khung nhỏ hiện **phía trên ngón** cho biết
   đang nhắm ô nào — vì ngón che mất ô.
3. Nếu nhắm sai, trượt ngón sang ô đúng, hoặc nhấc ra ngoài bàn để huỷ.
4. Nhấc ngón trên ô đúng → ô mở. **Nhấc ngón mới là hành động, không phải đặt ngón.**
5. Cắm cờ: giữ ngón lâu, hoặc bật chế độ Cờ ở thanh dưới rồi chạm.
6. Chụm hai ngón để nhìn toàn bàn — ở mức đó chữ số tắt, bàn thành bản đồ nhiệt theo
   dải màu.

**Kết quả mong đợi:** Không có nước đi nào xảy ra ngoài ý muốn. Mọi cú chạm sai đều
sửa được **trước khi** nó thành nước đi.

**Điều gì có thể sai:**
- Kéo để pan bị hiểu thành mở ô.
- Giữ ngón để cắm cờ bị hiểu thành mở ô, hoặc ngược lại.
- Chạm hai lần nhanh làm trình duyệt zoom, hoặc kéo xuống làm trang refresh — mất cả bàn.
- Trên máy 2-in-1 có cả chuột và màn hình chạm: nhận sai loại thiết bị rồi **mất hẳn một
  đường vào**. Vì vậy phân nhánh theo loại sự kiện, không theo user-agent.
- Bàn Khó co lại cho vừa chiều rộng → ô 11px, chữ số ~6px, không đọc được. Phải zoom +
  pan, không được co.
- Thanh chế độ ở đáy che mất hàng ô cuối.

**Chức năng liên quan:** FR-12 · FR-13
