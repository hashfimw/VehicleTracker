import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(255, "Full name must be less than 255 characters"),
  role: z.enum(["admin", "user"]).default("user"),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(255, "Full name must be less than 255 characters")
    .optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export const getUsersSchema = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, "Page must be greater than 0")
    .default("1"),
  limit: z
    .string()
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
    .default("10"),
});
