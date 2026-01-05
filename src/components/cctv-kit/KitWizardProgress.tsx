import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KIT_WIZARD_STEPS } from '@/types/cctv-kit';

interface KitWizardProgressProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function KitWizardProgress({ 
  currentStep, 
  completedSteps, 
  onStepClick 
}: KitWizardProgressProps) {
  return (
    <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      {KIT_WIZARD_STEPS.map((step) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
              isCurrent && "bg-primary/10 border border-primary",
              !isCurrent && isCompleted && "bg-muted/50 hover:bg-muted",
              !isCurrent && !isCompleted && "hover:bg-muted/30"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                isCurrent && "bg-primary text-primary-foreground",
                isCompleted && !isCurrent && "bg-green-500 text-white",
                !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted && !isCurrent ? (
                <Check className="h-3 w-3" />
              ) : (
                step.id
              )}
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  isCurrent && "text-primary",
                  !isCurrent && "text-foreground"
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {step.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
