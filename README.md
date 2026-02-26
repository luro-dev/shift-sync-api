# ShiftSync API 📊

**ShiftSync** is a professional-grade backend API designed for hospitality workers to track, manage, and analyze fluctuating income. Built with a focus on data integrity and type safety.

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Raw SQL with `pg`)
- **Security:** Bcrypt & Express-Session
- **Tooling:** Morgan (Logging), Dotenv (Config), Nodemon

## 🚀 Key Features
- **Secure Authentication:** User registration and session-based login.
- **Shift Management:** Full CRUD operations for daily shifts (Hours, Cash/Card Tips, Hourly Wage).
- **Income Analytics:** Custom SQL queries for weekly/monthly earnings trends and averages.
- **Data Integrity:** Strict PostgreSQL schema with decimal precision for financial data.

## 🏗 Architecture
The project follows a modular MVC (Model-View-Controller) pattern:
- `src/routes`: API endpoint definitions.
- `src/controllers`: Business logic and request handling.
- `src/db`: Connection pooling and database schema management.
- `src/types`: Centralized TypeScript interfaces.
