import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import * as testService from "./test.service";

export class TestController {
    static createTest = asyncHandler(async (req: Request, res: Response) => {
        const test = await testService.createTest(req.body, req.user);
        ApiResponse.created(res, test, "Test created successfully");
    });

    static getTests = asyncHandler(async (req: Request, res: Response) => {
        const tests = await testService.getTests(req.query, req.user);
        ApiResponse.success(res, tests, "Tests fetched successfully");
    });

    static deleteTest = asyncHandler(async (req: Request, res: Response) => {
        const deleted = await testService.deleteTest(req.params.testId as string, req.user);
        if (!deleted) throw ApiError.notFound("Test not found");
        ApiResponse.success(res, deleted, "Test deleted successfully");
    });
}
