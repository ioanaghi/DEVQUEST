import { useEffect, useRef, useState } from 'react';
import { drawWorld, drawCharacter, drawMarker, furnitureLayers, drawAtmosphere } from './art';
import { canStand, movePlayer, nearestObject, OBJECTS, roomAt } from './world.mjs';
import type { Interactive, Save } from '../types';
import { cancelFrame, scheduleFrame } from './clock';
import { steer, cameraTarget, approachCamera } from './motion.mjs';
import { cue } from './sound';
import { motionReduced } from '../lib/motion';

type Props = {
  save: Save;
  paused: boolean;
  target: string;
  celebration: number;
  typing: boolean;
  onInteract: (id: Interactive) => void;
  onPosition: (p: { x: number; y: number }) => void;
  onMap: () => void;
  onHudOverlap: (covered: boolean) => void;
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
    let velocity = { x: 0, y: 0 },
      distance = 0,
      worldTime = 7000;
    let camera = cameraTarget(player.current, velocity, 480, 288);
    let focusedObject: string | null = null;
    let focusAmount = 0,
      lastFootDistance = 0,
      lastFootTime = 0,
      lastHudOverlap = false;
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
      camera = cameraTarget(player.current, velocity, w, h);
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
      const reduced = motionReduced();
      velocity = p.paused
        ? { x: 0, y: 0 }
        : steer(velocity, { x: dx, y: dy }, dt, keys.current.has('shift'));
      const before = player.current;
      player.current = movePlayer(before, velocity.x * dt, velocity.y * dt);
      const travelled = Math.hypot(player.current.x - before.x, player.current.y - before.y);
      distance += travelled;
      if (travelled > 0.02 && distance - lastFootDistance > 18 && time - lastFootTime > 170) {
        cue('step');
        lastFootDistance = distance;
        lastFootTime = time;
      }
      const moving = travelled > 0.04;
      if (moving)
        direction =
          Math.abs(velocity.x) > Math.abs(velocity.y)
            ? velocity.x > 0
              ? 'right'
              : 'left'
            : velocity.y > 0
              ? 'down'
              : 'up';
      if (!p.paused || p.typing) worldTime += dt * 1000;
      const animationTime = reduced ? 7000 : worldTime;
      const { x, y } = player.current;
      if (time - lastSave > 750) {
        p.onPosition({ x, y });
        lastSave = time;
      }
      let object = nearestObject(player.current);
      const retained = OBJECTS.find((o) => o.id === lastNear);
      if (
        retained &&
        Math.hypot(x - retained.x, y - retained.y) < retained.radius + 6 &&
        (!object || object.distance > Math.hypot(x - retained.x, y - retained.y) - 9)
      )
        object = { ...retained, distance: Math.hypot(x - retained.x, y - retained.y) };
      focusedObject = object?.id ?? null;
      focusAmount += ((object && !p.paused ? 1 : 0) - focusAmount) * Math.min(1, dt * 12);
      if ((object?.id ?? '') !== lastNear) {
        lastNear = object?.id ?? '';
        setNear(object as typeof near);
      }
      const currentRoom = roomAt(x, y);
      if (currentRoom !== lastRoom) {
        lastRoom = currentRoom;
        setRoom(currentRoom);
      }
      camera = approachCamera(camera, cameraTarget(player.current, velocity, w, h), dt, reduced);
      const cx = Math.round(camera.x),
        cy = Math.round(camera.y);
      const covered = (x - cx) * scale > parent.clientWidth - 320 && (y - cy) * scale < 430;
      if (covered !== lastHudOverlap) {
        lastHudOverlap = covered;
        p.onHudOverlap(covered);
      }
      context.clearRect(0, 0, w, h);
      context.fillStyle = '#273f3b';
      context.fillRect(0, 0, w, h);
      context.save();
      context.translate(-cx, -cy);
      drawWorld(context, animationTime, p.save.decoration);
      const actors = [
        {
          depth: 137,
          draw: (c: CanvasRenderingContext2D) =>
            drawCharacter(
              c,
              150,
              137,
              { skin: '#d9a278', shirt: '#7897b8', hair: 'short', glasses: false },
              animationTime + 2100,
              false,
              Math.hypot(x - 150, y - 137) < 68
                ? x < 130
                  ? 'left'
                  : x > 150
                    ? 'right'
                    : 'down'
                : 'down',
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
              animationTime + 6800,
              false,
              Math.hypot(x - 451, y - 332) < 60 ? (x < 451 ? 'left' : 'right') : 'left',
              'coffee',
            ),
        },
        {
          depth: 267,
          draw: (c: CanvasRenderingContext2D) =>
            drawCharacter(
              c,
              168,
              267,
              { skin: '#ebbd92', shirt: '#9fa67e', hair: 'bob', glasses: false },
              animationTime + 4400,
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
              animationTime,
              moving,
              direction,
              time < p.celebration && !reduced ? 'celebration' : p.typing ? 'typing' : 'idle',
              distance,
            ),
        },
      ];
      [...furnitureLayers(animationTime, p.save.decoration), ...actors]
        .sort((a, b) => a.depth - b.depth)
        .forEach((layer) => layer.draw(context));
      const marker = OBJECTS.find((o) => o.id === p.target);
      if (marker && !p.paused && marker.id !== focusedObject)
        drawMarker(context, marker.x, marker.y, animationTime);
      drawAtmosphere(context, animationTime);
      if (object && focusAmount > 0.05) {
        context.save();
        context.globalAlpha = focusAmount;
        context.strokeStyle = '#f4db9a';
        context.lineWidth = 1;
        context.setLineDash([3, 3]);
        context.lineDashOffset = reduced ? 0 : -animationTime / 180;
        context.beginPath();
        context.ellipse(object.x, object.y + 3, 13, 5, 0, 0, Math.PI * 2);
        context.stroke();
        context.setLineDash([]);
        context.restore();
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
        const object = OBJECTS.find((o) => o.id === focusedObject) ?? nearestObject(player.current);
        if (
          object &&
          Math.hypot(player.current.x - object.x, player.current.y - object.y) < object.radius + 6
        )
          latest.current.onInteract(object.id as Interactive);
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
          <strong key={room} className="room-name">
            {room}
          </strong>
        </div>
        <kbd>M</kbd>
      </button>
      <div className="world-interact" aria-live="polite">
        {near && !props.paused ? (
          <button
            key={near.id}
            className="interact-prompt"
            onClick={() => props.onInteract(near.id)}
          >
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
