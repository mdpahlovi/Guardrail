import { ApiError } from "@/utils/ApiError";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod/v4";

export const validate = <T>(schema: ZodType<T>) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })) as Record<string, unknown>;

            if ("body" in parsed) req.body = parsed.body;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((error) => ({
                    field: error.path.join("."),
                    message: error.message,
                }));
                next(ApiError.badRequest("Validation failed", errorMessages));
            } else {
                next(error);
            }
        }
    };
};
