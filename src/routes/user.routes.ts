import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authRequired, guestRequired } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validator.middleware";
import { registerSchema, loginSchema } from "../schemas/user.schemas";

const router = Router();
const userController = new UserController();

// POST: Registrar Usuario
router.post("/register", guestRequired, validateSchema(registerSchema), userController.register);

// POST: Login Usuario
router.post("/login", guestRequired, validateSchema(loginSchema), userController.login);

// POST: Logout Usuario
router.post("/logout", authRequired, userController.logout);

// GET: Profile Usuario (Ruta Protegida)
router.get("/profile", authRequired, userController.profile);

// GET: Verify Token
router.get("/verify-token", authRequired, userController.verifyToken);

export default router;