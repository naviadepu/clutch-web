"use client";

import {
  cycleDay,
  currentPhase,
  PHASES,
  PHASE_ORDER,
  type Phase,
} from "../../lib/cycle";
import { CUISINES } from "../../lib/cuisines";
import { setCycleStart, setDefaultCuisine, type ClutchState } from "../../lib/store";

const PHASE_RANGE: Record<Phase, string> = {
  menstrual: "days 1–5",
  follicular: "days 6–13",
  ovulation: "days 14–16",
  luteal: "days 17–28",
};

/** the slide-out cycle drawer — riso. tap "edit cycle" to set your period start. */
export default function CycleDrawer({
  state,
  onClose,
}: {
  state: ClutchState;
  onClose: () => void;
}) {
  const day = cycleDay(state.cycleStartISO);
  const phase = currentPhase(state.cycleStartISO);

  const startToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setCycleStart(d.toISOString());
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
      <button aria-label="close" onClick={onClose} className="animate-scrim-in absolute inset-0 bg-clutch-ink/40" />

      <aside className="animate-drawer-in bg-cream-grain relative flex h-full w-[86%] max-w-[360px] flex-col overflow-y-auto border-l-2 border-clutch-ink shadow-[-6px_0_0_rgba(27,20,23,0.9)]">
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />
        <div className="relative px-5 pb-10 pt-6">
          {/* header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-grotesk font-bold lowercase leading-none tracking-tight text-clutch-ink" style={{ fontSize: 34 }}>
                your cycle
              </p>
              <p className="mt-1.5 font-phone-body text-[10px] font-bold uppercase tracking-[0.16em] text-clutch-ink">
                day {day} · {PHASES[phase].state}
              </p>
            </div>
            <button
              onClick={onClose}
              className="riso-edge border-2 border-clutch-ink bg-clutch-cream px-2.5 py-1 font-phone-body text-[9px] font-bold uppercase tracking-[0.1em] text-clutch-ink"
            >
              close
            </button>
          </div>

          {/* period start */}
          <section className="riso-edge mt-6 border-2 border-clutch-ink bg-clutch-cream p-4">
            <h3 className="font-phone-body text-[9px] font-bold uppercase tracking-[0.16em] text-clutch-ink/55">
              last period started
            </h3>
            <p className="mt-1 font-phone-body text-[8px] uppercase leading-relaxed tracking-wide text-clutch-ink/45">
              we stamp every log with the phase from this.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={startToday}
                className="riso-edge border-2 border-clutch-ink bg-pink px-3 py-1.5 font-phone-body text-[10px] font-bold uppercase tracking-[0.1em] text-clutch-cream active:scale-95"
              >
                today
              </button>
              <input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={state.cycleStartISO.slice(0, 10)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  const d = new Date(e.target.value);
                  d.setHours(0, 0, 0, 0);
                  setCycleStart(d.toISOString());
                }}
                className="border-2 border-clutch-ink bg-white px-2.5 py-1.5 font-phone-body text-[11px] text-clutch-ink"
              />
            </div>
          </section>

          {/* phase legend */}
          <section className="mt-6">
            <h3 className="mb-2 font-grotesk text-[13px] font-bold lowercase tracking-tight text-clutch-ink">
              where you are
            </h3>
            <div className="flex flex-col gap-1.5">
              {PHASE_ORDER.map((p) => {
                const meta = PHASES[p];
                const active = p === phase;
                return (
                  <div
                    key={p}
                    className="flex items-center gap-3 border-2 p-2.5"
                    style={{
                      borderColor: active ? "#1B1417" : "rgba(27,20,23,0.15)",
                      backgroundColor: active ? meta.soft : "transparent",
                    }}
                  >
                    <span aria-hidden className="h-6 w-6 shrink-0 border-2 border-clutch-ink" style={{ backgroundColor: meta.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="font-phone-body text-[11px] font-bold uppercase text-clutch-ink">
                        {meta.label}
                        <span className="ml-1.5 text-[8px] font-normal tracking-wide text-clutch-ink/40">{PHASE_RANGE[p]}</span>
                      </p>
                      {active && (
                        <p className="mt-0.5 font-phone-body text-[8px] uppercase tracking-wide text-clutch-ink/55">{meta.blurb}</p>
                      )}
                    </div>
                    {active && <span className="bg-acid px-1 py-0.5 font-phone-body text-[8px] font-bold uppercase text-clutch-ink">here</span>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* default cuisine */}
          <section className="mt-6">
            <h3 className="mb-2 font-grotesk text-[13px] font-bold lowercase tracking-tight text-clutch-ink">
              your cuisine
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {CUISINES.map((c) => {
                const active = c.id === state.defaultCuisine;
                return (
                  <button
                    key={c.id}
                    onClick={() => setDefaultCuisine(c.id)}
                    className={`border-2 px-2.5 py-1 font-phone-body text-[10px] font-bold uppercase transition-colors ${
                      active ? "border-clutch-ink bg-clutch-ink text-clutch-cream" : "border-clutch-ink/25 bg-clutch-cream text-clutch-ink/55"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
