"use client";

// the closed journal — the poster image (flower + woman), text removed, with
// only "clutch" in the middle. the picker recolors the "clutch" text + border.

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
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className="riso-edge animate-float relative w-full overflow-hidden border-2"
        style={{ maxWidth: 380, height: "min(78vh, 600px)", borderColor: c.base }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/journal/cover-poster.jpg"
          alt="clutch"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <p
          className="absolute inset-0 grid place-items-center font-pinyon"
          style={{ fontSize: 76, color: c.base, textShadow: "0 2px 10px rgba(255,255,255,0.55)" }}
        >
          clutch
        </p>
      </div>

      {/* color picker — recolors the "clutch" text + the border */}
      <div
        className="riso-edge flex items-center gap-2 border-2 border-clutch-ink bg-clutch-cream px-3 py-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-ink/55">color</span>
        {JOURNAL_COLORS.map((opt) => {
          const active = opt.id === colorId;
          return (
            <button
              key={opt.id}
              onClick={(e) => {
                e.stopPropagation();
                onPickColor(opt.id);
              }}
              aria-label={`${opt.label}`}
              className={`h-5 w-5 border-2 transition-transform active:scale-90 ${active ? "border-acid" : "border-clutch-ink/30"}`}
              style={{ backgroundColor: opt.base }}
            />
          );
        })}
      </div>
    </div>
  );
}
