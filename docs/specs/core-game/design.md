# Thiết kế · feature `core-game`

**Liên quan:** FR-01 · FR-02 · FR-03 · FR-04 · FR-05 · FR-06 · FR-07 · FR-08 · FR-11
· US-01 · US-02 · NFR-PERF-05 · NFR-PERF-06 · NFR-PERF-07 · NFR-A11Y-01 · NFR-A11Y-02
· NFR-A11Y-04 · NFR-A11Y-05 · NFR-A11Y-07 · NFR-I18N-01 · NFR-SEC-02
· [ADR-0001](../../decisions/0001-design-tokens.md)
· [ADR-0002](../../decisions/0002-dom-board-not-canvas.md)
· [ADR-0003](../../decisions/0003-mines-planted-after-first-move.md)
· [ADR-0005](../../decisions/0005-timer-outside-gamestate.md)

Tài liệu này **không nhắc lại** luật chơi đã chốt, bảng token, hay ngưỡng phi chức
năng — chúng ở trong các file trên, tham chiếu bằng ID. Đây chỉ là: dữ liệu hình dạng
gì, hàm nào làm gì, và cái gì được test bằng cách nào.

## 1. Phạm vi

**Trong:** scaffold dự án Next.js, toàn bộ `game/core/`, bàn cờ vẽ được, HUD, đồng hồ,
bàn mới, điều khiển chuột và bàn phím đầy đủ trên desktop.

**Ngoài — và cố ý ngoài:**

| Không thuộc feature này | Thuộc về |
| --- | --- |
| Kỷ lục, sheet cài đặt, đổi độ khó trong UI, bật/tắt dấu hỏi, nút sáng/tối | `settings-records` |
| Chạm hai pha, thanh chế độ Mở/Cờ, long-press, pan/zoom | `touch` |
| Workflow deploy GitHub Pages | `deploy` |

Hai điều kéo từ feature sau về đây vì thêm sau sẽ phải viết lại:

- **`next.config.ts` có `output: "export"` từ commit đầu.** Thêm về sau sẽ phát hiện
  ra một loạt thứ không xuất tĩnh được (đã ghi ở `backlog.md`).
- **CSS variable cho **cả hai** theme trong `globals.css` từ đầu**, kèm
  `@media (prefers-color-scheme: dark)`. Feature `settings-records` chỉ thêm phần
  *ghi đè* lựa chọn, không thêm token. Token định nghĩa theo vai trò
  ([ADR-0001](../../decisions/0001-design-tokens.md)) nên việc này không phải nợ.

Độ khó ở feature này **cố định `beginner`**, không có UI đổi. Nhưng `core/` nhận
`Difficulty` làm tham số ngay từ đầu — không hardcode 9×9 ở đâu cả.

## 2. Hình dạng dữ liệu

Bàn Khó có 480 ô, và mọi ô là một component React
([ADR-0002](../../decisions/0002-dom-board-not-canvas.md)). Nên bàn **không** là mảng
object; nó là ba `Uint8Array` phẳng, đánh chỉ số `i = r * cols + c`:

```ts
type Difficulty = "beginner" | "intermediate" | "expert";
type GameStatus  = "idle" | "playing" | "won" | "lost";

/** 0 = chưa mở · 1 = đã mở · 2 = cắm cờ · 3 = dấu hỏi */
type Mark = 0 | 1 | 2 | 3;

type Board = {
  cols: number;
  rows: number;
  mineCount: number;
  /** null cho tới khi có nước đầu — xem ADR-0003. Không phải mảng rỗng. */
  mines: Uint8Array | null;
  /** số mìn kề, chỉ có nghĩa khi mines !== null */
  adj: Uint8Array;
  marks: Uint8Array;
};

type GameState = {
  difficulty: Difficulty;
  board: Board;
  status: GameStatus;
  /** mốc nước đầu. Đồng hồ KHÔNG ở đây — xem ADR-0005 */
  startedAt: number | null;
  endedAt: number | null;
  /** CHỈ SỐ ô mìn đã nổ (không phải mốc thời gian), để vẽ ô ồn nhất */
  explodedIndex: number | null;
};
```

