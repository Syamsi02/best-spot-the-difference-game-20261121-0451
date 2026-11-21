// Perbedaan tiap ronde: posisi, radius, dan dua versi gambarnya.
// Setiap perbedaan punya base() (gambar kiri = asli) dan altered() (gambar kanan = berubah).
// Panel p = {x, y, w, h} dalam piksel kanvas; x/y/r ternormalisasi 0..1 di dalam panel.
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

// --- Ronde 1: Pasar Pagi ---
const marketDiffs = [
  {
    id: 'sun', x: 0.12, y: 0.13, r: 0.055, name: 'Kacamata matahari',
    base(ctx, p) {
      circle(ctx, px(p, 0.12), py(p, 0.13), pr(p, 0.05), '#FFD93B');
      ctx.strokeStyle = '#E8A800'; ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        line(ctx, px(p, 0.12) + Math.cos(a) * pr(p, 0.058), py(p, 0.13) + Math.sin(a) * pr(p, 0.058),
          px(p, 0.12) + Math.cos(a) * pr(p, 0.075), py(p, 0.13) + Math.sin(a) * pr(p, 0.075), '#E8A800', 3);
      }
      ctx.fillStyle = '#7A4A00';
      circle(ctx, px(p, 0.105), py(p, 0.125), pr(p, 0.006), '#7A4A00');
      circle(ctx, px(p, 0.135), py(p, 0.125), pr(p, 0.006), '#7A4A00');
      ctx.strokeStyle = '#7A4A00'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px(p, 0.12), py(p, 0.135), pr(p, 0.02), 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    },
    altered(ctx, p) {
      this.base(ctx, p);
      ellipse(ctx, px(p, 0.102), py(p, 0.122), pr(p, 0.016), pr(p, 0.012), '#222222');
      ellipse(ctx, px(p, 0.138), py(p, 0.122), pr(p, 0.016), pr(p, 0.012), '#222222');
      line(ctx, px(p, 0.118), py(p, 0.122), px(p, 0.122), py(p, 0.122), '#222222', 2);
    },
  },
  {
    id: 'awning', x: 0.40, y: 0.23, r: 0.05, name: 'Warna garis tenda',
    base(ctx, p) {
      for (let i = 0; i < 8; i++) {
        rect(ctx, px(p, 0.18 + i * 0.08), py(p, 0.16), pr(p, 0.08), pr(p, 0.14), i % 2 === 0 ? '#E4572E' : '#FFF6E8');
      }
      ctx.strokeStyle = '#8A2F14'; ctx.lineWidth = 2;
      ctx.strokeRect(px(p, 0.18), py(p, 0.16), pr(p, 0.64), pr(p, 0.14));
    },
    altered(ctx, p) {
      for (let i = 0; i < 8; i++) {
        const fill = i === 2 ? '#2E86E4' : (i % 2 === 0 ? '#E4572E' : '#FFF6E8');
        rect(ctx, px(p, 0.18 + i * 0.08), py(p, 0.16), pr(p, 0.08), pr(p, 0.14), fill);
      }
      ctx.strokeStyle = '#8A2F14'; ctx.lineWidth = 2;
      ctx.strokeRect(px(p, 0.18), py(p, 0.16), pr(p, 0.64), pr(p, 0.14));
    },
  },
  {
    id: 'bunting', x: 0.55, y: 0.335, r: 0.04, name: 'Bendera hilang satu',
    base(ctx, p) {
      const colors = ['#E4572E', '#FFD93B', '#2E86E4', '#43AA5B', '#E4572E', '#FFD93B', '#2E86E4', '#43AA5B', '#E4572E'];
      for (let i = 0; i < 9; i++) {
        const cx = px(p, 0.08 + i * 0.105);
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(cx - pr(p, 0.03), py(p, 0.315));
        ctx.lineTo(cx + pr(p, 0.03), py(p, 0.315));
        ctx.lineTo(cx, py(p, 0.375));
        ctx.closePath(); ctx.fill();
      }
    },
    altered(ctx, p) {
      const colors = ['#E4572E', '#FFD93B', '#2E86E4', '#43AA5B', '#E4572E', '#FFD93B', '#2E86E4', '#43AA5B', '#E4572E'];
      for (let i = 0; i < 9; i++) {
        if (i === 4) continue;
        const cx = px(p, 0.08 + i * 0.105);
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(cx - pr(p, 0.03), py(p, 0.315));
        ctx.lineTo(cx + pr(p, 0.03), py(p, 0.315));
        ctx.lineTo(cx, py(p, 0.375));
        ctx.closePath(); ctx.fill();
      }
    },
  },
  {
    id: 'orange', x: 0.30, y: 0.70, r: 0.055, name: 'Jeruk berkurang satu',
    base(ctx, p) {
      rect(ctx, px(p, 0.22), py(p, 0.70), pr(p, 0.16), pr(p, 0.07), '#8B5A2B');
      const offs = [[0.24, 0.68], [0.29, 0.665], [0.34, 0.68], [0.265, 0.635], [0.315, 0.63], [0.35, 0.65]];
      for (const [ox, oy] of offs) circle(ctx, px(p, ox), py(p, oy), pr(p, 0.028), '#F28C28');
      ctx.fillStyle = '#2E7D32';
      ellipse(ctx, px(p, 0.315), py(p, 0.615), pr(p, 0.012), pr(p, 0.006), '#2E7D32');
    },
    altered(ctx, p) {
      rect(ctx, px(p, 0.22), py(p, 0.70), pr(p, 0.16), pr(p, 0.07), '#8B5A2B');
      const offs = [[0.24, 0.68], [0.29, 0.665], [0.34, 0.68], [0.265, 0.635], [0.315, 0.63]];
      for (const [ox, oy] of offs) circle(ctx, px(p, ox), py(p, oy), pr(p, 0.028), '#F28C28');
      ctx.fillStyle = '#2E7D32';
      ellipse(ctx, px(p, 0.315), py(p, 0.615), pr(p, 0.012), pr(p, 0.006), '#2E7D32');
    },
  },
  {
    id: 'price', x: 0.52, y: 0.545, r: 0.045, name: 'Harga jeruk berubah',
    base(ctx, p) {
      rect(ctx, px(p, 0.44), py(p, 0.50), pr(p, 0.16), pr(p, 0.09), '#FFF3D6');
      ctx.strokeStyle = '#8B5A2B'; ctx.lineWidth = 3;
      ctx.strokeRect(px(p, 0.44), py(p, 0.50), pr(p, 0.16), pr(p, 0.09));
      ctx.fillStyle = '#5A2D00';
      ctx.font = `bold ${Math.round(pr(p, 0.038))}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('JERUK 10K', px(p, 0.52), py(p, 0.545));
    },
    altered(ctx, p) {
      rect(ctx, px(p, 0.44), py(p, 0.50), pr(p, 0.16), pr(p, 0.09), '#FFF3D6');
      ctx.strokeStyle = '#8B5A2B'; ctx.lineWidth = 3;
      ctx.strokeRect(px(p, 0.44), py(p, 0.50), pr(p, 0.16), pr(p, 0.09));
      ctx.fillStyle = '#5A2D00';
      ctx.font = `bold ${Math.round(pr(p, 0.038))}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('JERUK 15K', px(p, 0.52), py(p, 0.545));
    },
  },
  {
    id: 'cat', x: 0.74, y: 0.82, r: 0.05, name: 'Ekor kucing naik',
    base(ctx, p) {
      ellipse(ctx, px(p, 0.74), py(p, 0.84), pr(p, 0.035), pr(p, 0.045), '#F5A623');
      circle(ctx, px(p, 0.74), py(p, 0.775), pr(p, 0.028), '#F5A623');
      ctx.fillStyle = '#F5A623';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.722), py(p, 0.755)); ctx.lineTo(px(p, 0.73), py(p, 0.735)); ctx.lineTo(px(p, 0.738), py(p, 0.755));
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px(p, 0.742), py(p, 0.755)); ctx.lineTo(px(p, 0.75), py(p, 0.735)); ctx.lineTo(px(p, 0.758), py(p, 0.755));
      ctx.closePath(); ctx.fill();
      line(ctx, px(p, 0.775), py(p, 0.85), px(p, 0.81), py(p, 0.87), '#F5A623', 5);
    },
    altered(ctx, p) {
      ellipse(ctx, px(p, 0.74), py(p, 0.84), pr(p, 0.035), pr(p, 0.045), '#F5A623');
      circle(ctx, px(p, 0.74), py(p, 0.775), pr(p, 0.028), '#F5A623');
      ctx.fillStyle = '#F5A623';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.722), py(p, 0.755)); ctx.lineTo(px(p, 0.73), py(p, 0.735)); ctx.lineTo(px(p, 0.738), py(p, 0.755));
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px(p, 0.742), py(p, 0.755)); ctx.lineTo(px(p, 0.75), py(p, 0.735)); ctx.lineTo(px(p, 0.758), py(p, 0.755));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#F5A623'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.772), py(p, 0.84));
      ctx.quadraticCurveTo(px(p, 0.80), py(p, 0.80), px(p, 0.795), py(p, 0.74));
      ctx.stroke();
    },
  },
  {
    id: 'bike', x: 0.86, y: 0.68, r: 0.055, name: 'Keranjang sepeda hilang',
    base(ctx, p) {
      circle(ctx, px(p, 0.82), py(p, 0.72), pr(p, 0.035), '#333333');
      circle(ctx, px(p, 0.82), py(p, 0.72), pr(p, 0.02), '#DDDDDD');
      circle(ctx, px(p, 0.92), py(p, 0.72), pr(p, 0.035), '#333333');
      circle(ctx, px(p, 0.92), py(p, 0.72), pr(p, 0.02), '#DDDDDD');
      line(ctx, px(p, 0.82), py(p, 0.72), px(p, 0.87), py(p, 0.64), '#2E86E4', 4);
      line(ctx, px(p, 0.92), py(p, 0.72), px(p, 0.87), py(p, 0.64), '#2E86E4', 4);
      line(ctx, px(p, 0.87), py(p, 0.64), px(p, 0.84), py(p, 0.60), '#2E86E4', 4);
      rect(ctx, px(p, 0.885), py(p, 0.615), pr(p, 0.045), pr(p, 0.045), '#C89B5A');
      ctx.strokeStyle = '#8B5A2B'; ctx.lineWidth = 2;
      ctx.strokeRect(px(p, 0.885), py(p, 0.615), pr(p, 0.045), pr(p, 0.045));
    },
    altered(ctx, p) {
      circle(ctx, px(p, 0.82), py(p, 0.72), pr(p, 0.035), '#333333');
      circle(ctx, px(p, 0.82), py(p, 0.72), pr(p, 0.02), '#DDDDDD');
      circle(ctx, px(p, 0.92), py(p, 0.72), pr(p, 0.035), '#333333');
      circle(ctx, px(p, 0.92), py(p, 0.72), pr(p, 0.02), '#DDDDDD');
      line(ctx, px(p, 0.82), py(p, 0.72), px(p, 0.87), py(p, 0.64), '#2E86E4', 4);
      line(ctx, px(p, 0.92), py(p, 0.72), px(p, 0.87), py(p, 0.64), '#2E86E4', 4);
      line(ctx, px(p, 0.87), py(p, 0.64), px(p, 0.84), py(p, 0.60), '#2E86E4', 4);
    },
  },
];

