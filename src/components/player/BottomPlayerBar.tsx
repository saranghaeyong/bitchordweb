import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Heart, 
  ListMusic, 
  Maximize2, 
  Plus, 
  Video 
} from 'lucide-react';

interface BottomPlayerBarProps {
  onOpenAddToPlaylist?: () => void;
}

export const BottomPlayerBar: React.FC<BottomPlayerBarProps> = ({ onOpenAddToPlaylist }) => {
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
    isQueueOpen,
    setQueueOpen,
    isDockedVideoVisible,
    setDockedVideoVisible,
    setExpandedModalOpen,
    accentColor,
  } = usePlayer();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentDisplayTime = isSeeking ? seekValue : currentTime;
  const progressPercent = duration > 0 ? (currentDisplayTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekValue(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
    seekTo(seekValue);
  };

  const isFav = currentTrack ? isFavorite(currentTrack.id) : false;

  const getAccentGradient = () => {
    switch (accentColor) {
      case 'cyan': return 'from-cyan-500 to-blue-500';
      case 'emerald': return 'from-emerald-500 to-teal-500';
      case 'amber': return 'from-amber-500 to-orange-500';
      case 'rose': return 'from-rose-500 to-pink-500';
      case 'violet':
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  const getAccentText = () => {
    switch (accentColor) {
      case 'cyan': return 'text-cyan-400';
      case 'emerald': return 'text-emerald-400';
      case 'amber': return 'text-amber-400';
      case 'rose': return 'text-rose-400';
      case 'violet':
      default:
        return 'text-purple-400';
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 h-20 bg-[#121319]/90 backdrop-blur-2xl border-t border-white/10 z-40 px-4 md:px-6 flex items-center justify-between select-none shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      {/* 1. Track Info (Left) */}
      <div className="flex items-center gap-3.5 min-w-0 w-1/4 max-w-[280px]">
        <div 
          onClick={() => setExpandedModalOpen(true)}
          className="relative group cursor-pointer w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10 shadow-md"
        >
          <img
            src={currentTrack.thumbnailUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 size={16} className="text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p 
            onClick={() => setExpandedModalOpen(true)}
            className="font-medium text-sm text-white/95 truncate hover:underline cursor-pointer"
            title={currentTrack.title}
          >
            {currentTrack.title}
          </p>
          <p className="text-xs text-white/50 truncate hover:text-white/80 transition-colors">
            {currentTrack.artist}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => toggleFavorite(currentTrack)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
              isFav ? 'text-red-500 fill-red-500' : 'text-white/50 hover:text-white'
            }`}
            title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
          >
            <Heart size={18} className={isFav ? 'fill-red-500' : ''} />
          </button>
          {onOpenAddToPlaylist && (
            <button
              onClick={onOpenAddToPlaylist}
              className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Add to Playlist"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Controls & Seekbar (Center) */}
      <div className="flex flex-col items-center justify-center max-w-xl w-full px-2">
        {/* Buttons */}
        <div className="flex items-center gap-3 md:gap-4 mb-1">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-colors ${
              isShuffled ? getAccentText() : 'text-white/50 hover:text-white'
            }`}
            title={isShuffled ? 'Shuffle On' : 'Shuffle Off'}
          >
            <Shuffle size={16} />
          </button>

          <button
            onClick={previousTrack}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            title="Previous Track"
          >
            <SkipBack size={19} />
          </button>

          <button
            onClick={togglePlay}
            disabled={isBuffering}
            className={`p-3 rounded-full bg-gradient-to-r ${getAccentGradient()} text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isBuffering ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={19} className="fill-white" />
            ) : (
              <Play size={19} className="fill-white translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            title="Next Track"
          >
            <SkipForward size={19} />
          </button>

          <button
            onClick={cycleRepeat}
            className={`p-2 rounded-full transition-colors relative ${
              repeatMode !== 'off' ? getAccentText() : 'text-white/50 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}
          </button>
        </div>

        {/* Seekbar */}
        <div className="flex items-center gap-2.5 w-full max-w-md text-[11px] text-white/40 font-mono">
          <span className="w-8 text-right shrink-0">{formatTime(currentDisplayTime)}</span>
          <div className="relative flex-1 flex items-center group py-1 cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentDisplayTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onTouchStart={handleSeekMouseDown}
              onTouchEnd={handleSeekMouseUp}
              className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-purple-400 group-hover:h-1.5 transition-all"
              style={{
                background: `linear-gradient(to right, #a855f7 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
              }}
            />
          </div>
          <span className="w-8 shrink-0">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Utility Actions & Volume (Right) */}
      <div className="flex items-center justify-end gap-2.5 w-1/4 max-w-[280px]">
        {/* Toggle Docked Video */}
        <button
          onClick={() => setDockedVideoVisible(!isDockedVideoVisible)}
          className={`p-2 rounded-full transition-colors ${
            isDockedVideoVisible ? getAccentText() : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title={isDockedVideoVisible ? 'Hide Mini Video' : 'Show Mini Video'}
        >
          <Video size={18} />
        </button>

        {/* Toggle Queue */}
        <button
          onClick={() => setQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-full transition-colors relative ${
            isQueueOpen ? getAccentText() : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Playback Queue"
        >
          <ListMusic size={18} />
          {queue.length > 0 && (
            <span className="absolute 1 top-1.5 right-1 w-2 h-2 rounded-full bg-purple-500" />
          )}
        </button>

        {/* Volume Slider */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={17} />
            ) : volume < 50 ? (
              <Volume1 size={17} />
            ) : (
              <Volume2 size={17} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
            style={{
              background: `linear-gradient(to right, #a855f7 ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%)`
            }}
          />
        </div>

        {/* Fullscreen Expanded Modal */}
        <button
          onClick={() => setExpandedModalOpen(true)}
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="Full View"
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </div>
  );
};
