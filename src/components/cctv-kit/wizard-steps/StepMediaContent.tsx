import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Image as ImageIcon, Upload, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { KitWizardData } from '@/types/cctv-kit';

interface StepMediaContentProps {
  data: KitWizardData;
  onChange: (updates: Partial<KitWizardData>) => void;
  brandName?: string;
}

export function StepMediaContent({ data, onChange, brandName }: StepMediaContentProps) {
  const [uploading, setUploading] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setUploading(true);
    try {
      const fileName = `kit-${Date.now()}-${file.name}`;
      const { data: uploadData, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(uploadData.path);
      
      onChange({ image_url: publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    onChange({ short_highlights: [...data.short_highlights, newHighlight.trim()] });
    setNewHighlight('');
  };
  
  const removeHighlight = (index: number) => {
    const updated = data.short_highlights.filter((_, i) => i !== index);
    onChange({ short_highlights: updated });
  };

  const generateDescription = async () => {
    setGeneratingDescription(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-kit-content', {
        body: {
          type: 'description',
          kitData: {
            name: data.name,
            kit_type: data.kit_type,
            channel_capacity: data.channel_capacity,
            camera_resolution: data.camera_resolution,
            brandName: brandName || 'Generic',
            items: data.items,
          },
        },
      });

      if (error) throw error;
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      onChange({ long_description: result.content });
      toast.success('Description generated successfully!');
    } catch (error: any) {
      console.error('Error generating description:', error);
      toast.error(`Failed to generate description: ${error.message}`);
    } finally {
      setGeneratingDescription(false);
    }
  };

  const generateImage = async () => {
    setGeneratingImage(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-kit-content', {
        body: {
          type: 'image',
          kitData: {
            name: data.name,
            kit_type: data.kit_type,
            channel_capacity: data.channel_capacity,
            camera_resolution: data.camera_resolution,
            brandName: brandName || 'Generic',
          },
        },
      });

      if (error) throw error;
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      // The result.content is a base64 image, upload it to storage
      const base64Data = result.content;
      
      // Convert base64 to blob
      const base64Response = await fetch(base64Data);
      const blob = await base64Response.blob();
      
      // Upload to storage
      const fileName = `kit-ai-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(fileName, blob, { contentType: 'image/png' });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(uploadData.path);

      onChange({ image_url: publicUrl });
      toast.success('Image generated and uploaded successfully!');
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error.message}`);
    } finally {
      setGeneratingImage(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media & Content
        </CardTitle>
        <CardDescription>
          Add images and marketing content for your kit. Use AI to generate content automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Kit Image */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              Kit Image <span className="text-destructive">*</span>
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateImage}
              disabled={generatingImage || !data.name}
              className="gap-2"
            >
              {generatingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generatingImage ? 'Generating...' : 'AI Generate Image'}
            </Button>
          </div>
          <div className="border-2 border-dashed rounded-lg p-6">
            {data.image_url ? (
              <div className="relative">
                <img
                  src={data.image_url}
                  alt="Kit preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => onChange({ image_url: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer block text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading || generatingImage}
                />
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {uploading ? 'Uploading...' : generatingImage ? 'Generating AI image...' : 'Click to upload kit image'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB or use AI Generate
                </p>
              </label>
            )}
          </div>
        </div>
        
        {/* Short Highlights */}
        <div className="space-y-2">
          <Label>Short Highlights (Bullet Points)</Label>
          <div className="flex gap-2">
            <Input
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="e.g., Night vision support"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
            />
            <Button onClick={addHighlight} disabled={!newHighlight.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.short_highlights.map((highlight, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="pl-2 pr-1 py-1 flex items-center gap-1"
              >
                <span>{highlight}</span>
                <button
                  onClick={() => removeHighlight(index)}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {data.short_highlights.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Add highlights that will appear on the kit card
            </p>
          )}
        </div>
        
        {/* Long Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Long Description</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateDescription}
              disabled={generatingDescription || !data.name}
              className="gap-2"
            >
              {generatingDescription ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generatingDescription ? 'Generating...' : 'AI Generate Description'}
            </Button>
          </div>
          <Textarea
            value={data.long_description}
            onChange={(e) => onChange({ long_description: e.target.value })}
            placeholder="Write a detailed description of your CCTV kit or use AI to generate one..."
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            This will be displayed on the kit detail page
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
