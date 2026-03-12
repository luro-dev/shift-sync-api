import bcrypt from "bcrypt";
import validator from "validator";
import type { Request, Response } from "express";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";
import { SafeUser, User } from "../types/user";
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

export const loginUser = async (
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

  try {
    const queryText = `SELECT * FROM users WHERE email = $1`;
    const queryResult = await pool.query<User>(queryText, [email]);
    const user = queryResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Uses <Omit> to remove hashed_password
    const payload: SafeUser = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
