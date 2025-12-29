import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import AMCPlans from "./pages/AMCPlans";
import OurTeam from "./pages/OurTeam";
import OurClients from "./pages/OurClients";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import StallionCCTV from "./pages/StallionCCTV";
import CCTVAmc from "./pages/CCTVAmc";
import Careers from "./pages/Careers";

// Shop pages
import ShopHome from "./pages/shop/ShopHome";
import ProductList from "./pages/shop/ProductList";
import ProductDetail from "./pages/shop/ProductDetail";
import ShopAuth from "./pages/shop/ShopAuth";
import ShopCart from "./pages/shop/ShopCart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/amc-plans" element={<AMCPlans />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/our-clients" element={<OurClients />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stallion-cctv" element={<StallionCCTV />} />
          <Route path="/cctv-amc" element={<CCTVAmc />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Shop Routes */}
          <Route path="/shop" element={<ShopHome />} />
          <Route path="/shop/products" element={<ProductList />} />
          <Route path="/shop/category/:categorySlug" element={<ProductList />} />
          <Route path="/shop/product/:productSlug" element={<ProductDetail />} />
          <Route path="/shop/auth" element={<ShopAuth />} />
          <Route path="/shop/cart" element={<ShopCart />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
