import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Search, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Camera,
  IndianRupee,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCCTVKits, useDeleteKit } from '@/hooks/use-cctv-kits';
import { cn } from '@/lib/utils';
import { KitWizardProgress } from '@/components/cctv-kit/KitWizardProgress';
import { KitPricingSummary } from '@/components/cctv-kit/KitPricingSummary';
import { StepBasicDetails } from '@/components/cctv-kit/wizard-steps/StepBasicDetails';
import { StepProductSelection } from '@/components/cctv-kit/wizard-steps/StepProductSelection';
import { StepOptionalOffer } from '@/components/cctv-kit/wizard-steps/StepOptionalOffer';
import { StepPricing } from '@/components/cctv-kit/wizard-steps/StepPricing';
import { StepMediaContent } from '@/components/cctv-kit/wizard-steps/StepMediaContent';
import { StepReview } from '@/components/cctv-kit/wizard-steps/StepReview';
import { useCreateKit, useUpdateKit, useCCTVKit } from '@/hooks/use-cctv-kits';
import type { KitWizardData, CCTVKit } from '@/types/cctv-kit';
import { KIT_WIZARD_STEPS, CHANNEL_DEFAULTS } from '@/types/cctv-kit';

const initialWizardData: KitWizardData = {
  name: '',
  kit_type: 'analog',
  channel_capacity: 4,
  camera_resolution: '2MP',
  brand_id: null,
  status: 'active',
  items: [],
  has_free_wifi_camera: false,
  free_wifi_camera_product_id: null,
  selling_price: 0,
  image_url: null,
  short_highlights: [],
  long_description: '',
};

