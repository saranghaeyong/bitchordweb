import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Track, Playlist, HistoryItem } from '../types/music';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Google OAuth Sign In
export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment or Settings.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
};

// Sign Out
export const signOut = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Cloud Database Sync Helpers (Fallback to local if no Supabase)
export const fetchCloudPlaylists = async (userId: string): Promise<Playlist[] | null> => {
  if (!supabase || !userId) return null;

  try {
    const { data: playlistsData, error } = await supabase
      .from('playlists')
      .select(`
        id,
        name,
        description,
        cover_url,
        created_at,
        updated_at,
        playlist_tracks (
          position,
          track_id,
          title,
          artist,
          channel_title,
          thumbnail_url,
          duration
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchPlaylists error:', error.message);
      return null;
    }

    if (!playlistsData) return [];

    return playlistsData.map((pl: any) => ({
      id: pl.id,
      name: pl.name,
      description: pl.description || '',
      coverUrl: pl.cover_url || undefined,
      createdAt: pl.created_at,
      updatedAt: pl.updated_at,
      isDefault: false,
      tracks: (pl.playlist_tracks || [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((pt: any) => ({
          id: pt.track_id,
          title: pt.title,
          artist: pt.artist,
          channelTitle: pt.channel_title,
          thumbnailUrl: pt.thumbnail_url,
          duration: pt.duration,
        })),
    }));
  } catch (err) {
    console.warn('Failed to fetch playlists from Supabase:', err);
    return null;
  }
};

export const syncCloudPlaylist = async (userId: string, playlist: Playlist): Promise<boolean> => {
  if (!supabase || !userId) return false;

  try {
    // Upsert playlist
    const { error: plError } = await supabase
      .from('playlists')
      .upsert({
        id: playlist.id,
        user_id: userId,
        name: playlist.name,
        description: playlist.description || '',
        cover_url: playlist.coverUrl || null,
        updated_at: new Date().toISOString(),
      });

    if (plError) throw plError;

    // Delete existing tracks and re-insert positions
    await supabase.from('playlist_tracks').delete().eq('playlist_id', playlist.id);

    if (playlist.tracks.length > 0) {
      const tracksToInsert = playlist.tracks.map((track, idx) => ({
        playlist_id: playlist.id,
        track_id: track.id,
        title: track.title,
        artist: track.artist,
        channel_title: track.channelTitle || '',
        thumbnail_url: track.thumbnailUrl,
        duration: track.duration || 0,
        position: idx,
      }));

      const { error: trkError } = await supabase.from('playlist_tracks').insert(tracksToInsert);
      if (trkError) throw trkError;
    }

    return true;
  } catch (err) {
    console.warn('Failed to sync playlist to Supabase:', err);
    return false;
  }
};

export const deleteCloudPlaylist = async (userId: string, playlistId: string): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    await supabase.from('playlists').delete().eq('id', playlistId).eq('user_id', userId);
    return true;
  } catch (err) {
    console.warn('Failed to delete playlist from Supabase:', err);
    return false;
  }
};

export const fetchCloudFavorites = async (userId: string): Promise<Track[] | null> => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => ({
      id: item.track_id,
      title: item.title,
      artist: item.artist,
      channelTitle: item.channel_title,
      thumbnailUrl: item.thumbnail_url,
      duration: item.duration,
      addedAt: item.created_at,
    }));
  } catch (err) {
    console.warn('Failed to fetch favorites from Supabase:', err);
    return null;
  }
};

export const toggleCloudFavorite = async (userId: string, track: Track, isFav: boolean): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    if (isFav) {
      await supabase.from('favorites').upsert({
        user_id: userId,
        track_id: track.id,
        title: track.title,
        artist: track.artist,
        channel_title: track.channelTitle || '',
        thumbnail_url: track.thumbnailUrl,
        duration: track.duration || 0,
        created_at: new Date().toISOString(),
      });
    } else {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('track_id', track.id);
    }
    return true;
  } catch (err) {
    console.warn('Failed to update favorite in Supabase:', err);
    return false;
  }
};

export const recordCloudHistory = async (userId: string, track: Track): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    await supabase.from('recently_played').insert({
      user_id: userId,
      track_id: track.id,
      title: track.title,
      artist: track.artist,
      channel_title: track.channelTitle || '',
      thumbnail_url: track.thumbnailUrl,
      duration: track.duration || 0,
      played_at: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('Failed to record history in Supabase:', err);
    return false;
  }
};
