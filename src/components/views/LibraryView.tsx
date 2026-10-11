import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Library, 
  Heart, 
  History, 
  ListMusic, 
  Plus, 
  Play, 
  Sparkles, 
  HardDrive, 
  Cloud 
} from 'lucide-react';
import { NavigationTab, Playlist, Track } from '../../types/music';

interface LibraryViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenCreatePlaylist: () => void;
  onOpenAddToPlaylist: (track: Track) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  setActiveTab,
  onSelectPlaylist,
  onOpenCreatePlaylist,
}) => {
  const { 
    playlists, 
    favorites, 
    recentlyPlayed, 
    playTrack, 
    user, 
    syncStatus, 
    setAuthModalOpen 
  } = usePlayer();

  return (
    <div className="space-y-8 pb-20">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Library size={28} className="text-purple-400" />
            Your Music Library
          </h1>
          <p className="text-sm text-white/50 mt-1">
            All your personal collections, liked songs, and listening history in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreatePlaylist}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      {/* Cloud & Storage Status Pill */}
      <div 
        onClick={() => setAuthModalOpen(true)}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-300">
            {syncStatus === 'synced' ? <Cloud size={18} /> : <HardDrive size={18} />}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              {syncStatus === 'synced' ? 'Supabase Cloud Sync Active' : 'Offline / LocalStorage Mode'}
            </p>
            <p className="text-[11px] text-white/50">
              {user ? `Logged in as ${user.displayName} (${user.email || 'Google User'})` : 'Your library is safely preserved locally in browser storage. Click to sync with Google & Supabase.'}
            </p>
          </div>
        </div>
        <span className="text-xs text-purple-400 font-medium">Manage Sync →</span>
      </div>

      {/* Quick Summary Cards (Favorites / Recently Played) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Favorites Card */}
        <div
          onClick={() => setActiveTab('favorites')}
          className="group relative rounded-3xl p-6 bg-gradient-to-br from-rose-950/60 to-purple-950/60 border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart size={24} className="fill-rose-400" />
            </div>
            {favorites.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTrack(favorites[0], favorites);
                }}
                className="p-3 rounded-full bg-rose-500 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                title="Play Favorites"
              >
                <Play size={16} className="fill-white translate-x-0.5" />
              </button>
            )}
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-rose-200 transition-colors">
            Liked Songs
          </h3>
          <p className="text-xs text-white/50 mt-1 font-mono">
            {favorites.length} saved tracks
          </p>
        </div>

        {/* Recently Played Card */}
        <div
          onClick={() => setActiveTab('recent')}
          className="group relative rounded-3xl p-6 bg-gradient-to-br from-indigo-950/60 to-slate-950/60 border border-indigo-500/20 hover:border-indigo-500/40 cursor-pointer transition-all shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <History size={24} />
            </div>
            {recentlyPlayed.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTrack(recentlyPlayed[0].track);
                }}
                className="p-3 rounded-full bg-indigo-500 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                title="Play Last Track"
              >
                <Play size={16} className="fill-white translate-x-0.5" />
              </button>
            )}
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
            Listening History
          </h3>
          <p className="text-xs text-white/50 mt-1 font-mono">
            {recentlyPlayed.length} tracks recorded
          </p>
        </div>
      </div>

      {/* Playlists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ListMusic size={18} className="text-purple-400" />
            Your Playlists ({playlists.length})
          </h2>
          <button
            onClick={() => setActiveTab('playlists')}
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            Manage Playlists →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="group p-3.5 rounded-2xl bg-[#13141d]/80 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer transition-all flex flex-col"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-white/5">
                <img
                  src={pl.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks);
                  }}
                  className="absolute bottom-2 right-2 p-2.5 rounded-full bg-purple-600 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <Play size={14} className="fill-white translate-x-0.5" />
                </button>
              </div>

              <h4 className="font-semibold text-xs text-white truncate">{pl.name}</h4>
              <p className="text-[11px] text-white/40 truncate mt-0.5">{pl.tracks.length} tracks</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
