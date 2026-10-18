// Wrap summary — surfaces the five observable success criteria recorded in
// session state, plus the honest limitation (a correct answer shows the
// mechanism worked this session; the re-check is simulated, not multi-day).
// Spec ref: spec.md > Session State & Progress Recorder.
// PRD ref: prd.md > Progress / proof recording, > States and Boundaries (Wrap).

import type { Results } from '../loop/session';

type WrapSummaryProps = {
  results: Results;
  onRestart: () => void;
};

export function WrapSummary({ results, onRestart }: WrapSummaryProps) {
  const rows: { label: string; done: boolean }[] = [
    { label: 'Your incorrect answer mapped to the add-across misconception', done: results.mapped },
    { label: "Oopsy reproduced that mistake (2/3 + 1/4 = 3/7)", done: results.mirrored },
    { label: "You identified and corrected Oopsy's mistake (11/12)", done: results.identifiedAndCorrected },
    { label: 'You solved a fresh same-concept problem (immediate transfer)', done: results.transferCorrect },
    {
      label: results.recheckErrorReturned
        ? 'Delayed re-check (simulated): the add-across error returned'
        : 'Delayed re-check (simulated): the add-across error did NOT return',
      // Criterion 5 is about observing the re-check, so it counts as recorded
      // either way once the loop reaches the wrap — the same flag the
      // ProgressStrip reads, so the two readouts can never disagree.
      done: results.recheckDone,
    },
  ];

  return (
    <div className="wrap">
      <h2 className="wrap__title">Loop complete!</h2>
      <ul className="wrap__list">
        {rows.map((row) => (
          <li key={row.label} className={row.done ? 'wrap__item wrap__item--done' : 'wrap__item'}>
            <span className="wrap__mark" aria-hidden="true">
              {row.done ? '\u2713' : '\u25cb'}
            </span>
            {row.label}
          </li>
        ))}
      </ul>
      <p className="wrap__note">
        A correct answer shows the mechanism worked in this session — it isn't proof the
        misconception is permanently overcome. The re-check is a simulated later stage, not a
        real multi-day follow-up.
      </p>
      <button type="button" className="primary-btn" onClick={onRestart}>
        Play again
      </button>
    </div>
  );
}
