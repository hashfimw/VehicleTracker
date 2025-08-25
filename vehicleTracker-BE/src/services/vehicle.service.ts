import { VehicleRepository } from "../repositories/vehicle.repository";
import { VehicleStatusRepository } from "../repositories/vehicle-status.repository";
import {
  VehicleWithLatestStatus,
  VehicleStatusQuery,
} from "../types/vehicle.types";
import { PaginationQuery, PaginationMeta } from "../types/common.types";
import { AppError } from "../middlewares/error.middleware";

export class VehicleService {
  private vehicleRepository: VehicleRepository;
  private vehicleStatusRepository: VehicleStatusRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
    this.vehicleStatusRepository = new VehicleStatusRepository();
  }

  async getVehicles(
    pagination: PaginationQuery & { search?: string }
  ): Promise<{
    vehicles: VehicleWithLatestStatus[];
    pagination: PaginationMeta;
  }> {
    const { page = 1, limit = 10, search } = pagination;
    const { vehicles, total } = await this.vehicleRepository.findAll({
      page,
      limit,
      search,
    });

    const paginationMeta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { vehicles, pagination: paginationMeta };
  }

  async getVehicleById(id: number): Promise<VehicleWithLatestStatus> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    const latestStatus =
      await this.vehicleStatusRepository.findLatestByVehicle(id);

    return {
      ...vehicle,
      latestStatus: latestStatus || undefined,
    };
  }

  async getVehicleStatus(query: VehicleStatusQuery) {
    const vehicle = await this.vehicleRepository.findById(query.vehicleId);
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    const statuses =
      await this.vehicleStatusRepository.findByVehicleAndDateRange(query);
    const summary = await this.vehicleStatusRepository.getStatusSummary(
      query.vehicleId,
      query.startDate,
      query.endDate
    );

    return {
      vehicle,
      statuses,
      summary,
    };
  }
}
