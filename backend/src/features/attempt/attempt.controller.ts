import type { Request, Response } from "express";
import { AttemptService } from "./attempt.service";

export class AttemptController {
    private attemptService = new AttemptService();

    submitAttempt = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const { testId, answers, tabSwitches, fullscreenExit, isAutoSubmit } = req.body;

            const attempt = await this.attemptService.submitAttempt({
                userId,
                testId,
                answers,
                tabSwitches,
                fullscreenExit,
                isAutoSubmit,
            });

            res.status(200).json({
                success: true,
                message: "Test submitted successfully",
                data: attempt,
            });
        } catch (error: any) {
            if (error.message === "Attempt already exists") {
                 res.status(400).json({ success: false, message: "You have already submitted this test" });
                 return;
            }
            res.status(500).json({ success: false, message: error.message || "Internal server error" });
        }
    };
}
