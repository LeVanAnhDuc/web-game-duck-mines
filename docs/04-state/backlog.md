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

**Brainstorm toàn dự án — xong phần thiết kế, chưa có dòng code nào.**

Đang ở branch `chore/design-bootstrap`. Đã chốt và đã ghi: luật chơi, kiến trúc
(`core/` thuần tách khỏi React), 9 bất biến, palette + typeface đã đo tương phản
(`MASTER.md` + `ADR-0001`), rà `nfr.md`, và bốn tier-1 doc.

**Dừng ở:** cổng duyệt mockup của `feature-flow` §1.3–1.5 cho feature `core-game`.
Wireframe ASCII đã duyệt; canvas đã dựng và đã publish —
`https://claude.ai/code/artifact/6cf98b19-3c5b-41f7-8184-765ef4ea9cf9`
(10 artboard: đang chơi / thua / thắng × 375 · 768 · 1440, cộng một artboard dark
theme ở 1440). **Đang chờ duyệt tường minh.** Chỉ sau khi duyệt mới viết
`docs/specs/core-game/design.md` rồi `plan.md`.

Nguồn của canvas nằm ở `.design/` — **gitignored có chủ ý**, vì `.claude/CLAUDE.md`
quy định mockup không để lại dấu vết trong repo: `gen.py` là luật
chơi + solver, `pages.py` sinh 10 file `.dc.html` + `canvas.json`, `check.py` kiểm
thế bàn. Sửa mockup = sửa `.dc.html` rồi seed lại bằng `seed-canvas.mjs` của skill
`design`, publish lại **cùng đường dẫn file** để giữ nguyên URL.

**Đang chặn:** repo **chưa có `origin`**. Quy ước là branch từ `origin/main` mới nhất
vào worktree, chưa làm được. MCP `github` phiên 03.09.2026 lỗi xác thực
(`Authorization header is badly formatted`) → phải tạo repo bằng `gh` CLI hoặc tạo tay
rồi `git remote add`. Không chặn việc thiết kế, chặn việc mở PR.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Tạo repo GitHub `web-game-minesweeper`, `git remote add origin` | — | cao | Chặn mọi PR. Càng để lâu càng nhiều commit phải hoà giải về sau |
| Feature `core-game`: canvas → `design.md` → `plan.md` → build | FR-01..08, FR-11 | cao | Xong feature này là đã có game chơi được bằng chuột và bàn phím; ba feature sau mở rộng chứ không sửa nền |
| Feature `settings-records` | FR-09, FR-10, FR-14 | trung bình | Không có nó thì không đo được chỉ số thành công thứ nhất (kỷ lục theo độ khó) |
| Feature `touch` | FR-12, FR-13 | trung bình | Là lý do dự án tồn tại, nhưng cần bàn chạy được trước mới thử được trên máy thật |
| Feature `deploy` | FR-15 | thấp | Làm cuối, nhưng `next.config.ts` phải có `output: "export"` **từ commit đầu** — thêm sau thì phát hiện ra một loạt thứ không xuất tĩnh được |

## Nợ kỹ thuật — cố ý làm tạm

Chưa có dòng code nào, nên chưa nợ gì. Ba thứ dưới đây là **hoãn có chủ ý**, không
phải nợ — ghi ở đây để không phải brainstorm lại:

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| Theme retro Win95 làm theme thứ hai | Chỉ có một bộ token (hiện đại) | Hai bộ token nghĩa là mọi mockup kiểm hai lần và `MASTER.md` phải định nghĩa token theo vai trò chứ không theo màu — `MASTER.md` **đã** làm vậy, nên thêm về sau không phải viết lại | Không bao giờ buộc. Chỉ khi có người thật xin |
| Lưu bàn đang chơi khi tab bị kill | Đóng tab là mất bàn | Bản gốc cũng vậy, và là Non-Goal | Nếu chơi thật trên điện thoại mà hệ điều hành kill tab thường xuyên tới mức mất bàn giữa lúc chơi |
| Phương án C — ghi trạng thái ô thẳng vào DOM, React không quản ô | Đang dùng phương án A: `memo` + prop nguyên thuỷ | Phương án C có hai nguồn sự thật (reducer + DOM sửa tay), đúng loại lỗi "test xanh mà kết quả sai" | Chỉ khi đo ra `NFR-PERF-06` không đạt trên bàn Khó. Đo trước, đừng đoán |
