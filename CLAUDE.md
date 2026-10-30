# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Browser-based Super Mario Bros clone built with vanilla HTML5 Canvas and JavaScript (no build step, no dependencies). Open `index.html` directly in a browser to run.

## Architecture

The game uses a global-namespace pattern — all files load via `<script>` tags in `index.html` in dependency order. There are no ES modules or bundlers.

### Key globals
| File | Exports |
|------|---------|
| `js/config.js` | `CONFIG`, `TILE`, `SOLID_TILES`, `ST` (player states), `GS` (game states), `CHAR_MAP` |
| `js/input.js` | `Input` — keyboard + touch handler; call `Input.tick()` each frame |
| `js/audio.js` | `Audio` — Web Audio API sounds; `Audio.init()` must be called after user gesture |
| `js/sprites.js` | `Sprites` — all procedural canvas drawing functions (no sprite sheets) |
| `js/entities.js` | `Entity`, `Player`, `Goomba`, `Koopa`, `CoinEntity`, `PowerUpEntity`, `Fireball`, `BounceCoin`, `ScorePopup` |
| `js/levels.js` | `LEVELS` — array of level data objects |
| `js/level.js` | `Level` — tile map, collision, entity orchestration |
| `js/hud.js` | `HUD` — score, time, lives overlay |
| `js/game.js` | `Game` — main loop, state machine |
| `js/main.js` | Entry point: creates `Game`, patches `Level._hitBlock`, starts RAF loop |

### Entity physics convention
- `x`, `y` = **center-X**, **bottom-Y** of bounding box
- Movement is handled by `Level.moveEntity(e)` (player, full collision) or `Level.moveEntitySimple(e)` (enemies, no block interactions)
- Never apply `e.x += e.vx` / `e.y += e.vy` in an entity's own `update()` — the move methods do this

### Block hit results
`Level._hitBlock` is monkey-patched in `main.js` to write its return value to `level._lastBlockHit`. `Game._updatePlay` reads and clears this each frame to award score/coins.

### Level format (in `levels.js`)
Each level is an object with:
- `map`: 15 strings of up to 100 chars — parsed by `Level._parse` using `CHAR_MAP` (space=air, g=ground, b=brick, q=?coin, m=?powerup, s=?star, #=solid, `[]`/`()`=pipe segments)
- `entities`: array of `{type, col, row}` spawn points (goomba, koopa, coin)
- `goal`: column where the flag pole stands
- `castleCol`: column where castle is drawn

### Game state machine (`GS`)
`MENU → PLAY ↔ PAUSE`, `PLAY → LVLEND → TRANS → PLAY` (next level) or `WIN`, `PLAY → DYING → TRANS → PLAY` (respawn) or `GAMEOVER`

## Branch conventions

Develop on `claude/<description>-<id>` feature branches; push with `git push -u origin <branch>`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
