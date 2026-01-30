import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ourTeamHeroBanner from "@/assets/our-team-hero-banner.jpg";

import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  member_name: string;
  member_position: string | null;
  bio: string | null;
  image_url: string | null;
}

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const { data, error } = await supabase.rpc("get_public_team_members");

    if (!error && data) {
      setTeamMembers(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Banner */}
        <section className="relative bg-[#0a1628] overflow-hidden">
          {/* Banner Background - Full Width Stretched */}
          <div 
            className="w-full h-auto aspect-[16/9] md:aspect-[21/9] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${ourTeamHeroBanner})` }}
          />
          
          {/* Text Overlay on Right */}
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="absolute inset-0 bg-gradient-to-l from-[#0a1628]/95 via-[#0a1628]/50 to-transparent" />
            <div className="relative z-10 text-right pr-3 md:pr-6 lg:pr-10 max-w-[140px] md:max-w-[200px] lg:max-w-xs">
              <h1 className="text-sm md:text-base lg:text-xl font-bold text-white mb-1 md:mb-2 leading-tight">
                Meet the Experts Behind Your <span className="text-[#c9a55c]">IT Success</span>
              </h1>
              <p className="text-[10px] md:text-xs lg:text-sm text-white/90 leading-snug">
                Our experienced team of IT professionals brings over a decade of hospitality industry expertise to every project
              </p>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="shadow-medium hover:shadow-gold transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"></div>
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.member_name}
                            className="relative w-32 h-32 rounded-full object-cover border-4 border-secondary"
                          />
                        ) : (
                          <div className="relative w-32 h-32 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-secondary">
                            <span className="text-4xl font-bold text-secondary">
                              {member.member_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-primary mb-2">{member.member_name}</CardTitle>
                    {member.member_position && (
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="mb-2">{member.member_position}</Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {member.bio && (
                      <p className="text-sm text-foreground/70 text-center">
                        {member.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Our Core Values</h2>
                <p className="text-lg text-foreground/70">
                  What drives us to deliver excellence every day
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-primary mb-2">Excellence</h3>
                    <p className="text-sm text-foreground/70">
                      We strive for perfection in every installation and support interaction
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-xl font-bold text-primary mb-2">Reliability</h3>
                    <p className="text-sm text-foreground/70">
                      Our clients trust us with their critical IT infrastructure for good reason
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-subtle">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">💡</div>
                    <h3 className="text-xl font-bold text-primary mb-2">Innovation</h3>
                    <p className="text-sm text-foreground/70">
                      We stay ahead with the latest technologies and best practices
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Join Our Growing Team</h2>
              <p className="text-lg text-foreground/70 mb-8">
                We're always looking for talented IT professionals who share our passion for excellence
              </p>
              <Card className="shadow-medium bg-muted/50">
                <CardContent className="p-8">
                  <p className="text-foreground/80 mb-6">
                    If you're experienced in networking, CCTV systems, server management, or IT support and want to work with leading hospitality clients, we'd love to hear from you.
                  </p>
                  <a href="mailto:careers@stallionitsolutions.in" className="text-secondary hover:underline font-medium">
                    careers@stallionitsolutions.in
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurTeam;
