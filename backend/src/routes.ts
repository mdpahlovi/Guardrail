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

export { router as apiRoutes };
