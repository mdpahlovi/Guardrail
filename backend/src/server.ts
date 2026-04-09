import { config, validate } from "@/config";
import { app } from "./app";

const startServer = async (): Promise<void> => {
    try {
        // Validate environment variables
        validate();

        // Start server
        const server = app.listen(config.port, () => {
            console.info(`🚀  Server running on ${config.port}`);
        });

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (reason: Error) => {
            console.error("Unhandled Rejection:", reason.message);
            server.close(() => {
                process.exit(1);
            });
        });

        // Handle uncaught exceptions
        process.on("uncaughtException", (error: Error) => {
            console.error("Uncaught Exception:", error.message);
            process.exit(1);
        });

        // Handle SIGTERM
        process.on("SIGTERM", () => {
            console.info("SIGTERM received. Shutting down gracefully...");
            server.close(() => {
                console.info("Process terminated");
            });
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
