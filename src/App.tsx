// App — the loop controller. Holds in-memory session state and renders the
// Workshop panel for the current step. Transitions are guarded by the state
// machine so the loop can never skip the kernel. Placeholder visuals; the
// distinctive Workshop identity lands in Slice 6.
// Spec ref: spec.md > Loop State Machine (Controller), > Workshop Scene & Layout.
// PRD ref: prd.md > The Core Journey.

import { useEffect, useRef, useState } from 'react';
import { FractionAnswer } from './components/FractionAnswer';
import { Notebook } from './components/Notebook';
import { PrincipleChoice } from './components/PrincipleChoice';
import { RebuildSteps } from './components/RebuildSteps';
import { WrapSummary } from './components/WrapSummary';
import { Oopsy, type Expression } from './components/Oopsy';
import { canTransition, type LoopState } from './loop/machine';
import { bumpAttempt, createSession, hintLevel, type Session } from './loop/session';
import {
  ADD_ACROSS,
  fractionAddition,
  problemsById,
  type Move,
  type PrincipleOption,
} from './content/fractions';
import type { DetectionResult } from './engine/detection';
import { lines, type Line } from './content/lines';
import { playSfx, playVoice, stopAll, whenVoiceIdle, type SfxName } from './audio/sound';
import { AudioControls } from './components/AudioControls';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { eraseOut, panelReveal, popIn, springy } from './motion/presets';

const q1 = problemsById['q1-diagnostic'];
const q3 = problemsById['q3-transfer'];
const q4 = problemsById['q4-recheck'];
const solution = fractionAddition.oopsySolution;

