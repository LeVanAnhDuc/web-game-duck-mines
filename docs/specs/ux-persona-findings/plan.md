# Kế hoạch — sửa phát hiện UX từ lượt persona 12.09.2026

> **Đây là bản ghi thực thi, không phải bản kế hoạch viết trước.** Nó được giữ như một
> danh sách kiểm trong lúc làm, không phải dựng trước rồi mới code — ghi rõ để người đọc
> sau không hiểu nhầm thứ tự. Lý do: phạm vi nhánh này là **khiếm khuyết đã kiểm chứng**,
> mỗi cái có một đáp án đúng/sai và một test chứng minh; phần cần kế hoạch thật (mốc định
> vị bàn lớn, phản hồi thao tác bị từ chối) đã bị đẩy sang `backlog.md` §Việc tiếp theo
> đúng vì nó **không** có đáp án hiển nhiên.

Thiết kế: [`design.md`](design.md) · Dẫn chứng: [`ux-feedback-2026-09-12.md`](ux-feedback-2026-09-12.md)

## Tầng core — có test thuần, không cần DOM (bất biến #1)

- [x] **F2** `tapKind()`: ô đã mở luôn `chord`, kiểm trước khi đọc chế độ
  - [x] test đỏ trước: `still chords an OPEN cell in flag mode`
  - [x] sửa `src/game/input/touchGesture.ts`
  - [x] [ADR-0012](../../decisions/0012-open-cell-always-chords.md)
- [x] **F1** `clampCustom` thôi chạy mỗi phím gõ
  - [x] `NumberField` giữ chuỗi đang gõ, chỉ commit giá trị trong khoảng, kẹp khi `blur`
  - [x] viết lại 2 test cũ (chúng khẳng định hành vi cũ) + thêm 3 test mới
  - [x] cập nhật comment `custom.ts` — nó đang bảo vệ lựa chọn vừa bị đảo
  - [x] [ADR-0011](../../decisions/0011-clamp-custom-fields-on-commit.md)

## Tầng view

- [x] **F3** bảng kết quả
  - [x] `Esc` đóng bảng thay vì tạo bàn mới; state `dismissed`, reset khi có kết quả mới
  - [x] nút đóng trong hàng tiêu đề
  - [x] hiện thời gian cả khi **thua**, không chỉ khi thắng
  - [x] `.ms-scrim--result { pointer-events: none }` — thôi chắn header; sheet cài đặt **giữ** scrim chắn vì nó thật sự modal
  - [x] viết lại test `starts a new board on Esc` + 2 test mới
- [x] **F4** xác nhận bỏ bàn tự nhận focus · radio đang chờ có `data-pending`
- [x] **F5** dòng gợi ý: bàn phím đứng trước · 13px, `--fg-default` · thêm `hintChord` đặt tên đường chord không cần chuột giữa
- [x] **F6** `playRulesNote` trong § Lối chơi — khai báo luật gốc, cùng kiểu với ghi chú âm thanh đã có
- [x] **F7** footer đứng tên + link mã nguồn
- [x] **F9** `.ms-page { height: 100dvh }` + `.ms-viewport { min-height: 0 }` — bàn cuộn dọc trong khung, trang không cuộn
- [x] **F10** bỏ emoji ❓ khỏi nhãn (`MASTER.md` §5 cấm emoji làm icon)
- [x] **F8** `src/app/icon.svg` (hết 404 favicon) · `id`/`name` cho ba ô nhập (hết cảnh báo console, `NFR-A11Y-04`)

## Ngoài phạm vi phát hiện, nhưng chặn việc

- [x] `.eslintrc.json` thêm `"root": true` — không có nó thì `yarn lint` **hỏng trong mọi
      worktree**, vì worktree nằm dưới `<repo>/.worktrees/` và ESLint đi ngược lên gặp
      config của repo cha. Lint hỏng đúng ở nơi nó cần chạy nhất

## Tài liệu

- [x] `docs/specs/ux-persona-findings/ux-feedback-2026-09-12.md` — báo cáo đầy đủ
- [x] `journeys.md` US-05 — "chặn ngay lúc nhập" → "cho biết ngay lúc nhập"; câu cũ mô tả đúng thứ vừa bị thay
- [x] `backlog.md` §Đang làm · §Việc tiếp theo (3 việc hoãn, kèm dẫn chứng) · §Nợ kỹ thuật (3 mục cố ý không sửa)
- [x] README `## Features` — 4 chỗ đang mô tả sai thực tế sau khi sửa
- [ ] `scope.md` — **không đổi.** Không có FR mới: cả 10 thay đổi đều là sửa hành vi của FR-03/04/05/10/12/16 đã `xong`

## Kiểm chứng

- [x] unit **293** pass (mốc trước: 287)
- [x] e2e **207** pass trên năm project (mốc trước: 202); 1 test cũ viết lại, 1 test mới
- [x] typecheck sạch · lint sạch
- [x] first-load JS **112.6 kB** / 200 kB (`NFR-PERF-07`; mốc trước 112.0)
- [x] nhìn app thật ở 375 · 390 · 768 · 1440 — không bề rộng nào làm trang cuộn ngoài ý muốn
- [x] tái hiện đúng ca của p04: gõ `2` → `2`, gõ `24` → `24`, nhãn ra `Tuỳ chỉnh: 24×30`
- [x] tái hiện đúng ca của p05-blind: bàn 24×30 cao 1214px trong khung 529px → khung cuộn, trang không cuộn, HUD ở nguyên
- [x] tái hiện đúng ca của p02: `Esc` đóng bảng mà **giữ nguyên 56 ô đã mở**; bánh răng bấm được trong lúc bảng hiện
