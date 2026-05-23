import express from "express";
import dotenv from "dotenv";
dotenv.config();
import products from "./data/products.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;
connectDB(); // connect DB
const app = express();

app.get("/", (_, res) => {
  res.send("Api is running.. ✅");
});

// fetch all products
app.get("/api/products", (_, res) => {
  res.json(products);
});

// fetch single product with _id
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT} ✅`);
});
