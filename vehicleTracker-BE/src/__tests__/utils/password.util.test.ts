import { PasswordUtil } from "../../utils/password.util";

describe("PasswordUtil", () => {
  describe("validate", () => {
    it("should return true for valid password", () => {
      expect(PasswordUtil.validate("password123")).toBe(true);
      expect(PasswordUtil.validate("myPass456")).toBe(true);
      expect(PasswordUtil.validate("strongP@ss1")).toBe(true);
    });

    it("should return false for invalid password", () => {
      expect(PasswordUtil.validate("pass")).toBe(false); // Too short
      expect(PasswordUtil.validate("password")).toBe(false); // No number
      expect(PasswordUtil.validate("12345678")).toBe(false); // No letter
      expect(PasswordUtil.validate("")).toBe(false); // Empty
    });
  });

  describe("hash and verify", () => {
    it("should hash password and verify correctly", async () => {
      const password = "testPassword123";
      const hash = await PasswordUtil.hash(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // bcrypt hash length

      const isValid = await PasswordUtil.verify(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await PasswordUtil.verify("wrongPassword", hash);
      expect(isInvalid).toBe(false);
    });
  });
});
