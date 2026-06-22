"use client";

import type { ReactNode } from "react";
import { PHASES, type Phase } from "../../lib/cycle";

/** read a picked photo into a dataURL so guest mode can store it locally. */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

/** glance chip — phase label tinted by phase color. ovulation shimmers. */
export function PhaseChip({
  phase,
  size = "md",
}: {
  phase: Phase;
  size?: "sm" | "md";
}) {
  const meta = PHASES[phase];
  const isOv = phase === "ovulation";
  return (
    <span
      className={`relative inline-flex items-center gap-1 overflow-hidden rounded-full border font-phone-body uppercase tracking-[0.14em] ${
        size === "sm" ? "px-2 py-0.5 text-[8px]" : "px-2.5 py-1 text-[9px]"
      }`}
      style={{
        color: meta.color,
        borderColor: meta.color,
        backgroundColor: meta.soft,
      }}
    >
      {isOv && (
        <span aria-hidden className="shimmer-gold pointer-events-none absolute inset-0" />
      )}
      <span
        aria-hidden
        className="relative h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      <span className="relative">{meta.label}</span>
    </span>
  );
}

/** zine-y card frame with a ribbon tab, reused across the feed. */
export function RibbonCard({
  children,
  className = "",
  accent = "#D23669",
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`relative rounded-xl border-2 bg-white ${className}`}
      style={{ borderColor: accent }}
    >
      {children}
    </div>
  );
}
