import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import type { Request, Response } from "express";
import { AttemptService } from "./attempt.service";

export class AttemptController {
    submitAttempt = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const test = await AttemptService.submitAttempt(req.body, req.user!);
        ApiResponse.created(res, test, "Attempt submitted successfully");
    });
}
