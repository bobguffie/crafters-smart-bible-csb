import React from 'react';
import { Search, Plus, Sparkles, Clock, Sun, Moon, Settings } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  highContrast: boolean;
  setHighContrast: (hc: boolean) => void;
  onOpenNewCard: () => void;
  onOpenAiModal: () => void;
  onToggleTimerDrawer: () => void;
  activeTimersCount: number;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  highContrast,
  setHighContrast,
  onOpenNewCard,
  onOpenAiModal,
  onToggleTimerDrawer,
  activeTimersCount,
  onOpenSettings,
}) => {
  return (
    <header className={`sticky top-0 z-30 border-b transition-colors duration-200 ${
      highContrast 
        ? 'bg-black border-zinc-800 text-white' 
        : 'bg-amber-50/90 dark:bg-zinc-900/90 backdrop-blur-md border-amber-200/60 dark:border-zinc-800 text-amber-950 dark:text-amber-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md border-2 border-orange-500/40 shrink-0 bg-zinc-950">
              <img 
                src="/src/assets/images/csb_logo_1790625699747.jpg" 
                alt="CSB Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg md:text-xl font-bold tracking-tight">
                  Crafters Smart Bible
                </h1>
                <span className="px-1.5 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-mono font-black tracking-wider">
                  CSB
                </span>
              </div>
              <p className="text-[11px] opacity-75 font-mono">Rolodex Workshop Database & Timers</p>
            </div>
          </div>

          {/* Mobile Action Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <PWAInstallButton highContrast={highContrast} />
            <button
              onClick={onToggleTimerDrawer}
              className="relative p-2 rounded-lg bg-orange-600 text-white shadow hover:bg-orange-700 transition"
              title="Workshop Timers"
            >
              <Clock className="w-5 h-5" />
              {activeTimersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {activeTimersCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-800 transition"
              title="Workshop Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials, tags, temps, speeds..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-medium transition outline-none border ${
              highContrast
                ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:border-amber-400'
                : 'bg-white/80 dark:bg-zinc-800 border-amber-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:border-orange-500 shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow hover:opacity-95 transition transform active:scale-95"
            title="Ask AI for Craft Parameters"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={onOpenNewCard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow hover:opacity-95 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Card</span>
          </button>

          {/* Desktop Timer Toggle */}
          <button
            onClick={onToggleTimerDrawer}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-orange-600 text-white shadow hover:bg-orange-700 transition relative"
          >
            <Clock className="w-4 h-4" />
            <span>Timers</span>
            {activeTimersCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse ml-0.5">
                {activeTimersCount}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 border-l border-amber-300 dark:border-zinc-700 pl-2">
            <PWAInstallButton highContrast={highContrast} />
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-amber-200/60 dark:bg-zinc-800 hover:bg-amber-200 dark:hover:bg-zinc-700 text-amber-950 dark:text-amber-100 transition flex items-center gap-1.5 font-semibold text-xs shadow-sm border border-amber-300 dark:border-zinc-700"
              title="Workshop Settings Cog"
            >
              <Settings className="w-4 h-4 text-orange-600" />
              <span>Settings</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
