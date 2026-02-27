import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

// Load environment variables into process.env (must run before using them)
dotenv.config();

// Use environment port in production; fallback for local development
const PORT = Number(process.env.PORT) || 8000;

const app = express();

// Middleware: parse JSON request bodies so we can access req.body
app.use(express.json());

// Middleware: log HTTP requests for debugging during development
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Route working correctly! Yay!" });
});
