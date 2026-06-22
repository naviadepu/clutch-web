"use client";

import { useState } from "react";
import { cycleDay, currentPhase, PHASES, ribbonCells } from "../../lib/cycle";
import { setCycleStart } from "../../lib/store";
import { PixelHeart } from "../phone/decorations";

/** the greeting + cycle ribbon. "hi, navi · day 14 · ovulating." */
export default function CycleHeader({
  cycleStartISO,
}: {
  cycleStartISO: string;
}) {
  const [editing, setEditing] = useState(false);
  const day = cycleDay(cycleStartISO);
  const phase = currentPhase(cycleStartISO);
  const meta = PHASES[phase];
  const cells = ribbonCells(cycleStartISO);

  const startPeriodToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setCycleStart(d.toISOString());
    setEditing(false);
  };

  return (
    <header className="px-1">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-pinyon text-clutch-hot" style={{ fontSize: 40, lineHeight: 0.85 }}>
            hi, navi.
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-phone-body text-[10px] uppercase tracking-[0.18em] text-clutch-chocolate/80">
            <span>day {day}</span>
            <span aria-hidden style={{ color: meta.color }}>·</span>
            <span style={{ color: meta.color }}>{meta.state}</span>
          </p>
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="flex items-center gap-1 rounded-full border border-clutch-ink/15 bg-white/70 px-2.5 py-1 font-phone-body text-[9px] uppercase tracking-[0.14em] text-clutch-chocolate/70 transition-colors hover:bg-white active:scale-95"
        >
          <PixelHeart size={8} color={meta.color} />
          cycle
        </button>
      </div>

      {/* the 28-day ribbon */}
      <div className="mt-3 flex items-center gap-px">
        {cells.map((c) => (
          <span
            key={c.day}
            title={`day ${c.day} · ${c.phase}`}
            className="h-1 flex-1 rounded-full transition-all"
            style={{
              backgroundColor: c.isPast || c.isToday ? c.color : "rgba(74,42,26,0.13)",
              opacity: c.isPast ? 0.45 : 1,
              transform: c.isToday ? "scaleY(3.4)" : undefined,
            }}
          />
        ))}
      </div>

      {editing && (
        <div className="animate-fadeIn mt-3 rounded-lg border border-clutch-ink/15 bg-white/80 p-3">
          <p className="font-phone-body text-[10px] text-clutch-chocolate/80">
            when did your last period start? we&apos;ll stamp every log with the
            right phase.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={startPeriodToday}
              className="rounded-full bg-clutch-hot px-3 py-1.5 font-phone-body text-[10px] uppercase tracking-[0.12em] text-white active:scale-95"
            >
              ♥ today
            </button>
            <input
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              defaultValue={cycleStartISO.slice(0, 10)}
              onChange={(e) => {
                if (!e.target.value) return;
                const d = new Date(e.target.value);
                d.setHours(0, 0, 0, 0);
                setCycleStart(d.toISOString());
              }}
              className="rounded-md border border-clutch-ink/20 bg-white px-2 py-1 font-phone-body text-[10px] text-clutch-chocolate"
            />
          </div>
        </div>
      )}
    </header>
  );
}
