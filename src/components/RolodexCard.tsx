import React, { useState } from 'react';
import { MaterialCard, CraftCategory } from '../types';
import { Flame, Printer, Scissors, HelpCircle, Star, Edit3, Trash2, Clock, Check, Copy } from 'lucide-react';

interface RolodexCardProps {
  card: MaterialCard;
  indexNumber: number;
  totalCards: number;
  onEdit: (card: MaterialCard) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onStartTimer: (label: string, durationSeconds: number, craftType: CraftCategory) => void;
  highContrast: boolean;
  flipDirection?: 'next' | 'prev';
  flipKey?: number;
  tempUnit?: 'F' | 'C';
}

function formatTemp(tempStr: string, targetUnit: 'F' | 'C') {
  if (!tempStr) return tempStr;
  const matchF = tempStr.match(/(\d+)\s*°?\s*f/i);
  const matchC = tempStr.match(/(\d+)\s*°?\s*c/i);

  if (targetUnit === 'C') {
    if (matchF) {
      const f = parseInt(matchF[1]);
      const c = Math.round((f - 32) * 5 / 9);
      return `${c}°C`;
    }
    if (matchC) return tempStr.toUpperCase();
  } else {
    if (matchC) {
      const c = parseInt(matchC[1]);
      const f = Math.round((c * 9 / 5) + 32);
      return `${f}°F`;
    }
    if (matchF) return tempStr.toUpperCase();
  }
  return tempStr;
}

