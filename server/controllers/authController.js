import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// login for employee/admin
export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and passwords are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const employee = await Employee.findOne({ userId: user._id })
      .select("isDeleted")
      .lean();
    if (employee?.isDeleted) {
      return res.status(401).json({ error: "account is deactivated" });
    }

    if (role_type === "admin" && user.role !== "ADMIN") {
      return res.status(401).json({ error: "not authorized as admin" });
    }

    if (role_type === "employee" && user.role !== "EMPLOYEE") {
      return res.status(401).json({ error: "not authorized as employee" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ user: payload, token });
  } catch (error) {
    return res.status(500).json({ error: "login failed" });
  }
};

// get sessions for employee/admin
export const session = (req, res) => {
  const session = req.session;
  return res.json({ user: session });
};

// change password for employee/admin
export const changePassword = async (req, res) => {
  try {
    const session = req.session;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required" });
    }
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res
        .status(400)
        .json({ error: "current password is required" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(session.userId, {
      password: hashed,
      $inc: { tokenVersion: 1 },
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to change password" });
  }
};