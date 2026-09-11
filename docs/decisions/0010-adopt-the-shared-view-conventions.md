# ADR-0010 · Nhận bộ quy ước view dùng chung của workspace `web-game`

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** ADR-0005 · ADR-0007 · [`docs/code-conventions.md`](../code-conventions.md)

## 1. Bối cảnh

Mười một project `web-game-duck-*` mỗi cái tự đặt quy ước khi cần, nên đọc xong repo
này không giúp gì cho việc đọc repo kế bên. Bộ quy ước dùng chung rút từ
`quapp-developer-frontend`, lọc qua hai lần áp thật (`duck-caro`, `duck-flap`) rồi mới
tới đây.

Ở repo này, ba chỗ lệch:

- `mains/` chứa file trơ (`ModeBar.tsx`, `ResultDialog.tsx`, `SettingsSheet.tsx`) và
  cả một component lồng trong thư mục của main khác (`mains/Board/Cell.tsx`).
- `views/Home/index.tsx` giữ ba `useEffect` đồng bộ, một trong số đó kèm `useRef`
  chống ghi trùng.
- Khối `<header>` viết thẳng trong `index.tsx`.

## 2. Quyết định

Theo [`docs/code-conventions.md`](../code-conventions.md):

- `Cell` · `ModeBar` · `ResultDialog` · `SettingsSheet` → `views/Home/components/`,
  mỗi cái một thư mục + `index.tsx`. Test đi theo, đổi tên khớp source.
- Ba effect thành ba ghost: `SettleResult` · `ResetCursorOnResize` ·
  `SyncFocusToCursor`.
- `<header>` inline → `mains/Header`.
- Thêm barrel `hooks/index.ts`, năm luật ESLint chung, `.githooks/pre-commit`.

**Giữ nguyên** kiểu named export và cấu hình Prettier của repo — rule chỉ yêu cầu nhất
quán *trong* một repo.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Gom ba effect vào một hook `useHomeEffects` | Đổi chỗ đống rối và giấu nó sau một cái tên không nói gì. Ghost thì mỗi cái một tên, một trách nhiệm, nhìn thấy được trong cây JSX |
| Giữ `Cell.tsx` trong `mains/Board/` | Đó là tầng thứ ba không có trong rule. Một người tìm `Cell` sẽ tìm ở `components/` trước |
| Không đụng gì, chỉ thêm luật ESLint | ESLint không bắt được "file này làm quá nhiều việc" |

## 4. Hệ quả

**Được:**
- `views/Home/index.tsx` không còn `useEffect` nào; ba việc nền có tên riêng.
- Khoá chống ghi trùng (`settled`) nằm cùng chỗ với effect nó bảo vệ.

**Mất / phải chấp nhận:**
- **Thứ tự ghost trong JSX = thứ tự chạy effect**, và ghost phải render **vô điều
  kiện**. Cả hai sai âm thầm: xê dịch mấy dòng ghost là đổi thứ tự ghi kỷ lục / đặt
  lại con trỏ, mà test vẫn xanh.
- Ghost đẩy state qua props, nên mỗi cái thêm vài dòng nối dây trong `index.tsx`.

**Điều kiện xem lại:** nếu số ghost trong một view vượt quá mức đọc được trong một màn
hình (khoảng 8-10) thì vấn đề là view đang giữ quá nhiều trách nhiệm — lúc đó tách
view, không tách thêm ghost.
