import { useEffect, useRef } from 'react';
import { drawCharacter } from '../game/art';
import type { Avatar } from '../types';
import { cancelFrame, scheduleFrame } from '../game/clock';
import { motionReduced } from '../lib/motion';
export function AvatarPreview({
  avatar,
  size = 80,
  animation = 'idle',
}: {
  avatar: Avatar;
  size?: number;
  animation?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!.getContext('2d')!;
    c.imageSmoothingEnabled = false;
    let frame = 0;
    function draw(time: number) {
      c.clearRect(0, 0, 32, 36);
      drawCharacter(c, 16, 31, avatar, motionReduced() ? 7000 : time, false, 'down', animation);
      frame = scheduleFrame(draw);
    }
    draw(performance.now());
    return () => cancelFrame(frame);
  }, [avatar, animation]);
  return (
    <canvas
      ref={canvas}
      width={32}
      height={36}
      style={{ width: size, height: (size * 36) / 32, imageRendering: 'pixelated' }}
      aria-label="Your pixel developer avatar"
      role="img"
    />
  );
}
