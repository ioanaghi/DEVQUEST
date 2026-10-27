export const MAP = { width: 640, height: 400, tile: 16 };
export const OBJECTS = [
  { id: 'max', label: 'Max · warehouse engineer', x: 95, y: 185, radius: 30 },
  { id: 'theo', label: 'Theo · site reliability engineer', x: 360, y: 225, radius: 28 },
  { id: 'lia', label: 'Lia · frontend developer', x: 105, y: 298, radius: 28 },
  { id: 'iris', label: 'Iris · backend engineer', x: 510, y: 153, radius: 28 },
  { id: 'victor', label: 'Victor · software architect', x: 350, y: 120, radius: 28 },
  { id: 'alex', label: 'Alex · your mentor', x: 150, y: 137, radius: 40 },
  { id: 'desk', label: 'Your workstation', x: 270, y: 183, radius: 43 },
  { id: 'sql', label: 'SQL investigation terminal', x: 557, y: 153, radius: 42 },
  { id: 'board', label: 'Training whiteboard', x: 469, y: 100, radius: 38 },
  { id: 'coffee', label: 'A very important coffee', x: 566, y: 291, radius: 40 },
  { id: 'tickets', label: 'Team noticeboard', x: 331, y: 70, radius: 38 },
  { id: 'nora', label: 'Nora · product manager', x: 168, y: 267, radius: 32 },
  { id: 'eva', label: 'Eva · interview table', x: 346, y: 302, radius: 30 },
  { id: 'maya', label: 'Maya · QA engineer', x: 451, y: 332, radius: 32 },
];
// Collision footprints are aligned with the final illustrated environment.
export const SOLIDS = [
  ...[
    { x: 95, y: 185 },
    { x: 360, y: 225 },
    { x: 105, y: 298 },
    { x: 510, y: 153 },
    { x: 350, y: 120 },
  ].map((p) => ({ x: p.x - 6, y: p.y - 8, w: 12, h: 9 })),
  // Colleagues occupy a small footprint, so saved/player sprites cannot overlap them.
  { x: 143, y: 129, w: 14, h: 10 },
  { x: 444, y: 324, w: 14, h: 10 },
  { x: 162, y: 259, w: 12, h: 10 },
  { x: 340, y: 294, w: 12, h: 10 },
  { x: 389, y: 35, w: 12, h: 141 },
  { x: 389, y: 216, w: 12, h: 164 },
  { x: 401, y: 232, w: 77, h: 11 },
  { x: 526, y: 232, w: 99, h: 11 },
  { x: 76, y: 83, w: 90, h: 35 },
  { x: 224, y: 126, w: 91, h: 42 },
  { x: 71, y: 218, w: 91, h: 36 },
  { x: 245, y: 249, w: 88, h: 41 },
  { x: 525, y: 90, w: 78, h: 41 },
  { x: 421, y: 173, w: 74, h: 33 },
  { x: 540, y: 247, w: 72, h: 41 },
  { x: 445, y: 285, w: 65, h: 38 },
  { x: 417, y: 356, w: 61, h: 24 },
  { x: 22, y: 62, w: 18, h: 20 },
  { x: 353, y: 346, w: 25, h: 27 },
  { x: 19, y: 313, w: 64, h: 55 },
  { x: 591, y: 339, w: 28, h: 34 },
  { x: 599, y: 172, w: 23, h: 50 },
];
export function canStand(x, y) {
  return (
    x >= 22 &&
    x <= 618 &&
    y >= 64 &&
    y <= 381 &&
    !SOLIDS.some((r) => x + 6 > r.x && x - 6 < r.x + r.w && y > r.y && y - 8 < r.y + r.h)
  );
}
export function movePlayer(player, dx, dy) {
  const length = Math.hypot(dx, dy);
  if (!length) return player;
  const steps = Math.max(1, Math.ceil(length / 4));
  let { x, y } = player;
  for (let i = 0; i < steps; i++) {
    if (canStand(x + dx / steps, y)) x += dx / steps;
    if (canStand(x, y + dy / steps)) y += dy / steps;
  }
  return { x, y };
}
export function nearestObject(player) {
  return (
    OBJECTS.map((object) => ({
      ...object,
      distance: Math.hypot(player.x - object.x, player.y - object.y),
    }))
      .filter((object) => object.distance < object.radius)
      .sort((a, b) => a.distance - b.distance)[0] ?? null
  );
}
export function roomAt(x, y) {
  return x < 401 ? 'Developer office' : y < 243 ? 'Training room' : 'Coffee corner';
}
