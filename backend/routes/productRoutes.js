import { Router } from "express";
import products from "../data/products.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const productRouter = Router();

productRouter.get(
  "/",
  asyncHandler(async (_, res) => {
    const products = await Product.find({});
    res.json(products);
  }),
);

productRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error(`Resource not found!`);
    }
  }),
);

export default productRouter;
