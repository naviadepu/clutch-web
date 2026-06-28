"use client";

import type { CSSProperties } from "react";

/** a woman kneeling in profile, long hair, a dress pooling at the floor —
 *  one clean white silhouette (single path → no notches). the cover figure. */
export default function WomanSilhouette({
  className = "",
  style,
  color = "#ffffff",
}: {
  className?: string;
  style?: CSSProperties;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      style={style}
      role="img"
      aria-label="kneeling woman"
      fill={color}
    >
      <path
        d="M92 24c-10 0-18 7-22 17-2 4-5 6-8 9-2 2 0 4 3 4-2 3 0 6 4 7 3 1 6 1 9 1 1 8 1 17-1 25-2 9-6 16-12 23-9 11-21 18-26 31-3 8-2 18 4 24 6 5 16 7 28 7 22 0 41-3 51-13 7-7 9-18 6-31-3-12-9-22-10-34-1-13 1-26 6-37 6-11 6-24-1-33 5-3 8-9 8-15 0-11-9-19-22-19-5 0-9 1-13 4-2-2-4-4-7-4-2 0-4 1-5 4z"
      />
    </svg>
  );
}
