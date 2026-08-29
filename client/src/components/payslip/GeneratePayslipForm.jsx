import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

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

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    if (!loading) setIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      employee:
        employees?.length > 0 ? employees[0]._id || employees[0].id : "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      basicSalary: "",
      allowances: 0,
      deductions: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      employeeId: formData.employee,
      month: Number(formData.month),
      year: Number(formData.year),
      basicSalary: Number(formData.basicSalary),
      allowances: Number(formData.allowances) || 0,
      deductions: Number(formData.deductions) || 0,
    };

    try {
      await api.post("/payslips", data);

      if (onSuccess) {
        await onSuccess();
      }

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to generate payslip:", error);
    } finally {
      setLoading(false);
    }
  };

  const netSalary =
    (Number(formData.basicSalary) || 0) +
    (Number(formData.allowances) || 0) -
    (Number(formData.deductions) || 0);

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
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Generate Monthly Payslip
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Fill in the details below to create a new payslip
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4">
          {/* Employee */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
              Employee
            </label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              required
              className="input-field w-full text-sm"
            >
              <option value="">Select employee</option>
              {employees?.map((employee) => (
                <option
                  key={employee._id || employee.id}
                  value={employee._id || employee.id}
                >
                  {employee.firstName} {employee.lastName}
                  {employee.position ? ` (${employee.position})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                Month
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="input-field w-full text-sm"
              >
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
                ].map((label, i) => (
                  <option key={i + 1} value={i + 1}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
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
                className="input-field w-full text-sm"
              />
            </div>
          </div>

          {/* Basic Salary */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
              min="0"
              placeholder="50,000"
              className="input-field w-full text-sm"
            />
          </div>

          {/* Allowances + Deductions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                Allowances
              </label>
              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                min="0"
                className="input-field w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                Deductions
              </label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                min="0"
                className="input-field w-full text-sm"
              />
            </div>
          </div>

          {/* Net Salary Preview */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 mb-5">
            <span className="text-xs font-medium text-slate-600">
              Net Salary
            </span>
            <span className="text-sm font-bold text-slate-900">
              ${netSalary.toLocaleString()}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Generating..." : "Generate Payslip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslipForm;