export type CraftCategory = 'sublimation' | '3d_printing' | 'laser_cutter' | 'other';

export interface SublimationSettings {
  pressure: string; // e.g. "Medium-Firm", "40 psi"
  timeSeconds: number; // e.g. 60
  temp: string; // e.g. "400°F / 205°C"
  notes: string;
}

export interface Print3DSettings {
  headTemp: string; // e.g. "210°C"
  bedTemp: string; // e.g. "60°C"
  slicerProfile: string; // e.g. "Cura Standard 0.2mm"
  notes: string;
}

export interface LaserSettings {
  cutSpeed: string; // e.g. "15 mm/s"
  engraveModeDpi: string; // e.g. "300 DPI / Bidirectional"
  power: string; // e.g. "80%"
  airAssist: boolean;
  notes: string;
}

export interface OtherSettings {
  disciplineName: string; // e.g. "Cricut Vinyl", "Resin Curing", "Soldering"
  material: string; // e.g. "Oracal 651 Permanent"
  durationSeconds: number; // e.g. 30
  tempPressure: string; // e.g. "Heat press 300°F"
  notes: string;
}

export interface MaterialCard {
  id: string;
  title: string;
  category: CraftCategory;
  tags: string[];
  favorite: boolean;
  updatedAt: string;
  sublimation: SublimationSettings;
  print3d: Print3DSettings;
  laser: LaserSettings;
  other: OtherSettings;
}

export type TimerSoundType = 'chime' | 'beep' | 'bell' | 'digital' | 'gong';

export interface WorkshopTimer {
  id: string;
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  craftType: CraftCategory;
  createdAt: number;
  sound?: TimerSoundType;
}
