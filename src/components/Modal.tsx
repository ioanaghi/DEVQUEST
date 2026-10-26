import { useEffect, useRef } from 'react';
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
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const dialog = ref.current!;
    const active = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const cancel = (e: Event) => {
      e.preventDefault();
      if (dismissible) close.current();
    };
    dialog.addEventListener('cancel', cancel);
    return () => {
      dialog.removeEventListener('cancel', cancel);
      dialog.close();
      active?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal modal-${variant} ${wide ? 'modal-wide' : ''}`}
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-top">
        <div>
          <span className="eyebrow">{subtitle ?? 'YOUR FIRST DAY'}</span>
          <h2 id="modal-title">{title}</h2>
        </div>
        {dismissible && (
          <button className="icon-button close-button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        )}
      </div>
      {children}
    </dialog>
  );
}
