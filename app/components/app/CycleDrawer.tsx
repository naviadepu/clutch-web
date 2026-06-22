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
import { Bow, Stamp, WashiTape } from "./scrapbook";

const PHASE_RANGE: Record<Phase, string> = {
  menstrual: "days 1–5",
  follicular: "days 6–13",
  ovulation: "days 14–16",
  luteal: "days 17–28",
};

/** the slide-out cycle drawer. tap "cycle" → edit your cycle, clearly. */
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
      <button
        aria-label="close"
        onClick={onClose}
        className="animate-scrim-in absolute inset-0 bg-clutch-ink/35"
      />

      <aside className="animate-drawer-in bg-page-gingham relative flex h-full w-[86%] max-w-[360px] flex-col overflow-y-auto border-l-2 border-clutch-hot shadow-[-8px_0_40px_rgba(214,51,108,0.2)]">
        <Bow size={30} className="absolute right-4 top-3 z-10 rotate-6" />

        <div className="px-5 pb-10 pt-6">
          {/* header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-pinyon text-clutch-hot" style={{ fontSize: 38, lineHeight: 0.85 }}>
                your cycle
              </p>
              <p className="mt-1 font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/70">
                day {day} · {PHASES[phase].state}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/70 px-2.5 py-1 font-phone-body text-[11px] text-clutch-chocolate/55 hover:text-clutch-hot"
            >
              close
            </button>
          </div>

          {/* a paper card: when did your period start */}
          <section className="paper-soft relative mt-6 rounded-[4px] p-4" style={{ transform: "rotate(-0.6deg)" }}>
            <WashiTape rotate={-7} color="#EE9DB8" width={58} className="absolute -left-2 -top-2" />
            <h3 className="font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/60">
              last period started
            </h3>
            <p className="mt-1 font-phone-display text-[11px] italic text-clutch-chocolate/70">
              we stamp every log with the right phase from this.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={startToday}
                className="rounded-full bg-clutch-hot px-3.5 py-2 font-phone-body text-[10px] uppercase tracking-[0.12em] text-white active:scale-95"
              >
                ♥ today
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
                className="rounded-lg border border-clutch-ink/20 bg-white px-2.5 py-1.5 font-phone-body text-[11px] text-clutch-chocolate"
              />
            </div>
          </section>

          {/* phase legend */}
          <section className="mt-6">
            <h3 className="mb-2 px-1 font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/60">
              where you are
            </h3>
            <div className="flex flex-col gap-2">
              {PHASE_ORDER.map((p) => {
                const meta = PHASES[p];
                const active = p === phase;
                return (
                  <div
                    key={p}
                    className="flex items-center gap-3 rounded-xl border p-2.5 transition-colors"
                    style={{
                      borderColor: active ? meta.color : "rgba(27,27,27,0.1)",
                      backgroundColor: active ? meta.soft : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: meta.color }}
                    >
                      {active && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-phone-display text-[13px] italic text-clutch-ink">
                        {meta.label}
                        <span className="ml-1.5 font-phone-body text-[8px] not-italic uppercase tracking-[0.12em] text-clutch-chocolate/45">
                          {PHASE_RANGE[p]}
                        </span>
                      </p>
                      {active && (
                        <p className="font-phone-body text-[10px] text-clutch-chocolate/70">
                          {meta.blurb}
                        </p>
                      )}
                    </div>
                    {active && <Stamp rotate={-5}>you&apos;re here</Stamp>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* default cuisine — the wedge setting */}
          <section className="mt-6">
            <h3 className="mb-2 px-1 font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/60">
              your cuisine · shows first when you log
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {CUISINES.map((c) => {
                const active = c.id === state.defaultCuisine;
                return (
                  <button
                    key={c.id}
                    onClick={() => setDefaultCuisine(c.id)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 font-phone-body text-[10px] lowercase transition-colors ${
                      active
                        ? "border-clutch-hot bg-clutch-hot/10 text-clutch-hot"
                        : "border-clutch-ink/15 bg-white/70 text-clutch-chocolate/65"
                    }`}
                  >
                    <span aria-hidden>{c.emoji}</span>
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
