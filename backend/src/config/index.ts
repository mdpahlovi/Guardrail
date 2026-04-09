import dotenv from "dotenv";

dotenv.config();

export const config = {
    // Server
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5000", 10),

    // Database
    databaseUrl: process.env.DATABASE_URL!,

    // CORS
    corsOrigin: process.env.CORS_ORIGIN!,

    // Email
    emailUser: process.env.EMAIL_USER!,
    emailPass: process.env.EMAIL_PASS!,
} as const;

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "CORS_ORIGIN", "EMAIL_USER", "EMAIL_PASS"];

export const validate = (): void => {
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }
};
