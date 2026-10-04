"use client";

// libs
import { useCallback, useEffect, useRef, useState } from "react";

const ITEMS = "a,button";

/** Behaviour of the account menu only - the look lives in globals.css. */
export function useAccountMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []);

    const onKey = (event: KeyboardEvent) => {
      // Capture phase on window, so the game's own key handling never sees these.
      if (event.key === "Escape") {
        event.stopPropagation();
        close(true);
        return;
      }
      if (event.key === "Tab") {
        event.stopPropagation();
        // Let the browser move on from the trigger instead of from a node that is
        // about to disappear; the menu just closes without taking focus back.
        triggerRef.current?.focus();
        close(false);
        return;
      }
      const list = items();
      if (list.length === 0) return;
      const at = list.indexOf(document.activeElement as HTMLElement);
      let next = -1;
      if (event.key === "ArrowDown") next = (at + 1) % list.length;
      else if (event.key === "ArrowUp") next = at <= 0 ? list.length - 1 : at - 1;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = list.length - 1;
      if (next < 0) return;
      event.stopPropagation();
      event.preventDefault();
      list[next].focus();
    };

    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false);
    };

    // Only a real, known destination outside both counts. Safari does not focus a
    // button on click, so a null relatedTarget must not close the menu; clicks outside
    // are already handled by onPointer.
    const onFocusOut = (event: FocusEvent) => {
      const to = event.relatedTarget as Node | null;
      if (to && !menuRef.current?.contains(to) && !triggerRef.current?.contains(to)) close(false);
    };

    window.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusout", onFocusOut);
    items()[0]?.focus();
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [open, close]);

  return { open, toggle: () => setOpen((value) => !value), close, triggerRef, menuRef };
}
