import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export function judgeSql(input) {
  return new Promise((resolve, reject) => {
    // A worker thread cannot reliably interrupt a synchronous native SQLite call.
    // A separate process gives the timeout a real, enforceable kill boundary.
    const worker = fork(
      fileURLToPath(new URL('./sql-worker.mjs', import.meta.url)),
      ['--sql-child'],
      { execArgv: ['--max-old-space-size=32'], stdio: ['ignore', 'ignore', 'ignore', 'ipc'] },
    );
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.kill('SIGKILL');
      if (error) reject(error);
      else resolve(result);
    };
    const timer = setTimeout(
      () =>
        finish(
          new Error('Query time limit reached. Try a smaller query or check your JOIN condition.'),
        ),
      1500,
    );
    worker.once('message', (message) =>
      finish(message.error ? new Error(message.error) : null, message.result),
    );
    worker.once('error', (error) => finish(error));
    worker.once('exit', (code) => {
      if (!settled) finish(new Error(`SQL worker stopped (${code}).`));
    });
    worker.send(input);
  });
}
