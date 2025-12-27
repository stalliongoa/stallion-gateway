import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, X, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface JobOpening {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  salary_range: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

export default function JobsManager() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Goa, India",
    type: "Full-time",
    description: "",
    requirements: "",
    responsibilities: "",
    salary_range: "",
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("job_openings")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job openings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "Goa, India",
      type: "Full-time",
      description: "",
      requirements: "",
      responsibilities: "",
      salary_range: "",
      is_active: true,
      display_order: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("job_openings")
          .update({
            title: formData.title,
            department: formData.department || null,
            location: formData.location || null,
            type: formData.type || null,
            description: formData.description || null,
            requirements: formData.requirements || null,
            responsibilities: formData.responsibilities || null,
            salary_range: formData.salary_range || null,
            is_active: formData.is_active,
            display_order: formData.display_order
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Job updated successfully" });
      } else {
        const { error } = await supabase.from("job_openings").insert({
          title: formData.title,
          department: formData.department || null,
          location: formData.location || null,
          type: formData.type || null,
          description: formData.description || null,
          requirements: formData.requirements || null,
          responsibilities: formData.responsibilities || null,
          salary_range: formData.salary_range || null,
          is_active: formData.is_active,
          display_order: formData.display_order
        });

        if (error) throw error;
        toast({ title: "Success", description: "Job created successfully" });
      }

      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (job: JobOpening) => {
    setFormData({
      title: job.title,
      department: job.department || "",
      location: job.location || "Goa, India",
      type: job.type || "Full-time",
      description: job.description || "",
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
      salary_range: job.salary_range || "",
      is_active: job.is_active ?? true,
      display_order: job.display_order || 0
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const { error } = await supabase.from("job_openings").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Job deleted successfully" });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (job: JobOpening) => {
    try {
      const { error } = await supabase
        .from("job_openings")
        .update({ is_active: !job.is_active })
        .eq("id", job.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Job ${job.is_active ? "deactivated" : "activated"} successfully`
      });
      fetchJobs();
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Openings ({jobs.length})</h2>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Job" : "New Job Opening"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., CCTV Technician"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Technical"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Goa, India"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Employment Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Full-time, Part-time"
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    placeholder="e.g., ₹20,000 - ₹35,000"
                  />
                </div>
                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Job description..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="• 2+ years experience&#10;• Technical certification"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="• Install and configure CCTV systems&#10;• Provide technical support"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Active (visible on careers page)</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Create"} Job
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className={!job.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    {!job.is_active && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-x-3">
                    {job.department && <span>{job.department}</span>}
                    {job.location && <span>• {job.location}</span>}
                    {job.type && <span>• {job.type}</span>}
                    {job.salary_range && <span>• {job.salary_range}</span>}
                  </div>
                  {job.description && (
                    <p className="text-sm mt-2 text-foreground/80 line-clamp-2">
                      {job.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(job)}
                    title={job.is_active ? "Deactivate" : "Activate"}
                  >
                    {job.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(job.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {jobs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No job openings yet. Click "Add Job" to create your first opening.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
