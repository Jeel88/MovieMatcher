import { useMotionValue, useTransform } from 'framer-motion';

export const useSwipeCard = ({ index, onVote, filmId }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tilt based on x drag
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // Fade in overlays based on drag distances
  const noOpacity = useTransform(x, [-100, -20], [1, 0]);
  const yesOpacity = useTransform(x, [20, 100], [0, 1]);
  // Love requires dragging straight up
  const loveOpacity = useTransform(y, [-100, -20], [1, 0]);

  // Clean up visual noise when dragging heavily in one direction
  const combinedNoOpacity = useTransform([noOpacity, loveOpacity], ([n, l]) => l > 0.5 ? 0 : n);
  const combinedYesOpacity = useTransform([yesOpacity, loveOpacity], ([y, l]) => l > 0.5 ? 0 : y);

  // Velocity threshold set to 300 for mobile touch friendly throws
  const handleDragEnd = (event, info) => {
    const vx = info.velocity.x;
    const vy = info.velocity.y;

    if (vy < -300) {
      onVote('love', filmId);
    } else if (vx > 300) {
      onVote('yes', filmId);
    } else if (vx < -300) {
      onVote('no', filmId);
    }
    // Snap back automatically handles by Framer Motion dragConstraints in the component
  };

  const dragProps = {
    x,
    y,
    drag: index === 0 ? true : false,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 1, // Full elasticity before snapping back
    onDragEnd: handleDragEnd,
    whileTap: { scale: index === 0 ? 1.05 : 1 }
  };

  return {
    dragProps,
    rotate,
    opacities: {
      no: combinedNoOpacity,
      yes: combinedYesOpacity,
      love: loveOpacity
    }
  };
};
