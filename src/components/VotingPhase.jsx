import React, { useEffect, useState } from 'react';
import { useSession } from '../store/sessionStore';
import { SwipeCard } from './SwipeCard';
import { films, shuffleFilms } from '../data/films';
import { AnimatePresence, motion } from 'framer-motion';
import { broadcastVotes } from '../utils/supabase';

export const VotingPhase = () => {
  const { state, dispatch } = useSession();
  const participant = state.participants.find(p => p.name === state.localParticipantName) || state.participants[0];
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize the shuffled queue for the current participant
  useEffect(() => {
    if (!participant || hasInitialized) return;
    
    if (!participant.queue || participant.queue.length === 0) {
      // Use AI catalogue if generated, otherwise fall back to hardcoded films
      const source = (state.aiCatalogue && state.aiCatalogue.length > 0) ? state.aiCatalogue : films;

      // Filter by banned films and selected genres
      let pool = source;
      if (state.bannedFilms && state.bannedFilms.length > 0) {
        pool = pool.filter(f => !state.bannedFilms.includes(f.id));
      }
      if (state.selectedGenres && state.selectedGenres.length > 0) {
        pool = pool.filter(f => state.selectedGenres.some(g => f.genre.includes(g)));
      }

      // Fallback if filter is too strict
      if (pool.length === 0) pool = films;

      const newQueue = shuffleFilms(pool).slice(0, 10);
      dispatch({ type: 'SET_PARTICIPANT_QUEUE', payload: { name: participant.name, queue: newQueue } });
      setQueue(newQueue);
      setHasInitialized(true);
    } else {
      // Restore remaining queue if page reloaded
      const remaining = participant.queue.filter(f => !participant.votes[f.id]);
      setQueue(remaining);
      setHasInitialized(true);
    }
  }, [participant, dispatch, hasInitialized, state.bannedFilms, state.selectedGenres]);

  const handleVote = async (sentiment, filmId) => {
    const film = queue.find(f => f.id === filmId);
    
    // 1. Record vote in global state locally
    dispatch({ type: 'CAST_VOTE', payload: { name: participant.name, filmId, sentiment } });
    
    // 2. Add to local history sidebar
    setHistory(prev => [{ film, sentiment }, ...prev]);
    
    // 3. Remove from local queue
    const remainingQueue = queue.filter(f => f.id !== filmId);
    setQueue(remainingQueue);

    // 4. Check if queue is empty -> Broadcast votes and Wait
    if (remainingQueue.length === 0) {
      const updatedVotes = { ...participant.votes, [filmId]: sentiment };
      
      // Mark local participant as finished
      dispatch({ type: 'MARK_FINISHED', payload: participant.name });
      
      if (import.meta.env.VITE_SUPABASE_URL && state.roomId) {
        broadcastVotes(state.roomId, participant.name, updatedVotes, true);
      } else {
        // If local mode, we let App.jsx auto-trigger the reveal.
      }
    }
  };

  if (!participant) return null;

  return (
    <div className="h-screen md:overflow-hidden overflow-hidden bg-[#F4F4F0] text-black flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-8 bg-halftone">
      
      {/* LEFT SIDEBAR -> TOP HEADER ON MOBILE */}
      <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-4 md:gap-6 shrink-0 z-10">
        {/* Active User Card */}
        <div className="bg-white border-brutal shadow-brutal p-3 md:p-6 rounded-xl md:rounded-2xl flex-1 flex md:block items-center justify-between">
          <div className="hidden md:inline-block bg-pink-500 text-white font-display text-xl px-3 py-1 mb-4 border-brutal -rotate-2">
            ACTIVE USER
          </div>
          <div>
            <h2 className="font-heading text-xl md:text-4xl font-bold uppercase truncate leading-none">{participant.name}</h2>
            <p className="font-sans font-medium text-gray-500 mt-1 md:mt-2 text-xs md:text-base hidden md:block">Participant {state.currentParticipantIndex + 1} of {state.participants.length}</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-yellow-400 border-brutal shadow-brutal p-3 md:p-6 rounded-xl md:rounded-2xl flex-1 flex md:block flex-col justify-center">
          <h3 className="hidden md:block font-display text-2xl uppercase mb-4">Session Stats</h3>
          <div className="space-y-2 md:space-y-4 font-sans font-medium">
            <div className="flex justify-between items-center md:border-b-2 md:border-black md:pb-2">
              <span className="text-sm md:text-base">Remaining:</span>
              <span className="font-bold text-lg md:text-xl bg-white md:bg-transparent px-2 border-brutal md:border-none md:px-0 shadow-brutal md:shadow-none -rotate-2 md:rotate-0">{queue.length}</span>
            </div>
            <div className="hidden md:flex justify-between border-b-2 border-black pb-2">
              <span>Total Votes:</span>
              <span className="font-bold text-xl">{history.length}</span>
            </div>
            <div className="hidden md:flex justify-between border-b-2 border-black pb-2">
              <span>Room Code:</span>
              <span className="font-display text-xl">{state.roomCode || 'LOCAL'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER: Swipe Card Stack */}
      <div className="w-full md:w-2/4 flex-1 flex flex-col items-center justify-center relative perspective-[1000px] z-0">
        <div className="relative w-full max-w-[320px] sm:w-96 h-[65vh] md:h-[32rem]">
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
              className="absolute inset-0 flex flex-col items-center justify-center bg-white border-brutal shadow-brutal rounded-2xl text-center p-8"
            >
              <h2 className="font-display text-3xl md:text-4xl mb-4 text-pink-500">QUEUE COMPLETE</h2>
              <p className="font-sans font-medium mb-4">Transmitting votes to Host...</p>
              <div className="flex gap-2 justify-center">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-75" />
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-150" />
              </div>
              <p className="font-sans font-medium mt-4 text-gray-500">Waiting for other crew members to finish.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: History Queue (Hidden on Mobile to save space) */}
      <div className="hidden md:flex w-full md:w-1/4 flex-col gap-4">
        <div className="bg-black text-white border-brutal shadow-brutal p-4 rounded-2xl">
          <h3 className="font-display text-2xl uppercase text-center">Vote History</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div
                key={item.film.id + i}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-brutal shadow-[4px_4px_0px_0px_#111] p-4 rounded-xl flex items-center gap-4"
              >
                <img src={item.film.posterUrl} alt={item.film.title} className="w-12 h-16 object-cover border-2 border-black rounded" />
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-heading font-bold truncate">{item.film.title}</h4>
                  <span className={`inline-block mt-1 font-display px-2 py-0.5 text-sm uppercase border-2 border-black ${
                    item.sentiment === 'love' ? 'bg-yellow-400' : 
                    item.sentiment === 'yes' ? 'bg-green-400' : 'bg-pink-500 text-white'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {history.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-500 font-sans italic">
              No votes cast yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
