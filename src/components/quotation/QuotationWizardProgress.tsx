import { WizardStep } from '@/types/quotation';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuotationWizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function QuotationWizardProgress({ steps, currentStep, onStepClick }: QuotationWizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                "flex flex-col items-center cursor-pointer group",
                index <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
              disabled={index > currentStep}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs text-center max-w-[80px] hidden sm:block",
                  index <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
