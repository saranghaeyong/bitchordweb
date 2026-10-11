import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Sparkles, 
  Play, 
  Radio, 
  Flame, 
  Compass, 
  Coffee, 
  Zap, 
  Headphones, 
  Disc3, 
  TrendingUp 
} from 'lucide-react';
import { CURATED_PLAYLISTS, CURATED_TRACKS, EXPLORE_CATEGORIES } from '../../data/curatedTracks';
import { Playlist } from '../../types/music';

interface ExploreViewProps {
  onSelectPlaylist: (playlist: Playlist) => void;
  onSearchQuery: (query: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectPlaylist,
  onSearchQuery,
}) => {
  const { playTrack } = usePlayer();

  const moodStations = [
    {
      title: 'Deep Coding & Flow',
      subtitle: 'Pure instrumental beats & synth textures without vocal distractions',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-purple-900/80 to-indigo-950/80',
      tracks: [CURATED_TRACKS[0], CURATED_TRACKS[8], CURATED_TRACKS[22]],
    },
    {
      title: 'Midnight Synth Drive',
      subtitle: 'Cruising under neon billboards with retro 80s arpeggios',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-cyan-900/80 to-blue-950/80',
      tracks: [CURATED_TRACKS[8], CURATED_TRACKS[9], CURATED_TRACKS[10]],
    },
    {
      title: 'Heavy Workout Iron',
      subtitle: 'High BPM explosive tracks to crush heavy lifts and endurance',
      cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-red-900/80 to-amber-950/80',
      tracks: [CURATED_TRACKS[13], CURATED_TRACKS[14], CURATED_TRACKS[15]],
    },
    {
      title: 'Coffeehouse Acoustic',
      subtitle: 'Gentle acoustic guitars and rain tapping on the window glass',
      cover: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-amber-900/80 to-stone-950/80',
      tracks: [CURATED_TRACKS[2], CURATED_TRACKS[1], CURATED_TRACKS[5]],
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Explore & Discover</h1>
        <p className="text-sm text-white/50 mt-1">
          Hand-crafted soundscapes, high-energy radio stations, and musical genres.
        </p>
      </div>

      {/* Featured Mood Stations */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap size={18} className="text-purple-400" />
          Featured Mood Stations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {moodStations.map((station, idx) => (
            <div
              key={idx}
              onClick={() => playTrack(station.tracks[0], station.tracks)}
              className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 p-6 flex flex-col justify-between min-h-[200px] cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01]"
            >
              {/* Background image & gradient */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${station.cover})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${station.gradient} backdrop-blur-[2px]`} />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  Station {idx + 1}
                </span>
                <h3 className="text-xl font-extrabold text-white">{station.title}</h3>
                <p className="text-xs text-white/70 max-w-sm mt-1 leading-relaxed">
                  {station.subtitle}
                </p>
              </div>

              <div className="relative z-10 pt-4 flex items-center justify-between">
                <span className="text-xs font-mono text-white/60">{station.tracks.length} continuous tracks</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(station.tracks[0], station.tracks);
                  }}
                  className="p-3 rounded-full bg-white text-black shadow-xl hover:scale-110 active:scale-95 transition-all"
                >
                  <Play size={16} className="fill-black translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Genre Pills & Exploration */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Compass size={18} className="text-cyan-400" />
          Browse by Genre
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {EXPLORE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSearchQuery(cat.name)}
              className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} opacity-90 hover:opacity-100 border border-white/10 cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white flex flex-col justify-between h-28`}
            >
              <span className="text-xs font-bold tracking-tight">{cat.name}</span>
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span>Explore</span>
                <Play size={12} className="fill-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BitChord Official Playlists */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-green-400" />
          Featured BitChord Playlists
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CURATED_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="group p-3.5 rounded-2xl bg-[#13141d]/70 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer transition-all flex flex-col"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-white/5">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks);
                  }}
                  className="absolute bottom-2 right-2 p-2.5 rounded-full bg-purple-600 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <Play size={14} className="fill-white translate-x-0.5" />
                </button>
              </div>

              <h4 className="font-semibold text-xs text-white truncate">{pl.name}</h4>
              <p className="text-[11px] text-white/40 truncate mt-0.5">{pl.tracks.length} tracks</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
