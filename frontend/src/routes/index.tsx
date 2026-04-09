import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="container mx-auto px-6 my-14">
            <div className="grid grid-cols-2 gap-4">
                <h2 className="text-2xl font-semibold">Online Tests</h2>
                <div className="flex gap-4">
                    <Input placeholder="Search by exam title" className="border-primary shadow-lg" />
                    <Button>Create Online Test</Button>
                </div>
            </div>
        </div>
    );
}
