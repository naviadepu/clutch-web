"use client";

// the closed journal — the real bookcloth photo. tap it and it flips open to
// your diary. the swatches re-tint the exact same photo (cloth texture intact);
// the open book + stickers don't change.

import { FourPointStar } from "../phone/decorations";
import { JOURNAL_COLORS, JOURNAL_COLOR_BY_ID, type JournalColorId } from "../../lib/journal";

export default function JournalCover({
  colorId,
  onPickColor,
}: {
  colorId: JournalColorId;
  onPickColor: (id: JournalColorId) => void;
}) {
  const c = JOURNAL_COLOR_BY_ID[colorId] ?? JOURNAL_COLORS[0];
  const tint = c.filter === "none" ? "" : c.filter;
  const filter = `${tint} drop-shadow(0 12px 16px rgba(120,90,100,0.32))`.trim();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: 272 }}>
        {/* the actual bookcloth photo (background cut out), re-tinted by the
            chosen color — same exact book, different cloth */}
        <div className="animate-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/journal/cover.png"
            alt="your clutch journal"
            draggable={false}
            className="w-full select-none"
            style={{ filter }}
          />

          {/* "clutch" title in the middle of the cover */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-pinyon text-clutch-hot"
            style={{ fontSize: 52, textShadow: "0 1px 2px rgba(255,255,255,0.55)" }}
          >
            clutch
          </span>

          {/* small static "tap to log" pill */}
          <div className="absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2">
            <div className="flex items-center gap-1 rounded-full border border-[#D6336C] bg-white px-2.5 py-0.5 shadow-sm">
              <FourPointStar size={8} color="#D6336C" />
              <span className="font-phone-body text-[7px] uppercase tracking-[0.14em] text-[#D6336C]">
                tap to log
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* color picker — change your bookcloth */}
      <div
        className="flex items-center gap-2 rounded-full border border-clutch-ink/10 bg-white/80 px-3 py-2 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-phone-body text-[9px] uppercase tracking-[0.14em] text-clutch-chocolate/55">
          color
        </span>
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
              className={`h-6 w-6 rounded-full border-2 transition-transform active:scale-90 ${
                active ? "scale-110 ring-2 ring-clutch-hot ring-offset-1" : ""
              }`}
              style={{
                backgroundColor: opt.swatch,
                borderColor: active ? "#fff" : "rgba(255,255,255,0.7)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
