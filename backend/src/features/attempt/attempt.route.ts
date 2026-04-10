import { authGuard } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { AttemptController } from "./attempt.controller";
import { submitAttemptSchema } from "./attempt.validate";

const router = Router();
const attemptController = new AttemptController();

router.post("/", authGuard, validate(submitAttemptSchema), attemptController.submitAttempt);

export { router as attemptRoutes };
