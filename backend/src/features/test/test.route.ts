import { authGuard } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { TestController } from "./test.controller";
import { createTestSchema } from "./test.validation";

const router = Router();

router.post("/", authGuard, validate(createTestSchema), TestController.createTest);
router.get("/", authGuard, TestController.getTests);
router.get("/:id", authGuard, TestController.getTest);
router.delete("/:id", authGuard, TestController.deleteTest);

export const testRoutes = router;
