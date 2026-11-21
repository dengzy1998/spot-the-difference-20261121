// draw.js — renders both panels and the markers on found differences.
// Left panel = original (no differences applied), right panel = twin (all 7
// applied). Markers are drawn on BOTH panels so a find is visible at a glance.
import { makeRng } from './random.js';

// Draw one scene onto a canvas, with the given set of differences applied.
export function drawPanel(canvas, scene, activeDiffs, seedOverride) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const rng = makeRng(seedOverride ?? scene.seed);
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  scene.draw(ctx, W, H, rng, activeDiffs);
  ctx.restore();
}

// Draw the markers for found differences and the pulsing hint ring.
// `now` is a timestamp (ms) used to animate the hint pulse.
export function drawMarkers(canvasLeft, canvasRight, scene, foundIds, hintDiff, now) {
  for (const canvas of [canvasLeft, canvasRight]) {
    const ctx = canvas.getContext('2d');
    for (const diff of scene.diffs) {
      if (!foundIds.has(diff.id)) continue;
      const pulse = 1 + Math.sin(now / 180) * 0.06;
      ctx.save();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffd93c';
      ctx.shadowColor = '#ffd93c';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#e63946';
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, (diff.r + 5) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      // check mark
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(diff.x - 8, diff.y);
      ctx.lineTo(diff.x - 2, diff.y + 7);
      ctx.lineTo(diff.x + 9, diff.y - 6);
      ctx.stroke();
      ctx.restore();
    }
    if (hintDiff) {
      const pulse = 1 + Math.sin(now / 140) * 0.25;
      ctx.save();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#4361ee';
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.arc(hintDiff.x, hintDiff.y, (hintDiff.r + 6) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// Full re-render of the current level: both panels plus all markers.
export function renderLevel(canvasLeft, canvasRight, scene, state, now) {
  const allDiffs = new Set(scene.diffs.map((d) => d.id));
  drawPanel(canvasLeft, scene, new Set(), state.seed);
  drawPanel(canvasRight, scene, allDiffs, state.seed);
  drawMarkers(canvasLeft, canvasRight, scene, state.found, state.hintDiff, now);
}

// Draw a soft "wrong click" X flash at a point on one canvas.
export function drawWrongMark(canvas, x, y, now) {
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const s = 12 + Math.sin(now / 90) * 2;
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
  ctx.restore();
}
