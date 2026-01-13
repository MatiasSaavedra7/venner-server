import { Router, RequestHandler } from "express";
import { OrderController } from "../controllers/order.controller";
import { authRequired, adminRequired } from "../middlewares/auth.middleware";

const router = Router();
const orderController = new OrderController();

// POST: Crear una orden
router.post("/", authRequired, orderController.create as RequestHandler);

// GET: Obtener todas las ordenes (Admin)
router.get("/", authRequired, adminRequired, orderController.getAll as RequestHandler);

// GET: Obtener todas las ordenes del usuario autenticado
router.get("/my-orders", authRequired, orderController.getByCurrentUser as RequestHandler);

// GET: Obtener una orden por ID
router.get("/:id", authRequired, orderController.getById);

export default router;
