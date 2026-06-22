// a relevant photo for every loggable food, so each pinned clipping looks like
// a real scrapbook polaroid instead of an emoji. images live in
// public/images/food/ (pulled from TheMealDB + Wikimedia Commons, free to use).
// see scripts/fetch_food_images.py.

const DIR = "/images/food";

// exact chip label (lowercase) -> file
const MAP: Record<string, string> = {
  dal: "dal.jpg",
  roti: "roti.jpg",
  rice: "rice.png",
  curd: "curd.png",
  chai: "chai.png",
  paneer: "paneer.png",
  idli: "idli.jpg",
  dosa: "dosa.jpg",
  rajma: "rajma.png",
  sabzi: "sabzi.png",
  pickle: "pickle.jpg",
  ghee: "ghee.png",
  hummus: "hummus.png",
  "olive oil": "olive-oil.png",
  "grilled fish": "grilled-fish.jpg",
  feta: "feta.png",
  falafel: "falafel.jpg",
  tabbouleh: "tabbouleh.png",
  pita: "pita.png",
  "lentil soup": "lentil-soup.jpg",
  "greek yogurt": "greek-yogurt.png",
  olives: "olives.png",
  "miso udon": "miso-udon.jpg",
  tofu: "tofu.png",
  kimchi: "kimchi.jpg",
  ramen: "ramen.jpg",
  congee: "congee.jpg",
  dumplings: "dumplings.jpg",
  edamame: "edamame.jpg",
  beans: "beans.png",
  tortilla: "tortilla.png",
  avocado: "avocado.png",
  eggs: "eggs.png",
  salsa: "salsa.png",
  plantain: "plantain.jpg",
  oatmeal: "oatmeal.png",
  smoothie: "smoothie.png",
  sandwich: "sandwich.jpg",
  coffee: "coffee.png",
  salad: "salad.jpg",
};

// keyword fallback so custom-typed foods still pin something relevant.
const KEYWORDS: { match: RegExp; file: string }[] = [
  { match: /milk|cheese|dairy|yogurt|curd|paneer|latte|cream/i, file: "curd.png" },
  { match: /coffee|espresso|chai|tea|matcha|cappuccino/i, file: "coffee.png" },
  { match: /egg|omelet|omelette/i, file: "eggs.png" },
  { match: /salmon|fish|tuna|cod|mackerel/i, file: "grilled-fish.jpg" },
  { match: /bean|lentil|rajma|chickpea|dal|hummus/i, file: "beans.png" },
  { match: /avocado|guac/i, file: "avocado.png" },
  { match: /oat|porridge|granola|muesli/i, file: "oatmeal.png" },
  { match: /noodle|ramen|udon|pasta|spaghetti/i, file: "ramen.jpg" },
  { match: /tofu/i, file: "tofu.png" },
  { match: /rice|biryani|congee|pulao/i, file: "rice.png" },
  { match: /bread|sandwich|toast|wrap|roll|burger/i, file: "sandwich.jpg" },
  { match: /smoothie|berry|fruit|banana|mango|shake/i, file: "smoothie.png" },
  { match: /salad|greens|lettuce|spinach|veg|sabzi/i, file: "salad.jpg" },
  { match: /tortilla|taco|quesadilla|burrito/i, file: "tortilla.png" },
  { match: /dumpling|momo|gyoza|bao/i, file: "dumplings.jpg" },
  { match: /chai|chai/i, file: "chai.png" },
];

/** photo path for a food, or null if we have nothing relevant (caller falls
 *  back to the cuisine sticker). */
export function foodImage(item: string): string | null {
  const key = item.trim().toLowerCase();
  if (MAP[key]) return `${DIR}/${MAP[key]}`;
  for (const { match, file } of KEYWORDS) {
    if (match.test(key)) return `${DIR}/${file}`;
  }
  return null;
}
