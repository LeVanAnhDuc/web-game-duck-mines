# Kế hoạch hiện thực · feature `core-game`

> **Cho người/agent thực thi:** dùng `superpowers:executing-plans` hoặc
> `superpowers:subagent-driven-development`. Checkbox `- [ ]` là cách một phiên bị nén
> ngữ cảnh biết đang ở task mấy trên mấy — **tick ngay khi xong từng bước**, không để
> cuối.

**Mục tiêu:** một bàn Minesweeper mức Dễ chơi được hết một lượt bằng chuột và bàn phím,
đúng luật bản gốc, trên nền Next.js xuất tĩnh.

**Cách làm:** toàn bộ luật chơi là hàm thuần trong `src/game/core/` (không React, không
DOM), test bằng vitest không cần jsdom. React nhận một `GameState` bất biến rồi vẽ; mỗi
ô là một `<button>` đã `memo` chỉ nhận prop nguyên thuỷ.

**Tech stack:** Next.js 15 App Router · TypeScript · Tailwind 3 + CSS variables ·
`lucide-react` · Vitest 4 + happy-dom + @testing-library/react · Playwright · Yarn 1.

**Spec:** [`design.md`](design.md) — đọc trước, plan này lập luận từ nó.

## Ràng buộc toàn cục — áp cho MỌI task

- `src/game/core/**` **không** import `react`, `next`, và không dùng `document`,
  `window`, `Date.now`, `Math.random`. Task 7 biến điều này thành test.
- **Không viết hex màu trong `.ts`/`.tsx`.** Chỉ `var(--…)`. Bảng giá trị duy nhất là
  [`MASTER.md`](../../design-system/minesweeper/MASTER.md) §1.
- `Cell` **phải** `memo` và **chỉ** nhận prop nguyên thuỷ + một callback ổn định.
- Cạnh ô kẹp dưới **22px**; vùng bấm mọi control khác ≥ **44px**.
- Chuỗi hiển thị đi qua `src/lib/strings.ts`, không hardcode trong JSX.
- `next.config.ts` có `output: "export"` **từ commit đầu**.
- Conventional Commits, subject tiếng Anh. Không commit vào `main`.
- Sau **mỗi** task: `yarn test` xanh và `yarn typecheck` sạch trước khi commit.

---

### Task 1 · Scaffold chạy được

**Files** — Create: `package.json` · `tsconfig.json` · `next.config.ts` ·
`postcss.config.mjs` · `tailwind.config.ts` · `.eslintrc.json` · `.prettierrc` ·
`vitest.config.ts` · `playwright.config.ts` · `src/app/layout.tsx` ·
`src/app/page.tsx` · `src/app/globals.css` · `src/game/core/smoke.test.ts`.
Modify: `.gitignore`.

**Produces:** một cây dự án mà `yarn test`, `yarn typecheck`, `yarn build` đều chạy.

- [ ] **1.1** `yarn init -y`, rồi cài với dải major (để yarn tự chốt bản, đừng ghim tay):
  `yarn add next@^15 react@^19 react-dom@^19 lucide-react@^0.4` và
  `yarn add -D typescript@^5 @types/node@^22 @types/react@^19 @types/react-dom@^19 eslint@^8 eslint-config-next@^15 eslint-config-prettier@^9 prettier@^3 prettier-plugin-tailwindcss@^0.6 tailwindcss@^3 postcss@^8 autoprefixer@^10 vitest@^4 happy-dom@^20 @vitejs/plugin-react@^4 @testing-library/react@^16 @playwright/test@^1`
- [ ] **1.2** Viết `scripts`: `dev` `build` `start` `lint` `test` `test:watch`
  `test:e2e` `typecheck`.
- [ ] **1.3** `next.config.ts`: `output: "export"`, `trailingSlash: true`,
  `images: { unoptimized: true }`, `basePath`/`assetPrefix` bật theo
  `process.env.GITHUB_PAGES === "true"` với `basePath = "/web-game-minesweeper"`.
  Ghi biến đó vào `.env.example`.
