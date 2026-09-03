"use client";

import { useCallback, useEffect, type CSSProperties, type KeyboardEvent } from "react";
import { Moon, Settings } from "lucide-react";
import { DIFFICULTIES } from "@/game/core/constants";
import { useBoardCursor } from "@/hooks/useBoardCursor";
import { useGame } from "@/hooks/useGame";
import { strings } from "@/lib/strings";
import { Board } from "./mains/Board";
import { Hud } from "./mains/Hud";

/**
 * Difficulty is locked to beginner in this feature; the picker belongs to
 * settings-records. core/ still takes it as a parameter, so nothing here hardcodes
 * 9x9.
 */
const DIFFICULTY = "beginner" as const;

/** Page gutters the board has to fit inside at the narrowest width. */
const GUTTER = 32;
const BOARD_PADDING = 16;
const CELL_GAP = 2;
const MIN_CELL = 22;
const MAX_CELL = 38;

/**
 * One CSS expression for the cell size - no JavaScript measuring, no ResizeObserver,
 * nothing to keep in sync. The 22px floor comes from MASTER.md section 3: below it
 * the numerals stop being readable, so a board that will not fit is meant to be
 * panned (FR-13) rather than shrunk past it.
 */
function boardVars(cols: number): CSSProperties {
  const gaps = (cols - 1) * CELL_GAP;
  return {
    "--cols": cols,
    "--cell-size": `clamp(${MIN_CELL}px, calc((100vw - ${GUTTER}px - ${BOARD_PADDING}px - ${gaps}px) / ${cols}), ${MAX_CELL}px)`,
    "--board-width": `calc(${cols} * var(--cell-size) + ${gaps}px + ${BOARD_PADDING}px)`,
  } as CSSProperties;
}

export function Home() {
  const { state, act, reset } = useGame(DIFFICULTY);
  const { cols, rows, mineCount } = DIFFICULTIES[DIFFICULTY];
  const { cursor, move, moveToRowEdge } = useBoardCursor(cols, rows);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const handled = () => {
        event.preventDefault();
        event.stopPropagation();
      };
      switch (event.key) {
        case "ArrowLeft":
          handled();
          return move(-1, 0);
        case "ArrowRight":
          handled();
          return move(1, 0);
        case "ArrowUp":
          handled();
          return move(0, -1);
        case "ArrowDown":
          handled();
          return move(0, 1);
        case "Home":
          handled();
          return moveToRowEdge("start");
        case "End":
          handled();
          return moveToRowEdge("end");
        case " ":
          handled();
          return act(cursor, "reveal");
        case "Enter":
          handled();
          return act(cursor, "chord");
        case "f":
        case "F":
          handled();
          return act(cursor, "mark");
        case "r":
        case "R":
          handled();
          return reset();
        default:
          return undefined;
      }
    },
    [act, cursor, move, moveToRowEdge, reset],
  );

  // Keep the DOM focus on the cell the cursor points at, so the ring the player sees
  // is the cell the keys will act on. Without this the two drift apart after a click.
  useEffect(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !active.classList.contains("ms-cell")) return;
    const target = document.querySelector<HTMLElement>(`[data-index="${cursor}"]`);
    target?.focus();
  }, [cursor]);

  return (
    <main className="ms-page" style={boardVars(cols)}>
      <header className="ms-header">
        <span className="ms-wordmark">{strings.appName}</span>
        <div className="ms-header-actions">
          <button type="button" className="ms-iconbtn" aria-label={strings.theme} disabled>
            <Moon aria-hidden="true" />
          </button>
          <button type="button" className="ms-iconbtn" aria-label={strings.settings} disabled>
            <Settings aria-hidden="true" />
          </button>
        </div>
      </header>

      <Hud
        board={state.board}
        status={state.status}
        startedAt={state.startedAt}
        endedAt={state.endedAt}
        onReset={reset}
      />

      <p className="ms-difficulty">{strings.boardLabel(cols, rows, mineCount)}</p>

      <Board
        board={state.board}
        status={state.status}
        explodedIndex={state.explodedIndex}
        cursor={cursor}
        onAct={act}
        onKeyDown={onKeyDown}
      />

      {state.status === "won" || state.status === "lost" ? (
        <p className="ms-outcome" role="status" data-testid="outcome">
          {state.status === "won" ? strings.wonTitle : strings.lostTitle}
        </p>
      ) : null}

      <p className="ms-hints">
        <span>{strings.hintRightClick}</span>
        <span>{strings.hintMiddleClick}</span>
        <span>{strings.hintKeys}</span>
      </p>
    </main>
  );
}
