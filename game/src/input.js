// input.js — mouse clicks on both panels plus keyboard shortcuts.
// Converts a click on a canvas (CSS pixels) into scene coordinates (560x460).
import { clickAt, useHint } from './game.js';
import { unlockAudio } from './audio.js';

export function sceneCoordsFromEvent(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  return { x, y };
}

// Wire both canvases to the game. `getState` returns the live state object,
// `refresh` redraws + updates the HUD, `onFail` shows the failed screen.
export function bindPanels(canvasLeft, canvasRight, getState, refresh, onFail) {
  const handler = (canvas) => (event) => {
    unlockAudio();
    const state = getState();
    const { x, y } = sceneCoordsFromEvent(canvas, event);
    clickAt(state, x, y, canvas, performance.now(), () => {
      refresh();
      if (state.phase === 'levelFailed') onFail();
    });
    refresh();
    if (state.phase === 'levelFailed') onFail();
  };
  canvasLeft.addEventListener('click', handler(canvasLeft));
  canvasRight.addEventListener('click', handler(canvasRight));
}

// Keyboard: H hint, R restart level, M mute, Esc menu.
export function bindKeyboard(getState, actions) {
  window.addEventListener('keydown', (event) => {
    const state = getState();
    if (event.key === 'm' || event.key === 'M') {
      actions.toggleMute();
      return;
    }
    if (event.key === 'Escape') {
      actions.toMenu();
      return;
    }
    if (state.phase !== 'playing') return;
    if (event.key === 'h' || event.key === 'H') {
      unlockAudio();
      useHint(state, actions.refresh);
      actions.refresh();
    } else if (event.key === 'r' || event.key === 'R') {
      actions.restartLevel();
    }
  });
}
