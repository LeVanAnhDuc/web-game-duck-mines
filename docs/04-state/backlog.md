# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-12 · commit —
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

**Sửa phát hiện UX từ lượt persona 12.09.2026** — nhánh `fix/ux-persona-findings`.
Lượt chạy `ux-persona-review` đầu tiên, chạy trên **bản deploy GitHub Pages** (commit
`f9c267f`), 8 phiên / 6 persona / 6 Red Route. Báo cáo và dẫn chứng:
`docs/specs/ux-persona-findings/ux-feedback-2026-09-12.md`; log thô + 85 ảnh nằm ở
`.claude/skills/ux-persona-review/runs/2026-09-12/` (không commit).

12 phát hiện. Nhánh này sửa **10 khiếm khuyết** (F1–F10 trong `design.md`) và đẩy phần
còn lại xuống §Việc tiếp theo, vì chúng là **câu hỏi sản phẩm** chứ không phải lỗi — trộn
hai loại vào một PR là cách chắc chắn nhất để không cái nào được làm tử tế. Hai ADR mới:
[ADR-0011](../decisions/0011-clamp-custom-fields-on-commit.md) kẹp giá trị lúc chốt,
[ADR-0012](../decisions/0012-open-cell-always-chords.md) ô đã mở luôn chord.

Số đo đo trên chính nhánh này, phiên 12.09.2026: **293** unit/component test (trước 287) ·
**207** e2e trên năm project (trước 202) · lint và typecheck sạch · first-load JS
**112.6 kB** / 200 kB (trước 112.0).

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| ~~Feature `settings-records`~~ **xong** | FR-09, FR-10, FR-14, FR-18 | — | Không có nó thì không đo được chỉ số thành công thứ nhất (kỷ lục theo độ khó), và nút ☾ / ⚙ trên header hiện đang `disabled` |
| ~~Feature `touch`~~ **xong** | FR-12, FR-13, FR-17 | — | — |
| ~~Feature `custom-board`~~ **xong** | FR-16 | — | — |
| **Mốc định vị cho bàn lớn + neo HUD khi cuộn** (PH-04) | US-04, FR-13, ADR-0009 | **cao** | Phát hiện duy nhất đánh thẳng vào chỉ số thành công §6.1. Hai persona ở hai thiết bị khác nhau đều kết bài "sẽ không chơi mức Khó nữa". Nhánh 12.09 đã chặn trang cuộn theo trục dọc, nhưng **mốc định vị thì chưa có**: sau một lần kéo, mọi ô kín trông giống hệt nhau — *"toàn ô xám như nhau, không có số hàng số cột gì để biết mình đang ở đâu"* (p01-RR-04 bước 9). Cần mockup ba bề rộng: mốc là số hàng/cột, minimap, hay viền? `MASTER.md` §3 cấm co bàn cho vừa |
| **Phản hồi cho thao tác bị từ chối** (PH-03, phần còn lại) | FR-04, FR-11 | **cao** | Hình dạng lỗi lặp ở 3 persona / 4 Red Route. ADR-0012 đã lấy đi nguồn im lặng lớn nhất; còn `F` trên ô đã mở và chord chưa đủ cờ. *"Im lặng và hỏng là hai thứ trông giống hệt nhau, và tôi đã thật sự tưởng phím `F` hỏng"* (p03-RR-06 bước 7). Cần reducer báo được "vừa từ chối" — đổi giao diện reducer là việc có rủi ro, xứng đáng một PR riêng có test riêng |
| **Kỷ lục ra màn hình chính** (PH-07 + PH-08) | FR-09, US-03 | trung bình | Kỷ lục là vòng lặp giữ chân **duy nhất** của sản phẩm và đang nằm ở tầng sâu nhất, trong khi nửa dưới màn hình trống. Hệ quả đo được: một persona primary trả lời "chắc là không, chưa" cho câu quay lại — *"Thế thì nó là trang chơi một lần"* (p02-RR-03). Đi kèm PH-08: dòng "Dễ: 9×9, 10 mìn" trông như nút đổi độ khó nhưng là chữ trơ. Cả hai cùng nói về nửa dưới màn hình → **một quyết định, không phải hai** |

