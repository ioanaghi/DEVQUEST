import { useEffect, useRef, useState } from 'react';
import { scheduleFrame, cancelFrame } from '../game/clock';
import { useReducedMotion } from '../lib/motion';
export function DialogueText({
  text,
  label,
  onAdvance,
}: {
  text: string;
  label: string;
  onAdvance: () => void;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? text.length : 0);
  const [finished, setFinished] = useState(false);
  const advancing = useRef(false);
  const advance = useRef(onAdvance);
  advance.current = onAdvance;
  const complete = reduced || finished || count >= text.length;
  useEffect(() => {
    setCount(reduced ? text.length : 0);
    setFinished(false);
    advancing.current = false;
    if (reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const n = Math.min(text.length, Math.floor((time - start) / 19));
      setCount(n);
      if (n < text.length) frame = scheduleFrame(tick);
    };
    frame = scheduleFrame(tick);
    return () => cancelFrame(frame);
  }, [text, reduced]);
  const act = () => {
    if (!complete) setFinished(true);
    else if (!advancing.current) {
      advancing.current = true;
      advance.current();
    }
  };
  const action = useRef(act);
  action.current = act;
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey) return;
      if (['e', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        action.current();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  return (
    <>
      <p className="dialogue-line" onClick={() => !complete && setFinished(true)}>
        <span className="dialogue-measure" aria-hidden="true">
          {text}
        </span>
        <span className="dialogue-reveal" aria-hidden="true">
          {complete ? text : text.slice(0, count)}
          {!complete && <span className="type-cursor">▎</span>}
        </span>
        <span className="sr-only">{text}</span>
      </p>
      <div className="dialogue-actions">
        <span>
          <kbd>E</kbd> {complete ? 'continue' : 'reveal full line'}
        </span>
        <button className="button button-primary" onClick={act}>
          {complete ? label : 'Show full line'}
          <span aria-hidden="true">{complete ? '→' : '···'}</span>
        </button>
      </div>
    </>
  );
}
