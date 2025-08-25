import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./environment";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle Tracker API",
      version: "1.0.0",
      description:
        "API documentation for Vehicle Tracker Dashboard application",
      contact: {
        name: "API Support",
        email: "support@vehicletracker.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
      {
        url: "https://your-domain.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            fullName: {
              type: "string",
              description: "User full name",
            },
            role: {
              type: "string",
              enum: ["admin", "user"],
              description: "User role",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Vehicle: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Vehicle ID",
            },
            licensePlate: {
              type: "string",
              description: "Vehicle license plate",
            },
            brand: {
              type: "string",
              description: "Vehicle brand",
            },
            model: {
              type: "string",
              description: "Vehicle model",
            },
            year: {
              type: "integer",
              description: "Vehicle year",
            },
            color: {
              type: "string",
              description: "Vehicle color",
            },
            fuelType: {
              type: "string",
              enum: ["gasoline", "diesel", "electric", "hybrid"],
              description: "Vehicle fuel type",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        VehicleStatus: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Status ID",
            },
            vehicleId: {
              type: "integer",
              description: "Vehicle ID",
            },
            status: {
              type: "string",
              enum: ["trip", "idle", "stopped"],
              description: "Vehicle status",
            },
            latitude: {
              type: "number",
              description: "Latitude coordinate",
            },
            longitude: {
              type: "number",
              description: "Longitude coordinate",
            },
            speed: {
              type: "number",
              description: "Speed in km/h",
            },
            fuelLevel: {
              type: "number",
              description: "Fuel level percentage",
            },
            engineTemp: {
              type: "integer",
              description: "Engine temperature in Celsius",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Status timestamp",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Request success status",
            },
            message: {
              type: "string",
              description: "Response message",
            },
            data: {
              type: "object",
              description: "Response data",
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  description: "Current page",
                },
                limit: {
                  type: "integer",
                  description: "Items per page",
                },
                total: {
                  type: "integer",
                  description: "Total items",
                },
                totalPages: {
                  type: "integer",
                  description: "Total pages",
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Vehicles",
        description: "Vehicle and status endpoints",
      },
      {
        name: "Reports",
        description: "Report generation endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
