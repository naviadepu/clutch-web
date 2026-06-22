// the cycle model. simple 28-day standard model so every log can be
// auto-stamped with the phase it happened in. this is the layer flo doesn't
// sit your food log next to — clutch does.

export type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";

export const CYCLE_LENGTH = 28;

export type PhaseMeta = {
  id: Phase;
  label: string; // the noun, lowercase ("luteal")
  state: string; // the casual present-tense ("on your period", "ovulating")
  color: string; // the glance color
  soft: string; // a soft tint for surfaces
  dot: string; // ribbon dot color
  blurb: string; // one warm line about this phase
};

// phase color coding straight from the prd, mapped onto the live tokens.
export const PHASES: Record<Phase, PhaseMeta> = {
  menstrual: {
    id: "menstrual",
    label: "menstrual",
    state: "on your period",
    color: "#D6336C", // deep rose
    soft: "#FBD9E4",
    dot: "#D6336C",
    blurb: "rest is productive. be soft with yourself.",
  },
  follicular: {
    id: "follicular",
    label: "follicular",
    state: "in your follicular phase",
    color: "#F19A6E", // peach
    soft: "#FBE4D6",
    dot: "#F19A6E",
    blurb: "energy's climbing. good week to start things.",
  },
  ovulation: {
    id: "ovulation",
    label: "ovulation",
    state: "ovulating",
    color: "#E8A33D", // pink-gold / shimmer
    soft: "#FBE9C9",
    dot: "#E8A33D",
    blurb: "peak shimmer. you feel it, don't you.",
  },
  luteal: {
    id: "luteal",
    label: "luteal",
    state: "in your luteal phase",
    color: "#A77BB0", // lavender / mauve
    soft: "#E7D6EC",
    dot: "#A77BB0",
    blurb: "wind-down week. cravings + feelings are valid.",
  },
};

export const PHASE_ORDER: Phase[] = [
  "menstrual",
  "follicular",
  "ovulation",
  "luteal",
];

/** day-of-cycle (1..28) for a given moment, from the period start date. */
export function cycleDay(cycleStartISO: string, at: number = Date.now()): number {
  const start = new Date(cycleStartISO);
  start.setHours(0, 0, 0, 0);
  const now = new Date(at);
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const mod = ((diffDays % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
  return mod + 1;
}

/** which phase a given day-of-cycle falls in. */
export function phaseForDay(day: number): Phase {
  if (day <= 5) return "menstrual";
  if (day <= 13) return "follicular";
  if (day <= 16) return "ovulation";
  return "luteal";
}

/** the phase right now, used to snapshot onto every log at write time. */
export function currentPhase(cycleStartISO: string, at: number = Date.now()): Phase {
  return phaseForDay(cycleDay(cycleStartISO, at));
}

/** default period start so a brand-new guest lands on "day 14 · ovulating"
 *  — matches the marketing mockup. computed as 13 days ago. */
export function defaultCycleStartISO(now: number = Date.now()): string {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 13);
  return d.toISOString();
}

/** the 28-cell ribbon: where each day sits + its tint. */
export function ribbonCells(cycleStartISO: string, at: number = Date.now()) {
  const today = cycleDay(cycleStartISO, at);
  return Array.from({ length: CYCLE_LENGTH }, (_, i) => {
    const day = i + 1;
    const phase = phaseForDay(day);
    return {
      day,
      phase,
      isToday: day === today,
      isPast: day < today,
      color: PHASES[phase].dot,
    };
  });
}
