"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadSettings,
  saveSettings,
} from "@/game/settings/localSettingsRepository";
import { DEFAULT_SETTINGS, type Settings } from "@/game/settings/types";

/**
 * Owns the player's settings and their one side effect on the page: the theme
 * attribute on <html>.
 *
 * Reading storage happens in an effect rather than in the initial state, so the
 * server-rendered markup and the first client render agree. The cost is one frame at
 * the default theme before a stored choice applies - which is why `system` is the
 * default: for most people that first frame is already the right one.
 */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  // `system` removes the attribute entirely rather than writing a value, so the
  // media query in globals.css is what answers - including when the player changes
  // their OS theme while the tab is open.
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      // Storage can refuse (private window, quota, blocked site data). The game
      // carries on with the setting applied in memory - NFR-REL-03.
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, update, loaded };
}