export default function ShopAdminCCTVKits() {
  const navigate = useNavigate();
  const { data: kits, isLoading } = useCCTVKits();
  const deleteKit = useDeleteKit();
  const createKit = useCreateKit();
  const updateKit = useUpdateKit();
  
  const [view, setView] = useState<'list' | 'wizard'>('list');
  const [editingKitId, setEditingKitId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<CCTVKit | null>(null);
  const [search, setSearch] = useState('');
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [wizardData, setWizardData] = useState<KitWizardData>(initialWizardData);
  
  const { data: editingKit } = useCCTVKit(editingKitId || undefined);
  
  const filteredKits = kits?.filter(kit =>
    kit.name.toLowerCase().includes(search.toLowerCase())
  ) || [];
  
  const handleCreateNew = () => {
    setWizardData(initialWizardData);
    setCurrentStep(1);
    setCompletedSteps([]);
    setEditingKitId(null);
    setView('wizard');
  };
  
  const handleEdit = (kit: CCTVKit) => {
    setEditingKitId(kit.id);
    setWizardData({
      name: kit.name,
      kit_type: kit.kit_type as any,
      channel_capacity: kit.channel_capacity as any,
      camera_resolution: kit.camera_resolution as any,
      brand_id: kit.brand_id,
      status: kit.status as any,
      items: kit.items?.map(item => ({
        product_type: item.product_type as any,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_type: item.unit_type as any,
        purchase_price: item.purchase_price,
        selling_price: item.selling_price,
        is_free_item: item.is_free_item,
      })) || [],
      has_free_wifi_camera: kit.has_free_wifi_camera,
      free_wifi_camera_product_id: kit.free_wifi_camera_product_id,
      selling_price: kit.selling_price,
      image_url: kit.image_url,
      short_highlights: kit.short_highlights || [],
      long_description: kit.long_description || '',
    });
    setCurrentStep(1);
    setCompletedSteps([]);
    setView('wizard');
  };
  
  const handleDelete = async () => {
    if (!kitToDelete) return;
    await deleteKit.mutateAsync(kitToDelete.id);
    setDeleteDialogOpen(false);
    setKitToDelete(null);
  };
  
  const handleWizardDataChange = (updates: Partial<KitWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };
  
  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };
  
  const handleNext = () => {
    handleStepComplete(currentStep);
    setCurrentStep(prev => Math.min(prev + 1, KIT_WIZARD_STEPS.length));
  };
  
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSave = async () => {
    if (editingKitId) {
      await updateKit.mutateAsync({ id: editingKitId, data: wizardData });
    } else {
      await createKit.mutateAsync(wizardData);
    }
    setView('list');
    setEditingKitId(null);
  };
  
  const canSave = 
    wizardData.name && 
    wizardData.brand_id && 
    wizardData.items.length > 0 && 
    wizardData.selling_price > 0;
  
  const renderWizardStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicDetails data={wizardData} onChange={handleWizardDataChange} />;
      case 2:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="camera"
            title="Camera Selection"
            description="Select cameras for your kit. Only cameras matching the selected brand will be shown."
            suggestion={`Default quantity: ${CHANNEL_DEFAULTS[wizardData.channel_capacity].cameras} cameras for ${wizardData.channel_capacity} channel kit`}
          />
        );
      case 3:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="dvr"
            title="DVR Selection"
            description="Select a DVR for your kit. Only DVRs matching the selected brand and channel capacity will be shown."
            showQuantityControls={false}
          />
        );
      case 4:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="smps"
            title="Power Supply (SMPS)"
            description="Select SMPS/Power supply for the kit. All brands are available."
          />
        );
      case 5:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="hard_drive"
            title="Hard Disk Selection"
            description="Select storage for recording. All brands are available."
            suggestion={`Recommended: ${CHANNEL_DEFAULTS[wizardData.channel_capacity].suggestedHDD} for ${wizardData.channel_capacity} channel kit`}
          />
        );
      case 6:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="cable"
            title="CCTV Cable"
            description="Select 3+1 coaxial cable for the installation."
            unitType="meters"
            suggestion={`Recommended: ${CHANNEL_DEFAULTS[wizardData.channel_capacity].cableMeters} meters for ${wizardData.channel_capacity} channel kit`}
          />
        );
      case 7:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="monitor"
            title="Monitor Selection"
            description="Select a display monitor for the kit."
            suggestion={`Recommended: ${CHANNEL_DEFAULTS[wizardData.channel_capacity].suggestedMonitor} monitor for ${wizardData.channel_capacity} channel kit`}
          />
        );
      case 8:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="ups"
            title="UPS Selection"
            description="Select power backup for the system."
            suggestion="Recommended: 600VA UPS for standard installations"
          />
        );
      case 9:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="rack"
            title="Rack / Enclosure"
            description="Select a metal enclosure for DVR and accessories."
          />
        );
      case 10:
        return (
          <StepProductSelection
            data={wizardData}
            onChange={handleWizardDataChange}
            productType="accessory"
            title="Accessories"
            description="Add BNC connectors, DC pins, and other accessories."
            allowMultiple={true}
          />
        );
      case 11:
        return <StepOptionalOffer data={wizardData} onChange={handleWizardDataChange} />;
      case 12:
        return <StepPricing data={wizardData} onChange={handleWizardDataChange} />;
      case 13:
        return <StepMediaContent data={wizardData} onChange={handleWizardDataChange} />;
      case 14:
        return <StepReview data={wizardData} />;
      default:
        return null;
    }
  };
  
  // Wizard View
  if (view === 'wizard') {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('list')}
              className="mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Kits
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">
              {editingKitId ? 'Edit CCTV Kit' : 'Create New CCTV Kit'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setView('list')}>
              Cancel
            </Button>
            {currentStep === KIT_WIZARD_STEPS.length && (
              <Button 
                onClick={handleSave} 
                disabled={!canSave || createKit.isPending || updateKit.isPending}
              >
                {createKit.isPending || updateKit.isPending ? 'Saving...' : 'Save Kit'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Progress */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Wizard Steps</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <KitWizardProgress
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={setCurrentStep}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Center: Form */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {renderWizardStep()}
            </ScrollArea>
            
            {/* Navigation */}
            <div className="flex justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              {currentStep < KIT_WIZARD_STEPS.length ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={!canSave || createKit.isPending || updateKit.isPending}
                >
                  {createKit.isPending || updateKit.isPending ? 'Saving...' : 'Save Kit'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Right: Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <KitPricingSummary
                items={wizardData.items}
                sellingPrice={wizardData.selling_price}
                hasFreeWifiCamera={wizardData.has_free_wifi_camera}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // List View
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">CCTV Kits</h1>
          <p className="text-muted-foreground">
            Manage pre-configured CCTV security kits
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Kit
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search kits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Kits Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredKits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No CCTV Kits Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first CCTV kit to start selling bundled products
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Kit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKits.map((kit) => (
            <Card key={kit.id} className="overflow-hidden">
              {kit.image_url ? (
                <div className="aspect-video bg-muted">
                  <img
                    src={kit.image_url}
                    alt={kit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold line-clamp-1">{kit.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/cctv/cctv-kits/${kit.slug}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(kit)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Kit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setKitToDelete(kit);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={kit.status === 'active' ? 'default' : 'secondary'}>
                    {kit.status}
                  </Badge>
                  <Badge variant="outline">{kit.channel_capacity}CH</Badge>
                  <Badge variant="outline">{kit.camera_resolution}</Badge>
                </div>
                
                <Separator className="my-3" />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cost</p>
                    <p className="font-medium">₹{kit.total_purchase_cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Selling</p>
                    <p className="font-medium text-primary">₹{kit.selling_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit</p>
                    <p className={cn(
                      "font-medium",
                      kit.profit_amount >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      ₹{kit.profit_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Margin</p>
                    <p className={cn(
                      "font-medium",
                      kit.profit_percentage >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {kit.profit_percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                {kit.has_free_wifi_camera && (
                  <div className="mt-3 p-2 bg-green-50 dark:bg-green-950 rounded text-xs text-green-700 dark:text-green-400 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Includes Free WiFi Camera
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete CCTV Kit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{kitToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
