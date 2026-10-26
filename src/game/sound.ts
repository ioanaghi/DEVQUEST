let context: AudioContext | null = null;
let enabled = false;
let lastClick = 0;
export function setSoundEnabled(value: boolean) {
  enabled = value;
}
function unlock() {
  if (!enabled) return;
  try {
    context ??= new AudioContext();
    void context.resume();
  } catch {}
}
window.addEventListener('pointerdown', unlock, { passive: true });
window.addEventListener('keydown', unlock, { passive: true });
export function cue(kind: 'step' | 'click' | 'reward') {
  if (!enabled || !context || context.state !== 'running') return;
  const now = context.currentTime;
  if (kind === 'click' && now - lastClick < 0.065) return;
  if (kind === 'click') lastClick = now;
  const notes =
    kind === 'reward' ? [523.25, 659.25, 783.99, 1046.5] : kind === 'step' ? [95] : [470];
  notes.forEach((frequency, i) => {
    const osc = context!.createOscillator(),
      gain = context!.createGain();
    const start = now + i * 0.095;
    osc.type = kind === 'step' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(frequency, start);
    if (kind === 'click') osc.frequency.exponentialRampToValueAtTime(680, start + 0.045);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(
      kind === 'step' ? 0.013 : kind === 'reward' ? 0.045 : 0.019,
      start + 0.009,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === 'reward' ? 0.32 : 0.08));
    osc.connect(gain);
    gain.connect(context!.destination);
    osc.start(start);
    osc.stop(start + (kind === 'reward' ? 0.34 : 0.09));
  });
}
document.addEventListener('click', (event) => {
  if ((event.target as HTMLElement)?.closest?.('button:not(:disabled)')) cue('click');
});
