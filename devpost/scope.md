---
doc: scope
status: approved
---

# Oopsy

A character-driven math learning app where a friendly creature, Oopsy, makes the *same mistake the child just made* — and the child becomes the teacher who catches and fixes it.

## The Unique Kernel
Instead of marking an answer wrong and showing the correct one, Oopsy mirrors the child's own misconception in a confident, pre-authored wrong solution. The child recognizes "wait, that's *my* mistake," steps into the teacher role to find, explain, and correct it — and a later, differently-presented re-check reveals whether the misconception actually returns. The recognition-and-teaching moment is the distinctive beat; the immediate-vs-delayed check distinction is what makes the idea credible.

## Who It's For
Children aged **10–14** practicing school mathematics (narrowed from 8–14 so the "explain the fix" step stays feasible). For the PoC, the child works through a single fraction-addition problem and its follow-ups. Today they'd get a score and a correct answer from a quiz app; here they get a character to teach.

## The Core Loop
1. **Student's mistake** — child answers `1/2 + 1/3` and gives `2/5`; the deterministic engine maps that response to the **add-across misconception** (add numerators, add denominators).
2. **Mirrored mistake** — Oopsy confidently solves a *different* problem, `2/3 + 1/4`, using the same wrong rule to get `3/7`.
3. **Teaching moment** — child locates the wrong step, corrects it, and explains the right approach; Oopsy reacts (confusion → surprise → excitement).
4. **Immediate transfer** — child solves a fresh unlike-denominator problem (not a repeat), showing they can apply the corrected method.
5. **Delayed re-check** — later in the experience (e.g., Oopsy's Workshop notebook), a differently-presented question tests the same misconception *without* reminding the child; the system records whether the error returns.

The immediate question and the delayed check prove different things (can apply the method vs. does the misconception resurface) — both are kept.

## Inspiration & Identity
**"Oopsy's Workshop"** — a colorful, playful illustrated world where Oopsy investigates and fixes mistakes; a modern animated adventure that happens to teach math, not a preschool app and not a generic AI quiz/chatbot UI. Warm backgrounds with bold accents (turquoise, sunny yellow, coral, orange, violet), hand-drawn detail, organic shapes, tactile buttons, distinctive readable typography. Deliberately designed from the start, not a mascot bolted onto a dashboard. Audio is a core part of character: an expressive, friendly, slightly goofy voice with captions, mute/volume controls, and every interaction completable without audio. (Concrete references, palette, and voice direction are developed in `3-prd`/`4-spec`.)

## Why This Matters to the Learner
"I want to learn how to turn an interesting idea into a focused product that can actually prove its core hypothesis" — validating the core interaction, deciding what genuinely belongs in the PoC, and avoiding features that merely sound good. The discipline of subtraction is the point, as much as the app.

## What "Working" Looks Like
A working web PoC that runs the full loop end-to-end with real (deterministic) educational logic and a distinctive, polished identity — and a ~1-minute demo showing: the `2/5` mistake → Oopsy's mirrored `3/7` error → the child catching and correcting it (Oopsy reacts) → a correct fresh problem → the delayed notebook re-check. **Observable success criteria**, recorded in the demo:
- the incorrect answer maps to the intended misconception;
- Oopsy reproduces that misconception in a pre-authored wrong solution;
- the child identifies and corrects Oopsy's mistake;
- the child answers a fresh same-concept question;
- a later, differently-presented question checks whether the misconception returns.

The "oh, that's cool" beat: the child's face when they realize Oopsy made *their* mistake and they get to be the teacher. Engagement is a **design goal shown through character reactions, voice, and interaction — not a measured outcome.** A correct final answer is evidence of success *in that interaction*, not proof the misconception is permanently overcome. The delayed re-check is **simulated as a later demo stage**, not a real multi-day follow-up, and we are transparent about that limitation.

## The POC Boundary
**In:**
- One concept (fraction addition, **unlike denominators**) and one misconception (**add-across**).
- The complete 5-step loop, with deterministic answer→misconception mapping and reliable answer validation.
- Extensible **content architecture** (a structured library so more topics/misconceptions can be added later) — architecture broad, actual content narrow.
- **Distinctive, polished identity — built loop-first, tiered:** one cohesive illustrated Workshop scene; one recognizable original Oopsy with 4–6 expressive states; purposeful animations tied to the interaction; a consistent playful voice + SFX; captions and mute/volume controls; a distinctive, non-generic interface. Floor = minimum working; target = submission quality; stretch = optional enhancements (tiers defined in `4-spec`).
- Build order: **end-to-end loop on placeholder art/audio → validate → character → visual design → audio → test & refine.** Several days are available, so after the loop is proven, remaining time raises the *quality* of this one concept; under pressure reduce asset *count*, never the loop.
- Simple technical implementation; **no paid AI APIs.** Content is original/rule-based/templates.

**Success is the mechanism demonstrably working**, not engagement metrics or long-term learning outcomes.

**Timeline (revised):** several days to submission — the curriculum's 2–4h figure is *not* a hard cap on the project. Build and validate the loop first, then use remaining time to polish this one concept to submission quality; extra time deepens quality, it does **not** expand the feature list (still one concept, one misconception).

## Later
- Broad school-math coverage (many topics, many misconceptions, many question variations).
- Extending the same system to science and other subjects.
- Real spaced/multi-day delayed re-checks with persistence of misconception-return records.
- Larger animation and voice libraries; richer adaptive interpretation of student reasoning.
- Evaluating public datasets / GitHub content — **only after checking licenses and underlying source-question rights** (a downloadable dataset is not automatically free to reuse).

## Explicitly Cut
- **Free-form / AI interpretation of the child's reasoning** — needs an LLM; conflicts with the deterministic, no-paid-API constraint. Misconception is inferred from a constrained answer instead.
- **Claiming measured "engagement" or long-term learning gains** — not demonstrable in a 2–4h PoC; kept as a qualitative design goal only.
- **Ages 8–9** for the PoC — the "explain the fix" step (common-denominator reasoning) is too heavy for the young end.
- **Illustration sprawl across many screens & large animation/voice libraries** — the PoC is one scene; asset *breadth* stays out so time funds *depth/polish* of that scene. (Revised: visual/audio **quality** is now a target, not cut to a bare minimum, since several days are available.)
- **Real multi-day delayed follow-up + backend persistence** — simulated as a later demo stage; no infrastructure needed to prove the idea.
- **Multiple topics in the PoC** — one concept done deeply proves the mechanism; breadth lives in the architecture, not the build.
