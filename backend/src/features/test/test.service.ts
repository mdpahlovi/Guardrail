import { ApiError } from "@/utils/ApiError";
import { prisma } from "@/utils/prisma";
import { User } from "better-auth/types";
import { CreateTestBody } from "./test.validation";

export class TestService {
    static async createTest(body: CreateTestBody, user: User) {
        const { questions, startTime, endTime, ...rest } = body;

        return prisma.test.create({
            data: {
                ...rest,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                createdById: user.id,
                questions: {
                    create: questions.map(({ options, ...question }, order) => ({
                        ...question,
                        order,
                        options: {
                            create: options.map((opt, order) => ({ ...opt, order })),
                        },
                    })),
                },
            },
            include: {
                questions: {
                    include: { options: true },
                    orderBy: { order: "asc" },
                },
            },
        });
    }

    static async getTests(query: Record<string, string>, user: User) {
        return prisma.test.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    static async getTest(id: string, user: User) {
        const test = await prisma.test.findUnique({
            where: { id },
            include: {
                questions: {
                    include: { options: true },
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!test) {
            throw ApiError.notFound("Test not found");
        }

        return test;
    }

    static async deleteTest(id: string, user: User) {
        const test = await prisma.test.findUnique({
            where: { id },
        });

        if (!test) {
            throw ApiError.notFound("Test not found");
        }

        if (test.createdById !== user.id) {
            throw ApiError.forbidden("You are not authorized to delete this test");
        }

        await prisma.test.delete({
            where: { id },
        });

        return test;
    }
}
