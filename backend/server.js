import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import productRouter from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 5000;
connectDB(); // connect DB
const app = express();

app.get("/", (_, res) => {
  res.send("Api is running.. ✅");
});

// routes
app.use("/api/products", productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT} ✅`);
});
