import { writeFile } from 'node:fs/promises';
import { EPISODES, TASKS, REVIEW, BOSS_REVIEW, QA, RETENTION } from '../src/lib/season-content.mjs';
import { taskCases } from '../server/season/cases.mjs';
const lines = [
  '# DEVQUEST — Season 1 Mission Content Bible',
  '',
  'Generated from the authored curriculum by `node scripts/export-season-bible.mjs`. Runtime definitions in `src/lib/season-content.mjs` are the source of truth.',
  '',
  'This extends the original Checkout Incident. Story delivery accepts guided attempts. Independent interview passes earn badges; different problems after three later missions certify mastery. SQL and OOP have independent first-day prerequisites. All other episodes follow their predecessor.',
  '',
  'Visual interaction and animation implementations live in `SeasonLabs.tsx`, `season-art.ts` and the Season 1 CSS rules. Mission completion triggers the office celebration and returns the player to the next colleague.',
];
for (const e of EPISODES) {
  lines.push(
    '',
    `## Episode ${e.number} — ${e.title}`,
    '',
    `Concept: ${e.concept}. New room: ${e.room}. Reward: ${e.reward}. Independent badge: ${e.badge}.`,
  );
  for (const [i, m] of e.missions.entries()) {
    lines.push(
      '',
      `### ${i + 1}. ${m.title}`,
      '',
      `NPC: ${m.npc}. Office interaction: ${m.target}. Reward: ${m.xp} XP.`,
      '',
      `Dialogue: “${m.dialogue}”`,
      '',
      `Activity: ${m.activity}. Completion: ${m.task ? 'submit the player’s implementation, pass public/hidden review and applicable growth checks' : 'complete the authored visual experiment or reasoning check'}. Next: ${e.missions[i + 1]?.title ?? 'episode delivery and practice-room access'}.`,
    );
    if (m.task) {
      const t = TASKS[m.task];
      lines.push('', `Editor contract: ${t.contract}`);
      if (t.signature) lines.push('', `Signature: \`${t.signature}\`.`);
      lines.push('', 'Four optional hints:', ...t.hints.map((h, i) => `${i + 1}. ${h}`));
      if (!t.sql) {
        lines.push(
          '',
          'Public checks:',
          ...taskCases(m.task).map(
            (c) => `- ${c.name}. Input: ${c.input || 'contract fixture'}. Expected: ${c.expected}.`,
          ),
        );
      } else
        lines.push(
          '',
          'Runs on the live customers/orders/payments seed. Submission and verification queries are also checked on two changed datasets.',
        );
    }
    if (m.activity === 'qa')
      lines.push(
        '',
        'Required predictions:',
        ...QA[e.id].map(([q, a]) => `- ${q} → ${a}.`),
        '',
        'The player also authors two different tests; these execute against their saved implementation.',
      );
    if (m.activity === 'review' || m.activity === 'interview')
      lines.push(
        '',
        'Accepted reasoning:',
        ...(m.activity === 'interview' ? BOSS_REVIEW[e.id] : REVIEW[e.id]).map(
          ([q, o, c]) => `- ${q} ${o[c]}`,
        ),
      );
    if (m.activity === 'interview')
      lines.push(
        '',
        'Phases: clarify input/output and edge contracts; justify the approach; submit a fresh implementation; defend edge tests; explain cost and correctness. Score: correctness 40, measured efficiency 25, edge reasoning 15, explanation 20. Hints switch to Practice Mode; fresh independent retry resets draft, answers and hints.',
      );
  }
  const [task, title, , contract] = RETENTION[e.id];
  lines.push(
    '',
    `### Later check — ${title}`,
    '',
    `${TASKS[task].signature ?? 'SQL / architecture contract'}: ${contract}`,
    '',
    'Unlock: independent interview plus three later mission completions, or the completed-season mixed review. Pass the new problem independently without hints to certify mastery.',
  );
}
lines.push(
  '',
  '## HashMap retention after Checkout',
  '',
  RETENTION.checkout[3],
  '',
  'Unlocks after an independent Checkout interview and the first three Warehouse missions.',
  '',
);
await writeFile(new URL('../docs/MISSION-CONTENT-BIBLE.md', import.meta.url), lines.join('\n'));
