export interface Track {
  id: string; // YouTube Video ID
  title: string;
  artist: string;
  channelTitle?: string;
  thumbnailUrl: string;
  duration?: number; // seconds
  durationFormatted?: string; // e.g. "3:45"
  views?: string;
  uploadedAt?: string;
  addedAt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
  tracks: Track[];
  isDefault?: boolean;
}

export interface HistoryItem {
  id: string;
  track: Track;
  playedAt: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type NavigationTab = 
  | 'home'
  | 'search'
  | 'explore'
  | 'library'
  | 'playlists'
  | 'favorites'
  | 'recent'
  | 'ai-discovery'
  | 'settings';

export type AccentColor = 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';
export type LayoutDensity = 'comfortable' | 'compact';

export interface UserProfile {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  isGuest: boolean;
}

export interface AiDiscoveryResult {
  thought: string;
  suggestedTheme: string;
  playlistName: string;
  playlistDescription: string;
  suggestedTracks: {
    title: string;
    artist: string;
    reason: string;
    moodTags: string[];
    track?: Track; // Matched playable track if available
  }[];
  similarArtists: string[];
}
