 "use client";

import { PHASES } from "../../lib/cycle";
import type { PatternCard as PatternCardData } from "../../lib/patterns";
import { dismissPattern, savePattern } from "../../lib/store";
import { PhaseChip } from "./shared";

/**
 * the connect, made visible — an editorial riso insight card. co-occurrence
 * against phase, "worth noticing," never a diagnosis.
 */
export default function PatternCard({
  card,
  saved,
}: {
  card: PatternCardData;
  saved: boolean;
}) {
  const meta = PHASES[card.phase];

  return (
    <div className="animate-card-pop riso-edge relative overflow-hidden border-2 border-clutch-ink bg-clutch-cream p-4">
      <div aria-hidden className="tex-halftone-ink pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <PhaseChip phase={card.phase} />
          <span className="font-phone-body text-[8px] font-bold uppercase tracking-[0.18em] text-clutch-ink/50">
            ✱ a pattern
          </span>
        </div>

        {/* headline — Space Grotesk, with the one acid highlight */}
        <p className="mt-3 font-grotesk text-[21px] font-bold lowercase leading-[1.05] tracking-tight text-clutch-ink">
          {card.sentence}
        </p>
        <div className="mt-1 h-[3px] w-16 bg-acid" />

        {/* count, in mono */}
        <div className="mt-2.5 flex items-center gap-1.5">
          {Array.from({ length: Math.min(card.count, 10) }).map((_, i) => (
            <span key={i} className="h-2.5 w-2.5" style={{ backgroundColor: meta.color }} />
          ))}
          <span className="ml-1 font-phone-body text-[8px] uppercase tracking-wide text-clutch-ink/55">
            {card.count}× this phase
          </span>
        </div>

        {card.bcNote && (
          <p className="mt-2.5 font-phone-body text-[8px] uppercase leading-relaxed tracking-[0.06em] text-clutch-ink/55">
            noted — you&apos;re on birth control. we&apos;re accounting for it.
          </p>
        )}

        <p className="mt-2 font-phone-body text-[8px] uppercase leading-relaxed tracking-[0.06em] text-clutch-ink/45">
          clutch surfaces patterns — not a diagnosis. anything off, see a doctor.
        </p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => savePattern(card.id)}
            disabled={saved}
            className="riso-edge flex-1 border-2 border-clutch-ink bg-pink px-3 py-2 font-phone-body text-[10px] font-bold uppercase tracking-[0.12em] text-clutch-cream transition-transform active:scale-95 disabled:opacity-60"
          >
            {saved ? "saved ✓" : "save this"}
          </button>
          <button
            onClick={() => dismissPattern(card.id)}
            className="border-2 border-clutch-ink bg-clutch-cream px-3 py-2 font-phone-body text-[10px] font-bold uppercase tracking-[0.12em] text-clutch-ink transition-transform active:scale-95"
          >
            not useful
          </button>
        </div>
      </div>
    </div>
  );
}
