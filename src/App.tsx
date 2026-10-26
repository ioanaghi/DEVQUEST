import { useCallback, useEffect, useRef, useState } from 'react';
import { GameWorld } from './game/GameWorld';
import { AvatarPreview } from './components/AvatarPreview';
import { Modal } from './components/Modal';
import { Workspace } from './components/Workspace';
import { GameIcon } from './components/GameIcon';
import { OBJECTS, SOLIDS } from './game/world.mjs';
import {
  freshState,
  restoreState,
  SAVE_KEY,
  completeMission,
  totals,
  quest,
} from './lib/progression.mjs';
import { CHAPTERS } from './lib/content';
import type { Interactive, Mission, Panel, Save } from './types';
import { isDesktop, request } from './lib/platform';

type Dialogue = {
  title: string;
  speaker: string;
  text: string[];
  action?: string;
  finish?: () => void;
};
function initialSave(): Save {
  try {
    return restoreState(localStorage.getItem(SAVE_KEY)) as Save;
  } catch {
    return freshState() as Save;
  }
}

export default function App() {
  const [save, setSave] = useState<Save>(initialSave);
  const [ready, setReady] = useState(!isDesktop);
  const [session, setSession] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [dialoguePage, setDialoguePage] = useState(0);
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [runtime, setRuntime] = useState('practice');
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'offline'>('checking');
  const [celebration, setCelebration] = useState(0);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [draftName, setDraftName] = useState(save.name);
  const [fullScreen, setFullScreen] = useState(isDesktop);
  const [questCollapsed, setQuestCollapsed] = useState(false);
  const progress = totals(save),
    active = quest(save),
    finished = save.completed.length === 3;
  const toastTimer = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      if (isDesktop) {
        void request('/api/save/store', { save })
          .then(() => setStorageError(false))
          .catch(() => setStorageError(true));
      } else {
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(save));
          setStorageError(false);
        } catch {
          setStorageError(true);
        }
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [save, ready]);
  useEffect(() => {
    const flush = () => {
      if (!ready) return;
      if (isDesktop) {
        void request('/api/save/store', { save }).catch(() => {});
      } else {
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(save));
        } catch {}
      }
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [save, ready]);
  useEffect(() => {
    let active = true;
    void request('/api/health')
      .then((data) => {
        if (active) {
          setRuntime(data.javaRuntime);
          setApiStatus('ready');
        }
      })
      .catch(() => {
        if (active) setApiStatus('offline');
      });
    if (isDesktop) {
      void request('/api/app/state')
        .then((state) => {
          if (active) setFullScreen(state.fullscreen);
        })
        .catch(() => {});
      void request('/api/save/load')
        .then((data) => {
          if (active) {
            const restored = restoreState(data) as Save;
            setSave(restored);
            setDraftName(restored.name);
            setReady(true);
          }
        })
        .catch(() => {
          if (active) {
            setStorageError(true);
            setReady(true);
          }
        });
    }
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const help = () => setPanel('help');
    window.addEventListener('devquest:help', help);
    return () => window.removeEventListener('devquest:help', help);
  }, []);
  useEffect(() => {
    const shortcuts = (event: KeyboardEvent) => {
      if (!save.onboarded || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        event.target instanceof HTMLElement &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) ||
          event.target.isContentEditable)
      )
        return;
      if (document.querySelector('dialog[open]')) return;
      const key = event.key.toLowerCase();
      const panels: Record<string, Panel> = {
        q: 'quests',
        j: 'journal',
        k: 'skills',
        i: 'inventory',
        m: 'map',
        escape: 'menu',
      };
      if (key in panels) {
        event.preventDefault();
        setPanel(panels[key]);
      }
    };
    const fullscreen = (event: Event) =>
      setFullScreen((event as CustomEvent).detail?.fullscreen ?? !!document.fullscreenElement);
    window.addEventListener('keydown', shortcuts);
    window.addEventListener('devquest:fullscreen', fullscreen);
    window.addEventListener('fullscreenchange', fullscreen);
    return () => {
      window.removeEventListener('keydown', shortcuts);
      window.removeEventListener('devquest:fullscreen', fullscreen);
      window.removeEventListener('fullscreenchange', fullscreen);
    };
  }, [save.onboarded]);
  useEffect(() => {
    const escape = () => {
      if (!save.onboarded) return;
      if (dialogue) setDialogue(null);
      else setPanel((current) => (current ? null : 'menu'));
    };
    window.addEventListener('devquest:escape', escape);
    return () => window.removeEventListener('devquest:escape', escape);
  }, [save.onboarded, dialogue]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  const update = useCallback((patch: Partial<Save>) => setSave((s) => ({ ...s, ...patch })), []);
  const close = useCallback(() => setPanel(null), []);
  const onPosition = useCallback(
    (position: Save['position']) =>
      setSave((s) =>
        Math.abs(s.position.x - position.x) + Math.abs(s.position.y - position.y) < 1
          ? s
          : { ...s, position },
      ),
    [],
  );
  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 4800);
  };
  const chime = () => {
    if (!save.sound) return;
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume();
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const osc = audio.current!.createOscillator(),
          gain = audio.current!.createGain(),
          start = audio.current!.currentTime + index * 0.09;
        osc.type = 'sine';
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.06, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gain);
        gain.connect(audio.current!.destination);
        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {}
  };
  const talk = (d: Dialogue) => {
    setDialoguePage(0);
    setDialogue(d);
  };
  const interact = (id: Interactive) => {
    if (id === 'alex') {
      if (!save.metAlex)
        talk({
          title: 'A friendly face',
          speaker: 'Alex · Senior developer',
          text: [
            `Hey, ${save.name || 'new friend'}! Welcome to PixelByte. I’m Alex, your mentor. Your desk is the one with the lilac chair. We saved you the good keyboard.`,
            'Our workflow is simple: read the ticket, understand the problem, try a change, and run the tests. You don’t need to get it right the first time.',
            'Your first ticket is a registration check. Something odd happens right at the age boundary. Take a look at your workstation when you’re ready.',
          ],
          action: 'Let’s do this →',
          finish: () => {
            update({ metAlex: true });
            notify('New ticket · The registration bug');
          },
        });
      else if (finished && !save.claimed)
        talk({
          title: 'You shipped your first day.',
          speaker: 'Alex · Proud mentor',
          text: [
            'A bug fixed. Three orders found. And a little more confidence than you walked in with. That’s a pretty good first day.',
            'The orders were never lost: the dashboard filtered out pending rows. Your query gives support exactly what they need. We’ve passed the dashboard fix to the product team.',
            'You’ve earned the “Hello, World” achievement and your first desk decoration. Pick something that makes this little corner feel like yours.',
          ],
          action: 'Claim my first upgrade ✧',
          finish: () => {
            update({ claimed: true });
            setCelebration(performance.now() + 2200);
            chime();
            setPanel('inventory');
            notify('Achievement unlocked · Hello, World!');
          },
        });
      else
        talk({
          title: save.claimed ? 'You belong here.' : 'One small experiment',
          speaker: 'Alex · Senior developer',
          text: [
            save.claimed
              ? 'Make yourself at home. Keep a note of what you learned today — future you will appreciate it.'
              : save.completed.includes('java')
                ? 'You’ve got the debugging instinct. Head to the training room on the right. The SQL terminal has a fresh investigation waiting.'
                : 'Try the inputs just below, at, and above the boundary. When a test fails, that’s information. Your workstation is ready whenever you are.',
          ],
        });
    } else if (id === 'desk') {
      if (!save.metAlex)
        talk({
          title: 'Your new corner of the world',
          speaker: 'A note on your desk',
          text: [
            '“Welcome aboard! Alex is at the desk by the windows. Say hello before opening your first ticket. — The PixelByte crew”',
          ],
        });
      else setPanel('java');
    } else if (id === 'sql') {
      if (!save.completed.includes('java'))
        talk({
          title: 'One ticket at a time',
          speaker: 'Alex · Senior developer',
          text: [
            'The investigation is queued up. Ship your registration fix first, and then we’ll take a look at the missing orders together.',
          ],
        });
      else setPanel(save.completed.includes('filter') ? 'join' : 'filter');
    } else if (id === 'board') setPanel('training');
    else if (id === 'coffee')
      talk({
        title: 'A highly available coffee service',
        speaker: 'The coffee machine',
        text: [
          'Today’s blend: Dark Mode Roast. Availability: 99.9%. Latency: about 30 seconds.',
          'A sticky note reads: “Before you refactor everything, have some water and take a short walk.” No test suite can argue with that.',
        ],
      });
    else if (id === 'maya')
      talk({
        title: 'Good things take iteration',
        speaker: 'Maya · Product designer',
        text: [
          `Oh hey, ${save.name || 'new developer'}! I’m Maya. If a button feels weird or a screen is confusing, that’s probably my next ticket.`,
          'A little secret: my first design had twelve primary buttons. Your first attempt is allowed to be a first attempt. Welcome to the team.',
        ],
      });
    else
      talk({
        title: 'The team noticeboard',
        speaker: 'PixelByte people ops',
        text: [
          'Friday demo day · Bring something you learned, something you broke, or both. Especially both.',
          'Reminder: the office plants have been renamed. Please refer to the large fern as “Fernando” in all future standups.',
        ],
      });
  };
  const complete = (mission: Mission) => {
    if (save.completed.includes(mission)) return;
    setSave((s) => completeMission(s, mission) as Save);
    setCelebration(performance.now() + 2500);
    chime();
    notify(
      mission === 'java'
        ? '+120 XP · First fix shipped!'
        : mission === 'filter'
          ? '+100 XP · The orders are still here.'
          : '+180 XP · Investigation complete!',
    );
  };
  const exportSave = () => {
    if (isDesktop) {
      void request('/api/save/store', { save })
        .then(() => request('/api/save/export'))
        .catch(() => notify('Your save could not be exported. Try the File menu.'));
      return;
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'devquest-first-day.json';
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const importSave = async (file?: File) => {
    if (!file) return;
    if (file.size > 64000) {
      notify('That save file is too large.');
      return;
    }
    try {
      const raw = JSON.parse(await file.text());
      if (raw.version !== 1 || typeof raw.onboarded !== 'boolean') throw new Error();
      setSave(restoreState(raw) as Save);
      setSession((s) => s + 1);
      setPanel(null);
      notify('Your first day, restored.');
    } catch {
      notify('That file is not a valid DEVQUEST save.');
    }
  };

  if (!ready)
    return (
      <div className="desktop-loading">
        <span className="brand-icon">&lt;∕&gt;</span>
        <h1>Welcome back to PixelByte.</h1>
        <p>Unpacking your first day…</p>
      </div>
    );

  const goToQuest = () => {
    setPanel(null);
    if (save.claimed && !save.decoration) setPanel('inventory');
    else interact(active.target as Interactive);
  };
  const toggleFullScreen = async () => {
    try {
      if (isDesktop) {
        const state = await request('/api/app/fullscreen');
        setFullScreen(state.fullscreen);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setFullScreen(false);
      } else {
        await document.documentElement.requestFullscreen();
        setFullScreen(true);
      }
    } catch {
      notify('Use View → Enter Full Screen in the Mac menu.');
    }
  };
  const quitGame = async () => {
    try {
      await request('/api/save/store', { save });
      await request('/api/app/quit');
    } catch {
      notify('Save could not finish. Export a backup before quitting.');
    }
  };

  return (
    <div className="game-app">
      <GameWorld
        key={session}
        save={save}
        paused={!save.onboarded || !!panel || !!dialogue}
        target={active.target}
        celebration={celebration}
        typing={panel === 'java' || panel === 'filter' || panel === 'join'}
        onInteract={interact}
        onPosition={onPosition}
        onMap={() => setPanel('map')}
      />
      <div className={`game-hud ${panel || dialogue || !save.onboarded ? 'hud-muted' : ''}`}>
        <div className="hud-player game-frame">
          <div className="hud-portrait">
            <AvatarPreview avatar={save.avatar} size={49} />
            <span>{finished ? '02' : '01'}</span>
          </div>
          <div className="hud-player-info">
            <strong>{save.name || 'New developer'}</strong>
            <span>{finished ? 'Junior Developer' : 'Developer Intern'}</span>
            <div className="hud-xp" aria-label={`${progress.xp} experience points`}>
              <i style={{ width: `${finished ? (progress.xp - 400) / 4 : progress.xp / 4}%` }} />
            </div>
            <small>
              {progress.xp} / {finished ? '800' : '400'} XP
            </small>
          </div>
          <div className="hud-coins">
            <span>✦</span>
            {progress.coins}
          </div>
        </div>
        <div className="hud-chapter">
          <span className="chapter-diamond">✦</span>
          <div>
            <span>CHAPTER 00</span>
            <strong>Your first day</strong>
          </div>
        </div>
        <div className="hud-top-right">
          <div className="hud-clock game-frame">
            <GameIcon name="sun" size={24} />
            <div>
              <strong>MON · DAY 01</strong>
              <span>
                09:00 <i /> Spring
              </span>
            </div>
          </div>
          <button
            className="hud-menu game-frame"
            aria-label="Open game menu"
            onClick={() => setPanel('menu')}
          >
            <GameIcon name="menu" />
            <kbd>ESC</kbd>
          </button>
        </div>
        <aside
          className={`hud-quest game-frame ${questCollapsed ? 'collapsed' : ''}`}
          aria-label="Active quest"
        >
          <button
            className="hud-quest-heading"
            onClick={() => setQuestCollapsed(!questCollapsed)}
            aria-expanded={!questCollapsed}
          >
            <span className="quest-emblem">!</span>
            <span>{finished && save.claimed ? 'CHAPTER COMPLETE' : 'CURRENT QUEST'}</span>
            <span>{questCollapsed ? '+' : '−'}</span>
          </button>
          <h1>{active.title}</h1>
          {!questCollapsed && (
            <>
              <p>{active.objective}</p>
              <button className="quest-action" onClick={goToQuest}>
                View objective <span>↗</span>
              </button>
              <div className="quest-pips">
                {[
                  save.metAlex,
                  ...['java', 'filter', 'join'].map((m) => save.completed.includes(m as Mission)),
                  save.claimed,
                ].map((done, i) => (
                  <i key={i} className={done ? 'done' : ''} />
                ))}
                <span>{Number(save.metAlex) + save.completed.length + Number(save.claimed)}/5</span>
              </div>
            </>
          )}
        </aside>
        <nav className="game-hotbar game-frame" aria-label="Game menus">
          {(
            [
              ['quests', 'quest', 'Quests', 'Q'],
              ['journal', 'book', 'Journal', 'J'],
              ['skills', 'skills', 'Skills', 'K'],
              ['inventory', 'bag', 'Backpack', 'I'],
              ['map', 'map', 'Map', 'M'],
            ] as const
          ).map(([id, icon, title, key]) => (
            <button
              key={id}
              onClick={() => setPanel(id)}
              aria-label={`Open ${title}`}
              title={`${title} (${key})`}
            >
              <GameIcon name={icon} size={24} />
              <span>{title}</span>
              <kbd>{key}</kbd>
              {id === 'inventory' && save.claimed && !save.decoration && (
                <i className="new-item-dot" />
              )}
            </button>
          ))}
        </nav>
        <div className={`hud-save ${storageError ? 'save-warning' : ''}`}>
          <GameIcon name="save" size={13} />
          {storageError ? 'Save unavailable — open Help' : 'Progress saved'}
          <span>{apiStatus === 'offline' ? 'Runtime unavailable' : 'OFFLINE ADVENTURE'}</span>
        </div>
      </div>
      {panel === 'menu' && (
        <Modal
          title="Take a breather."
          subtitle="DEVQUEST / PAUSED"
          variant="pause"
          onClose={close}
        >
          <div className="pause-menu">
            <div className="pause-art">
              <span className="pause-wordmark">
                DEV<span>QUEST</span>
              </span>
              <div className="pause-avatar">
                <AvatarPreview avatar={save.avatar} size={120} />
              </div>
              <span className="eyebrow">YOUR FIRST DAY AT PIXELBYTE</span>
              <h3>{save.name || 'Your story starts here.'}</h3>
              <p>
                {progress.xp} XP <span>✦</span> {progress.coins} coins
              </p>
              <small>Something good is taking shape.</small>
            </div>
            <div className="pause-actions">
              <button className="button button-primary resume-button" onClick={close}>
                <GameIcon name="play" size={18} /> Resume adventure <kbd>ESC</kbd>
              </button>
              <button onClick={() => setPanel('quests')}>
                <GameIcon name="quest" />
                Quest log<span>Q</span>
              </button>
              <button onClick={() => setPanel('journal')}>
                <GameIcon name="book" />
                Developer journal<span>J</span>
              </button>
              <button onClick={() => setPanel('skills')}>
                <GameIcon name="skills" />
                Skill tree<span>K</span>
              </button>
              <button onClick={() => setPanel('inventory')}>
                <GameIcon name="bag" />
                Your backpack<span>I</span>
              </button>
              <div className="pause-divider" />
              <button onClick={() => void toggleFullScreen()}>
                <GameIcon name="expand" />
                {fullScreen ? 'Leave full screen' : 'Enter full screen'}
                <span>↗</span>
              </button>
              <button onClick={() => update({ sound: !save.sound })}>
                <GameIcon name="sound" />
                Celebration sounds<span>{save.sound ? 'ON' : 'OFF'}</span>
              </button>
              <button onClick={() => setPanel('help')}>
                <span className="help-icon">?</span>Controls & saves<span>?</span>
              </button>
              {isDesktop && (
                <button className="quit-button" onClick={() => void quitGame()}>
                  <GameIcon name="exit" />
                  Save & quit<span>↗</span>
                </button>
              )}
            </div>
          </div>
          <div className="pause-footer">
            <span>
              <i className="live-dot" /> Your progress is saved on this device
            </span>
            <span>v0.2.0 · PIXELBYTE STUDIOS</span>
          </div>
        </Modal>
      )}
      {panel === 'quests' && (
        <Modal title="One small win at a time." subtitle="QUEST LOG / CHAPTER 00" onClose={close}>
          <div className="panel-content quest-log">
            <div className="quest-log-active">
              <span className="eyebrow">UP NEXT</span>
              <h3>{active.title}</h3>
              <p>{active.objective}</p>
              <button className="button button-primary" onClick={goToQuest}>
                Continue quest →
              </button>
            </div>
            {(
              [
                ['Meet your mentor', 'A friendly face on your first day.', save.metAlex],
                [
                  'The registration bug',
                  'Find the edge of the rule. · 120 XP',
                  save.completed.includes('java'),
                ],
                [
                  'The missing orders',
                  'Follow the data. · 100 XP',
                  save.completed.includes('filter'),
                ],
                [
                  'Connect the dots',
                  'Find the people behind the orders. · 180 XP',
                  save.completed.includes('join'),
                ],
                ['Your first upgrade', 'Make this little corner yours.', save.claimed],
              ] as const
            ).map(([title, desc, done], i) => (
              <div className={`quest-log-row ${done ? 'done' : ''}`} key={title}>
                <span>{done ? '✓' : `0${i + 1}`}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                </div>
                <span>{done ? 'COMPLETE' : 'TO DISCOVER'}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {panel === 'map' && (
        <Modal
          title="Make yourself at home."
          subtitle="PIXELBYTE HQ / FLOOR 01"
          onClose={close}
          wide
        >
          <div className="map-layout">
            <div className="office-map">
              <svg
                viewBox="0 0 640 400"
                role="img"
                aria-label="Floor plan of PixelByte with your location"
              >
                <rect x="14" y="53" width="612" height="332" rx="4" fill="#b38c67" />
                <path d="M404 56h220v186H404Z" fill="#819e91" />
                <path d="M404 252h220v132H404Z" fill="#c19b70" />
                {SOLIDS.map((r, i) => (
                  <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="#334b46" />
                ))}
                <text x="210" y="210">
                  DEVELOPER OFFICE
                </text>
                <text x="515" y="83">
                  TRAINING ROOM
                </text>
                <text x="515" y="320">
                  COFFEE CORNER
                </text>
                {OBJECTS.map((o) => (
                  <g key={o.id}>
                    <circle
                      cx={o.x}
                      cy={o.y}
                      r="8"
                      fill={active.target === o.id ? '#ffe4a1' : '#e4dbba'}
                    />
                    <text x={o.x} y={o.y + 3} className="map-initial">
                      {o.id[0].toUpperCase()}
                    </text>
                  </g>
                ))}
                <circle
                  cx={save.position.x}
                  cy={save.position.y}
                  r="10"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle cx={save.position.x} cy={save.position.y} r="4" fill="#fff" />
              </svg>
              <span>
                <i /> You are here <b>✦</b> Current objective
              </span>
            </div>
            <div className="map-directory">
              <span className="eyebrow">AROUND THE OFFICE</span>
              {OBJECTS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setPanel(null);
                    interact(o.id as Interactive);
                  }}
                >
                  <span>{o.label}</span>
                  <b>↗</b>
                </button>
              ))}
              <p>Visit a location directly, or walk there and press E.</p>
            </div>
          </div>
        </Modal>
      )}

      {!save.onboarded && (
        <Modal
          title="Every developer starts somewhere."
          subtitle="WELCOME TO PIXELBYTE STUDIOS"
          variant="onboarding"
          dismissible={false}
          onClose={() => {}}
          wide
        >
          <form
            className="onboarding"
            onSubmit={(e) => {
              e.preventDefault();
              update({ name: draftName.trim() || 'New developer', onboarded: true });
              notify('Welcome aboard. Alex is looking forward to meeting you.');
            }}
          >
            <div className="onboard-story">
              <div className="employee-badge">
                <span className="eyebrow">PIXELBYTE · EMPLOYEE BADGE</span>
                <AvatarPreview avatar={save.avatar} size={112} />
                <strong>{draftName.trim() || 'Your name here'}</strong>
                <span>Developer Intern</span>
                <div className="badge-barcode">▌▌▌▎▌▏▎▌▌▏▎▌▏▌▌▌▏▎▌</div>
                <small>DAY ONE. POSSIBILITY ONE.</small>
              </div>
            </div>
            <div className="onboard-fields">
              <p>
                A new job, a cozy little office, and a couple of mysteries to solve. First, let’s
                make this story yours.
              </p>
              <label className="form-label">
                What should we call you?
                <input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  maxLength={24}
                  placeholder="Your developer name"
                  required
                />
              </label>
              <fieldset>
                <legend>Pick your hoodie</legend>
                <div className="swatches">
                  {['#8a82bc', '#789c89', '#cd927e', '#6f91ad', '#d4ad66'].map((color) => (
                    <button
                      type="button"
                      key={color}
                      style={{ background: color }}
                      className={save.avatar.shirt === color ? 'chosen' : ''}
                      aria-label={`Hoodie ${color}`}
                      aria-pressed={save.avatar.shirt === color}
                      onClick={() => update({ avatar: { ...save.avatar, shirt: color } })}
                    >
                      {save.avatar.shirt === color ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Skin tone</legend>
                <div className="swatches skin-swatches">
                  {['#f1c8a3', '#dca477', '#b8805c', '#8c5d46', '#634339'].map((color) => (
                    <button
                      type="button"
                      key={color}
                      style={{ background: color }}
                      className={save.avatar.skin === color ? 'chosen' : ''}
                      aria-label={`Skin tone ${color}`}
                      aria-pressed={save.avatar.skin === color}
                      onClick={() => update({ avatar: { ...save.avatar, skin: color } })}
                    >
                      {save.avatar.skin === color ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Hair, your way</legend>
                <div className="segmented">
                  {['short', 'bob', 'curly'].map((hair) => (
                    <button
                      type="button"
                      key={hair}
                      className={save.avatar.hair === hair ? 'chosen' : ''}
                      onClick={() => update({ avatar: { ...save.avatar, hair } })}
                    >
                      {hair}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={save.avatar.glasses}
                  onChange={(e) =>
                    update({ avatar: { ...save.avatar, glasses: e.target.checked } })
                  }
                />{' '}
                A pair of glasses
              </label>
              <button className="button button-primary onboard-submit" type="submit">
                Clock in. Let’s begin. <span>→</span>
              </button>
              <small className="privacy-note">
                No account. No AI solutions. Just you, figuring things out.
              </small>
            </div>
          </form>
        </Modal>
      )}

      {dialogue && (
        <Modal
          title={dialogue.title}
          subtitle="A MOMENT AT PIXELBYTE"
          variant="dialogue"
          onClose={() => setDialogue(null)}
        >
          <div className="dialogue-body">
            <div className="dialogue-speaker">
              <div className="dialogue-portrait">
                <AvatarPreview
                  avatar={
                    dialogue.speaker.startsWith('Alex')
                      ? { skin: '#d9a278', shirt: '#7897b8', hair: 'short', glasses: false }
                      : dialogue.speaker.startsWith('Maya')
                        ? { skin: '#b07b5d', shirt: '#c78d79', hair: 'curly', glasses: true }
                        : save.avatar
                  }
                  size={73}
                />
              </div>
              <strong>{dialogue.speaker}</strong>
              <span>
                {dialoguePage + 1} / {dialogue.text.length}
              </span>
            </div>
            <p key={dialoguePage}>{dialogue.text[dialoguePage]}</p>
            <div className="dialogue-actions">
              <span>
                {dialogue.text.length > 1
                  ? 'Good things start with a conversation.'
                  : 'Take a breath. You’re doing fine.'}
              </span>
              <button
                className="button button-primary"
                onClick={() => {
                  if (dialoguePage < dialogue.text.length - 1) setDialoguePage((p) => p + 1);
                  else {
                    setDialogue(null);
                    dialogue.finish?.();
                  }
                }}
              >
                {dialoguePage < dialogue.text.length - 1
                  ? 'Go on →'
                  : (dialogue.action ?? 'Back to the office →')}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {panel && ['java', 'filter', 'join'].includes(panel) && (
        <Modal
          title={panel === 'java' ? 'Let’s fix something.' : 'Follow the data.'}
          subtitle={`TICKET ${panel === 'java' ? '#001' : '#104'} · PIXELBYTE IDE`}
          variant="workspace"
          onClose={close}
          wide
        >
          <Workspace
            key={panel}
            mission={panel as Mission}
            save={save}
            runtime={runtime}
            update={update}
            onComplete={complete}
            onNext={() => setPanel('join')}
            onClose={close}
          />
        </Modal>
      )}
      {panel === 'journal' && (
        <Modal title="Your field notes." subtitle="DEVELOPER JOURNAL" onClose={close}>
          <div className="panel-content">
            <p>A record of what clicked, what surprised you, and what you want to try next.</p>
            <div className="journal-stamps">
              {save.completed.length ? (
                save.completed.map((m) => (
                  <span key={m}>
                    ✓{' '}
                    {m === 'java'
                      ? 'Boundary conditions'
                      : m === 'filter'
                        ? 'SELECT & WHERE'
                        : 'Relational thinking'}
                  </span>
                ))
              ) : (
                <span>Your first discovery is just around the corner.</span>
              )}
            </div>
            <label className="form-label">
              A note to future you
              <textarea
                className="journal-input"
                placeholder="Today I learned…"
                value={save.journal}
                maxLength={12000}
                onChange={(e) => update({ journal: e.target.value })}
              />
            </label>
            <div className="journal-footer">
              <span>
                <i className="live-dot" />{' '}
                {isDesktop ? 'Saved on this Mac' : 'Saved in this browser'}
              </span>
              <span>{save.journal.length} / 12,000</span>
            </div>
          </div>
        </Modal>
      )}
      {panel === 'skills' && (
        <Modal
          title="A career, one small win at a time."
          subtitle="YOUR JOURNEY"
          onClose={close}
          wide
        >
          <div className="skills-layout">
            <div className="first-day-tree">
              <span className="eyebrow">FIRST DAY · YOUR SKILL TREE</span>
              <h3>From “what if?” to “it works.”</h3>
              <p>Skills unlock through doing. Here’s what you’re building today.</p>
              {[
                ['Debugging', 'Boundary conditions & tests', 'java'],
                ['SQL filtering', 'SELECT · FROM · WHERE', 'filter'],
                ['Relational thinking', 'JOIN · keys · aliases', 'join'],
              ].map(([title, desc, key]) => (
                <div
                  key={key}
                  className={`skill-node ${save.completed.includes(key as Mission) ? 'unlocked' : ''}`}
                >
                  <span>{save.completed.includes(key as Mission) ? '✓' : '◇'}</span>
                  <div>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </div>
                  <span>{save.completed.includes(key as Mission) ? 'LEARNED' : 'GROWING'}</span>
                </div>
              ))}
              <div className="mastery-note">
                ✧ Mastery comes next: future chapters will add independent challenges. This first
                day builds the foundation.
              </div>
            </div>
            <div className="career-path">
              <span className="eyebrow">THE BIGGER ADVENTURE</span>
              {CHAPTERS.map(([number, title, desc], i) => (
                <div className={i === 0 ? 'current' : ''} key={number}>
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </div>
                  <span>{i === 0 ? 'YOU ARE HERE' : 'PLANNED'}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
      {panel === 'inventory' && (
        <Modal title="A little more you." subtitle="YOUR BACKPACK" onClose={close}>
          <div className="panel-content">
            <p>
              {save.claimed
                ? 'Your first day deserves a small reminder. Choose a gift from the team and it’ll appear at your workstation. Switch whenever you like.'
                : 'Your backpack is ready for its first story. Finish both tickets and visit Alex to unlock a gift from the team.'}
            </p>
            <div className={`achievement ${save.claimed ? 'earned' : ''}`}>
              <span>✧</span>
              <div>
                <strong>Hello, World!</strong>
                <small>
                  {save.claimed
                    ? 'Your first fix. Your first investigation. Your first day.'
                    : 'Complete the first day to unlock this achievement.'}
                </small>
              </div>
              <span>{save.claimed ? '✓' : '◇'}</span>
            </div>
            <div className="decoration-grid">
              {[
                ['plant', '🪴', 'A little green', 'Meet your new desk fern.'],
                ['cat', '🐈', 'A tiny coworker', 'Excellent at code purr-views.'],
                ['lamp', '💡', 'A bright idea', 'For the next “aha!” moment.'],
              ].map(([id, icon, title, desc]) => (
                <button
                  className={save.decoration === id ? 'selected' : ''}
                  disabled={!save.claimed}
                  key={id}
                  onClick={() => {
                    update({ decoration: id as Save['decoration'] });
                    chime();
                    notify(`${title} · Placed at your workstation.`);
                  }}
                >
                  <span className="decoration-icon">{icon}</span>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                  <span className="decoration-action">
                    {!save.claimed
                      ? 'Locked'
                      : save.decoration === id
                        ? '✓ On your desk'
                        : 'Place on my desk →'}
                  </span>
                </button>
              ))}
            </div>
            <p className="inventory-note">
              Your first gift is on us. Your {progress.coins} dev coins are saved for future shop
              updates.
            </p>
          </div>
        </Modal>
      )}
      {panel === 'training' && (
        <Modal title="Make the concept click." subtitle="THE TRAINING ROOM" onClose={close}>
          <Training onJava={() => interact('desk')} onSql={() => interact('sql')} />
        </Modal>
      )}
      {panel === 'help' && (
        <Modal title="A little orientation." subtitle="PLAYER HANDBOOK" onClose={close}>
          <div className="panel-content help-content">
            <h3>Your controls</h3>
            <p>
              <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or arrow keys to walk.{' '}
              <kbd>E</kbd> to interact. <kbd>Esc</kbd> to pause, resume, or close a panel. Open
              quests with <kbd>Q</kbd>, your journal with <kbd>J</kbd>, skills with <kbd>K</kbd>,
              your backpack with <kbd>I</kbd>, and the office map with <kbd>M</kbd>. The map and
              quest log also let you reach every story interaction without walking.
            </p>
            <h3>Your workspace</h3>
            <p>
              Run samples to experiment; submit for review to deliver a ticket. Hints guide your
              thinking and never cost XP.{' '}
              {runtime === 'practice'
                ? 'Java practice mode handles a single return expression in the provided method. Enable the Docker runner for full Java compilation.'
                : 'Java is compiled and tested in disposable, restricted Docker containers.'}{' '}
              SQL uses a real local SQLite database.
            </p>
            <h3>Your save</h3>
            <p>
              Progress, code, notes, avatar, and decorations stay{' '}
              {isDesktop ? 'on this Mac' : 'in this browser'}. Export a backup to take them with
              you.
            </p>
            <div className="save-buttons">
              <button className="button button-secondary" onClick={exportSave}>
                ↓ Export save
              </button>
              {isDesktop ? (
                <button
                  className="button button-secondary"
                  onClick={() => void request('/api/save/import')}
                >
                  ↑ Import save
                </button>
              ) : (
                <label className="button button-secondary import-button">
                  ↑ Import save
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={(e) => {
                      void importSave(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
            <div className="restart-section">
              <button className="text-button" onClick={() => setConfirmRestart(!confirmRestart)}>
                Start a fresh first day
              </button>
              {confirmRestart && (
                <div>
                  <p>
                    This replaces your local progress. Export a backup first if you want to keep it.
                  </p>
                  <button
                    className="button button-danger"
                    onClick={() => {
                      setSave(freshState() as Save);
                      setSession((s) => s + 1);
                      setDraftName('');
                      setPanel(null);
                      setConfirmRestart(false);
                      window.location.hash = 'office';
                    }}
                  >
                    Reset local progress
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>✧</span>
          {toast}
          <button aria-label="Dismiss notification" onClick={() => setToast('')}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}

function Training({ onJava, onSql }: { onJava: () => void; onSql: () => void }) {
  const [index, setIndex] = useState(0);
  const numbers = [17, 18, 19];
  const [iteration, setIteration] = useState(0);
  const values = [4, 7, 2, 9];
  return (
    <div className="panel-content training-content">
      <span className="ticket-tag purple">DEBUGGING LAB</span>
      <h3>Meet the edge of the rule.</h3>
      <p>
        “18 or older” is a rule with a boundary. Try the inputs below and compare the current
        behavior to the requirement.
      </p>
      <div className="boundary-options">
        {numbers.map((number, i) => (
          <button
            key={number}
            className={index === i ? 'selected' : ''}
            onClick={() => setIndex(i)}
          >
            {number}
            <small>years old</small>
          </button>
        ))}
      </div>
      <div className="boundary-results">
        <div>
          <small>Current: age &gt; 18</small>
          <strong>{numbers[index] > 18 ? 'Can register' : 'Cannot register'}</strong>
        </div>
        <div className={numbers[index] === 18 ? 'edge-case' : ''}>
          <small>Requirement: 18 or older</small>
          <strong>{numbers[index] >= 18 ? 'Can register' : 'Cannot register'}</strong>
        </div>
      </div>
      <p className="training-takeaway">
        {index === 1
          ? 'There’s the mismatch. The boundary belongs to the allowed group.'
          : 'This case agrees. What happens right at the boundary?'}
      </p>
      <button className="button button-primary" onClick={onJava}>
        Try it at your workstation →
      </button>
      <hr />
      <span className="ticket-tag green">ARRAYS & LOOPS</span>
      <h3>One item at a time.</h3>
      <p>
        An array stores values in order. A loop visits each index. Step through the array and watch
        the running total grow.
      </p>
      <div className="array-lab">
        {values.map((value, i) => (
          <div key={i} className={i === iteration ? 'current' : i < iteration ? 'visited' : ''}>
            <strong>{value}</strong>
            <small>index {i}</small>
          </div>
        ))}
      </div>
      <div className="array-actions">
        <code>sum = {values.slice(0, iteration + 1).reduce((a, b) => a + b, 0)}</code>
        <button
          className="button button-secondary"
          onClick={() => setIteration((iteration + 1) % values.length)}
        >
          {iteration === 3 ? 'Start again ↻' : 'Next index →'}
        </button>
      </div>
      <hr />
      <span className="ticket-tag green">DATABASE LAB</span>
      <h3>Look beyond the dashboard.</h3>
      <p>
        SELECT chooses what you see. WHERE chooses which rows remain. JOIN follows a relationship
        from one table to another. The data can tell a different story from the screen.
      </p>
      <button className="button button-secondary" onClick={onSql}>
        Visit the SQL terminal →
      </button>
    </div>
  );
}
