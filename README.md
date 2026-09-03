💣 Minesweeper — the original rules, readable in the dark, playable from the keyboard

A Minesweeper clone built with Next.js and plain DOM. No server, no sign-in, no
analytics: it exports to static HTML and everything happens in your browser.

## Features

- **The game itself**

  - The first click is always safe, and always opens a region — the mines are placed
    after you click, never in the 3×3 around it
  - Chording works: with the right number of flags around an open number, one click
    opens the rest — and it explodes if a flag is in the wrong place, exactly as the
    original does
  - Flags protect a cell, so a stray click cannot cost you the board
  - The mine counter goes negative rather than stopping at zero: a negative number
    tells you a flag is certainly misplaced
  - Losing shows every mine, marks the one that went off, and slashes the flags you
    put in the wrong places
  - The clock starts on your first move, not when the page loads, and does not stop
    at 999 — that was a three-digit LED, not a rule

- **Readable in the dark, and without colour**

  - The eight numerals run as a heat ramp: blue for the quiet counts, through green
    and amber, to red and a violet 8 that means you are in trouble
  - Every numeral clears 4.5:1 contrast in both light and dark mode — measured by
    the test suite on every run, not measured once by hand
  - The digit carries the information and colour only reinforces it, so the board
    still reads in grayscale
  - Open and closed cells are told apart by shape — a closed cell is a bordered
    tile, an open one is flat — because lightness alone cannot carry that difference
    and keep the numerals legible

- **Playable without a mouse**

  - Arrow keys move, `Space` opens, `F` flags, `Enter` chords, `R` starts over
  - One tab stop for the whole board, and the focus ring is always visible
  - Every cell announces its position and state to a screen reader
  - Right click flags, middle click chords, and the browser menu stays out of the way

- **Nothing to install, nothing to sign into**

  - Static export, so it runs from any file host
  - `?seed=` gives you a specific board, so two people can play the same one
  - No account, no analytics, no cookie: nothing about you leaves your device

## Commands

```bash
yarn install
yarn dev          # http://localhost:3000
yarn test         # unit + component tests
yarn test:e2e     # Playwright, against the static export in out/
yarn typecheck
yarn lint
yarn build        # writes out/
```

`yarn test:e2e` needs a build first (`yarn build`) and a Chromium install
(`npx playwright install chromium`).

## Where the documentation lives

`docs/README.md` is the map. In short:

| Question | File |
| --- | --- |
| What is this, and what will it never do? | `docs/01-product/overview.md` |
| What can the player do? | `docs/02-requirements/scope.md` |
| What thresholds apply everywhere? | `docs/02-requirements/nfr.md` |
| What breaks silently if I change it? | `docs/03-design/invariants.md` |
| Why is it built this way? | `docs/decisions/` |