- [ ] **1.4** `tsconfig.json` với `paths: { "@/*": ["./src/*"] }`, `strict: true`.
- [ ] **1.5** `vitest.config.ts`: `environment: "happy-dom"`, plugin react,
  alias `@` → `src`, `include: ["src/**/*.test.ts?(x)"]`.
- [ ] **1.6** `src/game/core/smoke.test.ts` — một test `expect(1 + 1).toBe(2)`. Chạy
  `yarn test`, phải PASS. Đây là bước chứng minh hạ tầng test chạy, không phải test thật.
- [ ] **1.7** `layout.tsx` nạp Archivo + IBM Plex Mono qua `next/font/google`,
  `globals.css` để rỗng (token vào ở task 8), `page.tsx` render một `<main>` trống.
- [ ] **1.8** `yarn typecheck` sạch, `yarn build` ra `out/`. Thêm `/out/`, `/.next/`,
  `/node_modules/`, `/test-results/`, `/playwright-report/` vào `.gitignore`.
- [ ] **1.9** Commit: `chore: scaffold next.js with static export and vitest`

---

### Task 2 · `types.ts` · `constants.ts` · `rng.ts`

**Files** — Create: `src/game/core/types.ts` · `constants.ts` · `rng.ts` ·
`rng.test.ts` · `constants.test.ts`. Delete: `smoke.test.ts`.

**Produces:** `Difficulty` `GameStatus` `Mark` `Board` `GameState` `Action` `ActKind`,
hằng `HIDDEN=0 REVEALED=1 FLAGGED=2 UNSURE=3`, `DIFFICULTIES`, `mulberry32(seed)`.

- [ ] **2.1** Test trước: cùng seed → cùng dãy 100 số; seed khác → dãy khác; mọi giá
  trị trong `[0, 1)`. Và `DIFFICULTIES` đúng 9×9/10 · 16×16/40 · 30×16/99.
- [ ] **2.2** Chạy, phải FAIL vì module chưa có.
- [ ] **2.3** Hiện thực `mulberry32`:

