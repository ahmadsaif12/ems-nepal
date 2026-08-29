import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import PayslipList from "../components/payslip/PayslipList";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast"; 

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await api.get("/payslips");
      setPayslips(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load payslips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    if (!isAdmin) return;

    api
      .get("/employees")
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setEmployees(list.filter((e) => !e.isDeleted));
      })
      .catch(() => {
        toast.error("Failed to load employees");
      });
  }, [isAdmin]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Left Side - Title */}
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Generate and manage employee payslips"
              : "Your payslip history"}
          </p>
        </div>

        {/* Right Side - Button */}
        {isAdmin && (
          <GeneratePayslipForm employees={employees} onSuccess={fetchPayslips} />
        )}
      </div>

      {/* Payslip List */}
      <PayslipList payslips={payslips} isAdmin={isAdmin} />
    </div>
  );
};

export default Payslips;