import { api, handleApiResponse } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { LoginRequest, LoginResponse, UserResponse } from "@/types";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return handleApiResponse(response);
  },

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return handleApiResponse(response);
  },

  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return handleApiResponse(response);
  },

  async logout(): Promise<void> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
