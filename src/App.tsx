/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Character, CharacterClassType } from './types/character';
import { generateCharacter } from './utils/characterGenerator';
import { FantasyPlayerCard } from './components/FantasyPlayerCard';
import { MyDeckSection } from './components/MyDeckSection';
import { ClassFilter } from './components/ClassFilter';
import { soundManager } from './utils/audio';
import { 
  Sparkles, 
  Dices, 
  Volume2, 
  VolumeX, 
  Layers, 
  History,
  Flame,
  Hourglass,
  Check
} from 'lucide-react';
import { generateProceduralPortrait } from './utils/portraitFallback';
import { generateTailoredBackstory } from './utils/backstoryGenerator';
import { AlchemyCircle, AlchemyVial, AntiqueCorner } from './components/AlchemyWorkbenchDecor';

const STORAGE_KEY_DECK = 'realmforge_fantasy_player_deck_v3';
const STORAGE_KEY_COUNT = 'realmforge_roll_count_v2';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<CharacterClassType | 'ANY'>('ANY');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [character, setCharacter] = useState<Character>(() => generateCharacter('ANY', 1));
  
  // My Deck state: persists reliably to localStorage so no cards are lost
  const [deck, setDeck] = useState<Character[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DECK);
      if (stored) return JSON.parse(stored);
      // Migrate from previous storage if present
      const oldRoster = localStorage.getItem('realmforge_saved_characters_v1');
      if (oldRoster) {
        const parsedOld = JSON.parse(oldRoster);
        return parsedOld.map((c: Partial<Character>) => ({
          ...c,
          cardStats: c.cardStats || {
            health: c.stats?.maxHp ?? 120,
            mana: c.stats?.powerPoints ?? 80,
            strength: c.stats?.strength ? c.stats.strength * 5 : 75
          },
          rarity: c.rarity || 'Rare'
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [generateCount, setGenerateCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COUNT);
      return stored ? parseInt(stored, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Sync deck to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DECK, JSON.stringify(deck));
    } catch {
      // Storage quota fallback
    }
  }, [deck]);

  // Sync roll count
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COUNT, generateCount.toString());
    } catch {
      // Fallback
    }
  }, [generateCount]);

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Primary Generator Function: "Generate Character"
  // Generates a new character with fresh name, class, backstory, and random Health/Mana/Strength stats.
  // Crucially: DOES NOT touch the saved deck!
  const handleGenerate = useCallback(() => {
    soundManager.playGenerateSound();
    setIsRolling(true);

    setTimeout(() => {
      const newChar = generateCharacter(selectedClass, selectedLevel);
      setCharacter(newChar);
      setGenerateCount((prev) => prev + 1);
      setIsRolling(false);
      showToast(`Forged new ${newChar.characterClass} card: ${newChar.name}`);
    }, 200);
  }, [selectedClass, selectedLevel]);

  // Keyboard shortcut: Spacebar to quickly generate character
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate]);

  // Partial re-roll attributes and card stats
  const handleRerollStats = () => {
    const fresh = generateCharacter(character.characterClass, character.level);
    setCharacter((prev) => ({
      ...prev,
      cardStats: fresh.cardStats,
      stats: fresh.stats
    }));
    showToast('Re-rolled Health, Mana, and Strength attributes');
  };

  // Partial re-roll name only
  const handleRerollName = () => {
    const fresh = generateCharacter(character.characterClass, character.level);
    setCharacter((prev) => ({
      ...prev,
      name: fresh.name,
      title: fresh.title,
      fullName: fresh.fullName,
      race: fresh.race
    }));
  };

  // Portrait Generation State
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const [portraitError, setPortraitError] = useState<string | null>(null);

  // Portrait Generation Handler
  const handlePortraitGeneration = async (isRegenerate: boolean = false) => {
    soundManager.playClickSound();
    setIsGeneratingPortrait(true);
    setPortraitError(null);

    const nextSeed = isRegenerate ? (character.portraitSeed ?? 0) + 1 : (character.portraitSeed ?? 0);

    try {
      const response = await fetch('/api/generate-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: character.fullName,
          characterClass: character.characterClass,
          subclass: character.subclass,
          race: character.race,
          variationSeed: nextSeed
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate portrait');
      }

      if (data.imageUrl) {
        setCharacter((prev) => {
          const updated = {
            ...prev,
            portraitUrl: data.imageUrl,
            portraitSeed: nextSeed
          };
          // Also update card in deck if already saved
          setDeck((d) => d.map((c) => (c.id === prev.id ? updated : c)));
          return updated;
        });
        soundManager.playSaveSound();
        showToast('Card portrait conjured successfully!');
      } else {
        throw new Error('No image was returned');
      }
    } catch (err: unknown) {
      console.warn('Backend portrait generation notice:', err);
      const msg = err instanceof Error ? err.message : 'Notice generating portrait';
      setPortraitError(msg);
      // Fallback cartoon artwork so card is never left blank
      const fallbackUrl = generateProceduralPortrait(character, nextSeed);
      setCharacter((prev) => {
        const updated = {
          ...prev,
          portraitUrl: fallbackUrl,
          portraitSeed: nextSeed
        };
        setDeck((d) => d.map((c) => (c.id === prev.id ? updated : c)));
        return updated;
      });
      showToast('Generated stylized card portrait');
    } finally {
      setIsGeneratingPortrait(false);
    }
  };

  const handleGeneratePortrait = () => handlePortraitGeneration(false);
  const handleRegeneratePortrait = () => handlePortraitGeneration(true);

  const handleUseFallbackPortrait = () => {
    soundManager.playClickSound();
    const nextSeed = (character.portraitSeed ?? 0) + 1;
    const fallbackUrl = generateProceduralPortrait(character, nextSeed);
    setCharacter((prev) => {
      const updated = {
        ...prev,
        portraitUrl: fallbackUrl,
        portraitSeed: nextSeed
      };
      setDeck((d) => d.map((c) => (c.id === prev.id ? updated : c)));
      return updated;
    });
    setPortraitError(null);
    soundManager.playSaveSound();
  };

  // Backstory Generation State
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);

  // Generate Backstory Handler (1-2 sentences matching name, class, and personality)
  const handleGenerateBackstory = async () => {
    soundManager.playClickSound();
    setIsGeneratingBackstory(true);

    try {
      const response = await fetch('/api/generate-backstory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: character.fullName,
          characterClass: character.characterClass,
          subclass: character.subclass,
          race: character.race,
          alignment: character.alignment,
          quirk: character.quirk,
          motto: character.motto
        })
      });

      const data = await response.json();
      if (!response.ok || !data.backstory) {
        throw new Error(data.error || 'Failed to generate backstory');
      }

      setCharacter((prev) => {
        const updated = {
          ...prev,
          backstory: data.backstory
        };
        setDeck((d) => d.map((c) => (c.id === prev.id ? updated : c)));
        return updated;
      });
      soundManager.playSaveSound();
      showToast('Inscribed new 1-2 sentence origin story');
    } catch (err: unknown) {
      console.warn('Backend backstory notice, generating tailored origin:', err);
      const newBackstory = generateTailoredBackstory(character);
      setCharacter((prev) => {
        const updated = {
          ...prev,
          backstory: newBackstory
        };
        setDeck((d) => d.map((c) => (c.id === prev.id ? updated : c)));
        return updated;
      });
      soundManager.playSaveSound();
      showToast('Inscribed unique origin story');
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  // Save to Deck Functionality
  const handleSaveToDeck = (char: Character) => {
    setDeck((prevDeck) => {
      const existsIndex = prevDeck.findIndex((c) => c.id === char.id);
      if (existsIndex >= 0) {
        // Update existing card in deck
        const updated = [...prevDeck];
        updated[existsIndex] = char;
        showToast(`Updated "${char.name}" in My Deck!`);
        return updated;
      } else {
        // Add new card to deck
        showToast(`Saved "${char.name}" to My Deck!`);
        return [char, ...prevDeck];
      }
    });
  };

  const handleRemoveFromDeck = (id: string) => {
    setDeck((prev) => prev.filter((c) => c.id !== id));
    showToast('Card removed from My Deck');
  };

  const handleClearDeck = () => {
    setDeck([]);
    showToast('All cards expunged from My Deck');
  };

  const handleSelectCardFromDeck = (char: Character) => {
    setCharacter(char);
    window.scrollTo({ top: 380, behavior: 'smooth' });
    showToast(`Loaded "${char.name}" onto the workbench table`);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const isCurrentCardInDeck = deck.some((c) => c.id === character.id);

  return (
    <div className="min-h-screen workbench-bg text-[#f5ebd9] flex flex-col font-sans selection:bg-amber-600/30 selection:text-amber-200 relative overflow-hidden">
      
      {/* Ambient background alchemical watermarks */}
      <div className="absolute top-[-80px] left-[-80px] pointer-events-none opacity-10">
        <AlchemyCircle className="w-[600px] h-[600px] animate-transmute-spin" opacity={0.2} />
      </div>
      <div className="absolute top-[25%] right-[-100px] pointer-events-none opacity-10">
        <AlchemyCircle className="w-[500px] h-[500px] animate-reverse-spin" opacity={0.15} />
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-[#1c130b] border border-amber-400 text-amber-100 text-xs font-bold font-['Cinzel'] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP WORKBENCH HEADER */}
      <header className="border-b border-amber-500/20 bg-[#100b08]/90 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.35)] border border-amber-400/60">
                <Flame className="w-6 h-6 text-amber-200 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full blur-[2px] opacity-70" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-almendra tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fff4d6] via-[#fcd34d] to-[#d97706] drop-shadow">
                  The Alchemist's Workbench
                </h1>
                <span className="text-[10px] uppercase font-bold font-['Cinzel'] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 hidden sm:inline-block">
                  Player Card Forge
                </span>
              </div>
              <p className="text-[11px] text-amber-200/50 font-medieval tracking-wide flex items-center gap-2">
                <span>Fantasy Player Card System</span>
                <span>•</span>
                <span className="text-amber-300/80 flex items-center gap-1">
                  <AlchemyVial type="elixir" className="w-3.5 h-3.5" />
                  <span>Card Arcana Active</span>
                </span>
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              onClick={handleToggleMute}
              type="button"
              className="p-2.5 rounded-xl text-amber-300/70 hover:text-amber-100 hover:bg-[#1e150e] border border-amber-900/30 hover:border-amber-500/40 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Jump to "My Deck" */}
            <a
              href="#my-deck-section"
              onClick={() => soundManager.playClickSound()}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase font-['Cinzel'] bg-gradient-to-b from-[#1f150e] to-[#140e08] text-amber-200 border border-amber-500/40 hover:text-amber-100 hover:border-amber-400 transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_10px_rgba(212,175,55,0.15)]"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>My Deck</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                {deck.length}
              </span>
            </a>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 relative z-10">
        
        {/* Intro Atmosphere Inscription */}
        <section className="text-center space-y-3.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-200 text-xs font-medium shadow-[0_0_12px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="font-medieval tracking-wide">Forge & Collect Fantasy Player Cards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-almendra tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fff5d6] via-[#fcd34d] to-[#d97706] drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
            The Alchemical Card Forge
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed max-w-xl mx-auto">
            Channel the ancient prima materia into collectible player cards. Roll randomized Health, Mana, and Strength attributes, conjure custom portraits, and preserve your cards in <strong className="text-amber-200 font-bold">My Deck</strong>.
          </p>
        </section>

        {/* WORKBENCH TRANSMUTATION CONSOLE */}
        <div className="relative p-6 sm:p-8 rounded-3xl parchment-card antique-gold-border shadow-2xl max-w-3xl mx-auto space-y-6">
          <AntiqueCorner position="top-left" className="w-8 h-8" />
          <AntiqueCorner position="top-right" className="w-8 h-8" />
          <AntiqueCorner position="bottom-left" className="w-8 h-8" />
          <AntiqueCorner position="bottom-right" className="w-8 h-8" />

          {/* Class Filter Selector */}
          <ClassFilter
            selectedClass={selectedClass}
            onSelectClass={(cls) => {
              soundManager.playClickSound();
              setSelectedClass(cls);
            }}
          />

          {/* Tier / Level Selector */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-amber-900/40 text-xs">
            <div className="flex items-center gap-2 text-amber-300/80 font-['Cinzel'] font-bold">
              <Hourglass className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase tracking-widest text-[11px]">Card Tier:</span>
            </div>
            <div className="inline-flex rounded-xl bg-[#120d08] p-1 border border-amber-900/60 shadow-inner">
              {[
                { lvl: 1, label: 'Initiate (Lv 1)' },
                { lvl: 5, label: 'Adept (Lv 5)' },
                { lvl: 10, label: 'Master (Lv 10)' },
                { lvl: 20, label: 'Magnum Opus (Lv 20)' }
              ].map((tier) => (
                <button
                  key={tier.lvl}
                  type="button"
                  onClick={() => {
                    soundManager.playClickSound();
                    setSelectedLevel(tier.lvl);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-['Cinzel'] ${
                    selectedLevel === tier.lvl
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-neutral-950 font-black shadow-[0_0_8px_rgba(212,175,55,0.4)] border border-amber-300/70'
                      : 'text-amber-200/50 hover:text-amber-100 hover:bg-[#20150d]'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* PRIMARY BUTTON: "Generate Character" */}
          <div className="flex flex-col items-center justify-center pt-2">
            <button
              onClick={handleGenerate}
              type="button"
              className="relative group w-full sm:w-auto min-w-[300px] px-8 py-4 sm:py-5 rounded-2xl font-cinzel-dec text-base sm:text-lg font-black tracking-widest uppercase text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3.5 overflow-hidden border-2 border-amber-200/80"
            >
              <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <Dices className={`w-6 h-6 text-neutral-950 transition-transform duration-500 ${isRolling ? 'rotate-180 scale-125' : 'group-hover:rotate-45'}`} />
              <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]">
                Generate Character
              </span>
            </button>

            <div className="flex items-center gap-3 mt-3.5 text-xs text-amber-200/60 font-medieval">
              <span>Incantation: <kbd className="px-1.5 py-0.5 rounded bg-[#160f0a] border border-amber-700/50 font-mono text-[10px] text-amber-300">Space</kbd></span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Cards Forged: <strong className="text-amber-200 font-['Cinzel']">{generateCount}</strong></span>
              </span>
            </div>
          </div>

        </div>

        {/* 1. THE BEAUTIFUL FANTASY PLAYER CARD */}
        <section aria-label="Active Fantasy Player Card">
          <FantasyPlayerCard
            character={character}
            isInDeck={isCurrentCardInDeck}
            onSaveToDeck={handleSaveToDeck}
            onGeneratePortrait={handleGeneratePortrait}
            onRegeneratePortrait={handleRegeneratePortrait}
            isGeneratingPortrait={isGeneratingPortrait}
            portraitError={portraitError}
            onUseFallbackPortrait={handleUseFallbackPortrait}
            onGenerateBackstory={handleGenerateBackstory}
            isGeneratingBackstory={isGeneratingBackstory}
            onRerollStats={handleRerollStats}
            onRerollName={handleRerollName}
          />
        </section>

        {/* 2. THE "MY DECK" SECTION */}
        <MyDeckSection
          deck={deck}
          activeCardId={character.id}
          onSelectCard={handleSelectCardFromDeck}
          onRemoveFromDeck={handleRemoveFromDeck}
          onClearDeck={handleClearDeck}
        />

      </main>

      {/* FOOTER */}
      <footer className="border-t border-amber-500/20 py-8 text-center text-xs text-amber-300/60 bg-[#100a07]/95 mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-amber-200/80">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-almendra text-sm font-bold">RealmForge Fantasy Card System</span>
            <span className="text-amber-400/40">•</span>
            <span className="font-medieval">Alchemical Workbench Edition</span>
          </div>
          <div className="font-medieval text-neutral-400">
            Card Classes: <span className="text-amber-300/90 font-bold">Mage • Rogue • Warrior • Archer • Knight</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
