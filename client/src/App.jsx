import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginLanding from './pages/LoginLanding'
import Dashboard from './pages/Dashboard'
import Payslips from './pages/Payslips'
import PrintPayslip from './pages/PrintPayslip'
import Layout from './pages/Layout'
import Settings from './pages/Settings'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import LoginForm from './components/LoginForm'

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />}>
          <Route
            path="admin"
            element={<LoginForm role="admin" title="Admin Portal" subtitle="Manage your organization." />}
          />
          <Route
            path="employee"
            element={<LoginForm role="employee" title="Employee Portal" subtitle="Access your personal information." />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payslips" element={<Payslips />} />

          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leave" element={<Leave />} />
        </Route>
        <Route path="/print/payslips/:id" element={<PrintPayslip />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App