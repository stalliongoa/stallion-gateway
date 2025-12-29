import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching product page:', url);

    // Fetch the product page content
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });

    if (!pageResponse.ok) {
      console.error('Failed to fetch page:', pageResponse.status);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch product page' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const htmlContent = await pageResponse.text();
    
    // Limit content to avoid token limits
    const truncatedContent = htmlContent.substring(0, 50000);

    console.log('Extracting product info with AI...');

    // Use Lovable AI to extract product information
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a product information extractor. Extract product details from the HTML content provided. Return ONLY a valid JSON object with the following fields (use null for missing values):
{
  "name": "product name",
  "brand": "brand name",
  "model_number": "model number/name",
  "short_description": "brief product description (max 200 chars)",
  "description": "detailed product description",
  "dimensions_cm": "dimensions in format LxWxH",
  "weight_kg": "weight as a number",
  "warranty_months": "warranty period in months as number",
  "mrp": "maximum retail price as number",
  "specifications": {
    "resolution": "e.g., 1080p, 2K, 4K",
    "megapixel": "e.g., 2 MP, 4 MP",
    "night_vision": "Yes or No",
    "night_vision_type": "e.g., IR, Full Color",
    "ir_range": "e.g., 20m, 30m",
    "wifi_band": "e.g., 2.4 GHz, Dual Band",
    "power_type": "e.g., Adapter, Battery, Solar",
    "two_way_audio": "Yes or No",
    "motion_detection": "Yes or No",
    "weatherproof_rating": "e.g., IP65, IP66, IP67",
    "storage_type": "e.g., SD Card, Cloud",
    "lens_type": "e.g., Fixed, Wide Angle",
    "field_of_view": "e.g., 110°, 130°",
    "pan_support": "Yes or No",
    "tilt_support": "Yes or No",
    "channels": "number of channels for DVR/NVR",
    "hdd_capacity": "e.g., 1TB, 2TB",
    "poe_support": "Yes or No"
  },
  "images": ["array of image URLs found"]
}

Extract as much information as possible. For specifications, only include fields that are found in the content.`
          },
          {
            role: "user",
            content: `Extract product information from this HTML content:\n\n${truncatedContent}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_product_info",
              description: "Extract product information from HTML content",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Product name" },
                  brand: { type: "string", description: "Brand name" },
                  model_number: { type: "string", description: "Model number" },
                  short_description: { type: "string", description: "Short description" },
                  description: { type: "string", description: "Full description" },
                  dimensions_cm: { type: "string", description: "Dimensions" },
                  weight_kg: { type: "number", description: "Weight in kg" },
                  warranty_months: { type: "number", description: "Warranty in months" },
                  mrp: { type: "number", description: "MRP price" },
                  specifications: {
                    type: "object",
                    properties: {
                      resolution: { type: "string" },
                      megapixel: { type: "string" },
                      night_vision: { type: "string" },
                      night_vision_type: { type: "string" },
                      ir_range: { type: "string" },
                      wifi_band: { type: "string" },
                      power_type: { type: "string" },
                      two_way_audio: { type: "string" },
                      motion_detection: { type: "string" },
                      weatherproof_rating: { type: "string" },
                      storage_type: { type: "string" },
                      lens_type: { type: "string" },
                      field_of_view: { type: "string" },
                      pan_support: { type: "string" },
                      tilt_support: { type: "string" },
                      channels: { type: "number" },
                      hdd_capacity: { type: "string" },
                      poe_support: { type: "string" }
                    }
                  },
                  images: { type: "array", items: { type: "string" } }
                },
                required: ["name"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_product_info" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'AI extraction failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    // Extract the tool call result
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      console.error('No tool call in response');
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to extract product information' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const productInfo = JSON.parse(toolCall.function.arguments);
    console.log('Product info extracted:', productInfo.name);

    return new Response(
      JSON.stringify({ success: true, data: productInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error extracting product info:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
