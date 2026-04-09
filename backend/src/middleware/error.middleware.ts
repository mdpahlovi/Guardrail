import { config } from "@/config";
import { ApiError } from "@/utils/ApiError";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    let error = err;

    // Log error
    console.error(`❌  ${err.message}`);

    // Default to ApiError if not already
    if (!(error instanceof ApiError)) {
        error = new ApiError(500, err.message || "Internal Server Error");
    }

    const apiError = error as ApiError;

    res.status(apiError.statusCode).json({
        success: false,
        message: apiError.message,
        errors: apiError.errors,
        ...(config.env === "development" && { stack: apiError.stack }),
    });
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
