// Mesin permainan: status ronde, timer, skor, hint, dan aliran menu -> main -> selesai.
// Status permainan murni ada di objek state; render.js hanya menggambarnya.
import { SCENES } from './differences.js';
import { CANVAS_W, CANVAS_H, computeLayout, renderGame } from './render.js';
import { panelAtPoint, whichPanel, hitTest, bindKeyboard } from './input.js';
import { playFound, playWrong, playHint, playTick, playWin, playRoundClear, setMuted, isMuted } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const el = (id) => document.getElementById(id);
const hudRound = el('hud-round');
const hudFound = el('hud-found');
const hudScore = el('hud-score');
const hudTime = el('hud-time');
const hudTimerFill = el('timer-fill');
const hudHints = el('hud-hints');
const btnHint = el('btn-hint');
const btnMute = el('btn-mute');
const btnRestart = el('btn-restart');
const overlay = el('overlay');
const overlayTitle = el('overlay-title');
const overlayText = el('overlay-text');
const overlayBtn = el('overlay-btn');

const state = {
  phase: 'menu', // menu | playing | roundEnd | done
  roundIndex: 0,
  scene: SCENES[0],
  layout: computeLayout(),
  foundIds: new Set(),
  timeLeft: SCENES[0].timeLimit,
  lastTickSecond: -1,
  score: 0,
  roundScore: 0,
  hintsLeft: 3,
  hintDiff: null,
  hintUntil: 0,
  wrongMarks: [],
  floaters: [],
  message: 'Klik 7 perbedaan antara gambar A dan B. H = hint, R = ulang ronde.',
  totalFound: 0,
  totalDiffs: SCENES.reduce((n, s) => n + s.diffs.length, 0),
  stars: 0,
  lastFrame: performance.now(),
};

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function updateHud() {
  hudRound.textContent = `Ronde ${state.roundIndex + 1}/3 · ${state.scene.name}`;
  hudFound.textContent = `Ditemukan ${state.foundIds.size}/${state.scene.diffs.length}`;
  hudScore.textContent = `Skor ${state.score}`;
  hudTime.textContent = formatTime(state.timeLeft);
  const ratio = Math.max(0, state.timeLeft / state.scene.timeLimit);
  hudTimerFill.style.width = `${ratio * 100}%`;
  hudTimerFill.style.background = ratio < 0.2 ? '#E4572E' : ratio < 0.45 ? '#F5A623' : '#43AA5B';
  hudHints.textContent = `Hint ${state.hintsLeft}x`;
  btnHint.disabled = state.phase !== 'playing' || state.hintsLeft <= 0;
  btnMute.textContent = isMuted() ? 'Suara: mati (M)' : 'Suara: hidup (M)';
}

function showOverlay(title, text, buttonLabel, onButton) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlayBtn.textContent = buttonLabel;
  overlay.classList.remove('hidden');
  overlayBtn.onclick = onButton;
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function startRound(index, keepScore = true) {
  state.roundIndex = index;
  state.scene = SCENES[index];
  state.foundIds = new Set();
  state.timeLeft = state.scene.timeLimit;
  state.lastTickSecond = -1;
  state.roundScore = 0;
  state.hintsLeft = 3;
  state.hintDiff = null;
  state.hintUntil = 0;
  state.wrongMarks = [];
  state.floaters = [];
  if (!keepScore) state.score = 0;
  state.phase = 'playing';
  state.message = `Ronde ${index + 1}: ${state.scene.name} — cari 7 perbedaan!`;
  hideOverlay();
  updateHud();
}

function startGame() {
  state.score = 0;
  state.totalFound = 0;
  startRound(0);
}

function endRound(timeout) {
  state.phase = 'roundEnd';
  const found = state.foundIds.size;
  const total = state.scene.diffs.length;
  if (found === total) {
    const timeBonus = Math.round(state.timeLeft) * 2;
    state.score += timeBonus;
    state.roundScore += timeBonus;
    playRoundClear();
    state.message = `Ronde selesai! Bonus waktu +${timeBonus}.`;
  } else if (timeout) {
    state.message = `Waktu habis! Kamu menemukan ${found}/${total} perbedaan.`;
  }
  updateHud();
  const last = state.roundIndex === SCENES.length - 1;
  setTimeout(() => {
    if (last) endGame();
    else {
      const next = state.roundIndex + 1;
      showOverlay(
        found === total ? 'Ronde selesai!' : 'Waktu habis!',
        `Kamu menemukan ${found}/${total} perbedaan di ${state.scene.name}. Skor ronde: ${state.roundScore}. Lanjut ke ${SCENES[next].name}?`,
        'Ronde berikutnya',
        () => startRound(next),
      );
    }
  }, 1400);
}

function endGame() {
  state.phase = 'done';
  const accuracy = state.totalFound / state.totalDiffs;
  state.stars = accuracy >= 0.95 ? 3 : accuracy >= 0.75 ? 2 : accuracy >= 0.5 ? 1 : 0;
  playWin();
  const starText = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
  showOverlay(
    'Permainan selesai!',
    `${starText}  Skor akhir ${state.score} · ${state.totalFound}/${state.totalDiffs} perbedaan ditemukan. Terima kasih sudah bermain Cari Bedanya!`,
    'Main lagi',
    startGame,
  );
  state.message = 'Permainan selesai — klik "Main lagi" untuk mengulang dari ronde 1.';
  updateHud();
}

