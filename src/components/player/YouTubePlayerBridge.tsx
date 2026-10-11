import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ExternalLink, SkipForward, AlertCircle, Eye, EyeOff, Maximize2 } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayerBridge: React.FC = () => {
  const {
    currentTrack,
    isDockedVideoVisible,
    setDockedVideoVisible,
    setExpandedModalOpen,
    registerYTPlayer,
    handleYTStateChange,
    handleYTError,
    playbackError,
    nextTrack,
  } = usePlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API script if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player || playerRef.current) return;

      playerRef.current = new window.YT.Player('yt-player-target', {
        height: '100%',
        width: '100%',
        videoId: currentTrack ? currentTrack.id : 'jfKfPfyJRdk',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            registerYTPlayer(event.target);
          },
          onStateChange: (event: any) => {
            handleYTStateChange(event.data);
          },
          onError: (event: any) => {
            handleYTError(event.data);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }
  }, [registerYTPlayer, handleYTStateChange, handleYTError]);

  return (
    <>
      {/* Docked official YouTube Player frame - YouTube TOS Compliant */}
      <div
        className={`fixed z-40 transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-[#0f1015] backdrop-blur-md ${
          isDockedVideoVisible
            ? 'bottom-24 right-6 w-80 md:w-96 aspect-video opacity-100 pointer-events-auto scale-100'
            : 'bottom-20 right-4 w-48 h-28 opacity-0 pointer-events-none scale-95'
        }`}
      >
        {/* Header bar for docked player */}
        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-3 text-xs text-white/80">
          <span className="font-medium truncate max-w-[160px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Official YouTube Player
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setExpandedModalOpen(true)}
              className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Expand Now Playing"
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={() => setDockedVideoVisible(false)}
              className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Minimize Video"
            >
              <EyeOff size={13} />
            </button>
          </div>
        </div>

        {/* The YouTube iframe mount point */}
        <div className="w-full h-full" ref={containerRef}>
          <div id="yt-player-target" className="w-full h-full" />
        </div>
      </div>

      {/* Floating Video Visibility Toggle Button */}
      {!isDockedVideoVisible && currentTrack && (
        <button
          onClick={() => setDockedVideoVisible(true)}
          className="fixed bottom-24 right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/90 text-xs font-medium backdrop-blur-md border border-white/10 shadow-lg transition-transform hover:scale-105"
          title="Show YouTube Video Window"
        >
          <Eye size={13} className="text-purple-400" />
          <span>Show Video</span>
        </button>
      )}

      {/* Embedded Playback Error Notification Banner */}
      {playbackError && currentTrack && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-4 rounded-xl bg-[#1c1214] border border-red-500/30 text-white shadow-2xl backdrop-blur-xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-red-200">Embedding Restricted</p>
              <p className="text-white/70 mt-0.5">{playbackError}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 text-xs pt-1 border-t border-white/5">
            <a
              href={`https://www.youtube.com/watch?v=${currentTrack.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
            >
              <ExternalLink size={13} />
              Open on YouTube
            </a>
            <button
              onClick={() => nextTrack()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white font-medium"
            >
              <SkipForward size={13} />
              Skip to Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};
