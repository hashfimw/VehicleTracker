import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { generateReportSchema } from "../validators/vehicle.validator";

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

/**
 * @swagger
 * /api/reports/download:
 *   get:
 *     tags: [Reports]
 *     summary: Download vehicle report as Excel file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: vehicleId
 *         schema:
 *           type: integer
 *         description: Specific vehicle ID (optional)
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No data found
 */
router.get(
  "/download",
  validate(generateReportSchema, "query"),
  reportController.generateReport
);

/**
 * @swagger
 * /api/reports/data:
 *   get:
 *     tags: [Reports]
 *     summary: Get report data as JSON
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: vehicleId
 *         schema:
 *           type: integer
 *         description: Specific vehicle ID (optional)
 *     responses:
 *       200:
 *         description: Report data retrieved successfully
 *       404:
 *         description: No data found
 */
router.get(
  "/data",
  validate(generateReportSchema, "query"),
  reportController.getReportData
);

export { router as reportRoutes };
