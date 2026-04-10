import { z } from "zod";

const optionSchema = z.object({
    id: z.string().min(1),
    text: z.string().min(1, "Option text is required"),
});

const questionSchema = z.object({
    id: z.string().min(1),
    type: z.enum(["text", "radio", "checkbox"]),
    marks: z.number().int().positive(),
    questionText: z.string().min(1, "Question text is required"),
    answerText: z.string().default(""),
    options: z.array(optionSchema),
    correctAnswers: z.array(z.string()),
});

export const createTestSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Test title is required"),
        totalCandidates: z.number().int().positive(),
        totalSlots: z.number().int().positive(),
        questionSet: z.number().int().positive(),
        questionType: z.enum(["mcq", "essay", "mixed"]),
        startTime: z.iso.datetime(),
        endTime: z.iso.datetime(),
        duration: z.number().int().positive(),
        questions: z.array(questionSchema).min(1, "At least one question is required"),
    }),
});

export type CreateTestBody = z.infer<typeof createTestSchema>["body"];
