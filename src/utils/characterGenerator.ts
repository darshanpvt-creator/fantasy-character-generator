import { Character, CharacterClassType, CharacterStats, PlayerCardStats } from '../types/character';
import {
  CLASS_DEFINITIONS,
  FIRST_NAMES,
  SURNAMES,
  TITLES,
  RACES,
  ALIGNMENTS,
  PERSONALITY_QUIRKS
} from '../data/characterData';
import { generateTailoredBackstory } from './backstoryGenerator';

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCharacter(
  targetClass?: CharacterClassType | 'ANY',
  level: number = 1
): Character {
  const availableClasses: CharacterClassType[] = ['Mage', 'Rogue', 'Warrior', 'Archer', 'Knight'];
  
  const selectedClass: CharacterClassType =
    targetClass && targetClass !== 'ANY'
      ? targetClass
      : getRandomItem(availableClasses);

  const classDef = CLASS_DEFINITIONS[selectedClass];

  const firstName = getRandomItem(FIRST_NAMES);
  const surname = getRandomItem(SURNAMES);
  const hasTitle = Math.random() > 0.4;
  const title = hasTitle ? getRandomItem(TITLES) : undefined;
  const fullName = title ? `${firstName} ${surname} ${title}` : `${firstName} ${surname}`;

  // Roll stats based on class affinities with variation
  const statRoll = (base: number) => {
    const variance = getRandomInt(-2, 3);
    const levelBonus = Math.floor((level - 1) * 0.75);
    return Math.max(7, Math.min(24, base + variance + levelBonus));
  };

  const strength = statRoll(classDef.statAffinities.strength);
  const dexterity = statRoll(classDef.statAffinities.dexterity);
  const constitution = statRoll(classDef.statAffinities.constitution);
  const intelligence = statRoll(classDef.statAffinities.intelligence);
  const wisdom = statRoll(classDef.statAffinities.wisdom);
  const charisma = statRoll(classDef.statAffinities.charisma);

  // HP and Power calculations
  const conBonus = Math.floor((constitution - 10) / 2);
  let baseHp = 10;
  if (selectedClass === 'Warrior') baseHp = 14;
  if (selectedClass === 'Knight') baseHp = 13;
  if (selectedClass === 'Archer') baseHp = 10;
  if (selectedClass === 'Rogue') baseHp = 9;
  if (selectedClass === 'Mage') baseHp = 8;

  const maxHp = Math.max(12, (baseHp + conBonus) * level + getRandomInt(2, 6));

  let powerPoints = 100;
  if (classDef.powerType === 'Mana') {
    powerPoints = intelligence * 8 + wisdom * 4 + level * 10;
  } else if (classDef.powerType === 'Stamina') {
    powerPoints = constitution * 6 + strength * 4 + level * 8;
  } else if (classDef.powerType === 'Focus') {
    powerPoints = dexterity * 7 + wisdom * 5 + level * 9;
  } else {
    powerPoints = charisma * 7 + strength * 5 + level * 9;
  }

  const stats: CharacterStats = {
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    maxHp,
    powerPoints,
    powerType: classDef.powerType
  };

  // Three primary player card stats: Health, Mana, Strength
  let cardHealth = 100;
  let cardMana = 80;
  let cardStrength = 70;
  const lvlMod = (level - 1) * 5;

  switch (selectedClass) {
    case 'Warrior':
      cardHealth = getRandomInt(125, 175) + lvlMod;
      cardMana = getRandomInt(30, 65) + lvlMod;
      cardStrength = getRandomInt(85, 125) + lvlMod;
      break;
    case 'Knight':
      cardHealth = getRandomInt(115, 160) + lvlMod;
      cardMana = getRandomInt(65, 115) + lvlMod;
      cardStrength = getRandomInt(75, 110) + lvlMod;
      break;
    case 'Mage':
      cardHealth = getRandomInt(65, 95) + lvlMod;
      cardMana = getRandomInt(125, 185) + lvlMod;
      cardStrength = getRandomInt(35, 65) + lvlMod;
      break;
    case 'Rogue':
      cardHealth = getRandomInt(80, 115) + lvlMod;
      cardMana = getRandomInt(55, 95) + lvlMod;
      cardStrength = getRandomInt(65, 100) + lvlMod;
      break;
    case 'Archer':
      cardHealth = getRandomInt(80, 120) + lvlMod;
      cardMana = getRandomInt(60, 105) + lvlMod;
      cardStrength = getRandomInt(70, 105) + lvlMod;
      break;
  }

  const cardStats: PlayerCardStats = {
    health: cardHealth,
    mana: cardMana,
    strength: cardStrength
  };

  // Card Rarity
  const rarityRoll = Math.random();
  const rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' =
    rarityRoll > 0.9
      ? 'Legendary'
      : rarityRoll > 0.65
      ? 'Epic'
      : rarityRoll > 0.35
      ? 'Rare'
      : 'Common';

  // Pick 3 abilities randomly without duplicates
  const shuffledAbilities = [...classDef.abilities].sort(() => 0.5 - Math.random());
  const selectedAbilities = shuffledAbilities.slice(0, 3);

  const race = getRandomItem(RACES);
  const alignment = getRandomItem(ALIGNMENTS);
  const quirk = getRandomItem(PERSONALITY_QUIRKS);
  const motto = getRandomItem(classDef.quotes);

  const initialCharPartial: Character = {
    id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: `${firstName} ${surname}`,
    title,
    fullName,
    characterClass: selectedClass,
    subclass: getRandomItem(classDef.subclasses),
    race,
    alignment,
    level,
    rarity,
    cardStats,
    stats,
    equipment: {
      weapon: getRandomItem(classDef.weapons),
      armor: getRandomItem(classDef.armors),
      relic: getRandomItem(classDef.relics)
    },
    abilities: selectedAbilities,
    quirk,
    motto,
    backstory: '',
    colorTheme: classDef.colorTheme,
    generatedAt: Date.now()
  };

  // Generate a tailored 1-2 sentence origin story immediately
  initialCharPartial.backstory = generateTailoredBackstory(initialCharPartial);

  return initialCharPartial;
}

export function formatCharacterSheetText(char: Character): string {
  return `=== REALMFORGE FANTASY PLAYER CARD ===
Name: ${char.fullName}
Class: ${char.characterClass} (${char.subclass})
Rarity: ${char.rarity} | Level: ${char.level}
Heritage: ${char.race} | Alignment: ${char.alignment}

--- PLAYER CARD STATS ---
Health:   ${char.cardStats.health} HP
Mana:     ${char.cardStats.mana} MP
Strength: ${char.cardStats.strength} STR

--- CORE ATTRIBUTES ---
Strength:     ${char.stats.strength}
Dexterity:    ${char.stats.dexterity}
Constitution: ${char.stats.constitution}
Intelligence: ${char.stats.intelligence}
Wisdom:       ${char.stats.wisdom}
Charisma:     ${char.stats.charisma}

--- GEAR & ARTIFACTS ---
Weapon: ${char.equipment.weapon}
Armor:  ${char.equipment.armor}
Relic:  ${char.equipment.relic}

--- ORIGIN BACKSTORY ---
"${char.backstory}"

--- LORE & CREED ---
Quirk: "${char.quirk}"
Motto: "${char.motto}"
======================================`;
}
