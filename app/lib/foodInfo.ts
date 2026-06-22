// the substance behind the log. every food carries nutrient highlights + a
// cycle-aware note — "what it affects," framed as worth-noticing, never as a
// medical claim. this is what makes clutch's log mean something next to a
// phase tag instead of being calories-into-a-void.

import type { Phase } from "./cycle";

export type Sentiment = "good" | "notice" | "neutral";

export type FoodInfo = {
  // 2–3 nutrient highlights, receipt-style
  nutrients: string[];
  // one plain-language line about how it tends to play with the cycle
  effect: string;
  sentiment: Sentiment;
  // the phase this food is especially worth noting in (optional)
  phase?: Phase;
};

// keyed by the exact chip label (lowercase). custom foods fall back to
// keyword matching below.
const TABLE: Record<string, FoodInfo> = {
  // --- indian ---
  dal: {
    nutrients: ["iron", "protein", "folate"],
    effect: "iron-rich — helps replenish what your period depletes.",
    sentiment: "good",
    phase: "menstrual",
  },
  roti: {
    nutrients: ["complex carbs", "fiber"],
    effect: "steady carbs — even energy, no big spike.",
    sentiment: "neutral",
  },
  rice: {
    nutrients: ["carbs", "B vitamins"],
    effect: "easy fuel; pair with protein to keep energy level.",
    sentiment: "neutral",
  },
  curd: {
    nutrients: ["calcium", "probiotic"],
    effect: "dairy can add to bloating/cramps for some in the luteal phase — notice how you feel.",
    sentiment: "notice",
    phase: "luteal",
  },
  chai: {
    nutrients: ["caffeine"],
    effect: "caffeine can sharpen anxiety + cramps premenstrually; maybe ease off in luteal.",
    sentiment: "notice",
    phase: "luteal",
  },
  paneer: {
    nutrients: ["protein", "calcium"],
    effect: "dairy + protein; some notice more bloating with dairy luteally.",
    sentiment: "notice",
    phase: "luteal",
  },
  idli: {
    nutrients: ["fermented", "probiotic"],
    effect: "fermented + light on the gut — gentle, easy to digest.",
    sentiment: "good",
  },
  dosa: {
    nutrients: ["fermented", "carbs"],
    effect: "fermented batter is gut-friendly; balanced fuel.",
    sentiment: "good",
  },
  rajma: {
    nutrients: ["iron", "fiber", "protein"],
    effect: "iron + fiber — great for menstrual-phase replenishment.",
    sentiment: "good",
    phase: "menstrual",
  },
  sabzi: {
    nutrients: ["fiber", "folate", "iron"],
    effect: "leafy/veg iron + folate support energy through your period.",
    sentiment: "good",
    phase: "menstrual",
  },
  pickle: {
    nutrients: ["sodium", "fermented"],
    effect: "high salt can worsen water-retention bloating premenstrually.",
    sentiment: "notice",
    phase: "luteal",
  },
  ghee: {
    nutrients: ["healthy fats"],
    effect: "good fats help your body make hormones.",
    sentiment: "good",
  },

  // --- mediterranean ---
  hummus: {
    nutrients: ["protein", "fiber", "iron"],
    effect: "plant protein + iron; steady, satisfying.",
    sentiment: "good",
  },
  "olive oil": {
    nutrients: ["healthy fats", "vitamin E"],
    effect: "anti-inflammatory fats — supports hormone balance.",
    sentiment: "good",
  },
  "grilled fish": {
    nutrients: ["omega-3", "protein", "B12"],
    effect: "omega-3s help ease cramps + inflammation.",
    sentiment: "good",
    phase: "menstrual",
  },
  feta: {
    nutrients: ["calcium", "protein"],
    effect: "dairy — some feel more bloated with it in the luteal phase.",
    sentiment: "notice",
    phase: "luteal",
  },
  falafel: {
    nutrients: ["plant protein", "fiber", "iron"],
    effect: "chickpea iron + fiber; keeps energy even.",
    sentiment: "good",
  },
  tabbouleh: {
    nutrients: ["fiber", "vitamin C", "folate"],
    effect: "vitamin C helps you absorb iron — pair with your dal.",
    sentiment: "good",
  },
  pita: {
    nutrients: ["carbs", "fiber"],
    effect: "steady carbs; fine all cycle.",
    sentiment: "neutral",
  },
  "lentil soup": {
    nutrients: ["iron", "protein", "fiber"],
    effect: "iron + protein, warm + gentle — lovely on period days.",
    sentiment: "good",
    phase: "menstrual",
  },
  "greek yogurt": {
    nutrients: ["protein", "calcium", "probiotic"],
    effect: "probiotic + protein; dairy may bloat some luteally.",
    sentiment: "notice",
    phase: "luteal",
  },
  olives: {
    nutrients: ["healthy fats", "sodium"],
    effect: "good fats, but salty — watch if you're bloating premenstrually.",
    sentiment: "neutral",
  },

  // --- east asian ---
  "miso udon": {
    nutrients: ["fermented", "carbs", "protein"],
    effect: "fermented miso is gut-friendly + comforting; warm = cramp-soothing.",
    sentiment: "good",
  },
  tofu: {
    nutrients: ["plant protein", "iron", "calcium"],
    effect: "plant protein + iron; phytoestrogens are gentle, not harmful.",
    sentiment: "good",
  },
  kimchi: {
    nutrients: ["probiotic", "vitamin C", "fiber"],
    effect: "fermented — supports gut + mood, helpful in the luteal phase.",
    sentiment: "good",
    phase: "luteal",
  },
  ramen: {
    nutrients: ["carbs", "sodium"],
    effect: "comforting but salty — high sodium can add to bloating.",
    sentiment: "notice",
    phase: "luteal",
  },
  congee: {
    nutrients: ["easy carbs"],
    effect: "soft + warm — easy to digest on low-energy period days.",
    sentiment: "good",
    phase: "menstrual",
  },
  dumplings: {
    nutrients: ["carbs", "protein"],
    effect: "balanced comfort food; salt content varies.",
    sentiment: "neutral",
  },
  edamame: {
    nutrients: ["plant protein", "iron", "folate"],
    effect: "protein + iron + folate — a great snack any phase.",
    sentiment: "good",
  },

  // --- mexican / latam ---
  beans: {
    nutrients: ["iron", "fiber", "protein"],
    effect: "iron + fiber; perfect for menstrual-phase energy.",
    sentiment: "good",
    phase: "menstrual",
  },
  tortilla: {
    nutrients: ["carbs", "fiber"],
    effect: "steady carbs; corn is a touch more mineral-rich.",
    sentiment: "neutral",
  },
  avocado: {
    nutrients: ["healthy fats", "potassium", "B6"],
    effect: "potassium + B6 can ease bloating + PMS mood.",
    sentiment: "good",
    phase: "luteal",
  },
  eggs: {
    nutrients: ["protein", "B12", "choline"],
    effect: "protein + B12 — steady energy and mood support.",
    sentiment: "good",
  },
  salsa: {
    nutrients: ["vitamin C", "lycopene"],
    effect: "vitamin C helps iron absorption; spice can aggravate cramps for some.",
    sentiment: "neutral",
  },
  plantain: {
    nutrients: ["potassium", "B6", "carbs"],
    effect: "B6 + potassium — friendly to PMS mood + bloating.",
    sentiment: "good",
    phase: "luteal",
  },

  // --- quick / american ---
  oatmeal: {
    nutrients: ["magnesium", "fiber", "complex carbs"],
    effect: "magnesium can ease cramps + mood — a luteal-phase friend.",
    sentiment: "good",
    phase: "luteal",
  },
  smoothie: {
    nutrients: ["vitamins", "fiber"],
    effect: "easy nutrients; add greens for iron, berries for vitamin C.",
    sentiment: "good",
  },
  sandwich: {
    nutrients: ["carbs", "protein"],
    effect: "balanced depending on fillings; fine all cycle.",
    sentiment: "neutral",
  },
  coffee: {
    nutrients: ["caffeine"],
    effect: "caffeine can spike anxiety + cramps premenstrually; go easy in luteal.",
    sentiment: "notice",
    phase: "luteal",
  },
  salad: {
    nutrients: ["folate", "fiber", "vitamin C"],
    effect: "leafy folate + vitamin C; great for iron absorption.",
    sentiment: "good",
  },
};

