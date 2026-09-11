"use client";

import { memo } from "react";
import { strings } from "@/lib/strings";
import { FLAGGED, HIDDEN, REVEALED, UNSURE, type ActKind, type Mark } from "@/game/core/types";

export type CellProps = {
  index: number;
  row: number;
  col: number;
  mark: Mark;
  adj: number;
  isMine: boolean;
  exploded: boolean;
  wrongFlag: boolean;
  focused: boolean;
  /** the cell the finger is currently pointing at, before it lifts */
  aimed: boolean;
  onAct: (index: number, kind: ActKind) => void;
};

/**
 * Counts renders so invariant #4 can be asserted instead of hoped for. A memo that
 * has quietly stopped working is invisible - the game still plays, the tests still
 * pass, the machine just gets hot. Board.test.tsx watches this number.
 */
export const cellRenderCount = { value: 0 };

/**
 * Every prop is a primitive except `onAct`, which the board memoises once - invariant
 * #4. Nothing in this component body allocates an object or a closure per render, so
 * `memo` actually holds: on a move only the cells that changed come back.
 */
function CellImpl({
  index,
  row,
  col,
  mark,
  adj,
  isMine,
  exploded,
  wrongFlag,
  focused,
  aimed,
  onAct,
}: CellProps) {
  cellRenderCount.value += 1;
  const open = mark === REVEALED;
  const showMine = open && isMine;

  return (
    <button
      type="button"
      data-index={index}
      data-testid={`cell-${index}`}
      // The tile's border is the ONLY thing separating hidden from revealed -
      // invariant #8. Lightness cannot carry it and still leave the numerals legible.
      className={[
        "ms-cell",
        open ? "ms-cell--open" : "ms-cell--tile",
        exploded ? "ms-cell--boom" : "",
        aimed ? "ms-cell--aimed" : "",
        open && !isMine && adj > 0 ? `ms-num-${adj}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
      tabIndex={focused ? 0 : -1}
      aria-label={label(row, col, mark, adj, isMine, exploded, wrongFlag)}
      onClick={() => onAct(index, open ? "chord" : "reveal")}
      onContextMenu={(event) => {
        event.preventDefault();
        onAct(index, "mark");
      }}
      onAuxClick={(event) => {
        if (event.button !== 1) return;
        event.preventDefault();
        onAct(index, "chord");
      }}
    >
      {showMine ? <MineGlyph /> : null}
      {!open && mark === FLAGGED ? <FlagGlyph wrong={wrongFlag} /> : null}
      {!open && mark === UNSURE ? <span className="ms-qmark">?</span> : null}
      {open && !isMine && adj > 0 ? adj : null}
    </button>
  );
}

export const Cell = memo(CellImpl);

function label(
  row: number,
  col: number,
  mark: Mark,
  adj: number,
  isMine: boolean,
  exploded: boolean,
  wrongFlag: boolean,
): string {
  const r = row + 1;
  const c = col + 1;
  if (exploded) return strings.cellExploded(r, c);
  if (mark === FLAGGED) return wrongFlag ? strings.cellWrongFlag(r, c) : strings.cellFlagged(r, c);
  if (mark === UNSURE) return strings.cellUnsure(r, c);
  if (mark === HIDDEN) return strings.cellHidden(r, c);
  if (isMine) return strings.cellMine(r, c);
  return adj === 0 ? strings.cellEmpty(r, c) : strings.cellNumber(r, c, adj);
}

/** Lucide `Bomb`. Drawn inline: emoji change shape per OS and ignore currentColor. */
function MineGlyph() {
  return (
    <svg className="ms-glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="13" r="9" />
      <path d="m19.5 9.5 1.8-1.8a2.4 2.4 0 0 0 0-3.4l-1.6-1.6a2.41 2.41 0 0 0-3.4 0l-1.8 1.8" />
      <path d="m22 2-1.5 1.5" />
    </svg>
  );
}

/** Lucide `Flag`, plus a slash when the flag turns out to be in the wrong place. */
function FlagGlyph({ wrong }: { wrong: boolean }) {
  return (
    <svg
      className={wrong ? "ms-glyph ms-glyph--wrong" : "ms-glyph ms-glyph--flag"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" />
      {wrong ? <path d="M3 3L21 21" /> : null}
    </svg>
  );
}
