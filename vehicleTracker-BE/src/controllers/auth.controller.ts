import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ResponseUtil } from "../utils/response.util";
import { LoginRequest, RefreshTokenRequest } from "../types/auth.types";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: LoginRequest = req.body;
      const result = await this.authService.login(loginData);

      ResponseUtil.success(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken }: RefreshTokenRequest = req.body;
      const result = await this.authService.refreshToken(refreshToken);

      ResponseUtil.success(res, result, "Token refreshed successfully");
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const user = await this.authService.getCurrentUser(userId);

      ResponseUtil.success(res, user, "User data retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
}
