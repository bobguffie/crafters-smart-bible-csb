import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';

interface PWAInstallButtonProps {
  highContrast?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ highContrast }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed and running standalone, do not show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
          highContrast
            ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
            : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white'
        }`}
        title="Install Crafters Smart Bible App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported on iOS Safari)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            highContrast
              ? 'bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800'
              : 'bg-white/80 dark:bg-zinc-800 border-orange-300 dark:border-zinc-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50'
          }`}
          title="Add to Home Screen on iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-all ${
              highContrast ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white dark:bg-zinc-900 border-amber-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <h3 className="font-serif font-bold text-base">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50 dark:bg-zinc-800/60 border border-amber-200/60 dark:border-zinc-700">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold">1</div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      Tap the Share icon <Share className="w-3.5 h-3.5 text-blue-500 inline" />
                    </p>
                    <p className="opacity-80">Located at the bottom of Safari toolbar (or top on iPad).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50 dark:bg-zinc-800/60 border border-amber-200/60 dark:border-zinc-700">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold">2</div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      Scroll down & select <PlusSquare className="w-3.5 h-3.5 text-orange-600 inline" />
                    </p>
                    <p className="font-medium text-orange-700 dark:text-orange-400">"Add to Home Screen"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50 dark:bg-zinc-800/60 border border-amber-200/60 dark:border-zinc-700">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold">3</div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Tap "Add" in top-right</p>
                    <p className="opacity-80">Crafters Smart Bible will launch full-screen directly from your home screen!</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback generic install button for other browsers / desktop
  return (
    <button
      onClick={() => setShowIOSGuide(true)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
        highContrast
          ? 'bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800'
          : 'bg-white/80 dark:bg-zinc-800 border-orange-300 dark:border-zinc-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50'
      }`}
      title="Install as Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 text-orange-600" />
      <span>Install App</span>
    </button>
  );
};
