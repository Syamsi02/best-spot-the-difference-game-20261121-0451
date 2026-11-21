// Latar statis tiap adegan: langit, tanah, dan bangunan yang tidak pernah berubah.
// Elemen yang punya varian digambar oleh differences.js (base/altered), bukan di sini.
const px = (p, nx) => p.x + nx * p.w;
const py = (p, ny) => p.y + ny * p.h;
const pr = (p, r) => r * p.w;

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function cloud(ctx, p, cx, cy, s, color) {
  circle(ctx, px(p, cx), py(p, cy), pr(p, 0.03 * s), color);
  circle(ctx, px(p, cx + 0.03 * s), py(p, cy + 0.005), pr(p, 0.024 * s), color);
  circle(ctx, px(p, cx - 0.03 * s), py(p, cy + 0.008), pr(p, 0.022 * s), color);
}

export function drawMarketBackground(ctx, p) {
  const sky = ctx.createLinearGradient(0, p.y, 0, p.y + p.h * 0.55);
  sky.addColorStop(0, '#FFE9A8');
  sky.addColorStop(1, '#FFF7D6');
  rect(ctx, p.x, p.y, p.w, p.h * 0.55, '#FFF7D6');
  ctx.fillStyle = sky;
  ctx.fillRect(p.x, p.y, p.w, p.h * 0.55);
  cloud(ctx, p, 0.35, 0.08, 1.1, '#FFFFFF');
  cloud(ctx, p, 0.78, 0.06, 0.9, '#FFFFFF');
  // Rumah jauh di kejauhan
  rect(ctx, px(p, 0.02), py(p, 0.44), pr(p, 0.12), pr(p, 0.11), '#B7D9A8');
  ctx.fillStyle = '#E4572E';
  ctx.beginPath();
  ctx.moveTo(px(p, 0.01), py(p, 0.44)); ctx.lineTo(px(p, 0.08), py(p, 0.38)); ctx.lineTo(px(p, 0.15), py(p, 0.44));
  ctx.closePath(); ctx.fill();
  rect(ctx, px(p, 0.90), py(p, 0.46), pr(p, 0.09), pr(p, 0.09), '#A8C8E8');
  ctx.fillStyle = '#2E86E4';
  ctx.beginPath();
  ctx.moveTo(px(p, 0.895), py(p, 0.46)); ctx.lineTo(px(p, 0.945), py(p, 0.41)); ctx.lineTo(px(p, 0.995), py(p, 0.46));
  ctx.closePath(); ctx.fill();
  // Tanah pasar
  rect(ctx, p.x, py(p, 0.55), p.w, p.h * 0.45, '#E8C89A');
  rect(ctx, p.x, py(p, 0.55), p.w, pr(p, 0.008), '#D8B078');
  // Tali bendera (benderanya digambar differences.js)
  line(ctx, px(p, 0.06), py(p, 0.315), px(p, 0.94), py(p, 0.315), '#8A6A3A', 2);
  // Meja lapak
  rect(ctx, px(p, 0.15), py(p, 0.62), pr(p, 0.70), pr(p, 0.18), '#A8763E');
  rect(ctx, px(p, 0.15), py(p, 0.62), pr(p, 0.70), pr(p, 0.02), '#C89B5A');
  line(ctx, px(p, 0.15), py(p, 0.70), px(p, 0.85), py(p, 0.70), '#8B5A2B', 2);
  // Tiang tenda
  line(ctx, px(p, 0.18), py(p, 0.30), px(p, 0.18), py(p, 0.62), '#6B4A2A', 5);
  line(ctx, px(p, 0.82), py(p, 0.30), px(p, 0.82), py(p, 0.62), '#6B4A2A', 5);
  // Keranjang apel dan pisang (statis)
  rect(ctx, px(p, 0.42), py(p, 0.70), pr(p, 0.12), pr(p, 0.07), '#8B5A2B');
  circle(ctx, px(p, 0.45), py(p, 0.68), pr(p, 0.024), '#D32F2F');
  circle(ctx, px(p, 0.48), py(p, 0.665), pr(p, 0.024), '#D32F2F');
  circle(ctx, px(p, 0.51), py(p, 0.68), pr(p, 0.024), '#D32F2F');
  circle(ctx, px(p, 0.465), py(p, 0.645), pr(p, 0.024), '#D32F2F');
  ellipse(ctx, px(p, 0.66), py(p, 0.68), pr(p, 0.028), pr(p, 0.012), '#FFE135');
  ellipse(ctx, px(p, 0.70), py(p, 0.665), pr(p, 0.028), pr(p, 0.012), '#FFE135');
  ellipse(ctx, px(p, 0.68), py(p, 0.645), pr(p, 0.028), pr(p, 0.012), '#FFE135');
  // Karung beras
  ellipse(ctx, px(p, 0.10), py(p, 0.86), pr(p, 0.05), pr(p, 0.045), '#E8DCC0');
  ellipse(ctx, px(p, 0.17), py(p, 0.87), pr(p, 0.045), pr(p, 0.04), '#D8C8A8');
  line(ctx, px(p, 0.08), py(p, 0.83), px(p, 0.12), py(p, 0.83), '#B8A078', 3);
  // Penjual dengan topi
  circle(ctx, px(p, 0.56), py(p, 0.47), pr(p, 0.028), '#F2C89B');
  ellipse(ctx, px(p, 0.56), py(p, 0.435), pr(p, 0.045), pr(p, 0.012), '#E4572E');
  rect(ctx, px(p, 0.53), py(p, 0.50), pr(p, 0.06), pr(p, 0.10), '#43AA5B');
  circle(ctx, px(p, 0.55), py(p, 0.465), pr(p, 0.004), '#333333');
  circle(ctx, px(p, 0.57), py(p, 0.465), pr(p, 0.004), '#333333');
  // Peti tempat kucing duduk
  rect(ctx, px(p, 0.68), py(p, 0.84), pr(p, 0.12), pr(p, 0.08), '#C89B5A');
  line(ctx, px(p, 0.68), py(p, 0.88), px(p, 0.80), py(p, 0.88), '#8B5A2B', 2);
}

