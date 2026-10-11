import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  Track, 
  Playlist, 
  HistoryItem, 
  RepeatMode, 
  AccentColor, 
  LayoutDensity, 
  UserProfile 
} from '../types/music';
import { CURATED_PLAYLISTS, CURATED_TRACKS } from '../data/curatedTracks';
import { 
  supabase, 
  isSupabaseConfigured, 
  signInWithGoogle, 
  signOut as supabaseSignOut,
  fetchCloudPlaylists,
  syncCloudPlaylist,
  deleteCloudPlaylist,
  fetchCloudFavorites,
  toggleCloudFavorite,
  recordCloudHistory
} from '../lib/supabase';

interface PlayerContextType {
  // Playback
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  queue: Track[];
  queueIndex: number;
  playbackError: string | null;
  isDockedVideoVisible: boolean;
  isExpandedModalOpen: boolean;
  isQueueOpen: boolean;
  
  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  playNextInQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (from: number, to: number) => void;
  setPlaybackError: (err: string | null) => void;
  setDockedVideoVisible: (visible: boolean) => void;
  setExpandedModalOpen: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;

  // Favorites
  favorites: Track[];
  isFavorite: (trackId: string) => boolean;
  toggleFavorite: (track: Track) => void;

  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string) => Playlist;
  updatePlaylist: (playlist: Playlist) => void;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  // History
  recentlyPlayed: HistoryItem[];
  clearHistory: () => void;

  // Theme & Preferences
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  density: LayoutDensity;
  setDensity: (density: LayoutDensity) => void;
  autoPlayNext: boolean;
  setAutoPlayNext: (autoPlay: boolean) => void;

  // Auth & Cloud Sync
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncStatus: 'synced' | 'local' | 'syncing' | 'error';

  // Internal YT Player Bridge registration
  registerYTPlayer: (player: any) => void;
  handleYTStateChange: (state: number) => void;
  handleYTError: (code: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const STORAGE_KEYS = {
  FAVORITES: 'bitchord_favorites_v1',
  PLAYLISTS: 'bitchord_playlists_v1',
  HISTORY: 'bitchord_history_v1',
  THEME_ACCENT: 'bitchord_accent_v1',
  THEME_DENSITY: 'bitchord_density_v1',
  AUTOPLAY: 'bitchord_autoplay_v1',
  LAST_TRACK: 'bitchord_last_track_v1',
  VOLUME: 'bitchord_volume_v1',
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // YouTube player instance
  const ytPlayerRef = useRef<any>(null);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_TRACK);
      return saved ? JSON.parse(saved) : CURATED_TRACKS[0];
    } catch {
      return CURATED_TRACKS[0];
    }
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
      return saved ? parseInt(saved, 10) : 80;
    } catch {
      return 80;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(() => CURATED_TRACKS.slice(0, 8));
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isDockedVideoVisible, setDockedVideoVisible] = useState<boolean>(false);
  const [isExpandedModalOpen, setExpandedModalOpen] = useState<boolean>(false);
  const [isQueueOpen, setQueueOpen] = useState<boolean>(false);

  // Favorites state
  const [favorites, setFavorites] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [CURATED_TRACKS[0], CURATED_TRACKS[3], CURATED_TRACKS[16]];
    } catch {
      return [];
    }
  });

  // Playlists state
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return saved ? JSON.parse(saved) : CURATED_PLAYLISTS;
    } catch {
      return CURATED_PLAYLISTS;
    }
  });

  // History state
  const [recentlyPlayed, setRecentlyPlayed] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings state
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME_ACCENT) as AccentColor) || 'violet';
  });
  const [density, setDensityState] = useState<LayoutDensity>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME_DENSITY) as LayoutDensity) || 'comfortable';
  });
  const [autoPlayNext, setAutoPlayNextState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTOPLAY) !== 'false';
  });

  // Auth & Cloud Sync state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local' | 'syncing' | 'error'>(
    isSupabaseConfigured() ? 'syncing' : 'local'
  );

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage save favorites error', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.warn('LocalStorage save playlists error', e);
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(recentlyPlayed));
    } catch (e) {
      console.warn('LocalStorage save history error', e);
    }
  }, [recentlyPlayed]);

  useEffect(() => {
    if (currentTrack) {
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_TRACK, JSON.stringify(currentTrack));
      } catch (e) {
        console.warn('LocalStorage save currentTrack error', e);
      }
    }
  }, [currentTrack]);

  // Auth observer
  useEffect(() => {
    if (!supabase) {
      setSyncStatus('local');
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url || '',
          isGuest: false,
        });
        loadCloudUserData(session.user.id);
      } else {
        setUser(null);
        setSyncStatus('local');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url || '',
          isGuest: false,
        });
        loadCloudUserData(session.user.id);
      } else {
        setUser(null);
        setSyncStatus('local');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadCloudUserData = async (userId: string) => {
    setSyncStatus('syncing');
    try {
      const [cloudPls, cloudFavs] = await Promise.all([
        fetchCloudPlaylists(userId),
        fetchCloudFavorites(userId),
      ]);

      if (cloudPls && cloudPls.length > 0) {
        setPlaylists(cloudPls);
      }
      if (cloudFavs && cloudFavs.length > 0) {
        setFavorites(cloudFavs);
      }
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Cloud sync failed:', err);
      setSyncStatus('error');
    }
  };

  // Poll time updates from YouTube player
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const t = ytPlayerRef.current.getCurrentTime();
          const d = ytPlayerRef.current.getDuration();
          if (typeof t === 'number' && !isNaN(t)) {
            setCurrentTime(t);
          }
          if (typeof d === 'number' && !isNaN(d) && d > 0) {
            setDuration(d);
          }
        } catch {
          // Player not ready
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // YouTube player registration
  const registerYTPlayer = useCallback((player: any) => {
    ytPlayerRef.current = player;
  }, []);

  // YouTube state change handler
  const handleYTStateChange = useCallback((state: number) => {
    // YT.PlayerState: -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
    if (state === 1) {
      setIsPlaying(true);
      setIsBuffering(false);
      setPlaybackError(null);
    } else if (state === 2) {
      setIsPlaying(false);
      setIsBuffering(false);
    } else if (state === 3) {
      setIsBuffering(true);
    } else if (state === 0) {
      // Track ended
      setIsPlaying(false);
      if (repeatMode === 'one') {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
          ytPlayerRef.current.seekTo(0);
          ytPlayerRef.current.playVideo();
        }
      } else if (autoPlayNext) {
        nextTrack();
      }
    }
  }, [repeatMode, autoPlayNext]);

  // YouTube error handler
  const handleYTError = useCallback((code: number) => {
    setIsBuffering(false);
    setIsPlaying(false);
    if (code === 101 || code === 150) {
      setPlaybackError(
        'The video owner does not allow embedded playback outside YouTube. You can open it on YouTube or skip to next track.'
      );
    } else if (code === 100) {
      setPlaybackError('This video was not found or has been removed.');
    } else {
      setPlaybackError('Playback error occurred. Skipping or selecting another track is recommended.');
    }
  }, []);

  // Play a specific track
  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setPlaybackError(null);
    setCurrentTrack(track);
    setCurrentTime(0);

    // Update queue
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      // If track isn't in queue, add it
      setQueue(prev => {
        const existingIdx = prev.findIndex(t => t.id === track.id);
        if (existingIdx === -1) {
          const updated = [...prev, track];
          setQueueIndex(updated.length - 1);
          return updated;
        } else {
          setQueueIndex(existingIdx);
          return prev;
        }
      });
    }

    // Record to recently played
    const historyItem: HistoryItem = {
      id: `${track.id}-${Date.now()}`,
      track,
      playedAt: new Date().toISOString(),
    };
    setRecentlyPlayed(prev => [historyItem, ...prev.filter(h => h.track.id !== track.id)].slice(0, 40));

    if (user && !user.isGuest) {
      recordCloudHistory(user.id, track);
    }

    // Instruct YouTube player to load and play
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(track.id);
        setIsPlaying(true);
      } catch (err) {
        console.warn('Error loading video by ID:', err);
      }
    }
  }, [user]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!currentTrack) return;

    if (ytPlayerRef.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (err) {
        console.warn('Error toggling play:', err);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [currentTrack, isPlaying]);

  // Seek
  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
      } catch (err) {
        console.warn('Error seeking:', err);
      }
    }
  }, []);

  // Volume
  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(100, vol));
    setVolumeState(clamped);
    localStorage.setItem(STORAGE_KEYS.VOLUME, clamped.toString());

    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(clamped);
        if (clamped === 0) {
          setIsMuted(true);
          ytPlayerRef.current.mute();
        } else if (isMuted) {
          setIsMuted(false);
          ytPlayerRef.current.unMute();
        }
      } catch (err) {
        console.warn('Error setting volume:', err);
      }
    }
  }, [isMuted]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    if (ytPlayerRef.current) {
      try {
        if (isMuted) {
          ytPlayerRef.current.unMute();
          setIsMuted(false);
          ytPlayerRef.current.setVolume(volume || 80);
        } else {
          ytPlayerRef.current.mute();
          setIsMuted(true);
        }
      } catch (err) {
        console.warn('Error toggling mute:', err);
      }
    } else {
      setIsMuted(!isMuted);
    }
  }, [isMuted, volume]);

  // Next Track
  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;

    let nextIdx = queueIndex + 1;
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setQueueIndex(nextIdx);
    const nextItem = queue[nextIdx];
    if (nextItem) {
      playTrack(nextItem);
    }
  }, [queue, queueIndex, isShuffled, repeatMode, playTrack]);

  // Previous Track
  const previousTrack = useCallback(() => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = repeatMode === 'all' ? queue.length - 1 : 0;
    }

    setQueueIndex(prevIdx);
    const prevItem = queue[prevIdx];
    if (prevItem) {
      playTrack(prevItem);
    }
  }, [currentTime, queue, queueIndex, repeatMode, seekTo, playTrack]);

  // Shuffle toggle
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  // Repeat cycle: off -> all -> one -> off
  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Queue actions
  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const playNextInQueue = useCallback((track: Track) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(queueIndex + 1, 0, track);
      return copy;
    });
  }, [queueIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    if (index < queueIndex) {
      setQueueIndex(prev => Math.max(0, prev - 1));
    }
  }, [queueIndex]);

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentTrack]);

  const reorderQueue = useCallback((from: number, to: number) => {
    setQueue(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }, []);

  // Favorites
  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(t => t.id === trackId);
  }, [favorites]);

  const toggleFavorite = useCallback((track: Track) => {
    setFavorites(prev => {
      const exists = prev.some(t => t.id === track.id);
      let updated: Track[];
      if (exists) {
        updated = prev.filter(t => t.id !== track.id);
        if (user && !user.isGuest) toggleCloudFavorite(user.id, track, false);
      } else {
        updated = [track, ...prev];
        if (user && !user.isGuest) toggleCloudFavorite(user.id, track, true);
      }
      return updated;
    });
  }, [user]);

  // Playlist Management
  const createPlaylist = useCallback((name: string, description?: string): Playlist => {
    const newPl: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name.trim() || 'My Playlist',
      description: description || '',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: [],
    };

    setPlaylists(prev => [newPl, ...prev]);

    if (user && !user.isGuest) {
      syncCloudPlaylist(user.id, newPl);
    }

    return newPl;
  }, [user]);

  const updatePlaylist = useCallback((updated: Playlist) => {
    setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (user && !user.isGuest) {
      syncCloudPlaylist(user.id, updated);
    }
  }, [user]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (user && !user.isGuest) {
      deleteCloudPlaylist(user.id, playlistId);
    }
  }, [user]);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.tracks.some(t => t.id === track.id)) return p;
        const updatedTracks = [...p.tracks, track];
        const updatedPl: Playlist = {
          ...p,
          tracks: updatedTracks,
          coverUrl: p.coverUrl || track.thumbnailUrl,
          updatedAt: new Date().toISOString(),
        };
        if (user && !user.isGuest) syncCloudPlaylist(user.id, updatedPl);
        return updatedPl;
      }
      return p;
    }));
  }, [user]);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const updatedPl: Playlist = {
          ...p,
          tracks: p.tracks.filter(t => t.id !== trackId),
          updatedAt: new Date().toISOString(),
        };
        if (user && !user.isGuest) syncCloudPlaylist(user.id, updatedPl);
        return updatedPl;
      }
      return p;
    }));
  }, [user]);

  // History
  const clearHistory = useCallback(() => {
    setRecentlyPlayed([]);
  }, []);

  // Theming & Settings
  const setAccentColor = useCallback((color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem(STORAGE_KEYS.THEME_ACCENT, color);
  }, []);

  const setDensity = useCallback((d: LayoutDensity) => {
    setDensityState(d);
    localStorage.setItem(STORAGE_KEYS.THEME_DENSITY, d);
  }, []);

  const setAutoPlayNext = useCallback((val: boolean) => {
    setAutoPlayNextState(val);
    localStorage.setItem(STORAGE_KEYS.AUTOPLAY, val.toString());
  }, []);

  // Auth
  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await supabaseSignOut();
    setUser(null);
    setSyncStatus('local');
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isBuffering,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffled,
        queue,
        queueIndex,
        playbackError,
        isDockedVideoVisible,
        isExpandedModalOpen,
        isQueueOpen,
        playTrack,
        togglePlay,
        seekTo,
        setVolume,
        toggleMute,
        nextTrack,
        previousTrack,
        toggleShuffle,
        cycleRepeat,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
        setPlaybackError,
        setDockedVideoVisible,
        setExpandedModalOpen,
        setQueueOpen,
        favorites,
        isFavorite,
        toggleFavorite,
        playlists,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        recentlyPlayed,
        clearHistory,
        accentColor,
        setAccentColor,
        density,
        setDensity,
        autoPlayNext,
        setAutoPlayNext,
        user,
        isAuthModalOpen,
        setAuthModalOpen,
        loginWithGoogle,
        logout,
        syncStatus,
        registerYTPlayer,
        handleYTStateChange,
        handleYTError,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
