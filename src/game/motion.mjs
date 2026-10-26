export function damp(from, to, rate, dt) {
  return from + (to - from) * (1 - Math.exp(-rate * Math.max(0, dt)));
}
export function steer(velocity, input, dt, sprint = false) {
  const length = Math.hypot(input.x, input.y);
  const speed = sprint ? 137 : 91;
  const rate = length ? 19 : 30;
  const x = damp(velocity.x, length ? (input.x / length) * speed : 0, rate, dt);
  const y = damp(velocity.y, length ? (input.y / length) * speed : 0, rate, dt);
  return { x: Math.abs(x) < 0.12 ? 0 : x, y: Math.abs(y) < 0.12 ? 0 : y };
}
export function cameraTarget(player, velocity, width, height) {
  const axis = (point, speed, size, map) =>
    size >= map
      ? (map - size) / 2
      : Math.max(0, Math.min(map - size, point + speed * 0.18 - size / 2));
  return {
    x: axis(player.x, velocity.x, width, 640),
    y: axis(player.y - 12, velocity.y, height, 400),
  };
}
export function approachCamera(current, target, dt, reduced = false) {
  return reduced
    ? target
    : { x: damp(current.x, target.x, 7.5, dt), y: damp(current.y, target.y, 7.5, dt) };
}
