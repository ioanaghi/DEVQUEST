import { CodeEditor } from './CodeEditor';
import { useEffect, useRef, useState } from 'react';
import { MISSIONS } from '../lib/content';
import type { Mission, Result, Save } from '../types';
import { JAVA_STARTER, SQL_STARTER } from '../lib/progression.mjs';
import { isDesktop, request } from '../lib/platform';

type Props = {
  mission: Mission;
  save: Save;
  runtime: string;
  update: (patch: Partial<Save>) => void;
  onComplete: (mission: Mission) => void;
  onNext: () => void;
  onClose: () => void;
};
export function Workspace({ mission, save, runtime, update, onComplete, onNext, onClose }: Props) {
  const config = MISSIONS[mission];
  const codeKey =
    mission === 'java' ? 'javaCode' : mission === 'filter' ? 'sqlFilterCode' : 'sqlJoinCode';
  const code = save[codeKey],
    solved = save.completed.includes(mission);
  const [tab, setTab] = useState<'brief' | 'learn'>('brief');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  async function run(submit: boolean) {
    if (busy) return;
    setBusy(true);
    setError('');
    setSubmitted(submit);
    setResult(null);
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const data = await request(
        `/api/${mission === 'java' ? 'java' : 'sql'}`,
        mission === 'java' ? { code, submit } : { query: code, mission, submit },
      );
      if (controller.signal.aborted) return;
      setResult(data);
      setAttempted(true);
      if (submit && data.passed) onComplete(mission);
    } catch (e) {
      if (!controller.signal.aborted)
        setError(e instanceof Error ? e.message : 'The runner is unavailable.');
      else setError('The request timed out or was cancelled. Please try again.');
      setAttempted(true);
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }
  const change = (next: string) => {
    update({ [codeKey]: next });
    setResult(null);
    setError('');
    setAttempted(false);
    setSubmitted(false);
  };
  return (
    <div className="workspace">
      <div className="workspace-meta">
        <span>
          <i className="live-dot" /> PIXELBYTE WORKSPACE
        </span>
        <span>
          {mission === 'java'
            ? runtime === 'docker'
              ? 'ISOLATED JAVA 21'
              : 'JAVA PRACTICE · EXPRESSIONS'
            : 'SQLITE · LOCAL DATABASE'}
        </span>
      </div>
      <div className="workspace-grid">
        <aside className="task-pane">
          <div className="workspace-tabs">
            <button className={tab === 'brief' ? 'selected' : ''} onClick={() => setTab('brief')}>
              The ticket
            </button>
            <button className={tab === 'learn' ? 'selected' : ''} onClick={() => setTab('learn')}>
              Learn the concept
            </button>
          </div>
          <div className="task-content">
            <span className={`ticket-tag ${mission === 'java' ? 'purple' : 'green'}`}>
              {config.language} · BEGINNER
            </span>
            <h3>{config.title}</h3>
            <p>{tab === 'brief' ? config.intro : config.lesson}</p>
            <div className="task-objective">
              <span className="eyebrow">YOUR OBJECTIVE</span>
              <p>{config.objective}</p>
            </div>
            {mission !== 'java' && (
              <div className="schema">
                <span className="eyebrow">DATABASE SCHEMA</span>
                <details open>
                  <summary>
                    ▤ orders <small>6 rows</small>
                  </summary>
                  <code>
                    id <span>INTEGER · PK</span>
                    <br />
                    customer_id <span>INTEGER · FK</span>
                    <br />
                    total <span>REAL</span>
                    <br />
                    status <span>TEXT</span>
                  </code>
                </details>
                <details open={mission === 'join'}>
                  <summary>
                    ▤ customers <small>4 rows</small>
                  </summary>
                  <code>
                    id <span>INTEGER · PK</span>
                    <br />
                    name <span>TEXT</span>
                    <br />
                    email <span>TEXT</span>
                  </code>
                </details>
                <p className="schema-relation">orders.customer_id → customers.id</p>
              </div>
            )}
            <div className="mentor-note">
              <span className="small-avatar">A</span>
              <div>
                <strong>A little nudge from Alex</strong>
                <p>
                  {error
                    ? 'Read the feedback first. A small experiment is a good next step.'
                    : result && !result.passed
                      ? 'What is different about the case that failed? Start there.'
                      : 'Take your time. Good developers ask questions and test their assumptions.'}
                </p>
              </div>
            </div>
            <div className="hints">
              <div className="hints-head">
                <strong>Need a nudge?</strong>
                <span>{save.hints[mission]} / 3</span>
              </div>
              {config.hints.slice(0, save.hints[mission]).map((hint, i) => (
                <p className="hint" key={hint}>
                  <b>0{i + 1}</b>
                  {hint}
                </p>
              ))}
              <button
                className="hint-button"
                disabled={save.hints[mission] >= 3}
                onClick={() =>
                  update({
                    hints: { ...save.hints, [mission]: Math.min(3, save.hints[mission] + 1) },
                  })
                }
              >
                ✧ {save.hints[mission] === 3 ? 'All hints revealed' : 'Reveal next hint'}
              </button>
              <small>Hints are handwritten. No XP penalty.</small>
            </div>
          </div>
        </aside>
        <section className="editor-pane" aria-label="Code and test results">
          <div className="editor-tabs">
            <span>
              <i className={mission === 'java' ? 'file-dot java' : 'file-dot sql'} />
              {config.file}
              <span className="saved-mark">●</span>
            </span>
            <button className="text-button" onClick={() => setConfirmReset(!confirmReset)}>
              Reset
            </button>
          </div>
          {confirmReset && (
            <div className="reset-code">
              <span>Replace your code with the starter?</span>
              <button
                onClick={() => {
                  change(
                    mission === 'java'
                      ? JAVA_STARTER
                      : mission === 'filter'
                        ? SQL_STARTER
                        : 'SELECT * FROM customers;',
                  );
                  setConfirmReset(false);
                }}
              >
                Reset code
              </button>
              <button onClick={() => setConfirmReset(false)}>Keep my work</button>
            </div>
          )}
          <CodeEditor
            code={code}
            language={config.language}
            disabled={busy}
            maxLength={mission === 'java' ? 4000 : 6000}
            onChange={change}
            onRun={() => void run(false)}
          />
          <div className="editor-status">
            <span>
              {config.language} <span className="muted">UTF-8</span>
            </span>
            <span>
              {busy
                ? 'Running…'
                : isDesktop
                  ? 'Your work stays on this Mac'
                  : 'Your work stays in this browser'}{' '}
              <i className="live-dot" />
            </span>
          </div>
          <div className="run-toolbar">
            <span>⌘ / Ctrl + Enter to run</span>
            <div>
              <button
                className="button button-secondary"
                disabled={busy}
                onClick={() => void run(false)}
              >
                {busy ? 'Running…' : '▷ Run samples'}
              </button>
              <button
                className="button button-primary"
                disabled={busy || !attempted}
                onClick={() => void run(true)}
              >
                Submit for review ↗
              </button>
            </div>
          </div>
          <div className="results-pane" aria-live="polite">
            <div className="results-head">
              <span className="eyebrow">
                {mission === 'java' ? 'TEST RESULTS' : 'QUERY RESULTS'}
              </span>
              {result && (
                <span className={result.passed ? 'result-pass' : 'result-fail'}>
                  {result.passed ? '✓ Checks passed' : '○ Keep investigating'}
                </span>
              )}
            </div>
            {busy ? (
              <div className="empty-results">
                <span className="spinner" />{' '}
                {submitted ? 'Checking your submission on additional cases…' : 'Running your code…'}
              </div>
            ) : error ? (
              <div className="runner-error">
                <strong>Let’s take another look.</strong>
                <pre>{error}</pre>
              </div>
            ) : result ? (
              <>
                {result.tests && (
                  <div className="test-list">
                    {result.tests.map((test) => (
                      <div key={test.name}>
                        <span className={test.actual === test.expected ? 'test-pass' : 'test-fail'}>
                          {test.actual === test.expected ? '✓' : '×'}
                        </span>
                        <strong>{test.name}</strong>
                        <code>expected {String(test.expected)}</code>
                        <code>got {String(test.actual)}</code>
                      </div>
                    ))}
                  </div>
                )}
                {result.columns && (
                  <div className="query-table">
                    <table>
                      <thead>
                        <tr>
                          {result.columns.map((column, i) => (
                            <th key={`${column}-${i}`}>{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows?.map((row, i) => (
                          <tr key={i}>
                            {result.columns!.map((column, j) => (
                              <td key={`${column}-${j}`}>
                                {row[column] === null ? <em>NULL</em> : String(row[column])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.rows?.length === 0 && <p>No rows matched this query.</p>}
                    <small>{result.rows?.length} rows returned · SQLite</small>
                  </div>
                )}
                {submitted && (
                  <p className={`review-feedback ${result.passed ? 'success' : ''}`}>
                    {result.passed
                      ? '✓ Review approved. Your work holds up on the additional cases, too.'
                      : result.reviewPassed === false
                        ? 'The review dataset found an edge case. Check the rule, not just the sample values.'
                        : 'Some sample checks still fail. Compare the result with the ticket’s requested columns and rows.'}
                  </p>
                )}
                {!submitted && result.passed && (
                  <p className="review-feedback">
                    Looking good. Submit for review to check additional cases and earn your reward.
                  </p>
                )}
              </>
            ) : (
              <div className="empty-results">
                <span>▷</span>
                <p>
                  Your next “aha!” moment starts here.
                  <small>Run your code to see what happens.</small>
                </p>
              </div>
            )}
          </div>
          {solved && (
            <div className="workspace-success">
              <div>
                <span className="eyebrow">TICKET DELIVERED</span>
                <strong>
                  {mission === 'java'
                    ? 'Your first fix. Nice work.'
                    : mission === 'filter'
                      ? 'Found them. Now, whose orders?'
                      : 'Mystery solved. The data was here all along.'}
                </strong>
              </div>
              <button
                className="button button-primary"
                onClick={mission === 'filter' ? onNext : onClose}
              >
                {mission === 'filter' ? 'Continue investigation →' : 'Back to the office →'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
