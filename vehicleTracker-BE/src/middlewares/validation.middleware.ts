import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ResponseUtil } from "../utils/response.util";

type ValidationSource = "body" | "params" | "query";

export const validate = (
  schema: z.ZodSchema,
  source: ValidationSource = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const result = schema.parse(data);
      req[source] = result;
      next();
      return;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return ResponseUtil.validationError(res, errors);
      }
      return ResponseUtil.badRequest(res, "Invalid request data");
    }
  };
};
