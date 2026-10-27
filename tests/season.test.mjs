import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { judgeSeason } from '../server/season/index.mjs';
import { instrument } from '../server/season/java.mjs';
import { EPISODES, TASKS, RETENTION, starter } from '../src/lib/season-content.mjs';
import {
  completeSeason,
  seasonUnlocked,
  missionStatus,
  retentionUnlocked,
  certify,
} from '../src/lib/season.mjs';
import { freshState, restoreState, totals, quest } from '../src/lib/progression.mjs';
import { CHECKOUT_MISSIONS, completeCheckout } from '../src/lib/checkout.mjs';
import { solutions } from './fixtures/season-solutions.mjs';
function firstDay() {
  return {
    ...freshState(),
    metAlex: true,
    onboarded: true,
    completed: ['java', 'filter', 'join'],
    claimed: true,
    decoration: 'plant',
  };
}
function checkout() {
  let s = firstDay();
  for (const m of CHECKOUT_MISSIONS) s = completeCheckout(s, m.id);
  s.checkout.independent = true;
  return s;
}
for (const [task, code] of Object.entries(solutions))
  test(`${task}: real player code passes public, hidden and growth review`, async () => {
    const r = await judgeSeason({ task, code, submit: true });
    assert.equal(r.passed, true, JSON.stringify(r));
  });
