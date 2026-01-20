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
    const { type, kitData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "description") {
      systemPrompt = `You are a professional CCTV and security equipment copywriter. Write compelling, technical, and marketing-friendly product descriptions for CCTV kits. Keep descriptions concise but informative, highlighting key benefits and features.`;
      
      userPrompt = `Generate a professional product description for this CCTV kit:
      
Kit Name: ${kitData.name}
Kit Type: ${kitData.kit_type} (${kitData.kit_type === 'analog' ? 'Analog/HD' : kitData.kit_type === 'ip' ? 'IP/Network' : 'WiFi/Wireless'})
Channel Capacity: ${kitData.channel_capacity} Channels
Camera Resolution: ${kitData.camera_resolution}
Brand: ${kitData.brandName || 'Generic'}

Included Items:
${kitData.items?.map((item: any) => `- ${item.quantity}x ${item.product_name}`).join('\n') || 'Not specified'}

Write a 2-3 paragraph description that:
1. Highlights the key features and benefits
2. Mentions the resolution and recording capabilities
3. Discusses ease of installation and use
4. Ends with a call-to-action

Keep the tone professional yet accessible. Do not use markdown formatting.`;
    } else if (type === "image") {
      systemPrompt = `You are an expert at creating detailed image generation prompts for professional CCTV and security equipment photography.`;
      
      userPrompt = `Create a detailed image generation prompt for a professional product photo of this CCTV kit:

Kit Name: ${kitData.name}
Kit Type: ${kitData.kit_type}
Channel Capacity: ${kitData.channel_capacity} Channels
Camera Resolution: ${kitData.camera_resolution}
Brand: ${kitData.brandName || 'Generic'}

The prompt should describe:
- A clean, professional product photography setup
- Multiple CCTV cameras and a DVR/NVR unit arranged attractively
- Professional lighting with white or gradient background
- Modern, high-tech aesthetic
- ${kitData.kit_type === 'ip' ? 'Sleek IP cameras with network cables' : kitData.kit_type === 'wifi' ? 'Modern wireless cameras' : 'Professional analog cameras with coaxial cables'}

Return ONLY the image generation prompt, nothing else. Keep it under 200 words.`;
    } else {
      throw new Error("Invalid type. Use 'description' or 'image'");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // If type is image, generate the actual image
    if (type === "image") {
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            { role: "user", content: content },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error("Image generation error:", imageResponse.status, errorText);
        throw new Error(`Image generation failed: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error("No image generated");
      }

      return new Response(JSON.stringify({ content: imageUrl, prompt: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
