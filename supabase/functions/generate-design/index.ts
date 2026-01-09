import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const stylePrompts: Record<string, string> = {
      "neon-green": "neon green glowing (#00FF41), cyberpunk style",
      "cyber-blue": "electric cyan blue (#00D4FF), futuristic cyber aesthetic",
      "pink-glitch": "hot magenta pink (#FF00FF), glitch art with digital artifacts",
      "yellow-fire": "bright yellow (#FFFF00), fiery energy with flame effects",
    };

    const styleModifier = stylePrompts[style] || stylePrompts["neon-green"];

    const fullPrompt = `Create a street art graffiti design: ${prompt}. 
Style: ${styleModifier}.
Requirements:
- Dark background (#0A0A0A)
- Neon glowing effects with bright outlines
- Spray paint texture and drip effects
- Urban graffiti aesthetic
- High contrast, bold colors
- Perfect for printing on a hoodie or keychain
- Clean edges for easy cutting
- High resolution street art style`;

    console.log("Generating design with prompt:", fullPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: fullPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Design generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI design response received");

    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!generatedImage) {
      console.error("No image in response");
      return new Response(
        JSON.stringify({ 
          error: "No design generated",
          textResponse: textResponse || "Design generation did not produce an image"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        image: generatedImage,
        message: textResponse || "Your custom street art design is ready! 🎨🔥"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate design error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
