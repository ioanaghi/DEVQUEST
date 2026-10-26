type IconName =
  | 'menu'
  | 'quest'
  | 'book'
  | 'skills'
  | 'bag'
  | 'map'
  | 'sound'
  | 'expand'
  | 'play'
  | 'exit'
  | 'sun'
  | 'save';
const paths: Record<IconName, string> = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  quest: 'M7 3h10v4h3v14H4V7h3V3Zm0 4h10M8 12h8M8 16h5',
  book: 'M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15',
  skills: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z',
  bag: 'M8 7V4h8v3M6 7h12l3 5v9H3v-9l3-5Zm-3 6h18M9 12v5h6v-5',
  map: 'm3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16',
  sound: 'M3 9h4l5-5v16l-5-5H3V9Zm13-2c4 2 4 8 0 10m3-13c7 4 7 12 0 16',
  expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
  play: 'm8 4 12 8-12 8V4Z',
  exit: 'M10 3H3v18h7m-2-9h13m-5-5 5 5-5 5',
  sun: 'M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2M8 8h8v8H8V8Z',
  save: 'M4 3h13l4 4v14H3V3h1Zm3 0v7h10V3M7 21v-7h10v7',
};
export function GameIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
