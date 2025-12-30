import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { fileContent, fileType, mimeType } = await req.json();
    
    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: 'No file content provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracting purchase/invoice info from file type:', mimeType || fileType);

    const systemPrompt = `You are an expert at extracting purchase and invoice information from documents.
Extract the following information from the provided document (invoice, purchase order, bill, etc.):

VENDOR INFORMATION:
- vendor_name: Company/vendor name
- vendor_gst_number: GST Number (GSTIN) in format like 27AAACR5055K1ZS
- vendor_address: Full address
- vendor_phone: Phone number
- vendor_email: Email address
- vendor_contact_person: Contact person name

INVOICE/PURCHASE DETAILS:
- invoice_number: Invoice/Bill number
- invoice_date: Date in YYYY-MM-DD format
- purchase_date: Purchase/Order date in YYYY-MM-DD format (if different from invoice date)

LINE ITEMS (extract all items as array):
- items: Array of {
    product_name: Product/item description,
    product_sku: SKU/Part number if available,
    hsn_code: HSN/SAC code if available,
    quantity: Number of units,
    unit_cost: Price per unit (excluding GST),
    gst_rate: GST percentage (e.g., 18),
    total_cost: Total cost for this line item
  }

TOTALS:
- subtotal: Total before taxes
- gst_amount: Total GST/Tax amount
- total_amount: Grand total including taxes
- payment_status: "paid" or "pending" (based on any payment info in document)

Extract ONLY what's clearly visible in the document. Use null for missing fields.
Return as valid JSON only.`;

    // Build message content based on file type
    let messageContent: any[];
    
    if (mimeType?.startsWith('image/') || fileType === 'image') {
      // For images, use vision capability
      messageContent = [
        {
          type: "image_url",
          image_url: {
            url: fileContent.startsWith('data:') ? fileContent : `data:${mimeType || 'image/jpeg'};base64,${fileContent}`
          }
        },
        {
          type: "text",
          text: "Extract all purchase/invoice information from this document image."
        }
      ];
    } else {
      // For text/PDF content
      messageContent = [
        {
          type: "text",
          text: `Extract all purchase/invoice information from this document:\n\n${fileContent}`
        }
      ];
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: messageContent }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_purchase_info",
              description: "Extract structured purchase/invoice information from document",
              parameters: {
                type: "object",
                properties: {
                  vendor_name: { type: "string", description: "Vendor/supplier company name" },
                  vendor_gst_number: { type: "string", description: "Vendor GST number (GSTIN)" },
                  vendor_address: { type: "string", description: "Vendor full address" },
                  vendor_phone: { type: "string", description: "Vendor phone number" },
                  vendor_email: { type: "string", description: "Vendor email" },
                  vendor_contact_person: { type: "string", description: "Contact person name" },
                  invoice_number: { type: "string", description: "Invoice or bill number" },
                  invoice_date: { type: "string", description: "Invoice date in YYYY-MM-DD format" },
                  purchase_date: { type: "string", description: "Purchase date in YYYY-MM-DD format" },
                  items: {
                    type: "array",
                    description: "Line items from invoice",
                    items: {
                      type: "object",
                      properties: {
                        product_name: { type: "string" },
                        product_sku: { type: "string" },
                        hsn_code: { type: "string" },
                        quantity: { type: "number" },
                        unit_cost: { type: "number" },
                        gst_rate: { type: "number" },
                        total_cost: { type: "number" }
                      },
                      required: ["product_name", "quantity", "unit_cost"]
                    }
                  },
                  subtotal: { type: "number", description: "Total before taxes" },
                  gst_amount: { type: "number", description: "Total GST amount" },
                  total_amount: { type: "number", description: "Grand total" },
                  payment_status: { type: "string", enum: ["paid", "pending"], description: "Payment status" }
                },
                required: ["vendor_name", "items"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_purchase_info" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to process document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const extractedInfo = JSON.parse(toolCall.function.arguments);
      console.log('Extracted info:', JSON.stringify(extractedInfo, null, 2));
      
      return new Response(
        JSON.stringify({ success: true, data: extractedInfo }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: try to parse content directly
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedInfo = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ success: true, data: extractedInfo }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        console.error('Failed to parse content as JSON:', e);
      }
    }

    return new Response(
      JSON.stringify({ error: 'Could not extract information from document' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-purchase-info:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
