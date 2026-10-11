import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Search, 
  Play, 
  Plus, 
  Heart, 
  ListPlus, 
  AlertCircle, 
  Loader2, 
  Check, 
  Radio, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { Track } from '../../types/music';

interface SearchViewProps {
  initialQuery?: string;
  onOpenAddToPlaylist: (track: Track) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialQuery = '',
  onOpenAddToPlaylist,
}) => {
  const { 
    playTrack, 
    addToQueue, 
    playNextInQueue, 
    currentTrack, 
    isPlaying, 
    isFavorite, 
    toggleFavorite 
  } = usePlayer();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Quick search suggestion chips
  const suggestions = [
    'Lo-fi Hip Hop',
    'Synthwave Chill',
    'Top Pop Hits 2026',
    'Relaxing Korean Indie',
    'Workout Rock Anthems',
    'Deep Focus Study Beats',
    'Night Drive Vibes',
    'Acoustic Guitar Warmth',
  ];

  const executeSearch = async (searchTerm: string, pageToken?: string) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setNoticeMsg(null);

    try {
      const url = new URL('/api/youtube/search', window.location.origin);
      url.searchParams.set('q', searchTerm);
      if (pageToken) url.searchParams.set('pageToken', pageToken);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok && data.items) {
        if (pageToken) {
          setResults(prev => [...prev, ...data.items]);
        } else {
          setResults(data.items);
        }
        setNextPageToken(data.nextPageToken || null);
        if (data.notice) {
          setNoticeMsg(data.notice);
        }
      } else {
        setErrorMsg(data.message || 'Failed to retrieve search results');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while searching');
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    executeSearch(term);
  };

  const notifyAdded = (msg: string) => {
    setAddedNotice(msg);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header and Input */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Search YouTube Music</h1>
        <p className="text-sm text-white/50 mt-1">
          Search for songs, artists, albums, or curated YouTube tracks with instant playback.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 max-w-2xl flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by song title, artist, or music keyword..."
              className="w-full pl-11 pr-4 py-3 bg-[#13141d] hover:bg-[#181924] focus:bg-[#1a1b28] border border-white/10 focus:border-purple-500 rounded-2xl text-sm text-white placeholder-white/40 outline-none transition-all shadow-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/20 shrink-0"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40 mr-1">Trending:</span>
          {suggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => handleSuggestionClick(sug)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action / Added feedback pill */}
      {addedNotice && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Notices & Fallback Messages */}
      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0 text-amber-400" />
          <p>{noticeMsg}</p>
        </div>
      )}

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/80">
              Results for "{query}" ({results.length})
            </span>
            <button
              onClick={() => playTrack(results[0], results)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-xs text-white font-medium shadow-md transition-all hover:scale-105"
            >
              <Play size={13} className="fill-white" />
              Play All Results
            </button>
          </div>

          <div className="space-y-2">
            {results.map((track, idx) => {
              const isPlayingThis = currentTrack?.id === track.id && isPlaying;
              const isFav = isFavorite(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, results)}
                  className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    isPlayingThis
                      ? 'bg-purple-950/30 border-purple-500/40'
                      : 'bg-[#12131b]/80 hover:bg-white/10 border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="w-5 text-center text-xs font-mono text-white/30 shrink-0">
                      {idx + 1}
                    </span>

                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <img
                        src={track.thumbnailUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play size={14} className="fill-white text-white translate-x-0.5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${isPlayingThis ? 'text-purple-300 font-semibold' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-white/50 truncate mt-0.5">
                        {track.artist}
                        {track.channelTitle && track.channelTitle !== track.artist && (
                          <span className="text-white/30 ml-2">· {track.channelTitle}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration & Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs text-white/40 font-mono hidden sm:inline mr-2">
                      {track.durationFormatted || '3:30'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        isFav ? 'text-red-500' : 'text-white/40 hover:text-white'
                      }`}
                      title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                    >
                      <Heart size={16} className={isFav ? 'fill-red-500' : ''} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue(track);
                        notifyAdded(`Added "${track.title}" to queue`);
                      }}
                      className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      title="Add to Queue"
                    >
                      <ListPlus size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddToPlaylist(track);
                      }}
                      className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      title="Add to Playlist"
                    >
                      <Plus size={16} />
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${track.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-colors hidden md:inline-flex"
                      title="Watch on YouTube"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {nextPageToken && (
            <div className="text-center pt-4">
              <button
                onClick={() => executeSearch(query, nextPageToken)}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                {isLoading ? 'Loading More...' : 'Load More Results'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty Search State */}
      {hasSearched && results.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-[#12131b]/60 rounded-3xl border border-white/5 p-8">
          <Search size={32} className="mx-auto text-white/30 mb-3" />
          <h3 className="text-base font-semibold text-white">No results found for "{query}"</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
            Try searching with broader terms, artist names, or pick from our trending music suggestions above.
          </p>
        </div>
      )}
    </div>
  );
};
