import { Character } from '../types/character';

// Procedural high-resolution SVG cartoon/video-game style portrait generator as an instant offline/fallback
export function generateProceduralPortrait(character: Character, seed: number = 0): string {
  const charClass = character.characterClass;
  
  // Deterministic seed based on name, class, and seed
  let hash = 0;
  const str = `${character.fullName}-${charClass}-${seed}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Palettes per class
  const classPalettes: Record<string, { bg1: string; bg2: string; skin: string; hair: string; gear: string; accent: string; glow: string }> = {
    Mage: {
      bg1: '#1e1035',
      bg2: '#3b0764',
      skin: positiveHash % 2 === 0 ? '#fbcfe8' : '#fed7aa',
      hair: ['#a855f7', '#6366f1', '#e879f9', '#c084fc'][positiveHash % 4],
      gear: '#581c87',
      accent: '#e9d5ff',
      glow: '#c084fc'
    },
    Rogue: {
      bg1: '#062817',
      bg2: '#064e3b',
      skin: positiveHash % 2 === 0 ? '#fed7aa' : '#fcd34d',
      hair: ['#1e293b', '#334155', '#10b981', '#047857'][positiveHash % 4],
      gear: '#022c22',
      accent: '#6ee7b7',
      glow: '#34d399'
    },
    Warrior: {
      bg1: '#360c0c',
      bg2: '#7f1d1d',
      skin: positiveHash % 2 === 0 ? '#ffedd5' : '#fca5a5',
      hair: ['#7c2d12', '#b45309', '#171717', '#e11d48'][positiveHash % 4],
      gear: '#450a0a',
      accent: '#fca5a5',
      glow: '#f87171'
    },
    Archer: {
      bg1: '#142a10',
      bg2: '#14532d',
      skin: positiveHash % 2 === 0 ? '#fef3c7' : '#fed7aa',
      hair: ['#d97706', '#ca8a04', '#65a30d', '#15803d'][positiveHash % 4],
      gear: '#166534',
      accent: '#86efac',
      glow: '#4ade80'
    },
    Knight: {
      bg1: '#261b07',
      bg2: '#78350f',
      skin: positiveHash % 2 === 0 ? '#ffedd5' : '#fef08a',
      hair: ['#f59e0b', '#fbbf24', '#d97706', '#78350f'][positiveHash % 4],
      gear: '#1e293b',
      accent: '#fde047',
      glow: '#facc15'
    }
  };

  const pal = classPalettes[charClass] || classPalettes.Warrior;

  // SVG Artwork representing a stylized cartoon fantasy portrait
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pal.bg1}" />
        <stop offset="100%" stop-color="${pal.bg2}" />
      </linearGradient>
      <radialGradient id="auraGlow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="${pal.glow}" stop-opacity="0.6" />
        <stop offset="100%" stop-color="${pal.bg2}" stop-opacity="0" />
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
      </filter>
    </defs>

    <!-- Background frame -->
    <rect width="400" height="400" rx="24" fill="url(#bgGrad)" />
    <circle cx="200" cy="180" r="160" fill="url(#auraGlow)" />

    <!-- Ambient magical particles -->
    <circle cx="90" cy="110" r="3" fill="${pal.glow}" opacity="0.8" />
    <circle cx="310" cy="130" r="4" fill="${pal.glow}" opacity="0.7" />
    <circle cx="70" cy="270" r="2.5" fill="${pal.glow}" opacity="0.6" />
    <circle cx="330" cy="250" r="3" fill="${pal.glow}" opacity="0.9" />
    <polygon points="200,30 205,45 220,50 205,55 200,70 195,55 180,50 195,45" fill="${pal.glow}" opacity="0.4" />

    <!-- Character Body / Shoulders -->
    <g filter="url(#shadow)">
      ${
        charClass === 'Knight'
          ? `<!-- Knight Armor -->
             <path d="M110 390 Q120 280 200 280 Q280 280 290 390 Z" fill="${pal.gear}" stroke="#fbbf24" stroke-width="4" />
             <!-- Pauldrons -->
             <path d="M85 360 C80 300 130 270 150 290 C130 330 110 370 85 360 Z" fill="#475569" stroke="#fbbf24" stroke-width="3" />
             <path d="M315 360 C320 300 270 270 250 290 C270 330 290 370 315 360 Z" fill="#475569" stroke="#fbbf24" stroke-width="3" />
             <polygon points="200,285 215,320 200,345 185,320" fill="#facc15" />`
          : charClass === 'Mage'
          ? `<!-- Mage Robes -->
             <path d="M100 390 Q130 270 200 270 Q270 270 300 390 Z" fill="${pal.gear}" stroke="${pal.glow}" stroke-width="3" />
             <!-- High Collar -->
             <path d="M140 270 L110 210 L160 250 Z" fill="${pal.accent}" opacity="0.8" />
             <path d="M260 270 L290 210 L240 250 Z" fill="${pal.accent}" opacity="0.8" />
             <circle cx="200" cy="310" r="16" fill="${pal.glow}" opacity="0.9" />
             <circle cx="200" cy="310" r="8" fill="#fff" />`
          : charClass === 'Rogue'
          ? `<!-- Rogue Cowl & Leather -->
             <path d="M110 390 Q130 280 200 280 Q270 280 290 390 Z" fill="${pal.gear}" stroke="#10b981" stroke-width="3" />
             <!-- Hood collar -->
             <path d="M130 260 C160 290 240 290 270 260 C240 330 160 330 130 260 Z" fill="#0f172a" />
             <path d="M185 300 L200 330 L215 300 Z" fill="#34d399" />`
          : charClass === 'Archer'
          ? `<!-- Archer Tunic & Quiver strap -->
             <path d="M110 390 Q130 280 200 280 Q270 280 290 390 Z" fill="${pal.gear}" stroke="#4ade80" stroke-width="3" />
             <!-- Leather strap across chest -->
             <line x1="120" y1="360" x2="260" y2="280" stroke="#78350f" stroke-width="12" stroke-linecap="round" />
             <line x1="120" y1="360" x2="260" y2="280" stroke="#fbbf24" stroke-width="2" />
             <!-- Feather accessory -->
             <path d="M275 220 Q310 180 320 220 Q290 240 275 220 Z" fill="#4ade80" />`
          : `<!-- Warrior Plate & Spikes -->
             <path d="M100 390 Q120 270 200 270 Q280 270 300 390 Z" fill="${pal.gear}" stroke="#f87171" stroke-width="4" />
             <polygon points="120,290 90,240 140,270" fill="#dc2626" />
             <polygon points="280,290 310,240 260,270" fill="#dc2626" />`
      }
    </g>

    <!-- Head & Face -->
    <g filter="url(#shadow)">
      <!-- Neck -->
      <path d="M175 220 L175 280 Q200 290 225 280 L225 220 Z" fill="${pal.skin}" opacity="0.9" />

      <!-- Chin/Face contour -->
      <path d="M135 150 C135 230 170 265 200 265 C230 265 265 230 265 150 C265 95 230 75 200 75 C170 75 135 95 135 150 Z" fill="${pal.skin}" stroke="#00000022" stroke-width="2" />

      <!-- Ears / Elf ears if elf or mage/archer -->
      ${
        character.race.includes('Elf') || charClass === 'Archer' || charClass === 'Mage'
          ? `<!-- Elven pointed ears -->
             <path d="M138 145 C110 135 85 105 105 95 C125 110 138 130 138 145 Z" fill="${pal.skin}" stroke="#00000033" stroke-width="1.5" />
             <path d="M262 145 C290 135 315 105 295 95 C275 110 262 130 262 145 Z" fill="${pal.skin}" stroke="#00000033" stroke-width="1.5" />`
          : `<!-- Humanoid ears -->
             <circle cx="132" cy="155" r="14" fill="${pal.skin}" />
             <circle cx="268" cy="155" r="14" fill="${pal.skin}" />`
      }

      <!-- Hair Back / Volume -->
      <path d="M125 140 C110 70 160 45 200 45 C240 45 290 70 275 140 C280 200 270 240 265 240 C250 180 250 120 200 120 C150 120 150 180 135 240 C130 240 120 200 125 140 Z" fill="${pal.hair}" />

      <!-- Eyes & Brows -->
      <!-- Eyebrows -->
      <path d="M152 140 Q170 132 182 140" stroke="${pal.hair}" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <path d="M218 140 Q230 132 248 140" stroke="${pal.hair}" stroke-width="4.5" stroke-linecap="round" fill="none" />

      <!-- Eye whites -->
      <ellipse cx="167" cy="154" rx="13" ry="9" fill="#ffffff" />
      <ellipse cx="233" cy="154" rx="13" ry="9" fill="#ffffff" />

      <!-- Irises with class glow -->
      <circle cx="168" cy="154" r="6" fill="${pal.glow}" />
      <circle cx="232" cy="154" r="6" fill="${pal.glow}" />
      <circle cx="168" cy="154" r="3" fill="#0f172a" />
      <circle cx="232" cy="154" r="3" fill="#0f172a" />
      <!-- Catchlight sparkles -->
      <circle cx="170" cy="152" r="1.5" fill="#ffffff" />
      <circle cx="234" cy="152" r="1.5" fill="#ffffff" />

      <!-- Nose -->
      <path d="M198 155 Q203 175 206 182 Q198 185 192 182" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" opacity="0.6" />

      <!-- Mouth / Smirk -->
      <path d="M185 208 Q200 216 215 208" fill="none" stroke="#991b1b" stroke-width="3" stroke-linecap="round" />

      <!-- War paint / Arcane marks / Scar based on class -->
      ${
        charClass === 'Mage'
          ? `<polygon points="200,90 206,105 200,120 194,105" fill="${pal.glow}" />`
          : charClass === 'Warrior'
          ? `<path d="M158 135 L172 175" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />`
          : charClass === 'Rogue'
          ? `<path d="M150 170 Q165 178 180 170" stroke="#059669" stroke-width="2" opacity="0.7" fill="none" />`
          : charClass === 'Knight'
          ? `<polygon points="200,85 205,95 215,95 207,102 210,112 200,105 190,112 193,102 185,95 195,95" fill="#fbbf24" />`
          : `<line x1="225" y1="172" x2="245" y2="172" stroke="#65a30d" stroke-width="2.5" />`
      }
    </g>

    <!-- Fancy outer portrait frame -->
    <rect x="6" y="6" width="388" height="388" rx="20" fill="none" stroke="${pal.glow}" stroke-width="4" opacity="0.8" />
    <rect x="12" y="12" width="376" height="376" rx="16" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.25" />

    <!-- Class badge ribbon at bottom -->
    <path d="M110 365 L290 365 L275 390 L125 390 Z" fill="#0f172a" stroke="${pal.glow}" stroke-width="2" />
    <text x="200" y="382" font-family="Cinzel, serif" font-size="14" font-weight="bold" fill="${pal.accent}" text-anchor="middle" letter-spacing="2">
      ${charClass.toUpperCase()}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
