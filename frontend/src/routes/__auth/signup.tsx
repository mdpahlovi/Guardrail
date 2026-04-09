import { useAppForm } from "@/components/form/form-context";
import { auth } from "@/lib/auth";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export const Route = createFileRoute("/__auth/signup")({
    component: RouteComponent,
});

const signupSchema = z.object({
    name: z.string().min(2, "Provide your full name"),
    email: z.email("Provide a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters"),
});

function RouteComponent() {
    return (
        <div className="w-full max-w-xl mx-auto my-14 p-6 bg-card border rounded-lg">
            <h1 className="text-2xl text-center font-semibold">Sign Up</h1>
            <Tabs defaultValue="employer" className="mt-6">
                <TabsList>
                    <TabsTrigger value="employer">Employer</TabsTrigger>
                    <TabsTrigger value="candidate">Candidate</TabsTrigger>
                </TabsList>
                <SignUpForm role="employer" />
                <SignUpForm role="candidate" />
            </Tabs>
            <p className="mt-6 text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}

function SignUpForm({ role }: { role: "employer" | "candidate" }) {
    const navigate = Route.useNavigate();

    const form = useAppForm({
        defaultValues: { name: "", email: "", password: "" },
        validators: {
            onChange: signupSchema,
        },
        onSubmit: async ({ value }) => {
            await auth.signUp.email(
                {
                    name: value.name,
                    email: value.email,
                    role,
                    password: value.password,
                    callbackURL: `${import.meta.env.VITE_APP_CLIENT}/rooms`,
                },
                {
                    onSuccess: () => {
                        navigate({ to: "/" });
                    },
                    onError: ({ error }) => {
                        toast.error(error.message);
                    },
                },
            );
        },
    });

    return (
        <TabsContent value={role}>
            <form
                className="grid gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField
                    name="name"
                    children={(field) => <field.FormInput type="text" label="Full Name" placeholder="Enter your full name" />}
                />
                <form.AppField
                    name="email"
                    children={(field) => <field.FormInput type="email" label="Email" placeholder="Enter your email" />}
                />
                <form.AppField
                    name="password"
                    children={(field) => <field.FormInput type="password" label="Password" placeholder="Enter your password" />}
                />
                <form.AppForm>
                    <form.FormSubmit label="Sign Up" className="mt-2" />
                </form.AppForm>
            </form>
        </TabsContent>
    );
}
