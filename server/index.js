import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import nodemailer from "nodemailer";
import cors from "cors";
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => console.log(err));

const app = express();
app.use(
  cors({
    origin: "*",

    credentials: true, // Allow cookies and other credentials to be sent with the request
  })
);

app.options("*", cors()); // Preflight request handling

app.use(express.json());
app.use(cookieParser());
app.listen(3002, () => {
  console.log("Server listening on 3002");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
});