**Vì sao `Uint8Array` chứ không `Cell[]`:** ô truyền xuống React thành **hai số**
(`mark` và `adj`) — đúng prop nguyên thuỷ mà bất biến #4 đòi. Mảng object thì mỗi ô là
một reference mới sau mỗi nước đi và `memo` mất tác dụng im lặng. Bất biến vẫn giữ
được: reducer `slice()` mảng cũ (480 byte, không đáng kể) chứ không sửa tại chỗ.

**`mines: null` là một trạng thái thật, không phải giá trị thiếu.** Mọi hàm đọc
`board` phải chịu được nó. Đây là hệ quả trực tiếp của
[ADR-0003](../../decisions/0003-mines-planted-after-first-move.md) và là chỗ dễ sai
nhất của feature này.

## 3. Reducer thuần — và cách nó không cần đồng hồ

`architecture.md` §3 cấm `core/` gọi `Date.now()` và `Math.random()`. Nên **thời gian
và seed đi vào bằng action**, không phải bằng cách reducer tự lấy:

```ts
type Action =
  | { type: "reveal"; index: number; at: number; seed: number }
  | { type: "mark";   index: number; allowUnsure: boolean }
  | { type: "chord";  index: number; at: number }
  | { type: "reset" };
```

`at` là `Date.now()` do `useGame` cấp. `reveal` và `chord` cần nó vì chúng có thể mở
đầu bàn (đặt `startedAt`) hoặc kết thúc bàn (đặt `endedAt`); `mark` không bao giờ đổi
trạng thái lượt chơi nên không cần.

`allowUnsure` đi theo action **chứ không nằm trong `GameState`**, cùng một lý do: nó là
một cài đặt của người chơi, và cài đặt thuộc feature `settings-records`. Ở feature này
`useGame` truyền cứng `false`. Khi feature sau tới, nó chỉ đổi chỗ lấy giá trị — reducer
không phải sửa một dòng nào.

**`seed` cũng đi theo action `reveal`, không nằm trong `GameState`.** Bản đầu của thiết
kế này để `seed` trong state và cho `useGame` `reset` lại ở `useEffect` lúc mount; e2e
bắt được cái giá của nó: **một cú click rơi vào khoảng giữa hydrate và effect đó sẽ bị
`reset` xoá mất**. Hai trong hai mươi seed của test nước-đầu-không-nổ trượt vì đúng
chuyện này. Đọc seed ngay lúc bấm thì khoảng trống đó không còn tồn tại, và `GameState`
bớt được một field nó không cần sau khi mìn đã sinh.

Máy trạng thái:

```
idle ──reveal/chord──> playing ──mở phải mìn──> lost
                          │
                          └──mở hết ô an toàn──> won

lost, won ──mọi action trừ reset──> KHÔNG ĐỔI GÌ   (bất biến #7)
lost, won ──reset──> idle
```

Ở `idle`, `reveal` làm ba việc theo đúng thứ tự: `plantMines(action.seed, index)` →
`reveal(index)` → đặt `startedAt = at`, `status = "playing"`. `chord` ở `idle` là
no-op — không có số nào để chord.

## 4. Hàm trong `core/`

