import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Loader2, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  status: string | null;
  display_order: number;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    status: "active",
    display_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setProjects(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("projects")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: "Project updated successfully" });
    } else {
      const { error } = await supabase.from("projects").insert([formData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: "Project added successfully" });
    }

    resetForm();
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || "",
      image_url: project.image_url || "",
      category: project.category || "",
      status: project.status || "active",
      display_order: project.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Project deleted successfully" });
    fetchProjects();
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
      const fileName = `project-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

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
      title: "",
      description: "",
      image_url: "",
      category: "",
      status: "active",
      display_order: 0,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Project Image</Label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <div className="relative">
                    <img src={formData.image_url} alt="Preview" className="h-16 w-16 object-cover rounded border" />
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
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
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
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update" : "Add"} Project
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
          <CardTitle>Existing Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
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
