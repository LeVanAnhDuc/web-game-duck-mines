---
name: ux-persona-review
description: Use when you want to know how a real stranger experiences Duck Mines — dispatches blind persona subagents that actually drive the running app in a browser, captures their first five seconds and their gut reaction, then returns UX/UI findings mapped to ISO 9241-11, LATCH, trigger words, interaction design, visual hierarchy, form design, visual craft and trust/desirability, every finding backed by a quote or a screenshot from a session log. Trigger on "chay persona", "test UX", "nguoi dung that thay sao", "UI co dep khong", "an tuong dau", "UX review", "red route", or before opening a PR that changes user-facing behaviour.
---

# Duck Mines — UX persona review

## Sản phẩm này

- Thư mục: `D:/Learn/web-app-ecosystem/web-game/web-game-minesweeper`
- Port: `:3000` (`yarn dev`). ⚠️ **Trùng port với client của Ducker ID** — luôn kiểm dấu
  hiệu nhận biết bên dưới trước khi cho persona bắt đầu. Suite e2e dùng `:4173` (bản
  xuất tĩnh trong `out/`), không phải port này.
- Bật app: `yarn dev` — hoặc, nếu muốn đúng thứ người chơi thật gặp (basePath GitHub
  Pages, không có HMR): `yarn build && node scripts/serve.mjs 4173 out`
- Dấu hiệu nhận biết đúng app: tiêu đề tab là **Duck Mines**, và ngay khi mở đã thấy một
  **lưới ô vuông chưa mở** kèm hai số đếm ở đầu trang (số mìn còn lại và đồng hồ đang
  đứng ở 0). Toàn bộ chữ trên màn hình là **tiếng Việt**. Nếu thấy màn hình đăng nhập
  hoặc bảng quản trị thì đó là Ducker ID, không phải app này.
- Email dùng-một-lần cho persona: **không cần.** App không có ô nhập email nào, không
  gửi gì ra ngoài.
- Tài khoản thử (nếu Red Route cần đăng nhập): **không có, và sẽ không bao giờ có.**
  "Không đăng nhập, không tài khoản, không server" là Non-Goal ở
  `docs/01-product/overview.md` §4. Red Route nào cần đăng nhập là Red Route viết sai.

### Ba thứ riêng của sản phẩm này, biết trước thì đỡ chấm nhầm

1. **Không có onboarding, và đó là chủ ý.** "Không dạy luật, không tutorial, không màn
   hình onboarding" là Non-Goal. Persona không biết luật dò mìn sẽ lạc — đó là kết quả
   đúng, không phải lỗi UX. Chỉ tính là phát hiện khi người **đã biết luật** vẫn vấp.
2. **Trạng thái sống trong `localStorage`, không có backend.** Muốn chạy lại từ đầu thì
   xoá `minesweeper.records.v1` và `minesweeper.settings.v1`, hoặc mở tab ẩn danh. Persona
   thứ hai kế thừa độ khó và theme của persona thứ nhất nếu dùng chung profile trình duyệt.
3. **Hai đường vào khác hẳn nhau.** Chuột (chuột phải cắm cờ, chuột giữa chord, bàn phím
   đầy đủ) và ngón tay (chạm hai pha, giữ để cắm cờ, thanh chế độ Mở/Cờ, pan/zoom). Một
   persona chỉ đi được một đường. Dàn persona phải phủ cả hai, và persona điện thoại phải
   chạy ở viewport hẹp thật — `mobile-375` là mốc mà suite e2e đang dùng.

## Chạy

Toàn bộ quy trình nằm ở `lib/orchestration.md`. Đọc nó trước, rồi làm theo.

Dữ liệu riêng của sản phẩm này:

| Cần gì | Ở đâu |
| --- | --- |
| Red Route đã chốt | `references/red-routes.md` |
| Dàn persona | `references/personas/` |
| Rule đã dùng để sinh persona | `references/persona-rules.md` |
| Khung đánh giá, luật xếp hạng | `lib/frameworks.md` |
| Thứ tự công cụ trình duyệt | `lib/browser-capability.md` |
| Token màu/chữ của project (thắng cảm nhận thẩm mỹ chung) | `docs/design-system/minesweeper/MASTER.md` |
| Bất biến — vi phạm thì sai âm thầm | `docs/03-design/invariants.md` |

## Hai agent

`ux-persona` (Sonnet, chỉ có trình duyệt) đóng vai người dùng.
`ux-expert` (Opus, chỉ có Read) dịch log sang khung đánh giá.

Cả hai định nghĩa ở `D:/Learn/web-app-ecosystem/web-game/web-game-minesweeper/.claude/agents/`.
Nếu Claude Code báo không tìm thấy agent type, phiên hiện tại được mở trước khi hai file
đó tồn tại — khởi động lại phiên.

## Bảo trì

Nâng cấp phần logic: `bash D:/Learn/web-app-ecosystem/.claude/skills/ux-persona-lab/scripts/install.sh D:/Learn/web-app-ecosystem/web-game/web-game-minesweeper --update`
Lấy lại rule persona mới: cùng lệnh với `--refresh-rules`.
Cả hai đều **không** đụng tới `red-routes.md` và `personas/`.
