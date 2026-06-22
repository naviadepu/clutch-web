"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { hydrate, useClutch, dismissSavePrompt, setJournalColor, setUserName } from "./lib/store";
import { computePattern } from "./lib/patterns";
import CycleHeader from "./components/app/CycleHeader";
import BookView from "./components/app/BookView";
import PatternCard from "./components/app/PatternCard";
import LogSheet from "./components/app/LogSheet";
import JournalCover from "./components/app/JournalCover";
import { FourPointStar, PixelHeart } from "./components/phone/decorations";
import { Bow } from "./components/app/scrapbook";

function NamePrompt() {
  const [name, setName] = useState("");

  const submit = () => setUserName(name);

  return (
    <motion.div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-clutch-cream/93 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
    >
      <div className="w-full max-w-[280px] px-2 text-center">
        <p className="font-pinyon text-clutch-hot" style={{ fontSize: 46, lineHeight: 0.9 }}>
          hi, you.
        </p>
        <p className="mt-3 font-phone-body text-[10px] uppercase tracking-[0.18em] text-clutch-chocolate/55">
          what should we call you?
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="your name…"
          autoFocus
          className="mt-4 w-full rounded-full border border-clutch-ink/20 bg-white px-4 py-2.5 text-center font-phone-display text-[14px] italic text-clutch-ink placeholder:not-italic placeholder:text-clutch-chocolate/35 focus:border-clutch-hot focus:outline-none"
        />
        <button
          onClick={submit}
          className="mt-3 w-full rounded-full bg-clutch-hot px-5 py-2.5 font-phone-body text-[11px] uppercase tracking-[0.12em] text-white transition-transform active:scale-95"
        >
          {name.trim() ? `that's me ✓` : "skip →"}
        </button>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<"food" | "med">("food");
  const state = useClutch();

  // hydrate guest data after mount — keeps SSR + first paint stable.
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, []);

  const openSheet = (tab: "food" | "med") => {
    setSheetTab(tab);
    setSheetOpen(true);
  };

  if (!mounted) {
    return (
      <main className="bg-desk grid min-h-[100dvh] place-items-center">
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
    <main className="bg-desk min-h-[100dvh] w-full">
      {/* name prompt — shown once after the journal first flips open */}
      <AnimatePresence>
        {opened && !state.namePromptDone && (
          <NamePrompt />
        )}
      </AnimatePresence>

      {/* the closed journal — tap to flip open into your diary */}
      {!opened && (
        <div
          className="bg-desk fixed inset-0 z-[70] flex items-center justify-center p-6"
          style={{ perspective: 1500 }}
        >
          <motion.div
            role="button"
            tabIndex={0}
            onClick={() => !flipping && setFlipping(true)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !flipping) setFlipping(true);
            }}
            initial={{ rotateY: 0, opacity: 1 }}
            animate={flipping ? { rotateY: -162, opacity: 0, x: -28 } : { rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.95, ease: [0.36, 0, 0.22, 1] }}
            onAnimationComplete={() => flipping && setOpened(true)}
            style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
            aria-label="open journal to log"
            className="relative cursor-pointer outline-none"
          >
            <JournalCover colorId={state.journalColor} onPickColor={setJournalColor} />
          </motion.div>
        </div>
      )}

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
        <CycleHeader state={state} />

        {/* the connect — pattern card, once there's enough data */}
        {pattern && (
          <section className="mt-5">
            <PatternCard
              card={pattern}
              saved={state.savedPatternIds.includes(pattern.id)}
            />
          </section>
        )}

        {/* the diary — a page per day */}
        <section className="mt-7">
          <div className="mb-1 flex items-baseline gap-2 px-1">
            <h2 className="font-pinyon text-clutch-hot" style={{ fontSize: 30, lineHeight: 0.9 }}>
              your diary
            </h2>
            <span className="font-phone-body text-[9px] uppercase tracking-[0.16em] text-clutch-chocolate/45">
              flip through your days
            </span>
          </div>

          <BookView state={state} onAdd={openSheet} />
        </section>

        {/* soft save prompt — after the dopamine, never before */}
        {showSavePrompt && (
          <div className="animate-card-pop relative mt-7 flex items-center gap-3 rounded-2xl border-2 border-clutch-hot bg-clutch-softpink/40 p-3.5">
            <Bow size={28} className="absolute -left-2 -top-3 z-10 -rotate-12" />
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
          onClick={() => openSheet("food")}
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
        <LogSheet
          state={state}
          initialTab={sheetTab}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </main>
  );
}
