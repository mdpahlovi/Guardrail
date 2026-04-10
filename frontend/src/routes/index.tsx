import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, FileText, Users } from "lucide-react";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

const tests = [
    { id: 1, title: "Psychometric Test for Management Trainee Officer", candidates: "10,000", questionSet: "3", examSlots: "3" },
    { id: 2, title: "Psychometric Test for Management Trainee Officer", candidates: "10,000", questionSet: "3", examSlots: "3" },
    {
        id: 3,
        title: "Psychometric Test for Management Trainee Officer",
        candidates: "Not Set",
        questionSet: "Not Set",
        examSlots: "Not Set",
    },
    { id: 4, title: "Psychometric Test for Management Trainee Officer", candidates: "10,000", questionSet: "3", examSlots: "3" },
];

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
    return (
        <main className="container mx-auto px-6 my-14 flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                <h2 className="text-2xl font-semibold">Online Tests</h2>
                <div className="flex gap-4">
                    <Input placeholder="Search by exam title" className="border-primary shadow-lg" />
                    <Button asChild>
                        <Link to="/create-test">Create Online Test</Link>
                    </Button>
                </div>
            </div>
            {!tests?.length ? (
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center">
                    <img src="/empty.png" alt="Empty" width={120} height={120} />
                    <h3 className="mt-5 text-xl font-semibold">No Online Test Available</h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Currently, there are no online tests available. Please check back later for updates.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tests.map((test) => (
                        <div key={test.id} className="p-6 bg-card border rounded-lg flex flex-col">
                            <p className="text-base font-semibold">{test.title}</p>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <MetaItem icon={Users} label="Candidates" value={test.candidates} />
                                <MetaItem icon={FileText} label="Question Set" value={test.questionSet} />
                                <MetaItem icon={Clock} label="Exam Slots" value={test.examSlots} />
                            </div>

                            <div className="mt-auto pt-5">
                                <Button variant="secondary" size="sm" className="w-fit">
                                    View Candidates
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
