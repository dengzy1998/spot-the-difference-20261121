// scenes.js — the 6 original scenes of Double Take, all drawn with Canvas 2D.
// Each scene: { name, subtitle, timeLimit, hints, seed, diffs, draw }.
// draw(ctx, W, H, rng, active): renders the scene; `active` is a Set of
// difference ids applied on this panel (empty = original, all 7 = the twin).
// Every difference is a small, fair, deliberately hidden change: a missing
// object, a colour swap, an extra or vanished detail — never a big repaint.

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  circle(ctx, x, y, 18 * s, '#ffffff');
  circle(ctx, x + 20 * s, y - 8 * s, 15 * s, '#ffffff');
  circle(ctx, x + 40 * s, y, 17 * s, '#ffffff');
  circle(ctx, x + 20 * s, y + 6 * s, 16 * s, '#ffffff');
}

function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#2b2113';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 3 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 3 * s, y - 8 * s, x + 10 * s, y);
  ctx.stroke();
}

function flower(ctx, x, y, petal, center) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 7, y + Math.sin(a) * 7, 5, petal);
  }
  circle(ctx, x, y, 5, center);
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 20);
  ctx.stroke();
}

// ---------------------------------------------------------------- scene 1
function drawPark(ctx, W, H, rng, active) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#8ec9ee');
  sky.addColorStop(1, '#dff3ff');
  rect(ctx, 0, 0, W, 300, '#8ec9ee');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 300);
  // sun
  circle(ctx, 70, 70, 38, '#ffd93c');
  ctx.strokeStyle = '#f0a500';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(70 + Math.cos(a) * 44, 70 + Math.sin(a) * 44);
    ctx.lineTo(70 + Math.cos(a) * 54, 70 + Math.sin(a) * 54);
    ctx.stroke();
  }
  if (active.has('sun-glasses')) {
    rect(ctx, 48, 58, 18, 12, '#222');
    rect(ctx, 76, 58, 18, 12, '#222');
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(66, 64);
    ctx.lineTo(76, 64);
    ctx.stroke();
  }
  cloud(ctx, 190, 60, 1);
  if (!active.has('cloud-gone')) cloud(ctx, 370, 48, 1.1);
  cloud(ctx, 470, 95, 0.8);
  bird(ctx, 250, 85, 1);
  bird(ctx, 300, 65, 0.9);
  if (active.has('bird-extra')) bird(ctx, 330, 100, 1);
  // hills + grass
  ctx.fillStyle = '#7ec850';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(180, 250, 360, 295);
  ctx.quadraticCurveTo(480, 325, 560, 290);
  ctx.lineTo(560, 460);
  ctx.lineTo(0, 460);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 0, 380, W, 80, '#69b843');
  // kite
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(430, 130);
  ctx.lineTo(470, 230);
  ctx.stroke();
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(430, 110);
  ctx.lineTo(460, 130);
  ctx.lineTo(430, 150);
  ctx.lineTo(405, 130);
  ctx.closePath();
  ctx.fill();
  // pond
  ellipse(ctx, 110, 405, 85, 26, '#4aa3df');
  ellipse(ctx, 110, 402, 70, 20, '#7cc4ee');
  if (!active.has('duck-gone')) {
    ellipse(ctx, 95, 400, 14, 9, '#fff3b0');
    circle(ctx, 107, 393, 7, '#fff3b0');
    circle(ctx, 109, 391, 1.5, '#222');
    ctx.fillStyle = '#f48c06';
    ctx.beginPath();
    ctx.moveTo(113, 393);
    ctx.lineTo(120, 395);
    ctx.lineTo(113, 397);
    ctx.closePath();
    ctx.fill();
  }
  // tree
  rect(ctx, 462, 250, 18, 120, '#7a4a21');
  circle(ctx, 471, 215, 52, '#3e9b4f');
  circle(ctx, 435, 240, 34, '#57b368');
  circle(ctx, 505, 240, 34, '#57b368');
  if (active.has('apples')) {
    circle(ctx, 445, 220, 7, '#e63946');
    circle(ctx, 485, 200, 7, '#e63946');
    circle(ctx, 500, 240, 7, '#e63946');
  }
  // bench
  rect(ctx, 195, 315, 90, 8, '#8d5a2b');
  if (!active.has('bench-slat')) rect(ctx, 195, 332, 90, 8, '#8d5a2b');
  rect(ctx, 200, 323, 8, 45, '#6d4423');
  rect(ctx, 272, 323, 8, 45, '#6d4423');
  rect(ctx, 195, 348, 90, 6, '#8d5a2b');
  // path
  ctx.fillStyle = '#e8d5a3';
  ctx.beginPath();
  ctx.moveTo(300, 460);
  ctx.lineTo(330, 380);
  ctx.lineTo(360, 380);
  ctx.lineTo(390, 460);
  ctx.closePath();
  ctx.fill();
  // flowers
  flower(ctx, 150, 400, active.has('tulip-purple') ? '#9b5de5' : '#e63946', '#ffd93c');
  flower(ctx, 350, 420, '#f15bb5', '#ffd93c');
  flower(ctx, 520, 410, '#ffffff', '#ffd93c');
  flower(ctx, 60, 440, '#f15bb5', '#ffd93c');
}

