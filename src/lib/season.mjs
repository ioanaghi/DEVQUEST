import { EPISODES, TASKS, RETENTION } from './season-content.mjs';
export function freshSeason() {
  return {
    episodes: Object.fromEntries(
      EPISODES.map((e) => [
        e.id,
        {
          completed: [],
          drafts: {},
          hints: {},
          answers: {},
          custom: {},
          independent: false,
          independentAt: null,
        },
      ]),
    ),
    mastery: {},
    mixed: {},
  };
}
export function seasonUnlocked(s, id) {
  const i = EPISODES.findIndex((e) => e.id === id);
  if (i < 0) return false;
  if (id === 'sql2') return s.completed.includes('join');
  if (id === 'oop') return s.completed.includes('java') && s.claimed;
  return i === 0
    ? s.checkout.completed.includes('interview')
    : s.season.episodes[EPISODES[i - 1].id].completed.includes(EPISODES[i - 1].missions.at(-1).id);
}
export function missionStatus(s, episode, mission) {
  const e = EPISODES.find((e) => e.id === episode),
    progress = s.season.episodes[episode];
  const i = e?.missions.findIndex((m) => m.id === mission) ?? -1;
  if (i < 0 || !seasonUnlocked(s, episode)) return 'locked';
  if (progress.completed.includes(mission)) return 'completed';
  return i === progress.completed.length ? 'active' : 'locked';
}
export function completeSeason(s, episode, mission, independent = false) {
  const status = missionStatus(s, episode, mission),
    e = EPISODES.find((e) => e.id === episode);
  if (
    status !== 'active' &&
    !(status === 'completed' && mission === e.missions.at(-1).id && independent)
  )
    return s;
  const p = s.season.episodes[episode];
  const count = Object.values(s.season.episodes).reduce((n, p) => n + p.completed.length, 0);
  return {
    ...s,
    season: {
      ...s.season,
      episodes: {
        ...s.season.episodes,
        [episode]: {
          ...p,
          completed: status === 'active' ? [...p.completed, mission] : p.completed,
          independentAt:
            p.independentAt ??
            (mission === e.missions.at(-1).id && independent
              ? count + (status === 'active' ? 1 : 0)
              : null),
          independent: p.independent || (mission === e.missions.at(-1).id && independent),
        },
      },
    },
  };
}
export function seasonXP(s) {
  return EPISODES.reduce(
    (n, e) =>
      n +
      e.missions
        .filter((m) => s.season?.episodes[e.id]?.completed.includes(m.id))
        .reduce((a, m) => a + m.xp, 0),
    0,
  );
}
export function nextSeason(s) {
  for (const e of EPISODES)
    if (seasonUnlocked(s, e.id)) {
      const m = e.missions.find((m) => !s.season.episodes[e.id].completed.includes(m.id));
      if (m) return { episode: e, mission: m };
    }
  return null;
}
export function retentionUnlocked(s, id) {
  if (id === 'checkout')
    return s.checkout.independent && s.season.episodes.warehouse.completed.length >= 3;
  const i = EPISODES.findIndex((e) => e.id === id),
    e = EPISODES[i];
  if (!e || !s.season.episodes[id].independent) return false;
  return (
    (s.season.episodes[id].independentAt !== null &&
      Object.values(s.season.episodes).reduce((n, p) => n + p.completed.length, 0) -
        s.season.episodes[id].independentAt >=
        3) ||
    (EPISODES.every((e) => s.season.episodes[e.id].completed.length === e.missions.length) &&
      Object.keys(s.season.mixed).length === 3)
  );
}
export function certify(s, id) {
  if (!RETENTION[id] || !retentionUnlocked(s, id) || s.season.mastery[id]) return s;
  return { ...s, season: { ...s.season, mastery: { ...s.season.mastery, [id]: true } } };
}
export function restoreSeason(raw, s) {
  const base = freshSeason();
  if (!raw || typeof raw !== 'object') return base;
  const strings = (obj, max = 100) =>
    obj && typeof obj === 'object'
      ? Object.fromEntries(
          Object.entries(obj)
            .filter(([k, v]) => /^[a-zA-Z0-9-]{1,50}$/.test(k) && typeof v === 'string')
            .slice(0, 80)
            .map(([k, v]) => [k, v.slice(0, max)]),
        )
      : {};
  for (const e of EPISODES) {
    const r = raw.episodes?.[e.id],
      p = base.episodes[e.id];
    if (!r) continue;
    if (seasonUnlocked({ ...s, season: base }, e.id) && Array.isArray(r.completed))
      for (const m of e.missions) {
        if (!r.completed.includes(m.id)) break;
        p.completed.push(m.id);
      }
    const allowed = new Set([
      ...e.missions.map((m) => m.task).filter(Boolean),
      RETENTION[e.id][0],
      ...(e.id === 'warehouse' ? [RETENTION.checkout[0]] : []),
    ]);
    p.drafts = Object.fromEntries(
      Object.entries(strings(r.drafts, 12000)).filter(([k]) => allowed.has(k)),
    );
    p.answers = strings(r.answers);
    p.hints = Object.fromEntries(
      Object.entries(r.hints ?? {})
        .filter(([k, v]) => TASKS[k] && Number.isInteger(v))
        .map(([k, v]) => [k, Math.max(0, Math.min(4, v))]),
    );
    if (r.custom && typeof r.custom === 'object')
      p.custom = Object.fromEntries(
        Object.entries(r.custom)
          .filter(([k, v]) => TASKS[k] && Array.isArray(v))
          .map(([k, v]) => [
            k,
            [0, 1].map((i) => (typeof v[i] === 'string' ? v[i].slice(0, 1000) : '')),
          ]),
      );
    p.independent = p.completed.includes(e.missions.at(-1).id) && r.independent === true;
    p.independentAt =
      p.independent && Number.isInteger(r.independentAt)
        ? Math.max(
            0,
            Math.min(
              EPISODES.reduce((n, e) => n + e.missions.length, 0),
              r.independentAt,
            ),
          )
        : null;
  }
  base.mixed = Object.fromEntries(
    Object.entries(raw.mixed ?? {}).filter(([k, v]) => ['0', '1', '2'].includes(k) && v === '0'),
  );
  for (const id of Object.keys(RETENTION))
    if (raw.mastery?.[id] === true && retentionUnlocked({ ...s, season: base }, id))
      base.mastery[id] = true;
  return base;
}
