import { useState } from 'react';
import {
  EPISODES,
  TASKS,
  starter,
  REVIEW,
  BOSS_REVIEW,
  QA,
  RETENTION,
  MIXED,
} from '../lib/season-content.mjs';
import { seasonUnlocked, missionStatus, retentionUnlocked } from '../lib/season.mjs';
import { request } from '../lib/platform';
import { CodeEditor } from './CodeEditor';
import { Choices, SeasonLab } from './SeasonLabs';
import type { Save, EpisodeSave } from '../types';
type Episode = (typeof EPISODES)[number];
type Assessment = {
  passed: boolean;
  reviewPassed: boolean | null;
  efficiencyPassed: boolean | null;
  tests: { name: string; input?: string; expected?: string; passed: boolean; error?: string }[];
  rows?: Record<string, unknown>[];
  columns?: string[];
  runtime: string;
};
const canonical = (x: unknown): string =>
  Array.isArray(x)
    ? '[' + x.map(canonical).join(',') + ']'
    : x && typeof x === 'object'
      ? '{' +
        Object.keys(x)
          .sort()
          .map((k) => JSON.stringify(k) + ':' + canonical((x as Record<string, unknown>)[k]))
          .join(',') +
        '}'
      : JSON.stringify(x);
export function SeasonArc({
  save,
  update,
  onComplete,
  onCertify,
  initialEpisode,
}: {
  save: Save;
  update: (p: Partial<Save>) => void;
  onComplete: (episode: string, mission: string, independent: boolean) => void;
  onCertify: (id: string) => void;
  initialEpisode?: string;
}) {
  const [selected, select] = useState(
    initialEpisode ??
      EPISODES.find(
        (e) =>
          seasonUnlocked(save, e.id) &&
          save.season.episodes[e.id].completed.length < e.missions.length,
      )?.id ??
      'warehouse',
  );
  const [mission, M] = useState<number | null>(null),
    [retention, T] = useState<string | null>(null),
    [room, ROOM] = useState<string | null>(null);
  const e = EPISODES.find((e) => e.id === selected)!;
  const progress = save.season.episodes[e.id];
  const patch = (p: Partial<EpisodeSave>) =>
    update({
      season: {
        ...save.season,
        episodes: { ...save.season.episodes, [e.id]: { ...progress, ...p } },
      },
    });
  return (
    <div className="checkout-layout season-layout">
      <nav className="checkout-nav" aria-label="Season episodes">
        <span className="eyebrow">THE JUNIOR DEVELOPER CHRONICLES</span>
        <h3>Season 1</h3>
        <p>BentoCart’s next release needs every part of the team.</p>
        {EPISODES.map((ep) => (
          <button
            key={ep.id}
            className={ep.id === selected && !retention ? 'selected' : ''}
            disabled={!seasonUnlocked(save, ep.id)}
            onClick={() => {
              select(ep.id);
              M(null);
              T(null);
              ROOM(null);
            }}
          >
            <span>{ep.number.toString().padStart(2, '0')}</span>
            <span>
              <strong>{ep.title}</strong>
              <small>
                {ep.concept} · {save.season.episodes[ep.id].completed.length}/{ep.missions.length}
                {ep.independentTrack ? ' · independent study' : ''}
              </small>
            </span>
          </button>
        ))}
        <h4>Later mastery checks</h4>
        {Object.entries(RETENTION).map(([id, [task, title]]) => (
          <button
            key={id}
            disabled={!retentionUnlocked(save, id)}
            onClick={() => {
              select(id === 'checkout' ? 'warehouse' : id);
              T(id);
              M(null);
              ROOM(null);
            }}
          >
            <span>{save.season.mastery[id] ? '✓' : '◇'}</span>
            <span>
              <strong>{title}</strong>
              <small>
                {save.season.mastery[id]
                  ? 'Certified'
                  : retentionUnlocked(save, id)
                    ? 'Independent challenge ready'
                    : 'Pass independently, then complete 3 later missions'}
              </small>
            </span>
          </button>
        ))}
      </nav>
      <section className="checkout-mission">
        {retention ? (
          <>
            <span className="eyebrow">LATER RETENTION · NO HINTS</span>
            <h2>{RETENTION[retention][1]}</h2>
            <p>
              A different problem, after other missions. Your story completion and interview
              readiness remain separate from this certification.
            </p>
            <SeasonCode
              key={'retention-' + retention}
              task={RETENTION[retention][0]}
              progress={progress}
              patch={patch}
              qa={false}
              independent={true}
              onAccepted={() => onCertify(retention)}
              autoDeliver={true}
            />
            {save.season.mastery[retention] && (
              <p className="checkout-good">
                ✓ Mastery certified through an independent later challenge.
              </p>
            )}
          </>
        ) : (
          <>
            <span className="eyebrow">
              EPISODE {e.number.toString().padStart(2, '0')} · {e.concept.toUpperCase()}
            </span>
            <h2>{e.title}</h2>
            <div className="season-mission-tabs" aria-label="Episode missions">
              {e.missions.map((m, i) => (
                <button
                  className={mission === i ? 'selected' : ''}
                  key={m.id}
                  disabled={missionStatus(save, e.id, m.id) === 'locked'}
                  onClick={() => {
                    M(i);
                    ROOM(null);
                  }}
                >
                  {progress.completed.includes(m.id) ? '✓' : i + 1} · {m.title}
                </button>
              ))}
            </div>
            {room === e.id ? (
              <SeasonRoom episode={e} answers={progress.answers} patch={patch} />
            ) : (
              <SeasonMission
                key={
                  e.id +
                  '-' +
                  (mission ?? Math.min(progress.completed.length, e.missions.length - 1))
                }
                episode={e}
                index={mission ?? Math.min(progress.completed.length, e.missions.length - 1)}
                progress={progress}
                patch={patch}
                active={
                  missionStatus(
                    save,
                    e.id,
                    e.missions[
                      mission ?? Math.min(progress.completed.length, e.missions.length - 1)
                    ].id,
                  ) !== 'locked'
                }
                onComplete={(id, independent) => onComplete(e.id, id, independent)}
              />
            )}
            {progress.completed.length === e.missions.length && (
              <div className="season-reward">
                <strong>✓ {e.title} delivered</strong>
                <p>
                  {e.badge}{' '}
                  {progress.independent
                    ? 'badge earned'
                    : 'practice complete · independent interview still available'}{' '}
                  · {e.reward} · {e.room} unlocked.
                </p>
                <button className="button" onClick={() => ROOM(e.id)}>
                  Enter {e.room} →
                </button>
              </div>
            )}
            {EPISODES.every(
              (ep) => save.season.episodes[ep.id].completed.length === ep.missions.length,
            ) && (
              <div className="season-finale">
                <h3>BentoCart · Release Day</h3>
                <p>
                  The checkout accepts vouchers. Parcels move, monitoring catches spikes, Undo
                  works, releases are traceable, routes and archives are repaired, customers appear,
                  and new payments plug in cleanly. Nora thanks the whole team. You helped ship a
                  product.
                </p>
                <h4>Eva’s mixed pattern review</h4>
                {MIXED.map(([q, options, correct], i) => (
                  <Choices
                    key={i}
                    id={'mixed' + i}
                    question={q}
                    options={options}
                    value={save.season.mixed[i]}
                    onChange={(v) => {
                      if (v === String(correct))
                        update({
                          season: { ...save.season, mixed: { ...save.season.mixed, [i]: v } },
                        });
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
function SeasonMission({
  episode: e,
  index,
  progress: p,
  patch,
  active,
  onComplete,
}: {
  episode: Episode;
  index: number;
  progress: EpisodeSave;
  patch: (p: Partial<EpisodeSave>) => void;
  active: boolean;
  onComplete: (id: string, independent: boolean) => void;
}) {
  const m = e.missions[index],
    delivered = p.completed.includes(m.id);
  const [ready, READY] = useState(false),
    [practice, PRACTICE] = useState(false),
    [feedback, F] = useState('');
  const setAnswer = (k: string, v: string) => patch({ answers: { ...p.answers, [k]: v } });
  const phaseKey = m.id + '-phase',
    phase = Math.min(4, Number(p.answers[phaseKey] ?? 0) || 0);
  const [retry, RETRY] = useState(0);
  const review = BOSS_REVIEW[e.id];
  const reviewQuestion = (i: number) => {
    const [q, o] = review[i];
    return (
      <Choices
        id={e.id + m.id + 'boss' + i}
        question={q}
        options={o}
        value={p.answers['boss-' + i]}
        onChange={(v) => setAnswer('boss-' + i, v)}
      />
    );
  };
  const independent = m.activity === 'interview' && (p.hints[m.task!] ?? 0) === 0 && !practice;
  const canDeliver = active && (ready || (!m.task && p.answers['lab-' + m.activity] === 'done'));
  return (
    <div>
      <span className="checkout-location">
        {m.npc} ·{' '}
        {m.target === 'desk'
          ? 'Your workstation'
          : m.target === 'board'
            ? 'Training room'
            : m.npc === 'Eva'
              ? 'Interview room'
              : 'PixelByte Studios'}
      </span>
      <h3>
        {index + 1}. {m.title}
      </h3>
      <blockquote className="checkout-dialogue">{m.dialogue}</blockquote>
      {delivered && (
        <p className="checkout-good">✓ Mission delivered. Revisiting never duplicates XP.</p>
      )}
      {!m.task && (
        <SeasonLab
          activity={m.activity}
          episode={e.id}
          answers={p.answers}
          setAnswer={setAnswer}
          onReady={() => READY(true)}
        />
      )}
      {m.activity === 'interview' && (
        <>
          <div className="season-phases">
            {['Clarify', 'Plan', 'Implement', 'Edge cases', 'Explain'].map((v, i) => (
              <span className={phase === i ? 'selected' : ''} key={v}>
                {i + 1} · {v}
              </span>
            ))}
          </div>
          <p>
            {(p.hints[m.task!] ?? 0) > 0 || practice
              ? 'Practice Mode · finish the story, then retry independently for the badge.'
              : 'Independent attempt · hints switch this attempt to Practice Mode.'}
          </p>
          {phase === 0 && (
            <Choices
              id={e.id + 'clarify'}
              question="Which contract do you clarify before coding?"
              options={[
                'Allowed input, output, empty/duplicate cases, and required time/space.',
                'Only the example answer.',
                'The implementation Alex used earlier.',
              ]}
              value={p.answers['boss-clarify']}
              onChange={(v) => setAnswer('boss-clarify', v)}
            />
          )}
          {phase === 1 && reviewQuestion(0)}
          {phase === 3 && (
            <Choices
              id={e.id + 'edges'}
              question="Which tests help defend your implementation?"
              options={[
                'Empty/minimal inputs, boundaries, duplicates where allowed, and no-solution cases.',
                'Only the happy-path example.',
                'Repeat the same input with a different variable name.',
              ]}
              value={p.answers['boss-edges']}
              onChange={(v) => setAnswer('boss-edges', v)}
            />
          )}
          {phase === 4 && (
            <>
              {reviewQuestion(1)}
              {reviewQuestion(2)}
            </>
          )}
          {phase !== 2 && phase !== 4 && (
            <button
              className="button"
              onClick={() => {
                const ok =
                  phase === 0
                    ? p.answers['boss-clarify'] === '0'
                    : phase === 1
                      ? p.answers['boss-0'] === String(review[0][2])
                      : p.answers['boss-edges'] === '0';
                if (ok) {
                  setAnswer(phaseKey, String(phase + 1));
                  F('');
                } else F('Revisit the requirements and your invariant before continuing.');
              }}
            >
              Next interview phase →
            </button>
          )}
          {phase > 0 && (
            <button className="button" onClick={() => setAnswer(phaseKey, String(phase - 1))}>
              Previous phase
            </button>
          )}
          <button
            className="button"
            onClick={() => {
              patch({
                drafts: { ...p.drafts, [m.task!]: starter(m.task!) },
                hints: { ...p.hints, [m.task!]: 0 },
                answers: {
                  ...p.answers,
                  [phaseKey]: '0',
                  'boss-0': '',
                  'boss-1': '',
                  'boss-2': '',
                  'boss-clarify': '',
                  'boss-edges': '',
                },
              });
              RETRY(retry + 1);
              READY(false);
              PRACTICE(false);
            }}
          >
            Start fresh independent attempt
          </button>
        </>
      )}
      {m.task && (m.activity !== 'interview' || phase === 2) && (
        <SeasonCode
          key={m.id + '-' + retry}
          task={m.task}
          progress={p}
          patch={patch}
          qa={m.activity === 'qa'}
          episode={e.id}
          independent={false}
          onHint={() => PRACTICE(true)}
          onInvalidated={() => READY(false)}
          onAccepted={() => {
            READY(true);
            if (m.activity === 'interview') setAnswer(phaseKey, '3');
          }}
        />
      )}
      {m.activity === 'interview' && phase === 4 && (
        <div className="checkout-score">
          <h4>Interview scorecard</h4>
          <p>
            Correctness: {ready ? 40 : 0}/40 · Efficiency: {ready ? 25 : 0}/25 · Edge-case
            reasoning: {p.answers['boss-edges'] === '0' ? 15 : 0}/15 · Explanation:{' '}
            {review.every((q, i) => p.answers['boss-' + i] === String(q[2])) ? 20 : 0}/20
          </p>
          <p>
            {ready
              ? 'Implementation and review tests passed this attempt.'
              : 'Return to Implement and submit your code to complete this attempt.'}
          </p>
        </div>
      )}
      <p role="status">{feedback}</p>
      <footer className="checkout-footer">
        <span>
          +{m.xp} XP ·{' '}
          {m.activity === 'interview'
            ? 'Interview readiness requires an independent pass.'
            : 'Progress saves automatically.'}
        </span>
        <button
          className="button button-primary"
          disabled={
            !(m.activity === 'interview'
              ? canDeliver &&
                phase === 4 &&
                review.every((q, i) => p.answers['boss-' + i] === String(q[2]))
              : canDeliver)
          }
          onClick={() => onComplete(m.id, independent)}
        >
          Deliver mission →
        </button>
      </footer>
    </div>
  );
}
function SeasonCode({
  task,
  progress: p,
  patch,
  qa,
  episode,
  independent,
  onAccepted,
  onInvalidated,
  onHint,
  autoDeliver = false,
}: {
  task: string;
  progress: EpisodeSave;
  patch: (p: Partial<EpisodeSave>) => void;
  qa: boolean;
  episode?: string;
  independent: boolean;
  onAccepted: () => void;
  onInvalidated?: () => void;
  onHint?: () => void;
  autoDeliver?: boolean;
}) {
  const t = TASKS[task],
    code =
      p.drafts[task] ??
      (task === 'gift' && p.drafts.payment
        ? p.drafts.payment +
          '\npublic static class GiftCardPayment implements PaymentMethod {\n    public String pay(int cents) { return ""; }\n}'
        : starter(task));
  const [busy, B] = useState(false),
    [result, RESULT] = useState<Assessment | null>(null),
    [error, E] = useState(''),
    [accepted, A] = useState(false);
  const hints = p.hints[task] ?? 0,
    custom = p.custom[task] ?? ['', ''];
  const predictions = episode ? QA[episode] : [];
  const predictReady = !qa || predictions.every((q, i) => p.answers['qa-' + i] === q[1]);
  const invalidate = () => {
    RESULT(null);
    A(false);
    E('');
    onInvalidated?.();
  };
  const run = async (submit: boolean) => {
    invalidate();
    B(true);
    try {
      let parsed: unknown[] = [];
      if (qa) {
        if (!predictReady)
          throw new Error('Predict every case correctly before executing your QA assessment.');
        if (custom.some((s) => !s.trim()))
          throw new Error('Write two additional tests before QA delivery.');
        parsed = custom.map((s) => JSON.parse(s));
        if (canonical(parsed[0]) === canonical(parsed[1]))
          throw new Error('Your two tests must use different inputs.');
      }
      const r = await request('/api/season', { task, code, submit, custom: parsed });
      RESULT(r);
      if (submit && r.passed) {
        A(true);
        if (!autoDeliver) onAccepted();
      }
    } catch (e) {
      E(e instanceof Error ? e.message : 'Assessment failed.');
    } finally {
      B(false);
    }
  };
  return (
    <div className="checkout-coding">
      <h4>{t.title}</h4>
      <p>{t.contract}</p>
      {!t.sql && (
        <details>
          <summary>Java editor contract and provided models</summary>
          <p>
            Write only the supplied method, or the named nested classes for architecture tasks.
            java.util collections are imported. Use braces on for/while loop bodies. Files, sockets,
            processes, reflection, exception handling, imports, and runtime access are unavailable.
            Runs have memory, time and operation limits.
          </p>
          <pre>
            {
              'ListNode: int value; ListNode next;\nFolder: String[] files; Folder[] children;\nTreeNode: int value; TreeNode left, right;\nConstructors: ListNode(int), TreeNode(int), Folder(String[], Folder[])'
            }
          </pre>
          <p>
            Efficiency checks measure operation growth on controlled inputs and restrict allocations
            for constant-space tasks. They do not prove arbitrary program complexity.
          </p>
        </details>
      )}
      {t.sql && (
        <div className="season-schema">
          <strong>Live SQLite schema</strong>
          <pre>
            {
              'customers(id INTEGER PRIMARY KEY, name TEXT)\norders(id INTEGER PRIMARY KEY, customer_id INTEGER)\npayments(id INTEGER PRIMARY KEY, order_id INTEGER, amount INTEGER)'
            }
          </pre>
          <p>
            Seed: customers 1 Ana, 2 Mihai, 3 Sara, 4 David; orders 101→1, 102→2, 103→2; payments
            201→101, 202→103, 203→103. Review uses other IDs and relationships.
          </p>
        </div>
      )}
      {qa && (
        <div className="season-qa">
          <h4>Predict before running</h4>
          {predictions.map(([input, answer], i) => {
            const opts = [
              answer,
              ...['pair', 'none', '0', '1', 'EMPTY', 'not true']
                .filter((x) => x !== answer)
                .slice(0, 2),
            ];
            return (
              <Choices
                key={i}
                id={'qa' + episode + i}
                question={input}
                options={opts}
                value={
                  p.answers['qa-' + i] === undefined
                    ? undefined
                    : String(opts.indexOf(p.answers['qa-' + i]))
                }
                onChange={(v) => {
                  invalidate();
                  patch({ answers: { ...p.answers, ['qa-' + i]: opts[Number(v)] } });
                }}
              />
            );
          })}
          <h4>Your two additional tests</h4>
          <p>
            {t.sql
              ? 'Enter two different JSON strings containing alternative queries that satisfy this ticket.'
              : task === 'sorted'
                ? 'JSON: {"values":[1,3,5],"target":6}'
                : task === 'traffic'
                  ? 'JSON: {"values":[3,8,4],"k":2}'
                  : task === 'redo'
                    ? 'JSON command array: ["ADD:A","UNDO","REDO"]'
                    : task === 'failing'
                      ? 'JSON monotone boolean array: [false,true,true]'
                      : task === 'gift'
                        ? 'JSON integer cents, such as 125'
                        : task === 'reverse'
                          ? 'JSON integer node count, 0–32'
                          : 'JSON integer nested-folder count, 0–32'}
          </p>
          {[0, 1].map((i) => (
            <textarea
              key={i}
              aria-label={`Additional test ${i + 1}`}
              value={custom[i]}
              maxLength={1000}
              disabled={busy}
              onChange={(ev) => {
                invalidate();
                const a = [...custom];
                a[i] = ev.target.value;
                patch({ custom: { ...p.custom, [task]: a } });
              }}
            />
          ))}
        </div>
      )}
      <CodeEditor
        code={code}
        language={t.sql ? 'SQL' : 'Java'}
        disabled={busy}
        onChange={(v) => {
          invalidate();
          patch({ drafts: { ...p.drafts, [task]: v } });
        }}
        onRun={() => void run(false)}
        maxLength={t.sql ? 6000 : 12000}
      />
      <div className="checkout-actions">
        <button className="button" disabled={busy} onClick={() => void run(false)}>
          {busy ? 'Running…' : 'Run samples'}
        </button>
        <button className="button button-primary" disabled={busy} onClick={() => void run(true)}>
          Submit for review
        </button>
        {!independent && hints < 4 && t.hints.length > 0 && (
          <button
            className="button"
            disabled={busy}
            onClick={() => {
              patch({ hints: { ...p.hints, [task]: hints + 1 } });
              onHint?.();
            }}
          >
            Reveal hint · {hints}/4
          </button>
        )}
      </div>
      {!independent &&
        t.hints.slice(0, hints).map((h, i) => (
          <p className="checkout-hints" key={i}>
            Hint {i + 1}: {h}
          </p>
        ))}
      {error && (
        <p className="checkout-feedback" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="checkout-results" aria-live="polite">
          {result.tests.map((test, i) => (
            <div key={i} className={test.passed ? 'checkout-good' : 'checkout-feedback'}>
              <strong>
                {test.passed ? '✓' : '✗'} {test.name}
              </strong>
              {test.input && (
                <p>
                  Input: {test.input} · Expected: {test.expected}
                </p>
              )}
              {test.error && <p>{test.error}</p>}
            </div>
          ))}
          {result.reviewPassed !== null && (
            <p>
              Hidden review: {result.reviewPassed ? 'passed' : 'needs work'} · Efficiency:{' '}
              {result.efficiencyPassed ? 'accepted' : 'needs work'}
            </p>
          )}
          {result.columns && (
            <div className="season-results">
              <table>
                <thead>
                  <tr>
                    {result.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows?.map((row, i) => (
                    <tr key={i}>
                      {result.columns!.map((c) => (
                        <td key={c}>{row[c] === null ? 'NULL' : String(row[c])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p>
            {accepted
              ? 'Review accepted. You can deliver this checkpoint.'
              : result.passed
                ? 'Samples passed. Submit for hidden review.'
                : 'Trace the failing cases and adjust your implementation.'}
          </p>
        </div>
      )}
      {autoDeliver && (
        <button className="button button-primary" disabled={!accepted || busy} onClick={onAccepted}>
          Certify independent mastery
        </button>
      )}
    </div>
  );
}
function SeasonRoom({
  episode: e,
  answers,
  patch,
}: {
  episode: Episode;
  answers: Record<string, string>;
  patch: (p: Partial<EpisodeSave>) => void;
}) {
  const labs: Record<string, string> = {
    warehouse: 'pointers',
    traffic: 'window',
    stack: 'stack',
    binary: 'binary',
    lists: 'cycle',
    recursion: 'calls',
    sql2: 'join',
    oop: 'polymorphism',
  };
  const [station, S] = useState(false),
    [debug, DEBUG] = useState(false);
  return (
    <div className={'season-room room-' + e.id}>
      <h3>{debug ? 'Debugging Lab' : e.room}</h3>
      {e.id === 'traffic' && (
        <button
          className="button"
          onClick={() => {
            DEBUG(!debug);
            S(false);
          }}
        >
          Visit {debug ? 'Server Monitoring Room' : 'Debugging Lab'} →
        </button>
      )}
      <div className="season-room-scene">
        <div className="season-room-window">PIXELBYTE / {e.concept.toUpperCase()}</div>
        <div className="season-room-props">
          <span>{e.id === 'lists' ? '⚙' : e.id === 'recursion' ? '▥' : '▦'}</span>
          <button
            className="season-room-station"
            onClick={() => S(!station)}
            aria-expanded={station}
          >
            ▣<br />
            Open practice station
          </button>
          <span>{e.id === 'warehouse' ? '⚒' : e.id === 'sql2' ? '⌕' : '▤'}</span>
        </div>
        <div className="season-room-floor" />
      </div>
      <p>
        {e.reward} is part of your collection. This room’s practice station stays available after
        delivery.
      </p>
      {station && (
        <SeasonLab
          activity={debug ? 'variable' : labs[e.id]}
          episode={e.id}
          answers={answers}
          setAnswer={(k, v) => patch({ answers: { ...answers, [k]: v } })}
          onReady={() => {}}
        />
      )}
    </div>
  );
}
