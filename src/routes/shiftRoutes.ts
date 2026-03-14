import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  createShift,
  deleteShift,
  getUserShifts,
  updateShift,
} from "../controllers/shiftController";

export const shiftRouter = Router();

// Protects all shiftRouter endpoints
shiftRouter.use(authenticateToken);

shiftRouter.get("/", getUserShifts);
shiftRouter.post("/", createShift);
shiftRouter.put("/:id", updateShift);
shiftRouter.delete("/:id", deleteShift);

export default shiftRouter;
