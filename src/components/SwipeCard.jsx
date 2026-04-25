import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X, Check } from 'lucide-react';
import { useSwipeCard } from '../hooks/useSwipeCard';

export const SwipeCard = ({ film, index, onVote }) => {
  const { dragProps, rotate, opacities } = useSwipeCard({ index, onVote, filmId: film.id });
  const isFront = index === 0;

  return (
    <motion.div
      style={{
        x: dragProps.x,
        y: dragProps.y,
        rotate,
        scale: isFront ? 1 : 1 - index * 0.05,
        y: isFront ? dragProps.y : index * 12, // Stack offset
        zIndex: 10 - index,
      }}
      {...dragProps}
      className={`absolute inset-0 rounded-3xl shadow-brutal border-brutal bg-white overflow-hidden film-grain flex flex-col justify-end ${
        isFront ? 'cursor-grab active:cursor-grabbing' : 'cursor-default pointer-events-none'
      }`}
    >
      <img 
        src={film.posterUrl} 
        alt={film.title} 
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable="false"
      />
      
      {/* Gradient overlay to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* Overlays */}
      <motion.div style={{ opacity: opacities.no }} className="absolute top-8 right-8 pointer-events-none">
        <div className="border-brutal rounded-full p-2 bg-pink-500 shadow-brutal rotate-12">
          <X className="w-12 h-12 text-white" strokeWidth={4} />
        </div>
      </motion.div>

      <motion.div style={{ opacity: opacities.yes }} className="absolute top-8 left-8 pointer-events-none">
        <div className="border-brutal rounded-full p-2 bg-green-400 shadow-brutal -rotate-12">
          <Check className="w-12 h-12 text-black" strokeWidth={4} />
        </div>
      </motion.div>

      <motion.div style={{ opacity: opacities.love }} className="absolute bottom-1/2 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="border-brutal rounded-full p-4 bg-yellow-400 shadow-brutal-lg -rotate-6">
          <Heart className="w-16 h-16 text-black fill-black" strokeWidth={3} />
        </div>
      </motion.div>

      {/* Card Content - Chainzoku Style */}
      <div className="relative p-6 z-10 pointer-events-none select-none">
        <h2 className="font-display text-4xl text-white mb-2 leading-none uppercase tracking-wide text-outline shadow-brutal-text">{film.title}</h2>
        
        <div className="flex gap-2 mb-3">
          <div className="px-3 py-1 bg-yellow-400 border-2 border-black rounded font-sans text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_#111]">
            {film.year}
          </div>
          <div className="px-3 py-1 bg-pink-500 border-2 border-black rounded font-sans text-xs font-bold text-white uppercase shadow-[2px_2px_0px_0px_#111]">
            {film.runtime}
          </div>
        </div>

        <div className="inline-block px-3 py-1 bg-white border-2 border-black rounded font-sans text-xs font-bold text-black uppercase mb-3 shadow-[2px_2px_0px_0px_#111]">
          {film.genre}
        </div>

        <p className="font-sans text-sm font-medium text-white/90 line-clamp-3 leading-relaxed bg-black/50 p-2 rounded backdrop-blur-sm border border-white/20">
          {film.synopsis}
        </p>
      </div>
    </motion.div>
  );
};