/** Minimum time per repair beat so the visual rhythm reads even when muted. */
const REPAIR_BEAT_MS = 900;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const [session, setSession] = useState<Session>(createSession);
  const [expression, setExpression] = useState<Expression>('idle');
  const [caption, setCaption] = useState<string>(lines.greeting.caption);
  const [foundId, setFoundId] = useState<string | null>(null);
  const [missId, setMissId] = useState<string | null>(null);
  /** Guards against re-entrant taps while a spoken transition is in flight. */
  const busy = useRef(false);
  /** Lets a user-nav button synchronously cancel the repair beat loop. */
  const cancelRepair = useRef<null | (() => void)>(null);

  /**
   * Set the caption and speak the line (+ its SFX). Captions always show.
   * Returns a promise that resolves once Oopsy has finished saying this line
   * (immediately when muted), so the flow can advance in sync with the speech
   * instead of cutting a line off mid-sentence.
   */
  function say(line: Line): Promise<void> {
    setCaption(line.caption);
    if (line.sfx) playSfx(line.sfx as SfxName);
    playVoice(line.voiceKey);
    return whenVoiceIdle();
  }

  /** Guarded step change; optionally patch the session as we move. */
  function go(to: LoopState, patch?: (s: Session) => Session) {
    setSession((s) => {
      if (!canTransition(s.step, to)) return s;
      const next = { ...s, step: to };
      return patch ? patch(next) : next;
    });
  }

  function startDiagnostic() {
    // The first tap also unlocks audio (and may have just started the greeting).
    // Starting the lesson moves on immediately — the diagnostic prompt simply
    // replaces the greeting, so the learner never waits on it. Guarded so a
    // double tap can't fire the transition (or speak the prompt) twice.
    if (session.step !== 'intro') return;
    go('diagnostic');
    setExpression('curious');
    say(lines.q1Prompt);
  }

  async function handleDiagnostic(result: DetectionResult) {
    switch (result.kind) {
      case 'invalid':
        setExpression('confused');
        say(lines.invalid);
        setSession((s) => bumpAttempt(s, 'q1'));
        break;
      case 'other':
        setExpression('curious');
        say(lines.other);
        setSession((s) => bumpAttempt(s, 'q1'));
        break;
      case 'correct':
        // A3 branch: acknowledge success, then Oopsy demonstrates its OWN
        // mistake. Copy must not imply the mistake was the child's.
        if (busy.current) return;
        busy.current = true;
        setExpression('excited');
        await say(lines.correctFirstMirror);
        go('mirror', (s) => ({ ...s, results: { ...s.results, mirrored: true } }));
        busy.current = false;
        break;
      case 'misconception':
        if (busy.current) return;
        busy.current = true;
        setExpression('excited');
        await say(lines.detectedAddAcross);
        go('mirror', (s) => ({
          ...s,
          detectedMisconception: result.misconceptionId,
          results: {
            ...s.results,
            mapped: result.misconceptionId === ADD_ACROSS,
            mirrored: true,
          },
        }));
        busy.current = false;
        break;
    }
  }

  function startInvestigate() {
    go('identify');
    setExpression('embarrassed');
    say(lines.mirrorCheck);
  }

  function handleTap(move: Move) {
    if (move.id === solution.wrongMoveId) {
      setFoundId(move.id);
      setMissId(null);
      setExpression('surprised');
      say(lines.identifyFound);
    } else {
      setMissId(move.id);
      setExpression('curious');
      say(lines.identifyFine);
      setSession((s) => bumpAttempt(s, 'identify'));
    }
  }

  function goToTeach() {
    go('teach-principle');
    setExpression('curious');
    say(lines.teachPrinciplePrompt);
  }

  function handlePrinciple(option: PrincipleOption) {
    if (option.correct) {
      go('teach-rebuild');
      setExpression('excited');
      say(lines.rebuildIntro);
    } else {
      setExpression('confused');
      say(lines.principleWrong);
      setSession((s) => bumpAttempt(s, 'principle'));
    }
  }

  function handleRebuildMiss(index: number) {
    setExpression('confused');
    setSession((s) => bumpAttempt(s, `rebuild-${index}`));
  }

  function handleRebuildComplete() {
    // The child has now identified AND corrected Oopsy's mistake (criterion 3).
    setSession((s) => ({
      ...s,
      results: { ...s.results, identifiedAndCorrected: true },
    }));
    go('repair');
  }

  function continueToTransfer() {
    // Stop the repair beat loop synchronously so a leftover beat can't talk
    // over the transfer prompt.
    cancelRepair.current?.();
    go('transfer');
    setExpression('curious');
    say(lines.transferPrompt);
  }

  async function handleTransfer(result: DetectionResult) {
    switch (result.kind) {
      case 'correct':
        if (busy.current) return;
        busy.current = true;
        setExpression('celebrating');
        await say(lines.transferCorrect);
        go('recheck', (s) => ({ ...s, results: { ...s.results, transferCorrect: true } }));
        busy.current = false;
        break;
      case 'misconception':
        setExpression('confused');
        say(lines.transferTrap);
        setSession((s) => bumpAttempt(s, 'transfer'));
        break;
      default:
        setExpression('curious');
        say(result.kind === 'invalid' ? lines.invalid : lines.other);
        setSession((s) => bumpAttempt(s, 'transfer'));
    }
  }

  async function handleRecheck(result: DetectionResult) {
    switch (result.kind) {
      case 'correct':
        if (busy.current) return;
        busy.current = true;
        setExpression('celebrating');
        await say(lines.recheckCorrect);
        go('wrap', (s) => ({ ...s, results: { ...s.results, recheckDone: true, recheckErrorReturned: false } }));
        busy.current = false;
        break;
      case 'misconception':
        // The add-across error returned on the delayed, differently-presented check.
        if (busy.current) return;
        busy.current = true;
        setExpression('surprised');
        await say(lines.recheckReturned);
        go('wrap', (s) => ({ ...s, results: { ...s.results, recheckDone: true, recheckErrorReturned: true } }));
        busy.current = false;
        break;
      default:
        setExpression('curious');
        say(result.kind === 'invalid' ? lines.invalid : lines.other);
        setSession((s) => bumpAttempt(s, 'recheck'));
    }
  }

  /** Reset to the Workshop home (used by "Play again" and the Exit button). */
  function goHome() {
    stopAll();
    busy.current = false;
    setSession(createSession());
    setFoundId(null);
    setMissId(null);
    setExpression('idle');
    say(lines.greeting);
  }

  // Oopsy's reaction sequence during the repair beat: confused -> surprised ->
  // excited. Each line plays to completion before the next beat starts, and the
  // expression flips in sync with the speech; a minimum beat keeps the visual
  // rhythm even when muted (whenVoiceIdle resolves instantly with no audio).
  useEffect(() => {
    if (session.step !== 'repair') return;
    let cancelled = false;
    cancelRepair.current = () => {
      cancelled = true;
    };
    playSfx('erase');
    const beats: [Expression, Line][] = [
      ['confused', lines.repair1],
      ['surprised', lines.repair2],
      ['excited', lines.repair3],
    ];
    void (async () => {
      for (const [expr, line] of beats) {
        if (cancelled) return;
        setExpression(expr);
        await Promise.all([say(line), delay(REPAIR_BEAT_MS)]);
      }
    })();
    return () => {
      cancelled = true;
      cancelRepair.current = null;
    };
  }, [session.step]);

  // Browsers block audio until the first user gesture, so the greeting can't
  // truly autoplay on load. Speak it on the first interaction instead: Oopsy
  // still welcomes the learner, just gated on the tap the browser requires.
  useEffect(() => {
    let greeted = false;
    const greet = () => {
      if (greeted) return;
      greeted = true;
      playVoice(lines.greeting.voiceKey);
      window.removeEventListener('pointerdown', greet);
      window.removeEventListener('keydown', greet);
    };
    window.addEventListener('pointerdown', greet);
    window.addEventListener('keydown', greet);
    return () => {
      window.removeEventListener('pointerdown', greet);
      window.removeEventListener('keydown', greet);
    };
  }, []);

  function renderPanel() {
    switch (session.step) {
      case 'intro':
        return (
          <div className="panel">
            <p className="panel__lead">{lines.greeting.caption}</p>
            <button type="button" className="primary-btn" onClick={startDiagnostic}>
              Start
            </button>
          </div>
        );
      case 'diagnostic':
        return (
          <div className="panel">
            <FractionAnswer problem={q1} onClassified={handleDiagnostic} />
          </div>
        );
      case 'mirror':
        return (
          <div className="panel">
            <p className="panel__oopsy-line">Oopsy: “{solution.introLine}”</p>
            <Notebook
              prompt={solution.prompt}
              moves={solution.moves}
              interactive={false}
              foundId={null}
              missId={null}
              onTap={() => {}}
            />
            <button type="button" className="primary-btn" onClick={startInvestigate}>
              Check my work!
            </button>
          </div>
        );
      case 'identify':
        return (
          <div className="panel">
            <Notebook
              prompt={solution.prompt}
              moves={solution.moves}
              interactive
              foundId={foundId}
              missId={missId}
              onTap={handleTap}
            />
            {foundId && (
              <button type="button" className="primary-btn" onClick={goToTeach}>
                Teach Oopsy →
              </button>
            )}
          </div>
        );
      case 'teach-principle':
        return (
          <div className="panel">
            <PrincipleChoice
              prompt={solution.principlePrompt}
              options={solution.principleOptions}
              level={hintLevel(session.attempts['principle'] ?? 0)}
              hint={solution.principleHint}
              model={solution.principleModel}
              onChoose={handlePrinciple}
            />
          </div>
        );
      case 'teach-rebuild':
        return (
          <div className="panel">
            <RebuildSteps
              steps={solution.rebuildSteps}
              attempts={session.attempts}
              onMiss={handleRebuildMiss}
              onComplete={handleRebuildComplete}
            />
          </div>
        );
      case 'repair':
        return (
          <div className="panel">
            <div className="repair">
              <motion.span
                className="repair__wrong"
                initial={eraseOut.initial}
                animate={eraseOut.animate}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {solution.wrong.n}/{solution.wrong.d}
              </motion.span>
              <motion.span
                className="repair__arrow"
                aria-hidden="true"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springy, delay: 0.5 }}
              >
                →
              </motion.span>
              <motion.span
                className="repair__fixed"
                initial={popIn.initial}
                animate={popIn.animate}
                transition={{ ...springy, delay: 0.8 }}
              >
                {solution.repaired.n}/{solution.repaired.d}
              </motion.span>
            </div>
            <button type="button" className="primary-btn" onClick={continueToTransfer}>
              Continue
            </button>
          </div>
        );
      case 'transfer':
        return (
          <div className="panel">
            <p className="panel__lead">Immediate transfer — apply the method you taught Oopsy.</p>
            <FractionAnswer problem={q3} onClassified={handleTransfer} />
          </div>
        );
      case 'recheck':
        return (
          <div className="panel">
            <p className="panel__later">{lines.recheckLater.caption} (simulated time gap)</p>
            <FractionAnswer problem={q4} onClassified={handleRecheck} />
          </div>
        );
      case 'wrap':
        return (
          <div className="panel">
            <WrapSummary results={session.results} onRestart={goHome} />
          </div>
        );
      default:
        return (
          <div className="panel">
            <p className="panel__note">Coming in a later slice: {session.step}</p>
          </div>
        );
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="scene">
        <h1 className="scene__title">Oopsy's Workshop</h1>
        <AudioControls />
        {session.step !== 'intro' && (
          <button type="button" className="exit-btn" onClick={goHome}>
            <span aria-hidden="true">{'\u2715'}</span> Exit
          </button>
        )}
        <div className="stage">
          <Oopsy expression={expression} />
          <section className="stage__panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={session.step}
                initial={panelReveal.initial}
                animate={panelReveal.animate}
                exit={panelReveal.exit}
                transition={springy}
              >
                {renderPanel()}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
        <p className="caption" role="status" aria-live="polite">
          {caption}
        </p>
        <ProgressStrip session={session} />
      </main>
    </MotionConfig>
  );
}

/** Compact readout of the five success criteria; becomes the Wrap summary in Slice 4. */
function ProgressStrip({ session }: { session: Session }) {
  const { results } = session;
  const items: [string, boolean][] = [
    ['mapped', results.mapped],
    ['mirrored', results.mirrored],
    ['identified & corrected', results.identifiedAndCorrected],
    ['transfer', results.transferCorrect],
    ['re-check', results.recheckDone],
  ];
  return (
    <ul className="progress" aria-label="Recorded success criteria">
      {items.map(([label, done]) => (
        <li key={label} className={done ? 'progress__item progress__item--done' : 'progress__item'}>
          {done ? '\u2713' : '\u25cb'} {label}
        </li>
      ))}
    </ul>
  );
}
