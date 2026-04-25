import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── SINGLE SHARED CHANNEL REFERENCE ────────────────────────────────────────
// broadcastVotes & broadcastPhaseChange MUST use the same subscribed channel
// instance, otherwise Supabase silently drops the messages.
let _channel = null;

export const getChannel = () => _channel;

// ─── Database helpers ────────────────────────────────────────────────────────
export const createRoom = async (code) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('rooms').insert([{ code }]).select().single();
  if (error) throw error;
  return data;
};

export const joinRoom = async (code, participantName) => {
  if (!supabase) return null;

  const { data: room, error: roomError } = await supabase
    .from('rooms').select('id').eq('code', code).single();
  if (roomError) throw new Error('Room not found');

  const { data: existingParticipants, error: epError } = await supabase
    .from('room_participants').select('name').eq('room_id', room.id);
  if (epError) throw epError;

  const { data: participant, error: pError } = await supabase
    .from('room_participants')
    .insert([{ room_id: room.id, name: participantName, state: {} }])
    .select().single();
  if (pError) throw pError;

  return {
    roomId: room.id,
    participantId: participant.id,
    existingParticipants: existingParticipants.map(p => p.name),
  };
};

// ─── Realtime Subscription ───────────────────────────────────────────────────
export const subscribeToRoom = (roomId, onParticipantJoined, onPhaseChanged, onVotesSubmitted) => {
  if (!supabase) return null;

  // If already subscribed to this room, reuse the channel
  if (_channel) {
    console.log('[Supabase] Reusing existing channel');
    return _channel;
  }

  _channel = supabase.channel(`room:${roomId}`, {
    config: { broadcast: { self: false } }
  })
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` },
      (payload) => { if (onParticipantJoined) onParticipantJoined(payload.new.name); }
    )
    .on('broadcast', { event: 'phase_change' }, (payload) => {
      if (onPhaseChanged) onPhaseChanged(payload.payload);
    })
    .on('broadcast', { event: 'submit_votes' }, (payload) => {
      if (onVotesSubmitted) onVotesSubmitted(
        payload.payload.name,
        payload.payload.votes,
        payload.payload.isFinished
      );
    })
    .subscribe((status) => {
      console.log('[Supabase] Channel status:', status);
    });

  return _channel;
};

// ─── Broadcast helpers — always use the shared channel ───────────────────────
export const broadcastPhaseChange = async (roomId, phase, extraPayload = {}) => {
  if (!supabase) return;
  const ch = _channel || supabase.channel(`room:${roomId}`);
  await ch.send({
    type: 'broadcast',
    event: 'phase_change',
    payload: { phase, ...extraPayload },
  });
};

export const broadcastVotes = async (roomId, name, votes, isFinished = false) => {
  if (!supabase) return;
  const ch = _channel || supabase.channel(`room:${roomId}`);
  await ch.send({
    type: 'broadcast',
    event: 'submit_votes',
    payload: { name, votes, isFinished },
  });
};

export const broadcastAICatalogue = async (roomId, catalogue) => {
  if (!supabase) return;
  const ch = _channel || supabase.channel(`room:${roomId}`);
  await ch.send({
    type: 'broadcast',
    event: 'phase_change',
    payload: { phase: 'ai_catalogue', catalogue },
  });
};

export const resetChannel = () => {
  _channel = null;
};
