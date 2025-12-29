import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { ShopAdminLayout } from './ShopAdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Vendor {
  id: string;
  name: string;
}

export default function ShopAdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    barcode: '',
    short_description: '',
    description: '',
    category_id: '',
    brand_id: '',
    vendor_id: '',
    mrp: '',
    selling_price: '',
    purchase_price: '',
    cost_price: '',
    tax_rate: '18',
    hsn_code: '',
    stock_quantity: '0',
    low_stock_threshold: '5',
    weight_kg: '',
    dimensions_cm: '',
    warranty_months: '',
    datasheet_url: '',
    meta_title: '',
    meta_description: '',
    is_active: true,
    is_featured: false,
    shopify_sync_enabled: false,
    images: [] as string[],
    specifications: {} as Record<string, string>,
    tags: [] as string[],
  });

  useEffect(() => {
    fetchOptions();
    if (isEdit && id) {
      fetchProduct(id);
    }
  }, [id, isEdit]);

  const fetchOptions = async () => {
    const [{ data: cats }, { data: brnds }, { data: vndrs }] = await Promise.all([
      supabase.from('shop_categories').select('id, name, slug').eq('is_active', true).order('name'),
      supabase.from('shop_brands').select('id, name, slug').eq('is_active', true).order('name'),
      supabase.from('shop_vendors').select('id, name').eq('is_active', true).order('name'),
    ]);

    if (cats) setCategories(cats);
    if (brnds) setBrands(brnds);
    if (vndrs) setVendors(vndrs);
  };

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('shop_products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      toast({ title: 'Error fetching product', description: error.message, variant: 'destructive' });
      navigate('/shop/admin/products');
    } else if (data) {
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        sku: data.sku || '',
        barcode: data.barcode || '',
        short_description: data.short_description || '',
        description: data.description || '',
        category_id: data.category_id || '',
        brand_id: data.brand_id || '',
        vendor_id: data.vendor_id || '',
        mrp: data.mrp?.toString() || '',
        selling_price: data.selling_price?.toString() || '',
        purchase_price: data.purchase_price?.toString() || '',
        cost_price: data.cost_price?.toString() || '',
        tax_rate: data.tax_rate?.toString() || '18',
        hsn_code: data.hsn_code || '',
        stock_quantity: data.stock_quantity?.toString() || '0',
        low_stock_threshold: data.low_stock_threshold?.toString() || '5',
        weight_kg: data.weight_kg?.toString() || '',
        dimensions_cm: data.dimensions_cm || '',
        warranty_months: data.warranty_months?.toString() || '',
        datasheet_url: data.datasheet_url || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        is_active: data.is_active ?? true,
        is_featured: data.is_featured ?? false,
        shopify_sync_enabled: data.shopify_sync_enabled ?? false,
        images: data.images || [],
        specifications: (data.specifications as Record<string, string>) || {},
        tags: data.tags || [],
      });
    }
    setIsLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const productData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      sku: formData.sku || null,
      barcode: formData.barcode || null,
      short_description: formData.short_description || null,
      description: formData.description || null,
      category_id: formData.category_id || null,
      brand_id: formData.brand_id || null,
      vendor_id: formData.vendor_id || null,
      mrp: formData.mrp ? parseFloat(formData.mrp) : null,
      selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      tax_rate: parseFloat(formData.tax_rate) || 18,
      hsn_code: formData.hsn_code || null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      dimensions_cm: formData.dimensions_cm || null,
      warranty_months: formData.warranty_months ? parseInt(formData.warranty_months) : null,
      datasheet_url: formData.datasheet_url || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      shopify_sync_enabled: formData.shopify_sync_enabled,
      images: formData.images,
      specifications: formData.specifications,
      tags: formData.tags,
    };

    let error;

    if (isEdit && id) {
      const result = await supabase
        .from('shop_products')
        .update(productData)
        .eq('id', id);
      error = result.error;
    } else {
      const result = await supabase
        .from('shop_products')
        .insert(productData);
      error = result.error;
    }

    if (error) {
      toast({ title: 'Error saving product', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Product ${isEdit ? 'updated' : 'created'} successfully` });
      navigate('/shop/admin/products');
    }

    setIsSaving(false);
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <ShopAdminLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop-orange"></div>
        </div>
      </ShopAdminLayout>
    );
  }

  return (
    <ShopAdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/shop/admin/products')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update product details' : 'Create a new product'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="mrp">MRP (₹)</Label>
                    <Input
                      id="mrp"
                      type="number"
                      step="0.01"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="selling_price">Selling Price (₹)</Label>
                    <Input
                      id="selling_price"
                      type="number"
                      step="0.01"
                      value={formData.selling_price}
                      onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchase_price">Purchase Price (₹)</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      step="0.01"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_price">Cost Price (₹)</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.01"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hsn_code">HSN Code</Label>
                    <Input
                      id="hsn_code"
                      value={formData.hsn_code}
                      onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="warranty_months">Warranty (Months)</Label>
                    <Input
                      id="warranty_months"
                      type="number"
                      value={formData.warranty_months}
                      onChange={(e) => setFormData({ ...formData, warranty_months: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt="" className="h-20 w-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addImageUrl}>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Image URL
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Active</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_featured">Featured</Label>
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shopify_sync">Shopify Sync</Label>
                    <Switch
                      id="shopify_sync"
                      checked={formData.shopify_sync_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, shopify_sync_enabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Brand</Label>
                    <Select
                      value={formData.brand_id}
                      onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Vendor</Label>
                    <Select
                      value={formData.vendor_id}
                      onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Physical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      type="number"
                      step="0.01"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions_cm">Dimensions (L×W×H cm)</Label>
                    <Input
                      id="dimensions_cm"
                      placeholder="30×20×10"
                      value={formData.dimensions_cm}
                      onChange={(e) => setFormData({ ...formData, dimensions_cm: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-shop-orange hover:bg-shop-orange-dark" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </ShopAdminLayout>
  );
}