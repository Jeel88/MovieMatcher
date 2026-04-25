import React, { useEffect } from 'react';
import { LandingHero } from './components/LandingHero';
import { SessionSetup } from './components/SessionSetup';
import { SessionProvider, useSession } from './store/sessionStore';
import { VotingPhase } from './components/VotingPhase';
import { Countdown } from './components/Countdown';
import { RevealCeremony } from './components/RevealCeremony';
import { subscribeToRoom, broadcastPhaseChange, broadcastAICatalogue } from './utils/supabase';

function AppContent() {
  const { state, dispatch } = useSession();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [state.phase]);

  // Global Realtime Subscription
  useEffect(() => {
    if (state.roomId && import.meta.env.VITE_SUPABASE_URL) {
      const channel = subscribeToRoom(
        state.roomId,
        (newParticipantName) => {
          dispatch({ type: 'ADD_PARTICIPANT', payload: newParticipantName });
        },
        (payload) => {
          const newPhase = payload.phase;
          if (newPhase === 'ai_catalogue') {
            // Host broadcast the AI-generated movie list — store it for voting
            dispatch({ type: 'SET_AI_CATALOGUE', payload: payload.catalogue || [] });
          } else if (newPhase === 'voting') {
            dispatch({ type: 'SET_GENRES', payload: payload.genres || [] });
            dispatch({ type: 'START_SESSION' });
          } else if (newPhase === 'voting_rematch') {
            dispatch({ type: 'REMATCH', payload: payload.bannedFilmId });
          } else if (newPhase === 'reveal') {
            dispatch({ type: 'SET_PHASE', payload: 'reveal' });
          }
        },
        (name, votes, isFinished) => {
          dispatch({ type: 'RECEIVE_VOTES', payload: { name, votes, isFinished } });
        }
      );
    }
  }, [state.roomId, dispatch]);

  // Host Logic: Check if all participants finished voting
  useEffect(() => {
    if (state.phase === 'voting' && state.participants.length > 0) {
      const isHost = state.participants[0].name === state.localParticipantName;
      if (isHost || !import.meta.env.VITE_SUPABASE_URL) {
        // Everyone is finished when their isFinished flag is true!
        const allFinished = state.participants.every(p => p.isFinished);
        
        if (allFinished) {
          if (import.meta.env.VITE_SUPABASE_URL && state.roomId) {
            broadcastPhaseChange(state.roomId, 'reveal');
            dispatch({ type: 'SET_PHASE', payload: 'reveal' });
          } else {
            // Local fallback
            dispatch({ type: 'SET_PHASE', payload: 'reveal' });
          }
        }
      }
    }
  }, [state.participants, state.phase, state.localParticipantName, state.roomId, dispatch]);

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
