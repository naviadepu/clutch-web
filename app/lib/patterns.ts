// the connect. the reason clutch isn't flo.
//
// ep4 ships the *baby version*: ONE rule-based card, no ML. every food log
// already carries a phase snapshot — so this is just counting against phase.
// co-occurrence, NOT diagnosis. we surface "worth noticing," we never say
// "you have X." (read the safety stance in the prd twice.)

import { PHASES, type Phase } from "./cycle";
import type { ClutchState } from "./store";

export type PatternCard = {
  id: string; // stable: `${phase}:${item}` so save/dismiss persists
  phase: Phase;
  item: string;
  count: number;
  sentence: string; // one plain-language line
  bcNote: boolean; // account-for-birth-control footnote
};

// reachable-in-the-demo threshold. tap dal a few times → the card appears.
const MIN_COUNT = 3;

function norm(s: string) {
  return s.trim().toLowerCase();
}

/**
 * find the single strongest "this phase you logged X most" signal.
 * groups food logs by (phase, item), takes the heaviest bucket, and only
 * surfaces it once it clears the threshold and hasn't been dismissed.
 */
export function computePattern(state: ClutchState): PatternCard | null {
  const counts = new Map<string, { phase: Phase; item: string; n: number }>();

  for (const log of state.logs) {
    if (log.kind !== "food") continue;
    const item = norm(log.item);
    if (!item) continue;
    const key = `${log.phase}:${item}`;
    const cur = counts.get(key);
    if (cur) cur.n += 1;
    else counts.set(key, { phase: log.phase, item, n: 1 });
  }

  let best: { phase: Phase; item: string; n: number } | null = null;
  for (const v of counts.values()) {
    if (v.n < MIN_COUNT) continue;
    if (!best || v.n > best.n) best = v;
  }
  if (!best) return null;

  const id = `${best.phase}:${best.item}`;
  if (state.dismissedPatternIds.includes(id)) return null;

  const bcNote = state.meds.some((m) => m.isBirthControl);

  return {
    id,
    phase: best.phase,
    item: best.item,
    count: best.n,
    sentence: `you logged ${best.item} ${best.n}× this phase.`,
    bcNote,
  };
}

export function phaseLabel(phase: Phase) {
  return PHASES[phase].label;
}
