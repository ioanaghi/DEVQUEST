// Original code-drawn collection items; no external asset dependency.
export function drawSeasonReward(
  c: CanvasRenderingContext2D,
  id: string,
  x: number,
  y: number,
  time: number,
) {
  c.fillStyle = '#d2b57b';
  c.fillRect(x, y, 13, 9);
  c.fillStyle = '#354458';
  if (id === 'warehouse') {
    for (const dx of [1, 9]) {
      c.fillStyle = '#687e79';
      c.fillRect(x + dx, y - 5, 3, 11);
      c.fillStyle = '#b6c8ba';
      c.fillRect(x + dx - 2, y - 5, 5, 2);
      c.fillStyle = '#354458';
      c.fillRect(x + dx - 2, y - 3, 1, 3);
      c.fillRect(x + dx + 2, y - 3, 1, 3);
    }
  } else if (id === 'traffic') {
    c.fillRect(x, y - 3, 13, 10);
    c.fillStyle = '#92c6a0';
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const yy = y + 3 - ((i * 7 + Math.floor(time / 400)) % 5);
      i ? c.lineTo(x + i + 1, yy) : c.moveTo(x + i + 1, yy);
    }
    c.strokeStyle = '#92c6a0';
    c.lineWidth = 1;
    c.stroke();
  } else if (id === 'stack') {
    c.fillRect(x, y - 2, 13, 8);
    c.fillStyle = '#c6db91';
    c.fillRect(x + 2, y + 1, 2, 1);
    c.fillRect(x + 3, y + 2, 1, 1);
    c.fillRect(x + 6, y + 3, 3, 1);
    c.fillStyle = '#8c9270';
    c.fillRect(x, y + 7, 13, 2);
  } else if (id === 'binary') {
    c.fillStyle = Math.floor(time / 700) % 2 ? '#dba575' : '#b7cc8d';
    c.fillRect(x + 4, y - 4, 5, 8);
    c.fillStyle = '#677d72';
    c.fillRect(x + 2, y + 5, 9, 3);
  } else if (id === 'recursion') {
    c.fillStyle = '#886d4c';
    c.fillRect(x, y - 4, 13, 13);
    for (let i = 0; i < 4; i++) {
      c.fillStyle = ['#a7b58b', '#aa8190', '#7f9caa', '#d7bd80'][i];
      c.fillRect(x + 1 + i * 3, y - 3, 2, 5);
      c.fillRect(x + 1 + i * 3, y + 3, 2, 5);
    }
  } else if (id === 'sql2') {
    c.fillStyle = '#997e57';
    c.fillRect(x, y - 4, 13, 13);
    c.strokeStyle = '#c98e86';
    c.beginPath();
    c.moveTo(x + 2, y - 1);
    c.lineTo(x + 10, y + 5);
    c.moveTo(x + 9, y - 2);
    c.lineTo(x + 3, y + 6);
    c.stroke();
    c.fillStyle = '#eee2b7';
    c.fillRect(x + 1, y - 3, 4, 4);
    c.fillRect(x + 8, y + 3, 4, 4);
  } else if (id === 'oop') {
    c.fillRect(x - 1, y - 4, 15, 10);
    c.fillStyle = '#a5c4b3';
    c.fillRect(x + 1, y - 2, 11, 6);
    c.fillStyle = '#657b72';
    c.fillRect(x + 5, y + 6, 3, 3);
  } else {
    c.fillStyle = '#a7b6ac';
    c.fillRect(x + 2, y, 9, 7);
    c.fillStyle = '#354458';
    c.fillRect(x + 4, y + 2, 2, 2);
    c.fillRect(x + 8, y + 2, 2, 2);
  }
}
