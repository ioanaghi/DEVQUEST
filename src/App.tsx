import { TitleScreen } from './components/TitleScreen';
import {
  freshLibrary,
  restoreLibrary,
  saveToSlot,
  selectSlot,
  deleteSlot,
  encodeLibrary,
  validateSave,
  SLOT_KEY,
  LEGACY_KEY,
} from './lib/save-slots.mjs';
import { SeasonArc } from './components/SeasonArc';
import { EPISODES, RETENTION } from './lib/season-content.mjs';
import {
  nextSeason,
  completeSeason,
  certify,
  seasonUnlocked,
  retentionUnlocked,
} from './lib/season.mjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { worldArtLoaded } from './game/art';
import { GameWorld } from './game/GameWorld';
import { AvatarPreview } from './components/AvatarPreview';
import { DialogueText } from './components/DialogueText';
import { DeskScene } from './components/DeskScene';
import { Modal, requestOverlayClose } from './components/Modal';
import { CheckoutArc } from './components/CheckoutArc';
import {
  CHECKOUT_MISSIONS,
  checkoutUnlocked,
  checkoutStatus,
  completeCheckout,
} from './lib/checkout.mjs';
import { Workspace } from './components/Workspace';
import { GameIcon } from './components/GameIcon';
import { OBJECTS, SOLIDS } from './game/world.mjs';
import { freshState, restoreState, completeMission, totals, quest } from './lib/progression.mjs';
import { CHAPTERS } from './lib/content';
import type { Interactive, Mission, Panel, Save, SaveLibrary } from './types';
import { cue, setSoundEnabled } from './game/sound';
import { isDesktop, request } from './lib/platform';

type Dialogue = {
  title: string;
  speaker: string;
  text: string[];
  action?: string;
  finish?: () => void;
};
function initialLibrary(): { library: SaveLibrary; error: string } {
  if (isDesktop) return { library: freshLibrary() as SaveLibrary, error: '' };
  try {
    const slots = localStorage.getItem(SLOT_KEY);
    return {
      library: restoreLibrary(
        slots !== null ? slots : localStorage.getItem(LEGACY_KEY),
      ) as SaveLibrary,
      error: '',
    };
  } catch (error) {
    return {
      library: freshLibrary() as SaveLibrary,
      error: error instanceof Error ? error.message : 'Saved progress could not be read.',
    };
  }
}

