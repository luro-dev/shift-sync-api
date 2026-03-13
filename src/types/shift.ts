export interface Shift {
  id: number;
  user_id: number;
  shift_date: string;
  shift_type: "lunch" | "dinner" | "double";
  hourly_pay: string;
  hours_worked: string;
  credit_tips: string;
  cash_tips: string;
  created_at: string;
}
