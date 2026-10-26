export type Mission = 'java' | 'filter' | 'join';
export type Avatar = { skin: string; shirt: string; hair: string; glasses: boolean };
export type Save = {
  version: number;
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
export type Interactive = 'alex' | 'desk' | 'sql' | 'board' | 'coffee' | 'tickets' | 'maya';
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
  | 'map';
export type Result = {
  passed: boolean;
  reviewPassed: boolean | null;
  runtime: string;
  tests?: { name: string; input: number; expected: boolean; actual: boolean }[];
  rows?: Record<string, string | number | null>[];
  columns?: string[];
};
