import request from "supertest";
import { App } from "../../app";
import { db } from "../../config/database";

describe("Vehicle Integration Tests", () => {
  let app: App;
  let accessToken: string;

  beforeAll(async () => {
    app = new App();
    await db.testConnection();

    // Login to get access token
    const loginResponse = await request(app.app).post("/api/auth/login").send({
      email: "admin@vehicletracker.com",
      password: "password123",
    });

    accessToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await db.close();
  });

  describe("GET /api/vehicles", () => {
    it("should return paginated vehicles", async () => {
      const response = await request(app.app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ page: 1, limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toHaveProperty("page");
      expect(response.body.pagination).toHaveProperty("limit");
      expect(response.body.pagination).toHaveProperty("total");
      expect(response.body.pagination).toHaveProperty("totalPages");
    });

    it("should search vehicles by license plate", async () => {
      const response = await request(app.app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ search: "B1234" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it("should reject request without authentication", async () => {
      const response = await request(app.app).get("/api/vehicles");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/vehicles/:id/status", () => {
    it("should return vehicle status for specific date", async () => {
      const today = new Date().toISOString().split("T")[0];

      const response = await request(app.app)
        .get("/api/vehicles/1/status")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ date: today });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("vehicle");
      expect(response.body.data).toHaveProperty("statuses");
      expect(response.body.data).toHaveProperty("summary");
    });

    it("should return 404 for non-existent vehicle", async () => {
      const response = await request(app.app)
        .get("/api/vehicles/999/status")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ date: "2024-01-01" });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
