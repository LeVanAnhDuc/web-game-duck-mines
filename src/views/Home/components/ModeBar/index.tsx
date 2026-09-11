"use client";

import { Flag, Pickaxe } from "lucide-react";
import type { TapMode } from "@/game/input/touchGesture";
import { strings } from "@/lib/strings";

export type ModeBarProps = {
  mode: TapMode;
  onChange: (mode: TapMode) => void;
};

/**
 * What a plain tap means. It exists alongside the long press rather than instead of
 * it: planting ten flags in a row through a hold each time is ten waits, and the
 * original planted a flag in one click.
 *
 * Only shown where taps are the input - a mouse already has three buttons.
 */
export function ModeBar({ mode, onChange }: ModeBarProps) {
  return (
    <div
      role="radiogroup"
      aria-label={strings.modeSwitch}
      className="ms-modebar"
      data-testid="mode-bar"
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === "reveal"}
        className="ms-mode"
        data-testid="mode-reveal"
        onClick={() => onChange("reveal")}
      >
        <Pickaxe aria-hidden="true" />
        <span>{strings.modeDig}</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === "flag"}
        className="ms-mode"
        data-testid="mode-flag"
        onClick={() => onChange("flag")}
      >
        <Flag aria-hidden="true" />
        <span>{strings.modeFlag}</span>
      </button>
    </div>
  );
}
