import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import dotenv from "dotenv";
import morgan from "morgan";
import { pool } from "./config/db";

dotenv.config();
const PORT = Number(process.env.PORT) || 8000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