export function drawGardenBackground(ctx, p) {
  const sky = ctx.createLinearGradient(0, p.y, 0, p.y + p.h * 0.5);
  sky.addColorStop(0, '#BFE8FF');
  sky.addColorStop(1, '#E8F7FF');
  ctx.fillStyle = sky;
  ctx.fillRect(p.x, p.y, p.w, p.h * 0.5);
  cloud(ctx, p, 0.30, 0.07, 1.0, '#FFFFFF');
  cloud(ctx, p, 0.70, 0.10, 0.8, '#FFFFFF');
  circle(ctx, px(p, 0.88), py(p, 0.10), pr(p, 0.04), '#FFD93B');
  // Pohon besar kiri
  rect(ctx, px(p, 0.10), py(p, 0.35), pr(p, 0.035), pr(p, 0.25), '#6B4A2A');
  circle(ctx, px(p, 0.08), py(p, 0.30), pr(p, 0.09), '#43AA5B');
  circle(ctx, px(p, 0.16), py(p, 0.26), pr(p, 0.08), '#3A9A4B');
  circle(ctx, px(p, 0.12), py(p, 0.20), pr(p, 0.075), '#55BB6B');
  // Rumput
  rect(ctx, p.x, py(p, 0.50), p.w, p.h * 0.50, '#8FD07A');
  rect(ctx, p.x, py(p, 0.50), p.w, pr(p, 0.008), '#6FB85A');
  // Jalan setapak
  ctx.fillStyle = '#E8DCC0';
  ctx.beginPath();
  ctx.moveTo(px(p, 0.44), py(p, 0.50));
  ctx.lineTo(px(p, 0.56), py(p, 0.50));
  ctx.lineTo(px(p, 0.62), py(p, 1.0));
  ctx.lineTo(px(p, 0.38), py(p, 1.0));
  ctx.closePath(); ctx.fill();
  // Kolam
  ellipse(ctx, px(p, 0.55), py(p, 0.72), pr(p, 0.30), pr(p, 0.20), '#7FC8E8');
  ellipse(ctx, px(p, 0.55), py(p, 0.72), pr(p, 0.26), pr(p, 0.165), '#9AD8F0');
  // Air mancur: badan
  rect(ctx, px(p, 0.525), py(p, 0.42), pr(p, 0.05), pr(p, 0.10), '#C8C8C8');
  ellipse(ctx, px(p, 0.55), py(p, 0.42), pr(p, 0.04), pr(p, 0.015), '#E8E8E8');
  ellipse(ctx, px(p, 0.55), py(p, 0.53), pr(p, 0.10), pr(p, 0.02), '#D8D8D8');
  // Semak bunga bawah
  for (let i = 0; i < 6; i++) {
    const fx = 0.06 + i * 0.16;
    circle(ctx, px(p, fx), py(p, 0.92), pr(p, 0.028), i % 2 === 0 ? '#F48FB1' : '#CE93D8');
    circle(ctx, px(p, fx + 0.05), py(p, 0.95), pr(p, 0.024), i % 2 === 0 ? '#CE93D8' : '#F48FB1');
  }
  // Daun teratai statis (selain yang berbunga)
  ellipse(ctx, px(p, 0.40), py(p, 0.78), pr(p, 0.04), pr(p, 0.015), '#2E7D32');
  ellipse(ctx, px(p, 0.72), py(p, 0.80), pr(p, 0.045), pr(p, 0.016), '#2E7D32');
  ellipse(ctx, px(p, 0.48), py(p, 0.85), pr(p, 0.035), pr(p, 0.014), '#2E7D32');
}

