export const MAP = { width: 640, height: 400, tile: 16 };
export const OBJECTS = [
  { id: 'alex', label: 'Alex · your mentor', x: 139, y: 132, radius: 40 },
  { id: 'desk', label: 'Your workstation', x: 263, y: 194, radius: 43 },
  { id: 'sql', label: 'SQL investigation terminal', x: 557, y: 153, radius: 42 },
  { id: 'board', label: 'Training whiteboard', x: 469, y: 100, radius: 38 },
  { id: 'coffee', label: 'A very important coffee', x: 566, y: 291, radius: 40 },
  { id: 'tickets', label: 'Team noticeboard', x: 331, y: 70, radius: 38 },
  { id: 'maya', label: 'Maya · product designer', x: 451, y: 332, radius: 32 },
];
export const SOLIDS = [
  // Internal walls leave generous doorways between all three spaces.
  { x: 392, y: 56, w: 12, h: 122 },
  { x: 392, y: 228, w: 12, h: 156 },
  { x: 404, y: 242, w: 82, h: 10 },
  { x: 534, y: 242, w: 90, h: 10 },
  { x: 80, y: 91, w: 88, h: 30 },
  { x: 218, y: 147, w: 90, h: 30 },
  { x: 70, y: 226, w: 92, h: 30 },
  { x: 245, y: 267, w: 92, h: 30 },
  { x: 526, y: 105, w: 77, h: 30 },
  { x: 425, y: 178, w: 60, h: 24 },
  { x: 541, y: 262, w: 65, h: 32 },
  { x: 425, y: 351, w: 55, h: 27 },
  { x: 24, y: 62, w: 22, h: 24 },
  { x: 356, y: 342, w: 22, h: 24 },
  { x: 26, y: 334, w: 58, h: 34 },
  { x: 592, y: 351, w: 24, h: 24 },
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
  return x < 400 ? 'Developer office' : y < 248 ? 'Training room' : 'Coffee corner';
}
