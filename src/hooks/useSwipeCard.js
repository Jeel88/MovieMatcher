import { useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef } from 'react';

export const useSwipeCard = ({ index, onVote, filmId }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Guard: prevent double-voting on the same card
  const hasVoted = useRef(false);

  // Tilt based on x drag
  const rotate = useTransform(x, [-300, 300], [-18, 18]);

  // Fade in overlays based on drag distances
  const noOpacity = useTransform(x, [-80, -20], [1, 0]);
  const yesOpacity = useTransform(x, [20, 80], [0, 1]);
  const loveOpacity = useTransform(y, [-80, -20], [1, 0]);

  const combinedNoOpacity = useTransform([noOpacity, loveOpacity], ([n, l]) => l > 0.5 ? 0 : n);
  const combinedYesOpacity = useTransform([yesOpacity, loveOpacity], ([y, l]) => l > 0.5 ? 0 : y);

  const flyOut = (direction, callback) => {
    const targets = {
      right: { x: 600,  y: -50,  },
      left:  { x: -600, y: -50,  },
      up:    { x: 0,    y: -700, },
    };
    const t = targets[direction];
    animate(x, t.x, { duration: 0.35, ease: 'easeIn' });
    animate(y, t.y, { duration: 0.35, ease: 'easeIn' });
    setTimeout(callback, 320);
  };

  const handleDragEnd = (event, info) => {
    // If we already voted on this card instance, ignore
    if (hasVoted.current) return;

    const vx = info.velocity.x;
    const vy = info.velocity.y;
    const ox = info.offset.x;
    const oy = info.offset.y;

    if (vy < -250 || oy < -120) {
      hasVoted.current = true;
      flyOut('up', () => onVote('love', filmId));
    } else if (vx > 250 || ox > 120) {
      hasVoted.current = true;
      flyOut('right', () => onVote('yes', filmId));
    } else if (vx < -250 || ox < -120) {
      hasVoted.current = true;
      flyOut('left', () => onVote('no', filmId));
    } else {
      // Snap back with spring
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  const dragProps = {
    x,
    y,
    drag: index === 0,
    dragConstraints: { left: -500, right: 500, top: -600, bottom: 100 },
    dragElastic: 0.7,
    onDragEnd: handleDragEnd,
    whileTap: { scale: index === 0 ? 1.03 : 1 },
    style: { touchAction: 'none' },
  };

  return {
    dragProps,
    rotate,
    opacities: {
      no: combinedNoOpacity,
      yes: combinedYesOpacity,
      love: loveOpacity,
    },
  };
};
