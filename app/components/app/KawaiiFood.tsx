"use client";

// cute kawaii food stickers, drawn in the clutch palette — little faces, blush,
// pastel. matches the scrapbook-sticker vibe better than stock photos (and no
// licensing/watermarks). every loggable food maps to one of these archetypes;
// the handwritten label already names the exact dish.

import type { CSSProperties } from "react";

type Archetype =
  | "curry"
  | "stew"
  | "beans"
  | "rice"
  | "idli"
  | "flatbread"
  | "sandwich"
  | "drink"
  | "dairy"
  | "yogurt"
  | "bottle"
  | "egg"
  | "noodle"
  | "dumpling"
  | "green"
  | "avocado"
  | "salad"
  | "salsa"
  | "banana"
  | "smoothie"
  | "oats"
  | "fish"
  | "jar"
  | "plate";

// face: two eyes, a tiny smile, rosy cheeks. shared across every sticker.
function Face({ cx = 24, cy = 26, s = 1 }: { cx?: number; cy?: number; s?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <circle cx={-5.5} cy={1.5} r={2.6} fill="#F4A6BD" opacity={0.7} />
      <circle cx={5.5} cy={1.5} r={2.6} fill="#F4A6BD" opacity={0.7} />
      <circle cx={-4} cy={-1.5} r={1.5} fill="#3A2A30" />
      <circle cx={4} cy={-1.5} r={1.5} fill="#3A2A30" />
      <circle cx={-3.5} cy={-2.1} r={0.5} fill="#fff" />
      <circle cx={4.5} cy={-2.1} r={0.5} fill="#fff" />
      <path d="M-2.6 1.6 Q0 4 2.6 1.6" stroke="#3A2A30" strokeWidth={1.1} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Steam() {
  return (
    <g stroke="#C9A9B8" strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.7}>
      <path d="M19 10 q-2 -2 0 -4 q2 -2 0 -4" />
      <path d="M27 10 q-2 -2 0 -4 q2 -2 0 -4" />
    </g>
  );
}

function Body({ type }: { type: Archetype }) {
  switch (type) {
    case "curry":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={14} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M8 26 H40 a16 14 0 0 1 -32 0 Z" fill="#fff" stroke="#D89B6A" strokeWidth={1.4} />
          <path d="M10 26 H38 a14 11 0 0 1 -28 0 Z" fill="#E08A3C" />
          <ellipse cx={20} cy={29} rx={2} ry={1.2} fill="#C56A1F" />
          <ellipse cx={29} cy={31} rx={1.6} ry={1} fill="#C56A1F" />
          <circle cx={26} cy={28} r={1.3} fill="#9FCb66" />
          <Face cy={31} s={0.92} />
        </g>
      );
    case "rice":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={14} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M8 28 H40 a16 13 0 0 1 -32 0 Z" fill="#EAB6CC" stroke="#D98FB0" strokeWidth={1.4} />
          <path d="M11 28 q13 -16 26 0 Z" fill="#FFFDF7" stroke="#E8D9C4" strokeWidth={1.2} />
          <Face cy={22} s={0.9} />
        </g>
      );
    case "flatbread":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={16} ry={3} fill="#000" opacity={0.06} />
          <ellipse cx={24} cy={26} rx={17} ry={13} fill="#F0C98A" stroke="#D9A85C" strokeWidth={1.4} />
          <circle cx={14} cy={22} r={1} fill="#B57A33" opacity={0.6} />
          <circle cx={33} cy={29} r={1.2} fill="#B57A33" opacity={0.6} />
          <circle cx={28} cy={20} r={0.8} fill="#B57A33" opacity={0.5} />
          <Face cy={27} s={1} />
        </g>
      );
    case "drink":
      return (
        <g>
          <Steam />
          <ellipse cx={23} cy={43} rx={12} ry={2.2} fill="#000" opacity={0.06} />
          <rect x={11} y={16} width={24} height={22} rx={6} fill="#fff" stroke="#C99" strokeWidth={1.4} />
          <path d="M35 20 a6 6 0 0 1 0 12" fill="none" stroke="#C99" strokeWidth={1.4} />
          <rect x={14} y={19} width={18} height={6} rx={3} fill="#B5764B" />
          <Face cy={30} s={0.95} />
        </g>
      );
    case "dairy":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={13} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M10 18 L34 14 L40 22 L40 36 a16 5 0 0 1 -28 0 L10 18 Z" fill="#FBE8B0" stroke="#E6C870" strokeWidth={1.4} />
          <circle cx={18} cy={28} r={2} fill="#F2D88A" />
          <circle cx={31} cy={31} r={1.6} fill="#F2D88A" />
          <Face cy={26} s={0.95} />
        </g>
      );
    case "egg":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={15} ry={2.6} fill="#000" opacity={0.06} />
          <path d="M11 27 q-3 -10 8 -11 q6 -6 12 1 q9 0 6 9 q3 9 -8 9 q-9 5 -14 -2 q-8 -1 -4 -6 Z" fill="#FFFDF7" stroke="#EADFC9" strokeWidth={1.3} />
          <circle cx={24} cy={26} r={7} fill="#FFC83D" />
          <Face cy={26} s={1} />
        </g>
      );
    case "noodle":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={14} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M8 26 H40 a16 14 0 0 1 -32 0 Z" fill="#fff" stroke="#D98FB0" strokeWidth={1.4} />
          <path d="M11 25 q4 -3 7 0 t7 0 t7 0" fill="none" stroke="#F2D88A" strokeWidth={2} strokeLinecap="round" />
          <path d="M16 13 L34 9 M18 11 L36 7" stroke="#B98A5A" strokeWidth={1.2} strokeLinecap="round" />
          <Face cy={31} s={0.92} />
        </g>
      );
    case "dumpling":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={14} ry={2.6} fill="#000" opacity={0.06} />
          <path d="M9 30 q15 -22 30 0 q-15 8 -30 0 Z" fill="#FBEFD6" stroke="#E6CFA0" strokeWidth={1.4} />
          <path d="M12 28 q3 -4 5 0 M19 26 q3 -4 5 0 M26 26 q3 -4 5 0 M33 28 q2 -3 3 0" fill="none" stroke="#E6CFA0" strokeWidth={1.2} />
          <Face cy={28} s={0.95} />
        </g>
      );
    case "green":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={13} ry={2.6} fill="#000" opacity={0.06} />
          <path d="M10 30 q-4 -10 6 -12 q4 -8 12 -4 q10 -2 8 8 q5 8 -5 11 q-10 6 -16 0 q-8 -1 -5 -3 Z" fill="#A7Cf63" stroke="#7FA844" strokeWidth={1.4} />
          <circle cx={17} cy={27} r={2} fill="#8BBA4E" />
          <circle cx={31} cy={29} r={2} fill="#8BBA4E" />
          <Face cy={27} s={0.95} />
        </g>
      );
    case "avocado":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={11} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M24 6 q11 4 11 20 q0 14 -11 16 q-11 -2 -11 -16 q0 -16 11 -20 Z" fill="#9FBF5A" stroke="#7FA844" strokeWidth={1.4} />
          <path d="M24 12 q7 3 7 14 q0 9 -7 11 q-7 -2 -7 -11 q0 -11 7 -14 Z" fill="#E6EFC4" />
          <circle cx={24} cy={28} r={6} fill="#9A6A3C" />
          <Face cy={28} s={0.9} />
        </g>
      );
    case "salad":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={14} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M8 28 H40 a16 13 0 0 1 -32 0 Z" fill="#fff" stroke="#9CC2DE" strokeWidth={1.4} />
          <circle cx={16} cy={25} r={4.5} fill="#94C25C" />
          <circle cx={24} cy={23} r={5} fill="#A7Cf63" />
          <circle cx={32} cy={25} r={4.5} fill="#84B24E" />
          <circle cx={28} cy={27} r={2} fill="#E0574F" />
          <Face cy={28} s={0.9} />
        </g>
      );
    case "smoothie":
      return (
        <g>
          <rect x={20} y={6} width={2.4} height={16} rx={1.2} fill="#E94B6A" transform="rotate(12 21 14)" />
          <ellipse cx={24} cy={43} rx={11} ry={2.2} fill="#000" opacity={0.06} />
          <path d="M14 18 H34 L31 40 a7 4 0 0 1 -14 0 Z" fill="#F4A6C2" stroke="#E07AA0" strokeWidth={1.4} />
          <rect x={14} y={18} width={20} height={5} rx={2.5} fill="#fff" opacity={0.5} />
          <Face cy={31} s={0.95} />
        </g>
      );
    case "oats":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={14} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M8 27 H40 a16 13 0 0 1 -32 0 Z" fill="#fff" stroke="#D9B98F" strokeWidth={1.4} />
          <path d="M11 27 q13 -12 26 0 Z" fill="#EAD7B0" stroke="#D9B98F" strokeWidth={1} />
          <circle cx={20} cy={23} r={2} fill="#E0574F" />
          <circle cx={28} cy={24} r={1.8} fill="#7A4FB0" />
          <Face cy={29} s={0.9} />
        </g>
      );
    case "fish":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={15} ry={2.6} fill="#000" opacity={0.06} />
          <path d="M34 26 L42 20 L42 32 Z" fill="#F2A98C" stroke="#D98666" strokeWidth={1.2} />
          <ellipse cx={20} cy={26} rx={15} ry={10} fill="#F7B89E" stroke="#D98666" strokeWidth={1.4} />
          <path d="M12 20 q3 6 0 12 M18 18 q3 8 0 16" fill="none" stroke="#E89B7C" strokeWidth={1} opacity={0.7} />
          <Face cx={20} cy={26} s={0.85} />
        </g>
      );
    case "jar":
      return (
        <g>
          <ellipse cx={24} cy={43} rx={11} ry={2.2} fill="#000" opacity={0.06} />
          <rect x={15} y={8} width={18} height={5} rx={1.5} fill="#E08A3C" />
          <rect x={13} y={13} width={22} height={28} rx={4} fill="#fff" stroke="#C9A9B8" strokeWidth={1.4} />
          <path d="M15 22 q9 -4 18 0 L33 38 a4 3 0 0 1 -18 0 Z" fill="#E0742A" />
          <circle cx={20} cy={30} r={1.4} fill="#B5571C" />
          <circle cx={28} cy={33} r={1.2} fill="#B5571C" />
          <Face cy={30} s={0.9} />
        </g>
      );
    case "stew":
      return (
        <g>
          <g stroke="#C9A9B8" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.6}>
            <path d="M18 14 q-2 -2 0 -4" />
            <path d="M28 14 q-2 -2 0 -4" />
          </g>
          <ellipse cx={24} cy={42} rx={14} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M8 26 H40 a16 14 0 0 1 -32 0 Z" fill="#fff" stroke="#B07A55" strokeWidth={1.4} />
          <path d="M10 26 H38 a14 11 0 0 1 -28 0 Z" fill="#A6432A" />
          <ellipse cx={19} cy={30} rx={2.4} ry={1.6} fill="#7A2E1C" />
          <ellipse cx={29} cy={32} rx={2.2} ry={1.5} fill="#7A2E1C" />
          <Face cy={31} s={0.9} />
        </g>
      );
    case "beans":
      return (
        <g>
          <ellipse cx={24} cy={42} rx={14} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M8 27 H40 a16 13 0 0 1 -32 0 Z" fill="#fff" stroke="#C99" strokeWidth={1.4} />
          <path d="M11 27 q13 -11 26 0 Z" fill="#7A4A30" />
          {[
            [16, 24, -20], [22, 22, 14], [28, 24, -8], [20, 26, 30], [27, 27, 18],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={3} ry={1.9} fill="#A65A38" stroke="#7A3E26" strokeWidth={0.5} transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <Face cy={31} s={0.9} />
        </g>
      );
    case "idli":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={16} ry={2.8} fill="#000" opacity={0.06} />
          <ellipse cx={24} cy={31} rx={17} ry={6} fill="#F6E7D8" stroke="#E0BFA8" strokeWidth={1.3} />
          <ellipse cx={16} cy={27} rx={7} ry={6} fill="#FFFDF7" stroke="#E8D9C4" strokeWidth={1.2} />
          <ellipse cx={31} cy={28} rx={6.5} ry={5.5} fill="#FFFDF7" stroke="#E8D9C4" strokeWidth={1.2} />
          <circle cx={36} cy={22} r={3.5} fill="#E08A3C" />
          <Face cx={16} cy={27} s={0.78} />
        </g>
      );
    case "sandwich":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={15} ry={2.6} fill="#000" opacity={0.06} />
          <path d="M9 33 L24 11 L39 33 Z" fill="#F2CD8E" stroke="#D9A85C" strokeWidth={1.4} />
          <path d="M11 31 q13 7 26 0" fill="none" stroke="#94C25C" strokeWidth={2.4} strokeLinecap="round" />
          <path d="M12 33.5 H36" stroke="#E0574F" strokeWidth={2} strokeLinecap="round" />
          <circle cx={24} cy={16} r={1.1} fill="#E6C24A" />
          <Face cy={25} s={0.95} />
        </g>
      );
    case "yogurt":
      return (
        <g>
          <ellipse cx={24} cy={43} rx={11} ry={2.2} fill="#000" opacity={0.06} />
          <path d="M14 18 H34 L31.5 40 a7 4 0 0 1 -15 0 Z" fill="#fff" stroke="#D9B6C8" strokeWidth={1.4} />
          <path d="M13 18 q11 -7 22 0 q-11 5 -22 0 Z" fill="#FBE3EC" stroke="#D9B6C8" strokeWidth={1.1} />
          <circle cx={22} cy={15} r={2} fill="#E0574F" />
          <circle cx={26} cy={16} r={1.6} fill="#7A4FB0" />
          <Face cy={30} s={0.95} />
        </g>
      );
    case "bottle":
      return (
        <g>
          <ellipse cx={24} cy={43} rx={8} ry={2} fill="#000" opacity={0.06} />
          <rect x={21} y={5} width={6} height={4} rx={1} fill="#9A6A3C" />
          <rect x={21.5} y={9} width={5} height={5} fill="#CFE0A0" stroke="#A9BE5C" strokeWidth={1} />
          <path d="M16 18 q8 -5 16 0 L32 38 a8 4 0 0 1 -16 0 Z" fill="#D7E59A" stroke="#A9BE5C" strokeWidth={1.4} />
          <rect x={18} y={26} width={12} height={9} rx={1.5} fill="#fff" opacity={0.85} />
          <circle cx={24} cy={30.5} r={2} fill="#9FBF5A" />
          <Face cy={21} s={0.8} />
        </g>
      );
    case "salsa":
      return (
        <g>
          <ellipse cx={24} cy={40} rx={15} ry={2.4} fill="#000" opacity={0.06} />
          <ellipse cx={24} cy={30} rx={16} ry={8} fill="#fff" stroke="#C99" strokeWidth={1.4} />
          <ellipse cx={24} cy={29} rx={12} ry={5.5} fill="#D6442F" />
          <circle cx={18} cy={28} r={1.3} fill="#9A2C1C" />
          <circle cx={29} cy={30} r={1.2} fill="#9A2C1C" />
          <circle cx={24} cy={31} r={1} fill="#7FA844" />
          <path d="M33 20 L41 17 L38 26 Z" fill="#F2CD8E" stroke="#D9A85C" strokeWidth={1} />
          <Face cy={29} s={0.85} />
        </g>
      );
    case "banana":
      return (
        <g>
          <ellipse cx={26} cy={41} rx={13} ry={2.4} fill="#000" opacity={0.06} />
          <path d="M12 16 q1 16 12 22 q11 6 14 -2 q-3 2 -7 1 q-9 -3 -14 -10 q-4 -6 -4 -12 q-1 0 -1 1 Z" fill="#F4D35E" stroke="#D9B23C" strokeWidth={1.4} />
          <path d="M11 15 q2 -2 3 1" stroke="#7A5A2A" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <path d="M37 39 q2 -1 2 -3" stroke="#7A5A2A" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <Face cx={22} cy={29} s={0.82} />
        </g>
      );
    case "plate":
    default:
      return (
        <g>
          <ellipse cx={24} cy={42} rx={15} ry={2.4} fill="#000" opacity={0.06} />
          <ellipse cx={24} cy={28} rx={17} ry={9} fill="#fff" stroke="#E0B0C2" strokeWidth={1.4} />
          <ellipse cx={24} cy={27} rx={11} ry={5.5} fill="#FBE3EC" />
          <Face cy={27} s={0.9} />
        </g>
      );
  }
}

