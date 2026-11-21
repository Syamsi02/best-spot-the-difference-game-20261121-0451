// Input: klik mouse/sentuh pada panel dan tombol keyboard.
// Mengubah klik kanvas menjadi koordinat ternormalisasi panel + id perbedaan yang kena.
import { findDiffAt } from './differences.js';

export function panelAtPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  return { x, y };
}

export function whichPanel(layout, x, y) {
  for (const side of ['left', 'right']) {
    const p = layout[side];
    if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) return side;
  }
  return null;
}

export function toPanelCoords(panel, x, y) {
  return { nx: (x - panel.x) / panel.w, ny: (y - panel.y) / panel.h };
}

export function hitTest(scene, foundIds, panel, x, y) {
  const { nx, ny } = toPanelCoords(panel, x, y);
  const diff = findDiffAt(scene, nx, ny);
  if (!diff) return null;
  if (foundIds.has(diff.id)) return { already: true, diff };
  return { already: false, diff };
}

export function bindKeyboard(onKey) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    onKey(event.key.toLowerCase());
  });
}
