import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Payslip from "../models/Payslip.js";
import LeaveApplication from "../models/LeaveAppllication.js";
import bcrypt from "bcrypt";

// get employees
export const getEmployee = async (req, res) => {
  try {
    const { department } = req.query;
    const where = { isDeleted: { $ne: true } };
    if (department) where.department = department;
    const employees = await Employee.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId
        ? { email: emp.userId.email, role: emp.userId.role }
        : null,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get employees error: ", error);
    res.status(500).json({ message: error.message });
  }
};

// create employees
export const createEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let createdEmployee;

    await session.withTransaction(async () => {
      const hashed = await bcrypt.hash(password, 10);

      const [user] = await User.create(
        [{ email, password: hashed, role: role || "EMPLOYEE" }],
        { session }
      );

      const parsedJoinDate = joinDate ? new Date(joinDate) : new Date();
      const [employee] = await Employee.create(
        [
          {
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinedDate: parsedJoinDate,
            bio: bio || "",
          },
        ],
        { session }
      );

      createdEmployee = employee;
    });

    return res.status(201).json({ success: true, employee: createdEmployee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Create employee error: ", error);
    return res.status(500).json({ error: "failed to create an employee" });
  } finally {
    session.endSession();
  }
};

// update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      password,
      role,
      bio,
      employmentStatus,
      joinDate,
    } = req.body;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone,
        position,
        department: department || "Engineering",
        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        employmentStatus: employmentStatus || "ACTIVE",
        bio: bio || "",
        ...(joinDate ? { joinedDate: new Date(joinDate) } : {}),
      },
      { new: true }
    );

    const userUpdate = { email };

    if (role) userUpdate.role = role;
    if (password) userUpdate.password = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(employee.userId, userUpdate);

    return res.json({ success: true, employee: updatedEmployee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Update employee error: ", error);
    return res.status(500).json({ error: "failed to update an employee" });
  }
};

// delete employee
export const deleteEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).session(session);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await session.withTransaction(async () => {
      await Employee.deleteOne({ _id: employee._id }).session(session);
      await User.deleteOne({ _id: employee.userId }).session(session);
      await Attendance.deleteMany({ employeeId: employee._id }).session(session);
      await Payslip.deleteMany({ employeeId: employee._id }).session(session);
      await LeaveApplication.deleteMany({ employeeId: employee._id }).session(session);
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Delete employee error: ", error);
    return res.status(500).json({ error: "failed to delete an employee" });
  } finally {
    await session.endSession();
  }
};