import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import productRouter from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

const PORT = process.env.PORT || 5000;
connectDB(); // connect DB

const app = express();

//! 🟢 middlewares
// Built-in body parser.
app.use(express.json());
// Built-in  urlencoded payloads parser (based on body-parser)
app.use(express.urlencoded({ extended: true }));
// To access req.cookies
app.use(cookieParser());

//! 🟢  routes
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

// paypal setup
app.get("/api/config/paypal", (req, res) =>
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  }),
);

// make uploads folder STATIC
const __dirname = path.resolve(); // curr. directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// prepare for PRODUCTION 🚀
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // any route that's not api will be redirected to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  // react dev-server, when not in PRODUCTION
  app.get("/", (_, res) => {
    res.send("API is running.. ✅");
  });
}

//! 🟢 error-handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server is running on PORT:${PORT}`);
});
