// Pure geometry of a minesweeper grid, indexed row-major like the game's data-index (index = row * cols + col).

export interface GridSize {
  cols: number;
  rows: number;
}

export function rowCol(index: number, { cols }: GridSize): { row: number; col: number } {
  return { row: Math.floor(index / cols), col: index % cols };
}

/** The up-to-eight cells around `index`, never wrapping across a row edge. */
export function neighbours(index: number, size: GridSize): number[] {
  const { row, col } = rowCol(index, size);
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < size.rows && c >= 0 && c < size.cols) out.push(r * size.cols + c);
    }
  }
  return out;
}

/** How many of `index`'s neighbours are in `mines`. */
export function countAround(index: number, mines: ReadonlySet<number>, size: GridSize): number {
  return neighbours(index, size).filter((n) => mines.has(n)).length;
}
