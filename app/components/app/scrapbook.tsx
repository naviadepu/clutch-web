"use client";

import type { CSSProperties, ReactNode } from "react";

/** a strip of washi tape — translucent, faintly gingham, soft shadow. */
export function WashiTape({
  rotate = -4,
  color = "#EE9DB8",
  width = 56,
  className = "",
  style,
}: {
  rotate?: number;
  color?: string;
  width?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`tape-shadow pointer-events-none block ${className}`}
      style={{
        width,
        height: 18,
        transform: `rotate(${rotate}deg)`,
        backgroundColor: `${color}cc`,
        backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 4px, transparent 4px 8px), repeating-linear-gradient(0deg, rgba(255,255,255,0.32) 0 4px, transparent 4px 8px)`,
        ...style,
      }}
    />
  );
}

/** polaroid / paper frame, bottom-heavy, slightly rotated. */
export function Polaroid({
  rotate = 0,
  children,
  className = "",
  style,
}: {
  rotate?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`paper-soft rounded-[3px] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, padding: "8px 8px 0", ...style }}
    >
      {children}
    </div>
  );
}

/** rubber-stamped text, like the date stamps in a scrapbook. */
export function Stamp({
  children,
  rotate = -6,
  className = "",
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={`stamp-ink inline-block text-[7px] leading-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

/** little die-cut strawberry sticker. */
export function Strawberry({
  size = 18,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <path d="M7 5 L12 8 L17 5 L15 9 L12 8 L9 9 Z" fill="#3F8F6B" />
      <path
        d="M12 7 C18 7 20 11 20 14 C20 19 16 22 12 22 C8 22 4 19 4 14 C4 11 6 7 12 7 Z"
        fill="#E94B6A"
        stroke="#B53350"
        strokeWidth="0.6"
      />
      {[
        [9, 12],
        [13, 11],
        [16, 14],
        [11, 15],
        [14, 17],
        [8, 16],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.7" fill="#FFE08A" />
      ))}
    </svg>
  );
}

/** little ribbon bow sticker (the 🎀 motif, as a clean die-cut). */
export function Bow({
  size = 20,
  color = "#EE9DB8",
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={(size * 3) / 4}
      viewBox="0 0 24 18"
      className={className}
      style={style}
    >
      <path d="M11 9 L3 4 C1 3 1 7 2 9 C1 11 1 15 3 14 L11 9 Z" fill={color} stroke="#B53350" strokeWidth="0.6" />
      <path d="M13 9 L21 4 C23 3 23 7 22 9 C23 11 23 15 21 14 L13 9 Z" fill={color} stroke="#B53350" strokeWidth="0.6" />
      <path d="M11 7 L12 6 L13 7 L13 12 L12 13 L11 12 Z" fill="#F4B6C8" stroke="#B53350" strokeWidth="0.5" />
      <circle cx="12" cy="9" r="1.6" fill="#fff" stroke="#B53350" strokeWidth="0.5" />
    </svg>
  );
}

/** scalloped lace doily edge — a thin decorative strip. */
export function DoilyEdge({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`doily-edge block h-2 w-full ${className}`} />;
}