export function drawHarborBackground(ctx, p) {
  const sky = ctx.createLinearGradient(0, p.y, 0, p.y + p.h * 0.55);
  sky.addColorStop(0, '#2E2A5A');
  sky.addColorStop(0.55, '#E8703A');
  sky.addColorStop(1, '#FFB35C');
  ctx.fillStyle = sky;
  ctx.fillRect(p.x, p.y, p.w, p.h * 0.55);
  // Matahari terbenam
  circle(ctx, px(p, 0.55), py(p, 0.48), pr(p, 0.055), '#FF8C42');
  ctx.fillStyle = 'rgba(255, 140, 66, 0.35)';
  circle(ctx, px(p, 0.55), py(p, 0.48), pr(p, 0.075), 'rgba(255, 140, 66, 0.35)');
  // Laut
  const sea = ctx.createLinearGradient(0, py(p, 0.55), 0, p.y + p.h * 0.75);
  sea.addColorStop(0, '#E8703A');
  sea.addColorStop(1, '#2A4A6B');
  ctx.fillStyle = sea;
  ctx.fillRect(p.x, py(p, 0.55), p.w, p.h * 0.20);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const wy = 0.58 + i * 0.035;
    ctx.beginPath();
    ctx.moveTo(px(p, 0.05 + (i % 2) * 0.1), py(p, wy));
    ctx.quadraticCurveTo(px(p, 0.30), py(p, wy - 0.012), px(p, 0.55), py(p, wy));
    ctx.quadraticCurveTo(px(p, 0.75), py(p, wy + 0.012), px(p, 0.95), py(p, wy));
    ctx.stroke();
  }
  // Mercusuar: menara
  rect(ctx, px(p, 0.125), py(p, 0.22), pr(p, 0.05), pr(p, 0.33), '#F5F0DC');
  rect(ctx, px(p, 0.125), py(p, 0.30), pr(p, 0.05), pr(p, 0.05), '#E4572E');
  rect(ctx, px(p, 0.125), py(p, 0.40), pr(p, 0.05), pr(p, 0.05), '#E4572E');
  rect(ctx, px(p, 0.115), py(p, 0.18), pr(p, 0.07), pr(p, 0.04), '#333333');
  // Dermaga
  rect(ctx, p.x, py(p, 0.75), p.w, p.h * 0.25, '#6B4A2A');
  rect(ctx, p.x, py(p, 0.75), p.w, pr(p, 0.012), '#8B5A2B');
  for (let i = 0; i < 8; i++) line(ctx, px(p, 0.06 + i * 0.13), py(p, 0.76), px(p, 0.06 + i * 0.13), py(p, 1.0), '#5A3A1A', 2);
  // Perahu: lambung
  ctx.fillStyle = '#8B5A2B';
  ctx.beginPath();
  ctx.moveTo(px(p, 0.46), py(p, 0.50));
  ctx.lineTo(px(p, 0.70), py(p, 0.50));
  ctx.lineTo(px(p, 0.65), py(p, 0.57));
  ctx.lineTo(px(p, 0.50), py(p, 0.57));
  ctx.closePath(); ctx.fill();
  // Tiang sudah digambar di differences (sail)
}

export const BACKGROUNDS = {
  market: drawMarketBackground,
  garden: drawGardenBackground,
  harbor: drawHarborBackground,
};