```ts
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **2.4** `yarn test` PASS, xoá `smoke.test.ts`.
- [ ] **2.5** Commit: `feat(core): add seeded rng, difficulty table and board types`

---

### Task 3 · `board.ts` — và test cạn kiệt của FR-01

**Files** — Create: `src/game/core/board.ts` · `board.test.ts`.

**Consumes:** task 2. **Produces:** `neighbours(i, cols, rows): number[]` ·
`createBoard(difficulty): Board` · `plantMines(board, seed, safeIndex): Board` ·
`countAdjacent(board): Board`.

- [ ] **3.1** Test `neighbours`: ô giữa → 8; góc trên-trái → 3; biên phải → 5; không
  bao giờ chứa chính nó; không bao giờ vượt biên (thử cả 81 ô của bàn 9×9).
- [ ] **3.2** Test `createBoard`: `mines === null`, `marks` toàn 0, độ dài `cols*rows`.
- [ ] **3.3** **Test cạn kiệt — test đáng tin nhất của dự án.** Với mỗi độ khó và
  **mỗi ô** làm nước đầu (81 + 256 + 480 = 817 lượt): đúng `mineCount` quả mìn · không
  mìn nào trong `[safeIndex, ...neighbours(safeIndex)]` · `adj[i]` khớp số mìn kề thật
  ở **mọi** ô. Đây là cách duy nhất kiểm FR-01 không phụ thuộc may mắn của seed.
- [ ] **3.4** Chạy, FAIL.
- [ ] **3.5** Hiện thực. `plantMines` dùng **Fisher–Yates một phần** trên danh sách ô
  hợp lệ, **không** vòng lặp thử-lại (ADR-0003 §3):

```ts
export function plantMines(board: Board, seed: number, safeIndex: number): Board {
  const { cols, rows, mineCount } = board;
  const excluded = new Set([safeIndex, ...neighbours(safeIndex, cols, rows)]);
  const pool: number[] = [];
  for (let i = 0; i < cols * rows; i += 1) if (!excluded.has(i)) pool.push(i);
  const rand = mulberry32(seed);
  for (let k = 0; k < mineCount; k += 1) {
    const j = k + Math.floor(rand() * (pool.length - k));
    [pool[k], pool[j]] = [pool[j], pool[k]];
  }
  const mines = new Uint8Array(cols * rows);
  for (let k = 0; k < mineCount; k += 1) mines[pool[k]] = 1;
  return countAdjacent({ ...board, mines });
}
```

- [ ] **3.6** `yarn test` PASS (817 lượt phải chạy dưới 2s — nếu chậm hơn là
  `neighbours` đang cấp phát quá nhiều).
- [ ] **3.7** Commit: `feat(core): plant mines after the first move, never in its 3x3`

---

### Task 4 · `reveal.ts` — flood fill và chord

**Files** — Create: `src/game/core/reveal.ts` · `reveal.test.ts`.

**Produces:** `reveal(board, i): { board: Board; exploded: number | null }` ·
`chord(board, i): { board: Board; exploded: number | null }`.

- [ ] **4.1** Test `reveal`: mở ô có số → chỉ ô đó · mở ô 0 → lan hết vùng và dừng ở
  viền số · **không lan qua ô cắm cờ** · ô đã mở → no-op (trả về đúng `board` cũ, so
  sánh reference) · mở ô mìn → `exploded === i` và `board` **không đổi** · ô `UNSURE`
  bấm trực tiếp thì mở được, nhưng flood **không** lan vào ô `UNSURE`.
- [ ] **4.2** Test `chord` bốn nhánh: đủ cờ đúng chỗ → mở các ô kề · đủ cờ **sai** chỗ
  → `exploded !== null` · thiếu cờ → no-op · ô chưa mở hoặc ô số 0 → no-op.
- [ ] **4.3** Chạy, FAIL.
- [ ] **4.4** Hiện thực. Flood fill **dùng stack tường minh**, và điều kiện dừng
  `next[k] !== HIDDEN` là thứ chặn cả ô đã mở lẫn ô cắm cờ bằng một phép so sánh:

```ts
export function reveal(board: Board, i: number) {
  const { cols, rows, mines, marks, adj } = board;
  if (!mines || marks[i] === REVEALED) return { board, exploded: null };
  if (mines[i] === 1) return { board, exploded: i };
  const next = marks.slice();
  next[i] = REVEALED;                       // ô bấm trực tiếp: HIDDEN hoặc UNSURE đều mở
  const stack: number[] = adj[i] === 0 ? neighbours(i, cols, rows) : [];
  while (stack.length) {
    const k = stack.pop()!;
    if (next[k] !== HIDDEN) continue;       // chặn cả ô đã mở, ô cờ, ô dấu hỏi
    next[k] = REVEALED;
    if (adj[k] === 0) stack.push(...neighbours(k, cols, rows));
  }
  return { board: { ...board, marks: next }, exploded: null };
}
```

- [ ] **4.5** PASS. Commit: `feat(core): reveal with flood fill, and chord that can explode`

---

### Task 5 · `mark.ts` · `rules.ts`

**Files** — Create: `src/game/core/mark.ts` · `rules.ts` · `mark.test.ts` ·
`rules.test.ts`.

**Produces:** `cycleMark(board, i, allowUnsure): Board` · `isWon(board): boolean` ·
`revealAllMines(board): Board` · `minesRemaining(board): number`.

- [ ] **5.1** Test `cycleMark`: `allowUnsure=false` → HIDDEN→FLAGGED→HIDDEN;
  `true` → HIDDEN→FLAGGED→UNSURE→HIDDEN; ô đã mở → no-op theo reference.
- [ ] **5.2** Test `isWon`: cắm đủ cờ đúng chỗ mà chưa mở hết ô an toàn → **false** ·
  mở hết ô an toàn dù 0 cờ → **true** · `mines === null` → false.
- [ ] **5.3** Test `revealAllMines`: mọi mìn chưa cờ thành `REVEALED`; **mìn đang cắm
  cờ giữ nguyên `FLAGGED`**; ô an toàn đang cắm cờ **cũng giữ nguyên `FLAGGED`** — đó
  là điều kiện để vẽ được gạch chéo cờ sai (bất biến #6).
- [ ] **5.4** Test `minesRemaining`: cắm nhiều cờ hơn số mìn → **số âm**, không kẹp 0.
- [ ] **5.5** FAIL → hiện thực → PASS.
- [ ] **5.6** Commit: `feat(core): mark cycle, win check and end-of-game reveal`

---

### Task 6 · `reducer.ts` — máy trạng thái

**Files** — Create: `src/game/core/reducer.ts` · `reducer.test.ts`.

**Produces:** `initialState(difficulty, seed): GameState` ·
`reducer(state, action): GameState`.

- [ ] **6.1** Test: `idle` + `reveal` → sinh mìn, `status === "playing"`,
  `startedAt === action.at`, và **nước đầu không bao giờ nổ** (thử 50 seed) ·
  `idle` + `chord` → no-op theo reference · mở phải mìn → `status === "lost"`,
  `explodedIndex` đúng ô đó, mọi mìn khác đã hiện, `endedAt === action.at` ·
  mở hết ô an toàn → `won` · **sau `won`/`lost`, mọi action trừ `reset` trả về ĐÚNG
  object cũ (`toBe`, không phải `toEqual`)** — đây là bất biến #7 ·
  `reset` → `idle`, `board.mines === null`, seed mới.
- [ ] **6.2** FAIL → hiện thực → PASS.
- [ ] **6.3** Commit: `feat(core): reducer state machine, frozen after win or loss`

---

### Task 7 · Ba bất biến vô hình thành test

**Files** — Create: `src/game/core/purity.test.ts`.

- [ ] **7.1** Đọc mọi file `src/game/core/*.ts` (trừ `*.test.ts`) bằng `node:fs` và
  khẳng định **không** khớp: `from "react"`, `from "next`, `Date.now`, `Math.random`,
  `document.`, `window.` — bất biến #1 và #5.
- [ ] **7.2** Khẳng định `initialState("beginner", 1)` **không** có key nào khớp
  `/elapsed|seconds|now|tick/i` — bất biến #3, chặn ai đó nhét đồng hồ vào `GameState`.
- [ ] **7.3** PASS. Commit: `test(core): turn the silent invariants into failing tests`

---

### Task 8 · Token cả hai theme, và test tự đo tương phản

**Files** — Modify: `src/app/globals.css`. Create: `src/app/tokens.test.ts`.

- [ ] **8.1** Chép **toàn bộ** bảng token `MASTER.md` §1 vào `:root` (light) và
  `@media (prefers-color-scheme: dark) { :root { … } }` (dark). Cả hai bộ, ngay từ
  đầu — feature `settings-records` chỉ thêm phần ghi đè, không thêm token.
- [ ] **8.2** Thêm `@media (prefers-reduced-motion: reduce)` đặt mọi biến motion về 0.
- [ ] **8.3** Test: đọc `globals.css`, trích `--num-1..8`, `--fg-flag`, `--fg-mine`,
  `--edge-cell-tile`, `--bg-cell-open`, `--bg-cell-tile` của **cả hai** theme; tự tính
  tỉ lệ tương phản WCAG trong test (hàm helper 15 dòng, không thêm dependency) và
  khẳng định: 8 màu số ≥ 4.5:1 trên `--bg-cell-open`; `--edge-cell-tile` ≥ 3:1 trên
  `--bg-cell-open`. NFR-A11Y-01 từ đây **tự canh gác**, không phụ thuộc ai nhớ đo lại.
- [ ] **8.4** PASS. Commit: `feat(ui): both theme token sets, with contrast asserted in tests`

---

### Task 9 · `strings.ts` · `Cell` · `Board`

**Files** — Create: `src/lib/strings.ts` · `src/views/Home/mains/Board/Cell.tsx` ·
`index.tsx` · `Cell.test.tsx` · `Board.test.tsx`.

**Consumes:** task 2, 8. **Produces:** `<Cell {...CellProps} />` (xem `design.md` §5),
`<Board board status explodedIndex cursor onAct />`.

- [ ] **9.1** Test `Cell`: `mark=HIDDEN` → có viền, `aria-label` nói "chưa mở" ·
  `mark=REVEALED, adj=3` → chữ "3", class `n3`, **không viền** · `mark=FLAGGED` → có
  `svg`, `aria-label` nói "đã cắm cờ" · `exploded` → class ô nổ ·
  `wrongFlag` → có hai `path` (cờ + gạch chéo) · chuột phải gọi `onAct(i, "mark")` và
  `preventDefault` · chuột giữa gọi `onAct(i, "chord")`.
- [ ] **9.2** Test hợp đồng `memo`: render `Board`, đổi `cursor` sang ô khác, khẳng
  định **đúng hai** `Cell` vẽ lại (đếm bằng một spy đặt trong `Cell` qua prop
  `onRenderForTest` chỉ có ở môi trường test, hoặc `React.Profiler`). Nếu số lớn hơn
  hai thì `memo` đang hỏng — bất biến #4.
- [ ] **9.3** FAIL → hiện thực. `Cell` bọc `memo`, không tạo object/hàm nào trong
  thân; `Board` bọc `useCallback` cho `onAct` với dependency chỉ là `dispatch`.
- [ ] **9.4** PASS. Commit: `feat(ui): board grid and a memoised cell with aria labels`

---

### Task 10 · HUD và đồng hồ

**Files** — Create: `src/views/Home/mains/Hud/{index,MineCounter,Timer,ResetButton}.tsx`
· `src/hooks/useTimer.ts` · `Hud.test.tsx` · `useTimer.test.ts`.

- [ ] **10.1** Test `useTimer` với `vi.useFakeTimers()`: `startedAt === null` → hiện
  `0:00` · chạy 65s → `1:05` · `status !== "playing"` → **dừng, không tăng nữa** ·
  nhảy đồng hồ hệ thống 300s (giả lập tab bị bóp tần số) → hiện đúng 300s, **vì tính
  bằng hiệu hai mốc chứ không đếm tick** (ADR-0005).
- [ ] **10.2** Test `MineCounter`: 10 mìn 3 cờ → `007`; 10 mìn 13 cờ → `−003` với dấu
  trừ U+2212, không phải hyphen.
- [ ] **10.3** Test `ResetButton`: vùng bấm ≥ 44×44 (đọc class/style), `aria-label` là
  "bàn mới", có icon `RotateCcw`.
- [ ] **10.4** FAIL → hiện thực → PASS.
  Commit: `feat(ui): hud strip with mine counter, timer and new-game button`

---

### Task 11 · Nối lại: `useGame` · bàn phím · màn hình

**Files** — Create: `src/hooks/{useGame,useBoardCursor}.ts` ·
`src/views/Home/index.tsx` · `useGame.test.ts` · `useBoardCursor.test.ts`.
Modify: `src/app/page.tsx`.

- [ ] **11.1** Test `useBoardCursor`: mũi tên di chuyển và **kẹp ở biên** (không cuộn
  vòng) · `Home`/`End` về đầu/cuối hàng · chỉ **một** ô có `tabIndex=0` (roving
  tabindex) — 480 tab stop là "truy cập được" trên giấy và không dùng được trên thực tế.
- [ ] **11.2** Test `useGame`: `allowUnsure` truyền cứng `false` ở feature này ·
  `at` lấy từ `Date.now()` **ở hook, không ở reducer** · đọc `?seed=` từ
  `window.location.search` **trong `useEffect`**, không trong render (nếu không sẽ lệch
  hydration); không có `?seed=` thì sinh seed sau khi mount.
- [ ] **11.3** Test phím trên bàn cờ: `Space` mở · `F` cắm cờ · `Enter` chord ·
  `R` bàn mới · mũi tên không cuộn trang (`preventDefault`).
- [ ] **11.4** FAIL → hiện thực → PASS. `yarn build` phải vẫn ra `out/`.
- [ ] **11.5** Commit: `feat(core-game): play a full board with mouse and keyboard`

---

### Task 12 · E2E trên app thật

**Files** — Create: `e2e/core-game.spec.ts`. Modify: `playwright.config.ts`.

- [ ] **12.1** `playwright.config.ts`: `webServer` chạy `yarn build && npx serve out`
  (hoặc `next start`), bốn viewport 375 · 768 · 1024 · 1440.
- [ ] **12.2** Test: nước đầu **không bao giờ nổ** — 20 lần, mỗi lần `?seed=` khác,
  bấm ô giữa, khẳng định không thấy trạng thái thua.
- [ ] **12.3** Test: thắng một bàn `beginner` có seed cố định bằng chuỗi nước đi ghi
  sẵn; khẳng định đồng hồ dừng và dialog thắng hiện.
- [ ] **12.4** Test: `Tab` vào bàn rồi mũi tên đi hết một hàng, focus **luôn thấy
  được** (so ảnh chụp vùng ô đang focus).
- [ ] **12.5** Chụp một ảnh **grayscale** ở 1440 và khẳng định 8 chữ số vẫn đọc được
  — NFR-A11Y-07, tức là màu chỉ là kênh phụ.
- [ ] **12.6** Commit: `test(e2e): first move never explodes, and the board is keyboard-playable`

---

### Task 13 · Đo, rồi đóng tài liệu

- [ ] **13.1** Chạy app thật, mở vùng lớn nhất trên bàn Khó với React Profiler, ghi
  con số đo được vào PR. Nếu > 50ms thì **không** tự sửa — ghi vào `backlog.md` và nói
  ra, vì phương án C đã chuẩn bị sẵn (NFR-PERF-06).
- [ ] **13.2** Chụp màn hình ở 375 / 768 / 1024 / 1440 và đối chiếu với canvas mockup.
  Lệch chỗ nào thì **nói ra trong hội thoại** và cập nhật canvas — mockup cũ tệ hơn
  không có mockup.
- [ ] **13.3** `README.md` §Features: một bullet tiếng Anh ngắn cho hành vi người dùng
  thấy được.
- [ ] **13.4** `scope.md`: FR-01..08, FR-11 → `xong`. `backlog.md` §Đang làm: cập nhật.
  `.env.example`: thêm `GITHUB_PAGES` nếu task 1 chưa thêm.
- [ ] **13.5** Commit: `docs: close out core-game`. Mở PR.

---

## Tự soi lại plan này

**Phủ spec:** §1 phạm vi → task 1, 8 (hai thứ kéo về sớm) · §2 dữ liệu → task 2, 3 ·
§3 reducer → task 6 · §4 hàm core → task 2–5 · §5 vẽ → task 9, 10, 11 · §6 xử lý lỗi →
no-op im lặng, test ở task 4, 5, 6 · §7 test → task 3, 7, 8, 12 · §8 giả định →
`?seed=` ở task 11, `strings.ts` ở task 9, độ khó khoá ở task 11.

**Chỗ chưa phủ, đã thêm:** NFR-PERF-06 không đo được bằng unit test → task 13.1.
NFR-A11Y-05 (`prefers-reduced-motion`) → task 8.2. NFR-PERF-07 (bundle < 200KB) →
kiểm bằng số `next build` in ra ở task 11.4, không cần task riêng.

**Nhất quán tên:** `neighbours` (không `neighbors`) · `marks` (không `state`) ·
`explodedIndex` (không `explodedAt`) · `cycleMark` (không `toggleFlag`) ·
`minesRemaining` (không `flagsLeft`) — khớp `glossary.md` §Tên bị cấm.
