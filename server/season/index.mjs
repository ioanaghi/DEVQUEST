import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TASKS } from '../../src/lib/season-content.mjs';
import { judgeSeasonJava } from './java.mjs';
export async function judgeSeason(input) {
  if (!input || !TASKS[input.task]) throw new Error('Unknown Season 1 exercise.');
  if (!TASKS[input.task].sql) return judgeSeasonJava(input);
  return new Promise((resolve, reject) => {
    const worker = fork(fileURLToPath(new URL('./sql-child.mjs', import.meta.url)), [], {
      execArgv: ['--max-old-space-size=32'],
      stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
    });
    let done = false;
    const finish = (err, result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      worker.kill('SIGKILL');
      err ? reject(err) : resolve(result);
    };
    const timer = setTimeout(
      () => finish(new Error('Query time limit reached. Check your JOIN condition.')),
      1800,
    );
    worker.once('message', (r) => finish(r.error ? new Error(r.error) : null, r.result));
    worker.once('error', (e) => finish(e));
    worker.once('exit', () => finish(new Error('SQL worker stopped.')));
    worker.send(input);
  });
}