// --- Ronde 2: Kebun Raya ---
const gardenDiffs = [
  {
    id: 'butterfly', x: 0.20, y: 0.25, r: 0.05, name: 'Warna kupu-kupu',
    base(ctx, p) {
      ellipse(ctx, px(p, 0.185), py(p, 0.25), pr(p, 0.022), pr(p, 0.014), '#F28C28');
      ellipse(ctx, px(p, 0.215), py(p, 0.25), pr(p, 0.022), pr(p, 0.014), '#F28C28');
      ellipse(ctx, px(p, 0.19), py(p, 0.27), pr(p, 0.015), pr(p, 0.01), '#E4572E');
      ellipse(ctx, px(p, 0.21), py(p, 0.27), pr(p, 0.015), pr(p, 0.01), '#E4572E');
      line(ctx, px(p, 0.20), py(p, 0.235), px(p, 0.20), py(p, 0.275), '#5A2D00', 3);
    },
    altered(ctx, p) {
      ellipse(ctx, px(p, 0.185), py(p, 0.25), pr(p, 0.022), pr(p, 0.014), '#2E86E4');
      ellipse(ctx, px(p, 0.215), py(p, 0.25), pr(p, 0.022), pr(p, 0.014), '#2E86E4');
      ellipse(ctx, px(p, 0.19), py(p, 0.27), pr(p, 0.015), pr(p, 0.01), '#1B5FA8');
      ellipse(ctx, px(p, 0.21), py(p, 0.27), pr(p, 0.015), pr(p, 0.01), '#1B5FA8');
      line(ctx, px(p, 0.20), py(p, 0.235), px(p, 0.20), py(p, 0.275), '#5A2D00', 3);
    },
  },
  {
    id: 'bird', x: 0.45, y: 0.12, r: 0.04, name: 'Burung tambahan',
    base() {},
    altered(ctx, p) {
      ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(px(p, 0.435), py(p, 0.12), pr(p, 0.018), Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px(p, 0.465), py(p, 0.12), pr(p, 0.018), Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    },
  },
  {
    id: 'fountain', x: 0.55, y: 0.40, r: 0.05, name: 'Pancuran air berkurang',
    base(ctx, p) {
      ctx.strokeStyle = '#7FC8E8'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (const a of [-0.5, 0, 0.5]) {
        ctx.beginPath();
        ctx.moveTo(px(p, 0.55), py(p, 0.36));
        ctx.quadraticCurveTo(px(p, 0.55 + a * 0.09), py(p, 0.30), px(p, 0.55 + a * 0.13), py(p, 0.44));
        ctx.stroke();
      }
      circle(ctx, px(p, 0.55), py(p, 0.35), pr(p, 0.012), '#2E86E4');
    },
    altered(ctx, p) {
      ctx.strokeStyle = '#7FC8E8'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (const a of [-0.5, 0.5]) {
        ctx.beginPath();
        ctx.moveTo(px(p, 0.55), py(p, 0.36));
        ctx.quadraticCurveTo(px(p, 0.55 + a * 0.09), py(p, 0.30), px(p, 0.55 + a * 0.13), py(p, 0.44));
        ctx.stroke();
      }
      circle(ctx, px(p, 0.55), py(p, 0.35), pr(p, 0.012), '#2E86E4');
    },
  },
  {
    id: 'flower', x: 0.30, y: 0.66, r: 0.045, name: 'Warna bunga',
    base(ctx, p) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ellipse(ctx, px(p, 0.30) + Math.cos(a) * pr(p, 0.022), py(p, 0.66) + Math.sin(a) * pr(p, 0.022),
          pr(p, 0.016), pr(p, 0.01), '#E4572E');
      }
      circle(ctx, px(p, 0.30), py(p, 0.66), pr(p, 0.012), '#FFD93B');
      line(ctx, px(p, 0.30), py(p, 0.68), px(p, 0.30), py(p, 0.76), '#2E7D32', 4);
    },
    altered(ctx, p) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ellipse(ctx, px(p, 0.30) + Math.cos(a) * pr(p, 0.022), py(p, 0.66) + Math.sin(a) * pr(p, 0.022),
          pr(p, 0.016), pr(p, 0.01), '#FFD93B');
      }
      circle(ctx, px(p, 0.30), py(p, 0.66), pr(p, 0.012), '#E4572E');
      line(ctx, px(p, 0.30), py(p, 0.68), px(p, 0.30), py(p, 0.76), '#2E7D32', 4);
    },
  },
  {
    id: 'lily', x: 0.62, y: 0.60, r: 0.045, name: 'Bunga teratai hilang',
    base(ctx, p) {
      ellipse(ctx, px(p, 0.62), py(p, 0.615), pr(p, 0.05), pr(p, 0.018), '#2E7D32');
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ellipse(ctx, px(p, 0.62) + Math.cos(a) * pr(p, 0.014), py(p, 0.60) + Math.sin(a) * pr(p, 0.014),
          pr(p, 0.01), pr(p, 0.006), '#F48FB1');
      }
      circle(ctx, px(p, 0.62), py(p, 0.60), pr(p, 0.008), '#FFD93B');
    },
    altered(ctx, p) {
      ellipse(ctx, px(p, 0.62), py(p, 0.615), pr(p, 0.05), pr(p, 0.018), '#2E7D32');
    },
  },
  {
    id: 'bench', x: 0.80, y: 0.72, r: 0.055, name: 'Papan bangku berkurang',
    base(ctx, p) {
      rect(ctx, px(p, 0.72), py(p, 0.68), pr(p, 0.16), pr(p, 0.012), '#8B5A2B');
      rect(ctx, px(p, 0.72), py(p, 0.705), pr(p, 0.16), pr(p, 0.012), '#8B5A2B');
      rect(ctx, px(p, 0.72), py(p, 0.73), pr(p, 0.16), pr(p, 0.012), '#8B5A2B');
      rect(ctx, px(p, 0.73), py(p, 0.68), pr(p, 0.012), pr(p, 0.10), '#5A3A1A');
      rect(ctx, px(p, 0.865), py(p, 0.68), pr(p, 0.012), pr(p, 0.10), '#5A3A1A');
    },
    altered(ctx, p) {
      rect(ctx, px(p, 0.72), py(p, 0.68), pr(p, 0.16), pr(p, 0.012), '#8B5A2B');
      rect(ctx, px(p, 0.72), py(p, 0.73), pr(p, 0.16), pr(p, 0.012), '#8B5A2B');
      rect(ctx, px(p, 0.73), py(p, 0.68), pr(p, 0.012), pr(p, 0.10), '#5A3A1A');
      rect(ctx, px(p, 0.865), py(p, 0.68), pr(p, 0.012), pr(p, 0.10), '#5A3A1A');
    },
  },
  {
    id: 'apple', x: 0.16, y: 0.28, r: 0.045, name: 'Apel di pohon berkurang',
    base(ctx, p) {
      circle(ctx, px(p, 0.13), py(p, 0.26), pr(p, 0.016), '#E4572E');
      circle(ctx, px(p, 0.18), py(p, 0.30), pr(p, 0.016), '#E4572E');
      circle(ctx, px(p, 0.16), py(p, 0.22), pr(p, 0.016), '#E4572E');
    },
    altered(ctx, p) {
      circle(ctx, px(p, 0.13), py(p, 0.26), pr(p, 0.016), '#E4572E');
      circle(ctx, px(p, 0.18), py(p, 0.30), pr(p, 0.016), '#E4572E');
    },
  },
];

