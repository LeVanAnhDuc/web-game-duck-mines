# Thiết kế — sửa phát hiện UX từ lượt persona 12.09.2026

Liên quan: FR-03 · FR-04 · FR-05 · FR-10 · FR-12 · FR-16 · US-02 · US-03 · US-05 ·
NFR-A11Y-02 · NFR-A11Y-04 · ADR-0003 · ADR-0004 · ADR-0007 · ADR-0009

Nguồn: [`ux-feedback-2026-09-12.md`](ux-feedback-2026-09-12.md) — 12 phát hiện, log thô và
85 ảnh ở `.claude/skills/ux-persona-review/runs/2026-09-12/`.

## Nguyên tắc chia việc

Lượt review trả về hai loại thứ rất khác nhau, và trộn chúng vào một PR là cách chắc chắn
nhất để không cái nào được làm tử tế:

- **Khiếm khuyết** — code làm sai điều chính nó tuyên bố, hoặc nuốt thao tác của người dùng
  trong im lặng. Sửa ở nhánh này. Chúng có đáp án đúng/sai, không cần ai duyệt thẩm mỹ.
- **Câu hỏi sản phẩm** — "kỷ lục nên sống ở đâu", "bàn lớn định vị bằng gì". Chúng cần một
  mockup và một quyết định của người chủ sản phẩm. Đẩy sang `backlog.md` §Việc tiếp theo
  kèm nguyên văn dẫn chứng, để lần sau không phải chạy lại persona mới biết vì sao.

## Làm ở nhánh này

| #       | Phát hiện        | Sửa gì                                                                                                               | Vì sao đây là khiếm khuyết chứ không phải sở thích                                                                                                                                                                                                                           |
| ------- | ---------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F1**  | PH-02 High       | `clampCustom` thôi kẹp mỗi lần gõ phím; kẹp khi người dùng đã gõ xong                                                | Người gõ `24` mà ô hiện `40`. Không có cách đọc nào của "nhập đúng" cho ra kết quả này. → **ADR-0011**                                                                                                                                                                       |
| **F2**  | PH-03 High       | `tapKind`: ô **đã mở** luôn là `chord`, kể cả ở chế độ Cờ                                                            | `mark` trên ô đã mở là no-op tuyệt đối — nhánh đó không làm gì được, chỉ nuốt cú chạm. Và chính comment trong `touchGesture.ts` đã hứa "hai đường vào đồng ý với nhau về ý nghĩa của một cú chạm trên ô đã mở", mà code chỉ thực hiện lời hứa đó ở chế độ Mở. → **ADR-0012** |
| **F3**  | PH-05 High       | `Esc` **đóng bảng**, không tạo bàn mới · thêm nút đóng · bảng thua hiện **thời gian đã đi** · scrim thôi chắn header | Ba lỗi riêng biệt: `Esc` phá dữ liệu trái quy ước phổ quát; scrim chắn mà không trông như chắn (`aria-modal="false"` nói nó **không** modal, hành vi lại modal); và thời gian là thứ duy nhất mang về từ một ván thua                                                        |
| **F4**  | PH-01 High       | Khối xác nhận bỏ bàn tự nhận focus · radio đang chờ có dấu hiệu thị giác                                             | Xác nhận **đã tồn tại** trong code nhưng không tới được mắt người dùng. Đây là lỗi truyền đạt của một cơ chế đã làm xong, không phải tính năng mới                                                                                                                           |
| **F5**  | PH-06 High       | Dòng gợi ý: bàn phím **đứng trước**, chữ to hơn, và **đặt tên cho đường chord không cần chuột giữa**                 | Chord có hai đường vào; UI chỉ đặt tên cho một, và đó là đường mà trackpad không có. Người không biết đường kia tồn tại thì mất `FR-04`                                                                                                                                      |
| **F6**  | PH-10 Medium     | Một câu trong § Lối chơi: bàn theo luật gốc, có thể phải đoán                                                        | Sản phẩm **đã có** thói quen khai báo thẳng Non-Goal tại chỗ (mục Âm thanh, dòng đỏ bàn tuỳ chỉnh). Đây là chỗ duy nhất bỏ sót, với đúng Non-Goal lớn nhất                                                                                                                   |
| **F7**  | PH-09 Medium     | Một dòng chân trang: ai làm, link mã nguồn                                                                           | 4/6 persona nêu tự phát cùng một lý do. Là chữ, không phải hạ tầng — không đụng trần 0₫                                                                                                                                                                                      |
| **F8**  | —                | `favicon` · `id`/`name` cho ba ô nhập                                                                                | Console báo thẳng. `NFR-A11Y-04` đòi "mọi input có label liên kết"                                                                                                                                                                                                           |
| **F9**  | PH-04 (một phần) | Bàn tuỳ chỉnh lớn cuộn **trong khung của nó**, không làm cả trang cuộn                                               | `MASTER.md` §7 đã quy định điều này. Đúng ở 375px, sai ở 1366px với bàn tuỳ chỉnh — tức là vi phạm quy tắc đã chốt, không phải câu hỏi mở                                                                                                                                    |
| **F10** | —                | Thay emoji ❓ trong sheet bằng glyph chữ                                                                             | `MASTER.md` §5 _"Emoji làm icon **bị cấm**"_ + §7 _"❌ Màu ở ngoài bàn cờ"_. Vi phạm token đã chốt                                                                                                                                                                           |

