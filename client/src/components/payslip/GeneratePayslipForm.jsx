import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const GeneratePayslipForm = ({ employees, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: "",
    allowances: 0,
    deductions: 0,
  });

  // Automatically select first employee
  // when employees are available
  useEffect(() => {
    if (employees?.length > 0 && !formData.employee) {
      setFormData((prev) => ({
        ...prev,
        employee: employees[0]._id || employees[0].id,
      }));
    }
  }, [employees, formData.employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setIsOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("Payslip data:", formData);

      if (onSuccess) {
        await onSuccess();
      }

      setFormData({
        employee:
          employees?.length > 0
            ? employees[0]._id || employees[0].id
            : "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: "",
        allowances: 0,
        deductions: 0,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to generate payslip:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Payslip button
  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="btn-primary flex items-center gap-2"
      >
        Generate Payslip
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
      {/* Modal */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-800">
            Generate Monthly Payslip
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Employee */}
          <div className="mb-3">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Employee
            </label>

            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              required
              className="input-field w-full text-xs"
            >
              <option value="">Select employee</option>

              {employees?.map((employee) => (
                <option
                  key={employee._id || employee.id}
                  value={employee._id || employee.id}
                >
                  {employee.firstName} {employee.lastName}
                  {employee.position
                    ? ` (${employee.position})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Month */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Month
              </label>

              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="input-field w-full text-xs"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Year
              </label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="2000"
                max="2100"
                className="input-field w-full text-xs"
              />
            </div>
          </div>

          {/* Basic Salary */}
          <div className="mb-3">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Basic Salary
            </label>

            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
              min="0"
              placeholder="50000"
              className="input-field w-full text-xs"
            />
          </div>

          {/* Allowances + Deductions */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {/* Allowances */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Allowances
              </label>

              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                min="0"
                className="input-field w-full text-xs"
              />
            </div>

            {/* Deductions */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Deductions
              </label>

              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                min="0"
                className="input-field w-full text-xs"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslipForm;