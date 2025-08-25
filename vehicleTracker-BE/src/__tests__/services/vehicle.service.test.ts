import { VehicleService } from "../../services/vehicle.service";
import { VehicleRepository } from "../../repositories/vehicle.repository";
import { VehicleStatusRepository } from "../../repositories/vehicle-status.repository";
import { AppError } from "../../middlewares/error.middleware";

jest.mock("../../repositories/vehicle.repository");
jest.mock("../../repositories/vehicle-status.repository");

describe("VehicleService", () => {
  let vehicleService: VehicleService;
  let mockVehicleRepository: jest.Mocked<VehicleRepository>;
  let mockVehicleStatusRepository: jest.Mocked<VehicleStatusRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    vehicleService = new VehicleService();
    mockVehicleRepository = jest.mocked(new VehicleRepository());
    mockVehicleStatusRepository = jest.mocked(new VehicleStatusRepository());
    (vehicleService as any).vehicleRepository = mockVehicleRepository;
    (vehicleService as any).vehicleStatusRepository =
      mockVehicleStatusRepository;
  });

  describe("getVehicles", () => {
    it("should return paginated vehicles", async () => {
      // Arrange
      const mockVehicles = [
        {
          id: 1,
          licensePlate: "B1234ABC",
          brand: "Toyota",
          model: "Avanza",
          year: 2022,
          color: "White",
          fuelType: "gasoline" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockTotal = 1;

      mockVehicleRepository.findAll.mockResolvedValue({
        vehicles: mockVehicles,
        total: mockTotal,
      });

      // Act
      const result = await vehicleService.getVehicles({ page: 1, limit: 10 });

      // Assert
      expect(result.vehicles).toEqual(mockVehicles);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe("getVehicleById", () => {
    it("should return vehicle with latest status", async () => {
      // Arrange
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

      const mockStatus = {
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
      };

      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
      mockVehicleStatusRepository.findLatestByVehicle.mockResolvedValue(
        mockStatus
      );

      // Act
      const result = await vehicleService.getVehicleById(1);

      // Assert
      expect(result).toEqual({
        ...mockVehicle,
        latestStatus: mockStatus,
      });
    });

    it("should throw error when vehicle not found", async () => {
      // Arrange
      mockVehicleRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(vehicleService.getVehicleById(1)).rejects.toThrow(AppError);
      await expect(vehicleService.getVehicleById(1)).rejects.toThrow(
        "Vehicle not found"
      );
    });
  });
});
