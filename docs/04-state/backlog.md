# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-03 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

<!-- CÁCH ĐIỀN
Mục "Đang làm" là chỗ một phiên làm việc MỚI đọc đầu tiên. Giữ nó ngắn: đang làm
gì, dừng ở bước nào, cái gì đang chặn. Cập nhật nó TRƯỚC KHI DỪNG phiên, không
phải sau.

Mục "Nợ kỹ thuật" chỉ ghi thứ CỐ Ý làm tạm, và ghi NGAY LÚC ĐÓ. Bug thì không
thuộc đây. Việc chưa làm cũng không — đó là mục 2.

KHÔNG chứa: tính năng ngoài phạm vi (-> 01-product/overview.md §Non-Goals).
-->

## Đang làm

**Không có việc nào đang dở.** Feature `core-game` đã xong và đã đo:
141 unit/component test xanh · 120 e2e xanh ở 375 / 768 / 1024 / 1440 ·
`yarn lint` sạch · `yarn typecheck` sạch · First Load JS **108 kB**
(ngưỡng NFR-PERF-07 là 200 kB) · `NFR-PERF-05` đo được **0.010ms** cho vùng
trống lớn nhất bàn Khó (106 ô), ngưỡng 16ms.

Việc tiếp theo là feature `settings-records`. Canvas mockup của `core-game`:
`https://claude.ai/code/artifact/6cf98b19-3c5b-41f7-8184-765ef4ea9cf9` —
nguồn ở `.design/` (gitignored).

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Feature `settings-records` | FR-09, FR-10, FR-14 | cao | Không có nó thì không đo được chỉ số thành công thứ nhất (kỷ lục theo độ khó), và nút ☾ / ⚙ trên header hiện đang `disabled` |
| Feature `touch` | FR-12, FR-13 | trung bình | Là lý do dự án tồn tại, nhưng cần bàn chạy được trước mới thử được trên máy thật |
| Feature `deploy` | FR-15 | thấp | Làm cuối, nhưng `next.config.ts` phải có `output: "export"` **từ commit đầu** — thêm sau thì phát hiện ra một loạt thứ không xuất tĩnh được |

## Nợ kỹ thuật — cố ý làm tạm

Ba dòng đầu là **hoãn có chủ ý**, không phải nợ — ghi ở đây để không phải brainstorm
lại. Ba dòng sau là nợ thật, sinh ra trong lúc làm `core-game`:

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| Theme retro Win95 làm theme thứ hai | Chỉ có một bộ token (hiện đại) | Hai bộ token nghĩa là mọi mockup kiểm hai lần và `MASTER.md` phải định nghĩa token theo vai trò chứ không theo màu — `MASTER.md` **đã** làm vậy, nên thêm về sau không phải viết lại | Không bao giờ buộc. Chỉ khi có người thật xin |
| Lưu bàn đang chơi khi tab bị kill | Đóng tab là mất bàn | Bản gốc cũng vậy, và là Non-Goal | Nếu chơi thật trên điện thoại mà hệ điều hành kill tab thường xuyên tới mức mất bàn giữa lúc chơi |
| Phương án C — ghi trạng thái ô thẳng vào DOM, React không quản ô | Đang dùng phương án A: `memo` + prop nguyên thuỷ | Phương án C có hai nguồn sự thật (reducer + DOM sửa tay), đúng loại lỗi "test xanh mà kết quả sai" | Chỉ khi đo ra `NFR-PERF-06` không đạt trên bàn Khó. Đo trước, đừng đoán |
| `NFR-PERF-06` **chưa đo được** | Ngưỡng 50ms từ chạm đến vẽ xong chỉ có nghĩa trên bàn Khó, mà bàn Khó chưa mở được ở feature này (độ khó khoá `beginner`) | `NFR-PERF-05` — phần tính toán — đã đo 0.010ms, tức phần còn lại thuần là React reconcile | Ngay khi feature `settings-records` mở được bàn Khó. Đo bằng React Profiler, không đoán |
| Sóng mở ô (`--motion-cascade-max`) chưa hiện thực | Token đã có trong `globals.css`, `prefers-reduced-motion` đã tắt đúng, nhưng chưa có animation nào dùng nó | Nó là trang trí có chủ đích, không phải chức năng; bàn vẫn đọc được không cần nó | Khi làm cho đẹp. Không chặn feature nào |
| `Cell` mang một biến đếm render (`cellRenderCount`) | Một phép `+= 1` trên mỗi lần vẽ ô, kể cả ở production | Đó là cách duy nhất biến bất biến #4 thành test thật; `memo` hỏng thì hoàn toàn im lặng | Nếu profiling chỉ ra nó tốn thật — rất khó, nhưng đo trước |
