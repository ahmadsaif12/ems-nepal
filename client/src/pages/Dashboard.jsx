import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import AdminDashboard from '../components/AdminDashboard'
import EmployeeDashboard from '../components/EmployeeDashboard'
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const role = localStorage.getItem('userRole') || 'EMPLOYEE'
  useEffect(() => {
    setData(dummyEmployeeDashboardData)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [role])

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center p-6'>
        <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
      </div>
    )
  }

  return data?.role === 'ADMIN' ? (
    <AdminDashboard data={data} />
  ) : (
    <EmployeeDashboard data={data} />
  )
}

export default Dashboard
