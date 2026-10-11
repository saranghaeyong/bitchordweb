import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Sparkles, 
  Send, 
  Play, 
  Plus, 
  ListPlus, 
  Loader2, 
  Disc, 
  Music, 
  Lightbulb, 
  Heart, 
  FolderPlus, 
  Check 
} from 'lucide-react';
import { AiDiscoveryResult, Track } from '../../types/music';

interface AiDiscoveryViewProps {
  onOpenAddToPlaylist: (track: Track) => void;
  onSearchQuery: (query: string) => void;
}

export const AiDiscoveryView: React.FC<AiDiscoveryViewProps> = ({
  onOpenAddToPlaylist,
  onSearchQuery,
}) => {
  const { 
    playTrack, 
    addToQueue, 
    createPlaylist, 
    addTrackToPlaylist,
    isFavorite, 
    toggleFavorite 
  } = usePlayer();

  const [prompt, setPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiDiscoveryResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [playlistCreatedSuccess, setPlaylistCreatedSuccess] = useState<boolean>(false);

  const moodPresets = [
    { label: 'Chill & Relaxing', value: 'relaxing, peaceful, acoustic' },
    { label: 'Energetic Gym Workout', value: 'high tempo, motivating, heavy bass workout' },
    { label: 'Late Night Coding', value: 'focused, lo-fi, synth ambient, no lyrics' },
    { label: 'Korean Indie Cafe', value: 'Korean indie, acoustic guitar, gentle vocals' },
    { label: 'Cyberpunk Synthwave', value: 'dark retro synthwave, 80s arpeggio, highway drive' },
    { label: 'Melancholic Rainy Evening', value: 'melancholic piano, rainy day jazz, nostalgia' },
  ];

  const handleDiscover = async (customPrompt?: string, mood?: string, genre?: string) => {
    const activePrompt = customPrompt !== undefined ? customPrompt : prompt;
    const activeMood = mood !== undefined ? mood : selectedMood;
    const activeGenre = genre !== undefined ? genre : selectedGenre;

    if (!activePrompt.trim() && !activeMood && !activeGenre) return;

    setIsLoading(true);
    setErrorMsg(null);
    setPlaylistCreatedSuccess(false);

    try {
      const res = await fetch('/api/ai/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          mood: activeMood,
          genre: activeGenre,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setErrorMsg(data.message || 'AI discovery generation failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred while calling AI discovery.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylistFromAi = () => {
    if (!result) return;
    const newPl = createPlaylist(result.playlistName, result.playlistDescription);
    const validTracks = result.suggestedTracks
      .map(s => s.track)
      .filter((t): t is Track => Boolean(t));

    validTracks.forEach(t => {
      addTrackToPlaylist(newPl.id, t);
    });

    setPlaylistCreatedSuccess(true);
    setTimeout(() => setPlaylistCreatedSuccess(false), 4000);
  };

  const handlePlayAllAiTracks = () => {
    if (!result) return;
    const tracks = result.suggestedTracks
      .map(s => s.track)
      .filter((t): t is Track => Boolean(t));

    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-purple-950/70 via-[#181926] to-[#11121d] border border-purple-500/20 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles size={13} />
            <span>Gemini AI Music Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discover Music by Mood & Natural Language
          </h1>

          <p className="mt-2 text-white/60 text-sm leading-relaxed">
            Describe how you want to feel, what you're working on, or the exact vibe you need.
            Gemini synthesizes curatorial selections and generates instant playlists.
          </p>
        </div>

        {/* Input box */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 max-w-3xl">
          <div className="relative w-full">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
              placeholder="e.g. 'Recommend relaxing Korean indie songs for a rainy Sunday morning'..."
              className="w-full px-5 py-3.5 bg-black/40 hover:bg-black/60 focus:bg-[#151622] border border-white/10 focus:border-purple-500 rounded-2xl text-sm text-white placeholder-white/40 outline-none transition-all shadow-inner"
            />
          </div>
          <button
            onClick={() => handleDiscover()}
            disabled={isLoading || (!prompt.trim() && !selectedMood)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={16} />
                <span>Curate</span>
              </>
            )}
          </button>
        </div>

        {/* Mood Inspiration Presets */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-xs font-semibold text-white/50 mb-2.5 flex items-center gap-1.5">
            <Lightbulb size={13} />
            <span>Try these prompt concepts:</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {moodPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setPrompt(preset.label);
                  handleDiscover(preset.label, preset.value);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-white/80 hover:text-white transition-all shadow-sm"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-12 text-center bg-[#13141d]/60 rounded-3xl border border-white/5 space-y-4">
          <Loader2 size={36} className="animate-spin text-purple-400 mx-auto" />
          <p className="text-sm font-medium text-white">Gemini is curating your personalized soundscape...</p>
          <p className="text-xs text-white/40">Analyzing sonic characteristics, artist affiliations, and mood tags.</p>
        </div>
      )}

      {/* AI Discovery Results View */}
      {result && !isLoading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Curator commentary panel */}
          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/30 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400">
                  Concept: {result.suggestedTheme}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {result.playlistName}
                </h2>
                <p className="text-xs text-white/70 mt-1 max-w-xl">
                  {result.playlistDescription}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handlePlayAllAiTracks}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                >
                  <Play size={14} className="fill-white" />
                  <span>Play Mix</span>
                </button>

                <button
                  onClick={handleCreatePlaylistFromAi}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
                >
                  {playlistCreatedSuccess ? (
                    <>
                      <Check size={14} className="text-green-400" />
                      <span className="text-green-300">Saved to Playlists!</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus size={14} />
                      <span>Save as Playlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Curator Thought Note */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-xs text-purple-200/90 italic leading-relaxed">
              "{result.thought}"
            </div>
          </div>

          {/* Suggested Songs Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Disc size={18} className="text-purple-400" />
              Recommended Tracks ({result.suggestedTracks.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.suggestedTracks.map((item, idx) => {
                const track = item.track;
                const isFav = track ? isFavorite(track.id) : false;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#13141d]/80 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {track ? (
                          <img
                            src={track.thumbnailUrl}
                            alt={track.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0">
                            <Music size={20} className="text-purple-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-white truncate">{item.title}</p>
                          <p className="text-xs text-white/50 truncate">{item.artist}</p>
                        </div>
                      </div>

                      {track && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleFavorite(track)}
                            className={`p-2 rounded-full transition-colors ${
                              isFav ? 'text-red-500' : 'text-white/40 hover:text-white'
                            }`}
                            title="Favorite"
                          >
                            <Heart size={15} className={isFav ? 'fill-red-500' : ''} />
                          </button>
                          <button
                            onClick={() => addToQueue(track)}
                            className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10"
                            title="Add to queue"
                          >
                            <ListPlus size={15} />
                          </button>
                          <button
                            onClick={() => playTrack(track)}
                            className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white"
                            title="Play Track"
                          >
                            <Play size={14} className="fill-white translate-x-0.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed">
                      {item.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.moodTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/50 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Similar Artists */}
          {result.similarArtists && result.similarArtists.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#13141d]/60 border border-white/5 space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-white/50">
                Related Artists & Sonic Neighbors
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.similarArtists.map((artistName) => (
                  <button
                    key={artistName}
                    onClick={() => onSearchQuery(`${artistName} official music`)}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/10 text-xs text-white transition-colors"
                  >
                    {artistName} →
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
