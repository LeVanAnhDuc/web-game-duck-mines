import { test, expect } from "@/fixtures";
import type { CellInfo, GamePage } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";
import { neighbours, type GridSize } from "@/utils/grid";

// FR-04 · US-02 · ADR-0012 (an open number always chords on a plain click).

interface Chordable {
  index: number;
  mines: number[];
  safeHidden: number[];
}

/** Open number cells whose mines are all still hidden and that still have hidden safe neighbours to open. */
function chordables(states: CellInfo[], mines: ReadonlySet<number>, size: GridSize): Chordable[] {
  return states.flatMap((c, index) => {
    if (c.state !== "number") return [];
    const around = neighbours(index, size);
    const m = around.filter((n) => mines.has(n));
    const safeHidden = around.filter((n) => !mines.has(n) && states[n].state === "hidden");
    return m.every((n) => states[n].state === "hidden") && safeHidden.length > 0 ? [{ index, mines: m, safeHidden }] : [];
  });
}

async function setUp(gamePage: GamePage, need: (c: Chordable) => boolean = () => true) {
  const mines = await gamePage.learnMines(SEED, 40);
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  const size = await gamePage.size();
  const target = chordables(await gamePage.states(), mines, size).find(need);
  if (!target) throw new Error(`seed ${SEED} has no suitable number to chord on`);
  return target;
}

const opened = (c: CellInfo) => c.state === "empty" || c.state === "number";

test("bấm chuột trái lên ô số đã đủ cờ đúng mở mọi ô kề chưa cắm cờ", { tag: ["@TC-MARKING-009", "@smoke"] }, async ({
  gamePage,
}) => {
  const target = await setUp(gamePage);
  for (const m of target.mines) await gamePage.flag(m);
  await gamePage.reveal(target.index);

  const after = await gamePage.states();
  for (const n of target.safeHidden) expect(opened(after[n]), `cell ${n} opened`).toBe(true);
  await expect(gamePage.outcome()).not.toHaveText(copy.result.lostTitle);
});

test("chuột giữa lên ô số đã đủ cờ cũng mở quanh", { tag: ["@TC-MARKING-010"] }, async ({ gamePage }) => {
  const target = await setUp(gamePage);
  for (const m of target.mines) await gamePage.flag(m);
  await gamePage.chordWithMiddleClick(target.index);

  const after = await gamePage.states();
  for (const n of target.safeHidden) expect(opened(after[n]), `cell ${n} opened`).toBe(true);
});

test("ô số chưa đủ cờ thì bấm vào không mở gì và không nổ", { tag: ["@TC-MARKING-011"] }, async ({ gamePage }) => {
  const target = await setUp(gamePage);
  // one flag short of the number
  for (const m of target.mines.slice(1)) await gamePage.flag(m);
  const before = await gamePage.states();
  await gamePage.reveal(target.index);
  expect(await gamePage.states()).toEqual(before);
  await expect(gamePage.result.dialog()).toHaveCount(0);
});

test("đủ số cờ nhưng cắm sai chỗ thì chord làm nổ", { tag: ["@TC-MARKING-012", "@smoke"] }, async ({ gamePage }) => {
  const target = await setUp(gamePage, (c) => c.safeHidden.length >= c.mines.length);
  const wrong = target.safeHidden.slice(0, target.mines.length);
  for (const w of wrong) await gamePage.flag(w);
  await gamePage.reveal(target.index);

  await expect(gamePage.result.dialog()).toBeVisible();
  const after = await gamePage.states();
  expect(target.mines.some((m) => after[m].state === "exploded")).toBe(true);
  for (const w of wrong) expect(after[w].state, `flag on ${w}`).toBe("wrongFlag");
});

test("chord không mở các ô đang cắm cờ", { tag: ["@TC-MARKING-013"] }, async ({ gamePage }) => {
  const target = await setUp(gamePage);
  for (const m of target.mines) await gamePage.flag(m);
  await gamePage.reveal(target.index);
  const after = await gamePage.states();
  for (const m of target.mines) expect(after[m].state, `flag on ${m}`).toBe("flagged");
});
