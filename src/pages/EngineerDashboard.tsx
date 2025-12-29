import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuotationAuth, QuotationAuthProvider } from '@/hooks/use-quotation-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  List, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Loader2,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface QuotationStats {
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  totalValue: number;
}

interface RecentQuotation {
  id: string;
  quotation_number: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

function EngineerDashboardContent() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, canAccessQuotations, isEngineer, isAdmin } = useQuotationAuth();
  const [stats, setStats] = useState<QuotationStats>({
    total: 0,
    draft: 0,
    sent: 0,
    approved: 0,
    rejected: 0,
    totalValue: 0
  });
  const [recentQuotations, setRecentQuotations] = useState<RecentQuotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/shop/auth?redirect=/engineer-dashboard');
    } else if (user && canAccessQuotations) {
      fetchDashboardData();
    }
  }, [authLoading, user, canAccessQuotations, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch quotations
      const { data: quotations, error } = await supabase
        .from('cctv_quotations')
        .select('id, quotation_number, customer_name, status, total_amount, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const stats: QuotationStats = {
        total: quotations?.length || 0,
        draft: quotations?.filter(q => q.status === 'draft').length || 0,
        sent: quotations?.filter(q => q.status === 'sent').length || 0,
        approved: quotations?.filter(q => q.status === 'approved').length || 0,
        rejected: quotations?.filter(q => q.status === 'rejected').length || 0,
        totalValue: quotations?.reduce((sum, q) => sum + (q.total_amount || 0), 0) || 0
      };

      setStats(stats);
      setRecentQuotations(quotations?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: React.ReactNode }> = {
      draft: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      sent: { variant: 'default', icon: <Send className="h-3 w-3" /> },
      approved: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
      rejected: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
    };
    const { variant, icon } = config[status] || config.draft;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {status}
      </Badge>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccessQuotations) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Access Restricted</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                The Engineer Dashboard is only available to authorized CCTV Engineers and Administrators.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Engineer Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's an overview of your quotations.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/quotation-list">
                  <List className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
              <Button asChild>
                <Link to="/quotation-builder">
                  <Plus className="h-4 w-4 mr-2" />
                  New Quotation
                </Link>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.draft}</p>
                        <p className="text-xs text-muted-foreground">Drafts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.sent}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.approved}</p>
                        <p className="text-xs text-muted-foreground">Approved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.rejected}</p>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-foreground/20 rounded-lg">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">₹{(stats.totalValue / 1000).toFixed(0)}K</p>
                        <p className="text-xs opacity-80">Total Value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Quotations */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Recent Quotations</CardTitle>
                        <CardDescription>Your latest quotation activity</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/quotation-list">
                          View All
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {recentQuotations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No quotations yet</p>
                        <Button className="mt-4" asChild>
                          <Link to="/quotation-builder">Create Your First Quotation</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentQuotations.map((quotation) => (
                          <Link
                            key={quotation.id}
                            to={`/quotation/${quotation.id}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-medium">{quotation.quotation_number}</span>
                                {getStatusBadge(quotation.status)}
                              </div>
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {quotation.customer_name}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-semibold">₹{quotation.total_amount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(quotation.created_at).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Common tasks at your fingertips</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline" asChild>
                      <Link to="/quotation-builder">
                        <Plus className="h-4 w-4 mr-3" />
                        Create New Quotation
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" variant="outline" asChild>
                      <Link to="/quotation-list">
                        <List className="h-4 w-4 mr-3" />
                        Manage Quotations
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" variant="outline" asChild>
                      <Link to="/shop/admin/products">
                        <TrendingUp className="h-4 w-4 mr-3" />
                        Browse Products
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button className="w-full justify-start" variant="outline" asChild>
                        <Link to="/admin">
                          <Users className="h-4 w-4 mr-3" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Role Info */}
              <Card className="mt-6">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {isAdmin ? (
                        <Shield className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        Logged in as: {isAdmin ? 'Administrator' : 'CCTV Engineer'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isAdmin 
                          ? 'You have full access to all quotations and admin features' 
                          : 'You can create and manage your own quotations'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function EngineerDashboard() {
  return (
    <QuotationAuthProvider>
      <EngineerDashboardContent />
    </QuotationAuthProvider>
  );
}
