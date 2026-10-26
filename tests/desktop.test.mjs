import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
function call(input) {
  const result = spawnSync(process.execPath, ['server/desktop-runner.mjs'], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    timeout: 5000,
    env: { ...process.env, JAVA_RUNNER: 'practice' },
  });
  assert.equal(result.error, undefined);
  return JSON.parse(result.stdout);
}
test('desktop runtime answers the native health handshake', () => {
  const response = call({ path: '/api/health', payload: {} });
  assert.equal(response.ok, true);
  assert.equal(response.data.javaRuntime, 'practice');
  assert.equal(response.data.sqlRuntime, 'sqlite');
});
test('desktop bridge executes Java and SQLite without an HTTP server', () => {
  const java = call({
    path: '/api/java',
    payload: {
      code: 'public static boolean canRegister(int age) { return age >= 18; }',
      submit: true,
    },
  });
  assert.equal(java.data.passed, true);
  const sql = call({
    path: '/api/sql',
    payload: {
      query: "SELECT id, customer_id FROM orders WHERE status='pending'",
      mission: 'filter',
      submit: true,
    },
  });
  assert.equal(sql.data.passed, true);
  assert.equal(sql.data.rows.length, 3);
});
test('desktop protocol returns structured errors for invalid operations and input', () => {
  assert.equal(call({ path: '/api/private', payload: {} }).ok, false);
  assert.equal(call({ path: '/api/java', payload: { code: 'broken' } }).ok, false);
});
