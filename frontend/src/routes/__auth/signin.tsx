import { useAppForm } from "@/components/form/form-context";
import { auth } from "@/lib/auth";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/__auth/signin")({
    component: RouteComponent,
});

const signinSchema = z.object({
    email: z.email("Provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
});

function RouteComponent() {
    const navigate = Route.useNavigate();

    const form = useAppForm({
        defaultValues: { email: "", password: "" },
        validators: {
            onChange: signinSchema,
        },
        onSubmit: async ({ value }) => {
            await auth.signIn.email(value, {
                onSuccess: () => {
                    navigate({ to: "/" });
                },
                onError: ({ error }) => {
                    toast.error(error.message);
                },
            });
        },
    });

    return (
        <div className="w-full max-w-xl mx-auto my-14 p-6 bg-card border rounded-lg">
            <h1 className="text-2xl text-center font-semibold">Sign In</h1>
            <form
                className="mt-6 grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField
                    name="email"
                    children={(field) => <field.FormInput type="email" label="Email" placeholder="Enter your email" />}
                />
                <form.AppField
                    name="password"
                    children={(field) => <field.FormInput type="password" label="Password" placeholder="Enter your password" />}
                />
                <form.AppForm>
                    <form.FormSubmit label="Sign In" className="mt-2" />
                </form.AppForm>
            </form>
            <p className="mt-6 text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-primary underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
