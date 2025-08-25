import { JWTUtil } from "../../utils/jwt.util";

describe("JWTUtil", () => {
  const mockPayload = {
    userId: 1,
    email: "test@example.com",
    role: "user",
  };

  describe("generateAccessToken and verifyAccessToken", () => {
    it("should generate and verify access token", () => {
      const token = JWTUtil.generateAccessToken(mockPayload);
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);

      const decoded = JWTUtil.verifyAccessToken(token);
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it("should throw error for invalid token", () => {
      expect(() => JWTUtil.verifyAccessToken("invalidToken")).toThrow(
        "Invalid access token"
      );
    });
  });

  describe("extractTokenFromHeader", () => {
    it("should extract token from valid Bearer header", () => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      const authHeader = `Bearer ${token}`;

      const extracted = JWTUtil.extractTokenFromHeader(authHeader);
      expect(extracted).toBe(token);
    });

    it("should return null for invalid header", () => {
      expect(JWTUtil.extractTokenFromHeader("")).toBeNull();
      expect(JWTUtil.extractTokenFromHeader("Invalid header")).toBeNull();
      expect(JWTUtil.extractTokenFromHeader(undefined)).toBeNull();
    });
  });
});
