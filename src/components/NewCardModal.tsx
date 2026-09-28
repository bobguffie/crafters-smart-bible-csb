import React, { useState, useEffect } from 'react';
import { MaterialCard, CraftCategory } from '../types';
import { X, Save, Flame, Printer, Scissors, HelpCircle } from 'lucide-react';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: MaterialCard) => void;
  editingCard: MaterialCard | null;
  highContrast: boolean;
}

export const NewCardModal: React.FC<NewCardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCard,
  highContrast,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CraftCategory>('sublimation');
  const [tagsInput, setTagsInput] = useState('');
  
  // Sublimation
  const [subPressure, setSubPressure] = useState('Medium');
  const [subTime, setSubTime] = useState(60);
  const [subTemp, setSubTemp] = useState('400°F');
  const [subNotes, setSubNotes] = useState('');

  // 3D Print
  const [printHead, setPrintHead] = useState('210°C');
  const [printBed, setPrintBed] = useState('60°C');
  const [printProfile, setPrintProfile] = useState('Standard PLA');
  const [printNotes, setPrintNotes] = useState('');

  // Laser
  const [laserSpeed, setLaserSpeed] = useState('20 mm/s');
  const [laserDpi, setLaserDpi] = useState('300 DPI');
  const [laserPower, setLaserPower] = useState('80%');
  const [laserAir, setLaserAir] = useState(true);
  const [laserNotes, setLaserNotes] = useState('');

  // Other
  const [otherDiscipline, setOtherDiscipline] = useState('General Craft');
  const [otherMaterial, setOtherMaterial] = useState('');
  const [otherDuration, setOtherDuration] = useState(30);
  const [otherTemp, setOtherTemp] = useState('');
  const [otherNotes, setOtherNotes] = useState('');

  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title);
      setCategory(editingCard.category);
      setTagsInput(editingCard.tags.join(', '));
      
      setSubPressure(editingCard.sublimation.pressure);
      setSubTime(editingCard.sublimation.timeSeconds);
      setSubTemp(editingCard.sublimation.temp);
      setSubNotes(editingCard.sublimation.notes);

      setPrintHead(editingCard.print3d.headTemp);
      setPrintBed(editingCard.print3d.bedTemp);
      setPrintProfile(editingCard.print3d.slicerProfile);
      setPrintNotes(editingCard.print3d.notes);

      setLaserSpeed(editingCard.laser.cutSpeed);
      setLaserDpi(editingCard.laser.engraveModeDpi);
      setLaserPower(editingCard.laser.power);
      setLaserAir(editingCard.laser.airAssist);
      setLaserNotes(editingCard.laser.notes);

      setOtherDiscipline(editingCard.other.disciplineName);
      setOtherMaterial(editingCard.other.material);
      setOtherDuration(editingCard.other.durationSeconds);
      setOtherTemp(editingCard.other.tempPressure);
      setOtherNotes(editingCard.other.notes);
    } else {
      setTitle('');
      setCategory('sublimation');
      setTagsInput('');
      setSubPressure('Medium');
      setSubTime(60);
      setSubTemp('400°F');
      setSubNotes('');
      setPrintHead('210°C');
      setPrintBed('60°C');
      setPrintProfile('Standard PLA');
      setPrintNotes('');
      setLaserSpeed('20 mm/s');
      setLaserDpi('300 DPI');
      setLaserPower('80%');
      setLaserAir(true);
      setLaserNotes('');
      setOtherDiscipline('General Craft');
      setOtherMaterial('');
      setOtherDuration(30);
      setOtherTemp('');
      setOtherNotes('');
    }
  }, [editingCard, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const cardData: MaterialCard = {
      id: editingCard ? editingCard.id : `card-${Date.now()}`,
      title: title.trim(),
      category,
      tags,
      favorite: editingCard ? editingCard.favorite : false,
      updatedAt: new Date().toISOString().split('T')[0],
      sublimation: {
        pressure: subPressure,
        timeSeconds: Number(subTime),
        temp: subTemp,
        notes: subNotes,
      },
      print3d: {
        headTemp: printHead,
        bedTemp: printBed,
        slicerProfile: printProfile,
        notes: printNotes,
      },
      laser: {
        cutSpeed: laserSpeed,
        engraveModeDpi: laserDpi,
        power: laserPower,
        airAssist: laserAir,
        notes: laserNotes,
      },
      other: {
        disciplineName: otherDiscipline,
        material: otherMaterial,
        durationSeconds: Number(otherDuration),
        tempPressure: otherTemp,
        notes: otherNotes,
      },
    };

    onSave(cardData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden transition-all ${
        highContrast ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-amber-50 dark:bg-zinc-900 border-amber-300 text-amber-950 dark:text-amber-100'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          highContrast ? 'border-zinc-800 bg-zinc-950' : 'border-amber-200 bg-amber-100 dark:bg-zinc-900 dark:border-zinc-800'
        }`}>
          <h2 className="font-serif font-bold text-xl">
            {editingCard ? 'Edit Craft Material Card' : 'Create New Craft Material Card'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-amber-200 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase opacity-75">1. General Material Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Material / Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Anodized Aluminum Tumbler"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Default Craft Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CraftCategory)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                >
                  <option value="sublimation">Sublimation</option>
                  <option value="3d_printing">3D Printing</option>
                  <option value="laser_cutter">Laser Cutter</option>
                  <option value="other">Miscellaneous / Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Tumbler, Metal, Drinkware"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none ${
                  highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                }`}
              />
            </div>
          </div>

          {/* Sublimation Section */}
          <div className="space-y-3 pt-4 border-t border-amber-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-purple-700 font-bold">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Sublimation Settings</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Pressure</label>
                <input
                  type="text"
                  value={subPressure}
                  onChange={(e) => setSubPressure(e.target.value)}
                  placeholder="Medium-Firm"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Time (seconds)</label>
                <input
                  type="number"
                  value={subTime}
                  onChange={(e) => setSubTime(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Temperature</label>
                <input
                  type="text"
                  value={subTemp}
                  onChange={(e) => setSubTemp(e.target.value)}
                  placeholder="400°F"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono opacity-80 mb-1">Sublimation Notes</label>
              <textarea
                rows={2}
                value={subNotes}
                onChange={(e) => setSubNotes(e.target.value)}
                placeholder="Pre-press tips, tape recommendations..."
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                }`}
              />
            </div>
          </div>

          {/* 3D Printing Section */}
          <div className="space-y-3 pt-4 border-t border-amber-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-cyan-600 font-bold">
              <Printer className="w-4 h-4 text-cyan-500" />
              <span>3D Printing Settings</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Head Temp (°C)</label>
                <input
                  type="text"
                  value={printHead}
                  onChange={(e) => setPrintHead(e.target.value)}
                  placeholder="210°C"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Bed Temp (°C)</label>
                <input
                  type="text"
                  value={printBed}
                  onChange={(e) => setPrintBed(e.target.value)}
                  placeholder="60°C"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Slicer Profile</label>
                <input
                  type="text"
                  value={printProfile}
                  onChange={(e) => setPrintProfile(e.target.value)}
                  placeholder="Cura Standard"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono opacity-80 mb-1">3D Printing Notes</label>
              <textarea
                rows={2}
                value={printNotes}
                onChange={(e) => setPrintNotes(e.target.value)}
                placeholder="Retraction settings, cooling..."
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                }`}
              />
            </div>
          </div>

          {/* Laser Cutter Section */}
          <div className="space-y-3 pt-4 border-t border-amber-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <Scissors className="w-4 h-4 text-amber-600" />
              <span>Laser Cutter & Engraver Settings</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Cut Speed</label>
                <input
                  type="text"
                  value={laserSpeed}
                  onChange={(e) => setLaserSpeed(e.target.value)}
                  placeholder="15 mm/s"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Power (%)</label>
                <input
                  type="text"
                  value={laserPower}
                  onChange={(e) => setLaserPower(e.target.value)}
                  placeholder="80%"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Engrave Mode / DPI</label>
                <input
                  type="text"
                  value={laserDpi}
                  onChange={(e) => setLaserDpi(e.target.value)}
                  placeholder="300 DPI"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={laserAir}
                    onChange={(e) => setLaserAir(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span className="text-xs font-semibold">Air Assist ON</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono opacity-80 mb-1">Safety & Focal Notes</label>
              <textarea
                rows={2}
                value={laserNotes}
                onChange={(e) => setLaserNotes(e.target.value)}
                placeholder="Focal height, masking tape tips..."
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                }`}
              />
            </div>
          </div>

          {/* Other / Misc Section */}
          <div className="space-y-3 pt-4 border-t border-amber-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-orange-600 font-bold">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              <span>Miscellaneous / Other Settings</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Discipline Name</label>
                <input
                  type="text"
                  value={otherDiscipline}
                  onChange={(e) => setOtherDiscipline(e.target.value)}
                  placeholder="Epoxy / Soldering"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Material / Brand</label>
                <input
                  type="text"
                  value={otherMaterial}
                  onChange={(e) => setOtherMaterial(e.target.value)}
                  placeholder="Oracal 651"
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono opacity-80 mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  value={otherDuration}
                  onChange={(e) => setOtherDuration(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${
                    highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono opacity-80 mb-1">General Notes</label>
              <textarea
                rows={2}
                value={otherNotes}
                onChange={(e) => setOtherNotes(e.target.value)}
                placeholder="General notes..."
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  highContrast ? 'bg-zinc-950 border-zinc-750 text-white' : 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-zinc-700'
                }`}
              />
            </div>
          </div>

          {/* Form Footer */}
          <div className="pt-4 border-t border-amber-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow hover:opacity-95 transition"
            >
              <Save className="w-4 h-4" />
              <span>{editingCard ? 'Save Changes' : 'Add to Rolodex'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
