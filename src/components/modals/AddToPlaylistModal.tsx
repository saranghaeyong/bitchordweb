import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { X, Plus, Check, ListMusic, Music } from 'lucide-react';
import { Track } from '../../types/music';

interface AddToPlaylistModalProps {
  track: Track | null;
  onClose: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ track, onClose }) => {
  const { playlists, addTrackToPlaylist, createPlaylist } = usePlayer();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [addedPlaylists, setAddedPlaylists] = useState<Record<string, boolean>>({});

  if (!track) return null;

  const handleToggleAdd = (playlistId: string) => {
    addTrackToPlaylist(playlistId, track);
    setAddedPlaylists(prev => ({ ...prev, [playlistId]: true }));
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newPl = createPlaylist(newPlaylistName.trim());
    addTrackToPlaylist(newPl.id, track);
    setAddedPlaylists(prev => ({ ...prev, [newPl.id]: true }));
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#13141e] border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <ListMusic size={20} className="text-purple-400" />
            <h2 className="font-bold text-base">Add to Playlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Track Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
          <img
            src={track.thumbnailUrl}
            alt={track.title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{track.title}</p>
            <p className="text-[11px] text-white/50 truncate mt-0.5">{track.artist}</p>
          </div>
        </div>

        {/* Playlists List */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {playlists.length === 0 ? (
            <div className="text-center py-6 text-xs text-white/40">
              No playlists created yet. Create your first one below!
            </div>
          ) : (
            playlists.map((pl) => {
              const alreadyIn = pl.tracks.some(t => t.id === track.id) || addedPlaylists[pl.id];
              return (
                <button
                  key={pl.id}
                  onClick={() => handleToggleAdd(pl.id)}
                  disabled={alreadyIn}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                    alreadyIn
                      ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-transparent'
                  }`}
                >
                  <span className="text-xs font-semibold truncate text-left">{pl.name}</span>
                  {alreadyIn ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
                      <Check size={13} /> Added
                    </span>
                  ) : (
                    <span className="text-xs text-white/40 font-medium">+ Add</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Create New Playlist Form */}
        {isCreatingNew ? (
          <form onSubmit={handleCreateAndAdd} className="space-y-2 pt-2 border-t border-white/10">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="New Playlist Title..."
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-500 text-xs text-white outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors"
              >
                Create & Add
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingNew(true)}
            className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={15} />
            <span>Create New Playlist</span>
          </button>
        )}
      </div>
    </div>
  );
};
