// Bounded, selectable number tiles (A2: fill-in-the-blank, not free-form input).
// Placeholder styling for Slice 1; the tactile Workshop look lands in Slice 6.
// Spec ref: spec.md > Number Tile Input. PRD ref: prd.md > Answer input & deterministic detection.

type NumberTilesProps = {
  label: string;
  options: number[];
  value: number | null;
  onSelect: (n: number) => void;
};

export function NumberTiles({ label, options, value, onSelect }: NumberTilesProps) {
  return (
    <div className="tile-group">
      <span className="tile-label">{label}</span>
      <div className="tile-row" role="group" aria-label={label}>
        {options.map((n) => (
          <button
            key={n}
            type="button"
            className={n === value ? 'tile tile--selected' : 'tile'}
            aria-pressed={n === value}
            onClick={() => onSelect(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
