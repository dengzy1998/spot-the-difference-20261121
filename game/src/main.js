// main.js — bootstrap and wiring for Double Take.
// Owns the HUD, the overlay screens, the render loop and the timer loop;
// the rules live in game.js, the pictures in scenes.js, the drawing in draw.js.
import { SCENES } from './scenes.js';
import { newGameState, currentScene, startGame, startLevel, nextLevel, tick, useHint } from './game.js';
import { renderLevel } from './draw.js';
import { bindPanels, bindKeyboard } from './input.js';
import { applyShot } from './demo.js';
import { isMuted, setMuted, unlockAudio, playClick } from './audio.js';

const $ = (id) => document.getElementById(id);
const canvasLeft = $('canvas-left');
const canvasRight = $('canvas-right');
const state = newGameState();
window.__game = state;

const overlays = {
  title: $('overlay-title'),
  level: $('overlay-level'),
  failed: $('overlay-failed'),
  win: $('overlay-win'),
};

function showOverlay(name) {
  for (const [key, el] of Object.entries(overlays)) {
    el.classList.toggle('hidden', key !== name);
  }
}

function updateHud() {
  const scene = currentScene(state);
  $('hud-scene').textContent = `Scene ${state.levelIndex + 1} / 6 · ${scene.name}`;
  $('hud-found').textContent = `Found ${state.found.size} / ${scene.diffs.length}`;
  $('hud-score').textContent = `Score ${state.score}`;
  $('hud-combo').textContent = `Combo ×${Math.max(1, state.combo)}`;
  $('hud-combo').style.opacity = state.combo >= 2 ? '1' : '0.55';
  const pct = Math.max(0, (state.timeLeft / scene.timeLimit) * 100);
  const bar = $('timer-bar');
  bar.style.width = `${pct}%`;
  bar.classList.toggle('low', state.timeLeft <= 15);
  $('hud-time').textContent = `${Math.ceil(state.timeLeft)}s`;
  const hintBtn = $('hint-btn');
  hintBtn.textContent = `💡 Hint (${state.hintsLeft})`;
  hintBtn.disabled = state.phase !== 'playing' || state.hintsLeft <= 0;
  $('mute-btn').textContent = isMuted() ? '🔇' : '🔊';
  $('hud-best').textContent = `Best ${state.best}`;
  $('title-best').textContent = String(state.best);
  // Found strip: one chip per difference — found ones name themselves,
  // the rest stay as "?" so the hunt's progress is visible at a glance.
  const strip = $('found-strip');
  strip.innerHTML = '';
  for (const diff of scene.diffs) {
    const chip = document.createElement('span');
    if (state.found.has(diff.id)) {
      chip.className = 'chip found';
      chip.textContent = `✓ ${diff.label}`;
    } else {
      chip.className = 'chip remaining';
      chip.textContent = '? still hiding…';
    }
    strip.appendChild(chip);
  }
}

function fillLevelOverlay() {
  const scene = currentScene(state);
  $('level-title').textContent = `${scene.name} — cleared!`;
  $('level-found').textContent = `${state.found.size} / ${scene.diffs.length}`;
  $('level-time-bonus').textContent = `+${state.levelBonus}`;
  $('level-accuracy').textContent = `${state.levelAccuracy}%`;
  $('level-score').textContent = String(state.score);
  $('next-btn').textContent =
    state.levelIndex >= SCENES.length - 1 ? 'See final score →' : 'Next level →';
}

function fillFailedOverlay() {
  const scene = currentScene(state);
  $('failed-found').textContent = `${state.found.size} / ${scene.diffs.length}`;
  $('failed-left').textContent = String(scene.diffs.length - state.found.size);
}

function fillWinOverlay() {
  $('win-score').textContent = String(state.totalScore);
  $('win-accuracy').textContent = `${state.totalAccuracy}%`;
  $('win-combo').textContent = `×${state.bestCombo}`;
  $('win-best').textContent = String(state.best);
  $('new-best').classList.toggle('hidden', !state.isNewBest);
}

// Redraw the panels and refresh the HUD. Called after every state change.
function refresh() {
  const scene = currentScene(state);
  renderLevel(canvasLeft, canvasRight, scene, state, performance.now());
  updateHud();
  if (state.phase === 'levelComplete') {
    fillLevelOverlay();
    showOverlay('level');
  } else if (state.phase === 'levelFailed') {
    fillFailedOverlay();
    showOverlay('failed');
  } else if (state.phase === 'gameComplete') {
    fillWinOverlay();
    showOverlay('win');
  } else if (state.phase === 'title') {
    showOverlay('title');
  } else {
    showOverlay(null);
  }
  const status = $('status');
  status.textContent =
    state.phase === 'playing'
      ? `${scene.name}: found ${state.found.size} of ${scene.diffs.length}, score ${state.score}, ${Math.ceil(state.timeLeft)} seconds left.`
      : `Double Take, ${state.phase}.`;
}

// Animation loop: keeps markers pulsing and the hint ring alive.
function loop(now) {
  if (state.phase === 'playing' || state.phase === 'levelComplete' || state.phase === 'levelFailed') {
    const scene = currentScene(state);
    renderLevel(canvasLeft, canvasRight, scene, state, now);
  }
  requestAnimationFrame(loop);
}

function toMenu() {
  state.phase = 'title';
  showOverlay('title');
  refresh();
}

function toggleMute() {
  setMuted(!isMuted());
  updateHud();
}

function restartLevel() {
  startLevel(state, state.levelIndex);
  refresh();
}

// Buttons.
$('play-btn').addEventListener('click', () => {
  unlockAudio();
  playClick();
  startGame(state);
  refresh();
});
$('next-btn').addEventListener('click', () => {
  unlockAudio();
  playClick();
  if (state.levelIndex >= SCENES.length - 1) {
    refresh();
  } else {
    nextLevel(state);
    refresh();
  }
});
$('replay-btn').addEventListener('click', () => {
  unlockAudio();
  playClick();
  restartLevel();
});
$('retry-btn').addEventListener('click', () => {
  unlockAudio();
  playClick();
  restartLevel();
});
$('menu-btn').addEventListener('click', () => {
  unlockAudio();
  playClick();
  toMenu();
});
$('again-btn').addEventListener('click', () => {
  unlockAudio();
  playClick();
  startGame(state);
  refresh();
});
$('win-menu-btn').addEventListener('click', () => {
  unlockAudio();
  playClick();
  toMenu();
});
$('hint-btn').addEventListener('click', () => {
  unlockAudio();
  useHint(state, refresh);
  refresh();
});
$('mute-btn').addEventListener('click', () => {
  unlockAudio();
  toggleMute();
});

bindPanels(canvasLeft, canvasRight, () => state, refresh, () => refresh());
bindKeyboard(() => state, {
  toggleMute,
  toMenu,
  restartLevel,
  refresh,
});

// Timer: 4 ticks a second while playing.
setInterval(() => {
  if (state.phase !== 'playing') return;
  tick(state, () => refresh(), () => updateHud());
}, 250);

// Boot: title screen by default, or a demo shot (?shot=start|play|win|level).
const hadShot = applyShot(state, refresh, showOverlay);
if (!hadShot) {
  refresh();
  window.__shotReady = true;
}
requestAnimationFrame(loop);
