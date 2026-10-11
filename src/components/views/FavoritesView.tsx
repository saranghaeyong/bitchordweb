import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Heart, Play, Shuffle, Plus, Music, Trash2 } from 'lucide-react';
import { Track } from '../../types/music';

interface FavoritesViewProps {
  onOpenAddToPlaylist: (track: Track) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onOpenAddToPlaylist }) => {
  const { 
    favorites, 
    playTrack, 
    toggleFavorite, 
    currentTrack, 
    isPlaying 
  } = usePlayer();

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      playTrack(favorites[0], favorites);
    }
  };

  const handleShuffle = () => {
    if (favorites.length > 0) {
      const shuffled = [...favorites].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950/60 via-[#18121d] to-[#12131c] border border-rose-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 shadow-2xl">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-2xl shadow-rose-600/30 shrink-0">
          <Heart size={64} className="fill-white" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-rose-400">
            Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Liked Songs
          </h1>
          <p className="text-xs text-white/60">
            {favorites.length} tracks saved to your personal favorites library
          </p>

          <div className="pt-3 flex items-center justify-center sm:justify-start gap-3">
            <button
              onClick={handlePlayAll}
              disabled={favorites.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold text-xs shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
            >
              <Play size={15} className="fill-white translate-x-0.5" />
              <span>Play All</span>
            </button>

            <button
              onClick={handleShuffle}
              disabled={favorites.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-medium text-xs transition-colors"
            >
              <Shuffle size={14} />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-2">
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-[#12131b]/60 rounded-3xl border border-white/5 p-8">
            <Heart size={36} className="mx-auto text-white/20 mb-3" />
            <h3 className="text-base font-semibold text-white">No favorites added yet</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
              Tap the heart icon on any song while listening or searching to collect your favorite music here.
            </p>
          </div>
        ) : (
          favorites.map((track, idx) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => playTrack(track, favorites)}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isPlayingThis
                    ? 'bg-rose-950/30 border-rose-500/40'
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
                    <p className={`text-sm font-medium truncate ${isPlayingThis ? 'text-rose-300 font-semibold' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-white/50 truncate mt-0.5">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs text-white/40 font-mono hidden sm:inline mr-2">
                    {track.durationFormatted || '3:30'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track);
                    }}
                    className="p-2 rounded-full text-rose-500 hover:text-white transition-colors"
                    title="Remove Favorite"
                  >
                    <Heart size={16} className="fill-rose-500" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddToPlaylist(track);
                    }}
                    className="p-2 rounded-full text-white/40 hover:text-white transition-colors"
                    title="Add to Playlist"
                  >
                    <Plus size={16} />
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
