import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Shield, Wifi, Camera, Network } from "lucide-react";

const Blog = () => {
  const blogPosts: Array<{
    id: number;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    icon: React.ReactNode;
    image: string;
  }> = [];

  const categories = ["All", "Security", "Networking", "Business", "Automation"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-secondary text-secondary-foreground">
                Blog & Resources
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                IT Insights & Best Practices
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Expert advice, industry trends, and practical guides for your IT infrastructure
              </p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-muted/30 sticky top-20 z-40 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-secondary text-secondary-foreground" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary">Featured</Badge>
                <Card className="shadow-gold overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="h-64 md:h-auto">
                      <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{blogPosts[0].category}</Badge>
                        <span className="text-sm text-foreground/60">{blogPosts[0].readTime}</span>
                      </div>
                      <CardTitle className="text-3xl text-primary mb-4">
                        {blogPosts[0].title}
                      </CardTitle>
                      <CardDescription className="text-base mb-6">
                        {blogPosts[0].excerpt}
                      </CardDescription>
                      <div className="flex items-center text-sm text-foreground/70 mb-6">
                        <User className="h-4 w-4 mr-2" />
                        <span className="mr-4">{blogPosts[0].author}</span>
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{blogPosts[0].date}</span>
                      </div>
                      <Button>
                        Read Full Article
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardHeader>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {blogPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Coming Soon</h3>
                  <p className="text-foreground/70">We're working on new content. Check back soon!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogPosts.slice(1).map((post) => (
                    <Card key={post.id} className="shadow-medium hover:shadow-gold transition-all duration-300 overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary">{post.category}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between text-sm text-foreground/60 mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{post.date}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                        <CardTitle className="text-xl text-primary mb-2 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-foreground/70">
                            <User className="h-4 w-4 mr-2" />
                            <span>{post.author}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary/80">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-medium bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">📧</div>
                  <h2 className="text-3xl font-bold mb-4 text-primary">Stay Updated</h2>
                  <p className="text-foreground/70 mb-6">
                    Subscribe to our newsletter for the latest IT tips, industry insights, and exclusive content delivered to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-input border border-border focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Subscribe
                    </Button>
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

export default Blog;
