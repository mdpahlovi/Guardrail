import { useFormContext } from "./form-context";
import { Button } from "@/components/ui/button";

export function FormSubmit({ label, className }: { label: string; className?: string }) {
    const form = useFormContext();

    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
                <Button type="submit" className={className} loading={isSubmitting} disabled={!canSubmit}>
                    {label}
                </Button>
            )}
        />
    );
}
