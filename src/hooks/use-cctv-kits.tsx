import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CCTVKit, CCTVKitItem, KitWizardData, KitItemSelection } from '@/types/cctv-kit';

export function useCCTVKits() {
  return useQuery({
    queryKey: ['cctv-kits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cctv_kits')
        .select(`
          *,
          brand:shop_brands(id, name, logo_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CCTVKit[];
    },
  });
}

export function useCCTVKit(id: string | undefined) {
  return useQuery({
    queryKey: ['cctv-kit', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: kit, error: kitError } = await supabase
        .from('cctv_kits')
        .select(`
          *,
          brand:shop_brands(id, name, logo_url)
        `)
        .eq('id', id)
        .single();
      
      if (kitError) throw kitError;
      
      const { data: items, error: itemsError } = await supabase
        .from('cctv_kit_items')
        .select(`
          *,
          product:shop_products(id, name, sku, images, purchase_price, selling_price)
        `)
        .eq('kit_id', id)
        .order('display_order', { ascending: true });
      
      if (itemsError) throw itemsError;
      
      return { ...kit, items } as CCTVKit;
    },
    enabled: !!id,
  });
}

export function useActiveKits() {
  return useQuery({
    queryKey: ['cctv-kits-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cctv_kits')
        .select(`
          *,
          brand:shop_brands(id, name, logo_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CCTVKit[];
    },
  });
}

export function useKitBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['cctv-kit-slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data: kit, error: kitError } = await supabase
        .from('cctv_kits')
        .select(`
          *,
          brand:shop_brands(id, name, logo_url)
        `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single();
      
      if (kitError) throw kitError;
      
      const { data: items, error: itemsError } = await supabase
        .from('cctv_kit_items')
        .select(`
          *,
          product:shop_products(id, name, sku, images, purchase_price, selling_price)
        `)
        .eq('kit_id', kit.id)
        .order('display_order', { ascending: true });
      
      if (itemsError) throw itemsError;
      
      return { ...kit, items } as CCTVKit;
    },
    enabled: !!slug,
  });
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function useCreateKit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: KitWizardData) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      const slug = generateSlug(data.name);
      const totalPurchaseCost = data.items.reduce(
        (sum, item) => sum + (item.purchase_price * item.quantity),
        0
      );
      const profitAmount = data.selling_price - totalPurchaseCost;
      const profitPercentage = totalPurchaseCost > 0 
        ? (profitAmount / totalPurchaseCost) * 100 
        : 0;
      
      // Create kit
      const { data: kit, error: kitError } = await supabase
        .from('cctv_kits')
        .insert({
          name: data.name,
          slug,
          kit_type: data.kit_type,
          channel_capacity: data.channel_capacity,
          camera_resolution: data.camera_resolution,
          brand_id: data.brand_id,
          status: data.status,
          total_purchase_cost: totalPurchaseCost,
          selling_price: data.selling_price,
          profit_amount: profitAmount,
          profit_percentage: profitPercentage,
          image_url: data.image_url,
          short_highlights: data.short_highlights,
          long_description: data.long_description,
          has_free_wifi_camera: data.has_free_wifi_camera,
          free_wifi_camera_product_id: data.free_wifi_camera_product_id,
          created_by: userId,
          updated_by: userId,
        })
        .select()
        .single();
      
      if (kitError) throw kitError;
      
      // Create kit items
      const itemsToInsert = data.items.map((item, index) => ({
        kit_id: kit.id,
        product_id: item.product_id,
        product_type: item.product_type,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_type: item.unit_type,
        purchase_price: item.purchase_price,
        selling_price: item.selling_price,
        is_free_item: item.is_free_item,
        display_order: index,
      }));
      
      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('cctv_kit_items')
          .insert(itemsToInsert);
        
        if (itemsError) throw itemsError;
      }
      
      // Record pricing history
      const { error: historyError } = await supabase
        .from('cctv_kit_pricing_history')
        .insert({
          kit_id: kit.id,
          total_purchase_cost: totalPurchaseCost,
          selling_price: data.selling_price,
          profit_amount: profitAmount,
          profit_percentage: profitPercentage,
          changed_by: userId,
          notes: 'Initial pricing',
        });
      
      if (historyError) throw historyError;
      
      return kit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cctv-kits'] });
      toast.success('CCTV Kit created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create kit: ${error.message}`);
    },
  });
}

export function useUpdateKit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: KitWizardData }) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      const totalPurchaseCost = data.items.reduce(
        (sum, item) => sum + (item.purchase_price * item.quantity),
        0
      );
      const profitAmount = data.selling_price - totalPurchaseCost;
      const profitPercentage = totalPurchaseCost > 0 
        ? (profitAmount / totalPurchaseCost) * 100 
        : 0;
      
      // Update kit
      const { data: kit, error: kitError } = await supabase
        .from('cctv_kits')
        .update({
          name: data.name,
          kit_type: data.kit_type,
          channel_capacity: data.channel_capacity,
          camera_resolution: data.camera_resolution,
          brand_id: data.brand_id,
          status: data.status,
          total_purchase_cost: totalPurchaseCost,
          selling_price: data.selling_price,
          profit_amount: profitAmount,
          profit_percentage: profitPercentage,
          image_url: data.image_url,
          short_highlights: data.short_highlights,
          long_description: data.long_description,
          has_free_wifi_camera: data.has_free_wifi_camera,
          free_wifi_camera_product_id: data.free_wifi_camera_product_id,
          updated_by: userId,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (kitError) throw kitError;
      
      // Delete existing items
      const { error: deleteError } = await supabase
        .from('cctv_kit_items')
        .delete()
        .eq('kit_id', id);
      
      if (deleteError) throw deleteError;
      
      // Insert new items
      const itemsToInsert = data.items.map((item, index) => ({
        kit_id: id,
        product_id: item.product_id,
        product_type: item.product_type,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_type: item.unit_type,
        purchase_price: item.purchase_price,
        selling_price: item.selling_price,
        is_free_item: item.is_free_item,
        display_order: index,
      }));
      
      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('cctv_kit_items')
          .insert(itemsToInsert);
        
        if (itemsError) throw itemsError;
      }
      
      // Record pricing history
      const { error: historyError } = await supabase
        .from('cctv_kit_pricing_history')
        .insert({
          kit_id: id,
          total_purchase_cost: totalPurchaseCost,
          selling_price: data.selling_price,
          profit_amount: profitAmount,
          profit_percentage: profitPercentage,
          changed_by: userId,
          notes: 'Price updated',
        });
      
      if (historyError) throw historyError;
      
      return kit;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cctv-kits'] });
      queryClient.invalidateQueries({ queryKey: ['cctv-kit', id] });
      toast.success('CCTV Kit updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update kit: ${error.message}`);
    },
  });
}

export function useDeleteKit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cctv_kits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cctv-kits'] });
      toast.success('CCTV Kit deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete kit: ${error.message}`);
    },
  });
}

export function useKitPricingHistory(kitId: string | undefined) {
  return useQuery({
    queryKey: ['cctv-kit-pricing-history', kitId],
    queryFn: async () => {
      if (!kitId) return [];
      
      const { data, error } = await supabase
        .from('cctv_kit_pricing_history')
        .select('*')
        .eq('kit_id', kitId)
        .order('changed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!kitId,
  });
}
