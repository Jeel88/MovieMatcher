import React, { useEffect, useState, useRef } from 'react';
import { useSession } from '../store/sessionStore';
import { rankFilms, fetchAllRationales } from '../utils/scoring';
import { films } from '../data/films';
import { fireWinnerConfetti } from '../utils/confetti';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { broadcastPhaseChange } from '../utils/supabase';

export const RevealCeremony = () => {
  const { state, dispatch } = useSession();
  const [leaderboard, setLeaderboard] = useState([]);
  const [rationales, setRationales] = useState({});
  const [loading, setLoading] = useState(true);
  const container = useRef();

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

  useGSAP(() => {
    if (loading) return;

    gsap.from(".winner-slam", {
      scale: 0.5,
      opacity: 0,
      y: 200,
      rotation: -5,
      duration: 1.5,
      ease: "back.out(1.5)",
      delay: 0.2
    });

    gsap.from(".rationale-card", {
      scale: 0,
      opacity: 0,
      rotation: () => Math.random() * 20 - 10,
      stagger: 0.2,
      duration: 1.2,
      ease: "back.out(1.8)",
      delay: 1
    });

    gsap.to(".marquee-inner", {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1
    });

    gsap.to(".spin-fast", {
      rotate: 360,
      duration: 5,
      repeat: -1,
      ease: "none"
    });

  }, { scope: container, dependencies: [loading] });

  const handleRematch = async () => {
    const winner = leaderboard[0];
    if (import.meta.env.VITE_SUPABASE_URL && state.roomId) {
      await broadcastPhaseChange(state.roomId, 'voting_rematch', { bannedFilmId: winner.id });
    } else {
      dispatch({ type: 'REMATCH', payload: winner.id });
    }
  };

  if (loading || leaderboard.length === 0) {
    return (
      <div className="h-screen bg-[#F4F4F0] bg-halftone flex flex-col justify-center items-center">
        <h1 className="font-display text-5xl md:text-8xl uppercase tracking-tighter text-black drop-shadow-[8px_8px_0_#FFE600] animate-pulse">
          CALCULATING...
        </h1>
        <div className="mt-8 flex gap-4">
          <div className="w-8 h-8 bg-black border-brutal" />
          <div className="w-8 h-8 bg-pink-500 border-brutal" />
          <div className="w-8 h-8 bg-cyan-400 border-brutal" />
        </div>
      </div>
    );
  }

  const winner = leaderboard[0];

  return (
    <div ref={container} className="min-h-screen bg-[#F4F4F0] text-black overflow-hidden bg-halftone font-sans relative pb-32">
      
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[150vw] rotate-6 border-y-4 border-black bg-cyan-400 text-black py-4 z-0 overflow-hidden pointer-events-none">
        <div className="marquee-inner whitespace-nowrap inline-block font-display text-6xl md:text-8xl uppercase tracking-widest opacity-20">
          MATCH FOUND // PERFECT CONSENSUS // MATCH FOUND // PERFECT CONSENSUS // MATCH FOUND // PERFECT CONSENSUS // 
        </div>
      </div>
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-[150vw] -rotate-3 border-y-4 border-black bg-pink-500 text-white py-4 z-0 overflow-hidden pointer-events-none">
        <div className="marquee-inner whitespace-nowrap inline-block font-display text-4xl md:text-6xl uppercase tracking-widest" style={{ animationDirection: 'reverse' }}>
          ALGORITHM EXECUTED // PREPARE TO WATCH // ALGORITHM EXECUTED // PREPARE TO WATCH // 
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10 px-4 pt-12">
        
        {/* TOP 3 PODIUM */}
        <div className="w-full flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-20 mt-12">
          
          {/* 2nd Place */}
          {leaderboard[1] && (
            <div className="w-full md:w-1/3 bg-[#F4F4F0] border-[4px] border-black shadow-[8px_8px_0_black] p-4 flex flex-col items-center rotate-1 order-2 md:order-1">
              <div className="bg-gray-300 text-black px-4 py-1 font-display text-2xl mb-4 border-[3px] border-black">2ND PLACE</div>
              <img src={leaderboard[1].posterUrl} alt={leaderboard[1].title} className="w-32 md:w-40 border-[4px] border-black mb-4" />
              <h3 className="font-heading font-black text-2xl md:text-3xl uppercase text-center leading-tight mb-2">{leaderboard[1].title}</h3>
              <div className="font-sans font-bold bg-black text-white px-3 py-1 shadow-brutal text-lg">-{leaderboard[0].score - leaderboard[1].score} PTS</div>
            </div>
          )}

          {/* 1st Place (Winner) */}
          <div className="w-full md:w-1/3 winner-slam bg-white border-[4px] border-black shadow-[16px_16px_0px_0px_#FF2E93] p-6 md:p-8 flex flex-col items-center text-center -rotate-1 z-10 order-1 md:order-2">
            <div className="absolute -top-6 -left-6 bg-[#FFE600] text-black border-[3px] border-black shadow-[4px_4px_0_black] px-6 py-2 font-display text-2xl uppercase tracking-widest -rotate-6">
              TOP MATCH
            </div>
            <div className="spin-fast absolute -top-8 -right-8 w-16 h-16 bg-[#00E5FF] border-[3px] border-black rounded-full shadow-[4px_4px_0_black] flex items-center justify-center font-display text-4xl">
              *
            </div>
            <img src={winner.posterUrl} alt={winner.title} className="w-48 md:w-64 border-[4px] border-black shadow-[8px_8px_0_#FFE600] mb-6" />
            <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter mb-4 text-black">{winner.title}</h1>
            <span className="bg-black text-white px-6 py-2 border-[3px] border-black shadow-[4px_4px_0_#00E5FF] font-bold text-xl">SCORE: {winner.score}</span>
            <p className="font-sans font-medium text-lg mt-6 bg-gray-100 p-4 border-[3px] border-black">
              {winner.synopsis}
            </p>
          </div>

          {/* 3rd Place */}
          {leaderboard[2] && (
            <div className="w-full md:w-1/3 bg-[#F4F4F0] border-[4px] border-black shadow-[8px_8px_0_black] p-4 flex flex-col items-center -rotate-2 order-3 md:order-3">
              <div className="bg-orange-400 text-white px-4 py-1 font-display text-2xl mb-4 border-[3px] border-black">3RD PLACE</div>
              <img src={leaderboard[2].posterUrl} alt={leaderboard[2].title} className="w-32 md:w-40 border-[4px] border-black mb-4" />
              <h3 className="font-heading font-black text-2xl md:text-3xl uppercase text-center leading-tight mb-2">{leaderboard[2].title}</h3>
              <div className="font-sans font-bold bg-black text-white px-3 py-1 shadow-brutal text-lg">-{leaderboard[0].score - leaderboard[2].score} PTS</div>
            </div>
          )}
        </div>


        {/* SENTIMENT GRID MATRIX */}
        <div className="w-full mb-20 bg-white border-[4px] border-black shadow-[12px_12px_0_#00E5FF] p-4 md:p-8 overflow-x-auto">
          <h2 className="font-display text-3xl md:text-5xl uppercase mb-6 text-black border-b-[4px] border-black pb-4">Sentiment Grid Matrix</h2>
          <table className="w-full text-left font-sans border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-4 border-[4px] border-black bg-gray-200 font-black uppercase text-xl text-center">Film</th>
                <th className="p-4 border-[4px] border-black bg-black text-white font-black uppercase text-xl text-center">Score</th>
                {state.participants.map(p => (
                  <th key={p.name} className="p-4 border-[4px] border-black bg-yellow-400 font-black uppercase text-xl text-center">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 3).map((film, index) => (
                <tr key={film.id}>
                  <td className="p-4 border-[4px] border-black font-bold text-lg bg-gray-100">{index + 1}. {film.title}</td>
                  <td className="p-4 border-[4px] border-black font-black text-2xl text-center bg-white">{film.score}</td>
                  {state.participants.map(p => {
                    const vote = p.votes[film.id];
                    let bgColor = 'bg-white';
                    let text = 'SKIP';
                    if (vote === 'love') { bgColor = 'bg-pink-500 text-white'; text = 'LOVE (+3)'; }
                    if (vote === 'yes') { bgColor = 'bg-cyan-400 text-black'; text = 'YES (+1)'; }
                    return (
                      <td key={p.name} className={`p-4 border-[4px] border-black font-bold uppercase text-center ${bgColor}`}>
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* AI RATIONALE STICKY NOTES */}
        <div className="w-full relative mb-20">
          <div className="inline-block bg-black text-white px-8 py-3 font-display text-4xl md:text-5xl border-[4px] border-black shadow-[8px_8px_0_#FFE600] mb-12 -rotate-1">
            AI ANALYSIS
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {state.participants.map((p, i) => {
              const vote = p.votes[winner.id];
              const bgColors = ['bg-yellow-400', 'bg-cyan-400', 'bg-pink-500'];
              const cardBg = bgColors[i % bgColors.length];
              const angles = ['rotate-2', '-rotate-3', 'rotate-1'];
              const rot = angles[i % angles.length];

              return (
                <div 
                  key={p.name} 
                  className={`rationale-card ${cardBg} ${rot} border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col relative bg-halftone`}
                >
                  <div className="flex justify-between items-start mb-6 border-b-[4px] border-black pb-4">
                    <h3 className="font-display text-3xl uppercase text-black">{p.name}</h3>
                    <div className="bg-white border-[3px] border-black px-3 py-1 shadow-brutal">
                      <span className="font-heading font-black text-xl uppercase">{vote || 'SKIP'}</span>
                    </div>
                  </div>
                  
                  <div className="font-sans font-bold text-xl md:text-2xl text-black leading-snug flex-1">
                    {rationales[p.name] ? (
                      <p>{rationales[p.name]}</p>
                    ) : (
                      <span className="animate-pulse bg-white text-black px-2 py-1 border-[2px] border-black">GENERATING ROAST...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REMATCH BUTTON */}
        {state.participants.length > 0 && state.participants[0].name === state.localParticipantName && (
          <div className="w-full flex justify-center mb-12">
            <button 
              onClick={handleRematch}
              className="bg-black text-[#00E5FF] px-8 py-6 md:px-12 md:py-8 font-display text-3xl md:text-5xl uppercase tracking-widest border-[4px] border-black shadow-[12px_12px_0_#FF2E93] hover:translate-y-2 hover:shadow-[4px_4px_0_#FF2E93] transition-all"
            >
              REMATCH (BAN WINNER)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
