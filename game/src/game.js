// game.js — the state machine: title → playing → level complete / failed →
// game complete. Owns the timer, score, combos, hints, accuracy and best score.
import { SCENES } from './scenes.js';
import { renderLevel, drawWrongMark } from './draw.js';
import { playFound, playError, playWin, playTick, playClick } from './audio.js';

export const BEST_KEY = 'double-take-best-score';

export function loadBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(score) {
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // storage unavailable (private mode): best score just isn't kept
  }
}

// Fresh state for a whole run.
export function newGameState() {
  return {
    phase: 'title', // title | playing | levelComplete | levelFailed | gameComplete
    levelIndex: 0,
    found: new Set(),
    score: 0,
    combo: 0,
    bestCombo: 0,
    clicks: 0,
    correctClicks: 0,
    timeLeft: SCENES[0].timeLimit,
    hintsLeft: SCENES[0].hints,
    hintDiff: null,
    hintTimer: null,
    seed: 1,
    levelScore: 0,
    levelBonus: 0,
    levelAccuracy: 100,
    totalScore: 0,
    totalAccuracy: 100,
    isNewBest: false,
    best: loadBest(),
    wrongMark: null,
  };
}

export function currentScene(state) {
  return SCENES[state.levelIndex];
}

export function startLevel(state, levelIndex) {
  const scene = SCENES[levelIndex];
  state.levelIndex = levelIndex;
  state.phase = 'playing';
  state.found = new Set();
  state.combo = 0;
  state.timeLeft = scene.timeLimit;
  state.hintsLeft = scene.hints;
  state.hintDiff = null;
  state.wrongMark = null;
  if (state.hintTimer) {
    clearTimeout(state.hintTimer);
    state.hintTimer = null;
  }
}

export function startGame(state) {
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.clicks = 0;
  state.correctClicks = 0;
  state.totalScore = 0;
  startLevel(state, 0);
}

// Called by the timer loop every 250 ms while playing.
export function tick(state, onFail, onUi) {
  if (state.phase !== 'playing') return;
  state.timeLeft = Math.max(0, state.timeLeft - 0.25);
  if (state.timeLeft <= 10 && state.timeLeft > 0 && Math.abs(state.timeLeft % 1) < 0.26) playTick();
  if (state.timeLeft <= 0) {
    state.phase = 'levelFailed';
    onFail();
  }
  onUi();
}

// Handle a click at scene coordinates (x, y) on either panel.
// Returns the difference found, or null.
export function clickAt(state, x, y, canvas, now, onUi) {
  if (state.phase !== 'playing') return null;
  const scene = currentScene(state);
  state.clicks += 1;
  let best = null;
  let bestDist = Infinity;
  for (const diff of scene.diffs) {
    if (state.found.has(diff.id)) continue;
    const d = Math.hypot(x - diff.x, y - diff.y);
    if (d < diff.r + 14 && d < bestDist) {
      best = diff;
      bestDist = d;
    }
  }
  if (best) {
    state.found.add(best.id);
    state.correctClicks += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const gained = 100 * state.combo;
    state.score += gained;
    state.levelScore = state.score;
    playFound();
    if (state.found.size === scene.diffs.length) {
      completeLevel(state);
    }
  } else {
    state.combo = 0;
    state.timeLeft = Math.max(0, state.timeLeft - 3);
    state.wrongMark = { x, y, at: now };
    playError();
    drawWrongMark(canvas, x, y, now);
    setTimeout(() => {
      state.wrongMark = null;
      onUi();
    }, 450);
    if (state.timeLeft <= 0) state.phase = 'levelFailed';
  }
  onUi();
  return best;
}

function completeLevel(state) {
  const scene = currentScene(state);
  state.levelBonus = Math.round(state.timeLeft) * 10;
  state.score += state.levelBonus;
  state.levelScore = state.score;
  state.levelAccuracy = state.clicks === 0 ? 100 : Math.round((state.correctClicks / state.clicks) * 100);
  state.totalScore = state.score;
  playWin();
  if (state.levelIndex === SCENES.length - 1) {
    state.phase = 'gameComplete';
    state.totalAccuracy = state.clicks === 0 ? 100 : Math.round((state.correctClicks / state.clicks) * 100);
    state.isNewBest = state.score > state.best;
    if (state.isNewBest) {
      state.best = state.score;
      saveBest(state.score);
    }
  } else {
    state.phase = 'levelComplete';
  }
}

// Reveal one unfound difference for ~2.5 s. Costs 50 points, one at a time.
export function useHint(state, onUi) {
  if (state.phase !== 'playing' || state.hintsLeft <= 0 || state.hintDiff) return null;
  const scene = currentScene(state);
  const remaining = scene.diffs.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return null;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintDiff = diff;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 50);
  playClick();
  state.hintTimer = setTimeout(() => {
    state.hintDiff = null;
    state.hintTimer = null;
    onUi();
  }, 2500);
  onUi();
  return diff;
}

// Advance after a cleared level (or replay it).
export function nextLevel(state) {
  startLevel(state, state.levelIndex + 1);
}

export { renderLevel };
