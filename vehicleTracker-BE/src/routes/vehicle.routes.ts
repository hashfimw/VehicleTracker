import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getVehiclesSchema,
  getVehicleStatusSchema,
  vehicleParamsSchema,
} from "../validators/vehicle.validator";

const router = Router();
const vehicleController = new VehicleController();

router.use(authenticate);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get all vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by license plate, brand, or model
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 */
router.get(
  "/",
  validate(getVehiclesSchema, "query"),
  vehicleController.getVehicles
);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get vehicle by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       404:
 *         description: Vehicle not found
 */
router.get(
  "/:id",
  validate(vehicleParamsSchema, "params"),
  vehicleController.getVehicleById
);

/**
 * @swagger
 * /api/vehicles/{id}/status:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get vehicle status by date range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Specific date (YYYY-MM-DD)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Vehicle status retrieved successfully
 *       404:
 *         description: Vehicle not found
 */
router.get(
  "/:id/status",
  validate(vehicleParamsSchema, "params"),
  validate(getVehicleStatusSchema, "query"),
  vehicleController.getVehicleStatus
);

export { router as vehicleRoutes };
