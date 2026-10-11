import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  ListMusic, 
  Plus, 
  Play, 
  Shuffle, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  ChevronLeft, 
  ArrowUp, 
  ArrowDown, 
  Heart, 
  Music, 
  Clock 
} from 'lucide-react';
import { Playlist, Track } from '../../types/music';

interface PlaylistsViewProps {
  selectedPlaylist: Playlist | null;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  onOpenCreatePlaylist: () => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  selectedPlaylist,
  setSelectedPlaylist,
  onOpenCreatePlaylist,
}) => {
  const { 
    playlists, 
    playTrack, 
    updatePlaylist, 
    deletePlaylist, 
    removeTrackFromPlaylist,
    currentTrack,
    isPlaying,
    isFavorite,
    toggleFavorite 
  } = usePlayer();

  // Rename modal / state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  // Find updated version of selectedPlaylist from context
  const activePlaylist = selectedPlaylist
    ? playlists.find(p => p.id === selectedPlaylist.id) || selectedPlaylist
    : null;

  const handleStartEdit = () => {
    if (!activePlaylist) return;
    setEditedTitle(activePlaylist.name);
    setEditedDesc(activePlaylist.description || '');
    setIsEditingTitle(true);
  };

  const handleSaveEdit = () => {
    if (!activePlaylist || !editedTitle.trim()) return;
    const updated: Playlist = {
      ...activePlaylist,
      name: editedTitle.trim(),
      description: editedDesc.trim(),
      updatedAt: new Date().toISOString(),
    };
    updatePlaylist(updated);
    setSelectedPlaylist(updated);
    setIsEditingTitle(false);
  };

  const handleDelete = () => {
    if (!activePlaylist) return;
    if (confirm(`Are you sure you want to delete "${activePlaylist.name}"?`)) {
      deletePlaylist(activePlaylist.id);
      setSelectedPlaylist(null);
    }
  };

  const handleMoveTrack = (index: number, direction: 'up' | 'down') => {
    if (!activePlaylist) return;
    const newTracks = [...activePlaylist.tracks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newTracks.length) return;

    const [moved] = newTracks.splice(index, 1);
    newTracks.splice(targetIdx, 0, moved);

    const updated: Playlist = {
      ...activePlaylist,
      tracks: newTracks,
      updatedAt: new Date().toISOString(),
    };
    updatePlaylist(updated);
    setSelectedPlaylist(updated);
  };

  // If a playlist is selected, show detail view
  if (activePlaylist) {
    const totalSecs = activePlaylist.tracks.reduce((acc, t) => acc + (t.duration || 210), 0);
    const totalMinutes = Math.floor(totalSecs / 60);

    return (
      <div className="space-y-6 pb-20">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPlaylist(null)}
          className="flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors py-1"
        >
          <ChevronLeft size={16} />
          <span>Back to All Playlists</span>
        </button>

        {/* Playlist Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950/40 via-[#151622] to-[#10111a] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 shadow-2xl">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/15 bg-white/5">
            <img
              src={activePlaylist.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
              alt={activePlaylist.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
            <span className="text-[11px] uppercase tracking-widest font-bold text-purple-400">
              Playlist
            </span>

            {isEditingTitle ? (
              <div className="space-y-2 max-w-md">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-purple-500 text-lg font-bold text-white outline-none"
                  placeholder="Playlist Name"
                />
                <input
                  type="text"
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white/80 outline-none"
                  placeholder="Description (optional)"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-purple-600 text-white text-xs font-semibold"
                  >
                    <Check size={14} /> Save
                  </button>
                  <button
                    onClick={() => setIsEditingTitle(false)}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-white/10 text-white/80 text-xs"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight truncate">
                  {activePlaylist.name}
                </h1>
                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  title="Rename Playlist"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}

            {activePlaylist.description && !isEditingTitle && (
              <p className="text-xs text-white/60 max-w-xl line-clamp-2">
                {activePlaylist.description}
              </p>
            )}

            <div className="text-xs text-white/40 font-mono pt-1">
              {activePlaylist.tracks.length} songs · approximately {totalMinutes} mins
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  if (activePlaylist.tracks.length > 0) {
                    playTrack(activePlaylist.tracks[0], activePlaylist.tracks);
                  }
                }}
                disabled={activePlaylist.tracks.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
              >
                <Play size={16} className="fill-white translate-x-0.5" />
                <span>Play All</span>
              </button>

              <button
                onClick={() => {
                  if (activePlaylist.tracks.length > 0) {
                    const shuffled = [...activePlaylist.tracks].sort(() => Math.random() - 0.5);
                    playTrack(shuffled[0], shuffled);
                  }
                }}
                disabled={activePlaylist.tracks.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-medium text-xs transition-colors"
              >
                <Shuffle size={14} />
                <span>Shuffle</span>
              </button>

              <button
                onClick={handleDelete}
                className="p-2.5 rounded-full text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                title="Delete Playlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-2">
          {activePlaylist.tracks.length === 0 ? (
            <div className="text-center py-20 bg-[#12131b]/60 rounded-3xl border border-white/5 p-8">
              <Music size={32} className="mx-auto text-white/30 mb-3" />
              <h3 className="text-base font-semibold text-white">This playlist has no songs yet</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
                Search for your favorite tracks or browse recommendations and click "+" to add them here!
              </p>
            </div>
          ) : (
            activePlaylist.tracks.map((track, idx) => {
              const isPlayingThis = currentTrack?.id === track.id && isPlaying;
              const isFav = isFavorite(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, activePlaylist.tracks)}
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

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <span className="text-xs text-white/40 font-mono hidden sm:inline mr-2">
                      {track.durationFormatted || '3:30'}
                    </span>

                    {/* Move Up/Down Controls */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveTrack(idx, 'up');
                        }}
                        disabled={idx === 0}
                        className="p-1.5 rounded text-white/40 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveTrack(idx, 'down');
                        }}
                        disabled={idx === activePlaylist.tracks.length - 1}
                        className="p-1.5 rounded text-white/40 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

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
                        removeTrackFromPlaylist(activePlaylist.id, track.id);
                      }}
                      className="p-2 rounded-full text-white/40 hover:text-red-400 transition-colors"
                      title="Remove from Playlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // All Playlists Grid
  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ListMusic size={26} className="text-purple-400" />
            Playlists
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Create custom mixes, rearrange tracks, and curate your personal library.
          </p>
        </div>

        <button
          onClick={onOpenCreatePlaylist}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>Create Playlist</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            onClick={() => setSelectedPlaylist(pl)}
            className="group p-4 rounded-3xl bg-[#13141d]/80 hover:bg-white/10 border border-white/5 hover:border-purple-500/40 cursor-pointer transition-all flex flex-col shadow-lg"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3.5 bg-white/5">
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
                className="absolute bottom-3 right-3 p-3 rounded-full bg-purple-600 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                title="Play Playlist"
              >
                <Play size={14} className="fill-white translate-x-0.5" />
              </button>
            </div>

            <h3 className="font-bold text-sm text-white truncate group-hover:text-purple-300 transition-colors">
              {pl.name}
            </h3>
            <p className="text-xs text-white/40 truncate mt-1">
              {pl.tracks.length} {pl.tracks.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
