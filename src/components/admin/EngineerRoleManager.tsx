import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Shield, Wrench, Search } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserWithRoles {
  user_id: string;
  email: string;
  full_name: string | null;
  roles: string[];
}

export default function EngineerRoleManager() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"cctv_engineer" | "admin">("cctv_engineer");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  const fetchUsersWithRoles = async () => {
    try {
      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Fetch profiles for these users
      const userIds = [...new Set(rolesData?.map(r => r.user_id) || [])];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const usersMap = new Map<string, UserWithRoles>();
      
      rolesData?.forEach(role => {
        if (!usersMap.has(role.user_id)) {
          const profile = profilesData?.find(p => p.id === role.user_id);
          usersMap.set(role.user_id, {
            user_id: role.user_id,
            email: "", // We'll need to get this from auth if needed
            full_name: profile?.full_name || null,
            roles: []
          });
        }
        usersMap.get(role.user_id)?.roles.push(role.role);
      });

      setUsers(Array.from(usersMap.values()));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users with roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRoleByUserId = async (userId: string, role: "cctv_engineer" | "admin") => {
    try {
      // Check if role already exists
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", role)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Info",
          description: "User already has this role",
        });
        return;
      }

      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${role === "cctv_engineer" ? "Engineer" : "Admin"} role added successfully`,
      });

      fetchUsersWithRoles();
    } catch (error) {
      console.error("Error adding role:", error);
      toast({
        title: "Error",
        description: "Failed to add role. Make sure you have admin privileges.",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role removed successfully",
      });

      fetchUsersWithRoles();
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  const handleAddNewUser = async () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid User ID (UUID)",
        variant: "destructive",
      });
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(newUserEmail.trim())) {
      toast({
        title: "Error",
        description: "Please enter a valid UUID format",
        variant: "destructive",
      });
      return;
    }

    await addRoleByUserId(newUserEmail.trim(), selectedRole);
    setNewUserEmail("");
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "cctv_engineer":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3 mr-1" />;
      case "cctv_engineer":
        return <Wrench className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Role to User
          </CardTitle>
          <CardDescription>
            Assign engineer or admin roles to users by their User ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter User ID (UUID)"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as "cctv_engineer" | "admin")}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cctv_engineer">CCTV Engineer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddNewUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: The user must already have an account. You can find User IDs in the backend user management.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users with Roles</CardTitle>
          <CardDescription>
            Manage engineer and admin roles for users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users with roles found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      {user.full_name || "No name"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {user.user_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {user.roles.map((role) => (
                          <Badge key={role} variant={getRoleBadgeVariant(role)} className="flex items-center">
                            {getRoleIcon(role)}
                            {role === "cctv_engineer" ? "Engineer" : role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!user.roles.includes("cctv_engineer") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addRoleByUserId(user.user_id, "cctv_engineer")}
                          >
                            <Wrench className="h-3 w-3 mr-1" />
                            Add Engineer
                          </Button>
                        )}
                        {user.roles.map((role) => (
                          <AlertDialog key={role}>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-destructive">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Remove {role === "cctv_engineer" ? "Engineer" : role}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Role?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove the {role} role from this user?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeRole(user.user_id, role)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ))}
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
  );
}
