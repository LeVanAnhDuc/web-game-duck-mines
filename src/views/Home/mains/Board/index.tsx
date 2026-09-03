"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { strings } from "@/lib/strings";
import { FLAGGED, type ActKind, type Board as BoardModel, type GameStatus, type Mark } from "@/game/core/types";
import { Cell } from "./Cell";

export type BoardProps = {
  board: BoardModel;
  status: GameStatus;
  explodedIndex: number | null;
  cursor: number;
  onAct: (index: number, kind: ActKind) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

export function Board({
  board,
  status,
  explodedIndex,
  cursor,
  onAct,
  onKeyDown,
}: BoardProps) {
  const { cols, rows, mines, marks, adj } = board;
  const lost = status === "lost";

  /**
   * `--cell-size` and `--cols` are set once on the page, not here, so the HUD strip
   * can line up with the board width from the same two numbers. repeat() will not
   * take a var() for its count, which is the one thing still spelled out literally.
   */
  const style = {
    width: "var(--board-width)",
    gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
    fontSize: "calc(var(--cell-size) * 0.58)",
  } as CSSProperties;

  return (
    <div
      role="grid"
      aria-label={strings.boardGrid}
      aria-rowcount={rows}
      aria-colcount={cols}
      className="ms-board"
      style={style}
      onKeyDown={onKeyDown}
    >
      {Array.from({ length: cols * rows }, (_, index) => {
        const isMine = mines?.[index] === 1;
        return (
          <Cell
            key={index}
            index={index}
            row={(index - (index % cols)) / cols}
            col={index % cols}
            mark={marks[index] as Mark}
            adj={adj[index] ?? 0}
            isMine={isMine}
            exploded={explodedIndex === index}
            wrongFlag={lost && marks[index] === FLAGGED && !isMine}
            focused={cursor === index}
            onAct={onAct}
          />
        );
      })}
    </div>
  );
}
