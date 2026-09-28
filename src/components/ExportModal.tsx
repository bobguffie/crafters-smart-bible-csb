import React, { useState } from 'react';
import { X, Download, FileText, Flame, Printer, Scissors, Database } from 'lucide-react';
import { MaterialCard } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: MaterialCard[];
  activeCard: MaterialCard;
  highContrast: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cards,
  activeCard,
  highContrast,
}) => {
  const [exportScope, setExportScope] = useState<'current' | 'sublimation' | '3d' | 'laser' | 'all'>('all');

  if (!isOpen) return null;

  const handleDownload = () => {
    let dataToExport: any = cards;
    let filenameSuffix = 'all_libraries';

    if (exportScope === 'current') {
      dataToExport = [activeCard];
      filenameSuffix = `card_${activeCard.title.toLowerCase().replace(/\s+/g, '_')}`;
    } else if (exportScope === 'sublimation') {
      dataToExport = cards.filter(c => c.category === 'sublimation' || c.sublimation);
      filenameSuffix = 'sublimation_library';
    } else if (exportScope === '3d') {
      dataToExport = cards.filter(c => c.category === '3d_printing' || c.print3d);
      filenameSuffix = '3d_printing_library';
    } else if (exportScope === 'laser') {
      dataToExport = cards.filter(c => c.category === 'laser_cutter' || c.laser);
      filenameSuffix = 'laser_cutter_library';
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `craft_diary_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden transition-all ${
        highContrast ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-amber-50 dark:bg-zinc-900 border-amber-300 text-amber-950 dark:text-amber-100'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          highContrast ? 'border-zinc-800 bg-zinc-950' : 'border-amber-200 bg-amber-100 dark:bg-zinc-900 dark:border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-600" />
            <h2 className="font-serif font-bold text-xl">Export Workshop Data</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-amber-200 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs opacity-80">
            Choose what portion of your craft diary you would like to export to JSON:
          </p>

          <div className="space-y-2">
            
            {/* Current Card */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              exportScope === 'current'
                ? 'bg-orange-500/10 border-orange-500 font-bold'
                : 'border-amber-200 dark:border-zinc-800 hover:bg-amber-100/50 dark:hover:bg-zinc-800'
            }`}>
              <input
                type="radio"
                name="exportScope"
                checked={exportScope === 'current'}
                onChange={() => setExportScope('current')}
                className="accent-orange-600"
              />
              <FileText className="w-4 h-4 text-orange-600" />
              <div className="text-xs">
                <div>Current Card Only</div>
                <div className="opacity-60 text-[10px]">Export active card: "{activeCard?.title}"</div>
              </div>
            </label>

            {/* Sublimation Library */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              exportScope === 'sublimation'
                ? 'bg-purple-500/10 border-purple-500 font-bold'
                : 'border-amber-200 dark:border-zinc-800 hover:bg-amber-100/50 dark:hover:bg-zinc-800'
            }`}>
              <input
                type="radio"
                name="exportScope"
                checked={exportScope === 'sublimation'}
                onChange={() => setExportScope('sublimation')}
                className="accent-purple-600"
              />
              <Flame className="w-4 h-4 text-red-500" />
              <div className="text-xs">
                <div>Entire Sublimation Library</div>
                <div className="opacity-60 text-[10px]">Export all cards with Sublimation parameters</div>
              </div>
            </label>

            {/* 3D Printing Library */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              exportScope === '3d'
                ? 'bg-cyan-500/10 border-cyan-500 font-bold'
                : 'border-amber-200 dark:border-zinc-800 hover:bg-amber-100/50 dark:hover:bg-zinc-800'
            }`}>
              <input
                type="radio"
                name="exportScope"
                checked={exportScope === '3d'}
                onChange={() => setExportScope('3d')}
                className="accent-cyan-500"
              />
              <Printer className="w-4 h-4 text-cyan-400" />
              <div className="text-xs">
                <div>Entire 3D Printing Library</div>
                <div className="opacity-60 text-[10px]">Export all cards with 3D Printing parameters</div>
              </div>
            </label>

            {/* Laser Cutter Library */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              exportScope === 'laser'
                ? 'bg-slate-500/10 border-slate-500 font-bold'
                : 'border-amber-200 dark:border-zinc-800 hover:bg-amber-100/50 dark:hover:bg-zinc-800'
            }`}>
              <input
                type="radio"
                name="exportScope"
                checked={exportScope === 'laser'}
                onChange={() => setExportScope('laser')}
                className="accent-slate-500"
              />
              <Scissors className="w-4 h-4 text-amber-600" />
              <div className="text-xs">
                <div>Entire Laser Cutter Library</div>
                <div className="opacity-60 text-[10px]">Export all cards with Laser Cutter parameters</div>
              </div>
            </label>

            {/* All Libraries */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              exportScope === 'all'
                ? 'bg-orange-600/10 border-orange-600 font-bold'
                : 'border-amber-200 dark:border-zinc-800 hover:bg-amber-100/50 dark:hover:bg-zinc-800'
            }`}>
              <input
                type="radio"
                name="exportScope"
                checked={exportScope === 'all'}
                onChange={() => setExportScope('all')}
                className="accent-orange-600"
              />
              <Database className="w-4 h-4 text-orange-600" />
              <div className="text-xs">
                <div>All Libraries for All Materials (Full Backup)</div>
                <div className="opacity-60 text-[10px]">Export entire workshop database ({cards.length} cards)</div>
              </div>
            </label>

          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
