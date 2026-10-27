import { useEffect, useRef, useState } from 'react';
import { CHECKOUT_MISSIONS, checkoutStatus, PAIR_STARTER } from '../lib/checkout.mjs';
import { request } from '../lib/platform';
import type { CheckoutSave, Save } from '../types';
import { CodeEditor } from './CodeEditor';

type Question = { id: string; prompt: string; options: string[]; correct: number; why: string };
const DATA: Question[] = [
  {
    id: 'index',
    prompt: 'In [20, 45, 80, 55], what is vouchers[2]?',
    options: ['45', '80', '55'],
    correct: 1,
    why: 'Java indices start at zero: index 0 is 20, index 1 is 45, index 2 is 80.',
  },
  {
    id: 'output',
    prompt: 'Which indices identify 45 and 55?',
    options: ['[45, 55]', '[2, 4]', '[1, 3]'],
    correct: 2,
    why: 'The output identifies positions, so return [1, 3]. Index 1 is the second element.',
  },
  {
    id: 'contract',
    prompt: 'Choose the complete function contract.',
    options: [
      'Return different indices; allow duplicates and negatives; return [] if no pair exists; accept any valid pair.',
      'Return voucher values and always assume a pair exists.',
      'Return one index twice if its value is half the target.',
    ],
    correct: 0,
    why: 'Two different array entries are required. Equal values can represent different vouchers.',
  },
];
const COST: Question[] = [
  {
    id: 'cost',
    prompt: 'What happens when the input roughly doubles?',
    options: [
      'The worst-case pair count roughly doubles: O(n).',
      'The worst-case pair count roughly quadruples: O(n²).',
      'The pair count stays the same: O(1).',
    ],
    correct: 1,
    why: 'There are n × (n − 1) / 2 unordered pairs. That grows quadratically.',
  },
];
const LAB: Question[] = [
  {
    id: 'complement',
    prompt: 'The target is 100 and the current voucher is 45. Which key do you need?',
    options: ['45', '100', '55'],
    correct: 2,
    why: 'The missing value is target − currentValue: 100 − 45 = 55.',
  },
];
const QA: Question[] = [
  {
    id: 'qa-twin',
    prompt: 'Twin vouchers: [50, 50], target 100',
    options: ['[0, 1]', '[]', '[0, 0]'],
    correct: 0,
    why: 'The values match, but the two indices are different.',
  },
  {
    id: 'qa-lonely',
    prompt: 'Lonely voucher: [100], target 100',
    options: ['[0, 0]', '[]', '[0, 1]'],
    correct: 1,
    why: 'One voucher cannot supply two different indices.',
  },
  {
    id: 'qa-empty',
    prompt: 'Empty wallet: [], target 100',
    options: ['[0, 0]', 'Throw an error', '[]'],
    correct: 2,
    why: 'No pair exists. Return an empty array without accessing an element.',
  },
  {
    id: 'qa-refund',
    prompt: 'Refund credit: [-20, 120], target 100',
    options: ['[]', '[0, 1]', '[1, 1]'],
    correct: 1,
    why: 'Negative values are valid: −20 + 120 = 100.',
  },
  {
    id: 'qa-none',
    prompt: 'No matching pair: [10, 25, 30], target 100',
    options: ['[1, 2]', '[0, 2]', '[]'],
    correct: 2,
    why: 'Checking the possible pairs finds no sum of 100.',
  },
];
const REVIEW: Question[] = [
  {
    id: 'review-brute',
    prompt: 'What is the worst-case time cost of checking all pairs?',
    options: [
      'O(n²), since each item is compared with many others.',
      'O(n), since there is one array.',
      'O(1), since only two indices are returned.',
    ],
    correct: 0,
    why: 'Output size does not determine how much work the search performs.',
  },
  {
    id: 'review-map',
    prompt: 'Why does a HashMap help?',
    options: [
      'It sorts the vouchers automatically.',
      'It provides expected constant-time lookup of a previously seen complement.',
      'It guarantees constant time for the whole method.',
    ],
    correct: 1,
    why: 'Each iteration asks whether its complement has already been encountered.',
  },
  {
    id: 'review-space',
    prompt: 'What are the expected time and extra space costs?',
    options: [
      'O(n) time and O(1) extra space.',
      'O(n²) time and O(n²) space.',
      'O(n) time and O(n) extra space: the map may hold up to n entries.',
    ],
    correct: 2,
    why: 'The speed improvement uses storage for previously visited values and indices.',
  },
  {
    id: 'review-order',
    prompt: 'Why check the complement before inserting the current voucher?',
    options: [
      'The lookup can only find an earlier index, preventing reuse of the current voucher.',
      'HashMap requires keys to be inserted in sorted order.',
      'Duplicate values are not allowed in arrays.',
    ],
    correct: 0,
    why: 'For [50, 50], the second 50 can find the first. The first cannot find itself.',
  },
];
const INTERVIEW: Question[] = [
  {
    id: 'interview-contract',
    prompt: 'Which clarification matches the transaction contract?',
    options: [
      'Duplicates and negatives are allowed; return different indices or [] if no pair exists.',
      'Every input has exactly one answer.',
      'Return the two transaction amounts.',
    ],
    correct: 0,
    why: 'Clarify input values, whether a solution is guaranteed, and the requested output.',
  },
  {
    id: 'interview-plan',
    prompt: 'How will you avoid searching all pairs?',
    options: [
      'Compare every pair twice.',
      'Track earlier amounts and look for target minus the current amount.',
      'Sort and return the sorted positions without tracking the original indices.',
    ],
    correct: 1,
    why: 'Earlier amounts give you a searchable history while preserving original indices.',
  },
  {
    id: 'interview-edge',
    prompt: 'Which tests protect the distinct-index rule and absence of a solution?',
    options: [
      'Only a large input with one guaranteed pair.',
      '[6, 6] → 12, [6] → 12, [] → 12, and a negative-value pair.',
      'Only positive, unique transaction amounts.',
    ],
    correct: 1,
    why: 'Duplicate values need different indices. Empty and singleton inputs must not reuse an entry.',
  },
  {
    id: 'interview-cost',
    prompt: 'Explain the tradeoff.',
    options: [
      'Expected O(n) time, O(n) extra space; HashMap lookup is expected O(1), not guaranteed in every situation.',
      'Guaranteed O(1) total time and O(1) space.',
      'O(n²) space because the map stores all possible pairs.',
    ],
    correct: 0,
    why: 'One pass makes a constant number of expected constant-time map operations per entry.',
  },
];
const HINTS = [
  'Think about what information you need from the entries you have already visited.',
  'For the current amount, compute target minus that amount. Have you seen that complement?',
  'Store amount → original index in a HashMap<Integer, Integer>. Use containsKey and get.',
  'Check for an earlier complement before calling put for the current index. Return [] only after the loop.',
];
const TRACE_PAIRS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];
type Evaluation = {
  passed: boolean;
  reviewPassed: boolean | null;
  efficiencyPassed: boolean | null;
  tests: {
    name: string;
    values: number[];
    target: number;
    actual: number[] | null;
    passed: boolean;
    error?: string;
    operations?: number;
  }[];
};
export function CheckoutArc({
  save,
  update,
  onComplete,
  initialMission,
}: {
  initialMission?: number;
  save: Save;
  update: (patch: Partial<Save>) => void;
  onComplete: (id: string, independent?: boolean) => void;
}) {
  const [selected, setSelected] = useState(
    Math.min(initialMission ?? save.checkout.completed.length, 8),
  );
  return (
    <div className="checkout-layout">
      <nav className="checkout-nav" aria-label="Checkout missions">
        <span className="eyebrow">BENTOCART · TICKET #204</span>
        <h3>The Checkout Incident</h3>
        <p>One problem. Nine steps from incident to interview.</p>
        {CHECKOUT_MISSIONS.map((m, i) => (
          <button
            key={m.id}
            disabled={checkoutStatus(save, m.id) === 'locked'}
            aria-current={selected === i ? 'step' : undefined}
            onClick={() => setSelected(i)}
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
          </button>
        ))}
        <p>{save.checkout.completed.length}/9 delivered · Progress saves automatically</p>
      </nav>
      <CheckoutMission
        key={selected}
        save={save}
        index={selected}
        update={update}
        onComplete={onComplete}
        onNext={() => setSelected(Math.min(selected + 1, 8))}
      />
    </div>
  );
}
function CheckoutMission({
  save,
  index,
  update,
  onComplete,
  onNext,
}: {
  save: Save;
  index: number;
  update: (patch: Partial<Save>) => void;
  onComplete: (id: string, independent?: boolean) => void;
  onNext: () => void;
}) {
  const state = save.checkout,
    mission = CHECKOUT_MISSIONS[index],
    id = mission.id;
  const [selected, setSelected] = useState<number[]>([]);
  const [trace, setTrace] = useState(0);
  const [size, setSize] = useState(100);
  const [mapAction, setMapAction] = useState('Click a drawer to inspect the stored index.');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [evaluation, setEvaluation] = useState<{
    result: Evaluation;
    fingerprint: string;
    submitted: boolean;
  } | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const patch = (p: Partial<CheckoutSave>) => update({ checkout: { ...state, ...p } });
  const answer = (key: string, value: string) =>
    patch({ answers: { ...state.answers, [key]: value } });
  const correct = (q: Question) => state.answers[q.id] === String(q.correct);
  const all = (qs: Question[]) => qs.every(correct);
  const codeKey = id === 'brute' ? 'brute' : id === 'interview' ? 'interview' : 'optimize';
  const code = state.drafts[codeKey];
  const fingerprint = JSON.stringify([code, id === 'qa' ? state.custom : []]);
  const current = evaluation?.fingerprint === fingerprint ? evaluation : null;
  const accepted = !!current?.submitted && current.result.passed;
  const done = state.completed.includes(id);
  const predictions = all(QA);
  const reasoning = all(INTERVIEW);
  const readCustom = () => {
    const custom = state.custom.map((text) => {
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(
          'Write two JSON tests, each with values and target. Example: {"values":[1,4],"target":5}',
        );
      }
    });
    if (
      JSON.stringify([custom[0]?.values, custom[0]?.target]) ===
      JSON.stringify([custom[1]?.values, custom[1]?.target])
    )
      throw new Error('Use two different additional test cases.');
    return custom;
  };
  const run = async (submit: boolean) => {
    if (busy) return;
    if (id === 'qa' && !predictions) {
      setError('Predict the five edge cases before running your code.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const custom = id === 'qa' ? readCustom() : [];
      const result: Evaluation = await request('/api/pair', {
        code,
        submit,
        optimized: id !== 'brute',
        interview: id === 'interview',
        custom,
      });
      if (!mounted.current) return;
      setEvaluation({ result, fingerprint, submitted: submit });
      if (id === 'interview' && submit)
        patch({
          score: {
            correctness: result.tests.every((t) => t.passed) && result.reviewPassed ? 40 : 0,
            efficiency: result.efficiencyPassed ? 25 : 0,
            edges: result.reviewPassed ? 15 : 0,
            reasoning: INTERVIEW.filter(correct).length * 5,
          },
        });
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e.message : 'The check could not finish.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const questions = (items: Question[]) => (
    <div className="checkout-questions">
      {items.map((q) => (
        <fieldset key={q.id} className="checkout-question">
          <legend>{q.prompt}</legend>
          {q.options.map((option, i) => (
            <label key={option} className={state.answers[q.id] === String(i) ? 'selected' : ''}>
              <input
                type="radio"
                name={q.id}
                checked={state.answers[q.id] === String(i)}
                onChange={() => answer(q.id, String(i))}
              />
              {option}
            </label>
          ))}
          {state.answers[q.id] !== undefined && (
            <p className={correct(q) ? 'checkout-good' : 'checkout-feedback'} role="status">
              {correct(q) ? '✓ ' : 'Try another explanation. '}
              {q.why}
            </p>
          )}
        </fieldset>
      ))}
    </div>
  );
  const editor = (
    <div className="checkout-coding">
      <div className="checkout-editor-heading">
        <strong>{id === 'interview' ? 'Reconciliation.java' : 'VoucherMatcher.java'}</strong>
        <span>Java · bounded practice runtime</span>
      </div>
      <details>
        <summary>Supported Java syntax</summary>
        <p>
          Provide only public static int[] findPair(int[] values, int target). Parameter names are
          yours to choose. Supported: int variables, arithmetic and comparisons, if/else, for (int i
          = 0; …; i++), array reads, .length, new int[] &#123;…&#125;, new int[0], and
          HashMap&lt;Integer, Integer&gt; with put, get, containsKey. Imports, class wrappers, array
          writes, and other Java APIs are outside this practice runtime. Checks are deterministic;
          operation counts assess the tested growth pattern, not a general complexity proof.
        </p>
      </details>
      <CodeEditor
        code={code}
        language="Java"
        disabled={busy}
        maxLength={8000}
        onChange={(text) => patch({ drafts: { ...state.drafts, [codeKey]: text } })}
        onRun={() => void run(false)}
      />
      <div className="checkout-actions">
        <button
          className="button button-secondary"
          disabled={busy || (id === 'qa' && !predictions)}
          onClick={() => void run(false)}
        >
          {busy ? 'Checking…' : 'Run samples'}
        </button>
        <button
          className="button button-primary"
          disabled={busy || (id === 'qa' && !predictions)}
          onClick={() => void run(true)}
        >
          Submit for review
        </button>
      </div>
      {error && (
        <p className="checkout-feedback" role="alert">
          {error}
        </p>
      )}
      {current && (
        <div className="checkout-results" aria-live="polite">
          {current.result.tests.map((t, i) => (
            <div key={i} className={t.passed ? 'checkout-good' : 'checkout-feedback'}>
              <strong>
                {t.passed ? '✓' : '×'} {t.name}
              </strong>
              <code>
                [{t.values.join(', ')}] → {t.target} · returned {JSON.stringify(t.actual)}
              </code>
              <small>
                {t.error ||
                  (t.passed
                    ? 'Valid result for the function contract.'
                    : 'Expected different valid indices, or [] only when no pair exists.')}
              </small>
            </div>
          ))}
          {current.submitted && (
            <p>
              {current.result.reviewPassed
                ? '✓ Hidden edge cases passed.'
                : 'Hidden edge cases need work. Check duplicates, empty input, negatives, and reusing an index.'}{' '}
              {id !== 'brute' &&
                (current.result.efficiencyPassed
                  ? '✓ Instrumented growth check passed.'
                  : 'Efficiency check needs work. Use a map to look up earlier values and avoid checking all pairs.')}
            </p>
          )}
        </div>
      )}
      {id !== 'qa' && (
        <div className="checkout-hints">
          <button
            className="text-button"
            disabled={busy || state.hints[codeKey] >= 4}
            onClick={() =>
              patch({ hints: { ...state.hints, [codeKey]: state.hints[codeKey] + 1 } })
            }
          >
            Reveal hint · {state.hints[codeKey]}/4
            {id === 'interview' ? ' · switches to Practice Mode' : ''}
          </button>
          {HINTS.slice(0, state.hints[codeKey]).map((h) => (
            <p key={h}>
              {id === 'brute'
                ? [
                    'Use two loop indices so each identifies a voucher.',
                    'Start the second index after the first index.',
                    'Compare the sum at the two indices with target.',
                    'Return the indices on a match; return [] after both loops.',
                  ][HINTS.indexOf(h)]
                : h}
            </p>
          ))}
        </div>
      )}
    </div>
  );
  let canComplete = false;
  if (id === 'incident')
    canComplete =
      selected.length === 2 && selected.reduce((n, i) => n + [20, 45, 80, 55][i], 0) === 100;
  if (id === 'data') canComplete = all(DATA);
  if (id === 'brute' || id === 'optimize') canComplete = accepted;
  if (id === 'cost') canComplete = all(COST) && state.answers['cost-explored'] === 'yes';
  if (id === 'lab')
    canComplete =
      all(LAB) && ['lab-put', 'lab-get', 'lab-contains'].every((k) => state.answers[k] === 'yes');
  if (id === 'qa') canComplete = predictions && accepted;
  if (id === 'review') canComplete = all(REVIEW);
  if (id === 'interview') canComplete = accepted && reasoning && state.phase === 4;
  const phases = ['Clarify', 'Explain approach', 'Implement', 'Test edge cases', 'Discuss cost'];
  return (
    <section className="checkout-mission">
      <span className="eyebrow">
        MISSION {String(index + 1).padStart(2, '0')} / 09 · {mission.phase.toUpperCase()}
      </span>
      <h2>{mission.title}</h2>
      <p className="checkout-location">
        {mission.location} · +{mission.xp} XP
      </p>
      <div className="checkout-dialogue">
        <strong>{mission.npc}</strong>
        <p>{mission.dialogue}</p>
      </div>
      {done && (
        <p className="checkout-good">
          ✓ Mission delivered. You can revisit it without duplicating rewards.
        </p>
      )}
      {id === 'incident' && (
        <>
          <h3>Voucher matcher · Target 100</h3>
          <div className="voucher-grid">
            {[20, 45, 80, 55].map((v, i) => (
              <button
                key={i}
                aria-pressed={selected.includes(i)}
                className={selected.includes(i) ? 'selected' : ''}
                onClick={() =>
                  setSelected(
                    selected.includes(i)
                      ? selected.filter((x) => x !== i)
                      : selected.length < 2
                        ? [...selected, i]
                        : selected,
                  )
                }
              >
                <strong>{v}</strong>
                <small>Voucher {i + 1}</small>
              </button>
            ))}
          </div>
          <p aria-live="polite">
            Selected {selected.length}/2 · Total{' '}
            {selected.reduce((n, i) => n + [20, 45, 80, 55][i], 0)} / 100
          </p>
          <button className="text-button" onClick={() => setSelected([])}>
            Reset selection
          </button>
          {canComplete && (
            <p className="checkout-good">Nora: “Nice! Now imagine 10,000 vouchers. Go see Alex.”</p>
          )}
        </>
      )}
      {id === 'data' && (
        <>
          <div className="array-lab">
            {[20, 45, 80, 55].map((v, i) => (
              <div key={i}>
                <strong>{v}</strong>
                <small>index {i}</small>
              </div>
            ))}
          </div>
          <div className="checkout-contract">
            <span>INPUT · int[] vouchers, int target</span>
            <span>PROCESS · find two different entries</span>
            <span>OUTPUT · int[] indices, or []</span>
          </div>
          {questions(DATA)}
        </>
      )}
      {id === 'brute' && (
        <div className="pair-trace">
          <h3>Trace the candidate pairs</h3>
          <p>
            Two cursors identify different positions. Step through the unordered pairs and compare
            their sum with 100.
          </p>
          <div className="array-lab">
            {[20, 45, 80, 55].map((v, i) => (
              <div key={i} className={TRACE_PAIRS[trace].includes(i) ? 'current' : ''}>
                <strong>{v}</strong>
                <small>index {i}</small>
                <span>
                  {i === TRACE_PAIRS[trace][0] ? 'A' : i === TRACE_PAIRS[trace][1] ? 'B' : '·'}
                </span>
              </div>
            ))}
          </div>
          <p aria-live="polite">
            Pair {trace + 1}/6 · Sum{' '}
            {TRACE_PAIRS[trace].reduce((n, i) => n + [20, 45, 80, 55][i], 0)}
          </p>
          <button className="button button-secondary" onClick={() => setTrace((trace + 1) % 6)}>
            Next pair →
          </button>
        </div>
      )}
      {(id === 'brute' || id === 'optimize') && editor}
      {id === 'cost' && (
        <>
          <label className="form-label">
            Number of vouchers: {size.toLocaleString()}
            <input
              type="range"
              min="10"
              max="10000"
              step="10"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                answer('cost-explored', 'yes');
              }}
            />
          </label>
          <div className="checkout-metrics">
            <div>
              <small>Possible pairs · worst case</small>
              <strong>{((size * (size - 1)) / 2).toLocaleString()}</strong>
              <span>n × (n − 1) / 2</span>
            </div>
            <div>
              <small>Single-pass visits</small>
              <strong>{size.toLocaleString()}</strong>
              <span>n visits, plus map operations</span>
            </div>
          </div>
          <p>
            Move the slider to compare the growth. At 10,000 vouchers, checking all pairs can mean
            49,995,000 comparisons.
          </p>
          {questions(COST)}
        </>
      )}
      {id === 'lab' && (
        <>
          <h3>Key → value drawers</h3>
          <p>The key is a voucher value. The stored value is its original index.</p>
          <div className="voucher-grid">
            {[20, ...(state.answers['lab-put'] === 'yes' ? [45] : [])].map((v, i) => (
              <button
                key={v}
                onClick={() => {
                  setMapAction(`get(${v}) → ${i}. Key ${v} stores original index ${i}.`);
                  answer('lab-get', 'yes');
                }}
              >
                <strong>{v}</strong>
                <small>key · click to get()</small>
              </button>
            ))}
          </div>
          <div className="checkout-actions">
            <button
              className="button button-secondary"
              onClick={() => {
                answer('lab-put', 'yes');
                setMapAction('put(45, 1) stored voucher value 45 → index 1.');
              }}
            >
              put(45, 1)
            </button>
            <button
              className="button button-secondary"
              onClick={() => {
                answer('lab-contains', 'yes');
                setMapAction(`containsKey(55) → false. We have not stored a voucher worth 55 yet.`);
              }}
            >
              containsKey(55)
            </button>
          </div>
          <p className="checkout-feedback" role="status">
            {mapAction}
          </p>
          <p>
            Try put(), click a drawer for get(), and check containsKey(). Reinserting the same key
            replaces its stored value; it does not create a second key.
          </p>
          {questions(LAB)}
        </>
      )}
      {id === 'qa' && (
        <>
          {questions(QA)}
          <h3>Your two additional tests</h3>
          <p>
            Write each test as JSON with values and target. For example:
            &#123;"values":[1,4],"target":5&#125;. Use two different cases. Predict all five cases
            above before running.
          </p>
          {state.custom.map((text, i) => (
            <label className="form-label" key={i}>
              Additional test {i + 1}
              <textarea
                disabled={busy}
                maxLength={1000}
                value={text}
                onChange={(e) =>
                  patch({ custom: state.custom.map((v, n) => (n === i ? e.target.value : v)) })
                }
                placeholder={'{"values":[...],"target":...}'}
              />
            </label>
          ))}
          {editor}
        </>
      )}
      {id === 'review' && questions(REVIEW)}
      {id === 'interview' && (
        <>
          <div className="interview-phases">
            {phases.map((p, i) => (
              <span className={state.phase === i ? 'selected' : ''} key={p}>
                {i + 1} · {p}
              </span>
            ))}
          </div>
          <p className="eyebrow">
            {state.hints.interview
              ? 'PRACTICE MODE · GUIDED ATTEMPT'
              : 'INDEPENDENT ATTEMPT · NO HINTS USED'}
          </p>
          {state.phase === 0 && questions([INTERVIEW[0]])}
          {state.phase === 1 && questions([INTERVIEW[1]])}
          {(state.phase === 2 || state.phase === 3 || state.phase === 4) && editor}
          {state.phase === 3 && questions([INTERVIEW[2]])}
          {state.phase === 4 && questions([INTERVIEW[3]])}
          <div className="checkout-actions">
            <button
              className="button button-secondary"
              disabled={busy || state.phase === 0}
              onClick={() => patch({ phase: state.phase - 1 })}
            >
              Previous phase
            </button>
            <button
              className="button button-secondary"
              disabled={
                busy ||
                state.phase === 4 ||
                (state.phase < 2 && !correct(INTERVIEW[state.phase])) ||
                (state.phase === 2 && !accepted) ||
                (state.phase === 3 && !correct(INTERVIEW[2]))
              }
              onClick={() => patch({ phase: state.phase + 1 })}
            >
              Next phase
            </button>
          </div>
          {state.score && (
            <div className="checkout-score">
              <h3>Interview scorecard</h3>
              {Object.entries({ correctness: 40, efficiency: 25, edges: 15, reasoning: 20 }).map(
                ([key, max]) => (
                  <p key={key}>
                    <span>
                      {key === 'edges'
                        ? 'Edge cases'
                        : key === 'reasoning'
                          ? 'Reasoning & communication'
                          : key}
                    </span>
                    <strong>
                      {key === 'reasoning'
                        ? INTERVIEW.filter(correct).length * 5
                        : state.score![key]}{' '}
                      / {max}
                    </strong>
                  </p>
                ),
              )}
              <p>
                <span>Total</span>
                <strong>
                  {Object.entries(state.score)
                    .filter(([key]) => key !== 'reasoning')
                    .reduce((n, [, value]) => n + value, 0) +
                    INTERVIEW.filter(correct).length * 5}{' '}
                  / 100
                </strong>
              </p>
              <small>
                Submit again after edits to refresh the coding score. Review failed categories, then
                retry that phase.
              </small>
            </div>
          )}
          {state.hints.interview > 0 && (
            <button
              className="text-button"
              disabled={busy}
              onClick={() => {
                patch({
                  drafts: {
                    ...state.drafts,
                    interview: PAIR_STARTER.replaceAll('vouchers', 'transactions'),
                  },
                  hints: { ...state.hints, interview: 0 },
                  phase: 0,
                  score: null,
                });
                setEvaluation(null);
              }}
            >
              Start a fresh independent attempt (clears interview code)
            </button>
          )}
          {done && (
            <p className="checkout-good">
              {state.independent
                ? '✧ HashMap Detective · Interview Ready. Retention mastery will require a later challenge.'
                : 'Practice complete. Start a fresh attempt without hints to earn HashMap Detective.'}
            </p>
          )}
        </>
      )}
      <footer className="checkout-footer">
        <button
          className="button button-primary"
          disabled={busy || (!done && !canComplete) || (id === 'interview' && !canComplete)}
          onClick={() => {
            if (!done || (id === 'interview' && canComplete))
              onComplete(id, id === 'interview' && state.hints.interview === 0);
            if (done && index < 8) onNext();
          }}
        >
          {id === 'interview'
            ? state.hints.interview
              ? 'Finish in Practice Mode'
              : 'Complete interview'
            : done
              ? 'Next mission →'
              : 'Deliver mission →'}
        </button>
        <small>
          {!canComplete && !done
            ? 'Complete the activities above to deliver this mission.'
            : id === 'interview'
              ? 'Expected O(n) time · O(n) extra space'
              : 'Your next lead is waiting in the office.'}
        </small>
      </footer>
    </section>
  );
}
