import { judgeSeason } from './season/index.mjs';
import { judgePair } from './pair-java.mjs';
// One request, one short-lived process. Called only by the native Mac bridge.
import { judgePractice } from './practice-java.mjs';
import { judgeSql } from './sql.mjs';
import { judgeDocker } from './docker-java.mjs';
let buffer = '';
try {
  for await (const chunk of process.stdin) {
    buffer += chunk;
    if (Buffer.byteLength(buffer) > 20000) throw new Error('Request too large.');
  }
  const { path, payload } = JSON.parse(buffer);
  let data;
  const runtime = process.env.JAVA_RUNNER === 'docker' ? 'docker' : 'practice';
  if (path === '/api/health')
    data = { ok: true, javaRuntime: runtime, sqlRuntime: 'sqlite', platform: 'macos' };
  else if (path === '/api/season') data = await judgeSeason(payload);
  else if (path === '/api/pair') data = judgePair(payload);
  else if (path === '/api/java')
    data = await (runtime === 'docker'
      ? judgeDocker(payload.code, payload.submit === true)
      : judgePractice(payload.code, payload.submit === true));
  else if (path === '/api/sql')
    data = await judgeSql({
      query: payload.query,
      mission: payload.mission,
      submit: payload.submit === true,
    });
  else throw new Error('Unknown desktop operation.');
  process.stdout.write(JSON.stringify({ ok: true, data }));
} catch (error) {
  process.stdout.write(JSON.stringify({ ok: false, error: error.message }));
  process.exitCode = 1;
}
