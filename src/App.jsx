import React, { useEffect } from 'react';
import { LandingHero } from './components/LandingHero';
import { SessionSetup } from './components/SessionSetup';
import { SessionProvider, useSession } from './store/sessionStore';
import { VotingPhase } from './components/VotingPhase';
import { Countdown } from './components/Countdown';
import { RevealCeremony } from './components/RevealCeremony';

function AppContent() {
  const { state, dispatch } = useSession();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [state.phase]);

  return (
    <div className="bg-[#F4F4F0] text-black min-h-screen">
      {state.phase === 'hero' && (
        <LandingHero onStart={() => dispatch({ type: 'SET_PHASE', payload: 'setup' })} />
      )}

      {state.phase === 'setup' && (
        <SessionSetup />
      )}

      {state.phase === 'voting' && (
        <VotingPhase />
      )}

      {state.phase === 'countdown' && (
        <Countdown />
      )}

      {state.phase === 'reveal' && (
        <RevealCeremony />
      )}
    </div>
  );
}
function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}

export default App;