// keyword fallback so custom-typed foods still say something useful.
const KEYWORDS: { match: RegExp; info: FoodInfo }[] = [
  {
    match: /milk|cheese|dairy|yogurt|curd|paneer|latte|ice cream|butter/i,
    info: {
      nutrients: ["calcium", "dairy"],
      effect: "dairy can add to bloating/cramps for some in the luteal phase — notice how you feel.",
      sentiment: "notice",
      phase: "luteal",
    },
  },
  {
    match: /coffee|espresso|chai|tea|matcha|caffeine|cola|energy drink/i,
    info: {
      nutrients: ["caffeine"],
      effect: "caffeine can sharpen anxiety + cramps premenstrually; ease off in luteal.",
      sentiment: "notice",
      phase: "luteal",
    },
  },
  {
    match: /chocolate|cocoa|cacao/i,
    info: {
      nutrients: ["magnesium", "iron"],
      effect: "dark chocolate's magnesium can genuinely soothe cramps + cravings.",
      sentiment: "good",
      phase: "luteal",
    },
  },
  {
    match: /spicy|chili|chilli|mirchi|hot sauce|sriracha/i,
    info: {
      nutrients: ["capsaicin"],
      effect: "spicy food + luteal cramps tend to show up together for some — worth watching.",
      sentiment: "notice",
      phase: "luteal",
    },
  },
  {
    match: /chips|fries|fried|salt|noodle|instant|pizza|burger/i,
    info: {
      nutrients: ["sodium", "carbs"],
      effect: "high salt can worsen water-retention bloating premenstrually.",
      sentiment: "notice",
      phase: "luteal",
    },
  },
  {
    match: /spinach|kale|greens|beet|lentil|bean|tofu|liver|red meat|chickpea/i,
    info: {
      nutrients: ["iron", "folate"],
      effect: "iron-rich — helps replenish what your period depletes.",
      sentiment: "good",
      phase: "menstrual",
    },
  },
  {
    match: /salmon|fish|mackerel|sardine|tuna|walnut|flax|chia/i,
    info: {
      nutrients: ["omega-3"],
      effect: "omega-3s help ease cramps + inflammation.",
      sentiment: "good",
      phase: "menstrual",
    },
  },
  {
    match: /banana|avocado|sweet potato|oat/i,
    info: {
      nutrients: ["B6", "magnesium", "potassium"],
      effect: "B6 + magnesium can ease PMS mood + bloating.",
      sentiment: "good",
      phase: "luteal",
    },
  },
  {
    match: /berry|orange|citrus|kiwi|pepper|tomato|mango/i,
    info: {
      nutrients: ["vitamin C"],
      effect: "vitamin C helps your body absorb iron — pairs well with greens.",
      sentiment: "good",
    },
  },
];

const FALLBACK: FoodInfo = {
  nutrients: ["logged"],
  effect: "logged against your phase — we'll watch how it tracks over time.",
  sentiment: "neutral",
};

export function foodInfo(item: string): FoodInfo {
  const key = item.trim().toLowerCase();
  if (TABLE[key]) return TABLE[key];
  for (const { match, info } of KEYWORDS) {
    if (match.test(key)) return info;
  }
  return FALLBACK;
}

export const SENTIMENT_COLOR: Record<Sentiment, string> = {
  good: "#3F8F6B", // soft green
  notice: "#C97A2B", // warm amber
  neutral: "#9A7B86", // muted mauve-grey
};

export const SENTIMENT_LABEL: Record<Sentiment, string> = {
  good: "good for you rn",
  notice: "worth noticing",
  neutral: "neutral",
};
