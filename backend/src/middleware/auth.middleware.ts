import { ApiError } from "@/utils/ApiError";
import { auth } from "@/utils/auth";
import { NextFunction, Request, Response } from "express";

export const authGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as unknown as Headers });
        if (!session?.user) {
            throw ApiError.unauthorized();
        }

        (req as Request & { user: typeof session.user }).user = session.user;
        next();
    } catch (error) {
        next(error instanceof ApiError ? error : ApiError.unauthorized());
    }
};
