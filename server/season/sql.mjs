import { DatabaseSync } from 'node:sqlite';
import { validateQuery } from '../sql-worker.mjs';
const expected = {
  customers: 'SELECT id,name FROM customers ORDER BY id',
  leftjoin:
    'SELECT c.name AS customer_name,o.id AS order_id FROM customers c LEFT JOIN orders o ON c.id=o.customer_id',
  missing:
    'SELECT c.id AS id,c.name AS customer_name FROM customers c LEFT JOIN orders o ON c.id=o.customer_id WHERE o.id IS NULL',
  unpaid:
    'SELECT o.id AS order_id,c.name AS customer_name FROM orders o JOIN customers c ON c.id=o.customer_id LEFT JOIN payments p ON p.order_id=o.id WHERE p.id IS NULL',
  unpaidcustomers:
    'SELECT DISTINCT c.id AS id,c.name AS customer_name FROM customers c JOIN orders o ON o.customer_id=c.id LEFT JOIN payments p ON p.order_id=o.id WHERE p.id IS NULL',
};
export function seasonDatabase(variant = 0) {
  const db = new DatabaseSync(':memory:');
  db.exec(
    `CREATE TABLE customers(id INTEGER PRIMARY KEY,name TEXT NOT NULL); CREATE TABLE orders(id INTEGER PRIMARY KEY,customer_id INTEGER NOT NULL REFERENCES customers(id)); CREATE TABLE payments(id INTEGER PRIMARY KEY,order_id INTEGER NOT NULL REFERENCES orders(id),amount INTEGER NOT NULL);`,
  );
  if (variant === 0)
    db.exec(
      `INSERT INTO customers VALUES(1,'Ana'),(2,'Mihai'),(3,'Sara'),(4,'David'); INSERT INTO orders VALUES(101,1),(102,2),(103,2); INSERT INTO payments VALUES(201,101,250),(202,103,500),(203,103,100);`,
    );
  else if (variant === 1)
    db.exec(
      `INSERT INTO customers VALUES(11,'Jun'),(12,'Ravi'),(13,'Amina'),(14,'Elena'),(15,'Sam'); INSERT INTO orders VALUES(401,12),(402,12),(403,14),(404,14),(405,15); INSERT INTO payments VALUES(501,401,100),(502,401,200),(503,404,400);`,
    );
  else
    db.exec(
      `INSERT INTO customers VALUES(21,'No Orders'),(22,'All Paid'),(23,'Two Unpaid'); INSERT INTO orders VALUES(601,22),(602,23),(603,23); INSERT INTO payments VALUES(701,601,0);`,
    );
  db.exec('PRAGMA query_only=ON');
  return db;
}
function run(db, query) {
  const st = db.prepare(validateQuery(query)),
    columns = st.columns().map((c) => c.name),
    rows = [];
  for (const r of st.iterate()) {
    rows.push({ ...r });
    if (rows.length > 500) throw new Error('Limit the result to 500 rows.');
  }
  return { columns, rows };
}
function matches(a, b, ordered) {
  if (a.columns.length !== b.columns.length || !b.columns.every((c) => a.columns.includes(c)))
    return false;
  const canonical = (r) => r.rows.map((row) => JSON.stringify(b.columns.map((c) => row[c])));
  const x = canonical(a),
    y = canonical(b);
  if (!ordered) {
    x.sort();
    y.sort();
  }
  return JSON.stringify(x) === JSON.stringify(y);
}
export function executeSeasonSql({ task, code, submit = false, custom = [] }) {
  if (!expected[task]) throw new Error('Unknown SQL exercise.');
  if (
    !Array.isArray(custom) ||
    custom.length > 2 ||
    !custom.every((q) => typeof q === 'string' && q.length <= 6000)
  )
    throw new Error('Custom SQL tests must be two query strings.');
  const checks = [];
  let result;
  for (const variant of submit ? [0, 1, 2] : [0]) {
    const db = seasonDatabase(variant);
    try {
      const want = run(db, expected[task]),
        got = run(db, code);
      if (variant === 0) result = got;
      checks.push({
        name: variant === 0 ? 'Support database' : 'Review database ' + variant,
        passed: matches(got, want, task === 'customers'),
      });
      for (const [i, q] of custom.entries())
        checks.push({
          name: `Your SQL test ${i + 1} · dataset ${variant + 1}`,
          passed: matches(run(db, q), want, task === 'customers'),
        });
    } finally {
      db.close();
    }
  }
  return {
    ...result,
    tests: checks.filter((t) => !t.name.startsWith('Review')),
    reviewPassed: submit ? checks.every((t) => t.passed) : null,
    efficiencyPassed: submit ? true : null,
    passed: checks.every((t) => t.passed),
    runtime: 'sqlite',
  };
}
