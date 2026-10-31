import React from 'react';

// Ornate Antique Gold Corner Filigree for cards and frames
export const AntiqueCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = 'w-7 h-7' }) => {
  const getRotation = () => {
    switch (position) {
      case 'top-left':
        return 'rotate-0 top-0 left-0';
      case 'top-right':
        return 'rotate-90 top-0 right-0';
      case 'bottom-right':
        return 'rotate-180 bottom-0 right-0';
      case 'bottom-left':
        return '-rotate-90 bottom-0 left-0';
    }
  };

  return (
    <div className={`absolute ${getRotation()} pointer-events-none select-none z-10 ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-amber-500/80 drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]">
        {/* Outer bracket */}
        <path d="M2 38 L2 6 C2 3.8 3.8 2 6 2 L38 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
        {/* Inner flourish */}
        <path d="M6 34 L6 10 C6 7.8 7.8 6 10 6 L34 6" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.8" />
        {/* Ornate curl */}
        <path d="M2 14 C10 14 14 10 14 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="2.5" fill="#facc15" />
        <circle cx="4" cy="4" r="1.5" fill="#fef08a" />
      </svg>
    </div>
  );
};

// Transmutation / Arcane Alchemical Circle Background Ring
export const AlchemyCircle: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-96 h-96',
  opacity = 0.15
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      className={`${className} pointer-events-none select-none`}
      style={{ opacity }}
    >
      <defs>
        <radialGradient id="alchGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#d97706" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="250" cy="250" r="240" fill="url(#alchGlow)" />
      
      {/* Outer concentric rings */}
      <circle cx="250" cy="250" r="230" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" fill="none" />
      <circle cx="250" cy="250" r="220" stroke="#d97706" strokeWidth="2" fill="none" />
      <circle cx="250" cy="250" r="200" stroke="#b45309" strokeWidth="1" strokeDasharray="12 4" fill="none" />

      {/* Intersecting Sacred Geometry Triangles */}
      <polygon points="250,50 423,350 77,350" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
      <polygon points="250,450 77,150 423,150" stroke="#d97706" strokeWidth="1.5" fill="none" />

      {/* Inner Inscribed Square & Ring */}
      <rect x="145" y="145" width="210" height="210" stroke="#f59e0b" strokeWidth="1" fill="none" transform="rotate(45 250 250)" />
      <circle cx="250" cy="250" r="105" stroke="#fef08a" strokeWidth="1.5" fill="none" />
      <circle cx="250" cy="250" r="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" fill="none" />
      <circle cx="250" cy="250" r="15" fill="#f59e0b" />

      {/* Elemental alchemical symbols along the ring */}
      <g stroke="#fef08a" strokeWidth="1.5" fill="none">
        {/* Fire (Triangle pointing up) */}
        <polygon points="250,15 258,28 242,28" />
        {/* Water (Triangle pointing down) */}
        <polygon points="250,485 258,472 242,472" />
        {/* Air (Triangle up with bar) */}
        <polygon points="15,250 28,242 28,258" />
        <line x1="22" y1="244" x2="22" y2="256" />
        {/* Earth (Triangle down with bar) */}
        <polygon points="485,250 472,242 472,258" />
        <line x1="478" y1="244" x2="478" y2="256" />
      </g>
    </svg>
  );
};

// Alchemical Flask / Vial Graphic with Glowing Liquid & Bubbles
export const AlchemyVial: React.FC<{
  type: 'elixir' | 'mana' | 'transmutation' | 'ichor';
  className?: string;
}> = ({ type, className = 'w-6 h-6' }) => {
  const configs = {
    elixir: { liquid: '#dc2626', glow: '#f87171', name: 'Vitality' },
    mana: { liquid: '#7c3aed', glow: '#c084fc', name: 'Aether' },
    transmutation: { liquid: '#d97706', glow: '#fbbf24', name: 'Aurum' },
    ichor: { liquid: '#059669', glow: '#34d399', name: 'Verdant' }
  };
  const c = configs[type];

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label={`${c.name} Reagent`}>
      <title>{`${c.name} Reagent`}</title>
      {/* Cork stopper */}
      <rect x="9.5" y="1" width="5" height="3" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
      {/* Glass neck */}
      <path d="M9 4 L9 7 L4.5 17 C3.5 19 4.8 21.5 7 21.5 L17 21.5 C19.2 21.5 20.5 19 19.5 17 L15 7 L15 4 Z" 
            stroke="#fef08a" strokeWidth="1.2" strokeOpacity="0.7" fill="#18120c" />
      {/* Glowing liquid */}
      <path d="M6 18 C5.5 19.5 6.5 20.5 8 20.5 L16 20.5 C17.5 20.5 18.5 19.5 18 18 L14 11 C12.5 12 11.5 10.5 10 11 Z" 
            fill={c.liquid} opacity="0.85" />
      {/* Highlight reflection */}
      <path d="M8 19 L6.5 17.5 L10.5 10" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* Floating bubble */}
      <circle cx="12" cy="16" r="1" fill="#ffffff" opacity="0.7" />
    </svg>
  );
};
