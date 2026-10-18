---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

<!-- Tier guide (spec.md > Quality Tiers): Slices 1-4 = Tier 1 minimum working loop;
     Slice 5 = early deploy (de-risk); Slices 6-9 = Tier 2 target submission polish;
     Slice 10 = test/refine. Tier 3 optional enhancements are not scheduled slices —
     they are droppable and only picked up if time remains after Tier 2. -->

## Slices

- [x] **1. Scaffold + the diagnostic question detects the misconception**
  Becomes usable: A running Vite/React/TS app where the child builds a fraction answer for `1/2 + 1/3` with placeholder tiles and the engine classifies it — `2/5` → add-across, `5/6` → correct, other → retry — and shows a placeholder result.
  Why now: Bootstraps the project *and* lands the deterministic kernel risk first, with runnable evidence (unit tests). Every later slice depends on trustworthy math and mapping.
  PRD ref: `prd.md > Answer input & deterministic detection`, `prd.md > The Core Journey` (steps 1-2)
  Spec ref: `spec.md > Stack`, `spec.md > Fraction & Misconception Engine`, `spec.md > Number Tile Input`, `spec.md > Data Model`, `spec.md > File Structure`
  Build: Scaffold React+TS+Vite per the file structure; add the content library (`content/fractions.ts`, `content/lines.ts`); implement `engine/fraction.ts` (value compare by cross-multiplication, nonzero-denominator guard, equivalentFraction, addAcross) and `engine/detection.ts`; placeholder `NumberTiles`; `App` renders Q1 and classifies the answer; Vitest tests for the engine and detection.
  Verify (mechanical): `npm run dev` starts with no errors; `npm run test` passes; in the running app, `2/5` shows add-across detected, `5/6` shows correct, another value shows retry.
  Learner check: Open the app, answer `1/2 + 1/3` as `2/5` and then as `5/6`, and confirm the classification shown matches each time.
  Commit: `Scaffold app with deterministic fraction/misconception engine and tests`

- [x] **2. Oopsy mirrors the mistake and the child identifies the wrong step**
  Becomes usable: After add-across is detected, Oopsy's authored wrong solution (`2/3 + 1/4 = 3/7`) renders as discrete moves; the child taps a move — the wrong one highlights/wobbles with a placeholder Oopsy reaction, a valid one gives "that step's fine" feedback. Nothing is revealed.
  Why now: This is the heart of the kernel (recognition + identify), so it appears immediately after detection, before any polish.
  PRD ref: `prd.md > Catch Oopsy's mistake (identify)`, `prd.md > The Core Journey` (steps 3-4)
  Spec ref: `spec.md > Loop State Machine (Controller)`, `spec.md > Notebook / Solution Panel (Identify + Rebuild)`, `spec.md > Content Library`, `spec.md > Oopsy Character (SVG) & Expressions`
  Build: Implement loop states intro→diagnostic→mirror→identify with guards; render `OopsySolution.moves` from content; tap handling against `wrongMoveId`; placeholder Oopsy with reaction states; record `mirrored` and identify progress in session state.
  Verify (mechanical): Dev run — after `2/5`, the mirror renders; tapping the wrong move highlights/wobbles and advances; tapping a valid move shows retry feedback and does not advance; illegal transitions are blocked.
  Learner check: Answer `2/5`, then tap the wrong step and a correct step; confirm identifying the mistake feels clear and that no answer is revealed.
  Commit: `Add Oopsy mirrored mistake and tap-to-identify step`

- [x] **3. The child teaches Oopsy: principle choice + equivalent-fraction rebuild + repair**
  Becomes usable: One principle choice, then fill-in-the-blank equivalence (`2/3=▢/12→8`, `1/4=▢/12→3`, `8/12+3/12=▢/12→11`) with tiles, engine-validated; the hint ladder fires on misses; on completion the solution repairs `3/7`→`11/12` with a placeholder animation and Oopsy reaction sequence.
  Why now: Completes the kernel's distinctive teaching moment — the thing a reviewer remembers — before identity or audio work.
  PRD ref: `prd.md > Teach Oopsy (correct)`, `prd.md > Hint ladder (deterministic)`, `prd.md > Oopsy reacts & repairs`
  Spec ref: `spec.md > Notebook / Solution Panel (Identify + Rebuild)`, `spec.md > Number Tile Input`, `spec.md > Hint Ladder`, `spec.md > Fraction & Misconception Engine`, `spec.md > Animation Layer`
  Build: Principle-options UI (one correct + distractors); rebuild steps with tile blanks validated by the engine; hint ladder (2 misses → hint, 3rd → model sub-step); repair transition (placeholder animation); Oopsy confused→surprised→excited; record `identifiedAndCorrected`. No "reveal answer" control.
  Verify (mechanical): Dev run — correct principle + filling 8/3/11 completes the repair and records the criterion; wrong entries give targeted feedback; hint appears at 2 misses and models at the 3rd; confirm no reveal-answer control exists.
  Learner check: Teach Oopsy end to end; say whether it feels like *teaching* (constructing the fix) rather than selecting a final answer, and whether the hint behaves sensibly.
  Commit: `Add teach-Oopsy correction sequence with hint ladder and repair`

