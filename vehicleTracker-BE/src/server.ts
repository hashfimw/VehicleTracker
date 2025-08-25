import { App } from "./app";
import { db } from "./config/database";
import { env } from "./config/environment";

async function startServer() {
  try {
    const isDbConnected = await db.testConnection();
    if (!isDbConnected) {
      console.error("❌ Failed to connect to database");
      process.exit(1);
    }
    const app = new App();
    app.listen();
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  await db.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  await db.close();
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

startServer();
