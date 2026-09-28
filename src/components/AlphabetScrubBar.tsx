import React from 'react';

interface AlphabetScrubBarProps {
  selectedLetter: string | null;
  onSelectLetter: (letter: string | null) => void;
  availableLetters: string[];
  highContrast: boolean;
}

export const AlphabetScrubBar: React.FC<AlphabetScrubBarProps> = ({
  selectedLetter,
  onSelectLetter,
  availableLetters,
  highContrast,
}) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className={`hidden lg:flex flex-col items-center justify-center py-2 px-1 rounded-2xl shadow-sm border select-none ${
      highContrast 
        ? 'bg-zinc-950 border-zinc-800 text-zinc-400' 
        : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-amber-200/60 dark:border-zinc-800 text-amber-900 dark:text-amber-200'
    }`}>
      <button
        onClick={() => onSelectLetter(null)}
        className={`text-[10px] font-bold px-1.5 py-0.5 mb-1 rounded transition ${
          selectedLetter === null 
            ? 'bg-orange-600 text-white' 
            : 'hover:bg-amber-100 dark:hover:bg-zinc-800'
        }`}
        title="All letters"
      >
        ALL
      </button>

      <div className="flex flex-col space-y-0.5 text-xs font-mono font-bold">
        {alphabet.map((letter) => {
          const hasCards = availableLetters.includes(letter);
          const isSelected = selectedLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => hasCards && onSelectLetter(isSelected ? null : letter)}
              disabled={!hasCards}
              className={`w-6 h-5 flex items-center justify-center rounded transition text-[11px] ${
                isSelected
                  ? 'bg-orange-600 text-white scale-110 shadow'
                  : hasCards
                  ? 'hover:bg-amber-200 dark:hover:bg-zinc-700 text-amber-950 dark:text-amber-100 cursor-pointer'
                  : 'opacity-25 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};