- [x] **4. Immediate transfer, delayed re-check, and Wrap summary close the loop**
  Becomes usable: The transfer problem (`1/4 + 1/3`) is validated; a later notebook word problem (`1/2 + 1/4` cups) acts as the simulated delayed re-check recording returned/not-returned; the Wrap summary shows all five success criteria. **Tier 1 (minimum working) is complete.**
  Why now: Closes the full loop so the minimum working version is verifiable end-to-end before polish and deploy.
  PRD ref: `prd.md > Immediate transfer & delayed re-check`, `prd.md > Progress / proof recording`, `prd.md > States and Boundaries` (Wrap, correct-first-answer branch)
  Spec ref: `spec.md > Loop State Machine (Controller)`, `spec.md > Session State & Progress Recorder`, `spec.md > Content Library`, `spec.md > What Was Simplified and Why` (simulated delayed re-check)
  Build: Add transfer and delayed-recheck states with a simple in-session "later/next day" transition (clearly simulated); implement the correct-first-answer branch (must not imply the mistake was the child's); `WrapSummary` reads session results; record all five flags.
  Verify (mechanical): Dev run — the intended path completes and Wrap shows all five criteria; the correct-first-answer branch works gracefully; transfer and re-check answers validate correctly.
  Learner check: Play the whole loop from `2/5` to the Wrap summary and confirm each of the five criteria is visibly recorded.
  Commit: `Close the loop with transfer, simulated delayed re-check, and wrap summary`

- [x] **5. Production build deploys to a live Vercel URL** _(deployed after Slice 9 per the learner's deferral — see Revisions)_
  Becomes usable: `npm run build` output deploys to Vercel and the full loop works at the live URL. **Live at https://oopsy-phi.vercel.app (project `oopsy`).** _Note: Vercel Deployment Protection (Vercel Authentication) is ON by default and gates the public URL — the learner must disable it in the dashboard for public/demo access; verified via `vercel curl` (HTTP 200 for the app + voice/SFX assets)._
  Why now: The spec says deploy early to de-risk the target. A single technical slice that independently proves the deployment risk with runnable evidence (a working live URL) — the allowed layer-only exception. **Needs your Vercel login when we reach it.**
  PRD ref: `prd.md > Proof of success (observable, recorded in the demo)`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies` (Vercel)
  Build: Add Vercel build config for Vite; run `npm run build`; deploy `dist/` to Vercel; document run/record/deploy steps in `README.md`.
  Verify (mechanical): `npm run build` succeeds with no errors; the deployed URL loads and the intended loop path completes.
  Learner check: Open the live Vercel URL and run the intended path once.
  Commit: `Add production build and Vercel deployment`

- [x] **6. Workshop visual identity + original SVG Oopsy replace placeholders**
  Becomes usable: The app looks like "Oopsy's Workshop" — an illustrated background (generated/CC0), design tokens (palette + Fredoka/Nunito), and an original SVG Oopsy with 4–6 expression states, replacing placeholder visuals.
  Why now: Your stated priority — establish the visual direction early so it never becomes a generic dashboard with a mascot. Comes right after the loop is proven.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Screens and Layout`, `prd.md > Oopsy reacts & repairs`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Workshop Scene & Layout`, `spec.md > Oopsy Character (SVG) & Expressions`
  Build: `styles/tokens.css` (palette, spacing, type); load Fredoka + Nunito; generate/assemble the illustrated Workshop background and decor; build the Oopsy SVG with swappable expression layers; apply to the scene and map expressions to loop states.
  Verify (mechanical): Dev run renders the styled Workshop; Oopsy switches expression per state with no console errors; `npm run build` succeeds.
  Learner check: Look at the Workshop — does it feel like a distinctive illustrated world rather than a generic educational dashboard, and is Oopsy recognizable and consistent?
  Commit: `Establish Workshop visual identity and SVG Oopsy character`

- [x] **7. Purposeful animations wired to the loop beats**
  Becomes usable: Wrong number wobbles, tapped step highlights, wrong solution erases/repairs, Oopsy physically reacts, new challenges reveal — via Framer Motion, honoring `prefers-reduced-motion`.
  Why now: Motion supports the learning experience and makes correcting Oopsy feel satisfying; layered onto the established identity.
  PRD ref: `prd.md > Oopsy reacts & repairs`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Animation Layer`, `spec.md > Look and Feel`
  Build: Framer Motion presets in `motion/`; wire to identify, repair, reaction, and reveal beats; add a reduced-motion fallback.
  Verify (mechanical): Dev run — each beat animates as specified; reduced-motion is respected; no layout breakage; `npm run build` succeeds.
  Learner check: Run the loop and confirm the animations communicate what's happening and make the correction feel satisfying, not decorative noise.
  Commit: `Wire purposeful animations to the learning loop beats`

- [x] **8. Voice gate: validate Piper samples before committing to the pipeline**
  Becomes usable: ~3 sample voice lines generated with Piper (1–2 voices, light pitch/formant shift if it helps), playable in-app for you to judge against the quality bar.
  Why now: The voice is the flagged unknown; we validate quality *before* building a whole bank. Your instruction: test early, and switch to self-recorded lines rather than over-investing if it falls short. Risk-proving slice with runnable evidence (audio samples).
  PRD ref: `prd.md > Character voice, audio & captions`
  Spec ref: `spec.md > External Services and Dependencies` (Piper), `spec.md > Audio & Captions`, `spec.md > Decisions and Open Issues` (voice investigation)
  Build: `tools/gen-voice` Piper script; generate 3 sample lines into `public/audio/voice`; sound manager plays them in-app.
  Verify (mechanical): Sample audio files generate and play in-app without error.
  Learner check: Listen to the samples — is the voice playful and expressive, right for ages 10–14, not babyish or robotic? Decide: proceed with Piper, or switch to recording a small line set ourselves.
  Commit: `Add Piper voice tooling and sample lines for validation`

- [x] **9. Full audio: voice bank, SFX, captions, controls, and no-audio path**
  Becomes usable: A consistent voice bank for all beats + licensed CC0 SFX (write, erase, discover, celebrate); captions on every line; mute + volume controls; no loud autoplay; every essential interaction completable with audio off.
  Why now: After the voice approach is validated, this completes the audio experience without risking the loop.
  PRD ref: `prd.md > Character voice, audio & captions`
  Spec ref: `spec.md > Audio & Captions`, `spec.md > External Services and Dependencies` (CC0 SFX), `spec.md > Important Failure Modes`
  Build: Generate/select the full voice bank per the slice-8 decision; add CC0 SFX (verify each license); caption bar; `AudioControls` (mute/volume); confirm the full no-audio path.
  Verify (mechanical): Dev run — lines and SFX play per beat; captions always visible; mute/volume work; with audio off the full loop is still completable; `npm run build` succeeds.
  Learner check: Play once with sound on and once muted; confirm captions and controls work and nothing essential requires audio.
  Commit: `Add character voice bank, SFX, captions, and audio controls`

- [x] **10. Full-flow test, bug fixes, and deployment verification**
  Becomes usable: A stable, polished build; the full loop tested end-to-end locally and on Vercel; bugs fixed; demo path rehearsed and recording-ready. **Done:** all three branches (intended, correct-first, invalid/hint-ladder) exercised against the production build with zero console errors; 32/32 tests + clean build; redeployed and verified live (`oopsy-phi.vercel.app` serving the new build hash + audio assets). _Two bugs fixed: (1) the bottom progress strip's 5th chip stayed unchecked after the loop while the Wrap summary showed it done — added a `recheckDone` flag both read, so they can't disagree; (2) the correct-first path's closing caption said "no add-across this time", implying the child had erred (violates the A3 rule) — reworded to "same denominators first" and regenerated that voice line._
  Why now: Your priority — test the complete flow and the Vercel deployment before submission, with reserved time for fixes.
  PRD ref: `prd.md > Proof of success (observable, recorded in the demo)`
  Spec ref: `spec.md > Quality Tiers and Build Sequence` (reserved testing), `spec.md > Important Failure Modes`
  Build: Run engine tests; play every branch (intended, correct-first-answer, wrong inputs, hint ladder); fix bugs; redeploy to Vercel and verify the live URL; write demo-recording steps in `README.md`.
  Verify (mechanical): `npm run test` passes; `npm run build` succeeds; the live Vercel URL completes the loop; all branches exercised without console errors.
  Learner check: Kick the tires on the live URL — intended path plus awkward inputs — and note anything broken, confusing, or worth changing.
  Commit: `Stabilize full flow, fix bugs, and verify Vercel deployment`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after Slice 4 (Tier 1 loop complete on placeholders): play the full loop and give feedback that shapes the polish phase. _Learner reviewed and opted to proceed to the polish phase; requested deployment be deferred until the app is complete._
- [x] Visual direction explored — after Slice 6: confirm the Workshop feels distinctive and Oopsy reads as one consistent character (shapes remaining visual/animation work). _Learner approved the direction; proceed to animation._
- [x] Voice gate decision — at Slice 8: accept the Piper sample or switch to self-recorded lines. _Passed with Piper `en_US-amy-medium` (female); learner chose female-only and removed the in-interface preview (Voice Lab) after the gate._
- [x] Final kick-the-tires exploration and feedback completed — at Slice 10, on the live URL. _Learner played the live build after the audio fixes; confirmed the dialogue sync, exit control and favicon feel right and the build is good._

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap. _Guided route through the finished code delivered in chat (loop controller → guard table → detection engine → content schema → audio gate), plus `devpost/app-map.html` generated from the finished source._
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate. _Optional hands-on edit offered; learner opted to proceed straight to ship (declined for now). Transfer reflection offered; personal reflection stays in the ignored `learner-profile.md`._
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse. _Self-contained offline HTML: loop stepper, file map, data flow, and two reusable patterns (guarded state machine in `machine.ts`; deterministic no-AI validation in `detection.ts`)._

Activity and evidence: Code tour delivered in chat against the finished source; `devpost/app-map.html` written and shown. Verified this session: `npm run test` 32/32 pass, `npm run build` clean, live Vercel build serving the current hash.
Route and stops: `src/App.tsx` (`renderPanel`, `go`, `say`, `handleTransfer` flow gate, `startDiagnostic`) → `src/loop/machine.ts` (`canTransition`) → `src/loop/session.ts` (`hintLevel`, `bumpAttempt`) → `src/engine/detection.ts` (`detectAnswer`) → `src/content/fractions.ts` (`OopsySolution`) → `src/audio/sound.ts` (`playVoice`, `whenVoiceIdle`) → `src/components/Oopsy/index.tsx` (expression layers).
Edit outcome: No edit made during the tour; optional edit offered and declined in favour of shipping.
Reflection: Offered; any personal reflection belongs only in the ignored `devpost/learner-profile.md`.
Activity mode: Live app (local preview + live Vercel URL) and editor, with the static `app-map.html` as the durable reference.

## Revisions

- **Slice 5 (Vercel deploy) deferred until the app is complete.** The learner chose to build the full working app (Slices 6–9: identity, animation, voice, audio) before deploying, rather than deploying the placeholder loop early. Build discovered no technical problem with this — it reorders the de-risking step. New order: Slices 1–4 (done) → 6 → 7 → 8 → 9 → **5 (deploy)** → 10 (full-flow test + deploy verification). Slice 5's early-deploy rationale is preserved by still deploying before final testing and submission; the recorded demo remains the fallback. The kernel and product decisions are unchanged.
- **Voice gate passed: Piper `en_US-amy-medium` (female) is Oopsy's voice; the Voice Lab preview UI was removed.** The learner listened to both candidates and chose female-only, and asked that the sample-preview panel not ship in the interface (it served the gate, then went). Only the amy voice bank is generated/committed; the joe samples remain untracked local artifacts. Piper stays an asset-time tool, never a runtime dependency.
- **SFX are self-authored, not sourced CC0.** The spec said "licensed CC0 SFX"; the build instead synthesizes the four cues (write, erase, discover, celebrate) procedurally in `tools/gen_sfx.py`. Rationale: original assets carry zero license risk and match the Workshop's soft, playful tone; sourcing CC0 clips would have required per-clip license checks for no gain. Behavior contract (four named cues tied to loop actions) is unchanged.
- **Final-review feedback fixes (post-Slice 10).** The learner's live kick-the-tires surfaced four changes, all shipped and redeployed: (1) added an Oopsy-character favicon (`public/favicon.svg`, wired into `index.html`); (2) fixed speech cut-off by replacing the interrupt-on-play audio manager with a FIFO voice queue in `src/audio/sound.ts` — a line never cuts off the one before it — and gated every auto-transition (`handleDiagnostic`/`handleTransfer`/`handleRecheck`, plus the chained repair beats) on `await say(...)` + a re-entrancy guard so the flow advances in sync with speech (the reported transfer-section bug); (3) the greeting now plays on the first user gesture (browsers block audio before any interaction, so true silent autoplay is impossible) and `startDiagnostic` waits for it; (4) added an Exit button (top-left, hidden on intro) that stops speech and returns to the Workshop home mid-session. No kernel or product-decision change; behavior contract preserved, captions + full no-audio path intact.