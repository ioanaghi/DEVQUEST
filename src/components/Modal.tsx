import { useEffect, useId, useRef } from 'react';
import { motionReduced } from '../lib/motion';
import { scheduleFrame, cancelFrame } from '../game/clock';
const stack: HTMLDialogElement[] = [];
export function requestOverlayClose() {
  window.dispatchEvent(new Event('devquest:close-overlay'));
}
export function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
  variant = 'panel',
  dismissible = true,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  variant?: 'panel' | 'pause' | 'dialogue' | 'workspace' | 'onboarding';
  dismissible?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    close = useRef(onClose),
    leaving = useRef(false),
    frame = useRef(0);
  const headingId = useId();
  close.current = onClose;
  function transition(open: boolean, done?: () => void) {
    const dialog = ref.current!;
    cancelFrame(frame.current);
    const duration = motionReduced() ? 0 : open ? 280 : 135,
      start = performance.now();
    const tick = (time: number) => {
      const amount = duration === 0 ? 1 : Math.min(1, (time - start) / duration);
      const eased = open ? 1 - Math.pow(1 - amount, 3) : amount * amount;
      const visible = open ? eased : 1 - eased;
      dialog.style.opacity = String(visible);
      dialog.style.transform = `translateY(${(1 - visible) * (variant === 'dialogue' ? 17 : 10)}px) scale(${variant === 'dialogue' ? 1 : 0.98 + visible * 0.02})`;
      dialog.style.setProperty('--overlay-visibility', String(visible));
      if (amount < 1) frame.current = scheduleFrame(tick);
      else {
        dialog.style.transform = '';
        dialog.style.opacity = open ? '' : '0';
        done?.();
      }
    };
    tick(start);
  }
  const animateClose = () => {
    if (!dismissible || leaving.current) return;
    leaving.current = true;
    ref.current!.dataset.leaving = 'true';
    transition(false, () => close.current());
  };
  const requestClose = useRef(animateClose);
  requestClose.current = animateClose;
  useEffect(() => {
    const dialog = ref.current!,
      active = document.activeElement as HTMLElement | null;
    dialog.showModal();
    stack.push(dialog);
    leaving.current = false;
    delete dialog.dataset.leaving;
    transition(true);
    const primary =
      variant === 'pause' ? dialog.querySelector<HTMLButtonElement>('.resume-button') : null;
    if (primary) primary.focus({ preventScroll: true });
    else dialog.focus({ preventScroll: true });
    const cancel = (event: Event) => {
      event.preventDefault();
      requestClose.current();
    };
    const escape = () => {
      if (stack.at(-1) === dialog) requestClose.current();
    };
    dialog.addEventListener('cancel', cancel);
    window.addEventListener('devquest:close-overlay', escape);
    return () => {
      cancelFrame(frame.current);
      dialog.removeEventListener('cancel', cancel);
      window.removeEventListener('devquest:close-overlay', escape);
      const index = stack.indexOf(dialog);
      if (index >= 0) stack.splice(index, 1);
      dialog.close();
      if (active?.isConnected) active.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      className={`modal modal-${variant} ${wide ? 'modal-wide' : ''}`}
      aria-labelledby={headingId}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.target === event.currentTarget &&
          (event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom)
        )
          requestClose.current();
      }}
    >
      <div className="modal-top">
        <div>
          <span className="eyebrow">{subtitle ?? 'YOUR FIRST DAY'}</span>
          <h2 id={headingId}>{title}</h2>
        </div>
        {dismissible && (
          <button
            className="icon-button close-button"
            onClick={() => requestClose.current()}
            aria-label="Close dialog"
          >
            ×<span className="close-key">ESC</span>
          </button>
        )}
      </div>
      {children}
    </dialog>
  );
}
