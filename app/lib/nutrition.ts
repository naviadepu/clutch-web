import type { NutritionInfo } from "./store";

// Keyword-based estimator — used as an instant fallback when Gemini is
// rate-limited or unavailable. Covers the most common custom-typed foods.
export function estimateNutrition(item: string): NutritionInfo {
  const t = item.toLowerCase();

  if (/big mac|whopper|mcdonalds|mcdonald|burger king|kfc|wendy|cheeseburger|burger|patty/.test(t))
    return { calories: 550, protein: 25, carbs: 45, fat: 30, sugar: 9, portionGrams: 210, portionLabel: "1 burger" };
  if (/pizza/.test(t))
    return { calories: 285, protein: 12, carbs: 36, fat: 10, sugar: 3, portionGrams: 100, portionLabel: "1 slice" };
  if (/biryani|fried rice|pulao/.test(t))
    return { calories: 350, protein: 12, carbs: 55, fat: 10, sugar: 2, portionGrams: 250, portionLabel: "1 bowl" };
  if (/pasta|spaghetti|penne|linguine|fettuccine|mac.+cheese|macaroni/.test(t))
    return { calories: 350, protein: 12, carbs: 60, fat: 7, sugar: 4, portionGrams: 220, portionLabel: "1 bowl" };
  if (/curry|masala|tikka|butter chicken|korma|vindaloo|gravy/.test(t))
    return { calories: 300, protein: 18, carbs: 15, fat: 18, sugar: 6, portionGrams: 200, portionLabel: "one plate" };
  if (/sandwich|sub|wrap|roll|panini/.test(t))
    return { calories: 350, protein: 15, carbs: 42, fat: 12, sugar: 5, portionGrams: 180, portionLabel: "1 sandwich" };
  if (/chicken|poultry/.test(t))
    return { calories: 280, protein: 28, carbs: 8, fat: 14, sugar: 2, portionGrams: 200, portionLabel: "1 serving" };
  if (/steak|beef|mutton|lamb|pork|bacon/.test(t))
    return { calories: 350, protein: 30, carbs: 0, fat: 24, sugar: 0, portionGrams: 200, portionLabel: "1 serving" };
  if (/fish|salmon|tuna|shrimp|prawn|seafood|crab|lobster/.test(t))
    return { calories: 200, protein: 28, carbs: 5, fat: 8, sugar: 1, portionGrams: 150, portionLabel: "1 serving" };
  if (/soup|stew|broth/.test(t))
    return { calories: 180, protein: 8, carbs: 20, fat: 6, sugar: 4, portionGrams: 300, portionLabel: "1 bowl" };
  if (/cake|cookie|brownie|donut|pastry|muffin/.test(t))
    return { calories: 350, protein: 4, carbs: 50, fat: 15, sugar: 30, portionGrams: 100, portionLabel: "1 piece" };
  if (/ice cream|gelato|frozen yogurt/.test(t))
    return { calories: 250, protein: 4, carbs: 30, fat: 13, sugar: 25, portionGrams: 100, portionLabel: "1 scoop" };
  if (/chips|fries|crisps/.test(t))
    return { calories: 300, protein: 3, carbs: 40, fat: 15, sugar: 1, portionGrams: 100, portionLabel: "1 serving" };
  if (/latte|cappuccino|mocha|frappe/.test(t))
    return { calories: 180, protein: 6, carbs: 22, fat: 7, sugar: 18, portionGrams: 350, portionLabel: "1 cup" };
  if (/juice|soda|cola|lemonade/.test(t))
    return { calories: 120, protein: 0, carbs: 30, fat: 0, sugar: 28, portionGrams: 350, portionLabel: "1 glass" };
  if (/bread|toast|bagel|baguette/.test(t))
    return { calories: 150, protein: 5, carbs: 28, fat: 2, sugar: 2, portionGrams: 60, portionLabel: "2 slices" };
  if (/pancake|waffle|french toast/.test(t))
    return { calories: 350, protein: 10, carbs: 55, fat: 12, sugar: 15, portionGrams: 200, portionLabel: "1 plate" };
  if (/egg/.test(t))
    return { calories: 143, protein: 13, carbs: 1, fat: 10, sugar: 1, portionGrams: 100, portionLabel: "2 eggs" };
  if (/fruit|apple|banana|mango|orange|berry|grape|pear/.test(t))
    return { calories: 70, protein: 1, carbs: 18, fat: 0, sugar: 14, portionGrams: 100, portionLabel: "1 piece" };
  if (/salad/.test(t))
    return { calories: 120, protein: 4, carbs: 14, fat: 6, sugar: 5, portionGrams: 150, portionLabel: "1 bowl" };

  // generic catch-all
  return { calories: 300, protein: 10, carbs: 35, fat: 12, sugar: 5, portionGrams: 200, portionLabel: "1 serving" };
}

