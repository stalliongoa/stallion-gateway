import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotationAuth, QuotationAuthProvider } from '@/hooks/use-quotation-auth';
import { useQuotation } from '@/hooks/use-quotation';
import { WIZARD_STEPS, CCTVSystemType } from '@/types/quotation';
import { QuotationWizardProgress } from '@/components/quotation/QuotationWizardProgress';
import { QuotationWizardStep } from '@/components/quotation/QuotationWizardStep';
import { QuotationProductPanel } from '@/components/quotation/QuotationProductPanel';
import { QuotationSummary } from '@/components/quotation/QuotationSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, FileText, Save, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

function CCTVQuotationBuilderContent() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, canAccessQuotations } = useQuotationAuth();
  const quotation = useQuotation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    quotation.fetchSpecDefinitions();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/shop/auth?redirect=/quotation-builder');
    }
  }, [authLoading, user, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccessQuotations) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Access Restricted</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                The CCTV Quotation Builder is only available to authorized CCTV Engineers and Administrators.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact your administrator to request access.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const getVisibleSteps = () => {
    return WIZARD_STEPS.filter(step => {
      if (!step.isConditional) return true;
      if (!quotation.state.systemType) return true;
      return step.condition?.(quotation.state.systemType) ?? true;
    });
  };

  const visibleSteps = getVisibleSteps();
  const currentStepData = visibleSteps[currentStep];
  const isLastStep = currentStep === visibleSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (currentStep === 0 && !quotation.state.systemType) {
      toast.error('Please select a CCTV system type');
      return;
    }
    if (isLastStep) {
      setShowSummary(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = async () => {
    const result = await quotation.saveQuotation('draft');
    if (result) {
      navigate('/quotation-list');
    }
  };

  const getCategoryTypeForStep = () => {
    if (!currentStepData) return null;
    
    if (currentStepData.key === 'recorder') {
      return quotation.state.systemType === 'analog' ? 'dvr' : 'nvr';
    }
    
    return currentStepData.categoryType || null;
  };

  if (showSummary) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-muted/30 py-8">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wizard
              </Button>
              <h1 className="text-2xl font-bold">Quotation Summary</h1>
              <div />
            </div>
            <QuotationSummary
              state={quotation.state}
              calculateTotals={quotation.calculateTotals}
              onSave={quotation.saveQuotation}
              isLoading={quotation.isLoading}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const categoryType = getCategoryTypeForStep();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                CCTV Quotation Builder
              </h1>
              <p className="text-muted-foreground">Create professional quotations for your CCTV installations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft} disabled={quotation.isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          {/* Progress */}
          <QuotationWizardProgress
            steps={visibleSteps}
            currentStep={currentStep}
            onStepClick={(index) => {
              if (index < currentStep || quotation.state.systemType) {
                setCurrentStep(index);
              }
            }}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left Panel - Wizard Form */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>{currentStepData?.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{currentStepData?.description}</p>
              </CardHeader>
              <CardContent>
                <QuotationWizardStep
                  step={currentStepData}
                  state={quotation.state}
                  setSystemType={quotation.setSystemType}
                  updateCustomerDetails={quotation.updateCustomerDetails}
                  specDefinitions={quotation.specDefinitions}
                />
              </CardContent>
            </Card>

            {/* Right Panel - Products or Items List */}
            <div className="space-y-4">
              {categoryType && (
                <QuotationProductPanel
                  categoryType={categoryType}
                  systemType={quotation.state.systemType}
                  specDefinitions={quotation.getSpecsForCategory(categoryType)}
                  onAddItem={quotation.addItem}
                />
              )}

              {/* Current Items */}
              {quotation.state.items.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">
                      Selected Items ({quotation.state.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-64 overflow-auto">
                    {quotation.state.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                        <div className="flex-1">
                          <span className="font-medium">{item.product_name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>₹{item.total_price.toLocaleString()}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => quotation.removeItem(index)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>₹{quotation.calculateTotals().subtotal.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? 'Review Quotation' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function CCTVQuotationBuilder() {
  return (
    <QuotationAuthProvider>
      <CCTVQuotationBuilderContent />
    </QuotationAuthProvider>
  );
}
