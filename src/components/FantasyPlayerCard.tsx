import React, { useState } from 'react';
import { Character } from '../types/character';
import { CLASS_ICONS } from './ClassFilter';
import { formatCharacterSheetText } from '../utils/characterGenerator';
import { AntiqueCorner, AlchemyCircle, AlchemyVial } from './AlchemyWorkbenchDecor';
import { 
  Heart, 
  Zap, 
  Sword, 
  Sparkles, 
  Check, 
  Dices, 
  Feather, 
  Paintbrush, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  Scroll, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  BookmarkCheck,
  Shield
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FantasyPlayerCardProps {
  character: Character;
  isInDeck: boolean;
  onSaveToDeck: (char: Character) => void;
  onGeneratePortrait: () => void;
  onRegeneratePortrait: () => void;
  isGeneratingPortrait: boolean;
  portraitError?: string | null;
  onUseFallbackPortrait?: () => void;
  onGenerateBackstory: () => void;
  isGeneratingBackstory: boolean;
  onRerollStats: () => void;
  onRerollName: () => void;
}

export const FantasyPlayerCard: React.FC<FantasyPlayerCardProps> = ({
  character,
  isInDeck,
  onSaveToDeck,
  onGeneratePortrait,
  onRegeneratePortrait,
  isGeneratingPortrait,
  portraitError,
  onUseFallbackPortrait,
  onGenerateBackstory,
  isGeneratingBackstory,
  onRerollStats,
  onRerollName
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullStats, setShowFullStats] = useState(false);
  const ClassIcon = CLASS_ICONS[character.characterClass];

  const handleCopy = async () => {
    soundManager.playClickSound();
    const text = formatCharacterSheetText(character);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const rarityColors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    Common: { border: 'border-neutral-500/50', bg: 'bg-neutral-900/80', text: 'text-neutral-300', glow: 'rgba(160,160,160,0.2)' },
    Rare: { border: 'border-sky-500/60', bg: 'bg-sky-950/80', text: 'text-sky-300', glow: 'rgba(56,189,248,0.3)' },
    Epic: { border: 'border-purple-500/60', bg: 'bg-purple-950/80', text: 'text-purple-300', glow: 'rgba(168,85,247,0.35)' },
    Legendary: { border: 'border-amber-400/80', bg: 'bg-amber-950/90', text: 'text-amber-300', glow: 'rgba(251,191,36,0.45)' }
  };
  const rarityStyle = rarityColors[character.rarity || 'Common'];

  // Stat percentage calculation (max ~ 200 for health, 180 for mana, 130 for strength)
  const healthPercent = Math.min(100, Math.round((character.cardStats.health / 180) * 100));
  const manaPercent = Math.min(100, Math.round((character.cardStats.mana / 180) * 100));
  const strengthPercent = Math.min(100, Math.round((character.cardStats.strength / 130) * 100));

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl parchment-card antique-gold-border text-[#f5ebd9] shadow-2xl transition-all duration-300 overflow-hidden">
      {/* 4 Antique Gold Corner Filigrees on the Player Card */}
      <AntiqueCorner position="top-left" className="w-9 h-9" />
      <AntiqueCorner position="top-right" className="w-9 h-9" />
      <AntiqueCorner position="bottom-left" className="w-9 h-9" />
      <AntiqueCorner position="bottom-right" className="w-9 h-9" />

      {/* Background Watermark Alchemy Circle */}
      <div className="absolute right-[-100px] top-[-100px] pointer-events-none opacity-15">
        <AlchemyCircle className="w-[480px] h-[480px] animate-transmute-spin" opacity={0.25} />
      </div>

      {/* Double Gold Card Edge Rim */}
      <div className="absolute inset-2 border border-amber-500/30 rounded-2xl pointer-events-none" />

      {/* CARD HEADER: Name, Class Badge, Rarity & Level */}
      <div className="relative p-5 sm:p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/50 via-[#18110a]/80 to-amber-950/50">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Class Icon Emblem */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#18110b] border-2 border-amber-400/60 shadow-[0_0_12px_rgba(212,175,55,0.3)] flex-shrink-0"
              style={{ color: character.colorTheme.accent }}
            >
              <ClassIcon className="w-7 h-7 drop-shadow" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300/80 font-['Cinzel']">
                  {character.race} • {character.alignment}
                </span>
                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${rarityStyle.border} ${rarityStyle.bg} ${rarityStyle.text} font-cinzel-dec tracking-wider`}>
                  {character.rarity}
                </span>
              </div>
              
              {/* STYLIZED FANTASY CHARACTER NAME */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide font-almendra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4d6] via-[#fcd34d] to-[#d97706] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] truncate">
                {character.name}
              </h2>

              {character.title && (
                <div className="text-xs sm:text-sm font-medieval italic text-amber-200/90 truncate">
                  ~ {character.title} ~
                </div>
              )}
            </div>
          </div>

          {/* Level Gem Badge */}
          <div className="flex-shrink-0 text-center">
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-400/60 shadow-[0_0_10px_rgba(212,175,55,0.3)] text-amber-100 font-cinzel-dec font-bold text-xs tracking-wider">
              LVL {character.level}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-amber-400/60 font-['Cinzel'] mt-1 font-bold">
              {character.characterClass}
            </div>
          </div>

        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-5 sm:p-6 space-y-5 relative z-10">

        {/* 1. CHARACTER PORTRAIT INSIDE CARD */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-[#0d0906] shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {/* Ornate Brass Framing Tabs */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400 z-10 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400 z-10 pointer-events-none" />

          <div className="relative w-full aspect-square max-h-[320px] sm:max-h-[360px] flex items-center justify-center bg-gradient-to-b from-[#18110b] to-[#0d0906]">
            {character.portraitUrl ? (
              <img
                src={character.portraitUrl}
                alt={`${character.name} the ${character.characterClass}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center bg-[#1f150d] border border-amber-500/40 shadow-inner"
                  style={{ color: character.colorTheme.accent }}
                >
                  <ClassIcon className="w-10 h-10 opacity-80 drop-shadow" />
                </div>
                <div className="text-sm font-bold font-almendra text-amber-200">
                  Card Illustration Awaiting Vision
                </div>
                <div className="text-xs text-amber-300/60 max-w-[200px] leading-tight font-sans">
                  Click 'Generate Portrait' below to summon artwork matching {character.name}.
                </div>
              </div>
            )}

            {/* Inscription Loading Spinner */}
            {isGeneratingPortrait && (
              <div className="absolute inset-0 bg-[#0d0906]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-4 text-center z-20 animate-fadeIn">
                <Loader2 className="w-9 h-9 text-amber-400 animate-spin" />
                <span className="text-sm font-bold font-cinzel-dec text-amber-200 tracking-wider">
                  Conjuring Card Portrait...
                </span>
                <span className="text-xs text-amber-300/70 font-medieval">
                  Styling {character.race} {character.characterClass} concept art
                </span>
              </div>
            )}

            {/* Class & Subclass ribbon tag pinned over portrait bottom */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/30 text-xs">
              <span className="font-['Cinzel'] font-bold text-amber-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {character.characterClass}
              </span>
              <span className="text-neutral-300 font-medieval text-[11px]">
                {character.subclass}
              </span>
            </div>
          </div>

          {/* Portrait Action Controls */}
          <div className="p-3 bg-[#140e09] border-t border-amber-900/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onGeneratePortrait}
                disabled={isGeneratingPortrait}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-['Cinzel'] uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 border border-amber-300/50"
              >
                {isGeneratingPortrait ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paintbrush className="w-3.5 h-3.5" />}
                <span>Generate Portrait</span>
              </button>

              <button
                onClick={onRegeneratePortrait}
                disabled={isGeneratingPortrait}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-['Cinzel'] uppercase tracking-wider bg-[#1d140d] hover:bg-[#281b11] text-amber-200 border border-amber-500/40 hover:border-amber-300 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPortrait ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
                <span>Regenerate Portrait</span>
              </button>
            </div>

            {portraitError && onUseFallbackPortrait && (
              <button
                onClick={onUseFallbackPortrait}
                type="button"
                className="text-[11px] text-amber-300 underline hover:text-amber-100 cursor-pointer"
              >
                Instant Cartoon Fallback
              </button>
            )}
          </div>
        </div>

        {/* 2. THREE RANDOMLY GENERATED CHARACTER STATS: HEALTH, MANA, STRENGTH */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#18110b] to-[#120d08] border border-amber-500/30 shadow-inner space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-amber-900/30 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-['Cinzel'] font-bold text-amber-200 tracking-wider uppercase text-[11px]">
                Card Combat Attributes
              </span>
            </div>
            <button
              onClick={() => {
                soundManager.playClickSound();
                onRerollStats();
              }}
              type="button"
              className="flex items-center gap-1 text-[11px] text-amber-400/80 hover:text-amber-200 font-['Cinzel'] cursor-pointer"
              title="Re-roll card stats"
            >
              <Dices className="w-3 h-3" />
              <span>Roll Stats</span>
            </button>
          </div>

          {/* Three Stat Rows: Health, Mana, Strength */}
          <div className="space-y-2.5">
            
            {/* 1. HEALTH */}
            <div className="p-2.5 rounded-xl bg-[#0e0906] border border-red-900/40 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-950/80 border border-red-700/60 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)] flex-shrink-0">
                <Heart className="w-4 h-4 fill-red-500/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-red-300 font-['Cinzel'] uppercase tracking-wider text-[11px]">
                    Health
                  </span>
                  <span className="font-bold font-almendra text-red-200 text-base">
                    {character.cardStats.health} <span className="text-[10px] font-sans text-red-400/80">HP</span>
                  </span>
                </div>
                <div className="w-full bg-[#1c0f0a] rounded-full h-2 overflow-hidden border border-red-950">
                  <div 
                    className="h-full bg-gradient-to-r from-red-700 via-red-500 to-rose-400 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. MANA */}
            <div className="p-2.5 rounded-xl bg-[#0e0906] border border-sky-900/40 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-950/80 border border-sky-700/60 text-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)] flex-shrink-0">
                <Zap className="w-4 h-4 fill-sky-500/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-sky-300 font-['Cinzel'] uppercase tracking-wider text-[11px]">
                    Mana
                  </span>
                  <span className="font-bold font-almendra text-sky-200 text-base">
                    {character.cardStats.mana} <span className="text-[10px] font-sans text-sky-400/80">MP</span>
                  </span>
                </div>
                <div className="w-full bg-[#0a121c] rounded-full h-2 overflow-hidden border border-sky-950">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-700 via-sky-500 to-cyan-300 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(56,189,248,0.6)]"
                    style={{ width: `${manaPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. STRENGTH */}
            <div className="p-2.5 rounded-xl bg-[#0e0906] border border-amber-900/40 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)] flex-shrink-0">
                <Sword className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-300 font-['Cinzel'] uppercase tracking-wider text-[11px]">
                    Strength
                  </span>
                  <span className="font-bold font-almendra text-amber-200 text-base">
                    {character.cardStats.strength} <span className="text-[10px] font-sans text-amber-400/80">STR</span>
                  </span>
                </div>
                <div className="w-full bg-[#1c150a] rounded-full h-2 overflow-hidden border border-amber-950">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-300 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                    style={{ width: `${strengthPercent}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. GENERATED BACKSTORY INSIDE CARD */}
        <div className="p-4 rounded-2xl bg-[#140e09] border border-amber-500/30 shadow-inner space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-amber-900/40 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-['Cinzel'] text-amber-300">
              Origin Backstory
            </span>
            <button
              onClick={onGenerateBackstory}
              disabled={isGeneratingBackstory}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-['Cinzel'] uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50 border border-amber-200/50"
              title="Generate a unique 1-2 sentence origin story"
            >
              {isGeneratingBackstory ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Feather className="w-3.5 h-3.5" />}
              <span>Generate Backstory</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0906] border border-amber-900/40 min-h-[60px] flex items-center">
            {isGeneratingBackstory ? (
              <div className="flex items-center gap-2 text-xs text-amber-300/80 animate-pulse font-medieval">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Inscribing fresh origin lore for {character.name}...</span>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-[#fff1d6] leading-relaxed font-medieval tracking-wide">
                "{character.backstory}"
              </p>
            )}
          </div>
        </div>

        {/* 4. EXPANDABLE RPG DOSSIER ATTRIBUTES & ARMS */}
        <div className="border-t border-amber-900/30 pt-3">
          <button
            onClick={() => setShowFullStats(!showFullStats)}
            type="button"
            className="w-full flex items-center justify-between text-xs text-amber-300/70 hover:text-amber-100 font-['Cinzel'] font-bold cursor-pointer transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{showFullStats ? 'Hide Extended RPG Specifications' : 'View Extended RPG Specifications (D&D Stats, Arms & Abilities)'}</span>
            </span>
            {showFullStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFullStats && (
            <div className="mt-3 p-4 rounded-xl bg-[#0e0906] border border-amber-900/40 space-y-3 text-xs animate-fadeIn">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-['Cinzel']">
                <div className="p-2 rounded bg-[#18110b] border border-amber-900/40">
                  <div className="text-[10px] text-amber-400">STR</div>
                  <div className="text-sm font-bold text-amber-100">{character.stats.strength}</div>
                </div>
                <div className="p-2 rounded bg-[#18110b] border border-amber-900/40">
                  <div className="text-[10px] text-amber-400">DEX</div>
                  <div className="text-sm font-bold text-amber-100">{character.stats.dexterity}</div>
                </div>
                <div className="p-2 rounded bg-[#18110b] border border-amber-900/40">
                  <div className="text-[10px] text-amber-400">CON</div>
                  <div className="text-sm font-bold text-amber-100">{character.stats.constitution}</div>
                </div>
                <div className="p-2 rounded bg-[#18110b] border border-amber-900/40">
                  <div className="text-[10px] text-amber-400">INT</div>
                  <div className="text-sm font-bold text-amber-100">{character.stats.intelligence}</div>
                </div>
                <div className="p-2 rounded bg-[#18110b] border border-amber-900/40">
                  <div className="text-[10px] text-amber-400">WIS</div>
                  <div className="text-sm font-bold text-amber-100">{character.stats.wisdom}</div>
                </div>
                <div className="p-2 rounded bg-[#18110b] border border-amber-900/40">
                  <div className="text-[10px] text-amber-400">CHA</div>
                  <div className="text-sm font-bold text-amber-100">{character.stats.charisma}</div>
                </div>
              </div>

              <div className="text-[11px] text-neutral-300 font-sans space-y-1 pt-1 border-t border-amber-900/30">
                <div><strong>Weapon:</strong> {character.equipment.weapon}</div>
                <div><strong>Armor:</strong> {character.equipment.armor}</div>
                <div><strong>Relic:</strong> {character.equipment.relic}</div>
                <div><strong>Quirk:</strong> <em className="text-amber-200">"{character.quirk}"</em></div>
              </div>
            </div>
          )}
        </div>

        {/* 5. PRIMARY ACTION: "Save to Deck" BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              soundManager.playSaveSound();
              onSaveToDeck(character);
            }}
            type="button"
            className={`flex-1 w-full py-4 px-6 rounded-2xl font-cinzel-dec text-base font-black tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
              isInDeck
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 border-2 border-amber-200/90 shadow-[0_0_20px_rgba(212,175,55,0.45)]'
            }`}
            title="Save this player card with portrait, name, class, backstory and stats into My Deck"
          >
            {isInDeck ? (
              <>
                <BookmarkCheck className="w-5 h-5 text-white" />
                <span>Card In My Deck</span>
              </>
            ) : (
              <>
                <Layers className="w-5 h-5 text-neutral-950" />
                <span>Save to Deck</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:w-auto px-5 py-4 rounded-2xl font-['Cinzel'] text-xs font-bold tracking-wider uppercase bg-[#18110b] hover:bg-[#251910] text-amber-200 border border-amber-500/40 hover:border-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
            title="Transcribe card sheet to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Scroll className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Transcribed!' : 'Transcribe'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
