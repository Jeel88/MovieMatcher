import { useState, useEffect } from 'react';

export const useCountdown = (from = 5, onComplete) => {
  const [count, setCount] = useState(from);
  const progressPercentage = ((from - count) / from) * 100;

  useEffect(() => {
    if (count <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, from, onComplete]);

  return { count, progressPercentage };
};
