"use client";

// the closed journal — a printed riso cover (duotone + halftone + grain).
// the "clutch" script is the ONLY cursive on the page (the logo). tap it to flip
// open. the color picker swaps the ink the cover is printed in.

import { JOURNAL_COLORS, JOURNAL_COLOR_BY_ID, type JournalColorId } from "../../lib/journal";

export default function JournalCover({
  colorId,
  onPickColor,
}: {
  colorId: JournalColorId;
  onPickColor: (id: JournalColorId) => void;
}) {
  const c = JOURNAL_COLOR_BY_ID[colorId] ?? JOURNAL_COLORS[0];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        {/* the cover */}
        <div
          className="riso-edge animate-float relative overflow-hidden border-2 border-clutch-ink"
          style={{ width: 272, height: 364, backgroundColor: c.base }}
        >
          {/* duotone wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 85% at 22% 12%, rgba(255,255,255,0.4), transparent 55%), radial-gradient(120% 100% at 88% 96%, rgba(27,20,23,0.34), transparent 55%)",
            }}
          />
          <div aria-hidden className="tex-halftone pointer-events-none absolute inset-0 opacity-40" />
          <div aria-hidden className="grain pointer-events-none absolute inset-0" />
          {/* spine */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-black/15" />

          {/* corner stamps */}
          <div className="absolute left-5 top-3 font-phone-body text-[9px] uppercase tracking-[0.22em]" style={{ color: c.ink }}>
            daily log
          </div>
          <div className="absolute right-4 top-3 font-phone-body text-[9px] uppercase tracking-[0.22em]" style={{ color: c.ink }}>
            ’26
          </div>

          {/* the logo (only script on the page) */}
          <div className="absolute inset-0 grid place-items-center">
            <span
              className="font-pinyon"
              style={{ fontSize: 74, lineHeight: 0.8, color: c.ink, textShadow: "0 2px 0 rgba(27,20,23,0.14)" }}
            >
              clutch
            </span>
          </div>

          <div
            className="absolute inset-x-5 bottom-3 flex items-center justify-between font-phone-body text-[8px] uppercase tracking-[0.18em]"
            style={{ color: c.ink }}
          >
            <span>epi.to.me</span>
            <span>food · meds · cycle</span>
          </div>
        </div>

        {/* TAP TO LOG — hard mono label, overlapping the bottom edge */}
        <div className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2">
          <div className="riso-edge flex items-center gap-1.5 border-2 border-clutch-ink bg-clutch-cream px-3 py-1">
            <span className="font-phone-body text-[10px] font-bold uppercase tracking-[0.2em] text-clutch-ink">tap to log</span>
            <span className="h-1.5 w-1.5 bg-acid" />
          </div>
        </div>
      </div>

      {/* color picker — hard-edged swatches in the new palette */}
      <div
        className="riso-edge flex items-center gap-2 border-2 border-clutch-ink bg-clutch-cream px-3 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-ink/55">ink</span>
        {JOURNAL_COLORS.map((opt) => {
          const active = opt.id === colorId;
          return (
            <button
              key={opt.id}
              onClick={(e) => {
                e.stopPropagation();
                onPickColor(opt.id);
              }}
              aria-label={`${opt.label} cover`}
              className={`h-5 w-5 border-2 transition-transform active:scale-90 ${
                active ? "border-acid" : "border-clutch-ink/30"
              }`}
              style={{ backgroundColor: opt.base }}
            />
          );
        })}
      </div>
    </div>
  );
}
