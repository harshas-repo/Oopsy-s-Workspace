"""Synthesize Oopsy's four sound effects as original assets (no licensing needed).

Rather than sourcing CC0 clips (which would each need a license check), we author
tiny procedural SFX here: short, soft, playful cues tied to loop actions.
    write     -> pencil-scratch noise burst (child commits an answer/step)
    erase     -> falling noise swoosh (the wrong solution is erased)
    discover  -> rising two-note blip (the mistake / insight is found)
    celebrate -> bright three-note arpeggio (a success beat)

Usage (any python3, no deps):
    python tools/gen_sfx.py

Outputs land in public/audio/sfx/<name>.wav (22.05 kHz mono 16-bit).
Spec ref: spec.md > Audio & Captions (SFX), > External Services and Dependencies.
"""

import math
import random
import wave
from array import array
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "sfx"
RATE = 22050


def _write(name: str, samples: list[float]) -> None:
    peak = max(1e-9, max(abs(s) for s in samples))
    pcm = array("h", (int(max(-1, min(1, s / peak)) * 0.7 * 32767) for s in samples))
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as fh:
        fh.setnchannels(1)
        fh.setsampwidth(2)
        fh.setframerate(RATE)
        fh.writeframes(pcm.tobytes())
    print("wrote", (OUT / f"{name}.wav").relative_to(ROOT))


def _env(i: int, n: int, attack: float = 0.05) -> float:
    """Simple attack/decay envelope in [0,1]."""
    t = i / n
    if t < attack:
        return t / attack
    return max(0.0, 1.0 - (t - attack) / (1.0 - attack))


def _tone(freq: float, dur: float, vib: float = 0.0) -> list[float]:
    n = int(RATE * dur)
    out = []
    for i in range(n):
        f = freq * (1.0 + vib * math.sin(2 * math.pi * 6 * i / RATE))
        out.append(math.sin(2 * math.pi * f * i / RATE) * _env(i, n))
    return out


def _noise(dur: float, tilt: float) -> list[float]:
    """Noise burst; tilt>0 brightens, tilt<0 darkens via a one-pole filter."""
    n = int(RATE * dur)
    rng = random.Random(7)
    out = []
    prev = 0.0
    for i in range(n):
        white = rng.uniform(-1, 1)
        prev = prev + tilt * (white - prev)
        out.append(prev * _env(i, n, attack=0.15))
    return out


def _seq(parts: list[list[float]], gap: int = 0) -> list[float]:
    out: list[float] = []
    for p in parts:
        out.extend(p)
        out.extend([0.0] * gap)
    return out


def main() -> None:
    _write("write", _noise(0.16, 0.5))
    _write("erase", _noise(0.32, -0.6))
    _write("discover", _seq([_tone(660, 0.12), _tone(880, 0.16)], gap=int(RATE * 0.03)))
    _write(
        "celebrate",
        _seq([_tone(523, 0.12), _tone(659, 0.12), _tone(784, 0.22)], gap=int(RATE * 0.02)),
    )


if __name__ == "__main__":
    main()
