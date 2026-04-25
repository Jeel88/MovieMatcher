import React, { useEffect, useState } from 'react';
import { useSession } from '../store/sessionStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Countdown = () => {
  const { dispatch } = useSession();
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count <= 0) {
      dispatch({ type: 'SET_PHASE', payload: 'reveal' });
      return;
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, dispatch]);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* Glitching background grid */}
      <div className="absolute inset-0 bg-halftone opacity-20 invert animate-pulse" />
      
      {/* Aggressive flashing background */}
      <motion.div 
        className="absolute inset-0 mix-blend-overlay opacity-30"
        animate={{ backgroundColor: ["#FF2E93", "#00E5FF", "#FFE600", "#000000"] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center justify-center z-10"
      >
        {/* Multiple brutalist rotating rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-64 h-64 md:w-96 md:h-96 border-[8px] border-dashed border-pink-500 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-72 h-72 md:w-[420px] md:h-[420px] border-[4px] border-cyan-400 rounded-full"
        />

        <div className="flex flex-col items-center justify-center z-20">
          <motion.h2 
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="font-heading text-3xl md:text-5xl uppercase font-bold tracking-[0.2em] mb-4 text-white drop-shadow-[4px_4px_0_#FF2E93]"
          >
            CALCULATING MATRIX
          </motion.h2>
          
          <AnimatePresence mode="popLayout">
            <motion.span
              key={count}
              initial={{ scale: 3, opacity: 0, rotate: -25, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" }}
              exit={{ scale: 0, opacity: 0, rotate: 25, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="font-display text-[200px] leading-none text-yellow-400 drop-shadow-[10px_10px_0_#00E5FF]"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

    </div>
  );
};
