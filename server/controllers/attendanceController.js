import Attendance from "../models/Attendance";
import Employee from "../models/Employee";

// Clock in / out for employee
export const clockInOut = async (req, res) => {
  try {
    const session = req.session;

    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot clock in/out.",
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    const now = new Date();

    // CHECK IN
    if (!existing) {
      const isLate =
        now.getHours() > 9 ||
        (now.getHours() === 9 && now.getMinutes() > 0);

      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });

      return res.json({
        success: true,
        type: "Check in",
        data: attendance,
      });
    }
    // CHECK OUT

    if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();

      const diffMs = now.getTime() - checkInTime;
      const diffHours = diffMs / (1000 * 60 * 60);

      existing.checkOut = now;

      const workingHours = parseFloat(diffHours.toFixed(2));

      let dayType = "Half Day";

      if (workingHours >= 8) {
        dayType = "Full Day";
      } else if (workingHours >= 6) {
        dayType = "Three Quarter";
      } else {
        dayType = "Short Day";
      }

      existing.workingHours = workingHours;
      existing.dayType = dayType;

      await existing.save();

      return res.json({
        success: true,
        type: "Check out",
        data: existing,
      });
    }

    // Already checked out
    return res.json({
      success: true,
      type: "Already checked out",
      data: existing,
    });
  } catch (error) {
    console.error("Attendance error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

//get attendance

export const getAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      userId: req.session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated.",
      });
    }

    const attendance = await Attendance.find({
      employeeId: employee._id,
    })
      .sort({ date: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch attendance",
    });
  }
};