import { format } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import api from "../../api/axios";

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
  const [processing, setProcessing] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    try {
      setProcessing(`${id}-${status}`);
      await api.patch(`/leave/${id}`, { status });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update leave status:", error);
    } finally {
      setProcessing(null);
    }
  };

  const getLeaveId = (leave) => {
    return leave._id || leave.id;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "-";
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-modern w-full">
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}

              <th>Type</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>

              {isAdmin && <th className="text-center">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="text-center py-12 text-slate-600"
                >
                  No leave applications found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => {
                const leaveId = getLeaveId(leave);

                const approveProcessing =
                  processing === `${leaveId}-APPROVED`;

                const rejectProcessing =
                  processing === `${leaveId}-REJECTED`;

                return (
                  <tr key={leaveId}>
                    {/* Employee */}
                    {isAdmin && (
                      <td className="text-slate-900">
                        {leave.employee?.firstName || "-"}{" "}
                        {leave.employee?.lastName || ""}
                      </td>
                    )}

                    {/* Leave Type */}
                    <td>
                      <span className="badge bg-slate-100 text-slate-600">
                        {leave.type || "-"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </td>

                    {/* Reason */}
                    <td className="max-w-xs truncate text-slate-500">
                      {leave.reason || "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${
                          leave.status === "APPROVED"
                            ? "badge-success"
                            : leave.status === "REJECTED"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                      >
                        {leave.status || "PENDING"}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <td>
                        {leave.status === "PENDING" && (
                          <div className="flex justify-center gap-2">
                            {/* Approve */}
                            <button
                              type="button"
                              disabled={!!processing}
                              onClick={() =>
                                handleStatusUpdate(leaveId, "APPROVED")
                              }
                              className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              {approveProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>

                            {/* Reject */}
                            <button
                              type="button"
                              disabled={!!processing}
                              onClick={() =>
                                handleStatusUpdate(leaveId, "REJECTED")
                              }
                              className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                            >
                              {rejectProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;