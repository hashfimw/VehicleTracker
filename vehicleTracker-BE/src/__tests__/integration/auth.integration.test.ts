import request from "supertest";
import { App } from "../../app";
import { db } from "../../config/database";

describe("Auth Integration Tests", () => {
  let app: App;

  beforeAll(async () => {
    app = new App();

    await db.testConnection();
  });

  afterAll(async () => {
    await db.close();
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(app.app).post("/api/auth/login").send({
        email: "admin@vehicletracker.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data.user.email).toBe("admin@vehicletracker.com");
    });

    it("should reject invalid credentials", async () => {
      const response = await request(app.app).post("/api/auth/login").send({
        email: "admin@vehicletracker.com",
        password: "wrongpassword123",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid email or password");
    });

    it("should validate required fields", async () => {
      const response = await request(app.app).post("/api/auth/login").send({
        email: "invalid-email",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("GET /api/auth/me", () => {
    let accessToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app.app)
        .post("/api/auth/login")
        .send({
          email: "admin@vehicletracker.com",
          password: "password123",
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it("should return current user data with valid token", async () => {
      const response = await request(app.app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("email");
      expect(response.body.data.email).toBe("admin@vehicletracker.com");
    });

    it("should reject request without token", async () => {
      const response = await request(app.app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
