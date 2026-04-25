import React, { useEffect, useState, useRef } from 'react';
import { useSession } from '../store/sessionStore';
import { SwipeCard } from './SwipeCard';
import { films, shuffleFilms } from '../data/films';
import { AnimatePresence, motion } from 'framer-motion';
import { broadcastVotes } from '../utils/supabase';

export const VotingPhase = () => {
  const { state, dispatch } = useSession();
  const participant = state.participants.find(p => p.name === state.localParticipantName) || state.participants[0];
  const [queue, setQueue] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  // Airtight guard: each filmId can only be voted on once per session
  const votedFilms = useRef(new Set());
  // Track voted count for the progress indicator
  const [votedCount, setVotedCount] = useState(0);

  // Build the queue once on mount
  useEffect(() => {
    if (!participant || hasInitialized) return;

    if (!participant.queue || participant.queue.length === 0) {
      const source = (state.aiCatalogue && state.aiCatalogue.length > 0) ? state.aiCatalogue : films;

      let pool = source;
      if (state.bannedFilms && state.bannedFilms.length > 0) {
        pool = pool.filter(f => !state.bannedFilms.includes(f.id));
      }
      if (state.selectedGenres && state.selectedGenres.length > 0) {
        pool = pool.filter(f => state.selectedGenres.some(g => f.genre.includes(g)));
      }
      if (pool.length === 0) pool = source; // fallback

      const newQueue = shuffleFilms(pool).slice(0, 10);
      dispatch({ type: 'SET_PARTICIPANT_QUEUE', payload: { name: participant.name, queue: newQueue } });
      setQueue(newQueue);
    } else {
      // Restore remaining cards (skip already-voted films)
      const remaining = participant.queue.filter(f => !participant.votes[f.id]);
      // Pre-fill votedFilms from existing votes so the guard stays consistent
      Object.keys(participant.votes).forEach(id => votedFilms.current.add(Number(id)));
      setQueue(remaining);
      setVotedCount(Object.keys(participant.votes).length);
    }

    setHasInitialized(true);
  }, [participant, dispatch, hasInitialized, state.bannedFilms, state.selectedGenres, state.aiCatalogue]);

  const handleVote = (sentiment, filmId) => {
    // Deduplicate — ignore if already voted
    if (votedFilms.current.has(filmId)) return;
    votedFilms.current.add(filmId);

    // 1. Record vote in global state
    dispatch({ type: 'CAST_VOTE', payload: { name: participant.name, filmId, sentiment } });

    // 2. Remove card from local queue
    const remainingQueue = queue.filter(f => f.id !== filmId);
    setQueue(remainingQueue);
    setVotedCount(prev => prev + 1);

    // 3. If queue empty → finished
    if (remainingQueue.length === 0) {
      const updatedVotes = { ...participant.votes, [filmId]: sentiment };
      dispatch({ type: 'MARK_FINISHED', payload: participant.name });
      if (import.meta.env.VITE_SUPABASE_URL && state.roomId) {
        broadcastVotes(state.roomId, participant.name, updatedVotes, true);
      }
    }
  };

  if (!participant) return null;

  const totalCards = (participant.queue && participant.queue.length > 0)
    ? participant.queue.length
    : 10;

  return (
    <div className="h-screen overflow-hidden bg-[#F4F4F0] text-black flex flex-col bg-halftone">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b-[3px] border-black bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-pink-500 text-white font-display text-lg px-3 py-1 border-[3px] border-black -rotate-1">
            {participant.name}
          </div>
          <span className="font-sans font-bold text-sm text-gray-500 hidden sm:block">
            Room: {state.roomCode || 'LOCAL'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-48 h-4 bg-gray-200 border-[3px] border-black rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${(votedCount / totalCards) * 100}%` }}
            />
          </div>
          <span className="font-display text-lg font-bold">{votedCount}/{totalCards}</span>
        </div>
      </div>

      {/* SWIPE AREA — fills remaining height */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-[320px] sm:w-96 h-[65vh]">
          <AnimatePresence>
            {queue.slice(0, 3).map((film, index) => (
              <SwipeCard
                key={film.id}
                film={film}
                index={index}
                onVote={handleVote}
              />
            ))}
          </AnimatePresence>

          {queue.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white border-[4px] border-black shadow-[12px_12px_0_#00E5FF] text-center p-8 rounded-2xl"
            >
              <h2 className="font-display text-4xl md:text-5xl mb-4 text-pink-500 uppercase">Queue Complete!</h2>
              <p className="font-sans font-bold mb-6 text-gray-600">Transmitting results to Host...</p>
              <div className="flex gap-3 justify-center">
                <div className="w-4 h-4 bg-cyan-400 border-[2px] border-black rounded-full animate-bounce" />
                <div className="w-4 h-4 bg-yellow-400 border-[2px] border-black rounded-full animate-bounce delay-75" />
                <div className="w-4 h-4 bg-pink-500 border-[2px] border-black rounded-full animate-bounce delay-150" />
              </div>
              <p className="font-sans text-sm mt-6 text-gray-400">Waiting for all crew members...</p>
            </motion.div>
          )}
        </div>

        {/* Swipe hint labels */}
        {queue.length > 0 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-between px-8 pointer-events-none">
            <div className="bg-pink-500 text-white font-display text-xl px-4 py-2 border-[3px] border-black shadow-[4px_4px_0_black] -rotate-6">
              SKIP
            </div>
            <div className="bg-yellow-400 text-black font-display text-xl px-4 py-2 border-[3px] border-black shadow-[4px_4px_0_black] rotate-6">
              LOVE ↑
            </div>
            <div className="bg-green-400 text-black font-display text-xl px-4 py-2 border-[3px] border-black shadow-[4px_4px_0_black] rotate-6">
              YES →
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
