import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { SafeUser } from "../types/user";
import { AuthRequest } from "../types/authRequest";

// explicit route level middleware to serve as a starting point to protect endpoints using jwt auth, uses the AuthRequest interface which extends Request and adds the user: SafeUser property that allows us to acces req.user without type errors in TS
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Forbidden: Invalid token" });

    (req as AuthRequest).user = decoded as SafeUser;

    next();
  });
};
