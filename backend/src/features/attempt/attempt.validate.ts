import { z } from "zod";

export const submitAttemptSchema = z.object({
    body: z.object({
        testId: z.string().min(1, "Test ID is required"),
        answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
        tabSwitches: z.number().int().nonnegative().default(0),
        fullscreenExit: z.number().int().nonnegative().default(0),
        isAutoSubmit: z.boolean().default(false),
    }),
});
