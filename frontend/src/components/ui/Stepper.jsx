import { Check } from 'lucide-react';

export default function Stepper({ steps, currentStep, className = '' }) {
  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-success-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                    : 'bg-bg border-2 border-border text-text-disabled'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium text-center max-w-[80px] leading-tight ${
                  isCompleted || isCurrent ? 'text-text-primary' : 'text-text-disabled'
                }`}
              >
                {step.label}
              </span>
              {step.sublabel && (
                <span className="text-[10px] text-text-secondary text-center max-w-[100px]">
                  {step.sublabel}
                </span>
              )}
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-[-20px] transition-colors ${
                  isCompleted ? 'bg-success-600' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
