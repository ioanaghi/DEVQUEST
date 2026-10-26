import { useEffect, useRef, useState } from 'react';
import { drawWorld, drawCharacter, drawMarker, furnitureLayers, drawAtmosphere } from './art';
import { canStand, movePlayer, nearestObject, OBJECTS, roomAt } from './world.mjs';
import type { Interactive, Save } from '../types';
import { cancelFrame, scheduleFrame } from './clock';

type Props = {
  save: Save;
  paused: boolean;
  target: string;
  celebration: number;
  typing: boolean;
  onInteract: (id: Interactive) => void;
  onPosition: (p: { x: number; y: number }) => void;
  onMap: () => void;
};

export function GameWorld(props: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  latest.current = props;
  const keys = useRef(new Set<string>());
  const player = useRef(
    canStand(props.save.position.x, props.save.position.y)
      ? props.save.position
      : { x: 184, y: 328 },
  );
  const [near, setNear] = useState<{ id: Interactive; label: string } | null>(null);
  const [room, setRoom] = useState('Developer office');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const element = canvas.current!,
      parent = container.current!;
    const context = element.getContext('2d')!;
    let frame = 0,
      previous = 0,
      lastSave = 0,
      direction = 'down',
      lastNear = '',
      lastRoom = '';
    let w = 480,
      h = 288;
    let scale = 3;
    const resize = () => {
      scale = Math.max(2, Math.ceil(Math.max(parent.clientWidth / 660, parent.clientHeight / 440)));
      w = Math.ceil(parent.clientWidth / scale);
      h = Math.ceil(parent.clientHeight / scale);
      element.width = w;
      element.height = h;
      context.imageSmoothingEnabled = false;
      element.style.width = `${w * scale}px`;
      element.style.height = `${h * scale}px`;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    function loop(time: number) {
      const dt = Math.min((time - previous) / 1000, 0.04);
      previous = time;
      const p = latest.current;
      let dx = 0,
        dy = 0;
      if (!p.paused) {
        dx =
          Number(keys.current.has('d') || keys.current.has('arrowright')) -
          Number(keys.current.has('a') || keys.current.has('arrowleft'));
        dy =
          Number(keys.current.has('s') || keys.current.has('arrowdown')) -
          Number(keys.current.has('w') || keys.current.has('arrowup'));
      }
      if (dx || dy) {
        const speed = (92 * dt) / Math.hypot(dx, dy);
        player.current = movePlayer(player.current, dx * speed, dy * speed);
        direction = Math.abs(dx) > 0 ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      }
      const { x, y } = player.current;
      if (time - lastSave > 750) {
        p.onPosition({ x, y });
        lastSave = time;
      }
      const object = nearestObject(player.current);
      if ((object?.id ?? '') !== lastNear) {
        lastNear = object?.id ?? '';
        setNear(object as typeof near);
      }
      const currentRoom = roomAt(x, y);
      if (currentRoom !== lastRoom) {
        lastRoom = currentRoom;
        setRoom(currentRoom);
      }
      const cx = Math.round(w >= 640 ? (640 - w) / 2 : Math.max(0, Math.min(640 - w, x - w / 2)));
      const cy = Math.round(
        h >= 400 ? (400 - h) / 2 : Math.max(0, Math.min(400 - h, y - h / 2 - 12)),
      );
      context.clearRect(0, 0, w, h);
      context.fillStyle = '#273f3b';
      context.fillRect(0, 0, w, h);
      context.save();
      context.translate(-cx, -cy);
      drawWorld(context, time, p.save.decoration);
      const actors = [
        {
          depth: 132,
          draw: (c: CanvasRenderingContext2D) =>
            drawCharacter(
              c,
              139,
              132,
              { skin: '#d9a278', shirt: '#7897b8', hair: 'short', glasses: false },
              time,
              false,
              'down',
            ),
        },
        {
          depth: 332,
          draw: (c: CanvasRenderingContext2D) =>
            drawCharacter(
              c,
              451,
              332,
              { skin: '#b07b5d', shirt: '#c78d79', hair: 'curly', glasses: true },
              time,
              false,
              'left',
            ),
        },
        {
          depth: 270,
          draw: (c: CanvasRenderingContext2D) =>
            drawCharacter(
              c,
              120,
              270,
              { skin: '#ebbd92', shirt: '#9fa67e', hair: 'bob', glasses: false },
              time,
              false,
              'up',
              'typing',
            ),
        },
        {
          depth: y,
          draw: (c: CanvasRenderingContext2D) =>
            drawCharacter(
              c,
              x,
              y,
              p.save.avatar,
              time,
              !!(dx || dy),
              direction,
              time < p.celebration ? 'celebration' : p.typing ? 'typing' : 'idle',
            ),
        },
      ];
      [...furnitureLayers(time, p.save.decoration), ...actors]
        .sort((a, b) => a.depth - b.depth)
        .forEach((layer) => layer.draw(context));
      const marker = OBJECTS.find((o) => o.id === p.target);
      if (marker && !p.paused) drawMarker(context, marker.x, marker.y, time);
      drawAtmosphere(context, time);
      if (object && !p.paused) {
        context.fillStyle = '#173e3b';
        context.fillRect(object.x - 7, object.y - 47, 15, 14);
        context.strokeStyle = '#e7d29a';
        context.lineWidth = 1;
        context.strokeRect(object.x - 7.5, object.y - 47.5, 16, 15);
        context.fillStyle = '#fff0bd';
        context.font = 'bold 8px monospace';
        context.fillText('E', object.x - 2, object.y - 36);
      }
      context.restore();
      frame = scheduleFrame(loop);
    }
    loop(performance.now());
    const down = (event: KeyboardEvent) => {
      if (
        latest.current.paused ||
        (event.target instanceof HTMLElement &&
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName))
      )
        return;
      const key = event.key.toLowerCase();
      if (
        ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'e'].includes(key)
      )
        event.preventDefault();
      keys.current.add(key);
      if (key === 'e' && !event.repeat) {
        const object = nearestObject(player.current);
        if (object) latest.current.onInteract(object.id as Interactive);
      }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const clear = () => {
      keys.current.clear();
      latest.current.onPosition({ ...player.current });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      cancelFrame(frame);
      observer.disconnect();
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      latest.current.onPosition({ ...player.current });
    };
  }, []);

  useEffect(() => {
    if (props.paused) keys.current.clear();
  }, [props.paused]);
  const press = (key: string) => (event: React.PointerEvent) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    keys.current.add(key);
  };
  const release = (key: string) => () => keys.current.delete(key);
  return (
    <section className="world-shell" aria-label="PixelByte office game">
      <div ref={container} className={`world-viewport ${focused ? 'is-focused' : ''}`}>
        <canvas
          ref={canvas}
          tabIndex={0}
          aria-label="PixelByte office. Move with WASD or arrows. Press E to interact. Press M for the office map."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={() => canvas.current?.focus()}
        />
        <div className="world-vignette" />
      </div>
      <button className="location-tag" onClick={props.onMap} aria-label="Open office map">
        <span className="location-compass">
          N<span>✦</span>
        </span>
        <div>
          <span>PIXELBYTE HQ · FLOOR 01</span>
          <strong>{room}</strong>
        </div>
        <kbd>M</kbd>
      </button>
      <div className="world-interact" aria-live="polite">
        {near && !props.paused ? (
          <button className="interact-prompt" onClick={() => props.onInteract(near.id)}>
            <kbd>E</kbd>
            <span>{near.label}</span>
            <b>Interact</b>
          </button>
        ) : !props.paused ? (
          <div className="movement-hint">
            <span>
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd> to explore
            </span>
            <span>
              <kbd>E</kbd> to interact
            </span>
          </div>
        ) : null}
      </div>
      <div className="touch-controls" aria-label="Movement controls">
        {(['a', 'w', 's', 'd'] as const).map((key, i) => (
          <button
            key={key}
            aria-label={['Move left', 'Move up', 'Move down', 'Move right'][i]}
            onPointerDown={press(key)}
            onPointerUp={release(key)}
            onPointerCancel={release(key)}
          >
            {['←', '↑', '↓', '→'][i]}
          </button>
        ))}
        <button disabled={!near} onClick={() => near && props.onInteract(near.id)}>
          Interact
        </button>
      </div>
    </section>
  );
}
