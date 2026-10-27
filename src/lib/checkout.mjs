export const PAIR_STARTER = `public static int[] findPair(int[] vouchers, int target) {
    // Return two different indices, or an empty array.
    return new int[0];
}`;
export const CHECKOUT_MISSIONS = [
  {
    id: 'incident',
    title: 'Emergency Meeting',
    phase: 'The incident',
    npc: 'Nora · Product Manager',
    location: 'Meeting corner',
    target: 'nora',
    xp: 25,
    dialogue:
      'Friday, 16:45. BentoCart launches tonight. A customer needs exactly two different vouchers to cover an order. Can you find a pair worth 100 credits? Equal values are allowed; reusing one voucher is not.',
  },
  {
    id: 'data',
    title: 'Understanding the Data',
    phase: 'Investigation',
    npc: 'Alex · Senior Engineer',
    location: 'Developer office',
    target: 'alex',
    xp: 35,
    dialogue:
      'Let’s turn Nora’s request into a contract. An array holds voucher values; its indices identify the vouchers. Return indices, rather than the values themselves.',
  },
  {
    id: 'brute',
    title: 'The Obvious Solution',
    phase: 'First attempt',
    npc: 'Alex · Senior Engineer',
    location: 'Your workstation',
    target: 'desk',
    xp: 100,
    dialogue:
      'Start with correctness. How could you visit every pair of different indices? Write your first working implementation. You can improve its cost later.',
  },
  {
    id: 'cost',
    title: 'The Performance Disaster',
    phase: 'The twist',
    npc: 'Nora & Alex',
    location: 'Developer office',
    target: 'alex',
    xp: 40,
    dialogue:
      'Ticket #204: a customer has 10,000 vouchers. Your fix works, but checking every pair is too costly. Experiment with the input size before choosing what to change.',
  },
  {
    id: 'lab',
    title: 'The HashMap Lab',
    phase: 'Discovery',
    npc: 'Alex · Senior Engineer',
    location: 'Training room',
    target: 'board',
    xp: 60,
    dialogue:
      'A HashMap associates a key with a value. Store a voucher’s value as the key and its index as the value. Lookup is usually O(1) on average; that is not a guarantee for every operation.',
  },
  {
    id: 'optimize',
    title: 'The Optimization Breakthrough',
    phase: 'Optimization',
    npc: 'Alex · Senior Engineer',
    location: 'Your workstation',
    target: 'desk',
    xp: 120,
    dialogue:
      'Use what you have already seen to avoid checking every pair. Aim for one pass and expected O(n) time. A voucher can still only be used once.',
  },
  {
    id: 'qa',
    title: 'Maya Breaks Everything',
    phase: 'QA & edge cases',
    npc: 'Maya · QA Engineer',
    location: 'QA desk',
    target: 'maya',
    xp: 80,
    dialogue:
      'You passed the samples. Cute. Predict these edge cases before running your function. Then write two different extra test inputs and check your optimized code against them.',
  },
  {
    id: 'review',
    title: 'The Code Review',
    phase: 'Code review',
    npc: 'Alex · Senior Engineer',
    location: 'Meeting corner',
    target: 'alex',
    xp: 60,
    dialogue:
      'Imagine I have not seen your code. Explain the tradeoff, the cost, and why the same voucher cannot be used twice. Choose the reasoning you would defend in a review.',
  },
  {
    id: 'interview',
    title: 'The Interview Room',
    phase: 'Independent challenge',
    npc: 'Eva · Tech Lead',
    location: 'Interview table',
    target: 'eva',
    xp: 500,
    dialogue:
      'Welcome. Reconcile two transactions whose amounts sum to the target. Return their different indices, or an empty array. Take time to clarify the contract, explain your approach, implement, test, and discuss its cost.',
  },
];
export function freshCheckout() {
  return {
    completed: [],
    drafts: {
      brute: PAIR_STARTER,
      optimize: PAIR_STARTER,
      interview: PAIR_STARTER.replaceAll('vouchers', 'transactions'),
    },
    hints: { brute: 0, optimize: 0, interview: 0 },
    answers: {},
    custom: ['', ''],
    score: null,
    independent: false,
    phase: 0,
  };
}
export const checkoutUnlocked = (s) => s.claimed && !!s.decoration;
export function checkoutStatus(s, id) {
  const index = CHECKOUT_MISSIONS.findIndex((m) => m.id === id);
  if (s.checkout.completed.includes(id)) return 'completed';
  if (!checkoutUnlocked(s) || index < 0 || index > s.checkout.completed.length) return 'locked';
  return index === s.checkout.completed.length ? 'active' : 'available';
}
export function completeCheckout(s, id) {
  if (checkoutStatus(s, id) !== 'active') return s;
  const drafts = { ...s.checkout.drafts };
  if (id === 'brute') drafts.optimize = drafts.brute;
  return { ...s, checkout: { ...s.checkout, drafts, completed: [...s.checkout.completed, id] } };
}
export function restoreCheckout(raw, unlocked) {
  const base = freshCheckout();
  if (!raw || typeof raw !== 'object') return base;
  if (unlocked && Array.isArray(raw.completed)) {
    for (const mission of CHECKOUT_MISSIONS) {
      if (!raw.completed.includes(mission.id)) break;
      base.completed.push(mission.id);
    }
  }
  for (const key of ['brute', 'optimize', 'interview']) {
    if (typeof raw.drafts?.[key] === 'string') base.drafts[key] = raw.drafts[key].slice(0, 8000);
    if (Number.isInteger(raw.hints?.[key]))
      base.hints[key] = Math.max(0, Math.min(4, raw.hints[key]));
  }
  if (raw.answers && typeof raw.answers === 'object')
    base.answers = Object.fromEntries(
      Object.entries(raw.answers)
        .filter(([k, v]) => /^[a-z0-9-]{1,40}$/.test(k) && typeof v === 'string' && v.length <= 100)
        .slice(0, 60),
    );
  if (Array.isArray(raw.custom))
    base.custom = [0, 1].map((i) =>
      typeof raw.custom[i] === 'string' ? raw.custom[i].slice(0, 1000) : '',
    );
  base.phase = Number.isInteger(raw.phase) ? Math.max(0, Math.min(4, raw.phase)) : 0;
  base.independent = base.completed.includes('interview') && raw.independent === true;
  if (raw.score && typeof raw.score === 'object')
    base.score = Object.fromEntries(
      ['correctness', 'efficiency', 'edges', 'reasoning'].map((k, i) => [
        k,
        Number.isInteger(raw.score[k])
          ? Math.max(0, Math.min([40, 25, 15, 20][i], raw.score[k]))
          : 0,
      ]),
    );
  return base;
}
