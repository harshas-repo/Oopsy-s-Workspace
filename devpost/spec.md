---
doc: spec
status: approved
---

# Oopsy — Technical Spec

Blueprint for the Oopsy proof of concept. Implements the behaviors in `devpost/prd.md`; kernel and boundary from `devpost/scope.md > The Unique Kernel` and `> The POC Boundary`. Product decisions are unchanged: **one concept (fraction addition, unlike denominators), one misconception (add-across), deterministic mapping, no paid AI APIs, no persistence.** Timeline is revised — several days, so we build the loop first, then polish *quality*, not features.

## How This Works, In Plain Language

Oopsy is a web page that runs **entirely in the browser** — no server, no accounts, no database. Six pieces:

1. **Content library** — a data file holding the problems, the known mistake, Oopsy's scripted wrong solution (as separate "moves"), the fix steps, the answer options, and the lines Oopsy says. Adding a new topic later means adding data, not rewriting the app.
2. **Math & misconception engine** — pure functions that check an answer by *value*, detect the add-across mistake, and build equivalent fractions. Deterministic and unit-tested, so the math is trustworthy without any AI.
3. **Loop controller** — a small state machine that knows which step we're on (diagnostic → mirror → identify → teach → transfer → delayed re-check → wrap) and what's allowed next.
4. **Session state** — in-memory only: current step, attempt counts, and the recorded results for the five success criteria. Reload wipes it (your A5 decision).
5. **The Workshop UI** — React components: the illustrated scene, the Oopsy SVG character, the notebook panel, the number-tile tray, captions, and audio controls.
6. **Audio player** — plays pre-made voice-line files and sound effects; captions always mirror the spoken line.

**Why this shape:** everything hard and correctness-critical (math, mapping) lives in isolated, testable logic; everything else is presentation. No backend keeps it simple and matches "no persistence," and a static bundle deploys free and reliably.

## The Core Journey Through the System

Traces `prd.md > The Core Journey`:

