// Skrip dev (bukan bagian entri): menyajikan game/ lewat HTTP lokal lalu
// mengambil 4 tangkapan layar nyata dengan Chromium headless.
// Dipakai: node shots.mjs  (menulis screenshots/1-cover.png ... 4-final.png)
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const gameDir = join(here, 'game');
const shotDir = join(here, 'screenshots');
const CHROME = '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = join(gameDir, path === '/' ? 'index.html' : path);
    if (!file.startsWith(gameDir)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

const SHOTS = [
  { name: '1-cover.png', query: 'shot=cover' },
  { name: '2-round2.png', query: 'shot=round2' },
  { name: '3-round3.png', query: 'shot=round3' },
  { name: '4-final.png', query: 'shot=final' },
];

await mkdir(shotDir, { recursive: true });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
console.log(`serving game/ on 127.0.0.1:${port}`);

for (const shot of SHOTS) {
  const url = `http://127.0.0.1:${port}/index.html?${shot.query}`;
  const out = join(shotDir, shot.name);
  await run(CHROME, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--window-size=1280,760', '--virtual-time-budget=4000',
    `--screenshot=${out}`, url,
  ]);
  const info = await stat(out);
  console.log(`${shot.name}: ${info.size} bytes`);
}
server.close();
console.log('done');
