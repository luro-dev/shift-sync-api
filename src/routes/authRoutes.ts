import { Router } from "express";
import { registerUser } from "../controllers/authController";
const authRouter = Router();

authRouter.post("/register", registerUser);

export default authRouter;
