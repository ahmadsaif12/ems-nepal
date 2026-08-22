import React, { useState } from "react";
import { User, Loader2, Save } from "lucide-react";

const ProfileForm = ({ initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      setMessage("Profile updated successfully.");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card w-full p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-5 border-b border-slate-100">
        <User className="w-5 h-5 text-slate-400" />

        <h2 className="text-base font-semibold text-slate-900">
          Public Profile
        </h2>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Form Content */}
      <div className="mt-6 space-y-5">

        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>

            <input
              type="text"
              disabled
              readOnly
              value={`${initialData?.firstName || ""} ${
                initialData?.lastName || ""
              }`}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
            />
          </div>

          {/* Email */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              disabled
              readOnly
              value={initialData?.email || ""}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* Position */}
        <div className="w-full md:w-[calc(50%-0.625rem)]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Position
          </label>

          <input
            type="text"
            disabled
            readOnly
            value={initialData?.position || ""}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bio
          </label>

          <textarea
            name="bio"
            disabled={initialData?.isDeleted}
            defaultValue={initialData?.bio || ""}
            placeholder="Write a brief bio..."
            rows={3}
            className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 resize-none outline-none ${
              initialData?.isDeleted
                ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                : "bg-white text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            }`}
          />

          <p className="text-xs text-slate-400 mt-2">
            This will be displayed on your profile
          </p>
        </div>

        {/* Deactivated */}
        {initialData?.isDeleted ? (
          <div className="pt-1">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
              <p className="text-rose-600 font-medium">
                Account Deactivated
              </p>

              <p className="text-sm text-rose-500 mt-1">
                You can no longer update your profile.
              </p>
            </div>
          </div>
        ) : (
          /* Save Button */
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto min-w-[140px] h-10 px-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}

              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;