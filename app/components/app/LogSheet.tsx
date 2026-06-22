"use client";

import { useRef, useState } from "react";
import { CUISINES, CUISINE_BY_ID, type CuisineId } from "../../lib/cuisines";
import {
  addMed,
  logFood,
  removeMed,
  setDefaultCuisine,
  takeMed,
  type ClutchState,
  type MedSchedule,
  type MedType,
} from "../../lib/store";
import { fileToDataURL } from "./shared";

type Tab = "food" | "med";

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
  const cameraRef = useRef<HTMLInputElement>(null);

  // default cuisine first, rest after — your wedge shows up top.
  const ordered = [
    CUISINE_BY_ID[state.defaultCuisine],
    ...CUISINES.filter((c) => c.id !== state.defaultCuisine),
  ];

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const photo = await fileToDataURL(file);
    logFood({ cuisine: activeCuisine, item: "meal 📸", photo });
    e.target.value = "";
    onClose(); // the photo is the log — done.
  };

  const logChip = (item: string) => {
    logFood({ cuisine: activeCuisine, item });
    flash(`logged ✓ ${item}`);
  };

  const logCustom = () => {
    const item = custom.trim();
    if (!item) return;
    logFood({ cuisine: "custom", item });
    flash(`logged ✓ ${item}`);
    setCustom("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* snap a pic — default, fastest */}
      <button
        onClick={() => cameraRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-clutch-hot bg-clutch-softpink/40 py-4 font-phone-display text-sm italic text-clutch-hot transition-transform active:scale-[0.98]"
      >
        <span className="text-xl">📷</span> snap a pic — the photo&apos;s the log
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

        {/* chips = one tap each */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CUISINE_BY_ID[activeCuisine].items.map((item) => (
            <button
              key={item}
              onClick={() => logChip(item)}
              className="rounded-full border border-clutch-ink/15 bg-white px-3 py-1.5 font-phone-display text-[12px] italic text-clutch-ink transition-all hover:border-clutch-hot hover:text-clutch-hot active:scale-90"
            >
              {item}
            </button>
          ))}
        </div>
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
