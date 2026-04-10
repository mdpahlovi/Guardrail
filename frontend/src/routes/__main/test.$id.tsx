import { Button } from "@/components/ui/button";
import axios, { type AxiosResponse } from "@/lib/axios";
import type { Test } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__main/test/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = Route.useParams();

    const { data } = useQuery<AxiosResponse<Test>>({
        queryKey: ["test", id],
        queryFn: () => axios.get(`/test/${id}`),
    });

    return (
        <main className="container mx-auto px-6 my-14 flex-1 flex flex-col gap-6">
            <div className="max-w-4xl mx-auto w-full px-6 py-4 bg-card border rounded-lg flex items-center justify-between gap-6">
                <h3 className="text-xl font-medium">Question (1/20)</h3>
                <div className="h-14 w-56 bg-muted rounded-lg flex items-center justify-center">20:31 left</div>
            </div>

            <div className="max-w-4xl mx-auto w-full p-6 bg-card border rounded-lg flex flex-col gap-4">
                <h3 className="text-xl font-medium">Q1. Which of the following indicators is used to measure market volatility?</h3>
                <div className="p-4 bg-muted rounded-md flex items-center gap-3">
                    <input type="radio" name="" id="" />
                    <label htmlFor="">Relative Strength Index (RSI)</label>
                </div>
                <div className="p-4 bg-muted rounded-md flex items-center gap-3">
                    <input type="radio" name="" id="" />
                    <label htmlFor="">Relative Strength Index (RSI)</label>
                </div>
                <div className="p-4 bg-muted rounded-md flex items-center gap-3">
                    <input type="radio" name="" id="" />
                    <label htmlFor="">Relative Strength Index (RSI)</label>
                </div>
                <div className="p-4 bg-muted rounded-md flex items-center gap-3">
                    <input type="radio" name="" id="" />
                    <label htmlFor="">Relative Strength Index (RSI)</label>
                </div>
                <div className="pt-2 flex items-center justify-between gap-6">
                    <Button variant="outline">Skip this Question</Button>
                    <Button>Save & Continue</Button>
                </div>
            </div>
        </main>
    );
}
