import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { UserPlus, Shield, Trash2, Loader2, Users } from 'lucide-react';
import { format } from 'date-fns';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
  profile?: {
    full_name: string | null;
  };
  email?: string;
}

export default function ShopAdminManagement() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: admins, isLoading } = useQuery({
    queryKey: ['shop-admins'],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each admin
      const adminsWithProfiles = await Promise.all(
        (roles || []).map(async (role) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', role.user_id)
            .maybeSingle();
          
          return {
            ...role,
            profile: profile || { full_name: null }
          };
        })
      );

      return adminsWithProfiles as UserRole[];
    }
  });

  const addAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      // First, find the user by email in auth.users via a lookup
      // Since we can't query auth.users directly, we'll check if a profile exists
      // and the user needs to exist first
      
      // Get user from profiles or check if they exist
      const { data: users, error: searchError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .limit(100);

      if (searchError) throw searchError;

      // We need a way to find the user - let's use the shop_customers table
      // or we can ask for user_id directly
      // For now, we'll show an error asking for the user to exist first
      
      toast.error('Please ask the user to sign up first, then provide their user ID');
      throw new Error('User lookup by email requires the user to exist in the system');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-admins'] });
      setIsAddDialogOpen(false);
      setNewAdminEmail('');
      toast.success('Admin added successfully');
    },
    onError: (error: any) => {
      console.error('Error adding admin:', error);
    }
  });

  const addAdminByIdMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Check if already admin
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (existing) {
        throw new Error('User is already an admin');
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-admins'] });
      setIsAddDialogOpen(false);
      setNewAdminEmail('');
      toast.success('Admin added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add admin');
    }
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-admins'] });
      toast.success('Admin removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove admin');
    }
  });

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim()) {
      toast.error('Please enter a user ID');
      return;
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(newAdminEmail.trim())) {
      toast.error('Please enter a valid user ID (UUID format)');
      return;
    }

    addAdminByIdMutation.mutate(newAdminEmail.trim());
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-shop-navy">Admin Management</h1>
          <p className="text-muted-foreground">Manage store administrators</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-shop-orange hover:bg-shop-orange-dark">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter user UUID"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The user must sign up first. You can find their ID in the Customers section.
                </p>
              </div>
              <Button 
                onClick={handleAddAdmin} 
                className="w-full bg-shop-orange hover:bg-shop-orange-dark"
                disabled={addAdminByIdMutation.isPending}
              >
                {addAdminByIdMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                Grant Admin Access
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Administrators
          </CardTitle>
          <CardDescription>
            Users with admin access can manage products, orders, and store settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-shop-orange" />
            </div>
          ) : admins && admins.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      {admin.profile?.full_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {admin.user_id.slice(0, 8)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-shop-navy">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(admin.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Admin Access?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove admin privileges from this user. They will no longer be able to access the admin dashboard.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeAdminMutation.mutate(admin.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Remove Access
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No administrators found</p>
              <p className="text-sm">Add an admin to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Add an Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. The user must first create an account by signing up at the store.</p>
          <p>2. Go to the <strong>Customers</strong> section to find their User ID.</p>
          <p>3. Copy their User ID and paste it in the "Add Admin" dialog above.</p>
          <p>4. Click "Grant Admin Access" to give them admin privileges.</p>
        </CardContent>
      </Card>
    </div>
  );
}
