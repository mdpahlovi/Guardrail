export class ApiError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    errors?: unknown[];

    constructor(statusCode: number, message: string, errors?: unknown[], isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = isOperational;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, errors?: unknown[]): ApiError {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized"): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message = "Forbidden"): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message = "Not found"): ApiError {
        return new ApiError(404, message);
    }

    static conflict(message: string): ApiError {
        return new ApiError(409, message);
    }

    static internal(message = "Internal server error"): ApiError {
        return new ApiError(500, message);
    }
}
