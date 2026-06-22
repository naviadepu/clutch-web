"use client";

import { PHASES } from "../../lib/cycle";
import type { PatternCard as PatternCardData } from "../../lib/patterns";
import { dismissPattern, savePattern } from "../../lib/store";
import { FourPointStar } from "../phone/decorations";
import { PhaseChip } from "./shared";

/**
 * the connect, made visible. co-occurrence against phase — "worth noticing,"
 * never a diagnosis. save this / not useful trains what to keep showing.
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
    <div
      className="animate-card-pop relative overflow-hidden rounded-2xl border-2 p-4"
      style={{ borderColor: meta.color, backgroundColor: meta.soft }}
    >
      <FourPointStar
        size={18}
        color={meta.color}
        className="sparkle-spin absolute right-3 top-3"
      />

      <div className="flex items-center gap-2">
        <PhaseChip phase={card.phase} />
        <span className="font-phone-body text-[8px] uppercase tracking-[0.16em] text-clutch-chocolate/55">
          a pattern worth noticing
        </span>
      </div>

      <p
        className="mt-2.5 font-pinyon text-clutch-hot"
        style={{ fontSize: 26, lineHeight: 0.95, color: meta.color }}
      >
        {card.sentence}
      </p>

      {/* tiny visual — a dot per occurrence across the phase */}
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: card.count }).map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
        ))}
        <span className="ml-1 font-phone-body text-[9px] text-clutch-chocolate/60">
          {card.count}× this phase
        </span>
      </div>

      {card.bcNote && (
        <p className="mt-2 font-phone-body text-[9px] italic text-clutch-chocolate/65">
          noted — you&apos;re on birth control, which shapes your cycle. we&apos;re
          accounting for that.
        </p>
      )}

      <p className="mt-2 font-phone-body text-[9px] text-clutch-chocolate/65">
        clutch surfaces patterns, it doesn&apos;t diagnose. anything that feels
        off is worth bringing up with a doctor.
      </p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => savePattern(card.id)}
          disabled={saved}
          className="flex-1 rounded-full px-3 py-2 font-phone-body text-[10px] uppercase tracking-[0.12em] text-white transition-transform active:scale-95 disabled:opacity-70"
          style={{ backgroundColor: meta.color }}
        >
          {saved ? "♥ saved" : "save this"}
        </button>
        <button
          onClick={() => dismissPattern(card.id)}
          className="rounded-full border px-3 py-2 font-phone-body text-[10px] uppercase tracking-[0.12em] transition-transform active:scale-95"
          style={{ borderColor: meta.color, color: meta.color }}
        >
          not useful
        </button>
      </div>
    </div>
  );
}
