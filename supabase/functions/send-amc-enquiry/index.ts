import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AMCEnquiry {
  propertyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  propertyType: string;
  location: string;
  numberOfCameras: string;
  currentSystem: string;
  preferredPlan: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const enquiry: AMCEnquiry = await req.json();

    const emailHtml = `
      <h2>New CCTV AMC Enquiry</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Property / Company Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.propertyName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Contact Person</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.contactPerson}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Property Type</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.propertyType || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Location</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.location || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Number of Cameras</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.numberOfCameras || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Current System</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.currentSystem || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Preferred Plan</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.preferredPlan || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message / Requirements</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${enquiry.message || 'No additional message'}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666;">This enquiry was submitted through the CCTV AMC page on stallion.co.in</p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Stallion CCTV AMC <onboarding@resend.dev>",
      to: ["info@stallion.co.in"],
      subject: `New CCTV AMC Enquiry from ${enquiry.propertyName}`,
      html: emailHtml,
      replyTo: enquiry.email,
    });

    console.log("AMC enquiry email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-amc-enquiry function:", error);
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
