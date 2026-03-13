import { AuthRequest } from "../types/authRequest";
import { Request, Response } from "express";
import { pool } from "../config/db";
import { Shift } from "../types/shift";

export const createShift = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const {
    shift_date,
    shift_type,
    hourly_pay,
    hours_worked,
    credit_tips,
    cash_tips,
  } = req.body;
  const userId = authReq.user.id;

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
      authReq.user.id,
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

export const getUserShifts = async (
  req: Request,
  res: Response<{ message: string; shifts?: Shift[] }>,
) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const userId = authReq.user.id;

  try {
    const queryText = `
      SELECT * FROM shifts 
        WHERE user_id = $1
      ORDER BY shift_date DESC
    `;

    const result = await pool.query<Shift>(queryText, [userId]);

    const shifts = result.rows;

    return res
      .status(200)
      .json({ message: "Successfully obtained user shifts", shifts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error retrieving shifts" });
  }
};

export const updateShift = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const userId = authReq.user.id;
  const { id } = req.params;
  const {
    shift_date,
    shift_type,
    hourly_pay,
    hours_worked,
    credit_tips,
    cash_tips,
  } = req.body;

  try {
    const queryText = `
    UPDATE shifts 
    SET 
      shift_date = $1, 
      shift_type = $2, 
      hourly_pay = $3, 
      hours_worked = $4, 
      credit_tips = $5, 
      cash_tips = $6
    WHERE id = $7 AND user_id = $8
    RETURNING *;
  `;

    const values = [
      shift_date,
      shift_type,
      hourly_pay,
      hours_worked,
      credit_tips,
      cash_tips,
      id,
      userId,
    ];

    const result = await pool.query(queryText, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Shift not found or unauthorized" });
    }

    const updatedShift: Shift = result.rows[0];

    return res.status(200).json({
      message: "Shift updated successfully",
      updatedShift,
    });
  } catch (err) {}
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
