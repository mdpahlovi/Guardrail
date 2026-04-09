import { SearchParamError } from "@tanstack/react-router";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { ZodError } from "zod";
import { Button } from "@/components/ui/button";

export function ErrorComp(props: ErrorComponentProps) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/5 text-destructive">
                    <ShieldAlert size={48} />
                </div>

                <div className="text-center grid gap-2">
                    <h4>Something went wrong</h4>
                    <p>{decodeError(props.error)}</p>
                </div>

                <div className="max-w-2xs mx-auto grid gap-4 md:grid-cols-2">
                    <Button onClick={() => window.history.back()}>
                        <ArrowLeft className="size-4" />
                        Go Back
                    </Button>

                    <Button variant="outline" onClick={() => (window.location.href = "/")}>
                        <Home className="size-3.5" />
                        Home Page
                    </Button>
                </div>
            </div>
        </div>
    );
}

function decodeError(error: Error) {
    if (error instanceof SearchParamError) {
        return JSON.parse(error.message)
            .map((issue: ZodError) => issue.message)
            .join(", ");
    }

    return error.message || "An unexpected error occurred while please try again";
}
