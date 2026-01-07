import { Router } from "express";
import { WineController } from "../controllers/wine.controller";
import { validateSchema } from "../middlewares/validator.middleware";
import { wineSchema } from "../schemas/product.schemas";
import { authRequired, adminRequired } from "../middlewares/auth.middleware";

const router = Router();
const wineController = new WineController();

// GET: Obtener todos los Vinos
router.get("/", wineController.getAll);

// GET: Obtener un Vino por ID
router.get("/:id", wineController.getByProductId);

// POST: Crear un Vino
router.post("/", authRequired, adminRequired, validateSchema(wineSchema), wineController.create);

// PUT: Actualizar un Vino
router.put("/:id", authRequired, adminRequired, wineController.update);

// DELETE: Eliminar un Vino
router.delete("/:id", authRequired, adminRequired, wineController.delete);

export default router;