export const RolodexCard: React.FC<RolodexCardProps> = ({
  card,
  indexNumber,
  totalCards,
  onEdit,
  onDelete,
  onToggleFavorite,
  onStartTimer,
  highContrast,
  flipDirection = 'next',
  flipKey = 0,
  tempUnit = 'F',
}) => {
  const [activeTab, setActiveTab] = useState<CraftCategory>(card.category || 'sublimation');
  const [copied, setCopied] = useState(false);

  const handleCopySettings = () => {
    let content = `--- ${card.title} (${activeTab.toUpperCase()}) ---\n`;
    if (activeTab === 'sublimation') {
      content += `Pressure: ${card.sublimation.pressure}\nTime: ${card.sublimation.timeSeconds}s\nTemp: ${card.sublimation.temp}\nNotes: ${card.sublimation.notes}`;
    } else if (activeTab === '3d_printing') {
      content += `Head Temp: ${card.print3d.headTemp}\nBed Temp: ${card.print3d.bedTemp}\nProfile: ${card.print3d.slicerProfile}\nNotes: ${card.print3d.notes}`;
    } else if (activeTab === 'laser_cutter') {
      content += `Cut Speed: ${card.laser.cutSpeed}\nEngrave Mode: ${card.laser.engraveModeDpi}\nPower: ${card.laser.power}\nAir Assist: ${card.laser.airAssist ? 'ON' : 'OFF'}\nNotes: ${card.laser.notes}`;
    } else {
      content += `Discipline: ${card.other.disciplineName}\nMaterial: ${card.other.material}\nDuration: ${card.other.durationSeconds}s\nTemp/Pressure: ${card.other.tempPressure}\nNotes: ${card.other.notes}`;
    }
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      key={flipKey}
      className={`w-full max-w-2xl mx-auto rounded-3xl shadow-xl transition-all border overflow-hidden ${
        flipDirection === 'next' ? 'animate-rolodex-next' : 'animate-rolodex-prev'
      } ${
        highContrast 
          ? 'bg-zinc-900 border-zinc-700 text-white shadow-zinc-950/50' 
          : 'bg-amber-50/95 dark:bg-zinc-900 border-amber-300/80 dark:border-zinc-800 text-amber-950 dark:text-amber-100 shadow-amber-950/10'
      }`}
    >
      
      {/* Card Header Top Bar */}
      <div className={`px-6 py-4 border-b flex items-center justify-between ${
        highContrast ? 'border-zinc-800 bg-zinc-950' : 'border-amber-200/80 dark:border-zinc-800 bg-amber-100/70 dark:bg-zinc-900'
      }`}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-zinc-800 text-amber-900 dark:text-amber-300">
            #{indexNumber} of {totalCards}
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight">
            {card.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(card.id)}
            className={`p-2 rounded-xl transition ${
              card.favorite 
                ? 'text-amber-500 bg-amber-100 dark:bg-amber-950/40' 
                : 'text-zinc-400 hover:bg-amber-200/50 dark:hover:bg-zinc-800'
            }`}
            title={card.favorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Star className={`w-5 h-5 ${card.favorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopySettings}
            className="p-2 rounded-xl hover:bg-amber-200/50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition relative"
            title="Copy Settings to Clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onEdit(card)}
            className="p-2 rounded-xl hover:bg-amber-200/50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
            title="Edit Card"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(card.id)}
            className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 transition"
            title="Delete Card"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tags Bar */}
      {card.tags && card.tags.length > 0 && (
        <div className="px-6 py-2 bg-amber-100/30 dark:bg-zinc-950/40 border-b border-amber-200/40 dark:border-zinc-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono opacity-60">Tags:</span>
          {card.tags.map((tag, i) => (
            <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-zinc-800 text-amber-900 dark:text-amber-300">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 4 Switchable Color-Coded Craft Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-2 bg-amber-200/40 dark:bg-zinc-950 border-b border-amber-200/80 dark:border-zinc-800">
        
        {/* 1. Sublimation Tab Button */}
        <button
          onClick={() => setActiveTab('sublimation')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sublimation'
              ? 'bg-white text-purple-700 shadow-md border-2 border-red-500 scale-[1.02]'
              : 'bg-white/60 text-purple-900 hover:bg-white/90 border border-purple-200'
          }`}
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span>Sublimation</span>
        </button>

        {/* 2. 3D Printing Tab Button */}
        <button
          onClick={() => setActiveTab('3d_printing')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === '3d_printing'
              ? 'bg-zinc-950 text-white shadow-md border-2 border-zinc-600 scale-[1.02]'
              : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-900 border border-zinc-700'
          }`}
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>3D Printing</span>
        </button>

        {/* 3. Laser Cutter Tab Button */}
        <button
          onClick={() => setActiveTab('laser_cutter')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'laser_cutter'
              ? 'bg-gradient-to-r from-slate-200 via-zinc-100 to-slate-300 text-slate-900 shadow-md border-2 border-slate-500 scale-[1.02]'
              : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Scissors className="w-4 h-4 text-amber-600" />
          <span>Laser Cutter</span>
        </button>

        {/* 4. Other / Misc Tab Button */}
        <button
          onClick={() => setActiveTab('other')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'other'
              ? 'bg-orange-600 text-white shadow-md border-2 border-orange-400 scale-[1.02]'
              : 'bg-orange-500/80 text-orange-950 hover:bg-orange-600/90 border border-orange-400'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-200" />
          <span>Misc / Other</span>
        </button>

      </div>

      {/* Tab Content Display Area */}
      <div className="p-6">
        
        {/* 1. SUBLIMATION TAB */}
        {activeTab === 'sublimation' && (
          <div className="bg-white text-purple-950 p-6 rounded-2xl shadow-inner border-2 border-red-500 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-lg text-purple-900">Sublimation Parameters</h3>
              </div>
              {card.sublimation.timeSeconds > 0 && (
                <button
                  onClick={() => onStartTimer(`${card.title} (Sublimation)`, card.sublimation.timeSeconds, 'sublimation')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold shadow hover:bg-red-700 transition"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Start {card.sublimation.timeSeconds}s Timer</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[11px] font-mono text-purple-600 uppercase block">Pressure</span>
                <span className="text-base font-bold text-purple-950">{card.sublimation.pressure || 'Standard'}</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[11px] font-mono text-purple-600 uppercase block">Time Duration</span>
                <span className="text-base font-bold text-purple-950">{card.sublimation.timeSeconds} seconds</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[11px] font-mono text-purple-600 uppercase block">Temperature</span>
                <span className="text-base font-bold text-purple-950">{formatTemp(card.sublimation.temp, tempUnit) || 'N/A'}</span>
              </div>
            </div>

            <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-100">
              <span className="text-[11px] font-mono text-purple-600 uppercase block mb-1">Personal Notes & Tips</span>
              <p className="text-sm text-purple-900 leading-relaxed whitespace-pre-wrap">
                {card.sublimation.notes || 'No specific notes recorded for sublimation.'}
              </p>
            </div>
          </div>
        )}

        {/* 2. 3D PRINTING TAB */}
        {activeTab === '3d_printing' && (
          <div className="bg-zinc-950 text-white p-6 rounded-2xl shadow-inner border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg text-cyan-300">3D Printing Parameters</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[11px] font-mono text-zinc-400 uppercase block">Head Temperature</span>
                <span className="text-base font-bold text-white">{formatTemp(card.print3d.headTemp, tempUnit) || 'N/A'}</span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[11px] font-mono text-zinc-400 uppercase block">Bed Temperature</span>
                <span className="text-base font-bold text-white">{formatTemp(card.print3d.bedTemp, tempUnit) || 'N/A'}</span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[11px] font-mono text-zinc-400 uppercase block">Slicer Profile</span>
                <span className="text-base font-bold text-cyan-200 truncate block">{card.print3d.slicerProfile || 'Standard'}</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">Personal Notes & Tips</span>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {card.print3d.notes || 'No specific notes recorded for 3D printing.'}
              </p>
            </div>
          </div>
        )}

        {/* 3. LASER CUTTER TAB */}
        {activeTab === 'laser_cutter' && (
          <div className="bg-gradient-to-r from-slate-200 via-zinc-100 to-slate-300 text-slate-900 p-6 rounded-2xl shadow-inner border border-slate-400 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-300 pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-lg text-slate-900">Laser Cutter & Engraver Parameters</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-white/80 rounded-xl border border-slate-300 shadow-sm">
                <span className="text-[11px] font-mono text-slate-600 uppercase block">Cut Speed</span>
                <span className="text-base font-bold text-slate-900">{card.laser.cutSpeed || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-slate-300 shadow-sm">
                <span className="text-[11px] font-mono text-slate-600 uppercase block">Power (%)</span>
                <span className="text-base font-bold text-slate-900">{card.laser.power || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-slate-300 shadow-sm">
                <span className="text-[11px] font-mono text-slate-600 uppercase block">Engrave Mode / DPI</span>
                <span className="text-base font-bold text-slate-900 truncate block">{card.laser.engraveModeDpi || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-slate-300 shadow-sm">
                <span className="text-[11px] font-mono text-slate-600 uppercase block">Air Assist</span>
                <span className={`text-sm font-extrabold px-2 py-0.5 rounded inline-block mt-0.5 ${
                  card.laser.airAssist ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                }`}>
                  {card.laser.airAssist ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-slate-300 shadow-sm">
              <span className="text-[11px] font-mono text-slate-600 uppercase block mb-1">Safety & Focal Notes</span>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {card.laser.notes || 'No laser safety or focal notes recorded.'}
              </p>
            </div>
          </div>
        )}

        {/* 4. OTHER / MISC TAB */}
        {activeTab === 'other' && (
          <div className="bg-orange-600 text-orange-950 p-6 rounded-2xl shadow-inner border border-orange-500 space-y-4">
            <div className="flex items-center justify-between border-b border-orange-500/80 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-white" />
                <h3 className="font-bold text-lg text-white">Miscellaneous Craft & Discipline</h3>
              </div>
              {card.other.durationSeconds > 0 && (
                <button
                  onClick={() => onStartTimer(`${card.title} (${card.other.disciplineName})`, card.other.durationSeconds, 'other')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-950 text-white text-xs font-semibold shadow hover:bg-orange-900 transition"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Start {card.other.durationSeconds}s Timer</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-orange-500/60 rounded-xl border border-orange-400 text-white">
                <span className="text-[11px] font-mono text-orange-200 uppercase block">Task / Discipline</span>
                <span className="text-base font-bold">{card.other.disciplineName || 'General Craft'}</span>
              </div>
              <div className="p-3 bg-orange-500/60 rounded-xl border border-orange-400 text-white">
                <span className="text-[11px] font-mono text-orange-200 uppercase block">Material / Brand</span>
                <span className="text-base font-bold">{card.other.material || 'N/A'}</span>
              </div>
              <div className="p-3 bg-orange-500/60 rounded-xl border border-orange-400 text-white">
                <span className="text-[11px] font-mono text-orange-200 uppercase block">Duration / Temp</span>
                <span className="text-base font-bold">{card.other.durationSeconds}s / {card.other.tempPressure || 'N/A'}</span>
              </div>
            </div>

            <div className="p-4 bg-orange-500/50 rounded-xl border border-orange-400 text-white">
              <span className="text-[11px] font-mono text-orange-200 uppercase block mb-1">General Notes</span>
              <p className="text-sm text-white/95 leading-relaxed whitespace-pre-wrap">
                {card.other.notes || 'No general notes recorded.'}
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
