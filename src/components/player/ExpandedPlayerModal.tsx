import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  ListMusic, 
  Info, 
  Video 
} from 'lucide-react';

export const ExpandedPlayerModal: React.FC = () => {
  const {
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
    playTrack,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    nextTrack,
    previousTrack,
    toggleShuffle,
    cycleRepeat,
    favorites,
    toggleFavorite,
    isFavorite,
    isExpandedModalOpen,
    setExpandedModalOpen,
    setDockedVideoVisible,
    accentColor,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<'visual' | 'queue' | 'info'>('visual');

  if (!isExpandedModalOpen || !currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = isFavorite(currentTrack.id);

  const getAccentClass = () => {
    switch (accentColor) {
      case 'cyan': return 'bg-cyan-500 text-black';
      case 'emerald': return 'bg-emerald-500 text-black';
      case 'amber': return 'bg-amber-500 text-black';
      case 'rose': return 'bg-rose-500 text-white';
      case 'violet':
      default:
        return 'bg-purple-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0c10] text-white animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      {/* Blurred background artwork atmosphere */}
      <div 
        className="absolute inset-0 opacity-25 filter blur-3xl scale-110 pointer-events-none transition-all duration-1000 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentTrack.thumbnailUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0b0c10]/90 to-[#0b0c10] pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/10">
        <button
          onClick={() => setExpandedModalOpen(false)}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          title="Minimize to Bottom Bar"
        >
          <ChevronDown size={22} />
        </button>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Playing from YouTube</p>
          <p className="text-sm font-medium text-white/90 truncate max-w-sm">{currentTrack.channelTitle || 'BitChord Soundscape'}</p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'visual' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Artwork
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'queue' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <ListMusic size={13} />
            Queue ({queue.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'info' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <Info size={13} />
            Info
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center p-6 md:p-12 overflow-y-auto gap-8 max-w-6xl mx-auto w-full">
        {/* Left / Center View: Artwork / Visualizer Stage */}
        {activeTab === 'visual' && (
          <div className="flex flex-col items-center max-w-md w-full">
            <div className="relative group w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 mb-8">
              <img
                src={currentTrack.thumbnailUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {isPlaying && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs flex items-center gap-2">
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 bg-green-400 h-3 animate-pulse" />
                    <span className="w-1 bg-green-400 h-2 animate-pulse delay-75" />
                    <span className="w-1 bg-green-400 h-3.5 animate-pulse delay-150" />
                  </span>
                  <span>Playing</span>
                </div>
              )}
            </div>

            {/* Title & Artist & Favorite */}
            <div className="w-full flex items-center justify-between mb-6">
              <div className="min-w-0 pr-4">
                <h2 className="text-xl sm:text-2xl font-bold truncate text-white">{currentTrack.title}</h2>
                <p className="text-white/60 font-medium text-base truncate mt-1">{currentTrack.artist}</p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrack)}
                className={`p-3 rounded-full hover:bg-white/10 transition-colors ${
                  isFav ? 'text-red-500 fill-red-500' : 'text-white/50 hover:text-white'
                }`}
              >
                <Heart size={26} className={isFav ? 'fill-red-500' : ''} />
              </button>
            </div>
          </div>
        )}

        {/* Tab: Queue List */}
        {activeTab === 'queue' && (
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-[480px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <ListMusic size={18} className="text-purple-400" />
                Up Next in Queue
              </h3>
              <span className="text-xs text-white/40">{queue.length} tracks</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    track.id === currentTrack.id
                      ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-xs text-white/40 font-mono">{idx + 1}</span>
                    <img src={track.thumbnailUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-white/50 truncate">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/40 font-mono shrink-0 ml-3">{track.durationFormatted || '3:30'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Track Info */}
        {activeTab === 'info' && (
          <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Info size={18} className="text-purple-400" />
              Official YouTube Track Information
            </h3>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50">Track Title</span>
                <span className="font-medium text-right max-w-xs truncate">{currentTrack.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50">Artist / Channel</span>
                <span className="font-medium">{currentTrack.artist}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50">YouTube Video ID</span>
                <span className="font-mono text-purple-300">{currentTrack.id}</span>
              </div>
              {currentTrack.views && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/50">Total Views</span>
                  <span>{currentTrack.views}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center gap-3">
              <a
                href={`https://www.youtube.com/watch?v=${currentTrack.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors"
              >
                <ExternalLink size={15} />
                Open on YouTube
              </a>
              <button
                onClick={() => {
                  setDockedVideoVisible(true);
                  setExpandedModalOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors"
              >
                <Video size={15} />
                Dock Video
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Section */}
      <div className="relative z-10 px-6 py-6 border-t border-white/10 bg-[#0f1015]/90 backdrop-blur-xl max-w-3xl mx-auto w-full">
        {/* Progress Seekbar */}
        <div className="flex items-center gap-3 text-xs font-mono text-white/40 mb-4">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-purple-400"
            style={{
              background: `linear-gradient(to right, #a855f7 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
            }}
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`p-3 rounded-full transition-colors ${
              isShuffled ? 'text-purple-400' : 'text-white/40 hover:text-white'
            }`}
          >
            <Shuffle size={20} />
          </button>

          <div className="flex items-center gap-5">
            <button
              onClick={previousTrack}
              className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipBack size={26} />
            </button>

            <button
              onClick={togglePlay}
              className={`p-4 rounded-full ${getAccentClass()} shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center`}
            >
              {isBuffering ? (
                <div className="w-7 h-7 border-3 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={26} className="fill-current" />
              ) : (
                <Play size={26} className="fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipForward size={26} />
            </button>
          </div>

          <button
            onClick={cycleRepeat}
            className={`p-3 rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-purple-400' : 'text-white/40 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
