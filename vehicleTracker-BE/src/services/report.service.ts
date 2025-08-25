import { VehicleRepository } from "../repositories/vehicle.repository";
import { VehicleStatusRepository } from "../repositories/vehicle-status.repository";
import { ExcelUtil } from "../utils/excel.util";
import { VehicleReportData } from "../types/vehicle.types";
import { AppError } from "../middlewares/error.middleware";

export class ReportService {
  private vehicleRepository: VehicleRepository;
  private vehicleStatusRepository: VehicleStatusRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
    this.vehicleStatusRepository = new VehicleStatusRepository();
  }

  async generateReport(
    startDate: string,
    endDate: string,
    vehicleId?: number
  ): Promise<Buffer> {
    try {
      let vehicleIds: number[] = [];

      if (vehicleId) {
        const vehicle = await this.vehicleRepository.findById(vehicleId);
        if (!vehicle) {
          throw new AppError("Vehicle not found", 404);
        }
        vehicleIds = [vehicleId];
      } else {
        const { vehicles } = await this.vehicleRepository.findAll({
          page: 1,
          limit: 1000,
        });
        vehicleIds = vehicles.map((v) => v.id);
      }

      const statusData = await this.vehicleStatusRepository.findForReport(
        vehicleIds,
        startDate,
        endDate
      );

      const reportData: VehicleReportData[] = [];

      for (const { vehicleId: vId, statuses } of statusData) {
        const vehicle = await this.vehicleRepository.findById(vId);
        if (!vehicle) continue;

        const summary = await this.vehicleStatusRepository.getStatusSummary(
          vId,
          startDate,
          endDate
        );

        reportData.push({
          vehicle,
          statuses,
          summary,
        });
      }

      if (reportData.length === 0) {
        throw new AppError("No data found for the specified criteria", 404);
      }

      const excelBuffer = await ExcelUtil.generateVehicleReport(reportData);
      return excelBuffer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Report generation error:", error);
      throw new AppError("Failed to generate report", 500);
    }
  }

  async getReportData(
    startDate: string,
    endDate: string,
    vehicleId?: number
  ): Promise<VehicleReportData[]> {
    let vehicleIds: number[] = [];

    if (vehicleId) {
      const vehicle = await this.vehicleRepository.findById(vehicleId);
      if (!vehicle) {
        throw new AppError("Vehicle not found", 404);
      }
      vehicleIds = [vehicleId];
    } else {
      const { vehicles } = await this.vehicleRepository.findAll({
        page: 1,
        limit: 1000,
      });
      vehicleIds = vehicles.map((v) => v.id);
    }

    const statusData = await this.vehicleStatusRepository.findForReport(
      vehicleIds,
      startDate,
      endDate
    );

    const reportData: VehicleReportData[] = [];

    for (const { vehicleId: vId, statuses } of statusData) {
      const vehicle = await this.vehicleRepository.findById(vId);
      if (!vehicle) continue;

      const summary = await this.vehicleStatusRepository.getStatusSummary(
        vId,
        startDate,
        endDate
      );

      reportData.push({
        vehicle,
        statuses,
        summary,
      });
    }

    return reportData;
  }
}
