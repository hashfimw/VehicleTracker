import { env } from "../config/environment";
import { JWTPayload } from "../types/auth.types";
const jwt = require("jsonwebtoken");

export class JWTUtil {
  static generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  static generateRefreshToken(
    payload: Omit<JWTPayload, "iat" | "exp">
  ): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  static extractTokenFromHeader(authorization?: string): string | null {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return null;
    }
    return authorization.substring(7);
  }
}
