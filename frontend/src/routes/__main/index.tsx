import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { type AxiosResponse } from "@/lib/axios";
import type { Test } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleX, Clock, FileText, Users } from "lucide-react";

export const Route = createFileRoute("/__main/")({
    component: RouteComponent,
});

function MetaItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <p className="flex items-center gap-2 text-sm">
            <Icon size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{label}:</span>
            {value}
        </p>
    );
}

function RouteComponent() {
    const { user } = Route.useRouteContext();

    const { data, isLoading } = useQuery<AxiosResponse<Test[]>>({
        queryKey: ["tests"],
        queryFn: () => axios.get("/test"),
    });

    return (
        <main className="container mx-auto px-6 my-14 flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                <h2 className="text-2xl font-semibold">Online Tests</h2>
                <div className="flex gap-4">
                    <Input placeholder="Search by exam title" className="border-primary shadow-lg" />
                    {user?.role === "employer" ? (
                        <Button asChild>
                            <Link to="/create-test">Create Online Test</Link>
                        </Button>
                    ) : null}
                </div>
            </div>
            {isLoading ? (
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Loading tests...</p>
                </div>
            ) : !data?.data?.length ? (
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center">
                    <img src="/empty.png" alt="Empty" width={120} height={120} />
                    <h3 className="mt-5 text-xl font-semibold">No Online Test Available</h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Currently, there are no online tests available. Please check back later for updates.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.data?.map((test) => {
                        switch (user?.role) {
                            case "employer":
                                return <EmployerTestCard key={test.id} test={test} />;
                            case "candidate":
                                return <CandidateTestCard key={test.id} test={test} />;
                            default:
                                return null;
                        }
                    })}
                </div>
            )}
        </main>
    );
}

function EmployerTestCard({ test }: { test: Test }) {
    return (
        <div key={test.id} className="p-6 bg-card border rounded-lg flex flex-col">
            <p className="text-base font-semibold">{test.title}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <MetaItem icon={Users} label="Candidates" value={String(test.totalCandidates)} />
                <MetaItem icon={FileText} label="Question Set" value={String(test.questionSet)} />
                <MetaItem icon={Clock} label="Exam Slots" value={String(test.totalSlots)} />
            </div>

            <div className="mt-auto pt-5">
                <Button variant="secondary" size="sm" className="w-fit" asChild>
                    <Link to="/candidates/$id" params={{ id: test.id }}>
                        View Candidates
                    </Link>
                </Button>
            </div>
        </div>
    );
}

function CandidateTestCard({ test }: { test: Test }) {
    return (
        <div key={test.id} className="p-6 bg-card border rounded-lg flex flex-col">
            <p className="text-base font-semibold">{test.title}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <MetaItem icon={Clock} label="Duration" value={String(test.duration)} />
                <MetaItem icon={FileText} label="Question" value={String(test.questionSet)} />
                <MetaItem icon={CircleX} label="Negative Marking" value={`-${test.negativeMarking}/wrong`} />
            </div>

            <div className="mt-auto pt-5">
                <Button variant="secondary" size="sm" className="w-fit" disabled={!!test?.attempts?.length} asChild>
                    <Link to="/test/$id" params={{ id: test.id }}>
                        {test?.attempts?.length ? "Attempted" : "Start"}
                    </Link>
                </Button>
            </div>
        </div>
    );
}
