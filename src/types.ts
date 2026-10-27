export type SaveSlot = { save: Save; updatedAt: number };
export type SaveLibrary = {
  kind: 'devquest-slots';
  version: 1;
  activeSlot: number | null;
  slots: (SaveSlot | null)[];
};
export type EpisodeSave = {
  completed: string[];
  drafts: Record<string, string>;
  hints: Record<string, number>;
  answers: Record<string, string>;
  custom: Record<string, string[]>;
  independent: boolean;
  independentAt: number | null;
};
export type SeasonSave = {
  episodes: Record<string, EpisodeSave>;
  mastery: Record<string, boolean>;
  mixed: Record<string, string>;
};
export type CheckoutSave = {
  completed: string[];
  drafts: Record<'brute' | 'optimize' | 'interview', string>;
  hints: Record<'brute' | 'optimize' | 'interview', number>;
  answers: Record<string, string>;
  custom: string[];
  score: Record<string, number> | null;
  independent: boolean;
  phase: number;
};
export type Mission = 'java' | 'filter' | 'join';
export type Avatar = { skin: string; shirt: string; hair: string; glasses: boolean };
export type Save = {
  version: number;
  checkout: CheckoutSave;
  season: SeasonSave;
  name: string;
  avatar: Avatar;
  onboarded: boolean;
  metAlex: boolean;
  completed: Mission[];
  claimed: boolean;
  decoration: 'plant' | 'cat' | 'lamp' | null;
  javaCode: string;
  sqlFilterCode: string;
  sqlJoinCode: string;
  hints: Record<Mission, number>;
  journal: string;
  sound: boolean;
  position: { x: number; y: number };
};
export type Interactive =
  | 'alex'
  | 'desk'
  | 'sql'
  | 'board'
  | 'coffee'
  | 'tickets'
  | 'maya'
  | 'nora'
  | 'eva'
  | 'max'
  | 'theo'
  | 'lia'
  | 'iris'
  | 'victor';
export type Panel =
  | null
  | 'java'
  | 'filter'
  | 'join'
  | 'journal'
  | 'skills'
  | 'inventory'
  | 'help'
  | 'training'
  | 'menu'
  | 'quests'
  | 'map'
  | 'checkout'
  | 'season';
export type Result = {
  passed: boolean;
  reviewPassed: boolean | null;
  runtime: string;
  tests?: { name: string; input: number; expected: boolean; actual: boolean }[];
  rows?: Record<string, string | number | null>[];
  columns?: string[];
};
