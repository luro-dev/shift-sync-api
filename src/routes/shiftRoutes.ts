import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { createShift } from "../controllers/shiftController";

export const shiftRouter = Router();

// Protects all shiftRouter endpoints
shiftRouter.use(authenticateToken);
shiftRouter.post("/addShift", createShift);

export default shiftRouter;
