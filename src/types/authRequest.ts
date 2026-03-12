import { Request } from "express";
import { SafeUser } from "./user";

export interface AuthRequest extends Request {
  user: SafeUser;
}
