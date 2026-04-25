import React, { useEffect, useState, useRef } from 'react';
import { useSession } from '../store/sessionStore';
import { rankFilms, fetchAllRationales } from '../utils/scoring';
import { films } from '../data/films';
import { fireWinnerConfetti } from '../utils/confetti';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const RevealCeremony = () => {
  const { state } = useSession();
  const [leaderboard, setLeaderboard] = useState([]);
  const [rationales, setRationales] = useState({});
  const [loading, setLoading] = useState(true);
  const container = useRef();

  useEffect(() => {
    const processResults = async () => {
      // In true multiplayer, participants might have varying lengths of votes.
      // But we just pass state.participants to rankFilms.
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

    // Heavy slam entrance for the winner card
    gsap.from(".winner-slam", {
      scale: 0.5,
      opacity: 0,
      y: 200,
      rotation: -5,
      duration: 1.5,
      ease: "back.out(1.5)",
      delay: 0.2
    });

    // Staggered slam for AI rationales
    gsap.from(".rationale-card", {
      scale: 0,
      opacity: 0,
      rotation: () => Math.random() * 20 - 10,
      stagger: 0.2,
      duration: 1.2,
      ease: "back.out(1.8)",
      delay: 1
    });

    // Marquee animations
    gsap.to(".marquee-inner", {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1
    });

    // Spinners
    gsap.to(".spin-fast", {
      rotate: 360,
      duration: 5,
      repeat: -1,
      ease: "none"
    });

  }, { scope: container, dependencies: [loading] });

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
      
      {/* =========================================
          DIAGONAL MARQUEE RIBBONS
          ========================================= */}
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
        
        {/* =========================================
            WINNER REVEAL
            ========================================= */}
        <div className="winner-slam relative w-full max-w-4xl bg-white border-[4px] border-black shadow-[16px_16px_0px_0px_#FF2E93] rounded-sm p-6 md:p-12 mb-24 mt-8 flex flex-col items-center text-center rotate-1">
          
          {/* Decorative Stickers */}
          <div className="absolute -top-6 -left-6 bg-[#FFE600] text-black border-[3px] border-black shadow-[4px_4px_0_black] px-6 py-2 font-display text-2xl uppercase tracking-widest -rotate-6">
            TOP MATCH
          </div>
          <div className="spin-fast absolute -top-8 -right-8 w-20 h-20 bg-[#00E5FF] border-[3px] border-black rounded-full shadow-[4px_4px_0_black] flex items-center justify-center font-display text-4xl">
            *
          </div>
          
          <img src={winner.posterUrl} alt={winner.title} className="w-64 md:w-80 border-[4px] border-black shadow-[8px_8px_0_#FFE600] mb-8 -rotate-2" />
          
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter mb-6 text-black drop-shadow-[4px_4px_0_white]">
            {winner.title}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 font-sans font-bold uppercase mb-8 tracking-widest text-lg">
            <span className="bg-black text-white px-4 py-2 border-[3px] border-black shadow-[4px_4px_0_#00E5FF]">SCORE: {winner.score}</span>
            <span className="bg-pink-500 text-black px-4 py-2 border-[3px] border-black shadow-[4px_4px_0_white]">{winner.genre}</span>
          </div>
          
          <p className="font-sans font-medium text-xl max-w-2xl bg-gray-100 p-6 border-[3px] border-black shadow-brutal rotate-1">
            {winner.synopsis}
          </p>
        </div>


        {/* =========================================
            AI RATIONALE STICKY NOTES
            ========================================= */}
        <div className="w-full relative">
          <div className="inline-block bg-black text-white px-8 py-3 font-display text-4xl md:text-5xl border-[4px] border-black shadow-[8px_8px_0_#FFE600] mb-12 -rotate-1">
            AI ANALYSIS
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {state.participants.map((p, i) => {
              const vote = p.votes[winner.id];
              const isLove = vote === 'love';
              const isYes = vote === 'yes';
              
              // Rotate between Chainzoku colors for the sticky notes
              const bgColors = ['bg-yellow-400', 'bg-cyan-400', 'bg-pink-500'];
              const cardBg = bgColors[i % bgColors.length];
              
              // Alternate rotation angles
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

      </div>
    </div>
  );
};
