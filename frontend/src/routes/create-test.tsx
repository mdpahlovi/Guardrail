import { useAppForm } from "@/components/form/form-context";
import { QuestionCard } from "@/components/main/question-card";
import { QuestionDialog } from "@/components/main/question-dialog";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/ui/step-indicator";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/create-test")({
    component: RouteComponent,
});

// ─── Schemas ──────────────────────────────────────────────────────────────────

const basicInfoSchema = z
    .object({
        title: z.string().min(1, "Test title is required"),
        totalCandidates: z.coerce.number().int().positive("Must be positive"),
        totalSets: z.coerce.number().int().positive("Must be positive"),
        questionSet: z.coerce.number().int().positive("Must be positive"),
        questionType: z.enum(["mcq", "essay", "mixed"], { error: "Select a question type" }),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        duration: z.coerce.number().int().positive("Must be positive"),
    })
    .refine((d) => !d.startTime || !d.endTime || d.endTime > d.startTime, {
        message: "End time must be after start time",
        path: ["endTime"],
    });

type BasicInfoValues = z.infer<typeof basicInfoSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionType = "text" | "radio" | "checkbox";

export type Option = {
    id: string;
    text: string;
};

export type Question = {
    id: string;
    type: QuestionType;
    marks: number;
    questionText: string;
    answerText: string; // used when type === "text"
    options: Option[];
    correctAnswers: string[]; // option ids
    isEditing?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _counter = 0;
const uid = () => `${Date.now()}-${++_counter}`;

function newQuestion(type: QuestionType): Question {
    return {
        id: uid(),
        type,
        marks: 1,
        questionText: "",
        answerText: "",
        options: [
            { id: uid(), text: "" },
            { id: uid(), text: "" },
            { id: uid(), text: "" },
        ],
        correctAnswers: [],
    };
}

// ─── Basic Info Summary ───────────────────────────────────────────────────────
function BasicInfoSummary({ values, onEdit }: { values: BasicInfoValues; onEdit: () => void }) {
    return (
        <div className="max-w-4xl mx-auto w-full p-6 bg-card border rounded-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <button onClick={onEdit} className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                    <Pencil className="size-3.5" /> Edit
                </button>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
                {(
                    [
                        ["Online Test Title", values.title],
                        ["Total Candidates", values.totalCandidates],
                        ["Total Slots", values.totalSets],
                        ["Total Question Set", values.questionSet],
                        ["Duration Per Slots (Minutes)", values.duration],
                        ["Question Type", String(values.questionType)],
                    ] as [string, string | number][]
                ).map(([label, val], index) => (
                    <div key={label} className={cn("flex flex-col gap-1", index === 0 && "col-span-full")}>
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-foreground font-medium">{val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function RouteComponent() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [savedBasicInfo, setSavedBasicInfo] = useState<BasicInfoValues | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [dialogQuestion, setDialogQuestion] = useState<Question | null>(null);

    const basicForm = useAppForm({
        defaultValues: {
            title: "tttt",
            totalCandidates: 10,
            totalSets: 10,
            questionSet: 10,
            questionType: "mcq" as "mcq" | "essay" | "mixed",
            startTime: "2026-04-10T10:00",
            endTime: "2026-04-10T11:00",
            duration: 60,
        },
        validators: { onChange: basicInfoSchema },
        onSubmit: ({ value }) => {
            setSavedBasicInfo(value);
            setStep(2);
        },
    });

    // Derive default type from basicInfo
    const defaultQuestionType = (): QuestionType => {
        if (savedBasicInfo?.questionType === "mcq") return "radio";
        if (savedBasicInfo?.questionType === "essay") return "text";
        return "radio";
    };

    const openAddDialog = () => setDialogQuestion(newQuestion(defaultQuestionType()));

    const openEditDialog = (q: Question) => setDialogQuestion({ ...q });

    const closeDialog = () => setDialogQuestion(null);

    const handleSave = (q: Question) => {
        setQuestions((prev) => {
            const exists = prev.find((x) => x.id === q.id);
            return exists ? prev.map((x) => (x.id === q.id ? q : x)) : [...prev, q];
        });
        closeDialog();
    };

    const handleSaveAndAddMore = (q: Question) => {
        setQuestions((prev) => {
            const exists = prev.find((x) => x.id === q.id);
            return exists ? prev.map((x) => (x.id === q.id ? q : x)) : [...prev, q];
        });
        // open a fresh dialog immediately
        setDialogQuestion(newQuestion(defaultQuestionType()));
    };

    const removeQuestion = (id: string) => setQuestions((prev) => prev.filter((x) => x.id !== id));

    const handleSaveTest = () => {
        // TODO: submit to API
        alert("Test saved successfully!");
        navigate({ to: "/" });
    };

    // dialog index (for the "Question N" header)
    const dialogIndex = dialogQuestion ? questions.findIndex((q) => q.id === dialogQuestion.id) : -1;
    const dialogNumber = dialogIndex === -1 ? questions.length + 1 : dialogIndex + 1;

    return (
        <>
            <main className="container mx-auto px-6 my-14 flex-1 flex flex-col gap-6">
                {/* Header */}
                <div className="p-6 bg-card border rounded-lg flex flex-col gap-6">
                    <h2 className="text-2xl font-semibold">Manage Online Test</h2>
                    <div className="flex items-center justify-between">
                        <StepIndicator steps={["Basic Info", "Questions Sets"]} currentStep={step} />
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>

                {/* ── Step 1: Basic Info ── */}
                {step === 1 && (
                    <div className="max-w-4xl mx-auto w-full p-6 bg-card border rounded-lg flex flex-col gap-6">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        <form
                            className="grid gap-5"
                            onSubmit={(e) => {
                                e.preventDefault();
                                basicForm.handleSubmit();
                            }}
                        >
                            <basicForm.AppField
                                name="title"
                                children={(field) => (
                                    <field.FormInput type="text" label="Online Test Title" placeholder="Enter online test title" />
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <basicForm.AppField
                                    name="totalCandidates"
                                    children={(field) => (
                                        <field.FormInput type="number" label="Total Candidates" placeholder="Enter total candidates" />
                                    )}
                                />
                                <basicForm.AppField
                                    name="totalSets"
                                    children={(field) => (
                                        <field.FormInput type="number" label="Total Sets" placeholder="Enter total sets" />
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <basicForm.AppField
                                    name="questionSet"
                                    children={(field) => (
                                        <field.FormInput
                                            type="number"
                                            label="Total Question Set"
                                            placeholder="Enter number of questions per set"
                                        />
                                    )}
                                />
                                <basicForm.AppField
                                    name="questionType"
                                    children={(field) => (
                                        <field.FormSelect
                                            label="Question Type"
                                            placeholder="Select question type"
                                            options={[
                                                { label: "MCQ", value: "mcq" },
                                                { label: "Essay", value: "essay" },
                                                { label: "Mixed", value: "mixed" },
                                            ]}
                                        />
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <basicForm.AppField
                                    name="startTime"
                                    children={(field) => <field.FormInput type="datetime-local" label="Start Time" />}
                                />
                                <basicForm.AppField
                                    name="endTime"
                                    children={(field) => <field.FormInput type="datetime-local" label="End Time" />}
                                />
                                <basicForm.AppField
                                    name="duration"
                                    children={(field) => <field.FormInput type="number" label="Duration (mins)" placeholder="e.g. 60" />}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" type="button" asChild>
                                    <Link to="/">Cancel</Link>
                                </Button>
                                <Button type="submit">Save &amp; Continue</Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── Step 2: Questions ── */}
                {step === 2 && savedBasicInfo && (
                    <>
                        <BasicInfoSummary values={savedBasicInfo} onEdit={() => setStep(1)} />

                        <div className="max-w-4xl mx-auto w-full flex flex-col gap-4">
                            {questions.map((q, i) => (
                                <QuestionCard
                                    key={q.id}
                                    question={q}
                                    index={i}
                                    onEdit={() => openEditDialog(q)}
                                    onRemove={() => removeQuestion(q.id)}
                                />
                            ))}

                            <Button onClick={openAddDialog} className="w-full">
                                <Plus className="size-4 mr-2" /> Add Question
                            </Button>

                            {questions.length > 0 && (
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button onClick={handleSaveTest}>Save Test</Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* ── Question Dialog ── */}
            {dialogQuestion && (
                <QuestionDialog
                    question={dialogQuestion}
                    questionNumber={dialogNumber}
                    onSave={handleSave}
                    onSaveAndAddMore={handleSaveAndAddMore}
                    onClose={closeDialog}
                />
            )}
        </>
    );
}
