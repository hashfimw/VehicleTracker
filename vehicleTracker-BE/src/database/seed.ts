import fs from "fs/promises";
import path from "path";
import { db } from "../config/database";

async function runSeeds() {
  try {
    console.log("Starting database seeding...");

    const seedsDir = path.join(__dirname, "seeds");
    const files = await fs.readdir(seedsDir);
    const sqlFiles = files.filter((file) => file.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      console.log(`Running seed: ${file}`);
      const filePath = path.join(seedsDir, file);
      const sql = await fs.readFile(filePath, "utf-8");

      await db.query(sql);
      console.log(`✓ Seed ${file} completed`);
    }

    console.log("All seeds completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  runSeeds();
}

export { runSeeds };
