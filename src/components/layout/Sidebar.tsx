import React from 'react';
import { 
  Home, 
  Search, 
  Compass, 
  Library, 
  ListMusic, 
  Heart, 
  History, 
  Sparkles, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Disc, 
  Plus, 
  User, 
  LogIn, 
  CloudCheck, 
  Radio 
} from 'lucide-react';
import { NavigationTab } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenCreatePlaylist: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenCreatePlaylist,
}) => {
  const { 
    playlists, 
    user, 
    setAuthModalOpen, 
    syncStatus, 
    accentColor 
  } = usePlayer();

  const getAccentBg = () => {
    switch (accentColor) {
      case 'cyan': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'emerald': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'amber': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'rose': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'violet':
      default:
        return 'bg-purple-600/20 text-purple-300 border-purple-500/40';
    }
  };

  const navItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'search' as NavigationTab, label: 'Search', icon: Search },
    { id: 'explore' as NavigationTab, label: 'Explore', icon: Compass },
    { id: 'ai-discovery' as NavigationTab, label: 'AI Music Discovery', icon: Sparkles, badge: 'Gemini' },
  ];

  const libraryItems = [
    { id: 'library' as NavigationTab, label: 'Your Library', icon: Library },
    { id: 'playlists' as NavigationTab, label: 'Playlists', icon: ListMusic },
    { id: 'favorites' as NavigationTab, label: 'Favorites', icon: Heart },
    { id: 'recent' as NavigationTab, label: 'Recently Played', icon: History },
  ];

  return (
    <aside
      className={`relative h-full flex flex-col bg-[#0d0e14] border-r border-white/10 select-none transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/20 shrink-0 group-hover:scale-105 transition-transform">
            <Radio className="text-white" size={20} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-extrabold text-base tracking-tight text-white block">
                BitChord<span className="text-purple-400 font-normal">.web</span>
              </span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest block font-mono">
                YouTube Player
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors hidden md:block"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Nav Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Navigation Group 1: Discover */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-2">
              Discover
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? `${getAccentBg()} border shadow-sm`
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon size={19} className={isActive ? 'text-current' : 'text-white/60'} />
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate flex items-center justify-between">
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/30">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Group 2: Library */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Collection
              </span>
              <button
                onClick={onOpenCreatePlaylist}
                className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Create New Playlist"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
          {libraryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? `${getAccentBg()} border shadow-sm`
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon size={19} className={isActive ? 'text-current' : 'text-white/60'} />
                {!isCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Navigation Group 3: Quick User Playlists */}
        {!isCollapsed && playlists.length > 0 && (
          <div className="pt-2 border-t border-white/5 space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-2">
              Your Playlists
            </p>
            <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setActiveTab('playlists')}
                  className="w-full text-left px-3.5 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors truncate block"
                  title={pl.name}
                >
                  {pl.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Settings & Account Bar */}
      <div className="p-3 border-t border-white/10 bg-[#0a0b0e]/70 space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? `${getAccentBg()} border`
              : 'text-white/60 hover:text-white hover:bg-white/5'
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title="Settings"
        >
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {/* Account / Sync Profile Pill */}
        <div
          onClick={() => setAuthModalOpen(true)}
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors ${
            isCollapsed ? 'justify-center p-2' : ''
          }`}
          title={user ? `Signed in as ${user.displayName}` : 'Sign in / Sync'}
        >
          <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center shrink-0 border border-purple-500/30">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={14} className="text-purple-300" />
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">
                {user ? user.displayName : 'Guest User'}
              </p>
              <p className="text-[10px] text-white/40 flex items-center gap-1">
                {syncStatus === 'synced' ? (
                  <span className="text-green-400">Cloud Synced</span>
                ) : (
                  <span>Local Mode</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
