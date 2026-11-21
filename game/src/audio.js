// audio.js — WebAudio synth sound effects. No audio files, no network.
// The context is created lazily on the first user gesture, so browsers allow it.
let ctx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = !!value;
  return muted;
}

function audioContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// Unlock audio on the first gesture (click / key). Safe to call repeatedly.
export function unlockAudio() {
  audioContext();
}

function tone(freq, startAt, duration, type, volume) {
  if (muted) return;
  const ac = audioContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + duration + 0.05);
}

// Bright two-note chime when a difference is found.
export function playFound() {
  tone(880, 0, 0.16, 'sine', 0.22);
  tone(1318.5, 0.09, 0.24, 'sine', 0.2);
}

// Low buzz for a wrong click.
export function playError() {
  tone(140, 0, 0.22, 'sawtooth', 0.12);
  tone(110, 0.05, 0.22, 'sawtooth', 0.1);
}

// Rising arpeggio for a cleared level.
export function playWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.2));
}

// Short tick when the timer is nearly out.
export function playTick() {
  tone(1200, 0, 0.05, 'square', 0.06);
}

// Soft UI click.
export function playClick() {
  tone(660, 0, 0.06, 'sine', 0.1);
}
