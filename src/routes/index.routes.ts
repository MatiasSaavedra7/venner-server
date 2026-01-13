import { Router } from "express";

const router = Router();

import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import imageProductRoutes from "./image_product.routes";
import wineRoutes from "./wine.routes";
import healthRoutes from "./health.routes";
import orderRoutes from "./order.routes";

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/images", imageProductRoutes);
router.use("/wines", wineRoutes);
router.use("/orders", orderRoutes);

export default router;