## Nợ kỹ thuật — cố ý làm tạm

Ba dòng đầu là **hoãn có chủ ý**, không phải nợ — ghi ở đây để không phải brainstorm
lại. Ba dòng sau là nợ thật, sinh ra trong lúc làm `core-game`:

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| Theme retro Win95 làm theme thứ hai | Chỉ có một bộ token (hiện đại) | Hai bộ token nghĩa là mọi mockup kiểm hai lần và `MASTER.md` phải định nghĩa token theo vai trò chứ không theo màu — `MASTER.md` **đã** làm vậy, nên thêm về sau không phải viết lại | Không bao giờ buộc. Chỉ khi có người thật xin |
| Lưu bàn đang chơi khi tab bị kill | Đóng tab là mất bàn | Bản gốc cũng vậy, và là Non-Goal | Nếu chơi thật trên điện thoại mà hệ điều hành kill tab thường xuyên tới mức mất bàn giữa lúc chơi |
| Phương án C — ghi trạng thái ô thẳng vào DOM, React không quản ô | Đang dùng phương án A: `memo` + prop nguyên thuỷ | Phương án C có hai nguồn sự thật (reducer + DOM sửa tay), đúng loại lỗi "test xanh mà kết quả sai" | Chỉ khi đo ra `NFR-PERF-06` không đạt trên bàn Khó. Đo trước, đừng đoán |
| Sóng mở ô (`--motion-cascade-max`) chưa hiện thực | Token đã có trong `globals.css`, `prefers-reduced-motion` đã tắt đúng, nhưng chưa có animation nào dùng nó | Nó là trang trí có chủ đích, không phải chức năng; bàn vẫn đọc được không cần nó | Khi làm cho đẹp. Không chặn feature nào |
| Middle dot nối chuỗi meta (`A · B · C`) trong chữ UI | Vi phạm `MASTER.md` §7 anti-pattern | Không persona nào vấp, và sửa nó chạm vào mọi chuỗi meta cùng lúc | Khi có việc khác đã mở sẵn `strings.ts` ở vùng đó |
| Wordmark "Duck Mines" không giải mã được với người Việt (PH-11) | 2/6 persona nói ra: *"Con vịt à? Sao chả thấy con vịt nào"* | Không ai bỏ cuộc vì cái tên, và cả hai đều nhận ra trò chơi từ cái lưới chứ không cần tên. Thương hiệu vừa đổi 08.09.2026 — sửa ngay là đổi hai lần trong một tháng | Chỉ khi có lý do thương hiệu thật, không phải vì lượt review này |
| Số 2 và số 3 dễ lẫn khi nhìn lướt (PH-12) | 1 persona, 2 phiên độc lập, tự nhận *"tôi biết rõ là mình đang chậm lại"* | **Cố ý không sửa.** `MASTER.md` §0–§1 thắng: chữ số là kênh chính, màu là kênh phụ; cặp khó phân biệt nhất đo được là 5 vs 6, không phải 2 vs 3. Persona **rối loạn nhận màu** chạm đúng cặp này và kết luận ngược lại: *"nó là chữ số, tôi đọc hình dạng... Đó là cách làm đúng"*. Nhường là phá signature element và phá `overview.md` §6.2 | Chỉ khi có số đo mới bác bỏ `tokens.test.ts` |
| `Cell` mang một biến đếm render (`cellRenderCount`) | Một phép `+= 1` trên mỗi lần vẽ ô, kể cả ở production | Đó là cách duy nhất biến bất biến #4 thành test thật; `memo` hỏng thì hoàn toàn im lặng | Nếu profiling chỉ ra nó tốn thật — rất khó, nhưng đo trước |
