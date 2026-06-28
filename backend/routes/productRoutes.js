import { Router } from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getAllProducts,
  getProductById,
  getTopProducts,
  updateProduct,
} from "../controllers/productController.js";
import { adminMw, protectMw } from "../middlewares/authMiddleware.js";
import checkObjectId from "../middlewares/checkObjectIdMiddleware.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/top", getTopProducts);
productRouter.post("/", protectMw, adminMw, createProduct);
productRouter.get("/:id", checkObjectId, getProductById);
productRouter.put("/:id", protectMw, adminMw, checkObjectId, updateProduct);
productRouter.delete("/:id", protectMw, adminMw, checkObjectId, deleteProduct);
productRouter.post(
  "/:id/reviews",
  checkObjectId,
  protectMw,
  createProductReview,
);

export default productRouter;
