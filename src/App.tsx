import React, { useState, useEffect, useMemo } from 'react';
import { MaterialCard, WorkshopTimer, CraftCategory } from './types';
import { INITIAL_CARDS } from './data/initialCards';
import { Header } from './components/Header';
import { RolodexCard } from './components/RolodexCard';
import { AlphabetScrubBar } from './components/AlphabetScrubBar';
import { TimerDrawer } from './components/TimerDrawer';
import { NewCardModal } from './components/NewCardModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';
import { ApiKeyWelcomeModal } from './components/ApiKeyWelcomeModal';
import { ChevronLeft, ChevronRight, Sparkles, Filter, Star } from 'lucide-react';

export default function App() {
  const [cards, setCards] = useState<MaterialCard[]>(() => {
    const saved = localStorage.getItem('craft_diary_cards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CARDS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [flipKey, setFlipKey] = useState(0);

  const [timers, setTimers] = useState<WorkshopTimer[]>(() => {
    const saved = localStorage.getItem('craft_diary_timers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [isTimerDrawerOpen, setIsTimerDrawerOpen] = useState(false);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<MaterialCard | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>(() => {
    return (localStorage.getItem('craft_diary_tempunit') as 'F' | 'C') || 'F';
  });
  const [aiModel, setAiModel] = useState<string>(() => {
    return localStorage.getItem('craft_diary_aimodel') || 'gemini-3.8-flash';
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('craft_diary_apikey') || '';
  });
  const [showApiKeyWelcome, setShowApiKeyWelcome] = useState<boolean>(() => {
    const savedKey = localStorage.getItem('craft_diary_apikey');
    return !savedKey || savedKey.trim() === '';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('craft_diary_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('craft_diary_timers', JSON.stringify(timers));
  }, [timers]);

  // Filtered cards based on search, letter, and category
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = card.title.toLowerCase().includes(q);
        const matchTags = card.tags.some(t => t.toLowerCase().includes(q));
        const matchSub = card.sublimation.notes.toLowerCase().includes(q) || card.sublimation.temp.toLowerCase().includes(q);
        const matchPrint = card.print3d.slicerProfile.toLowerCase().includes(q) || card.print3d.notes.toLowerCase().includes(q);
        const matchLaser = card.laser.cutSpeed.toLowerCase().includes(q) || card.laser.notes.toLowerCase().includes(q);
        const matchOther = card.other.disciplineName.toLowerCase().includes(q) || card.other.material.toLowerCase().includes(q);
        if (!matchTitle && !matchTags && !matchSub && !matchPrint && !matchLaser && !matchOther) {
          return false;
        }
      }

      // Letter scrub bar filter
      if (selectedLetter) {
        if (!card.title.toUpperCase().startsWith(selectedLetter.toUpperCase())) {
          return false;
        }
      }

      // Category filter tab
      if (selectedCategoryFilter !== 'all' && card.category !== selectedCategoryFilter) {
        return false;
      }

      // Favorites only filter
      if (favoritesOnly && !card.favorite) {
        return false;
      }

      return true;
    });
  }, [cards, searchQuery, selectedLetter, selectedCategoryFilter, favoritesOnly]);

  // Ensure current index stays in bounds
  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(filteredCards.length - 1);
    } else if (filteredCards.length === 0) {
      setCurrentIndex(0);
    }
  }, [filteredCards.length, currentIndex]);

  const activeCard = filteredCards[currentIndex];

  // Available letters for alphabet scrub bar
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    cards.forEach(c => {
      if (c.title && c.title.length > 0) {
        letters.add(c.title[0].toUpperCase());
      }
    });
    return Array.from(letters);
  }, [cards]);

  const handlePrevCard = () => {
    if (filteredCards.length === 0) return;
    setFlipDirection('prev');
    setFlipKey(k => k + 1);
    setCurrentIndex(prev => (prev === 0 ? filteredCards.length - 1 : prev - 1));
  };

  const handleNextCard = () => {
    if (filteredCards.length === 0) return;
    setFlipDirection('next');
    setFlipKey(k => k + 1);
    setCurrentIndex(prev => (prev === filteredCards.length - 1 ? 0 : prev + 1));
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const handleSaveCard = (savedCard: MaterialCard) => {
    setCards(prev => {
      const exists = prev.some(c => c.id === savedCard.id);
      if (exists) {
        return prev.map(c => c.id === savedCard.id ? savedCard : c);
      } else {
        return [savedCard, ...prev];
      }
    });
  };

  const handleStartTimer = (label: string, durationSeconds: number, craftType: CraftCategory) => {
    const newTimer: WorkshopTimer = {
      id: `timer-${Date.now()}`,
      label,
      durationSeconds,
      remainingSeconds: durationSeconds,
      isRunning: true,
      craftType,
      createdAt: Date.now(),
    };
    setTimers(prev => [newTimer, ...prev]);
    setIsTimerDrawerOpen(true);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `craft_settings_diary_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setCards(parsed);
            alert(`Successfully imported ${parsed.length} craft cards!`);
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  const activeTimersCount = timers.filter(t => t.isRunning || t.remainingSeconds === 0).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      highContrast 
        ? 'bg-black text-white' 
        : 'bg-amber-100/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100'
    }`}>
      
      {/* Global Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onOpenNewCard={() => { setEditingCard(null); setIsNewCardModalOpen(true); }}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onToggleTimerDrawer={() => setIsTimerDrawerOpen(!isTimerDrawerOpen)}
        activeTimersCount={activeTimersCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workshop Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-start justify-center">
        
        {/* Left Side: Rolodex Deck Container */}
        <div className="flex-1 w-full flex flex-col items-center space-y-6">
          
          {/* Filter Bar */}
          <div className="w-full max-w-2xl flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-mono font-bold uppercase opacity-60 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-white/70 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 hover:bg-amber-100'
                }`}
              >
                All ({cards.length})
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('sublimation')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCategoryFilter === 'sublimation'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-white/70 dark:bg-zinc-900 border border-purple-200 dark:border-zinc-800 hover:bg-purple-50'
                }`}
              >
                Sublimation
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('3d_printing')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCategoryFilter === '3d_printing'
                    ? 'bg-zinc-900 text-white shadow border border-cyan-500'
                    : 'bg-white/70 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                3D Printing
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('laser_cutter')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCategoryFilter === 'laser_cutter'
                    ? 'bg-slate-300 text-slate-900 shadow font-bold'
                    : 'bg-white/70 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 hover:bg-slate-200'
                }`}
              >
                Laser Cutter
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('other')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCategoryFilter === 'other'
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-white/70 dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 hover:bg-orange-50'
                }`}
              >
                Misc / Other
              </button>

              <button
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  favoritesOnly
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-white/70 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 hover:bg-amber-100 text-amber-900 dark:text-amber-200'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
                <span>Favorites</span>
              </button>
            </div>

            {selectedLetter && (
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-zinc-800 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-orange-800 dark:text-orange-300">
                <span>Letter: {selectedLetter}</span>
                <button onClick={() => setSelectedLetter(null)} className="ml-1 hover:text-red-600">×</button>
              </div>
            )}
          </div>

          {/* Active Rolodex Card or Empty State */}
          {filteredCards.length === 0 ? (
            <div className={`w-full max-w-2xl py-20 px-6 rounded-3xl text-center border space-y-4 ${
              highContrast ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white dark:bg-zinc-900 border-amber-300 text-zinc-600'
            }`}>
              <Sparkles className="w-12 h-12 mx-auto text-amber-500 opacity-80" />
              <h3 className="font-serif font-bold text-xl">No matching craft cards found</h3>
              <p className="text-xs max-w-md mx-auto">
                Try adjusting your search query, clearing letter filters, or create a brand new card using the button above or Gemini AI advisor!
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => { setSearchQuery(''); setSelectedLetter(null); setSelectedCategoryFilter('all'); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-200 dark:bg-zinc-800 hover:bg-amber-300 transition"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Ask AI Assistant
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4">
              
              {/* Rolodex Card View */}
              <RolodexCard
                card={activeCard}
                indexNumber={currentIndex + 1}
                totalCards={filteredCards.length}
                onEdit={(c) => { setEditingCard(c); setIsNewCardModalOpen(true); }}
                onDelete={handleDeleteCard}
                onToggleFavorite={handleToggleFavorite}
                onStartTimer={handleStartTimer}
                highContrast={highContrast}
                flipDirection={flipDirection}
                flipKey={flipKey}
                tempUnit={tempUnit}
              />

              {/* Stepper Navigation Buttons */}
              <div className="w-full max-w-2xl flex items-center justify-between px-2 pt-2">
                <button
                  onClick={handlePrevCard}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold shadow transition transform active:scale-95 ${
                    highContrast
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                      : 'bg-white dark:bg-zinc-900 hover:bg-amber-50 text-amber-950 dark:text-amber-100 border border-amber-300 dark:border-zinc-800'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Card</span>
                </button>

                <div className="font-mono text-xs font-bold opacity-75">
                  Card {currentIndex + 1} of {filteredCards.length}
                </div>

                <button
                  onClick={handleNextCard}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold shadow transition transform active:scale-95 ${
                    highContrast
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                      : 'bg-white dark:bg-zinc-900 hover:bg-amber-50 text-amber-950 dark:text-amber-100 border border-amber-300 dark:border-zinc-800'
                  }`}
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Side: A-to-Z Alphabet Scrub Bar */}
        <AlphabetScrubBar
          selectedLetter={selectedLetter}
          onSelectLetter={setSelectedLetter}
          availableLetters={availableLetters}
          highContrast={highContrast}
        />

      </main>

      {/* Slide-out Concurrent Workshop Timers Drawer */}
      <TimerDrawer
        isOpen={isTimerDrawerOpen}
        onClose={() => setIsTimerDrawerOpen(false)}
        timers={timers}
        setTimers={setTimers}
        highContrast={highContrast}
        onOpenSettings={() => { setIsTimerDrawerOpen(false); setIsSettingsOpen(true); }}
      />

      {/* New / Edit Card Modal */}
      <NewCardModal
        isOpen={isNewCardModalOpen}
        onClose={() => setIsNewCardModalOpen(false)}
        onSave={handleSaveCard}
        editingCard={editingCard}
        highContrast={highContrast}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddAiCard={handleSaveCard}
        cards={cards}
        highContrast={highContrast}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
        aiModel={aiModel}
        setAiModel={setAiModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        timers={timers}
        setTimers={setTimers}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onImportData={handleImportData}
      />

      {/* Export Options Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        cards={cards}
        activeCard={activeCard}
        highContrast={highContrast}
      />

      {/* Initial Gemini API Key Notice Modal */}
      <ApiKeyWelcomeModal
        isOpen={showApiKeyWelcome}
        onClose={() => setShowApiKeyWelcome(false)}
        onOpenSettings={() => {
          setShowApiKeyWelcome(false);
          setIsSettingsOpen(true);
        }}
        highContrast={highContrast}
      />

    </div>
  );
}
