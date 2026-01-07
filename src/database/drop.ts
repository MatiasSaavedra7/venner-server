import { Client } from "pg";
import { DB_USER, DB_HOST, DB_PASSWORD, DB_PORT, DB_NAME } from "../config";

async function drop() {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: Number(DB_PORT || "5432"),
    database: "postgres",
  });

  const targetDatabase = DB_NAME;

  try {
    await client.connect();
    console.log(`Advertencia: Intentando eliminar la base de datos "${targetDatabase}"...`);

    // WITH (FORCE) elimina todas las conexiones abiertas antes de borrar.
    await client.query(
      `DROP DATABASE IF EXISTS ${targetDatabase} WITH (FORCE)`
    );

    console.log(`Base de datos "${targetDatabase}" eliminada correctamente."`);
  } catch (error) {
    console.error("Error al eliminar la base de datos: ", error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

drop();