// ---------------------------------------------------------------- scene 2
function drawKitchen(ctx, W, H, rng, active) {
  rect(ctx, 0, 0, W, H, '#f3e2c7');
  rect(ctx, 0, 0, W, 330, '#f8ead0');
  rect(ctx, 0, 330, W, 130, '#d9a066');
  // window with curtains
  rect(ctx, 55, 45, 130, 140, '#a8d8ea');
  rect(ctx, 55, 45, 130, 140, 'rgba(255,255,255,0.15)');
  ctx.strokeStyle = '#8d5a2b';
  ctx.lineWidth = 4;
  ctx.strokeRect(55, 45, 130, 140);
  ctx.beginPath();
  ctx.moveTo(120, 45);
  ctx.lineTo(120, 185);
  ctx.moveTo(55, 115);
  ctx.lineTo(185, 115);
  ctx.stroke();
  circle(ctx, 165, 70, 14, '#ffd93c');
  const curtain = active.has('curtain-color') ? '#2a9d8f' : '#e63946';
  ctx.fillStyle = curtain;
  ctx.beginPath();
  ctx.moveTo(45, 35);
  ctx.lineTo(70, 35);
  ctx.lineTo(70, 200);
  ctx.lineTo(45, 200);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(175, 35);
  ctx.lineTo(200, 35);
  ctx.lineTo(200, 200);
  ctx.lineTo(175, 200);
  ctx.closePath();
  ctx.fill();
  // clock
  circle(ctx, 280, 70, 26, '#ffffff');
  ctx.strokeStyle = '#2b2113';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(280, 70, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(280, 70);
  ctx.lineTo(active.has('clock-time') ? 258 : 280, active.has('clock-time') ? 70 : 52);
  ctx.moveTo(280, 70);
  ctx.lineTo(active.has('clock-time') ? 280 : 296, active.has('clock-time') ? 86 : 70);
  ctx.stroke();
  // picture frame (tilts when active)
  ctx.save();
  ctx.translate(490, 80);
  if (active.has('frame-tilt')) ctx.rotate(0.16);
  rect(ctx, -28, -22, 56, 44, '#8d5a2b');
  rect(ctx, -22, -16, 44, 32, '#ffb4a2');
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(-10, 8);
  ctx.lineTo(0, -8);
  ctx.lineTo(10, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // shelf with jars
  rect(ctx, 330, 130, 150, 10, '#8d5a2b');
  rect(ctx, 340, 95, 26, 35, '#f4a261');
  rect(ctx, 375, 90, 26, 40, '#2a9d8f');
  rect(ctx, 410, 98, 26, 32, '#e9c46a');
  rect(ctx, 445, 92, 26, 38, '#e76f51');
  // stove + kettle
  rect(ctx, 400, 240, 120, 90, '#6c757d');
  rect(ctx, 410, 250, 100, 55, '#495057');
  circle(ctx, 435, 268, 12, '#222');
  circle(ctx, 485, 268, 12, '#222');
  ctx.fillStyle = '#adb5bd';
  ctx.beginPath();
  ctx.moveTo(430, 250);
  ctx.lineTo(450, 215);
  ctx.lineTo(480, 215);
  ctx.lineTo(500, 250);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 455, 205, 20, 12, '#343a40');
  if (!active.has('steam')) {
    ctx.strokeStyle = 'rgba(120,120,120,0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(455, 200);
    ctx.quadraticCurveTo(450, 185, 458, 172);
    ctx.moveTo(472, 200);
    ctx.quadraticCurveTo(478, 184, 470, 170);
    ctx.stroke();
  }
  // table + fruit bowl + mug
  rect(ctx, 150, 300, 220, 14, '#a4713a');
  rect(ctx, 165, 314, 12, 80, '#7a4a21');
  rect(ctx, 343, 314, 12, 80, '#7a4a21');
  ellipse(ctx, 270, 296, 48, 12, '#2a9d8f');
  circle(ctx, 250, 288, 11, '#e63946');
  if (!active.has('apple-gone')) circle(ctx, 272, 284, 11, '#e63946');
  circle(ctx, 292, 288, 11, '#f4a261');
  ctx.fillStyle = active.has('mug-color') ? '#f4a261' : '#4361ee';
  ctx.fillRect(185, 278, 24, 24);
  ctx.strokeStyle = active.has('mug-color') ? '#f4a261' : '#4361ee';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(213, 290, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // chair + cat
  rect(ctx, 400, 330, 90, 10, '#8d5a2b');
  rect(ctx, 405, 340, 8, 55, '#6d4423');
  rect(ctx, 477, 340, 8, 55, '#6d4423');
  ellipse(ctx, 445, 320, 30, 16, '#f4a261');
  circle(ctx, 470, 306, 13, '#f4a261');
  ctx.beginPath();
  ctx.moveTo(462, 296);
  ctx.lineTo(466, 284);
  ctx.lineTo(471, 296);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(474, 296);
  ctx.lineTo(479, 285);
  ctx.lineTo(482, 297);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f4a261';
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (active.has('cat-tail')) {
    ctx.moveTo(418, 322);
    ctx.quadraticCurveTo(400, 310, 405, 292);
  } else {
    ctx.moveTo(418, 322);
    ctx.quadraticCurveTo(400, 330, 408, 344);
  }
  ctx.stroke();
  // rug
  ellipse(ctx, 280, 430, 150, 18, '#e63946');
  ellipse(ctx, 280, 430, 110, 12, '#f8ead0');
}

// ---------------------------------------------------------------- scene 3
function drawHarbour(ctx, W, H, rng, active) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#5e548e');
  sky.addColorStop(0.55, '#e07a5f');
  sky.addColorStop(1, '#f4a261');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 260);
  // moon
  if (active.has('moon-phase')) {
    circle(ctx, 500, 60, 22, '#f8edeb');
    circle(ctx, 508, 56, 18, '#5e548e');
  } else {
    circle(ctx, 500, 60, 22, '#f8edeb');
    circle(ctx, 494, 55, 4, '#e0d5c8');
    circle(ctx, 506, 66, 3, '#e0d5c8');
  }
  bird(ctx, 220, 70, 1);
  bird(ctx, 260, 55, 0.9);
  if (active.has('gull-extra')) bird(ctx, 300, 80, 1);
  // sea
  rect(ctx, 0, 260, W, 130, '#2a6f97');
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = 285 + i * 20;
    ctx.beginPath();
    ctx.moveTo(20 + i * 30, y);
    ctx.quadraticCurveTo(120 + i * 40, y - 6, 260 + i * 30, y);
    ctx.stroke();
  }
  // sun reflection
  ctx.fillStyle = 'rgba(244,162,97,0.55)';
  ctx.fillRect(250, 262, 60, 120);
  // lighthouse
  rect(ctx, 60, 130, 40, 160, '#f8edeb');
  ctx.fillStyle = '#e63946';
  ctx.fillRect(60, 155, 40, 22);
  ctx.fillRect(60, 205, 40, 22);
  rect(ctx, 55, 110, 50, 22, '#2b2113');
  circle(ctx, 80, 121, 9, active.has('lighthouse-beam') ? '#ffe066' : '#888');
  if (active.has('lighthouse-beam')) {
    ctx.fillStyle = 'rgba(255,224,102,0.35)';
    ctx.beginPath();
    ctx.moveTo(105, 118);
    ctx.lineTo(240, 80);
    ctx.lineTo(240, 160);
    ctx.lineTo(105, 128);
    ctx.closePath();
    ctx.fill();
  }
  // boats
  ctx.fillStyle = '#8d5a2b';
  ctx.beginPath();
  ctx.moveTo(300, 300);
  ctx.lineTo(380, 300);
  ctx.lineTo(365, 320);
  ctx.lineTo(315, 320);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = active.has('sail-color') ? '#e63946' : '#ffffff';
  ctx.beginPath();
  ctx.moveTo(340, 300);
  ctx.lineTo(340, 225);
  ctx.lineTo(375, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6c757d';
  ctx.beginPath();
  ctx.moveTo(430, 315);
  ctx.lineTo(500, 315);
  ctx.lineTo(488, 332);
  ctx.lineTo(442, 332);
  ctx.closePath();
  ctx.fill();
  // house with windows
  rect(ctx, 400, 200, 90, 80, '#7a4a21');
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(395, 200);
  ctx.lineTo(445, 165);
  ctx.lineTo(495, 200);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 415, 225, 22, 22, active.has('window-light') ? '#ffe066' : '#2b2113');
  rect(ctx, 453, 225, 22, 22, '#2b2113');
  // pier + crates + anchor
  rect(ctx, 0, 390, W, 70, '#8d5a2b');
  rect(ctx, 0, 390, W, 8, '#a4713a');
  for (let x = 30; x < W; x += 60) rect(ctx, x, 398, 6, 62, '#6d4423');
  rect(ctx, 460, 350, 34, 34, '#c08552');
  rect(ctx, 460, 350, 34, 8, '#a4713a');
  if (active.has('crate-extra')) {
    rect(ctx, 500, 358, 26, 26, '#c08552');
    rect(ctx, 500, 358, 26, 6, '#a4713a');
  }
  if (active.has('anchor')) {
    ctx.strokeStyle = '#343a40';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(180, 372, 12, 0, Math.PI, false);
    ctx.moveTo(180, 360);
    ctx.lineTo(180, 384);
    ctx.moveTo(168, 364);
    ctx.lineTo(192, 364);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- scene 4
function drawStation(ctx, W, H, rng, active) {
  rect(ctx, 0, 0, W, H, '#0b1026');
  // stars (fixed positions from rng, consumed in the same order every render)
  const stars = [];
  for (let i = 0; i < 60; i++) stars.push([rng() * W, rng() * 300, rng()]);
  for (const [x, y, b] of stars) {
    ctx.fillStyle = b > 0.7 ? '#ffe066' : '#ffffff';
    ctx.globalAlpha = 0.4 + b * 0.6;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
  if (active.has('comet')) {
    ctx.strokeStyle = '#a5d8ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 45);
    ctx.lineTo(120, 80);
    ctx.stroke();
    circle(ctx, 122, 81, 6, '#e7f5ff');
  }
  // planet
  circle(ctx, 430, 340, 62, '#e07a5f');
  ellipse(ctx, 430, 340, 40, 14, '#f4a261');
  if (active.has('planet-rings')) {
    ctx.strokeStyle = '#ffd93c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(430, 340, 92, 20, -0.25, 0, Math.PI * 2);
    ctx.stroke();
  }
  // window with Earth
  rect(ctx, 240, 55, 110, 90, '#1b2a4a');
  ctx.strokeStyle = '#6b7c93';
  ctx.lineWidth = 5;
  ctx.strokeRect(240, 55, 110, 90);
  if (active.has('earth-window')) {
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(250 + rng() * 90, 65 + rng() * 70, 2, 2);
    }
  } else {
    circle(ctx, 295, 100, 30, '#4aa3df');
    ellipse(ctx, 285, 92, 14, 8, '#57b368');
    ellipse(ctx, 305, 112, 10, 6, '#57b368');
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ellipse(ctx, 295, 100, 34, 10, 'rgba(255,255,255,0.35)');
  }
  // astronaut
  circle(ctx, 180, 180, 26, '#e9ecef');
  ctx.strokeStyle = '#adb5bd';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(180, 180, 26, 0, Math.PI * 2);
  ctx.stroke();
  circle(ctx, 180, 180, 16, active.has('visor') ? '#f4a261' : '#a5d8ff');
  rect(ctx, 160, 205, 40, 55, '#e9ecef');
  rect(ctx, 148, 210, 12, 40, '#e9ecef');
  rect(ctx, 200, 210, 12, 40, '#e9ecef');
  rect(ctx, 164, 260, 14, 30, '#e9ecef');
  rect(ctx, 182, 260, 14, 30, '#e9ecef');
  rect(ctx, 172, 218, 16, 12, '#4361ee');
  // robot
  rect(ctx, 320, 160, 44, 50, '#ced4da');
  rect(ctx, 328, 140, 28, 22, '#ced4da');
  circle(ctx, 338, 151, 3, '#222');
  circle(ctx, 348, 151, 3, '#222');
  ctx.strokeStyle = '#868e96';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(342, 140);
  ctx.lineTo(342, 122);
  ctx.stroke();
  circle(ctx, 342, 118, 5, active.has('antenna-light') ? '#e63946' : '#868e96');
  rect(ctx, 312, 170, 10, 30, '#ced4da');
  rect(ctx, 364, 170, 10, 30, '#ced4da');
  // floating wrench
  if (!active.has('wrench')) {
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(400, 210);
    ctx.lineTo(425, 235);
    ctx.stroke();
    circle(ctx, 398, 208, 7, '#adb5bd');
    circle(ctx, 398, 208, 3, '#0b1026');
  }
  // control panel
  rect(ctx, 70, 330, 200, 70, '#212529');
  rect(ctx, 80, 340, 60, 24, '#0b1026');
  ctx.fillStyle = '#51cf66';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('O2 98%', 84, 357);
  circle(ctx, 165, 352, 9, active.has('button-color') ? '#e63946' : '#51cf66');
  circle(ctx, 190, 352, 9, '#ffd93c');
  circle(ctx, 215, 352, 9, '#4361ee');
  rect(ctx, 90, 372, 140, 8, '#343a40');
  rect(ctx, 90, 372, 90, 8, '#51cf66');
  // floor
  rect(ctx, 0, 400, W, 60, '#1b2a4a');
  ctx.strokeStyle = '#2b3a5a';
  ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 400);
    ctx.lineTo(x, 460);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- scene 5
function drawForest(ctx, W, H, rng, active) {
  rect(ctx, 0, 0, W, H, '#1d4d2b');
  const rays = ctx.createLinearGradient(0, 0, 0, H);
  rays.addColorStop(0, 'rgba(255,244,180,0.25)');
  rays.addColorStop(1, 'rgba(255,244,180,0)');
  ctx.fillStyle = rays;
  ctx.fillRect(0, 0, W, H);
  // big trees
  rect(ctx, 40, 120, 26, 340, '#5a3a1a');
  circle(ctx, 53, 100, 70, '#2e7d32');
  circle(ctx, 20, 140, 40, '#388e3c');
  circle(ctx, 90, 140, 40, '#388e3c');
  rect(ctx, 480, 140, 30, 320, '#5a3a1a');
  circle(ctx, 495, 115, 64, '#2e7d32');
  // owl on a branch
  rect(ctx, 240, 130, 90, 10, '#5a3a1a');
  ellipse(ctx, 280, 105, 26, 32, '#8d6e63');
  circle(ctx, 272, 96, 7, '#fff');
  circle(ctx, 288, 96, 7, '#fff');
  if (!active.has('owl-eyes')) {
    circle(ctx, 272, 96, 3, '#222');
    circle(ctx, 288, 96, 3, '#222');
  } else {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(267, 96);
    ctx.lineTo(277, 96);
    ctx.moveTo(283, 96);
    ctx.lineTo(293, 96);
    ctx.stroke();
  }
  ctx.fillStyle = '#f4a261';
  ctx.beginPath();
  ctx.moveTo(276, 106);
  ctx.lineTo(284, 106);
  ctx.lineTo(280, 112);
  ctx.closePath();
  ctx.fill();
  // mushrooms
  ctx.fillStyle = '#f8edeb';
  ctx.fillRect(112, 350, 12, 22);
  ctx.fillStyle = active.has('mushroom-spots') ? '#4361ee' : '#e63946';
  ctx.beginPath();
  ctx.arc(118, 352, 22, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 110, 342, 3, '#fff');
  circle(ctx, 124, 338, 3, '#fff');
  ctx.fillStyle = '#f8edeb';
  ctx.fillRect(150, 360, 9, 16);
  ctx.fillStyle = '#f4a261';
  ctx.beginPath();
  ctx.arc(154, 361, 14, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  // stream
  ctx.fillStyle = '#4aa3df';
  ctx.beginPath();
  ctx.moveTo(300, 460);
  ctx.quadraticCurveTo(330, 380, 300, 330);
  ctx.quadraticCurveTo(380, 360, 420, 330);
  ctx.quadraticCurveTo(440, 400, 420, 460);
  ctx.closePath();
  ctx.fill();
  if (active.has('fish')) {
    ellipse(ctx, 365, 400, 14, 7, '#f4a261');
    ctx.beginPath();
    ctx.moveTo(378, 400);
    ctx.lineTo(388, 394);
    ctx.lineTo(388, 406);
    ctx.closePath();
    ctx.fill();
  }
  // fireflies
  const flies = [[420, 180], [200, 160], [350, 120], [460, 240], [150, 220]];
  for (const [x, y] of flies) {
    circle(ctx, x, y, 8, 'rgba(255,224,102,0.35)');
    circle(ctx, x, y, 3, '#ffe066');
  }
  if (active.has('firefly-extra')) {
    circle(ctx, 320, 200, 8, 'rgba(255,224,102,0.35)');
    circle(ctx, 320, 200, 3, '#ffe066');
  }
  // tree hollow glow
  if (active.has('hollow-glow')) {
    ellipse(ctx, 495, 300, 14, 22, '#ffe066');
    ellipse(ctx, 495, 300, 8, 14, '#fff3b0');
  } else {
    ellipse(ctx, 495, 300, 14, 22, '#2b1a0a');
  }
  // butterfly
  if (!active.has('butterfly')) {
    ctx.fillStyle = '#f15bb5';
    ellipse(ctx, 84, 176, 8, 12, '#f15bb5');
    ellipse(ctx, 98, 176, 8, 12, '#f15bb5');
    ctx.strokeStyle = '#2b2113';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(91, 168);
    ctx.lineTo(91, 186);
    ctx.stroke();
  }
  // flowers on the forest floor
  flower(ctx, 200, 400, active.has('flower-color') ? '#ffd93c' : '#f15bb5', '#fff');
  flower(ctx, 250, 425, '#ffffff', '#ffd93c');
  flower(ctx, 90, 420, '#f15bb5', '#fff');
  flower(ctx, 520, 430, '#ffffff', '#ffd93c');
  // ground
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 430, W, 30);
}

// ---------------------------------------------------------------- scene 6
function drawCafe(ctx, W, H, rng, active) {
  rect(ctx, 0, 0, W, H, '#f6e3c5');
  rect(ctx, 0, 0, W, 300, '#fbeed3');
  rect(ctx, 0, 300, W, 160, '#d9a066');
  // window
  rect(ctx, 55, 50, 120, 150, '#a8d8ea');
  ctx.strokeStyle = '#8d5a2b';
  ctx.lineWidth = 4;
  ctx.strokeRect(55, 50, 120, 150);
  ctx.beginPath();
  ctx.moveTo(115, 50);
  ctx.lineTo(115, 200);
  ctx.moveTo(55, 125);
  ctx.lineTo(175, 125);
  ctx.stroke();
  circle(ctx, 155, 75, 14, '#ffd93c');
  cloud(ctx, 70, 80, 0.6);
  if (active.has('window-cat')) {
    ellipse(ctx, 90, 185, 18, 10, '#343a40');
    circle(ctx, 102, 176, 8, '#343a40');
    ctx.beginPath();
    ctx.moveTo(97, 169);
    ctx.lineTo(99, 161);
    ctx.lineTo(102, 169);
    ctx.closePath();
    ctx.fill();
  }
  // poster
  rect(ctx, 440, 60, 80, 100, '#fff');
  ctx.strokeStyle = '#8d5a2b';
  ctx.lineWidth = 3;
  ctx.strokeRect(440, 60, 80, 100);
  if (active.has('poster-cat')) {
    circle(ctx, 480, 110, 20, '#f4a261');
    ctx.beginPath();
    ctx.moveTo(464, 96);
    ctx.lineTo(468, 82);
    ctx.lineTo(474, 95);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(486, 95);
    ctx.lineTo(492, 82);
    ctx.lineTo(496, 96);
    ctx.closePath();
    ctx.fill();
  } else {
    circle(ctx, 480, 110, 20, '#e9c46a');
    ellipse(ctx, 462, 112, 8, 5, '#e9c46a');
    ellipse(ctx, 498, 112, 8, 5, '#e9c46a');
  }
  ctx.fillStyle = '#2b2113';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('CAT CAFÉ', 452, 148);
  // shelf with a cat
  rect(ctx, 200, 110, 180, 10, '#8d5a2b');
  rect(ctx, 215, 75, 20, 35, '#2a9d8f');
  rect(ctx, 245, 80, 20, 30, '#e76f51');
  if (!active.has('shelf-cat')) {
    ellipse(ctx, 330, 98, 26, 13, '#6c757d');
    circle(ctx, 352, 88, 11, '#6c757d');
    ctx.beginPath();
    ctx.moveTo(345, 80);
    ctx.lineTo(348, 70);
    ctx.lineTo(352, 80);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(355, 80);
    ctx.lineTo(359, 71);
    ctx.lineTo(362, 81);
    ctx.closePath();
    ctx.fill();
  }
  // counter with cakes + cups
  rect(ctx, 180, 300, 240, 18, '#a4713a');
  rect(ctx, 195, 318, 12, 80, '#7a4a21');
  rect(ctx, 393, 318, 12, 80, '#7a4a21');
  // cake stand
  rect(ctx, 280, 292, 70, 8, '#ced4da');
  rect(ctx, 312, 280, 6, 14, '#ced4da');
  rect(ctx, 290, 268, 50, 14, '#f15bb5');
  rect(ctx, 290, 262, 50, 8, '#fff');
  if (!active.has('cake-slice')) {
    ctx.fillStyle = '#f15bb5';
    ctx.beginPath();
    ctx.moveTo(348, 268);
    ctx.lineTo(368, 262);
    ctx.lineTo(368, 276);
    ctx.closePath();
    ctx.fill();
  }
  // cups
  ctx.fillStyle = '#4361ee';
  ctx.fillRect(200, 278, 22, 22);
  ctx.fillStyle = '#e63946';
  ctx.fillRect(240, 278, 22, 22);
  if (!active.has('steam')) {
    ctx.strokeStyle = 'rgba(120,120,120,0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(248, 274);
    ctx.quadraticCurveTo(244, 262, 250, 252);
    ctx.moveTo(210, 274);
    ctx.quadraticCurveTo(214, 262, 208, 252);
    ctx.stroke();
  }
  // sleeping cat on the counter
  ellipse(ctx, 380, 292, 24, 10, '#f4a261');
  circle(ctx, 400, 286, 9, '#f4a261');
  // plant
  ctx.fillStyle = active.has('pot-color') ? '#4361ee' : '#e76f51';
  ctx.beginPath();
  ctx.moveTo(490, 350);
  ctx.lineTo(520, 350);
  ctx.lineTo(515, 380);
  ctx.lineTo(495, 380);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(505, 350);
  ctx.lineTo(505, 315);
  ctx.moveTo(505, 335);
  ctx.quadraticCurveTo(490, 325, 488, 312);
  ctx.moveTo(505, 335);
  ctx.quadraticCurveTo(520, 325, 522, 312);
  ctx.stroke();
  // cushion on the floor
  ctx.fillStyle = active.has('cushion') ? '#2a9d8f' : '#e63946';
  ctx.fillRect(210, 390, 60, 22, active.has('cushion') ? '#2a9d8f' : '#e63946');
  if (!active.has('cushion')) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(225, 390, 6, 22);
    ctx.fillRect(245, 390, 6, 22);
  }
  // rug + paw prints
  ellipse(ctx, 280, 440, 170, 16, '#e63946');
  ellipse(ctx, 280, 440, 130, 10, '#fbeed3');
  ctx.fillStyle = '#8d6e63';
  circle(ctx, 120, 430, 4, '#8d6e63');
  circle(ctx, 140, 425, 4, '#8d6e63');
  circle(ctx, 160, 430, 4, '#8d6e63');
}

