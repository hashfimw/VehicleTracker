import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),

  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().transform(Number).default("5432"),
  DB_NAME: z.string().default("vehicle_tracker"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),

  JWT_ACCESS_SECRET: z.string().default("your-access-secret-key"),
  JWT_REFRESH_SECRET: z.string().default("your-refresh-secret-key"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),
});

export const env = envSchema.parse(process.env);

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
