"use client";

import { useMemo, useRef, useState } from "react";
import { CUISINES, CUISINE_BY_ID, type CuisineId } from "../../lib/cuisines";
import {
  addMed,
  logFood,
  removeMed,
  setDefaultCuisine,
  takeMed,
  toggleCalorieBar,
  updateFoodNutrition,
  type ClutchState,
  type FoodLog,
  type LogEntry,
  type MedSchedule,
  type MedType,
  type NutritionInfo,
} from "../../lib/store";
import { fileToDataURL } from "./shared";
import { foodInfo, SENTIMENT_COLOR } from "../../lib/foodInfo";
import { STATIC_NUTRITION, estimateNutrition } from "../../lib/nutrition";

type Tab = "food" | "med";

// ---- nutrition cache (localStorage-backed, avoids re-hitting Groq for known foods) ----

const CACHE_KEY = "clutch.nutrition.v1";
const nutritionCache = new Map<string, NutritionInfo>();
let cacheLoaded = false;

function loadCache() {
  if (cacheLoaded || typeof window === "undefined") return;
  cacheLoaded = true;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (raw) {
      const entries = JSON.parse(raw) as [string, NutritionInfo][];
      for (const [k, v] of entries) nutritionCache.set(k, v);
    }
  } catch {}
}

function saveCache() {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify([...nutritionCache.entries()]));
  } catch {}
}

// ---- ai helpers (server-routed, key never touches the client) ----------

async function fetchNutrition(item: string, id: string): Promise<void> {
  const key = item.trim().toLowerCase();

  // 1. Static table — instant, covers every chip food, zero API calls
  const staticData = STATIC_NUTRITION[key];
  if (staticData) {
    updateFoodNutrition(id, staticData);
    return;
  }

  // 2. localStorage cache — covers custom foods previously fetched via Groq
  loadCache();
  const cached = nutritionCache.get(key);
  if (cached) {
    updateFoodNutrition(id, cached);
    return;
  }

  // 3. Show local estimate immediately so the bar is never empty
  updateFoodNutrition(id, estimateNutrition(key));

  // 4. Try Groq in background — replaces estimate with accurate data if it succeeds (one attempt, no retry)
  try {
    const res = await fetch("/api/gemini/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    });
    if (!res.ok) return;
    const nutrition: NutritionInfo = await res.json();
    if (typeof nutrition.calories === "number" && nutrition.calories > 0) {
      nutritionCache.set(key, nutrition);
      saveCache();
      updateFoodNutrition(id, nutrition);
      console.log("[clutch/nutrition]", item, "→", nutrition.calories, "kcal (groq)");
    }
  } catch {
    // estimate stays — no action needed
  }
}

async function identifyPhoto(base64: string, mimeType: string): Promise<string> {
  try {
    const res = await fetch("/api/gemini/identify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64, mimeType }),
    });
    if (!res.ok) return "meal";
    const data = await res.json();
    return typeof data.item === "string" ? data.item : "meal";
  } catch {
    return "meal";
  }
}

function compressImage(
  dataURL: string,
  maxDim = 768,
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const out = canvas.toDataURL("image/jpeg", 0.85);
      const [header, data] = out.split(",");
      resolve({
        base64: data,
        mimeType: header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg",
      });
    };
    img.src = dataURL;
  });
}

