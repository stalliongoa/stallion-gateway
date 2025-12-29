import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuotationAuth, QuotationAuthProvider } from '@/hooks/use-quotation-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Trash2, 
  Loader2,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Quotation {
  id: string;
  quotation_number: string;
  customer_name: string;
  city: string;
  cctv_system_type: string;
  status: string;
  total_amount: number;
  created_at: string;
}

function QuotationListContent() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, canAccessQuotations } = useQuotationAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/shop/auth?redirect=/quotation-list');
    } else if (user && canAccessQuotations) {
      fetchQuotations();
    }
  }, [authLoading, user, canAccessQuotations, navigate]);

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('cctv_quotations')
        .select('id, quotation_number, customer_name, city, cctv_system_type, status, total_amount, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Failed to load quotations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;

    try {
      const { error } = await supabase
        .from('cctv_quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setQuotations(prev => prev.filter(q => q.id !== id));
      toast.success('Quotation deleted');
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast.error('Failed to delete quotation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'converted': return 'default';
      default: return 'secondary';
    }
  };

  const filteredQuotations = quotations.filter(q =>
    q.quotation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                The Quotation system is only available to authorized CCTV Engineers and Administrators.
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
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                My Quotations
              </h1>
              <p className="text-muted-foreground">Manage your CCTV quotations</p>
            </div>
            <Button onClick={() => navigate('/quotation-builder')}>
              <Plus className="h-4 w-4 mr-2" />
              New Quotation
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredQuotations.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No quotations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first CCTV quotation to get started
                  </p>
                  <Button onClick={() => navigate('/quotation-builder')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quotation
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quotation #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell className="font-medium">{quotation.quotation_number}</TableCell>
                        <TableCell>{quotation.customer_name}</TableCell>
                        <TableCell>{quotation.city}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{quotation.cctv_system_type.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(quotation.status)}>
                            {quotation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{quotation.total_amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(quotation.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/quotation/${quotation.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {quotation.status === 'draft' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(quotation.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function QuotationList() {
  return (
    <QuotationAuthProvider>
      <QuotationListContent />
    </QuotationAuthProvider>
  );
}
