"use client";

// libs
import { Moon, Settings as SettingsIcon, Sun } from "lucide-react";

// types
import type { ThemeChoice } from "@/game/settings/types";

// others
import { strings } from "@/lib/strings";

export function Header({
  theme,
  onToggleTheme,
  onOpenSettings,
}: {
  theme: ThemeChoice;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <header className="ms-header">
      <span className="ms-wordmark">{strings.appName}</span>
      <div className="ms-header-actions">
        {/*
          A shortcut, not the setting: it flips between the two explicit choices.
          "System" stays reachable only in the sheet, because a three-way cycle
          hidden behind one icon is a guessing game.
        */}
        <button
          type="button"
          className="ms-iconbtn"
          aria-label={strings.theme}
          data-testid="theme-toggle"
          onClick={onToggleTheme}
        >
          {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="ms-iconbtn"
          aria-label={strings.settings}
          data-testid="open-settings"
          onClick={onOpenSettings}
        >
          <SettingsIcon aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
