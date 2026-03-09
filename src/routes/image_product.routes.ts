import { Router } from "express";
import { ImageProductController } from "../controllers/image_product.controller";
import { authRequired, adminRequired } from "../middlewares/auth.middleware";
import { upload, uploadToCloudinary } from "../middlewares/cloudinary.middleware";

const router = Router();
const imageController = new ImageProductController();

// GET: Obtener todas las Imagenes
router.get("/", imageController.getAll);

// GET: Obtener una Imagen por ID
router.get("/:id", imageController.getById);

// POST: Crear una Imagen
router.post(
  "/product/:id",
  authRequired,
  adminRequired,
  upload.array("images", 5),
  uploadToCloudinary,
  imageController.create,
);

// PUT: Actualizar una Imagen
router.put(
  "/:id",
  authRequired,
  adminRequired,
  upload.array("images", 5),
  uploadToCloudinary,
  imageController.update,
);

// DELETE: Eliminar una Imagen
router.delete("/:id", authRequired, adminRequired, imageController.delete);

export default router;
