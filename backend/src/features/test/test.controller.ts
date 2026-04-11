import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import { TestService } from "./test.service";

export class TestController {
    static createTest = asyncHandler(async (req: Request, res: Response) => {
        const test = await TestService.createTest(req.body, req.user!);
        ApiResponse.created(res, test, "Test created successfully");
    });

    static getTests = asyncHandler(async (req: Request, res: Response) => {
        const tests = await TestService.getTests(req.query, req.user!);
        ApiResponse.success(res, tests, "Tests fetched successfully");
    });

    static getTest = asyncHandler(async (req: Request, res: Response) => {
        const test = await TestService.getTest(req.params.id as string, req.user!);
        ApiResponse.success(res, test, "Test fetched successfully");
    });

    static getTestCandidates = asyncHandler(async (req: Request, res: Response) => {
        const data = await TestService.getTestCandidates(req.params.id as string, req.user!);
        ApiResponse.success(res, data, "Candidates fetched successfully");
    });

    static deleteTest = asyncHandler(async (req: Request, res: Response) => {
        const test = await TestService.deleteTest(req.params.id as string, req.user!);
        ApiResponse.success(res, test, "Test deleted successfully");
    });
}
