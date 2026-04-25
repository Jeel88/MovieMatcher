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

  const { data: participant, error: pError } = await supabase
    .from('room_participants')
    .insert([{ room_id: room.id, name: participantName, state: {} }])
    .select()
    .single();

  if (pError) throw pError;
  return { roomId: room.id, participantId: participant.id };
};

// --- Realtime Sync ---
export const subscribeToRoom = (roomId, onParticipantJoined, onPhaseChanged) => {
  if (!supabase) return null;

  const channel = supabase.channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` },
      (payload) => {
        onParticipantJoined(payload.new.name);
      }
    )
    .on(
      'broadcast',
      { event: 'phase_change' },
      (payload) => {
        onPhaseChanged(payload.payload.phase);
      }
    )
    .subscribe();

  return channel;
};

export const broadcastPhaseChange = async (roomId, phase) => {
  if (!supabase) return;
  await supabase.channel(`room:${roomId}`).send({
    type: 'broadcast',
    event: 'phase_change',
    payload: { phase }
  });
};
