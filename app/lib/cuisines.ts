// the wedge, not a feature. pre-seeded one-tap dishes so nobody types
// "1 cup cooked lentils." the indian girl logging dal + curd should feel seen.

export type CuisineId =
  | "indian"
  | "mediterranean"
  | "eastAsian"
  | "mexican"
  | "quick";

export type CuisinePack = {
  id: CuisineId;
  label: string;
  emoji: string;
  items: string[];
};

export const CUISINES: CuisinePack[] = [
  {
    id: "indian",
    label: "indian",
    emoji: "🍛",
    items: [
      "dal",
      "roti",
      "rice",
      "curd",
      "chai",
      "paneer",
      "idli",
      "dosa",
      "rajma",
      "sabzi",
      "pickle",
      "ghee",
    ],
  },
  {
    id: "mediterranean",
    label: "mediterranean",
    emoji: "🫒",
    items: [
      "hummus",
      "olive oil",
      "grilled fish",
      "feta",
      "falafel",
      "tabbouleh",
      "pita",
      "lentil soup",
      "greek yogurt",
      "olives",
    ],
  },
  {
    id: "eastAsian",
    label: "east asian",
    emoji: "🍜",
    items: [
      "miso udon",
      "rice",
      "tofu",
      "kimchi",
      "ramen",
      "congee",
      "dumplings",
      "edamame",
    ],
  },
  {
    id: "mexican",
    label: "mexican / latam",
    emoji: "🌮",
    items: [
      "beans",
      "tortilla",
      "rice",
      "avocado",
      "eggs",
      "salsa",
      "plantain",
    ],
  },
  {
    id: "quick",
    label: "quick / american",
    emoji: "🥪",
    items: [
      "oatmeal",
      "smoothie",
      "sandwich",
      "coffee",
      "eggs",
      "salad",
    ],
  },
];

export const CUISINE_BY_ID: Record<CuisineId, CuisinePack> = Object.fromEntries(
  CUISINES.map((c) => [c.id, c]),
) as Record<CuisineId, CuisinePack>;
