import { Inngest } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveAppllication.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ems" });

//auto check for employee
const autoCheckOut = inngest.createFunction(
  { id: "auto-check-out", triggers: { event: "employee/check-out" } },

  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;
    // wait for 9 hours
    await step.sleepUntil(
      "wait-for-9-hours",
      new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
    );

    // get attendance data
    let attendance = await Attendance.findById(attendanceId);
    if (!attendance?.checkOut) {
      // get employee data
      const employee = await Employee.findById(employeeId);
      // sent reminder email
      await sendEmail({
        to: employee.email,
        subject: "Attendance Check-Out Reminder",
        body: `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 32px 0;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background-color: #2563eb; padding: 20px 24px;">
              <h1 style="margin: 0; font-size: 18px; color: #ffffff;">EMS - Attendance Reminder</h1>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 15px; color: #1f2937; margin: 0 0 12px;">Hi ${employee.firstName},</p>
              <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
                It looks like you haven't checked out yet for today. Please remember to mark your check-out
                on the EMS portal so your working hours are recorded correctly.
              </p>
              <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 20px;">
                If you don't check out within the next hour, your attendance will automatically be marked as
                <strong>Late / Half Day</strong>.
              </p>
              <a href="${process.env.CLIENT_URL || "#"}/attendance" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px;">
                Check Out Now
              </a>
            </div>
            <div style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">This is an automated message from the Employee Management System. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
        `
      });

      // after 10 hours , mark attendance as checkout out with status "late"
      await step.sleepUntil(
        "wait-for-1-hour",
        new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
      );
      attendance = await Attendance.findById(attendanceId);
      if (!attendance?.checkOut) {
        attendance.checkOut = new Date(
          new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000
        );
        attendance.workingHours = 4;
        attendance.dayType = "Half Day";
        attendance.status = "LATE";
        await attendance.save();
      }
    }
  }
);

//sent email to admin if admin doesnot take any actions on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder", triggers: { event: "leave/pending" } },

  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;
    // wait for 24 hours we will check status of leave application
    await step.sleepUntil(
      "wait-for-24-hours",
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    );

    // get leaveApplication data
    let leaveApplication = await LeaveApplication.findById(leaveApplicationId);
    if (leaveApplication?.status === "PENDING") {
      // get employee data
      const employee = await Employee.findById(leaveApplication.employeeId);

      // send reminder to admin to take action on leave application
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Leave Application Reminder - Action Required`,
        body: `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 32px 0;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background-color: #d97706; padding: 20px 24px;">
              <h1 style="margin: 0; font-size: 18px; color: #ffffff;">EMS - Pending Leave Application</h1>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 15px; color: #1f2937; margin: 0 0 12px;">Hi Admin,</p>
              <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
                A leave application from <strong>${employee.firstName} ${employee.lastName}</strong> has been
                pending for over 24 hours without any action.
              </p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 6px 0;">Employee</td>
                  <td style="font-size: 13px; color: #1f2937; padding: 6px 0; text-align: right;">${employee.firstName} ${employee.lastName}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 6px 0;">Department</td>
                  <td style="font-size: 13px; color: #1f2937; padding: 6px 0; text-align: right;">${employee.department || "-"}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 6px 0;">Status</td>
                  <td style="font-size: 13px; color: #d97706; padding: 6px 0; text-align: right;">Pending</td>
                </tr>
              </table>
              <a href="${process.env.CLIENT_URL || "#"}/admin/leaves/${leaveApplicationId}" style="display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px;">
                Review Application
              </a>
            </div>
            <div style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">This is an automated reminder from the Employee Management System.</p>
            </div>
          </div>
        </div>
        `
      });

      // after 10 hours , mark attendance as checkout out with status "late"
      await step.sleepUntil(
        "wait-for-1-hour",
        new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
      );
      leaveApplication = await LeaveApplication.findById(leaveApplicationId);
      if (leaveApplication?.status === "PENDING") {
        // escalate / take further action here
      }
    }
  }
);

// cron : check attendance at 9:00 am nepal time and email absent employees

const attendanceReminderCron = inngest.createFunction(
  { id: "attendance-reminder-cron", triggers: { cron: "TZ=Asia/Kathmandu 0 9 * * *" } }, // 9:00 AM Nepal time (5-field cron: minute hour day month weekday)

  async ({ event, step }) => {
    // step 1: get today's date range
    const today = await step.run("get-today-date", () => {
      const startUTC = new Date(
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" }) +
          "T00:00:00+05:30"
      );
      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
      return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() };
    });

    // step 2: get all active non deleted employees
    const activeEmployees = await step.run("get-active-employees", async () => {
      const employees = await Employee.find({
        isDeleted: false,
        employmentStatus: "ACTIVE",
      }).lean();
      return employees.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // step 3: get employee ids on approved leave today
    const onLeaveIds = await step.run("get-on-leave-ids", async () => {
      const leaves = await LeaveApplication.find({
        status: "APPROVED",
        startDate: { $lte: new Date(today.endUTC) },
        endDate: { $gte: new Date(today.startUTC) },
      }).lean();
      return leaves.map((l) => l.employeeId.toString());
    });

    // step 4: get employee ids who already checked in today
    const checkedInIds = await step.run("get-checked-in-ids", async () => {
      const attendances = await Attendance.find({
        date: {
          $gte: new Date(today.startUTC),
          $lte: new Date(today.endUTC),
        },
      }).lean();
      return attendances.map((a) => a.employeeId.toString());
    });

    // step 5: filter absent employees (not on leave and not checked in)
    const absentEmployees = activeEmployees.filter((emp) => {
      return !onLeaveIds.includes(emp._id) && !checkedInIds.includes(emp._id);
    });

    // step 6: send reminder emails
    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        const emailPromises = absentEmployees.map((emp) => {
          return sendEmail({
            to: emp.email,
            subject: `Attendance Reminder - Please Mark Your Attendance`,
            body: `
            <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 32px 0;">
              <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="background-color: #dc2626; padding: 20px 24px;">
                  <h1 style="margin: 0; font-size: 18px; color: #ffffff;">EMS - Attendance Reminder</h1>
                </div>
                <div style="padding: 24px;">
                  <p style="font-size: 15px; color: #1f2937; margin: 0 0 12px;">Hi ${emp.firstName},</p>
                  <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
                    We noticed that you haven't marked your attendance for today yet. If you're on leave and it
                    hasn't been recorded, please contact HR. Otherwise, kindly mark your check-in as soon as possible.
                  </p>
                  <a href="${process.env.CLIENT_URL || "#"}/attendance" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px;">
                    Mark Attendance
                  </a>
                </div>
                <div style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">This is an automated message from the Employee Management System. Please do not reply to this email.</p>
                </div>
              </div>
            </div>
            `
          });
        });
        await Promise.all(emailPromises);
      });
    }

    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  }
);

export const functions = [
  autoCheckOut,
  leaveApplicationReminder,
  attendanceReminderCron,
];