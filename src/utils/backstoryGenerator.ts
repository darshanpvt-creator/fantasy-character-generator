import { Character } from '../types/character';

// Procedural generator for 1-2 sentence origin stories tailored to name, class, and personality
export function generateTailoredBackstory(character: Character): string {
  const { name, characterClass, subclass, race, quirk, alignment } = character;

  const classLore: Record<string, string[]> = {
    Mage: [
      `Born under a twin-star convergence, ${name} deciphered forbidden cosmic scripts within the crystalline archives of the ${race} high elders.`,
      `After an unstable astral experiment collapsed their family observatory, ${name} took to the road wielding raw elemental weave to restore what was lost.`,
      `Once an archivist in the Grand Spire, ${name} unlocked a living spell that whispered prophecy only they could comprehend.`,
      `Bound by ancient arcane oath, ${name} travels the shattered ley-lines seeking forgotten glyphs that predate the mortal gods.`
    ],
    Rogue: [
      `Raised in the serpentine shadows of the lower catacombs, ${name} honed lethal precision where silence was the only currency of survival.`,
      `Betrayed by a clandestine guild of thieves, ${name} emerged from the mist as a master of subterfuge seeking retribution.`,
      `Known only as a phantom across the border fortresses, ${name} slips through fortified gates to steal secrets kings would kill to hide.`,
      `Having escaped the royal dungeon by picking the warden's enchanted lock with a sharpened bone, ${name} now accepts only the most perilous contracts.`
    ],
    Warrior: [
      `Tempered on the frost-bitten crags of the northern frontier, ${name} held the narrow mountain breach against an entire monstrous vanguard.`,
      `Sole heir to a bloodstained ancestral broadsword, ${name} broke the siege of the imperial fortress through unyielding martial fury.`,
      `Trained in the gladiatorial coliseums from youth, ${name} shattered their chains to champion those who cannot fight for themselves.`,
      `Bearing the scars of thirty campaigns, ${name} leads the charge where lesser mortals turn to flee from the encroaching darkness.`
    ],
    Archer: [
      `Apprenticed to the spectral wardens of the Whispering Canopy, ${name} learned to loose enchanted arrows guided by starlight alone.`,
      `A master tracker of the outer frontiers, ${name} can hear the flutter of a falcon's wing through the thickest mountain fog.`,
      `When a dark blight withered their ancestral hunting groves, ${name} set forth with composite bow in hand to hunt the defilers.`,
      `Patient as a coiled viper, ${name} never misses a quarry once the autumn wind whispers its trajectory.`
    ],
    Knight: [
      `Anointed on the consecrated altar of the Dawn Sovereign, ${name} swore an unbreakable oath to protect the defenseless against the creeping night.`,
      `Renouncing a noble inheritance, ${name} donned sun-blessed plate to wander the borderlands as a righteous guardian of the realm.`,
      `When the cathedral gates fell to fiends, ${name} held the sanctuary doors alone until morning light broke the curse.`,
      `Guided by unfaltering faith and chivalric discipline, ${name}'s radiant blade shines brightest in the realm's darkest hour.`
    ]
  };

  const personalityFollowUps: string[] = [
    `True to their ${alignment.toLowerCase()} nature, they remain vigilant, ${quirk.toLowerCase().replace(/\.$/, '')}.`,
    `Though hardened by perilous trials, they still ${quirk.toLowerCase().replace(/\.$/, '')}.`,
    `Driven by ${alignment.toLowerCase()} conviction, they never hesitate to draw steel, even while they ${quirk.toLowerCase().replace(/\.$/, '')}.`,
    `Known throughout the taverns for an unbending spirit, they face every impending peril as they ${quirk.toLowerCase().replace(/\.$/, '')}.`,
    `Wherever their road winds next, their legend grows—though companions note that they ${quirk.toLowerCase().replace(/\.$/, '')}.`
  ];

  const classOrigins = classLore[characterClass] || classLore.Warrior;
  const sentence1 = classOrigins[Math.floor(Math.random() * classOrigins.length)];
  const sentence2 = personalityFollowUps[Math.floor(Math.random() * personalityFollowUps.length)];

  return `${sentence1} ${sentence2}`;
}
