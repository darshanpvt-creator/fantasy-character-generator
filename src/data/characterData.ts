import { CharacterClassType } from '../types/character';

export const FIRST_NAMES = [
  'Aeloria', 'Gareth', 'Kaelen', 'Thorgar', 'Morwen', 'Valerius', 'Rowan', 
  'Vael', 'Seraphina', 'Branoc', 'Elyon', 'Faenor', 'Gwyneira', 'Hadriel', 
  'Ignis', 'Jorah', 'Kelvyn', 'Lorien', 'Maeve', 'Nyx', 'Patricia', 'Rhys', 
  'Sylvan', 'Theron', 'Uther', 'Vespera', 'Wynn', 'Xander', 'Zephyr', 
  'Bellatrix', 'Corvus', 'Daeron', 'Elandorr', 'Fintan', 'Gwyneth', 'Haldir', 
  'Ivora', 'Jareth', 'Kaelith', 'Lysander', 'Miriel', 'Nolan', 'Oakhaven', 
  'Rhiannon', 'Soren', 'Thalia', 'Ulric', 'Vanya', 'Winter', 'Xylona', 
  'Zarek', 'Alastor', 'Balthazar', 'Cassian', 'Darius', 'Eowyn', 'Faelan', 
  'Grimm', 'Hesper', 'Isolde', 'Kael', 'Leofric', 'Morgath', 'Nerys', 
  'Oberon', 'Persephone', 'Quinn', 'Raven', 'Sariel', 'Torin', 'Varis'
];

export const SURNAMES = [
  'Stormweaver', 'Ironfist', 'Shadowveil', 'Whisperwind', 'Moonblade', 
  'Dawnbringer', 'Thornheart', 'Blackwood', 'Silvercrest', 'Fireforge', 
  'Frostpeak', 'Ravenshade', 'Emberfall', 'Brightward', 'Stonebreaker', 
  'Duskwalker', 'Goldenhelm', 'Nightgale', 'Oakenshield', 'Bloodthorn', 
  'Sunstride', 'Deepdelver', 'Voidwalker', 'Starcaller', 'Wildtracker', 
  'Cloudreaver', 'Ironwood', 'Windstrider', 'Dragonsong', 'Shieldbreaker',
  'Ashford', 'Gloomhaven', 'Rimeborn', 'Netherbane', 'Sunshard', 'Hawthorne'
];

export const TITLES = [
  'the Undaunted', 'the Silent', 'of the Silver Dawn', 'the Spellbound', 
  'the Shadowfang', 'the Ironclad', 'of the Whispering Pines', 'the Swiftarrow', 
  'the Flamekeeper', 'of the North Wind', 'the Unbroken', 'the Starwatcher', 
  'the Lionheart', 'the Ghost of Eldoria', 'the Aegis', 'the Nightstrider', 
  'the Runecarver', 'the Vengeful', 'the Shield of Dawn', 'the Ashwalker'
];

export const RACES = [
  'High Elf',
  'Mountain Dwarf',
  'Human',
  'Woodland Elf',
  'Half-Orc',
  'Dragonborn',
  'Tiefling',
  'Aasimar (Celestial)',
  'Deep Gnome',
  'Goliath'
];

export const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral'
];

export interface ClassDefinition {
  name: CharacterClassType;
  description: string;
  subclasses: string[];
  powerType: 'Mana' | 'Stamina' | 'Holy Favor' | 'Focus';
  statAffinities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  weapons: string[];
  armors: string[];
  relics: string[];
  abilities: string[];
  quotes: string[];
  backstoryTemplates: string[];
  colorTheme: {
    primary: string;
    accent: string;
    border: string;
    badgeBg: string;
  };
}

