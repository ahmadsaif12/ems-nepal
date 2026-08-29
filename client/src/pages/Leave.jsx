import React, { useCallback, useEffect, useState } from "react";
import {
  PlusIcon,
  ThermometerIcon,
  UmbrellaIcon,
  PalmtreeIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import LeaveHistory from "../components/leave/LeaveHistory";
import ApplyLeaveModal from "../components/leave/ApplyLeaveModal";
import api from "../api/axios";

const Leave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [accountDeleted, setAccountDeleted] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/leave");
      setLeaves(res.data.data || []);
      if (res.data.employee?.isDeleted) {
        setAccountDeleted(true);
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleLeaveSuccess = () => {
    setShowModal(false);
    fetchLeaves();
  };

  if (loading) {
    return <Loading />;
  }

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "APPROVED"
  );

  const sickCount = approvedLeaves.filter(
    (leave) => leave.type === "SICK"
  ).length;

  const casualCount = approvedLeaves.filter(
    (leave) => leave.type === "CASUAL"
  ).length;

  const annualCount = approvedLeaves.filter(
    (leave) => leave.type === "ANNUAL"
  ).length;

  const leaveStats = [
    {
      label: "Sick Leave",
      value: sickCount,
      icon: ThermometerIcon,
    },
    {
      label: "Casual Leave",
      value: casualCount,
      icon: UmbrellaIcon,
    },
    {
      label: "Annual Leave",
      value: annualCount,
      icon: PalmtreeIcon,
    },
  ];

  return (
    <div className="animate-fade-in p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8">
        <div className="ml-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Management
          </h1>

          <p className="text-gray-500 mt-2">
            {isAdmin
              ? "Manage leave applications"
              : "Your leave history and requests"}
          </p>
        </div>

        {!isAdmin && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center mr-1"
          >
            <PlusIcon className="w-4 h-4" />
            Apply for Leave
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {accountDeleted && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Your account has been deactivated.
        </div>
      )}

      {/* Leave Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {leaveStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>

                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>

                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave History */}
      <LeaveHistory
        leaves={leaves}
        isAdmin={isAdmin}
        onUpdate={fetchLeaves}
      />

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleLeaveSuccess}
      />
    </div>
  );
};

export default Leave;