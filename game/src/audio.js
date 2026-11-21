// Efek suara WebAudio: tanpa file, semua disintesis dengan osilator.
let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureCtx() {
  if (muted) return null;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function tone(freq, start, duration, type = 'sine', volume = 0.15) {
  const ctx = ensureCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration + 0.02);
  } catch {
    // Suara opsional: jangan pernah menggagalkan permainan.
  }
}

export function playFound() {
  tone(659.25, 0, 0.12, 'sine', 0.18);
  tone(880, 0.09, 0.18, 'sine', 0.18);
}

export function playWrong() {
  tone(140, 0, 0.16, 'square', 0.08);
}

export function playHint() {
  tone(1046.5, 0, 0.10, 'triangle', 0.12);
}

export function playTick() {
  tone(1200, 0, 0.04, 'sine', 0.06);
}

export function playWin() {
  tone(523.25, 0, 0.14, 'sine', 0.16);
  tone(659.25, 0.12, 0.14, 'sine', 0.16);
  tone(783.99, 0.24, 0.14, 'sine', 0.16);
  tone(1046.5, 0.36, 0.30, 'sine', 0.18);
}

export function playRoundClear() {
  tone(783.99, 0, 0.12, 'sine', 0.15);
  tone(1046.5, 0.10, 0.22, 'sine', 0.15);
}
