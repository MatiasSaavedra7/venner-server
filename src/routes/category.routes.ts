import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authRequired, adminRequired } from "../middlewares/auth.middleware";

const router = Router();
const categoryController = new CategoryController();

// GET: Obtener todas las Categorias
router.get("/", categoryController.getAll);

// GET: Obtener una Categoria por ID
router.get("/:id", categoryController.getById);

// POST: Crear una Categoria
router.post("/", authRequired, adminRequired, categoryController.create);

// PUT: Actualizar una Categoria
router.put("/:id", authRequired, adminRequired, categoryController.update);

// DELETE: Eliminar una Categoria
router.delete("/:id", authRequired, adminRequired, categoryController.delete);

export default router;
