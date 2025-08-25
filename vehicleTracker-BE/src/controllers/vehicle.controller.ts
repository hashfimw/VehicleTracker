import { Request, Response, NextFunction } from "express";
import { VehicleService } from "../services/vehicle.service";
import { ResponseUtil } from "../utils/response.util";
import { VehicleStatusQuery } from "../types/vehicle.types";
import { PaginationQuery } from "../types/common.types";

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  getVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination: PaginationQuery & { search?: string } = req.query;
      const result = await this.vehicleService.getVehicles(pagination);

      ResponseUtil.successWithPagination(
        res,
        result.vehicles,
        result.pagination,
        "Vehicles retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id ?? "");
      const vehicle = await this.vehicleService.getVehicleById(id);

      ResponseUtil.success(res, vehicle, "Vehicle retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getVehicleStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const statusQuery: VehicleStatusQuery = {
        vehicleId: parseInt(req.params.id ?? ""),
        ...req.query,
      };

      const result = await this.vehicleService.getVehicleStatus(statusQuery);

      ResponseUtil.success(
        res,
        result,
        "Vehicle status retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  };
}
