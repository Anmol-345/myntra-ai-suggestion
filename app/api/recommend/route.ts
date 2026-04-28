import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Support both env var names
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
  // 1. Parse body FIRST so `occasion` is always in scope for the fallback
  let occasion = "Casual";
  let gender = "";
  let style = "General";

  try {
    const body = await req.json();
    occasion = body.occasion || "Casual";
    gender = body.gender || "";
    style = body.style || "General";
  } catch {
    // body parse failure — use defaults above
  }

  // 2. Guard: API key must exist
  if (!apiKey) {
    console.error("❌ Missing Gemini API Key");
    return NextResponse.json({
      title: `${occasion} Look`,
      description: "Our AI stylist needs an API key. Add GEMINI_API_KEY to .env.local and restart.",
      categories: gender === "Women" ? ["women's clothing"] : ["men's clothing"],
      isFallback: true,
    });
  }

  try {
    // 3. Use the new @google/genai SDK (v1 API, not v1beta)
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a professional fashion stylist.

Suggest a clothing outfit for:
- Occasion: ${occasion}
- Gender: ${gender || "Any"}
- Style: ${style}

Return ONLY valid JSON with exactly these keys (no markdown, no explanation):
{"title":"Outfit name","description":"Short 1-2 line fashion description","categories":["men's clothing"]}

The categories array must contain only values from: ["men's clothing", "women's clothing", "jewelery"]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text ?? "";

    // 4. Robust JSON extraction (handles ```json ... ``` wrappers)
    let recommendation;
    try {
      const clean = text.replace(/```json|```/gi, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      recommendation = JSON.parse(match ? match[0] : clean);
    } catch {
      throw new Error(`Invalid JSON from Gemini: ${text}`);
    }

    // 5. Ensure categories is always an array
    if (!Array.isArray(recommendation.categories)) {
      recommendation.categories = gender === "Women" ? ["women's clothing"] : ["men's clothing"];
    }

    return NextResponse.json(recommendation);

  } catch (error) {
    console.error("Gemini API Call Failed:", error);

    // 6. Always return a valid fallback — never crash the frontend
    return NextResponse.json({
      title: `${occasion} Look`,
      description: "A balanced outfit combining comfort and style suitable for your occasion.",
      categories: gender === "Women" ? ["women's clothing"] : ["men's clothing"],
      isFallback: true,
    });
  }
}