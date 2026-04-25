import React, { createContext, useReducer, useContext, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'quorum_session_state';

const defaultState = {
  participants: [], // [{ name: 'Alice', votes: { filmId: 'sentiment' }, queue: [filmId, ...] }]
  currentParticipantIndex: 0,
  currentCardIndex: 0,
  phase: 'hero', // 'hero', 'setup', 'voting', 'countdown', 'reveal', 'results'
  roomId: null, // For Supabase sync
  roomCode: null,
  localParticipantName: null,
  selectedGenres: [],
  bannedFilms: [],
};

const getInitialState = () => {
  try {
    const stored = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load state from sessionStorage", e);
  }
  return defaultState;
};

const sessionReducer = (state, action) => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        participants: state.participants.map(p => ({
          ...p,
          votes: {},
          queue: []
        })),
        phase: 'voting',
        currentParticipantIndex: 0,
        currentCardIndex: 0,
      };

    case 'SET_ROOM':
      return {
        ...state,
        roomId: action.payload.roomId,
        roomCode: action.payload.roomCode
      };

    case 'ADD_PARTICIPANT':
      // Avoid duplicates if they joined themselves
      if (state.participants.some(p => p.name === action.payload)) return state;
      return {
        ...state,
        participants: [...state.participants, { name: action.payload, votes: {}, queue: [], isFinished: false }]
      };

    case 'SET_PARTICIPANT_QUEUE':
      const updatedParticipantsQueue = [...state.participants];
      updatedParticipantsQueue[state.currentParticipantIndex].queue = action.payload;
      return {
        ...state,
        participants: updatedParticipantsQueue,
      };

    case 'CAST_VOTE':
      const { filmId, sentiment } = action.payload;
      const newParticipants = [...state.participants];
      newParticipants[state.currentParticipantIndex].votes[filmId] = sentiment;
      
      return {
        ...state,
        participants: newParticipants,
        currentCardIndex: state.currentCardIndex + 1,
      };

    case 'MARK_FINISHED':
      return {
        ...state,
        participants: state.participants.map(p => 
          p.name === action.payload ? { ...p, isFinished: true } : p
        )
      };

    case 'NEXT_PARTICIPANT':
      const nextIndex = state.currentParticipantIndex + 1;
      if (nextIndex >= state.participants.length) {
        return { ...state, phase: 'countdown' };
      }
      return {
        ...state,
        currentParticipantIndex: nextIndex,
        currentCardIndex: 0,
      };

    case 'SET_GENRES':
      return { ...state, selectedGenres: action.payload };

    case 'REMATCH':
      return {
        ...state,
        bannedFilms: [...state.bannedFilms, action.payload], // action.payload = bannedFilmId
        participants: state.participants.map(p => ({
          ...p,
          votes: {},
          queue: [],
          isFinished: false
        })),
        phase: 'voting',
        currentParticipantIndex: 0,
        currentCardIndex: 0,
      };

    case 'SET_LOCAL_USER':
      return { ...state, localParticipantName: action.payload };

    case 'RECEIVE_VOTES': {
      const { name, votes, isFinished } = action.payload;
      const updatedParticipantsVotes = state.participants.map(p => 
        p.name === name ? { ...p, votes, isFinished: isFinished !== undefined ? isFinished : p.isFinished } : p
      );
      return { ...state, participants: updatedParticipantsVotes };
    }

    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'RESET_SESSION':
      return defaultState;

    default:
      return state;
  }
};

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, defaultState, getInitialState);

  // Auto-persist to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
