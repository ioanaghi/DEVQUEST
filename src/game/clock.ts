import { isDesktop } from '../lib/platform';

// The native host also needs frames while WebKit's display-linked animation
// callbacks are suspended. A capped timer keeps the desktop canvas responsive.
export function scheduleFrame(callback: FrameRequestCallback): number {
  return isDesktop
    ? window.setTimeout(() => callback(performance.now()), 33)
    : requestAnimationFrame(callback);
}
export function cancelFrame(id: number) {
  if (isDesktop) window.clearTimeout(id);
  else cancelAnimationFrame(id);
}
