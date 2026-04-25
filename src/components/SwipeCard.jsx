import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X, Check } from 'lucide-react';
import { useSwipeCard } from '../hooks/useSwipeCard';

export const SwipeCard = ({ film, index, onVote }) => {
  const { motionX, motionY, rotate, opacities, dragConfig, isFront } = useSwipeCard({ index, onVote, filmId: film.id });

  // Background cards: static, no drag, no motion values
  if (!isFront) {
    return (
      <motion.div
        initial={{ scale: 1 - index * 0.05, y: index * 14 }}
        animate={{ scale: 1 - index * 0.05, y: index * 14 }}
        style={{ zIndex: 10 - index, touchAction: 'none' }}
        className="absolute inset-0 rounded-3xl shadow-brutal border-brutal bg-white overflow-hidden film-grain flex flex-col justify-end cursor-default pointer-events-none"
      >
        <img
          src={film.posterUrl}
          alt={film.title}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable="false"
          onError={(e) => {
            const slug = film.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            e.target.src = `https://picsum.photos/seed/${slug}/400/600`;
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </motion.div>
    );
  }

  // Front card: full drag + overlays + content
  return (
    <motion.div
      style={{
        x: motionX,
        y: motionY,
        rotate,
        zIndex: 10,
        touchAction: 'none',
      }}
      {...dragConfig}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
      className="absolute inset-0 rounded-3xl shadow-brutal border-brutal bg-white overflow-hidden film-grain flex flex-col justify-end cursor-grab active:cursor-grabbing"
    >
      <img
        src={film.posterUrl}
        alt={film.title}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable="false"
        onError={(e) => {
          const slug = film.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          e.target.src = `https://picsum.photos/seed/${slug}/400/600`;
          e.target.onerror = null;
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* Swipe direction overlays */}
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

      {/* Film info */}
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
