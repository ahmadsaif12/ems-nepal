import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import employeesRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import leaveRouter from "./routes/leaveRoutes.js";
import payslipRouter from "./routes/payslipsRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

// Ensure DB connection is established before handling requests.
// Cached so it doesn't reconnect on every serverless cold start call within the same instance.
let dbConnected = false;
app.use(async (req, res, next) => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Route
app.get("/", (req, res) => {
  res.send("App server is running");
});

app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/leave", leaveRouter);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));

// Only listen locally; Vercel invokes the exported app directly as a serverless function.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`App server running on port ${PORT}`));
}

export default app;