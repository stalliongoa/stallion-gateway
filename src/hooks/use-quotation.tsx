import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  Quotation, 
  QuotationItem, 
  CCTVSystemType, 
  CategoryType,
  SpecDefinition,
  ProductFilters 
} from '@/types/quotation';

export interface QuotationState {
  systemType: CCTVSystemType | null;
  items: QuotationItem[];
  customerDetails: {
    customer_name: string;
    customer_mobile: string;
    customer_email: string;
    installation_address: string;
    city: string;
    gst_number: string;
    notes: string;
  };
  discountPercentage: number;
  taxRate: number;
}

const initialState: QuotationState = {
  systemType: null,
  items: [],
  customerDetails: {
    customer_name: '',
    customer_mobile: '',
    customer_email: '',
    installation_address: '',
    city: '',
    gst_number: '',
    notes: '',
  },
  discountPercentage: 0,
  taxRate: 18,
};

export function useQuotation() {
  const [state, setState] = useState<QuotationState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [specDefinitions, setSpecDefinitions] = useState<SpecDefinition[]>([]);

  const fetchSpecDefinitions = useCallback(async () => {
    const { data, error } = await supabase
      .from('cctv_spec_definitions')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching spec definitions:', error);
      return;
    }

    const parsed = data.map(d => ({
      ...d,
      options: d.options ? (Array.isArray(d.options) ? d.options : JSON.parse(d.options as string)) : undefined
    })) as SpecDefinition[];

    setSpecDefinitions(parsed);
  }, []);

  const setSystemType = useCallback((type: CCTVSystemType) => {
    setState(prev => ({ ...prev, systemType: type }));
  }, []);

  const addItem = useCallback((item: QuotationItem) => {
    setState(prev => ({
      ...prev,
      items: [...prev.items, { ...item, display_order: prev.items.length }]
    }));
    toast.success(`${item.product_name} added to quotation`);
  }, []);

  const updateItemQuantity = useCallback((index: number, quantity: number) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index 
          ? { ...item, quantity, total_price: item.unit_price * quantity }
          : item
      )
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
    toast.info('Item removed from quotation');
  }, []);

  const updateCustomerDetails = useCallback((details: Partial<QuotationState['customerDetails']>) => {
    setState(prev => ({
      ...prev,
      customerDetails: { ...prev.customerDetails, ...details }
    }));
  }, []);

  const setDiscountPercentage = useCallback((discount: number) => {
    setState(prev => ({ ...prev, discountPercentage: discount }));
  }, []);

  const calculateTotals = useCallback(() => {
    const subtotal = state.items.reduce((sum, item) => sum + item.total_price, 0);
    const discountAmount = (subtotal * state.discountPercentage) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * state.taxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount
    };
  }, [state.items, state.discountPercentage, state.taxRate]);

  const saveQuotation = useCallback(async (status: 'draft' | 'sent' = 'draft') => {
    if (!state.systemType) {
      toast.error('Please select a CCTV system type');
      return null;
    }

    if (state.items.length === 0) {
      toast.error('Please add at least one item to the quotation');
      return null;
    }

    if (!state.customerDetails.customer_name || !state.customerDetails.customer_mobile) {
      toast.error('Please fill in customer details');
      return null;
    }

    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data: quotationNumber } = await supabase.rpc('generate_quotation_number');
      const totals = calculateTotals();

      const quotationData = {
        quotation_number: quotationNumber,
        engineer_id: userData.user.id,
        status,
        cctv_system_type: state.systemType,
        ...state.customerDetails,
        subtotal: totals.subtotal,
        discount_percentage: state.discountPercentage,
        discount_amount: totals.discountAmount,
        tax_amount: totals.taxAmount,
        total_amount: totals.totalAmount,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      const { data: quotation, error: quotationError } = await supabase
        .from('cctv_quotations')
        .insert(quotationData)
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Insert items
      const itemsData = state.items.map((item, index) => ({
        quotation_id: quotation.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        category_type: item.category_type,
        specifications: item.specifications,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        notes: item.notes,
        display_order: index,
      }));

      const { error: itemsError } = await supabase
        .from('cctv_quotation_items')
        .insert(itemsData);

      if (itemsError) throw itemsError;

      toast.success(`Quotation ${quotationNumber} saved successfully`);
      return quotation;
    } catch (error) {
      console.error('Error saving quotation:', error);
      toast.error('Failed to save quotation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [state, calculateTotals]);

  const resetQuotation = useCallback(() => {
    setState(initialState);
  }, []);

  const getSpecsForCategory = useCallback((categoryType: CategoryType) => {
    return specDefinitions.filter(s => s.category_type === categoryType);
  }, [specDefinitions]);

  return {
    state,
    isLoading,
    specDefinitions,
    setSystemType,
    addItem,
    updateItemQuantity,
    removeItem,
    updateCustomerDetails,
    setDiscountPercentage,
    calculateTotals,
    saveQuotation,
    resetQuotation,
    fetchSpecDefinitions,
    getSpecsForCategory,
  };
}
