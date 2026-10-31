import React, { useState } from 'react';
import { Character, CharacterClassType } from '../types/character';
import { CLASS_ICONS } from './ClassFilter';
import { AntiqueCorner } from './AlchemyWorkbenchDecor';
import { 
  Layers, 
  Trash2, 
  ExternalLink, 
  Heart, 
  Zap, 
  Sword, 
  Sparkles, 
  Copy, 
  Check, 
  Scroll,
  Eye,
  Filter
} from 'lucide-react';
import { formatCharacterSheetText } from '../utils/characterGenerator';
import { soundManager } from '../utils/audio';

interface MyDeckSectionProps {
  deck: Character[];
  activeCardId?: string;
  onSelectCard: (char: Character) => void;
  onRemoveFromDeck: (id: string) => void;
  onClearDeck: () => void;
}

export const MyDeckSection: React.FC<MyDeckSectionProps> = ({
  deck,
  activeCardId,
  onSelectCard,
  onRemoveFromDeck,
  onClearDeck
}) => {
  const [filterClass, setFilterClass] = useState<CharacterClassType | 'ALL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDeck = filterClass === 'ALL'
    ? deck
    : deck.filter((c) => c.characterClass === filterClass);

  const handleCopyCard = async (char: Character, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClickSound();
    const text = formatCharacterSheetText(char);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(char.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const rarityBorders: Record<string, string> = {
    Common: 'border-neutral-600',
    Rare: 'border-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.25)]',
    Epic: 'border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    Legendary: 'border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.4)]'
  };

  return (
    <section id="my-deck-section" className="relative w-full max-w-6xl mx-auto space-y-6 pt-6">
      
      {/* SECTION HEADER */}
      <div className="relative p-6 sm:p-7 rounded-3xl parchment-card antique-gold-border shadow-2xl overflow-hidden">
        <AntiqueCorner position="top-left" className="w-8 h-8" />
        <AntiqueCorner position="top-right" className="w-8 h-8" />
        <AntiqueCorner position="bottom-left" className="w-8 h-8" />
        <AntiqueCorner position="bottom-right" className="w-8 h-8" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-400/50 flex items-center justify-center shadow">
                <Layers className="w-5 h-5 text-amber-200" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-almendra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4d6] via-[#fcd34d] to-[#d97706]">
                My Deck
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-cinzel-dec bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow">
                {deck.length} {deck.length === 1 ? 'Card' : 'Cards'} Saved
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-1">
              Your preserved fantasy player cards. Each card permanently retains its custom portrait, attributes, Health, Mana, Strength, and origin chronicle.
            </p>
          </div>

          {/* Deck Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#120d08] rounded-xl border border-amber-900/40 text-xs">
              <Filter className="w-3.5 h-3.5 text-amber-400/70 ml-1.5" />
              {(['ALL', 'Mage', 'Rogue', 'Warrior', 'Archer', 'Knight'] as const).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setFilterClass(cls)}
                  className={`px-2.5 py-1 rounded-lg font-['Cinzel'] text-[11px] font-bold transition-colors cursor-pointer ${
                    filterClass === cls
                      ? 'bg-amber-600 text-neutral-950 shadow'
                      : 'text-amber-200/60 hover:text-amber-100'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {deck.length > 0 && (
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  if (confirm('Expunge all player cards from My Deck? This cannot be undone.')) {
                    onClearDeck();
                  }
                }}
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 border border-rose-900/50 transition-colors font-['Cinzel'] font-bold cursor-pointer"
              >
                Clear Deck
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DECK CARDS GRID */}
      {deck.length === 0 ? (
        <div className="p-12 text-center rounded-3xl parchment-card border border-amber-900/40 space-y-3">
          <Layers className="w-12 h-12 mx-auto text-amber-400/30 animate-pulse" />
          <h3 className="text-xl font-bold font-almendra text-amber-200/80">
            Your Deck is Currently Empty
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-sans leading-relaxed">
            Forge a hero above, customize their portrait and backstory, then click <strong className="text-amber-300 font-bold">"Save to Deck"</strong> to add your first collectible fantasy card here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeck.map((char) => {
            const ClassIcon = CLASS_ICONS[char.characterClass];
            const isActive = char.id === activeCardId;
            const borderGlow = rarityBorders[char.rarity || 'Common'];

            return (
              <div
                key={char.id}
                onClick={() => {
                  soundManager.playClickSound();
                  onSelectCard(char);
                }}
                className={`relative rounded-2xl parchment-card border-2 ${borderGlow} p-4 space-y-3 cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-xl flex flex-col justify-between ${
                  isActive ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0b0907]' : ''
                }`}
              >
                {/* Active Indicator Pin */}
                {isActive && (
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950 shadow font-['Cinzel'] z-20">
                    Active On Workbench
                  </div>
                )}

                {/* Card Mini Header */}
                <div className="flex items-start justify-between gap-2 border-b border-amber-900/40 pb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-amber-300/80 font-['Cinzel']">
                        {char.characterClass}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300/90 border border-amber-700/40">
                        {char.rarity}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold font-almendra text-amber-100 group-hover:text-amber-300 truncate">
                      {char.name}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#19110b] border border-amber-500/30 flex-shrink-0" style={{ color: char.colorTheme.accent }}>
                    <ClassIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Mini Illustration */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#0d0906] border border-amber-900/50 shadow-inner flex items-center justify-center">
                  {char.portraitUrl ? (
                    <img
                      src={char.portraitUrl}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <ClassIcon className="w-8 h-8 opacity-40 mb-1" style={{ color: char.colorTheme.accent }} />
                      <span className="text-[10px] text-neutral-500 font-medieval">No Portrait Inscribed</span>
                    </div>
                  )}

                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-amber-200 font-bold font-cinzel-dec">
                    LVL {char.level}
                  </div>
                </div>

                {/* Card Stats Display (Health, Mana, Strength) */}
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#0e0906] border border-amber-900/40 text-center font-['Cinzel']">
                  <div className="p-1 rounded bg-[#180f0a] border border-red-900/40">
                    <div className="text-[9px] text-red-400 flex items-center justify-center gap-0.5">
                      <Heart className="w-2.5 h-2.5" /> HP
                    </div>
                    <div className="text-xs font-bold text-red-200 font-almendra">
                      {char.cardStats?.health ?? char.stats?.maxHp ?? 100}
                    </div>
                  </div>

                  <div className="p-1 rounded bg-[#0a1018] border border-sky-900/40">
                    <div className="text-[9px] text-sky-400 flex items-center justify-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> MP
                    </div>
                    <div className="text-xs font-bold text-sky-200 font-almendra">
                      {char.cardStats?.mana ?? char.stats?.powerPoints ?? 80}
                    </div>
                  </div>

                  <div className="p-1 rounded bg-[#18120a] border border-amber-900/40">
                    <div className="text-[9px] text-amber-400 flex items-center justify-center gap-0.5">
                      <Sword className="w-2.5 h-2.5" /> STR
                    </div>
                    <div className="text-xs font-bold text-amber-200 font-almendra">
                      {char.cardStats?.strength ?? char.stats?.strength ?? 70}
                    </div>
                  </div>
                </div>

                {/* Backstory snippet */}
                <div className="p-2.5 rounded-xl bg-[#140e09] border border-amber-900/40 min-h-[44px]">
                  <p className="text-xs text-amber-200/90 italic font-medieval line-clamp-2 leading-relaxed">
                    "{char.backstory}"
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-900/30 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClickSound();
                      onSelectCard(char);
                    }}
                    type="button"
                    className="flex items-center gap-1 text-[11px] font-bold font-['Cinzel'] text-amber-300 hover:text-amber-100 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View / Load</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyCard(char, e)}
                      type="button"
                      className="p-1.5 rounded-lg text-amber-300/70 hover:text-amber-100 hover:bg-[#20150d] transition-colors cursor-pointer"
                      title="Transcribe card to clipboard"
                    >
                      {copiedId === char.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Scroll className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClickSound();
                        onRemoveFromDeck(char.id);
                      }}
                      type="button"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove from My Deck"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
