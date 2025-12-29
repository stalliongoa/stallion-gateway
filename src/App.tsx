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
import ShopCheckout from "./pages/shop/ShopCheckout";
import ShopOrderSuccess from "./pages/shop/ShopOrderSuccess";
import ShopOrders from "./pages/shop/ShopOrders";
import ShopAccount from "./pages/shop/ShopAccount";

// Shop Admin pages
import { ShopAdminLayout } from "./pages/shop/admin/ShopAdminLayout";
import ShopAdminDashboard from "./pages/shop/admin/ShopAdminDashboard";
import ShopAdminProducts from "./pages/shop/admin/ShopAdminProducts";
import ShopAdminProductForm from "./pages/shop/admin/ShopAdminProductForm";
import ShopAdminOrders from "./pages/shop/admin/ShopAdminOrders";
import ShopAdminCategories from "./pages/shop/admin/ShopAdminCategories";
import ShopAdminBrands from "./pages/shop/admin/ShopAdminBrands";
import ShopAdminVendors from "./pages/shop/admin/ShopAdminVendors";
import ShopAdminCustomers from "./pages/shop/admin/ShopAdminCustomers";
import ShopAdminReports from "./pages/shop/admin/ShopAdminReports";
import ShopAdminSettings from "./pages/shop/admin/ShopAdminSettings";
import ShopAdminManagement from "./pages/shop/admin/ShopAdminManagement";
import ShopAdminInvoices from "./pages/shop/admin/ShopAdminInvoices";

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
          <Route path="/shop/checkout" element={<ShopCheckout />} />
          <Route path="/shop/order-success" element={<ShopOrderSuccess />} />
          <Route path="/shop/orders" element={<ShopOrders />} />
          <Route path="/shop/orders/:orderId" element={<ShopOrders />} />
          <Route path="/shop/account" element={<ShopAccount />} />
          
          {/* Shop Admin Routes */}
          <Route path="/shop/admin" element={<ShopAdminLayout><ShopAdminDashboard /></ShopAdminLayout>} />
          <Route path="/shop/admin/products" element={<ShopAdminLayout><ShopAdminProducts /></ShopAdminLayout>} />
          <Route path="/shop/admin/products/new" element={<ShopAdminLayout><ShopAdminProductForm /></ShopAdminLayout>} />
          <Route path="/shop/admin/products/:id" element={<ShopAdminLayout><ShopAdminProductForm /></ShopAdminLayout>} />
          <Route path="/shop/admin/orders" element={<ShopAdminLayout><ShopAdminOrders /></ShopAdminLayout>} />
          <Route path="/shop/admin/categories" element={<ShopAdminLayout><ShopAdminCategories /></ShopAdminLayout>} />
          <Route path="/shop/admin/brands" element={<ShopAdminLayout><ShopAdminBrands /></ShopAdminLayout>} />
          <Route path="/shop/admin/vendors" element={<ShopAdminLayout><ShopAdminVendors /></ShopAdminLayout>} />
          <Route path="/shop/admin/customers" element={<ShopAdminLayout><ShopAdminCustomers /></ShopAdminLayout>} />
          <Route path="/shop/admin/reports" element={<ShopAdminLayout><ShopAdminReports /></ShopAdminLayout>} />
          <Route path="/shop/admin/invoices" element={<ShopAdminLayout><ShopAdminInvoices /></ShopAdminLayout>} />
          <Route path="/shop/admin/management" element={<ShopAdminLayout><ShopAdminManagement /></ShopAdminLayout>} />
          <Route path="/shop/admin/settings" element={<ShopAdminLayout><ShopAdminSettings /></ShopAdminLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
