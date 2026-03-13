import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  createShift,
  getUserShifts,
  updateShift,
} from "../controllers/shiftController";

export const shiftRouter = Router();

// Protects all shiftRouter endpoints
shiftRouter.use(authenticateToken);

shiftRouter.get("/", getUserShifts);
shiftRouter.post("/", createShift);
shiftRouter.put("/:id", updateShift);

export default shiftRouter;