export default function App() {
  const [boot] = useState(initialLibrary);
  const [library, setLibrary] = useState<SaveLibrary>(boot.library);
  const [loadError, setLoadError] = useState(!!boot.error);
  const [slotError, setSlotError] = useState(boot.error);
  const [playing, setPlaying] = useState(false);
  const [slotBusy, setSlotBusy] = useState(false);
  const [pendingImport, setPendingImport] = useState<Save | null>(null);
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());
  const [save, setSave] = useState<Save>(() => freshState() as Save);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(0);
  const [seasonEpisode, setSeasonEpisode] = useState<string | undefined>();
  const [checkoutIndex, setCheckoutIndex] = useState<number | undefined>(undefined);
  const [panel, setPanel] = useState<Panel>(null);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [dialoguePage, setDialoguePage] = useState(0);
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [runtime, setRuntime] = useState('practice');
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'offline'>('checking');
  const [celebration, setCelebration] = useState(0);
  const [pastedSave, setPastedSave] = useState('');
  const [fullScreen, setFullScreen] = useState(isDesktop);
  const [questCollapsed, setQuestCollapsed] = useState(false);
  const [hudOverlap, setHudOverlap] = useState(false);
  const progress = totals(save),
    active = quest(save),
    finished = save.completed.length === 3;
  const seasonClock =
    save.checkout.completed.length === 9
      ? ((
          {
            warehouse: ['MON · WAREHOUSE', '10:15'],
            traffic: ['TUE · ON CALL', '00:00'],
            stack: ['TUE · EDITOR', '11:20'],
            binary: ['WED · RELEASES', '09:30'],
            lists: ['WED · ROUTES', '15:10'],
            recursion: ['THU · ARCHIVE', '10:40'],
            sql2: ['THU · SUPPORT', '14:00'],
            oop: ['FRI · ARCHITECTURE', '15:30'],
          } as Record<string, string[]>
        )[nextSeason(save)?.episode.id ?? ''] ?? ['FRI · RELEASE DAY', '17:00'])
      : null;
  const toastTimer = useRef(0);
  useEffect(() => setSoundEnabled(save.sound), [save.sound]);
  const persistLibrary = useCallback(async (next: SaveLibrary) => {
    const encoded = encodeLibrary(next);
    const write = writeQueue.current
      .catch(() => {})
      .then(async () => {
        if (isDesktop) await request('/api/slots/store', { library: next });
        else localStorage.setItem(SLOT_KEY, encoded);
      });
    writeQueue.current = write;
    await write;
    setStorageError(false);
  }, []);
  useEffect(() => {
    if (!ready || !playing || loadError || library.activeSlot === null || slotBusy) return;
    const timer = window.setTimeout(() => {
      void persistLibrary(saveToSlot(library, library.activeSlot, save) as SaveLibrary).catch(() =>
        setStorageError(true),
      );
    }, 200);
    return () => window.clearTimeout(timer);
  }, [save, library, ready, playing, loadError, slotBusy, persistLibrary]);
  useEffect(() => {
    const flush = () => {
      if (ready && playing && !loadError && library.activeSlot !== null)
        void persistLibrary(saveToSlot(library, library.activeSlot, save) as SaveLibrary).catch(
          () => setStorageError(true),
        );
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [save, library, ready, playing, loadError, persistLibrary]);
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
      void request('/api/slots/load')
        .then(async (data) => {
          await worldArtLoaded;
          if (active) {
            setLibrary(restoreLibrary(data) as SaveLibrary);
            setLoadError(false);
            setSlotError('');
            setReady(true);
          }
        })
        .catch((error) => {
          if (active) {
            setLoadError(true);
            setSlotError(
              error instanceof Error ? error.message : 'Save slots could not be loaded.',
            );
            setStorageError(true);
            setReady(true);
          }
        });
    }
    if (!isDesktop)
      void worldArtLoaded.then(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const help = () => {
      if (playing) setPanel('help');
    };
    window.addEventListener('devquest:help', help);
    return () => window.removeEventListener('devquest:help', help);
  }, [playing]);
  useEffect(() => {
    const shortcuts = (event: KeyboardEvent) => {
      if (
        !playing ||
        slotBusy ||
        !save.onboarded ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
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
  }, [save.onboarded, playing, slotBusy]);
  useEffect(() => {
    const escape = () => {
      if (!playing || slotBusy || !save.onboarded) return;
      if (document.querySelector('dialog[open]')) requestOverlayClose();
      else setPanel('menu');
    };
    window.addEventListener('devquest:escape', escape);
    return () => window.removeEventListener('devquest:escape', escape);
  }, [save.onboarded, dialogue, playing, slotBusy]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  const update = useCallback((patch: Partial<Save>) => setSave((s) => ({ ...s, ...patch })), []);
  const close = useCallback(() => setPanel(null), []);
  const dismissPanel = useCallback(() => requestOverlayClose(), []);
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
  const snapshotLibrary = () =>
    playing && library.activeSlot !== null
      ? (saveToSlot(library, library.activeSlot, save) as SaveLibrary)
      : library;
  const reportSlotError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Progress could not be saved.';
    setSlotError(message);
    setStorageError(true);
    return message;
  };
  const enterGame = (next: SaveLibrary, index: number) => {
    setLibrary(next);
    setSave(next.slots[index]!.save);
    setSession((s) => s + 1);
    setPanel(null);
    setDialogue(null);
    setCheckoutIndex(undefined);
    setSeasonEpisode(undefined);
    setToast('');
    setQuestCollapsed(false);
    setHudOverlap(false);
    setPendingImport(null);
    setSlotError('');
    setPlaying(true);
  };
  const loadSlot = async (index: number) => {
    if (slotBusy || loadError) return;
    setSlotBusy(true);
    try {
      const next = selectSlot(library, index) as SaveLibrary;
      await persistLibrary(next);
      enterGame(next, index);
    } catch (error) {
      reportSlotError(error);
    } finally {
      setSlotBusy(false);
    }
  };
  const createSlot = async (index: number, character: Save) => {
    if (slotBusy || loadError) return;
    setSlotBusy(true);
    try {
      const next = saveToSlot(library, index, character) as SaveLibrary;
      await persistLibrary(next);
      enterGame(next, index);
    } catch (error) {
      reportSlotError(error);
    } finally {
      setSlotBusy(false);
    }
  };
  const resetSlot = async (index: number) => {
    if (slotBusy || loadError) return;
    setSlotBusy(true);
    try {
      const next = deleteSlot(library, index) as SaveLibrary;
      await persistLibrary(next);
      setLibrary(next);
      setSlotError('');
    } catch (error) {
      reportSlotError(error);
    } finally {
      setSlotBusy(false);
    }
  };
  const returnToTitle = async () => {
    if (slotBusy || loadError) return false;
    setSlotBusy(true);
    try {
      const next = snapshotLibrary();
      await persistLibrary(next);
      setLibrary(next);
      setPlaying(false);
      setPanel(null);
      setDialogue(null);
      setToast('');
      setSlotError('');
      return true;
    } catch (error) {
      notify(reportSlotError(error));
      return false;
    } finally {
      setSlotBusy(false);
    }
  };
  const stageImport = async (raw: unknown) => {
    try {
      const imported = validateSave(raw) as Save;
      if (!imported.onboarded) throw new Error('Choose a backup with a completed character.');
      if (playing && !(await returnToTitle())) return;
      setPendingImport(imported);
      setPanel(null);
      setSlotError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'That backup could not be read.';
      setSlotError(message);
      if (playing) notify(message);
    }
  };
  useEffect(() => {
    const title = () => {
      void returnToTitle();
    };
    const imported = (event: Event) => {
      void stageImport((event as CustomEvent).detail);
    };
    const quitting = () => {
      if (slotBusy) {
        void request('/api/app/cancel-quit');
        return;
      }
      if (ready) void quitGame();
      else void request('/api/app/quit');
    };
    window.addEventListener('devquest:quit', quitting);
    window.addEventListener('devquest:title', title);
    window.addEventListener('devquest:import', imported);
    return () => {
      window.removeEventListener('devquest:quit', quitting);
      window.removeEventListener('devquest:title', title);
      window.removeEventListener('devquest:import', imported);
    };
  }, [ready, playing, save, library, slotBusy, loadError]);
  const chime = () => cue('reward');
  const talk = (d: Dialogue) => {
    setDialoguePage(0);
    setDialogue(d);
  };
  const interact = (id: Interactive) => {
    const seasonNext = nextSeason(save);
    if (seasonNext?.mission.target === id && save.checkout.completed.length === 9) {
      setSeasonEpisode(seasonNext.episode.id);
      setPanel('season');
      return;
    }
    if (['max', 'theo', 'lia', 'iris', 'victor'].includes(id)) {
      const episode = EPISODES.find(
        (e) => seasonUnlocked(save, e.id) && e.missions.some((m) => m.target === id),
      );
      if (episode) {
        setSeasonEpisode(episode.id);
        setPanel('season');
        return;
      }
      talk({
        title: 'The next BentoCart release',
        speaker: OBJECTS.find((o) => o.id === id)?.label ?? id,
        text: [
          'We have more work ahead. Finish the current lead, or explore the independent SQL and OOP study paths in your quest log.',
        ],
      });
      return;
    }
    const checkoutMission = CHECKOUT_MISSIONS[save.checkout.completed.length];
    if (checkoutUnlocked(save) && checkoutMission?.target === id) {
      setCheckoutIndex(undefined);
      setPanel('checkout');
      return;
    }
    if (id === 'nora' || id === 'eva') {
      talk({
        title: id === 'nora' ? 'BentoCart is counting on us.' : 'A quiet interview table',
        speaker: id === 'nora' ? 'Nora · Product Manager' : 'Eva · Tech Lead',
        text: [
          save.checkout.completed.length === 9
            ? 'The checkout fix is delivered. Thanks for testing, explaining, and shipping it. Revisit the Checkout Incident in your quest log whenever you like.'
            : checkoutUnlocked(save)
              ? 'Follow the current lead in your quest log. We will meet here when your next mission is ready.'
              : 'Welcome! Finish your first-day tickets and collect your desk gift. Then we have a checkout incident to investigate together.',
        ],
      });
      return;
    }
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
              ? save.checkout.completed.length === 9
                ? 'The BentoCart checkout fix is shipped. You tested it, explained it, and delivered it. Our team board has the update. Nice work.'
                : 'Nora has a new checkout ticket for us after you place your desk gift. Follow the lead in your quest log.'
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
        speaker: 'Maya · QA Engineer',
        text: [
          `Oh hey, ${save.name || 'new developer'}! I’m Maya. If a function breaks on an unexpected input, that’s probably my next ticket.`,
          'Try an empty input, a duplicate, and a boundary value. Your first attempt is allowed to be a first attempt. Welcome to the team.',
        ],
      });
    else
      talk({
        title: 'The team noticeboard',
        speaker: 'PixelByte people ops',
        text: [
          EPISODES.every((e) => save.season.episodes[e.id].completed.length === e.missions.length)
            ? 'RELEASE SHIPPED · BentoCart Season 1. Checkout, warehouse, monitoring, editor, releases, routes, archives, dashboard and payment extensions are ready. Thank you for collaborating, testing and explaining every fix.'
            : save.checkout.completed.length === 9
              ? 'SHIPPED · BentoCart checkout matching · Ticket #204 delivered. Thanks to our newest developer for the fix, tests, and review!'
              : 'Friday demo day · Bring something you learned, something you broke, or both. Especially both.',
          ...EPISODES.filter(
            (e) => save.season.episodes[e.id].completed.length === e.missions.length,
          ).map((e) => `${e.title}: delivered. ${e.room} is open for practice.`),
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
      void persistLibrary(snapshotLibrary())
        .then(() => request('/api/save/export'))
        .catch((error) => notify(reportSlotError(error)));
      return;
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `devquest-slot-${(library.activeSlot ?? 0) + 1}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const importSave = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 524288) throw new Error('That backup exceeds 512 KiB.');
      await stageImport(JSON.parse(await file.text()));
    } catch (error) {
      notify(reportSlotError(error));
    }
  };

  if (!ready)
    return (
      <div className="desktop-loading">
        <span className="brand-icon">&lt;∕&gt;</span>
        <h1>Welcome back to PixelByte.</h1>
        <p>Opening your save slots…</p>
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
    setSlotBusy(true);
    try {
      if (!loadError) await persistLibrary(snapshotLibrary());
      await request('/api/app/quit');
    } catch (error) {
      const message = reportSlotError(error);
      if (playing) notify(message);
      if (isDesktop) void request('/api/app/cancel-quit');
    } finally {
      setSlotBusy(false);
    }
  };
  if (!playing)
    return (
      <TitleScreen
        library={library}
        busy={slotBusy}
        error={slotError}
        loadError={loadError}
        pendingImport={pendingImport}
        onLoad={loadSlot}
        onCreate={createSlot}
        onDelete={resetSlot}
        onCancelImport={() => setPendingImport(null)}
        onImport={stageImport}
        onQuit={isDesktop ? () => void quitGame() : undefined}
        onRetry={() => window.location.reload()}
      />
    );

  return (
    <div className="game-app polished-edition">
      {save.onboarded && (
        <div className="arrival-title" aria-hidden="true">
          <span>PIXELBYTE STUDIOS</span>
          <strong>{save.metAlex ? 'Welcome back.' : 'Your first day.'}</strong>
          <i />
        </div>
      )}
      <GameWorld
        key={session}
        save={save}
        paused={slotBusy || !save.onboarded || !!panel || !!dialogue}
        target={active.target}
        celebration={celebration}
        typing={panel === 'java' || panel === 'filter' || panel === 'join'}
        onInteract={interact}
        onPosition={onPosition}
        onMap={() => setPanel('map')}
        onHudOverlap={setHudOverlap}
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
              <i
                style={{
                  width: `${Math.min(100, finished ? ((progress.xp - 400) % 400) / 4 : progress.xp / 4)}%`,
                }}
              />
            </div>
            <small>
              {progress.xp} / {finished ? Math.floor(progress.xp / 400 + 1) * 400 : 400} XP
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
            <span>
              {save.checkout.completed.length === 9
                ? 'THE JUNIOR DEVELOPER CHRONICLES'
                : checkoutUnlocked(save)
                  ? 'HASHMAP FOUNDATIONS'
                  : 'CHAPTER 00'}
            </span>
            <strong>
              {save.checkout.completed.length === 9
                ? (nextSeason(save)?.episode.title ?? 'BentoCart · Release Day')
                : checkoutUnlocked(save)
                  ? 'The Checkout Incident'
                  : 'Monday at PixelByte'}
            </strong>
          </div>
        </div>
        <div className="hud-top-right">
          <div className="hud-clock game-frame">
            <GameIcon name="sun" size={24} />
            <div>
              <strong>
                {seasonClock?.[0] ??
                  (checkoutUnlocked(save) ? 'FRI · INCIDENT DAY' : 'MON · DAY 01')}
              </strong>
              <span>
                {seasonClock?.[1] ?? (checkoutUnlocked(save) ? '16:45' : '09:00')} <i /> Spring
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
          className={`hud-quest game-frame ${questCollapsed ? 'collapsed' : ''} ${hudOverlap ? 'hud-yield' : ''}`}
          aria-label="Active quest"
        >
          <button
            className="hud-quest-heading"
            onClick={() => setQuestCollapsed(!questCollapsed)}
            aria-expanded={!questCollapsed}
          >
            <span className="quest-emblem">!</span>
            <span>
              {save.checkout.completed.length === 9 && !nextSeason(save)
                ? 'SEASON COMPLETE'
                : 'CURRENT QUEST'}
            </span>
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
                {(save.checkout.completed.length === 9 && nextSeason(save)
                  ? nextSeason(save)!.episode.missions.map((m) =>
                      save.season.episodes[nextSeason(save)!.episode.id].completed.includes(m.id),
                    )
                  : checkoutUnlocked(save)
                    ? CHECKOUT_MISSIONS.map((m) => save.checkout.completed.includes(m.id))
                    : [
                        save.metAlex,
                        ...['java', 'filter', 'join'].map((m) =>
                          save.completed.includes(m as Mission),
                        ),
                        save.claimed,
                      ]
                ).map((done, i) => (
                  <i key={i} className={done ? 'done' : ''} />
                ))}
                <span>
                  {save.checkout.completed.length === 9 && nextSeason(save)
                    ? `${save.season.episodes[nextSeason(save)!.episode.id].completed.length}/${nextSeason(save)!.episode.missions.length}`
                    : checkoutUnlocked(save)
                      ? `${save.checkout.completed.length}/9`
                      : `${Number(save.metAlex) + save.completed.length + Number(save.claimed)}/5`}
                </span>
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
                <DeskScene avatar={save.avatar} />
              </div>
              <span className="eyebrow">YOUR FIRST DAY AT PIXELBYTE</span>
              <h3>{save.name || 'Your story starts here.'}</h3>
              <p>
                {progress.xp} XP <span>✦</span> {progress.coins} coins
              </p>
              <small>Something good is taking shape.</small>
            </div>
            <div className="pause-actions">
              <button className="button button-primary resume-button" onClick={dismissPanel}>
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
              <button disabled={slotBusy} onClick={() => void returnToTitle()}>
                <GameIcon name="save" />
                Save & main menu<span>3 SLOTS</span>
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
                <button className="quit-button" disabled={slotBusy} onClick={() => void quitGame()}>
                  <GameIcon name="exit" />
                  Save & quit<span>↗</span>
                </button>
              )}
            </div>
          </div>
          <div className="pause-footer">
            <span>
              <i className="live-dot" /> Save slot {(library.activeSlot ?? 0) + 1} · Progress saves
              automatically
            </span>
            <span>v0.6.0 · PIXELBYTE STUDIOS</span>
          </div>
        </Modal>
      )}
      {panel === 'quests' && (
        <Modal
          title="One small win at a time."
          subtitle="QUEST LOG / PIXELBYTE STORIES"
          onClose={close}
        >
          <div className="panel-content quest-log">
            <div className="quest-log-active">
              <span className="eyebrow">UP NEXT</span>
              <h3>{active.title}</h3>
              <p>{active.objective}</p>
              <button className="button button-primary" onClick={goToQuest}>
                Continue quest →
              </button>
            </div>
            <h3>Season 1 · The Junior Developer Chronicles</h3>
            <p>
              Eight new adventures build toward BentoCart’s release. SQL and OOP also have
              independent study paths.
            </p>
            {EPISODES.map((e) => (
              <button
                key={e.id}
                className={`quest-log-row ${save.season.episodes[e.id].completed.length === e.missions.length ? 'done' : ''}`}
                disabled={!seasonUnlocked(save, e.id)}
                onClick={() => {
                  setSeasonEpisode(e.id);
                  setPanel('season');
                }}
              >
                <span>{e.number.toString().padStart(2, '0')}</span>
                <span>
                  <strong>{e.title}</strong>
                  <small>
                    {e.concept} · {save.season.episodes[e.id].completed.length}/{e.missions.length}
                  </small>
                </span>
                <span>{seasonUnlocked(save, e.id) ? 'OPEN' : 'LOCKED'}</span>
              </button>
            ))}
            <h3>The Checkout Incident</h3>
            <p>
              {checkoutUnlocked(save)
                ? 'Nine connected missions · Java, HashMap & interview practice'
                : 'Finish your first day and place your desk gift to unlock this adventure.'}
            </p>
            {CHECKOUT_MISSIONS.map((m, i) => (
              <button
                key={m.id}
                className={`quest-log-row checkout-log-row ${save.checkout.completed.includes(m.id) ? 'done' : ''}`}
                disabled={checkoutStatus(save, m.id) === 'locked'}
                onClick={() => {
                  setCheckoutIndex(i);
                  setPanel('checkout');
                }}
              >
                <span>
                  {save.checkout.completed.includes(m.id) ? '✓' : String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <strong>{m.title}</strong>
                  <small>
                    {m.location} · {m.xp} XP
                  </small>
                </span>
                <span>{checkoutStatus(save, m.id).toUpperCase()}</span>
              </button>
            ))}
            <h3>Your first day</h3>
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
                        : dialogue.speaker.startsWith('Nora')
                          ? { skin: '#ebbd92', shirt: '#9fa67e', hair: 'bob', glasses: false }
                          : dialogue.speaker.startsWith('Eva')
                            ? { skin: '#dca477', shirt: '#8a82bc', hair: 'bob', glasses: true }
                            : save.avatar
                  }
                  size={73}
                  animation="talking"
                />
              </div>
              <strong>{dialogue.speaker}</strong>
              <span>
                {dialoguePage + 1} / {dialogue.text.length}
              </span>
            </div>
            <DialogueText
              key={`${dialogue.speaker}-${dialoguePage}`}
              text={dialogue.text[dialoguePage]}
              label={
                dialoguePage < dialogue.text.length - 1
                  ? 'Continue'
                  : (dialogue.action ?? 'Back to the office')
              }
              onAdvance={() => {
                if (dialoguePage < dialogue.text.length - 1) setDialoguePage((page) => page + 1);
                else {
                  dialogue.finish?.();
                  requestOverlayClose();
                }
              }}
            />
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
      {panel === 'season' && (
        <Modal
          title="The Junior Developer Chronicles"
          subtitle="SEASON 1 / BENTOCART RELEASE"
          onClose={close}
          wide
          variant="workspace"
        >
          <SeasonArc
            save={save}
            update={update}
            initialEpisode={seasonEpisode}
            onComplete={(episode, id, independent) => {
              const already = save.season.episodes[episode].completed.includes(id);
              setSave((s) => completeSeason(s, episode, id, independent) as Save);
              if (!already) {
                setPanel(null);
                chime();
                setCelebration(performance.now() + 2500);
                const m = EPISODES.find((e) => e.id === episode)!.missions.find(
                  (m) => m.id === id,
                )!;
                notify(`+${m.xp} XP · ${m.title} delivered`);
              } else if (independent) {
                chime();
                notify('Independent interview passed · badge earned');
              }
            }}
            onCertify={(id) => {
              setSave((s) => certify(s, id) as Save);
              chime();
              notify('Independent retention check passed · mastery certified');
            }}
          />
        </Modal>
      )}
      {panel === 'checkout' && checkoutUnlocked(save) && (
        <Modal
          title="The Checkout Incident"
          subtitle="BENTOCART / MISSION PIPELINE"
          onClose={close}
          wide
          variant="workspace"
        >
          <CheckoutArc
            save={save}
            initialMission={checkoutIndex}
            update={update}
            onComplete={(id, independent) => {
              const already = save.checkout.completed.includes(id);
              setSave((s) => {
                const next = completeCheckout(s, id) as Save;
                if (id !== 'interview') return next;
                return {
                  ...next,
                  checkout: {
                    ...next.checkout,
                    score: next.checkout.score ? { ...next.checkout.score, reasoning: 20 } : null,
                    independent: next.checkout.independent || independent === true,
                  },
                };
              });
              if (!already) setPanel(null);
              if (already && independent && !save.checkout.independent) {
                chime();
                notify('Achievement unlocked · HashMap Detective');
              }
              if (!already) {
                chime();
                setCelebration(performance.now() + 2500);
                notify(
                  `+${CHECKOUT_MISSIONS.find((m) => m.id === id)!.xp} XP · ${id === 'qa' ? 'QA Survivor' : id === 'brute' ? 'First Working Solution' : id === 'interview' && independent ? 'HashMap Detective' : 'Mission delivered'}`,
                );
              }
            }}
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
                ✧ Finish your first day to unlock the Checkout Incident and its independent
                interview.
              </div>
            </div>
            <div className="career-path">
              <span className="eyebrow">HASHMAP · DEMONSTRATED PROGRESS</span>
              {[
                ['Discovered', save.checkout.completed.includes('lab')],
                ['Practiced', save.checkout.completed.includes('optimize')],
                ['Applied', save.checkout.completed.includes('qa')],
                ['Interview Ready', save.checkout.independent],
                ['Mastered · later independent check', save.season.mastery.checkout],
              ].map(([title, achieved]) => (
                <div key={String(title)} className={achieved ? 'current' : ''}>
                  <span>{achieved ? '✓' : '◇'}</span>
                  <strong>{title}</strong>
                  <span>{achieved ? 'DEMONSTRATED' : 'TO PRACTICE'}</span>
                </div>
              ))}
              <span className="eyebrow">SEASON 1 · DEMONSTRATED SKILLS</span>
              {EPISODES.map((e) => {
                const p = save.season.episodes[e.id];
                return (
                  <div key={e.id} className={p.completed.length ? 'current' : ''}>
                    <span>{p.completed.length === e.missions.length ? '✓' : '◇'}</span>
                    <div>
                      <strong>{e.concept}</strong>
                      <small>
                        {p.completed.length}/{e.missions.length} missions ·{' '}
                        {p.independent ? 'Interview ready' : 'Independent interview pending'} ·{' '}
                        {save.season.mastery[e.id]
                          ? 'Mastered'
                          : retentionUnlocked(save, e.id)
                            ? 'Retention check ready'
                            : 'Retention pending'}
                      </small>
                    </div>
                    <button
                      className="button"
                      disabled={!seasonUnlocked(save, e.id)}
                      onClick={() => {
                        setSeasonEpisode(e.id);
                        setPanel('season');
                      }}
                    >
                      Practice
                    </button>
                  </div>
                );
              })}
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
            <h3>Season 1 collection</h3>
            {EPISODES.filter(
              (e) => save.season.episodes[e.id].completed.length === e.missions.length,
            ).map((e) => (
              <div className="achievement earned" key={e.id}>
                <span>✧</span>
                <div>
                  <strong>{e.reward}</strong>
                  <small>
                    {e.room} unlocked ·{' '}
                    {save.season.episodes[e.id].independent
                      ? e.badge + ' badge'
                      : 'Practice interview complete'}
                  </small>
                </div>
                <button
                  className="button"
                  onClick={() => {
                    setSeasonEpisode(e.id);
                    setPanel('season');
                  }}
                >
                  Visit
                </button>
              </div>
            ))}
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
            {[
              [
                'First Working Solution',
                save.checkout.completed.includes('brute'),
                'Built a correct voucher matcher.',
              ],
              [
                'QA Survivor',
                save.checkout.completed.includes('qa'),
                'Predicted edge cases and checked two extra tests.',
              ],
              [
                'HashMap Detective',
                save.checkout.independent,
                'Passed the transaction interview without hints.',
              ],
            ].map(([title, earned, description]) => (
              <div className={`achievement ${earned ? 'earned' : ''}`} key={String(title)}>
                <span>✧</span>
                <div>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>
                <span>{earned ? '✓' : '◇'}</span>
              </div>
            ))}
            {save.checkout.completed.includes('interview') && (
              <p className="inventory-note">
                ✧ Your BentoCart desk plaque is now on your workstation. It celebrates the checkout
                delivery.
              </p>
            )}
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
                    notify(
                      save.decoration
                        ? `${title} · Placed at your workstation.`
                        : 'New message · Nora: BentoCart needs our help. Meet me in the office.',
                    );
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
              <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or arrow keys to walk. Hold{' '}
              <kbd>Shift</kbd> to move faster. <kbd>E</kbd> to interact. <kbd>Esc</kbd> to pause,
              resume, or close a panel. Open quests with <kbd>Q</kbd>, your journal with{' '}
              <kbd>J</kbd>, skills with <kbd>K</kbd>, your backpack with <kbd>I</kbd>, and the
              office map with <kbd>M</kbd>. The map and quest log also let you reach every story
              interaction without walking.
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
            <h3>The Checkout Incident</h3>
            <p>
              Finish your first day and place your gift to meet Nora. Nine connected missions cover
              arrays, HashMap, optimization, QA, and an independent interview. The checkout editor
              uses a bounded Java practice interpreter with for loops, if/else, arrays, and map
              operations; its supported syntax is shown beside the editor.
            </p>
            <h3>Season 1 · The Junior Developer Chronicles</h3>
            <p>
              After Checkout, continue through Two Pointers, Sliding Window, Stacks, Binary Search,
              Linked Lists, Recursion, SQL JOINs and OOP. Press Q for the episode board. SQL and OOP
              have independent study prerequisites. Season Java runs through the bundled restricted
              compiler; every editor documents its contract. Hints allow story completion in
              Practice Mode. Fresh independent interviews earn badges, and later independent
              challenges certify retention.
            </p>
            <h3>Your save</h3>
            <p>
              Each slot keeps its own progress, code, notes, avatar, and decorations{' '}
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
            {!isDesktop && (
              <details>
                <summary>Paste an exported save</summary>
                <p>You can restore a JSON backup directly if the file picker is unavailable.</p>
                <textarea
                  aria-label="Exported save JSON"
                  value={pastedSave}
                  maxLength={524288}
                  onChange={(e) => setPastedSave(e.target.value)}
                  style={{ width: '100%', minHeight: 100 }}
                />
                <button
                  className="button"
                  disabled={!pastedSave.trim()}
                  onClick={() =>
                    void importSave(
                      new File([pastedSave], 'devquest-save.json', { type: 'application/json' }),
                    )
                  }
                >
                  Restore pasted backup
                </button>
              </details>
            )}
            <div className="restart-section">
              <h3>Three independent adventures</h3>
              <p>
                Save & return to the main menu to load another character, start a new game, or reset
                one slot. Resetting one slot leaves the other two untouched.
              </p>
              <button
                className="button button-secondary"
                disabled={slotBusy}
                onClick={() => void returnToTitle()}
              >
                Save & open main menu
              </button>
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
