---
doc: prd
status: approved
---

# Oopsy — Product Requirements

A character-driven fraction-learning PoC for children **10–14**: Oopsy confidently makes the *same mistake the child just made*, and the child becomes the teacher who catches and fixes it.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

One concept, one misconception, one scene. **Fraction addition with unlike denominators**; misconception = **add-across** ("add the tops and the bottoms"). Deterministic, authored content; **no AI APIs, no free-text interpretation**.

## The Core Journey

A single illustrated scene — **Oopsy's Workshop** — moves through states (not separate screens):

1. **Arrival.** Oopsy greets the child in the Workshop with one short spoken+captioned line and presents the first problem.
2. **Diagnostic problem (Q1): `1/2 + 1/3`.** The child builds an answer fraction with number tiles. The engine maps the value:
   - `5/6` → correct (see the *correct-first-answer branch* in States).
   - `2/5` → **add-across misconception detected** → the loop fires.
   - any other value → gentle "try again" (bounded).
3. **Oopsy's mirrored mistake.** Oopsy says "Easy! I'll just add the tops and the bottoms!" and solves a *different* problem in its notebook: **`2/3 + 1/4 = 3/7`**, shown as discrete moves.
4. **Investigate (identify).** Oopsy: "Wait… did I get that right? Check my work!" The child taps the invalid move (**adding the bottoms**). It highlights/wobbles; Oopsy reacts curious/confused. **Nothing is revealed yet.**
5. **Teach (correct).** A short, meaningful repair sequence:
   a. **One principle choice:** "Make the denominators the same first" (correct) vs. two authored distractors.
   b. **Rebuild with equivalent fractions** by filling bounded blanks with number tiles: `2/3 = ▢/12 → 8`, `1/4 = ▢/12 → 3`, then `8/12 + 3/12 = ▢/12 → 11`.
6. **Oopsy reacts & repairs.** Oopsy transitions confused → surprised → excited ("OHHH! I can't add those bottoms like that! You're the math expert!"); the wrong `3/7` visually repairs into `11/12` with one purposeful animation + a short SFX.
7. **Immediate transfer (Q3): `1/4 + 1/3`** (fresh numbers, correct = `7/12`). Proves the child can apply the corrected method.
8. **Delayed re-check (Q4), later.** A differently-presented problem surfaces in Oopsy's **Workshop notebook** with no reminder of the earlier mistake — e.g., a word problem: *"A recipe needs `1/2` cup + `1/4` cup of oil. How much total?"* (correct = `3/4`; add-across = `2/6`). The engine records whether the add-across error returns.
9. **Wrap.** A short completion summary shows the loop finished and whether the misconception returned on the re-check.

## Screens and Layout

One cohesive scene with states; movement is by transition, not navigation.
- **Workshop (persistent):** warm illustrated background; Oopsy (visible, expressive) at one side; a **notebook/board** panel where problems and Oopsy's written work appear; a **tile tray** for number input; caption bar; **mute + volume** controls always visible.
- **States:** Arrival → Diagnostic → Oopsy's Notebook (mistake) → Investigate → Teach (principle) → Teach (rebuild) → Repair/Celebrate → Immediate Transfer → Delayed Re-check (notebook) → Wrap.

## Look and Feel

Carried from `scope.md > Inspiration & Identity` — **"Oopsy's Workshop"**: colorful, playful illustrated world; a modern animated adventure that teaches math, not a preschool app and **not a generic AI quiz/chatbot UI**. Warm backgrounds with bold accents (**turquoise, sunny yellow, coral, orange, violet**), hand-drawn detail, organic shapes, tactile buttons, distinctive readable typography. Oopsy is an **original, recognizable friendly creature** (not a robot, not a human tutor) with **4–6 expressions** (curious, confident, confused, surprised, embarrassed/excited, celebrating). Animation is **purposeful** (wrong number wobbles; step highlights; wrong solution erased/repaired; Oopsy physically reacts). **Distinctive and polished to submission quality, built loop-first.** The learning mechanism is built and validated first; remaining time then goes into the *quality* of this one concept (a cohesive illustrated Workshop world, a recognizable original Oopsy with expressive states and purposeful animation, and a consistent playful voice) — not into new features. Work is tiered **minimum working → target submission → optional enhancements** (tiers defined in `4-spec`). Concrete palette/type/character/voice direction is finalized in `4-spec > Look and Feel`.

## Features and Behavior

