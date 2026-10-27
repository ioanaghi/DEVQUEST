import { useState } from 'react';
import { REVIEW } from '../lib/season-content.mjs';
export function Choices({
  question,
  options,
  value,
  onChange,
  id,
}: {
  question: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  id: string;
}) {
  const offset = id.split('').reduce((n, c) => n + c.charCodeAt(0), 0) % options.length;
  return (
    <fieldset className="checkout-question">
      <legend>{question}</legend>
      {options.map((_, i) => {
        const index = (i + offset) % options.length;
        return (
          <label key={index}>
            <input
              type="radio"
              name={id}
              checked={value === String(index)}
              onChange={() => onChange(String(index))}
            />
            {options[index]}
          </label>
        );
      })}
    </fieldset>
  );
}
const LESSONS: Record<string, [string, string[], number]> = {
  sorted: [
    'What does ascending order guarantee?',
    [
      'Every next value is at least the previous one.',
      'All values must be different.',
      'The first two values always form the answer.',
    ],
    0,
  ],
  memory: [
    'Why choose Two Pointers here?',
    [
      'Already sorted input lets us use O(1) extra space instead of a growing map.',
      'HashMap uses no memory.',
      'Two Pointers works on every unsorted array.',
    ],
    0,
  ],
  fixed: [
    'For counts [3,8,4,12,6], which 3-minute window is busiest?',
    ['[4,12,6], sum 22', '[3,8,4], sum 15', '[8,4,12], sum 24'],
    2,
  ],
  lifo: [
    'Button, then text, then image were deleted. What should Undo restore first?',
    ['Image', 'Button', 'Text'],
    0,
  ],
  pushpop: ['push A, push B, pop, push C, peek. What is on top?', ['C', 'A', 'B'], 0],
  monotone: [
    'Which release history supports first-failure binary search?',
    ['good, good, bad, bad', 'bad, good, bad, good', 'Any random ordering'],
    0,
  ],
  boundary: ['What is the first failing index in [false,false,true,true]?', ['2', '3', '1'], 0],
  offby: [
    'When a passing midpoint is at left, how do you ensure progress?',
    ['Set left = mid + 1.', 'Set left = mid.', 'Leave left unchanged.'],
    0,
  ],
  links: [
    'Two nodes both contain 7. Are they necessarily the same stop?',
    ['No; compare node references.', 'Yes; values identify nodes.', 'Only when next is null.'],
    0,
  ],
  subproblem: [
    'How does a parent folder get its file count?',
    [
      'Its direct files plus every child folder result.',
      'Only its direct files.',
      'Only the deepest child result.',
    ],
    0,
  ],
  base: [
    'Which is a valid countFiles stopping case?',
    [
      'A null folder contributes zero.',
      'Call countFiles on the same folder again.',
      'Every folder contributes one file.',
    ],
    0,
  ],
  investigate: [
    'Accounts exist in the database but vanish in the dashboard. What should you inspect?',
    [
      'The dashboard query and its join/filter conditions.',
      'Delete and recreate every customer.',
      'Assume the database lost them.',
    ],
    0,
  ],
  schema: [
    'Which relationship connects orders to customers?',
    [
      'orders.customer_id refers to customers.id.',
      'orders.id equals customers.id.',
      'Customer names are unique foreign keys.',
    ],
    0,
  ],
  relation: [
    'Ana has one order, Mihai two, Sara and David none. How many LEFT JOIN rows?',
    ['5', '3', '4'],
    0,
  ],
  legacy: [
    'What makes a growing payment if/else chain hard to extend?',
    [
      'Every method changes the central processor and risks existing branches.',
      'Java forbids more than two if statements.',
      'Interfaces cannot handle payments.',
    ],
    0,
  ],
  responsibility: [
    'Which responsibility belongs to a concrete payment strategy?',
    [
      'The behavior of its payment method.',
      'Knowing every future payment type.',
      'Choosing every other strategy.',
    ],
    0,
  ],
  objects: [
    'What does a payment object provide?',
    [
      'Its implementation of the shared behavior.',
      'Only a string type tag for the processor to inspect.',
      'The entire application state.',
    ],
    0,
  ],
  interface: [
    'What should the central processor depend on?',
    [
      'PaymentMethod, a common interface.',
      'CardPayment and BankPayment individually.',
      'A switch on every class name.',
    ],
    0,
  ],
  polymorphism: [
    'An unseen PaymentMethod is passed to a delegating processor. What happens?',
    [
      'Its own pay implementation runs.',
      'The processor needs a new if branch first.',
      'It must be converted into CardPayment.',
    ],
    0,
  ],
};
export function SeasonLab({
  activity,
  episode,
  answers,
  setAnswer,
  onReady,
}: {
  activity: string;
  episode: string;
  answers: Record<string, string>;
  setAnswer: (k: string, v: string) => void;
  onReady: () => void;
}) {
  const [left, L] = useState(0),
    [right, R] = useState(5),
    [picked, P] = useState<number[]>([]),
    [step, S] = useState(0),
    [feedback, F] = useState(''),
    [undo, U] = useState<string[]>([]),
    [redo, D] = useState<string[]>([]),
    [start, W] = useState(0),
    [lo, LO] = useState(0),
    [hi, HI] = useState(15),
    [found, FOUND] = useState(-1);
  const [links, LINKS] = useState([1, 2, 3, -1]),
    [previous, PREVIOUS] = useState(-1),
    [current, CURRENT] = useState(0),
    [saved, SAVED] = useState(-1);
  const weights = [1, 3, 5, 6, 8, 11],
    traffic = [3, 8, 4, 12, 6, 9, 2, 7];
  const done = () => {
    setAnswer('lab-' + activity, 'done');
    onReady();
  };
  const complete = answers['lab-' + activity] === 'done';
  const lesson = LESSONS[activity];
  if (lesson && !['links', 'objects', 'polymorphism'].includes(activity))
    return (
      <div className="season-lab">
        <Choices
          id={episode + '-' + activity}
          question={lesson[0]}
          options={lesson[1]}
          value={answers['lesson-' + activity]}
          onChange={(v) => setAnswer('lesson-' + activity, v)}
        />
        <button
          className="button"
          onClick={() => {
            if (answers['lesson-' + activity] === String(lesson[2])) {
              done();
              F('Correct. Explain it to yourself before delivering the mission.');
            } else F('Trace the example again. Which property does the algorithm rely on?');
          }}
        >
          Check reasoning
        </button>
        <p role="status">{feedback}</p>
      </div>
    );
  if (activity === 'review')
    return (
      <div className="season-lab">
        {REVIEW[episode].map(([question, options, correct], i) => (
          <Choices
            key={i}
            id={episode + 'review' + i}
            question={question as string}
            options={options as string[]}
            value={answers['review-' + i]}
            onChange={(v) => setAnswer('review-' + i, v)}
          />
        ))}
        <button
          className="button"
          onClick={() => {
            if (REVIEW[episode].every((q, i) => answers['review-' + i] === String(q[2]))) {
              done();
              F('Review approved. You have justified both behavior and cost.');
            } else
              F(
                'Review the input contract, invariant, and complexity. One or more explanations needs another look.',
              );
          }}
        >
          Submit code review
        </button>
        <p role="status">{feedback}</p>
      </div>
    );
  return (
    <div className="season-lab">
      <div className="season-lab-heading">
        <span className="eyebrow">HANDS-ON LAB</span>
        {complete && <strong>✓ Experiment completed</strong>}
      </div>
      {activity === 'pair' && (
        <>
          <h3>Dispatch crate · target 13 kg</h3>
          <div className="season-cells">
            {weights.map((v, i) => (
              <button
                key={i}
                aria-pressed={picked.includes(i)}
                className={picked.includes(i) ? 'selected' : ''}
                onClick={() =>
                  P(
                    picked.includes(i)
                      ? picked.filter((x) => x !== i)
                      : picked.length < 2
                        ? [...picked, i]
                        : [i],
                  )
                }
              >
                {v} kg<small>index {i}</small>
              </button>
            ))}
          </div>
          <p>Selected weight: {picked.reduce((n, i) => n + weights[i], 0)} / 13 kg</p>
          <button
            className="button"
            onClick={() => {
              if (picked.length === 2 && picked.reduce((n, i) => n + weights[i], 0) === 13) {
                done();
                F('Two distinct parcels found. Nora sends you to Max.');
              } else F('Choose exactly two different parcels whose total is 13.');
            }}
          >
            Dispatch pair
          </button>
        </>
      )}
      {activity === 'pointers' && (
        <>
          <h3>Robot Arms · target 13 kg</h3>
          <div className="season-cells">
            {weights.map((v, i) => (
              <div
                className={
                  i === left || i === right ? 'selected' : i < left || i > right ? 'eliminated' : ''
                }
                key={i}
              >
                {v}
                <small>{i === left ? 'L' : i === right ? 'R' : '#' + i}</small>
              </div>
            ))}
          </div>
          <p>
            {weights[left]} + {weights[right]} = {weights[left] + weights[right]}
          </p>
          <div className="checkout-actions">
            {['L', 'R'].map((p) => (
              <button
                className="button"
                key={p}
                disabled={left >= right || weights[left] + weights[right] === 13}
                onClick={() => {
                  const sum = weights[left] + weights[right];
                  if ((sum < 13 && p === 'L') || (sum > 13 && p === 'R')) {
                    p === 'L' ? L(left + 1) : R(right - 1);
                    F('Safe move: the discarded endpoint cannot have a remaining partner.');
                  } else
                    F(
                      'This would discard a possible answer. Use the sorted order to justify the other move.',
                    );
                }}
              >
                Move {p}
              </button>
            ))}
            <button
              className="button"
              onClick={() => {
                L(0);
                R(5);
              }}
            >
              Restart simulation
            </button>
            <button
              className="button"
              disabled={left >= right || weights[left] + weights[right] !== 13}
              onClick={done}
            >
              Confirm pair
            </button>
          </div>
        </>
      )}
      {['traffic', 'window'].includes(activity) && (
        <>
          <h3>Server Traffic Monitor · 3-minute window</h3>
          <div className="season-cells">
            {traffic.map((n, i) => (
              <div key={i} className={i >= start && i < start + 3 ? 'selected' : ''}>
                {n}
                <small>minute {i + 1}</small>
              </div>
            ))}
          </div>
          <p>
            Window [{start + 1}–{start + 3}] · sum{' '}
            {traffic.slice(start, start + 3).reduce((a, b) => a + b, 0)}
          </p>
          {start > 0 && (
            <p>
              Previous sum − {traffic[start - 1]} + {traffic[start + 2]} = current sum
            </p>
          )}
          <button className="button" disabled={start === 0} onClick={() => W(start - 1)}>
            Previous
          </button>{' '}
          <button
            className="button"
            disabled={start === 5}
            onClick={() => {
              W(start + 1);
              if (start + 1 === 5) done();
            }}
          >
            Slide window →
          </button>
          <p>Visit all windows. Notice how only two values change on each move.</p>
        </>
      )}
      {activity === 'variable' && (
        <>
          <h3>Unique events · abcaef</h3>
          <div className="season-cells">
            {'abcaef'.split('').map((v, i) => (
              <div key={i} className={i >= left && i <= step ? 'selected' : ''}>
                {v}
                <small>{i}</small>
              </div>
            ))}
          </div>
          <p>Window must contain no duplicate character.</p>
          <button
            className="button"
            disabled={step >= 5}
            onClick={() => {
              if (step === 2 && left === 0) {
                F('Extending adds a second a. Shrink from the left first.');
                return;
              }
              S(step + 1);
              if (step + 1 === 5) done();
            }}
          >
            Extend right
          </button>{' '}
          <button
            className="button"
            onClick={() => {
              if (step === 2 && left === 0) {
                L(1);
                F('Removed the old a; now extension is safe.');
              } else F('The current window is unique. Keep useful events and extend.');
            }}
          >
            Shrink left
          </button>
        </>
      )}
      {activity === 'stack' && (
        <>
          <h3>Undo / Redo tower · LIFO</h3>
          <div className="season-towers">
            <div>
              <h4>Undo · top first</h4>
              {[...undo].reverse().map((v, i) => (
                <div key={i} className="season-block">
                  {v}
                </div>
              ))}
              {!undo.length && <p>Empty</p>}
            </div>
            <div>
              <h4>Redo · top first</h4>
              {[...redo].reverse().map((v, i) => (
                <div key={i} className="season-block">
                  {v}
                </div>
              ))}
              {!redo.length && <p>Empty</p>}
            </div>
          </div>
          <div className="checkout-actions">
            <button
              className="button"
              onClick={() => {
                U([...undo, 'Edit ' + (step + 1)]);
                D([]);
                S(step + 1);
                if (step >= 2 && answers['saw-redo'] === 'yes') done();
              }}
            >
              New action
            </button>
            <button
              className="button"
              disabled={!undo.length}
              onClick={() => {
                D([...redo, undo.at(-1)!]);
                U(undo.slice(0, -1));
              }}
            >
              Undo
            </button>
            <button
              className="button"
              disabled={!redo.length}
              onClick={() => {
                U([...undo, redo.at(-1)!]);
                D(redo.slice(0, -1));
                setAnswer('saw-redo', 'yes');
              }}
            >
              Redo
            </button>
          </div>
          <p>Add edits, undo, redo, then create another action. A new edit clears redo.</p>
        </>
      )}
      {activity === 'binary' && (
        <>
          <h3>Release timeline · hidden first failure</h3>
          <div className="season-cells">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className={
                  i < lo || i > hi
                    ? 'eliminated'
                    : i === Math.floor((lo + hi) / 2)
                      ? 'selected'
                      : ''
                }
              >
                {i}
                <small>{i < lo || i > hi ? 'ruled out' : '?'}</small>
              </div>
            ))}
          </div>
          <p>
            Candidate interval [{lo}, {hi}]. Current first-failure candidate:{' '}
            {found < 0 ? 'none' : found}.
          </p>
          <button
            className="button"
            disabled={lo > hi}
            onClick={() => {
              const mid = lo + Math.floor((hi - lo) / 2);
              if (mid >= 10) {
                FOUND(mid);
                HI(mid - 1);
                F(`Build ${mid} fails. Keep it as a candidate; search earlier.`);
              } else {
                LO(mid + 1);
                F(`Build ${mid} passes. Eliminate it and everything earlier.`);
              }
              if (mid >= 10 ? lo > mid - 1 : mid + 1 > hi) done();
            }}
          >
            Test midpoint {lo + Math.floor((hi - lo) / 2)}
          </button>
          <p>Up to 11 tests for 1,024 builds, compared with up to 1,024 linear tests.</p>
        </>
      )}
      {activity === 'chain' && (
        <>
          <h3>Follow the delivery references</h3>
          <div className="season-cells">
            {[10, 20, 30, 40].map((v, i) => (
              <button
                key={i}
                className={step === i ? 'selected' : ''}
                onClick={() => {
                  if (i === step) {
                    S(step + 1);
                    if (step === 3) done();
                  } else
                    F('Follow the current next reference; you cannot jump to an unrelated stop.');
                }}
              >
                {v}
                <small>next: {i === 3 ? 'null' : (i + 2) * 10}</small>
              </button>
            ))}
          </div>
          <p>Start at head 10. Click the current node to follow its next reference.</p>
        </>
      )}
      {activity === 'links' && (
        <>
          <h3>Repair a broken next reference</h3>
          <div className="season-chain">
            10 → 20 → {step === 1 ? '30 → 40 → null' : 'null · unreachable: 30 → 40'}
          </div>
          <button
            className="button"
            onClick={() => {
              S(1);
              done();
              F(
                'The reference from node 20 now points to the original node 30. The whole route is reachable.',
              );
            }}
          >
            Connect node 20 → node 30
          </button>{' '}
          <button
            className="button"
            onClick={() => {
              S(0);
              F('Disconnecting next makes the remaining nodes unreachable from head.');
            }}
          >
            Disconnect node 20
          </button>
        </>
      )}
      {activity === 'reverse' && (
        <>
          <h3>Reverse references without losing the route</h3>
          <div className="season-cells">
            {[10, 20, 30, 40].map((v, i) => (
              <div className={current === i ? 'selected' : ''} key={i}>
                {v}
                <small>next → {links[i] === -1 ? 'null' : (links[i] + 1) * 10}</small>
              </div>
            ))}
          </div>
          <p>
            previous: {previous < 0 ? 'null' : (previous + 1) * 10} · current:{' '}
            {current < 0 ? 'null' : (current + 1) * 10} · saved next:{' '}
            {saved < 0 ? 'null' : (saved + 1) * 10}
          </p>
          <div className="checkout-actions">
            <button
              className="button"
              disabled={current < 0}
              onClick={() => {
                if (start !== 0) {
                  F('Complete the current link change before saving another next reference.');
                  return;
                }
                SAVED(links[current]);
                W(1);
              }}
            >
              1 · Save next
            </button>
            <button
              className="button"
              disabled={current < 0}
              onClick={() => {
                if (start !== 1) {
                  F('Save the original next reference before overwriting it.');
                  return;
                }
                LINKS(links.map((v, i) => (i === current ? previous : v)));
                W(2);
              }}
            >
              2 · Reverse link
            </button>
            <button
              className="button"
              disabled={current < 0}
              onClick={() => {
                if (start !== 2) {
                  F('Reverse the current link before advancing.');
                  return;
                }
                PREVIOUS(current);
                CURRENT(saved);
                W(0);
                if (saved === -1) {
                  done();
                  F('New head 40. All four original nodes are preserved in reverse order.');
                }
              }}
            >
              3 · Advance pointers
            </button>
          </div>
        </>
      )}
      {['objects', 'polymorphism'].includes(activity) && (
        <>
          <h3>Payment object workshop</h3>
          <p>
            The caller depends on PaymentMethod. Choose a concrete object, then invoke the same
            pay(125) contract.
          </p>
          <div className="checkout-actions">
            {['CardPayment', 'BankPayment'].map((v, i) => (
              <button key={v} className="button" aria-pressed={start === i} onClick={() => W(i)}>
                new {v}()
              </button>
            ))}
            <button
              className="button button-primary"
              onClick={() => {
                F(
                  `PaymentMethod method = new ${start === 0 ? 'CardPayment' : 'BankPayment'}(); method.pay(125) → ${start === 0 ? 'CARD' : 'BANK'}:125`,
                );
                setAnswer('ran-' + start, 'yes');
                if (answers['ran-' + (1 - start)] === 'yes') done();
              }}
            >
              Run shared caller
            </button>
          </div>
          <p>
            Exercise both objects. Their common interface stays the same; behavior belongs to each
            implementation.
          </p>
        </>
      )}
      {activity === 'cycle' && (
        <>
          <h3>Fast / slow route</h3>
          <div className="season-cells">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={i === left || i === right ? 'selected' : ''}>
                Stop {i}
                <small>
                  {i === left ? 'slow ' : ''}
                  {i === (step === 0 ? 0 : right) ? 'fast' : ''}
                </small>
              </div>
            ))}
          </div>
          <p>Links: 0 → 1 → 2 → 3 → 4 → 1. Compare references after moving.</p>
          <button
            className="button"
            onClick={() => {
              const next = (n: number) => (n === 4 ? 1 : n + 1);
              const l = next(left),
                r = next(next(step === 0 ? 0 : right));
              L(l);
              R(r);
              S(step + 1);
              if (l === r) {
                done();
                F('The walkers met on the same node reference. A cycle is present.');
              }
            }}
          >
            Slow +1 · Fast +2
          </button>
        </>
      )}
      {['tree', 'calls'].includes(activity) && (
        <>
          <h3>Archive call stack</h3>
          <div className="season-tree">
            <div>root · 1 direct file</div>
            <div>↳ invoices · 2 files</div>
            <div>↳ photos · 3 files</div>
          </div>
          <div className="season-block">
            {
              [
                'Enter countFiles(root). Parent frame waits.',
                'Enter invoices. Return 2. Root total is now 3.',
                'Enter photos. Return 3. Root total is now 6.',
                'Return 6 from root. All frames have unwound.',
              ][Math.min(step, 3)]
            }
          </div>
          <button
            className="button"
            onClick={() => {
              S(Math.min(step + 1, 3));
              if (step >= 2) done();
            }}
          >
            Step into / return
          </button>
          <p>
            Live call frames: {step === 0 ? 1 : step < 3 ? 2 : 0}. Space follows height, not the
            total number of files.
          </p>
        </>
      )}
      {activity === 'join' && (
        <>
          <h3>SQL Detective · JOIN lab</h3>
          <div className="season-towers">
            <div>Customers: Ana, Mihai, Sara, David</div>
            <div>Orders: #101 → Ana, #102 → Mihai, #103 → Mihai</div>
          </div>
          <button
            className="button"
            onClick={() => {
              S(0);
              setAnswer('saw-inner', 'yes');
            }}
          >
            INNER JOIN
          </button>{' '}
          <button
            className="button"
            onClick={() => {
              S(1);
              if (answers['saw-inner'] === 'yes') done();
            }}
          >
            LEFT JOIN
          </button>
          <div className="season-block">
            Ana → #101
            <br />
            Mihai → #102
            <br />
            Mihai → #103
            {step === 1 && (
              <>
                <br />
                Sara → NULL
                <br />
                David → NULL
              </>
            )}
          </div>
          <p>
            {step === 0
              ? 'Unmatched customers disappear.'
              : 'Every customer remains; unmatched order fields are NULL.'}
          </p>
        </>
      )}
      <p role="status">{feedback}</p>
    </div>
  );
}
