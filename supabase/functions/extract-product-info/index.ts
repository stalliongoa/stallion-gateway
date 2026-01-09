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
    console.log('Content length:', truncatedContent.length, 'chars');

    // Use Lovable AI to extract product information with enhanced prompt
    // Using gemini-2.5-pro for better extraction accuracy
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are a CCTV product data extractor. Extract ALL specifications from HTML tables. The data is in <table> elements with <tr> rows containing <strong> labels and values.

EXTRACTION MAPPING (Label -> JSON field):
- "Dimension" -> dimensions_cm (convert mm to cm, format: "W x H x L")
- "Weight" -> weight_kg (convert grams to kg decimal, e.g., 183g = 0.183)
- "Illumination Distance" or "IR Range" -> specifications.ir_range (e.g., "30m")
- "Day/Night" with value "Color" -> specifications.color_night_vision = true
- "Infrared LED" or "Warm white" -> specifications.night_vision = true
- "Power Source" with "DC12V" -> specifications.power_type = "12V DC"
- "Weatherproof Standard" -> specifications.weatherproof_rating
- "Casing" -> specifications.body_material
- "BodyType" -> specifications.camera_type
- "Lens" -> specifications.lens_size
- "Lens Type" -> specifications.lens_type
- "Video Streaming" -> specifications.frame_rate (extract fps)
- href with ".pdf" and "datasheet" -> datasheet_url
- Guard+ or Analog -> specifications.cctv_system_type = "Analog"
- specifications.connector_type = "BNC" for Analog cameras

CRITICAL: You MUST extract these fields if present in HTML:
- dimensions_cm: Look for "Dimension" row
- weight_kg: Look for "Weight" row
- ir_range: Look for "Illumination Distance" row
- color_night_vision: Check if "Day/Night" = "Color"
- power_type: Look for "Power Source" row
- body_material: Look for "Casing" row
- weatherproof_rating: Look for "Weatherproof Standard" row
- lens_size: Look for "Lens" row
- datasheet_url: Look for PDF href with "datasheet"

Return valid JSON only.`
          },
          {
            role: "user",
            content: `Extract ALL data from this product page HTML. Pay attention to the specification table rows.

EXAMPLE of what to find:
- <td><strong>Dimension</strong></td><td>69.8mm(W) x 67.9mm(H) x 174mm(L)</td> -> dimensions_cm: "7 x 6.8 x 17.4"
- <td><strong>Weight</strong></td><td>183g</td> -> weight_kg: 0.183
- <td><strong>Illumination Distance</strong></td><td>...up to 30 Mtr.</td> -> ir_range: "30m"
- <td><strong>Day/Night</strong></td><td>Color</td> -> color_night_vision: true
- <td><strong>Power Source</strong></td><td>DC12V±10%</td> -> power_type: "12V DC"
- href="...datasheet/CP-GPC-LT24L3.pdf" -> datasheet_url: "https://..."

HTML:
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