### Answer input & deterministic detection
The child constructs a fraction (numerator/denominator) from number tiles; **denominators must be nonzero**. The engine validates by **numeric value** (cross-multiplication), so unreduced equivalents count as correct. Misconception detection distinguishes a mathematically correct equivalent fraction from the specific authored **add-across** result (`(a+c)/(b+d)`), which is a different value from the correct sum for every chosen unlike-denominator problem.
- [ ] `1/2 + 1/3` answered `2/5` maps to the **add-across** misconception; `5/6` maps to correct; other values trigger bounded retry.
- [ ] Detection is fully deterministic (authored answer→misconception map); no AI call is made.

### Catch Oopsy's mistake (identify)
Oopsy's solution is shown as separate moves so exactly one is invalid.
- [ ] Tapping the invalid move (**"Bottoms: 3 + 4 = 7"**) highlights/wobbles it and triggers an Oopsy curious/confused reaction; the correct answer is **not** revealed.
- [ ] Tapping a valid move gives authored "that step's fine — look again" feedback and allows retry.

### Teach Oopsy (correct)
- [ ] Exactly **one** principle-selection step ("Make the denominators the same first" vs. two distractors); wrong choice → Oopsy confused reaction + retry.
- [ ] Child fills bounded blanks with tiles: `2/3 = ▢/12 (8)`, `1/4 = ▢/12 (3)`, `8/12 + 3/12 = ▢/12 (11)`; each wrong entry → gentle targeted feedback + retry.
- [ ] The child actively rebuilds the solution; there is **no "reveal answer" button**.

### Oopsy reacts & repairs
- [ ] On completion, Oopsy cycles confused → surprised → excited with an authored voice line + caption, and the wrong `3/7` visibly repairs to `11/12` with one animation + SFX.

### Immediate transfer & delayed re-check
- [ ] Immediate transfer (`1/4 + 1/3`, correct `7/12`) uses fresh numbers and is validated by value.
- [ ] Delayed re-check appears later as a **different surface** (notebook word problem), with no reminder of the earlier mistake; the engine records correct vs. add-across.

### Hint ladder (deterministic)
- [ ] Per interactive step, a wrong-attempt counter: **2 misses → gentle hint** (Oopsy narrows/highlights); **3rd miss → Oopsy models that sub-step** (partial reveal) while the child still completes it. No global reveal.

### Character voice, audio & captions
- [ ] Every Oopsy line has a **caption**; **mute + volume** controls present; **every essential interaction is completable with audio off** (full no-audio path).
- [ ] A small set of **consistent** voice lines + a few SFX (write, erase, discover, celebrate); no per-sentence TTS; audio never autoplayed loudly.

### Progress / proof recording
- [ ] The five observable success criteria (below) are recorded in-session and surfaced in the Wrap summary.

## States and Boundaries

- **First use** — brief Oopsy greeting + one captioned instruction; no onboarding wall.
- **Correct-first-answer branch (A3 — resolved)** — if Q1 is answered correctly (`5/6`), the app acknowledges the success, then Oopsy demonstrates its *own* add-across mistake on `2/3 + 1/4`; the child can still investigate and teach Oopsy. **The copy must not imply Oopsy's mistake was the child's own** (no "just like you" framing on this path). The main demo uses the intended path — child answers `2/5`, add-across detected, full recognition beat. This branch only needs to work gracefully.
- **Other-wrong Q1 answer** — authored "hmm, not quite — try again," bounded retries (no misconception mapped).
- **Wrong step tapped / wrong principle / wrong numerator** — distinct authored Oopsy reactions + retry, governed by the hint ladder.
- **Success state** — repair animation + celebration; loop advances.
- **Wrap state** — summary of recorded criteria: misconception detected, mirrored, mistake identified & corrected, immediate transfer result, delayed re-check result (returned / not returned).
- **No-audio state** — identical flow via captions.
- **Persistence (A5 — resolved)** — none: progress and results live in session state; reloading restarts the experience; no accounts, no backend.

### Proof of success (observable, recorded in the demo)
Source: `scope.md > What "Working" Looks Like`.
- [ ] The child's incorrect answer maps to the intended (add-across) misconception.
- [ ] Oopsy reproduces that misconception in a pre-authored wrong solution (`3/7`).
- [ ] The child identifies and corrects Oopsy's mistake (`11/12`).
- [ ] The child answers a fresh same-concept question (immediate transfer).
- [ ] A later, differently-presented question checks whether the misconception returns.

**Engagement is a design goal shown through Oopsy's reactions, voice, and interaction — not a measured outcome.** A correct final answer is evidence of success *in that interaction*, not proof the misconception is permanently overcome; the delayed re-check is **simulated as a later demo stage**, not a real multi-day follow-up (transparent limitation).

## Product Decisions

