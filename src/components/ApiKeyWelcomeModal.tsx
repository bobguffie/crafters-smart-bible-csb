import React from 'react';
import { Settings, Sparkles, KeyRound, ArrowRight, X } from 'lucide-react';

interface ApiKeyWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  highContrast: boolean;
}

export const ApiKeyWelcomeModal: React.FC<ApiKeyWelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  highContrast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden transition-all ${
        highContrast
          ? 'bg-zinc-950 border-zinc-700 text-white'
          : 'bg-white dark:bg-zinc-900 border-amber-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
      }`}>
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg mb-3">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-serif font-black text-2xl tracking-tight">Crafters Smart Bible</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-xs font-mono font-semibold mt-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Gemini AI Craft Assistant</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
            highContrast
              ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
              : 'bg-amber-50/80 dark:bg-zinc-800/60 border-amber-200 dark:border-zinc-700 text-amber-950 dark:text-amber-100'
          }`}>
            <p className="font-medium">
              Welcome! Please go to the <strong>Settings gear icon</strong> to add your own Gemini API key to start using the Smart Bible.
            </p>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Adding your Gemini key unlocks automatic craft settings generation, natural language card updates, and AI laser/sublimation/3D print recommendations. Your key is stored securely in your private local browser storage.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 group"
            >
              <Settings className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>Open Settings Gear Icon</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Continue to Smart Bible without Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
