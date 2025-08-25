import { UserResponse } from "./user.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
