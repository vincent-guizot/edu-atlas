import React from 'react';

export type IslandKey =
  | 'sumatera'
  | 'bangka'
  | 'kalimantan'
  | 'jawa'
  | 'bali'
  | 'ntb'
  | 'ntt'
  | 'sulawesi'
  | 'maluku'
  | 'malukuUtara'
  | 'papua';

interface IndonesiaMapProps {
  /** Per-island fill colors. Missing keys fall back to the brand default. */
  fills?: Partial<Record<IslandKey, string>>;
  className?: string;
  /** Enable hover highlight on each island. */
  interactive?: boolean;
  selectedIsland?: IslandKey | null;
  onIslandClick?: (island: IslandKey) => void;
}

const DEFAULT: Record<IslandKey, string> = {
  sumatera: '#25A9A1',
  bangka: '#8ED8E4',
  kalimantan: '#8ED8E4',
  jawa: '#153B66',
  bali: '#BAE6FD',
  ntb: '#BAE6FD',
  ntt: '#BAE6FD',
  sulawesi: '#0284C7',
  maluku: '#8ED8E4',
  malukuUtara: '#8ED8E4',
  papua: '#0284C7',
};

const PATHS: Record<IslandKey, string> = {
  sumatera:
    'M60,60 C78,52 96,60 104,78 L186,196 C196,210 192,226 176,230 C162,233 150,224 142,212 L66,96 C56,82 50,68 60,60 Z',
  bangka:
    'M196,196 c10,-4 20,2 18,12 c-2,10 -14,12 -20,4 c-5,-6 -4,-13 2,-16 Z',
  kalimantan:
    'M250,78 C300,62 360,66 392,86 C420,104 430,134 418,164 C408,190 384,206 352,208 C322,210 292,200 272,182 C250,162 236,138 236,114 C236,98 240,84 250,78 Z',
  jawa:
    'M176,250 C220,244 300,246 372,252 C392,254 398,262 384,268 C320,276 232,276 180,270 C166,268 162,254 176,250 Z',
  bali: 'M404,262 c8,-3 16,1 16,8 c0,7 -9,10 -16,7 c-7,-3 -7,-12 0,-15 Z',
  ntb: 'M434,264 c12,-2 24,2 24,9 c0,7 -14,10 -26,7 c-9,-2 -9,-14 2,-16 Z',
  ntt: 'M470,266 c16,-2 34,2 34,9 c0,7 -20,10 -36,7 c-11,-2 -11,-14 2,-16 Z',
  sulawesi:
    'M452,96 C462,90 472,96 474,108 L480,150 C492,140 506,138 512,150 C518,162 508,172 496,174 L486,176 L498,214 C502,228 492,236 482,230 C474,225 472,214 472,204 L468,170 C456,178 442,176 438,164 C434,152 444,142 456,142 L460,138 L450,112 C446,100 444,100 452,96 Z',
  maluku: 'M556,150 c10,-4 20,2 20,12 c0,10 -12,14 -20,8 c-8,-6 -8,-16 0,-20 Z',
  malukuUtara: 'M548,196 c9,-3 18,2 18,10 c0,8 -11,11 -18,6 c-7,-5 -7,-13 0,-16 Z',
  papua:
    'M600,150 C636,134 690,138 720,156 C744,170 752,196 740,220 C728,242 700,252 668,250 C640,248 614,236 600,216 C588,200 584,180 588,166 C590,158 594,153 600,150 Z',
};

const ORDER: IslandKey[] = [
  'sumatera',
  'bangka',
  'kalimantan',
  'jawa',
  'bali',
  'ntb',
  'ntt',
  'sulawesi',
  'maluku',
  'malukuUtara',
  'papua',
];

const LABELS = [
  { key: 'sumatera', name: 'Sumatera', x: 120, y: 155 },
  { key: 'kalimantan', name: 'Kalimantan', x: 335, y: 140 },
  { key: 'jawa', name: 'Jawa', x: 260, y: 285 },
  { key: 'sulawesi', name: 'Sulawesi', x: 480, y: 160 },
  { key: 'bali', name: 'Bali & Nusa Tenggara', x: 440, y: 290 },
  { key: 'maluku', name: 'Maluku', x: 565, y: 135 },
  { key: 'papua', name: 'Papua', x: 670, y: 195 },
];

export const IndonesiaMap: React.FC<IndonesiaMapProps> = ({
  fills,
  className,
  interactive = true,
  selectedIsland,
  onIslandClick,
}) => {
  return (
    <svg viewBox="0 0 800 340" className={className} role="img" aria-label="Peta Indonesia">
      {/* Background sea contour pattern */}
      <rect width="800" height="340" fill="transparent" />

      {/* Island Paths */}
      {ORDER.map((key) => {
        const isSelected = selectedIsland === key;
        return (
          <path
            key={key}
            d={PATHS[key]}
            fill={fills?.[key] ?? DEFAULT[key]}
            stroke={isSelected ? '#153B66' : '#FFFFFF'}
            strokeWidth={isSelected ? 3 : 1}
            onClick={interactive ? () => onIslandClick?.(key) : undefined}
            className={
              interactive
                ? `cursor-pointer transition-all duration-200 hover:opacity-90 hover:stroke-[#25A9A1] hover:stroke-2 ${
                    isSelected ? 'filter drop-shadow-md' : ''
                  }`
                : undefined
            }
          />
        );
      })}

      {/* Region Name Labels */}
      {LABELS.map((item) => (
        <text
          key={item.key}
          x={item.x}
          y={item.y}
          textAnchor="middle"
          className="text-[10px] font-bold fill-[#153B66] pointer-events-none select-none drop-shadow-xs"
        >
          {item.name}
        </text>
      ))}
    </svg>
  );
};

export default IndonesiaMap;
