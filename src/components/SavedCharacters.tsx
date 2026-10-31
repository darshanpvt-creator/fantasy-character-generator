import React from 'react';
import { Character } from '../types/character';
import { CLASS_ICONS } from './ClassFilter';
import { AntiqueCorner, AlchemyCircle } from './AlchemyWorkbenchDecor';
import { Trash2, ExternalLink, X, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SavedCharactersProps {
  characters: Character[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onClearAll: () => void;
}

export const SavedCharacters: React.FC<SavedCharactersProps> = ({
  characters,
  isOpen,
  onClose,
  onSelectCharacter,
  onDeleteCharacter,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl parchment-card antique-gold-border text-[#f5ebd9] shadow-2xl overflow-hidden">
        {/* Antique Gold Corner Filigree */}
        <AntiqueCorner position="top-left" className="w-8 h-8" />
        <AntiqueCorner position="top-right" className="w-8 h-8" />
        <AntiqueCorner position="bottom-left" className="w-8 h-8" />
        <AntiqueCorner position="bottom-right" className="w-8 h-8" />

        {/* Ambient alchemy circle watermark */}
        <div className="absolute right-[-60px] top-[-60px] pointer-events-none opacity-10">
          <AlchemyCircle className="w-80 h-80 animate-transmute-spin" opacity={0.2} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-amber-500/20 bg-[#16100a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-400/50 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              <BookOpen className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-almendra text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-300">
                Alchemical Codex ({characters.length})
              </h3>
              <p className="text-xs text-amber-200/60 font-medieval">
                Grimoire of Preserved Champions & Homunculi
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {characters.length > 0 && (
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  if (confirm('Expunge all preserved champions from this codex?')) {
                    onClearAll();
                  }
                }}
                type="button"
                className="px-3 py-1 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 rounded-lg border border-rose-800/40 transition-colors cursor-pointer font-['Cinzel'] font-bold"
              >
                Expunge All
              </button>
            )}
            <button
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
              type="button"
              className="p-1.5 rounded-lg text-amber-300/70 hover:text-amber-100 hover:bg-[#261b11] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Preserved Characters */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 relative z-10">
          {characters.length === 0 ? (
            <div className="text-center py-14 text-neutral-400 space-y-2">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30 text-amber-400" />
              <p className="text-base font-bold font-almendra text-amber-200/70">The Codex Lies Empty</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans leading-relaxed">
                Click "Preserve" on any forged champion to transcribe their essence and portrait into your ancient grimoire.
              </p>
            </div>
          ) : (
            characters.map((char) => {
              const Icon = CLASS_ICONS[char.characterClass];
              return (
                <div
                  key={char.id}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#140e09]/90 border border-amber-900/50 hover:border-amber-500/60 transition-all group shadow-sm"
                >
                  <div
                    onClick={() => {
                      soundManager.playClickSound();
                      onSelectCharacter(char);
                      onClose();
                    }}
                    className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#1d140c] border border-amber-500/30 flex-shrink-0 overflow-hidden shadow-inner"
                      style={{ color: char.colorTheme.accent }}
                    >
                      {char.portraitUrl ? (
                        <img
                          src={char.portraitUrl}
                          alt={char.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-6 h-6 drop-shadow" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base font-almendra text-amber-100 group-hover:text-amber-300 truncate">
                          {char.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/40 font-['Cinzel']">
                          {char.characterClass}
                        </span>
                      </div>
                      <div className="text-xs text-amber-200/50 truncate mt-0.5 font-medieval">
                        {char.race} • {char.subclass} • Lv {char.level}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        onSelectCharacter(char);
                        onClose();
                      }}
                      type="button"
                      className="p-2 rounded-xl text-amber-300 hover:text-amber-100 hover:bg-[#251910] border border-transparent hover:border-amber-700/50 transition-colors cursor-pointer"
                      title="Summon to Workbench"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        onDeleteCharacter(char.id);
                      }}
                      type="button"
                      className="p-2 rounded-xl text-amber-300/60 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-colors cursor-pointer"
                      title="Expunge from Codex"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
