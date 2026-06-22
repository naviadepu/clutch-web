"use client";

// the opened journal — the real two-page blank spread (the exact photo). left
// page = meals, right page = medication. thick pages (the photo's fore-edges +
// a stacked block); flip through one day-spread at a time.

import { useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
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

type AddTab = "food" | "med";
type DayPage = { key: string; ts: number; foods: FoodLog[]; meds: MedLog[]; isToday: boolean };

function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function heading(ts: number, todayKey: string) {
  const isToday = dayKey(ts) === todayKey;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (isToday) return "today";
  if (dayKey(ts) === dayKey(y.getTime())) return "yesterday";
  return new Date(ts).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
}
function dateStamp(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase();
}

function MealRow({ entry }: { entry: FoodLog }) {
  const info = foodInfo(entry.item);
  return (
    <li className="group flex items-center gap-1.5 py-[3px]">
      <KawaiiFood item={entry.item} size={26} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate font-pinyon leading-none text-clutch-hot" style={{ fontSize: 19 }}>
        {entry.item}
      </span>
      <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: SENTIMENT_COLOR[info.sentiment] }} />
      <button onClick={() => deleteLog(entry.id)} aria-label="remove" className="shrink-0 font-phone-body text-[9px] text-clutch-chocolate/25 opacity-0 hover:text-clutch-hot group-hover:opacity-100">
        ✕
      </button>
    </li>
  );
}

