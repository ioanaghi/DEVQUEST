import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { AvatarPreview } from './AvatarPreview';
import { DeskScene } from './DeskScene';
import { freshState, totals, quest } from '../lib/progression.mjs';
import { newDeveloper } from '../lib/save-slots.mjs';
import type { Save, SaveLibrary, Avatar } from '../types';
type Props = {
  library: SaveLibrary;
  busy: boolean;
  error: string;
  pendingImport: Save | null;
  onLoad: (index: number) => Promise<void>;
  onCreate: (index: number, save: Save) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  onCancelImport: () => void;
  onImport: (raw: unknown) => Promise<void>;
  onQuit?: () => void;
  onRetry: () => void;
  loadError: boolean;
};
export function TitleScreen({
  library,
  busy,
  error,
  pendingImport,
  onLoad,
  onCreate,
  onDelete,
  onCancelImport,
  onImport,
  onQuit,
  onRetry,
  loadError,
}: Props) {
  const [page, PAGE] = useState<'home' | 'slots' | 'create'>('home'),
    [creating, CREATE] = useState(0),
    [confirm, CONFIRM] = useState<{ index: number; action: 'new' | 'delete' | 'import' } | null>(
      null,
    ),
    [name, NAME] = useState(''),
    [avatar, AVATAR] = useState<Avatar>(freshState().avatar),
    [backup, BACKUP] = useState('');
  const selected = library.activeSlot === null ? null : library.slots[library.activeSlot];
  useEffect(() => {
    if (pendingImport) {
      PAGE('slots');
      CONFIRM(null);
    }
  }, [pendingImport]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) {
        if (confirm) CONFIRM(null);
        else if (page === 'create') PAGE('slots');
        else if (!pendingImport) PAGE('home');
      }
    };
    const nativeEscape = () => key({ key: 'Escape' } as KeyboardEvent);
    window.addEventListener('keydown', key);
    window.addEventListener('devquest:escape', nativeEscape);
    return () => {
      window.removeEventListener('keydown', key);
      window.removeEventListener('devquest:escape', nativeEscape);
    };
  }, [page, confirm, pendingImport, busy]);
  const create = (index: number) => {
    CREATE(index);
    NAME('');
    AVATAR(freshState().avatar);
    PAGE('create');
    CONFIRM(null);
  };
  const perform = async (index: number, action: 'new' | 'delete' | 'import') => {
    CONFIRM(null);
    if (action === 'new') create(index);
    else if (action === 'delete') await onDelete(index);
    else if (pendingImport) await onCreate(index, pendingImport);
  };
  const chooseNew = (index: number) => {
    const action = pendingImport ? 'import' : 'new';
    if (library.slots[index]) CONFIRM({ index, action });
    else void perform(index, action);
  };
  return (
    <main className="title-screen">
      <div className="title-office" aria-hidden="true" />
      <div className="title-grain" aria-hidden="true" />
      <header className="title-header">
        <span className="title-studio">PIXELBYTE STUDIOS</span>
        <span>OFFLINE · YOUR OWN ADVENTURE</span>
      </header>
      <div className={'title-content title-page-' + page}>
        {page === 'home' ? (
          <>
            <section className="title-intro">
              <span className="eyebrow">THE JUNIOR DEVELOPER CHRONICLES</span>
              <h1>
                DEV<span>QUEST</span>
                <i>_</i>
              </h1>
              <p>
                A new developer. A cozy office.
                <br />A whole world of small discoveries.
              </p>
              <div className="title-actions">
                <button
                  autoFocus
                  className="button button-primary"
                  disabled={busy || loadError}
                  onClick={() => PAGE('slots')}
                >
                  Start Game <span>→</span>
                </button>
                {selected && (
                  <button
                    className="button title-continue"
                    disabled={busy || loadError}
                    onClick={() => void onLoad(library.activeSlot!)}
                  >
                    Continue as {selected.save.name}
                    <small>
                      Slot {library.activeSlot! + 1} · {quest(selected.save).title}
                    </small>
                  </button>
                )}
                <button className="title-link" disabled={busy} onClick={() => PAGE('slots')}>
                  Save slots & backups
                </button>
                {onQuit && (
                  <button className="title-link" disabled={busy} onClick={onQuit}>
                    Quit game
                  </button>
                )}
              </div>
            </section>
            <aside className="title-postcard">
              <div className="title-postcard-top">
                <span>YOUR DESK IS WAITING</span>
                <span>✦</span>
              </div>
              <DeskScene avatar={selected?.save.avatar ?? avatar} />
              <p>
                No timers. No pressure.
                <br />
                Just you, figuring things out.
              </p>
              <span className="title-postcard-tape" />
            </aside>
          </>
        ) : page === 'slots' ? (
          <section className="title-slot-page">
            <button
              className="title-back"
              disabled={busy}
              onClick={() => {
                PAGE('home');
                onCancelImport();
              }}
            >
              ← Main menu
            </button>
            <span className="eyebrow">THREE STORIES. YOUR PACE.</span>
            <h1>{pendingImport ? 'Choose a slot for your backup.' : 'Choose your adventure.'}</h1>
            <p>
              {pendingImport
                ? `Importing ${pendingImport.name || 'your developer'}. Existing progress changes only after you confirm a destination.`
                : 'Continue a saved game, or start fresh with a new developer. Every slot saves automatically and independently.'}
            </p>
            <div className="save-slot-grid">
              {library.slots.map((entry, index) => {
                const stats = entry ? totals(entry.save) : null;
                return (
                  <article className={'save-slot ' + (entry ? 'occupied' : 'empty')} key={index}>
                    <div className="save-slot-heading">
                      <span>SAVE SLOT {index + 1}</span>
                      <span>
                        {entry ? (index === library.activeSlot ? 'LAST PLAYED' : 'SAVED') : 'EMPTY'}
                      </span>
                    </div>
                    {entry ? (
                      <>
                        <AvatarPreview avatar={entry.save.avatar} size={70} />
                        <h2>{entry.save.name}</h2>
                        <p className="save-slot-quest">{quest(entry.save).title}</p>
                        <p>
                          {stats!.xp} XP · {stats!.coins} dev coins
                        </p>
                        <small>Saved {new Date(entry.updatedAt).toLocaleString()}</small>
                      </>
                    ) : (
                      <>
                        <div className="empty-slot-icon" aria-hidden="true">
                          ＋
                        </div>
                        <h2>A fresh beginning</h2>
                        <p>Your first day at PixelByte starts here.</p>
                      </>
                    )}
                    <div className="save-slot-actions">
                      {entry && !pendingImport && (
                        <button
                          className="button button-primary"
                          disabled={busy || loadError}
                          onClick={() => void onLoad(index)}
                        >
                          Continue →
                        </button>
                      )}
                      <button
                        className={'button ' + (!entry ? 'button-primary' : 'button-secondary')}
                        disabled={busy || loadError}
                        onClick={() => chooseNew(index)}
                      >
                        {pendingImport
                          ? 'Import into this slot'
                          : entry
                            ? 'New game in this slot'
                            : 'New Game · Customize character'}
                      </button>
                      {entry && !pendingImport && (
                        <button
                          className="title-link slot-delete"
                          disabled={busy || loadError}
                          onClick={() => CONFIRM({ index, action: 'delete' })}
                        >
                          Reset this slot
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            {pendingImport ? (
              <button className="title-link" disabled={busy} onClick={onCancelImport}>
                Cancel import
              </button>
            ) : (
              <details className="title-backups">
                <summary>Import a saved adventure</summary>
                <p>Import an exported DEVQUEST JSON save, then choose its slot.</p>
                <label className="button button-secondary import-button">
                  Choose backup file
                  <input
                    type="file"
                    accept="application/json,.json"
                    disabled={busy || loadError}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (file) {
                        if (file.size > 524288) {
                          void onImport(null);
                          return;
                        }
                        try {
                          await onImport(JSON.parse(await file.text()));
                        } catch {
                          void onImport(null);
                        }
                      }
                    }}
                  />
                </label>
                <label className="form-label">
                  Or paste your exported save
                  <textarea
                    value={backup}
                    maxLength={524288}
                    disabled={busy}
                    onChange={(e) => BACKUP(e.target.value)}
                  />
                </label>
                <button
                  className="button"
                  disabled={busy || loadError || !backup.trim()}
                  onClick={() => {
                    try {
                      void onImport(JSON.parse(backup));
                    } catch {
                      void onImport(null);
                    }
                  }}
                >
                  Read backup
                </button>
              </details>
            )}
          </section>
        ) : (
          <section className="title-create-page">
            <button className="title-back" disabled={busy} onClick={() => PAGE('slots')}>
              ← Choose another slot
            </button>
            <span className="eyebrow">NEW GAME · SLOT {creating + 1}</span>
            <h1>Customize your character.</h1>
            <form
              className="onboarding title-customizer"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) void onCreate(creating, newDeveloper(name, avatar) as Save);
              }}
            >
              <div className="onboard-story">
                <div className="employee-badge">
                  <span className="eyebrow">PIXELBYTE · EMPLOYEE BADGE</span>
                  <AvatarPreview avatar={avatar} size={112} />
                  <strong>{name.trim() || 'Your name here'}</strong>
                  <span>Developer Intern</span>
                  <div className="badge-barcode">▌▌▌▎▌▏▎▌▌▏▎▌▏▌▌▌▏▎▌</div>
                  <small>DAY ONE. POSSIBILITY ONE.</small>
                </div>
              </div>
              <div className="onboard-fields">
                <label className="form-label">
                  What should we call you?
                  <input
                    autoFocus
                    required
                    value={name}
                    maxLength={24}
                    disabled={busy}
                    placeholder="Your developer name"
                    onChange={(e) => NAME(e.target.value)}
                  />
                </label>
                {(
                  [
                    [
                      'Pick your hoodie',
                      'shirt',
                      ['#8a82bc', '#789c89', '#cd927e', '#6f91ad', '#d4ad66'],
                    ],
                    ['Skin tone', 'skin', ['#f1c8a3', '#dca477', '#b8805c', '#8c5d46', '#634339']],
                  ] as const
                ).map(([label, key, colors]) => (
                  <fieldset key={key}>
                    <legend>{label}</legend>
                    <div className="swatches">
                      {colors.map((color) => (
                        <button
                          type="button"
                          key={color}
                          disabled={busy}
                          style={{ background: color }}
                          className={avatar[key] === color ? 'chosen' : ''}
                          aria-label={`${key === 'shirt' ? 'Hoodie' : 'Skin tone'} ${color}`}
                          aria-pressed={avatar[key] === color}
                          onClick={() => AVATAR({ ...avatar, [key]: color })}
                        >
                          {avatar[key] === color ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <fieldset>
                  <legend>Hair, your way</legend>
                  <div className="segmented">
                    {['short', 'bob', 'curly'].map((hair) => (
                      <button
                        type="button"
                        key={hair}
                        disabled={busy}
                        className={avatar.hair === hair ? 'chosen' : ''}
                        aria-pressed={avatar.hair === hair}
                        onClick={() => AVATAR({ ...avatar, hair })}
                      >
                        {hair}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={avatar.glasses}
                    disabled={busy}
                    onChange={(e) => AVATAR({ ...avatar, glasses: e.target.checked })}
                  />{' '}
                  A pair of glasses
                </label>
                <button
                  className="button button-primary onboard-submit"
                  type="submit"
                  disabled={busy || !name.trim()}
                >
                  {busy ? 'Preparing your first day…' : 'Start a new adventure →'}
                </button>
                <p className="title-save-note">
                  {library.slots[creating]
                    ? `Starting replaces only Slot ${creating + 1}. Your other slots stay safe.`
                    : 'Your character and progress will be saved in this slot.'}
                </p>
              </div>
            </form>
          </section>
        )}
      </div>
      {confirm && (
        <Modal
          title={confirm.action === 'delete' ? 'Reset this slot?' : 'Replace this adventure?'}
          subtitle={`SAVE SLOT ${confirm.index + 1}`}
          onClose={() => CONFIRM(null)}
        >
          <div className="slot-confirm">
            <p>
              This removes {library.slots[confirm.index]?.save.name}’s progress from Slot{' '}
              {confirm.index + 1}. The other two slots will stay unchanged.
            </p>
            <div className="title-actions">
              <button autoFocus className="button button-secondary" onClick={() => CONFIRM(null)}>
                Keep this save
              </button>
              <button
                className="button button-danger"
                disabled={busy}
                onClick={() => void perform(confirm.index, confirm.action)}
              >
                {confirm.action === 'delete'
                  ? 'Reset slot'
                  : confirm.action === 'import'
                    ? 'Replace with backup'
                    : 'Customize new character'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {error && (
        <div className="title-error" role="alert">
          <strong>
            {loadError ? 'Saves could not be loaded.' : 'Something needs another look.'}
          </strong>
          <p>{error}</p>
          {loadError && (
            <button className="button" onClick={onRetry}>
              Retry loading saves
            </button>
          )}
        </div>
      )}
      <footer className="title-footer">
        <span>Three local saves · No account required</span>
        <span>{busy ? 'Saving…' : 'YOUR NEXT SMALL WIN IS WAITING'} · v0.6.0</span>
      </footer>
    </main>
  );
}
