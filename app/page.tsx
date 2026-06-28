"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { hydrate, useClutch, dismissSavePrompt, setJournalColor, setUserName } from "./lib/store";
import { computePattern } from "./lib/patterns";
import dynamic from "next/dynamic";
import CycleHeader from "./components/app/CycleHeader";
// react-pageflip is client-only (touches the DOM) — load after hydration.
const BookView = dynamic(() => import("./components/app/BookView"), { ssr: false });
import PatternCard from "./components/app/PatternCard";
import LogSheet from "./components/app/LogSheet";
import JournalCover from "./components/app/JournalCover";
import { FourPointStar } from "./components/phone/decorations";

function NamePrompt({ initial = "" }: { initial?: string }) {
  const [name, setName] = useState(initial);

  const submit = () => setUserName(name);

  return (
    <motion.div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-clutch-cream/93 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
    >
      <div className="w-full max-w-[280px] px-2 text-center">
        <p className="font-grotesk font-bold lowercase leading-none tracking-tight text-clutch-ink" style={{ fontSize: 44 }}>
          hi, you.
        </p>
        <p className="mt-3 font-phone-body text-[10px] font-bold uppercase tracking-[0.18em] text-clutch-chocolate/60">
          what should we call you?
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="YOUR NAME"
          autoFocus
          className="riso-edge mt-4 w-full border-2 border-clutch-ink bg-white px-4 py-2.5 text-center font-phone-body text-[13px] uppercase tracking-wide text-clutch-ink placeholder:text-clutch-chocolate/30 focus:outline-none"
        />
        <button
          onClick={submit}
          className="riso-edge mt-4 w-full border-2 border-clutch-ink bg-pink px-5 py-2.5 font-phone-body text-[11px] font-bold uppercase tracking-[0.12em] text-clutch-cream transition-transform active:scale-95"
        >
          {name.trim() ? "that's me →" : "skip →"}
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
      <main className="bg-cream-grain grid min-h-[100dvh] place-items-center">
        <p className="font-pinyon text-clutch-hot" style={{ fontSize: 56 }}>
          clutch
        </p>
      </main>
    );
  }

  const pattern = computePattern(state);
  const showSavePrompt =
    state.logs.length >= 2 && !state.savePromptDismissed;

  return (
    <main className="bg-cream-grain min-h-[100dvh] w-full">
      {/* name prompt — shown FIRST, before the journal can be opened */}
      <AnimatePresence>
        {!state.namePromptDone && (
          <NamePrompt initial={state.userName} />
        )}
      </AnimatePresence>

      {/* the closed journal — light frame, the cover fills it. tap to flip open */}
      {!opened && (
        <div
          className="bg-cream-grain fixed inset-0 z-[70] flex items-center justify-center p-3"
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
            className="relative z-10 w-full max-w-[380px] cursor-pointer outline-none"
          >
            <JournalCover colorId={state.journalColor} onPickColor={setJournalColor} />
          </motion.div>
        </div>
      )}

      {/* riso ticker strip */}
      <div className="border-b-2 border-clutch-ink bg-pink">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-2 px-4 py-1.5">
          <p className="truncate font-phone-body text-[9px] font-bold uppercase tracking-[0.12em] text-clutch-cream">
            clutch · food + meds → cycle dots
          </p>
          <Link
            href="/landing-page"
            className="shrink-0 font-phone-body text-[9px] font-bold uppercase tracking-[0.12em] text-clutch-cream underline underline-offset-2"
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
        <section className="mt-6">
          <div className="mb-2 flex items-baseline justify-between px-0.5">
            <h2 className="font-grotesk font-bold lowercase leading-none tracking-tight text-clutch-ink" style={{ fontSize: 26 }}>
              your diary
            </h2>
            <span className="font-phone-body text-[8px] uppercase tracking-[0.16em] text-clutch-chocolate/45">
              [ tap to flip ]
            </span>
          </div>

          <BookView state={state} onAdd={openSheet} />
        </section>

        {/* save prompt — riso */}
        {showSavePrompt && (
          <div className="animate-card-pop bg-riso-pink riso-edge relative mt-7 overflow-hidden border-2 border-clutch-ink p-3.5">
            <div aria-hidden className="grain pointer-events-none absolute inset-0" />
            <div className="relative flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-grotesk text-[15px] font-bold lowercase leading-none text-clutch-cream">
                  loving this?
                </p>
                <p className="mt-1 font-phone-body text-[9px] uppercase tracking-[0.1em] text-clutch-cream/85">
                  save your log so it&apos;s here tomorrow
                </p>
              </div>
              <Link
                href="/access"
                className="riso-edge shrink-0 border-2 border-clutch-ink bg-acid px-3 py-1.5 font-phone-body text-[10px] font-bold uppercase tracking-[0.1em] text-clutch-ink active:scale-95"
              >
                save →
              </Link>
              <button
                onClick={dismissSavePrompt}
                aria-label="dismiss"
                className="shrink-0 font-phone-body text-[12px] text-clutch-cream/70 hover:text-clutch-cream"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* disclaimer */}
        <p className="mt-8 px-2 text-center font-phone-body text-[8px] uppercase leading-relaxed tracking-[0.12em] text-clutch-chocolate/45">
          clutch surfaces patterns — not a medical device, doesn&apos;t diagnose.
          anything off, talk to a doctor.
        </p>
      </div>

      {/* the "+" — flat riso star sticker */}
      {!sheetOpen && (
        <button
          onClick={() => openSheet("food")}
          aria-label="log food or meds"
          className="riso-edge fixed bottom-6 right-[max(1.25rem,calc(50%-13rem))] z-40 grid h-14 w-14 place-items-center border-2 border-clutch-ink bg-pink transition-transform active:scale-90"
        >
          <FourPointStar size={26} color="#FBF6EC" />
          <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center border-2 border-clutch-ink bg-acid font-phone-body text-[12px] font-bold text-clutch-ink">
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
