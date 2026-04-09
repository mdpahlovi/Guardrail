import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = {
    label: string;
    error?: string;
} & React.ComponentProps<"input">;

function Input({ type = "text", label, className, error, ...props }: InputProps) {
    return (
        <div className="relative">
            <input
                id={props.name}
                type={type}
                aria-invalid={!!error}
                className={cn(
                    "peer w-full px-0 pt-3.75 pb-1 border-0 border-b-2 border-input focus:border-primary focus:outline-none aria-invalid:border-destructive",
                    className,
                )}
                {...props}
            />
            <label
                htmlFor={props.name}
                className={cn("absolute left-0 top-3.75 transition-all", props.value ? "-top-1" : "peer-focus:-top-1")}
            >
                {label}
            </label>
            {error && <p className="mt-0.5 text-xs leading-4 text-destructive">{error}</p>}
        </div>
    );
}

export { Input };
