import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__main/candidates/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/__main/candidates"!</div>;
}
