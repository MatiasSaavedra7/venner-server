import fs from "fs";
import path from "path";
import pool from "./config/db";

async function seed() {
  const client = await pool.connect();

  try {
    console.log("Iniciando poblado de la base de datos...");

    const seedsDir = path.join(__dirname, "../../seeds");
    const files = fs.readdirSync(seedsDir).sort();

    await client.query("BEGIN");

    for (const file of files) {
      console.log(`Ejecutando seed: ${file}`);
      const sql = fs.readFileSync(path.join(seedsDir, file), "utf-8");
      await client.query(sql);
    }

    await client.query("COMMIT");
    console.log("Poblado de la base de datos completado correctamente.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error durante el poblado de la base de datos:", (error as Error).message);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();
