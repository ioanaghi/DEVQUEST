import test from 'node:test';
import assert from 'node:assert/strict';
import { damp, steer, cameraTarget, approachCamera } from '../src/game/motion.mjs';
test('motion converges without overshoot and does not reward diagonal input', () => {
  let straight = { x: 0, y: 0 },
    diagonal = { x: 0, y: 0 };
  for (let i = 0; i < 120; i++) {
    straight = steer(straight, { x: 1, y: 0 }, 1 / 60);
    diagonal = steer(diagonal, { x: 1, y: 1 }, 1 / 60);
  }
  assert.ok(Math.abs(Math.hypot(diagonal.x, diagonal.y) - straight.x) < 0.0001);
  assert.ok(straight.x <= 91);
  const stopped = Array.from({ length: 30 }).reduce(
    (v) => steer(v, { x: 0, y: 0 }, 1 / 60),
    straight,
  );
  assert.deepEqual(stopped, { x: 0, y: 0 });
});
test('damping and camera movement are independent of frame rate', () => {
  const one = damp(0, 100, 8, 1);
  let many = 0;
  for (let i = 0; i < 60; i++) many = damp(many, 100, 8, 1 / 60);
  assert.ok(Math.abs(one - many) < 0.0001);
  const target = { x: 50, y: 30 };
  const p = approachCamera({ x: 0, y: 0 }, target, 0.05);
  assert.ok(p.x > 0 && p.x < 50);
  assert.deepEqual(approachCamera({ x: 0, y: 0 }, target, 0.05, true), target);
});
test('camera stays within the map and centers oversized viewports', () => {
  assert.deepEqual(cameraTarget({ x: 630, y: 390 }, { x: 130, y: 130 }, 480, 300), {
    x: 160,
    y: 100,
  });
  assert.deepEqual(cameraTarget({ x: 5, y: 5 }, { x: -130, y: -130 }, 480, 300), { x: 0, y: 0 });
  assert.deepEqual(cameraTarget({ x: 200, y: 200 }, { x: 0, y: 0 }, 700, 460), { x: -30, y: -30 });
});
