import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageSection {
  id: string;
  page_name: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

const PAGES = [
  { value: "home", label: "Home Page" },
  { value: "about", label: "About Page" },
  { value: "services", label: "Services Page" },
  { value: "contact", label: "Contact Page" },
  { value: "amc-plans", label: "AMC Plans Page" },
  { value: "stallion-cctv", label: "Stallion CCTV Page" },
];

export default function PageContentManager() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    page_name: "home",
    section_key: "",
    title: "",
    content: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .order("page_name", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch page sections",
        variant: "destructive",
      });
    } else {
      setSections(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("page_sections")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update section",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Section updated successfully",
        });
        resetForm();
        fetchSections();
      }
    } else {
      const { error } = await supabase
        .from("page_sections")
        .insert([formData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add section",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Section added successfully",
        });
        resetForm();
        fetchSections();
      }
    }
  };

  const handleEdit = (section: PageSection) => {
    setEditingId(section.id);
    setFormData({
      page_name: section.page_name,
      section_key: section.section_key,
      title: section.title || "",
      content: section.content || "",
      image_url: section.image_url || "",
      display_order: section.display_order,
      is_active: section.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    const { error } = await supabase
      .from("page_sections")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
      fetchSections();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `page-sections/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("content-images")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("content-images")
      .getPublicUrl(filePath);

    setFormData({ ...formData, image_url: data.publicUrl });
    setUploading(false);
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      page_name: "home",
      section_key: "",
      title: "",
      content: "",
      image_url: "",
      display_order: 0,
      is_active: true,
    });
  };

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.page_name]) {
      acc[section.page_name] = [];
    }
    acc[section.page_name].push(section);
    return acc;
  }, {} as Record<string, PageSection[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Add"} Page Section</CardTitle>
          <CardDescription>
            Manage content sections for different pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="page_name">Page</Label>
                <Select
                  value={formData.page_name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, page_name: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGES.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section_key">Section Key</Label>
                <Input
                  id="section_key"
                  value={formData.section_key}
                  onChange={(e) =>
                    setFormData({ ...formData, section_key: e.target.value })
                  }
                  placeholder="hero, features, testimonials, etc."
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Section title"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Section content"
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading && <span className="text-sm">Uploading...</span>}
              </div>
              {formData.image_url && (
                <div className="mt-2 relative inline-block">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-32 w-auto object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update" : "Add"} Section
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

      <div className="space-y-6">
        {Object.entries(groupedSections).map(([pageName, pageSections]) => (
          <Card key={pageName}>
            <CardHeader>
              <CardTitle className="capitalize">
                {PAGES.find((p) => p.value === pageName)?.label || pageName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageSections.map((section) => (
                  <Card key={section.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{section.section_key}</h4>
                            {!section.is_active && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          {section.title && (
                            <p className="text-sm font-medium mb-1">
                              {section.title}
                            </p>
                          )}
                          {section.content && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {section.content.substring(0, 150)}
                              {section.content.length > 150 ? "..." : ""}
                            </p>
                          )}
                          {section.image_url && (
                            <img
                              src={section.image_url}
                              alt={section.title || "Section"}
                              className="h-20 w-auto object-cover rounded mt-2"
                            />
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Order: {section.display_order}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(section)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
