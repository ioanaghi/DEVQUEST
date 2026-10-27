// One display-linked frame drives every canvas and tween. Safari and native
// WebKit may suspend RAF in inactive windows; the watchdog also completes UI transitions.
const callbacks = new Map<number, FrameRequestCallback>();
let nextId = 0,
  frame = 0,
  watchdog = 0;
function flush(time: number) {
  cancelAnimationFrame(frame);
  clearTimeout(watchdog);
  frame = 0;
  watchdog = 0;
  const batch = [...callbacks.values()];
  callbacks.clear();
  for (const callback of batch) callback(time);
}
export function scheduleFrame(callback: FrameRequestCallback): number {
  const id = ++nextId;
  callbacks.set(id, callback);
  if (!frame) {
    frame = requestAnimationFrame(flush);
    watchdog = window.setTimeout(() => flush(performance.now()), document.hidden ? 100 : 34);
  }
  return id;
}
export function cancelFrame(id: number) {
  callbacks.delete(id);
  if (!callbacks.size) {
    cancelAnimationFrame(frame);
    clearTimeout(watchdog);
    frame = 0;
    watchdog = 0;
  }
}
