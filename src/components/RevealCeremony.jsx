import React, { useEffect, useState } from 'react';
import { useSession } from '../store/sessionStore';
import { rankFilms, fetchAllRationales } from '../utils/scoring';
import { films } from '../data/films';
import { fireWinnerConfetti } from '../utils/confetti';
import { motion } from 'framer-motion';

export const RevealCeremony = () => {
  const { state } = useSession();
  const [leaderboard, setLeaderboard] = useState([]);
  const [rationales, setRationales] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processResults = async () => {
      const ranked = rankFilms(state.participants);
      
      const fullLeaderboard = ranked.map(r => ({
        ...films.find(f => f.id === r.id),
        score: r.score
      }));

      setLeaderboard(fullLeaderboard);

      if (fullLeaderboard.length > 0) {
        fireWinnerConfetti();

        try {
          const aiText = await fetchAllRationales(
            state.participants, 
            fullLeaderboard[0].id, 
            import.meta.env.VITE_ANTHROPIC_API_KEY
          );
          setRationales(aiText);
        } catch (e) {
          console.error("AI Rationale failed:", e);
        }
      }
      setLoading(false);
    };

    processResults();
  }, [state.participants]);

  if (loading || leaderboard.length === 0) {
    return <div className="h-screen bg-black text-[#00E5FF] flex justify-center items-center font-display text-4xl uppercase animate-pulse">Running Alignment Protocol...</div>;
  }

  const winner = leaderboard[0];

  return (
    <div className="min-h-screen bg-black text-[#00E5FF] p-4 md:p-12 relative overflow-hidden">
      {/* Dark Halftone Background */}
      <div className="absolute inset-0 bg-halftone opacity-10 invert pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        
        {/* WINNER SECTION */}
        <motion.div 
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="relative w-full max-w-3xl bg-gray-900 border-[3px] border-[#00E5FF] shadow-[8px_8px_0px_0px_#FF2E93] rounded-sm p-8 mb-20 mt-12 flex flex-col items-center text-center"
        >
          <div className="absolute -top-5 left-8 bg-[#FF2E93] text-white px-4 py-1 font-display text-xl uppercase tracking-widest shadow-[4px_4px_0px_0px_#00E5FF]">
            SYSTEM OVERRIDE // CONSENSUS REACHED
          </div>
          
          <img src={winner.posterUrl} alt={winner.title} className="w-56 rounded-sm border-2 border-white shadow-[0_0_20px_rgba(0,229,255,0.5)] mb-8" />
          
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wider mb-4 text-white drop-shadow-[2px_2px_0_#FF2E93]">{winner.title}</h1>
          <div className="flex gap-4 font-sans font-bold uppercase mb-6 tracking-widest">
            <span className="bg-[#FFE600] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_white]">SCORE: {winner.score}</span>
            <span className="bg-[#00E5FF] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_white]">{winner.genre}</span>
          </div>
          <p className="font-sans font-medium text-lg max-w-xl text-gray-300 leading-relaxed">{winner.synopsis}</p>
        </motion.div>


        {/* AI RATIONALE MATRIX */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="col-span-full border-b-[2px] border-[#00E5FF] pb-2 mb-2 flex items-center justify-between">
            <h2 className="font-display text-3xl uppercase tracking-widest text-[#FF2E93]">&gt; NEURAL_ANALYSIS_MATRIX</h2>
            <span className="animate-pulse text-[#00E5FF] text-xl">_</span>
          </div>
          
          {state.participants.map((p, i) => {
            const vote = p.votes[winner.id];
            const sentimentColor = vote === 'love' ? 'text-[#FFE600]' : vote === 'yes' ? 'text-[#00E5FF]' : 'text-[#FF2E93]';
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                key={p.name} 
                className="bg-black border border-gray-800 shadow-[4px_4px_0px_0px_#00E5FF] p-6 rounded-sm flex flex-col relative group overflow-hidden"
              >
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />

                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2 relative z-10">
                  <h3 className="font-mono text-xl font-bold uppercase text-white">&gt; {p.name}</h3>
                  <span className={`${sentimentColor} font-mono font-bold uppercase tracking-wider`}>
                    [{vote || 'NULL'}]
                  </span>
                </div>
                <div className="font-mono text-sm text-[#00E5FF] leading-relaxed relative z-10 flex-1">
                  {rationales[p.name] ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      {rationales[p.name]}
                    </motion.p>
                  ) : (
                    <span className="animate-pulse">Decrypting subroutines...</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
