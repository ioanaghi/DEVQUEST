import { parentPort, workerData } from 'node:worker_threads';
import { DatabaseSync } from 'node:sqlite';

function database(variant = false) {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL);
    CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id), total REAL NOT NULL, status TEXT NOT NULL);
    INSERT INTO customers VALUES (1,'Maya Chen','maya@example.test'),(2,'Noah Williams','noah@example.test'),(3,'Sofia Marin','sofia@example.test'),(4,'Leo Park','leo@example.test');
    INSERT INTO orders VALUES (101,1,49.90,'pending'),(102,2,124.00,'shipped'),(103,3,32.50,'pending'),(104,1,85.00,'delivered'),(105,4,210.00,'pending'),(106,2,18.75,'cancelled');
  `);
  if (variant)
    db.exec(
      `UPDATE customers SET name = 'Customer ' || id; UPDATE orders SET status = CASE WHEN id IN (102,104,106) THEN 'pending' ELSE 'shipped' END; UPDATE orders SET id = id + 300;`,
    );
  db.exec('PRAGMA query_only = ON;');
  return db;
}

// Only one SELECT/CTE is accepted; no file access, PRAGMAs, schema or connection changes.
export function validateQuery(query) {
  if (typeof query !== 'string' || query.length > 6000)
    throw new Error('Keep the query under 6,000 characters.');
  const clean = query
    .replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '')
    .trim()
    .replace(/;\s*$/, '');
  const words = clean.replace(/'(?:''|[^'])*'/g, "''").replace(/"(?:""|[^"])*"/g, '""');
  if (
    !/^\s*(SELECT|WITH)\b/i.test(words) ||
    words.includes(';') ||
    /\b(attach|detach|pragma|insert|update|delete|drop|alter|create|replace|vacuum|load_extension|readfile|writefile)\b/i.test(
      words,
    )
  )
    throw new Error(
      'This investigation database accepts one read-only SELECT or WITH query at a time.',
    );
  return clean;
}

function run(db, query) {
  const statement = db.prepare(query);
  const columns = statement.columns().map((column) => column.name);
  const rows = [];
  for (const row of statement.iterate()) {
    rows.push({ ...row });
    if (rows.length > 500)
      throw new Error('More than 500 rows. Narrow your query with WHERE or LIMIT.');
  }
  return { columns, rows };
}

function matches(actual, expected) {
  if (
    actual.columns.length !== expected.columns.length ||
    !expected.columns.every((c) => actual.columns.includes(c))
  )
    return false;
  const canonical = (result) =>
    result.rows.map((row) => JSON.stringify(expected.columns.map((col) => row[col]))).sort();
  return JSON.stringify(canonical(actual)) === JSON.stringify(canonical(expected));
}

export function executeQuery({ query, mission, submit = false }) {
  query = validateQuery(query);
  if (!['filter', 'join'].includes(mission)) throw new Error('Unknown investigation.');
  const expectedQuery =
    mission === 'filter'
      ? "SELECT id, customer_id FROM orders WHERE status = 'pending'"
      : "SELECT o.id AS id, c.name AS customer_name FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'pending'";
  const db = database();
  try {
    const result = run(db, query),
      correct = matches(result, run(db, expectedQuery));
    let reviewPassed = null;
    if (submit) {
      const review = database(true);
      try {
        reviewPassed = matches(run(review, query), run(review, expectedQuery));
      } finally {
        review.close();
      }
    }
    return {
      ...result,
      passed: correct && (!submit || reviewPassed),
      reviewPassed,
      runtime: 'sqlite',
    };
  } finally {
    db.close();
  }
}

if (parentPort) {
  try {
    parentPort.postMessage({ result: executeQuery(workerData) });
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}
if (process.argv.includes('--sql-child')) {
  process.once('message', (input) => {
    try {
      process.send({ result: executeQuery(input) });
    } catch (error) {
      process.send({ error: error.message });
    }
  });
}
