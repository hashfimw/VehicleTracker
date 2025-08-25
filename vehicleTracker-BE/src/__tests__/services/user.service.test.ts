import { UserService } from "../../services/user.service";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordUtil } from "../../utils/password.util";
import { AppError } from "../../middlewares/error.middleware";

jest.mock("../../repositories/user.repository");
jest.mock("../../utils/password.util");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
    mockUserRepository = jest.mocked(new UserRepository());
    (userService as any).userRepository = mockUserRepository;
  });

  describe("createUser", () => {
    const mockUserData = {
      email: "test@example.com",
      password: "password123",
      fullName: "Test User",
      role: "user" as const,
    };

    const mockCreatedUser = {
      id: 1,
      email: "test@example.com",
      fullName: "Test User",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should create user successfully", async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (PasswordUtil.hash as jest.Mock).mockResolvedValue("hashedPassword");
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await userService.createUser(mockUserData);

      // Assert
      expect(result).toEqual(mockCreatedUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(PasswordUtil.hash).toHaveBeenCalledWith("password123");
    });

    it("should throw error if user already exists", async () => {
      // Arrange
      const existingUser = { ...mockCreatedUser, password: "hashedPassword" };
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(mockUserData)).rejects.toThrow(
        AppError
      );
      await expect(userService.createUser(mockUserData)).rejects.toThrow(
        "User with this email already exists"
      );
    });
  });

  describe("getUserById", () => {
    it("should return user when found", async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById(1);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw error when user not found", async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(1)).rejects.toThrow(AppError);
      await expect(userService.getUserById(1)).rejects.toThrow(
        "User not found"
      );
    });
  });
});
