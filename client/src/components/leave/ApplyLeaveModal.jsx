import { X } from "lucide-react";
import React, { useState } from "react";

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to apply for leave:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Apply for Leave
            </h2>

            <p className="text-sm text-slate-400 mt-0.5">
              Submit your leave for approval
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Leave Type
              </label>

              <select
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Select leave type</option>
                <option value="SICK">Sick Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="ANNUAL">Annual Leave</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  min={minDate}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  min={minDate}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason
              </label>

              <textarea
                rows="4"
                required
                placeholder="Enter reason for leave..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none resize-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-5 py-2.5 rounded-lg disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Leave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;