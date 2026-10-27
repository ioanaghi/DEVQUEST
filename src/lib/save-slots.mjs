import { freshState, restoreState, SAVE_KEY } from './progression.mjs';
export const SLOT_KEY = 'devquest.slots.v1';
export const SLOT_COUNT = 3;
export const LEGACY_KEY = SAVE_KEY;
export const MAX_LIBRARY_BYTES = 1600000;
export function freshLibrary() {
  return { kind: 'devquest-slots', version: 1, activeSlot: null, slots: [null, null, null] };
}
function validIndex(index) {
  if (!Number.isInteger(index) || index < 0 || index >= SLOT_COUNT)
    throw new Error('Choose one of the three save slots.');
}
export function validateSave(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== 1 || typeof raw.onboarded !== 'boolean')
    throw new Error('This is not a valid DEVQUEST save.');
  return restoreState(raw);
}
export function restoreLibrary(raw, now = Date.now()) {
  if (raw === null || raw === undefined) return freshLibrary();
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (data === null)
    throw new Error('The save-slot library is empty or damaged. Your files have been preserved.');
  if (data.kind !== 'devquest-slots') {
    const save = validateSave(data),
      library = freshLibrary();
    if (save.onboarded) {
      library.slots[0] = { save, updatedAt: now };
      library.activeSlot = 0;
    }
    return library;
  }
  if (data.version !== 1 || !Array.isArray(data.slots) || data.slots.length !== 3)
    throw new Error('The save-slot library is invalid. Your files have been preserved.');
  const slots = data.slots.map((entry) => {
    if (entry === null) return null;
    if (!entry || typeof entry !== 'object')
      throw new Error('A save slot is damaged. Your files have been preserved.');
    const save = validateSave(entry.save);
    if (!save.onboarded)
      throw new Error('A save slot has an unfinished character. Your files have been preserved.');
    return {
      save,
      updatedAt:
        Number.isSafeInteger(entry.updatedAt) && entry.updatedAt >= 0 ? entry.updatedAt : now,
    };
  });
  const activeSlot =
    Number.isInteger(data.activeSlot) &&
    data.activeSlot >= 0 &&
    data.activeSlot < 3 &&
    slots[data.activeSlot]
      ? data.activeSlot
      : slots.findIndex(Boolean);
  return {
    kind: 'devquest-slots',
    version: 1,
    slots,
    activeSlot: activeSlot < 0 ? null : activeSlot,
  };
}
export function saveToSlot(library, index, save, now = Date.now()) {
  validIndex(index);
  save = validateSave(save);
  if (!save.onboarded) throw new Error('Finish creating your developer before starting.');
  return {
    ...library,
    activeSlot: index,
    slots: library.slots.map((entry, i) => (i === index ? { save, updatedAt: now } : entry)),
  };
}
export function selectSlot(library, index) {
  validIndex(index);
  if (!library.slots[index]) throw new Error('This slot is empty. Start a new game here.');
  return { ...library, activeSlot: index };
}
export function deleteSlot(library, index) {
  validIndex(index);
  const slots = library.slots.map((entry, i) => (i === index ? null : entry));
  const next = slots.findIndex(Boolean);
  return {
    ...library,
    slots,
    activeSlot: library.activeSlot === index ? (next < 0 ? null : next) : library.activeSlot,
  };
}
export function newDeveloper(name, avatar) {
  const s = freshState();
  return {
    ...s,
    name: typeof name === 'string' ? name.trim().slice(0, 24) || 'New developer' : 'New developer',
    avatar: restoreState({ ...s, avatar }).avatar,
    onboarded: true,
  };
}
export function encodeLibrary(library) {
  const text = JSON.stringify(library);
  if (new TextEncoder().encode(text).length > MAX_LIBRARY_BYTES)
    throw new Error('Your save library is too large. Export a backup.');
  return text;
}