export const CLASS_DEFINITIONS: Record<CharacterClassType, ClassDefinition> = {
  Mage: {
    name: 'Mage',
    description: 'Master of arcane mysteries, commanding the raw elements and reality-bending spells.',
    subclasses: ['Arcanist', 'Pyromancer', 'Chronomancer', 'Enchanter', 'Frost Weaver'],
    powerType: 'Mana',
    statAffinities: {
      strength: 8,
      dexterity: 12,
      constitution: 11,
      intelligence: 18,
      wisdom: 15,
      charisma: 13
    },
    weapons: [
      'Stave of the Astral Conduit',
      'Runed Crystal Wand & Focus Orb',
      'Spirewood Staff of Storms',
      'Grimoire of Ancient Incantations'
    ],
    armors: [
      'Silken Robes of the Archmage',
      'Ethereal Weave Mantle',
      'Runic Embroidered Vestments',
      'Void-Touched Shroud'
    ],
    relics: [
      'Amulet of Infinite Ley-Lines',
      'Chrono-Hourglass of Eternity',
      'Tome of Celestial Cartography',
      'Prism of the Seven Elements'
    ],
    abilities: [
      'Arcane Singularity',
      'Pyroclastic Surge',
      'Time Dilation Ward',
      'Frost Nova Entombment'
    ],
    quotes: [
      'The arcane weaves the fabric of all reality; I simply choose which threads to unravel.',
      'Fire does not question where it burns, yet knowledge directs its flame.',
      'Between the words of power and the silence that follows lies true magic.'
    ],
    backstoryTemplates: [
      'Apprenticed in the High Spire of Eldoria, deciphering lost celestial ruins before an astral fracture compelled their pilgrimage.',
      'Self-taught wanderer who discovered a forbidden grimoire in the hollow roots of an ancient mana tree.',
      'Expelled from the Grand Academy for experimenting with temporal weaves that nearly swallowed an entire library tower.'
    ],
    colorTheme: {
      primary: '#9333ea', // purple-600
      accent: '#c084fc', // purple-400
      border: 'border-purple-500/40',
      badgeBg: 'bg-purple-950/60 text-purple-200 border-purple-700/50'
    }
  },
  Rogue: {
    name: 'Rogue',
    description: 'Ghost of the shadows, delivering fatal strikes from the dark with uncanny agility.',
    subclasses: ['Shadowblade', 'Assassin', 'Nightstalker', 'Arcane Trickster', 'Infiltrator'],
    powerType: 'Stamina',
    statAffinities: {
      strength: 10,
      dexterity: 18,
      constitution: 12,
      intelligence: 14,
      wisdom: 13,
      charisma: 15
    },
    weapons: [
      'Twin Serpentfang Daggers',
      'Concealed Wrist Crossbow',
      'Midnight Obsidian Stiletto',
      'Dual Serrated Shadowblades'
    ],
    armors: [
      'Supple Shadow-Stitched Leather',
      'Silent Silk Brigandine',
      'Mantle of the Smoke Phantom',
      'Reinforced Nightshade Gambeson'
    ],
    relics: [
      'Smokebomb of the Night Syndicate',
      'Skeleton Key of the Forgotten Catacombs',
      'Coin of the Phantom Guild',
      'Vial of Ghost Lotus Venom'
    ],
    abilities: [
      'Shadowmeld Ambush',
      'Smoke Veil Disengagement',
      'Critical Flank Evisceration',
      'Shadowstep Blink'
    ],
    quotes: [
      'If you heard the blade draw, congratulations: you were not the target.',
      'Locks are just polite suggestions from people who fear the dark.',
      'Honor won’t stop a dagger slipped between the ribs.'
    ],
    backstoryTemplates: [
      'Grew up navigating the perilous rooftops of the lower docks, rising through the shadows of the Black Market syndicate.',
      'Former royal scout disgraced by political intrigue, now taking contracts only from those with genuine grievances.',
      'Trained by a clandestine brotherhood that vanished overnight, leaving behind only an iron insignia and a debt of blood.'
    ],
    colorTheme: {
      primary: '#059669', // emerald-600
      accent: '#34d399', // emerald-400
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-950/60 text-emerald-200 border-emerald-700/50'
    }
  },
  Warrior: {
    name: 'Warrior',
    description: 'Indomitable titan of the battlefield, wielding brutal martial might and towering strength.',
    subclasses: ['Berserker', 'Battlemaster', 'Gladiator', 'Juggernaut', 'Warlord'],
    powerType: 'Stamina',
    statAffinities: {
      strength: 18,
      dexterity: 13,
      constitution: 17,
      intelligence: 9,
      wisdom: 11,
      charisma: 12
    },
    weapons: [
      'Colossal Two-Handed Greatsword',
      'Spiked Dwarven Battleaxe',
      'War-Maul of the Cragbreaker',
      'Dual Jagged Cleavers'
    ],
    armors: [
      'Heavy Iron-Forged Plate',
      'Beast-Hide Battle Harness',
      'Spiked Steel Cuirass',
      'Dreadnought Plate Armor'
    ],
    relics: [
      'Horn of Valorous Echoes',
      'Broken Chain of the Colossus',
      'Grizzly Fang Talisman',
      'Banner of the Unconquered Vanguard'
    ],
    abilities: [
      'Whirlwind Sever',
      'Earthshaking Ground Slam',
      'Battle Cry of Reckoning',
      'Indomitable Stand'
    ],
    quotes: [
      'Armor may dent and bones may fracture, but our will remains unyielding.',
      'Words negotiate boundaries; steel decides them.',
      'I do not run from the storm—I bring it.'
    ],
    backstoryTemplates: [
      'Sole survivor of a mountain pass rearguard action that held off an entire vanguard army for three grueling nights.',
      'Champion of the imperial blood pits who earned freedom through sixty consecutive victories against monstrous beasts.',
      'Heir to a fallen clan crest, seeking vengeance across the frontier with nothing but an ancestral blade.'
    ],
    colorTheme: {
      primary: '#dc2626', // red-600
      accent: '#f87171', // red-400
      border: 'border-red-500/40',
      badgeBg: 'bg-red-950/60 text-red-200 border-red-700/50'
    }
  },
  Archer: {
    name: 'Archer',
    description: 'Lethal marksman and survivalist, striking targets from afar with peerless accuracy.',
    subclasses: ['Ranger', 'Hawkeye Sniper', 'Windrunner', 'Beaststalker', 'Arcane Bowmaster'],
    powerType: 'Focus',
    statAffinities: {
      strength: 12,
      dexterity: 18,
      constitution: 13,
      intelligence: 11,
      wisdom: 16,
      charisma: 10
    },
    weapons: [
      'Elven Moonwood Composite Bow',
      'Heavy Recurve Greatbow',
      'Windcarver Longbow & Quiver',
      'Twin Hunting Knives & Sniping Crossbow'
    ],
    armors: [
      'Forest-Camo Leather Jerkin',
      'Falcon Feather Cloak & Vambraces',
      'Stalker Greaves & Supple Tunic',
      'Treated Wyrmscale Vest'
    ],
    relics: [
      'Quiver of Boundless Arrows',
      'Hawk Eye Scope of Truesight',
      'Feather of the Zephyr Spirit',
      'Carved Totem of the Silent Pines'
    ],
    abilities: [
      'Heartseeker Piercing Shot',
      'Rain of Whistling Arrows',
      'Eagle Eye Truesight',
      'Root-Entangling Snare'
    ],
    quotes: [
      'Distance offers no sanctuary when the wind whispers your doom.',
      'One breath. One heartbeat. One arrow.',
      'The forest speaks to those who know how to listen—and strikes those who do not.'
    ],
    backstoryTemplates: [
      'Guardian of the sacred Whispering Canopy, hunting down poachers, fiends, and dark wood defilers.',
      'Frontier scout celebrated for eliminating enemy scouts across foggy ravines before they ever reached the city walls.',
      'Raised by a nomadic hawk-hunting tribe, trained to hit a fluttering sparrow in flight by starlight alone.'
    ],
    colorTheme: {
      primary: '#16a34a', // green-600
      accent: '#4ade80', // green-400
      border: 'border-green-500/40',
      badgeBg: 'bg-green-950/60 text-green-200 border-green-700/50'
    }
  },
  Knight: {
    name: 'Knight',
    description: 'Chivalric defender of the realm, sworn to sacred oaths with heavy steel and unwavering honor.',
    subclasses: ['Paladin of Dawn', 'Crown Guardian', 'Oathkeeper', 'Sun Templar', 'Cavalier'],
    powerType: 'Holy Favor',
    statAffinities: {
      strength: 16,
      dexterity: 10,
      constitution: 16,
      intelligence: 10,
      wisdom: 14,
      charisma: 17
    },
    weapons: [
      'Sun-Forged Gilded Broadsword & Tower Shield',
      'Radiant Bastard Sword of Judgement',
      'Silver-Tipped Heavy War Lance',
      'Sanctified Flail of Retribution'
    ],
    armors: [
      'Polished Full Plate of the Golden Order',
      'Engraved Aegis Cuirass with White Surcoat',
      'Sunburst Crested Helm & Pauldrons',
      'Sanctified Dragon-Scale Plate'
    ],
    relics: [
      'Reliquary of the Dawn Sovereign',
      'Blessed Signet of the High Temple',
      'Pendant of the Unfaltering Vow',
      'Holy Grail of Cleansing Waters'
    ],
    abilities: [
      'Radiant Smite of Justice',
      'Bastion Aegis Shield Wall',
      'Aura of Holy Sanctuary',
      'Judgment of the Golden Sun'
    ],
    quotes: [
      'My shield stands between the realm and the creeping night.',
      'An oath once sworn is stronger than granite and sharper than steel.',
      'May the light guide our strikes and forgive our mercy.'
    ],
    backstoryTemplates: [
      'Knighted on the eve of the Siege of Sunspire after holding the breach against overwhelming dark hordes.',
      'Sworn protector of a peaceful monastery, called to arms when ancient seal stones began to crack.',
      'Noble born who renounced their inheritance to champion the defenseless across the untamed borderlands.'
    ],
    colorTheme: {
      primary: '#d97706', // amber-600
      accent: '#fcd34d', // amber-300
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-950/60 text-amber-200 border-amber-700/50'
    }
  }
};

export const PERSONALITY_QUIRKS = [
  'Refuses to enter a tavern without checking every corner for exits first.',
  'Carries a small leather pouch of smooth river stones from their lost homeland.',
  'Whistles a gentle, haunting lullaby before unsheathing any weapon.',
  'Has a profound distrust of cats, claiming they speak in riddles to spirits.',
  'Always leaves a single gold coin upon the altar of whatever god is worshipped nearby.',
  'Never sleeps with boots off, anticipating an ambush at any second.',
  'Keeps a journal filled with detailed sketches of wild flora and fauna.',
  'Speaks to their primary weapon as though it possesses a living soul.',
  'Has an insatiable appetite for roasted spiced mutton and honeyed mead.',
  'Can accurately predict rainfall by the ache in their old battle scars.'
];
