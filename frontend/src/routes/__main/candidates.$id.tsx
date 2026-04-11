import { Button } from "@/components/ui/button";
import axios, { type AxiosResponse } from "@/lib/axios";
import type { Test, TestAttempt } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, FileText, MonitorOff, Repeat, Users } from "lucide-react";

export const Route = createFileRoute("/__main/candidates/$id")({
    component: RouteComponent,
});

function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
    return (
        <div className="p-4 bg-card border rounded-lg flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="size-5 text-primary" />
            </div>
            <div>
                <p className="text-2xl font-semibold leading-tight">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}

function RouteComponent() {
    const { id } = Route.useParams();

    const { data, isLoading } = useQuery<AxiosResponse<{ test: Test; attempts: TestAttempt[] }>>({
        queryKey: ["test-candidates", id],
        queryFn: () => axios.get(`/test/${id}/candidates`),
    });

    const result = data?.data;

    if (isLoading) {
        return (
            <main className="container mx-auto px-6 my-14 flex-1 flex flex-col">
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Loading candidates...</p>
                </div>
            </main>
        );
    }

    if (!result) {
        return (
            <main className="container mx-auto px-6 my-14 flex-1 flex flex-col">
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center">
                    <img src="/empty.png" alt="Empty" width={120} height={120} />
                    <h3 className="mt-5 text-xl font-semibold">Test Not Found</h3>
                    <p className="mt-3 text-sm text-muted-foreground">Could not load candidate data for this test.</p>
                    <Button variant="secondary" className="mt-5" asChild>
                        <Link to="/">Go Back</Link>
                    </Button>
                </div>
            </main>
        );
    }

    const { test, attempts } = result;
    const avgTabSwitches = attempts.length > 0 ? (attempts.reduce((sum, a) => sum + a.tabSwitches, 0) / attempts.length).toFixed(1) : "0";
    const autoSubmitCount = attempts.filter((a) => a.isAutoSubmit).length;

    return (
        <main className="container mx-auto px-6 my-14 flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="p-6 bg-card border rounded-lg flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold">{test.title}</h2>
                    <p className="text-sm text-muted-foreground">
                        {test.questionSet} Questions · {test.duration} min duration
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link to="/">
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Candidates" value={test.totalCandidates} />
                <StatCard icon={CheckCircle} label="Submitted" value={attempts.length} />
                <StatCard icon={Repeat} label="Avg Tab Switches" value={avgTabSwitches} />
                <StatCard icon={MonitorOff} label="Auto-Submitted" value={autoSubmitCount} />
            </div>

            {/* Candidates Table */}
            {attempts.length === 0 ? (
                <div className="flex-1 p-6 bg-card border rounded-lg flex flex-col items-center justify-center">
                    <img src="/empty.png" alt="Empty" width={120} height={120} />
                    <h3 className="mt-5 text-xl font-semibold">No Candidates Yet</h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                        No candidates have attempted this test yet. Share the test to get started.
                    </p>
                </div>
            ) : (
                <div className="bg-card border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="text-left px-6 py-4 font-semibold text-muted-foreground">#</th>
                                    <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Candidate</th>
                                    <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Answered</th>
                                    <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Submitted At</th>
                                    <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Tab Switches</th>
                                    <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Fullscreen Exits</th>
                                    <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.map((attempt, i) => {
                                    const hasWarning = attempt.tabSwitches > 0 || attempt.fullscreenExit > 0;
                                    return (
                                        <tr key={attempt.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4 text-muted-foreground">{i + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                                                        {attempt?.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium leading-tight truncate">{attempt?.user?.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{attempt?.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="size-3.5 text-muted-foreground" />
                                                    <span>
                                                        {attempt?.answers?.length}/{test.questionSet}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-3.5 text-muted-foreground" />
                                                    <span>{formatDate(attempt.submittedAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        attempt.tabSwitches > 0
                                                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                                            : "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                                    }`}
                                                >
                                                    {attempt.tabSwitches > 0 && <AlertTriangle className="size-3" />}
                                                    {attempt.tabSwitches}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        attempt.fullscreenExit > 0
                                                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                                            : "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                                    }`}
                                                >
                                                    {attempt.fullscreenExit > 0 && <MonitorOff className="size-3" />}
                                                    {attempt.fullscreenExit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {attempt.isAutoSubmit ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400">
                                                        <Clock className="size-3" />
                                                        Auto-Submitted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                                        <CheckCircle className="size-3" />
                                                        Submitted
                                                    </span>
                                                )}
                                                {hasWarning && (
                                                    <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                                        <AlertTriangle className="size-3" />
                                                        Flagged
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
}
