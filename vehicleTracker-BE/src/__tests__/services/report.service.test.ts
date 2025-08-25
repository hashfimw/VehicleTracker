import { ReportService } from "../../services/report.service";
import { VehicleRepository } from "../../repositories/vehicle.repository";
import { VehicleStatusRepository } from "../../repositories/vehicle-status.repository";
import { AppError } from "../../middlewares/error.middleware";

jest.mock("../../repositories/vehicle.repository");
jest.mock("../../repositories/vehicle-status.repository");
jest.mock("../../utils/excel.util");

describe("ReportService", () => {
  let reportService: ReportService;
  let mockVehicleRepository: jest.Mocked<VehicleRepository>;
  let mockVehicleStatusRepository: jest.Mocked<VehicleStatusRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    reportService = new ReportService();
    mockVehicleRepository = jest.mocked(new VehicleRepository());
    mockVehicleStatusRepository = jest.mocked(new VehicleStatusRepository());
    (reportService as any).vehicleRepository = mockVehicleRepository;
    (reportService as any).vehicleStatusRepository =
      mockVehicleStatusRepository;
  });

  describe("getReportData", () => {
    it("should return report data for specific vehicle", async () => {
      // Arrange
      const vehicleId = 1;
      const startDate = "2024-01-01";
      const endDate = "2024-01-31";

      const mockVehicle = {
        id: 1,
        licensePlate: "B1234ABC",
        brand: "Toyota",
        model: "Avanza",
        year: 2022,
        color: "White",
        fuelType: "gasoline" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockStatusData = [
        {
          vehicleId: 1,
          statuses: [
            {
              id: 1,
              vehicleId: 1,
              status: "trip" as const,
              latitude: -6.2,
              longitude: 106.8,
              speed: 50,
              fuelLevel: 75,
              engineTemp: 90,
              timestamp: new Date(),
              createdAt: new Date(),
            },
          ],
        },
      ];

      const mockSummary = {
        totalTrips: 5,
        totalIdleTime: 120,
        totalStoppedTime: 480,
        totalDistance: 150.5,
        averageSpeed: 45.2,
      };

      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
      mockVehicleStatusRepository.findForReport.mockResolvedValue(
        mockStatusData
      );
      mockVehicleStatusRepository.getStatusSummary.mockResolvedValue(
        mockSummary
      );

      // Act
      const result = await reportService.getReportData(
        startDate,
        endDate,
        vehicleId
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]?.vehicle).toEqual(mockVehicle);
      expect(result[0]?.summary).toEqual(mockSummary);
      expect(mockVehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
    });

    it("should throw error when vehicle not found", async () => {
      // Arrange
      const vehicleId = 999;
      const startDate = "2024-01-01";
      const endDate = "2024-01-31";

      mockVehicleRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        reportService.getReportData(startDate, endDate, vehicleId)
      ).rejects.toThrow(AppError);
      await expect(
        reportService.getReportData(startDate, endDate, vehicleId)
      ).rejects.toThrow("Vehicle not found");
    });
  });
});
