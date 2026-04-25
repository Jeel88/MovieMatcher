import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database Schema expected:
// Table: rooms
// Columns: id (uuid), code (varchar), created_at (timestamp)

// Table: room_participants
// Columns: id (uuid), room_id (uuid), name (varchar), state (jsonb)

export const createRoom = async (code) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('rooms').insert([{ code }]).select().single();
  if (error) throw error;
  return data;
};

export const joinRoom = async (code, participantName) => {
  if (!supabase) return null;
  
  // 1. Find the room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id')
    .eq('code', code)
    .single();
    
  if (roomError) throw new Error("Room not found");

  // 2. Fetch existing participants
  const { data: existingParticipants, error: epError } = await supabase
    .from('room_participants')
    .select('name')
    .eq('room_id', room.id);

  if (epError) throw epError;

  // 3. Insert new participant
  const { data: participant, error: pError } = await supabase
    .from('room_participants')
    .insert([{ room_id: room.id, name: participantName, state: {} }])
    .select()
    .single();

  if (pError) throw pError;
  
  return { 
    roomId: room.id, 
    participantId: participant.id,
    existingParticipants: existingParticipants.map(p => p.name)
  };
};

// --- Realtime Sync ---
export const subscribeToRoom = (roomId, onParticipantJoined, onPhaseChanged, onVotesSubmitted) => {
  if (!supabase) return null;

  const channel = supabase.channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` },
      (payload) => {
        if (onParticipantJoined) onParticipantJoined(payload.new.name);
      }
    )
    .on(
      'broadcast',
      { event: 'phase_change' },
      (payload) => {
        if (onPhaseChanged) onPhaseChanged(payload.payload);
      }
    )
    .on(
      'broadcast',
      { event: 'submit_votes' },
      (payload) => {
        if (onVotesSubmitted) onVotesSubmitted(payload.payload.name, payload.payload.votes);
      }
    )
    .subscribe();

  return channel;
};

export const broadcastPhaseChange = async (roomId, phase, extraPayload = {}) => {
  if (!supabase) return;
  await supabase.channel(`room:${roomId}`).send({
    type: 'broadcast',
    event: 'phase_change',
    payload: { phase, ...extraPayload }
  });
};

export const broadcastVotes = async (roomId, name, votes) => {
  if (!supabase) return;
  await supabase.channel(`room:${roomId}`).send({
    type: 'broadcast',
    event: 'submit_votes',
    payload: { name, votes }
  });
};
