import test from 'node:test';
import assert from 'node:assert/strict';
import {
  freshState,
  restoreState,
  completeMission,
  totals,
  quest,
} from '../src/lib/progression.mjs';
test('first-day quests require onboarding in the correct order', () => {
  let s = freshState();
  assert.equal(quest(s).target, 'alex');
  assert.equal(completeMission(s, 'java'), s);
  s = { ...s, metAlex: true };
  assert.equal(quest(s).target, 'desk');
  assert.equal(completeMission(s, 'join'), s);
  s = completeMission(s, 'java');
  assert.equal(quest(s).target, 'sql');
  assert.equal(completeMission(s, 'join'), s);
  s = completeMission(s, 'filter');
  s = completeMission(s, 'join');
  assert.equal(quest(s).target, 'alex');
  assert.deepEqual(totals(s), { xp: 400, coins: 120 });
});
test('submitting the same task twice does not duplicate rewards', () => {
  const s = completeMission({ ...freshState(), metAlex: true }, 'java');
  assert.equal(completeMission(s, 'java'), s);
  assert.equal(totals(s).xp, 120);
});
test('save round trip preserves code, notes, hints and decorations', () => {
  const state = {
    ...freshState(),
    onboarded: true,
    name: 'Ioana',
    metAlex: true,
    completed: ['java', 'filter', 'join'],
    claimed: true,
    decoration: 'plant',
    journal: 'Test the edge.',
    hints: { java: 2, filter: 1, join: 3 },
  };
  assert.deepEqual(restoreState(JSON.stringify(state)), state);
});
test('malformed, outdated and manipulated saves recover predictably', () => {
  for (const input of ['invalid', 'null', '{}', '{"version":2}'])
    assert.deepEqual(restoreState(input), freshState());
  const state = restoreState({
    version: 1,
    completed: ['join', 'join', 'unknown'],
    claimed: true,
    decoration: 'cat',
    avatar: { skin: 'url(evil)' },
    hints: { java: -1, filter: 100, join: 'oops' },
    position: { x: NaN, y: 0 },
  });
  assert.deepEqual(state.completed, []);
  assert.equal(state.claimed, false);
  assert.equal(state.decoration, null);
  assert.deepEqual(state.hints, { java: 0, filter: 3, join: 0 });
  assert.equal(state.avatar.skin, freshState().avatar.skin);
});
