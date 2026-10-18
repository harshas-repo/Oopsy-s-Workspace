// Sound manager over native HTMLAudioElement: the pre-generated voice bank +
// original SFX, with mute + volume. Captions always mirror every spoken line,
// and nothing essential depends on audio (full no-audio path).
//
// Only ONE voice line plays at a time: speaking a new line replaces whatever
// Oopsy was saying, so lines never stack up or repeat on top of each other.
// `whenVoiceIdle()` lets an auto-transition wait for the current line to finish
// so the flow stays in sync with the speech; it resolves immediately when muted,
// idle, or replaced, so the flow is never blocked and the no-audio path works.
// Browsers block audio until a user gesture, so lines still only *sound* in
// response to interaction.
// Spec ref: spec.md > Audio & Captions.

export type SfxName = 'write' | 'erase' | 'discover' | 'celebrate';

const VOICE_DIR = '/audio/voice/en_US-amy-medium';
const SFX_DIR = '/audio/sfx';
const SFX_GAIN = 0.6;
// Safety net: a missing/failed clip must never wedge the flow gate.
const VOICE_TIMEOUT_MS = 8000;

type AudioState = { muted: boolean; volume: number };
const state: AudioState = { muted: false, volume: 0.8 };

let current: HTMLAudioElement | null = null;
let currentTimer: ReturnType<typeof setTimeout> | null = null;
let playing = false;
let idleWaiters: (() => void)[] = [];

export function getAudioState(): AudioState {
  return { ...state };
}

export function setMuted(muted: boolean): void {
  state.muted = muted;
  if (muted) stopAll();
}

export function setVolume(volume: number): void {
  state.volume = Math.min(1, Math.max(0, volume));
  if (current) current.volume = state.volume;
}

function resolveWaiters(): void {
  const waiters = idleWaiters;
  idleWaiters = [];
  for (const w of waiters) w();
}

/** Stop the current line (if any) and release anything waiting on it. */
function stopCurrent(): void {
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }
  if (current) {
    current.onended = null;
    current.onerror = null;
    current.pause();
    current = null;
  }
  playing = false;
  resolveWaiters();
}

/**
 * Speak a line, replacing whatever Oopsy is currently saying. Only one line
 * ever plays, so a new line never stacks on or repeats the previous one (e.g.
 * tapping Check several times). No-op when muted.
 */
export function playVoice(key: string): void {
  if (state.muted) return;
  stopCurrent();

  const audio = new Audio(`${VOICE_DIR}/${key}.wav`);
  audio.volume = state.volume;
  current = audio;
  playing = true;

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    if (currentTimer) {
      clearTimeout(currentTimer);
      currentTimer = null;
    }
    audio.onended = null;
    audio.onerror = null;
    if (current === audio) current = null;
    playing = false;
    resolveWaiters();
  };
  currentTimer = setTimeout(finish, VOICE_TIMEOUT_MS);
  audio.onended = finish;
  audio.onerror = finish;
  void audio.play().catch(finish);
}

/**
 * Resolves once the current line has finished (or been replaced). Immediate
 * when muted or idle, so an auto-transition can wait for Oopsy to finish
 * speaking without ever blocking the no-audio path.
 */
export function whenVoiceIdle(): Promise<void> {
  if (state.muted || !playing) return Promise.resolve();
  return new Promise<void>((resolve) => idleWaiters.push(resolve));
}

/** True while Oopsy is mid-sentence. */
export function isSpeaking(): boolean {
  return playing;
}

/** Play a short SFX cue (no-op when muted). SFX never gate the flow. */
export function playSfx(name: SfxName): void {
  if (state.muted) return;
  const sfx = new Audio(`${SFX_DIR}/${name}.wav`);
  sfx.volume = state.volume * SFX_GAIN;
  void sfx.play().catch(() => undefined);
}

/** Stop all speech (used on exit/restart). Resolves any waiters. */
export function stopAll(): void {
  stopCurrent();
}
