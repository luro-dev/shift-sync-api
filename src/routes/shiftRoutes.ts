import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  createShift,
  getUserShifts,
  updateUserShift,
} from "../controllers/shiftController";

export const shiftRouter = Router();

// Protects all shiftRouter endpoints
shiftRouter.use(authenticateToken);

shiftRouter.get("/", getUserShifts);
shiftRouter.post("/", createShift);
shiftRouter.put("/:id", updateUserShift);

export default shiftRouter;
