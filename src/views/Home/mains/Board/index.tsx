"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import type { TapMode } from "@/game/input/touchGesture";
import { useTouchGesture } from "@/hooks/useTouchGesture";
import { strings } from "@/lib/strings";
import {
  FLAGGED,
  REVEALED,
  type ActKind,
  type Board as BoardModel,
  type GameStatus,
  type Mark,
} from "@/game/core/types";
import { Cell } from "../../components/Cell";

export type BoardProps = {
  board: BoardModel;
  status: GameStatus;
  explodedIndex: number | null;
  cursor: number;
  /** what a plain tap means on a touch screen */
  mode: TapMode;
  onAct: (index: number, kind: ActKind) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

export function Board({
  board,
  status,
  explodedIndex,
  cursor,
  mode,
  onAct,
  onKeyDown,
}: BoardProps) {
  const { cols, rows, mines, marks, adj } = board;
  const lost = status === "lost";

  const { aim, aiming, handlers } = useTouchGesture(
    mode,
    (index) => marks[index] === REVEALED,
    onAct,
  );

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
    /**
     * The board scrolls inside its own frame, never the page: the mine counter and
     * the new-game button have to stay on screen exactly when the board is too big
     * to fit (ADR-0009).
     *
     * `touch-action` flips to none once the finger has settled, so sliding retargets
     * the aim instead of panning. Before that the browser keeps the gesture, which
     * is what makes a drag a pan and costs the player nothing.
     */
    <div
      className={aiming ? "ms-viewport ms-viewport--aiming" : "ms-viewport"}
      data-testid="board-viewport"
      {...handlers}
    >
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
              aimed={aiming && aim?.index === index}
              onAct={onAct}
            />
          );
        })}
      </div>

      {/* The finger covers the cell it is on, so the target is redrawn above it.
          This is the whole reason a cell may be smaller than 44px - NFR-A11Y-06. */}
      {aiming && aim ? (
        <div
          className="ms-aim"
          data-testid="aim-chip"
          style={{ left: `${aim.x}px`, top: `${aim.y}px` }}
          aria-hidden="true"
        >
          <span className="ms-aim-cell">
            {marks[aim.index] === REVEALED && !mines?.[aim.index] && adj[aim.index]
              ? adj[aim.index]
              : ""}
          </span>
          <span className="ms-aim-kind">
            {mode === "flag" ? strings.modeFlag : strings.modeDig}
          </span>
        </div>
      ) : null}
    </div>
  );
}
