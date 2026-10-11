import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { History, Play, Trash2, Heart, Plus, Clock } from 'lucide-react';
import { Track } from '../../types/music';

interface RecentlyPlayedViewProps {
  onOpenAddToPlaylist: (track: Track) => void;
}

export const RecentlyPlayedView: React.FC<RecentlyPlayedViewProps> = ({ onOpenAddToPlaylist }) => {
  const { 
    recentlyPlayed, 
    clearHistory, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    isFavorite, 
    toggleFavorite 
  } = usePlayer();

  const formatPlayedAt = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History size={26} className="text-purple-400" />
            Recently Played
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Tracks you have streamed recently on BitChord.
          </p>
        </div>

        {recentlyPlayed.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all listening history?')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-300 text-xs font-medium transition-colors"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Tracks List */}
      <div className="space-y-2">
        {recentlyPlayed.length === 0 ? (
          <div className="text-center py-20 bg-[#12131b]/60 rounded-3xl border border-white/5 p-8">
            <Clock size={36} className="mx-auto text-white/20 mb-3" />
            <h3 className="text-base font-semibold text-white">No listening history yet</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
              Start playing any track from Home, Search, or Playlists to build your history log.
            </p>
          </div>
        ) : (
          recentlyPlayed.map((item, idx) => {
            const track = item.track;
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            const isFav = isFavorite(track.id);

            return (
              <div
                key={item.id}
                onClick={() => playTrack(track)}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isPlayingThis
                    ? 'bg-purple-950/30 border-purple-500/40'
                    : 'bg-[#12131b]/80 hover:bg-white/10 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="w-5 text-center text-xs font-mono text-white/30 shrink-0">
                    {idx + 1}
                  </span>

                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isPlayingThis ? 'text-purple-300 font-semibold' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-white/50 truncate mt-0.5">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-[11px] text-white/40 font-mono hidden sm:inline mr-2">
                    {formatPlayedAt(item.playedAt)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isFav ? 'text-red-500' : 'text-white/40 hover:text-white'
                    }`}
                    title="Favorite"
                  >
                    <Heart size={15} className={isFav ? 'fill-red-500' : ''} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddToPlaylist(track);
                    }}
                    className="p-2 rounded-full text-white/40 hover:text-white transition-colors"
                    title="Add to Playlist"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
