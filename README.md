# spot-the-difference-20261121

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/dengzy1998/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/dengzy1998/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Double Take — 6 scenes, 42 differences, hints & time attack.** A spot-the-difference game: two near-identical pictures side by side, seven fair-but-hidden differences in each of six original hand-drawn scenes (Sunny Park, Cozy Kitchen, Harbour at Dusk, Space Station, Enchanted Forest, Cat Café). Click a difference on either picture to mark it on both, chain finds into combos, spend hints wisely, and beat the clock — later scenes hide subtler differences, give you less time and fewer hints. All art is drawn procedurally with Canvas 2D and all sounds are synthesised with WebAudio; the game runs entirely offline from static files, with no network requests.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — no build step, no dependencies.

## How to play

- Click a difference on either picture. A gold ring + check mark appears on both panels, a chime plays, and your combo grows (100 × combo points per find).
- Wrong click: −3 seconds, combo resets, red X flash and a low buzz.
- Find all 7 before the timer runs out to clear the level (time bonus +10/sec left). Timer hits 0 and the level fails — retry it.
- Clear all 6 scenes to see your final score, accuracy and best combo. Best score is kept in localStorage.
- Hint button (or **H**): reveals one unfound difference for ~2.5 s, costs 50 points, limited per scene (3, 3, 3, 2, 2, 1). **R** restarts the level, **M** mutes, **Esc** returns to the menu.

## Screenshots

The game ships a demo driver (`game/src/demo.js`): `?shot=start|play|win|level` sets up deterministic title / gameplay / game-complete / level-complete states for screenshots, and `?seed=` fixes the decoration randomness.

## Files

- `game/index.html` — page shell, HUD and overlay screens
- `game/src/style.css` — layout and theme
- `game/src/main.js` — bootstrap, HUD, overlays, render + timer loops
- `game/src/random.js` — seeded RNG for deterministic scenes
- `game/src/scenes.js` — the 6 scene definitions: drawing + 7 differences each
- `game/src/draw.js` — panel rendering + find markers
- `game/src/game.js` — state machine, timer, score, combos, levels
- `game/src/audio.js` — WebAudio synth sound effects
- `game/src/input.js` — click / keyboard / hint handling
- `game/src/demo.js` — autopilot demo driver for screenshots
- `main.ts` — hands the game in (copies `game/` + `screenshots/` to `/output`, writes `dossier.json`)

---

<sub>Entered on [make.fun](https://make.fun/?ref=rte2wqtk&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