| File | Hàm | Ghi chú |
| --- | --- | --- |
| `rng.ts` | `mulberry32(seed): () => number` | Nguồn random duy nhất (bất biến #5) |
| `constants.ts` | `DIFFICULTIES` | 9×9/10 · 16×16/40 · 30×16/99 |
| `board.ts` | `createBoard(difficulty)` | `mines: null`, `marks` toàn 0 |
| | `plantMines(board, seed, safeIndex)` | Loại trừ `safeIndex` + 8 ô kề. **Fisher–Yates một lượt trên danh sách ô hợp lệ**, không phải vòng lặp thử-lại — xem ADR-0003 |
| | `countAdjacent(board)` | Điền `adj` sau khi đặt mìn |
| | `neighbours(i, cols, rows)` | 8 ô kề, đã kẹp biên. Mọi thứ khác dùng lại nó |
| `reveal.ts` | `reveal(board, i)` | Flood fill **dùng stack tường minh**, không đệ quy |
| | `chord(board, i)` | Trả `{ board, exploded }` |
| `mark.ts` | `cycleMark(board, i, allowUnsure)` | `allowUnsure` là tham số, không phải cờ toàn cục |
| `rules.ts` | `isWon(board)` | Đếm ô đã mở == `cols*rows - mineCount` |
| | `revealAllMines(board)` | Hiện mọi mìn chưa cắm cờ. **Không xoá cờ đã cắm** (bất biến #6). Không cần `explodedIndex` — nó ở `GameState`, chỉ dùng để vẽ |
| | `minesRemaining(board)` | `mineCount − số cờ`, âm được (FR-06) |
| `reducer.ts` | `reducer(state, action)` | Thuần. Không import gì ngoài `core/` |

**Flood fill dùng stack, không đệ quy.** Trên bàn Khó vùng lớn nhất có thể tới hàng
trăm ô; độ sâu đệ quy đó chưa tràn stack ở trình duyệt hiện tại, nhưng vòng lặp rẻ hơn
và không có ngưỡng nào phải đoán. Nó dừng ở ba chỗ: biên bàn, ô có số > 0, và **ô đang
cắm cờ** — chỗ thứ ba là chỗ hay bị bỏ.

**`isWon` đếm ô đã mở, không đếm cờ.** Cắm đủ 99 cờ đúng chỗ mà chưa mở hết ô an toàn
thì **chưa thắng**. Bản clone nào cho thắng ở đó là đếm sai — và `journeys.md` US-01
§Điều gì có thể sai đã ghi.

**`chord` có ba nhánh, không hai:** số cờ kề khớp con số → mở mọi ô kề chưa cờ, và
**nổ nếu một trong số đó là mìn** (cờ cắm sai chỗ); số cờ kề không khớp → không làm gì,
không nổ; ô chưa mở hoặc ô số 0 → không làm gì.

## 5. Vẽ

```
views/Home/index.tsx
  mains/Hud/{index,MineCounter,Timer,ResetButton}.tsx
  mains/Board/{index,Cell}.tsx
hooks/{useGame,useTimer,useBoardCursor}.ts
```

**`Cell` chỉ nhận số và hàm ổn định:**

```ts
type CellProps = {
  index: number;
  mark: Mark;          // số
  adj: number;         // số
  exploded: boolean;   // boolean
  wrongFlag: boolean;  // boolean, chỉ true khi đã thua
  focused: boolean;    // boolean
  onAct: (index: number, kind: ActKind) => void;  // ổn định qua useCallback
};
```

`onAct` là **một** callback cho cả ba hành động, `kind` phân biệt. Truyền ba callback
riêng thì mỗi ô giữ ba reference và cái nào lỡ tạo mới cũng phá `memo`. `onAct` được
`useCallback` với dependency là `dispatch` — thứ React đảm bảo ổn định.

**Con trỏ bàn phím không nằm trong `GameState`.** Nó là trạng thái UI, ở
`useBoardCursor`. Bàn cờ là một `role="grid"` với `tabIndex=0` trên đúng **một** ô
(pattern roving tabindex) — 480 tab stop là không dùng được bằng bàn phím dù về lý
thuyết là "truy cập được".

Cạnh ô tính bằng CSS thuần: bàn có `width` theo `clamp()` và
`grid-template-columns: repeat(cols, minmax(0, 1fr))`, kẹp dưới 22px theo `MASTER.md`
§3. Không đo bằng JavaScript, không `ResizeObserver` — không có gì cần đo.

Vì độ khó khoá ở `beginner` (mục 1), **bàn luôn vừa chiều rộng ở mọi bề rộng màn hình**
trong feature này. Bàn `expert` ở 375px cần pan/zoom và cần kẹp 22px thật sự — đó là
FR-13, feature `touch`. Ở đây CSS chỉ cần đúng, chưa cần chịu tải.

**`useTimer`** giữ giây trong state của chính nó, đọc `startedAt` từ `GameState`, và
tính bằng **hiệu hai mốc** chứ không đếm tick
([ADR-0005](../../decisions/0005-timer-outside-gamestate.md)). Nó tự dừng khi `status`
khác `playing`. Số giây ghi kỷ lục (feature sau) tính từ `endedAt - startedAt`, không
lấy từ số đang hiện.

## 6. Xử lý lỗi

Không mạng, không server, không `localStorage` ở feature này → **không có nhánh lỗi
nào**. Không loading, không timeout, không retry, không error boundary.

Đầu vào không hợp lệ (`index` ngoài biên, `reveal` ô đã mở, `mark` ô đã mở) là **no-op
im lặng ở reducer**, không ném lỗi. Reducer là hàm thuần được gọi từ UI của chính
mình; ném lỗi ở đó chỉ làm sập cây React vì một cú bấm vô hại.

## 7. Test

Toàn bộ `core/` test được không cần jsdom. Đó là lý do có bất biến #1.

**Test đáng tin nhất của dự án — cạn kiệt, không lấy mẫu:** với **từng độ khó** và
**từng ô** làm nước đầu (81 · 256 · 480 lần), khẳng định (a) đúng `mineCount` quả mìn,
(b) không mìn nào trong vùng 3×3 quanh ô đó, (c) `adj[i]` khớp số mìn kề thật ở mọi ô.
Đây là cách duy nhất kiểm được FR-01 mà không phụ thuộc may mắn của seed.

| Nhóm | Khẳng định gì |
| --- | --- |
| `reveal` | dừng ở biên · dừng ở ô có số · **không đi qua ô cắm cờ** · vùng 0 mở hết đúng một lần |
| `chord` | đủ cờ đúng chỗ → mở; đủ cờ **sai** chỗ → **nổ**; thiếu cờ → no-op; ô số 0 → no-op |
| `cycleMark` | `allowUnsure=false` cho chu kỳ 2 bước; `true` cho 3 bước; ô đã mở → no-op |
| `isWon` | đủ cờ mà chưa mở hết → **chưa thắng**; mở hết ô an toàn dù còn 0 cờ → thắng |
| `reducer` | `idle` + `reveal` đặt `startedAt` và sinh mìn · sau `won`/`lost` mọi action trừ `reset` **không đổi state (so sánh reference)** · `reset` về `idle` |
| `revealAllMines` | cờ đã cắm giữ nguyên `mark === 2`, kể cả cờ cắm đúng |
| bench | reveal vùng lớn nhất bàn Khó < 16ms (NFR-PERF-05) |

`NFR-PERF-06` (< 50ms từ chạm đến vẽ xong) **không đo được bằng unit test** — nó là
thời gian React reconcile 480 ô. Đo ở bước 5 của `feature-flow` bằng React Profiler
trên app đang chạy, không phải trong vitest. Nếu không đạt thì phương án C ở
`backlog.md` §Nợ kỹ thuật là đường thoát đã chuẩn bị sẵn.

**Ba test hồi quy cho ba bất biến vô hình:**

1. `core/**/*.ts` không được chứa `import ... from "react"`, `"next"`, `Date.now`,
   `Math.random`, `document`, `window` — kiểm bằng đọc file trong vitest, không phải
   bằng lint. Đây là bất biến #1 và #5 biến thành test.
2. `GameState` không có field nào tên `elapsed*`, `seconds*`, `now*` — bất biến #3.
3. Snapshot mọi `--num-*` và `--edge-cell-tile` trong `globals.css` khớp bảng trong
   `MASTER.md`, đo lại tương phản trong test — NFR-A11Y-01 tự canh gác thay vì phụ
   thuộc việc ai đó nhớ đo lại khi sửa một hex.

E2E Playwright ở 375/768/1024/1440: nước đầu không nổ (lặp 20 lần, mỗi lần seed khác),
thắng một bàn `beginner` có seed cố định qua `?seed=`, bàn phím đi hết bàn và focus
luôn thấy được, và một lần chụp **grayscale** để kiểm NFR-A11Y-07.

## 8. Giả định đã chốt trong tài liệu này

- **`?seed=` luôn bật, không phải cửa hậu chỉ cho test.** Tác dụng phụ là hai người
  chơi được đúng một bàn. Bàn là hàm của `(seed, ô bấm đầu)` — xem ADR-0003 §4.
- **Độ khó khoá ở `beginner`** cho tới feature `settings-records`; `core/` vẫn nhận
  `Difficulty` làm tham số.
- **Chuỗi hiển thị đi qua một module `strings.ts`** ngay từ đầu (NFR-I18N-01), không
  phải i18n framework — chỉ một object phẳng. Framework thêm sau nếu cần.
