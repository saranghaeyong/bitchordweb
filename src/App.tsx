import React, { useState, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { NavigationTab, Playlist, Track } from './types/music';

// Layout & Player Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomPlayerBar } from './components/player/BottomPlayerBar';
import { YouTubePlayerBridge } from './components/player/YouTubePlayerBridge';
import { ExpandedPlayerModal } from './components/player/ExpandedPlayerModal';
import { QueueDrawer } from './components/player/QueueDrawer';

// Views
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { ExploreView } from './components/views/ExploreView';
import { LibraryView } from './components/views/LibraryView';
import { PlaylistsView } from './components/views/PlaylistsView';
import { FavoritesView } from './components/views/FavoritesView';
import { RecentlyPlayedView } from './components/views/RecentlyPlayedView';
import { AiDiscoveryView } from './components/views/AiDiscoveryView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { AddToPlaylistModal } from './components/modals/AddToPlaylistModal';
import { CreatePlaylistModal } from './components/modals/CreatePlaylistModal';
import { AuthModal } from './components/modals/AuthModal';

const MainAppContent: React.FC = () => {
  const { 
    togglePlay, 
    nextTrack, 
    previousTrack, 
    toggleMute, 
    setExpandedModalOpen,
    isExpandedModalOpen,
    density 
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search query state for cross-navigation
  const [searchQuery, setSearchQuery] = useState('');

  // Selected playlist state for playlist detail view
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Modal states
  const [trackForPlaylistModal, setTrackForPlaylistModal] = useState<Track | null>(null);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(targetTag)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        previousTrack();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        nextTrack();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setExpandedModalOpen(!isExpandedModalOpen);
      } else if (e.key === 'Escape') {
        setExpandedModalOpen(false);
        setIsMobileMenuOpen(false);
        setTrackForPlaylistModal(null);
        setIsCreatePlaylistOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, previousTrack, nextTrack, toggleMute, isExpandedModalOpen, setExpandedModalOpen]);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
    setIsMobileMenuOpen(false);
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setActiveTab('playlists');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0c10] text-[#f0f2f5] font-sans antialiased select-none">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'playlists') setSelectedPlaylist(null);
          }}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-[#0d0e14]">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                if (tab !== 'playlists') setSelectedPlaylist(null);
                setIsMobileMenuOpen(false);
              }}
              isCollapsed={false}
              setIsCollapsed={() => {}}
              onOpenCreatePlaylist={() => {
                setIsMobileMenuOpen(false);
                setIsCreatePlaylistOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSearchSubmit={handleSearchSubmit}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Scrollable View Container */}
        <main
          className={`flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-6 scroll-smooth ${
            density === 'compact' ? 'space-y-4' : 'space-y-8'
          }`}
        >
          {activeTab === 'home' && (
            <HomeView
              setActiveTab={setActiveTab}
              onSearchQuery={handleSearchSubmit}
              onSelectPlaylist={handleSelectPlaylist}
              onOpenAddToPlaylist={(track) => setTrackForPlaylistModal(track)}
            />
          )}

          {activeTab === 'search' && (
            <SearchView
              initialQuery={searchQuery}
              onOpenAddToPlaylist={(track) => setTrackForPlaylistModal(track)}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreView
              onSelectPlaylist={handleSelectPlaylist}
              onSearchQuery={handleSearchSubmit}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              setActiveTab={setActiveTab}
              onSelectPlaylist={handleSelectPlaylist}
              onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
              onOpenAddToPlaylist={(track) => setTrackForPlaylistModal(track)}
            />
          )}

          {activeTab === 'playlists' && (
            <PlaylistsView
              selectedPlaylist={selectedPlaylist}
              setSelectedPlaylist={setSelectedPlaylist}
              onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesView
              onOpenAddToPlaylist={(track) => setTrackForPlaylistModal(track)}
            />
          )}

          {activeTab === 'recent' && (
            <RecentlyPlayedView
              onOpenAddToPlaylist={(track) => setTrackForPlaylistModal(track)}
            />
          )}

          {activeTab === 'ai-discovery' && (
            <AiDiscoveryView
              onOpenAddToPlaylist={(track) => setTrackForPlaylistModal(track)}
              onSearchQuery={handleSearchSubmit}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Persistent Bottom Player Bar */}
        <BottomPlayerBar
          onOpenAddToPlaylist={() => {
            // Add current track to playlist
          }}
        />
      </div>

      {/* Official YouTube IFrame Player Bridge */}
      <YouTubePlayerBridge />

      {/* Expanded Now Playing Modal */}
      <ExpandedPlayerModal />

      {/* Queue Drawer */}
      <QueueDrawer />

      {/* Add To Playlist Modal */}
      {trackForPlaylistModal && (
        <AddToPlaylistModal
          track={trackForPlaylistModal}
          onClose={() => setTrackForPlaylistModal(null)}
        />
      )}

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onPlaylistCreated={(newPl) => {
          setSelectedPlaylist(newPl);
          setActiveTab('playlists');
        }}
      />

      {/* Supabase Google Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <MainAppContent />
    </PlayerProvider>
  );
}
