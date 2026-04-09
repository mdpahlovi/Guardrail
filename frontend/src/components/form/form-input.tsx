import { useFieldContext } from "./form-context";
import { Input } from "@/components/ui/input";

type FormInputProps = {
    type?: React.HTMLInputTypeAttribute;
    label: string;
    placeholder?: string;
    disabled?: boolean;
};

export function FormInput({ type = "text", label, ...props }: FormInputProps) {
    const field = useFieldContext<string>();

    return (
        <Input
            name={field.name}
            type={type}
            label={label}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={
                field.state.meta.isTouched && !field.state.meta.isValid
                    ? field.state.meta.errors.map((error) => error.message).join(", ")
                    : undefined
            }
            {...props}
        />
    );
}
