import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { X, LogIn, LogOut, Check, HardDrive, Cloud, AlertCircle, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AuthModal: React.FC = () => {
  const {
    user,
    isAuthModalOpen,
    setAuthModalOpen,
    loginWithGoogle,
    logout,
    syncStatus,
  } = usePlayer();

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in could not be initiated.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      setAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Error signing out.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#13141e] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Cloud size={22} className="text-purple-400" />
            <h2 className="font-bold text-base">Account & Cloud Sync</h2>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current status display */}
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold border border-purple-500/30 shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">{user.displayName}</p>
                <p className="text-xs text-white/50 truncate">{user.email || 'Google Account'}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-medium mt-1">
                  <Check size={12} /> Supabase Cloud Sync Connected
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>{isLoading ? 'Signing Out...' : 'Sign Out of Account'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
              <p className="text-xs font-semibold text-purple-200">
                You are currently in Local Guest Mode
              </p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                All your playlists, favorite tracks, and listening history are persistently saved to this browser's LocalStorage.
              </p>
            </div>

            {isSupabaseConfigured() ? (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-xs shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isLoading ? 'Connecting...' : 'Continue with Google Account'}</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white/90 font-semibold">
                  <ShieldCheck size={16} className="text-cyan-400" />
                  <span>Configuring Supabase (Optional)</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  To enable cross-device cloud synchronization and Google OAuth, supply <code className="text-purple-300">VITE_SUPABASE_URL</code> and <code className="text-purple-300">VITE_SUPABASE_ANON_KEY</code> in your environment.
                  Our database migration file is included at <code className="text-purple-300">supabase/schema.sql</code>.
                </p>
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="text-center pt-2">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
