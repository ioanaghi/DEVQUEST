import type { Avatar } from '../types';
type Context = CanvasRenderingContext2D;
export type DrawLayer = { depth: number; draw: (context: Context) => void };
export const colors = {
  ink: '#293a41',
  wood: '#bd8d64',
  woodLight: '#e6bd86',
  cream: '#fff1ca',
  mint: '#85c1a1',
  green: '#3d7963',
  lilac: '#a897ca',
  coral: '#df9c83',
};
function rect(c: Context, x: number, y: number, w: number, h: number, color: string) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}
function text(c: Context, value: string, x: number, y: number, color = '#edf1cd', size = 6) {
  c.font = `bold ${size}px monospace`;
  c.fillStyle = color;
  c.fillText(value, x, y);
}
function shade(hex: string, factor: number) {
  const v = parseInt(hex.slice(1), 16);
  return (
    '#' +
    [v >> 16, (v >> 8) & 255, v & 255]
      .map((n) =>
        Math.max(0, Math.min(255, Math.round(n * factor)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}
function shadow(c: Context, x: number, y: number, w: number, h: number) {
  rect(c, x + 3, y + 3, w, h, '#24342e25');
  rect(c, x + 5, y + 5, w - 4, h - 1, '#24342e12');
}
function pot(c: Context, x: number, y: number, small = false, time = 0) {
  const k = small ? 0.7 : 1;
  c.save();
  c.translate(x, y);
  c.scale(k, k);
  shadow(c, 1, 13, 17, 8);
  rect(c, 5, 15, 11, 9, '#784b42');
  rect(c, 6, 15, 9, 7, '#c77f56');
  rect(c, 7, 16, 3, 6, '#e6a978');
  rect(c, 3, 12, 15, 4, '#e7ae77');
  rect(c, 4, 12, 13, 1, '#f4cb94');
  rect(c, 9, -3, 2, 17, '#3d6949');
  const sway = Math.sin(time / 1500 + x) > 0.6 ? 1 : 0;
  [
    [0, 3, 8, 5],
    [2, -3, 6, 7],
    [12, 0, 7, 5],
    [11, -7, 5, 7],
    [6, -10, 6, 7],
    [0, -6, 5, 4],
  ].forEach(([a, b, w, h], i) => {
    rect(c, a + sway, b, w, h, ['#3e7452', '#5b9564', '#7cae69'][i % 3]);
    rect(c, a + 1 + sway, b, w - 2, 1, '#a4c97f');
  });
  c.restore();
}
export function plant(c: Context, x: number, y: number, time = 0) {
  pot(c, x, y, false, time);
}
function monitor(c: Context, x: number, y: number, screen: string, time: number) {
  shadow(c, x - 13, y + 17, 30, 5);
  rect(c, x - 3, y + 15, 6, 5, '#37424b');
  rect(c, x - 8, y + 19, 16, 2, '#657175');
  rect(c, x - 15, y - 4, 30, 23, '#283942');
  rect(c, x - 14, y - 5, 28, 1, '#677b7c');
  rect(c, x - 12, y - 2, 24, 16, screen);
  rect(c, x - 11, y - 1, 22, 2, shade(screen, 1.2));
  for (let i = 0; i < 4; i++) {
    const width = [10, 15, 7, 13][i];
    rect(c, x - 8 + (i % 2) * 2, y + 3 + i * 3, width, 1, i % 2 ? '#d1e7ba' : '#f0e6b9');
  }
  rect(c, x + 11, y + 16, 1, 1, Math.floor(time / 800) % 2 ? '#c4e6a7' : '#638875');
}
export function desk(c: Context, x: number, y: number, w: number, screen = '#618f80', time = 0) {
  shadow(c, x - 1, y + 5, w + 7, 35);
  rect(c, x + 4, y + 20, 5, 18, '#4e4644');
  rect(c, x + w - 9, y + 20, 5, 18, '#4e4644');
  rect(c, x + 5, y + 20, 2, 15, '#857467');
  rect(c, x - 1, y - 1, w + 2, 26, '#64504a');
  rect(c, x, y, w, 21, '#d9ad74');
  rect(c, x + 1, y, w - 2, 2, '#f6d39c');
  rect(c, x + 2, y + 3, w - 4, 16, '#e6bc83');
  rect(c, x + 2, y + 21, w - 4, 4, '#aa754e');
  rect(c, x + 2, y + 25, w - 4, 1, '#765645');
  rect(c, x + 4, y + 5, 18, 1, '#eecb94');
  rect(c, x + w - 24, y + 16, 17, 1, '#c89861');
  monitor(c, x + w / 2, y - 19, screen, time);
  rect(c, x + w / 2 - 15, y + 5, 29, 11, '#ac936f');
  rect(c, x + w / 2 - 15, y + 5, 28, 9, '#ede2bd');
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 8; col++)
      rect(c, x + w / 2 - 12 + col * 3, y + 6 + row * 2, 2, 1, '#9a9d8c');
  rect(c, x + w / 2 - 6, y + 12, 13, 1, '#aaa990');
  rect(c, x + w - 18, y + 5, 8, 11, '#7d9c90');
  rect(c, x + w - 16, y + 6, 4, 6, '#e9e6cf');
  rect(c, x + w - 15, y + 6, 1, 2, '#b8bda7');
  rect(c, x + 7, y + 4, 7, 8, '#f9ebc7');
  rect(c, x + 8, y + 4, 5, 2, '#775641');
  rect(c, x + 14, y + 6, 2, 4, '#f4d69d');
  rect(c, x + 6, y + 12, 10, 1, '#a98561');
}
function chair(c: Context, x: number, y: number, color: string) {
  shadow(c, x - 1, y + 11, 20, 7);
  rect(c, x + 8, y + 8, 2, 13, '#42474b');
  rect(c, x + 1, y + 18, 17, 2, '#505961');
  rect(c, x + 1, y + 20, 3, 2, '#303f45');
  rect(c, x + 15, y + 20, 3, 2, '#303f45');
  rect(c, x - 1, y - 1, 20, 14, '#414650');
  rect(c, x, y - 2, 18, 12, shade(color, 0.8));
  rect(c, x + 2, y - 2, 14, 2, shade(color, 1.3));
  rect(c, x + 2, y + 1, 14, 9, color);
  rect(c, x - 2, y + 9, 22, 5, '#444951');
  rect(c, x, y + 10, 18, 5, color);
  rect(c, x + 1, y + 10, 16, 1, shade(color, 1.3));
  rect(c, x + 1, y + 15, 17, 2, shade(color, 0.75));
}
function windowArt(c: Context, x: number, wide = 64) {
  shadow(c, x - 3, 14, wide + 6, 43);
  rect(c, x - 3, 12, wide + 6, 40, '#5b685e');
  rect(c, x - 2, 12, wide + 4, 37, '#e6dab8');
  rect(c, x + 1, 14, wide - 2, 31, '#8bbfbd');
  const sky = c.createLinearGradient(0, 14, 0, 47);
  sky.addColorStop(0, '#8dc5c9');
  sky.addColorStop(1, '#d4dec5');
  c.fillStyle = sky;
  c.fillRect(x + 2, 15, wide - 4, 30);
  [
    [7, 26, 11, 20],
    [23, 20, 9, 26],
    [39, 29, 17, 17],
  ].forEach(([a, b, w, h], i) => {
    rect(c, x + a, b, w, h, ['#7eaaa5', '#94b4ae', '#618e87'][i]);
    for (let z = 0; z < 3; z++) rect(c, x + a + 3, b + 4 + z * 5, 2, 2, '#c7d9b7');
  });
  rect(c, x + wide / 2 - 1, 13, 3, 34, '#f6e8c7');
  rect(c, x, 29, wide, 2, '#e8ddbc');
  rect(c, x - 5, 46, wide + 10, 5, '#e6d6ab');
  rect(c, x - 3, 46, wide + 6, 1, '#fff2d0');
  rect(c, x - 3, 51, wide + 7, 2, '#8b8a6b');
  rect(c, x - 6, 12, 6, 31, '#8cab92');
  rect(c, x + wide, 12, 6, 31, '#8cab92');
  rect(c, x - 5, 13, 2, 30, '#b3c3a0');
}
function makeBackground() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 400;
  const c = canvas.getContext('2d')!;
  rect(c, 0, 0, 640, 400, '#324e42');
  // Staggered oak boards on an integer tile grid; all grain is deterministic.
  for (let row = 0; row < 22; row++)
    for (let column = -1; column < 21; column++) {
      const x = column * 32 + (row % 2) * 16,
        y = 56 + row * 16;
      const index = (((row * 13 + column * 7) % 6) + 6) % 6;
      rect(
        c,
        x,
        y,
        32,
        16,
        ['#c89b6b', '#cca170', '#bd8c60', '#d0a774', '#c39667', '#cfa272'][index],
      );
      rect(c, x, y + 15, 32, 1, '#a67a54');
      rect(c, x, y, 31, 1, '#e0b981');
      rect(c, x + 31, y, 1, 15, '#ad8055');
      rect(c, x + 3, y + 4, 12, 1, '#e0b27b50');
      rect(c, x + 18, y + 10, 10, 1, '#976f4a22');
      if (index % 2 === 0) {
        rect(c, x + 7, y + 11, 6, 1, '#97704b33');
        rect(c, x + 26, y + 3, 2, 1, '#8f654533');
      }
    }
  rect(c, 404, 56, 220, 186, '#94aea0');
  for (let row = 0; row < 12; row++)
    for (let col = 0; col < 14; col++) {
      const x = 404 + col * 16,
        y = 56 + row * 16;
      rect(c, x, y, 16, 16, (col + row) % 2 ? '#aec4b0' : '#a4bcaa');
      rect(c, x, y + 15, 16, 1, '#8aa38f');
      rect(c, x + 15, y, 1, 16, '#91a997');
      rect(c, x + 1, y + 1, 13, 1, '#c2d2b866');
    }
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 14; col++) {
      const x = 404 + col * 16,
        y = 252 + row * 16;
      rect(c, x, y, 16, 16, (col + row) % 2 ? '#c5af86' : '#d2bd94');
      rect(c, x, y + 15, 16, 1, '#b29c76');
    }
  // Walls have a crown, painted face, skirting and contact shadow.
  rect(c, 0, 0, 640, 12, '#344f48');
  rect(c, 0, 12, 640, 42, '#d3d5b4');
  rect(c, 0, 12, 640, 3, '#f7e8bc');
  rect(c, 0, 52, 640, 5, '#91a38b');
  rect(c, 0, 57, 640, 3, '#536c5c');
  rect(c, 16, 60, 608, 5, '#344b3a26');
  for (let x = 18; x < 624; x += 32) {
    rect(c, x, 16, 1, 35, '#b4c0a055');
    rect(c, x + 1, 17, 1, 32, '#e5e3b933');
  }
  rect(c, 0, 56, 16, 344, '#4d6958');
  rect(c, 3, 56, 10, 328, '#90a283');
  rect(c, 13, 60, 3, 324, '#c1caa0');
  rect(c, 16, 60, 5, 324, '#293e3022');
  rect(c, 624, 56, 16, 344, '#4e6c59');
  rect(c, 625, 56, 3, 328, '#c3cda4');
  rect(c, 628, 56, 10, 328, '#8b9e80');
  rect(c, 16, 384, 608, 16, '#53725b');
  rect(c, 16, 384, 608, 3, '#d0cf9e');
  [62, 205, 430, 544].forEach((x) => windowArt(c, x));
  // Window light is part of the room, rather than a filter across the interface.
  c.fillStyle = '#fff3b927';
  [
    [64, 124, 91, 195],
    [205, 266, 235, 342],
    [432, 491, 451, 554],
  ].forEach(([a, b, d, e]) => {
    c.beginPath();
    c.moveTo(a, 58);
    c.lineTo(b, 58);
    c.lineTo(e, 160);
    c.lineTo(d, 160);
    c.fill();
  });
  [
    [392, 56, 12, 122],
    [392, 228, 12, 156],
    [404, 242, 82, 10],
    [534, 242, 90, 10],
  ].forEach(([x, y, w, h]) => {
    shadow(c, x, y, w + 3, h + 3);
    rect(c, x, y, w, h, '#536f5d');
    rect(c, x + 1, y, w - 2, h - 2, '#d2d6b4');
    rect(c, x, y, w, 2, '#fff0c2');
    rect(c, x + w - 3, y + 2, 2, h - 3, '#8fa18a');
  });
  // Door thresholds and an embroidered rug.
  rect(c, 392, 178, 12, 50, '#c5a372');
  for (let y = 181; y < 228; y += 8) rect(c, 392, y, 12, 1, '#a3845a');
  rect(c, 486, 242, 48, 10, '#b29164');
  shadow(c, 191, 179, 155, 75);
  rect(c, 191, 179, 155, 74, '#627e6f');
  rect(c, 194, 181, 149, 69, '#aec1a0');
  rect(c, 197, 184, 143, 63, '#6f9b88');
  rect(c, 202, 190, 133, 51, '#83ad96');
  for (let x = 200; x < 338; x += 7) {
    rect(c, x, 186, 3, 1, '#e3dfb3');
    rect(c, x, 244, 3, 1, '#e3dfb3');
  }
  for (let y = 193; y < 240; y += 7) {
    rect(c, 198, y, 1, 3, '#dce0b8');
    rect(c, 338, y, 1, 3, '#dce0b8');
  }
  rect(c, 138, 342, 95, 34, '#4c6d62');
  rect(c, 140, 344, 91, 30, '#9da67c');
  rect(c, 143, 347, 85, 24, '#657e63');
  text(c, 'HELLO, WORLD', 149, 362, '#e8e0ad', 7);
  // Wall details: a bulletin board, framed art, clock and two bookshelves.
  shadow(c, 304, 23, 68, 33);
  rect(c, 304, 23, 68, 33, '#624e40');
  rect(c, 307, 26, 62, 27, '#bd9165');
  rect(c, 307, 26, 62, 1, '#f1c48d');
  ['#eed5a1', '#bfceaa', '#deb6bd'].forEach((color, i) => {
    rect(c, 312 + i * 18, 31, 13, 16, color);
    rect(c, 317 + i * 18, 30, 2, 2, '#e7f2d0');
    rect(c, 314 + i * 18, 36, 8, 1, '#7b806544');
    rect(c, 314 + i * 18, 40, 7, 1, '#7b806544');
  });
  rect(c, 22, 23, 29, 24, '#3f6254');
  rect(c, 24, 25, 25, 20, '#e2d8ae');
  text(c, 'PB', 28, 38, '#4b7358', 9);
  rect(c, 369, 22, 15, 15, '#596b55');
  rect(c, 371, 24, 11, 11, '#eee6b9');
  rect(c, 376, 26, 1, 5, '#54715c');
  rect(c, 376, 30, 4, 1, '#54715c');
  rect(c, 420, 65, 86, 35, '#49675e');
  rect(c, 422, 67, 82, 31, '#e7e8cd');
  rect(c, 422, 67, 82, 1, '#fff5d5');
  text(c, 'LEARN. TRY. REPEAT.', 427, 78, '#5f826d', 5);
  text(c, '[ ]  >  [ ]  >  [*]', 429, 91, '#7b9d7c', 6);
  rect(c, 24, 183, 22, 30, '#674c44');
  rect(c, 26, 185, 18, 26, '#eee2b9');
  rect(c, 28, 187, 14, 22, '#739c88');
  rect(c, 32, 191, 6, 12, '#d8c391');
  rect(c, 30, 198, 10, 7, '#9ebd8f');
  for (const [x, y, w] of [
    [25, 289, 27],
    [350, 65, 28],
  ]) {
    shadow(c, x, y, w, 30);
    rect(c, x, y, w, 30, '#75533f');
    rect(c, x + 2, y + 2, w - 4, 25, '#8e694a');
    for (let i = 0; i < 5; i++) {
      const h = [16, 18, 13, 17, 14][i];
      rect(
        c,
        x + 3 + i * 4,
        y + 23 - h,
        3,
        h,
        ['#9ebca0', '#c39bb7', '#ddae73', '#89a9b7', '#c9c58c'][i],
      );
      rect(c, x + 3 + i * 4, y + 25 - h, 2, 1, '#e9ddac');
    }
    rect(c, x, y + 26, w, 3, '#b58c5e');
  }
  // Wall-mounted server cabinet and a fire extinguisher by the training door.
  rect(c, 601, 182, 19, 46, '#344d4a');
  rect(c, 603, 184, 15, 42, '#5f7c71');
  for (let i = 0; i < 4; i++) {
    rect(c, 604, 186 + i * 9, 13, 7, '#2f4845');
    rect(c, 606, 188 + i * 9, 2, 2, '#94c8a0');
    rect(c, 611, 188 + i * 9, 4, 1, '#7b9b86');
  }
  rect(c, 378, 148, 7, 19, '#9b5f4e');
  rect(c, 379, 149, 5, 15, '#d18868');
  rect(c, 379, 146, 5, 3, '#4d5350');
  rect(c, 383, 147, 3, 5, '#4d5350');
  return canvas;
}
let background: HTMLCanvasElement | null = null;
export function drawWorld(c: Context, time: number, _decoration: string | null) {
  background ??= makeBackground();
  c.drawImage(background, 0, 0);
  // Small animated accents in the world.
  for (let i = 0; i < 4; i++)
    rect(c, 606, 188 + i * 9, 2, 1, Math.floor(time / 650 + i) % 3 ? '#b8de99' : '#587765');
}
const DESKS = [
  { x: 80, y: 91, w: 88, color: '#658c99', chair: '#849cba' },
  { x: 218, y: 147, w: 90, color: '#638e76', chair: '#9d88b9' },
  { x: 70, y: 226, w: 92, color: '#8c80ab', chair: '#aa99b8' },
  { x: 245, y: 267, w: 92, color: '#5d8e99', chair: '#d09a7d' },
  { x: 526, y: 105, w: 77, color: '#598779', chair: '#6d9b8d' },
  { x: 425, y: 178, w: 60, color: '#8b7ca6', chair: '#a58cae' },
];
export function furnitureLayers(time: number, decoration: string | null): DrawLayer[] {
  const layers: DrawLayer[] = DESKS.flatMap((d) => [
    {
      depth: d.y + 27,
      draw: (c: Context) => {
        desk(c, d.x, d.y, d.w, d.color, time);
        if (d.x === 218) {
          rect(c, 225, 150, 11, 13, '#7c6088');
          rect(c, 227, 151, 8, 11, '#b89dc2');
          rect(c, 228, 151, 1, 11, '#e4c7d5');
          rect(c, 268, 173, 28, 7, '#f7e7bf');
          text(c, 'YOUR DESK', 270, 178, '#86654e', 4);
          if (decoration === 'plant') pot(c, 290, 137, true, time);
          if (decoration === 'lamp') {
            rect(c, 293, 145, 11, 2, '#5e5752');
            rect(c, 297, 132, 2, 14, '#a58761');
            rect(c, 291, 127, 15, 7, '#e0b061');
            rect(c, 294, 124, 9, 4, '#f6d489');
            rect(c, 293, 134, 12, 1, '#ffebad');
          }
        }
        if (d.x === 80) {
          rect(c, 144, 97, 12, 11, '#b6814d');
          rect(c, 145, 98, 10, 8, '#edc88b');
          text(c, 'A', 147, 104, '#886649', 5);
        }
        if (d.x === 526) {
          pot(c, 584, 95, true, time);
          rect(c, 530, 127, 18, 5, '#f2db9e');
          text(c, 'SQL', 532, 131, '#536e59', 4);
        }
      },
    },
    { depth: d.y + 56, draw: (c: Context) => chair(c, d.x + d.w / 2 - 9, d.y + 38, d.chair) },
  ]);
  [
    [24, 62],
    [355, 344],
    [594, 352],
    [498, 61],
    [74, 318],
  ].forEach(([x, y]) => layers.push({ depth: y + 21, draw: (c) => pot(c, x, y, false, time) }));
  layers.push({
    depth: 369,
    draw: (c) => {
      shadow(c, 25, 333, 62, 34);
      rect(c, 25, 333, 60, 33, '#6f5e73');
      rect(c, 27, 333, 56, 27, '#a28eaa');
      rect(c, 29, 335, 11, 26, '#c5a9bd');
      rect(c, 70, 335, 11, 26, '#c5a9bd');
      rect(c, 40, 338, 30, 12, '#c0a6b7');
      rect(c, 41, 352, 28, 9, '#d7bdc4');
      rect(c, 42, 352, 26, 1, '#eed6d4');
      rect(c, 30, 364, 4, 4, '#635249');
      rect(c, 76, 364, 4, 4, '#635249');
    },
  });
  layers.push({
    depth: 297,
    draw: (c) => {
      shadow(c, 540, 260, 69, 36);
      rect(c, 541, 260, 65, 34, '#536e5c');
      rect(c, 543, 264, 61, 24, '#8eaa7f');
      rect(c, 543, 264, 29, 22, '#a6bf8f');
      rect(c, 575, 264, 28, 22, '#a6bf8f');
      rect(c, 566, 270, 2, 6, '#58735a');
      rect(c, 578, 270, 2, 6, '#58735a');
      rect(c, 539, 257, 69, 7, '#e5d4a4');
      rect(c, 539, 256, 69, 2, '#fff0c7');
      rect(c, 548, 237, 23, 21, '#304c46');
      rect(c, 550, 239, 19, 14, '#6b8771');
      rect(c, 552, 241, 15, 6, '#243f3c');
      rect(c, 553, 242, 2, 2, '#a4c08a');
      rect(c, 556, 249, 7, 8, '#eadbb3');
      rect(c, 557, 250, 5, 2, '#664c3a');
      rect(c, 550, 257, 19, 2, '#8ea184');
      rect(c, 580, 258, 17, 2, '#8ea69a');
      rect(c, 587, 249, 2, 10, '#c4d0b2');
      rect(c, 583, 248, 6, 2, '#dce1c3');
      for (let i = 0; i < 3; i++)
        rect(
          c,
          556 + i * 3 + Math.round(Math.sin(time / 500 + i)),
          232 - (Math.floor(time / 300 + i) % 3) * 3,
          1,
          3,
          '#ffedc582',
        );
    },
  });
  layers.push({
    depth: 378,
    draw: (c) => {
      shadow(c, 425, 349, 56, 27);
      rect(c, 429, 365, 4, 13, '#6c5143');
      rect(c, 471, 365, 4, 13, '#6c5143');
      rect(c, 425, 349, 55, 22, '#926341');
      rect(c, 425, 347, 55, 18, '#ddac73');
      rect(c, 426, 347, 53, 2, '#f1cd91');
      rect(c, 443, 353, 7, 6, '#e6d9b4');
      rect(c, 444, 353, 5, 2, '#66533f');
    },
  });
  layers.push({ depth: 346, draw: (c) => chair(c, 442, 325, '#b67b68') });
  if (decoration === 'cat')
    layers.push({
      depth: 190,
      draw: (c) => {
        shadow(c, 308, 185, 21, 7);
        rect(c, 308, 181, 15, 9, '#bd8852');
        rect(c, 310, 180, 12, 8, '#e4ba78');
        rect(c, 320, 175, 9, 11, '#d6a164');
        rect(c, 320, 172, 3, 5, '#bc8350');
        rect(c, 326, 172, 3, 5, '#bc8350');
        rect(c, 322, 179, 1, 1, '#4a4c41');
        rect(c, 326, 179, 1, 1, '#4a4c41');
        rect(c, 324, 182, 1, 1, '#a5725b');
        rect(c, 305, 177, 4, 10, '#d6a164');
      },
    });
  return layers;
}
export function drawCharacter(
  c: Context,
  x: number,
  y: number,
  avatar: Avatar,
  time: number,
  walking = false,
  direction = 'down',
  animation = 'idle',
) {
  x = Math.round(x);
  y = Math.round(y);
  const step = walking ? Math.floor(time / 110) % 4 : 0;
  const bob = walking ? step % 2 : Math.floor(time / 1100) % 2;
  const jump = animation === 'celebration' ? -Math.abs(Math.sin(time / 110)) * 5 : 0;
  const top = y - 29 + bob + jump;
  c.fillStyle = '#23382b35';
  c.beginPath();
  c.ellipse(x, y + 1, 8, 3, 0, 0, Math.PI * 2);
  c.fill();
  if (walking) {
    for (let i = 0; i < 2; i++)
      rect(c, x - 5 + i * 8, y + 3 + (Math.floor(time / 100 + i) % 3), 2, 1, '#e8d9ad50');
  }
  const pants = '#344253';
  rect(c, x - 5, y - 9 + jump, 4, 9 + (step === 1 ? 1 : 0), pants);
  rect(c, x + 1, y - 9 + jump, 4, 9 + (step === 3 ? 1 : 0), pants);
  rect(c, x - 4, y - 8 + jump, 1, 6, '#647082');
  rect(c, x + 2, y - 8 + jump, 1, 6, '#647082');
  rect(c, x - 6, y - 2 + (step === 1 ? 1 : 0) + jump, 6, 4, '#2f4145');
  rect(c, x, y - 2 + (step === 3 ? 1 : 0) + jump, 6, 4, '#2f4145');
  rect(c, x - 5, y - 1 + (step === 1 ? 1 : 0) + jump, 5, 2, '#ede6ce');
  rect(c, x + 1, y - 1 + (step === 3 ? 1 : 0) + jump, 5, 2, '#ede6ce');
  const shirt = avatar.shirt,
    skin = avatar.skin;
  rect(c, x - 7, top + 13, 14, 12, '#2d3d45');
  rect(c, x - 6, top + 13, 12, 11, shade(shirt, 0.8));
  rect(c, x - 5, top + 14, 10, 8, shirt);
  rect(c, x - 4, top + 14, 3, 7, shade(shirt, 1.2));
  rect(c, x - 3, top + 21, 7, 2, shade(shirt, 0.85));
  rect(c, x - 3, top + 12, 6, 3, shade(shirt, 1.18));
  rect(c, x - 1, top + 15, 1, 3, '#ecdfbe');
  rect(c, x + 2, top + 15, 1, 3, '#ecdfbe');
  const hands = animation === 'celebration' ? -12 : animation === 'typing' ? -4 : 0;
  rect(c, x - 8, top + 15, 3, 7, shade(shirt, 0.85));
  rect(c, x + 5, top + 15, 3, 7, shade(shirt, 0.85));
  rect(c, x - 8, top + 20 + hands, 3, 4, shade(skin, 0.85));
  rect(c, x - 7, top + 20 + hands, 2, 3, skin);
  rect(c, x + 5, top + 20 + hands, 3, 4, skin);
  // A one-pixel outline and three face tones keep the small silhouette readable.
  const hair = '#4d3937';
  rect(c, x - 6, top + 1, 12, 13, hair);
  rect(c, x - 7, top + 4, 14, 8, hair);
  rect(c, x - 5, top + 4, 10, 10, shade(skin, 0.88));
  rect(c, x - 5, top + 4, 9, 8, skin);
  rect(c, x - 4, top + 4, 3, 5, shade(skin, 1.12));
  rect(c, x - 3, top + 13, 6, 2, skin);
  rect(c, x - 7, top + 7, 2, 4, skin);
  rect(c, x + 5, top + 7, 2, 4, shade(skin, 0.85));
  rect(c, x - 6, top, 12, 5, hair);
  rect(c, x - 4, top - 1, 9, 3, hair);
  rect(c, x - 6, top + 3, 3, 4, hair);
  rect(c, x + 4, top + 3, 3, 4, hair);
  rect(c, x - 4, top + 1, 7, 1, '#77534a');
  rect(c, x - 4, top + 4, 2, 2, '#68453f');
  if (avatar.hair === 'bob') {
    rect(c, x - 7, top + 3, 3, 12, hair);
    rect(c, x + 5, top + 3, 3, 12, hair);
    rect(c, x - 6, top + 6, 1, 7, '#77534a');
  }
  if (avatar.hair === 'curly') {
    [
      [-8, 1, 4, 6],
      [-5, -2, 5, 5],
      [0, -2, 5, 5],
      [4, 0, 4, 5],
    ].forEach(([a, b, w, h]) => {
      rect(c, x + a, top + b, w, h, hair);
      rect(c, x + a + 1, top + b, 2, 1, '#77534a');
    });
  }
  if (direction !== 'up') {
    const offset = direction === 'left' ? -2 : direction === 'right' ? 2 : 0;
    const blink = Math.floor(time / 180) % 29 === 0;
    rect(c, x - 3 + offset, top + 8, 2, blink ? 1 : 2, '#293a41');
    rect(c, x + 2 + offset, top + 8, 2, blink ? 1 : 2, '#293a41');
    if (!blink) {
      rect(c, x - 3 + offset, top + 8, 1, 1, '#fff4d7');
      rect(c, x + 2 + offset, top + 8, 1, 1, '#fff4d7');
    }
    rect(c, x - 4, top + 11, 2, 1, '#d68d7877');
    rect(c, x + 3, top + 11, 2, 1, '#d68d7877');
    rect(c, x, top + 12, 2, 1, '#a26855');
    if (avatar.glasses) {
      rect(c, x - 5 + offset, top + 7, 5, 4, '#34444b');
      rect(c, x + 1 + offset, top + 7, 5, 4, '#34444b');
      rect(c, x - 4 + offset, top + 8, 3, 2, '#a8c4b3');
      rect(c, x + 2 + offset, top + 8, 3, 2, '#a8c4b3');
      rect(c, x, top + 8, 2, 1, '#34444b');
    }
  } else {
    rect(c, x - 5, top + 4, 10, 7, hair);
    rect(c, x - 4, top + 5, 2, 3, '#68483f');
  }
  if (animation === 'celebration') {
    for (let i = 0; i < 5; i++) {
      const a = time / 300 + i * 1.25;
      rect(
        c,
        x + Math.round(Math.cos(a) * 16),
        top - 8 + Math.round(Math.sin(a) * 7),
        2,
        2,
        ['#f3d58c', '#b1d5a0', '#d9b0ca'][i % 3],
      );
    }
  }
}
export function drawMarker(c: Context, x: number, y: number, time: number) {
  const bob = Math.round(Math.sin(time / 350) * 2);
  c.save();
  c.translate(x, y - 49 + bob);
  shadow(c, -6, -6, 14, 16);
  rect(c, -7, -7, 15, 14, '#394f45');
  rect(c, -6, -8, 13, 16, '#e9c77a');
  rect(c, -5, -7, 11, 13, '#ffe6a2');
  rect(c, -1, -5, 3, 7, '#806344');
  rect(c, -1, 4, 3, 2, '#806344');
  rect(c, -1, 8, 3, 2, '#e9c77a');
  c.restore();
}
export function drawAtmosphere(c: Context, time: number) {
  // Warm, subtle drifting dust inside the beams, never across the UI.
  for (let i = 0; i < 13; i++) {
    const x = 65 + ((i * 41) % 280) + Math.sin(time / 5000 + i) * 7,
      y = 62 + ((i * 17 + time / 160) % 109);
    c.fillStyle = i % 3 ? '#ffedbd55' : '#fff5d582';
    c.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  const light = c.createLinearGradient(0, 0, 640, 400);
  light.addColorStop(0, '#f8dda40e');
  light.addColorStop(0.6, '#3d624200');
  light.addColorStop(1, '#25494118');
  c.fillStyle = light;
  c.fillRect(16, 58, 608, 326);
}
