"use client";

// the opened journal — smooth corner-curl page turns via react-pageflip.
// each calendar day = ONE spread (left page = meals, right page = meds).
// TAP drives the flip: right half → next page, left half → previous, using the
// library's smooth animation (no drag needed). loaded via dynamic({ssr:false}).

import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { currentPhase, PHASES } from "../../lib/cycle";
import { foodInfo, SENTIMENT_COLOR } from "../../lib/foodInfo";
import {
  deleteLog,
  type ClutchState,
  type FoodLog,
  type LogEntry,
  type MedLog,
} from "../../lib/store";
import KawaiiFood from "./KawaiiFood";
import { PhaseChip } from "./shared";
import { FourPointStar } from "../phone/decorations";

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

// ---- content rows (your existing layout) ----
function MealRow({ entry }: { entry: FoodLog }) {
  const info = foodInfo(entry.item);
  const [expanded, setExpanded] = useState(false);
  const n = entry.nutrition;
  // tap a meal (with nutrition) to expand macros; stopPropagation keeps the
  // tap from bubbling up and flipping the page.
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
        className={`group flex items-center gap-1.5 py-[3px] ${n ? "cursor-pointer select-none" : ""}`}
        onClick={toggle}
      >
        <KawaiiFood item={entry.item} size={26} className="shrink-0" />
        <span className="min-w-0 flex-1 truncate font-pinyon leading-none text-clutch-hot" style={{ fontSize: 19 }}>{entry.item}</span>
        {n?.calories != null && (
          <span className="shrink-0 font-phone-body text-[8px] text-clutch-chocolate/40">{n.calories}</span>
        )}
        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: SENTIMENT_COLOR[info.sentiment] }} />
        <button onClick={(e) => { e.stopPropagation(); deleteLog(entry.id); }} aria-label="remove" className="shrink-0 font-phone-body text-[9px] text-clutch-chocolate/25 opacity-0 hover:text-clutch-hot group-hover:opacity-100">✕</button>
      </li>
      {expanded && n && (
        <li className="pb-1 pl-[29px]">
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-phone-body text-[7.5px] text-clutch-chocolate/50">
            <span><span className="text-clutch-hot/70">{n.calories}</span> kcal</span>
            <span><span className="text-clutch-hot/70">{n.protein}g</span> prot</span>
            <span><span className="text-clutch-hot/70">{n.carbs}g</span> carb</span>
            <span><span className="text-clutch-hot/70">{n.fat}g</span> fat</span>
            {n.sugar > 0 && <span><span className="text-clutch-hot/70">{n.sugar}g</span> sugar</span>}
          </div>
          <p className="mt-0.5 font-phone-body text-[7px] italic text-clutch-chocolate/30">{n.portionLabel}</p>
        </li>
      )}
    </>
  );
}
function MedRow({ entry }: { entry: MedLog }) {
  return (
    <li className="group flex items-center gap-1.5 py-[3px]">
      <span aria-hidden className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[13px]" style={{ backgroundColor: entry.isBirthControl ? "#E7D6EC" : "#FBE4D6" }}>{entry.isBirthControl ? "🌸" : "💊"}</span>
      <span className="min-w-0 flex-1 truncate font-pinyon leading-none text-clutch-hot" style={{ fontSize: 19 }}>{entry.name}</span>
      <span className="shrink-0 font-phone-body text-[7px] uppercase tracking-wide text-clutch-chocolate/40">{timeLabel(entry.ts)}</span>
      <button onClick={() => deleteLog(entry.id)} aria-label="remove" className="shrink-0 font-phone-body text-[9px] text-clutch-chocolate/25 opacity-0 hover:text-clutch-hot group-hover:opacity-100">✕</button>
    </li>
  );
}
function GhostAdd({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li>
      <button onClick={onClick} className="flex w-full items-center gap-1 py-[3px] text-left font-phone-display text-[10px] italic text-clutch-chocolate/40 hover:text-clutch-hot">
        <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border border-dashed border-current text-[9px]">+</span>
        {label}
      </button>
    </li>
  );
}

