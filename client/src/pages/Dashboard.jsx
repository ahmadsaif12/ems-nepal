import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import AdminDashboard from '../components/AdminDashboard'
import EmployeeDashboard from '../components/EmployeeDashboard'
import api from "../api/axios";

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.error(err?.response?.data?.error?.message ?? err?.message)
      })
      .finally(() => {
        setLoading(false)
      })
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