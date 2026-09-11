"use client";

// libs
import { useEffect } from "react";

/**
 * Keep the DOM focus on the cell the cursor points at, so the ring the player sees is
 * the cell the keys will act on. Without this the two drift apart after a click.
 *
 * Guarded on an `.ms-cell` already having focus: moving focus when the player is
 * somewhere else entirely - the settings sheet, say - would yank it out from under
 * them.
 */
export function SyncFocusToCursor({ cursor }: { cursor: number }) {
  useEffect(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !active.classList.contains("ms-cell")) return;
    const target = document.querySelector<HTMLElement>(`[data-index="${cursor}"]`);
    target?.focus();
  }, [cursor]);

  return null;
}
