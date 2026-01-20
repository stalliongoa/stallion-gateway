import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  purchase_price: number | null;
  selling_price: number | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  images: string[] | null;
  category: { name: string } | null;
  brand: { name: string } | null;
}

export default function ShopAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('shop_products')
      .select(`
        id, name, slug, purchase_price, selling_price, is_active, is_featured, images,
        category:shop_categories(name),
        brand:shop_brands(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching products', description: error.message, variant: 'destructive' });
    } else {
      setProducts(data as unknown as Product[]);
    }
    setIsLoading(false);
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('shop_products')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Product ${!currentStatus ? 'activated' : 'deactivated'}` });
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('shop_products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product deleted successfully' });
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      fetchProducts();
    }
  };

  const deleteSelectedProducts = async () => {
    const idsToDelete = Array.from(selectedProducts);
    const { error } = await supabase
      .from('shop_products')
      .delete()
      .in('id', idsToDelete);

    if (error) {
      toast({ title: 'Error deleting products', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `${idsToDelete.length} products deleted successfully` });
      setSelectedProducts(new Set());
      setBulkDeleteOpen(false);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (id: string, checked: boolean) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const isAllSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts.has(p.id));
  const isSomeSelected = filteredProducts.some(p => selectedProducts.has(p.id));

  return (
    <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">Manage your product catalog</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedProducts.size > 0 && (
              <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Delete Selected</span>
                    <span className="sm:hidden">Delete</span>
                    ({selectedProducts.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Products</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedProducts.size} selected products? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteSelectedProducts}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Link to="/shop/admin/products/new">
              <Button size="sm" className="bg-shop-orange hover:bg-shop-orange-dark">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {filteredProducts.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedProducts.size} of {filteredProducts.length} selected
            </span>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 px-2">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={isSomeSelected && !isAllSelected ? "opacity-50" : ""}
                  />
                </TableHead>
                <TableHead className="text-xs px-2">Product</TableHead>
                <TableHead className="text-xs px-2 hidden md:table-cell">Category</TableHead>
                <TableHead className="text-xs px-2 hidden lg:table-cell">Brand</TableHead>
                <TableHead className="text-xs px-2 text-right">Purchase</TableHead>
                <TableHead className="text-xs px-2 text-right">Selling</TableHead>
                <TableHead className="text-xs px-2 text-center">Status</TableHead>
                <TableHead className="text-xs px-2 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-xs">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-xs">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className={selectedProducts.has(product.id) ? "bg-muted/50" : ""}>
                    <TableCell className="px-2">
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="flex items-center gap-2">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-8 w-8 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-[10px] flex-shrink-0">
                            N/A
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-xs line-clamp-1">{product.name}</p>
                          {product.is_featured && (
                            <Badge variant="secondary" className="text-[10px] px-1 py-0">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs px-2 hidden md:table-cell">{product.category?.name || '-'}</TableCell>
                    <TableCell className="text-xs px-2 hidden lg:table-cell">{product.brand?.name || '-'}</TableCell>
                    <TableCell className="text-xs px-2 text-right">
                      {product.purchase_price ? `₹${product.purchase_price.toLocaleString('en-IN')}` : '-'}
                    </TableCell>
                    <TableCell className="text-xs px-2 text-right font-medium">
                      {product.selling_price ? `₹${product.selling_price.toLocaleString('en-IN')}` : '-'}
                    </TableCell>
                    <TableCell className="px-2 text-center">
                      <Badge variant={product.is_active ? 'default' : 'secondary'} className="text-[10px] px-1">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleProductStatus(product.id, product.is_active ?? false)}
                          title={product.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {product.is_active ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Link to={`/shop/admin/products/${product.id}`}>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct(product.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
    </div>
  );
}
