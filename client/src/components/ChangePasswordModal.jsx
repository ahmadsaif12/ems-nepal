import React, { useState } from "react";
import {
  Lock,
  X,
  Loader2,
} from "lucide-react";

const ChangePasswordModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const formData = new FormData(e.currentTarget);

      const currentPassword = formData.get("currentPassword");
      const newPassword = formData.get("newPassword");

      // Add your API request here
      console.log({
        currentPassword,
        newPassword,
      });

      setMessage({
        type: "success",
        text: "Password updated successfully.",
      });

      e.currentTarget.reset();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update password.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" />

            <h2 className="text-lg font-semibold text-slate-900">
              Change Password
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          {/* Message */}
          {message.text && (
            <div
              className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  message.type === "success"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />

              <span>{message.text}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Current Password
            </label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              New Password
            </label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 h-10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 h-10 flex items-center justify-center gap-2"
            >
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;