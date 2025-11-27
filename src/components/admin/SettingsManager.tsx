import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, X } from "lucide-react";

interface Setting {
  key: string;
  value: string | null;
}

export default function SettingsManager() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", [
          "logo_url",
          "logo_dark_url",
          "favicon_url",
          "company_name",
          "phone",
          "email",
          "address",
          "facebook_url",
          "instagram_url",
          "linkedin_url"
        ]);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string | null>) || {};

      setLogoUrl(settingsMap.logo_url || null);
      setLogoDarkUrl(settingsMap.logo_dark_url || null);
      setFaviconUrl(settingsMap.favicon_url || null);
      setCompanyName(settingsMap.company_name || "");
      setPhone(settingsMap.phone || "");
      setEmail(settingsMap.email || "");
      setAddress(settingsMap.address || "");
      setFacebookUrl(settingsMap.facebook_url || "");
      setInstagramUrl(settingsMap.instagram_url || "");
      setLinkedinUrl(settingsMap.linkedin_url || "");
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    settingKey: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(settingKey);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${settingKey}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("content-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("content-images")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update setting in database
      const { error: updateError } = await supabase
        .from("site_settings")
        .upsert({ key: settingKey, value: publicUrl });

      if (updateError) throw updateError;

      // Update local state
      if (settingKey === "logo_url") setLogoUrl(publicUrl);
      if (settingKey === "logo_dark_url") setLogoDarkUrl(publicUrl);
      if (settingKey === "favicon_url") setFaviconUrl(publicUrl);

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveLogo = async (settingKey: string) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: null })
        .eq("key", settingKey);

      if (error) throw error;

      if (settingKey === "logo_url") setLogoUrl(null);
      if (settingKey === "logo_dark_url") setLogoDarkUrl(null);
      if (settingKey === "favicon_url") setFaviconUrl(null);

      toast({
        title: "Success",
        description: "Logo removed successfully",
      });
    } catch (error) {
      console.error("Error removing logo:", error);
      toast({
        title: "Error",
        description: "Failed to remove logo",
        variant: "destructive",
      });
    }
  };

  const handleSaveTextSettings = async () => {
    setSaving(true);
    try {
      // Validate email if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const settings = [
        { key: "company_name", value: companyName },
        { key: "phone", value: phone },
        { key: "email", value: email },
        { key: "address", value: address },
        { key: "facebook_url", value: facebookUrl },
        { key: "instagram_url", value: instagramUrl },
        { key: "linkedin_url", value: linkedinUrl },
      ];

      for (const setting of settings) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key: setting.key, value: setting.value }, { onConflict: "key" });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Logos</CardTitle>
          <CardDescription>
            Upload and manage your site's logo files. Images will be stored in cloud storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Logo */}
          <div className="space-y-2">
            <Label htmlFor="logo">Main Logo (Light Mode)</Label>
            <div className="flex items-center gap-4">
              {logoUrl && (
                <div className="relative">
                  <img
                    src={logoUrl}
                    alt="Main Logo"
                    className="h-16 w-auto object-contain border rounded p-2"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => handleRemoveLogo("logo_url")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo_url")}
                  disabled={uploading === "logo_url"}
                />
              </div>
              {uploading === "logo_url" && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
            </div>
          </div>

          {/* Dark Mode Logo */}
          <div className="space-y-2">
            <Label htmlFor="logo-dark">Dark Mode Logo</Label>
            <div className="flex items-center gap-4">
              {logoDarkUrl && (
                <div className="relative">
                  <img
                    src={logoDarkUrl}
                    alt="Dark Mode Logo"
                    className="h-16 w-auto object-contain border rounded p-2 bg-gray-900"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => handleRemoveLogo("logo_dark_url")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="logo-dark"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo_dark_url")}
                  disabled={uploading === "logo_dark_url"}
                />
              </div>
              {uploading === "logo_dark_url" && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
            </div>
          </div>

          {/* Favicon */}
          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon</Label>
            <div className="flex items-center gap-4">
              {faviconUrl && (
                <div className="relative">
                  <img
                    src={faviconUrl}
                    alt="Favicon"
                    className="h-8 w-8 object-contain border rounded"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => handleRemoveLogo("favicon_url")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="favicon"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "favicon_url")}
                  disabled={uploading === "favicon_url"}
                />
              </div>
              {uploading === "favicon_url" && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 32x32px or 16x16px PNG
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Update your company's contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter company address"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Add your social media profile URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/yourprofile"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>

          <Button onClick={handleSaveTextSettings} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
