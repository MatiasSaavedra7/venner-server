import dotenv from "dotenv";

dotenv.config();

import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  // max: 20, // Maximo de 20 clientes inactivos en el Pool
  // idleTimeoutMillis: 3000, // Cerrar clientes inactivos despues de 30 segundos
})

// Listener para mostrar errores en el Pool
pool.on('error', (error) => {
  console.error('Error inesperado en el Pool de la base de datos: ', error);

  // Un error grave podria requerir el reinicio de la aplicacion
  // process.exit(-1);
})

console.log(`Conectado al pool de PostgreSQL en ${pool.options.host}:${pool.options.port}`);

// Función de consulta para facilitar el uso
export const query = (text: string, params: any[] = []) => {
  return pool.query(text, params);
}

export default pool;