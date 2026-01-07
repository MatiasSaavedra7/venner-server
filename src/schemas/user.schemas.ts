import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({
      message: "El nombre es requerido",
    })
    .min(1, "El nombre no puede estar vacio"),
  email: z.email("El email no es valido"),
  password: z
    .string({
      message: "La contraseña es requerida",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.email("El email no es valido"),
  password: z
    .string({ message: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});
