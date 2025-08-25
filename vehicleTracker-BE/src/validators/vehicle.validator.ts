import { z } from "zod";

export const getVehiclesSchema = z.object({
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
  search: z.string().optional(),
});

export const vehicleParamsSchema = z.object({
  id: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, "Vehicle ID must be greater than 0"),
});

export const getVehicleStatusSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
    .optional(),
});

export const generateReportSchema = z
  .object({
    vehicleId: z
      .string()
      .transform(Number)
      .refine((val) => val > 0, "Vehicle ID must be greater than 0")
      .optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
  })
  .refine(
    (data) => new Date(data.startDate) <= new Date(data.endDate),
    "Start date must be before or equal to end date"
  );
