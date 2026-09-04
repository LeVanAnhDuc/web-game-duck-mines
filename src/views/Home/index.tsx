"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Moon, Settings as SettingsIcon, Sun } from "lucide-react";
import { DIFFICULTIES } from "@/game/core/constants";
import { hasWrongFlag } from "@/game/core/rules";
import type { Difficulty, GameStatus } from "@/game/core/types";
import { useBoardCursor } from "@/hooks/useBoardCursor";
import { useGame } from "@/hooks/useGame";
import { useRecords } from "@/hooks/useRecords";
import { useSettings } from "@/hooks/useSettings";
import { useSound } from "@/hooks/useSound";
import { useRotateHint } from "@/hooks/useRotateHint";
import { useTimer } from "@/hooks/useTimer";
import type { TapMode } from "@/game/input/touchGesture";
import { strings } from "@/lib/strings";
import { Board } from "./mains/Board";
import { Hud } from "./mains/Hud";
import { ModeBar } from "./mains/ModeBar";
import { ResultDialog } from "./mains/ResultDialog";
import { SettingsSheet } from "./mains/SettingsSheet";

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

const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  beginner: strings.difficultyBeginner,
  intermediate: strings.difficultyIntermediate,
  expert: strings.difficultyExpert,
};

export function Home() {
  const { settings, update } = useSettings();
  const { bestTimes, record, clear, storageAvailable } = useRecords();
  const { state, act, reset } = useGame(settings.difficulty, settings.allowUnsure);
  const playExplosion = useSound(settings.sound);

  const { cols, rows, mineCount } = DIFFICULTIES[settings.difficulty];
  const { cursor, setCursor, move, moveToRowEdge } = useBoardCursor(cols, rows);
  const elapsed = useTimer(state.startedAt, state.endedAt, state.status);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  // Not a setting: it is where your thumb is right now, and it resets with the board.
  const [mode, setMode] = useState<TapMode>("reveal");
  const rotateHint = useRotateHint(cols);

  // Settle the end of a board exactly once. Watching `status` without remembering
  // what it was would fire again on any unrelated re-render, and record the same win
  // twice.
  const settled = useRef<GameStatus>("idle");
  useEffect(() => {
    if (state.status === settled.current) return;
    settled.current = state.status;

    if (state.status !== "won") {
      if (state.status === "lost") playExplosion();
      setIsRecord(false);
      return;
    }
    if (state.startedAt === null || state.endedAt === null) return;
    // Seconds come from the two instants, never from what the clock happens to be
    // showing - ADR-0005.
    const seconds = Math.floor((state.endedAt - state.startedAt) / 1000);
    setIsRecord(record(state.difficulty, seconds));
  }, [state.status, state.startedAt, state.endedAt, state.difficulty, playExplosion, record]);

  // The cursor is a position on THIS board; a different size has no such position.
  useEffect(() => setCursor(0), [cols, rows, setCursor]);

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
          <button
            type="button"
            className="ms-iconbtn"
            aria-label={strings.theme}
            data-testid="theme-toggle"
            // A shortcut, not the setting: it flips between the two explicit
            // choices. "System" stays reachable only in the sheet, because a
            // three-way cycle hidden behind one icon is a guessing game.
            onClick={() => update({ theme: settings.theme === "dark" ? "light" : "dark" })}
          >
            {settings.theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="ms-iconbtn"
            aria-label={strings.settings}
            data-testid="open-settings"
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon aria-hidden="true" />
          </button>
        </div>
      </header>

      <Hud board={state.board} elapsed={elapsed} onReset={() => reset()} />

      <p className="ms-difficulty" data-testid="difficulty-label">
        {strings.boardLabel(DIFFICULTY_NAMES[settings.difficulty], cols, rows, mineCount)}
      </p>

      {rotateHint ? (
        <p className="ms-rotate" role="status" data-testid="rotate-hint">
          {strings.rotateHint}
        </p>
      ) : null}

      <Board
        board={state.board}
        status={state.status}
        explodedIndex={state.explodedIndex}
        cursor={cursor}
        mode={mode}
        onAct={act}
        onKeyDown={onKeyDown}
      />

      <ModeBar mode={mode} onChange={setMode} />

      <p className="ms-sr-only" role="status" data-testid="outcome">
        {state.status === "won"
          ? strings.wonTitle
          : state.status === "lost"
            ? strings.lostTitle
            : ""}
      </p>

      <p className="ms-hints">
        <span>{strings.hintRightClick}</span>
        <span>{strings.hintMiddleClick}</span>
        <span>{strings.hintKeys}</span>
      </p>

      <ResultDialog
        status={state.status}
        seconds={elapsed}
        isRecord={isRecord}
        wrongFlags={hasWrongFlag(state.board)}
        onReset={() => reset()}
      />

      <SettingsSheet
        open={settingsOpen}
        settings={settings}
        bestTimes={bestTimes}
        inProgress={state.status === "playing"}
        storageAvailable={storageAvailable}
        onUpdate={update}
        onPickDifficulty={(difficulty) => update({ difficulty })}
        onClearRecords={clear}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}