function useHint() {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const remaining = state.scene.diffs.filter((d) => !state.foundIds.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 25);
  state.hintDiff = pick.id;
  state.hintUntil = performance.now() + 1400;
  playHint();
  state.message = `Hint: ada perbedaan di sekitar "${pick.name}" — cepat, sebelum denyutnya hilang!`;
  updateHud();
}

function onCanvasClick(event) {
  if (state.phase !== 'playing') return;
  const { x, y } = panelAtPoint(canvas, event.clientX, event.clientY);
  const side = whichPanel(state.layout, x, y);
  if (!side) return;
  const result = hitTest(state.scene, state.foundIds, state.layout[side], x, y);
  if (!result) {
    state.score = Math.max(0, state.score - 15);
    state.wrongMarks.push({ x, y, born: performance.now() });
    playWrong();
    state.message = 'Bukan di situ — minus 15 poin. Perhatikan lagi baik-baik!';
    updateHud();
    return;
  }
  if (result.already) {
    state.message = `Perbedaan "${result.diff.name}" sudah ketemu — cari yang lain!`;
    updateHud();
    return;
  }
  state.foundIds.add(result.diff.id);
  state.totalFound += 1;
  const gained = 100 + state.roundIndex * 25 + Math.round(state.timeLeft);
  state.score += gained;
  state.roundScore += gained;
  state.floaters.push({ x, y: y - 20, text: `+${gained}`, color: '#2E9E4F', born: performance.now() });
  playFound();
  state.message = `Ketemu: ${result.diff.name}! (+${gained})`;
  updateHud();
  if (state.foundIds.size === state.scene.diffs.length) endRound(false);
}

function onKey(key) {
  if (key === 'h') useHint();
  else if (key === 'r') {
    if (state.phase === 'playing' || state.phase === 'roundEnd') startRound(state.roundIndex);
  } else if (key === 'm') {
    setMuted(!isMuted());
    updateHud();
  } else if (key === '1' || key === '2' || key === '3') {
    startRound(Number(key) - 1);
  } else if (key === 'enter' && state.phase === 'menu') {
    startGame();
  }
}

// Keadaan awal untuk tangkapan layar (?shot=...): status permainan asli,
// dimuat dari parameter URL saja — tanpa parameter, permainan mulai dari menu.
function applyShotPreset() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return false;
  hideOverlay();
  if (shot === 'final') {
    state.phase = 'done';
    state.roundIndex = 2;
    state.scene = SCENES[2];
    state.foundIds = new Set(SCENES[2].diffs.map((d) => d.id));
    state.timeLeft = 0;
    state.score = 2840;
    state.roundScore = 940;
    state.totalFound = state.totalDiffs;
    state.stars = 3;
    state.message = 'Permainan selesai — klik "Main lagi" untuk mengulang dari ronde 1.';
    showOverlay(
      'Permainan selesai!',
      '★★★  Skor akhir 2840 · 21/21 perbedaan ditemukan. Terima kasih sudah bermain Cari Bedanya!',
      'Main lagi',
      startGame,
    );
    updateHud();
    return true;
  }
  const presets = {
    cover: { round: 0, found: [0, 2, 4], timeLeft: 108, score: 340 },
    round2: { round: 1, found: [1, 4], timeLeft: 86, score: 720 },
    round3: { round: 2, found: [0, 1, 3, 5, 6], timeLeft: 41, score: 1980 },
  };
  const preset = presets[shot];
  if (!preset) return false;
  startRound(preset.round);
  for (const i of preset.found) {
    const diff = state.scene.diffs[i];
    if (diff) {
      state.foundIds.add(diff.id);
      state.totalFound += 1;
    }
  }
  state.timeLeft = preset.timeLeft;
  state.score = preset.score;
  state.roundScore = preset.score;
  state.message = `Ronde ${preset.round + 1}: ${state.scene.name} — cari 7 perbedaan!`;
  updateHud();
  return true;
}

function frame(now) {
  const dt = Math.min(0.1, (now - state.lastFrame) / 1000);
  state.lastFrame = now;
  if (state.phase === 'playing') {
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (whole !== state.lastTickSecond) {
      state.lastTickSecond = whole;
      if (whole <= 10 && whole > 0) playTick();
      updateHud();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      endRound(true);
    }
  }
  state.wrongMarks = state.wrongMarks.filter((m) => now - m.born < 800);
  state.floaters = state.floaters.filter((f) => now - f.born < 1200);
  renderGame(ctx, state, now);
  requestAnimationFrame(frame);
}

canvas.addEventListener('click', onCanvasClick);
btnHint.addEventListener('click', useHint);
btnMute.addEventListener('click', () => {
  setMuted(!isMuted());
  updateHud();
});
btnRestart.addEventListener('click', () => startRound(state.roundIndex));
bindKeyboard(onKey);
overlayBtn.addEventListener('click', () => {
  if (state.phase === 'menu') startGame();
});

showOverlay(
  'Cari Bedanya: Pasar, Kebun & Pelabuhan',
  'Tiga ronde, 21 perbedaan. Klik perbedaan di gambar A atau B — tiap temuan +poin, tiap salah klik −15. Hint 3x per ronde (H), ulang ronde (R), pilih ronde (1/2/3).',
  'Mulai bermain',
  startGame,
);
updateHud();
if (!applyShotPreset()) {
  state.phase = 'menu';
}
requestAnimationFrame(frame);
