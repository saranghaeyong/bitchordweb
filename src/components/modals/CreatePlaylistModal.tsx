import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { X, Plus, ListMusic } from 'lucide-react';
import { Playlist } from '../../types/music';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated?: (playlist: Playlist) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated,
}) => {
  const { createPlaylist } = usePlayer();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newPl = createPlaylist(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
    if (onPlaylistCreated) onPlaylistCreated(newPl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#13141e] border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <ListMusic size={20} className="text-purple-400" />
            <h2 className="font-bold text-base">Create New Playlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1.5">
              Playlist Title <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midnight Lo-fi Session"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 text-sm text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief vibe check or mood notes..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 text-sm text-white outline-none resize-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/70 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
