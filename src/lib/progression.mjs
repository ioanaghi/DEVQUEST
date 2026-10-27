import { freshSeason, restoreSeason, seasonXP, nextSeason } from './season.mjs';
import { freshCheckout, restoreCheckout, CHECKOUT_MISSIONS } from './checkout.mjs';
export const SAVE_KEY = 'devquest.save.v1';
export const JAVA_STARTER = `public static boolean canRegister(int age) {
    return age > 18;
}`;
export const SQL_STARTER = `-- The orders are still here. Start investigating.
SELECT * FROM orders;`;
export const REWARDS = {
  java: { xp: 120, coins: 40 },
  filter: { xp: 100, coins: 30 },
  join: { xp: 180, coins: 50 },
};

export function freshState() {
  return {
    version: 1,
    checkout: freshCheckout(),
    season: freshSeason(),
    name: '',
    avatar: { skin: '#dca477', hair: 'short', shirt: '#8a82bc', glasses: false },
    onboarded: false,
    metAlex: false,
    completed: [],
    claimed: false,
    decoration: null,
    javaCode: JAVA_STARTER,
    sqlFilterCode: SQL_STARTER,
    sqlJoinCode: '-- Connect each pending order to its customer.\nSELECT * FROM customers;',
    hints: { java: 0, filter: 0, join: 0 },
    journal: '',
    sound: false,
    position: { x: 184, y: 328 },
  };
}

export function totals(state) {
  const firstDay = state.completed.reduce(
    (sum, key) => ({ xp: sum.xp + REWARDS[key].xp, coins: sum.coins + REWARDS[key].coins }),
    { xp: 0, coins: 0 },
  );
  return {
    xp:
      seasonXP(state) +
      firstDay.xp +
      CHECKOUT_MISSIONS.filter((m) => state.checkout?.completed.includes(m.id)).reduce(
        (n, m) => n + m.xp,
        0,
      ),
    coins: firstDay.coins,
  };
}

export function completeMission(state, mission) {
  if (!(mission in REWARDS) || state.completed.includes(mission)) return state;
  if (
    !state.metAlex ||
    (mission !== 'java' && !state.completed.includes('java')) ||
    (mission === 'join' && !state.completed.includes('filter'))
  )
    return state;
  return { ...state, completed: [...state.completed, mission] };
}

export function quest(state) {
  if (!state.metAlex)
    return {
      title: 'A friendly face',
      objective: 'Meet Alex at the mentor’s desk.',
      target: 'alex',
      number: '00',
      label: 'WELCOME ABOARD',
    };
  if (!state.completed.includes('java'))
    return {
      title: 'Your first bug',
      objective: 'Fix the registration check at your workstation.',
      target: 'desk',
      number: '01',
      label: 'THE REGISTRATION BUG',
    };
  if (!state.completed.includes('filter'))
    return {
      title: 'The missing orders',
      objective: 'Find the pending orders at the SQL terminal.',
      target: 'sql',
      number: '02',
      label: 'SQL DETECTIVE',
    };
  if (!state.completed.includes('join'))
    return {
      title: 'Connect the dots',
      objective: 'Find the customers behind the missing orders.',
      target: 'sql',
      number: '02',
      label: 'SQL DETECTIVE · PART II',
    };
  if (!state.claimed)
    return {
      title: 'Look at you, developer',
      objective: 'Return to Alex to wrap up your first day.',
      target: 'alex',
      number: '03',
      label: 'YOUR FIRST UPGRADE',
    };
  if (!state.decoration)
    return {
      title: 'Make yourself at home',
      objective: 'Open your backpack and place your desk reward.',
      target: 'desk',
      number: '03',
      label: 'A LITTLE MORE YOU',
    };
  const next = CHECKOUT_MISSIONS.find((m) => !state.checkout?.completed.includes(m.id));
  if (next)
    return {
      title: next.title,
      objective: `${next.npc.split(' · ')[0]} is waiting at ${next.location.toLowerCase()}.`,
      target: next.target,
      number: '03',
      label: 'THE CHECKOUT INCIDENT',
    };
  const seasonNext = nextSeason(state);
  if (seasonNext)
    return {
      title: seasonNext.mission.title,
      objective: `${seasonNext.mission.npc} is waiting. Open the quest log for ${seasonNext.episode.title}.`,
      target: seasonNext.mission.target,
      number: String(seasonNext.episode.number).padStart(2, '0'),
      label: seasonNext.episode.title.toUpperCase(),
    };
  return {
    title: 'BentoCart is ready for release',
    objective: 'Season 1 delivered. Revisit adventures and finish independent mastery checks.',
    target: 'coffee',
    number: '✓',
    label: 'CHAPTER COMPLETE',
  };
}

export function restoreState(raw) {
  const base = freshState();
  try {
    const s = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!s || s.version !== 1) return base;
    const completed = Array.isArray(s.completed)
      ? [...new Set(s.completed.filter((k) => k in REWARDS))]
      : [];
    const metAlex = s.metAlex === true;
    const valid =
      metAlex && completed.includes('java')
        ? [
            'java',
            ...(completed.includes('filter')
              ? ['filter', ...(completed.includes('join') ? ['join'] : [])]
              : []),
          ]
        : [];
    const safeString = (value, fallback, max) =>
      typeof value === 'string' ? value.slice(0, max) : fallback;
    const color = (value, fallback) => (/^#[0-9a-f]{6}$/i.test(value ?? '') ? value : fallback);
    const checkout = restoreCheckout(
      s.checkout,
      valid.length === 3 && s.claimed === true && ['plant', 'cat', 'lamp'].includes(s.decoration),
    );
    const season = restoreSeason(s.season, {
      ...base,
      checkout,
      completed: valid,
      claimed: valid.length === 3 && s.claimed === true,
    });
    return {
      ...base,
      season,
      checkout: restoreCheckout(
        s.checkout,
        valid.length === 3 && s.claimed === true && ['plant', 'cat', 'lamp'].includes(s.decoration),
      ),
      name: safeString(s.name, '', 24),
      onboarded: s.onboarded === true,
      metAlex,
      completed: valid,
      claimed: valid.length === 3 && s.claimed === true,
      decoration:
        valid.length === 3 && s.claimed === true && ['plant', 'cat', 'lamp'].includes(s.decoration)
          ? s.decoration
          : null,
      avatar: {
        skin: color(s.avatar?.skin, base.avatar.skin),
        shirt: color(s.avatar?.shirt, base.avatar.shirt),
        hair: ['short', 'bob', 'curly'].includes(s.avatar?.hair) ? s.avatar.hair : 'short',
        glasses: s.avatar?.glasses === true,
      },
      javaCode: safeString(s.javaCode, base.javaCode, 4000),
      sqlFilterCode: safeString(s.sqlFilterCode, base.sqlFilterCode, 6000),
      sqlJoinCode: safeString(s.sqlJoinCode, base.sqlJoinCode, 6000),
      hints: Object.fromEntries(
        ['java', 'filter', 'join'].map((key) => [
          key,
          Number.isInteger(s.hints?.[key]) ? Math.max(0, Math.min(3, s.hints[key])) : 0,
        ]),
      ),
      journal: safeString(s.journal, '', 12000),
      sound: s.sound === true,
      position:
        Number.isFinite(s.position?.x) &&
        Number.isFinite(s.position?.y) &&
        s.position.x >= 20 &&
        s.position.x <= 620 &&
        s.position.y >= 64 &&
        s.position.y <= 382
          ? s.position
          : base.position,
    };
  } catch {
    return base;
  }
}
