// demo.js — autopilot / demo driver for screenshots and testing.
// Reads ?shot= and ?seed= from the URL and sets up a deterministic state,
// then sets window.__shotReady = true once the frame is rendered.
// Exposes window.__game (live state) and window.__testPoint (page coords of
// one real unfound difference on the right panel, for click tests).
import { SCENES } from './scenes.js';
import { newGameState, startLevel, startGame } from './game.js';

export function applyShot(state, refresh, showOverlay) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const seed = Number(params.get('seed') || 1);
  if (!shot) return false;
  state.seed = seed;

  if (shot === 'start') {
    state.phase = 'title';
    state.best = Number(window.localStorage.getItem('double-take-best-score') || 0) || 0;
    showOverlay('title');
  } else if (shot === 'play') {
    // Cover shot: busy middle scene (Harbour at Dusk) with 4 of 7 found,
    // timer mid-way, a real score and combo on the board.
    startGame(state);
    startLevel(state, 2);
    const scene = SCENES[2];
    for (let i = 0; i < 4; i++) state.found.add(scene.diffs[i].id);
    state.correctClicks = 4;
    state.clicks = 5;
    state.score = 100 + 200 + 300 + 400;
    state.combo = 4;
    state.bestCombo = 4;
    state.timeLeft = 65;
    state.hintsLeft = 2;
    showOverlay(null);
  } else if (shot === 'win') {
    startGame(state);
    startLevel(state, 5);
    const scene = SCENES[5];
    for (const d of scene.diffs) state.found.add(d.id);
    state.phase = 'gameComplete';
    state.score = 8450;
    state.totalScore = 8450;
    state.totalAccuracy = 92;
    state.bestCombo = 7;
    state.combo = 7;
    state.clicks = 46;
    state.correctClicks = 42;
    state.best = 8450;
    state.isNewBest = true;
    state.timeLeft = 37;
    state.hintsLeft = 1;
    showOverlay('win');
  } else if (shot === 'level') {
    startGame(state);
    startLevel(state, 2);
    const scene = SCENES[2];
    for (const d of scene.diffs) state.found.add(d.id);
    state.correctClicks = 7;
    state.clicks = 8;
    state.combo = 7;
    state.bestCombo = 7;
    state.score = 2350;
    state.levelBonus = 650;
    state.score += state.levelBonus;
    state.levelScore = state.score;
    state.levelAccuracy = 88;
    state.timeLeft = 65;
    state.hintsLeft = 2;
    state.phase = 'levelComplete';
    showOverlay('level');
  } else {
    return false;
  }
  refresh();
  // Expose a real unfound difference for the click test (right panel).
  const scene = SCENES[state.levelIndex];
  const unfound = scene.diffs.find((d) => !state.found.has(d.id));
  if (unfound && state.phase === 'playing') {
    const canvas = document.getElementById('canvas-right');
    const rect = canvas.getBoundingClientRect();
    window.__testPoint = {
      x: rect.left + (unfound.x / canvas.width) * rect.width,
      y: rect.top + (unfound.y / canvas.height) * rect.height,
      id: unfound.id,
    };
  }
  window.__game = state;
  window.__shotReady = true;
  return true;
}

export { newGameState };
