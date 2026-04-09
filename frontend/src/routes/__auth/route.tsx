import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/__auth")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-6 p-6 md:p-10">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" width={160} />
                </Link>
                <Outlet />
            </div>
            <div className="hidden lg:flex flex-col p-6">
                <div className="flex-1 bg-white rounded-lg flex items-center justify-center">
                    <img src="/auth.jpg" alt="Image" width={512} />
                </div>
            </div>
        </div>
    );
}
