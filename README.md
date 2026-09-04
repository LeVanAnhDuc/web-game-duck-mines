💣 Minesweeper — the original rules, readable in the dark, playable from the keyboard

[![CI](https://github.com/LeVanAnhDuc/web-game-minesweeper/actions/workflows/ci.yml/badge.svg)](https://github.com/LeVanAnhDuc/web-game-minesweeper/actions/workflows/ci.yml)
[![Deploy](https://github.com/LeVanAnhDuc/web-game-minesweeper/actions/workflows/deploy.yml/badge.svg)](https://github.com/LeVanAnhDuc/web-game-minesweeper/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/LeVanAnhDuc/web-game-minesweeper?sort=semver)](https://github.com/LeVanAnhDuc/web-game-minesweeper/releases)

A Minesweeper clone built with Next.js and plain DOM. No server, no sign-in, no
analytics: it exports to static HTML and everything happens in your browser.

**Play**: https://levananhduc.github.io/web-game-minesweeper/

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

Two checks enforce thresholds that would otherwise only be written down:

```bash
yarn check:bundle   # NFR-PERF-07: first-load JS, measured from the exported HTML
yarn check:audit    # NFR-SEC-05: fails on high/critical advisories only
```

## What runs on GitHub

| Workflow | When | What it does |
| --- | --- | --- |
| `ci.yml` | every pull request and push to `main` | Two parallel jobs: lint + typecheck + unit tests + dependency audit, and build + first-load-JS budget + the end-to-end suite at four viewports |
| `deploy.yml` | push to `main` | Rebuilds with `GITHUB_PAGES=true` and publishes `out/` to GitHub Pages. It re-runs the tests rather than trusting a green run it cannot see |
| `release.yml` | push to `main` | Works out the next version, composes the notes, and publishes a GitHub release |

## Releases

Version numbers and release notes are **derived from the commit history**, so neither
depends on anyone remembering to do something. Both live in scripts you can run
locally — a release process you can only exercise by pushing to `main` is one nobody
exercises:

```bash
yarn release:next            # which tag the next release would get, and why
yarn release:notes v1.1.0    # what its notes would say
```

**How the version is decided**, against the previous `v*` tag:

| Since the last tag | Bump |
| --- | --- |
| a commit marked `feat!:` / `fix!:` …, or a `BREAKING CHANGE:` body | major |
| any `feat:` commit | minor |
| anything else | patch |

The head commit's **subject** can override it: `[release major]`, `[release minor]`,
or `[skip release]` to publish nothing. Only the subject counts — a body that merely
mentions the marker (this README, for one) must not trigger a release.

**How the notes are composed:** commit subjects since the previous tag, grouped by
their Conventional Commit prefix — breaking changes first, then What's new (`feat`),
Fixes (`fix`), Performance, Internals, Tests, Documentation, Build and tooling.
Scopes are kept as labels, so `feat(core-game): …` reads as **core-game**: …

Commits that are not Conventional Commits land under "Other" rather than being
dropped. A release note that swallows commits is a release note that has started
lying.

GitHub's own `--generate-notes` is not used: it groups by pull-request label, and
this repository does not label its PRs. What it does have is a conventional subject
on every commit. See [ADR-0006](docs/decisions/0006-releases-derived-from-commits.md).

## Keeping this README honest

`## Features` is the user-facing contract, so it changes in the **same branch** as the
code that changes behaviour — never in a catch-up pass afterwards:

- a `feat:` that a player would notice gets **one short bullet**, in English, in the
  existing voice: what the player can now do, not which component was added
- a bullet describes behaviour that exists **today**. Nothing here is aspirational —
  if it is in this list, it works
- a change that only a developer would notice (refactor, tooling, tests) does **not**
  belong in `## Features`
- a README-only change is a `docs:` commit and, on its own, releases a patch

## Where the documentation lives

`docs/README.md` is the map. In short:

| Question | File |
| --- | --- |
| What is this, and what will it never do? | `docs/01-product/overview.md` |
| What can the player do? | `docs/02-requirements/scope.md` |
| What thresholds apply everywhere? | `docs/02-requirements/nfr.md` |
| What breaks silently if I change it? | `docs/03-design/invariants.md` |
| Why is it built this way? | `docs/decisions/` |
