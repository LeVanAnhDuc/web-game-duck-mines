import { mulberry32 } from "./rng";
import type { Board, BoardSpec } from "./types";

/**
 * The eight cells around `index`, already clipped to the board. Everything else
 * reuses this - there is no second place that knows what "adjacent" means.
 */
export function neighbours(index: number, cols: number, rows: number): number[] {
  const col = index % cols;
  const row = (index - col) / cols;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nc = col + dc;
      const nr = row + dr;
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
      out.push(nr * cols + nc);
    }
  }
  return out;
}

/** An empty board: no mines yet, nothing revealed. */
export function createBoard(spec: BoardSpec): Board {
  const { cols, rows, mineCount } = spec;
  const size = cols * rows;
  return {
    cols,
    rows,
    mineCount,
    mines: null,
    adj: new Uint8Array(size),
    marks: new Uint8Array(size),
  };
}

export function countAdjacent(board: Board): Board {
  const { cols, rows, mines } = board;
  if (!mines) return board;
  const adj = new Uint8Array(cols * rows);
  for (let i = 0; i < adj.length; i += 1) {
    let n = 0;
    for (const j of neighbours(i, cols, rows)) if (mines[j] === 1) n += 1;
    adj[i] = n;
  }
  return { ...board, adj };
}

/**
 * Places the mines AFTER the first move, excluding that cell and its eight
 * neighbours, so the opening click always opens a region - ADR-0003.
 *
 * A partial Fisher-Yates over the eligible cells, deliberately not a
 * regenerate-until-safe loop: that one skews the mine distribution across the rest
 * of the board, silently, and its runtime is unpredictable at expert density.
 */
export function plantMines(board: Board, seed: number, safeIndex: number): Board {
  const { cols, rows, mineCount } = board;
  const size = cols * rows;
  const excluded = new Set<number>([safeIndex, ...neighbours(safeIndex, cols, rows)]);
  const pool: number[] = [];
  for (let i = 0; i < size; i += 1) if (!excluded.has(i)) pool.push(i);

  const rand = mulberry32(seed);
  const take = Math.min(mineCount, pool.length);
  for (let k = 0; k < take; k += 1) {
    const j = k + Math.floor(rand() * (pool.length - k));
    const tmp = pool[k]!;
    pool[k] = pool[j]!;
    pool[j] = tmp;
  }

  const mines = new Uint8Array(size);
  for (let k = 0; k < take; k += 1) mines[pool[k]!] = 1;
  return countAdjacent({ ...board, mines });
}
