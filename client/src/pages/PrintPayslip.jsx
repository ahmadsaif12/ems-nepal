import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/axios";
import Loading from "../components/Loading";
import { Printer } from "lucide-react";

const PrintPayslip = () => {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    api
      .get(`/payslips/${id}`)
      .then((res) => {
        if (isMounted) setPayslip(res.data.result || null);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loading />;

  if (error || !payslip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <p className="text-sm">Payslip not found</p>
      </div>
    );
  }

  const employee = payslip.employee;

  const basicSalary = payslip.basicSalary || 0;
  const allowances = payslip.allowances || 0;
  const deductions = payslip.deductions || 0;
  const netSalary =
    payslip.netSalary || basicSalary + allowances - deductions;

  const period = format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy");
  const generatedOn = format(new Date(), "dd MMM yyyy");

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden print:shadow-none print:ring-0 print:rounded-none">
        {/* Letterhead */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-200 mb-1">
                Payslip
              </p>
              <h1 className="text-2xl font-bold tracking-tight">
                {period}
              </h1>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium">
                PAID
              </span>
              <p className="text-[11px] text-indigo-200 mt-2">
                Generated {generatedOn}
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {/* Employee Information */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-8 pb-8 border-b border-dashed border-slate-200">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Employee Name
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {employee?.firstName} {employee?.lastName}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Position
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {employee?.position || "-"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {employee?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Pay Period
              </p>
              <p className="text-sm font-semibold text-slate-900">{period}</p>
            </div>
          </div>

          {/* Salary Breakdown */}
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Salary Breakdown
          </p>

          <div className="rounded-xl border border-slate-200 overflow-hidden mb-8">
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-600">Basic Salary</span>
                <span className="text-sm font-medium text-slate-900">
                  ${basicSalary.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-600">Allowances</span>
                <span className="text-sm font-medium text-emerald-600">
                  +${allowances.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-600">Deductions</span>
                <span className="text-sm font-medium text-rose-600">
                  -${deductions.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Net Salary highlight */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-50">
              <span className="text-sm font-semibold text-slate-900">
                Net Salary
              </span>
              <span className="text-lg font-bold text-indigo-600">
                ${netSalary.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            This is a system-generated payslip and does not require a signature.
          </p>
        </div>

        {/* Print Button */}
        <div className="text-center pb-8 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPayslip;