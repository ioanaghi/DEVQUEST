import test from 'node:test';
import assert from 'node:assert/strict';
import { compilePractice, judgePractice } from '../server/practice-java.mjs';
const method = (expression) =>
  `public static boolean canRegister(int age) { return ${expression}; }`;

test('the original bug fails exactly at the boundary', () => {
  const result = judgePractice(method('age > 18'));
  assert.deepEqual(
    result.tests.map((t) => t.actual === t.expected),
    [true, false, true],
  );
  assert.equal(result.passed, false);
});
test('inclusive comparisons pass samples and independent review', () => {
  for (const expression of [
    'age >= 18',
    '18 <= age',
    '!(age < 18)',
    'age > 17',
    '(age >= 18) && true',
  ])
    assert.equal(judgePractice(method(expression), true).passed, true, expression);
});
test('review catches solutions that only satisfy the samples', () => {
  const code = method('age == 18 || age == 19');
  assert.equal(judgePractice(code).passed, true);
  assert.equal(judgePractice(code, true).passed, false);
});
test('parser respects precedence, short-circuit and Java integer arithmetic', () => {
  assert.equal(compilePractice(method('age > 17 && age < 100 || age == 200'))(200), true);
  assert.equal(compilePractice(method('true || 1 / 0 > 1'))(0), true);
  assert.equal(compilePractice(method('age / 2 == -1'))(-3), true);
  assert.equal(compilePractice(method('age + 1 < 0'))(2147483647), true);
  assert.throws(() => compilePractice(method('age / 0 > 0'))(18), /zero/);
});
test('rejects malformed, unsupported, untyped or executable input', () => {
  for (const expression of [
    'age >= 18); process.exit(); (true',
    'age >= 18 ? true : false',
    'age >= 18 garbage',
    'age',
    'age && true',
    'true > false',
    'age >= 18 +',
    '((((age > 18)',
    'false && (true + false)',
    'globalThis',
    'age >= 18; return true',
  ])
    assert.throws(() => compilePractice(method(expression)), undefined, expression);
  assert.throws(
    () => compilePractice(method('('.repeat(100) + 'age >= 18' + ')'.repeat(100))),
    /nested|numbers/,
  );
  assert.throws(() => compilePractice('x'.repeat(4001)), /4,000/);
});
