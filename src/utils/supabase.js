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

  const normalizedCode = code.trim().toUpperCase();
  console.log(`[Supabase] Querying room table for code: "${normalizedCode}"`);

  // Use a simple array select first to avoid .single()/.maybeSingle() potential issues
  const { data: rooms, error: roomError } = await supabase
    .from('rooms')
    .select('id, code')
    .eq('code', normalizedCode)
    .limit(1);

  if (roomError) {
    console.error('[Supabase] Error querying rooms table:', roomError);
    throw roomError;
  }

  const room = rooms && rooms.length > 0 ? rooms[0] : null;

  if (!room) {
    console.error(`[Supabase] ROOM NOT FOUND IN DB. Code: "${normalizedCode}"`);
    // List some rooms to see what's actually there (debug only)
    const { data: allRooms } = await supabase.from('rooms').select('code').limit(5);
    console.log('[Supabase] Recent room codes in DB:', allRooms?.map(r => r.code));
    throw new Error('Room not found');
  }

  console.log('[Supabase] Room found. ID:', room.id);

  const { data: existingParticipants, error: epError } = await supabase
    .from('room_participants')
    .select('name')
    .eq('room_id', room.id);

  if (epError) {
    console.error('[Supabase] Error fetching participants:', epError);
    throw epError;
  }

  // Insert the new participant
  const { data: participant, error: pError } = await supabase
    .from('room_participants')
    .insert([{ room_id: room.id, name: participantName.trim(), state: {} }])
    .select()
    .single();

  if (pError) {
    console.error('[Supabase] Error inserting participant:', pError);
    throw pError;
  }

  console.log('[Supabase] Joined room successfully:', participant);

  return {
    roomId: room.id,
    participantId: participant.id,
    existingParticipants: existingParticipants ? existingParticipants.map(p => p.name) : [],
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
