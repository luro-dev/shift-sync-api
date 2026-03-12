import { AuthRequest } from "../types/authRequest";
import { Request, Response } from "express";
import { pool } from "../config/db";

export const createShift = async (req: Request, res: Response) => {
  const authRequest = req as AuthRequest;

  const {
    shift_date,
    shift_type,
    hourly_pay,
    hours_worked,
    credit_tips,
    cash_tips,
  } = req.body;
  const userId = authRequest.user.id;

  if (!shift_date || !shift_type || !hourly_pay || !hours_worked) {
    return res.status(400).json({ message: "Missing required shift details" });
  }

  try {
    const queryText = `
      INSERT INTO shifts (user_id, shift_date, shift_type, hourly_pay, hours_worked, credit_tips, cash_tips)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      authRequest.user.id,
      shift_date,
      shift_type,
      hourly_pay,
      hours_worked,
      credit_tips || 0,
      cash_tips || 0,
    ];

    const result = await pool.query(queryText, values);
    const newShift = result.rows[0];

    return res.status(201).json({
      message: "Shift created successfully",
      shift: newShift,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error saving shift" });
  }
};

/*

CREATE TABLE IF NOT EXISTS shifts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  shift_type VARCHAR(20),
  hourly_pay NUMERIC(10, 2) NOT NULL,
  hours_wored NUMERIC(4, 2) NOT NULL,
  credit_tips NUMERIC(10, 2) DEFAULT 0.00,
  cash_tips NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
*/
