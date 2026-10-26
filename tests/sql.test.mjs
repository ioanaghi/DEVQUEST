import test from 'node:test';
import assert from 'node:assert/strict';
import { judgeSql } from '../server/sql.mjs';
const filter = "SELECT id, customer_id FROM orders WHERE status = 'pending'";
const join =
  "SELECT o.id AS id, c.name AS customer_name FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.status = 'pending'";
test('SQL filtering runs real SQLite and accepts reordered results', async () => {
  const result = await judgeSql({
    query: filter + ' ORDER BY id DESC;',
    mission: 'filter',
    submit: true,
  });
  assert.equal(result.passed, true);
  assert.equal(result.rows.length, 3);
  assert.equal(result.rows[0].id, 105);
});
test('JOIN investigation returns the customers and passes changed review data', async () => {
  const result = await judgeSql({ query: join, mission: 'join', submit: true });
  assert.equal(result.passed, true);
  assert.deepEqual(
    result.rows.map((row) => row.customer_name),
    ['Maya Chen', 'Sofia Marin', 'Leo Park'],
  );
});
test('incorrect columns, missing rows and duplicate rows fail review', async () => {
  for (const query of [
    "SELECT * FROM orders WHERE status='pending'",
    filter + ' LIMIT 2',
    filter + ' UNION ALL ' + filter,
  ])
    assert.equal((await judgeSql({ query, mission: 'filter', submit: true })).passed, false);
});
test('hard-coded sample answers do not pass the independent review', async () => {
  const query = 'SELECT 101 AS id, 1 AS customer_id UNION ALL SELECT 103,3 UNION ALL SELECT 105,4';
  assert.equal((await judgeSql({ query, mission: 'filter' })).passed, true);
  assert.equal((await judgeSql({ query, mission: 'filter', submit: true })).passed, false);
});
test('allows real CTEs and reports useful SQLite errors', async () => {
  assert.equal(
    (
      await judgeSql({
        query: `WITH pending AS (${filter}) SELECT * FROM pending`,
        mission: 'filter',
        submit: true,
      })
    ).passed,
    true,
  );
  await assert.rejects(
    judgeSql({ query: 'SELECT nonexistent FROM orders', mission: 'filter' }),
    /no such column/,
  );
});
test('blocks destructive queries, multiple statements and filesystem operations', async () => {
  for (const query of [
    'DELETE FROM orders',
    'SELECT 1; DROP TABLE orders',
    "ATTACH DATABASE '/tmp/private.db' AS private",
    'PRAGMA database_list',
    "SELECT load_extension('x')",
    'WITH x AS (SELECT 1) DELETE FROM orders',
    "SELECT readfile('/etc/passwd')",
  ])
    await assert.rejects(judgeSql({ query, mission: 'filter' }));
  assert.equal((await judgeSql({ query: filter, mission: 'filter', submit: true })).passed, true);
});
test('caps output and stops expensive queries without blocking the server', async () => {
  await assert.rejects(
    judgeSql({
      query:
        'WITH RECURSIVE x(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM x WHERE n<1000) SELECT * FROM x',
      mission: 'filter',
    }),
    /500/,
  );
  await assert.rejects(
    judgeSql({
      query: 'WITH RECURSIVE x(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM x) SELECT sum(n) FROM x',
      mission: 'filter',
    }),
    /time limit/,
  );
});
