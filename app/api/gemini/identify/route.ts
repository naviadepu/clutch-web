import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export async function POST(request: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ item: "meal", portionHint: null }, { status: 500 });

  const body = await request.json().catch(() => null);
  const imageBase64: string = body?.imageBase64 ?? "";
  const mimeType: string = body?.mimeType ?? "image/jpeg";
  if (!imageBase64) return NextResponse.json({ item: "meal", portionHint: null }, { status: 400 });

  const prompt = `Identify the food in this image. Be specific but brief (1-4 words, lowercase, e.g. "paneer butter masala", "avocado toast", "biryani").
If multiple dishes are visible, name the main one.
Estimate a portion label if possible (e.g. "one plate", "1 bowl", "2 pieces").

Reply ONLY with this JSON, no markdown, no other text:
{"item":"food name","portionHint":"one plate"}

If no food is clearly visible: {"item":"meal","portionHint":null}`;

  const groqRes = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 80,
    }),
  }).catch(() => null);

  if (!groqRes?.ok) {
    console.error("[identify] groq error", groqRes?.status);
    return NextResponse.json({ item: "meal", portionHint: null });
  }

  const data = await groqRes.json().catch(() => null);
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  console.log("[identify] groq raw:", text);

  const match = text.match(/\{[\s\S]+\}/);
  if (!match) return NextResponse.json({ item: "meal", portionHint: null });

  try {
    const result = JSON.parse(match[0]);
    return NextResponse.json({
      item: typeof result.item === "string" ? result.item : "meal",
      portionHint: result.portionHint ?? null,
    });
  } catch {
    return NextResponse.json({ item: "meal", portionHint: null });
  }
}
