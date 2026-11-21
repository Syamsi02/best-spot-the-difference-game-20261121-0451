# Cari Bedanya — Pasar, Kebun & Pelabuhan

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Syamsi02/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Syamsi02/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Game cari perbedaan original: dua gambar nyaris identik berdampingan, 3 ronde
(Pasar Pagi, Kebun Raya, Pelabuhan Senja) × 7 perbedaan, digambar prosedural
di canvas 2D dari kode — tanpa aset eksternal, tanpa network. Klik perbedaan
untuk menandai, hint terbatas, timer per ronde, skor + bintang di akhir.

`main.ts` (Node 22, stdlib saja) menyalin `game/` + `screenshots/` ke
`/output` dan menulis `/output/dossier.json` lewat `vendor/makefun-game.ts`.

## Run

```sh
node shots.mjs   # sajikan game/ lokal + ambil 4 screenshot nyata ke screenshots/
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Entry

- Competition: [best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
- Prize: $50, top 10 × $5

## License

SPDX-License-Identifier: MIT
