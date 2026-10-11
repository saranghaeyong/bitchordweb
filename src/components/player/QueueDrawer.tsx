import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { X, Trash2, Play, Music2, GripVertical } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentTrack,
    isQueueOpen,
    setQueueOpen,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#111218]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col text-white animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Music2 size={18} className="text-purple-400" />
          <h2 className="font-semibold text-base">Playback Queue</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Clear Queue"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={() => setQueueOpen(false)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Now Playing Header in Queue */}
      {currentTrack && (
        <div className="p-4 border-b border-white/5 bg-purple-950/20">
          <p className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold mb-2">Now Playing</p>
          <div className="flex items-center gap-3">
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-xl object-cover border border-purple-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-white truncate">{currentTrack.title}</p>
              <p className="text-xs text-white/50 truncate">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      )}

      {/* Up Next List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-white/40 font-semibold">Up Next</p>
        {queue.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm">
            Queue is empty. Search tracks or click playlists to start listening!
          </div>
        ) : (
          queue.map((track, idx) => {
            const isCurrent = currentTrack && currentTrack.id === track.id;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={`group flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                  isCurrent
                    ? 'bg-purple-600/20 border border-purple-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <div
                  onClick={() => playTrack(track)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <span className="text-xs font-mono text-white/30 w-4 text-center">{idx + 1}</span>
                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium truncate ${isCurrent ? 'text-purple-300 font-semibold' : 'text-white/90'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-white/50 truncate">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => playTrack(track)}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                    title="Play Now"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={() => removeFromQueue(idx)}
                    className="p-1.5 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/10"
                    title="Remove from queue"
                  >
                    <X size={14} />
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
