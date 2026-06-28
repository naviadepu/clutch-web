// the journal cover is a printed riso field (duotone + grain + halftone).
// the color picker swaps the base ink the cover is printed in. ids kept stable
// so saved guest data + the default ("rose") don't break.

export type JournalColorId =
  | "rose"
  | "lavender"
  | "peach"
  | "butter"
  | "sage"
  | "sky"
  | "cream"
  | "black";

export type JournalColor = {
  id: JournalColorId;
  label: string;
  base: string; // the printed cover color
  ink: string; // logo + label color that reads on it
};

export const JOURNAL_COLORS: JournalColor[] = [
  { id: "rose", label: "pink", base: "#FB4E97", ink: "#FBF6EC" },
  { id: "peach", label: "berry", base: "#C8235F", ink: "#FBF6EC" },
  { id: "lavender", label: "plum", base: "#9A6B8E", ink: "#FBF6EC" },
  { id: "butter", label: "gold", base: "#E7B53C", ink: "#1B1417" },
  { id: "sage", label: "blush", base: "#FFB3D4", ink: "#C8235F" },
  { id: "sky", label: "sky", base: "#9FC3E8", ink: "#1B1417" },
  { id: "cream", label: "cream", base: "#EADBC4", ink: "#C8235F" },
  { id: "black", label: "black", base: "#1B1417", ink: "#FBF6EC" },
];

export const JOURNAL_COLOR_BY_ID: Record<JournalColorId, JournalColor> =
  Object.fromEntries(JOURNAL_COLORS.map((c) => [c.id, c])) as Record<
    JournalColorId,
    JournalColor
  >;
