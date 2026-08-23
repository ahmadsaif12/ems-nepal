import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// get employees
export const getEmployee = async (req, res) => {
  try {
    const { department, page, limit } = req.query;

    const where = { isDeleted: false };

    if (department) where.department = department;

    let query = Employee.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();

    if (page && limit) {
      query = query
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    }

    const employees = await query;

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId
        ? { email: emp.userId.email, role: emp.userId.role }
        : null,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch employees" });
  }
};

// create employees
export const createEmployee = async (req, res) => {
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
      joinedDate,
      password,
      role,
      bio,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const joined = new Date(joinedDate);
    if (!joinedDate || Number.isNaN(joined.getTime())) {
      return res.status(400).json({ error: "Invalid joined date" });
    }

    let user;
    try {
      user = await User.create({
        email,
        password: await bcrypt.hash(password, 10),
        role: role || "EMPLOYEE",
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      throw error;
    }

    try {
      const employee = await Employee.create({
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
        joinedDate: joined,
        bio: bio || "",
      });

      return res.status(201).json({ success: true, employee });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      console.error("Create employee error: ", error);
      return res.status(500).json({ error: "failed to create an employee" });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Create employee error: ", error);
    return res.status(500).json({ error: "failed to create an employee" });
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
    } = req.body;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeUpdate = {};

    if (firstName !== undefined) employeeUpdate.firstName = firstName;
    if (lastName !== undefined) employeeUpdate.lastName = lastName;
    if (email !== undefined) employeeUpdate.email = email;
    if (phone !== undefined) employeeUpdate.phone = phone;
    if (position !== undefined) employeeUpdate.position = position;
    if (department !== undefined) employeeUpdate.department = department;
    if (employmentStatus !== undefined) employeeUpdate.employmentStatus = employmentStatus;
    if (bio !== undefined) employeeUpdate.bio = bio;
    if (basicSalary !== undefined) employeeUpdate.basicSalary = Number(basicSalary) || 0;
    if (allowances !== undefined) employeeUpdate.allowances = Number(allowances) || 0;
    if (deductions !== undefined) employeeUpdate.deductions = Number(deductions) || 0;

    const userUpdate = {};

    if (email !== undefined) userUpdate.email = email;
    if (role !== undefined) userUpdate.role = role;
    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      userUpdate.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(employeeUpdate).length > 0) {
      await Employee.findByIdAndUpdate(id, employeeUpdate);
    }

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(employee.userId, userUpdate);
    }

    return res.json({ success: true });
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
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employee.isDeleted = true;
    employee.employmentStatus = "INACTIVE";
    await employee.save();

    await User.findByIdAndUpdate(employee.userId, {
      $inc: { tokenVersion: 1 },
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "failed to delete an employee" });
  }
};
