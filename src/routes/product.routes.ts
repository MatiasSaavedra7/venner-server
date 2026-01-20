import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validateSchema } from "../middlewares/validator.middleware";
import { productSchema } from "../schemas/product.schemas";
import { authRequired, adminRequired } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();

// GET: Obtener todos los Productos
router.get("/", productController.getAll);

// GET: Obtener un Producto por ID
router.get("/:id", productController.getById);

// POST: Crear un Producto
router.post("/", authRequired, adminRequired, validateSchema(productSchema), productController.create);

// PUT: Actualizar un Producto
router.put("/:id", authRequired, adminRequired, validateSchema(productSchema), productController.update);

// DELETE: Eliminar un Producto
router.delete("/:id", authRequired, adminRequired, productController.delete);

export default router;
