import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, restoreState, completeMission, totals } from '../src/lib/progression.mjs';
import {
  freshLibrary,
  restoreLibrary,
  saveToSlot,
  selectSlot,
  deleteSlot,
  newDeveloper,
  encodeLibrary,
} from '../src/lib/save-slots.mjs';
test('first boot has exactly three empty slots and no active adventure', () => {
  assert.deepEqual(restoreLibrary(null), {
    kind: 'devquest-slots',
    version: 1,
    activeSlot: null,
    slots: [null, null, null],
  });
  assert.deepEqual(restoreLibrary(freshState()), freshLibrary());
});
test('legacy single-save migration preserves all progress in slot one', () => {
  let s = newDeveloper('Ioana', freshState().avatar);
  s = { ...s, metAlex: true, journal: 'Keep my original save', javaCode: 'original draft' };
  s = completeMission(s, 'java');
  const library = restoreLibrary(JSON.stringify(s), 1000);
  assert.deepEqual(library.slots[0], { save: restoreState(s), updatedAt: 1000 });
  assert.equal(library.activeSlot, 0);
  assert.equal(library.slots[1], null);
  assert.equal(library.slots[2], null);
  assert.deepEqual(restoreLibrary(encodeLibrary(library)), library);
});
test('three avatars, notes, code and XP remain independent while switching and autosaving', () => {
  let library = freshLibrary();
  for (let i = 0; i < 3; i++) {
    const s = {
      ...newDeveloper('Developer ' + i, {
        ...freshState().avatar,
        shirt: ['#8a82bc', '#789c89', '#cd927e'][i],
      }),
      journal: 'Notes ' + i,
      javaCode: 'Draft ' + i,
    };
    library = saveToSlot(library, i, s, 1000 + i);
  }
  const before = structuredClone(library);
  library = selectSlot(library, 0);
  let s = { ...library.slots[0].save, metAlex: true };
  s = completeMission(s, 'java');
  library = saveToSlot(library, 0, s, 2000);
  assert.equal(totals(library.slots[0].save).xp, 120);
  assert.equal(totals(library.slots[1].save).xp, 0);
  assert.deepEqual(library.slots[1], before.slots[1]);
  assert.deepEqual(library.slots[2], before.slots[2]);
  library = selectSlot(library, 2);
  assert.equal(library.slots[2].save.javaCode, 'Draft 2');
  assert.equal(library.slots[2].save.journal, 'Notes 2');
  assert.deepEqual(restoreLibrary(JSON.stringify(library)), library);
});
test('reset removes only the chosen slot and empty libraries never resurrect legacy data', () => {
  let library = freshLibrary();
  for (let i = 0; i < 3; i++)
    library = saveToSlot(library, i, newDeveloper('D' + i, freshState().avatar), 100 + i);
  const before = structuredClone(library);
  library = deleteSlot(library, 1);
  assert.equal(library.slots[1], null);
  assert.deepEqual(library.slots[0], before.slots[0]);
  assert.deepEqual(library.slots[2], before.slots[2]);
  assert.equal(library.activeSlot, 2);
  library = deleteSlot(library, 2);
  assert.equal(library.activeSlot, 0);
  library = deleteSlot(library, 0);
  assert.deepEqual(restoreLibrary(JSON.stringify(library)), freshLibrary());
});
test('new games reset progression while preserving the selected custom appearance', () => {
  const avatar = { skin: '#634339', shirt: '#d4ad66', hair: 'curly', glasses: true },
    s = newDeveloper('  Fresh developer  ', avatar);
  assert.equal(s.name, 'Fresh developer');
  assert.equal(s.onboarded, true);
  assert.deepEqual(s.avatar, avatar);
  assert.equal(s.metAlex, false);
  assert.deepEqual(s.completed, []);
  assert.equal(totals(s).xp, 0);
  assert.equal(s.season.episodes.warehouse.completed.length, 0);
});
test('replacement and backup import change only their explicit destination', () => {
  let library = saveToSlot(freshLibrary(), 0, newDeveloper('Original', freshState().avatar), 10);
  library = saveToSlot(library, 1, newDeveloper('Second', freshState().avatar), 20);
  const second = structuredClone(library.slots[1]);
  const imported = {
    ...newDeveloper('Backup', freshState().avatar),
    journal: 'Imported notes',
    javaCode: 'Imported code',
  };
  library = saveToSlot(library, 0, imported, 30);
  assert.deepEqual(library.slots[1], second);
  assert.equal(library.slots[0].save.journal, 'Imported notes');
});
test('invalid library files and slot IDs fail without altering the input', () => {
  const library = freshLibrary(),
    copy = structuredClone(library);
  for (const index of [-1, 3, 1.5, '0', null]) {
    assert.throws(() => saveToSlot(library, index, newDeveloper('A', freshState().avatar)));
    assert.throws(() => deleteSlot(library, index));
  }
  assert.throws(() => selectSlot(library, 0));
  assert.throws(() => saveToSlot(library, 0, freshState()));
  assert.deepEqual(library, copy);
  for (const raw of [
    'broken',
    'null',
    { kind: 'devquest-slots', version: 2, slots: [null, null, null] },
    { kind: 'devquest-slots', version: 1, slots: [null] },
    { kind: 'devquest-slots', version: 1, slots: [{ save: { version: 1 } }, null, null] },
  ])
    assert.throws(() => restoreLibrary(raw));
});
test('untrusted saves are normalized and timestamps recover without changing progress', () => {
  const s = newDeveloper('A', freshState().avatar);
  s.completed = ['join'];
  s.claimed = true;
  const library = restoreLibrary(
    {
      kind: 'devquest-slots',
      version: 1,
      activeSlot: 9,
      slots: [null, { save: s, updatedAt: 'bad' }, null],
    },
    1234,
  );
  assert.equal(library.activeSlot, 1);
  assert.equal(library.slots[1].updatedAt, 1234);
  assert.deepEqual(library.slots[1].save.completed, []);
  assert.equal(library.slots[1].save.claimed, false);
});
