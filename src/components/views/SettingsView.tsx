import React, { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Settings, 
  Palette, 
  Sliders, 
  Volume2, 
  Trash2, 
  User, 
  Cloud, 
  Key, 
  Keyboard, 
  Check, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { AccentColor, LayoutDensity } from '../../types/music';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const {
    accentColor,
    setAccentColor,
    density,
    setDensity,
    autoPlayNext,
    setAutoPlayNext,
    clearHistory,
    recentlyPlayed,
    user,
    setAuthModalOpen,
    syncStatus,
    logout,
  } = usePlayer();

  const [apiHealth, setApiHealth] = useState<{
    hasGeminiKey: boolean;
    hasYouTubeKey: boolean;
  } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setApiHealth(data))
      .catch(() => setApiHealth(null));
  }, []);

  const accentOptions: { id: AccentColor; label: string; color: string }[] = [
    { id: 'violet', label: 'Charcoal Violet', color: 'bg-purple-500' },
    { id: 'cyan', label: 'Cyberpunk Cyan', color: 'bg-cyan-500' },
    { id: 'emerald', label: 'Emerald Glow', color: 'bg-emerald-500' },
    { id: 'amber', label: 'Sunset Amber', color: 'bg-amber-500' },
    { id: 'rose', label: 'Neon Rose', color: 'bg-rose-500' },
  ];

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause current track' },
    { key: 'J / Shift+Left', desc: 'Previous track or seek to beginning' },
    { key: 'L / Shift+Right', desc: 'Next track in queue' },
    { key: 'M', desc: 'Mute / Unmute audio volume' },
    { key: 'Up / Down', desc: 'Increase / Decrease volume' },
    { key: 'Esc', desc: 'Close full now-playing modal or drawers' },
  ];

  return (
    <div className="space-y-8 max-w-4xl pb-24">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings size={28} className="text-purple-400" />
          Settings & Preferences
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Customize your player aesthetics, audio behavior, and cloud sync credentials.
        </p>
      </div>

      {/* 1. Theme & Accent Customization */}
      <section className="p-6 rounded-3xl bg-[#13141d]/80 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Palette size={18} className="text-purple-400" />
          Accent Theme
        </h2>
        <p className="text-xs text-white/50">
          Select the primary glowing highlight color used across play buttons, seekbars, and active indicators.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          {accentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setAccentColor(opt.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all ${
                accentColor === opt.id
                  ? 'bg-white/15 border-white/40 text-white shadow-md'
                  : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${opt.color} shadow-sm`} />
              <span className="text-xs font-semibold">{opt.label}</span>
              {accentColor === opt.id && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Layout Density */}
      <section className="p-6 rounded-3xl bg-[#13141d]/80 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders size={18} className="text-cyan-400" />
          Layout Density
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          <button
            onClick={() => setDensity('comfortable')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              density === 'comfortable'
                ? 'bg-purple-600/20 border-purple-500/40 text-white'
                : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
            }`}
          >
            <p className="font-semibold text-xs text-white">Comfortable</p>
            <p className="text-[11px] text-white/50 mt-0.5">Spacious cards and rich metadata</p>
          </button>

          <button
            onClick={() => setDensity('compact')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              density === 'compact'
                ? 'bg-purple-600/20 border-purple-500/40 text-white'
                : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
            }`}
          >
            <p className="font-semibold text-xs text-white">Compact</p>
            <p className="text-[11px] text-white/50 mt-0.5">Denser rows for maximum screen real-estate</p>
          </button>
        </div>
      </section>

      {/* 3. Audio & Playback Options */}
      <section className="p-6 rounded-3xl bg-[#13141d]/80 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Volume2 size={18} className="text-green-400" />
          Playback Preferences
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Continuous Autoplay</p>
              <p className="text-[11px] text-white/50">Automatically play the next song in the queue when the current one finishes</p>
            </div>
            <input
              type="checkbox"
              checked={autoPlayNext}
              onChange={(e) => setAutoPlayNext(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* 4. API & Cloud Integration Status */}
      <section className="p-6 rounded-3xl bg-[#13141d]/80 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key size={18} className="text-amber-400" />
          Service Status & Credentials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Gemini AI Status */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">Gemini 3.8 Flash</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${apiHealth?.hasGeminiKey ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span className="text-xs font-semibold text-white">
                {apiHealth?.hasGeminiKey ? 'Active (API Key)' : 'Demo Mode Fallback'}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mt-1">Configured in Secrets/Environment</p>
          </div>

          {/* YouTube Data API v3 Status */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">YouTube Data API</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${apiHealth?.hasYouTubeKey ? 'bg-green-400' : 'bg-purple-400'}`} />
              <span className="text-xs font-semibold text-white">
                {apiHealth?.hasYouTubeKey ? 'Live Google API' : 'Curated Fallback'}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mt-1">Official search & trending queries</p>
          </div>

          {/* Supabase Status */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">Supabase & OAuth</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-green-400' : 'bg-cyan-400'}`} />
              <span className="text-xs font-semibold text-white">
                {isSupabaseConfigured() ? 'Configured' : 'Local Offline Mode'}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mt-1">Row Level Security enabled</p>
          </div>
        </div>
      </section>

      {/* 5. Account & Cloud Data Sync */}
      <section className="p-6 rounded-3xl bg-[#13141d]/80 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User size={18} className="text-purple-400" />
          Account & Cloud Sync
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div>
            <p className="text-xs font-semibold text-white">
              {user ? user.displayName : 'Guest User'}
            </p>
            <p className="text-[11px] text-white/50">
              {user ? user.email || 'Connected with Google OAuth' : 'Playlists & favorites are stored locally in your browser.'}
            </p>
          </div>

          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 text-xs font-semibold transition-colors shrink-0"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors shrink-0"
            >
              Connect Supabase / Sign In
            </button>
          )}
        </div>
      </section>

      {/* 6. Clear History Action */}
      <section className="p-6 rounded-3xl bg-[#13141d]/80 border border-white/5 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Trash2 size={18} className="text-red-400" />
          Data & Privacy
        </h2>
        <p className="text-xs text-white/50">
          Clear your recent listening history ({recentlyPlayed.length} items logged).
        </p>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear your listening history?')) {
              clearHistory();
            }
          }}
          disabled={recentlyPlayed.length === 0}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 disabled:opacity-30 text-white/70 hover:text-red-300 border border-white/10 text-xs font-semibold transition-colors"
        >
          Clear Listening History
        </button>
      </section>

      {/* 7. Keyboard Shortcuts Guide */}
      <section className="p-6 rounded-3xl bg-[#13141d]/80 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Keyboard size={18} className="text-indigo-400" />
          Keyboard Shortcuts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
              <span className="text-white/60">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-black/50 border border-white/10 font-mono text-[11px] text-purple-300">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Open Source & License Attribution */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-white/40 space-y-1">
        <p className="font-semibold text-white/60">BitChord Web Attribution & Compliance</p>
        <p>
          Inspired by the open-source BitChord project (GPL-3.0 by Kushagra Singh). Built with modern React, official YouTube IFrame Player API, and Gemini AI. YouTube video playback preserves official player metadata, controls, and advertising in compliance with YouTube API Developer Policies.
        </p>
      </div>
    </div>
  );
};
