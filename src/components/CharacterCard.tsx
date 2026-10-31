import React, { useState } from 'react';
import { Character } from '../types/character';
import { CLASS_ICONS } from './ClassFilter';
import { formatCharacterSheetText } from '../utils/characterGenerator';
import { AntiqueCorner, AlchemyCircle, AlchemyVial } from './AlchemyWorkbenchDecor';
import { 
  Heart, 
  Zap, 
  ShieldCheck, 
  Swords, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  Flame, 
  Quote,
  Compass,
  Dices,
  Feather,
  Paintbrush,
  RefreshCw,
  Loader2,
  AlertCircle,
  Scroll
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CharacterCardProps {
  character: Character;
  isSaved: boolean;
  onToggleSave: (char: Character) => void;
  onRerollStats: () => void;
  onRerollName: () => void;
  onGeneratePortrait: () => void;
  onRegeneratePortrait: () => void;
  isGeneratingPortrait: boolean;
  portraitError?: string | null;
  onUseFallbackPortrait?: () => void;
  onGenerateBackstory: () => void;
  isGeneratingBackstory: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSaved,
  onToggleSave,
  onRerollStats,
  onRerollName,
  onGeneratePortrait,
  onRegeneratePortrait,
  isGeneratingPortrait,
  portraitError,
  onUseFallbackPortrait,
  onGenerateBackstory,
  isGeneratingBackstory
}) => {
  const [copied, setCopied] = useState(false);
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

  const getModifier = (val: number) => {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const statsList = [
    { key: 'STR', label: 'Strength', val: character.stats.strength },
    { key: 'DEX', label: 'Dexterity', val: character.stats.dexterity },
    { key: 'CON', label: 'Constitution', val: character.stats.constitution },
    { key: 'INT', label: 'Intelligence', val: character.stats.intelligence },
    { key: 'WIS', label: 'Wisdom', val: character.stats.wisdom },
    { key: 'CHA', label: 'Charisma', val: character.stats.charisma }
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl parchment-card antique-gold-border text-[#f5ebd9] transition-all duration-300 overflow-hidden shadow-2xl">
      {/* 4 Antique Gold Corner Filigrees */}
      <AntiqueCorner position="top-left" className="w-10 h-10" />
      <AntiqueCorner position="top-right" className="w-10 h-10" />
      <AntiqueCorner position="bottom-left" className="w-10 h-10" />
      <AntiqueCorner position="bottom-right" className="w-10 h-10" />

      {/* Background Watermark Alchemy Circle */}
      <div className="absolute right-[-100px] top-[-100px] pointer-events-none opacity-20">
        <AlchemyCircle className="w-[520px] h-[520px] animate-transmute-spin" opacity={0.25} />
      </div>
      <div className="absolute left-[-120px] bottom-[-120px] pointer-events-none opacity-15">
        <AlchemyCircle className="w-[480px] h-[480px] animate-reverse-spin" opacity={0.2} />
      </div>

      {/* Brass Rivets on the Border Edge */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-60">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#d97706]" />
        <span className="w-3 h-0.5 bg-amber-600/50" />
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#d97706]" />
      </div>

      {/* TOP HEADER: Illuminated Manuscript Title & Crest */}
      <div className="relative p-6 sm:p-8 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-black/40 to-amber-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            
            {/* Alchemical Astrolabe Crest / Avatar */}
            <div className="relative flex-shrink-0">
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center border-2 border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] bg-gradient-to-br from-[#1e150d] via-[#120d08] to-[#0a0705] group relative overflow-hidden"
              >
                {/* Concentric rotating glyph ring behind the icon */}
                <div className="absolute inset-0 border border-dashed border-amber-400/30 rounded-full scale-125 animate-transmute-spin pointer-events-none" />
                <ClassIcon 
                  className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] z-10" 
                  style={{ color: character.colorTheme.accent }}
                />
              </div>

              {/* Stamped Wax Seal Level Badge */}
              <div 
                className="absolute -bottom-2.5 -right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-amber-700 to-amber-900 border border-amber-300/60 text-amber-100 shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-cinzel-dec"
              >
                Lv {character.level}
              </div>
            </div>

            {/* Character Name & Lineage */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-widest text-amber-300/80 font-bold font-['Cinzel'] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {character.race} • {character.alignment}
                </span>
              </div>
              
              {/* STYLIZED FANTASY FONT CHARACTER NAME */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide font-almendra text-transparent bg-clip-text bg-gradient-to-r from-[#fff3d4] via-[#fcd34d] to-[#d97706] drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)] leading-tight">
                {character.name}
              </h2>

              {character.title && (
                <div className="text-base sm:text-lg font-medieval italic text-amber-200/90 tracking-wide">
                  ~ {character.title} ~
                </div>
              )}

              {/* Class & Transmutation Specialization Banner */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-amber-950/80 to-[#2a1b0d] text-amber-200 border border-amber-500/50 shadow-inner">
                  <span className="text-amber-400/70 text-[10px]">CLASS:</span>
                  <span className="text-[#fef08a] font-black underline decoration-amber-400/60 underline-offset-4">
                    {character.characterClass}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#16100a] text-neutral-300 border border-amber-900/40">
                  <span className="text-amber-400/60 text-[10px] uppercase">Discipline:</span>
                  <span className="text-amber-100 font-semibold">{character.subclass}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Action Wax Seal Buttons */}
          <div className="flex items-center gap-2.5 self-end md:self-center">
            <button
              onClick={() => {
                soundManager.playSaveSound();
                onToggleSave(character);
              }}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase font-['Cinzel'] transition-all duration-200 cursor-pointer ${
                isSaved
                  ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 border border-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : 'bg-[#18110b] text-amber-200/80 border border-amber-900/60 hover:text-amber-100 hover:border-amber-500/60 hover:bg-[#251b12]'
              }`}
              title={isSaved ? "Preserved in Alchemical Codex" : "Preserve in Alchemical Codex"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-300" /> : <Bookmark className="w-4 h-4 text-amber-400" />}
              <span>{isSaved ? 'In Codex' : 'Preserve'}</span>
            </button>

            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase font-['Cinzel'] bg-[#18110b] text-amber-200/80 border border-amber-900/60 hover:text-amber-100 hover:border-amber-500/60 hover:bg-[#251b12] transition-all duration-200 cursor-pointer"
              title="Transcribe dossier to scroll (copy to clipboard)"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Scroll className="w-4 h-4 text-amber-400" />}
              <span>{copied ? 'Transcribed!' : 'Transcribe'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN WORKBENCH SECTION */}
      <div className="p-6 sm:p-8 space-y-7 relative z-10">

        {/* CHARACTER PORTRAIT SECTION: Gilded Scrying Glass Frame */}
        <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#1b140d]/90 via-[#140e09]/95 to-[#0e0a06]/95 border border-amber-500/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_8px_24px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle transmutation glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-7">
            
            {/* Antique Scrying Glass / Portrait Frame */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-[#0d0906] shadow-[0_0_25px_rgba(212,175,55,0.2)] flex items-center justify-center group">
              {/* Corner brass braces */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400 z-10 pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400 z-10 pointer-events-none" />

              {character.portraitUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={character.portraitUrl}
                    alt={`${character.name} the ${character.characterClass} portrait`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Antique glass sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-amber-200/10 pointer-events-none" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center space-y-2.5">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center bg-[#1e150d] border border-amber-500/30 shadow-inner"
                    style={{ color: character.colorTheme.accent }}
                  >
                    <ClassIcon className="w-8 h-8 opacity-80" />
                  </div>
                  <div className="text-xs font-bold tracking-wider uppercase font-['Cinzel'] text-amber-200/90">
                    Awaiting Vision
                  </div>
                  <div className="text-[11px] text-amber-300/50 max-w-[150px] leading-tight font-sans">
                    Invoke the scrying glass to reveal {character.name}'s visage
                  </div>
                </div>
              )}

              {/* Alchemical Incantation / Loading Overlay */}
              {isGeneratingPortrait && (
                <div className="absolute inset-0 bg-[#0d0906]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2.5 p-3 text-center z-20 animate-fadeIn">
                  <div className="relative">
                    <Loader2 className="w-9 h-9 text-amber-400 animate-spin" />
                    <Sparkles className="w-4 h-4 text-amber-200 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold font-cinzel-dec text-amber-200 tracking-wider">
                    Transmuting Visage...
                  </span>
                  <span className="text-[10px] text-amber-300/60 font-medieval">
                    Synthesizing cartoon fantasy concept art
                  </span>
                </div>
              )}
            </div>

            {/* Scrying Glass Controls & Information */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest font-['Cinzel'] mb-1">
                  <AlchemyVial type="mana" className="w-4 h-4 inline-block" />
                  <span>Alchemical Scrying Glass</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-almendra text-[#fff1d0] tracking-wide">
                  {character.portraitUrl ? 'Revealed Visage' : 'Conjure Character Portrait'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl font-sans">
                  Summon a stylized cartoon / video game concept art portrait capturing{' '}
                  <strong className="text-amber-300 font-almendra text-base">{character.name}</strong> as a legendary{' '}
                  <span className="text-amber-200 underline decoration-amber-500/50">{character.race} {character.characterClass}</span>.
                </p>
              </div>

              {/* THE TWO EXPLICIT PORTRAIT BUTTONS */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {/* 1. Generate Portrait */}
                <button
                  onClick={onGeneratePortrait}
                  disabled={isGeneratingPortrait}
                  type="button"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase font-['Cinzel'] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-[0_0_18px_rgba(212,175,55,0.4)] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-amber-200/60"
                  title="Generate a unique cartoon/video game style portrait"
                >
                  {isGeneratingPortrait ? (
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  ) : (
                    <Paintbrush className="w-4 h-4 text-neutral-950" />
                  )}
                  <span>Generate Portrait</span>
                </button>

                {/* 2. Regenerate Portrait */}
                <button
                  onClick={onRegeneratePortrait}
                  disabled={isGeneratingPortrait}
                  type="button"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase font-['Cinzel'] bg-[#1a120b] hover:bg-[#251910] text-amber-200 border border-amber-500/50 hover:border-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Generate a completely new portrait for this character"
                >
                  {isGeneratingPortrait ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                  )}
                  <span>Regenerate Portrait</span>
                </button>
              </div>

              {/* Error or Fallback Notice */}
              {portraitError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{portraitError}</span>
                  </div>
                  {onUseFallbackPortrait && (
                    <button
                      onClick={onUseFallbackPortrait}
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/50 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Instant Alchemical Artwork
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ALCHEMICAL ELIXIR VITALS (HP & RESOURCE POOL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Vitality Elixir (HP) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b120c] to-[#140d08] border border-amber-900/40 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-700/60 text-red-400 shadow-[0_0_12px_rgba(220,38,38,0.3)]">
                <AlchemyVial type="elixir" className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-amber-300/70 font-bold font-['Cinzel']">
                  Elixir of Life (Hit Points)
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-almendra text-red-200">
                  {character.stats.maxHp} <span className="text-xs font-sans text-red-400/80 font-normal">HP</span>
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-amber-300/50 font-medieval hidden sm:block">
              Constitution Infusion
            </div>
          </div>

          {/* Power Draught (Mana / Stamina / Focus / Holy Favor) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b120c] to-[#140d08] border border-amber-900/40 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-600/60 text-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.3)]">
                <AlchemyVial type="transmutation" className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-amber-300/70 font-bold font-['Cinzel']">
                  {character.stats.powerType} Essence
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-almendra text-amber-200">
                  {character.stats.powerPoints} <span className="text-xs font-sans text-amber-400/80 font-normal">PTS</span>
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-amber-300/50 font-medieval hidden sm:block">
              Reagent Capacity
            </div>
          </div>

        </div>

        {/* CORE ALCHEMICAL ATTRIBUTES (STR, DEX, CON, INT, WIS, CHA) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#140e09]/90 border border-amber-900/50 relative shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <h3 className="text-xs uppercase tracking-widest font-bold text-amber-200 font-['Cinzel']">
                Transmutation Attributes & Balance
              </h3>
            </div>
            <button
              onClick={() => {
                soundManager.playClickSound();
                onRerollStats();
              }}
              type="button"
              className="flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-200 font-['Cinzel'] transition-colors cursor-pointer"
              title="Re-cast attribute balance"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Cast Dice</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statsList.map((stat) => {
              const modifier = getModifier(stat.val);
              const percent = Math.min(100, Math.max(10, Math.round((stat.val / 20) * 100)));

              return (
                <div
                  key={stat.key}
                  className="p-3.5 rounded-xl bg-gradient-to-b from-[#1d140d] to-[#120d08] border border-amber-900/40 flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-amber-300/80 font-['Cinzel']">{stat.key}</span>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50 shadow-inner">
                      {modifier}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-almendra text-[#fff3d4] my-0.5 drop-shadow">
                    {stat.val}
                  </div>
                  <div className="text-[10px] text-amber-200/50 truncate mb-2">
                    {stat.label}
                  </div>
                  {/* Glowing alchemical progress tube */}
                  <div className="w-full bg-[#0a0705] rounded-full h-1.5 overflow-hidden border border-amber-900/40">
                    <div
                      className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ALCHEMICAL LOADOUT: ARTIFACTS & ARMAMENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#140e09]/80 border border-amber-900/40">
            <div className="flex items-center gap-2 mb-2">
              <Swords className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300/80 font-['Cinzel']">
                Forged Armament
              </span>
            </div>
            <div className="text-sm font-semibold text-amber-100 font-medieval">
              {character.equipment.weapon}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#140e09]/80 border border-amber-900/40">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300/80 font-['Cinzel']">
                Tempered Aegis
              </span>
            </div>
            <div className="text-sm font-semibold text-neutral-200 font-medieval">
              {character.equipment.armor}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#140e09]/80 border border-amber-900/40">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300/80 font-['Cinzel']">
                Alchemical Relic
              </span>
            </div>
            <div className="text-sm font-semibold text-purple-200 font-medieval">
              {character.equipment.relic}
            </div>
          </div>
        </div>

        {/* TRANSMUTATION ABILITIES & SPELLCRAFT */}
        <div className="p-5 rounded-xl bg-[#140e09]/80 border border-amber-900/40">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-amber-200 font-['Cinzel']">
              Combat Incantations & Arcane Feats
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {character.abilities.map((ability, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1c140d] border border-amber-900/50"
              >
                <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-300 font-cinzel-dec">
                  {idx + 1}
                </div>
                <span className="text-sm font-medium text-amber-100 font-medieval">
                  {ability}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ILLUMINATED CHRONICLE & ORIGIN STORY SECTION */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1b140d]/95 to-[#120d08]/95 border border-amber-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.7)] relative overflow-hidden space-y-4">
          
          {/* Header with Title and the "Generate Backstory" Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-3.5">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm uppercase tracking-widest font-bold text-amber-200 font-['Cinzel']">
                  Character Origin Story & Chronicle
                </h3>
                <p className="text-[11px] text-amber-300/60 font-medieval">
                  Origin lore tuned to {character.name}'s {character.characterClass} discipline & personality
                </p>
              </div>
            </div>

            {/* THE REQUIRED "Generate Backstory" BUTTON */}
            <div className="flex items-center gap-2">
              <button
                onClick={onGenerateBackstory}
                disabled={isGeneratingBackstory}
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase font-['Cinzel'] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-[0_0_15px_rgba(212,175,55,0.35)] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-amber-200/60"
                title="Generate a unique 1-2 sentence origin story matching name, class, and personality"
              >
                {isGeneratingBackstory ? (
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                ) : (
                  <Feather className="w-4 h-4 text-neutral-950" />
                )}
                <span>Generate Backstory</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClickSound();
                  onRerollName();
                }}
                type="button"
                className="px-2.5 py-2 rounded-xl text-xs text-amber-400/70 hover:text-amber-200 hover:bg-[#251910] border border-amber-900/40 transition-colors cursor-pointer"
                title="Re-inscribe character identity and titles"
              >
                <span>Re-Name</span>
              </button>
            </div>
          </div>

          {/* Displayed Generated Backstory */}
          <div className="relative p-4 sm:p-5 rounded-xl bg-[#0e0906]/85 border border-amber-900/50">
            {isGeneratingBackstory ? (
              <div className="flex items-center gap-3 py-2 text-amber-300/80 animate-pulse font-medieval">
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                <span>Inscribing a unique origin story matching {character.name}'s soul...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-base sm:text-lg text-[#fff1d6] leading-relaxed font-medieval tracking-wide">
                  "{character.backstory}"
                </p>

                {/* Personality & Class harmony indicator */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-900/30 text-[11px] text-amber-300/70">
                  <span className="font-['Cinzel'] font-bold text-amber-400">Harmony:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-900/40">
                    {character.characterClass} Arcana
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-900/40">
                    {character.alignment}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-900/40 italic">
                    "{character.quirk}"
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quirk and Creed Sub-panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#140e09]/80 border border-amber-900/40 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400/80 mb-1 font-['Cinzel']">
                Inherent Personality Quirk
              </div>
              <div className="text-xs sm:text-sm text-amber-200/90 italic font-medieval">
                "{character.quirk}"
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#140e09]/80 border border-amber-900/40 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400/80 mb-1 font-['Cinzel']">
                Sacred Motto & Creed
              </div>
              <div className="text-xs sm:text-sm text-amber-100/90 italic font-almendra">
                "{character.motto}"
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
