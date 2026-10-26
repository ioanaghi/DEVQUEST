import { useEffect, useRef } from 'react';
import { drawDeskScene } from '../game/art';
import { scheduleFrame, cancelFrame } from '../game/clock';
import { motionReduced } from '../lib/motion';
import type { Avatar } from '../types';
export function DeskScene({ avatar }: { avatar: Avatar }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!.getContext('2d')!;
    c.imageSmoothingEnabled = false;
    let frame = 0;
    const draw = (time: number) => {
      c.clearRect(0, 0, 240, 190);
      drawDeskScene(c, avatar, motionReduced() ? 8000 : time);
      frame = scheduleFrame(draw);
    };
    draw(performance.now());
    return () => cancelFrame(frame);
  }, [avatar]);
  return (
    <canvas
      ref={ref}
      width={240}
      height={190}
      className="desk-scene"
      aria-label="Your personal pixel art workstation"
      role="img"
    />
  );
}
