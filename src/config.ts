import dotenv from "dotenv";
dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === null) {
    console.error(`Error: Falta la variable de entorno obligatoria: ${key}`);
    process.exit(1);
  }
  return value;
}

export const PORT = getEnv("PORT");
export const DB_HOST = getEnv("DB_HOST");
export const DB_USER = getEnv("DB_USER");
export const DB_PORT = parseInt(getEnv("DB_PORT"), 10);
export const DB_PASSWORD = getEnv("DB_PASSWORD");
export const DB_NAME = getEnv("DB_NAME");
export const TOKEN_SECRET = getEnv("TOKEN_SECRET");

export const ADMIN_EMAIL = getEnv("ADMIN_EMAIL");
export const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD");

export const FRONTEND_URL = getEnv("FRONTEND_URL");

if (isNaN(DB_PORT)) {
  console.error("Error: La variable de entorno DB_PORT debe ser un número.");
  process.exit(1);
}
