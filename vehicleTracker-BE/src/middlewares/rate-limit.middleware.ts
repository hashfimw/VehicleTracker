import rateLimit from "express-rate-limit";
import { env } from "../config/environment";

export const createRateLimit = (maxRequests?: number, windowMs?: number) => {
  return rateLimit({
    windowMs: windowMs || env.RATE_LIMIT_WINDOW_MS,
    max: maxRequests || env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const authRateLimit = createRateLimit(10, 15 * 60 * 1000); // 10 requests per 15 minutes
export const apiRateLimit = createRateLimit();
