"use client";

// libs
import { useCallback, useMemo, useState } from "react";

// types
import type { CSSProperties, KeyboardEvent } from "react";
import type { BoardSpec, Difficulty } from "@/game/core/types";
import type { TapMode } from "@/game/input/touchGesture";

// game
import { presetSpec } from "@/game/core/constants";
import { hasWrongFlag } from "@/game/core/rules";

// hooks
import {
  useBoardCursor,
  useGame,
  useRecords,
  useRotateHint,
  useSettings,
  useSound,
  useTimer,
} from "@/hooks";

// components
import { Board } from "./mains/Board";
import { Header } from "./mains/Header";
import { Hud } from "./mains/Hud";
import { ModeBar } from "./components/ModeBar";
import { ResultDialog } from "./components/ResultDialog";
import { SettingsSheet } from "./components/SettingsSheet";

// ghosts
import { ResetCursorOnResize } from "./ghosts/ResetCursorOnResize";
import { SettleResult } from "./ghosts/SettleResult";
import { SyncFocusToCursor } from "./ghosts/SyncFocusToCursor";

// others
import { strings } from "@/lib/strings";

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
  // The spec, not the difficulty: a custom board is a board like any other, it
  // simply carries `ranked: null` (ADR-0007).
  const spec: BoardSpec = useMemo(
    () =>
      settings.useCustom
        ? { ...settings.custom, ranked: null }
        : presetSpec(settings.difficulty),
    [settings.useCustom, settings.custom, settings.difficulty],
  );
  const { state, act, reset } = useGame(spec, settings.allowUnsure);
  const playExplosion = useSound(settings.sound);

  const { cols, rows, mineCount } = spec;
  const { cursor, setCursor, move, moveToRowEdge } = useBoardCursor(cols, rows);
  const elapsed = useTimer(state.startedAt, state.endedAt, state.status);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  // Not a setting: it is where your thumb is right now, and it resets with the board.
  const [mode, setMode] = useState<TapMode>("reveal");
  const rotateHint = useRotateHint(cols);

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

  return (
    <main className="ms-page" style={boardVars(cols)}>
      {/*
        Ghosts: they render nothing and only run side-effects (R-04). They mount
        unconditionally and keep the order the effects had when they lived in this
        file - a child's effects run before the parent's, in child order.
      */}
      <SettleResult
        status={state.status}
        startedAt={state.startedAt}
        endedAt={state.endedAt}
        ranked={state.ranked}
        onLost={playExplosion}
        onRecord={record}
        onSettled={setIsRecord}
      />
      <ResetCursorOnResize cols={cols} rows={rows} onReset={setCursor} />
      <SyncFocusToCursor cursor={cursor} />

      <Header
        theme={settings.theme}
        onToggleTheme={() =>
          update({ theme: settings.theme === "dark" ? "light" : "dark" })
        }
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <Hud board={state.board} elapsed={elapsed} onReset={() => reset()} />

      <p className="ms-difficulty" data-testid="difficulty-label">
        {strings.boardLabel(
          settings.useCustom
            ? strings.difficultyCustom
            : DIFFICULTY_NAMES[settings.difficulty],
          cols,
          rows,
          mineCount,
        )}
        {settings.useCustom ? (
          <span className="ms-unranked" data-testid="unranked-note">
            {" · "}
            {strings.customUnranked}
          </span>
        ) : null}
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
        <span>{strings.hintKeys}</span>
        <span>{strings.hintRightClick}</span>
        <span>{strings.hintChord}</span>
      </p>

      {/*
       * Four of six players in the 2026-09-12 review, asked whether they would trust
       * the page with an email, gave the same reason for no - nobody is named. It
       * never asks for an email, so the risk was zero and the cost was credibility:
       * two of them sized the product down before touching it. Text, not
       * infrastructure - the 0 VND ceiling in overview.md section 5 stands.
       */}
      <footer className="ms-footer" data-testid="footer">
        <span>{strings.madeBy}</span>
        <a href={strings.sourceUrl} target="_blank" rel="noreferrer noopener">
          {strings.sourceCode}
        </a>
      </footer>

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
        onPickDifficulty={(difficulty) => update({ difficulty, useCustom: false })}
        onPickCustom={(custom) => update({ custom, useCustom: true })}
        onClearRecords={clear}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}
