import express from "express";
import authRouter from "./routes/authRoutes";
import dotenv from "dotenv";
import morgan from "morgan";
import shiftRouter from "./routes/shiftRoutes";

dotenv.config();
const PORT = Number(process.env.PORT) || 8000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/shifts", shiftRouter);

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
