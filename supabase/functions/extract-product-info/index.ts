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
    const truncatedContent = htmlContent.substring(0, 80000);

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
            content: `You are an expert CCTV/Security product information extractor. Your task is to THOROUGHLY extract ALL product details from the HTML content provided.

IMPORTANT EXTRACTION RULES:
1. Look for specification tables with key-value pairs
2. Extract data from product description sections
3. Look for technical specifications in lists or bullet points
4. Parse model numbers from product titles and headings
5. Find datasheet/manual URLs
6. Extract image URLs from img tags

Return ONLY a valid JSON object with these fields (use null for missing values, true/false for boolean questions):

{
  "name": "full product name from title",
  "brand": "brand name (CP Plus, Hikvision, Dahua, etc.)",
  "model_number": "exact model number (e.g., CP-GPC-LT24L3)",
  "short_description": "brief product description max 200 chars",
  "description": "detailed product description",
  "dimensions_cm": "dimensions in format LxWxH (convert from mm if needed)",
  "weight_kg": "weight as number (convert from grams if needed)",
  "warranty_months": "warranty in months as number",
  "mrp": "price as number without currency symbols",
  "datasheet_url": "URL to PDF datasheet if found",
  
  "specifications": {
    "cctv_system_type": "Analog or IP or WiFi (determine from product - Guard+/Analog cameras are 'Analog', Network/IP cameras are 'IP')",
    "camera_type": "Dome or Bullet or PTZ or Box or Fisheye or Turret (from BodyType field)",
    "indoor_outdoor": "Indoor or Outdoor or Both (from IP rating - IP65+ means Outdoor capable)",
    "resolution": "1080p or 2K or 4K or 5MP (based on megapixel: 2MP=1080p, 4MP=2K, 5MP=5MP, 8MP=4K)",
    "megapixel": "2 MP or 4 MP or 5 MP or 8 MP (extract from Image Sensor or product name - 2.4MP rounds to 2 MP)",
    "lens_type": "Fixed or Varifocal or Motorized (from Lens Type or Focus Control)",
    "lens_size": "2.8mm or 3.6mm or 6mm or actual value",
    "frame_rate": "25 fps or 30 fps (from Video Streaming or Max Frame Rate)",
    "night_vision": true if camera has IR LED or warm white LED or any night capability,
    "night_vision_type": "IR or Full Color or Dual Light (Full Color if has white LED)",
    "ir_support": true if has Infrared LED or IR capability,
    "ir_range": "20m or 30m or 40m or 50m (from Illumination Distance or IR Range)",
    "bw_night_vision": true if has IR night vision capability,
    "color_night_vision": true if has Full Color or Warm White night vision (Day/Night: Color means true),
    "audio_support": true if has microphone or audio input,
    "audio_type": "Built-in Mic or Built-in Mic & Speaker or External or None",
    "motion_detection": true if has motion detection feature,
    "human_detection": true if has human detection or AI detection,
    "ai_features": ["Face Detection", "Line Crossing", "Intrusion Detection"] - only include if mentioned,
    "body_material": "Plastic or Metal or Aluminum (from Casing or Body Material)",
    "color": "White or Black or Grey",
    "weatherproof_rating": "IP65 or IP66 or IP67 (from Weatherproof Standard or IP Rating)",
    "power_type": "12V DC or PoE or Dual (from Power Source - DC12V means 12V DC)",
    "connector_type": "BNC or RJ45 (Analog=BNC, IP=RJ45)",
    "onboard_storage": true if has SD card slot,
    "sd_card_support": "Up to 128 GB or Up to 256 GB or Up to 512 GB or None",
    "poe_support": true if PoE is mentioned,
    "compatible_with": ["DVR"] for Analog cameras, ["NVR"] for IP cameras, ["Both"] for dual,
    "warranty_period": "1 Year or 2 Years or 3 Years or 5 Years"
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
- If Illumination Distance mentions meters, extract as ir_range
- Warm White LED or Day/Night: Color = color_night_vision: true
- For Analog cameras, connector_type should be "BNC"
- Extract datasheet URL if PDF link is found

EXTRACT EVERY PIECE OF INFORMATION AVAILABLE. Do not leave fields empty if data exists.`
          },
          {
            role: "user",
            content: `Extract ALL product information from this HTML content. Pay special attention to specification tables:\n\n${truncatedContent}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_product_info",
              description: "Extract complete product information from HTML content",
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
