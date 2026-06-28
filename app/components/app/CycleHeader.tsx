"use client";

import { useState } from "react";
import { cycleDay, currentPhase, PHASES, ribbonCells } from "../../lib/cycle";
import { editName, type ClutchState } from "../../lib/store";
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
          <button
            onClick={editName}
            aria-label="change your name"
            className="group flex items-baseline gap-1.5 text-left"
          >
            <span className="font-grotesk font-bold lowercase leading-none tracking-tight text-clutch-ink" style={{ fontSize: 38 }}>
              hi, {state.userName || "you"}.
            </span>
            <span className="font-phone-body text-[9px] uppercase tracking-[0.12em] text-clutch-ink/30 transition-colors group-hover:text-clutch-hot">
              ✎
            </span>
          </button>
          <p className="mt-1.5 flex items-center gap-1.5 font-phone-body text-[10px] font-bold uppercase tracking-[0.18em] text-clutch-ink">
            <span>day {day}</span>
            <span aria-hidden>·</span>
            <span style={{ color: meta.color }}>{meta.state}</span>
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="edit your cycle"
          className="riso-edge flex items-center gap-1.5 border-2 border-clutch-ink bg-clutch-cream px-2.5 py-1 font-phone-body text-[9px] font-bold uppercase tracking-[0.12em] text-clutch-ink transition-transform active:scale-95"
        >
          edit cycle
          <span aria-hidden>→</span>
        </button>
      </div>

      {/* the 28-day cycle bar: spent days inked, today acid, future faint */}
      <div className="mt-3 flex items-end gap-[2px]">
        {cells.map((c) => (
          <span
            key={c.day}
            title={`day ${c.day} · ${c.phase}`}
            className="flex-1 transition-all"
            style={{
              height: c.isToday ? 11 : 4,
              backgroundColor: c.isToday
                ? "#D7FF45"
                : c.isPast
                  ? c.color
                  : "rgba(27,20,23,0.14)",
              boxShadow: c.isToday ? "0 0 0 1.5px #1B1417" : undefined,
            }}
          />
        ))}
      </div>

      {drawerOpen && <CycleDrawer state={state} onClose={() => setDrawerOpen(false)} />}
    </header>
  );
}
