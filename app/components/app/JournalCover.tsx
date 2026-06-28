"use client";

// the closed journal — a soft grainy pink-flower field with a white kneeling
// woman centered and mono corner text (poster composition). big, light, simple.
// the color picker hue-shifts the flower.

import WomanSilhouette from "./WomanSilhouette";
import { JOURNAL_COLORS, type JournalColorId } from "../../lib/journal";

// flower hue-shift per cover color (peony reads ~pink by default = rose)
const FLOWER_FILTER: Record<JournalColorId, string> = {
  rose: "",
  peach: "saturate(1.25)",
  lavender: "hue-rotate(-42deg) saturate(1.05)",
  butter: "hue-rotate(78deg) saturate(1.1) brightness(1.08)",
  sage: "brightness(1.12) saturate(0.85)",
  sky: "hue-rotate(188deg) saturate(0.95)",
  cream: "saturate(0.4) brightness(1.1)",
};

export default function JournalCover({
  colorId,
  onPickColor,
}: {
  colorId: JournalColorId;
  onPickColor: (id: JournalColorId) => void;
}) {
  const flt = `${FLOWER_FILTER[colorId] ?? ""} blur(2px)`.trim();

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className="riso-edge animate-float relative w-full overflow-hidden border-2 border-clutch-ink"
        style={{ maxWidth: 380, height: "min(78vh, 600px)" }}
      >
        {/* soft-focus pink flower */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/journal/flower.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: flt, transform: "scale(1.12)" }}
        />
        {/* grainy pink wash — soft grey-pink top → deeper pink bottom */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(231,214,212,0.62) 0%, rgba(255,160,200,0.34) 42%, rgba(200,35,95,0.42) 100%)",
          }}
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />

        {/* mono corner stamps (poster style) */}
        <div className="absolute inset-x-5 top-4 flex items-center justify-between font-phone-body text-[9px] uppercase tracking-[0.18em] text-white">
          <span>made for you</span>
          <span>’26</span>
        </div>

        {/* the script logo */}
        <p
          className="absolute inset-x-0 top-[7%] text-center font-pinyon text-white"
          style={{ fontSize: 58, lineHeight: 0.8, textShadow: "0 2px 6px rgba(27,20,23,0.25)" }}
        >
          clutch
        </p>

        {/* the kneeling woman — centered */}
        <div className="absolute inset-x-0 top-[28%] bottom-[18%] grid place-items-center">
          <WomanSilhouette className="h-full w-auto drop-shadow-[0_6px_16px_rgba(27,20,23,0.22)]" color="#FFFFFF" />
        </div>

        {/* bottom tagline */}
        <p className="absolute inset-x-0 bottom-[8%] px-6 text-center font-phone-body text-[9px] uppercase leading-relaxed tracking-[0.2em] text-white">
          food · meds · your cycle
        </p>

        {/* TAP TO LOG */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <div className="riso-edge flex items-center gap-1.5 border-2 border-clutch-ink bg-clutch-cream px-3 py-1">
            <span className="font-phone-body text-[10px] font-bold uppercase tracking-[0.2em] text-clutch-ink">tap to log</span>
            <span className="h-1.5 w-1.5 bg-acid" />
          </div>
        </div>
      </div>

      {/* color picker — hue-shifts the flower */}
      <div
        className="riso-edge flex items-center gap-2 border-2 border-clutch-ink bg-clutch-cream px-3 py-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-ink/55">hue</span>
        {JOURNAL_COLORS.map((opt) => {
          const active = opt.id === colorId;
          return (
            <button
              key={opt.id}
              onClick={(e) => {
                e.stopPropagation();
                onPickColor(opt.id);
              }}
              aria-label={`${opt.label} flower`}
              className={`h-5 w-5 border-2 transition-transform active:scale-90 ${active ? "border-acid" : "border-clutch-ink/30"}`}
              style={{ backgroundColor: opt.base }}
            />
          );
        })}
      </div>
    </div>
  );
}
