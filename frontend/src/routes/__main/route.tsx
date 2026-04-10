import { auth } from "@/lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/__main")({
    beforeLoad: async () => {
        const session = await auth.getSession();
        if (!session?.data?.user) {
            throw redirect({ to: "/signin" });
        }
        return { user: session.data.user };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
