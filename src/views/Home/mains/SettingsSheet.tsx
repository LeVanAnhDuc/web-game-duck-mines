"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { DIFFICULTIES, DIFFICULTY_ORDER, type DifficultySpec } from "@/game/core/constants";
import { CUSTOM_LIMITS, clampCustom, maxMines, mineDensity } from "@/game/core/custom";
import type { Difficulty } from "@/game/core/types";
import type { BestTimes } from "@/game/score/ScoreRepository";
import type { Settings, ThemeChoice } from "@/game/settings/types";
import { formatElapsed } from "@/hooks/useTimer";
import { strings } from "@/lib/strings";

export type SettingsSheetProps = {
  open: boolean;
  settings: Settings;
  bestTimes: BestTimes;
  /** true once the clock is running: only then is abandoning a board a real loss */
  inProgress: boolean;
  storageAvailable: boolean;
  onUpdate: (patch: Partial<Settings>) => void;
  onPickDifficulty: (difficulty: Difficulty) => void;
  onPickCustom: (custom: DifficultySpec) => void;
  onClearRecords: () => void;
  onClose: () => void;
};

const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  beginner: strings.difficultyBeginner,
  intermediate: strings.difficultyIntermediate,
  expert: strings.difficultyExpert,
};

/**
 * A bottom sheet on a phone, a centred dialog from 768px up (MASTER.md section 6).
 * Section headings are sentence case - a tracked-out all-caps label is the clearest
 * tell of a page nobody wrote on purpose.
 */
