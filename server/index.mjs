import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { judgeSql } from './sql.mjs';
import { judgePractice } from './practice-java.mjs';
import { judgeDocker } from './docker-java.mjs';

const production = process.argv.includes('--production');
const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const port = Number(process.env.PORT || 8082);
let running = 0;
const runtime = process.env.JAVA_RUNNER === 'docker' ? 'docker' : 'practice';
function json(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(data));
}
async function body(req) {
  let buffer = '';
  for await (const chunk of req) {
    buffer += chunk;
    if (Buffer.byteLength(buffer) > 12000) throw new Error('Request too large.');
  }
  try {
    return JSON.parse(buffer);
  } catch {
    throw new Error('Send a JSON request.');
  }
}
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/health' && req.method === 'GET')
    return json(res, 200, { ok: true, javaRuntime: runtime, sqlRuntime: 'sqlite' });
  if (url.pathname.startsWith('/api/')) {
    if (req.method !== 'POST') return json(res, 405, { error: 'Use POST for this endpoint.' });
    // Browser clients must be same-origin; the service binds to loopback only.
    const origin = req.headers.origin;
    if (
      origin &&
      ![
        `http://127.0.0.1:${port}`,
        `http://localhost:${port}`,
        'http://127.0.0.1:5173',
        'http://localhost:5173',
      ].includes(origin)
    )
      return json(res, 403, { error: 'Origin is not allowed.' });
    if (!req.headers['content-type']?.startsWith('application/json'))
      return json(res, 415, { error: 'Use application/json.' });
    if (running >= 2)
      return json(res, 429, { error: 'The runners are busy. Try again in a moment.' });
    running++;
    try {
      const input = await body(req);
      if (url.pathname === '/api/java')
        return json(
          res,
          200,
          await (runtime === 'docker'
            ? judgeDocker(input.code, input.submit === true)
            : judgePractice(input.code, input.submit === true)),
        );
      if (url.pathname === '/api/sql')
        return json(
          res,
          200,
          await judgeSql({
            query: input.query,
            mission: input.mission,
            submit: input.submit === true,
          }),
        );
      return json(res, 404, { error: 'Unknown endpoint.' });
    } catch (error) {
      return json(res, 400, { error: error.message });
    } finally {
      running--;
    }
  }
  if (!production)
    return json(res, 404, { error: 'Open the Vite dev server at http://127.0.0.1:5173.' });
  if (!['GET', 'HEAD'].includes(req.method))
    return json(res, 405, { error: 'Method not allowed.' });
  try {
    let path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path !== root && !path.startsWith(root + sep))
      return json(res, 403, { error: 'Forbidden.' });
    const exists = await stat(path).catch(() => null);
    if (exists?.isDirectory()) path = resolve(path, 'index.html');
    if (!exists && !extname(path)) path = resolve(root, 'index.html');
    const data = await readFile(path);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.json': 'application/json',
    };
    res.writeHead(200, {
      'Content-Type': types[extname(path)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy':
        "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; script-src 'self'; frame-ancestors 'none'; object-src 'none'",
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    json(res, 404, { error: 'Not found.' });
  }
});
server.requestTimeout = 20000;
server.headersTimeout = 10000;
server.listen(port, '127.0.0.1', () =>
  console.log(
    `DEVQUEST ${production ? 'game' : 'API'} → http://127.0.0.1:${port} · Java: ${runtime} · SQLite: ready`,
  ),
);
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
