import bcrypt from "bcrypt";
import validator from "validator";
import type { Request, Response } from "express";
import { pool } from "../config/db";

const registerUser = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  email = email.trim();
  password = password.trim();

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email, (ex.. johndoe@aol.com" });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be greater than or equal to 6 characters",
    });
  }

  try {
  } catch (err) {}
};
