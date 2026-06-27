import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import { adminMw, protectMw } from "../middlewares/authMiddleware.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", protectMw, adminMw, createProduct);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", protectMw, adminMw, updateProduct);

export default productRouter;
