// the journal cover is the real bookcloth photo (public/images/journal/cover.jpg).
// changing the color just re-tints that same photo with a CSS filter, so the
// exact book + cloth texture stays — only the hue shifts.

export type JournalColorId =
  | "rose"
  | "lavender"
  | "peach"
  | "butter"
  | "sage"
  | "sky"
  | "cream";

export type JournalColor = {
  id: JournalColorId;
  label: string;
  filter: string; // applied to the cover photo
  swatch: string; // the picker dot (≈ resulting cover color)
};

export const JOURNAL_COLORS: JournalColor[] = [
  { id: "rose", label: "rose", filter: "none", swatch: "#E7AEC0" },
  { id: "lavender", label: "lavender", filter: "hue-rotate(-58deg) saturate(1.05)", swatch: "#C4A7D6" },
  { id: "peach", label: "peach", filter: "hue-rotate(26deg) saturate(1.4) brightness(1.02)", swatch: "#F0AE85" },
  { id: "butter", label: "butter", filter: "hue-rotate(58deg) saturate(1.35) brightness(1.08)", swatch: "#EAD083" },
  { id: "sage", label: "sage", filter: "hue-rotate(132deg) saturate(0.85)", swatch: "#B2CD9E" },
  { id: "sky", label: "sky", filter: "hue-rotate(212deg) saturate(1.0)", swatch: "#A7C6E6" },
  { id: "cream", label: "cream", filter: "saturate(0.32) brightness(1.06) hue-rotate(14deg)", swatch: "#E6D7BE" },
];

export const JOURNAL_COLOR_BY_ID: Record<JournalColorId, JournalColor> =
  Object.fromEntries(JOURNAL_COLORS.map((c) => [c.id, c])) as Record<
    JournalColorId,
    JournalColor
  >;
