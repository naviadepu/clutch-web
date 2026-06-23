import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: "no key" }, { status: 500 });

  const body = await request.json().catch(() => null);
  const item = typeof body?.item === "string" ? body.item.trim() : "";
  if (!item) return NextResponse.json({ error: "item required" }, { status: 400 });

  const prompt = `You are a nutritionist. The user logged this item: "${item}"

First, check: is this a real food or drink that a person can eat? If it is NOT food (e.g. it is an object, material, place, animal, or anything not edible), reply ONLY with this exact JSON, nothing else:
{"error":"not_food"}

If it IS food, estimate nutrition for a typical single serving and reply ONLY with this exact JSON, no markdown, no backticks, no extra text:
{"calories":250,"protein":12,"carbs":35,"fat":8,"sugar":3,"portionGrams":200,"portionLabel":"one plate"}`;

  const groqRes = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 150,
    }),
  }).catch(() => null);

  if (!groqRes?.ok) {
    console.error("[nutrition] groq error", groqRes?.status);
    return NextResponse.json({ error: "groq error" }, { status: groqRes?.status === 429 ? 429 : 502 });
  }

  const data = await groqRes.json().catch(() => null);
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  console.log("[nutrition] groq raw:", text);

  const match = text.match(/\{[\s\S]+\}/);
  if (!match) {
    console.error("[nutrition] no JSON found in:", text);
    return NextResponse.json({ error: "parse error" }, { status: 502 });
  }

  try {
    const raw = JSON.parse(match[0]);
    if (raw.error === "not_food") {
      return NextResponse.json({ error: "not_food" }, { status: 422 });
    }
    const nutrition = {
      calories: Math.round(Number(raw.calories)),
      protein: Math.round(Number(raw.protein)),
      carbs: Math.round(Number(raw.carbs)),
      fat: Math.round(Number(raw.fat)),
      sugar: Math.round(Number(raw.sugar)),
      portionGrams: Math.round(Number(raw.portionGrams)),
      portionLabel: String(raw.portionLabel ?? "1 serving"),
    };
    if (!Number.isFinite(nutrition.calories) || nutrition.calories <= 0) {
      console.error("[nutrition] bad calories:", raw.calories);
      return NextResponse.json({ error: "invalid calories" }, { status: 502 });
    }
    return NextResponse.json(nutrition);
  } catch (e) {
    console.error("[nutrition] parse error:", e);
    return NextResponse.json({ error: "parse error" }, { status: 502 });
  }
}
