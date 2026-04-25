import { useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef } from 'react';

export const useSwipeCard = ({ index, onVote, filmId }) => {
  const isFront = index === 0;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const hasVoted = useRef(false);

  // Derived transforms — only meaningful for the front card
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const noOpacity = useTransform(x, [-80, -20], [1, 0]);
  const yesOpacity = useTransform(x, [20, 80], [0, 1]);
  const loveOpacity = useTransform(y, [-80, -20], [1, 0]);
  const combinedNoOpacity = useTransform([noOpacity, loveOpacity], ([n, l]) => l > 0.5 ? 0 : n);
  const combinedYesOpacity = useTransform([yesOpacity, loveOpacity], ([y, l]) => l > 0.5 ? 0 : y);

  const flyOut = (direction, callback) => {
    const t = {
      right: { tx: 800, ty: -50 },
      left:  { tx: -800, ty: -50 },
      up:    { tx: 0, ty: -800 },
    }[direction];
    animate(x, t.tx, { duration: 0.3, ease: 'easeIn' });
    animate(y, t.ty, { duration: 0.3, ease: 'easeIn' });
    setTimeout(callback, 280);
  };

  const handleDragEnd = (event, info) => {
    if (hasVoted.current) return;
    const { x: vx, y: vy } = info.velocity;
    const { x: ox, y: oy } = info.offset;

    if (vy < -200 || oy < -100) {
      hasVoted.current = true;
      flyOut('up', () => onVote('love', filmId));
    } else if (vx > 200 || ox > 100) {
      hasVoted.current = true;
      flyOut('right', () => onVote('yes', filmId));
    } else if (vx < -200 || ox < -100) {
      hasVoted.current = true;
      flyOut('left', () => onVote('no', filmId));
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  return {
    // Motion values — only used by front card
    motionX: x,
    motionY: y,
    rotate,
    opacities: {
      no: combinedNoOpacity,
      yes: combinedYesOpacity,
      love: loveOpacity,
    },
    // Drag config — only spread on front card
    dragConfig: {
      drag: true,
      dragConstraints: { left: -500, right: 500, top: -500, bottom: 200 },
      dragElastic: 0.8,
      onDragEnd: handleDragEnd,
      whileTap: { scale: 1.02 },
    },
    isFront,
  };
};
