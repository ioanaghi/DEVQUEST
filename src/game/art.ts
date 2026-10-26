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
  const glow = c.createRadialGradient(
    x + w * 0.55,
    y + h * 0.62,
    1,
    x + w * 0.55,
    y + h * 0.62,
    w * 0.65,
  );
  glow.addColorStop(0, '#122e2744');
  glow.addColorStop(0.65, '#18372a23');
  glow.addColorStop(1, '#18372a00');
  c.fillStyle = glow;
  c.fillRect(x - w * 0.12, y - 2, w * 1.3, h + 13);
  rect(c, x + 3, y + 3, w, h, '#24342e15');
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
  if (x > 500) {
    for (let row = 0; row < 3; row++) {
      rect(c, x - 9, y + 3 + row * 4, 19, 1, '#c4ddbd88');
      rect(c, x - 3, y + 3 + row * 4, 1, 3, '#c4ddbd77');
    }
  }
  c.fillStyle = '#f0ead711';
  c.beginPath();
  c.moveTo(x - 12, y - 2);
  c.lineTo(x + 2, y - 2);
  c.lineTo(x - 12, y + 12);
  c.fill();
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
  // Long, quiet floorboards keep the room warm without a repeating brick pattern.
  for (let row = 0; row < 29; row++)
    for (let column = -1; column < 15; column++) {
      const x = column * 48 + (row % 3) * 16,
        y = 56 + row * 12;
      const index = (((row * 13 + column * 7) % 6) + 6) % 6;
      rect(
        c,
        x,
        y,
        48,
        12,
        ['#ba926d', '#c19a74', '#bf9670', '#c59d77', '#c29a73', '#bd956f'][index],
      );
      rect(c, x, y + 11, 48, 1, '#79573838');
      rect(c, x, y, 47, 1, '#e8c49766');
      rect(c, x + 47, y, 1, 11, '#7c57362b');
      rect(c, x + 4, y + 4, 17, 1, '#e0b88736');
      rect(c, x + 24, y + 8, 15, 1, '#82633f18');
      if (index % 2 === 0) {
        rect(c, x + 8, y + 7, 8, 1, '#85633f26');
        rect(c, x + 37, y + 3, 4, 1, '#e7c19744');
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
  // Woven rug embroidery, a coffee-corner kilim, and small personal wall details.
  for (const [x, y] of [
    [205, 194],
    [322, 194],
    [205, 233],
    [322, 233],
  ]) {
    rect(c, x, y, 7, 1, '#d5d7a8');
    rect(c, x + 3, y - 3, 1, 7, '#d5d7a8');
    rect(c, x + 2, y - 1, 3, 3, '#a7c1a0');
  }
  for (let x = 215; x < 324; x += 17) {
    rect(c, x, 191, 3, 1, '#a5bf9c88');
    rect(c, x, 239, 3, 1, '#a5bf9c88');
  }
  rect(c, 417, 317, 73, 65, '#a57e6333');
  rect(c, 419, 318, 69, 61, '#d5b88d');
  rect(c, 422, 320, 63, 57, '#bb876d');
  for (let y = 324; y < 375; y += 7) {
    rect(c, 423, y, 61, 2, y % 2 ? '#dfc69b' : '#e3ceb0');
  }
  for (let x = 421; x < 488; x += 4) {
    rect(c, x, 316, 1, 3, '#e5d1a6');
    rect(c, x, 379, 1, 3, '#e5d1a6');
  }
  // A suspended herb shelf belongs on the wall, leaving the navigation geometry intact.
  rect(c, 181, 18, 1, 28, '#7f9479');
  rect(c, 193, 18, 1, 28, '#7f9479');
  rect(c, 174, 44, 27, 3, '#9a7451');
  pot(c, 181, 32, true, 0);
  for (let j = 0; j < 5; j++) {
    rect(c, 175 + j * 2, 47 + j * 3, 4, 3, j % 2 ? '#698c62' : '#86a76f');
    rect(c, 178 + j, 47 + j * 3, 1, 5, '#527c5d');
  }
  // Directional ambient occlusion where floors meet their walls.
  const wallShade = c.createLinearGradient(0, 59, 0, 90);
  wallShade.addColorStop(0, '#314d3b30');
  wallShade.addColorStop(1, '#314d3b00');
  c.fillStyle = wallShade;
  c.fillRect(16, 59, 608, 31);
  return canvas;
}
const illustratedOffice = new Image();
export const worldArtLoaded = new Promise<void>((resolve) => {
  illustratedOffice.addEventListener('load', () => resolve(), { once: true });
  illustratedOffice.addEventListener('error', () => resolve(), { once: true });
});
illustratedOffice.decoding = 'async';
illustratedOffice.src = new URL('/art/pixelbyte-office-v3.png', window.location.href).href;
const artReady = () => illustratedOffice.complete && illustratedOffice.naturalWidth > 0;
function illustrationPatch(c: Context, x: number, y: number, w: number, h: number) {
  const sx = illustratedOffice.naturalWidth / 640,
    sy = illustratedOffice.naturalHeight / 400;
  c.drawImage(illustratedOffice, x * sx, y * sy, w * sx, h * sy, x, y, w, h);
}
// These regions follow the illustrated furniture and provide true sprite occlusion.
const ART_FOREGROUND = [
  // Desk tops already live in the painted background. Only re-layer their
  // narrow front aprons and feet so players are never clipped by boxy crops.
  [74, 104, 95, 14, 118],
  [105, 126, 35, 8, 134],
  [222, 151, 96, 17, 168],
  // Only the feet of the chair sit in front of the player. The backrest stays
  // in the painted background, leaving the standing avatar's face unobscured.
  [256, 178, 34, 14, 192],
  [69, 240, 94, 14, 254],
  [105, 271, 36, 13, 284],
  [243, 277, 91, 13, 290],
  [272, 308, 35, 12, 320],
  [522, 117, 84, 14, 131],
  [548, 145, 35, 13, 158],
  [418, 192, 79, 14, 206],
  [440, 220, 37, 11, 231],
  [537, 276, 77, 12, 288],
  [431, 316, 94, 14, 323],
  [415, 354, 65, 26, 380],
  [17, 307, 79, 62, 369],
  [5, 268, 39, 61, 329],
  [350, 321, 33, 52, 373],
  [586, 308, 37, 65, 373],
] as number[][];
let background: HTMLCanvasElement | null = null;
export function drawWorld(c: Context, time: number, _decoration: string | null) {
  if (artReady()) {
    c.drawImage(illustratedOffice, 0, 0, 640, 400);
    // The environment is painted, while these tiny live details remain interactive.
    for (const [x, y] of [
      [119, 73],
      [270, 121],
      [561, 89],
      [455, 170],
    ]) {
      c.globalAlpha = 0.08 + Math.sin(time / 1700 + x) * 0.025;
      c.fillStyle = '#c4edcf';
      c.fillRect(x - 8, y - 5, 15, 10);
    }
    c.globalAlpha = 1;
    return;
  }
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
  if (artReady()) {
    const layers: DrawLayer[] = ART_FOREGROUND.map(([x, y, w, h, depth]) => ({
      depth,
      draw: (c) => illustrationPatch(c, x, y, w, h),
    }));
    if (decoration === 'plant')
      layers.push({ depth: 167, draw: (c) => pot(c, 298, 137, true, time) });
    if (decoration === 'cat')
      layers.push({
        depth: 197,
        draw: (c) => {
          c.save();
          c.translate(321, 188);
          shadow(c, -8, 0, 18, 7);
          rect(c, -9, -6, 14, 7, '#d1a270');
          rect(c, 3, -10, 8, 9, '#dfb780');
          rect(c, 3, -13, 2, 4, '#b78660');
          rect(c, 9, -13, 2, 4, '#b78660');
          rect(c, 5, -6, 1, 1, '#465449');
          rect(c, 9, -6, 1, 1, '#465449');
          rect(c, -11, -7 + Math.sin(time / 700), 3, 7, '#bc8b61');
          c.restore();
        },
      });
    if (decoration === 'lamp')
      layers.push({
        depth: 168,
        draw: (c) => {
          const glow = c.createRadialGradient(305, 142, 1, 305, 142, 22);
          glow.addColorStop(0, '#ffdb8b50');
          glow.addColorStop(1, '#ffdb8b00');
          c.fillStyle = glow;
          c.fillRect(283, 120, 44, 44);
        },
      });
    layers.push({
      depth: 290,
      draw: (c) => {
        for (let i = 0; i < 3; i++) {
          const phase = (time / 1400 + i * 0.33) % 1;
          c.globalAlpha = (1 - phase) * 0.38;
          rect(c, 550 + Math.sin(phase * 5 + i) * 1.5, 237 - phase * 12, 1, 3, '#f7efdb');
        }
        c.globalAlpha = 1;
      },
    });
    return layers;
  }
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
  travel?: number,
) {
  const seed = parseInt(avatar.shirt.slice(1), 16) % 4700;
  const t = time + seed;
  const phase = walking ? (travel === undefined ? time / 100 : travel / 3.7) : 0;
  const swing = walking ? Math.sin(phase) : 0;
  const liftA = walking ? Math.max(0, swing) * 3 : 0,
    liftB = walking ? Math.max(0, -swing) * 3 : 0;
  const bounce = walking ? -Math.abs(Math.sin(phase)) * 1.15 : Math.sin(t / 1500) * 0.35;
  const celebration = animation === 'celebration' ? -Math.abs(Math.sin(time / 150)) * 4 : 0;
  const side = direction === 'left' || direction === 'right';
  const back = direction === 'up';
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.fillStyle = '#193c3040';
  c.beginPath();
  c.ellipse(0, 1, 7.5, 2.6, 0, 0, Math.PI * 2);
  c.fill();
  if (direction === 'right') c.scale(-1, 1);
  const top = -29 + bounce + celebration;
  // Legs alternate in both lift and swing. The gait follows distance actually travelled.
  const pants = '#354653';
  rect(c, -5, -9 + celebration - liftA, 4, 9, pants);
  rect(c, 1, -9 + celebration - liftB, 4, 9, pants);
  rect(c, -4, -8 + celebration - liftA, 1, 6, '#627481');
  rect(c, 2, -8 + celebration - liftB, 1, 6, '#627481');
  rect(c, -6, -2 + celebration - liftA, 6, 4, '#2c4045');
  rect(c, 0, -2 + celebration - liftB, 6, 4, '#2c4045');
  rect(c, -5, -1 + celebration - liftA, 5, 2, '#e9e2ce');
  rect(c, 1, -1 + celebration - liftB, 5, 2, '#e9e2ce');
  const shirt = avatar.shirt,
    skin = avatar.skin;
  const width = side ? 11 : 14,
    left = side ? -5 : -7;
  rect(c, left, top + 13, width, 12, '#2b4044');
  rect(c, left + 1, top + 13, width - 2, 11, shade(shirt, 0.78));
  rect(c, left + 2, top + 14, width - 4, 8, shirt);
  rect(c, left + 2, top + 14, 3, 6, shade(shirt, 1.2));
  rect(c, -3, top + 21, 6, 2, shade(shirt, 0.88));
  rect(c, -3, top + 12, 6, 3, shade(shirt, 1.15));
  if (!back) {
    rect(c, -1, top + 15, 1, 3, '#ede2c1');
    rect(c, 2, top + 15, 1, 3, '#ede2c1');
  }
  // A quiet typing/cup gesture is distinct from the walk cycle.
  const typing = animation === 'typing',
    coffee = animation === 'coffee' && t % 10500 > 6500 && t % 10500 < 8600;
  const armA =
    animation === 'celebration' ? -10 : typing ? -4 + Math.sin(t / 95) : walking ? swing * 2 : 0;
  const armB =
    animation === 'celebration'
      ? -12
      : typing
        ? -4 - Math.sin(t / 95)
        : coffee
          ? -7
          : walking
            ? -swing * 2
            : 0;
  rect(c, left - 1, top + 15 + armA, 3, 7, shade(shirt, 0.84));
  rect(c, left + width - 2, top + 15 + armB, 3, 7, shade(shirt, 0.9));
  rect(c, left - 1, top + 21 + armA, 3, 3, skin);
  rect(c, left + width - 2, top + 21 + armB, 3, 3, skin);
  if (coffee) {
    rect(c, left + width - 2, top + 17 + armB, 5, 5, '#eee0ba');
    rect(c, left + width - 1, top + 17 + armB, 3, 1, '#81654c');
  }
  const hair = '#463837';
  rect(c, -6, top + 1, 12, 13, hair);
  rect(c, -7, top + 4, 14, 8, hair);
  rect(c, -5, top + 4, 10, 10, shade(skin, 0.88));
  rect(c, -5, top + 4, 9, 8, skin);
  rect(c, -4, top + 4, 3, 5, shade(skin, 1.1));
  rect(c, -3, top + 13, 6, 2, skin);
  rect(c, 5, top + 7, 2, 4, shade(skin, 0.84));
  if (!side) rect(c, -7, top + 7, 2, 4, skin);
  else rect(c, -7, top + 9, 2, 2, skin);
  rect(c, -6, top, 12, 5, hair);
  rect(c, -4, top - 1, 9, 3, hair);
  rect(c, -6, top + 3, 3, 4, hair);
  rect(c, 4, top + 3, 3, 4, hair);
  rect(c, -4, top + 1, 7, 1, '#76564c');
  if (avatar.hair === 'bob') {
    rect(c, -7, top + 3, 3, 12, hair);
    rect(c, 5, top + 3, 3, 12, hair);
    rect(c, -6, top + 6, 1, 7, '#76564c');
  }
  if (avatar.hair === 'curly')
    for (const [a, b, w, h] of [
      [-8, 1, 4, 6],
      [-5, -2, 5, 5],
      [0, -2, 5, 5],
      [4, 0, 4, 5],
    ]) {
      rect(c, a, top + b, w, h, hair);
      rect(c, a + 1, top + b, 2, 1, '#76564c');
    }
  if (back) {
    rect(c, -5, top + 4, 10, 7, hair);
    rect(c, -4, top + 5, 2, 3, '#684b42');
  } else {
    const blink = t % 5300 < 105;
    const eyes = side ? [-3] : [-3, 2];
    for (const eye of eyes) {
      rect(c, eye, top + 7, 2, 1, '#84634f88');
      rect(c, eye, top + 9, 2, blink ? 1 : 2, '#293d40');
      if (!blink) rect(c, eye, top + 9, 1, 1, '#f9eccd');
    }
    rect(c, side ? -4 : -5, top + 12, 2, 1, '#c9806d55');
    if (!side) rect(c, 4, top + 12, 1, 1, '#c9806d55');
    const talking = animation === 'talking' && Math.floor(t / 130) % 3 === 0;
    rect(c, side ? -4 : 0, top + 13, side ? 1 : 2, talking ? 2 : 1, '#9a6652');
    if (avatar.glasses) {
      for (const eye of side ? [-5] : [-5, 1]) {
        rect(c, eye, top + 8, 5, 4, '#31474a');
        rect(c, eye + 1, top + 9, 3, 2, '#b5cdb9');
      }
      rect(c, 0, top + 9, 2, 1, '#31474a');
    }
  }
  if (animation === 'celebration')
    for (let i = 0; i < 8; i++) {
      const a = time / 380 + i * 0.785;
      rect(
        c,
        Math.cos(a) * 16,
        top - 7 + Math.sin(a) * 7,
        2,
        2,
        ['#efcc86', '#b0cf98', '#c4add2'][i % 3],
      );
    }
  c.restore();
}
export function drawMarker(c: Context, x: number, y: number, time: number) {
  const offset = Math.sin(time / 600) * 1.4;
  c.save();
  c.translate(Math.round(x), Math.round(y - 48 + offset));
  c.fillStyle = '#253f3722';
  c.beginPath();
  c.ellipse(0, 7, 8, 2, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#f6df9f';
  c.beginPath();
  c.moveTo(0, -7);
  c.lineTo(6, 0);
  c.lineTo(0, 7);
  c.lineTo(-6, 0);
  c.closePath();
  c.fill();
  rect(c, -1, -3, 2, 5, '#7b6742');
  rect(c, -1, 3, 2, 1, '#7b6742');
  c.restore();
}
export function drawAtmosphere(c: Context, time: number) {
  // Sunlit dust drifts slowly, with each particle following its own path.
  c.save();
  for (let i = 0; i < 18; i++) {
    const x = 71 + ((i * 37) % 274) + Math.sin(time / 7000 + i * 1.7) * 10,
      y = 65 + ((i * 19 + time / 500) % 100);
    c.globalAlpha = 0.18 + Math.sin(time / 1700 + i) * 0.1;
    c.fillStyle = '#fff1bd';
    c.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  c.globalAlpha = 1;
  // Local pools of light leave depth in the corners instead of washing out the room.
  for (const [x, y, r, color] of [
    [114, 105, 112, '#ffe8af'],
    [261, 177, 96, '#ffe6b3'],
    [560, 142, 68, '#cbe9ca'],
    [460, 346, 63, '#ffce91'],
  ] as [number, number, number, string][]) {
    const glow = c.createRadialGradient(x, y, 2, x, y, r);
    glow.addColorStop(0, color + '16');
    glow.addColorStop(0.65, color + '07');
    glow.addColorStop(1, color + '00');
    c.fillStyle = glow;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const shade = c.createLinearGradient(0, 60, 640, 400);
  shade.addColorStop(0, '#e2d4ac00');
  shade.addColorStop(1, '#183c3c24');
  c.fillStyle = shade;
  c.fillRect(16, 58, 608, 326);
  c.restore();
}
export function drawDeskScene(c: Context, avatar: Avatar, time: number) {
  if (artReady()) {
    c.save();
    c.scale(1.5, 1.5);
    c.translate(-194, -80);
    drawWorld(c, time, null);
    [
      ...furnitureLayers(time, null),
      {
        depth: 193,
        draw: (ctx: Context) => drawCharacter(ctx, 270, 176, avatar, time, false, 'up', 'typing'),
      },
    ]
      .sort((a, b) => a.depth - b.depth)
      .forEach((layer) => layer.draw(c));
    c.restore();
    const fade = c.createRadialGradient(120, 105, 43, 120, 105, 118);
    fade.addColorStop(0, '#1b363000');
    fade.addColorStop(1, '#1b3630');
    c.fillStyle = fade;
    c.fillRect(0, 0, 240, 190);
    return;
  }
  // A personal desk diorama for the pause screen, drawn with the same game assets.
  const backdrop = c.createLinearGradient(0, 0, 0, 190);
  backdrop.addColorStop(0, '#314e45');
  backdrop.addColorStop(1, '#182f2d');
  c.fillStyle = backdrop;
  c.fillRect(0, 0, 240, 190);
  rect(c, 28, 33, 184, 112, '#a89d77');
  rect(c, 29, 34, 182, 79, '#91a48b');
  for (let i = 0; i < 6; i++) rect(c, 29, 114 + i * 5, 182, 5, i % 2 ? '#9e805b' : '#a98c65');
  windowArt(c, 85, 70);
  plant(c, 46, 88, time);
  // Draw a small shelf and books beside the window.
  rect(c, 166, 65, 27, 4, '#d5b381');
  for (let i = 0; i < 5; i++)
    rect(
      c,
      169 + i * 4,
      51 + (i % 2) * 3,
      3,
      14 - (i % 2) * 3,
      ['#d5bd91', '#9cb5a2', '#b299b7'][i % 3],
    );
  drawCharacter(c, 121, 151, avatar, time, false, 'up', 'typing');
  desk(c, 77, 126, 91, '#6d9988', time);
  plant(c, 168, 117, time);
  chair(c, 112, 155, avatar.shirt);
  const light = c.createRadialGradient(118, 109, 2, 118, 109, 82);
  light.addColorStop(0, '#ffe7ae22');
  light.addColorStop(1, '#ffe7ae00');
  c.fillStyle = light;
  c.fillRect(28, 33, 184, 145);
  const fade = c.createRadialGradient(120, 98, 45, 120, 98, 115);
  fade.addColorStop(0, '#1b363000');
  fade.addColorStop(1, '#1b3630');
  c.fillStyle = fade;
  c.fillRect(0, 0, 240, 190);
}
