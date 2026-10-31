export type CharacterClassType = 'Mage' | 'Rogue' | 'Warrior' | 'Archer' | 'Knight';

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  maxHp: number;
  powerPoints: number;
  powerType: 'Mana' | 'Stamina' | 'Holy Favor' | 'Focus';
}

export interface PlayerCardStats {
  health: number; // 50 - 200
  mana: number;   // 20 - 150
  strength: number; // 30 - 120
}

export interface Character {
  id: string;
  name: string;
  title?: string;
  fullName: string;
  characterClass: CharacterClassType;
  subclass: string;
  race: string;
  alignment: string;
  level: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  cardStats: PlayerCardStats;
  stats: CharacterStats;
  equipment: {
    weapon: string;
    armor: string;
    relic: string;
  };
  abilities: string[];
  quirk: string;
  motto: string;
  backstory: string;
  colorTheme: {
    primary: string;
    accent: string;
    border: string;
    badgeBg: string;
  };
  portraitUrl?: string;
  portraitSeed?: number;
  generatedAt: number;
}
