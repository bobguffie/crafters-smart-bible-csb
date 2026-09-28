import React, { useState, useEffect } from 'react';
import { X, Settings, Sparkles, Thermometer, Sun, Moon, Shield, Clock, Trash2, Volume2, Plus, Download, Upload } from 'lucide-react';
import { WorkshopTimer, TimerSoundType } from '../types';
import { playTimerAlertSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempUnit: 'F' | 'C';
  setTempUnit: (unit: 'F' | 'C') => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  highContrast: boolean;
  setHighContrast: (hc: boolean) => void;
  timers: WorkshopTimer[];
  setTimers: React.Dispatch<React.SetStateAction<WorkshopTimer[]>>;
  onOpenExportModal: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tempUnit,
  setTempUnit,
  aiModel,
  setAiModel,
  apiKey,
  setApiKey,
  highContrast,
  setHighContrast,
  timers,
  setTimers,
  onOpenExportModal,
  onImportData,
}) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [savedMsg, setSavedMsg] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'timers' | 'data'>('general');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(localApiKey);
    localStorage.setItem('craft_diary_apikey', localApiKey);
    localStorage.setItem('craft_diary_aimodel', aiModel);
    localStorage.setItem('craft_diary_tempunit', tempUnit);
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 1000);
  };

  const handleUpdateTimerLabel = (id: string, newLabel: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
  };

  const handleUpdateTimerDuration = (id: string, secs: number) => {
    const s = Math.max(1, secs);
    setTimers(prev => prev.map(t => t.id === id ? { ...t, durationSeconds: s, remainingSeconds: s } : t));
  };

  const handleUpdateTimerSound = (id: string, sound: TimerSoundType) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, sound } : t));
    playTimerAlertSound(sound);
  };

  const handleDeleteTimer = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const handleAddDefaultTimer = () => {
    const newTimer: WorkshopTimer = {
      id: `timer-${Date.now()}`,
      label: 'Custom Craft Timer',
      durationSeconds: 60,
      remainingSeconds: 60,
      isRunning: false,
      craftType: 'other',
      createdAt: Date.now(),
      sound: 'chime',
    };
    setTimers(prev => [newTimer, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden transition-all ${
        highContrast ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-amber-50 dark:bg-zinc-900 border-amber-300 text-amber-950 dark:text-amber-100'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          highContrast ? 'border-zinc-800 bg-zinc-950' : 'border-amber-200 bg-amber-100 dark:bg-zinc-900 dark:border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600 animate-spin-slow" />
            <h2 className="font-serif font-bold text-xl">Workshop Settings & Controls</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-amber-200 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="grid grid-cols-3 p-2 bg-amber-100/60 dark:bg-zinc-950 border-b border-amber-200 dark:border-zinc-800 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'general'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-white/70 dark:bg-zinc-900 text-amber-900 dark:text-amber-200 hover:bg-white'
            }`}
          >
            ⚙️ General & AI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timers')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'timers'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-white/70 dark:bg-zinc-900 text-amber-900 dark:text-amber-200 hover:bg-white'
            }`}
          >
            ⏱️ Timers ({timers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'data'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-white/70 dark:bg-zinc-900 text-amber-900 dark:text-amber-200 hover:bg-white'
            }`}
          >
            💾 Data & Backup
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {activeTab === 'general' ? (
            <>
              {/* AI Model Selection */}
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Assistant Model</span>
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                >
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Recommended)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-flash-lite-latest">Gemini Flash Lite</option>
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gemini API Key</span>
                </label>
                <input
                  type="password"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none font-mono ${
                    highContrast ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
                <p className="text-[10px] opacity-70 mt-1">If blank, server environment API key will be used.</p>
              </div>

              {/* Temperature Unit Toggle */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-red-600" />
                  <span>Material Temperature Units</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempUnit('F')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      tempUnit === 'F'
                        ? 'bg-orange-600 text-white border-orange-600 shadow'
                        : 'bg-white/70 dark:bg-zinc-800 border-amber-300 dark:border-zinc-700 opacity-80'
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnit('C')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      tempUnit === 'C'
                        ? 'bg-orange-600 text-white border-orange-600 shadow'
                        : 'bg-white/70 dark:bg-zinc-800 border-amber-300 dark:border-zinc-700 opacity-80'
                    }`}
                  >
                    Celsius (°C)
                  </button>
                </div>
              </div>

              {/* Theme & Contrast Toggles */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">Workshop Theme / Contrast</label>
                <div className="flex items-center justify-between p-3 rounded-xl border border-amber-300/60 dark:border-zinc-700 bg-amber-100/40 dark:bg-zinc-950">
                  <span className="text-xs font-medium">High Contrast Dark Mode</span>
                  <button
                    type="button"
                    onClick={() => setHighContrast(!highContrast)}
                    className={`p-2 rounded-lg border transition ${
                      highContrast ? 'bg-zinc-900 border-zinc-600 text-amber-400' : 'bg-white border-amber-300 text-zinc-700'
                    }`}
                  >
                    {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : activeTab === 'timers' ? (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Active & Saved Workshop Timers</span>
                <button
                  type="button"
                  onClick={handleAddDefaultTimer}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Timer</span>
                </button>
              </div>

              {timers.length === 0 ? (
                <div className="text-center py-8 opacity-60 text-xs">
                  No active timers. Click "Add Timer" above or start timers from material cards!
                </div>
              ) : (
                timers.map((timer) => (
                  <div key={timer.id} className="p-3 rounded-2xl border border-amber-300/60 dark:border-zinc-700 bg-amber-100/30 dark:bg-zinc-950 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                      <input
                        type="text"
                        value={timer.label}
                        onChange={(e) => handleUpdateTimerLabel(timer.id, e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 outline-none"
                        placeholder="Timer label..."
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteTimer(timer.id)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                        title="Delete Timer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] opacity-70 block mb-0.5">Duration (Seconds)</span>
                        <input
                          type="number"
                          value={timer.durationSeconds}
                          onChange={(e) => handleUpdateTimerDuration(timer.id, parseInt(e.target.value) || 1)}
                          className="w-full px-2.5 py-1 rounded-lg font-mono bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] opacity-70 block mb-0.5">Alarm Sound</span>
                        <div className="flex items-center gap-1">
                          <select
                            value={timer.sound || 'chime'}
                            onChange={(e) => handleUpdateTimerSound(timer.id, e.target.value as TimerSoundType)}
                            className="flex-1 px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-amber-300 dark:border-zinc-700 text-xs outline-none"
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
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <p className="text-xs opacity-80 leading-relaxed">
                Manage your workshop database backups. Export libraries or import JSON backups.
              </p>

              <div className="space-y-3">
                {/* Export Options Button (Download Icon) */}
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenExportModal(); }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-amber-300 dark:border-zinc-700 hover:bg-amber-100/50 dark:hover:bg-zinc-900 transition text-left group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 group-hover:scale-110 transition">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Export Workshop Data</div>
                      <div className="text-[10px] opacity-60">Export single card, libraries, or full backup</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-orange-600">Export →</span>
                </button>

                {/* Import JSON Button (Upload Icon) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-amber-300 dark:border-zinc-700 hover:bg-amber-100/50 dark:hover:bg-zinc-900 transition text-left group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Import JSON Backup</div>
                      <div className="text-[10px] opacity-60">Restore or merge craft settings from backup file</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-600">Import →</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={(e) => { onClose(); onImportData(e); }}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {savedMsg && (
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/60 border border-green-300 text-green-700 dark:text-green-300 text-xs font-medium text-center">
              Settings saved successfully!
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow hover:opacity-95 transition"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
