// Lai game vao khung hinh dung de chup anh README.
// Chay boi web-game/.claude/skills/readme-game/scripts/capture-screenshots.mjs.
// Khong co file nay thi anh chup ra ban 9x9 con nguyen - 81 o xam giong nhau,
// khong thay so, khong thay co, khong noi len duoc game nay la game gi.
//
// Hop dong: export default async (page) => {...}. Viewport la 1280x720.

export default async function setup(page) {
  // Nuoc dau tien luon an toan (first-click safety), nen no mo ra mot vung so.
  const cells = page.locator('button[aria-label], [role="gridcell"]');
  const n = await cells.count();
  if (n >= 41) {
    await cells.nth(40).click(); // giua ban 9x9
    await page.waitForTimeout(250);
  }
  // Da thu cam co bang right-click o day: khong an. Cach cam co thuc su cua
  // game (chuot phai tren o, hoac phim F) khong khop voi locator nay, va anh
  // chup chi can thay CON SO - do la thu phan biet Minesweeper voi mot luoi o
  // xam. Neu muon them la co vao anh, sua o day va chup lai de kiem.
}