test('all tasks have executable fixtures; starters cannot complete coding missions', async () => {
  assert.deepEqual(Object.keys(TASKS).sort(), Object.keys(solutions).sort());
  for (const task of [
    'sorted',
    'palindrome',
    'traffic',
    'unique',
    'brackets',
    'failing',
    'reverse',
    'files',
    'notification',
  ]) {
    const r = await judgeSeason({ task, code: starter(task), submit: true });
    assert.equal(r.passed, false, task);
  }
});
test('functional correctness alone does not pass a quadratic sorted-pair implementation', async () => {
  const code =
    'public static int[] findPairSorted(int[] a,int t){for(int i=0;i<a.length;i++){for(int j=i+1;j<a.length;j++){if(a[i]+a[j]==t)return new int[]{i,j};}}return new int[0];}';
  const r = await judgeSeason({ task: 'sorted', code, submit: true });
  assert.equal(r.reviewPassed, true);
  assert.equal(r.efficiencyPassed, false);
});
test('restricted editor denies host access, Unicode escapes, collection allocation and unmetered loops', () => {
  for (const code of [
    'System.exit(0);',
    'Runtime.getRuntime();',
    'Class.forName("x");',
    'java.io.File x;',
    '\\u0053ystem.exit(0);',
    'public static int[] findPairSorted(int[] a,int t){while(true);return new int[0];}',
  ])
    assert.throws(() => instrument(code, 'sorted'));
  assert.throws(() =>
    instrument(
      'public static int[] findPairSorted(int[] a,int t){HashMap<Integer,Integer> m=new HashMap<>();return new int[0];}',
      'sorted',
    ),
  );
  assert.throws(() =>
    instrument(
      'public static ListNode reverseList(ListNode n){return new ListNode(1);}',
      'reverse',
    ),
  );
});
test('infinite and out-of-bounds player implementations return failed cases', async () => {
  for (const code of [
    'public static int[] findPairSorted(int[] a,int t){while(true){} }',
    'public static int[] findPairSorted(int[] a,int t){return new int[]{a[90],0};}',
  ]) {
    const r = await judgeSeason({ task: 'sorted', code, submit: true });
    assert.equal(r.passed, false);
    assert.ok(r.tests.some((t) => t.error));
  }
});
test('custom tests execute independently and reject malformed inputs', async () => {
  const r = await judgeSeason({
    task: 'sorted',
    code: solutions.sorted,
    submit: true,
    custom: [
      { values: [1, 2, 3], target: 4 },
      { values: [0, 0], target: 0 },
    ],
  });
  assert.equal(r.passed, true);
  assert.equal(r.tests.length, 6);
  for (const custom of [[{ values: [3, 1], target: 4 }], [{ values: [-1, 2], target: 1 }], null])
    await assert.rejects(judgeSeason({ task: 'sorted', code: solutions.sorted, custom }));
  await assert.rejects(
    judgeSeason({ task: 'traffic', code: solutions.traffic, custom: [{ values: [1], k: 2 }] }),
  );
});
test('SQL checks retain unmatched rows, preserve multiplicity, and reject hardcoded answers', async () => {
  assert.equal(
    (
      await judgeSeason({
        task: 'missing',
        code: "SELECT 3 AS id, 'Sara' AS customer_name UNION ALL SELECT 4,'David'",
        submit: true,
      })
    ).passed,
    false,
  );
  assert.equal(
    (
      await judgeSeason({
        task: 'unpaid',
        code: 'SELECT o.id AS order_id,c.name AS customer_name FROM orders o JOIN customers c ON c.id=o.customer_id JOIN payments p ON p.order_id=o.id',
        submit: true,
      })
    ).passed,
    false,
  );
  await assert.rejects(judgeSeason({ task: 'missing', code: 'DROP TABLE customers' }));
});
test('episodes unlock in order; SQL and OOP have independent prerequisites; rewards are idempotent', () => {
  let s = freshState();
  assert.equal(seasonUnlocked(s, 'warehouse'), false);
  assert.equal(seasonUnlocked(s, 'sql2'), false);
  assert.equal(completeSeason(s, 'warehouse', 'alert'), s);
  s = firstDay();
  assert.equal(seasonUnlocked(s, 'sql2'), true);
  assert.equal(seasonUnlocked(s, 'oop'), true);
  assert.equal(seasonUnlocked(s, 'warehouse'), false);
  s = checkout();
  assert.equal(quest(s).title, 'Warehouse Alert');
  assert.equal(missionStatus(s, 'warehouse', 'code'), 'locked');
  for (const e of EPISODES) {
    assert.equal(seasonUnlocked(s, e.id), true);
    for (const m of e.missions) {
      s = completeSeason(s, e.id, m.id, true);
      assert.equal(completeSeason(s, e.id, m.id), s);
    }
  }
  const xp = 1420 + EPISODES.reduce((n, e) => n + e.missions.reduce((a, m) => a + m.xp, 0), 0);
  assert.equal(totals(s).xp, xp);
  assert.equal(quest(s).title, 'BentoCart is ready for release');
  assert.deepEqual(restoreState(JSON.stringify(s)), s);
});
test('old saves migrate and corrupted season progress is normalized', () => {
  const s = checkout(),
    old = { ...s };
  delete old.season;
  assert.deepEqual(restoreState(old).season, freshState().season);
  s.season.episodes.warehouse = {
    ...s.season.episodes.warehouse,
    completed: ['alert', 'code', 'interview'],
    independent: true,
    drafts: { palindrome: 'draft' },
    hints: { palindrome: 99 },
    answers: { 'lab-pair': 'done' },
  };
  const r = restoreState(s);
  assert.deepEqual(r.season.episodes.warehouse.completed, ['alert']);
  assert.equal(r.season.episodes.warehouse.independent, false);
  assert.equal(r.season.episodes.warehouse.hints.palindrome, 4);
  assert.equal(r.season.episodes.warehouse.drafts.palindrome, 'draft');
});
test('story completion is separate from independent readiness and later retention', () => {
  let s = checkout();
  assert.equal(retentionUnlocked(s, 'checkout'), false);
  for (const m of EPISODES[0].missions.slice(0, 3)) s = completeSeason(s, 'warehouse', m.id);
  assert.equal(retentionUnlocked(s, 'checkout'), true);
  s = certify(s, 'checkout');
  assert.equal(certify(s, 'checkout'), s);
  for (const m of EPISODES[0].missions.slice(3)) s = completeSeason(s, 'warehouse', m.id);
  assert.equal(s.season.episodes.warehouse.independent, false);
  assert.equal(retentionUnlocked(s, 'warehouse'), false);
  s = completeSeason(s, 'warehouse', 'interview', true);
  for (const m of EPISODES[1].missions.slice(0, 3)) s = completeSeason(s, 'traffic', m.id);
  assert.equal(retentionUnlocked(s, 'warehouse'), true);
  s = certify(s, 'warehouse');
  assert.equal(restoreState(s).season.mastery.warehouse, true);
});
test('native bridge executes Season 1 Java and SQL offline', () => {
  for (const task of ['palindrome', 'unpaid']) {
    const r = spawnSync(process.execPath, ['server/desktop-runner.mjs'], {
      input: JSON.stringify({
        path: '/api/season',
        payload: { task, code: solutions[task], submit: true },
      }),
      encoding: 'utf8',
      timeout: 15000,
    });
    assert.equal(r.status, 0, r.stderr);
    const result = JSON.parse(r.stdout);
    assert.equal(result.ok, true, JSON.stringify(result));
    assert.equal(result.data.passed, true);
  }
});

test('independent study completed earlier does not count as later retention practice', () => {
  let s = checkout();
  for (const id of ['sql2', 'oop'])
    for (const m of EPISODES.find((e) => e.id === id).missions)
      s = completeSeason(s, id, m.id, true);
  for (const m of EPISODES[0].missions) s = completeSeason(s, 'warehouse', m.id, true);
  assert.equal(retentionUnlocked(s, 'warehouse'), false);
  for (const m of EPISODES[1].missions.slice(0, 3)) s = completeSeason(s, 'traffic', m.id);
  assert.equal(retentionUnlocked(s, 'warehouse'), true);
});
test('Unicode palindrome review rejects char-only comparisons that discard supplementary letters', async () => {
  const code =
    'public static boolean isPalindrome(String s){int l=0,r=s.length()-1;while(l<r){char a=s.charAt(l),b=s.charAt(r);if(!Character.isLetterOrDigit(a)){l++;}else if(!Character.isLetterOrDigit(b)){r--;}else{if(Character.toLowerCase(a)!=Character.toLowerCase(b))return false;l++;r--;}}return true;}';
  const r = await judgeSeason({ task: 'palindrome', code, submit: true });
  assert.equal(r.reviewPassed, false);
});
