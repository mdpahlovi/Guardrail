import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Question, QuestionType } from "@/routes/__main/create-test";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export function QuestionDialog({
    question: initial,
    questionNumber,
    onSave,
    onSaveAndAddMore,
    onClose,
}: {
    question: Question;
    questionNumber: number;
    onSave: (q: Question) => void;
    onSaveAndAddMore: (q: Question) => void;
    onClose: () => void;
}) {
    const [q, setQ] = useState<Question>({ ...initial });

    const update = (patch: Partial<Question>) => setQ((prev) => ({ ...prev, ...patch }));

    const createOption = () => update({ options: [...q.options, { id: crypto.randomUUID(), text: "" }] });

    const removeOption = (id: string) =>
        update({
            options: q.options.filter((o) => o.id !== id),
            correctAnswers: q.correctAnswers.filter((a) => a !== id),
        });

    const setOptionText = (id: string, text: string) => update({ options: q.options.map((o) => (o.id === id ? { ...o, text } : o)) });

    const toggleCorrect = (id: string) => {
        if (q.type === "radio") {
            update({ correctAnswers: q.correctAnswers[0] === id ? [] : [id] });
        } else {
            update({
                correctAnswers: q.correctAnswers.includes(id) ? q.correctAnswers.filter((a) => a !== id) : [...q.correctAnswers, id],
            });
        }
    };

    const handleTypeChange = (type: QuestionType) => {
        update({ type, correctAnswers: [] });
    };

    const isValid = q.questionText.trim().length > 0;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-card border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b">
                        <span className="size-6 border rounded-full flex items-center justify-center">{questionNumber}</span>
                        <span className="font-semibold flex-1">Question {questionNumber}</span>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Score:</span>
                            <input
                                type="number"
                                min={1}
                                value={q.marks}
                                onChange={(e) => update({ marks: Math.max(1, Number(e.target.value)) })}
                                className="w-14 border rounded px-2 py-1 text-sm text-center"
                            />
                        </div>

                        <select
                            value={q.type}
                            onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                            className="border rounded px-2 py-1 text-sm bg-card"
                        >
                            <option value="text">Text</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                        </select>

                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                        {/* Question text */}
                        <Textarea
                            value={q.questionText}
                            onChange={(e) => update({ questionText: e.target.value })}
                            placeholder="Type question here…"
                        />

                        {/* ── Text type: answer area ── */}
                        {q.type === "text" && (
                            <div className="flex gap-3">
                                <div className="flex items-center justify-center size-7 rounded-full border text-xs font-medium text-muted-foreground shrink-0 mt-1">
                                    A
                                </div>
                                <div className="flex-1">
                                    <Textarea
                                        value={q.answerText}
                                        onChange={(e) => update({ answerText: e.target.value })}
                                        placeholder="Model answer (optional)"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Radio / Checkbox: options ── */}
                        {(q.type === "radio" || q.type === "checkbox") && (
                            <div className="flex flex-col gap-4">
                                {q.options.map((opt, idx) => (
                                    <div key={opt.id}>
                                        {/* Option header */}
                                        <div className="flex items-center gap-3 pb-3 bg-muted/20">
                                            <span className="size-6 border rounded-full flex items-center justify-center text-sm">
                                                {OPTION_LABELS[idx] ?? idx + 1}
                                            </span>
                                            <label className="flex items-center gap-2 flex-1 cursor-pointer text-sm text-muted-foreground select-none">
                                                {q.type === "radio" ? (
                                                    <input
                                                        type="radio"
                                                        name={`correct-${q.id}`}
                                                        checked={q.correctAnswers[0] === opt.id}
                                                        onChange={() => toggleCorrect(opt.id)}
                                                        className="accent-primary"
                                                    />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={q.correctAnswers.includes(opt.id)}
                                                        onChange={() => toggleCorrect(opt.id)}
                                                        className="accent-primary"
                                                    />
                                                )}
                                                Set as correct answer
                                            </label>
                                            {q.options.length > 1 && (
                                                <button
                                                    onClick={() => removeOption(opt.id)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        {/* Option text */}
                                        <Textarea
                                            value={opt.text}
                                            onChange={(e) => setOptionText(opt.id, e.target.value)}
                                            placeholder={`Option ${OPTION_LABELS[idx] ?? idx + 1}`}
                                        />
                                    </div>
                                ))}

                                {q.options.length < 6 && (
                                    <button
                                        type="button"
                                        onClick={createOption}
                                        className="flex items-center gap-1 text-sm text-primary hover:underline font-medium self-start"
                                    >
                                        <Plus className="size-3.5" /> Another option
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 px-6 py-4 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!isValid}
                            onClick={() => {
                                onSave({ ...q, isEditing: false });
                                onClose();
                            }}
                        >
                            Save
                        </Button>
                        <Button size="sm" disabled={!isValid} onClick={() => onSaveAndAddMore({ ...q, isEditing: false })}>
                            Save &amp; Add More
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
