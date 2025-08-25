import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import { env, isDevelopment } from "./config/environment";
import { swaggerSpec } from "./config/swagger";
import { apiRoutes } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { apiRateLimit } from "./middlewares/rate-limit.middleware";
import { ResponseUtil } from "./utils/response.util";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: isDevelopment ? false : undefined,
      })
    );
    this.app.use(
      cors({
        origin: env.CORS_ORIGIN.split(","),
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use("/api/", apiRateLimit);

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(cookieParser());
    this.app.use(compression());

    if (isDevelopment) {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(morgan("combined"));
    }
  }

  private initializeRoutes(): void {
    this.app.get("/health", (req, res) => {
      ResponseUtil.success(
        res,
        {
          status: "OK",
          timestamp: new Date().toISOString(),
          environment: env.NODE_ENV,
        },
        "Service is healthy"
      );
    });

    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Vehicle Tracker API Documentation",
      })
    );

    this.app.use("/api", apiRoutes);
    this.app.get("/", (req, res) => {
      ResponseUtil.success(
        res,
        {
          message: "Vehicle Tracker API",
          version: "1.0.0",
          documentation: "/api-docs",
          health: "/health",
        },
        "Welcome to Vehicle Tracker API"
      );
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`API Documentation: http://localhost:${env.PORT}/api-docs`);
      console.log(`Health Check: http://localhost:${env.PORT}/health`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  }
}
