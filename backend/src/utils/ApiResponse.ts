import { Response } from "express";

export interface MetaResponse {
    page: number;
    limit: number;
    total: number;
    [key: string]: unknown;
}

export interface IApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: MetaResponse;
}

export class ApiResponse {
    static success<T>(res: Response, data: T, message = "Success", statusCode = 200): Response<IApiResponse<T>> {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static created<T>(res: Response, data: T, message = "Created successfully"): Response<IApiResponse<T>> {
        return this.success(res, data, message, 201);
    }

    static paginated<T>(res: Response, data: T[], meta: MetaResponse, message = "Success"): Response<IApiResponse<T[]>> {
        return res.status(200).json({
            success: true,
            message,
            data,
            meta,
        });
    }
}
