import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Loader2, X } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  position: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  display_order: number;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    image_url: "",
    email: "",
    phone: "",
    display_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setMembers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("team_members")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: "Team member updated successfully" });
    } else {
      const { error } = await supabase.from("team_members").insert([formData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: "Team member added successfully" });
    }

    resetForm();
    fetchMembers();
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      position: member.position || "",
      bio: member.bio || "",
      image_url: member.image_url || "",
      email: member.email || "",
      phone: member.phone || "",
      display_order: member.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    const { error } = await supabase.from("team_members").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Team member deleted successfully" });
    fetchMembers();
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image smaller than 2MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `team-${Date.now()}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("content-images").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("content-images").getPublicUrl(filePath);
      setFormData({ ...formData, image_url: urlData.publicUrl });

      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      image_url: "",
      email: "",
      phone: "",
      display_order: 0,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Team Member" : "Add New Team Member"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Member Photo</Label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <div className="relative">
                    <img src={formData.image_url} alt="Preview" className="h-16 w-16 object-cover rounded-full border" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => setFormData({ ...formData, image_url: "" })}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={uploading}
                  />
                </div>
                {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update" : "Add"} Team Member
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
