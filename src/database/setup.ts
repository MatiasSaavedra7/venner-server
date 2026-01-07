import { Client } from "pg";
import { DB_USER, DB_HOST, DB_PASSWORD, DB_PORT, DB_NAME } from "../config";

async function setup() {
  // Conectarse a la base de datos 'postgres' por defecto.
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: Number(DB_PORT || "5432"),
    database: "postgres", //  Conexion administrativa
  });

  try {
    await client.connect();

    // Verificamos si la base de datos ya existe
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Base de datos ${DB_NAME} creada correctamente.`);
    } else {
      console.log(`La base de datos "${DB_NAME}" ya existe.`);
    }
  } catch (error) {
    console.error("Error al crear la base de datos: ", error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

setup();