export function SettingsSheet({
  open,
  settings,
  bestTimes,
  inProgress,
  storageAvailable,
  onUpdate,
  onPickDifficulty,
  onPickCustom,
  onClearRecords,
  onClose,
}: SettingsSheetProps) {
  const panel = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<Difficulty | "custom" | null>(null);

  useEffect(() => {
    if (open) panel.current?.focus();
    else setPending(null);
  }, [open]);

  if (!open) return null;

  function chooseCustom() {
    if (settings.useCustom) return;
    if (inProgress) {
      setPending("custom");
      return;
    }
    onPickCustom(settings.custom);
  }

  function choose(difficulty: Difficulty) {
    if (difficulty === settings.difficulty && !settings.useCustom) return;
    // Asking before the first move would be asking about nothing: an untouched board
    // costs nothing to throw away.
    if (inProgress) {
      setPending(difficulty);
      return;
    }
    onPickDifficulty(difficulty);
  }

  return (
    <div className="ms-scrim ms-scrim--sheet" onClick={onClose} data-testid="settings-scrim">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={strings.settingsTitle}
        className="ms-sheet"
        data-testid="settings-sheet"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <div className="ms-sheet-head">
          <h2 className="ms-sheet-title">{strings.settingsTitle}</h2>
          <button type="button" className="ms-iconbtn" aria-label={strings.close} onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </div>

        <section className="ms-section">
          <h3 className="ms-section-title">{strings.sectionDifficulty}</h3>
          <div role="radiogroup" aria-label={strings.sectionDifficulty} className="ms-radios">
            {DIFFICULTY_ORDER.map((difficulty) => {
              const spec = DIFFICULTIES[difficulty];
              return (
                <button
                  key={difficulty}
                  type="button"
                  role="radio"
                  aria-checked={!settings.useCustom && settings.difficulty === difficulty}
                  className="ms-radio"
                  data-testid={`difficulty-${difficulty}`}
                  onClick={() => choose(difficulty)}
                >
                  <span className="ms-radio-dot" aria-hidden="true" />
                  <span className="ms-radio-name">{DIFFICULTY_NAMES[difficulty]}</span>
                  <span className="ms-radio-spec">
                    {strings.difficultySpec(spec.cols, spec.rows, spec.mineCount)}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              role="radio"
              aria-checked={settings.useCustom}
              className="ms-radio"
              data-testid="difficulty-custom"
              onClick={chooseCustom}
            >
              <span className="ms-radio-dot" aria-hidden="true" />
              <span className="ms-radio-name">{strings.difficultyCustom}</span>
              <span className="ms-radio-spec">
                {strings.difficultySpec(
                  settings.custom.cols,
                  settings.custom.rows,
                  settings.custom.mineCount,
                )}
              </span>
            </button>
          </div>

          {settings.useCustom ? (
            <CustomFields
              custom={settings.custom}
              onChange={(custom) => {
                onUpdate({ custom });
                onPickCustom(custom);
              }}
            />
          ) : null}

          {pending ? (
            <div className="ms-confirm" role="alertdialog" aria-label={strings.abandonConfirm}>
              <span>
                {strings.abandonQuestion(
                  pending === "custom" ? strings.difficultyCustom : DIFFICULTY_NAMES[pending],
                )}
              </span>
              <div className="ms-confirm-actions">
                <button
                  type="button"
                  className="ms-btn ms-btn--danger"
                  data-testid="abandon-confirm"
                  onClick={() => {
                    if (pending === "custom") onPickCustom(settings.custom);
                    else onPickDifficulty(pending);
                    setPending(null);
                  }}
                >
                  {strings.abandonConfirm}
                </button>
                <button type="button" className="ms-btn" onClick={() => setPending(null)}>
                  {strings.abandonCancel}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="ms-section">
          <h3 className="ms-section-title">{strings.sectionPlay}</h3>
          <Toggle
            label={strings.unsureLabel}
            help={strings.unsureHelp}
            checked={settings.allowUnsure}
            testId="toggle-unsure"
            onChange={(allowUnsure) => onUpdate({ allowUnsure })}
          />
        </section>

        <section className="ms-section">
          <h3 className="ms-section-title">{strings.sectionSound}</h3>
          <Toggle
            label={strings.soundLabel}
            help={strings.soundHelp}
            checked={settings.sound}
            testId="toggle-sound"
            onChange={(sound) => onUpdate({ sound })}
          />
        </section>

        <section className="ms-section">
          <h3 className="ms-section-title">{strings.sectionTheme}</h3>
          <div role="radiogroup" aria-label={strings.sectionTheme} className="ms-segmented">
            {(
              [
                ["system", strings.themeSystem],
                ["light", strings.themeLight],
                ["dark", strings.themeDark],
              ] as [ThemeChoice, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={settings.theme === value}
                className="ms-segment"
                data-testid={`theme-${value}`}
                onClick={() => onUpdate({ theme: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="ms-section ms-section--divided">
          <h3 className="ms-section-title">{strings.sectionRecords}</h3>
          <dl className="ms-records">
            {DIFFICULTY_ORDER.map((difficulty) => (
              <div key={difficulty} className="ms-record">
                <dt>{DIFFICULTY_NAMES[difficulty]}</dt>
                <dd data-testid={`record-${difficulty}`}>
                  {bestTimes[difficulty] === null
                    ? strings.noRecord
                    : formatElapsed(bestTimes[difficulty]!)}
                </dd>
              </div>
            ))}
          </dl>
          {!storageAvailable ? (
            <p className="ms-help">{strings.recordsStorageOff}</p>
          ) : null}
          <button
            type="button"
            className="ms-btn ms-btn--danger ms-btn--wide"
            data-testid="clear-records"
            onClick={onClearRecords}
          >
            {strings.clearRecords}
          </button>
        </section>
      </div>
    </div>
  );
}

function Toggle({
  label,
  help,
  checked,
  testId,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  testId: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="ms-toggle-row">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className="ms-toggle"
        data-testid={testId}
        onClick={() => onChange(!checked)}
      >
        <span className="ms-toggle-label">{label}</span>
        <span className="ms-toggle-track" aria-hidden="true">
          <span className="ms-toggle-knob" />
        </span>
      </button>
      <p className="ms-help">{help}</p>
    </div>
  );
}

/**
 * Three numbers and the two things they imply.
 *
 * The mine ceiling is not a preference the game can honour: the first move clears its
 * own cell and all eight neighbours (ADR-0003), so nine cells must stay free. Saying
 * that where the number is typed is the only place it helps.
 *
 * "Not ranked" is stated HERE, before the first move - not after a win, when it reads
 * as the game taking something away (ADR-0007).
 */
function CustomFields({
  custom,
  onChange,
}: {
  custom: DifficultySpec;
  onChange: (next: DifficultySpec) => void;
}) {
  const ceiling = maxMines(custom.cols, custom.rows);
  const density = Math.round(mineDensity(custom) * 100);

  const field = (
    key: keyof DifficultySpec,
    label: string,
    min: number,
    max: number,
    testId: string,
  ) => (
    <label className="ms-field">
      <span className="ms-field-label">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        className="ms-field-input"
        data-testid={testId}
        min={min}
        max={max}
        value={custom[key]}
        onChange={(event) =>
          // Clamped on every keystroke, not on submit: a field that refuses the
          // value as you type is the only way the limit is learned when it matters.
          onChange(clampCustom({ ...custom, [key]: Number(event.target.value) }))
        }
      />
    </label>
  );

  return (
    <div className="ms-custom" data-testid="custom-fields">
      <div className="ms-fields">
        {field("cols", strings.customCols, CUSTOM_LIMITS.cols.min, CUSTOM_LIMITS.cols.max, "custom-cols")}
        {field("rows", strings.customRows, CUSTOM_LIMITS.rows.min, CUSTOM_LIMITS.rows.max, "custom-rows")}
        {field("mineCount", strings.customMines, CUSTOM_LIMITS.minMines, ceiling, "custom-mines")}
      </div>
      <p className="ms-help" data-testid="custom-density">
        {strings.customDensity(density)}
      </p>
      <p className="ms-help">{strings.customMaxMines(ceiling)}</p>
      <p className="ms-help ms-help--warn" data-testid="custom-unranked">
        {strings.customNotRanked}
      </p>
    </div>
  );
}
