import { UserRepository } from "../repositories/user.repository";
import { PasswordUtil } from "../utils/password.util";
import { JWTUtil } from "../utils/jwt.util";
import { LoginRequest, LoginResponse, JWTPayload } from "../types/auth.types";
import { AppError } from "../middlewares/error.middleware";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await PasswordUtil.verify(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const tokenPayload: Omit<JWTPayload, "iat" | "exp"> = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JWTUtil.generateAccessToken(tokenPayload);
    const refreshToken = JWTUtil.generateRefreshToken(tokenPayload);

    const userResponse = await this.userRepository.findByEmailForAuth(email);
    if (!userResponse) {
      throw new AppError("User data not found", 500);
    }

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError("User not found", 401);
      }
      const tokenPayload: Omit<JWTPayload, "iat" | "exp"> = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = JWTUtil.generateAccessToken(tokenPayload);

      return { accessToken };
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
}
