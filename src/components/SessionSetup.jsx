import React, { useState, useEffect } from 'react';
import { useSession } from '../store/sessionStore';
import { createRoom, joinRoom, subscribeToRoom, broadcastPhaseChange } from '../utils/supabase';

const ALL_GENRES = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Family', 'Sci-Fi', 'Thriller'];

export const SessionSetup = () => {
  const { state, dispatch } = useSession();
  const [mode, setMode] = useState('create');
  const [hostName, setHostName] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) return;
    setLoading(true);
    setError('');

    try {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase();
      
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const room = await createRoom(code);
        if (!room) throw new Error("Supabase client failed to initialize.");
        dispatch({ type: 'SET_ROOM', payload: { roomId: room.id, roomCode: code } });
        // The host must add themselves to the room_participants, so we call joinRoom too
        await joinRoom(code, hostName);
      } else {
        dispatch({ type: 'SET_ROOM', payload: { roomId: 'mock-id', roomCode: code } });
      }

      setIsHost(true);
      dispatch({ type: 'ADD_PARTICIPANT', payload: hostName });
      dispatch({ type: 'SET_LOCAL_USER', payload: hostName });
    } catch (err) {
      setError('Failed to create room. Check Supabase connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinName.trim() || !joinCode.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { roomId, existingParticipants } = await joinRoom(joinCode.toUpperCase(), joinName);
        dispatch({ type: 'SET_ROOM', payload: { roomId, roomCode: joinCode.toUpperCase() } });
        
        if (existingParticipants) {
          existingParticipants.forEach(name => {
            dispatch({ type: 'ADD_PARTICIPANT', payload: name });
          });
        }
      } else {
        dispatch({ type: 'SET_ROOM', payload: { roomId: 'mock-id', roomCode: joinCode.toUpperCase() } });
      }

      setIsHost(false);
      dispatch({ type: 'ADD_PARTICIPANT', payload: joinName });
      dispatch({ type: 'SET_LOCAL_USER', payload: joinName });
    } catch (err) {
      setError('Failed to join room. Check code.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchGrid = async () => {
    if (import.meta.env.VITE_SUPABASE_URL && state.roomId) {
      await broadcastPhaseChange(state.roomId, 'voting', { genres: selectedGenres });
    } else {
      dispatch({ type: 'SET_GENRES', payload: selectedGenres });
    }
    dispatch({ type: 'START_SESSION' });
  };

  // --- LOBBY VIEW ---
  if (state.roomId) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] text-black flex items-center justify-center p-6 bg-halftone">
        <div className="w-full max-w-2xl bg-white border-brutal shadow-brutal-lg rounded-3xl p-10 text-center relative z-10">
          <div className="inline-block bg-yellow-400 px-6 py-2 border-brutal font-display text-3xl mb-8 shadow-brutal -rotate-2">
            ROOM: {state.roomCode}
          </div>
          
          <h2 className="font-heading text-4xl font-bold uppercase mb-8">Connected Crew</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {state.participants.map((p, i) => (
              <div key={i} className="bg-cyan-400 text-black px-6 py-3 border-brutal font-sans font-bold text-xl uppercase shadow-[4px_4px_0px_0px_black] transform hover:-translate-y-1 transition-transform">
                {p.name}
              </div>
            ))}
            {loading && <div className="px-6 py-3 font-sans font-bold text-xl text-gray-500 animate-pulse">Syncing...</div>}
          </div>

          {isHost && (
            <div className="mb-12 text-left bg-white border-[4px] border-black p-6 shadow-brutal rotate-1">
              <h3 className="font-display text-2xl uppercase mb-4 text-pink-500">Grid Parameters (Genres)</h3>
              <p className="font-sans text-sm mb-4 font-medium">Select genres to filter the swipe queue. Leave empty for random mix.</p>
              <div className="flex flex-wrap gap-2">
                {ALL_GENRES.map(genre => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 md:px-4 md:py-2 border-[3px] border-black font-sans font-bold uppercase transition-transform hover:-translate-y-1 ${
                        isSelected ? 'bg-cyan-400 text-black shadow-[4px_4px_0_black]' : 'bg-[#F4F4F0] text-gray-400 hover:text-black hover:bg-gray-200'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isHost ? (
            <button 
              onClick={handleLaunchGrid}
              className="w-full py-5 bg-pink-500 hover:bg-pink-400 text-white font-display text-4xl uppercase tracking-wider transition-transform hover:scale-[1.02] active:scale-[0.98] border-brutal shadow-brutal rounded-xl"
            >
              LAUNCH GRID
            </button>
          ) : (
            <div className="w-full py-5 bg-gray-200 text-gray-500 font-display text-3xl uppercase tracking-wider border-brutal border-gray-400 rounded-xl">
              WAITING FOR HOST...
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SETUP VIEW ---
  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black flex items-center justify-center p-6 bg-halftone">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* CREATE ROOM PANEL */}
        <div className={`bg-white border-brutal shadow-brutal-lg rounded-3xl p-8 transition-opacity ${mode === 'join' ? 'opacity-50 grayscale cursor-pointer' : 'opacity-100'}`}
             onClick={() => mode === 'join' && setMode('create')}>
          <h2 className="font-heading text-4xl font-bold uppercase mb-2">Create Grid</h2>
          <p className="font-sans mb-8 font-medium">Start a new consensus session as the host.</p>
          
          <form onSubmit={handleCreate} className={`space-y-6 ${mode !== 'create' ? 'pointer-events-none' : ''}`}>
            <div>
              <label className="block font-display text-xl mb-2">Your Designation</label>
              <input 
                type="text" 
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 bg-[#F4F4F0] border-brutal focus:outline-none focus:ring-4 focus:ring-accent font-sans text-lg"
                disabled={mode !== 'create'}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || mode !== 'create'}
              className="w-full py-4 bg-pink-500 text-white font-display text-2xl tracking-wide uppercase border-brutal shadow-brutal hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_black] transition-all disabled:opacity-50"
            >
              {loading ? 'INITIALIZING...' : 'GENERATE CODE'}
            </button>
          </form>
        </div>

        {/* JOIN ROOM PANEL */}
        <div className={`bg-cyan-400 border-brutal shadow-brutal-lg rounded-3xl p-8 transition-opacity ${mode === 'create' ? 'opacity-50 grayscale cursor-pointer' : 'opacity-100'}`}
             onClick={() => mode === 'create' && setMode('join')}>
          <h2 className="font-heading text-4xl font-bold uppercase mb-2">Join Grid</h2>
          <p className="font-sans mb-8 font-medium">Connect to an existing session.</p>
          
          <form onSubmit={handleJoin} className={`space-y-6 ${mode !== 'join' ? 'pointer-events-none' : ''}`}>
            <div>
              <label className="block font-display text-xl mb-2">Access Code</label>
              <input 
                type="text" 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="4-DIGIT CODE"
                maxLength={4}
                className="w-full p-4 bg-[#F4F4F0] border-brutal focus:outline-none focus:ring-4 focus:ring-white font-sans text-lg uppercase text-center tracking-widest"
                disabled={mode !== 'join'}
              />
            </div>
            <div>
              <label className="block font-display text-xl mb-2">Your Designation</label>
              <input 
                type="text" 
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 bg-[#F4F4F0] border-brutal focus:outline-none focus:ring-4 focus:ring-white font-sans text-lg"
                disabled={mode !== 'join'}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || mode !== 'join'}
              className="w-full py-4 bg-black text-white font-display text-2xl tracking-wide uppercase border-brutal shadow-[6px_6px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#FFFFFF] transition-all disabled:opacity-50"
            >
              {loading ? 'CONNECTING...' : 'SYNC'}
            </button>
          </form>
        </div>

      </div>

      {error && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-white text-pink-500 border-brutal px-6 py-3 font-bold font-sans shadow-brutal z-50">
          {error}
        </div>
      )}
    </div>
  );
};