- **Deterministic answer→misconception mapping; no paid AI APIs / no free-text interpretation** — reliable, verifiable, and fits the token budget (learner).
- **One concept + one misconception, done deeply** — proves the mechanism; breadth lives in the *architecture*, not the build (learner).
- **Pre-authored mirrored mistake, not dynamically generated / not literal wording** — enough to create the "that's my mistake" recognition (learner).
- **Teaching interaction must not feel like a quiz-with-mascot** — one principle choice + tactile rebuild; child actively corrects rather than pressing "reveal" (learner).
- **Identify is separate from correct** — no answer revealed at the identify step (learner).
- **Immediate transfer vs. delayed re-check both kept** — they prove different things (can apply method vs. does misconception resurface) (learner).
- **Character, illustration, expressions, and playful voice are integral and a polish target, built loop-first** — validate the mechanism early, then invest remaining time in the *quality* of this one concept; under pressure reduce asset *count*, never the loop (learner).
- **Timeline (revised):** there are several days to submission, so the curriculum's 2–4h is **not a hard cap on the project**. More time improves the quality/completeness of the single loop — it does **not** expand the feature list (still one concept, one misconception). Work is tiered minimum working → target submission → optional enhancements, with realistic estimates (defined in `4-spec`).
- **Captions, mute/volume, full no-audio path; ages 10–14** (learner).
- **Extensible content structure** so more concepts/misconceptions can be added later (learner).

## What We're Building
The single-scene Workshop running the full 9-step journey above: tile-based answer input; deterministic detection of add-across on Q1; Oopsy's multi-move mirrored mistake; tap-to-identify; one principle choice + fill-in-the-blank equivalent-fraction repair; reaction/repair animation + SFX; immediate transfer; delayed notebook re-check; hint ladder; captions + mute/volume + no-audio path; in-session recording of the five success criteria and a Wrap summary; distinctive, submission-quality art and a consistent voice/SFX set — delivered in tiers (minimum working → target submission → optional enhancements, defined in `4-spec`).

## Deferred From the POC
- **Broad math coverage / multiple misconceptions & topics** — architecture supports adding them; only one is authored now (proves the mechanism).
- **Real spaced, multi-day delayed re-check with persistence** — simulated as a later demo stage; no backend.
- **Large animation/voice libraries & illustration sprawl across many screens** — the PoC is one scene; asset *breadth* is deferred so time funds *depth/polish* of that scene and the loop.
- **Other subjects (science, etc.)** — future extension of the same system.

## Possible Later Enhancements
- A content-authoring format/tool so new concepts and misconceptions can be added without code changes.
- Persistence of misconception-return records across sessions to show real spaced re-checks.
- A wider bank of authentic voice lines and richer Oopsy reactions as budget allows.
- Adaptive difficulty that picks the next problem from the child's error history.

## Non-Goals
- **No AI interpretation of the child's reasoning** — deterministic mapping only (conflicts with the no-paid-API constraint).
- **No claims of measured engagement or long-term learning gains** — not demonstrable in a 2–4h PoC.
- **No accounts, backend, or cross-session persistence** in the PoC.
- **No free-text answers** — all input is tile/choice based for reliable validation.
- **No support for ages 8–9** in this PoC — the "explain the fix" (common-denominator) reasoning is too heavy for the young end.
- **No generic quiz-UI/chatbot layout with a mascot bolted on** — identity is designed in from the start.

## Resolved Decisions (was Open Questions)
- **A2 — resolved:** bounded fill-in-the-blank with selectable number tiles. Tactile enough *because the child actively constructs the corrected solution* rather than picking a final answer. Free-form fraction tiles rejected — complexity without better proof.
- **A3 — resolved:** correct-first-answer branch acknowledges success and lets Oopsy demonstrate its own add-across error; it must not imply the mistake was the child's. Demo uses the intended `2/5` path.
- **A4 — resolved:** numeric-value validation; accept equivalent fractions as correct; enforce nonzero denominators; detection distinguishes correct-equivalents from the authored add-across error.
- **A5 — resolved:** no accounts/backend/persistence; session state only; reload restarts.

## Open Questions
- **Voice approach (investigate in `4-spec`):** simplest practical route to a consistent, expressive character voice with **no paid APIs** — favor a small set of usable pre-recorded/generated voice lines + a few SFX over a complex generation pipeline. Keep captions + mute controls.
- **Quality tiers (define in `4-spec`):** spell out **minimum working version** vs. **target submission quality** vs. **optional enhancements if time remains**, with realistic effort estimates — and guard the core path (detection → mirror → identify → rebuild → transfer → re-check) from polish-driven scope creep.
