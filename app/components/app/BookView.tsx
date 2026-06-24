"use client";

// the opened journal — smooth corner-curl page turns via react-pageflip.
// each calendar day = ONE spread (left page = meals, right page = meds).
// TAP drives the flip: right half → next page, left half → previous, using the
// library's smooth animation (no drag needed). loaded via dynamic({ssr:false}).

import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { currentPhase, PHASES } from "../../lib/cycle";
import {
  deleteLog,
  type ClutchState,
  type FoodLog,
  type LogEntry,
  type MedLog,
} from "../../lib/store";
import { PhaseChip } from "./shared";

const FlipBook = HTMLFlipBook as unknown as React.ComponentType<Record<string, unknown>>;

type AddTab = "food" | "med";
type DayEntry = { meals: FoodLog[]; meds: MedLog[] };

function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function heading(ts: number, todayKey: string) {
  const k = dayKey(ts);
  if (k === todayKey) return "today";
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (k === dayKey(y.getTime())) return "yesterday";
  return new Date(ts).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
}
function dateStamp(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase();
}
function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase().replace(" ", "");
}

// ---- tracklist rows: a meal/med is a track (ref: mono mixtape liner) ----
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function MealRow({ entry, idx }: { entry: FoodLog; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const n = entry.nutrition;
  const toggle = useCallback(
    (e: React.MouseEvent) => {
      if (!n) return;
      e.stopPropagation();
      setExpanded((v) => !v);
    },
    [n],
  );
  return (
    <>
      <li
        className={`group flex items-baseline gap-2 py-[2.5px] font-zine-mono text-[12px] uppercase leading-tight text-clutch-ink ${n ? "cursor-pointer select-none" : ""}`}
        onClick={toggle}
      >
        <span className="shrink-0 tabular-nums text-clutch-hot">{pad(idx)}</span>
        <span className="min-w-0 flex-1 truncate">{entry.item}</span>
        {n?.calories != null && <span className="shrink-0 tabular-nums text-clutch-chocolate/40">{n.calories}</span>}
        <span className="shrink-0 tabular-nums text-clutch-chocolate/55">{timeLabel(entry.ts)}</span>
        <button onClick={(e) => { e.stopPropagation(); deleteLog(entry.id); }} aria-label="remove" className="shrink-0 text-[10px] text-clutch-chocolate/25 opacity-0 hover:text-clutch-hot group-hover:opacity-100">✕</button>
      </li>
      {expanded && n && (
        <li className="grid grid-cols-2 gap-x-3 gap-y-0.5 pb-1 pl-7 font-zine-mono text-[8px] uppercase text-clutch-chocolate/55">
          <span><span className="text-clutch-hot">{n.calories}</span> KCAL</span>
          <span><span className="text-clutch-hot">{n.protein}G</span> PROT</span>
          <span><span className="text-clutch-hot">{n.carbs}G</span> CARB</span>
          <span><span className="text-clutch-hot">{n.fat}G</span> FAT</span>
          {n.sugar > 0 && <span><span className="text-clutch-hot">{n.sugar}G</span> SUGAR</span>}
        </li>
      )}
    </>
  );
}
function MedRow({ entry, idx }: { entry: MedLog; idx: number }) {
  return (
    <li className="group flex items-baseline gap-2 py-[2.5px] font-zine-mono text-[12px] uppercase leading-tight text-clutch-ink">
      <span className="shrink-0 tabular-nums text-clutch-hot">{pad(idx)}</span>
      <span className="min-w-0 flex-1 truncate">
        {entry.name}
        {entry.isBirthControl && <span className="text-clutch-mauve"> · BC</span>}
      </span>
      <span className="shrink-0 tabular-nums text-clutch-chocolate/55">{timeLabel(entry.ts)}</span>
      <button onClick={() => deleteLog(entry.id)} aria-label="remove" className="shrink-0 text-[10px] text-clutch-chocolate/25 opacity-0 hover:text-clutch-hot group-hover:opacity-100">✕</button>
    </li>
  );
}
function GhostAdd({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li>
      <button onClick={onClick} className="flex w-full items-baseline gap-2 py-[2.5px] text-left font-zine-mono text-[11px] uppercase tracking-tight text-clutch-chocolate/40 transition-colors hover:text-clutch-hot">
        <span className="shrink-0">+</span> {label}
      </button>
    </li>
  );
}

// one physical page — cream paper with a faint grain print (no photo).
const Page = forwardRef<HTMLDivElement, { side: "left" | "right"; children: React.ReactNode }>(
  function Page({ side, children }, ref) {
    return (
      <div ref={ref} className="bg-cream-grain overflow-hidden">
        <div className="relative h-full w-full px-3.5 py-3">
          <div aria-hidden className="grain pointer-events-none absolute inset-0" />
          <div aria-hidden className={`pointer-events-none absolute inset-y-0 w-5 ${side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"} from-black/10 to-transparent`} />
          <div className="relative">{children}</div>
        </div>
      </div>
    );
  },
);

export default function BookView({ state, onAdd }: { state: ClutchState; onAdd: (t: AddTab) => void }) {
  const todayKey = dayKey(Date.now());
  // ref to the flip book → lets a tap call its smooth flipNext()/flipPrev()
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } } | null>(null);

  // date-keyed dict + a CONTINUOUS range (earliest entry, or ≥ a week back, → today)
  // so there are always pages to flip; empty days render as empty spreads.
  const days = useMemo(() => {
    const diary: Record<string, DayEntry> = {};
    let earliest = Date.now();
    for (const log of state.logs as LogEntry[]) {
      const k = dayKey(log.ts);
      (diary[k] ??= { meals: [], meds: [] });
      if (log.kind === "food") diary[k].meals.push(log);
      else diary[k].meds.push(log);
      if (log.ts < earliest) earliest = log.ts;
    }
    const today = new Date(); today.setHours(12, 0, 0, 0);
    const minStart = new Date(today); minStart.setDate(minStart.getDate() - 6);
    const earliestDay = new Date(earliest); earliestDay.setHours(12, 0, 0, 0);
    const start = earliestDay < minStart ? earliestDay : minStart;
    const out: { key: string; ts: number; entry: DayEntry; isToday: boolean }[] = [];
    const cur = new Date(start);
    while (cur <= today) {
      const k = dayKey(cur.getTime());
      out.push({ key: k, ts: cur.getTime(), entry: diary[k] ?? { meals: [], meds: [] }, isToday: k === todayKey });
      cur.setDate(cur.getDate() + 1);
    }
    return out.reverse(); // today first; flipNext → older, flipPrev → newer
  }, [state.logs, todayKey]);

  // tap → drive the library's smooth flip. right half = next page (older),
  // left half = previous (newer). taps on add/delete buttons don't flip.
  const onTapFlip = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fp = bookRef.current?.pageFlip?.();
    if (!fp) return;
    if (e.clientX - rect.left > rect.width / 2) fp.flipNext();
    else fp.flipPrev();
  };

  // build 2 pages per day
  const pageEls: React.ReactNode[] = [];
  let di = -1;
  for (const d of days) {
    di += 1;
    const phase = currentPhase(state.cycleStartISO, d.ts);
    const meta = PHASES[phase];
    const meals = [...d.entry.meals].sort((a, b) => a.ts - b.ts);
    const meds = [...d.entry.meds].sort((a, b) => a.ts - b.ts);
    const totalCals = meals.reduce((sum, f) => sum + (f.nutrition?.calories ?? 0), 0);
    pageEls.push(
      <Page key={`${d.key}-L`} side="left">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-grotesk font-bold lowercase leading-none tracking-tight text-clutch-ink" style={{ fontSize: 30 }}>
                {heading(d.ts, todayKey)}
              </p>
              <p className="mt-1 font-phone-body text-[8px] uppercase tracking-[0.16em] text-clutch-chocolate/60">{dateStamp(d.ts)} · {meta.state}</p>
            </div>
            <PhaseChip phase={phase} size="sm" />
          </div>

          <div className="mt-2 mb-1 flex items-baseline justify-between border-b-2 border-clutch-ink/80 pb-0.5">
            <span className="font-grotesk text-[13px] font-bold uppercase tracking-tight text-clutch-ink">meals</span>
            <span className="font-phone-body text-[8px] uppercase text-clutch-chocolate/45">[{pad(meals.length)}]</span>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto pr-0.5">
            {meals.map((f, i) => <MealRow key={f.id} entry={f} idx={i + 1} />)}
            {d.isToday && <GhostAdd label="add a meal" onClick={() => onAdd("food")} />}
            {!d.isToday && meals.length === 0 && <li className="py-0.5 font-phone-body text-[9px] uppercase tracking-wide text-clutch-chocolate/30">— nothing logged —</li>}
          </ul>

          <div className="mt-1 flex items-center justify-between border-t border-clutch-ink/15 pt-1 font-phone-body text-[7px] uppercase tracking-[0.14em] text-clutch-chocolate/40">
            <span>clutch.log</span>
            {totalCals > 0 ? <span className="text-clutch-hot">{totalCals} kcal</span> : <span>★ ★ ★</span>}
          </div>
        </div>
      </Page>,
    );
    pageEls.push(
      <Page key={`${d.key}-R`} side="right">
        <div className="flex h-full flex-col">
          <div className="mb-1 flex items-baseline justify-between border-b-2 border-clutch-ink/80 pb-0.5">
            <span className="font-grotesk text-[13px] font-bold uppercase tracking-tight text-clutch-ink">meds</span>
            <span className="font-phone-body text-[8px] uppercase text-clutch-chocolate/45">[{pad(meds.length)}]</span>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto pr-0.5">
            {meds.map((m, i) => <MedRow key={m.id} entry={m} idx={i + 1} />)}
            {d.isToday && <GhostAdd label="add a med" onClick={() => onAdd("med")} />}
            {!d.isToday && meds.length === 0 && <li className="py-0.5 font-phone-body text-[9px] uppercase tracking-wide text-clutch-chocolate/30">— none taken —</li>}
          </ul>
          <div className="mt-1 flex items-center justify-between border-t border-clutch-ink/15 pt-1 font-phone-body text-[7px] uppercase tracking-[0.14em] text-clutch-chocolate/40">
            <span>epi.to.me</span>
            <span>{pad(di + 1)} / {pad(days.length)}</span>
          </div>
        </div>
      </Page>,
    );
  }

  return (
    <div className="bg-riso-pink relative overflow-hidden rounded-[4px] border-2 border-clutch-ink px-3 pb-3 pt-7 riso-edge">
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />
      {/* editorial corner stamps */}
      <div className="pointer-events-none absolute left-3 top-2 font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-cream">
        clutch · diary
      </div>
      <div className="pointer-events-none absolute right-3 top-2 font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-cream">
        vol.04 / 10
      </div>

      <div
        className="relative mx-auto w-full max-w-[420px]"
        onClick={onTapFlip}
        style={{ filter: "drop-shadow(3px 5px 0 rgba(27,20,23,0.9))" }}
      >
        <FlipBook
          ref={bookRef}
          key={`${days[0]?.key}_${days.length}`}
          width={210}
          height={300}
          size="stretch"
          minWidth={150}
          maxWidth={230}
          minHeight={214}
          maxHeight={340}
          startPage={0}
          showCover={false}
          usePortrait={false}
          mobileScrollSupport={false}
          disableFlipByClick
          maxShadowOpacity={0.5}
          drawShadow
          flippingTime={700}
        >
          {pageEls}
        </FlipBook>
      </div>
      <p className="relative mt-2.5 text-center font-phone-body text-[8px] uppercase tracking-[0.2em] text-clutch-cream">
        ‹ tap to flip the page ›
      </p>
    </div>
  );
}
