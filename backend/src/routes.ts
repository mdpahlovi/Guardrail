import { attemptRoutes } from "@/features/attempt/attempt.route";
import { authRoutes } from "@/features/auth/auth.routes";
import { testRoutes } from "@/features/test/test.route";
import { Router } from "express";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// Feature routes
router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/attempt", attemptRoutes);

export { router as apiRoutes };
