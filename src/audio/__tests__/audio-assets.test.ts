// Ties the authored line map to the generated audio assets: every voiceKey in
// lines.ts must have a pre-generated Piper file, and every referenced SFX name
// must exist. Catches drift between content and the voice bank (Slice 9).
// Spec ref: spec.md > Audio & Captions.

import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { lines, type Line } from '../../content/lines';

const ROOT = process.cwd();
const VOICE_DIR = join(ROOT, 'public', 'audio', 'voice', 'en_US-amy-medium');
const SFX_DIR = join(ROOT, 'public', 'audio', 'sfx');
const SFX_NAMES = ['write', 'erase', 'discover', 'celebrate'];

describe('audio assets', () => {
  it('has a generated voice file for every line voiceKey', () => {
    for (const line of Object.values(lines)) {
      expect(existsSync(join(VOICE_DIR, `${line.voiceKey}.wav`)), `missing voice: ${line.voiceKey}`).toBe(true);
    }
  });

  it('has every SFX file', () => {
    for (const name of SFX_NAMES) {
      expect(existsSync(join(SFX_DIR, `${name}.wav`)), `missing sfx: ${name}`).toBe(true);
    }
  });

  it('only references SFX names that exist', () => {
    for (const line of Object.values(lines) as Line[]) {
      if (line.sfx) expect(SFX_NAMES, `unknown sfx: ${line.sfx}`).toContain(line.sfx);
    }
  });
});