1. **Arrival** → controller enters `intro`; Workshop scene renders; audio plays the greeting voice line + caption.
2. **Diagnostic `1/2 + 1/3`** → child builds a fraction from tiles → engine validates by value → maps `2/5`→add-across, `5/6`→correct, else→bounded retry. Result recorded; controller advances (or takes the correct-first-answer branch, which must *not* imply the mistake was the child's).
3. **Mirrored mistake** → controller loads Oopsy's authored wrong solution for `2/3 + 1/4 = 3/7` from the content library → notebook renders it as discrete moves.
4. **Identify** → child taps a move → controller checks it against the authored `wrongMoveId` → hit: highlight/wobble + Oopsy confused reaction; miss: authored "that step's fine" feedback. Nothing revealed.
5. **Teach/correct** → one principle choice (content-authored options) → then fill-in-the-blank equivalent fractions (`2/3=▢/12→8`, `1/4=▢/12→3`, `8/12+3/12=▢/12→11`) via tiles, engine-validated each entry. Hint ladder governs misses.
6. **React & repair** → controller triggers Oopsy's confused→surprised→excited sequence + the `3/7`→`11/12` repair animation + SFX.
7. **Immediate transfer `1/4 + 1/3`** → tiles → engine validates (`7/12`); recorded.
8. **Delayed re-check** → a differently-presented notebook word problem (`1/2 + 1/4` cups → `3/4`) appears as a later stage, no reminder; engine records correct vs. add-across (returned / not returned).
9. **Wrap** → session state's recorded criteria render as the completion summary.

## Stack

| Piece | Choice | Why (learner-accepted tradeoff) |
|---|---|---|
| Language | **TypeScript** | Keeps deterministic math honest; you build web apps already. |
| Framework/build | **React + Vite** | Familiar, fast, trivial static bundle. |
| Animation | **Framer Motion** | Purposeful motion (wobble, highlight, erase/repair, reactions) declaratively. |
| Tests | **Vitest** | Unit-test the fraction/misconception engine — the correctness core. |
| Voice generation | **Piper TTS** (dev/asset-time only, offline) | Free, no paid API, consistent voice bank pre-generated; *not* a runtime dependency. |
| Audio playback | **Native `HTMLAudioElement`** via a small sound manager | Simplest; no extra service. (Howler.js only if we later need sprites/overlap — flagged below.) |
| Deploy | **Vercel** (free static host) | Reliable free deploy early; recorded demo is the fallback. No backend or paid runtime services. |

Docs: React https://react.dev · TypeScript https://www.typescriptlang.org · Vite https://vitejs.dev · Framer Motion https://www.framer.com/motion · Vitest https://vitest.dev · Piper https://github.com/rhasspy/piper · Vercel https://vercel.com.

Versions: use current stable at build time — **flag to verify** exact React/Vite/Framer majors when scaffolding. Piper verified maintained (active repo, `pip install piper-tts`).

## Where It Runs and How Someone Tries It

- **Runtime:** any modern browser. **Dev/build needs Node.js** (already installed, v24) — on this Windows machine use `npm.cmd`/`npx.cmd` (PowerShell blocks the `.ps1` shims). **No API keys at runtime.** Voice generation (Piper) happens offline at asset-creation time, not in the app.
- **Start locally:** `npm install` → `npm run dev` → open the printed `http://localhost:5173`. Production check: `npm run build` → `npm run preview`.
- **Demo recording:** run locally, walk the intended path — answer `1/2+1/3` as `2/5`, catch Oopsy's `3/7`, teach the fix to `11/12`, solve the transfer, then the delayed notebook re-check — capturing the five success criteria and the Wrap summary. Keep it ~1 minute.
- **Deployment (target, optional for submission):** build the static Vite output and deploy to **Vercel** **early** (right after Tier 1 works), then verify the live URL. Submission still requires the short demo video + public GitHub repo; a deployed URL is a bonus, never a substitute. No backend or paid runtime services. Steps finalized in `6-ship`.

## Look and Feel

Carried from `prd.md > Look and Feel` and `scope.md > Inspiration & Identity` — direction a build agent can act on, established **early** (not left to the end):

- **World:** "Oopsy's Workshop" — a small, colorful, interactive illustrated world, *not* a generic dashboard with a mascot on top. Hybrid art: an **illustrated background** (generated/CC0 art acceptable) + an **original SVG Oopsy** whose expression layers swap and animate consistently across every state.
- **Palette:** warm backgrounds with bold accents — turquoise, sunny yellow, coral, orange, violet. Define as CSS design tokens.
- **Typography:** playful display face for headings/Oopsy + highly readable body for problems/captions. Confirmed (SIL Open Font License via Google Fonts): **Fredoka** for display headings and Oopsy's character text + **Nunito** for body/learning content. Prioritize readability for ages 10–14.
- **Objects & motion:** illustrated notebook, number tiles, pencils, drawers; organic shapes, tactile buttons. Motion is purposeful and mapped to loop beats (wrong number wobbles, tapped step highlights, wrong solution erases/repairs, Oopsy physically reacts). Honor `prefers-reduced-motion`.
- **Copy tone:** warm, playful, encouraging; short and age-appropriate (10–14), never babyish. Every spoken line has an on-screen caption.
- The stack honors all of this: CSS/SVG for identity, Framer Motion for motion. No constraint blocks the direction.

## Components

### Content Library
Static TS/JSON module: the concept, problems, the add-across misconception, Oopsy's authored wrong solution as ordered moves with a `wrongMoveId`, principle options (+ distractors), rebuild steps, feedback lines, and voice-line keys. Single concept now; schema built to extend. PRD ref: `prd.md > Answer input & deterministic detection`, `> Teach Oopsy (correct)`.

### Fraction & Misconception Engine
Pure functions: `evaluateAnswer(problem, {num,den})` → correct / add-across / other; value comparison by cross-multiplication with a **nonzero-denominator guard**; `equivalentFraction(frac, targetDen)`; `addAcrossResult(a,b)` = `(a.n+c.n)/(a.d+c.d)`. Detection distinguishes a correct *equivalent* fraction from the authored add-across value (they differ for every chosen unlike-denominator problem). Fully unit-tested (Vitest). PRD ref: `prd.md > Answer input & deterministic detection`, `> Teach Oopsy (correct)`.

### Loop State Machine (Controller)
Explicit states mirroring the journey; guards which transitions are legal; drives Oopsy reactions, recording, and the correct-first-answer branch. PRD ref: `prd.md > The Core Journey`.

### Session State & Progress Recorder
In-memory store (React state/context): current step, per-step attempt counts, and the five recorded success criteria. No `localStorage`, no backend — reload resets. Feeds the Wrap summary. PRD ref: `prd.md > Progress / proof recording`, `> States and Boundaries` (Persistence A5).

### Workshop Scene & Layout
The persistent illustrated scene: background layer, Oopsy, notebook/board panel, tile tray, caption bar, mute + volume controls. State changes swap panel content, not routes. PRD ref: `prd.md > Screens and Layout`, `> Look and Feel`.

### Oopsy Character (SVG) & Expressions
One original SVG creature with swappable expression layers (curious, confident, confused, surprised, excited, celebrating — 4–6 states) and a small set of poses; animated via Framer Motion. Consistent across all screens. PRD ref: `prd.md > Oopsy reacts & repairs`, `> Look and Feel`.

### Notebook / Solution Panel (Identify + Rebuild)
Renders Oopsy's solution as discrete, tappable moves; handles identify (tap the wrong move) and the rebuild (principle choice + fill-in-the-blank equivalence). No "reveal answer" control. PRD ref: `prd.md > Catch Oopsy's mistake (identify)`, `> Teach Oopsy (correct)`.

### Number Tile Input
Bounded, selectable number tiles for building fractions and filling blanks (A2: bounded fill-in-the-blank, not free-form tiles). Child actively constructs the corrected solution. PRD ref: `prd.md > Answer input & deterministic detection`, `> Teach Oopsy (correct)`.

### Hint Ladder
Per-step wrong-attempt counter: 2 misses → gentle hint (Oopsy narrows/highlights); 3rd → Oopsy models that sub-step (partial reveal) while the child still completes it. No global reveal. PRD ref: `prd.md > Hint ladder (deterministic)`.

### Audio & Captions
Small sound manager over native `HTMLAudioElement`: plays the pre-generated voice-line bank + CC0 SFX (write, erase, discover, celebrate). Captions mirror every line; mute + volume controls; no loud autoplay; **full no-audio path** (all essential info in text/visual). PRD ref: `prd.md > Character voice, audio & captions`.

### Animation Layer
Framer Motion wrappers for the purposeful beats: number wobble, step highlight, erase/repair of the wrong solution, Oopsy reaction transitions, new-challenge reveal. PRD ref: `prd.md > Oopsy reacts & repairs`, `> Look and Feel`.

## Data Model

**Content (bundled, read-only):**
```ts
type Concept = { id: string; title: string; problems: Problem[] };
type Problem = {
  id: string; prompt: string;                    // "1/2 + 1/3" or word problem
  a: Frac; b: Frac; correct: Frac;               // correct = 5/6
  misconceptions: { id: string; result: Frac }[];// add-across = 2/5
  surface: 'plain' | 'word';                      // delayed re-check uses 'word'
};
type Frac = { n: number; d: number };            // d !== 0 enforced
type OopsySolution = {
  problemId: string; moves: { id: string; text: string; isWrong: boolean }[];
  wrongMoveId: string;                            // "Bottoms: 3 + 4 = 7"
  principleOptions: { id: string; text: string; correct: boolean }[];
  rebuildSteps: { label: string; answerNum: number; den: number }[]; // 8/12, 3/12, 11/12
  repaired: Frac;                                 // 11/12
};
type Lines = { voiceKey: string; caption: string; sfx?: string }[];   // per beat/reaction
```

**Session (in-memory, reset on reload):**
```ts
type Session = {
  step: LoopState;
  attempts: Record<string, number>;              // per interactive step, drives hint ladder
  detectedMisconception?: string;
  results: {                                      // the five observable criteria
    mapped: boolean; mirrored: boolean; identifiedAndCorrected: boolean;
    transferCorrect: boolean; recheckErrorReturned: boolean;
  };
};
```

**Where data lives / updates / on return:** content is bundled and immutable; session state is React state updated by controller transitions; **navigating away or reloading discards it** (no persistence, per A5).

## File Structure

```
Oopsy/
├── devpost/                     # learning workspace (scope, prd, spec, ...)
├── public/
│   ├── audio/voice/             # pre-generated Piper voice lines (.ogg/.mp3)
│   ├── audio/sfx/               # CC0 sound effects (licensed)
│   └── art/                     # illustrated Workshop background(s)
├── src/
│   ├── content/
│   │   ├── fractions.ts         # Concept/Problem/OopsySolution data (one concept)
│   │   └── lines.ts             # voice keys + captions + sfx mapping
│   ├── engine/
│   │   ├── fraction.ts          # value compare, equivalentFraction, addAcross
│   │   ├── detection.ts         # answer -> misconception mapping
│   │   └── __tests__/           # Vitest: engine + detection correctness
│   ├── loop/
│   │   ├── machine.ts           # loop state machine + guards
│   │   └── session.ts           # in-memory session/progress state
│   ├── components/
│   │   ├── WorkshopScene.tsx    # scene + layout
│   │   ├── Oopsy/               # SVG character + expression layers
│   │   ├── Notebook.tsx         # solution moves, identify + rebuild UI
│   │   ├── NumberTiles.tsx      # bounded tile input
│   │   ├── Captions.tsx         # caption bar
│   │   ├── AudioControls.tsx    # mute + volume
│   │   └── WrapSummary.tsx      # recorded success criteria
│   ├── audio/soundManager.ts    # HTMLAudio playback of voice + sfx
│   ├── motion/                  # Framer Motion animation presets
│   ├── styles/tokens.css        # palette, type, spacing tokens
│   ├── App.tsx
│   └── main.tsx
├── tools/gen-voice/             # offline Piper script -> public/audio/voice
├── index.html
├── package.json
├── vite.config.ts
└── README.md                    # run/record/deploy instructions
```

## External Services and Dependencies

- **Piper TTS** (dev/asset-time, offline, MIT): generate the voice bank into `public/audio/voice`. No key, no cost, no rate limit. https://github.com/rhasspy/piper. **Quality unverified — validate with samples before committing (see Decisions).**
- **Vercel** (static host): free tier, deploy the Vite `dist/` build. No backend, no paid runtime, no cost. https://vercel.com.
- **Google Fonts** (Fredoka + Nunito, SIL OFL): free, license permits reuse. https://fonts.google.com.
- **CC0 assets** for SFX/background if used: Kenney https://kenney.nl/assets (CC0), freesound https://freesound.org (**check each file's license**). No paid anything.
- **No runtime APIs, no keys, no accounts.**

## Important Failure Modes

- **Voice bank sounds robotic in testing** → fallback: record a small set of lines ourselves (learner pre-approved). Captions carry meaning regardless.
- **Deploy breaks / host unavailable** → local `npm run preview` + the recorded demo video (the required artifact anyway).
- **Audio file missing or blocked by autoplay policy** → caption + visual still convey everything; audio never required to proceed; no loud autoplay.
- **Child gives an unexpected answer (neither correct nor add-across)** → authored "hmm, not quite — try again," bounded retries; loop doesn't break.

## What Was Simplified and Why

- **Session-only state** instead of accounts/DB — matches A5; a persistent version would need a backend + auth + storage, none of which proves the kernel.
- **One concept, one misconception, hardcoded content** instead of a broad library — proves the mechanism; the schema is built so more can be added later without a rewrite.
- **Simulated delayed re-check** (a later in-session stage) instead of real spaced multi-day follow-up — the real version needs persistence + scheduling; the simulation still demonstrates "does the misconception return," and we label it as simulated.
- **Pre-authored mirrored mistake** instead of dynamic generation — the kernel is the *perceived* connection, not literal reproduction; generation would add cost/validation risk without strengthening the proof. (Kernel is real, not faked.)
- **Bounded fill-in-the-blank tiles** instead of a free-form fraction manipulative (A2) — tactile enough because the child constructs the solution; free tiles add build cost without proving more.
- **Value-based validation** instead of a symbolic math engine — cross-multiplication is exact and testable for our authored problems.

## Quality Tiers and Build Sequence

Estimates are rough and assume focused work; several days are available, so tiers let us stop cleanly at any line without a broken loop.

### Tier 1 — Minimum working (the loop is correct)
Entire loop end-to-end: detection → mirrored mistake → identify → rebuild/correct → immediate transfer → delayed-check **simulation** → Wrap summary. Deterministic engine + detection unit-tested and passing. Placeholder art/audio acceptable. Runs locally.
**Estimate: ~6–10 hours.**

### Tier 2 — Target submission (polished & memorable)
All of Tier 1 **plus**: illustrated Workshop background; original SVG Oopsy with 4–6 expressive states; polished purposeful animations (wobble, highlight, erase/repair, reactions); consistent character voice bank + SFX; captions + mute/volume; distinctive typography/UI (no generic-dashboard feel); reliable deployed demo; recorded video.
**Estimate: ~15–25 hours incremental** (art, character, voice, animation, deploy, and full-flow testing dominate).

### Tier 3 — Optional enhancements (droppable, loop never compromised)
Extra Oopsy idle animations; richer background interactivity; more SFX; a second misconception or problem variation to *show* extensibility; celebration particles; accessibility extras (reduced-motion polish, larger-text mode).
**Estimate: as time remains; ~0.5–3 hours each.**

### Build sequence (loop-first, deploy early, reserve testing)
1. Scaffold (React+TS+Vite) → engine + detection + **Vitest** (Tier 1 core logic).
2. Loop state machine + placeholder UI, end-to-end → **validate Tier 1** (the central interaction works).
3. Stand up the **deploy pipeline early** and smoke-test the live static URL (de-risks the target).
4. Establish **visual direction**: background + Oopsy SVG + palette/type tokens (early, per your instruction).
5. Wire expressions + purposeful animations to the loop beats.
6. **Voice gate:** generate ~3 Piper sample lines → *you* validate quality → then generate the full bank (or record fallback) → add SFX → captions/controls.
7. Polish, then **full-flow test + bug fixes + re-record demo** (reserved explicitly).

Realistic total for Tier 1 + Tier 2 ≈ **3–5 focused days**, leaving room for Tier 3 and refinement before submission.

## Decisions and Open Issues

**Learner decisions (accepted):**
- Stack: **React + TypeScript + Vite + Framer Motion + Vitest**; client-side, **no backend/persistence**.
- **Deployment included as a target** on a free static host; get it running locally first, deploy early to test; recorded demo kept as fallback.
- Art: **hybrid** — illustrated Workshop background (generated/CC0 allowed) + **original SVG Oopsy**, consistent and animatable; prioritize visual quality/coherence; establish direction early; must not look like a generic dashboard + mascot.
- Voice: **investigate free offline neural TTS (Piper)** with a validation gate; light audio processing allowed; **self-record a small line set** if free TTS sounds too robotic; small curated line + SFX set; captions, mute, volume required; essential interactions work without audio; check asset licenses.
- Tiers: define **minimum working / target submission / optional** with realistic estimates and reserved testing time; loop-first, incremental polish.
- Product decisions unchanged: one concept, one misconception, deterministic mapping, no paid AI APIs, no persistence.

**One useful unknown (agreed investigation):** whether a free, offline TTS (Piper) can produce a **consistent, expressive, playful cartoon-character voice** for ages 10–14 that isn't babyish or robotic. *How we'll resolve it:* early in the build, generate ~3 sample lines with 1–2 Piper voices, listen, and apply light pitch/formant shift if it helps. *Evidence needed:* a sample you accept as playful and non-robotic. *If it fails:* record a small set ourselves (you pre-approved this). Recorded here per the process.

**Final choices (resolved by learner):**
1. **Deploy host: Vercel** — deploy the static Vite app early, verify the live URL, keep the recorded demo as fallback; no backend or paid runtime services.
2. **Fonts: Fredoka** (display headings + Oopsy's character text) + **Nunito** (body/learning content), both OFL; prioritize readability for ages 10–14.
3. **Background art: approved** — image generation and/or suitable CC0 assets for the Workshop background/decor; **Oopsy remains an original hand-built SVG** with consistent, expressive states.

**Implementation details I'll proceed with unless you object** (not worth a decision cycle): native `HTMLAudioElement` over Howler.js (revisit only if we need audio sprites/overlap); the delayed re-check presented behind a simple in-session "later/next day" transition to signal the time gap while staying simulated.

**Carried from `prd.md > Open Questions`:** voice approach (resolved into the investigation above); quality tiers (defined above).
