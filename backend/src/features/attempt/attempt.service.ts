import { prisma } from "@/utils/prisma";
import { User } from "better-auth";
import { z } from "zod";
import { submitAttemptSchema } from "./attempt.validate";

export class AttemptService {
    static async submitAttempt(data: z.infer<typeof submitAttemptSchema>["body"], user: User) {
        const { testId, answers, tabSwitches, fullscreenExit, isAutoSubmit } = data;

        const existingAttempt = await prisma.testAttempt.findUnique({
            where: {
                testId_userId: {
                    testId,
                    userId: user.id,
                },
            },
        });

        if (existingAttempt) {
            throw new Error("Attempt already exists");
        }

        const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
            if (Array.isArray(answer)) {
                return {
                    questionId,
                    chosen: answer,
                };
            }

            return {
                questionId,
                chosen: [answer],
                textAnswer: answer,
            };
        });

        const questions = await prisma.question.findMany({
            where: { testId },
            select: { id: true, type: true },
        });

        const questionTypeMap = new Map(questions.map((q) => [q.id, q.type]));

        const finalAnswers = Object.entries(answers).map(([questionId, answer]) => {
            const type = questionTypeMap.get(questionId);

            if (type === "text") {
                return {
                    questionId,
                    textAnswer: answer as string,
                    chosen: [],
                };
            } else {
                return {
                    questionId,
                    chosen: Array.isArray(answer) ? answer : [answer as string],
                    textAnswer: null,
                };
            }
        });

        const attempt = await prisma.testAttempt.create({
            data: {
                userId: user.id,
                testId,
                tabSwitches,
                fullscreenExit,
                isAutoSubmit,
                submittedAt: new Date(),
                answers: {
                    create: finalAnswers,
                },
            },
            include: {
                answers: true,
            },
        });

        return attempt;
    }
}
