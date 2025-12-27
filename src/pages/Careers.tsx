import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";

interface JobOpening {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  salary_range: string | null;
}

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  cover_letter: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const Careers = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cover_letter: "",
    },
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("job_openings")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!selectedJob) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from("job_applications").insert({
        job_id: selectedJob.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cover_letter: data.cover_letter || null,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      });

      setApplyDialogOpen(false);
      setSelectedJob(null);
      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    "Competitive salary packages",
    "Health insurance coverage",
    "Professional development opportunities",
    "Flexible work environment",
    "Team building activities",
    "Performance bonuses"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join Our Team
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Build your career with Goa's leading IT solutions provider. 
                We're always looking for talented individuals to join our growing team.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Users className="h-4 w-4 mr-2" />
                  {jobs.length} Open Positions
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4 border-primary-foreground/30 text-primary-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  Goa, India
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-primary">Why Work With Us?</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                At Stallion IT Solutions, we believe in creating an environment where our team can thrive
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="shadow-subtle">
                  <CardContent className="p-6 flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-secondary mr-3 flex-shrink-0" />
                    <p className="text-foreground/80">{benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-primary">Open Positions</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Explore our current job openings and find the perfect role for you
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : jobs.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-primary">No Open Positions</h3>
                  <p className="text-foreground/70 mb-6">
                    We don't have any open positions at the moment, but we're always interested in meeting talented people.
                  </p>
                  <Button asChild>
                    <a href="mailto:careers@stalliongoa.com">Send Your Resume</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {jobs.map((job) => (
                  <Card key={job.id} className="shadow-subtle hover:shadow-gold transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
                          <CardDescription className="mt-1">{job.department}</CardDescription>
                        </div>
                        {job.type && (
                          <Badge variant="secondary">{job.type}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-foreground/70">
                        {job.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                        )}
                        {job.salary_range && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.salary_range}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-sm text-foreground/70 mb-4 line-clamp-3">
                          {job.description}
                        </p>
                      )}
                      <Button 
                        onClick={() => {
                          setSelectedJob(job);
                          setApplyDialogOpen(true);
                        }}
                        className="w-full"
                      >
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* General Application CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <Card className="max-w-3xl mx-auto shadow-medium">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  Don't See the Right Role?
                </h3>
                <p className="text-foreground/70 mb-6">
                  We're always interested in hearing from talented individuals. 
                  Send us your resume and we'll keep you in mind for future opportunities.
                </p>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:careers@stalliongoa.com">
                    Send General Application
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Application Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your application
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 XXXXX XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cover_letter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us why you'd be a great fit for this role..."
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApplyDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Careers;
