import { cn } from "@/lib/utils";
import React from "react";

type StepIndicatorProps = {
    steps: string[];
    currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-3">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep >= stepNumber;

                return (
                    <React.Fragment key={stepNumber}>
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "size-6 rounded-full flex items-center justify-center text-xs font-bold",
                                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                )}
                            >
                                {stepNumber}
                            </div>
                            <p className={cn("font-medium text-sm", isActive ? "text-primary" : "text-muted-foreground")}>{step}</p>
                        </div>
                        {index < steps.length - 1 && <div className="w-16 h-0.5 bg-border rounded-full" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