// one physical page. forwardRef so StPageFlip can drive the curl. cream paper =
// the real page.png crop; the spine edge gets a soft shadow.
const Page = forwardRef<HTMLDivElement, { side: "left" | "right"; children: React.ReactNode }>(
  function Page({ side, children }, ref) {
    return (
      <div ref={ref} className="overflow-hidden bg-[#FFFDF7]" style={{ backgroundImage: "url(/images/journal/page.png)", backgroundSize: "cover", backgroundPosition: side === "left" ? "left" : "right" }}>
        <div className="relative h-full w-full px-3.5 py-3">
          <div aria-hidden className={`pointer-events-none absolute inset-y-0 w-5 ${side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"} from-black/12 to-transparent`} />
          {children}
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
  for (const d of days) {
    const phase = currentPhase(state.cycleStartISO, d.ts);
    const meta = PHASES[phase];
    const meals = [...d.entry.meals].sort((a, b) => a.ts - b.ts);
    const meds = [...d.entry.meds].sort((a, b) => a.ts - b.ts);
    const totalCals = meals.reduce((sum, f) => sum + (f.nutrition?.calories ?? 0), 0);
    pageEls.push(
      <Page key={`${d.key}-L`} side="left">
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center gap-1 font-pinyon text-clutch-hot" style={{ fontSize: 26, lineHeight: 0.85 }}>
              {d.isToday && <FourPointStar size={11} color={meta.color} className="sparkle-spin" />}
              {heading(d.ts, todayKey)}
            </p>
            <p className="mt-0.5 font-phone-body text-[8px] uppercase tracking-[0.14em] text-clutch-chocolate/60">{dateStamp(d.ts)} · {meta.state}</p>
          </div>
          <PhaseChip phase={phase} size="sm" />
        </div>
        <div className="my-1.5 h-px bg-clutch-ink/10" />
        <p className="mb-0.5 flex items-center gap-1 font-pinyon leading-none" style={{ fontSize: 19, color: meta.color }}>
          <FourPointStar size={9} color={meta.color} /> meals
        </p>
        <ul className="max-h-[64%] overflow-y-auto pr-0.5">
          {meals.map((f) => <MealRow key={f.id} entry={f} />)}
          {d.isToday && <GhostAdd label="add a meal…" onClick={() => onAdd("food")} />}
          {!d.isToday && meals.length === 0 && <li className="py-0.5 font-phone-display text-[10px] italic text-clutch-chocolate/35">nothing here.</li>}
        </ul>
        {totalCals > 0 && (
          <p className="mt-0.5 px-0.5 font-phone-body text-[7px] text-clutch-chocolate/35">{totalCals} kcal total</p>
        )}
      </Page>,
    );
    pageEls.push(
      <Page key={`${d.key}-R`} side="right">
        <p className="mb-1 mt-6 flex items-center gap-1 font-pinyon leading-none" style={{ fontSize: 19, color: meta.color }}>
          <FourPointStar size={9} color={meta.color} /> meds
        </p>
        <ul className="max-h-[72%] overflow-y-auto pr-0.5">
          {meds.map((m) => <MedRow key={m.id} entry={m} />)}
          {d.isToday && <GhostAdd label="add a med…" onClick={() => onAdd("med")} />}
          {!d.isToday && meds.length === 0 && <li className="py-0.5 font-phone-display text-[10px] italic text-clutch-chocolate/35">none taken.</li>}
        </ul>
      </Page>,
    );
  }

  return (
    <div
      className="relative rounded-2xl border border-clutch-ink/10 px-3 pb-4 pt-4 shadow-inner"
      style={{ backgroundImage: "url(/images/journal/stripes.png)", backgroundSize: "100% auto", backgroundRepeat: "repeat-y" }}
    >
      <div
        className="mx-auto"
        onClick={onTapFlip}
        style={{ width: "min(94vw, 440px)", filter: "drop-shadow(3px 5px 0 #EADBC4) drop-shadow(6px 9px 0 rgba(210,180,140,0.4))" }}
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
      <p className="mt-2 text-center font-phone-body text-[8px] uppercase tracking-[0.16em] text-clutch-chocolate/45">
        tap left / right to flip the page
      </p>
    </div>
  );
}
