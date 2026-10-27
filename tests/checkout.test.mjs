import test from 'node:test';
import assert from 'node:assert/strict';
import { compilePair, judgePair } from '../server/pair-java.mjs';
import { CHECKOUT_MISSIONS, completeCheckout, checkoutStatus } from '../src/lib/checkout.mjs';
import { freshState, restoreState, totals, quest } from '../src/lib/progression.mjs';
import { spawnSync } from 'node:child_process';

const brute = `public static int[] findPair(int[] vouchers, int target) {
  for (int i = 0; i < vouchers.length; i++) {
    for (int j = i + 1; j < vouchers.length; j++) {
      if (vouchers[i] + vouchers[j] == target) return new int[] {i, j};
    }
  }
  return new int[0];
}`;
const optimized = `public static int[] findPair(int[] vouchers, int target) {
  HashMap<Integer, Integer> seen = new HashMap<>();
  for (int i = 0; i < vouchers.length; i++) {
    int complement = target - vouchers[i];
    if (seen.containsKey(complement)) {
      return new int[] {seen.get(complement), i};
    }
    seen.put(vouchers[i], i);
  }
  return new int[0];
}`;
test('both valid approaches pass functional review; only map solution passes growth checks', () => {
  assert.equal(judgePair({ code: brute, submit: true }).passed, true);
  const slow = judgePair({ code: brute, submit: true, optimized: true });
  assert.equal(slow.reviewPassed, true);
  assert.equal(slow.efficiencyPassed, false);
  const fast = judgePair({ code: optimized, submit: true, optimized: true });
  assert.equal(fast.passed, true);
  assert.equal(fast.efficiencyPassed, true);
  assert.equal(
    judgePair({
      code: optimized.replaceAll('vouchers', 'transactions'),
      submit: true,
      optimized: true,
      interview: true,
    }).passed,
    true,
  );
});
test('judge accepts any valid pair but rejects self-pairs, hardcoding and premature no-match', () => {
  assert.equal(
    judgePair({
      code: 'public static int[] findPair(int[] a, int t) { return new int[] {0, 2}; }',
      submit: true,
    }).passed,
    false,
  );
  const reused = optimized.replace(
    '    int complement',
    '    seen.put(vouchers[i], i);\n    int complement',
  );
  assert.equal(judgePair({ code: reused, submit: true }).passed, false);
  assert.equal(
    judgePair({
      code: optimized.replace('    seen.put(vouchers[i], i);', '    return new int[0];'),
      submit: true,
    }).passed,
    false,
  );
  const fn = compilePair(optimized);
  assert.deepEqual(fn([20, 45, 80, 55], 100).value, [0, 2]);
  assert.deepEqual(fn([50, 50], 100).value, [0, 1]);
  assert.deepEqual(fn([50], 100).value, []);
});
test('bounded Java reports unsafe/unsupported syntax, type errors, indexing errors and infinite loops', () => {
  assert.throws(() => compilePair('process.exit()'), /Expected|Unsupported/);
  assert.throws(
    () => compilePair('public static int[] findPair(int[] a, int t) { return System.exit(0); }'),
    /Supported map/,
  );
  const infinite = compilePair(
    'public static int[] findPair(int[] a, int t) { for (int i = 0; i < 1; i = 0) { int x = 1; } return new int[0]; }',
  );
  assert.throws(() => infinite([], 0, 2000), /Operation limit/);
  assert.throws(
    () =>
      compilePair('public static int[] findPair(int[] a, int t) { return new int[] {a[2], 0}; }')(
        [],
        0,
      ),
    /out of bounds/,
  );
  assert.throws(
    () =>
      compilePair(
        'public static int[] findPair(int[] a, int t) { if (1) return new int[0]; return new int[0]; }',
      )([], 0),
    /boolean/,
  );
});
test('custom QA tests are executed and validated', () => {
  const r = judgePair({
    code: optimized,
    submit: true,
    optimized: true,
    custom: [
      { values: [0, 0], target: 0 },
      { values: [-20, 120], target: 100 },
    ],
  });
  assert.equal(r.tests.length, 6);
  assert.equal(r.passed, true);
  for (const custom of [
    null,
    [{ values: [NaN], target: 1 }],
    [{ values: [], target: '100' }],
    Array(6).fill({ values: [], target: 1 }),
  ])
    assert.throws(() => judgePair({ code: optimized, custom }), /Custom tests/);
});
test('checkout missions unlock in order after the desk gift and rewards cannot duplicate', () => {
  let s = freshState();
  assert.equal(completeCheckout(s, 'incident'), s);
  s = {
    ...s,
    metAlex: true,
    completed: ['java', 'filter', 'join'],
    claimed: true,
    decoration: 'plant',
  };
  assert.equal(quest(s).target, 'nora');
  assert.equal(checkoutStatus(s, 'interview'), 'locked');
  assert.equal(completeCheckout(s, 'lab'), s);
  s.checkout.drafts.brute = brute;
  for (const m of CHECKOUT_MISSIONS) {
    s = completeCheckout(s, m.id);
    assert.equal(completeCheckout(s, m.id), s);
  }
  assert.equal(s.checkout.drafts.optimize, brute);
  assert.deepEqual(totals(s), { xp: 1420, coins: 120 });
  assert.equal(quest(s).label, 'THE WAREHOUSE MIX-UP');
});
test('old saves migrate; checkout saves preserve drafts, hints and ordered progress', () => {
  let s = {
    ...freshState(),
    metAlex: true,
    completed: ['java', 'filter', 'join'],
    claimed: true,
    decoration: 'cat',
  };
  const old = { ...s };
  delete old.checkout;
  assert.deepEqual(restoreState(old).checkout, freshState().checkout);
  s = completeCheckout(s, 'incident');
  s.checkout.drafts.optimize = optimized;
  s.checkout.hints.interview = 2;
  s.checkout.answers = { index: '1' };
  assert.deepEqual(restoreState(JSON.stringify(s)), s);
  const corrupt = restoreState({
    ...s,
    checkout: {
      ...s.checkout,
      completed: ['incident', 'lab', 'interview'],
      independent: true,
      hints: { interview: 99 },
      phase: 99,
    },
  });
  assert.deepEqual(corrupt.checkout.completed, ['incident']);
  assert.equal(corrupt.checkout.independent, false);
  assert.equal(corrupt.checkout.hints.interview, 4);
  assert.equal(corrupt.checkout.phase, 4);
  assert.deepEqual(restoreState({ ...s, claimed: false }).checkout.completed, []);
});
test('desktop bridge executes checkout submissions offline', () => {
  const child = spawnSync(process.execPath, ['server/desktop-runner.mjs'], {
    input: JSON.stringify({
      path: '/api/pair',
      payload: { code: optimized, submit: true, optimized: true },
    }),
    encoding: 'utf8',
  });
  const reply = JSON.parse(child.stdout);
  assert.equal(reply.ok, true);
  assert.equal(reply.data.passed, true);
});