## Đẩy sang backlog, kèm dẫn chứng

Không làm ở đây, và **lý do không làm** quan trọng ngang việc làm:

| Phát hiện                                                       | Vì sao hoãn                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PH-04 High** — mốc định vị cho bàn lớn, neo HUD khi cuộn      | Cần mockup ba bề rộng và một quyết định thị giác thật (mốc là số hàng/cột? minimap? viền màu?). `MASTER.md` §3 cấm co bàn, nên không có đáp án hiển nhiên. Đây là **feature**, không phải sửa lỗi — và nó đánh vào chỉ số thành công §6.1 nên đáng một vòng brainstorm riêng                                                                                                                                                                       |
| **PH-03 (phần còn lại)** — phản hồi cho mọi thao tác bị từ chối | F2 đã lấy đi nguồn im lặng lớn nhất. Phần còn lại (`F` trên ô đã mở, chord chưa đủ cờ) cần một cơ chế phản hồi dùng chung mà reducer hiện chưa báo được "vừa từ chối" — đổi giao diện reducer là việc có rủi ro, xứng đáng một PR riêng có test riêng                                                                                                                                                                                              |
| **PH-07 Medium** — kỷ lục ra màn hình chính                     | Câu hỏi sản phẩm: kỷ lục là dữ liệu của cài đặt hay một phần của màn chơi? Kèm PH-08 (dòng "Dễ: 9×9" trông như nút) vì cả hai cùng nói về nửa dưới màn hình đang trống                                                                                                                                                                                                                                                                             |
| **PH-11 Medium** — wordmark không giải mã được                  | **Không làm.** Không ai bỏ cuộc vì cái tên; cả hai persona nhận ra trò chơi từ cái lưới. Đổi tên là quyết định thương hiệu, mà thương hiệu vừa đổi 08.09.2026                                                                                                                                                                                                                                                                                      |
| **PH-12 Low** — số 2 và số 3 dễ lẫn                             | **Không làm, và ghi rõ là cố ý.** `MASTER.md` §0–§1 thắng: chữ số là kênh chính, màu là kênh phụ; `--num-2` 5.08:1, `--num-3` 4.75:1, cặp khó nhất đo được là 5 vs 6 chứ không phải 2 vs 3. Persona rối loạn nhận màu chạm đúng cặp này và kết luận **ngược lại**: _"nó là chữ số, tôi đọc hình dạng con số chứ không đọc màu... Đó là cách làm đúng."_ Nhường thói quen của người chơi lâu năm là phá signature element và phá `overview.md` §6.2 |
| Middle dot nối chuỗi meta                                       | Vi phạm `MASTER.md` §7 nhưng không persona nào vấp, và sửa nó chạm vào mọi chuỗi meta cùng lúc. Nợ kỹ thuật, không phải lỗi                                                                                                                                                                                                                                                                                                                        |

## Ràng buộc phải giữ nguyên khi sửa

Từ `invariants.md` — mỗi cái đều nằm trên đường đi của ít nhất một thay đổi ở trên:

- **#1** `src/game/core/` không import React/DOM. F1 (`custom.ts`) và F2 (`touchGesture.ts`) đều ở tầng core → test phải chạy được không cần jsdom.
- **#7** Sau khi thắng/thua, **mọi** action trong reducer là no-op. F3 đổi cách đóng bảng kết quả — đóng bảng **không** được làm bàn sống lại.
- **#9** Không viết hex thẳng trong code, chỉ `var(--…)`. F3, F5, F7, F10 đều đụng CSS.
- **ADR-0004** phân nhánh theo `pointerType`, không theo user-agent. F2 sửa `tapKind` nằm trong máy trạng thái chạm — **không** được đụng nhánh chuột.
- **ADR-0007** bàn tuỳ chỉnh không ghi kỷ lục. F3 hiện thời gian trên bảng thua — **không** được kéo theo việc ghi kỷ lục.

## Sai lệch có chủ đích khỏi `feature-flow`

Skill bắt buộc một **cổng duyệt mockup có người duyệt** trước khi lập kế hoạch. Người dùng
đã chỉ thị rõ trong lượt này: _"bạn tự quyết định mọi thứ mà không cần hỏi lại"_. Chỉ thị
của người dùng thắng skill, nên cổng đó được bỏ qua **có ý thức**, và đây là ghi nhận của
việc đó.

Bỏ cổng duyệt cũng là một lý do nữa để phạm vi nhánh này chỉ gồm **khiếm khuyết**: một
khiếm khuyết có đáp án đúng/sai kiểm chứng được bằng test, còn một thay đổi thị giác thì
không — và thay đổi thị giác mà không ai duyệt là đúng thứ cổng đó sinh ra để chặn.
