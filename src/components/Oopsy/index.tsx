// Oopsy — the original inline-SVG character. One consistent creature reused
// across the whole app; only the expression layers (eyes, brows, mouth, extras)
// swap, so Oopsy always reads as the same character reacting to the loop.
// Spec ref: spec.md > Oopsy Character (SVG) & Expressions.
// PRD ref: prd.md > Oopsy reacts & repairs.

import { motion } from 'framer-motion';
import { reactIn, springy } from '../../motion/presets';

export type Expression =
  | 'idle'
  | 'curious'
  | 'confident'
  | 'confused'
  | 'surprised'
  | 'excited'
  | 'celebrating'
  | 'embarrassed';

// One palette so Oopsy stays on-brand with the Workshop.
const C = {
  body: '#2FB8A6',
  bodyDark: '#1E9486',
  belly: '#FFF3DC',
  cheek: '#FF9A8A',
  pupil: '#2B2B33',
  line: '#2B2B33',
  mouth: '#5A2E2A',
  tongue: '#FF8A7A',
  brow: '#17766B',
  white: '#FFFFFF',
  pencil: '#FFC93C',
  pencilTip: '#E8A04C',
  eraser: '#FF8A7A',
  spark: '#FFC93C',
  sweat: '#7FD4E8',
};

type EyeKind = 'open' | 'wide' | 'happy' | 'half' | 'down';
type MouthKind = 'smile' | 'smirk' | 'o' | 'wavy' | 'grin' | 'flat';
type Look = { dx: number; dy: number };

function Eye({ cx, cy, kind, look }: { cx: number; cy: number; kind: EyeKind; look: Look }) {
  if (kind === 'happy') {
    return (
      <path
        d={`M ${cx - 15} ${cy + 5} Q ${cx} ${cy - 11} ${cx + 15} ${cy + 5}`}
        stroke={C.line}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  const rx = kind === 'wide' ? 18 : kind === 'half' ? 16 : kind === 'down' ? 15 : 16;
  const ry = kind === 'wide' ? 21 : kind === 'half' ? 13 : kind === 'down' ? 12 : 18;
  const pr = kind === 'wide' ? 8 : kind === 'half' || kind === 'down' ? 6 : 7;
  const py = cy + (kind === 'down' ? 4 : kind === 'half' ? 2 : 1) + look.dy;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.white} />
      <circle cx={cx + look.dx} cy={py} r={pr} fill={C.pupil} />
      <circle cx={cx + look.dx - 3} cy={py - 4} r={2.6} fill={C.white} />
      {(kind === 'half' || kind === 'down') && (
        <path
          d={`M ${cx - rx} ${cy - 1} Q ${cx} ${cy - ry} ${cx + rx} ${cy - 1} L ${cx + rx} ${cy - ry - 8} L ${cx - rx} ${cy - ry - 8} Z`}
          fill={C.body}
        />
      )}
    </g>
  );
}

function Brow({ cx, cy, tilt, raise }: { cx: number; cy: number; tilt: number; raise: number }) {
  return (
    <rect
      x={cx - 14}
      y={cy - raise}
      width={28}
      height={6}
      rx={3}
      fill={C.brow}
      transform={`rotate(${tilt} ${cx} ${cy - raise})`}
    />
  );
}

function Mouth({ kind }: { kind: MouthKind }) {
  switch (kind) {
    case 'smirk':
      return <path d="M88 142 Q102 150 114 140" stroke={C.line} strokeWidth={5} strokeLinecap="round" fill="none" />;
    case 'o':
      return <ellipse cx={100} cy={144} rx={8} ry={10} fill={C.mouth} />;
    case 'wavy':
      return <path d="M84 144 Q92 138 100 144 T116 144" stroke={C.line} strokeWidth={5} strokeLinecap="round" fill="none" />;
    case 'grin':
      return (
        <g>
          <path d="M80 138 Q100 168 120 138 Z" fill={C.mouth} />
          <ellipse cx={100} cy={150} rx={11} ry={6} fill={C.tongue} />
        </g>
      );
    case 'flat':
      return <path d="M90 146 L110 146" stroke={C.line} strokeWidth={5} strokeLinecap="round" fill="none" />;
    default:
      return <path d="M84 140 Q100 152 116 140" stroke={C.line} strokeWidth={5} strokeLinecap="round" fill="none" />;
  }
}

type Face = {
  eye: EyeKind;
  look: Look;
  browL: { tilt: number; raise: number };
  browR: { tilt: number; raise: number };
  mouth: MouthKind;
  extras?: 'sparkles' | 'sweat';
};

