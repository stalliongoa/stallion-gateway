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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
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
    
    // Extract more relevant content - increase limit for better extraction
    const truncatedContent = htmlContent.substring(0, 100000);

    console.log('Extracting product info with AI...');

    // Use Lovable AI to extract product information with enhanced prompt
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
            content: `You are an expert CCTV/Security product information extractor. Your task is to THOROUGHLY extract ALL product details from the HTML content provided. You must extract EVERY specification available - physical dimensions, weight, audio features, night vision details, smart features, warranty, etc.

IMPORTANT EXTRACTION RULES:
1. Look for ALL specification tables with key-value pairs - extract EVERYTHING
2. Extract data from product description sections thoroughly
3. Look for technical specifications in lists, bullet points, tables
4. Parse model numbers from product titles and headings
5. Find datasheet/manual URLs (look for PDF links)
6. Extract image URLs from img tags (especially product images)
7. ALWAYS extract physical details: dimensions (convert mm to cm), weight (convert grams to kg)
8. ALWAYS extract audio features: microphone, speaker, two-way audio
9. ALWAYS extract night vision details: IR range, color night vision, dual light
10. ALWAYS extract smart/AI features: motion detection, human detection, line crossing
11. ALWAYS extract warranty information

PHYSICAL DIMENSION EXTRACTION:
- Look for "Dimensions", "Size", "Product Size", "Body Size" fields
- Convert millimeters to centimeters (divide by 10)
- Format as "L x W x H" in cm (e.g., "12 x 8 x 6")
- Look for values like "120mm x 80mm x 60mm" and convert to "12 x 8 x 6"

WEIGHT EXTRACTION:
- Look for "Weight", "Net Weight", "Product Weight" fields
- Convert grams to kilograms (divide by 1000)
- Return as decimal number (e.g., 0.35 for 350g)
- Look for values like "350g" or "0.35kg"

AUDIO FEATURES:
- Look for "Audio", "Microphone", "Speaker", "Two-Way Audio" fields
- Check for "Built-in Mic", "Built-in Speaker", "Audio I/O"
- Determine audio_type: "Built-in Mic", "Built-in Mic & Speaker", "External", "None"

NIGHT VISION FEATURES:
- Look for "IR LED", "IR Range", "Illumination Distance", "Night Vision" fields
- Check "Day/Night" field - if "Color", then color_night_vision is true
- Look for "Warm White LED", "Full Color Night Vision"
- Extract exact IR range in meters (e.g., "30m")
- Check for "Dual Light" or "Smart IR"

SMART/AI FEATURES:
- Look for "Smart Event", "AI Features", "Intelligent Analysis" fields
- Common features: Motion Detection, Human Detection, Face Detection, Line Crossing, Intrusion Detection
- Check for "SMD" (Smart Motion Detection), "IVS", "VCA"

WARRANTY:
- Look for "Warranty", "Guarantee" fields
- Common values: "1 Year", "2 Years", "3 Years"

Return ONLY a valid JSON object with these fields (use null for missing values, true/false for boolean questions):

{
  "name": "full product name from title",
  "brand": "brand name (CP Plus, Hikvision, Dahua, etc.)",
  "model_number": "exact model number (e.g., CP-GPC-LT24L3)",
  "short_description": "brief product description max 200 chars",
  "description": "detailed product description",
  "dimensions_cm": "dimensions in format L x W x H cm (e.g., '12 x 8 x 6')",
  "weight_kg": weight as number in kg (e.g., 0.35 for 350g),
  "warranty_months": warranty in months as number (12 for 1 year, 24 for 2 years),
  "mrp": price as number without currency symbols,
  "datasheet_url": "URL to PDF datasheet if found",
  
  "specifications": {
    "cctv_system_type": "Analog or IP or WiFi",
    "camera_type": "Dome or Bullet or PTZ or Box or Fisheye or Turret",
    "indoor_outdoor": "Indoor or Outdoor or Both",
    "resolution": "1080p or 2K or 4K or 5MP",
    "megapixel": "2 MP or 4 MP or 5 MP or 8 MP",
    "lens_type": "Fixed or Varifocal or Motorized",
    "lens_size": "2.8mm or 3.6mm or 6mm",
    "frame_rate": "25 fps or 30 fps",
    "night_vision": true/false,
    "night_vision_type": "IR or Full Color or Dual Light",
    "ir_support": true/false,
    "ir_range": "20m or 30m or 40m or 50m",
    "bw_night_vision": true/false (true if has IR night vision),
    "color_night_vision": true/false (true if Day/Night: Color or has warm white LED),
    "audio_support": true/false,
    "audio_type": "Built-in Mic or Built-in Mic & Speaker or External or None",
    "two_way_audio": true/false,
    "motion_detection": true/false,
    "human_detection": true/false,
    "ai_features": ["Motion Detection", "Human Detection", "Line Crossing", etc.],
    "body_material": "Plastic or Metal or Aluminum",
    "color": "White or Black or Grey",
    "weatherproof_rating": "IP65 or IP66 or IP67",
    "power_type": "12V DC or PoE or Dual",
    "connector_type": "BNC or RJ45",
    "onboard_storage": true/false,
    "sd_card_support": "Up to 128 GB or Up to 256 GB or Up to 512 GB or None",
    "poe_support": true/false,
    "compatible_with": ["DVR"] for Analog, ["NVR"] for IP,
    "warranty_period": "1 Year or 2 Years or 3 Years"
  },
  
  "images": ["array of full image URLs found on page"]
}

CRITICAL MAPPING RULES:
- Guard+ or Analog series = cctv_system_type: "Analog"
- Network or IP series = cctv_system_type: "IP"
- 2.4MP should map to "2 MP" megapixel
- BodyType: Bullet = camera_type: "Bullet"
- IP66 weatherproof = indoor_outdoor: "Outdoor" or "Both"
- DC12V power = power_type: "12V DC"
- Casing: Plastic = body_material: "Plastic"
- If Illumination Distance or IR Range mentions meters, extract as ir_range
- Warm White LED or Day/Night: Color = color_night_vision: true
- For Analog cameras, connector_type should be "BNC"
- Extract datasheet URL if PDF link is found
- Built-in Audio or Mic = audio_support: true
- If Day/Night shows "Color" = color_night_vision: true
- Convert ALL dimensions from mm to cm
- Convert ALL weights from grams to kg

EXTRACT EVERY PIECE OF INFORMATION AVAILABLE. Do not leave fields empty if data exists.`
          },
          {
            role: "user",
            content: `Extract ALL product information from this HTML content. Pay special attention to:
1. Specification tables - extract ALL key-value pairs
2. Physical details: dimensions (convert mm to cm), weight (convert grams to kg)
3. Audio features: microphone, speaker, two-way audio
4. Night vision: IR range, color night vision, dual light
5. Smart features: motion detection, human detection, AI features
6. Warranty period

HTML Content:
${truncatedContent}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_product_info",
              description: "Extract complete product information from HTML content including physical dimensions, weight, audio, night vision, smart features, and warranty",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Product name" },
                  brand: { type: "string", description: "Brand name" },
                  model_number: { type: "string", description: "Model number" },
                  short_description: { type: "string", description: "Short description" },
                  description: { type: "string", description: "Full description" },
                  dimensions_cm: { type: "string", description: "Dimensions in cm format (L x W x H)" },
                  weight_kg: { type: "number", description: "Weight in kg" },
                  warranty_months: { type: "number", description: "Warranty in months" },
                  mrp: { type: "number", description: "MRP price" },
                  datasheet_url: { type: "string", description: "Datasheet PDF URL" },
                  specifications: {
                    type: "object",
                    properties: {
                      cctv_system_type: { type: "string", enum: ["Analog", "IP", "WiFi"] },
                      camera_type: { type: "string", enum: ["Dome", "Bullet", "PTZ", "Box", "Fisheye", "Turret"] },
                      indoor_outdoor: { type: "string", enum: ["Indoor", "Outdoor", "Both"] },
                      resolution: { type: "string" },
                      megapixel: { type: "string" },
                      lens_type: { type: "string", enum: ["Fixed", "Varifocal", "Motorized"] },
                      lens_size: { type: "string" },
                      frame_rate: { type: "string" },
                      night_vision: { type: "boolean" },
                      night_vision_type: { type: "string" },
                      ir_support: { type: "boolean" },
                      ir_range: { type: "string" },
                      bw_night_vision: { type: "boolean" },
                      color_night_vision: { type: "boolean" },
                      audio_support: { type: "boolean" },
                      audio_type: { type: "string" },
                      two_way_audio: { type: "boolean" },
                      motion_detection: { type: "boolean" },
                      human_detection: { type: "boolean" },
                      ai_features: { type: "array", items: { type: "string" } },
                      body_material: { type: "string", enum: ["Plastic", "Metal", "Aluminum"] },
                      color: { type: "string" },
                      weatherproof_rating: { type: "string" },
                      power_type: { type: "string" },
                      connector_type: { type: "string", enum: ["BNC", "RJ45", "WiFi"] },
                      onboard_storage: { type: "boolean" },
                      sd_card_support: { type: "string" },
                      poe_support: { type: "boolean" },
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
    console.log('Product info extracted:', JSON.stringify(productInfo, null, 2));

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