// ------------------------------------------------------------------ scenes
export const SCENES = [
  {
    name: 'Sunny Park', subtitle: 'A bright morning in the park',
    timeLimit: 150, hints: 3, seed: 11, draw: drawPark,
    diffs: [
      { id: 'sun-glasses', x: 70, y: 70, r: 30, label: 'The sun wears sunglasses' },
      { id: 'cloud-gone', x: 380, y: 50, r: 36, label: 'A cloud vanished' },
      { id: 'tulip-purple', x: 150, y: 400, r: 18, label: 'A tulip changed colour' },
      { id: 'bird-extra', x: 330, y: 100, r: 20, label: 'An extra bird' },
      { id: 'bench-slat', x: 230, y: 332, r: 26, label: 'A bench slat is missing' },
      { id: 'apples', x: 470, y: 215, r: 28, label: 'Apples appeared on the tree' },
      { id: 'duck-gone', x: 100, y: 400, r: 24, label: 'The duck left the pond' },
    ],
  },
  {
    name: 'Cozy Kitchen', subtitle: 'Breakfast is almost ready',
    timeLimit: 140, hints: 3, seed: 22, draw: drawKitchen,
    diffs: [
      { id: 'curtain-color', x: 58, y: 115, r: 26, label: 'A curtain changed colour' },
      { id: 'clock-time', x: 280, y: 70, r: 26, label: 'The clock shows a different time' },
      { id: 'apple-gone', x: 272, y: 284, r: 18, label: 'An apple is missing from the bowl' },
      { id: 'cat-tail', x: 408, y: 318, r: 24, label: 'The cat’s tail points the other way' },
      { id: 'steam', x: 462, y: 186, r: 24, label: 'The kettle stopped steaming' },
      { id: 'mug-color', x: 197, y: 290, r: 16, label: 'A mug changed colour' },
      { id: 'frame-tilt', x: 490, y: 80, r: 24, label: 'The picture frame is tilted' },
    ],
  },
  {
    name: 'Harbour at Dusk', subtitle: 'The boats come home at sunset',
    timeLimit: 130, hints: 3, seed: 33, draw: drawHarbour,
    diffs: [
      { id: 'lighthouse-beam', x: 100, y: 120, r: 30, label: 'The lighthouse beam is on' },
      { id: 'sail-color', x: 355, y: 260, r: 28, label: 'A sail changed colour' },
      { id: 'gull-extra', x: 300, y: 80, r: 20, label: 'An extra gull' },
      { id: 'crate-extra', x: 512, y: 370, r: 24, label: 'An extra crate on the pier' },
      { id: 'moon-phase', x: 500, y: 60, r: 26, label: 'The moon changed phase' },
      { id: 'anchor', x: 180, y: 372, r: 22, label: 'An anchor appeared on the dock' },
      { id: 'window-light', x: 426, y: 236, r: 20, label: 'A house window lit up' },
    ],
  },
  {
    name: 'Space Station', subtitle: 'Orbiting high above Earth',
    timeLimit: 120, hints: 2, seed: 44, draw: drawStation,
    diffs: [
      { id: 'planet-rings', x: 430, y: 340, r: 32, label: 'The planet grew rings' },
      { id: 'visor', x: 180, y: 180, r: 26, label: 'The visor turned gold' },
      { id: 'antenna-light', x: 342, y: 118, r: 14, label: 'The robot’s antenna lights up' },
      { id: 'button-color', x: 165, y: 352, r: 14, label: 'A panel button turned red' },
      { id: 'earth-window', x: 295, y: 100, r: 32, label: 'Earth vanished from the window' },
      { id: 'wrench', x: 410, y: 222, r: 20, label: 'The floating wrench is gone' },
      { id: 'comet', x: 95, y: 65, r: 22, label: 'A comet streaks past' },
    ],
  },
  {
    name: 'Enchanted Forest', subtitle: 'Fireflies and old magic',
    timeLimit: 110, hints: 2, seed: 55, draw: drawForest,
    diffs: [
      { id: 'owl-eyes', x: 280, y: 96, r: 24, label: 'The owl closed its eyes' },
      { id: 'mushroom-spots', x: 118, y: 345, r: 22, label: 'A mushroom changed colour' },
      { id: 'firefly-extra', x: 320, y: 200, r: 18, label: 'An extra firefly' },
      { id: 'flower-color', x: 200, y: 400, r: 18, label: 'A forest flower changed colour' },
      { id: 'fish', x: 368, y: 400, r: 20, label: 'A fish appeared in the stream' },
      { id: 'hollow-glow', x: 495, y: 300, r: 24, label: 'The tree hollow glows' },
      { id: 'butterfly', x: 91, y: 176, r: 20, label: 'The butterfly flew away' },
    ],
  },
  {
    name: 'Cat Café', subtitle: 'Coffee, cake and nine lives',
    timeLimit: 100, hints: 1, seed: 66, draw: drawCafe,
    diffs: [
      { id: 'shelf-cat', x: 330, y: 95, r: 26, label: 'The cat left the shelf' },
      { id: 'cake-slice', x: 360, y: 268, r: 20, label: 'A cake slice is missing' },
      { id: 'steam', x: 245, y: 262, r: 18, label: 'A cup stopped steaming' },
      { id: 'pot-color', x: 505, y: 362, r: 20, label: 'A plant pot changed colour' },
      { id: 'poster-cat', x: 480, y: 108, r: 24, label: 'The poster animal changed' },
      { id: 'window-cat', x: 95, y: 180, r: 24, label: 'A cat appeared in the window' },
      { id: 'cushion', x: 240, y: 400, r: 22, label: 'The cushion lost its stripes' },
    ],
  },
];
