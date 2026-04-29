import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelId = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

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
  if (!apiKey || apiKey === "your_open_router_key_here") {
    console.error("❌ OpenRouter API Key is missing or invalid in .env.local");
    return NextResponse.json({
      title: `${occasion} Look`,
      description: "OpenRouter API key is missing or is still the placeholder. Please add a valid OPENROUTER_API_KEY to your .env.local file and restart your server.",
      categories: ["Topwear", "Bottomwear"],
      isFallback: true,
    });
  }

  try {
    const prompt = `You are a professional fashion stylist.

Suggest a clothing outfit for:
- Occasion: ${occasion}
- Gender: ${gender || "Any"}
- Style: ${style}

Return ONLY valid JSON with exactly these keys (no markdown, no explanation):
{"title":"Outfit name","description":"Short 1-2 line fashion description","categories":["Topwear"]}

The categories array must contain only values from: ["Topwear", "Bottomwear", "Dress", "Outerwear", "Activewear", "Loungewear", "Innerwear"]`;

    // 3. Call OpenRouter API with a fast failover strategy
    const models = [
      "meta-llama/llama-3.3-70b-instruct:free", 
      "google/gemma-2-9b-it:free"
    ];
    
    let response;
    let lastError = "";

    for (const model of models) {
      try {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AuraStyle Local",
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }]
          }),
        });

        if (response.ok) break; // Success!
        
        // If we get an error, capture it and try the next model
        const errBody = await response.json().catch(() => ({}));
        lastError = errBody?.error?.message || response.statusText;
        console.warn(`⚠️ Model ${model} failed: ${lastError}. Trying next...`);
      } catch (e: any) {
        lastError = e.message;
        console.warn(`⚠️ Fetch failed for ${model}: ${e.message}`);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    // 4. Robust JSON extraction (handles ```json ... ``` wrappers)
    let recommendation;
    try {
      const clean = text.replace(/```json|```/gi, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      recommendation = JSON.parse(match ? match[0] : clean);
    } catch {
      throw new Error(`Invalid JSON from OpenRouter: ${text}`);
    }

    // 5. Ensure categories is always an array
    if (!Array.isArray(recommendation.categories)) {
      recommendation.categories = ["Topwear", "Bottomwear"];
    }

    return NextResponse.json(recommendation);

  } catch (error) {
    console.error("OpenRouter API Call Failed:", error);

    // 6. Always return a valid fallback — never crash the frontend
    return NextResponse.json({
      title: `${occasion} Look`,
      description: "A balanced outfit combining comfort and style suitable for your occasion (API Quota Exceeded - using fallback).",
      categories: ["Topwear", "Bottomwear"],
      isFallback: true,
    });
  }
}