// Audio controls — mute toggle + volume slider for the voice bank and SFX.
// Captions remain on screen regardless, so muting never hides information.
// Spec ref: spec.md > Audio & Captions (mute + volume controls).

import { useState } from 'react';
import { getAudioState, setMuted, setVolume } from '../audio/sound';

export function AudioControls() {
  const [muted, setMutedState] = useState(getAudioState().muted);
  const [volume, setVolumeState] = useState(getAudioState().volume);

  return (
    <div className="audio-controls" role="group" aria-label="Audio controls">
      <button
        type="button"
        className="audio-controls__mute"
        aria-pressed={muted}
        onClick={() => {
          const next = !muted;
          setMutedState(next);
          setMuted(next);
        }}
      >
        {muted ? 'Sound off' : 'Sound on'}
      </button>
      <label className="audio-controls__vol">
        Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          disabled={muted}
          onChange={(e) => {
            const next = Number(e.target.value);
            setVolumeState(next);
            setVolume(next);
          }}
        />
      </label>
    </div>
  );
}
