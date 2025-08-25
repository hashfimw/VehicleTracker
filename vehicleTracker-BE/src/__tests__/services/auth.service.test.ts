import { AuthService } from "../../services/auth.service";
import { UserRepository } from "../../repositories/user.repository";
import { PasswordUtil } from "../../utils/password.util";
import { JWTUtil } from "../../utils/jwt.util";
import { AppError } from "../../middlewares/error.middleware";

// Mock dependencies
jest.mock("../../repositories/user.repository");
jest.mock("../../utils/password.util");
jest.mock("../../utils/jwt.util");

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    mockUserRepository = jest.mocked(new UserRepository());
    (authService as any).userRepository = mockUserRepository;
  });

  describe("login", () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
      fullName: "Test User",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockUserResponse = {
      id: 1,
      email: "test@example.com",
      fullName: "Test User",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should login successfully with valid credentials", async () => {
      // Arrange
      const loginData = { email: "test@example.com", password: "password123" };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.findByEmailForAuth.mockResolvedValue(mockUserResponse);
      (PasswordUtil.verify as jest.Mock).mockResolvedValue(true);
      (JWTUtil.generateAccessToken as jest.Mock).mockReturnValue("accessToken");
      (JWTUtil.generateRefreshToken as jest.Mock).mockReturnValue(
        "refreshToken"
      );

      // Act
      const result = await authService.login(loginData);

      // Assert
      expect(result).toEqual({
        user: mockUserResponse,
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(PasswordUtil.verify).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
    });

    it("should throw error for invalid email", async () => {
      // Arrange
      const loginData = {
        email: "invalid@example.com",
        password: "password123",
      };
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(AppError);
      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error for invalid password", async () => {
      // Arrange
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword123",
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (PasswordUtil.verify as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(AppError);
      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid email or password"
      );
    });
  });

  describe("refreshToken", () => {
    it("should refresh token successfully", async () => {
      // Arrange
      const refreshToken = "validRefreshToken";
      const mockDecoded = {
        userId: 1,
        email: "test@example.com",
        role: "user",
      };
      const mockUser = {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (JWTUtil.verifyRefreshToken as jest.Mock).mockReturnValue(mockDecoded);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      (JWTUtil.generateAccessToken as jest.Mock).mockReturnValue(
        "newAccessToken"
      );

      // Act
      const result = await authService.refreshToken(refreshToken);

      // Assert
      expect(result).toEqual({ accessToken: "newAccessToken" });
      expect(JWTUtil.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    });

    it("should throw error for invalid refresh token", async () => {
      // Arrange
      const refreshToken = "invalidToken";
      (JWTUtil.verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      // Act & Assert
      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        AppError
      );
    });
  });
});
