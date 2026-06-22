"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hydrate, useClutch, dismissSavePrompt } from "./lib/store";
import { computePattern } from "./lib/patterns";
import CycleHeader from "./components/app/CycleHeader";
import LogFeed from "./components/app/LogFeed";
import PatternCard from "./components/app/PatternCard";
import LogSheet from "./components/app/LogSheet";
import { FourPointStar, PixelHeart } from "./components/phone/decorations";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const state = useClutch();

  // hydrate guest data after mount — keeps SSR + first paint stable.
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="paper-grain grid min-h-[100dvh] place-items-center">
        <p className="font-pinyon text-clutch-hot" style={{ fontSize: 48 }}>
          clutch
        </p>
      </main>
    );
  }

  const pattern = computePattern(state);
  const showSavePrompt =
    state.logs.length >= 2 && !state.savePromptDismissed;

  return (
    <main className="paper-grain min-h-[100dvh] w-full">
      {/* thin orientation — so a total stranger landing here gets it */}
      <div className="border-b border-clutch-ink/10 bg-white/55 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-2 px-4 py-2">
          <p className="font-phone-body text-[10px] leading-tight text-clutch-chocolate/75">
            <span className="font-phone-display text-[12px] italic text-clutch-hot">
              clutch
            </span>{" "}
            · log your food + meds, we connect the dots to your cycle.
          </p>
          <Link
            href="/landing"
            className="shrink-0 font-phone-body text-[9px] uppercase tracking-[0.12em] text-clutch-hot underline-offset-2 hover:underline"
          >
            what&apos;s this?
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 pb-32 pt-5">
        <CycleHeader cycleStartISO={state.cycleStartISO} />

        {/* the connect — pattern card, once there's enough data */}
        {pattern && (
          <section className="mt-5">
            <PatternCard
              card={pattern}
              saved={state.savedPatternIds.includes(pattern.id)}
            />
          </section>
        )}

        {/* the log */}
        <section className="mt-6">
          <div className="mb-2.5 flex items-baseline justify-between px-1">
            <h2 className="font-pinyon text-clutch-hot" style={{ fontSize: 24 }}>
              your log
            </h2>
            {state.logs.length > 0 && (
              <span className="font-phone-body text-[9px] uppercase tracking-[0.14em] text-clutch-chocolate/50">
                {state.logs.length} {state.logs.length === 1 ? "entry" : "entries"}
              </span>
            )}
          </div>

          {state.logs.length === 0 ? (
            <button
              onClick={() => setSheetOpen(true)}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-clutch-hot/50 bg-white/50 px-6 py-10 text-center transition-transform active:scale-[0.98]"
            >
              <FourPointStar size={26} color="#EB6E9E" className="sparkle-spin" />
              <p className="font-phone-display text-sm italic text-clutch-ink">
                nothing logged yet
              </p>
              <p className="font-phone-body text-[11px] text-clutch-chocolate/65">
                tap the ★ to log your first meal — takes 5 seconds, no account.
              </p>
            </button>
          ) : (
            <LogFeed logs={state.logs} />
          )}
        </section>

        {/* soft save prompt — after the dopamine, never before */}
        {showSavePrompt && (
          <div className="animate-card-pop mt-6 flex items-center gap-3 rounded-2xl border-2 border-clutch-hot bg-clutch-softpink/40 p-3.5">
            <PixelHeart size={16} className="heart-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-phone-display text-[13px] italic text-clutch-ink">
                loving this?
              </p>
              <p className="font-phone-body text-[10px] text-clutch-chocolate/70">
                save your log so it&apos;s still here tomorrow.
              </p>
            </div>
            <Link
              href="/access"
              className="shrink-0 rounded-full bg-clutch-hot px-3.5 py-2 font-phone-body text-[10px] uppercase tracking-[0.1em] text-white active:scale-95"
            >
              save →
            </Link>
            <button
              onClick={dismissSavePrompt}
              aria-label="dismiss"
              className="shrink-0 font-phone-body text-[11px] text-clutch-chocolate/40 hover:text-clutch-hot"
            >
              ✕
            </button>
          </div>
        )}

        {/* quiet disclaimer footer */}
        <p className="mt-8 px-2 text-center font-phone-body text-[9px] leading-relaxed text-clutch-chocolate/45">
          clutch surfaces patterns to help you notice — it&apos;s not a medical
          device and doesn&apos;t diagnose. for anything that feels off, talk to a
          doctor.
        </p>
      </div>

      {/* the "+" — rose, star */}
      {!sheetOpen && (
        <button
          onClick={() => setSheetOpen(true)}
          aria-label="log food or meds"
          className="fab-star fixed bottom-6 right-[max(1.5rem,calc(50%-13rem))] z-40 grid h-16 w-16 place-items-center rounded-full shadow-[0_8px_24px_rgba(214,51,108,0.45)] transition-transform active:scale-90"
          style={{
            background: "radial-gradient(circle at 35% 30%, #FF8FB4, #D6336C 75%)",
          }}
        >
          <FourPointStar size={30} color="#FFFFFF" />
          <span className="absolute bottom-1 right-1.5 font-phone-body text-[13px] font-bold text-white">
            +
          </span>
        </button>
      )}

      {sheetOpen && (
        <LogSheet state={state} onClose={() => setSheetOpen(false)} />
      )}
    </main>
  );
}
