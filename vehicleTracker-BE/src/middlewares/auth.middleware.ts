import { Request, Response, NextFunction } from "express";
import { JWTUtil } from "../utils/jwt.util";
import { ResponseUtil } from "../utils/response.util";
import { JWTPayload } from "../types/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = JWTUtil.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return ResponseUtil.unauthorized(res, "Access token is required");
    }

    const decoded = JWTUtil.verifyAccessToken(token);
    req.user = decoded;
    next();
    return;
  } catch (error) {
    return ResponseUtil.unauthorized(res, "Invalid or expired access token");
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseUtil.unauthorized(res, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      return ResponseUtil.forbidden(res, "Insufficient permissions");
    }

    return next();
  };
};