const MAP: Record<string, Archetype> = {
  dal: "curry", roti: "flatbread", rice: "rice", curd: "yogurt", chai: "drink",
  paneer: "dairy", idli: "idli", dosa: "flatbread", rajma: "stew", sabzi: "salad",
  pickle: "jar", ghee: "dairy", hummus: "curry", "olive oil": "bottle",
  "grilled fish": "fish", feta: "dairy", falafel: "curry", tabbouleh: "salad",
  pita: "flatbread", "lentil soup": "curry", "greek yogurt": "yogurt", olives: "green",
  "miso udon": "noodle", tofu: "dairy", kimchi: "salad", ramen: "noodle",
  congee: "rice", dumplings: "dumpling", edamame: "green", beans: "beans",
  tortilla: "flatbread", avocado: "avocado", eggs: "egg", salsa: "salsa",
  plantain: "banana", oatmeal: "oats", smoothie: "smoothie", sandwich: "sandwich",
  coffee: "drink", salad: "salad",
};

const KEYWORDS: { match: RegExp; type: Archetype }[] = [
  { match: /olive oil|oil$|vinaigrette/i, type: "bottle" },
  { match: /yogurt|curd|kefir|raita|pudding|custard/i, type: "yogurt" },
  { match: /milk|cheese|paneer|tofu|ghee|butter|cream|feta/i, type: "dairy" },
  { match: /sandwich|sub|panini|burger|toast|wrap/i, type: "sandwich" },
  { match: /banana|plantain/i, type: "banana" },
  { match: /salsa|chutney|dip|guac/i, type: "salsa" },
  { match: /avocado/i, type: "avocado" },
  { match: /coffee|espresso|chai|tea|matcha|latte/i, type: "drink" },
  { match: /egg|omelet/i, type: "egg" },
  { match: /fish|salmon|tuna|prawn|shrimp/i, type: "fish" },
  { match: /noodle|ramen|udon|pasta|pho|spaghetti/i, type: "noodle" },
  { match: /dumpling|momo|gyoza|bao|samosa/i, type: "dumpling" },
  { match: /salad|greens|lettuce|spinach|kimchi|slaw|sabzi/i, type: "salad" },
  { match: /smoothie|shake|juice|soda/i, type: "smoothie" },
  { match: /oat|porridge|cereal|granola/i, type: "oats" },
  { match: /idli/i, type: "idli" },
  { match: /edamame|pea|olive/i, type: "green" },
  { match: /rajma|kidney bean|stew|gravy/i, type: "stew" },
  { match: /bean|lentil|chickpea/i, type: "beans" },
  { match: /rice|biryani|congee|pulao/i, type: "rice" },
  { match: /roti|bread|naan|pita|tortilla|dosa|chapati/i, type: "flatbread" },
  { match: /pickle|jam|jar|achar/i, type: "jar" },
  { match: /dal|curry|soup|hummus/i, type: "curry" },
];

function archetypeFor(item: string): Archetype {
  const key = item.trim().toLowerCase();
  if (MAP[key]) return MAP[key];
  for (const { match, type } of KEYWORDS) if (match.test(key)) return type;
  return "plate";
}

export default function KawaiiFood({
  item,
  size = 64,
  className = "",
  style,
}: {
  item: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={style}
      role="img"
      aria-label={item}
    >
      <Body type={archetypeFor(item)} />
    </svg>
  );
}
