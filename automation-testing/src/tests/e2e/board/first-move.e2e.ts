import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";
import { countAround, neighbours } from "@/utils/grid";

// FR-01 · FR-02 · US-01. The unit suite proves the rules by calling them; this proves the wiring on the exported site.

test("trang mở ra bàn Dễ 9×9 kín ô, đồng hồ 0:00 và 10 mìn cần tìm", { tag: ["@TC-BOARD-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await expect(gamePage.cells()).toHaveCount(81);
  expect((await gamePage.states()).every((c) => c.state === "hidden")).toBe(true);
  await expect(gamePage.timer()).toHaveText("0:00");
  await expect(gamePage.mineCounter()).toHaveText("010");
  await expect(gamePage.difficultyLabel()).toHaveText(copy.boardLabel(copy.difficulty.beginner, 9, 9, 10));
});

// Twenty boards: if first-move safety were wrong, one of these would go off.
for (let seed = 1; seed <= 20; seed += 1) {
  test(`nước đầu ở giữa bàn mở ra một vùng, không bao giờ nổ (seed ${seed})`, { tag: ["@TC-BOARD-002", "@smoke"] }, async ({
    gamePage,
  }) => {
    await gamePage.goto(seed);
    await gamePage.reveal(40);
    const states = await gamePage.states();
    expect(states[40].state).toBe("empty");
    expect(states.filter((c) => c.state === "empty" || c.state === "number").length).toBeGreaterThan(1);
    await expect(gamePage.outcome()).toHaveText("");
    await expect(gamePage.result.dialog()).toHaveCount(0);
  });
}

for (const seed of [3, 11, 29]) {
  test(`nước đầu ở ô góc vẫn an toàn và mở ra một vùng (seed ${seed})`, { tag: ["@TC-BOARD-003"] }, async ({ gamePage }) => {
    await gamePage.goto(seed);
    await gamePage.reveal(80);
    const states = await gamePage.states();
    expect(states[80].state).toBe("empty");
    for (const n of neighbours(80, { cols: 9, rows: 9 })) expect(states[n].state).not.toBe("hidden");
    await expect(gamePage.outcome()).toHaveText("");
  });
}

test("nước đầu trên bàn Khó 30×16 cũng an toàn", { tag: ["@TC-BOARD-004"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  await gamePage.reveal(240);
  expect((await gamePage.cellInfo(240)).state).toBe("empty");
  await expect(gamePage.outcome()).toHaveText("");
});

test("vùng trống lan tới viền số, và mỗi con số đúng bằng số mìn quanh nó", { tag: ["@TC-BOARD-005", "@smoke"] }, async ({
  gamePage,
}) => {
  const mines = await gamePage.learnMines(SEED, 40);
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  const size = await gamePage.size();
  const states = await gamePage.states();
  states.forEach((c, i) => {
    if (c.state === "empty") {
      for (const n of neighbours(i, size)) expect(states[n].state, `neighbour ${n} of empty ${i}`).not.toBe("hidden");
    }
    if (c.state === "number") expect(c.n, `cell ${i}`).toBe(countAround(i, mines, size));
    expect(mines.has(i) && c.state !== "hidden", `mine ${i} opened`).toBe(false);
  });
});

test("mở một ô số chỉ mở đúng ô đó", { tag: ["@TC-BOARD-006"] }, async ({ gamePage }) => {
  const mines = await gamePage.learnMines(SEED, 40);
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  const size = await gamePage.size();
  const before = await gamePage.states();
  const target = before.findIndex((c, i) => c.state === "hidden" && !mines.has(i) && countAround(i, mines, size) > 0);
  expect(target, "a hidden number cell exists").toBeGreaterThanOrEqual(0);

  await gamePage.reveal(target);
  const after = await gamePage.states();
  expect(after[target]).toEqual({ state: "number", n: countAround(target, mines, size) });
  const changed = after.map((c, i) => (c.state !== before[i].state ? i : -1)).filter((i) => i >= 0);
  expect(changed).toEqual([target]);
});

test("cùng seed và cùng nước đầu cho ra cùng một bàn", { tag: ["@TC-BOARD-012"] }, async ({ gamePage }) => {
  const play = async () => {
    await gamePage.goto(777);
    await gamePage.reveal(40);
    return gamePage.states();
  };
  expect(await play()).toEqual(await play());
});

test("seed khác cho ra bàn khác", { tag: ["@TC-BOARD-013"] }, async ({ gamePage }) => {
  const play = async (seed: number) => {
    await gamePage.goto(seed);
    await gamePage.reveal(40);
    return gamePage.states();
  };
  expect(await play(777)).not.toEqual(await play(778));
});