function faceFor(expression: Expression): Face {
  switch (expression) {
    case 'curious':
      return { eye: 'open', look: { dx: 0, dy: 0 }, browL: { tilt: -8, raise: 6 }, browR: { tilt: 0, raise: 0 }, mouth: 'smile' };
    case 'confident':
      return { eye: 'half', look: { dx: 0, dy: 0 }, browL: { tilt: 0, raise: -2 }, browR: { tilt: 0, raise: -2 }, mouth: 'smirk' };
    case 'confused':
      return { eye: 'open', look: { dx: 5, dy: 0 }, browL: { tilt: -10, raise: 6 }, browR: { tilt: 8, raise: -2 }, mouth: 'wavy' };
    case 'surprised':
      return { eye: 'wide', look: { dx: 0, dy: 0 }, browL: { tilt: 0, raise: 8 }, browR: { tilt: 0, raise: 8 }, mouth: 'o' };
    case 'excited':
      return { eye: 'happy', look: { dx: 0, dy: 0 }, browL: { tilt: 0, raise: 6 }, browR: { tilt: 0, raise: 6 }, mouth: 'grin' };
    case 'celebrating':
      return { eye: 'happy', look: { dx: 0, dy: 0 }, browL: { tilt: 0, raise: 6 }, browR: { tilt: 0, raise: 6 }, mouth: 'grin', extras: 'sparkles' };
    case 'embarrassed':
      return { eye: 'down', look: { dx: 0, dy: 0 }, browL: { tilt: 14, raise: 0 }, browR: { tilt: -14, raise: 0 }, mouth: 'flat', extras: 'sweat' };
    default:
      return { eye: 'open', look: { dx: 0, dy: 0 }, browL: { tilt: 0, raise: 0 }, browR: { tilt: 0, raise: 0 }, mouth: 'smile' };
  }
}

export function Oopsy({ expression = 'idle', className }: { expression?: Expression; className?: string }) {
  const f = faceFor(expression);
  return (
    <div className={`oopsy ${className ?? ''}`.trim()} data-expression={expression}>
      <motion.div
        key={expression}
        className="oopsy__react"
        initial={reactIn.initial}
        animate={reactIn.animate}
        transition={springy}
      >
        <svg viewBox="0 0 200 200" role="img" aria-label={`Oopsy looks ${expression}`}>
        {/* ear nubs (behind body) */}
        <circle cx={50} cy={66} r={17} fill={C.body} />
        <circle cx={150} cy={66} r={17} fill={C.body} />
        <circle cx={50} cy={64} r={8} fill={C.belly} />
        <circle cx={150} cy={64} r={8} fill={C.belly} />
        {/* signature pencil tucked behind the right ear */}
        <g transform="rotate(28 158 52)">
          <rect x={152} y={30} width={12} height={34} rx={3} fill={C.pencil} />
          <path d="M152 30 L158 18 L164 30 Z" fill={C.pencilTip} />
          <rect x={152} y={60} width={12} height={7} rx={3} fill={C.eraser} />
        </g>
        {/* body + belly */}
        <ellipse cx={100} cy={118} rx={72} ry={64} fill={C.body} />
        <ellipse cx={100} cy={140} rx={46} ry={36} fill={C.belly} />
        {/* stubby arms */}
        <ellipse cx={30} cy={140} rx={14} ry={20} fill={C.bodyDark} transform="rotate(18 30 140)" />
        <ellipse cx={170} cy={140} rx={14} ry={20} fill={C.bodyDark} transform="rotate(-18 170 140)" />
        {/* cheeks */}
        <ellipse cx={58} cy={128} rx={11} ry={7} fill={C.cheek} opacity={expression === 'embarrassed' ? 0.9 : 0.6} />
        <ellipse cx={142} cy={128} rx={11} ry={7} fill={C.cheek} opacity={expression === 'embarrassed' ? 0.9 : 0.6} />
        {/* face */}
        <Eye cx={72} cy={100} kind={f.eye} look={f.look} />
        <Eye cx={128} cy={100} kind={f.eye} look={f.look} />
        <Brow cx={72} cy={76} tilt={f.browL.tilt} raise={f.browL.raise} />
        <Brow cx={128} cy={76} tilt={f.browR.tilt} raise={f.browR.raise} />
        <Mouth kind={f.mouth} />
        {/* extras */}
        {f.extras === 'sparkles' && (
          <g fill={C.spark}>
            <path d="M30 60 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" />
            <path d="M172 70 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" />
            <path d="M100 22 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" />
          </g>
        )}
        {f.extras === 'sweat' && (
          <path d="M162 84 q8 12 0 18 q-8 -6 0 -18 Z" fill={C.sweat} />
        )}
        </svg>
      </motion.div>
    </div>
  );
}
