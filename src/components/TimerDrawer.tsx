import React, { useState, useEffect } from 'react';
import { WorkshopTimer, CraftCategory, TimerSoundType } from '../types';
import { Clock, Play, Pause, RotateCcw, X, Plus, Bell, Volume2, Settings } from 'lucide-react';
import { playTimerAlertSound } from '../utils/audio';

interface TimerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  timers: WorkshopTimer[];
  setTimers: React.Dispatch<React.SetStateAction<WorkshopTimer[]>>;
  highContrast: boolean;
  onOpenSettings?: () => void;
}

export const TimerDrawer: React.FC<TimerDrawerProps> = ({
  isOpen,
  onClose,
  timers,
  setTimers,
  highContrast,
  onOpenSettings,
}) => {
  const [customLabel, setCustomLabel] = useState('');
  const [customSeconds, setCustomSeconds] = useState(60);

  // Countdown timer tick interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((t) => {
          if (!t.isRunning) return t;
          if (t.remainingSeconds <= 1) {
            playTimerAlertSound(t.sound || 'chime');
            return { ...t, remainingSeconds: 0, isRunning: false };
          }
          return { ...t, remainingSeconds: t.remainingSeconds - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [setTimers]);

  const handleToggleTimer = (id: string) => {
    setTimers(prev =>
      prev.map(t => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const handleResetTimer = (id: string) => {
    setTimers(prev =>
      prev.map(t => (t.id === id ? { ...t, remainingSeconds: t.durationSeconds, isRunning: false } : t))
    );
  };

  const handleDeleteTimer = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTimerSound = (id: string, sound: TimerSoundType) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, sound } : t));
    playTimerAlertSound(sound);
  };

  const handleAddCustomTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim() || customSeconds <= 0) return;

    const newTimer: WorkshopTimer = {
      id: `timer-${Date.now()}`,
      label: customLabel.trim(),
      durationSeconds: Number(customSeconds),
      remainingSeconds: Number(customSeconds),
      isRunning: true,
      craftType: 'other',
      createdAt: Date.now(),
      sound: 'chime',
    };

    setTimers(prev => [newTimer, ...prev]);
    setCustomLabel('');
    setCustomSeconds(60);
  };

  const handleAddPreset = (label: string, seconds: number, category: CraftCategory) => {
    const newTimer: WorkshopTimer = {
      id: `timer-${Date.now()}-${Math.random()}`,
      label,
      durationSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: true,
      craftType: category,
      createdAt: Date.now(),
      sound: 'chime',
    };
    setTimers(prev => [newTimer, ...prev]);
  };

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className={`w-full max-w-md h-full flex flex-col shadow-2xl transition-transform duration-300 ${
        highContrast ? 'bg-zinc-950 text-white border-l border-zinc-800' : 'bg-amber-50 dark:bg-zinc-900 text-amber-950 dark:text-amber-100 border-l border-amber-200'
      }`}>
        
        {/* Drawer Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          highContrast ? 'border-zinc-800 bg-zinc-900' : 'border-amber-200 bg-amber-100 dark:bg-zinc-900 dark:border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="font-serif font-bold text-lg">Workshop Timers & Sound Settings</h2>
          </div>
          <div className="flex items-center gap-1">
            {onOpenSettings && (
              <button
                onClick={() => { onClose(); onOpenSettings(); }}
                className="p-2 rounded-xl hover:bg-amber-200 dark:hover:bg-zinc-800 transition flex items-center gap-1 text-xs font-semibold"
                title="Timer Settings"
              >
                <Settings className="w-4 h-4 text-orange-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-amber-200 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Presets Quick-Click Bar */}
        <div className="p-4 border-b border-amber-200 dark:border-zinc-800 bg-amber-100/40 dark:bg-zinc-900/50">
          <span className="text-xs font-mono font-bold uppercase opacity-75 block mb-2">
            ⚡ Quick Craft Presets
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddPreset('Shirt Press (Sublimation)', 45, 'sublimation')}
              className="p-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 text-purple-900 dark:text-purple-200 hover:bg-purple-50 transition text-left"
            >
              👕 45s Shirt Press
            </button>
            <button
              onClick={() => handleAddPreset('Tumbler Wrap (Sublimation)', 60, 'sublimation')}
              className="p-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 text-purple-900 dark:text-purple-200 hover:bg-purple-50 transition text-left"
            >
              🥤 60s Tumbler Wrap
            </button>
            <button
              onClick={() => handleAddPreset('Mug Wrap (Sublimation)', 180, 'sublimation')}
              className="p-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 text-purple-900 dark:text-purple-200 hover:bg-purple-50 transition text-left"
            >
              ☕ 180s Mug Wrap
            </button>
            <button
              onClick={() => handleAddPreset('Bed Cooldown (3D Print)', 300, '3d_printing')}
              className="p-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-cyan-200 dark:border-zinc-700 text-cyan-900 dark:text-cyan-200 hover:bg-cyan-50 transition text-left"
            >
              🧊 300s Bed Cooldown
            </button>
            <button
              onClick={() => handleAddPreset('Laser Smoke Vent (Laser)', 40, 'laser_cutter')}
              className="p-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-200 hover:bg-slate-100 transition text-left"
            >
              💨 40s Laser Vent
            </button>
            <button
              onClick={() => handleAddPreset('UV Resin Cure (Other)', 480, 'other')}
              className="p-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-orange-200 dark:border-zinc-700 text-orange-900 dark:text-orange-200 hover:bg-orange-50 transition text-left"
            >
              ☀️ 480s UV Cure
            </button>
          </div>
        </div>

        {/* Custom Timer Add Form */}
        <form onSubmit={handleAddCustomTimer} className="p-4 border-b border-amber-200 dark:border-zinc-800 space-y-3">
          <span className="text-xs font-mono font-bold uppercase opacity-75 block">
            Add Custom Timer
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Timer label (e.g., Acrylic Bake)"
              className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${
                highContrast
                  ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500'
                  : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100'
              }`}
            />
            <input
              type="number"
              min="1"
              max="3600"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(Number(e.target.value))}
              className={`w-20 px-3 py-2 rounded-xl text-xs border outline-none font-mono ${
                highContrast
                  ? 'bg-zinc-900 border-zinc-700 text-white'
                  : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100'
              }`}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Timers Active List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {timers.length === 0 ? (
            <div className="text-center py-12 opacity-50 space-y-2">
              <Clock className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-sm font-medium">No active timers running.</p>
              <p className="text-xs">Select a preset or start a timer from any card!</p>
            </div>
          ) : (
            timers.map((timer) => {
              const isFinished = timer.remainingSeconds === 0;

              return (
                <div
                  key={timer.id}
                  className={`p-4 rounded-2xl border transition shadow-sm space-y-3 ${
                    isFinished
                      ? 'bg-red-600 text-white border-red-500 animate-bounce'
                      : highContrast
                      ? 'bg-zinc-900 border-zinc-800 text-white'
                      : 'bg-white dark:bg-zinc-800 border-amber-200 dark:border-zinc-700 text-amber-950 dark:text-amber-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono opacity-75 uppercase block">
                        {timer.craftType.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-sm tracking-tight">{timer.label}</h4>
                      <div className={`text-2xl font-mono font-black ${isFinished ? 'text-yellow-300' : 'text-orange-600 dark:text-orange-400'}`}>
                        {formatTime(timer.remainingSeconds)}
                        {isFinished && <Bell className="w-5 h-5 inline ml-2 animate-spin" />}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleTimer(timer.id)}
                        className={`p-2.5 rounded-xl transition ${
                          isFinished 
                            ? 'bg-white text-red-600 hover:bg-zinc-100' 
                            : timer.isRunning 
                            ? 'bg-amber-200 text-amber-900 hover:bg-amber-300' 
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                        title={timer.isRunning ? 'Pause' : 'Resume'}
                      >
                        {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleResetTimer(timer.id)}
                        className="p-2.5 rounded-xl hover:bg-amber-100 dark:hover:bg-zinc-700 transition"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTimer(timer.id)}
                        className="p-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 text-red-500 transition"
                        title="Remove Timer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sound Selector Row */}
                  <div className="pt-2 border-t border-amber-200/50 dark:border-zinc-700 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] opacity-75 font-mono">Alarm Sound:</span>
                    <div className="flex items-center gap-1 flex-1 max-w-[220px]">
                      <select
                        value={timer.sound || 'chime'}
                        onChange={(e) => handleUpdateTimerSound(timer.id, e.target.value as TimerSoundType)}
                        className="flex-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-700 text-xs outline-none"
                      >
                        <option value="chime">Chime (Chord)</option>
                        <option value="beep">Electronic Beep</option>
                        <option value="bell">Workshop Bell</option>
                        <option value="digital">Digital Watch</option>
                        <option value="gong">Deep Gong</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => playTimerAlertSound(timer.sound || 'chime')}
                        className="p-1.5 rounded-lg bg-orange-100 dark:bg-zinc-800 text-orange-700 dark:text-orange-300 hover:bg-orange-200 transition"
                        title="Test Sound"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
