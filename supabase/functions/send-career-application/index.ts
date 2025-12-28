import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CareerApplication {
  name: string;
  email: string;
  phone: string;
  cover_letter: string | null;
  job_title: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const application: CareerApplication = await req.json();
    console.log("Received career application:", application);

    const emailResponse = await resend.emails.send({
      from: "Stallion Careers <onboarding@resend.dev>",
      to: ["info@stallion.co.in"],
      subject: `New Job Application: ${application.job_title} - ${application.name}`,
      html: `
        <h1>New Job Application</h1>
        <h2>Position Applied For: ${application.job_title}</h2>
        
        <h3>Applicant Information</h3>
        <p><strong>Name:</strong> ${application.name}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        
        <h3>Cover Letter</h3>
        <p>${application.cover_letter || "No cover letter provided"}</p>
        
        <hr />
        <p style="font-size: 12px; color: #666;">
          This application was submitted through the Stallion IT Solutions careers page.
        </p>
      `,
      replyTo: application.email,
    });

    console.log("Career application email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-career-application function:", error);
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
