// Uji main end-to-end (skrip dev, bukan bagian entri): menyajikan game/,
// membuka Chromium lewat CDP, mengklik perbedaan sungguhan, lalu memeriksa
// counter, skor, klik salah, dan hint. Keluar 0 bila semua lolos.
// Dipakai: node test-play.mjs
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const gameDir = join(here, 'game');
const CHROME = '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = join(gameDir, path === '/' ? 'index.html' : path);
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  '--remote-debugging-port=9222', '--window-size=1280,760',
  `http://127.0.0.1:${port}/index.html`,
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws = null;
let msgId = 0;
const pending = new Map();

async function connect() {
  for (let i = 0; i < 30; i++) {
    try {
      const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
      const page = targets.find((t) => t.type === 'page');
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
          ws.onopen = resolve;
          ws.onerror = reject;
        });
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id && pending.has(msg.id)) {
            pending.get(msg.id)(msg);
            pending.delete(msg.id);
          }
        };
        return;
      }
    } catch { /* chrome belum siap */ }
    await sleep(500);
  }
  throw new Error('CDP tidak terhubung');
}

function evaluate(expression) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, (msg) => {
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result?.result?.value);
    });
    ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
  });
}

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

try {
  await connect();
  await sleep(1500);
  // Mulai permainan lewat tombol overlay.
  await evaluate(`document.getElementById('overlay-btn').click(); 'ok'`);
  await sleep(300);
  check('overlay tertutup setelah Mulai', await evaluate(`document.getElementById('overlay').classList.contains('hidden')`));
  check('counter awal 0/7', (await evaluate(`document.getElementById('hud-found').textContent`)) === 'Ditemukan 0/7');

  // Klik matahari di panel B (perbedaan 'sun', tengah 0.12/0.13 panel kanan).
  const clickAt = async (nx, ny, side) => evaluate(`
    (() => {
      const c = document.getElementById('game');
      const r = c.getBoundingClientRect();
      const px = ${side === 'right' ? 660 : 20} + ${nx} * 600;
      const py = 16 + ${ny} * 540;
      c.dispatchEvent(new MouseEvent('click', { clientX: r.left + px * (r.width / 1280), clientY: r.top + py * (r.height / 640), bubbles: true }));
      return 'ok';
    })()
  `);
  await clickAt(0.12, 0.13, 'right');
  await sleep(200);
  check('klik perbedaan ketemu (counter 1/7)', (await evaluate(`document.getElementById('hud-found').textContent`)) === 'Ditemukan 1/7');
  const scoreAfterFound = await evaluate(`document.getElementById('hud-score').textContent`);
  check('skor naik setelah temuan', /^Skor [1-9]/.test(scoreAfterFound), scoreAfterFound);

  // Klik salah di langit kosong panel A.
  await clickAt(0.50, 0.06, 'left');
  await sleep(200);
  const scoreAfterWrong = await evaluate(`document.getElementById('hud-score').textContent`);
  check('klik salah mengurangi skor', scoreAfterWrong !== scoreAfterFound, `${scoreAfterFound} -> ${scoreAfterWrong}`);

  // Hint lewat keyboard.
  await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' })); 'ok'`);
  await sleep(200);
  check('hint berkurang jadi 2x', (await evaluate(`document.getElementById('hud-hints').textContent`)) === 'Hint 2x');

  // Mute lewat keyboard.
  await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm' })); 'ok'`);
  await sleep(100);
  check('mute beralih', (await evaluate(`document.getElementById('btn-mute').textContent`)).includes('mati'));

  // Temukan 6 perbedaan sisanya di ronde 1 lewat klik langsung.
  const rest = [[0.40, 0.23], [0.55, 0.335], [0.30, 0.70], [0.52, 0.545], [0.74, 0.82], [0.86, 0.68]];
  for (const [nx, ny] of rest) {
    await clickAt(nx, ny, 'right');
    await sleep(120);
  }
  check('ronde 1 selesai 7/7', (await evaluate(`document.getElementById('hud-found').textContent`)) === 'Ditemukan 7/7');
  await sleep(1800);
  check('overlay ronde berikutnya muncul', await evaluate(`!document.getElementById('overlay').classList.contains('hidden')`));
  check('judul overlay ronde selesai', (await evaluate(`document.getElementById('overlay-title').textContent`)).includes('Ronde selesai'));
} catch (error) {
  console.log('ERROR', error.message);
  results.push({ name: 'tidak error', ok: false });
} finally {
  if (ws) ws.close();
  chrome.kill();
  server.close();
}

const failed = results.filter((r) => !r.ok).length;
console.log(failed === 0 ? 'SEMUA UJI LOLOS' : `${failed} UJI GAGAL`);
process.exit(failed === 0 ? 0 : 1);
