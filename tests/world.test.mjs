import test from 'node:test';
import assert from 'node:assert/strict';
import { canStand, movePlayer, nearestObject, OBJECTS, roomAt } from '../src/game/world.mjs';
test('movement stops at walls and furniture, even for a large delta', () => {
  assert.equal(canStand(4, 100), false);
  assert.equal(canStand(100, 100), false);
  assert.ok(movePlayer({ x: 370, y: 150 }, 100, 0).x < 392);
  assert.ok(movePlayer({ x: 184, y: 328 }, -400, 0).x >= 22);
});
test('every room is reachable from the entrance without crossing solids', () => {
  const queue = [{ x: 184, y: 328 }],
    visited = new Set();
  while (queue.length) {
    const p = queue.shift(),
      key = `${p.x}:${p.y}`;
    if (visited.has(key) || !canStand(p.x, p.y)) continue;
    visited.add(key);
    for (const [dx, dy] of [
      [4, 0],
      [-4, 0],
      [0, 4],
      [0, -4],
    ])
      queue.push({ x: p.x + dx, y: p.y + dy });
  }
  for (const object of OBJECTS)
    assert.ok(
      [...visited].some((key) => {
        const [x, y] = key.split(':').map(Number);
        return Math.hypot(x - object.x, y - object.y) < object.radius;
      }),
      `${object.id} is reachable`,
    );
});
test('interactions are proximity based and rooms have distinct labels', () => {
  assert.equal(nearestObject({ x: 139, y: 140 }).id, 'alex');
  assert.equal(nearestObject({ x: 184, y: 328 }), null);
  assert.equal(roomAt(100, 100), 'Developer office');
  assert.equal(roomAt(500, 100), 'Training room');
  assert.equal(roomAt(500, 300), 'Coffee corner');
});
