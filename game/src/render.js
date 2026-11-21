// Render: menggambar dua panel berdampingan, marker perbedaan yang ketemu,
// denyut hint, dan teks mengambang. HUD atas (judul, counter, timer, skor) ada di DOM.
import { BACKGROUNDS } from './scenes.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 640;
export const PANEL_W = 600;
export const PANEL_H = 540;
export const PANEL_Y = 16;

export function computeLayout() {
  return {
    left: { x: 20, y: PANEL_Y, w: PANEL_W, h: PANEL_H },
    right: { x: 660, y: PANEL_Y, w: PANEL_W, h: PANEL_H },
  };
}

function drawPanelFrame(ctx, panel, label) {
  ctx.strokeStyle = '#5A3A1A';
  ctx.lineWidth = 4;
  ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
  ctx.fillStyle = 'rgba(90, 58, 26, 0.85)';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(label, panel.x + 10, panel.y + 8);
}

function drawFoundRing(ctx, panel, diff, progress) {
  const cx = panel.x + diff.x * panel.w;
  const cy = panel.y + diff.y * panel.h;
  const r = diff.r * panel.w * (0.7 + 0.3 * progress);
  ctx.strokeStyle = '#2E9E4F';
  ctx.lineWidth = 5;
  ctx.globalAlpha = progress;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#2E9E4F';
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.55, cy - r * 0.75);
  ctx.lineTo(cx + r * 0.95, cy - r * 0.75);
  ctx.lineTo(cx + r * 0.95, cy - r * 0.35);
  ctx.closePath();
  ctx.fill();
}

function drawHintPulse(ctx, panel, diff, time) {
  const cx = panel.x + diff.x * panel.w;
  const cy = panel.y + diff.y * panel.h;
  const pulse = 0.5 + 0.5 * Math.sin(time * 6);
  const r = diff.r * panel.w * (1.1 + 0.25 * pulse);
  ctx.strokeStyle = `rgba(255, 180, 0, ${0.55 + 0.45 * pulse})`;
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawWrongMark(ctx, x, y, age) {
  const alpha = Math.max(0, 1 - age / 0.7);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#E4572E';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const s = 14;
  ctx.beginPath();
  ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawFloaters(ctx, floaters, now) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const f of floaters) {
    const age = (now - f.born) / 1000;
    if (age > 1.1) continue;
    ctx.globalAlpha = Math.max(0, 1 - age / 1.1);
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y - age * 34);
  }
  ctx.globalAlpha = 1;
}

export function renderGame(ctx, state, now) {
  const { scene, layout, foundIds, hintDiff, hintUntil, wrongMarks, floaters } = state;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#F7EFD8';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (const side of ['left', 'right']) {
    const panel = layout[side];
    BACKGROUNDS[scene.id](ctx, panel);
    for (const diff of scene.diffs) {
      if (side === 'left') diff.base(ctx, panel);
      else {
        diff.base(ctx, panel);
        diff.altered(ctx, panel);
      }
    }
    for (const id of foundIds) {
      const diff = scene.diffs.find((d) => d.id === id);
      if (diff) drawFoundRing(ctx, panel, diff, 1);
    }
    if (hintDiff && now < hintUntil) {
      const diff = scene.diffs.find((d) => d.id === hintDiff);
      if (diff) drawHintPulse(ctx, panel, diff, now / 1000);
    }
    drawPanelFrame(ctx, panel, side === 'left' ? 'A' : 'B');
  }

  for (const mark of wrongMarks) drawWrongMark(ctx, mark.x, mark.y, (now - mark.born) / 1000);
  drawFloaters(ctx, floaters, now);

  // Pita pesan bawah
  ctx.fillStyle = 'rgba(90, 58, 26, 0.92)';
  ctx.fillRect(0, CANVAS_H - 56, CANVAS_W, 56);
  ctx.fillStyle = '#FFF6E8';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.message, CANVAS_W / 2, CANVAS_H - 28);
}
