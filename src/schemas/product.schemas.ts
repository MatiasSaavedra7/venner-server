import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({
      message: "El nombre es obligatorio",
    })
    .min(1, "El nombre no puede estar vacío"),
  description: z
    .string({
      message: "La descripción debe ser un string",
    })
    .min(1, "La descripción no puede estar vacía"),
  price: z
    .number({
      message: "El precio es obligatorio",
    })
    .positive("El precio debe ser un número positivo"),
  stock: z
    .number({
      message: "El stock es obligatorio",
    })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  category_id: z
    .number({
      message: "El ID de la categoría es obligatorio",
    })
    .int("El ID de la categoría debe ser un número entero")
    .positive("El ID de la categoría debe ser un número positivo"),
  is_wine: z.boolean().default(false),
});

export const wineSchema = productSchema.extend({
  is_wine: z.literal(true),
  varietal: z
    .string({
      message: "La variedad es obligatoria",
    })
    .min(1, "La variedad no puede estar vacía"),
  winery: z
    .string({
      message: "La bodega es obligatoria",
    })
    .min(1, "La bodega no puede estar vacía"),
  country: z
    .string({
      message: "El país es obligatorio",
    })
    .min(1, "El país no puede estar vacío"),
  province: z.string().optional(),
  location: z.string().optional(),
});
