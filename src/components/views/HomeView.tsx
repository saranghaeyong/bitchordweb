import React, { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Play, 
  Sparkles, 
  Flame, 
  Clock, 
  Compass, 
  Headphones, 
  ChevronRight, 
  Heart, 
  Plus 
} from 'lucide-react';
import { Track, Playlist, NavigationTab } from '../../types/music';
import { CURATED_TRACKS, CURATED_PLAYLISTS, POPULAR_ARTISTS } from '../../data/curatedTracks';

interface HomeViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onSearchQuery: (query: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenAddToPlaylist: (track: Track) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onSearchQuery,
  onSelectPlaylist,
  onOpenAddToPlaylist,
}) => {
  const { 
    playTrack, 
    currentTrack, 
    isPlaying, 
    recentlyPlayed, 
    favorites, 
    isFavorite, 
    toggleFavorite,
    playlists,
    user 
  } = usePlayer();

  const [trendingTracks, setTrendingTracks] = useState<Track[]>(CURATED_TRACKS.slice(0, 10));
  const [trendingCategory, setTrendingCategory] = useState<string>('all');
  const [isLoadingTrending, setIsLoadingTrending] = useState<boolean>(false);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch trending tracks from server endpoint
  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoadingTrending(true);
      try {
        const res = await fetch('/api/youtube/trending');
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setTrendingTracks(data.items);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch trending tracks:', err);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Welcome & Quick Access Cards */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950/60 via-[#181926] to-[#12131c] border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles size={13} />
            <span>Welcome to BitChord Web</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {getGreeting()},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {user ? user.displayName : 'Listener'}
            </span>
          </h1>

          <p className="mt-3 text-white/60 text-sm sm:text-base leading-relaxed">
            Stream YouTube music with persistent playlists, zero clutter, and AI sound curation powered by Gemini.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => playTrack(CURATED_TRACKS[0], CURATED_TRACKS)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play size={16} className="fill-white" />
              <span>Quick Play Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-discovery')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-colors"
            >
              <Sparkles size={16} className="text-purple-300" />
              <span>Ask AI Curator</span>
            </button>
          </div>
        </div>

        {/* Quick-Access Grid Cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CURATED_PLAYLISTS.slice(0, 4).map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="group flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/20 cursor-pointer backdrop-blur-md transition-all shadow-md"
            >
              <img
                src={pl.coverUrl}
                alt={pl.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs text-white truncate">{pl.name}</p>
                <p className="text-[11px] text-white/50 truncate">{pl.tracks.length} tracks</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks);
                }}
                className="p-2 rounded-full bg-purple-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 shrink-0"
                title="Play Playlist"
              >
                <Play size={12} className="fill-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Recently Played Carousel (if history exists) */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-purple-400" />
              Recently Played
            </h2>
            <button
              onClick={() => setActiveTab('recent')}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View History</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyPlayed.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => playTrack(item.track)}
                className="group p-3 rounded-2xl bg-[#14151e]/80 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer transition-all flex flex-col"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-white/5">
                  <img
                    src={item.track.thumbnailUrl}
                    alt={item.track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="p-3 rounded-full bg-purple-600 text-white shadow-xl hover:scale-110 transition-transform">
                      <Play size={16} className="fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-xs text-white truncate">{item.track.title}</p>
                <p className="text-[11px] text-white/50 truncate mt-0.5">{item.track.artist}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Trending YouTube Music */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame size={20} className="text-orange-400" />
              Trending Music
            </h2>
            <p className="text-xs text-white/50 mt-0.5">Top-played songs on YouTube worldwide</p>
          </div>

          <button
            onClick={() => playTrack(trendingTracks[0], trendingTracks)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition-colors"
          >
            <Play size={13} className="fill-white" />
            Play All
          </button>
        </div>

        {/* Trending Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trendingTracks.slice(0, 9).map((track, idx) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            const isFav = isFavorite(track.id);

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => playTrack(track, trendingTracks)}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isPlayingThis
                    ? 'bg-purple-900/20 border-purple-500/40'
                    : 'bg-[#13141d]/70 hover:bg-white/10 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5">
                    <img
                      src={track.thumbnailUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play size={14} className="fill-white text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${isPlayingThis ? 'text-purple-300' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-white/50 truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isFav ? 'text-red-500' : 'text-white/30 hover:text-white'
                    }`}
                    title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                  >
                    <Heart size={15} className={isFav ? 'fill-red-500' : ''} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddToPlaylist(track);
                    }}
                    className="p-2 rounded-full text-white/30 hover:text-white transition-colors"
                    title="Add to Playlist"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Popular Artists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Headphones size={20} className="text-cyan-400" />
            Featured Artists
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {POPULAR_ARTISTS.map((artist) => (
            <div
              key={artist.name}
              onClick={() => onSearchQuery(artist.seedSearch)}
              className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#13141d]/70 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer transition-all"
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-xs text-white truncate w-full">{artist.name}</p>
              <p className="text-[11px] text-white/40 truncate w-full mt-0.5">{artist.genre}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Spotlight Curated Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass size={20} className="text-indigo-400" />
            Curated BitChord Playlists
          </h2>
          <button
            onClick={() => setActiveTab('playlists')}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURATED_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="group relative rounded-2xl overflow-hidden bg-[#13141d]/90 border border-white/10 hover:border-purple-500/40 p-4 transition-all cursor-pointer shadow-lg hover:shadow-purple-900/20"
            >
              <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-white/5">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks);
                  }}
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                  title="Play Playlist"
                >
                  <Play size={16} className="fill-white translate-x-0.5" />
                </button>
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                {pl.name}
              </h3>
              <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                {pl.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-white/40 font-mono">
                <span>{pl.tracks.length} songs</span>
                <span>BitChord Official</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
