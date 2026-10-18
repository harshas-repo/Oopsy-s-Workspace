"""Generate Oopsy's full voice bank with Piper — offline, at asset-creation time.

Piper is a dev/asset-time dependency, never a runtime one: the app ships the
pre-generated audio files, so there is no paid API and no network at runtime.
Voice gate (Slice 8) passed with the female voice `en_US-amy-medium`; only that
voice is generated and shipped.

Usage (from repo root, using the project venv):
    .venv/Scripts/python tools/gen_voice.py
    .venv/Scripts/python tools/gen_voice.py --voice en_US-amy-medium

Models are downloaded once into tools/piper-models via:
    .venv/Scripts/python -m piper.download_voices <voice> --data-dir tools/piper-models

Outputs land in public/audio/voice/<voice>/<voiceKey>.wav, where <voiceKey>
matches src/content/lines.ts exactly (a content test enforces this).
Spec ref: spec.md > External Services and Dependencies (Piper), > Audio & Captions.
"""

import argparse
import wave
from pathlib import Path

from piper import PiperVoice

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / "tools" / "piper-models"
DEFAULT_VOICE = "en_US-amy-medium"

# The full bank, keyed exactly like src/content/lines.ts voiceKey values.
# Text is written the way it should be *spoken*: numerals as words, plain
# punctuation (no curly quotes/dashes) so espeak phonemizes cleanly.
FULL_BANK = {
    "greeting": "Hi! I'm Oopsy. Let's play with fractions in my workshop!",
    "q1-prompt": "What is one half plus one third? Build your answer with the number tiles.",
    "correct": "Yes! That's exactly right.",
    "detected-add-across": "Ooh, you added the tops and the bottoms. I do that too! Watch...",
    "other": "Hmm, not quite. Give it another try.",
    "invalid": "The bottom of a fraction can't be zero. Pick another number!",
    "pick-both": "Choose a top number and a bottom number first.",
    "correct-first-mirror": "Nice, you got that one! Here's a different problem I tried. Can you check my work?",
    "mirror-check": "Wait... did I get that right? Check my work!",
    "identify-found": "Ooh... something went wrong there. What should I do instead?",
    "identify-fine": "That step's fine. Look again for the step that broke the rules.",
    "teach-coming-soon": "You found my mistake! Teaching me the fix comes next.",
    "teach-principle-prompt": "You're the teacher now. What should I do first?",
    "principle-wrong": "Hmm, that wouldn't fix it. Think about the bottoms.",
    "rebuild-intro": "Yes! Let's rebuild it. Fill in each blank.",
    "repair-1": "Wait... I can't add those bottoms like that...",
    "repair-2": "Oh! I need the same denominators first!",
    "repair-3": "You're the math expert! Three sevenths becomes eleven twelfths!",
    "transfer-prompt": "Your turn! Use what you just taught me on a fresh problem.",
    "transfer-correct": "Yes! Same denominators first. You've got the method.",
    "transfer-trap": "That's the add-across trap again. Do what you taught me: make the bottoms match first.",
    "recheck-later": "A few days later, a new problem appears in the Workshop notebook...",
    "recheck-correct": "You got it. Same denominators first. The fix is sticking!",
    "recheck-returned": "Ah, the add-across slipped back in here. That's exactly what this later check is for. Good to notice it.",
    "wrap-title": "Loop complete! Here's what happened.",
}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--voice", default=DEFAULT_VOICE, help="Piper voice name")
    ap.add_argument("--out", default="public/audio/voice", help="Output dir (relative to repo root)")
    args = ap.parse_args()

    model = MODELS / f"{args.voice}.onnx"
    if not model.exists():
        raise SystemExit(
            f"Missing model {model}. Download it first with:\n"
            f"  .venv/Scripts/python -m piper.download_voices {args.voice} --data-dir tools/piper-models"
        )

    voice = PiperVoice.load(model)
    outdir = ROOT / args.out / args.voice
    outdir.mkdir(parents=True, exist_ok=True)

    for key, text in FULL_BANK.items():
        wav = outdir / f"{key}.wav"
        with wave.open(str(wav), "wb") as fh:
            voice.synthesize_wav(text, fh)
        print("wrote", wav.relative_to(ROOT))


if __name__ == "__main__":
    main()
