import bcrypt from "bcrypt";
import validator from "validator";
import type { Request, Response } from "express";
import { pool } from "../config/db";

export const registerUser = async (
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
    // hash with bcrypt
    // pool.query insert
    // res.status(201)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const queryText =
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id";
    const values = [email, hashedPassword];

    const result = await pool.query(queryText, values);

    return res.status(201).json({
      message: "User created",
      userId: result.rows[0].id,
    });
  } catch (err: any) {
    console.log("full err details", err);
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already in use" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
