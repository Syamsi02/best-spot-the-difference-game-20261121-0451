# best-spot-the-difference-game-20261121-0451 — Build Report

Status: BUILT AND TESTED (2026-11-21 ~12:15 WIB). Belum submit — parent yang bundle/kit-check/submit.
Repo: `~/workspace/makefun/best-spot-the-difference-game-20261121-0451`, entrypoint `main.ts` (Node 22 stdlib).
Deadline: 2026-11-21 23:51 WIB. Hadiah $50, top 10 x $5. Tanpa fee.
Kit init: anchor `d633d3f9426b555df74473ffea8a0eaedab62490` round 34144613 (dijalankan sebelum write pertama).

## Game: "Cari Bedanya — Pasar, Kebun & Pelabuhan"

Spot the difference original, 3 ronde, 7 perbedaan per ronde (21 total), semua seni
digambar prosedural di canvas 2D dari kode (tanpa aset eksternal, tanpa network).
Dua panel berdampingan (A kiri asli, B kanan berubah), klik di panel mana pun.

- Ronde 1 "Pasar Pagi" (150 detik): matahari berkacamata, garis tenda biru,
  bendera hilang satu, jeruk berkurang satu, harga 10K jadi 15K, ekor kucing naik,
  keranjang sepeda hilang.
- Ronde 2 "Kebun Raya" (120 detik): kupu-kupu oranye jadi biru, burung tambahan,
  pancuran 3 jadi 2, bunga merah jadi kuning, bunga teratai hilang, papan bangku
  3 jadi 2, apel di pohon 3 jadi 2.
- Ronde 3 "Pelabuhan Senja" (90 detik): lampu mercusuar padam, kawah bulan hilang,
  camar 3 jadi 2, garis merah di layar, ikan melompat hilang, peti 3 jadi 2,
  gulungan tali hilang.

Mekanik: klik perbedaan = lingkaran hijau + bunyi chime + poin (100 + bonus ronde +
sisa waktu); klik salah = tanda X merah + minus 15; Hint 3x per ronde (denyut
kuning 1,4 detik di satu perbedaan, minus 25 poin); timer per ronde dengan bar
yang menyusut dan berubah merah; skor akhir + bintang 1-3; layar akhir.
Keyboard: H hint, R ulang ronde, 1/2/3 pilih ronde, M mute, Enter mulai.

## File

- `game/index.html`, `game/style.css` — kanvas 1280x640 + HUD DOM (ronde, counter,
  skor, timer, hint, tombol).
- `game/src/differences.js` — 21 perbedaan: posisi, radius, `base()` vs `altered()`,
  `findDiffAt()` (hit-test elips).
- `game/src/scenes.js` — latar statis 3 adegan (langit, tanah, bangunan).
- `game/src/render.js` — dua panel, marker, denyut hint, teks mengambang.
- `game/src/input.js` — klik mouse + keyboard, hit-test panel.
- `game/src/audio.js` — efek WebAudio (chime, buzz, hint, fanfare).
- `game/src/main.js` — mesin status (menu/main/ronde selesai/selesai), timer, skor,
  dan preset `?shot=` untuk tangkapan layar (cover/round2/round3/final).
- `main.ts` — menyalin game/ + screenshots/ ke /output, menulis dossier.json
  via `vendor/makefun-game.ts` (copy kit tanpa diubah).
- `shots.mjs`, `test-play.mjs` — skrip dev (screenshot + uji main via CDP).

## Verifikasi

- Hit-test Node: 24/24 lolos (tiap pusat perbedaan kena, titik jauh null).
- Uji main CDP (Chromium headless, klik sungguhan): 10/10 lolos — overlay,
  counter 0/7 -> 1/7, skor naik (+250), klik salah minus 15, hint 3x -> 2x,
  mute, ronde 1 selesai 7/7 + overlay ronde berikutnya.
- Screenshot: 4 PNG 1280x760, masing-masing < 256 KiB (86.932, 83.756, 86.169,
  114.760 byte), diperiksa visual: cover menunjukkan 3 marker + counter 3/7 +
  timer; ronde 2: 2 marker + counter 2/7; ronde 3: 5 marker + counter 5/7;
  final: overlay selesai + 3 bintang + 21/21.
- `main.ts` dua kali jalan: `out` == `out2` byte per byte (deterministik).
  Dossier 547.644 byte, 8 file game, 4 screenshot.
- Catatan: `/opt/meta-chromium/chrome` menolak jalan (kebijakan WebGL Hatch);
  screenshot + uji memakai Chrome for Testing 159 dari cache Playwright
  (`~/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`).
