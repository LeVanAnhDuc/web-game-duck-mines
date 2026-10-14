import type { Config } from "tailwindcss";

/**
 * Tailwind supplies layout utilities only. Every colour, every type role and the
 * board's sizing come from CSS variables defined in src/app/globals.css, which is
 * the only place docs/design-system/minesweeper/MASTER.md is transcribed.
 * Never add a colour literal here - invariant #9.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--bg-page)",
        board: "var(--bg-board)",
        "cell-open": "var(--bg-cell-open)",
        "cell-tile": "var(--bg-cell-tile)",
        edge: "var(--edge-cell-tile)",
        fg: "var(--fg-default)",
        muted: "var(--fg-muted)",
        ring: "var(--ring-focus)",
      },
      fontFamily: {
        ui: "var(--font-ui)",
        num: "var(--font-num)",
      },
    },
  },
  plugins: [],
};

export default config;