// --- Ronde 3: Pelabuhan Senja ---
const harborDiffs = [
  {
    id: 'light', x: 0.15, y: 0.20, r: 0.05, name: 'Lampu mercusuar padam',
    base(ctx, p) {
      circle(ctx, px(p, 0.15), py(p, 0.20), pr(p, 0.018), '#FFE27A');
      ctx.fillStyle = 'rgba(255, 226, 122, 0.35)';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.15), py(p, 0.20));
      ctx.lineTo(px(p, 0.42), py(p, 0.13));
      ctx.lineTo(px(p, 0.42), py(p, 0.27));
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255, 226, 122, 0.35)';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.15), py(p, 0.20));
      ctx.lineTo(px(p, -0.02), py(p, 0.13));
      ctx.lineTo(px(p, -0.02), py(p, 0.27));
      ctx.closePath(); ctx.fill();
    },
    altered(ctx, p) {
      circle(ctx, px(p, 0.15), py(p, 0.20), pr(p, 0.018), '#8A8A8A');
    },
  },
  {
    id: 'moon', x: 0.88, y: 0.12, r: 0.05, name: 'Kawah bulan hilang',
    base(ctx, p) {
      circle(ctx, px(p, 0.88), py(p, 0.12), pr(p, 0.045), '#F5F0DC');
      circle(ctx, px(p, 0.865), py(p, 0.105), pr(p, 0.010), '#D8D0B4');
      circle(ctx, px(p, 0.895), py(p, 0.135), pr(p, 0.008), '#D8D0B4');
    },
    altered(ctx, p) {
      circle(ctx, px(p, 0.88), py(p, 0.12), pr(p, 0.045), '#F5F0DC');
    },
  },
  {
    id: 'gull', x: 0.45, y: 0.15, r: 0.045, name: 'Burung camar berkurang',
    base(ctx, p) {
      for (const gx of [0.38, 0.45, 0.52]) {
        ctx.strokeStyle = '#2B2B2B'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(px(p, gx - 0.015), py(p, 0.15), pr(p, 0.016), Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px(p, gx + 0.015), py(p, 0.15), pr(p, 0.016), Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }
    },
    altered(ctx, p) {
      for (const gx of [0.38, 0.52]) {
        ctx.strokeStyle = '#2B2B2B'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(px(p, gx - 0.015), py(p, 0.15), pr(p, 0.016), Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px(p, gx + 0.015), py(p, 0.15), pr(p, 0.016), Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }
    },
  },
  {
    id: 'sail', x: 0.55, y: 0.33, r: 0.055, name: 'Garis merah di layar',
    base(ctx, p) {
      ctx.fillStyle = '#FFF6E8';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.55), py(p, 0.18));
      ctx.lineTo(px(p, 0.55), py(p, 0.46));
      ctx.lineTo(px(p, 0.68), py(p, 0.46));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#8A8A8A'; ctx.lineWidth = 2; ctx.stroke();
      line(ctx, px(p, 0.55), py(p, 0.16), px(p, 0.55), py(p, 0.48), '#6B4A2A', 4);
    },
    altered(ctx, p) {
      ctx.fillStyle = '#FFF6E8';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.55), py(p, 0.18));
      ctx.lineTo(px(p, 0.55), py(p, 0.46));
      ctx.lineTo(px(p, 0.68), py(p, 0.46));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#8A8A8A'; ctx.lineWidth = 2; ctx.stroke();
      line(ctx, px(p, 0.55), py(p, 0.16), px(p, 0.55), py(p, 0.48), '#6B4A2A', 4);
      ctx.fillStyle = '#E4572E';
      ctx.beginPath();
      ctx.moveTo(px(p, 0.55), py(p, 0.36));
      ctx.lineTo(px(p, 0.635), py(p, 0.36));
      ctx.lineTo(px(p, 0.635), py(p, 0.40));
      ctx.lineTo(px(p, 0.55), py(p, 0.40));
      ctx.closePath(); ctx.fill();
    },
  },
  {
    id: 'fish', x: 0.72, y: 0.60, r: 0.045, name: 'Ikan melompat hilang',
    base(ctx, p) {
      ctx.fillStyle = '#7FB8D8';
      ctx.beginPath();
      ctx.ellipse(px(p, 0.72), py(p, 0.60), pr(p, 0.03), pr(p, 0.014), -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px(p, 0.745), py(p, 0.585));
      ctx.lineTo(px(p, 0.765), py(p, 0.575));
      ctx.lineTo(px(p, 0.76), py(p, 0.60));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px(p, 0.72), py(p, 0.655), pr(p, 0.03), 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    },
    altered() {},
  },
  {
    id: 'crate', x: 0.30, y: 0.76, r: 0.055, name: 'Peti berkurang satu',
    base(ctx, p) {
      rect(ctx, px(p, 0.24), py(p, 0.76), pr(p, 0.07), pr(p, 0.07), '#C89B5A');
      rect(ctx, px(p, 0.31), py(p, 0.76), pr(p, 0.07), pr(p, 0.07), '#B98A45');
      rect(ctx, px(p, 0.275), py(p, 0.69), pr(p, 0.07), pr(p, 0.07), '#D8B078');
      ctx.strokeStyle = '#8B5A2B'; ctx.lineWidth = 2;
      ctx.strokeRect(px(p, 0.24), py(p, 0.76), pr(p, 0.07), pr(p, 0.07));
      ctx.strokeRect(px(p, 0.31), py(p, 0.76), pr(p, 0.07), pr(p, 0.07));
      ctx.strokeRect(px(p, 0.275), py(p, 0.69), pr(p, 0.07), pr(p, 0.07));
    },
    altered(ctx, p) {
      rect(ctx, px(p, 0.24), py(p, 0.76), pr(p, 0.07), pr(p, 0.07), '#C89B5A');
      rect(ctx, px(p, 0.31), py(p, 0.76), pr(p, 0.07), pr(p, 0.07), '#B98A45');
      ctx.strokeStyle = '#8B5A2B'; ctx.lineWidth = 2;
      ctx.strokeRect(px(p, 0.24), py(p, 0.76), pr(p, 0.07), pr(p, 0.07));
      ctx.strokeRect(px(p, 0.31), py(p, 0.76), pr(p, 0.07), pr(p, 0.07));
    },
  },
  {
    id: 'rope', x: 0.62, y: 0.80, r: 0.045, name: 'Gulungan tali hilang',
    base(ctx, p) {
      ctx.strokeStyle = '#B98A45'; ctx.lineWidth = 4;
      for (const rr of [0.012, 0.022, 0.032]) {
        ctx.beginPath(); ctx.arc(px(p, 0.62), py(p, 0.80), pr(p, rr), 0, Math.PI * 2); ctx.stroke();
      }
      line(ctx, px(p, 0.65), py(p, 0.80), px(p, 0.70), py(p, 0.83), '#B98A45', 4);
    },
    altered() {},
  },
];

export const SCENES = [
  { id: 'market', name: 'Pasar Pagi', timeLimit: 150, diffs: marketDiffs },
  { id: 'garden', name: 'Kebun Raya', timeLimit: 120, diffs: gardenDiffs },
  { id: 'harbor', name: 'Pelabuhan Senja', timeLimit: 90, diffs: harborDiffs },
];

export function findDiffAt(scene, nx, ny) {
  for (const d of scene.diffs) {
    const dx = (nx - d.x) / d.r;
    const dy = (ny - d.y) / (d.r * 0.9);
    if (dx * dx + dy * dy <= 1) return d;
  }
  return null;
}
