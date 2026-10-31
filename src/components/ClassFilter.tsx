import React from 'react';
import { CharacterClassType } from '../types/character';
import { Wand2, Sword, Crosshair, Shield, Sparkles } from 'lucide-react';

export const RogueIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 9.5 5 19l-2 2 2-2 2-2 9.5-9.5" />
    <path d="M14 6l4 4" />
    <path d="M19 3l2 2-4 4-2-2z" />
    <path d="M11 11l-2 2" />
  </svg>
);

export const CLASS_ICONS: Record<CharacterClassType, React.ElementType> = {
  Mage: Wand2,
  Rogue: RogueIcon,
  Warrior: Sword,
  Archer: Crosshair,
  Knight: Shield
};

export const CLASS_BADGE_COLORS: Record<CharacterClassType, { bg: string; text: string; ring: string }> = {
  Mage: { bg: 'bg-purple-950/80', text: 'text-purple-300', ring: 'ring-purple-500/40' },
  Rogue: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', ring: 'ring-emerald-500/40' },
  Warrior: { bg: 'bg-rose-950/80', text: 'text-rose-300', ring: 'ring-rose-500/40' },
  Archer: { bg: 'bg-amber-950/80', text: 'text-amber-300', ring: 'ring-amber-500/40' },
  Knight: { bg: 'bg-sky-950/80', text: 'text-sky-300', ring: 'ring-sky-500/40' }
};

export interface ClassFilterProps {
  selectedClass: CharacterClassType | 'ANY';
  onSelectClass: (cls: CharacterClassType | 'ANY') => void;
}

export const ClassFilter: React.FC<ClassFilterProps> = ({ selectedClass, onSelectClass }) => {
  const classes: Array<CharacterClassType | 'ANY'> = ['ANY', 'Mage', 'Rogue', 'Warrior', 'Archer', 'Knight'];

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#d97706]" />
        <span className="text-[11px] uppercase tracking-widest text-amber-200/70 font-bold font-['Cinzel']">
          Select Transmutation Circle (Class Focus)
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#d97706]" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#120d08] border border-amber-900/50 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {classes.map((cls) => {
          const isSelected = selectedClass === cls;
          const Icon = cls === 'ANY' ? Sparkles : CLASS_ICONS[cls];

          return (
            <button
              key={cls}
              onClick={() => onSelectClass(cls)}
              type="button"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-['Cinzel'] tracking-wide transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 shadow-[0_0_14px_rgba(212,175,55,0.4)] scale-[1.02] border border-amber-200/80 font-black'
                  : 'text-amber-200/60 hover:text-amber-100 hover:bg-[#20150d] border border-transparent hover:border-amber-900/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-neutral-950' : 'text-amber-400/80'}`} />
              <span>{cls === 'ANY' ? 'All Arcana' : cls}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
