"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneMockup from "./PhoneMockup";
import { PixelHeart, FourPointStar } from "./decorations";

export type ScreenId = "home" | "community" | "share";

export type FeatureId = "home" | "community" | "share";

export const FEATURE_TO_SCREEN: Record<FeatureId, ScreenId> = {
  home: "home",
  community: "community",
  share: "share",
};

const CYCLE: ScreenId[] = ["home", "community", "share"];

const CAPTIONS: Record<ScreenId, string> = {
  home: "01 · the home feed.",
  community: "02 · the community tab.",
  share: "03 · the share.",
};

function ScreenWrap({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex h-full flex-col gap-2 p-3"
    >
      {children}
    </motion.div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 border border-clutch-ink/50 bg-white/80 px-1.5 py-0.5 font-phone-body text-[8px] uppercase tracking-[0.16em] text-clutch-ink">
      {children}
    </span>
  );
}

function TamponIcon() {
  return (
    <svg width="7" height="10" viewBox="0 0 7 10" aria-hidden>
      <rect x="1.4" y="0.5" width="4.2" height="6" rx="0.7" fill="#FFFFFF" stroke="#1B1B1B" strokeWidth="0.6" />
      <line x1="3.5" y1="2" x2="3.5" y2="5" stroke="#F4C9D6" strokeWidth="0.5" />
      <line x1="3.5" y1="6.5" x2="3.5" y2="9.5" stroke="#1B1B1B" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}

function PadIcon() {
  return (
    <svg width="11" height="6" viewBox="0 0 11 6" aria-hidden>
      <rect x="1.2" y="0.8" width="8.6" height="4.4" rx="2.2" fill="#FFFFFF" stroke="#1B1B1B" strokeWidth="0.6" />
      <rect x="3" y="2.5" width="5" height="1" rx="0.5" fill="#F4C9D6" />
    </svg>
  );
}

function AdvilIcon() {
  return (
    <svg width="11" height="6" viewBox="0 0 11 6" aria-hidden>
      <defs>
        <clipPath id="clutch-advil-pill">
          <rect x="1" y="1" width="9" height="4" rx="2" />
        </clipPath>
      </defs>
      <g clipPath="url(#clutch-advil-pill)">
        <rect x="1" y="1" width="4.5" height="4" fill="#D6336C" />
        <rect x="5.5" y="1" width="5" height="4" fill="#FFFFFF" />
      </g>
      <rect x="1" y="1" width="9" height="4" rx="2" fill="none" stroke="#1B1B1B" strokeWidth="0.6" />
    </svg>
  );
}

function AvatarBubble({ name, bg }: { name: string; bg: string }) {
  return (
    <span
      className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-clutch-ink/60 font-phone-display text-[10px] italic text-clutch-ink"
      style={{ backgroundColor: bg }}
    >
      {name}
    </span>
  );
}

function HomeScreen() {
  return (
    <ScreenWrap>
      <div className="flex items-center justify-between font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-chocolate/70">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <PixelHeart size={7} className="heart-pulse" />
          you
        </span>
      </div>

      <p className="font-pinyon text-clutch-hot" style={{ fontSize: 30, lineHeight: 0.9 }}>
        hi, navi.
      </p>
      <p className="font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-chocolate/80">
        day 14 · ovulating
      </p>

      <div className="flex items-center gap-px">
        {Array.from({ length: 28 }).map((_, i) => {
          const today = i === 13;
          const past = i < 13;
          const period = i < 4;
          const bg = period
            ? "#D6336C"
            : today
              ? "#EB6E9E"
              : past
                ? "rgba(214,51,108,0.25)"
                : "rgba(74,42,26,0.15)";
          return (
            <span
              key={i}
              className="h-[3px] flex-1 rounded-full"
              style={{
                backgroundColor: bg,
                transform: today ? "scaleY(2)" : undefined,
              }}
            />
          );
        })}
      </div>

      <div className="rounded border border-clutch-ink/40 bg-white p-2">
        <div
          className="halftone mb-1.5 h-12 w-full rounded-sm border border-clutch-ink/30 opacity-70"
          style={{ backgroundColor: "#F4C9D6" }}
        />
        <p className="font-pinyon text-clutch-hot" style={{ fontSize: 18, lineHeight: 1 }}>
          today&apos;s fit
        </p>
        <p className="font-phone-body italic text-[8px] text-clutch-chocolate/85">
          lace cami + raw denim
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded border border-clutch-ink/30 bg-clutch-paper p-1.5">
          <span aria-hidden className="halftone-pink mb-1 block h-5 w-full rounded-sm opacity-60" />
          <p className="font-phone-body italic text-[8px] text-clutch-ink">miso udon</p>
        </div>
        <div className="rounded border border-clutch-ink/30 bg-clutch-dusty/50 p-1.5">
          <span aria-hidden className="halftone mb-1 block h-5 w-full rounded-sm opacity-60" />
          <p className="font-phone-body italic text-[8px] text-clutch-ink">20 min pilates</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-clutch-ink/30 pt-1.5 text-[8px] uppercase tracking-[0.14em] text-clutch-ink/70">
        <span className="flex items-center gap-0.5 text-clutch-hot">
          <PixelHeart size={7} color="#D6336C" /> home
        </span>
        <span>share</span>
        <span>chat</span>
      </div>
    </ScreenWrap>
  );
}

function CommunityScreen() {
  return (
    <ScreenWrap>
      <div className="flex items-center justify-between font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-chocolate/70">
        <span>community</span>
        <span className="text-clutch-hot">2 new</span>
      </div>

      <p className="font-pinyon text-clutch-hot" style={{ fontSize: 28, lineHeight: 0.9 }}>
        your room
      </p>

      <div className="flex gap-1.5">
        <AvatarBubble name="ava" bg="#F4C9D6" />
        <AvatarBubble name="sof" bg="#FBE9DD" />
        <AvatarBubble name="em" bg="#C9D6E2" />
        <AvatarBubble name="ju" bg="#FAE0D2" />
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-softpink/45 p-2">
        <p className="font-phone-body text-[9px] font-bold text-clutch-ink">ava · 2m</p>
        <p className="font-phone-display italic text-clutch-chocolate" style={{ fontSize: 9, lineHeight: 1.2 }}>
          &ldquo;haul today ♥&rdquo;
        </p>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-paper p-2">
        <p className="font-phone-body text-[9px] font-bold text-clutch-ink">sophie · 5m</p>
        <p className="font-phone-body text-[8px] text-clutch-chocolate/85">matcha after lab?</p>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-dusty/50 p-2">
        <p className="font-phone-body text-[9px] font-bold text-clutch-ink">em · 12m</p>
        <p className="font-phone-body text-[8px] text-clutch-chocolate/85">i made the udon!!</p>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-clutch-ink/30 pt-1.5 text-[8px] uppercase tracking-[0.14em] text-clutch-ink/70">
        <span>home</span>
        <span className="flex items-center gap-0.5 text-clutch-hot">
          <PixelHeart size={7} color="#D6336C" /> chat
        </span>
        <span>share</span>
      </div>
    </ScreenWrap>
  );
}

function ShareScreen() {
  return (
    <ScreenWrap>
      <div className="flex items-center justify-between font-phone-body text-[8px] uppercase tracking-[0.18em] text-clutch-chocolate/70">
        <span>atlanta · share</span>
        <span className="flex items-center gap-1">
          <PixelHeart size={7} className="heart-pulse" />
          you
        </span>
      </div>

      <p className="font-pinyon text-clutch-hot" style={{ fontSize: 26, lineHeight: 0.9 }}>
        girl, do you have...
      </p>

      <div className="flex flex-wrap gap-1">
        <Chip>
          <TamponIcon />
          tampon
        </Chip>
        <Chip>
          <PadIcon />
          pad
        </Chip>
        <Chip>
          <AdvilIcon />
          advil
        </Chip>
        <Chip>hairtie</Chip>
        <Chip>charger</Chip>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-softpink/50 p-2">
        <p className="font-phone-body text-[9px] font-bold text-clutch-ink">sophie has tampons.</p>
        <p className="font-phone-body text-[8px] text-clutch-chocolate/85">2 min walk · request →</p>
      </div>

      <div className="rounded border border-clutch-ink/40 bg-clutch-paper p-2">
        <p className="font-phone-body text-[9px] font-bold text-clutch-ink">ava just helped you.</p>
        <p className="font-phone-body text-[8px] text-clutch-chocolate/85">gave: 2 advil ✓</p>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-clutch-ink/30 pt-1.5 text-[8px] uppercase tracking-[0.14em] text-clutch-ink/70">
        <span>home</span>
        <span>chat</span>
        <span className="flex items-center gap-0.5 text-clutch-hot">
          <PixelHeart size={7} color="#D6336C" /> share
        </span>
      </div>
    </ScreenWrap>
  );
}

function PhoneSwap({ screen }: { screen: ScreenId }) {
  return (
    <PhoneMockup rotate={3.5} caption={CAPTIONS[screen]}>
      <AnimatePresence mode="wait">
        {screen === "home" ? <HomeScreen key="home" /> : null}
        {screen === "community" ? <CommunityScreen key="community" /> : null}
        {screen === "share" ? <ShareScreen key="share" /> : null}
      </AnimatePresence>
    </PhoneMockup>
  );
}

type PhoneAnimationProps = {
  activeFeature?: FeatureId | null;
};

export default function PhoneAnimation({ activeFeature = null }: PhoneAnimationProps) {
  const [screen, setScreen] = useState<ScreenId>("home");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (activeFeature) {
      setScreen(FEATURE_TO_SCREEN[activeFeature]);
      return;
    }

    intervalRef.current = setInterval(() => {
      setScreen((s) => CYCLE[(CYCLE.indexOf(s) + 1) % CYCLE.length]);
    }, 2500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeFeature]);

  return (
    <div className="relative flex justify-center">
      <FourPointStar
        size={22}
        color="#EB6E9E"
        className="sparkle-spin absolute -left-6 top-4"
      />
      <FourPointStar
        size={14}
        color="#D6336C"
        className="sparkle-spin absolute -right-4 top-16"
        style={{ animationDelay: "0.6s" }}
      />
      <PhoneSwap screen={screen} />
    </div>
  );
}
