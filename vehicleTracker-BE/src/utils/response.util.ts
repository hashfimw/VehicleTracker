import { Response } from "express";
import { ApiResponse, PaginationMeta } from "../types/common.types";

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static successWithPagination<T>(
    res: Response,
    data: T,
    pagination: PaginationMeta,
    message = "Success",
    statusCode = 200
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      pagination,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode = 500, data?: any) {
    const response: ApiResponse = {
      success: false,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string, data?: any) {
    return this.error(res, message, 400, data);
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = "Forbidden") {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static conflict(res: Response, message: string) {
    return this.error(res, message, 409);
  }

  static validationError(res: Response, errors: any) {
    return this.badRequest(res, "Validation failed", errors);
  }
}
