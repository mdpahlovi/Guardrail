import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios, { type AxiosResponse } from "@/lib/axios";
import type { Option, Test } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/__main/test/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = Route.useParams();
    const { user } = Route.useRouteContext();

    const { data, isLoading } = useQuery<AxiosResponse<{ data: Test }>>({
        queryKey: ["test", id],
        queryFn: () => axios.get(`/test/${id}`),
    });

    const test = (data?.data as any)?.data || data?.data;

    const [hasStarted, setHasStarted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [tabSwitches, setTabSwitches] = useState(0);
    const [fullscreenExits, setFullscreenExits] = useState(0);

    useEffect(() => {
        if (test && !hasStarted && timeLeft === 0) {
            setTimeLeft((test as Test).duration * 60);
        }
    }, [test, hasStarted, timeLeft]);

    const { mutate, isPending: isSubmitting } = useMutation({
        mutationFn: (data: any) => axios.post("/attempt", data),
        onSuccess: () => {
            setIsSubmitted(true);
            toast.success("Exam submitted successfully!");
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to submit exam");
            if (error.message === "You have already submitted this test") {
                setIsSubmitted(true);
            }
        },
    });

    const handleSubmit = useCallback(
        (isAutoSubmit = false) => {
            if (isSubmitted || isSubmitting) return;

            mutate({
                testId: id,
                answers,
                tabSwitches,
                fullscreenExit: fullscreenExits,
                isAutoSubmit,
            });
        },
        [isSubmitted, isSubmitting, id, answers, tabSwitches, fullscreenExits],
    );

    useEffect(() => {
        if (!hasStarted || isSubmitted || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    toast.info("Time is up! Auto-submitting the exam.");
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [hasStarted, isSubmitted, timeLeft, handleSubmit]);

    useEffect(() => {
        if (!hasStarted || isSubmitted) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                toast.error("Warning: Tab switching detected! Activity has been recorded.");
                setTabSwitches((prev) => prev + 1);
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                toast.error("Warning: Fullscreen exit detected! Please return to fullscreen.");
                setFullscreenExits((prev) => prev + 1);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [hasStarted, isSubmitted]);

    if (isLoading) {
        return (
            <main className="container mx-auto px-6 my-14 flex-1 flex flex-col">
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Loading exam...</p>
                </div>
            </main>
        );
    }

    if (!test || !test.questions || test.questions.length === 0) {
        return (
            <main className="container mx-auto px-6 my-14 flex-1 flex flex-col">
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center">
                    <img src="/empty.png" alt="Empty" width={120} height={120} />
                    <h3 className="mt-5 text-xl font-semibold">Test Not Found</h3>
                    <p className="mt-3 text-sm text-muted-foreground">Test not found or has no questions.</p>
                    <Button variant="secondary" className="mt-5" asChild>
                        <Link to="/">Go Back</Link>
                    </Button>
                </div>
            </main>
        );
    }

    if (isSubmitted) {
        return (
            <main className="container mx-auto px-6 my-14 flex-1 flex flex-col">
                <div className="flex-1 p-6 bg-card rounded-lg flex flex-col items-center justify-center gap-6">
                    <div className="flex flex-col gap-3 text-center">
                        <img src="/success.png" alt="Success" className="w-14 h-14 mx-auto" />
                        <h3 className="text-xl font-semibold">Test Submitted</h3>
                        <p className="text-muted-foreground">
                            Congratulations! {user?.name}, You have completed your MCQ Exam for {test.title}. Thank you for participating.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link to="/">Back to Dashboard</Link>
                    </Button>
                </div>
            </main>
        );
    }

    if (!hasStarted) {
        return (
            <main className="container mx-auto px-6 my-14 flex-1 flex items-center justify-center">
                <div className="max-w-xl w-full p-6 bg-card border rounded-lg flex flex-col gap-4 text-center">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold">{test.title}</h2>
                        <p className="text-muted-foreground">Duration: {test.duration} minutes</p>
                        <p className="text-muted-foreground">Negative Marking: {test.negativeMarking} points</p>
                    </div>
                    <div className="p-4 bg-muted text-sm rounded-md text-left">
                        <p className="font-semibold mb-2">Instructions:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>The exam will begin in fullscreen mode.</li>
                            <li>Do not switch tabs or exit fullscreen, it will be recorded.</li>
                            <li>The test auto-submits when time runs out.</li>
                        </ul>
                    </div>
                    <Button
                        onClick={() => {
                            document.documentElement.requestFullscreen().catch(() => {
                                toast.error("Could not enter fullscreen mode.");
                            });
                            setHasStarted(true);
                        }}
                    >
                        Start Exam
                    </Button>
                </div>
            </main>
        );
    }

    const currentQuestion = test.questions[currentIndex];

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formattedTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    const handleOptionSelect = (val: string, type: string) => {
        setAnswers((prev) => {
            if (type === "checkbox") {
                const current = (prev[currentQuestion.id] as string[]) || [];
                if (current.includes(val)) {
                    return { ...prev, [currentQuestion.id]: current.filter((v) => v !== val) };
                } else {
                    return { ...prev, [currentQuestion.id]: [...current, val] };
                }
            }
            return { ...prev, [currentQuestion.id]: val };
        });
    };

    const handleTextChange = (val: string) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
    };

    return (
        <main className="container mx-auto px-6 my-14 flex-1 flex flex-col gap-6">
            <div className="max-w-4xl mx-auto w-full px-6 py-4 bg-card border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h3 className="text-xl font-medium">
                    Question ({currentIndex + 1}/{test.questions.length})
                </h3>
                <div className="h-12 px-6 bg-muted rounded-lg flex items-center justify-center font-semibold text-lg text-destructive border border-destructive/20 shadow-sm">
                    {formattedTime} left
                </div>
            </div>

            <div className="max-w-4xl mx-auto w-full p-6 bg-card border rounded-lg flex flex-col gap-6">
                <h3 className="text-xl font-medium">
                    Q{currentIndex + 1}. {currentQuestion.questionText}
                </h3>

                <div className="flex flex-col gap-4">
                    {currentQuestion.type === "text" ? (
                        <Textarea
                            className="min-h-[150px] resize-y"
                            placeholder="Type your answer here..."
                            value={(answers[currentQuestion.id] as string) || ""}
                            onChange={(e) => handleTextChange(e.target.value)}
                        />
                    ) : (
                        currentQuestion.options?.map((option: Option) => {
                            const isChecked =
                                currentQuestion.type === "checkbox"
                                    ? ((answers[currentQuestion.id] as string[]) || []).includes(option.text)
                                    : answers[currentQuestion.id] === option.text;

                            return (
                                <div
                                    key={option.id}
                                    className={`px-4 py-3 border rounded-md flex items-center gap-3 cursor-pointer transition-colors ${isChecked ? "bg-primary/5 border-primary shadow-sm" : "bg-card hover:bg-muted"}`}
                                    onClick={() => handleOptionSelect(option.text, currentQuestion.type)}
                                >
                                    <input
                                        type={currentQuestion.type === "checkbox" ? "checkbox" : "radio"}
                                        name={`question-${currentQuestion.id}`}
                                        id={option.id}
                                        checked={isChecked}
                                        readOnly
                                        className="w-4 h-4 text-primary"
                                    />
                                    <label htmlFor={option.id} className="flex-1 cursor-pointer select-none">
                                        {option.text}
                                    </label>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                    {currentIndex < test.questions.length - 1 ? (
                        <Button variant="outline" onClick={() => setCurrentIndex((p) => p + 1)}>
                            Skip this Question
                        </Button>
                    ) : (
                        <div />
                    )}

                    {currentIndex < test.questions.length - 1 ? (
                        <Button onClick={() => setCurrentIndex((p) => p + 1)}>Save & Continue</Button>
                    ) : (
                        <Button
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isSubmitting}
                            onClick={() => {
                                if (window.confirm("Are you sure you want to submit the exam?")) {
                                    handleSubmit(false);
                                }
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Exam"}
                        </Button>
                    )}
                </div>
            </div>
        </main>
    );
}