// Static table for all chip foods — zero API calls for these.
// Amounts are per typical single serving (the number a person would actually eat).
export const STATIC_NUTRITION: Record<string, NutritionInfo> = {
  // --- indian ---
  dal: { calories: 180, protein: 11, carbs: 28, fat: 4, sugar: 2, portionGrams: 200, portionLabel: "1 bowl" },
  roti: { calories: 120, protein: 3, carbs: 24, fat: 3, sugar: 1, portionGrams: 40, portionLabel: "1 piece" },
  rice: { calories: 240, protein: 4, carbs: 52, fat: 1, sugar: 0, portionGrams: 180, portionLabel: "1 cup cooked" },
  curd: { calories: 90, protein: 5, carbs: 7, fat: 4, sugar: 5, portionGrams: 150, portionLabel: "1 small bowl" },
  chai: { calories: 60, protein: 2, carbs: 9, fat: 2, sugar: 7, portionGrams: 250, portionLabel: "1 cup" },
  paneer: { calories: 330, protein: 20, carbs: 5, fat: 26, sugar: 2, portionGrams: 150, portionLabel: "one plate" },
  idli: { calories: 130, protein: 4, carbs: 26, fat: 1, sugar: 1, portionGrams: 100, portionLabel: "2 pieces" },
  dosa: { calories: 170, protein: 5, carbs: 31, fat: 4, sugar: 1, portionGrams: 100, portionLabel: "1 dosa" },
  rajma: { calories: 180, protein: 10, carbs: 32, fat: 2, sugar: 2, portionGrams: 200, portionLabel: "1 bowl" },
  sabzi: { calories: 100, protein: 3, carbs: 15, fat: 4, sugar: 4, portionGrams: 150, portionLabel: "1 bowl" },
  pickle: { calories: 15, protein: 0, carbs: 2, fat: 1, sugar: 0, portionGrams: 20, portionLabel: "1 tbsp" },
  ghee: { calories: 45, protein: 0, carbs: 0, fat: 5, sugar: 0, portionGrams: 5, portionLabel: "1 tsp" },

  // --- mediterranean ---
  hummus: { calories: 95, protein: 3, carbs: 8, fat: 6, sugar: 1, portionGrams: 50, portionLabel: "2 tbsp" },
  "olive oil": { calories: 120, protein: 0, carbs: 0, fat: 14, sugar: 0, portionGrams: 14, portionLabel: "1 tbsp" },
  "grilled fish": { calories: 200, protein: 30, carbs: 0, fat: 9, sugar: 0, portionGrams: 150, portionLabel: "1 fillet" },
  feta: { calories: 75, protein: 4, carbs: 1, fat: 6, sugar: 0, portionGrams: 30, portionLabel: "small portion" },
  falafel: { calories: 210, protein: 8, carbs: 25, fat: 10, sugar: 2, portionGrams: 90, portionLabel: "3 pieces" },
  tabbouleh: { calories: 90, protein: 2, carbs: 14, fat: 4, sugar: 2, portionGrams: 100, portionLabel: "1 bowl" },
  pita: { calories: 165, protein: 5, carbs: 33, fat: 1, sugar: 1, portionGrams: 60, portionLabel: "1 piece" },
  "lentil soup": { calories: 200, protein: 12, carbs: 30, fat: 4, sugar: 3, portionGrams: 250, portionLabel: "1 bowl" },
  "greek yogurt": { calories: 100, protein: 17, carbs: 6, fat: 1, sugar: 5, portionGrams: 170, portionLabel: "1 cup" },
  olives: { calories: 35, protein: 0, carbs: 2, fat: 3, sugar: 0, portionGrams: 30, portionLabel: "10 olives" },

  // --- east asian ---
  "miso udon": { calories: 350, protein: 15, carbs: 60, fat: 6, sugar: 5, portionGrams: 400, portionLabel: "1 bowl" },
  tofu: { calories: 80, protein: 8, carbs: 2, fat: 5, sugar: 1, portionGrams: 100, portionLabel: "100g" },
  kimchi: { calories: 25, protein: 2, carbs: 4, fat: 1, sugar: 2, portionGrams: 100, portionLabel: "1 cup" },
  ramen: { calories: 500, protein: 20, carbs: 70, fat: 15, sugar: 5, portionGrams: 500, portionLabel: "1 bowl" },
  congee: { calories: 180, protein: 5, carbs: 38, fat: 1, sugar: 0, portionGrams: 300, portionLabel: "1 bowl" },
  dumplings: { calories: 330, protein: 14, carbs: 45, fat: 12, sugar: 3, portionGrams: 180, portionLabel: "6 pieces" },
  edamame: { calories: 188, protein: 17, carbs: 14, fat: 8, sugar: 3, portionGrams: 155, portionLabel: "1 cup" },

  // --- mexican / latam ---
  beans: { calories: 230, protein: 15, carbs: 40, fat: 1, sugar: 1, portionGrams: 170, portionLabel: "1 cup" },
  tortilla: { calories: 130, protein: 3, carbs: 26, fat: 2, sugar: 1, portionGrams: 45, portionLabel: "1 piece" },
  avocado: { calories: 160, protein: 2, carbs: 9, fat: 15, sugar: 1, portionGrams: 100, portionLabel: "half" },
  eggs: { calories: 143, protein: 13, carbs: 1, fat: 10, sugar: 1, portionGrams: 100, portionLabel: "2 eggs" },
  salsa: { calories: 15, protein: 0, carbs: 3, fat: 0, sugar: 2, portionGrams: 30, portionLabel: "2 tbsp" },
  plantain: { calories: 120, protein: 1, carbs: 31, fat: 0, sugar: 14, portionGrams: 100, portionLabel: "1 medium" },

  // --- quick / american ---
  oatmeal: { calories: 190, protein: 7, carbs: 33, fat: 4, sugar: 1, portionGrams: 250, portionLabel: "1 bowl" },
  smoothie: { calories: 180, protein: 4, carbs: 35, fat: 3, sugar: 22, portionGrams: 300, portionLabel: "1 glass" },
  sandwich: { calories: 350, protein: 15, carbs: 50, fat: 10, sugar: 5, portionGrams: 200, portionLabel: "1 sandwich" },
  coffee: { calories: 5, protein: 0, carbs: 1, fat: 0, sugar: 0, portionGrams: 240, portionLabel: "1 cup black" },
  salad: { calories: 100, protein: 3, carbs: 12, fat: 5, sugar: 5, portionGrams: 150, portionLabel: "1 bowl" },
};
