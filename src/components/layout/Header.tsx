import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  User, 
  Menu, 
  LogIn, 
  CloudCheck, 
  HardDrive, 
  Radio 
} from 'lucide-react';
import { NavigationTab } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onSearchSubmit: (query: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSearchSubmit,
  onToggleMobileMenu,
}) => {
  const { user, setAuthModalOpen, syncStatus } = usePlayer();
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTab('search');
      onSearchSubmit(searchInput.trim());
    }
  };

  return (
    <header className="h-16 px-4 md:px-8 border-b border-white/5 bg-[#0b0c10]/80 backdrop-blur-md flex items-center justify-between gap-4 z-20 shrink-0">
      {/* Mobile Menu Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 md:hidden"
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
        
        {/* Breadcrumb / Title display */}
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-white/50">
          <span>BitChord</span>
          <span>/</span>
          <span className="text-white capitalize">{activeTab.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search songs, artists, or keywords..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 hover:bg-white/10 focus:bg-[#15161e] border border-white/10 focus:border-purple-500/50 rounded-full text-sm text-white placeholder-white/40 outline-none transition-all shadow-inner"
          />
        </div>
      </form>

      {/* Right Actions: AI Discovery shortcut, Sync Badge, Auth Profile */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setActiveTab('ai-discovery')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles size={13} className="text-purple-300" />
          <span>AI Discovery</span>
        </button>

        {/* Sync Status Badge */}
        <div 
          onClick={() => setAuthModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50 cursor-pointer hover:bg-white/10 transition-colors"
          title="Cloud Sync State"
        >
          {syncStatus === 'synced' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-green-300">Supabase</span>
            </>
          ) : (
            <>
              <HardDrive size={11} className="text-white/40" />
              <span>LocalStorage</span>
            </>
          )}
        </div>

        {/* User Button */}
        <button
          onClick={() => setAuthModalOpen(true)}
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-medium text-white"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <User size={15} className="text-purple-400" />
          )}
          <span className="hidden sm:inline truncate max-w-[100px]">
            {user ? user.displayName : 'Sign In'}
          </span>
        </button>
      </div>
    </header>
  );
};
