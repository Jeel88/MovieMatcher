import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const LandingHero = ({ onStart }) => {
  const container = useRef();
  const horizontalRef = useRef();

  useGSAP(() => {
    // Heavy slam entrance for the floating stickers
    gsap.from(".float-slam", {
      scale: 0,
      opacity: 0,
      rotation: (i) => Math.random() * 90 - 45,
      stagger: 0.1,
      duration: 1.2,
      ease: "back.out(1.8)",
      delay: 0.2
    });

    // Massive typography wipe up
    gsap.from(".title-word", {
      y: 200,
      opacity: 0,
      rotate: 5,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
    });

    // Infinite Spinners
    gsap.to(".spin-slow", {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    gsap.to(".spin-fast-reverse", {
      rotate: -360,
      duration: 10,
      repeat: -1,
      ease: "none"
    });

    // Infinite Marquee
    gsap.to(".marquee-inner", {
      xPercent: -50,
      ease: "none",
      duration: 10,
      repeat: -1
    });

    // Scroll Parallax on floating elements
    gsap.to(".parallax-fast", {
      yPercent: -150,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".parallax-slow", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // HORIZONTAL SCROLL ANIMATION
    let panels = gsap.utils.toArray(".horizontal-panel");
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        // Make the scroll distance equal to the total width of the panels
        end: () => "+=" + document.querySelector(".horizontal-wrapper").offsetWidth
      }
    });

  }, { scope: container });

  return (
    <div ref={container} className="bg-[#F4F4F0] text-black overflow-x-hidden bg-halftone font-sans">
      
      {/* =========================================
          HERO SECTION (Screen 1)
          ========================================= */}
      <section className="hero-section h-[100vh] w-full relative overflow-hidden flex flex-col items-center justify-center px-4 md:px-12 pt-20">
        
        {/* Floating Stickers */}
        <div className="float-slam parallax-fast spin-slow absolute top-10 left-10 md:top-20 md:left-20 w-32 h-32 md:w-48 md:h-48 bg-yellow-400 border-brutal rounded-full shadow-brutal flex items-center justify-center z-10">
          <span className="font-display text-4xl md:text-6xl text-black">*</span>
        </div>
        <div className="float-slam parallax-slow absolute top-32 right-5 md:top-40 md:right-32 bg-pink-500 text-white px-6 py-2 border-brutal shadow-brutal -rotate-12 z-20">
          <span className="font-heading font-bold text-xl md:text-2xl uppercase tracking-widest">v1.0.0</span>
        </div>
        <div className="float-slam parallax-fast spin-fast-reverse absolute bottom-40 left-5 md:bottom-32 md:left-32 w-24 h-24 md:w-32 md:h-32 bg-cyan-400 border-[4px] border-dashed border-black rounded-full shadow-brutal flex items-center justify-center z-10">
          <span className="font-heading font-black text-xs md:text-sm uppercase text-center leading-none">Match<br/>Engine</span>
        </div>
        <div className="float-slam parallax-slow absolute bottom-32 right-10 md:bottom-40 md:right-20 bg-white border-brutal shadow-brutal px-8 py-4 rotate-6 z-10">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-black rounded-full animate-bounce" />
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce delay-75" />
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce delay-150" />
          </div>
        </div>

        {/* Massive Title */}
        <div className="text-center w-full max-w-[1400px] mx-auto flex flex-col items-center relative z-50 pb-32">
          <div className="overflow-hidden inline-block pb-2 md:pb-6">
            <h1 className="title-word font-display text-[22vw] md:text-[18vw] leading-[0.8] tracking-tighter uppercase text-black drop-shadow-[8px_8px_0_#FF2E93]">
              PROJECT
            </h1>
          </div>
          <div className="overflow-hidden inline-block">
            <h1 className="title-word font-display text-[22vw] md:text-[18vw] leading-[0.8] tracking-tighter uppercase text-outline drop-shadow-[8px_8px_0_#00E5FF]">
              QUORUM
            </h1>
          </div>
          <div className="hero-sub mt-8 md:mt-12 flex justify-center w-full z-40">
            <button 
              onClick={onStart}
              className="group relative px-10 py-4 bg-black text-white font-display text-3xl md:text-4xl uppercase tracking-wider border-[4px] border-black shadow-[6px_6px_0_0_#00E5FF] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:translate-y-2 active:translate-x-2 transition-all -rotate-1"
            >
              <span className="relative z-10">Quick Start</span>
              <div className="absolute inset-0 bg-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0" />
            </button>
          </div>
        </div>

        {/* Diagonal Marquee Ribbons */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[150vw] -rotate-3 border-y-4 border-black bg-pink-500 text-white py-4 z-40 overflow-hidden pointer-events-none">
          <div className="marquee-inner whitespace-nowrap inline-block font-display text-4xl uppercase tracking-widest">
            SYSTEM ONLINE • NO SPOILERS • WEIGHTED ALGORITHM • MULTIPLAYER SYNC • TRUE CONSENSUS • SYSTEM ONLINE • NO SPOILERS • WEIGHTED ALGORITHM • MULTIPLAYER SYNC • TRUE CONSENSUS • SYSTEM ONLINE • NO SPOILERS • WEIGHTED ALGORITHM • MULTIPLAYER SYNC • TRUE CONSENSUS •
          </div>
        </div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[150vw] rotate-2 border-y-4 border-black bg-cyan-400 text-black py-3 z-30 overflow-hidden pointer-events-none opacity-80">
          <div className="marquee-inner whitespace-nowrap inline-block font-heading font-bold text-2xl uppercase tracking-widest" style={{ animationDirection: 'reverse' }}>
            /// CONNECT YOUR CREW /// BLIND SWIPING /// REVEAL CEREMONY /// AI RATIONALE /// CONNECT YOUR CREW /// BLIND SWIPING /// REVEAL CEREMONY /// AI RATIONALE /// CONNECT YOUR CREW /// BLIND SWIPING /// REVEAL CEREMONY /// AI RATIONALE ///
          </div>
        </div>

      </section>

      {/* =========================================
          HORIZONTAL SCROLL EXPLANATION (Screen 2)
          ========================================= */}
      <section ref={horizontalRef} className="h-screen w-full overflow-hidden border-t-8 border-black bg-black">
        <div className="horizontal-wrapper flex h-full w-[300vw]">
          
          {/* Panel 1 */}
          <div className="horizontal-panel w-screen h-full flex flex-col justify-center px-8 md:px-32 bg-yellow-400 bg-halftone">
            <div className="max-w-4xl">
              <div className="inline-block bg-black text-white px-4 py-2 font-display text-3xl md:text-5xl border-brutal border-black shadow-[6px_6px_0_#FF2E93] mb-8 -rotate-2">
                01 // SYNC
              </div>
              <h2 className="font-heading text-5xl md:text-[6rem] font-black uppercase leading-[0.9] tracking-tight mb-8 drop-shadow-[4px_4px_0_white]">
                Connect<br/>Your Crew
              </h2>
              <p className="font-sans text-xl md:text-3xl font-medium max-w-2xl bg-white p-6 border-brutal shadow-brutal rotate-1">
                Generate a secure session token. Lock your friends into the consensus grid. No more arguing over what to watch—the system takes control.
              </p>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="horizontal-panel w-screen h-full flex flex-col justify-center px-8 md:px-32 bg-pink-500 text-white bg-halftone">
            <div className="max-w-4xl">
              <div className="inline-block bg-white text-black px-4 py-2 font-display text-3xl md:text-5xl border-brutal border-white shadow-[6px_6px_0_#00E5FF] mb-8 rotate-3">
                02 // CALIBRATE
              </div>
              <h2 className="font-heading text-5xl md:text-[6rem] font-black uppercase leading-[0.9] tracking-tight mb-8 drop-shadow-[4px_4px_0_black]">
                Blind<br/>Swiping
              </h2>
              <p className="font-sans text-xl md:text-3xl font-medium max-w-2xl bg-black text-white p-6 border-brutal border-white shadow-[6px_6px_0_white] -rotate-1">
                Isolate variables. Swipe right for YES, left for NO. Your votes are completely encrypted and anonymous until the reveal ceremony.
              </p>
            </div>
          </div>

          {/* Panel 3 */}
          <div className="horizontal-panel w-screen h-full flex flex-col justify-center px-8 md:px-32 bg-cyan-400 bg-halftone">
            <div className="max-w-4xl">
              <div className="inline-block bg-black text-cyan-400 px-4 py-2 font-display text-3xl md:text-5xl border-brutal border-black shadow-[6px_6px_0_#FFE600] mb-8 -rotate-2">
                03 // EXECUTE
              </div>
              <h2 className="font-heading text-5xl md:text-[6rem] font-black uppercase leading-[0.9] tracking-tight mb-8 drop-shadow-[4px_4px_0_white]">
                Enter<br/>The Grid
              </h2>
              <p className="font-sans text-xl md:text-3xl font-medium max-w-2xl bg-white text-black p-6 border-brutal shadow-brutal rotate-1 mb-12">
                The algorithm processes the queue and calculates the perfect match. Once ready, proceed to the terminal to begin the selection protocol.
              </p>

              {/* ACTION BUTTON MOVED HERE */}
              <button 
                onClick={onStart}
                className="group relative px-12 py-8 bg-black text-white font-display text-4xl md:text-6xl uppercase tracking-wider border-[4px] border-black shadow-[8px_8px_0_0_#FF2E93] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#FF2E93] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
              >
                <span className="relative z-10">INITIALIZE GRID</span>
                <div className="absolute inset-0 bg-yellow-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0" />
                <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
                   {/* Changes text color on hover via sibling z-index trick. We'll just rely on the bg scale */}
                </div>
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

