import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";
import { adminMw, protectMw } from "../middlewares/authMiddleware.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", protectMw, adminMw, createProduct);
productRouter.get("/:id", getProductById);

export default productRouter;
