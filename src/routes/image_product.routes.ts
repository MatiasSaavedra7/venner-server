import { Router } from "express";
import { ImageProductController } from "../controllers/image_product.controller";
import { authRequired, adminRequired } from "../middlewares/auth.middleware";


const router = Router();
const imageController = new ImageProductController();

// GET: Obtener todas las Imagenes
router.get("/", imageController.getAll);

// GET: Obtener una Imagen por ID
router.get("/:id", imageController.getById);

// POST: Crear una Imagen
router.post("/", authRequired, adminRequired, imageController.create);

// PUT: Actualizar una Imagen
router.put("/:id", authRequired, adminRequired, imageController.update);

// DELETE: Eliminar una Imagen
router.delete("/:id", authRequired, adminRequired, imageController.delete);

export default router;
