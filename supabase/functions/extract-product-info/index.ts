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
            content: `You are a CCTV/Security product information extractor. Extract product details from the HTML content provided. Return ONLY a valid JSON object with the following fields (use null for missing values):
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
    "cctv_system_type": "IP or Analog or HD-CVI or HD-TVI (determine from product specs)",
    "camera_type": "Dome or Bullet or PTZ or Box or Fisheye or Turret",
    "indoor_outdoor": "Indoor or Outdoor or Both",
    "resolution": "1080p or 2K or 4K or 5MP or 8MP",
    "megapixel": "2 MP or 3 MP or 4 MP or 5 MP or 8 MP",
    "lens_type": "Fixed or Varifocal or Motorized",
    "lens_size": "2.8mm or 3.6mm or 6mm or 2.8-12mm or other",
    "frame_rate": "25 fps or 30 fps or 15 fps",
    "night_vision": "Yes or No",
    "night_vision_type": "IR or Full Color or Dual Light",
    "ir_support": "Yes or No",
    "ir_range": "20m or 30m or 40m or 50m",
    "bw_night_vision": "Yes or No",
    "color_night_vision": "Yes or No",
    "audio_support": "Yes or No",
    "audio_type": "Built-in Mic or Built-in Mic & Speaker or External",
    "motion_detection": "Yes or No",
    "human_detection": "Yes or No",
    "ai_features": ["Face Detection", "Line Crossing", "Intrusion Detection"],
    "body_material": "Plastic or Metal or Aluminum",
    "color": "White or Black or Grey",
    "weatherproof_rating": "IP65 or IP66 or IP67 or None",
    "power_type": "12V DC or PoE or Dual (PoE/12V DC)",
    "connector_type": "BNC or RJ45",
    "onboard_storage": "Yes or No",
    "sd_card_support": "Up to 128 GB or Up to 256 GB or Up to 512 GB or None",
    "wifi_band": "2.4 GHz or Dual Band (2.4 + 5 GHz)",
    "two_way_audio": "Yes or No",
    "pan_support": "Yes or No",
    "tilt_support": "Yes or No",
    "field_of_view": "90° or 110° or 130°",
    "channels": "number of channels for DVR/NVR",
    "hdd_capacity": "1TB or 2TB or 4TB",
    "poe_support": "Yes or No",
    "compatible_with": ["Hikvision", "Dahua", "CP Plus"],
    "warranty_period": "1 Year or 2 Years or 3 Years or 5 Years"
  },
  "images": ["array of image URLs found"]
}

IMPORTANT: Determine cctv_system_type from the product - if it mentions IP/Network camera use "IP", if analog use "Analog", if HD-CVI/TVI use appropriate type.
For camera_type, analyze the product name and description to determine if it's Dome, Bullet, PTZ, etc.
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
                      cctv_system_type: { type: "string" },
                      camera_type: { type: "string" },
                      indoor_outdoor: { type: "string" },
                      resolution: { type: "string" },
                      megapixel: { type: "string" },
                      lens_type: { type: "string" },
                      lens_size: { type: "string" },
                      frame_rate: { type: "string" },
                      night_vision: { type: "string" },
                      night_vision_type: { type: "string" },
                      ir_support: { type: "string" },
                      ir_range: { type: "string" },
                      bw_night_vision: { type: "string" },
                      color_night_vision: { type: "string" },
                      audio_support: { type: "string" },
                      audio_type: { type: "string" },
                      motion_detection: { type: "string" },
                      human_detection: { type: "string" },
                      ai_features: { type: "array", items: { type: "string" } },
                      body_material: { type: "string" },
                      color: { type: "string" },
                      weatherproof_rating: { type: "string" },
                      power_type: { type: "string" },
                      connector_type: { type: "string" },
                      onboard_storage: { type: "string" },
                      sd_card_support: { type: "string" },
                      wifi_band: { type: "string" },
                      two_way_audio: { type: "string" },
                      pan_support: { type: "string" },
                      tilt_support: { type: "string" },
                      field_of_view: { type: "string" },
                      channels: { type: "number" },
                      hdd_capacity: { type: "string" },
                      poe_support: { type: "string" },
                      compatible_with: { type: "array", items: { type: "string" } },
                      warranty_period: { type: "string" }
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
