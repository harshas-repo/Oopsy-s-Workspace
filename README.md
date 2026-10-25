# Oopsy's Workshop

**A character-driven fraction-learning proof of concept where the child becomes the teacher.**

**Live demo:** <https://oopsy-phi.vercel.app>

Instead of being told they're wrong, the child **catches Oopsy's mistake and teaches the
fix**. Oopsy is a friendly workshop companion who reproduces the classic *add-across*
fraction error; the child spots it, explains the right principle, and watches Oopsy repair
its own work.

Everything is **deterministic and client-side**: no AI calls at runtime, no accounts, no
persistence. Oopsy's voice is pre-generated with [Piper](https://github.com/rhasspy/piper)
(asset-time only), and every spoken line has a caption, so the whole loop is playable with
sound off.

## What Oopsy is

Oopsy's Workshop is a small, self-contained web app (a proof of concept) that teaches
fraction addition with unlike denominators through role reversal: the learner diagnoses and
corrects a character's mistake instead of being corrected themselves. One concept, one
misconception, one complete loop — built to test whether *teaching the character* makes the
reasoning stick.

## The problem it solves

When a child answers `1/2 + 1/3 = 2/5`, the usual response is "wrong, try again." That tells
them *what* but never *why*, and the underlying misconception — adding numerators and
denominators straight across — survives to the next problem. Oopsy flips the dynamic: the
mistake becomes something the child gets to *diagnose and fix in someone else's work*, which
surfaces the faulty logic explicitly and turns the correct principle into the child's own
discovery rather than a handed-down rule.

## Who it's for

- Children roughly **10–14** who are learning (or re-learning) fraction addition with unlike
  denominators.
- Parents and educators who want a gentle, conceptual way to address the add-across
  misconception without it feeling like a test.
- Anyone curious about mistake-driven, character-led learning interactions.

## How it works

The app runs a single guarded loop; every step is validated deterministically (no AI at
runtime):

1. **Diagnose** — the child answers `1/2 + 1/3` using number tiles.
2. **Mirror** — a wrong answer (e.g. `2/5`) maps to the add-across misconception; Oopsy
   reproduces that same mistake on a fresh problem (`2/3 + 1/4 = 3/7`).
3. **Identify** — the child taps the wrong step in Oopsy's worked solution.
4. **Teach & rebuild** — the child picks the correcting principle, then rebuilds the
   equivalent fractions with bounded number tiles.
5. **Repair** — Oopsy erases and repairs its own solution (`3/7 → 11/12`).
6. **Transfer & re-check** — a fresh same-concept problem, then a simulated delayed re-check
   to see whether the misconception returns.
7. **Wrap** — a summary records all five success criteria for the session.

Answer checking, misconception detection, and the hint ladder are pure functions over an
authored content schema, so behavior is reproducible and unit-testable.

## Screenshots

| Intro | Diagnostic |
| --- | --- |
| <img src="docs/screenshots/01-intro.png" alt="Intro: Oopsy in the Workshop" width="380"> | <img src="docs/screenshots/02-diagnostic.png" alt="Diagnostic: build 1/2 + 1/3 with tiles" width="380"> |

| Oopsy mirrors the mistake | Repair the solution |
| --- | --- |
| <img src="docs/screenshots/03-mirror.png" alt="Mirror: Oopsy makes the same add-across mistake" width="380"> | <img src="docs/screenshots/04-repair.png" alt="Repair: Oopsy corrects 3/7 to 11/12" width="380"> |

<p align="center">
  <img src="docs/screenshots/05-wrap.png" alt="Wrap: session summary with all five criteria" width="760">
</p>

## How to run it locally

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

### Tests and build

```bash
npm run test        # Vitest: engine + loop logic + content validation
npm run typecheck   # tsc --noEmit
npm run build       # production build into dist/
npm run preview     # serve dist/ locally
```

### The intended demo path

1. **Intro** → Begin
2. **Diagnostic**: build `1/2 + 1/3` with tiles; answer `2/5` to trigger the mirror path
   (`5/6` for the correct path)
3. **Mirror**: watch Oopsy make the same mistake → **Identify**: tap the wrong step
4. **Teach**: pick the principle → rebuild equivalent fractions with tiles
5. **Repair**: watch Oopsy fix `3/7 → 11/12`
6. **Transfer**: a fresh same-concept problem, then a delayed re-check
7. **Wrap**: session summary with all five success criteria

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/docs/) — strict UI
- [Framer Motion](https://www.framer.com/motion/docs/) — sprite, tile and scene animations
- [Vite](https://vitejs.dev/guide/) — dev server and production bundler
- [Vitest](https://vitest.dev/guide/) — unit and integration tests
- [Piper TTS](https://github.com/rhasspy/piper) + [Python](https://docs.python.org/3/) — asset-time voice synthesis
- Native [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement) — voice/SFX playback (no audio library)
- Authored SVG character art; procedural HTML canvas background
- Deployed on [Vercel](https://vercel.com/docs)

## AI-assisted development approach

Oopsy was built with the **Devpost Learn Skill Pack** in a coding agent, using flipped
interaction: the skills interviewed the builder before any code existed, and the builder —
not the agent — made every consequential decision (the add-across anchor, unlike
denominators, the mirror-then-teach mechanic, bounded tile repair, and holding scope to one
concept). The plan-first artifacts live in this repo under `devpost/` (`scope.md`, `prd.md`,
`spec.md`, `checklist.md`, plus `app-map.html`), and the build was delivered as ten verified,
individually committed slices. The agent wrote the code; the human owned the decisions.
Notably, the finished app itself uses **no AI at runtime** — validation is deterministic by
design.

## Project layout

- `src/loop/` — the 12-step guarded loop: state machine, reducer, selectors, steps
- `src/engine/` — validation, misconception detection, and the hint ladder
- `src/content/` — typed content: diagnostic, problems, worked solutions, principles, wrap criteria
- `src/components/` — UI: sprite, captions, tiles, worked-solution rows, buttons, scenes
- `src/audio/` — deterministic voice + SFX playback (native HTMLAudioElement)
- `public/` — Oopsy SVG sprite, audio assets, favicon, `workshop-bg.png` background
- `tools/` — Piper TTS and SFX generator scripts (asset-time, Python)
- `devpost/` — planning docs (scope, PRD, spec, checklist) and the app map

## Project docs

The planning artifacts behind the build live in `devpost/`:
`scope.md`, `prd.md`, `spec.md`, and `checklist.md` (with `app-map.html`).

## Regenerating audio assets (optional)

Voice lines and SFX are committed binaries, so `npm run dev` works out of the box. To
regenerate them from the manifest (Windows, Python 3.9+, Piper):

```bash
python -m venv .venv
.venv\Scripts\pip install piper-tts soundfile
.venv\Scripts\python -m piper.download_voices en_US-libritts_r-medium
.venv\Scripts\piper --model .venv\en_US-libritts_r-medium.onnx --output_dir public/audio/voice < public/audio/voice/manifest.txt
.venv\Scripts\python tools/gen_sfx.py
```

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Harsha.
