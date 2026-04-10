import { cn } from "@/lib/utils";
import type { Question } from "@/routes/__main/create-test";
import { Pencil, Trash2 } from "lucide-react";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export function QuestionCard({
    question,
    index,
    onEdit,
    onRemove,
}: {
    question: Question;
    index: number;
    onEdit: () => void;
    onRemove: () => void;
}) {
    const typeLabel = question.type === "radio" ? "MCQ" : question.type === "checkbox" ? "Checkbox" : "Text";

    return (
        <div className="border rounded-lg p-6 bg-card flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b pb-4">
                <p className="font-semibold">Question {index + 1}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="px-2 py-0.5 rounded-full border text-sm uppercase">{typeLabel}</div>
                    <div className="px-2 py-0.5 rounded-full border text-sm">{question.marks} pt</div>
                </div>
            </div>

            {/* Question text */}
            <div className="font-medium leading-none">{question.questionText}</div>

            {/* Options */}
            {(question.type === "radio" || question.type === "checkbox") && (
                <div className="flex flex-col gap-2">
                    {question.options.map((opt, i) => {
                        const isCorrect = question.correctAnswers.includes(opt.id);
                        return (
                            <div
                                key={opt.id}
                                className={cn(
                                    "h-10 flex items-center gap-2 rounded-md px-3 py-2 border",
                                    isCorrect ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-muted/20",
                                )}
                            >
                                <span className="font-medium text-muted-foreground">{OPTION_LABELS[i] ?? i + 1}.</span>
                                <span className="flex-1">{opt.text}</span>
                                {isCorrect && (
                                    <svg viewBox="0 0 20 20" className="size-5 text-green-500 shrink-0" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Text answer preview */}
            {question.type === "text" && question.answerText && (
                <div
                    className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/20 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: question.answerText }}
                />
            )}

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-4">
                <button onClick={onEdit} className="text-primary leading-none hover:underline font-medium flex items-center gap-1">
                    <Pencil className="size-4" /> Edit
                </button>
                <button onClick={onRemove} className="text-destructive leading-none hover:underline font-medium flex items-center gap-1">
                    <Trash2 className="size-4" /> Remove From Exam
                </button>
            </div>
        </div>
    );
}
