import { useAppForm } from "@/components/form/form-context";
import { Link, createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/__auth/signup")({
    component: RouteComponent,
});

const signupSchema = z.object({
    firstName: z.string().min(2, "Provide your first name"),
    lastName: z.string().min(2, "Provide your last name"),
    email: z.email("Provide a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters"),
});

function RouteComponent() {
    const navigate = Route.useNavigate();

    const form = useAppForm({
        defaultValues: { firstName: "", lastName: "", email: "", password: "" },
        validators: {
            onChange: signupSchema,
        },
        onSubmit: async ({ value }) => {},
    });

    return (
        <>
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Create an account</h1>
                        <p className="text-muted-foreground text-balance">Please enter your details to get started</p>
                    </div>
                    <form
                        className="grid gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <form.AppField name="firstName" children={(field) => <field.FormInput type="text" label="First Name" />} />
                            <form.AppField name="lastName" children={(field) => <field.FormInput type="text" label="Last Name" />} />
                        </div>
                        <form.AppField name="email" children={(field) => <field.FormInput type="email" label="Email" />} />
                        <form.AppField name="password" children={(field) => <field.FormInput type="password" label="Password" />} />
                        <form.AppForm>
                            <form.FormSubmit label="Sign Up" />
                        </form.AppForm>
                    </form>
                </div>
            </div>
            <p className="text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary underline">
                    Sign in
                </Link>
            </p>
        </>
    );
}
