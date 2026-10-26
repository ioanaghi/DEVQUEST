type NativeReply = { ok: boolean; data?: unknown; error?: string };
declare global {
  interface Window {
    webkit?: { messageHandlers?: { devquest?: { postMessage: (message: unknown) => void } } };
    __devquestReply?: (id: string, reply: NativeReply) => void;
  }
}
export const isDesktop = !!window.webkit?.messageHandlers?.devquest;
const pending = new Map<
  string,
  { resolve: (value: any) => void; reject: (reason: Error) => void; timer: number }
>();
window.__devquestReply = (id, reply) => {
  const request = pending.get(id);
  if (!request) return;
  clearTimeout(request.timer);
  pending.delete(id);
  if (reply.ok) request.resolve(reply.data);
  else request.reject(new Error(reply.error ?? 'The desktop operation failed.'));
};
export async function request(path: string, payload: Record<string, unknown> = {}): Promise<any> {
  if (isDesktop) {
    const id =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        pending.delete(id);
        reject(new Error('The desktop runtime took too long. Please try again.'));
      }, 22000);
      pending.set(id, { resolve, reject, timer });
      window.webkit!.messageHandlers!.devquest!.postMessage({ id, path, payload });
    });
  }
  const res = await fetch(path, {
    method: path === '/api/health' ? 'GET' : 'POST',
    ...(path === '/api/health'
      ? {}
      : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    signal: AbortSignal.timeout(20000),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'The local runner is unavailable.');
  return data;
}