export default function LogSheet({
  state,
  initialTab = "food",
  onClose,
}: {
  state: ClutchState;
  initialTab?: Tab;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [toast, setToast] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setSessionCount((c) => c + 1);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true">
      {/* scrim */}
      <button
        aria-label="close"
        onClick={onClose}
        className="animate-scrim-in absolute inset-0 bg-clutch-ink/35"
      />

      {/* sheet */}
      <div className="animate-sheet-up paper-grain relative max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border-t-2 border-clutch-hot pb-[max(env(safe-area-inset-bottom),16px)] shadow-[0_-8px_40px_rgba(214,51,108,0.18)]">
        <div className="mx-auto w-full max-w-md px-4 pt-3">
          {/* grabber */}
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-clutch-ink/15" />

          {/* tabs */}
          <div className="flex items-center gap-2">
            <SheetTab active={tab === "food"} onClick={() => setTab("food")} emoji="🍛">
              log food
            </SheetTab>
            <SheetTab active={tab === "med"} onClick={() => setTab("med")} emoji="💊">
              log med
            </SheetTab>
            <button
              onClick={onClose}
              className="ml-auto rounded-full px-2 py-1 font-phone-body text-[11px] text-clutch-chocolate/50 hover:text-clutch-hot"
            >
              done
            </button>
          </div>

          <div className="py-4">
            {tab === "food" ? (
              <FoodTab state={state} flash={flash} onClose={onClose} />
            ) : (
              <MedTab state={state} flash={flash} />
            )}
          </div>

          {sessionCount > 0 && (
            <p className="pb-3 text-center font-phone-body text-[10px] text-clutch-chocolate/55">
              {sessionCount} logged this session · auto-stamped to your phase
            </p>
          )}
        </div>

        {toast && (
          <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
            <span className="animate-fadeIn rounded-full bg-clutch-ink px-4 py-2 font-phone-body text-[11px] tracking-wide text-clutch-cream shadow-lg">
              {toast}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SheetTab({
  active,
  onClick,
  emoji,
  children,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 font-phone-body text-[11px] uppercase tracking-[0.1em] transition-all active:scale-95 ${
        active
          ? "border-clutch-hot bg-clutch-hot text-white"
          : "border-clutch-ink/15 bg-white/70 text-clutch-chocolate/70"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      {children}
    </button>
  );
}

// --- calorie bar ----------------------------------------------------------

function CalorieBar({
  logs,
  goal,
  pending = false,
  show,
}: {
  logs: LogEntry[];
  goal: number;
  pending?: boolean;
  show: boolean;
}) {
  const todayCalories = useMemo(() => {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return logs
      .filter((l): l is FoodLog => l.kind === "food" && l.ts >= start)
      .reduce((sum, l) => sum + (l.nutrition?.calories ?? 0), 0);
  }, [logs]);

  if (!show) {
    return (
      <button
        onClick={toggleCalorieBar}
        className="flex items-center gap-1.5 py-0.5 font-phone-body text-[9px] text-clutch-chocolate/30 hover:text-clutch-hot"
      >
        <span className="text-[10px]">◎</span> show calories
      </button>
    );
  }

  if (todayCalories === 0 && !pending) return null;

  if (todayCalories === 0 && pending) {
    return (
      <div className="rounded-xl border border-clutch-ink/10 bg-white/80 p-3">
        <div className="flex items-center justify-between">
          <span className="font-phone-body text-[10px] uppercase tracking-[0.14em] text-clutch-chocolate/55">
            today
          </span>
          <span className="font-phone-display text-[11px] italic text-clutch-chocolate/40">
            calculating nutrition…
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-clutch-ink/8">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-clutch-hot/30" />
        </div>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((todayCalories / goal) * 100));
  const remaining = goal - todayCalories;

  return (
    <div className="rounded-xl border border-clutch-ink/10 bg-white/80 p-3">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-phone-body text-[10px] uppercase tracking-[0.14em] text-clutch-chocolate/55">
          today
        </span>
        <span className="font-phone-display text-[13px] italic text-clutch-ink">
          {todayCalories}{" "}
          <span className="text-[10px] not-italic text-clutch-chocolate/45">/ {goal} kcal</span>
        </span>
        <button
          onClick={toggleCalorieBar}
          className="font-phone-body text-[8px] text-clutch-chocolate/25 hover:text-clutch-hot"
        >
          hide ×
        </button>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-clutch-ink/8">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#C97A2B" : "#D23669" }}
        />
      </div>
      <p className="mt-1 font-phone-body text-[8px] text-clutch-chocolate/40">
        {remaining > 0
          ? `${remaining} kcal remaining · mock goal`
          : "daily goal reached ✓"}
      </p>
    </div>
  );
}

// --- food -----------------------------------------------------------------

function FoodTab({
  state,
  flash,
  onClose,
}: {
  state: ClutchState;
  flash: (m: string) => void;
  onClose: () => void;
}) {
  const [activeCuisine, setActiveCuisine] = useState<CuisineId>(state.defaultCuisine);
  const [custom, setCustom] = useState("");
  const [identifying, setIdentifying] = useState(false);
  const [pendingNutrition, setPendingNutrition] = useState(0);
  const cameraRef = useRef<HTMLInputElement>(null);

  // default cuisine first, rest after — your wedge shows up top.
  const ordered = [
    CUISINE_BY_ID[state.defaultCuisine],
    ...CUISINES.filter((c) => c.id !== state.defaultCuisine),
  ];

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setIdentifying(true);
    const dataURL = await fileToDataURL(file);
    const { base64, mimeType } = await compressImage(dataURL);
    const identified = await identifyPhoto(base64, mimeType);
    const entry = logFood({ cuisine: activeCuisine, item: identified, photo: dataURL });
    fetchNutrition(identified, entry.id);
    setIdentifying(false);
    onClose();
  };

  const logChip = (item: string) => {
    const entry = logFood({ cuisine: activeCuisine, item });
    const info = foodInfo(item);
    flash(`clipped ✓ ${item} · ${info.nutrients.slice(0, 2).join(" + ")}`);
    setPendingNutrition((n) => n + 1);
    fetchNutrition(item, entry.id).finally(() =>
      setPendingNutrition((n) => Math.max(0, n - 1)),
    );
  };

  const logCustom = () => {
    const item = custom.trim();
    if (!item) return;
    const entry = logFood({ cuisine: "custom", item });
    const info = foodInfo(item);
    flash(`clipped ✓ ${item} · ${info.nutrients.slice(0, 2).join(" + ")}`);
    setPendingNutrition((n) => n + 1);
    fetchNutrition(item, entry.id).finally(() =>
      setPendingNutrition((n) => Math.max(0, n - 1)),
    );
    setCustom("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* calorie counter — shows loading skeleton immediately, fills once Gemini responds */}
      <CalorieBar logs={state.logs} goal={state.dailyCalorieGoal} pending={pendingNutrition > 0} show={state.showCalorieBar} />

      {/* snap a pic — gemini identifies it */}
      <button
        onClick={() => !identifying && cameraRef.current?.click()}
        disabled={identifying}
        className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-clutch-hot py-4 font-phone-display text-sm italic transition-transform ${
          identifying
            ? "bg-clutch-softpink/60 text-clutch-hot/70"
            : "bg-clutch-softpink/40 text-clutch-hot active:scale-[0.98]"
        }`}
      >
        <span className="text-xl">{identifying ? "⏳" : "📷"}</span>
        {identifying ? "identifying your meal…" : "snap a pic — ai identifies the food"}
      </button>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPhoto}
        className="hidden"
      />

      {/* cuisine pack selector */}
      <div>
        <p className="mb-2 font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/55">
          quick chips · your cuisine
        </p>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {ordered.map((c) => {
            const active = c.id === activeCuisine;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCuisine(c.id);
                  setDefaultCuisine(c.id);
                }}
                className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 font-phone-body text-[10px] lowercase tracking-wide transition-colors ${
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

        {/* chips = one tap each. dot = how it tends to play with your cycle. */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CUISINE_BY_ID[activeCuisine].items.map((item) => (
            <button
              key={item}
              onClick={() => logChip(item)}
              className="flex items-center gap-1.5 rounded-full border border-clutch-ink/15 bg-white px-3 py-1.5 font-phone-display text-[12px] italic text-clutch-ink transition-all hover:border-clutch-hot hover:text-clutch-hot active:scale-90"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: SENTIMENT_COLOR[foodInfo(item).sentiment] }}
              />
              {item}
            </button>
          ))}
        </div>
        <p className="mt-1.5 flex items-center gap-2 px-0.5 font-phone-body text-[8px] uppercase tracking-[0.12em] text-clutch-chocolate/45">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SENTIMENT_COLOR.good }} /> good rn
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SENTIMENT_COLOR.notice }} /> worth noticing
          </span>
        </p>
      </div>

      {/* search / custom */}
      <div>
        <p className="mb-2 font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/55">
          something else
        </p>
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && logCustom()}
            placeholder="type a food…"
            className="min-w-0 flex-1 rounded-full border border-clutch-ink/20 bg-white px-3.5 py-2 font-phone-display text-[13px] italic text-clutch-ink placeholder:not-italic placeholder:text-clutch-chocolate/40 focus:border-clutch-hot focus:outline-none"
          />
          <button
            onClick={logCustom}
            className="shrink-0 rounded-full bg-clutch-hot px-4 py-2 font-phone-body text-[11px] uppercase tracking-[0.1em] text-white active:scale-95"
          >
            log
          </button>
        </div>
      </div>
    </div>
  );
}

// --- meds ------------------------------------------------------------------

const MED_TYPES: { id: MedType; label: string }[] = [
  { id: "pill", label: "pill" },
  { id: "supplement", label: "supplement" },
  { id: "birth-control", label: "birth control" },
  { id: "prn", label: "as-needed" },
];

function MedTab({ state, flash }: { state: ClutchState; flash: (m: string) => void }) {
  const [adding, setAdding] = useState(state.meds.length === 0);

  return (
    <div className="flex flex-col gap-4">
      {/* your list — one tap to take */}
      {state.meds.length > 0 && (
        <div>
          <p className="mb-2 font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/55">
            from your list · one tap
          </p>
          <div className="flex flex-col gap-2">
            {state.meds.map((med) => (
              <div
                key={med.id}
                className="group flex items-center gap-3 rounded-xl border border-clutch-ink/12 bg-white/80 p-2.5"
              >
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg"
                  style={{ backgroundColor: med.isBirthControl ? "#E7D6EC" : "#FBE4D6" }}
                >
                  {med.isBirthControl ? "🌸" : "💊"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-phone-display text-[13px] italic text-clutch-ink">
                    {med.name}
                    {med.isBirthControl && (
                      <span className="ml-1.5 rounded-full bg-clutch-mauve/30 px-1.5 py-0.5 align-middle font-phone-body text-[8px] not-italic uppercase tracking-[0.1em] text-clutch-chocolate/70">
                        birth control
                      </span>
                    )}
                  </p>
                  <p className="font-phone-body text-[9px] text-clutch-chocolate/55">
                    {[med.dose, med.schedule.replace("-", " ")].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  onClick={() => removeMed(med.id)}
                  aria-label="remove med"
                  className="rounded-full px-1.5 py-1 font-phone-body text-[11px] text-clutch-chocolate/25 opacity-0 hover:text-clutch-hot group-hover:opacity-100"
                >
                  ✕
                </button>
                <button
                  onClick={() => {
                    takeMed(med.id);
                    flash(`taken ✓ ${med.name}`);
                  }}
                  className="shrink-0 rounded-full bg-clutch-hot px-3.5 py-2 font-phone-body text-[10px] uppercase tracking-[0.1em] text-white active:scale-95"
                >
                  take
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {adding ? (
        <AddMedForm
          onDone={() => setAdding(false)}
          showCancel={state.meds.length > 0}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-2xl border-2 border-dashed border-clutch-hot bg-clutch-softpink/30 py-3 font-phone-display text-sm italic text-clutch-hot active:scale-[0.98]"
        >
          + add a new med
        </button>
      )}
    </div>
  );
}

function AddMedForm({ onDone, showCancel }: { onDone: () => void; showCancel: boolean }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<MedType>("pill");
  const [dose, setDose] = useState("");
  const [schedule, setSchedule] = useState<MedSchedule>("daily");
  const [photo, setPhoto] = useState<string | undefined>();
  const photoRef = useRef<HTMLInputElement>(null);

  const onBottle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(await fileToDataURL(file));
    e.target.value = "";
  };

  const save = () => {
    if (!name.trim()) return;
    addMed({
      name,
      type,
      dose,
      schedule: type === "prn" ? "as-needed" : schedule,
      isBirthControl: type === "birth-control",
      photo,
    });
    onDone();
  };

  return (
    <div className="rounded-2xl border border-clutch-ink/15 bg-white/80 p-3">
      <p className="mb-2 font-phone-body text-[10px] uppercase tracking-[0.16em] text-clutch-chocolate/55">
        build it once, tap it daily
      </p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name (e.g. iron, the pill, advil)"
        className="w-full rounded-lg border border-clutch-ink/20 bg-white px-3 py-2 font-phone-display text-[13px] italic text-clutch-ink placeholder:not-italic placeholder:text-clutch-chocolate/40 focus:border-clutch-hot focus:outline-none"
      />

      <div className="mt-2 flex flex-wrap gap-1.5">
        {MED_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`rounded-full border px-2.5 py-1 font-phone-body text-[10px] lowercase transition-colors ${
              type === t.id
                ? "border-clutch-hot bg-clutch-hot/10 text-clutch-hot"
                : "border-clutch-ink/15 bg-white text-clutch-chocolate/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          value={dose}
          onChange={(e) => setDose(e.target.value)}
          placeholder="dose (optional)"
          className="min-w-0 flex-1 rounded-lg border border-clutch-ink/20 bg-white px-3 py-2 font-phone-body text-[12px] text-clutch-ink placeholder:text-clutch-chocolate/40 focus:border-clutch-hot focus:outline-none"
        />
        <select
          value={type === "prn" ? "as-needed" : schedule}
          disabled={type === "prn"}
          onChange={(e) => setSchedule(e.target.value as MedSchedule)}
          className="rounded-lg border border-clutch-ink/20 bg-white px-2 py-2 font-phone-body text-[11px] text-clutch-chocolate disabled:opacity-50"
        >
          <option value="daily">daily</option>
          <option value="specific-days">specific days</option>
          <option value="as-needed">as needed</option>
        </select>
      </div>

      {/* bottle photo — low-effort way to remember name/dose */}
      <button
        onClick={() => photoRef.current?.click()}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-clutch-ink/25 bg-white/60 py-2 font-phone-body text-[10px] text-clutch-chocolate/60"
      >
        {photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="bottle" className="h-6 w-6 rounded object-cover" /> photo
            added
          </>
        ) : (
          <>📷 snap the bottle (optional)</>
        )}
      </button>
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onBottle}
        className="hidden"
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={save}
          disabled={!name.trim()}
          className="flex-1 rounded-full bg-clutch-hot px-4 py-2 font-phone-body text-[11px] uppercase tracking-[0.1em] text-white active:scale-95 disabled:opacity-50"
        >
          save med
        </button>
        {showCancel && (
          <button
            onClick={onDone}
            className="rounded-full border border-clutch-ink/20 px-4 py-2 font-phone-body text-[11px] uppercase tracking-[0.1em] text-clutch-chocolate/60"
          >
            cancel
          </button>
        )}
      </div>
    </div>
  );
}
