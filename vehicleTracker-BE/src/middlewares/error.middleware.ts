import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response.util";
import { isDevelopment } from "../config/environment";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid data format";
  }

  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  const errorResponse: any = {
    success: false,
    message,
  };

  if (isDevelopment) {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response) => {
  ResponseUtil.notFound(res, `Route ${req.method} ${req.path} not found`);
};
