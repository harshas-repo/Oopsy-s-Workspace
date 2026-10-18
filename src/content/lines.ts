// Voice-line keys, captions, and optional SFX per beat.
// Every spoken line has a caption; audio is never required (full no-audio path).
// voiceKey maps to a file in public/audio/voice (generated later, Slice 8/9).
// Spec ref: spec.md > Audio & Captions. PRD ref: prd.md > Character voice, audio & captions.

export type Line = { voiceKey: string; caption: string; sfx?: string };

/** Starter set covering the diagnostic beat; expanded as later slices land. */
export const lines = {
  greeting: {
    voiceKey: 'greeting',
    caption: "Hi! I'm Oopsy. Let's play with fractions in my workshop!",
  },
  q1Prompt: {
    voiceKey: 'q1-prompt',
    caption: 'What is 1/2 + 1/3? Build your answer with the number tiles.',
  },
  correct: {
    voiceKey: 'correct',
    caption: 'Yes! That\u2019s exactly right.',
    sfx: 'celebrate',
  },
  detectedAddAcross: {
    voiceKey: 'detected-add-across',
    caption: 'Ooh \u2014 you added the tops and the bottoms. I do that too! Watch\u2026',
    sfx: 'discover',
  },
  other: {
    voiceKey: 'other',
    caption: 'Hmm, not quite \u2014 give it another try.',
  },
  invalid: {
    voiceKey: 'invalid',
    caption: 'The bottom of a fraction can\u2019t be zero. Pick another number!',
  },
  pickBoth: {
    voiceKey: 'pick-both',
    caption: 'Choose a top number and a bottom number first.',
  },
  // Correct-first-answer branch (A3): acknowledge success, then Oopsy shows its
  // OWN mistake. Must NOT imply the mistake was the child's (no "just like you").
  correctFirstMirror: {
    voiceKey: 'correct-first-mirror',
    caption: 'Nice, you got that one! Here\u2019s a different problem I tried \u2014 can you check my work?',
  },
  mirrorCheck: {
    voiceKey: 'mirror-check',
    caption: 'Wait\u2026 did I get that right? Check my work!',
  },
  identifyFound: {
    voiceKey: 'identify-found',
    caption: 'Ooh\u2026 something went wrong there. What should I do instead?',
    sfx: 'discover',
  },
  identifyFine: {
    voiceKey: 'identify-fine',
    caption: 'That step\u2019s fine \u2014 look again for the step that broke the rules.',
  },
  teachComingSoon: {
    voiceKey: 'teach-coming-soon',
    caption: 'You found my mistake! Teaching me the fix comes next.',
  },
  teachPrinciplePrompt: {
    voiceKey: 'teach-principle-prompt',
    caption: 'You\u2019re the teacher now \u2014 what should I do first?',
  },
  principleWrong: {
    voiceKey: 'principle-wrong',
    caption: 'Hmm, that wouldn\u2019t fix it. Think about the bottoms.',
  },
  rebuildIntro: {
    voiceKey: 'rebuild-intro',
    caption: 'Yes! Let\u2019s rebuild it \u2014 fill in each blank.',
  },
  repair1: {
    voiceKey: 'repair-1',
    caption: 'Wait\u2026 I can\u2019t add those bottoms like that\u2026',
  },
  repair2: {
    voiceKey: 'repair-2',
    caption: 'OHHH! I need the same denominators first!',
    sfx: 'discover',
  },
  repair3: {
    voiceKey: 'repair-3',
    caption: 'You\u2019re the math expert! 3/7 becomes 11/12!',
    sfx: 'celebrate',
  },
  transferPrompt: {
    voiceKey: 'transfer-prompt',
    caption: 'Your turn! Use what you just taught me on a fresh problem.',
  },
  transferCorrect: {
    voiceKey: 'transfer-correct',
    caption: 'Yes! Same denominators first \u2014 you\u2019ve got the method.',
    sfx: 'celebrate',
  },
  transferTrap: {
    voiceKey: 'transfer-trap',
    caption: 'That\u2019s the add-across trap again. Do what you taught me: make the bottoms match first.',
  },
  recheckLater: {
    voiceKey: 'recheck-later',
    caption: 'A few days later, a new problem appears in the Workshop notebook\u2026',
  },
  recheckCorrect: {
    voiceKey: 'recheck-correct',
    caption: 'You got it \u2014 same denominators first. The fix is sticking!',
    sfx: 'celebrate',
  },
  recheckReturned: {
    voiceKey: 'recheck-returned',
    caption: 'Ah, the add-across slipped back in here. That\u2019s exactly what this later check is for \u2014 good to notice it.',
  },
  wrapTitle: {
    voiceKey: 'wrap-title',
    caption: 'Loop complete! Here\u2019s what happened.',
  },
} satisfies Record<string, Line>;

export type LineKey = keyof typeof lines;
