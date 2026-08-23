import express from "express";
import cors from "cors";
import "dotenv/config";
import  connectDB from "./config/db.js";
import  authRouter  from "./routes/authRoutes.js";
import  employeesRouter  from "./routes/employeeRoutes.js";
import  profileRouter  from "./routes/profileRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

// Route
app.get("/", (req, res) => {
  res.send("App server is running");
});

app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter)

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

await connectDB();

app.listen(PORT, () =>
  console.log(`App server running on port ${PORT}`)
);