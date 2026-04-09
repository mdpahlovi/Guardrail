import { config } from "@/config";
import { errorHandler, notFoundHandler } from "@/middleware/error.middleware";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { apiRoutes } from "./routes";

const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS
app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Handle favicon requests
app.get("/favicon.ico", (_req, res) => res.status(204).end());

// API Routes
app.use("/api/v1", apiRoutes);

// Handle 404
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export { app };
