import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Shield, 
  TrendingUp, 
  Users, 
  Settings, 
  HeadphonesIcon,
  Building2,
  Clock,
  ArrowUpRight,
  Zap
} from "lucide-react";
import founderImage from "@/assets/founder-image.jpg";
import aboutHeroBanner from "@/assets/hero-banner-hd.jpg";
import stallionMascot from "@/assets/stallion-mascot-hero.png";

const About = () => {
  const approachItems = [
    {
      icon: <HeadphonesIcon className="h-8 w-8" />,
      title: "Proactive Support",
      description: "We don't wait for issues—we prevent them. Our monitoring and maintenance approach keeps your systems running smoothly."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Scalable Solutions",
      description: "Technology that grows with your business. We design infrastructure that adapts to your evolving needs."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Business Continuity",
      description: "Minimal downtime, maximum uptime. Our backup systems and disaster recovery plans protect your operations."
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Vendor-Neutral Consulting",
      description: "We recommend the best solutions for your needs—not the ones that pay us the highest commission."
    }
  ];

  const whyStallionPoints = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Company-Level Support",
      description: "You work with a team, not a single resource. Multiple experts ensure consistent service quality."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Backup Engineers & Escalation",
      description: "Dedicated backup personnel and clear escalation paths ensure issues are resolved quickly."
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Structured IT Processes",
      description: "Documented procedures, regular maintenance schedules, and systematic troubleshooting protocols."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Long-Term Service Mindset",
      description: "We build partnerships, not transactions. Our oldest clients have been with us since 2012."
    }
  ];

  const milestones = [
    { number: "15+", label: "Years in IT Industry" },
    { number: "500+", label: "IT AMC Clients" },
    { number: "1000+", label: "CCTV Setups" },
    { number: "50+", label: "Hotel Networks" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Banner */}
        <section className="relative bg-[#0a1628] overflow-hidden">
          {/* Banner Background - Full Image No Cuts */}
          <div 
            className="w-full h-auto aspect-[16/9] md:aspect-[21/9] bg-contain bg-left bg-no-repeat"
            style={{ backgroundImage: `url(${aboutHeroBanner})` }}
          />
          
          {/* Text Overlay on Right */}
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="absolute inset-0 bg-gradient-to-l from-[#0a1628]/95 via-[#0a1628]/50 to-transparent" />
            <div className="relative z-10 text-right pr-3 md:pr-6 lg:pr-10 max-w-[160px] md:max-w-[240px] lg:max-w-sm">
              <h1 className="text-sm md:text-lg lg:text-2xl font-bold text-white mb-1 md:mb-2 leading-tight">
                Driven by <span className="text-[#c9a55c]">Strength</span>.<br />
                Powered by <span className="text-[#c9a55c]">Technology</span>.
              </h1>
              <p className="text-[10px] md:text-xs lg:text-sm text-white/90 leading-snug mb-2 md:mb-4">
                Delivering reliable IT solutions across Goa since <span className="text-[#c9a55c] font-semibold">2012</span>.
              </p>
              
              {/* Stats Row */}
              <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                {milestones.map((item, index) => (
                  <div key={index} className="text-right">
                    <p className="text-sm md:text-lg lg:text-xl font-bold text-[#c9a55c]">{item.number}</p>
                    <p className="text-white/80 text-[8px] md:text-[10px] lg:text-xs">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
                  Who We <span className="text-[#c9a55c]">Are</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] mx-auto rounded-full" />
              </div>
              
              <div className="space-y-6 text-[#0a1628]/80 text-lg leading-relaxed">
                <p>
                  <span className="font-semibold text-[#0a1628]">Stallion IT Solutions & Services</span> is a Goa-based technology partner trusted by hotels, industries, and enterprises since 2012. We specialize in comprehensive IT infrastructure management, CCTV security solutions, and network design that keeps businesses running efficiently and securely.
                </p>
                <p>
                  Our strength lies in our <span className="text-[#c9a55c] font-semibold">reliability</span>—we don't just fix problems, we prevent them. With a team of seasoned professionals and a commitment to long-term partnerships, we've become the IT backbone for some of Goa's most prominent establishments.
                </p>
                <p>
                  Whether you're a boutique hotel needing seamless guest WiFi or a manufacturing unit requiring 24/7 surveillance, Stallion delivers <span className="text-[#c9a55c] font-semibold">enterprise-grade solutions</span> with a personal touch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navy Divider */}
        <div className="h-1 bg-gradient-to-r from-[#0a1628] via-[#c9a55c] to-[#0a1628]" />

        {/* Our Approach Section */}
        <section className="py-16 md:py-24 bg-[#f8f9fa]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
                Our <span className="text-[#c9a55c]">Approach</span>
              </h2>
              <p className="text-[#0a1628]/70 max-w-2xl mx-auto">
                We believe in building IT infrastructure that works for your business—not against it.
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] mx-auto rounded-full mt-4" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {approachItems.map((item, index) => (
                <Card 
                  key={index} 
                  className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0a1628] to-[#162d4a] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#c9a55c] group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#0a1628] mb-3">{item.title}</h3>
                    <p className="text-[#0a1628]/70 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Navy Divider */}
        <div className="h-1 bg-gradient-to-r from-[#0a1628] via-[#c9a55c] to-[#0a1628]" />

        {/* Why Stallion Section - With Subtle Mascot Watermark */}
        <section className="relative py-16 md:py-24 bg-white overflow-hidden">
          {/* Subtle Mascot Watermark */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[800px] opacity-[0.04] bg-contain bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url(${stallionMascot})` }}
          />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
                  Why <span className="text-[#c9a55c]">Stallion</span>?
                </h2>
                <p className="text-[#0a1628]/70 max-w-2xl mx-auto">
                  What sets us apart from individual IT consultants and other service providers.
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] mx-auto rounded-full mt-4" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {whyStallionPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 p-6 bg-[#f8f9fa] rounded-2xl border border-[#0a1628]/10 hover:border-[#c9a55c]/40 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#c9a55c] to-[#e8c547] rounded-xl flex items-center justify-center text-[#0a1628] flex-shrink-0 group-hover:scale-110 transition-transform">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0a1628] mb-2 flex items-center gap-2">
                        {point.title}
                        <ArrowUpRight className="w-4 h-4 text-[#c9a55c] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[#0a1628]/70 text-sm leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Differentiator Callout */}
              <div className="mt-12 p-8 bg-gradient-to-r from-[#0a1628] to-[#162d4a] rounded-2xl text-center">
                <Zap className="w-10 h-10 text-[#c9a55c] mx-auto mb-4" />
                <p className="text-white text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  "With Stallion, you're not hiring an IT person—you're <span className="text-[#c9a55c]">partnering with an IT company</span>."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Message */}
        <section className="py-16 md:py-24 bg-[#f8f9fa]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
                  Founder's <span className="text-[#c9a55c]">Message</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#c9a55c] to-[#e8c547] mx-auto rounded-full" />
              </div>
              
              <Card className="bg-white border-none shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 flex-shrink-0">
                      <img 
                        src={founderImage} 
                        alt="Rajvaibhav Parulekar - Founder" 
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-3/5 p-8 md:p-10">
                      <div className="space-y-4 text-[#0a1628]/80">
                        <p className="italic text-lg border-l-4 border-[#c9a55c] pl-4">
                          "As the proud founder of Stallion, I am thrilled to reflect on a remarkable journey that began in 2012—a journey marked by unwavering commitment to excellence in IT consultation."
                        </p>
                        <p>
                          Over the past decade, we have evolved into a beacon of technological innovation, providing invaluable services to major hotels and industries across Goa. Our mission has always been clear—to empower businesses with cutting-edge IT solutions.
                        </p>
                        <p>
                          We take pride in staying at the forefront of technological advancements. Looking ahead, we are excited about the future as we continue to evolve, adapt, and lead the way in shaping the digital landscape.
                        </p>
                      </div>
                      <div className="mt-8 pt-6 border-t border-[#0a1628]/10">
                        <p className="font-bold text-[#0a1628] text-lg">Rajvaibhav Parulekar</p>
                        <p className="text-[#c9a55c] font-medium">Founder, Stallion IT Solutions & Services</p>
                      </div>
                    </div>
                  </div>
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

export default About;
