// Entri best-spot-the-difference-game-20261121-0451 (Node 22, stdlib saja):
// game ini adalah file statis di game/ (index.html + modul ES, tanpa network),
// dan program ini menyerahkannya: menyalin game/ dan screenshots/ dari samping
// file ini ke /output lalu menulis /output/dossier.json, ringkasan yang dibaca
// juri, dengan library make.fun yang divendor. Di luar grader, MAKEFUN_OUTPUT_DIR
// menggantikan /output: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Batas gate (reference/gate.json): text_max_bytes membentuk byte dossier;
// sisanya menolak entri yang gate tolak (lebih dari 4 screenshot atau satu di
// atas 256 KiB; lebih dari 993 file di game/ atau 48 MiB total; path di bawah
// game/ di atas 1000 byte).
function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1;
  }
  return n;
}

const dossierPath = join(out, 'dossier.json');
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(dossierPath, dossier);

// Ringkasan jalan agar dua kali jalan bisa dibandingkan byte per byte:
// game/ yang disalin, screenshot yang disalin, dan byte dossier.json.
const shotNames = existsSync(join(here, 'screenshots'))
  ? readdirSync(join(here, 'screenshots')).sort()
  : [];
console.log(
  `cari-bedanya: ${countFiles(join(out, 'game'))} file game, ` +
  `${shotNames.length} screenshot (${shotNames.join(', ')}), ` +
  `dossier ${statSync(dossierPath).size} byte -> ${out}`,
);
