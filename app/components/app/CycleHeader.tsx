"use client";

import { useState } from "react";
import { cycleDay, currentPhase, PHASES, ribbonCells } from "../../lib/cycle";
import type { ClutchState } from "../../lib/store";
import { PixelHeart } from "../phone/decorations";
import CycleDrawer from "./CycleDrawer";

/** the greeting + cycle ribbon. "hi, navi · day 14 · ovulating."
 *  tapping "cycle" opens the slide-out drawer to edit it. */
export default function CycleHeader({ state }: { state: ClutchState }) {
  const cycleStartISO = state.cycleStartISO;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const day = cycleDay(cycleStartISO);
  const phase = currentPhase(cycleStartISO);
  const meta = PHASES[phase];
  const cells = ribbonCells(cycleStartISO);

  return (
    <header className="px-1">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-pinyon text-clutch-hot" style={{ fontSize: 40, lineHeight: 0.85 }}>
            hi, {state.userName || "you"}.
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-phone-body text-[10px] uppercase tracking-[0.18em] text-clutch-chocolate/80">
            <span>day {day}</span>
            <span aria-hidden style={{ color: meta.color }}>·</span>
            <span style={{ color: meta.color }}>{meta.state}</span>
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="edit your cycle"
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-phone-body text-[9px] uppercase tracking-[0.14em] transition-colors active:scale-95"
          style={{ borderColor: meta.color, color: meta.color, backgroundColor: meta.soft }}
        >
          <PixelHeart size={8} color={meta.color} />
          edit cycle
          <span aria-hidden className="opacity-60">›</span>
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

      {drawerOpen && <CycleDrawer state={state} onClose={() => setDrawerOpen(false)} />}
    </header>
  );
}