function MedRow({ entry }: { entry: MedLog }) {
  return (
    <li className="group flex items-center gap-1.5 py-[3px]">
      <span aria-hidden className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[13px]" style={{ backgroundColor: entry.isBirthControl ? "#E7D6EC" : "#FBE4D6" }}>
        {entry.isBirthControl ? "🌸" : "💊"}
      </span>
      <span className="min-w-0 flex-1 truncate font-pinyon leading-none text-clutch-hot" style={{ fontSize: 19 }}>
        {entry.name}
      </span>
      {entry.isBirthControl && (
        <span className="shrink-0 font-phone-body text-[6px] uppercase tracking-wide text-clutch-chocolate/40">bc</span>
      )}
      <button onClick={() => deleteLog(entry.id)} aria-label="remove" className="shrink-0 font-phone-body text-[9px] text-clutch-chocolate/25 opacity-0 hover:text-clutch-hot group-hover:opacity-100">
        ✕
      </button>
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

function PageColumn({
  title,
  accent,
  children,
  style,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <div className="absolute flex flex-col" style={style}>
      <p className="mb-1 flex items-center gap-1 border-b border-clutch-ink/12 pb-0.5 font-pinyon leading-none" style={{ fontSize: 21, color: accent }}>
        <FourPointStar size={10} color={accent} />
        {title}
      </p>
      <ul className="min-h-0 flex-1 overflow-y-auto pr-0.5">{children}</ul>
    </div>
  );
}

function Spread({ page, cycleStartISO, onAdd }: { page: DayPage; cycleStartISO: string; onAdd: (t: AddTab) => void }) {
  const phase = currentPhase(cycleStartISO, page.ts);
  const meta = PHASES[phase];
  const foods = [...page.foods].sort((a, b) => a.ts - b.ts);
  const meds = [...page.meds].sort((a, b) => a.ts - b.ts);

  return (
    <>
      {/* date tab across the spine */}
      <div className="absolute left-1/2 top-[5%] z-20 flex -translate-x-1/2 flex-col items-center">
        <span className="flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-0.5 font-pinyon leading-none text-clutch-hot shadow-sm" style={{ fontSize: 19 }}>
          {heading(page.ts, dayKey(Date.now()))}
        </span>
        <span className="mt-0.5 flex items-center gap-1">
          <span className="font-phone-body text-[7px] uppercase tracking-[0.14em] text-clutch-chocolate/55">{dateStamp(page.ts)}</span>
          <PhaseChip phase={phase} size="sm" />
        </span>
      </div>

      {/* LEFT page — meals */}
      <PageColumn title="meals" accent={meta.color} style={{ left: "8%", top: "20%", width: "37%", bottom: "16%" }}>
        {foods.map((f) => <MealRow key={f.id} entry={f} />)}
        {page.isToday && <GhostAdd label="add a meal…" onClick={() => onAdd("food")} />}
        {!page.isToday && foods.length === 0 && (
          <li className="py-0.5 font-phone-display text-[9px] italic text-clutch-chocolate/35">nothing here.</li>
        )}
      </PageColumn>

      {/* RIGHT page — medication */}
      <PageColumn title="meds" accent={meta.color} style={{ right: "8%", top: "20%", width: "37%", bottom: "16%" }}>
        {meds.map((m) => <MedRow key={m.id} entry={m} />)}
        {page.isToday && <GhostAdd label="add a med…" onClick={() => onAdd("med")} />}
        {!page.isToday && meds.length === 0 && (
          <li className="py-0.5 font-phone-display text-[9px] italic text-clutch-chocolate/35">none taken.</li>
        )}
      </PageColumn>
    </>
  );
}

export default function BookView({ state, onAdd }: { state: ClutchState; onAdd: (t: AddTab) => void }) {
  const todayKey = dayKey(Date.now());

  const pages = useMemo<DayPage[]>(() => {
    const buckets = new Map<string, DayPage>();
    buckets.set(todayKey, { key: todayKey, ts: Date.now(), foods: [], meds: [], isToday: true });
    for (const log of state.logs as LogEntry[]) {
      const k = dayKey(log.ts);
      let b = buckets.get(k);
      if (!b) {
        b = { key: k, ts: log.ts, foods: [], meds: [], isToday: k === todayKey };
        buckets.set(k, b);
      }
      if (log.ts < b.ts && !b.isToday) b.ts = log.ts;
      if (log.kind === "food") b.foods.push(log);
      else b.meds.push(log);
    }
    return Array.from(buckets.values()).sort((a, b) => b.ts - a.ts);
  }, [state.logs, todayKey]);

  const [idx, setIdx] = useState(0);
  const clamped = Math.min(idx, pages.length - 1);
  const page = pages[clamped];

  // grab the page and drag sideways — it turns like a real page, hinged at the
  // spine, following your cursor. release past the fold to commit the flip.
  const ry = useMotionValue(0); // rotateY of the top page
  const shade = useTransform(ry, [-180, 0, 180], [0.45, 0, 0.45]);
  const drag = useRef<{ x: number; y: number; active: boolean; engaged: boolean } | null>(null);
  const animating = useRef(false);

  const canNewer = clamped > 0; // toward today — drag right
  const canOlder = clamped < pages.length - 1; // back in time — drag left

  const onDown = (e: React.PointerEvent) => {
    if (animating.current) return;
    drag.current = { x: e.clientX, y: e.clientY, active: true, engaged: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d?.active) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.engaged) {
      if (Math.abs(dx) < 10) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        d.active = false; // it's a vertical scroll, not a page turn
        return;
      }
      d.engaged = true;
    }
    let r = dx * 0.6;
    if (r < 0 && !canOlder) r = Math.max(r, -22); // resistance at the last page
    if (r > 0 && !canNewer) r = Math.min(r, 22);
    ry.set(Math.max(-180, Math.min(180, r)));
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.engaged) return;
    const dx = e.clientX - d.x;
    const finish = (to: number, commit: () => void) => {
      animating.current = true;
      animate(ry, to, { duration: 0.3, ease: [0.4, 0, 0.2, 1] }).then(() => {
        commit();
        ry.set(0);
        animating.current = false;
      });
    };
    if (dx < -70 && canOlder) finish(-180, () => setIdx(clamped + 1));
    else if (dx > 70 && canNewer) finish(180, () => setIdx(clamped - 1));
    else animate(ry, 0, { type: "spring", stiffness: 280, damping: 26 });
  };

  return (
    <div
      className="relative rounded-2xl border border-clutch-ink/10 px-3 pb-4 pt-4 shadow-inner"
      style={{ backgroundImage: "url(/images/journal/stripes.png)", backgroundSize: "100% auto", backgroundRepeat: "repeat-y" }}
    >
      <div className="relative mx-auto w-full max-w-[420px]" style={{ perspective: 1700 }}>
        <div className="relative w-full" style={{ aspectRatio: "684 / 528" }}>
          {/* thick page block behind the top page */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-md"
              style={{
                transform: `translateY(${(i + 1) * 2.2}px)`,
                background: i % 2 ? "#F2E9D6" : "#E8DCC2",
                boxShadow: "inset 0 -1px 0 rgba(150,120,80,0.18)",
                zIndex: 0,
              }}
            />
          ))}

          {/* the top page — grab + drag to turn */}
          <motion.div
            key={page.key}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            style={{
              rotateY: ry,
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backgroundImage: "url(/images/journal/open-book.png)",
              backgroundSize: "100% 100%",
              touchAction: "pan-y",
            }}
            className="absolute inset-0 z-10 cursor-grab select-none rounded-md shadow-[0_6px_18px_rgba(120,90,70,0.28)] active:cursor-grabbing"
          >
            {/* underside shade as the page turns */}
            <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-md bg-[#3a2a30]" style={{ opacity: shade }} />
            {/* center spine shadow */}
            <div aria-hidden className="pointer-events-none absolute inset-y-[8%] left-1/2 w-6 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(80,50,40,0.16),transparent_70%)]" />
            <Spread page={page} cycleStartISO={state.cycleStartISO} onAdd={onAdd} />

            {/* dog-ear corner — the grab hint */}
            {(canOlder || canNewer) && (
              <div aria-hidden className="pointer-events-none absolute bottom-1.5 right-1.5 h-7 w-7">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 50%, rgba(214,51,108,0.18) 50%)", borderBottomRightRadius: 6 }} />
                <div className="absolute bottom-0 right-0 h-4 w-4" style={{ background: "linear-gradient(135deg, #FBEFE6, #EAD9C6)", clipPath: "polygon(100% 0, 0 100%, 100% 100%)", boxShadow: "-1px -1px 2px rgba(0,0,0,0.12)" }} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
