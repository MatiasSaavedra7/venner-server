import bcrypt from "bcryptjs";
import { Pool } from "pg";
import {
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "../config";

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  port: Number(DB_PORT || "5432"),
  password: DB_PASSWORD,
  database: DB_NAME,
});

async function createAdmin() {
  const adminEmail: string = ADMIN_EMAIL as string;
  const adminPassword: string = ADMIN_PASSWORD as string;

  console.log("Creando usuario administrador...");

  try {
    // 1. Verificar si el usuario ya existe para evitar duplicados
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [adminEmail]
    );
    if (userExists.rows.length > 0) {
      console.log(
        `El usuario administrador con email '${adminEmail}' ya existe.`
      );
      return;
    }

    // 2. Hashear la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // 3. Insertar el nuevo usuario administrador en la base de datos
    const query = `
      INSERT INTO users (name, last_name, email, password, is_admin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, last_name, email, is_admin, created_at;
    `;
    const values = ["Administrador", "Venner", adminEmail, passwordHash, true];

    const result = await pool.query(query, values);

    console.log("Usuario administrador creado con éxito:");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error);
  } finally {
    // 4. Cerrar la conexión con la base de datos
    await pool.end();
  }
}

createAdmin();
