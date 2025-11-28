import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuditRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auditRequest: AuditRequest = await req.json();
    console.log("Received audit request:", auditRequest);

    // Send email to Stallion
    const emailResponse = await resend.emails.send({
      from: "Stallion IT Solutions <onboarding@resend.dev>",
      to: ["info@stallion.co.in"],
      subject: `New Free IT Audit Request from ${auditRequest.name}`,
      html: `
        <h1>New Free IT Audit Request</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${auditRequest.name}</p>
        <p><strong>Company:</strong> ${auditRequest.company || "Not provided"}</p>
        <p><strong>Email:</strong> ${auditRequest.email}</p>
        <p><strong>Phone:</strong> ${auditRequest.phone}</p>
        <p><strong>Location:</strong> ${auditRequest.location || "Not provided"}</p>
        <p><strong>Service Interest:</strong> ${auditRequest.service || "Not specified"}</p>
        
        <h2>Message</h2>
        <p>${auditRequest.message || "No message provided"}</p>
        
        <hr />
        <p style="font-size: 12px; color: #666;">
          This email was sent from the Stallion IT Solutions website contact form.
        </p>
      `,
    });

    console.log("Email sent successfully to info@stallion.co.in:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-audit-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
