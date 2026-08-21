import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import AdminDashboard from '../components/AdminDashboard'
import EmployeeDashboard from '../components/EmployeeDashboard'
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  //  switch between admin/employee testing
  const selectedData = dummyAdminDashboardData

  useEffect(() => {
    setData(selectedData)
    localStorage.setItem('userRole', selectedData.role)
    window.dispatchEvent(new Event('userRoleChanged'))
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

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