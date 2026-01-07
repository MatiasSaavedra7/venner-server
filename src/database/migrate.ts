import fs from "fs";
import path from "path";
import pool from "./config/db";

async function migrate() {
  const client = await pool.connect();

  try {
    console.log("Iniciando migraciones de la base de datos...");

    // 1. Crear una tabla de registro de migraciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations_log (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Leer los archivos de la carpeta migrations
    const migrationsDir = path.join(__dirname, "../../migrations");
    const files = fs.readdirSync(migrationsDir).sort(); //  Ordenar los archivos

    // 3. Obtener las migraciones ya aplicadas
    const { rows } = await client.query("SELECT name FROM migrations_log");
    const appliedMigrations = rows.map((row) => row.name);

    // 4. Ejecutar los archivos faltantes
    for (const file of files) {
      if (appliedMigrations.includes(file)) {
        continue; //  Saltar si ya se aplico
      }

      console.log("Aplicando migración: ", file);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8").trim();

      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO migrations_log (name) VALUES ($1)", [
          file,
        ]);
        await client.query("COMMIT");
        console.log(`${file} aplicada correctamente.`);
      } catch (error) {
        await client.query("ROLLBACK");
        console.error(`Error en ${file}: ${(error as Error).message}`);
        process.exit(1); // Detener todo si falla una migracion.
      }
    }

    console.log("Migraciones de la base de datos completadas correctamente.");
  } catch (error) {
    console.error(
      "Error durante las migraciones de la base de datos:",
      (error as Error).message
    );
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
